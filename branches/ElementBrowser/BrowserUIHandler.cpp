#include "stdafx.h"

#include "BrowserUIHandler.h"

#include "resource.h"
#include "res1.h"

#include "utils.h"
#include "apputils.h"

#include "FBEView.h"


/* IDocHostUIHandler interface to control IWebBrowser behaviour */
///==================================================================================================================

TDocHostUIHandler::TDocHostUIHandler()
:   refcount(1),
    m_view(NULL)
{
}

TDocHostUIHandler::~TDocHostUIHandler()
{
}

bool TDocHostUIHandler::AttachToBrowser(CFBEView* view)
{
    ICustomDoc* CustomDoc;

    if(!view || m_view)
        return false;

    view->Browser()->Document->QueryInterface(&CustomDoc);
    if(CustomDoc)
    {
        // there seems to be a bug in mshtml which makes it call AddRef() on the
        // passed pointer but never Release()
        CustomDoc->SetUIHandler(this);
        CustomDoc->Release();
        m_view = view;
        return true;
    }

    return false;
}

HRESULT STDMETHODCALLTYPE TDocHostUIHandler::QueryInterface(REFIID classid, void** intf)
{
    if(classid == IID_IUnknown || classid == IID_IDocHostUIHandler) {
        *intf = this;
        AddRef();
	} else if (classid == IID_IOleCommandTarget) {
        *intf = new TOleCommandTarget();
    } else
        return E_NOINTERFACE;

    return S_OK;
}

ULONG STDMETHODCALLTYPE TDocHostUIHandler::AddRef()
{
    InterlockedIncrement(&refcount);
    return refcount;
}

ULONG STDMETHODCALLTYPE TDocHostUIHandler::Release()
{
    InterlockedDecrement(&refcount);
    if(refcount == 0) {
        delete this;
        return 0;
    }
    return refcount;
}

HRESULT STDMETHODCALLTYPE TDocHostUIHandler::ShowContextMenu(
    /* [in] */ DWORD dwID,
    /* [in] */ POINT __RPC_FAR *ppt,
    /* [in] */ IUnknown __RPC_FAR *pcmdtReserved,
    /* [in] */ IDispatch __RPC_FAR *pdispReserved)
{
    return S_FALSE;
}

HRESULT STDMETHODCALLTYPE TDocHostUIHandler::GetHostInfo(
    /* [out][in] */ DOCHOSTUIINFO __RPC_FAR *pInfo)
{
	return S_FALSE;
}

HRESULT STDMETHODCALLTYPE TDocHostUIHandler::ShowUI(
    /* [in] */ DWORD dwID,
    /* [in] */ IOleInPlaceActiveObject __RPC_FAR *pActiveObject,
    /* [in] */ IOleCommandTarget __RPC_FAR *pCommandTarget,
    /* [in] */ IOleInPlaceFrame __RPC_FAR *pFrame,
    /* [in] */ IOleInPlaceUIWindow __RPC_FAR *pDoc)
{
    return S_FALSE;
}

HRESULT STDMETHODCALLTYPE TDocHostUIHandler::HideUI(void)
{
    return S_FALSE;
}

HRESULT STDMETHODCALLTYPE TDocHostUIHandler::UpdateUI(void)
{
    return S_FALSE;
}

HRESULT STDMETHODCALLTYPE TDocHostUIHandler::EnableModeless(
    /* [in] */ BOOL fEnable)
{
    return S_FALSE;
}

HRESULT STDMETHODCALLTYPE TDocHostUIHandler::OnDocWindowActivate(
    /* [in] */ BOOL fActivate)
{
    return S_FALSE;
}

HRESULT STDMETHODCALLTYPE TDocHostUIHandler::OnFrameWindowActivate(
    /* [in] */ BOOL fActivate)
{
    return S_FALSE;
}

HRESULT STDMETHODCALLTYPE TDocHostUIHandler::ResizeBorder(
    /* [in] */ LPCRECT prcBorder,
    /* [in] */ IOleInPlaceUIWindow __RPC_FAR *pUIWindow,
    /* [in] */ BOOL fRameWindow)
{
    return S_FALSE;
}

