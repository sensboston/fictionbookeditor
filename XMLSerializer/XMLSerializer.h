#pragma once

#include "Serializable.h"
#define DESERIALIZATION_FAIL	-1

class CXMLSerializer
{
public:
	CXMLSerializer(const CString& sFile, const CString& sAppName, bool bLoad);
	~CXMLSerializer();

	void ReadFile();

	void SetFile(const CString&);
	CString GetFile();

	void SetApplicationName(const CString&);
	CString GetApplicationName();

	bool Serialize(ISerializable*);
	bool Serialize(const std::vector<void*>&);
	int Deserialize(IObjectFactory*, ISerializable*, MSXML2::IXMLDOMNode* parent = NULL);
	int Deserialize(IObjectFactory*, std::vector<void*>& objList);

private:
	CString m_sFile;
	CString m_sAppName;

	// MSXML coclasses for reading and writing with indentation
	MSXML2::IXMLDOMDocument2Ptr m_doc;
	MSXML2::ISAXXMLReaderPtr m_rdr;
	MSXML2::IMXWriterPtr m_wrt;

	MSXML2::ISAXContentHandlerPtr m_chdr;
	MSXML2::ISAXDTDHandlerPtr m_dtd;
	MSXML2::ISAXErrorHandlerPtr m_err;

	int InitializeWriters(const CString& encoding, const bool& xmlDeclaration, const bool& bom, const bool& indent);
	bool SaveResults(const _variant_t xml);

	bool GetProperty(MSXML2::IXMLDOMNodePtr, CProperty&);
	bool SetProperty(MSXML2::IXMLDOMNodePtr, const CProperty& property, bool bCreateNewNode = false);
	
	bool SetAttributeValue(MSXML2::IXMLDOMNodePtr, const CString& sAttName, const CString& sValue);
	bool GetAttributeValue(MSXML2::IXMLDOMNodePtr node, const CString& sAttName, CString& sValue);
	
	bool SerializeObject(ISerializable*, MSXML2::IXMLDOMNodePtr parent = NULL);
	
	int DeserializeObject(IObjectFactory*, std::vector<void*>& objList, MSXML2::IXMLDOMNodePtr parent = NULL);
	int DeserializeObject(IObjectFactory*, MSXML2::IXMLDOMNodePtr parent = NULL);
	
	MSXML2::IXMLDOMNodePtr CreateChildNode(const CString& sNodeName, MSXML2::IXMLDOMNodePtr = NULL);
	CString GetPlural(const CString&);
};
