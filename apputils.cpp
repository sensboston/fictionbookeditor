#include "stdafx.h"
#include "resource.h"
#include "res1.h"

#include "utils.h"
#include "apputils.h"

namespace AU {

// a getopt implementation
static int   xgetopt(
	CSimpleArray<CString>& argv,
	const TCHAR *ospec,
	int&	    argp,
	const TCHAR *&state,
	const TCHAR *&arg)
{
  const TCHAR	  *cp;
  TCHAR		  opt;

  if (!state || !state[0]) { // look a the next arg
    if (argp>=argv.GetSize() || argv[argp][0]!='-') // no more options
      return 0;
    if (!argv[argp][1]) // a lone '-', treat as an end of list
      return 0;
    if (argv[argp][1]=='-') { // '--', ignore rest of text and stop
      ++argp;
      return 0;
    }
    state=(const TCHAR *)argv[argp]+1;
    ++argp;
  }
  // we are in a middle of an arg
  opt=(unsigned)*state++;
  bool found = false;
  for (cp=ospec;*cp;++cp) {
    if (*cp==opt)
	{
		found = true;
		break;
	}      
    if (cp[1]==':')
      ++cp;
  }
  if(!found)
  {
	wchar_t msg[MAX_LOAD_STRING + 1];
	wchar_t cpt[MAX_LOAD_STRING + 1];
	::LoadString(_Module.GetResourceInstance(), IDS_ERRMSGBOX_CAPTION, cpt, MAX_LOAD_STRING);
	::LoadString(_Module.GetResourceInstance(), IDS_INVALID_CML_MSG, msg, MAX_LOAD_STRING);
	U::MessageBox(MB_OK|MB_ICONERROR, cpt, msg,opt);
	return -1; // error
  }

  if (cp[1]==':') { // option requires an argument
    if (*state) { // use rest of string
      arg=state;
      state=NULL;
      return opt;
    }
    // use next arg if available
    if (argp<argv.GetSize()) {
      arg=argv[argp];
      ++argp;
      return opt;
    }
    // barf about missing args
	wchar_t msg[MAX_LOAD_STRING + 1];
    wchar_t cpt[MAX_LOAD_STRING + 1];
    ::LoadString(_Module.GetResourceInstance(), IDS_ERRMSGBOX_CAPTION, cpt, MAX_LOAD_STRING);
    ::LoadString(_Module.GetResourceInstance(), IDS_CML_ARGS_MSG, msg, MAX_LOAD_STRING);
    U::MessageBox(MB_OK|MB_ICONERROR, cpt, msg,opt);
    return -1;
  }
  // just return current option
  return opt;
}

CmdLineArgs   _ARGS;

bool  ParseCmdLineArgs() {
  const TCHAR	*arg,*state=NULL;
  int		argp=0;
  int		ch;
  for (;;) {
    switch ((ch=xgetopt(_ARGV,_T("d"),argp,state,arg))) {
    case 0: // end of options
      while (argp--)
	_ARGV.RemoveAt(0);
      return true;
    case _T('d'):
      _ARGS.start_in_desc_mode=true;
      break;
    case -1: // error
      return false;
      // just ignore options for now :)
    }
  }
}


// an input box
class CInputBox: public CDialogImpl<CInputBox>,
		 public CWinDataExchange<CInputBox>
{
public:
  enum { IDD=IDD_INPUTBOX };
  CString	m_text;
  const wchar_t	*m_title;
  const wchar_t	*m_prompt;

  CInputBox(const wchar_t *title,const wchar_t *prompt) : m_title(title), m_prompt(prompt) { }

  BEGIN_DDX_MAP(CInputBox)
    DDX_TEXT(IDC_INPUT,m_text)
  END_DDX_MAP()

  BEGIN_MSG_MAP(CInputBox)
        COMMAND_ID_HANDLER(IDOK, OnOK)
        COMMAND_ID_HANDLER(IDCANCEL, OnCancel)
        MESSAGE_HANDLER(WM_INITDIALOG, OnInitDialog)
  END_MSG_MAP()

  LRESULT OnInitDialog(UINT, WPARAM, LPARAM, BOOL&) {
    DoDataExchange(FALSE);  // Populate the controls
    SetDlgItemText(IDC_PROMPT,m_prompt);
    SetWindowText(m_title);
    return 0;
  }

  LRESULT OnOK(WORD, WORD wID, HWND, BOOL&) {
    DoDataExchange(TRUE);  // Populate the data members
    EndDialog(wID);
    return 0L;
  }

  LRESULT OnCancel(WORD, WORD wID, HWND, BOOL&) {
    EndDialog(wID);
    return 0L;
  }
};

bool	InputBox(CString& result,const wchar_t *title,const wchar_t *prompt) {
  CInputBox   dlg(title,prompt);
  dlg.m_text=result;
  if (dlg.DoModal()!=IDOK)
    return false;
  result=dlg.m_text;
  return true;
}

// html
CString GetAttrCS(MSHTML::IHTMLElement *elem,const wchar_t *attr) {
  if (!elem) return L"";
  _variant_t	    va(elem->getAttribute(attr,2));
  if (V_VT(&va)!=VT_BSTR)
    return CString();
  return V_BSTR(&va);
}

_bstr_t GetAttrB(MSHTML::IHTMLElement *elem,const wchar_t *attr) {
  if (!elem) return L"";
  _variant_t	    va(elem->getAttribute(attr,2));
  if (V_VT(&va)!=VT_BSTR)
    return _bstr_t();
  return _bstr_t(va.Detach().bstrVal,false);
}

char	*ToUtf8(const CString& s,int& patlen) {
  DWORD   len=::WideCharToMultiByte(CP_UTF8,0,
		  s,s.GetLength(),
		  NULL,0,NULL,NULL);
  char    *tmp=(char *)malloc(len+1);
  if (tmp) {
    ::WideCharToMultiByte(CP_UTF8,0,
		  s,s.GetLength(),
		  tmp,len,NULL,NULL);
    tmp[len]='\0';
  }
  patlen=len;
  return tmp;
}

}