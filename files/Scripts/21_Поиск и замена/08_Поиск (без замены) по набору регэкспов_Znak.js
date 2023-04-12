//Скрипт «Поиск по набору регэкспов»
//Версия 2.8
//Автор Sclex

function Run() {

 function init() {
  // ТУТ НАДО НАСТРОИТЬ СПИСОК МАКРОСОВ
  // addMacros("<имя>","регэксп");
  // Допустимые символы в имени: от "a" до "я", от "a" до "z", и символы "/","?","-","_"
  // В регэкспе можно использовать макросы, определенные до этого.

  // ТУТ НАДО НАСТРОИТЬ СПИСОК РЕГЭКСПОВ
  // Каждый регэксп настраивается строкой такого формата:
  //   addRegExp("регэксп","ключи","описание","в каких тегах искать","лимит для просмотра назад");
  // Слеши \ в регэкспе надо удвоить
  // Если регэксп содержит прямые кавычки, перед ними надо поставить слеш: \"
  // (этот слеш перед кавычкой не надо удваивать)
  // "Ключ" (пока) поддерживается только один:
  //   i – поиск без учета регистра (case Insensitive)
  // По умолчанию поиск происходит с учетом регистра
  // "Описание" – это текст, который выведется в строке статуса, когда
  //    по регэкспу будет что-то найдено
  // "В каких тегах искать" – параметр должен содержать сочетания
  //    "плюс или минус, потом имя элемента", разделенные пробелом.
  //    К примеру, если этот параметр имеет значение "+poem -stanza +title",
  //    то скрипт будет искать по регэкспу только в абзацах P,
  //    вложенных в <poem> и в <title>, но при этом не вложенных в <stanza>.
  //    Указывать имена инлайн-тегов не разрешено.
  // "Лимит для просмотра назад" – устанавливает максимальную длину подстроки,
  //    которая может быть найдена конструкцией (?<= ...) или (?= ...) данного
  //    регэкспа. Чем меньше значение данного параметра, тем быстрее будет 
  //    выполняться поиск. Чтобы искать без ограничения длины (самый медленный поиск),
  //    можно прописать значение 0 или undefined, или вообще не задавать параметр.
  // Пример:
  //   addRegExp("\\d-\\d","","Найдено: две цифры с дефисом между ними.");
  //   addRegExp("\"","","Найдено: прямая кавычка.");
  //   tagRegExp("(?<![а-яё])пего(?![а-яё])","i","Найдено: слово \"пего\" (\"него\" с опечаткой).","",1);
  // Если надо, чтобы найденный текст не выделялся, а просто курсор стал
  // в позицию перед этим найденным текстом, используйте конструкцию (?= ... )
  //   addRegExp("(?=\")","","Найдено: прямая кавычка.");
  // Конструкции look behind, т.е. (?<! ...) и (?<= ...) разрешены только
  //   только в начале регэкспа и проверяются независимо от остальной части
  //   регэкспа. То есть (?<=а)б|в найдет не "б, перед которым а" либо "в",
  //   а "{б или в}, перед которым а".
  // addRegExp("","i","Задайте список регэкспов, отредактировав скрипт в текстовом редакторе (кодировка UTF-8). Инструкция – в скрипте.");
  // Когда будете задавать свои регэкспы, сотрите или закомментируйте предыдущую строку.
  // tagRegExp("(?<=[а-яё])<strong>[а-яё]+?</strong>","i","Найдено: курсив в слове.");
  // tagRegExp("<strong>[а-яё]+?</strong>(?=[а-яё])","i","Найдено: курсив в слове.");
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


// -------------начало блока JonVic - регэкспы:---------------

  addRegExp("([^\\]»….,:;!\\?\"]|[-—–,])$","","Найдено: концы строк без точек","-title -subtitle -stanza -poem -epigraph");
  addRegExp("[/\\\\>|<{_×}^~›@$&•■♦•·®™]","","Найдено:мусор после скана");
  addRegExp("[*]","","Найдено:звездочки в тексте, не сабтайтлы, после скана","-subtitle");
  addRegExp("-[\\x20\\xA0\\t\\n\\r\\f]","","Найдено:неправильные дефисы-тире");
  addRegExp("[\\x20\\xA0\\t\\n\\r\\f]-","","Найдено:неправильные дефисы-тире");
  addRegExp("\\d-\\d","","Найдено: две цифры с дефисом между ними.")
//  addRegExp("[A-Za-zА-яЁё\"»).,][0-9]","","Найдено: Подозрение на пропущенную сноску");

  addRegExp("[a-zA-Z][а-яА-ЯёЁ]","","Найдено: смесь латиницы с кириллицей");
  addRegExp("[а-яА-ЯёЁ][a-zA-Z]","","Найдено: смесь кириллицы и латиницы");
  addRegExp("[A-Za-zА-яЁё][0-9]","","Найдено: смесь букв и цифр");
  addRegExp("[0-9][A-Za-zА-яЁё]","","Найдено: смесь цифр и букв");
  addRegExp("[а-яё][А-ЯЁ]","","Найдено: смесь регистров");
  addRegExp("[А-ЯЁ][А-ЯЁ][а-яё]","","Найдено: смесь регистров");

  addRegExp("[A-Za-zА-яЁё][—]","i","Найдено: прилипшее тире в конце и середине слова");
  addRegExp("[—][A-Za-zА-яЁё]","i","Найдено: прилипшее тире в начале и середине слова");
  addRegExp("[»][—]","", "Найдено: пропущен пробел перед тире");
  addRegExp("[\\x20][»”’]","i","Найдено: пробел перед закрывающей кавычкой");

  addRegExp("[\\x20\\xA0\\t\\n\\r\\f][З][\\x20\\xA0\\t\\n\\r\\f]","i","Найдено:буква З вместо цифры 3");
  addRegExp("[з][,][0-9]","i","Найдено:буква з вместо цифры 3 в числах до зяпятой");
  addRegExp("[0-9][,][з]","i","Найдено:буква З вместо цифры 3 в числах после запятой");
  addRegExp("^[З][\\x20\\xA0\\t\\n\\r\\f]","i","Найдено:буква З вместо цифры 3 в начале строки");
  addRegExp("^[З][)]","i","Найдено:буква З вместо цифры 3 в списке");
  addRegExp("[\\x20\\xA0\\t\\n\\r\\f][c][\\x20\\xA0\\t\\n\\r\\f]","i","Найдено:латинская c вместо русской с в предлоге");
  addRegExp("[\\x20\\xA0\\t\\n\\r\\f][y][\\x20\\xA0\\t\\n\\r\\f]","i","Найдено:латинская y вместо русской у в предлоге");
  addRegExp("[\\x20\\xA0\\t\\n\\r\\f][бгдеёзйлмнпртфхцчшщъыьэю][\\x20\\xA0\\t\\n\\r\\f]","i","Найдено: буква в пробелах");
  addRegExp("[\\x20\\xA0\\t\\n\\r\\f][0][\\x20\\xA0\\t\\n\\r\\f]","i","Найдено:цифра 0 вместо буквы о в пробелах");

  addRegExp("[пк]н[^а-яёa-z]","i","Найдено: пн/кн вместо пи/ки в конце слова");
  addRegExp("[^а-яёa-z][пк]н[бвгджзйклмнпрстфхцчшщъь]","i","Найдено: пн/кн вместо пи/ки в начале слова с согласной после");

  addRegExp("[A-Za-zА-яЁё][»….,:;!\?«—)(\"][A-Za-zА-яЁё]","i","Найдено: смесь букв и знаки препинания");
  addRegExp("[а-яё] — [А-ЯЁ]","","Найдено: возможно, пропущена точка в диалоге");
//  addRegExp("[а-яё] — [а-яё]","","Найдено: возможно, нужен дефис без пробелов");
  addRegExp(",\xA0— [А-ЯЁ]","","Найдено: возможно, запятая вместо точки в диалоге");

  tagRegExp("([a-zа-яё]-[a-zа-яё]*?-[a-zа-яё])","i","Найдено: слово в двумя дефисами).","",1);

  addRegExp("^[-\\]».,:;!\\?·)(]","","Найдено:знаки препинания в начале абзаца");
  addRegExp("^[a-zа-яё\\d]","","Найдено:маленькие буквы, цифры в начале строки","-stanza -poem");
  addRegExp("^[…] [A-Za-zА-яЁё]","i","Найдено: многоточие и пробел в начале параграфа");
  addRegExp("[!?.,:;][…]","i","Найдено: троеточие после знаков препинания...");
  addRegExp(" [….,:;!?][A-Za-zА-яЁё]","i","пробел перед знаком препинания");
  addRegExp("[ .,:;][,]","i","Найдено: возможно ошибка синтаксиса");
  addRegExp("[ ,:;][.]","i","Найдено: возможно ошибка синтаксиса");
  addRegExp("[a-zа-яё\\d][.][.]","i","Найдено: две точки, возможно ошибка");
  addRegExp("[A-Za-zА-яЁё!-?»] […]","i","Найдено: пробел перед троеточием");
  addRegExp("[…][!-?]","i","Найдено: знаки препинания после троеточия");

  
  tagRegExp("[а-яёa-z]<emphasis>[а-яёa-z]+?</emphasis>|<emphasis>[а-яёa-z]+?</emphasis>[а-яёa-z]","i","Найдено: курсивность в слове.");
  tagRegExp("[а-яёa-z]<strong>[а-яёa-z]+?</strong>|<strong>[а-яёa-z]+?</strong>[а-яёa-z]","i","Найдено: жирность в слове.");
  tagRegExp("[а-яёa-z]<sup>[а-яёa-z]+?</sup>|<sup>[а-яёa-z]+?</sup>[а-яёa-z]","i","Найдено: верхний индекс в слове.");
  tagRegExp("[а-яёa-z]<sub>[а-яёa-z]+?</sub>|<sub>[а-яёa-z]+?</sub>[а-яёa-z]","i","Найдено: нижний индекс в слове.");
  tagRegExp("<emphasis><strong>[а-яёa-z]+?</strong></emphasis>[а-яёa-z]|[а-яёa-z]<emphasis><strong>[а-яёa-z]+?</strong></emphasis>","","Найдено: жирность и курсивность в слове.");
  tagRegExp("<strong><emphasis>[а-яёa-z]+?</emphasis></strong>[а-яёa-z]|[а-яёa-z]<strong><emphasis>[а-яёa-z]+?</emphasis></strong>","","Найдено: курсивность и жирность в слове.");


// -------------конец блока JonVic - регэкспы:---------------

 }

 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

 var sel=document.selection;

 if (sel.type!="None" && sel.type!="Text") {
  MsgBox("Не обрабатываемый тип выделения: sel.type");
  return;
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
 var lookBehinds=[];
 var descs=[];
 var positive=[];
 var tagCond=[];
 var macroses={};
 var lookBehLimit=[];
 var regExpCnt=0;
 var re,inTags,ss,tagFlag,s_len,rslt,ff,offset,nn;
 var level,ch,begin,lookBeh,lookBehCnt,ii,limit,rslt_;
 var saveIndex1,saveIndex2,saveIndex3,saveIndex4,saveIndex5,saveIndex6,saveIndex7;
 var errorList="";
 var checkTagStrRE=new RegExp("^(([-+](section|body|epigraph|cite|poem|stanza|title|subtitle|text-author))([ \t]+?[-+](section|body|epigraph|cite|poem|stanza|title|subtitle|text-author))*?|^$)$","i");
 var findTagRE=new RegExp("(^| )([-+])(section|body|epigraph|cite|poem|stanza|title|subtitle|text-author)(?= |$)","ig");
 var find_xA0=new RegExp("((\\\\)+?)xA0","ig");

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

 function addRegExp(re_,keys,desc,inWhatTags,beforeLimit) {
  try {
   ii=0;
   lookBeh=[];
   lookBehCnt=0;
   posit=[];
   while (re_.substr(ii,4)=="(?<=" || re_.substr(ii,4)=="(?<!") {
    level=1;
    begin=ii;
    ii+=4;
    while (ii<re_.length && level!=0) {
     ch=re_.charAt(ii);
     if (ch=="(") level++;
     if (ch==")") level--;
     if (ch=="\\") ii+=2;
     else ii++;
    }
    lookBeh[lookBehCnt]=new RegExp(re_.substring(begin+4,ii-1).replace(/ /g,nbspChar).replace(find_xA0,replaceA0),"g"+(keys?keys:""));
    posit[lookBehCnt]=re_.substr(begin,4)=="(?<=";
    lookBehCnt++;
   }
   re=new RegExp(re_.substr(ii).replace(/ /g,nbspChar).replace(find_xA0,replaceA0),"g"+(keys?keys:""));
   if (inWhatTags && inWhatTags.search(checkTagStrRE)<0) throw(true);
  }
  catch(e) {
   errorList+=(errorList==""?"":"\n")+"addRegExp(\""+re_+"\",\""+keys+"\",\""+desc+"\",\""+inWhatTags+"\"";
   return;
  }
  regExpCnt++;
  regExps[regExpCnt]=re;
  itsTagRegExp[regExpCnt]=false;
  if (desc!=undefined && desc!="") descs[regExpCnt]=desc;
  if (lookBehCnt!=0) {
   lookBehinds[regExpCnt]=lookBeh;
   positive[regExpCnt]=posit;
  }
  else lookBehinds[regExpCnt]=null;
  if (inWhatTags) tagCond[regExpCnt]=inWhatTags;
  if (beforeLimit && typeof(beforeLimit)=="number" && beforeLimit!=0) lookBehLimit[regExpCnt]=beforeLimit;
 }

 function tagRegExp(re_,keys,desc,inWhatTags,beforeLimit) {
  try {
   var ii=0;
   lookBeh=[];
   lookBehCnt=0;
   posit=[];
   while (re_.substr(ii,4)=="(?<=" || re_.substr(ii,4)=="(?<!") {
    level=1;
    begin=ii;
    ii+=4;
    while (ii<re_.length && level!=0) {
     ch=re_.charAt(ii);
     if (ch=="(") level++;
     if (ch==")") level--;
     if (ch=="\\") ii+=2;
     else ii++;
    }
    lookBeh[lookBehCnt]=new RegExp(re_.substring(begin+4,ii-1).replace(/ /g,nbspChar).replace(find_xA0,replaceA0).replace(macrosNameRE_2,replaceMacroses),"g"+(keys?keys:""));
    posit[lookBehCnt]=re_.substr(begin,4)=="(?<=";
    lookBehCnt++;
   }
   re=new RegExp(re_.substr(ii).replace(/ /g,nbspChar).replace(find_xA0,replaceA0).replace(macrosNameRE_2,replaceMacroses),"g"+(keys?keys:""));
   if (inWhatTags && inWhatTags.search(checkTagStrRE)<0) throw(true);
  }
  catch(e) {
   errorList+=(errorList==""?"":"\n")+"tagRegExp(\""+re_+"\",\""+keys+"\",\""+desc+"\",\""+inWhatTags+"\"";
   return;
  }
  regExpCnt++;
  regExps[regExpCnt]=re;
  itsTagRegExp[regExpCnt]=true;
  if (desc!=undefined && desc!="") descs[regExpCnt]=desc;
  if (lookBehCnt!=0) {
   lookBehinds[regExpCnt]=lookBeh;
   positive[regExpCnt]=posit;
  }
  else lookBehinds[regExpCnt]=null;
  if (inWhatTags) tagCond[regExpCnt]=inWhatTags;
  if (beforeLimit && typeof(beforeLimit)=="number") lookBehLimit[regExpCnt]=beforeLimit;
 }

 function cmpFounds(a,b) {
  return a["pos"]-b["pos"];
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
  if (!lookBehinds[reNum]) return true;
  limit=lookBehLimit[reNum];
  if (!limit) {
   s=s.substr(0,pos);
  }
  else {
   offset=pos-limit;
   s=s.substring(offset>=0?offset:0, pos);
  }
  s_len=s.length;
  for (ff=0; ff<lookBehinds[reNum].length; ff++) {
   lookBehinds[reNum][ff].lastIndex=0;
   nn=s.search(lookBehinds[reNum][ff]);
   saveIndex1=0;
   if (nn>=0) {
    lookBehinds[reNum][ff].lastIndex=saveIndex1;
    rslt_=lookBehinds[reNum][ff].exec(s);
    saveIndex1=lookBehinds[reNum][ff].lastIndex;
   }
   else
    rslt_=null;
   lookBehinds[reNum][ff].lastIndex=saveIndex1;
   while (rslt_ && rslt_.index+rslt_[0].length!=s_len) {
    saveIndex4=lookBehinds[reNum][ff].lastIndex;
    nn=s.search(lookBehinds[reNum][ff]);
    if (nn>=0) {
     lookBehinds[reNum][ff].lastIndex=saveIndex4;
     rslt_=lookBehinds[reNum][ff].exec(s);
     saveIndex4=lookBehinds[reNum][ff].lastIndex;
    }
    else
     rslt_=null;
   }
   if (positive[reNum][ff]) {
    if (!rslt_ || rslt_.index+rslt_[0].length!=s_len) return false;
   }
   else {
    if (rslt_ && rslt_.index+rslt_[0].length==s_len) return false;
   }
  }
  return true;
 }

 function addMacros(macrosName,macrosRE) {
  if (macrosName.search(macrosNameRE)<0)
   errorList+=(errorList==""?"":"\n")+"addMacros(\""+macrosName+"\",\""+macrosRE+"\"); //неверное имя макроса"
  macrosRE_=macrosRE.replace(macrosNameRE_2,replaceMacroses);
  try {
   re=new RegExp("("+macrosRE_.replace(/ /g,nbspChar).replace(find_xA0,replaceA0)+")","g");
  }
  catch(e) {
   errorList+=(errorList==""?"":"\n")+"addMacros(\""+macrosName+"\",\""+macrosRE+"\"); // ошибка при компиляции регэкспа";
   return;
  }
  macroses[macrosName.toLowerCase()]="("+macrosRE_.replace(/ /g,nbspChar).replace(find_xA0,replaceA0)+")";
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
 var tr,tr2,el,el2,el3,myIndex,s,s_html,s1_len,ignoreNullPosition,desc,rslt,newPos,re,macrosRE;
 var k,flag1,rslt_replaced,founds,foundsCnt;

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
      //rslt=regExps[i].exec(s);

      regExps[i].lastIndex=s1_len+(ignoreNullPosition?1:0);
      rslt=regExps[i].exec(s);

      regExps[i].lastIndex=s1_len+(ignoreNullPosition?1:0);
      saveIndex2=s1_len+(ignoreNullPosition?1:0);
      nn=s.search(regExps[i]);
      if (nn>=0) {
       regExps[i].lastIndex=saveIndex2;
       rslt=regExps[i].exec(s);
       saveIndex2=regExps[i].lastIndex;
      }
      else
       rslt=null;
      while (rslt && !checkLookBehs(i, s, rslt.index, false)) {
       saveIndex2=regExps[i].lastIndex2;
       nn=s.search(regExps[i]);
       if (nn>=0) {
        regExps[i].lastIndex=saveIndex2;
        rslt=regExps[i].exec(s);
        saveIndex2=regExps[i].lastIndex;
       } 
       else
        rslt=null;
      }
      if (rslt) {
       founds[foundsCnt]={"pos":rslt.index, "len":rslt[0].length, "re":i};
       foundsCnt++;
       //if (ignoreNullPosition ? minPos==s1_len+1 : minPos==s1_len) break;
      }
     }
     else { //itsTagRegExp[i]==true, т.е. в этой ветке ищем по теговым регэкспам
      flag1=true;
      saveIndex3=regExps[i].lastIndex;
      nn=s_html.search(regExps[i]);
      if (nn>=0) {
       regExps[i].lastIndex=saveIndex2;
       rslt=regExps[i].exec(s_html);
       saveIndex2=regExps[i].lastIndex;
      }
      else
       rslt=null;
      regExps[i].lastIndex=s1_html_len+(ignoreNullPosition?1:0);
      saveIndex2=s1_html_len+(ignoreNullPosition?1:0);
      while (flag1) {
       saveIndex2=regExps[i].lastIndex;
       nn=s_html.search(regExps[i]);
       if (nn>=0) {
        regExps[i].lastIndex=saveIndex2;
        rslt=regExps[i].exec(s_html);
        saveIndex2=s1_html_len+(ignoreNullPosition?1:0);
       }
       else
        rslt=null;
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
        }
        if (!flag1) {
         if (!checkLookBehs(i, s_html, rslt.index, true)) flag1=true;
         else {
          founds[foundsCnt]={"pos":newPos, "len":rslt_replaced.length, "re":i};
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
     if (desc!=undefined && desc!="")
      try {
       window.external.SetStatusBarText(desc);
      }
      catch(e)
       {}
     tr.moveToElementText(el);
     tr.move("character",founds[currFound]["pos"]);
     tr2=tr.duplicate();
     tr2.move("character",founds[currFound]["len"]);
     tr.setEndPoint("EndToStart",tr2);
     if (foundLen==0 && tr.move("character",1)==1) tr.move("character",-1);
     tr.select();
     return;
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
 MsgBox("От позиции курсора до конца документа ничего не найдено.");
}
