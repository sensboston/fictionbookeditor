//Скрипт «Сделать обычный рисунок из рисунка в тексте.js»
//Версия 1.0

function Run() {
 var sel=document.selection;
 if (sel.type!="Control") {
  alert("Картинка не выделена, скрипту нечего делать.");
  return;
 }
 if (sel.createRange().length==1) {
  var span=sel.createRange().item(0);
  if (span.nodeName!="SPAN") {
   alert("Выделена не инлайн-картинка.");
   return;
  }
  //alert(span.outerHTML);
  var strstr='<DIV class=image contentEditable=false onresizestart="return false" href="#undefined">';
  var p=span;
  while (p.nodeName!="P" && p.nodeName!="BODY") p=p.parentNode;
  if (p.nodeName=="P") {
   //alert("p: "+p.outerHTML);
   var el=p.firstChild;
   while (el!=p) {
    if (el.nodeType==3) return;
    if (el.firstChild) 
     el=el.firstChild;
    else {
     while (el!=p && el.nextSibling==null) el=el.parentNode;
     if (el!=p) el=el.nextSibling;
    } 
   }
   if (span.firstChild && span.firstChild.nodeName=="IMG") {
    window.external.BeginUndoUnit(document,"uninline image");
    var myHref=span.getAttribute("href");
    p.insertAdjacentHTML("afterEnd",strstr+span.firstChild.outerHTML+"</DIV>");
    var div=p.nextSibling;
    div.setAttribute("href",myHref);
    p.removeNode(true);
    window.external.EndUndoUnit(document);
   } 
  } 
 }
} 