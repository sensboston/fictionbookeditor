# Microsoft Developer Studio Generated NMAKE File, Based on ExportHTML.dsp
!IF "$(CFG)" == ""
CFG=ExportHTML - Win32 Debug
!MESSAGE No configuration specified. Defaulting to ExportHTML - Win32 Debug.
!ENDIF 

!IF "$(CFG)" != "ExportHTML - Win32 Release" && "$(CFG)" != "ExportHTML - Win32 Debug"
!MESSAGE Invalid configuration "$(CFG)" specified.
!MESSAGE You can specify a configuration when running NMAKE
!MESSAGE by defining the macro CFG on the command line. For example:
!MESSAGE 
!MESSAGE NMAKE /f "ExportHTML.mak" CFG="ExportHTML - Win32 Debug"
!MESSAGE 
!MESSAGE Possible choices for configuration are:
!MESSAGE 
!MESSAGE "ExportHTML - Win32 Release" (based on "Win32 (x86) Dynamic-Link Library")
!MESSAGE "ExportHTML - Win32 Debug" (based on "Win32 (x86) Dynamic-Link Library")
!MESSAGE 
!ERROR An invalid configuration is specified.
!ENDIF 

!IF "$(OS)" == "Windows_NT"
NULL=
!ELSE 
NULL=nul
!ENDIF 

!IF  "$(CFG)" == "ExportHTML - Win32 Release"

OUTDIR=.\Release
INTDIR=.\Release
# Begin Custom Macros
OutDir=.\Release
# End Custom Macros

ALL : "$(OUTDIR)\ExportHTML.dll"


CLEAN :
	-@erase "$(INTDIR)\ExportHTML.obj"
	-@erase "$(INTDIR)\ExportHTML.res"
	-@erase "$(INTDIR)\ExportHTMLImpl.obj"
	-@erase "$(INTDIR)\StdAfx.obj"
	-@erase "$(INTDIR)\Utils.obj"
	-@erase "$(INTDIR)\vc60.idb"
	-@erase "$(OUTDIR)\ExportHTML.dll"
	-@erase "$(OUTDIR)\ExportHTML.exp"

"$(OUTDIR)" :
    if not exist "$(OUTDIR)/$(NULL)" mkdir "$(OUTDIR)"

CPP=cl.exe
CPP_PROJ=/nologo /MD /W3 /GX /I "." /I ".." /I "..\wtl" /I "..\utils" /D "NDEBUG" /D "WIN32" /D "_WINDOWS" /D "_UNICODE" /D "UNICODE" /D "_USRDLL" /Fp"$(INTDIR)\ExportHTML.pch" /YX"stdafx.h" /Fo"$(INTDIR)\\" /Fd"$(INTDIR)\\" /FD /Oxs /c 

.c{$(INTDIR)}.obj::
   $(CPP) @<<
   $(CPP_PROJ) $< 
<<

.cpp{$(INTDIR)}.obj::
   $(CPP) @<<
   $(CPP_PROJ) $< 
<<

.cxx{$(INTDIR)}.obj::
   $(CPP) @<<
   $(CPP_PROJ) $< 
<<

.c{$(INTDIR)}.sbr::
   $(CPP) @<<
   $(CPP_PROJ) $< 
<<

.cpp{$(INTDIR)}.sbr::
   $(CPP) @<<
   $(CPP_PROJ) $< 
<<

.cxx{$(INTDIR)}.sbr::
   $(CPP) @<<
   $(CPP_PROJ) $< 
<<

MTL=midl.exe
MTL_PROJ=/nologo /D "NDEBUG" /mktyplib203 /win32 
RSC=rc.exe
RSC_PROJ=/l 0x419 /fo"$(INTDIR)\ExportHTML.res" /d "NDEBUG" 
BSC32=bscmake.exe
BSC32_FLAGS=/nologo /o"$(OUTDIR)\ExportHTML.bsc" 
BSC32_SBRS= \
	
LINK32=link.exe
LINK32_FLAGS=msvcrt.lib kernel32.lib user32.lib gdi32.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib comsupp.lib shlwapi.lib /nologo /dll /incremental:no /pdb:"$(OUTDIR)\ExportHTML.pdb" /machine:I386 /nodefaultlib /def:".\ExportHTML.def" /out:"$(OUTDIR)\ExportHTML.dll" /implib:"$(OUTDIR)\ExportHTML.lib" /opt:nowin98 
DEF_FILE= \
	".\ExportHTML.def"
LINK32_OBJS= \
	"$(INTDIR)\ExportHTML.obj" \
	"$(INTDIR)\ExportHTMLImpl.obj" \
	"$(INTDIR)\StdAfx.obj" \
	"$(INTDIR)\Utils.obj" \
	"$(INTDIR)\ExportHTML.res"

"$(OUTDIR)\ExportHTML.dll" : "$(OUTDIR)" $(DEF_FILE) $(LINK32_OBJS)
    $(LINK32) @<<
  $(LINK32_FLAGS) $(LINK32_OBJS)
<<

!ELSEIF  "$(CFG)" == "ExportHTML - Win32 Debug"

OUTDIR=.\Debug
INTDIR=.\Debug
# Begin Custom Macros
OutDir=.\Debug
# End Custom Macros

