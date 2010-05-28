#include "stdafx.h"
#include "Splitter.h"

CSplitter::CSplitter()
{
	Init();
}

CSplitter::CSplitter(const CString isAlphaExceptions)
{
	Init();
	for (int i=0; i<isAlphaExceptions.GetLength(); i++)
		isAlpha[isAlphaExceptions[i]] = 1;
}

void CSplitter::Init()
{
	// prepare cache array
	for (int i=0; i<0xFFFF; i++)
		isAlpha[i] = iswalpha(i) | iswdigit(i);
}

void CSplitter::Split(CString *src, CWords *words)
{
	int j=0, size = src->GetLength();
	words->RemoveAll();
	for (int i=0; i<size; i++)
	{
		if (!isAlpha[src->GetAt(i)])
		{
			if (i-j) words->Add(j,src->Mid(j, i-j));
			j=i+1;
		}
	}
}