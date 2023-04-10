// SettingsHotkeysDlg.cpp : Implementation of CSettingsHotkeysDlg

#include "stdafx.h"
#include "SettingsHotkeysDlg.h"
#include "utils.h"
#include "Settings.h"
#include "res1.h"

extern CSettings _Settings;

// CSettingsHotkeysDlg
CSettingsHotkeysDlg::CSettingsHotkeysDlg(): m_count(0),
											m_initHkGroups(_Settings.m_hotkey_groups),
											m_selGr(0),
											m_selHk(0)
{
	for(unsigned int i = 0; i < _Settings.m_hotkey_groups.size(); ++i)
	{
		CString groupname = _Settings.m_hotkey_groups[i].m_reg_name;
		for(unsigned int j = 0; j < _Settings.m_hotkey_groups[i].m_hotkeys.size(); ++j)
		{
			CString fullname = groupname + L"\\" + _Settings.m_hotkey_groups[i].m_hotkeys[j].m_reg_name;
			// added by SeNS: do not show empty hotkeys
//			if (!_Settings.m_hotkey_groups[i].m_hotkeys[j].m_name.IsEmpty())
				m_mapHotkeys.Add(fullname, &_Settings.m_hotkey_groups[i].m_hotkeys[j]);
		}
	}

	::LoadString(_Module.GetResourceInstance(), IDS_HOTKEY_WRONG, m_wrongHkMsg.GetBufferSetLength(MAX_LOAD_STRING + 1),
					MAX_LOAD_STRING + 1);
	m_wrongHkMsg.ReleaseBuffer();
}

CSettingsHotkeysDlg::~CSettingsHotkeysDlg()
{
}

LRESULT CSettingsHotkeysDlg::OnInitDialog(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	CAxDialogImpl<CSettingsHotkeysDlg>::OnInitDialog(uMsg, wParam, lParam, bHandled);

	m_hkGroups = GetDlgItem(IDC_LIST_HOTKEYS_GROUPS);
	for(unsigned int i = 0; i < _Settings.m_hotkey_groups.size(); ++i)
		m_hkGroups.AddString(_Settings.m_hotkey_groups[i].m_name);

	m_hkGroups.SetCurSel(m_selGr);

	m_hotkeys = GetDlgItem(IDC_LIST_HOTKEYS);
	for(unsigned int i = 0; i < _Settings.m_hotkey_groups[m_selGr].m_hotkeys.size(); ++i)
	{
		// changed by SeNS: do not show empty hotkeys
//		if (!_Settings.m_hotkey_groups[m_selGr].m_hotkeys[i].m_name.IsEmpty())
			m_hotkeys.AddString(_Settings.m_hotkey_groups[m_selGr].m_hotkeys[i].m_name);
	}

	m_hotkeys.SetCurSel(m_selHk);

	m_editHotkey.SubclassWindow(GetDlgItem(IDC_EDIT_HOTKEY));
	ClearAndSet();

	return 0;
}

int CSettingsHotkeysDlg::GetTextLen(CString text)
{
	CDC DC = m_hotkeys.GetDC();

	CSize size;
	DC.GetTextExtent(text, (int)_tcslen(text.GetBuffer()), &size);
	size.cx += 3;

	ReleaseDC(DC);

	return size.cx;
}

LRESULT CSettingsHotkeysDlg::OnGroupsSelChange(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	m_selGr = m_hkGroups.GetCurSel();
	m_hotkeys.ResetContent();

	int maxExt = 0;
	for(unsigned int i = 0; i < _Settings.m_hotkey_groups[m_selGr].m_hotkeys.size(); ++i)
	{
		int iExt = GetTextLen(_Settings.m_hotkey_groups[m_selGr].m_hotkeys[i].m_name);
		if(iExt > maxExt)
		{
			m_hotkeys.SetHorizontalExtent(iExt);
			maxExt = iExt;
		}
		else m_hotkeys.SetHorizontalExtent(maxExt);

		// changed by SeNS: do not show empty hotkeys
//		if (!_Settings.m_hotkey_groups[m_selGr].m_hotkeys[i].m_name.IsEmpty())
			m_hotkeys.AddString(_Settings.m_hotkey_groups[m_selGr].m_hotkeys[i].m_name);
	}

	m_hotkeys.SetCurSel(0);
	m_selHk = m_hotkeys.GetCurSel();
	ClearAndSet();

	return 0;
}

