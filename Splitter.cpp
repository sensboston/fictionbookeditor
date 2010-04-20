#include "stdafx.h"
#include "Splitter.h"

CSplitter::CSplitter()
{
	// prepare cache array
	for (int i=0; i<0xFFFF; i++)
		isAlpha[i] = iswalpha(i);
}

void CSplitter::Split(CString src, CWords* words)
{
	int j=0;
	CString word;
	words->RemoveAll();
	for (int i=0; i<src.GetLength(); i++)
		if (!isAlpha[src[i]])
		{
			word = src.Mid(j, i-j).Trim();
			if (!word.IsEmpty()) words->Add(j,word);
			j=i+1;
		}
}