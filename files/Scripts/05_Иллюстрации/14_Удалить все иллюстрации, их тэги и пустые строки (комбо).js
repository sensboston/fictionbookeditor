// Скрипт "Удаление картинок и чистка тэгов (комбо)"
// Скрипт предназначен для полного удаления всех иллюстраций, их тэгов, пустых строк вокруг иллюстраций

// Основано на скрипте "Запуск скриптов по списку"
// Версия 1.3
// Автор Sclex

function Run() {
 window.RunSubscripts=function() {
   // Команда, задающая папку скриптов:
   // scriptsFolder(document.location.href.replace("file:///", "").replace(/main\.html$/, "Scripts"));
   scriptsFolder(document.getElementById("userCmd").getAttribute("src").replace("file:///", "").replace(/\\[^\\]+?\\[^\\]+?$/, ""));
   
   // Команда, запускающая скрипт из заданной папки скриптов
   // (можно сделать несколько таких строк):

   runScriptInFolder("05_Иллюстрации\\06_Добавить либо удалить пустые строки возле иллюстраций....js");
   runScriptInFolder("05_Иллюстрации\\05_Удалить все вложения.js");
   runScriptInFolder("05_Иллюстрации\\02_Унифицировать иллюстрации и вложения.js");
   runScriptInFolder("05_Иллюстрации\\07_Удалить неиспользуемые вложения....js");
   runScriptInFolder("05_Иллюстрации\\10_Удалить все теги иллюстраций - теги image.js");
   runScriptInFolder("06_Чистка\\40_Удалить теги style, id разделов, id абзацев и id картинок.js");
   runScriptInFolder("13_Заголовки, подзаголовки, пустые строки\\528_Разметка подзаголовков, чистка пустых строк, удаление жирности и курсива в заголовках.js");
  
   // Команда, запускающая скрипт по полному пути
   // (можно сделать несколько таких строк):
   // runScript("C:\\Program Files (x86)\\FictionBook Editor_2.7.4\\Scripts\\06_Чистка\\03_Латиница в Кириллице.js");
   
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