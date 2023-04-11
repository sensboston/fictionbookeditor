#include "stdafx.h"

#include "ElementDescMnr.h"

#include "utils.h"
#include "apputils.h"
#include "Settings.h"
#include "mainfrm.h"

extern CSettings _Settings;

const int IMG_ID_BODY = 0;
const int IMG_ID_SECTION = 0;
const int IMG_ID_IMAGE = 3;
const int IMG_ID_POEM = 3;

CElementDescMnr _EDMnr;

bool IsDiv(MSHTML::IHTMLElementPtr elem, CString className)
{
	if(U::scmp(elem->tagName, L"DIV") == 0 && U::scmp(elem->className, className) == 0)
		return true;

	return false;
}

bool IsP(MSHTML::IHTMLElementPtr elem, CString className)
{
	if(U::scmp(elem->tagName, L"P") == 0 && U::scmp(elem->className, className) == 0)
		return true;

	return false;
}

// added by SeNS
bool IsStylesheet(MSHTML::IHTMLElementPtr elem)
{
	return (U::scmp(elem->className, L"stylesheet") == 0);
}

bool IsStyle(MSHTML::IHTMLElementPtr elem)
{
	CString outerHTML = elem->outerHTML;
	outerHTML.MakeLower();
	return (outerHTML.Find(L"<span class=") == 0);
}

CString GetStylesheetTitle(const MSHTML::IHTMLElementPtr elem)
{
	return L"";
}

bool IsSection(MSHTML::IHTMLElementPtr elem)
{
	return IsDiv(elem, L"section");
}

CString GetSectionTitle(const MSHTML::IHTMLElementPtr elem)
{
	return U::FindTitle(elem);
}

bool IsBody(MSHTML::IHTMLElementPtr elem)
{
	return IsDiv(elem, L"body");
}

CString GetBodyTitle(const MSHTML::IHTMLElementPtr elem)
{
	CString caption;
	caption = AU::GetAttrCS(elem, L"fbname");
	U::NormalizeInplace(caption);
	if (caption.IsEmpty())
		caption = U::FindTitle(elem);
	return caption;
}

bool IsImage(MSHTML::IHTMLElementPtr elem)
{
//	return IsDiv(elem, L"image");
	return (U::scmp(elem->className, L"image") == 0);
}

CString GetImageTitle(const MSHTML::IHTMLElementPtr elem)
{
	return U::GetImageFileName(elem);
}

bool IsAnnotation(MSHTML::IHTMLElementPtr elem)
{
	return IsDiv(elem, L"annotation");
}

CString GetAnnotationTitle(const MSHTML::IHTMLElementPtr elem)
{
	return L"";
}

bool IsHistory(MSHTML::IHTMLElementPtr elem)
{
	return IsDiv(elem, L"history");
}

CString GetHistoryTitle(const MSHTML::IHTMLElementPtr elem)
{
	return L"";
}

bool IsPoem(MSHTML::IHTMLElementPtr elem)
{
	return IsDiv(elem, L"poem");
}

CString GetPoemTitle(const MSHTML::IHTMLElementPtr elem)
{
	return U::FindTitle(elem);
}

bool IsStanza(MSHTML::IHTMLElementPtr elem)
{
	return IsDiv(elem, L"stanza");
}

CString GetStanzaTitle(const MSHTML::IHTMLElementPtr elem)
{
	return U::FindTitle(elem);
}

bool IsTitle(MSHTML::IHTMLElementPtr elem)
{
	return IsDiv(elem, L"title");
}

CString GetTitleTitle(const MSHTML::IHTMLElementPtr elem)
{
	return U::FindTitle(elem);
}

bool IsEpigraph(MSHTML::IHTMLElementPtr elem)
{
	return IsDiv(elem, L"epigraph");
}

CString GetEpigraphTitle(const MSHTML::IHTMLElementPtr elem)
{
	return U::FindTitle(elem);
}

