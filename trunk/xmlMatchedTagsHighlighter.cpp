//this file is part of notepad++
//Copyright (C)2003 Don HO <donho@altern.org>
//
//This program is free software; you can redistribute it and/or
//modify it under the terms of the GNU General Public License
//as published by the Free Software Foundation; either
//version 2 of the License, or (at your option) any later version.
//
//This program is distributed in the hope that it will be useful,
//but WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//GNU General Public License for more details.
//
//You should have received a copy of the GNU General Public License
//along with this program; if not, write to the Free Software
//Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.

#include "stdafx.h"
#include <algorithm>
#include "Scintilla.h"
#include "SciLexer.h"
#include "xmlMatchedTagsHighlighter.h"

int XmlMatchedTagsHighlighter::getFirstTokenPosFrom(int targetStart, int targetEnd, const char *token, pair<int, int> & foundPos)
{
	_pEditView->execute(SCI_SETTARGETSTART, targetStart);
	_pEditView->execute(SCI_SETTARGETEND, targetEnd);
	_pEditView->execute(SCI_SETSEARCHFLAGS, SCFIND_REGEXP);
	int posFind = _pEditView->execute(SCI_SEARCHINTARGET, (WPARAM)strlen(token), (LPARAM)token);
	if (posFind != -1)
	{
		foundPos.first = _pEditView->execute(SCI_GETTARGETSTART);
		foundPos.second = _pEditView->execute(SCI_GETTARGETEND);
	}
	return posFind;
}

TagCateg XmlMatchedTagsHighlighter::getTagCategory(XmlMatchedTagsPos & tagsPos, int curPos)
{
	pair<int, int> foundPos;

	int docLen = _pEditView->getCurrentDocLen();

	int gtPos = getFirstTokenPosFrom(curPos, 0, ">", foundPos);
	int ltPos = getFirstTokenPosFrom(curPos, 0, "<", foundPos);
	if (ltPos != -1)
	{
		if ((gtPos != -1) && (ltPos < gtPos))
			return outOfTag;

		// Now we are sure about that we are inside of tag
		// We'll try to determinate the tag category :
		// tagOpen : <Tag>, <Tag Attr="1" >
		// tagClose : </Tag>
		// tagSigle : <Tag/>, <Tag Attr="0" />
		int charAfterLt = _pEditView->execute(SCI_GETCHARAT, ltPos+1);
		if (!charAfterLt)
			return unknownPb;

		if ((char)charAfterLt == ' ')
			return invalidTag;

		// so now we are sure we have tag sign '<'
		// We'll see on the right
		int gtPosOnR = getFirstTokenPosFrom(curPos, docLen, ">", foundPos);
		int ltPosOnR = getFirstTokenPosFrom(curPos, docLen, "<", foundPos);

		if (gtPosOnR == -1)
			return invalidTag;

		if ((ltPosOnR != -1) && (ltPosOnR < gtPosOnR))
			return invalidTag;

		if ((char)charAfterLt == '/')
		{
			int char2AfterLt = _pEditView->execute(SCI_GETCHARAT, ltPos+1+1);

			if (!char2AfterLt)
				return unknownPb;

			if ((char)char2AfterLt == ' ')
				return invalidTag;

			tagsPos.tagCloseStart = ltPos;
			tagsPos.tagCloseEnd = gtPosOnR + 1;
			return tagClose;
		}
		else
		{
			// it's sure for not being a tagClose
			// So we determinate if it's tagSingle or tagOpen
			tagsPos.tagOpenStart = ltPos;
			tagsPos.tagOpenEnd = gtPosOnR + 1;

			int charBeforeLt = _pEditView->execute(SCI_GETCHARAT, gtPosOnR-1);
			if ((char)charBeforeLt == '/')
				return inSingleTag;

			return tagOpen;
		}
	}
		
	return outOfTag;
}

