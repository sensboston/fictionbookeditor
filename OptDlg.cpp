#include "stdafx.h"
#include "resource.h"
#include "res1.h"

#include "utils.h"
#include "apputils.h"

//#include <atlgdix.h>

#if _WIN32_WINNT>=0x0501
#include <atltheme.h>
#endif


#include "OptDlg.h"
#include "Settings.h"

extern CSettings _Settings;


static int __stdcall EnumFontProc(const ENUMLOGFONTEX *lfe,
				 const NEWTEXTMETRICEX *ntm,
				 DWORD type,
				 LPARAM data)
{
  CComboBox	  *cb=(CComboBox*)data;
  cb->AddString(lfe->elfLogFont.lfFaceName);
  return TRUE;
}

static int  font_sizes[]={8,9,10,11,12,13,14,15,16,18,20,22,24,26,28,36,48,72};

LRESULT COptDlg::OnInitDialog(UINT, WPARAM, LPARAM, BOOL&)
{
  m_fg.SubclassWindow(GetDlgItem(IDC_FG));
  m_bg.SubclassWindow(GetDlgItem(IDC_BG));  
  m_fonts=GetDlgItem(IDC_FONT);
  m_fontsize=GetDlgItem(IDC_FONT_SIZE);
  m_fast_mode = GetDlgItem(IDC_FAST_MODE); 
  m_lang = GetDlgItem(IDC_LANG);
  // SeNS
  m_usespell_check = GetDlgItem(IDC_USESPELLCHECKER);
  m_highlight_check = GetDlgItem(IDC_BACKGROUNDSPELLCHECK);
  m_custom_dict = GetDlgItem(IDC_CUSTOM_DICT);

  // init color controls
  m_bg.SetDefaultColor(::GetSysColor(COLOR_WINDOW));
  m_fg.SetDefaultColor(::GetSysColor(COLOR_WINDOWTEXT));
  m_bg.SetColor(_Settings.GetColorBG());
  m_fg.SetColor(_Settings.GetColorFG());

  wchar_t buf[MAX_LOAD_STRING + 1];
  if(::LoadString(_Module.GetResourceInstance(), IDS_LANG_ENGLISH, buf, MAX_LOAD_STRING))
 	m_lang.AddString(buf);
  if(::LoadString(_Module.GetResourceInstance(), IDS_LANG_RUSSIAN, buf, MAX_LOAD_STRING))
	m_lang.AddString(buf);
  if(::LoadString(_Module.GetResourceInstance(), IDS_LANG_UKRAINIAN, buf, MAX_LOAD_STRING))
	m_lang.AddString(buf);

  if(LANG_RUSSIAN == _Settings.GetInterfaceLanguageID())
	m_lang.SetCurSel(1);
  else if(LANG_UKRAINIAN == _Settings.GetInterfaceLanguageID())
	m_lang.SetCurSel(2);
  else
	m_lang.SetCurSel(0);

  // get font list
  HDC	hDC=::CreateDC(_T("DISPLAY"),NULL,NULL,NULL);
  LOGFONT lf;
  memset(&lf,0,sizeof(lf));
  lf.lfCharSet=ANSI_CHARSET;
  ::EnumFontFamiliesEx(hDC,&lf,(FONTENUMPROC)&EnumFontProc,(LPARAM)&m_fonts,0);
  ::DeleteDC(hDC);

  // get text
  CString     fnt(_Settings.GetFont());
  int	      idx=m_fonts.FindStringExact(0,fnt);
  if (idx<0)
    idx=0;
  m_fonts.SetCurSel(idx);

  // init zoom
  int	      m_fsz_val = _Settings.GetFontSize();
  CString     szstr;
  szstr.Format(_T("%d"),m_fsz_val);
  m_fontsize.SetWindowText(szstr);
  for (int i=0;i<sizeof(font_sizes)/sizeof(font_sizes[0]);++i) {
    szstr.Format(_T("%d"),font_sizes[i]);
    m_fontsize.AddString(szstr);
  }

  m_src_wrap=GetDlgItem(IDC_WRAP);
  m_src_hl=GetDlgItem(IDC_SYNTAXHL);
  m_src_taghl=GetDlgItem(IDC_TAGHL);
  m_src_eol=GetDlgItem(IDC_SHOWEOL);
  m_src_line_numbers=GetDlgItem(IDC_SHOWLINENUMBERS);

  // init controls
  m_src_wrap.SetCheck(_Settings.XmlSrcWrap());
  m_src_hl.SetCheck(_Settings.XmlSrcSyntaxHL());  
  m_src_taghl.SetCheck(_Settings.XmlSrcTagHL());  
  m_src_eol.SetCheck(_Settings.XmlSrcShowEOL());  
  m_src_line_numbers.SetCheck(_Settings.XMLSrcShowLineNumbers());
  
  if(_Settings.FastMode())
	m_fast_mode.SetCheck(BST_CHECKED);
  else
    m_fast_mode.SetCheck(BST_UNCHECKED);

  // SeNS
  if (_Settings.GetUseSpellChecker())
  {
	  m_usespell_check.SetCheck(BST_CHECKED);
	  m_highlight_check.EnableWindow(TRUE);
  }
  else
  {
	  m_usespell_check.SetCheck(BST_UNCHECKED);
	  m_highlight_check.EnableWindow(FALSE);
  }
  if(_Settings.GetHighlightMisspells())
	m_highlight_check.SetCheck(BST_CHECKED);
  else
	m_highlight_check.SetCheck(BST_UNCHECKED);

  m_custom_dict.SetWindowText (_Settings.GetCustomDict());

  return 0;
}

