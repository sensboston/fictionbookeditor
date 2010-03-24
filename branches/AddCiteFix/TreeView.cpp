#include "stdafx.h"
#include "resource.h"
#include "res1.h"

#include "utils.h"
#include "apputils.h"

#include "FBEView.h"
#include "FBDoc.h"
#include "TreeView.h"

// redrawing the tree is _very_ ugly visually, so we first build a copy and compare them
struct TreeNode {
  TreeNode    *parent,*next,*last,*child;
  CString     text;
  int	      img;
  MSHTML::IHTMLElement	*pos;
  TreeNode() : parent(0), next(0), child(0), last(0), img(0), pos(0) { }
  TreeNode(TreeNode *nn,const CString& s,int ii,MSHTML::IHTMLElement *pp) : parent(nn), next(0), last(0), child(0),
    text(s), img(ii), pos(pp)
  {
    if (pos)
      pos->AddRef();
  }
  ~TreeNode() {
    if (pos)
      pos->Release();
    TreeNode *q;
    for (TreeNode *n=child;n;n=q) {
      q=n->next;
      delete n;
    }
  }
  TreeNode *Append(const CString& s,int ii,MSHTML::IHTMLElement *p) {
    TreeNode *n=new TreeNode(this,s,ii,p);
    if (last) {
      last->next=n;
      last=n;
    } else
      last=child=n;
    return n;
  }
};

static bool  SearchUnder(CTreeItem& ret,CTreeItem ii,MSHTML::IHTMLElement *p) {
  CTreeItem   jj(ii.GetChild());
  while (!jj.IsNull()) {
    MSHTML::IHTMLElement    *n=(MSHTML::IHTMLElement *)jj.GetData();
    if (n && n->contains(p)) {
      ret=jj;
      if (jj.HasChildren())
	SearchUnder(ret,jj,p);
      return true;
    }
    jj=jj.GetNextSibling();
  }
  return false;
}

CTreeItem CTreeView::LocatePosition(MSHTML::IHTMLElement *p) {
  CTreeItem   ret(TVI_ROOT,this);
  if (GetCount()==0 || !p)
    return ret; // no items at all

  SearchUnder(ret,ret,p);

  return ret;
}

void  CTreeView::HighlightItemAtPos(MSHTML::IHTMLElement *p) {
  CTreeItem ii(LocatePosition(p));
  if (ii==m_last_lookup_item)
    return;
  m_last_lookup_item=ii;
  ClearSelection();
 
  if (ii!=TVI_ROOT) {
    SelectItem(ii);	
    EnsureVisible(ii);
  } else
    SelectItem(0);
}

static MSHTML::IHTMLElementPtr	FindTitleNode(MSHTML::IHTMLDOMNodePtr elem) {
  MSHTML::IHTMLDOMNodePtr node(elem->firstChild);


  _bstr_t   cls(MSHTML::IHTMLElementPtr(elem)->className);

  if ((bool)node && node->nodeType==1 && U::scmp(node->nodeName,L"DIV")==0) {
    _bstr_t   cls(MSHTML::IHTMLElementPtr(node)->className);
    if (U::scmp(cls,L"image")==0) {
      node=node->nextSibling;
      if (node->nodeType!=1 || U::scmp(node->nodeName,L"DIV"))
	return NULL;
      cls=MSHTML::IHTMLElementPtr(node)->className;
    }
    if (U::scmp(cls,L"title")==0)
      return MSHTML::IHTMLElementPtr(node);
  }
  return NULL;
}

static CString	FindTitle(MSHTML::IHTMLDOMNodePtr elem) {
  MSHTML::IHTMLElementPtr tn(FindTitleNode(elem));
  if (tn)
    return (const wchar_t *)tn->innerText;
  return CString();
}

static CString GetImageFileName(MSHTML::IHTMLDOMNodePtr elem)
{
	_bstr_t   cls(MSHTML::IHTMLElementPtr(elem)->className);
	if (U::scmp(cls,L"image") != 0)
		return L"";

	CString href(MSHTML::IHTMLElementPtr(elem)->getAttribute(L"href", 0));
	if(!href.GetLength())
		return L"";

	CString	name = href.Right(href.GetLength() - 1);
	return name;	
}

