//скрипт "Обзор элементов"
//автор Sclex
//сайт скриптов: http://scripts.fictionbook.org

function Run() {
 var elementBrowser_versionNum="1.6";
 var dialogWidth="420px";
 var dialogHeight="540px";
 var fbwBody=document.getElementById("fbw_body");
 var coll=new Object();
 coll["fbwBody"]=fbwBody;
 coll["mainDocument"]=document;
 coll["window"]=window;
 coll["versionNum"]=elementBrowser_versionNum;
 window.showModalDialog("HTML/Обзор элементов - набор фреймов.html",coll,
   "dialogHeight: "+dialogHeight+"; dialogWidth: "+dialogWidth+"; "+
   "center: Yes; help: No; resizable: Yes; status: No;"); 
}