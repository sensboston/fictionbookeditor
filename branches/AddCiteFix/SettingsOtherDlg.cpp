// SettingsOtherDlg.cpp : Implementation of CSettingsOtherDlg

#include "stdafx.h"
#include "SettingsOtherDlg.h"
#include "utils.h"
#include "Settings.h"
#include "res1.h"
#include ".\settingsotherdlg.h"

extern CSettings _Settings;

// CSettingsOtherDlg

CSettingsOtherDlg::CSettingsOtherDlg()
{
	m_scripts_fld_dlg_msg.GetBufferSetLength(MAX_LOAD_STRING + 1);
}

CSettingsOtherDlg::~CSettingsOtherDlg()
{
}

LRESULT CSettingsOtherDlg::OnInitDialog(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	CAxDialogImpl<CSettingsOtherDlg>::OnInitDialog(uMsg, wParam, lParam, bHandled);
	m_shortcuts = GetDlgItem(IDC_SHORTCUTS);	
	m_keep = GetDlgItem(IDC_KEEP);
	m_def_enc = GetDlgItem(IDC_DEFAULT_ENC);
	m_restore_pos = GetDlgItem(IDC_RESTORE_POS);
	m_def_scripts_fld = GetDlgItem(IDC_DEFAULT_SCRIPTS_FOLDER);
	m_scripts_folder = GetDlgItem(IDC_SCRIPTS_FOLDER_PATH);
	m_scripts_folder_sel = GetDlgItem(IDC_SELECT_SCRIPTS_FOLDER_BUTTON);
	::SendMessage(GetDlgItem(IDC_SETTINGS_ASKIMAGE), BM_SETCHECK, 
				_Settings.GetInsImageAsking() ? BST_CHECKED : BST_UNCHECKED, 0);
	::SendMessage(GetDlgItem(IDC_SCRIPTS_HK_NOTIFY), BM_SETCHECK, 
				_Settings.GetScriptsHkErrNotify() ? BST_CHECKED : BST_UNCHECKED, 0);

	::EnableWindow(GetDlgItem(IDC_OPTIONS_CLEARIMGS), !IsDlgButtonChecked(IDC_SETTINGS_ASKIMAGE));
	::SendMessage(GetDlgItem(IDC_OPTIONS_CLEARIMGS), BM_SETCHECK, 
				_Settings.GetIsInsClearImage() ? BST_CHECKED : BST_UNCHECKED, 0);
	
	m_shortcuts.AddString(L"FBEditor Map");
	m_shortcuts.AddString(L"FBWriter Map");	
	
	if(_Settings.FBWHotkeys())
		m_shortcuts.SetCurSel(1);
	else
		m_shortcuts.SetCurSel(0);
	
    wchar_t buf[MAX_LOAD_STRING + 1];
	if (::LoadString(_Module.GetResourceInstance(),IDS_ENCODINGS,buf,sizeof(buf)/sizeof(buf[0])))
	{
		TCHAR   *cp=buf;
		while (*cp) 
		{
			size_t len=_tcscspn(cp,_T(","));
			if (cp[len])
			cp[len++]=_T('\0');
			if (*cp)
			{
				m_def_enc.AddString(cp);
			}
			cp+=len;
		}
	}
	
	m_def_enc.SelectString(0, _Settings.GetDefaultEncoding());
	m_keep.SetCheck(_Settings.KeepEncoding() ? BST_CHECKED : BST_UNCHECKED);
	m_restore_pos.SetCheck(_Settings.RestoreFilePosition() ? BST_CHECKED : BST_UNCHECKED);

	_Settings.m_initial_scripts_folder = _Settings.GetScriptsFolder();
	m_def_scripts_fld.SetCheck(_Settings.IsDefaultScriptsFolder());	
	m_scripts_folder.SetWindowText(_Settings.m_initial_scripts_folder);
	m_scripts_folder.SetReadOnly(_Settings.IsDefaultScriptsFolder());
	m_scripts_folder_sel.EnableWindow(!_Settings.IsDefaultScriptsFolder());
	m_scripts_switched = _Settings.IsDefaultScriptsFolder();
	
	::LoadString(_Module.GetResourceInstance(), IDS_CHOOSE_SCRIPTS_FLD, m_scripts_fld_dlg_msg.GetBuffer(), MAX_LOAD_STRING + 1);

	return 1;
}

