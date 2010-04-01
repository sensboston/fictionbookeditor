@ECHO OFF

if not exist .\Input goto make_input
rd .\Input /S /Q

:make_input
md .\Input

if not exist ..\Release\FBE.exe goto err
if not exist ..\Release\res_rus.dll goto err
if not exist ..\Release\res_ukr.dll goto err
if not exist ..\Release\FBSHell.dll goto err

goto ok

:err
echo "No full Release build exist in ..\Release!"
exit /b 1

:ok
copy ..\Release\res_rus.dll .\Input >NUL
copy ..\Release\res_ukr.dll .\Input >NUL
copy ..\Release\FBE.exe .\Input\ >NUL
copy ..\Release\FBShell.dll .\Input\ >NUL
xcopy ..\files\*.* .\Input\ /E /Y >NUL

"C:\Program Files\NSIS\Unicode\makensis" MakeInstaller.nsi