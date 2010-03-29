// MainFrm.h : interface of the CMainFrame class
//
/////////////////////////////////////////////////////////////////////////////

#if !defined(AFX_MAINFRM_H__38D356D4_C28B_47B0_A7AD_8C6B70F7F283__INCLUDED_)
#define AFX_MAINFRM_H__38D356D4_C28B_47B0_A7AD_8C6B70F7F283__INCLUDED_

#include "stdafx.h"
#include <dlgs.h>
#include "resource.h"
#include "res1.h"

#include "utils.h"
#include "apputils.h"

#include "FBEView.h"
#include "FBDoc.h"
#include "TreeView.h"
#include "OptDlg.h"
#include "ContainerWnd.h"
#include "Scintilla.h"
#include "FBE.h"
#include "Words.h"
#include "SearchReplace.h"
#include "DocumentTree.h"
#include "Speller.h"

#if _MSC_VER >= 1000
#pragma once
#pragma warning(disable : 4996)
#endif // _MSC_VER >= 1000

typedef CWinTraits<WS_CHILD|WS_VISIBLE|ES_AUTOHSCROLL|ES_LEFT,WS_EX_CLIENTEDGE> CCustomEditWinTraits;

class CCustomEdit : public CWindowImpl<CCustomEdit,CEdit,CCustomEditWinTraits>, public CEditCommands<CCustomEdit>
{
public:
	DECLARE_WND_SUPERCLASS(NULL, CEdit::GetWndClassName())

	CCustomEdit() { }

	BEGIN_MSG_MAP(CCustomEdit)
		MESSAGE_HANDLER(WM_CHAR, OnChar)
		CHAIN_MSG_MAP_ALT(CEditCommands<CCustomEdit>, 1)
	END_MSG_MAP()

	LRESULT OnChar(UINT, WPARAM wParam, LPARAM, BOOL& bHandled)
	{
		if(wParam == VK_RETURN)
			::PostMessage(::GetParent(GetParent()), WM_COMMAND,MAKELONG(GetDlgCtrlID(), IDN_ED_RETURN), (LPARAM)m_hWnd);

		bHandled = FALSE;
		return 0;
	}
};

class CCustomStatic : public CWindowImpl<CCustomStatic,CStatic/*,CCustomStaticWinTraits*/>
{
private:
	HFONT m_font;
	bool m_enabled;
public:
	CCustomStatic():m_font(0), m_enabled(0){}

	void DoPaint(CDCHandle dc)
    {		
      RECT rc;
      GetClientRect(&rc);
	  /*HBRUSH hBr = GetSysColorBrush(COLOR_3DFACE);
	  HPEN pen = CreatePen(PS_SOLID, 1, GetSysColor(COLOR_3DFACE));
	  HBRUSH oldBrush = (HBRUSH)SelectObject(dc, hBr);
	  HPEN oldPen = (HPEN)SelectObject(dc, pen);
	  Rectangle(dc, rc.left, rc.top, rc.right, rc.bottom);
	  SelectObject(dc, oldBrush);
	  SelectObject(dc, oldPen);*/
      DWORD dwStyle = GetStyle();
	  HFONT oldFont = (HFONT)SelectObject(dc, m_font);

      UINT iFlags = DT_SINGLELINE | DT_CENTER | DT_VCENTER;      

      int len = GetWindowTextLength();
      wchar_t* text = new wchar_t[len+1];
      GetWindowText(text, len+1);

      dc.SetBkMode(TRANSPARENT);
	  if(m_enabled)
	  {
		  dc.SetTextColor(GetSysColor(COLOR_BTNTEXT));
	  }
	  else
	  {
		  dc.SetTextColor(GetSysColor(COLOR_GRAYTEXT));
	  }
	  dc.DrawText(text, -1, &rc, iFlags);      
	  SelectObject(dc, oldFont);
	  delete []text;
    }

	LRESULT OnPaint(UINT, WPARAM wParam, LPARAM, BOOL&)
	{
		if(wParam != NULL) {
         DoPaint((HDC)wParam);
      }
      else {
         CPaintDC dc(m_hWnd);
         DoPaint(dc.m_hDC);
      }
      return 0;
	}
	
	void SetFont(HFONT pFont)
	{
		m_font = pFont;
	}

	void SetEnabled(bool Enabled = true)
	{
		m_enabled = Enabled;
		Invalidate();
	}

	BEGIN_MSG_MAP(CCustomStatic)
		//MESSAGE_HANDLER(WM_CREATE, OnCreate)
		MESSAGE_HANDLER(WM_PAINT, OnPaint)
	END_MSG_MAP()
};	

class CTableToolbarsWindow: public CFrameWindowImpl<CTableToolbarsWindow>,
		   public CUpdateUI<CTableToolbarsWindow>
{
public:
	  BEGIN_UPDATE_UI_MAP(CTableToolbarsWindow)

  END_UPDATE_UI_MAP()
};