HRESULT STDMETHODCALLTYPE TDocHostUIHandler::TranslateAccelerator(
    /* [in] */ LPMSG lpMsg,
    /* [in] */ const GUID __RPC_FAR *pguidCmdGroup,
    /* [in] */ DWORD nCmdID)
{
	return S_FALSE;
}

HRESULT STDMETHODCALLTYPE TDocHostUIHandler::GetOptionKeyPath(
    /* [out] */ LPOLESTR __RPC_FAR *pchKey,
    /* [in] */ DWORD dw)
{
    return S_FALSE;
}

HRESULT STDMETHODCALLTYPE TDocHostUIHandler::GetDropTarget(
    /* [in] */ IDropTarget __RPC_FAR *pDropTarget,
    /* [out] */ IDropTarget __RPC_FAR *__RPC_FAR *ppDropTarget)
{
    return S_FALSE;
}

HRESULT STDMETHODCALLTYPE TDocHostUIHandler::GetExternal(
    /* [out] */ IDispatch __RPC_FAR *__RPC_FAR *ppDispatch)
{
	if(ppDispatch == NULL)
        return E_INVALIDARG;

    *ppDispatch = new TExternalDispatch(m_view);

    return S_OK;
}

HRESULT STDMETHODCALLTYPE TDocHostUIHandler::TranslateUrl(
    /* [in] */ DWORD dwTranslate,
    /* [in] */ OLECHAR __RPC_FAR *pchURLIn,
    /* [out] */ OLECHAR __RPC_FAR *__RPC_FAR *ppchURLOut)
{
    return S_FALSE;
}

HRESULT STDMETHODCALLTYPE TDocHostUIHandler::FilterDataObject(
    /* [in] */ IDataObject __RPC_FAR *pDO,
    /* [out] */ IDataObject __RPC_FAR *__RPC_FAR *ppDORet)
{
    return S_FALSE;
}

// IOleCommandTarget
//============================================================================================

TOleCommandTarget::TOleCommandTarget()
:   refcount(1)
{

}

TOleCommandTarget::~TOleCommandTarget()
{

}

HRESULT STDMETHODCALLTYPE TOleCommandTarget::QueryInterface(REFIID classid, void** intf)
{
    if(classid == IID_IUnknown || classid == IID_IOleCommandTarget) {
        *intf = this;
        AddRef();
    } else
        return E_NOINTERFACE;

    return S_OK;
}

ULONG STDMETHODCALLTYPE TOleCommandTarget::AddRef()
{
    InterlockedIncrement(&refcount);
    return refcount;
}

ULONG STDMETHODCALLTYPE TOleCommandTarget::Release()
{
    InterlockedDecrement(&refcount);
    if(refcount == 0) {
        delete this;
        return 0;
    }
    return refcount;
}

HRESULT STDMETHODCALLTYPE TOleCommandTarget::QueryStatus(
		/*[in]*/ const GUID *pguidCmdGroup,
		/*[in]*/ ULONG cCmds,
		/*[in,out][size_is(cCmds)]*/ OLECMD *prgCmds,
		/*[in,out]*/ OLECMDTEXT *pCmdText)
{
    return E_NOTIMPL;
}

HRESULT STDMETHODCALLTYPE TOleCommandTarget::Exec(
		/*[in]*/ const GUID *pguidCmdGroup,
		/*[in]*/ DWORD nCmdID,
		/*[in]*/ DWORD nCmdExecOpt,
		/*[in]*/ VARIANTARG *pvaIn,
		/*[in,out]*/ VARIANTARG *pvaOut)
{
    if (nCmdID == ::OLECMDID_SHOWSCRIPTERROR)
    {
        // don't show error dialog but continue to run scripts
        (*pvaOut).vt = VT_BOOL;
        (*pvaOut).boolVal = VARIANT_TRUE;
        return S_OK;
    }

    return OLECMDERR_E_NOTSUPPORTED;
}

//===============================================================================================
//structs

