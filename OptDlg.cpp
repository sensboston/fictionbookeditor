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

  if(LANG_RUSSIAN == _Settings.GetInterfaceLanguageID())
	m_lang.SetCurSel(1);
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
  m_src_eol=GetDlgItem(IDC_SHOWEOL);

  // init controls
  m_src_wrap.SetCheck(_Settings.XmlSrcWrap());
  m_src_hl.SetCheck(_Settings.XmlSrcSyntaxHL());  
  m_src_eol.SetCheck(_Settings.XmlSrcShowEOL());  
  
  if(_Settings.FastMode())
	m_fast_mode.SetCheck(BST_CHECKED);
  else
    m_fast_mode.SetCheck(BST_UNCHECKED);

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
  _Settings.SetXmlSrcShowEOL(m_src_eol.GetCheck() != 0);
  _Settings.SetFastMode(m_fast_mode.GetCheck() != 0);  

  DWORD new_lang;
  if(0 == m_lang.GetCurSel())
	new_lang = LANG_ENGLISH;	
  else
	new_lang = LANG_RUSSIAN;	

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
