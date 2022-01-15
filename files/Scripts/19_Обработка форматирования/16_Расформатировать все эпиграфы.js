// Скрипт "Расформатировать все эпиграфы" v1.0
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
    window.external.BeginUndoUnit(document,"расформатирование всех эпиграфов");
    itsFirstRemoving=false;
   }
   allDivs[i].removeNode(false);
   removedEpigraphsCnt++;
  }
 }
 if (removedEpigraphsCnt==0) {
  MsgBox("Эпиграфов в документе не нашлось.");
  return;
 }
 try { window.external.SetStatusBarText("Расформатировано эпиграфов: "+removedEpigraphsCnt+"."); }
 catch(e) {} 
 window.external.EndUndoUnit(document);
}