//скрипт "Регистр заголовков и подзаголовков"
//автор Sclex
//сайт скриптов: http://scripts.fictionbook.org

function Run() {
 var elementBrowser_versionNum="1.8";
 var dialogWidth="800px";
 var dialogHeight="540px";
 var fbwBody=document.getElementById("fbw_body");
 var coll=new Object();
 coll["fbwBody"]=fbwBody;
 coll["document"]=document;
 coll["window"]=window;
 coll["versionNum"]=elementBrowser_versionNum;
 window.showModalDialog("HTML/Регистр заголовков и подзаголовков - набор фреймов.html",coll,
   "dialogHeight: "+dialogHeight+"; dialogWidth: "+dialogWidth+"; "+
   "center: Yes; help: No; resizable: Yes; status: No;"); 
}
