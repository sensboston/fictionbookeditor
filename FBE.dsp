# Microsoft Developer Studio Project File - Name="FBE" - Package Owner=<4>
# Microsoft Developer Studio Generated Build File, Format Version 6.00
# ** DO NOT EDIT **

# TARGTYPE "Win32 (x86) Application" 0x0101

CFG=FBE - Win32 Debug
!MESSAGE This is not a valid makefile. To build this project using NMAKE,
!MESSAGE use the Export Makefile command and run
!MESSAGE 
!MESSAGE NMAKE /f "FBE.mak".
!MESSAGE 
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

# Begin Project
# PROP AllowPerConfigDependencies 0
# PROP Scc_ProjName "FBE"
# PROP Scc_LocalPath "."
CPP=cl.exe
MTL=midl.exe
RSC=rc.exe

!IF  "$(CFG)" == "FBE - Win32 Release"

# PROP BASE Use_MFC 0
# PROP BASE Use_Debug_Libraries 0
# PROP BASE Output_Dir "Release"
# PROP BASE Intermediate_Dir "Release"
# PROP BASE Target_Dir ""
# PROP Use_MFC 0
# PROP Use_Debug_Libraries 0
# PROP Output_Dir "Release"
# PROP Intermediate_Dir "Release"
# PROP Ignore_Export_Lib 0
# PROP Target_Dir ""
# ADD BASE CPP /nologo /W3 /GX /O2 /D "WIN32" /D "NDEBUG" /D "_WINDOWS" /D "_MBCS" /Yu"stdafx.h" /FD /c
# ADD CPP /nologo /G6 /MD /W3 /GX /Ox /Os /I "wtl" /I "extras" /I "utils" /D "NDEBUG" /D "WIN32" /D "_WINDOWS" /D "_UNICODE" /D "UNICODE" /D "STRICT" /Yu"stdafx.h" /FD /c
# ADD BASE MTL /nologo /D "NDEBUG" /mktyplib203 /win32
# ADD MTL /nologo /D "NDEBUG" /mktyplib203 /win32
# ADD BASE RSC /l 0x419 /d "NDEBUG"
# ADD RSC /l 0x409 /i "wtl" /i "extras" /d "NDEBUG"
BSC32=bscmake.exe
# ADD BASE BSC32 /nologo
# ADD BSC32 /nologo
LINK32=link.exe
# ADD BASE LINK32 kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib /nologo /subsystem:windows /machine:I386
# ADD LINK32 msvcrt.lib kernel32.lib user32.lib gdi32.lib comctl32.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib rpcrt4.lib comsupp.lib urlmon.lib uxtheme.lib shlwapi.lib delayimp.lib $(INTDIR)\buildstamp.obj /nologo /subsystem:windows /machine:I386 /nodefaultlib /opt:nowin98 /opt:ref /opt:icf
# SUBTRACT LINK32 /pdb:none /debug
# Begin Special Build Tool
IntDir=.\Release
SOURCE="$(InputPath)"
PreLink_Cmds=cl /nologo /c /Fo"$(IntDir)\buildstamp.obj" buildstamp.c
# End Special Build Tool

!ELSEIF  "$(CFG)" == "FBE - Win32 Debug"

# PROP BASE Use_MFC 0
# PROP BASE Use_Debug_Libraries 1
# PROP BASE Output_Dir "Debug"
# PROP BASE Intermediate_Dir "Debug"
# PROP BASE Target_Dir ""
# PROP Use_MFC 0
# PROP Use_Debug_Libraries 1
# PROP Output_Dir "Debug"
# PROP Intermediate_Dir "Debug"
# PROP Ignore_Export_Lib 0
# PROP Target_Dir ""
# ADD BASE CPP /nologo /W3 /Gm /GX /ZI /Od /D "WIN32" /D "_DEBUG" /D "_WINDOWS" /D "_MBCS" /Yu"stdafx.h" /FD /GZ /c
# ADD CPP /nologo /MDd /W3 /Gm /GX /ZI /Od /I "wtl" /I "extras" /I "utils" /D "_DEBUG" /D "WIN32" /D "_WINDOWS" /D "_UNICODE" /D "UNICODE" /D "STRICT" /D _ATL_TRACE_LEVEL=4 /Yu"stdafx.h" /FD /GZ /c
# SUBTRACT CPP /Fr
# ADD BASE MTL /nologo /D "_DEBUG" /mktyplib203 /win32
# ADD MTL /nologo /D "_DEBUG" /mktyplib203 /win32
# ADD BASE RSC /l 0x419 /d "_DEBUG"
# ADD RSC /l 0x409 /i "wtl" /i "extras" /d "_DEBUG"
BSC32=bscmake.exe
# ADD BASE BSC32 /nologo
# ADD BSC32 /nologo
LINK32=link.exe
# ADD BASE LINK32 kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib /nologo /subsystem:windows /debug /machine:I386 /pdbtype:sept
# ADD LINK32 msvcrtd.lib kernel32.lib user32.lib gdi32.lib comctl32.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib rpcrt4.lib comsupp.lib urlmon.lib uxtheme.lib shlwapi.lib delayimp.lib $(INTDIR)\buildstamp.obj /nologo /subsystem:windows /debug /machine:I386 /nodefaultlib /pdbtype:sept
# Begin Special Build Tool
IntDir=.\Debug
SOURCE="$(InputPath)"
PreLink_Cmds=cl /nologo /c /Fo"$(IntDir)\buildstamp.obj" buildstamp.c
# End Special Build Tool

