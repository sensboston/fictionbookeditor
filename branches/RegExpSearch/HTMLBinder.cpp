#include "stdafx.h"
#include "HTMLBinder.h"

HTMLBinder::HTMLBinder(wchar_t* tag, FB::Doc* activeDoc, MSHTML::IHTMLDOMNodePtr ownerNode): 
						currDoc(activeDoc),
						mkTag(tag),
						globalNode(ownerNode)
{
	try
	{
		currNode = GetSelectedNode();
	}
	catch(_com_error& err)
	{
		U::ReportError(err);
	}
}

MSHTML::IHTMLDOMNodePtr HTMLBinder::GetSelectedNode()
{
	try
	{
		MSHTML::IHTMLElementPtr currElem = currDoc->m_body.SelectionStructNearestPrg();
		if(currElem == NULL || U::scmp(currElem->tagName, L"P") || !currElem->innerHTML.GetBSTR())
			return currNode = FindFirstNode();
		else return currElem;
	}
	catch(_com_error& err)
	{
		U::ReportError(err);
	}
}

MSHTML::IHTMLDOMNodePtr HTMLBinder::FindFirstNode()
{
	try
	{
		MSHTML::IHTMLElementCollectionPtr elements = globalNode->getElementsByTagName(mkTag);

		if(elements && elements->length > 0)
		{
			for(int i = 0; i < elements->length; ++i)
			{
				_bstr_t innerHTML = MSHTML::IHTMLElementPtr(elements->item(i))->innerHTML;
				if(innerHTML.GetBSTR())
					return currNode = elements->item(i);
			}
		}

		return NULL;
	}
	catch(_com_error& err)
	{
		U::ReportError(err);
	}
}

HRESULT HTMLBinder::SetNextNode(unsigned int step)
{
	try
	{
		MSHTML::IHTMLElementCollectionPtr elements = MSHTML::IHTMLElement2Ptr(globalNode)->getElementsByTagName(mkTag);
		currNode = GetSelectedNode();

		long len = elements->length;
		for(int i = 0; i < elements->length; ++i)
		{
			if(currNode == elements->item(i))
			{
				if((i + step) < elements->length
					&& MSHTML::IHTMLElementPtr(elements->item(i + step))->innerHTML.GetBSTR())
				{
					currNode = elements->item(i + step);
					return S_OK;
				}
				else
				{
					for(int j = i; j < elements->length; ++j)
					{
						if((j + step) < elements->length
							&& MSHTML::IHTMLElementPtr(elements->item(j + step))->innerHTML.GetBSTR())
						{
							currNode = elements->item(j + step);
							return S_OK;
						}
					}

					break;
				}
			}
		}

		currNode = FindFirstNode();
		return S_OK;
	}
	catch(_com_error& err)
	{
		U::ReportError(err);
		return E_FAIL;
	}
}

//HRESULT HTMLBinder::SetPrevNode(unsigned int step)
//{
//	nodes = MSHTML::IHTMLElement2Ptr(global_node)->getElementsByTagName(mk_tag);
//	if(nodes && nodes->length > 0)
//	{
//		current_node = nodes->item(0);
//		return S_OK;
//	}
//	else
//		current_node = NULL;
//
//	current_idx = 0;
//	return E_FAIL;
//}

std::wstring HTMLBinder::ParseCurrentNode()
{
	if(currNode)
	{
		try
		{		
			/*MSHTML::IMarkupServicesPtr mkSrv = currDoc->m_body.Document();
			pointedDocString.clear();

			MSHTML::IMarkupPointerPtr mkPtr;
			mkSrv->CreateMarkupPointer(&mkPtr);
			MSHTML::IHTMLElementPtr currentElem = currNode;
			mkPtr->MoveAdjacentToElement(currentElem, MSHTML::ELEM_ADJ_AfterBegin);
			_bstr_t innerHTML = currentElem->innerHTML;

			for(int i = 0; i < innerHTML.length(); ++i)
			{
				CharPointer temp;
				long cch = 1;
				temp.letter = innerHTML.GetBSTR()[i];
				if(temp.letter == L'<')
				{
					while(innerHTML.GetBSTR()[i] != L'>' && i < innerHTML.length())
					{
						++i;
						mkPtr->right(TRUE, NULL, NULL, &cch, NULL);
					}
				}
				else if(temp.letter == L'&')
				{
					temp.letter = L' ';
					mkSrv->CreateMarkupPointer(&temp.pointer);
					temp.pointer->MoveToPointer(mkPtr);

					while(innerHTML.GetBSTR()[i] != L';' && i < innerHTML.length())
					{
						++i;
					}

					pointedDocString.push_back(temp);
					mkPtr->right(TRUE, NULL, NULL, &cch, NULL);
				}
				else
				{
					mkSrv->CreateMarkupPointer(&temp.pointer);
					temp.pointer->MoveToPointer(mkPtr);
					mkPtr->right(TRUE, NULL, NULL, &cch, NULL);

					pointedDocString.push_back(temp);
				}
			}

			CharPointer term = {L'\0', mkPtr};
			pointedDocString.push_back(term);

			MSHTML::IHTMLTxtRangePtr txt_range(MSHTML::IHTMLBodyElementPtr(currDoc->m_body.Document()->body)->createTextRange());
			mkSrv->MoveRangeToPointers(pointedDocString.at(0).pointer, pointedDocString.at(pointedDocString.size()-2).pointer, txt_range);
			txt_range->select();

			std::wstring temp;
			for(int i = 0; i< pointedDocString.size(); ++i)
				temp += pointedDocString[i].letter;
			
			return temp;*/

			MSHTML::IHTMLElementPtr currElem = currNode;
			std::wstring temp(currElem->innerText);

			return temp;
		}
		catch(_com_error& err)
		{
			U::ReportError(err);
		}
	}
	else
		return std::wstring();
}

