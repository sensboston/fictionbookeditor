#include "stdafx.h"

#include "resource.h"
#include "res1.h"
#include "utils.h"
#include "apputils.h"
#include "FBEView.h"
#include "FBDoc.h"
#include "Words.h"

#define IMG_LIST_DIMS 16
enum
{
	NORMAL = 0,
	WARN = 1,
	STATEMASK = 7,
	HASREPL = 8
};

static int compare_indexes(const void* v1, const void* v2)
{
	const int* i1 = (const int*)v1;
	const int* i2 = (const int*)v2;

	return *i1-*i2;
}

static int compare_warns_asc(const void* v1, const void* v2)
{
	const FB::Doc::Word* w1 = (const FB::Doc::Word*)v1;
	const FB::Doc::Word* w2 = (const FB::Doc::Word*)v2;

	int warn = (w1->flags & WARN) - (w2->flags & WARN);
	return warn;
}

static int compare_warns_desc(const void* v1, const void* v2)
{
	const FB::Doc::Word* w1 = (const FB::Doc::Word*)v1;
	const FB::Doc::Word* w2 = (const FB::Doc::Word*)v2;

	int warn = (w2->flags & WARN) - (w1->flags & WARN);
	return warn;
}

static int compare_w_asc(const void* v1, const void* v2)
{
	const FB::Doc::Word* w1 = (const FB::Doc::Word*)v1;
	const FB::Doc::Word* w2 = (const FB::Doc::Word*)v2; 
	return w1->word.CompareNoCase(w2->word);
}

static int compare_w_desc(const void* v1, const void* v2)
{
	const FB::Doc::Word* w1 = (const FB::Doc::Word*)v1;
	const FB::Doc::Word* w2 = (const FB::Doc::Word*)v2;
	return w2->word.CompareNoCase(w1->word);
}

static int compare_r_asc(const void* v1, const void* v2)
{
	const FB::Doc::Word* w1 = (const FB::Doc::Word*) v1;
	const FB::Doc::Word* w2 = (const FB::Doc::Word*) v2;
	return w1->replacement.CompareNoCase(w2->replacement);
}

static int compare_r_desc(const void* v1, const void* v2)
{
	const FB::Doc::Word* w1 = (const FB::Doc::Word*)v1;
	const FB::Doc::Word* w2 = (const FB::Doc::Word*)v2;
	return w2->replacement.CompareNoCase(w1->replacement);
}

static int compare_c_asc(const void* v1, const void* v2)
{
	const FB::Doc::Word* w1 = (const FB::Doc::Word*)v1;
	const FB::Doc::Word* w2 = (const FB::Doc::Word*)v2;
	int cmp = w1->count - w2->count;
	return cmp ? cmp : w1->word.CompareNoCase(w2->word);
}

static int compare_c_desc(const void* v1, const void* v2)
{
	const FB::Doc::Word* w1 = (const FB::Doc::Word*)v1;
	const FB::Doc::Word* w2 = (const FB::Doc::Word*)v2;
	int cmp = w2->count - w1->count;
	return cmp ? cmp : w2->word.CompareNoCase(w1->word);
}

static int compare_repl_asc(const void* v1, const void* v2)
{
	const FB::Doc::Word* w1 = (const FB::Doc::Word*)v1;
	const FB::Doc::Word* w2 = (const FB::Doc::Word*)v2;

	return (w1->flags & HASREPL) - (w2->flags & HASREPL);
}

static int compare_repl_desc(const void* v1, const void* v2)
{
	const FB::Doc::Word* w1 = (const FB::Doc::Word*)v1;
	const FB::Doc::Word* w2 = (const FB::Doc::Word*)v2;
	return (w2->flags & HASREPL) - (w1->flags & HASREPL);
}

static int (*g_compare_funcs[])(const void*, const void*) = 
{
	compare_warns_asc,
	compare_warns_desc,
	compare_w_asc,
	compare_w_desc,
	compare_r_asc,
	compare_r_desc,
	compare_c_asc,
	compare_c_desc,
	compare_repl_asc,
	compare_repl_desc
};

