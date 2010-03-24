#pragma once

#include "TreeView.h"

typedef CWinTraits<WS_CHILD|WS_VISIBLE|ES_AUTOHSCROLL|ES_LEFT, WS_EX_CLIENTEDGE>
		  CDocumentTreeWinTraits;

class CTreeWithToolBar : public CFrameWindowImpl<CTreeWithToolBar, CWindow, CDocumentTreeWinTraits>
{
private:	
	WTL::CToolBarCtrl m_toolbar;
	WTL::CReBarCtrl m_rebar;
	int m_toolbarOrientation;
	int m_maxTbwidth;

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
		COMMAND_ID_HANDLER(ID_DT_MERGE, ForwardWMCommand)

		REFLECT_NOTIFICATIONS();
//		CHAIN_MSG_MAP(CPaneContainer);
	END_MSG_MAP()
	
	LRESULT OnCreate(UINT, WPARAM, LPARAM, BOOL&);
	LRESULT OnClose(UINT, WPARAM, LPARAM, BOOL&);
	LRESULT OnDestroy(UINT, WPARAM, LPARAM, BOOL&);
	LRESULT OnSize(UINT, WPARAM, LPARAM, BOOL&);

	LRESULT ForwardWMCommand(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled);
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