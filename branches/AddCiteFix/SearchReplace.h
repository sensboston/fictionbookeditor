#ifndef SEARCHREPLACE_H
#define SEARCHREPLACE_H

#include "ModelessDialog.h"
#include "Settings.h"

extern CSettings _Settings;

class FRBase: public CWinDataExchange<FRBase> {
public:
  CRegKey	  m_fh,m_rh;

  CFBEView	  *m_view;
  int		  m_whole;
  int		  m_case;
  int		  m_regexp;
  int		  m_dir;

  FRBase(CFBEView *view) : m_view(view) { }

  HWND	GetDlgItem(int id) { return X_GetDlgItem(id); }
  virtual HWND X_GetDlgItem(int id) = 0;
  BOOL	SetDlgItemText(int id,const TCHAR *str) { return ::SetWindowText(GetDlgItem(id),str); }

  BEGIN_MSG_MAP(FRBase)
  ALT_MSG_MAP(1)
    MESSAGE_HANDLER(WM_INITDIALOG, OnInitDialog)

    COMMAND_HANDLER(IDC_TEXT,CBN_EDITCHANGE, OnTextChanged)
  END_MSG_MAP()

  BEGIN_DDX_MAP(FRBase)
    DDX_TEXT(IDC_TEXT, m_view->m_fo.pattern)
    if (GetDlgItem(IDC_REPLACE))
      DDX_TEXT(IDC_REPLACE, m_view->m_fo.replacement);
    DDX_CHECK(IDC_WHOLE, m_whole)
    DDX_CHECK(IDC_MATCHCASE, m_case)
    DDX_CHECK(IDC_REGEXP, m_regexp)
    if (GetDlgItem(IDC_UP))
      DDX_RADIO(IDC_UP, m_dir);
  END_DDX_MAP()

  void	GetData() {
    DoDataExchange(TRUE);
    int flags=0;
    if (m_case)
      flags|=CFBEView::FRF_CASE;
    if (m_whole)
      flags|=CFBEView::FRF_WHOLE;
    if (m_dir==0)
      flags|=CFBEView::FRF_REVERSE;
    m_view->m_fo.flags=flags;
    m_view->m_fo.fRegexp=m_regexp!=0;
  }
  void	PutData() {
    m_case=(m_view->m_fo.flags&CFBEView::FRF_CASE)!=0;
    m_whole=(m_view->m_fo.flags&CFBEView::FRF_WHOLE)!=0;
    m_dir=(m_view->m_fo.flags&CFBEView::FRF_REVERSE)==0;
    m_regexp=m_view->m_fo.fRegexp;
    DoDataExchange(FALSE);
  }

  void	LoadHistoryImp(const TCHAR *path,CRegKey& rk,HWND hCB,CString& first) {
    if (!hCB)
      return;

    // open history key
    if (rk.Create(_Settings.GetKey(), path)!=ERROR_SUCCESS)
      return;
    
    // get number of entries
    DWORD nfs;
    if (rk.QueryDWORDValue(_T(""),nfs)!=ERROR_SUCCESS)
      return;
    
    // fetch the entries
    //first.Empty();

    CString   ps,str;

    for (DWORD i=0;i<nfs;++i) {
      ps.Format(_T("%d"),i);
      str=U::QuerySV(rk,ps);
      if (!str.IsEmpty()) {
	::SendMessage(hCB,CB_ADDSTRING,0,(LPARAM)(const TCHAR *)str);
	if (first.IsEmpty())
	  first=str;
      }
    }
  }
  LRESULT OnInitDialog(UINT, WPARAM, LPARAM, BOOL& bHandled) {
    bHandled=FALSE;

    LoadHistoryImp(_T("SearchHistory"),m_fh,GetDlgItem(IDC_TEXT),m_view->m_fo.pattern);
    LoadHistoryImp(_T("ReplaceHistory"),m_rh,GetDlgItem(IDC_REPLACE),m_view->m_fo.replacement);

    // load options
	DWORD flags = _Settings.GetSearchOptions();
    m_view->m_fo.fRegexp=(flags&CFBEView::FRF_REGEX)!=0;
    m_view->m_fo.flags=flags&~CFBEView::FRF_REGEX;

    // set fields
    PutData();

    return 0;
  }

  LRESULT OnTextChanged(WORD, WORD wID, HWND, BOOL&) {
    CheckInput();
    return 0;
  }

  void	CheckInput() {
    ::EnableWindow(GetDlgItem(IDOK),::GetWindowTextLength(GetDlgItem(IDC_TEXT))>0);
  }

  void	SaveStringImp(HWND hCB) {
    if (!hCB)
      return;

    CString cur=U::GetWindowText(hCB);
    if (cur.IsEmpty())
      return;
    LRESULT Idx=::SendMessage(hCB,CB_FINDSTRINGEXACT,-1,(LPARAM)(const TCHAR *)cur);
    if (Idx==0)
      return;
    if (Idx!=CB_ERR)
      ::SendMessage(hCB,CB_DELETESTRING,Idx,0);
    ::SendMessage(hCB,CB_INSERTSTRING,0,(LPARAM)(const TCHAR *)cur);
  }
  void	SaveString() {
    SaveStringImp(GetDlgItem(IDC_TEXT));
    SaveStringImp(GetDlgItem(IDC_REPLACE));
  }