ALL : "$(OUTDIR)\ExportHTML.dll"


CLEAN :
	-@erase "$(INTDIR)\ExportHTML.obj"
	-@erase "$(INTDIR)\ExportHTML.res"
	-@erase "$(INTDIR)\ExportHTMLImpl.obj"
	-@erase "$(INTDIR)\StdAfx.obj"
	-@erase "$(INTDIR)\Utils.obj"
	-@erase "$(INTDIR)\vc60.idb"
	-@erase "$(INTDIR)\vc60.pdb"
	-@erase "$(OUTDIR)\ExportHTML.dll"
	-@erase "$(OUTDIR)\ExportHTML.exp"
	-@erase "$(OUTDIR)\ExportHTML.ilk"
	-@erase "$(OUTDIR)\ExportHTML.pdb"

"$(OUTDIR)" :
    if not exist "$(OUTDIR)/$(NULL)" mkdir "$(OUTDIR)"

CPP=cl.exe
CPP_PROJ=/nologo /MDd /W3 /Gm /GX /ZI /Od /I "." /I ".." /I "..\wtl" /I "..\utils" /D "_DEBUG" /D "WIN32" /D "_WINDOWS" /D "_UNICODE" /D "UNICODE" /D "_USRDLL" /D "EXPORTHTML_EXPORTS" /Fp"$(INTDIR)\ExportHTML.pch" /YX"stdafx.h" /Fo"$(INTDIR)\\" /Fd"$(INTDIR)\\" /FD /GZ /c 

.c{$(INTDIR)}.obj::
   $(CPP) @<<
   $(CPP_PROJ) $< 
<<

.cpp{$(INTDIR)}.obj::
   $(CPP) @<<
   $(CPP_PROJ) $< 
<<

.cxx{$(INTDIR)}.obj::
   $(CPP) @<<
   $(CPP_PROJ) $< 
<<

.c{$(INTDIR)}.sbr::
   $(CPP) @<<
   $(CPP_PROJ) $< 
<<

.cpp{$(INTDIR)}.sbr::
   $(CPP) @<<
   $(CPP_PROJ) $< 
<<

.cxx{$(INTDIR)}.sbr::
   $(CPP) @<<
   $(CPP_PROJ) $< 
<<

MTL=midl.exe
MTL_PROJ=/nologo /D "_DEBUG" /mktyplib203 /win32 
RSC=rc.exe
RSC_PROJ=/l 0x419 /fo"$(INTDIR)\ExportHTML.res" /d "_DEBUG" 
BSC32=bscmake.exe
BSC32_FLAGS=/nologo /o"$(OUTDIR)\ExportHTML.bsc" 
BSC32_SBRS= \
	
LINK32=link.exe
LINK32_FLAGS=msvcrtd.lib kernel32.lib user32.lib gdi32.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib comsupp.lib shlwapi.lib /nologo /dll /incremental:yes /pdb:"$(OUTDIR)\ExportHTML.pdb" /debug /machine:I386 /nodefaultlib /def:".\ExportHTML.def" /out:"$(OUTDIR)\ExportHTML.dll" /implib:"$(OUTDIR)\ExportHTML.lib" /pdbtype:sept 
DEF_FILE= \
	".\ExportHTML.def"
LINK32_OBJS= \
	"$(INTDIR)\ExportHTML.obj" \
	"$(INTDIR)\ExportHTMLImpl.obj" \
	"$(INTDIR)\StdAfx.obj" \
	"$(INTDIR)\Utils.obj" \
	"$(INTDIR)\ExportHTML.res"

"$(OUTDIR)\ExportHTML.dll" : "$(OUTDIR)" $(DEF_FILE) $(LINK32_OBJS)
    $(LINK32) @<<
  $(LINK32_FLAGS) $(LINK32_OBJS)
<<

!ENDIF 


!IF "$(NO_EXTERNAL_DEPS)" != "1"
!IF EXISTS("ExportHTML.dep")
!INCLUDE "ExportHTML.dep"
!ELSE 
!MESSAGE Warning: cannot find "ExportHTML.dep"
!ENDIF 
!ENDIF 


!IF "$(CFG)" == "ExportHTML - Win32 Release" || "$(CFG)" == "ExportHTML - Win32 Debug"
SOURCE=.\ExportHTML.cpp

"$(INTDIR)\ExportHTML.obj" : $(SOURCE) "$(INTDIR)"


SOURCE=.\ExportHTMLImpl.cpp

"$(INTDIR)\ExportHTMLImpl.obj" : $(SOURCE) "$(INTDIR)"


SOURCE=.\StdAfx.cpp

"$(INTDIR)\StdAfx.obj" : $(SOURCE) "$(INTDIR)"


SOURCE=..\utils\Utils.cpp

"$(INTDIR)\Utils.obj" : $(SOURCE) "$(INTDIR)"
	$(CPP) $(CPP_PROJ) $(SOURCE)


SOURCE=.\ExportHTML.rc

"$(INTDIR)\ExportHTML.res" : $(SOURCE) "$(INTDIR)"
	$(RSC) $(RSC_PROJ) $(SOURCE)



!ENDIF 