bool IsCite(MSHTML::IHTMLElementPtr elem)
{
	return IsDiv(elem, L"cite");
}

CString GetCiteTitle(const MSHTML::IHTMLElementPtr elem)
{
	return U::FindTitle(elem);
}

bool IsCode(MSHTML::IHTMLElementPtr elem)
{
	return IsDiv(elem, L"code");
}

CString GetCodeTitle(const MSHTML::IHTMLElementPtr elem)
{
	return U::FindTitle(elem);
}

bool IsSubtitle(MSHTML::IHTMLElementPtr elem)
{
	return IsP(elem, L"subtitle");
}

CString GetSubtitleTitle(const MSHTML::IHTMLElementPtr elem)
{
	return U::FindTitle(elem);
}

bool IsTable(MSHTML::IHTMLElementPtr elem)
{
	return IsDiv(elem, L"table");
}

bool IsTH(MSHTML::IHTMLElementPtr elem)
{
	return IsP(elem, L"th");
}

bool IsTD(MSHTML::IHTMLElementPtr elem)
{
	return IsP(elem, L"td");
}

bool IsTR(MSHTML::IHTMLElementPtr elem)
{
	return IsP(elem, L"tr");
}

CString GetTableTitle(const MSHTML::IHTMLElementPtr elem)
{
	return U::FindTitle(elem);
}

CElementDescMnr::CElementDescMnr() : m_initedStEDs(false)
{
}

// Init uses Settings to get information about each item in its list,
// but until Settings are deserialized, that information is reflected
// by CSettings::GetDocTreeItemState via variable which is set to
// CElementDescriptor constructor. On the other hand information about
// serialized fields and default values is collected after initiation, but not before.
// Though we have to assign really deserialized values during creation of CTreeWithToolBar
// explicitly calling information on CSettings::TREEITEMSHOWINFO instance via the same
// CSettings::GetDocTreeItemState. That is non-obvious but works!
bool CElementDescMnr::InitStandartEDs()
{
	if(!m_initedStEDs)
	{
		// SeNS
		CElementDescriptor* stylesheet = new CElementDescriptor;
		stylesheet->Init(IsStylesheet, GetStylesheetTitle, 0, false, L"Stylesheet");
		CElementDescriptor* style = new CElementDescriptor;
		style->Init(IsStyle, GetStylesheetTitle, 0, false, L"Style");

		CElementDescriptor* section = new CElementDescriptor;
		section->Init(IsSection, GetSectionTitle, 0, true, L"Section");
		CElementDescriptor* body = new CElementDescriptor;
		body->Init(IsBody, GetBodyTitle, 0, true, L"Body");
		CElementDescriptor* image = new CElementDescriptor;
		image->Init(IsImage, GetImageTitle, 21, true, L"Image");
		CElementDescriptor* annotation = new CElementDescriptor;
		annotation->Init(IsAnnotation, GetAnnotationTitle, 12, true, L"Annotation");
		CElementDescriptor* history = new CElementDescriptor;
		history->Init(IsHistory, GetHistoryTitle, 15, true, L"History");
		CElementDescriptor* poem = new CElementDescriptor;
		poem->Init(IsPoem, GetPoemTitle, 3, true, L"Poem");
		CElementDescriptor* stanza = new CElementDescriptor;
		stanza->Init(IsStanza, GetStanzaTitle, 3, true, L"Stanza");
		CElementDescriptor* title = new CElementDescriptor;
		title->Init(IsTitle, GetTitleTitle, 27, false, L"Title");
		CElementDescriptor* epigraph = new CElementDescriptor;
		epigraph->Init(IsEpigraph, GetEpigraphTitle, 18, false, L"Epigraph");
		CElementDescriptor* cite = new CElementDescriptor;
		cite->Init(IsCite, GetCiteTitle, 9, false, L"Cite");
		// issue #83
/*		CElementDescriptor* code = new CElementDescriptor;
		code->Init(IsCode, GetCodeTitle, 24, false, L"Code"); */
		CElementDescriptor* subtitle = new CElementDescriptor;
		subtitle->Init(IsSubtitle, GetSubtitleTitle, 6, true, L"Subtitle");
		CElementDescriptor* table = new CElementDescriptor;
		table->Init(IsTable, GetTableTitle, 30, true, L"Table");
		CElementDescriptor* th = new CElementDescriptor;
		th->Init(IsTH, GetTableTitle, 27, true, L"th");
		CElementDescriptor* td = new CElementDescriptor;
		td->Init(IsTD, GetTableTitle, 27, true, L"td");
		CElementDescriptor* tr = new CElementDescriptor;
		tr->Init(IsTR, GetTableTitle, 27, true, L"tr");

		m_stEDs.Add(stylesheet);	// SeNS
		m_stEDs.Add(style);

		m_stEDs.Add(section);
		m_stEDs.Add(body);
		m_stEDs.Add(image);
		m_stEDs.Add(annotation);
		m_stEDs.Add(history);
		m_stEDs.Add(poem);
		m_stEDs.Add(stanza);
		m_stEDs.Add(title);
		m_stEDs.Add(epigraph);
		m_stEDs.Add(cite);
//		m_stEDs.Add(code);	// issue #83
		m_stEDs.Add(subtitle);
		m_stEDs.Add(table);
		m_stEDs.Add(th);
		m_stEDs.Add(td);
		m_stEDs.Add(tr);

		m_initedStEDs = true;
	}

	return true;
}

