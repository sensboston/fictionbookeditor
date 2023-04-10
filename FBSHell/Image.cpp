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
 * $Id: Image.cpp,v 1.12.2.7 2003/09/21 12:07:35 mike Exp $
 * 
 */

// XXX handle out of memory exceptions gracefully

#include "StdAfx.h"

extern "C" {
  #include <jpeglib.h>
  #include <jerror.h>
  #include <png.h>
};

#define	INBUF_SIZE    4096

// supported bitmap formats
enum {
  BF_UNKNOWN,
  BF_565,
  BF_555,
  BF_888
};

struct GXDisplayProperties {
	DWORD cxWidth;
	DWORD cyHeight;			// notice lack of 'th' in the word height.
	long cbxPitch;			// number of bytes to move right one x pixel - can be negative.
	long cbyPitch;			// number of bytes to move down one y pixel - can be negative.
	long cBPP;				// # of bits in each pixel
	DWORD ffFormat;			// format flags.
};

#define kfDirect555	0x40		// 5 bits each for red, green and blue values in a pixel.
#define kfDirect565	0x80		// 5 red bits, 6 green bits and 5 blue bits per pixel
#define kfDirect888	0x100		// 8 bits each for red, green and blue values in a pixel.
#define kfDirect444	0x200		// 4 red, 4 green, 4 blue

typedef unsigned char u8;
typedef unsigned int u32;
typedef signed int s32;
typedef unsigned short u16;

static u8   gamma_table[256];

static void	set_gamma(double image_gamma) {
  double    disp_gamma=1.8;
  if (disp_gamma<1)
    disp_gamma=1;
  if (disp_gamma>5)
    disp_gamma=5;
  double    g=1/(image_gamma*disp_gamma);
  int	    i;

  for (i=0;i<256;++i)
    gamma_table[i]=((int)(pow(i/256.0,g)*256.0));
}

// returns resized line with pixels scaled by inw
static void	resize_line_plain(u8 *in,u32 inw,u32 *out,u32 outw,u8 * /* bg */) {
  u32	  inptr=0; // input pixel position inside the output pixel
  u32	  outptr=inw;
  u8	  *top=in+inw*3; // pixel after the last

  out[0]=out[1]=out[2]=0; // initialize first output pixel
  do { // for each input pixel
    if (inptr+outw>outptr) { // input pixel crosses two output pixels
      // red
      out[0] += in[0] * (outptr - inptr); // add to current pixel
      out[3] = in[0] * (outw - (outptr - inptr)); // and initialize the next one
      // green
      out[1] += in[1] * (outptr - inptr); // add to current pixel
      out[4] = in[1] * (outw - (outptr - inptr)); // and initialize the next one
      // blue
      out[2] += in[2] * (outptr - inptr); // add to current pixel
      out[5] = in[2] * (outw - (outptr - inptr)); // and initialize the next one
      // advance to next pixel
      out += 3;
      outptr += inw;
    } else { // completely contained
      out[0] += in[0] * outw;
      out[1] += in[1] * outw;
      out[2] += in[2] * outw;
    }
    in+=3; // next input pixel
    inptr+=outw;
  } while (in<top);
}

// returns resized line with pixels scaled by inw
static void	resize_line_alpha(u8 *in,u32 inw,u32 *out,u32 outw,u8 *bg) {
  u32	  inptr=0; // input pixel position inside the output pixel
  u32	  outptr=inw;
  u8	  *top=in+inw*4; // pixel after the last
  u8	  pval; // current pixel value
  u8	  transp;
  u8	  opacity;

  out[0]=out[1]=out[2]=0; // initialize first output pixel
  do { // for each input pixel
    opacity = in[3];
    transp = 255 - in[3];
    if (inptr+outw>outptr) { // input pixel crosses two output pixels
      // red
      pval = (in[0]*opacity + bg[0]*transp)>>8;
      out[0] += pval * (outptr - inptr); // add to current pixel
      out[3] = pval * (outw - (outptr - inptr)); // and initialize the next one
      // green
      pval = (in[1]*opacity + bg[1]*transp)>>8;
      out[1] += pval * (outptr - inptr); // add to current pixel
      out[4] = pval * (outw - (outptr - inptr)); // and initialize the next one
      // blue
      pval = (in[2]*opacity + bg[2]*transp)>>8;
      out[2] += pval * (outptr - inptr); // add to current pixel
      out[5] = pval * (outw - (outptr - inptr)); // and initialize the next one
      // advance to next pixel
      out += 3;
      outptr += inw;
    } else { // completely contained
      out[0] += ((in[0]*opacity + bg[0]*transp) * outw) >> 8;
      out[1] += ((in[1]*opacity + bg[1]*transp) * outw) >> 8;
      out[2] += ((in[2]*opacity + bg[2]*transp) * outw) >> 8;
    }
    in+=4; // next input pixel
    inptr+=outw;
  } while (in<top);
}