static void MakeNode(TreeNode *parent,MSHTML::IHTMLDOMNodePtr elem) {
  if (elem->nodeType!=1)
    return;
  MSHTML::IHTMLElementPtr   he(elem);
  _bstr_t		    nn(he->tagName);
  _bstr_t		    cn(he->className);
  if (U::scmp(nn,L"DIV")==0) {
    // at this point we are interested only in sections/subtitles/poems/stanzas
    int img=0;
    CString txt;
    if (U::scmp(cn,L"poem")==0 || U::scmp(cn,L"stanza")==0) {
      txt=FindTitle(elem);
      img=3;
    } 
	else if (U::scmp(cn,L"body")==0) {
      txt=AU::GetAttrCS(he,L"fbname");
      U::NormalizeInplace(txt);
      if (txt.IsEmpty())
	txt=FindTitle(elem);
      img=0;
    } else if (U::scmp(cn,L"section")==0) {
      txt=FindTitle(elem);
      img=0;
    } else if (U::scmp(cn,L"epigraph")==0 || U::scmp(cn,L"annotation")==0 ||
	       U::scmp(cn,L"history")==0 || U::scmp(cn,L"cite")==0)
    {
      img=0;
    } 
	// Modification by Pilgrim
	else if (U::scmp(cn,L"table")==0 || U::scmp(cn,L"tr")==0 || U::scmp(cn,L"th")==0 || U::scmp(cn,L"td")==0) {
		txt=FindTitle(elem);
		img=3;
	} 
	else if (U::scmp(cn,L"image")==0) {
		txt=GetImageFileName(elem);
		img=3;
	} 	
	else
	{
		elem=elem->firstChild;
		while ((bool)elem) 
		{
			MakeNode(parent,elem);
			elem=elem->nextSibling;
		}
		return;
	}      
    U::NormalizeInplace(txt);
    if (txt.IsEmpty())
      txt.Format(_T("<%s>"),(const TCHAR *)cn);
    parent=parent->Append(txt,img,he);
  } else if (U::scmp(nn,L"P")==0 && U::scmp(cn,L"subtitle")==0) {
    CString txt((const TCHAR *)he->innerText);
    U::NormalizeInplace(txt);
    if (txt.IsEmpty())
      txt=_T("<subtitle>");
    parent=parent->Append(txt,6,he);
  }
  elem=elem->firstChild;
  while ((bool)elem) {
    MakeNode(parent,elem);
    elem=elem->nextSibling;
  }
  return;
}

static TreeNode  *GetDocTree(MSHTML::IHTMLDocument2Ptr& view) {
  TreeNode	*root=new TreeNode();
  try {
    MakeNode(root,view->body);
  }
  catch (_com_error&) {
  }
  if (!root->child) {
    delete root;
    return NULL;
  }
  return root;
}

static void  CompareTreesAndSet(TreeNode *n,CTreeItem ii,bool& fDisableRedraw) {
  bool	fH1=ii==TVI_ROOT ? ii.m_pTreeView->GetCount()>0 : ii.HasChildren()!=0;
  // walk them one by one and check
  CTreeItem   nc=fH1 ? ii.GetChild() : CTreeItem(NULL,ii.m_pTreeView);
  TreeNode    *ic=n->child;
  CString     text;
  while (ic && nc) {
    int	  img1,img2;
    nc.GetImage(img1,img2);
    nc.GetText(text);
    if (text!=ic->text || img1!=ic->img) { // differ
      // copy the item here
      if (!fDisableRedraw) {
	ii.m_pTreeView->SetRedraw(FALSE);
	fDisableRedraw=true;
      }
      nc.SetImage(ic->img,ic->img);
      nc.SetText(ic->text);
    }
    MSHTML::IHTMLElement    *od=(MSHTML::IHTMLElement *)nc.GetData();
    if (od)
      od->Release();
    if (ic->pos)
      ic->pos->AddRef();
    nc.SetData((LPARAM)ic->pos);
    CompareTreesAndSet(ic,nc,fDisableRedraw);
    ic=ic->next;
    nc=nc.GetNextSibling();
  }
  CTreeItem next;
  if ((nc || ic) && !fDisableRedraw) {
    ii.m_pTreeView->SetRedraw(FALSE);
    fDisableRedraw=true;
  }
  while (nc) { // remove extra children, staring with ic
    next=nc.GetNextSibling();
    nc.Delete();
    nc=next;
  }
  while (ic) { // append children to ii
    nc=ii.AddTail(ic->text,ic->img);
    if (ic->pos)
      ic->pos->AddRef();
    nc.SetData((LPARAM)ic->pos);
    if (ic->child)
      CompareTreesAndSet(ic,nc,fDisableRedraw);
    ic=ic->next;
  }
}

void  CTreeView::GetDocumentStructure(MSHTML::IHTMLDocument2Ptr& view) {
  m_last_lookup_item=0;

  TreeNode  *root=GetDocTree(view);
  if (!root) {
    SetRedraw(FALSE);
    DeleteAllItems();
    SetRedraw(TRUE);
    return;
  }
  bool	fDisableRedraw=false;
  CompareTreesAndSet(root,CTreeItem(TVI_ROOT,this),fDisableRedraw);
  if (fDisableRedraw)
    SetRedraw(TRUE);
  delete root;
}

