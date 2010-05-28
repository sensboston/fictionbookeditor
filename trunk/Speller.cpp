#include "stdafx.h"
#include "resource.h"
#include "res1.h"
#include <iostream>
#include <fstream>
#include "FBE.h"
#include "Speller.h"

// variables to receive string from resource
wchar_t txt[MAX_LOAD_STRING + 1];
wchar_t cpt[MAX_LOAD_STRING + 1];

// spell check dialog initialisation
LRESULT CSpellDialog::OnInitDialog(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	m_BadWord = GetDlgItem(IDC_SPELL_BEDWORD);
	m_Replacement = GetDlgItem(IDC_SPELL_REPLACEMENT);
	m_Suggestions = GetDlgItem(IDC_SPELL_SUGG_LIST);
	m_IgnoreContinue = GetDlgItem(IDC_SPELL_IGNORE);
	m_WasSuspended = false;

	UpdateData();
	CenterWindow();
	return 1;
}

LRESULT CSpellDialog::OnActivate(UINT, WPARAM wParam, LPARAM, BOOL&)
{
	if (wParam == WA_INACTIVE)
	{
		::LoadString(_Module.GetResourceInstance(), IDS_SPELL_CONTINUE, txt, MAX_LOAD_STRING);
		m_IgnoreContinue.SetWindowText (txt);

		GetDlgItem(IDC_SPELL_IGNOREALL).EnableWindow(FALSE);
		GetDlgItem(IDC_SPELL_CHANGE).EnableWindow(FALSE);
		GetDlgItem(IDC_SPELL_CHANGEALL).EnableWindow(FALSE);
		GetDlgItem(IDC_SPELL_ADD).EnableWindow(FALSE);
		m_Replacement.EnableWindow(FALSE);
		m_Suggestions.EnableWindow(FALSE);
		m_WasSuspended = true;

		UpdateWindow();
	}
	return 0;
}

LRESULT CSpellDialog::UpdateData()
{
	m_BadWord.SetWindowText (m_sBadWord);
	m_Suggestions.ResetContent();
	if (m_strSuggestions)
		for (int i=0; i<m_strSuggestions->GetSize(); i++)
		{
			m_Suggestions.AddString((*m_strSuggestions)[i]);
			if (!i) m_Replacement.SetWindowText ((*m_strSuggestions)[i]);
		}

	if(m_Speller->GetUndoState())
		GetDlgItem(IDC_SPELL_UNDO).EnableWindow(TRUE);
	else
		GetDlgItem(IDC_SPELL_UNDO).EnableWindow(FALSE);

	return 1;
}

LRESULT CSpellDialog::OnSelChange(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	CString strText;
	if (m_Suggestions.GetText(m_Suggestions.GetCurSel(),strText))
		m_Replacement.SetWindowText(strText);
	return 0;
}

// change text to suggested word on doubleclick
LRESULT CSpellDialog::OnSelDblClick(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	CString strText;
	if (m_Suggestions.GetText(m_Suggestions.GetCurSel(),strText))
		m_Replacement.SetWindowText(strText);
	return 0;
}

