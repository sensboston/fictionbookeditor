// FBEView.h : interface of the CFBEView class
//
/////////////////////////////////////////////////////////////////////////////

#include <atlcrack.h>
#if !defined(AFX_FBEVIEW_H__E0C71279_419D_4273_93E3_57F6A57C7CFE__INCLUDED_)
#define AFX_FBEVIEW_H__E0C71279_419D_4273_93E3_57F6A57C7CFE__INCLUDED_

#if _MSC_VER >= 1000
#pragma once
#pragma warning(disable : 4996)
#endif // _MSC_VER >= 1000

#include "resource.h"
#include "Settings.h"
#include "CFileDialogEx.h"

extern CSettings _Settings;

void BubbleUp(MSHTML::IHTMLDOMNode *node, const wchar_t *name);

class CTableDlg : public CDialogImpl<CTableDlg>,
	public CWinDataExchange<CTableDlg> {
public:
	enum { IDD = IDD_TABLE };

	CButton	m_chekTitle;
	CEdit m_eRows;
	CUpDownCtrl m_udRows;

	int m_nRows;		// Выбранное число строк
	bool m_bTitle;		// Нужна ли строка заголовков таблицы (true - да)

	BEGIN_MSG_MAP(CTableDlg)
		MESSAGE_HANDLER(WM_INITDIALOG, OnInitDialog)
		COMMAND_ID_HANDLER(IDOK, OnOK)
		COMMAND_ID_HANDLER(IDCANCEL, OnCloseCmd)
		COMMAND_RANGE_CODE_HANDLER_EX(IDC_EDIT_TABLE_ROWS, IDC_EDIT_TABLE_ROWS, EN_CHANGE, OnEditChange)//изменения в эдитах
		REFLECT_NOTIFICATIONS()//Отправить обратно извещающие сообщения от контрола
	END_MSG_MAP()

	//карта DDX обмена
	BEGIN_DDX_MAP(CTableDlg)
		DDX_INT(IDC_EDIT_TABLE_ROWS, m_nRows)
		//DDX_CHECK(IDC_CHECK_TABLE_TITLE, m_bTitle)
	END_DDX_MAP()

	LRESULT OnInitDialog(UINT, WPARAM, LPARAM, BOOL&) {
		DoDataExchange(FALSE, IDC_EDIT_TABLE_ROWS);//запись значений из переменных в контрол(по FALSE)
		//m_nRows = 1; 
		m_bTitle = true;

		m_chekTitle	= GetDlgItem(IDC_CHECK_TABLE_TITLE);
		m_eRows		= GetDlgItem(IDC_EDIT_TABLE_ROWS);
		m_udRows	= GetDlgItem(IDC_SPIN_TABLE_ROWS);

		m_chekTitle.SetCheck(1);
		m_eRows.SetWindowText(_T("1"));
		m_eRows.SetSelAll(TRUE);
		m_eRows.SetFocus();

		m_udRows.SetRange(1, 1000);
		m_udRows.SetPos(1);

		return 0;
	}
	LRESULT OnOK(WORD, WORD wID, HWND, BOOL&) {
		
		m_bTitle = false;
		if(m_chekTitle.GetCheck() == BST_CHECKED) {
			m_bTitle = true;
		}
		
		EndDialog(wID);
		return IDOK;
	}

	LRESULT OnCloseCmd(WORD, WORD wID, HWND, BOOL&) {
		EndDialog(wID);
		return IDCANCEL;
	}

	//на изменения в эдите
	LRESULT OnEditChange(UINT, int id, HWND)
	{		
		static BOOL bAlreadyThere = FALSE;

		if(!bAlreadyThere) {
			bAlreadyThere = TRUE;
			DoDataExchange(TRUE, id);

			static int IDs = IDC_EDIT_TABLE_ROWS;
			if(IDs != id)
				DoDataExchange(FALSE, IDs);
			bAlreadyThere = FALSE;
		}
		return 0;
	}
};

static void CenterChildWindow(CWindow parent, CWindow child)
{
	RECT rcParent, rcChild;
	parent.GetWindowRect(&rcParent);
	child.GetWindowRect(&rcChild);
	int parentW = rcParent.right - rcParent.left;;
	int parentH = rcParent.bottom - rcParent.top;
	int childW = rcChild.right - rcChild.left;
	int childH = rcChild.bottom - rcChild.top;
	child.MoveWindow(rcParent.left + parentW/2 - childW/2, rcParent.top + parentH/2 - childH/2, childW, childH);
}

