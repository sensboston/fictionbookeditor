// MainFrm.cpp : implmentation of the CMainFrame class
//
/////////////////////////////////////////////////////////////////////////////
#include "stdafx.h"

#include "MainFrm.h"
#include "CFileDialogEx.h"
#include "SettingsDlg.h"
#include "xmlMatchedTagsHighlighter.h"

// MessageBox localization
HHOOK hCBTHook;
HWND activatedWnd = 0;
LRESULT CALLBACK CBTProc(INT nCode, WPARAM wParam, LPARAM lParam)
{
	HWND  hChildWnd;    // msgbox is "child"
	CString s;
	// notification that a window is about to be activated
	// window handle is wParam
	if (nCode == HCBT_ACTIVATE)
	{
		// set window handles
		hChildWnd  = (HWND)wParam;
		if (activatedWnd != (HWND)wParam)
		{
			activatedWnd = hChildWnd;

			if(GetDlgItem(hChildWnd,IDOK)!=NULL)
			{
				s.LoadString(IDS_MB_OK);
				SetDlgItemText(hChildWnd,IDOK,s);
			}
			if(GetDlgItem(hChildWnd,IDCANCEL)!=NULL)
			{
				s.LoadString(IDS_MB_CANCEL);
				SetDlgItemText(hChildWnd,IDCANCEL,s);
			}
			if(GetDlgItem(hChildWnd,IDABORT)!=NULL)
			{
				s.LoadString(IDS_MB_ABORT);
				SetDlgItemText(hChildWnd,IDABORT,s);
			}
			if(GetDlgItem(hChildWnd,IDRETRY)!=NULL)
			{
				s.LoadString(IDS_MB_RETRY);
				SetDlgItemText(hChildWnd,IDRETRY,s);
			}
			if(GetDlgItem(hChildWnd,IDIGNORE)!=NULL)
			{
				s.LoadString(IDS_MB_IGNORE);
				SetDlgItemText(hChildWnd,IDIGNORE,s);
			}
			if(GetDlgItem(hChildWnd,IDYES)!=NULL)
			{
				s.LoadString(IDS_MB_YES);
				SetDlgItemText(hChildWnd,IDYES,s);
			}
			if(GetDlgItem(hChildWnd,IDNO)!=NULL)
			{
				s.LoadString(IDS_MB_NO);
				SetDlgItemText(hChildWnd,IDNO,s);
			}
		}
	}
	if (nCode == HCBT_DESTROYWND)
	{
		if (activatedWnd == (HWND)wParam)
			activatedWnd = 0;
	}
	// otherwise, continue with any possible chained hooks
	return CallNextHookEx(hCBTHook, nCode, wParam, lParam);
}
void HookSysDialogs()
{
	hCBTHook = SetWindowsHookEx(WH_CBT, &CBTProc, 0, GetCurrentThreadId());
}

void UnhookSysDialogs()
{
	UnhookWindowsHookEx(hCBTHook);
}
// utility methods
bool  CMainFrame::IsBandVisible(int id) {
  int nBandIndex = m_rebar.IdToIndex(id);
  REBARBANDINFO	rbi;
  rbi.cbSize=sizeof(rbi);
  rbi.fMask=RBBIM_STYLE;
  m_rebar.GetBandInfo(nBandIndex,&rbi);
  return (rbi.fStyle&RBBS_HIDDEN)==0;
}

void  CMainFrame::AttachDocument(FB::Doc *doc) 
{
	/*if (IsSourceActive()) {
	UIEnable(ID_VIEW_TREE, 1);
	UISetCheck(ID_VIEW_TREE, m_save_sp_mode);
	m_splitter.SetSinglePaneMode(m_save_sp_mode ? SPLIT_PANE_NONE : SPLIT_PANE_RIGHT);
	}*/
	m_view.AttachWnd(doc->m_body);
	UISetCheck(ID_VIEW_BODY, 1);
	UISetCheck(ID_VIEW_DESC, 0);
	UISetCheck(ID_VIEW_SOURCE, 0); 
	m_view.ActivateWnd(doc->m_body);
	m_current_view = BODY;
	m_last_view = DESC;
	m_last_ctrl_tab_view= DESC;
	m_cb_updated=false;
	m_need_title_update=m_sel_changed=true;
	if(_Settings.ViewDocumentTree())
	{
		m_document_tree.GetDocumentStructure(doc->m_body.Document());
		m_document_tree.HighlightItemAtPos(doc->m_body.SelectionContainer());
	}
	// added by SeNS
	if (m_Speller && m_Speller->Enabled())
	{
		m_Speller->SetFrame(m_hWnd);
		m_Speller->SetCustomDictionary(_Settings.GetCustomDict());
		m_Speller->AttachDocument(doc->m_body.Document());
	}
    ShowView(DESC);
    ShowView(BODY);
	m_view.ActivateWnd(doc->m_body);
}

CString	CMainFrame::GetOpenFileName() 
{
	CFileDialog dlg(TRUE, L"fb2", NULL, OFN_HIDEREADONLY|OFN_PATHMUSTEXIST, 
		L"FictionBook files (*.fb2)\0*.fb2\0All files (*.*)\0*.*\0\0");
	if (dlg.DoModal(*this)==IDOK) return dlg.m_szFileName;
	return CString();
}

class CCustomSaveDialog : public CFileDialogImpl<CCustomSaveDialog>
{
public:
  HWND	      m_hDlg;
  CString     m_encoding;

  CCustomSaveDialog(BOOL bOpenFileDialog, // TRUE for FileOpen, FALSE for FileSaveAs
    const CString& encoding,
    LPCTSTR lpszDefExt = NULL,
    LPCTSTR lpszFileName = NULL,
    DWORD dwFlags = OFN_HIDEREADONLY | OFN_OVERWRITEPROMPT,
    LPCTSTR lpszFilter = NULL,
    HWND hWndParent = NULL)
    : CFileDialogImpl<CCustomSaveDialog>(bOpenFileDialog, lpszDefExt, lpszFileName, dwFlags, lpszFilter, hWndParent),
      m_hDlg(NULL)
  {
    m_ofn.lpTemplateName=MAKEINTRESOURCE(IDD_CUSTOMSAVEDLG);
	m_encoding = encoding;
  }

  BEGIN_MSG_MAP(CCustomSaveDialog)
    if (uMsg==WM_INITDIALOG)
      return OnInitDialog(hWnd,uMsg,wParam,lParam);

    MESSAGE_HANDLER(WM_SIZE, OnSize);

    CHAIN_MSG_MAP(CFileDialogImpl<CCustomSaveDialog>)
  END_MSG_MAP()

  LRESULT OnInitDialog(HWND hWnd,UINT msg,WPARAM wParam,LPARAM lParam) {
    m_hDlg=hWnd;

    TCHAR   buf[1024];

    if (::LoadString(_Module.GetResourceInstance(),IDS_ENCODINGS,buf,sizeof(buf)/sizeof(buf[0]))==0)
      return TRUE;

    TCHAR   *cp=buf;
    while (*cp) {
      size_t len=_tcscspn(cp,L",");
      if (cp[len])
	cp[len++]= L'\0';
      if (*cp)
	::SendDlgItemMessage(hWnd,IDC_ENCODING,CB_ADDSTRING,0,(LPARAM)cp);
      cp+=len;
    }

    //::SetDlgItemText(hWnd,IDC_ENCODING,m_encoding);
	::SendMessage(::GetDlgItem(hWnd, IDC_ENCODING), CB_SELECTSTRING, 0, (LPARAM)m_encoding.GetBuffer());	

	return TRUE;
  }

  LRESULT OnSize(UINT uMsg,WPARAM wParam,LPARAM lParam,BOOL& bHandled) {
    // make combobox the same size as std controls
    RECT    rc_std,rc_my,rc_static, rc_static_my;
    HWND    hCB=::GetDlgItem(m_hDlg,IDC_ENCODING);
	HWND    hST=::GetDlgItem(m_hDlg,IDC_STATIC);
    ::GetWindowRect(hCB,&rc_my);
    ::GetWindowRect(GetFileDialogWindow().GetDlgItem(cmb1),&rc_std);

	::GetWindowRect(hST,&rc_static_my);
	::GetWindowRect(GetFileDialogWindow().GetDlgItem(stc2),&rc_static);

    POINT   pt={rc_std.left,rc_my.top};
	POINT   pt1={rc_static.left,rc_static_my.top};
    ::ScreenToClient(m_hDlg,&pt);
	::ScreenToClient(m_hDlg,&pt1);

	::MoveWindow(hST,pt1.x,pt1.y,rc_static_my.right-rc_static_my.left,rc_my.bottom-rc_my.top,TRUE);
    ::MoveWindow(hCB,pt.x,pt.y,rc_std.right-rc_std.left,rc_my.bottom-rc_my.top,TRUE);

    return 0;
  }
  
  BOOL OnFileOK(LPOFNOTIFY on) {
    m_encoding=U::GetWindowText(::GetDlgItem(m_hDlg,IDC_ENCODING));    
    return TRUE;
  }
};

CString	CMainFrame::GetSaveFileName(CString& encoding) {
	bstr_t filename = m_doc->m_filename;
	if (!filename || (filename == bstr_t(L"Untitled.fb2")))
		filename = L"";

  CCustomSaveDialog	dlg(FALSE,
	_Settings.KeepEncoding() ? m_doc->m_encoding : _Settings.GetDefaultEncoding(), L"fb2", filename,
    OFN_HIDEREADONLY|OFN_NOREADONLYRETURN|OFN_OVERWRITEPROMPT| OFN_ENABLETEMPLATE,
    L"FictionBook files (*.fb2)\0*.fb2\0All files (*.*)\0*.*\0\0");
  if (dlg.DoModal(*this)==IDOK) {
    encoding=dlg.m_encoding;
    return dlg.m_szFileName;
  }
  return CString();
}

bool	CMainFrame::DocChanged() {
	return m_doc && m_doc->DocChanged() || IsSourceActive() && m_source.SendMessage(SCI_GETMODIFY);
}

bool	CMainFrame::DiscardChanges() {	
  U::SaveFileSelectedPos(m_doc->m_filename, m_doc->GetSelectedPos());

  if (DocChanged())
  {
    wchar_t cpt[MAX_LOAD_STRING + 1];
    wchar_t msg[MAX_LOAD_STRING + 1];
	::LoadString(_Module.GetResourceInstance(), IDR_MAINFRAME, cpt, MAX_LOAD_STRING);
	::LoadString(_Module.GetResourceInstance(), IDS_SAVE_DLG_MSG, msg, MAX_LOAD_STRING);
    switch (U::MessageBox(MB_YESNOCANCEL|MB_ICONEXCLAMATION, cpt, msg,(const TCHAR *)m_doc->m_filename))
    {
    case IDYES:
		{
			bool ret = (SaveFile(false)==OK);
				if(!ret) _Settings.Load();
			return ret;
		}
    case IDNO:
      return true;
    case IDCANCEL:
		{
			_Settings.Load();
			return false;
		}
    }
  }
  return true;
}

void  CMainFrame::SetIsText() {
  if (m_is_fail)
    m_status.SetText(ID_DEFAULT_PANE,L"Failing Incremental Search: "+m_is_str);
  else
    m_status.SetText(ID_DEFAULT_PANE,L"Incremental Search: "+m_is_str);
}

void  CMainFrame::StopIncSearch(bool fCancel) {
  if (!m_incsearch)
    return;
  m_incsearch=0;
  m_sel_changed=true; // will cause status line update soon
  if (fCancel)
    m_doc->m_body.CancelIncSearch();
  else
    m_doc->m_body.StopIncSearch();
}

CMainFrame::FILE_OP_STATUS CMainFrame::SaveFile(bool askname) {
  ATLASSERT(m_doc!=NULL);

  // force consistent html view
  if (IsSourceActive() && !SourceToHTML())
    return FAIL;


  if (askname || !m_doc->m_namevalid) { // ask user about save file name
    CString encoding;
    CString filename(GetSaveFileName(encoding));
    if (filename.IsEmpty())
      return CANCELLED;
    m_doc->m_encoding=encoding;
    if (m_doc->Save(filename)) {
      m_doc->m_filename=filename;
	  wchar_t str[MAX_PATH];
	  wcscpy(str, (const wchar_t*)filename);
	  PathRemoveFileSpec(str);
	  SetCurrentDirectory(str);
      m_doc->m_namevalid=true;	 
	  m_file_age = FileAge(m_doc->m_filename);
	  if(IsSourceActive())
		  m_source.SendMessage(SCI_SETSAVEPOINT);
      return OK;
    }
    return FAIL;
  }
  bool saved = m_doc->Save();

  if(saved)
  {
	  m_file_age = FileAge(m_doc->m_filename);
	  if(IsSourceActive())
		  m_source.SendMessage(SCI_SETSAVEPOINT);
	  return OK;
  }
  else
  {
	return FAIL;
  }
}

CMainFrame::FILE_OP_STATUS  CMainFrame::LoadFile(const wchar_t *initfilename)
{
  if (!DiscardChanges())
    return CANCELLED; 
  
  CString filename(initfilename);
  if (filename.IsEmpty())
    filename = GetOpenFileName();
  if (filename.IsEmpty())
    return CANCELLED;
  
	FB::Doc *doc = new FB::Doc(*this);
	FB::Doc::m_active_doc = doc;
	if((filename.ReverseFind(L'\\') + 1) != -1 && (filename.ReverseFind(L'\\') + 1) < filename.GetLength() - 1)
	{
		doc->m_body.m_file_path = filename.Mid(0, filename.ReverseFind(L'\\') + 1);
		doc->m_body.m_file_name = filename.Mid(filename.ReverseFind(L'\\') + 1, filename.GetLength() - 1);
	}
  EnableWindow(FALSE);
  m_status.SetPaneText(ID_DEFAULT_PANE,L"Loading...");
  bool fLoaded = doc->Load(m_view, filename);
  EnableWindow(TRUE);
  if (!fLoaded) {
    delete doc;
	FB::Doc::m_active_doc = m_doc;
    return FAIL;
  }

  AttachDocument(doc);
  m_file_age = FileAge(filename);
  delete m_doc;
  m_doc=doc;
  return OK;
}

void  CMainFrame::GetDocumentStructure() {
  m_doc_changed=false;
  m_document_tree.GetDocumentStructure(m_doc->m_body.Document());
}

void  CMainFrame::GoTo(MSHTML::IHTMLElement *e) {
  try {
    m_doc->m_body.GoTo(e);
   // ShowView();
  }
  catch (_com_error&) {
  }
}

// message handlers
BOOL CMainFrame::PreTranslateMessage(MSG* pMsg)
{
	// reset ctrl tab
	if (pMsg->message == WM_KEYUP && pMsg->wParam == VK_CONTROL)
	{
		m_ctrl_tab = false;
	}

	// well, if we are doing an incremental search, then swallow WM_CHARS
	if (m_incsearch && pMsg->hwnd != *this)
	{
		BOOL tmp;
		if(pMsg->message == WM_CHAR)
		{
			OnChar(WM_CHAR, pMsg->wParam, 0, tmp);
			return TRUE;
		}
		if ((pMsg->message == WM_KEYDOWN || pMsg->message == WM_KEYUP) &&
			(pMsg->wParam == VK_BACK || pMsg->wParam == VK_RETURN))
		{
			if (pMsg->message == WM_KEYDOWN)
				OnChar(WM_CHAR, pMsg->wParam, 0, tmp);
			return TRUE;
		}
	}

	// let other windows do their translations
	if(CFrameWindowImpl<CMainFrame>::PreTranslateMessage(pMsg))
		return TRUE;

	// this is needed to pass certain keys to the web browser
	HWND hWndFocus = ::GetFocus();
	if(m_doc)
	{
		if(::IsChild(m_doc->m_body,hWndFocus))
		{
			if (m_doc->m_body.PreTranslateMessage(pMsg))
				return TRUE;
			/*    } else if (::IsChild(m_doc->m_desc,hWndFocus)) {
			if (m_doc->m_desc.PreTranslateMessage(pMsg))
			return TRUE;*/
		}
	}

	return FALSE;
}

void  CMainFrame::UIUpdateViewCmd(CFBEView& view, WORD wID, OLECMD& oc, const wchar_t *hk)
{
	CString fbuf;
	fbuf.Format(L"%s\t%s", (const TCHAR*)view.QueryCmdText(oc.cmdID), hk);
	UISetText(wID, fbuf);
	UIEnable(wID, (oc.cmdf & OLECMDF_ENABLED) != 0);
}

