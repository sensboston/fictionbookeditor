#pragma once

#include "DialogMessageHook.h"

#define LODWORD(l) ((DWORD)((DWORDLONG)(l)))
#define HIDWORD(l) ((DWORD)(((DWORDLONG)(l)>>32)&0xFFFFFFFF))
#define MAKEDWORDLONG(a,b) ((DWORDLONG)(((DWORD)(a))|(((DWORDLONG)((DWORD)(b)))<<32)))

template <class T, class TBase = CWindow>
class ATL_NO_VTABLE CModelessDialogImpl : public CDialogImplBaseT<TBase>
{
public:
	CModelessDialogImpl():m_valid(false) {};

	HWND ShowDialog(HWND hWndParent = ::GetActiveWindow(), LPARAM dwInitParam = NULL)
	{
		ATLASSERT(m_hWnd == NULL);
		ATLASSERT(::IsWindow(hWndParent));

		_AtlWinModule.AddCreateWndData(&m_thunk.cd, (CDialogImplBaseT<TBase>*)this);

		HWND hWnd = ::CreateDialogParam(_AtlBaseModule.GetResourceInstance(),
										MAKEINTRESOURCE(static_cast<T*>(this)->IDD),
										hWndParent,
										T::StartDialogProc,
										dwInitParam);

		ATLASSERT(m_hWnd == hWnd);
		CDialogMessageHook::InstallHook(hWnd);

		::ShowWindow(m_hWnd, SW_SHOWNA);

		m_valid = true;
		return hWnd;
	}

	BOOL DestroyWindow()
	{
		ATLASSERT(m_hWnd);
		CDialogMessageHook::UninstallHook(m_hWnd);
		m_valid = false;
		return ::DestroyWindow(m_hWnd);
	}

	BOOL IsValid()
	{
		return m_valid;
	}
protected:
	bool m_valid;
};
