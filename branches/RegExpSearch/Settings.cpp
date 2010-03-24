#include "stdafx.h"
#include "Settings.h"

const wchar_t KEEP_ENCODING_KEY[]	= L"KeepEncoding";
const wchar_t DEFAULT_ENCODING_KEY[]= L"DefaultSaveEncoding";
const wchar_t SEARCH_OPTIONS_KEY[]	= L"SearchOptions";
const wchar_t FBW_HK_KEY[]			= L"FbwHotkeys";
const wchar_t COLOR_BG_KEY[]		= L"ColorBG";
const wchar_t COLOR_FG_KEY[]		= L"ColorFG";
const wchar_t FONT_SIZE_KEY[]		= L"FontSize";
const wchar_t XML_SRC_WRAP_KEY[]		= L"XMLSrcWrap";
const wchar_t XML_SRC_SYNTAX_HL_KEY[]	= L"XMLSrcSyntaxHL";
const wchar_t XML_SRC_SHOW_EOL_KEY[]	= L"XMLSrcShowEOL";
const wchar_t FAST_MODE_KEY[]		= L"FastMode";
const wchar_t FONT_KEY[]			= L"Font";
const wchar_t VIEW_STATUS_BAR_KEY[]	= L"ViewStatusBar";
const wchar_t VIEW_DOCUMENT_TREE_KEY[]	= L"ViewDocumentTree";
const wchar_t SPLITTER_POS_KEY[]	= L"SplitterPos";
const wchar_t TOOLBARS_SETTINGS_KEY[]	= L"Toolbars";
const wchar_t WINDOW_POS_KEY[]		= L"WindowPosition";
const wchar_t RESTORE_FILE_POS_KEY[]	= L"RestoreFilePosition";
const wchar_t INTERFACE_LANG_KEY[]	= L"IntefaceLangID";
const wchar_t SCRIPTS_FOLDER_KEY[]  = L"ScriptsFolder";
const wchar_t INSIMAGE_ASKING[]		= L"InsImageDialog";
const wchar_t SCRIPTS_HKEY_ERR_NTF[]= L"ScrHkErrDialog";
const wchar_t INS_CLEAR_IMAGE[]		= L"InsClearImage";

const wchar_t DEFAULT_ENCODING[]	= L"utf-8";
const wchar_t DEFAULT_FONT[]		= L"Trebuchet MS";
const wchar_t DEFAULT_SCRIPTS_FOLDER[]	= L"cmd";

CSettings::CSettings():m_need_restart(false)
{
}

CSettings::~CSettings()
{
}

void CSettings::Init()
{
	TCHAR	  filepath[MAX_PATH];
	DWORD	  pathlen = ::GetModuleFileName(_Module.GetModuleInstance(),filepath,MAX_PATH);
	TCHAR	  *appname;
	if (pathlen == 0)
		appname = L"FictionBook Editor";
	else 
	{
		CString   tmp = U::GetFullPathName(filepath);
		int	      pos = tmp.ReverseFind(_T('\\'));
		if (pos >= 0)
			tmp.Delete(0, pos+1);
		pos = tmp.ReverseFind(_T('.'));
		if (pos >= 0) 
		{
			const TCHAR *cp = tmp;
			cp += pos;
			if(_tcsicmp(cp,_T(".exe")) == 0 || _tcsicmp(cp, _T(".dll")) == 0)
				tmp.Delete(pos, tmp.GetLength() - pos);
		}
		if (tmp.IsEmpty())
			appname=L"FictionBook Editor";
		else 
		{
			lstrcpyn(filepath, tmp, MAX_PATH);
			appname = L"FictionBook Editor"/*filepath*/;
		}
	}
	m_key_path = L"Software\\LitRes\\";
	/*m_key_path = L"Software\\Haali\\";*/
	m_key_path += appname;
	m_key.Create(HKEY_CURRENT_USER, m_key_path);	
}

void CSettings::Close()
{
	m_key.Close();
}

