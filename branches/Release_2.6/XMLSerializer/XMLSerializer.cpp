#include "stdafx.h"
#include "utils.h"

const wchar_t* XML_SAVE_ENCODING = L"utf-8";

CXMLSerializer::CXMLSerializer(const CString& sFile, const CString& sAppName, bool bLoad)
{
	try
	{
		m_doc.CreateInstance(__uuidof(MSXML2::DOMDocument40));

		SetFile(sFile);
		SetApplicationName(sAppName);

		if(bLoad)
		{
			ReadFile();
		}
		else
		{
			MSXML2::IXMLDOMNodePtr rootnode = CreateChildNode(m_sAppName);
			m_doc->appendChild(rootnode);
		}
	}
	catch(_com_error& err)
	{
		U::ReportError(err);
	}
}

 CXMLSerializer::~CXMLSerializer()
{
	if(!m_sFile.IsEmpty())
	try {
		_bstr_t bsFile(m_sFile);
		m_doc->save(bsFile);
	}
	catch(_com_error& err)
	{
		U::ReportError(err);
	}
	m_doc = NULL;
}

void CXMLSerializer::ReadFile()
{
	_bstr_t bsFile(m_sFile);
	m_doc->load(bsFile);
}

void CXMLSerializer::SetFile(const CString& sValue)
{
	m_sFile = sValue;
}

CString CXMLSerializer::GetFile()
{
	return m_sFile;
}

void CXMLSerializer::SetApplicationName(const CString& sValue)
{
	m_sAppName = sValue;
}

CString CXMLSerializer::GetApplicationName()
{
	return m_sAppName;
}

CString CXMLSerializer::GetPlural(const CString& sWord)
{
	CString sResult;
	TCHAR ch = sWord.GetAt(sWord.GetLength() - 1);
	
	if(ch == _T('s') || ch == _T('S'))
		sResult.Format(_T("%ses"), sWord);
	/*else if(ch == _T('y') || ch == _T('Y'))
		sResult.Format(_T("%sies"), sWord);*/
	else
		sResult.Format(_T("%ss"), sWord);

	return sResult;
}

int CXMLSerializer::InitializeWriters(const CString& encoding, const bool& xmlDeclaration, const bool& bom, const bool& indent)
{
	try
	{
		if(!SUCCEEDED(m_rdr.CreateInstance(__uuidof(MSXML2::SAXXMLReader40))))
			return E_FAIL;
		if(!SUCCEEDED(m_wrt.CreateInstance(__uuidof(MSXML2::MXXMLWriter40))))
			return E_FAIL;

		m_wrt->byteOrderMark = bom;
		m_wrt->omitXMLDeclaration = !xmlDeclaration;
		m_wrt->indent = indent;
		m_wrt->encoding = encoding.AllocSysString();

		m_chdr = m_wrt;
		m_dtd = m_wrt;
		m_err = m_wrt;

		m_rdr->putContentHandler(m_chdr);
		m_rdr->putDTDHandler(m_dtd);
		m_rdr->putErrorHandler(m_err);

		m_rdr->putProperty(L"http://xml.org/sax/properties/lexical-handler", m_wrt.GetInterfacePtr());
		m_rdr->putProperty(L"http://xml.org/sax/properties/declaration-handler", m_wrt.GetInterfacePtr());
	}
	catch (_com_error& err)
	{
		U::ReportError(err);
		return E_FAIL;
	}

	return S_OK;
}

bool CXMLSerializer::SaveResults(const _variant_t xml)
{
	if(InitializeWriters(XML_SAVE_ENCODING, true, true, true) != S_OK)
		return false;

	if(m_rdr->parse(xml) != S_OK)
		return false;

	if(m_doc->loadXML(_bstr_t(m_wrt->output)) == S_FALSE)
		return false;
	
	MSXML2::IXMLDOMNamedNodeMapPtr nodeMap = m_doc->firstChild->attributes;
	MSXML2::IXMLDOMAttributePtr encAttrib = m_doc->createAttribute(L"encoding");
	encAttrib->text = m_wrt->encoding;
	nodeMap->setNamedItem(encAttrib);
	nodeMap->removeNamedItem(L"standalone");

	if(m_doc->save(_bstr_t(m_sFile)) != S_OK)
		return false;

	return true;
}

