#ifndef LTREEVIEW_H
#define	LTREEVIEW_H

#include "ElementDescMnr.h"

typedef CWinTraits<WS_CHILD|WS_VISIBLE|
		   TVS_HASBUTTONS|TVS_LINESATROOT|TVS_SHOWSELALWAYS,0>
		  CLPTVWinTraits;

class CTreeView : public CWindowImpl<CTreeView, CTreeViewCtrlEx, CLPTVWinTraits>
{
protected:
  WTL::CImageList		m_ImageList;
  HTREEITEM				m_last_lookup_item;
  HWND					m_main_window;
  bool					m_drag;
  HIMAGELIST			m_himlDrag;
  CTreeItem				m_move_from;
  CTreeItem				m_move_to;
 // HTREEITEM				m_dragdrop_inserted_item;  
  int					m_drop_item_nimage;

  // for multiple selection
  HTREEITEM m_hItemFirstSel;


public:
  enum InsertType
  {
	  none,
	  child,
	  sibling
  };
  int					m_insert_type;

public:
  DECLARE_WND_SUPERCLASS(_T("Tree"), CTreeViewCtrlEx::GetWndClassName())

  CTreeView() : m_last_lookup_item(0), m_main_window(0), m_drag(false), /*m_dragdrop_inserted_item(0),*/ m_insert_type(CTreeView::none){m_move_from.m_pTreeView = this;m_move_to.m_pTreeView = this;}
    
  BOOL PreTranslateMessage(MSG* pMsg);
  
  BEGIN_MSG_MAP(CTreeView)
	MESSAGE_HANDLER(WM_MOUSEMOVE, OnMouseMove)
    MESSAGE_HANDLER(WM_CREATE, OnCreate)
    MESSAGE_HANDLER(WM_DESTROY, OnDestroy)
    MESSAGE_HANDLER(WM_LBUTTONDOWN, OnClick)
	MESSAGE_HANDLER(WM_RBUTTONDOWN, OnRClick)
    MESSAGE_HANDLER(WM_LBUTTONDBLCLK, OnDblClick)
    MESSAGE_HANDLER(WM_KEYDOWN, OnKeyDown)
	MESSAGE_HANDLER(WM_CHAR, OnChar)
	MESSAGE_HANDLER(WM_LBUTTONUP, OnLButtonUp)
	MESSAGE_HANDLER(WM_CONTEXTMENU, OnContextMenu)

	COMMAND_ID_HANDLER(ID_DOCUMENT_TREE_CUT, OnCut)
	COMMAND_ID_HANDLER(ID_DOCUMENT_TREE_PASTE, OnPaste)
	COMMAND_ID_HANDLER(ID_DT_VIEW, OnView)
	COMMAND_ID_HANDLER(ID_DT_VIEWSOURCE, OnViewSource)

	// Tree toolbar commands
	COMMAND_ID_HANDLER(ID_DT_RIGHT_ONE, OnRightOne)
	COMMAND_ID_HANDLER(ID_DT_RIGHT_SMART, OnRightSmart)
	COMMAND_ID_HANDLER(ID_DT_LEFT, OnLeft)
	COMMAND_ID_HANDLER(ID_DT_MERGE, OnMerge)
	COMMAND_ID_HANDLER(ID_DT_DELETE, OnDelete)

	REFLECTED_NOTIFY_CODE_HANDLER(TVN_BEGINDRAG, OnBegindrag)
    REFLECTED_NOTIFY_CODE_HANDLER(TVN_DELETEITEM, OnDeleteItem)
   // REFLECTED_NOTIFY_CODE_HANDLER(NM_RCLICK, OnRClick)
  END_MSG_MAP()
    
