#include "stdafx.h"

#include "apputils.h"
#include "utils.h"

#include "ElementDescriptor.h"
#include "FBDoc.h"
#include "Settings.h"

extern CSettings _Settings;

const int IMG_ID_BODY = 0;
const int IMG_ID_SECTION = 0;
const int IMG_ID_IMAGE = 3;
const int IMG_ID_POEM = 3;


CString GetTitleSc(const MSHTML::IHTMLElementPtr elem)
{
	CString text = elem->innerText;
	text = text.Left(20) + L"...";
	U::NormalizeInplace(text);
	return text;
}

///===================================================================================
// CElementDescriptor

CElementDescriptor::CElementDescriptor()
{
}

bool CElementDescriptor::Init(FN_IsMe fn1, FN_GetTitle fn2, int imageID, bool default_state, CString caption)
{
	m_script = false;
	m_getTitle = fn2;
	m_isMe = fn1;
	m_imageID = imageID;
	m_viewInTree = _Settings.GetDocTreeItemState(caption, default_state);
	m_caption = caption;
	return true;
}

bool CElementDescriptor::Load(CString path)
{
	m_script = true;
	CString noExt = path.Left(path.ReverseFind(L'.'));
	m_caption = noExt.Right(noExt.GetLength() - noExt.ReverseFind(L'\\') - 1);
	CString folder = path.Left(path.ReverseFind((L'\\'))+ 1);
	m_script_path = path;
	m_viewInTree = false;
	m_imageID = 0;
	m_class_name = AskClassName();
	m_getTitle = (FN_GetTitle)GetTitleSc;
	m_picture = 0;
	m_imageID = 9;
	if(m_class_name.GetLength() == 0)
		return false;
	
	WIN32_FIND_DATA picFd;
	wchar_t* picName = new wchar_t[path.GetLength() + 1];
	wcscpy(picName, m_caption);

	CString picPathNoExt = (folder + picName);
	HANDLE hPicture = FindFirstFile(picPathNoExt + L".bmp", &picFd);
	HANDLE hIcon = FindFirstFile(picPathNoExt + L".ico", &picFd);

	if(hPicture != INVALID_HANDLE_VALUE)
	{
		HBITMAP bitmap = (HBITMAP)LoadImage(NULL, (picPathNoExt + L".bmp").GetBuffer(), IMAGE_BITMAP, 0, 0, LR_LOADFROMFILE);
		if(bitmap != NULL)
		{
			m_picture = bitmap;	
			m_pictType = 0;
		}							
	}
	else if(hIcon != INVALID_HANDLE_VALUE)
	{
		HICON icon = (HICON)LoadImage(NULL, (picPathNoExt + L".ico").GetBuffer(), IMAGE_ICON, 0, 0, LR_LOADFROMFILE);
		if(icon != NULL)
		{
			m_picture = icon;	
			m_pictType = 1;
		}							
	}

	FindClose(hPicture);
	FindClose(hIcon);
	delete[] picName;

	return true;
}

CString CElementDescriptor::AskClassName()
{
	CComVariant vtResult;
	CComVariant params(m_script_path);	
	FB::Doc::m_active_doc->InvokeFunc(L"apiGetClassName", &params, 1, vtResult);	
	return vtResult.bstrVal;
}

bool CElementDescriptor::ViewInTree()
{
	return m_viewInTree;
}

int CElementDescriptor::GetDTImageID()
{
	return m_imageID;
}

bool CElementDescriptor::IsMe(const MSHTML::IHTMLElementPtr elem)
{
	if(m_script)
	{
		if(U::scmp(elem->className, m_class_name) == 0)
			return true;
		return false;
	}
	else
	{
		return m_isMe(elem);
	}
}

CString CElementDescriptor::GetTitle(const MSHTML::IHTMLElementPtr elem)
{
	return m_getTitle(elem);
}

CString CElementDescriptor::GetCaption()
{
	return m_caption;
}

void CElementDescriptor::SetViewInTree(bool view)
{
	m_viewInTree = view;
	_Settings.SetDocTreeItemState(m_caption, view);
}

void CElementDescriptor::ProcessScript()
{
	if(!m_script)
		return;

	CComVariant vtResult;
	CComVariant params(m_script_path);	
	FB::Doc::m_active_doc->InvokeFunc(L"apiProcessCmd", &params, 1, vtResult);
}

