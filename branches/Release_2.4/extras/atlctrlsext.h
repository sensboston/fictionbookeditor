#ifndef __ATLCTRLSEXT_H__
#define __ATLCTRLSEXT_H__

/////////////////////////////////////////////////////////////////////////////
// Additional Windows control wrappers
//
// Written by Bjarke Viksoe (bjarke@viksoe.dk)
// Copyright (c) 2002-2003 Bjarke Viksoe.
//
// This code may be used in compiled form in any way you desire. This
// file may be redistributed by any means PROVIDING it is 
// not sold for profit without the authors written consent, and 
// providing that this notice and the authors name is included. 
//
// This file is provided "as is" with no expressed or implied warranty.
// The author accepts no liability if it causes any damage to you or your
// computer whatsoever. It's free, so don't hassle me about it.
//
// Beware of bugs.
//

#pragma once

#ifndef __cplusplus
   #error ATL requires C++ compilation (use a .cpp suffix)
#endif

#ifndef __ATLCTRLS_H__
   #error atlctrlsext.h requires atlctrls.h to be included first
#endif

#if (_WTL_VER < 0x0700)
   #error This file requires WTL version 7.0 or higher
#endif


namespace WTL
{

/////////////////////////////////////////////////////////////////////////////
// A mananged ImageList control

class CImageListCtrl : public CImageList
{
public:
   ~CImageListCtrl()
   {
      Destroy();
   }
};

typedef CImageList CImageListHandle;


/////////////////////////////////////////////////////////////////////////////
// CSimpleValStack

template< class T >
class CSimpleValStack : public CSimpleValArray< T >
{
public:
   BOOL Push(T t)
   {
      return Add(t);
   }

   T Pop()
   {
      int nLast = GetSize() - 1;
      if( nLast < 0 ) return NULL;   // must be able to convert to NULL
      T t = m_aT[nLast];
      if( !RemoveAt(nLast) ) return NULL;
      return t;
   }

   T GetCurrent()
   {
      int nLast = GetSize() - 1;
      if( nLast < 0 ) return NULL;   // must be able to convert to NULL
      return m_aT[nLast];
   }
};


/////////////////////////////////////////////////////////////////////////////
// MDI Frame command message map

template< class T >
class CMDICommands : public CMessageMap
{
public:
   BEGIN_MSG_MAP(CMDICommands)
      COMMAND_ID_HANDLER(ID_WINDOW_CASCADE, OnWindowCascade)
      COMMAND_ID_HANDLER(ID_WINDOW_TILE_HORZ, OnWindowTileHorz)
      COMMAND_ID_HANDLER(ID_WINDOW_TILE_VERT, OnWindowTileVert)
      COMMAND_ID_HANDLER(ID_WINDOW_ARRANGE, OnWindowArrangeIcons)
   END_MSG_MAP()

   LRESULT OnWindowCascade(WORD /*wNotifyCode*/, WORD /*wID*/, HWND /*hWndCtl*/, BOOL& /*bHandled*/)
   {
      T* pT = static_cast<T*>(this); pT;
      pT->MDICascade();
      return 0;
   }

   LRESULT OnWindowTileHorz(WORD /*wNotifyCode*/, WORD /*wID*/, HWND /*hWndCtl*/, BOOL& /*bHandled*/)
   {
      T* pT = static_cast<T*>(this); pT;
      pT->MDITile(MDITILE_HORIZONTAL);
      return 0;
   }
   
   LRESULT OnWindowTileVert(WORD /*wNotifyCode*/, WORD /*wID*/, HWND /*hWndCtl*/, BOOL& /*bHandled*/)
   {
      T* pT = static_cast<T*>(this); pT;
      pT->MDITile(MDITILE_VERTICAL);
      return 0;
   }   
   
