// SettingsDlg.cpp : Implementation of CSettingsDlg

#include "stdafx.h"
#include "Settings.h"
#include "SettingsDlg.h"
#include "SettingsOtherDlg.h"
#include "res1.h"

extern CSettings _Settings;

// CSettingsDlg

CSettingsDlg::CSettingsDlg()
{
}

CSettingsDlg::~CSettingsDlg()
{
}

typedef BOOL (__stdcall *PFNISTHEMEACTIVE)();
typedef HRESULT (__stdcall *PFNENABLETHEMEDIALOGTEXTURE)(HWND hwnd, DWORD dwFlags);

LRESULT CSettingsDlg::OnInitDialog(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	CAxDialogImpl<CSettingsDlg>::OnInitDialog(uMsg, wParam, lParam, bHandled);
	m_tab_ctrl = this->GetDlgItem(IDC_TAB_CTRL);

	TC_ITEM TabItem;
	TabItem.mask = TCIF_TEXT; 
	wchar_t buf[MAX_LOAD_STRING + 1];
	if(::LoadString(_Module.GetResourceInstance(), IDS_SETTINGS_VIEW_CAPTION, buf, MAX_LOAD_STRING))
		TabItem.pszText = buf;
	m_tab_ctrl.InsertItem(0, &TabItem);
	if(::LoadString(_Module.GetResourceInstance(), IDS_SETTINGS_OTHER_CAPTION, buf, MAX_LOAD_STRING))
		TabItem.pszText = buf;
	m_tab_ctrl.InsertItem(1, &TabItem);

	CRect rect;
	m_tab_ctrl.GetWindowRect(rect);
	m_tab_ctrl.ScreenToClient(rect);
	m_tab_ctrl.AdjustRect(FALSE, rect);	 
	
	COptDlg* pPage1;	
	pPage1 = new COptDlg; 		
	pPage1->ShowDialog(m_tab_ctrl); 	
	this->AddTabPage(0, pPage1, rect);	

	CSettingsOtherDlg* pPage2 = new CSettingsOtherDlg;
	pPage2->Create(m_tab_ctrl);
	this->AddTabPage(1, pPage2, rect);

	HMODULE hThemeDll = LoadLibrary(_T("UxTheme.dll"));
	if (hThemeDll != NULL)
	{
		PFNENABLETHEMEDIALOGTEXTURE pEnableThemeDialogTexture = (PFNENABLETHEMEDIALOGTEXTURE)GetProcAddress(hThemeDll, "EnableThemeDialogTexture");
		if(pEnableThemeDialogTexture)
		{
			pEnableThemeDialogTexture(*pPage1, ETDT_USETABTEXTURE);
			pEnableThemeDialogTexture(*pPage2, ETDT_USETABTEXTURE);
		}
		FreeLibrary(hThemeDll);
	}	

	return 1;
}

LRESULT CSettingsDlg::OnClickedOK(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	CWindow* pWnd;		
	TC_ITEM tci; 
	tci.mask = TCIF_PARAM; 
	int cnt = m_tab_ctrl.GetItemCount();
	for (int i = cnt - 1; i>=0; i--) 
	{ 
		m_tab_ctrl.GetItem(i, &tci);
		pWnd = (CWindow*)tci.lParam;		
		if(pWnd)
		{
			pWnd->SendMessage(WM_COMMAND, MAKELONG(IDOK, 0), 0);
		}
	}

	EndDialog(wID);
	return 0;
}

LRESULT CSettingsDlg::OnClickedCancel(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	if(_Settings.m_initial_scripts_folder != _Settings.GetScriptsFolder())
	{
		_Settings.SetScriptsFolder(_Settings.m_initial_scripts_folder, true);
	}

	EndDialog(wID);
	return 0;
}

LRESULT CSettingsDlg::OnSelchangeTab(int idCtrl, LPNMHDR pnmh, BOOL& bHandled) 
{ 	
	int nTab = m_tab_ctrl.GetCurSel(); 
	TC_ITEM tci; 
	tci.mask = TCIF_PARAM; 
	m_tab_ctrl.GetItem(nTab, &tci); 
	CWindow* pWnd = (CWindow*)tci.lParam; 
	if(pWnd)
		pWnd->ShowWindow(SW_SHOW); 
	bHandled = false; 
	return 0;
} 

LRESULT CSettingsDlg::OnSelchangingTab(int idCtrl, LPNMHDR pnmh, BOOL& bHandled) 
{ 
	int nTab = m_tab_ctrl.GetCurSel(); 
	TC_ITEM tci; 
	tci.mask = TCIF_PARAM; 
	m_tab_ctrl.GetItem(nTab, &tci); 
	tci.lParam; 
	CWindow* pWnd = (CWindow*)tci.lParam; 
	int res = 0;
	if(pWnd)
		res = pWnd->ShowWindow(SW_HIDE); 
	bHandled = false; 
	return 0;
}

LRESULT CSettingsDlg::OnDestroy(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled) 
{	
	CWindow* pWnd;	
	TC_ITEM tci; 
	tci.mask = TCIF_PARAM; 
	int cnt = m_tab_ctrl.GetItemCount();
	for (int i = cnt - 1; i>=0; i--) 
	{ 
		m_tab_ctrl.GetItem(i, &tci); 
		pWnd = (CWindow*)tci.lParam;		
		if(pWnd)
		{
			pWnd->DestroyWindow(); 
			delete (CModelessDialogImpl<CWindow>*)pWnd; 
		}
	} 
	return 0;
}

void CSettingsDlg::AddTabPage(const int index, CWindow* pDialog, const CRect& rect)
{
	TC_ITEM TabItem;
	TabItem.mask = TCIF_PARAM; 	
	TabItem.lParam = (LPARAM)(CWindow*)pDialog; 
	m_tab_ctrl.SetItem(index, &TabItem); 		
	pDialog->MoveWindow(rect.left, rect.top, rect.Width(), rect.Height(), SWP_NOSIZE | SWP_NOZORDER); 
}