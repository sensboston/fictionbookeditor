/*
 * Copyright (c) 2001,2002,2003 Mike Matsnev.  All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions of source code must retain the above copyright
 *    notice immediately at the beginning of the file, without modification,
 *    this list of conditions, and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Absolutely no warranty of function or purpose is made by the author
 *    Mike Matsnev.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 * NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * $Id: ptr.h,v 1.11.4.1 2003/04/12 22:52:34 mike Exp $
 * 
 */

#if !defined(AFX_PTR_H__DE473C69_8A68_4943_B3D7_EE059BE4EB0F__INCLUDED_)
#define AFX_PTR_H__DE473C69_8A68_4943_B3D7_EE059BE4EB0F__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

template <class T> class auto_ptr {
private:
  T* m_ptr;

public:
  explicit auto_ptr(T* p = 0) : m_ptr(p) {}
  auto_ptr(auto_ptr& a) : m_ptr(a.release()) {}
  auto_ptr& operator=(auto_ptr& a) {
    if (&a != this) {
      delete m_ptr;
      m_ptr = a.release();
    }
    return *this;
  }
  auto_ptr& operator=(T *p) {
    if (p != m_ptr) {
      delete m_ptr;
      m_ptr=p;
    }
    return *this;
  }
  ~auto_ptr() { delete m_ptr; }

  T& operator*() const { return *m_ptr; }
  T* operator->() const { return m_ptr; }
  T* get() const { return m_ptr; }
  T* release() { T* tmp = m_ptr; m_ptr = 0; return tmp; }
  void reset(T* p = 0) { delete m_ptr; m_ptr = p; }
};

template<class T>
class Buffer
{
  struct Buf {
    int	    m_refs;
    //T	    *m_data;
  };
  T	    *m_data;
  Buf	    *buf() const { return ((Buf*)m_data)-1; }
  int	    m_size;
  void	    grab() const {
    if (m_data)
      ++buf()->m_refs;
  }
  void	    release() {
    if (m_data) {
      if (--buf()->m_refs==0)
	delete[] buf();
      m_data=0;
    }
  }
public:
  Buffer() : m_data(0), m_size(0) { }
  Buffer(const Buffer& b) : m_data(b.m_data), m_size(b.m_size) { grab(); }
  Buffer(int n) : m_size(n), m_data(0) {
    if (n) {
      m_data=(T*)(new Buf[(sizeof(T)*n+sizeof(Buf)-1)/sizeof(Buf)+1]+1);
      buf()->m_refs=1;
    }
  }
  Buffer(const T *p,int n) : m_size(n), m_data(0) {
    if (n) {
      m_data=(T*)(new Buf[(sizeof(T)*n+sizeof(Buf)-1)/sizeof(Buf)+1]+1);
      buf()->m_refs=1;
      memcpy(m_data,p,sizeof(T)*n);
    }
  }
  ~Buffer() { release(); }
  Buffer<T>& operator=(const Buffer<T>& b) {
    b.grab();
    release();
    m_data=b.m_data;
    m_size=b.m_size;
    return *this;
  }
  operator T*() { return m_data; }
  operator const T*() const { return m_data; }
  int size() const { return m_size; }
  void setsize(int ns) { m_size=ns; }
  void Zero() { memset(m_data,0,m_size*sizeof(T)); }
};

#endif // !defined(AFX_PTR_H__DE473C69_8A68_4943_B3D7_EE059BE4EB0F__INCLUDED_)
