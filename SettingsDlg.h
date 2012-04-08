// SettingsDlg.h : Declaration of the CSettingsDlg

#pragma once

#include "resource.h"
#include "OptDlg.h"

// CSettingsDlg

class CSettingsDlg : public CAxDialogImpl<CSettingsDlg>
{
	CTabCtrl m_tab_ctrl;

public:
	CSettingsDlg();
	~CSettingsDlg();

	enum { IDD = IDD_TOOLS_SETTINGS };

BEGIN_MSG_MAP(CSettingsDlg)
	MESSAGE_HANDLER(WM_INITDIALOG, OnInitDialog)
	MESSAGE_HANDLER(WM_DESTROY, OnDestroy)
	COMMAND_HANDLER(IDOK, BN_CLICKED, OnClickedOK)
	COMMAND_HANDLER(IDCANCEL, BN_CLICKED, OnClickedCancel)
	NOTIFY_HANDLER(IDC_TAB_CTRL, TCN_SELCHANGE, OnSelchangeTab)
	NOTIFY_HANDLER(IDC_TAB_CTRL, TCN_SELCHANGING, OnSelchangingTab)
	CHAIN_MSG_MAP(CAxDialogImpl<CSettingsDlg>)
END_MSG_MAP()

	LRESULT OnInitDialog(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled);
	LRESULT OnClickedOK(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled);
	LRESULT OnClickedCancel(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled);
	LRESULT OnSelchangeTab(int idCtrl, LPNMHDR pnmh, BOOL& bHandled);
	LRESULT OnSelchangingTab(int idCtrl, LPNMHDR pnmh, BOOL& bHandled);
	LRESULT OnDestroy(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled);

private:
	void AddTabPage(const int index, CWindow* Dialog, const CRect& rect);
};
