#pragma once
#include "stdafx.h"
#include "resource.h"
#include <gl\gl.h>
#include <gl\glu.h>

enum TEXTURES_TYPES	{ CENTER, ORANGE, GREEN, DOC, XML, OTHER, HTML, PRC, TEXT};

class CGLLogoView : public CWindowImpl <CGLLogoView, CStatic>
{
public:
	BEGIN_MSG_MAP(CGLLogoView)
		MESSAGE_HANDLER(WM_KEYDOWN, OnKeyDown)
		MESSAGE_HANDLER(WM_SIZE, OnSize)
		MESSAGE_HANDLER(WM_LBUTTONDOWN, OnLButtonDown)
		MESSAGE_HANDLER(WM_MOUSEMOVE, OnMouseMove)
		MESSAGE_HANDLER(WM_LBUTTONDBLCLK, OnLeftButtonDoubleClick)
		MESSAGE_HANDLER(WM_MOUSEWHEEL, OnMouseWheel)
		MESSAGE_HANDLER(WM_TIMER, OnTimer)
	END_MSG_MAP()

	CGLLogoView()
	{
		hRC = NULL;

		// initialize variables
		z=-8.0f;			// Scene depth 
		y=4.0f;				// Height 
		dr=0.01f;			// Rotation increment
		ds=0.001f;			// Rotation auto decrement
		alpha=0.0f;			// Alpha value for info panel
		alpha_inc=0.01f;	// Alpha increment
		glColorOp=GL_XOR;

		xrot = yrot = zrot = 0.0f;

		xspeed = 0.5f;
		yspeed = 0.3f;
		zspeed = 0.2f;
		ds=0.0f;

		bDrawInfo=false;
		bShadow=true;		// Draw shadow
		bReflection=true;	// Draw reflection
		bFloor=true;		// Draw floor
		bWireFrame=false;	// Draw mesh
		b—rystallize=false;

		m_Timer = 0;
	}

	~CGLLogoView() 
	{ 
		KillGLWindow();
	}

	BOOL SubclassWindow (HWND hWnd);
	BOOL OpenGLError() { return !(hDC && hRC); }

private:
	HDC		hDC;
	HGLRC	hRC;

	UINT_PTR m_Timer;

	GLYPHMETRICSFLOAT gmf[96];
	GLuint	font_base;
	GLuint	logo;
	GLUquadricObj   *quadric;

	GLfloat	xrot;				// X rotation
	GLfloat	yrot;				// Y rotation
	GLfloat	zrot;				// Z rotation
	GLfloat xspeed;				// X rotation speed
	GLfloat yspeed;				// Y rotation speed
	GLfloat zspeed;				// Z rotation speed
	GLfloat	z;					// Scene depth 
	GLfloat	y;					// Height 
	GLfloat	dr;					// Rotation increment
	GLfloat	ds;					// Rotation auto decrement
	GLfloat	alpha;				// Alpha value for info panel
	GLfloat	alpha_inc;			// Alpha increment
	GLint	glColorOp;

	bool	bDrawInfo;
	bool	bShadow;			// Draw shadow
	bool	bReflection;		// Draw reflection
	bool	bFloor;				// Draw floor
	bool	bWireFrame;			// Draw mesh
	bool	b—rystallize;		// Special effect
	POINT	lastPos;			// Mouse position
	GLuint	texture[9];			// Storage for textures

	GLfloat fShadowMatrix[16];

	LRESULT OnKeyDown(UINT, WPARAM wParam, LPARAM lParam, BOOL&);
	LRESULT OnSize(UINT, WPARAM, LPARAM lParam, BOOL&);
	LRESULT OnLButtonDown(UINT, WPARAM, LPARAM lParam, BOOL&);
	LRESULT OnMouseMove(UINT, WPARAM wParam, LPARAM lParam, BOOL&);
	LRESULT OnLeftButtonDoubleClick(UINT, WPARAM, LPARAM, BOOL&);
	LRESULT OnMouseWheel(UINT, WPARAM wParam, LPARAM, BOOL&);
	LRESULT OnTimer(UINT, WPARAM wParam, LPARAM, BOOL&);

	bool CreateGLWindow();
	bool KillGLWindow();
	bool InitGL();
	void SetShadowMatrix(float fDestMat[16],float fLightPos[4],float fPlane[4]);
	void CreateGLFont();
	void Print(const char *fmt, ...);
	bool LoadTextures();
	void ResizeScene(GLsizei width, GLsizei height);
	void CreateLogo();
	void DrawFloor();
	void DrawGLScene();
};
