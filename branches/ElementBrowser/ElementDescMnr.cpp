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
	return IsDiv(elem, L"image");
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

CElementDescMnr::CElementDescMnr()
{
}

bool CElementDescMnr::InitStandartEDs()
{
	CElementDescriptor* section = new CElementDescriptor;
	section->Init(IsSection, GetSectionTitle, 0, true, L"Section");
	CElementDescriptor* body = new CElementDescriptor;
	body->Init(IsBody, GetBodyTitle, 0, true, L"Body");
	CElementDescriptor* image = new CElementDescriptor;
	image->Init(IsImage, GetImageTitle, 3, true, L"Image");
	CElementDescriptor* annotation = new CElementDescriptor;
	annotation->Init(IsAnnotation, GetAnnotationTitle, 0, true, L"Annotation");
	CElementDescriptor* history = new CElementDescriptor;
	history->Init(IsHistory, GetHistoryTitle, 0, true, L"History");
	CElementDescriptor* poem = new CElementDescriptor;
	poem->Init(IsPoem, GetPoemTitle, 3, true, L"Poem");
	CElementDescriptor* stanza = new CElementDescriptor;
	stanza->Init(IsStanza, GetStanzaTitle, 3, true, L"Stanza");
	CElementDescriptor* title = new CElementDescriptor;
	title->Init(IsTitle, GetTitleTitle, 3, false, L"Title");
	CElementDescriptor* epigraph = new CElementDescriptor;
	epigraph->Init(IsEpigraph, GetEpigraphTitle, 0, false, L"Epigraph");
	CElementDescriptor* cite = new CElementDescriptor;
	cite->Init(IsCite, GetCiteTitle, 3, false, L"Cite");
	CElementDescriptor* code = new CElementDescriptor;
	code->Init(IsCode, GetCodeTitle, 3, false, L"Code");
	CElementDescriptor* subtitle = new CElementDescriptor;
	subtitle->Init(IsSubtitle, GetSubtitleTitle, 6, true, L"Code");
	CElementDescriptor* table = new CElementDescriptor;
	table->Init(IsTable, GetTableTitle, 3, true, L"Table");
	CElementDescriptor* th = new CElementDescriptor;
	th->Init(IsTH, GetTableTitle, 3, true, L"th");
	CElementDescriptor* td = new CElementDescriptor;
	td->Init(IsTD, GetTableTitle, 3, true, L"td");
	CElementDescriptor* tr = new CElementDescriptor;
	tr->Init(IsTR, GetTableTitle, 3, true, L"tr");

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
	m_stEDs.Add(code);
	m_stEDs.Add(subtitle);
	m_stEDs.Add(table);
	m_stEDs.Add(th);
	m_stEDs.Add(td);
	m_stEDs.Add(tr);

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