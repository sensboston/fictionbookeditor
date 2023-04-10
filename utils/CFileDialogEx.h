//atlfiledialogex.h 
#pragma once

#ifndef __ATLFILEDIALOGEX_H__
#define __ATLFILEDIALOGEX_H__

#ifndef __cplusplus
    #error ATL requires C++ compilation (use a .cpp suffix)
#endif

#ifndef __ATLAPP_H__
    #error atlfiledialogex.h requires atlapp.h to be included first
#endif

#ifndef __ATLWIN_H__
    #error atlfiledialogex.h requires atlwin.h to be included first
#endif

#ifndef __ATLDLGS_H__
    #error atlfiledialogex.h requires atldlgs.h to be included first
#endif

#ifndef __ATLMISC_H__
    #error atlfiledialogex.h requires atlmisc.h to be included first
#endif

namespace WTL {

#ifndef POSITION
struct __POSITION_ {};
typedef __POSITION_* _POSITION_;
#endif

class CFileDialogEx :
    public CFileDialogImpl<CFileDialogEx>
{
public:
    TCHAR m_szFileName[_MAX_PATH * 1000]; // Потому что по умолчанию маловато будет
    CSimpleArray<CString> m_FileNames;  

    CFileDialogEx(BOOL bOpenFileDialog, 
        LPCTSTR lpszDefExt = NULL,
        LPCTSTR lpszFileName = NULL,
        DWORD dwFlags = OFN_HIDEREADONLY | OFN_OVERWRITEPROMPT,
        LPCTSTR lpszFilter = NULL,
        HWND hWndParent = NULL)
        : CFileDialogImpl<CFileDialogEx>(bOpenFileDialog, lpszDefExt, lpszFileName, dwFlags, lpszFilter, hWndParent)
    { 
        m_szFileName[0] = '\0';
        m_ofn.lpstrFile = m_szFileName;
        m_ofn.nMaxFile = sizeof(m_szFileName); 
    }

    virtual ~CFileDialogEx()
    {
        m_FileNames.RemoveAll();
    }

    const CSimpleArray<CString>& GetFileNames() const
    {
        return m_FileNames;
    }

    _POSITION_ GetStartPosition() const
    {
        return (_POSITION_) m_ofn.lpstrFile;
    }

    CString GetNextPathName(_POSITION_& pos) const
    {
        BOOL bExplorer = m_ofn.Flags & OFN_EXPLORER; // что для WTL завсегда правда
        TCHAR chDelimiter;
        if (bExplorer)
            chDelimiter = '\0';
        else
            chDelimiter = ' ';

        LPTSTR lpsz = (LPTSTR)pos;


        if (lpsz == m_ofn.lpstrFile)
        {
            if ((m_ofn.Flags & OFN_ALLOWMULTISELECT) == 0)
            {
                pos = NULL;
                return m_ofn.lpstrFile;
            }

            while(*lpsz != chDelimiter && *lpsz != '\0')
                lpsz = _tcsinc(lpsz);
            lpsz = _tcsinc(lpsz);

            if (*lpsz == 0)
            {
                pos = NULL;
                return m_ofn.lpstrFile;
            }
        }

        CString strPath = m_ofn.lpstrFile;
        if (!bExplorer)
        {
            LPTSTR lpszPath = m_ofn.lpstrFile;
            while(*lpszPath != chDelimiter)
                lpszPath = _tcsinc(lpszPath);
            strPath = strPath.Left(lpszPath - m_ofn.lpstrFile);
        }

        LPTSTR lpszFileName = lpsz;
        CString strFileName = lpsz;

        while(*lpsz != chDelimiter && *lpsz != '\0')
            lpsz = _tcsinc(lpsz);

        if (!bExplorer && *lpsz == '\0')
            pos = NULL;
        else
        {
            if (!bExplorer)
                strFileName = strFileName.Left(lpsz - lpszFileName);

            lpsz = _tcsinc(lpsz);
            if (*lpsz == '\0') 
                pos = NULL;
            else
                pos = (_POSITION_)lpsz;
        }

        if (!strPath.IsEmpty())
        {
            LPCTSTR lpsz = _tcsrchr(strPath, '\\');
            if (lpsz == NULL)
                lpsz = _tcsrchr(strPath, '/');

            if (lpsz != NULL && (lpsz - (LPCTSTR)strPath) == strPath.GetLength()-1)
            {
                ATLASSERT(*lpsz == '\\' || *lpsz == '/');
                return strPath + strFileName;
            }
        }
        return strPath + '\\' + strFileName;
    }

    INT_PTR DoModal(HWND hWndParent = ::GetActiveWindow())
    {
        INT_PTR rc = CFileDialogImpl<CFileDialogEx>::DoModal(hWndParent);

        if(IDOK == rc)
        {
            m_FileNames.RemoveAll();

            _POSITION_ pos = GetStartPosition();
            while(pos)
            {
                m_FileNames.Add(GetNextPathName(pos));
            }
        }

        return rc;
    }

    DECLARE_EMPTY_MSG_MAP()
};

} // namespace WTL

#endif // __ATLFILEDIALOGEX_H__
 