//author: Sclex
//version: 1.1
//Sclex, не забывай изменять номер версии в переменной versionStr

function Run() {
 var versionStr="1.1";
 var inscriptionClass="subtitle";
 var openingTag="";
 var closingTag="";
 window.external.BeginUndoUnit(document,"заголовки картинок в подписи"); 
 var cntImages=0,cntChanges=0; 
 var fbw_body=document.getElementById("fbw_body");
 if (!fbw_body) return;
 var el=fbw_body.firstChild;
 var saveNext,newEl1,newEl2,newEl3,inserted,realNext;
 while (el!=fbw_body) {
  //if (el.nodeType==1) alert(el.outerHTML);
  if (el.nodeName=="DIV" && el.className=="image" && el.firstChild!=null)
   if (el.firstChild.nodeName=="IMG") {
    cntImages++;
    if (el.title!="" && el.title!=null) {
     realNext=el.nextSibling;
     saveNext=el;
     if (saveNext.firstChild!=null && saveNext.nodeName!="P") {
      saveNext=saveNext.firstChild;
     } else {
      while (saveNext!=fbw_body && saveNext.nextSibling==null)
      saveNext=saveNext.parentNode;
      if (saveNext!=fbw_body) saveNext=saveNext.nextSibling;
     }
     if (realNext)
      if (realNext.nodeType!=1 || realNext.nodeName!="P" || realNext.innerHTML!="")
       {
        newEl1=document.createElement("P");
        newEl1.innerHTML="";
        inserted=el.parentNode.insertBefore(newEl1,el.nextSibling);
        window.external.inflateBlock(inserted)=true;
       }
     newEl2=document.createElement("P");
     if (inscriptionClass!="") newEl2.className=inscriptionClass;
     newEl2.innerHTML=openingTag+el.title+closingTag;
     el.parentNode.insertBefore(newEl2,el.nextSibling);
     //newEl3=document.createElement("P");
     //newEl3.innerHTML="&nbsp;";
     //newEl3.baseName="empty-line";
     //inserted=el.parentNode.insertBefore(newEl3,el.nextSibling);
     //window.external.inflateBlock(inserted)=true;
     el.removeAttribute("title");
     cntChanges++;
     el=saveNext;
    }
   } 
  if (el.firstChild!=null && el.nodeName!="P") {
   el=el.firstChild;
  } else {
   while (el!=fbw_body && el.nextSibling==null)
    el=el.parentNode;
   if (el!=fbw_body) el=el.nextSibling;
  }
 }
 MsgBox("--== Скрипт Sclex’а ==--\n"+
        "Заголовки картинок в подписи "+versionStr+"\n"+
        "\n"+
        "Встретилось картинок: "+cntImages+"\n"+
        "Заменено заголовков картинки на подпись: "+cntChanges);
 window.external.EndUndoUnit(document);
}