static PARAMDATA rgpBeginUndoUnit[] =
{
	{ OLESTR("document"), VT_DISPATCH},
	{ OLESTR("name"), VT_BSTR}
};
static PARAMDATA rgpEndUndoUnit[] =
{
    { OLESTR("document"), VT_DISPATCH}
};
static PARAMDATA rgpSaveBinary[] =
{
    { OLESTR("path"), VT_BSTR },
	{ OLESTR("data"), VT_DISPATCH}
};
static PARAMDATA rgpGetBinarySize[] =
{
    { OLESTR("data"), VT_BSTR}
};
static PARAMDATA rgpInflateParagraphs[] =
{
	{ OLESTR("body"), VT_DISPATCH}
};
static PARAMDATA rgpMsgBox[] =
{
    { OLESTR("message"), VT_BSTR }
};
static PARAMDATA rgpAskYesNo[] =
{
    { OLESTR("message"), VT_BSTR }
};
static PARAMDATA rgpinflateBlock[] =
{
    { OLESTR("element"), VT_DISPATCH}
};
/*static PARAMDATA rgpGenrePopup[] =
{
	не используется
    { OLESTR("document"), VT_DISPATCH}
};*/


enum IMETH_ExtDisp
{
    IMETH_BeginUndoUnit = 0,
    IMETH_EndUndoUnit,
    IMETH_SaveBinary,
	IMETH_GetBinarySize,
    IMETH_GetUUID,
	IMETH_InflateParagraphs,
	IMETH_MsgBox,
    IMETH_AskYesNo,
	IMETH_inflateBlock,
	IMETH_GetStylePath,
//    IMETH_GenrePopup,
};

enum IDMEMBER_ExtDisp
{
    IDMEMBER_BeginUndoUnit = DISPID_VALUE,
    IDMEMBER_EndUndoUnit,
    IDMEMBER_SaveBinary,
	IDMEMBER_GetBinarySize,
    IDMEMBER_GetUUID,
	IDMEMBER_InflateParagraphs,
	IDMEMBER_MsgBox,
    IDMEMBER_AskYesNo,
	IDMEMBER_inflateBlock,
	IDMEMBER_GetStylePath,
//    IDMEMBER_GenrePopup,
};


static METHODDATA rgmdataExtDisp[] =
{
	{OLESTR("BeginUndoUnit"),		rgpBeginUndoUnit,		IDMEMBER_BeginUndoUnit,		IMETH_BeginUndoUnit,	CC_CDECL,	2,	DISPATCH_METHOD,	VT_EMPTY},
	{OLESTR("EndUndoUnit"),			rgpEndUndoUnit,			IDMEMBER_EndUndoUnit,		IMETH_EndUndoUnit,		CC_CDECL,	1,	DISPATCH_METHOD,	VT_EMPTY},
	{OLESTR("SaveBinary"),			rgpSaveBinary,			IDMEMBER_SaveBinary,		IMETH_SaveBinary,		CC_CDECL,	2,	DISPATCH_METHOD,	VT_BOOL},
	{OLESTR("GetBinarySize"),		rgpGetBinarySize,		IDMEMBER_GetBinarySize,		IMETH_GetBinarySize,	CC_CDECL,	1,	DISPATCH_METHOD,	VT_INT},
	{OLESTR("GetUUID"),				0,						IDMEMBER_GetUUID,			IMETH_GetUUID,			CC_CDECL,	0,	DISPATCH_METHOD,	VT_BSTR},
	{OLESTR("InflateParagraphs"),	rgpInflateParagraphs,	IDMEMBER_InflateParagraphs,	IMETH_InflateParagraphs,CC_CDECL,	1,	DISPATCH_METHOD,	VT_EMPTY},
	{OLESTR("MsgBox"),				rgpMsgBox,				IDMEMBER_MsgBox,			IMETH_MsgBox,			CC_CDECL,	1,	DISPATCH_METHOD,	VT_EMPTY},
	{OLESTR("AskYesNo"),			rgpAskYesNo,			IDMEMBER_AskYesNo,			IMETH_AskYesNo,			CC_CDECL,	1,	DISPATCH_METHOD,	VT_BOOL},
	{OLESTR("inflateBlock"),		rgpinflateBlock,		IDMEMBER_inflateBlock,		IMETH_inflateBlock,		CC_CDECL,	1,	DISPATCH_METHOD,	VT_EMPTY},
	{OLESTR("GetStylePath"),		0,						IDMEMBER_GetStylePath,		IMETH_GetStylePath,		CC_CDECL,	0,	DISPATCH_METHOD,	VT_BSTR},
//	{OLESTR("GenrePopup"),			NULL,					IDMEMBER_GenrePopup,		IMETH_GenrePopup,		CC_CDECL,	0,	DISPATCH_METHOD,	VT_BSTR}
};


