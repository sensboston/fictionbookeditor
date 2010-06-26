#include "stdafx.h"
#include "resource.h"
#include "res1.h"

#include "utils.h"
#include "apputils.h"
#include "ModelessDialog.h"

extern RECT dialogRect;

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
	U::MessageBox(MB_OK|MB_ICONERROR, IDS_ERRMSGBOX_CAPTION, IDS_INVALID_CML_MSG, opt);
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
    U::MessageBox(MB_OK|MB_ICONERROR, IDS_ERRMSGBOX_CAPTION, IDS_CML_ARGS_MSG, opt);
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
        COMMAND_ID_HANDLER(IDYES, OnYes)
		COMMAND_ID_HANDLER(IDNO, OnCancel)
        COMMAND_ID_HANDLER(IDCANCEL, OnCancel)
        MESSAGE_HANDLER(WM_INITDIALOG, OnInitDialog)
  END_MSG_MAP()

  LRESULT OnInitDialog(UINT, WPARAM, LPARAM, BOOL&) {
    DoDataExchange(FALSE);  // Populate the controls
    SetDlgItemText(IDC_PROMPT,m_prompt);
    SetWindowText(m_title);
	if (dialogRect.left != -1)
		::SetWindowPos(m_hWnd, HWND_TOPMOST, dialogRect.left, dialogRect.top, 0, 0, SWP_NOSIZE | SWP_SHOWWINDOW);
    return 0;
  }

  BOOL EndDialog(int nRetCode)
  {
    ::GetWindowRect(m_hWnd, &dialogRect);
	return ::EndDialog(m_hWnd, nRetCode);
  }

  LRESULT OnYes(WORD, WORD wID, HWND, BOOL&) {
    DoDataExchange(TRUE);  // Populate the data members
    EndDialog(wID);
    return 0L;
  }

  LRESULT OnCancel(WORD, WORD wID, HWND, BOOL&) {
    EndDialog(wID);
    return 0L;
  }
};

int	InputBox(CString& result, const wchar_t *title, const wchar_t *prompt) {
  CInputBox   dlg(title,prompt);
  dlg.m_text=result;
  int dlgResult = dlg.DoModal();
  if (dlgResult == IDYES) result=dlg.m_text;
  return dlgResult;
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

#ifdef USE_PCRE
// Regexp constructor
IMatchCollection* IRegExp2::Execute (CString sourceString)
{
#define OVECCOUNT 300

	pcre *re;
	const char *error;
	bool is_error = true;
	int options;
	int erroffset;
	int ovector[OVECCOUNT];
	int subject_length;
	int rc, offset, char_offset;
	IMatchCollection* matches;
	char dst[1024];

	matches = new IMatchCollection();

	options = IgnoreCase?PCRE_CASELESS:0;
	options |= PCRE_UTF8;

	// convert pattern to UTF-8
	CT2A pat(m_pattern, CP_UTF8);

	re = pcre_compile(
	pat,				  /* the pattern */
	options,              /* default options */
	&error,               /* for error message */
	&erroffset,           /* for error offset */
	NULL);                /* use default character tables */

	if (re)
	{
		is_error = false;
		CT2A subj(sourceString, CP_UTF8);
		subject_length = strlen(subj);

		offset = char_offset = 0;

		do
		{
			rc = pcre_exec(
			  re,                   /* the compiled pattern */
			  NULL,                 /* no extra data - we didn't study the pattern */
			  subj,					/* the subject string */
			  subject_length,       /* the length of the subject */
			  offset,                /* start at offset 0 in the subject */
			  0,					/* default options */
			  ovector,              /* output vector for substring information */
			  OVECCOUNT);           /* number of elements in the output vector */

			if (rc > 0)
			{
				// add match
				char *substring_start = subj + ovector[0];
				int substring_length = ovector[1] - ovector[0];
				if (substring_length < sizeof(dst))
				{
					// convert substring to Unicode
					strncpy(dst, substring_start, substring_length);
					dst[substring_length] = '\0';
					// calculate character position
					while (offset < ovector[0])
					{
						switch (subj[offset] & 0xF0)
						{
							case 0xE0: offset += 3; break;
							case 0xF0: offset += 4; break;
							case 0xD0:
							case 0xC0: offset += 2; break;
							default: offset++;
						}
						char_offset++;
					}

					CString str = CString(CA2T(dst, CP_UTF8));
					IMatch2* item = new IMatch2(str, char_offset);

					// add submatches (including match)
					for (int i=1; i<rc; i++)
					{
						substring_start = subj + ovector[i*2];
						substring_length = ovector[i*2+1] - ovector[i*2];
						if (substring_length < sizeof(dst))
						{
							// convert substring to Unicode
							strncpy(dst, substring_start, substring_length);
							dst[substring_length] = '\0';
							item->AddSubMatch(CString(CA2T(dst, CP_UTF8)));
						}
					}
					matches->AddItem(item); 
					char_offset += str.GetLength();
					offset = ovector[1];
					// empty line
					if (ovector[0] == ovector[1])
					{
						offset++;
						char_offset++;
					}
				}
			}
		} while (rc > 0);

		pcre_free(re);     /* Release memory used for the compiled pattern */
	}

	if (is_error)
	{
		// Raise COM-compatible exception
		ICreateErrorInfoPtr cerrinf = 0;
		if (::CreateErrorInfo(&cerrinf) == S_OK)
		{
			cerrinf->SetDescription(CString(error).AllocSysString());
			cerrinf->SetSource(L"Perl Compatible Regular Expressions");
			cerrinf->SetGUID(GUID_NULL);
			IErrorInfoPtr ei = cerrinf;
			throw _com_error(MK_E_SYNTAX, ei, true);
		}
	}

	return matches;
}
#endif

}