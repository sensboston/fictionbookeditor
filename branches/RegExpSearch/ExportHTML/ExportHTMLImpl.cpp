#include "stdafx.h"
#include "resource.h"

#include "utils.h"
#include "FBE.h"

#include "ExportHTML.h"

class CCustomSaveDialog : public CFileDialogImpl<CCustomSaveDialog>
{
public:
  HWND	      m_hDlg;
  CString     m_template;
  bool	      m_includedesc;
  int	      m_tocdepth;

  CCustomSaveDialog(BOOL bOpenFileDialog, // TRUE for FileOpen, FALSE for FileSaveAs
    LPCTSTR lpszDefExt = NULL,
    LPCTSTR lpszFileName = NULL,
    DWORD dwFlags = OFN_HIDEREADONLY | OFN_OVERWRITEPROMPT,
    LPCTSTR lpszFilter = NULL,
    HWND hWndParent = NULL)
    : CFileDialogImpl<CCustomSaveDialog>(bOpenFileDialog, lpszDefExt, lpszFileName, dwFlags, lpszFilter, hWndParent),
      m_hDlg(NULL), m_includedesc(true), m_tocdepth(1)
  {
    m_ofn.lpTemplateName=MAKEINTRESOURCE(IDD_CUSTOMSAVEDLG);
  }

  BEGIN_MSG_MAP(CCustomSaveDialog)
    if (uMsg==WM_INITDIALOG)
      return OnInitDialog(hWnd,uMsg,wParam,lParam);

    MESSAGE_HANDLER(WM_SIZE,OnSize)

    COMMAND_ID_HANDLER(IDC_BROWSE,OnBrowse);

    CHAIN_MSG_MAP(CFileDialogImpl<CCustomSaveDialog>)
  END_MSG_MAP()

  LRESULT OnInitDialog(HWND hWnd,UINT msg,WPARAM wParam,LPARAM lParam) {
    // save window handles
    m_hDlg=hWnd;

    // read saved template name
    m_template=U::QuerySV(_Settings,_T("Template"),U::GetProgDirFile(_T("html.xsl")));
    ::SetDlgItemText(hWnd,IDC_TEMPLATE,m_template);
    m_includedesc=U::QueryIV(_Settings,_T("IncludeDesc"),1)!=0;
    ::SendDlgItemMessage(hWnd,IDC_DOCINFO,BM_SETCHECK,
      m_includedesc ? BST_CHECKED : BST_UNCHECKED,0);
    m_tocdepth=U::QueryIV(_Settings,_T("TOCDepth"),1);
    ::SetDlgItemInt(hWnd,IDC_TOCDEPTH,m_tocdepth,FALSE);
    return TRUE;
  }

  LRESULT OnSize(UINT uMsg,WPARAM wParam,LPARAM lParam,BOOL& bHandled) {
    // make combobox the same size as std controls
    RECT    rc_std,rc_my;
    HWND    hCB=::GetDlgItem(m_hDlg,IDC_TEMPLATE);
    ::GetWindowRect(hCB,&rc_my);
    ::GetWindowRect(GetFileDialogWindow().GetDlgItem(cmb1),&rc_std);
    POINT   pt={rc_my.left,rc_my.top};
    ::ScreenToClient(m_hDlg,&pt);
    ::MoveWindow(hCB,pt.x,pt.y,rc_std.right-rc_std.left,rc_my.bottom-rc_my.top,TRUE);
    hCB=::GetDlgItem(m_hDlg,IDC_BROWSE);
    ::GetWindowRect(hCB,&rc_my);
    ::MoveWindow(hCB,
      pt.x+rc_std.right-rc_std.left+10,pt.y,
      rc_my.right-rc_my.left,rc_my.bottom-rc_my.top,TRUE);

    return 0;
  }

  LRESULT OnBrowse(WORD, WORD, HWND, BOOL&) {
    CFileDialog	dlg(
      TRUE,
      _T("xsl"),
      NULL,
      OFN_HIDEREADONLY|OFN_PATHMUSTEXIST,
      _T("XSL Templates (*.xsl;*.xslt)\0*.xsl;*.xslt\0All files (*.*)\0*.*\0\0")
    );

    if (dlg.DoModal(*this)==IDOK)
      ::SetDlgItemText(m_hDlg,IDC_TEMPLATE,dlg.m_szFileName);

    return 0;
  }

