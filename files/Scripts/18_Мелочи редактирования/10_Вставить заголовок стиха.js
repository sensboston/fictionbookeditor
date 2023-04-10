function Run() {
  
 function isTitle(gg) {
  if (!gg) return false;
  if (gg.nodeName!="DIV" || !gg.className || gg.className!="title") return false;
  return true;
 }
 
 function InflateIt(elem) {
  if (!elem || elem.nodeType!=1) return;
  if (elem.tagName=="P") {
   window.external.inflateBlock(elem)=true;
   return;
  }
  elem=elem.firstChild;
  while (elem) {
   InflateIt(elem);
   elem=elem.nextSibling;
  }
 }
 
 var versionNum="1.0";
 var range,el,el2,saveNextAfterEl,saveNextAfterEl2,elParent,newTitle,whileFlag;
 var randomNum=Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString();
 var selectionBeginId="addPoemTitleBeginId_"+randomNum;
 var fbw_body=document.getElementById("fbw_body");
 if (!fbw_body) return;
 if (document.selection.type.toLowerCase()!="none") {
  alert("При запуске скрипта не должно быть выделения. Должен быть просто курсор.");
  return;
 } 
 var tr=document.selection.createRange();
 window.external.BeginUndoUnit(document,"вставку заголовка стиха (v"+versionNum+")"); 
 tr.pasteHTML("<B id="+selectionBeginId+"></B>");
 el=document.getElementById(selectionBeginId);
 var selectionIsNone=tr.compareEndPoints("StartToEnd",tr)==0;
 if (selectionIsNone && fbw_body.contains(el)) {
  while (!(el.nodeName=="BODY" ||
           (el.nodeName=="DIV" &&
            (el.className=="poem")
           )
         )) el=el.parentNode;
  if (el.nodeName!="BODY") {
   elParent=el.parentNode;
   if (el.className=="poem")
    if (!isTitle(el.firstChild)) {
     newTitle=document.createElement("DIV");
     newTitle.className="title";
     var pp=document.createElement("P");
     pp.innerText="";
     window.external.inflateBlock(pp) = true;
     newTitle.appendChild(pp);	  
     newTitle=el.insertAdjacentElement("afterBegin",newTitle);
     if (newTitle) GoTo(newTitle);
     // InflateIt(newTitle);
    } // if (!isTitle(el.firstChild))
    else if (el.firstChild) GoTo(el.firstChild)
     else GoTo(el);
   saveNextAfterEl=el.nextSibling;
  } // if (el.nodeName!="BODY")
  document.getElementById(selectionBeginId).removeNode(true);
 } // if (selectionIsNone && fbw_body.contains(el))
 else {
  alert("При запуске скрипта не должно быть выделения. Должен быть просто курсор.");
  el.removeNode(false);
 }
 window.external.EndUndoUnit(document);
}
