//Таблица дополнительных символов европейских языков алфавита
//                                jurgennt™, май 2008 г.
//                          script engene by Sclex v.1.2

function Run() {
 var dialogWidth="280px"; //ширина окна таблицы символов
 var dialogHeight="652px"; //высота окна таблицы символов
 var dialogLeft="5px";                                   //координата X
 var params=new Object(); 
 params["fbw_body"]=document.getElementById("fbw_body");
 params["document"]=document;
 params["window"]=window;
 var rslt=window.showModelessDialog("Scripts/CE.htm",params,
      "dialogHeight: "+dialogHeight+"; dialogWidth: "+dialogWidth+"; dialogLeft: "+dialogLeft+"; "+
      "center: Yes; help: No; resizable: Yes; status: No; scroll: No;"); 
}