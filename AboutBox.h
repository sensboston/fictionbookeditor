#pragma once
#include "stdafx.h"
#include "resource.h"
#include <iostream>
#include <sstream>
#include <fstream>
#include <math.h>
#include "ModelessDialog.h"
#include "extras/http_download.h"
#include "extras/MD5.h"
#include "GLLogo.h"

extern "C"
{
	extern const char* build_timestamp;
	extern const char* build_name;
};

using namespace std;

class CTransparentBitmap : public CWindowImpl <CTransparentBitmap, CStatic>
{
public:
	BEGIN_MSG_MAP(CTransparentBitmap)
		MESSAGE_HANDLER(WM_PAINT, OnPaint)
	END_MSG_MAP()

	BOOL SubclassWindow (HWND hWnd)
	{
		CWindowImpl <CTransparentBitmap, CStatic>::SubclassWindow (hWnd);
		return TRUE;
	}

	LRESULT OnPaint(UINT, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
	{
		RECT rect;
		GetClientRect(&rect);
		HBITMAP bmp = GetBitmap(), oldbmp;

		CDC memdc;
		CPaintDC dc(m_hWnd);
		memdc.CreateCompatibleDC(dc);
		oldbmp = memdc.SelectBitmap(bmp);

		dc.FillSolidRect(&rect, ::GetSysColor(COLOR_BTNFACE));
		dc.TransparentBlt(0, 0, rect.right, rect.bottom, memdc, 0, 0, rect.right, rect.bottom, m_transparentColor);

		memdc.SelectBitmap(oldbmp);
		return 0;
	}

	COLORREF m_transparentColor;
};

class CDownloadMonitor : public FCTimerNotify
{
    int    m_task_id ;
    DWORD  m_start_time ;
    HWND   m_dlg ;
public:
    CDownloadMonitor (HWND hDlg, int nTaskID)
    {
        m_dlg = hDlg ;
        m_task_id = nTaskID ;
        m_start_time = GetTickCount() ;
        StartTimer(100) ;
    }

    // in milliseconds
    int GetElapseTime() const
    {
        return (int)(GetTickCount() - m_start_time) ;
    }

private:
    // Update progress
    virtual void OnHandleTimer()
    {
        PostMessage (m_dlg, UIS_WM_UPDATE_PROGRESS_UI, (WPARAM)m_task_id, 0) ;
    }
};

#define ANIM_SIZE 24

class CAboutDlg : public CDialogImpl<CAboutDlg>, public FCHttpDownloadManager
{
public:
	enum { IDD = IDD_ABOUTBOX };

	BEGIN_MSG_MAP(CAboutDlg)
		MESSAGE_HANDLER(WM_INITDIALOG, OnInitDialog)
		MESSAGE_HANDLER(WM_CTLCOLORSTATIC, OnCtlColor)
		MESSAGE_HANDLER(WM_GETMINMAXINFO, OnGetMinMaxInfo)
		MESSAGE_HANDLER(WM_SIZE, OnSize)
		MESSAGE_HANDLER(UIS_WM_UPDATE_PROGRESS_UI, OnUpdateProgressUI)
		MESSAGE_HANDLER(WM_RESIZE_OPENGL_WINDOW, OnResizeOpenGLWindow)
		COMMAND_ID_HANDLER(IDOK, OnCloseCmd)
		COMMAND_ID_HANDLER(IDCANCEL, OnCloseCmd)
		COMMAND_ID_HANDLER(IDC_UPDATE, OnUpdate)
		NOTIFY_HANDLER(IDC_SYSLINK_AB_LINKS, NM_CLICK, OnNMClickSyslinkAbLinks)
	END_MSG_MAP()

private:
	RECT m_SaveRect, m_LogoRect;
	CGLLogoView m_glLogo;
	auto_ptr<CDownloadMonitor> m_monitor;
	stringstream m_file;
	CEdit m_Contributors;
	bool m_UpdateReady;
	CString m_UpdateURL;
	CString m_UpdateMD5;
	CString m_DownloadedMD5;
	int m_AnimIdx;
	CButton m_UpdateButton;
	CBitmap m_AnimBitmaps[ANIM_SIZE];
	CBitmap m_StatusBitmaps[3];
	CTransparentBitmap m_UpdatePict;
	long m_TotalDownloadSize;
	int m_retCode;
	BOOL m_SaveBtnState;
	bool m_bAllowResize;
	CString m_AboutCaption;

	CString m_sCheckingUpdate, m_sConnecting, m_sCantConnect, m_sDownloadedFrom;
	CString m_sDownloaded, m_sError404, m_sError403, m_sError407, m_sIncorrectChecksum;
	CString m_sNewVersionAvailable, m_sHaveLatestVersion, m_sLogoCaption, m_sDownloadReady;
	CString m_sDownloadCompleted, m_sDownloadError, m_sNotSupportRange, m_sDownloadErrorStatus;

    void CheckUpdate();
	CString GetUpdateFileName();
	void RunUpdate(CString filename);

	LRESULT OnInitDialog(UINT, WPARAM, LPARAM, BOOL&);
	LRESULT OnCloseCmd(WORD, WORD wID, HWND, BOOL&);
	LRESULT OnGetMinMaxInfo(UINT, WPARAM, LPARAM lParam, BOOL&);
	LRESULT OnSize(UINT, WPARAM, LPARAM, BOOL&);
	LRESULT OnCtlColor(UINT, WPARAM wParam, LPARAM lParam, BOOL& bHandled);
	LRESULT OnNMClickSyslinkAbLinks(int /*idCtrl*/, LPNMHDR pNMHDR, BOOL&);
    LRESULT OnUpdateProgressUI(UINT, WPARAM, LPARAM, BOOL&);
	LRESULT OnResizeOpenGLWindow(UINT, WPARAM, LPARAM, BOOL&);

    LRESULT OnUpdate(WORD, WORD wID, HWND, BOOL&);
	HTTP_SEND_HEADER PrepareHeader(const CString url);

    void AcceptReceivedData (FCHttpDownload* pTask) ;
    void FinishUpdateStatus (FCHttpDownload* pTask) ;
    virtual void OnAfterDownloadConnected (FCHttpDownload* pTask) ;
    virtual void OnAfterDownloadFinish (FCHttpDownload* pTask) ;
};

