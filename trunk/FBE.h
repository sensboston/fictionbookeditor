

/* this ALWAYS GENERATED file contains the definitions for the interfaces */


 /* File created by MIDL compiler version 7.00.0500 */
/* at Tue Mar 23 22:39:10 2010
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


/* verify that the <rpcndr.h> version is high enough to compile this file*/
#ifndef __REQUIRED_RPCNDR_H_VERSION__
#define __REQUIRED_RPCNDR_H_VERSION__ 475
#endif

#include "rpc.h"
#include "rpcndr.h"

#ifndef __RPCNDR_H_VERSION__
#error this stub requires an updated version of <rpcndr.h>
#endif // __RPCNDR_H_VERSION__


#ifndef __FBE_h__
#define __FBE_h__

#if defined(_MSC_VER) && (_MSC_VER >= 1020)
#pragma once
#endif

/* Forward Declarations */ 

#ifndef __IFBEImportPlugin_FWD_DEFINED__
#define __IFBEImportPlugin_FWD_DEFINED__
typedef interface IFBEImportPlugin IFBEImportPlugin;
#endif 	/* __IFBEImportPlugin_FWD_DEFINED__ */


#ifndef __IFBEExportPlugin_FWD_DEFINED__
#define __IFBEExportPlugin_FWD_DEFINED__
typedef interface IFBEExportPlugin IFBEExportPlugin;
#endif 	/* __IFBEExportPlugin_FWD_DEFINED__ */


#ifndef __IExternalHelper_FWD_DEFINED__
#define __IExternalHelper_FWD_DEFINED__
typedef interface IExternalHelper IExternalHelper;
#endif 	/* __IExternalHelper_FWD_DEFINED__ */


/* header files for imported files */
#include "oaidl.h"
#include "ocidl.h"

#ifdef __cplusplus
extern "C"{
#endif 



#ifndef __FBELib_LIBRARY_DEFINED__
#define __FBELib_LIBRARY_DEFINED__

/* library FBELib */
/* [helpstring][version][uuid] */ 


DEFINE_GUID(LIBID_FBELib,0x37B16C7D,0x4400,0x4d7d,0xAA,0x35,0x14,0xC7,0x4E,0x26,0x5E,0xA4);

#ifndef __IFBEImportPlugin_INTERFACE_DEFINED__
#define __IFBEImportPlugin_INTERFACE_DEFINED__

/* interface IFBEImportPlugin */
/* [unique][helpstring][uuid][object] */ 


DEFINE_GUID(IID_IFBEImportPlugin,0x8094bc55,0x99c0,0x4adf,0xbd,0x55,0x71,0xe2,0x06,0xdf,0xd4,0x03);

#if defined(__cplusplus) && !defined(CINTERFACE)
    
    MIDL_INTERFACE("8094bc55-99c0-4adf-bd55-71e206dfd403")
    IFBEImportPlugin : public IUnknown
    {
    public:
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE Import( 
            /* [in] */ long hWnd,
            /* [out] */ BSTR *filename,
            /* [out] */ IDispatch **document) = 0;
        
    };
    
#else 	/* C style interface */

    typedef struct IFBEImportPluginVtbl
    {
        BEGIN_INTERFACE
        
        HRESULT ( STDMETHODCALLTYPE *QueryInterface )( 
            IFBEImportPlugin * This,
            /* [in] */ REFIID riid,
            /* [iid_is][out] */ 
            __RPC__deref_out  void **ppvObject);
        
        ULONG ( STDMETHODCALLTYPE *AddRef )( 
            IFBEImportPlugin * This);
        
        ULONG ( STDMETHODCALLTYPE *Release )( 
            IFBEImportPlugin * This);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *Import )( 
            IFBEImportPlugin * This,
            /* [in] */ long hWnd,
            /* [out] */ BSTR *filename,
            /* [out] */ IDispatch **document);
        
        END_INTERFACE
    } IFBEImportPluginVtbl;

    interface IFBEImportPlugin
    {
        CONST_VTBL struct IFBEImportPluginVtbl *lpVtbl;
    };

    

#ifdef COBJMACROS


