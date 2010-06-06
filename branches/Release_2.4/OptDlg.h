#ifndef OPTDLG_H
#define OPTDLG_H

// color picker
#include <ColorButton.h>

#include "apputils.h"
#include "utils.h"
#include "FBEView.h"
#include "ModelessDialog.h"

class COptDlg: public CModelessDialogImpl<COptDlg>
{
public:
  enum { IDD=IDD_OPTIONS };

  COptDlg() { }

  CColorButton	m_fg,m_bg;
  CComboBox	    m_fonts;
  CComboBox	    m_srcfonts;
  CComboBox	    m_fontsize;
  CComboBox		m_lang;

  CString	    m_face;
  int		    m_fsz_val;

  CButton	    m_fast_mode;

  CButton		m_usespell_check;	// SeNS
  CButton		m_highlight_check;	// SeNS
  CEdit			m_custom_dict;		// SeNS

  CButton	    m_src_wrap;
  CButton	    m_src_hl;
  CButton	    m_src_taghl;
  CButton	    m_src_eol;
  CButton	    m_src_line_numbers;
  
  BEGIN_MSG_MAP(COptDlg)
    COMMAND_ID_HANDLER(IDOK, OnOK)
    COMMAND_ID_HANDLER(IDCANCEL, OnCancel)
	COMMAND_HANDLER(IDC_USESPELLCHECKER, BN_CLICKED, OnUseSpellChecker)
	COMMAND_HANDLER(IDC_DICTPATH, BN_CLICKED, OnShowFileDialog)
    MESSAGE_HANDLER(WM_INITDIALOG, OnInitDialog)
    REFLECT_NOTIFICATIONS()
  END_MSG_MAP()

  LRESULT OnInitDialog(UINT, WPARAM, LPARAM, BOOL&);

  LRESULT OnOK(WORD, WORD wID, HWND, BOOL&);
  LRESULT OnCancel(WORD, WORD wID, HWND, BOOL&);

  LRESULT OnTcnSelchangeTab3(int /*idCtrl*/, LPNMHDR pNMHDR, BOOL& /*bHandled*/);
  // SeNS
  LRESULT OnShowFileDialog(WORD, WORD, HWND, BOOL&);
  LRESULT OnUseSpellChecker(WORD, WORD, HWND, BOOL&)
  {
	  if (m_usespell_check.GetCheck())
	  {
		  m_highlight_check.EnableWindow(TRUE);
		  m_custom_dict.EnableWindow(TRUE);
	  }
	  else
	  {
		  m_highlight_check.EnableWindow(FALSE);
		  m_custom_dict.EnableWindow(FALSE);
	  }
	  return 0;
  }
};
#endif