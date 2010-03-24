//Переход по ссылке или возврат на ссылку v1.6
//автор Sclex

function Run() {

 function myGoTo(elem) {
  elem.scrollIntoView(true);
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

 function goFromRef() {
  var fbw_body=document.getElementById("fbw_body");
  if (document.selection.type.toLowerCase()=="control") return;
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
    var saveParent=tmpNote.parentNode;
    tmpNote.removeNode();
    //вначале идет код, проверяющий, есть ли ссылка ЗА позицией курсора
    if (saveNext==null) {
     el=saveParent;
     while (el.nextSibling==null && el.nodeName!="DIV" && el.nodeName!="P" && el.nodeName!="BODY") el=el.parentNode;
     if (el.nodeName!="DIV" && el.nodeName!="P" && el.nodeName!="BODY") el=el.nextSibling;
    } 
    else el=saveNext;
    if (el.nodeName!="DIV" && el.nodeName!="P" && el.nodeName!="BODY") {
     while (el.nodeName!="A" && el.nodeName!="#text" && el.nodeName!="DIV" && el.nodeName!="P" && el.nodeName!="BODY")
      if (el.firstChild) el=el.firstChild;
      else { 
       while (el.nextSibling==null && el.nodeName!="DIV" && el.nodeName!="P" && el.nodeName!="BODY") el=el.parentNode;
       if (el.nodeName!="DIV" && el.nodeName!="P" && el.nodeName!="BODY") el=el.nextSibling;
      } 
     if (el.nodeName=="#text") el=null;
    } else el=null;
    //тут идет код, проверяющий, есть ли ссылка ПЕРЕД позицией курсора
    if (el==null) {
     if (savePrevious==null) {
      el=saveParent;
      while (el.previousSibling==null && el.nodeName!="DIV" && el.nodeName!="P" && el.nodeName!="BODY") el=el.parentNode;
      if (el.nodeName!="DIV" && el.nodeName!="P" && el.nodeName!="BODY") el=el.previousSibling;
     } 
     else el=savePrevious;
     if (el.nodeName!="DIV" && el.nodeName!="P" && el.nodeName!="BODY") {
      while (el.nodeName!="A" && el.nodeName!="#text" && el.nodeName!="DIV" && el.nodeName!="P" && el.nodeName!="BODY")
       if (el.lastChild) el=el.lastChild;
       else { 
        while (el.previousSibling==null && el.nodeName!="DIV" && el.nodeName!="P" && el.nodeName!="BODY") el=el.parentNode;
        if (el.nodeName!="DIV" && el.nodeName!="P" && el.nodeName!="BODY") el=el.previousSibling;
       } 
      if (el.nodeName=="#text") el=null;
     } 
    }
    if (el==null || el.nodeName=="DIV" || el.nodeName=="P" || el.nodeName=="BODY") return "не удалось перейти по ссылке";
   }
   var href=getLocalHref(el.href);
   if (href==-1) return;
   el=document.getElementById(href);
   if (!el) return;
   var el2=el;
   if (el.nodeName=="DIV" && el.className=="section") {
    if (el.firstChild) {
     el2=el.firstChild;
     while (el2!=null && el2.nodeName=="DIV" && (el2.className=="image" || el2.className=="title")) el2=el2.nextSibling;
     if (el2==null) el2=el;
    }
    myGoTo(el2);
    el.scrollIntoView(true);
   } else {
    myGoTo(el);
    el.scrollIntoView(true);
   }
  }
 }    

 if (goFromRef()!="не удалось перейти по ссылке") return;
 var fbw_body=document.getElementById("fbw_body");
 if (document.selection.type.toLowerCase()=="control") return;
 var rng=document.selection.createRange();
 if (!rng) return;
 rng.collapse(false);
 var el=rng.parentElement();
 if (!el) return;
 while ((el.nodeName!="DIV" || el.className!="section") && el!=fbw_body) el=el.parentNode;
 if (el!=fbw_body) {
  var sectionId=el.id;
  if (sectionId!=undefined && sectionId!="") {
   for (var i=0;i<document.links.length;i++) {
    if (getLocalHref(document.links[i].href)==sectionId) {
     GoTo(document.links[i]);
     return;
    }
   }
   alert("Не найдено ссылки, которая ссылалась бы на данную секцию.");
  }
 }
}
