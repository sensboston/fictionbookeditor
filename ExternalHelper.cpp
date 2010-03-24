#include "stdafx.h"
#include "resource.h"
#include "res1.h"

#include "utils.h"
#include "apputils.h"

#include "FBE.h"
#include "ExternalHelper.h"

#define	MENU_BASE   5000

struct Genre {
  int	      groupid;
  CString     id;
  CString     text;
};

static CSimpleArray<CString>	g_genre_groups;
static CSimpleArray<Genre>	g_genres;

struct DescElement
{
	int			groupid;
	CString		text;
};

static CSimpleMap<CString, DescElement> g_desc_elements;

struct Lang {
	CString     id;
	CString     text;
};

static CSimpleArray<CString>	g_lang_groups;
static CSimpleArray<Lang>	g_langs;

static void FillDescElements()
{
	g_desc_elements.RemoveAll();
	DescElement elem;
	elem.groupid = 1;
	wchar_t buf[MAX_LOAD_STRING + 1];
	if(::LoadString(_Module.GetResourceInstance(), IDS_DMS_TI, buf, MAX_LOAD_STRING))
		elem.text = buf;
	g_desc_elements.Add(L"ti_group", elem);
	if(::LoadString(_Module.GetResourceInstance(), IDS_DMS_GENRE_M, buf, MAX_LOAD_STRING))
		elem.text = buf;
	g_desc_elements.Add(L"ti_genre_match", elem);	
	if(::LoadString(_Module.GetResourceInstance(), IDS_DMS_KW, buf, MAX_LOAD_STRING))
		elem.text = buf;
	g_desc_elements.Add(L"ti_kw", elem);	
	if(::LoadString(_Module.GetResourceInstance(), IDS_DMS_AUTHOR, buf, MAX_LOAD_STRING))
		elem.text = buf;
	g_desc_elements.Add(L"ti_nic_mail_web", elem);
	elem.groupid = 2;
	if(::LoadString(_Module.GetResourceInstance(), IDS_DMS_DI, buf, MAX_LOAD_STRING))
		elem.text = buf;
	g_desc_elements.Add(L"di_group", elem);	
	if(::LoadString(_Module.GetResourceInstance(), IDS_DMS_ID, buf, MAX_LOAD_STRING))
		elem.text = buf;
	g_desc_elements.Add(L"di_id", elem);	
	elem.groupid = 0;
	if(::LoadString(_Module.GetResourceInstance(), IDS_DMS_STI, buf, MAX_LOAD_STRING))
		elem.text = buf;
	g_desc_elements.Add(L"sti_all", elem);
	if(::LoadString(_Module.GetResourceInstance(), IDS_DMS_CI, buf, MAX_LOAD_STRING))
		elem.text = buf;
	g_desc_elements.Add(L"ci_all", elem);
}


// genre list helper
static void	    LoadGenres() {
  FILE	  *fp;
  CString file_name = _Settings.GetLocalizedGenresFileName();
  // Modification by Pilgrim 
  try{
	fp=_tfopen(U::GetProgDirFile(file_name), _T("rb"));
  }catch(...){
  }

  if(!fp){
	  wchar_t cpt [MAX_LOAD_STRING + 1];
	  wchar_t msg [MAX_LOAD_STRING + 1];
	  ::LoadString(_Module.GetResourceInstance(), IDR_MAINFRAME, cpt, MAX_LOAD_STRING);
	  ::LoadString(_Module.GetResourceInstance(), IDS_GENRES_LIST_MSG, msg, MAX_LOAD_STRING);
	  U::MessageBox(MB_OK|MB_ICONERROR, cpt, msg, file_name);
	  return;
  }

  g_genre_groups.RemoveAll();
  g_genres.RemoveAll();

  char	  buffer[1024];
  while (fgets(buffer,sizeof(buffer),fp)) {
    int	  l=strlen(buffer);
    if (l>0 && buffer[l-1]=='\n') 
      buffer[--l]='\0';
    if (l>0 && buffer[l-1]=='\r')
      buffer[--l]='\0';

    if (buffer[0] && buffer[0]!=' ') {
      CString name(buffer);
      name.Replace(_T("&"),_T("&&"));
      g_genre_groups.Add(name);
    } else {
      char  *p=strchr(buffer+1,' ');
      if (!p || p==buffer+1)
	continue;
      *p++='\0';
      Genre   g;
      g.groupid=g_genre_groups.GetSize()-1;
      g.id=buffer+1;
      g.text=p;
      g.text.Replace(_T("&"),_T("&&"));
      g_genres.Add(g);
    }
  }
  fclose(fp);
}

