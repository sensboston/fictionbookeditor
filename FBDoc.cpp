// Doc.cpp: implementation of the Doc class.
//
//////////////////////////////////////////////////////////////////////

#include "stdafx.h"
#include "resource.h"
#include "res1.h"

#include "utils.h"
#include "apputils.h"

#include "FBEView.h"
#include "FBDoc.h"
#include "Scintilla.h"
#include "Settings.h"

extern CSettings _Settings;

namespace FB {

// namespaces
const _bstr_t	  FBNS(L"http://www.gribuser.ru/xml/fictionbook/2.0");
const _bstr_t	  XLINKNS(L"http://www.w3.org/1999/xlink");
const _bstr_t	  NEWLINE(L"\n");

// document list
CSimpleMap<Doc*,Doc*>	Doc::m_active_docs;
Doc* FB::Doc::m_active_doc;
bool FB::Doc::m_fast_mode;

Doc   *Doc::LocateDocument(const wchar_t *id) {
  unsigned long	  *lv;
  if (swscanf(id,L"%lu",&lv)!=1)
    return NULL;
  return m_active_docs.Lookup((Doc*)lv);
}

// initialize a new Doc
Doc::Doc(HWND hWndFrame) :
	     m_filename(_T("Untitled.fb2")), m_namevalid(false),
//	     m_desc(hWndFrame,false), 
		 m_body(hWndFrame,true),
	     m_frame(hWndFrame), 
//		 m_desc_ver(-1), 
		 m_body_ver(-1),
//	     m_desc_cp(-1),
		 m_body_cp(-1),
	     m_encoding(_T("utf-8"))
{
  m_active_docs.Add(this,this);
}

// destroy a Doc
Doc::~Doc() {
  // destroy windows explicitly
//  if (m_desc.IsWindow())
//    m_desc.DestroyWindow();
  if (m_body.IsWindow())
    m_body.DestroyWindow();
  m_active_docs.Remove(this);
}

bool  Doc::GetBinary(const wchar_t *id,_variant_t& vt) {
  if (id && *id==L'#') {
	  CComDispatchDriver	    body(m_body.Script());
    _variant_t	  vid(id+1);
    body.Invoke1(L"apiGetBinary",&vid,&vt);
    return true;
  }
  return false;
}

struct ThreadArgs {
  MSXML2::IXSLProcessor	*proc;
  HANDLE		hWr;
};

static DWORD __stdcall XMLTransformThread(LPVOID varg) {
  ThreadArgs			*arg=(ThreadArgs*)varg;

  arg->proc->put_output(_variant_t(U::NewStream(arg->hWr)));
  VARIANT_BOOL	val;
  arg->proc->raw_transform(&val);
  arg->proc->Release();

  delete arg;

  return 0;
}

void Doc::TransformXML(MSXML2::IXSLTemplatePtr tp,MSXML2::IXMLDOMDocument2Ptr doc,
    CFBEView& dest)
{
  // create processor
  MSXML2::IXSLProcessorPtr	proc(tp->createProcessor());
  proc->input=_variant_t(doc.GetInterfacePtr());
  
  // add parameters
  CString	  fss(_Settings.GetFont());
  if (!fss.IsEmpty())
    proc->addParameter(L"font",(const wchar_t *)fss,_bstr_t());
  
  DWORD		  fs = _Settings.GetFontSize();
  if (fs>1) {
    fss.Format(_T("%d"),fs);
    proc->addParameter(L"fontSize",(const wchar_t *)fss,_bstr_t());
  }
  
  fs = _Settings.GetColorFG();
  if (fs!=CLR_DEFAULT) {
    fss.Format(_T("rgb(%d,%d,%d)"),GetRValue(fs),GetGValue(fs),GetBValue(fs));
    proc->addParameter(L"colorFG",(const wchar_t *)fss,_bstr_t());
  }

  fs = _Settings.GetColorBG();
  if (fs!=CLR_DEFAULT) {
    fss.Format(_T("rgb(%d,%d,%d)"),GetRValue(fs),GetGValue(fs),GetBValue(fs));
    proc->addParameter(L"colorBG",(const wchar_t *)fss,_bstr_t());
  }

  fs=::GetSysColor(COLOR_BTNFACE);
  fss.Format(_T("rgb(%d,%d,%d)"),GetRValue(fs),GetGValue(fs),GetBValue(fs));
  proc->addParameter(L"dlgBG",(const wchar_t *)fss,_bstr_t());

  fs=::GetSysColor(COLOR_BTNTEXT);
  fss.Format(_T("rgb(%d,%d,%d)"),GetRValue(fs),GetGValue(fs),GetBValue(fs));
  proc->addParameter(L"dlgFG",(const wchar_t *)fss,_bstr_t());

  proc->addParameter(L"dID",(const wchar_t *)MyID(),_bstr_t());

  // add jscript paths
  proc->addParameter(L"bodyscript",(const wchar_t *)U::UrlFromPath(U::GetProgDirFile(_T("body.js"))),_bstr_t());
  proc->addParameter(L"descscript",(const wchar_t *)U::UrlFromPath(U::GetProgDirFile(_T("desc.js"))),_bstr_t());

  ThreadArgs	*arg=new ThreadArgs;

  // pass the processor to worker thread, this is a dirty hack, but we know that
  // MSXML survives it, otherwise we'd have to jump through the hoops with
  // COM MTAs, because if we just marshal the pointer to worker thread, then
  // we'll deadlock in load. To do everything cleanly, we'd need to create the
  // XSL processor and XML documents in an MTA, and run the transforms there,
  // all this is rather awkward. Another alternative is to transform all XML
  // to memory and the load from it
  arg->proc=proc.Detach();

  // setup the streams
  HANDLE	  hRd;
  ::CreatePipe(&hRd,&arg->hWr,NULL,0);

  // start the processor
  ::CloseHandle(::CreateThread(NULL,0,XMLTransformThread,arg,0,NULL));

  // now stuff the data into mshtml
  IPersistStreamInitPtr	ips(dest.Browser()->Document);
  ips->InitNew();
  ips->Load(U::NewStream(hRd));
}

static MSXML2::IXSLTemplatePtr	LoadXSL(const CString& path) {
  MSXML2::IXMLDOMDocument2Ptr	xsl(U::CreateDocument(true));
  if (!U::LoadXml(xsl,U::GetProgDirFile(path)))
    throw _com_error(E_FAIL);
  MSXML2::IXSLTemplatePtr	tp(U::CreateTemplate());
  tp->stylesheet=xsl;
  return tp;
}

// loading
/*bool	Doc::LoadFromDOM(HWND hWndParent,MSXML2::IXMLDOMDocument2 *dom) {
  try {
    dom->setProperty(L"SelectionLanguage",L"XPath");
    CString   nsprop(L"xmlns:fb='");
    nsprop+=(const wchar_t *)FBNS;
    nsprop+=L"' xmlns:xlink='";
    nsprop+=(const wchar_t *)XLINKNS;
    nsprop+=L"'";
    dom->setProperty(L"SelectionNamespaces",(const TCHAR *)nsprop);

    // try to find out current encoding
    MSXML2::IXMLDOMProcessingInstructionPtr   pi(dom->firstChild);
    if (pi) {
      MSXML2::IXMLDOMNamedNodeMapPtr  attr(pi->attributes);
      if (attr) {
	MSXML2::IXMLDOMNodePtr	enc(attr->getNamedItem(L"encoding"));
	if (enc)
	  m_encoding=(const wchar_t *)enc->text;
      }
    }

    // create desc view
    m_desc.Create(hWndParent, CRect(0,0,500,500), _T("{8856F961-340A-11D0-A96B-00C04FD705A2}"));

    // navigate to blank page
    m_desc.Browser()->Navigate(L"about:blank");

    // run a message loop until it loads
    MSG	  msg;
    while (!m_desc.Loaded() && ::GetMessage(&msg,NULL,0,0)) {
      ::TranslateMessage(&msg);
      ::DispatchMessage(&msg);
    }

    // transform to html
    TransformXML(LoadXSL(_T("description.xsl")),dom,m_desc);

    // wait until it loads
    while (!m_desc.Loaded() && ::GetMessage(&msg,NULL,0,0)) {
      ::TranslateMessage(&msg);
      ::DispatchMessage(&msg);
    }

    // initialize view
    m_desc.Init();

    // store binaries
    CComDispatchDriver	  desc(m_desc.Script());
    _variant_t	    arg(dom);
    desc.Invoke1(L"PutBinaries",&arg);

    // create body view
    m_body.Create(hWndParent, CRect(0,0,500,500), _T("{8856F961-340A-11D0-A96B-00C04FD705A2}"));

    // navigate body browser
    m_body.Browser()->Navigate(L"about:blank");

    // wait until it loads
    while (!m_body.Loaded() && ::GetMessage(&msg,NULL,0,0)) {
      ::TranslateMessage(&msg);
      ::DispatchMessage(&msg);
    }

    // transform to html
    TransformXML(LoadXSL(_T("body.xsl")),dom,m_body);

    // wait until it loads
    while (!m_body.Loaded() && ::GetMessage(&msg,NULL,0,0)) {
      ::TranslateMessage(&msg);
      ::DispatchMessage(&msg);
    }

    // initialize view
    m_body.Init();

    // mark unchanged
    MarkSavePoint();

    // ok, now setup filename and return
    m_filename=_T("Untitled");
    m_namevalid=false;
  }
  catch (_com_error& e) {
    U::ReportError(e);
    return false;
  }

  return true;
}*/

HRESULT Doc::InvokeFunc(BSTR FuncName, CComVariant *params, int count, CComVariant &vtResult)
{
	LPDISPATCH pScript;    
	IHTMLDocument2Ptr doc = m_body.Browser()->Document;
	doc->get_Script(&pScript);
	pScript->AddRef();

	BSTR szMember = FuncName;
	DISPID dispid;
	
	HRESULT hr = pScript->GetIDsOfNames(IID_NULL, &szMember, 1, LOCALE_SYSTEM_DEFAULT, &dispid);

	if (SUCCEEDED(hr))
	{		
		CComDispatchDriver dispDriver(pScript);        
		hr = dispDriver.InvokeN(dispid, params , count, &vtResult);		
	}

	return hr;
}

void Doc::ShowDescription(bool Show)
{
	CComVariant vtResult;
	CComVariant params;
	V_VT(&params) = VT_BOOL;
	V_BOOL(&params) = Show;
	InvokeFunc(L"apiShowDesc", &params, 1, vtResult);
	return;
}

void Doc::RunScript(BSTR filePath)
{
	CComVariant vtResult;
	CComVariant params(filePath);
	InvokeFunc(L"apiRunCmd", &params, 1, vtResult);
}

VARIANT_BOOL Doc::CheckScript(BSTR filePath)
{
	CComVariant vtResult;
	CComVariant params(filePath);
	InvokeFunc(L"apiCheckScript", &params, 1, vtResult);

	return vtResult.boolVal;
}

bool Doc::LoadFromHTML(HWND hWndParent,const CString& filename)
{
	HRESULT	hr;
	wchar_t path[MAX_PATH + 1];
	GetModuleFileName(0, path, MAX_PATH);
	PathRemoveFileSpec(path);
	wcscat(path, L"\\main.html");
	m_body.Create(hWndParent, CRect(0,0,500,500), _T("{8856F961-340A-11D0-A96B-00C04FD705A2}"));
	hr = m_body.Browser()->Navigate(path);	
	MSG	  msg;
    while (!m_body.Loaded() && ::GetMessage(&msg,NULL,0,0)) 
	{
      ::TranslateMessage(&msg);
      ::DispatchMessage(&msg);
    }

	m_body.SetExternalDispatch(m_body.CreateHelper());
	//docUIHandler.AttachToBrowser(&m_body);

	m_body.Init();	
	FastMode();
	
	CComVariant params[2];
	params[1] = filename;	
	params[0] = _Settings.GetInterfaceLanguageName();
	CComVariant res;
	
	ApplyConfChanges();
	hr = InvokeFunc(L"apiLoadFB2", params, 2, res);
	m_body.Normalize(m_body.Document()->body);
	// mark unchanged
	MarkSavePoint();

	if(res.vt == VT_BOOL)
	{
		m_encoding = _Settings.GetDefaultEncoding();
		return res.boolVal != VARIANT_FALSE;		
	}

	if(res.vt == VT_BSTR)
	{
		m_encoding = res.bstrVal;
		return true;
	}

	if(res.vt == VT_EMPTY)
	{
		m_encoding = _Settings.GetDefaultEncoding();		
		return true;
	}

	return false;
}

bool Doc::Load(HWND hWndParent,const CString& filename) {

 try {
 //   AU::CPersistentWaitCursor wc;

    // load document into DOM
    /*MSXML2::IXMLDOMDocument2Ptr	dom(U::CreateDocument(true));
    if (!U::LoadXml(dom,filename))
      return false;

    if (!LoadFromDOM(hWndParent,dom))
      return false;*/
	if(!LoadFromHTML(hWndParent, filename))
	{
		return false;
	}

    m_filename = filename;
    m_namevalid = true;
  }
  catch (_com_error& e) {
    U::ReportError(e);
    return false;
  }

  return true;
}

void  Doc::CreateBlank(HWND hWndParent) {
  try {
    // load document into DOM
	  LoadFromHTML(hWndParent, L"blank.fb2");
    //LoadFromDOM(hWndParent,U::CreateDocument(true));
  }
  catch (_com_error& e) {
    U::ReportError(e);
  }
}

// indent something
static void   Indent(MSXML2::IXMLDOMNode *node,MSXML2::IXMLDOMDocument2 *xml,
		     int len)
{
  // inefficient
  BSTR	s=SysAllocStringLen(NULL,len+2);
  if (s) {
    s[0]=L'\r';
    s[1]=L'\n';
    for (BSTR p=s+2,q=s+2+len;p<q;++p)
      *p=L' ';
    MSXML2::IXMLDOMTextPtr	text;
    if (SUCCEEDED(xml->raw_createTextNode(s,&text)))
      node->raw_appendChild(text,NULL);
    SysFreeString(s);
  }
}

// set an attribute on the element
static void   SetAttr(MSXML2::IXMLDOMElement *xe,const wchar_t *name,
		      const wchar_t *ns,const _bstr_t& val,
		      MSXML2::IXMLDOMDocument2 *doc)
{
  MSXML2::IXMLDOMAttributePtr  attr(doc->createNode(2L,name,ns));
  attr->appendChild(doc->createTextNode(val));
  xe->setAttributeNode(attr);
}

// setup an ID for the element
static void   SetID(MSHTML::IHTMLElement *he,MSXML2::IXMLDOMElement *xe,
		    MSXML2::IXMLDOMDocument2 *doc) {
  _bstr_t     id(he->id);
  if (id.length()>0)
    SetAttr(xe,L"id",FBNS,id,doc);
}

// copy text
static MSXML2::IXMLDOMTextPtr MkText(MSHTML::IHTMLDOMNode *hn,MSXML2::IXMLDOMDocument2 *xml)
{
  VARIANT   vt;
  VariantInit(&vt);
  CheckError(hn->get_nodeValue(&vt));
  if (V_VT(&vt)!=VT_BSTR) {
    VariantClear(&vt);
    return xml->createTextNode(_bstr_t());
  }
  MSXML2::IXMLDOMText	    *txt;
  HRESULT   hr=xml->raw_createTextNode(V_BSTR(&vt),&txt);
  VariantClear(&vt);
  CheckError(hr);
  return MSXML2::IXMLDOMTextPtr(txt,FALSE);
}

// set an href attribute
static void SetHref(MSXML2::IXMLDOMElementPtr xe,MSXML2::IXMLDOMDocument2 *xml,
		    const _bstr_t& href)
{
  SetAttr(xe,L"l:href",XLINKNS,href,xml);
}

static void SetTitle(MSXML2::IXMLDOMElementPtr xe,MSXML2::IXMLDOMDocument2 *xml,
		    const _bstr_t& title)
{
	if(!title)
	{
		return;
	}
	SetAttr(xe,L"title",FB::FBNS,title,xml);
}

// handle inline formatting
static MSXML2::IXMLDOMNodePtr	  ProcessInline(MSHTML::IHTMLDOMNode *inl,
						MSXML2::IXMLDOMDocument2 *doc)
{
  // ƒл€ отображени€ тегов в режиме Source
  _bstr_t		      name(inl->nodeName);
  MSHTML::IHTMLElementPtr     einl(inl);
  _bstr_t		      cls(einl->className);

  const wchar_t		      *xname=NULL;
  bool			      fA=false;
  bool			      fStyle=false;
  bool				  fUnk = false;

  // Modification by Pilgrim
  if (U::scmp(name,L"STRONG")==0)
    xname=L"strong";
  else if (U::scmp(name,L"EM")==0)
    xname=L"emphasis";
  else if (U::scmp(name,L"STRIKE")==0)
	  xname=L"strikethrough";
  else if (U::scmp(name,L"SUB")==0)
	  xname=L"sub";
  else if (U::scmp(name,L"SUP")==0)
	  xname=L"sup";
   else if (U::scmp(name,L"A")==0) {
    xname=L"a"; fA=true;
  } else if (U::scmp(name,L"SPAN")==0) 
   {
	  if(U::scmp(cls,L"unknown_element")==0)
	  {		   
		  _bstr_t realClassName = einl->getAttribute(L"source_class", 2);
		  xname = realClassName;
		  fUnk = true;
	  }
      else if (U::scmp(cls,L"code")==0)
		xname=L"code";
	  else
	  {
           xname=L"style"; fStyle=true;
	  }
  }

  MSXML2::IXMLDOMElementPtr   xinl(doc->createNode(1L,xname,FBNS));

  if (fA) {
    SetHref(xinl,doc,AU::GetAttrB(einl,L"href"));
    if (U::scmp(cls,L"note")==0)
      SetAttr(xinl,L"type",FBNS,cls,doc);
  }
  if (fStyle)
    SetAttr(xinl,L"name",FBNS,cls,doc);

  if (fUnk)
  {
	  MSHTML::IHTMLAttributeCollectionPtr col = inl->attributes;		  
	for(int i = 0; i < col->length; ++i)
	{
		VARIANT index;
		V_VT(&index) = VT_INT;
		index.intVal = i;
		_bstr_t attr_name = MSHTML::IHTMLDOMAttributePtr(col->item(&index))->nodeName;
		_bstr_t attr_value;
		wchar_t* real_attr_name = 0;
		const wchar_t* prefix = L"unknown_attribute_";
		if(wcsncmp(attr_name, prefix, wcslen(prefix)))
		{
			continue;
		}
		else
		{
			real_attr_name = (wchar_t*)attr_name + wcslen(prefix);			
			attr_value = MSHTML::IHTMLDOMAttributePtr(col->item(&index))->nodeValue;
		}
		MSXML2::IXMLDOMAttributePtr  attr(doc->createNode(2L,real_attr_name,FBNS));
		attr->appendChild(doc->createTextNode(attr_value));
		xinl->setAttributeNode(attr);		
	}	
  }

  MSHTML::IHTMLDOMNodePtr     cn(inl->firstChild);

  // Modification by Pilgrim
  while ((bool)cn) {
    if (cn->nodeType==NODE_TEXT/*3*/)
      xinl->appendChild(MkText(cn,doc));
    else if (cn->nodeType==NODE_ELEMENT/*1*/)
      xinl->appendChild(ProcessInline(cn,doc));
    cn=cn->nextSibling;
  }

  return xinl;
}

// handle a paragraph element with subelements
static MSXML2::IXMLDOMNodePtr	  ProcessP(MSHTML::IHTMLElement *p,
					   MSXML2::IXMLDOMDocument2 *doc,
					   const wchar_t *baseName)
{
  _bstr_t		    cls(p->className);

  if (U::scmp(cls,L"text-author")==0)
    baseName=L"text-author";
  else if (U::scmp(cls,L"subtitle")==0)
    baseName=L"subtitle";
  // Modification by Pilgrim
  else if (U::scmp(cls,L"th")==0)
	baseName=L"th";
  else if (U::scmp(cls,L"td")==0)
	baseName=L"td";
 

  MSHTML::IHTMLDOMNodePtr   hp(p);

  // check if it is an empty-line
  if(U::scmp(cls, L"td") && U::scmp(cls, L"th"))
  {
	if	(hp->hasChildNodes()==VARIANT_FALSE ||
		(!(bool)hp->firstChild->nextSibling && hp->firstChild->nodeType==3 &&
		U::is_whitespace(hp->firstChild->nodeValue.bstrVal)))
	{
		if (MSHTML::IHTMLElement3Ptr(p)->inflateBlock==VARIANT_TRUE)
			return doc->createNode(1L,L"empty-line",FBNS);
		return MSXML2::IXMLDOMNodePtr();
	}
  }

  MSXML2::IXMLDOMElementPtr xp(doc->createNode(1L,baseName,FBNS));

  SetID(p,xp,doc);

  _bstr_t	style(AU::GetAttrB(p,L"fbstyle"));
  if (style.length()>0)
    SetAttr(xp,L"style",FBNS,style,doc);

  // Modification by Pilgrim
  _bstr_t	colspan(AU::GetAttrB(p,L"fbcolspan"));
  if (colspan.length()>0)
	  SetAttr(xp,L"colspan",FBNS,colspan,doc);
  
  _bstr_t	rowspan(AU::GetAttrB(p,L"fbrowspan"));
  if (rowspan.length()>0)
	  SetAttr(xp,L"rowspan",FBNS,rowspan,doc);

  _bstr_t	align(AU::GetAttrB(p,L"fbalign"));
  if (align.length()>0)
	  SetAttr(xp,L"align",FBNS,align,doc);

  _bstr_t	valign(AU::GetAttrB(p,L"fbvalign"));
  if (valign.length()>0)
	  SetAttr(xp,L"valign",FBNS,valign,doc);

  hp=hp->firstChild;

  // Modification by Pilgrim  
  while ((bool)hp) {
    if (hp->nodeType==NODE_TEXT/*3*/) // text segment
      xp->appendChild(MkText(hp,doc));
    else if (hp->nodeType==NODE_ELEMENT/*1*/)
      xp->appendChild(ProcessInline(hp,doc));
    hp=hp->nextSibling;
  }

  _bstr_t selected	(AU::GetAttrB(p,L"fbe_selected"));
  if (selected.length()>0)
	  SetAttr(xp,L"selected",FBNS,selected,doc);

  return xp;
}

// handle a div element with subelements
static MSXML2::IXMLDOMNodePtr	  ProcessDiv(MSHTML::IHTMLElement *div,
					     MSXML2::IXMLDOMDocument2 *doc,
					     int indent)
{
  _bstr_t		    cls(div->className);
  
  MSXML2::IXMLDOMElementPtr xdiv(doc->createNode(1L,cls,FBNS));

  if (U::scmp(cls,L"image")==0) {
    SetID(div,xdiv,doc);
    SetHref(xdiv,doc,AU::GetAttrB(div,L"href"));
	SetTitle(xdiv,doc,AU::GetAttrB(div,L"title"));
    return xdiv;
  }

  SetID(div,xdiv,doc);

  // Modification by Pilgrim
  if (U::scmp(cls,L"table")==0) { 
	  _bstr_t	style(AU::GetAttrB(div,L"fbstyle"));
	  if (style.length()>0){
		  SetAttr(xdiv,L"style",FBNS,style,doc);
	  }
  }  
  if (U::scmp(cls,L"tr")==0) { 
	 _bstr_t	align(AU::GetAttrB(div,L"fbalign"));
	 if (align.length()>0){
		SetAttr(xdiv,L"align",FBNS,align,doc);
	 }
  }  

  MSHTML::IHTMLDOMNodePtr   ndiv(div);
  MSHTML::IHTMLDOMNodePtr   fc(ndiv->firstChild);

  const wchar_t *bn=U::scmp(cls,L"stanza")==0 ? L"v" : L"p";

  while ((bool)fc) {
    _bstr_t	name(fc->nodeName);
	bstr_t html = div->outerHTML;
    MSHTML::IHTMLElementPtr efc(fc);
    if (U::scmp(name,L"DIV")==0) {
      Indent(xdiv,doc,indent+1);
      xdiv->appendChild(ProcessDiv(efc,doc,indent+1));
    } else if (U::scmp(name,L"P")==0) {
      MSXML2::IXMLDOMNodePtr  np(ProcessP(efc,doc,bn));
      if (np) {
		Indent(xdiv,doc,indent+1);
		xdiv->appendChild(np);
      }
    }

    fc=fc->nextSibling;
  }

  Indent(xdiv,doc,indent);

  return xdiv;
}

// find a first named DIV
static MSXML2::IXMLDOMNodePtr  GetDiv(MSHTML::IHTMLElementPtr body,
				      MSXML2::IXMLDOMDocument2 *xml,
				      const wchar_t *name,
				      int indent)
{
  MSHTML::IHTMLElementCollectionPtr children(body->children);
  long				    c_len=children->length;

  for (long i=0;i<c_len;++i) {
    MSHTML::IHTMLElementPtr div(children->item(i));
    if (!(bool)div)
      continue;
    if (U::scmp(div->tagName,L"DIV")==0 && U::scmp(div->className,name)==0)
      return ProcessDiv(div,xml,indent);
  }

  return MSXML2::IXMLDOMNodePtr();
}

// fetch bodies
static void   GetBodies(MSHTML::IHTMLElementPtr	body,
			MSXML2::IXMLDOMDocument2 *doc)
{
  MSHTML::IHTMLElementCollectionPtr children(body->children);
  long			      c_len=children->length;

  for (long i=0;i<c_len;++i) {
    MSHTML::IHTMLElementPtr div(children->item(i));
    if (!(bool)div)
      continue;
    
	if (U::scmp(div->tagName,L"DIV")==0 && U::scmp(div->className,L"body")==0) 
	{
      MSXML2::IXMLDOMElementPtr	xb(ProcessDiv(div,doc,1));
      _bstr_t	  bn(AU::GetAttrB(div,L"fbname"));
      if (bn.length()>0)
		SetAttr(xb,L"name",FBNS,bn,doc);
      Indent(doc->documentElement,doc,1);
      doc->documentElement->appendChild(xb);
    }
  }
}

// validator object
class SAXErrorHandler: public CComObjectRoot, public MSXML2::ISAXErrorHandler {
public:
  CString     m_msg;
  int	      m_line,m_col;