#define IFBEImportPlugin_QueryInterface(This,riid,ppvObject)	\
    ( (This)->lpVtbl -> QueryInterface(This,riid,ppvObject) ) 

#define IFBEImportPlugin_AddRef(This)	\
    ( (This)->lpVtbl -> AddRef(This) ) 

#define IFBEImportPlugin_Release(This)	\
    ( (This)->lpVtbl -> Release(This) ) 


#define IFBEImportPlugin_Import(This,hWnd,filename,document)	\
    ( (This)->lpVtbl -> Import(This,hWnd,filename,document) ) 

#endif /* COBJMACROS */


#endif 	/* C style interface */




#endif 	/* __IFBEImportPlugin_INTERFACE_DEFINED__ */


#ifndef __IFBEExportPlugin_INTERFACE_DEFINED__
#define __IFBEExportPlugin_INTERFACE_DEFINED__

/* interface IFBEExportPlugin */
/* [unique][helpstring][uuid][object] */ 


DEFINE_GUID(IID_IFBEExportPlugin,0x1afaab7f,0x6f66,0x4ef6,0xb1,0x99,0x16,0xfa,0x49,0xcc,0x5b,0x52);

#if defined(__cplusplus) && !defined(CINTERFACE)
    
    MIDL_INTERFACE("1afaab7f-6f66-4ef6-b199-16fa49cc5b52")
    IFBEExportPlugin : public IUnknown
    {
    public:
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE Export( 
            /* [in] */ long hWnd,
            /* [in] */ BSTR filename,
            /* [in] */ IDispatch *document) = 0;
        
    };
    
#else 	/* C style interface */

    typedef struct IFBEExportPluginVtbl
    {
        BEGIN_INTERFACE
        
        HRESULT ( STDMETHODCALLTYPE *QueryInterface )( 
            IFBEExportPlugin * This,
            /* [in] */ REFIID riid,
            /* [iid_is][out] */ 
            __RPC__deref_out  void **ppvObject);
        
        ULONG ( STDMETHODCALLTYPE *AddRef )( 
            IFBEExportPlugin * This);
        
        ULONG ( STDMETHODCALLTYPE *Release )( 
            IFBEExportPlugin * This);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *Export )( 
            IFBEExportPlugin * This,
            /* [in] */ long hWnd,
            /* [in] */ BSTR filename,
            /* [in] */ IDispatch *document);
        
        END_INTERFACE
    } IFBEExportPluginVtbl;

    interface IFBEExportPlugin
    {
        CONST_VTBL struct IFBEExportPluginVtbl *lpVtbl;
    };

    

#ifdef COBJMACROS


#define IFBEExportPlugin_QueryInterface(This,riid,ppvObject)	\
    ( (This)->lpVtbl -> QueryInterface(This,riid,ppvObject) ) 

#define IFBEExportPlugin_AddRef(This)	\
    ( (This)->lpVtbl -> AddRef(This) ) 

#define IFBEExportPlugin_Release(This)	\
    ( (This)->lpVtbl -> Release(This) ) 


#define IFBEExportPlugin_Export(This,hWnd,filename,document)	\
    ( (This)->lpVtbl -> Export(This,hWnd,filename,document) ) 

#endif /* COBJMACROS */


#endif 	/* C style interface */




#endif 	/* __IFBEExportPlugin_INTERFACE_DEFINED__ */


#ifndef __IExternalHelper_INTERFACE_DEFINED__
#define __IExternalHelper_INTERFACE_DEFINED__

/* interface IExternalHelper */
/* [unique][helpstring][dual][uuid][object] */ 


DEFINE_GUID(IID_IExternalHelper,0x7269066E,0x2089,0x4408,0xB3,0xF3,0xE8,0xD7,0x59,0x84,0xD5,0xA6);

