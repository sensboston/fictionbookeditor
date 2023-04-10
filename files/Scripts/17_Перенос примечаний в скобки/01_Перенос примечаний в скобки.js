function Run() {

 var addSpaceBeforeNoteInBrackets=false;

 var versionStr="Перенос примечаний в скобки v1.1. Автор Sclex."
 var myId,elem,elem2,bodyName,htmlStr1,htmlStr2,blockTag,pTag,insideWhatTag;
 var elem4,myHtmlStr,collectedText,aInnerText,range1,range2,bTag1,bTag2,firstP;
 var movedNotesCnt,elem5;
 var range=document.body.createTextRange();
 var re0=new RegExp("<B id=sclexNotesIntoBrackets1></B>.*?<B id=sclexNotesIntoBrackets2></B>","i");
 var re1=new RegExp("($\\d)","g");
 var re1_="\\$1"
 var ltRegExp=new RegExp("<","g");
 var ltRegExp_="&lt;";
 var gtRegExp=new RegExp(">","g");
 var gtRegExp_="&gt;";
 var ampRegExp=new RegExp(">","g");
 var ampRegExp_="&gt;";
 var movedNotesCnt=0;
 
 function getLocalHref(name) {
  var i=1;
  var name1=name;
  var thg2=new RegExp("#");
  if (name1.search(thg2)==-1) {return(null)} //ссылка не может начинаться с 1
  var thg=new RegExp("main\.html\#","i");
  srch10=name1.search(thg);
  if (srch10==-1) {
   name1 = name1.substring(1,name1.length);
  } else {
   name1 = name1.substring(srch10+10,name1.length);
  }
  return(name1);
 }

 function getOpeningTag(myTag) {
  if (myTag.nodeName=="I" || myTag.nodeName=="EM" || myTag.nodeName=="B" ||
      myTag.nodeName=="STRONG" || myTag.nodeName=="SUP" || myTag.nodeName=="SUB" ||
      myTag.nodeName=="STRIKE") return "<"+myTag.nodeName+">";
  if (myTag.nodeName=="SPAN" && myTag.className=="code") return "<SPAN class=code>";
  if (myTag.nodeName=="A" && myTag.className!="note") return "<A href='"+myTag.href+"'>";
  return "";
 }

 function getClosingTag(myTag) {
  if (myTag.nodeName=="I" || myTag.nodeName=="EM" || myTag.nodeName=="B" ||
      myTag.nodeName=="STRONG" || myTag.nodeName=="SUP" || myTag.nodeName=="SUB" ||
      myTag.nodeName=="STRIKE") return "</"+myTag.nodeName+">";
  if (myTag.nodeName=="SPAN" && myTag.className=="code") return "</SPAN>";
  if (myTag.nodeName=="A" && myTag.className!="note") return "</A>";
  return "";
 }

 function collectNoteText() {
  //alert("collectNoteText\nelem:\n"+elem.outerHTML);
  myHtmlStr="";
  var myEl=elem.firstChild;
  firstP=true;
  while (myEl!=null && myEl!=elem) {
   //if (myEl.nodeType==3) alert("nodeValue:\n"+myEl.nodeValue);
   //if (myEl.nodeType==1) alert("outerHTML:\n"+myEl.outerHTML);
   if (myEl.nodeName=="P") {
    if (firstP) {
     firstP=false;
    } else {
     myHtmlStr+=" // ";
    }
   }
   //переход на следующий узел дерева
   if (myEl.nodeType==3)
    myHtmlStr+=myEl.nodeValue.replace(ltRegExp,ltRegExp_).replace(gtRegExp,gtRegExp_).replace(ampRegExp,ampRegExp_);
   if (myEl.firstChild && !(myEl.parentNode==elem && myEl.className=="title")) {
    myHtmlStr+=getOpeningTag(myEl);
    myEl=myEl.firstChild;
   }
   else {
    while (myEl.nextSibling==null && myEl!=elem) {
     if (myEl.nodeType==1) myHtmlStr+=getClosingTag(myEl);
     myEl=myEl.parentNode;
    }
    if (myEl!=elem) {
     if (myEl.nodeType==1) myHtmlStr+=getClosingTag(myEl);
     myEl=myEl.nextSibling;
    }
   }
  }
  return myHtmlStr;
 }

 function moveNoteToRefPlace(a) {
  myId=getLocalHref(a.href);
  if (!myId) return;
  elem=document.getElementById(myId);
  if (!elem) return;

  //проверим, что ссылка указывает на id внутри тега section
  while (elem.className!="section" && elem.nodeName!="BODY")
   elem=elem.parentNode;
  if (elem.nodeName=="BODY") return;

  //проверим, что ссылка указывает на id в body name="notes" или "comments"
  elem5=elem;
  while (elem5.className!="body" && elem5.nodeName!="BODY")
   elem5=elem5.parentNode;
  if (elem5.nodeName=="BODY") return;
  bodyName=elem5.getAttribute("fbname");
  if (bodyName!="notes" && bodyName!="comments") return;

  //соберем теги, которые нужно закрыть перед примечанием и закрыть после него
  htmlStr1="";
  htmlStr2="";
  elem2=a.parentNode;
  //alert("elem2.outerHTML:"+elem2.outerHTML);
  while (elem2.nodeName!="P" && elem2.nodeName!="BODY") {
   htmlStr1="</"+elem2.nodeName+">"+htmlStr1;
   htmlStr2=htmlStr2+"<"+elem2.nodeName+">";
   elem2=elem2.parentNode;
  }
  if (elem2.nodeName=="BODY") return;
  //alert("htmlStr1:\n"+htmlStr1+"\nhtmlStr2:\n"+htmlStr2);

  //выясним, в каком теге находится ссылка сноски
  blockTag=a;
  insideWhatTag="";
  while (blockTag.nodeName!="DIV" && blockTag.nodeName!="BODY")
   blockTag=blockTag.parentNode;
  pTag=a;
  while (pTag.nodeName!="P" && pTag.nodeName!="BODY")
   pTag=pTag.parentNode;
  if (blockTag.nodeName=="DIV" && blockTag.className=="poem") insideWhatTag="poem";
  else if (blockTag.nodeName=="DIV" && blockTag.className=="cite") insideWhatTag="cite";
  else if (blockTag.nodeName=="DIV" && blockTag.className=="epigraph") insideWhatTag="epigraph";
  else if (pTag.className=="text-author") insideWhatTag="text-author";
  else if (pTag.className=="subtitle") insideWhatTag="subtitle";
  else insideWhatTag="p";

  collectedText=collectNoteText();
  aInnerText=a.innerText;
  //alert("range.htmlText:\n"+range.htmlText);
  bTag1=document.createElement("B");
  bTag1.id="sclexNotesIntoBrackets1";
  bTag2=document.createElement("B");
  bTag2.id="sclexNotesIntoBrackets2";
  a.parentNode.insertBefore(bTag1,a);
  a.parentNode.insertBefore(bTag2,a.nextSibling);
  //alert("fbw_body.innerHTML:\n\n"+fbw_body.innerHTML);
  pTag.outerHTML=pTag.outerHTML.replace(re0,"<B id=sclexNotesIntoBrackets3></B>" + 
   htmlStr1 + (addSpaceBeforeNoteInBrackets?" ":"") + (elem5.getAttribute("fbname")=="notes"?"[":"{") + collectedText.replace(re1,re1_) +
   (elem5.getAttribute("fbname")=="notes"?"]":"}")+htmlStr2);
  savePrevious=document.getElementById("sclexNotesIntoBrackets3");
  movedNotesCnt++;
 }

 var i,j,el;
 var fbw_body=document.getElementById("fbw_body");
 window.external.BeginUndoUnit(document,"notes into brackets");
 var body=fbw_body.lastChild;
 if (document.getElementById("sclexNotesIntoBrackets3"))
  document.getElementById("sclexNotesIntoBrackets3").removeNode(true);
 while (body!=null) {
  if (body.getAttribute("fbname")=="notes" || body.getAttribute("fbname")=="comments") {
   el=body.lastChild;
   while (el!=body && el!=null) {
    //if (el.nodeType==1) alert("outerHTML:\n"+el.outerHTML);
    //else alert("nodeValue:"+el.nodeValue);
    if (el.lastChild) {
     savePrevious=el.lastChild;
    } else {
     savePrevious=el;
     while (savePrevious.previousSibling==null && savePrevious!=body) savePrevious=savePrevious.parentNode;
     if (savePrevious!=body) savePrevious=savePrevious.previousSibling;
    }
    if (el.nodeName=="A" && el.className=="note") moveNoteToRefPlace(el);
    el=savePrevious;
   }
  }
  body=body.previousSibling;
 }
 var body=fbw_body.lastChild;
 while (body!=null) {
  if (body.getAttribute("fbname")!="notes" && body.getAttribute("fbname")!="comments") {
   el=body.lastChild;
   while (el!=body && el!=null) {
    //if (el.nodeType==1) alert("outerHTML:\n"+el.outerHTML);
    //else alert("nodeValue:"+el.nodeValue);
    if (el.lastChild) {
     savePrevious=el.lastChild;
    } else {
     savePrevious=el;
     while (savePrevious.previousSibling==null && savePrevious!=body) savePrevious=savePrevious.parentNode;
     if (savePrevious!=body) savePrevious=savePrevious.previousSibling;
    }
    if (el.nodeName=="A") moveNoteToRefPlace(el);
    el=savePrevious;
   }
  }
  body=body.previousSibling;
 }
 //удалим body name="notes" и "comments"
 var body=fbw_body.lastChild;
 while (body!=null) {
  savedPrevious=body.previousSibling;
  if (body.getAttribute("fbname")=="notes" || body.getAttribute("fbname")=="comments")
   body.removeNode(true);
  body=savedPrevious;
 }
 if (document.getElementById("sclexNotesIntoBrackets3"))
  document.getElementById("sclexNotesIntoBrackets3").removeNode(true);
 alert(versionStr+"\n\nПеренесено примечаний и комментариев: "+movedNotesCnt);
 window.external.EndUndoUnit(document);
}