LRESULT CSettingsHotkeysDlg::OnHotkeysSelChange(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	m_selHk = m_hotkeys.GetCurSel();
	ClearAndSet();

	return 0;
}

hkIndex CSettingsHotkeysDlg::GetCollIndex(ACCEL newAccel)
{
	hkIndex index = {-1, -1};

	if(newAccel.key == NULL)
		goto ret;

	for(unsigned int i = 0; i < _Settings.m_hotkey_groups.size(); ++i)
	{
		for(unsigned int j = 0; j < _Settings.m_hotkey_groups[i].m_hotkeys.size(); ++j)
		{
			if(_Settings.m_hotkey_groups[i].m_hotkeys[j].m_accel.fVirt == newAccel.fVirt
				&& _Settings.m_hotkey_groups[i].m_hotkeys[j].m_accel.key == newAccel.key
				&& (i != m_selGr || j != m_selHk))
			{
				index.group = i;
				index.hotkey = j;
				goto ret;
			}
		}
	}

ret:
	return index;
}

bool CSettingsHotkeysDlg::TestAndSet()
{
	bool collisions = false;
	for(int i = 0; i< m_mapHotkeys.GetSize(); ++i)
	{
		CHotkey* hotkey = m_mapHotkeys.GetValueAt(i);
		if(hotkey->m_accel.fVirt == m_accel.fVirt && hotkey->m_accel.key == m_accel.key)
		{
			hotkey->m_accel.fVirt = NULL;
			hotkey->m_accel.key = NULL;

			collisions = true;
		}
	}

	_Settings.m_hotkey_groups[m_selGr].m_hotkeys[m_selHk].m_accel = m_accel;

	return collisions;
}

LRESULT CSettingsHotkeysDlg::OnBnClickedButtonDefault(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	hkIndex index = GetCollIndex(_Settings.m_hotkey_groups[m_selGr].m_hotkeys[m_selHk].m_def_accel);
	if(index.group != -1 && index.hotkey != -1)
	{
		wchar_t collDefMsg[MAX_LOAD_STRING + 1];
		::LoadString(_Module.GetResourceInstance(),
					IDS_HOTKEY_DEFAULT_COLLISION,
					collDefMsg,
					MAX_LOAD_STRING + 1);

		CString collCmdName;
		collCmdName += _Settings.m_hotkey_groups[index.group].m_name;
		collCmdName += L'\\';
		collCmdName += _Settings.m_hotkey_groups[index.group].m_hotkeys[index.hotkey].m_name;

		CString collDefCmdMsg;
		collDefCmdMsg.Format(collDefMsg, collCmdName);

		wchar_t errCaption[MAX_LOAD_STRING + 1];
		::LoadString(_Module.GetResourceInstance(),
			IDS_ERRMSGBOX_CAPTION,
			errCaption,
			MAX_LOAD_STRING + 1);

		if(MessageBox(collDefCmdMsg, errCaption, MB_YESNO | MB_ICONEXCLAMATION) == IDYES)
		{
			m_accel = _Settings.m_hotkey_groups[m_selGr].m_hotkeys[m_selHk].m_def_accel;
			TestAndSet();
			ClearAndSet();
		}
	}
	else
	{
		m_accel = _Settings.m_hotkey_groups[m_selGr].m_hotkeys[m_selHk].m_def_accel;
		TestAndSet();
		ClearAndSet();
	}

	return 0;
}

LRESULT CSettingsHotkeysDlg::OnBnClickedButtonHotkeyDelete(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	::ZeroMemory(&_Settings.m_hotkey_groups[m_selGr].m_hotkeys[m_selHk].m_accel, sizeof(ACCEL));
	ClearAndSet();

	return 0;
}

