#include "stdafx.h"

// a MemReader helper class
class MemReader : public ImageLoader::BinReader {
private:
  const BYTE  *m_data;
  int	      m_len;
public:
  MemReader(void *mem,int len) { Init(mem,len); }
  int Read(void *buffer,int count) {
    if (count>m_len)
      count=m_len;
    memcpy(buffer,m_data,count);
    m_data+=count;
    m_len-=count;
    return count;
  }
  void	Init(void *mem,int len) { m_data=(const BYTE *)mem; m_len=len; }
};

// IExtractImage
HRESULT IconExtractor::GetLocation(wchar_t *file,DWORD filelen,DWORD *prio,
				   const SIZE *sz,
				   DWORD depth,DWORD *flags)
{
  m_desired_size=*sz;
  m_desired_depth=depth;


  *flags|=IEIFLAG_CACHE;

  lstrcpynW(file,m_filename,filelen);

  if (*flags & IEIFLAG_ASYNC) {
    *prio = 1;
    return E_PENDING;
  }

  return S_OK;
}

HRESULT IconExtractor::Extract(HBITMAP *hBmp) {
  // load image if available
  CString     type;
  int	      datalen;
  void	      *data=NULL;
  if (!LoadObject(m_filename,type,data,datalen))
    return E_FAIL;

  // create an image from our data
  MemReader rdr(data,datalen);
  HDC	hDC=::GetDC(NULL);
  int	w,h;
  bool ok=ImageLoader::Load(hDC,type,&rdr,
    m_desired_size.cx,m_desired_size.cy,
    0,*hBmp,w,h);
  ::ReleaseDC(NULL,hDC);
  free(data);

  return ok ? S_OK : E_FAIL;
}

// IExtractImage2
HRESULT	IconExtractor::GetDateStamp(FILETIME *tm) {
  HANDLE  hFile=::CreateFile(m_filename,FILE_READ_ATTRIBUTES,0,NULL,OPEN_EXISTING,0,NULL);
  if (hFile==INVALID_HANDLE_VALUE)
    return HRESULT_FROM_WIN32(::GetLastError());
  ::GetFileTime(hFile,NULL,NULL,tm);
  ::CloseHandle(hFile);
  return S_OK;
}

///////////////////////////////////////////////////////////
// SAX xml content handler (I use SAX instead of DOM for speed)
class IconExtractor::ContentHandlerImpl :
  public CComObjectRoot,
  public MSXML2::ISAXContentHandler
{
public:
  enum ParseMode {
    NONE,
    COVERPAGE,
    DATA
  };

  // construction
  ContentHandlerImpl() : m_mode(NONE), m_data(NULL), m_ok(false) { }
  ~ContentHandlerImpl() {
    free(m_data);
  }

  DECLARE_NO_REGISTRY()

  BEGIN_COM_MAP(ContentHandlerImpl)
    COM_INTERFACE_ENTRY(MSXML2::ISAXContentHandler)
  END_COM_MAP()

  // ISAXContentHandler
  STDMETHOD(raw_characters)(wchar_t *chars,int nch);
  STDMETHOD(raw_endDocument)() { return S_OK; }
  STDMETHOD(raw_startDocument)() { return S_OK; }
  STDMETHOD(raw_endElement)(wchar_t *nsuri,int nslen,wchar_t *name,int namelen,
			    wchar_t *qname,int qnamelen);
  STDMETHOD(raw_startElement)(wchar_t *nsuri,int nslen,wchar_t *name,int namelen,
			      wchar_t *qname,int qnamelen,MSXML2::ISAXAttributes *attr);
  STDMETHOD(raw_ignorableWhitespace)(wchar_t *spc,int spclen) { return S_OK; }
  STDMETHOD(raw_endPrefixMapping)(wchar_t *prefix,int len) { return S_OK; }
  STDMETHOD(raw_startPrefixMapping)(wchar_t *prefix,int plen,wchar_t *uri,int urilen) { return S_OK; }
  STDMETHOD(raw_processingInstruction)(wchar_t *targ,int targlen,wchar_t *data,int datalen) { return S_OK; }
  STDMETHOD(raw_skippedEntity)(wchar_t *name,int namelen) { return S_OK; }
  STDMETHOD(raw_putDocumentLocator)(MSXML2::ISAXLocator *loc) { return S_OK; }

  // data access
  void	  *Detach() {
    void *tmp=m_data;
    m_data=NULL;
    return tmp;
  }
  int	  Length() { return m_data_ptr; }
  CString Type() { return m_cover_type; }
  bool	  Ok() { return m_ok; }

private:
  ParseMode	  m_mode;
  bool		  m_ok;

  CString	  m_cover_id;
  CString	  m_cover_type;
  DWORD		  m_data_length;
  DWORD		  m_data_ptr;
  BYTE		  *m_data;

  // base64 decoder state
  DWORD		  m_bits;
  BYTE		  m_shift;

  // extend the data array
  bool		  Extend(BYTE *np) {
    m_data_ptr=np-m_data;
    DWORD   tmp=m_data_length<<1;
    void    *mem=realloc(m_data,tmp);
    if (!mem)
      return false;
    m_data_length=tmp;
    m_data=(BYTE*)mem;
    return true;
  }
};