class CAddImageDlg : public CDialogImpl<CAddImageDlg>
{
public:
	enum { IDD = IDD_ADDIMAGE };
	BEGIN_MSG_MAP(CAddImageDlg)
		MESSAGE_HANDLER(WM_INITDIALOG, OnInitDialog)
		COMMAND_ID_HANDLER(IDYES, OnBtnClicked)
		COMMAND_ID_HANDLER(IDCANCEL, OnBtnClicked)
	END_MSG_MAP()

	LRESULT OnInitDialog(UINT, WPARAM, LPARAM, BOOL&)
	{
		::CenterChildWindow(GetParent(), m_hWnd);
		CButton btn = GetDlgItem(IDC_ADDIMAGE_ASKAGAIN);
		btn.SetCheck(!_Settings.GetInsImageAsking());
		return 0;
	}

	LRESULT OnBtnClicked(WORD, WORD wID, HWND, BOOL&)
	{
		_Settings.SetIsInsClearImage(wID == IDYES ? true : false);
		_Settings.SetInsImageAsking(!IsDlgButtonChecked(IDC_ADDIMAGE_ASKAGAIN));
		return EndDialog(wID);
	}
};

template<class T, int chgID>
class ATL_NO_VTABLE CHTMLChangeSink: public MSHTML::IHTMLChangeSink
{
protected:
public:
	// IUnknown
	STDMETHOD(QueryInterface)(REFIID iid,void **ppvObject)
	{
		if(iid == IID_IUnknown || iid == IID_IHTMLChangeSink)
		{
			*ppvObject = this;
			return S_OK;
		}

		return E_NOINTERFACE;
	}
	STDMETHOD_(ULONG, AddRef)() { return 1; }
	STDMETHOD_(ULONG, Release)() { return 1; }

	// IHTMLChangeSink
	STDMETHOD(raw_Notify)()
	{
		T* pT = static_cast<T*>(this);
		pT->EditorChanged(chgID);
		return S_OK;
	}
};

typedef CWinTraits<WS_CHILD | WS_CLIPCHILDREN | WS_CLIPSIBLINGS, 0>
		  CFBEViewWinTraits;

enum { FWD_SINK, BACK_SINK, RANGE_SINK };

class CFindDlgBase;

