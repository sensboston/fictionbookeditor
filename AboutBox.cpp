#include "stdafx.h"
#include "Utils.h"
#include "AboutBox.h"

LRESULT CAboutDlg::OnInitDialog(UINT, WPARAM, LPARAM, BOOL&)
{
	m_bAllowResize = false;

	CString stamp(build_timestamp);
	::SetWindowText(GetDlgItem(IDC_BUILDSTAMP), stamp);

	CString bname(build_name);
	::SetWindowText(GetDlgItem(IDC_STATIC_AB_APPNAMEVER), bname);

	m_Contributors = GetDlgItem(IDC_CONTRIBS);
	HRSRC hres = ::FindResource(NULL, L"ABOUT_FILE", L"ABOUT_FILE");
	HGLOBAL hbytes = ::LoadResource(NULL, hres);
	CA2CT contribs((char*)::LockResource(hbytes), 65001);  // UTF-8
	CString s(contribs);
	m_Contributors.SetWindowText(s.Left(s.ReverseFind(L'\n')-1));

	// create OpenGL logo window
	m_glLogo.SubclassWindow(GetDlgItem(IDC_AB_BANNER));
	if (m_glLogo.OpenGLError())
	{
		m_glLogo.UnsubclassWindow(TRUE);
		GetDlgItem(IDC_AB_BANNER).ShowWindow(SW_HIDE);
		GetDlgItem(IDC_AB_STATIC_BANNER).ShowWindow(SW_SHOW);
	}
	else GetDlgItem(IDC_AB_BANNER).ShowWindow(SW_SHOW);

	// setup automatic updates engine
	m_UpdateButton = GetDlgItem(IDC_UPDATE);
	m_UpdateButton.ShowWindow(SW_HIDE);

	m_AnimIdx = 0;
	m_UpdatePict.SubclassWindow(GetDlgItem(IDC_PIC_UPDATE));
	m_UpdatePict.m_transparentColor = RGB(0,0,0);
	for (int i=0; i<ANIM_SIZE; i++)
		m_AnimBitmaps[i].LoadBitmap(IDB_UPD_CHECK1+i);
	m_UpdatePict.SetBitmap(m_AnimBitmaps[0]);

	m_StatusBitmaps[0].LoadBitmap(IDB_UPD_OK);
	m_StatusBitmaps[1].LoadBitmap(IDB_UPD_UPDATE);
	m_StatusBitmaps[2].LoadBitmap(IDB_UPD_ERR);

	// load localized messages
	m_sCheckingUpdate.LoadString(IDS_UPDATE_CHECK);
	m_sConnecting.LoadString(IDS_UPDATE_CONNECTING);
	m_sCantConnect.LoadString(IDS_UPDATE_CANTCONNECT);
	m_sDownloadedFrom.LoadString(IDS_UPDATE_DOWNLOADEDFROM);
	m_sDownloaded.LoadString(IDS_UPDATE_DOWNLOADED);
	m_sDownloadCompleted.LoadString(IDS_UPDATE_DOWNLOADCOMPLETE);
	m_sDownloadReady.LoadString(IDS_UPDATE_DOWNLOADREADY);
	m_sDownloadError.LoadString(IDS_UPDATE_DOWNLOADERROR);
	m_sError404.LoadString(IDS_UPDATE_404ERROR);
	m_sError403.LoadString(IDS_UPDATE_403ERROR);
	m_sError407.LoadString(IDS_UPDATE_407ERROR);
	m_sNotSupportRange.LoadString(IDS_UPDATE_NOTSUPPORTEDRANGE);
	m_sDownloadErrorStatus.LoadString(IDS_UPDATE_DOWNLOADERRORSTATUS);
	m_sIncorrectChecksum.LoadString(IDS_UPDATE_INCORRECTMD5);
	m_sNewVersionAvailable.LoadString(IDS_UPDATE_NEWVERSIONAVAILABLE);
	m_sHaveLatestVersion.LoadString(IDS_UPDATE_HAVELATESTVERSION);
	m_sLogoCaption.LoadString(IDS_ABOUT_LOGOCAPTION);

	// check FBE update
	CheckUpdate();

	return 0;
}

