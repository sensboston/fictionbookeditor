// Скрипт "Удалить атрибуты id, на которые нет ссылок, и теги style v1.0" 
// Автор Sclex

function Run() {
 var undoUnitName="удаление атрибутов id, на которые нет ссылок, и тегов style";
 var fbwBody=document.getElementById("fbw_body");
 
 //соберем id-ы, на которые есть ссылки
 var usingIds={};
 var key, href, pos;
 for (key in usingIds) delete(usingIds[key]);
 var links = document.links;
 for(var i = 0; i < links.length; i++) {
  href=links[i].href;
  pos=href.search("main.html#");
  if (pos>=0 || href[1]=="#") {
   pos=href.search("#");
   href=href.substr(pos+1);
   usingIds[href.toLowerCase()]=true;
  }
 }

 //удалим теги style
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
    window.external.BeginUndoUnit(document,undoUnitName);
    firstRemoving=false;
   }
   ptr.removeNode(false);
   replaceCounter3+=1;
  } 
  ptr=saveNext;
 }

 //удалим id абзацных тегов
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
    if (elem2.getAttribute("id")!=null && elem2.getAttribute("id")!="" && usingIds[elem2.id.toLowerCase()]!=true) {
     if (firstRemoving) {
      window.external.BeginUndoUnit(document,undoUnitName);
      firstRemoving=false;
     }
     elem2.removeAttribute("id");
     replaceCounter1+=1;
    }
   }
  }
 }

 //удалим id картинок
 var fbwBody=document.getElementById("fbw_body");
 var elems=fbwBody.getElementsByTagName("DIV");
 var elem, elem2, elems2, i, j;
 var replaceCounter4=0;
 for (var i=0; i<elems.length; i++) {
  elem=elems[i];
  if (elem.className && elem.className.toLowerCase()=="body") {
   elems2=elem.getElementsByTagName("DIV");
   for (var j=0; j<elems2.length; j++) {
    elem2=elems2[j];
    if (elem2.className && elem2.className=="image" && elem2.getAttribute("id")!=null && elem2.getAttribute("id")!="" && usingIds[elem2.id.toLowerCase()]!=true) {
     if (firstRemoving) {
      window.external.BeginUndoUnit(document,undoUnitName);
      firstRemoving=false;
     }
     elem2.removeAttribute("id");
     replaceCounter4+=1;
    }
   }
  }
 }
 
 //удалим id блочных элементов
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
    if (elem2.className && elem2.getAttribute("id")!=null && elem2.getAttribute("id")!="" && usingIds[elem2.id.toLowerCase()]!=true) {
     if (firstRemoving) {
      window.external.BeginUndoUnit(document,undoUnitName);
      firstRemoving=false;
     }
     elem2.removeAttribute("id");
     replaceCounter2+=1;
    }
   }
  }
 } 

 if (!firstRemoving) window.external.EndUndoUnit(document);
 MsgBox("Всего удалено тегов style: "+replaceCounter3+"\n"+
                  "Всего удалено атрибутов id абзацных тегов: "+replaceCounter1+"\n"+
                  "Всего удалено атрибутов id блочных элементов: "+replaceCounter2+"\n"+
                  "Всего удалено атрибутов id картинок: "+replaceCounter4);
}
