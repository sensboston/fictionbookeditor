// FBEView.cpp : implementation of the CFBEView class
//
/////////////////////////////////////////////////////////////////////////////

#include "stdafx.h"
#include "res1.h"

#include "utils.h"
#include "apputils.h"

#include "FBEView.h"
#include "SearchReplace.h"
#include "Scintilla.h"
#include "ElementDescMnr.h"

extern CElementDescMnr _EDMnr;

// normalization helpers
static void PackText(MSHTML::IHTMLElement2Ptr elem,MSHTML::IHTMLDocument2 *doc);
static void KillDivs(MSHTML::IHTMLElement2Ptr elem);
static void FixupParagraphs(MSHTML::IHTMLElement2Ptr elem);
static void RelocateParagraphs(MSHTML::IHTMLDOMNode *node);
static void KillStyles(MSHTML::IHTMLElement2Ptr elem);

_ATL_FUNC_INFO CFBEView::DocumentCompleteInfo=
  { CC_STDCALL, VT_EMPTY, 2, { VT_DISPATCH, (VT_BYREF | VT_VARIANT) } };
_ATL_FUNC_INFO CFBEView::BeforeNavigateInfo=
  { CC_STDCALL, VT_EMPTY, 7, {
      VT_DISPATCH,
      (VT_BYREF | VT_VARIANT),
      (VT_BYREF | VT_VARIANT),
      (VT_BYREF | VT_VARIANT),
      (VT_BYREF | VT_VARIANT),
      (VT_BYREF | VT_VARIANT),
      (VT_BYREF | VT_BOOL),
    }
  };
_ATL_FUNC_INFO CFBEView::VoidInfo=
  { CC_STDCALL, VT_EMPTY, 0 };
_ATL_FUNC_INFO CFBEView::EventInfo=
  { CC_STDCALL, VT_BOOL, 1, { VT_DISPATCH } };
_ATL_FUNC_INFO CFBEView::VoidEventInfo=
  { CC_STDCALL, VT_EMPTY, 1, { VT_DISPATCH } };

LRESULT CFBEView::OnCreate(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
  if (DefWindowProc(uMsg,wParam,lParam))
    return 1;
  if (!SUCCEEDED(QueryControl(&m_browser)))
    return 1;

  // register browser events handler
  BrowserEvents::DispEventAdvise(m_browser,&DIID_DWebBrowserEvents2);

  return 0;
}

CFBEView::~CFBEView()
{
	if(HasDoc())
	{
		DocumentEvents::DispEventUnadvise(Document(), &DIID_HTMLDocumentEvents2);
		TextEvents::DispEventUnadvise(Document()->body, &DIID_HTMLTextContainerEvents2);
		m_mkc->UnRegisterForDirtyRange(m_dirtyRangeCookie);
	}
	if(m_browser)
		BrowserEvents::DispEventUnadvise(m_browser, &DIID_DWebBrowserEvents2);

	if(m_find_dlg)
	{
		CloseFindDialog(m_find_dlg);
		delete m_find_dlg;
	}
}

BOOL CFBEView::PreTranslateMessage(MSG* pMsg)
{
	return SendMessage(WM_FORWARDMSG,0,(LPARAM)pMsg)!=0;
}

// editing commands
LRESULT CFBEView::ExecCommand(int cmd) {
  IOleCommandTargetPtr	  ct(m_browser);
  if (ct)
    ct->Exec(&CGID_MSHTML,cmd,0,NULL,NULL);
  return 0;
}

void	  CFBEView::QueryStatus(OLECMD *cmd,int ncmd) {
  IOleCommandTargetPtr	  ct(m_browser);
  if (ct)
    ct->QueryStatus(&CGID_MSHTML,ncmd,cmd,NULL);
}

CString	  CFBEView::QueryCmdText(int cmd) {
  IOleCommandTargetPtr	  ct(m_browser);
  if (ct) {
    OLECMD	oc={cmd};
    struct {
      OLECMDTEXT	oct;
      wchar_t		buffer[512];
    } oct={ { OLECMDTEXTF_NAME, 0, 512 } };
    if (SUCCEEDED(ct->QueryStatus(&CGID_MSHTML,1,&oc,&oct.oct)))
      return oct.oct.rgwz;
  }
  return CString();
}

LRESULT CFBEView::OnStyleLink(WORD, WORD, HWND, BOOL&) {
  try {
    if (Document()->execCommand(L"CreateLink",VARIANT_FALSE,_variant_t(L""))==VARIANT_TRUE)
    {
      ::SendMessage(m_frame,WM_COMMAND,MAKELONG(0,IDN_SEL_CHANGE),(LPARAM)m_hWnd);
      ::SendMessage(m_frame,WM_COMMAND,MAKELONG(IDC_HREF,IDN_WANTFOCUS),(LPARAM)m_hWnd);
    }
  }
  catch (_com_error&) { }
  return 0;
}

LRESULT CFBEView::OnStyleFootnote(WORD, WORD, HWND, BOOL&) {
  try {
    m_mk_srv->BeginUndoUnit(L"Create Footnote");
    if (Document()->execCommand(L"CreateLink",VARIANT_FALSE,_variant_t(L""))==VARIANT_TRUE) {
      MSHTML::IHTMLTxtRangePtr  r(Document()->selection->createRange());
      MSHTML::IHTMLElementPtr	pe(r->parentElement());
      if (U::scmp(pe->tagName,L"A")==0)
	pe->className=L"note";
    }
    m_mk_srv->EndUndoUnit();
    ::SendMessage(m_frame,WM_COMMAND,MAKELONG(0,IDN_SEL_CHANGE),(LPARAM)m_hWnd);
    ::SendMessage(m_frame,WM_COMMAND,MAKELONG(IDC_HREF,IDN_WANTFOCUS),(LPARAM)m_hWnd);
  }
  catch (_com_error&) { }
  return 0;
}

bool CFBEView::CheckCommand(WORD wID)
{
  if (!m_normalize)
    return false;
  switch (wID) {
  case ID_EDIT_ADD_BODY:
    return true;
  case ID_EDIT_ADD_TITLE:
    return bCall(L"AddTitle",SelectionStructCon());
  case ID_EDIT_CLONE:
    return bCall(L"CloneContainer",SelectionStructCon());
  case ID_STYLE_NORMAL:
    return bCall(L"StyleNormal",SelectionStructCon());
  case ID_STYLE_SUBTITLE:
    return bCall(L"StyleSubtitle",SelectionStructCon());
  case ID_STYLE_TEXTAUTHOR:
    return bCall(L"StyleTextAuthor",SelectionStructCon());
  case ID_EDIT_INS_IMAGE:
    return bCall(L"InsImage") && !SelectionStructCode() && !SelectionHasTags(L"SPAN");
  case ID_EDIT_INS_INLINEIMAGE:
    return bCall(L"InsInlineImage");
  case ID_EDIT_ADD_IMAGE:
    return bCall(L"AddImage", SelectionStructCon()) && !SelectionStructCode() && !SelectionHasTags(L"SPAN");
  case ID_EDIT_ADD_EPIGRAPH:
    return bCall(L"AddEpigraph",SelectionStructCon());
  case ID_EDIT_ADD_ANN:
    return bCall(L"AddAnnotation",SelectionStructCon());
  case ID_EDIT_SPLIT:
    return SplitContainer(true);
  case ID_EDIT_INS_POEM:
    return InsertPoem(true);
  case ID_EDIT_INS_CITE:
    return InsertCite(true);
	case ID_EDIT_CODE:
		{
			_variant_t params[3] =
			{
				Document()->selection->createRange().GetInterfacePtr(),
				SelectionStructCon().GetInterfacePtr(),
				true
			};
			return bCall(L"StyleCode", 3, params);
		}
  case ID_INSERT_TABLE:
	  return InsertTable(true);
  case ID_GOTO_FOOTNOTE:
	  return (GoToFootnote(true) | GoToReference(true));
  case ID_GOTO_REFERENCE:
	  return GoToReference(true);
  case ID_EDIT_ADD_TA:
    return bCall(L"AddTA",SelectionStructCon());
  case ID_EDIT_MERGE:
    return bCall(L"MergeContainers",SelectionStructCon());
  case ID_EDIT_REMOVE_OUTER_SECTION:
    return bCall(L"RemoveOuterContainer",SelectionStructCon());
  case ID_STYLE_LINK:
  case ID_STYLE_NOTE:
    try {
      return Document()->queryCommandEnabled(L"CreateLink")==VARIANT_TRUE;
    }
    catch (_com_error) { }
    break;
  }
  return false;
}

bool	CFBEView::CheckSetCommand(WORD wID) {
	if (!m_normalize)
		return false;

	switch (wID)
	{
		case ID_EDIT_CODE:
			return bCall(L"IsCode", SelectionStructCode());
	}

	return false;
}

// changes tracking
MSHTML::IHTMLDOMNodePtr	  CFBEView::GetChangedNode() {
  MSHTML::IMarkupPointerPtr	  p1,p2;
  m_mk_srv->CreateMarkupPointer(&p1);
  m_mk_srv->CreateMarkupPointer(&p2);

  m_mkc->GetAndClearDirtyRange(m_dirtyRangeCookie,p1,p2);

  MSHTML::IHTMLElementPtr	  e1,e2;
  p1->CurrentScope(&e1);
  p2->CurrentScope(&e2);
  p1.Release();
  p2.Release();

  while ((bool)e1 && e1!=e2 && e1->contains(e2)!=VARIANT_TRUE)
    e1=e1->parentElement;

  return e1;
}

static bool IsEmptyNode(MSHTML::IHTMLDOMNode *node) {
	if (node->nodeType!=1)
		return false;

	_bstr_t   name(node->nodeName);

	if (U::scmp(name,L"BR")==0)
		return false;

	if (U::scmp(name,L"P")==0) // the editor uses empty Ps to represent empty lines
		return false;

	/* if (U::scmp(name,L"EM")==0) // конвертеры иногда обрамл€ют пробелы тегами <emphasis> и <strong>
	return false;

	if (U::scmp(name,L"STRONG")==0) // конвертеры иногда обрамл€ют пробелы тегами <emphasis> и <strong>
	return false;*/

	// images are always empty
	if (U::scmp(name,L"DIV")==0 && U::scmp(MSHTML::IHTMLElementPtr(node)->className,L"image")==0)
		return false;
	if (U::scmp(name,L"IMG")==0)
		return false;

	if (node->hasChildNodes()==VARIANT_FALSE)
		return true;

	if (U::scmp(name,L"A")==0) // links can be meaningful even if the contain only ws
		return false;

	if ((bool)node->firstChild->nextSibling)
		return false;

	if (node->firstChild->nodeType!=3)
		return false;

	if (U::is_whitespace(node->firstChild->nodeValue.bstrVal))
		return true;

	return false;
}

// Remove empty leaf nodes
static void RemoveEmptyNodes(MSHTML::IHTMLDOMNode *node) {
	if (node->nodeType!=1)
		return;

	MSHTML::IHTMLDOMNodePtr cur(node->firstChild);
	while (cur)
	{
		MSHTML::IHTMLDOMNodePtr next;
		try { next = cur->nextSibling; } catch(...) { return; }

		RemoveEmptyNodes(cur);
		if(IsEmptyNode(cur))
			cur->removeNode(VARIANT_TRUE);
		cur=next;
	}
}

// Find parent DIV
static MSHTML::IHTMLElementPtr GetHP(MSHTML::IHTMLElementPtr hp)
{
	while((bool)hp && U::scmp(hp->tagName,L"DIV"))
		hp = hp->parentElement;
	return hp;
}

// Splitting
bool CFBEView::SplitContainer(bool fCheck)
{
	try
	{
		MSHTML::IHTMLTxtRangePtr rng(Document()->selection->createRange());
		if(!(bool)rng)
			return false;

		MSHTML::IHTMLElementPtr pe(rng->parentElement());
		while((bool)pe && U::scmp(pe->tagName, L"DIV"))
			pe = pe->parentElement;

		if(!(bool)pe || (U::scmp(pe->className, L"section") && U::scmp(pe->className, L"stanza")))
			return false;

		MSHTML::IHTMLTxtRangePtr r2(rng->duplicate());
			r2->moveToElementText(pe);

		if(rng->compareEndPoints(L"StartToStart", r2) == 0)
			return false;

		MSHTML::IHTMLTxtRangePtr r3(rng->duplicate());
		r3->collapse(true);
		MSHTML::IHTMLTxtRangePtr r4(rng->duplicate());
		r4->collapse(false);

		if(!(bool)pe || GetHP(r3->parentElement()) != pe || GetHP(r4->parentElement()) != pe)
			return false;

		if(fCheck)
			return true;

		// At this point we are ready to split

		// Create an undo unit
		CString name(L"split ");
		name += (const wchar_t*)pe->className;
		m_mk_srv->BeginUndoUnit((TCHAR*)(const TCHAR*)name);

		//// Create a new element
		MSHTML::IHTMLElementPtr ne(Document()->createElement(L"DIV"));
		ne->className = pe->className;
		_bstr_t className = pe->className;

		MSHTML::IHTMLElementPtr peTitle(Document()->createElement(L"DIV"));
		MSHTML::IHTMLElementCollectionPtr peColl = pe->children;
		{
			MSHTML::IHTMLElementPtr peChild = peColl->item(0);
			if(!U::scmp(peChild->tagName, L"DIV") && !U::scmp(peChild->className, L"title"))
				peTitle->innerHTML = peChild->outerHTML;
			else
				peTitle = NULL;
		}

		// Create and position markup pointers
		MSHTML::IMarkupPointerPtr selstart, selend, elembeg, elemend;

		m_mk_srv->CreateMarkupPointer(&selstart);
		m_mk_srv->CreateMarkupPointer(&selend);
		m_mk_srv->CreateMarkupPointer(&elembeg);
		m_mk_srv->CreateMarkupPointer(&elemend);

		MSHTML::IHTMLTxtRangePtr titleRng(rng->duplicate());
		m_mk_srv->MovePointersToRange(titleRng, selstart, selend);
		U::ElTextHTML title(titleRng->htmlText, titleRng->text);

		MSHTML::IHTMLTxtRangePtr preRng(rng->duplicate());
		elembeg->MoveAdjacentToElement(pe, MSHTML::ELEM_ADJ_AfterBegin);
		m_mk_srv->MoveRangeToPointers(elembeg, selstart, preRng);
		U::ElTextHTML pre(preRng->htmlText, preRng->text);

		MSHTML::IHTMLElementCollectionPtr peChilds = pe->children;
		MSHTML::IHTMLElementPtr elLast = peChilds->item(peChilds->length - 1);
		if(U::scmp(elLast->innerText, L"") == 0)
			elLast->innerText = L"123";

		MSHTML::IHTMLTxtRangePtr postRng(rng->duplicate());
		elemend->MoveAdjacentToElement(pe, MSHTML::ELEM_ADJ_BeforeEnd);
		m_mk_srv->MoveRangeToPointers(selend, elemend, postRng);
		U::ElTextHTML post(postRng->htmlText, postRng->text);

		// Check if title needs to be created and further text to be copied
		bool fTitle = !title.text.IsEmpty();
		bool fContent = !post.html.IsEmpty();

		if(fTitle && title.html.Find(L"<P") == -1)
			title.html = CString(L"<P>") + title.html + CString(L"</P>");
		if(fContent && post.html.Find(L"<P") == -1)
			post.html = CString(L"<P>") + post.html + CString(L"</P>");

		title.html.Remove(L'\r');
		title.html.Remove(L'\n');
		post.html.Remove(L'\r');
		post.html.Remove(L'\n');

		if(post.html.Find(L"<P>&nbsp;</P>") == 0
			&& post.html.GetLength() > 13
			&& fTitle
			&& title.html.Find(L"<P>&nbsp;</P>") != title.html.GetLength() -14)
			post.html.Delete(0, 13);
		if(post.html.Find(L"<P>123</P>") != -1)
			post.html.Replace(L"<P>123</P>", L"<P>&nbsp;</P>");

		// Insert it after pe
		MSHTML::IHTMLElement2Ptr(pe)->insertAdjacentElement(L"afterEnd", ne);

		// Move content or create new
		if(fContent)
		{
			// Create and position destination markup pointer
			if(post.html == L"<P>&nbsp;</P>")
				post.html += L"<P>&nbsp;</P>";
			ne->innerHTML = post.html.AllocSysString();
		}
		else
		{
			MSHTML::IHTMLElementPtr para(Document()->createElement(L"P"));
			MSHTML::IHTMLElement3Ptr(para)->inflateBlock = VARIANT_TRUE;
			MSHTML::IHTMLElement2Ptr(ne)->insertAdjacentElement(L"beforeEnd", para);
		}

		// Create and move title if needed
		if(fTitle)
		{
			MSHTML::IHTMLElementPtr elTitle(Document()->createElement(L"DIV"));
			elTitle->className = L"title";
			MSHTML::IHTMLElement2Ptr(ne)->insertAdjacentElement(L"afterBegin", elTitle);

			// Create and position destination markup pointer
			elTitle->innerHTML = title.html.AllocSysString();

			// Delete all containers from title
			KillDivs(elTitle);
			KillStyles(elTitle);
		}

		if(pre.html.Find(L"<P") == -1)
		{
			if(pre.html == L"")
				pre.html = L"<P>&nbsp;</P>";
			else
				pre.html = CString(L"<P>") + pre.html + CString(L"</P>");
		}
		pe->innerHTML = pre.html.AllocSysString();

		// Ensure we have good html
		FixupParagraphs(ne);
		PackText(ne, Document());

		peColl = pe->children;
		if(peColl->length == 1)
		{
			MSHTML::IHTMLElementPtr peChild = peColl->item(0);
			if(!U::scmp(peChild->tagName, L"DIV") && !U::scmp(peChild->className, className.GetBSTR()))
				m_mk_srv->RemoveElement(peChild);
		}

		MSHTML::IHTMLElementCollectionPtr neColl = ne->children;
		if(neColl->length == 1)
		{
			MSHTML::IHTMLElementPtr neChild = neColl->item(0);
			if(!U::scmp(neChild->tagName, L"DIV") && !U::scmp(neChild->className, className.GetBSTR()))
				m_mk_srv->RemoveElement(neChild);
		}

		CString peTitSect;
		if(peTitle)
		{
			peTitSect = peTitle->innerHTML.GetBSTR();
			peTitSect += L"<P>&nbsp;</P>";
		}

		CString b = pe->innerText;
		b.Remove(L'\r');
		b.Remove(L'\n');
		CString c = peTitle ? peTitle->innerText : L"";
		c.Remove(L'\r');
		c.Remove(L'\n');

		if(peTitle && !U::scmp(b, c))
			pe->innerHTML = peTitSect.AllocSysString();

		// Close undo unit
		m_mk_srv->EndUndoUnit();

		// Move cursor to newly created item
		GoTo(ne, false);
	}
	catch (_com_error& e)
	{
		U::ReportError(e);
	}

	return false;
}

