// Скрипт "Удалить id картинок v1.0" 
// Автор Sclex

function Run() {
 var fbwBody=document.getElementById("fbw_body");
 var elems=fbwBody.getElementsByTagName("DIV");
 var firstRemoving=true;
 var elem, elem2, elems2, i, j;
 var replaceCounter=0;
 for (var i=0; i<elems.length; i++) {
  elem=elems[i];
  if (elem.className && elem.className.toLowerCase()=="body") {
   elems2=elem.getElementsByTagName("DIV");
   for (var j=0; j<elems2.length; j++) {
    elem2=elems2[j];
    if (elem2.className && elem2.className=="image" && elem2.getAttribute("id")!=null && elem2.getAttribute("id")!="") {
     if (firstRemoving) {
      window.external.BeginUndoUnit(document,"удаление id картинок");
      firstRemoving=false;
     }
     elem2.removeAttribute("id");
     replaceCounter+=1;
    }
   }
  }
 }
 if (!firstRemoving) window.external.EndUndoUnit(document);
 MsgBox("Всего удалено id картинок: "+replaceCounter);
}