  void	SaveHistoryImp(CRegKey& rk,HWND hCB) {
    if (!rk && !hCB)
      return;

    LRESULT lCount=::SendMessage(hCB,CB_GETCOUNT,0,0);
    if (lCount>100)
      lCount=100;

    CString   path;
    for (int i=0;i<lCount;++i) {
      CString	cur(U::GetCBString(hCB,i));
      if (cur.IsEmpty())
	continue;
      path.Format(_T("%d"),i);
      rk.SetStringValue(path,cur);
    }

    rk.SetDWORDValue(_T(""),lCount);
  }
  void	SaveHistory() 
  {
	_Settings.SetSearchOptions(m_view->m_fo.flags|(m_view->m_fo.fRegexp ? CFBEView::FRF_REGEX : 0), true);
    SaveHistoryImp(m_fh,GetDlgItem(IDC_TEXT));
    SaveHistoryImp(m_rh,GetDlgItem(IDC_REPLACE));
  }
};

class CFindDlgBase: public CModelessDialogImpl<CFindDlgBase>,
		    public FRBase
{
public:
  enum { IDD = IDD_FIND };

  CFindDlgBase(CFBEView *view) : FRBase(view){ }

  BEGIN_MSG_MAP(CFindDlgBase)
    COMMAND_ID_HANDLER(IDOK, OnDoFind)
    COMMAND_ID_HANDLER(IDCANCEL, OnCancel)

    CHAIN_MSG_MAP_ALT(FRBase, 1)
  END_MSG_MAP()


  LRESULT OnCancel(WORD, WORD wID, HWND, BOOL&) {
    m_view->CloseFindDialog(this);
	return 0;
  }
  LRESULT OnDoFind(WORD, WORD, HWND, BOOL&) {
    DoFind();
    return 0;
  }

  virtual void	DoFind() = 0;
  virtual HWND	X_GetDlgItem(int id) { return CModelessDialogImpl<CFindDlgBase>::GetDlgItem(id); }
};

class CReplaceDlgBase: public CModelessDialogImpl<CReplaceDlgBase>,
		       public FRBase
{
public:
  enum { IDD = IDD_REPLACE };
  bool m_selvalid; // true if last search was successful but no replacement was done

  CReplaceDlgBase(CFBEView *view) : FRBase(view), m_selvalid(false) { }

  BEGIN_MSG_MAP(CReplaceDlgBase)
    COMMAND_ID_HANDLER(IDOK, OnDoFind)
    COMMAND_ID_HANDLER(IDC_REPLACE_ONE, OnDoReplace)
    COMMAND_ID_HANDLER(IDC_REPLACE_ALL, OnDoReplaceAll)
    COMMAND_ID_HANDLER(IDCANCEL, OnCancel)

    COMMAND_HANDLER(IDC_TEXT,CBN_EDITCHANGE, OnTextChanged)
    COMMAND_HANDLER(IDC_REPLACE,CBN_EDITCHANGE, OnReplChanged)

    CHAIN_MSG_MAP_ALT(FRBase, 1)
  END_MSG_MAP()


  LRESULT OnCancel(WORD, WORD wID, HWND, BOOL&) {
	  m_view->CloseFindDialog(this);
    return 0;
  }
  virtual void DoFind() = 0;
  LRESULT OnDoFind(WORD, WORD, HWND, BOOL&) {
    GetData();
    DoFind();
    return 0;
  }
  virtual void DoReplace() = 0;
  LRESULT OnDoReplace(WORD, WORD, HWND, BOOL&) {
    GetData();
    DoReplace();
    return 0;
  }
  virtual void DoReplaceAll() = 0;
  LRESULT OnDoReplaceAll(WORD, WORD, HWND, BOOL&) {
    GetData();
    DoReplaceAll();
    return 0;
  }

  LRESULT OnTextChanged(WORD, WORD wID, HWND, BOOL& bHandled) {
    SendMessage(DM_SETDEFID,IDOK);
    bHandled=FALSE;
    return 0;
  }
  LRESULT OnReplChanged(WORD, WORD wID, HWND, BOOL& bHandled) {
    SendMessage(DM_SETDEFID,IDC_REPLACE_ONE);
    bHandled=FALSE;
    return 0;
  }
  void MakeClose() {
    // change cancel button to "Close"
	  ::SetWindowText(CModelessDialogImpl<CReplaceDlgBase>::GetDlgItem(IDCANCEL),_T("Close"));
    SendMessage(DM_SETDEFID,IDC_REPLACE_ONE);
  }
  virtual HWND	X_GetDlgItem(int id) { return CModelessDialogImpl<CReplaceDlgBase>::GetDlgItem(id); }
};

class CViewFindDlg : public CFindDlgBase {
public:
  CViewFindDlg(CFBEView *view) : CFindDlgBase(view) { }

  virtual void	DoFind() {
    GetData();
    if (!m_view->DoSearch())
	{
	  wchar_t cpt[MAX_LOAD_STRING + 1];
	  wchar_t msg[MAX_LOAD_STRING + 1];
	  ::LoadString(_Module.GetResourceInstance(), IDR_MAINFRAME, cpt, MAX_LOAD_STRING);
	  ::LoadString(_Module.GetResourceInstance(), IDS_SEARCH_FAIL_MSG, msg, MAX_LOAD_STRING);
	  U::MessageBox(MB_OK|MB_ICONEXCLAMATION, cpt, msg, m_view->m_fo.pattern);
	}
    else {
      SaveString();
      SaveHistory();
    }
  }
};


#endif