// charge element's attribute
MSHTML::IHTMLDOMNodePtr	  CFBEView::ChangeAttribute(MSHTML::IHTMLElementPtr elem, const wchar_t* attrib, 
													const wchar_t* value)
{
	if(U::scmp(attrib, L"class"))
		elem->setAttribute(attrib, _variant_t(value), 1);
	else
		elem->className = value;

	CString innerHTML = elem->innerHTML;

	MSHTML::IMarkupPointerPtr pBegin, pEnd;
	m_mk_srv->CreateMarkupPointer(&pBegin);
	m_mk_srv->CreateMarkupPointer(&pEnd);

	pBegin->MoveAdjacentToElement(elem, MSHTML::ELEM_ADJ_BeforeBegin);	
	pEnd->MoveAdjacentToElement(elem, MSHTML::ELEM_ADJ_AfterEnd);

	m_mk_srv->remove(pBegin, pEnd);
	BSTR elemHTML = elem->outerHTML;
	m_mk_srv->InsertElement(elem, pBegin, pEnd);
	if(!innerHTML.IsEmpty())
	  elem->innerHTML = innerHTML.AllocSysString();

	return elem;
}

// cleaning up html
static void KillDivs(MSHTML::IHTMLElement2Ptr elem) {
	MSHTML::IHTMLElementCollectionPtr	  divs(elem->getElementsByTagName(L"DIV"));
	while (divs->length>0)
		MSHTML::IHTMLDOMNodePtr(divs->item(0L))->removeNode(VARIANT_FALSE);
}

static void KillStyles(MSHTML::IHTMLElement2Ptr elem) {
	MSHTML::IHTMLElementCollectionPtr	  ps(elem->getElementsByTagName(L"P"));
	for (long l=0;l<ps->length;++l)
		CheckError(MSHTML::IHTMLElementPtr(ps->item(l))->put_className(NULL));
}

//////////////////////////////////////////////////////////////////////////////
/// @fn static bool	MergeEqualHTMLElements(MSHTML::IHTMLDOMNode *node)
///
/// функци€ объедин€ет сто€щие р€дом одинаковые HTML элементы
///
/// @params MSHTML::IHTMLDOMNode *node [in, out] - нода, внутри которой будет производитьс€ преобразование
///
/// @note сливаютс€ следующие элементы: EM, STRONG
/// при этом пробельные символы, располагающиес€ между закрывающем и открывающим тегами остаютс€, т.е. 
/// '<EM>хороший</EM> <EM>пример</EM>' преобразуетс€ в '<EM>хороший пример</EM>'
///
/// @author »льин »ван @date 31.03.08
//////////////////////////////////////////////////////////////////////////////
static bool	MergeEqualHTMLElements(MSHTML::IHTMLDOMNode *node, MSHTML::IHTMLDocument2 *doc)
{
	if (node->nodeType != 1) // Element node
		return false;

	bool	fRet=false;


	MSHTML::IHTMLDOMNodePtr   cur(node->firstChild);
	while ((bool)cur) 
	{
		MSHTML::IHTMLDOMNodePtr next;
		try { next = cur->nextSibling; } catch(...) { return false; }

		if (MergeEqualHTMLElements(cur,doc))
		{
			cur = node->firstChild;
			continue;
		}

		// если нет следующего элемента, то сливать будет несчем
		if(!(bool)next)
			return false;

		_bstr_t	name(cur->nodeName);	
		MSHTML::IHTMLElementPtr	curelem(cur);
		MSHTML::IHTMLElementPtr	nextElem(next);

		if (U::scmp(name,L"EM")==0 || U::scmp(name,L"STRONG")==0) 
		{
			// отлавливаем ситуацию с пробелом, обрамленным тегами EM т.д.
			bstr_t curText = curelem->innerText;
			if(curText.length() == 0 || U::is_whitespace(curelem->innerText))
			{
				// удал€ем обрамл€ющие теги				
				MSHTML::IHTMLDOMNodePtr prev = cur->previousSibling;
				if((bool)prev)
				{
					if(prev->nodeType == 3)//text
					{
						prev->nodeValue = (bstr_t)prev->nodeValue.bstrVal + curelem->innerText;						
					}
					else
					{
						MSHTML::IHTMLElementPtr prevElem(prev);
						prevElem->innerHTML = prevElem->innerHTML + curelem->innerText;
					}
					cur->removeNode(VARIANT_TRUE);
					cur = prev;
					continue;
				}

				if((bool)next)
				{
					MSHTML::IHTMLDOMNodePtr parent = cur->parentNode;
					if(next->nodeType == 3)//text
					{
						next->nodeValue = (bstr_t)curelem->innerText + next->nodeValue.bstrVal;
					}
					else
					{
						MSHTML::IHTMLElementPtr nextElem(next);
						nextElem->innerHTML = curelem->innerText + nextElem->innerHTML;
					}
					cur->removeNode(VARIANT_TRUE);
					cur = parent->firstChild;
					continue;
				}
			}

			if(next->nodeType == 3) // TextNode
			{
				MSHTML::IHTMLDOMNodePtr afterNext(next->nextSibling);
				if(!(bool)afterNext)
				{
					cur = next;
					continue;
				}

				MSHTML::IHTMLElementPtr	afterNextElem(afterNext);

				bstr_t afterNextName = afterNext->nodeName;
				if(U::scmp(name, afterNextName))// если следующий элемент другого типа
				{
					cur = next;
					continue;
				}

				// провер€ем между одинаковыми элементами сто€т одни пробелы
				if(!U::is_whitespace(next->nodeValue.bstrVal))
				{
					cur = next;
					continue; // <EM>123</EM>45<EM>678</EM> абсолютно нормальна€ ситуаци€
				}

				// объедин€ем элементы
				MSHTML::IHTMLElementPtr	newelem(doc->createElement(name));
				MSHTML::IHTMLDOMNodePtr	newnode(newelem);
				newelem->innerHTML = curelem->innerHTML + next->nodeValue.bstrVal + afterNextElem->innerHTML;
				cur->replaceNode(newnode);
				afterNext->removeNode(VARIANT_TRUE);
				next->removeNode(VARIANT_TRUE);
				cur = newnode;
				fRet=true;
			}
			else
			{
				bstr_t nextName(next->nodeName);
				if(U::scmp(name, nextName))// если следующий элемент другого типа
				{
					cur = next;
					continue;
				}

				// объедин€ем элементы
				MSHTML::IHTMLElementPtr	newelem(doc->createElement(name));
				MSHTML::IHTMLDOMNodePtr	newnode(newelem);
				newelem->innerHTML = curelem->innerHTML + nextElem->innerHTML;
				cur->replaceNode(newnode);
				next->removeNode(VARIANT_TRUE);
				cur = newnode;
				fRet=true;
				continue;
			}
		}
		cur=next;
	}
	return fRet;
}
static bool   RemoveUnk(MSHTML::IHTMLDOMNode *node, MSHTML::IHTMLDocument2 *doc) {
	if (node->nodeType!=1) // Element node
		return false;

	bool	fRet=false;

restart:
	MSHTML::IHTMLDOMNodePtr   cur(node->firstChild);
	while ((bool)cur) 
	{
		MSHTML::IHTMLDOMNodePtr next;
		try { next = cur->nextSibling; } catch(...) { return false; }

		if (RemoveUnk(cur,doc))
			goto restart;

		_bstr_t			name(cur->nodeName);
		MSHTML::IHTMLElementPtr	curelem(cur);

		if (U::scmp(name,L"B")==0 || U::scmp(name,L"I")==0) {
			const wchar_t		*newname=U::scmp(name,L"B")==0 ? L"STRONG" : L"EM";
			MSHTML::IHTMLElementPtr	newelem(doc->createElement(newname));
			MSHTML::IHTMLDOMNodePtr	newnode(newelem);
			newelem->innerHTML=curelem->innerHTML;
			cur->replaceNode(newnode);
			cur=newnode;
			fRet=true;
			goto restart;
		}

		if (U::scmp(name,L"P") && U::scmp(name,L"STRONG") && 
			U::scmp(name,L"STRIKE") && U::scmp(name,L"SUP") && U::scmp(name,L"SUB") && 
			U::scmp(name,L"EM") && U::scmp(name,L"A") &&
			(U::scmp(name,L"SPAN") || U::scmp(curelem->className, L"code")) &&
			U::scmp(name,L"#text") && U::scmp(name,L"BR") &&
			(U::scmp(name,L"IMG") || U::scmp(curelem->parentElement->className, L"image") &&
			// Added by SeNS: inline images support
			(U::scmp(name,L"SPAN") || U::scmp(curelem->className, L"image"))))
		{
			if (U::scmp(name,L"DIV")==0) {
				_bstr_t	  cls(curelem->className);
				_bstr_t	  id(curelem->id);
				if (!(U::scmp(cls,L"body") && U::scmp(cls,L"section") &&
					U::scmp(cls,L"table") && U::scmp(cls,L"tr") && U::scmp(cls,L"th") && U::scmp(cls,L"td") && 
					U::scmp(cls,L"output") && U::scmp(cls,L"part") && U::scmp(cls,L"output-document-class") &&
					U::scmp(cls,L"annotation") && U::scmp(cls,L"title") && U::scmp(cls,L"epigraph") &&
					U::scmp(cls,L"poem") && U::scmp(cls,L"stanza") && U::scmp(cls,L"cite") &&
					U::scmp(cls,L"date") &&
					U::scmp(cls,L"history") && U::scmp(cls,L"image")&&
					U::scmp(cls,L"code") &&
					U::scmp(id,L"fbw_desc") && U::scmp(id,L"fbw_body") && U::scmp(id,L"fbw_updater")))
					goto ok;
			}

			CElementDescriptor* ED;
			if(_EDMnr.GetElementDescriptor(cur, &ED))
				goto ok;
			MSHTML::IHTMLDOMNodePtr ce(cur->previousSibling);
			cur->removeNode(VARIANT_FALSE);
			if (ce)
				next=ce->nextSibling;
			else
				next=node->firstChild;
		}
ok:

		cur=next;
	}
	return fRet;
}

// move the paragraph up one level
void MoveUp(bool fCopyFmt,MSHTML::IHTMLDOMNodePtr& node) {
	MSHTML::IHTMLDOMNodePtr   parent(node->parentNode);
	MSHTML::IHTMLElement2Ptr  elem(parent);

	// clone parent (it can be A/EM/STRONG/SPAN)
	if (fCopyFmt) {
		MSHTML::IHTMLDOMNodePtr   clone(parent->cloneNode(VARIANT_FALSE));
		while ((bool)node->firstChild)
			clone->appendChild(node->firstChild);
		node->appendChild(clone);
	}

	// clone parent once more and move siblings after node to it
	if ((bool)node->nextSibling) {
		MSHTML::IHTMLDOMNodePtr   clone(parent->cloneNode(VARIANT_FALSE));
		while ((bool)node->nextSibling)
			clone->appendChild(node->nextSibling);
		elem->insertAdjacentElement(L"afterEnd",MSHTML::IHTMLElementPtr(clone));
		if (U::scmp(parent->nodeName,L"P")==0)
			MSHTML::IHTMLElement3Ptr(clone)->inflateBlock=VARIANT_TRUE;
	}

	// now move node to parent level, the tree may be in some weird state
	node->removeNode(VARIANT_TRUE); // delete from tree
	node=elem->insertAdjacentElement(L"afterEnd",MSHTML::IHTMLElementPtr(node));
}

void BubbleUp(MSHTML::IHTMLDOMNode *node,const wchar_t *name) {
	MSHTML::IHTMLElement2Ptr	    elem(node);
	MSHTML::IHTMLElementCollectionPtr elements(elem->getElementsByTagName(name));
	long				    len=elements->length;
	for (long i=0;i<len;++i) {
		MSHTML::IHTMLDOMNodePtr	  ce(elements->item(i));
		if (!(bool)ce)
			break;
		for (int ll=0;ce->parentNode!=node && ll<30;++ll)
			MoveUp(true,ce);
		MoveUp(false,ce);
	}
}

// split paragraphs containing BR elements
static void   SplitBRs(MSHTML::IHTMLElement2Ptr elem) {
	MSHTML::IHTMLElementCollectionPtr BRs(elem->getElementsByTagName(L"BR"));
	while (BRs->length>0) {
		MSHTML::IHTMLDOMNodePtr	  ce(BRs->item(0L));
		if (!(bool)ce)
			break;
		for (;;) {
			MSHTML::IHTMLDOMNodePtr	parent(ce->parentNode);
			if (!(bool)parent) // no parent? huh?
				goto blowit;
			_bstr_t	  name(parent->nodeName);
			if (U::scmp(name,L"P")==0 || U::scmp(name,L"DIV")==0)
				break;
			if (U::scmp(name,L"BODY")==0)
				goto blowit;
			MoveUp(false,ce);
		}
		MoveUp(false,ce);
blowit:
		ce->removeNode(VARIANT_TRUE);
	}
}

// this sub should locate any nested paragraphs and bubble them up
static void RelocateParagraphs(MSHTML::IHTMLDOMNode *node) {
	if (node->nodeType!=1)
		return;

	MSHTML::IHTMLDOMNodePtr   cur(node->firstChild);
	while (cur) {
		if (cur->nodeType==1) {
			if (!U::scmp(cur->nodeName,L"P")) {
				BubbleUp(cur,L"P");
				BubbleUp(cur,L"DIV");
			} else
				RelocateParagraphs(cur);
		}
		cur=cur->nextSibling;
	}
}

static bool IsStanza(MSHTML::IHTMLDOMNode *node) {
	MSHTML::IHTMLElementPtr   elem(node);
	return U::scmp(elem->className,L"stanza")==0;
}

// Move text content in DIV items to P elements, so DIVs can
// contain P and DIV only
static void PackText(MSHTML::IHTMLElement2Ptr elem, MSHTML::IHTMLDocument2* doc)
{
	MSHTML::IHTMLElementCollectionPtr elements(elem->getElementsByTagName(L"DIV"));
	for(long i = 0; i < elements->length; ++i)
	{
		MSHTML::IHTMLDOMNodePtr div(elements->item(i));
		if(U::scmp(MSHTML::IHTMLElementPtr(div)->className, L"image") == 0)
			continue;
		MSHTML::IHTMLDOMNodePtr cur(div->firstChild);
		while((bool)cur)
		{
			_bstr_t cur_name(cur->nodeName);
			if (U::scmp(cur_name, L"P") && U::scmp(cur_name, L"DIV"))
			{
				// create a paragraph from a run of !P && !DIV
				MSHTML::IHTMLElementPtr newp(doc->createElement(L"P"));
				MSHTML::IHTMLDOMNodePtr newn(newp);
				cur->replaceNode(newn);
				newn->appendChild(cur);
				while ((bool)newn->nextSibling)
				{
					cur_name = newn->nextSibling->nodeName;
					if (U::scmp(cur_name, L"P") == 0 || U::scmp(cur_name, L"DIV") == 0)
						break;
					newn->appendChild(newn->nextSibling);
				}
				cur = newn->nextSibling;
			}
			else
				cur = cur->nextSibling;
		}
	}
}

