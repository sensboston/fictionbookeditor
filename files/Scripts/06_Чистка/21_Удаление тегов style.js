//Скрипт «Удаление тегов style» v1.0
//Автор Sclex

function Run() {
 var fbwBody=document.getElementById("fbw_body");
 var ptr=fbwBody.firstChild;
 var saveNext, firstRemoving=true;
 while (ptr && ptr!=fbwBody) {
  if (ptr.firstChild)
   saveNext=ptr.firstChild;
  else {
   saveNext=ptr;
   while (saveNext!=fbwBody && saveNext.nextSibling==null) saveNext=saveNext.parentNode;
   if (saveNext!=fbwBody) saveNext=saveNext.nextSibling;
  }
  if (ptr.nodeName.toUpperCase()=="SPAN" && ptr.className!="code" && ptr.className!="image") {
   if (firstRemoving) {
    window.external.BeginUndoUnit(document,"удаление тегов style");
    firstRemoving=false;
   }
   ptr.removeNode(false);
  } 
  ptr=saveNext;
 }
 if (!firstRemoving) window.external.EndUndoUnit(document);
}