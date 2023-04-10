// Скрипт "Превратить таблицы в простой текст v1.3". Автор Sclex

function Run() {
  var fbwBody=document.getElementById("fbw_body");
  window.external.BeginUndoUnit(document,"превращение таблиц в текст"); 
  var allDivs=fbwBody.getElementsByTagName("DIV");
  var re0=new RegExp("<SPAN(( [^>]+)? class=image( [^>]+)?)>(<IMG( [^>]*)?>)<\/SPAN>","gi");
  var re0_="</P><DIV$1>$4</DIV><P>";
  var re1=new RegExp("<P( [^>]*)?></P>","gi");
  var re1_="";
  var myOuterHTML;
  for (var i=allDivs.length-1; i>=0; i--) {
    if (
         (allDivs[i].className && allDivs[i].className.toUpperCase()=="TABLE") || 
         (allDivs[i].className && allDivs[i].className.toUpperCase()=="TR")
       ) allDivs[i].removeNode(false);
  }
  var allPs=fbwBody.getElementsByTagName("P");
  for (var i=allPs.length-1; i>=0; i--) {
    if (allPs[i].className && (allPs[i].className.toUpperCase()=="TD" || allPs[i].className.toUpperCase()=="TH")) {
      allPs[i].removeAttribute("className");
      allPs[i].removeAttribute("fbalign");
      allPs[i].removeAttribute("fbvalign");
      allPs[i].removeAttribute("fbcolspan");
      allPs[i].removeAttribute("fbrowspan");
      allPs[i].removeAttribute("id");
      allPs[i].removeAttribute("fbstyle");
      myOuterHTML=allPs[i].outerHTML;
//      alert("Найден абзац:\n\n"+myOuterHTML)
      if (myOuterHTML.search(re0)>=0) {
//       alert("Найден абзац, подлежащий замене:\n\n"+myOuterHTML)
//       alert("Заменено на:\n\n"+myOuterHTML.replace(re0,re0_).replace(re1,re1_));
       allPs[i].outerHTML=myOuterHTML.replace(re0,re0_).replace(re1,re1_);
      }
    }
  }
  window.external.EndUndoUnit(document);
  try {
    window.external.SetStatusBarText("Все таблицы успешно превращены в текст.");
  }
  catch (e)
  {}
}
