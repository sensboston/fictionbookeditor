//скрипт "Превращение внешних ссылок в текст"
//Автор Sclex
//Версия 1.0
//Топик про скрипты FBE: http://www.fictionbook.org/forum/viewtopic.php?t=4412
//Мой сайт про мои скрипты: http://scripts.fictionbook.org

function Run() {
 window.external.BeginUndoUnit(document,"превращение внешних ссылок в текст");
 var re1=new RegExp("^ *?(file://|#)","i");
 for (i=document.links.length-1;i>=0;i--)
  if (document.links[i].getAttribute("href").search(re1)<0) document.links[i].outerHTML=document.links[i].innerHTML;
 window.external.EndUndoUnit(document);
}