#if defined(__cplusplus) && !defined(CINTERFACE)
    
    MIDL_INTERFACE("7269066E-2089-4408-B3F3-E8D75984D5A6")
    IExternalHelper : public IDispatch
    {
    public:
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE BeginUndoUnit( 
            /* [in] */ IDispatch *document,
            /* [in] */ BSTR action) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE EndUndoUnit( 
            /* [in] */ IDispatch *document) = 0;
        
        virtual /* [helpstring][id][propget] */ HRESULT STDMETHODCALLTYPE get_inflateBlock( 
            /* [in] */ IDispatch *elem,
            /* [retval][out] */ BOOL *pVal) = 0;
        
        virtual /* [helpstring][id][propput] */ HRESULT STDMETHODCALLTYPE put_inflateBlock( 
            /* [in] */ IDispatch *elem,
            /* [in] */ BOOL newVal) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE GenrePopup( 
            /* [in] */ IDispatch *elem,
            /* [in] */ LONG x,
            /* [in] */ LONG y,
            /* [retval][out] */ BSTR *name) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE GetStylePath( 
            /* [retval][out] */ BSTR *name) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE GetBinarySize( 
            /* [in] */ BSTR data,
            /* [retval][out] */ int *length) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE InflateParagraphs( 
            /* [in] */ IDispatch *data) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE GetUUID( 
            /* [retval][out] */ BSTR *name) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE MsgBox( 
            /* [in] */ BSTR message) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE AskYesNo( 
            /* [in] */ BSTR message,
            /* [retval][out] */ BOOL *pVal) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE SaveBinary( 
            /* [in] */ BSTR path,
            /* [in] */ BSTR data,
            /* [retval][out] */ BOOL *pVal) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE GetExtendedStyle( 
            /* [in] */ BSTR elem,
            /* [retval][out] */ BOOL *ext) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE DescShowElement( 
            /* [in] */ BSTR elem,
            /* [in] */ BOOL show) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE DescShowMenu( 
            /* [in] */ IDispatch *btn,
            /* [in] */ LONG x,
            /* [in] */ LONG y,
            /* [retval][out] */ BSTR *element_id) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE IsFastMode( 
            /* [retval][out] */ BOOL *ext) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE SetStyleEx( 
            /* [in] */ IDispatch *doc,
            /* [in] */ IDispatch *elem,
            /* [in] */ BSTR style) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE GetImageDimsByPath( 
            /* [in] */ BSTR path,
            /* [retval][out] */ BSTR *dims) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE GetImageDimsByData( 
            /* [in] */ VARIANT *data,
            /* [retval][out] */ BSTR *dims) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE GetNBSP( 
            /* [retval][out] */ BSTR *name) = 0;
        
    };
    
