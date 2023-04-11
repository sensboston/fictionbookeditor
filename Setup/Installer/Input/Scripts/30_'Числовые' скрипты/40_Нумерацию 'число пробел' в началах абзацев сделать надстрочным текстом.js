//скрипт «Нумерацию 'число пробел' в началах абзацев сделать надстрочным текстом»
//автор Sclex
//v1.2

function Run() {

 var s;

 //имя тэга, который будет использован для маркеров начала и конца выделения
 var MyTagName="B";

 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

 function processP(p) {
  s=p.innerHTML.replace(/&nbsp;/gi,nbspChar);
  if (s.search(re0)<0) return;
  p.innerHTML=p.innerHTML.replace(/&nbsp;/gi,nbspChar).replace(re0,"$1<SUP>$3</SUP>$4$6");
 }

 var tr,el,prv,pm,saveNext,saveFirstEmpty,nextPtr;
 var wereReplaces=false;
 var processFlag=false;
 var ss="(</?(EM|I|B|STRONG)\\b[^>]*?>)*?";
 var re0=new RegExp("^"+ss+"([0-9]+?)"+ss+"( |"+nbspChar+")( |"+nbspChar+")*","i"); 
 var errMsg="Нет выделения.\n\nПеред запуском скрипта нужно выделить текст, который будет обработан, а именно: будут сделаны надстрочными индексами числа в началах абзацев, попавших в выделение, после которых (чисел) идет пробел. И если после числа в начале абзаца идет несколько пробелов (простых или неразрывных), они будут заменены на один пробел.";
 tr=document.selection.createRange();
 if (!tr || tr.compareEndPoints("StartToEnd",tr)==0) {
  MsgBox(errMsg);
  return;
 }
 if (tr.parentElement().nodeName=="TEXTAREA" || tr.parentElement().nodeName=="INPUT") {
  MsgBox("Ошибка. Должно быть выделение в тексте книги, а не в поле ввода.");
  return;
 }
 window.external.BeginUndoUnit(document,"сделывание нумерации в началах абзацев – надстрочным текстом");
 try { window.external.SetStatusBarText("Делаем числа в началах абзацев надстрочным текстом…"); }
 catch(e) {}
 var body=document.getElementById("fbw_body");
 var coll=tr.getClientRects();
 var ttr1 = document.selection.createRange();
 var el= document.elementFromPoint(coll[0].left, coll[0].top);
 var cursorPos=null;
 if (tr.compareEndPoints("StartToEnd",tr)==0) {
  var el2=document.getElementById("CursorPosition");
  if (el2) el2.removeAttribute("id");
  ttr1.pasteHTML("<"+MyTagName+" id=CursorPosition></"+MyTagName+">");
  cursorPos=document.getElementById("CursorPosition");
  ttr1.expand("word");
  }
  // поставим маркеры блока в виде пустых ссылок
  var rndm=Math.round(Math.random()*100000).toString();
  var startId="BlockStart"+rndm;
  var endId="BlockEnd"+rndm;
  tr=ttr1.duplicate();
  tr.collapse();
  tr.pasteHTML("<"+MyTagName+" id="+startId+"></"+MyTagName+">");
  tr=ttr1.duplicate();
  tr.collapse(false);
  tr.pasteHTML("<"+MyTagName+" id="+endId+"></"+MyTagName+">");
  // поднимаемся вверх по дереву, пока не найдем DIV или P,
  // в который входит начало выделения
  while (el && el.nodeName!="DIV" && el.nodeName!="P") { el=el.parentNode; }
  var insideSelection = false; // true, когда текущая позиция внутри выделенного текста
  var processingEnded=false; // true, когда обработка закончена и пора выходить
  ptr=el;
  while (!processingEnded) {
   // nodeType=1 для элемента (тэга) и nodeType=3 для текста
   // если встретили маркер начала блока, ...
   if (ptr.nodeType==1 && ptr.nodeName==MyTagName &&
       ptr.getAttribute("id")==startId) {
    // меняем флаг, т.к. попали внутрь выделения
    insideSelection=true;
    // запомним ноду ссылки, чтобы потом удалить ее
    var BlockStartNode=ptr;
    var pp=ptr;
    while (pp && pp.nodeName.toUpperCase()!="BODY" && pp.nodeName.toUpperCase()!="P") pp=pp.parentNode;
    if (pp.nodeName.toUpperCase()=="P" && pp.className!="subtitle" && pp.className!="text-author") processFlag=true;
   }
   // аналогично для маркера конца выделения
   if (ptr.nodeType==1 && ptr.nodeName==MyTagName &&
       ptr.getAttribute("id")==endId) {
    insideSelection=false;
    processingEnded=true;
    var BlockEndNode=ptr;
   }
   // если нашли текст и находимся внутри P и внутри выделения...
   if (insideSelection && ptr.nodeName=="P" && ptr.className!="subtitle" && ptr.className!="text-author") processP(ptr);
   // переходим на следующий узел
     if (ptr.firstChild!=null) {
     nextPtr=ptr.firstChild; // либо углубляемся...
   } else {
     nextPtr=ptr;
     while (nextPtr && nextPtr!=body && !nextPtr.nextSibling) {
      nextPtr=nextPtr.parentNode; // ...либо поднимаемся (если уже сходили вглубь)
     }
     if (nextPtr && nextPtr!=body) nextPtr=nextPtr.nextSibling; //и переходим на соседний элемент
     else nextPtr=null;
   }
   if (!nextPtr) break;
   ptr=nextPtr;
  }
  // удаляем маркеры блока
  var tr1=document.body.createTextRange();
  if (!cursorPos) {
   tr1.moveToElementText(BlockStartNode);
   var tr2=document.body.createTextRange();
   tr2.moveToElementText(BlockEndNode);
   tr1.setEndPoint("StartToStart",tr2);
   tr1.select();
  } else {
   tr1.moveToElementText(cursorPos);
   tr1.select();
  }
  BlockStartNode.parentNode.removeChild(BlockStartNode);
  BlockEndNode.parentNode.removeChild(BlockEndNode);
 if (processFlag) processP(pp);
 try { window.external.SetStatusBarText("ОК"); }
 catch(e) {} 
 window.external.EndUndoUnit(document);
}
