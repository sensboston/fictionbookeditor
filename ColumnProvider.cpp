#include "stdafx.h"

#define	F(cat,name)	&ColumnProvider::FBInfo::get_##cat##_##name
ColumnProvider::ColumnInfo    ColumnProvider::g_columns[]={
  { L"Genre",		12,   SHCOLSTATE_TYPE_STR,  &FMTID_MUSIC,		PIDSI_GENRE,  F(title,genres)   },
  { L"Author",		32,   SHCOLSTATE_TYPE_STR,  &FMTID_SummaryInformation,  PIDSI_AUTHOR, F(title,authors)  },
  { L"Title",		32,   SHCOLSTATE_TYPE_STR,  &FMTID_SummaryInformation,  PIDSI_TITLE,  F(title,title)    },
  { L"Year",		25,   SHCOLSTATE_TYPE_STR,  &FMTID_MUSIC,		PIDSI_YEAR,   F(title,date)     },
  { L"Language",	5,    SHCOLSTATE_TYPE_STR,  &FMTID_FB,			PIDFB_LANG,   F(title,lang)     },
  { L"Source Language", 5,    SHCOLSTATE_TYPE_STR,  &FMTID_FB,			PIDFB_SRCLANG,F(title,srclang)  },
  { L"Sequence",	32,   SHCOLSTATE_TYPE_STR,  &FMTID_FB,			PIDFB_SEQ,    F(title,seq)      },
  { L"Document Author", 32,   SHCOLSTATE_TYPE_STR,  &FMTID_FB,			PIDFB_DOCAUTH,F(doc,authors)    },
  { L"Document Year",	25,   SHCOLSTATE_TYPE_STR,  &FMTID_FB,			PIDFB_DOCDATE,F(doc,date)	},
  { L"Version",		6,    SHCOLSTATE_TYPE_STR,  &FMTID_FB,			PIDFB_VER,    F(doc,ver)	},
  { L"ID",		35,   SHCOLSTATE_TYPE_STR,  &FMTID_FB,			PIDFB_ID,     F(doc,id)		},
  { L"Date",		15,   SHCOLSTATE_TYPE_DATE, &FMTID_FB,			PIDFB_DV,     F(title,dateval)  },
  { L"Document Date",	15,   SHCOLSTATE_TYPE_DATE, &FMTID_FB,			PIDFB_DOCDV,  F(doc,dateval)    },
};
#undef F
#define	NCOLUMNS  (sizeof(g_columns)/sizeof(g_columns[0]))

HRESULT	  ColumnProvider::FBInfo::GetVariant(const CString& str,VARIANT *vt) {
  if (V_BSTR(vt)=str.AllocSysString()) {
    V_VT(vt)=VT_BSTR;
    return S_OK;
  }
  return E_OUTOFMEMORY;
}

HRESULT ColumnProvider::GetColumnInfo(DWORD dwIndex,SHCOLUMNINFO *psci)
{
  if (dwIndex>=NCOLUMNS)
    return S_FALSE;

  memset(psci,0,sizeof(*psci));

  ColumnInfo	*ci=&g_columns[dwIndex];

  psci->scid.fmtid=*ci->fmtid;
  psci->scid.pid=ci->pid;

  psci->vt=VT_LPWSTR;
  psci->fmt=LVCFMT_LEFT;
  psci->cChars=ci->width;
  psci->csFlags=ci->col;
  lstrcpynW(psci->wszTitle,ci->name,MAX_COLUMN_NAME_LEN);

  return S_OK;
}

HRESULT ColumnProvider::GetItemData(LPCSHCOLUMNID pscid, LPCSHCOLUMNDATA pscd, VARIANT* pvarData)
{
  // don't even boter with others' files
  if (pscd->dwFileAttributes & (FILE_ATTRIBUTE_DIRECTORY | FILE_ATTRIBUTE_OFFLINE) ||
      lstrcmpiW(pscd->pwszExt,L".fb2")!=0)
    return S_FALSE;

  for (int i=0;i<NCOLUMNS;++i)
    if (pscid->pid==g_columns[i].pid && pscid->fmtid==*g_columns[i].fmtid) {
      ::EnterCriticalSection(&m_lock);

      if (pscd->dwFlags & SHCDF_UPDATEITEM)
	m_cache.Clear();

      HRESULT     hr=m_cache.Init(pscd->wszFile);
      if (SUCCEEDED(hr))
	hr=g_columns[i].handler(m_cache,pvarData);

      ::LeaveCriticalSection(&m_lock);

      return hr;
    }

  return S_FALSE;
}

