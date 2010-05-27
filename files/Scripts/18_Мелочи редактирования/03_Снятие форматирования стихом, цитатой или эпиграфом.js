function Run() {
 var versionNum="1.3";
 var range,el,el2,saveNextAfterEl,saveNextAfterEl2,elParent;
 var randomNum=Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString();
 var selectionBeginId="removePoemOrCiteBeginId_"+randomNum;
 var selectionEndId="removePoemOrCiteEndId"+randomNum;
 var fbw_body=document.getElementById("fbw_body");
 if (!fbw_body) return;
 if (document.selection.type.toLowerCase()!="none") {
  alert("При запуске скрипта не должно быть выделения. Должен быть просто курсор.");
  return;
 } 
 var tr=document.selection.createRange();
 window.external.BeginUndoUnit(document,"снятие форматирования стихом, цитатой или эпиграфом (v"+versionNum+")"); 
 tr.pasteHTML("<B id="+selectionBeginId+"></B>");
 el=document.getElementById(selectionBeginId);
 var selectionIsNone=tr.compareEndPoints("StartToEnd",tr)==0;
 if (selectionIsNone && fbw_body.contains(el)) {
  while (!(el.nodeName=="BODY" ||
           (el.nodeName=="DIV" &&
            (el.className=="poem" || el.className=="epigraph" || el.className=="cite")
           )
         )) el=el.parentNode;
  if (el.nodeName!="BODY") {
   elParent=el.parentNode;
   if (el.className=="poem") {
    el2=el.firstChild;
    while (el2!=el) {
     saveNextAfterEl2=el2;
     if (saveNextAfterEl2.firstChild && saveNextAfterEl2.nodeName!="P") 
      saveNextAfterEl2=saveNextAfterEl2.firstChild;
     else {
      while (saveNextAfterEl2!=el && saveNextAfterEl2.nextSibling==null)
       saveNextAfterEl2=saveNextAfterEl2.parentNode;
      if (saveNextAfterEl2!=el) saveNextAfterEl2=saveNextAfterEl2.nextSibling;
     } 
     if (el2.nodeName=="DIV" && (el2.className=="stanza" || el2.className=="epigraph")) 
      el2.removeNode(false);
     else if (el2.nodeName=="P" && el2.className=="text-author" && el2.parentNode==el) {
      el2.removeAttribute("class");
      el2.removeAttribute("className");
     } 
     el2=saveNextAfterEl2;
    }
   } else if (el.className=="cite" || el.className=="epigraph") {
    el2=el.firstChild;
    while (el2!=null) {
     if (el2.nodeName=="P" && el2.className=="text-author") {
      el2.removeAttribute("class");
      el2.removeAttribute("className");
     }
     el2=el2.nextSibling;
    }
   }
   saveNextAfterEl=el.nextSibling;
   el.removeNode(false);
   if (saveNextAfterEl==null)
    InflateIt(elParent.lastChild);
   else
    InflateIt(saveNextAfterEl.previousSibling);     
   InflateIt(elParent);
  } 
  document.getElementById(selectionBeginId).removeNode(true);
 }
 else {
  alert("При запуске скрипта не должно быть выделения. Должен быть просто курсор.");
  el.removeNode(false);
 }
 window.external.EndUndoUnit(document);
}
