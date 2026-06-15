// Скрипт "Закрыть второй фрейм"
// Версия 1.0
// Автор Sclex

function Run() {
  var fbwBody=document.getElementById("fbw_body");
  var containerEl=document.getElementById("container");
  if (!fbwBody || !containerEl) {
    MsgBox("Произошла ошибка!");
    return;
  }
  fbwBody.style.height="100%";
  fbwBody.style.overflow="auto";
  containerEl.outerHTML=fbwBody.outerHTML;
  InflateIt(containerEl);
}