static void FixupLinks(MSHTML::IHTMLDOMNode *dom) {
	MSHTML::IHTMLElement2Ptr  elem(dom);

	if (!(bool)elem)
		return;

	MSHTML::IHTMLElementCollectionPtr coll(elem->getElementsByTagName(L"A"));
	if (!(bool)coll)
		return;

	for (long l=0;l<coll->length;++l) {
		MSHTML::IHTMLElementPtr a(coll->item(l));
		if (!(bool)a)
			continue;

		_variant_t	  href(a->getAttribute(L"href",2));
		if (V_VT(&href)==VT_BSTR && V_BSTR(&href) &&
			::SysStringLen(V_BSTR(&href))>11 &&
			memcmp(V_BSTR(&href),L"file://",6*sizeof(wchar_t))==0)
		{
			wchar_t* pos = wcschr((wchar_t*)V_BSTR(&href), L'#'); 
			if(!pos)
				continue;
			a->setAttribute(L"href",pos,0);
		}
	}
}

bool CFBEView::InsertPoem(bool fCheck)
{
	try
	{
		MSHTML::IHTMLTxtRangePtr rng(Document()->selection->createRange());
		if(!(bool)rng)
			return false;

		MSHTML::IHTMLElementPtr pe(GetHP(rng->parentElement()));
		if(!(bool)pe)
			return false;

		// Get parents for start and end ranges and ensure they are the same as pe
		MSHTML::IHTMLTxtRangePtr tr(rng->duplicate());
		tr->collapse(VARIANT_TRUE);
		if (GetHP(tr->parentElement()) != pe)
			return false;

		// Check if it possible to insert a poem there
		_bstr_t cls(pe->className);
		if(U::scmp(cls, L"section")
			&& U::scmp(cls, L"epigraph")
			&& U::scmp(cls, L"annotation")
			&& U::scmp(cls, L"history")
			&& U::scmp(cls, L"cite"))
			return false;

		// Preventing double expanding whether checked or actual executed
		MSHTML::IHTMLElementPtr elBegin, elEnd;
		MSHTML::IHTMLDOMNodePtr begin, end;
		if(!ExpandTxtRangeToParagraphs(rng, elBegin, elEnd))
			return false;
		else
		{
			begin = elBegin;
			end = elEnd;
		}

		// All checks passed
		if(fCheck)
			return true;

		m_mk_srv->BeginUndoUnit(L"insert poem");

		CString rngHTML;
		MSHTML::IHTMLDOMNodePtr sibling = begin;
		do
		{
			rngHTML += MSHTML::IHTMLElementPtr(sibling)->outerHTML.GetBSTR();
			if(sibling == end)
				break;
		}
		while((sibling = sibling->nextSibling));

		MSHTML::IHTMLElementPtr ne(Document()->createElement(L"<DIV class=poem>"));

		if(!U::scmp(rng->text.GetBSTR(), L""))
		{
			MSHTML::IHTMLElementPtr se(Document()->createElement(L"<DIV class=stanza>"));
			se->innerHTML = L"<P>&nbsp;</P>";
			ne->innerHTML = se->outerHTML;
		}
		else
		{
			MSHTML::IHTMLElementPtr acc(Document()->createElement(L"DIV"));
			acc->innerHTML = rngHTML.AllocSysString();

			MSHTML::IHTMLElementCollectionPtr coll = acc->children;
			bool trim = true;

			CString stanzaHTML;
			for(int i = 0; i < coll->length; ++i)
			{
				MSHTML::IHTMLElementPtr curr = coll->item(i);

				CString line = curr->innerText;
				// changed by SeNS: issue #61
				if (line.Trim().IsEmpty())
				{
					if(trim)
						continue;
					else
					{
						MSHTML::IHTMLElementPtr se(Document()->createElement(L"<DIV class=stanza>"));
						se->innerHTML = stanzaHTML.AllocSysString();
						MSHTML::IHTMLElement2Ptr(ne)->insertAdjacentElement(L"beforeEnd", se);
						stanzaHTML = L"";
						trim = true;
					}
				}
				else
				{
					if(!U::scmp(curr->tagName, L"DIV"))
					{
						if(curr->innerText.GetBSTR())
						{
							stanzaHTML += CString(L"<P>") + curr->innerText.GetBSTR() + CString(L"</P>");
						}
						else
							continue;
					}
					else
					{
						stanzaHTML += curr->outerHTML.GetBSTR();
					}

					trim = false;
				}
			}

			if(stanzaHTML != "")
			{
				MSHTML::IHTMLElementPtr se(Document()->createElement(L"<DIV class=stanza>"));
				se->innerHTML = stanzaHTML.AllocSysString();
				MSHTML::IHTMLElement2Ptr(ne)->insertAdjacentElement(L"beforeEnd", se);
			}
		}


		MSHTML::IHTMLDOMNodePtr(pe)->insertBefore((MSHTML::IHTMLDOMNodePtr)ne, begin.GetInterfacePtr());

		while(begin != end)
		{
			sibling = begin->nextSibling;
			begin->removeNode(VARIANT_TRUE);
			begin = sibling;
		}
		end->removeNode(VARIANT_TRUE);

		FixupParagraphs(pe);
		PackText(pe, Document());

		rng->moveToElementText(ne);
		rng->collapse(false);
		rng->select();

		m_mk_srv->EndUndoUnit();
	}
	catch (_com_error& err) 
	{
		U::ReportError(err);
	}
	return true;
}

bool CFBEView::InsertCite(bool fCheck)
{
	try
	{
		MSHTML::IHTMLTxtRangePtr rng(Document()->selection->createRange());
		if(!(bool)rng)
			return false;

		MSHTML::IHTMLElementPtr pe(GetHP(rng->parentElement()));
		if(!(bool)pe)
			return false;

		// Get parents for start and end ranges and ensure they are the same as pe
		MSHTML::IHTMLTxtRangePtr tr(rng->duplicate());
		tr->collapse(VARIANT_TRUE);
		if (GetHP(tr->parentElement()) != pe)
			return false;

		// Check if it possible to insert a cite there
		_bstr_t cls(pe->className);
		if(U::scmp(cls, L"section")
			&& U::scmp(cls, L"epigraph")
			&& U::scmp(cls, L"annotation")
			&&  U::scmp(cls, L"history"))
			return false;

		// Preventing double expanding whether checked or actual executed
		MSHTML::IHTMLElementPtr elBegin, elEnd;
		MSHTML::IHTMLDOMNodePtr begin, end;
		if(!ExpandTxtRangeToParagraphs(rng, elBegin, elEnd))
			return false;
		else
		{
			begin = elBegin;
			end = elEnd;
		}

		// All checks passed
		if(fCheck)
			return true;

		m_mk_srv->BeginUndoUnit(L"insert cite");

		CString rngHTML;
		MSHTML::IHTMLDOMNodePtr sibling = begin;
		do
		{
			rngHTML += MSHTML::IHTMLElementPtr(sibling)->outerHTML.GetBSTR();
			if(sibling == end)
				break;
		}
		while((sibling = sibling->nextSibling));

		// Create cite
		MSHTML::IHTMLElementPtr ne(Document()->createElement(L"DIV"));
		ne->className = L"cite";

		MSHTML::IHTMLElementPtr acc(Document()->createElement(L"DIV"));
		acc->innerHTML = rngHTML.AllocSysString();

		MSHTML::IHTMLElementCollectionPtr coll = acc->children;

		CString citeHTML;
		for(int i = 0; i < coll->length; ++i)
		{
			MSHTML::IHTMLElementPtr curr = coll->item(i);
			if(!U::scmp(curr->tagName, L"DIV")
				&& U::scmp(curr->className, L"table")
				&& U::scmp(curr->className, L"poem"))
			{
				if(curr->innerText.GetBSTR())
				{
					citeHTML += CString(L"<P>") + curr->innerText.GetBSTR() + CString(L"</P>");
				}
				else
					continue;
			}
			else
			{
				citeHTML += curr->outerHTML.GetBSTR();
			}
		}

		ne->innerHTML = citeHTML.AllocSysString();

		MSHTML::IHTMLDOMNodePtr(pe)->insertBefore((MSHTML::IHTMLDOMNodePtr)ne, begin.GetInterfacePtr());

		while(begin != end)
		{
			sibling = begin->nextSibling;
			begin->removeNode(VARIANT_TRUE);
			begin = sibling;
		}
		end->removeNode(VARIANT_TRUE);

		FixupParagraphs(pe);
		PackText(pe, Document());

		rng->moveToElementText(ne);
		rng->collapse(false);
		rng->select();

		m_mk_srv->EndUndoUnit();
	}
	catch (_com_error& err) 
	{
		U::ReportError(err);
	}
	return true;
}

CString CFBEView::GetClearedRangeText(const MSHTML::IHTMLTxtRangePtr &rng)const
{
	CString org_text = rng->htmlText;
	
	org_text.Replace(L"\r\n", L"\n");
	org_text.Replace(L" \n", L" ");
	org_text.Replace(L"\n ", L" ");
	org_text.Replace(L"\n", L" ");

	while(org_text[org_text.GetLength() - 1] == L' ')
		org_text = org_text.Left(org_text.GetLength() - 1);
	while(org_text[0] == L' ')
		org_text = org_text.Right(org_text.GetLength() - 1);
	org_text.Replace(L"> <", L">\r\n<");	
	return org_text;
}

// searching
void  CFBEView::StartIncSearch() {
  try {
    m_is_start=Document()->selection->createRange();
    m_is_start->collapse(VARIANT_TRUE);
  }
  catch (_com_error&) {
  }
}

void  CFBEView::CancelIncSearch() {
  if (m_is_start) {
    m_is_start->raw_select();
    m_is_start.Release();
  }
}

// script calls
void	      CFBEView::ImgSetURL(IDispatch *elem,const CString& url) {
  try {
    CComDispatchDriver	dd(Script());
    _variant_t	  ve(elem);
    _variant_t	  vu((const TCHAR *)url);
    dd.Invoke2(L"ImgSetURL",&ve,&vu);
  }
  catch (_com_error&) { }
}

IDispatchPtr  CFBEView::Call(const wchar_t *name) {
  try {
    CComDispatchDriver  dd(Script());
    _variant_t  ret;
    _variant_t  vt2((false));
    dd.Invoke1(name,&vt2,&ret);
    if (V_VT(&ret)==VT_DISPATCH)
      return V_DISPATCH(&ret);
  }
  catch (_com_error&) { }
  return IDispatchPtr();
}
IDispatchPtr  CFBEView::Call(const wchar_t *name,IDispatch *pDisp) {
  try {
    CComDispatchDriver  dd(Script());
    _variant_t  vt;
    if (pDisp)
      vt=pDisp;
    _variant_t  vt2(false);
    _variant_t  ret;
    dd.Invoke2(name,&vt,&vt2,&ret);
    if (V_VT(&ret)==VT_DISPATCH)
      return V_DISPATCH(&ret);
  }
  catch (_com_error&) { }
  return IDispatchPtr();
}
static bool vt2bool(const _variant_t& vt) {
  if (V_VT(&vt)==VT_DISPATCH)
    return V_DISPATCH(&vt)!=0;
  if (V_VT(&vt)==VT_BOOL)
    return V_BOOL(&vt)==VARIANT_TRUE;
  if (V_VT(&vt)==VT_I4)
    return V_I4(&vt)!=0;
  if (V_VT(&vt)==VT_UI4)
    return V_UI4(&vt)!=0;
  return false;
}

bool CFBEView::bCall(const wchar_t *name, int nParams, VARIANT* params)
{
	try
	{
		CComDispatchDriver dd(Script());
		_variant_t ret;
		dd.InvokeN(name, params, nParams, &ret);
		return vt2bool(ret);
	}
	catch(_com_error& err)
	{
		U::ReportError(err);
	}

	return false;
}

bool  CFBEView::bCall(const wchar_t *name,IDispatch *pDisp) {
  try {
    CComDispatchDriver  dd(Script());
    _variant_t  vt;
    if (pDisp)
      vt=pDisp;
    _variant_t  vt2(true);
    _variant_t  ret;
    dd.Invoke2(name,&vt,&vt2,&ret);
    return vt2bool(ret);
  }
  catch (_com_error&) { }
  return false;
}

bool  CFBEView::bCall(const wchar_t *name) {
  try {
    CComDispatchDriver  dd(Script());
    _variant_t  vt2(true);
    _variant_t  ret;
    dd.Invoke1(name,&vt2,&ret);
    return vt2bool(ret);
  }
  catch (_com_error&) { }
  return false;
}

// utilities
static CString	GetPath(MSHTML::IHTMLElementPtr elem) {
  try {
    if (!(bool)elem)
      return CString();
    CString		      path;
    while (elem) {
      CString	  cur((const wchar_t *)elem->tagName);
	  CString	  cid((const wchar_t *)elem->id);
      if (cur==_T("BODY"))
        return path;
	  if(cid == _T("fbw_body"))
		  return path;
      _bstr_t	  cls(elem->className);
      if (cls.length()>0)
	cur=(const wchar_t *)cls;
      _bstr_t	  id(elem->id);
      if (id.length()>0) {
	cur+=_T(':');
	cur+=(const wchar_t *)id;
      }
      if (!path.IsEmpty())
	path=_T('/')+path;
      path=cur+path;
      elem=elem->parentElement;
    }
    return path;
  }
  catch (_com_error&) { }
  return CString();
}

CString	CFBEView::SelPath() {
  return GetPath(SelectionContainer());
}

void  CFBEView::GoTo(MSHTML::IHTMLElement *e,bool fScroll) {
  if (!e)
    return;

  if (fScroll)
    e->scrollIntoView(VARIANT_TRUE);

  MSHTML::IHTMLTxtRangePtr	r(MSHTML::IHTMLBodyElementPtr(Document()->body)->createTextRange());
  r->moveToElementText(e);
  r->collapse(VARIANT_TRUE);
  // all m$ editors like to position the pointer at the end of the preceding element,
  // which sucks. This workaround seems to work most of the time.
  if (e!=r->parentElement() && r->move(L"character",1)==1)
    r->move(L"character",-1);

  r->select();
}

MSHTML::IHTMLElementPtr CFBEView::SelectionContainerImp()
{
	try
	{
		IDispatchPtr selrange(Document()->selection->createRange());
		MSHTML::IHTMLTxtRangePtr range(selrange);
		if(range)
		{
			return range->parentElement();
		}
		MSHTML::IHTMLControlRangePtr coll(selrange);
		if((bool)coll)
			return coll->commonParentElement();
	}
	catch(_com_error& err)
	{
		U::ReportError(err);
	}

	return MSHTML::IHTMLElementPtr();
}

MSHTML::IHTMLElementPtr CFBEView::SelectionAnchor() {
  try {
    MSHTML::IHTMLElementPtr   cur(SelectionContainer());
    while (cur) {
      _bstr_t	tn(cur->tagName);
      if (U::scmp(tn,L"A")==0 || (U::scmp(tn,L"DIV")==0 && U::scmp(cur->className,L"image")==0))
		return cur;
	  // Added by SeNS - inline images
      if (U::scmp(tn,L"A")==0 || (U::scmp(tn,L"SPAN")==0 && U::scmp(cur->className,L"image")==0))
		return cur;
      cur=cur->parentElement;
    }
  }
  catch (_com_error&) { }
  return MSHTML::IHTMLElementPtr();
}

MSHTML::IHTMLElementPtr CFBEView::SelectionAnchor(MSHTML::IHTMLElementPtr cur) {
  try {
    while (cur) {
      _bstr_t	tn(cur->tagName);
      if (U::scmp(tn,L"A")==0 || (U::scmp(tn,L"DIV")==0 && U::scmp(cur->className,L"image")==0))
		return cur;
	  // Added by SeNS - inline images
      if (U::scmp(tn,L"A")==0 || (U::scmp(tn,L"SPAN")==0 && U::scmp(cur->className,L"image")==0))
		return cur;
      cur=cur->parentElement;
    }
  }
  catch (_com_error&) { }
  return MSHTML::IHTMLElementPtr();
}


MSHTML::IHTMLElementPtr CFBEView::SelectionStructCon() {
	try
	{
		MSHTML::IHTMLElementPtr cur(SelectionContainer());
		while (cur)
		{
			if (U::scmp(cur->tagName, L"P") == 0 || U::scmp(cur->tagName, L"DIV") == 0)
				return cur;
			cur=cur->parentElement;
		}
	}
	catch (_com_error& err)
	{
		U::ReportError(err);
	}

	return MSHTML::IHTMLElementPtr();
}

MSHTML::IHTMLElementPtr CFBEView::SelectionStructNearestCon()
{
	try
	{
		MSHTML::IHTMLElementPtr cur(SelectionContainer());
		if(cur)
		{			
			return cur;
		}
	}
	catch (_com_error& err)
	{
		U::ReportError(err);
	}

	return MSHTML::IHTMLElementPtr();
}

