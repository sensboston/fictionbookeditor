# Microsoft Developer Studio Generated NMAKE File, Based on FBE.dsp
!IF "$(CFG)" == ""
CFG=FBE - Win32 Debug
!MESSAGE No configuration specified. Defaulting to FBE - Win32 Debug.
!ENDIF 

!IF "$(CFG)" != "FBE - Win32 Release" && "$(CFG)" != "FBE - Win32 Debug"
!MESSAGE Invalid configuration "$(CFG)" specified.
!MESSAGE You can specify a configuration when running NMAKE
!MESSAGE by defining the macro CFG on the command line. For example:
!MESSAGE 
!MESSAGE NMAKE /f "FBE.mak" CFG="FBE - Win32 Debug"
!MESSAGE 
!MESSAGE Possible choices for configuration are:
!MESSAGE 
!MESSAGE "FBE - Win32 Release" (based on "Win32 (x86) Application")
!MESSAGE "FBE - Win32 Debug" (based on "Win32 (x86) Application")
!MESSAGE 
!ERROR An invalid configuration is specified.
!ENDIF 

!IF "$(OS)" == "Windows_NT"
NULL=
!ELSE 
NULL=nul
!ENDIF 

!IF  "$(CFG)" == "FBE - Win32 Release"

OUTDIR=.\Release
INTDIR=.\Release
# Begin Custom Macros
OutDir=.\Release
# End Custom Macros

ALL : "$(OUTDIR)\FBE.exe"


CLEAN :
	-@erase "$(INTDIR)\apputils.obj"
	-@erase "$(INTDIR)\ColorButton.obj"
	-@erase "$(INTDIR)\ExternalHelper.obj"
	-@erase "$(INTDIR)\FBDoc.obj"
	-@erase "$(INTDIR)\FBE.obj"
	-@erase "$(INTDIR)\FBE.pch"
	-@erase "$(INTDIR)\FBE.res"
	-@erase "$(INTDIR)\FBEview.obj"
	-@erase "$(INTDIR)\mainfrm.obj"
	-@erase "$(INTDIR)\OptDlg.obj"
	-@erase "$(INTDIR)\stdafx.obj"
	-@erase "$(INTDIR)\TreeView.obj"
	-@erase "$(INTDIR)\Utils.obj"
	-@erase "$(INTDIR)\vc60.idb"
	-@erase "$(INTDIR)\Words.obj"
	-@erase "$(OUTDIR)\FBE.exe"
	-@erase ".\FBE.h"
	-@erase ".\FBE.tlb"
	-@erase ".\FBE_i.c"

"$(OUTDIR)" :
    if not exist "$(OUTDIR)/$(NULL)" mkdir "$(OUTDIR)"

CPP=cl.exe
CPP_PROJ=/nologo /G6 /MD /W3 /GX /Ox /Os /I "wtl" /I "extras" /I "utils" /D "NDEBUG" /D "WIN32" /D "_WINDOWS" /D "_UNICODE" /D "UNICODE" /D "STRICT" /Fp"$(INTDIR)\FBE.pch" /Yu"stdafx.h" /Fo"$(INTDIR)\\" /Fd"$(INTDIR)\\" /FD /c 

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
RSC_PROJ=/l 0x409 /fo"$(INTDIR)\FBE.res" /i "wtl" /i "extras" /d "NDEBUG" 
BSC32=bscmake.exe
BSC32_FLAGS=/nologo /o"$(OUTDIR)\FBE.bsc" 
BSC32_SBRS= \
	
LINK32=link.exe
LINK32_FLAGS=msvcrt.lib kernel32.lib user32.lib gdi32.lib comctl32.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib rpcrt4.lib comsupp.lib urlmon.lib uxtheme.lib shlwapi.lib delayimp.lib $(INTDIR)\buildstamp.obj /nologo /subsystem:windows /incremental:no /pdb:"$(OUTDIR)\FBE.pdb" /machine:I386 /nodefaultlib /out:"$(OUTDIR)\FBE.exe" /opt:nowin98 /opt:ref /opt:icf 
LINK32_OBJS= \
	"$(INTDIR)\apputils.obj" \
	"$(INTDIR)\ExternalHelper.obj" \
	"$(INTDIR)\FBDoc.obj" \
	"$(INTDIR)\FBE.obj" \
	"$(INTDIR)\FBEview.obj" \
	"$(INTDIR)\mainfrm.obj" \
	"$(INTDIR)\OptDlg.obj" \
	"$(INTDIR)\stdafx.obj" \
	"$(INTDIR)\TreeView.obj" \
	"$(INTDIR)\Utils.obj" \
	"$(INTDIR)\Words.obj" \
	"$(INTDIR)\ColorButton.obj" \
	"$(INTDIR)\FBE.res"

"$(OUTDIR)\FBE.exe" : "$(OUTDIR)" $(DEF_FILE) $(LINK32_OBJS)
   cl /nologo /c /Fo".\Release\buildstamp.obj" buildstamp.c
	 $(LINK32) @<<
  $(LINK32_FLAGS) $(LINK32_OBJS)