LRESULT CSettingsHotkeysDlg::OnClickedOK(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	for(unsigned int i = 0; i < _Settings.m_hotkey_groups.size(); ++i)
	{
		for(unsigned int j = 0; j < _Settings.m_hotkey_groups.at(i).m_hotkeys.size(); ++j)
		{
			ACCEL accel = _Settings.m_hotkey_groups[i].m_hotkeys[j].m_accel;
			ACCEL init_accel = m_initHkGroups[i].m_hotkeys[j].m_accel;
			if(accel.fVirt != init_accel.fVirt || accel.key != init_accel.key || accel.cmd != init_accel.cmd)
			{
				_Settings.SetNeedRestart();
				break;
			}
		}
	}
	
	EndDialog(wID);
	return 0;
}

LRESULT CSettingsHotkeysDlg::OnClickedCancel(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	_Settings.m_hotkey_groups = m_initHkGroups;

	EndDialog(wID);
	return 0;
}

LRESULT CSettingsHotkeysDlg::OnEditSetFocus(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	m_editHotkey.SetWindowText(NULL);
	::SetWindowText(GetDlgItem(IDC_EDIT_HOTKEY_COLLISION), NULL);

	m_accel.cmd = _Settings.m_hotkey_groups[m_selGr].m_hotkeys[m_selHk].m_accel.cmd;

	return 0;
}

bool CSettingsHotkeysDlg::Test()
{
	hkIndex index = GetCollIndex(m_accel);
	wchar_t collMsg[MAX_LOAD_STRING +1];

	if(index.group != -1 && index.hotkey != -1)
	{
		CString collCmdName;
		collCmdName += _Settings.m_hotkey_groups[index.group].m_name;
		collCmdName += L'\\';
		collCmdName += _Settings.m_hotkey_groups[index.group].m_hotkeys[index.hotkey].m_name;

		::LoadString(_Module.GetResourceInstance(),
			IDS_HOTKEY_ASSIGN_COLLISION,
			collMsg,
			MAX_LOAD_STRING + 1);

		CString collCmdMsg;
		collCmdMsg.Format(collMsg, collCmdName);

		::SetWindowText(GetDlgItem(IDC_EDIT_HOTKEY_COLLISION), collCmdMsg);

		return true;
	}
	else
	{
		::LoadString(_Module.GetResourceInstance(),
			IDS_HOTKEY_ASSIGN_NO_COLLISION,
			collMsg,
			MAX_LOAD_STRING + 1);

		::SetWindowText(GetDlgItem(IDC_EDIT_HOTKEY_COLLISION), collMsg);

		return false;
	}
}