void CSettings::Load()
{
	m_keep_encoding			= U::QueryIV(m_key, KEEP_ENCODING_KEY, true) != 0;
	m_default_encoding		= U::QuerySV(m_key, DEFAULT_ENCODING_KEY, DEFAULT_ENCODING);
	m_search_options		= U::QueryIV(m_key, SEARCH_OPTIONS_KEY, true);
	m_fbw_hotkeys			= U::QueryIV(m_key, FBW_HK_KEY, false) != 0;
	m_collorBG				= U::QueryIV(m_key, COLOR_BG_KEY, CLR_DEFAULT);
	m_collorFG				= U::QueryIV(m_key, COLOR_FG_KEY, CLR_DEFAULT);
	m_font_size				= U::QueryIV(m_key, FONT_SIZE_KEY, 12);
	m_xml_src_wrap			= U::QueryIV(m_key, XML_SRC_WRAP_KEY, true) != 0;
	m_xml_src_syntaxHL		= U::QueryIV(m_key, XML_SRC_SYNTAX_HL_KEY, true) != 0;
	m_xml_src_showEOL		= U::QueryIV(m_key, XML_SRC_SHOW_EOL_KEY, false) != 0;	
	m_fast_mode				= U::QueryIV(m_key, FAST_MODE_KEY, false) != 0;	
	m_font					= U::QuerySV(m_key, FONT_KEY, DEFAULT_FONT);	
	m_view_status_bar		= U::QueryIV(m_key, VIEW_STATUS_BAR_KEY, true) != 0;	
	m_view_doc_tree			= U::QueryIV(m_key, VIEW_DOCUMENT_TREE_KEY, true) != 0;	
	m_splitter_pos			= U::QueryIV(m_key, SPLITTER_POS_KEY, 200);	
	m_toolbars_settings		= U::QuerySV(m_key, TOOLBARS_SETTINGS_KEY, L"");	
	m_restore_file_position	= U::QueryIV(m_key, RESTORE_FILE_POS_KEY, false) != 0;		
	m_interface_lang_id		= U::QueryIV(m_key, INTERFACE_LANG_KEY, PRIMARYLANGID(GetUserDefaultLangID()));
	m_scripts_folder        = U::QuerySV(m_key, SCRIPTS_FOLDER_KEY, GetDefaultScriptsFolder());
	m_insimage_ask			= U::QueryIV(m_key, INSIMAGE_ASKING, true) != 0;
	m_script_hotkey_err		= U::QueryIV(m_key, SCRIPTS_HKEY_ERR_NTF, true) != 0;
	m_ins_clear_image		= U::QueryIV(m_key, INS_CLEAR_IMAGE, false) != 0;
}

void CSettings::Save()
{
	m_key.SetDWORDValue(KEEP_ENCODING_KEY, m_keep_encoding);
	m_key.SetStringValue(DEFAULT_ENCODING_KEY, m_default_encoding);	
	m_key.SetDWORDValue(SEARCH_OPTIONS_KEY, m_search_options);
	m_key.SetDWORDValue(FBW_HK_KEY, m_fbw_hotkeys);
	m_key.SetDWORDValue(COLOR_BG_KEY, m_collorBG);	
	m_key.SetDWORDValue(COLOR_FG_KEY, m_collorFG);	
	m_key.SetDWORDValue(FONT_SIZE_KEY, m_font_size);	
	m_key.SetDWORDValue(XML_SRC_WRAP_KEY, m_xml_src_wrap);	
	m_key.SetDWORDValue(XML_SRC_SYNTAX_HL_KEY, m_xml_src_syntaxHL);	
	m_key.SetDWORDValue(XML_SRC_SHOW_EOL_KEY, m_xml_src_showEOL);	
	m_key.SetDWORDValue(FAST_MODE_KEY, m_fast_mode);	
	m_key.SetStringValue(FONT_KEY, m_font);
	m_key.SetDWORDValue(VIEW_STATUS_BAR_KEY, m_view_status_bar);
	m_key.SetDWORDValue(VIEW_DOCUMENT_TREE_KEY, m_view_doc_tree);
	m_key.SetDWORDValue(SPLITTER_POS_KEY, m_splitter_pos);
	m_key.SetStringValue(TOOLBARS_SETTINGS_KEY, m_toolbars_settings);		
	m_key.SetDWORDValue(RESTORE_FILE_POS_KEY, m_restore_file_position);
	m_key.SetDWORDValue(INTERFACE_LANG_KEY, m_interface_lang_id);
	m_key.SetStringValue(SCRIPTS_FOLDER_KEY, m_scripts_folder);
	m_key.SetDWORDValue(INSIMAGE_ASKING, m_insimage_ask);
	m_key.SetDWORDValue(SCRIPTS_HKEY_ERR_NTF, m_script_hotkey_err);
	m_key.SetDWORDValue(INS_CLEAR_IMAGE, m_ins_clear_image);
}

bool CSettings::KeepEncoding()const
{
	return m_keep_encoding;
}
bool CSettings::FBWHotkeys()const
{
	return m_fbw_hotkeys;
}
bool CSettings::XmlSrcWrap()const
{
	return m_xml_src_wrap;
}
bool CSettings::XmlSrcSyntaxHL()const
{
	return m_xml_src_syntaxHL;
}
bool CSettings::XmlSrcShowEOL()const
{
	return m_xml_src_showEOL;
}
bool CSettings::FastMode()const
{
	return m_fast_mode;
}
bool CSettings::ViewStatusBar()const
{
	return m_view_status_bar;
}
bool CSettings::ViewDocumentTree()const
{
	return m_view_doc_tree;
}
bool CSettings::RestoreFilePosition()const
{
	return m_restore_file_position;
}
bool CSettings::NeedRestart()const
{
	return m_need_restart;
}