  LRESULT OnCreate(UINT /*uMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/, BOOL& /*bHandled*/);
  LRESULT OnDestroy(UINT /*uMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/, BOOL& /*bHandled*/);
  LRESULT OnClick(UINT /*uMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/, BOOL& /*bHandled*/);
  LRESULT OnRClick(UINT /*uMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/, BOOL& /*bHandled*/);
  LRESULT OnDblClick(UINT /*uMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/, BOOL& /*bHandled*/);
  LRESULT OnKeyDown(UINT /*uMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/, BOOL& /*bHandled*/);
  LRESULT OnChar(UINT /*uMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/, BOOL& /*bHandled*/);
  LRESULT OnContextMenu(UINT /*uMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/, BOOL& /*bHandled*/);
  LRESULT OnCut(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled);
  LRESULT OnPaste(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled);
  LRESULT OnView(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled);
  LRESULT OnViewSource(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled);
  LRESULT OnDelete(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled);
  LRESULT OnRight(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled);
  LRESULT OnLeft(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled);
  LRESULT OnRightOne(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled);
  LRESULT OnRightSmart(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled);
  LRESULT OnRightWithChildren(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled);
  LRESULT OnLeftOne(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled);  
  LRESULT OnLeftWithChildren(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled);
  LRESULT OnMerge(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled);

  
  LRESULT OnDeleteItem(int idCtrl, LPNMHDR pnmh, BOOL& bHandled) {
    NMTREEVIEW	  *tvn=(NMTREEVIEW*)pnmh;
    if (tvn->itemOld.lParam)
      ((MSHTML::IHTMLElement*)tvn->itemOld.lParam)->Release();
    return 0;
  }

  //LRESULT OnRClick(int idCtrl, LPNMHDR pnmh, BOOL& bHandled);

  // get document structure from view
  void GetDocumentStructure(MSHTML::IHTMLDocument2Ptr& v);
  void UpdateDocumentStructure(MSHTML::IHTMLDocument2Ptr& v,MSHTML::IHTMLDOMNodePtr node);
  void UpdateAll();
  void HighlightItemAtPos(MSHTML::IHTMLElement *p);
  void SetMainwindow(HWND hwnd){m_main_window = hwnd;}

  CTreeItem GetMoveElementFrom(){m_move_from.m_pTreeView = this; return m_move_from;}
  CTreeItem GetMoveElementTo(){m_move_to.m_pTreeView = this;return m_move_to;}

  	LRESULT OnLButtonUp(UINT, WPARAM, LPARAM, BOOL&);
	LRESULT OnMouseMove(UINT, WPARAM, LPARAM, BOOL&);
	LRESULT OnBegindrag(int idCtrl, LPNMHDR mhdr, BOOL& bHandled);

	CTreeItem GetFirstSelectedItem();
	CTreeItem GetLastSelectedItem();
	CTreeItem GetNextSelectedItem(CTreeItem item);
	CTreeItem GetPrevSelectedItem(CTreeItem	item);

	CTreeItem GetNextSelectedSibling(CTreeItem	item);

	void SelectElement(MSHTML::IHTMLElement *p);
	void ExpandElem(MSHTML::IHTMLElement *p, UINT mode);
	void Collapse(CTreeItem item, int level2Collapse, bool mode);

	int AddImage(HANDLE img);
	int AddIcon(HANDLE icon);
 
protected:
  CTreeItem LocatePosition(MSHTML::IHTMLElement *p);
  bool IsDropChangePosition(UINT flags, HTREEITEM	hitem);
  bool IsParent(CTreeItem	parent, CTreeItem	child);
  bool IsSibling(CTreeItem	item, CTreeItem	sibling);
  bool IsOneOfNextSibling(CTreeItem	item, CTreeItem	sibling);
  bool IsOneOfPrevSibling(CTreeItem	item, CTreeItem	sibling);
  void EndDrag();
  bool SetMultiSelection(UINT nFlags, CPoint point);
  void ClearSelection();
  BOOL SelectItems(HTREEITEM hItemFrom, HTREEITEM hItemTo, bool clearPrevSelection);
  CTreeItem GetNextItem(CTreeItem hitem);
  CTreeItem GetPrevItem(CTreeItem hitem);
  CTreeItem GetLastSiblingItem(CTreeItem hitem);
  bool MoveLeftOne(HTREEITEM hitem);
  bool MoveLeftWithChildren(HTREEITEM hitem);
  bool MoveLeftWithAllNext(HTREEITEM hitem);
  void FillEDMnr();

  //bool MoveRightOne(HTREEITEM hitem);
  //bool MoveRightWithChildren(HTREEITEM hitem);
  //bool MoveRightSmart(HTREEITEM hitem);  

  private:
	CElementDescriptor* m_bodyED;
	CElementDescriptor* m_sectionED;
	CElementDescriptor* m_imageED;
	CElementDescriptor* m_poemED;
};

#endif
