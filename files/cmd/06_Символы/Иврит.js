//Таблица символов Еврейского алфавита
//                                jurgennt™, май 2008 г.
//                          script engene by Sclex v.1.1

function Run() {
 var dialogWidth="80px";                                 //ширина окна таблицы символов
 var dialogHeight="719px";                                //высота окна таблицы символов
 var dialogLeft="5px";                                       //координата X
 var dialogTop="5px";                                       //координата Y
 var params=new Object(); 
 params["fbw_body"]=document.getElementById("fbw_body");
 params["document"]=document;
 params["window"]=window;
 var rslt=window.showModelessDialog("cmd/иврит.htm",params,
      "dialogHeight: "+dialogHeight+"; dialogWidth: "+dialogWidth+"; dialogLeft: "+dialogLeft+"; dialogTop: "+dialogTop+"; "+
      "center: Yes; help: No; resizable: Yes; status: No; scroll: No"); 
}