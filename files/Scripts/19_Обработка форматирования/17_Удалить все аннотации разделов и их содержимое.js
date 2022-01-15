// Скрипт "Удалить все аннотации разделов и их содержимое" v1.0
// Автор Sclex

function Run() {
 var fbwBody, allDivs, i, removedAnnotationsCnt, itsFirstRemoving;
 fbwBody=document.getElementById("fbw_body");
 if (!fbwBody) return;
 removedAnnotationsCnt=0;
 allDivs=fbwBody.getElementsByTagName("DIV");
 itsFirstRemoving=true;
 for (i=allDivs.length-1; i>=0; i--) {
  if (allDivs[i].className=="annotation" && allDivs[i].parentNode!=fbwBody) {
    if (itsFirstRemoving) {
      window.external.BeginUndoUnit(document,"удаление всех аннотаций разделов и их содержимого"); 
      itsFirstRemoving=false;
    }
   allDivs[i].removeNode(true);
   removedAnnotationsCnt++;
  }
 }
 if (removedAnnotationsCnt==0) {
  MsgBox("Аннотаций разделов в документе не нашлось.");
  return;
 }
 try { window.external.SetStatusBarText("Удалено аннотаций разделов с их содержимым: "+removedAnnotationsCnt+"."); }
 catch(e) {}
 window.external.EndUndoUnit(document);
}