<<

IntDir=.\Release
SOURCE="$(InputPath)"

!ELSEIF  "$(CFG)" == "FBE - Win32 Debug"

OUTDIR=.\Debug
INTDIR=.\Debug
# Begin Custom Macros
OutDir=.\Debug
# End Custom Macros

ALL : "$(OUTDIR)\FBE.exe" ".\FBE.tlb" ".\FBE.h" ".\FBE_i.c"


CLEAN :
	-@erase "$(INTDIR)\apputils.obj"
	-@erase "$(INTDIR)\ColorButton.obj"
	-@erase "$(INTDIR)\ExternalHelper.obj"
	-@erase "$(INTDIR)\FBDoc.obj"
	-@erase "$(INTDIR)\FBE.obj"
	-@erase "$(INTDIR)\FBE.pch"
	-@erase "$(INTDIR)\FBE.res"
	-@erase "$(INTDIR)\FBEview.obj"
	-@erase "$(INTDIR)\mainfrm.obj"
	-@erase "$(INTDIR)\OptDlg.obj"
	-@erase "$(INTDIR)\stdafx.obj"
	-@erase "$(INTDIR)\TreeView.obj"
	-@erase "$(INTDIR)\Utils.obj"
	-@erase "$(INTDIR)\vc60.idb"
	-@erase "$(INTDIR)\vc60.pdb"
	-@erase "$(INTDIR)\Words.obj"
	-@erase "$(OUTDIR)\FBE.exe"
	-@erase "$(OUTDIR)\FBE.ilk"
	-@erase "$(OUTDIR)\FBE.pdb"
	-@erase ".\FBE.h"
	-@erase ".\FBE.tlb"
	-@erase ".\FBE_i.c"

"$(OUTDIR)" :
    if not exist "$(OUTDIR)/$(NULL)" mkdir "$(OUTDIR)"

CPP=cl.exe
CPP_PROJ=/nologo /MDd /W3 /Gm /GX /ZI /Od /I "wtl" /I "extras" /I "utils" /D "_DEBUG" /D "WIN32" /D "_WINDOWS" /D "_UNICODE" /D "UNICODE" /D "STRICT" /D _ATL_TRACE_LEVEL=4 /Fp"$(INTDIR)\FBE.pch" /Yu"stdafx.h" /Fo"$(INTDIR)\\" /Fd"$(INTDIR)\\" /FD /GZ /c 

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
RSC_PROJ=/l 0x409 /fo"$(INTDIR)\FBE.res" /i "wtl" /i "extras" /d "_DEBUG" 
BSC32=bscmake.exe
BSC32_FLAGS=/nologo /o"$(OUTDIR)\FBE.bsc" 
BSC32_SBRS= \
	
LINK32=link.exe
LINK32_FLAGS=msvcrtd.lib kernel32.lib user32.lib gdi32.lib comctl32.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib rpcrt4.lib comsupp.lib urlmon.lib uxtheme.lib shlwapi.lib delayimp.lib $(INTDIR)\buildstamp.obj /nologo /subsystem:windows /incremental:yes /pdb:"$(OUTDIR)\FBE.pdb" /debug /machine:I386 /nodefaultlib /out:"$(OUTDIR)\FBE.exe" /pdbtype:sept 
LINK32_OBJS= \
	"$(INTDIR)\apputils.obj" \
	"$(INTDIR)\ExternalHelper.obj" \
	"$(INTDIR)\FBDoc.obj" \
	"$(INTDIR)\FBE.obj" \
	"$(INTDIR)\FBEview.obj" \
	"$(INTDIR)\mainfrm.obj" \
	"$(INTDIR)\OptDlg.obj" \
	"$(INTDIR)\stdafx.obj" \
	"$(INTDIR)\TreeView.obj" \
	"$(INTDIR)\Utils.obj" \
	"$(INTDIR)\Words.obj" \
	"$(INTDIR)\ColorButton.obj" \
	"$(INTDIR)\FBE.res"

"$(OUTDIR)\FBE.exe" : "$(OUTDIR)" $(DEF_FILE) $(LINK32_OBJS)
   cl /nologo /c /Fo".\Debug\buildstamp.obj" buildstamp.c
	 $(LINK32) @<<
  $(LINK32_FLAGS) $(LINK32_OBJS)
<<

IntDir=.\Debug
SOURCE="$(InputPath)"

!ENDIF 


!IF "$(NO_EXTERNAL_DEPS)" != "1"
!IF EXISTS("FBE.dep")
!INCLUDE "FBE.dep"
!ELSE 
!MESSAGE Warning: cannot find "FBE.dep"
!ENDIF 
!ENDIF 


!IF "$(CFG)" == "FBE - Win32 Release" || "$(CFG)" == "FBE - Win32 Debug"
SOURCE=.\apputils.cpp

"$(INTDIR)\apputils.obj" : $(SOURCE) "$(INTDIR)" "$(INTDIR)\FBE.pch"