  BOOL OnFileOK(LPOFNOTIFY on) {
    m_template=U::GetWindowText(::GetDlgItem(m_hDlg,IDC_TEMPLATE));
    _Settings.SetStringValue(_T("Template"),m_template);
    m_includedesc=::SendDlgItemMessage(m_hDlg,IDC_DOCINFO,BM_GETCHECK,0,0)==BST_CHECKED;
    _Settings.SetDWORDValue(_T("IncludeDesc"),m_includedesc);
    m_tocdepth=::GetDlgItemInt(m_hDlg,IDC_TOCDEPTH,NULL,FALSE);
    if (m_tocdepth<0)
      m_tocdepth=0;
    if (m_tocdepth>10)
      m_tocdepth=10;
    _Settings.SetDWORDValue(_T("TOCDepth"),m_tocdepth);
    return TRUE;
  }
};

HRESULT	ExportHTMLPlugin::Export(long hWnd,BSTR filename,IDispatch *doc) {
  HANDLE  hOut=INVALID_HANDLE_VALUE;

  try {
    // * construct doc pointer
    MSXML2::IXMLDOMDocument2Ptr	    source(doc);

    // * ask the user where he wants his html
    CCustomSaveDialog	    dlg(FALSE,_T("html"),filename,
      OFN_HIDEREADONLY|OFN_NOREADONLYRETURN|OFN_OVERWRITEPROMPT|OFN_ENABLETEMPLATE,
      _T("Web Page, complete (*.html;*.htm)\0*.htm;*.html\0")
      _T("Web Archive, single file (*.mht)\0*.mht\0")
      _T("Web Page, HTML only (*.html;*.htm)\0*.htm;*.html\0")
    );
    dlg.m_ofn.nFilterIndex=1;
    if (dlg.DoModal((HWND)hWnd)!=IDOK)
      return S_FALSE;

    // * load template
    MSXML2::IXMLDOMDocument2Ptr	    tdoc(U::CreateDocument(true));
    if (!U::LoadXml(tdoc,dlg.m_template))
      return S_FALSE;
    MSXML2::IXSLTemplatePtr	    tmpl(U::CreateTemplate());
    tmpl->stylesheet=tdoc;

    // * create processor
    MSXML2::IXSLProcessorPtr	    proc(tmpl->createProcessor());

    // * setup input
    proc->input=doc;

    // * install template parameters
    proc->addParameter(L"includedesc",dlg.m_includedesc,_bstr_t());
    proc->addParameter(L"tocdepth",(long)dlg.m_tocdepth,_bstr_t());

    bool    fImages=dlg.m_ofn.nFilterIndex<=2;
    bool    fMIME=dlg.m_ofn.nFilterIndex==2;

    CString dfile(dlg.m_szFileName);

    // * open the file
    hOut=::CreateFile(dlg.m_szFileName,GENERIC_WRITE,0,NULL,CREATE_ALWAYS,0,NULL);
    if (hOut==INVALID_HANDLE_VALUE) {
      U::MessageBox(MB_OK|MB_ICONERROR,_T("Export HTML"),_T("Can't open %s: %s"),
	dlg.m_szFileName,(const TCHAR *)U::Win32ErrMsg(::GetLastError()));
      return S_FALSE;
    }

    // * construct images directory
    int	  cp=dfile.ReverseFind(_T('.'));
    if (cp>=0)
      dfile.Delete(cp,dfile.GetLength()-cp);
    dfile+=_T("_files");
    if (fImages) {
      // construct a relative path
      CString	relpath(dfile);
      cp=relpath.ReverseFind(_T('\\'));
      if (cp>=0)
	relpath.Delete(0,cp+1);

      // see if it is ascii only
      bool fAscii=true;
      for (int i=0;i<relpath.GetLength();++i)
	if (relpath[i]<32 || relpath[i]>127) {
	  fAscii=false;
	  break;
	}

      if (fAscii && !fMIME) {
	relpath+=_T('/');
	proc->addParameter(L"imgprefix",(const TCHAR *)relpath,_bstr_t());

	if (!::CreateDirectory(dfile,NULL) && ::GetLastError()!=ERROR_ALREADY_EXISTS) {
	  DWORD	de=::GetLastError();
	  CloseHandle(hOut);
	  ::DeleteFile(dlg.m_szFileName);
	  U::MessageBox(MB_OK|MB_ICONERROR,_T("Export HTML"),_T("Can't create directory %s: %s"),
	    (const TCHAR *)dfile,(const TCHAR *)U::Win32ErrMsg(de));
	  return S_FALSE;
	}
      } else
	dfile.Delete(cp,dfile.GetLength()-cp);

      proc->addParameter(L"saveimages",true,_bstr_t());
    }

    char    boundary[256];

    // * write relevant MIME headers
    if (fMIME) {
      // format date
      char  date[256]; time_t  tt; time(&tt);
      strftime(date,sizeof(date),"%a, %d %b %Y %H:%M:%S +0000",gmtime(&tt));

      // construct some random mime boundary
      _snprintf(boundary,sizeof(boundary),"------NextPart---%08X.%08X",tt,rand());

      // construct mime header
      char  mime_hdr[2048];
      _snprintf(mime_hdr,sizeof(mime_hdr),
	"From: <Saved by Haali ExportHTML Plugin>\r\n"
	"Date: %s\r\n" // Thu, 17 Apr 2003 07:34:30 +0400
	"MIME-Version: 1.0\r\n"
	"Content-Type: multipart/related; boundary=\"%s\"; type=\"text/html\"\r\n"
	"\r\n"
	"This is a multi-part message in MIME format.\r\n"
	"\r\n"
	"%s\r\n"
	"Content-Type: text/html; charset=\"utf-8\"\r\n"
	"Content-Transfer-Encoding: 8bit\r\n"
	"\r\n",
	date,boundary+2,boundary);

      DWORD   len=strlen(mime_hdr);
      DWORD   nw;
      BOOL    fWr=WriteFile(hOut,mime_hdr,len,&nw,NULL);
      if (!fWr || nw!=len) {
	if (!fWr)
	  U::MessageBox(MB_OK|MB_ICONERROR,
	    _T("Export HTML"),_T("Can't write to %s: %s"),
	    dlg.m_szFileName,(const TCHAR *)U::Win32ErrMsg(::GetLastError()));
	else
	  U::MessageBox(MB_OK|MB_ICONERROR,_T("Export HTML"),_T("Can't write to %s: short write."),
	    dlg.m_szFileName);
	::CloseHandle(hOut);
	::DeleteFile(dlg.m_szFileName);
	return S_FALSE;
      }
    }

    // * transform
    proc->output=(IUnknown*)U::NewStream(hOut,!fMIME);
    proc->transform();

    // * save images
    if (fImages) {
      if (dfile.IsEmpty() || dfile[dfile.GetLength()-1]!=_T('\\'))
	dfile+=_T('\\');
      MSXML2::IXMLDOMNodeListPtr      bins(source->selectNodes(L"/fb:FictionBook/fb:binary"));
      for (long l=0;l<bins->length;++l) {
	try {
	  MSXML2::IXMLDOMElementPtr   be(bins->item[l]);
	  _variant_t	id(be->getAttribute(L"id"));
	  _variant_t	ct(be->getAttribute(L"content-type"));
	  if (V_VT(&id)!=VT_BSTR || V_VT(&ct)!=VT_BSTR)
	    continue;

	  if (fMIME) {
	    // get base64 data
	    _bstr_t   data(be->text);

	    // allocate buffer
	    char      *buffer=(char*)malloc(data.length()+1024);
	    if (buffer==NULL)
	      continue;

	    // construct a MIME header
	    _snprintf(buffer,1024,
	      "\r\n"
	      "%s\r\n"
	      "Content-Type: %S\r\n"
	      "Content-Transfer-Encoding: base64\r\n"
	      "Content-Location: %S\r\n"
	      "\r\n",
	      boundary,V_BSTR(&ct),V_BSTR(&id));
	    DWORD     hlen=strlen(buffer);

	    // convert data to ascii
	    DWORD     mlen=WideCharToMultiByte(CP_ACP,0,
	      data,data.length(),
	      buffer+hlen,data.length(),
	      NULL,NULL);

	    // write a new mime header+data
	    DWORD   nw;
	    BOOL    fWr=WriteFile(hOut,buffer,hlen+mlen,&nw,NULL);
	    DWORD   de=::GetLastError();
	    free(buffer);

	    if (!fWr || nw!=hlen+mlen) {
	      if (!fWr)
		U::MessageBox(MB_OK|MB_ICONERROR,
		  _T("Export HTML"),_T("Can't write to %s: %s"),
		  dlg.m_szFileName,(const TCHAR *)U::Win32ErrMsg(de));
	      else
		U::MessageBox(MB_OK|MB_ICONERROR,_T("Export HTML"),_T("Can't write to %s: short write."),
		  dlg.m_szFileName);
	      ::CloseHandle(hOut);
	      ::DeleteFile(dlg.m_szFileName);
	      return S_FALSE;
	    }
	  } else {
	    be->PutdataType(L"bin.base64");
	    _variant_t	data(be->nodeTypedValue);
	    if (V_VT(&data)!=(VT_ARRAY|VT_UI1) || ::SafeArrayGetDim(V_ARRAY(&data))!=1)
	      continue;
	    DWORD len=V_ARRAY(&data)->rgsabound[0].cElements;
	    void	*buffer;
	    ::SafeArrayAccessData(V_ARRAY(&data),&buffer);
	    CString fname(dfile);
	    fname+=V_BSTR(&id);
	    HANDLE hFile=::CreateFile(fname,GENERIC_WRITE,0,NULL,CREATE_NEW,0,NULL);
	    if (hFile==INVALID_HANDLE_VALUE && ::GetLastError()==ERROR_FILE_EXISTS) {
	      if (U::MessageBox(MB_YESNO|MB_ICONEXCLAMATION,_T("Export HTML"),
		  _T("%s already exists.\nDo you want to replace it?"),
		  (const TCHAR *)fname)!=IDYES)
		goto skip;
	      hFile=::CreateFile(fname,GENERIC_WRITE,0,NULL,CREATE_ALWAYS,0,NULL);
	    }
	    if (hFile!=INVALID_HANDLE_VALUE) {
	      DWORD wr;
	      BOOL fWr=::WriteFile(hFile,buffer,len,&wr,NULL);
	      DWORD de=::GetLastError();
	      ::CloseHandle(hFile);
	      if (!fWr || wr!=len) {
		if (!fWr)
		  U::MessageBox(MB_OK|MB_ICONERROR,_T("Export HTML"),_T("Can't write to %s: %s"),
		    (const TCHAR *)fname,(const TCHAR *)U::Win32ErrMsg(de));
		else
		  U::MessageBox(MB_OK|MB_ICONERROR,_T("Export HTML"),_T("Can't write to %s: short write."),
		    (const TCHAR *)fname);
		::DeleteFile(fname);
	      }
	    } else {
	      U::MessageBox(MB_OK|MB_ICONERROR,_T("Export HTML"),_T("Can't open %s: %s"),
		(const TCHAR *)fname,(const TCHAR *)U::Win32ErrMsg(::GetLastError()));
	    }
  skip:
	    ::SafeArrayUnaccessData(V_ARRAY(&data));
	  }
	}
	catch (_com_error&) { }
      }
    }

    // * write a final mime boundary
    if (fMIME) {
      char    mime_tmp[256];
      _snprintf(mime_tmp,sizeof(mime_tmp),"\r\n%s\r\n",boundary);
      DWORD   len=strlen(mime_tmp);
      DWORD   nw;
      BOOL    fWr=WriteFile(hOut,mime_tmp,len,&nw,NULL);
      if (!fWr || nw!=len) {
	if (!fWr)
	  U::MessageBox(MB_OK|MB_ICONERROR,
	    _T("Export HTML"),_T("Can't write to %s: %s"),
	    dlg.m_szFileName,(const TCHAR *)U::Win32ErrMsg(::GetLastError()));
	else
	  U::MessageBox(MB_OK|MB_ICONERROR,_T("Export HTML"),_T("Can't write to %s: short write."),
	    dlg.m_szFileName);
	::CloseHandle(hOut);
	::DeleteFile(dlg.m_szFileName);
	return S_FALSE;
      }
      ::CloseHandle(hOut);
    }
  }
  catch (_com_error& e) {
    if (hOut!=INVALID_HANDLE_VALUE)
      CloseHandle(hOut);
    U::ReportError(e);
    return S_FALSE;
  }
  return S_OK;
}