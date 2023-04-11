// Скрипт "Удалить все теги иллюстраций - теги image -  v1.6"
// Автор Sclex

function Run() {

 var versionStr="1.6";
 
 var re0=new RegExp("^( | |&nbsp;|"+nbspChar+")*?$","i");
 
 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

 function isLineEmpty(ptr) {
  return re0.test(ptr.innerHTML.replace(/<(?!img)[^>]*?>/gi,""));
 }
 
 function emptyLineIsNeededForValidity(elem) {
  if (!elem.previousSibling || (elem.previousSibling.nodeName=="DIV"
    && (elem.previousSibling.className=="epigraph" || elem.previousSibling.className=="title"))
    && elem.nextSibling && elem.nextSibling.nodeName=="P" && isLineEmpty(elem.nextSibling)
    && elem.nextSibling.nextSibling==null)
   return true;
   else return false;
 }
 
 var emptyLines=[];
 var fbwBody=document.getElementById("fbw_body");
 var undoUnitName="удаление всех тегов иллюстраций — тегов image";
 var firstRemoving=true;
 var elem, elem2, elems2, i, j;
 var replaceCounter1=0;
 var replaceCounter2=0;
 var replaceCounter3=0;
 elems=fbwBody.getElementsByTagName("SPAN");
 for (var i=elems.length-1; i>=0; i--) {
  elem=elems[i];
  if (elem.className && elem.className.toLowerCase()=="image") {
   if (firstRemoving) {
    window.external.BeginUndoUnit(document, undoUnitName);
    firstRemoving=false;
   }
   elem.removeNode(true);
   replaceCounter2+=1;
  }
 }
 var elems=fbwBody.getElementsByTagName("DIV");
 for (var i=elems.length-1; i>=0; i--) {
  elem=elems[i];
  if (elem.className && elem.className.toLowerCase()=="image") {
   if (firstRemoving) {
    window.external.BeginUndoUnit(document, undoUnitName);
    firstRemoving=false;
   }
   if (elem.nextSibling && elem.nextSibling.nodeName=="P" && isLineEmpty(elem.nextSibling))
    if (!emptyLineIsNeededForValidity(elem))
     if (emptyLines[emptyLines.length-1]!==elem.nextSibling) emptyLines.push(elem.nextSibling);
   if (elem.previousSibling && elem.previousSibling.nodeName=="P" && isLineEmpty(elem.previousSibling))
    if (emptyLines[emptyLines.length-1]!=elem.previousSibling) emptyLines.push(elem.previousSibling);
   elem.removeNode(true);
   replaceCounter1+=1;
  }
 }
 elems=fbwBody.getElementsByTagName("IMG");
 for (var i=elems.length-1; i>=0; i--) {
  elem=elems[i];
  if (true) {
   if (firstRemoving) {
    window.external.BeginUndoUnit(document, undoUnitName);
    firstRemoving=false;
   }
   elem.removeNode(true);
   replaceCounter3+=1;
  }
 }
 var removedEmptyLinesCnt=emptyLines.length;
 for (i=0; i<removedEmptyLinesCnt; i++)
  emptyLines[i].removeNode(true);
 var s;
 s="Скрипт «Удалить все теги иллюстраций – теги image» v"+versionStr+" (автор Sclex).\n"+
   "\n"+
   "Удалено тегов «блочных» иллюстраций: "+replaceCounter1+".\n"+
   "Удалено тегов внутриабзацных иллюстраций: "+replaceCounter2+".\n"+
   (replaceCounter3==0?"":"Удалено тегов непонятных (вероятно, ошибочных) иллюстраций: "+replaceCounter3+".\n")+
   "\n"+
   "Всего удалено тегов иллюстраций (тегов image): "+(replaceCounter1+replaceCounter2+replaceCounter3)+".\n"+
   "\n"+
   "Удалено пустых строк (которые были рядом с иллюстрациями): "+removedEmptyLinesCnt+".";
 if (!firstRemoving) window.external.EndUndoUnit(document);
 MsgBox(s);
}
