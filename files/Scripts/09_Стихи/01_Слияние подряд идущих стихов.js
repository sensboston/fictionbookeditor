//скрипт «Слияние подряд идущих стихов»
//автор Sclex
//v1.2

function Run() {
 //имя тэга, который будет использован для маркеров начала и конца выделения
 var MyTagName="B";

 function isLineEmpty(ptr) {
  return re0.test(ptr.innerHTML.replace(/<(?!img)[^>]*?>/gi,""));
 }

 function check(p1,p2) {
  while (p1!=null && p1!=p2) {
   if (p1.nodeName=="P" ? !isLineEmpty(p1) : true) return false;
   saveFirstEmpty=p1;
   p1=p1.previousSibling;
  }
  if (p1) prv=p1;
  return p1 ? true : false;
 }

 function clearEmpties(p) {
  while (p) {
   saveNext=p.nextSibling;
   if (p.nodeName=="P" && isLineEmpty(p)) p.removeNode(true);
   p=saveNext;
  }
 }

 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

 var tr,el,prv,pm,saveNext,saveFirstEmpty;
 var re0=new RegExp("^( | |&nbsp;|"+nbspChar+")*?$","i"); 
 var errMsg="Нет выделения.\n\nПеред запуском скрипта нужно выделить текст, который будет обработан, а именно: будут объединены подряд идущие стихи в тех случаях, когда объединение не нарушит валидности документа.";
 tr=document.selection.createRange();
 if (!tr || tr.compareEndPoints("StartToEnd",tr)==0) {
  MsgBox(errMsg);
  return;
 }
 if (tr.parentElement().nodeName=="TEXTAREA") {
  MsgBox("Ошибка. Должно быть выделение в тексте книги, а не в поле ввода.");
  return;
 }
 window.external.BeginUndoUnit(document,"объединение стихов");
 try { window.external.SetStatusBarText("Выполняется объединение стихов…"); }
 catch(e) {}
 if (tr.parentElement().nodeName=="TEXTAREA") {
 }
 else if (tr.parentElement().nodeName!="INPUT") {
  var body=document.getElementById("fbw_body");
  var coll=tr.getClientRects();
  var ttr1 = body.document.selection.createRange();
  var el=body.document.elementFromPoint(coll[0].left, coll[0].top);
  var cursorPos=null;
  if (tr.compareEndPoints("StartToEnd",tr)==0) {
   var el2=document.getElementById("CursorPosition");
   if (el2) el2.removeAttribute("id");
   ttr1.pasteHTML("<"+MyTagName+" id=CursorPosition></"+MyTagName+">");
   cursorPos=document.getElementById("CursorPosition");
   ttr1.expand("word");
  } 
  // поставим маркеры блока в виде пустых ссылок
  var rndm=Math.random(100000).toString();
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
  var InsideSelection = false; // true, когда текущая позиция внутри выделенного текста
  var ProcessingEnded=false; // true, когда обработка закончена и пора выходить
  ptr=el;
  var rememberedPoem=null;
  var oldPoem=null;
  var joinCnt=0;
  var poemCnt=0;
  while (!ProcessingEnded) {
   // напомню: nodeType=1 для элемента (тэга) и nodeType=3 для текста
   // если встретили маркер начала блока, ...
   if (ptr.nodeType==1 && ptr.nodeName==MyTagName &&
       ptr.getAttribute("id")==startId) {
    // меняем флаг, т.к. попали внутрь выделения
    InsideSelection=true;
    // запомним ноду ссылки, чтобы потом удалить ее
    var BlockStartNode=ptr;
   }
   // аналогично для маркера конца выделения
   if (ptr.nodeType==1 && ptr.nodeName==MyTagName &&
       ptr.getAttribute("id")==endId) {
    InsideSelection=false;
    ProcessingEnded=true;
    var BlockEndNode=ptr;
   }
   // если нашли текст и находимся внутри P и внутри выделения...
   if (rememberedPoem && ptr.nodeName=="DIV" && ptr.className=="stanza" && InsideSelection &&
       ptr.parentNode && ptr.parentNode.nodeName=="DIV" && ptr.parentNode.className=="poem" &&
       ptr.parentNode.firstChild==ptr && check(ptr.parentNode.previousSibling,rememberedPoem)) {
    el=ptr.parentNode.removeNode(true);
    el=prv.insertAdjacentElement("beforeEnd",el);
    el.removeNode(false);
    clearEmpties(saveFirstEmpty);
    joinCnt++;
    if (!oldPoem || (rememberedPoem!=oldPoem)) poemCnt++;
    oldPoem=rememberedPoem;    
    rememberedPoem=null;    
   }
   // теперь надо найти следующий по дереву узел для обработки
   if (ptr.firstChild!=null) {
     ptr=ptr.firstChild; // либо углубляемся...
   } else {
     while (ptr.nextSibling==null) {
      ptr=ptr.parentNode; // ...либо поднимаемся (если уже сходили вглубь)
      // поднявшись до элемента P, не забудем поменять флаг
      if (ptr && ptr.nodeName=="DIV" && ptr.className=="poem") rememberedPoem=ptr;
    }
    ptr=ptr.nextSibling; //и переходим на соседний элемент
   }
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
 }
 try { window.external.SetStatusBarText("Стихов, к которым присоединяли: "+poemCnt+". Присоединений: "+joinCnt); }
 catch(e) {} 
 window.external.EndUndoUnit(document);
}