void CElementDescriptor::CleanUp()
{
	if(!m_script)
		return;

	CComVariant vtResult;
	CComVariant params(m_class_name);	
	FB::Doc::m_active_doc->InvokeFunc(L"apiCleanUp", &params, 1, vtResult);
}

bool CElementDescriptor::GetPic(HANDLE& handle, int& type)
{
	if(!m_picture)
		return false;
	handle = m_picture;
	type = m_pictType;
	return true;
}

void CElementDescriptor::SetImageID(int ID)
{
	m_imageID = ID;
}

/*///===================================================================================
// CBodyED
bool CBodyED::IsMe(const MSHTML::IHTMLElementPtr elem)
{
	CString tagName = elem->tagName;
	CString className = elem->className;
	if(tagName == L"DIV" && className == L"body")
		return true;

	return false;
}

CString CBodyED::GetElementCaption(const MSHTML::IHTMLElementPtr elem)
{
	CString txt=AU::GetAttrCS(elem,L"fbname");
    U::NormalizeInplace(txt);
    if (txt.IsEmpty())
	{
		txt = FindTitle(elem);
	}
	return txt;
}

int CBodyED::GetDTImageID()
{
	return IMG_ID_BODY;
}

///=====================================================================================
// CSectionED
bool CSectionED::IsMe(const MSHTML::IHTMLElementPtr elem)
{
	CString tagName = elem->tagName;
	CString className = elem->className;
	if(tagName == L"DIV" && className == L"section")
		return true;

	return false;
}

CString CSectionED::GetElementCaption(const MSHTML::IHTMLElementPtr elem)
{
	return FindTitle(elem);
}

int CSectionED::GetDTImageID()
{
	return IMG_ID_SECTION;
}


///=====================================================================================
// CImageED 

bool CImageED::IsMe(const MSHTML::IHTMLElementPtr elem)
{
	CString tagName = elem->tagName;
	CString className = elem->className;
	if(tagName == L"DIV" && className == L"image")
		return true;

	return false;
}

CString CImageED::GetElementCaption(const MSHTML::IHTMLElementPtr elem)
{
	return FindTitle(elem);
}

int CImageED::GetDTImageID()
{
	return IMG_ID_IMAGE;
}

///=====================================================================================
// CPoemED 

bool CPoemED::IsMe(const MSHTML::IHTMLElementPtr elem)
{
	CString tagName = elem->tagName;
	CString className = elem->className;
	if(tagName == L"DIV" && (className == L"poem" || className == L"stanza"))
		return true;

	return false;
}

CString CPoemED::GetElementCaption(const MSHTML::IHTMLElementPtr elem)
{
	return GetImageFileName(elem);
}

int CPoemED::GetDTImageID()
{
	return IMG_ID_POEM;
}

///=====================================================================================
// вспомогательные функции

MSHTML::IHTMLElementPtr	CElementDescriptor::FindTitleNode(MSHTML::IHTMLDOMNodePtr elem) 
{
	MSHTML::IHTMLDOMNodePtr node(elem->firstChild);

	_bstr_t   cls(MSHTML::IHTMLElementPtr(elem)->className);

	if ((bool)node && node->nodeType==1 && U::scmp(node->nodeName,L"DIV")==0) 
	{
			_bstr_t   cls(MSHTML::IHTMLElementPtr(node)->className);
		if (U::scmp(cls,L"image")==0) {
			node=node->nextSibling;
		if (node->nodeType!=1 || U::scmp(node->nodeName,L"DIV"))
			return NULL;
		cls=MSHTML::IHTMLElementPtr(node)->className;
	}
	if (U::scmp(cls,L"title")==0)
		return MSHTML::IHTMLElementPtr(node);
}
return NULL;
}

CString	CElementDescriptor::FindTitle(MSHTML::IHTMLDOMNodePtr elem) 
{
	MSHTML::IHTMLElementPtr tn(FindTitleNode(elem));
	if (tn)
		return (const wchar_t *)tn->innerText;
	return CString();
}

CString CElementDescriptor::GetImageFileName(MSHTML::IHTMLDOMNodePtr elem)
{
	_bstr_t   cls(MSHTML::IHTMLElementPtr(elem)->className);
	if (U::scmp(cls,L"image") != 0)
		return L"";

	CString href(MSHTML::IHTMLElementPtr(elem)->getAttribute(L"href", 0));
	if(!href.GetLength())
		return L"";

	CString	name = href.Right(href.GetLength() - 1);
	return name;	
}*/