//Переход на место, ссылающееся на текущую секцию v1.1
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

 var fbw_body=document.getElementById("fbw_body");
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

function SetHotkey()     // Ctrl+Shift+LEFT ARROW key
{
  return 37;
}