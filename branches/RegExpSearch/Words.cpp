#include "stdafx.h"

#include "resource.h"
#include "res1.h"
#include "utils.h"
#include "apputils.h"
#include "FBEView.h"
#include "FBDoc.h"
#include "Words.h"

enum {
  NORMAL=0,
  WARN=1,
  STATEMASK=7,
  HASREPL=8
};

static int  compare_w_asc(const void *v1,const void *v2) {
  const FB::Doc::Word *w1=(const FB::Doc::Word *)v1;
  const FB::Doc::Word *w2=(const FB::Doc::Word *)v2;
  return w1->word.CompareNoCase(w2->word);
}
static int  compare_w_desc(const void *v1,const void *v2) {
  const FB::Doc::Word *w1=(const FB::Doc::Word *)v1;
  const FB::Doc::Word *w2=(const FB::Doc::Word *)v2;
  return w2->word.CompareNoCase(w1->word);
}
static int  compare_r_asc(const void *v1,const void *v2) {
  const FB::Doc::Word *w1=(const FB::Doc::Word *)v1;
  const FB::Doc::Word *w2=(const FB::Doc::Word *)v2;
  return w1->replacement.CompareNoCase(w2->replacement);
}
static int  compare_r_desc(const void *v1,const void *v2) {
  const FB::Doc::Word *w1=(const FB::Doc::Word *)v1;
  const FB::Doc::Word *w2=(const FB::Doc::Word *)v2;
  return w2->replacement.CompareNoCase(w1->replacement);
}
static int  compare_c_asc(const void *v1,const void *v2) {
  const FB::Doc::Word *w1=(const FB::Doc::Word *)v1;
  const FB::Doc::Word *w2=(const FB::Doc::Word *)v2;
  int cmp=w1->count - w2->count;
  return cmp ? cmp : w1->word.CompareNoCase(w2->word);
}
static int  compare_c_desc(const void *v1,const void *v2) {
  const FB::Doc::Word *w1=(const FB::Doc::Word *)v1;
  const FB::Doc::Word *w2=(const FB::Doc::Word *)v2;
  int cmp=w2->count - w1->count;
  return cmp ? cmp : w2->word.CompareNoCase(w1->word);
}

static int  (*g_compare_funcs[])(const void *,const void *)={
  compare_w_asc,
  compare_w_desc,
  compare_r_asc,
  compare_r_desc,
  compare_c_asc,
  compare_c_desc
};

class CWordsDlg: public CDialogImpl<CWordsDlg> {
public:
  enum { IDD = IDD_WORDS };

  CEdit				  m_edit;
  int				  m_editidx;
  CListViewCtrl			  m_lv;
  CSimpleArray<FB::Doc::Word>&	  m_words;
  int				  m_sort;
  DWORD				  m_ct;

  CWordsDlg(CSimpleArray<FB::Doc::Word>& words) : 
    m_words(words), m_sort(0), m_ct(0) { }

  BEGIN_MSG_MAP(CWordsDlg)
    COMMAND_ID_HANDLER(IDOK, OnOK)
    COMMAND_ID_HANDLER(IDCANCEL, OnCancel)
    NOTIFY_HANDLER(IDC_WLIST, LVN_GETDISPINFO, OnListDispInfo)
    NOTIFY_HANDLER(IDC_WLIST, LVN_COLUMNCLICK, OnListSort)
    NOTIFY_HANDLER(IDC_WLIST, NM_CLICK, OnListClick)
    NOTIFY_HANDLER(IDC_WLIST, LVN_ITEMCHANGED, OnListChanged)
    NOTIFY_CODE_HANDLER(NM_CUSTOMDRAW, OnCustomDraw)
    COMMAND_HANDLER(IDC_REDIT, EN_KILLFOCUS, OnEditLoseFocus)
    MESSAGE_HANDLER(WM_INITDIALOG, OnInitDialog)
  END_MSG_MAP()

