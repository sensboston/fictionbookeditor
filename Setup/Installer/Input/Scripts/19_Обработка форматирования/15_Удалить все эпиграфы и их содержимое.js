// Скрипт "Удалить все эпиграфы и их содержимое" v1.0
// Автор Sclex

function Run() {
 var fbwBody, allDivs, i, removedEpigraphsCnt, itsFirstRemoving;
 fbwBody=document.getElementById("fbw_body");
 if (!fbwBody) return;
 removedEpigraphsCnt=0;
 allDivs=fbwBody.getElementsByTagName("DIV");
 itsFirstRemoving=true;
 for (i=allDivs.length-1; i>=0; i--) {
  if (allDivs[i].className=="epigraph") {
   if (itsFirstRemoving) {
    window.external.BeginUndoUnit(document,"удаление всех эпиграфов и их содержимого");
    itsFirstRemoving=false;
   }
   allDivs[i].removeNode(true);
   removedEpigraphsCnt++;
  }
 }
 if (removedEpigraphsCnt==0) {
  MsgBox("Эпиграфов в документе не нашлось.");
  return;
 }
 try { window.external.SetStatusBarText("Удалено эпиграфов с их содержимым: "+removedEpigraphsCnt+"."); }
 catch(e) {} 
 window.external.EndUndoUnit(document);
}