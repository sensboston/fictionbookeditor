// Скрипт "Вставить пустую строку за стихом, эпиграфом или цитатой"
// Версия 1.0
// Автор Sclex

function Run() {
 tr=document.selection.createRange();
 if (!tr) return;
 if (tr.parentElement().nodeName=="TEXTAREA") {
  MsgBox("Ошибка. Должно быть выделение в тексте книги, а не в поле ввода.");
  return;
 }
 tr.collapse(false);
 var el=tr.parentElement();
 while (el && el.nodeName!="BODY" &&
       !(el.nodeName=="DIV" &&
         (el.className.search(/^(poem|cite|epigraph)$/i)>=0)
        )
       )
  el=el.parentNode;
 if (!el) return;
 if (el.nodeName=="BODY") return;
 var a={"POEM":"стихом", "CITE":"цитатой", "EPIGRAPH":"эпиграфом"};
 window.external.BeginUndoUnit(document,"вставку пустой строки за "+a[el.className.toUpperCase()]);
 var em=document.createElement("P");
 InflateIt(el.insertAdjacentElement("afterEnd",em));
 window.external.EndUndoUnit(document);
}