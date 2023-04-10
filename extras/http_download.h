/*
    Copyright (C) =USTC= Fu Li

    Author   :  Fu Li
    Create   :  2009-5-20
    Home     :  http://www.uistone.com
    Mail     :  crazybitwps@hotmail.com

    This file is part of UIStone

    The code distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

    Redistribution and use the source code, with or without modification,
    must retain the above copyright.
*/
#pragma once
#include <deque>
#include <assert.h>
#include <map>
#include <Wininet.h>
#pragma comment(lib, "Wininet.lib")
#include <Urlmon.h>
#pragma comment(lib, "Urlmon.lib")

class FCHttpDownload ; // fore declare

//-------------------------------------------------------------------------------------
/**
    Auto object list.
*/
template<class T>
class PCL_Interface_Composite
{
private:
    std::deque<T*>   m_list ;

public:
    virtual ~PCL_Interface_Composite() {PCL_DeleteAllObjects();}

    /**
        @name Add and delete.
    */
    //@{
    /**
        Insert object (created by <B>new</B>) into list, after the object be added, you can't delete it later, \n
        nIndex - position where pObj insert, 0 <= nIndex <= count, add pObj to back if -1.
    */
    void PCL_AddObject (T* pObj, int nIndex=-1)
    {
        if (PCL_GetObjectIndex(pObj) != -1)
        {
            assert(false) ;
        }
        else
        {
            if (nIndex == -1)
            {
                m_list.push_back (pObj) ;
            }
            else
            {
                if ((nIndex >= 0) && (nIndex <= PCL_GetObjectCount()))
                    m_list.insert (m_list.begin()+nIndex, pObj) ;
                else
                    {assert(false);}
            }
        }
    }

    /// Delete all objects in list.
    void PCL_DeleteAllObjects()
    {
        for (size_t i=0 ; i < m_list.size() ; i++)
        {
            T   * p = m_list[i] ;
            if (p)
                delete p ;
        }
        m_list.clear() ;
    }

    /// Delete object from list.
    void PCL_DeleteObject (int nIndex)
    {
        if ((nIndex >= 0) && (nIndex < PCL_GetObjectCount()))
        {
            T   * p = m_list[nIndex] ;
            m_list.erase(m_list.begin() + nIndex) ;
            if (p)
                delete p ;
        }
        else
        {
            assert(false) ;
        }
    }

    /// Delete object from list.
    void PCL_DeleteObject (T* pObj)
    {
        if (pObj)
        {
            PCL_DeleteObject (PCL_GetObjectIndex(pObj)) ;
        }
        assert (PCL_GetObjectIndex(pObj) == -1) ;
    }

    /// Throw objects' ownership, you must delete objects in listObj.
    void PCL_ThrowOwnership (std::deque<T*>& listObj)
    {
        listObj = m_list ;
        m_list.clear() ;
    }
    //@}

    /// Get count of object.
    int PCL_GetObjectCount() const {return (int)m_list.size();}

    /// Get object in list, nIndex is a zero-based index, return NULL if exceed range.
    T* PCL_GetObject (int nIndex) const
    {
        if ((nIndex >= 0) && (nIndex < PCL_GetObjectCount()))
            return m_list[nIndex] ;
        else
            {assert(false); return 0;}
    }

    /// Get zero-based index which pObj in list, return -1 if not found.
    int PCL_GetObjectIndex (const T* pObj) const
    {
        for (size_t i=0 ; i < m_list.size() ; i++)
        {
            if (m_list[i] == pObj)
                return (int)i ;
        }
        return -1 ;
    }
};

//-------------------------------------------------------------------------------------
/**
    Timer notify, all timer object must in same thread.
    destructor will stop running timer.
*/
class FCTimerNotify
{
    UINT_PTR   m_timer_id ;

public:
    FCTimerNotify()
    {
        m_timer_id = 0 ;
        RegisterTimerObject() ;
    }

    virtual ~FCTimerNotify()
    {
        EndTimer() ;
        UnRegisterTimerObject() ;
    }