LRESULT COptDlg::OnOK(WORD, WORD wID, HWND, BOOL&)
{
  // fetch zoom
  CString   szstr(U::GetWindowText(m_fontsize));
  if (_stscanf(szstr,_T("%d"),&m_fsz_val)!=1 ||
    m_fsz_val<6 || m_fsz_val>72)
  {
    MessageBeep(MB_ICONERROR);
    m_fontsize.SetFocus();
    return 0;
  }

  // save colors to registry
  _Settings.SetColorBG(m_bg.GetColor());
  _Settings.SetColorFG(m_fg.GetColor());

  // save font face
  m_face=U::GetWindowText(m_fonts);
  _Settings.SetFont(m_face);
  // save zoom
  _Settings.SetFontSize(m_fsz_val);

  _Settings.SetXmlSrcWrap(m_src_wrap.GetCheck() != 0);
  _Settings.SetXmlSrcSyntaxHL(m_src_hl.GetCheck() != 0);
  _Settings.SetXmlSrcTagHL(m_src_taghl.GetCheck() != 0);
  _Settings.SetXmlSrcShowEOL(m_src_eol.GetCheck() != 0);
  _Settings.SetXMLSrcShowLineNumbers(m_src_line_numbers.GetCheck() != 0);

  _Settings.SetFastMode(m_fast_mode.GetCheck() != 0);  
  _Settings.SetUseSpellChecker(m_usespell_check.GetCheck() != 0); // SeNS
  _Settings.SetHighlightMisspells(m_highlight_check.GetCheck() != 0); // SeNS

  CString s;
  m_custom_dict.GetWindowText(s);
  _Settings.SetCustomDict(s);

  DWORD new_lang;
  switch (m_lang.GetCurSel())
  {
	case 0: new_lang = LANG_ENGLISH; break;
	case 1: new_lang = LANG_RUSSIAN; break;
	case 2: new_lang = LANG_UKRAINIAN; break;
  }

  // если пользователь сменил язык интерфейса....
  if(new_lang != _Settings.GetInterfaceLanguageID())
  {
  	// выдаем предупреждение, о том, что надо перезапустить программу.
	//...
	// выставляем флаг перезагрузки программы.
	_Settings.SetNeedRestart();
	_Settings.SetInterfaceLanguage(new_lang);
  }

  return 0;
}

LRESULT COptDlg::OnCancel(WORD, WORD wID, HWND, BOOL&)
{
  return 0;
}

TCHAR FileNameBuffer[_MAX_PATH];

LRESULT COptDlg::OnShowFileDialog(WORD, WORD, HWND, BOOL&)
{
	OPENFILENAME ofn;
	memset (&ofn, 0, sizeof (OPENFILENAME));
	ofn.lStructSize = sizeof(OPENFILENAME);
	ofn.hInstance = _Module.m_hInst;
	ofn.hwndOwner = m_hWnd;
	ofn.lpstrDefExt = L"dic";
	ofn.lpstrFilter = L"Dictionaries (*.dic)\0*.dic\0All files (*.*)\0*.*\0\0";
	m_custom_dict.GetWindowText(FileNameBuffer, _MAX_PATH);
	ofn.lpstrFile = FileNameBuffer;
    ofn.nFilterIndex = 0;
    ofn.nMaxFile = _MAX_PATH;
    ofn.nMaxFileTitle = _MAX_PATH;
    ofn.Flags = OFN_EXPLORER | OFN_ENABLESIZING | OFN_HIDEREADONLY;
	if (GetOpenFileName(&ofn))
	{
		m_custom_dict.SetWindowText(ofn.lpstrFile);
	}
    return 0;	
}