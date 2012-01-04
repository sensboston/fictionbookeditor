// Скрипт «Символы windows-1252 в файле windows-1251
// Автор Sclex

function win1252_search() {

 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

 function replaceMacroses(full_match, brackets1, offset_of_match, string_we_search_in) {
  if (macroses[full_match.toLowerCase()])
   return macroses[full_match.toLowerCase()];
  else
   return full_match;
 }

 function replaceA0(full_match, brackets1, offset_of_match, string_we_search_in) {
  if (brackets1.length%2==1) return nbspChar;
  else return full_match;
 }

 function cmpFounds(a,b) {
  return a["pos"]-b["pos"];
 }

 function checkOneTag(full_match, brackets1, brackets2, brackets3, offset_of_match, string_we_search_in) {
  if (inTags[brackets3]!=(brackets2=="+")) tagFlag=false;
  return full_match;
 }

 function checkAreWeInRightTags(reNum) {
  tagFlag=true;
  ss=tagCond[reNum];
  if (ss) ss.replace(findTagRE,checkOneTag);
  return tagFlag;
 }

 function checkLookBehs(reNum,s,pos) {
  s=s.substr(0,pos);
  var rslt;
  if (!lookBehinds[reNum]) return true;
  for (var i=0; i<lookBehinds[reNum].length; i++) {
   lookBehinds[reNum][i].lastIndex=0;
   rslt=lookBehinds[reNum][i].exec(s);
   while (rslt && rslt.index+rslt[0].length!=s.length) {
    rslt=lookBehinds[reNum][i].exec(s);
   } 
   if (positive[reNum][i]) {
    if (!rslt || rslt.index+rslt[0].length!=s.length) return false;
   }
   else {
    if (rslt && rslt.index+rslt[0].length==s.length) return false;
   }
  }
  return true;
 }
 
  function getTags(el) {
  inTags={};
  inTags["section"]=false;
  inTags["body"]=false;
  inTags["epigraph"]=false;
  inTags["cite"]=false;
  inTags["poem"]=false;
  inTags["stanza"]=false;
  inTags["title"]=false;
  if (el.className=="subtitle") inTags["subtitle"]=true;
  else inTags["subtitle"]=false;
  if (el.className=="text-author") inTags["text-author"]=true;
  else inTags["text-author"]=false;
  el3=el;
  while (el3 && el3.nodeName!="BODY") {
   if (el3.nodeName=="DIV")
    switch(el3.className) {
     case "section": {
      inTags["section"]=true;
      break;
     }
     case "body": {
      inTags["body"]=true;
      break;
     }
     case "epigraph": {
      inTags["epigraph"]=true;
      break;
     }
     case "cite": {
      inTags["cite"]=true;
      break;
     }
     case "poem": {
      inTags["poem"]=true;
      break;
     }
     case "stanza": {
      inTags["stanza"]=true;
      break;
     }
     case "title": {
      inTags["title"]=true;
      break;
     }       
    }
   el3=el3.parentNode;
  } 
 }
 
 var fbwBody,tmpNode,s1WithTagsRemoved,s2WithTagsRemoved,minPos,minHtmlPos,currPos,i,rslt,foundLen;
 var tr,tr2,el,el2,el3,myIndex,s,s_html,s1_len,ignoreNullPosition,desc,rslt,newPos,re,macrosRE;
 var k,flag1,rslt_replaced,founds,foundsCnt,searchResult;
 
 var regExps=[];
 var itsTagRegExp=[];
 var lookBehinds=[];
 var descs=[];
 var positive=[];
 var tagCond=[];
 var regExpCnt=0;
 var re,inTags,ss,tagFlag;
 var errorList="";
 var checkTagStrRE=new RegExp("^(([-+](section|body|epigraph|cite|poem|stanza|title|subtitle|text-author))([ \t]+?[-+](section|body|epigraph|cite|poem|stanza|title|subtitle|text-author))*?|^$)$","i");
 var findTagRE=new RegExp("(^| )([-+])(section|body|epigraph|cite|poem|stanza|title|subtitle|text-author)(?= |$)","ig");
 var find_xA0=new RegExp("((\\\\)+?)xA0","ig");
 
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
 var nbspRE=new RegExp("&nbsp;","g");
 var nbspRE_=" ";

 regExpCnt++;
 var anyTags="(<[Aa]\\b[^>]*?\\b[Cc][Ll][Aa][Ss][Ss]=('note'|\"note\"|note)[^>]*?>((?!</a>).)*?</a>|<(?!/?([Aa]|[Ss][Uu][Bb]|[Ss][Uu][Pp]|[Ii][Mm][Gg])\\b)[^>]*?>)*?";
 var rusChars= "ЂЃѓ€ЉЊЌЋЏђљњќћџЎўЈҐЁЄЇІіґё№єјЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя";
 regExps[regExpCnt]=new RegExp(
  "(["+rusChars+"A-Za-z]"+anyTags+")*["+rusChars+"]"+anyTags+"[A-Za-z]"+anyTags+"((["+rusChars+"A-Za-z]"+anyTags+")*["+rusChars+"A-Za-z])?"+
  "|"+
  "(["+rusChars+"A-Za-z]"+anyTags+")*[A-Za-z]"+anyTags+"["+rusChars+"]"+anyTags+"((["+rusChars+"A-Za-z]"+anyTags+")*["+rusChars+"A-Za-z])?"
  ,
  "g");
 itsTagRegExp[regExpCnt]=true;
 descs[regExpCnt]="";
 lookBehinds[regExpCnt]=/[^а-яёa-z]/gi;
 positive[regExpCnt]=true;

 fbwBody=document.getElementById("fbw_body");
 var sel=document.selection;
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
  s1_len=tr2.text.length;
  s=el.innerHTML.replace(removeTagsRE,removeTagsRE_).replace(imgTagRE,imgTagRE_).replace(ltRE,ltRE_).replace(gtRE,gtRE_).replace(ampRE,ampRE_).replace(nbspRE,nbspRE_);
  s1_html_len=tr2.htmlText.replace(/\s{2,}/g," ").length;
  s_html=el.innerHTML;
 }
 while (el && el!=fbwBody) {
  if (el.nodeName=="P") {
   founds=[];
   foundsCnt=0;
   minPos=-1;
   for (i=1;i<=regExpCnt;i++) {
    getTags(el);
    if (checkAreWeInRightTags(i)) {
     if (itsTagRegExp[i]==false) {
      rslt=regExps[i].exec(s);
      regExps[i].lastIndex=s1_len+(ignoreNullPosition?1:0);
      rslt=regExps[i].exec(s);
      while (rslt && !checkLookBehs(i, s, rslt.index, false)) rslt=regExps[i].exec(s);
      if (rslt) {
       founds[foundsCnt]={"pos":rslt.index, "len":rslt[0].length, "re":i};
       foundsCnt++;
       //if (ignoreNullPosition ? minPos==s1_len+1 : minPos==s1_len) break;
      }
     }
     else { //itsTagRegExp[i]==true, т.е. в этой ветке ищем по теговым регэкспам
      flag1=true;
      rslt=regExps[i].exec(s_html);
      regExps[i].lastIndex=s1_html_len+(ignoreNullPosition?1:0);
      while (flag1) {
       rslt=regExps[i].exec(s_html);
       flag1=false;
       if (rslt) {
        newPos=rslt.index; /*s_html.substr(0,rslt.index).replace(removeTagsRE,removeTagsRE_).replace(imgTagRE,imgTagRE_).replace(ltRE,ltRE_).replace(gtRE,gtRE_).replace(ampRE,ampRE_).replace(nbspRE,nbspRE_).length*/;
        rslt_replaced=rslt[0].replace(removeTagsRE,removeTagsRE_).replace(imgTagRE,imgTagRE_).replace(ltRE,ltRE_).replace(gtRE,gtRE_).replace(ampRE,ampRE_).replace(nbspRE,nbspRE_);
        if (ignoreNullPosition ? minPos==s1_html_len+1 : minPos==s1_html_len) break;
        if (rslt_replaced.length==0 || (rslt_replaced.length!=0 && rslt_replaced[0]!="<")) {
         k=regExps[i].lastIndex;
         while (k<s_html.length && s_html.charAt(k)!=">" && s_html.charAt(k)!="<") k++;
         //alert("k после цикла: "+k+"\n\ns_html[k]: "+s_html.charAt(k));
         if (k<s_html.length && s_html.charAt(k)==">") {
          regExps[i].lastIndex=k+1;
          //alert("regExps[i].lastIndex: "+regExps[i].lastIndex);
          flag1=true;
         }
        }
        if (!flag1) {
         if (!checkLookBehs(i, s_html, rslt.index, true)) flag1=true;
         else {
          founds[foundsCnt]={"pos":newPos, "len":rslt[0].length, "re":i};
          foundsCnt++;
         }
        }
       } // if
      } // while (flag1)
     } // else
    } //if (checkAreWeInRightTags)
   } // for (i=1;i<=regExpCnt;i++)
   founds.sort(cmpFounds);
   var currFound=0;
   while (currFound<foundsCnt) {
    i=founds[currFound]["re"];
    if (!(ignoreNullPosition && founds[currFound].pos==s1_len)) {
     var desc=descs[i];
     tr.moveToElementText(el);
     tr.move("character",founds[currFound]["pos"]);
     tr2=tr.duplicate();
     tr2.move("character",founds[currFound]["len"]);
     tr.setEndPoint("EndToStart",tr2);
     if (foundLen==0 && tr.move("character",1)==1) tr.move("character",-1);
     tr.select();
     var trTop=tr.boundingTop;
     var trBottom=tr.boundingTop+tr.boundingHeight;
     if (trBottom-trTop<=window.external.getViewHeight())
      window.scrollBy(-1000,(trTop+trBottom-window.external.getViewHeight())/2);
     else
      window.scrollBy(-1000,trTop);
     return {"p":el, "offset":founds[currFound]["pos"], "length":founds[currFound]["len"]};
    }
    currFound++;
   }
   ignoreNullPosition=false;
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
   s=el.innerHTML.replace(removeTagsRE,removeTagsRE_).replace(imgTagRE,imgTagRE_).replace(ltRE,ltRE_).replace(gtRE,gtRE_).replace(ampRE,ampRE_).replace(nbspRE,nbspRE_);
   s1_len=0;
   s_html=el.innerHTML;
   s1_html_len=0;
  }
 }
 return null;
}

function Run() {
 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}
 var elementBrowser_versionNum="1.2";
 var dialogWidth="460px";
 var dialogHeight="540px";
 var fbwBody=document.getElementById("fbw_body");
 var coll={};
 coll["fbwBody"]=fbwBody;
 coll["document"]=document;
 coll["window"]=window;
 coll["versionNum"]=elementBrowser_versionNum;
 coll["nbspChar"]=nbspChar;
 window.showModalDialog("HTML/Символы win-1252 в файле win-1251 - набор фреймов.html",coll,
   "dialogHeight: "+dialogHeight+"; dialogWidth: "+dialogWidth+"; "+
   "center: Yes; help: No; resizable: Yes; status: No;"); 
}