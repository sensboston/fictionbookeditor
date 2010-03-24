#ifndef APPUTILS_H
#define APPUTILS_H

// command line arguments
extern CSimpleArray<CString> _ARGV;

namespace AU
{
	// APP messages
	enum
	{
		WM_POSTCREATE = WM_APP,
		WM_SETSTATUSTEXT,
		WM_TRACKPOPUPMENU
	};

	struct TRACKPARAMS
	{
	HMENU	hMenu;
	UINT	uFlags;
	int		x;
	int		y;
	};

	// a generic inputbox
	bool InputBox(CString& result, const wchar_t* title, const wchar_t* prompt);
	// html
	CString GetAttrCS(MSHTML::IHTMLElement* elem, const wchar_t* attr);
	_bstr_t GetAttrB(MSHTML::IHTMLElement* elem, const wchar_t* attr);

	// command line arguments
	struct CmdLineArgs
	{
		// no args yet
		bool start_in_desc_mode;

		CmdLineArgs(): start_in_desc_mode(false) {}
	};
	extern CmdLineArgs _ARGS;
	bool ParseCmdLineArgs();

	// visual basic RegExps
	typedef VBScript_RegExp_55::IRegExp2Ptr				RegExp;
	typedef VBScript_RegExp_55::IMatchCollection2Ptr	ReMatches;
	typedef VBScript_RegExp_55::IMatch2Ptr				ReMatch;
	typedef VBScript_RegExp_55::ISubMatchesPtr			ReSubMatches;

	// persistent wait cursor
	class CPersistentWaitCursor: public CMessageFilter
	{
	public:
		CPersistentWaitCursor(): m_wait(0), m_old(0)
		{
			CMessageLoop* pLoop = _Module.GetMessageLoop();
			if(pLoop)
				pLoop->AddMessageFilter(this);
			m_wait = ::LoadCursor(NULL, IDC_WAIT);
			if(m_wait)
				m_old = ::SetCursor(m_wait);
		}

		~CPersistentWaitCursor()
		{
		CMessageLoop* pLoop = _Module.GetMessageLoop();
		if(pLoop)
			pLoop->RemoveMessageFilter(this);
		if(m_old)
			::SetCursor(m_old);
		}

		BOOL PreTranslateMessage(MSG* msg)
		{
			if(msg->message == WM_SETCURSOR && m_wait)
			{
				::SetCursor(m_wait);
				return TRUE;
			}
			return FALSE;
		}

	protected:
		HCURSOR m_wait, m_old;
		};

	char* ToUtf8(const CString& s, int& patlen);
}

#endif
