//скрипт «Добавить маркеры списка (по выбору пользователя) (не нумеровать пустые строки).js»
//автор Sclex
//v1.3

function Run() {

 listMarker_versionNum="v1.3";

 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

 var s;
 var markerSign=1;
 var emptyLineRegExp=new RegExp("^( | |&nbsp;|"+nbspChar+")*?$","i");
 
 function isLineEmpty(ptr) {
  return emptyLineRegExp.test(ptr.innerHTML.replace(/<(?!img)[^>]*?>/gi,""));
 }
 
 function processP(p) {
   if (!isLineEmpty(p))
     p.insertAdjacentHTML("afterbegin",markerSign+nbspChar);
 }
 
 //имя тэга, который будет использован для маркеров начала и конца выделения
 var MyTagName="B";

 var tr,el,prv,pm,saveNext,saveFirstEmpty,nextPtr;
 var wereReplaces=false;
 var processFlag=false;
 var ss="(</?(EM|I|B|STRONG)\\b[^>]*?>)*?";
 var re0=new RegExp("^"+ss+"([0-9]+?)"+ss+"( |"+nbspChar+")( |"+nbspChar+")*","i"); 
 var errMsg="Нет выделения.\n\nПеред запуском скрипта нужно выделить текст, который будет обработан.";
 tr=document.selection.createRange();
 if (!tr || tr.compareEndPoints("StartToEnd",tr)==0) {
  MsgBox(errMsg);
  return;
 }
 if (tr.parentElement().nodeName=="TEXTAREA" || tr.parentElement().nodeName=="INPUT") {
  MsgBox("Ошибка. Должно быть выделение в тексте книги, а не в поле ввода.");
  return;
 }
 
 var dialogWidth="440px";
 var dialogHeight="240px";
 var fbwBody=document.getElementById("fbw_body");
 var coll=new Object();
 coll["fbwBody"]=fbwBody;
 coll["mainDocument"]=document;
 coll["window"]=window;
 coll["versionNum"]=listMarker_versionNum;
 var markerSign=window.showModalDialog("HTML/Добавить маркеры списка (по выбору пользователя) - основной диалог.htm",coll,
     "dialogHeight: "+dialogHeight+"; dialogWidth: "+dialogWidth+"; "+
     "center: Yes; help: No; resizable: Yes; status: No;");
 if (!markerSign) return;

 window.external.BeginUndoUnit(document,"добавление в началах абзацев нумерации вида '1.'");
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
    if (pp.nodeName.toUpperCase()=="P") {
     //processFlag=true;
     processP(pp);
    }
   }
   // аналогично для маркера конца выделения
   if (ptr.nodeType==1 && ptr.nodeName==MyTagName &&
       ptr.getAttribute("id")==endId) {
    insideSelection=false;
    processingEnded=true;
    var BlockEndNode=ptr;
   }
   // если нашли текст и находимся внутри P и внутри выделения...
   if (insideSelection && ptr.nodeName=="P") processP(ptr);
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
 //if (processFlag) processP(pp);
 try { window.external.SetStatusBarText("ОК"); }
 catch(e) {} 
 window.external.EndUndoUnit(document);
}
