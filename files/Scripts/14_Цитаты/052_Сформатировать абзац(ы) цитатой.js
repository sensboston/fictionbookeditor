// Скрипт «Сформатировать абзац(ы) цитатой»
// Автор Sclex
// Версия 1.3

function Run() {

 var undoMsg="форматирование абзаца(-ев) цитатой";
 var statusBarMsg="Форматируем абзац(ы) цитатой…";
 //имя тэга, который будет использован для маркеров начала и конца выделения
 var markerTagName="I";

 function processPs() {
  var parentEl=ps[0].parentNode;
  if (!parentEl || parentEl.className!="section" || (ps[0].className!="" && ps[0].className!="normal")) return;
  for (var i=1; i<ps.length; i++)
   if (ps[i].parentNode!=parentEl || (ps[i].className!="" && ps[i].className!="normal")) return;
  var newCite=document.createElement("DIV");
  newCite.className="cite";
  var pCopy;
  for (var i=0; i<ps.length; i++) {
   pCopy=ps[i].cloneNode(true);
   newCite.appendChild(pCopy);
  }
  ps[0].parentNode.insertBefore(newCite,ps[0]);
  for (var i=0; i<ps.length; i++)
   ps[i].removeNode(true);
 }
 
 function getNextNode(el) {
  //alert("Вошли в getNextNode.");
  if (el.firstChild && el.nodeName!="P")
   el=el.firstChild;
  else {
   while (!el.nextSibling)
    el=el.parentNode;
   el=el.nextSibling; 
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
 var ptr=blockStartEl;
 while (ptr) {
  //alert("Добавляем в массив: "+ptr.outerHTML);
  ps.push(ptr);
  if (ptr===blockEndEl) break;
  ptr=getNextP(ptr);
 }
 
 processPs();

 // удаляем маркеры блока
 blockStartNode=document.getElementById(startId);
 blockEndNode=document.getElementById(endId);
 if (blockStartNode) blockStartNode.removeNode(true);
 if (blockEndNode) blockEndNode.removeNode(true);
 
 /* var tr1=document.body.createTextRange();
 tr1.moveToElementText(blockStartEl);
 if (tr1.moveStart("character",1)==1)
  tr1.moveStart("character",-1);
 var tr2=document.body.createTextRange();
 tr2.moveToElementText(blockEndEl);
 tr1.setEndPoint("EndToEnd",tr2);
 tr1.select(); */

 //if (processFlag) addPToArray(pp);
 try { window.external.SetStatusBarText("ОК"); }
 catch(e) {} 
 window.external.EndUndoUnit(document);
}
