#pragma once

typedef CSimpleMap<int,CString> CWords;

class CSplitter
{
public:
	CSplitter();
	void Split(CString *src, CWords *words);
protected:
	char isAlpha[0xFFFF];
};