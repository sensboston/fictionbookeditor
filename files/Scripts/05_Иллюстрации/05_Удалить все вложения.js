// Скрипт "Удалить все вложения"
// Версия 1.4

function Run() {
 if (!AskYesNo("Вы действительно хотите удалить все вложения из документа?")) return;
 window.external.BeginUndoUnit(document,"удаление всех вложений");
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
 MsgBox("Работа скрипта завершена, все вложения удалены из документа.");
}