    /// Is timer started.
    BOOL IsTimerStarted() const
    {
        return (m_timer_id != 0) ;
    }

    /**
        Start timer, if the timer has started, the old timer will be replaced by new timer \n
        nInterval - in milliseconds
    */
    void StartTimer (UINT nInterval)
    {
        assert (!IsTimerStarted()) ;
        EndTimer() ;
        m_timer_id = ::SetTimer (NULL, 0, nInterval, FCTimerNotify::uistone_TimerProc) ; assert(m_timer_id);
        if (m_timer_id)
        {
            (*g_timer_list)[m_timer_id] = this ;
        }
    }

    /// End timer.
    void EndTimer()
    {
        if (m_timer_id)
        {
            g_timer_list->erase(m_timer_id) ;
            ::KillTimer (NULL, m_timer_id) ;
        }
        m_timer_id = 0 ;
    }

protected:
    /// Override to process timer event.
    virtual void OnHandleTimer() =0 ;

private:
    typedef std::map<UINT_PTR, FCTimerNotify*> RunningTimerList;

    static RunningTimerList* g_timer_list ; // map of all timer object
    static int g_timer_count ; // count of timer object

    // object control the life of list to avoid Dead Reference.
    void RegisterTimerObject()
    {
        g_timer_count++ ;
        if (!g_timer_list)
            g_timer_list = new RunningTimerList ;
    }

    void UnRegisterTimerObject()
    {
        g_timer_count-- ;
        if (g_timer_count == 0)
        {
            delete g_timer_list ;
            g_timer_list = NULL ;
        }
    }

    // global timer callback, to dispatch event to timer object.
    static VOID CALLBACK uistone_TimerProc (HWND hwnd, UINT uMsg, UINT_PTR idEvent, DWORD dwTime)
    {
        if (!g_timer_list)
            return ;
        RunningTimerList::iterator   iter = g_timer_list->find(idEvent) ;
        if (iter == g_timer_list->end())
            return ;

        iter->second->OnHandleTimer() ;
    }
};

__declspec(selectany) FCTimerNotify::RunningTimerList* FCTimerNotify::g_timer_list = NULL ;
__declspec(selectany) int FCTimerNotify::g_timer_count = 0 ;

//-------------------------------------------------------------------------------------
/**
    Http send request header info.
*/
struct HTTP_SEND_HEADER
{
    /// url to download.
    CString   m_url ;

    /// start position of download, in byte, default is 0, a range field will be added to http request header if it is not 0.
    int   m_start ;

    /// default is same to IE.
    CString   m_user_agent ;

    /// header field, default is empty, don't include range field if you have set m_start member.
    CString   m_header ;

    /// param dwFlags of Win32API InternetOpenUrl, default is <B>INTERNET_FLAG_RELOAD | INTERNET_FLAG_NO_CACHE_WRITE</B>.
    DWORD   m_open_flag ;

    /// proxy server IP.
    CString   m_proxy_ip ;

    /// proxy server port, default is 80.
    int   m_proxy_port ;

    /// user name to login the proxy if need.
    CString   m_proxy_username ;

    /// password to login the proxy if need.
    CString   m_proxy_password ;

    HTTP_SEND_HEADER()
    {
        m_start = 0 ;
        m_user_agent = GetSystemUserAgent() ;
        m_open_flag = INTERNET_FLAG_RELOAD | INTERNET_FLAG_NO_CACHE_WRITE ;
        m_proxy_port = 80 ;
    }

    /// Get user-agent used by IE.
    static CString GetSystemUserAgent()
    {
        DWORD  n = 1024 ;
        char   t[1024] = {0} ;
        ObtainUserAgentString (0, t, &n) ;
        return CString(t) ;
    }
};

//-------------------------------------------------------------------------------------
/**
    Http response header info.
*/
struct HTTP_RESPONSE_INFO
{
    /// status code, such as: HTTP_STATUS_OK / HTTP_STATUS_PARTIAL_CONTENT / HTTP_STATUS_NOT_FOUND, is 0 if can't connect.
    int   m_status_code ;