LRESULT CAboutDlg::OnCloseCmd(WORD, WORD wID, HWND, BOOL&)
{
	DeleteAllDownload();
	EndDialog(wID);
	return 0;
}

LRESULT CAboutDlg::OnCtlColor(UINT, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	HWND hwndEdit = (HWND) lParam;
	if (hwndEdit == GetDlgItem(IDC_CONTRIBS))
	{
		HDC hdc = (HDC)wParam;
		::SetBkColor(hdc, RGB(255,255,255));
		return (LRESULT) ::GetStockObject(WHITE_BRUSH);
	}
	return 0;
}

LRESULT CAboutDlg::OnNMClickSyslinkAbLinks(int /*idCtrl*/, LPNMHDR pNMHDR, BOOL&)
{
	PNMLINK pNMLink = (PNMLINK)pNMHDR;
	CString args;

	args.Format(L"url.dll, FileProtocolHandler %s", pNMLink->item.szUrl);
	ShellExecute(NULL, L"open", L"rundll32.exe", args, NULL, SW_SHOW);

	return 0;
}

void CAboutDlg::CheckUpdate()
{
    DeleteAllDownload();
    SetDlgItemText(IDC_TEXT_STATUS, m_sCheckingUpdate);
    
	HTTP_SEND_HEADER ht = PrepareHeader(L"http://fictionbookeditor.googlecode.com/svn/trunk/update.xml");
	
	m_UpdateReady = false;
	m_UpdateURL = L"";
	m_UpdateMD5 = L"";

	// clear stringstream
	m_file.str("");

	int   nTaskID = AddDownload(ht);
    m_monitor.reset (new CDownloadMonitor(m_hWnd, nTaskID));
}

LRESULT CAboutDlg::OnUpdate(WORD, WORD wID, HWND, BOOL&)
{
	if (!m_UpdateURL.IsEmpty())
	{
		m_UpdateButton.ShowWindow(SW_HIDE);
		DeleteAllDownload();

		CString filename = GetUpdateFileName();
		if (ATLPath::FileExists(filename))
		{
			// calculate MD5 checksum
			char* p;
			ifstream inFile(filename.GetBuffer(), ios::in | ios::binary);
			inFile.seekg(0, ios::end);
			int nLength = inFile.tellg();
			if (nLength)
			{
				CString readMD5;
				p = new char[nLength + 2];
				inFile.seekg(0, ios::beg);
				inFile.read (p, nLength);
				inFile.close();
				if (p)
				{
					readMD5 = FCCrypt::Get_MD5(p, nLength);
					delete[] p;
				}
				// if checksums are equal
				if (readMD5.CompareNoCase (m_UpdateMD5) == 0)
					if (U::MessageBox(MB_YESNO | MB_ICONEXCLAMATION, IDR_MAINFRAME, IDS_UPDATEEXISTS, filename) == IDYES)
					{
						RunUpdate(filename);
					}
			}
		}

		SetDlgItemText(IDC_TEXT_STATUS, m_sConnecting);
		
		HTTP_SEND_HEADER ht = PrepareHeader(m_UpdateURL);

		// clear stringstream
		m_file.str("");

		m_TotalDownloadSize = 0;
		int   nTaskID = AddDownload(ht);
		m_monitor.reset (new CDownloadMonitor(m_hWnd, nTaskID));
	}
	return 0L;
}

void CAboutDlg::OnAfterDownloadConnected (FCHttpDownload* pTask)
{
    const HTTP_RESPONSE_INFO   & resp = pTask->GetResponseInfo();

    if (resp.m_status_code == 0)
    {
        SetDlgItemText (IDC_TEXT_STATUS, m_sCantConnect);
        DeleteDownload (pTask->GetTaskID());
		m_UpdatePict.SetBitmap(m_StatusBitmaps[2]);
        return;
    }

#ifdef DOWNLOAD_STATISTIC
    // total length
    CString   totalLength(L"Unknow");
    int   nTotal = resp.m_content_length;
    if (nTotal)
    {
        totalLength.Format(L"%d Kb", (int)nTotal/1024.0);
    }
#endif
}

