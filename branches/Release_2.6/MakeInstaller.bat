@ECHO OFF

rd .\Input /S /Q

devenv ..\FBE.sln /clean Release
devenv ..\FBE.sln /build Release

md .\Input
    
copy ..\Release\FBE.exe .\Input\
copy ..\Release\res_rus.dll .\Input\
copy ..\Release\res_ukr.dll .\Input\
copy ..\Release\FBSHell.dll .\Input\
xcopy ..\files\*.* .\Input\ /E /Y

"C:\Program Files\NSIS\Unicode\makensis" MakeInstaller.nsi