SOURCE=.\ExternalHelper.cpp

"$(INTDIR)\ExternalHelper.obj" : $(SOURCE) "$(INTDIR)" "$(INTDIR)\FBE.pch" ".\FBE.h"


SOURCE=.\FBDoc.cpp

"$(INTDIR)\FBDoc.obj" : $(SOURCE) "$(INTDIR)" "$(INTDIR)\FBE.pch"


SOURCE=.\FBE.cpp

"$(INTDIR)\FBE.obj" : $(SOURCE) "$(INTDIR)" "$(INTDIR)\FBE.pch" ".\FBE_i.c" ".\FBE.h"


SOURCE=.\fbe.idl

!IF  "$(CFG)" == "FBE - Win32 Release"

MTL_SWITCHES=/nologo /D "NDEBUG" /tlb "FBE.tlb" /h "FBE.h" /iid "FBE_i.c" /mktyplib203 /Oicf /win32 

".\FBE.tlb"	".\FBE.h"	".\FBE_i.c" : $(SOURCE) "$(INTDIR)"
	$(MTL) @<<
  $(MTL_SWITCHES) $(SOURCE)
<<


!ELSEIF  "$(CFG)" == "FBE - Win32 Debug"

MTL_SWITCHES=/nologo /D "_DEBUG" /tlb "FBE.tlb" /h "FBE.h" /iid "FBE_i.c" /mktyplib203 /Oicf /win32 

".\FBE.tlb"	".\FBE.h"	".\FBE_i.c" : $(SOURCE) "$(INTDIR)"
	$(MTL) @<<
  $(MTL_SWITCHES) $(SOURCE)
<<


!ENDIF 

SOURCE=.\FBEview.cpp

"$(INTDIR)\FBEview.obj" : $(SOURCE) "$(INTDIR)" "$(INTDIR)\FBE.pch"


SOURCE=.\mainfrm.cpp

"$(INTDIR)\mainfrm.obj" : $(SOURCE) "$(INTDIR)" "$(INTDIR)\FBE.pch" ".\FBE.h"


SOURCE=.\OptDlg.cpp

"$(INTDIR)\OptDlg.obj" : $(SOURCE) "$(INTDIR)" "$(INTDIR)\FBE.pch"


SOURCE=.\stdafx.cpp

!IF  "$(CFG)" == "FBE - Win32 Release"

CPP_SWITCHES=/nologo /G6 /MD /W3 /GX /Ox /Os /I "wtl" /I "extras" /I "utils" /D "NDEBUG" /D "WIN32" /D "_WINDOWS" /D "_UNICODE" /D "UNICODE" /D "STRICT" /Fp"$(INTDIR)\FBE.pch" /Yc"stdafx.h" /Fo"$(INTDIR)\\" /Fd"$(INTDIR)\\" /FD /c 

"$(INTDIR)\stdafx.obj"	"$(INTDIR)\FBE.pch" : $(SOURCE) "$(INTDIR)"
	$(CPP) @<<
  $(CPP_SWITCHES) $(SOURCE)
<<


!ELSEIF  "$(CFG)" == "FBE - Win32 Debug"

CPP_SWITCHES=/nologo /MDd /W3 /Gm /GX /ZI /Od /I "wtl" /I "extras" /I "utils" /D "_DEBUG" /D "WIN32" /D "_WINDOWS" /D "_UNICODE" /D "UNICODE" /D "STRICT" /D _ATL_TRACE_LEVEL=4 /Fp"$(INTDIR)\FBE.pch" /Yc"stdafx.h" /Fo"$(INTDIR)\\" /Fd"$(INTDIR)\\" /FD /GZ /c 

"$(INTDIR)\stdafx.obj"	"$(INTDIR)\FBE.pch" : $(SOURCE) "$(INTDIR)"
	$(CPP) @<<
  $(CPP_SWITCHES) $(SOURCE)
<<


!ENDIF 

SOURCE=.\TreeView.cpp

"$(INTDIR)\TreeView.obj" : $(SOURCE) "$(INTDIR)" "$(INTDIR)\FBE.pch"


SOURCE=.\utils\Utils.cpp

"$(INTDIR)\Utils.obj" : $(SOURCE) "$(INTDIR)" "$(INTDIR)\FBE.pch"
	$(CPP) $(CPP_PROJ) $(SOURCE)


SOURCE=.\Words.cpp

"$(INTDIR)\Words.obj" : $(SOURCE) "$(INTDIR)" "$(INTDIR)\FBE.pch"


SOURCE=.\FBE.rc

"$(INTDIR)\FBE.res" : $(SOURCE) "$(INTDIR)" ".\FBE.tlb"
	$(RSC) $(RSC_PROJ) $(SOURCE)


SOURCE=.\extras\ColorButton.cpp

"$(INTDIR)\ColorButton.obj" : $(SOURCE) "$(INTDIR)" "$(INTDIR)\FBE.pch"
	$(CPP) $(CPP_PROJ) $(SOURCE)



!ENDIF 