void CAboutDlg::AcceptReceivedData (FCHttpDownload* pTask)
{
    BYTE *p;
    int n;

    pTask->PopReceived(p, n);
    if (p)
    {
		m_file.write ((const char*) p, n);
        delete[] p;
		m_TotalDownloadSize += n;
    }
}

LRESULT CAboutDlg::OnUpdateProgressUI (UINT, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
    if (!m_monitor.get())
        return 0;

    FCHttpDownload *p = FindDownload((int)wParam);
    if (!p)
    {
        m_monitor.reset();
        return 0;
    }

	if (m_AnimIdx >= ANIM_SIZE) m_AnimIdx = 0;
	m_UpdatePict.SetBitmap(m_AnimBitmaps[m_AnimIdx++]);

    AcceptReceivedData(p);

	// show percent only for update download
	if (m_UpdateReady)
	{
		CString currPercent,currSpeed,avgSpeed;
		// download
		int nDownload = p->GetDownloadByte();
		int nTotal = p->GetResponseInfo().m_content_length;
		if (nTotal)
		{
			int   nPercent = (int)(100 * (INT64)nDownload / nTotal);
			currPercent.Format(m_sDownloadedFrom, (int)ceil(nDownload/1024.0), (int)ceil(nTotal/1024.0), nPercent);
		}
		else
		{
			currPercent.Format(m_sDownloaded, (int)ceil(nDownload/1024.0));
		}
		SetDlgItemText (IDC_TEXT_STATUS, currPercent);
	}
	
#ifdef DOWNLOAD_STATISTIC
    // current speed
    currSpeed.Format(L"%d Kb / S", (int)ceil(p->GetCurrentSpeed()/1024.0));
    // average speed
    avgSpeed.Format(L"%d Kb / S", (int)ceil(p->GetAverageSpeed()/1024.0));
#endif
    return 0;
}

void CAboutDlg::FinishUpdateStatus (FCHttpDownload* pTask)
{
	bool bStatus = false;
    const HTTP_RESPONSE_INFO   & resp = pTask->GetResponseInfo();
	int nDownload = m_file.tellp();

    CString s = m_sDownloadError;
    switch (resp.m_status_code)
    {
         case HTTP_STATUS_OK :
         case HTTP_STATUS_PARTIAL_CONTENT :
             if (resp.m_content_length)
             {
				 if (resp.m_content_length == nDownload) bStatus = true;
             }
             else
             {
                 if (resp.m_final_read_result) bStatus = true;
             }

             // range request
             if (pTask->GetSendHeader().m_start && (resp.m_status_code == HTTP_STATUS_OK))
             {
                 s += m_sNotSupportRange;
             }
             break;

        case HTTP_STATUS_NOT_FOUND :
            s = m_sError404;
            break;

        case HTTP_STATUS_FORBIDDEN :
            s = m_sError403; 
            break;

        case HTTP_STATUS_PROXY_AUTH_REQ :
            s = m_sError407;
            break;

        default :
			s.Format(m_sDownloadErrorStatus, resp.m_status_code);
            break;
    }

    // calculate MD5 checksum
	if (bStatus)
	{
		char* p;
		int nLength = m_file.tellp();
		if (nLength)
		{
			p = new char[nLength + 2];
			m_file.read (p, nLength);
			if (p)
			{
				m_DownloadedMD5 = FCCrypt::Get_MD5(p, nLength);
				delete[] p;
			}
		}
	}
	else 
	{
		m_UpdatePict.SetBitmap(m_StatusBitmaps[2]);
		SetDlgItemText (IDC_TEXT_STATUS, s);
	}
}

