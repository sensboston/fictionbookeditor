// FBE.cpp : main source file for FBE.exe
//

#include "stdafx.h"
#include <locale.h>
#include <sys/stat.h>

#include "resource.h"

#include "utils.h"
#include "Settings.h"
#include "apputils.h"

#include "FBEView.h"
#include "FBDoc.h"
#include "TreeView.h"
#include "ContainerWnd.h"
#include "Scintilla.h"
#include "MainFrm.h"
#include "MemProtocol.h"

// typelib interfaces
#include "FBE.h"

// implementation
#include "ExternalHelper.h"

// typelib guids
#include "fbe_i.c"

#define	DEFINE_CLSID(name, l, w1, w2, b1, b2, b3, b4, b5, b6, b7, b8) \
		EXTERN_C const CLSID DECLSPEC_SELECTANY name \
		= { l, w1, w2, { b1, b2,  b3,  b4,  b5,  b6,  b7,  b8 } }

// {7301FF90-9029-4819-B778-19D9999DB419}
DEFINE_CLSID(CLSID_MemProtocol, 0x7301ff90, 0x9029, 0x4819, 0xb7, 0x78, 0x19, 0xd9, 0x99, 0x9d, 0xb4, 0x19);

CAppModule _Module;
extern CElementDescMnr _EDMnr;

BEGIN_OBJECT_MAP(ObjectMap)
	OBJECT_ENTRY(CLSID_MemProtocol, CMemProtocol)
END_OBJECT_MAP()

CSettings _Settings;
CSimpleArray<CString> _ARGV;

// External helpers
IDispatchPtr  CFBEView::CreateHelper()
{
	CComObject<ExternalHelper> *obj;
	if(FAILED(CComObject<ExternalHelper>::CreateInstance(&obj)))
		obj = NULL;
	return obj;
}

// Command line parser
static void ParseCommandLine(LPTSTR cmd, CSimpleArray<CString>& args)
{
	TCHAR* p=cmd;
	int len= _tcslen(p);
	TCHAR* e = p + len;

	for (;;)
	{
		// Skip ws
		while(p < e && (unsigned)*p <= 32)
			++p;
		if(p >= e)
			break;

		// Process argument
		CString arg;
		TCHAR* buf = arg.GetBuffer(e - p);
		TCHAR* q = buf;
		bool fQuote = false;
		while(p < e)
		{
			if(fQuote)
			{
				if(*p == L'"')
				{
					// Possible end of arg
					if(p + 1 < e && p[1] == L'"')
					{
						// Literal quote
						*q++ = L'"';
						++p;
					}
					else
						fQuote = false;
					}
				else
					*q++ = *p; // normal char
			}
			else
			{
				if(*p <= 32) // end of arg
					break;
				if(*p == L'"') // quoted part
					fQuote = true;
				else // normal text
				*q++ = *p;
			}
			++p;
		}
		arg.ReleaseBuffer(q - buf);
		args.Add(arg);
	}
}

HINSTANCE resLib;

int Run(LPTSTR /*lpstrCmdLine*/ = NULL, int nCmdShow = SW_SHOWDEFAULT)
{
	CMessageLoop theLoop;
	_Module.AddMessageLoop(&theLoop);
	CMainFrame wndMain;

	resLib = ::LoadLibrary(_Settings.GetInterfaceLanguageDllName());
	if(resLib)
	ATL::_AtlBaseModule.SetResourceInstance(resLib);
	else
	ATL::_AtlBaseModule.SetResourceInstance(ATL::_AtlBaseModule.GetModuleInstance());

	HookSysDialogs();

	U::InitKeycodes();
	U::InitSettingsHotkeyGroups();

	if(wndMain.CreateEx() == NULL)
	{
		ATLTRACE(L"Main window creation failed!\n");
		return 0;
	}

	WINDOWPLACEMENT wpl;
	if(_Settings.GetWindowPosition(wpl))
		wndMain.SetWindowPlacement(&wpl);
	else
	{
		wndMain.ShowWindow(nCmdShow);
		wndMain.GetWindowPlacement(&wpl);
		_Settings.SetWindowPosition(wpl);
	}

	int nRet = theLoop.Run();

	_Module.RemoveMessageLoop();

	// exit CBT hook
	UnhookSysDialogs();

	return nRet;
}

