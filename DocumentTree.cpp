#include "stdafx.h"
#include "resource.h"
#include "res1.h"

#include "DocumentTree.h"



LRESULT CTreeWithToolBar::OnCreate(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	m_toolbarOrientation = CTreeWithToolBar::bottom;

	LRESULT lRet = DefWindowProc(uMsg, wParam, lParam);

	m_tree.Create(*this, rcDefault);
	m_tree.SetBkColor(::GetSysColor(COLOR_WINDOW));
	m_rebar = CFrameWindowImplBase<>::CreateSimpleReBarCtrl(*this, WS_CHILD | WS_VISIBLE | WS_CLIPCHILDREN | WS_CLIPSIBLINGS | CCS_NODIVIDER | CCS_NOPARENTALIGN | CS_HREDRAW);
	m_toolbar = CFrameWindowImplBase<>::CreateSimpleToolBarCtrl(*this, IDR_DOCUMENT_TREE, FALSE, ATL_SIMPLE_TOOLBAR_PANE_STYLE);
	CFrameWindowImplBase<>::AddSimpleReBarBandCtrl(m_rebar , m_toolbar);

	m_maxTbwidth = 1000;
	::MoveWindow(m_rebar, 0, 0, m_maxTbwidth, 0, true);

	m_toolbar.HideButton(ID_DT_RIGHT_WITH_CHILDREN);
	m_toolbar.HideButton(ID_DT_RIGHT);
	m_toolbar.HideButton(ID_DT_LEFT);
	m_toolbar.HideButton(ID_DOCUMENT_TREE_CUT);
	m_toolbar.HideButton(ID_DOCUMENT_TREE_PASTE);
	m_toolbar.HideButton(ID_DT_DELETE);

    bHandled=FALSE;
    return lRet;
}


LRESULT CTreeWithToolBar::OnDestroy(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	bHandled=FALSE;
	return 0;
}

LRESULT CTreeWithToolBar::OnClose(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{    
	return 0;
}

LRESULT CTreeWithToolBar::OnSize(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	RECT clientRect = {0, 0, 0, 0};
	RECT rebarRect = {0, 0, 0, 0};
	RECT treeRect = {0, 0, 0, 0};
	
	this->GetClientRect(&clientRect);
	::GetWindowRect(m_toolbar, &rebarRect);
	int rebarHight = rebarRect.bottom - rebarRect.top + (/*GetSystemMetrics(SM_CYDLGFRAME) + */GetSystemMetrics(SM_CYEDGE))*2;
	rebarRect.left = treeRect.left = clientRect.left;
	rebarRect.right = treeRect.right = clientRect.right;

	bool moved = false;

	if(m_toolbarOrientation == CTreeWithToolBar::bottom)
	{
		if(rebarRect.top != clientRect.bottom - rebarHight)
			moved = true;

		rebarRect.top = clientRect.bottom - rebarHight;
		
		rebarRect.bottom = rebarRect.top + rebarHight;

		treeRect.top = clientRect.top;
		treeRect.bottom = rebarRect.top;
	}

	if(m_toolbarOrientation == CTreeWithToolBar::top)
	{
		rebarRect.top = clientRect.top;
		rebarRect.bottom = rebarRect.top + rebarHight;

		treeRect.top = rebarRect.bottom ;
		treeRect.bottom = clientRect.bottom;
	}

	if((rebarRect.right - rebarRect.left) > m_maxTbwidth || moved)
	{
		::MoveWindow(m_rebar, rebarRect.left, rebarRect.top, rebarRect.right - rebarRect.left, rebarRect.bottom - rebarRect.top, true);
		m_maxTbwidth = rebarRect.right - rebarRect.left;
	}
	
	::MoveWindow(m_tree, treeRect.left, treeRect.top, treeRect.right - treeRect.left, treeRect.bottom - treeRect.top, true);
	return 0;
}

void CTreeWithToolBar::GetDocumentStructure(MSHTML::IHTMLDocument2Ptr& v)
{
	m_tree.GetDocumentStructure(v);
}

void CTreeWithToolBar::UpdateDocumentStructure(MSHTML::IHTMLDocument2Ptr& v,MSHTML::IHTMLDOMNodePtr node)
{
	m_tree.UpdateDocumentStructure(v, node);
}

void CTreeWithToolBar::HighlightItemAtPos(MSHTML::IHTMLElement *p)
{
	m_tree.HighlightItemAtPos(p);
}

CTreeItem CTreeWithToolBar::GetSelectedItem()
{
	return m_tree.GetSelectedItem();
}

LRESULT CTreeWithToolBar::ForwardWMCommand(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	DWORD wParam = MAKELONG(wID, wNotifyCode);
	DWORD lParam = (LPARAM)hWndCtl;
	return ::SendMessage(m_tree, WM_COMMAND, wParam, lParam);	
}


//==================================================================================================================


LRESULT CDocumentTree::OnCreate(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	LRESULT lRet = DefWindowProc(uMsg, wParam, lParam);

	m_tree.Create(*this, rcDefault);
	m_tree.m_tree.SetMainwindow(GetParent());
	this->SetClient(m_tree);

	wchar_t capt[MAX_LOAD_STRING + 1];
	::LoadString(_Module.GetResourceInstance(), IDS_DOCUMENT_TREE_CAPTION, capt, MAX_LOAD_STRING);
	this->SetTitle(capt);    
    bHandled=FALSE;
    return lRet;
}



//WS_DLGFRAME  | WS_CHILD | WS_VISIBLE | WS_CLIPCHILDREN | WS_CLIPSIBLINGS | CCS_NODIVIDER | CCS_NOPARENTALIGN | TBSTYLE_TOOLTIPS | TBSTYLE_BUTTON | TBSTYLE_AUTOSIZE

LRESULT CDocumentTree::OnDestroy(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	bHandled=FALSE;
	return 0;
}

LRESULT CDocumentTree::OnClose(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	return 0;
}

void CDocumentTree::GetDocumentStructure(MSHTML::IHTMLDocument2Ptr& v)
{
	m_tree.GetDocumentStructure(v);
}

void CDocumentTree::UpdateDocumentStructure(MSHTML::IHTMLDocument2Ptr& v,MSHTML::IHTMLDOMNodePtr node)
{
	m_tree.UpdateDocumentStructure(v, node);
}

void CDocumentTree::HighlightItemAtPos(MSHTML::IHTMLElement *p)
{
	m_tree.HighlightItemAtPos(p);
}

CTreeItem CDocumentTree::GetSelectedItem()
{
	return m_tree.GetSelectedItem();
}