void CAboutDlg::OnAfterDownloadFinish (FCHttpDownload* pTask)
{
	BOOL b;
    OnUpdateProgressUI (0, (WPARAM)pTask->GetTaskID(), 0, b);

    FinishUpdateStatus (pTask);

	// process XML update file
	if ((WPARAM)pTask->GetURL().Right(3).CompareNoCase(L"XML")==0)
	{
		MSXML2::IXMLDOMDocument2Ptr xmlDoc(U::CreateDocument(false));
		_bstr_t str(m_file.str().c_str());
		if (xmlDoc->loadXML(str))
		{
			MSXML2::IXMLDOMElementPtr root = xmlDoc->GetdocumentElement();
			if (root)
			{
				// check update date
				MSXML2::IXMLDOMNodePtr node = root->selectSingleNode(L"Date");
				if (node)
				{
					COleDateTime updateDate, buildDate;
					updateDate.ParseDateTime(CString(node->lastChild->nodeValue), VAR_DATEVALUEONLY, 1033); 
					buildDate.ParseDateTime(CString(build_timestamp), VAR_DATEVALUEONLY, 1033);
					if (updateDate > buildDate)
					{
						m_UpdateReady = true;
						node = root->selectSingleNode(L"DownloadUrl");
						if (node) m_UpdateURL = node->lastChild->nodeValue;
						node = root->selectSingleNode(L"MD5");
						if (node) m_UpdateMD5 = node->lastChild->nodeValue;
					    
						SetDlgItemText (IDC_TEXT_STATUS, m_sNewVersionAvailable);
						m_UpdatePict.SetBitmap(m_StatusBitmaps[1]);
						m_UpdateButton.ShowWindow(SW_SHOW);
					}
					else 
					{
						SetDlgItemText (IDC_TEXT_STATUS, m_sHaveLatestVersion);
						m_UpdatePict.SetBitmap(m_StatusBitmaps[0]);
					}
				}
			}
		}
	}
	// else process downloaded executable
	else
	{
		if (m_DownloadedMD5.CompareNoCase(m_UpdateMD5) == 0)
		try
		{
			SetDlgItemText (IDC_TEXT_STATUS, m_sDownloadCompleted);
			m_UpdatePict.SetBitmap(m_StatusBitmaps[0]);
			DeleteAllDownload();

			// save memory stream to the file
			CString filename = GetUpdateFileName();
			ofstream outFile(filename.GetBuffer(), ios::out | ios::binary);
			outFile << m_file.str();
			outFile.close();
			SetDlgItemText (IDC_TEXT_STATUS, m_sDownloadReady);

			// run new installation
			RunUpdate(filename);
		}
		catch (...)
		{
		}
		// wrong checksum
		else
		{
			m_UpdatePict.SetBitmap(m_StatusBitmaps[2]);
			SetDlgItemText (IDC_TEXT_STATUS, m_sIncorrectChecksum);
		}
	}
}

HTTP_SEND_HEADER CAboutDlg::PrepareHeader(const CString url)
{
	HTTP_SEND_HEADER ht;
    ht.m_url = url;
    ht.m_user_agent = L"Mozilla/4.0";
    ht.m_start = 0;
    ht.m_header = L"";
/*  ht.m_proxy_ip = DlgSetProxy::s_task.m_proxy_ip;
    ht.m_proxy_port = DlgSetProxy::s_task.m_proxy_port;
    ht.m_proxy_username = DlgSetProxy::s_task.m_proxy_username;
    ht.m_proxy_password = DlgSetProxy::s_task.m_proxy_password; */
	return ht;
}

LRESULT CAboutDlg::OnGetMinMaxInfo(UINT, WPARAM, LPARAM lParam, BOOL&)
{
	if (!m_bAllowResize)
	{
		RECT rect;
		GetWindowRect(&rect);
		LPMINMAXINFO pMMI = (LPMINMAXINFO)lParam;
		pMMI->ptMaxTrackSize.x = rect.right - rect.left;
		pMMI->ptMaxTrackSize.y = rect.bottom - rect.top;
		pMMI->ptMinTrackSize.x = rect.right - rect.left;
		pMMI->ptMinTrackSize.y = rect.bottom - rect.top;
	}
	return TRUE;
}

LRESULT CAboutDlg::OnSize(UINT, WPARAM, LPARAM, BOOL&)
{
	if (m_bAllowResize)
	{
		RECT rect;
		GetClientRect(&rect);
		m_glLogo.SetWindowPos(0, &rect, 0);
	}
	return FALSE;
}