static int  compare_nocase(const void *v1,const void *v2)
{
	const FB::Doc::Word *w1 = (const FB::Doc::Word*)v1;
	const FB::Doc::Word *w2 = (const FB::Doc::Word*)v2;
	return w1->replacement.CompareNoCase(w2->replacement);
}

class CCustomListViewCtrl : public CWindowImpl<CCustomListViewCtrl, CListViewCtrl, CControlWinTraits>
{
public:
	DECLARE_WND_SUPERCLASS(NULL, CListViewCtrl::GetWndClassName())

private:
	bool isCtrl;

public:
	CCustomListViewCtrl(): isCtrl(false) { }

	BEGIN_MSG_MAP(CCustomListViewCtrl)
		MESSAGE_HANDLER(WM_KEYDOWN, OnKeyDown)
		MESSAGE_HANDLER(WM_SYSKEYDOWN, OnKeyDown)
		MESSAGE_HANDLER(WM_KEYUP, OnKeyUp)
		MESSAGE_HANDLER(WM_SYSKEYUP, OnKeyUp)
	END_MSG_MAP()

	LRESULT OnKeyDown(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
	{
		NMITEMACTIVATE nia;
		::ZeroMemory(&nia, sizeof(NMITEMACTIVATE));
		nia.hdr.hwndFrom = m_hWnd;
		nia.hdr.idFrom = IDC_WLIST;
		nia.hdr.code = NM_CLICK;

		int selIdx = GetSelectedIndex();

		if(selIdx >= 0)
		{
			nia.iItem = selIdx;

			switch (wParam)
			{
			case VK_F4:
				nia.iSubItem = 2;
				::SendMessage(GetParent(), WM_NOTIFY, IDC_WLIST, (LPARAM)&nia);
				break;
			case VK_SPACE:
				int i;
				for(i = 0; i < GetItemCount(); ++i)
					if(GetItemState(i, LVIS_SELECTED) == LVIS_SELECTED)
					{
						SetItemState(i, !LVIS_SELECTED, LVIS_SELECTED);
						nia.iItem = i;
						nia.iSubItem = 4;
						::SendMessage(GetParent(), WM_NOTIFY, IDC_WLIST, (LPARAM)&nia);
					}
				wParam = VK_DOWN;
				break;
			case VK_CONTROL:
				isCtrl = true;
				break;
			case VK_OEM_PLUS:
				if(isCtrl)
					::SendMessage(GetParent(), WM_COMMAND, IDC_BUTTON_ADDHLTOEXCLS, NULL);
				break;
			}
		}

		return DefWindowProc(uMsg, wParam, lParam);
	}

	LRESULT OnKeyUp(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
	{
		isCtrl = false;

		return DefWindowProc(uMsg, wParam, lParam);
	}
};

class CWordsDlg: public CDialogImpl<CWordsDlg>
{
public:
	enum { IDD = IDD_WORDS };

	CEdit m_edit;
	int m_editidx;
	CCustomListViewCtrl m_lv;
	CSimpleArray<FB::Doc::Word>& m_words;
	CSimpleArray<FB::Doc::Word> m_excl_words;
	int m_sort;
	DWORD m_ct;
	bool m_showhide_excls;

	CButton m_btn_showhide_excls;
	CButton m_btn_addsel_excls;
	CButton m_btn_chec_kall;

	CWordsDlg(CSimpleArray<FB::Doc::Word>& words) : m_words(words), m_sort(0), m_ct(0), m_showhide_excls(_Settings.GetShowWordsExcls())
	{
		if(!_Settings.GetShowWordsExcls())
		{
			for(int i = 0; i < m_words.GetSize(); ++i)
			{
				if(m_words[i].flags & WARN)
					m_words.RemoveAt(i--);
			}
		}
	}

	BEGIN_MSG_MAP(CWordsDlg)
		MESSAGE_HANDLER(WM_INITDIALOG, OnInitDialog)

		COMMAND_HANDLER(IDC_REDIT, EN_KILLFOCUS, OnEditLoseFocus)
		COMMAND_HANDLER(IDC_CHECK_SHOWHIDE_EXCLS, BN_CLICKED, OnBnClickedCheckShowhideExcls)
		COMMAND_HANDLER(IDC_BUTTON_SELALL, BN_CLICKED, OnBnClickedButtonSelAll)
		COMMAND_HANDLER(IDC_BUTTON_ADDHLTOEXCLS, BN_CLICKED, OnBnClickedButtonAddhltoexcls)
		COMMAND_HANDLER(IDC_BUTTON_DESEL, BN_CLICKED, OnBnClickedButtonDesel)
		COMMAND_HANDLER(IDC_BUTTON_SETHLREPL, BN_CLICKED, OnBnClickedButtonSethlrepl)
		COMMAND_HANDLER(IDC_BUTTON_REMOVEHLREPL, BN_CLICKED, OnBnClickedButtonRemovehlrepl)
		COMMAND_HANDLER(IDC_BUTTON_SELALL2, BN_CLICKED, OnBnClickedButtonSelallrepl)

		COMMAND_ID_HANDLER(IDOK, OnOK)
		COMMAND_ID_HANDLER(IDCANCEL, OnCancel)

		NOTIFY_HANDLER(IDC_WLIST, LVN_GETDISPINFO, OnListDispInfo)
		NOTIFY_HANDLER(IDC_WLIST, LVN_COLUMNCLICK, OnListSort)
		NOTIFY_HANDLER(IDC_WLIST, NM_CLICK, OnListClick)
		NOTIFY_HANDLER(IDC_WLIST, LVN_ITEMCHANGED, OnListChanged)

		NOTIFY_CODE_HANDLER(NM_CUSTOMDRAW, OnCustomDraw)
	END_MSG_MAP()

	int GetWordLen(CString text)
	{
		CDC dc = this->GetDC();
		CSize size;
		dc.GetTextExtent(text, (int)_tcslen(text.GetBuffer()), &size);
		ReleaseDC(dc);

		return size.cx;
	}

	LRESULT OnInitDialog(UINT, WPARAM, LPARAM, BOOL&)
	{
		m_btn_showhide_excls = GetDlgItem(IDC_CHECK_SHOWHIDE_EXCLS);
		m_btn_showhide_excls.EnableWindow(m_showhide_excls);
		m_btn_showhide_excls.SetCheck(m_showhide_excls);

		CBitmap bitmaps;
		bitmaps.LoadBitmap(IDB_WORDSTATES);

		CImageList images;
		images.Create(IMG_LIST_DIMS, IMG_LIST_DIMS, ILC_COLOR32, 0, 4);
		images.Add(bitmaps);

		m_lv.SubclassWindow((HWND)GetDlgItem(IDC_WLIST));
		m_lv.SetImageList(images.Detach(), LVSIL_SMALL);

		m_lv.SetExtendedListViewStyle(LVS_EX_FULLROWSELECT | LVS_EX_GRIDLINES | LVS_EX_SUBITEMIMAGES);

		CString colLabels[3];
		colLabels[0].LoadString(IDS_WORDS_WLIST_WORD);
		colLabels[1].LoadString(IDS_WORDS_WLIST_REPLACEMENT);
		colLabels[2].LoadString(IDS_WORDS_WLIST_COUNTED);

		int maxWordLen = GetWordLen(colLabels[0]), maxReplLen = GetWordLen(colLabels[1]);
		int wordsSize = m_words.GetSize();

		for(int i = 0; i < wordsSize; ++i)
		{
			int len = 0;
			if((len = GetWordLen(m_words[i].word)) > maxWordLen)
				maxWordLen = len;
			if((len = GetWordLen(m_words[i].replacement)) > maxReplLen)
				maxReplLen = len;
		}
		int cntCapLen = GetWordLen(colLabels[2]);

		RECT rc;
		m_lv.GetClientRect(&rc);

		int freeWidth = rc.right - rc.left - (::GetSystemMetrics(SM_CXVSCROLL) + maxWordLen + maxReplLen + cntCapLen + 4 * IMG_LIST_DIMS);
		if(freeWidth > 0)
		{
			maxWordLen += int(0.4 * freeWidth);
			maxReplLen += int(0.4 * freeWidth);
			cntCapLen += int(0.2 * freeWidth);
		}

		m_lv.InsertColumn(0, NULL, LVCFMT_LEFT, IMG_LIST_DIMS * 2, 0);
		m_lv.InsertColumn(1, colLabels[0], LVCFMT_LEFT, maxWordLen, 1);
		m_lv.InsertColumn(2, colLabels[1], LVCFMT_LEFT, maxReplLen, 2);
		m_lv.InsertColumn(3, colLabels[2], LVCFMT_RIGHT, cntCapLen, 3);
		m_lv.InsertColumn(4, NULL, LVCFMT_CENTER, IMG_LIST_DIMS * 2, 4);

		m_lv.SetItemCount(wordsSize);

		m_edit = GetDlgItem(IDC_REDIT);

		return 0;
	}

	LRESULT OnListDispInfo(int id, NMHDR *hdr, BOOL&)
	{
		NMLVDISPINFO *ni = (NMLVDISPINFO*)hdr;

		if(ni->item.iItem < 0 || ni->item.iItem >= m_words.GetSize())
			return 0;

		FB::Doc::Word* w = &m_words[ni->item.iItem];

		if(ni->item.mask & LVIF_TEXT)
		{
			switch (ni->item.iSubItem)
			{
				case 1:
					ni->item.pszText = w->word.GetBuffer();
					break;
				case 2:
					ni->item.pszText = w->replacement.GetBuffer();
					break;
				case 3:
					_snwprintf(ni->item.pszText, ni->item.cchTextMax, _T("%d"), w->count);
					break;
			}
		}

		if(ni->item.mask & LVIF_IMAGE)
		{
			switch (ni->item.iSubItem)
			{
				case 0:
					ni->item.iImage = w->flags & WARN;
					break;
				case 4:
					ni->item.iImage = w->flags & HASREPL ? 2 : 3;
					break;
			}

			ni->item.state |= LVIF_STATE;
			m_lv.SetCheckState(ni->item.iItem, INDEXTOSTATEIMAGEMASK(1));
		}

		return 0;
	}

	LRESULT OnListSort(int id, NMHDR *hdr, BOOL&)
	{
		NMLISTVIEW *lv = (NMLISTVIEW*)hdr;

		if(lv->iSubItem + 1 == abs(m_sort))
			m_sort = -m_sort;
		else
			m_sort = lv->iSubItem + 1;

		qsort(m_words.GetData(), m_words.GetSize(), sizeof(FB::Doc::Word), g_compare_funcs[abs(m_sort)*2 - (m_sort < 0 ? 1 : 2)]);

		m_lv.InvalidateRect(NULL);

		return 0;
	}

	LRESULT OnListChanged(int id, NMHDR* hdr, BOOL&)
	{
		m_ct = ::GetTickCount();
		return 0;
	}

	int SwitchExclusions(int iItem)
	{
		FB::Doc::Word* wi = &m_words[iItem];
		CString wLower = wi->word;
		WordsItem checker(wLower.MakeLower(), wi->count);

		int warn = 0;

		if(wi->flags & WARN)
		{
			wi->flags &= ~WARN;
			std::vector<WordsItem>::iterator founded = std::find(_Settings.m_words.begin(), _Settings.m_words.end(), checker);
			if(founded != _Settings.m_words.end())
				_Settings.m_words.erase(founded);
		}
		else
		{
			wi->flags |= WARN;
			if(std::find(_Settings.m_words.begin(), _Settings.m_words.end(), checker) == _Settings.m_words.end())
				_Settings.m_words.push_back(checker);

			if(!m_showhide_excls)
			{
				wi->flags &= ~HASREPL;
				m_excl_words.Add(m_words[iItem]);
				m_words.RemoveAt(iItem);

				m_lv.SetItemCount(m_words.GetSize());
			}

			warn = 1;
		}

		m_lv.Invalidate();

		return warn;
	}

	CString WordToExclusion(int iItem)
	{
		FB::Doc::Word* wi = &m_words[iItem];
		CString word = wi->word;
		WordsItem checker(wi->word.MakeLower(), wi->count);

		m_lv.SetItemState(iItem, !LVIS_SELECTED, LVIS_SELECTED);

		if(!(wi->flags & WARN))
		{
			wi->flags |= WARN;
			if(std::find(_Settings.m_words.begin(), _Settings.m_words.end(), checker) == _Settings.m_words.end())
				_Settings.m_words.push_back(checker);

			if(!m_showhide_excls)
			{
				wi->flags &= ~HASREPL;
				m_excl_words.Add(m_words[iItem]);
				m_words.RemoveAt(iItem);

				m_lv.SetItemCount(m_words.GetSize());
			}
		}

		return word;
	}

	void WordsToExclusions(CSimpleArray<int> idxs)
	{
		CSimpleArray<int> idxs2;

		for(int i = 0; i < idxs.GetSize(); ++i)
		{
			FB::Doc::Word* pw = &m_words[idxs[i]];
			CString word = pw->word;
			WordsItem checker(word.MakeLower(), pw->count);

			if(!(pw->flags & WARN))
			{
				pw->flags |= WARN;
				if(std::find(_Settings.m_words.begin(), _Settings.m_words.end(), checker) == _Settings.m_words.end())
					_Settings.m_words.push_back(checker);
			}
			else continue;

			for(int j = 0; j < m_words.GetSize(); ++j)
			{
				FB::Doc::Word* pwc = &m_words[j];

				if(!(pwc->flags & WARN))
				{
					if(word.CompareNoCase(pwc->word) == 0)
					{
						WordsItem checker(word.MakeLower(), pwc->count + pwc->count);
						pwc->flags |= WARN;
						if(std::find(_Settings.m_words.begin(), _Settings.m_words.end(), checker) == _Settings.m_words.end())
							_Settings.m_words.push_back(checker);
						idxs2.Add(j);
					}
				}
			}
		}

		
		if(!m_showhide_excls)
		{
			int i2size = idxs2.GetSize();
			for(int i = 0; i < i2size; ++i)
			{
				if(!idxs.Find(idxs2[i]))
					idxs.Add(idxs2[i]);
			}

			qsort(idxs.GetData(), idxs.GetSize(), sizeof(int), compare_indexes);

			int count = m_words.GetSize();
			for(int i = idxs.GetSize() - 1; i >= 0 ; --i)
			{
				int idx = idxs[i];
				FB::Doc::Word* wi = &m_words[idxs[i]];
				wi->flags &= ~HASREPL;

				m_excl_words.Add(m_words[idxs[i]]);
				m_words.RemoveAt(idxs[i]);
			}

			m_lv.SetItemCount(m_words.GetSize());
		}
	}


	LRESULT OnListClick(int id, NMHDR* hdr, BOOL&)
	{
		NMITEMACTIVATE* ai =( NMITEMACTIVATE*)hdr;

		if(ai->iItem < 0)
			return 0;

		m_editidx = ai->iItem;
		FB::Doc::Word* pw = &m_words[m_editidx];

		switch(ai->iSubItem)
		{
		case 0:
			{
				CString marked = pw->word;
				SwitchExclusions(ai->iItem);

				for(int i = 0; i < m_words.GetSize(); ++i)
				{
					if(marked.Compare(m_words[i].word) == 0)
						continue;
					if(marked.CompareNoCase(m_words[i].word) == 0)
					{
						SwitchExclusions(i);
						if(!m_showhide_excls)
							--i;
					}
				}
			}
			break;
		case 2:
			m_edit.SetWindowText(pw->replacement);

			RECT rci;
			m_lv.GetSubItemRect(m_editidx, 2, LVIR_LABEL, &rci);
			m_lv.ClientToScreen(&rci);
			ScreenToClient(&rci);
			m_edit.SetWindowPos(NULL, rci.left, rci.top, rci.right - rci.left, rci.bottom - rci.top, SWP_SHOWWINDOW | SWP_NOACTIVATE);
			m_edit.SetSel(pw->replacement.GetLength(), pw->replacement.GetLength());
			m_edit.SetFocus();
			break;
		case 4:
			if(pw->flags & HASREPL)
				pw->flags &= ~HASREPL;
			else
				pw->flags |= HASREPL;
			
			m_lv.Invalidate();
			break;
		}

		return 0;
	}

	LRESULT OnEditLoseFocus(WORD, WORD, HWND, BOOL&)
	{
		m_edit.ShowWindow(SW_HIDE);
		return 0;
	}

	LRESULT OnCustomDraw(int id, NMHDR* hdr, BOOL&)
	{
		NMCUSTOMDRAW* cd = (NMCUSTOMDRAW*)hdr;

		if(hdr->hwndFrom == m_lv.GetHeader())
		{
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
						HGDIOBJ old = ::SelectObject(cd->hdc, ::GetSysColorBrush(COLOR_BTNTEXT));
						int h = cd->rc.bottom - cd->rc.top;
						int ah = h/4;

						if(ah < 5)
							ah = 5;
						if(ah > 20)
							ah = 20;

						enum { off = 5 };
						POINT pt[3];
						pt[0].x = cd->rc.right - off - ah;
						pt[0].y = cd->rc.top + (h - ah)/2;
						pt[1].x = cd->rc.right - off;
						pt[1].y = pt[0].y + ah;
						pt[2].x = cd->rc.right - off - ah*2;
						pt[2].y = pt[1].y;

						if(m_sort < 0)
						{
							pt[0].y = cd->rc.bottom + cd->rc.top - pt[0].y;
							pt[1].y = cd->rc.bottom + cd->rc.top - pt[1].y;
							pt[2].y = cd->rc.bottom + cd->rc.top - pt[2].y;
						}

						::Polygon(cd->hdc, pt, 3);
						::SelectObject(cd->hdc, old);
					}

					return CDRF_DODEFAULT;
			}
		}
		else if(hdr->idFrom == IDC_WLIST)
		{
			NMLVCUSTOMDRAW* lvCd = (NMLVCUSTOMDRAW*)hdr;
			static COLORREF defSiColor;

			switch(cd->dwDrawStage)
			{
			case CDDS_PREPAINT:
				return CDRF_NOTIFYITEMDRAW;
			case CDDS_ITEMPREPAINT:
				{
					if(m_words[cd->dwItemSpec].flags & WARN)
						lvCd->clrTextBk = RGB(255, 150, 150);
					else
						lvCd->clrTextBk = cd->dwItemSpec & 1 ? RGB(255, 255, 200) : RGB(255, 255, 220);
				}
				return CDRF_NOTIFYSUBITEMDRAW;
			case CDDS_ITEMPREPAINT | CDDS_SUBITEM:
				if(lvCd->iSubItem == 2)
				{
					defSiColor = lvCd->clrText;

					if(m_words[cd->dwItemSpec].flags & HASREPL)
						lvCd->clrText = RGB(0, 0, 0);
					else
						lvCd->clrText = ::GetSysColor(COLOR_GRAYTEXT);// system gray color for unspecified default replacement

					return CDRF_NOTIFYPOSTPAINT;
				}
			case CDDS_ITEMPOSTPAINT | CDDS_SUBITEM:
				if(lvCd->iSubItem == 2)
					lvCd->clrText = defSiColor; // restoration of default LVC text color after painting

				return CDRF_DODEFAULT;
			}
		}

		return CDRF_DODEFAULT;
	}

