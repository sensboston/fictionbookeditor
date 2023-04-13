//Скрипт набора «Поиск форматирования»
//Автор Sclex
//Топик про скрипты FBE: http://www.fictionbook.org/forum/viewtopic.php?t=4412
//Мой сайт про мои скрипты: http://scripts.fictionbook.org

function Run() {
 var versionStr="Переход на предыдущую жирность v1.1.";
 var scriptDirection="backward";
 var isItTagWeLookingFor=function (t) { if (t.nodeName=="B" || t.nodeName=="STRONG") return true; else return false;}
 var paragraphIndent=false;
 
 var randomNum,beginMarkerId,endMarkerId,beginMarkerEl,endMarkerEl,range1,range2,el,el2,el3,b,placeWhereToStop,fbw_body,nowInTagWeLookingFor,tagWeLookingFor_count;
 window.external.BeginUndoUnit(document,versionStr);
 
 function getNextNodeInScriptDirection(a) {
  if (scriptDirection=="forward") {
   if (a.firstChild) {
    if (isItTagWeLookingFor(a)) tagWeLookingFor_count++;
    a=a.firstChild;
   } else {
    while (a!=fbw_body && a!=placeWhereToStop && a.nextSibling==null) {
     if (isItTagWeLookingFor(a) && tagWeLookingFor_count>0) tagWeLookingFor_count--;
     a=a.parentNode;
    } 
    if (a!=fbw_body && a!=placeWhereToStop) {
     if (isItTagWeLookingFor(a) && tagWeLookingFor_count>0) tagWeLookingFor_count--;
     a=a.nextSibling;
    } 
   }
  } else {
   if (a.lastChild) {
    if (isItTagWeLookingFor(a)) tagWeLookingFor_count++;
    a=a.lastChild;
   } else {
    while (a!=fbw_body && a!=placeWhereToStop && a.previousSibling==null) {
     if (isItTagWeLookingFor(a) && tagWeLookingFor_count>0) tagWeLookingFor_count--;
     a=a.parentNode;
    } 
    if (a!=fbw_body && a!=placeWhereToStop) {
     if (isItTagWeLookingFor(a) && tagWeLookingFor_count>0) tagWeLookingFor_count--;
     a=a.previousSibling;
    } 
   }
  }
  return a;
 }
 
 function nonEmptyTag(f) {
 
  function getNextNodeInScriptDirection2(t) {
   a=t;
   if (scriptDirection=="forward") {
    if (a.firstChild) a=a.firstChild;
    else {
     while (a!=f && a.nextSibling==null) a=a.parentNode;
     if (a!=f) a=a.nextSibling;
    }
   } else {
    if (a.lastChild) a=a.lastChild;
    else {
     while (a!=f&& a.previousSibling==null) a=a.parentNode;
     if (a!=f) a=a.previousSibling;
    }
   }
   return a;
  }
 
  if (!f.hasChildNodes()) return false;
  el3=getNextNodeInScriptDirection2(f);
  while (el3!=f && el3.nodeType!=3) el3=getNextNodeInScriptDirection2(el3);
  if (el3.nodeType==3) return true;
  else return false;
 }
 
 function mySearch() {
  //alert(fbw_body.outerHTML);
  //проверим, сколько раз находится маркер, от которого начинаем движение, в теге искомого типа
  tagWeLookingFor_count=0;
  el2=el;
  if (paragraphIndent) {
   while (el.parentNode.nodeName!="BODY" && el.parentNode.nodeName!="DIV") el=el.parentNode;
   if ((scriptDirection=="forward"?el.nextSibling:el.previousSibling)==null) {
    while (el!=fbw_body && (scriptDirection=="forward"?el.nextSibling:el.previousSibling)==null) el=el.parentNode;
    if (el!=fbw_body) el=(scriptDirection=="forward"?el.nextSibling:el.previousSibling);
   } else el=scriptDirection=="forward"?el.nextSibling:el.previousSibling;
   if (el==fbw_body)
    if (confirm("Достигнут"+(scriptDirection=="forward"?" конец":"о начало")+" документа.\nПродолжить поиск с "+(scriptDirection=="forward"?"начала":"конца")+" документа?")) el=fbw_body;
    else return;
  } else {
   while (el2!=fbw_body) {
    if (isItTagWeLookingFor(el2)) tagWeLookingFor_count++;
    el2=el2.parentNode;
   }
   //alert("tagWeLookingFor_count:"+tagWeLookingFor_count);
   //теперь пройдем курсив, на котором находимся, если надо
   while (!((el.nodeType==3 && tagWeLookingFor_count==0) || (el.nodeName=="P" && window.external.inflateBlock(el)==true) || el.nodeName=="IMG")) {
    el=getNextNodeInScriptDirection(el);
    if (el==placeWhereToStop) {
     alert("Ничего не найдено, поиск завершен.");
     return;
    } 
    if (el==fbw_body)
     if (confirm("Достигнут"+(scriptDirection=="forward"?" конец":"о начало")+" документа.\nПродолжить поиск с "+(scriptDirection=="forward"?"начала":"конца")+" документа?")) el=fbw_body;
     else return;   
   }   
  } 
  //теперь найдем новый курсив
  while (true) {
   el=getNextNodeInScriptDirection(el);
   if (el==placeWhereToStop) {
    alert("Ничего не найдено, поиск завершен.");
    return;
   } 
   if (el==fbw_body)
    if (confirm("Достигнут"+(scriptDirection=="forward"?" конец":"о начало")+" документа.\nПродолжить поиск с "+(scriptDirection=="forward"?"начала":"конца")+" документа?")) el=fbw_body;
    else return;
   if (isItTagWeLookingFor(el) && nonEmptyTag(el)) {
    el2=el;
    while (el2.hasChildNodes() && el2!=placeWhereToStop) el2=getNextNodeInScriptDirection(el2);
    if (el2==placeWhereToStop) {
     alert("Ничего не найдено, поиск завершен.");
     return;
    }     
    range1.moveToElementText(el);
    range1.collapse(scriptDirection=="forward"?true:false);
    if (scriptDirection=="forward")
     if (range1.parentElement!==el && range1.move("character",1)==1) range1.move("character",-1); else;
    else 
     if (range1.parentElement!==el && range1.move("character",-1)==1) range1.move("character",1);
    if (scriptDirection=="backward") range1.move("character",1);
    range1.select();
    return;
   }
  }
 }
 
 if (document.selection.type=="Control") {
  alert("Ошибка.\n\nВы используете тип выделения,\nкоторый не поддерживатся этим скриптом –\nвыделение картинок, а не текста.\nПожалуйста, используйте выделение текста.");
  return;
 }
 fbw_body=document.getElementById("fbw_body");
 randomNum=Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString();
 beginMarkerId="sclexGoToQuotesBeginMarker"+randomNum;
 endMarkerId="sclexGoToQuotesEndMarker"+randomNum;
 range=document.selection.createRange();
 range1=range.duplicate();
 range1.collapse(true);
 range1.pasteHTML("<B id="+beginMarkerId+"></B>");
 //alert(fbw_body.innerHTML);
 beginMarkerEl=document.getElementById(beginMarkerId);
 range2=range.duplicate();
 range2.collapse(false);
 range2.pasteHTML("<B id="+endMarkerId+"></B>");
 endMarkerEl=document.getElementById(endMarkerId);
 el=(scriptDirection=="forward")?endMarkerEl:beginMarkerEl;
 placeWhereToStop=(scriptDirection=="forward")?beginMarkerEl:endMarkerEl;

 try {
  mySearch();
 }
 catch(e) {
  alert(versionStr+"\n\nПроизошла какая-то ошибка.");
 }

 beginMarkerEl.removeNode(true);
 endMarkerEl.removeNode(true);
 window.external.EndUndoUnit(document); 
}