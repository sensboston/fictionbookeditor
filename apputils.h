#ifndef APPUTILS_H
#define APPUTILS_H

// command line arguments
extern CSimpleArray<CString> _ARGV;

#ifdef USE_PCRE
#include <atlbase.h>
#include <atlwin.h>
#include <atltypes.h>
#include <atlstr.h>
#include <atlcoll.h>
#include "pcre.h"
#endif

#define UTF8_CHAR_LEN( byte ) (( 0xE5000000 >> (( byte >> 3 ) & 0x1e )) & 3 ) + 1

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
	int InputBox(CString& result, const wchar_t* title, const wchar_t* prompt);
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

	// Regular expression classes
#ifdef USE_PCRE
	// VB-compatible wrappers
	typedef CSimpleArray<CString> CStrings;

	struct ISubMatches {
	public:
		__declspec(property(get=GetItem)) CString Item[];
		__declspec(property(get=GetCount)) long Count;
		CString GetItem ( long index ) { return m_strs[index]; }
		long GetCount () { return m_strs.GetSize(); }
		void AddItem (CString item) { m_strs.Add(item); }
	private:
		CStrings m_strs;
	};

	struct IMatch2 {
	public:
		IMatch2 (CString str, int index): m_str(str), m_index(index) {}
		__declspec(property(get=GetValue)) CString Value;
		__declspec(property(get=GetFirstIndex)) long FirstIndex;
		__declspec(property(get=GetLength)) long Length;
		__declspec(property(get=GetSubMatches)) ISubMatches* SubMatches;
		CString GetValue() { return m_str; }
		long GetFirstIndex() { return m_index; }
		long GetLength() { return m_str.GetLength(); }
		ISubMatches* GetSubMatches() { return &m_submatches; }
		void AddSubMatch(CString item) { m_submatches.AddItem(item); }
	private:
		CString m_str;
		int m_index;
		ISubMatches m_submatches;
	};

	struct IMatchCollection {
	public:
		IMatchCollection() { m_matches.RemoveAll(); }
		__declspec(property(get=GetCount)) long Count;
		__declspec(property(get=GetItem)) IMatch2* Item[];
		long GetCount() { return m_matches.GetSize(); }
		IMatch2* GetItem (long index) 
		{	
			int count = GetCount();
			if ((count == 0) || (index >= count)) return NULL;
			return &m_matches[index]; 
		}
		void AddItem(IMatch2* item) { m_matches.Add(*item); }
	private:
		CSimpleArray<IMatch2> m_matches;
	};

	// wrapper classes compatible with MS VBScrip
	struct IRegExp2 {
	public:
		__declspec(property(get=GetPattern,put=PutPattern)) CString Pattern;
		__declspec(property(get=GetIgnoreCase,put=PutIgnoreCase)) VARIANT_BOOL IgnoreCase;
		__declspec(property(get=GetGlobal,put=PutGlobal)) VARIANT_BOOL Global;
		__declspec(property(get=GetMultiline,put=PutMultiline)) VARIANT_BOOL Multiline;
		IMatchCollection* Execute (CString sourceString);
		IMatchCollection* Execute (_bstr_t sourceString) 
		{
			CString src;
			src.SetString((wchar_t*) sourceString); 
			return Execute (src);
		};
		CString GetPattern() { return m_pattern; }
		void PutPattern(CString val) { m_pattern.SetString(val); }
		VARIANT_BOOL GetIgnoreCase() { return m_ignorecase; }
		void PutIgnoreCase(VARIANT_BOOL val) { m_ignorecase=val; }
		VARIANT_BOOL GetGlobal() { return m_global; }
		void PutGlobal(VARIANT_BOOL val) { m_global=val; }
		VARIANT_BOOL GetMultiline() { return m_multiline; }
		void PutMultiline(VARIANT_BOOL val) { m_multiline=val; }
	private:
		CString m_pattern;
		VARIANT_BOOL m_ignorecase, m_global, m_multiline;
	};

	typedef IRegExp2*				RegExp;
	typedef IMatchCollection*		ReMatches;
	typedef IMatch2*				ReMatch;
	typedef ISubMatches*			ReSubMatches;
#else
	// visual basic RegExps
	typedef VBScript_RegExp_55::IRegExp2Ptr				RegExp;
	typedef VBScript_RegExp_55::IMatchCollection2Ptr	ReMatches;
	typedef VBScript_RegExp_55::IMatch2Ptr				ReMatch;
	typedef VBScript_RegExp_55::ISubMatchesPtr			ReSubMatches;
#endif

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
