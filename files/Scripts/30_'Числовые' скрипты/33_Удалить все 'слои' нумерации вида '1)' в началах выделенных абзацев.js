//скрипт «Удалить все 'слои' нумерации вида "1)" в началах выделенных абзацев»
//автор Sclex
//v1.1

function Run() {

 var s;
 var cnt=1;
 var removeNotAllTagsRegExp=new RegExp("<\\/?(?!(IMG|A))[a-z]+( [^>]+)?>","ig");
 var myPos=null;
 
 try { 
  var nbspChar=window.external.GetNBSP();
  var nbspEntity;
  if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;";
  else nbspEntity=nbspChar;
 }
 catch(e) {
  var nbspChar=String.fromCharCode(160);
  var nbspEntity="&nbsp;";
 };
 
 var re3=new RegExp("^(\\d+\\\)( |"+nbspChar+")*)+","");
 
 function removeSymbolsBeyondTags(str,beginIndex,howManySymbolsToRemove,substrToInsert) {
  var i=0;
  var removedSymbolsCnt=0;
  var insideTag=false;
  var len=str.length;
  var symbolBeyondTagsCnt=0;
  var str2="";
  var ch;
   while (i<len) {
   ch=str.charAt(i);
    if (ch=="<") {
     insideTag=true;
     str2+=ch;
    }
    if (!insideTag && ch!="<" && ch!=">") {
     symbolBeyondTagsCnt++;
     if (symbolBeyondTagsCnt<beginIndex || symbolBeyondTagsCnt+1>beginIndex+howManySymbolsToRemove)
      str2+=ch;
     else {
      if (removedSymbolsCnt==0) str2+=substrToInsert;
      removedSymbolsCnt++;
     }
    }
    if (insideTag && ch!="<" && ch!=">")
     str2+=ch;
    if (ch==">") {
     insideTag=false;
     str2+=ch;
    }
    i++;
  }
  return str2;
 }

 function processP(p) {
    pInnerHTML=p.innerHTML;
//    alert("pInnerHTML на входе в processP:\n\n"+'"'+pInnerHTML.replace(removeNotAllTagsRegExp,"")+'"');
    if (pInnerHTML.replace(removeNotAllTagsRegExp,"").search(re3)>=0) {
     pInnerHTML=pInnerHTML.replace(/&nbsp;/g,nbspChar);
     myPos=pInnerHTML.replace(removeNotAllTagsRegExp,"").search(re3)+1;
     myLen=pInnerHTML.replace(removeNotAllTagsRegExp,"").match(re3)[0].length;
//     alert("myPos: "+myPos+"\n\nmyLen: "+myLen+"\n\nmatch:\n\n"+'"'+
//           pInnerHTML.replace(removeNotAllTagsRegExp,"").match(re3)+'"');
//     alert("pInnerHTML после замены &nbsp; :\n\n"+'"'+pInnerHTML+'"');
     pInnerHTML=removeSymbolsBeyondTags(pInnerHTML,myPos,myLen,"");
//     alert("Будем заменять вот на что:\n\n"+pInnerHTML);
     p.innerHTML="1";
     p.innerHTML=pInnerHTML;
     blockStartNode=document.getElementById(startId);
     blockEndNode=document.getElementById(endId);
    }
    cnt++;
 }
 
 //имя тэга, который будет использован для маркеров начала и конца выделения
 var MyTagName="B";

 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

 var tr,el,prv,pm,saveNext,saveFirstEmpty,nextPtr;
 var wereReplaces=false;
 var processFlag=false;
 var ss="(</?(EM|I|B|STRONG)\\b[^>]*?>)*?";
 var re0=new RegExp("^"+ss+"([0-9]+?)"+ss+"( |"+nbspChar+")( |"+nbspChar+")*","i"); 
 var errMsg="Нет выделения.\n\nПеред запуском скрипта нужно выделить абзацы, которые будут обработаны.";
 tr=document.selection.createRange();
 if (!tr || tr.compareEndPoints("StartToEnd",tr)==0) {
  MsgBox(errMsg);
  return;
 }
 if (tr.parentElement().nodeName=="TEXTAREA" || tr.parentElement().nodeName=="INPUT") {
  MsgBox("Ошибка. Должно быть выделение в тексте книги, а не в поле ввода.");
  return;
 }
 window.external.BeginUndoUnit(document,"удаление все 'слои' нумерации вида '1)' в началах выделенных абзацев");
 try { window.external.SetStatusBarText("Удаляем все 'слои' нумерации вида '1)' в началах выделенных абзацев..."); }
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
  blockStartNode=document.getElementById(startId);
  blockEndNode=document.getElementById(endId);
  var blockStartP=blockStartNode;
  while (blockStartP && blockStartP.nodeName!="P" && blockStartP.nodeName!="BODY")
   blockStartP=blockStartP.parentNode;
  var blockEndP=blockEndNode;
  while (blockEndP && blockEndP.nodeName!="P" && blockEndP.nodeName!="BODY")
   blockEndP=blockEndP.parentNode;
  ptr=blockStartP;
  while (!processingEnded) {
//   alert("Итерация while.");
   // nodeType=1 для элемента (тэга) и nodeType=3 для текста
   // если встретили маркер начала блока, ...
   if (ptr.nodeType==1 && ptr.nodeName==MyTagName &&
       ptr.getAttribute("id")==startId) {
    // меняем флаг, т.к. попали внутрь выделения
    insideSelection=true;
    // запомним ноду ссылки, чтобы потом удалить ее
    var blockStartNode=ptr;
    var pp=ptr;
    while (pp && pp.nodeName.toUpperCase()!="BODY" && pp.nodeName.toUpperCase()!="P") pp=pp.parentNode;
    if (pp.nodeName.toUpperCase()=="P") {
     //processFlag=true;
//     alert("Первый processP");
     processP(pp);
     if (pp==blockEndP) break;
     ptr=pp;
     while (ptr.nextSibling==null) ptr=ptr.parentNode;
     ptr=ptr.nextSibling;
     continue;
    }
   }
   if (ptr.nodeName.toUpperCase()=="P") {
//    alert("Второй processP");
    processP(ptr);
    if (ptr==blockEndP) break;
    while (ptr.nextSibling==null) ptr=ptr.parentNode;
     ptr=ptr.nextSibling;
    continue;
   }
   // аналогично для маркера конца выделения
   if (ptr.nodeType==1 && ptr.nodeName==MyTagName &&
       ptr.getAttribute("id")==endId) {
    insideSelection=false;
    processingEnded=true;
    var blockEndNode=ptr;
   }
   // если нашли текст и находимся внутри P и внутри выделения...
   //if (insideSelection && ptr.nodeName=="P") processP(ptr);
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
   blockStartNode=document.getElementById(startId);
   blockEndNode=document.getElementById(endId);
   tr1.moveToElementText(blockStartNode);
   var tr2=document.body.createTextRange();
   tr2.moveToElementText(blockEndNode);
   tr1.setEndPoint("StartToStart",tr2);
   tr1.select();
  } else {
   tr1.moveToElementText(cursorPos);
   tr1.select();
  }
  blockStartNode.parentNode.removeChild(blockStartNode);
  blockEndNode.parentNode.removeChild(blockEndNode);
 if (processFlag) {      /* alert("Третий processP"); */ processP(pp); }
 try { window.external.SetStatusBarText("ОК"); }
 catch(e) {} 
 window.external.EndUndoUnit(document);
}
