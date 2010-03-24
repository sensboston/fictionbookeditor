//Подряд идущие стихи, разделённые пустышками, в одну поэму
//
//выделяем блок (можно и не выделять, а просто поставить курсор на самый нижний),
//запускаем скрипт. если в блоке есть подряд идущие стихи,
//они соединяются в один; пустые строки между стихами удаляются.
//Версия: 1.1

//имя тэга, который будет использован для маркеров начала и конца выделения
var MyTagName="B";
var InsideSelection=false;
var BlockStartNode=null;
var BlockEndNode=null;

try { var nbspChar=window.external.GetNBSP(); var nbspEntity=nbspChar;}
catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

function IsLineEmpty(ptr) {
 var txt=ptr.innerText;
 if (txt=="" || txt==nsbpEntity || txt==" " || txt==nbspChar) {return true;}
 else {return false;}
}

function Recursive(ptr) {
 var PredlastPoem=null;
 var NeedFirstEmpty=false;
 var FirstEmpty=null;
 while (ptr!=null) {
  var SaveNext=ptr.nextSibling;
//  if (ptr.nodeType==1) {MsgBox("ptr.outerHTML:"+ptr.outerHTML);}
//  else {MsgBox("ptr.nodeValue:"+ptr.nodeValue);}
//  MsgBox("SaveNext:"+SaveNext);
  if (ptr.nodeType==1) {
   var rslt=Recursive(ptr.firstChild);
   if (ptr.nodeName==MyTagName && ptr.getAttribute("id")=="BlockStart") {
    // меняем флаг, т.к. попали внутрь выделения
    InsideSelection=true;
    // запомним ноду ссылки, чтобы потом удалить ее
    ptr.parentNode.removeChild(ptr);
   }
   // аналогично для маркера конца выделения
   if (ptr.nodeName==MyTagName && ptr.getAttribute("id")=="BlockEnd") {
    InsideSelection=false;
    ProcessingEnded=true;
    ptr.parentNode.removeChild(ptr);
    return true;
   }
   if (PredlastPoem) {
    //отловим случаи, когда после стиха идет то, что создает границу между стихами
    if ((ptr.nodeName=="DIV"&&(ptr.className=="image"||ptr.className=="table"||
                             ptr.className=="section"||ptr.className=="cite")) ||
        (ptr.nodeName=="P" && !IsLineEmpty(ptr))) {
     PredlastPoem=null;
     FirstEmpty=null;
     NeedFirstEmpty=false;
    }
    //проверим, не нужно ли запомнить первую пустую строку после стиха
    if (NeedFirstEmpty && ptr.nodeName=="P" && IsLineEmpty(ptr)) {
     NeedFirstEmpty=false;
     var FirstEmpty=ptr;
    }
   }
   if (ptr.nodeName=="DIV" && ptr.className=="poem") {
    if (PredlastPoem!=null) {
     //сливаем стихи
     var ptr2=FirstEmpty;
     while (ptr2!=ptr) {
      ptr2SaveNext=ptr2.nextSibling;
      ptr2.outerHTML="";
      ptr2=ptr2SaveNext;
     }     
     PredlastPoem.innerHTML=PredlastPoem.innerHTML+ptr.innerHTML;
     ptr.outerHTML="";
     var NeedFirstEmpty=true;
    } else {
     var PredlastPoem=ptr;
     var NeedFirstEmpty=true;
    } 
   }
  }
  ptr=SaveNext;
  if (rslt) {return true;}
 }
 return false;
}

function Run() {
 window.external.BeginUndoUnit(document,"«склейка» стихов");
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
 while (el && el.nodeName!="DIV" || (el.className!="section" && el.className!="body" &&
                                     el.getAttribute("id")!="fbw_body")) { el=el.parentNode; }
 var InsideSelection = false; // true, когда текущая позиция внутри выделенного текста
 var ProcessingEnded=false; // true, когда обработка закончена и пора выходить
 Recursive(el);
// удаляем маркеры блока
 window.external.EndUndoUnit(document);
}