LRESULT CSettingsOtherDlg::OnClickedOK(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	CString def_enc;
	m_def_enc.GetLBText(m_def_enc.GetCurSel(), def_enc);

	_Settings.SetFBWHotkeys(m_shortcuts.GetCurSel() != 0);
	_Settings.SetDefaultEncoding(def_enc);
	_Settings.SetKeepEncoding(m_keep.GetState() != 0);
	_Settings.SetRestoreFilePosition(m_restore_pos.GetState() != 0);
	
	CString folderPath;
	m_scripts_folder.GetWindowText(folderPath);
	_Settings.SetScriptsFolder(folderPath == "" ? _Settings.GetDefaultScriptsFolder() : folderPath, true);

	if(_Settings.m_initial_scripts_folder != _Settings.GetScriptsFolder())
	{
		_Settings.SetNeedRestart();
	}

	_Settings.SetInsImageAsking(IsDlgButtonChecked(IDC_SETTINGS_ASKIMAGE));
	_Settings.SetScriptsHkErrNotify(IsDlgButtonChecked(IDC_SCRIPTS_HK_NOTIFY));

	_Settings.SetIsInsClearImage(IsDlgButtonChecked(IDC_OPTIONS_CLEARIMGS));

	EndDialog(wID);
	return 0;
}

LRESULT CSettingsOtherDlg::OnClickedCancel(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	EndDialog(wID);
	return 0;
}

LRESULT CSettingsOtherDlg::OnBnClickedDefaultScriptsFolder(WORD /*wNotifyCode*/, WORD /*wID*/, HWND /*hWndCtl*/, BOOL& /*bHandled*/)
{
	if(!m_scripts_switched)
	{
		CString path;
		m_scripts_folder.GetWindowText(path);
		if(path != _Settings.GetDefaultScriptsFolder())
		{
			m_scripts_folder.SetWindowText(_Settings.GetDefaultScriptsFolder());
		}
		
		_Settings.SetScriptsFolder(_Settings.GetDefaultScriptsFolder(), true);
		m_scripts_folder.SetReadOnly(true);
		m_scripts_folder_sel.EnableWindow(false);
	}
	else
	{
		m_scripts_folder.SetReadOnly(false);
		m_scripts_folder_sel.EnableWindow(true);
	}

	m_scripts_switched = !m_scripts_switched;
	return 0;
}

LRESULT CSettingsOtherDlg::OnBnClickedSelectScriptsFolderButton(WORD /*wNotifyCode*/, WORD /*wID*/, HWND /*hWndCtl*/, BOOL& /*bHandled*/)
{
	CFolderDialog fldDlg(NULL, m_scripts_fld_dlg_msg, BIF_NEWDIALOGSTYLE | BIF_RETURNONLYFSDIRS);
	if (fldDlg.DoModal(*this) == IDOK)
	{
		CString folderPath(fldDlg.m_szFolderPath);
		folderPath.MakeLower();
		if(!(folderPath.ReverseFind(L'\\') == (folderPath.GetLength() - 1)))
		{
			folderPath.Append(L"\\");
		}

		m_scripts_folder.SetWindowText(folderPath);
	}
	return 0;
}
LRESULT CSettingsOtherDlg::OnBnClickedSettingsAskimage(WORD /*wNotifyCode*/, WORD /*wID*/, HWND /*hWndCtl*/, BOOL& /*bHandled*/)
{
	::EnableWindow(GetDlgItem(IDC_OPTIONS_CLEARIMGS), !IsDlgButtonChecked(IDC_SETTINGS_ASKIMAGE));
	if(IsDlgButtonChecked(IDC_SETTINGS_ASKIMAGE))
		::SendMessage(GetDlgItem(IDC_OPTIONS_CLEARIMGS), BM_SETCHECK, BST_UNCHECKED, 0);
	return 0;
}
