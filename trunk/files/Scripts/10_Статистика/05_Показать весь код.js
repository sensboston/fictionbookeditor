//======================================
// Отображение HTML кода текущей секции (only for script debugging)
// THX to mkb (Konstantin Matveev) for ingenious idea
//======================================

function Run()
{
 var rng=document.selection.createRange(); if(!rng) return false;

 var pe=rng.parentElement();

     var msg="";

 while(pe.parentElement && pe.tagName!="DIV" && pe.className!="section") pe=pe.parentElement;  

 if(pe) MyMsgWindow(pe);
}

function MyMsgWindow(pe)
{
 msg = pe.outerHTML;
 var MsgWindow = window.open("Scripts/debug.htm",null,"height=680,width=1014,status=no,toolbar=no,menubar=no,location=no,scrollbars=yes,resizeble=yes");
 MsgWindow.document.body.innerText = msg;
}