struct imagestore {
  HBITMAP bmp;

  u8	  *bits;
  int	  hstep;
  int	  vstep;
  u32	  width;
  u32	  height;
  u32	  realwidth;
  u32	  realheight;
  int	  bmformat;
  void	  (*packbits)(imagestore *is,u8* src);
};

struct resize_state {
  u32	  *accum;
  u32	  *lb;
  s32	  *error;
  s32	  *nexterror;
  u32	  inptr;
  u32	  outptr;
  u8	  *dest;
  u32	  inw,inh;
  u32	  outw,outh;
  u32	  outscale;
  u32	  inscale;
  s32	  max;
  u32	  mask[3];
  u32	  *membuf;
  int	  odd;
  u8	  bg[4]; // background color for transparent images
  // we store a function pointer here to handle transparency properly
  void	  (*resize_line)(u8 *in,u32 inw,u32 *out,u32 outw,u8 *bg);
  imagestore  *output;
};

static void	packbits_24_to_15(imagestore *is,u8 *src) {
  u32	  i;
  u8	  *bits=is->bits;
  s32	  hstep=is->hstep;
  u32	  width=is->width;

  for (i=0;i<width;++i) {
    *(u16*)bits=((u16)(gamma_table[src[0]]&0xF8)<<7)|
      ((u16)(gamma_table[src[1]]&0xF8)<<2)|
      (gamma_table[src[2]]>>3);
    src+=3;
    bits+=hstep;
  }
  is->bits+=is->vstep;
}

static void	packbits_24_to_16(imagestore *is,u8 *src) {
  u32	  i;
  u8	  *bits=is->bits;
  s32	  hstep=is->hstep;
  u32	  width=is->width;

  for (i=0;i<width;++i) {
    *(u16*)bits=((u16)(gamma_table[src[0]]&0xF8)<<8)|
      ((u16)(gamma_table[src[1]]&0xFC)<<3)|
      (gamma_table[src[2]]>>3);
    src+=3;
    bits+=hstep;
  }
  is->bits+=is->vstep;
}

static void	packbits_24_to_24(imagestore *is,u8 *src) {
  u32	  i;
  u8	  *bits=is->bits;
  s32	  hstep=is->hstep;
  u32	  width=is->width;

  for (i=0;i<width;i++) {
    bits[0]=gamma_table[src[2]];
    bits[1]=gamma_table[src[1]];
    bits[2]=gamma_table[src[0]];
    src+=3;
    bits+=hstep;
  }
  is->bits+=is->vstep;
}

