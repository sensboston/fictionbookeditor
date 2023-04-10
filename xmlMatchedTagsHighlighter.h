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

#ifndef XMLMATCHEDTAGSHIGHLIGHTER_H
#define XMLMATCHEDTAGSHIGHLIGHTER_H

#pragma once

using namespace std;

// wrapper class
class ScintillaEditView {
public:
	ScintillaEditView(CWindow* source): m_source(source){};

	LRESULT execute (UINT Msg, WPARAM wParam=NULL, LPARAM lParam=NULL) {
	    return m_source->SendMessage(Msg, wParam, lParam); 
	}
	
    int getCurrentDocLen() {
        return int(execute(SCI_GETLENGTH));
    };

	void clearIndicator(int indicatorNumber) {
		int docStart = 0;
		int docEnd = getCurrentDocLen();
		execute(SCI_SETINDICATORCURRENT, indicatorNumber);
		execute(SCI_INDICATORCLEARRANGE, docStart, docEnd-docStart);
	};

	void getText(char *dest, int start, int end) {
		TextRange tr;
		tr.chrg.cpMin = start;
		tr.chrg.cpMax = end;
		tr.lpstrText = dest;
		execute(SCI_GETTEXTRANGE, 0, reinterpret_cast<LPARAM>(&tr));
	}

	bool isShownIndentGuide()const {
		return false;
	}

private:
	CWindow* m_source;
};

enum TagCateg {tagOpen, tagClose, inSingleTag, outOfTag, invalidTag, unknownPb};

typedef pair<CString, int> TAG;
typedef vector<TAG>::iterator tagIterator;


class XmlMatchedTagsHighlighter {
public:
	XmlMatchedTagsHighlighter(CWindow* source) {
	  _pEditView = new ScintillaEditView(source);
	};
	bool tagMatch(bool doHilite, bool doHiliteAttr, bool gotoTag);
	void gotoWrongTag();
	
private:
	struct XmlMatchedTagsPos {
		int tagOpenStart;
		int tagNameEnd;
		int tagOpenEnd;

		int tagCloseStart;
		int tagCloseEnd;
	};
	
	ScintillaEditView *_pEditView;

	int getFirstTokenPosFrom(int targetStart, int targetEnd, const char *token, std::pair<int, int> & foundPos);
	TagCateg getTagCategory(XmlMatchedTagsPos & tagsPos, int curPos);
	bool getMatchedTagPos(int searchStart, int searchEnd, const char *tag2find, const char *oppositeTag2find, vector<int> oppositeTagFound, XmlMatchedTagsPos & tagsPos);
	bool getXmlMatchedTagsPos(XmlMatchedTagsPos & tagsPos);
	vector< pair<int, int> > getAttributesPos(int start, int end);
	bool isInList(int element, vector<int> elementList) {
		for (size_t i = 0 ; i < elementList.size() ; i++)
			if (element == elementList[i])
				return true;
		return false;
	};
	vector< pair<CString, int> > lookupTags();
};

#endif //XMLMATCHEDTAGSHIGHLIGHTER_H