   LRESULT OnWindowArrangeIcons(WORD /*wNotifyCode*/, WORD /*wID*/, HWND /*hWndCtl*/, BOOL& /*bHandled*/)
   {
      T* pT = static_cast<T*>(this); pT;
      pT->MDIIconArrange();
      return 0;
   }
};


/////////////////////////////////////////////////////////////////////////////
// CCustomXXXDraw - MI class for Common Controls custom-draw support

// NOTE: WTL 7 includes a fine CCustomDraw class, but my class supports
//       the correct NM_CUSTOMDRAW structures for each control type.
template< class T, typename TNMCUSTOMDRAW >
class CCustomDrawEx
{
public:
   typedef CCustomDrawEx< T, TNMCUSTOMDRAW > thisClass;

#if (_ATL_VER < 0x0700)

   BOOL m_bHandledCD;

   BOOL IsMsgHandled() const
   {
      return m_bHandledCD;
   }

   void SetMsgHandled(BOOL bHandled)
   {
      m_bHandledCD = bHandled;
   }

#endif // _ATL_VER

   // Message map and handlers
   
   BEGIN_MSG_MAP( thisClass )
      NOTIFY_CODE_HANDLER(NM_CUSTOMDRAW, OnCustomDraw)
   ALT_MSG_MAP(1)
      REFLECTED_NOTIFY_CODE_HANDLER(NM_CUSTOMDRAW, OnCustomDraw)
   END_MSG_MAP()

   LRESULT OnCustomDraw(int idCtrl, LPNMHDR pnmh, BOOL& bHandled)
   {
      T* pT = static_cast<T*>(this);
      pT->SetMsgHandled(TRUE);
      TNMCUSTOMDRAW lpNM = (TNMCUSTOMDRAW) pnmh;
      DWORD dwRet = 0;
      switch( lpNM->nmcd.dwDrawStage ) {
      case CDDS_PREPAINT:
         dwRet = pT->OnPrePaint(idCtrl, lpNM);
         break;
      case CDDS_POSTPAINT:
         dwRet = pT->OnPostPaint(idCtrl, lpNM);
         break;
      case CDDS_PREERASE:
         dwRet = pT->OnPreErase(idCtrl, lpNM);
         break;
      case CDDS_POSTERASE:
         dwRet = pT->OnPostErase(idCtrl, lpNM);
         break;
      case CDDS_ITEMPREPAINT:
         dwRet = pT->OnItemPrePaint(idCtrl, lpNM);
         break;
      case CDDS_ITEMPOSTPAINT:
         dwRet = pT->OnItemPostPaint(idCtrl, lpNM);
         break;
#if (_WIN32_IE >= 0x0400)
      case CDDS_ITEMPREPAINT|CDDS_SUBITEM:
         dwRet = pT->OnSubItemPrePaint(idCtrl, lpNM);
         break;
      case CDDS_ITEMPOSTPAINT|CDDS_SUBITEM:
         dwRet = pT->OnSubItemPostPaint(idCtrl, lpNM);
         break;
#endif // _WIN32_IE
      case CDDS_ITEMPREERASE:
         dwRet = pT->OnItemPreErase(idCtrl, lpNM);
         break;
      case CDDS_ITEMPOSTERASE:
         dwRet = pT->OnItemPostErase(idCtrl, lpNM);
         break;
      default:
         pT->SetMsgHandled(FALSE);
         break;
      }
      bHandled = pT->IsMsgHandled();
      return dwRet;
   }

   // Overrideables

   DWORD OnPrePaint(int /*idCtrl*/, TNMCUSTOMDRAW /*lpNM*/)
   {
      return CDRF_DODEFAULT;
   }
   
   DWORD OnPostPaint(int /*idCtrl*/, TNMCUSTOMDRAW /*lpNM*/)
   {
      return CDRF_DODEFAULT;
   }
   
   DWORD OnPreErase(int /*idCtrl*/, TNMCUSTOMDRAW /*lpNM*/)
   {
      return CDRF_DODEFAULT;
   }
   
   DWORD OnPostErase(int /*idCtrl*/, TNMCUSTOMDRAW /*lpNM*/)
   {
      return CDRF_DODEFAULT;
   }
   