    /// Content-Length field, 0 if this field not exist.
    int   m_content_length ;

    /// Last-Modified field, empty if this field not exist.
    CString   m_last_modified ;

    /// software used by the server, such as: Apache, Microsoft-IIS/6.0.
    CString   m_server ;

    /// only valid in FCHttpDownloadManager::OnAfterDownloadFinish callback, the last read result before download finish.
    BOOL   m_final_read_result ;

    HTTP_RESPONSE_INFO()
    {
        m_status_code = 0 ;
        m_content_length = 0 ;
        m_request = NULL ;
    }

    void SetResponse (HINTERNET hRequest)
    {
        m_request = hRequest ;
        if (hRequest)
        {
            CString   s = QueryInfo(HTTP_QUERY_STATUS_CODE) ;
            if (s.GetLength())
                m_status_code = _ttoi(s) ;
            s = QueryInfo(HTTP_QUERY_CONTENT_LENGTH) ;
            if (s.GetLength())
                m_content_length = _ttoi(s) ;
            m_last_modified = QueryInfo(HTTP_QUERY_LAST_MODIFIED) ;
            m_server = QueryInfo(HTTP_QUERY_SERVER) ;
        }
    }

    /// Refer to param dwInfoLevel of Win32 API <B>HttpQueryInfo</B>.
    CString QueryInfo (DWORD dwInfoLevel) const
    {
        CString  s ;
        DWORD    dwLen = 0 ;
        if (!::HttpQueryInfo (m_request, dwInfoLevel, NULL, &dwLen, 0) && dwLen)
        {
            void   * buf = malloc(dwLen + 2) ;
            ZeroMemory (buf, dwLen + 2) ;
            ::HttpQueryInfo (m_request, dwInfoLevel, buf, &dwLen, 0) ;
            s = (LPCTSTR)buf ;
            free(buf) ;
        }
        return s ;
    }

private:
    HINTERNET   m_request ;
};

//-------------------------------------------------------------------------------------
// Download event message queue.
class FIDownloadMessageQueue
{
public:
    enum DOWNLOAD_MSG_TYPE
    {
        DOWNLOAD_MSG_CONNECTED,
        DOWNLOAD_MSG_FINISH,
    };

    FIDownloadMessageQueue()
    {
        m_timer.m_this = this ;
        m_in_timer_proc = FALSE ;
    }
    virtual ~FIDownloadMessageQueue() {}

    // because of use post method, so we need pass task id, not task pointer
    void PostDownloadMessage (DOWNLOAD_MSG_TYPE nType, int nTaskID)
    {
        m_msg_queue.push_back (std::pair<DOWNLOAD_MSG_TYPE, int>(nType, nTaskID)) ;
        m_timer.Start() ;
    }

protected:
    virtual void OnHandleDownloadMessage (DOWNLOAD_MSG_TYPE nType, int nTaskID) =0 ;

private:
    void OnTimerGetMessage()
    {
        if (m_in_timer_proc)
            return ;

        m_in_timer_proc = TRUE ;
        // process message
        while (m_msg_queue.size())
        {
            std::pair<DOWNLOAD_MSG_TYPE, int>   m = m_msg_queue.front() ;
            m_msg_queue.pop_front() ;
            OnHandleDownloadMessage (m.first, m.second) ;
        }
        m_in_timer_proc = FALSE ;
    }

    class CTimerGetMessage : public FCTimerNotify
    {
        virtual void OnHandleTimer()
        {
            EndTimer() ;
            m_this->OnTimerGetMessage() ;
        }
    public:
        FIDownloadMessageQueue   * m_this ;
        void Start()
        {
            if (!IsTimerStarted())
                StartTimer(50) ;
        }
    };

    CTimerGetMessage   m_timer ;
    BOOL   m_in_timer_proc ; // avoid user pop a dialog block timer proc.
    std::deque<std::pair<DOWNLOAD_MSG_TYPE, int> >   m_msg_queue ; // type <--> task ID
};