static CMenu	  MakeGenresMenu() {
  CMenu	  ret;
  ret.CreatePopupMenu();

  CMenu	  cur;
  int	  g=-1;
  for (int i=0;i<g_genres.GetSize();++i) {
    if (g_genres[i].groupid!=g) {
      g=g_genres[i].groupid;
      cur.Detach();
      cur.CreatePopupMenu();
      ret.AppendMenu(MF_POPUP|MF_STRING,(UINT)(HMENU)cur,g_genre_groups[g]);
    }
    cur.AppendMenu(MF_STRING,i+MENU_BASE,g_genres[i].text);
  }
  cur.Detach();

  return ret.Detach();
}

static CMenu	  MakeDescComponentsMenu() {
	CMenu	  ret;
	ret.CreatePopupMenu();

	CMenu	  cur;
	int	  g=-1;
	for (int i=0;i<g_desc_elements.GetSize();++i) 
	{
		if(g_desc_elements.GetValueAt(i).groupid==0)
		{
			ret.AppendMenu(MF_STRING,i+MENU_BASE,g_desc_elements.GetValueAt(i).text);
			bool ext = _Settings.GetExtElementStyle(g_desc_elements.GetKeyAt(i));
			if(ext)
			{
				ret.CheckMenuItem(i+MENU_BASE, MF_CHECKED);
			}
			else
			{
				ret.CheckMenuItem(i+MENU_BASE, MF_UNCHECKED);
			}
			continue;
		}
		
		if (g_desc_elements.GetValueAt(i).groupid!=g) 
		{
			g=g_desc_elements.GetValueAt(i).groupid;
			cur.Detach();
			cur.CreatePopupMenu();
			ret.AppendMenu(MF_POPUP|MF_STRING,(UINT)(HMENU)cur,g_desc_elements.GetValueAt(i).text);
			continue;
		}
		cur.AppendMenu(MF_STRING,i+MENU_BASE,g_desc_elements.GetValueAt(i).text);
		bool ext = _Settings.GetExtElementStyle(g_desc_elements.GetKeyAt(i));
		if(ext)
		{
			cur.CheckMenuItem(i+MENU_BASE, MF_CHECKED);
		}
		else
		{
			cur.CheckMenuItem(i+MENU_BASE, MF_UNCHECKED);
		}
	}
	cur.Detach();

	return ret.Detach();
}

HRESULT	ExternalHelper::GenrePopup(IDispatch *obj,LONG x,LONG y,BSTR *name) {
  LoadGenres();
  CMenu	  popup=MakeGenresMenu();
  if (popup) {
    UINT  cmd=popup.TrackPopupMenu(
      TPM_RETURNCMD|TPM_LEFTALIGN|TPM_TOPALIGN,
      x,y,::GetActiveWindow()
    );
    popup.DestroyMenu();
    cmd-=MENU_BASE;
    if (cmd<(UINT)g_genres.GetSize()) {
      *name=g_genres[cmd].id.AllocSysString();
      return S_OK;
    }
  }
  *name=NULL;
  return S_OK;
}



// Modification by Pilgrim

// lang list helper
/*static void	    LoadLangs() {
	FILE	  *fp;
	try{
	  fp=_tfopen(U::GetProgDirFile(_T("languages.txt")),_T("rb"));
    }catch(...){
	}

	if(!fp){
		U::MessageBox(MB_OK|MB_ICONERROR,_T("FBE"),
			  _T("Не могу найти файл-список языков '%s'."),_T("languages.txt"));
		return;
	}

	g_lang_groups.RemoveAll();
	g_langs.RemoveAll();

	char	  buffer[1024];
	while (fgets(buffer,sizeof(buffer),fp)) {
		int	  l=strlen(buffer);
		if (l>0 && buffer[l-1]=='\n')
			buffer[--l]='\0';
		if (l>0 && buffer[l-1]=='\r')
			buffer[--l]='\0';

		char  *p=strchr(buffer+1,'|');
		if (!p || p==buffer+1)
			continue;
		*p++='\0';
		Lang   g;
		g.text=buffer;
		g.id=p;
		g.id.Replace(_T("&"),_T("&&"));
		g_langs.Add(g);
	}
	fclose(fp);
}*/