MSHTML::IHTMLElementPtr CFBEView::SelectionStructCode() {
	try
	{
		MSHTML::IHTMLElementPtr cur(SelectionContainer());
		while(cur)
		{
			// changed by SeNS: inline images also have a tag SPAN
			if((U::scmp(cur->tagName, L"SPAN") == 0) && (U::scmp(cur->className,L"image")!=0))
				return cur;
			cur = cur->parentElement;
		}		
	}
	catch (_com_error& err)
	{
		U::ReportError(err);
	}

	return MSHTML::IHTMLElementPtr();
}

// Modification by Pilgrim
MSHTML::IHTMLElementPtr	  CFBEView::SelectionStructSection() {
  try {
    MSHTML::IHTMLElementPtr   cur(SelectionContainer());
    while (cur) {
      if (U::scmp(cur->className,L"section")==0)
		return cur;
      cur=cur->parentElement;
    }
  }
  catch (_com_error&) {
  }
  return MSHTML::IHTMLElementPtr();
}

MSHTML::IHTMLElementPtr	  CFBEView::SelectionStructImage() {	
  try {
    MSHTML::IHTMLElementPtr   cur(SelectionContainer());
    while (cur) {
	  // changed by SeNS: inline images have a tag SPAN, regular tag DIV
      if ((U::scmp(cur->className,L"image")==0) && (U::scmp(cur->tagName,L"SPAN")!=0))
		return cur;
      cur=cur->parentElement;
    }
  }
  catch (_com_error&) {
  }
  return MSHTML::IHTMLElementPtr();
}


MSHTML::IHTMLElementPtr	  CFBEView::SelectionStructTable() {
  try {
    MSHTML::IHTMLElementPtr   cur(SelectionContainer());
    while (cur) {
      if (U::scmp(cur->className,L"table")==0)
		return cur;
      cur=cur->parentElement;
    }
  }
  catch (_com_error&) {
  }
  return MSHTML::IHTMLElementPtr();
}

MSHTML::IHTMLElementPtr	  CFBEView::SelectionStructTableCon() {
  try {
    MSHTML::IHTMLElementPtr   cur(SelectionContainer());
    while (cur) {
      if (U::scmp(cur->className,L"th")==0 || U::scmp(cur->className,L"td")==0)
		return cur;
      cur=cur->parentElement;
    }
  }
  catch (_com_error&) {
  }
  return MSHTML::IHTMLElementPtr();
}

MSHTML::IHTMLElementPtr	  CFBEView::SelectionsStyleT() {
  try {
    MSHTML::IHTMLElementPtr   cur(SelectionContainer());
    while (cur) {
 	 _bstr_t	style(AU::GetAttrB(cur,L"fbstyle"));
      if (U::scmp(cur->className,L"table")==0)
		return cur;
      cur=cur->parentElement;
    }
  }
  catch (_com_error&) {
  }
  return MSHTML::IHTMLElementPtr();
}

MSHTML::IHTMLElementPtr	  CFBEView::SelectionsStyleTB(_bstr_t& style) {
  try {
    MSHTML::IHTMLElementPtr   cur(SelectionContainer());
    while (cur) {
	 if (U::scmp(cur->className,L"table")==0){		
		 style = AU::GetAttrB(cur,L"fbstyle");
		 return cur;
	 }	
     cur=cur->parentElement;
    }
  }
  catch (_com_error&) {
  }
  return MSHTML::IHTMLElementPtr();
}

MSHTML::IHTMLElementPtr	  CFBEView::SelectionsStyle() {
  try {
    MSHTML::IHTMLElementPtr   cur(SelectionContainer());
    while (cur) {
 	 _bstr_t	style(AU::GetAttrB(cur,L"fbstyle"));
      if (U::scmp(cur->className,L"th")==0 || U::scmp(cur->className,L"td")==0)
		return cur;
      cur=cur->parentElement;
    }
  }
  catch (_com_error&) {
  }
  return MSHTML::IHTMLElementPtr();
}

MSHTML::IHTMLElementPtr	  CFBEView::SelectionsStyleB(_bstr_t& style) {
  try {
    MSHTML::IHTMLElementPtr   cur(SelectionContainer());
    while (cur) {
	 if (U::scmp(cur->className,L"th")==0 || U::scmp(cur->className,L"td")==0){		
		 style = AU::GetAttrB(cur,L"fbstyle");
		 return cur;
	 }	
     cur=cur->parentElement;
    }
  }
  catch (_com_error&) {
  }
  return MSHTML::IHTMLElementPtr();
}

MSHTML::IHTMLElementPtr	  CFBEView::SelectionsColspan() {
  try {
    MSHTML::IHTMLElementPtr   cur(SelectionContainer());
    while (cur) {
      if (U::scmp(cur->className,L"th")==0 || U::scmp(cur->className,L"td")==0)
		return cur;
      cur=cur->parentElement;
    }
  }
  catch (_com_error&) {
  }
  return MSHTML::IHTMLElementPtr();
}

MSHTML::IHTMLElementPtr	  CFBEView::SelectionsColspanB(_bstr_t& colspan) {
  try {
    MSHTML::IHTMLElementPtr   cur(SelectionContainer());
    while (cur) {
	  if (U::scmp(cur->className,L"th")==0 || U::scmp(cur->className,L"td")==0){
	  	colspan = AU::GetAttrB(cur,L"fbcolspan");
		return cur;
	  }
      cur=cur->parentElement;
    }
  }
  catch (_com_error&) {
  }
  return MSHTML::IHTMLElementPtr();
}

MSHTML::IHTMLElementPtr	  CFBEView::SelectionsRowspan() {
  try {
    MSHTML::IHTMLElementPtr   cur(SelectionContainer());
    while (cur) {
      if (U::scmp(cur->className,L"th")==0 || U::scmp(cur->className,L"td")==0)
		return cur;
      cur=cur->parentElement;
    }
  }
  catch (_com_error&) {
  }
  return MSHTML::IHTMLElementPtr();
}

MSHTML::IHTMLElementPtr	  CFBEView::SelectionsRowspanB(_bstr_t& rowspan) {
  try {
    MSHTML::IHTMLElementPtr   cur(SelectionContainer());
    while (cur) {
	  if (U::scmp(cur->className,L"th")==0 || U::scmp(cur->className,L"td")==0){
		rowspan =  AU::GetAttrB(cur,L"fbrowspan");
		return cur;
	  }
      cur=cur->parentElement;
    }
  }
  catch (_com_error&) {
  }
  return MSHTML::IHTMLElementPtr();
}

MSHTML::IHTMLElementPtr	  CFBEView::SelectionsAlignTR() {
  try {
    MSHTML::IHTMLElementPtr   cur(SelectionContainer());
    while (cur) {
      if (U::scmp(cur->className,L"tr")==0)
		return cur;
      cur=cur->parentElement;
    }
  }
  catch (_com_error&) {
  }
  return MSHTML::IHTMLElementPtr();
}

MSHTML::IHTMLElementPtr	  CFBEView::SelectionsAlignTRB(_bstr_t& align) {
  try {
    MSHTML::IHTMLElementPtr   cur(SelectionContainer());
    while (cur) {
		if (U::scmp(cur->className,L"tr")==0){
			align =  AU::GetAttrB(cur,L"fbalign");
			return cur;
		}
      cur=cur->parentElement;
    }
  }
  catch (_com_error&) {
  }
  return MSHTML::IHTMLElementPtr();
}

MSHTML::IHTMLElementPtr	  CFBEView::SelectionsAlign() {
  try {
    MSHTML::IHTMLElementPtr   cur(SelectionContainer());
    while (cur) {
      if (U::scmp(cur->className,L"tr")==0 || U::scmp(cur->className,L"th")==0 || U::scmp(cur->className,L"td")==0)
		return cur;
      cur=cur->parentElement;
    }
  }
  catch (_com_error&) {
  }
  return MSHTML::IHTMLElementPtr();
}

MSHTML::IHTMLElementPtr	  CFBEView::SelectionsAlignB(_bstr_t& align) {
  try {
    MSHTML::IHTMLElementPtr   cur(SelectionContainer());
    while (cur) {
		if (U::scmp(cur->className,L"tr")==0 || U::scmp(cur->className,L"th")==0 || U::scmp(cur->className,L"td")==0){
			align =  AU::GetAttrB(cur,L"fbalign");
			return cur;
		}
      cur=cur->parentElement;
    }
  }
  catch (_com_error&) {
  }
  return MSHTML::IHTMLElementPtr();
}

MSHTML::IHTMLElementPtr	  CFBEView::SelectionsVAlign() {
  try {
    MSHTML::IHTMLElementPtr   cur(SelectionContainer());
    while (cur) {
      if (U::scmp(cur->className,L"th")==0 || U::scmp(cur->className,L"td")==0)
		return cur;
      cur=cur->parentElement;
    }
  }
  catch (_com_error&) {
  }
  return MSHTML::IHTMLElementPtr();
}

MSHTML::IHTMLElementPtr	  CFBEView::SelectionsVAlignB(_bstr_t& valign) {
  try {
    MSHTML::IHTMLElementPtr   cur(SelectionContainer());
    while (cur) {
		if (U::scmp(cur->className,L"th")==0 || U::scmp(cur->className,L"td")==0){
			valign =  AU::GetAttrB(cur,L"fbvalign");
			return cur;
		}
      cur=cur->parentElement;
    }
  }
  catch (_com_error&) {
  }
  return MSHTML::IHTMLElementPtr();
}

void  CFBEView::Normalize(MSHTML::IHTMLDOMNodePtr dom) {
  try {
	//MSHTML::IHTMLElementCollectionPtr col = dom->childNodes;
	MSHTML::IHTMLDOMNodePtr el = dom->firstChild;
	bool found = false;

	// нормализовать нужно только body документа
	while(el)
	{
		MSHTML::IHTMLElementPtr hel(el);

		if(U::scmp(hel->id, L"fbw_body") == 0)
		{
			found = true;
			break;
		}
		el = el->nextSibling;
	}

	if(!found)
	{
		return;
	}

    // wrap in an undo unit
    m_mk_srv->BeginUndoUnit(L"Normalize");

    // remove unsupported elements
	RemoveUnk(el,Document());

	MergeEqualHTMLElements(el, Document());
    // get rid of nested DIVs and Ps
    RelocateParagraphs(el);
    // delete empty nodes
    
	RemoveEmptyNodes(el);
    // make sure text appears under Ps only
    PackText(el,Document());
    // get rid of nested Ps once more
    RelocateParagraphs(el);
    // convert BRs to separate paragraphs
    SplitBRs(el);
    // delete empty nodes again
    RemoveEmptyNodes(el);
    // fixup links
    FixupLinks(el);

    m_mk_srv->EndUndoUnit();
  }
  catch (_com_error& e) {
    U::ReportError(e);
  }
}

static void FixupParagraphs(MSHTML::IHTMLElement2Ptr elem)
{
	MSHTML::IHTMLElementCollectionPtr pp(elem->getElementsByTagName(L"P"));
	for(long l = 0; l < pp->length; ++l)
		MSHTML::IHTMLElement3Ptr(pp->item(l))->inflateBlock = VARIANT_TRUE;
}

LRESULT CFBEView::OnPaste(WORD, WORD, HWND, BOOL&)
{
	try
	{
		m_mk_srv->BeginUndoUnit(L"Paste");
		++m_enable_paste;
		
		// added by SeNS: process clipboard and change nbsp
		if (OpenClipboard())
		{
			// process text
			if ( IsClipboardFormatAvailable(CF_TEXT) || IsClipboardFormatAvailable(CF_UNICODETEXT))
			{
				if (_Settings.GetNBSPChar().Compare(L"\u00A0") != 0)
				{
					HANDLE hData = GetClipboardData( CF_UNICODETEXT );
					TCHAR *buffer = (TCHAR*)GlobalLock( hData );
					CString fromClipboard(buffer);
					GlobalUnlock( hData );

					fromClipboard.Replace( L"\u00A0", _Settings.GetNBSPChar());

					HGLOBAL clipbuffer = GlobalAlloc(GMEM_DDESHARE, (fromClipboard.GetLength()+1)*sizeof(TCHAR));
					buffer = (TCHAR*)GlobalLock(clipbuffer);
					wcscpy(buffer, fromClipboard);
					GlobalUnlock( clipbuffer );
					SetClipboardData(CF_UNICODETEXT, clipbuffer);
				}
			}
			// process bitmaps from clipboard
			else if ( IsClipboardFormatAvailable(CF_BITMAP))
			{
				HBITMAP hBitmap = (HBITMAP)GetClipboardData(CF_BITMAP);
				TCHAR szPathName[MAX_PATH] = { 0 };
				TCHAR szFileName[MAX_PATH] = { 0 };
				if (::GetTempPath(sizeof(szPathName)/sizeof(TCHAR), szPathName))
					if (::GetTempFileName(szPathName, L"img", ::GetTickCount(), szFileName))
					{
						int quality = _Settings.GetJpegQuality();

						CString fileName(szFileName);
						CImage image; 
						image.Attach(hBitmap); 

						if (_Settings.GetImageType() == 0)
						{
							fileName.Replace(L".tmp", L".png");
							image.Save(fileName, Gdiplus::ImageFormatPNG);
						}
						else
						{
							fileName.Replace(L".tmp", L".jpg");
							// set encoder quality
							Gdiplus::EncoderParameters encoderParameters[1];
							encoderParameters[0].Count = 1;
							encoderParameters[0].Parameter[0].Guid = Gdiplus::EncoderQuality;
							encoderParameters[0].Parameter[0].NumberOfValues = 1;
							encoderParameters[0].Parameter[0].Type = Gdiplus::EncoderParameterValueTypeLong;
							encoderParameters[0].Parameter[0].Value = &quality;
							image.Save(fileName, Gdiplus::ImageFormatJPEG, &encoderParameters[0]);
						}

						AddImage(fileName, true);
						::DeleteFile(fileName);
					}
			}
			CloseClipboard();
		}

		IOleCommandTargetPtr(m_browser)->Exec(&CGID_MSHTML, IDM_PASTE, 0, NULL, NULL);
		--m_enable_paste;
		if(m_normalize)
			Normalize(Document()->body);
		m_mk_srv->EndUndoUnit();
	}
	catch(_com_error& err)
	{
		U::ReportError(err);
	}

	return 0;
}

// searching
bool CFBEView::DoSearch(bool fMore)
{
	if(m_fo.match)
		m_fo.match.Release();
	if(m_fo.pattern.IsEmpty())
	{
		if(m_is_start)
			m_is_start->raw_select();
		return true;
	}

	// added by SeNS
	if (_Settings.GetNBSPChar().Compare(L"\u00A0") != 0)
		m_fo.pattern.Replace( L"\u00A0", _Settings.GetNBSPChar());

	return m_fo.fRegexp ? DoSearchRegexp(fMore) : DoSearchStd(fMore);
}

void CFBEView::SelMatch(MSHTML::IHTMLTxtRange *tr,AU::ReMatch rm) 
{
	tr->collapse(VARIANT_TRUE);
	tr->move(L"character",rm->FirstIndex);
	if (tr->moveStart(L"character",1)==1)
		tr->move(L"character",-1);
	tr->moveEnd(L"character",rm->Length);
	// set focus to editor if selection empty
	if (!rm->Length)
		SetFocus();
	tr->select();
	m_fo.match=rm;
}