//-------------------------------------------------------------------------------------
/**
    Execute http download task.
*/
class FCHttpDownload
{
private:
    class FCAutoCSec
    {
        CRITICAL_SECTION   m_cs ;
    public:
        FCAutoCSec() {InitializeCriticalSection (&m_cs) ;}
        virtual ~FCAutoCSec() {DeleteCriticalSection (&m_cs) ;}
        void Lock() {EnterCriticalSection(&m_cs);}
        void UnLock() {LeaveCriticalSection(&m_cs);}
    };

    // buffer to auto grow for read url data
    class CReceiveBuffer : public FCAutoCSec
    {
        enum
        {
            GLOW_MEM_SIZE = 128 * 1024,
        };
        int   m_max_size ;
    public:

        // these member must protect by Lock/UnLock.
        BYTE  * m_pBuf ;
        int   m_current_length ;

    public:
        CReceiveBuffer()
        {
            m_max_size = GLOW_MEM_SIZE ;
            m_pBuf = (BYTE*)malloc(m_max_size) ;
            m_current_length = 0 ;
        }
        ~CReceiveBuffer()
        {
            free(m_pBuf) ;
        }

        void Write (const void* p, int nLen)
        {
            Lock() ;
            if (m_current_length + nLen > m_max_size)
            {
                // grow memory
                m_max_size += GLOW_MEM_SIZE ;
                m_pBuf = (BYTE*)realloc (m_pBuf, m_max_size) ;
            }
            CopyMemory (m_pBuf + m_current_length, p, nLen) ;
            m_current_length += nLen ;
            UnLock() ;
        }
    };

    // calculate download speed.
    class CCalculateSpeed : public FCAutoCSec, public FCTimerNotify
    {
        int    m_current_speed ;
        int    m_block_len ;
        int    m_total_read ;
        INT64  m_start_tick ;
        INT64  m_end_tick ;
        INT64  m_last_tick ;

        static int CalcSpeed (INT64 nByte, INT64 nBegin, INT64 nEnd)
        {
            INT64   n = nEnd - nBegin ;
            if (n < 0)
            {
                n = 0xFFFFFFFFi64 - nBegin + nEnd ; // overflow
            }
            if (n == 0)
            {
                n = 100 ;
            }
            return (int)(1000 * nByte / n) ;
        }
    public:
        CCalculateSpeed()
        {
            m_current_speed = 0 ;
            m_block_len = 0 ;
            m_total_read = 0 ;
            m_start_tick = m_last_tick = GetTickCount() ;
            m_end_tick = -1 ;
            StartTimer (1000) ;
        }
        int GetCurrentSpeed()
        {
            Lock() ;
            int   n = m_current_speed ;
            UnLock() ;
            return n ;
        }
        int GetAverageSpeed()
        {
            int   n ;
            Lock() ;
            if (m_end_tick != -1)
            {
                n = CalcSpeed (m_total_read, m_start_tick, m_end_tick) ;
            }
            else
            {
                n = CalcSpeed (m_total_read, m_start_tick, GetTickCount()) ;
            }
            UnLock() ;
            return n ;
        }
        int GetDownloadByte()
        {
            Lock() ;
            int   n = m_total_read ;
            UnLock() ;
            return n ;
        }
        void Add (int nAddByte)
        {
            Lock() ;
            m_block_len += nAddByte ;
            m_total_read += nAddByte ;
            UnLock() ;
        }
        void Finish()
        {
            Lock() ;
            m_end_tick = GetTickCount() ;

            if (!m_current_speed)
            {
                m_current_speed = CalcSpeed (m_block_len, m_last_tick, m_end_tick) ;
            }
            UnLock() ;
        }
        virtual void OnHandleTimer()
        {
            // calculate current speed
            Lock() ;
            if (m_end_tick != -1)
            {
                EndTimer() ;
            }
            else
            {
                m_current_speed = CalcSpeed (m_block_len, m_last_tick, GetTickCount()) ;
                m_last_tick = GetTickCount() ;
                m_block_len = 0 ;
            }
            UnLock() ;
        }
    };

private:
    // raise connected event.
    class CTimerConnected : public FCTimerNotify
    {
        virtual void OnHandleTimer() { m_this->OnTimerConnected(); }
    public:
        FCHttpDownload   * m_this ;
        void Start() { StartTimer(200); }
    };

