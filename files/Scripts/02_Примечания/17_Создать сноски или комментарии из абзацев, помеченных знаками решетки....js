//Скрипт «Создать сноски или комментарии из абзацев, помеченных знаками решетки»
//Автор Sclex

var notesFromSelectedParagraphs_versionNum="2.4";

function Run() {
 var dialogWidth="700px";
 var dialogHeight="240px";
 var fbwBody=document.getElementById("fbw_body");
 var coll=new Object();
 coll["fbwBody"]=fbwBody;
 coll["mainDocument"]=document;
 coll["window"]=window;
 coll["versionNum"]=notesFromSelectedParagraphs_versionNum;
 var modes=window.showModelessDialog("HTML/Создать сноски или комментарии из абзацев, помеченных знаками решетки - задание параметров.htm",coll,
     "dialogHeight: "+dialogHeight+"; dialogWidth: "+dialogWidth+"; "+
     "center: Yes; help: No; resizable: Yes; status: No;");
}