void  CTreeView::UpdateDocumentStructure(MSHTML::IHTMLDocument2Ptr& v,MSHTML::IHTMLDOMNodePtr node) {
  MSHTML::IHTMLElementPtr     ce(node);

  /*CTreeItem selected_item = GetFirstSelectedItem();
  MSHTML::IHTMLElementPtr selected_elem;
  if(!selected_item.IsNull() && selected_item.GetData())
  {
	  selected_elem = (MSHTML::IHTMLElement*)selected_item.GetData();
  }*/

  CTreeItem   ii(LocatePosition(ce));

  if (ii==TVI_ROOT) { // huh?
    GetDocumentStructure(v);
    return;
  }

  MSHTML::IHTMLElementPtr   jj((MSHTML::IHTMLElement *)ii.GetData());

  // shortcut for the most common situation
  // all changes confined to a P, which is not in the title
  if (U::scmp(jj->tagName,L"DIV")==0 && U::scmp(node->nodeName,L"P")==0) {
    MSHTML::IHTMLElementPtr   tn(FindTitleNode(jj));
    if (!(bool)tn || (tn!=ce && tn->contains(ce)!=VARIANT_TRUE))
      return;

	// если измнения произошли только в заголовке, то просто меняем текст заголовка
	bool b1 = tn==ce;
	VARIANT_BOOL b2 = tn->contains(ce);
	if ((bool)tn && (tn==ce || tn->contains(ce)==VARIANT_TRUE))
	{
		CString txt = (wchar_t*)tn->innerText;
		U::NormalizeInplace(txt);
		ii.SetText(txt);
		return;
	}
  }

  TreeNode		    *nn=new TreeNode;

  try
  {
	MakeNode(nn,jj);
  }
  catch(_com_error&){}
  
  bool	fDisableRedraw=false;
  // check the item itself
  CString text;
  int	  img1,img2;
  ii.GetImage(img1,img2);
  ii.GetText(text);
  if (text!=nn->child->text || img1!=nn->child->img) { // differ
    // copy the item here
    SetRedraw(FALSE);
    fDisableRedraw=true;
    ii.SetImage(nn->child->img,nn->child->img);
    ii.SetText(nn->child->text);
  }

  CompareTreesAndSet(nn->child,ii,fDisableRedraw);
  if (fDisableRedraw)
    SetRedraw(TRUE);

 /* if((bool)selected_elem)
  {
	  SelectElement(selected_elem);
  }*/
  delete nn;
}

BOOL CTreeView::PreTranslateMessage(MSG* pMsg)
{
  pMsg;
  return FALSE;
}

LRESULT CTreeView::OnCreate(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
  // "CTreeViewCtrl::OnCreate()"
  LRESULT lRet = DefWindowProc(uMsg, wParam, lParam);
  
  // "OnInitialUpdate"
  m_ImageList.CreateFromImage(IDB_STRUCTURE,16,32,RGB(255,0,255),IMAGE_BITMAP);
  SetImageList(m_ImageList,TVSIL_NORMAL);

  SetScrollTime(1);

  bHandled = TRUE;
  
  return lRet;
}

LRESULT CTreeView::OnDestroy(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
  SetImageList(NULL,TVSIL_NORMAL);
  m_ImageList.Destroy();
  
  // Say that we didn't handle it so that the treeview and anyone else
  //  interested gets to handle the message
  bHandled = FALSE;
  return 0;
}

LRESULT CTreeView::OnClick(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	bHandled = SetMultiSelection(wParam, lParam);
  // check if we are going to hit an item
  /*UINT	  flags=0;
  CTreeItem ii(HitTest(CPoint(LOWORD(lParam),HIWORD(lParam)),&flags));
  if (flags&TVHT_ONITEM && !ii.IsNull()) { // try to select and expand it
    CTreeItem	sel(GetSelectedItem());
    if (sel!=ii)
      ii.Select();
    if (!(ii.GetState(TVIS_EXPANDED)&TVIS_EXPANDED))
      ii.Expand();
    SetFocus();
  } //else*/
    //bHandled=FALSE;
  return 0;
}

LRESULT CTreeView::OnDblClick(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
  // check if we double-clicked an already selected item item
  UINT	  flags=0;
  CTreeItem ii(HitTest(CPoint(LOWORD(lParam),HIWORD(lParam)),&flags));
  if (flags&TVHT_ONITEM && !ii.IsNull() && ii==GetSelectedItem())
    ::SendMessage(m_main_window,WM_COMMAND,MAKELONG(0,IDN_TREE_CLICK),(LPARAM)m_hWnd);
  return 0;
}

static void RecursiveExpand(CTreeItem n,bool *fEnable) {
  for (CTreeItem   ch(n.GetChild());!ch.IsNull();ch=ch.GetNextSibling()) {
    if (!ch.HasChildren())
      continue;
    if (!(ch.GetState(TVIS_EXPANDED)&TVIS_EXPANDED)) {
      if (!*fEnable) {
	*fEnable=true;
	ch.GetTreeView()->SetRedraw(FALSE);
      }
      ch.Expand();
    }
    RecursiveExpand(ch,fEnable);
  }
}