  SAXErrorHandler() : m_line(0),m_col(0) { }

  void	SetMsg(MSXML2::ISAXLocator *loc, const wchar_t *msg, HRESULT hr) {
    if (!m_msg.IsEmpty())
      return;
    m_msg=msg;
    CString   ns;
    ns.Format(_T("{%s}"),(const TCHAR *)FBNS);
    m_msg.Replace(ns,_T(""));
    ns.Format(_T("{%s}"),(const TCHAR *)XLINKNS);
    m_msg.Replace(ns,_T("xlink"));
    m_line=loc->getLineNumber();
    m_col=loc->getColumnNumber();
  }

  BEGIN_COM_MAP(SAXErrorHandler)
    COM_INTERFACE_ENTRY(MSXML2::ISAXErrorHandler)
  END_COM_MAP()

  STDMETHOD(raw_error)(MSXML2::ISAXLocator *loc, wchar_t *msg, HRESULT hr) {
    SetMsg(loc,msg,hr);
    return E_FAIL;
  }
  STDMETHOD(raw_fatalError)(MSXML2::ISAXLocator *loc, wchar_t *msg, HRESULT hr) {
    SetMsg(loc,msg,hr);
    return E_FAIL;
  }
  STDMETHOD(raw_ignorableWarning)(MSXML2::ISAXLocator *loc, wchar_t *msg, HRESULT hr) {
    SetMsg(loc,msg,hr);
    return E_FAIL;
  }
};

MSXML2::IXMLDOMDocument2Ptr Doc::CreateDOMImp(const CString& encoding) {
  // normalize body first
  m_body.Normalize(m_body.Document()->body);
  
  // create document
  MSXML2::IXMLDOMDocument2Ptr	ndoc(U::CreateDocument(false));
  ndoc->async=VARIANT_FALSE;

  // set encoding
  if (!encoding.IsEmpty())
    ndoc->appendChild(ndoc->createProcessingInstruction(L"xml",(const wchar_t *)(L"version=\"1.0\" encoding=\""+encoding+L"\"")));

  // create document element
  MSXML2::IXMLDOMElementPtr	root=
    ndoc->createNode(_variant_t(1L),L"FictionBook",FBNS);
  root->setAttribute(L"xmlns:l",XLINKNS);
  ndoc->documentElement=MSXML2::IXMLDOMElementPtr(root);

  // enable xpath queries
  ndoc->setProperty(L"SelectionLanguage",L"XPath");
  CString   nsprop(L"xmlns:fb='");
  nsprop+=(const wchar_t *)FBNS;
  nsprop+=L"' xmlns:xlink='";
  nsprop+=(const wchar_t *)XLINKNS;
  nsprop+=L"'";
  ndoc->setProperty(L"SelectionNamespaces",(const TCHAR *)nsprop);

  // fetch annotation

  MSHTML::IHTMLElementCollectionPtr children(m_body.Document()->body->children);
  long			      c_len=children->length;

  MSHTML::IHTMLElementPtr fbw_body;

  for (long i=0;i<c_len;++i) {
    MSHTML::IHTMLElementPtr div(children->item(i));
    if (!(bool)div)
      continue;
    
	if (U::scmp(div->tagName,L"DIV")==0 && U::scmp(div->id,L"fbw_body")==0) 
	{
		 fbw_body = div;
		 break;
    }
  } 

  MSXML2::IXMLDOMNodePtr  ann(GetDiv(fbw_body,ndoc,L"annotation",3));

  // fetch history
  MSXML2::IXMLDOMNodePtr  hist(GetDiv(fbw_body,ndoc,L"history",3));

  // fetch description
  CComDispatchDriver	body(m_body.Script());
  CComVariant		    args[3];
  if (hist)
    args[0]=hist.GetInterfacePtr();
  if (ann)
    args[1]=ann.GetInterfacePtr();
  args[2]=ndoc.GetInterfacePtr();
  CComVariant res;
  CheckError(body.InvokeN(L"GetDesc",&args[0],3));

  // fetch body elements
  
  GetBodies(fbw_body,ndoc);

  // fetch binaries
  CheckError(body.Invoke1(L"GetBinaries",&args[2]));

  Indent(root,ndoc,0);
  return ndoc;
}

MSXML2::IXMLDOMDocument2Ptr Doc::CreateDOM(const CString& encoding) {
  try {
    return CreateDOMImp(encoding);
  }
  catch (_com_error& e) {
    U::ReportError(e);
  }
  return NULL;
}

bool  Doc::SaveToFile(const CString& filename,bool fValidateOnly,
		      int *errline,int *errcol)
{
  try {
    // create a schema collection
    MSXML2::IXMLDOMSchemaCollection2Ptr	scol;
    CheckError(scol.CreateInstance(L"Msxml2.XMLSchemaCache.4.0"));

    // load fictionbook schema
    scol->add(FBNS,(const wchar_t *)U::GetProgDirFile(L"FictionBook.xsd"));

    // create a SAX reader
    MSXML2::ISAXXMLReaderPtr	  rdr;
    CheckError(rdr.CreateInstance(L"Msxml2.SAXXMLReader.4.0"));

    // attach a schema
    rdr->putFeature(L"schema-validation",VARIANT_TRUE);
    rdr->putProperty(L"schemas",scol.GetInterfacePtr());
    rdr->putFeature(L"exhaustive-errors",VARIANT_TRUE);

    // create an error handler
    CComObject<SAXErrorHandler>	  *ehp;
    CheckError(CComObject<SAXErrorHandler>::CreateInstance(&ehp));
    CComPtr<CComObject<SAXErrorHandler> > eh(ehp);
    rdr->putErrorHandler(eh);
    // construct the document
	MSXML2::IXMLDOMDocument2Ptr	ndoc(CreateDOMImp(_Settings.KeepEncoding() ? m_encoding : _Settings.GetDefaultEncoding()));

    // reparse the document
    IStreamPtr	    isp(ndoc);
    HRESULT hr=rdr->raw_parse(_variant_t((IUnknown *)isp));
    bool bErrSave = false;
	if (FAILED(hr)) {
      if (!eh->m_msg.IsEmpty()) {
	// record error position
	if (errline)
	  *errline=eh->m_line;
	if (errcol)
	  *errcol=eh->m_col;
	if (fValidateOnly)
	  ::MessageBeep(MB_ICONERROR);
	else
	{
	  wchar_t cpt[MAX_LOAD_STRING + 1];
	  wchar_t msg[MAX_LOAD_STRING + 1];
	  ::LoadString(_Module.GetResourceInstance(), IDS_VALIDATION_FAIL_MSG, msg, MAX_LOAD_STRING);
	  ::LoadString(_Module.GetResourceInstance(), IDS_VALIDATION_FAIL_CPT, cpt, MAX_LOAD_STRING);
	  if(IDYES == U::MessageBox(MB_YESNO|MB_DEFBUTTON2|MB_ICONERROR, cpt, msg, eh->m_msg))
	  {
			bErrSave = true;
			goto forcesave;
	  }
	}
	::SendMessage(m_frame,AU::WM_SETSTATUSTEXT,0,
	  (LPARAM)(const TCHAR *)eh->m_msg);
      } else
	U::ReportError(hr);
      return false;
    }

    if (fValidateOnly) 
	{
		wchar_t buf[MAX_LOAD_STRING + 1];
		::LoadString(_Module.GetResourceInstance(), IDS_SB_NO_ERR, buf, MAX_LOAD_STRING);
		::SendMessage(m_frame,AU::WM_SETSTATUSTEXT, 0, (LPARAM)buf);
		::MessageBeep(MB_OK);
		return true;
    }

forcesave:
    // now save it
    // create tmp filename
    CString	path(filename);
    int		cp=path.ReverseFind(_T('\\'));
    if (cp<0)
      path=_T(".\\");
    else
      path.Delete(cp,path.GetLength()-cp);
    CString	buf;
    TCHAR	*bp=buf.GetBuffer(MAX_PATH);
    UINT    uv=::GetTempFileName(path,_T("fbe"),0,bp);
    if (uv==0)
      throw _com_error(HRESULT_FROM_WIN32(::GetLastError()));
    buf.ReleaseBuffer();
    // try to save file
    hr=ndoc->raw_save(_variant_t((const wchar_t *)buf));
    if (FAILED(hr)) {
      ::DeleteFile(buf);
      _com_issue_errorex(hr,ndoc,__uuidof(ndoc));
    }
	else {// Modification by Pilgrim
		if(bErrSave) {// «аписать несмотр€ на невалидацию
			CString mes("Document saved with errors: ");
			mes+=(const TCHAR *)eh->m_msg;
			::SendMessage(m_frame,AU::WM_SETSTATUSTEXT,0,
				(LPARAM)(const TCHAR *)mes);
			::MessageBeep(MB_OK);
		}
		else 
		{
			wchar_t buf[MAX_LOAD_STRING + 1];
			::LoadString(_Module.GetResourceInstance(), IDS_SB_SAVED_NO_ERR, buf, MAX_LOAD_STRING);
			::SendMessage(m_frame,AU::WM_SETSTATUSTEXT, 0, (LPARAM)buf);			
			::MessageBeep(MB_OK);
		}
	}

    // rename tmp file to original filename
    ::DeleteFile(filename);
    ::MoveFile(buf,filename);
	m_encoding = _Settings.KeepEncoding() ? m_encoding : _Settings.GetDefaultEncoding();
  }
  catch (_com_error& e) {
    U::ReportError(e);
    return false;
  }

  return true;
}

bool  Doc::Save() {
  if (!m_namevalid)
    return false;
  AU::CPersistentWaitCursor wc;
  if (SaveToFile(m_filename)) {
    MarkSavePoint();
    return true;
  }
  return false;
}

bool  Doc::Save(const CString& filename) {
  AU::CPersistentWaitCursor wc;
  if (SaveToFile(filename)) {
    MarkSavePoint();
    m_filename=filename;
	wchar_t str[MAX_PATH];
	wcscpy(str, (const wchar_t*)filename);
	PathRemoveFileSpec(str);
	SetCurrentDirectory(str);
    m_namevalid=true;
    return true;
  }
  return false;
}

// IDs
static const wchar_t  *AddHash(CString& tmp,const _bstr_t& id) {
  wchar_t  *cp=tmp.GetBuffer(id.length()+1);
  *cp++=L'#';
  memcpy(cp,(const wchar_t *)id,id.length()*sizeof(wchar_t));
  tmp.ReleaseBuffer(id.length()+1);
  return tmp;
}

static void GrabIDs(CString& tmp,CComboBox& box,MSHTML::IHTMLDOMNode *node) {
  if (node->nodeType!=1)
    return;

  _bstr_t		  name(node->nodeName);
  if (U::scmp(name,L"P") && U::scmp(name,L"DIV") && U::scmp(name,L"BODY"))
    return;

  MSHTML::IHTMLElementPtr elem(node);
  _bstr_t		  id(elem->id);
  if (id.length()>0)
    box.AddString(AddHash(tmp,id));

  MSHTML::IHTMLDOMNodePtr cn(node->firstChild);
  while ((bool)cn) {
    GrabIDs(tmp,box,cn);
    cn=cn->nextSibling;
  }
}

void  Doc::ParaIDsToComboBox(CComboBox& box) {
  try {
    CString tmp;
    MSHTML::IHTMLDOMNodePtr body(m_body.Document()->body);
    GrabIDs(tmp,box,body);
  }
  catch (_com_error&) { }
}

void  Doc::BinIDsToComboBox(CComboBox& box) {
  try {
	  IDispatchPtr	bo(m_body.Document()->all->item(L"id"));
    if (!(bool)bo)
      return;
    CString	  tmp;
    MSHTML::IHTMLElementCollectionPtr sbo(bo);
    if ((bool)sbo) {
      long    l=sbo->length;
      for (long i=0;i<l;++i)
	  {
		MSHTML::IHTMLElementPtr elem = sbo->item(i);
		MSHTML::IHTMLInputTextElementPtr input_text = (MSHTML::IHTMLInputTextElementPtr)elem;
		if(!(bool)input_text)
			continue;
		const wchar_t* hash = AddHash(tmp, input_text->value);
		
		box.AddString(AddHash(tmp,MSHTML::IHTMLInputTextElementPtr(sbo->item(i))->value));
	  }
    } else {
      MSHTML::IHTMLInputTextElementPtr ebo(bo);
      if ((bool)ebo)
	box.AddString(AddHash(tmp,ebo->value));
    }
  }
  catch (_com_error&) { }
}

BSTR Doc::PrepareDefaultId(const CString& filename){
  
  // prepare a default id
  int cp = filename.ReverseFind(_T('\\'));
  if (cp < 0)
    cp = 0;
  else
    ++cp;
  CString   newid;
  TCHAR	    *ncp=newid.GetBuffer(filename.GetLength()-cp);
  int	    newlen=0;
  while (cp<filename.GetLength()) {
    TCHAR   c=filename[cp];
    if ((c>=_T('0') && c<=_T('9')) ||
	(c>=_T('A') && c<=_T('Z')) ||
	(c>=_T('a') && c<=_T('z')) ||
	c==_T('_') || c==_T('.'))
      ncp[newlen++]=c;
    ++cp;
  }
  newid.ReleaseBuffer(newlen);
  if (!newid.IsEmpty() && !(
    (newid[0]>=_T('A') && newid[0]<=_T('Z')) ||
    (newid[0]>=_T('a') && newid[0]<=_T('z')) ||
    newid[0]==_T('_')))
    newid.Insert(0,_T('_'));
  return newid.AllocSysString();
 }

// binaries
void Doc::AddBinary(const CString& filename) {
  _variant_t	  args[3];
  HRESULT	  hr;

  if (FAILED(hr=U::LoadFile(filename, &args[0]))) {
    U::ReportError(hr);
    return;
  }
 
  V_BSTR(&args[2]) = PrepareDefaultId(filename);
  V_VT(&args[2]) = VT_BSTR;

  // try to find out mime type
  V_BSTR(&args[1])=U::GetMimeType(filename).AllocSysString();
  V_VT(&args[1])=VT_BSTR;

  // stuff the thing into javascript
  CComDispatchDriver body(m_body.Script());
  hr=body.InvokeN(L"apiAddBinary",args,3);
  if (FAILED(hr))
    U::ReportError(hr);

  hr = body.Invoke0(L"FillCoverList");
  if (FAILED(hr))
    U::ReportError(hr);
}

// images
void Doc::AddImage(const CString& filename)
{
  _variant_t args[3];
  HRESULT hr;

  if (FAILED(hr = U::LoadFile(filename, &args[0])))
  {
    U::ReportError(hr);
    return;
  }

  // prepare a default id
  int cp = filename.ReverseFind(_T('\\'));
  if (cp < 0)
    cp = 0;
  else
    ++cp;
 
  V_BSTR(&args[2]) = PrepareDefaultId(filename);
  V_VT(&args[2]) = VT_BSTR;

  // try to find out mime type
  V_BSTR(&args[1]) = U::GetMimeType(filename).AllocSysString();
  V_VT(&args[1]) = VT_BSTR;

  // stuff the thing into javascript
  try
  {
    CComDispatchDriver body(m_body.Script());
	_variant_t checkedId;
    hr = body.InvokeN(L"apiAddBinary", args, 3, &checkedId);

    if(FAILED(hr))
      U::ReportError(hr);

    hr = body.Invoke0(L"FillCoverList");

    if(FAILED(hr))
      U::ReportError(hr);

  _variant_t check(false);
  hr=body.Invoke2(L"InsImage", &check, &checkedId);
  if (FAILED(hr))
    U::ReportError(hr);

  MSHTML::IHTMLDOMNodePtr   node(NULL);
    if (node)
      BubbleUp(node,L"DIV");
  }
  catch (_com_error&) { }
}

void  Doc::ApplyConfChanges() {
  try {
    MSHTML::IHTMLStylePtr	  hs(m_body.Document()->body->style);

	CString	  fss(_Settings.GetFont());
    if (!fss.IsEmpty())
      hs->fontFamily=(const wchar_t *)fss;
  
	DWORD		  fs = _Settings.GetFontSize();
    if (fs>1) {
      fss.Format(_T("%dpt"),fs);
      hs->fontSize=(const wchar_t *)fss;
    }
  
    fs = _Settings.GetColorFG();
    if (fs==CLR_DEFAULT)
      fs=::GetSysColor(COLOR_WINDOWTEXT);
    fss.Format(_T("rgb(%d,%d,%d)"),GetRValue(fs),GetGValue(fs),GetBValue(fs));
    hs->color=(const wchar_t *)fss;

    fs = _Settings.GetColorBG();
    if (fs==CLR_DEFAULT)
      fs=::GetSysColor(COLOR_WINDOW);
    fss.Format(_T("rgb(%d,%d,%d)"),GetRValue(fs),GetGValue(fs),GetBValue(fs));
    hs->backgroundColor=(const wchar_t *)fss;

	bool mode = _Settings.FastMode();
	SetFastMode(mode);
	::SendMessage(m_frame, WM_COMMAND, MAKELONG(mode,IDN_FAST_MODE_CHANGE), (LPARAM)0);

	bool fbw_hkmap = _Settings.FBWHotkeys();
	::SendMessage(m_frame, WM_COMMAND, MAKELONG(fbw_hkmap, IDN_HKMAP_CHANGE), (LPARAM)0);	
  }
  catch (_com_error&) { }
}

static int  compare_nocase(const void *v1,const void *v2) {
  const wchar_t	*s1=*(const wchar_t **)v1;
  const wchar_t *s2=*(const wchar_t **)v2;
  int	cv=_wcsicmp(s1,s2);
  if (cv!=0)
    return cv;
  return wcscmp(s1,s2);
}

static int  compare_counts(const void *v1,const void *v2) {
  const Doc::Word *w1=(const Doc::Word *)v1;
  const Doc::Word *w2=(const Doc::Word *)v2;
  int	diff=w1->count - w2->count;
  return diff ? diff : w1->word.CompareNoCase(w2->word);
}

void  Doc::GetWordList(int flags,CSimpleArray<Word>& words) {
  CWaitCursor	hourglass;

  _bstr_t   bb(m_body.Document()->body->innerText);

  if (bb.length()==0)
    return;

  // construct a word list
  CSimpleValArray<wchar_t*>  wl;

  // iterate over bb using a primitive fsm
  wchar_t   *p=bb,*e=p+bb.length()+1; // include trailing 0!
  wchar_t   *wstart,*wend;

  enum {
    INITIAL, INWORD1, INWORD2, HYPH1, HYPH2
  } state=INITIAL;

  while (p<e) {
    int  letter=iswalpha(*p);
    switch (state) {
    case INITIAL: initial:
      if (letter) {
	wstart=p;
	state=INWORD1;
      }
      break;
    case INWORD1:
      if (!letter) {
	if (flags & GW_INCLUDE_HYPHENS) {
	  if (iswspace(*p)) {
	    wend=p; state=HYPH1;
	    break;
	  } else if (*p == L'-') {
	    wend=p; state=HYPH2;
	    break;
	  }
	}
	if (!(flags & GW_HYPHENS_ONLY)) {
	  *p=L'\0';
	  wl.Add(wstart);
	}
	state=INITIAL;
      }
      break;
    case INWORD2:
      if (!letter) {
	*p=L'\0';
	U::RemoveSpaces(wstart);
	wl.Add(wstart);
	state=INITIAL;
      }
      break;
    case HYPH1:
      if (*p==L'-')
	state=HYPH2;
      else if (!iswspace(*p)) {
	if (!(flags & GW_HYPHENS_ONLY)) {
	  *wend=L'\0';
	  wl.Add(wstart);
	}
	state=INITIAL;
	goto initial;
      }
      break;
    case HYPH2:
      if (letter)
	state=INWORD2;
      else if (!iswspace(*p)) {
	if (!(flags & GW_HYPHENS_ONLY)) {
	  *wend=L'\0';
	  wl.Add(wstart);
	}
	state=INITIAL;
	goto initial;
      }
      break;
    }
    ++p;
  }

  if (wl.GetSize()==0)
    return;

  // now sort the list
  qsort(wl.GetData(),wl.GetSize(),sizeof(wchar_t*),compare_nocase);

  // and count the words
  int	i,nw,start;
  Word	w;

  for (start=0,i=1,nw=wl.GetSize();i<nw;++i)
    if (_wcsicmp(wl[start],wl[i])!=0) {
      w.count=i-start;
      w.word=wl[start];
      words.Add(w);
      start=i;
    }
  // append last word
  w.word=wl[start];
  w.count=i-start;
  words.Add(w);

  // sort by count now
  if (flags & GW_SORT_BY_COUNT)
    qsort(words.GetData(),words.GetSize(),sizeof(Word),compare_counts);
}

/*bool  Doc::SetXML(MSXML2::IXMLDOMDocument2 *dom) {
  if (!dom)
    return false;

  try {
    // ok, it seems valid, put it into document then
    dom->setProperty(L"SelectionLanguage",L"XPath");
    CString   nsprop(L"xmlns:fb='");
    nsprop+=(const wchar_t *)FBNS;
    nsprop+=L"' xmlns:xlink='";
    nsprop+=(const wchar_t *)XLINKNS;
    nsprop+=L"'";
    dom->setProperty(L"SelectionNamespaces",(const TCHAR *)nsprop);

    // transform to html
    TransformXML(LoadXSL(_T("description.xsl")),dom,m_desc);

    // wait until it loads
    MSG msg;

    while (!m_desc.Loaded() && ::GetMessage(&msg,NULL,0,0)) {
      ::TranslateMessage(&msg);
      ::DispatchMessage(&msg);
    }

    m_desc.Init();

    // store binaries
    CComDispatchDriver	  desc(m_desc.Script());
    _variant_t	    arg(dom);
    desc.Invoke1(L"PutBinaries",&arg);

    // transform to html
	TransformXML(LoadXSL(_T("body.xsl")),dom,m_body);	

    // wait until it loads
    while (!m_body.Loaded() && ::GetMessage(&msg,NULL,0,0)) {
      ::TranslateMessage(&msg);
      ::DispatchMessage(&msg);
    }

    m_body.Init();
  }
  catch (_com_error& e) {
    U::ReportError(e);
    return false;
  }

  return true;
}*/

// source editing
bool  Doc::SetXMLAndValidate(HWND sci,bool fValidateOnly,int& errline,int& errcol) {
  errline=errcol=0;

  // validate it first
  try {
    // create a schema collection
    MSXML2::IXMLDOMSchemaCollection2Ptr	scol;
    CheckError(scol.CreateInstance(L"Msxml2.XMLSchemaCache.4.0"));

    // load fictionbook schema
    scol->add(FBNS,(const wchar_t *)U::GetProgDirFile(L"FictionBook.xsd"));

    // create a SAX reader
    MSXML2::ISAXXMLReaderPtr	  rdr;
    CheckError(rdr.CreateInstance(L"Msxml2.SAXXMLReader.4.0"));

    // attach a schema
    rdr->putFeature(L"schema-validation",VARIANT_TRUE);
    rdr->putProperty(L"schemas",scol.GetInterfacePtr());
    rdr->putFeature(L"exhaustive-errors",VARIANT_TRUE);

    // create an error handler
    CComObject<SAXErrorHandler>	  *ehp;
    CheckError(CComObject<SAXErrorHandler>::CreateInstance(&ehp));
    CComPtr<CComObject<SAXErrorHandler> > eh(ehp);
    rdr->putErrorHandler(eh);

    // construct a document
    MSXML2::IXMLDOMDocument2Ptr	dom;
    
    if (!fValidateOnly) {
      dom=U::CreateDocument(true);

      // construct an xml writer
      MSXML2::IMXWriterPtr	wrt;
      CheckError(wrt.CreateInstance(L"Msxml2.MXXMLWriter.4.0"));

      // connect document to the writer
      wrt->output=dom.GetInterfacePtr();

      // connect the writer to the reader
      rdr->putContentHandler(MSXML2::ISAXContentHandlerPtr(wrt));
	}

    // now parse it!
    // oh well, let's waste more memory
    int	    textlen=::SendMessage(sci, SCI_GETLENGTH, 0, 0);
    char    *buffer=(char *)malloc(textlen+1);
    if (!buffer) {
nomem:
	  wchar_t msg[MAX_LOAD_STRING + 1];
	  wchar_t cpt[MAX_LOAD_STRING + 1];
	  ::LoadString(_Module.GetResourceInstance(), IDS_OUT_OF_MEM_MSG, msg, MAX_LOAD_STRING);
	  ::LoadString(_Module.GetResourceInstance(), IDR_MAINFRAME, cpt, MAX_LOAD_STRING);
      ::MessageBox(::GetActiveWindow(), msg, cpt, MB_OK|MB_ICONERROR);
     return false;
    }
    ::SendMessage(sci, SCI_GETTEXT, textlen+1, (LPARAM)buffer);
    DWORD   ulen=::MultiByteToWideChar(CP_UTF8,0,buffer,textlen,NULL,0);
    BSTR    ustr=::SysAllocStringLen(NULL,ulen);
    if (!ustr) {
      free(buffer);
      goto nomem;
    }
    ::MultiByteToWideChar(CP_UTF8,0,buffer,textlen,ustr,ulen);
    free(buffer);

    VARIANT vt;
    V_VT(&vt)=VT_BSTR;
    V_BSTR(&vt)=ustr;
    HRESULT hr=rdr->raw_parse(vt);
    ::VariantClear(&vt);

	if (FAILED(hr)) {
      if (!eh->m_msg.IsEmpty()) {
	// record error position
	errline=eh->m_line;
	errcol=eh->m_col;
	::MessageBeep(MB_ICONERROR);
	::SendMessage(m_frame,AU::WM_SETSTATUSTEXT,0,
	  (LPARAM)(const TCHAR *)eh->m_msg);
      } else
	U::ReportError(hr);
      return false;
    }

    if (fValidateOnly) 
	{
		wchar_t buf[MAX_LOAD_STRING + 1];
		::LoadString(_Module.GetResourceInstance(), IDS_SB_NO_ERR, buf, MAX_LOAD_STRING);
		::SendMessage(m_frame,AU::WM_SETSTATUSTEXT, 0, (LPARAM)buf);
		::MessageBeep(MB_OK);
		return true;
    }

    // ok, it seems valid, put it int6o document then
    dom->setProperty(L"SelectionLanguage",L"XPath");
    CString   nsprop(L"xmlns:fb='");
    nsprop+=(const wchar_t *)FBNS;
    nsprop+=L"' xmlns:xlink='";
    nsprop+=(const wchar_t *)XLINKNS;
    nsprop+=L"'";
    dom->setProperty(L"SelectionNamespaces",(const TCHAR *)nsprop);

    // transform to html
	CComDispatchDriver	body(m_body.Script());
	CComVariant		    args[2];
	args[1]=dom.GetInterfacePtr();
	args[0] = _Settings.GetInterfaceLanguageName();
	CheckError(body.InvokeN(L"LoadFromDOM", args, 2));
	m_body.Init();
    /*TransformXML(LoadXSL(_T("description.xsl")),dom,m_desc);

    // wait until it loads
    MSG msg;

    while (!m_desc.Loaded() && ::GetMessage(&msg,NULL,0,0)) {
      ::TranslateMessage(&msg);
      ::DispatchMessage(&msg);
    }

    // initialize view
    m_desc.Init();

    // store binaries
    CComDispatchDriver	  desc(m_desc.Script());
    _variant_t	    arg(dom.GetInterfacePtr());
    desc.Invoke1(L"PutBinaries",&arg);

    // transform to html
    TransformXML(LoadXSL(_T("body.xsl")),dom,m_body);
	

    // wait until it loads
    while (!m_body.Loaded() && ::GetMessage(&msg,NULL,0,0)) {
      ::TranslateMessage(&msg);
      ::DispatchMessage(&msg);
    }

    // initialize view
    m_body.Init();*/

    // mark unchanged
    MarkSavePoint();
  }
  catch (_com_error& e) {
    U::ReportError(e);
    return false;
  }

  return true;
}

void Doc::SaveSelectedPos()
{
	MSHTML::IHTMLElementPtr selected = m_body.SelectionStructCon();

	// генерим UUID
	UUID	      uuid;
	wchar_t *str;
	if (UuidCreate(&uuid)==RPC_S_OK && UuidToStringW(&uuid,&str)==RPC_S_OK) 
	{
		m_save_marker = str;
	}
	else
	{
		return;
	}
	selected->setAttribute(L"fbe_selected", m_save_marker, 0);
	m_saved_element = selected;
}

long Doc::GetSavedPos(bstr_t &xml, bool deleteMarker)
{
	bstr_t searchString = L" selected=\"" + m_save_marker + L"\"";
	const wchar_t* wpos = wcsstr(xml.operator const wchar_t *(), searchString);
	if(!wpos)
	{
		return 0;
	}
	int pos = wpos - (wchar_t*)xml;
	
	if(deleteMarker)
	{
		wchar_t* Buf = new wchar_t[xml.length() + 1];
		wcsncpy(Buf, xml, pos);
		wcscpy(Buf + pos, (wchar_t*)xml + pos + searchString.length());		
		Buf[xml.length() - searchString.length()] = 0;
		xml = Buf;
		delete[] Buf;
	}
	return pos;
}

void Doc::DeleteSaveMarker()
{
	m_saved_element->removeAttribute(L"fbe_selected", 1);
}



/*class SAXContentHandler:public CComObjectRoot, public MSXML2::ISAXContentHandler
{
private:
	MSXML2::ISAXContentHandlerPtr m_writer;

public:
	SAXContentHandler::SAXContentHandler():m_writer(0){}
	SAXContentHandler::~SAXContentHandler()
	{
	}

	BEGIN_COM_MAP(SAXContentHandler)
		COM_INTERFACE_ENTRY(MSXML2::ISAXContentHandler)
	END_COM_MAP()

	void SetWriter(MSXML2::ISAXContentHandlerPtr writer)
	{
		 m_writer = writer;
	}
	
	STDMETHOD(raw_characters)(wchar_t * pwchChars,int cchChars)
	{
		 return m_writer->raw_characters(pwchChars, cchChars);
	}
    
	STDMETHOD(raw_endDocument)()
	{
		return m_writer->raw_endDocument();
	}

	STDMETHOD(raw_startDocument)()
	{
		return m_writer->raw_startDocument();
	}

	STDMETHOD(raw_endElement)(wchar_t * pwchNamespaceUri, int cchNamespaceUri,  wchar_t * pwchLocalName, int cchLocalName, wchar_t * pwchQName, int cchQName)
	{
		return m_writer->raw_endElement(pwchNamespaceUri, cchNamespaceUri, pwchLocalName, cchLocalName, pwchQName, cchQName);
	}

	STDMETHOD(raw_startElement)(wchar_t * pwchNamespaceUri, int cchNamespaceUri, wchar_t * pwchLocalName, int cchLocalName, wchar_t * pwchQName, int cchQName, MSXML2::ISAXAttributes * pAttributes)
	{
		return m_writer->raw_startElement(pwchNamespaceUri, cchNamespaceUri, pwchLocalName, cchLocalName, pwchQName, cchQName,pAttributes);
	}
 	STDMETHOD(raw_ignorableWhitespace)(wchar_t * pwchChars, int cchChars)
	{
		return m_writer->raw_ignorableWhitespace(pwchChars, cchChars);
	}
 	STDMETHOD(raw_endPrefixMapping)(wchar_t * pwchPrefix, int cchPrefix)
	{
		return m_writer->raw_endPrefixMapping(pwchPrefix, cchPrefix);
	}
 	STDMETHOD(raw_startPrefixMapping)(wchar_t * pwchPrefix, int cchPrefix, wchar_t * pwchUri, int cchUri)
	{
		return m_writer->raw_startPrefixMapping(pwchPrefix, cchPrefix, pwchUri, cchUri);
	}
 	STDMETHOD(raw_processingInstruction)(wchar_t * pwchTarget, int cchTarget, wchar_t * pwchData, int cchData)
	{
		return m_writer->raw_processingInstruction(pwchTarget, cchTarget, pwchData, cchData);
	}
 	STDMETHOD(raw_skippedEntity)(wchar_t * pwchName, int cchName)
	{
		return m_writer->raw_skippedEntity(pwchName, cchName);
	}

	STDMETHOD(raw_putDocumentLocator)(MSXML2::ISAXLocator * pLocatore)
	{
		return m_writer->raw_putDocumentLocator(pLocatore);
	}
};*/

bool Doc::TextToXML(BSTR text, MSXML2::IXMLDOMDocument2Ptr* xml)
{
	MSXML2::IXMLDOMSchemaCollection2Ptr	scol;
    CheckError(scol.CreateInstance(L"Msxml2.XMLSchemaCache.4.0"));

    // load fictionbook schema
	scol->add(FBNS,(const wchar_t *)U::GetProgDirFile(L"FictionBook.xsd"));

    // create a SAX reader
    MSXML2::ISAXXMLReaderPtr	  rdr;
    CheckError(rdr.CreateInstance(L"Msxml2.SAXXMLReader.4.0"));

    // attach a schema
    rdr->putFeature(L"schema-validation",VARIANT_TRUE);
    rdr->putProperty(L"schemas",scol.GetInterfacePtr());
    rdr->putFeature(L"exhaustive-errors",VARIANT_TRUE);

    // create an error handler
    CComObject<SAXErrorHandler>	  *ehp;
    CheckError(CComObject<SAXErrorHandler>::CreateInstance(&ehp));
    CComPtr<CComObject<SAXErrorHandler> > eh(ehp);
    rdr->putErrorHandler(eh);

    *xml=U::CreateDocument(true);

    // construct an xml writer
    MSXML2::IMXWriterPtr	wrt;
    CheckError(wrt.CreateInstance(L"Msxml2.MXXMLWriter.4.0"));

    // connect document to the writer
    wrt->output=xml->GetInterfacePtr();
    
    // connect the writer to the reader
	rdr->putContentHandler(MSXML2::ISAXContentHandlerPtr(wrt));
	
    // now parse it!
    // oh well, let's waste more memory
    
    VARIANT vt;
    V_VT(&vt)=VT_BSTR;
    V_BSTR(&vt)=text;
    HRESULT hr=rdr->raw_parse(vt);
    //::VariantClear(&vt);

	bstr_t msg = eh->m_msg;
    if (FAILED(hr)) 
	{
      if (!eh->m_msg.IsEmpty()) 
	  {
		// record error position
		int errline = eh->m_line;
		int errcol = eh->m_col;
		::MessageBeep(MB_ICONERROR);
		::SendMessage(m_frame,AU::WM_SETSTATUSTEXT,0,
		(LPARAM)(const TCHAR *)eh->m_msg);
      } 
	  else
	  {
		U::ReportError(hr);
	  }
      return false;
    }

    // ok, it seems valid, put it into document then
    (*xml)->setProperty(L"SelectionLanguage",L"XPath");
    CString   nsprop(L"xmlns:fb='");
    nsprop+=(const wchar_t *)FBNS;
    nsprop+=L"' xmlns:xlink='";
    nsprop+=(const wchar_t *)XLINKNS;
    nsprop+=L"'";
	(*xml)->setProperty(L"SelectionNamespaces",(const TCHAR *)nsprop);

	return true;
}

void Doc::MoveNode(MSHTML::IHTMLDOMNodePtr from, MSHTML::IHTMLDOMNodePtr to, MSHTML::IHTMLDOMNodePtr insertBefore)
{
	VARIANT disp;
	MSHTML::IHTMLElementPtr elem = (MSHTML::IHTMLElementPtr)to;
	bstr_t text = elem->innerHTML;
	
	// пропускаем title
	if((bool)insertBefore)
	{
		while(1)
		{
			MSHTML::IHTMLElementPtr elem = (MSHTML::IHTMLElementPtr)insertBefore;	
			_bstr_t class_name(elem->className);	
			if(
				(0 == U::scmp(class_name, L"title"))
				|| (0 == U::scmp(class_name, L"epigraph"))
				|| (0 == U::scmp(class_name, L"annotation"))
				|| (0 == U::scmp(class_name, L"image"))
				)
			{
				insertBefore = insertBefore->nextSibling;
				continue;
			}
			break;
		}
	}

	if((bool)insertBefore)
	{
		disp.pdispVal = insertBefore;
		disp.vt = VT_DISPATCH;
		to->insertBefore(from, disp);
	}
	else
	{
		to->appendChild(from);
	}

	text = elem->innerHTML;
	return;
}

void Doc::FastMode()
{	
	CComDispatchDriver	body(m_body.Script());
	CComVariant		    args[1];
	args[0]=m_fast_mode;
	CheckError(body.Invoke1(L"apiSetFastMode",&args[0]));
	return;
}

void Doc::SetFastMode(bool fast)
{
	m_fast_mode = fast;
	if(m_body != 0)
		FastMode();
}

bool Doc::GetFastMode()
{
	return m_fast_mode;
}

int Doc::GetSelectedPos()
{
	MSHTML::IHTMLTxtRangePtr rng(m_body.Document()->selection->createRange());
	if(!bool(rng))
		return 0;

	int len = 0;
	while(1)
	{
		int moved = rng->move(L"character", -100000);
		len -= moved;
		if(moved != -100000)
		{
			bstr_t text(rng->text);
			return len;
		}
	}

	return len;
}

CString Doc::GetOpenFileName()const
{
	if(m_filename == L"Untitled.fb2")
        return L"";
	else
		return m_filename;
}

} // namespace