static CMenu	  MakeLangsMenu() {
	CMenu	  cur;
	cur.CreatePopupMenu();

	for (int i=0;i<g_langs.GetSize();++i) {
		cur.AppendMenu(MF_STRING,i+MENU_BASE,g_langs[i].text);
	}

	return cur.Detach();
}

static CMenu	  MakeExtendMenu() {
	CMenu	  cur;
	cur.CreatePopupMenu();

	for (int i=0;i<g_langs.GetSize();++i) {
		cur.AppendMenu(MF_STRING,i+MENU_BASE,g_langs[i].text);
	}

	return cur.Detach();
}


/*HRESULT	ExternalHelper::LangPopup(IDispatch *obj,LONG x,LONG y,BSTR *name) {
	LoadLangs();
	CMenu	  popup=MakeLangsMenu();
	if (popup) {
		UINT  cmd=popup.TrackPopupMenu(
			TPM_RETURNCMD|TPM_LEFTALIGN|TPM_TOPALIGN,
			x,y,::GetActiveWindow()
			);
		popup.DestroyMenu();
		cmd-=MENU_BASE;
		if (cmd<(UINT)g_langs.GetSize()) {
			*name=g_langs[cmd].id.AllocSysString();
			return S_OK;
		}
	}
	*name=NULL;
	return S_OK;
}

HRESULT	ExternalHelper::SrcLangPopup(IDispatch *obj,LONG x,LONG y,BSTR *name) {
	LoadLangs();
	CMenu	  popup=MakeLangsMenu();
	if (popup) {
		UINT  cmd=popup.TrackPopupMenu(
			TPM_RETURNCMD|TPM_LEFTALIGN|TPM_TOPALIGN,
			x,y,::GetActiveWindow()
			);
		popup.DestroyMenu();
		cmd-=MENU_BASE;
		if (cmd<(UINT)g_langs.GetSize()) {
			*name=g_langs[cmd].id.AllocSysString();
			return S_OK;
		}
	}
	*name=NULL;
	return S_OK;
}

HRESULT	ExternalHelper::STILangPopup(IDispatch *obj,LONG x,LONG y,BSTR *name) {
	LoadLangs();
	CMenu	  popup=MakeLangsMenu();
	if (popup) {
		UINT  cmd=popup.TrackPopupMenu(
			TPM_RETURNCMD|TPM_LEFTALIGN|TPM_TOPALIGN,
			x,y,::GetActiveWindow()
			);
		popup.DestroyMenu();
		cmd-=MENU_BASE;
		if (cmd<(UINT)g_langs.GetSize()) {
			*name=g_langs[cmd].id.AllocSysString();
			return S_OK;
		}
	}
	*name=NULL;
	return S_OK;
}

HRESULT	ExternalHelper::STISrcLangPopup(IDispatch *obj,LONG x,LONG y,BSTR *name) {
	LoadLangs();
	CMenu	  popup=MakeLangsMenu();
	if (popup) {
		UINT  cmd=popup.TrackPopupMenu(
			TPM_RETURNCMD|TPM_LEFTALIGN|TPM_TOPALIGN,
			x,y,::GetActiveWindow()
			);
		popup.DestroyMenu();
		cmd-=MENU_BASE;
		if (cmd<(UINT)g_langs.GetSize()) {
			*name=g_langs[cmd].id.AllocSysString();
			return S_OK;
		}
	}
	*name=NULL;
	return S_OK;
}*/

HRESULT	ExternalHelper::DescShowMenu(IDispatch *obj,LONG x,LONG y, BSTR *element_id) 
{
	FillDescElements();
	CMenu	  popup=MakeDescComponentsMenu();
	if (popup) 
	{
		UINT  cmd=popup.TrackPopupMenu(TPM_RETURNCMD|TPM_LEFTALIGN|TPM_TOPALIGN, x,y,::GetActiveWindow());		
		if(!cmd)
		{
			return S_OK;
		}
		
		popup.DestroyMenu();
		cmd-=MENU_BASE;
		if (cmd<(UINT)g_desc_elements.GetSize()) 
		{
			DescElement elem = g_desc_elements.GetValueAt(cmd);	
			*element_id = g_desc_elements.GetKeyAt(cmd).AllocSysString();
			return S_OK;
		}
	}
	return S_OK;
}