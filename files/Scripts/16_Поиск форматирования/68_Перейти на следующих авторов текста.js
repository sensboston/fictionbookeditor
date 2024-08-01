// Скрипт «Перейти на следующих авторов текста»
// Автор Sclex
// Версия 1.4

function Run() {

 var undoMsg="переход на следующих авторов текста";
 var statusBarMsg="Переходим на следующих авторов текста…";
 var notFoundMsg="До конца документа не нашлось ни одного автора текста.";
 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar; }
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";};
 var re2=new RegExp(" |&nbsp;|"+nbspChar,"g");
 
 function checkP(elem1) {
  if (elem1.className=="text-author") return true;
  return false;
 }

 function hasAmongParents(elem2,nameOfClass) {
  while (elem2 && elem2.nodeName!="BODY") {
    if (elem2.nodeName=="DIV" && elem2.className==nameOfClass) return true;
    elem2=elem2.parentNode;
  }
  return false;
 }
 
 var emptyLineRegExp=new RegExp("^( | |&nbsp;|"+nbspChar+")*?$","i");
 
 function isLineEmpty(ptr) {
  return emptyLineRegExp.test(ptr.innerHTML.replace(/<[^>]*?>/gi,""));
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
 
 function getNextP(el) {
  var savedEl=el;
  while (el && (el.nodeName!="P" || el==savedEl))
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
 var state=0;
 var firstP=null;
 var lastP=null;
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
 if (ptr.nodeName=="P" && ptr.className=="text-author")
  state=-1;
 //alert("blockEndNode: "+ptr.outerHTML);
 ptr=getNextP(ptr);
 
 while (ptr && fbwBody.contains(ptr)) {
  if (state==-1 && !checkP(ptr))
   state=0;
  else if (state==0 && checkP(ptr)) {
   state=1;
   firstP=ptr;
  }
  else if (state==1 && checkP(ptr))
   lastP=ptr;
  else if (state==1 && !checkP(ptr)) {
   state=2;
   break;
  }
  ptr=getNextP(ptr);
 }
 
 if (state==1 || state==2) {
  //alert("firstP: "+firstP.outerHTML);
  //alert("lastP: "+lastP.outerHTML);
  var tr1=document.body.createTextRange();
  tr1.moveToElementText(lastP);
  if (tr1.moveStart("character",1)==1)
   tr1.moveStart("character",-1);
  var tr2=document.body.createTextRange();
  tr2.moveToElementText(firstP);
  tr1.setEndPoint("StartToStart",tr2);
  tr1.select();
  scrollIfItNeeds();
 }
 else {
  MsgBox(notFoundMsg);
 }

 try { window.external.SetStatusBarText("ОК"); }
 catch(e) {} 
 window.external.EndUndoUnit(document);
}