!ENDIF 

# Begin Target

# Name "FBE - Win32 Release"
# Name "FBE - Win32 Debug"
# Begin Group "Source Files"

# PROP Default_Filter "cpp;c;cxx;rc;def;r;odl;idl;hpj;bat"
# Begin Source File

SOURCE=.\apputils.cpp
# End Source File
# Begin Source File

SOURCE=.\ExternalHelper.cpp
# End Source File
# Begin Source File

SOURCE=.\FBDoc.cpp
# End Source File
# Begin Source File

SOURCE=.\FBE.cpp
# End Source File
# Begin Source File

SOURCE=.\fbe.idl
# ADD MTL /tlb "FBE.tlb" /h "FBE.h" /iid "FBE_i.c" /Oicf
# End Source File
# Begin Source File

SOURCE=.\FBEview.cpp
# End Source File
# Begin Source File

SOURCE=.\mainfrm.cpp
# End Source File
# Begin Source File

SOURCE=.\OptDlg.cpp
# End Source File
# Begin Source File

SOURCE=.\stdafx.cpp
# ADD CPP /Yc"stdafx.h"
# End Source File
# Begin Source File

SOURCE=.\TreeView.cpp
# End Source File
# Begin Source File

SOURCE=.\utils\Utils.cpp
# End Source File
# Begin Source File

SOURCE=.\Words.cpp
# End Source File
# End Group
# Begin Group "Header Files"

# PROP Default_Filter "h;hpp;hxx;hm;inl"
# Begin Source File

SOURCE=.\apputils.h
# End Source File
# Begin Source File

SOURCE=.\ContainerWnd.h
# End Source File
# Begin Source File

SOURCE=.\ExternalHelper.h
# End Source File
# Begin Source File

SOURCE=.\FBDoc.h
# End Source File
# Begin Source File

SOURCE=.\FBEview.h
# End Source File
# Begin Source File

SOURCE=.\mainfrm.h
# End Source File
# Begin Source File

SOURCE=.\MemProtocol.h
# End Source File
# Begin Source File

SOURCE=.\OptDlg.h
# End Source File
# Begin Source File

SOURCE=.\resource.h
# End Source File
# Begin Source File

SOURCE=.\SearchReplace.h
# End Source File
# Begin Source File

SOURCE=.\stdafx.h
# End Source File
# Begin Source File

SOURCE=.\TreeView.h
# End Source File
# Begin Source File

SOURCE=.\utils\utils.h
# End Source File
# Begin Source File

SOURCE=.\Words.h
# End Source File
# End Group
# Begin Group "Resource Files"

# PROP Default_Filter "ico;cur;bmp;dlg;rc2;rct;bin;rgs;gif;jpg;jpeg;jpe"
# Begin Source File

SOURCE=.\res\ExtraIcons.bmp
# End Source File
# Begin Source File

SOURCE=.\res\FBE.exe.manifest
# End Source File
# Begin Source File

SOURCE=.\res\FBE.ico
# End Source File
# Begin Source File

SOURCE=.\FBE.rc
# End Source File
# Begin Source File

SOURCE=.\res\struct.bmp
# End Source File
# Begin Source File

SOURCE=.\res\toolbar.bmp
# End Source File
# Begin Source File

SOURCE=.\res\wordstat.bmp
# End Source File
# End Group
# Begin Group "extras"

# PROP Default_Filter "cpp;h"
# Begin Source File

SOURCE=.\extras\atlgdix.h
# End Source File
# Begin Source File

SOURCE=.\extras\ColorButton.cpp
# End Source File
# Begin Source File

SOURCE=.\extras\ColorButton.h
# End Source File
# End Group
# Begin Group "wtl"

# PROP Default_Filter "cpp;h"
# Begin Source File

SOURCE=.\wtl\atlapp.h
# End Source File
# Begin Source File

SOURCE=.\wtl\atlcrack.h
# End Source File
# Begin Source File

SOURCE=.\wtl\atlctrls.h
# End Source File
# Begin Source File

SOURCE=.\wtl\atlctrlw.h
# End Source File
# Begin Source File

SOURCE=.\wtl\atlctrlx.h
# End Source File
# Begin Source File

SOURCE=.\wtl\atlddx.h
# End Source File
# Begin Source File

SOURCE=.\wtl\atldlgs.h
# End Source File
# Begin Source File

SOURCE=.\wtl\atlframe.h
# End Source File
# Begin Source File

SOURCE=.\wtl\atlgdi.h
# End Source File
# Begin Source File

SOURCE=.\wtl\atlmisc.h
# End Source File
# Begin Source File

SOURCE=.\wtl\atlprint.h
# End Source File
# Begin Source File

SOURCE=.\wtl\atlres.h
# End Source File
# Begin Source File

SOURCE=.\wtl\atlscrl.h
# End Source File
# Begin Source File

SOURCE=.\wtl\atlsplit.h
# End Source File
# Begin Source File

SOURCE=.\wtl\atltheme.h
# End Source File
# Begin Source File

SOURCE=.\wtl\atluser.h
# End Source File
# End Group
# End Target
# End Project
