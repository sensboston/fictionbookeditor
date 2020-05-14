// Скрипт "Превратить таблицы в простой текст v1.2". Автор Sclex

function Run() {
  var fbwBody=document.getElementById("fbw_body");
  window.external.BeginUndoUnit(document,"превращение таблиц в текст"); 
  var allDivs=fbwBody.getElementsByTagName("DIV");
  for (var i=allDivs.length-1; i>=0; i--) {
    if (
         (allDivs[i].className && allDivs[i].className.toUpperCase()=="TABLE") || 
         (allDivs[i].className && allDivs[i].className.toUpperCase()=="TR")
       ) allDivs[i].removeNode(false);
  }
  var allPs=fbwBody.getElementsByTagName("P");
  for (var i=allPs.length-1; i>=0; i--) {
    if (allPs[i].className && (allPs[i].className.toUpperCase()=="TD" || allPs[i].className.toUpperCase()=="TH")) {
      allPs[i].className="";
      allPs[i].removeAttribute("fbalign");
      allPs[i].removeAttribute("fbvalign");
      allPs[i].removeAttribute("fbcolspan");
      allPs[i].removeAttribute("fbrowspan");
      allPs[i].removeAttribute("id");
      allPs[i].removeAttribute("fbstyle");
    }
  }
  window.external.EndUndoUnit(document);
  try {
    window.external.SetStatusBarText("Все таблицы успешно превращены в текст.");
  }
  catch (e)
  {}
}