	LRESULT OnOK(WORD, WORD wID, HWND, BOOL&)
	{
		if(GetFocus() == m_edit)
		{
			m_words[m_editidx].replacement = U::GetWindowText(m_edit);
			m_words[m_editidx].flags |= HASREPL;
			m_edit.ShowWindow(SW_HIDE);
			
			m_lv.SetItemState(m_editidx, !LVIS_SELECTED, LVIS_SELECTED); // protects from UI-visible selection of LVC row
			return 0;
		}

		EndDialog(wID);
		return 0;
	}

	LRESULT OnCancel(WORD, WORD wID, HWND, BOOL&)
	{
		if(GetFocus() == m_edit)
		{
			m_edit.ShowWindow(SW_HIDE);
			return 0;
		}

		EndDialog(wID);
		return 0;
	}

	LRESULT OnBnClickedCheckShowhideExcls(WORD, WORD, HWND, BOOL&)
	{
		m_showhide_excls = !m_showhide_excls;

		if(!m_showhide_excls)
		{
			m_excl_words.RemoveAll();

			for(int i = 0; i < m_words.GetSize(); ++i)
			{
				if(m_words[i].flags & WARN)
				{
					m_words[i].flags &= ~HASREPL;
					m_excl_words.Add(m_words[i]);
					m_words.RemoveAt(i--);
				}
			}
		}
		else
		{
			for(int i = 0; i < m_excl_words.GetSize(); ++i)
			{
				m_words.Add(m_excl_words[i]);
			}

			if(m_sort)
				qsort(m_words.GetData(), m_words.GetSize(), sizeof(FB::Doc::Word), g_compare_funcs[abs(m_sort)*2 - (m_sort < 0 ? 1 : 2)]);
			else
				qsort(m_words.GetData(), m_words.GetSize(), sizeof(FB::Doc::Word), compare_nocase);

		}

		m_lv.SetItemCount(m_words.GetSize());
		m_lv.Invalidate();

		return 0;
	}

