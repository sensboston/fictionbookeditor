#pragma once

class CFBEView;
class TDocHostUIHandler : public IDocHostUIHandler
{
public:
    TDocHostUIHandler();
    ~TDocHostUIHandler();

	bool AttachToBrowser(CFBEView* view);

    virtual HRESULT STDMETHODCALLTYPE QueryInterface(REFIID classid, void** intf);
    virtual ULONG STDMETHODCALLTYPE AddRef();
    virtual ULONG STDMETHODCALLTYPE Release();

    virtual HRESULT STDMETHODCALLTYPE ShowContextMenu(
        /* [in] */ DWORD dwID,
        /* [in] */ POINT __RPC_FAR *ppt,
        /* [in] */ IUnknown __RPC_FAR *pcmdtReserved,
        /* [in] */ IDispatch __RPC_FAR *pdispReserved);

    virtual HRESULT STDMETHODCALLTYPE GetHostInfo(
        /* [out][in] */ DOCHOSTUIINFO __RPC_FAR *pInfo);

    virtual HRESULT STDMETHODCALLTYPE ShowUI(
        /* [in] */ DWORD dwID,
        /* [in] */ IOleInPlaceActiveObject __RPC_FAR *pActiveObject,
        /* [in] */ IOleCommandTarget __RPC_FAR *pCommandTarget,
        /* [in] */ IOleInPlaceFrame __RPC_FAR *pFrame,
        /* [in] */ IOleInPlaceUIWindow __RPC_FAR *pDoc);

    virtual HRESULT STDMETHODCALLTYPE HideUI(void);

    virtual HRESULT STDMETHODCALLTYPE UpdateUI(void);

    virtual HRESULT STDMETHODCALLTYPE EnableModeless(
        /* [in] */ BOOL fEnable);

    virtual HRESULT STDMETHODCALLTYPE OnDocWindowActivate(
        /* [in] */ BOOL fActivate);

    virtual HRESULT STDMETHODCALLTYPE OnFrameWindowActivate(
        /* [in] */ BOOL fActivate);

    virtual HRESULT STDMETHODCALLTYPE ResizeBorder(
        /* [in] */ LPCRECT prcBorder,
        /* [in] */ IOleInPlaceUIWindow __RPC_FAR *pUIWindow,
        /* [in] */ BOOL fRameWindow);

    virtual HRESULT STDMETHODCALLTYPE TranslateAccelerator(
        /* [in] */ LPMSG lpMsg,
        /* [in] */ const GUID __RPC_FAR *pguidCmdGroup,
        /* [in] */ DWORD nCmdID);

    virtual HRESULT STDMETHODCALLTYPE GetOptionKeyPath(
        /* [out] */ LPOLESTR __RPC_FAR *pchKey,
        /* [in] */ DWORD dw);

    virtual HRESULT STDMETHODCALLTYPE GetDropTarget(
        /* [in] */ IDropTarget __RPC_FAR *pDropTarget,
        /* [out] */ IDropTarget __RPC_FAR *__RPC_FAR *ppDropTarget);

    virtual HRESULT STDMETHODCALLTYPE GetExternal(
        /* [out] */ IDispatch __RPC_FAR *__RPC_FAR *ppDispatch);

    virtual HRESULT STDMETHODCALLTYPE TranslateUrl(
        /* [in] */ DWORD dwTranslate,
        /* [in] */ OLECHAR __RPC_FAR *pchURLIn,
        /* [out] */ OLECHAR __RPC_FAR *__RPC_FAR *ppchURLOut);

    virtual HRESULT STDMETHODCALLTYPE FilterDataObject(
        /* [in] */ IDataObject __RPC_FAR *pDO,
        /* [out] */ IDataObject __RPC_FAR *__RPC_FAR *ppDORet);

private:
    long refcount;
	CFBEView* m_view;
};

class TOleCommandTarget : public IOleCommandTarget
{
public:
    TOleCommandTarget();
    ~TOleCommandTarget();

