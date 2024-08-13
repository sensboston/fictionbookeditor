// Скрипт «Перейти на следующий целиком жирный абзац»
// Автор Sclex
// Версия 1.2

function Run() {

 var undoMsg="переход на следующий целиком жирный абзац";
 var statusBarMsg="Переходим на следующий целиком жирный абзац…";
 var notFoundMsg="До конца документа не нашлось ни одного целиком жирного абзаца.";
 //имя тэга, который будет использован для маркеров начала и конца выделения
 var markerTagName="STRIKE";
 var re0=new RegExp("<STRONG>(((?!</?STRONG>).)*)</STRONG>","ig");
 var re1=new RegExp("</?[^>]*>","ig");
 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar; }
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";};
 var re2=new RegExp(" |&nbsp;|"+nbspChar,"g");
 
 var pos1,myHtml;
 
 function isEntirelyBold(elem1) {
  if (isLineEmpty(elem1)) return false;
  myHtml=elem1.innerHTML;
  //alert("myHtml на входе: "+myHtml);
  searchResult=re0.test(myHtml);
  //alert("searchResult: "+pos1);
  while (searchResult) {
   myHtml=myHtml.replace(re0,"");
   searchResult=re0.test(myHtml);
  }
  myHtml=myHtml.replace(re1,"");
  if (myHtml=="" || myHtml.replace(re2,"")=="") return true;
  return false;
 }

 var emptyLineRegExp=new RegExp("^( | |&nbsp;|"+nbspChar+")*?$","i");
 
 function isLineEmpty(ptr) {
  return emptyLineRegExp.test(ptr.innerHTML.replace(/<[^>]*?>/gi,""));
 }
    
 function processPs() {
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

 var rndm, startId,endId;

 function insertSelectionMarkers() {
  rndm=Math.round(Math.random()*100000).toString();
  startId="BlockStart"+rndm;
  endId="BlockEnd"+rndm;
  var tr=document.selection.createRange();
  var tr2=tr.duplicate();
  tr.collapse();
  tr.pasteHTML("<"+markerTagName+" id="+startId+"></"+markerTagName+">");
  tr2.collapse(false);
  tr2.pasteHTML("<"+markerTagName+" id="+endId+"></"+markerTagName+">");
 }
 
 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

 var s;
 var ps=[];
 var tr,el,prv,pm,saveNext,saveFirstEmpty,nextPtr;
 var errMsg="Нет выделения.\n\nПеред запуском скрипта нужно выделить абзацы, которые будут обработаны.";
 tr=document.selection.createRange();
 /* if (!tr || tr.compareEndPoints("StartToEnd",tr)==0) {
  MsgBox(errMsg);
  return;
 } */
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
 //alert("blockEndNode: "+ptr.outerHTML);
 ptr=getNextP(ptr);
 
 /*
 insertSelectionMarkers();
 var blockStartNode=document.getElementById(startId);
 var blockEndNode=document.getElementById(endId);
 var blockStartEl=blockStartNode;
 while (blockStartEl && blockStartEl.nodeName!="BODY" && blockStartEl.nodeName!="P")
  blockStartEl=blockStartEl.parentNode;
 if (!blockStartEl || blockStartEl.nodeName=="BODY") return;
 //alert("blockStartEl: "+blockStartEl.outerHTML); 
 var blockEndEl=blockEndNode;
 while (blockEndEl && blockEndEl.nodeName!="BODY" && blockEndEl.nodeName!="P")
  blockEndEl=blockEndEl.parentNode;
 if (blockEndEl && blockEndEl.nodeName=="BODY") {
  blockEndEl=blockEndNode;
  if (blockEndEl.previousSibling && blockEndEl.previousSibling.nodeName=="P")
   blockEndEl=blockEndEl.previousSibling;
  if (!blockEndEl || blockEndEl.nodeName!="P") return;
 }
 //alert("blockEndEl: "+blockEndEl.outerHTML);
 var ptr=blockStartEl;*/
 
 while (ptr && fbwBody.contains(ptr)) {
  if (isEntirelyBold(ptr)) break;
  ptr=getNextP(ptr);
 }
 
 processPs();

 if (ptr) {
  var tr1=document.body.createTextRange();
  tr1.moveToElementText(ptr);
  if (tr1.moveStart("character",1)==1)
   tr1.moveStart("character",-1);
  tr1.moveEnd("character",-1);
  tr1.select();
  var scriptResult="Found";
 }
 else {
  var scriptResult="NotFound";
  MsgBox(notFoundMsg);
 }

 //if (processFlag) addPToArray(pp);
 try { window.external.SetStatusBarText("ОК"); }
 catch(e) {} 
 window.external.EndUndoUnit(document);
 return scriptResult;
}