bool CFBEView::DoSearchRegexp(bool fMore)
{
	try
	{
		// well, try to compile it first
		AU::RegExp re;
		CheckError(re.CreateInstance(L"VBScript.RegExp"));
		re->IgnoreCase = m_fo.flags & 4 ? VARIANT_FALSE : VARIANT_TRUE;
		re->Global = VARIANT_TRUE;
		re->Pattern = (const wchar_t*)m_fo.pattern;

		// locate starting paragraph
		MSHTML::IHTMLTxtRangePtr sel(Document()->selection->createRange());
			if(!fMore && (bool)m_is_start)
				sel= m_is_start->duplicate();
			if(!(bool)sel)
				return false;

		MSHTML::IHTMLElementPtr sc(SelectionStructCon());
		long s_idx = 0;
		long s_off1 = 0;
		long s_off2 = 0;
		if((bool)sc)
		{
			s_idx = sc->sourceIndex;
			if(U::scmp(sc->tagName,L"P") == 0 && (bool)sel)
			{
				s_off2 = sel->text.length();
				MSHTML::IHTMLTxtRangePtr pr(sel->duplicate());
				pr->moveToElementText(sc);
				pr->setEndPoint(L"EndToStart", sel);
				s_off1 = pr->text.length();
				s_off2 += s_off1;
			}
		}

		// walk the all collection now, looking for the next P
		MSHTML::IHTMLElementCollectionPtr all(Document()->all);
		long all_len = all->length;
		long incr = m_fo.flags &1 ? -1 : 1;
		bool fWrapped = false;

		// * search in starting element
		if ((bool)sc && U::scmp(sc->tagName, L"P") == 0)
		{
			sel->moveToElementText(sc);
			CString selText = sel->text;

			AU::ReMatches rm(re->Execute(sel->text));
			// changed by SeNS: fix for issue #62
			if (rm->Count > 0&& !(selText.IsEmpty() && fMore))
			{
				if(incr > 0)
				{
					for(long l = m_startMatch;l < rm->Count; ++l)
					{
						AU::ReMatch crm(rm->Item[l]);
						if(crm->FirstIndex >= s_off2 )
						{
							m_startMatch = l+1;
							SelMatch(sel, crm);
							return true;
						}
					}
				}
				else
				{
					for(long l = m_endMatch; l >= 0; --l)
					{
						AU::ReMatch crm(rm->Item[l]);
						if(crm->FirstIndex < s_off1)
						{
							SelMatch(sel, crm);
							m_endMatch = l-1;
							return true;
						}
					}
				}
			}
		}

		// search all others
		for(long cur = s_idx + incr; ; cur += incr)
		{
			// adjust out of bounds indices
			if(cur < 0)
			{
				cur = all_len - 1;
				fWrapped = true;
			}
			else if(cur >= all_len)
			{
				cur = 0;
				fWrapped = true;
			}

			// check for wraparound
			if(cur == s_idx)
				break;
			
			// check current element type
			MSHTML::IHTMLElementPtr elem(all->item(cur));
			if(!(bool)elem || U::scmp(elem->tagName,L"P"))
				continue;

			// search inside current element
			sel->moveToElementText(elem);
			
			AU::ReMatches rm(re->Execute(sel->text));
			if(rm->Count <= 0)
				continue;
			if(incr > 0)
			{
				SelMatch(sel, rm->Item[0]);
				m_startMatch = 1;
			}
			else
			{
				SelMatch(sel, rm->Item[rm->Count-1]);
				m_endMatch = rm->Count-2;
			}
			if(fWrapped)
				::MessageBeep(MB_ICONASTERISK);
			
			return true;
		}

		// search again in starting element
		if ((bool)sc && U::scmp(sc->tagName, L"P") == 0)
		{
			sel->moveToElementText(sc);
			AU::ReMatches rm(re->Execute(sel->text));
			if(rm->Count > 0)
			{
				if(incr > 0)
				{
					for(long l = 0; l < rm->Count; ++l)
					{
						AU::ReMatch crm(rm->Item[l]);
						if(crm->FirstIndex < s_off1)
						{
							SelMatch(sel, crm);
							if(fWrapped)
								::MessageBeep(MB_ICONASTERISK);
							
							return true;
						}
					}
				}
				else
				{
					for(long l = rm->Count - 1; l >= 0; --l)
					{
						AU::ReMatch crm(rm->Item[l]);
						if(crm->FirstIndex >= s_off2)
						{
							SelMatch(sel, crm);
							if(fWrapped)
								::MessageBeep(MB_ICONASTERISK);
							return true;
						}
					}
				}
			}
		}
	}
	catch (_com_error& err)
	{
		U::ReportError(err);
	}

	return false;
}

bool CFBEView::DoSearchStd(bool fMore)
{
	try
	{
		// fetch selection
		MSHTML::IHTMLTxtRangePtr sel(Document()->selection->createRange());
		if(!fMore && (bool)m_is_start)
			sel = m_is_start->duplicate();
		if(!(bool)sel)
			return false;
		
		MSHTML::IHTMLTxtRangePtr org(sel->duplicate());
		// check if it is collapsed
		if(sel->compareEndPoints(L"StartToEnd", sel) != 0)
		{
			// collapse and advance
			if(m_fo.flags & FRF_REVERSE)
				sel->collapse(VARIANT_TRUE);
			else
				sel->collapse(VARIANT_FALSE);
		}

		// search for text
		if(sel->findText((const wchar_t*)m_fo.pattern, 1073741824, m_fo.flags) == VARIANT_TRUE)
		{
			// ok, found
			sel->select();
			return true;
		}

		// not found, try searching from start to sel
		sel = MSHTML::IHTMLBodyElementPtr(Document()->body)->createTextRange();
		sel->collapse(m_fo.flags & 1 ? VARIANT_FALSE : VARIANT_TRUE);
		if(sel->findText((const wchar_t*)m_fo.pattern, 1073741824, m_fo.flags) == VARIANT_TRUE
			&& org->compareEndPoints("StartToStart", sel)*(m_fo.flags & 1 ? -1 : 1) > 0)
		{
			// found
			sel->select();
			MessageBeep(MB_ICONASTERISK);
			return true;
		}
	}
	catch (_com_error&)
	{
		//U::ReportError(err);
	}

	return false;
}

static CString GetSM(VBScript_RegExp_55::ISubMatches *sm, int idx)
{
	if(!sm)
		return CString();

	if(idx < 0 || idx >= sm->Count)
		return CString();

	_variant_t vt(sm->Item[idx]);

	if(V_VT(&vt) == VT_BSTR)
		return V_BSTR(&vt);

	return CString();
}

struct RR
{
	enum
	{
		STRONG = 1,
		EMPHASIS = 2,
		UPPER = 4,
		LOWER = 8,
		TITLE = 16
	};

	int flags;
	int start;
	int len;
};

typedef CSimpleValArray<RR> RRList;

static CString GetReplStr(const CString& rstr, VBScript_RegExp_55::IMatch2* rm, RRList& rl)
{
	CString rep;
	rep.GetBuffer(rstr.GetLength());
	rep.ReleaseBuffer(0);

	AU::ReSubMatches rs(rm->SubMatches);

	RR cr;
	memset(&cr, 0, sizeof(cr));
	int flags=0;

	CString rv;

	for(int i = 0; i < rstr.GetLength(); ++i)
	{
		if(rstr[i] == _T('$') && i < rstr.GetLength() - 1)
		{
			switch(rstr[++i])
			{
				case _T('&'): // whole match
					rv=(const wchar_t *)rm->Value;
					break;
				case _T('+'): // last submatch
					rv = GetSM(rs, rs->Count - 1);
					break;
				case _T('1'):
				case _T('2'):
				case _T('3'):
				case _T('4'):
				case _T('5'):
				case _T('6'):
				case _T('7'):
				case _T('8'):
				case _T('9'):
					rv = GetSM(rs, rstr[i] - _T('0') - 1);
					break;
				case _T('T'): // title case
					flags |= RR::TITLE;
					continue;
				case _T('U'): // uppercase
					flags |= RR::UPPER;
					continue;
				case _T('L'): // lowercase
					flags |= RR::LOWER;
					continue;
				case _T('S'): // strong
					flags |= RR::STRONG;
					continue;
				case _T('E'): // emphasis
					flags |= RR::EMPHASIS;
					continue;
				case _T('Q'): // turn off flags
					flags = 0;
					continue;
				default: // ignore
					continue;
			}
		}

		if(cr.flags != flags && cr.flags && cr.start < rep.GetLength())
		{
			cr.len = rep.GetLength() - cr.start;
			rl.Add(cr);
			cr.flags = 0;
		}

		if(flags)
		{
			cr.flags = flags;
			cr.start = rep.GetLength();
		}

		if(!rv.IsEmpty())
		{
			rep += rv;
			rv.Empty();
		}
		else
			rep += rstr[i];
	}

		if(cr.flags && cr.start < rep.GetLength())
		{
			cr.len = rep.GetLength() - cr.start;
			rl.Add(cr);
		}

		// process case conversions here
		int tl = rep.GetLength();
		TCHAR* cp = rep.GetBuffer(tl);
		for(int j = 0; j < rl.GetSize();)
		{
			RR rr = rl[j];
			if(rr.flags & RR::UPPER)
				LCMapString(CP_ACP, LCMAP_UPPERCASE, cp + rr.start, rr.len, cp + rr.start, rr.len);
			else if(rr.flags & RR::LOWER)
				LCMapString(CP_ACP, LCMAP_LOWERCASE, cp + rr.start, rr.len, cp + rr.start, rr.len);
			else if(rr.flags & RR::TITLE && rr.len > 0)
			{
				LCMapString(CP_ACP, LCMAP_UPPERCASE, cp + rr.start, 1, cp + rr.start, 1);
				LCMapString(CP_ACP, LCMAP_LOWERCASE, cp + rr.start + 1, rr.len - 1, cp + rr.start + 1, rr.len - 1);
			}
	
			if((rr.flags &~ (RR::UPPER | RR::LOWER | RR::TITLE)) == 0)
				rl.RemoveAt(j);
			else
				++j;
		}

		rep.ReleaseBuffer(tl);

	return rep;
}

void  CFBEView::DoReplace() {
  try {
    MSHTML::IHTMLTxtRangePtr  sel(Document()->selection->createRange());
    if (!(bool)sel)
      return;
    MSHTML::IHTMLTxtRangePtr  x2(sel->duplicate());
    int			      adv=0;

	m_mk_srv->BeginUndoUnit(L"replace");

    if (m_fo.match) { // use regexp match
      RRList	rl;
      CString rep(GetReplStr(m_fo.replacement,m_fo.match,rl));
      sel->text=(const wchar_t *)rep;
      // change bold/italic where needed
      for (int i=0;i<rl.GetSize();++i) {
	RR  rr=rl[i];
	x2=sel->duplicate();
	x2->move(L"character",rr.start-rep.GetLength());
	x2->moveEnd(L"character",rr.len);
	if (rr.flags&RR::STRONG)
	  x2->execCommand(L"Bold",VARIANT_FALSE);
	if (rr.flags&RR::EMPHASIS)
	  x2->execCommand(L"Italic",VARIANT_FALSE);
      }
      adv=rep.GetLength();
    } else { // plain text
      sel->text=(const wchar_t *)m_fo.replacement;
      adv=m_fo.replacement.GetLength();
    }
    sel->moveStart(L"character",-adv);
    sel->select();
  }
  catch (_com_error& e) {
    U::ReportError(e);
  }
  m_mk_srv->EndUndoUnit();
}

int CFBEView::GlobalReplace(MSHTML::IHTMLElementPtr elem, CString cntTag)
{
	if(m_fo.pattern.IsEmpty())
		return 0;

	try
	{
		MSHTML::IHTMLTxtRangePtr sel(MSHTML::IHTMLBodyElementPtr(Document()->body)->createTextRange());
		if(elem)
			sel->moveToElementText(elem);
		if(!(bool)sel)
			return 0;

		AU::RegExp re;
		CheckError(re.CreateInstance(L"VBScript.RegExp"));
		re->IgnoreCase = m_fo.flags & 4 ? VARIANT_FALSE : VARIANT_TRUE;
		re->Global = VARIANT_TRUE;
		re->Pattern = (const wchar_t*)m_fo.pattern;

		m_mk_srv->BeginUndoUnit(L"replace");

		sel->collapse(VARIANT_TRUE);

		int nRepl = 0;

		if(m_fo.fRegexp)
		{
			MSHTML::IHTMLTxtRangePtr s3;
			MSHTML::IHTMLElementCollectionPtr all;
			if(elem)
				all = MSHTML::IHTMLElement2Ptr(elem)->getElementsByTagName(cntTag.AllocSysString());
			else
				all = MSHTML::IHTMLDocument3Ptr(Document())->getElementsByTagName(cntTag.AllocSysString());
			_bstr_t charstr(L"character");
			RRList rl;
			CString repl;

			for(long l = 0;l < all->length; ++l)
			{
				MSHTML::IHTMLElementPtr elem(all->item(l));
				sel->moveToElementText(elem);;
				AU::ReMatches rm(re->Execute(sel->text));
				if(rm->Count <= 0)
					continue;

				// Replace
				sel->collapse(VARIANT_TRUE);
				long last = 0;
				for(long i = 0; i < rm->Count; ++i)
				{
					AU::ReMatch cur(rm->Item[i]);
					long delta = cur->FirstIndex - last;
					if(delta)
					{
						sel->move(charstr, delta);
						last += delta;
					}
					if(sel->moveStart(charstr, 1) == 1)
						sel->move(charstr, -1);
					delta = cur->Length;
					last += cur->Length;
					sel->moveEnd(charstr, delta);
					rl.RemoveAll();
					repl = GetReplStr(m_fo.replacement, cur, rl);
					sel->text = (const wchar_t*)repl;
					for(int k = 0; k < rl.GetSize(); ++k)
					{
						RR rr = rl[k];
						s3 = sel->duplicate();
						s3->move(L"character", rr.start - repl.GetLength());
						s3->moveEnd(L"character", rr.len);
						if(rr.flags & RR::STRONG)
							s3->execCommand(L"Bold", VARIANT_FALSE);
						if(rr.flags & RR::EMPHASIS)
							s3->execCommand(L"Italic", VARIANT_FALSE);
					}
					++nRepl;
				}
			}
		}
		else
		{
			DWORD flags = m_fo.flags & ~FRF_REVERSE;
			_bstr_t pattern((const wchar_t*)m_fo.pattern);
			_bstr_t repl((const wchar_t*)m_fo.replacement);
				while(sel->findText(pattern, 1073741824, flags) == VARIANT_TRUE)
				{
					sel->text = repl;
					++nRepl;
				}
		}

		m_mk_srv->EndUndoUnit();
		return nRepl;
	}
	catch (_com_error& err)
	{
		U::ReportError(err);
	}

	return 0;
}

int CFBEView::ToolWordsGlobalReplace(	MSHTML::IHTMLElementPtr fbw_body,
										int* pIndex,
										int* globIndex,
										bool find,
										CString cntTag)
{
	if(m_fo.pattern.IsEmpty())
		return 0;

	int nRepl = 0;

	try
	{
		AU::RegExp re;
		CheckError(re.CreateInstance(L"VBScript.RegExp", NULL, CLSCTX_INPROC_SERVER));

		re->IgnoreCase = m_fo.flags & FRF_CASE ? VARIANT_FALSE : VARIANT_TRUE;
		re->Global = m_fo.flags & FRF_WHOLE ? VARIANT_TRUE : VARIANT_FALSE;
		re->Multiline = VARIANT_TRUE;
		re->Pattern = (const wchar_t*)m_fo.pattern;

		MSHTML::IHTMLElementCollectionPtr paras = MSHTML::IHTMLElement2Ptr(fbw_body)->getElementsByTagName(cntTag.AllocSysString());
		if(!paras->length)
			return 0;

		int iNextElem = pIndex != NULL ? *pIndex : 0;
		CSimpleArray<CFBEView::pElAdjacent> pAdjElems;

		while(iNextElem < paras->length)
		{
			pAdjElems.RemoveAll();

			MSHTML::IHTMLElementPtr currElem(paras->item(iNextElem));
			CString innerText = currElem->innerText;
			pAdjElems.Add(pElAdjacent(currElem));

			if(pIndex != NULL)
				*pIndex = iNextElem;

			MSHTML::IHTMLDOMNodePtr currNode(currElem);
			if(MSHTML::IHTMLElementPtr siblElem = currNode->nextSibling)
			{
				int jNextElem = iNextElem + 1;
				for(int i = jNextElem; i < paras->length; ++i)
				{
					MSHTML::IHTMLElementPtr nextElem = paras->item(i);
					if(siblElem == nextElem)
					{
						pAdjElems.Add(pElAdjacent(siblElem));
						innerText += L"\n";
						innerText += siblElem->innerText.GetBSTR();
						iNextElem++;
						siblElem = MSHTML::IHTMLDOMNodePtr(nextElem)->nextSibling;
					}
					else
					{
						break;
					}
				}
			}
			innerText += L"\n";

			if(innerText.IsEmpty())
			{
				iNextElem++;
				continue;
			}

			// Replace
			AU::ReMatches rm(re->Execute(innerText.AllocSysString()));
			
			if(rm->Count <= 0)
			{
				iNextElem++;
				continue;
			}

			for(long i = 0; i < rm->Count; ++i)
			{
				AU::ReMatch cur(rm->Item[i]);

				long matchIdx = cur->FirstIndex;
				long matchLen = cur->Length - 1;

				long pAdjLen = 0;
				bool begin = false, end = false;
				int first = 0, last = 0;

				for(int b = 0; b < pAdjElems.GetSize(); ++b)
				{
					int pElemLen = pAdjElems[b].innerText.length() + 1;

					if(!pElemLen)
						continue;

					pAdjLen += pElemLen;

					if(matchIdx < pAdjLen && !begin)
					{
						begin = true;
						first = b;
					}

					if(matchIdx + (matchLen - 1) < pAdjLen && !end)
					{
						end = true;
						last = b;
						break;
					}
				}

				int skip = 0;
				while(skip < first)
				{
					matchIdx -= (pAdjElems[skip].innerText.length() + 1);
					skip++;
				}

				CString newCont;
				int icat = first;
				while(icat <= last)
				{
					newCont += pAdjElems[icat].innerText.GetBSTR();
					icat++;
				}

				if(find)
				{
					if(i == rm->Count - 1)
					{
						(*globIndex) = -1;
						(*pIndex) += (pAdjElems.GetSize());
					}
					else
						(*globIndex)++;

					if(*globIndex > i)
					{
						(*globIndex)--;
						continue;
					}

					MSHTML::IHTMLTxtRangePtr found(Document()->selection->createRange());
					found->moveToElementText(pAdjElems[first].elem);
					found->moveStart(L"character", matchIdx);
					found->collapse(TRUE);
					int diff = last - first;
					found->moveEnd(L"character", matchLen);
					found->select();

					return 0;
				}
				else
				{
					MSHTML::IHTMLTxtRangePtr found(Document()->selection->createRange());
					found->moveToElementText(pAdjElems[first].elem);
					found->moveStart(L"character", matchIdx);
					found->collapse(TRUE);
					int diff = last - first;
					found->moveEnd(L"character", matchLen);
					found->select();
					CString strRepl;
					GetDlgItem(IDC_WORDS_FR_EDIT_REPL).GetWindowText(strRepl);

					found->text = L"";
					found->text = m_fo.replacement.AllocSysString();

					newCont.Delete(matchIdx, matchLen - (last - first));
					newCont.Insert(matchIdx, m_fo.replacement);

					pAdjElems[first].innerText = newCont.AllocSysString();
					//pAdjElems[first].elem->innerText = pAdjElems[first].innerText;

					for(int c = first + 1; c <= last; ++c)
					{
					//	MSHTML::IHTMLDOMNodePtr(pAdjElems[c].elem)->removeNode(VARIANT_TRUE);
						iNextElem--;
					}

					for(int c = first + 1; c < last; ++c)
						pAdjElems.RemoveAt(c);

					if(nRepl >= m_fo.replNum)
						goto stop;

					CString again;
					for(int c = 0; c < pAdjElems.GetSize(); ++c)
					{
						//pAdjElems[c].innerText = pAdjElems[c].elem->innerText;
						again += pAdjElems[c].innerText.GetBSTR();
						again += L"\n";
					}

					rm = re->Execute(again.AllocSysString());
					i--;

					nRepl++;
				}
			}

			iNextElem++;
		}

stop:
		re.Release();

		if(find)
		{
			Document()->selection->empty();
			return -1;
		}
	}
	catch (_com_error& err)
	{
		U::ReportError(err);
	}

	return nRepl;
}