DWORD CSettings::GetSearchOptions()const
{
	return m_search_options;
}
DWORD CSettings::GetFontSize()const
{
	return m_font_size;
}
CString CSettings::GetFont()const
{
	return m_font;
}
DWORD CSettings::GetSplitterPos()const
{
	return m_splitter_pos;
}
CString CSettings::GetToolbarsSettings()const
{
	return m_toolbars_settings;
}
CString CSettings::GetKeyPath()const
{
	return m_key_path;
}
const CRegKey& CSettings::GetKey()const
{
	return m_key;
}
bool CSettings::GetExtElementStyle(const CString& elem)const
{
	return U::QueryIV(m_key, elem, true) != 0;	
}
bool CSettings::GetWindowPosition(WINDOWPLACEMENT &wpl)const
{	
	DWORD		    sz=sizeof(wpl);
	DWORD		    type=REG_BINARY;
	return (::RegQueryValueEx(m_key, WINDOW_POS_KEY,0,&type,(BYTE*)&wpl,&sz)==ERROR_SUCCESS &&
		type==REG_BINARY && sz==sizeof(wpl) && wpl.length==sizeof(wpl));
}
CString CSettings::GetDefaultEncoding()const
{
	return m_default_encoding;
}
DWORD CSettings::GetColorBG()const
{
	return m_collorBG;	
}
DWORD CSettings::GetColorFG()const
{
	return m_collorFG;	
}

DWORD CSettings::GetInterfaceLanguageID()const
{
	return m_interface_lang_id;
}

CString CSettings::GetInterfaceLanguageDllName()const
{
	switch(m_interface_lang_id)
	{
	case LANG_RUSSIAN:
		return L"res_rus.dll";
	default:
		return L"";
	}
}
CString CSettings::GetLocalizedGenresFileName()const
{
	switch(m_interface_lang_id)
	{
	case LANG_RUSSIAN:
		return L"genres.rus.txt";
	default:
		return L"genres.txt";
	}
}

CString CSettings::GetInterfaceLanguageName()const
{
	switch(m_interface_lang_id)
	{
	case LANG_RUSSIAN:
		return L"russian";
	default:
		return L"english";
	}
}

CString CSettings::GetScriptsFolder() const
{
	return m_scripts_folder;
}

CString CSettings::GetDefaultScriptsFolder()
{
  TCHAR filepath[MAX_PATH];
  DWORD pathlen = ::GetModuleFileName(_Module.GetModuleInstance(), filepath, MAX_PATH);
  CString tmp = U::GetFullPathName(filepath);
  int pos = tmp.ReverseFind(_T('\\'));
  if (pos >= 0)
  {
	tmp.Delete(pos, tmp.GetLength() - pos);
	tmp.Append(L"\\");
	tmp.Append(DEFAULT_SCRIPTS_FOLDER);
	tmp.Append(L"\\");
  }

  tmp.MakeLower();

  return tmp;
}

bool CSettings::IsDefaultScriptsFolder()
{
	return GetScriptsFolder() == GetDefaultScriptsFolder();
}

bool CSettings::GetInsImageAsking() const
{
	return m_insimage_ask;
}

bool CSettings::GetScriptsHkErrNotify() const
{
	return m_script_hotkey_err;
}

bool CSettings::GetIsInsClearImage() const
{
	return m_ins_clear_image;
}

bool CSettings::GetDocTreeItemState(const ATL::CString &item, bool default_state)
{
	return U::QueryIV(m_key, item, default_state) != 0;	
}

