#ifndef UTILS_H
#define UTILS_H

#include <deque>

namespace U // place all utilities into their own namespace
{
	struct ElTextHTML
	{
		CString html;
		CString text;

		ElTextHTML(BSTR html, BSTR text)
		{
			this->html = html;
			this->text = text;
		}
	};

	void InitKeycodes();

	void ChangeAttribute(MSHTML::IHTMLElementPtr elem,
		const wchar_t* attrib,
		const wchar_t* value,
		MSHTML::IMarkupServicesPtr mk_srv);

  // loading data into array
  HRESULT   LoadFile(const TCHAR *filename, VARIANT *vt);

  // a generic stream
  class HandleStreamImpl: public CComObjectRoot, public IStream {
  private:
    HANDLE    m_handle;
    bool      m_close;

  public:
    typedef IStream Interface;

    HandleStreamImpl() : m_handle(INVALID_HANDLE_VALUE), m_close(true) { }
    virtual ~HandleStreamImpl() { if (m_close) CloseHandle(m_handle); }

    void  SetHandle(HANDLE hf,bool cl=true) { m_handle=hf; m_close=cl; }

    BEGIN_COM_MAP(HandleStreamImpl)
      COM_INTERFACE_ENTRY(ISequentialStream)
      COM_INTERFACE_ENTRY(IStream)
    END_COM_MAP()

    // ISequentialStream
    STDMETHOD(Read)(void *pv,ULONG cb,ULONG *pcbRead) {
      DWORD   nrd;
      if (ReadFile(m_handle,pv,cb,&nrd,NULL)) {
	*pcbRead=nrd;
	return S_OK;
      }
      if (GetLastError()==ERROR_BROKEN_PIPE) { // treat as eof
	*pcbRead=0;
	return S_OK;
      }
      return HRESULT_FROM_WIN32(GetLastError());
    }
    STDMETHOD(Write)(const void *pv,ULONG cb,ULONG *pcbWr) {
      DWORD   nwr;
      if (WriteFile(m_handle,pv,cb,&nwr,NULL)) {
	*pcbWr=nwr;
	return S_OK;
      }
      return HRESULT_FROM_WIN32(GetLastError());
    }

    // IStream
    STDMETHOD(Seek)(LARGE_INTEGER,DWORD,ULARGE_INTEGER*) { return E_NOTIMPL; }
    STDMETHOD(SetSize)(ULARGE_INTEGER) { return E_NOTIMPL; }
    STDMETHOD(CopyTo)(IStream*,ULARGE_INTEGER,ULARGE_INTEGER*,ULARGE_INTEGER*) { return E_NOTIMPL; }
    STDMETHOD(Commit)(DWORD) { return E_NOTIMPL; }
    STDMETHOD(Revert)() { return E_NOTIMPL; }
    STDMETHOD(LockRegion)(ULARGE_INTEGER,ULARGE_INTEGER,DWORD) { return E_NOTIMPL; }
    STDMETHOD(UnlockRegion)(ULARGE_INTEGER,ULARGE_INTEGER,DWORD) { return E_NOTIMPL; }
    STDMETHOD(Stat)(STATSTG*,DWORD) { return E_NOTIMPL; }
    STDMETHOD(Clone)(IStream**) { return E_NOTIMPL; }
  };

  typedef CComObject<HandleStreamImpl>	  HandleStream;
  typedef CComPtr<HandleStream>		  HandleStreamPtr;
  HandleStreamPtr			  NewStream(HANDLE& hf,bool fClose=true);

  // strings
  int		scmp(const wchar_t *s1,const wchar_t *s2);
  CString	GetMimeType(const CString& filename);
  bool		GetImageDimsByPath(const wchar_t* pszFileName, int* nWidth, int* nHeight);
  bool		GetImageDimsByData(SAFEARRAY* data, ULONG length, int* nWidth, int* nHeight);
  bool		is_whitespace(const wchar_t *spc);
  void		NormalizeInplace(CString& s);
  void		RemoveSpaces(wchar_t *zstr);
  extern inline CString	Normalize(const CString& s) { CString p(s); NormalizeInplace(p); return p; }
  CString	GetFileTitle(const TCHAR *filename);
  extern inline void	StrAppend(CString& s1,const CString& s2) {
    if (!s2.IsEmpty()) {
      s1+=_T(' ');
      s1+=s2;
    }
  }
  CString	UrlFromPath(const CString& path);

  // settings in the registry
  CString	QuerySV(HKEY hKey,const TCHAR *name,const TCHAR *def=NULL);
  DWORD		QueryIV(HKEY hKey,const TCHAR *name,DWORD defval=0);