class CViewReplaceDlg : public CReplaceDlgBase {
public:
  CViewReplaceDlg(CFBEView *view) : CReplaceDlgBase(view) { }

  virtual void DoFind() {
    if (!m_view->DoSearch())
	{
		wchar_t cpt[MAX_LOAD_STRING + 1];
		wchar_t msg[MAX_LOAD_STRING + 1];
		::LoadString(_Module.GetResourceInstance(), IDR_MAINFRAME, cpt, MAX_LOAD_STRING);
		::LoadString(_Module.GetResourceInstance(), IDS_SEARCH_END_MSG, msg, MAX_LOAD_STRING);
		U::MessageBox(MB_OK|MB_ICONEXCLAMATION, cpt, msg, m_view->m_fo.pattern);	
	}
    else {
      SaveString();
      SaveHistory();
      m_selvalid=true;
      MakeClose();
    }
  }
  virtual void DoReplace() {
    if (m_selvalid) { // replace
      m_view->DoReplace();
      m_selvalid=false;
    }
	m_view->m_startMatch = m_view->m_endMatch = 0;
    DoFind();
  }
  virtual void DoReplaceAll() {
    int nRepl=m_view->GlobalReplace();
    if (nRepl>0) {
      SaveString();
      SaveHistory();
	  wchar_t cpt[MAX_LOAD_STRING + 1];
	  wchar_t msg[MAX_LOAD_STRING + 1];
	  ::LoadString(_Module.GetResourceInstance(), IDS_REPL_ALL_CAPT, cpt, MAX_LOAD_STRING);
	  ::LoadString(_Module.GetResourceInstance(), IDS_REPL_DONE_MSG, msg, MAX_LOAD_STRING);
      U::MessageBox(MB_OK, cpt, msg, nRepl);
      MakeClose();
      m_selvalid=false;
    } else
	{
		wchar_t cpt[MAX_LOAD_STRING + 1];
		wchar_t msg[MAX_LOAD_STRING + 1];
		::LoadString(_Module.GetResourceInstance(), IDR_MAINFRAME, cpt, MAX_LOAD_STRING);
		::LoadString(_Module.GetResourceInstance(), IDS_SEARCH_END_MSG, msg, MAX_LOAD_STRING);
		U::MessageBox(MB_OK|MB_ICONEXCLAMATION, cpt, msg, m_view->m_fo.pattern);
	}
  }
};

LRESULT CFBEView::OnFind(WORD, WORD, HWND, BOOL&)
{
	m_fo.pattern = (const wchar_t*)Selection();
	if(!m_find_dlg)
		m_find_dlg = new CViewFindDlg(this);

	if(!m_find_dlg->IsValid())
		m_find_dlg->ShowDialog(*this); // show modeless
	else
		m_find_dlg->SetFocus();
	return 0;
}

LRESULT CFBEView::OnReplace(WORD, WORD, HWND, BOOL&)
{
	m_fo.pattern = (const wchar_t *)Selection();
	if(!m_replace_dlg)
		m_replace_dlg = new CViewReplaceDlg(this);

	if(!m_replace_dlg->IsValid())
		m_replace_dlg->ShowDialog(*this);
	else
		m_replace_dlg->SetFocus();
	return 0;
}

LRESULT  CFBEView::OnFindNext(WORD, WORD, HWND, BOOL&) {
  if (!DoSearch())
  {
	  wchar_t cpt[MAX_LOAD_STRING + 1];
	  wchar_t msg[MAX_LOAD_STRING + 1];
	  ::LoadString(_Module.GetResourceInstance(), IDR_MAINFRAME, cpt, MAX_LOAD_STRING);
	  ::LoadString(_Module.GetResourceInstance(), IDS_SEARCH_FAIL_MSG, msg, MAX_LOAD_STRING);
    U::MessageBox(MB_OK|MB_ICONEXCLAMATION, cpt, msg,m_fo.pattern);
  }
  return 0;
}

// binary objects
_variant_t	CFBEView::GetBinary(const wchar_t *id) {
  try {
    CComDispatchDriver    dd(Script());
    _variant_t    ret;
    _variant_t    arg(id);
    if (SUCCEEDED(dd.Invoke1(L"GetBinary",&arg,&ret)))
      return ret;
  }
  catch (_com_error&) { }
  return _variant_t();
}

// change notifications
void	CFBEView::EditorChanged(int id) {
  switch (id) {
  case FWD_SINK:
    break;
  case BACK_SINK:
    break;
  case RANGE_SINK:
	m_startMatch = m_endMatch = 0;
    if (!m_ignore_changes)
      ::SendMessage(m_frame,WM_COMMAND,MAKELONG(0,IDN_ED_CHANGED),(LPARAM)m_hWnd);
    break;
  }
}

// DWebBrowserEvents2
void  CFBEView::OnDocumentComplete(IDispatch *pDisp,VARIANT *vtUrl) {
  m_complete=true;
}

void  CFBEView::Init() {
  // save document pointer
  m_hdoc=m_browser->Document;

  m_mk_srv=m_hdoc;
  m_mkc=m_hdoc;

  // attach document events handler
  DocumentEvents::DispEventUnadvise(Document(),&DIID_HTMLDocumentEvents2);
  DocumentEvents::DispEventAdvise(Document(),&DIID_HTMLDocumentEvents2);
  TextEvents::DispEventUnadvise(Document()->body,&DIID_HTMLTextContainerEvents2);
  TextEvents::DispEventAdvise(Document()->body,&DIID_HTMLTextContainerEvents2);

  // attach editing changed handlers
  m_mkc->RegisterForDirtyRange((RangeSink*)this,&m_dirtyRangeCookie);

  // attach external helper
  SetExternalDispatch(CreateHelper());

  // fixup all P elements
  FixupParagraphs(Document()->body);

  if (m_normalize)
    Normalize(Document()->body);

  if (!m_normalize) {
    // check ID and version fields
    MSHTML::IHTMLInputElementPtr	    ii(Document()->all->item(L"diID"));
    if ((bool)ii && ii->value.length()==0) { // generate new ID
      UUID	      uuid;
      unsigned char *str;
      if (UuidCreate(&uuid)==RPC_S_OK && UuidToStringA(&uuid,&str)==RPC_S_OK) {
	CString     us(str);
	RpcStringFreeA(&str);
	us.MakeUpper();
	ii->value=(const wchar_t *)us;
      }
    }
    ii=Document()->all->item(L"diVersion");
    if ((bool)ii && ii->value.length()==0)
      ii->value=L"1.0";
    ii=Document()->all->item(L"diDate");
    MSHTML::IHTMLInputElementPtr jj(Document()->all->item(L"diDateVal"));
    if ((bool)ii && (bool)jj && ii->value.length()==0 && jj->value.length()==0) {
      time_t  tt;
      time(&tt);
      char    buffer[128];
      strftime(buffer,sizeof(buffer),"%Y-%m-%d",localtime(&tt));
      ii->value=buffer;
      jj->value=buffer;
    }
    ii=Document()->all->item(L"diProgs");
    if ((bool)ii && ii->value.length()==0)
      ii->value=L"FB Tools";
  }

  // added by SeNS
  m_elementsNum = Document()->all->length;

  // turn off browser's d&d
  HRESULT hr = m_browser->put_RegisterAsDropTarget(VARIANT_FALSE);
//  m_browser->RegisterAsDropTarget = VARIANT_TRUE;

  m_initialized=true;
}

void  CFBEView::OnBeforeNavigate(IDispatch *pDisp,VARIANT *vtUrl,VARIANT *vtFlags,
				 VARIANT *vtTargetFrame,VARIANT *vtPostData,
				 VARIANT *vtHeaders,VARIANT_BOOL *fCancel)
{
  if (!m_initialized)
    return;

  if (vtUrl && V_VT(vtUrl)==VT_BSTR) {
    m_nav_url=V_BSTR(vtUrl);

    if (m_nav_url.Left(13)==_T("fbw-internal:"))
      return;

	// changed by SeNS: possible fix for issue #87
	// tested on Windows Vista Ultimate
    ::PostMessage(m_frame,WM_COMMAND,MAKELONG(0,IDN_NAVIGATE),(LPARAM)m_hWnd);
  }

  // disable navigating away
  *fCancel=VARIANT_TRUE;
}

// HTMLDocumentEvents
void  CFBEView::OnSelChange(IDispatch *evt) {
  if (!m_ignore_changes)
    ::SendMessage(m_frame,WM_COMMAND,MAKELONG(0,IDN_SEL_CHANGE),(LPARAM)m_hWnd);
  if (m_cur_sel)
    m_cur_sel.Release();
}

VARIANT_BOOL  CFBEView::OnContextMenu(IDispatch *evt)
{
	MSHTML::IHTMLEventObjPtr oe(evt);
	oe->cancelBubble = VARIANT_TRUE;
	oe->returnValue = VARIANT_FALSE;
	if(!m_normalize)
	{
		MSHTML::IHTMLElementPtr elem(oe->srcElement);
		if(!(bool)elem)
			return VARIANT_TRUE;
		if(U::scmp(elem->tagName,L"INPUT") && U::scmp(elem->tagName, L"TEXTAREA"))
			return VARIANT_TRUE;
	}

	// display custom context menu here
	CMenu menu;
	CString itemName;

	menu.CreatePopupMenu();
	menu.AppendMenu(MF_STRING,ID_EDIT_UNDO,_T("&Undo"));
	menu.AppendMenu(MF_SEPARATOR);

	itemName.LoadString(IDS_CTXMENU_CUT);
	menu.AppendMenu(MF_STRING, ID_EDIT_CUT, itemName);

	itemName.LoadString(IDS_CTXMENU_COPY);
	menu.AppendMenu(MF_STRING, ID_EDIT_COPY, itemName);

	itemName.LoadString(IDS_CTXMENU_PASTE);
	menu.AppendMenu(MF_STRING, ID_EDIT_PASTE, itemName);

	if(m_normalize)
	{
		menu.AppendMenu(MF_SEPARATOR);
		MSHTML::IHTMLElementPtr cur(SelectionContainer());
		MSHTML::IHTMLElementPtr initial(cur);
		int cmd = ID_SEL_BASE;
		itemName.LoadString(IDS_CTXMENU_SELECT);

		while((bool)cur && U::scmp(cur->tagName,L"BODY") && U::scmp(cur->id, L"fbw_body"))
		{
			menu.AppendMenu(MF_STRING, cmd, itemName + L" " + GetPath(cur));
			cur = cur->parentElement;
			++cmd;
		}
		if(U::scmp(initial->className, L"image") == 0)
		{
			MSHTML::IHTMLImgElementPtr image = MSHTML::IHTMLDOMNodePtr(initial)->firstChild;
			CString src = image->src.GetBSTR();
			src.Delete(src.Find(L"fbw-internal:"), 13);
			if(src != L"#undefined")
			{
				menu.AppendMenu(MF_SEPARATOR);
				itemName.LoadString(IDS_CTXMENU_IMG_SAVEAS);
				menu.AppendMenu(MF_STRING, ID_SAVEIMG_AS, itemName);
			}
		}
	}

	AU::TRACKPARAMS tp;
	tp.hMenu = menu;
	tp.uFlags = TPM_LEFTALIGN | TPM_TOPALIGN | TPM_RIGHTBUTTON;
	tp.x = oe->screenX;
	tp.y = oe->screenY;
	::SendMessage(m_frame, AU::WM_TRACKPOPUPMENU, 0, (LPARAM)&tp);

	return VARIANT_TRUE;
}

LRESULT CFBEView::OnSelectElement(WORD, WORD wID, HWND, BOOL&) {
  int	steps=wID-ID_SEL_BASE;
  try {
    MSHTML::IHTMLElementPtr	  cur(SelectionContainer());

    while ((bool)cur && steps-->0)
      cur=cur->parentElement;

    MSHTML::IHTMLTxtRangePtr	  r(MSHTML::IHTMLBodyElementPtr(Document()->body)->createTextRange());

    r->moveToElementText(cur);

    ++m_ignore_changes;
    r->select();
    --m_ignore_changes;

    m_cur_sel=cur;
    ::SendMessage(m_frame,WM_COMMAND,MAKELONG(0,IDN_SEL_CHANGE),(LPARAM)m_hWnd);
  }
  catch (_com_error& e) {
    U::ReportError(e);
  }

  return 0;
}

VARIANT_BOOL  CFBEView::OnClick(IDispatch *evt)
{
	MSHTML::IHTMLEventObjPtr oe(evt);
	MSHTML::IHTMLElementPtr elem(oe->srcElement);	

  	m_startMatch = m_endMatch = 0;

	if(!(bool)elem)
		return VARIANT_FALSE;

	MSHTML::IHTMLElementPtr parent_element = elem->parentElement;

	if(!(bool)parent_element)
		return VARIANT_FALSE;

	bstr_t pc = parent_element->className;

	if(!U::scmp(pc, L"image"))
	{
		// make image selected
		IHTMLControlRangePtr r(((MSHTML::IHTMLElement2Ptr)(Document()->body))->createControlRange());
		HRESULT hr = r->add((IHTMLControlElementPtr)elem->parentElement);
		hr = r->select();
		//::SendMessage(m_frame, WM_COMMAND, MAKELONG(IDC_HREF, IDN_WANTFOCUS), (LPARAM)m_hWnd);

		return VARIANT_TRUE;
	}

	if (U::scmp(elem->tagName,L"A"))
	{
		return VARIANT_FALSE;
	}
	/*else
	{
	  ::SendMessage(m_frame, WM_COMMAND, MAKELONG(IDC_HREF, IDN_WANTFOCUS), (LPARAM)m_hWnd);
	  return VARIANT_FALSE;
	}*/

	if(oe->altKey!=VARIANT_TRUE || oe->shiftKey==VARIANT_TRUE || oe->ctrlKey==VARIANT_TRUE)
		return VARIANT_FALSE;

	CString sref(AU::GetAttrCS(elem, L"href"));
	if(sref.IsEmpty() || sref[0] != L'#')
		return VARIANT_FALSE;

	sref.Delete(0);

	MSHTML::IHTMLElementPtr targ(Document()->all->item((const wchar_t*)sref));

	if(!(bool)targ)
		return VARIANT_FALSE;

	GoTo(targ);
	
	oe->cancelBubble = VARIANT_TRUE;
	oe->returnValue = VARIANT_FALSE;

	return VARIANT_TRUE;
}

VARIANT_BOOL  CFBEView::OnRealPaste(IDispatch* evt)
{
	MSHTML::IHTMLEventObjPtr oe(evt);
	oe->cancelBubble = VARIANT_TRUE;
	if(!m_enable_paste)
	{
		// Blocks first OnRealPaste to stop double-insertion
		SendMessage(WM_COMMAND, MAKELONG(ID_EDIT_PASTE, 0), 0);
		oe->returnValue = VARIANT_FALSE;
	}
	else
	{
		oe->returnValue = VARIANT_TRUE;
	}

	return VARIANT_TRUE;
}

bool  CFBEView::IsFormChanged() {
  if (!m_form_changed && (bool)m_cur_input)
    m_form_changed=m_form_changed || m_cur_input->value != m_cur_val;
  return m_form_changed;
}

