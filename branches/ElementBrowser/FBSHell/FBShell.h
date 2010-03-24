#ifndef FBSHELL_H
#define FBSHELL_H

///////////////////////////////////////////////////////////
// Misc globals
extern const wchar_t 	*FBNS;
extern const wchar_t 	*XLINKNS;
bool	StrEQ(const wchar_t *zstr,const wchar_t *wstr,int wlen);
void	NormalizeInplace(CString& s);
CString	GetAttr(MSXML2::ISAXAttributes *attr,const wchar_t *name,const wchar_t *ns=NULL);
template<class T>
extern inline HRESULT CreateObject(CComPtr<T>& ptr) {
  T	  *obj;
  HRESULT hr=T::CreateInstance(&obj);
  if (FAILED(hr))
    return hr;
  ptr=obj;
  return S_OK;
}
void	AppendText(CString& str,const TCHAR *text,int textlen);

extern CRITICAL_SECTION	g_Lock;

///////////////////////////////////////////////////////////
// missing shell guids
struct __declspec(uuid("E8025004-1C42-11d2-BE2C-00A0C9A83DA1")) IColumnProvider;
struct __declspec(uuid("85788d00-6807-11d0-b810-00c04fd706ec")) IRunnableTask;

///////////////////////////////////////////////////////////
// Column provider
EXTERN_C const GUID CLSID_ColumnProvider;
EXTERN_C const GUID FMTID_FB;

class ColumnProvider :
  public CComObjectRoot,
  public CComCoClass<ColumnProvider, &CLSID_ColumnProvider>,
  public IColumnProvider
{
public:
  ColumnProvider() { ::InitializeCriticalSection(&m_lock); }
  virtual ~ColumnProvider() { ::DeleteCriticalSection(&m_lock); }

  DECLARE_REGISTRY_RESOURCEID(IDR_COLUMNPROVIDER)

  DECLARE_PROTECT_FINAL_CONSTRUCT()

  BEGIN_COM_MAP(ColumnProvider)
    COM_INTERFACE_ENTRY(IColumnProvider)
  END_COM_MAP()

  // IColumnProvider
  STDMETHOD(Initialize)(LPCSHCOLUMNINIT psci) { return S_OK; }
  STDMETHOD(GetColumnInfo)(DWORD dwIndex,SHCOLUMNINFO *psci);
  STDMETHOD(GetItemData)(LPCSHCOLUMNID pscid, LPCSHCOLUMNDATA pscd, VARIANT* pvarData);

protected:
  enum {
    PIDFB_LANG,
    PIDFB_SRCLANG,
    PIDFB_SEQ,
    PIDFB_DOCAUTH,
    PIDFB_DOCDATE,
    PIDFB_VER,
    PIDFB_ID,
    PIDFB_DOCDV,
    PIDFB_DV
  };

  struct FBInfo {
    CString	    filename;

    struct title_info {
      CString	    genres;
      CString	    authors;
      CString	    title;
      CString	    date;
      CString	    dateval;
      CString	    lang;
      CString	    srclang;
      CString	    seq;
    } title;
    struct document_info {
      CString	    authors;
      CString	    date;
      CString	    dateval;
      CString	    id;
      CString	    ver;
    } doc;

    HRESULT     Init(const wchar_t *filename);
    void	      Clear();

    static HRESULT    GetVariant(const CString& str,VARIANT *vt);

    // field accessors
  #define	FIELD(cat,name) static HRESULT get_##cat##_##name(const FBInfo& fbi,VARIANT *vt) { return GetVariant(fbi.cat.name,vt); }
    FIELD(title,genres)
    FIELD(title,authors)
    FIELD(title,title)
    FIELD(title,date)
    FIELD(title,lang)
    FIELD(title,srclang)
    FIELD(title,seq)
    FIELD(title,dateval)
    FIELD(doc,authors)
    FIELD(doc,date)
    FIELD(doc,id)
    FIELD(doc,ver)
    FIELD(doc,dateval)
  #undef FIELD
  };

  struct ColumnInfo {
    const wchar_t     *name;
    int		      width;
    DWORD	      col;
    const GUID	      *fmtid;
    DWORD	      pid;
    HRESULT	      (*handler)(const FBInfo& fbi,VARIANT *ret);
  };

  static ColumnInfo g_columns[];
  FBInfo	    m_cache;
  CRITICAL_SECTION  m_lock;

  class ContentHandlerImpl;
  typedef CComObject<ContentHandlerImpl>	ContentHandler;
  typedef CComPtr<ContentHandler>		ContentHandlerPtr;
};

