function Run() {
 var versionNum="2.3";

 var range,el,el2,el3,saveNextAfterEl,saveNextAfterEl2;
 var elParent,i,j,divs,ps,saveClassName;
 var randomNum=Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+
         Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+
      Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString();
 var selectionBeginId="removePoemOrCiteBeginId_"+randomNum;
 var selectionEndId="removePoemOrCiteEndId"+randomNum;
 var fbw_body=document.getElementById("fbw_body");
 if (!fbw_body) return;
 if (document.selection.type.toLowerCase()!="none") return;
 var tr=document.selection.createRange();
 window.external.BeginUndoUnit(document,"снятие форматирования блочным элементом (v"+versionNum+")");
 tr.pasteHTML("<B id="+selectionBeginId+"></B>");
 el=document.getElementById(selectionBeginId);
 var selectionIsNone=tr.compareEndPoints("StartToEnd",tr)==0;
 if (selectionIsNone && fbw_body.contains(el)) {
  while (!(el.nodeName=="BODY" ||
           (el.nodeName=="DIV" &&
            (el.className=="poem" || el.className=="epigraph" || el.className=="cite" ||
             el.className=="title" || el.className=="annotation" || el.className=="table")
           )
         )) el=el.parentNode;
  if (el.nodeName=="DIV" && el.className=="title" && el.parentNode.nodeName=="DIV" && el.parentNode.className=="poem")
   el=el.parentNode;
  else if (el.nodeName=="DIV" && el.className=="epigraph" && el.parentNode.nodeName=="DIV" && el.parentNode.className=="poem")
   el=el.parentNode;

  if (el.nodeName!="BODY") {
   saveClassName=el.className;
   elParent=el.parentNode;
   var el3=el;
   if ((el.className=="title" || el.className=="epigraph" || el.className=="annotation")
        && elParent.className=="section") {
    var el3=el;
    while (el3 && el3.nodeName=="DIV" && (el3.className=="title" || el3.className=="epigraph" || el3.className=="annotation"))
     el3=el3.nextSibling;
   } else el3=null;
   if (el3 && el3.nodeName=="DIV" && el3.className=="section") {
    var newSection=document.createElement("DIV");
    newSection.className="section";
    newSection=el3.insertAdjacentElement("beforeBegin",newSection);
    var el4=newSection.previousSibling;
    var previousNode;
    while (el4) {
     previousNode=el4.previousSibling;
     el4=el4.removeNode(true);
     newSection.insertAdjacentElement("afterBegin",el4);
     el4=previousNode;
    }
    unformatDivsAndParagraphsInsideElement(newSection);
   }
   else if (el.className=="poem") {
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
     if (el2.nodeName=="DIV" && el2.className=="stanza") {
      if (el2.nextSibling)
        if (el2.nextSibling.nodeName=="DIV" && el2.nextSibling.className=="stanza") {
         el2.insertAdjacentHTML("beforeEnd","<P"+">&nbsp;<"+"/P>");
         InflateIt(el2);
        }
      el2.removeNode(false);
     }
     el2=saveNextAfterEl2;
    }
    unformatDivsAndParagraphsInsideElement(el);
   } else if (el.className=="cite") {
    unformatDivsAndParagraphsInsideElement(el);
   } else if (el.className=="epigraph") {
    var el3=el;
    var nextNode3=el3.nextSibling;
    while (el3 && el3.className && (el3.className=="epigraph" || el3.className=="annotation")) {
     unformatDivsAndParagraphsInsideElement(el3);
     el3.removeNode(false);
     el3=nextNode3;
     nextNode3=el3.nextSibling;
    }
   } else if (el.className=="title") {
    var el3=el.nextSibling;
    var nextNode3=el3.nextSibling;
    while (el3 && el3.className && (el3.className=="epigraph" || el3.className=="annotation")) {
     unformatDivsAndParagraphsInsideElement(el3);
     el3.removeNode(false);
     el3=nextNode3;
     nextNode3=el3.nextSibling;
    }
    unformatDivsAndParagraphsInsideElement(el);
   } else if (el.className=="table") {
    divs=el.getElementsByTagName("DIV");
    for (var i=divs.length-1; i>=0; i--)
     if (divs[i].nodeName=="DIV" && divs[i].className && divs[i].className=="tr")
      divs[i].removeNode(false);
     ps=el.getElementsByTagName("P");
     for (j=0; j<ps.length; j++)
      if (ps[j].className && (ps[j].className=="td" || ps[j].className=="th")) {
       ps[j].removeAttribute("className");
       ps[j].removeAttribute("fbalign");
       ps[j].removeAttribute("fbvalign");
       ps[j].removeAttribute("fbcolspan");
       ps[j].removeAttribute("fbrowspan");
       ps[j].removeAttribute("id");
       ps[j].removeAttribute("fbstyle");
      }
   }
   saveNextAfterEl=el.nextSibling;
   if (el.className!="annotation")
    el.removeNode(false);
   else
     if (thereIsParentBodyDiv(el))
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
 
 // нижеследующие функции пришлось перенести в конец скрипта,
 // т.к. иначе IE выдавал ошибку "Незавершенная строковая константа"
 function unformatDivsAndParagraphsInsideElement(elem) {
  var divs, ps, i;
  divs=elem.getElementsByTagName("DIV");
  ps=elem.getElementsByTagName("P");
  for (i=0;i<ps.length;i++) {
   ps[i].removeAttribute("class");
   ps[i].removeAttribute("className");
  }
  for (i=divs.length-1;i>=0;i--) {
   if (divs[i].className!="image") divs[i].removeNode(false);
  }
  return;
 }
  
 function thereIsParentBodyDiv(ptr) {
  while (ptr && ptr.nodeName && ptr.nodeName!="BODY" &&
   !(ptr.nodeName=="DIV" && ptr.className && ptr.className=="body"))
   ptr=ptr.parentNode;
  if (ptr && ptr.nodeName=="DIV" && ptr.className && ptr.className=="body")
   return true;
  else
   return false;
 }
 
}