   DWORD OnItemPrePaint(int /*idCtrl*/, TNMCUSTOMDRAW /*lpNM*/)
   {
      return CDRF_DODEFAULT;
   }
   
   DWORD OnItemPostPaint(int /*idCtrl*/, TNMCUSTOMDRAW /*lpNM*/)
   {
      return CDRF_DODEFAULT;
   }

#if (_WIN32_IE >= 0x0400)

   DWORD OnSubItemPrePaint(int /*idCtrl*/, TNMCUSTOMDRAW /*lpNM*/)
   {
      return CDRF_DODEFAULT;
   }
   
   DWORD OnSubItemPostPaint(int /*idCtrl*/, TNMCUSTOMDRAW /*lpNM*/)
   {
      return CDRF_DODEFAULT;
   }
#endif // _WIN32_IE

   DWORD OnItemPreErase(int /*idCtrl*/, TNMCUSTOMDRAW /*lpNM*/)
   {
      return CDRF_DODEFAULT;
   }

   DWORD OnItemPostErase(int /*idCtrl*/, TNMCUSTOMDRAW /*lpNM*/)
   {
      return CDRF_DODEFAULT;
   }
};

template< class T >
class CCustomTreeViewDraw : public CCustomDrawEx<T, LPNMTVCUSTOMDRAW> { };

template< class T >
class CCustomListViewDraw : public CCustomDrawEx<T, LPNMCUSTOMDRAW> { };

template< class T >
class CCustomToolBarDraw : public CCustomDrawEx<T, LPNMTBCUSTOMDRAW> { };

template< class T >
class CCustomToolTipDraw : public CCustomDrawEx<T, LPNMTTCUSTOMDRAW> { };


/////////////////////////////////////////////////////////////////////////////
// Helper macros

#define LISTITEM_SELECTED(pnmlv)    ( ((pnmlv->uOldState & LVIS_SELECTED)==0) && ((pnmlv->uNewState & LVIS_SELECTED)!=0) )
#define LISTITEM_UNSELECTED(pnmlv)  ( ((pnmlv->uOldState & LVIS_SELECTED)!=0) && ((pnmlv->uNewState & LVIS_SELECTED)==0) )
#define LISTITEM_CHECKED(pnmlv)     ( (pnmlv->uNewState & LVIS_STATEIMAGEMASK)!=0 )


/////////////////////////////////////////////////////////////////////////////
// CCheckTreeViewCtrl - Better support for a checked TreeView

#define TVN_ITEMCHECKED TVN_LAST + 1

class CCheckTreeViewCtrl : public CWindowImpl< CCheckTreeViewCtrl, CTreeViewCtrl >
{
public:
   typedef CWindowImpl< CCheckTreeViewCtrl, CTreeViewCtrl >   parentClass;

   NMTREEVIEW m_nmtv;

   // Operations

   BOOL SubclassWindow(HWND hWnd)
   {
      BOOL bRet = parentClass::SubclassWindow(hWnd);
      if( bRet ) ModifyStyle(0, TVS_CHECKBOXES);
      return bRet;
   }

   BOOL DeleteAllItems()
   {      
      BOOL bRes = CTreeViewCtrl::DeleteAllItems();
      // There's a bug in Windows that seems to remove this style
      // whenever the items are deleted.
      ModifyStyle(TVS_CHECKBOXES, 0);
      ModifyStyle(0, TVS_CHECKBOXES);
      return bRes;
   }

   // Message map and handlers

   BEGIN_MSG_MAP(CCheckTreeViewCtrl)
      MESSAGE_HANDLER(WM_CREATE, OnCreate)
      REFLECTED_NOTIFY_CODE_HANDLER(NM_CLICK, OnClick)
   END_MSG_MAP()

   LRESULT OnCreate(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& /*bHandled*/)
   {
      // First let ListView control initialize everything
      LRESULT lRet = DefWindowProc(uMsg, wParam, lParam);
      ModifyStyle(0, TVS_CHECKBOXES);
      return lRet;
   }