bool CXMLSerializer::SerializeObject(ISerializable* obj, MSXML2::IXMLDOMNodePtr parent)
{
	if(obj == NULL)
		return false;

	CString sClass	= obj->GetClassName();			// e.g. <contact>
	CString sId		= obj->GetID();					// e.g. <contact id="1">
	bool	bMulti	= obj->HasMultipleInstances();	// if multiple instances has
													// to be stored
	
	// lets check if the object has already been persisted
	_bstr_t bsXPath;
	CString sPath;
	CString sOuterNodeName;
	MSXML2::IXMLDOMNodePtr node;
	MSXML2::IXMLDOMNodePtr refnode = parent;

	if(bMulti)
	{
		// do some english lang processing for getting the plural form
		sOuterNodeName = GetPlural(sClass);
		
		// e.g. <contacts>
		//			<contact>
		if(parent == NULL)
		{
			// reference is the root
			sPath.Format(_T("/%s/%s/%s[id='%s']"), m_sAppName, sOuterNodeName, sClass, sId);
		}
		else
		{
			// reference is the parent node
			sPath.Format(_T("%ss/%s[id='%s']"), sOuterNodeName, sClass, sId);
		}
	}
	else
	{
		// e.g. <contact>
		if(parent == NULL)
		{
			// reference is the root
			sPath.Format(_T("/%s/%s[id='%s']"), m_sAppName, sClass, sId);
		}
		else
		{
			// reference is the parent node
			sPath.Format(_T("%s[id='%s']"), sClass, sId);
		}
	}

	bsXPath = sPath;

	MSXML2::IXMLDOMNodePtr rootnode = m_doc->firstChild;
	MSXML2::IXMLDOMNodePtr outernode; // e.g. <contacts>

	if(refnode == NULL)
	{
		// since no reference node is present, the reference node is the 
		// root node.
		refnode = rootnode;
	}
	
	if(NULL == refnode)
	{
		// this is probably a brand new document without any contents
		refnode = CreateChildNode(m_sAppName, rootnode);
		m_doc->appendChild(refnode);
	}

	_bstr_t xml = refnode->xml;
	node = refnode->selectSingleNode(bsXPath);

	if(node == NULL)
	{
		// it is possible that the parent node e.g. <contacts> itself is
		// not there. We need to create it.
		if(bMulti)
		{
			CString sOuterNodeName;

			sOuterNodeName = sClass + _T("s"); // e.g. contact+s = contacts
			sPath.Format(_T("//%s/ %s"), m_sAppName, sOuterNodeName);
			bsXPath = sPath;
			
			outernode = refnode->selectSingleNode(bsXPath);

			if(outernode == NULL)
			{
				// this node does not exist, we need to create it
				outernode = CreateChildNode(sOuterNodeName, rootnode);
				refnode->appendChild(outernode);
			}
		}
	}

	std::vector<CString> props;
	CProperty	property;
	CString		sProperty;
	CString		sValue;
	int			nProps;
	int			nIndex;
	
	nProps = obj->GetProperties(props); // property count

	for(nIndex = 0; nIndex < nProps; nIndex++)
	{
		sProperty = props[nIndex];
		property.SetName(sProperty);

		if(obj->GetPropertyValue(sProperty, property))
		{
			// create the node if NULL
			if(node == NULL)
			{
				// this is the entity node e.g. <contact>
				if(bMulti == false)
				{
					node = CreateChildNode(sClass, refnode);
				}
				else
				{
					node = CreateChildNode(sClass, outernode);
				}

				// set the ID attribute
				if(!sId.IsEmpty())
				{
					SetAttributeValue(node, _T("ID"), sId);
				}
			}

			switch(property.GetType())
			{
			case Simple:
				sValue = property.GetStringValue();
				SetProperty(node, property); // persist sValue in the xml
				break;

			case SimpleList:
				{
					// first we create the outer node e.g. <phonenumbers>
					CString sOuterNodeName = GetPlural(sProperty);
					std::vector<CString>& values = property.GetStringList();
					MSXML2::IXMLDOMNodePtr outernode;
			
					// attach the outernode
					outernode = CreateChildNode(sOuterNodeName, node);
					node->appendChild(outernode);
					
					// iterate through all the list of values and store them
					for(unsigned int nIndex = 0; nIndex < values.size(); nIndex++)
					{
						sValue = values[nIndex];
						CProperty singleprop(sProperty, sValue);
						SetProperty(outernode, singleprop, true); // true means
						// we want a new node to be created
					}
				}
				break;
			
			case Complex:
				SerializeObject(property.GetObject(), node);
				break;
			
			case ComplexList:
				{
					// first we create the outer node e.g. <phonenumbers>
					CString sOuterNodeName = GetPlural(sProperty);
					std::vector<void*>& values = property.GetObjectList();
					MSXML2::IXMLDOMNodePtr outernode;
			
					// attach the outernode
					outernode = CreateChildNode(sOuterNodeName, node);
					node->appendChild(outernode);
					
					// iterate through all the list of values and store them
					for(unsigned int nIndex = 0; nIndex < values.size(); nIndex++)
					{
						ISerializable* pObject = (ISerializable*)values[nIndex];
						CProperty singleprop(sProperty, pObject);
						SerializeObject(pObject, outernode);
					}
				}
				break;
			}
		}
	}

	return true;
}
//------------------------------------------------------------------------------

