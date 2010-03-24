#include "stdafx.h"
#include "resource.h"

#include "utils.h"
#include "FBE.h"

#include "ExportHTML.h"

#include <initguid.h>

// {E242A6D3-84BF-4285-9FAA-160F95370668}
DEFINE_GUID(CLSID_ExportHTMLPlugin, 
0xe242a6d3, 0x84bf, 0x4285, 0x9f, 0xaa, 0x16, 0xf, 0x95, 0x37, 0x6, 0x68);

CComModule  _Module;
CRegKey	    _Settings;
CString	    _SettingsPath;

BEGIN_OBJECT_MAP(ObjectMap)
  OBJECT_ENTRY(CLSID_ExportHTMLPlugin, ExportHTMLPlugin)
END_OBJECT_MAP()

/////////////////////////////////////////////////////////////////////////////
// DLL Entry Point

extern "C"
BOOL WINAPI DllMain(HINSTANCE hInstance, DWORD dwReason, LPVOID /*lpReserved*/)
{
  if (dwReason == DLL_PROCESS_ATTACH)
  {
    _Module.Init(ObjectMap, hInstance);
    DisableThreadLibraryCalls(hInstance);
    U::InitSettings();
  }
  else if (dwReason == DLL_PROCESS_DETACH) {
    _Module.Term();
  }
  return TRUE;    // ok
}

/////////////////////////////////////////////////////////////////////////////
// Used to determine whether the DLL can be unloaded by OLE

STDAPI DllCanUnloadNow(void)
{
  return (_Module.GetLockCount()==0) ? S_OK : S_FALSE;
}

/////////////////////////////////////////////////////////////////////////////
// Returns a class factory to create an object of the requested type

STDAPI DllGetClassObject(REFCLSID rclsid, REFIID riid, LPVOID* ppv)
{
  return _Module.GetClassObject(rclsid, riid, ppv);
}

/////////////////////////////////////////////////////////////////////////////
// DllRegisterServer - Adds entries to the system registry

STDAPI DllRegisterServer(void)
{
  // registers object, typelib and all interfaces in typelib
  return _Module.RegisterServer();
}

/////////////////////////////////////////////////////////////////////////////
// DllUnregisterServer - Removes entries from the system registry

STDAPI DllUnregisterServer(void)
{
  return _Module.UnregisterServer();
}
