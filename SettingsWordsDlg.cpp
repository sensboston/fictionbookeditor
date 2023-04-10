// SettingsWordsDlg.cpp : Implementation of CSettingsWordsDlg

#include "stdafx.h"
#include "SettingsWordsDlg.h"
#include "Settings.h"

#define IMG_STAT_WIDTH	40
#define IMG_STAT_HEIGHT	10

extern CSettings _Settings;

static int compare_percent_asc(const void* v1, const void* v2)
{
	const WordsItem* w1 = (const WordsItem*)v1;
	const WordsItem* w2 = (const WordsItem*)v2; 
	return w1->m_percent - w2->m_percent;
}

static int compare_percent_desc(const void* v1, const void* v2)
{
	const WordsItem* w1 = (const WordsItem*)v1;
	const WordsItem* w2 = (const WordsItem*)v2;
	return w2->m_percent - w1->m_percent;
}

static int compare_counted_asc(const void* v1, const void* v2)
{
	const WordsItem* w1 = (const WordsItem*) v1;
	const WordsItem* w2 = (const WordsItem*) v2;
	return w1->m_count - w2->m_count;
}

static int compare_counted_desc(const void* v1, const void* v2)
{
	const WordsItem* w1 = (const WordsItem*)v1;
	const WordsItem* w2 = (const WordsItem*)v2;
	return w2->m_count - w1->m_count;
}

static int compare_word_asc(const void* v1, const void* v2)
{
	const WordsItem* w1 = (const WordsItem*)v1;
	const WordsItem* w2 = (const WordsItem*)v2;
	return w1->m_word.CompareNoCase(w2->m_word);
}

static int compare_word_desc(const void* v1, const void* v2)
{
	const WordsItem* w1 = (const WordsItem*)v1;
	const WordsItem* w2 = (const WordsItem*)v2;
	return w2->m_word.CompareNoCase(w1->m_word);
}

static int (*g_compare_funcs[])(const void*, const void*) = 
{
	compare_percent_asc,
	compare_percent_desc,
	compare_counted_asc,
	compare_counted_desc,
	compare_word_asc,
	compare_word_desc
};

// CSettingsWordsDlg
CSettingsWordsDlg::CSettingsWordsDlg() : m_sort(0), m_sel_all(false), m_ct(0)
{
	unsigned int size = _Settings.m_words.size();
	for(unsigned int i = 0; i < size; ++i)
	{
		m_words.Add(_Settings.m_words[i]);
	}
}