static bool resize_state_init(resize_state *rs,u32 iinw,u32 iinh,imagestore *iout)
{
  rs->output=iout;
  rs->inw=iinw;
  rs->inh=iinh;
  rs->outw=iout->width;
  rs->outh=iout->height;
  u32 *p=(u32*)malloc(sizeof(u32)*13*(rs->outw+2));
  if (!p)
    return false;
  memset(p,0,sizeof(u32)*(6*rs->outw+6*(rs->outw+2)+rs->outw));
  rs->membuf=p;
  rs->odd=0;
  switch (iout->bmformat) {
  case BF_555:
    rs->mask[0]=rs->mask[1]=rs->mask[2]=0xfffffff8;
    break;
  case BF_565:
    rs->mask[0]=0xfffffff8;
    rs->mask[1]=0xfffffffc;
    rs->mask[2]=0xfffffff8;
    break;
  case BF_888:
    rs->mask[0]=rs->mask[1]=rs->mask[2]=0xffffffff;
    break;
  }
  rs->inptr=0;
  rs->outptr=rs->inh;
  rs->accum=p; p+=3*(rs->outw+2);
  rs->lb=p; p+=3*(rs->outw+2);
  rs->nexterror=(s32*)p+3; p+=3*(rs->outw+2);
  rs->error=(s32*)p+3; p+=3*(rs->outw+2);
  rs->dest=(u8*)p; p+=rs->outw;
  rs->outscale=(u32)(4294967296.0/(rs->inw*rs->inh));
  rs->inscale=rs->inw*rs->inh;
  rs->max=rs->inscale*256-1;
  rs->resize_line=resize_line_plain;
  return true;
}

static void resize_set_alpha(resize_state *rs,COLORREF bg) {
  rs->resize_line=resize_line_alpha;
  rs->bg[0]=GetRValue(bg);
  rs->bg[1]=GetGValue(bg);
  rs->bg[2]=GetBValue(bg);
}

static void resize_state_destroy(resize_state *rs) {
  if (rs) {
    free(rs->membuf);
    free(rs);
  }
}

static resize_state *resize_state_create(u32 iinw,u32 iinh,imagestore *out) {
  resize_state *rs=(resize_state *)malloc(sizeof(resize_state));
  if (rs && resize_state_init(rs,iinw,iinh,out))
    return rs;
  free(rs);
  return NULL;
}

__inline s32 CLIP(s32 v,s32 m) {
  return v<0 ? 0 : v>m ? m : v;
}

#define	CLIPADD(rs,i,n) CLIP(rs->lb[i+n]+rs->error[i+n],rs->max)
#define	M64(a,b,m) ((unsigned int)(((__int64)(a)*(b))>>32)&(m))
#define	PIXEL_EVEN(rs,i,c) \
  u = CLIPADD(rs,i,c); \
  v = M64(u,rs->outscale,rs->mask[c]); \
  e = u - v*rs->inscale; \
  rs->error[i+3+c] += (e*7)>>4; \
  rs->nexterror[i-3+c] += (e*3)>>4; \
  rs->nexterror[i+0+c] += (e*5)>>4; \
  rs->nexterror[i+3+c] += e>>4; \
  rs->dest[i+c] = v;
#define PIXEL_ODD(rs,i,c) \
  u = CLIPADD(rs,i,c); \
  v = M64(u,rs->outscale,rs->mask[c]); \
  e = u-v*rs->inscale; \
  rs->error[i-3+c] += (e*7)>>4; \
  rs->nexterror[i+3+c] += (e*3)>>4; \
  rs->nexterror[i+0+c] += (e*5)>>4; \
  rs->nexterror[i-3+c] += e>>4; \
  rs->dest[i+c]=v;

// dither lb into dest, left to right
void	resize_dither_even(struct resize_state *rs) {
  u32	  i;
  s32	  u,v,e;

  for (i=0;i<3*rs->outw;i+=3) {
    PIXEL_EVEN(rs,i,0);
    PIXEL_EVEN(rs,i,1);
    PIXEL_EVEN(rs,i,2);
  }
}

// dither lb into dest, right to left
void	resize_dither_odd(struct resize_state *rs) {
  s32	  i;
  s32	  u,v,e;

  for (i=3*rs->outw-3;i>=0;i-=3) {
    PIXEL_ODD(rs,i,0);
    PIXEL_ODD(rs,i,1);
    PIXEL_ODD(rs,i,2);
  }
}

// dither lb into dest
void  resize_dither(struct resize_state *rs) {
  s32	  *tmp;

  if (rs->odd)
    resize_dither_odd(rs);
  else
    resize_dither_even(rs);
  tmp=rs->error;
  rs->error=rs->nexterror;
  rs->nexterror=tmp;
  memset(tmp,0,sizeof(s32)*3*rs->outw);
  rs->odd=!rs->odd;
  rs->output->packbits(rs->output,rs->dest);
}