	LRESULT OnBnClickedButtonSelAll(WORD, WORD, HWND, BOOL&)
	{
		for(int i = 0; i < m_lv.GetItemCount(); ++i)
			m_lv.SelectItem(i);;
		
		m_lv.SetFocus();

		return 0;
	}

	LRESULT OnBnClickedButtonAddhltoexcls(WORD , WORD , HWND , BOOL&)
	{
		CSimpleArray<int> iWords;

		for(int i = 0; i < m_lv.GetItemCount(); ++i)
		{
			if(m_lv.GetItemState(i, LVIS_SELECTED) == LVIS_SELECTED)
				iWords.Add(i);
		}

		WordsToExclusions(iWords);

		m_lv.SetFocus();
		m_lv.Invalidate();

		return 0;
	}

	LRESULT OnBnClickedButtonDesel(WORD , WORD, HWND , BOOL& )
	{
		for(int i = 0; i < m_lv.GetItemCount(); ++i)
			m_lv.SetItemState(i, ~m_lv.GetItemState(i, LVIS_SELECTED), LVIS_SELECTED);

		m_lv.SetFocus();

		return 0;
	}

	LRESULT OnBnClickedButtonSethlrepl(WORD, WORD, HWND, BOOL&)
	{
		for(int i = 0; i < m_lv.GetItemCount(); ++i)
			if(m_lv.GetItemState(i, LVIS_SELECTED) == LVIS_SELECTED)
				m_words[i].flags |= HASREPL;

		m_lv.SetFocus();
		m_lv.Invalidate();

		return 0;
	}

