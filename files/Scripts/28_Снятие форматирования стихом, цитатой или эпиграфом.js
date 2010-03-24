function Run() {
 var versionNum="1.0";
 var range,el,el2,saveNextAfterEl,saveNextAfterEl2,elParent;
 var randomNum=Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString();
 var selectionBeginId="removePoemOrCiteBeginId_"+randomNum;
 var selectionEndId="removePoemOrCiteEndId"+randomNum;
 var fbw_body=document.getElementById("fbw_body");
 if (!fbw_body) return;
 
 if (document.selection.type.toLowerCase()=="none") {
  document.selection.createRange().pasteHTML("<B id="+selectionBeginId+"></B>");
  el=document.getElementById(selectionBeginId);
  if (fbw_body.contains(el)) {
   window.external.BeginUndoUnit(document,"снятие форматирования стихом, цитатой или эпиграфом (v"+versionNum+")");
   while (!(el.nodeName=="BODY" ||
            (el.nodeName=="DIV" &&
             (el.className.toLowerCase()=="poem" || el.className.toLowerCase()=="epigraph" || el.className.toLowerCase()=="cite")
            )
          )) el=el.parentNode;
   if (el.nodeName!="BODY") {
    elParent=el.parentNode;
    if (el.className.toLowerCase()=="poem") {
     el2=el.firstChild;
     while (el2!=null) {
      saveNextAfterEl2=el2.nextSibling;
      if (el2.nodeName=="DIV" && el2.className.toLowerCase()=="stanza") {
       el2.outerHTML=el2.innerHTML;
       if (saveNextAfterEl2==null)
        InflateIt(el.lastChild);
       else
        InflateIt(saveNextAfterEl2.previousSibling); 
      } 
      el2=saveNextAfterEl2;
     }
    }
    saveNextAfterEl=el.nextSibling;
    el.outerHTML=el.innerHTML;
    if (saveNextAfterEl==null)
     InflateIt(elParent.lastChild);
    else
     InflateIt(saveNextAfterEl.previousSibling);     
    InflateIt(elParent);
   } 
   document.getElementById(selectionBeginId).removeNode(true);
   window.external.EndUndoUnit(document);   
  }
 }
}