INTERFACEDATA idataExtDisp =
{
    rgmdataExtDisp, sizeof(rgmdataExtDisp) / sizeof(METHODDATA)
};
//==================================================================================================
TExternalDispatch::TExternalDispatch(CFBEView* view)
:   refcount(1),
    m_view(view),
    TypeInfo(NULL)
{
	BrowserExternal = new IBrowserExternal(m_view);
    CreateDispTypeInfo(&idataExtDisp, LOCALE_SYSTEM_DEFAULT, &TypeInfo);
}

TExternalDispatch::~TExternalDispatch()
{
    if(TypeInfo)
        TypeInfo->Release();
	delete BrowserExternal;
}

/* IUnknown */

HRESULT STDMETHODCALLTYPE TExternalDispatch::QueryInterface(REFIID classid, void** intf)
{
    if(intf == NULL)
        return E_INVALIDARG;

    if (classid == IID_IDispatch || classid == IID_IUnknown) {
        AddRef();
        *intf = this;
        return S_OK;
    }

    *intf = NULL;
    return E_NOINTERFACE;
}

ULONG STDMETHODCALLTYPE TExternalDispatch::AddRef()
{
    InterlockedIncrement(&refcount);
    return refcount;
}

ULONG STDMETHODCALLTYPE TExternalDispatch::Release()
{
    InterlockedDecrement(&refcount);
    if (refcount == 0) {
        delete this;
        return 0;
    }
    return refcount;
}

/* IDispatch */

HRESULT STDMETHODCALLTYPE TExternalDispatch::GetTypeInfoCount(
    UINT* pctinfo)
{
    if(TypeInfo == NULL)
        return E_NOTIMPL; // shouldn't happen

    if(pctinfo == NULL)
        return E_INVALIDARG;

    *pctinfo = 1;

	return S_OK;
}

HRESULT STDMETHODCALLTYPE TExternalDispatch::GetTypeInfo(
    /* [in] */ UINT iTInfo,
    /* [in] */ LCID lcid,
    /* [out] */ ITypeInfo** ppTInfo)
{
    if(TypeInfo == NULL)
        return E_NOTIMPL; // shouldn't happen

    if(iTInfo != 0)
        return DISP_E_BADINDEX;

    if(ppTInfo == NULL)
        return E_INVALIDARG;

    TypeInfo->AddRef();
    *ppTInfo = TypeInfo;

	return S_OK;
}

HRESULT STDMETHODCALLTYPE TExternalDispatch::GetIDsOfNames(
    /* [in] */ REFIID riid,
    /* [size_is][in] */ OLECHAR** rgszNames,
    /* [in] */ UINT cNames,
    /* [in] */ LCID lcid,
    /* [size_is][out] */ DISPID* rgDispId)
{
    if(TypeInfo == NULL)
        return E_NOTIMPL; // shouldn't happen

	int x = 0;
	x = TypeInfo->GetIDsOfNames(rgszNames, cNames, rgDispId);
    return x;
}

HRESULT STDMETHODCALLTYPE TExternalDispatch::Invoke(
    /* [in] */ DISPID dispIdMember,
    /* [in] */ REFIID /*riid*/,
    /* [in] */ LCID /*lcid*/,
    /* [in] */ WORD wFlags,
    /* [out][in] */ DISPPARAMS* pDispParams,
    /* [out] */ VARIANT* pVarResult,
    /* [out] */ EXCEPINFO* pExcepInfo,
    /* [out] */ UINT* puArgErr)
{
	HRESULT hr = S_OK;
    if(TypeInfo == NULL)
        return E_NOTIMPL; // shouldn't happen
	
	if(dispIdMember == 3)
	{
		V_VT(pVarResult) = VT_BSTR;
		void* ptr = pDispParams->rgvarg[0].bstrVal;
		void* ptr1 = *(void**)ptr;
		int len = BrowserExternal->GetBinarySize(pDispParams->rgvarg[0].bstrVal);		
		wchar_t str[64];
        wsprintf(str, L"%d", len);
		BSTR bs = SysAllocString(str);
		V_BSTR(pVarResult) = bs;
		return hr;
	}
	if(dispIdMember == 2)
	{
		BrowserExternal->SaveBinary(pDispParams->rgvarg[0].bstrVal, L"cover.png");//, pDispParams->rgvarg[1].bstrVal);
		return hr;
	}
	
	hr = TypeInfo->Invoke(BrowserExternal, dispIdMember, wFlags, pDispParams, pVarResult, pExcepInfo, puArgErr);
    return hr;
}


