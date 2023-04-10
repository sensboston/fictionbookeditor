//"Удаление пробелов" by Sclex
//v1.1
//вид обработки, которой подвергается выделенный текст
// 1 - перевод в верний регистр
// 2 - перевод в верний регистр
var ObrabotkaType=2;
//имя тэга, который будет использован для маркеров начала и конца выделения
var MyTagName="B";

function Run() {
 if (document.selection.type!="Text") {
  alert("Ничего не выделено!");
  return;
 }
 window.external.BeginUndoUnit(document,"Нижний регистр");
 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}
 var nxt,s;
 var spaceRegExp=new RegExp("[ "+nbspChar+"]","g");
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
 var InsideP = false; // true, если находимся внутри тэга P
 var InsideSelection = false; // true, когда текущая позиция внутри выделенного текста
 var ProcessingEnded=false; // true, когда обработка закончена и пора выходить
 ptr=el;
 while (!ProcessingEnded) {
  nxt=ptr;
  if (nxt.firstChild!=null) {
    nxt=nxt.firstChild; // либо углубляемся...
  } else {
    while (nxt.nextSibling==null) {
     nxt=nxt.parentNode; // ...либо поднимаемся (если уже сходили вглубь)
// поднявшись до элемента P, не забудем поменять флаг
     if (nxt && nxt.nodeType==1 && nxt.nodeName=="P") {InsideP=false}
    }
   nxt=nxt.nextSibling; //и переходим на соседний элемент
  }
// напомню: nodeType=1 для элемента (тэга) и nodeType=3 для текста
// если встретили тэг P, меняем флаг, что мы внутри P
  if (ptr.nodeType==1 && ptr.nodeName=="P") {InsideP=true};
// если встретили маркер начала блока, ...
  if (ptr.nodeType==1 && ptr.nodeName==MyTagName &&
      ptr.getAttribute("id")=="BlockStart") {
// меняем флаг, т.к. попали внутрь выделения
   InsideSelection=true;
// запомним ноду ссылки, чтобы потом удалить ее
   var BlockStartNode=ptr;
  }
// аналогично для маркера конца выделения
  if (ptr.nodeType==1 && ptr.nodeName==MyTagName &&
      ptr.getAttribute("id")=="BlockEnd") {
   InsideSelection=false;
   ProcessingEnded=true;
   var BlockEndNode=ptr;
  }
// если нашли текст и находимся внутри P и внутри выделения...
  if (ptr.nodeType==3 && InsideP && InsideSelection) {
// получаем текстовое содержимое узла
// обрабатываем как надо
   s=ptr.nodeValue.replace(spaceRegExp,"");
   if (s!="") ptr.nodeValue=s;
   else ptr.removeNode(true);
// и возвращаем на место
  }
// теперь надо найти следующий по дереву узел для обработки
  ptr=nxt;
 }
 tr=document.body.createTextRange();
 tr.moveToElementText(BlockStartNode);
 var tr2=document.body.createTextRange();
 tr2.moveToElementText(BlockEndNode);
 tr.setEndPoint("EndToEnd",tr2);
 //if (tr.move("character",1)==1) tr.move("character",-1);
 tr.select();
// удаляем маркеры блока
 BlockStartNode.parentNode.removeChild(BlockStartNode);
 BlockEndNode.parentNode.removeChild(BlockEndNode);
 window.external.EndUndoUnit(document);
}