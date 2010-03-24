#pragma once

#include "TreeView.h"

#include "AppUtils.h"

typedef CWinTraits<WS_CHILD|WS_VISIBLE|ES_AUTOHSCROLL|ES_LEFT, WS_EX_CLIENTEDGE>
		  CDocumentTreeWinTraits;

class CTreeWithToolBar : public CFrameWindowImpl<CTreeWithToolBar, CWindow, CDocumentTreeWinTraits>
{
private:	
	WTL::CToolBarCtrl m_toolbar;
	WTL::CToolBarCtrl m_element_browser_tb;
	WTL::CReBarCtrl m_rebar;
	int m_toolbarOrientation;
	int m_maxTbwidth;

	CCommandBarCtrl m_view_bar;
	CMenu m_st_menu;

public:
		CTreeView m_tree;

private:
	enum Orientation
	{
		/*left,
		right,*/
		top,
		bottom
	};

public:
	DECLARE_FRAME_WND_CLASS(_T("DocumentTreeFrame"), IDR_DOCUMENT_TREE)
	void GetDocumentStructure(MSHTML::IHTMLDocument2Ptr& v);
	void UpdateDocumentStructure(MSHTML::IHTMLDocument2Ptr& v,MSHTML::IHTMLDOMNodePtr node);
	void HighlightItemAtPos(MSHTML::IHTMLElement *p);
	CTreeItem GetSelectedItem();

	BEGIN_MSG_MAP(CDocumentTree)
		MESSAGE_HANDLER(WM_CREATE, OnCreate)
		MESSAGE_HANDLER(WM_CLOSE, OnClose)
		MESSAGE_HANDLER(WM_DESTROY, OnDestroy)
		MESSAGE_HANDLER(WM_SIZE, OnSize)

		COMMAND_ID_HANDLER(ID_DT_RIGHT, ForwardWMCommand)
		COMMAND_ID_HANDLER(ID_DT_LEFT, ForwardWMCommand)
		COMMAND_ID_HANDLER(ID_DOCUMENT_TREE_CUT, ForwardWMCommand)
		COMMAND_ID_HANDLER(ID_DOCUMENT_TREE_PASTE, ForwardWMCommand)
		COMMAND_ID_HANDLER(ID_DT_DELETE, ForwardWMCommand)
		COMMAND_ID_HANDLER(ID_DT_RIGHT_ONE, ForwardWMCommand)
		COMMAND_ID_HANDLER(ID_DT_RIGHT_SMART, ForwardWMCommand)
		COMMAND_ID_HANDLER(ID_DT_RIGHT_WITH_CHILDREN, ForwardWMCommand)

		// menu commands
		COMMAND_RANGE_HANDLER(IDC_TREE_BASE, IDC_TREE_BASE + 99, OnMenuCommand)
		COMMAND_RANGE_HANDLER(IDC_TREE_ST_BASE, IDC_TREE_ST_BASE + 99, OnMenuStCommand)
		COMMAND_ID_HANDLER(IDC_TREE_CLEAR_ALL, OnMenuClear);
		
		REFLECT_NOTIFICATIONS();
//		CHAIN_MSG_MAP(CPaneContainer);
	END_MSG_MAP()
	
	LRESULT OnCreate(UINT, WPARAM, LPARAM, BOOL&);
	LRESULT OnClose(UINT, WPARAM, LPARAM, BOOL&);
	LRESULT OnDestroy(UINT, WPARAM, LPARAM, BOOL&);
	LRESULT OnSize(UINT, WPARAM, LPARAM, BOOL&);

	LRESULT ForwardWMCommand(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled);

	LRESULT OnMenuCommand(WORD, WORD wID, HWND, BOOL&);
	LRESULT OnMenuStCommand(WORD, WORD wID, HWND, BOOL&);
	LRESULT OnMenuClear(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled);
	
private:
	BOOL ModifyStyle(DWORD dwRemove, DWORD dwAdd, UINT nFlags = 0) throw();
	void FillViewBar();
	//ViewElements(unsigned)
};

class CDocumentTree : public CPaneContainer						
{
private:	
//	CTreeView m_tree;
//	CSplitterWindow m_dummy_pane;
	WTL::CToolBarCtrl m_toolbar;
	WTL::CReBarCtrl m_rebar;	
//	WTL::CToolBarCtrl m_title;

public:
	CTreeWithToolBar m_tree;
	//CTreeView m_tree;

public:
	CDocumentTree(){};

	// TreeView methods
	void GetDocumentStructure(MSHTML::IHTMLDocument2Ptr& v);
	void UpdateDocumentStructure(MSHTML::IHTMLDocument2Ptr& v,MSHTML::IHTMLDOMNodePtr node);
	void HighlightItemAtPos(MSHTML::IHTMLElement *p);
	CTreeItem GetSelectedItem();

	BEGIN_MSG_MAP(CDocumentTree)
		MESSAGE_HANDLER(WM_CREATE, OnCreate)
		MESSAGE_HANDLER(WM_CLOSE, OnClose)
		MESSAGE_HANDLER(WM_DESTROY, OnDestroy)		

		CHAIN_MSG_MAP(CPaneContainer);
	END_MSG_MAP()
	
	LRESULT OnCreate(UINT, WPARAM, LPARAM, BOOL&);
	LRESULT OnClose(UINT, WPARAM, LPARAM, BOOL&);
	LRESULT OnDestroy(UINT, WPARAM, LPARAM, BOOL&);
};