	LRESULT OnBnClickedButtonRemovehlrepl(WORD, WORD, HWND, BOOL&)
	{
		for(int i = 0; i < m_lv.GetItemCount(); ++i)
			if(m_lv.GetItemState(i, LVIS_SELECTED) == LVIS_SELECTED && m_words[i].flags & HASREPL)
				m_words[i].flags &= ~HASREPL;

		m_lv.SetFocus();
		m_lv.Invalidate();

		return 0;
	}

	LRESULT OnBnClickedButtonSelallrepl(WORD, WORD, HWND, BOOL&)
	{
		for(int i = 0; i < m_lv.GetItemCount(); ++i)
			m_words[i].flags |= HASREPL;

		m_lv.SetFocus();
		m_lv.Invalidate();

		return 0;
	}
};

bool ShowWordsDialog(FB::Doc& document)
{
	int i,j;

	CSimpleArray<FB::Doc::Word> hwords;
	document.GetWordList(FB::Doc::GW_INCLUDE_HYPHENS | FB::Doc::GW_HYPHENS_ONLY, hwords, L"P");

	if(hwords.GetSize() > 0)
	{
		//CSimpleArray<FB::Doc::Word> words;
		//document.GetWordList(0, words);

		// Re-sort hwords without hyphens
		for(i = 0; i < hwords.GetSize(); ++i)
		{
			hwords[i].replacement = hwords[i].word;
			hwords[i].replacement.Remove('-');
		}
		qsort(hwords.GetData(), hwords.GetSize(), sizeof(FB::Doc::Word), compare_nocase);

		/*// Now search for extra hyphens
		for(i = j = 0; i < words.GetSize() && j < hwords.GetSize();)
		{
			// Compare top words
			int cmp = hwords[j].replacement.CompareNoCase(words[i].word);
			if(cmp == 0)
			{
				// Equal, mark as suspicious and advance both
				hwords[j].flags = WARN;
				++j;
				++i;
			}
			else if (cmp > 0) // word is < hc, advance word
				++i;
			else // word is > hc, advance hc
				++j;
		}*/
		int exclsize = _Settings.m_words.size();
		int hwsize = hwords.GetSize();
		for(i = 0; i < hwsize; ++i)
		{
			for(j = 0; j < exclsize; ++j)
			{
				if(hwords[i].word.CompareNoCase(_Settings.m_words[j].m_word) == 0)
				{
					_Settings.m_words[j].m_count += hwords[i].count;
					// Equal, mark as suspicious and advance both
					hwords[i].flags = WARN;
					break;
				}
			}
		}
	}

	CWordsDlg dlg(hwords);
	if(dlg.DoModal() != IDOK)
		return false;

	// Replace words
	int nRepl = 0, nTried = 0;
	bool doUndo = false;
	for(i = 0; i < hwords.GetSize(); ++i)
	{
		if(!(hwords[i].flags & HASREPL))
			continue;
		else
		{
			if(!doUndo)
			{
				document.m_body.BeginUndoUnit(L"replace");
				doUndo = true;
			}
		}

		++nTried;

		// Construct a search pattern
		int hyp = hwords[i].word.Find(L'-');
		CString re;
		re.Format(L"%s( |\\n|\\r\\n)*-( |\\n|\\r\\n)*%s",
					hwords[i].word.Left(hyp),
					hwords[i].word.Right(hwords[i].word.GetLength() - hyp - 1));

		MSHTML::IHTMLDocument3Ptr doc = document.m_body.Document();

		CWaitCursor hourglass;
		int nWordRepl = 0;
		while(nWordRepl < hwords[i].count) // that is hack because of unknown reason of wrong innerText value during active dynamic replace
		{
			nWordRepl += document.m_body.ReplaceToolWordsRe(re, hwords[i].replacement, doc->getElementById(L"fbw_body"), L"P");
		}

		nRepl += nWordRepl;
	}

	if(nTried > 0)
	{
		document.m_body.EndUndoUnit();
		wchar_t cpt[MAX_LOAD_STRING + 1];
		wchar_t msg[MAX_LOAD_STRING + 1];
		::LoadString(_Module.GetResourceInstance(), IDS_REPL_WORDS_CPT, cpt, MAX_LOAD_STRING);
		::LoadString(_Module.GetResourceInstance(), IDS_REPL_WORDS_MSG, msg, MAX_LOAD_STRING);
		U::MessageBox(MB_OK, cpt, msg, nRepl);
	}

	return true;
}
