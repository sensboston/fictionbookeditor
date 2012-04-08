function Run() {
 window.external.BeginUndoUnit(document,"reference to midi insertion");
 var coll={};
 coll["document"]=document;
 var dialogWidth="600px";
 var dialogHeight="50px";
 var modes=window.showModalDialog("HTML/диалог вставки ссылки на midi.htm",coll,
     "dialogHeight: "+dialogHeight+"; dialogWidth: "+dialogWidth+"; "+
     "center: Yes; help: No; resizable: Yes; status: No; scroll: No;");
 window.external.EndUndoUnit(document);
}