bool CElementDescMnr::InitScriptEDs()
{
	CElementDescriptor* ED;

	WIN32_FIND_DATA fd;
	int newid = 1;
	CString fff = U::GetDocTReeScriptsDir();
	HANDLE found = FindFirstFile(U::GetDocTReeScriptsDir() + L"\\*.js", &fd);
	if(INVALID_HANDLE_VALUE != found)
	{
		do
		{
			ED = new CElementDescriptor;
			if(ED->Load(U::GetDocTReeScriptsDir() + L"\\" + fd.cFileName))
			{
				m_EDs.Add(ED);
			}
			else
			{
				delete ED;
			}
		}
		while(FindNextFile(found, &fd));
	}
	return true;
}

bool CElementDescMnr::GetElementDescriptor(const MSHTML::IHTMLElementPtr elem, CElementDescriptor **desc) const
{
	for(int i = 0; i < m_stEDs.GetSize(); i++)
	{
		if(m_stEDs[i]->IsMe(elem))
		{
			*desc = m_stEDs[i];
			return true;
		}
	}

	for(int i = 0; i < m_EDs.GetSize(); i++)
	{
		if(m_EDs[i]->IsMe(elem))
		{
			*desc = m_EDs[i];
			return true;
		}
	}
	return false;
}

void CElementDescMnr::AddElementDescriptor(CElementDescriptor *desc)
{
	m_EDs.Add(desc);
}

CElementDescriptor* CElementDescMnr::GetStED(int index)
{
	return m_stEDs[index];
}

CElementDescriptor* CElementDescMnr::GetED(int index)
{
	return m_EDs[index];
}

int CElementDescMnr::GetEDsCount()
{
	return m_EDs.GetSize();
}

int CElementDescMnr::GetStEDsCount()
{
	return m_stEDs.GetSize();
}

void CElementDescMnr::CleanUpAll()
{
	for(int i = 0; i < m_EDs.GetSize(); i++)
	{
		m_EDs[i]->CleanUp();
	}
}

void CElementDescMnr::CleanTree()
{
	for(int i = 0; i < m_EDs.GetSize(); i++)
	{
		m_EDs[i]->CleanUp();
		m_EDs[i]->SetViewInTree(false);
	}
	for(int i = 0; i < m_stEDs.GetSize(); i++)
	{
		m_stEDs[i]->SetViewInTree(false);
	}
}
