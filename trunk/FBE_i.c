

/* this ALWAYS GENERATED file contains the IIDs and CLSIDs */

/* link this file in with the server and any clients */


 /* File created by MIDL compiler version 7.00.0500 */
/* at Wed Mar 24 00:16:42 2010
 */
/* Compiler settings for .\fbe.idl:
    Oicf, W1, Zp8, env=Win32 (32b run)
    protocol : dce , ms_ext, c_ext, robust
    error checks: allocation ref bounds_check enum stub_data 
    VC __declspec() decoration level: 
         __declspec(uuid()), __declspec(selectany), __declspec(novtable)
         DECLSPEC_UUID(), MIDL_INTERFACE()
*/
//@@MIDL_FILE_HEADING(  )

#pragma warning( disable: 4049 )  /* more than 64k source lines */


#ifdef __cplusplus
extern "C"{
#endif 


#include <rpc.h>
#include <rpcndr.h>

#ifdef _MIDL_USE_GUIDDEF_

#ifndef INITGUID
#define INITGUID
#include <guiddef.h>
#undef INITGUID
#else
#include <guiddef.h>
#endif

#define MIDL_DEFINE_GUID(type,name,l,w1,w2,b1,b2,b3,b4,b5,b6,b7,b8) \
        DEFINE_GUID(name,l,w1,w2,b1,b2,b3,b4,b5,b6,b7,b8)

#else // !_MIDL_USE_GUIDDEF_

#ifndef __IID_DEFINED__
#define __IID_DEFINED__

typedef struct _IID
{
    unsigned long x;
    unsigned short s1;
    unsigned short s2;
    unsigned char  c[8];
} IID;

#endif // __IID_DEFINED__

#ifndef CLSID_DEFINED
#define CLSID_DEFINED
typedef IID CLSID;
#endif // CLSID_DEFINED

#define MIDL_DEFINE_GUID(type,name,l,w1,w2,b1,b2,b3,b4,b5,b6,b7,b8) \
        const type name = {l,w1,w2,{b1,b2,b3,b4,b5,b6,b7,b8}}

#endif !_MIDL_USE_GUIDDEF_

MIDL_DEFINE_GUID(IID, LIBID_FBELib,0x37B16C7D,0x4400,0x4d7d,0xAA,0x35,0x14,0xC7,0x4E,0x26,0x5E,0xA4);


MIDL_DEFINE_GUID(IID, IID_IFBEImportPlugin,0x8094bc55,0x99c0,0x4adf,0xbd,0x55,0x71,0xe2,0x06,0xdf,0xd4,0x03);


MIDL_DEFINE_GUID(IID, IID_IFBEExportPlugin,0x1afaab7f,0x6f66,0x4ef6,0xb1,0x99,0x16,0xfa,0x49,0xcc,0x5b,0x52);


MIDL_DEFINE_GUID(IID, IID_IExternalHelper,0x7269066E,0x2089,0x4408,0xB3,0xF3,0xE8,0xD7,0x59,0x84,0xD5,0xA6);

#undef MIDL_DEFINE_GUID

#ifdef __cplusplus
}
#endif



