@ECHO ON

del .\*.exe
rd .\input /S /Q

devenv ..\FBE.sln /clean Release
devenv ..\FBE.sln /build Release

md .\input
    
copy ..\Release\FBE.exe .\input\
copy ..\Release\res_rus.dll .\input\
xcopy ..\files\*.* .\input\ /E /Y

ECHO ==========================

makensis makeinstaller.nsi