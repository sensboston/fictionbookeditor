//======================================
// Предложение - 1
// Первая буква выделенного фрагмента текста — Прописная, остальные — строчные
//                         v.1.0 ©Jurgen, June 2007
//======================================

function Run()
{
 var rng=document.selection.createRange();

 if(rng.compareEndPoints("StartToEnd", rng)==0){ MsgBox("Пожалуйста, выделите хоть что-нибудь. "); return false;}

 var s=rng.htmlText;

var re10 =  new RegExp("[A-zА-яЁё]","gi");
var frst=s.search(re10);
if (frst==0)
{ s = s.substr(0,frst+1).toUpperCase()+s.substr(frst+1,s.length).toLowerCase(); }
else { MsgBox("Аккуратней выделяйте, пожалуйста!  \n"); return; } 

//                MsgBox("frst: " +frst+ "\n\n s:\n\n|" +s+ "|");

 window.external.BeginUndoUnit(document,"Предложение");
 rng.pasteHTML(s);
 window.external.EndUndoUnit(document);

}