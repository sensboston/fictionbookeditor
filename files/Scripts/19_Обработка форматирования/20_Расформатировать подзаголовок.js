function Run() {
 var versionNum="1.0";

 var range,el,el2,el3,saveNextAfterEl,saveNextAfterEl2;
 var elParent,i,j,divs,ps,saveClassName;
 var randomNum=Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+
         Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+
      Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString();
 var selectionBeginId="removePoemOrCiteBeginId_"+randomNum;
 var selectionEndId="removePoemOrCiteEndId"+randomNum;
 var fbw_body=document.getElementById("fbw_body");
 if (!fbw_body) return;
 if (document.selection.type.toLowerCase()!="none" && document.selection.type.toLowerCase()!="text") return;
 var tr=document.selection.createRange();
 tr.collapse(true);
 window.external.BeginUndoUnit(document,"расформатирование подзаголовком (v"+versionNum+")");
 tr.pasteHTML("<B id="+selectionBeginId+"></B>");
 el=document.getElementById(selectionBeginId);
 if (fbw_body.contains(el)) {
  while (el.nodeName!="BODY" && el.nodeName!="P") el=el.parentNode;
  if (el.nodeName=="P" && el.className=="subtitle") {
   // ниже пришлось написать несколько сложный код,
   // т.к. более простой вариант в IE6 работал с ошибкой
   var el2=el.cloneNode(true);  
   el2.removeAttribute("className");
   el.outerHTML=el2.outerHTML;
   el.innerHTML=el2.innerHTML;
  }
 }
 if (document.getElementById(selectionBeginId))
  document.getElementById(selectionBeginId).removeNode(true);
 window.external.EndUndoUnit(document);
}