// Serializes a single object.
bool CXMLSerializer::Serialize(ISerializable* obj)
{
	return SerializeObject(obj) && SaveResults(m_doc->xml);
}
//------------------------------------------------------------------------------

// Serialized a list of objects.
bool CXMLSerializer::Serialize(const std::vector<void*>& objects)
{
	bool bResult = true;

	for(unsigned int pos = 0; pos < objects.size(); ++pos)
		bResult = SerializeObject((ISerializable*)objects[pos]);

	return bResult && SaveResults(m_doc->xml);
}

int CXMLSerializer::Deserialize(IObjectFactory* factory, ISerializable* obj, MSXML2::IXMLDOMNode* parent)
{
	ATLASSERT(factory != NULL);
	if(NULL == factory)
	{
		return DESERIALIZATION_FAIL;
	}

	// create an empty instance of the object to de-serializable
	ISerializable* pEmptyObject = factory->Create(); // this needs to to be
	// destroyed

	ATLASSERT(pEmptyObject != NULL);
	if(NULL == pEmptyObject)
	{
		factory->Destroy(pEmptyObject);
		return DESERIALIZATION_FAIL;
	}

	CString		sClass = pEmptyObject->GetClassName();
	CString		sPath;
	CString		sId = pEmptyObject->GetID();
	CString		sPropName;
	CString		sPropValue;
	CString		sPropType;
	std::vector<CString> sProps;
	int			nProperties;
	int			nObjects = 0;

	nProperties = pEmptyObject->GetProperties(sProps);

	if(nProperties == 0)
	{
		factory->Destroy(pEmptyObject);
		return 0;
	}

	bool		bMulti = pEmptyObject->HasMultipleInstances();
	_bstr_t		bsXPath;

	if(bMulti)
	{
		// e.g. <contacts>
		//			<contact>
		if(parent == NULL)
		{
			// reference is root
			sPath.Format(_T("//%s/%ss/%s"), m_sAppName, sClass, sClass);
		}
		else
		{
			// reference is parent node
			sPath.Format(_T("%ss/%s"), sClass, sClass);
		}
	}
	else
	{
		// e.g. <contact> 
		if(parent == NULL)
		{
			// reference is root
			sPath.Format(_T("//%s/%s[@ID='%s']"), m_sAppName, sClass, sId);
		}
		else
		{
			// reference is parent node
			sPath.Format(_T("%s"), sClass);
		}
	}

	bsXPath = sPath;
	MSXML2::IXMLDOMNodePtr refnode;
	MSXML2::IXMLDOMNodeListPtr nodes;

	if(NULL == parent)
	{
		MSXML2::IXMLDOMNodePtr firstChild = m_doc->firstChild;
		refnode = firstChild ? firstChild->nextSibling : firstChild;
	}
	else
	{
		refnode = parent;
	}

	if(NULL == refnode)
	{
		return 0; // even the parent node does not exist
		// This is not an error, all it means is that
		// no such objects have beecn deserialized
	}

	//_bstr_t val = refnode->nodeValue;
	nodes = refnode->selectNodes(bsXPath);

	if(nodes == NULL)
	{
		factory->Destroy(pEmptyObject);
		return 0;
	}

	int nLength = nodes->Getlength();

	// loop for iterating over the class nodes e.g. <contact>
	for(int nIndex = 0; nIndex < nodes->Getlength(); nIndex++)
	{
		MSXML2::IXMLDOMNodePtr node = nodes->Getitem(nIndex);

		if(node != NULL)
		{
			GetAttributeValue(node, _T("ID"), sId); // get the ID

			// loop through all the properties
			for(int nPropIndex = 0; nPropIndex < nProperties; nPropIndex++)
			{
				sPropName = sProps[nPropIndex];

				CProperty property(sPropName);

				if(obj->GetPropertyValue(sPropName, property))
				{
					switch(property.GetType())
					{
					case Simple:
						if(GetProperty(node, property))
						{
							obj->SetPropertyValue(sPropName, property);
						}
						break;

					case SimpleList:
						if(GetProperty(node, property))
						{
							obj->SetPropertyValue(sPropName, property);
						}

						break;

					case Complex:
						{
							// get a list of new objects for the complex object at hand
							std::vector<void*> list;
							DeserializeObject(property.GetFactory(), list, node);

							// note: newly created object are present in the list. These object
							// will be destroyed by the outer class which will accept these 
							// objects as a property-value. In case the outer class wants to
							// hold on to these objects, they can do so and destroy them later.
							// The outer object class might also decide to immediately destroy
							// the passed in object. This is true only for Complex types.

							// iterate through the complex objects and add them to the previous
							// (parent) object
							for(unsigned int n = 0; n < list.size(); n++)
							{
								CProperty newproperty;
								newproperty.SetFactory(property.GetFactory());
								newproperty = (ISerializable*)list[n];

								// update the parent
								// the parent is now responsible for the object lifetime
								obj->SetPropertyValue(sPropName, newproperty);
							}
						}
						break;

					case ComplexList:
						{
							// first locate the outernode, then walk over the subnodes
							// get a list of new objects for each complex object at hand
							CString sOuterNode = GetPlural(sPropName);
							MSXML2::IXMLDOMNodeListPtr subnodes;
							MSXML2::IXMLDOMNodePtr complexnode;
							bsXPath = sOuterNode;

							subnodes = node->selectNodes(bsXPath);

							if(NULL == subnodes)
							{
								break;
							}

							for(int n = 0; n < subnodes->Getlength(); n++)
							{
								complexnode = subnodes->Getitem(n);
								std::vector<void*> list;
								DeserializeObject(property.GetFactory(), list, complexnode);

								CProperty newproperty(sPropName);
								newproperty.SetFactory(property.GetFactory());
								newproperty = list;
								obj->SetPropertyValue(sPropName, newproperty);
							}
						} // case ComplexList
						break;
					} // switch
				}
			}

			nObjects++;
		}
	}
	factory->Destroy(pEmptyObject);

	return nObjects;
}