void	resize_add_line(struct resize_state *rs,u8 *line) {
  u32	  i;

  // resize the line horizontally
  rs->resize_line(line,rs->inw,rs->lb,rs->outw,rs->bg);
  // perform one loop iteration
  if (rs->inptr+rs->outh>=rs->outptr) {
    u32	    c1=rs->outptr-rs->inptr;
    u32	    c2=rs->outh-c1;
    u32	    v;
    for (i=0;i<3*rs->outw;i+=3) {
      v = rs->accum[i+0]+rs->lb[i+0]*c1;
      rs->accum[i+0] = rs->lb[i+0]*c2;
      rs->lb[i+0] = v;
      v = rs->accum[i+1]+rs->lb[i+1]*c1;
      rs->accum[i+1] = rs->lb[i+1]*c2;
      rs->lb[i+1] = v;
      v = rs->accum[i+2]+rs->lb[i+2]*c1;
      rs->accum[i+2] = rs->lb[i+2]*c2;
      rs->lb[i+2] = v;
    }
    resize_dither(rs);
    rs->outptr+=rs->inh;
  } else {
    for (i=0;i<3*rs->outw;i+=3) {
      rs->accum[i+0] += rs->lb[i+0]*rs->outh;
      rs->accum[i+1] += rs->lb[i+1]*rs->outh;
      rs->accum[i+2] += rs->lb[i+2]*rs->outh;
    }
  }
  rs->inptr+=rs->outh;
}

struct my_src_mgr {
  struct jpeg_source_mgr  pub;
  ImageLoader::BinReader  *rdr;
  JOCTET		  *buffer;
};

METHODDEF(void) jsrc_init_source (j_decompress_ptr cinfo) {
  // do nothing
}

METHODDEF(boolean) jsrc_fill_input_buffer (j_decompress_ptr cinfo) {
  my_src_mgr	*mgr=(my_src_mgr*)cinfo->src;

  int	  nr=mgr->rdr->Read(mgr->buffer,INBUF_SIZE);
  if (nr<=0) { // eof
    // fake EOI marker
    mgr->buffer[0]=(JOCTET)0xff;
    mgr->buffer[1]=(JOCTET)JPEG_EOI;
    nr=2;
  }
  mgr->pub.bytes_in_buffer=nr;
  mgr->pub.next_input_byte=mgr->buffer;
  return TRUE;
}

METHODDEF(void) jsrc_skip_input_data (j_decompress_ptr cinfo, long bytes) {
  my_src_mgr	*mgr=(my_src_mgr*)cinfo->src;

  if (bytes > 0) {
    while (bytes > (long) mgr->pub.bytes_in_buffer) {
      bytes -= (long) mgr->pub.bytes_in_buffer;
      jsrc_fill_input_buffer(cinfo);
      /* note we assume that fill_input_buffer will never return FALSE,
       * so suspension need not be handled.
       */
    }
    mgr->pub.next_input_byte += (size_t) bytes;
    mgr->pub.bytes_in_buffer -= (size_t) bytes;
  }
}

METHODDEF(void) jsrc_term_source(j_decompress_ptr cinfo) {
  // do nothing
}

static void prepare_buffer(j_decompress_ptr cinfo,ImageLoader::BinReader *rdr) {
  my_src_mgr  *mgr;

  if (cinfo->src==NULL) {
    cinfo->src=(struct jpeg_source_mgr *)
      (cinfo->mem->alloc_small((j_common_ptr)cinfo,JPOOL_PERMANENT,
	sizeof(my_src_mgr)));
    mgr=(my_src_mgr*)cinfo->src;
    mgr->buffer=(JOCTET*)
      (cinfo->mem->alloc_small((j_common_ptr)cinfo,JPOOL_PERMANENT,
	INBUF_SIZE*sizeof(JOCTET)));
  }
  mgr=(my_src_mgr*)cinfo->src;
  mgr->rdr=rdr;
  mgr->pub.init_source=jsrc_init_source;
  mgr->pub.fill_input_buffer=jsrc_fill_input_buffer;
  mgr->pub.skip_input_data=jsrc_skip_input_data;
  mgr->pub.resync_to_restart = jpeg_resync_to_restart; /* use default method */
  mgr->pub.term_source=jsrc_term_source;
  mgr->pub.bytes_in_buffer=0;
  mgr->pub.next_input_byte=NULL;
}

