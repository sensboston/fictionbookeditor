// Скрипт "удалить все вложения из книги"
// Версия 1.3

function Run() {
 if (!AskYesNo("\n     Вы действительно хотите \nудалить ВСЕ вложения из книги?  \n")) return;
 window.external.BeginUndoUnit(document,"удаление бинарников");
 var bins=document.all.binobj.getElementsByTagName("DIV");
 var ptr=document.all.binobj.firstChild;
 var GoMore=true;
 var HtmlStr="";
 while (GoMore) {
  if (ptr) {
   if (ptr.nodeName!="DIV") { 
    HtmlStr+=ptr.outerHTML; 
    ptr=ptr.nextSibling; 
   }
   else GoMore=false;
  } else GoMore=false;
 }
 document.all.binobj.innerHTML=HtmlStr;
 PutSpacers(document.all.binobj);
 var imgs=document.getElementsByTagName("IMG");
 for (var i=imgs.length-1; i>=0; i--) {
  var MyImg=imgs[i];
  var pic_id=MyImg.src; 
  MyImg.src=""; 
  MyImg.src=pic_id;
 }
 FillCoverList();
 window.external.EndUndoUnit(document);
 MsgBox("\n    Работа скрипта завершена,\nвсе бинарные объекты удалены. \n");
}