LRESULT CSettingsHotkeysDlg::OnKeyPressed(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	CString wndText;
	m_editHotkey.GetWindowText(wndText);

	switch(m_count)
	{
		case 0:
			{
				m_editHotkey.SetWindowText(NULL);
				ZeroMemory(&m_accel, sizeof(ACCEL));
				m_accel.fVirt = FVIRTKEY;
				m_accel.cmd = _Settings.m_hotkey_groups[m_selGr].m_hotkeys[m_selHk].m_accel.cmd;

				if(wParam == VK_CONTROL || wParam == U::StringToKeycode(L"Alt") || wParam == VK_SHIFT)
				{
					wndText = U::KeycodeToString(wParam);
					m_editHotkey.SetWindowText(wndText);

					m_accel.fVirt |= U::VKToFVirt(wParam);
					m_count++;
				}
				else if (wParam >= VK_F1 && wParam <= VK_F12)
				{
					wndText += U::KeycodeToString(wParam);
					m_editHotkey.SetWindowText(wndText);

					m_accel.key = wParam;
					m_count = 0;
					Test();
					::EnableWindow(GetDlgItem(IDC_BUTTON_HOTKEY_ASSIGN), TRUE);
				}
				else
				{
					m_editHotkey.SetWindowText(m_wrongHkMsg);
					m_count = 0;
					::EnableWindow(GetDlgItem(IDC_BUTTON_HOTKEY_ASSIGN), FALSE);
					::SetWindowText(GetDlgItem(IDC_EDIT_HOTKEY_COLLISION), NULL);
				}

				break;
			}
		case 1:
		{
			if(wParam == VK_CONTROL || wParam == U::StringToKeycode(L"Alt") || wParam == VK_SHIFT)
			{
				wndText += L" + ";
				wndText += U::KeycodeToString(wParam);
				m_editHotkey.SetWindowText(wndText);

				m_accel.fVirt |= U::VKToFVirt(wParam);
				m_count++;
			}
			else if(U::KeycodeToString(wParam) != L"")
			{
/*				if(m_accel.fVirt & FSHIFT)
				{
					m_editHotkey.SetWindowText(m_wrongHkMsg);
					m_count = 0;
					::EnableWindow(GetDlgItem(IDC_BUTTON_HOTKEY_ASSIGN), FALSE);
					::SetWindowText(GetDlgItem(IDC_EDIT_HOTKEY_COLLISION), NULL);
				}
				else */
				{ 
					wndText += L" + ";
					wndText += U::KeycodeToString(wParam);
					m_editHotkey.SetWindowText(wndText);

					m_accel.key = wParam;
					m_count = 0;
					Test();
					::EnableWindow(GetDlgItem(IDC_BUTTON_HOTKEY_ASSIGN), TRUE);
				}
			}

			break;
		}
		case 2:
		{
			if(wParam == VK_CONTROL || wParam == U::StringToKeycode(L"Alt") || wParam == VK_SHIFT)
			{
				wndText += L" + ";
				wndText += U::KeycodeToString(wParam);
				m_editHotkey.SetWindowText(wndText);

				m_accel.fVirt |= U::VKToFVirt(wParam);
				m_count++;
			}
			else if(U::KeycodeToString(wParam) != L"")
			{
				wndText += L" + ";
				wndText += U::KeycodeToString(wParam);
				m_editHotkey.SetWindowText(wndText);

				m_accel.key = wParam;
				m_count = 0;
				Test();
				::EnableWindow(GetDlgItem(IDC_BUTTON_HOTKEY_ASSIGN), TRUE);
			}

			break;
		}
		case 3:
		{
			if(U::KeycodeToString(wParam) != L""
				&& wParam != VK_CONTROL
				&& wParam != U::StringToKeycode(L"Alt")
				&& wParam != VK_SHIFT)
			{
				wndText += L" + ";
				wndText += U::KeycodeToString(wParam);
				m_editHotkey.SetWindowText(wndText);

				m_accel.key = wParam;
				m_count = 0;
				Test();
				::EnableWindow(GetDlgItem(IDC_BUTTON_HOTKEY_ASSIGN), TRUE);
			}
			else
			{
				m_editHotkey.SetWindowText(m_wrongHkMsg);
				m_count = 0;
				::EnableWindow(GetDlgItem(IDC_BUTTON_HOTKEY_ASSIGN), FALSE);
				::SetWindowText(GetDlgItem(IDC_EDIT_HOTKEY_COLLISION), NULL);
			}

			break;
		}
	}

	return 0;
}

LRESULT CSettingsHotkeysDlg::OnKeyReleased(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	if(m_accel.key == NULL)
	{
		ClearAndSet();
	}

	return 0;
}

LRESULT CSettingsHotkeysDlg::OnBnClickedButtonHotkeyAssign(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	TestAndSet();
	ClearAndSet();

	return 0;
}

void CSettingsHotkeysDlg::ClearAndSet()
{
	m_count = 0;
	ZeroMemory(&m_accel, sizeof(ACCEL));
	::EnableWindow(GetDlgItem(IDC_BUTTON_HOTKEY_ASSIGN), FALSE);
	m_editHotkey.SetWindowText(U::AccelToString(_Settings.m_hotkey_groups[m_selGr].m_hotkeys[m_selHk].m_accel));
	::SetWindowText(GetDlgItem(IDC_EDIT_HOTKEY_COLLISION), NULL);
	if(_Settings.m_hotkey_groups[m_selGr].m_hotkeys[m_selHk].m_desc != L"")
		::SetWindowText(GetDlgItem(IDC_EDIT_HOTKEY_DESCRIPTION), _Settings.m_hotkey_groups[m_selGr].m_hotkeys[m_selHk].m_desc);
	else
		::SetWindowText(GetDlgItem(IDC_EDIT_HOTKEY_DESCRIPTION), NULL);
}