bool XmlMatchedTagsHighlighter::getMatchedTagPos(int searchStart, int searchEnd, const char *tag2find, const char *oppositeTag2find, vector<int> oppositeTagFound, XmlMatchedTagsPos & tagsPos)
{
	const bool search2Left = false;
	const bool search2Right = true;

	bool direction = searchEnd > searchStart;

	pair<int, int> foundPos;
	int ltPosOnR = getFirstTokenPosFrom(searchStart, searchEnd, tag2find, foundPos);
	if (ltPosOnR < 0)
		return false;

#if 0
	// if the tag is found in non html zone, we skip it
	const NppGUI & nppGUI = (NppParameters::getInstance())->getNppGUI();
	int idStyle = _pEditView->execute(SCI_GETSTYLEAT, ltPosOnR);
	if (!nppGUI._enableHiliteNonHTMLZone && (idStyle >= SCE_HJ_START || idStyle == SCE_H_COMMENT))
	{
		int start = (direction == search2Left)?foundPos.first:foundPos.second;
		int end = searchEnd;
		return getMatchedTagPos(start, end, tag2find, oppositeTag2find, oppositeTagFound, tagsPos);
	}
#endif

	TagCateg tc = outOfTag;
	if (direction == search2Left)
	{
		tc = getTagCategory(tagsPos, ltPosOnR+2);
		
		if (tc != tagOpen && tc != inSingleTag)
 			return false;
		if (tc == inSingleTag)
		{
			int start = foundPos.first;
			int end = searchEnd;
			return getMatchedTagPos(start, end, tag2find, oppositeTag2find, oppositeTagFound, tagsPos);
		}
	}

	pair<int, int> oppositeTagPos;
	int s = foundPos.first;
	int e = tagsPos.tagOpenEnd;
	if (direction == search2Left)
	{
		s = foundPos.second;
		e = tagsPos.tagCloseStart;
	}

	int ltTag = getFirstTokenPosFrom(s, e, oppositeTag2find, oppositeTagPos);

	if (ltTag == -1)
	{
		if (direction == search2Left)
		{
			return true;
		}
		else
		{
			tagsPos.tagCloseStart = foundPos.first;
			tagsPos.tagCloseEnd = foundPos.second;
			return true;
		}
	}
	else 
	{
		// RegExpr is "<tagName[ 	>]", found tag could be a openTag or singleTag
		// so we should make sure if it's a singleTag
		XmlMatchedTagsPos pos;
		if (direction == search2Right && getTagCategory(pos,ltTag+1) == inSingleTag)
		{
			for(;;)
			{
				ltTag = getFirstTokenPosFrom(ltTag, e, oppositeTag2find, oppositeTagPos);
				
				if (ltTag == -1)
				{
					tagsPos.tagCloseStart = foundPos.first;
					tagsPos.tagCloseEnd = foundPos.second;
					return true;
				}
				else 
				{
					if (getTagCategory(pos,ltTag+1) == inSingleTag)
					{
						continue;
					}

					if (!isInList(ltTag, oppositeTagFound))
					{
						oppositeTagFound.push_back(ltTag);
						break;
					}
				}
			}
			return getMatchedTagPos(foundPos.second, searchEnd, tag2find, oppositeTag2find, oppositeTagFound, tagsPos);
		}


		if (isInList(ltTag, oppositeTagFound))
		{
			for(;;)
			{
				ltTag = getFirstTokenPosFrom(ltTag, e, oppositeTag2find, oppositeTagPos);
				if (ltTag == -1)
				{
					if (direction == search2Left)
					{
						return true;
					}
					else
					{
						tagsPos.tagCloseStart = foundPos.first;
						tagsPos.tagCloseEnd = foundPos.second;
					}
					return true;
				}
				else if (!isInList(ltTag, oppositeTagFound))
				{
					oppositeTagFound.push_back(ltTag);
					break;
				}
				else
				{
					if (direction == search2Left)
					{
						XmlMatchedTagsPos tmpTagsPos;
						getTagCategory(tmpTagsPos, ltTag+1);
						ltTag = tmpTagsPos.tagCloseEnd;
					}
				}
			}
		}
		else
		{
			oppositeTagFound.push_back(ltTag);
		}
	}
	int start, end;
	if (direction == search2Left)
	{
		start = foundPos.first;
		end = searchEnd;
	}
	else
	{
		start = foundPos.second;
		end = searchEnd;
	}

	return getMatchedTagPos(start, end, tag2find, oppositeTag2find, oppositeTagFound, tagsPos);
}