//=======================================================================================
void STDMETHODCALLTYPE IBrowserExternal::BeginUndoUnit(IDispatch* doc, BSTR name)
{
	m_view->BeginUndoUnit(name);
	return;
}

void STDMETHODCALLTYPE IBrowserExternal::EndUndoUnit(IDispatch* doc)
 {
	 m_view->EndUndoUnit();
	 return;
 }
bool STDMETHODCALLTYPE IBrowserExternal::SaveBinary(BSTR data, BSTR path)
{
	int len = ((int*)data)[4];
	void* buf = (int*)data + 8;
	FILE* file = _wfopen(path, L"wt");
	fwrite(buf, 1, len, file);
	fclose(file);
	return true;
}
int STDMETHODCALLTYPE IBrowserExternal::GetBinarySize(BSTR data)
{
	int len = ((int*)data)[4];
	return len;
}
BSTR STDMETHODCALLTYPE IBrowserExternal::GetUUID()
{
	UUID	      uuid;
	unsigned char *str;
	if (UuidCreate(&uuid)==RPC_S_OK && UuidToStringA(&uuid,&str)==RPC_S_OK) 
	{
		CString     us(str);
		RpcStringFreeA(&str);
		us.MakeUpper();
		BSTR ret = us.AllocSysString();
		return ret;
	}
	return L"";
}
void STDMETHODCALLTYPE IBrowserExternal::InflateParagraphs(IDispatch* elem)
 {	 
	 MSHTML::IHTMLElement2Ptr el;
	 elem->QueryInterface(IID_IHTMLElement2,(void**)&el);
	 MSHTML::IHTMLElementCollectionPtr   pp(el->getElementsByTagName(L"P"));
	 for (long l=0;l<pp->length;++l)
	 {
		MSHTML::IHTMLElement3Ptr(pp->item(l))->inflateBlock=VARIANT_TRUE;
	 }
	 return;
 }
void STDMETHODCALLTYPE IBrowserExternal::MsgBox(BSTR message)
 {
	 wchar_t buf [MAX_LOAD_STRING + 1];
	 ::LoadString(_Module.GetResourceInstance(), IDS_SCRIPT_MSG_CPT, buf, MAX_LOAD_STRING);
	 MessageBoxW(GetActiveWindow(), message, buf, MB_ICONINFORMATION|MB_OK);
	 return;
 }
bool STDMETHODCALLTYPE IBrowserExternal::AskYesNo(BSTR message)
 {
	 wchar_t buf [MAX_LOAD_STRING + 1];
	 ::LoadString(_Module.GetResourceInstance(), IDS_SCRIPT_MSG_CPT, buf, MAX_LOAD_STRING);
	 if (IDYES == MessageBoxW(GetActiveWindow(), message, buf, MB_ICONQUESTION|MB_YESNO))
	 {
		 return true;
	 }
	 else
	 {
		 return false;
	 }
 }
 bool STDMETHODCALLTYPE IBrowserExternal::inflateBlock(IDispatch* elem)
 {
	 MSHTML::IHTMLElement3Ptr el;
	 elem->QueryInterface(IID_IHTMLElement3,(void**)&el);
	 VARIANT_BOOL res = el->inflateBlock;
	 return res != VARIANT_TRUE;	 
 }
 BSTR STDMETHODCALLTYPE IBrowserExternal::GetStylePath()
{
	wchar_t path[MAX_PATH + 1];
	GetModuleFileName(0, path, MAX_PATH);
	PathRemoveFileSpec(path);
	CString     us(path);
	BSTR bp = us.AllocSysString();
	
	return bp;
}
// Эта функция реально не используется в скриптах
// BSTR STDMETHODCALLTYPE IBrowserExternal::GenrePopup(IHTMLDocument2Ptr doc);