// Returns number of items deserialized. In case of fatal error, returns 
// DESERIALIZATION_FAIL. Created objects are added to the objList
int CXMLSerializer::DeserializeObject(IObjectFactory* factory, std::vector<void*>& objList, MSXML2::IXMLDOMNodePtr parent)
{
	ATLASSERT(factory != NULL);
	if(NULL == factory)
	{
		return DESERIALIZATION_FAIL;
	}

	// create an empty instance of the object to de-serializable
	ISerializable* pEmptyObject = factory->Create(); // this needs to to be
													 // destroyed

	ATLASSERT(pEmptyObject != NULL);
	if(NULL == pEmptyObject)
	{
		factory->Destroy(pEmptyObject);
		return DESERIALIZATION_FAIL;
	}

	CString		sClass = pEmptyObject->GetClassName();
	CString		sPath;
	CString		sId = pEmptyObject->GetID();
	CString		sPropName;
	CString		sPropValue;
	CString		sPropType;
	std::vector<CString> sProps;
	int			nProperties;
	int			nObjects = 0;
		
	nProperties = pEmptyObject->GetProperties(sProps);

	if(nProperties == 0)
	{
		factory->Destroy(pEmptyObject);
		return 0;
	}

	bool		bMulti = pEmptyObject->HasMultipleInstances();
	_bstr_t		bsXPath;

	if(bMulti)
	{
		// e.g. <contacts>
		//			<contact>
		if(parent == NULL)
		{
			// reference is root
			sPath.Format(_T("//%s/%ss/%s"), m_sAppName, sClass, sClass);
		}
		else
		{
			// reference is parent node
			sPath.Format(_T("%ss/%s"), sClass, sClass);
		}
	}
	else
	{
		// e.g. <contact> 
		if(parent == NULL)
		{
			// reference is root
			sPath.Format(_T("//%s/%s[@ID='%s']"), m_sAppName, sClass, sId);
		}
		else
		{
			// reference is parent node
			sPath.Format(_T("%s"), sClass);			
		}
	}

	bsXPath = sPath;
	MSXML2::IXMLDOMNodePtr	  refnode;
	MSXML2::IXMLDOMNodeListPtr nodes;

	if(NULL == parent)
	{
		MSXML2::IXMLDOMNodePtr firstChild = m_doc->firstChild;
		refnode = firstChild ? firstChild->nextSibling : firstChild;
	}
	else
	{
		refnode = parent;
	}

	if(NULL == refnode)
	{
		return 0; // even the parent node does not exist
				  // This is not an error, all it means is that
				  // no such objects have beecn deserialized
	}

	//_bstr_t val = refnode->nodeValue;
	nodes = refnode->selectNodes(bsXPath);
	
	if(nodes == NULL)
	{
		factory->Destroy(pEmptyObject);
		return 0;
	}

	int nLength = nodes->Getlength();
	
	// loop for iterating over the class nodes e.g. <contact>
	for(int nIndex = 0; nIndex < nodes->Getlength(); nIndex++)
	{
		MSXML2::IXMLDOMNodePtr node = nodes->Getitem(nIndex);

		if(node != NULL)
		{
			ISerializable* pObj = factory->Create();
		
			GetAttributeValue(node, _T("ID"), sId); // get the ID

			// loop through all the properties
			for(int nPropIndex = 0; nPropIndex < nProperties; nPropIndex++)
			{
				sPropName = sProps[nPropIndex];
			
				CProperty property(sPropName);

				if(pObj->GetPropertyValue(sPropName, property))
				{
					switch(property.GetType())
					{
					case Simple:
						if(GetProperty(node, property))
						{
							pObj->SetPropertyValue(sPropName, property);
						}
						break;

					case SimpleList:
						if(GetProperty(node, property))
						{
							pObj->SetPropertyValue(sPropName, property);
						}

						break;

					case Complex:
						{
						// get a list of new objects for the complex object at hand
							std::vector<void*> list;
						DeserializeObject(property.GetFactory(), list, node);

						// note: newly created object are present in the list. These object
						// will be destroyed by the outer class which will accept these 
						// objects as a property-value. In case the outer class wants to
						// hold on to these objects, they can do so and destroy them later.
						// The outer object class might also decide to immediately destroy
						// the passed in object. This is true only for Complex types.
						
						// iterate through the complex objects and add them to the previous
						// (parent) object
						for(unsigned int n = 0; n < list.size(); n++)
						{
							CProperty newproperty;
							newproperty.SetFactory(property.GetFactory());
							newproperty = (ISerializable*)list[n];
							
							// update the parent
							// the parent is now responsible for the object lifetime
							pObj->SetPropertyValue(sPropName, newproperty);
						}
						}
						break;

					case ComplexList:
						{
						// first locate the outernode, then walk over the subnodes
						// get a list of new objects for each complex object at hand
						CString sOuterNode = GetPlural(sPropName);
						MSXML2::IXMLDOMNodeListPtr subnodes;
						MSXML2::IXMLDOMNodePtr complexnode;
						bsXPath = sOuterNode;
						
						subnodes = node->selectNodes(bsXPath);

						if(NULL == subnodes)
						{
							break;
						}
						
						for(int n = 0; n < subnodes->Getlength(); n++)
						{
							complexnode = subnodes->Getitem(n);
							std::vector<void*> list;
							DeserializeObject(property.GetFactory(), list, complexnode);

							CProperty newproperty(sPropName);
							newproperty.SetFactory(property.GetFactory());
							newproperty = list;
							pObj->SetPropertyValue(sPropName, newproperty);
						}
						} // case ComplexList
						break;
					} // switch
				}
			}
			
			objList.push_back(pObj);
			nObjects++;
		}
	}
	factory->Destroy(pEmptyObject);
	return nObjects;
}
//------------------------------------------------------------------------------