bool XmlMatchedTagsHighlighter::getXmlMatchedTagsPos(XmlMatchedTagsPos & tagsPos)
{
	// get word where caret is on
	int caretPos = _pEditView->execute(SCI_GETCURRENTPOS);
	
	// if the tag is found in non html zone (include comment zone), then quit
//	const NppGUI & nppGUI = (NppParameters::getInstance())->getNppGUI();
	int idStyle = _pEditView->execute(SCI_GETSTYLEAT, caretPos);
//	if (!nppGUI._enableHiliteNonHTMLZone && (idStyle >= SCE_HJ_START || idStyle == SCE_H_COMMENT))
//		return false;

	int docLen = _pEditView->getCurrentDocLen();

	// determinate the nature of current word : tagOpen, tagClose or outOfTag
	TagCateg tagCateg = getTagCategory(tagsPos, caretPos);

	static const char tagNameChars[] = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-_:";

	switch (tagCateg)
	{
		case tagOpen : // if tagOpen search right
		{
			_pEditView->execute(SCI_SETWORDCHARS, 0, (LPARAM)tagNameChars);
			int startPos = _pEditView->execute(SCI_WORDSTARTPOSITION, tagsPos.tagOpenStart+1, true);
			int endPos = _pEditView->execute(SCI_WORDENDPOSITION, tagsPos.tagOpenStart+1, true);
			tagsPos.tagNameEnd = endPos;

			_pEditView->execute(SCI_SETCHARSDEFAULT);
			char * tagName = new char[endPos-startPos+1];

			_pEditView->getText(tagName, startPos, endPos);

			basic_string<char> closeTag = "</";
			closeTag += tagName;
			closeTag += "[ 	]*>";
			
			basic_string<char> openTag = "<";
			openTag += tagName;
			openTag += "[ 	>]";

			delete [] tagName;

			vector<int> passedTagList;
			return getMatchedTagPos(tagsPos.tagOpenEnd, docLen, closeTag.c_str(), openTag.c_str(), passedTagList, tagsPos);
		}

		case tagClose : // if tagClose search left
		{
			_pEditView->execute(SCI_SETWORDCHARS, 0, (LPARAM)tagNameChars);
			int startPos = _pEditView->execute(SCI_WORDSTARTPOSITION, tagsPos.tagCloseStart+2, true);
			int endPos = _pEditView->execute(SCI_WORDENDPOSITION, tagsPos.tagCloseStart+2, true);
			
			_pEditView->execute(SCI_SETCHARSDEFAULT);
			char * tagName = new char[endPos-startPos+1];
			_pEditView->getText(tagName, startPos, endPos);

			basic_string<char> openTag = "<";
			openTag += tagName;
			openTag += "[ 	>]";

			basic_string<char> closeTag = "</";
			closeTag += tagName;
			closeTag += "[ 	]*>";
			
			delete [] tagName;

			vector<int> passedTagList;
			bool isFound = getMatchedTagPos(tagsPos.tagCloseStart, 0, openTag.c_str(), closeTag.c_str(), passedTagList, tagsPos);
			if (isFound)
				tagsPos.tagNameEnd = tagsPos.tagOpenStart + 1 + (endPos - startPos);

			return isFound;
		}

		case inSingleTag : // if in single tag
		{
			_pEditView->execute(SCI_SETWORDCHARS, 0, (LPARAM)tagNameChars);
			int endPos = _pEditView->execute(SCI_WORDENDPOSITION, tagsPos.tagOpenStart+1, true);
			tagsPos.tagNameEnd = endPos;
			_pEditView->execute(SCI_SETCHARSDEFAULT);

			tagsPos.tagCloseStart = -1;
			tagsPos.tagCloseEnd = -1;
			return true;
		}
		default: // if outOfTag, just quit
			return false;
		
	}
	//return false;
}

vector< pair<int, int> > XmlMatchedTagsHighlighter::getAttributesPos(int start, int end)
{
	vector< pair<int, int> > attributes;

	int bufLen = end - start + 1;
	char *buf = new char[bufLen+1];
	_pEditView->getText(buf, start, end);

	enum {\
		attr_invalid,\
		attr_key,\
		attr_pre_assign,\
		attr_assign,\
		attr_string,\
		attr_value,\
		attr_valid\
	} state = attr_invalid;

	int startPos = -1;
	int oneMoreChar = 1;
	int i = 0;
	for (; i < bufLen ; i++)
	{
		switch (buf[i])
		{
			case ' ':
			case '\t':
			case '\n':
			case '\r':
			{
				if (state == attr_key)
					state = attr_pre_assign;
				else if (state == attr_value)
				{
					state = attr_valid;
					oneMoreChar = 0;
				}
			}
			break;

			case '=':
			{
				if (state == attr_key || state == attr_pre_assign)
					state = attr_assign;
				else if (state == attr_assign || state == attr_value)
					state = attr_invalid;
			}
			break;

			case '"':
			{
				if (state == attr_string)
				{
					state = attr_valid;
					oneMoreChar = 1;
				}
				else if (state == attr_key || state == attr_pre_assign || state == attr_value)
					state = attr_invalid;
				else if (state == attr_assign)
					state = attr_string;
			}
			break;

			default:
			{
				if (state == attr_invalid)
				{
					state = attr_key;
					startPos = i;
				}
				else if (state == attr_pre_assign)
					state = attr_invalid;
				else if (state == attr_assign)
					state = attr_value;
			}
		}

		if (state == attr_valid)
		{
			attributes.push_back(pair<int, int>(start+startPos, start+i+oneMoreChar));
			state = attr_invalid;
		}
	}
	if (state == attr_value)
		attributes.push_back(pair<int, int>(start+startPos, start+i-1));

	delete [] buf;
	return attributes;
}

