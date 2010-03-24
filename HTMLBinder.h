#pragma once

#include <string>
#include <vector>

#include "utils.h"
#include "FBDoc.h"

class CharPointer
{
public:
	wchar_t letter;
	MSHTML::IMarkupPointerPtr pointer;
};

class HTMLBinder
{
protected:
	FB::Doc* currDoc;
	MSHTML::IHTMLElement2Ptr globalNode;
	MSHTML::IHTMLDOMNodePtr currNode;

	wchar_t* mkTag;
	std::vector<CharPointer> pointedDocString;

public:
	HTMLBinder(wchar_t* nodeTag, FB::Doc*, MSHTML::IHTMLDOMNodePtr);
	std::wstring ParseCurrentNode();
	HRESULT SetNextNode(unsigned int step = 1);
	/*HRESULT SetPrevNode(unsigned int step = 1);
	unsigned int CountNodes();*/

protected:
	MSHTML::IHTMLDOMNodePtr FindFirstNode();
	MSHTML::IHTMLDOMNodePtr GetSelectedNode();
	/*HRESULT SetFirstNode();*/
	
	//MSHTML::IHTMLDOMNodePtr GetNextNode();
	//unsigned int CountNodes();
};