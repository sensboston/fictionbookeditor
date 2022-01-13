// Скрипт "Автозапуск скриптов по списку"
// Версия 1.2
// Автор Sclex

function Run() {
 window.RunSubscripts=function() {
   apiRunCmd("c:\\\\program files\\\\fbe 2.6.7\\\\scripts\\\\06_Чистка\\\\45_Удалить атрибуты id, на которые нет ссылок, и теги style.js");
   apiRunCmd("c:\\\\program files\\\\fbe 2.6.7\\\\scripts\\\\06_Чистка\\\\02_Генеральная уборка.js");
   setTimeout("window.RunSubscripts=undefined;",0);
 }
 setTimeout("RunSubscripts()",0);
}