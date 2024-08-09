// Скрипт «Перейти на предыдущий целиком жирный, но НЕ целиком курсивный абзац»
// Автор Sclex
// Версия 1.1

function Run() {

 var undoMsg="переход на предыдущий целиком жирный, но НЕ целиком курсивный абзац";
 var statusBarMsg="Переходим на предыдущий целиком жирный, но НЕ целиком курсивный абзац…";
 var notFoundMsg="До начала документа не нашлось ни одного целиком жирного, но НЕ целиком курсивного абзаца.";
 //имя тэга, который будет использован для маркеров начала и конца выделения
 var markerTagName="STRIKE";
 var re0=new RegExp("<STRONG>(((?!</?STRONG>).)*)</STRONG>","ig");
 var re1=new RegExp("</?[^>]*>","ig");
 var re5=new RegExp("<EM>(((?!</?EM>).)*)</EM>","ig");
 var re6=new RegExp("</?[^>]*>","ig");
 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar; }
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";};
 var re2=new RegExp(" |&nbsp;|"+nbspChar,"g");
 
 var pos1,myHtml;
 
 function isEntirelyItalic(elem1) {
  if (isLineEmpty(elem1)) return false;
  myHtml=elem1.innerHTML;
  //alert("myHtml на входе: "+myHtml);
  searchResult=re5.test(myHtml);
  //alert("searchResult: "+pos1);
  while (searchResult) {
   myHtml=myHtml.replace(re5,"");
   searchResult=re5.test(myHtml);
  }
  myHtml=myHtml.replace(re6,"");
  if (myHtml=="" || myHtml.replace(re2,"")=="") return true;
  return false;
 }

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
 
 function getPreviousNode(el) {
  //alert("Вошли в getPreviousNode.");
  if (el.lastChild && el.nodeName!="P")
   el=el.lastChild;
  else {
   while (el && !el.previousSibling)
    el=el.parentNode;
   if (el && el.previousSibling) el=el.previousSibling; 
  }
  return el;
 }
 
 function getPreviousP(el) {
  var savedEl=el;
  while (el && (el.nodeName!="P" || el==savedEl))
   el=getPreviousNode(el);
  return el;
 }

 var rndm, startId,endId;

 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

 var s;
 var ps=[];
 var tr,el,prv,pm,savePrevious,saveFirstEmpty,previousPtr;
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
 tr3.collapse(true);
 var ptr=tr3.parentElement();
 //alert("blockEndNode: "+ptr.outerHTML);
 ptr=getPreviousP(ptr);
 
 while (ptr && fbwBody.contains(ptr)) {
  if (isEntirelyBold(ptr) && !isEntirelyItalic(ptr)) break;
  ptr=getPreviousP(ptr);
 }
 
 processPs();

 if (ptr) {
  var tr1=document.body.createTextRange();
  tr1.moveToElementText(ptr);
  if (tr1.moveStart("character",1)==1)
   tr1.moveStart("character",-1);
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
