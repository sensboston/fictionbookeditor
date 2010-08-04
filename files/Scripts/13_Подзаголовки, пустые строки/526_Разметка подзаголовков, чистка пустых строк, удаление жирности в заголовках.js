// Разметка подзаголовков, чистка пустых строк
// Автор: Sclex

function Run() {
 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}
 var verStr="v3.5";
 var DebugMode=0;
 var DestrongTitles=true; //делать ли удаление жирности в заголовках
 var DeitalicTitles=false; //удалять ли курсив в заголовках
 var PromptDestrongTitles=false; //выдавать запрос, выполнять ли разжирнение заголовков
 var destrongRegExp = new RegExp("</?(STRONG|B)( [^>]*)?>","gi");
 var destrongRegExp_ = "";
 var deitalicRegExp = new RegExp("</?(EM|I)( [^>]*)?>","gi");
  var deitalicRegExp_ = "";
 var EmptyCleared=0;
 var EmptyClearedEmpty=0;
 var EmptyClearedCite=0;
 var EmptyClearedPoem=0;
 var EmptyClearedSubtitle=0;
 var EmptyClearedBegin=0;
 var EmptyClearedEnd=0;
 var EmptyClearedInPoem=0;
 var EmptyClearedTitleBegin=0;
 var EmptyClearedTitleEnd=0;
 var EmptyClearedTitleInside=0;
 var while_flag;
 var txt;
 var re0=new RegExp("^( | |&nbsp;|"+nbspChar+")*?$","i");

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
        ptr.className=="stanza"||ptr.className=="cite")) {
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
    //удаление жирности в заголовке
    if (DestrongTitles) {
      ptr.innerHTML=ptr.innerHTML.replace(destrongRegExp,destrongRegExp_);
    }
    //удаление курсива в заголовке
    if (DeitalicTitles) {
     ptr.innerHTML=ptr.innerHTML.replace(deitalicRegExp,deitalicRegExp_);
    }
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
        EmptyClearedInPoem++;
       }
   }
   if (ptr.nodeName=="P") {
     var chld=ptr.firstChild;
     if (chld!=null) {
      if (IsLineSubtitle(ptr)) {
       ptr.className="subtitle";
       ptr.innerHTML="* * *";
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
   var a3=a5.lastChild;
   /*alert("firstEmptyMemorized: "+firstEmptyMemorized);
   alert("a3!=savedFirstEmpty: "+(a3!=savedFirstEmpty));
   alert("!savedFirstEmpty.previousSibling: "+!savedFirstEmpty.previousSibling);
   alert("savedFirstEmpty.previousSibling.className!=\"image\": "+savedFirstEmpty.previousSibling.className!="image");
   alert("savedFirstEmpty.nextSibling: "+savedFirstEmpty.nextSibling);*/
   if (!firstEmptyMemorized || (a3!=savedFirstEmpty && (!savedFirstEmpty.previousSibling ||
       savedFirstEmpty.previousSibling.className!="image")) || savedFirstEmpty.nextSibling) {
    //чистка пустых строк в конце секции
    var go_more=true;
    while (a3!=null && go_more) {
     var SavePrevA3=a3.previousSibling;
     if (a3.nodeName=="P" && isLineEmpty(a3)) {
      a3.outerHTML="";
      EmptyCleared++;
      EmptyClearedEnd++;
     } else
      go_more=false;
     a3=SavePrevA3;
    }
   }
   var a3=a5.lastChild;
   if (firstEmptyMemorized && a3!=savedFirstEmpty)
    if (!savedFirstEmpty.nextSibling || savedFirstEmpty.nextSibling.className!="image")  {
     //чистка пустых строк в начале секции
     var go_more=true;
     var a4=savedFirstEmpty;
     while (a4!=null && go_more) {
      var SaveNextA4=a4.nextSibling;
      if (a4.nodeName=="P" &&
          isLineEmpty(a4) && a4.parentNode!=null) {
       if (a4.parentNode.className=="section") {
        a4.outerHTML="";
        EmptyCleared++;
        EmptyClearedBegin++;
       }
      } else {
       go_more=false;
      }
     a4=SaveNextA4;
     }
    }
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
        '\n– из-за соседства с <empty-line/>: '+EmptyClearedEmpty+
        '\n– из-за соседства с <cite>: '+EmptyClearedCite+
        '\n– из-за соседства с <poem>: '+EmptyClearedPoem+
        '\n– из-за соседства с <subtitle>: '+EmptyClearedSubtitle+
        '\n– внутри <poem>: '+EmptyClearedInPoem+
        '\n– в начале секции: '+EmptyClearedBegin+
        '\n– в конце секции: '+EmptyClearedEnd+
        '\n– в начале заголовка: '+EmptyClearedTitleBegin+
        '\n– в конце заголовка: '+EmptyClearedTitleEnd+
        '\n– посреди заголовка: '+EmptyClearedTitleInside+
        '\n-------------------------------------------------------------------------'+
        '\nВсего удалено пустых строк: '+EmptyCleared+
        '\n\nВремя работы: '+TimeStr);
}