struct my_error_mgr {
  struct jpeg_error_mgr	  pub;
  jmp_buf		  jb;
};

METHODDEF(void) je_error_exit(j_common_ptr cinfo) {
  my_error_mgr	  *mgr=(my_error_mgr*)cinfo->err;
  /* Always display the message */
  (*cinfo->err->output_message) (cinfo);
  jpeg_destroy(cinfo);
  longjmp(mgr->jb,1);
}

METHODDEF(void) je_output_message(j_common_ptr cinfo) {
  char buffer[JMSG_LENGTH_MAX];
  /* Create the message */
  (*cinfo->err->format_message) (cinfo, buffer);
  // do nothing at this time
#if 0
  MessageBoxA(GetActiveWindow(),buffer,"JPEG Decompressor",MB_OK);
#endif
}

static void PNGAPI pngr_read_data(png_structp png_ptr,png_bytep data,png_size_t length) {
  ImageLoader::BinReader  *rdr=(ImageLoader::BinReader*)png_get_io_ptr(png_ptr);
  if (!rdr || rdr->Read(data,length)!=(int)length)
    png_error(png_ptr,"Read Error");
}

static int  get_bitmap_format() {
  static int	    format=BF_UNKNOWN;

#ifdef _WIN32_WCE
  if (format!=BF_UNKNOWN)
    return format;

  HINSTANCE hLib;

  if ((hLib=LoadLibrary(_T("gx.dll")))!=NULL) {
    GXDisplayProperties (*gp)();
    gp=(GXDisplayProperties (*)())GetProcAddress(hLib,
      _T("?GXGetDisplayProperties@@YA?AUGXDisplayProperties@@XZ"));
    if (gp) {
      GXDisplayProperties props=gp();
      if (props.ffFormat&kfDirect555)
	format=BF_555;
      else if (props.ffFormat&kfDirect565)
	format=BF_565;
      else
	format=BF_888;
    }
    FreeLibrary(hLib);
  }
#endif
  if (format!=BF_UNKNOWN)
    return format;
  HDC	hDC=GetDC(NULL);
  if (GetDeviceCaps(hDC,BITSPIXEL)==16)
    format=BF_565;
  else
    format=BF_888;
  ReleaseDC(NULL,hDC);
  return format;
}

