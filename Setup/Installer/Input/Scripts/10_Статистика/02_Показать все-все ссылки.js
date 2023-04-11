//======================================
// Shows all links in browser
// modified by mkb
//======================================

function Run()
{
 var links=document.getElementsByTagName("A"); if(!links) return;

 if(links.length==0){ MsgBox("\nДокумент не содержит ссылок. \n\n"); return; }

 var msg="", cnt=1;

 msg+="ВНУТРЕННИЕ ССЫЛКИ:\n\n";

 for(var i=0; i<links.length; i++)
 {
  var href=links[i].getAttribute("href");

  if(href.indexOf("http://")!=-1 || href.indexOf("https://")!=-1) continue;

  var istr=""+cnt; if(istr.length<2) istr="0"+istr; 

  if(href.indexOf("#")!=0) istr="[!!!]  "+istr;
  
  cnt++; if(href=="") href="(null)";

  msg+=" "+istr+". "+links[i].innerText+" → "+href+" \n";
 }

 msg+="\n-------------------------------------------- \n\nВНЕШНИЕ ССЫЛКИ:\n\n";

 cnt=1;

 for(i=0; i<links.length; i++)
 {
  var href=links[i].getAttribute("href");

  if(href.indexOf("http://")==-1 && href.indexOf("https://")==-1) continue;

  var istr=""+cnt; if(istr.length<2) istr="0"+istr;

  cnt++; if(href=="") href="(null)";

  msg+=" "+istr+". "+links[i].innerText+" → "+href+" \n";
 }

 MyMsgWindow(msg);

}

function MyMsgWindow(msg)
{
 var MsgWindow = window.open("Scripts/links.htm",null,"height=710,width=300,status=no,toolbar=no,menubar=no,location=no,scrollbars=yes,resizeble=yes");
 MsgWindow.document.body.innerText = msg;
}