void CSettings::SetKeepEncoding(bool keep, bool apply)
{
	m_keep_encoding = keep;
	if(apply)
		m_key.SetDWORDValue(KEEP_ENCODING_KEY, m_keep_encoding);		
}
void CSettings::SetSearchOptions(DWORD opt, bool apply)
{
	m_search_options = opt;
	if(apply)
		m_key.SetDWORDValue(SEARCH_OPTIONS_KEY, m_search_options);
}
void CSettings::SetFBWHotkeys(bool fbw_hk, bool apply)
{
	m_fbw_hotkeys = fbw_hk;
	if(apply)
		m_key.SetDWORDValue(FBW_HK_KEY, m_fbw_hotkeys);	
}
void CSettings::SetFontSize(DWORD size, bool apply)
{
	m_font_size = size;
	if(apply)
		m_key.SetDWORDValue(FONT_SIZE_KEY, m_font_size);	
}
void CSettings::SetXmlSrcWrap(bool wrap, bool apply)
{
	m_xml_src_wrap = wrap;
	if(apply)
		m_key.SetDWORDValue(XML_SRC_WRAP_KEY, m_xml_src_wrap);		
}
void CSettings::SetXmlSrcSyntaxHL(bool hl, bool apply)
{
	m_xml_src_syntaxHL = hl;
	if(apply)
		m_key.SetDWORDValue(XML_SRC_SYNTAX_HL_KEY, m_xml_src_syntaxHL);		
}
void CSettings::SetXmlSrcShowEOL(bool eol, bool apply)
{
	m_xml_src_showEOL = eol;
	if(apply)
		m_key.SetDWORDValue(XML_SRC_SHOW_EOL_KEY, m_xml_src_showEOL);		
}
void CSettings::SetFastMode(bool mode,  bool apply)
{
	m_fast_mode = mode;
	if(apply)
		m_key.SetDWORDValue(FAST_MODE_KEY, m_fast_mode);
}
void CSettings::SetFont(const CString& font, bool apply)
{
	m_font = font;
	if(apply)
		m_key.SetStringValue(FONT_KEY, m_font);	
}
void CSettings::SetViewStatusBar(bool view, bool apply)
{
	m_view_status_bar = view;
	if(apply)
		m_key.SetDWORDValue(VIEW_STATUS_BAR_KEY, m_view_status_bar);	
}
void CSettings::SetViewDocumentTree(bool view, bool apply)
{
	m_view_doc_tree = view;
	if(apply)
		m_key.SetDWORDValue(VIEW_DOCUMENT_TREE_KEY, m_view_doc_tree);	
}
void CSettings::SetSplitterPos(DWORD pos, bool apply)
{
	m_splitter_pos = pos;
	if(apply)
		m_key.SetDWORDValue(SPLITTER_POS_KEY, m_splitter_pos);	
}
void CSettings::SetToolbarsSettings(CString& settings, bool apply)
{
	m_toolbars_settings = settings;
	if(apply)
		m_key.SetStringValue(TOOLBARS_SETTINGS_KEY, m_toolbars_settings);	
}
void CSettings::SetExtElementStyle(const CString& elem, bool ext, bool apply)
{
	m_key.SetDWORDValue(elem, ext);	
}
void CSettings::SetWindowPosition(const WINDOWPLACEMENT &wpl, bool apply)
{
	m_key.SetBinaryValue(WINDOW_POS_KEY, (BYTE*)&wpl, sizeof(wpl));	
}
void CSettings::SetDefaultEncoding(const CString &enc, bool apply)
{
	m_default_encoding = enc;
	if(apply)
		m_key.SetStringValue(DEFAULT_ENCODING_KEY, m_default_encoding);	
}
void CSettings::SetColorBG(DWORD col, bool apply)
{
	m_collorBG = col;
	if(apply)
		m_key.SetDWORDValue(COLOR_BG_KEY, m_collorBG);	
}
void CSettings::SetColorFG(DWORD col, bool apply)
{
	m_collorFG = col;
	if(apply)
		m_key.SetDWORDValue(COLOR_FG_KEY, m_collorFG);					
}
void CSettings::SetRestoreFilePosition(bool restore, bool apply)
{
	m_restore_file_position = restore;
	if(apply)
		m_key.SetDWORDValue(RESTORE_FILE_POS_KEY, m_restore_file_position);
}
void CSettings::SetInterfaceLanguage(DWORD lang_id, bool apply)
{
	if(m_interface_lang_id != lang_id)
	{
		m_interface_lang_id = lang_id;
		if(apply)
			m_key.SetDWORDValue(INTERFACE_LANG_KEY, m_interface_lang_id);
	}
}

void CSettings::SetScriptsFolder(const CString fullpath, bool apply)
{
	if(apply)
	{
		if(m_scripts_folder != fullpath)
		{
			m_scripts_folder = fullpath;
		}
	}
}

void CSettings::SetInsImageAsking(bool ask, bool apply)
{
	m_insimage_ask = ask;
	if(apply)
		m_key.SetDWORDValue(INSIMAGE_ASKING, m_insimage_ask);	
}

void CSettings::SetScriptsHkErrNotify(bool notify, bool apply)
{
	m_script_hotkey_err = notify;
	if(apply)
		m_key.SetDWORDValue(SCRIPTS_HKEY_ERR_NTF, m_script_hotkey_err);	
}

void CSettings::SetIsInsClearImage(bool clear, bool apply)
{
	m_ins_clear_image = clear;
	if(apply)
		m_key.SetDWORDValue(INS_CLEAR_IMAGE, m_ins_clear_image);	
}

void CSettings::SetNeedRestart()
{
	m_need_restart = true;
}

void CSettings::SetDocTreeItemState(const ATL::CString &item, bool state)
{
	m_key.SetDWORDValue(item, state);	
}
