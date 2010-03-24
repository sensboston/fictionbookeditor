#ifndef EXPORTHTML_H
#define EXPORTHTML_H

EXTERN_C const GUID CLSID_ExportHTMLPlugin;

class ExportHTMLPlugin :
  public CComObjectRoot,
  public CComCoClass<ExportHTMLPlugin, &CLSID_ExportHTMLPlugin>,
  public IFBEExportPlugin
{
public:
  DECLARE_REGISTRY_RESOURCEID(IDR_EXPORTHTML)

  DECLARE_PROTECT_FINAL_CONSTRUCT()

  BEGIN_COM_MAP(ExportHTMLPlugin)
    COM_INTERFACE_ENTRY(IFBEExportPlugin)
  END_COM_MAP()

  // IFBEExportPlugin
  STDMETHOD(Export)(long hWnd,BSTR filename,IDispatch *doc);
};
#endif