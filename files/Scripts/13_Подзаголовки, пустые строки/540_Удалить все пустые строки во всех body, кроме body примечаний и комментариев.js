 // Скрипт "Удалить все пустые строки во всех body, кроме body примечаний и комментариев"

function Run() {

 // номер версии скрипта
 var versionNumber="1.1";

 // флаг - обрабатывать ли history
 var processHistory=false;

 // флаг - обрабатывать ли annotation
 var processAnnotation=false;

 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

 var re0=new RegExp("^( | |&nbsp;|"+nbspChar+")*?$","");
 var re2=new RegExp("<(?!img)[^>]*?>", "gi");
 var re1=new RegExp("^(title|section|poem|text-author|cite|epigraph|stanza|body)$","");

 var Ts=new Date().getTime();
 var TimeStr=0;

 window.external.BeginUndoUnit(document,"удаление всех пустых строк в элементах body"); // ОТКАТ (UNDO) начало

 var id, nodeToRemove;
 var saveNode=null;
 var s="";
 var count=0;
 var fbw_body=document.getElementById("fbw_body");
 var ptr=fbw_body;
 var endProcessing=false;
 var saveNext;

 while (!endProcessing && ptr) {
  saveNext=ptr;
  if (saveNext.firstChild && saveNext.nodeName!="P" && 
      !(saveNext.nodeName=="DIV" && 
        (
         (saveNext.className=="history" && !processHistory)
         || 
         (saveNext.className=="annotation" && !processAnnotation)
         ||
         (saveNext.className=="body"
          &&
          (
           saveNext.getAttribute("fbname")=="notes"
           ||
           saveNext.getAttribute("fbname")=="comments"
          )
         )
         ||
         saveNext.className=="table"
        )
       )
     ) {
   saveNext=saveNext.firstChild;
   saveNode=null;
  }
  // либо углубляемся...
  else {
    saveNode=saveNext.parentNode;
    while (!saveNext.nextSibling)  {
     saveNext=saveNext.parentNode;
     // ...либо поднимаемся (если уже сходили вглубь)
     if (saveNext==fbw_body) endProcessing=true;
    }
   saveNext=saveNext.nextSibling; // и переходим на соседний элемент
  }
  if (ptr.nodeName=="P") {
   if (re0.test(ptr.innerHTML.replace(re2,""))) {
    ptr.removeNode(true);
    count++;
   }
  }
  while (saveNode && saveNode.nodeName=="DIV" && re1.test(saveNode.className) && !saveNode.firstChild) {
   nodeToRemove=saveNode;
   saveNode=saveNode.parentNode;
   nodeToRemove.removeNode(true);
  }
  ptr=saveNext;
 }

 // undo конец
 window.external.EndUndoUnit(document);

 var Tf=new Date().getTime();
 var Tmin = Math.floor((Tf-Ts)/60000);
 var Tsek = Math.ceil(10*((Tf-Ts)/1000-Tmin*60))/10;
 if (Tmin>0) {var TimeStr=Tmin+" мин. "+Tsek+" с"}
 else {var TimeStr=Tsek+" с"}

 try {
  if (count!=0)
   window.external.SetStatusBarText("Удалено пустых строк: " +count+ ". Время работы скрипта: "+TimeStr+". Версия скрипта: "+versionNumber+".");
  else
   window.external.SetStatusBarText("Пустых строк не найдено. Время работы скрипта: "+TimeStr+". Версия скрипта: "+versionNumber+".");
 }
 catch (e)
 {}

}