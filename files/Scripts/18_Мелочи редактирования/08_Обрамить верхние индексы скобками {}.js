// Скрипт «Обрамить верхние индексы скобками {}» v1.0

function Run() {
 var fbw_body=document.getElementById("fbw_body");
 var el=fbw_body.firstChild;
 var el2;
 var foundSup=false;
 var cnt=0;
 while (el && el!=fbw_body) {
  if (el.nodeName=="SUP") {
   el2=el.firstChild;
   while (el2 && el2.nodeType==1 && el2.nodeName!="IMG") el2=el2.firstChild;
   if (el2) {
    if (!foundSup) {
     window.external.BeginUndoUnit(document,"обрамление верхних индексов скобками {}");
     foundSup=true;
    }
    cnt++;
    if (el2.nodeType==3) el2.nodeValue="{"+el2.nodeValue;
    else el2.parentNode.insertBefore(document.createTextNode("{"),el2);
   }
   el2=el.lastChild;
   while (el2 && el2.nodeType==1 && el2.nodeName!="IMG") el2=el2.lastChild;
   if (el2) {
    if (!foundSup) {
     window.external.BeginUndoUnit(document,"обрамление верхних индексов скобками {}");
     foundSup=true;
    }   
    if (el2.nodeType==3) el2.nodeValue=el2.nodeValue+"}";
    else el2.parentNode.appendChild(document.createTextNode("}"));
   }
  }
  if (el.firstChild && el.nodeName!="SUP")
   el=el.firstChild;
  else {
   while (el && el!=fbw_body && !el.nextSibling) el=el.parentNode;
   if (el!=fbw_body) el=el.nextSibling;
  }
 }
 if (foundSup) {
  window.external.EndUndoUnit(document);
  alert("Обрамлено скобками {} содержимое\nследующего количества тегов SUP:\n   "+cnt);
 } 
 else alert("Верхних индексов в документе не обнаружено.");
}