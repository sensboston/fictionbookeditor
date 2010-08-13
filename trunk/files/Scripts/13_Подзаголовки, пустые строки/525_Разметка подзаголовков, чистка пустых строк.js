// Разметка подзаголовков, чистка пустых строк
// Автор: Sclex

function Run() {
 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}
 var verStr="v3.6";
 var DebugMode=0;
 var DestrongTitles=false; //делать ли удаление жирности в заголовках
 var DeitalicTitles=false; //удалять ли курсив в заголовках
 var PromptDestrongTitles=false; //выдавать запрос, выполнять ли разжирнение заголовков
 var EmptyCleared=0;
 var EmptyClearedEmpty=0;
 var EmptyClearedCite=0;
 var EmptyClearedPoem=0;
 var EmptyClearedSubtitle=0;
 var EmptyClearedSectionBegin=0;
 var EmptyClearedSectionEnd=0;
 var EmptyClearedInPoem=0;
 var EmptyClearedTitleBegin=0;
 var EmptyClearedTitleEnd=0;
 var EmptyClearedTitleInside=0;
 var EmptyClearedEpigraphBegin=0;
 var EmptyClearedEpigraphEnd=0;
 var EmptyClearedCiteBegin=0;
 var EmptyClearedCiteEnd=0;
 var while_flag;
 var txt;
 var re0=new RegExp("^( | |&nbsp;|"+nbspChar+")*?$","i");

 function destrongAndDeitalic(el,destrong,deitalic) {
  var savedEl=el;
  var savedEl2;
  el=el.firstChild;
  while (el) {
   if (el.firstChild)
    el=el.firstChild;
   else {
    while (el && el!=savedEl && el.nextSibling==null) el=el.parentNode;
    if (el && el!=savedEl) el=el.nextSibling;
    if (el==savedEl) return;
   } 
   if (
       (destrong && (el.nodeName=="STRONG" || el.nodeName=="B")) 
       ||
       (deitalic && (el.nodeName=="EM" || el.nodeName=="I")) 
      ) {
    savedEl2=el.firstChild ? el.firstChild : el.nextSibling;
    el.removeNode(false);
    el=savedEl2;
   }
  }
 }

 function isLineEmpty(ptr) {
  return re0.test(ptr.innerHTML.replace(/<(?!img)[^>]*?>/gi,""));
 }

 //a
 function IsLineSubtitle(ptr) {
  var re=new RegExp("^( |"+nbspChar+")*\\*(( |"+nbspChar+")*(\\*))?(( |"+nbspChar+")*(\\*))?( |"+nbspChar+")*$","");
  if (ptr.innerText.search(re)!=-1) {return true;}
  else {return false;}
 }

 function Recursive(ptr) {
 
 function removeEmptiesAtEnd(elemName) {
  var a3=a5.lastChild;
  var go_more=true;
  var SavePrevA3;
  while (a3!=null && go_more) {
   SavePrevA3=a3.previousSibling;
   if (a3.nodeName=="P" && isLineEmpty(a3)) {
    a3.outerHTML="";
    EmptyCleared++;
    switch(elemName) {
     case "section":
      EmptyClearedSectionEnd++;
      break;
     case "epigraph":
      EmptyClearedEpigraphEnd++;
      break;
     case "cite":
      EmptyClearedCiteEnd++;
    }
   } else
    go_more=false;
   a3=SavePrevA3;
  }
 }  
 
 function removeEmptiesAtBegin(elemName) {
  var go_more=true;
  var a4=savedFirstEmpty;
  var SaveNextA4;
  while (a4!=null && go_more) {
   SaveNextA4=a4.nextSibling;
   if (a4.nodeName=="P" &&
       isLineEmpty(a4) && a4.parentNode!=null) {
    a4.outerHTML="";
    EmptyCleared++;
    switch(elemName) {
     case "section":
      EmptyClearedSectionBegin++;
      break;
     case "epigraph":
      EmptyClearedEpigraphBegin++;
      break;
     case "cite":
      EmptyClearedCiteBegin++;
    }
   } else {
    go_more=false;
   }
  a4=SaveNextA4;
  }
 }
 
  var savedPtr=ptr;
  if (ptr==null) return;
  var a5=ptr.parentNode;
  var after_title=false;
  var flag_of_begin=true;
  var firstEmptyMemorized=false;
  var image_flag=false;
  var savedFirstEmpty=null;
  while (ptr!=null) {
   var SaveNextPtr=ptr.nextSibling;
 //  MsgBox("ptr.outerHTML:"+ptr.outerHTML);
   if (ptr.nodeName=="DIV"&&
       (ptr.className=="section"||ptr.className=="body"||ptr.className=="poem"||
        ptr.className=="stanza"||ptr.className=="cite"||ptr.className=="epigraph")) {
    Recursive(ptr.firstChild);
   }
   if (ptr.nodeName=="DIV" && ptr.className=="title") {
    //удаление пустых строк в заголовке
    while_flag=true;
    while (while_flag)
     if (ptr.firstChild)
      if (isLineEmpty(ptr.firstChild)) {
       ptr.firstChild.removeNode(true);
       EmptyClearedTitleBegin++;
       EmptyCleared++;
      }
      else while_flag=false;
     else while_flag=false;
    while_flag=true;
    while (while_flag)
     if (ptr.lastChild)
      if (isLineEmpty(ptr.lastChild)) {
       ptr.lastChild.removeNode(true);
       EmptyClearedTitleEnd++;
       EmptyCleared++;
      }
      else while_flag=false;
     else while_flag=false;
    var ptrInTitle=ptr.lastChild;
    var savePrev;
    while (ptrInTitle!=null) {
     savePrev=ptrInTitle.previousSibling;
     if (isLineEmpty(ptrInTitle)) {
      ptrInTitle.removeNode(true);
      EmptyClearedTitleInside++;
      EmptyCleared++;
     }
     ptrInTitle=savePrev;
    }
    //удаление жирности и курсива в заголовке
    destrongAndDeitalic(ptr,DestrongTitles,DeitalicTitles);
   }
   if (ptr.nodeName=="DIV" && ptr.className=="image") {
    if (flag_of_begin && !image_flag) {
     flag_of_begin=false;    
     image_flag=true;
    } else if (image_flag) image_flag=false;
   }
   if (ptr.nodeName=="P" && ptr.parentNode.className=="section") {
    if (!isLineEmpty(ptr)) {
     flag_of_begin=false;
     image_flag=false;
    } else if (firstEmptyMemorized==false && (flag_of_begin || image_flag)) {
     firstEmptyMemorized=true;
     savedFirstEmpty=ptr;
     flag_of_begin=false;
    }
   }
   if (!firstEmptyMemorized && ptr.nodeName=="P" &&
       (ptr.parentNode.className=="epigraph" || ptr.parentNode.className=="poem" ||
       ptr.parentNode.className=="cite") && isLineEmpty(ptr)) {
    firstEmptyMemorized=true;
    savedFirstEmpty=ptr;       
   }
   if (ptr.nodeName=="DIV" &&
      (ptr.className=="table" || ptr.className=="cite" || ptr.className=="poem"))
     flag_of_begin=false;
   if ( (ptr.nodeName=="DIV" &&
        (ptr.className=="poem" || ptr.className=="cite"))||
        (ptr.nodeName=="P" && isLineEmpty(ptr)) ) {
       //чистка пустых строк перед poem, cite или empty-line
       var a1=ptr.previousSibling;
       var flag=true;
       while (a1!=null && flag) {
        var SavePrev=a1.previousSibling;
         if (a1.nodeName=="P" && isLineEmpty(a1)) {
         a1.outerHTML="";
         EmptyCleared++;
         if (ptr.nodeName=="P") {
          if (ptr.parentNode.nodeName=="DIV" && ptr.parentNode.className=="stanza") {
           EmptyClearedInPoem++;
          } else {
           EmptyClearedEmpty++;
          }
         }
         if (ptr.nodeName=="DIV" && ptr.className=="cite") {EmptyClearedCite++;}
         if (ptr.nodeName=="DIV" && ptr.className=="poem") {EmptyClearedPoem++;}
        } else flag=false;
        a1=SavePrev;
       }
       //чистка пустых строк после poem, cite или empty-line
       var flag=true;
       var a2=ptr.nextSibling;
       while (a2!=null && flag) {
        var SaveNext=a2.nextSibling;
        if (a2.nodeName=="P" && isLineEmpty(a2)) {
         SaveNextPtr=a2.nextSibling;
         a2.outerHTML="";
         EmptyCleared++;
         if (ptr.nodeName=="P") {
          if (ptr.parentNode.nodeName=="DIV" && ptr.parentNode.className=="stanza") {
           EmptyClearedInPoem++;
          } else {
           EmptyClearedEmpty++;
          }
         }
         if (ptr.nodeName=="DIV" && ptr.className=="cite") {EmptyClearedCite++;}
         if (ptr.nodeName=="DIV" && ptr.className=="poem") {EmptyClearedPoem++;}
        } else flag=false;
        a2=SaveNext;
       }
       if (ptr.parentNode.nodeName=="DIV"&&ptr.parentNode.className=="stanza") {
        ptr.outerHTML="";
        EmptyCleared++;
        EmptyClearedInPoem++;
       }
   }
   if (ptr.nodeName=="P") {
     var chld=ptr.firstChild;
     if (chld!=null) {
      if (IsLineSubtitle(ptr)) {
       ptr.className="subtitle";
       ptr.innerHTML="* * *";
       destrongAndDeitalic(ptr,DestrongTitles,DeitalicTitles);
      }
      if (ptr.className=="subtitle") {
       //чистка пустых строк перед сабтитлом
       var a1=ptr.previousSibling;
       var flag=true;
       while (a1!=null && flag) {
        var SavePrev=a1.previousSibling;
         if (a1.nodeName=="P" && isLineEmpty(a1)) {
         a1.outerHTML="";
         EmptyCleared++;
         EmptyClearedSubtitle++;
        } else flag=false;
        a1=SavePrev;
       }
       //чистка пустых строк после сабтитла
       var flag=true;
       var a2=ptr.nextSibling;
       while (a2!=null && flag) {
        var SaveNext=a2.nextSibling;
        if (a2.nodeName=="P" && isLineEmpty(a2)) {
         SaveNextPtr=a2.nextSibling;
         a2.outerHTML="";
         EmptyCleared++;
         EmptyClearedSubtitle++;
        } else flag=false;
        a2=SaveNext;
       }
      }
     }
    }
   ptr=SaveNextPtr;
  }  if (savedPtr.parentNode && savedPtr.parentNode.nodeName=="DIV" && savedPtr.parentNode.className=="section") {
   /*alert("firstEmptyMemorized: "+firstEmptyMemorized);
   alert("a3!=savedFirstEmpty: "+(a3!=savedFirstEmpty));
   alert("!savedFirstEmpty.previousSibling: "+!savedFirstEmpty.previousSibling);
   alert("savedFirstEmpty.previousSibling.className!=\"image\": "+savedFirstEmpty.previousSibling.className!="image");
   alert("savedFirstEmpty.nextSibling: "+savedFirstEmpty.nextSibling);*/
   if (!firstEmptyMemorized || (a3!=savedFirstEmpty && (!savedFirstEmpty.previousSibling ||
       savedFirstEmpty.previousSibling.className!="image")) || savedFirstEmpty.nextSibling)
    //чистка пустых строк в конце секции
    removeEmptiesAtEnd("section");
   var a3=a5.lastChild;
   if (firstEmptyMemorized && a3!=savedFirstEmpty)
    if (!savedFirstEmpty.nextSibling || savedFirstEmpty.nextSibling.className!="image")
     //чистка пустых строк в начале секции
     removeEmptiesAtBegin("section");
  }
  else if (savedPtr.parentNode && savedPtr.parentNode.nodeName=="DIV" &&
  (savedPtr.parentNode.className=="epigraph" ||
   savedPtr.parentNode.className=="cite")) {
   removeEmptiesAtEnd(savedPtr.parentNode.className);
   if (firstEmptyMemorized)
    removeEmptiesAtBegin(savedPtr.parentNode.className);
  }  
 }

 function Recursive2(ptr) {
  var NotFirst=false;
  while (ptr!=null) {
   var SaveNext=ptr.nextSibling;
   if (NotFirst) {
 //  MsgBox("NotFirst:"+NotFirst+"\n ptr.previousSibling.nodeName:"+ptr.previousSibling.nodeName+
 //  "\n ptr.previousSibling.className:"+ptr.previousSibling.className+"\n ptr.firstChild:"+
 //  ptr.firstChild+"\n ptr.outerHTML:"+ptr.outerHTML);
     if (ptr.previousSibling.nodeName=="DIV" && ptr.previousSibling.className=="section" &&
         ptr.firstChild!=null) {
      chld = ptr.firstChild;
      var flag=false;
      if (chld.nodeName=="DIV" && chld.className=="title" &&
          chld.firstChild!=null) {
       chld2=chld.firstChild;
       if (chld2.nodeName=="P" && IsLineSubtitle(chld2)) {
        chld.outerHTML="<P class=subtitle>* * *</P>";
        flag=true;
        destrongAndDeitalic(chld,DestrongTitles,DeitalicTitles);
       }
      }
      if ((chld.nodeName=="P" && chld.className=="subtitle") ||
          flag) {
       var hhh=ptr.previousSibling;
       var s=ptr.innerHTML;
       ptr.outerHTML="";
       hhh.innerHTML=hhh.innerHTML+s;
       s="";
     }
    }
   }
   if (ptr.nodeName=="DIV" && (ptr.className=="section" || ptr.className=="body")) {
    Recursive2(ptr.firstChild);
   }
   ptr=SaveNext;
   NotFirst=true;
  }
 }

 var Ts=new Date().getTime();
 var body=document.getElementById("fbw_body");
 window.external.BeginUndoUnit(document,"subtitles markup, empty lines clearing");
 if (PromptDestrongTitles) {
  DestrongTitles=AskYesNo("Удалять ли жирность в заголовках?");
 }
 Recursive(body.firstChild);
 Recursive2(body.firstChild);
 window.external.EndUndoUnit(document);
 var Tf=new Date().getTime();
 var Tmin = Math.floor((Tf-Ts)/60000);
 var Tsek = Math.ceil(10*((Tf-Ts)/1000-Tmin*60))/10;
 if (Tmin>0) {var TimeStr=Tmin+" мин. "+Tsek+" с"}
 else {var TimeStr=Tsek+" с"}
 MsgBox('Работа скрипта "Разметка подзаголовков, чистка пустых строк '+verStr+'" завершена.'+
        '\n\nУдалено пустых строк:'+
        '\n– из-за соседства с пустой строкой: '+EmptyClearedEmpty+
        '\n– из-за соседства с цитатой: '+EmptyClearedCite+
        '\n– из-за соседства со стихом: '+EmptyClearedPoem+
        '\n– из-за соседства с подзаголовком: '+EmptyClearedSubtitle+
        '\n– внутри стихов: '+EmptyClearedInPoem+
        '\n– в начале секции: '+EmptyClearedSectionBegin+
        '\n– в конце секции: '+EmptyClearedSectionEnd+
        '\n– в начале эпиграфа: '+EmptyClearedEpigraphBegin+
        '\n– в конце эпиграфа: '+EmptyClearedEpigraphEnd+
        '\n– в начале цитаты: '+EmptyClearedEpigraphBegin+
        '\n– в конце цитаты: '+EmptyClearedEpigraphEnd+
        '\n– в начале заголовка: '+EmptyClearedTitleBegin+
        '\n– в конце заголовка: '+EmptyClearedTitleEnd+
        '\n– посреди заголовка: '+EmptyClearedTitleInside+
        '\n-------------------------------------------------------------------------'+
        '\nВсего удалено пустых строк: '+EmptyCleared+
        '\n\nВремя работы: '+TimeStr);
}