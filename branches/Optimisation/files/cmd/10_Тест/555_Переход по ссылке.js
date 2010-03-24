//Переход по ссылке v1.1
//автор Sclex

function Run() {

 function myGoTo(elem)
 {
  if(!elem) return;
  var r=document.selection.createRange();
  if (!r || !("compareEndPoints" in r)) return;
  r.moveToElementText(elem);
  r.collapse(true);
  if(r.parentElement!==elem && r.move("character",1)==1) r.move("character",-1);
  r.select();
 }

 function getLocalHref(name) {
   var i=1;
   var name1=name;
   var thg2=new RegExp("#");
   if (name1.search(thg2)==-1) {return(-1)} //ссылка не может начинаться с 1
   var thg=new RegExp("main\.html\#","i");
   srch10=name1.search(thg);
   if (srch10==-1) {
    name1 = name1.substring(1,name1.length);
   } else {
    name1 = name1.substring(srch10+10,name1.length);
   }
   return(name1);
 } 

 var fbw_body=document.getElementById("fbw_body");
 var rng=document.selection.createRange();
 if (!rng) return;
 rng.collapse(false);
 var el=rng.parentElement();
 if (!el) return;
 if (fbw_body.contains(el)) {
  while (el.nodeName!="DIV" && el.nodeName!="A") el=el.parentNode;
  if (el.nodeName!="A") {
   rng.pasteHTML('<B id=sclexGoByReferenceTemporaryTag></B>')
   var tmpNote=document.getElementById("sclexGoByReferenceTemporaryTag");
   if (!tmpNote) return;
   el=null;
   var savePrevious=tmpNote.previousSibling;
   var saveNext=tmpNote.nextSibling;
   tmpNote.removeNode();   
   if (saveNext)
    if (saveNext.nodeType==1) {
     el=saveNext;
     var whileFlag=true;
     while (whileFlag) 
      if (el!=null)
       if (el.nodeName!="A" && el.nodeName!="#text") el=el.firstChild;
       else whileFlag=false;
      else whileFlag=false;
     if (!el) 
      if (el.nodeName!="A") return;   
    }   
   if (el==null && savePrevious)
    if (savePrevious.nodeType==1) {
     el=savePrevious;
     var whileFlag=true;
     while (whileFlag) 
      if (el!=null)
       if (el.nodeName!="A" && el.nodeName!="#text") el=el.lastChild;
       else whileFlag=false;
      else whileFlag=false;
     if (!el) return;
     if (el.nodeName!="A") return;
    } 
   if (el==null) return;  
  }
  var href=getLocalHref(el.href);
  if (href==-1) return;
  el=document.getElementById(href);
  var el2=el;
  if (el.nodeName=="DIV" && el.className=="section") {
   el2=el.firstChild;
   while (el2.nodeName=="DIV" && (el2.className=="image" || el2.className=="title")) el2=el2.nextSibling;
   if (el2==null) el2=el;
  }
  myGoTo(el2);
  el.scrollIntoView(true);       
 }
}

function SetHotkey()     // Ctrl+Shift+RIGHT ARROW key
{
  return 39;
}