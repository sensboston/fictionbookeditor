// Скрипт "Автозапуск скриптов по списку"
// Версия 1.1
// Автор Sclex

function Run() {
  window.Run2=function() {
    apiRunCmd("c:\\\\program files\\\\fbe 2.6.7\\\\scripts\\\\06_Чистка\\\\45_Удалить атрибуты id, на которые нет ссылок, и теги style.js");
    apiRunCmd("c:\\\\program files\\\\fbe 2.6.7\\\\scripts\\\\06_Чистка\\\\02_Генеральная уборка.js");
  }
 window.setTimeout("Run2();",0);
}