BOOL CMainFrame::OnIdle()
{	
	if(CheckFileTimeStamp())
	{
		return true;
	}

	if (IsSourceActive())
	{
		static WORD disabled_commands[] =
		{
			ID_EDIT_BOLD,
			ID_EDIT_ITALIC,
			ID_EDIT_STRIK,
			ID_EDIT_SUP,
			ID_EDIT_SUB,
			ID_EDIT_CODE,
			ID_EDIT_CLONE,
			ID_EDIT_SPLIT,
			ID_EDIT_MERGE,
			ID_EDIT_REMOVE_OUTER_SECTION,
			ID_STYLE_NORMAL,
			ID_STYLE_TEXTAUTHOR,
			ID_STYLE_SUBTITLE,
			ID_STYLE_LINK,
			ID_STYLE_NOTE,
			ID_STYLE_NOLINK,
			ID_EDIT_ADD_BODY,
			ID_EDIT_ADD_TITLE,
			ID_EDIT_ADD_EPIGRAPH,
			ID_EDIT_ADD_IMAGE,
			ID_EDIT_ADD_ANN,
			ID_EDIT_ADD_TA,
			ID_EDIT_INS_IMAGE,
			ID_EDIT_INS_INLINEIMAGE,
			ID_EDIT_INS_POEM,
			ID_EDIT_INS_CITE,
			ID_EDIT_ADDBINARY,
			ID_INSERT_TABLE,
			ID_VIEW_TREE,
			ID_GOTO_REFERENCE,
			ID_GOTO_FOOTNOTE,
		};	

		for (int i = 0; i < sizeof(disabled_commands)/sizeof(disabled_commands[0]); ++i)
			UIEnable(disabled_commands[i], FALSE);

		HMENU scripts = GetSubMenu(m_MenuBar.GetMenu(), 7);
		for(int i = 0; i < m_scripts.GetSize(); ++i)
		{
			if(!m_scripts[i].isFolder)
			{
				::EnableMenuItem(scripts, ID_SCRIPT_BASE + m_scripts[i].wID, MF_BYCOMMAND | MF_GRAYED);
			}
		}

		m_id_box.EnableWindow(FALSE);
		m_href_box.EnableWindow(FALSE);
		m_image_title_box.EnableWindow(FALSE);
		m_section_box.EnableWindow(FALSE);
		m_id_table_id_box.EnableWindow(FALSE);
		m_id_table_box.EnableWindow(FALSE);
		m_styleT_table_box.EnableWindow(FALSE);
		m_style_table_box.EnableWindow(FALSE);
		m_colspan_table_box.EnableWindow(FALSE);
		m_rowspan_table_box.EnableWindow(FALSE);
		m_alignTR_table_box.EnableWindow(FALSE);
		m_align_table_box.EnableWindow(FALSE);
		m_valign_table_box.EnableWindow(FALSE);

		m_id_caption.SetEnabled(false);
		m_href_caption.SetEnabled(false);
		m_section_id_caption.SetEnabled(false);
		m_image_title_caption.SetEnabled(false);
		m_table_id_caption.SetEnabled(false);
		m_table_style_caption.SetEnabled(false);
		m_id_table_caption.SetEnabled(false);
		m_style_caption.SetEnabled(false);
		m_colspan_caption.SetEnabled(false);
		m_rowspan_caption.SetEnabled(false);
		m_tr_allign_caption.SetEnabled(false);
		m_th_allign_caption.SetEnabled(false);
		m_valign_caption.SetEnabled(false);	

		bool fCanCC = m_source.SendMessage(SCI_GETSELECTIONSTART) != m_source.SendMessage(SCI_GETSELECTIONEND);
		UIEnable(ID_EDIT_COPY, fCanCC);
		UIEnable(ID_EDIT_CUT, fCanCC);
		UIEnable(ID_EDIT_PASTE, m_source.SendMessage(SCI_CANPASTE));
		UIEnable(ID_EDIT_PASTE2, m_source.SendMessage(SCI_CANPASTE));

		UIEnable(ID_GOTO_WRONGTAG, true);

		if(m_source.SendMessage(SCI_CANUNDO))
		{
			UISetText(ID_EDIT_UNDO, L"&Undo");
			UIEnable(ID_EDIT_UNDO, 1);
		}
		else
		{
			UISetText(ID_EDIT_UNDO, L"Can't undo");
			UIEnable(ID_EDIT_UNDO, 0);
		}

		if(m_source.SendMessage(SCI_CANREDO))
		{
			UISetText(ID_EDIT_REDO, L"&Redo");
			UIEnable(ID_EDIT_REDO, 1);
		}
		else
		{
			UISetText(ID_EDIT_REDO, L"Can't redo");
			UIEnable(ID_EDIT_REDO, 0);
		}

		m_last_sci_ovr = m_source.SendMessage(SCI_GETOVERTYPE);
		m_status.SetPaneText(ID_PANE_INS, m_last_sci_ovr ? strOVR : strINS);
	}
	// BODY view
	else
	{
		HMENU scripts = GetSubMenu(m_MenuBar.GetMenu(), 7);
		for (int i = 0; i < m_scripts.GetSize(); ++i)
		{
			if(!m_scripts[i].isFolder)
			{
				::EnableMenuItem(scripts, ID_SCRIPT_BASE + m_scripts[i].wID, MF_BYCOMMAND | MF_ENABLED);
			}
		}

		// check if editing commands can be performed
		CString fbuf;
		CFBEView& view = ActiveView();

		static OLECMD mshtml_commands[] = 
		{
			{IDM_REDO},				// 0
			{IDM_UNDO},				// 1
			{IDM_COPY},				// 2
			{IDM_CUT},				// 3
			{IDM_PASTE},			// 4
			{IDM_UNLINK},			// 5
			{IDM_BOLD},				// 6
			{IDM_ITALIC},			// 7
			{IDM_STRIKETHROUGH},	// 8
			{IDM_SUPERSCRIPT},		// 9
			{IDM_SUBSCRIPT},		// 10
		};
		view.QueryStatus(mshtml_commands, sizeof(mshtml_commands)/sizeof(mshtml_commands[0]));

		static WORD	fbe_commands[] = 
		{
			ID_EDIT_REDO,
			ID_EDIT_UNDO,
			ID_EDIT_COPY,
			ID_EDIT_CUT,
			ID_EDIT_PASTE,
			ID_STYLE_NOLINK,
			ID_EDIT_BOLD,
			ID_EDIT_ITALIC,
			ID_EDIT_STRIK,
			ID_EDIT_SUP,
			ID_EDIT_SUB,
			ID_EDIT_CODE,
			ID_GOTO_REFERENCE, 
			ID_GOTO_FOOTNOTE
		};

		for (int jj=0; jj < sizeof(mshtml_commands)/sizeof(mshtml_commands[0]); ++jj)
		{
			DWORD flags = mshtml_commands[jj].cmdf;
			WORD cmd = fbe_commands[jj];
			UIEnable(cmd, (flags & OLECMDF_ENABLED) != 0);
			UISetCheck(cmd, (flags & OLECMDF_LATCHED) != 0);
		}
		UIUpdateViewCmd(view, ID_EDIT_REDO, mshtml_commands[0], L"Ctrl+Y");
		UIUpdateViewCmd(view, ID_EDIT_UNDO, mshtml_commands[1], L"Ctrl+Z");

		UIEnable(ID_EDIT_FINDNEXT, view.CanFindNext());

		UIUpdateViewCmd(view, ID_STYLE_LINK);
		UIUpdateViewCmd(view, ID_STYLE_NOTE);
		UIUpdateViewCmd(view, ID_STYLE_NORMAL);
		UIUpdateViewCmd(view, ID_STYLE_SUBTITLE);
		UIUpdateViewCmd(view, ID_STYLE_TEXTAUTHOR);
		UIUpdateViewCmd(view, ID_EDIT_ADD_TITLE);
		UIUpdateViewCmd(view, ID_EDIT_ADD_BODY);
		UIUpdateViewCmd(view, ID_EDIT_ADD_TA);
		UIUpdateViewCmd(view, ID_EDIT_CLONE);
		UIUpdateViewCmd(view, ID_EDIT_INS_IMAGE);
		UIUpdateViewCmd(view, ID_EDIT_INS_INLINEIMAGE);
		UIUpdateViewCmd(view, ID_EDIT_ADD_IMAGE);
		UIUpdateViewCmd(view, ID_EDIT_ADD_EPIGRAPH);
		UIUpdateViewCmd(view, ID_EDIT_ADD_ANN);
		UIUpdateViewCmd(view, ID_EDIT_SPLIT);
		UIUpdateViewCmd(view, ID_EDIT_INS_POEM);
		UIUpdateViewCmd(view, ID_EDIT_INS_CITE);
		UIUpdateViewCmd(view, ID_EDIT_CODE);
		UISetCheckCmd(view, ID_EDIT_CODE);
		UIUpdateViewCmd(view, ID_INSERT_TABLE);	
		UIUpdateViewCmd(view, ID_GOTO_FOOTNOTE);
		UIUpdateViewCmd(view, ID_GOTO_REFERENCE);
		UIUpdateViewCmd(view, ID_EDIT_MERGE);
		UIUpdateViewCmd(view, ID_EDIT_REMOVE_OUTER_SECTION);

		UIEnable(ID_GOTO_MATCHTAG, false);
		UIEnable(ID_GOTO_WRONGTAG, false);

		// Added by SeNS: process bitmap paste
		UIEnable(ID_EDIT_PASTE, m_source.SendMessage(SCI_CANPASTE) || BitmapInClipboard());

		if (m_sel_changed && /*GetCurView()*/m_current_view != DESC)
		{
			m_status.SetPaneText(ID_DEFAULT_PANE, m_doc->m_body.SelPath());

			// update links and IDs
			try
			{
				MSHTML::IHTMLElementPtr an(m_doc->m_body.SelectionAnchor());
				_variant_t    href;

				if(an)
					href.Attach(an->getAttribute(L"href", 2));

				if((bool)an && V_VT(&href)==VT_BSTR)
				{
					m_href_box.EnableWindow();
					m_href_caption.SetEnabled();
					m_ignore_cb_changes = true;

					if(!(m_href == ::GetFocus()))
					{
						// changed by SeNS: fix hrefs
						CString tmp(V_BSTR(&href));
						if (tmp.Find(L"file") == 0)
							tmp = tmp.Mid(tmp.ReverseFind (L'#'),1024);
						m_href.SetWindowText(tmp);
						m_href.SetSel(tmp.GetLength(), tmp.GetLength(), FALSE);
					}

					m_ignore_cb_changes = false;

					// SeNS - inline images
					bool img = (U::scmp(an->tagName, L"DIV") == 0) || (U::scmp(an->tagName, L"SPAN") == 0);
					if(img != m_cb_last_images)
						m_cb_updated = false;
					m_cb_last_images = img;
				}
				else
				{
					m_href_box.SetWindowText(L"");
					m_href_box.EnableWindow(FALSE);
					m_href_caption.SetEnabled(false);
				}

				MSHTML::IHTMLElementPtr	sc(m_doc->m_body.SelectionStructCon());
				if(sc)
				{
					m_id_box.EnableWindow();
					m_id_caption.SetEnabled(true);
					m_ignore_cb_changes = true;

					if(U::scmp(sc->id, L"fbw_body"))
						m_id.SetWindowText(sc->id);		  
					else
						m_id.SetWindowText(L"");	

					m_ignore_cb_changes = false;
				}
				else
				{
					m_id_box.EnableWindow(FALSE);
					m_id_caption.SetEnabled(false);
				}

				MSHTML::IHTMLElementPtr	  im(m_doc->m_body.SelectionStructImage());
				if(im)
				{
					m_image_title_box.EnableWindow();
					m_image_title_caption.SetEnabled();
					m_ignore_cb_changes = true;
					m_image_title.SetWindowText(im->title);
					_bstr_t title = im->title;
					if(title.length())
						m_image_title.SetSel(wcslen(im->title), wcslen(im->title), FALSE);
					m_ignore_cb_changes = false;
				}
				else
				{
					m_image_title_box.SetWindowText(L"");
					m_image_title_box.EnableWindow(FALSE);
					m_image_title_caption.SetEnabled(false);
				}
		
				// отображение ID для тегов <section>
				MSHTML::IHTMLElementPtr scstn(m_doc->m_body.SelectionStructSection());
				if(scstn)
				{
					m_section_box.EnableWindow(TRUE);
					m_section_id_caption.SetEnabled();
					m_ignore_cb_changes = true;	  
					m_section.SetWindowText(scstn->id);
					m_ignore_cb_changes = false;
				}
				else
				{
					m_section_box.SetWindowText(L"");
					m_section_box.EnableWindow(FALSE);
					m_section_id_caption.SetEnabled(false);
				}	
				// отображение ID для тегов <table>
				MSHTML::IHTMLElementPtr sct(m_doc->m_body.SelectionStructTable());
				if(sct)
				{
					m_id_table_id_box.EnableWindow(TRUE);
					m_table_id_caption.SetEnabled();
					m_ignore_cb_changes = true;	  
					m_id_table_id.SetWindowText(sct->id);
					m_ignore_cb_changes = false;
				}
				else
				{
					m_id_table_id_box.SetWindowText(L"");
					m_id_table_id_box.EnableWindow(FALSE);
					m_table_id_caption.SetEnabled(false);
				}

				// отображение ID для тегов <tr>, <th>, <td>
				MSHTML::IHTMLElementPtr sctc(m_doc->m_body.SelectionStructTableCon());
				if (sctc) {
					m_id_table_box.EnableWindow(TRUE);
					m_id_table_caption.SetEnabled();
					m_ignore_cb_changes = true;	  
					m_id_table.SetWindowText(sctc->id);
					m_ignore_cb_changes = false;
				}
				else
				{
					m_id_table_box.SetWindowText(L"");
					m_id_table_box.EnableWindow(FALSE);
					m_id_table_caption.SetEnabled(false);
				}

				// отображение style для тегов <table>
				_bstr_t	styleT("");
				MSHTML::IHTMLElementPtr scsT(m_doc->m_body.SelectionsStyleTB(styleT));
				if(scsT)
				{
					m_styleT_table_box.EnableWindow(TRUE);
					m_table_style_caption.SetEnabled();
					if(U::scmp(styleT,L"") != 0)
					{
						m_styleT_table_box.EnableWindow(TRUE);
						m_table_style_caption.SetEnabled();
						m_ignore_cb_changes = true;	  
						m_styleT_table.SetWindowText(styleT);
						m_ignore_cb_changes = false;
					}
					else
					{
						m_styleT_table_box.SetWindowText(L"");
					}
				}
				else
				{
					m_styleT_table_box.SetWindowText(L"");
					m_table_style_caption.SetEnabled(false);
					m_styleT_table_box.EnableWindow(FALSE);
				}

				// отображение style для тегов <th>, <td>
				_bstr_t	style("");
				MSHTML::IHTMLElementPtr scs(m_doc->m_body.SelectionsStyleB(style));
				if(scs)
				{
					m_style_table_box.EnableWindow(TRUE);
					m_style_caption.SetEnabled();
					if (U::scmp(style,L"") != 0)
					{
						m_style_table_box.EnableWindow(TRUE);
						m_style_caption.SetEnabled();
						m_ignore_cb_changes = true;	  
						m_style_table.SetWindowText(style);
						m_ignore_cb_changes = false;
					}
					else
					{
						m_style_table_box.SetWindowText(L"");
					}
				}
				else
				{
					m_style_table_box.SetWindowText(L"");
					m_style_table_box.EnableWindow(FALSE);
					m_style_caption.SetEnabled(false);
				}

				// отображение colspan для тегов <th>, <td>
				_bstr_t colspan("");
				MSHTML::IHTMLElementPtr scc(m_doc->m_body.SelectionsColspanB(colspan));
				if(scc)
				{
					m_colspan_table_box.EnableWindow(TRUE);
					m_colspan_caption.SetEnabled();
					if(U::scmp(colspan, L"") != 0)
					{
						m_colspan_table_box.EnableWindow(TRUE);
						m_colspan_caption.SetEnabled();
						m_ignore_cb_changes = true;	  
						m_colspan_table.SetWindowText(colspan);
						m_ignore_cb_changes = false;
					}
					else
					{
						m_colspan_table_box.SetWindowText(L"");
					}
				}
				else
				{
					m_colspan_table_box.SetWindowText(_T(""));
					m_colspan_table_box.EnableWindow(FALSE);
					m_colspan_caption.SetEnabled(false);
				}

				// отображение rowspan для тегов <th>, <td>
				_bstr_t rowspan("");
				MSHTML::IHTMLElementPtr scr(m_doc->m_body.SelectionsRowspanB(rowspan));
				if(scr)
				{
					m_rowspan_table_box.EnableWindow(TRUE);
					m_rowspan_caption.SetEnabled();
					if (U::scmp(rowspan,L"") != 0)
					{
						m_rowspan_table_box.EnableWindow(TRUE);
						m_rowspan_caption.SetEnabled();
						m_ignore_cb_changes = true;	  
						m_rowspan_table.SetWindowText(rowspan);
						m_ignore_cb_changes = false;
					}
					else
					{
						m_rowspan_table_box.SetWindowText(L"");
					}
				}
				else
				{
					m_rowspan_table_box.SetWindowText(L"");
					m_rowspan_table_box.EnableWindow(FALSE);
					m_rowspan_caption.SetEnabled(false);
				}

				// отображение align для тегов <tr>
				_bstr_t alignTR("");
				MSHTML::IHTMLElementPtr scaTR(m_doc->m_body.SelectionsAlignTRB(alignTR));
				if(scaTR)
				{
					m_alignTR_table_box.EnableWindow(TRUE);
					m_tr_allign_caption.SetEnabled();
					if(U::scmp(alignTR,L"") != 0)
					{
						m_alignTR_table_box.EnableWindow(TRUE);
						m_tr_allign_caption.SetEnabled();
						m_ignore_cb_changes = true;	  
						m_alignTR_table_box.SetCurSel(m_alignTR_table_box.FindString(0,alignTR));
						m_ignore_cb_changes = false;
					}
					else
					{
						m_alignTR_table_box.SetCurSel(m_alignTR_table_box.FindString( 0, L""));
					}
				}
				else
				{
					m_alignTR_table_box.SetCurSel(m_alignTR_table_box.FindString(0, L""));
					m_alignTR_table_box.EnableWindow(FALSE);
					m_tr_allign_caption.SetEnabled(false);
				}

				// отображение align для тегов <th>, <td>
				_bstr_t align("");
				MSHTML::IHTMLElementPtr sca(m_doc->m_body.SelectionsAlignB(align));
				if(sca)
				{
					m_align_table_box.EnableWindow(TRUE);
					m_th_allign_caption.SetEnabled();
					if(U::scmp(align,L"") != 0)
					{
						m_align_table_box.EnableWindow(TRUE);
						m_th_allign_caption.SetEnabled();
						m_ignore_cb_changes = true;	  
						m_align_table_box.SetCurSel(m_align_table_box.FindString(0, align));
						m_ignore_cb_changes = false;
					}
					else
					{
						m_align_table_box.SetCurSel(m_align_table_box.FindString(0, L""));
					}
				}
				else
				{
					m_align_table_box.SetCurSel(m_align_table_box.FindString(0, L""));
					m_align_table_box.EnableWindow(FALSE);
					m_th_allign_caption.SetEnabled(false);
				}

				// отображение valign для тегов <th>, <td>
				_bstr_t valign("");
				MSHTML::IHTMLElementPtr scva(m_doc->m_body.SelectionsVAlignB(valign));
				if(scva)
				{
					m_valign_table_box.EnableWindow(TRUE);
					m_valign_caption.SetEnabled();	
					if (U::scmp(valign,L"") != 0)
					{
						m_valign_table_box.EnableWindow(TRUE);
						m_valign_caption.SetEnabled();	
						m_ignore_cb_changes = true;	  
						m_valign_table_box.SetCurSel(m_valign_table_box.FindString(0, valign));
						m_ignore_cb_changes = false;
					}
					else
					{
						m_valign_table_box.SetCurSel(m_valign_table_box.FindString(0, L""));
					}
				}
				else
				{
					m_valign_table_box.SetCurSel(m_valign_table_box.FindString(0, L""));
					m_valign_table_box.EnableWindow(FALSE);
					m_valign_caption.SetEnabled(false);	
				}
			}
			catch(_com_error&)
			{

			}

			// update current tree node	  
			if (!m_doc_changed && _Settings.ViewDocumentTree())
				m_document_tree.HighlightItemAtPos(m_doc->m_body.SelectionContainer()); // locate appropriate tree node	  

			m_sel_changed = false;
		}

		// insert/overwrite mode
		OLECMD oc = {IDM_OVERWRITE};
		view.QueryStatus(&oc, 1);
		bool fOvr = (oc.cmdf & OLECMDF_LATCHED) != 0;
		if (fOvr != m_last_ie_ovr)
		{
			m_last_ie_ovr = fOvr;
			m_status.SetPaneText(ID_PANE_INS, fOvr ? strOVR : strINS);
		}

		// added by SeNS: strange bug woraround - restore position on loaded from command line file
		if (m_restore_pos_cmdline)
		{
			m_restore_pos_cmdline = false;
			int saved_pos = U::GetFileSelectedPos(m_doc->m_filename);
			GoTo(saved_pos);
			m_view.SetFocus();
		}
	}

	// added by SeNS
	// detect page scrolling, run a background spellcheck if necessary
	if (m_Speller && m_Speller->Enabled() && m_current_view == BODY) 
	{
		if (!m_Speller->Available())
			UIEnable(ID_TOOLS_SPELLCHECK, false, true);
		else
		{
			UIEnable(ID_TOOLS_SPELLCHECK, true, true);
			m_Speller->CheckScroll();
		}
	}
	else UIEnable(ID_TOOLS_SPELLCHECK, false, true);

	// update UI
	UIUpdateToolBar();

	// update document tree
	if (m_doc_changed)
	{
		MSHTML::IHTMLDOMNodePtr chp(m_doc->m_body.GetChangedNode());
		if ((bool)chp && m_document_tree.IsWindowVisible())
		{
			m_document_tree.UpdateDocumentStructure(m_doc->m_body.Document(), chp);
			m_document_tree.HighlightItemAtPos(m_doc->m_body.SelectionContainer());
		}
		m_doc_changed = false;
	}

	// focus some stupid control if requested
	BOOL tmp;
	switch (m_want_focus)
	{
		case IDC_ID:
			OnSelectCtl(0, ID_SELECT_ID, 0, tmp);
			break;
		case IDC_HREF:
			OnSelectCtl(0, ID_SELECT_HREF, 0, tmp);
			break;
		case IDC_IMAGE_TITLE:
			OnSelectCtl(0, ID_SELECT_IMAGE, 0, tmp);
			break;
		case IDC_SECTION:
			OnSelectCtl(0, ID_SELECT_SECTION, 0, tmp);
			break;
		case IDC_IDT:
			OnSelectCtl(0, ID_SELECT_IDT, 0, tmp);
			break;
		case IDC_STYLET:
			OnSelectCtl(0, ID_SELECT_STYLET, 0, tmp);
			break;
		case IDC_STYLE:
			OnSelectCtl(0, ID_SELECT_STYLE, 0, tmp);
			break;
		case IDC_COLSPAN:
			OnSelectCtl(0, ID_SELECT_COLSPAN, 0, tmp);
			break;
		case IDC_ROWSPAN:
			OnSelectCtl(0, ID_SELECT_ROWSPAN, 0, tmp);
			break;
		case IDC_ALIGNTR:
			OnSelectCtl(0, ID_SELECT_ALIGNTR, 0, tmp);
			break;
		case IDC_ALIGN:
			OnSelectCtl(0, ID_SELECT_ALIGN, 0, tmp);
			break;
		case IDC_VALIGN:
			OnSelectCtl(0, ID_SELECT_VALIGN, 0, tmp);
			break;
	}
	m_want_focus = 0;

	// install a posted status line message
	if(!m_status_msg.IsEmpty())
	{
		m_status.SetPaneText(ID_DEFAULT_PANE, m_status_msg);
		m_status_msg.Empty();
	}

	// see if we need to update title
	if(m_need_title_update || m_change_state != DocChanged())
	{
		m_need_title_update = false;
		m_change_state = DocChanged();
		CString tt(U::GetFileTitle(m_doc->m_filename));
		tt += m_change_state ? L" +" : L" -";
		SetWindowText(tt + L" FB Editor");
	}

	return FALSE;
}

void CMainFrame::AddTbButton(HWND hWnd, const TCHAR *text, const int idCommand, const BYTE bState, const HICON icon)
{
    CToolBarCtrl tb = hWnd;
	int iImage = I_IMAGENONE;
	BYTE bStyle = BTNS_BUTTON | BTNS_AUTOSIZE;
	if (icon)
	{
		CImageList iList = tb.GetImageList();
		if (iList) iImage = iList.AddIcon(icon);
	}

	tb.AddButton(idCommand, bStyle, bState, iImage, text, 0); 
	// custom added command
	if (icon)
	{
		int idx = tb.CommandToIndex(idCommand);
		TBBUTTON tbButton;
		tb.GetButton(idx, &tbButton);
		AddToolbarButton(tb,tbButton, text);
		// move button to unassigned
		tb.DeleteButton(idx);
	}
	tb.AutoSize();
}

static void SubclassBox(HWND hWnd, RECT& rc, const int pos, CComboBox& box, DWORD dwStyle, CCustomEdit& custedit, const int resID, HFONT& hFont)
{
	  ::SendMessage(hWnd, TB_GETITEMRECT, pos, (LPARAM)&rc);
	  rc.bottom--;
	  box.Create(hWnd, rc, NULL, dwStyle, WS_EX_CLIENTEDGE, resID);
	  box.SetFont(hFont);
	  custedit.SubclassWindow(box.ChildWindowFromPoint(CPoint(3,3)));
}

void CMainFrame::AddStaticText(CCustomStatic &st, HWND toolbarHwnd, int id, const TCHAR *text, HFONT hFont)
{
	RECT rect;
	SendMessage(toolbarHwnd, TB_GETITEMRECT, id, (LPARAM)&rect);  
	rect.bottom--; 

	st.Create(toolbarHwnd, rect, NULL, WS_CHILD|WS_VISIBLE, WS_EX_TRANSPARENT, IDC_ID);
	st.SetFont(hFont);
	st.SetWindowText(text);
	st.SetEnabled(true);
}

void CMainFrame::InitPluginsType(HMENU hMenu, const TCHAR* type, UINT cmdbase, CSimpleArray<CLSID>& plist)
{
	CRegKey rk;

	if(rk.Open(HKEY_CURRENT_USER, _Settings.GetKeyPath() + L"\\Plugins") != ERROR_SUCCESS)
		return;
	int ncmd = 0;
	for(int i = 0; ncmd < 20; ++i)
	{
		CString name;
		DWORD size = 128; // enough for GUIDs
		TCHAR* cp = name.GetBuffer(size);
		FILETIME ft;
		if(::RegEnumKeyEx(rk, i, cp, &size, 0, 0, 0, &ft) != ERROR_SUCCESS)
			break;
		name.ReleaseBuffer(size);
		CRegKey pk;
		if(pk.Open(rk, name) != ERROR_SUCCESS)
			continue;
		CString pt(U::QuerySV(pk, L"Type"));
		CString ms(U::QuerySV(pk, L"Menu"));
		if(pt.IsEmpty() || ms.IsEmpty() || pt != type)
			continue;
		CLSID clsid;
		if(::CLSIDFromString((TCHAR*)(const TCHAR *)name, &clsid) != NOERROR)
			continue;

		// all checks pass, add to menu and remember clsid
		plist.Add(clsid);
		::AppendMenu(hMenu, MF_STRING, cmdbase + ncmd, ms);
		CString hs = ms;
		hs.Remove(L'&');
		InitPluginHotkey(name, cmdbase + ncmd, pt + CString(L" | ") + hs);
		// check if an icon is available
		CString icon(U::QuerySV(pk, L"Icon"));
		if(!icon.IsEmpty())
		{
			int cp = icon.ReverseFind(L',');
			int iconID;
			if(cp > 0 && _stscanf((const TCHAR *)icon + cp, L",%d", &iconID) == 1)
				icon.Delete(cp, icon.GetLength() - cp);
			else
				iconID = 0;

			// try load from file first
			HICON hIcon;
			if(::ExtractIconEx(icon, iconID, NULL, &hIcon, 1) > 0 && hIcon)
			{
				m_MenuBar.AddIcon(hIcon, cmdbase + ncmd);
				::DestroyIcon(hIcon);
			}
		}
		++ncmd;
	}

	// Old path to provide searching of old plugins
	CRegKey oldRk;
	if(oldRk.Open(HKEY_LOCAL_MACHINE, L"Software\\Haali\\FBE\\Plugins") != ERROR_SUCCESS)
		goto skip;
	else
	{
		for(int i = ncmd; ncmd < 20; ++i)
		{
			CString name;
			DWORD size = 128; // enough for GUIDs
			TCHAR* cp = name.GetBuffer(size);
			FILETIME ft;
			if(::RegEnumKeyEx(oldRk, i, cp, &size, 0, 0, 0, &ft) != ERROR_SUCCESS)
				break;
			name.ReleaseBuffer(size);
			CRegKey pk;
			if(pk.Open(oldRk, name) != ERROR_SUCCESS)
				continue;
			CString pt(U::QuerySV(pk, L"Type"));
			CString ms(U::QuerySV(pk, L"Menu"));
			if(pt.IsEmpty() || ms.IsEmpty() || pt != type)
				continue;
			CLSID clsid;
			if(::CLSIDFromString((TCHAR*)(const TCHAR *)name, &clsid) != NOERROR)
				continue;

			// all checks pass, add to menu and remember clsid
			plist.Add(clsid);
			::AppendMenu(hMenu, MF_STRING, cmdbase + ncmd, ms);
			CString hs = ms;
			hs.Remove(L'&');
			InitPluginHotkey(name, cmdbase + ncmd,pt + CString(L" | ") + hs);
			// check if an icon is available
			CString icon(U::QuerySV(pk, L"Icon"));
			if(!icon.IsEmpty())
			{
				int cp = icon.ReverseFind(L',');
				int iconID;
				if(cp > 0 && _stscanf((const TCHAR *)icon + cp, L",%d", &iconID) == 1)
					icon.Delete(cp, icon.GetLength() - cp);
				else
					iconID = 0;

				// try load from file first
				HICON hIcon;
				if(::ExtractIconEx(icon, iconID, NULL, &hIcon, 1) > 0 && hIcon)
				{
					m_MenuBar.AddIcon(hIcon, cmdbase + ncmd);
					::DestroyIcon(hIcon);
				}
			}
			++ncmd;
		}
	}
skip:
	if(ncmd > 0) // delete placeholder from menu
	::RemoveMenu(hMenu, 0, MF_BYPOSITION);
}

void CMainFrame::InitPlugins()
{
	CollectScripts(_Settings.GetScriptsFolder(), L"*.js", 1, L"0");	
	QuickScriptsSort(m_scripts, 0, m_scripts.GetSize() - 1);
	UpScriptsFolders(m_scripts);

	HMENU file = ::GetSubMenu(m_MenuBar.GetMenu(), 0);
	HMENU sub = ::GetSubMenu(file, 6);
	InitPluginsType(sub, L"Import", ID_IMPORT_BASE, m_import_plugins);

	sub = ::GetSubMenu(file, 7);
	InitPluginsType(sub, L"Export", ID_EXPORT_BASE, m_export_plugins);

	sub = ::GetSubMenu(file, 9);
	m_mru.SetMenuHandle(sub);
	m_mru.ReadFromRegistry(_Settings.GetKeyPath());
	m_mru.SetMaxEntries(m_mru.m_nMaxEntries_Max - 1);

	// Scripts
	HMENU ManMenu = m_MenuBar.GetMenu();
	HMENU scripts = GetSubMenu(ManMenu, 6);

	while(::GetMenuItemCount(scripts) > 0)
	::RemoveMenu(scripts, 0, MF_BYPOSITION);

	if(m_scripts.GetSize())
	{
		AddScriptsSubMenu(scripts, L"0", m_scripts);
	}
	else
	{
		wchar_t buf[MAX_LOAD_STRING + 1];
		::LoadString(_Module.GetResourceInstance(), IDS_NO_SCRIPTS, buf, MAX_LOAD_STRING);
		AppendMenu(scripts, MF_STRING | MF_DISABLED | MF_GRAYED, IDCANCEL, buf);
	}
}

