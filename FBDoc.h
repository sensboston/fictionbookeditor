// FBDoc.h: interface for the FBDoc class.
//
//////////////////////////////////////////////////////////////////////

#if !defined(AFX_FBDOC_H__205AB072_350A_4D2F_B58B_61BBC255FFE5__INCLUDED_)
#define AFX_FBDOC_H__205AB072_350A_4D2F_B58B_61BBC255FFE5__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

namespace FB { // put all FB2 related stuff into its own namespace

// an fb2 document in-memory representation
class Doc
{
public:
  // document encoding
  CString		m_encoding;

  // owner frame
  HWND			m_frame;

  // document text is stored here
  //CFBEView		m_desc;
  CFBEView		m_body;

  // filename
  CString		m_filename;
  bool			m_namevalid;
  bstr_t		m_save_marker;

  static bool			  m_fast_mode;

  MSHTML::IHTMLElementPtr m_saved_element;

  // construction and destruction
  Doc(HWND hWndFrame);
  ~Doc();

  void		SaveSelectedPos();
  void		DeleteSaveMarker();
  long		GetSavedPos(bstr_t& dom, bool deleteMarker = true);

  // loading and saving
  void	  CreateBlank(HWND hWndParent);
  bool	  Load(HWND hWndParent,const CString& filename);
  //bool	  LoadFromDOM(HWND hWndParent,MSXML2::IXMLDOMDocument2 *dom);
  bool	  LoadFromHTML(HWND hWndParent,const CString& filename);
  MSXML2::IXMLDOMDocument2Ptr CreateDOM(const CString& encoding);
  HRESULT InvokeFunc(BSTR FuncName, CComVariant *params, int count, CComVariant &vtResult);
  void	  ShowDescription(bool Show);
  void	  RunScript(BSTR filePath);
  VARIANT_BOOL Doc::CheckScript(BSTR filePath);

  bool	  Save(const CString& filename);
  bool	  Validate(int &errline,int &errcol) {
    AU::CPersistentWaitCursor wc;
    return SaveToFile(CString(),true,&errline,&errcol);
  }
  bool	  SetXMLAndValidate(HWND sci,bool fValidateOnly,int& errline,int& errcol);
  bool	  TextToXML(BSTR text, MSXML2::IXMLDOMDocument2Ptr *xml);

  //bool	  SetXML(MSXML2::IXMLDOMDocument2 *dom);
  bool	  Save();

  // changes
  bool	  DocChanged() {
	  return m_body_ver!=m_body.GetVersionNumber() || 
		  //m_desc_ver!=m_desc.GetVersionNumber() || 
		  m_body.IsFormChanged(); }
  void	  MarkSavePoint() { 
	  m_body_ver=m_body.GetVersionNumber();
	  //m_desc_ver=m_desc.GetVersionNumber(); 
	  m_body.ResetFormChanged(); 
  }
  void	  ResetSavePoint() { m_body_ver=-1; }

  void	  MarkDocCP() { 
	  m_body_cp=m_body.GetVersionNumber(); 
	  //m_desc_cp=m_desc.GetVersionNumber(); 
	  m_body.ResetFormCP(); }
  bool	  DocRelChanged() { 
	  return m_body_cp!=m_body.GetVersionNumber() || 
//		  m_desc_cp!=m_desc.GetVersionNumber() || 
		  m_body.IsFormCP(); 
  }

  // IDs
  void	  BinIDsToComboBox(CComboBox& box);
  void	  ParaIDsToComboBox(CComboBox& box);

  // binary objects
  BSTR PrepareDefaultId(const CString& filename);
  void AddBinary(const CString& filename);

  //images
  void AddImage(const CString& filename);

  // config
  void	  ApplyConfChanges();

  // active document table
  static Doc  *LocateDocument(const wchar_t *id);
  static Doc* m_active_doc;

  // binary objects
  bool      GetBinary(const wchar_t *id,_variant_t& vt);
  
  // word lists
  struct Word {
    CString	word;
    CString	replacement;
    int		count;
    int		flags;
    Word() : count(0), flags(0) { }
  };
  enum {
    GW_INCLUDE_HYPHENS = 1,
    GW_HYPHENS_ONLY    = 2,
    GW_SORT_BY_COUNT   = 4
  };
  void	    GetWordList(int flags,CSimpleArray<Word>& words);

private:
  //long		    m_desc_ver;
  long		    m_body_ver;
  //long		    m_desc_cp;
  long		    m_body_cp;

  // saving support
  bool	  SaveToFile(const CString& filename,bool fValidateOnly=false,int *errline=NULL,int *errcol=NULL);
  MSXML2::IXMLDOMDocument2Ptr CreateDOMImp(const CString& encoding);

  // loading support
  void	  TransformXML(MSXML2::IXSLTemplatePtr tp,MSXML2::IXMLDOMDocument2Ptr doc,
		       CFBEView& dest);
  CString MyID() { CString ret; ret.Format(_T("%lu"),(unsigned long)this); return ret; }
  CString MyURL(const wchar_t *part) { CString ret; ret.Format(_T("fbw-internal:%lu:%s"),(unsigned long)this,part); return ret; }

  static CSimpleMap<Doc*,Doc*>	m_active_docs;  

public:
	void MoveNode(MSHTML::IHTMLDOMNodePtr from, MSHTML::IHTMLDOMNodePtr to, MSHTML::IHTMLDOMNodePtr insertBefore);
	void SetFastMode(bool fast);
	bool GetFastMode();
	int GetSelectedPos();

	CString GetOpenFileName()const;

private:
	void FastMode();
};

} // namespace FB
#endif // !defined(AFX_FBDOC_H__205AB072_350A_4D2F_B58B_61BBC255FFE5__INCLUDED_)
