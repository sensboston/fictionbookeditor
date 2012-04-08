#pragma once

typedef bool (*FN_IsMe) (const MSHTML::IHTMLElementPtr elem);
typedef CString (*FN_GetTitle) (const MSHTML::IHTMLElementPtr elem);

class CElementDescriptor
{
private:
	FN_IsMe m_isMe;
	FN_GetTitle m_getTitle;
	CString m_caption;
	int m_imageID;
	bool m_viewInTree;

	// ???? ??? ????????? ????????????
	CString m_script_path;
	CString m_class_name;
	bool m_script;
	HANDLE m_picture;
	int m_pictType;

	bool m_title_from_script;
public:
	CElementDescriptor();

	bool Init(FN_IsMe fn1, FN_GetTitle fn2, int imageID, bool viewInTree_default, CString caption = L"");
	bool Load(CString path);

	virtual bool IsMe(const MSHTML::IHTMLElementPtr elem);
	CString GetTitle(const MSHTML::IHTMLElementPtr elem);

	bool ViewInTree();
	int GetDTImageID();
	CString GetCaption();

	void SetViewInTree(bool view);

	// ?????? ??? ????????? ????????????
	void ProcessScript();
	CString GetClassName();
	bool GetPic(HANDLE& handle, int& type);
	void CleanUp();
	void SetImageID(int ID);	
	
protected:
	MSHTML::IHTMLElementPtr	FindTitleNode(MSHTML::IHTMLDOMNodePtr elem);
 	CString FindTitle(MSHTML::IHTMLDOMNodePtr elem);
	CString GetImageFileName(MSHTML::IHTMLDOMNodePtr elem);

	// ?????? ??? ????????? ????????????
	CString AskClassName();
};

/*class CBodyED : public CElementDescriptor
{
public:
	CBodyED(){};
	bool IsMe(const MSHTML::IHTMLElementPtr elem);
	int GetDTImageID();
	CString GetElementCaption(const MSHTML::IHTMLElementPtr elem);
};

class CSectionED : public CElementDescriptor
{
public:
	bool IsMe(const MSHTML::IHTMLElementPtr elem);
	int GetDTImageID();
	CString GetElementCaption(const MSHTML::IHTMLElementPtr elem);
};

class CImageED : public CElementDescriptor
{
public:
	CImageED(){};
	bool IsMe(const MSHTML::IHTMLElementPtr elem);
	int GetDTImageID();
	CString GetElementCaption(const MSHTML::IHTMLElementPtr elem);
}; 

class CPoemED : public CElementDeascriptor
{
public:
	bool IsMe(const MSHTML::IHTMLElementPtr elem);
	int GetDTImageID();
	CString GetElementCaption(const MSHTML::IHTMLElementPtr elem);
}; */