LRESULT CAboutDlg::OnResizeOpenGLWindow(UINT, WPARAM, LPARAM, BOOL&)
{
	CButton btn = GetDlgItem(IDOK);
	// switch glLogo to full client area
	if (btn.IsWindowVisible())
	{
		// hide controls
		btn.ShowWindow(SW_HIDE);
		btn.EnableWindow(FALSE);

		m_SaveBtnState = GetDlgItem(IDC_UPDATE).IsWindowVisible();
		if (m_SaveBtnState)
		{
			GetDlgItem(IDC_UPDATE).ShowWindow(SW_HIDE);
			GetDlgItem(IDC_UPDATE).EnableWindow(FALSE);
		}

		GetDlgItem(IDC_PIC_UPDATE).ShowWindow(SW_HIDE);
		GetDlgItem(IDC_TEXT_STATUS).ShowWindow(SW_HIDE);
		GetDlgItem(IDC_CONTRIBS).ShowWindow(SW_HIDE);
		GetDlgItem(IDC_STATIC_AB_APPICON).ShowWindow(SW_HIDE);
		GetDlgItem(IDC_STATIC_AB_APPNAMEVER).ShowWindow(SW_HIDE);
		GetDlgItem(IDC_BUILDSTAMP).ShowWindow(SW_HIDE);
		GetDlgItem(IDC_SYSLINK_AB_LINKS).ShowWindow(SW_HIDE);
		GetDlgItem(IDC_STATIC_BUILD).ShowWindow(SW_HIDE);

		// save dialog size & position
		GetWindowRect(&m_SaveRect);

		// save control size & position
		m_glLogo.GetWindowRect(&m_LogoRect);
		ScreenToClient(&m_LogoRect);

		RECT rect;
		GetClientRect(&rect);
		m_glLogo.SetWindowPos(0, &rect, 0);
		m_glLogo.SetFocus();

		GetWindowText (m_AboutCaption);
		SetWindowText (m_sLogoCaption);
		ModifyStyle(0, WS_MAXIMIZEBOX, SWP_FRAMECHANGED);
		UpdateWindow();

		m_bAllowResize = true;
	}
	else
	{
		// restore dialog size and position
		SetWindowPos(0, &m_SaveRect, 0);

		m_glLogo.SetWindowPos(0, &m_LogoRect, 0);

		btn.ShowWindow(SW_SHOW);
		btn.EnableWindow(TRUE);

		if (m_SaveBtnState)
		{
			GetDlgItem(IDC_UPDATE).ShowWindow(SW_SHOW);
			GetDlgItem(IDC_UPDATE).EnableWindow(TRUE);
		}

		GetDlgItem(IDC_PIC_UPDATE).ShowWindow(SW_SHOW);
		GetDlgItem(IDC_TEXT_STATUS).ShowWindow(SW_SHOW);
		GetDlgItem(IDC_CONTRIBS).ShowWindow(SW_SHOW);
		GetDlgItem(IDC_STATIC_AB_APPICON).ShowWindow(SW_SHOW);
		GetDlgItem(IDC_STATIC_AB_APPNAMEVER).ShowWindow(SW_SHOW);
		GetDlgItem(IDC_BUILDSTAMP).ShowWindow(SW_SHOW);
		GetDlgItem(IDC_SYSLINK_AB_LINKS).ShowWindow(SW_SHOW);
		GetDlgItem(IDC_STATIC_BUILD).ShowWindow(SW_SHOW);

		SetWindowText (m_AboutCaption);
		ModifyStyle(WS_MAXIMIZEBOX, 0, SWP_FRAMECHANGED);

		m_bAllowResize = false;
	}
	return TRUE;
}

CString CAboutDlg::GetUpdateFileName()
{
	wchar_t tempDir[1024];
	GetTempPath(sizeof(tempDir)/sizeof(TCHAR), &tempDir[0]);
	CString filename (ATLPath::FindFileName(m_UpdateURL));
	return tempDir+U::URLDecode(filename);
}

void CAboutDlg::RunUpdate(CString filename)
{
	if (U::MessageBox(MB_YESNO | MB_ICONEXCLAMATION, IDR_MAINFRAME, IDS_UPDATE_CLOSE, filename) == IDYES)
	{
		HINSTANCE hInst = ShellExecute(0, L"open", filename, 0, 0, SW_SHOW);
		::PostMessage(GetParent().m_hWnd, WM_CLOSE, 0, 0);
	}
}
