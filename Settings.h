#pragma once

#include "utils.h"

/*const int ILANG_ENGLISH = 0;
const int ILANG_RUSSIAN = 1;*/

class CSettings
{
	CRegKey		m_key;
	CString		m_key_path;

	bool		m_keep_encoding;		// флаг обозначает, что при сохранениии будут сохраняться кодировка,
										// в которой был открыт документ.
	CString		m_default_encoding;

	DWORD		m_search_options;
	bool		m_fbw_hotkeys;

	DWORD		m_collorBG;
	DWORD		m_collorFG;
	DWORD		m_font_size;
	CString		m_font;

	bool		m_xml_src_wrap;
	bool		m_xml_src_syntaxHL;
	bool		m_xml_src_showEOL;	

	bool		m_fast_mode;
	bool		m_view_status_bar;
	bool		m_view_doc_tree;

	DWORD		m_splitter_pos;
	CString		m_toolbars_settings;

	bool		m_restore_file_position;

	DWORD		m_interface_lang_id;

	bool		m_need_restart;

	CString		m_scripts_folder;

	bool		m_insimage_ask;
	bool		m_script_hotkey_err;
	bool		m_ins_clear_image;

public:
	CSettings();
	~CSettings();
	void Init();
	void Close();
	void Load();
	void Save();

	bool NeedRestart()const;

	bool KeepEncoding()const;
	bool FBWHotkeys()const;
	bool XmlSrcWrap()const;
	bool XmlSrcSyntaxHL()const;
	bool XmlSrcShowEOL()const;
	bool FastMode()const;
	bool ViewStatusBar()const;
	bool ViewDocumentTree()const;
	bool RestoreFilePosition()const;

	CString GetKeyPath()const;

	CString GetDefaultEncoding()const;
	DWORD	GetSearchOptions()const;
	DWORD	GetColorBG()const;
	DWORD	GetColorFG()const;
	DWORD	GetFontSize()const;
	CString	GetFont()const;
	DWORD	GetSplitterPos()const;	
	CString GetToolbarsSettings()const;
	const CRegKey& GetKey()const;
	bool	GetExtElementStyle(const CString& elem)const;
	bool	GetWindowPosition(WINDOWPLACEMENT& wpl)const;
	DWORD GetInterfaceLanguageID()const;
	CString GetInterfaceLanguageDllName()const;
	CString GetLocalizedGenresFileName()const;
	CString GetInterfaceLanguageName()const;
	CString GetScriptsFolder() const;
	CString GetDefaultScriptsFolder();
	bool	IsDefaultScriptsFolder();
	bool	GetInsImageAsking()const;
	bool	GetScriptsHkErrNotify()const;
	bool    GetIsInsClearImage()const;

	void	SetKeepEncoding(bool keep, bool apply = false);
	void	SetDefaultEncoding(const CString& encoding, bool apply = false);	
	void	SetSearchOptions(DWORD opt, bool apply = false);
	void	SetFBWHotkeys(bool fbw_hk, bool apply = false);
	void	SetColorBG(DWORD color, bool apply = false);
	void	SetColorFG(DWORD color, bool apply = false);
	void	SetFontSize(DWORD size, bool apply = false);
	void	SetXmlSrcWrap(bool wrap, bool apply = false);
	void	SetXmlSrcSyntaxHL(bool hl, bool apply = false);
	void	SetXmlSrcShowEOL(bool eol, bool apply = false);
	void	SetFastMode(bool mode,  bool apply = false);
	void	SetFont(const CString& font, bool apply = false);
	void	SetViewStatusBar(bool view,  bool apply = false);
	void	SetViewDocumentTree(bool view,  bool apply = false);
	void	SetSplitterPos(DWORD pos,  bool apply = false);
	void	SetToolbarsSettings(CString& settings,  bool apply = false);
	void	SetExtElementStyle(const CString& elem, bool ext, bool apply = false);
	void	SetWindowPosition(const WINDOWPLACEMENT& wpl,  bool apply = false);
	void	SetRestoreFilePosition(bool restore, bool apply = false);	
	void	SetInterfaceLanguage(DWORD Language, bool apply = false);
	void	SetScriptsFolder(const CString fullpath, bool apply = false);
	void	SetInsImageAsking(const bool value, bool apply = false);
	void	SetScriptsHkErrNotify(const bool value, bool apply = false);
	void	SetIsInsClearImage(const bool value, bool apply = false);

	void	SetNeedRestart();

	CString	m_initial_scripts_folder;
};