    // raise finish event.
    class CTimerFinish : public FCTimerNotify
    {
        virtual void OnHandleTimer() { m_this->OnTimerFinish(); }
    public:
        FCHttpDownload   * m_this ;
        void Start() { StartTimer(200); }
    };

    void OnTimerConnected()
    {
        if (WaitForSingleObject(m_connect_thread, 0) == WAIT_OBJECT_0)
        {
            CloseHandle(m_connect_thread) ;
            m_connect_thread = NULL ;
            m_connect_timer.EndTimer() ;

            // set response info
            m_response_info.SetResponse (m_request) ;

            // callback
            if (m_event_observer)
                m_event_observer->PostDownloadMessage (FIDownloadMessageQueue::DOWNLOAD_MSG_CONNECTED, m_id) ;

            // start read thread
            m_read_timer.Start() ;
            m_read_thread = ::CreateThread (NULL, 0, http_read_proc, this, 0, NULL) ;
        }
    }

    void OnTimerFinish()
    {
        if (WaitForSingleObject(m_read_thread, 0) == WAIT_OBJECT_0)
        {
            DWORD   dwLastReadResult = 0 ;
            GetExitCodeThread (m_read_thread, &dwLastReadResult) ;
            m_response_info.m_final_read_result = (BOOL)dwLastReadResult ;

            CloseHandle(m_read_thread) ;
            m_read_thread = NULL ;
            m_read_timer.EndTimer() ;

            if (m_event_observer)
                m_event_observer->PostDownloadMessage (FIDownloadMessageQueue::DOWNLOAD_MSG_FINISH, m_id) ;
        }
    }

private:
    int   m_id ;
    HTTP_SEND_HEADER   m_task_info ;

    HTTP_RESPONSE_INFO  m_response_info ;
    CCalculateSpeed     m_calculate_speed ;
    CReceiveBuffer      m_read_buf ;
    FIDownloadMessageQueue   * m_event_observer ;

    HINTERNET   m_session ;
    HINTERNET   m_request ;

    CTimerConnected  m_connect_timer ;
    CTimerFinish     m_read_timer ;

    HANDLE   m_connect_thread ;
    HANDLE   m_read_thread ;

public:
    // Constructor begin download.
    FCHttpDownload (const HTTP_SEND_HEADER& task_info, int nTaskID, FIDownloadMessageQueue* pObserver)
    {
        m_id = nTaskID ;
        m_task_info = task_info ;
        m_event_observer = pObserver ;

        m_connect_timer.m_this = this ;
        m_read_timer.m_this = this ;

        if (task_info.m_proxy_ip.GetLength())
        {
            CString   s ;
            s.Format(_T("%s:%d"), task_info.m_proxy_ip, task_info.m_proxy_port) ;
            m_session = InternetOpen (task_info.m_user_agent, INTERNET_OPEN_TYPE_PROXY, s, NULL, 0) ;
        }
        else
        {
            m_session = InternetOpen (task_info.m_user_agent, INTERNET_OPEN_TYPE_PRECONFIG, NULL, NULL, 0) ;
        }
        m_request = NULL ;

        // set proxy username and password
        if (task_info.m_proxy_username.GetLength())
            ::InternetSetOption (m_session, INTERNET_OPTION_PROXY_USERNAME, (LPVOID)(LPCTSTR)task_info.m_proxy_username, task_info.m_proxy_username.GetLength()) ;
        if (task_info.m_proxy_password.GetLength())
            ::InternetSetOption (m_session, INTERNET_OPTION_PROXY_PASSWORD, (LPVOID)(LPCTSTR)task_info.m_proxy_password, task_info.m_proxy_password.GetLength()) ;

        m_connect_timer.Start() ;

        m_connect_thread = ::CreateThread (NULL, 0, http_connect_proc, this, 0, NULL) ;
        m_read_thread = NULL ;
    }