LRESULT CTreeView::OnChar(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
  switch (wParam) {
  case VK_RETURN: // swallow
    break;
  case '*': // expand the entire tree
    if (GetCount()>0) {
      bool  fEnable=false;
      RecursiveExpand(CTreeItem(TVI_ROOT,this),&fEnable);
      if (fEnable)	 
	SetRedraw(TRUE);
    }
    break;
  default: // pass to control
    bHandled=FALSE;
  }
  bHandled=FALSE;
  return 0;
}

LRESULT CTreeView::OnKeyDown(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{  
  if (wParam==VK_RETURN)
    ::PostMessage(m_main_window,WM_COMMAND,MAKELONG(0,IDN_TREE_RETURN),(LPARAM)m_hWnd);

  if ( (wParam==VK_UP || wParam==VK_DOWN) && GetKeyState( VK_SHIFT )&0x8000)
	{
		// Initialize the reference item if this is the first shift selection
		if( !m_hItemFirstSel )
		{
			m_hItemFirstSel = GetSelectedItem();
			ClearSelection();
		}

		// Find which item is currently selected
		HTREEITEM hItemPrevSel = GetSelectedItem();

		HTREEITEM hItemNext;
		if ( wParam==VK_UP )
			hItemNext = GetPrevVisibleItem( hItemPrevSel );
		else
			hItemNext = GetNextVisibleItem( hItemPrevSel );

		if ( hItemNext )
		{
			// Determine if we need to reselect previously selected item
			BOOL bReselect =
				!( GetItemState( hItemNext, TVIS_SELECTED ) & TVIS_SELECTED );

			// Select the next item - this will also deselect the previous item
			SelectItem( hItemNext );

			// Reselect the previously selected item
			if ( bReselect )
				SetItemState( hItemPrevSel, TVIS_SELECTED, TVIS_SELECTED );
		}
		bHandled=TRUE;
		return 0;
	}
	else if( wParam >= VK_SPACE )
	{
		m_hItemFirstSel = NULL;
		ClearSelection();
	}
	
  
  bHandled=FALSE;
  return 0;
}

LRESULT CTreeView::OnBegindrag(int idCtrl, LPNMHDR mhdr, BOOL& bHandled)
{
	LPNMTREEVIEW pnmtv = (LPNMTREEVIEW) mhdr;
	
	m_move_from.m_hTreeItem = pnmtv->itemNew.hItem;	
	
	m_himlDrag = TreeView_CreateDragImage(*this, pnmtv->itemNew.hItem);
	ImageList_BeginDrag(this->m_himlDrag, 0, 0, 0);
	ImageList_DragEnter(*this, pnmtv->ptDrag.x,pnmtv->ptDrag.y);
    SetCapture();
	m_drag = true;
	bHandled = false;
	return 0;
}

LRESULT CTreeView::OnLButtonUp(UINT, WPARAM, LPARAM, BOOL& bHandled)
{
	if(m_drag)
	{
		EndDrag();
		::SendMessage(m_main_window,WM_COMMAND,MAKELONG(0,IDN_TREE_MOVE_ELEMENT),(LPARAM)m_hWnd);
	}
	bHandled = false;
	return 0;
}

LRESULT CTreeView::OnMouseMove(UINT, WPARAM, LPARAM lParam, BOOL& bHandled)
{
	if(m_drag)
	{
		POINTS Pos = MAKEPOINTS(lParam);
		POINT point;
		point.x = Pos.x;
		point.y = Pos.y;

		ImageList_DragMove(Pos.x, Pos.y);
		UINT		flags;
		CTreeItem	hitem(this->HitTest(point, &flags), this);		
		if (!hitem.IsNull())
		{
			if(IsDropChangePosition(flags, hitem))
			{		
				CImageList::DragShowNolock(FALSE);
				if(IsParent(m_move_from, hitem))
				{
					SetItemImage(m_move_to, m_drop_item_nimage, m_drop_item_nimage);	
					GetItemImage(hitem, m_drop_item_nimage, m_drop_item_nimage);
					m_insert_type = CTreeView::none;	
					SelectItem(hitem);
				}
                else if(flags & TVHT_ONITEMICON)
				{
					SetItemImage(m_move_to, m_drop_item_nimage, m_drop_item_nimage);
					GetItemImage(hitem, m_drop_item_nimage, m_drop_item_nimage);
					SetItemImage(hitem, m_drop_item_nimage + 1, m_drop_item_nimage + 1);
					m_insert_type = CTreeView::sibling;
					SelectItem(hitem);
				}
				else if(flags & TVHT_ONITEMLABEL)
				{
					SetItemImage(m_move_to, m_drop_item_nimage, m_drop_item_nimage);
					GetItemImage(hitem, m_drop_item_nimage, m_drop_item_nimage);
					SetItemImage(hitem, m_drop_item_nimage + 2, m_drop_item_nimage + 2);				
					m_insert_type = CTreeView::child;
					SelectItem(hitem);
				}
				else
				{
					SetItemImage(m_move_to, m_drop_item_nimage, m_drop_item_nimage);	
					GetItemImage(hitem, m_drop_item_nimage, m_drop_item_nimage);
					m_insert_type = CTreeView::none;										
				}
				m_move_to.m_hTreeItem = hitem;
				
				CImageList::DragShowNolock(TRUE);
			}
			else
			{
				//SetItemImage(m_move_to, m_drop_item_nimage, m_drop_item_nimage);
			}		
		}
	}
	
	bHandled = false;
	return 0;	
}

LRESULT CTreeView::OnRClick(UINT /*uMsg*/, WPARAM /*wParam*/, LPARAM lParam, BOOL& /*bHandled*/)
{
	if(m_drag)
	{
		EndDrag();
	}
	UINT flags = 0;
	CTreeItem htItem(HitTest(CPoint(LOWORD(lParam),HIWORD(lParam)),&flags), this);
	if(!htItem.GetState(TVIS_SELECTED))
	{
		ClearSelection();
		SelectItem(htItem);
	}
	SendMessage(WM_CONTEXTMENU, (WPARAM) m_hWnd, GetMessagePos());	
    return 0;
 }

LRESULT CTreeView::OnContextMenu(UINT /*uMsg*/, WPARAM wParam, LPARAM lParam, BOOL& /*bHandled*/)
{
	CPoint ptMousePos = (CPoint)lParam;
		
	// if Shift-F10
	if (ptMousePos.x == -1 && ptMousePos.y == -1)
	{
		ptMousePos = (CPoint)GetMessagePos();		
	}

	ScreenToClient(&ptMousePos);

	UINT uFlags;
	CTreeItem htItem(HitTest( ptMousePos, &uFlags ), this);

	if( htItem.IsNull() )
		return 0;

	//m_hActiveItem = htItem;

	HMENU menu;
	HMENU pPopup;

	// the font popup is stored in a resource
	menu = ::LoadMenu(_Module.m_hInst, MAKEINTRESOURCEW(IDR_DOCUMENT_TREE));
	pPopup = ::GetSubMenu(menu, 0);
	ClientToScreen(&ptMousePos);
	BOOL res = ::TrackPopupMenu(pPopup, TPM_LEFTALIGN, ptMousePos.x, ptMousePos.y, 0, *this, 0);
	int err = GetLastError();

	return 1;
}


bool CTreeView::IsDropChangePosition(UINT flags, HTREEITEM hitem)
{
	if(hitem != m_move_to.m_hTreeItem)
		return true;

	if(flags & TVHT_ONITEMICON) 
		if(m_insert_type != CTreeView::sibling)
			return true;
		else
			return false;

	if(flags & TVHT_ONITEMLABEL) 
		if (m_insert_type != CTreeView::child)
			return true;
		else
			return false;

	if (m_insert_type != CTreeView::none)
		return true;
	else
		return false;
}

bool CTreeView::IsParent(CTreeItem	parent, CTreeItem child)
{
	if(parent == child)
		return true;
	while((child = child.GetParent()) && !child.IsNull())
	{
        if(parent == child)
			return true;
	}
	return false;
}

bool CTreeView::IsSibling(CTreeItem	item, CTreeItem	sibling)
{
	return (IsOneOfNextSibling(item, sibling) || IsOneOfPrevSibling(item, sibling));
}

bool CTreeView::IsOneOfNextSibling(CTreeItem	item, CTreeItem	sibling)
{
	if(item == sibling)
		return true;
	while((sibling = sibling.GetNextSibling()) && !sibling.IsNull())
	{
        if(item == sibling)
			return true;
	}
	return false;
}
bool CTreeView::IsOneOfPrevSibling(CTreeItem	item, CTreeItem	sibling)
{
	if(item == sibling)
		return true;
	while((sibling = sibling.GetPrevSibling()), !sibling.IsNull())
	{
        if(item == sibling)
			return true;
	}
	return false;
}

void CTreeView::EndDrag()
{
	ImageList_DragLeave(*this);
	ImageList_EndDrag();
	ReleaseCapture();  	
    
	SetItemImage(m_move_to, m_drop_item_nimage, m_drop_item_nimage);
	SelectDropTarget(NULL);
	m_drag = false;	        			
}

LRESULT CTreeView::OnCut(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	// remove last selection
	SetItemState(m_move_from, 0, TVIS_CUT);
	HTREEITEM hitem = GetSelectedItem();
	m_move_from = hitem;
	SetItemState(hitem, TVIS_CUT, TVIS_CUT);	
	return 0;	
}
LRESULT CTreeView::OnPaste(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	// remove selection
	SetItemState(m_move_from, 0, TVIS_CUT);
	m_move_to = GetSelectedItem();
	m_insert_type = CTreeView::child;
	::SendMessage(m_main_window,WM_COMMAND,MAKELONG(0,IDN_TREE_MOVE_ELEMENT),(LPARAM)m_hWnd);
	return 0;
}
LRESULT CTreeView::OnView(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{	
	::SendMessage(m_main_window,WM_COMMAND,MAKELONG(0,IDN_TREE_VIEW_ELEMENT),(LPARAM)m_hWnd);
	return 0;
}

LRESULT CTreeView::OnViewSource(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	::SendMessage(m_main_window,WM_COMMAND,MAKELONG(0,IDN_TREE_VIEW_ELEMENT_SOURCE),(LPARAM)m_hWnd);
	return 0;
}

LRESULT CTreeView::OnDelete(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	::SendMessage(m_main_window,WM_COMMAND,MAKELONG(0,IDN_TREE_DELETE_ELEMENT),(LPARAM)m_hWnd);
	return 0;
}

LRESULT CTreeView::OnRight(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	//m_move_from = GetSelectedItem();
	
	// всех следующих братьев делаем своими чайлдами
	HTREEITEM from = GetSelectedItem();
	HTREEITEM item = GetSelectedItem();// = TreeView_GetNextSibling(*this, m_move_from);
	HTREEITEM prevItem = 0;
	while(item = TreeView_GetNextSibling(*this, item))
	{
		prevItem = item;
	}

	item = prevItem;

	m_move_to = GetSelectedItem();
	m_insert_type = CTreeView::child;
	while(item = TreeView_GetPrevSibling(*this, item))
	{
		if(prevItem == from)
			break;

		m_move_from = prevItem;
		::SendMessage(m_main_window,WM_COMMAND,MAKELONG(0,IDN_TREE_MOVE_ELEMENT),(LPARAM)m_hWnd);
		prevItem = item;
	}

	m_move_from = from;
	m_move_to = TreeView_GetPrevSibling(*this, m_move_from);

	if(m_move_to)
	{
		item = TreeView_GetPrevSibling(*this, m_move_from);
		if(!item || ! m_move_from)
			return 0;

		if(TreeView_GetChild(*this, item))
		{
			item = TreeView_GetChild(*this, item);
			while (item)
			{		
				m_move_to = item;
				item = TreeView_GetNextSibling(*this, item);		
			}
			m_insert_type = CTreeView::sibling;
		}
		else
		{
			m_move_to = item;
			m_insert_type = CTreeView::child;
		}
	}
	else
	{

	}
	
	::SendMessage(m_main_window,WM_COMMAND,MAKELONG(0,IDN_TREE_MOVE_ELEMENT),(LPARAM)m_hWnd);
	return 0;
}

LRESULT CTreeView::OnRightOne(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{	
	::SendMessage(m_main_window,WM_COMMAND,MAKELONG(0,IDN_TREE_MOVE_ELEMENT_ONE),(LPARAM)m_hWnd);
	/*HTREEITEM item = GetFirstSelectedItem();
	if(!item)
		return 0;

	do
	{
		MoveRightOne(item);		
	}while(item = GetNextSelectedItem(item));*/
	
	return 0;
}


LRESULT CTreeView::OnRightSmart(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	::SendMessage(m_main_window,WM_COMMAND,MAKELONG(0,IDN_TREE_MOVE_ELEMENT_SMART),(LPARAM)m_hWnd);
	return 0;
}

LRESULT CTreeView::OnLeftOne(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	::SendMessage(m_main_window,WM_COMMAND,MAKELONG(0,IDN_TREE_MOVE_LEFT_ONE),(LPARAM)m_hWnd);
	return 0;
}

LRESULT CTreeView::OnLeftWithChildren(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	::SendMessage(m_main_window,WM_COMMAND,MAKELONG(0,IDN_TREE_MOVE_LEFT),(LPARAM)m_hWnd);
	return 0;
}
LRESULT CTreeView::OnMerge(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	::SendMessage(m_main_window,WM_COMMAND,MAKELONG(0,IDN_TREE_MERGE),(LPARAM)m_hWnd);
	return 0;
}

LRESULT CTreeView::OnLeft(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	::SendMessage(m_main_window,WM_COMMAND,MAKELONG(0,IDN_TREE_MOVE_LEFT),(LPARAM)m_hWnd);
	/*m_move_from = GetSelectedItem();
	m_move_to = TreeView_GetParent(*this, m_move_from);
	m_insert_type = InsertType::sibling;
	::SendMessage(m_main_window,WM_COMMAND,MAKELONG(0,IDN_TREE_MOVE_ELEMENT),(LPARAM)m_hWnd);*/
	return 0;
}

bool CTreeView::SetMultiSelection(UINT nFlags, CPoint point)
{
	// Set focus to control if key strokes are needed.
	// Focus is not automatically given to control on lbuttondown

	//m_dwDragStart = GetTickCount();
	
	UINT flag;
	HTREEITEM hItem = HitTest( point, &flag );

	if(nFlags & MK_SHIFT)
	{
		// Shift key is down	

		// Initialize the reference item if this is the first shift selection
		if( !m_hItemFirstSel )
			m_hItemFirstSel = GetSelectedItem();

		// Select new item
		if( GetSelectedItem() == hItem )
			SelectItem( NULL );			// to prevent edit
//		OnLButtonDown(nFlags, point);

		if( m_hItemFirstSel )
		{
			SelectItems( m_hItemFirstSel, hItem, !(BOOL)(nFlags & MK_CONTROL));
			return true;
		}
	}
	else if(nFlags & MK_CONTROL )
	{
		// Control key is down
		if( hItem )
		{			
			// Toggle selection state
			UINT uNewSelState =
				GetItemState(hItem, TVIS_SELECTED) & TVIS_SELECTED ?
							0 : TVIS_SELECTED;

			// Get old selected (focus) item and state
			HTREEITEM hItemOld = GetSelectedItem();
			UINT uOldSelState  = hItemOld ?
					GetItemState(hItemOld, TVIS_SELECTED) : 0;

			// Select new item
			if( GetSelectedItem() == hItem )
			{
				SelectItem( NULL );		// to prevent edit				
			}
//			OnLButtonDown(nFlags, point);

			// Set proper selection (highlight) state for new item
			SelectItem(hItem);
			SetItemState(hItem, uNewSelState,  TVIS_SELECTED);

			// Restore state of old selected item
			if (hItemOld && hItemOld != hItem)
				SetItemState(hItemOld, uOldSelState, TVIS_SELECTED);

			m_hItemFirstSel = NULL;

			return true;
		}
	}
	else
	{
		// Normal - remove all selection and let default 
		// handler do the rest
		ClearSelection();
		//SelectItem(hItem);
		if(flag & TVHT_ONITEMICON || flag & TVHT_ONITEMLABEL)
			TreeView_SetItemState(*this, hItem, TVIS_SELECTED, TVIS_SELECTED);
		m_hItemFirstSel = NULL;
	}
	//		OnLButtonDown(nFlags, point);
	return false;
}

void CTreeView::ClearSelection()
{
	// This can be time consuming for very large trees 
	// and is called every time the user does a normal selection
	// If performance is an issue, it may be better to maintain 
	// a list of selected items
	for (CTreeItem hItem(GetRootItem(), this); hItem!=NULL; hItem=GetNextItem(hItem))
		if ( GetItemState( hItem, TVIS_SELECTED ) & TVIS_SELECTED )
			SetItemState( hItem, 0, TVIS_SELECTED );
}

// SelectItems	- Selects items from hItemFrom to hItemTo. Does not
//		- select child item if parent is collapsed. Removes
//		- selection from all other items
// hItemFrom	- item to start selecting from
// hItemTo	- item to end selection at.
BOOL CTreeView::SelectItems(HTREEITEM hItemFrom, HTREEITEM hItemTo, bool clearPrevSelection)
{
	HTREEITEM hItem = GetRootItem();

	// Clear selection upto the first item
	while ( hItem && hItem!=hItemFrom && hItem!=hItemTo )
	{
		hItem = GetNextVisibleItem( hItem );
		if(clearPrevSelection)
		{
			SetItemState( hItem, 0, TVIS_SELECTED );
		}
	}	

	if ( !hItem )
		return FALSE;	// Item is not visible

	SelectItem( hItemTo );

	// Rearrange hItemFrom and hItemTo so that hItemFirst is at top
	if( hItem == hItemTo )
	{
		hItemTo = hItemFrom;
		hItemFrom = hItem;
	}


	// Go through remaining visible items
	BOOL bSelect = TRUE;
	while ( hItem )
	{
		// Select or remove selection depending on whether item
		// is still within the range.
		SetItemState( hItem, bSelect ? TVIS_SELECTED : 0, TVIS_SELECTED );

		// Do we need to start removing items from selection
		if( hItem == hItemTo )
			bSelect = FALSE;

		hItem = GetNextVisibleItem( hItem );
	}

	return TRUE;
}

CTreeItem CTreeView::GetFirstSelectedItem()
{
	for ( CTreeItem hItem(GetRootItem(), this); !hItem.IsNull(); hItem = GetNextItem( hItem ) )
		if ( GetItemState( hItem, TVIS_SELECTED ) & TVIS_SELECTED )
			return hItem;

	return NULL;
}

CTreeItem CTreeView::GetNextSelectedItem( CTreeItem hItem )
{
	for ( hItem = GetNextItem( hItem ); !hItem.IsNull(); hItem = GetNextItem( hItem ) )
		if ( GetItemState( hItem, TVIS_SELECTED ) & TVIS_SELECTED )
			return hItem;

	return NULL;
}

CTreeItem CTreeView::GetPrevSelectedItem( CTreeItem hItem )
{
	for ( hItem = GetPrevItem( hItem ); !hItem.IsNull(); hItem = GetPrevItem( hItem ) )
		if ( GetItemState( hItem, TVIS_SELECTED ) & TVIS_SELECTED )
			return hItem;

	return NULL;
}

CTreeItem CTreeView::GetNextItem(CTreeItem hitem)
{
	//проверяем есть ли child
	CTreeItem child = hitem.GetChild();
	if(!child.IsNull())
		return child;

	// проверяем есть ли sibling
	CTreeItem sibling = hitem.GetNextSibling();
	if(!sibling.IsNull())
		return sibling;
	
	// ищем первый sibling parent'а
	CTreeItem parent = hitem;
	while(parent = parent.GetParent())
	{
		CTreeItem parent_sibling = parent.GetNextSibling();
		if(parent_sibling)
		{
			return parent_sibling;
		}
	}

	return 0;
}

CTreeItem CTreeView::GetPrevItem(CTreeItem hitem)
{
	// проверяем есть ли prev sibling
	CTreeItem sibling = hitem.GetPrevSibling();
	if(!sibling.IsNull())
	{
		// возвращаем самого последнего предка
		CTreeItem next_item = sibling;
		CTreeItem ret = sibling;
		while(next_item = GetNextItem(next_item))
		{
			if(next_item == hitem)
				return ret;

			ret = next_item;
		}
		return 0;
	}

	// проверяем есть ли parent
	CTreeItem parent = hitem.GetParent();
	if(!parent.IsNull())
	{
		return parent;
	}

	return 0;
}

/*bool CTreeView::MoveRightOne(HTREEITEM item)
{
	// делаем себя ребенком своего предыдущего брата
	// потом всех своих детей делаем своими братьями

	// если не можем переместить себя, то не дклаем ничего
	HTREEITEM prev_sibling = GetPrevSiblingItem(item);
	HTREEITEM child = GetChildItem(prev_sibling);
	if(!prev_sibling)
		return false;

	// делаем себя последним ребенком своего предыдущего брата
	if(!child)
	{
		m_move_to = prev_sibling;
		m_insert_type = InsertType::child;
	}
	else
	{
		m_move_to = GetLastSiblingItem(child);
		m_insert_type = InsertType::sibling;
	}
	m_move_from = item;		
	::SendMessage(m_main_window,WM_COMMAND,MAKELONG(0,IDN_TREE_MOVE_ELEMENT),(LPARAM)m_hWnd);	

	HTREEITEM parent = GetParentItem(item);
	HTREEITEM nextSibling = GetNextSiblingItem(item);		
	
	child = GetChildItem(item);
	if(child)
	{
		m_move_to = item;
		m_insert_type = InsertType::sibling;
		HTREEITEM last_child = GetLastSiblingItem(child);
		HTREEITEM prev_child = 0;
		
        do
		{
			m_move_from = last_child;
			last_child = GetPrevSiblingItem(last_child);
			::SendMessage(m_main_window,WM_COMMAND,MAKELONG(0,IDN_TREE_MOVE_ELEMENT),(LPARAM)m_hWnd);
		}while(last_child);		
	}
	
	return true;
}*/

CTreeItem CTreeView::GetLastSiblingItem(CTreeItem item)
{
	if(!item)
		return 0;

	CTreeItem ret = item;
	while(item = item.GetNextSibling())
	{
		ret = item;
	}
	return ret;
}

CTreeItem CTreeView::GetNextSelectedSibling(CTreeItem item)
{
	if(item.IsNull())
		return 0;

	CTreeItem next = GetNextSelectedItem(item);
	while(!next.IsNull())
	{
		if(IsSibling(item, next))
			return next;
		next = GetNextSelectedItem(next);
	}
	return 0;
}

void CTreeView::SelectElement(MSHTML::IHTMLElement *p)
{
	CTreeItem item = this->LocatePosition(p);
	SelectItem(item);
}

void CTreeView::ExpandElem(MSHTML::IHTMLElement *p, UINT mode)
{
	CTreeItem item = this->LocatePosition(p);
	Expand(item, mode);
}

void CTreeView::Collapse(CTreeItem item, int level2Collapse, bool mode)
{
	if(item.IsNull())
		item = GetRootItem();// root у нас это 0 - ой уровень
    
	do
	{
		if(level2Collapse == 0)
		{
			item.Expand(mode ? TVE_EXPAND : TVE_COLLAPSE);
		}
		else
		{
			CTreeItem child = item.GetChild();
			if(!child.IsNull())
				Collapse(child, level2Collapse - 1, mode);
		}
		item = item.GetNextSibling();
	}while(!item.IsNull());
}
