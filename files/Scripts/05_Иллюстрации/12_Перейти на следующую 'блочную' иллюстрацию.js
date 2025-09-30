// Скрипт «Перейти на следующую 'блочную' иллюстрацию» v.1.1
// автор — Sсlex.
// костыль от ошибки выделения — stokber (сентябрь 2025).

function Run() {
var name = "Перейти на следующую 'блочную' иллюстрацию";
var vers ="1.1";
//имя тэга, который используется в маркере позиции курсора
 var MyTagName="B";
//направление поиска картинок
//0 - вперед
//другие значения - назад
 var Direction=0;
 var body=document.getElementById("fbw_body");
// var coll=body.document.selection.createRange().getClientRects();
 var coll=body.document.selection.createRange()
 var ttr1 = body.document.selection.createRange();
// var el=body.document.elementFromPoint(coll[0].left, coll[0].top);

try {
 var tr=ttr1.duplicate();
 } catch (err) {
  // обработка ошибки
var shell = new ActiveXObject("WScript.Shell");
shell.SendKeys("+{ESC}");
shell.SendKeys("{RIGHT}");
}

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
//  if (ptr.nodeType==1 && ptr.nodeName=="SPAN" && ptr.className=="image" &&
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
 
 if(!CursorPosition) { alert("Установите курсор в документ!"); return}
 CursorPosition.parentNode.removeChild(CursorPosition);
 //a
 if (!ImageFound) {
   MsgBox("  Иллюстраций больше нет.  \n\nСкрипт '"+name+"' v."+vers);
   return
 }
 
  // слезаем с картинки:
var shell = new ActiveXObject("WScript.Shell");
shell.SendKeys("+{ESC}");
// WScript.Sleep(100);
shell.SendKeys("{RIGHT}");
// shell.SendKeys("+{ESC}{RIGHT}");
 
}