class ColumnProvider::ContentHandlerImpl :
  public CComObjectRoot,
  public MSXML2::ISAXContentHandler
{
public:
  enum ParseMode {
    ROOT,
    TOP,
    DESC,
    TITLE,
    DOC,
    AUTHOR,
    NICK,
    EMAIL,
    HOME,
    DATE,
    GRAB,
    ACOMP,
    GENRE
  };

  ContentHandlerImpl() : m_info(0), m_dest(0),
    m_ok(false), m_root(true), m_prefix(0),
    m_forceprefix(false) { m_mstack.Add(ROOT); }

  void	SetInfo(ColumnProvider::FBInfo *fbi) { m_info=fbi; m_dest=0; }
  bool	Ok() { return m_ok; }

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

protected:
  ColumnProvider::FBInfo	*m_info;
  CString			*m_dest;
  CSimpleValArray<ParseMode>	m_mstack;
  bool				m_ok;
  bool				m_root;
  bool				m_added;
  const wchar_t			*m_prefix;
  bool				m_forceprefix;
  CString			m_tmp;

  void		FlushPrefix() {
    if (m_dest && m_prefix && (m_forceprefix || !m_dest->IsEmpty()))
      *m_dest+=m_prefix;

    m_prefix=0;
  }
  void		SetPrefix(const wchar_t *pf,bool force=false) {
    if (!m_dest)
      return;
    FlushPrefix();
    m_prefix=pf;
    m_forceprefix=force;
  }
};

HRESULT	ColumnProvider::FBInfo::Init(const wchar_t *fn) {
  if (filename==fn)
    return S_OK;

  try {
    ContentHandlerPtr	      ch;
    CheckError(CreateObject(ch));

    MSXML2::ISAXXMLReaderPtr  rdr;
    CheckError(rdr.CreateInstance(L"MSXML2.SAXXMLReader.4.0"));

    rdr->putContentHandler(ch);

    ch->SetInfo(this);
    Clear();

    HRESULT hr=rdr->raw_parseURL((wchar_t *)fn);
    if (!ch->Ok())
      return FAILED(hr) ? hr : S_FALSE;

    ch->SetInfo(0);
    filename=fn;
  }
  catch (_com_error& e) {
    return e.Error();
  }

  return S_OK;
}

void  ColumnProvider::FBInfo::Clear() {
  title.authors.Empty();
  title.date.Empty();
  title.dateval.Empty();
  title.genres.Empty();
  title.lang.Empty();
  title.seq.Empty();
  title.srclang.Empty();
  title.title.Empty();

  doc.authors.Empty();
  doc.date.Empty();
  doc.dateval.Empty();
  doc.dateval.Empty();
  doc.id.Empty();
  doc.ver.Empty();

  filename.Empty();
}

