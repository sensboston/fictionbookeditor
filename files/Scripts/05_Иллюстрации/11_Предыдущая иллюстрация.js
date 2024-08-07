function Run() {
//имя тэга, который используется в маркере позиции курсора
 var MyTagName="B";
//направление поиска картинок
//0 - вперед
//другие значения - назад
 var Direction=1;
 var body=document.getElementById("fbw_body");
// var coll=body.document.selection.createRange().getClientRects();
 var coll=body.document.selection.createRange()
 var ttr1 = body.document.selection.createRange();
// var el=body.document.elementFromPoint(coll[0].left, coll[0].top);
 var tr=ttr1.duplicate();
 tr.collapse();
 tr.pasteHTML("<"+MyTagName+" id=NextImageCursorPosition></"+MyTagName+">");
 var ptr=body;
 var AfterCursorPosition=false;
 var NeedExit=false;
 var ImageFound=false;
 while (ptr&&!NeedExit) {
  if (ptr.nodeType==1 && ptr.nodeName==MyTagName &&
      ptr.getAttribute("id")=="NextImageCursorPosition") {
   AfterCursorPosition=true;
   var CursorPosition=ptr;
  }
  if (ptr.nodeType==1 && ptr.nodeName=="DIV" && ptr.className=="image" &&
      AfterCursorPosition) {
   GoTo(ptr);
   var NeedExit=true;
   ImageFound=true;
  }
//  MsgBox("ptr:"+ptr);
// MsgBox("ptr.outerHTML:"+ptr.outerHTML);
  if (Direction==0) {
   if (ptr.firstChild!=null) {
    ptr=ptr.firstChild;
   } else {
    while (ptr&&ptr.nextSibling==null) {
     ptr=ptr.parentNode;
     if (ptr && ptr.nodeType==1 && ptr.nodeName=="P") {InsideP=false}
    }
   if (ptr) {ptr=ptr.nextSibling}
   }
  } else {
   if (ptr.lastChild!=null) {
    ptr=ptr.lastChild;
   } else {
    while (ptr&&ptr.previousSibling==null) {
     ptr=ptr.parentNode;
     if (ptr && ptr.nodeType==1 && ptr.nodeName=="P") {InsideP=false}
    }
   if (ptr) {ptr=ptr.previousSibling}
   }
  }
 }
 CursorPosition.parentNode.removeChild(CursorPosition);
 //a
 if (!ImageFound) {
   MsgBox("  Иллюстраций больше нет.     ");
 }
}