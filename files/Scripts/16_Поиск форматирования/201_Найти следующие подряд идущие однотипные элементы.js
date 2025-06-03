// Скрипт «Найти следующие подряд идущие однотипные элементы» (цитаты, стихи, эпиграфы, подзаголовки...)
// Автор Sclex, сборка TaKir
// Версия 1.3

// Для добавления в поиск или исключения определенных элементов из поиска отредактируйте строку в начале скрипта:
// var blockElementClass="^(cite|poem|subtitle|epigraph)$"; // регэксп для класса элемента, который (элемент) нужно искать

// Стихи ищутся только без назначенного автора стиха, во избежание лишних срабатываний на полностью корректно оформленых стихах.
// Эпиграфы и цитаты ищутся все, с авторами и без.

function Run() {

 var blockElementClass="^(cite|poem|subtitle|epigraph)$"; // регэксп для класса элемента, который (элемент) нужно искать
 var undoMsg="переход на следующие подряд идущие однотипные элементы";
 var statusBarMsg="Переходим на следующие подряд идущие однотипные элементы…";
 var notFoundMsg="До конца документа не нашлось подряд идущих однотипных элементов.";
 
 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar; }
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";};
 var re2=new RegExp(" |&nbsp;|"+nbspChar,"g");

 var emptyLineRegExp=new RegExp("^( | |&nbsp;|"+nbspChar+")*?$","i");
 
 function isLineEmpty(ptr) {
  return emptyLineRegExp.test(ptr.innerHTML.replace(/<[^>]*?>/gi,""));
 }
  
 var classRE=new RegExp(blockElementClass,"i");
 
 function checkP(elem1) {
  //if (elem1.className=="text-author") return true;
  return (elem1.className.search(classRE)>=0);
 }

 function checkNextEl(elem1) {
  var savedClass=elem1.className;
  var el2=elem1.nextSibling;
  while (el2 && el2.nodeName=="P" && isLineEmpty(el2)) el2=el2.nextSibling;
  return (el2!=null && el2.className==savedClass);
 }
 
 function hasAmongParents(elem2,nameOfClass) {
  while (elem2 && elem2.nodeName!="BODY") {
    if (elem2.nodeName=="DIV" && elem2.className==nameOfClass) return true;
    elem2=elem2.parentNode;
  }
  return false;
 }
 
 function getParentWithClass(elem3,classRE_2) {
  while (elem3 && elem3.nodeName!="BODY") {
    if (elem3.className.search(classRE_2)>=0) return elem3;
    elem3=elem3.parentNode;
  }
  return null;
 }

 function getNextNode(el) {
  //alert("Вошли в getNextNode.");
  if (el.firstChild && el.nodeName!="P")
   el=el.firstChild;
  else {
   while (el && !el.nextSibling)
    el=el.parentNode;
   if (el && el.nextSibling) el=el.nextSibling; 
  }
  return el;
 }
 
 function getNextPOrDiv(el) {
  var savedEl=el;
  while (el && ((el.nodeName!="P" && el.nodeName!="DIV")|| el==savedEl))
   el=getNextNode(el);
  return el;
 }
 
 function scrollIfItNeeds() { 
  var selection = document.selection;
  if (selection) {
    var range = selection.createRange();
    var rect = range.getBoundingClientRect();
    // var correction = (rect.bottom - document.documentElement.clientHeight/2); // центр
   var correction = (rect.bottom - document.documentElement.clientHeight/2); // верх
   // var popravka = (rect.bottom - document.documentElement.clientHeight/8* 6); // низ
   window.scrollBy(0, correction);
  }
 }
 
 var s;
 var tr,el,prv,pm,saveNext,saveFirstEmpty,nextPtr;
 var errMsg="Нет выделения.\n\nПеред запуском скрипта нужно выделить абзацы, которые будут обработаны.";
 tr=document.selection.createRange();

 if (tr.parentElement().nodeName=="TEXTAREA" || tr.parentElement().nodeName=="INPUT") {
  MsgBox("Ошибка. Должно быть выделение в тексте книги, а не в поле ввода.");
  return;
 }
 window.external.BeginUndoUnit(document,undoMsg);
 try { window.external.SetStatusBarText(statusBarMsg); }
 catch(e) {}
 var fbwBody=document.getElementById("fbw_body");

 var tr3=document.selection.createRange();
 tr3.collapse(false);
 var ptr=tr3.parentElement();
 var blockElementAtStart=getParentWithClass(ptr,classRE);
 //alert("blockEndNode: "+ptr.outerHTML);
 ptr=getNextPOrDiv(ptr);
 while (ptr && fbwBody.contains(ptr)) {
  //alert("ptr:\n\n"+ptr.outerHTML+"\n\n"+checkP(ptr)+"\n\n"+(getParentWithClass(ptr,classRE)!=blockElementAtStart)+"\n\n"+checkNextEl(ptr));
  if (checkP(ptr) && checkNextEl(ptr) && getParentWithClass(ptr,classRE)!=classRE) break;
  ptr=getNextPOrDiv(ptr);
 }
 if (ptr && fbwBody.contains(ptr)) {
  var tr1=document.body.createTextRange();
  //var parentElem=getParentWithClass(ptr,classRE);
  if (ptr.nodeName!="P") {
   var ps=ptr.getElementsByTagName("P");
   if ((typeof ps=="object") && ps.length>=1) ptr=ps[0];
  }
  if (ptr) {
   tr1.moveToElementText(ptr);
   if (tr1.moveStart("character",1)==1)
    tr1.moveStart("character",-1);
   tr1.moveEnd("character",-1);
   tr1.select();
   scrollIfItNeeds();
  }
  var scriptResult="Found";
 }
 else {
  var scriptResult="NotFound";
  MsgBox(notFoundMsg);
 }

 try { window.external.SetStatusBarText("ОК"); }
 catch(e) {} 
 window.external.EndUndoUnit(document);

 return scriptResult;
}