bool    IconExtractor::LoadObject(const wchar_t *filename,CString& type,void *&data,int& datalen)
{
  ContentHandlerPtr	      ch;
  if (FAILED(CreateObject(ch)))
    return IStreamPtr();

  MSXML2::ISAXXMLReaderPtr    rdr;
  if (FAILED(rdr.CreateInstance(L"MSXML2.SAXXMLReader.4.0")))
    return IStreamPtr();

  rdr->putContentHandler(ch);

  rdr->raw_parseURL((wchar_t *)filename);
  if (!ch->Ok())
    return false;

  type=ch->Type();
  datalen=ch->Length();
  data=ch->Detach();

  return true;
}

HRESULT	IconExtractor::ContentHandlerImpl::raw_endElement(wchar_t *nsuri,int nslen,
							  wchar_t *name,int namelen,
							  wchar_t *qname,int qnamelen)
{
  // all elements must be in a fictionbook namespace
  if (!StrEQ(FBNS,nsuri,nslen))
    return E_FAIL;

  switch (m_mode) {
  case NONE:
    if (StrEQ(L"description",name,namelen) && m_cover_id.IsEmpty())
	return E_FAIL;
    break;
  case COVERPAGE:
    if (StrEQ(L"coverpage",name,namelen)) {
      if (m_cover_id.IsEmpty())
	return E_FAIL;
      m_mode=NONE;
    }
    break;
  case DATA:
    // if we got here and have some bits left in our buffer then we have malformed
    // base64 data
    if (m_shift==18)
      m_ok=true;
    return E_FAIL;
  }

  return S_OK;
}

HRESULT	IconExtractor::ContentHandlerImpl::raw_startElement(wchar_t *nsuri,int nslen,
							    wchar_t *name,int namelen,
							    wchar_t *qname,int qnamelen,
							    MSXML2::ISAXAttributes *attr)
{
  // all elements must be in a fictionbook namespace
  if (!StrEQ(FBNS,nsuri,nslen))
    return E_FAIL;

  switch (m_mode) {
  case NONE:
    if (StrEQ(L"coverpage",name,namelen))
      m_mode=COVERPAGE;
    else if (StrEQ(L"binary",name,namelen)) {
      if (m_cover_id.IsEmpty()) // invalid file
	return E_FAIL;
      if (m_cover_id!=GetAttr(attr,L"id"))
	return S_OK;

      m_cover_type=GetAttr(attr,L"content-type");

      // initialize memory block and a base64 decoder
      m_data_length=32768; // arbitrary initial size
      m_data_ptr=0;
      m_data=(BYTE*)malloc(m_data_length);
      if (m_data==NULL)
	return E_FAIL;
      m_shift=18;
      m_bits=0;
      m_mode=DATA;
    }
    break;
  case COVERPAGE:
    if (StrEQ(L"image",name,namelen)) {
      CString	tmp(GetAttr(attr,L"href",XLINKNS));
      if (tmp.GetLength()>1 && tmp[0]==_T('#')) {
	m_cover_id=tmp;
	m_cover_id.Delete(0);
	m_mode=NONE;
      }
    }
    break;
  }

  return S_OK;
}

static BYTE	g_base64_table[256]={
65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,
65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,
65,65,65,65,65,65,65,62,65,65,65,63,52,53,54,55,56,57,
58,59,60,61,65,65,65,64,65,65,65,0,1,2,3,4,5,6,7,8,9,10,
11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,65,65,65,
65,65,65,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,
41,42,43,44,45,46,47,48,49,50,51,65,65,65,65,65,65,65,
65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,
65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,
65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,
65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,
65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,
65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,
65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65
};

HRESULT	IconExtractor::ContentHandlerImpl::raw_characters(wchar_t *chars,int nch) {
  if (m_mode!=DATA)
    return S_OK;

  // process base64 data and append to m_data

  // copy globals to local variables
  BYTE	  shift=m_shift;
  DWORD	  acc=m_bits;
  BYTE	  *data=m_data+m_data_ptr;
  DWORD	  space=m_data_length-m_data_ptr;

  for (wchar_t *chars_end=chars+nch;chars<chars_end;++chars) {
    BYTE     bits=g_base64_table[*chars & 0xff]; // not my problem if it wraps
    switch (bits) {
    case 64: // end of data
      switch (shift) { // store remaining bytes
      case 18:
      case 12:
	// malformed base64 data
	return E_FAIL;
      case 6: // one byte
	if (space<2) {
	  if (!Extend(data))
	    return E_FAIL;
	  data=m_data+m_data_ptr;
	  space=m_data_length-m_data_ptr;
	}
	*data++ = (BYTE)(acc>>16);
	break;
      case 0: // two bytes
	if (space<2) {
	  if (!Extend(data))
	    return E_FAIL;
	  data=m_data+m_data_ptr;
	  space=m_data_length-m_data_ptr;
	}
	*data++ = (BYTE)(acc>>16);
	*data++ = (BYTE)(acc>>8);
	break;
      }
      m_data_ptr=data-m_data;
      m_ok=true;
      return E_FAIL;
    case 65: // whitespace, ignore;
      break;
    default: // valid bits, process
      acc|=(DWORD)bits << shift;
      if ((shift-=6)>18) { // wraparound, full triplet ready
	if (space<3) {
	  if (!Extend(data))
	    return E_FAIL;
	  data=m_data+m_data_ptr;
	  space=m_data_length-m_data_ptr;
	}
	*data++ = (BYTE)(acc>>16);
	*data++ = (BYTE)(acc>>8);
	*data++ = (BYTE)(acc);
	shift=18;
	space-=3;
	acc=0;
      }
      break;
    }
  }

  // store back vars
  m_data_ptr=data-m_data;
  m_shift=shift;
  m_bits=acc;

  return S_OK;
}