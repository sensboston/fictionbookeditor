// Скрипт «Символы windows-1252, истолкованные как windows-1251
// Автор Sclex

function win1252_search() {

 function checkToTheLeft() {
   var g2;
   g2=s1_html_len;
   s_html_len=s_html.length;
   firstRusChar=null;
   while (g2<s_html_len) {
    ch=s_html.charAt(g2);
    while (ch==">") {
     while (s_html.charAt(g2)!="<" && g2>=0) g2++;
     if (g2>=0) {
      ch=s_html.charAt(g2);
      hh5=s_html.substr(g2+1,5).toUpperCase();
      hh4=hh5.substr(0,4);
      hh3=hh5.substr(0,3);
      hh2=hh5.substr(0,2);
      if (hh4=="SUP>" || hh4=="SUP " || hh5=="/SUP>" || hh4=="SUB>" || hh4=="SUB " || hh5=="/SUB>" || hh2=="A>" || hh2=="A " || hh3=="/A>" || hh4=="IMG>" || hh4=="IMG ")
       return false;          
      g2--;
     }
    }
    isEngChar=ch.search(/[a-z]/gi)>=0;
    if (isEngChar) return true;
    if (ch.search(re0)<0) return false;
    g2--;
   }
 }

 var rusChars= "ЂЃѓ€ЉЊЌЋЏђљњќћџЎўЈҐЁЄЇІіґё№єјЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя";
 var re0=new RegExp("[a-zA-Z"+rusChars+"]","");
 var re1=new RegExp("["+rusChars+"]","");
 var tr,tr2,el,el2,s1_html_len,s_html,hh5,hh4,hh3,hh2;
 var flag,g,s,s_html_len,ch,sel,fbwBody,firstRusChar,firstRusChar_g,isEngChar,isRusChar;
 var firstSearch=true;
 var engToTheLeft=false;
 
 var removeTagsRE=new RegExp("<(?!IMG\\b).*?(>|$)","ig");
 var removeTagsRE_="";
 var imgTagRE=new RegExp("<IMG\\b.*?>","ig");
 var imgTagRE_="~~~";
 var ampRE=new RegExp("&amp;","g");
 var ampRE_="&";
 var ltRE=new RegExp("&lt;","g");
 var ltRE_="<";
 var gtRE=new RegExp("&gt;","g");
 var gtRE_=">";
 var shyRE=new RegExp("&shy;","g");
 var shyRE_=String.fromCharCode(173);
 var nbspRE=new RegExp("&nbsp;","g");
 var nbspRE_=" ";

 fbwBody=document.getElementById("fbw_body"); 
 sel=document.selection;
 tr=sel.createRange();
 ignoreNullPosition=tr.compareEndPoints("StartToEnd",tr)==0;
 tr.collapse(false);
 el=tr.parentElement();
 el2=el; 
 while (el2 && el2.nodeName!="BODY" && el2.nodeName!="P")
  el2=el2.parentNode;
 if (el2.nodeName=="P") {
  el=el2;
  tr2=document.body.createTextRange();
  tr2.moveToElementText(el);
  tr2.setEndPoint("EndToEnd",tr);
  if (tr2.htmlText.replace(/<[^>]*>/gi,"")=="")
   s1_html_len=0;
  else
   s1_html_len=tr2.htmlText.replace(/\\\s{2,}/g," ").length;
  s_html=el.innerHTML;
  engToTheLeft=checkToTheLeft();
 }
 while (el && el!=fbwBody) {
  if (el.nodeName=="P") {
   g=s1_html_len;
   s_html_len=s_html.length;
   flag=false;
   firstRusChar=null;
   while (g<s_html_len) {
    ch=s_html.charAt(g);
    while (ch=="<") {
     hh5=s_html.substr(g+1,5).toUpperCase();
     hh4=hh5.substr(0,4);
     hh3=hh5.substr(0,3);
     hh2=hh5.substr(0,2);
     if (hh4=="SUP>" || hh4=="SUP " || hh5=="/SUP>" || hh4=="SUB>" || hh4=="SUB " || hh5=="/SUB>" || hh2=="A>" || hh2=="A " || hh3=="/A>" || hh4=="IMG>" || hh4=="IMG ") {
      flag=false;
      firstRusChar=null;
      engToTheLeft=false;
     }
     while (s_html.charAt(g)!=">" && g<s_html_len) g++;
     if (g<s_html_len) g++;
     ch=s_html.charAt(g);
    }
    isEngChar=ch.search(/[a-z]/gi)>=0;
    if (isEngChar) flag=true;
    if (ch.search(re0)<0) {
     flag=false;
     engToTheLeft=false;
     firstRusChar=null;
    }
    isRusChar=ch.search(re1)>=0;
    if (!firstRusChar && isRusChar) {
     firstRusChar=ch;
     firstRusChar_g=g;
    } 
    if ((flag && ch.search(re1)>=0) || (isEngChar && firstRusChar) || (engToTheLeft && isRusChar)) {
     if (isEngChar && firstRusChar)
      g=firstRusChar_g;
     tr.moveToElementText(el);
     tr.move("character",s_html.substr(0,g).replace(removeTagsRE,removeTagsRE_).replace(imgTagRE,imgTagRE_).replace(shyRE,shyRE_).replace(ltRE,ltRE_).replace(gtRE,gtRE_).replace(ampRE,ampRE_).replace(nbspRE,nbspRE_).length);
     tr2=tr.duplicate();
     tr2.move("character",1);
     tr.setEndPoint("EndToStart",tr2);
     tr.select();
     var trTop=tr.boundingTop;
     var trBottom=tr.boundingTop+tr.boundingHeight;
     if (trBottom-trTop<=window.external.getViewHeight())
      window.scrollBy(-1000,(trTop+trBottom-window.external.getViewHeight())/2);
     else
      window.scrollBy(-1000,trTop);
     return {"p":el, "offset":g, "length":1};
    }
    g++;
   }
   firstSearch=false;
  }
  if (el && el.firstChild && el.nodeName!="P")
   el=el.firstChild;
  else {
   while (el && el.nextSibling==null) el=el.parentNode;
   if (el) el=el.nextSibling;
  }
  while (el && el!=fbwBody && el.nodeName!="P")
   if (el && el.firstChild && el.nodeName!="P")
    el=el.firstChild;
   else {
    while (el && el!=fbwBody && el.nextSibling==null) el=el.parentNode;
    if (el && el!=fbwBody) el=el.nextSibling;
   }
  if (el && el.nodeName=="P") {
   s_html=el.innerHTML;
   s1_html_len=0;
  }
 }
 return null;
}

function Run() {
 var elementBrowser_versionNum="1.5";
 var dialogWidth="540px";
 var dialogHeight="580px";
 var fbwBody=document.getElementById("fbw_body");
 var coll={};
 coll["fbwBody"]=fbwBody;
 coll["document"]=document;
 coll["window"]=window;
 coll["versionNum"]=elementBrowser_versionNum;
 coll["msg"]="Произведены автоматические замены такого количества букв:";
 window.showModalDialog("HTML/Символы win-1252, истолкованные как win-1251 - набор фреймов.html",coll,
   "dialogHeight: "+dialogHeight+"; dialogWidth: "+dialogWidth+"; "+
   "center: Yes; help: No; resizable: Yes; status: No;");
}