bool  CFBEView::IsFormCP() {
  if (!m_form_cp && (bool)m_cur_input)
    m_form_cp=m_form_cp || m_cur_input->value != m_cur_val;
  return m_form_cp;
}

void  CFBEView::ResetFormChanged() {
  m_form_changed=false;
  if (m_cur_input)
    m_cur_val=m_cur_input->value;
}

void  CFBEView::ResetFormCP() {
  m_form_cp=false;
  if (m_cur_input)
    m_cur_val=m_cur_input->value;
}

void  CFBEView::OnFocusIn(IDispatch *evt) {
  // check previous value
  if (m_cur_input) {
    bool cv=m_cur_input->value != m_cur_val;
    m_form_changed=m_form_changed || cv;
    m_form_cp=m_form_cp || cv;
    m_cur_input.Release();
  }

  MSHTML::IHTMLEventObjPtr  oe(evt);
  if (!(bool)oe)
    return;

  MSHTML::IHTMLElementPtr   te(oe->srcElement);
  if (!(bool)te || U::scmp(te->tagName,L"INPUT"))
    return;

  m_cur_input=te;
  if (!(bool)m_cur_input)
    return;

  if (U::scmp(m_cur_input->type,L"text")) {
    m_cur_input.Release();
    return;
  }

  m_cur_val=m_cur_input->value;
}

// find/replace support for scintilla
bool CFBEView::SciFindNext(HWND src,bool fFwdOnly,bool fBarf) {
  if (m_fo.pattern.IsEmpty())
    return true;

  int	    flags=0;
  if (m_fo.flags & FRF_WHOLE)
    flags|=SCFIND_WHOLEWORD;
  if (m_fo.flags & FRF_CASE)
    flags|=SCFIND_MATCHCASE;
  if (m_fo.fRegexp)
    flags|=SCFIND_REGEXP|SCFIND_POSIX;
  int rev=m_fo.flags & FRF_REVERSE && !fFwdOnly;
  DWORD   len=::WideCharToMultiByte(CP_UTF8,0,
		  m_fo.pattern,m_fo.pattern.GetLength(),
		  NULL,0,NULL,NULL);
  char    *tmp=(char *)malloc(len+1);
  if (tmp) {
    ::WideCharToMultiByte(CP_UTF8,0,
		  m_fo.pattern,m_fo.pattern.GetLength(),
		  tmp,len,NULL,NULL);
    tmp[len]='\0';
    int p1=::SendMessage(src,SCI_GETSELECTIONSTART,0,0);
    int p2=::SendMessage(src,SCI_GETSELECTIONEND,0,0);
    if (p1!=p2 && !rev)
      ++p1;
    if (rev)
      --p1;
    if (p1<0)
      p1=0;
    p2=rev ? 0 : ::SendMessage(src,SCI_GETLENGTH,0,0);
    int p3=p2==0 ? ::SendMessage(src,SCI_GETLENGTH,0,0) : 0;
    ::SendMessage(src,SCI_SETTARGETSTART,p1,0);
    ::SendMessage(src,SCI_SETTARGETEND,p2,0);
    ::SendMessage(src,SCI_SETSEARCHFLAGS,flags,0);
    // this sometimes hangs in reverse search :)
    int ret=::SendMessage(src,SCI_SEARCHINTARGET,len,(LPARAM)tmp);
    if (ret==-1) { // try wrap
      if (p1!=p3) {
	::SendMessage(src,SCI_SETTARGETSTART,p3,0);
	::SendMessage(src,SCI_SETTARGETEND,p1,0);
	::SendMessage(src,SCI_SETSEARCHFLAGS,flags,0);
	ret=::SendMessage(src,SCI_SEARCHINTARGET,len,(LPARAM)tmp);
      }
      if (ret==-1) {
	free(tmp);
	if (fBarf)
	{
		wchar_t cpt[MAX_LOAD_STRING + 1];
		wchar_t msg[MAX_LOAD_STRING + 1];
		::LoadString(_Module.GetResourceInstance(), IDR_MAINFRAME, cpt, MAX_LOAD_STRING);
		::LoadString(_Module.GetResourceInstance(), IDS_SEARCH_FAIL_MSG, msg, MAX_LOAD_STRING);
		U::MessageBox(MB_OK|MB_ICONEXCLAMATION, cpt, msg,m_fo.pattern);
	}
	return false;
      }
      ::MessageBeep(MB_ICONASTERISK);
    }
    free(tmp);
    p1=::SendMessage(src,SCI_GETTARGETSTART,0,0);
    p2=::SendMessage(src,SCI_GETTARGETEND,0,0);
    ::SendMessage(src,SCI_SETSELECTIONSTART,p1,0);
    ::SendMessage(src,SCI_SETSELECTIONEND,p2,0);
    ::SendMessage(src,SCI_SCROLLCARET,0,0);
    return true;
  } else
  {
    wchar_t msg[MAX_LOAD_STRING + 1];
	wchar_t cpt[MAX_LOAD_STRING + 1];
	::LoadString(_Module.GetResourceInstance(), IDS_OUT_OF_MEM_MSG, msg, MAX_LOAD_STRING);
	::LoadString(_Module.GetResourceInstance(), IDR_MAINFRAME, cpt, MAX_LOAD_STRING);
    ::MessageBox(::GetActiveWindow(), msg, cpt, MB_OK|MB_ICONERROR);
  }

  return false;
}

_bstr_t CFBEView::Selection()
{
	try
	{
		MSHTML::IHTMLTxtRangePtr rng(Document()->selection->createRange());
		if(!(bool)rng)
			return _bstr_t();

		MSHTML::IHTMLTxtRangePtr dup(rng->duplicate());
		dup->collapse(VARIANT_TRUE);

		MSHTML::IHTMLElementPtr elem(dup->parentElement());
		while ((bool)elem && U::scmp(elem->tagName, L"P") && U::scmp(elem->tagName, L"DIV"))
			elem = elem->parentElement;

		if(elem)
		{
			dup->moveToElementText(elem);
			if(rng->compareEndPoints(L"EndToEnd", dup) > 0)
				rng->setEndPoint(L"EndToEnd", dup);
		}

		return rng->text;
	}
	catch (_com_error& err)
	{
		U::ReportError(err);
	}

	return _bstr_t();
}

// Modification by Pilgrim
static bool IsTable(MSHTML::IHTMLDOMNode *node) {
	MSHTML::IHTMLElementPtr   elem(node);
	return U::scmp(elem->className,L"table")==0;
}

static bool IsTR(MSHTML::IHTMLDOMNode *node) {
	MSHTML::IHTMLElementPtr   elem(node);
	return U::scmp(elem->className,L"tr")==0;
}

static bool IsTH(MSHTML::IHTMLDOMNode *node) {
	MSHTML::IHTMLElementPtr   elem(node);
	return U::scmp(elem->className,L"th")==0;
}

static bool IsTD(MSHTML::IHTMLDOMNode *node) {
	MSHTML::IHTMLElementPtr   elem(node);
	return U::scmp(elem->className,L"td")==0;
}

bool CFBEView::GoToFootnote(bool fCheck)
{
	// * create selection range
	MSHTML::IHTMLTxtRangePtr rng(Document()->selection->createRange());
	if (!(bool)rng)
		return false;

	MSHTML::IHTMLTxtRangePtr next_rng = rng->duplicate();
	MSHTML::IHTMLTxtRangePtr prev_rng = rng->duplicate();
	next_rng->moveEnd(L"character", +1);
	prev_rng->moveStart(L"character", -1);

	CString	sref(AU::GetAttrCS(SelectionAnchor(),L"href"));
	if (sref.IsEmpty())
		sref = AU::GetAttrCS(SelectionAnchor(next_rng->parentElement()),L"href");
	if (sref.IsEmpty())
		sref = AU::GetAttrCS(SelectionAnchor(prev_rng->parentElement()),L"href");

	if (sref.Find(L"file") == 0)
		sref = sref.Mid(sref.ReverseFind (L'#'),1024);
	if (sref.IsEmpty() || sref[0]!=_T('#'))
		return false;

	// * ok, all checks passed
	if (fCheck)
		return true;

	sref.Delete(0);

	MSHTML::IHTMLElementPtr     targ(Document()->all->item((const wchar_t *)sref));

	if (!(bool)targ)
		return false;

	MSHTML::IHTMLDOMNodePtr childNode;
	MSHTML::IHTMLDOMNodePtr node(targ);
	if (!(bool)node)
		return false;

	// added by SeNS: move caret to the foornote text
	if (!U::scmp(node->nodeName,L"DIV") && !U::scmp(targ->className,L"section"))
	{
		if (node->firstChild) 
		{
			childNode = node->firstChild;
			while (childNode && !U::scmp(childNode->nodeName,L"DIV") && 
				  (!U::scmp(MSHTML::IHTMLElementPtr(childNode)->className,L"image") || 
				   !U::scmp(MSHTML::IHTMLElementPtr(childNode)->className,L"title"))) 
				childNode=childNode->nextSibling;
		}
	}
	if (!childNode) childNode=node;
	if (childNode)
	{
		GoTo(MSHTML::IHTMLElementPtr(childNode));
		targ->scrollIntoView(true);
	}

	return true; 
}
bool CFBEView::GoToReference(bool fCheck)
{
	// * create selection range
	MSHTML::IHTMLTxtRangePtr	rng(Document()->selection->createRange());
	if (!(bool)rng)
		return false;

	// * get its parent element
	MSHTML::IHTMLElementPtr	pe(GetHP(rng->parentElement()));
	if (!(bool)pe)
		return false;

	if (rng->compareEndPoints(L"StartToEnd",rng)!=0)
		return false;

	while((bool)pe && (U::scmp(pe->tagName,L"DIV")!=0 || U::scmp(pe->className,L"section")!=0)) 
		pe=pe->parentElement; // Find parent division
	if(!(bool)pe) 
		return false;

	MSHTML::IHTMLElementPtr body=pe->parentElement;
	
	while((bool)body && (U::scmp(body->tagName,L"DIV")!=0 || U::scmp(body->className,L"body")!=0)) 
		body=body->parentElement; // Find body

	if(!(bool)body) 
		return false;

	CString	    sfbname(AU::GetAttrCS(body,L"fbname"));	
	if(!(bool)body || sfbname.IsEmpty() || sfbname !="notes") 
		return false;		
	
	// * ok, all checks passed
	if (fCheck)
		return true;

	MSHTML::IHTMLElement2Ptr			elem(Document()->body);
	MSHTML::IHTMLElementCollectionPtr	coll(elem->getElementsByTagName(L"A"));
	if (!(bool)coll || coll->length==0) 
	{
		wchar_t cpt[MAX_LOAD_STRING + 1];
		wchar_t msg[MAX_LOAD_STRING + 1];
		::LoadString(_Module.GetResourceInstance(), IDR_MAINFRAME, cpt, MAX_LOAD_STRING);
		::LoadString(_Module.GetResourceInstance(), IDS_GOTO_REF_FAIL_MSG, msg, MAX_LOAD_STRING);		
		::MessageBox(::GetActiveWindow(), msg, cpt, MB_OK|MB_ICONINFORMATION);
		return false;
	}

	for (long l=0;l<coll->length;++l) {
		MSHTML::IHTMLElementPtr a(coll->item(l));
		if (!(bool)a)
			continue;

		CString	    href(AU::GetAttrCS((MSHTML::IHTMLElementPtr)coll->item(l),L"href"));
		// changed by SeNS
		if (href.Find(L"file") == 0)
			href = href.Mid(href.ReverseFind (L'#'),1024);
		else if(href.Find(_T("://"),0) !=-1)
			continue;

		_variant_t aid = pe->getAttribute(L"id",2);
		CString snote(L"#"+CString(aid));

		if(href==snote){
			GoTo(a);
			MSHTML::IHTMLTxtRangePtr r(MSHTML::IHTMLBodyElementPtr(Document()->body)->createTextRange());
			r->moveToElementText(a);
			r->collapse(VARIANT_TRUE);
			// move selection to position after reference
			CString sa = a->innerText;
			r->move(L"character", sa.GetLength());
			r->select();
		}
	}

	return false;
}

LRESULT CFBEView::OnEditInsertTable(WORD wNotifyCode, WORD wID, HWND hWndCtl)
{
	CTableDlg dlg;
	if(dlg.DoModal()==IDOK) {
		int nRows = dlg.m_nRows;
		bool bTitle = dlg.m_bTitle;
		InsertTable(false,bTitle,nRows);
	}
	return 0;
}

LRESULT CFBEView::OnEditInsImage(WORD, WORD cmdID, HWND, BOOL&)
{
	// added by SeNS
	bool bInline = (cmdID != ID_EDIT_INS_IMAGE);
	
	if(_Settings.GetInsImageAsking())
	{
		CAddImageDlg imgDialog;
		imgDialog.DoModal(*this);
	}

	if(!_Settings.GetIsInsClearImage())
	{
		CFileDialogEx dlg(
			TRUE,
			NULL,
			NULL,
			OFN_FILEMUSTEXIST | OFN_HIDEREADONLY | OFN_PATHMUSTEXIST | OFN_NOCHANGEDIR,
			L"FBE supported (*.jpg;*.jpeg;*.png)\0*.jpg;*.jpeg;*.png\0JPEG (*.jpg)\0*.jpg\0PNG (*.png)\0*.png\0Bitmap (*.bmp"\
			L")\0*.bmp\0GIF (*.gif)\0*.gif\0TIFF (*.tif)\0*.tif\0\0"
			);

		wchar_t dlgTitle[MAX_LOAD_STRING + 1];
		::LoadString(_Module.GetResourceInstance(), IDS_ADD_IMAGE_FILEDLG, dlgTitle, MAX_LOAD_STRING);
		dlg.m_ofn.lpstrTitle = dlgTitle;
		dlg.m_ofn.nFilterIndex = 1;

		if(dlg.DoModal(*this) == IDOK)
		{
			AddImage(dlg.m_szFileName, bInline);
		}
	}
	else
	{
		// added by SeNS
		try {
			if (bInline)
			{
				MSHTML::IHTMLDOMNodePtr node(Call(L"InsInlineImage"));
			}
			else
			{
				MSHTML::IHTMLDOMNodePtr node(Call(L"InsImage"));
				if (node)
					BubbleUp(node,L"DIV");
			}
		}
		catch (_com_error&) { }
	}

	return 0;
}

bool  CFBEView::InsertTable(bool fCheck, bool bTitle, int nrows) {
	try {
		// * create selection range
		MSHTML::IHTMLTxtRangePtr	rng(Document()->selection->createRange());
		if (!(bool)rng)
			return false;

		// * get its parent element
		MSHTML::IHTMLElementPtr	pe(GetHP(rng->parentElement()));
		if (!(bool)pe)
			return false;

		// * get parents for start and end ranges and ensure they are the same as pe
		MSHTML::IHTMLTxtRangePtr	tr(rng->duplicate());
		tr->collapse(VARIANT_TRUE);
		if (GetHP(tr->parentElement())!=pe)
			return false;
#if 0
		tr=rng->duplicate();
		tr->collapse(VARIANT_FALSE);
		if (GetHP(tr->parentElement())!=pe)
			return false;
#endif

		// * check if it possible to insert a table there
		_bstr_t   cls(pe->className);
		if (U::scmp(cls,L"section") && U::scmp(cls,L"epigraph") &&
			U::scmp(cls,L"annotation") && U::scmp(cls,L"history") && U::scmp(cls,L"cite"))
			return false;

		// * ok, all checks passed
		if (fCheck)
			return true;

		// at this point we are ready to create a table

		// * create an undo unit
		m_mk_srv->BeginUndoUnit(L"insert table");

		MSHTML::IHTMLElementPtr	  te(Document()->createElement(L"DIV"));

		for(int row=nrows; row!=-1; --row){	
			// * create tr
			MSHTML::IHTMLElementPtr	  tre(Document()->createElement(L"DIV"));
			tre->className=L"tr";
			// * create th and td
			MSHTML::IHTMLElementPtr	  the(Document()->createElement(L"P"));
			if(row==0){				
				if(bTitle){//Ќужен заголовок таблицы
					the->className=L"th";// * create th - заголовок
					MSHTML::IHTMLElement2Ptr(tre)->insertAdjacentElement(L"afterBegin",the);
				}
			} else {				
				the->className=L"td";// * create td - строки
				MSHTML::IHTMLElement2Ptr(tre)->insertAdjacentElement(L"afterBegin",the);
			}
			
			// * create table
			te->className=L"table";
			MSHTML::IHTMLElement2Ptr(te)->insertAdjacentElement(L"afterBegin",tre);
		}

		// * paste the results back
		rng->pasteHTML(te->outerHTML);

		// * ensure we have good html
		RelocateParagraphs(MSHTML::IHTMLDOMNodePtr(pe));
		FixupParagraphs(pe);

		// * close undo unit
		m_mk_srv->EndUndoUnit();
	}
	catch (_com_error& e) {
		U::ReportError(e);
	}
	return false;
}

