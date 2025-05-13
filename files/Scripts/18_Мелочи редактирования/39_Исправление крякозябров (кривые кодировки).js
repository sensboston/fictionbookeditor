//скрипт "Исправление крякозябров (кривые кодировки)"  by Sclex 
// доработка до заявленного функционала - stokber.
//v1.11
// создан на базе скрипта замены регистра за авторством Sclex-а.

function Run() {

// --------------------------------------------------------------------
var rng=document.selection.createRange();
 if(rng.compareEndPoints("StartToEnd", rng)==0){ MsgBox("Выделите текст!\nСкрипт производит замену символов только в выделенном тексте!"); return false; }

 var key;
 var sumbol;
 var sumbolNew;
 
 

sumbol = {"À": "А","Á": "Б","Â": "В","Ã": "Г","Ä": "Д","Å": "Е","¨": "Ё","Æ": "Ж","Ç": "З","È": "И","É": "Й","Ê": "К","Ë": "Л","Ì": "М","Í": "Н","Î": "О","Ï": "П","Ð": "Р","Ñ": "С","Ò": "Т","Ó": "У","Ô": "Ф","Õ": "Х","Ö": "Ц","÷": "Ч","Ø": "Ш","Ù": "Щ","Ú": "Ъ","Û": "Ы","Ü": "Ь","Ý": "Э","Þ": "Ю","Ÿ": "Я","à": "а","á": "б","â": "в","ã": "г","ä": "д","å": "е","¸": "ё","æ": "ж","ç": "з","è": "и","é": "й","ê": "к","ë": "л","ì": "м","í": "н","î": "о","ï": "п","ð": "р","ñ": "с","ò": "т","ó": "у","ô": "ф","õ": "х","ö": "ц","÷": "ч","ø": "ш","ù": "щ","ú": "ъ","û": "ы","ü": "ь","ý": "э","þ": "ю","ÿ": "я"};

 //вид обработки, которой подвергается выделенный текст
 var ObrabotkaType=2;
 //имя тэга, который будет использован для маркеров начала и конца выделения
 var MyTagName="B";
 
// ----------------------------------------------------------------------------------
   function replacChar() {
   for (var key in sumbol) {
   var sumbolNew = sumbol[key] 
   s = s.replace(new RegExp(key, "g"), sumbolNew);
      }
   }
// ================================================

 var tr;
 var errMsg="Нет выделения.\n\nПеред запуском скрипта нужно выделить текст, который будет обработан.";
 tr=document.selection.createRange();
 if (!tr) {
  MsgBox(errMsg);
  return;
 }
 window.external.BeginUndoUnit(document,"исправление крякозябров");
 if (tr.parentElement().nodeName=="TEXTAREA") {
   //код для обработки выделения в INPUT'е
  var tr1=document.body.createTextRange();
  tr1.moveToElementText(tr.parentElement());
  tr1.setEndPoint("EndToStart",tr);
  var tr2=document.body.createTextRange();
  tr2.moveToElementText(tr.parentElement());
  tr2.setEndPoint("StartToEnd",tr);
  s=tr.text;
  // if (ObrabotkaType==1) {rusLat();}
  if (ObrabotkaType==2) {replacChar();}
  tr.parentElement().value=tr1.text+s+tr2.text;
 }
 else if (tr.parentElement().nodeName!="INPUT") {
  var body=document.getElementById("fbw_body");
  var coll=tr.getClientRects();
  var ttr1 = body.document.selection.createRange();
  var el=body.document.elementFromPoint(coll[0].left, coll[0].top);
  var cursorPos=null;
  if (tr.compareEndPoints("StartToEnd",tr)==0) {
   var el2=document.getElementById("CursorPosition");
   if (el2) el2.removeAttribute("id");
   ttr1.pasteHTML("<"+MyTagName+" id=CursorPosition></"+MyTagName+">");
   cursorPos=document.getElementById("CursorPosition");
   ttr1.expand("word");
  } 
  // поставим маркеры блока в виде пустых ссылок
  tr=ttr1.duplicate();
  tr.collapse();
  tr.pasteHTML("<"+MyTagName+" id=BlockStart></"+MyTagName+">");
  tr=ttr1.duplicate();
  tr.collapse(false);
  tr.pasteHTML("<"+MyTagName+" id=BlockEnd></"+MyTagName+">");
  // поднимаемся вверх по дереву, пока не найдем DIV или P,
  // в который входит начало выделения
  while (el && el.nodeName!="DIV" && el.nodeName!="P") { el=el.parentNode; }
  var InsideP = false; // true, если находимся внутри тэга P
  var InsideSelection = false; // true, когда текущая позиция внутри выделенного текста
  var ProcessingEnded=false; // true, когда обработка закончена и пора выходить
  ptr=el;
  while (!ProcessingEnded) {
   // напомню: nodeType=1 для элемента (тэга) и nodeType=3 для текста
   // если встретили тэг P, меняем флаг, что мы внутри P
   if (ptr.nodeType==1 && ptr.nodeName=="P") {InsideP=true};
   // если встретили маркер начала блока, ...
   if (ptr.nodeType==1 && ptr.nodeName==MyTagName &&
       ptr.getAttribute("id")=="BlockStart") {
    // меняем флаг, т.к. попали внутрь выделения
    InsideSelection=true;
    // запомним ноду ссылки, чтобы потом удалить ее
    var BlockStartNode=ptr;
   }
   // аналогично для маркера конца выделения
   if (ptr.nodeType==1 && ptr.nodeName==MyTagName &&
       ptr.getAttribute("id")=="BlockEnd") {
    InsideSelection=false;
    ProcessingEnded=true;
    var BlockEndNode=ptr;
   }
   // если нашли текст и находимся внутри P и внутри выделения...
   if (ptr.nodeType==3 && InsideP && InsideSelection) {
     // получаем текстовое содержимое узла
     var s=ptr.nodeValue;
     // обрабатываем как надо
     // if (ObrabotkaType==1);}
     if (ObrabotkaType==2) {replacChar();}
     // и возвращаем на место
     ptr.nodeValue=s;
   }
   // теперь надо найти следующий по дереву узел для обработки
   if (ptr.firstChild!=null) {
     ptr=ptr.firstChild; // либо углубляемся...
   } else {
     while (ptr.nextSibling==null) {
      ptr=ptr.parentNode; // ...либо поднимаемся (если уже сходили вглубь)
      // поднявшись до элемента P, не забудем поменять флаг
      if (ptr && ptr.nodeType==1 && ptr.nodeName=="P") {InsideP=false}
     }
    ptr=ptr.nextSibling; //и переходим на соседний элемент
   }
  }
  // удаляем маркеры блока
  var tr1=document.body.createTextRange();
  if (!cursorPos) {
   tr1.moveToElementText(BlockStartNode);
   var tr2=document.body.createTextRange();
   tr2.moveToElementText(BlockEndNode);
   tr1.setEndPoint("StartToStart",tr2);
   tr1.select();
  } else {
   tr1.moveToElementText(cursorPos);
   tr1.select();
  }
  BlockStartNode.parentNode.removeChild(BlockStartNode);
  BlockEndNode.parentNode.removeChild(BlockEndNode);
 }
 window.external.EndUndoUnit(document);
}