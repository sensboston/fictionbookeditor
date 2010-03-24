//Таблица символов валют
//                                jurgennt™, май 2008 г.
//                          script engene by Sclex v.1.1

function Run() {
 var dialogWidth="125px"; //ширина окна таблицы символов
 var dialogHeight="400px"; //высота окна таблицы символов
 var params=new Object(); 
 params["fbw_body"]=document.getElementById("fbw_body");
 params["document"]=document;
 params["window"]=window;
 var rslt=window.showModelessDialog("cmd/валюты.htm",params,
      "dialogHeight: "+dialogHeight+"; dialogWidth: "+dialogWidth+"; "+
      "center: Yes; help: No; resizable: Yes; status: No; scroll: No"); 
}