///////////////////////////////////////////////////////////
// Image extractor
EXTERN_C const GUID CLSID_IconExtractor;

class IconExtractor :
  public CComObjectRoot,
  public CComCoClass<IconExtractor, &CLSID_IconExtractor>,
  public IPersistFile,
  public IExtractImage2
{
public:
  HRESULT FinalConstruct() {
    m_desired_size.cx=m_desired_size.cy=32;
    m_desired_depth=24;
    return S_OK;
  }

  DECLARE_REGISTRY_RESOURCEID(IDR_ICONEXTRACTOR)

  DECLARE_PROTECT_FINAL_CONSTRUCT()

  BEGIN_COM_MAP(IconExtractor)
    COM_INTERFACE_ENTRY(IPersist)
    COM_INTERFACE_ENTRY(IPersistFile)
    COM_INTERFACE_ENTRY(IExtractImage)
    COM_INTERFACE_ENTRY(IExtractImage2)
  END_COM_MAP()

  // IPersist
  STDMETHOD(GetClassID)(CLSID *id) { *id=CLSID_IconExtractor; return S_OK; }

  // IPersistFile
  STDMETHOD(IsDirty)() { return E_NOTIMPL; }
  STDMETHOD(Load)(const wchar_t *name,DWORD mode) { m_filename=name; return S_OK; }
  STDMETHOD(Save)(const wchar_t *name,BOOL remember) { return E_NOTIMPL; }
  STDMETHOD(SaveCompleted)(const wchar_t *name) { return E_NOTIMPL; }
  STDMETHOD(GetCurFile)(wchar_t **name) { return E_NOTIMPL; }

  // IExtractImage
  STDMETHOD(GetLocation)(wchar_t *file,DWORD filelen,DWORD *prio,const SIZE *sz,DWORD depth,DWORD *flags);
  STDMETHOD(Extract)(HBITMAP *hBmp);

  // IExtractImage2
  STDMETHOD(GetDateStamp)(FILETIME *tm);

protected:
  CString		      m_filename;
  SIZE			      m_desired_size;
  int			      m_desired_depth;

  class ContentHandlerImpl;
  typedef CComObject<ContentHandlerImpl>	ContentHandler;
  typedef CComPtr<ContentHandler>		ContentHandlerPtr;

  // common functions
  static bool		LoadObject(const wchar_t *filename,CString& type,
				   void *&data,int& datalen);
};

///////////////////////////////////////////////////////////
// Validation context menu
EXTERN_C const GUID CLSID_ContextMenu;

class ContextMenu :
  public CComObjectRoot,
  public CComCoClass<ContextMenu, &CLSID_ContextMenu>,
  public IShellExtInit,
  public IContextMenu
{
public:
  DECLARE_REGISTRY_RESOURCEID(IDR_CONTEXTMENU)

  DECLARE_PROTECT_FINAL_CONSTRUCT()

  BEGIN_COM_MAP(ContextMenu)
    COM_INTERFACE_ENTRY(IShellExtInit)
    COM_INTERFACE_ENTRY_IID(IID_IContextMenu,IContextMenu)
  END_COM_MAP()

  // IShellExtInit
  STDMETHOD(Initialize)(LPCITEMIDLIST pidlFolder,IDataObject *obj,HKEY progid);

  // IContextMenu
  STDMETHOD(QueryContextMenu)(HMENU hMenu,UINT idx,UINT cmdFirst,UINT cmdLast,UINT flags);
  STDMETHOD(GetCommandString)(UINT_PTR cmd,UINT flags,UINT *,LPSTR name,UINT namelen);
  STDMETHOD(InvokeCommand)(LPCMINVOKECOMMANDINFO pici);
protected:
  CSimpleArray<CString>	    m_files;
  bool			    m_folders;
};

#endif