   LRESULT OnClick(int idCtrl, LPNMHDR pnmh, BOOL& bHandled)
   {
      // Send TVN_ITEMCHECKED notifications to parent when check
      // state changes.
      // MS Kbase Q261289 explains how this is done.
      TVHITTESTINFO ht = { 0 };
      DWORD dwpos = ::GetMessagePos();
      ht.pt.x = GET_X_LPARAM(dwpos);
      ht.pt.y = GET_Y_LPARAM(dwpos);
      ::MapWindowPoints(HWND_DESKTOP, m_hWnd, &ht.pt, 1);
      HitTest(&ht);   
      if( TVHT_ONITEMSTATEICON &ht.flags ) {
         ::ZeroMemory(&m_nmtv, sizeof(m_nmtv));
         m_nmtv.hdr = *pnmh;
         m_nmtv.hdr.code = TVN_ITEMCHECKED;
         m_nmtv.itemNew.hItem = ht.hItem;
         m_nmtv.itemNew.mask = TVIF_STATE | TVIF_PARAM;
         GetItem(&m_nmtv.itemNew);
         m_nmtv.ptDrag = ht.pt;
         // BUG: Tehcnically we could receive two clicks before the first
         //      message was dispatched since we're using PostMessage() here.
         //      But it beats other alternatives...
         ::PostMessage(GetParent(), WM_NOTIFY, idCtrl, (LPARAM) &m_nmtv);
      }
      bHandled = FALSE;
      return 0;
   }
};


/////////////////////////////////////////////////////////////////////////////
// Customizable toolbar

// Simple implementation of ToolBar customization support.
// It handles only one ToolBar in total!
// Let the parent window derive from the class; chain it in the message map.
// Call InitToolbar() after creating the ToolBar control.
template< class T >
class CCustomizableToolBarCommands
{
public:
   typedef CCustomizableToolBarCommands<T> thisClass;
   typedef CSimpleArray<TBBUTTON> TBBUTTONS;

   CSimpleMap<int, TBBUTTONS> m_aButtons;
   CSimpleMap<int, TBBUTTONS> m_aDefaultButtons;
   CSimpleMap<int, CString> m_BtnText;

   // Operations

   BOOL InitToolBar(HWND hWndToolBar, UINT nResource, BOOL bInitialSeparator = FALSE)
   {
      ATLASSERT(::IsWindow(hWndToolBar));

      // The ToolBar is adjustable!
      CToolBarCtrl tb = hWndToolBar;
      ATLASSERT(tb.GetStyle() & CCS_ADJUSTABLE); // Need this style to properly function on XP!
      tb.ModifyStyle(0, CCS_ADJUSTABLE);

      // Gather information about toolbar buttons by building the toolbar.
      // Needed so we can reset it later on.
      // This code is almost identical to the CFrameWindowImplBase::CreateSimpleToolBarCtrl
      // code, but it also needs to build it the exact same way...
      HINSTANCE hInst = _Module.GetResourceInstance();
      HRSRC hRsrc = ::FindResource(hInst, (LPCTSTR) nResource, RT_TOOLBAR);
      if (hRsrc == NULL) return FALSE;
      HGLOBAL hGlobal = ::LoadResource(hInst, hRsrc);
      if( hGlobal == NULL ) return FALSE;

      struct _AtlToolBarData
      {
         WORD wVersion;
         WORD wWidth;
         WORD wHeight;
         WORD wItemCount;
         //WORD aItems[wItemCount]
         WORD* items() { return (WORD*)(this+1); }
      };
      _AtlToolBarData* pData = (_AtlToolBarData*) ::LockResource(hGlobal);
      if( pData == NULL ) return FALSE;
      ATLASSERT(pData->wVersion==1);

	  TBBUTTONS aButtons;

      WORD* pItems = pData->items();
      // Set initial separator (half width)
      if( bInitialSeparator ) {
         TBBUTTON bt;
         bt.iBitmap = 4;
         bt.idCommand = 0;
         bt.fsState = 0;
         bt.fsStyle = TBSTYLE_SEP;
         bt.dwData = 0;
         bt.iString = 0;
         aButtons.Add(bt);
      }
      // Scan other buttons
      int nBmp = 0;
      for( int i=0, j= bInitialSeparator ? 1 : 0; i<pData->wItemCount; i++, j++ ) {
         if( pItems[i] != 0 ) {
            TBBUTTON bt;
            bt.iBitmap = nBmp++;
            bt.idCommand = pItems[i];
            bt.fsState = TBSTATE_ENABLED;
            bt.fsStyle = TBSTYLE_BUTTON;
            bt.dwData = 0;
            bt.iString = 0;
            aButtons.Add(bt);
         }
         else {
            TBBUTTON bt;
            bt.iBitmap = 8;
            bt.idCommand = 0;
            bt.fsState = 0;
            bt.fsStyle = TBSTYLE_SEP;
            bt.dwData = 0;
            bt.iString = 0;
            aButtons.Add(bt);
         }
      }
	  m_aButtons.Add((int)hWndToolBar, aButtons);
	  m_aDefaultButtons.Add((int)hWndToolBar, aButtons);
      return TRUE;
   }