// Returns number of items deserialized. In case of fatal error, returns 
// DESERIALIZATION_FAIL. Created objects are added to the objList
int CXMLSerializer::Deserialize(IObjectFactory* factory, std::vector<void*>& objList)
{
	return DeserializeObject(factory, objList, NULL);
}
//------------------------------------------------------------------------------

// If a parentnode is supplied, it will create a new node and add it as a child
// node of the parent node. If parentnode is NULL, it will create a new node and
// return it. Imp: accept the returned node and Release it.
MSXML2::IXMLDOMNodePtr CXMLSerializer::CreateChildNode(const CString& sNodeName, MSXML2::IXMLDOMNodePtr parent)
{	
	MSXML2::IXMLDOMNodePtr node;
	
	_variant_t vtType(MSXML2::NODE_ELEMENT);
	_bstr_t bsNode(sNodeName);
	_bstr_t bsNamespace;

	node = m_doc->createNode(vtType, bsNode, bsNamespace);

	if(node == NULL)
	{
		return NULL;
	}

	if(parent != NULL)
	{
		parent->appendChild(node);
	}
	
	node->AddRef();
	
	return node;
}
//------------------------------------------------------------------------------

// Pass a node pointer, property name & property value. e.g. <student> and 
// property is fname, will read text value from <fname> under student. 
// Also works for string lists.
bool CXMLSerializer::GetProperty(MSXML2::IXMLDOMNodePtr node, CProperty& property)
{
	ATLASSERT(node != NULL);
	if(node == NULL)
	{
		return false;
	}

	CString						sNodeName;
	MSXML2::IXMLDOMNodePtr		propnode;	// property node
	MSXML2::IXMLDOMNodeListPtr	subnodes;	// only for lists
	std::vector<CString>		pList;		// only for lists
	_bstr_t						bsXPath;	
	_bstr_t						bsValue;
	CString						sPropType;
	CString						sValue;
	PropertyType				type;

	ISerializable* pComplexProperty = NULL;
	type = property.GetType();

	switch(type)
	{
	case Simple:
		bsXPath = property.GetName();
		propnode = node->selectSingleNode(bsXPath);

		if(propnode == NULL)
		{
			return false;
		}
		
		//if(!GetAttributeValue(propnode, _T("Type"), sPropType))
		//	return false;

		bsValue = propnode->Gettext();
		property = (LPCTSTR)bsValue;
		
		return true;

	case SimpleList:
		sNodeName = GetPlural(property.GetName());
		bsXPath = sNodeName;
		subnodes = node->selectNodes(bsXPath);
		
		pList = property.GetStringList();

		if(subnodes != NULL)
		{
			MSXML2::IXMLDOMNodePtr singlenode;
							
			for(int n = 0; n < subnodes->Getlength(); n++)
			{
				singlenode = subnodes->Getitem(n);
				bsValue =  singlenode->Gettext();
				pList.push_back((LPCTSTR)bsValue);
			}
		}
		return true;
		break;
	
	default:
		return false;
	}
}
//------------------------------------------------------------------------------	