LRESULT CSettingsWordsDlg::OnInitDialog(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
{
	m_list_words = GetDlgItem(IDC_LIST_WORDS);
	m_list_words.SetExtendedListViewStyle(LVS_EX_FULLROWSELECT | LVS_EX_GRIDLINES);

	RECT rc;
	m_list_words.GetClientRect(&rc);
	int wcWidth = rc.right - rc.left - 80;

	CString header;

//	m_list_words.InsertColumn(0, L"%", LVCFMT_CENTER | LVCFMT_IMAGE, IMG_STAT_WIDTH + 10);

	header.LoadString(IDS_SETTINGS_WLIST_COUNTED);
	m_list_words.InsertColumn(0, header, LVCFMT_LEFT, 60);

	header.LoadString(IDS_SETTINGS_WLIST_WORD);
	m_list_words.InsertColumn(1, header, LVCFMT_LEFT, wcWidth);
	
	m_list_words.SetItemCount(_Settings.m_words.size());

	m_edt_new = GetDlgItem(IDC_EDIT_NEW);
	m_chk_all = GetDlgItem(IDC_CHECK_SELALL);

	// this unuseful code dramatically slowdown application! must be removed
//	CreateStatBitmaps();

	qsort(m_words.GetData(), m_words.GetSize(), sizeof(WordsItem), g_compare_funcs[3]);

	m_edit = GetDlgItem(IDC_EDIT_LV);
	m_show_words_excls = GetDlgItem(IDC_CHECK_SHOW_EXCLUSIONS);
	m_show_words_excls.SetCheck(_Settings.GetShowWordsExcls());

	return 0;
}

LRESULT CSettingsWordsDlg::OnListDispInfo(int id, NMHDR *hdr, BOOL&)
{
	NMLVDISPINFO *ni = (NMLVDISPINFO*)hdr;

	if (ni->item.iItem < 0 || ni->item.iItem >= m_words.GetSize())
		return 0;

	WordsItem *w = &m_words[ni->item.iItem];
	if (ni->item.mask & LVIF_TEXT)
		switch(ni->item.iSubItem)
		{
			case 0:
			{
				w->m_sCount.Format(L"%i", w->m_count);
				ni->item.pszText = w->m_sCount.GetBuffer();
			}
			break;
			case 1:
				ni->item.pszText = w->m_word.GetBuffer();
			break;
		}

/*	if(ni->item.mask & LVIF_IMAGE)
		ni->item.iImage = w->m_prc_idx; */

	return 0;
}

/*
void CSettingsWordsDlg::CreateStatBitmaps()
{
	unsigned int size = m_words.GetSize();

	CImageList m_stat_images;
	m_stat_images.Create(IMG_STAT_WIDTH, IMG_STAT_HEIGHT, ILC_COLORDDB, 0, size);

	float total = 0;
	for(unsigned int i = 0; i < size; ++i)
		total += m_words[i].m_count;
	
	for(unsigned int i = 0; i < size; ++i)
	{
		CDC memDC = ::CreateCompatibleDC(GetDC());
		CBitmap newBitmap = ::CreateCompatibleBitmap(GetDC(), IMG_STAT_WIDTH, IMG_STAT_HEIGHT);
		CBitmap oldBitmap = (HBITMAP)SelectObject(memDC, newBitmap);

		CBrush newBrush, oldBrush;
		CPen newPen, oldPen;

		// Clear background
		::FillRect(memDC, CRect(0, 0, IMG_STAT_WIDTH, IMG_STAT_HEIGHT), (HBRUSH)::GetStockObject(WHITE_BRUSH));

		float percent = m_words[i].m_count / total * 100;
		m_words[i].m_percent = (int)percent;

		newBrush = ::CreateSolidBrush(RGB(255 - percent, 127, 127));
		newPen = ::CreatePen(PS_SOLID, 0, 0);
		oldBrush = (HBRUSH)::SelectObject(memDC, newBrush);
		oldPen = (HPEN)::SelectObject(memDC, newPen);

		
		int statWidth = int(IMG_STAT_WIDTH * (percent / 100));
		if(!statWidth) statWidth++;

		::Rectangle(memDC, 0, 2, statWidth, IMG_STAT_HEIGHT - 2);
		::SelectObject(memDC, oldBrush);
		::SelectObject(memDC, oldPen);

		::SelectObject(memDC, oldBitmap);

		m_stat_images.Add(newBitmap);
		m_words[i].m_prc_idx = i;
	}
	
	m_list_words.SetImageList(m_stat_images.Detach(), LVSIL_SMALL);
} */

LRESULT CSettingsWordsDlg::OnListSort(int id, NMHDR *hdr, BOOL&)
{
	NMLISTVIEW*lv = (NMLISTVIEW*)hdr;

	if(lv->iSubItem + 1 == abs(m_sort))
		m_sort = -m_sort;
	else
		m_sort = lv->iSubItem + 1;

	qsort(m_words.GetData(), m_words.GetSize(), sizeof(WordsItem), g_compare_funcs[abs(m_sort)*2 - (m_sort < 0 ? 0 : 1)]);

	m_list_words.InvalidateRect(NULL);

	return 0;
}

LRESULT CSettingsWordsDlg::OnListClick(int id, NMHDR *hdr, BOOL&)
{
	NMITEMACTIVATE *ai = (NMITEMACTIVATE*) hdr;

	if ((::GetTickCount() - m_ct) < 500 || ai->iItem < 0 || ai->iSubItem != 1)
	{
		m_edit.ShowWindow(SW_HIDE);
		return 0;
	}

	m_editidx = ai->iItem;

	WordsItem* w = &m_words[m_editidx];

	m_edit.SetWindowText(w->m_word);

	RECT rci;
	m_list_words.GetSubItemRect(m_editidx, 1, LVIR_BOUNDS, &rci);
	m_list_words.ClientToScreen(&rci);
	ScreenToClient(&rci);
	m_edit.SetWindowPos(NULL, rci.left, rci.top, rci.right - rci.left, rci.bottom - rci.top + 5, SWP_SHOWWINDOW | SWP_NOACTIVATE);
	m_edit.SetSel(w->m_word.GetLength(), w->m_word.GetLength());
	m_edit.SetFocus();

	return 0;
}

LRESULT CSettingsWordsDlg::OnEditLVDefocused(int id, NMHDR *hdr, BOOL&)
{	
	m_edit.ShowWindow(SW_HIDE);

	return 0;
}

LRESULT CSettingsWordsDlg::OnListChanged(int id, NMHDR *hdr, BOOL&)
{
	m_ct = ::GetTickCount();

	return 0;
}

LRESULT CSettingsWordsDlg::OnBnClickedButtonAdd(WORD /*wNotifyCode*/, WORD /*wID*/, HWND /*hWndCtl*/, BOOL& /*bHandled*/)
{
	CString newWord;
	m_edt_new.GetWindowText(newWord);

	if(AddNewWord(newWord))
		m_edt_new.SetWindowText(L"");
		
	return 0;
}

bool CSettingsWordsDlg::AddNewWord(CString& word, bool test)
{
	word.Trim();
	bool ambigous = word.IsEmpty();
	int symbol = 0;

	int hyphens = 0;

	while(symbol != word.GetLength())
	{
		if(!iswalpha(word[symbol]) && word[symbol] != L'-')
		{
			ambigous = true;
			break;
		}

		if(word[symbol] == L'-')
		{
			if(symbol == 0 && word.GetLength() == 1 || symbol == word.GetLength() - 1 || hyphens > 1)
			{
				ambigous = true;
				break;
			}

			hyphens++;
		}

		symbol++;
	}

	if(hyphens != 1)
		ambigous = true;

	if(!ambigous)
	{
		unsigned int size = m_words.GetSize();
		for(unsigned int i = 0; i < size; ++i)
		{
			if(word.CompareNoCase(m_words[i].m_word) == 0)
			{
				CString errMsg[2];
				errMsg[0].LoadString(IDS_SETTINGS_WORDS_ADD_ERR_TEXT);
				errMsg[1].LoadString(IDS_SETTINGS_WORDS_ADD_ERR_CAP);
				MessageBox(errMsg[0], errMsg[1], MB_OK | MB_ICONERROR);

				return false;
			}
		}

		if(!test)
		{
			WordsItem wi(word.MakeLower(), 0);
			wi.m_prc_idx = m_list_words.GetItemCount() + 1;

			m_words.Add(wi);
			m_list_words.InsertItem(m_list_words.GetItemCount(), word.MakeLower());
		}

		return true;
	}
	else
	{
		CString errMsg[2];
		errMsg[0].LoadString(IDS_SETTINGS_WORDS_ADD_ERR_SYM);
		errMsg[1].LoadString(IDS_SETTINGS_WORDS_ADD_ERR_CAP);
		MessageBox(errMsg[0], errMsg[1], MB_OK | MB_ICONERROR);

		return false;
	}
}

LRESULT CSettingsWordsDlg::OnCustomDraw(int id, NMHDR *hdr, BOOL&)
{
	if(hdr->hwndFrom == m_list_words.GetHeader())
	{
		NMCUSTOMDRAW *cd =(NMCUSTOMDRAW*)hdr;

		switch(cd->dwDrawStage)
		{
		  case CDDS_PREPAINT:
			  return CDRF_NOTIFYITEMDRAW;
		  case CDDS_ITEMPREPAINT:
			  return CDRF_NOTIFYPOSTPAINT;
		  case CDDS_ITEMPOSTPAINT:
			  // paint sort indicator on top of the item
			  if (cd->dwItemSpec + 1 == (unsigned)abs(m_sort))
			  {
				  HGDIOBJ old=::SelectObject(cd->hdc,::GetSysColorBrush(COLOR_BTNTEXT));
				  int	h=cd->rc.bottom-cd->rc.top;
				  int	ah=h/4;
				  if (ah<5)
					  ah=5;
				  if (ah>20)
					  ah=20;
				  enum { off=5 };
				  POINT	  pt[3];
				  pt[0].x=cd->rc.right-off-ah;
				  pt[0].y=cd->rc.top+(h-ah)/2;
				  pt[1].x=cd->rc.right-off;
				  pt[1].y=pt[0].y+ah;
				  pt[2].x=cd->rc.right-off-ah*2;
				  pt[2].y=pt[1].y;
				  if (m_sort<0) {
					  pt[0].y=cd->rc.bottom+cd->rc.top-pt[0].y;
					  pt[1].y=cd->rc.bottom+cd->rc.top-pt[1].y;
					  pt[2].y=cd->rc.bottom+cd->rc.top-pt[2].y;
				  }
				  ::Polygon(cd->hdc,pt, 3);
				  ::SelectObject(cd->hdc, old);
			  }
			  return 0;
		}
	}
	return 0;
}
LRESULT CSettingsWordsDlg::OnBnClickedCheckSelall(WORD /*wNotifyCode*/, WORD /*wID*/, HWND /*hWndCtl*/, BOOL& /*bHandled*/)
{
	if(!m_list_words.GetItemCount())
	{
		m_chk_all.SetCheck(m_sel_all = false);
		return 0;
	}

	if(m_sel_all)
	{
		for(int i = 0; i < m_list_words.GetItemCount(); ++i)
			m_list_words.SetItemState(i, !LVIS_SELECTED, LVIS_SELECTED);
	}
	else
	{
		for(int i = 0; i < m_list_words.GetItemCount(); ++i)
			m_list_words.SelectItem(i);

		::SetFocus(m_list_words);
	}

	m_sel_all = !m_sel_all;

	return 0;
}

LRESULT CSettingsWordsDlg::OnBnClickedButtonRemovesel(WORD /*wNotifyCode*/, WORD /*wID*/, HWND /*hWndCtl*/, BOOL& /*bHandled*/)
{
	for(int i = 0; i < m_list_words.GetItemCount(); ++i)
	{
		if(m_list_words.GetItemState(i, LVIS_SELECTED) == LVIS_SELECTED)
		{
			RemoveWord(i);
			--i;
		}
	}

	return 0;
}

void CSettingsWordsDlg::RemoveWord(int index)
{
	m_list_words.DeleteItem(index);
	m_words.RemoveAt(index);
}

LRESULT CSettingsWordsDlg::OnOK(WORD, WORD wID, HWND, BOOL&)
{
	if(GetFocus() == m_edit)
	{
		CString edWord = U::GetWindowText(m_edit);

		if(m_words[m_editidx].m_word != edWord.Trim())
		{
			if(AddNewWord(edWord, true))
			{
				RemoveWord(m_editidx);
				AddNewWord(edWord);
			}
		}

		m_edit.ShowWindow(SW_HIDE);
	}
	else if(GetFocus() == m_edt_new)
	{
		SendMessage(WM_COMMAND, MAKEWPARAM(IDC_BUTTON_ADD, BN_CLICKED), (LPARAM)m_btn_add.m_hWnd);
	}
	else
	{
		_Settings.SetShowWordsExcls(m_show_words_excls.GetCheck() != 0);

		_Settings.m_words.clear();
		int n = m_words.GetSize();
		for(int i = 0; i < n; ++i)
			_Settings.m_words.push_back(m_words[i]);

		_Settings.SaveWords();
	}

	return 0;
}

LRESULT CSettingsWordsDlg::OnCancel(WORD, WORD wID, HWND, BOOL&)
{
	if(GetFocus() == m_edit)
	{
		m_edit.ShowWindow(SW_HIDE);
		return 0;
	}

	return 1;
}