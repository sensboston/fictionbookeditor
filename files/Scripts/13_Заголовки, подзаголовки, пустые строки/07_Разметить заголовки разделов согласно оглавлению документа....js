//Скрипт «Разметить заголовки разделов согласно оглавлению документа»
//Автор Sclex

var markupTitlesByContents_versionNum="4.4";

function myBeginUndoUnit(s) {
 window.external.BeginUndoUnit(document,s);
}
 
function myEndUndoUnit() {
  window.external.EndUndoUnit(document);
}

function Run() {

 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar; }
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";};
 
 // Нижеследующая команда задает список необычных пробелов,
 // которые в заголовках должны обрабатываться наравне
 // с обычными пробелами:
 var unusualSpaces=String.fromCharCode(160)+
  String.fromCharCode(8194)+
  String.fromCharCode(8195)+
  String.fromCharCode(8196)+
  String.fromCharCode(8197)+
  String.fromCharCode(8198)+
  String.fromCharCode(8239)+
  String.fromCharCode(8201)+
  String.fromCharCode(8202)+
  nbspChar;
  
 var dialogWidth="700px";
 var dialogHeight="1000px";
 var fbwBody=document.getElementById("fbw_body"); 
 
 var coll={};
 coll["fbwBody"]=fbwBody;
 coll["mainDocument"]=document;
 coll["window"]=window;
 coll["versionNum"]=markupTitlesByContents_versionNum;
 coll["unusualSpaces"]=unusualSpaces;
 coll["nbspChar"]=nbspChar;
 coll["nbspEntity"]=nbspEntity;
 if (!document.selection || document.selection.type!="Text") {
   MsgBox("Вы ничего не выделили.\n\n"+
          "Перед запуском данного скрипта, пожалуйста, выделите абзацы оглавления.");
   return;
 }
 var myRange=document.selection.createRange();
 //myRange.expand("sentence");
 coll["mySelection"]=myRange;
 var modes=window.showModalDialog("HTML/Разметить заголовки разделов согласно оглавлению документа - основной диалог.htm",coll,
     "dialogHeight: "+dialogHeight+"; dialogWidth: "+dialogWidth+"; "+
     "center: Yes; help: No; resizable: Yes; status: No;");
}