    // Destructor stop download and free resource.
    virtual ~FCHttpDownload()
    {
        // stop all event monitor.
        m_connect_timer.EndTimer() ;
        m_read_timer.EndTimer() ;

        // wait all thread exit.
        if (m_connect_thread)
        {
            InternetCloseHandle (m_session) ;
            m_session = NULL ;
            WaitForSingleObject (m_connect_thread, INFINITE) ;
            CloseHandle (m_connect_thread) ;
        }
        else
        {
            if (m_read_thread)
            {
                InternetCloseHandle (m_request) ;
                m_request = NULL ;
                WaitForSingleObject (m_read_thread, INFINITE) ;
                CloseHandle (m_read_thread) ;
            }
        }
        if (m_request)
            InternetCloseHandle (m_request) ;
        if (m_session)
            InternetCloseHandle (m_session) ;
    }

    /// Get download url.
    CString GetURL() const {return m_task_info.m_url;}
    /// Get http send request info.
    const HTTP_SEND_HEADER& GetSendHeader() const {return m_task_info;}
    /// Get response info.
    const HTTP_RESPONSE_INFO& GetResponseInfo() const {return m_response_info;}
    /// Get task ID, the ID is assigned by system and used to unique identify the task.
    int GetTaskID() const {return m_id;}
    /// Total downloaded bytes.
    int GetDownloadByte() const {return const_cast<FCHttpDownload*>(this)->m_calculate_speed.GetDownloadByte();}
    /// Get current download speed, unit is : byte / second.
    int GetCurrentSpeed() const {return const_cast<FCHttpDownload*>(this)->m_calculate_speed.GetCurrentSpeed();}
    /// Get average download speed from start to now, unit is : byte / second.
    int GetAverageSpeed() const {return const_cast<FCHttpDownload*>(this)->m_calculate_speed.GetAverageSpeed();}
    /**
        Popup received data from download buffer of task \n
        pBuffer - the received buffer with 2-byte 0 followed, so you can convert to string directly \n\n
        user must use <span style='color:#FF0000'>delete[] pBuffer</span> to free buffer when received pBuffer not NULL \n\n
        Received data will be stored in inner memory buffer of download task object, so it's totally okay for small files, \n
        but for some very big file, such: 500Mb, 1Gb, it will take up large memory, so you need create a timer to loop call this function \n\n
        typical, there are two ways to use it : \n
        ( 1 ) create a timer, loop call in timer callback to get all data, this way are high recommended when file is very big \n
        ( 2 ) call in FCHttpDownloadManager::OnAfterDownloadFinish once to get all data
    */
    void PopReceived (BYTE*& pBuffer, int& nLength)
    {
        m_read_buf.Lock() ;
        pBuffer = NULL ;
        nLength = m_read_buf.m_current_length ;
        if (nLength)
        {
            pBuffer = new BYTE[nLength + 2] ; // easy to convert string
            ZeroMemory (pBuffer, nLength + 2) ;
            CopyMemory (pBuffer, m_read_buf.m_pBuf, nLength) ;
        }
        m_read_buf.m_current_length = 0 ;
        m_read_buf.UnLock() ;
    }

private:
    // connect to server.
    static DWORD WINAPI http_connect_proc (LPVOID lpParameter)
    {
        FCHttpDownload   * p = (FCHttpDownload*)lpParameter ;

        // range header
        CString   s = p->m_task_info.m_header ;
        if (p->m_task_info.m_start)
        {
            CString   h ;
            h.Format(_T("Range: bytes=%d-\r\n"), p->m_task_info.m_start) ;
            s = h + s ;
        }

        p->m_request = InternetOpenUrl (p->m_session, p->m_task_info.m_url, s, s.GetLength(), p->m_task_info.m_open_flag, 0) ;
        return 0 ;
    }