#else 	/* C style interface */

    typedef struct IExternalHelperVtbl
    {
        BEGIN_INTERFACE
        
        HRESULT ( STDMETHODCALLTYPE *QueryInterface )( 
            IExternalHelper * This,
            /* [in] */ REFIID riid,
            /* [iid_is][out] */ 
            __RPC__deref_out  void **ppvObject);
        
        ULONG ( STDMETHODCALLTYPE *AddRef )( 
            IExternalHelper * This);
        
        ULONG ( STDMETHODCALLTYPE *Release )( 
            IExternalHelper * This);
        
        HRESULT ( STDMETHODCALLTYPE *GetTypeInfoCount )( 
            IExternalHelper * This,
            /* [out] */ UINT *pctinfo);
        
        HRESULT ( STDMETHODCALLTYPE *GetTypeInfo )( 
            IExternalHelper * This,
            /* [in] */ UINT iTInfo,
            /* [in] */ LCID lcid,
            /* [out] */ ITypeInfo **ppTInfo);
        
        HRESULT ( STDMETHODCALLTYPE *GetIDsOfNames )( 
            IExternalHelper * This,
            /* [in] */ REFIID riid,
            /* [size_is][in] */ LPOLESTR *rgszNames,
            /* [range][in] */ UINT cNames,
            /* [in] */ LCID lcid,
            /* [size_is][out] */ DISPID *rgDispId);
        
        /* [local] */ HRESULT ( STDMETHODCALLTYPE *Invoke )( 
            IExternalHelper * This,
            /* [in] */ DISPID dispIdMember,
            /* [in] */ REFIID riid,
            /* [in] */ LCID lcid,
            /* [in] */ WORD wFlags,
            /* [out][in] */ DISPPARAMS *pDispParams,
            /* [out] */ VARIANT *pVarResult,
            /* [out] */ EXCEPINFO *pExcepInfo,
            /* [out] */ UINT *puArgErr);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *BeginUndoUnit )( 
            IExternalHelper * This,
            /* [in] */ IDispatch *document,
            /* [in] */ BSTR action);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *EndUndoUnit )( 
            IExternalHelper * This,
            /* [in] */ IDispatch *document);
        
        /* [helpstring][id][propget] */ HRESULT ( STDMETHODCALLTYPE *get_inflateBlock )( 
            IExternalHelper * This,
            /* [in] */ IDispatch *elem,
            /* [retval][out] */ BOOL *pVal);
        
        /* [helpstring][id][propput] */ HRESULT ( STDMETHODCALLTYPE *put_inflateBlock )( 
            IExternalHelper * This,
            /* [in] */ IDispatch *elem,
            /* [in] */ BOOL newVal);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *GenrePopup )( 
            IExternalHelper * This,
            /* [in] */ IDispatch *elem,
            /* [in] */ LONG x,
            /* [in] */ LONG y,
            /* [retval][out] */ BSTR *name);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *GetStylePath )( 
            IExternalHelper * This,
            /* [retval][out] */ BSTR *name);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *GetBinarySize )( 
            IExternalHelper * This,
            /* [in] */ BSTR data,
            /* [retval][out] */ int *length);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *InflateParagraphs )( 
            IExternalHelper * This,
            /* [in] */ IDispatch *data);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *GetUUID )( 
            IExternalHelper * This,
            /* [retval][out] */ BSTR *name);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *MsgBox )( 
            IExternalHelper * This,
            /* [in] */ BSTR message);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *AskYesNo )( 
            IExternalHelper * This,
            /* [in] */ BSTR message,
            /* [retval][out] */ BOOL *pVal);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *SaveBinary )( 
            IExternalHelper * This,
            /* [in] */ BSTR path,
            /* [in] */ BSTR data,
            /* [retval][out] */ BOOL *pVal);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *GetExtendedStyle )( 
            IExternalHelper * This,
            /* [in] */ BSTR elem,
            /* [retval][out] */ BOOL *ext);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *DescShowElement )( 
            IExternalHelper * This,
            /* [in] */ BSTR elem,
            /* [in] */ BOOL show);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *DescShowMenu )( 
            IExternalHelper * This,
            /* [in] */ IDispatch *btn,
            /* [in] */ LONG x,
            /* [in] */ LONG y,
            /* [retval][out] */ BSTR *element_id);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *IsFastMode )( 
            IExternalHelper * This,
            /* [retval][out] */ BOOL *ext);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *SetStyleEx )( 
            IExternalHelper * This,
            /* [in] */ IDispatch *doc,
            /* [in] */ IDispatch *elem,
            /* [in] */ BSTR style);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *GetImageDimsByPath )( 
            IExternalHelper * This,
            /* [in] */ BSTR path,
            /* [retval][out] */ BSTR *dims);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *GetImageDimsByData )( 
            IExternalHelper * This,
            /* [in] */ VARIANT *data,
            /* [retval][out] */ BSTR *dims);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *GetNBSP )( 
            IExternalHelper * This,
            /* [retval][out] */ BSTR *name);
        
        END_INTERFACE
    } IExternalHelperVtbl;

    interface IExternalHelper
    {
        CONST_VTBL struct IExternalHelperVtbl *lpVtbl;
    };

    

#ifdef COBJMACROS


#define IExternalHelper_QueryInterface(This,riid,ppvObject)	\
    ( (This)->lpVtbl -> QueryInterface(This,riid,ppvObject) ) 

#define IExternalHelper_AddRef(This)	\
    ( (This)->lpVtbl -> AddRef(This) ) 

#define IExternalHelper_Release(This)	\
    ( (This)->lpVtbl -> Release(This) ) 


#define IExternalHelper_GetTypeInfoCount(This,pctinfo)	\
    ( (This)->lpVtbl -> GetTypeInfoCount(This,pctinfo) ) 

#define IExternalHelper_GetTypeInfo(This,iTInfo,lcid,ppTInfo)	\
    ( (This)->lpVtbl -> GetTypeInfo(This,iTInfo,lcid,ppTInfo) ) 

