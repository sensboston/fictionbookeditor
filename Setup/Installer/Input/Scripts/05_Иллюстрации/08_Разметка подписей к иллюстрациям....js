//автор Sclex
//сайт скриптов: http://scripts.fictionbook.org

var prkk_buttonsChanged=false;
var prkk_ptr=null;
var prkk_fbwBody, prkk_nbspChar, prkk_picsCnt, prkk_doc, prkk_win, prkk_markupType;
var prkk_pToChange=null;
var prkk_tr=null;
var prkk_lenLimit=100;
var prkk_changeAll=false;
var prkk_titlesCnt=0;
var prkk_flashNow=false;
var prkk_variableForCheck=true;
var prkk_howManyMillisecondsBeSelectedWhenFlashing=400;
var prkk_howManyMillisecondsBeNotSelectedWhenFlashing=400;
var prkk_dialogWin=null;

function mayAutoprocess(pp) {
 return pp.innerHTML.search(/[^.…?!<>](<[^>]*?>)*?$/)>=0 && pp.innerHTML.replace(/<(?!img)[^>]*?>/gi,"").replace(/<img[^>]*?>/gi,".").length<=prkk_lenLimit;
}

function processAll(doc,win,markupType) {
 prkk_changeAll=true;
 prkk_picsCnt=0;
 prkk_titlesCnt=0;
 prkk_doSearch(doc,win,markupType);
 MsgBox("Обработка всех подписей успешно завершена.\n\n"+
       "Встретилось картинок: "+prkk_picsCnt+"\n"+
       "Обработано подписей: "+prkk_titlesCnt);
 win.close();
}

function flash() {
 if (!prkk_fbwBody) {
  MsgBox("Произошла ошибка. Переменная prkk_fbwBody потеряла свое значение.");
 }
 if (!prkk_fbwBody.contains(prkk_pToChange)) {
  MsgBox("Во дела! Абзац, который должен был быть размечен как подпись, куда-то пропал. Поэтому мигать им не получится.");
  return;
 }
 var ptr2=prkk_pToChange;
 var tr=document.body.createTextRange();
 tr.moveToElementText(ptr2);
 tr.select(); // выделить абзац
 tr.collapse(true);
 prkk_tr=tr;
 var a=ptr2.getBoundingClientRect().top;      
 window.scrollBy(-10000,a-Math.floor(window.external.getViewHeight()/2));      
 setTimeout("flash2();",prkk_howManyMillisecondsBeSelectedWhenFlashing);
}

function markupAsSubscript(mainWin, markupType) {
 try {
  mainWin.prkk_markupImageTitleAndGoFurther(document,window,markupType);
 }
 catch (e) {
  alert("При попытке разметить абзац как подпись произошла ошибка. Возможной причиной является то, что вы создали новый документ после того, как был открыт диалог скрипта.");
  window.close();
 }
}

function flash2() {
 if (!prkk_fbwBody) {
  MsgBox("Произошла ошибка. Переменная prkk_fbwBody потеряла свое значение.");
 }
 if (!prkk_fbwBody.contains(prkk_pToChange)) {
  MsgBox("Во дела! Абзац, который должен был быть размечен как подпись, куда-то пропал. Поэтому мигать им не получится.");
  return;
 }
 var ptr2=prkk_pToChange;
 var tr=document.body.createTextRange();
 tr.moveToElementText(ptr2);
 tr.collapse(true);
 tr.select(); // снимает выделение абзаца
 prkk_tr=tr;
 var a=ptr2.getBoundingClientRect().top;      
 window.scrollBy(-10000,a-Math.floor(window.external.getViewHeight()/2));      
 if (prkk_flashNow) setTimeout("flash();",prkk_howManyMillisecondsBeNotSelectedWhenFlashing);
}