bool XmlMatchedTagsHighlighter::tagMatch(bool doHilite, bool doHiliteAttr, bool gotoTag) 
{
	bool bFound = false;

	// Clean up all marks of previous action
	_pEditView->clearIndicator(SCE_UNIVERSAL_TAGMATCH);
	_pEditView->clearIndicator(SCE_UNIVERSAL_TAGATTR);

#if 0
	// Detect the current lang type. It works only with html and xml
	LangType lang = (_pEditView->getCurrentBuffer())->getLangType();

	if (lang != L_XML && lang != L_HTML && lang != L_PHP && lang != L_ASP && lang != L_JSP)
		return;
#endif

	// Get the original targets and search options to restore after tag matching operation
	int originalStartPos = _pEditView->execute(SCI_GETTARGETSTART);
	int originalEndPos = _pEditView->execute(SCI_GETTARGETEND);
	int originalSearchFlags = _pEditView->execute(SCI_GETSEARCHFLAGS);

	XmlMatchedTagsPos xmlTags;

    // Detect if it's a xml/html tag. If yes, Colour it!
	if (getXmlMatchedTagsPos(xmlTags))
	{
		bFound = true;

		if (doHilite)
		{
			_pEditView->execute(SCI_SETINDICATORCURRENT, SCE_UNIVERSAL_TAGMATCH);
			int openTagTailLen = 2;

			// Colourising the close tag firstly
			if ((xmlTags.tagCloseStart != -1) && (xmlTags.tagCloseEnd != -1))
			{
				_pEditView->execute(SCI_INDICATORFILLRANGE,  xmlTags.tagCloseStart, xmlTags.tagCloseEnd - xmlTags.tagCloseStart);
				// tag close is present, so it's not single tag
				openTagTailLen = 1;
			}

			// Colourising the open tag
			_pEditView->execute(SCI_INDICATORFILLRANGE,  xmlTags.tagOpenStart, xmlTags.tagNameEnd - xmlTags.tagOpenStart);
			_pEditView->execute(SCI_INDICATORFILLRANGE,  xmlTags.tagOpenEnd - openTagTailLen, openTagTailLen);

			// Colouising its attributs
			if (doHiliteAttr)
			{
				vector< pair<int, int> > attributes = getAttributesPos(xmlTags.tagNameEnd, xmlTags.tagOpenEnd - openTagTailLen);
				_pEditView->execute(SCI_SETINDICATORCURRENT,  SCE_UNIVERSAL_TAGATTR);
				for (size_t i = 0 ; i < attributes.size() ; i++)
				{
					_pEditView->execute(SCI_INDICATORFILLRANGE,  attributes[i].first, attributes[i].second - attributes[i].first);
				}
			}

			// Colouising indent guide line position
			if (_pEditView->isShownIndentGuide())
			{
				int columnAtCaret  = int(_pEditView->execute(SCI_GETCOLUMN, xmlTags.tagOpenStart));
				int columnOpposite = int(_pEditView->execute(SCI_GETCOLUMN, xmlTags.tagCloseStart));

				int lineAtCaret  = int(_pEditView->execute(SCI_LINEFROMPOSITION, xmlTags.tagOpenStart));
				int lineOpposite = int(_pEditView->execute(SCI_LINEFROMPOSITION, xmlTags.tagCloseStart));

				if (xmlTags.tagCloseStart != -1 && lineAtCaret != lineOpposite)
				{
					_pEditView->execute(SCI_BRACEHIGHLIGHT, xmlTags.tagOpenStart, xmlTags.tagCloseEnd-1);
					_pEditView->execute(SCI_SETHIGHLIGHTGUIDE, (columnAtCaret < columnOpposite)?columnAtCaret:columnOpposite);
				}
			}
		}
	}

	// restore the original targets and search options to avoid the conflit with search/replace function
	_pEditView->execute(SCI_SETTARGETSTART, originalStartPos);
	_pEditView->execute(SCI_SETTARGETEND, originalEndPos);
	_pEditView->execute(SCI_SETSEARCHFLAGS, originalSearchFlags);

	if (gotoTag && bFound)
	{
		int caretPos = _pEditView->execute(SCI_GETCURRENTPOS);
		// check where we are
		if (xmlTags.tagCloseStart > -1)
		{
			if (caretPos >= xmlTags.tagOpenStart && caretPos <= xmlTags.tagOpenEnd)
				_pEditView->execute(SCI_GOTOPOS, xmlTags.tagCloseStart+1);
			else
				_pEditView->execute(SCI_GOTOPOS, xmlTags.tagOpenStart+1);
		}
	}
	return bFound;
}