HRESULT	ColumnProvider::ContentHandlerImpl::raw_startElement(wchar_t *nsuri,int urilen,
					     wchar_t *name,int namelen,
					     wchar_t *qname,int qnamelen,
					     MSXML2::ISAXAttributes *attr)
{
  // all elements must be in a fictionbook namespace
  if (!StrEQ(FBNS,nsuri,urilen))
    return E_FAIL;

  ParseMode   next=m_mstack[m_mstack.GetSize()-1];

  switch (next) {
  case ROOT:
    if (!StrEQ(L"FictionBook",name,namelen))
      return E_FAIL;
    next=TOP;
    break;
  case TOP:
    if (StrEQ(L"description",name,namelen))
      next=DESC;
    break;
  case DESC:
    if (StrEQ(L"title-info",name,namelen))
      next=TITLE;
    else if (StrEQ(L"document-info",name,namelen))
      next=DOC;
    break;
  case TITLE:
    if (StrEQ(L"genre",name,namelen)) {
      m_tmp=GetAttr(attr,L"match");
      m_dest=&m_info->title.genres;
      SetPrefix(L", ");
      next=GENRE;
    } else if (StrEQ(L"author",name,namelen)) {
      next=AUTHOR;
      m_dest=&m_info->title.authors;
      SetPrefix(L", ");
    } else if (StrEQ(L"book-title",name,namelen)) {
      next=GRAB;
      m_dest=&m_info->title.title;
    } else if (StrEQ(L"lang",name,namelen)) {
      next=GRAB;
      m_dest=&m_info->title.lang;
    } else if (StrEQ(L"src-lang",name,namelen)) {
      next=GRAB;
      m_dest=&m_info->title.srclang;
    } else if (StrEQ(L"date",name,namelen)) {
      next=DATE;
      m_dest=&m_info->title.date;
      m_info->title.dateval=GetAttr(attr,L"value");
    } else if (StrEQ(L"sequence",name,namelen)) {
      CString name(GetAttr(attr,L"name"));
      if (!name.IsEmpty()) {
	if (!m_info->title.seq.IsEmpty())
	  m_info->title.seq+=L';';
	m_info->title.seq+=name;
	CString num(GetAttr(attr,L"number"));
	if (!num.IsEmpty()) {
	  m_info->title.seq+=L" [";
	  num.Format(_T("%02d"),_wtoi(num));
	  m_info->title.seq+=num;
	  m_info->title.seq+=L']';
	}
      }
    }
    break;
  case DOC:
    if (StrEQ(L"author",name,namelen)) {
      next=AUTHOR;
      m_dest=&m_info->doc.authors;
      SetPrefix(L", ");
    } else if (StrEQ(L"date",name,namelen)) {
      next=DATE;
      m_dest=&m_info->doc.date;
      m_info->doc.dateval=GetAttr(attr,L"value");
    } else if (StrEQ(L"id",name,namelen)) {
      next=GRAB;
      m_dest=&m_info->doc.id;
    } else if (StrEQ(L"version",name,namelen)) {
      next=GRAB;
      m_dest=&m_info->doc.ver;
    }
    break;
  case AUTHOR:
    if (StrEQ(L"nickname",name,namelen)) {
      SetPrefix(L" [",true);
      next=NICK;
    } else if (StrEQ(L"email",name,namelen)) {
      SetPrefix(L" (",true);
      next=EMAIL;
    } else if (StrEQ(L"home-page",name,namelen)) {
      SetPrefix(L" <",true);
      next=HOME;
    } else
      next=ACOMP;
    break;
  }

  m_mstack.Add(next);

  return S_OK;
}

HRESULT ColumnProvider::ContentHandlerImpl::raw_endElement(wchar_t *nsuri,int nslen,
					   wchar_t *name,int namelen,
					   wchar_t *qname,int qnamelen)
{
  ParseMode	cur=m_mstack[m_mstack.GetSize()-1],next=m_mstack[m_mstack.GetSize()-2];
  m_mstack.RemoveAt(m_mstack.GetSize()-1);

  if (cur==next)
    return S_OK;

  switch (cur) {
  case DESC:
    m_ok=true;
    return E_FAIL;
    break;
  case AUTHOR:
    NormalizeInplace(*m_dest);
    m_dest=0;
    m_prefix=0;
    break;
  case NICK:
    if (!m_prefix)
      *m_dest+=L']';
    NormalizeInplace(*m_dest);
    m_prefix=0;
    break;
  case EMAIL:
    if (!m_prefix)
      *m_dest+=L')';
    NormalizeInplace(*m_dest);
    m_prefix=0;
    break;
  case HOME:
    if (!m_prefix)
      *m_dest+=L'>';
    NormalizeInplace(*m_dest);
    m_prefix=0;
    break;
  case ACOMP:
    NormalizeInplace(*m_dest);
    if (!m_prefix)
      SetPrefix(L" ");
    break;
  case GRAB:
    NormalizeInplace(*m_dest);
    m_dest=0;
    m_prefix=0;
    break;
  case DATE:
    NormalizeInplace(*m_dest);
    m_dest=0;
    m_prefix=0;
    break;
  case GENRE:
    if (!m_tmp.IsEmpty() && m_tmp!=L"100") {
      FlushPrefix();
      *m_dest+=L" [";
      *m_dest+=m_tmp;
      *m_dest+=L']';
    }
    NormalizeInplace(*m_dest);
    m_dest=0;
    m_prefix=0;
    break;
  }
  return S_OK;
}

HRESULT ColumnProvider::ContentHandlerImpl::raw_characters(wchar_t *chars,int nch)
{
  if (m_dest) {
    FlushPrefix();

    AppendText(*m_dest,chars,nch);
  }

  return S_OK;
}