function prkk_doSearch(doc,win,markupType) {
 var re0=new RegExp("^( | |&nbsp;|"+prkk_nbspChar+")*?$","i");

 function isLineEmpty(myPtr) {
  return myPtr.innerHTML.replace(/<(?!img)[^>]*?>/gi,"").search(re0)>=0;
 }

 var ptr2;
 var ptr=prkk_ptr; 

 while (ptr!=prkk_fbwBody) {
  if (ptr.nodeName=="DIV" && ptr.className=="image") {
   ptr2=ptr.nextSibling;
   prkk_picsCnt++;
   if (ptr2 && ptr2.nodeName=="P") {
    if (!isLineEmpty(ptr2)) {
     prkk_pToChange=ptr2;         
     if (prkk_changeAll || mayAutoprocess(ptr2)) {
      prkk_markupImageTitle(doc,win,markupType);
      prkk_titlesCnt++;
     } 
     else {
      var tr=document.body.createTextRange();
      tr.moveToElementText(ptr2);
      tr.select();
      tr.collapse(true);
      prkk_tr=tr;
      var a=ptr2.getBoundingClientRect().top;      
      window.scrollBy(-10000,a-Math.floor(window.external.getViewHeight()/2));      
      setTimeout("prkk_tr.select();",100);      
      if (!prkk_buttonsChanged) {
       doc.getElementById("ButtonsP").innerHTML='<INPUT type=button value="Искать дальше – K" onclick="startFromCursor();" style="height:30px; margin:1px;"> <INPUT type=button value="Разметить как подпись – L" onclick="mainWin.markupAsSubscript(mainWin, getMarkupType());" style="height:30px; margin:1px;"> <INPUT type=button value="Закрыть диалог – Esc" style="height:30px;" onclick="window.close();"> <INPUT type=button value="Мигать абзацем" onmouseover="mainWin.prkk_flashNow=true; mainWin.flash();" onmouseout="mainWin.prkk_flashNow=false;" style="height:30px; margin:1px;">  <INPUT type=button value="Во всех дальнейших случаях разметить как подписи – A" onclick="mainWin.processAll(document,window,getMarkupType());" style="height:30px; margin:1px;" id=allButton>';
       prkk_buttonsChanged=true;
       win.buttonsChanged=true;
      }
      return;
     } 
    }
   }
  }
  if (ptr.nodeName=="DIV" && ptr.firstChild)
   ptr=ptr.firstChild;
  else {
   while (ptr!=prkk_fbwBody && ptr.nextSibling==null) ptr=ptr.parentNode;
   if (ptr!=prkk_fbwBody) ptr=ptr.nextSibling;
  } 
 }
 if (prkk_changeAll) return; 
 alert("Достигнут конец документа.");
 if (prkk_dialogWin) if (prkk_dialogWin.close) prkk_dialogWin.close();
 // setTimeout("win.prkk_dialogWin.close();",0)
}

function killTags(pp,tag1,tag2) {
 var el=pp.firstChild;
 var saveNext;
 while (el && el!=pp) {
  if (el.firstChild)
   saveNext=el.firstChild;
  else {
   saveNext=el;
   while (saveNext!=pp && saveNext.nextSibling==null) saveNext=saveNext.parentNode;
   if (saveNext!=pp) saveNext=saveNext.nextSibling;
  } 
  if (el.nodeName==tag1 || el.nodeName==tag2) el.removeNode(false);
  el=saveNext;
 }
}

function prkk_markupImageTitle(doc,win,markupType) {
 var el;
 window.external.BeginUndoUnit(document,"разметку подписей к картинкам");
 if (!prkk_pToChange || prkk_pToChange.nodeName!="P") return;
 if (markupType.charAt(0)=="1") {
  el=document.createElement("STRONG");
  killTags(prkk_pToChange,"B","STRONG");
  prkk_pToChange.applyElement(el,"inside"); 
 }
 if (markupType.charAt(1)=="1") {
  el=document.createElement("EM");
  killTags(prkk_pToChange,"EM","I");
  prkk_pToChange.applyElement(el,"inside"); 
 }
 if (markupType.charAt(2)=="1") {
  el=document.createElement("SUP");
  killTags(prkk_pToChange,"SUP");
  prkk_pToChange.applyElement(el,"inside"); 
 }  
 if (markupType.charAt(3)=="1") {
  el=document.createElement("SUB");
  killTags(prkk_pToChange,"SUB");
  prkk_pToChange.applyElement(el,"inside"); 
 }
 if (markupType.charAt(4)=="1")
  prkk_pToChange.className="subtitle";
 window.external.EndUndoUnit(document);
}

function prkk_doSearch2() {
 prkk_doSearch(prkk_doc,prkk_win,prkk_markupType);
}

function prkk_markupImageTitleAndGoFurther(doc,win,markupType) {
 if (!prkk_fbwBody.contains(prkk_pToChange)) {
  MsgBox("Во дела! Абзац, который должен был быть размечен как подпись, куда-то пропал.");
  return;
 }
 prkk_markupImageTitle(doc,win,markupType);
 prkk_ptr=prkk_pToChange; 
 prkk_doc=doc;
 prkk_win=win;
 prkk_markupType=markupType;
 setTimeout("prkk_doSearch2();",600);
}

function Run() {
 var elementBrowser_versionNum="1.4";
 var dialogWidth_number=710;
 var dialogWidth=dialogWidth_number+"px";
 var dialogHeight="150px";
 var fbwBody=document.getElementById("fbw_body");
 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";} 
 prkk_nbspChar=nbspChar;
 var coll=new Object();
 coll["fbwBody"]=fbwBody;
 prkk_fbwBody=fbwBody;
 coll["mainDocument"]=document;
 coll["window"]=window;
 coll["versionNum"]=elementBrowser_versionNum;
 coll["nbspChar"]=nbspChar;
 window.prkk_dialogWin=window.showModelessDialog("HTML/Разметка подписей к иллюстрациям.html",coll,
   "dialogHeight: "+dialogHeight+"; dialogWidth: "+dialogWidth+"; "+
   "dialogLeft: "+(window.screenLeft+window.external.getViewWidth()-dialogWidth_number)+"px; dialogTop: "+window.screenTop+"; "+
   "center: No; help: No; resizable: No; status: No;");
}
