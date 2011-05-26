//Скрипт «разбиение на секции»
//Автор Sclex
//http://www.fictionbook.org/forum/viewtopic.php?t=4412

var splittingIntoSections_versionNum="1.4";

function Run() {
 var dialogWidth="640px";
 var dialogHeight="240px";
 var fbwBody=document.getElementById("fbw_body");
 var coll=new Object();
 coll["fbwBody"]=fbwBody;
 coll["mainDocument"]=document;
 coll["window"]=window;
 coll["versionNum"]=splittingIntoSections_versionNum;
 var modes=window.showModelessDialog("HTML/Разбиение на секции - задание параметров.htm",coll,
     "dialogHeight: "+dialogHeight+"; dialogWidth: "+dialogWidth+"; "+
     "center: Yes; help: No; resizable: Yes; status: No;");
 /*(var mainRegExp=prompt("Введите регэксп для поиска места разрыва секций.","");
 var caseSensitive=confirm*/
 //var mainRegExp=prompt("Введите регэксп для поиска места разрыва секций.","");
}