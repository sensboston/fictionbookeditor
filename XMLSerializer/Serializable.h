#pragma once

#include <vector>

enum PropertyType
{
	Blank,
	Simple,
	SimpleList,
	Complex,
	ComplexList
};

class CProperty;

class ISerializable
{
public:
	virtual ~ISerializable(){};
	virtual int GetProperties(std::vector<CString>& properties) = 0;
	virtual bool GetPropertyValue(const CString& sProperty, CProperty& sValue) = 0;
	virtual bool SetPropertyValue(const CString& sProperty, CProperty& sValue) = 0;

	virtual bool HasMultipleInstances() = 0;
	virtual CString GetClassName() = 0;
	virtual CString GetID() = 0;
};

class IObjectFactory
{
public:
	virtual ISerializable* Create() = 0; // Factory function
	virtual void Destroy(ISerializable*) = 0;

};

class CProperty
{
public:
	static void CopyStringList(std::vector<CString>& dst, const std::vector<CString>& src)
	{
		dst.clear();
		dst = src;
	}

	static void CopyPtrList(std::vector<void*>& dst, const std::vector<void*>& src)
	{
		dst.clear();
		dst = src;
	}
	
	CProperty(IObjectFactory* factory = NULL)
	{
		m_object	= NULL;
		m_type		= Blank;
		m_factory	= factory;
	}

	CProperty(const CString& sName) : m_sDefValue(L"")
	{
		m_sName = sName;
	}

	CProperty(const CString& sName, const CString& sValue)
	{
		m_sName		= sName;
		m_sValue	= sValue;
		m_object	= NULL;
		m_type		= Simple;
	}

	CProperty(const CString& sName, ISerializable* object)
	{
		m_sName		= sName;
		m_object	= object;
		m_type		= Complex;
	}

	IObjectFactory* GetFactory() const
	{
		return m_factory;
	}

	void SetFactory(IObjectFactory* factory)
	{
		m_factory = factory;
	}

	CString GetName() const
	{
		return m_sName;
	}

	void SetName(const CString& sValue)
	{
		m_sName = sValue;
	}

	CString GetStringValue() const
	{
		return m_sValue;
	}

	ISerializable* GetObject() const
	{
		return m_object;
	}

	std::vector<CString>& GetStringList()
	{
		return m_values;
	}

	std::vector<void*>& GetObjectList()
	{
		return m_objects;
	}

	CProperty& operator=(const CString& rhs)
	{
		m_sValue = rhs;
		m_object = NULL;
		m_type	 = Simple;
		return *this;
	}

	CProperty& operator=(const std::vector<CString>& rhs)
	{
		CopyStringList(m_values, rhs);
		m_object = NULL;
		m_type	 = SimpleList;
		return *this;
	}

	CProperty& operator=(const std::vector<void*>& rhs)
	{
		CopyPtrList(m_objects, rhs);
		m_object = NULL;
		m_type	 = ComplexList;
		return *this;
	}

	CProperty& operator=(ISerializable* rhs)
	{
		m_sValue = _T("");
		m_object = rhs;
		m_type	 = Complex;
		return *this;
	}
	
	operator CString() const
	{
		return m_sValue;
	}

	operator ISerializable*() const
	{
		return m_object;
	}

	PropertyType GetType() const
	{
		return m_type;
	}
	
	void SetType(PropertyType type)
	{
		m_type = type;
	}

	CString GetTypeString() const
	{
		CString sType;

		switch(m_type)
		{
		case Blank:
			sType = _T("Blank");
			break;

		case Simple:
			sType = _T("Simple");
			break;

		case SimpleList:
			sType = _T("SimpleList");
			break;

		case Complex:
			sType = _T("Complex");
			break;

		case ComplexList:
			sType = _T("ComplexList");
			break;

		default:
			sType = "Blank";
		}

		return sType;
	}

	static PropertyType Parse(const CString& sType)
	{
		PropertyType type = Blank;

		if(sType == _T("Simple"))
			type = Simple;
		else if(sType == _T("SimpleList"))
			type = SimpleList;
		else if(sType == _T("Complex"))
			type = Complex;
		else if(sType == _T("ComplexList"))
			type = ComplexList;
		
		return type;
	}	

	CString m_sDefValue; // Default value provided on wrong deserialization

private:
	PropertyType m_type;
	CString m_sName;
	CString m_sValue; // single simple (string )value
	ISerializable* m_object; // string complex value
	std::vector<CString> m_values;	// list of simple (string) values
	std::vector<void*> m_objects;	// list of complex values
	IObjectFactory* m_factory;
};
