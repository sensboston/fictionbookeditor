#include "stdafx.h"
#include "Utils.h"
#include "AboutBox.h"

LRESULT CAboutDlg::OnInitDialog(UINT, WPARAM, LPARAM, BOOL&)
{
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
    SetDlgItemText(IDC_TEXT_STATUS, L"Checking for update...");
    
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
		SetDlgItemText(IDC_TEXT_STATUS, L"Downloading update");
		
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
        SetDlgItemText (IDC_TEXT_STATUS, L"Can't connect to server");
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
			currPercent.Format(L"Downloaded %d Kb from %d Kb (%d%%)", (int)ceil(nDownload/1024.0), (int)ceil(nTotal/1024.0), nPercent);
		}
		else
		{
			currPercent.Format(L"Downloaded %d Kb", (int)ceil(nDownload/1024.0));
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

    CString s(L"Download error");
    switch (resp.m_status_code)
    {
         case HTTP_STATUS_OK :
         case HTTP_STATUS_PARTIAL_CONTENT :
             if (resp.m_content_length)
             {
				 if (resp.m_content_length == nDownload) 
				 {
					 s = L"Success";
					 bStatus = true;
				 }
             }
             else
             {
                 if (resp.m_final_read_result) 
				 {
					 s = L"Success";
					 bStatus = true;
				 }
             }

             // range request
             if (pTask->GetSendHeader().m_start && (resp.m_status_code == HTTP_STATUS_OK))
             {
                 s += L" ( not support range )";
             }
             break;

        case HTTP_STATUS_NOT_FOUND :
            s = L"404 error : Not Found";
            break;

        case HTTP_STATUS_FORBIDDEN :
            s = L"403 error : Forbidden";
            break;

        case HTTP_STATUS_PROXY_AUTH_REQ :
            s = L"407 error : proxy authentication required";
            break;

        default :
            {
                CString   tts;
                tts.Format(L"Download error, status code : %d", resp.m_status_code);
                s = tts;
            }
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

					    CString s(L"A new version of FBE is available.");
						SetDlgItemText (IDC_TEXT_STATUS, s);
						m_UpdatePict.SetBitmap(m_StatusBitmaps[1]);
						m_UpdateButton.ShowWindow(SW_SHOW);
					}
					else 
					{
					    CString s(L"You have a latest version of FBE.");
						SetDlgItemText (IDC_TEXT_STATUS, s);
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
			CString s(L"Download completed");
			SetDlgItemText (IDC_TEXT_STATUS, s);
			m_UpdatePict.SetBitmap(m_StatusBitmaps[0]);

			// save memory stream to the file
			wchar_t tempDir[1024];
			GetTempPath(sizeof(tempDir)/sizeof(TCHAR), &tempDir[0]);
			CString filename (ATLPath::FindFileName(m_UpdateURL));
			filename = tempDir+U::URLDecode(filename);
			ofstream outFile(filename.GetBuffer(), ios::out | ios::binary);
			outFile << m_file.str();
			outFile.close();


			MessageBox(s, L"Update", MB_OK | MB_ICONINFORMATION);
		}
		catch (...)
		{
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