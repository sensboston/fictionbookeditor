// Скрипт «Поиск нецензурной брани+Meta» для редактора Fiction Book Editor (FBE).
// Версия 1.0
// Автор Sclex, набор RegExp-ов - 11.10.2022
//  _________________________________________________________________________

  //  _________________________________________________________________________

  //  ВАЖНО!!!
  // Скрипту можно назначить горячую клавишу (меню: Сервис-Настройки-Клавиши-Скрипты-Поиск по набору регэкспов,
  // присвоить нужную клавишу по вашему выбору)
  //  _________________________________________________________________________


function Run() {

 function init() {

  // -------------начало блока регэкспы (11.10.2022)---------------


  //  _________________________________________________________________________
  //  Поиск нецензурной брани + упоминаний Инстаграма, Фейсбука
  //  _________________________________________________________________________


  //  _________________________________________________________________________
  //  1) Ищем возможные нецензурные слова или части слов кириллицей:
  //  _________________________________________________________________________

  addRegExp("[\\x20\\xA0\\t\\n\\r\\f](бля|выбля|бляд|мля|пизд|спиз|отпизд|распизд|пезд|хуй|хуё|хуя|хую|хуле|хули|наху|оху|ахуе|похуи|похую|еб|доеб|еба|ебн|ёб|ёбн|ебён|ёба|еба|ебат|ебет|ебёт|ебу|заеб|заёб|ебош|ебск|ебтво|уеб|уёб|еби|выеб|взъеб|взьеб|въеб|вьеб|злоеб|наеб|наёб|ебен|проеб|долбоеб|долбоёб|еёб|ееб|ети|епт|ёпт|ипать|ибац|ипац|мудо|муда|мудa|муде|муди|мудн|мудя|елд)","i","Найдено: хайли-лайкли мат после пробела");
  addRegExp("^(бля|выбля|бляд|мля|пизд|спиз|отпизд|распизд|пезд|хуй|хуё|хуя|хую|хуле|хули |наху|оху|ахуе|похуи|похую|еб|доеб|еба|ебн|ёб|ёбн|ебён|ёба|еба|ебат|ебет|ебёт|ебу|заеб|заёб|ебош|ебск|ебтво|уеб|уёб|еби|выеб|взъеб|взьеб|въеб|вьеб|злоеб|наеб|наёб|ебен|проеб|долбоеб|долбоёб|еёб|ееб|ети|епт|ёпт|ипать|ибац|ипац|мудо|муда|мудa|муде|муди|мудн|мудя|елд)","i","Найдено: хайли-лайкли мат в начале строки");
  addRegExp("[а-яё]{1,}(выбля|бляд|пизд|спиз|отпизд|распизд|пезд|хуя|хуё|наху|охуе|похуи|ееба|уебат|аебат|оебат|оёб|иебать|доеб|ёбн|рёба|ебуч|аеб|аёб|уеб|ебич|ебис|выеб|взъеб|взьеб|въеб|вьеб|злоеб|наеб|наёб|ъеб|ьеб|ебенн|ебенс|оебен|долбоеб|долбоёб|еёб|ееб|оеб|хаеб|хаёб|ёпт|ибац|ипац|мудо|муда|муде|муди|мудн|мандет)","i","Найдено: хайли-лайкли матерные корни слова");


  addRegExp("^(манда)([абвгдеёжзийклмнопсуфхцчшщъыьэюя])","i","Найдено: хайли-лайкли мат в начале строки - не мандарины, мандолины, мандаты");
  addRegExp("([^стр]){1,}(ахуй|ахуе|ахую)","i","Найдено: хайли-лайкли матерные корни - хуй, но не страхуем");
  addRegExp("([^иу]){1,}(ахуй|ахуе|ахую)","i","Найдено: хайли-лайкли матерные корни - хуй, но не тихую, сухую");
  addRegExp("([^страиу]){1,}([^и])([^и])(хуй|хуе|хую)","i","Найдено: хайли-лайкли матерные корни - нехуй и т.п.");
  addRegExp("([^луч]){1,}(ёб|еб)","i","Найдено: хайли-лайкли матерные корни - еб-ёб, но не учеба, прихлебывать");


  //  _________________________________________________________________________
  //  2) Ищем возможные скрытые нецензурные слова с латиницей или с цифрами:
  //  _________________________________________________________________________

  addRegExp("[\\x20\\xA0\\t\\n\\r\\f](6ля|xуй|xуя|xуе|хуe|xуё|хyё|хyй|хyя|хyе|хуе|хуи|xуле|xули|xyле|xyли|xер|наxу|наxер|оxу|аxуе|пиzд|пи3д|е6а|е6н|ё6|ё6н|е6ён|ё6а|е6а|е6ет|е6ёт|е6у|е6л|eбла|е6к|ё6л|ё6к|зае6|заё6|е6ош|е6ск|е6тво|е6ен)","i","Найдено: хайли-лайкли скрытый мат с латиницей или цифрами после пробела");
  addRegExp("^(6ля|xуй|xуя|xуе|xуё|хyй|хyя|хyе|хуе|хуe|хyё|хуи|xуле|xули|xyле|xyли|xер|наxу|наxер|оxу|аxуе|пиzд|пи3д|е6а|е6н|ё6|ё6н|е6ён|ё6а|е6а|е6ет|е6ёт|е6у|е6л|eбла|е6к|ё6л|ё6к|зае6|заё6|е6ош|е6ск|е6тво|е6ен)","i","Найдено: хайли-лайкли скрытый мат с латиницей или цифрами в начале строки");
  addRegExp("[а-яё]{1,}(6ля|xуй|xуя|xуе|xуё|хyя|xуле|xули|xyле|xyли|xер|наxу|наxер|оxу|аxуе|пиzд|пи3д|е6а|е6н|ё6|ё6н|е6ён|ё6а|е6а|е6ет|е6ёт|е6у|е6л|eбла|е6к|ё6л|ё6к|зае6|заё6|е6ош|е6ск|е6тво|е6ен|хае6)","i","Найдено: хайли-лайкли матерные корни слова с латиницей или цифрами в начале строки");

   //  _________________________________________________________________________
  //  3) Ищем возможные "запиканные" нецензурные слова (*#):
  //  _________________________________________________________________________
  
  addRegExp("[\\x20\\xA0\\t\\n\\r\\f](бл#|выбл#|бл#д|мл#|п#зд|сп#з|отп#зд|расп#зд|х#й|х#я|х#ле|х#ли|нах#|ох#|ах#е|е#а|е#н|ё#|ё#н|е#ён|ё#а|е#а|е#ет|е#ёт|е#у|е#л|е#к|ё#л|ё#к|зае#|заё#|е#ош|е#ск|е#тво|е#ен|у#б|е#и|вы#б|взъ#б|взь#б|въ#б|вь#б|зло#б|на#б|про#б|долбо#б|долбо#б|мудо|м#да|м#ди|м#нд|е#д)","i","Найдено: хайли-лайкли 'запиканный' мат с решеткой после пробела");
  addRegExp("^(бл#|выбл#|бл#д|мл#|п#зд|сп#з|отп#зд|расп#зд|х#й|х#я|х#ле|х#ли|нах#|ох#|ах#е|е#а|е#н|ё#|ё#н|е#ён|ё#а|е#а|е#ет|е#ёт|е#у|зае#|заё#|е#ош|е#ск|е#тво|у#б|е#и|вы#б|взъ#б|взь#б|въ#б|вь#б|зло#б|на#б|еб#н|про#б|долбо#б|долбо#б|м#до|м#да|м#ди|м#нд|е#д)","i","Найдено: хайли-лайкли 'запиканный' мат с решеткой в начале строки");
  addRegExp("[а-яё]{1,}(выбл#|бл#д|п#зд|сп#з|отп#зд|расп#зд|е#ба|х#й|х#я|нах#|ох#е|ах#е|ё#н|р#ба|е#уч|за#б|за#б|у#б|е#ич|е#бис|вы#б|взъ#б|взь#б|въ#б|вь#б|зло#б|на#б|ъ#б|ь#б|е#енн|е#енс|долбо#б|долбо#б|м#до|м#да|м#ди)","i","Найдено: хайли-лайкли 'запиканный' мат с решеткой в корне слова");
  
  addRegExp("[\\x20\\xA0\\t\\n\\r\\f](бл[\*]|выбл[\*]|бл[\*]д|мл[\*]|п[\*]зд|сп[\*]з|отп[\*]зд|расп[\*]зд|х[\*]й|х[\*]я|х[\*]ле|х[\*]ли |нах[\*]|ох[\*]|ах[\*]е|е[\*]а|е[\*]н|ё[\*]|ё[\*]н|е[\*]ён|ё[\*]а|е[\*]а|е[\*]ет|е[\*]ёт|е[\*]у|е[\*]л|е[\*]к|ё[\*]л|ё[\*]к|зае[\*]|заё[\*]|е[\*]ош|е[\*]ск|е[\*]тво|е[\*]ен|у[\*]б|е[\*]и|вы[\*]б|взъ[\*]б|взь[\*]б|въ[\*]б|вь[\*]б|зло[\*]б|на[\*]б|про[\*]б|долбо[\*]б|долбо[\*]б|мудо|м[\*]да|м[\*]ди|м[\*]нд|е[\*]д)","i","Найдено: хайли-лайкли 'запиканный' мат со звездочкой после пробела");
  addRegExp("^(бл[\*]|выбл[\*]|бл[\*]д|мл[\*]|п[\*]зд|сп[\*]з|отп[\*]зд|расп[\*]зд|х[\*]й|х[\*]я|х[\*]ле|х[\*]ли|нах[\*]|ох[\*]|ах[\*]е|е[\*]а|е[\*]н|ё[\*]|ё[\*]н|е[\*]ён|ё[\*]а|е[\*]а|е[\*]ет|е[\*]ёт|е[\*]у|зае[\*]|заё[\*]|е[\*]ош|е[\*]ск|е[\*]тво|у[\*]б|е[\*]и|вы[\*]б|взъ[\*]б|взь[\*]б|въ[\*]б|вь[\*]б|зло[\*]б|на[\*]б|еб[\*]н|про[\*]б|долбо[\*]б|долбо[\*]б|м[\*]до|м[\*]да|м[\*]ди|м[\*]нд|е[\*]д)","i","Найдено: хайли-лайкли 'запиканный' мат со звездочкой в начале строки");
  addRegExp("[а-яё]{1,}(выбл[\*]|бл[\*]д|п[\*]зд|сп[\*]з|отп[\*]зд|расп[\*]зд|е[\*]ба|х[\*]й|х[\*]я|нах[\*]|ох[\*]е|ах[\*]е|ё[\*]н|р[\*]ба|е[\*]уч|за[\*]б|за[\*]б|у[\*]б|е[\*]ич|е[\*]бис|вы[\*]б|взъ[\*]б|взь[\*]б|въ[\*]б|вь[\*]б|зло[\*]б|на[\*]б|ъ[\*]б|ь[\*]б|е[\*]енн|е[\*]енс|долбо[\*]б|долбо[\*]б|м[\*]до|м[\*]да|м[\*]ди)","i","Найдено: хайли-лайкли 'запиканный' мат со звездочкой в корне слова");
    
   //  _________________________________________________________________________
  //  4) Ищем возможные нецензурные слова на английском:
  //  _________________________________________________________________________
  
  addRegExp("[\\x20\\xA0\\t\\n\\r\\f](fuck|motherfuck|cunt|twat|twunt|cock|dick|bellend|knob|prick|beaver|clunge|pussy|snatch|punani|gash|minge)","i","Найдено: хайли-лайкли англосаксонский мат после пробела");
  addRegExp("^(fuck|motherfuck|cunt|twat|twunt|cock|dick|bellend|knob|prick|beaver|clunge|pussy|snatch|punani|gash|minge)","i","Найдено: хайли-лайкли англосаксонский мат в начале строки");
    
  //  _________________________________________________________________________
  //  5) Ищем упоминания Инстаграма, Фейсбука, корпорации Meta (Мета):
  //  _________________________________________________________________________
  
    addRegExp("[\\x20\\xA0\\t\\n\\r\\f](inst|faceb|инста|инсту|инсте|инсты|инсто|фейсб|ф-бу)([^лн])","i","Найдено: Фейсбук, Инстаграм - запрещенные организации в РФ, после пробела");
	addRegExp("^(inst|faceb|инста|инсту|инсте|инсты|инсто|фейсб|ф-бу)([^лн])","i","Найдено: Фейсбук, Инстаграм - запрещенные организации в РФ, в начале строки");
    addRegExp("[\\x20\\xA0\\t\\n\\r\\f](Meta|Мета |Мета,)([^лн])","","Найдено: название корпорации Meta - запрещенной организации в РФ, после пробела");
    addRegExp("^(Meta|Мета)([^лн])","","Найдено: название корпорации Meta - запрещенной организации в РФ, в начале строки");

  // -------------конец блока регэкспы (11.10.2022):---------------



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
 var re,inTags,ss,tagFlag,s_len,rslt,ff,offset;
 var level,ch,begin,lookBeh,lookBehCnt,ii,limit,rslt_;
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
   errorList+=(errorList==""?"":"\n")+"  addRegExp(\""+re_+"\",\""+keys+"\",\""+desc+"\",\""+inWhatTags+"\"";
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
   errorList+=(errorList==""?"":"\n")+"  tagRegExp(\""+re_+"\",\""+keys+"\",\""+desc+"\",\""+inWhatTags+"\"";
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
   rslt_=lookBehinds[reNum][ff].exec(s);
   while (rslt_ && rslt_.index+rslt_[0].length!=s_len) {
  rslt_=lookBehinds[reNum][ff].exec(s);
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
  var s1=tr2.htmlText.replace(/\s{2,}/g," ");
  var s1_len2=s1.length;
  var s2=el.innerHTML;
  var k1=0;
  var k1=s1.search(/(<\/[^<>]+>)+$/);
  if (k1==-1) {
  s1_html_len=s1_len2;
  } 
  else {
   while (k1<s1_len2 && s1.charAt(k1)==s2.charAt(k1)) k1++;
   s1_html_len=k1;
  }
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
   while (rslt && !checkLookBehs(i, s, rslt.index, false)) rslt=regExps[i].exec(s);
   if (rslt) {
  founds[foundsCnt]={"pos":rslt.index, "len":rslt[0].length, "re":i};
  foundsCnt++;
  //if (ignoreNullPosition ? minPos==s1_len+1 : minPos==s1_len) break;
   }
  }
  else { //its tagRegExp[i]==true, т.е. в этой ветке ищем по теговым регэкспам
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
