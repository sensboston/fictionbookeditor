// Скрипт "Установить курсор в начало документа"
// Автор Sclex
// Версия 1.0

function Run() {
 var fbwBody=document.getElementById("fbw_body");
 if (!fbwBody) return;
 var tr=document.body.createTextRange();
 tr.moveToElementText(fbwBody);
 tr.collapse(true);
 if (tr.move("character",1)==1)
  tr.move("character",-1);
 tr.select();
 window.scroll(0, 0);
}