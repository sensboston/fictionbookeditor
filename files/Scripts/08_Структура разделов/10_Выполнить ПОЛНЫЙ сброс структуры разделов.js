// Скрипт "Полный срос структуры разделов"
// version 1.3
// Автор Sclex

function Run() {

 var newSect, htmlStr, firstSection, wasClosingSection;

 function rec(el) {
  var saveNext,saveNext2,el2;
  while (el) {
   saveNext=el.nextSibling;
   if (el.nodeName=="DIV" && el.className=="image") {
     htmlStr+=el.outerHTML;
   }
   else if (el.nodeName=="DIV" && el.className!="section") {
     if ((el.className!="title" && el.className!="epigraph" && el.className!="annotation")
          ||
          ((el.className=="epigraph" || el.className=="title" || el.className=="annotation") && el.parentNode.className=="body")) {
       htmlStr+="<DIV class="+el.className+(el.getAttribute("id")?" id='"+el.getAttribute("id")+"'":"")+">";
       rec(el.firstChild);
       htmlStr+="</DIV>";
     }
    else rec(el.firstChild);
   }
   if (el.nodeName=="DIV" && el.className=="body" && el.firstChild) {
     if (el.getAttribute("fbname")!="notes" && el.getAttribute("fbname")!="comments") {
       htmlStr="<DIV class=body"+(el.getAttribute("id")?" id='"+el.getAttribute("id")+"'":"")+">";
       firstSection=true;
       wasClosingSection=false;
       rec(el.firstChild);
       if (wasClosingSection) htmlStr+="</DIV>";
       htmlStr+="</DIV>";
       //alert(htmlStr);
       el.innerHTML="<P>1</P>";
       newSect=el.insertAdjacentHTML("beforeBegin",htmlStr);
       InflateIt(newSect);
       el.innerHTML="";
       el.removeNode(true);
     }
   }
   if (el.nodeName=="DIV" && el.className=="section") {
     if (firstSection) {
       htmlStr+="<DIV class=section"+(el.getAttribute("id")?" id='"+el.getAttribute("id")+"'":"")+">";
       firstSection=false;
       wasClosingSection=true;
     }
     rec(el.firstChild);
   }
   if (el.nodeName=="P") {
     if (el.className=="text-author" && el.parentNode.className=="epigraph")
       htmlStr+="<P"+(el.getAttribute("id")?" id='"+el.getAttribute("id")+"'":"")+">";
     else
       htmlStr+="<P"+(el.getAttribute("id")?" id='"+el.getAttribute("id")+"'":"")+(el.className?" class='"+el.className+"'":"")+">";
     if (el.innerHTML=="")
       htmlStr+="&nbsp;";
     else  
       htmlStr+=el.innerHTML;
     htmlStr+="</P>";
   }
   el=saveNext;
  }
 }

 window.external.BeginUndoUnit(document,"полный сброс структуры разделов");
 var fbwBody=document.getElementById("fbw_body");
 if (!fbwBody) return;
 if (fbwBody.firstChild)
   rec(fbwBody.firstChild);
 window.external.EndUndoUnit(document);
 try {
   window.external.SetStatusBarText("Полный сброс структуры разделов успешно завершен.");
 }
 catch(e) 
 {}
}