class CMainFrame :	public CFrameWindowImpl<CMainFrame>,
					public CUpdateUI<CMainFrame>,
					public CMessageFilter,
					public CIdleHandler
{
public:
	enum FILE_OP_STATUS
	{
		FAIL,
		OK,
		CANCELLED
	};

	DECLARE_FRAME_WND_CLASS(_T("FictionBookEditorFrame"), IDR_MAINFRAME)

	CSciFindDlg*	m_sci_find_dlg;
	CSciReplaceDlg*	m_sci_replace_dlg;

	// Child windows
	CSplitterWindow		m_splitter; // doc tree and views
	CContainerWnd		m_view; // document, description and source
	//CPaneContainer	m_tree_pane; // left pane with a tree
	//CSplitterWindow		m_dummy_pane; // frame around the tree
	//CTreeView			m_tree; // treeview itself
	CDocumentTree		m_document_tree;

  CMultiPaneStatusBarCtrl m_status; // status bar
  wchar_t strINS[MAX_LOAD_STRING + 1];
  wchar_t strOVR[MAX_LOAD_STRING + 1];

	CCommandBarCtrl	m_CmdBar; // menu bar
	CReBarCtrl		m_rebar; // toolbars
	CComboBox		m_id_box;
	CComboBox		m_href_box;
	CComboBox		m_image_title_box;
	CCustomEdit		m_image_title; // paragraph ID
	CCustomEdit		m_id; // paragraph ID
	CCustomEdit		m_href; // link's href
	CWindow			m_source; // source editor
	//bool			m_save_sp_mode;

  CComboBox		  m_section_box;
  CCustomEdit	  m_section;	// ID ??? <section>
  // ???????? ?????? ??????
  CComboBox		  m_id_table_id_box;
  CCustomEdit	  m_id_table_id;	  // Table ID
  CComboBox		  m_id_table_box;
  CCustomEdit	  m_id_table;		  // ID
  CComboBox		  m_styleT_table_box;
  CCustomEdit	  m_styleT_table;     // style ??? <table>
  CComboBox		  m_style_table_box;
  CCustomEdit	  m_style_table;      // style
  CComboBox		  m_colspan_table_box;
  CCustomEdit	  m_colspan_table;    // colspan
  CComboBox		  m_rowspan_table_box;
  CCustomEdit	  m_rowspan_table;    // rowspan
  CComboBox		  m_align_table_box;
  CCustomEdit	  m_alignTR_table;    // align ??? <tr>
  CComboBox		  m_alignTR_table_box;
  CCustomEdit	  m_align_table;      // align
  CComboBox		  m_valign_table_box;
  CCustomEdit	  m_valign_table;     // valign

  CRecentDocumentList	  m_mru; // MRU list

  CCustomStatic   m_id_caption;
  CCustomStatic   m_href_caption;
  CCustomStatic   m_section_id_caption;
  CCustomStatic   m_image_title_caption;
  CCustomStatic   m_table_id_caption;
  CCustomStatic   m_table_style_caption;
  CCustomStatic   m_id_table_caption;
  CCustomStatic   m_style_caption;
  CCustomStatic   m_colspan_caption;
  CCustomStatic   m_rowspan_caption;
  CCustomStatic   m_tr_allign_caption;
  CCustomStatic   m_th_allign_caption;
  CCustomStatic   m_valign_caption;  

  FB::Doc		  *m_doc; // currently open document
  DWORD			  m_last_tree_update;
  BOOL			  m_last_sci_ovr:1;
  bool			  m_last_ie_ovr:1;
  bool			  m_doc_changed:1;
  bool			  m_sel_changed:1;
  bool			  m_change_state:1;
  bool			  m_need_title_update:1;

  MSXML2::IXMLDOMDocumentPtr		m_saved_xml;


  // IDs in combobox
  bool			  m_cb_updated:1;
  bool			  m_cb_last_images:1; // images or plain ids?
  bool			  m_ignore_cb_changes:1;

  int			  m_want_focus; // focus this control when idle

  CString		  m_status_msg; // message to be posted to frame's status line

  
  // incremental search helpers
  CString		  m_is_str;
  CString		  m_is_prev;
  int			  m_incsearch;
  bool			  m_is_fail;

  // Script structure (either for scripts files or for scripts folders)
  struct ScrInfo
  {
	  CString name;
	  CString path;
	  CString order;
	  HANDLE picture;
	  int pictType;
	  int Type;
	  CString id;
	  CString refid;
	  bool isFolder;
	  int wID;
	  /*ACCEL accel;*/
  };

  // Script small menu icon (16x16) type
  enum ScrPictType
  {
	  NO_PICT,
	  BITMAP,
	  ICON	  
  };

  CSimpleArray<ScrInfo>	 m_scripts;
  CSimpleMap<unsigned int, HBITMAP> m_scripts_images;
  void CollectScripts(CString path, TCHAR* mask, int lastid, CString refid);
  int GrabScripts(CString, TCHAR*, CString);
  void AddScriptsSubMenu(HMENU, CString, CSimpleArray<ScrInfo>&);
  void QuickScriptsSort(CSimpleArray<ScrInfo>&, int, int);
  void UpScriptsFolders(CSimpleArray<ScrInfo>&);
  ScrInfo* m_last_script;
  void InitScriptHotkey(CMainFrame::ScrInfo&);

  // contruction/destruction
  CMainFrame() : m_doc(0), m_cb_updated(false),
    m_doc_changed(false), m_sel_changed(false), m_want_focus(0),
    m_ignore_cb_changes(false), m_incsearch(0), m_cb_last_images(false),
    m_last_ie_ovr(true), m_last_sci_ovr(true), m_saved_xml(0), m_sci_find_dlg(0), m_sci_replace_dlg(0),
	m_last_script(0), m_last_plugin(0)
	// added by SeNS
	{ 
		TCHAR prgPath[MAX_PATH];
		DWORD pathlen = ::GetModuleFileName(_Module.GetModuleInstance(), prgPath, MAX_PATH);
		PathRemoveFileSpec(prgPath);
		if (_Settings.GetUseSpellChecker())
		{
			m_Speller = new CSpeller(CString(prgPath)+L"\\dict\\");
		}
		else
		{
			m_Speller = NULL;
		}
	}
  ~CMainFrame(); 
  // toolbars
  bool	  IsBandVisible(int id);
  
  // browser controls
  void	  AttachDocument(FB::Doc *doc);
  CFBEView& ActiveView() {
/*    return m_doc->m_desc==m_view.GetActiveWnd() ?
	      m_doc->m_desc : m_doc->m_body;*/
	  return m_doc->m_body;
  }
  //bool	  IsSourceActive() { return m_source==m_view.GetActiveWnd(); }
  bool	  IsSourceActive() 
  { 
	  return m_current_view == SOURCE; 
  }

  // document structure
  void	  GetDocumentStructure();
  void	  GoTo(MSHTML::IHTMLElement *elem);
  void	  GoTo(int selected_pos);

  // loading/saving support
  CString GetOpenFileName();
  CString GetSaveFileName(CString& encoding);
  bool	  SaveToFile(const CString& filename);
  bool	  DiscardChanges();

  FILE_OP_STATUS	  SaveFile(bool askname);
  FILE_OP_STATUS	  LoadFile(const wchar_t *initfilename=NULL);

  // show a specific view
  enum VIEW_TYPE { BODY, DESC, SOURCE, NEXT };
  void	  ShowView(VIEW_TYPE vt=BODY);
  bool	  ShowSource(bool saveSelection = true);
  //VIEW_TYPE GetCurView();

  
  VIEW_TYPE		  m_current_view;
  VIEW_TYPE		  m_last_view;
  VIEW_TYPE		  m_last_ctrl_tab_view;
  bool			  m_ctrl_tab;
  unsigned __int64 m_file_age;

  MSHTML::IHTMLTxtRangePtr m_body_selection;
  MSHTML::IHTMLTxtRangePtr m_desc_selection;

  void SaveSelection(VIEW_TYPE vt);  
  void RestoreSelection(); 
  void ClearSelection();

	// Plugins support
	CSimpleArray<CLSID> m_import_plugins;
	CSimpleArray<CLSID> m_export_plugins;
	void InitPlugins();
	void InitPluginsType(HMENU hMenu, const TCHAR* type, UINT cmdbase, CSimpleArray<CLSID>& plist);
	void InitPluginHotkey(CString guid, UINT cmd, CString name);
	UINT m_last_plugin;

  void		AddStaticText(CCustomStatic &st, HWND toolbarHwnd, int id, const TCHAR *text, HFONT hFont);


  // ui updating
  void	  UIUpdateViewCmd(CFBEView& view,WORD wID,OLECMD& oc,const TCHAR *hk);
  void	  UIUpdateViewCmd(CFBEView& view,WORD wID) { UIEnable(wID,view.CheckCommand(wID)); }
  void	  UISetCheckCmd(CFBEView& view, WORD wID)
  {
	  UISetCheck(wID, view.CheckSetCommand(wID));
  }

  void	  StopIncSearch(bool fCancel);
  void	  SetIsText();

  // source editor
  void	  DefineMarker(int marker, int markerType, COLORREF fore,COLORREF back);
  void	  SetupSci();

  // source folding
  void	  FoldAll();
  void	  ExpandFold(int &line, bool doExpand, bool force = false,
		     int visLevels = 0, int level = -1);

  // source editor styles
  void	  SetSciStyles();

	// source<->html exchange
	bool SourceToHTML();

	// track changes depending on current view
	bool DocChanged();

	// message handlers
	virtual BOOL PreTranslateMessage(MSG* pMsg);
	virtual BOOL OnIdle();
  
	BEGIN_UPDATE_UI_MAP(CMainFrame)
		// ui windows
		UPDATE_ELEMENT(ATL_IDW_BAND_FIRST, UPDUI_MENUPOPUP)
		UPDATE_ELEMENT(ATL_IDW_BAND_FIRST+1, UPDUI_MENUPOPUP)
		UPDATE_ELEMENT(ATL_IDW_BAND_FIRST+2, UPDUI_MENUPOPUP)
		UPDATE_ELEMENT(ATL_IDW_BAND_FIRST+3, UPDUI_MENUPOPUP)
		UPDATE_ELEMENT(ATL_IDW_BAND_FIRST+4, UPDUI_MENUPOPUP)

		UPDATE_ELEMENT(ID_VIEW_STATUS_BAR, UPDUI_MENUPOPUP)
		UPDATE_ELEMENT(ID_VIEW_FASTMODE, UPDUI_MENUPOPUP)
		UPDATE_ELEMENT(ID_VIEW_TREE, UPDUI_MENUPOPUP)
		UPDATE_ELEMENT(ID_VIEW_DESC, UPDUI_MENUPOPUP| UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_VIEW_BODY, UPDUI_MENUPOPUP| UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_VIEW_SOURCE, UPDUI_MENUPOPUP| UPDUI_TOOLBAR)

		// editing commands
		UPDATE_ELEMENT(ID_EDIT_UNDO, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_REDO, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_CUT, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_COPY, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_PASTE, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_BOLD, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_ITALIC, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_STRIK, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_SUP, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_SUB, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_CODE, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_FINDNEXT, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_STYLE_NORMAL, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_STYLE_SUBTITLE, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_STYLE_TEXTAUTHOR, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_TOOLS_SPELLCHECK, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_STYLE_LINK, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_STYLE_NOTE, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_STYLE_NOLINK, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_ADD_TITLE, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_ADD_BODY, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_ADD_TA, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_CLONE, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_INS_IMAGE, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_INS_INLINEIMAGE, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_ADD_IMAGE, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_ADD_EPIGRAPH, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_ADD_ANN, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_SPLIT, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_INS_POEM, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_INS_CITE, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_INSERT_TABLE, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_GOTO_FOOTNOTE, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_GOTO_REFERENCE, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)

		UPDATE_ELEMENT(ID_EDIT_MERGE, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
		UPDATE_ELEMENT(ID_EDIT_REMOVE_OUTER_SECTION, UPDUI_MENUPOPUP|UPDUI_TOOLBAR)
	END_UPDATE_UI_MAP()

	BEGIN_MSG_MAP(CMainFrame)
		MESSAGE_HANDLER(WM_CREATE, OnCreate)
		MESSAGE_HANDLER(AU::WM_POSTCREATE, OnPostCreate)
		MESSAGE_HANDLER(WM_CLOSE, OnClose)
		MESSAGE_HANDLER(WM_DESTROY, OnDestroy)
		MESSAGE_HANDLER(WM_SETFOCUS, OnSetFocus)
		MESSAGE_HANDLER(WM_SETTINGCHANGE, OnSettingChange)
		#if _WIN32_WINNT>=0x0501
			MESSAGE_HANDLER(WM_THEMECHANGED, OnSettingChange)
		#endif
		MESSAGE_HANDLER(WM_DROPFILES, OnDropFiles)
		MESSAGE_HANDLER(AU::WM_SETSTATUSTEXT, OnSetStatusText)
		MESSAGE_HANDLER(AU::WM_TRACKPOPUPMENU, OnTrackPopupMenu)

		// incremental search support
		MESSAGE_HANDLER(WM_CHAR, OnChar)
		MESSAGE_HANDLER(WM_COMMAND, OnPreCommand)
		MESSAGE_HANDLER(WM_SIZE, OnSize)

		// tree view notifications
		COMMAND_CODE_HANDLER(IDN_TREE_CLICK, OnTreeClick)
		COMMAND_CODE_HANDLER(IDN_TREE_RETURN, OnTreeReturn)
		COMMAND_CODE_HANDLER(IDN_TREE_MOVE_ELEMENT, OnTreeMoveElement)
		COMMAND_CODE_HANDLER(IDN_TREE_MOVE_ELEMENT_ONE, OnTreeMoveElementOne)
		COMMAND_CODE_HANDLER(IDN_TREE_MOVE_LEFT, OnTreeMoveLeftElement)
		COMMAND_CODE_HANDLER(IDN_TREE_MOVE_ELEMENT_SMART, OnTreeMoveElementSmart)
		COMMAND_CODE_HANDLER(IDN_TREE_VIEW_ELEMENT, OnTreeViewElement)
		COMMAND_CODE_HANDLER(IDN_TREE_VIEW_ELEMENT_SOURCE, OnTreeViewElementSource)
		COMMAND_CODE_HANDLER(IDN_TREE_DELETE_ELEMENT, OnTreeDeleteElement)
		COMMAND_CODE_HANDLER(IDN_TREE_MERGE, OnTreeMerge)
		COMMAND_CODE_HANDLER(IDN_TREE_UPDATE_ME, OnTreeUpdate)

		// file menu
		COMMAND_ID_HANDLER(ID_APP_EXIT, OnFileExit)
		COMMAND_ID_HANDLER(ID_FILE_NEW, OnFileNew)
		COMMAND_ID_HANDLER(ID_FILE_OPEN, OnFileOpen)
		COMMAND_ID_HANDLER(ID_FILE_SAVE, OnFileSave)
		COMMAND_ID_HANDLER(ID_FILE_SAVE_AS, OnFileSaveAs)
		COMMAND_ID_HANDLER(ID_FILE_VALIDATE, OnFileValidate)

		COMMAND_RANGE_HANDLER(ID_EXPORT_BASE,ID_EXPORT_BASE + 19, OnToolsExport)
		COMMAND_RANGE_HANDLER(ID_IMPORT_BASE,ID_IMPORT_BASE + 19, OnToolsImport)
		COMMAND_ID_HANDLER(ID_LAST_PLUGIN, OnLastPlugin)

		COMMAND_RANGE_HANDLER(ID_FILE_MRU_FIRST,ID_FILE_MRU_LAST,OnFileOpenMRU)
		COMMAND_RANGE_HANDLER(ID_SCI_COLLAPSE1, ID_SCI_COLLAPSE9,OnSciCollapse)
		COMMAND_RANGE_HANDLER(ID_SCI_EXPAND1, ID_SCI_EXPAND9,OnSciExpand)

		// edit menu
		COMMAND_ID_HANDLER(ID_EDIT_INCSEARCH, OnEditIncSearch)
		COMMAND_ID_HANDLER(ID_EDIT_ADDBINARY, OnEditAddBinary)
		COMMAND_ID_HANDLER(ID_EDIT_FIND, OnEditFind)
		COMMAND_ID_HANDLER(ID_EDIT_FINDNEXT, OnEditFind)
		COMMAND_ID_HANDLER(ID_EDIT_REPLACE, OnEditFind)
		COMMAND_RANGE_HANDLER(ID_EDIT_INS_SYMBOL, ID_EDIT_INS_SYMBOL + 100, OnEditInsSymbol)

		// added by SeNS
		// popup menu (speller addons)
		COMMAND_ID_HANDLER(IDC_SPELL_IGNOREALL, OnSpellIgnoreAll)
		COMMAND_ID_HANDLER(IDC_SPELL_ADD2DICT, OnSpellAddToDict)
		COMMAND_ID_HANDLER(IDC_SPELL_REPLACE, OnSpellReplace)
		COMMAND_ID_HANDLER(IDC_SPELL_REPLACE+1, OnSpellReplace)
		COMMAND_ID_HANDLER(IDC_SPELL_REPLACE+2, OnSpellReplace)
		COMMAND_ID_HANDLER(IDC_SPELL_REPLACE+3, OnSpellReplace)
		COMMAND_ID_HANDLER(IDC_SPELL_REPLACE+4, OnSpellReplace)
		COMMAND_ID_HANDLER(IDC_SPELL_REPLACE+5, OnSpellReplace)
		COMMAND_ID_HANDLER(IDC_SPELL_REPLACE+6, OnSpellReplace)
		COMMAND_ID_HANDLER(IDC_SPELL_REPLACE+7, OnSpellReplace)

		COMMAND_ID_HANDLER(ID_VER_ADVANCE, OnVersionAdvance)

		// view menu
		COMMAND_ID_HANDLER(ATL_IDW_BAND_FIRST, OnViewToolBar)
		COMMAND_ID_HANDLER(ATL_IDW_BAND_FIRST+1, OnViewToolBar)
		COMMAND_ID_HANDLER(ATL_IDW_BAND_FIRST+2, OnViewToolBar)
		COMMAND_ID_HANDLER(ATL_IDW_BAND_FIRST+3, OnViewToolBar)
		COMMAND_ID_HANDLER(ATL_IDW_BAND_FIRST+4, OnViewToolBar)
		COMMAND_ID_HANDLER(ATL_IDW_BAND_FIRST+5, OnViewToolBar)
		COMMAND_ID_HANDLER(ATL_IDW_BAND_FIRST+6, OnViewToolBar)
		COMMAND_ID_HANDLER(ATL_IDW_BAND_FIRST+7, OnViewToolBar)
		COMMAND_ID_HANDLER(ID_VIEW_STATUS_BAR, OnViewStatusBar)
		COMMAND_ID_HANDLER(ID_VIEW_FASTMODE, OnViewFastMode)
		COMMAND_ID_HANDLER(ID_VIEW_TREE, OnViewTree)
		COMMAND_ID_HANDLER(ID_VIEW_DESC, OnViewDesc)
		COMMAND_ID_HANDLER(ID_VIEW_BODY, OnViewBody)
		COMMAND_ID_HANDLER(ID_VIEW_SOURCE, OnViewSource)
		COMMAND_ID_HANDLER(ID_VIEW_OPTIONS, OnViewOptions)

		// tools menu
		COMMAND_ID_HANDLER(ID_TOOLS_WORDS, OnToolsWords)
		COMMAND_ID_HANDLER(ID_TOOLS_OPTIONS, OnToolsOptions)
		COMMAND_RANGE_HANDLER(ID_SCRIPT_BASE, ID_SCRIPT_BASE + 999, OnToolsScript)
		COMMAND_ID_HANDLER(ID_LAST_SCRIPT, OnLastScript)

		COMMAND_ID_HANDLER(ID_TOOLS_SPELLCHECK, OnSpellCheck);

		// help menu
		COMMAND_ID_HANDLER(ID_APP_ABOUT, OnAppAbout)

		// navigation commands
		COMMAND_ID_HANDLER(ID_SELECT_TREE, OnSelectCtl)
		COMMAND_ID_HANDLER(ID_SELECT_ID, OnSelectCtl)
		COMMAND_ID_HANDLER(ID_SELECT_HREF, OnSelectCtl)
		COMMAND_ID_HANDLER(ID_SELECT_IMAGE, OnSelectCtl)
		COMMAND_ID_HANDLER(ID_SELECT_TEXT, OnSelectCtl)
		COMMAND_ID_HANDLER(ID_NEXT_ITEM, OnNextItem)
		COMMAND_ID_HANDLER(ID_SELECT_SECTION, OnSelectCtl)
		COMMAND_ID_HANDLER(ID_SELECT_IDT, OnSelectCtl)
		COMMAND_ID_HANDLER(ID_SELECT_STYLET, OnSelectCtl)
		COMMAND_ID_HANDLER(ID_SELECT_STYLE, OnSelectCtl)
		COMMAND_ID_HANDLER(ID_SELECT_COLSPAN, OnSelectCtl)
		COMMAND_ID_HANDLER(ID_SELECT_ROWSPAN, OnSelectCtl)
		COMMAND_ID_HANDLER(ID_SELECT_ALIGNTR, OnSelectCtl)
		COMMAND_ID_HANDLER(ID_SELECT_ALIGN, OnSelectCtl)
		COMMAND_ID_HANDLER(ID_SELECT_VALIGN, OnSelectCtl)

		// editor notifications
		COMMAND_CODE_HANDLER(IDN_SEL_CHANGE, OnEdSelChange)
		COMMAND_CODE_HANDLER(IDN_ED_CHANGED, OnEdChange)
		COMMAND_CODE_HANDLER(IDN_ED_TEXT, OnEdStatusText)
		COMMAND_CODE_HANDLER(IDN_WANTFOCUS, OnEdWantFocus)
		COMMAND_CODE_HANDLER(IDN_ED_RETURN, OnEdReturn)
		COMMAND_CODE_HANDLER(IDN_NAVIGATE, OnNavigate)
		COMMAND_CODE_HANDLER(EN_KILLFOCUS, OnEdKillFocus)
		COMMAND_CODE_HANDLER(CBN_EDITCHANGE, OnCbEdChange)
		COMMAND_CODE_HANDLER(CBN_SELENDOK, OnCbSelEndOk)
		COMMAND_CODE_HANDLER(IDN_FAST_MODE_CHANGE, OnFastModeChange)
		COMMAND_HANDLER(IDC_HREF,CBN_SETFOCUS, OnCbSetFocus)

		// source code editor notifications
		NOTIFY_CODE_HANDLER(SCN_MODIFIED, OnSciModified)
		NOTIFY_CODE_HANDLER(SCN_MARGINCLICK, OnSciMarginClick)

		// tree pane
		COMMAND_ID_HANDLER(ID_PANE_CLOSE, OnViewTree)

		// FBEview calls to process messages without FBEview focused
		COMMAND_ID_HANDLER_EX(ID_GOTO_FOOTNOTE, OnGoToFootnote)
		COMMAND_ID_HANDLER_EX(ID_GOTO_REFERENCE, OnGoToReference)

		// chain commands to active view
		MESSAGE_HANDLER(WM_COMMAND, OnUnhandledCommand)

		CHAIN_MSG_MAP(CUpdateUI<CMainFrame>)
		CHAIN_MSG_MAP(CFrameWindowImpl<CMainFrame>)
	END_MSG_MAP()

  LRESULT OnCreate(UINT, WPARAM, LPARAM, BOOL&);
  LRESULT OnClose(UINT, WPARAM, LPARAM, BOOL&);
  LRESULT OnDestroy(UINT, WPARAM, LPARAM, BOOL&);
  LRESULT OnPostCreate(UINT, WPARAM, LPARAM, BOOL&);
  LRESULT OnSettingChange(UINT, WPARAM, LPARAM, BOOL&) {
    if (m_doc)
      m_doc->ApplyConfChanges();
    return 0;
  }
  LRESULT OnUnhandledCommand(UINT, WPARAM, LPARAM, BOOL&);
  LRESULT OnSetFocus(UINT, WPARAM, LPARAM, BOOL&) {
    m_view.SetFocus();
	UpdateViewSizeInfo();
    return 0;
  }
  LRESULT OnDropFiles(UINT, WPARAM, LPARAM, BOOL&);
  LRESULT OnSetStatusText(UINT, WPARAM, LPARAM lParam, BOOL&) {
    m_status_msg=(const TCHAR *)lParam;
    return 0;
  }

	LRESULT OnTrackPopupMenu(UINT, WPARAM, LPARAM lParam, BOOL&)
	{
		AU::TRACKPARAMS* tp = (AU::TRACKPARAMS*)lParam;
		// added by SeNS
		if (m_Speller) m_Speller->AppendSpellMenu(tp->hMenu);
		m_CmdBar.TrackPopupMenu(tp->hMenu, tp->uFlags, tp->x, tp->y);
		return 0;
	}

	LRESULT OnChar(UINT, WPARAM, LPARAM, BOOL&);
	LRESULT OnPreCommand(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
	{
		bHandled = FALSE;
		if((HIWORD(wParam) == 0 || HIWORD(wParam) == 1) && LOWORD(wParam) != ID_EDIT_INCSEARCH)
		StopIncSearch(true);
		return 0;
	}

	LRESULT OnFileExit(WORD, WORD, HWND, BOOL&)
	{
		PostMessage(WM_CLOSE);
		return 0;
	}
	LRESULT OnFileNew(WORD, WORD, HWND, BOOL&);
	LRESULT OnFileOpen(WORD, WORD, HWND, BOOL&);
	LRESULT OnFileOpenMRU(WORD, WORD, HWND, BOOL&);
	LRESULT OnFileSave(WORD, WORD, HWND, BOOL&);
	LRESULT OnFileSaveAs(WORD, WORD, HWND, BOOL&);
	LRESULT OnFileValidate(WORD, WORD, HWND, BOOL&);
	LRESULT OnToolsImport(WORD, WORD, HWND, BOOL&);
	LRESULT OnToolsExport(WORD, WORD, HWND, BOOL&);
	LRESULT OnLastPlugin(WORD, WORD, HWND, BOOL&);

	LRESULT OnEditIncSearch(WORD, WORD, HWND, BOOL&);
	LRESULT OnEditAddBinary(WORD, WORD, HWND, BOOL&);
	LRESULT OnEditFind(WORD, WORD, HWND, BOOL& bHandled)
	{
		if(m_current_view == DESC)
			ShowView(BODY);

		bHandled = FALSE;
		return 0;
	}
	LRESULT OnEditInsSymbol(WORD, WORD, HWND, BOOL&);

	// added by SeNS
	LRESULT OnSpellReplace(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
	{ 
		if (m_Speller)
		{
			m_doc->m_body.BeginUndoUnit(L"replace word");
			m_Speller->Replace (wID - IDC_SPELL_REPLACE);
			m_doc->m_body.EndUndoUnit();
		}
		return 0; 
	}
	LRESULT OnSpellIgnoreAll(WORD, WORD, HWND, BOOL&) 
	{ 
		if (m_Speller) m_Speller->IgnoreAll();
		return 0; 
	}
	LRESULT OnSpellAddToDict(WORD, WORD, HWND, BOOL&) 
	{ 
		if (m_Speller) m_Speller->AddToDictionary();
		return 0; 
	}

	LRESULT OnVersionAdvance(WORD delta, WORD, HWND, BOOL&)
	{
		m_doc->AdvanceDocVersion(delta);
		return 0;
	}

  LRESULT OnViewToolBar(WORD, WORD, HWND, BOOL&);
  LRESULT OnViewStatusBar(WORD, WORD, HWND, BOOL&);
  LRESULT OnViewFastMode(WORD, WORD, HWND, BOOL&);
  LRESULT OnViewTree(WORD, WORD, HWND, BOOL&);
  LRESULT OnViewDesc(WORD, WORD, HWND, BOOL&) {
    ShowView(DESC);
    return 0;
  }
  LRESULT OnViewBody(WORD, WORD, HWND, BOOL&) {
    ShowView(BODY);
    return 0;
  }
  LRESULT OnViewSource(WORD, WORD, HWND, BOOL&) {
    ShowView(SOURCE);
    return 0;
  }
  LRESULT OnViewOptions(WORD, WORD, HWND, BOOL&);

  LRESULT OnToolsWords(WORD, WORD, HWND, BOOL&);
  LRESULT OnToolsOptions(WORD, WORD, HWND, BOOL&);
  LRESULT OnToolsScript(WORD, WORD, HWND, BOOL&);

	LRESULT OnLastScript(WORD, WORD, HWND, BOOL&)
	{
		if(m_last_script != 0 && !IsSourceActive())
		{
			m_doc->RunScript((*m_last_script).path.GetBuffer());
		}
		return 0;
	}

  LRESULT OnAppAbout(WORD, WORD, HWND, BOOL&);

  LRESULT OnSelectCtl(WORD, WORD, HWND, BOOL&);
  LRESULT OnNextItem(WORD, WORD, HWND, BOOL&);

  LRESULT OnEdSelChange(WORD, WORD, HWND hWndCtl, BOOL&) {
    m_sel_changed=true;
    StopIncSearch(true);
    return 0;
  }
  LRESULT OnFastModeChange(WORD, WORD mode, HWND hWndCtl, BOOL&) 
  {
	  UISetCheck(ID_VIEW_FASTMODE, mode);
	  return 0;
  }
  LRESULT OnEdStatusText(WORD, WORD, HWND hWndCtl, BOOL&) {
    StopIncSearch(true);
    m_status.SetText(ID_DEFAULT_PANE,(const TCHAR *)hWndCtl);
    return 0;
  }
  LRESULT OnEdWantFocus(WORD, WORD wID, HWND, BOOL&) {
    m_want_focus=wID;
    return 0;
  }
  LRESULT OnEdReturn(WORD, WORD, HWND, BOOL&) {
    m_view.SetFocus();
    return 0;
  }
  LRESULT OnNavigate(WORD, WORD, HWND, BOOL&);

	LRESULT OnCbSetFocus(WORD, WORD, HWND, BOOL&)
	{
		if(!m_cb_updated)
		{
			m_ignore_cb_changes = true;

			CString str(U::GetWindowText(m_href));

			m_href_box.ResetContent();
			m_href.SetWindowText(str);
			m_href.SetSel(0, str.GetLength() + 1);
			m_ignore_cb_changes = false;

			if(m_cb_last_images)
				m_doc->BinIDsToComboBox(m_href_box);
			else
				m_doc->ParaIDsToComboBox(m_href_box); 
			m_cb_updated = true;
		}

		return 0;
	}

  void ChangeNBSP(MSHTML::IHTMLElementPtr elem);

  LRESULT OnEdChange(WORD, WORD, HWND, BOOL&) {
    StopIncSearch(true);
    m_doc_changed=true;
    m_cb_updated=false;
	// added by SeNS - update 
	UpdateViewSizeInfo();
	// added by SeNS - process nbsp
	if (_Settings.GetNBSPChar().Compare(L"\u00A0") != 0)
		ChangeNBSP(m_doc->m_body.SelectionContainer());

	// added by SeNS - do spellcheck
	if (m_Speller && m_Speller->Enabled() && m_current_view == BODY) 
		m_Speller->CheckElement(m_doc->m_body.SelectionContainer(), -1, m_doc->m_body.IsHTMLChanged());

	return 0;
  }
  LRESULT OnCbEdChange(WORD, WORD, HWND, BOOL&);
  LRESULT OnCbSelEndOk(WORD code, WORD wID, HWND hWnd, BOOL&) {
    PostMessage(WM_COMMAND,MAKELONG(wID,CBN_EDITCHANGE),(LPARAM)hWnd);
    return 0;
  }

  LRESULT OnEdKillFocus(WORD, WORD, HWND, BOOL&) {
    StopIncSearch(true);
    return 0;
  }

  LRESULT OnTreeReturn(WORD, WORD, HWND, BOOL&);
  LRESULT OnTreeClick(WORD, WORD, HWND, BOOL&);
  LRESULT OnTreeMoveElement(WORD, WORD, HWND, BOOL&);
  LRESULT OnTreeMoveElementOne(WORD, WORD, HWND, BOOL&);
  LRESULT OnTreeMoveElementSmart(WORD, WORD, HWND, BOOL&);
  LRESULT OnTreeMoveLeftElement(WORD, WORD, HWND, BOOL&);
  //LRESULT OnTreeMoveLeftElementOne(WORD, WORD, HWND, BOOL&);
  //LRESULT OnTreeMoveElementWithChildren(WORD, WORD, HWND, BOOL&);
  LRESULT OnTreeViewElement(WORD, WORD, HWND, BOOL&);
  LRESULT OnTreeViewElementSource(WORD, WORD, HWND, BOOL&);
  LRESULT OnTreeDeleteElement(WORD, WORD, HWND, BOOL&);
  LRESULT OnTreeMerge(WORD, WORD, HWND, BOOL&);
  LRESULT OnTreeUpdate(WORD, WORD, HWND, BOOL&);

  LRESULT OnGoToFootnote(WORD wNotifyCode, WORD wID, HWND hWndCtl)
  {
	  m_doc->m_body.GoToFootnote(false);
	  return 0;
  }

  LRESULT OnGoToReference(WORD wNotifyCode, WORD wID, HWND hWndCtl)
  {
	  m_doc->m_body.GoToReference(false);
	  return 0;
  }

  LRESULT OnSciModified(int id,NMHDR *hdr,BOOL& bHandled) {
    if (hdr->hwndFrom!=m_source) {
      bHandled=FALSE;
      return 0;
    }
    SciModified(*(SCNotification*)hdr);
    return 0;
  }

  LRESULT OnSciMarginClick(int id,NMHDR *hdr,BOOL& bHandled) {
    if (hdr->hwndFrom!=m_source) {
      bHandled=FALSE;
      return 0;
    }
    SciMarginClicked(*(SCNotification*)hdr);
    return 0;
  }

	LRESULT OnSciCollapse(WORD cose, WORD wID, HWND, BOOL&);  
	LRESULT OnSciExpand(WORD cose, WORD wID, HWND, BOOL&);  

	void SciModified(const SCNotification& scn);
	void SciMarginClicked(const SCNotification& scn);
	void SciCollapse(int level2Collapse, bool mode);

	void GoToSelectedTreeItem();
	MSHTML::IHTMLDOMNodePtr MoveRightElementWithoutChildren(MSHTML::IHTMLDOMNodePtr node);
	MSHTML::IHTMLDOMNodePtr MoveRightElement(MSHTML::IHTMLDOMNodePtr node);
	MSHTML::IHTMLDOMNodePtr MoveLeftElement(MSHTML::IHTMLDOMNodePtr node);
	MSHTML::IHTMLDOMNodePtr RecoursiveMoveRightElement(CTreeItem item);

	MSHTML::IHTMLDOMNodePtr GetFirstChildSection(MSHTML::IHTMLDOMNodePtr node);
	MSHTML::IHTMLDOMNodePtr GetNextSiblingSection(MSHTML::IHTMLDOMNodePtr node);
	MSHTML::IHTMLDOMNodePtr GetPrevSiblingSection(MSHTML::IHTMLDOMNodePtr node);
	MSHTML::IHTMLDOMNodePtr GetLastChildSection(MSHTML::IHTMLDOMNodePtr node);
	bool IsNodeSection(MSHTML::IHTMLDOMNodePtr node);
	bool IsEmptySection(MSHTML::IHTMLDOMNodePtr section);
	MSHTML::IHTMLDOMNodePtr CreateNestedSection(MSHTML::IHTMLDOMNodePtr section);
	bool IsEmptyText(BSTR text);
	void SourceGoTo(int line, int linePos);
	unsigned __int64 FileAge(LPCTSTR FileName);
	bool CheckFileTimeStamp();
	bool ReloadFile();
	void UpdateFileTimeStamp();
	bool ShowSettingsDialog(HWND parent = ::GetActiveWindow());
	void ApplyConfChanges();
	void RestartProgram();
	void FillMenuWithHkeys(HMENU);

	// added by SeNS
    CSpeller *m_Speller;
	LRESULT OnSpellCheck(WORD, WORD, HWND, BOOL&)
	{
		if (m_Speller)
			m_Speller->StartDocumentCheck(m_doc->m_body.m_mk_srv);
		return S_OK;
	}

	// added by SeNS - paste pictures
	bool BitmapInClipboard()
	{
		bool result = false;
		if (OpenClipboard())
		{
			if ( IsClipboardFormatAvailable(CF_BITMAP)) result = true;
			CloseClipboard();
		}
		return result;
	}

    // added by SeNS
	void UpdateViewSizeInfo()
	{
		if (m_doc && m_doc->m_body)
			if (m_doc->m_body.Document())
			{
				MSHTML::IHTMLElement2Ptr m_scrollElement = MSHTML::IHTMLDocument3Ptr(m_doc->m_body.Document())->documentElement;
				if (m_scrollElement)
				{
					_Settings.SetViewWidth (m_scrollElement->clientWidth);
					_Settings.SetViewHeight(m_scrollElement->clientHeight);
				}
			}
	}

	LRESULT OnSize(UINT, WPARAM, LPARAM, BOOL& bHandled)
	{
		UpdateViewSizeInfo();
		bHandled = FALSE;
		return 0;
	}
};

int	StartScript(CMainFrame* mainframe);
void	StopScript(void);
HRESULT	ScriptLoad(const wchar_t *filename);
HRESULT	ScriptCall(const wchar_t *func,VARIANT *arg, int argnum, VARIANT *ret);
bool	ScriptFindFunc(const wchar_t *func);

/////////////////////////////////////////////////////////////////////////////

//{{AFX_INSERT_LOCATION}}
// Microsoft Visual C++ will insert additional declarations immediately before the previous line.

#endif // !defined(AFX_MAINFRM_H__38D356D4_C28B_47B0_A7AD_8C6B70F7F283__INCLUDED_)
