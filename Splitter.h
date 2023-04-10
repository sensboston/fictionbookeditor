#pragma once

typedef CSimpleMap<int,CString> CWords;

class CSplitter
{
public:
	CSplitter();
	CSplitter(const CString isAlphaExceptions);
	void Split(CString *src, CWords *words);
	CString AlphaExceptions() { return m_isAlphaExceptions; }
protected:
	char isAlpha[0xFFFF];
	void Init();
	CString m_isAlphaExceptions;
};