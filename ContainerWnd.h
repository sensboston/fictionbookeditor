#ifndef CONTAINERWND_H
#define CONTAINERWND_H

#if _MSC_VER >= 1000
#pragma once
#endif // _MSC_VER >= 1000

typedef CWinTraits<WS_CHILD|WS_VISIBLE|WS_CLIPCHILDREN|WS_CLIPSIBLINGS,WS_EX_CLIENTEDGE>
		  CContainerWndTraits;

class CContainerWnd : public CWindowImpl<CContainerWnd,CWindow,CContainerWndTraits>
{
public:
  DECLARE_WND_CLASS_EX(NULL, CS_DBLCLKS, COLOR_WINDOW)

  typedef CWindowImpl<CContainerWnd,CWindow,CContainerWndTraits> baseClass;
  BEGIN_MSG_MAP(CContainerWnd)
    MESSAGE_HANDLER(WM_ERASEBKGND, OnErase)
    MESSAGE_HANDLER(WM_SIZE,OnSize)
    MESSAGE_HANDLER(WM_SETFOCUS,OnFocus)
    {
	    bHandled = TRUE;
	    lResult = ForwardNotifications(uMsg, wParam, lParam, bHandled);
    }
    REFLECT_NOTIFICATIONS()
  END_MSG_MAP()

  static BOOL CALLBACK SizeProc(HWND hWnd,LPARAM lParam) {
    RECT  *rc=(RECT*)lParam;
    ::MoveWindow(hWnd,0,0,rc->right-rc->left,rc->bottom-rc->top,
      TRUE);
    return TRUE;
  }

  LRESULT OnSize(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL&) {
    RECT  rc;
    GetClientRect(&rc);
    ::EnumChildWindows(*this,SizeProc,(LPARAM)&rc);
    return 0;
  }

  LRESULT OnFocus(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL&) {
    HWND  hWnd=GetActiveWnd();
    if (hWnd!=NULL)
      ::SetFocus(hWnd);
    return 0;
  }

  LRESULT OnErase(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL&) {
    return 1;
  }

  static BOOL CALLBACK FindProc(HWND hWnd,LPARAM lParam) {
    if (::IsWindowVisible(hWnd)) {
      *(HWND*)lParam=hWnd;
      return FALSE;
    }
    return TRUE;
  }

  HWND	  GetActiveWnd() {
    HWND  hWnd=NULL;
    ::EnumChildWindows(*this,FindProc,(LPARAM)&hWnd);
    if (hWnd==NULL)
      hWnd=GetWindow(GW_CHILD);
    return hWnd;
  }

  void	  HideActiveWnd() {
    HWND  hWnd=GetActiveWnd();
    if (hWnd!=NULL)
      ::ShowWindow(hWnd,SW_HIDE);
  }

  void	  ActivateWnd(HWND hWnd) {
    HWND  hActive=GetActiveWnd();
    if (hActive!=hWnd && hActive!=NULL)
      ::ShowWindow(hActive,SW_HIDE);
    ::ShowWindow(hWnd,SW_SHOW);
  }

  void	  AttachWnd(HWND hWnd) {
    ::ShowWindow(hWnd,SW_HIDE);
    RECT  rc;
    GetClientRect(&rc);
    ::MoveWindow(hWnd,rc.left,rc.top,
      rc.right-rc.left,rc.bottom-rc.top,
      TRUE);
  }
};

#endif