long CFBEView::InsertCode()
{	
	if(bCall(L"IsCode", SelectionStructCode()))
	{
		HRESULT hr;
		BeginUndoUnit(L"insert code");
		hr = m_mk_srv->RemoveElement(SelectionStructCode());
		EndUndoUnit();
		return hr == S_OK ? 0 : -1;
	}
	else
	{
		try
		{
			BeginUndoUnit(L"insert code");

			int offset = -1;
			MSHTML::IHTMLTxtRangePtr rng(Document()->selection->createRange());
			if (!(bool)rng) return -1;

			CString rngHTML((wchar_t*)rng->htmlText);

			// empty selection case - select current word
			if(rngHTML == L"")
			{
				// select word
				rng->moveStart(L"word",-1);
				CString txt = rng->text;
				offset = txt.GetLength();
				rng->expand(L"word");
				rngHTML.SetString(rng->htmlText);
			}

			if (iswspace(rngHTML[rngHTML.GetLength()-1])) 
			{
				rng->moveEnd(L"character",-1);
				rngHTML.SetString(rng->htmlText);
				if (offset > rngHTML.GetLength()) offset--;
			}

			// save selection
			MSHTML::IMarkupPointerPtr selBegin, selEnd;
			m_mk_srv->CreateMarkupPointer(&selBegin);
			m_mk_srv->CreateMarkupPointer(&selEnd);
			m_mk_srv->MovePointersToRange(rng, selBegin, selEnd);

			if(rngHTML.Find(L"<P") != -1)
			{
				MSHTML::IHTMLElementPtr spanElem = Document()->createElement(L"<SPAN class=code>");
				MSHTML::IHTMLElementPtr selElem = rng->parentElement();
				
				MSHTML::IHTMLTxtRangePtr rngStart = rng->duplicate();
				MSHTML::IHTMLTxtRangePtr rngEnd = rng->duplicate();
				rngStart->collapse(true);
				rngEnd->collapse(false);

				MSHTML::IHTMLElementPtr elBegin = rngStart->parentElement(), elEnd = rngEnd->parentElement();
				while(U::scmp(elBegin->tagName, L"P")) elBegin = elBegin->parentElement;
				while(U::scmp(elEnd->tagName, L"P")) elEnd = elEnd->parentElement;

				MSHTML::IHTMLDOMNodePtr bNode = elBegin, eNode = elEnd;
				int last = 0;
				while(bNode)
				{
					CString elBeginHTML = elBegin->innerHTML;

					if(U::scmp(elBegin->tagName, L"P") == 0 && elBeginHTML.Find(L"<SPAN") < 0)
					{
						spanElem->innerHTML = elBegin->innerHTML;
						if(!(elBeginHTML.Find(L"<SPAN class=code>") == 0 && 
							elBeginHTML.Find(L"</SPAN>") == elBeginHTML.GetLength() - 7))
						{
							elBegin->innerHTML = spanElem->outerHTML;
						}
					}
					// remove code tag
					else
					{
						elBeginHTML.Replace (L"<SPAN class=code>", L" ");
						elBeginHTML.Replace (L"</SPAN>", L" ");
						elBegin->innerHTML = elBeginHTML.AllocSysString();
					}

					if(bNode == eNode) 
						break;

					bNode = bNode->nextSibling;
					elBegin = bNode;
				}
				// expand selection to the last paragraph
				rng->moveToElementText(elBegin);
				m_mk_srv->MovePointersToRange(rng, NULL, selEnd); 
			}
			else if(rngHTML.Find(L"<SPAN class=code>") != -1 && rngHTML.Find(L"</SPAN>") != -1)
			{
					rngHTML.Replace (L"<SPAN class=code>", L" ");
					rngHTML.Replace (L"</SPAN>", L" ");
					rng->pasteHTML(rngHTML.AllocSysString());
			}
			else
			{
				if (iswspace(rngHTML[0]))
				{
					rng->moveStart(L"character",1);
					rngHTML.SetString(rng->htmlText);
				}
				if (iswspace(rngHTML[rngHTML.GetLength()-1]))
				{
					rng->moveEnd(L"character",-1);
					rngHTML.SetString(rng->htmlText);
				}			
				rngHTML = L"<SPAN class=code>" + rngHTML + L"</SPAN>";
				rng->pasteHTML(rngHTML.AllocSysString());
			}

			// restore selection
			if (offset >= 0)
			{
				rng->move(L"word", -1);
				rng->move(L"character", offset);
				rng->select();
			}
			else
			{
				m_mk_srv->MoveRangeToPointers(selBegin, selEnd, rng);
				rng->select();
			}

			EndUndoUnit();
		}
		catch (_com_error& e)
		{
			U::ReportError(e);
			return -1;
		}

		return 0;
	}
}

int CFBEView::GetRangePos(const MSHTML::IHTMLTxtRangePtr range, MSHTML::IHTMLElementPtr &element, int &pos)
{
	MSHTML::IHTMLTxtRangePtr	tr(range->duplicate());
	tr->collapse(VARIANT_TRUE);

	// * get its parent element
	element = tr->parentElement();

	MSHTML::IHTMLTxtRangePtr btr(range->duplicate());
	btr->moveToElementText(element);
	btr->collapse(VARIANT_TRUE);

	pos = 0;

	MSHTML::IHTMLDOMNodePtr node(element);
	if(!(bool)node)
	{
		return 0;
	}

	int count = 0;
	int cuttedchars = 0;

	node = node->firstChild;
	while(node)
	{
		MSHTML::IHTMLDOMTextNodePtr textNode(node);
		if(!(bool)textNode)
		{
			int skip = CountNodeChars(node);
			cuttedchars += skip;
            btr->move(L"character", skip);
		}
		else
		{
			// провер€ем не проскочили ли мы искомую позицию
			int skip = count + textNode->length;			
			btr->move(L"character", skip);

			if(btr->compareEndPoints(L"StartToStart", tr) != -1)
			{
				btr->move(L"character", -skip);
				break;
			}
			pos += skip;
		}
		
		node = node->nextSibling;
	}

	// тупа€ проверка. 
	// если курсор стоит сразу после тега, то tr оказываетс€ справа от brt и при этом никогда не бывает равен ему
	int k = btr->compareEndPoints(L"StartToStart", tr);
	if(k == -1)
	{
		int res = btr->move(L"character", 1);		
		if (res != 1)
		{
			return 0;
		}
		if(btr->compareEndPoints(L"StartToStart", tr) != 1)
		{
			++pos;
		}
	}

	while(btr->compareEndPoints(L"StartToStart", tr) == -1)
	{
		++pos;	
		int res = btr->move(L"character", 1);		
		if (res != 1)
		{
			return 0;
		}
	}

	return pos;
}

bool CFBEView::GetSelectionInfo(MSHTML::IHTMLElementPtr *begin, MSHTML::IHTMLElementPtr *end, int* begin_char, int* end_char, MSHTML::IHTMLTxtRangePtr range)
{
	*begin_char = 0;
	*end_char = 0;

	int b = 0;
	int e = 0;

	bool one_elment = false;
	// * create selection range
	MSHTML::IHTMLTxtRangePtr	rng;	
	if(!(bool)range)
	{
		IDispatchPtr disp(Document()->selection->createRange());
		rng = disp;
		if (!(bool)rng)
		{
			// если не получилось сделать textrange, пробуем сделать control range
			MSHTML::IHTMLControlRangePtr  coll(disp);
			if (!(bool)coll)
			{
				return false;
			}	
			*begin = coll->item(0);
			*end = coll->item(coll->length - 1);
			return true;
		}
	}
	else
		rng = range;

	bstr_t text = rng->text;

	MSHTML::IHTMLTxtRangePtr	tr(rng->duplicate());
	tr->collapse(VARIANT_TRUE);

	// * get its parent element
	*begin = tr->parentElement();
	if (!(bool)(*begin))
		return false;

	// ищем позицию относительно начала;
	this->GetRangePos(tr, *begin, b);

	tr = rng->duplicate();
	tr->collapse(VARIANT_FALSE);
	*end = tr->parentElement();
	if (*end == *begin)
	{
		one_elment = true;
	}

	this->GetRangePos(tr, *end, e);

	MSHTML::IHTMLDOMNodePtr nodeb(*begin);
	MSHTML::IHTMLDOMNodePtr nodee(*end);
	if(!(bool)nodeb || !(bool)nodee)
	{
		return false;
	}

	/*b = this->GetRelationalCharPos(nodeb, b);
	e = this->GetRelationalCharPos(nodee, e);*/
	
	*begin_char = b;
	*end_char = e;

	return true;
}

MSHTML::IHTMLTxtRangePtr CFBEView::SetSelection(MSHTML::IHTMLElementPtr begin, MSHTML::IHTMLElementPtr end, int begin_pos, int end_pos)
{
	if(!(bool)begin)
	{
		return 0;
	}
	if(!(bool)end)
	{
		end = begin;
		end_pos = begin_pos;
	}

	begin_pos = this->GetRealCharPos(begin, begin_pos);
	end_pos = this->GetRealCharPos(end, end_pos);

	MSHTML::IHTMLTxtRangePtr rng(MSHTML::IHTMLBodyElementPtr(Document()->body)->createTextRange());
	if(!(bool)rng)
	{
		return 0;
	}

	// устанавливаем начало выделенной строки
	MSHTML::IHTMLTxtRangePtr rng_begin(rng->duplicate());
	rng_begin->moveToElementText(begin);
	rng_begin->collapse(VARIANT_TRUE);
	rng_begin->moveStart(L"character", begin_pos);

	if(begin == end)
	{
		rng_begin->moveEnd(L"character", end_pos - begin_pos);
		HRESULT hr = rng_begin->select();		
		
		return rng_begin;
	}

	MSHTML::IHTMLTxtRangePtr rng_end(rng->duplicate());
	rng_end->moveToElementText(end);
	rng_end->moveStart(L"character", end_pos);

	// раздвигаем регион
	rng_begin->setEndPoint(L"EndToStart", rng_end);

	rng_begin->select();
	

	return rng_begin;
}

int CFBEView::GetRelationalCharPos(MSHTML::IHTMLDOMNodePtr node, int pos)
{
	if(!(bool)node)
	{
		return 0;
	}

	int relpos = 0;
	int cuttedchars = 0;

	node = node->firstChild;
	while(node)
	{
		MSHTML::IHTMLDOMTextNodePtr textNode(node);
		if(!(bool)textNode)
		{
			cuttedchars += CountNodeChars(node);			
		}
		else
		{
			if(relpos + cuttedchars + textNode->length >= pos)
			{
				return pos - cuttedchars;
			}
			relpos += textNode->length;
		}
		node = node->nextSibling;
	}

	return 0;
}

int CFBEView::GetRealCharPos(MSHTML::IHTMLDOMNodePtr node, int pos)
{
	if(!(bool)node)
	{
		return 0;
	}

	int realpos = 0;
	int cuttedchars = 0;

	node = node->firstChild;
	while(node)
	{
		MSHTML::IHTMLDOMTextNodePtr textNode(node);
		if(!(bool)textNode)
		{
			cuttedchars += CountNodeChars(node);			
		}
		else
		{
			if((realpos + textNode->length) >= pos)
			{
				return pos + cuttedchars;
			}
			realpos += textNode->length;
		}
		node = node->nextSibling;
	}

	return 0;
}

int CFBEView::CountNodeChars(MSHTML::IHTMLDOMNodePtr node)
{
	if(!(bool)node)
	{
		return 0;
	}

	int count = 0;

	node = node->firstChild;
	while(node)
	{
		MSHTML::IHTMLDOMTextNodePtr textNode(node);
		if(!(bool)textNode)
		{
			count += CountNodeChars(node);
		}		
		else
		{
			count += textNode->length;
		}
		node = node->nextSibling;
	}

	return count;
}

bool CFBEView::CloseFindDialog(CFindDlgBase* dlg)
{
	if(!dlg || !dlg->IsValid())
		return false;

	dlg->DestroyWindow();
	return true;
}

bool CFBEView::CloseFindDialog(CReplaceDlgBase* dlg)
{
	if(!dlg || !dlg->IsValid())
		return false;

	dlg->DestroyWindow();
	return true;
}

bool CFBEView::ExpandTxtRangeToParagraphs(MSHTML::IHTMLTxtRangePtr& rng,
											MSHTML::IHTMLElementPtr& begin,
											MSHTML::IHTMLElementPtr& end) const
{
	MSHTML::IHTMLTxtRangePtr tr1 = rng->duplicate(); 
	tr1->collapse(true);

	MSHTML::IHTMLElementPtr te = GetHP(tr1->parentElement());

	if(!(bool)te)
		return false;

	MSHTML::IHTMLTxtRangePtr tr2 = rng->duplicate(); 
	tr2->collapse(false);

	begin = tr1->parentElement(); 
	while((bool)begin && U::scmp(begin->tagName, L"P"))
		begin = begin->parentElement;

	if(!(bool)begin)
		return false;

	end = tr2->parentElement();
	while((bool)end && U::scmp(end->tagName, L"P"))
		end = end->parentElement;

	if(!(bool)end)
		return false;

	if(begin == end)
		rng->moveToElementText(begin);
	else
	{
		MSHTML::IMarkupPointerPtr pBegin, pEnd;
		m_mk_srv->CreateMarkupPointer(&pBegin);
		m_mk_srv->CreateMarkupPointer(&pEnd);
		pBegin->MoveAdjacentToElement(begin, MSHTML::ELEM_ADJ_AfterBegin);
		pEnd->MoveAdjacentToElement(end, MSHTML::ELEM_ADJ_BeforeEnd);
		m_mk_srv->MoveRangeToPointers(pBegin, pEnd, rng);
	}

	return true;
}

LRESULT CFBEView::OnCode(WORD wCode, WORD wID, HWND hWnd, BOOL& bHandled)
{
	return InsertCode();
}

bool CFBEView::SelectionHasTags(wchar_t* elem)
{
	try
	{
		MSHTML::IHTMLTxtRangePtr range = Document()->selection->createRange();
		if(range)
		{
			CString html = range->htmlText;
			if(html.Find(CString(L"<") + elem) != -1)
				return true;
		}
	}
	catch(_com_error& err)
	{
		U::ReportError(err);
		return false;
	}

	return false;
}

BSTR CFBEView::PrepareDefaultId(const CString& filename){

    CString _filename = U::Transliterate(filename);
	// prepare a default id
	int cp = _filename.ReverseFind(_T('\\'));
	if (cp < 0)
		cp = 0;
	else
		++cp;
	CString   newid;
	TCHAR	    *ncp=newid.GetBuffer(_filename.GetLength()-cp);
	int	    newlen=0;
	while (cp<_filename.GetLength()) {
		TCHAR   c=_filename[cp];
		if ((c>=_T('0') && c<=_T('9')) ||
			(c>=_T('A') && c<=_T('Z')) ||
			(c>=_T('a') && c<=_T('z')) ||
			c==_T('_') || c==_T('.'))
			ncp[newlen++]=c;
		++cp;
	}
	newid.ReleaseBuffer(newlen);
	if (!newid.IsEmpty() && !(
		(newid[0]>=_T('A') && newid[0]<=_T('Z')) ||
		(newid[0]>=_T('a') && newid[0]<=_T('z')) ||
		newid[0]==_T('_')))
		newid.Insert(0,_T('_'));
	return newid.AllocSysString();
}

// images
void CFBEView::AddImage(const CString& filename, bool bInline)
{
	_variant_t args[4];

	V_BSTR(&args[3]) = filename.AllocSysString();
	V_VT(&args[3]) = VT_BSTR;

	HRESULT hr;
	if(FAILED(hr = U::LoadFile(filename, &args[0])))
	{
		U::ReportError(hr);
		return;
	}

	// Prepare a default ID
	int cp = filename.ReverseFind(_T('\\'));
	if (cp < 0)
		cp = 0;
	else
		++cp;

	V_BSTR(&args[2]) = PrepareDefaultId(filename);
	V_VT(&args[2]) = VT_BSTR;

	// Try to find out mime type
	V_BSTR(&args[1]) = U::GetMimeType(filename).AllocSysString();
	V_VT(&args[1]) = VT_BSTR;

	// Stuff the thing into JavaScript
	try
	{
		CComDispatchDriver body(Script());
		_variant_t checkedId;
		hr = body.InvokeN(L"apiAddBinary", args, 4, &checkedId);

		if(FAILED(hr))
			U::ReportError(hr);

		hr = body.Invoke0(L"FillCoverList");

		if(FAILED(hr))
			U::ReportError(hr);

		_variant_t check(false);
		if (bInline)
			hr = body.Invoke2(L"InsInlineImage", &check, &checkedId);
		else
			hr = body.Invoke2(L"InsImage", &check, &checkedId);
		if (FAILED(hr))
			U::ReportError(hr);

		MSHTML::IHTMLDOMNodePtr node(NULL);
		if(node)
			BubbleUp(node, L"DIV");
	}
	catch (_com_error&) { }
}
