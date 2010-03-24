// stdafx.h : include file for standard system include files,
//  or project specific include files that are used frequently, but
//      are changed infrequently
//

#if !defined(AFX_STDAFX_H__AA787312_D02C_4332_A4DD_1B1AA8B9E8BF__INCLUDED_)
#define AFX_STDAFX_H__AA787312_D02C_4332_A4DD_1B1AA8B9E8BF__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

// check for unicode
#ifndef UNICODE
#error This program requires unicode support to run
#endif

// Change these values to use different versions
#define WINVER		0x0501
#define _WIN32_WINNT	0x0501
#define _WIN32_IE	0x0501

// Insert your headers here
#define WIN32_LEAN_AND_MEAN		// Exclude rarely-used stuff from Windows headers

#define _ATL_APARTMENT_THREADED

#define _ATL_CSTRING_EXPLICIT_CONSTRUCTORS	// some CString constructors will be explicit

// turns off ATL's hiding of some common and often safely ignored warning messages
#define _ATL_ALL_WARNINGS

#include <atlbase.h>
#include <atlcom.h>
#include <atlwin.h>
#include <atltypes.h>
#include <atlctl.h>
#include <atlhost.h>
#include <atlstr.h>

extern CComModule _Module;

#include <atlapp.h>
#include <atldlgs.h>
#include <atlddx.h>

extern CRegKey	  _Settings;
extern CString    _SettingsPath;

#include <comutil.h>
#include <comdef.h>

// control IDs
#include <dlgs.h>

#import <msxml4.dll>

// C library
#include <time.h>

// mshtml additional includes
#include <exdispid.h>
#include <mshtmdid.h>
#include <mshtmcid.h>
#import <shdocvw.dll> rename_namespace("SHD")
#import <mshtml.tlb>

// use com utils
using namespace _com_util;

//{{AFX_INSERT_LOCATION}}
// Microsoft Visual C++ will insert additional declarations immediately before the previous line.

#endif // !defined(AFX_STDAFX_H__AA787312_D02C_4332_A4DD_1B1AA8B9E8BF__INCLUDED_)