LRESULT CSpellDialog::OnEditChange(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
{
	m_Replacement.GetWindowText(m_sReplacement);
	return 0;
}

LRESULT CSpellDialog::OnCancel(WORD, WORD wID, HWND, BOOL&) 
{ 
	ATLASSERT(m_Speller!=NULL);
	m_Speller->EndDocumentCheck();
	return 0;
}

LRESULT CSpellDialog::OnIgnore(WORD, WORD wID, HWND, BOOL&)
{
	ATLASSERT(m_Speller!=NULL);
	if (m_WasSuspended)
	{
		::LoadString(_Module.GetResourceInstance(), IDC_SPELL_IGNORE, txt, MAX_LOAD_STRING);
		m_IgnoreContinue.SetWindowText (txt);

		GetDlgItem(IDC_SPELL_IGNOREALL).EnableWindow(TRUE);
		GetDlgItem(IDC_SPELL_CHANGE).EnableWindow(TRUE);
		GetDlgItem(IDC_SPELL_CHANGEALL).EnableWindow(TRUE);
		GetDlgItem(IDC_SPELL_ADD).EnableWindow(TRUE);
		m_Replacement.EnableWindow(TRUE);
		m_Suggestions.EnableWindow(TRUE);
		m_WasSuspended = false;

		UpdateWindow();
		m_Speller->StartDocumentCheck();
	}
	else 
		m_Speller->ContinueDocumentCheck();

	return 0;
}

LRESULT CSpellDialog::OnIgnoreAll(WORD, WORD wID, HWND, BOOL&)
{
	ATLASSERT(m_Speller!=NULL);
	m_Speller->IgnoreAll(m_sBadWord);
	m_Speller->ContinueDocumentCheck();
	return 0;
}

LRESULT CSpellDialog::OnChange(WORD, WORD wID, HWND, BOOL&)
{
	ATLASSERT(m_Speller!=NULL);
	m_Speller->BeginUndoUnit(L"replace word");
	m_Speller->Replace(m_sReplacement);
	m_Speller->EndUndoUnit();
	m_Speller->ContinueDocumentCheck();
	return 0;
}

LRESULT CSpellDialog::OnChangeAll(WORD, WORD wID, HWND, BOOL&)
{
	ATLASSERT(m_Speller!=NULL);
	m_Speller->AddReplacement(m_sBadWord,m_sReplacement);
	m_Speller->BeginUndoUnit(L"replace word");
	m_Speller->Replace(m_sReplacement);
	m_Speller->EndUndoUnit();
	m_Speller->ContinueDocumentCheck();
	return 0;
}

LRESULT CSpellDialog::OnAdd(WORD, WORD wID, HWND, BOOL&)
{
	ATLASSERT(m_Speller!=NULL);
	m_Speller->AddToDictionary(m_sBadWord);
	m_Speller->ContinueDocumentCheck();
	return 0;
}

LRESULT CSpellDialog::OnUndo(WORD, WORD wID, HWND, BOOL&)
{
	ATLASSERT(m_Speller!=NULL);
	m_Speller->Undo();
	UpdateData();
	return 0;
}


/////////////////////////////////////////////////////////////////////////////////////////////
//
// CSpeller methods
//
////////////////////////////////////////////////////////////////////////////////////////////

Hunhandle* CSpeller::LoadDictionary(CString dictPath, CString dictName)
{
	USES_CONVERSION;
	Hunhandle* dict = NULL;

	if ( ATLPath::FileExists(dictPath+dictName+L".aff") && ATLPath::FileExists(dictPath+dictName+L".dic"))
	{
		// create dictionary from file
		dict = Hunspell_create(T2A(dictPath+dictName+".aff"), T2A(dictPath+dictName+".dic"));
	}
	return dict;
}

//
// CSpeller constructor
//
CSpeller::CSpeller(CString dictPath): 
	m_prevY(0), m_Lang(LANG_EN), m_Enabled(true), m_spell_dlg(0), m_prevSelRange(0)
{
	m_DictPath = dictPath;

	// initialize all dictionaries
	for (int i=LANG_EN; i<=LANG_NONE; i++)
		m_Dictionaries.Add(dicts[i]);

	// but load only English and Russian dictionaries 
	m_Dictionaries[LANG_EN].handle = LoadDictionary(dictPath, dicts[LANG_EN].name);
	m_Dictionaries[LANG_RU].handle = LoadDictionary(dictPath, dicts[LANG_RU].name);

	// don't split on apostrophes
	splitter = new CSplitter(L"'’");
}

//
// CSpeller destructor
//
CSpeller::~CSpeller()
{
	EndDocumentCheck();
	// unload dictionaries
	for (int i=0; i<m_Dictionaries.GetSize(); i++)
		if (m_Dictionaries[i].handle) 
			Hunspell_destroy (m_Dictionaries[i].handle);
}

void CSpeller::AttachDocument(MSHTML::IHTMLDocumentPtr doc)
{
	// cansel spell check and destroy dialog
	EndDocumentCheck();

	// clear previous marks
	m_ElementHighlights.clear();

	// clear collected ID's
	m_uniqIDs.clear();

	// clear (assigned to previous document) service arrays
	m_IgnoreWords.RemoveAll();
	m_ChangeWords.RemoveAll();
	m_ChangeWordsTo.RemoveAll();

	// assign new document: all interfaces and variables
	m_doc2 = MSHTML::IHTMLDocument2Ptr(doc);

	// get web browser component
	MSHTML::IHTMLWindow2Ptr pWin(m_doc2->parentWindow);
	IServiceProviderPtr pISP(pWin);
	pISP->QueryService(IID_IWebBrowserApp, IID_IWebBrowser2,(void **)&m_browser); 

	m_doc3 = MSHTML::IHTMLDocument3Ptr(doc);
	m_doc4 = MSHTML::IHTMLDocument4Ptr(doc);
	m_fbw_body = m_doc3->getElementById(L"fbw_body");
	m_scrollElement = m_doc3->documentElement;
	m_mkc = MSHTML::IMarkupContainer2Ptr(m_doc4);
	m_ims = MSHTML::IMarkupServicesPtr(m_doc4);
	m_ihrs = MSHTML::IHighlightRenderingServicesPtr(m_doc4);
    m_ids = MSHTML::IDisplayServicesPtr(m_doc4);

	// create a render style (wavy red line)
	_bstr_t b;
	m_irs = m_doc4->createRenderStyle(b);
	m_irs->defaultTextSelection = "false";
	m_irs->textBackgroundColor = "transparent";
	m_irs->textColor = "transparent";
	m_irs->textDecoration = "underline";
	m_irs->textDecorationColor = "red";
	m_irs->textUnderlineStyle = "wave";

	// detect document language
	SetDocumentLanguage();
}

void CSpeller::SetDocumentLanguage()
{
	m_Lang = LANG_NONE;
	MSHTML::IHTMLSelectElementPtr elem = MSHTML::IHTMLDocument3Ptr(m_doc4)->getElementById(L"tiLang");
	if (elem)
	{
		CString lang = elem->value;
		for (int i=LANG_EN; i<LANG_NONE; i++)
			if (m_Dictionaries[i].name.Find(lang) == 0)
			{
				// load dictionary (if needed)
				if (!m_Dictionaries[i].handle)
					m_Dictionaries[i].handle = LoadDictionary(m_DictPath, dicts[i].name);
				m_Lang = dicts[i].lang;
				// special hack: for the bilingual spell-check of Russian texts
				// let's select English as a second language 
				// Russian words will be detected automatically
				if (m_Lang == LANG_RU) m_Lang = LANG_EN;
				break;
			}
	}
	// initiate background check
	if (m_Dictionaries[m_Lang].handle) HighlightMisspells();
	// no dictionary or language not supported
	else SetEnabled (false);
}

// 
// Return selected word or word under caret
// 
MSHTML::IHTMLTxtRangePtr CSpeller::GetSelWordRange()
{
	// fetch selection
	MSHTML::IHTMLTxtRangePtr selRange(m_doc2->selection->createRange());
	if (selRange)
	{
		selRange->moveStart(L"word", -1);
		selRange->moveEnd(L"word", 1);
		return selRange->duplicate();
	}
	else return 0;
}

// 
// Return word under caret
// 
CString CSpeller::GetSelWord()
{
	MSHTML::IHTMLTxtRangePtr range = GetSelWordRange();
	CString word = range->text;
	return word.Trim();
}

//
// Do a spell-check and append popup menu (if nessasary)
// 
void CSpeller::AppendSpellMenu (HMENU menu)
{
	MSHTML::IHTMLTxtRangePtr range = GetSelWordRange();
	if (!range) return;
	CString word = range->text;
	word.Trim();
	if (word.IsEmpty()) return;
	
	if (SpellCheck(word) != SPELL_OK)
	{
		m_menuSuggestions = GetSuggestions(word);
		int numSuggestions = m_menuSuggestions->GetSize();
		// limit up to 8 suggestion
		if (numSuggestions > 8) numSuggestions = 8;

		::AppendMenu(menu, MF_SEPARATOR, 0, NULL);
		for (int i=0; i<numSuggestions; i++)
			::AppendMenu(menu, MF_STRING, IDC_SPELL_REPLACE+i, (*m_menuSuggestions)[i]);
		if (numSuggestions > 0)
			::AppendMenu(menu, MF_SEPARATOR, 0, NULL);

		CString itemName;
		itemName.LoadString(IDC_SPELL_IGNOREALL);
		::AppendMenu(menu, MF_STRING, IDC_SPELL_IGNOREALL, itemName);

		itemName.LoadString(IDC_SPELL_ADD2DICT);
		::AppendMenu(menu, MF_STRING, IDC_SPELL_ADD2DICT, itemName);
	}
}

//
// Replace misspelled word from the correct variant (from popup menu)
//
void CSpeller::Replace(int nIndex)
{
	MSHTML::IHTMLTxtRangePtr range = GetSelWordRange();
	CString addSpace = range->text;
	if (addSpace.Right(1) == L" ") addSpace.SetString(L" "); else addSpace.SetString(L"");
	try
	{ 
		CString replace = (*m_menuSuggestions)[nIndex];
		if (m_numAphChanged) replace.Replace(L"'", L"’");
		 replace = replace + addSpace; 
		_bstr_t b = replace.AllocSysString();
		range->put_text(b);
	}
	catch(...){}
}

//
// Replace misspelled word from the correct variant (from dialog)
//
void CSpeller::Replace(CString word)
{
	if (m_selRange)
	{
		if (m_numAphChanged) word.Replace(L"'", L"’");
		_bstr_t b = word.AllocSysString();
		m_selRange->put_text(b);
	}
}

void CSpeller::IgnoreAll(CString word)
{
	if (word.IsEmpty())
		word = GetSelWord();
	m_IgnoreWords.Add(word);
	// recheck page
	ClearAllMarks();
	HighlightMisspells();
}

void CSpeller::AddToDictionary()
{
	CString word = GetSelWord();
	Hunhandle* currDict = GetDictionary(word);
	// add to Hunspell's runtime dictionary
	CT2A str (word, m_codePage);
	Hunspell_add(currDict, str);
	// add to custom dictionary
	m_CustomDict.Add(word);
	SaveCustomDict();
	// recheck page
	ClearAllMarks();
	HighlightMisspells();
}

void CSpeller::AddToDictionary(CString word)
{
	Hunhandle* currDict = GetDictionary(word);
	// add to Hunspell's runtime dictionary
	CT2A str (word, m_codePage);
	Hunspell_add(currDict, str);
	// add to custom dictionary
	m_CustomDict.Add(word);
	SaveCustomDict();
	// recheck page
	ClearAllMarks();
	HighlightMisspells();
}

//
// Return dictionary based on word (bi-lingual hack)
//
Hunhandle* CSpeller::GetDictionary(CString word)
{
	// select document dictionary (based on FB2 document settings)
	m_codePage = m_Dictionaries[m_Lang].codepage;
	Hunhandle* currDict = m_Dictionaries[m_Lang].handle;

	// special fix for Russian words at non-Russian document
	if (m_Lang != LANG_RU && m_Lang != LANG_UA && m_Lang != LANG_BY)
	{
		// try to detect Russian language: too dirty but simple
		// 0x0 - English or other latin, 0x4 - Russian
		unsigned char* sData = (unsigned char*)word.GetString();
		if (sData[1] == 0x4)
		{
			// Russian language detected
			currDict = m_Dictionaries[LANG_RU].handle;
			m_codePage = m_Dictionaries[LANG_RU].codepage;
		}
	}
	return currDict;
}

//
// Return suggestions for misspell word
//
CStrings* CSpeller::GetSuggestions(CString word)
{
	// remove all soft hyphens
	word.Replace(L"\u00AD", L"");

	Hunhandle* currDict = GetDictionary(word);
	// encode string to the dictionary encoding 
	CT2A str (word, m_codePage);
	char **list;
	int listLength = Hunspell_suggest(currDict, &list, str);
	CStrings* suggestions;
	suggestions = new CStrings();

	char** p = list;
	for (int i=0; i<listLength; i++)
	{
		CString s( CA2CT (*p, m_codePage));
		suggestions->Add(s);
		p++;
	}
	Hunspell_free_list(currDict, &list, listLength);
	return suggestions;
}

//
// Spell check the word
// CString "word" in UTF encoding
// if no "range" assigned, spellcheck is non-interactive
// "suggestions" (if assigned) will be filled by a replacement variants
//
SPELL_RESULT CSpeller::SpellCheck(CString word)
{
	SPELL_RESULT spellResult(SPELL_OK);
	Hunhandle* currDict = GetDictionary(word);

	// do spell check
	if (currDict)
	{
		CString checkWord(word);

		// replace aphostrophes (dictionaries understand only regular ' aphostrophe
		m_numAphChanged = checkWord.Replace(L"’", L"'");
		// remove all soft hyphens
		checkWord.Replace(L"\u00AD", L"");
		// special case for Russian letter "¸"
		if (currDict == m_Dictionaries[LANG_RU].handle) checkWord.Replace(L"¸", L"å");

		// encode string to the dictionary encoding 
		CT2A str (checkWord, m_codePage);

		try { spellResult = (SPELL_RESULT) Hunspell_spell(currDict, str);  }
		catch(...) { spellResult = SPELL_OK; }

		if (spellResult != SPELL_OK)
		{
			// check ignore_all list first
			int nIdx = m_IgnoreWords.Find(word);
			if (nIdx > -1)
			{
				spellResult = SPELL_OK;
			}
			else
			{
				// check auto-replacement list
				nIdx = m_ChangeWords.Find(word);
				if (nIdx > -1)
				{
					spellResult = SPELL_CHANGEALL;
				}
				else
				{
					// check in custom dictionary
					nIdx = m_CustomDict.Find(word);
					if (nIdx > -1) spellResult = SPELL_OK;
				}
			}
		}
	}
	return spellResult;
}

//
// Highlight word at the pos in the element
// 
void CSpeller::MarkElement(MSHTML::IHTMLElementPtr elem, long uniqID, CString word, int pos)
{
	MSHTML::IMarkupPointerPtr impStart;
	MSHTML::IMarkupPointerPtr impEnd;

	// Create start markup pointer
	m_ims->CreateMarkupPointer(&impStart);
	impStart->MoveAdjacentToElement(elem, MSHTML::ELEM_ADJ_AfterBegin);
	for (int i=0; i<pos; i++)
		impStart->MoveUnit (MSHTML::MOVEUNIT_NEXTCHAR);

	// Create end markup pointer
	m_ims->CreateMarkupPointer(&impEnd);
	impEnd->MoveAdjacentToElement(elem, MSHTML::ELEM_ADJ_BeforeEnd);

	// Locate the misspelled word
	_bstr_t w = word.AllocSysString();
	// First: exact match
//	if (impStart->findText (w, FINDTEXT_WHOLEWORD | FINDTEXT_MATCHCASE, impEnd, NULL) == S_FALSE)
	// Second: partial match
	if (impStart->findText (w, FINDTEXT_MATCHCASE, impEnd, NULL) == S_FALSE)
		return;

	// Create a display pointers from the markup pointers
	MSHTML::IDisplayPointerPtr idpStart;
	m_ids->CreateDisplayPointer(&idpStart);
	idpStart->MoveToMarkupPointer(impStart, NULL);

	MSHTML::IDisplayPointerPtr idpEnd;
	m_ids->CreateDisplayPointer(&idpEnd);
	idpEnd->MoveToMarkupPointer(impEnd, NULL);

	// Add or remove the segment
	MSHTML::IHighlightSegmentPtr ihs;
	m_ihrs->AddSegment(idpStart, idpEnd, m_irs, &ihs);

	m_ElementHighlights.insert(HIGHLIGHT(uniqID, ihs));
}

//
// Removes all highlights in the document and clear saved highlights
//
void CSpeller::ClearAllMarks()
{
	for each (HIGHLIGHT itr in m_ElementHighlights)
	{
		m_ihrs->RemoveSegment(itr.second);
	}
	m_ElementHighlights.clear();
}

//
// Removes highlights for the unique element
//
void CSpeller::ClearMarks (int elemID)
{
	HIGHLIGHTS::iterator itr, lastElement;

	itr = m_ElementHighlights.find(elemID);
	if (itr != m_ElementHighlights.end())
	{
		lastElement = m_ElementHighlights.upper_bound(elemID);
		for ( ; itr != lastElement; ++itr)
			if (itr->second) 
				m_ihrs->RemoveSegment(itr->second);

		m_ElementHighlights.erase(elemID);
	}
}

//
// Spellcheck selected element
//
void CSpeller::CheckElement(MSHTML::IHTMLElementPtr elem, long uniqID, bool HTMLChanged)
{
	CWords words;
	// skip whole document checking
	CString html = elem->innerHTML;
	if (html.Find(L"<DIV") >= 0) return;

	CString innerText = elem->innerText;

	if (!innerText.Trim().IsEmpty())
	{
		if (uniqID < 0)	uniqID = MSHTML::IHTMLUniqueNamePtr(elem)->uniqueNumber;

		if (HTMLChanged)
			ClearAllMarks();
		else 
			ClearMarks(uniqID);

		// tokenize and spellcheck
		splitter->Split(&innerText, &words);
		for (int i=0; i<words.GetSize(); i++)
		{
			if (SpellCheck(words.GetValueAt(i)) == SPELL_MISSPELL)
				MarkElement (elem, uniqID, words.GetValueAt(i), words.GetKeyAt(i));
		}
	}
	// spell check previous element
	if (HTMLChanged)
		HighlightMisspells();
}

// 
// Check visible part of the document, run background check if view changed (scrolled)
//
void CSpeller::CheckScroll()
{
	if (m_scrollElement)
	{
		long Y = m_scrollElement->scrollTop;
		if (Y != m_prevY)
		{
			HighlightMisspells();
			m_prevY = Y;
		}
	}
}

inline void CSpeller::HighlightMisspells()
{
	if (m_HighlightMisspells && m_Enabled)
		CheckCurrentPage();
}


void CSpeller::CheckCurrentPage()
{
	CWords words;
	CString tagName;
	std::pair< std::set<long>::iterator, bool > pr;
	int currNum, numChanges = 0, nStartElem, nEndElem;
	MSHTML::IHTMLElementPtr elem, endElem;

	// lookup first element on page
	for (int y=10; y<m_scrollElement->clientHeight; y+=10)
	{
		elem = m_doc2->elementFromPoint(63, y);
		tagName.SetString(elem->tagName);
		if (tagName.CompareNoCase(L"P")==0) break;
	}
	// lookup last element on page
	for (int y=m_scrollElement->clientHeight; y>10; y-=10)
	{
		endElem = m_doc2->elementFromPoint(63, y);
		tagName.SetString(endElem->tagName);
		if (tagName.CompareNoCase(L"P")==0) break;
	}

	// get all document paragraphs
	MSHTML::IHTMLElementPtr fbw_body = m_doc3->getElementById(L"fbw_body");
	MSHTML::IHTMLElementCollectionPtr paras = MSHTML::IHTMLElement2Ptr(fbw_body)->getElementsByTagName(L"P");

	nStartElem = nEndElem = -1;
	for (int i=0; i<paras->length; i++)
	{
		if ((nStartElem == -1) && paras->item(i) == elem) nStartElem = i;
		else if (paras->item(i) == endElem) 
		{
			nEndElem = i;
			break;
		}
	}

	if (nStartElem == -1) nStartElem = 0;

	if (nEndElem == -1) nEndElem = nStartElem+20;
	else if (nEndElem+1 < paras->length) nEndElem++;

	for (int i=nStartElem; i<nEndElem; i++)
	{
		elem = paras->item(i);
		// get element unique number
		if (elem)
		{
			currNum = MSHTML::IHTMLUniqueNamePtr(elem)->uniqueNumber;
		
			// Getting uniqueNumber from IHTMLUniqueName interface changes
			// the internal HTML document version. We need to correct this
			// issue, because document not really changed
			pr = m_uniqIDs.insert(currNum);
			if (pr.second) numChanges++;

			CString innerText = elem->innerText;
			if(!innerText.IsEmpty())
			{
				// remove underline
				ClearMarks(currNum);
				splitter->Split(&innerText, &words);
				for (int i=0; i<words.GetSize(); i++)
				{
					CString wrd = words.GetValueAt(i);
					if (SpellCheck(wrd) == SPELL_MISSPELL)
						MarkElement(elem, currNum, wrd, words.GetKeyAt(i));
				}
			}
		}
	}
	
	if (numChanges) AdvanceVersionNumber(numChanges);
}

//
// Serialize custom dictionary
//
void CSpeller::LoadCustomDict()
{
	USES_CONVERSION;

	CString str;
	char buf[256];
	if (ATLPath::FileExists(m_CustomDictPath))
	try 
	{
		m_CustomDict.RemoveAll();

		std::ifstream load;
		load.open(m_CustomDictPath);
		if (load.is_open())
		{
			do
			{
				load.getline(&buf[0], sizeof(buf), '\n');
				str.SetString(CA2W(buf, 1251));
				if (!str.IsEmpty()) m_CustomDict.Add (str);
			}
			while (!str.IsEmpty());
		}
		load.close();
	}
	catch (...) {}
}

void CSpeller::SaveCustomDict()
{
	try
	{
		std::ofstream save;
		save.open(m_CustomDictPath, std::ios_base::out | std::ios_base::trunc );
		if (save.is_open())
			for (int i=0; i<m_CustomDict.GetSize(); i++)
			{
				CString word(m_CustomDict[i]);
				// remove all soft hyphens
				word.Replace(L"\u00AD", L"");
				CT2A str (word, 1251);
				save << str << '\n';
			}
		save.close();
	}
	catch (...) {}
}

void CSpeller::StartDocumentCheck(MSHTML::IMarkupServices2Ptr undoSrv)
{
	// create and show spell dialog
	if (!m_spell_dlg)
	{
		m_spell_dlg = new CSpellDialog(this);
		m_spell_dlg->ShowDialog();
		m_undoSrv = undoSrv;
	}

	// save current selection
	if (!m_prevSelRange)
	{
		m_ims->CreateMarkupPointer(&m_impStart);
		m_ims->CreateMarkupPointer(&m_impEnd);

		m_prevSelRange = m_doc2->selection->createRange();
		m_ims->MovePointersToRange(m_prevSelRange, m_impStart, m_impEnd);
	}

	// fetch selection
	CString selType = m_doc2->selection->type;
	m_selRange = m_doc2->selection->createRange();

	MSHTML::IHTMLElementPtr elem(m_selRange->parentElement());
	CString tag = elem->tagName;

	// if no caret (no focus) and no text selected, start from the beginning of displayed text
	if (tag.Compare (L"P") && selType.CompareNoCase(L"text"))
	{
		m_selRange->moveToElementText(m_doc2->elementFromPoint(65, 15));
		m_selRange->collapse(VARIANT_TRUE);
	}
	m_selRange->moveStart(L"word", -1);
//	m_selRange->moveEnd(L"word", 1);

	ContinueDocumentCheck();
}

//
// Spellcheck whole document from beginning
// Returns true if some changes was made, or false if no changes
//
void CSpeller::ContinueDocumentCheck()
{
	HRESULT compareEnd;
	SPELL_RESULT result;
	CString word;
	_bstr_t b;
	bool bHyphen = false;

	// find next misspell word from the beginning or current position
	do
	{
		// shift to the next word 
		m_selRange->move(L"word", 1);
		m_selRange->moveEnd(L"word", 1);

		result = SPELL_OK;
		word.SetString (m_selRange->text);
		word.Trim();
		// special check for hyphen
		if (word.Compare(L"-")==0)
		{
			m_selRange->moveStart(L"word", -1);
			m_selRange->moveEnd(L"word", 1);
			word.SetString (m_selRange->text);
			word.Trim();
			bHyphen = true;
		}

		// if word != words delimiter
		if (word.FindOneOf(Tokens)==-1)
			result = SpellCheck(word); 

		// select exact word
		if ((result == SPELL_CHANGE) || (result == SPELL_CHANGEALL) || (result == SPELL_MISSPELL))
		{
			b = word.AllocSysString();
			m_selRange->findText(b, 1073741824, 2);
			m_selRange->select();
		}

		switch (result)
		{
			case SPELL_CHANGEALL:
			{
				CString replaceStr = m_ChangeWordsTo[m_ChangeWords.Find(word)];
				// replace aphostrophes back
				if (m_numAphChanged) replaceStr.Replace(L"'", L"’");
				BeginUndoUnit(L"replace word");
				b = replaceStr.AllocSysString();
				m_selRange->put_text(b);
				EndUndoUnit();
				break;
			}
			case SPELL_MISSPELL:
			{
				m_spell_dlg->m_sBadWord = word;
				if (m_spell_dlg->m_strSuggestions)
					delete m_spell_dlg->m_strSuggestions;
				m_spell_dlg->m_strSuggestions = GetSuggestions(word);
				m_spell_dlg->UpdateData();
				break;
			}
		}

		// check for end of selection
		if (bHyphen)
		{
			m_selRange->moveStart(L"word", 2);
			m_selRange->moveEnd(L"word", 1);
			bHyphen = false;
		}
		compareEnd = m_selRange->compareEndPoints(L"StartToEnd", m_selRange);
		if (compareEnd == 0)
		{
			m_selRange->move(L"word", 1);
			m_selRange->moveEnd(L"word", 1);
			compareEnd = m_selRange->compareEndPoints(L"StartToEnd", m_selRange);
		}

	} while (result != SPELL_MISSPELL && compareEnd != 0);

	if (!compareEnd)
		EndDocumentCheck(false);
}

void CSpeller::EndDocumentCheck(bool bCancel)
{
	if (m_spell_dlg)
	{
		m_spell_dlg->DestroyWindow();
		m_spell_dlg = 0;
	}
	// display message box
	if (!bCancel)
	{
		::LoadString(_Module.GetResourceInstance(), IDS_SPELL_CHECK_COMPLETED, txt, MAX_LOAD_STRING);
		::LoadString(_Module.GetResourceInstance(), IDR_MAINFRAME, cpt, MAX_LOAD_STRING);
		::MessageBox(::GetActiveWindow(), txt, cpt, MB_OK | MB_ICONINFORMATION);
	}
	// restore previous selection
	if (m_prevSelRange)
	{
		m_ims->MoveRangeToPointers(m_impStart, m_impEnd, m_prevSelRange);
		m_prevSelRange->select();

		// delete objects
		m_prevSelRange = 0;
	}
	// delete spell-check selection range
	if (m_selRange) 
	{
		m_selRange = 0;
	}
}
