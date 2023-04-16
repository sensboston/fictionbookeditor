// Скрипт "сброс структуры до разделов первого уровня"
// Версия 1.1

function Run() {

 var newSect, htmlStr;
 
 function rec(el) {
   var sectionOpened=false;
   var sectionClosed=false;
   var saveNext;
   while (el) {
     saveNext=el.nextSibling; 
     if (el.nodeName=="DIV" && el.className=="body" && el.firstChild) {
       if (el.getAttribute("fbname")!="notes" && el.getAttribute("fbname")!="comments") {
         htmlStr="";
         rec(el.firstChild);
         //alert("Результат:\n\n"+htmlStr);
         el.innerHTML=htmlStr;
       }
     }
     else if (el.nodeName=="DIV" && el.className=="section" && el.firstChild) {
       if (sectionOpened && !sectionClosed) {
         htmlStr+="</DIV>";
         sectionOpened=false;
       }
       rec(el.firstChild);
     }
     else if (el.nodeName=="DIV" || el.nodeName=="P") {
       if (!sectionOpened) {
         htmlStr+="<DIV class=section>";
         sectionOpened=true;
         sectionClosed=false;
       }
       htmlStr+=el.outerHTML;
     }
     el=saveNext;   
   }
   if (sectionOpened) htmlStr+="</DIV>";
 }

 window.external.BeginUndoUnit(document,"сброс структуры до разделов первого уровня");
 var fbwBody=document.getElementById("fbw_body");
 if (!fbwBody) return;
 htmlStr="";
 if (fbwBody.firstChild) rec(fbwBody.firstChild);
 window.external.EndUndoUnit(document);
}