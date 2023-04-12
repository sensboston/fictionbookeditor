function Run() {
 window.external.BeginUndoUnit(document,"создание ссылки на MIDI-файл (для AlReader'а)");
 var coll={};
 var rng=document.selection.createRange();
 if (rng.htmlText=="") {
   MsgBox("Вы ничего не выделили.\n\nПеред запуском скрипта нужно выделить текст, который требуется превратить в ссылку.");
   return;
 }
 coll["document"]=document;
 var dialogWidth="600px";
 var dialogHeight="50px";
 var modes=window.showModalDialog("HTML/Сделать выделенный текст ссылкой на MIDI-файл (для AlReader'а).html",coll,
     "dialogHeight: "+dialogHeight+"; dialogWidth: "+dialogWidth+"; "+
     "center: Yes; help: No; resizable: Yes; status: No; scroll: No;");
 window.external.EndUndoUnit(document);
}