LRESULT CMainFrame::OnCreate(UINT, WPARAM, LPARAM, BOOL&)
{
  m_ctrl_tab = false;

  // create command bar window
  m_MenuBar.SetAlphaImages(true);
  HWND hWndCmdBar = m_MenuBar.Create(m_hWnd, rcDefault, NULL, ATL_SIMPLE_CMDBAR_PANE_STYLE);
  // attach menu
  m_MenuBar.AttachMenu(GetMenu());
  // remove old menu
  SetMenu(NULL);
  // load command bar images
  m_MenuBar.LoadImages(IDR_MAINFRAME_SMALL);

  m_CmdToolbar = CreateSimpleToolBarCtrl(m_hWnd, IDR_MAINFRAME, FALSE,  ATL_SIMPLE_TOOLBAR_PANE_STYLE | TBSTYLE_LIST | CCS_ADJUSTABLE);
  m_CmdToolbar.SetExtendedStyle(TBSTYLE_EX_MIXEDBUTTONS);
  InitToolBar(m_CmdToolbar, IDR_MAINFRAME);
  // Restore commands toolbar layout and position
  m_CmdToolbar.RestoreState(HKEY_CURRENT_USER, L"SOFTWARE\\FBETeam\\FictionBook Editor\\Toolbars", L"CommandToolbar");
  UIAddToolBar(m_CmdToolbar);

  m_ScriptsToolbar = CreateSimpleToolBarCtrl(m_hWnd, IDR_SCRIPTS, FALSE,  ATL_SIMPLE_TOOLBAR_PANE_STYLE | TBSTYLE_LIST | CCS_ADJUSTABLE);
  m_ScriptsToolbar.SetExtendedStyle(TBSTYLE_EX_MIXEDBUTTONS);
  InitToolBar(m_ScriptsToolbar, IDR_SCRIPTS);
  UIAddToolBar(m_ScriptsToolbar);

  HWND hWndLinksBar = CreateWindowEx(0, TOOLBARCLASSNAME, NULL, ATL_SIMPLE_TOOLBAR_PANE_STYLE | TBSTYLE_LIST, 0, 0, 100, 100, 
	  m_hWnd, NULL, _Module.GetModuleInstance(), NULL);
   
  HWND hWndTableBar = CreateWindowEx(0, TOOLBARCLASSNAME, NULL, ATL_SIMPLE_TOOLBAR_PANE_STYLE | TBSTYLE_LIST , 0, 0, 100, 100, 
	  m_hWnd, NULL, _Module.GetModuleInstance(), NULL);
  HWND hWndTableBar2 = CreateWindowEx(0, TOOLBARCLASSNAME, NULL, ATL_SIMPLE_TOOLBAR_PANE_STYLE | TBSTYLE_LIST, 0, 0, 100, 100,
	  m_hWnd, NULL, _Module.GetModuleInstance(), NULL);
  
  wchar_t buf[MAX_LOAD_STRING + 1];
  HFONT hFont = (HFONT)::SendMessage(hWndLinksBar, WM_GETFONT, 0, 0);

  // Links toolbar preparation
  ::SendMessage(hWndLinksBar, TB_BUTTONSTRUCTSIZE, sizeof(TBBUTTON), 0);
  // Next line provides empty drawing of text
  ::SendMessage(hWndLinksBar,TB_SETDRAWTEXTFLAGS, (WPARAM)DT_CALCRECT, (LPARAM)DT_CALCRECT);

  ::LoadString(_Module.GetResourceInstance(), IDS_TB_CAPT_ID, buf, MAX_LOAD_STRING);
  AddTbButton(hWndLinksBar, buf);
  AddStaticText(m_id_caption, hWndLinksBar, 0, buf, hFont);
  AddTbButton(hWndLinksBar, L"123456789012345678901234567890");

  ::LoadString(_Module.GetResourceInstance(), IDS_TB_CAPT_HREF, buf, MAX_LOAD_STRING);
  AddTbButton(hWndLinksBar, buf);
  AddStaticText(m_href_caption,	hWndLinksBar, 2, buf, hFont);
  AddTbButton(hWndLinksBar, L"123456789012345678901234567890");

  ::LoadString(_Module.GetResourceInstance(), IDS_TB_CAPT_SECTION_ID, buf, MAX_LOAD_STRING);
  AddTbButton(hWndLinksBar, buf);
  AddStaticText(m_section_id_caption, hWndLinksBar, 4, buf, hFont);
  AddTbButton(hWndLinksBar, L"123456789012345678901234567890");

  ::LoadString(_Module.GetResourceInstance(), IDS_TB_CAPT_IMAGE_TITLE, buf, MAX_LOAD_STRING);
  AddTbButton(hWndLinksBar, buf);
  AddStaticText(m_image_title_caption, hWndLinksBar, 6, buf, hFont);
  AddTbButton(hWndLinksBar, L"123456789012345678901234567890");

  // Table's first toolbar preparation
  ::SendMessage(hWndTableBar, TB_BUTTONSTRUCTSIZE, sizeof(TBBUTTON), 0);
  ::SendMessage(hWndTableBar, TB_SETDRAWTEXTFLAGS, (WPARAM)DT_CALCRECT, (LPARAM)DT_CALCRECT);

  ::LoadString(_Module.GetResourceInstance(), IDS_TB_CAPT_TABLE_ID, buf, MAX_LOAD_STRING);
  AddTbButton(hWndTableBar, buf);
  AddStaticText(m_table_id_caption,	hWndTableBar, 0, buf, hFont);
  AddTbButton(hWndTableBar, L"12345678901234567890");

  ::LoadString(_Module.GetResourceInstance(), IDS_TB_CAPT_TABLE_STYLE, buf, MAX_LOAD_STRING);
  AddTbButton(hWndTableBar, buf);
  AddStaticText(m_table_style_caption, hWndTableBar, 2, buf, hFont);
  AddTbButton(hWndTableBar, L"123456789012345");

  ::LoadString(_Module.GetResourceInstance(), IDS_TB_CAPT_ID, buf, MAX_LOAD_STRING);
  AddTbButton(hWndTableBar, buf);
  AddStaticText(m_id_table_caption,	hWndTableBar, 4, buf, hFont);
  AddTbButton(hWndTableBar, L"12345678901234567890");
  
  ::LoadString(_Module.GetResourceInstance(), IDS_TB_CAPT_STYLE, buf, MAX_LOAD_STRING);
  AddTbButton(hWndTableBar, buf);
  AddStaticText(m_style_caption, hWndTableBar, 6, buf, hFont);
  AddTbButton(hWndTableBar, L"123456789012345");

  // Table's second toolbar preparation
  ::SendMessage(hWndTableBar2, TB_BUTTONSTRUCTSIZE, sizeof(TBBUTTON),0);
  ::SendMessage(hWndTableBar2, TB_SETDRAWTEXTFLAGS, (WPARAM)DT_CALCRECT, (LPARAM)DT_CALCRECT);

  ::LoadString(_Module.GetResourceInstance(), IDS_TB_CAPT_COLSPAN, buf, MAX_LOAD_STRING);
  AddTbButton(hWndTableBar2, buf);
  AddStaticText(m_colspan_caption, hWndTableBar2, 0, buf, hFont);
  AddTbButton(hWndTableBar2, L"12345");

  ::LoadString(_Module.GetResourceInstance(), IDS_TB_CAPT_ROWSPAN, buf, MAX_LOAD_STRING);
  AddTbButton(hWndTableBar2, buf);
  AddStaticText(m_rowspan_caption, hWndTableBar2, 2, buf, hFont);
  AddTbButton(hWndTableBar2, L"12345");

  ::LoadString(_Module.GetResourceInstance(), IDS_TB_CAPT_TR_ALIGN, buf, MAX_LOAD_STRING);
  AddTbButton(hWndTableBar2, buf);
  AddStaticText(m_tr_allign_caption, hWndTableBar2, 4, buf, hFont);
  AddTbButton(hWndTableBar2, L"12345678");

  ::LoadString(_Module.GetResourceInstance(), IDS_TB_CAPT_TD_ALIGN, buf, MAX_LOAD_STRING);
  AddTbButton(hWndTableBar2, buf);
  AddStaticText(m_th_allign_caption, hWndTableBar2, 6, buf, hFont);
  AddTbButton(hWndTableBar2, L"12345678");

  ::LoadString(_Module.GetResourceInstance(), IDS_TB_CAPT_TD_VALIGN, buf, MAX_LOAD_STRING);
  AddTbButton(hWndTableBar2, buf);
  AddStaticText(m_valign_caption, hWndTableBar2, 8, buf, hFont);
  AddTbButton(hWndTableBar2, L"12345678");

  CreateSimpleReBar(ATL_SIMPLE_REBAR_NOBORDER_STYLE);
  
  AddSimpleReBarBand(hWndCmdBar, 0, TRUE, 0);
  AddSimpleReBarBand(m_CmdToolbar, 0, TRUE, 0, FALSE);
  AddSimpleReBarBand(m_ScriptsToolbar, 0, TRUE, 0, FALSE);
  AddSimpleReBarBand(hWndLinksBar, 0, TRUE, 0, TRUE);
  AddSimpleReBarBand(hWndTableBar, 0, TRUE, 0, TRUE) ;
  AddSimpleReBarBand(hWndTableBar2, 0, TRUE, 0, TRUE);
  m_rebar = m_hWndToolBar;

  // add editor controls  
  RECT rc;    
  
  // m_id_caption.SetParent(this->m_hWnd);

  /*HDC hdc = ::GetDC(hWndLinksBar);
  COLORREF bkCollor = GetBkColor(hdc);*/
  HDC hdc1 = ::GetDC(m_id_caption);
  SetBkColor(hdc1, RGB(0,0,0));
  //ReleaseDC(hdc);
  ReleaseDC(hdc1);

  DWORD CBS_COMMON_STYLE =  WS_CHILD | WS_VISIBLE | CBS_AUTOHSCROLL;

  SubclassBox(hWndLinksBar, rc, 1, m_id_box, CBS_COMMON_STYLE, m_id, IDC_ID, hFont);
  SubclassBox(hWndLinksBar, rc, 3, m_href_box, CBS_COMMON_STYLE | WS_VSCROLL | CBS_DROPDOWN | CBS_SORT, m_href, IDC_HREF, hFont);
  SubclassBox(hWndLinksBar, rc, 5, m_section_box, CBS_COMMON_STYLE, m_section, IDC_SECTION, hFont);
  SubclassBox(hWndLinksBar, rc, 7, m_image_title_box, CBS_COMMON_STYLE, m_image_title, IDC_IMAGE_TITLE, hFont);
  
  // add editor-table controls
  HFONT hFontT = (HFONT)::SendMessage(hWndTableBar, WM_GETFONT, 0, 0);
  RECT rcT;

  SubclassBox(hWndTableBar, rcT, 1, m_id_table_id_box, CBS_COMMON_STYLE, m_id_table_id, IDC_IDT, hFontT);
  SubclassBox(hWndTableBar, rcT, 3, m_styleT_table_box, CBS_COMMON_STYLE, m_styleT_table, IDC_STYLET, hFontT);
  SubclassBox(hWndTableBar, rcT, 5, m_id_table_box, CBS_COMMON_STYLE, m_id_table, IDC_ID, hFontT);
  SubclassBox(hWndTableBar, rcT, 7, m_style_table_box, CBS_COMMON_STYLE, m_style_table, IDC_STYLE, hFontT);

  SubclassBox(hWndTableBar2, rcT, 1, m_colspan_table_box, CBS_COMMON_STYLE, m_colspan_table, IDC_COLSPAN, hFontT);
  SubclassBox(hWndTableBar2, rcT, 3, m_rowspan_table_box, CBS_COMMON_STYLE, m_rowspan_table, IDC_ROWSPAN, hFontT);
  SubclassBox(hWndTableBar2, rcT, 5, m_alignTR_table_box, CBS_COMMON_STYLE | WS_VSCROLL | CBS_DROPDOWNLIST, m_alignTR_table, IDC_ALIGNTR, hFontT);
  SubclassBox(hWndTableBar2, rcT, 7, m_align_table_box, CBS_COMMON_STYLE | WS_VSCROLL | CBS_DROPDOWNLIST, m_align_table, IDC_ALIGN, hFontT);
  SubclassBox(hWndTableBar2, rcT, 9, m_valign_table_box, CBS_COMMON_STYLE | WS_VSCROLL | CBS_DROPDOWNLIST, m_valign_table, IDC_VALIGN, hFontT);

  m_align_table_box.InsertString(0,_T(""));
  m_align_table_box.InsertString(1,_T("left"));
  m_align_table_box.InsertString(2,_T("right"));
  m_align_table_box.InsertString(3,_T("center"));

  m_alignTR_table_box.InsertString(0,_T(""));
  m_alignTR_table_box.InsertString(1,_T("left"));
  m_alignTR_table_box.InsertString(2,_T("right"));
  m_alignTR_table_box.InsertString(3,_T("center"));

  m_valign_table_box.InsertString(0,_T(""));
  m_valign_table_box.InsertString(1,_T("top"));
  m_valign_table_box.InsertString(2,_T("middle"));
  m_valign_table_box.InsertString(3,_T("bottom"));

  // create status bar
  CreateSimpleStatusBar();
  m_status.SubclassWindow(m_hWndStatusBar);
  int panes[] =
  {
	  ID_DEFAULT_PANE,
	  ID_PANE_INS
  };
  m_status.SetPanes(panes, sizeof(panes)/sizeof(panes[0]));

	// load insert/overwrite abbreviations  
	::LoadString(_Module.GetResourceInstance(), IDS_PANE_INS, strINS, MAX_LOAD_STRING);
	::LoadString(_Module.GetResourceInstance(), IDS_PANE_OVR, strOVR, MAX_LOAD_STRING);

  // create splitter
  m_hWndClient = m_splitter.Create(m_hWnd,rcDefault,NULL,WS_CHILD|WS_VISIBLE|WS_CLIPSIBLINGS|WS_CLIPCHILDREN);
  m_splitter.SetSplitterExtendedStyle(0);

  // create splitter contents
//  m_document_tree.Create(m_splitter);
//  m_document_tree.SetTitle(L"Document Tree");
  m_view.Create(m_splitter,rcDefault,NULL,WS_CHILD|WS_VISIBLE|WS_CLIPSIBLINGS|WS_CLIPCHILDREN);

  // create a tree
  /*m_dummy_pane.Create(m_document_tree,rcDefault,NULL,WS_CHILD|WS_VISIBLE|WS_CLIPSIBLINGS|WS_CLIPCHILDREN,WS_EX_CLIENTEDGE);
  m_document_tree.SetClient(m_dummy_pane);
  m_document_tree.Create(m_dummy_pane, rcDefault);
  m_document_tree.SetBkColor(::GetSysColor(COLOR_WINDOW));
  m_dummy_pane.SetSplitterPane(0,m_document_tree);
  m_dummy_pane.SetSinglePaneMode(SPLIT_PANE_LEFT);*/

  // create a source view
  m_source.Create(_T("Scintilla"),m_view,rcDefault,NULL,WS_CHILD|WS_CLIPSIBLINGS|WS_CLIPCHILDREN,0);
  m_view.AttachWnd(m_source);
  SetupSci();
  SetSciStyles();

  // initialize a new blank document
  m_doc=new FB::Doc(*this);
  FB::Doc::m_active_doc = m_doc;
  bool start_with_params = false;
  // load a command line arg if it was provided
  if (_ARGV.GetSize()>0 && !_ARGV[0].IsEmpty()) 
  { 
    if (m_doc->Load(m_view,_ARGV[0]))
	{
      start_with_params = true;
	  m_file_age = FileAge(_ARGV[0]);
	}
    else
	{
      return -1; // abort
	}
  } else 
  {
	m_doc->CreateBlank(m_view);
	m_file_age = ~0;
  }

  if (_Settings.FastMode()) {
		m_doc->SetFastMode(true);
		UISetCheck(ID_VIEW_FASTMODE, TRUE);
  } else
    m_doc->SetFastMode(false);

  AttachDocument(m_doc);
  UISetCheck(ID_VIEW_BODY,1);

  m_document_tree.Create(m_splitter);
  
  if (AU::_ARGS.start_in_desc_mode)
    ShowView(DESC);

  // init plugins&MRU list
  InitPlugins();  

  // setup splitter
  m_splitter.SetSplitterPanes(m_document_tree, m_view);

  // hide elements
  if (_Settings.ViewStatusBar()) 
  {
	  UISetCheck(ID_VIEW_STATUS_BAR, 1);
  } 
  else
  {
	  m_status.ShowWindow(SW_HIDE);
	  UISetCheck(ID_VIEW_STATUS_BAR, FALSE);
  }

  if (_Settings.ViewDocumentTree()) 
  {
	  UISetCheck(ID_VIEW_TREE, 1);  
  } 
  else
  {
	  m_document_tree.ShowWindow(SW_HIDE);
	  UISetCheck(ID_VIEW_TREE, FALSE);
      m_splitter.SetSinglePaneMode(SPLIT_PANE_RIGHT);  
  }    

  // load toolbar settings
  for (int j=ATL_IDW_BAND_FIRST;j<ATL_IDW_BAND_FIRST+5;++j)
    UISetCheck(j,TRUE);
  REBARBANDINFO   rbi;
  memset(&rbi,0,sizeof(rbi));
  rbi.cbSize=sizeof(rbi);
  rbi.fMask=RBBIM_SIZE|RBBIM_STYLE;
  CString     tbs(_Settings.GetToolbarsSettings());
  const TCHAR *cp=tbs;
  for (int bn=0;;++bn) {
    const TCHAR	  *ce=_tcschr(cp,_T(';'));
    if (!ce)
      break;
    int	      id,style,cx;
    if (_stscanf(cp,_T("%d,%d,%d;"),&id,&style,&cx)!=3)
      break;
    cp=ce+1;
    int	      idx=m_rebar.IdToIndex(id);
    m_rebar.GetBandInfo(idx,&rbi);
    rbi.fStyle &= ~(RBBS_BREAK|RBBS_HIDDEN);
    style &= RBBS_BREAK|RBBS_HIDDEN;
    rbi.fStyle |= style;
    rbi.cx=cx;
    m_rebar.SetBandInfo(idx,&rbi);
    if (idx!=bn)
      m_rebar.MoveBand(idx,bn);
    UISetCheck(id,style & RBBS_HIDDEN ? FALSE : TRUE);
  }

  // delay resizing
  PostMessage(AU::WM_POSTCREATE);

  // register object for message filtering and idle updates
  CMessageLoop* pLoop = _Module.GetMessageLoop();
  ATLASSERT(pLoop != NULL);
  pLoop->AddMessageFilter(this);
  pLoop->AddIdleHandler(this);

  // accept dropped files
  ::DragAcceptFiles(*this,TRUE);

  // Modification by Pilgrim
  BOOL bVisible = _Settings.ViewDocumentTree();
  m_document_tree.ShowWindow(bVisible ? SW_SHOWNOACTIVATE : SW_HIDE);
  UISetCheck(ID_VIEW_TREE, bVisible);
  m_splitter.SetSinglePaneMode(bVisible ? SPLIT_PANE_NONE : SPLIT_PANE_RIGHT);

  if(start_with_params)
  {
	  m_mru.AddToList(_ARGV[0]);
  	  if(_Settings.RestoreFilePosition())
	  {
			m_restore_pos_cmdline = true;
	  }
  }

  // Раскладка русской клавиатуры
  if (_Settings.GetChangeKeybLayout())
  {
	  CString layout;
	  layout.Format(L"%08x", _Settings.GetKeybLayout());
	  LoadKeyboardLayout(layout,KLF_ACTIVATE);
  }

  // Added by SeNS
  if (m_Speller && m_Speller->Enabled())
  {
	if (!m_Speller->Available())
		UIEnable(ID_TOOLS_SPELLCHECK, false, true);
	else
		UIEnable(ID_TOOLS_SPELLCHECK, true, true);
	m_Speller->SetHighlightMisspells(_Settings.GetHighlightMisspells());
  }
  else UIEnable(ID_TOOLS_SPELLCHECK, false, true);

  return 0;
}

LRESULT CMainFrame::OnDestroy(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
  DestroyAcceleratorTable(m_hAccel);
  bHandled=FALSE;
  return 0;
}

LRESULT CMainFrame::OnClose(UINT /*uMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/, BOOL& /*bHandled*/)
{
  if (DiscardChanges()) 
  {
	// added by SeNS
	if (m_Speller) 
	{
		m_Speller->EndDocumentCheck();
		m_Speller->SetEnabled(false);
	}
	_Settings.SetViewStatusBar(m_status.IsWindowVisible() != 0);
	//_Settings.SetViewDocumentTree(IsSourceActive() ? m_document_tree.IsWindowVisible()==0 : !m_save_sp_mode);
    _Settings.SetSplitterPos(m_splitter.GetSplitterPos());	
    WINDOWPLACEMENT wpl;
    wpl.length=sizeof(wpl);
    GetWindowPlacement(&wpl);
	_Settings.SetWindowPosition(wpl);
    m_mru.WriteToRegistry(_Settings.GetKeyPath());
    // save toolbars state
    CString tbs;
    REBARBANDINFO  rbi;
    memset(&rbi,0,sizeof(rbi));
    rbi.cbSize=sizeof(rbi);
    rbi.fMask=RBBIM_ID|RBBIM_SIZE|RBBIM_STYLE;
    int	  num_bands=m_rebar.GetBandCount();
    for (int i=0;i<num_bands;++i) {
      m_rebar.GetBandInfo(i,&rbi);
      CString	bi;
      bi.Format(_T("%d,%d,%d;"),rbi.wID,rbi.fStyle,rbi.cx);
      tbs+=bi;
    }

	// Save toolbar layout
    m_CmdToolbar.SaveState(HKEY_CURRENT_USER, L"SOFTWARE\\FBETeam\\FictionBook Editor\\Toolbars", L"CommandToolbar");
    m_ScriptsToolbar.SaveState(HKEY_CURRENT_USER, L"SOFTWARE\\FBETeam\\FictionBook Editor\\Toolbars", L"ScriptsToolbar");

    _Settings.SetToolbarsSettings(tbs);
	_Settings.SaveHotkeyGroups();
	_Settings.Save();
	_Settings.SaveWords();
	_Settings.Close();

	DefWindowProc(WM_CLOSE,0,0);
	return 1;
  }
  return 0;
}

LRESULT CMainFrame::OnPostCreate(UINT, WPARAM, LPARAM, BOOL&)
{
	//SetSplitterPos works best after the default WM_CREATE has been handled
	m_splitter.SetSplitterPos(_Settings.GetSplitterPos());

	_Settings.LoadHotkeyGroups();
	DestroyAcceleratorTable(m_hAccel);

	LPACCEL lpaccelNew = new ACCEL[_Settings.keycodes];
	int HKentries = _Settings.keycodes;
	for(unsigned int i = 0; i < _Settings.m_hotkey_groups.size(); ++i)
	{
		for(unsigned int j = 0; j < _Settings.m_hotkey_groups.at(i).m_hotkeys.size(); ++j)
		{
			ACCEL accel = _Settings.m_hotkey_groups.at(i).m_hotkeys.at(j).m_accel;
			if(accel.fVirt != NULL && accel.key != NULL && accel.cmd != NULL)
			{
				lpaccelNew[--HKentries] = accel;
			}
		}
	}

	m_hAccel = CreateAcceleratorTable(lpaccelNew, _Settings.keycodes);
	delete[] lpaccelNew;

	FillMenuWithHkeys(m_MenuBar.GetMenu());
	return 0;
}

// Fill current menu with accelerators' text
void CMainFrame::FillMenuWithHkeys(HMENU menu)
{
	for(unsigned int i = 0; i < _Settings.m_hotkey_groups.size(); ++i)
	{
		std::vector<CHotkey>::iterator begin = _Settings.m_hotkey_groups.at(i).m_hotkeys.begin();
		if(_Settings.m_hotkey_groups.at(i).m_reg_name == L"Scripts"
			|| _Settings.m_hotkey_groups.at(i).m_reg_name == L"Plugins")
			begin++;

		std::sort(begin, _Settings.m_hotkey_groups.at(i).m_hotkeys.end());
		for(unsigned int j = 0; j < _Settings.m_hotkey_groups.at(i).m_hotkeys.size(); ++j)
		{
			CString text;
			WORD cmd = _Settings.m_hotkey_groups.at(i).m_hotkeys.at(j).m_accel.cmd;

			if(::GetMenuString(menu, cmd, text.GetBufferSetLength(MAX_LOAD_STRING + 1), MAX_LOAD_STRING + 1,
				MF_BYCOMMAND))
			{
				text.ReleaseBuffer();
				text += L"\t";
				text += U::AccelToString(_Settings.m_hotkey_groups.at(i).m_hotkeys.at(j).m_accel);

				MENUITEMINFO miim;
				ZeroMemory(&miim, sizeof(MENUITEMINFO));
				miim.cbSize = sizeof(MENUITEMINFO);
				miim.fMask = MIIM_STRING;
				miim.dwTypeData = text.GetBuffer();
				miim.cch = text.GetLength();
				::SetMenuItemInfo(menu, cmd, FALSE, &miim);
			}
		}
	}
}

// search&replace in scintilla
CString	  SciSelection(CWindow source) {
  int	  start=source.SendMessage(SCI_GETSELECTIONSTART);
  int	  end=source.SendMessage(SCI_GETSELECTIONEND);

  if (start>=end)
    return CString();

  char	  *buffer=(char*)malloc(end-start+1);
  if (buffer==NULL)
    return CString();
  source.SendMessage(SCI_GETSELTEXT,0,(LPARAM)buffer);

  char	  *p=buffer;
  while (*p && *p!='\r' && *p!='\n')
    ++p;

  int	  wlen=::MultiByteToWideChar(CP_UTF8,0,buffer,p-buffer,NULL,0);
  CString ret;
  wchar_t *wp=ret.GetBuffer(wlen);
  if (wp)
    ::MultiByteToWideChar(CP_UTF8, 0, buffer ,p-buffer, wp, wlen);
  free(buffer);
  if (wp)
    ret.ReleaseBuffer(wlen);
  return ret;
}

class CSciFindDlg : public CFindDlgBase {
public:
  CWindow	m_source;

  CSciFindDlg(CFBEView *view,HWND src) :
    CFindDlgBase(view), m_source(src)
  {    
  }
  void UpdatePattern()
  {
	  m_view->m_fo.pattern=SciSelection(m_source);
  }

  virtual void	DoFind() {
    GetData();
    if (m_view->SciFindNext(m_source,false,true)) {
      SaveString();
      SaveHistory();
    }
  }
};

class CSciReplaceDlg : public CReplaceDlgBase {
public:
  CWindow	m_source;

  CSciReplaceDlg(CFBEView *view,HWND src) : 
    CReplaceDlgBase(view), m_source(src)
  {    
  }