// Pass a node pointer, property name & property value. Will create the property
// node if required. e.g. <student> and property is fname, will create <fname>
// under student if needed and set the text value to the passed in value.
bool CXMLSerializer::SetProperty(MSXML2::IXMLDOMNodePtr node,
								const CProperty& property,
								bool bCreateNewNode)
{
	ATLASSERT(node != NULL);
	if(NULL == node)
	{
		return false;
	}

	CString sProp = property.GetName();
	MSXML2::IXMLDOMNodePtr		propnode;	// property node
	CString						sValue = property;
	_bstr_t						bsXPath(sProp);	
	_bstr_t						bsValue(sValue);
	
	if(false == bCreateNewNode)
	{
		// node existence checking is done only if the function was
		// told NOT to enforce new node creation
		propnode = node->selectSingleNode(bsXPath);
	}

	if(NULL == propnode)
	{
		// this node does not exists, we need to create it
		_variant_t	vtType(MSXML2::NODE_ELEMENT);
		_bstr_t		bsNode(sProp);
		_bstr_t		bsNamespace;

		propnode = m_doc->createNode(vtType, bsNode, bsNamespace);

		ATLASSERT(propnode != NULL);
		if(propnode == NULL)
		{
			return false;
		}
		
		node->appendChild(propnode); // attach the node

		// this is not really required
		//SetAttributeValue(propnode, _T("Type"), property.GetTypeString());
	}
	
	
	propnode->Puttext(bsValue);

	return true;
}
//------------------------------------------------------------------------------