static imagestore *bminit(HDC hDC,int w,int h,int maxw,int maxh,int rotate)
{
  struct {
    BITMAPINFOHEADER  h;
    DWORD	      masks[3];
  } bi;
  imagestore	*im=(imagestore*)malloc(sizeof(imagestore));
  if (!im)
    return NULL;
  void		*data;
  int		bpp;
  s32		rowstep;

  im->bmformat=get_bitmap_format();
  memset(&bi,0,sizeof(bi));
  switch (im->bmformat) {
  case BF_555:
    bpp=2;
    bi.masks[0]=0x7C00;
    bi.masks[1]=0x03E0;
    bi.masks[2]=0x001F;
    bi.h.biCompression=BI_BITFIELDS;
    im->packbits=packbits_24_to_15;
    break;
  case BF_565:
    bpp=2;
    bi.masks[0]=0xF800;
    bi.masks[1]=0x07E0;
    bi.masks[2]=0x001F;
    bi.h.biCompression=BI_BITFIELDS;
    im->packbits=packbits_24_to_16;
    break;
  case BF_888:
    bpp=3;
#ifdef _WIN32_WCE
    bi.masks[0]=0xFF0000;
    bi.masks[1]=0x00FF00;
    bi.masks[2]=0x0000FF;
    bi.h.biCompression=BI_BITFIELDS;
#else
    bi.h.biCompression=BI_RGB;
#endif
    im->packbits=packbits_24_to_24;
    break;
  }
  if (w<=maxw && h<=maxh) {
    im->width=w;
    im->height=h;
  } else {
    if (maxw*h<maxh*w) {
      im->width=maxw;
      im->height=(h*maxw)/w;
    } else {
      im->width=(w*maxh)/h;
      im->height=maxh;
    }
  }
  if (rotate==0 || rotate==1800) {
    im->realheight=im->height;
    im->realwidth=im->width;
  } else {
    im->realheight=im->width;
    im->realwidth=im->height;
  }
  if (!hDC)
    return im;
  rowstep=(im->realwidth*bpp+3)&~3;
  bi.h.biSize=sizeof(bi.h);
  bi.h.biWidth=im->realwidth;
  bi.h.biHeight=im->realheight;
  bi.h.biPlanes=1;
  bi.h.biBitCount=bpp==2 ? 16 : 24;
  if (!(im->bmp=CreateDIBSection(hDC,(BITMAPINFO*)&bi,DIB_RGB_COLORS,&data,NULL,0))) {
    DWORD err=GetLastError();
    free(im);
    return NULL;
  }
  switch (rotate) {
  case 2700:
    im->hstep=-rowstep;
    im->vstep=-bpp;
    im->bits=(u8*)data+bpp*(im->realwidth-1)+rowstep*(im->realheight-1);
    break;
  case 1800:
    im->hstep=-bpp;
    im->vstep=rowstep;
    im->bits=(u8*)data+bpp*(im->realwidth-1);
    break;
  case 900:
    im->hstep=rowstep;
    im->vstep=bpp;
    im->bits=(u8*)data;
    break;
  case 0:
    im->hstep=bpp;
    im->vstep=-rowstep;
    im->bits=(u8*)data+rowstep*(im->realheight-1);
    break;
  }
  return im;
}

