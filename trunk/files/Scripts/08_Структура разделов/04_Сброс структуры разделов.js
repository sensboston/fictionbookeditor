//version 1.0

function Run() {

 var newSect;

 function rec(el) {
  var saveNext,saveNext2,el2;
  while (el) {
   saveNext=el.nextSibling;
   if (el.nodeName=="DIV" && el.className=="section") {
    el2=el.firstChild;    while (el2 && !(el2.nodeName=="DIV" && el2.className=="section"))
     el2=el2.nextSibling;
    if (el2) {
     var el2=el.firstChild;
     while (el2 && (el2.nodeName=="DIV" && el2.className=="section"))
      el2=el2.nextSibling;
     if (el2) {
      newSect=document.createElement("DIV");
      newSect.className="section";
      newSect.id=el.id;
      newSect=el.insertAdjacentElement("afterBegin",newSect);
      while (el2) {
       saveNext2=el2.nextSibling;
       if (el2.nodeName!="DIV" || el2.className!="section") {
        el2=el2.removeNode(true);
        newSect.insertAdjacentElement("beforeEnd",el2);
       }
       el2=saveNext2;
      }
     }
     el.removeNode(false);
    }
   }
   if (el.nodeName=="DIV" && el.className=="body" && el.firstChild)
    rec(el.firstChild);
   el=saveNext;
  }
 }

 window.external.BeginUndoUnit(document,"structure reset");
 var fbwBody=document.getElementById("fbw_body");
 if (!fbwBody) return;
 if (fbwBody.firstChild) rec(fbwBody.firstChild);
 window.external.EndUndoUnit(document);
}