	void UpdatePattern()
	{
		m_view->m_fo.pattern=SciSelection(m_source);
	}

  virtual void DoFind() {
    if (!m_view->SciFindNext(m_source,true,false))
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
      m_source.SendMessage(SCI_TARGETFROMSELECTION);
      DWORD   len=::WideCharToMultiByte(CP_UTF8,0,
		m_view->m_fo.replacement,m_view->m_fo.replacement.GetLength(),
		NULL,0,NULL,NULL);
      char  *tmp=(char *)malloc(len+1);
      if (tmp) {
	::WideCharToMultiByte(CP_UTF8,0,
		      m_view->m_fo.replacement,m_view->m_fo.replacement.GetLength(),
		      tmp,len,NULL,NULL);
	tmp[len]='\0';
	if (m_view->m_fo.fRegexp)
	  m_source.SendMessage(SCI_REPLACETARGETRE,len,(LPARAM)tmp);
	else
	  m_source.SendMessage(SCI_REPLACETARGET,len,(LPARAM)tmp);
	free(tmp);
      }
      m_selvalid=false;
    }
    DoFind();
  }
  virtual void DoReplaceAll() {
    if (m_view->m_fo.pattern.IsEmpty())
      return;

    // setup search flags
    int	    flags=0;
    if (m_view->m_fo.flags & CFBEView::FRF_WHOLE)
      flags|=SCFIND_WHOLEWORD;
    if (m_view->m_fo.flags & CFBEView::FRF_CASE)
      flags|=SCFIND_MATCHCASE;
    if (m_view->m_fo.fRegexp)
      flags|=SCFIND_REGEXP|SCFIND_POSIX;
    m_source.SendMessage(SCI_SETSEARCHFLAGS,flags,0);

    // setup target range
    int	  end=m_source.SendMessage(SCI_GETLENGTH);
    m_source.SendMessage(SCI_SETTARGETSTART,0);
    m_source.SendMessage(SCI_SETTARGETEND,end);

    // convert search pattern and replacement to utf8
    int	  patlen;
    char  *pattern=AU::ToUtf8(m_view->m_fo.pattern,patlen);
    if (pattern==NULL)
      return;
    int	  replen;
    char  *replacement=AU::ToUtf8(m_view->m_fo.replacement,replen);
    if (replacement==NULL) {
      free(pattern);
      return;
    }

    // find first match
    int pos=m_source.SendMessage(SCI_SEARCHINTARGET,patlen,(LPARAM)pattern);

    int   num_repl=0;

    if (pos!=-1 && pos<=end) {
      int   last_match=pos;

      m_source.SendMessage(SCI_BEGINUNDOACTION);
      while (pos!=-1) {
	int matchlen=m_source.SendMessage(SCI_GETTARGETEND)-m_source.SendMessage(SCI_GETTARGETSTART);
	int mvp=0;
	if (matchlen<=0) {
	  char	ch=(char)m_source.SendMessage(SCI_GETCHARAT,m_source.SendMessage(SCI_GETTARGETEND));
	  if (ch=='\r' || ch=='\n')
	    mvp=1;
	}
	int rlen=matchlen;
	if (m_view->m_fo.fRegexp)
	  rlen=m_source.SendMessage(SCI_REPLACETARGETRE,replen,(LPARAM)replacement);
	else
	  m_source.SendMessage(SCI_REPLACETARGET,replen,(LPARAM)replacement);
	end += rlen-matchlen;
	last_match=pos+rlen+mvp;
	if (last_match>=end)
	  pos=-1;
	else {
	  m_source.SendMessage(SCI_SETTARGETSTART,last_match);
	  m_source.SendMessage(SCI_SETTARGETEND,end);
	  pos=m_source.SendMessage(SCI_SEARCHINTARGET,patlen,(LPARAM)pattern);
	}
	++num_repl;
      }
      m_source.SendMessage(SCI_ENDUNDOACTION);
    }

    free(pattern);
    free(replacement);

    if (num_repl>0) {
      SaveString();
      SaveHistory();
	  wchar_t cpt[MAX_LOAD_STRING + 1];
	  wchar_t msg[MAX_LOAD_STRING + 1];
	  ::LoadString(_Module.GetResourceInstance(), IDS_REPL_ALL_CAPT, cpt, MAX_LOAD_STRING);
	  ::LoadString(_Module.GetResourceInstance(), IDS_REPL_DONE_MSG, msg, MAX_LOAD_STRING);
      U::MessageBox(MB_OK, cpt, msg, num_repl);      
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

CMainFrame::~CMainFrame()
{ 
	delete m_doc; 
	if((bool)m_saved_xml)
	{
		m_saved_xml.Release();
	}
	if(m_sci_find_dlg)
	{		  
		delete m_sci_find_dlg;
	}
}

LRESULT CMainFrame::OnUnhandledCommand(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	HWND hFocus = ::GetFocus();
	UINT idCtl = HIWORD(wParam);

	// only pass messages to the editors
	if (idCtl == 0 || idCtl == 1)
	{
		if (
			hFocus == m_id || hFocus == m_href || hFocus == m_section || ::IsChild(m_id, hFocus)
			|| ::IsChild(m_href, hFocus) || ::IsChild(m_section, hFocus) || hFocus == m_styleT_table
			|| hFocus == m_id_table_id || hFocus == m_id_table || hFocus == m_style_table
			|| hFocus == m_colspan_table || hFocus == m_rowspan_table || hFocus == m_align_table
			|| hFocus == m_valign_table || hFocus == m_alignTR_table || hFocus==m_image_title
			|| ::IsChild(m_id_table_id,hFocus) || ::IsChild(m_id_table, hFocus)
			|| ::IsChild(m_style_table,hFocus) || ::IsChild(m_styleT_table, hFocus)
			|| ::IsChild(m_colspan_table,hFocus) ||::IsChild(m_rowspan_table, hFocus)
			|| ::IsChild(m_alignTR_table,hFocus) || ::IsChild(m_align_table, hFocus)
			|| ::IsChild(m_valign_table,hFocus)|| ::IsChild(m_image_title, hFocus)
			)
				return ::SendMessage(hFocus, WM_COMMAND, wParam, lParam);

		// We need to check that the focused window is a web browser indeed
		if(hFocus == m_view.GetActiveWnd() || ::IsChild(m_view.GetActiveWnd(), hFocus))
		{
			if(IsSourceActive())
			{
				switch (LOWORD(wParam))
				{
					/*case ID_EDIT_UNDO:
						m_source.SendMessage(SCI_UNDO);
						break;*/
					case ID_EDIT_REDO:
						m_source.SendMessage(SCI_REDO);
						break;
					/*case ID_EDIT_CUT:
						m_source.SendMessage(SCI_CUT);
						break;
					case ID_EDIT_COPY:
						m_source.SendMessage(SCI_COPY);
						break;
					case ID_EDIT_PASTE:
						m_source.SendMessage(SCI_PASTE);
						break;*/
					case ID_EDIT_FIND:
						{
						if(!m_sci_find_dlg)
							m_sci_find_dlg = new CSciFindDlg(&m_doc->m_body, m_source);

						if(m_sci_find_dlg->IsValid())
							break;

						m_sci_find_dlg->UpdatePattern();

						m_sci_find_dlg->ShowDialog();
						break;
						}
					case ID_EDIT_FINDNEXT:
						m_doc->m_body.SciFindNext(m_source, false, true);
						break;
					case ID_EDIT_REPLACE:
						{
							if(!m_sci_replace_dlg)
								m_sci_replace_dlg = new CSciReplaceDlg(&m_doc->m_body, m_source);

							if(m_sci_replace_dlg->IsValid())
							break;

							m_sci_replace_dlg->UpdatePattern();

							m_sci_replace_dlg->ShowDialog();
							break;
						}
				}
			}
			else
				return ActiveView().SendMessage(WM_COMMAND, wParam, 0);
		}

		if(hFocus == m_document_tree.m_hWnd || ::IsChild(m_document_tree.m_hWnd, hFocus))
			return m_doc->m_body.SendMessage(WM_COMMAND,wParam,0);
	}

	// Last chance to send common commands to any focused window
	switch (LOWORD(wParam))
	{
	case ID_EDIT_UNDO:
		::SendMessage(hFocus, WM_UNDO, 0, 0);
		break;
	case ID_EDIT_REDO:
		::SendMessage(hFocus, EM_REDO, 0, 0);
		break;
	case ID_EDIT_CUT:
		::SendMessage(hFocus, WM_CUT, 0, 0);
		break;
	case ID_EDIT_COPY:
		::SendMessage(hFocus, WM_COPY, 0, 0);
		break;
	case ID_EDIT_PASTE:
		::SendMessage(hFocus, WM_PASTE, 0, 0);
		break;
	case ID_EDIT_INS_SYMBOL:
		::SendMessage(hFocus, WM_CHAR, wParam, 0);
		break;
	}

	return 0;
}

LRESULT CMainFrame::OnDropFiles(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
  HDROP	  hDrop=(HDROP)wParam;
  UINT	  nf=::DragQueryFile(hDrop,0xFFFFFFFF,NULL,0);
  CString buf, ext;
  if (nf>0) {
    UINT    len=::DragQueryFile(hDrop,0,NULL,0);
    TCHAR   *cp=buf.GetBuffer(len+1);
    len=::DragQueryFile(hDrop,0,cp,len+1);
    buf.ReleaseBuffer(len);
  }
  ::DragFinish(hDrop);
  if (!buf.IsEmpty())
  {
	  ext.SetString(ATLPath::FindExtension(buf));
	  if (ext.CompareNoCase(L".FB2") == 0 )
	  {
		if (LoadFile(buf)==OK)
			m_mru.AddToList(m_doc->m_filename);
	  }
	  else if ((ext.CompareNoCase(L".JPG") == 0) || (ext.CompareNoCase(L".JPEG") == 0) || (ext.CompareNoCase(L".PNG") == 0))
	  {
		  m_doc->m_body.SetFocus();
		  m_doc->m_body.AddImage(buf, false);
	  }
  }
  return 0;
}

// drag & drop to the BODY window
LRESULT CMainFrame::OnNavigate(WORD, WORD, HWND, BOOL&) 
{
  CString   url(m_doc->m_body.NavURL());
  if (!url.IsEmpty())
  {
	  CString ext(ATLPath::FindExtension(url));
	  if (ext.CompareNoCase(L".FB2") == 0 )
	  {
		if (LoadFile(url)==OK)
			m_mru.AddToList(m_doc->m_filename);
	  }
	  else if ((ext.CompareNoCase(L".JPG") == 0) || (ext.CompareNoCase(L".JPEG") == 0) || (ext.CompareNoCase(L".PNG") == 0))
	  {
		  m_doc->m_body.AddImage(url, false);
	  }
  }
  return 0;
}

// commands
LRESULT CMainFrame::OnFileNew(WORD, WORD, HWND, BOOL&)
{
  if (!DiscardChanges())
    return 0;

  FB::Doc *doc=new FB::Doc(*this);
  FB::Doc::m_active_doc = doc;
  doc->CreateBlank(m_view);
  m_file_age = ~0;
  AttachDocument(doc);
  delete m_doc;
  m_doc=doc;

  return 0;
}

LRESULT CMainFrame::OnFileOpen(WORD, WORD, HWND, BOOL& bHandled)
{
  if (LoadFile()==OK)
  {
    m_mru.AddToList(m_doc->m_filename);
	if(_Settings.RestoreFilePosition())
	{
		int saved_pos = U::GetFileSelectedPos(m_doc->m_filename);
		GoTo(saved_pos);
	}
  }
  return 0;
}

LRESULT CMainFrame::OnFileOpenMRU(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	CString filename;
	m_mru.GetFromList(wID, filename);

	switch(LoadFile(filename))
	{
		case OK:
			m_mru.MoveToTop(wID);
			// added by SeNS
			if(_Settings.RestoreFilePosition())
			{
				int saved_pos = U::GetFileSelectedPos(m_doc->m_filename);
				GoTo(saved_pos);
			}
			break;
		case FAIL:
			m_mru.RemoveFromList(wID);
			break;
		case CANCELLED:
			break;
	}

	return 0;
}

LRESULT CMainFrame::OnFileSave(WORD, WORD, HWND, BOOL&)
{
  SaveFile(false);
  return 0;
}

LRESULT CMainFrame::OnFileSaveAs(WORD, WORD, HWND, BOOL&)
{
  SaveFile(true);
  return 0;
}

LRESULT CMainFrame::OnViewToolBar(WORD, WORD wID, HWND, BOOL&)
{
  int nBandIndex = m_rebar.IdToIndex(wID);
  BOOL bVisible = !IsBandVisible(wID);
  m_rebar.ShowBand(nBandIndex, bVisible);
  UISetCheck(wID, bVisible);

  if(wID == 60164 || wID == 60165)
  {
	if (wID == 60164) wID++; else wID--;
	nBandIndex = m_rebar.IdToIndex(wID);
	m_rebar.ShowBand(nBandIndex, bVisible);
	UISetCheck(wID, bVisible);
  }

  UpdateLayout();
  return 0;
}

LRESULT CMainFrame::OnViewStatusBar(WORD, WORD, HWND, BOOL&)
{
  BOOL bVisible = !m_status.IsWindowVisible();
  ::ShowWindow(m_hWndStatusBar, bVisible ? SW_SHOWNOACTIVATE : SW_HIDE);
  UISetCheck(ID_VIEW_STATUS_BAR, bVisible);
  UpdateLayout();
  return 0;
}

LRESULT CMainFrame::OnViewFastMode(WORD, WORD, HWND, BOOL&)
{
	bool mode = m_doc->GetFastMode();
    mode = !mode;
	m_doc->SetFastMode(mode);
	_Settings.SetFastMode(m_doc->GetFastMode(), true);
	UISetCheck(ID_VIEW_FASTMODE, mode);
	UpdateLayout();
	return 0;
}

LRESULT CMainFrame::OnViewTree(WORD, WORD, HWND, BOOL&)
{
	if(IsSourceActive())
		return 0;

	BOOL bVisible = !_Settings.ViewDocumentTree();
	m_document_tree.ShowWindow(bVisible ? SW_SHOWNOACTIVATE : SW_HIDE);
	if(bVisible)
		m_document_tree.GetDocumentStructure(m_doc->m_body.Document());
	UISetCheck(ID_VIEW_TREE, bVisible);
	m_splitter.SetSinglePaneMode(bVisible ? SPLIT_PANE_NONE : SPLIT_PANE_RIGHT);
	_Settings.SetViewDocumentTree(bVisible != 0 , TRUE);

	return 0;
}

LRESULT CMainFrame::OnViewOptions(WORD, WORD, HWND, BOOL&)
{
	bool bFind = m_doc->m_body.CloseFindDialog(m_doc->m_body.m_find_dlg);
	bool bReplace = m_doc->m_body.CloseFindDialog(m_doc->m_body.m_replace_dlg);

	bool bSciFind = m_doc->m_body.CloseFindDialog(m_sci_find_dlg);
	bool bSciRepl = m_doc->m_body.CloseFindDialog(m_sci_replace_dlg);

	int find_repl = bFind || bSciFind ? 1 : 0 + bReplace || bSciRepl ? 2 : 0;

	if(ShowSettingsDialog(m_hWnd))
	{
		ApplyConfChanges();
		/*m_doc->ApplyConfChanges();
		SetSciStyles();*/
	}

	switch(find_repl)
	{
	case 1:
		SendMessage(WM_COMMAND, ID_EDIT_FIND, NULL);
		break;
	case 2:
		SendMessage(WM_COMMAND, ID_EDIT_REPLACE, NULL);
		break;
	}

	return 0;
}

LRESULT CMainFrame::OnToolsImport(WORD, WORD wID, HWND, BOOL&) {
  wID-=ID_IMPORT_BASE;
  if (wID<m_import_plugins.GetSize()) {
    try {
      IUnknownPtr			    unk;
      CheckError(unk.CreateInstance(m_import_plugins[wID]));

      CComQIPtr<IFBEImportPlugin>	    ipl(unk);

      IDispatchPtr  obj;
      _bstr_t	    filename;
      if (ipl) 
	  {
		m_last_plugin = wID + ID_EXPORT_BASE;
		BSTR	bs=NULL;
		HRESULT hr=ipl->Import((long)m_hWnd,&bs,&obj);
		CheckError(hr);
		filename.Assign(bs);
		if (hr!=S_OK)
		return 0;
	  } 
	  else 
	  {
		wchar_t cpt[MAX_LOAD_STRING + 1];
		wchar_t msg[MAX_LOAD_STRING + 1];
		::LoadString(_Module.GetResourceInstance(), IDS_IMPORT_ERR_CPT, cpt, MAX_LOAD_STRING);
		::LoadString(_Module.GetResourceInstance(), IDS_IMPORT_ERR_MSG, msg, MAX_LOAD_STRING);		
		U::MessageBox(MB_OK|MB_ICONERROR, cpt, msg);
		return 0;
      }

      MSXML2::IXMLDOMDocument2Ptr dom(obj);	 
      if (!(bool)dom)
	  {
		wchar_t cpt[MAX_LOAD_STRING + 1];
		wchar_t msg[MAX_LOAD_STRING + 1];
		::LoadString(_Module.GetResourceInstance(), IDS_ERRMSGBOX_CAPTION, cpt, MAX_LOAD_STRING);
		::LoadString(_Module.GetResourceInstance(), IDS_IMPORT_XML_ERR_MSG, msg, MAX_LOAD_STRING);	
		U::MessageBox(MB_OK|MB_ICONERROR, cpt, msg);
	  }
      else if (DiscardChanges()) 
	  {
		/*FB::Doc *doc=new FB::Doc(*this);
		FB::Doc::m_active_doc = doc;*/

		//if (doc->LoadFromDOM(m_view,dom)) {
		CComDispatchDriver	body(m_doc->m_body.Script());
		CComVariant		    args[2];
		CComVariant		    res;
		args[1]=dom.GetInterfacePtr();
		args[0] = _Settings.GetInterfaceLanguageName();		
		CheckError(body.InvokeN(L"LoadFromDOM", args, 2, &res));	
		if(res.boolVal)
		//if (doc->LoadFromHTML(m_view,(const wchar_t* )filename)) 
		{
			if (filename.length()>0) 
			{
				m_doc->m_filename=(const TCHAR *)filename;
				wchar_t str[MAX_PATH];
				wcscpy(str, (const wchar_t*)filename);
				PathRemoveFileSpec(str);
				SetCurrentDirectory(str);
				if (m_doc->m_filename.GetLength()<4 || m_doc->m_filename.Right(4).CompareNoCase(_T(".fb2"))!=0)
				m_doc->m_filename+=_T(".fb2");
				m_doc->m_namevalid=true;
			}
			/*AttachDocument(doc);
			delete m_doc;
			m_doc=doc;*/
			m_doc->m_body.Init();
			m_doc->ResetSavePoint();
		}// else
			//FB::Doc::m_active_doc = m_doc;
		//delete doc;
	  }
	}
    catch (_com_error& e) {
      U::ReportError(e);
    }
  }
  return 0;
}

LRESULT CMainFrame::OnToolsExport(WORD, WORD wID, HWND, BOOL&)
{
	wID -= ID_EXPORT_BASE;
	if(wID<m_export_plugins.GetSize())
	{
		try
		{
			IUnknownPtr unk;
			CheckError(unk.CreateInstance(m_export_plugins[wID]));

			CComQIPtr<IFBEExportPlugin> epl(unk);

			if(epl)
			{
				m_last_plugin = wID + ID_EXPORT_BASE;
				MSXML2::IXMLDOMDocument2Ptr dom(m_doc->CreateDOM(m_doc->m_encoding));
				_bstr_t filename;
				if(m_doc->m_namevalid)
				{
					CString tmp(m_doc->m_filename);
					if(tmp.GetLength() >= 4 && tmp.Right(4).CompareNoCase(_T(".fb2")) == 0)
						tmp.Delete(tmp.GetLength() - 4, 4);
						filename = (const TCHAR*)tmp;
				}
				if(dom)
					CheckError(epl->Export((long)m_hWnd, filename, dom));
				} 
				else 
				{
					wchar_t cpt[MAX_LOAD_STRING + 1];
					wchar_t msg[MAX_LOAD_STRING + 1];
					::LoadString(_Module.GetResourceInstance(), IDS_EXPORT_ERR_CPT, cpt, MAX_LOAD_STRING);
					::LoadString(_Module.GetResourceInstance(), IDS_EXPORT_ERR_MSG, msg, MAX_LOAD_STRING);	
					U::MessageBox(MB_OK|MB_ICONERROR, cpt, msg);
				return 0;
			}
		}
		catch(_com_error& e)
		{
			U::ReportError(e);
		}
	}
	return 0;
}

LRESULT CMainFrame::OnLastPlugin(WORD, WORD wID, HWND, BOOL&)
{
	if(m_last_plugin)
		::SendMessage(m_hWnd, WM_COMMAND, m_last_plugin, NULL);
	return 0;
}

extern "C"
{
	extern const char* build_timestamp;
	extern const char* build_name;
};

class CAboutDlg : public CDialogImpl<CAboutDlg>
{
	CEdit m_Contributors;
public:
	enum { IDD = IDD_ABOUTBOX };

	BEGIN_MSG_MAP(CAboutDlg)
		MESSAGE_HANDLER(WM_INITDIALOG, OnInitDialog)
		MESSAGE_HANDLER(WM_CTLCOLORSTATIC, OnCtlColor)

		COMMAND_ID_HANDLER(IDOK, OnCloseCmd)
		COMMAND_ID_HANDLER(IDCANCEL, OnCloseCmd)

		NOTIFY_HANDLER(IDC_SYSLINK_AB_LINKS, NM_CLICK, OnNMClickSyslinkAbLinks)
	END_MSG_MAP()

	LRESULT OnInitDialog(UINT, WPARAM, LPARAM, BOOL&)
	{
		CString stamp(build_timestamp);
		::SetWindowText(GetDlgItem(IDC_BUILDSTAMP), stamp);

		CString bname(build_name);
		::SetWindowText(GetDlgItem(IDC_STATIC_AB_APPNAMEVER), bname);

		m_Contributors = GetDlgItem(IDC_CONTRIBS);
		HRSRC hres = ::FindResource(NULL, L"ABOUT_FILE", L"ABOUT_FILE");
		HGLOBAL hbytes = ::LoadResource(NULL, hres);
		CA2CT contribs((char*)::LockResource(hbytes), 65001);  // UTF-8
		CString s(contribs);
		m_Contributors.SetWindowText(s.Left(s.ReverseFind(L'\n')-1));

		::SetFocus(GetDlgItem(IDOK));
		return 0;
	}

	LRESULT OnCloseCmd(WORD, WORD wID, HWND, BOOL&)
	{
		EndDialog(wID);
		return 0;
	}

	LRESULT OnCtlColor(UINT, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
	{
		HWND hwndEdit = (HWND) lParam;
		if (hwndEdit == GetDlgItem(IDC_CONTRIBS) )
		{
			HDC hdc = (HDC)wParam;
			::SetBkColor(hdc, RGB(255,255,255));
			return (LRESULT) ::GetStockObject(WHITE_BRUSH);
		}
		return 0;
	}

	LRESULT CAboutDlg::OnNMClickSyslinkAbLinks(int /*idCtrl*/, LPNMHDR pNMHDR, BOOL&)
	{
		PNMLINK pNMLink = (PNMLINK)pNMHDR;
		CString args;

		args.Format(L"url.dll, FileProtocolHandler %s", pNMLink->item.szUrl);
		ShellExecute(NULL, L"open", L"rundll32.exe", args, NULL, SW_SHOW);

		return 0;
	}
};

LRESULT CMainFrame::OnToolsWords(WORD, WORD, HWND, BOOL&)
{
	if(IsSourceActive())
		ShowView(BODY);

	bool bFind = m_doc->m_body.CloseFindDialog(m_doc->m_body.m_find_dlg);
	bool bReplace = m_doc->m_body.CloseFindDialog(m_doc->m_body.m_replace_dlg);

	int find_repl = bFind ? 1 : 0 + bReplace ? 2 : 0;
	ShowWordsDialog(*m_doc, m_hWnd);

	switch(find_repl)
	{
	case 1:
		SendMessage(WM_COMMAND, ID_EDIT_FIND, NULL);
		break;
	case 2:
		SendMessage(WM_COMMAND, ID_EDIT_REPLACE, NULL);
		break;
	}

	return 0;
}

LRESULT CMainFrame::OnToolsOptions(WORD, WORD, HWND, BOOL&)
{
	bool bFind = m_doc->m_body.CloseFindDialog(m_doc->m_body.m_find_dlg);
	bool bReplace = m_doc->m_body.CloseFindDialog(m_doc->m_body.m_replace_dlg);

	bool bSciFind = m_doc->m_body.CloseFindDialog(m_sci_find_dlg);
	bool bSciRepl = m_doc->m_body.CloseFindDialog(m_sci_replace_dlg);

	int find_repl = bFind || bSciFind ? 1 : 0 + bReplace || bSciRepl ? 2 : 0;

	if(ShowSettingsDialog(m_hWnd))
		ApplyConfChanges();

	switch(find_repl)
	{
	case 1:
		SendMessage(WM_COMMAND, ID_EDIT_FIND, NULL);
		break;
	case 2:
		SendMessage(WM_COMMAND, ID_EDIT_REPLACE, NULL);
		break;
	}

	return 0;
}

LRESULT CMainFrame::OnToolsScript(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	wID -= ID_SCRIPT_BASE;

	if(IsSourceActive())
		return 0;

  // скрипты от FBE и от FBW запускаются по разному. В FBE скрипты исполняются через Active Scripting
  // и документ в него передаетяся через параметры. 
  // В FBW скрипты выполняются в самом HTML документе
	for(int i = 0; i < m_scripts.GetSize(); ++i)
	{
		if(m_scripts[i].wID == -1) continue;

		if(m_scripts[i].Type == 2 && m_scripts[i].wID == wID)
		{
			m_doc->RunScript(m_scripts[i].path.GetBuffer());
			m_last_script = &m_scripts[i];
			break;
		}
	}
  
  // TODO тут должен быть else

  /*if (wID < m_scripts.GetSize()) {
  if (StartScript(this) >= 0) {
		if (SUCCEEDED(ScriptLoad(m_scripts[wID].name))){
			if(m_scripts[wID].Type == 0)
			{
				MSXML2::IXMLDOMDocument2Ptr dom(m_doc->CreateDOM(m_doc->m_encoding));
				if (dom) 
				{
					CComVariant arg;
					V_VT(&arg) = VT_DISPATCH;
					V_DISPATCH(&arg) = dom;
					dom.AddRef();
					if (SUCCEEDED(ScriptCall(L"Run",&arg,1,NULL))) 
					{
						m_doc->SetXML(dom);						
					}
				}
			}
			else if(m_scripts[wID].Type == 1)
			{
				SHD::IWebBrowser2Ptr HTMLdomBody = m_doc->m_body.Browser();
				SHD::IWebBrowser2Ptr HTMLdomDesc = m_doc->m_body.Browser();
				CComVariant* arg = new CComVariant[2];				
				V_VT(&arg[0]) = VT_DISPATCH;
				V_DISPATCH(&arg[0]) = HTMLdomBody;
				HTMLdomBody.AddRef();
				V_VT(&arg[1]) = VT_DISPATCH;
				V_DISPATCH(&arg[1]) = HTMLdomDesc;
				HTMLdomDesc.AddRef();
				
				CComVariant vt;
				if (SUCCEEDED(ScriptCall(L"Run",arg,2,&vt))) 
				{
					//m_doc->SetXML(dom);
				}
			}
			else if(m_scripts[wID].Type == 2)
			{
				ScriptCall(L"Run",0,0,0);
			}
      }
      StopScript();
    }
  }*/

  return 0;
}

LRESULT CMainFrame::OnEditInsSymbol(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	static int symHkGroup = -1;
	if(symHkGroup == -1)
	{
		for(unsigned int i = 0; i < _Settings.m_hotkey_groups.size(); ++i)
		{
			if(_Settings.m_hotkey_groups[i].m_reg_name == L"Symbols")
			{
				symHkGroup = i;
				break;
			}
		}
	}
	std::vector<CHotkey>& symHotkeys = _Settings.m_hotkey_groups[symHkGroup].m_hotkeys;

	wchar_t c = NULL;
	for(unsigned int i = 0; i < symHotkeys.size(); ++i)
	{
		if(symHotkeys[i].m_accel.cmd == wID)
		{
			c = symHotkeys[i].m_char_val;
			break;
		}
	}

	if(c)
	{
		HWND aw = ::GetFocus();
		::SendMessage(::GetFocus(), WM_CHAR, c, NULL);

		/*IServiceProviderPtr ServiceProvider;
		ServiceProvider = m_doc->m_body.Browser();
		if(ServiceProvider)
		{
			IOleWindowPtr Window = NULL;
			if(SUCCEEDED(ServiceProvider->QueryService(SID_SShellBrowser, IID_IOleWindow, (void**)&Window)))
			{
				HWND hwndBrowser = NULL;
				if (SUCCEEDED(Window->GetWindow(&hwndBrowser)))
				{
					while(::GetWindow(hwndBrowser, GW_CHILD))
						hwndBrowser = ::GetWindow(hwndBrowser, GW_CHILD);
					::SendMessage(hwndBrowser, WM_CHAR, c, 0);
				}
			}
		}*/
	}

	return 0;
}

LRESULT CMainFrame::OnAppAbout(WORD, WORD, HWND, BOOL&)
{
  CAboutDlg dlg;
  dlg.DoModal();
  return 0;
}

// Navigation
LRESULT CMainFrame::OnSelectCtl(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	switch(wID)
	{
		case ID_SELECT_TREE:
			if(!m_document_tree.IsWindowVisible())
				OnViewTree(0, 0, 0, bHandled);
			m_document_tree.m_tree.m_tree.SetFocus();
			break;
		case ID_SELECT_ID:
			if(!IsBandVisible(ATL_IDW_BAND_FIRST + 2))
				OnViewToolBar(0, ATL_IDW_BAND_FIRST + 2, NULL, bHandled);
			m_id.SetFocus();
			break;
			case ID_SELECT_HREF:
			{
				if(!IsBandVisible(ATL_IDW_BAND_FIRST + 2))
					OnViewToolBar(0,ATL_IDW_BAND_FIRST + 2, NULL, bHandled);
				m_href.SetFocus();
				CString href(U::GetWindowText(m_href));
				m_href.SetSel(0, href.GetLength(), FALSE);
				break;
			}
		case ID_SELECT_IMAGE:
			if(!IsBandVisible(ATL_IDW_BAND_FIRST + 2))
				OnViewToolBar(0, ATL_IDW_BAND_FIRST + 2, NULL, bHandled);
			m_image_title.SetFocus();
			break;
		case ID_SELECT_TEXT:
			m_view.SetFocus();
			break;
		case ID_SELECT_SECTION:
			if (!IsBandVisible(ATL_IDW_BAND_FIRST + 2))
				OnViewToolBar(0, ATL_IDW_BAND_FIRST + 2, NULL, bHandled);
			m_section.SetFocus();
			break;
		case ID_SELECT_IDT:
			if(!IsBandVisible(ATL_IDW_BAND_FIRST + 2))
				OnViewToolBar(0, ATL_IDW_BAND_FIRST + 2, NULL, bHandled);
			m_id_table_id.SetFocus();
			break;
		case ID_SELECT_STYLET:
			if(!IsBandVisible(ATL_IDW_BAND_FIRST + 2))
				OnViewToolBar(0, ATL_IDW_BAND_FIRST + 2, NULL, bHandled);
			m_styleT_table.SetFocus();
			break;
		case ID_SELECT_STYLE:
			if(!IsBandVisible(ATL_IDW_BAND_FIRST+  2))
				OnViewToolBar(0, ATL_IDW_BAND_FIRST + 2, NULL, bHandled);
			m_style_table.SetFocus();
			break;
		case ID_SELECT_COLSPAN:
			if(!IsBandVisible(ATL_IDW_BAND_FIRST + 3))
				OnViewToolBar(0, ATL_IDW_BAND_FIRST + 3, NULL, bHandled);
			m_colspan_table.SetFocus();
			break;
		case ID_SELECT_ROWSPAN:
			if(!IsBandVisible(ATL_IDW_BAND_FIRST + 3))
				OnViewToolBar(0, ATL_IDW_BAND_FIRST + 3, NULL, bHandled);
			m_rowspan_table.SetFocus();
			break;
		case ID_SELECT_ALIGNTR:
			if(!IsBandVisible(ATL_IDW_BAND_FIRST + 3))
			OnViewToolBar(0, ATL_IDW_BAND_FIRST + 3, NULL, bHandled);
			m_alignTR_table.SetFocus();
			break;
		case ID_SELECT_ALIGN:
			if(!IsBandVisible(ATL_IDW_BAND_FIRST + 3))
				OnViewToolBar(0, ATL_IDW_BAND_FIRST + 3, NULL, bHandled);
			m_align_table.SetFocus();
			break;
		case ID_SELECT_VALIGN:
			if(!IsBandVisible(ATL_IDW_BAND_FIRST + 3))
				OnViewToolBar(0, ATL_IDW_BAND_FIRST + 3, NULL, bHandled);
			m_valign_table.SetFocus();
			break;
	}

	return 0;
}

LRESULT CMainFrame::OnNextItem(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
  ShowView(NEXT);
  return 1;
}

// editor notifications
LRESULT CMainFrame::OnCbEdChange(WORD code, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
  if (m_ignore_cb_changes)
    return 0;

  try {
    if (wID==IDC_HREF) {
      MSHTML::IHTMLElementPtr an(m_doc->m_body.SelectionAnchor());
      _variant_t    href;
      if (an)
		href=an->getAttribute(L"href",2);
      if ((bool)an && V_VT(&href)==VT_BSTR) {
		CString	    newhref(U::GetWindowText(m_href));

		// changed by SeNS: href's fix - by default internal hrefs begins from '#'
		// otherwise set http protocol (if no other protocols specified)
		if (!newhref.IsEmpty() && (newhref[0] != L'#'))
		{
			if (newhref.Find (L"://") < 0)
				newhref = L"http://" + newhref;
		}

		if ( (U::scmp(an->tagName,L"DIV")==0) || (U::scmp(an->tagName,L"SPAN")==0)) // must be an image
		{			
			U::ChangeAttribute(an, L"href", newhref);
			MSHTML::IHTMLElementPtr img = MSHTML::IHTMLDOMNodePtr(an)->firstChild;
			m_doc->m_body.ImgSetURL(img, newhref);
			IHTMLControlRangePtr r(((MSHTML::IHTMLElement2Ptr)(m_doc->m_body.Document()->body))->createControlRange());
			r->add((IHTMLControlElementPtr)img->parentElement);
			r->select();
		}
		else
		{
			U::ChangeAttribute(an, L"href", newhref);
			MSHTML::IHTMLTxtRangePtr r = m_doc->m_body.Document()->selection->createRange();
			r->moveToElementText(an);
			r->select();
		}
      } else {
        m_href_box.SetWindowText(_T(""));
		m_href_box.EnableWindow(FALSE);
		m_href_caption.SetEnabled(false);
      }
    }
    if (wID==IDC_ID) {
      MSHTML::IHTMLElementPtr		sc(m_doc->m_body.SelectionStructCon());
      if (sc)
		sc->id=(const wchar_t *)U::GetWindowText(m_id);
      else
	  {
		m_id_box.EnableWindow(FALSE);
		m_id_caption.SetEnabled(false);
	  }
    }
	if (wID==IDC_SECTION) {
		MSHTML::IHTMLElementPtr		scs(m_doc->m_body.SelectionStructSection());
		if (scs)
			scs->id=(const wchar_t *)U::GetWindowText(m_section);
		else
			m_section.EnableWindow(FALSE);
	}	

	if (wID==IDC_IMAGE_TITLE) {
		MSHTML::IHTMLElementPtr		scs(m_doc->m_body.SelectionStructImage());
		if (scs)
		{
			//scs->title=(const wchar_t *)U::GetWindowText(m_image_title);
			U::ChangeAttribute(scs, L"title", (const wchar_t *)U::GetWindowText(m_image_title));

			IHTMLControlRangePtr r(((MSHTML::IHTMLElement2Ptr)(m_doc->m_body.Document()->body))->createControlRange());
			r->add((IHTMLControlElementPtr)scs);
			r->select();
		}
		else
		{
			m_image_title_box.EnableWindow(FALSE);
			m_image_title_caption.SetEnabled(false);
		}
	}
	
	if (wID==IDC_IDT) {
		MSHTML::IHTMLElementPtr		sc(m_doc->m_body.SelectionStructTable());
		if (sc)
			sc->id=(const wchar_t *)U::GetWindowText(m_id_table_id);
		else
		{
			m_id_table_id_box.EnableWindow(FALSE);
			m_table_id_caption.SetEnabled(false);
		}
	}
	if (wID==IDC_ID) {
		MSHTML::IHTMLElementPtr		sc(m_doc->m_body.SelectionStructTableCon());
		if (sc)
			sc->id=(const wchar_t *)U::GetWindowText(m_id_table);
		else
		{
			m_id_table_box.EnableWindow(FALSE);
			m_id_table_caption.SetEnabled(false);
		}
	}
	if (wID==IDC_STYLET) {
		_bstr_t style("");
		MSHTML::IHTMLElementPtr		sc(m_doc->m_body.SelectionsStyleTB(style));
		if (sc){
			CString	    newsSyleT(U::GetWindowText(m_styleT_table));
			sc->setAttribute(L"fbstyle",_variant_t((const wchar_t *)newsSyleT),0);
		}
		else
		{
			m_style_table_box.EnableWindow(FALSE);
			m_style_caption.SetEnabled(false);
		}
	}
	if (wID==IDC_STYLE) {
		_bstr_t style("");
		MSHTML::IHTMLElementPtr		sc(m_doc->m_body.SelectionsStyleB(style));
		if (sc){
			CString	    newsSyle(U::GetWindowText(m_style_table));
			sc->setAttribute(L"fbstyle",_variant_t((const wchar_t *)newsSyle),0);
		}	
		else
		{
			m_style_table_box.EnableWindow(FALSE);
			m_style_caption.SetEnabled(false);
		}
	}
	if (wID==IDC_COLSPAN) {
		_bstr_t colspan("");
		MSHTML::IHTMLElementPtr		sc(m_doc->m_body.SelectionsColspanB(colspan));
		if (sc){
			CString	    newsColspan(U::GetWindowText(m_colspan_table));
			sc->setAttribute(L"fbcolspan",_variant_t((const wchar_t *)newsColspan),0);
		}
		else
		{
			m_colspan_table_box.EnableWindow(FALSE);
			m_colspan_caption.SetEnabled(false);
		}
	}
	if (wID==IDC_ROWSPAN) {
		_bstr_t rowspan("");
		MSHTML::IHTMLElementPtr		sc(m_doc->m_body.SelectionsRowspanB(rowspan));
		if (sc){
			CString	    newsRowspan(U::GetWindowText(m_rowspan_table));
			sc->setAttribute(L"fbrowspan",_variant_t((const wchar_t *)newsRowspan),0);
		}
		else
		{
			m_rowspan_table_box.EnableWindow(FALSE);
			m_rowspan_caption.SetEnabled(false);
		}
	}
	if (wID==IDC_ALIGNTR) {
		_bstr_t alignTR("");
		MSHTML::IHTMLElementPtr		sc(m_doc->m_body.SelectionsAlignTRB(alignTR));
		if (sc){
			CString	    newsAlignTR(U::GetWindowText(m_alignTR_table));
			sc->setAttribute(L"fbalign",_variant_t((const wchar_t *)newsAlignTR),0);
		}
		else
		{
			m_alignTR_table_box.EnableWindow(FALSE);
			m_tr_allign_caption.SetEnabled(false);
		}
	}
	if (wID==IDC_ALIGN) {
		_bstr_t align("");
		MSHTML::IHTMLElementPtr		sc(m_doc->m_body.SelectionsAlignB(align));
		if (sc){
			CString	    newsAlign(U::GetWindowText(m_align_table));
			sc->setAttribute(L"fbalign",_variant_t((const wchar_t *)newsAlign),0);
		}
		else
		{
			m_align_table_box.EnableWindow(FALSE);
			m_th_allign_caption.SetEnabled(false);
		}
	}
	if (wID==IDC_VALIGN) {
		_bstr_t valign("");
		MSHTML::IHTMLElementPtr		sc(m_doc->m_body.SelectionsVAlignB(valign));
		if (sc){
			CString	    newsVAlign(U::GetWindowText(m_valign_table));
			sc->setAttribute(L"fbvalign",_variant_t((const wchar_t *)newsVAlign),0);
		}
		else
		{
			m_valign_table_box.EnableWindow(FALSE);
			m_valign_caption.SetEnabled(false);	
		}
	}
  }
  catch (_com_error&) { }

  return 0;
}

// tree view notifications 
LRESULT CMainFrame::OnTreeReturn(WORD, WORD, HWND, BOOL&)
{
  GoToSelectedTreeItem();
  return 0;	
}

LRESULT CMainFrame::OnTreeUpdate(WORD, WORD, HWND, BOOL&)
{
  GetDocumentStructure();
  return 0;
}

LRESULT CMainFrame::OnTreeRestore(WORD, WORD, HWND, BOOL& b)
{
  m_document_tree.GetDocumentStructure(m_doc->m_body.Document());
  return 0;
}

LRESULT CMainFrame::OnTreeMoveElement(WORD, WORD, HWND, BOOL&)
{
	m_doc->m_body.BeginUndoUnit(L"structure editing");
	CTreeItem from = m_document_tree.m_tree.m_tree.GetMoveElementFrom();
	CTreeItem to = m_document_tree.m_tree.m_tree.GetMoveElementTo();

	MSHTML::IHTMLElementPtr elemFrom = (MSHTML::IHTMLElement *)from.GetData();
	MSHTML::IHTMLElementPtr elemTo;
	
	MSHTML::IHTMLDOMNodePtr nodeFrom =(MSHTML::IHTMLDOMNodePtr)elemFrom;
	MSHTML::IHTMLDOMNodePtr nodeTo;
	MSHTML::IHTMLDOMNodePtr nodeInsertBefore;	

	switch(m_document_tree.m_tree.m_tree.m_insert_type)
	{
	case CTreeView::child:
		{
			elemTo = (MSHTML::IHTMLElement *)to.GetData();
			nodeTo =(MSHTML::IHTMLDOMNodePtr)elemTo;
			nodeInsertBefore = nodeTo->firstChild;
			break;
		}

	case CTreeView::sibling:
		{
			elemTo = (MSHTML::IHTMLElement *)to.GetData();
			nodeTo =(MSHTML::IHTMLDOMNodePtr)elemTo;
			nodeInsertBefore = nodeTo->nextSibling;
			nodeTo = nodeTo->parentNode;
			break;
		}

	case CTreeView::none:
		{			
			m_doc->m_body.EndUndoUnit();
			return 0;
		}
	}
	
	if(!IsNodeSection(nodeFrom) || !IsNodeSection(nodeTo))
	{
		m_doc->m_body.EndUndoUnit();
		return 0;
	}

	if(!IsEmptySection(nodeTo))
	{
		MSHTML::IHTMLDOMNodePtr new_section = CreateNestedSection(nodeTo);
		if(!bool(new_section))
		{
			m_doc->m_body.EndUndoUnit();
			return 0;
		}

		nodeInsertBefore = new_section->nextSibling;
	}
	m_doc->MoveNode(nodeFrom, nodeTo, nodeInsertBefore);	
	m_document_tree.UpdateDocumentStructure(m_doc->m_body.Document(), nodeTo);
	m_doc->m_body.EndUndoUnit();
	return 0;
}

LRESULT CMainFrame::OnTreeMoveElementOne(WORD, WORD, HWND, BOOL&)
{
	m_doc->m_body.BeginUndoUnit(L"structure editing");
	CTreeItem item = m_document_tree.m_tree.m_tree.GetFirstSelectedItem();
	MSHTML::IHTMLElementPtr elem = 0;
	MSHTML::IHTMLDOMNodePtr ret_node = 0;
	
	do
	{
		if(item.IsNull())
			break;
		

		if(!item.GetData() || !(bool)(elem = (IHTMLElement*) item.GetData()))	
			continue;
		
		MSHTML::IHTMLDOMNodePtr node = (MSHTML::IHTMLDOMNodePtr)elem;
		if(!(bool)node)
			continue;
		
		ret_node = MoveRightElementWithoutChildren(node);
	}while(item = m_document_tree.m_tree.m_tree.GetNextSelectedItem(item));

	GetDocumentStructure();
	if((bool)ret_node)
	{
		MSHTML::IHTMLElementPtr elem(ret_node);
		m_document_tree.m_tree.m_tree.SelectElement(elem);
		GoTo(elem);
	}

	m_doc->m_body.EndUndoUnit();
	return 0;
}

LRESULT CMainFrame::OnTreeMoveLeftElement(WORD, WORD, HWND, BOOL&)
{
	m_doc->m_body.BeginUndoUnit(L"structure editing");
	CTreeItem item = m_document_tree.m_tree.m_tree.GetLastSelectedItem();
	MSHTML::IHTMLElementPtr elem = 0;
	MSHTML::IHTMLDOMNodePtr ret_node;
	
	do
	{
		if(item.IsNull())
			break;		

		if(!item.GetData() || !(bool)(elem = (IHTMLElement*) item.GetData()))	
			continue;
		
		MSHTML::IHTMLDOMNodePtr node = (MSHTML::IHTMLDOMNodePtr)elem;
		if(!(bool)node)
			continue;

		ret_node = MoveLeftElement(node);
	}while(item = m_document_tree.m_tree.m_tree.GetPrevSelectedItem(item));

	GetDocumentStructure();
	if((bool)ret_node)
	{
		MSHTML::IHTMLElementPtr elem(ret_node);
		m_document_tree.m_tree.m_tree.SelectElement(elem);
		GoTo(elem);
	}

	m_doc->m_body.EndUndoUnit();
	return 0;
}

LRESULT CMainFrame::OnTreeMoveElementSmart(WORD, WORD, HWND, BOOL&)
{
	// если выделен только один элемент, то двигаем его вправо
	// если несколько, то проверяем братья они или нет
	// если братья, то делаем такую фичу
	// ----------
	// ----------
	//   ----------    первый выделенный элемент
	//   ----------
	// ----------
	//   ----------    второй выделенный элемент
	//   ----------

	// для небратьев делаем то же что и для одного

	m_doc->m_body.BeginUndoUnit(L"structure editing");
	CTreeItem item = m_document_tree.m_tree.m_tree.GetFirstSelectedItem();

	MSHTML::IHTMLDOMNodePtr node = RecoursiveMoveRightElement(item);	
	GetDocumentStructure();
	if((bool)node)
	{
		MSHTML::IHTMLElementPtr elem(node);
		m_document_tree.m_tree.m_tree.SelectElement(elem);
		GoTo(elem);
	}

	m_doc->m_body.EndUndoUnit();
	
	return 0;
}

MSHTML::IHTMLDOMNodePtr CMainFrame::RecoursiveMoveRightElement(CTreeItem item)
{
	MSHTML::IHTMLDOMNodePtr ret;
	if(item.IsNull() || !item.GetData())
		return false;

	CTreeItem next_selected_sibling = m_document_tree.m_tree.m_tree.GetNextSelectedSibling(item);
	bool smart_selection = (!next_selected_sibling.IsNull()) && (item.GetNextSibling() != next_selected_sibling);

	if(smart_selection)
	{		
		CTreeItem next_sibling = item.GetNextSibling();
		CTreeItem cur_selected = next_selected_sibling; 
		while(!item.IsNull())
		{	
			if(!item.GetData())
				return 0;
			MSHTML::IHTMLElementPtr elem = (MSHTML::IHTMLElement*)item.GetData();
			if(!(bool)elem)
				return 0;

			MSHTML::IHTMLDOMNodePtr node =  MSHTML::IHTMLDOMNodePtr(elem);

			if(!(bool)node)
				return 0;

			MoveRightElement(node);			
			if(next_sibling.IsNull())
				break;

			item = next_sibling;
			next_sibling = next_sibling.GetNextSibling();			

			if(!next_selected_sibling.IsNull() && next_sibling == next_selected_sibling)
			{
				item = next_selected_sibling;
				next_sibling = next_selected_sibling.GetNextSibling();
				cur_selected = next_selected_sibling;
				next_selected_sibling = m_document_tree.m_tree.m_tree.GetNextSelectedSibling(next_selected_sibling);				
				continue;
			}			
		}
		RecoursiveMoveRightElement(m_document_tree.m_tree.m_tree.GetNextSelectedItem(cur_selected));
	}
	else
	{			
		while(!item.IsNull())
		{
			MSHTML::IHTMLElementPtr elem = (MSHTML::IHTMLElement*)item.GetData();
			if(!(bool)elem)
				return 0;

			MSHTML::IHTMLDOMNodePtr node =  MSHTML::IHTMLDOMNodePtr(elem);
			if(!(bool)node)
				return 0;

			ret = MoveRightElement(node);

			item = m_document_tree.m_tree.m_tree.GetNextSelectedItem(item);
		}
	}
	return ret;
}


LRESULT CMainFrame::OnTreeViewElement(WORD, WORD, HWND, BOOL&)
{
	GoToSelectedTreeItem();
	return 0;
}

LRESULT CMainFrame::OnTreeViewElementSource(WORD, WORD, HWND, BOOL&)
{	
	CTreeItem item = m_document_tree.GetSelectedItem();
	if(!item.IsNull() && item.GetData())
	{
		MSHTML::IHTMLBodyElementPtr body = (MSHTML::IHTMLBodyElementPtr)m_doc->m_body.Document()->body;
		MSHTML::IHTMLTxtRangePtr rng = body->createTextRange();
		MSHTML::IHTMLElement* elem = (MSHTML::IHTMLElement*)item.GetData();
		rng->moveToElementText(elem);		
		rng->select();
		ShowView(SOURCE);
	}
	
	return 0;
}

LRESULT CMainFrame::OnTreeDeleteElement(WORD, WORD, HWND, BOOL&)
{
	wchar_t cpt[MAX_LOAD_STRING + 1];
	wchar_t msg[MAX_LOAD_STRING + 1];
	::LoadString(_Module.GetResourceInstance(), IDS_DOCUMENT_TREE_CAPTION, cpt, MAX_LOAD_STRING);
	::LoadString(_Module.GetResourceInstance(), ID_DT_DELETE, msg, MAX_LOAD_STRING);
	CString message(msg);
	message += L"?";

	if (MessageBox(message, cpt, MB_YESNO | MB_ICONINFORMATION) == IDYES)
	{
		CTreeItem item = m_document_tree.m_tree.m_tree.GetLastSelectedItem();
		m_doc->m_body.BeginUndoUnit(L"structure editing");
		do 
		{	
			if(!item.IsNull() && item.GetData())
			{
				MSHTML::IHTMLElement* elem = (MSHTML::IHTMLElement*)item.GetData();
				if(!elem)
					return 0;

				MSHTML::IHTMLDOMNodePtr node = (MSHTML::IHTMLDOMNodePtr)elem;
				node->removeNode(VARIANT_TRUE);
			}
			else break;

			item = m_document_tree.m_tree.m_tree.GetPrevSelectedItem(item);
		} while(!item.IsNull());
		m_doc->m_body.EndUndoUnit();
	}
	return 0;
}


LRESULT CMainFrame::OnTreeMerge(WORD, WORD, HWND, BOOL&)
{
	CTreeItem item = m_document_tree.GetSelectedItem();
	if(item.IsNull())
		return 0;

	MSHTML::IHTMLElement* elem = (MSHTML::IHTMLElement*)item.GetData();
	if(!elem)
		return 0;

	bool merged = m_doc->m_body.bCall(L"MergeContainers", elem);
	m_doc->m_body.Call(L"MergeContainers", elem);
	// Move cursor to selected element
	if(merged)
		GoTo(elem);

	return 0;
}

LRESULT CMainFrame::OnTreeClick(WORD, WORD, HWND hWndCtl, BOOL&)
{
  GoToSelectedTreeItem();
  return 0;
}

// binary objects
LRESULT CMainFrame::OnEditAddBinary(WORD, WORD, HWND, BOOL&) {
  if (!m_doc)
    return 0;

  // Modification by Pilgrim
  CFileDialogEx	dlg(
    TRUE,
    _T("*"),
    NULL,
	OFN_ALLOWMULTISELECT | OFN_HIDEREADONLY | OFN_PATHMUSTEXIST | OFN_NOCHANGEDIR,
	L"All files (*.*)\0*.*\0FBE supported (*.jpg;*.jpeg;*.png)\0*.jpg;*.jpeg;*.png\0JPEG (*.jpg)\0*.jpg\0PNG (*.png)"\
	L"\0*.png\0Bitmap (*.bmp)\0*.bmp\0GIF (*.gif)\0*.gif\0TIFF (*.tif)\0*.tif\0\0"
  );  
  wchar_t dlgTitle[MAX_LOAD_STRING + 1];
  ::LoadString(_Module.GetResourceInstance(), IDS_ADD_BINARIES_FILEDLG, dlgTitle, MAX_LOAD_STRING);
  dlg.m_ofn.lpstrTitle = dlgTitle;
  dlg.m_ofn.nFilterIndex = 2;


  if (dlg.DoModal(*this)==IDOK) {
	_POSITION_ pos = dlg.GetStartPosition();
	while(pos) {
		CString fileName(dlg.GetNextPathName(pos));
		m_doc->AddBinary(fileName);
	}	
  }

  return 0;
}

// incremental search
LRESULT CMainFrame::OnEditIncSearch(WORD, WORD, HWND, BOOL&) {
  if (IsSourceActive())
    return 0;

  if (m_incsearch==0) {
    ShowView();
    m_doc->m_body.StartIncSearch();
    m_is_str.Empty();
    m_is_prev=m_doc->m_body.LastSearchPattern();
    m_incsearch=1;
    m_is_fail=false;
    SetIsText();
  } else if (m_incsearch==1 && m_is_str.IsEmpty() && !m_is_prev.IsEmpty()) {
    m_incsearch=2;
    m_is_str.Empty();
    for (int i=0;i<m_is_prev.GetLength();++i)
      PostMessage(WM_CHAR,m_is_prev[i],0x20000000);
  } else if (!m_is_fail)
    m_doc->m_body.DoIncSearch(m_is_str,true);
  return 0;
}

LRESULT CMainFrame::OnChar(UINT, WPARAM wParam, LPARAM lParam, BOOL&)
{
  if (!m_incsearch)
    return 0;
  // only a few keys are supported
  if (wParam==8) { // backspace
    if (!m_is_str.IsEmpty())
      m_is_str.Delete(m_is_str.GetLength()-1);
    if (!m_doc->m_body.DoIncSearch(m_is_str,false)) {
      m_is_fail=true;
      ::MessageBeep(MB_ICONEXCLAMATION);
    } else
      m_is_fail=false;
  } else if (wParam==13) { // enter
    StopIncSearch(false);
    return 0;
  } else if (wParam>=32 && wParam!=127) { // printable char
    if (m_is_fail) {
      ::MessageBeep(MB_ICONEXCLAMATION);
      if (!(lParam&0x20000000))
	return 0;
    }
    m_is_str+=(TCHAR)wParam;
    if (!m_doc->m_body.DoIncSearch(m_is_str,false)) {
      if (!m_is_fail)
	::MessageBeep(MB_ICONEXCLAMATION);
      m_is_fail=true;
    } else
      m_is_fail=false;
  }
  SetIsText();
  return 0;
}

bool  CMainFrame::SourceToHTML() 
{
	LRESULT changed = m_source.SendMessage(SCI_GETMODIFY);
	int	    textlen = 0;
	char*	buffer = 0;

	int begin_char = 0;
	int end_char = 0;
	int bodies_count = 0;
	
	// берем текст
	textlen = m_source.SendMessage(SCI_GETLENGTH);
	buffer = new char[textlen + 1];
	m_source.SendMessage(SCI_GETTEXT, textlen+1, (LPARAM)buffer);
	// конвертим в UTF16
	DWORD   ulen=::MultiByteToWideChar(CP_UTF8,0,buffer,textlen,NULL,0);

	BSTR    ustr=::SysAllocStringLen(NULL,ulen);
	::MultiByteToWideChar(CP_UTF8,0,buffer,textlen,ustr,ulen);
	
	//	смотрим выделенную позицию	
	int	  selectedPosBegin = m_source.SendMessage(SCI_GETSELECTIONSTART);    
	int	  selectedPosEnd = m_source.SendMessage(SCI_GETSELECTIONEND);    
	bool one_pos = selectedPosEnd == selectedPosBegin;
	if(one_pos)
	{
		selectedPosEnd = selectedPosBegin = MultiByteToWideChar(CP_UTF8,0,buffer,selectedPosBegin,NULL,0);
	}
	else
	{
		selectedPosBegin = MultiByteToWideChar(CP_UTF8,0,buffer,selectedPosBegin,NULL,0);
		selectedPosEnd = MultiByteToWideChar(CP_UTF8,0,buffer,selectedPosEnd,NULL,0);
	}	

	//	перегоняем в XML
	U::DomPath path_begin;
	U::DomPath path_end;

	path_begin.CreatePathFromText(ustr, selectedPosBegin, &begin_char);
	
	if(one_pos)
	{
		path_end = path_begin;
		end_char = begin_char;
	}
	else
	{	
		path_end.CreatePathFromText(ustr, selectedPosEnd, &end_char);
	}
		
	if(changed)
	{
		if((bool)m_saved_xml)
		{
			m_saved_xml.Release();
			m_saved_xml = 0;
		}
		
		if(!m_doc->TextToXML(ustr, (MSXML2::IXMLDOMDocument2Ptr*)(&m_saved_xml)))
		{
			CComDispatchDriver	body(m_doc->m_body.Script());
			CComVariant		    args[1];
			CComVariant		    ret;
			args[0]=ustr;
			CheckError(body.Invoke1(L"XmlFromText",&args[0], &ret));
			if(ret.vt == VT_DISPATCH)
			{
				m_saved_xml = ret.pdispVal;
				// если вернулся не xml, значит вернулась ошибка
				if(!(bool)m_saved_xml)
				{
					MSXML2::IXMLDOMParseErrorPtr err = ret.pdispVal;
					if(!(bool)err)
					{
						return false;
					}
					bstr_t msg = err->reason;
					int line = err->line;
					int linepos = err->linepos;
					::SendMessage(m_doc->m_frame,AU::WM_SETSTATUSTEXT,0,(LPARAM)(const TCHAR *)msg);
					SourceGoTo(line, linepos);
					return false;
				}
			}
			else
			{
				SysFreeString(ustr);
				return false;
			}			
		}
	}

	SysFreeString(ustr);
	
	
	MSXML2::IXMLDOMNodeListPtr ChildNodes = m_saved_xml->documentElement->childNodes;
	MSXML2::IXMLDOMNodePtr body;

	MSXML2::IXMLDOMElementPtr selectedElementBegin = path_begin.GetNodeFromXMLDOM(m_saved_xml);
	for(int i = 0; i < ChildNodes->length; i++)
	{
		bstr_t name = ChildNodes->item[i]->nodeName;
		if(U::scmp(ChildNodes->item[i]->nodeName, L"body") == 0)
		{
			if(U::IsParentElement(selectedElementBegin, ChildNodes->item[i]))
			{
				body = ChildNodes->item[i];
				break;
			}
			else
			{
				++bodies_count;				
			}			
		}
	}
	
	// строим относительный путь. Относительно секции body
	path_begin.CreatePathFromXMLDOM(body, selectedElementBegin);
	MSXML2::IXMLDOMElementPtr selectedElementEnd;
	if(one_pos)
	{
		path_end = path_begin;
	}
	else
	{
		selectedElementEnd  = path_end.GetNodeFromXMLDOM(m_saved_xml);
		path_end.CreatePathFromXMLDOM(body, selectedElementEnd);
	}	
	

	// если документ был изменен, то перегоняем его в HTML
	if(changed)
	{
		// перегоняем в HTML
		CComDispatchDriver	body(m_doc->m_body.Script());
		CComVariant		    args[2];
		args[1] = m_saved_xml.GetInterfacePtr();
		args[0] = _Settings.GetInterfaceLanguageName();
		CheckError(body.InvokeN(L"LoadFromDOM", args, 2));
		m_doc->m_body.Init();
		// у нас совершенно новый HTML и указатели на элшементы старого теперь невалидны.
		ClearSelection();
		
        //m_saved_xml.Release();
		//m_saved_xml = 0;		
	}

	//	В HTML по пути находим нужный элемент
	MSHTML::IHTMLElementPtr selectedHTMLElementBegin;	
	MSHTML::IHTMLElementPtr selectedHTMLElementEnd;	
	
	MSHTML::IHTMLDOMNodePtr root = m_doc->m_body.Document()->body;
	root = root->firstChild; // <DIV id = fbw_desc>
	root = root->nextSibling; // <DIV id = fbw_body>
	root = root->firstChild;// <DIV clss = ...>
	do
	{
		if(U::scmp(MSHTML::IHTMLElementPtr(root)->className, L"body") == 0)
		{
			if(bodies_count)
			{
				--bodies_count;
			}
			else
			{
				selectedHTMLElementBegin = path_begin.GetNodeFromHTMLDOM(root);
				if(one_pos)
				{
					selectedHTMLElementEnd = selectedHTMLElementBegin;
				}
				else
				{
					selectedHTMLElementEnd = path_end.GetNodeFromHTMLDOM(root);
				}
				break;
			}
		}
	}while(root = root->nextSibling);
	
	delete buffer;
	m_doc->m_body.GoTo(selectedHTMLElementBegin);		
	m_body_selection =  m_doc->m_body.SetSelection(selectedHTMLElementBegin, selectedHTMLElementEnd, begin_char, end_char);	
	m_doc->MarkDocCP(); // document is in sync with source
	if(_Settings.ViewDocumentTree())
	{
		m_document_tree.GetDocumentStructure(m_doc->m_body.Document());	
	}
	return true;
	//m_document_tree.HighlightItemAtPos(m_doc->m_body.SelectionContainer());  
}

bool CMainFrame::ShowSource(bool saveSelection)
{
	U::DomPath selection_begin_path;
	U::DomPath selection_end_path;

	int selection_begin_char = 0;
	int selection_end_char = 0;
	bstr_t path;
	bool one_element = false;

	int bodies_count = 0;
	// берем HTML
	// запоминаем путь до выделенного элемента
	if(saveSelection)
	{
		MSHTML::IHTMLElementPtr selectedBeginElement;
		MSHTML::IHTMLElementPtr selectedEndElement;

		if(saveSelection)
			m_doc->m_body.GetSelectionInfo((MSHTML::IHTMLElementPtr*)(&selectedBeginElement), (MSHTML::IHTMLElementPtr*)(&selectedEndElement), &selection_begin_char, &selection_end_char, 0);
		else if(m_body_selection)
			m_doc->m_body.GetSelectionInfo((MSHTML::IHTMLElementPtr*)(&selectedBeginElement), (MSHTML::IHTMLElementPtr*)(&selectedEndElement), &selection_begin_char, &selection_end_char, m_body_selection);


		// <body>
		MSHTML::IHTMLDOMNodePtr root = m_doc->m_body.Document()->body;
		root = root->firstChild; // <DIV id = fbw_desc>
		root = root->nextSibling; // <DIV id = fbw_body>
		root = root->firstChild;// <DIV clss = ...>
		do
		{
			if(U::scmp(MSHTML::IHTMLElementPtr(root)->className, L"body") == 0)
			{
				if(!U::IsParentElement(selectedEndElement, root))
				{
					++bodies_count;
				}
				else
				{
					bool res = selection_begin_path.CreatePathFromHTMLDOM(root, selectedBeginElement);
					path = selection_begin_path;
					one_element = selectedBeginElement == selectedEndElement;
					if(one_element)
					{
						selection_end_path = selection_begin_path;
					}
					else
					{
						selection_end_path.CreatePathFromHTMLDOM(root, selectedEndElement);
					}

					break;
				}
			}
		}while(root = root->nextSibling);
	}

	// если документ изменился, то заново строим XMLDOM
	{
		if(m_doc->DocRelChanged() || !(bool)m_saved_xml)
		{
			if((bool)m_saved_xml)
			{
				m_saved_xml.Release();			
			}
			m_saved_xml = m_doc->CreateDOM(_T(""));
			if(!(bool)m_saved_xml)
			{
				return false;
			}
		}
	}

/*	std::ofstream save;
	CString s = m_saved_xml->xml;
	CT2A str (s, 1251);
	save.open(L"1.xml", std::ios_base::out | std::ios_base::trunc);
	if (save.is_open())
		save << str << '\n';
	save.close();

	MSHTML::IHTMLElementPtr body = (MSHTML::IHTMLElementPtr)m_doc->m_body.Document()->body;
	s.SetString(body->innerHTML);
	CT2A str2 (s, 1251);
	save.open(L"1.htm", std::ios_base::out | std::ios_base::trunc);
	if (save.is_open())
		save << str2 << '\n';
	save.close(); */

	MSXML2::IXMLDOMNodePtr xml_selected_begin;
	MSXML2::IXMLDOMNodePtr xml_selected_end;
	//	по пути находим нужный элемент в XML
	//if(saveSelection)
	{
		MSXML2::IXMLDOMNodePtr xml_body = m_saved_xml->firstChild->firstChild;		
		while(xml_body)
		{
			if(U::scmp(xml_body->nodeName, L"body") == 0)
			{
				if(bodies_count)
				{
					--bodies_count;
					xml_body = xml_body->nextSibling;
					continue;
				}
				xml_selected_begin = selection_begin_path.GetNodeFromXMLDOM(xml_body);
				
				// строим абсолютный путь до него.
				selection_begin_path.CreatePathFromXMLDOM(m_saved_xml, xml_selected_begin);
				path = selection_begin_path;

				if(one_element)
				{
					selection_end_path = selection_begin_path;
				}
				else
				{
					xml_selected_end = selection_end_path.GetNodeFromXMLDOM(xml_body);
					selection_end_path.CreatePathFromXMLDOM(m_saved_xml, xml_selected_end);
				}
				
				break;
			}
			xml_body = xml_body->nextSibling;			
		}
	}

	// перегоняем XML в текст
	_bstr_t   src(m_saved_xml->xml);

	int savedPosBegin = 0;
	int savedPosEnd = 0;
	//if(saveSelection)
	{
		savedPosBegin = selection_begin_path.GetNodeFromText(src, selection_begin_char);
		savedPosEnd = 0;
		if(savedPosBegin)
		{
			savedPosEnd = selection_end_path.GetNodeFromText(src, selection_end_char);
			if(!savedPosEnd)
			{
				savedPosEnd = savedPosBegin;
			}		
			savedPosBegin =::WideCharToMultiByte(CP_UTF8,0,src,savedPosBegin,	NULL,0,NULL,NULL);
			savedPosEnd =::WideCharToMultiByte(CP_UTF8,0,src,savedPosEnd,	NULL,0,NULL,NULL);
		}
	}

	DWORD nch=::WideCharToMultiByte(CP_UTF8,0,src,src.length(),	NULL,0,NULL,NULL);

	//	загоняем текст в сцинтиллу
	if(m_doc->DocRelChanged())
	{
		m_source.SendMessage(SCI_CLEARALL);
		char      *buffer=(char*)malloc(nch);
		if (buffer!=NULL) 
		{
			::WideCharToMultiByte(CP_UTF8,0,src,src.length(),
									buffer,nch,NULL,NULL);
			m_source.SendMessage(SCI_APPENDTEXT,nch,(LPARAM)buffer);
			free(buffer);
		}
	}

	//	переходим на позицию
	m_source.SendMessage(SCI_SETSELECTIONSTART,savedPosBegin);
	m_source.SendMessage(SCI_SETSELECTIONEND,savedPosEnd);
	m_source.SendMessage(SCI_SCROLLCARET);	

	m_source.SendMessage(SCI_EMPTYUNDOBUFFER);
	m_doc->MarkDocCP();
	return true;	
}


void  CMainFrame::ShowView(VIEW_TYPE vt) {
  VIEW_TYPE prev = m_current_view;//GetCurView();
  SaveSelection(m_current_view);

  // added by SeNS
  if (vt != BODY)
	if (m_Speller) 
		m_Speller->EndDocumentCheck();

  if (vt == NEXT)
  {
	  if(!m_ctrl_tab)
	  {
		  if(m_current_view !=m_last_ctrl_tab_view)
			vt = m_last_ctrl_tab_view;
		  else		  
		  {
			if((m_last_view == BODY && m_current_view == DESC) ||
				(m_last_view == DESC && m_current_view == BODY))
				vt = SOURCE;
			if((m_last_view == BODY && m_current_view == SOURCE) ||
				(m_last_view == SOURCE && m_current_view == BODY))
				vt = DESC;
			if((m_last_view == SOURCE && m_current_view == DESC) ||
				(m_last_view == DESC && m_current_view == SOURCE))
				vt = BODY;
		  }
          m_last_ctrl_tab_view = m_current_view;
		  m_ctrl_tab = true;		  
	  }
	  else
	  {
		  if((m_last_view == BODY && m_current_view == DESC) ||
			  (m_last_view == DESC && m_current_view == BODY))
			  vt = SOURCE;
		  if((m_last_view == BODY && m_current_view == SOURCE) ||
			  (m_last_view == SOURCE && m_current_view == BODY))
			  vt = DESC;
		  if((m_last_view == SOURCE && m_current_view == DESC) ||
			  (m_last_view == DESC && m_current_view == SOURCE))
			  vt = BODY;
	  }   
  }

  if(prev != vt)
  {  
	  m_doc->m_body.CloseFindDialog(m_doc->m_body.m_find_dlg);
	  m_doc->m_body.CloseFindDialog(m_sci_find_dlg);
	  m_doc->m_body.CloseFindDialog(m_doc->m_body.m_replace_dlg);
	  m_doc->m_body.CloseFindDialog(m_sci_replace_dlg);
  }

	if(!m_ctrl_tab && prev != vt)
	{		
		m_last_ctrl_tab_view = m_current_view;
	}

  if (prev!=vt && prev==SOURCE) {
    /*if (!SourceToHTML())
      return;*/
	  if(vt == DESC)
	  {
		 if (!SourceToHTML())
			return;
		 m_source.SendMessage(SCI_SETSAVEPOINT);
		// SaveSelection(BODY);
	  }
  }

  if (prev!=vt && vt==SOURCE) 
  {
	  if(!this->ShowSource(prev == BODY))
	  {
		  return;
	  }	  
	  // turn off doctree
	  /*m_save_sp_mode=m_document_tree.IsWindowVisible()!=0;
	  UISetCheck(ID_VIEW_TREE,0);*/
  }

  if (prev!=vt && vt!=SOURCE) {
    UIEnable(ID_VIEW_TREE,1);	
	/*m_save_sp_mode=true;// Modification by Pilgrim - иначе только на ХР(!)при выборе DESC слитает ID_VIEW_TREE и переход на BODY не восстанавливает. Но, если после запуска сразу перейти на SOURCE, то переходы на DESC и BODY не сносят ID_VIEW_TREE. Надо разобраться, а потом удалить m_save_sp_mode=true;
    UISetCheck(ID_VIEW_TREE, m_save_sp_mode);*/
    m_splitter.SetSinglePaneMode(_Settings.ViewDocumentTree() ? SPLIT_PANE_NONE : SPLIT_PANE_RIGHT);
  }

  UISetCheck(ID_VIEW_BODY, 0);
  UISetCheck(ID_VIEW_DESC, 0);
  UISetCheck(ID_VIEW_SOURCE, 0);

  switch (vt) {
  case BODY:
	  {
	        UISetCheck(ID_VIEW_BODY, 1);
			m_view.ActivateWnd(m_doc->m_body);
			m_sel_changed=true;
			CComDispatchDriver	body(m_doc->m_body.Script());
			CComVariant		    args[1];
			args[0]=false;
			CheckError(body.Invoke1(L"apiShowDesc",&args[0]));
			if(prev == SOURCE)
			{
			  if (!SourceToHTML())
				return;
			  m_source.SendMessage(SCI_SETSAVEPOINT);
			}
			m_status.SetPaneText(ID_PANE_INS, m_last_ie_ovr ? strOVR : strINS);

			if (m_Speller) 
				m_Speller->SetDocumentLanguage();
	  }	
    break;
  case DESC:
    UISetCheck(ID_VIEW_DESC, 1);
    m_view.ActivateWnd(m_doc->m_body);
    m_href_box.SetWindowText(_T(""));
    m_href_box.EnableWindow(FALSE);
    m_id_box.SetWindowText(_T(""));
    m_id_box.EnableWindow(FALSE);

	m_image_title_box.SetWindowText(_T(""));
	m_image_title_box.EnableWindow(FALSE);
	
    // Modification by Pilgrim
	m_section_box.SetWindowText(_T(""));
	m_section_box.EnableWindow(FALSE);
	m_id_table_id_box.SetWindowText(_T(""));
	m_id_table_id_box.EnableWindow(FALSE);
	m_id_table_box.SetWindowText(_T(""));
	m_id_table_box.EnableWindow(FALSE);
	m_styleT_table_box.SetWindowText(_T(""));
	m_styleT_table_box.EnableWindow(FALSE);
	m_style_table_box.SetWindowText(_T(""));
	m_style_table_box.EnableWindow(FALSE);
	m_colspan_table_box.SetWindowText(_T(""));
	m_colspan_table_box.EnableWindow(FALSE);
	m_rowspan_table_box.SetWindowText(_T(""));
	m_rowspan_table_box.EnableWindow(FALSE);
	m_alignTR_table_box.SetWindowText(_T(""));
	m_alignTR_table_box.EnableWindow(FALSE);
	m_align_table_box.SetWindowText(_T(""));
	m_align_table_box.EnableWindow(FALSE);
	m_valign_table_box.SetWindowText(_T(""));
	m_valign_table_box.EnableWindow(FALSE);


	m_id_caption.SetEnabled(false);
	m_href_caption.SetEnabled(false);
	m_section_id_caption.SetEnabled(false);
	m_image_title_caption.SetEnabled(false);
	m_table_id_caption.SetEnabled(false);
	m_table_style_caption.SetEnabled(false);
	m_id_table_caption.SetEnabled(false);
	m_style_caption.SetEnabled(false);
	m_colspan_caption.SetEnabled(false);
	m_rowspan_caption.SetEnabled(false);
	m_tr_allign_caption.SetEnabled(false);
	m_th_allign_caption.SetEnabled(false);
	m_valign_caption.SetEnabled(false);	

	m_status.SetPaneText(ID_DEFAULT_PANE,_T(""));
	{
			CComDispatchDriver	body(m_doc->m_body.Script());
			CComVariant		    args[1];
			args[0]=true;
			CheckError(body.Invoke1(L"apiShowDesc",&args[0]));
	}	
    break;
  case SOURCE:
	// added by SeNS: display line numbers
	if (_Settings.XMLSrcShowLineNumbers()) m_source.SendMessage(SCI_SETMARGINWIDTHN,0,64);
	else m_source.SendMessage(SCI_SETMARGINWIDTHN,0,0);

    UISetCheck(ID_VIEW_SOURCE, 1);
    m_view.HideActiveWnd();
    m_splitter.SetSinglePaneMode(SPLIT_PANE_RIGHT);
    m_view.ActivateWnd(m_source);
	{
		if(prev == BODY)
		{
			CComDispatchDriver	body(m_doc->m_body.Script());
			CheckError(body.InvokeN(L"SaveBodyScroll",0,0));
		}
	}
	m_status.SetPaneText(ID_PANE_INS, m_last_sci_ovr ? strOVR : strINS);
    break;
  }
  m_last_view = m_current_view;
  m_current_view = vt;
  if(!(prev == SOURCE && vt == BODY))
	RestoreSelection();
  m_view.SetFocus();
}

/*CMainFrame::VIEW_TYPE CMainFrame::GetCurView() {
  HWND	hWnd=m_view.GetActiveWnd();
  if (hWnd==m_doc->m_body)
    return BODY;
  if (hWnd==m_doc->m_desc)
    return DESC;
  return SOURCE;
}*/

void  CMainFrame::SetSciStyles() {
  m_source.SendMessage(SCI_STYLERESETDEFAULT);

  /// Set source font
  CT2A srcFont(_Settings.GetSrcFont());
  m_source.SendMessage(SCI_STYLESETFONT,STYLE_DEFAULT,(LPARAM) srcFont.m_psz);
  m_source.SendMessage(SCI_STYLESETSIZE,STYLE_DEFAULT, _Settings.GetFontSize());

/*  DWORD fs = _Settings.GetColorFG();
  if (fs!=CLR_DEFAULT)
    m_source.SendMessage(SCI_STYLESETFORE,STYLE_DEFAULT,fs);

  fs = _Settings.GetColorBG();
  if (fs!=CLR_DEFAULT)
    m_source.SendMessage(SCI_STYLESETBACK,STYLE_DEFAULT,fs);*/

  m_source.SendMessage(SCI_STYLECLEARALL);

  // set XML specific styles
  static struct {
    char    style;
    int	    color;
  }   styles[]={
    { 0, RGB(0,0,0) },	    // default text
    { 1, RGB(128,0,0) },    // tags
    { 2, RGB(128,0,0) },    // unknown tags
    { 3, RGB(128,128,0) },  // attributes
    { 4, RGB(255,0,0) },    // unknown attributes
    { 5, RGB(0,128,96) },   // numbers
    { 6, RGB(0,128,0) },    // double quoted strings
    { 7, RGB(0,128,0) },    // single quoted strings
    { 8, RGB(128,0,128) },  // other inside tag
    { 9, RGB(0,128,128) },  // comments
    { 10, RGB(128,0,128) }, // entities
    { 11, RGB(128,0,0) },   // tag ends
    { 12, RGB(128,0,128) }, // xml decl start
    { 13, RGB(128,0,128) }, // xml decl end
    { 17, RGB(128,0,0) },   // cdata
    { 18, RGB(128,0,0) },   // question
    { 19, RGB(96,128,96) }, // unquoted value
  };
  if (_Settings.XmlSrcSyntaxHL())
    for (int i=0;i<sizeof(styles)/sizeof(styles[0]);++i)
      m_source.SendMessage(SCI_STYLESETFORE,styles[i].style,styles[i].color);
}

LRESULT CMainFrame::OnFileValidate(WORD, WORD, HWND, BOOL&) {
  int col,line;
  bool fv;
  if (IsSourceActive())
    fv=m_doc->SetXMLAndValidate(m_source,true,line,col);// Из режима Source
  else
    fv=m_doc->Validate(line,col);						// Из режима Body
  if (!fv) {
    ShowView(SOURCE);
    // have to jump through the hoops to move to required column
    SourceGoTo(line, col);
  }
  return 0;
}

void  CMainFrame::FoldAll() {
  m_source.SendMessage(SCI_COLOURISE, 0, -1);
  int maxLine = m_source.SendMessage(SCI_GETLINECOUNT);
  bool expanding = true;
  for (int lineSeek = 0; lineSeek < maxLine; lineSeek++) {
    if (m_source.SendMessage(SCI_GETFOLDLEVEL, lineSeek) & SC_FOLDLEVELHEADERFLAG) {
      expanding = !m_source.SendMessage(SCI_GETFOLDEXPANDED, lineSeek);
      break;
    }
  }
  for (int line = 0; line < maxLine; line++) {
    int level = m_source.SendMessage(SCI_GETFOLDLEVEL, line);
    if ((level & SC_FOLDLEVELHEADERFLAG) &&
      (SC_FOLDLEVELBASE == (level & SC_FOLDLEVELNUMBERMASK))) {
      if (expanding) {
	m_source.SendMessage(SCI_SETFOLDEXPANDED, line, 1);
	ExpandFold(line, true, false, 0, level);
	line--;
      } else {
	int lineMaxSubord = m_source.SendMessage(SCI_GETLASTCHILD, line, -1);
	m_source.SendMessage(SCI_SETFOLDEXPANDED, line, 0);
	if (lineMaxSubord > line)
	  m_source.SendMessage(SCI_HIDELINES, line + 1, lineMaxSubord);
      }
    }
  }
}

void CMainFrame::ExpandFold(int &line, bool doExpand, bool force, int visLevels, int level) {
  int lineMaxSubord = m_source.SendMessage(SCI_GETLASTCHILD, line, level & SC_FOLDLEVELNUMBERMASK);
  line++;
  while (line <= lineMaxSubord) {
    if (force) {
      if (visLevels > 0)
	m_source.SendMessage(SCI_SHOWLINES, line, line);
      else
	m_source.SendMessage(SCI_HIDELINES, line, line);
    } else {
      if (doExpand)
	m_source.SendMessage(SCI_SHOWLINES, line, line);
    }
    int levelLine = level;
    if (levelLine == -1)
      levelLine = m_source.SendMessage(SCI_GETFOLDLEVEL, line);
    if (levelLine & SC_FOLDLEVELHEADERFLAG) {
      if (force) {
	if (visLevels > 1)
	  m_source.SendMessage(SCI_SETFOLDEXPANDED, line, 1);
	else
	  m_source.SendMessage(SCI_SETFOLDEXPANDED, line, 0);
	ExpandFold(line, doExpand, force, visLevels - 1);
      } else {
	if (doExpand) {
	  if (!m_source.SendMessage(SCI_GETFOLDEXPANDED, line))
	    m_source.SendMessage(SCI_SETFOLDEXPANDED, line, 1);
	  ExpandFold(line, true, force, visLevels - 1);
	} else {
	  ExpandFold(line, false, force, visLevels - 1);
	}
      }
    } else {
      line++;
    }
  }
}

void  CMainFrame::DefineMarker(int marker, int markerType, COLORREF fore,COLORREF back) {
  m_source.SendMessage(SCI_MARKERDEFINE, marker, markerType);
  m_source.SendMessage(SCI_MARKERSETFORE, marker, fore);
  m_source.SendMessage(SCI_MARKERSETBACK, marker, back);
}

void  CMainFrame::SetupSci() 
{
  m_source.SendMessage(SCI_SETCODEPAGE,SC_CP_UTF8);
  m_source.SendMessage(SCI_SETEOLMODE,SC_EOL_CRLF);
  m_source.SendMessage(SCI_SETVIEWEOL, _Settings.XmlSrcShowEOL());
  m_source.SendMessage(SCI_SETWRAPMODE, _Settings.XmlSrcWrap() ? SC_WRAP_WORD : SC_WRAP_NONE);
  m_source.SendMessage(SCI_SETXCARETPOLICY,CARET_SLOP|CARET_EVEN,50);
  m_source.SendMessage(SCI_SETYCARETPOLICY,CARET_SLOP|CARET_EVEN,50);
  // added by SeNS: display line numbers
  if (_Settings.XMLSrcShowLineNumbers()) m_source.SendMessage(SCI_SETMARGINWIDTHN,0,64);
  else m_source.SendMessage(SCI_SETMARGINWIDTHN,0,0);
  m_source.SendMessage(SCI_SETMARGINWIDTHN,1,0);
  m_source.SendMessage(SCI_SETFOLDFLAGS, 16);
  m_source.SendMessage(SCI_SETPROPERTY,(WPARAM)"fold",(WPARAM)"1");
  m_source.SendMessage(SCI_SETPROPERTY,(WPARAM)"fold.html",(WPARAM)"1");
  m_source.SendMessage(SCI_SETPROPERTY,(WPARAM)"fold.compact",(WPARAM)"1");
  m_source.SendMessage(SCI_SETPROPERTY,(WPARAM)"fold.flags",(WPARAM)"16");
  m_source.SendMessage(SCI_SETSTYLEBITS,7);
  // added by SeNS: disable Scintilla's control characters
  char sciCtrlChars[] = {'Q','E','R','S','K',':'};
  for (int i=0; i<sizeof(sciCtrlChars); i++)
	m_source.SendMessage(SCI_ASSIGNCMDKEY, sciCtrlChars[i]+(SCMOD_CTRL << 16), SCI_NULL);
  char sciCtrlShiftChars[] = {'Q','W','E','R','Y','O','P','A','S','D','F','G','H','K','Z','X','C','V','B','N',':'};
  for (int i=0; i<sizeof(sciCtrlShiftChars); i++)
    m_source.SendMessage(SCI_ASSIGNCMDKEY, sciCtrlShiftChars[i]+((SCMOD_CTRL+SCMOD_SHIFT) << 16), SCI_NULL);
  ///
  if (_Settings.XmlSrcSyntaxHL()) 
  {
    m_source.SendMessage(SCI_SETLEXER, SCLEX_XML);
    m_source.SendMessage(SCI_SETMARGINTYPEN, 2, SC_MARGIN_SYMBOL);
    m_source.SendMessage(SCI_SETMARGINWIDTHN, 2, 16);
    m_source.SendMessage(SCI_SETMARGINMASKN, 2, SC_MASK_FOLDERS);
    m_source.SendMessage(SCI_SETMARGINSENSITIVEN, 2, 1);
    DefineMarker(SC_MARKNUM_FOLDEROPEN, SC_MARK_MINUS, RGB(0xff, 0xff, 0xff), RGB(0, 0, 0));
    DefineMarker(SC_MARKNUM_FOLDER, SC_MARK_PLUS, RGB(0xff, 0xff, 0xff), RGB(0, 0, 0));
    DefineMarker(SC_MARKNUM_FOLDERSUB, SC_MARK_EMPTY, RGB(0xff, 0xff, 0xff), RGB(0, 0, 0));
    DefineMarker(SC_MARKNUM_FOLDERTAIL, SC_MARK_EMPTY, RGB(0xff, 0xff, 0xff), RGB(0, 0, 0));
    DefineMarker(SC_MARKNUM_FOLDEREND, SC_MARK_EMPTY, RGB(0xff, 0xff, 0xff), RGB(0, 0, 0));
    DefineMarker(SC_MARKNUM_FOLDEROPENMID, SC_MARK_EMPTY, RGB(0xff, 0xff, 0xff), RGB(0, 0, 0));
    DefineMarker(SC_MARKNUM_FOLDERMIDTAIL, SC_MARK_EMPTY, RGB(0xff, 0xff, 0xff), RGB(0, 0, 0));

	// indicator for tag match
	m_source.SendMessage(SCI_INDICSETSTYLE, SCE_UNIVERSAL_TAGMATCH, INDIC_ROUNDBOX);
	m_source.SendMessage(SCI_INDICSETALPHA, SCE_UNIVERSAL_TAGMATCH, 100);
	m_source.SendMessage(SCI_INDICSETUNDER, SCE_UNIVERSAL_TAGMATCH, TRUE);
	m_source.SendMessage(SCI_INDICSETFORE,  SCE_UNIVERSAL_TAGMATCH, RGB(128, 128, 255));

	m_source.SendMessage(SCI_INDICSETSTYLE, SCE_UNIVERSAL_TAGATTR, INDIC_ROUNDBOX);
	m_source.SendMessage(SCI_INDICSETALPHA, SCE_UNIVERSAL_TAGATTR, 100);
	m_source.SendMessage(SCI_INDICSETUNDER, SCE_UNIVERSAL_TAGATTR, TRUE);
	m_source.SendMessage(SCI_INDICSETFORE,  SCE_UNIVERSAL_TAGATTR, RGB(128, 128, 255));

	m_source.SendMessage(SCI_COLOURISE,0,-1);
  } 
  else 
  {
    m_source.SendMessage(SCI_SETLEXER, SCLEX_NULL);
    m_source.SendMessage(SCI_SETMARGINWIDTHN, 2, 0);
  }
}

void  CMainFrame::SciModified(const SCNotification& scn) {
  if (scn.modificationType & SC_MOD_CHANGEFOLD) {
    if (scn.foldLevelNow & SC_FOLDLEVELHEADERFLAG) {
      if (!(scn.foldLevelPrev & SC_FOLDLEVELHEADERFLAG))
	m_source.SendMessage(SCI_SETFOLDEXPANDED, scn.line, 1);
    } else if (scn.foldLevelPrev & SC_FOLDLEVELHEADERFLAG) {
      if (!m_source.SendMessage(SCI_GETFOLDEXPANDED, scn.line)) {
	// Removing the fold from one that has been contracted so should expand
	// otherwise lines are left invisible with no way to make them visible
	int tmpline=scn.line;
	ExpandFold(tmpline, true, false, 0, scn.foldLevelPrev);
      }
    }
  }
}

bool CMainFrame::SciUpdateUI(bool gotoTag)
{
	if (_Settings.XmlSrcTagHL() || gotoTag)
	{
		XmlMatchedTagsHighlighter xmlTagMatchHiliter(&m_source);
		UIEnable(ID_GOTO_MATCHTAG, xmlTagMatchHiliter.tagMatch(_Settings.XmlSrcTagHL(), false, gotoTag));
		return true;
	}
	return false;
}

void CMainFrame::SciGotoWrongTag()
{
	CWaitCursor *hourglass = new CWaitCursor();
	XmlMatchedTagsHighlighter xmlTagMatchHiliter(&m_source);
	xmlTagMatchHiliter.gotoWrongTag();
	delete hourglass;
}

void  CMainFrame::SciMarginClicked(const SCNotification& scn) 
{
  int lineClick = m_source.SendMessage(SCI_LINEFROMPOSITION, scn.position);
  if ((scn.modifiers & SCMOD_SHIFT) && (scn.modifiers & SCMOD_CTRL)) {
    FoldAll();
  } else {
    int levelClick = m_source.SendMessage(SCI_GETFOLDLEVEL, lineClick);
    if (levelClick & SC_FOLDLEVELHEADERFLAG) {
      if (scn.modifiers & SCMOD_SHIFT) {
	// Ensure all children visible
	m_source.SendMessage(SCI_SETFOLDEXPANDED, lineClick, 1);
	ExpandFold(lineClick, true, true, 100, levelClick);
      } else if (scn.modifiers & SCMOD_CTRL) {
	if (m_source.SendMessage(SCI_GETFOLDEXPANDED, lineClick)) {
	  // Contract this line and all children
	  m_source.SendMessage(SCI_SETFOLDEXPANDED, lineClick, 0);
	  ExpandFold(lineClick, false, true, 0, levelClick);
	} else {
	  // Expand this line and all children
	  m_source.SendMessage(SCI_SETFOLDEXPANDED, lineClick, 1);
	  ExpandFold(lineClick, true, true, 100, levelClick);
	}
      } else {
	// Toggle this line
	m_source.SendMessage(SCI_TOGGLEFOLD, lineClick);
      }
    }
  }
}


void CMainFrame::GoToSelectedTreeItem()
{
  CTreeItem ii(m_document_tree.GetSelectedItem());
  if (!ii.IsNull() && ii.GetData())
  {
    if(m_current_view != BODY)
	{
		ShowView();
	}
    GoTo((MSHTML::IHTMLElement*) ii.GetData());
  }
}

void CMainFrame::SciCollapse(int level2Collapse, bool mode)
{
	m_source.SendMessage(SCI_COLOURISE, 0, -1);
	int maxLine = m_source.SendMessage(SCI_GETLINECOUNT);

	for (int line = 0; line < maxLine; line++) 
	{
		int level = m_source.SendMessage(SCI_GETFOLDLEVEL, line);
		if (level & SC_FOLDLEVELHEADERFLAG) 
		{
			level -= SC_FOLDLEVELBASE;
			if (level2Collapse == (level & SC_FOLDLEVELNUMBERMASK))
				if ((m_source.SendMessage(SCI_GETFOLDEXPANDED, line) != 0) != mode)
					m_source.SendMessage(SCI_TOGGLEFOLD, line);
		}
	}
}

MSHTML::IHTMLDOMNodePtr CMainFrame::MoveRightElementWithoutChildren(MSHTML::IHTMLDOMNodePtr node)
{
	MSHTML::IHTMLDOMNodePtr move_from;
	MSHTML::IHTMLDOMNodePtr move_to;
	MSHTML::IHTMLDOMNodePtr insert_before;
	MSHTML::IHTMLDOMNodePtr ret;
	// делаем себя ребенком своего предыдущего брата
	// потом всех своих детей делаем своими братьями	

	if(!(bool)(ret = MoveRightElement(node)))
		return 0;

	MSHTML::IHTMLDOMNodePtr parent = node->parentNode ;
	MSHTML::IHTMLDOMNodePtr nextSibling = GetNextSiblingSection(node);		
	
	MSHTML::IHTMLDOMNodePtr child = GetFirstChildSection(node);	
	if((bool)child)
	{
		move_to = parent;
		insert_before = 0;
		MSHTML::IHTMLDOMNodePtr nextChild;		
        do
		{
			move_from = child;
			nextChild = GetNextSiblingSection(child);
			m_doc->MoveNode(move_from, move_to, insert_before);
			child = nextChild;
		}while(nextChild);		
	}
	
	return ret;
}

MSHTML::IHTMLDOMNodePtr CMainFrame::MoveRightElement(MSHTML::IHTMLDOMNodePtr node)
{
	MSHTML::IHTMLDOMNodePtr move_from;
	MSHTML::IHTMLDOMNodePtr move_to;
	MSHTML::IHTMLDOMNodePtr insert_before;
	// делаем себя ребенком своего предыдущего брата
	
	if(!(bool)node)
		return 0;

	// пока будем таскать только секции
	if(!IsNodeSection(node))
		return 0;

	// если не можем переместить себя, то не дклаем ничего
	MSHTML::IHTMLDOMNodePtr prev_sibling = GetPrevSiblingSection(node);
	
	if(!(bool)prev_sibling)
		return 0;

	MSHTML::IHTMLDOMNodePtr child = GetLastChildSection(prev_sibling);

	// делаем себя последним ребенком своего предыдущего брата
	move_to = prev_sibling;
	insert_before = 0;		
	move_from = node;		

	if(!IsEmptySection(move_to))
	{
		CreateNestedSection(move_to);
	}
	
	return m_doc->MoveNode(move_from, move_to, insert_before);			
}

MSHTML::IHTMLDOMNodePtr CMainFrame::MoveLeftElement(MSHTML::IHTMLDOMNodePtr node)
{
	MSHTML::IHTMLDOMNodePtr ret;
	// делаем себя  ближайшим братом своего отца
	// а своих следующих братьев своими детьми
	
	if(!(bool)node)
		return 0;

	// пока будем таскать только секции
	if(!IsNodeSection(node))
		return 0;

	// если не можем переместить себя, то не делаем ничего
	MSHTML::IHTMLDOMNodePtr parent = node->parentNode;
	if(!(bool)parent || !IsNodeSection(parent->parentNode))
		return 0;
	
	MSHTML::IHTMLDOMNodePtr sibling = node->nextSibling;

	while((bool)sibling)
	{
		MSHTML::IHTMLDOMNodePtr next_sibling = sibling->nextSibling;		
		m_doc->MoveNode(sibling, node, 0);	
		sibling = next_sibling;
	}	
	// делаем себя  ближайшим братом своего отца	
	ret = m_doc->MoveNode(node, parent->parentNode, parent->nextSibling);	
	
	return ret;			
}

bool CMainFrame::IsNodeSection(MSHTML::IHTMLDOMNodePtr node)
{
	if(!(bool)node)
	{
		return false;
	}

	MSHTML::IHTMLElementPtr elem = MSHTML::IHTMLElementPtr(node);
	if(!(bool)elem)
	{
		return false;
	}

	return (U::scmp(elem->tagName,L"DIV") == 0 && (U::scmp(elem->className,L"section") == 0 || U::scmp(elem->className,L"body")==0));	
}

MSHTML::IHTMLDOMNodePtr CMainFrame::GetFirstChildSection(MSHTML::IHTMLDOMNodePtr node)
{
	if(!(bool)node)
		return 0;

	MSHTML::IHTMLDOMNodePtr child = node->firstChild;	

	if(!(bool)child)
		return 0;

	if(IsNodeSection(child))
		return child;

	return GetNextSiblingSection(child);	
}

MSHTML::IHTMLDOMNodePtr CMainFrame::GetNextSiblingSection(MSHTML::IHTMLDOMNodePtr node)
{
	if(!(bool)node)
		return 0;

	node = node->nextSibling;

	while(1)
	{
		if(!(bool)node)
			return 0;
		
		if(IsNodeSection(node))
			return node;

		node = node->nextSibling;
	}	

	return 0;
}

MSHTML::IHTMLDOMNodePtr CMainFrame::GetPrevSiblingSection(MSHTML::IHTMLDOMNodePtr node)
{
	if(!(bool)node)
		return 0;

	node = node->previousSibling;

	while(1)
	{
		if(!(bool)node)
			return 0;
		
		if(IsNodeSection(node))
			return node;

		node = node->previousSibling;
	}	

	return 0;
}

MSHTML::IHTMLDOMNodePtr CMainFrame::GetLastChildSection(MSHTML::IHTMLDOMNodePtr node)
{
	if(!(bool)node)
		return 0;

	MSHTML::IHTMLDOMNodePtr child = node->lastChild;	

	if(!(bool)child)
		return 0;

	if(IsNodeSection(child))
		return child;

	return GetPrevSiblingSection(child);	
}

LRESULT CMainFrame::OnSciCollapse(WORD cose, WORD wID, HWND, BOOL&)
{
	if(m_current_view == SOURCE)
		SciCollapse(wID - ID_SCI_COLLAPSE_BASE, false);

	if(m_document_tree.IsWindowVisible())
		m_document_tree.m_tree.m_tree.Collapse(0, wID - ID_SCI_COLLAPSE_BASE, false);

	return 0;
}

LRESULT CMainFrame::OnSciExpand(WORD cose, WORD wID, HWND, BOOL&)
{
	if(m_current_view == SOURCE)
		SciCollapse(wID - ID_SCI_EXPAND_BASE, true);

	if(m_document_tree.IsWindowVisible())
		m_document_tree.m_tree.m_tree.Collapse(0, wID - ID_SCI_EXPAND_BASE, true);

	return 0;
}

//////////////////////////////////////////////////////////////////////
/// @fn CMainFrame::IsEmptySection
///
/// Функция проверяет есть ли реальный текст внутри нее. Текстом считается
/// любая последовательность символов, содержащая хотябы один символ, отличный 
/// от пробелов, переносов строк, переводов каретки и символов табуляции
///	@param MSHTML::IHTMLDOMNodePtr section [in, out] проверяемая секция
/// @return bool true - если секция пустая
/// @date 17.12.07 @author Ильин Иван
//////////////////////////////////////////////////////////////////////
bool CMainFrame::IsEmptySection(MSHTML::IHTMLDOMNodePtr section)
{
	section = section->firstChild;
	if(!(bool)section)
		return true;
	do
	{
		long node_type = section->nodeType;

		if(node_type == 3)//text node
		{
			variant_t vt = section->nodeValue;
			BSTR node_value = vt.bstrVal;
			if(!IsEmptyText(node_value))
			{
				return false;
			}
		}
		else
		{
			_bstr_t tag_name(section->nodeName);
			MSHTML::IHTMLElementPtr elem = (MSHTML::IHTMLElementPtr)section;
			_bstr_t class_name(elem->className);			

			if((0 == U::scmp(tag_name, L"DIV")) && 
				((0 == U::scmp(class_name, L"section")) 
				|| (0 == U::scmp(class_name, L"title"))
				|| (0 == U::scmp(class_name, L"epigraph"))
				|| (0 == U::scmp(class_name, L"annotation"))
				|| (0 == U::scmp(class_name, L"image"))
				))
			{
				continue;
			}

			if(!IsEmptyText(elem->outerText))
			{
				return false;
			}			
		}
	}while((bool)(section = section->nextSibling));
	
	return true;
}

bool CMainFrame::IsEmptyText(BSTR text)
{
	wchar_t* ch = text;
	if(!ch)
		return true;

	while(*ch)
	{
		if(*ch != L' ' && *ch != L'\r' && *ch != L'\n' && *ch != L'\t')
			return false;

		++ch;
	}
	return true;
}

MSHTML::IHTMLDOMNodePtr CMainFrame::CreateNestedSection(MSHTML::IHTMLDOMNodePtr node)
{
	MSHTML::IHTMLDOMNodePtr section = node->firstChild;
	MSHTML::IHTMLDOMNodePtr new_node;
	if(!(bool)section)
		return 0;
	do
	{
		_bstr_t tag_name(section->nodeName);
		MSHTML::IHTMLElementPtr elem = (MSHTML::IHTMLElementPtr)section;
		_bstr_t class_name(elem->className);			

		if((0 == U::scmp(tag_name, L"DIV")) && 
			((0 == U::scmp(class_name, L"section")) 
			|| (0 == U::scmp(class_name, L"title"))
			|| (0 == U::scmp(class_name, L"epigraph"))
			|| (0 == U::scmp(class_name, L"annotation"))
			|| (0 == U::scmp(class_name, L"image"))
			))
		{
			continue;
		}

		MSHTML::IHTMLElementPtr new_elem = m_doc->m_body.Document()->createElement(L"DIV");
		new_elem->className = L"section";
		new_node = MSHTML::IHTMLDOMNodePtr(new_elem);
		MSHTML::IHTMLDOMNodePtr insert_before = section;			
		m_doc->MoveNode(new_node, node, insert_before);
		do
		{
			MSHTML::IHTMLDOMNodePtr next_node = section->nextSibling;
			m_doc->MoveNode(section, new_node, 0);
			section = next_node;
		}while((bool)section);			
		break;
	
	}while((bool)(section = section->nextSibling));
	
	return new_node;
}

void CMainFrame::RestoreSelection()
{
	if(m_current_view == BODY && (bool)m_body_selection)
	{
		m_body_selection->select();
	}
	if(m_current_view == DESC && (bool)m_desc_selection)
	{
		m_desc_selection->select();
	}
}


void CMainFrame::SaveSelection(VIEW_TYPE vt)
{
	if(vt == BODY)
	{		
		m_body_selection = m_doc->m_body.Document()->selection->createRange();		
	}
	if(vt == DESC)
	{		
		m_desc_selection = m_doc->m_body.Document()->selection->createRange();
	}
}

void CMainFrame::ClearSelection()
{
	m_body_selection = NULL;
	m_desc_selection = NULL;
}

void CMainFrame::SourceGoTo(int line, int col)
{
	int	pos=m_source.SendMessage(SCI_POSITIONFROMLINE,line-1);
    while (col--)
      pos=m_source.SendMessage(SCI_POSITIONAFTER,pos);
    m_source.SendMessage(SCI_SETSELECTIONSTART,pos);
    m_source.SendMessage(SCI_SETSELECTIONEND,pos);
    m_source.SendMessage(SCI_SCROLLCARET);
}

unsigned __int64 CMainFrame::FileAge(LPCTSTR FileName)
{
	WIN32_FILE_ATTRIBUTE_DATA data;
	if (::GetFileAttributesEx(FileName, GetFileExInfoStandard, &data))
	{
		return *((unsigned __int64*)&data.ftLastWriteTime);
	}	
	return ~0;
}

bool CMainFrame::CheckFileTimeStamp()
{
	if(m_file_age == FileAge(m_doc->m_filename))
		return false;
	
	wchar_t cpt[MAX_LOAD_STRING + 1];
	wchar_t msg[MAX_LOAD_STRING + 1];
	::LoadString(_Module.GetResourceInstance(), IDS_FILE_CHANGED_CPT, cpt, MAX_LOAD_STRING);
	::LoadString(_Module.GetResourceInstance(), IDS_FILE_CHANGED_MSG, msg, MAX_LOAD_STRING);
	if(IDYES == U::MessageBox(MB_YESNO, cpt, msg, m_doc->m_filename))
	{
		return ReloadFile();			
	}
	else
	{
		m_file_age = FileAge(m_doc->m_filename);
	}

	return false;
}

bool CMainFrame::ReloadFile()
{
	FB::Doc *doc=new FB::Doc(*this);
	FB::Doc::m_active_doc = doc;

	EnableWindow(FALSE);
	m_status.SetPaneText(ID_DEFAULT_PANE,_T("Loading..."));
	m_file_age = FileAge(m_doc->m_filename);
	bool fLoaded=doc->Load(m_view,m_doc->m_filename);
	EnableWindow(TRUE);
	if (!fLoaded) 
	{
		delete doc;
		FB::Doc::m_active_doc = m_doc;
		return false;
	}

	AttachDocument(doc);	
	delete m_doc;
	m_doc=doc;
	return true;
}


void CMainFrame::GoTo(int selected_pos)
{
	MSHTML::IHTMLElementCollectionPtr children(m_doc->m_body.Document()->body->children);
	long			      c_len=children->length;

	MSHTML::IHTMLElementPtr fbw_body;

	for (long i=0;i<c_len;++i) 
	{
		MSHTML::IHTMLElementPtr div(children->item(i));
		if (!(bool)div)
			continue;
		  
		if (U::scmp(div->tagName,L"DIV")==0 && U::scmp(div->id,L"fbw_body")==0) 
		{
			fbw_body = div;
			break;
		}
	} 
	MSHTML::IHTMLTxtRangePtr rng(MSHTML::IHTMLBodyElementPtr(m_doc->m_body.Document()->body)->createTextRange());
	rng->moveToElementText(fbw_body);
	rng->collapse(true);
	rng->move(L"character", selected_pos);
	rng->select();
}

bool CMainFrame::ShowSettingsDialog(HWND parent)
{	
	CSettingsDlg dlg;
	return dlg.DoModal(parent) == IDOK;
}

void CMainFrame::ApplyConfChanges()
{
	CWaitCursor *hourglass = new CWaitCursor();
	LONG visible = false;

	wchar_t restartMsg[MAX_LOAD_STRING + 1];
	::LoadString(_Module.GetResourceInstance(), IDS_SETTINGS_NEED_RESTART, restartMsg, MAX_LOAD_STRING);

	m_doc->ApplyConfChanges();
	SetupSci();
	SetSciStyles();

	// added by SeNS: display line numbers
	if (_Settings.XMLSrcShowLineNumbers())
		m_source.SendMessage(SCI_SETMARGINWIDTHN,0,64);
	else
		m_source.SendMessage(SCI_SETMARGINWIDTHN,0,0);

	XmlMatchedTagsHighlighter xmlTagMatchHiliter(&m_source);
	xmlTagMatchHiliter.tagMatch(_Settings.XmlSrcTagHL(), false, false);
	UIEnable(ID_GOTO_MATCHTAG, _Settings.XmlSrcTagHL());

	// added by SeNS
	if (_Settings.GetUseSpellChecker())
	{
		if (!m_Speller)
		{
			TCHAR prgPath[MAX_PATH];
			DWORD pathlen = ::GetModuleFileName(_Module.GetModuleInstance(), prgPath, MAX_PATH);
			PathRemoveFileSpec(prgPath);
			m_Speller = new CSpeller(CString(prgPath)+L"\\dict\\");
			m_Speller->SetEnabled(false);
		}
		if (!m_Speller->Enabled())
		{
			m_Speller->SetFrame(m_hWnd);
			m_Speller->AttachDocument(m_doc->m_body.Document());
			m_Speller->SetEnabled(true);
		}
	}
	// don't use spellchecker
	else if (m_Speller) m_Speller->SetEnabled(false);

	if (m_Speller && m_Speller->Enabled())
	{
		m_Speller->SetHighlightMisspells(_Settings.GetHighlightMisspells());
		m_Speller->SetCustomDictionary(_Settings.GetCustomDict());
	}

	// added by SeNS: issue 17: process nbsp change
	if (_Settings.GetOldNBSPChar().Compare (_Settings.GetNBSPChar()) != 0)
	{
		int numChanges = 0;
		// save caret position
		MSHTML::IDisplayServicesPtr ids (MSHTML::IDisplayServicesPtr(m_doc->m_body.Document()));
		MSHTML::IHTMLCaretPtr caret = 0;
		MSHTML::tagPOINT *point = new MSHTML::tagPOINT();
		if (ids)
		{
			ids->GetCaret(&caret);
			if (caret)
			{
				caret->IsVisible(&visible);
				if (visible) caret->GetLocation(point, true);
			}
		}

		MSHTML::IHTMLElementPtr fbwBody = MSHTML::IHTMLDocument3Ptr(m_doc->m_body.Document())->getElementById(L"fbw_body");
		MSHTML::IHTMLDOMNodePtr el = MSHTML::IHTMLDOMNodePtr(fbwBody)->firstChild;
		CString nbsp = _Settings.GetNBSPChar();
		while (el && el!=fbwBody) 
		{
			if (el->nodeType==3)
			{
				CString s = el->nodeValue;
				int n = s.Replace(_Settings.GetOldNBSPChar(), _Settings.GetNBSPChar());
				if (n) 
				{
					numChanges += n;
					el->nodeValue = s.AllocSysString();
				}
			}
			if (el->firstChild)
				el=el->firstChild;
			else 
			{
				while (el && el!=fbwBody && el->nextSibling==NULL) el=el->parentNode;
				if (el && el!=fbwBody) el=el->nextSibling;
			}
		}
		m_doc->AdvanceDocVersion(numChanges);

		// restore caret position
		if (caret && visible) 
		{
			MSHTML::IDisplayPointerPtr disptr;
			ids->CreateDisplayPointer(&disptr);
			disptr->moveToPoint(*point, MSHTML::COORD_SYSTEM_GLOBAL, fbwBody, 0, 0);
			caret->MoveCaretToPointer(disptr, true, MSHTML::CARET_DIRECTION_SAME);
		}
	}

	_Settings.SaveHotkeyGroups();
	_Settings.Save();
	_Settings.SaveWords();

	delete hourglass;

	if(_Settings.NeedRestart() && MessageBox(restartMsg, L"", MB_YESNO | MB_ICONINFORMATION) == IDYES)
	{
		return RestartProgram();
	}
}

void CMainFrame::RestartProgram()
{	
	BOOL b = false;
	if(OnClose(0, 0, 0, b))
	{
		wchar_t filename[MAX_PATH];
		::GetModuleFileName(_Module.GetModuleInstance(), filename, MAX_PATH);
		CString ofn = m_doc->GetOpenFileName();
//		if(wcschr(filename, L' '))
		ofn.Format(L"\"%s\"", m_doc->GetOpenFileName());
		HINSTANCE hInst = ShellExecute(0, L"open", filename, ofn, 0, SW_SHOW);
	}
}

void CMainFrame::CollectScripts(CString path, TCHAR* mask, int lastid, CString refid)
{
	if(U::HasFilesWithExt(path, mask))
	{
		lastid = GrabScripts(path, mask, refid);
	}

	if(U::HasSubFolders(path))
	{
		WIN32_FIND_DATA fd;
		HANDLE found = FindFirstFile(path + L"*.*", &fd);
		if(found)
		{
			do
			{
				if(fd.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY)
				{
					if(wcscmp(fd.cFileName, L".") && wcscmp(fd.cFileName, L"..") && U::HasScriptsEndpoint((path + 
						fd.cFileName) + L"\\", mask))
					{
						ScrInfo folder;

						wchar_t* Name = new wchar_t[wcslen(fd.cFileName) + 1];
						wchar_t* pos = wcschr(fd.cFileName, L'_');

						folder.order = L"0_";

						if(!pos || !U::CheckScriptsVersion(fd.cFileName))
						{
							wcscpy(Name, fd.cFileName);
							folder.order += Name;
						}
						else
						{
							wcscpy(Name, pos + 1);
							folder.order = fd.cFileName;
						}

						folder.name = Name;

						CString temp;
						temp.Format(L"_%d", lastid);
						folder.id = refid + temp;
						folder.refid = refid;
						folder.isFolder = true;
						//folder.accel.key = 0;

						folder.picture = NULL;
						folder.pictType = CMainFrame::NO_PICT;

						WIN32_FIND_DATA picFd;
						wchar_t* picName = new wchar_t[wcslen(fd.cFileName) + 1];
						wcscpy(picName, fd.cFileName);

						picName[wcslen(picName)] = 0;
						CString picPathNoExt = (path + picName);
						HANDLE hPicture = FindFirstFile(picPathNoExt + L".bmp", &picFd);
						HANDLE hIcon = FindFirstFile(picPathNoExt + L".ico", &picFd);

						if(hPicture != INVALID_HANDLE_VALUE)
						{
							HBITMAP bitmap = (HBITMAP)LoadImage(NULL, (picPathNoExt + L".bmp").GetBuffer(), 
								IMAGE_BITMAP, 0, 0, LR_LOADFROMFILE);
							if(bitmap != NULL)
							{
								folder.picture = bitmap;	
								folder.pictType = CMainFrame::BITMAP;
							}
						}

						else if(hIcon != INVALID_HANDLE_VALUE)
						{
							HICON icon = (HICON)LoadImage(NULL, (picPathNoExt + L".ico").GetBuffer(), 
								IMAGE_ICON, 0, 0, LR_LOADFROMFILE);
							if(icon != NULL)
							{
								folder.picture = icon;
								folder.pictType = CMainFrame::ICON;
							}
							
						}

						FindClose(hPicture);
						FindClose(hIcon);
						delete[] picName;

						m_scripts.Add(folder);
						delete[] Name;
						
						CollectScripts((path + fd.cFileName) + L"\\", mask, 1, folder.id);
						lastid++;
					}
				}
			} while (FindNextFile(found, &fd));

			FindClose(found);
		}		
	}
}

int CMainFrame::GrabScripts(CString path, TCHAR* mask, CString refid)
{
	WIN32_FIND_DATA fd;
	HANDLE found = FindFirstFile(path + mask, &fd);
	int newid = 1;
	
	if(found)
	 {
		do
		{
			if(!(fd.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY))
			{
				if (StartScript(this) ==0 && SUCCEEDED(ScriptLoad(path + fd.cFileName)) && ScriptFindFunc(L"Run"))
				{
					{
						ScrInfo script;
						wchar_t* Name = new wchar_t[wcslen(fd.cFileName) + 1];
						wchar_t* pos = wcschr(fd.cFileName, L'_');

						script.order = L"0_";

						if(!pos || !U::CheckScriptsVersion(fd.cFileName))
						{
							wcscpy(Name, fd.cFileName);
							script.order += Name;
						}
						else
						{
							wcscpy(Name, pos + 1);
							script.order = fd.cFileName;
						}
					
						Name[wcslen(Name) - 3] = 0;
						script.name = Name;
						script.path = path + fd.cFileName;

						script.picture = NULL;
						script.pictType = CMainFrame::NO_PICT;
						WIN32_FIND_DATA picFd;
						wchar_t* picName = new wchar_t[wcslen(fd.cFileName) + 1];
						wcscpy(picName, fd.cFileName);

						picName[wcslen(picName) - 3] = 0;
						CString picPathNoExt = (path + picName);
						HANDLE hPicture = FindFirstFile(picPathNoExt + L".bmp", &picFd);
						HANDLE hIcon = FindFirstFile(picPathNoExt + L".ico", &picFd);

						if(hPicture != INVALID_HANDLE_VALUE)
						{
							HBITMAP bitmap = (HBITMAP)LoadImage(NULL, (picPathNoExt + L".bmp").GetBuffer(), IMAGE_BITMAP, 0, 0, LR_LOADFROMFILE);
							if(bitmap != NULL)
							{
								script.picture = bitmap;
								script.pictType = CMainFrame::BITMAP;
							}
						}
						else if(hIcon != INVALID_HANDLE_VALUE)
						{
							HICON icon = (HICON)LoadImage(NULL, (picPathNoExt + L".ico").GetBuffer(), IMAGE_ICON, 0, 0, LR_LOADFROMFILE);
							if(icon != NULL)
							{
								script.picture = icon;
								script.pictType = CMainFrame::ICON;
							}
						}

						FindClose(hPicture);
						FindClose(hIcon);
						delete[] picName;

						/*CComVariant accel;
						ZeroMemory(&script.accel, sizeof(script.accel));
						script.accel.key = 0;*/

						/*if (SUCCEEDED(ScriptCall(L"SetHotkey", NULL, 0, &accel)))
						{
							TCHAR errCaption[MAX_LOAD_STRING + 1];
							LoadString(_Module.GetResourceInstance(), IDS_ERRMSGBOX_CAPTION, errCaption, MAX_LOAD_STRING);

							int j;
							for(j = 0; j < m_scripts.GetSize(); ++j)
							{
								if(m_scripts[j].accel.key == accel.intVal && m_scripts[j].accel.key != 0 && !m_scripts[j].isFolder)
								{
									if(_Settings.GetScriptsHkErrNotify())
									{
										CString errDescr;
										errDescr.Format(IDS_SCRIPT_HOTKEY_CONFLICT, m_scripts[j].path, script.path);									
										MessageBox(errDescr.GetBuffer(), errCaption, MB_OK|MB_ICONSTOP);
									}
									break;
								}
							}
							if(j == m_scripts.GetSize() && keycodes.FindKey(accel.intVal) != -1)
								script.accel.key = accel.intVal;
						}*/
						
						CString temp;
						temp.Format(L"_%d", newid);
						script.id = refid + temp;
						script.refid = refid;
						script.isFolder = false;
						script.Type = 2;			
						m_scripts.Add(script);
						newid++;

						delete[] Name;
					}
					StopScript();
				}				
			 }		 
		 }
		 while(FindNextFile(found, &fd));

		 FindClose(found);
	 }	

	 return newid;
}

void CMainFrame::AddScriptsSubMenu(HMENU parentItem, CString refid, CSimpleArray<ScrInfo>& scripts)
{
	MENUITEMINFO mi;
	static int SCRIPT_COMMAND_ID = 1;
	int menupos = 0;

	for(int i = 0; i < scripts.GetSize(); ++i)
	{
		memset(&mi, NULL, sizeof(MENUITEMINFO));
		mi.cbSize = sizeof(MENUITEMINFO);
		mi.fMask = MIIM_TYPE | MIIM_STATE;
		mi.fType = MFT_STRING;

		for(int j = 0; j < scripts.GetSize(); j++)
		{
			if(scripts[j].refid == refid)
				menupos++;
		}

		if (scripts[i].refid == refid)
		{
			if(scripts[i].isFolder)
			{
				mi.fMask |= MIIM_SUBMENU | MIIM_ID;
				mi.hSubMenu = CreateMenu();
				mi.wID = SCRIPT_COMMAND_ID++;
				scripts[i].wID = -1;
				AddScriptsSubMenu(mi.hSubMenu, scripts[i].id, scripts);
			}
			else
			{
				mi.fMask |= MIIM_ID;
				mi.wID = ID_SCRIPT_BASE + SCRIPT_COMMAND_ID;
				scripts[i].wID = SCRIPT_COMMAND_ID;
				SCRIPT_COMMAND_ID++;

				InitScriptHotkey(scripts[i]);
			}

			mi.dwTypeData = scripts[i].name.GetBuffer();
			mi.cch = wcslen(scripts[i].name);

			if(scripts[i].isFolder)
				InsertMenuItem(parentItem, 0, true, &mi);
			else
			{
				InsertMenuItem(parentItem, menupos--, true, &mi);
				// added by SeNS: add scripts with icon to toolbar
				if (scripts[i].pictType == CMainFrame::ICON)
					AddTbButton(m_ScriptsToolbar, scripts[i].name, mi.wID, TBSTATE_ENABLED, (HICON)scripts[i].picture);
			}

			switch(scripts[i].pictType)
			{
				case CMainFrame::BITMAP:
					m_MenuBar.AddBitmap((HBITMAP)scripts[i].picture, mi.wID);
					break;
				case CMainFrame::ICON:
					m_MenuBar.AddIcon((HICON)scripts[i].picture, mi.wID);
					break;
			}
		}
	}
    // Restore scripts toolbar layout and position
    m_ScriptsToolbar.RestoreState(HKEY_CURRENT_USER, L"SOFTWARE\\FBETeam\\FictionBook Editor\\Toolbars", L"ScriptsToolbar");
}

void CMainFrame::QuickScriptsSort(CSimpleArray<ScrInfo>& scripts, int min, int max)
{
	int i, j;
	ScrInfo mid, tmp;
	{
		if (min < max)
		{
			mid = scripts[min];
			i = min - 1;
			j = max + 1;
			while(i < j)
			{
				do
				{
					i++;

				} while(!(scripts[i].order.CompareNoCase(mid.order.GetBuffer()) >= 0));
				do
				{
					j--;
				} while(!(scripts[j].order.CompareNoCase(mid.order.GetBuffer()) <= 0));
				if(i < j)
				{
					tmp = scripts[i];
					scripts[i] = scripts[j];
					scripts[j] = tmp;
				}
			}

			QuickScriptsSort(scripts, min, j);
			QuickScriptsSort(scripts, j + 1, max);
		}
	}
}

void CMainFrame::UpScriptsFolders(CSimpleArray<ScrInfo>& scripts)
{
	for(int i = 0; i < scripts.GetSize(); ++i)
	{
		if(!scripts[i].isFolder)
		{
			for(int j = i; j < scripts.GetSize(); ++j)
			{
				if(scripts[j].isFolder)
				{
					for(int k = j; k > i; --k)
					{
						ScrInfo tmp = scripts[k-1];
						scripts[k-1] = scripts[k];
						scripts[k] = tmp;
					}
				}
			}
		}
	}
}

void CMainFrame::InitScriptHotkey(CMainFrame::ScrInfo& script)
{
	std::vector<CHotkeysGroup>& hotkey_groups = _Settings.m_hotkey_groups;
	for(unsigned int i = 0; i < hotkey_groups.size(); ++i)
	{
		if(hotkey_groups.at(i).m_reg_name == L"Scripts")
		{
			CHotkey ScriptsHotkey(script.path,
				script.name,
				NULL,
				ID_SCRIPT_BASE + script.wID,
				NULL,
				script.path);
			hotkey_groups.at(i).m_hotkeys.push_back(ScriptsHotkey);
		}
	}
}

void CMainFrame::InitPluginHotkey(CString guid, UINT cmd, CString name)
{
	std::vector<CHotkeysGroup>& hotkey_groups = _Settings.m_hotkey_groups;
	for(unsigned int i = 0; i < hotkey_groups.size(); ++i)
	{
		if(hotkey_groups.at(i).m_reg_name == L"Plugins")
		{
			CHotkey PluginsHotkey(guid,
				name,
				NULL,
				cmd,
				NULL);
			hotkey_groups.at(i).m_hotkeys.push_back(PluginsHotkey);
		}
	}
}

// 
// Idea by Sclex
// 
void CMainFrame::ChangeNBSP(MSHTML::IHTMLElementPtr elem)
{
	MSHTML::IHTMLElementPtr fbwBody = MSHTML::IHTMLDocument3Ptr(m_doc->m_body.Document())->getElementById(L"fbw_body");
	if (fbwBody	&& elem && fbwBody->contains(elem))
	{
		// save caret position
		MSHTML::IHTMLTxtRangePtr tr1;
		int offset = 0;
		MSHTML::IHTMLTxtRangePtr sel(m_doc->m_body.Document()->selection->createRange());
		if (sel)
		{
			tr1 = sel->duplicate();
			if (tr1)
			{
				tr1->moveToElementText(elem);
				tr1->setEndPoint(L"EndToStart",sel);
				CString s = tr1->text;
				offset = s.GetLength();
				// special fix for strange MSHTML bug (inline image present in html code)
				CString s2 = tr1->htmlText;
				int l = s2.Replace( L"<IMG", L"<IMG");
				offset += (l * 3);
			}
		}

		MSHTML::IHTMLDOMNodePtr el = MSHTML::IHTMLDOMNodePtr(elem)->firstChild;
		CString nbsp = _Settings.GetNBSPChar();
		CString s;
		int numChanges = 0;

		while (el && el!=elem) 
		{
			if (el->nodeType==3)
			{
				try { s = el->nodeValue; } catch(...) { break; }
				int n = s.Replace( L"\u00A0", _Settings.GetNBSPChar());
				int k = s.Replace( L"<p>\u00A0<p>", L"<p><p>");
				if (n || k) 
				{
					numChanges += n + k;
					el->nodeValue = s.AllocSysString();
				}
			}
			if (el->firstChild)
				el=el->firstChild;
			else 
			{
				while (el && el!=elem && el->nextSibling==NULL) el=el->parentNode;
				if (el && el!=elem) el=el->nextSibling;
			}
		}

		if (numChanges)
		{
			m_doc->AdvanceDocVersion(numChanges);

			// restore caret position
			if (tr1)
			{
				tr1->moveToElementText(elem);
				tr1->collapse(true);
				if (offset==0) 
				{ 
					tr1->move(L"character",1);
					tr1->move(L"character",-1); 
				}
				else tr1->move(L"character",offset);
				tr1->select();
			}
		}
	}
}

void CMainFrame::RemoveLastUndo()
{
	// remove last undo operation
	IServiceProviderPtr serviceProvider = IServiceProviderPtr(m_doc->m_body.Document());
	CComPtr<IOleUndoManager> undoManager;
	CComPtr<IOleUndoUnit> undoUnit[10];
	CComPtr<IEnumOleUndoUnits> undoUnits;
	if (SUCCEEDED(serviceProvider->QueryService(SID_SOleUndoManager, IID_IOleUndoManager, (void **) &undoManager)))
	{
		undoManager->EnumUndoable(&undoUnits);
		if (undoUnits)
		{
			ULONG numUndos = 0;
			undoUnits->Next(10, &undoUnit[0], &numUndos);
			// delete whole stack
			undoManager->DiscardFrom(NULL);
			// restore all except previous
			if (numUndos)
				for (ULONG i=0; i<numUndos-1; i++)
					undoManager->Add(undoUnit[i]);
		}
	}
}
