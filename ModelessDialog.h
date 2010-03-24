#pragma once

#define LODWORD(l) ((DWORD)((DWORDLONG)(l)))
#define HIDWORD(l) ((DWORD)(((DWORDLONG)(l)>>32)&0xFFFFFFFF))
#define MAKEDWORDLONG(a,b) ((DWORDLONG)(((DWORD)(a))|(((DWORDLONG)((DWORD)(b)))<<32)))

template <class T, class TBase = CWindow>
class ATL_NO_VTABLE CModelessDialogImpl : public CDialogImplBaseT<TBase>
{
protected:
	static CSimpleMap<DWORD, ULONGLONG>& table()
	{
		// ULONGLONG == HHOOK - the counter of number of dialogs to show
		// When it's 0 a hook can be released
		static CSimpleMap<DWORD, ULONGLONG> hooks;
		return hooks;
	}

	static CSimpleArray<HWND>& windows()
	{
		static CSimpleArray<HWND> handles;
		return handles;
	}

	static LRESULT FAR PASCAL GetMsgProc(int nCode, WPARAM wParam, LPARAM lParam)
	{
		LPMSG lpMsg = (LPMSG)lParam;

		if(nCode >= 0 && PM_REMOVE == wParam)
		{
			if(lpMsg->message == WM_KEYDOWN &&
				lpMsg->wParam == VK_RETURN ||
				lpMsg->wParam == VK_ESCAPE ||
				lpMsg->wParam == VK_TAB)
			{
				for(int i = 0, m = windows().GetSize(); i < m; ++i)
				{
					if(::IsDialogMessage(windows()[i], lpMsg))
					{
						lpMsg->message = WM_NULL;
						lpMsg->lParam  = 0;
						lpMsg->wParam  = 0;
					}
				}
			}
		}

		HHOOK hook = (HHOOK)(DWORD_PTR)LODWORD(table().Lookup(::GetCurrentThreadId()));
		ATLASSERT(hook);

		return CallNextHookEx(hook, nCode, wParam, lParam);
	}

	void RemoveWindow(HWND hWnd)
	{
		if(windows().Remove(hWnd))
		{
			DWORD threadId = ::GetCurrentThreadId();
			ULONGLONG data = table().Lookup(threadId);
			if( data )
			{
				HHOOK hook = (HHOOK)(DWORD_PTR)LODWORD(data);
				DWORD counter = HIDWORD(data);
				if(1 == counter)
				{
					ATLASSERT( hook );

					::UnhookWindowsHookEx(hook);
					table().Remove(threadId);
				}
				else
				{
					--counter;
					table().SetAt(threadId, MAKEDWORDLONG((DWORD_PTR)hook, counter));
				}
			}
		}
	}

	bool m_valid;

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
		DWORD threadId = ::GetCurrentThreadId();
		if(-1 == table().FindKey(threadId))
		{
			HHOOK hook = ::SetWindowsHookEx(WH_GETMESSAGE, (HOOKPROC)GetMsgProc,
											NULL, GetCurrentThreadId());

			table().Add(threadId, MAKEDWORDLONG((DWORD_PTR)hook,1));
		}
		else
		{
			ULONGLONG data = table().Lookup(threadId);
			HHOOK hook = (HHOOK)(DWORD_PTR)LODWORD(data);
			DWORD counter = HIDWORD(data) + 1;
			table().SetAt(threadId, MAKEDWORDLONG((DWORD_PTR)hook, counter));
		}

		windows().Add(m_hWnd);

		::ShowWindow(m_hWnd, SW_SHOWNA);

		m_valid = true;
		return hWnd;
	}

	BOOL DestroyWindow()
	{
		ATLASSERT(m_hWnd);

		RemoveWindow(m_hWnd);

		m_valid = false;
		return ::DestroyWindow(m_hWnd);
	}

	BOOL IsValid()
	{
		return m_valid;
	}
};