bool erasedTag(TAG value) { return (value.second == -1); }

// lookup all tags in document
vector< pair<CString, int> > XmlMatchedTagsHighlighter::lookupTags()
{
	vector<TAG> tags;

	// search options
    _pEditView->execute(SCI_SETSEARCHFLAGS, SCFIND_REGEXP);
    int docLen = _pEditView->getCurrentDocLen();

	// regexp pattern to match any XML tag
	CString pattern(L"(<[^(><)]+>)");
	int pattLen = pattern.GetLength();
	CT2A patt (pattern, CP_UTF8);
	char *tmp=(char *)malloc(1024);
	if (patt && tmp) 
	{
		int pos = 0;
		while (pos >=0 && pos < docLen)
		{
			_pEditView->execute(SCI_SETTARGETSTART,pos);
			_pEditView->execute(SCI_SETTARGETEND,docLen);
			pos = _pEditView->execute(SCI_SEARCHINTARGET,pattLen, (LPARAM)(LPSTR) patt);

			if (pos >=0 && pos < docLen)
			{
				int tagPos = _pEditView->execute(SCI_GETTARGETSTART);
				pos = _pEditView->execute(SCI_GETTARGETEND);

				TextRange tr;
				tr.chrg.cpMin = tagPos;
				tr.chrg.cpMax = pos;
				tr.lpstrText = tmp;
				_pEditView->execute(SCI_GETTEXTRANGE, 0, reinterpret_cast<LPARAM>(&tr));
				CString tagName(tmp);
				// check tag type: open, close or single
				bool isCloseTag = (tagName.Find (L"</")==0);
				bool isSingleTag = false;
				if (!isCloseTag) isSingleTag = (tagName.Find (L"/>")>0);
				
				if (!isSingleTag)
				{
					// remove tag attributes
					if (isCloseTag) tagName = tagName.Mid(1, tagName.Find(L">",1)-1);
					else
					{
						int attr = tagName.Find(L" ",1);
						if (attr > 0) tagName = tagName.Mid(1, attr-1);
						else tagName = tagName.Mid(1, tagName.GetLength()-2);
					}

					if (!tags.empty() && tagName.CompareNoCase(L"/"+tags.back().first) == 0) tags.pop_back();
					else tags.push_back (TAG(tagName,tagPos));
				}
			}
		}
		free(tmp);
	}

	// remove matched (correct) tags
	if (!tags.empty())
	{
		tagIterator firstTag = tags.begin();
		tagIterator lastTag = tags.end()-1;

		while ( &firstTag && &lastTag && firstTag < lastTag)
		{
			if ((*lastTag).first.CompareNoCase(L"/"+(*firstTag).first) == 0)
			{
				(*firstTag).second = -1;
				(*lastTag).second = -1;
				firstTag++;
				lastTag--;
			}
			// locate matched tag pair
			else 
			{
				tagIterator firstTmp = firstTag;
				while ((firstTmp < lastTag) && ( (*lastTag).first.CompareNoCase(L"/"+(*firstTmp).first) != 0))
				{
					firstTmp++;
				}
				if (firstTmp < lastTag) firstTag = firstTmp;
				else lastTag--;
			}
		}

		tags.erase (remove_if(tags.begin(), tags.end(), erasedTag), tags.end());
	}

	return tags;
}

void XmlMatchedTagsHighlighter::gotoWrongTag()
{
	vector<TAG> wrongTags = lookupTags();
	if (!wrongTags.empty())
	{
		int caretPos = _pEditView->execute(SCI_GETCURRENTPOS);
		int newPos = wrongTags[0].second;
		for (tagIterator it=wrongTags.begin(); it!=wrongTags.end(); it++)
			if ((*it).second > caretPos)
			{
				newPos = (*it).second;
				break;
			}
		_pEditView->execute(SCI_GOTOPOS, newPos);
	}
}