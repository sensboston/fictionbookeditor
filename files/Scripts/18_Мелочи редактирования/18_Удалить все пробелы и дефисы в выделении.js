// Скрипт "Удалить все пробелы и дефисы в выделении". Автор - Sclex
// v1.3

function Run() {

 var undoMsg="удаление всех пробелов и дефисов в выделении";
 
 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}
 
 var mainRegExp=new RegExp("[- "+nbspChar+"]+","g");

 // имя тэга, который будет использован для маркеров начала и конца выделения
 var MyTagName="B";

 function isInsideP(el) {
   while (el.nodeName!="BODY" && el.nodeName!="P") el=el.parentNode;
   if (el.nodeName=="P" && fbw_body.contains(el)) return true;
   return false;
 }

 if (document.selection.type!="Text") {
  alert("Ничего не выделено!");
  return;
 }

 var fbw_body=document.getElementById("fbw_body");
 window.external.BeginUndoUnit(document,undoMsg);
 var nxt,s;
 var body=document.getElementById("fbw_body");
 var coll=body.document.selection.createRange().getClientRects();
 var ttr1 = body.document.selection.createRange();
 var el=body.document.elementFromPoint(coll[0].left, coll[0].top);
// поставим маркеры блока в виде пустых ссылок
 var tr=ttr1.duplicate();
 tr.collapse();
 tr.pasteHTML("<"+MyTagName+" id=BlockStart></"+MyTagName+">");
 tr=ttr1.duplicate();
 tr.collapse(false);
 tr.pasteHTML("<"+MyTagName+" id=BlockEnd></"+MyTagName+">");
// поднимаемся вверх по дереву, пока не найдем DIV или P,
// в который входит начало выделения
 while (el && el.nodeName!="DIV" && el.nodeName!="P") { el=el.parentNode; }
 var insideSelection = false; // true, когда текущая позиция внутри выделенного текста
 var processingEnded=false; // true, когда обработка закончена и пора выходить
 ptr=el;
 while (!processingEnded) {
  //alert("Внутри while.\n\nptr.nodeName: "+ptr.nodeName+"\nptr.nodeValue: "+ptr.nodeValue);
  nxt=ptr;
  if (nxt.firstChild!=null) {
    nxt=nxt.firstChild; // либо углубляемся...
  } else {
    while (nxt.nextSibling==null)
     nxt=nxt.parentNode; // ...либо поднимаемся (если уже сходили вглубь)
   nxt=nxt.nextSibling; //и переходим на соседний элемент
  }
// если встретили маркер начала блока, ...
  if (ptr.nodeType==1 && ptr.nodeName==MyTagName &&
      ptr.getAttribute("id")=="BlockStart") {
// меняем флаг, т.к. попали внутрь выделения
   insideSelection=true;
// запомним ноду ссылки, чтобы потом удалить ее
   var blockStartNode=ptr;
  }
// аналогично для маркера конца выделения
  if (ptr.nodeType==1 && ptr.nodeName==MyTagName &&
      ptr.getAttribute("id")=="BlockEnd") {
   insideSelection=false;
   processingEnded=true;
   var blockEndNode=ptr;
  }
//  if (ptr.nodeType==3)
//    alert("isInsideP(ptr): "+isInsideP(ptr)+"\n\n"+"insideSelection: "+insideSelection+"\n\n"+ptr.nodeValue);
// если нашли текст и находимся внутри P и внутри выделения...
  if (ptr.nodeType==3 && isInsideP(ptr) && insideSelection) {
// получаем текстовое содержимое узла
// обрабатываем как надо
   s=ptr.nodeValue.replace(mainRegExp,"");
   if (s!="") ptr.nodeValue=s;
   else ptr.removeNode(true);
// и возвращаем на место
  }
  ptr=nxt;
 }
 tr=document.body.createTextRange();
 tr.moveToElementText(blockStartNode);
 var tr2=document.body.createTextRange();
 tr2.moveToElementText(blockEndNode);
 tr.setEndPoint("EndToEnd",tr2);
 //if (tr.move("character",1)==1) tr.move("character",-1);
 tr.select();
// удаляем маркеры блока
 blockStartNode.parentNode.removeChild(blockStartNode);
 blockEndNode.parentNode.removeChild(blockEndNode);
 window.external.EndUndoUnit(document);
}