  LRESULT OnInitDialog(UINT, WPARAM, LPARAM, BOOL&) {
    CImageList	icons;
    icons.Create(IDB_WORDSTATES, 16, 0, RGB(255,0,255));

    m_lv=GetDlgItem(IDC_WLIST);
    m_lv.SetImageList(icons.Detach(),LVSIL_SMALL);
    m_lv.SetExtendedListViewStyle(LVS_EX_FULLROWSELECT,LVS_EX_FULLROWSELECT);

    RECT    rc;
    m_lv.GetClientRect(&rc);
    int	    w=rc.right-rc.left-::GetSystemMetrics(SM_CXVSCROLL)-3;
    int	    sw=w/7;
    m_lv.InsertColumn(0,_T("Word"),LVCFMT_LEFT,sw*3,0);
    m_lv.InsertColumn(1,_T("Replacement"),LVCFMT_LEFT,sw*3,1);
    m_lv.InsertColumn(2,_T("Count   "),LVCFMT_RIGHT,w-6*sw,2);

    m_lv.SetItemCount(m_words.GetSize());

    m_edit=GetDlgItem(IDC_REDIT);

    return 0;
  }

  LRESULT OnListDispInfo(int id,NMHDR *hdr,BOOL&) {
    NMLVDISPINFO  *ni=(NMLVDISPINFO*)hdr;

    if (ni->item.iItem<0 || ni->item.iItem>=m_words.GetSize())
      return 0;

    FB::Doc::Word   *w=&m_words[ni->item.iItem];
    if (ni->item.mask & LVIF_TEXT)
      switch (ni->item.iSubItem) {
      case 0:
	ni->item.pszText=(TCHAR*)(const TCHAR *)w->word;
	break;
      case 1:
	ni->item.pszText=(TCHAR*)(const TCHAR *)w->replacement;
	break;
      case 2:
	_snwprintf(ni->item.pszText,ni->item.cchTextMax,_T("%d"),w->count);
	break;
      }

    if (ni->item.mask & LVIF_IMAGE)
      ni->item.iImage=w->flags & STATEMASK;

    return 0;
  }

  LRESULT OnListSort(int id,NMHDR *hdr,BOOL&) {
    NMLISTVIEW	*lv=(NMLISTVIEW*)hdr;

    if (lv->iSubItem+1 == abs(m_sort))
      m_sort = -m_sort;
    else
      m_sort = lv->iSubItem+1;

    qsort(m_words.GetData(),m_words.GetSize(),sizeof(FB::Doc::Word),
      g_compare_funcs[abs(m_sort)*2 - (m_sort<0 ? 1 : 2)]);

    m_lv.InvalidateRect(NULL); // force repainting after sorting

    return 0;
  }

  LRESULT OnListChanged(int id,NMHDR *hdr,BOOL&) {
    m_ct=::GetTickCount();
    return 0;
  }

  LRESULT OnListClick(int id,NMHDR *hdr,BOOL&) {
    NMITEMACTIVATE  *ai=(NMITEMACTIVATE*)hdr;

    if ((::GetTickCount()-m_ct)<500 || ai->iItem<0 || ai->iSubItem!=1)
      return 0;

    m_editidx=ai->iItem;

    FB::Doc::Word   *w=&m_words[m_editidx];

    m_edit.SetWindowText(w->flags & HASREPL ? w->replacement : w->word);

    RECT    rci;
    m_lv.GetSubItemRect(m_editidx,1,LVIR_BOUNDS,&rci);
    m_lv.ClientToScreen(&rci);
    ScreenToClient(&rci);
    m_edit.SetWindowPos(NULL,rci.left,rci.top,
      rci.right-rci.left,rci.bottom-rci.top,
      SWP_SHOWWINDOW|SWP_NOACTIVATE);
    m_edit.SetFocus();

    return 0;
  }

  LRESULT OnEditLoseFocus(WORD, WORD, HWND, BOOL&) {
    m_edit.ShowWindow(SW_HIDE);
    return 0;
  }

