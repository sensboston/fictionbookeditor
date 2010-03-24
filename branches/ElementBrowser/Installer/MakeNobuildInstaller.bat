@ECHO OFF

del .\*.exe
rd .\Input /S /Q

md .\Input

if not exist ..\Release\FBE.exe goto err
if not exist ..\Release\res_rus.dll goto err
if not exist ..\Release\FBSHell.dll goto err

goto ok

:err
echo "No full Release build exist in ..\Release!"
exit /b 1

:ok
copy ..\Release\res_rus.dll .\Input
copy ..\Release\FBE.exe .\Input\
copy ..\Release\FBShell.dll .\Input\
xcopy ..\files\*.* .\Input\ /E /Y

makensis MakeInstaller.nsi