//Скрипт «Поиск по набору регэкспов»
//Версия 2.1
//Автор Sclex

function Run() {

 function init() {
  // ТУТ НАДО НАСТРОИТЬ СПИСОК МАКРОСОВ
  // addMacros("<имя>","регэксп");
  // Допустимые символы в имени: от "a" до "я", от "a" до "z", и символы "/","?","-","_"
  // В регэкспе можно использовать макросы, определенные до этого.
  
  // ТУТ НАДО НАСТРОИТЬ СПИСОК РЕГЭКСПОВ
  // Каждый регэксп настраивается строкой такого формата:
  //   addRegExp("регэксп","ключи","описание");
  // Слеши \ в регэкспе надо удвоить
  // Если регэксп содержит прямые кавычки, перед ними надо поставить слеш: \"
  // (этот слеш перед кавычкой не надо удваивать)
  // "Ключ" (пока) поддерживается только один:
  //   i – поиск без учета регистра (case Insensitive)
  // По умолчанию поиск происходит с учетом регистра
  // "Описание" – это текст, который выведется в строке статуса, когда
  //    по регэкспу будет что-то найдено
  // Пример:
  //   addRegExp("\\d-\\d","","Найдено: две цифры с дефисом между ними.");
  //   addRegExp("\"","","Найдено: прямая кавычка.");
  //   addRegExp("(^|[^а-яё])пего(?![а-яё])","i","Найдено: слово \"пего\" (\"него\" с опечаткой).");
  // Если надо, чтобы найденный текст не выделялся, а просто курсор стал
  // в позицию перед этим найденным текстом, используйте конструкцию (?= ... )
  //   addRegExp("(?=\")","","Найдено: прямая кавычка.");
  addRegExp("","i","Задайте список регэкспов, отредактировав скрипт в текстовом редакторе (кодировка UTF-8). Инструкция – в скрипте.");
  // Команда tagRegExp с аналогичным форматом ищет текст с учетом тегов.
  // В регэкспах команды tagRegExp можно использовать макросы (см. выше).
  // Например: можно определить макрос строкой
  //   addMacros("<открывающий-emphasis-или-strong>","<emphasis>|<strong>");
  // И потом использовать его:
  //   tagRegExp("а<открывающий-emphasis-или-strong>б","i","Найдено: аб.");  
  // Работают предопределенные макросы <emphasis>, </emphasis>, <strong>, </strong>,
  //   <sup>, </sup>, <sub>, </sub>, <strikethrough>, </strikethrough>,
  //   <code>, </code>, <любые-теги>
  //tagRegExp("[а-яё]<emphasis>[а-яё]+?</emphasis>|<emphasis>[а-яё]+?</emphasis>[а-яё]","i","Найдено: курсивность части слова.");
 }

 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

 var sel=document.selection;

 if (sel.type!="None" && sel.type!="Text") {
  MsgBox("Не обрабатываемый тип выделения: sel.type");
  return;
 } 

 var regExps=[];
 var itsTagRegExp=[];
 var descs=[];
 var macroses={};
 var regExpCnt=0;
 var re;
 var errorList="";

 function replaceMacroses(full_match, brackets1, brackets2, brackets3, brackets4, brackets5,
                          brackets6, brackets7, brackets8, brackets9, offset_of_match,
                          string_we_search_in) {
  if (macroses[full_match.toLowerCase()])
   return macroses[full_match.toLowerCase()];
  else
   return full_match; 
 }
 
 function addRegExp(re,keys,desc) {
  try {
   re=new RegExp(re.replace(/ /g,nbspChar),"g"+(keys?keys:""));
  }
  catch(e) {
   errorList+=(errorList==""?"":"\n")+"addRegExp(\""+re+"\",\""+keys+"\",\""+desc+"\");";
   return;
  }
  regExpCnt++;
  regExps[regExpCnt]=re;
  itsTagRegExp[regExpCnt]=false;
  if (desc!=undefined && desc!="") descs[regExpCnt]=desc;
 }

 function tagRegExp(re_,keys,desc) {
  try {
   re=new RegExp(re_.replace(/ /g,nbspChar).replace(macrosNameRE_2,replaceMacroses),"g"+(keys?keys:""));
  }
  catch(e) {
   errorList+=(errorList==""?"":"\n")+"addRegExp(\""+re_+"\",\""+keys+"\",\""+desc+"\");";
   return;
  }
  regExpCnt++;
  regExps[regExpCnt]=re;
  itsTagRegExp[regExpCnt]=true;
  if (desc!=undefined && desc!="") descs[regExpCnt]=desc;
 }

 function addMacros(macrosName,macrosRE) {
  if (macrosName.search(macrosNameRE)<0)
   errorList+=(errorList==""?"":"\n")+"addMacros(\""+macrosName+"\",\""+macrosRE+"\"); //неверное имя макроса"
  macrosRE_=macrosRE.replace(macrosNameRE_2,replaceMacroses);
  try {
   re=new RegExp("("+macrosRE_.replace(/ /g,nbspChar)+")","g");
  }
  catch(e) {
   errorList+=(errorList==""?"":"\n")+"addMacros(\""+macrosName+"\",\""+macrosRE+"\"); // ошибка при компиляции регэкспа";
   return;
  }
  macroses[macrosName.toLowerCase()]="("+macrosRE_.replace(/ /g,nbspChar)+")";
 }

 for (i in macroses) delete macroses[i];
 var macrosNameRE=/^<[-а-яёa-z_?\/]+>$/i;
 var macrosNameRE_2=/<[-а-яёa-z_?\/]+>/ig;

 addMacros("<emphasis>","<[Ee][Mm]>");
 addMacros("<strong>","<([Ss][Tt][Rr][Oo][Nn][Gg]|[Bb])(?![a-z])[^>]*?>");
 addMacros("<sup>","<[Ss][Uu][Pp](?![a-z])[^>]*?>");
 addMacros("<sub>","<[Ss][Uu][Bb](?![a-z])[^>]*?>");
 addMacros("<strikethrough>","<[Ss][Tt][Rr][Ii][Kk][Ee](?![a-z])[^>]*?>");
 addMacros("<code>","<[Ss][Pp][Aa][Nn](?![a-z])[^>]*?\\b[Cc][Ll][Aa][Ss][Ss]=[\"']?[Cc][Oo][Dd][Ee](?![a-z])[\"']?[^>]*?>");
 addMacros("</emphasis>","</([Ee][Mm]|[Ii])>");
 addMacros("</strong>","</([Ss][Tt][Rr][Oo][Nn][Gg]|[Bb])>");
 addMacros("</sup>","</[Ss][Uu][Pp]>");
 addMacros("</sub>","</[Ss][Uu][Bb]>");
 addMacros("</strikethrough>","</[Ss][Tt][Rr][Ii][Kk][Ee]>");
 addMacros("</code>","</[Ss][Pp][Aa][Nn]>");
 addMacros("<любые-теги>","(</?[^>]*?>)*?");

 init();

 if (errorList!="") {
  alert("Ошибки при компиляции регэкспов, заданных в таких строках:\n\n"+errorList+"\n\nПожалуйста, поправьте ошибки, прежде чем использовать скрипт.");
  return;
 }
 var fbwBody,tmpNode,s1WithTagsRemoved,s2WithTagsRemoved,minPos,minHtmlPos,currPos,i,rslt,foundLen;
 var tr,tr2,el,el2,myIndex,s,s_html,s1_len,ignoreNullPosition,desc,rslt,newPos,re,macrosRE;
 var k,flag1,rslt_replaced;
 
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
 
 fbwBody=document.getElementById("fbw_body");
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
  s1_html_len=tr2.htmlText.length;
  s_html=el.innerHTML;
 }
 while (el && el!=fbwBody) {
  if (el.nodeName=="P") {
   minPos=-1;
   for (i=1;i<=regExpCnt;i++) {
    if (itsTagRegExp[i]==false) {
     rslt=regExps[i].exec(s);
     regExps[i].lastIndex=s1_len+(ignoreNullPosition?1:0);
     rslt=regExps[i].exec(s);
     if (rslt) {
      if (rslt.index<minPos || minPos==-1) {
       minPos=rslt.index;
       foundLen=rslt[0].length;
       desc=descs[i];
      } 
      if (ignoreNullPosition ? minPos==s1_len+1 : minPos==s1_len) break;
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
       newPos=s_html.substr(0,rslt.index).replace(removeTagsRE,removeTagsRE_).replace(imgTagRE,imgTagRE_).replace(ltRE,ltRE_).replace(gtRE,gtRE_).replace(ampRE,ampRE_).replace(nbspRE,nbspRE_).length;
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
        regExps[i].lastIndex=k+1;
       }
       if (!flag1) {
        if (newPos<minPos || minPos==-1) {
         minPos=newPos;
         foundLen=rslt_replaced.length;
         desc=descs[i];
        }       
       }
      } // if             
     } // while (flag1)
    } // else
   } // for (i=1;i<=regExpCnt;i++)
   if (minPos!=-1 && !(ignoreNullPosition && minPos==s1_len)) {
    if (desc!=undefined && desc!="")
     try {
      window.external.SetStatusBarText(desc);
     }
     catch(e)
      {}
    tr.moveToElementText(el);
    tr.move("character",minPos);
    tr2=tr.duplicate();
    tr2.move("character",foundLen);
    tr.setEndPoint("EndToStart",tr2);
    if (foundLen==0 && tr.move("character",1)==1) tr.move("character",-1);
    tr.select();
    return;
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
 MsgBox("От позиции курсора до конца документа ничего не найдено.");
}