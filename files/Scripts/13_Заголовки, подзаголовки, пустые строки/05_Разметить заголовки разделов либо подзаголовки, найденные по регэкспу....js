//Скрипт «Разметить заголовки разделов или подзаголовки, найденные по регэкспу»
//Автор Sclex
//http://www.fictionbook.org/forum/viewtopic.php?t=4412

var markupTitlesOrSubtitles_versionNum="2.2";

function Run() {
 var dialogWidth="700px";
 var dialogHeight="295px";
 var fbwBody=document.getElementById("fbw_body");
 var coll=new Object();
 coll["fbwBody"]=fbwBody;
 coll["mainDocument"]=document;
 coll["window"]=window;
 coll["versionNum"]=markupTitlesOrSubtitles_versionNum;
 var modes=window.showModelessDialog("HTML/Разметить заголовки разделов либо подзаголовки, найденные по регэкспу - задание параметров.htm",coll,
     "dialogHeight: "+dialogHeight+"; dialogWidth: "+dialogWidth+"; "+
     "center: Yes; help: No; resizable: Yes; status: No;");
}
