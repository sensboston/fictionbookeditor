//Скрипт «Создать сноски или комментарии из абзацев, помеченных маркерами»
//Автор Sclex

var notesFromSelectedParagraphs_versionNum="5.3";

function Run() {
 var dialogWidth="700px";
 var dialogHeight="570px";
 var fbwBody=document.getElementById("fbw_body");
 var coll=new Object();
 try { var nbspChar=window.external.GetNBSP(); }
 catch(e) { var nbspChar=String.fromCharCode(160); } 
 coll["fbwBody"]=fbwBody;
 coll["mainDocument"]=document;
 coll["window"]=window;
 coll["versionNum"]=notesFromSelectedParagraphs_versionNum;
 coll["nbspChar"]=nbspChar;
 var modes=window.showModelessDialog("HTML/Создать сноски или комментарии из абзацев, помеченных маркерами - задание параметров.htm",coll,
     "dialogHeight: "+dialogHeight+"; dialogWidth: "+dialogWidth+"; "+
     "center: Yes; help: No; resizable: Yes; status: No;");
}
