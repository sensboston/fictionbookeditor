// Скрипт "Автоматическая чистка простых текстов"
// Версия 1.3
// Автор Sclex

function Run() {
 window.RunSubscripts=function() {
   // Команда, задающая папку скриптов:
   // scriptsFolder(document.location.href.replace("file:///", "").replace(/main\.html$/, "Scripts"));
   scriptsFolder(document.getElementById("userCmd").getAttribute("src").replace("file:///", "").replace(/\\[^\\]+?\\[^\\]+?$/, ""));
   

   // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!======================!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
   // Тут сами пользовательские команды поиска и обработки:

   // Команда, запускающая скрипт из заданной папки скриптов
   // (можно сделать несколько таких строк):
   runScriptInFolder("08_Структура разделов\\13_Почистить структуру.js");
   runScriptInFolder("06_Чистка\\02_Генеральная уборка.js");
   runScriptInFolder("06_Чистка\\40_Удалить теги style, id разделов, id абзацев и id картинок.js");
   runScriptInFolder("06_Чистка\\50_Расформатировать ссылки, адрес которых - пустая строка.js");
   runScriptInFolder("06_Чистка\\17_Превратить внешние ссылки в текст.js");
   runScriptInFolder("06_Чистка\\55_Удалить ссылки 'bookmark', созданные FBD.js");
   runScriptInFolder("13_Заголовки, подзаголовки, пустые строки\\528_Разметка подзаголовков, чистка пустых строк, удаление жирности и курсива в заголовках.js");
   runScriptInFolder("13_Заголовки, подзаголовки, пустые строки\\529_Удаление жирности и курсива в заголовках и подзаголовках.js");
   runScriptInFolder("06_Чистка\\68_Генеральная уборка (версия Александра Ка).js");

   // Конец пользовательских строк с командами

   // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!======================!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  
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