function Run() {

 var dialogWidth="640px"; // ширина диалогового окна
 var dialogHeight="480px"; // высота диалогового окна
 var params=new Object();
 var rslt;
 body=document.getElementById("fbw_body");
 params["fbw_body"]=body;
 rslt=window.showModalDialog("HTML/Управление структурой разделов и их заголовками - набор фреймов.html",params,
       "dialogHeight: "+dialogHeight+"; dialogWidth: "+dialogWidth+"; "+
       "center: Yes; help: No; resizable: Yes; status: No;");
 if (rslt) {
  window.external.BeginUndoUnit(document,"section structure editing");      
  body.innerHTML=rslt;
  InflateIt(body);
  window.external.EndUndoUnit(document);
 }
}