  LRESULT OnCustomDraw(int id,NMHDR *hdr,BOOL&) {
    if (hdr->hwndFrom==m_lv.GetHeader()) {
      NMCUSTOMDRAW  *cd=(NMCUSTOMDRAW*)hdr;

      switch (cd->dwDrawStage) {
      case CDDS_PREPAINT:
	return CDRF_NOTIFYITEMDRAW;
      case CDDS_ITEMPREPAINT:
	return CDRF_NOTIFYPOSTPAINT;
      case CDDS_ITEMPOSTPAINT:
	// paint sort indicator on top of the item
	if (cd->dwItemSpec+1==(unsigned)abs(m_sort)) {
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
	  ::Polygon(cd->hdc,pt,3);
	  ::SelectObject(cd->hdc,old);
	}
	return 0;
      }
    }
    return 0;
  }

  LRESULT OnOK(WORD, WORD wID, HWND, BOOL&) {
    if (GetFocus()==m_edit) {
      m_words[m_editidx].replacement=U::GetWindowText(m_edit);
      m_words[m_editidx].flags |= HASREPL;
      m_edit.ShowWindow(SW_HIDE);
      return 0;
    }
    EndDialog(wID);
    return 0;
  }
  LRESULT OnCancel(WORD, WORD wID, HWND, BOOL&) {
    if (GetFocus()==m_edit) {
      m_edit.ShowWindow(SW_HIDE);
      return 0;
    }
    EndDialog(wID);
    return 0;
  }
};

static int  compare_nocase(const void *v1,const void *v2) {
  const FB::Doc::Word *w1=(const FB::Doc::Word *)v1;
  const FB::Doc::Word *w2=(const FB::Doc::Word *)v2;
  return w1->replacement.CompareNoCase(w2->replacement);
}

bool  ShowWordsDialog(FB::Doc& document)
{
  int	i,j;

  CSimpleArray<FB::Doc::Word> hwords;
  document.GetWordList(FB::Doc::GW_INCLUDE_HYPHENS|FB::Doc::GW_HYPHENS_ONLY,
    hwords);

  if (hwords.GetSize()>0) {
    CSimpleArray<FB::Doc::Word> words;
    document.GetWordList(0,words);

    // re-sort hwords without hyphens
    for (i=0;i<hwords.GetSize();++i) {
      hwords[i].replacement=hwords[i].word;
      hwords[i].replacement.Remove('-');
    }
    qsort(hwords.GetData(),hwords.GetSize(),sizeof(FB::Doc::Word),compare_nocase);

    // now search for extra hyphens
    for (i=j=0;i<words.GetSize() && j<hwords.GetSize();) {
      // compare top words
      int   cmp=hwords[j].replacement.CompareNoCase(words[i].word);
      if (cmp==0) { // equal, mark as suspicious and advance both
		hwords[j].flags=WARN;
		++j;
		++i;
      } else if (cmp>0) // word is < hc, advance word
	  ++i;
		else // word is > hc, advance hc
		  ++j;
    }

    // remove replacement stuff
    for (i=0;i<hwords.GetSize();++i)
      hwords[i].replacement.Empty();
  }

  CWordsDlg   dlg(hwords);
  if (dlg.DoModal()!=IDOK)
    return false;

  // replace words
  int nRepl=0,nTried=0;
  for (i=0;i<hwords.GetSize();++i) {
    if (!(hwords[i].flags & HASREPL))
      continue;

    ++nTried;

    // construct a search pattern
    int	      hyp=hwords[i].word.Find(_T('-'));
    CString   re;
    re.Format(_T("\\B%s *- *%s\\B"),
		  hwords[i].word.Left(hyp),
		  hwords[i].word.Right(hwords[i].word.GetLength()-hyp-1));
    nRepl += document.m_body.ReplaceAllRe(re,hwords[i].replacement);
  }

  if (nTried>0)
  {
	  wchar_t cpt[MAX_LOAD_STRING + 1];
	  wchar_t msg[MAX_LOAD_STRING + 1];
	  ::LoadString(_Module.GetResourceInstance(), IDS_REPL_WORDS_CPT, cpt, MAX_LOAD_STRING);
	  ::LoadString(_Module.GetResourceInstance(), IDS_REPL_WORDS_MSG, msg, MAX_LOAD_STRING);
      U::MessageBox(MB_OK, cpt, msg, nRepl);
  }

  return true;
}