   BOOL AddToolbarButton(HWND hWndToolBar, TBBUTTON button, CString text)
   {
      CToolBarCtrl tb = hWndToolBar;
	  m_BtnText.Add(button.idCommand, text);
	  return m_aButtons.GetValueAt(m_aButtons.FindKey((int)hWndToolBar)).Add(button);
   }

   // Message map and handler

   BEGIN_MSG_MAP( thisClass )
      NOTIFY_CODE_HANDLER(TBN_BEGINADJUST, OnTbBeginAdjust)
      NOTIFY_CODE_HANDLER(TBN_ENDADJUST, OnTbEndAdjust)
      NOTIFY_CODE_HANDLER(TBN_RESET, OnTbReset)
      NOTIFY_CODE_HANDLER(TBN_TOOLBARCHANGE, OnTbToolBarChange)
      NOTIFY_CODE_HANDLER(TBN_QUERYINSERT, OnTbQueryInsert)
      NOTIFY_CODE_HANDLER(TBN_QUERYDELETE, OnTbQueryDelete)
      NOTIFY_CODE_HANDLER(TBN_GETBUTTONINFO, OnTbGetButtonInfo)      
   END_MSG_MAP()

   LRESULT OnTbBeginAdjust(int /*idCtrl*/, LPNMHDR pnmh, BOOL& bHandled)
   {
      LPTBNOTIFY lpTbNotify = (LPTBNOTIFY) pnmh;
      int tb = (int)lpTbNotify->hdr.hwndFrom;
	  TBBUTTONS aButtons = m_aButtons.GetValueAt(m_aButtons.FindKey(tb));
	  ATLASSERT(aButtons.GetSize()>0); // Remember to call InitToolBar()!
      bHandled = FALSE;
      return 0;
   }
   
   LRESULT OnTbEndAdjust(int /*idCtrl*/, LPNMHDR /*pnmh*/, BOOL& bHandled)
   {
      bHandled = FALSE;
      return TRUE;
   }
   
   LRESULT OnTbToolBarChange(int /*idCtrl*/, LPNMHDR /*pnmh*/, BOOL& bHandled)
   {
      bHandled = FALSE;
      return 0;
   }
   
   LRESULT OnTbReset(int /*idCtrl*/, LPNMHDR pnmh, BOOL& /*bHandled*/)
   {
      LPTBNOTIFY lpTbNotify = (LPTBNOTIFY) pnmh;
      // Restore the old button-set
      CToolBarCtrl tb = lpTbNotify->hdr.hwndFrom;
      while( tb.GetButtonCount() > 0 ) tb.DeleteButton(0);
	  TBBUTTONS aButtons = m_aDefaultButtons.GetValueAt(m_aDefaultButtons.FindKey((int)lpTbNotify->hdr.hwndFrom));
      tb.AddButtons(aButtons.GetSize(), aButtons.GetData());
      return TRUE;
   }
   
