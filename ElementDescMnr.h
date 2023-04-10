#pragma once

#include "ElementDescriptor.h"

class CElementDescMnr
{
private:
	CSimpleArray<CElementDescriptor*> m_stEDs;
	CSimpleArray<CElementDescriptor*> m_EDs;

private:
	// ????????? ?????????? ??????????? ? ???????? ????????????
	CElementDescMnr(const CElementDescMnr&);
	CElementDescMnr& operator=(const CElementDescMnr&);

protected:
	bool m_initedStEDs;

public:
	CElementDescMnr();
	bool GetElementDescriptor(const MSHTML::IHTMLElementPtr elem, CElementDescriptor **desc)const;
	void AddElementDescriptor(CElementDescriptor *desc);
	bool InitStandartEDs();
	bool InitScriptEDs();
	int GetStEDsCount();
	int GetEDsCount();
	CElementDescriptor* GetStED(int index);
	CElementDescriptor* GetED(int index);
	void CleanUpAll();
	bool IsInitedStEDs();
	void CleanTree();
};
