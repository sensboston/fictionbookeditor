// Скрипт "Расформатировать все цитаты" v1.1
// Автор Sclex

function Run() {
 var fbwBody, allDivs, i, j, removedCitesCnt, itsFirstRemoving, allPs;
 fbwBody=document.getElementById("fbw_body");
 if (!fbwBody) return;
 removedCitesCnt=0;
 allDivs=fbwBody.getElementsByTagName("DIV");
 itsFirstRemoving=true;
 for (i=allDivs.length-1; i>=0; i--) {
  if (allDivs[i].className=="cite") {
   if (itsFirstRemoving) {
    window.external.BeginUndoUnit(document,"расформатирование всех цитат");
    itsFirstRemoving=false;
   }
   allPs=allDivs[i].getElementsByTagName("P");
   for (j=0; j<allPs.length; j++)
     if (allPs[j].className="text-author") {
      allPs[j].removeAttribute("class");
      allPs[j].removeAttribute("className");
     }
   allDivs[i].removeNode(false);
   removedCitesCnt++;
  }
 }
 if (removedCitesCnt==0) {
  MsgBox("Цитат в документе не нашлось.");
  return;
 }
 try { window.external.SetStatusBarText("Расформатировано цитат: "+removedCitesCnt+"."); }
 catch(e) {} 
 window.external.EndUndoUnit(document);
}