bool CXMLSerializer::SetAttributeValue(MSXML2::IXMLDOMNodePtr node, 
								  const CString& sAttName, 
								  const CString& sValue)
{
	ATLASSERT(node != NULL);
	if(node == NULL)
	{
		return false;
	}

	try
	{
        MSXML2::IXMLDOMNodePtr attnode;
						
		_bstr_t		bsNode(sAttName);
		_bstr_t		bsValue(sValue);

		attnode = m_doc->createAttribute(bsNode);
			
		ATLASSERT(attnode != NULL);
		if(attnode == NULL)
		{
			return false;
		}
		
		attnode->Puttext(bsValue);
		node->Getattributes()->setNamedItem(attnode);
		
		return true;	
	}
	catch(_com_error& err)
	{
		U::ReportError(err);
		return false;
	}
	catch(...)
	{
		return false;
	}
}
//------------------------------------------------------------------------------

bool CXMLSerializer::GetAttributeValue(MSXML2::IXMLDOMNodePtr node, const CString& sAttName, CString& sValue)
{
	ATLASSERT(node != NULL);
	if(node == NULL)
	{
		return false;
	}

	try
	{
		MSXML2::IXMLDOMNodePtr attnode;
		MSXML2::IXMLDOMNamedNodeMapPtr attributes;

		_bstr_t		bsName(sAttName);
		_bstr_t		bsValue(sValue);

		attributes = node->Getattributes();

		if(attributes == NULL)
		{
			return false;
		}

		attnode = attributes->getNamedItem(bsName);
		if(attnode == NULL)
		{
			return false;
		}
		
		bsValue = attnode->Gettext();
		sValue	= (LPCTSTR)bsValue;
		
		return true;
	}
	catch(_com_error& err)
	{
		U::ReportError(err);
		return false;
	}
	catch(...)
	{
		return false;
	}
}
