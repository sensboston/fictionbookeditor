// Скрипт "Удалить теги style, id разделов, id абзацев и id картинок v1.0" 
// Автор Sclex

function Run() {
 var fbwBody=document.getElementById("fbw_body");
 var ptr=fbwBody.firstChild;
 var replaceCounter3=0;
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
    window.external.BeginUndoUnit(document,"удаление тегов style, id разделов, id абзацев и id картинок");
    firstRemoving=false;
   }
   ptr.removeNode(false);
   replaceCounter3+=1;
  } 
  ptr=saveNext;
 }

 var fbwBody=document.getElementById("fbw_body");
 var elems=fbwBody.getElementsByTagName("DIV");
 var elem, elem2, elems2, i, j;
 var replaceCounter1=0;
 for (var i=0; i<elems.length; i++) {
  elem=elems[i];
  if (elem.className && elem.className.toLowerCase()=="body") {
   elems2=elem.getElementsByTagName("P");
   for (var j=0; j<elems2.length; j++) {
    elem2=elems2[j];
    if (elem2.getAttribute("id")!=null && elem2.getAttribute("id")!="") {
     if (firstRemoving) {
      window.external.BeginUndoUnit(document,"удаление тегов style, id разделов, id абзацев и id картинок");
      firstRemoving=false;
     }
     elem2.removeAttribute("id");
     replaceCounter1+=1;
    }
   }
  }
 }

 var fbwBody=document.getElementById("fbw_body");
 var elems=fbwBody.getElementsByTagName("DIV");
 var elem, elem2, elems2, i, j;
 var replaceCounter2=0;
 for (var i=0; i<elems.length; i++) {
  elem=elems[i];
  if (elem.className && elem.className.toLowerCase()=="body" && elem.getAttribute("fbname")!="notes" && elem.getAttribute("fbname")!="comments") {
   elems2=elem.getElementsByTagName("DIV");
   for (var j=0; j<elems2.length; j++) {
    elem2=elems2[j];
    if (elem2.className && elem2.className=="section" && elem2.getAttribute("id")!=null && elem2.getAttribute("id")!="") {
     if (firstRemoving) {
      window.external.BeginUndoUnit(document,"удаление тегов style, id разделов, id абзацев и id картинок");
      firstRemoving=false;
     }
     elem2.removeAttribute("id");
     replaceCounter2+=1;
    }
   }
  }
 }

 var fbwBody=document.getElementById("fbw_body");
 var elems=fbwBody.getElementsByTagName("DIV");
 var firstRemoving=true;
 var elem, elem2, elems2, i, j;
 var replaceCounter4=0;
 for (var i=0; i<elems.length; i++) {
  elem=elems[i];
  if (elem.className && elem.className.toLowerCase()=="body") {
   elems2=elem.getElementsByTagName("DIV");
   for (var j=0; j<elems2.length; j++) {
    elem2=elems2[j];
    if (elem2.className && elem2.className=="image" && elem2.getAttribute("id")!=null && elem2.getAttribute("id")!="") {
     if (firstRemoving) {
      window.external.BeginUndoUnit(document,"удаление тегов style, id разделов, id абзацев и id картинок");
      firstRemoving=false;
     }
     elem2.removeAttribute("id");
     replaceCounter4+=1;
    }
   }
  }
 }
 if (!firstRemoving) window.external.EndUndoUnit(document);
 MsgBox("Всего удалено тегов style: "+replaceCounter3+"\n"+
                  "Всего удалено id абзацев: "+replaceCounter1+"\n"+
                  "Всего удалено id разделов: "+replaceCounter2+"\n"+
                  "Всего удалено id картинок: "+replaceCounter4);
}