bool	ImageLoader::Load(HDC hDC,const wchar_t *type,ImageLoader::BinReader *rdr,
			  int maxwidth,int maxheight,int rotation,HBITMAP& bmp,
			  int& width,int& height)
{
  imagestore		    *is=NULL;
  resize_state		    *rs=NULL;

  set_gamma(0.45455);
  if (!wcscmp(type,L"image/jpeg")) { // only jpeg images are supported at the time
    struct jpeg_decompress_struct   cinfo;
    struct my_error_mgr		    jerr;

    cinfo.err=jpeg_std_error(&jerr.pub);
    jerr.pub.error_exit=je_error_exit;
    jerr.pub.output_message=je_output_message;
    if (setjmp(jerr.jb))
      goto common_exit;
    jpeg_create_decompress(&cinfo);
    prepare_buffer(&cinfo,rdr);
    jpeg_read_header(&cinfo,TRUE);
    // do some scaling
    int scale,iw;
    for (scale=1,iw=cinfo.image_width;scale<8;scale<<=1,iw>>=1)
      if ((iw>>1)<maxwidth)
	break;
    cinfo.scale_denom=scale;
    cinfo.out_color_space=JCS_RGB;
    jpeg_calc_output_dimensions(&cinfo);
    is=bminit(hDC,cinfo.output_width,cinfo.output_height,maxwidth,maxheight,rotation);
    if (is && hDC) {
      if (is->width!=cinfo.output_width || is->height!=cinfo.output_height) {
	rs=resize_state_create(cinfo.output_width,cinfo.output_height,is);
	if (!rs)
	  goto outjpg;
      }
      jpeg_start_decompress(&cinfo);
      JSAMPARRAY  line=cinfo.mem->alloc_sarray((j_common_ptr)&cinfo,
			JPOOL_IMAGE,cinfo.output_width*cinfo.output_components,
			1);
      if (rs) {
	while (cinfo.output_scanline<cinfo.output_height) {
	  jpeg_read_scanlines(&cinfo,line,1);
	  resize_add_line(rs,line[0]);
	}
      } else {
	while (cinfo.output_scanline<cinfo.output_height) {
	  jpeg_read_scanlines(&cinfo,line,1);
	  is->packbits(is,line[0]);
	}
      }
      jpeg_finish_decompress(&cinfo);
    }
outjpg:
    jpeg_destroy_decompress(&cinfo);
  } else if (!wcscmp(type,L"image/png")) {
    // create png read structures
    png_structp png_ptr = png_create_read_struct(PNG_LIBPNG_VER_STRING,NULL,NULL,NULL);
    if (!png_ptr) // out of memory?
      return false;
    png_infop	info_ptr = png_create_info_struct(png_ptr);
    if (!info_ptr) { // out of memory?
      png_destroy_read_struct(&png_ptr,NULL,NULL);
      return false;
    }
    // setup i/o routine
    png_set_read_fn(png_ptr,rdr,pngr_read_data);

    // init jmpbuf
    if (setjmp(png_jmpbuf(png_ptr))) { // error occurred
      png_destroy_read_struct(&png_ptr,&info_ptr,NULL);
      goto common_exit;
    }
    png_read_info(png_ptr,info_ptr);
    png_uint_32	width,height;
    int		bit_depth,color_type,interlace_type;
    png_get_IHDR(png_ptr,info_ptr,&width,&height,&bit_depth,&color_type,
		 &interlace_type,NULL,NULL);
    if (interlace_type!=PNG_INTERLACE_NONE) {
      png_destroy_read_struct(&png_ptr,&info_ptr,NULL);
      return false;
    }
    // configure transformations, we always want RGB data in the end
    if (color_type == PNG_COLOR_TYPE_PALETTE)
      png_set_palette_to_rgb(png_ptr);
    if (color_type == PNG_COLOR_TYPE_GRAY && bit_depth < 8)
      png_set_gray_1_2_4_to_8(png_ptr);
    if (png_get_valid(png_ptr, info_ptr,PNG_INFO_tRNS))
      png_set_tRNS_to_alpha(png_ptr);
    if (bit_depth == 16)
      png_set_strip_16(png_ptr);
    if (bit_depth < 8)
      png_set_packing(png_ptr);
    if (color_type == PNG_COLOR_TYPE_GRAY ||
        color_type == PNG_COLOR_TYPE_GRAY_ALPHA)
      png_set_gray_to_rgb(png_ptr);

    // update info after applying transformations
    png_read_update_info(png_ptr,info_ptr);

    // reload info
    png_get_IHDR(png_ptr,info_ptr,&width,&height,&bit_depth,&color_type,
		 &interlace_type,NULL,NULL);

    // ok, now configure storer and resizer
    is=bminit(hDC,width,height,maxwidth,maxheight,rotation);
    if (is && hDC) {
      if (is->width!=width || is->height!=height) {
	rs=resize_state_create(width,height,is);
	if (!rs)
	  goto outpng;
      }

      // handle transparency
      if (color_type == PNG_COLOR_TYPE_RGB_ALPHA) {
	// create a resizer, because we use it to apply
	// transparency
	if (!rs) {
	  rs=resize_state_create(width,height,is);
	  if (!rs)
	    goto outpng;
	}

	png_color_16p image_background;
	if (png_get_bKGD(png_ptr, info_ptr, &image_background))
	  resize_set_alpha(rs,RGB(image_background->red>>8,
				  image_background->green>>8,
				  image_background->blue>>8));
	else
	  resize_set_alpha(rs,::GetBkColor(hDC));
      }

      // now read the image line by line
      int		rowbytes=png_get_rowbytes(png_ptr,info_ptr);
      unsigned char	*row=(unsigned char *)malloc(rowbytes);
      if (!row)
	goto outpng;
      if (rs) {
	for (int i=0;i<(int)height;++i) {
	  png_read_row(png_ptr,row,NULL);
	  resize_add_line(rs,row);
	}
      } else {
	for (int i=0;i<(int)height;++i) {
	  png_read_row(png_ptr,row,NULL);
	  is->packbits(is,row);
	}
      }
      // destroy read struct
      free(row);
      png_read_end(png_ptr,NULL);
    }
outpng:
    png_destroy_read_struct(&png_ptr,&info_ptr,NULL);
  } else
    return false;
common_exit:
  if (is) {
    bmp=is->bmp;
    width=is->width;
    height=is->height;
  }
  resize_state_destroy(rs);
  free(is);
  return is!=NULL;
}