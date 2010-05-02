#pragma once

typedef CSimpleMap<int,CString> CWords;

class CSplitter
{
public:
	CSplitter();
	CSplitter(const CString isAlphaExceptions);
	void Split(CString *src, CWords *words);
protected:
	char isAlpha[0xFFFF];
	void Init();
};