bool LoadEditor()
{
	HINSTANCE hLib = ::LoadLibrary(L"SciLexer.dll");
	if(hLib == NULL)
		return false;
	#if 0
		bool (*scireg)(void *hinst) = (bool (*)(void*)) ::GetProcAddress(hLib,"Scintilla_RegisterClasses");
		if(scireg == NULL || !scireg(_Module.GetModuleInstance()))
		{
			::FreeLibrary(hLib);
			return false;
		}
	#endif
		return true;
}

int WINAPI _tWinMain(HINSTANCE hInstance, HINSTANCE /*hPrevInstance*/, LPTSTR lpstrCmdLine, int nCmdShow)
{
	int nRet=1;

#if 1
#ifdef _DEBUG
  _CrtSetReportMode( _CRT_ASSERT, _CRTDBG_MODE_FILE );
  _CrtSetReportFile( _CRT_ASSERT, _CRTDBG_FILE_STDERR );
  _CrtSetReportMode( _CRT_WARN, _CRTDBG_MODE_FILE );
  _CrtSetReportFile( _CRT_WARN, _CRTDBG_FILE_STDERR );
  _CrtSetReportMode( _CRT_ERROR, _CRTDBG_MODE_FILE );
  _CrtSetReportFile( _CRT_ERROR, _CRTDBG_FILE_STDERR );
#endif
#endif

  // initialize RNG
  srand((unsigned int)time(NULL));

  // switch to user's locale
  setlocale(LC_CTYPE,"");
  setlocale(LC_COLLATE,"");

  // initialize COM/OLE
  HRESULT hRes = ::OleInitialize(NULL);
  ATLASSERT(SUCCEEDED(hRes));
  
  // this resolves ATL window thunking problem when Microsoft Layer for Unicode (MSLU) is used
  ::DefWindowProc(NULL, 0, 0, 0L);

  AtlInitCommonControls(ICC_COOL_CLASSES | ICC_BAR_CLASSES);	// add flags to support other controls

  // init module
  hRes = _Module.Init(ObjectMap, hInstance, &LIBID_FBELib);
  ATLASSERT(SUCCEEDED(hRes));

  // register typelib
  hRes = _Module.RegisterTypeLib();
  ATLASSERT(SUCCEEDED(hRes));

  // enable web browser hosting
  AtlAxWinInit();

  // initialize registry settings
  U::InitSettings();

  // parse command line
  ParseCommandLine(lpstrCmdLine,_ARGV);
  if (!AU::ParseCmdLineArgs())
    goto out;
  
  // load xml source editor
  if (!LoadEditor()) 
  {
	  wchar_t msg[MAX_LOAD_STRING + 1];
	  wchar_t cpt[MAX_LOAD_STRING + 1];
	  ::LoadString(_Module.GetResourceInstance(), IDS_SCINTILLA_LOAD_ERR_MSG, msg, MAX_LOAD_STRING);
	  ::LoadString(_Module.GetResourceInstance(), IDS_ERRMSGBOX_CAPTION, cpt, MAX_LOAD_STRING);      
    ::MessageBox(NULL, msg, cpt,MB_OK|MB_ICONERROR);
    goto out;
  }

  // register our protocol handler
  IInternetSession *isess;
  if (SUCCEEDED(::CoInternetGetSession(0, &isess, 0))) {
    IClassFactory *cf;
    if (SUCCEEDED(_Module.GetClassObject(CLSID_MemProtocol, IID_IClassFactory, (void**)&cf))) {
      HRESULT hr=isess->RegisterNameSpace(cf,CLSID_MemProtocol,L"fbw-internal",0,NULL,0);
      if (FAILED(hr))
	      ATLTRACE("Failed to register protocol handler: %x\n",hr);
      cf->Release();
    }
    isess->Release();
  }

  // run the main loop
  nRet = Run(lpstrCmdLine, nCmdShow);
out:
  _Module.Term();

  ::OleUninitialize();
  
  return nRet;
}