class CFBEView : public CWindowImpl<CFBEView, CAxWindow, CFBEViewWinTraits>,
		 public IDispEventSimpleImpl<0, CFBEView, &DIID_DWebBrowserEvents2>,
		 public IDispEventSimpleImpl<0, CFBEView, &DIID_HTMLDocumentEvents2>,
		 public IDispEventSimpleImpl<0, CFBEView, &DIID_HTMLTextContainerEvents2>,
		 public CHTMLChangeSink<CFBEView,RANGE_SINK>
{
protected:
  typedef IDispEventSimpleImpl<0, CFBEView, &DIID_DWebBrowserEvents2> BrowserEvents;
  typedef IDispEventSimpleImpl<0, CFBEView, &DIID_HTMLDocumentEvents2> DocumentEvents;
  typedef IDispEventSimpleImpl<0, CFBEView, &DIID_HTMLTextContainerEvents2> TextEvents;
  typedef CHTMLChangeSink<CFBEView,FWD_SINK>	  ForwardSink;
  typedef CHTMLChangeSink<CFBEView,BACK_SINK>	  BackwardSink;
  typedef CHTMLChangeSink<CFBEView,RANGE_SINK>	  RangeSink;

  HWND			    m_frame;

public:
  CString m_file_name, m_file_path;
  // changed by SeNS
  DWORD			    m_dirtyRangeCookie;
  MSHTML::IMarkupServices2Ptr  m_mk_srv;

protected:
  SHD::IWebBrowser2Ptr	    m_browser;
  MSHTML::IHTMLDocument2Ptr m_hdoc;
  MSHTML::IMarkupContainer2Ptr m_mkc;

  int			    m_ignore_changes;
  int			    m_enable_paste;

  bool			    m_normalize:1;
  bool			    m_complete:1;
  bool			    m_initialized:1;

  MSHTML::IHTMLElementPtr   m_cur_sel;
  MSHTML::IHTMLInputTextElementPtr m_cur_input;
  _bstr_t		    m_cur_val;
  bool			    m_form_changed;
  bool			    m_form_cp;

  CString		    m_nav_url;

  static _ATL_FUNC_INFO DocumentCompleteInfo;
  static _ATL_FUNC_INFO BeforeNavigateInfo;
  static _ATL_FUNC_INFO	EventInfo;
  static _ATL_FUNC_INFO	VoidEventInfo;
  static _ATL_FUNC_INFO VoidInfo;

	enum
	{
		FRF_REVERSE	= 1,
		FRF_WHOLE	= 2,
		FRF_CASE	= 4,
		FRF_REGEX	= 8
	};

	struct FindReplaceOptions
	{
		CString		pattern;
		CString		replacement;
		AU::ReMatch	match;
		int			flags; // IHTMLTxtRange::findText() flags
		bool		fRegexp;

		int			replNum;

		FindReplaceOptions() : fRegexp(false), flags(0) { }
	};

	FindReplaceOptions m_fo;
	MSHTML::IHTMLTxtRangePtr m_is_start;

	struct pElAdjacent
	{
		MSHTML::IHTMLElementPtr elem;
		_bstr_t innerText;

		pElAdjacent(MSHTML::IHTMLElementPtr pElem)
		{
			elem = pElem;
			innerText = pElem->innerText;
		}
	};

	friend class CFindDlgBase;
	friend class CViewFindDlg;
	friend class CReplaceDlgBase;
	friend class CViewReplaceDlg;
	friend class CSciFindDlg;
	friend class CSciReplaceDlg;
	friend class FRBase;

	void SelMatch(MSHTML::IHTMLTxtRange* tr, AU::ReMatch rm);
	MSHTML::IHTMLElementPtr SelectionContainerImp();

public:
	CFindDlgBase*			m_find_dlg;
	CReplaceDlgBase*		m_replace_dlg;

	SHD::IWebBrowser2Ptr	Browser()
	{
		return m_browser;
	}

	MSHTML::IHTMLDocument2Ptr Document()
	{
		return m_hdoc;
	}

  bool			    HasDoc() { return m_hdoc; }
  IDispatchPtr	    Script(){ return MSHTML::IHTMLDocumentPtr(m_hdoc)->Script; }
  CString		    NavURL() { return m_nav_url; }

  bool			    Loaded() { bool cmp=m_complete; m_complete=false; return cmp; }
  void			    Init();

  long			    GetVersionNumber() { return m_mkc ? m_mkc->GetVersionNumber() : -1; }

  CAtlList<CString> m_UndoStrings;
  void			    BeginUndoUnit(const wchar_t *name) 
  { 
	  //m_UndoStrings.AddHead(name);
	  m_mk_srv->BeginUndoUnit((wchar_t *)name); 
  }
  void			    EndUndoUnit() 
  { 
	  m_mk_srv->EndUndoUnit();
  }

  DECLARE_WND_SUPERCLASS(NULL, CAxWindow::GetWndClassName())

  CFBEView(HWND frame, bool fNorm) : m_frame(frame), m_ignore_changes(0), m_enable_paste(0),
    m_normalize(fNorm), m_complete(false), m_initialized(false), m_startMatch(0), m_endMatch(0),
    m_form_changed(false), m_form_cp(false), m_find_dlg(0), m_replace_dlg(0), m_file_path(L""), m_file_name(L"") { }
  ~CFBEView();

  BOOL PreTranslateMessage(MSG* pMsg);

  BEGIN_MSG_MAP(CFBEView)
    MESSAGE_HANDLER(WM_CREATE, OnCreate)
    MESSAGE_HANDLER(WM_SETFOCUS, OnFocus)

    // editing commands
    COMMAND_ID_HANDLER(ID_EDIT_UNDO, OnUndo)
    COMMAND_ID_HANDLER(ID_EDIT_REDO, OnRedo)
    COMMAND_ID_HANDLER(ID_EDIT_CUT, OnCut)
    COMMAND_ID_HANDLER(ID_EDIT_COPY, OnCopy)
    COMMAND_ID_HANDLER(ID_EDIT_PASTE, OnPaste)
	COMMAND_ID_HANDLER(ID_EDIT_PASTE2, OnPaste)
    COMMAND_ID_HANDLER(ID_EDIT_BOLD, OnBold)
    COMMAND_ID_HANDLER(ID_EDIT_ITALIC, OnItalic)
    COMMAND_ID_HANDLER(ID_EDIT_FIND, OnFind)
    COMMAND_ID_HANDLER(ID_EDIT_FINDNEXT, OnFindNext)
    COMMAND_ID_HANDLER(ID_EDIT_REPLACE, OnReplace)
	COMMAND_ID_HANDLER(ID_EDIT_STRIK, OnStrik)
	COMMAND_ID_HANDLER(ID_EDIT_SUP, OnSup)
	COMMAND_ID_HANDLER(ID_EDIT_SUB, OnSub)
	COMMAND_ID_HANDLER(ID_EDIT_CODE, OnCode)

    COMMAND_ID_HANDLER(ID_STYLE_LINK, OnStyleLink)
    COMMAND_ID_HANDLER(ID_STYLE_NOTE, OnStyleFootnote)
    COMMAND_ID_HANDLER(ID_STYLE_NOLINK, OnStyleNolink)

    COMMAND_ID_HANDLER(ID_STYLE_NORMAL, OnStyleNormal)
    COMMAND_ID_HANDLER(ID_STYLE_TEXTAUTHOR, OnStyleTextAuthor)
    COMMAND_ID_HANDLER(ID_STYLE_SUBTITLE, OnStyleSubtitle)

    COMMAND_ID_HANDLER(ID_EDIT_ADD_TITLE, OnEditAddTitle)
    COMMAND_ID_HANDLER(ID_EDIT_ADD_BODY, OnEditAddBody)
    COMMAND_ID_HANDLER(ID_EDIT_ADD_EPIGRAPH, OnEditAddEpigraph)
    COMMAND_ID_HANDLER(ID_EDIT_ADD_TA, OnEditAddTA)
    COMMAND_ID_HANDLER(ID_EDIT_CLONE, OnEditClone)
    COMMAND_ID_HANDLER(ID_EDIT_ADD_IMAGE, OnEditAddImage)
    COMMAND_ID_HANDLER(ID_EDIT_ADD_ANN,OnEditAddAnn)
	COMMAND_ID_HANDLER(ID_EDIT_INS_IMAGE, OnEditInsImage)
	COMMAND_ID_HANDLER(ID_EDIT_INS_INLINEIMAGE, OnEditInsImage)

    COMMAND_ID_HANDLER(ID_EDIT_SPLIT, OnEditSplit)
    COMMAND_ID_HANDLER(ID_EDIT_MERGE, OnEditMerge)
    COMMAND_ID_HANDLER(ID_EDIT_REMOVE_OUTER_SECTION, OnEditRemoveOuter)

    COMMAND_ID_HANDLER(ID_EDIT_INS_POEM, OnEditInsPoem)
    COMMAND_ID_HANDLER(ID_EDIT_INS_CITE, OnEditInsCite)
	COMMAND_ID_HANDLER_EX(ID_INSERT_TABLE, OnEditInsertTable)

    COMMAND_ID_HANDLER(ID_VIEW_HTML, OnViewHTML)
	COMMAND_ID_HANDLER(ID_SAVEIMG_AS, OnSaveImageAs)
    COMMAND_RANGE_HANDLER(ID_SEL_BASE,ID_SEL_BASE+99, OnSelectElement)
  END_MSG_MAP()

	BEGIN_SINK_MAP(CFBEView)
		SINK_ENTRY_INFO(0, DIID_DWebBrowserEvents2, DISPID_DOCUMENTCOMPLETE, OnDocumentComplete, &DocumentCompleteInfo)
		SINK_ENTRY_INFO(0, DIID_DWebBrowserEvents2, DISPID_BEFORENAVIGATE2, OnBeforeNavigate, &BeforeNavigateInfo)
		SINK_ENTRY_INFO(0, DIID_HTMLDocumentEvents2, DISPID_HTMLDOCUMENTEVENTS2_ONSELECTIONCHANGE, OnSelChange, &VoidEventInfo)
		SINK_ENTRY_INFO(0, DIID_HTMLDocumentEvents2, DISPID_HTMLDOCUMENTEVENTS2_ONCONTEXTMENU, OnContextMenu, &EventInfo)
		SINK_ENTRY_INFO(0, DIID_HTMLDocumentEvents2, DISPID_HTMLDOCUMENTEVENTS2_ONCLICK, OnClick, &EventInfo)
		SINK_ENTRY_INFO(0, DIID_HTMLDocumentEvents2, DISPID_HTMLDOCUMENTEVENTS2_ONFOCUSIN, OnFocusIn, &VoidEventInfo)
		SINK_ENTRY_INFO(0, DIID_HTMLTextContainerEvents2, DISPID_HTMLELEMENTEVENTS2_ONPASTE, OnRealPaste, &EventInfo)
		SINK_ENTRY_INFO(0, DIID_HTMLTextContainerEvents2, DISPID_HTMLELEMENTEVENTS2_ONDRAGEND, OnDrop, &VoidEventInfo)
	END_SINK_MAP()

  LRESULT OnCreate(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled);
  LRESULT OnFocus(UINT, WPARAM, LPARAM, BOOL&) 
  {
    // pass to document
    if (HasDoc())
      MSHTML::IHTMLDocument4Ptr(Document())->focus();
    return 0;
  }

	// editing commands
	LRESULT ExecCommand(int cmd);
	void QueryStatus(OLECMD *cmd, int ncmd);
	CString QueryCmdText(int cmd);

	LRESULT OnUndo(WORD, WORD, HWND hWnd, BOOL&) 
	{ 
		LRESULT res = ExecCommand(IDM_UNDO);
		// update tree view
		::SendMessage(m_frame,WM_COMMAND,MAKELONG(0,IDN_TREE_RESTORE),0);
		return res;
	}
	LRESULT OnRedo(WORD, WORD, HWND, BOOL&) { return ExecCommand(IDM_REDO); }
	LRESULT OnCut(WORD, WORD, HWND, BOOL&) { return ExecCommand(IDM_CUT); }
	LRESULT OnCopy(WORD, WORD, HWND, BOOL&) { return ExecCommand(IDM_COPY); }
	LRESULT OnPaste(WORD, WORD, HWND, BOOL&);
	LRESULT OnBold(WORD, WORD, HWND, BOOL&) { return ExecCommand(IDM_BOLD); }
	LRESULT OnItalic(WORD, WORD, HWND, BOOL&) { return ExecCommand(IDM_ITALIC); }
	LRESULT OnStrik(WORD, WORD, HWND, BOOL&) { return ExecCommand(IDM_STRIKETHROUGH); }
	LRESULT OnSup(WORD, WORD, HWND, BOOL&) { return ExecCommand(IDM_SUPERSCRIPT); }
	LRESULT OnSub(WORD, WORD, HWND, BOOL&) { return ExecCommand(IDM_SUBSCRIPT); }
	LRESULT OnCode(WORD, WORD, HWND, BOOL&);

  LRESULT OnFind(WORD, WORD, HWND, BOOL&);
  LRESULT OnFindNext(WORD, WORD, HWND, BOOL&);
  LRESULT OnReplace(WORD, WORD, HWND, BOOL&);
  LRESULT OnStyleLink(WORD, WORD, HWND, BOOL&);
  LRESULT OnStyleFootnote(WORD, WORD, HWND, BOOL&);
  LRESULT OnStyleNolink(WORD, WORD, HWND, BOOL&) { return ExecCommand(IDM_UNLINK); }
  LRESULT OnStyleNormal(WORD, WORD, HWND, BOOL&)
  {
	  BeginUndoUnit(L"normal style");
	  U::ChangeAttribute(SelectionStructCon(), L"class", L"normal");
	  EndUndoUnit();

	  return 0;
  }
  LRESULT OnStyleTextAuthor(WORD, WORD, HWND, BOOL&) { Call(L"StyleTextAuthor",SelectionStructCon()); return 0; }
  LRESULT OnStyleSubtitle(WORD, WORD, HWND, BOOL&) { Call(L"StyleSubtitle",SelectionStructCon()); return 0; }
  LRESULT OnViewHTML(WORD, WORD, HWND, BOOL&) {
    IOleCommandTargetPtr  ct(m_browser);
    if (ct)
      ct->Exec(&CGID_MSHTML, IDM_VIEWSOURCE, 0, NULL, NULL);
    return 0;
  }
	LRESULT OnSelectElement(WORD, WORD, HWND, BOOL&);
	LRESULT OnEditAddTitle(WORD, WORD, HWND, BOOL&)	{ Call(L"AddTitle", SelectionStructCon()); return 0; }
	LRESULT OnEditAddEpigraph(WORD, WORD, HWND, BOOL&) { Call(L"AddEpigraph", SelectionStructCon()); return 0; }
	LRESULT OnEditAddBody(WORD, WORD, HWND, BOOL&) { Call(L"AddBody"); return 0; }
	LRESULT OnEditAddTA(WORD, WORD, HWND, BOOL&) { Call(L"AddTA",SelectionStructCon()); return 0; }
	LRESULT OnEditClone(WORD, WORD, HWND, BOOL&) { Call(L"CloneContainer",SelectionStructCon()); return 0; }
	LRESULT OnEditAddImage(WORD, WORD, HWND, BOOL&) { Call(L"AddImage", SelectionStructCon()); return 0; }
	LRESULT OnEditInsImage(WORD, WORD, HWND, BOOL&);
	LRESULT OnEditInsInlineImage(WORD, WORD, HWND, BOOL&);
	LRESULT OnEditAddAnn(WORD, WORD, HWND, BOOL&) { Call(L"AddAnnotation", SelectionStructCon()); return 0; }
	LRESULT OnEditMerge(WORD, WORD, HWND, BOOL&) { Call(L"MergeContainers", SelectionStructCon()); return 0; }
	LRESULT OnEditSplit(WORD, WORD, HWND, BOOL&) { SplitContainer(false); return 0; }
	LRESULT OnEditInsPoem(WORD, WORD, HWND, BOOL&) { InsertPoem(false); return 0; }
	LRESULT OnEditInsCite(WORD, WORD, HWND, BOOL&) { InsertCite(false); return 0; }
	LRESULT OnEditRemoveOuter(WORD, WORD, HWND, BOOL&) { Call(L"RemoveOuterContainer",SelectionStructCon()); return 0; }
	LRESULT OnSaveImageAs(WORD, WORD, HWND, BOOL&)
	{
		CString src;
		MSHTML::IHTMLImgElementPtr image = MSHTML::IHTMLDOMNodePtr(SelectionContainer())->firstChild;
		src = image->src.GetBSTR();
		src.Delete(src.Find(L"fbw-internal:#"), 14);

		_variant_t data;
		try
		{
			CComDispatchDriver dd(Script());
			_variant_t arg(src);
			if(!SUCCEEDED(dd.Invoke1(L"GetImageData", &arg, &data)) || data.vt == VT_EMPTY)
				return 0;
		}
		catch (_com_error&)
		{
			return 0;
		}

		CFileDialog imgSaveDlg(FALSE, NULL, src);
		if(m_file_path != L"")
			imgSaveDlg.m_ofn.lpstrInitialDir = m_file_path;

		// add file types
		imgSaveDlg.m_ofn.lpstrFilter = L"JPEG files (*.jpg)\0*.jpg\0PNG files (*.png)\0*.png\0All files (*.*)\0*.*\0\0";
		imgSaveDlg.m_ofn.nFilterIndex = 0;
		imgSaveDlg.m_ofn.lpstrDefExt = L"jpg";

		if(imgSaveDlg.DoModal(m_hWnd) == IDOK)
		{
			HANDLE imgFile = ::CreateFile(	imgSaveDlg.m_szFileName,
											GENERIC_WRITE,
											NULL,
											NULL,
											CREATE_ALWAYS,
											FILE_ATTRIBUTE_NORMAL,
											NULL);
			long elnum = 0;
			void* pData;
			::SafeArrayPtrOfIndex(data.parray, &elnum, &pData);
			long size = 0;
			::SafeArrayGetUBound(data.parray, 1, &size);
			DWORD written;
			::WriteFile(imgFile, pData, size, &written, NULL);

			CloseHandle(imgFile);
		}

		return 0;
	}

  // Modification by Pilgrim
  LRESULT OnEditInsertTable(WORD wNotifyCode, WORD wID, HWND hWndCtl);

  bool	CheckCommand(WORD wID);
  bool	CheckSetCommand(WORD wID);

	// Searching
	bool	CanFindNext()
	{
		return !m_fo.pattern.IsEmpty();
	}

	void	CancelIncSearch();
	void	StartIncSearch();

	void	StopIncSearch()
	{
		if(m_is_start)
			m_is_start.Release();
	}

	bool	DoIncSearch(const CString& str, bool fMore)
	{
		++m_ignore_changes;
		m_fo.pattern = str;
		bool ret = DoSearch(fMore);
		--m_ignore_changes;
		return ret;
	}

	bool DoSearch(bool fMore=true);
	bool DoSearchStd(bool fMore=true);
	bool DoSearchRegexp(bool fMore=true);
	void DoReplace();
	int GlobalReplace(MSHTML::IHTMLElementPtr elem = NULL, CString cntTag = L"P");
	int ToolWordsGlobalReplace(MSHTML::IHTMLElementPtr fbw_body, int* pIndex = NULL, int* globIndex = NULL, bool find = false, CString cntTag = L"P");

	BSTR PrepareDefaultId(const CString& filename);
	void AddImage(const CString& filename,  bool bInline = false);

	CString LastSearchPattern()
	{
		return m_fo.pattern;
	}

	int ReplaceAllRe(const CString& re, const CString& str, MSHTML::IHTMLElementPtr elem = NULL, CString cntTag = L"P")
	{
		m_fo.pattern = re;
		m_fo.replacement = str;
		m_fo.fRegexp = true;
		m_fo.flags = 0;
		return GlobalReplace(elem, cntTag);
	}

	int ReplaceToolWordsRe( const CString& re,
							const CString& str,
							MSHTML::IHTMLElementPtr fbw_body,
							bool replace = false,
							CString cntTag = L"P",
							int* pIndex = NULL,
							int* globIndex = NULL,
							int replNum = 0
							)
	{
		m_fo.pattern = re;
		m_fo.replacement = str;
		m_fo.fRegexp = true;
		m_fo.flags = FRF_CASE | FRF_WHOLE;
		m_fo.replNum = replNum;
		return ToolWordsGlobalReplace(fbw_body, pIndex, globIndex, !replace, cntTag);
	}

  // searching in scintilla
  bool SciFindNext(HWND src,bool fFwdOnly,bool fBarf);

  // utilities
  CString		    SelPath();
  void			    GoTo(MSHTML::IHTMLElement *e,bool fScroll=true);
  MSHTML::IHTMLElementPtr SelectionContainer()
  {
    if (m_cur_sel)
      return m_cur_sel;
    return SelectionContainerImp();
  }

  bool GetSelectionInfo(MSHTML::IHTMLElementPtr *begin, MSHTML::IHTMLElementPtr *end, int* begin_char, int* end_char, MSHTML::IHTMLTxtRangePtr range);

  bool SelectionHasTags(wchar_t* elem);
  MSHTML::IHTMLElementPtr   SelectionAnchor();
  MSHTML::IHTMLElementPtr   SelectionAnchor(MSHTML::IHTMLElementPtr cur);
  MSHTML::IHTMLElementPtr   SelectionStructCon();
  MSHTML::IHTMLElementPtr	SelectionStructNearestCon();
  MSHTML::IHTMLElementPtr   SelectionStructCode();
  MSHTML::IHTMLElementPtr   SelectionStructImage();
  MSHTML::IHTMLElementPtr   SelectionStructSection();
  MSHTML::IHTMLElementPtr   SelectionStructTable();
  MSHTML::IHTMLElementPtr   SelectionStructTableCon();
  MSHTML::IHTMLElementPtr   SelectionsStyleT();
  MSHTML::IHTMLElementPtr	SelectionsStyleTB(_bstr_t& style);
  MSHTML::IHTMLElementPtr   SelectionsStyle();
  MSHTML::IHTMLElementPtr	SelectionsStyleB(_bstr_t& style);
  MSHTML::IHTMLElementPtr   SelectionsColspan();
  MSHTML::IHTMLElementPtr	SelectionsColspanB(_bstr_t& colspan);
  MSHTML::IHTMLElementPtr   SelectionsRowspan();
  MSHTML::IHTMLElementPtr	SelectionsRowspanB(_bstr_t& rowspan);
  MSHTML::IHTMLElementPtr   SelectionsAlignTR();
  MSHTML::IHTMLElementPtr   SelectionsAlignTRB(_bstr_t& align);
  MSHTML::IHTMLElementPtr   SelectionsAlign();
  MSHTML::IHTMLElementPtr   SelectionsAlignB(_bstr_t& align);
  MSHTML::IHTMLElementPtr   SelectionsVAlign();
  MSHTML::IHTMLElementPtr   SelectionsVAlignB(_bstr_t& valign);

  void			    Normalize(MSHTML::IHTMLDOMNodePtr dom);
  MSHTML::IHTMLDOMNodePtr   GetChangedNode();
  void			    ImgSetURL(IDispatch *elem,const CString& url);

  bool			    SplitContainer(bool fCheck);
//  MSHTML::IHTMLDOMNodePtr	  ChangeAttribute(MSHTML::IHTMLElementPtr elem, const wchar_t* attrib, const wchar_t* value);
  bool				InsertPoem(bool fCheck);
  bool				InsertCite(bool fCheck);
  bool				InsertTable(bool fCheck, bool bTitle=true, int nrows=1);
  long				InsertCode();
  bool				GoToFootnote(bool fCheck);
  bool				GoToReference(bool fCheck);
  MSHTML::IHTMLTxtRangePtr	SetSelection(MSHTML::IHTMLElementPtr begin, MSHTML::IHTMLElementPtr end, int begin_pos, int end_pos);
  int				GetRelationalCharPos(MSHTML::IHTMLDOMNodePtr node, int pos);
  int				GetRealCharPos(MSHTML::IHTMLDOMNodePtr node, int pos);
  int				CountNodeChars(MSHTML::IHTMLDOMNodePtr node);
  int				GetRangePos(const MSHTML::IHTMLTxtRangePtr range, MSHTML::IHTMLElementPtr &element, int &pos);  

  // script calls
  IDispatchPtr	Call(const wchar_t *name);
  bool		bCall(const wchar_t *name, int nParams, VARIANT* params);
  bool		bCall(const wchar_t *name);
  IDispatchPtr	Call(const wchar_t *name,IDispatch *pDisp);
  bool		bCall(const wchar_t *name,IDispatch *pDisp);

  // binary objects
  _variant_t	GetBinary(const wchar_t *id);

  // change notifications
  void	EditorChanged(int id);

  // external helper
  static IDispatchPtr	CreateHelper();

  // DWebBrowserEvents2
  void __stdcall  OnDocumentComplete(IDispatch *pDisp,VARIANT *vtUrl);
  void __stdcall  OnBeforeNavigate(IDispatch *pDisp,VARIANT *vtUrl,VARIANT *vtFlags,
				   VARIANT *vtTargetFrame,VARIANT *vtPostData,
				   VARIANT *vtHeaders,VARIANT_BOOL *fCancel);

  // HTMLDocumentEvents2
  void __stdcall	  OnSelChange(IDispatch *evt);
  VARIANT_BOOL __stdcall  OnContextMenu(IDispatch *evt);
  VARIANT_BOOL __stdcall  OnClick(IDispatch *evt);
  void __stdcall	  OnFocusIn(IDispatch *evt);

	// HTMLTextContainerEvents2
	VARIANT_BOOL __stdcall OnRealPaste(IDispatch *evt);
	void __stdcall OnDrop(IDispatch*)
	{
		if(m_normalize)
			Normalize(Document()->body);
	}

   VARIANT_BOOL __stdcall OnDragDrop(IDispatch*)
   {
	    return VARIANT_FALSE;
   }

  // form changes
  bool	    IsFormChanged();
  void	    ResetFormChanged();
  bool	    IsFormCP();
  void	    ResetFormCP();

  // extract currently selected text
  _bstr_t   Selection();
  bool CloseFindDialog(CFindDlgBase* dlg);
  bool CloseFindDialog(CReplaceDlgBase* dlg); 

  // added by SeNS
  long m_elementsNum;
  bool IsHTMLChanged()
  {
	  long newElementsNum = Document()->all->length;
	  bool b = (newElementsNum != m_elementsNum);
	  if (b) m_startMatch = m_endMatch = 0;
	  m_elementsNum = newElementsNum;
	  return b;
  }

private:
	bool ExpandTxtRangeToParagraphs(MSHTML::IHTMLTxtRangePtr &rng, MSHTML::IHTMLElementPtr& begin, MSHTML::IHTMLElementPtr& end)const;
	CString GetClearedRangeText(const MSHTML::IHTMLTxtRangePtr &rng)const;   
	// added by SeNS
	int m_startMatch, m_endMatch;
};

/////////////////////////////////////////////////////////////////////////////

//{{AFX_INSERT_LOCATION}}
// Microsoft Visual C++ will insert additional declarations immediately before the previous line.

#endif // !defined(AFX_FBEVIEW_H__E0C71279_419D_4273_93E3_57F6A57C7CFE__INCLUDED_)
