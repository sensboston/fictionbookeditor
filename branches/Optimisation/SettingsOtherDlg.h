// SettingsOtherDlg.h : Declaration of the CSettingsOtherDlg

#pragma once

#include "resource.h" 
#include "CFileDialogEx.h"
#include <atlhost.h>


// CSettingsOtherDlg

class CSettingsOtherDlg : 
	public CAxDialogImpl<CSettingsOtherDlg>
{
	CButton		m_keep;
	CComboBox	m_def_enc;
	CButton		m_restore_pos;
	CButton		m_def_scripts_fld;
	CEdit		m_scripts_folder;
	CButton		m_scripts_folder_sel;

	bool		m_scripts_switched;	
	CString		m_scripts_fld_dlg_msg;

public:
	CSettingsOtherDlg();
	~CSettingsOtherDlg();

	enum { IDD = IDD_SETTING_OTHER };

BEGIN_MSG_MAP(CSettingsOtherDlg)
	MESSAGE_HANDLER(WM_INITDIALOG, OnInitDialog)
	COMMAND_HANDLER(IDOK, BN_CLICKED, OnClickedOK)
	COMMAND_HANDLER(IDCANCEL, BN_CLICKED, OnClickedCancel)
	COMMAND_HANDLER(IDC_DEFAULT_SCRIPTS_FOLDER, BN_CLICKED, OnBnClickedDefaultScriptsFolder)
	COMMAND_HANDLER(IDC_SELECT_SCRIPTS_FOLDER_BUTTON, BN_CLICKED, OnBnClickedSelectScriptsFolderButton)
	COMMAND_HANDLER(IDC_SETTINGS_ASKIMAGE, BN_CLICKED, OnBnClickedSettingsAskimage)
	CHAIN_MSG_MAP(CAxDialogImpl<CSettingsOtherDlg>)
END_MSG_MAP()

	LRESULT OnInitDialog(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled);
	LRESULT OnClickedOK(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled);
	LRESULT OnClickedCancel(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled);	
	LRESULT OnBnClickedRestorePos2(WORD /*wNotifyCode*/, WORD /*wID*/, HWND /*hWndCtl*/, BOOL& /*bHandled*/);
	LRESULT OnBnClickedDefaultScriptsFolder(WORD /*wNotifyCode*/, WORD /*wID*/, HWND /*hWndCtl*/, BOOL& /*bHandled*/);
	LRESULT OnBnClickedSelectScriptsFolderButton(WORD /*wNotifyCode*/, WORD /*wID*/, HWND /*hWndCtl*/, BOOL& /*bHandled*/);
	LRESULT OnBnClickedSettingsAskimage(WORD /*wNotifyCode*/, WORD /*wID*/, HWND /*hWndCtl*/, BOOL& /*bHandled*/);
};


