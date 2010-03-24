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
  CComboBox	    m_fontsize;
  CComboBox		m_lang;

  CString	    m_face;
  int		    m_fsz_val;

  CButton	    m_fast_mode;

  CButton	    m_src_wrap;
  CButton	    m_src_hl;
  CButton	    m_src_eol;
  
  BEGIN_MSG_MAP(COptDlg)
    COMMAND_ID_HANDLER(IDOK, OnOK)
    COMMAND_ID_HANDLER(IDCANCEL, OnCancel)
    MESSAGE_HANDLER(WM_INITDIALOG, OnInitDialog)
    REFLECT_NOTIFICATIONS()
  END_MSG_MAP()

  LRESULT OnInitDialog(UINT, WPARAM, LPARAM, BOOL&);

  LRESULT OnOK(WORD, WORD wID, HWND, BOOL&);
  LRESULT OnCancel(WORD, WORD wID, HWND, BOOL&);

  LRESULT OnTcnSelchangeTab3(int /*idCtrl*/, LPNMHDR pNMHDR, BOOL& /*bHandled*/);
};
#endif