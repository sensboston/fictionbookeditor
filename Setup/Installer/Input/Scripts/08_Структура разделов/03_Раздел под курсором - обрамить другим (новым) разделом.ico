//Опустить секцию
//версия 1.0

function Run() {
 var supportsDOMRanges = document.implementation.hasFeature("Range", "2.0");
 if (supportsDOMRanges) {MsgBox("Ошибка! Нет поддержки DOM Ranges!");}
 var MyTagName="B";
 var body=document.getElementById("fbw_body");
// var coll=body.document.selection.createRange().getClientRects();
 var coll=body.document.selection.createRange()
 var ttr1 = body.document.selection.createRange();
// var el=body.document.elementFromPoint(coll[0].left, coll[0].top);
 var tr=ttr1.duplicate();
 tr.collapse();
 tr.pasteHTML("<"+MyTagName+" id=SectionDownCursorPosition></"+MyTagName+">");
 var ptr=body;
 var AfterCursorPosition=false;
 var NeedExit=false;
 var ImageFound=false;
 while (ptr&&!NeedExit) {
  if (ptr.nodeType==1 && ptr.nodeName==MyTagName &&
      ptr.getAttribute("id")=="SectionDownCursorPosition") {
   AfterCursorPosition=true;
   var CursorPosition=ptr;
   NeedExit=true;
  }
  if (!NeedExit) {
   if (ptr.firstChild!=null) {
    ptr=ptr.firstChild;
   } else {
    while (ptr&&ptr.nextSibling==null) {
     ptr=ptr.parentNode;
     if (ptr && ptr.nodeType==1 && ptr.nodeName=="P") {InsideP=false}
    }
    if (ptr) {ptr=ptr.nextSibling}
   }
  }
 }
 var while_flag=true;
 while (while_flag) {
  if (ptr) {
   if (ptr.nodeName!="DIV" || ptr.className!="section") {ptr=ptr.parentNode;}
   else while_flag=false;
  } else {while_flag=false;}
 }
 CursorPosition.parentNode.removeChild(CursorPosition);
 if (ptr==null) {
  MsgBox("Ошибка. Курсор не внутри секции.");
  return;
 }
 var ptr2=ptr.firstChild;
 var before_text_contents=true;
 //в myhtml1 будем собирать содержимое секции до начала текстово-секционного содержимого
 //т.е. тэги title, epigraph, annotation, image
 var myhtml1="";
 //а в myhtml2 будем собирать текстово-секционное содержимое
 var myhtml2="";
 while (ptr2) {
  if (ptr2.nodeName=="DIV" && (ptr2.className=="image" || ptr2.className=="epigraph" ||
                               ptr2.className=="title" || ptr2.className=="annotation" )){
  }
  else {
   before_text_contents=false;
  }
  if (before_text_contents) {myhtml1=myhtml1+ptr2.outerHTML;}
  else {
   if (ptr2.innerHTML!="") {myhtml2=myhtml2+ptr2.outerHTML;}
   else {myhtml2=myhtml2+"<P> </P>";}
  }
  ptr2=ptr2.nextSibling;
 }
 window.external.beginUndoUnit(document,"section down");
 ptr.innerHTML=myhtml1+"<DIV class=section>"+myhtml2+"</DIV";
 window.external.endUndoUnit(document);
 MsgBox("Внутренности секции опущенны.");
}