   LRESULT OnTbQueryInsert(int /*idCtrl*/, LPNMHDR /*pnmh*/, BOOL& /*bHandled*/)
   {
      // Allow all buttons!
      return TRUE;
   }
   
   LRESULT OnTbQueryDelete(int /*idCtrl*/, LPNMHDR /*pnmh*/, BOOL& /*bHandled*/)
   {
      // All buttons can be deleted!
      return TRUE;
   }
   
   LRESULT OnTbGetButtonInfo(int /*idCtrl*/, LPNMHDR pnmh, BOOL& /*bHandled*/)
   {
      LPTBNOTIFY lpTbNotify = (LPTBNOTIFY) pnmh;
      CToolBarCtrl tb = lpTbNotify->hdr.hwndFrom;
	  TBBUTTONS aButtons = m_aButtons.GetValueAt(m_aButtons.FindKey((int)lpTbNotify->hdr.hwndFrom));
      // The toolbar requests information about buttons that we don't know of...
      if( lpTbNotify->iItem >= aButtons.GetSize() ) return FALSE;
	  // Locate tooltip text and copy second half of it.
      // This is the same code as CFrameWindowImplBase uses, despite how 
      // dangerous it may look...
      TCHAR szBuff[256] = { 0 };
      LPCTSTR pstr = szBuff;
	  TBBUTTON btn = aButtons[lpTbNotify->iItem];

#if (_ATL_VER < 0x0700)
      int nRet = ::LoadString(_Module.GetResourceInstance(), btn.idCommand, szBuff, 255);
#else
	  int nRet = ATL::AtlLoadString(btn.idCommand, szBuff, 255);
#endif
	  if (btn.iString)
	  {
		  pstr = m_BtnText.GetValueAt(m_BtnText.FindKey(btn.idCommand));
		  btn.iString = tb.AddStrings(pstr);
	  }
	  else	
		  for( int i = 0; i < nRet; i++ ) {
			 if( szBuff[i] == _T('\n') ) {
				pstr = szBuff + i + 1;
				break;
			 }
		  }
      lpTbNotify->tbButton = btn;
	  ::lstrcpyn(lpTbNotify->pszText, pstr, lpTbNotify->cchText);
      lpTbNotify->cchText = ::lstrlen(pstr);
      return TRUE;
   }
};


/////////////////////////////////////////////////////////////////////////////
// ActiveX helpers

#ifdef __ATLHOST_H__

// Load HTML into MSHTML ActiveX control
inline BOOL AtlLoadHTML(IUnknown* pUnkControl, LPCSTR pstrHTML)
{
   ATLASSERT(!::IsBadStringPtrA(pstrHTML,-1));
   HANDLE hHTMLText = ::GlobalAlloc( GPTR, (::lstrlenA(pstrHTML) + 1) * sizeof(CHAR) );
   if( hHTMLText == NULL ) return FALSE;
   ::lstrcpyA( (CHAR*) hHTMLText, pstrHTML );
   IStream* pStream = NULL;
   HRESULT Hr = ::CreateStreamOnHGlobal(hHTMLText, TRUE, &pStream);
   if( SUCCEEDED(Hr) ) {
      IPersistStreamInit* pPersistStreamInit = NULL;
      Hr = pUnkControl->QueryInterface(IID_IPersistStreamInit, (LPVOID*) &pPersistStreamInit);
      if( SUCCEEDED(Hr) ) {
         Hr = pPersistStreamInit->InitNew();
         if( SUCCEEDED(Hr) ) Hr = pPersistStreamInit->Load(pStream);
         pPersistStreamInit->Release();
      }
      pStream->Release();
   }
   return SUCCEEDED(Hr);
};

#endif // __ATLHOST_H__


}; // namespace WTL

#endif // __ATLCTRLSEXT_H__
