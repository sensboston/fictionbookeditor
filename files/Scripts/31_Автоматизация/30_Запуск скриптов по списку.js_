// Скрипт "Запуск скриптов по списку"
// Версия 1.3
// Автор Sclex

function Run() {
 window.RunSubscripts=function() {
   // Команда, задающая папку скриптов:
   scriptsFolder("c:\\program files\\fbe 2.6.7\\scripts");
   
   // Команда, запускающая скрипт из заданной папки скриптов
   // (можно сделать несколько таких строк):
   runScriptInFolder("06_Чистка\\02_Генеральная уборка.js");
   
   // Команда, запускающая скрипт по полному пути
   // (можно сделать несколько таких строк):
   runScript("c:\\program files\\fbe 2.6.7\\scripts\\06_Чистка\\03_Латиница в Кириллице.js");
   
   setTimeout("window.RunSubscripts=undefined; window.scriptsFolderVar=undefined;",0);
   
   function scriptsFolder(path) {
     window.scriptsFolderVar=path;
   }
   
   function runScriptInFolder(path) {
     var fullPath=window.scriptsFolderVar;
     if (!fullPath) {
       MsgBox("В скрипте для запуска скриптов вы используете команду runScriptInFolder, но вы не задали путь к папке скриптов командой scriptsFolder.");
       return;
     }
     if (fullPath.substr(fullPath.length-1,1)!="\\" && path.substr(0,1)!="\\")
       fullPath+="\\";
     fullPath+=path;
     apiRunCmd(fullPath);
   }
   
   function runScript(path) {
     apiRunCmd(path);
   }
 }
 setTimeout("RunSubscripts()",0);
}