# Инструкция по созданию новых setup-ов FBE

## Пререквизиты:

1. Установите систему инсталляции NSIS: \NSIS\nsis-2.46.5-Unicode-setup.exe 
2. Скопируйте файлы:
   \NSIS\UAC.dll -> C:\Program Files (x86)\NSIS\Unicode\Plugins
   \NSIS\UAC.nsh -> C:\Program Files (x86)\NSIS\Unicode\Include 


## Создание новой инсталляции:

1. Все обновленные файлы FBE (читай - обновлённые скрипты) должны быть скопированы в **\Installer\Input**, в сответствующие папки
2. Измените (при желании) timestamp и версию билда FBE.exe, для этого нужно запустить утилиту **update_fbe.exe 2.7.0** 
(где 2.7.0 - это версия нового релиза; FBE.exe должен находиться в той-же папке, что и update_fbe.exe)
3. Измените версию FBE в теге program-used в файле blank.fb2.
4. Измените версию релиза в скрипте инсталлятора \Installer\MakeInstaller.nsi (строка #2):
```
!define PRODUCT_VER_NUM "2.7.0"
```
5. Запустите файл MakeInstaller.bat; по завершении работы он должен создать установочную exe-версию
6. Чтобы работала встроенная в FBE система обновлений, отредактируйте файл update.xml на GitHub-е:
https://github.com/sensboston/fictionbookeditor/edit/master/update.xml 
обновите версию, дату, ссылку на новый релиз (в виде exe) и MD5 executable нового релиза. 
Посчитать новый MD5 можно, например, вот тут: https://toolslick.com/programming/hashing/md5-calculator
Внимание: после редактирования этого файла должно пройти определенное время, пока он обновится в raw виде,
т.е. изменения станут видны на https://raw.githubusercontent.com/sensboston/fictionbookeditor/master/update.xml 

Примечание: программку update_fbe.cs можно скомпилировать в исполняемый файл командой:
```C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe update_fbe.cs```

Visual Studio для этого не нужна