  template <class T>
  T QueryBV(HKEY hKey, const TCHAR* name, T def)
  {
	  BYTE* buff = new BYTE[sizeof(T)];
	  ZeroMemory(buff, sizeof(T));
	  DWORD type = REG_BINARY;
	  DWORD len = 0;

	  if(::RegQueryValueEx(hKey, name, NULL, &type, NULL, &len ) != ERROR_SUCCESS || (type != REG_BINARY))
		  return def;
	  if(::RegQueryValueEx(hKey,name, NULL, &type, buff, &len) != ERROR_SUCCESS)
		  return def;

	  T ret;
	  ZeroMemory(&ret, sizeof(T));
	  CopyMemory(&ret, buff, sizeof(T));
	  delete[] buff;

	  return ret;
  }
  void		InitSettings();
  void		InitSettingsHotkeyGroups();
/*  extern inline DWORD	GetSettingI(const TCHAR *name,DWORD defval=0) {
    return U::QueryIV(_Settings,name,defval);
  }

  extern inline CString	GetSettingS(const TCHAR *name,const TCHAR *def=NULL) {
    return U::QuerySV(_Settings,name,def);
  }*/

  // windows api
  HFONT	  CreatePtFont(int sizept,const TCHAR *facename,bool fBold=false,bool fItalic=false);
  CString GetFullPathName(const CString& filename);
  CString Win32ErrMsg(DWORD code);
  CString GetWindowText(HWND hWnd);
  void	  ReportError(HRESULT hr);
  void	  ReportError(_com_error& e);
  UINT	  MessageBox(UINT type,const TCHAR *title,const TCHAR *msg,...);
  CString GetProgDir();
  CString GetSettingsDir();
  CString GetDocTReeScriptsDir();
  CString GetProgDirFile(const CString& filename);
  CString GetCBString(HWND hCB,int idx);
  bool    HasSubFolders(const CString);
  bool    HasFilesWithExt(const CString, const TCHAR*);
  bool    HasScriptsEndpoint(const CString, TCHAR*);
  bool    CheckScriptsVersion(const wchar_t*);
  CString GetResString(int StringID);
  WORD    StringToKeycode(CString);
  WORD    VKToFVirt(WORD);
  CString KeycodeToString(WORD);
  CString AccelToString(ACCEL);

  // unicode char names (win2k/xp only)
  CString GetCharName(int ch);

  // msxml support
  MSXML2::IXMLDOMDocument2Ptr CreateDocument(bool fFreeThreaded=false);
  void ReportParseError(MSXML2::IXMLDOMDocument2Ptr doc);
  bool LoadXml(MSXML2::IXMLDOMDocument2Ptr doc, const CString& url);
  MSXML2::IXSLTemplatePtr     CreateTemplate();

  void SaveFileSelectedPos(const CString& filename, int pos);
  int GetFileSelectedPos(const CString& filename);

  // HTML-XML DOM path;
	class DomPath
	{
	private:
		std::deque<int> m_path;
		
	public:
		DomPath(){};
		~DomPath(){};
		bool CreatePathFromHTMLDOM(MSHTML::IHTMLDOMNodePtr root, MSHTML::IHTMLDOMNodePtr EndNode);
		bool CreatePathFromXMLDOM(MSXML2::IXMLDOMNodePtr root, MSXML2::IXMLDOMNodePtr EndNode);
		bool CreatePathFromText(const wchar_t* xml, int pos, int* char_pos);		

		MSXML2::IXMLDOMNodePtr GetNodeFromXMLDOM(MSXML2::IXMLDOMNodePtr root);
		MSHTML::IHTMLDOMNodePtr GetNodeFromHTMLDOM(MSHTML::IHTMLDOMNodePtr root);
		MSHTML::IHTMLDOMNodePtr FindSelectedNodeInXMLDOM(MSXML2::IXMLDOMNodePtr root);	
		int GetNodeFromText(wchar_t* xml, int char_pos);

		operator bstr_t()
		{
			bstr_t ret;
			for(unsigned int i = 0; i < m_path.size(); ++i)
			{
				wchar_t numb[10];
				wsprintf(numb, L"%d", m_path[i]);
				ret = ret + numb + L"/";
			}
			return ret;
		}


	private:
		bool CPFT(const wchar_t* xml, int pos, int* char_pos);
		
	};

	bool tGetFirstXMLNodeParams(const wchar_t* xml, wchar_t** open_tag_begin, wchar_t** open_tag_end, wchar_t** close_tag_begin, wchar_t** close_tag_end);
	bool tFindCloseTag(wchar_t* start, wchar_t* tag_name, wchar_t** close_tag);
	MSHTML::IHTMLDOMNodePtr GetNodeFromPos(MSHTML::IHTMLElementPtr elem, int pos);	
	int CountTextNodeChars(wchar_t* NodeBegin, wchar_t* NodeEnd);

	bool IsParentElement(MSHTML::IHTMLDOMNodePtr elem, MSHTML::IHTMLDOMNodePtr parent);
	bool IsParentElement(MSXML2::IXMLDOMNodePtr elem, MSXML2::IXMLDOMNodePtr parent);

	MSHTML::IHTMLElementPtr	FindTitleNode(MSHTML::IHTMLDOMNodePtr elem);
	CString	FindTitle(MSHTML::IHTMLDOMNodePtr elem);
	CString GetImageFileName(MSHTML::IHTMLDOMNodePtr elem);
} // namespace

#endif