#define IExternalHelper_GetIDsOfNames(This,riid,rgszNames,cNames,lcid,rgDispId)	\
    ( (This)->lpVtbl -> GetIDsOfNames(This,riid,rgszNames,cNames,lcid,rgDispId) ) 

#define IExternalHelper_Invoke(This,dispIdMember,riid,lcid,wFlags,pDispParams,pVarResult,pExcepInfo,puArgErr)	\
    ( (This)->lpVtbl -> Invoke(This,dispIdMember,riid,lcid,wFlags,pDispParams,pVarResult,pExcepInfo,puArgErr) ) 


#define IExternalHelper_BeginUndoUnit(This,document,action)	\
    ( (This)->lpVtbl -> BeginUndoUnit(This,document,action) ) 

#define IExternalHelper_EndUndoUnit(This,document)	\
    ( (This)->lpVtbl -> EndUndoUnit(This,document) ) 

#define IExternalHelper_get_inflateBlock(This,elem,pVal)	\
    ( (This)->lpVtbl -> get_inflateBlock(This,elem,pVal) ) 

#define IExternalHelper_put_inflateBlock(This,elem,newVal)	\
    ( (This)->lpVtbl -> put_inflateBlock(This,elem,newVal) ) 

#define IExternalHelper_GenrePopup(This,elem,x,y,name)	\
    ( (This)->lpVtbl -> GenrePopup(This,elem,x,y,name) ) 

#define IExternalHelper_GetStylePath(This,name)	\
    ( (This)->lpVtbl -> GetStylePath(This,name) ) 

#define IExternalHelper_GetBinarySize(This,data,length)	\
    ( (This)->lpVtbl -> GetBinarySize(This,data,length) ) 

#define IExternalHelper_InflateParagraphs(This,data)	\
    ( (This)->lpVtbl -> InflateParagraphs(This,data) ) 

#define IExternalHelper_GetUUID(This,name)	\
    ( (This)->lpVtbl -> GetUUID(This,name) ) 

#define IExternalHelper_MsgBox(This,message)	\
    ( (This)->lpVtbl -> MsgBox(This,message) ) 

#define IExternalHelper_AskYesNo(This,message,pVal)	\
    ( (This)->lpVtbl -> AskYesNo(This,message,pVal) ) 

#define IExternalHelper_SaveBinary(This,path,data,pVal)	\
    ( (This)->lpVtbl -> SaveBinary(This,path,data,pVal) ) 

#define IExternalHelper_GetExtendedStyle(This,elem,ext)	\
    ( (This)->lpVtbl -> GetExtendedStyle(This,elem,ext) ) 

#define IExternalHelper_DescShowElement(This,elem,show)	\
    ( (This)->lpVtbl -> DescShowElement(This,elem,show) ) 

#define IExternalHelper_DescShowMenu(This,btn,x,y,element_id)	\
    ( (This)->lpVtbl -> DescShowMenu(This,btn,x,y,element_id) ) 

#define IExternalHelper_IsFastMode(This,ext)	\
    ( (This)->lpVtbl -> IsFastMode(This,ext) ) 

#define IExternalHelper_SetStyleEx(This,doc,elem,style)	\
    ( (This)->lpVtbl -> SetStyleEx(This,doc,elem,style) ) 

#define IExternalHelper_GetImageDimsByPath(This,path,dims)	\
    ( (This)->lpVtbl -> GetImageDimsByPath(This,path,dims) ) 

#define IExternalHelper_GetImageDimsByData(This,data,dims)	\
    ( (This)->lpVtbl -> GetImageDimsByData(This,data,dims) ) 

#define IExternalHelper_GetNBSP(This,name)	\
    ( (This)->lpVtbl -> GetNBSP(This,name) ) 

#endif /* COBJMACROS */


#endif 	/* C style interface */




#endif 	/* __IExternalHelper_INTERFACE_DEFINED__ */

#endif /* __FBELib_LIBRARY_DEFINED__ */

/* Additional Prototypes for ALL interfaces */

/* end of Additional Prototypes */

#ifdef __cplusplus
}
#endif

#endif