    // start read data loop.
    static DWORD WINAPI http_read_proc (LPVOID lpParameter)
    {
        FCHttpDownload   * p = (FCHttpDownload*)lpParameter ;

        int     BUFFER_LEN = 8 * 1024 ;
        void    * buf = malloc (BUFFER_LEN) ;
        DWORD   dwReadResult ;
        while (true)
        {
            DWORD   dw = 0 ;
            dwReadResult = (DWORD)InternetReadFile (p->m_request, buf, BUFFER_LEN, &dw) ;

            // calculate speed
            p->m_calculate_speed.Add((int)dw) ;

            if (dwReadResult && dw)
            {
                p->m_read_buf.Write (buf, (int)dw) ;
            }
            else
            {
                break ;
            }
        }
        p->m_calculate_speed.Finish() ;
        free(buf) ;
        return dwReadResult ;
    }
};


//-------------------------------------------------------------------------------------
/**
    Manage http download.
*/
 class FCHttpDownloadManager : private FIDownloadMessageQueue
{
protected:
    /**
        @name Event callback.
        these callback default do nothing.
    */
    //@{
    /**
        Callback on after connected to server.
    */
    virtual void OnAfterDownloadConnected (FCHttpDownload* pTask) {}
    /**
        Callback on after download finish \n
        after this callback, system will delete this download task.
    */
    virtual void OnAfterDownloadFinish (FCHttpDownload* pTask) {}
    //@}

public:
    FCHttpDownloadManager() : m_current_task_id(0) {}
    virtual ~FCHttpDownloadManager() {}

    /// Add a new download, return task ID.
    int AddDownload (const HTTP_SEND_HEADER& task_info)
    {
        FCHttpDownload   * pTask = new FCHttpDownload (task_info, ++m_current_task_id, this) ;
        m_list.PCL_AddObject(pTask) ;
        return pTask->GetTaskID() ;
    }

    /// Add a new download, return task ID.
    int AddDownload (LPCTSTR strUrl)
    {
        HTTP_SEND_HEADER   t ;
        t.m_url = strUrl ;
        return AddDownload(t) ;
    }

    /// Find download, return NULL if not found.
    FCHttpDownload* FindDownload (int nTaskID) const
    {
        int   n = FindTaskIndex(nTaskID) ;
        return ((n == -1) ? NULL : m_list.PCL_GetObject(n)) ;
    }

    /// Delete download.
    void DeleteDownload (int nTaskID)
    {
        int   n = FindTaskIndex(nTaskID) ;
        if (n != -1)
        {
            m_list.PCL_DeleteObject(n) ;
        }
    }

    /// Delete all download.
    void DeleteAllDownload()
    {
        m_list.PCL_DeleteAllObjects() ;
    }

    /// Get all download.
    void GetAllDownload (std::deque<FCHttpDownload*>& task_list) const
    {
        task_list.clear() ;
        for (int i=0 ; i < m_list.PCL_GetObjectCount() ; i++)
        {
            task_list.push_back (m_list.PCL_GetObject(i)) ;
        }
    }

    /// Get count of download.
    int GetDownloadCount() const {return m_list.PCL_GetObjectCount();}

private:
    int   m_current_task_id ;
    PCL_Interface_Composite<FCHttpDownload>   m_list ;

    int FindTaskIndex (int nTaskID) const
    {
        for (int i=0 ; i < m_list.PCL_GetObjectCount() ; i++)
        {
            if (m_list.PCL_GetObject(i)->GetTaskID() == nTaskID)
                return i ;
        }
        return -1 ;
    }

    virtual void OnHandleDownloadMessage (DOWNLOAD_MSG_TYPE nType, int nTaskID)
    {
        // because is post message, so we must ensure task exist
        int   nIndex = FindTaskIndex(nTaskID) ;
        if (nIndex == -1)
            return ;

        FCHttpDownload   * pTask = m_list.PCL_GetObject(nIndex) ;

        switch (nType)
        {
            case FIDownloadMessageQueue::DOWNLOAD_MSG_CONNECTED :
                OnAfterDownloadConnected(pTask) ;
                break;
            case FIDownloadMessageQueue::DOWNLOAD_MSG_FINISH :
                OnAfterDownloadFinish(pTask) ;
                DeleteDownload(nTaskID) ;
                break;
        }
    }
};
