// Скритп "Расформатировать ссылки, адрес которых - пустая строка"
// Версия 1.2

function Run() {

 function units(num, cases) {
     num = Math.abs(num);
     
     var word = '';
     
     if (num.toString().indexOf('.') > -1) {
         word = cases.gen;
     } else { 
         word = (
             num % 10 == 1 && num % 100 != 11 
                 ? cases.nom
                 : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) 
                     ? cases.gen
                     : cases.plu
         );
     }
     return word;
 }
 
  window.external.BeginUndoUnit(document,"расформатирование ссылок, адрес которых - пустая строка");
  var fbwBody=document.getElementById("fbw_body");
  var links=fbwBody.getElementsByTagName("A");
  var i;
  var removedLinksCnt=0;
  var docHref=document.location.href.replace(/main[.]html$/,"");
  for (i=links.length-1; i>=0; i--)
    if (links[i].getAttribute("href")=="" || links[i].getAttribute("href")==docHref) {
      removedLinksCnt++;
      links[i].removeNode(false);
    }
  window.external.EndUndoUnit(document);
  if (removedLinksCnt!=0)
    MsgBox(units(removedLinksCnt,{nom: 'Была расформатирована', gen: 'Были расформатированы', plu: 'Было расформатировано'})+
           " "+removedLinksCnt+" "+
           units(removedLinksCnt,{nom: 'ссылка', gen: 'ссылки', plu: 'ссылок'})+".");
  else
    MsgBox("Ссылок с пустым адресом — в документе не нашлось.");
}