    // IUnknown
    virtual HRESULT STDMETHODCALLTYPE QueryInterface(REFIID classid, void** intf);
    virtual ULONG STDMETHODCALLTYPE AddRef();
    virtual ULONG STDMETHODCALLTYPE Release();

	// IOleCommandTarget
	virtual HRESULT STDMETHODCALLTYPE QueryStatus(
		/*[in]*/ const GUID *pguidCmdGroup,
		/*[in]*/ ULONG cCmds,
		/*[in,out][size_is(cCmds)]*/ OLECMD *prgCmds,
		/*[in,out]*/ OLECMDTEXT *pCmdText);

	virtual HRESULT STDMETHODCALLTYPE Exec(
		/*[in]*/ const GUID *pguidCmdGroup,
		/*[in]*/ DWORD nCmdID,
		/*[in]*/ DWORD nCmdExecOpt,
		/*[in]*/ VARIANTARG *pvaIn,
		/*[in,out]*/ VARIANTARG *pvaOut);

private:
    long refcount;
};


class IBrowserExternal
{
public:
	IBrowserExternal(CFBEView* view):m_view(view) {};
    ~IBrowserExternal() {};

    // our stuff
	virtual void STDMETHODCALLTYPE BeginUndoUnit(IDispatch* doc, BSTR name);
	virtual void STDMETHODCALLTYPE EndUndoUnit(IDispatch* doc);
	virtual bool STDMETHODCALLTYPE SaveBinary(BSTR path, BSTR data);
	virtual int STDMETHODCALLTYPE GetBinarySize(BSTR data);
	virtual BSTR STDMETHODCALLTYPE GetUUID();
	virtual void STDMETHODCALLTYPE InflateParagraphs(IDispatch* elem);
	virtual void STDMETHODCALLTYPE MsgBox(BSTR message);
	virtual bool STDMETHODCALLTYPE AskYesNo(BSTR message);
	virtual bool STDMETHODCALLTYPE inflateBlock(IDispatch* element);
	virtual BSTR STDMETHODCALLTYPE GetStylePath();
	// Эта функция реально не используется в скриптах
	//virtual BSTR STDMETHODCALLTYPE GenrePopup(IHTMLDocument2Ptr doc);
private:
	CFBEView* m_view;
};
class TExternalDispatch : public IDispatch
{
public:
    TExternalDispatch(CFBEView* view);
    ~TExternalDispatch();

    // IUnknown
    virtual HRESULT STDMETHODCALLTYPE QueryInterface(REFIID classid, void** intf);
    virtual ULONG STDMETHODCALLTYPE AddRef();
    virtual ULONG STDMETHODCALLTYPE Release();

    //IDispatch
    virtual HRESULT STDMETHODCALLTYPE GetTypeInfoCount(UINT* pctinfo);

    virtual HRESULT STDMETHODCALLTYPE GetTypeInfo(/* [in] */ UINT iTInfo,
        /* [in] */ LCID lcid,
        /* [out] */ ITypeInfo** ppTInfo);

    virtual HRESULT STDMETHODCALLTYPE GetIDsOfNames(
        /* [in] */ REFIID riid,
        /* [size_is][in] */ LPOLESTR *rgszNames,
        /* [in] */ UINT cNames,
        /* [in] */ LCID lcid,
        /* [size_is][out] */ DISPID *rgDispId);

    virtual HRESULT STDMETHODCALLTYPE Invoke(
        /* [in] */ DISPID dispIdMember,
        /* [in] */ REFIID riid,
        /* [in] */ LCID lcid,
        /* [in] */ WORD wFlags,
        /* [out][in] */ DISPPARAMS  *pDispParams,
        /* [out] */ VARIANT  *pVarResult,
        /* [out] */ EXCEPINFO *pExcepInfo,
        /* [out] */ UINT *puArgErr);

private:
    long refcount;
	CFBEView* m_view;
	IBrowserExternal* BrowserExternal;
    ITypeInfo* TypeInfo;
};