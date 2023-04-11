// Скрипт "Вставить пустую строку перед стихом или цитатой"
// Версия 1.0
// Автор Sclex

function Run() {
 tr=document.selection.createRange();
 if (!tr) return;
 if (tr.parentElement().nodeName=="TEXTAREA") {
  MsgBox("Ошибка. Должно быть выделение в тексте книги, а не в поле ввода.");
  return;
 }
 tr.collapse(true);
 var el=tr.parentElement();
 while (el && el.nodeName!="BODY" &&
       !(el.nodeName=="DIV" &&
         (el.className.search(/^(poem|cite)$/i)>=0)
        )
       ) 
  el=el.parentNode;
 if (!el) return;
 if (el.nodeName=="BODY") return;
 var a={"POEM":"стихом", "CITE":"цитатой", "EPIGRAPH":"эпиграфом"};
 window.external.BeginUndoUnit(document,"вставку пустой строки перед "+a[el.className.toUpperCase()]);
 var em=document.createElement("P");
 InflateIt(el.insertAdjacentElement("beforeBegin",em));
 window.external.EndUndoUnit(document);
}