function Run() {

 var addSpaceBeforeNoteInBrackets=true;

 var versionStr="Перенос одного примечания в скобки v1.0. Автор Sclex."
 var myId,elem,elem2,bodyName,htmlStr1,htmlStr2,blockTag,pTag,insideWhatTag;
 var elem4,myHtmlStr,collectedText,aInnerText,range1,range2,bTag1,bTag2,firstP;
 var movedNotesCnt,elem5;
 var range=document.body.createTextRange();
 var re0=new RegExp("<B id=sclexOneNoteIntoBrackets1></B>.*?<B id=sclexOneNoteIntoBrackets2></B>","i");
 var re1=new RegExp("($\\d)","g");
 var re1_="\\$1"
 var ltRegExp=new RegExp("<","g");
 var ltRegExp_="&lt;";
 var gtRegExp=new RegExp(">","g");
 var gtRegExp_="&gt;";
 var ampRegExp=new RegExp(">","g");
 var ampRegExp_="&gt;";
 var movedNotesCnt=0;
 
 function getLocalHref(name) {
  var i=1;
  var name1=name;
  var thg2=new RegExp("#");
  if (name1.search(thg2)==-1) {return(null)} //ссылка не может начинаться с 1
  var thg=new RegExp("main\.html\#","i");
  srch10=name1.search(thg);
  if (srch10==-1) {
   name1 = name1.substring(1,name1.length);
  } else {
   name1 = name1.substring(srch10+10,name1.length);
  }
  return(name1);
 }

 function getOpeningTag(myTag) {
  if (myTag.nodeName=="I" || myTag.nodeName=="EM" || myTag.nodeName=="B" ||
      myTag.nodeName=="STRONG" || myTag.nodeName=="SUP" || myTag.nodeName=="SUB" ||
      myTag.nodeName=="STRIKE") return "<"+myTag.nodeName+">";
  if (myTag.nodeName=="SPAN" && myTag.className=="code") return "<SPAN class=code>";
  if (myTag.nodeName=="A" && myTag.className!="note") return "<A href='"+myTag.href+"'>";
  return "";
 }

 function getClosingTag(myTag) {
  if (myTag.nodeName=="I" || myTag.nodeName=="EM" || myTag.nodeName=="B" ||
      myTag.nodeName=="STRONG" || myTag.nodeName=="SUP" || myTag.nodeName=="SUB" ||
      myTag.nodeName=="STRIKE") return "</"+myTag.nodeName+">";
  if (myTag.nodeName=="SPAN" && myTag.className=="code") return "</SPAN>";
  if (myTag.nodeName=="A" && myTag.className!="note") return "</A>";
  return "";
 }

 function unifyNotes() {
  var Ts=new Date().getTime();
  var commentRegExp=new RegExp("^c_",""); 
  //НАСТРОЙКИ - начало
  //здесь шаблоны, которые используются при работе скрипта
  //используйте макрос %N для указания номера примечания
  var strConst1="n_%N"; //шаблон ID разделов примечаний
  var strConst2="%N";//шаблон заголовка примечания
  var strConst3="";//шаблон содержания вставленного примечания
  var strConst4="[%N]"; //шаблон текста ссылки
  var strConst5="Примечания"; //шаблон заголовка боди нотесов
  var strConst6="notes"; //имя раздела примечаний
  var strConst7="Note adding";
  //функция, которая определяет, является ли элемент el, который
  //заведомо является ссылкой, ссылкой на тот тип примечаний,
  //который обрабатывается данным скриптом
  var isItNote=function (el) {return el.className=="note" ? true : false};
  var makeNoteFromHref=function (el) {el.className="note"};
  // выводить ли окно, извещающее о конце работы скрипта?
  // true - выводить. false - не выводить
  var EndWindow=true;
  //добавлять ли новую сноску или только провести работы по упорядочению существующих
  //true - добавлять. false - не добавлять
  var addSnoska=false;
  //показывать ли форму для ввода текста примечания
  //true - показывать. false - не показывать
  var InputSnoskaText=false;
  //перемещать ли фокус видимости на раздел свежесозданного примечания
  var MoveFocusToNote=false;
  //true, если это скрипт добавления последней сноски
  var lastSnoskaMode=false;
  //режим ускоренной работы
  var forsazh=false;
  //НАСТРОЙКИ - конец
  
  // функция находит номер комментария, соответствующего определенному имени раздела
  // в исходном документе. В name передаем имя раздела, перед ним символ #, если это
  // локальная ссылка. В SectID передаем массив имен разделов.
  function findNum(name) {
    var i=1;
    var name1=name;
    var thg2=new RegExp("#");
    if (name1.search(thg2)==-1) {return(-1)}
    var thg=new RegExp("main\.html\#","i");
    srch10=name1.search(thg);
    if (srch10==-1) name1 = name1.substring(1);
    else name1 = name1.substring(srch10+10);
    while (i<=sectNum && sectIds[i]!=name1) i++;
    if (i>sectNum) {return(-1)}
    return(i);
  }
  
  function PoShablonu(s,n) {
    var ttt3 = new RegExp("\%N");
    return(s.replace(ttt3,n));
  }
  
  function getLocalHref(name) {
    var i=1;
    var name1=name;
    var thg2=new RegExp("#");
    if (name1.search(thg2)==-1) {return(-1)} //ссылка не может начинаться с 1
    var thg=new RegExp("main\.html\#","i");
    srch10=name1.search(thg);
    if (srch10==-1) {
     name1 = name1.substring(1,name1.length);
    } else {
     name1 = name1.substring(srch10+10,name1.length);
    }
    return(name1);
  } 
 
  
  function makeGoodSnoska (snoskaTextSrc) {
     snoskaText="<P>"+snoskaTextSrc+"</P>";
     var ffg1=new RegExp("<b>","gi");
     snoskaText=snoskaText.replace(ffg1,"<STRONG>");
     ffg1=new RegExp("</b>","gi");
     snoskaText=snoskaText.replace(ffg1,"</STRONG>");
     ffg1=new RegExp("<i>","gi");
     snoskaText=snoskaText.replace(ffg1,"<EM>");
     ffg1=new RegExp("</i>","gi");
     snoskaText=snoskaText.replace(ffg1,"</EM>");
     ffg1=new RegExp("<emphasis>","gi");
     snoskaText=snoskaText.replace(ffg1,"<EM>");
     ffg1=new RegExp("</emphasis>","gi");
     snoskaText=snoskaText.replace(ffg1,"</EM>");
     ffg1=new RegExp("<strong>","gi");
     snoskaText=snoskaText.replace(ffg1,"<STRONG>");
     ffg1=new RegExp("</strong>","gi");
     snoskaText=snoskaText.replace(ffg1,"</STRONG>");
     ffg1=new RegExp("<sup>","gi");
     snoskaText=snoskaText.replace(ffg1,"<SUP>");
     ffg1=new RegExp("</sup>","gi");
     snoskaText=snoskaText.replace(ffg1,"</SUP>");
     ffg1=new RegExp("<sub>","gi");
     snoskaText=snoskaText.replace(ffg1,"<SUB>");
     ffg1=new RegExp("</sub>","gi");
     snoskaText=snoskaText.replace(ffg1,"</SUB>");
     ffg1=new RegExp("<br>","gi");
     snoskaText=snoskaText.replace(ffg1,"</P>\n<P>");
     return snoskaText;
  }
  
  function getRandomNum(n) {
   var s="";
   for (var i=1;i<=n;i++) {
     s=s+Math.floor(Math.random()*10);
   }
   return s;
  } 
  
  var body=document.getElementById("fbw_body");
  var whileFlag,hhh,nashliBodyNotes,bodyNotes,el,insertN,uic,i3,newSnoskaNum,tmpVar;
  if (!body) {MsgBox("ошибка. body не найден!"); return;}
  var insertCnt=1;
 //следующие строки нужно раскомментировать, чтобы восстановить
 //запрос параметров для вставки сноски
 //ОТСЮДА
 /*
  strConst1=prompt("Шаблон ID раздела примечания. Используйте макрос %N"+
                   " для указания номера раздела.",strConst1);
  strConst4=prompt("Шаблон текста ссылки. Используйте макрос %N"+
                   " для указания номера раздела.",strConst4);
  strConst2=prompt("Шаблон заголовка примечания. Используйте макрос %N"+
                   " для указания номера раздела",strConst2);
  strConst3=prompt("Шаблон содержания новых разделов примечаний. Используйте макрос %N"+
                   " для указания номера раздела.",strConst3);
 */
 //ДОСЮДА
  el=body.firstChild;
  nashliBodyNotes=false;
  whileFlag=true;
  while (el)
   if (el.className=="body" && el.getAttribute("fbname")==strConst6) {
    nashliBodyNotes=true;    
    bodyNotes=el;    
    break;
   } else el=el.nextSibling;
  //вставляем ссылку на наше примечание
  if (addSnoska) document.selection.createRange().pasteHTML('<A href="A">Sclex_Note</A>');
 //если нет боди нотесов, создадим его
  if (!nashliBodyNotes) {
   el=document.createElement("DIV");
   el.className="body";
   el.setAttribute("xlmns:l","http://www.w3.org/1999/xlink");
   el.setAttribute("xlmns:f","http://www.gribuser.ru/xml/fictionbook/2.0");
   el.setAttribute("fbname",strConst6);
   el.innerHTML="<DIV class=title><P>"+strConst5+"</P></DIV>";
   bodyNotes=body.appendChild(el);
  } 
 //создадим заголовок боди нотесов, если нет его
  if (!forsazh) {
   var bbb=bodyNotes.firstChild;
   var flag4=true;
   while (flag4 && !(bbb.nodeName=="DIV" && (bbb.className=="section" || bbb.className=="epigraph" || bbb.className=="title")))
    if (bbb.nextSibling) bbb=bbb.nextSibling;
    else flag4=false;
   if (flag4) { 
    if (bbb.className!="title") {
     el=document.createElement("DIV");
     el.className="title";
     el.innerHTML="<P>"+strConst5+"</P>";
     bbb.parentNode.insertBefore(el,bbb);
    }
   } else {
    if (bbb.className!="title") {
     el=document.createElement("DIV");
     el.className="title";
     el.innerHTML="<P>"+strConst5+"</P>";   
     bodyNotes.appendChild(el);
    }
   }
   bbb=undefined;
  }
 //прочитаем в массив SectID ID-ы разделов примечаний
  var sectsColl=new Object();
  var sectIds=new Object();
  var sectNumById=new Object();
  var sectNum=0;
  if (!forsazh) {
   var ccc=bodyNotes.firstChild;
   while (ccc!=null) {
    if (ccc.nodeName=="DIV" && ccc.className=="section") {
     sectNum++;
     sectsColl[sectNum]=ccc;  
     sectIds[sectNum]=ccc.id;
     sectNumById[ccc.id]=sectNum;
    }
    ccc=ccc.nextSibling;
   }
  } 
  //определяем номер нашей сноски
  if (addSnoska) {
   j5=0;   while (true)
    if (j5<document.links.length)
     if (document.links[j5].innerHTML!="Sclex_Note") j5++;
     else break;
    else break; 
   if (j5==document.links.length) {
    MsgBox("Ошибка. Вставленная временная ссылка сноски не найдена.");
    return;
   }
   newSnoskaNum=j5;
   if (lastSnoskaMode) {
    var it7=newSnoskaNum+1;
    while (it7<document.links.length)
     if (isItNote(document.links[it7])==false) it7++;
     else break;
    if (it7<document.links.length) {
     document.links[newSnoskaNum].removeNode(true);
     MsgBox("Ошибка. Это получается не последняя сноска в документе!");
     return;
    }
   }
   var j6=newSnoskaNum-1;
   while (j6>=0 && isItNote(document.links[j6])==false) j6--;
   if (!forsazh && j6>=0) {
    var abc=getLocalHref(document.links[j6].href);
    if (abc!=-1) insertN=sectNumById[abc];
    if (abc==-1 || insertN==undefined) {
     document.links[newSnoskaNum].removeNode(true);
     MsgBox("Не удается по ссылке перед вставляемой определить номер вставляемого примечания.");
     return;                                          1
    }
    insertN++;
   } else insertN=1;
   if (insertN==0) {insertN=1}
   makeNoteFromHref(document.links[newSnoskaNum]);
   if (!forsazh) {
    document.links[newSnoskaNum].innerHTML=PoShablonu(strConst4,insertN)
    document.links[newSnoskaNum].href="#"+PoShablonu(strConst1,insertN);
   } else {
    insertN=""; 
    newSnoskaId=getRandomNum(32);  
    document.links[newSnoskaNum].innerHTML=PoShablonu(strConst4,"*");
    document.links[newSnoskaNum].href="#"+PoShablonu(strConst1,newSnoskaId);
   }
  } else {insertN=1000000; insertCnt=0}
 //проверим, нет ли в боди нотесов разделов второго уровня вложения
  if (!forsazh) {
   var ptr1=bodyNotes.firstChild
   var ptr2;
   while (ptr1) {
    if (ptr1.nodeName=="DIV" && ptr1.className=="section") {
      ptr2=ptr1.firstChild;
      while (ptr2) {
       if (ptr2.nodeName=="DIV") {
         if (ptr2.className=="section") {
          MsgBox("В body примечаний есть разделы второго уровня вложения. Такие файлы не обрабатываются данным скриптом. Работа скрипта завершена.");
          document.links[newSnoskaNum].removeNode(true);
          return;
         }
       }
       ptr2 = ptr2.nextSibling;
      }
    }
    ptr1 = ptr1.nextSibling;
   }
  }
  //поменяем ID у разделов примечаний
  if (nashliBodyNotes && !lastSnoskaMode) {
   //for (var j1=1; j1<=sectNum; j1++)
   // sectsColl[j1].id=undefined; 
   for (var j1=1; j1<=sectNum; j1++) {
    tmpVar=PoShablonu(strConst1,j1>=insertN ? j1+insertCnt : j1);
    if (sectsColl[j1].id!=tmpVar) sectsColl[j1].id=tmpVar;
   }
  }  
  //анализируем все ссылки документа
  if (!lastSnoskaMode) {
   for (j2=0; j2<document.links.length; j2++) {
   //if (document.links[j2].className=="note") {
     //MsgBox("Свойство href: "+document.links[j2].href+"\n"+
     //"findNum: "+findNum(document.links[j2].href));
    if (addSnoska && j2==newSnoskaNum) {uic=insertN}
    else uic=sectNumById[getLocalHref(document.links[j2].href)];
    if (uic!=undefined && j2!=newSnoskaNum) {
      //меняем адрес ссылки
      if (uic>=insertN) uic++;
      tmpVar="#"+PoShablonu(strConst1,uic);
      if (document.links[j2].href!=tmpVar && document.links[j2].href!=window.location.href+tmpVar)
       document.links[j2].href=tmpVar;
      //меняем текст ссылки
      tmpVar=PoShablonu(strConst4,uic);
      if (document.links[j2].innerHTML!=tmpVar)
       document.links[j2].innerHTML=tmpVar;
    }
   }
  }
  // поменяем заголовки разделов примечаний
  if (nashliBodyNotes && !lastSnoskaMode) 
   for (i2=1;i2<=sectNum;i2++) {
    if (sectsColl[i2].firstChild!=null) 
     if (sectsColl[i2].firstChild.nodeName=="DIV" && sectsColl[i2].firstChild.className=="title") {
      var tmpVar="<P>"+PoShablonu(strConst2,i2>=insertN ? i2+insertCnt : i2)+"</P>";
      if (sectsColl[i2].firstChild.innerHTML!=tmpVar) sectsColl[i2].firstChild.innerHTML=tmpVar;
     }
     else {
      el=document.createElement("DIV");
      el.className="title";
      el.innerHTML="<P>"+PoShablonu(strConst2,i2>=insertN ? i2+insertCnt : i2)+"</P>";
      sectsColl[i2].insertBefore(el,sectsColl[i2].firstChild);
     } 
    else {
     el=document.createElement("DIV");
     el.className="title";
     el.innerHTML="<P>"+PoShablonu(strConst2,i2>=insertN ? i2+insertCnt : i2)+"</P>";   
     sectsColl[i2].appendChild(el);
    } 
   }
  if (!forsazh) {
   var MyTitle=PoShablonu(strConst2,insertN);
   var MyId1=PoShablonu(strConst1,insertN);
  } else {
   var MyTitle="&nbsp;";
   var MyId1=PoShablonu(strConst1,newSnoskaId);
  };
  //вставим новый раздела примечания
  el=document.createElement("DIV");
  el.id=MyId1;
  el.className="section";
  if (InputSnoskaText) el.innerHTML="<DIV class=title><P>"+MyTitle+"</P></DIV>"+snoskaText;
  else el.innerHTML="<DIV class=title><P>"+MyTitle+"</P></DIV><P>"+PoShablonu(strConst3,insertN)+"</P>";
  if (addSnoska) 
   if (!lastSnoskaMode)
    if (sectNum>0) 
     if (insertN>1) el=bodyNotes.insertBefore(el,sectsColl[insertN-1].nextSibling);
     else el=bodyNotes.insertBefore(el,sectsColl[1]);
    else el=bodyNotes.appendChild(el); 
   else el=bodyNotes.appendChild(el);
  if (strConst3=="") window.external.inflateBlock(el.lastChild)=true;     
  if (MoveFocusToNote) {
   var NewSectCnt=0;
   var j7=0;
   el2=el.firstChild;
   whileFlag=true;
   while (whileFlag)
    if (el2) 
     if (el2.nodeName=="P") { 
      GoTo(el2);
      whileFlag=false;
     } else el2=el2.nextSibling;    else whileFlag=false;
   if (el2=null && el.firstChild!=null) GoTo(el.firstChild);
  }
  if (bodyNotes.firstChild && bodyNotes.firstChild.nodeName=="DIV" &&
      bodyNotes.firstChild.className=="title" && !bodyNotes.firstChild.nextSibling)
   bodyNotes.removeNode(true);
 }

 function unifyComments() {
  var Ts=new Date().getTime();
  var commentRegExp=new RegExp("^c_",""); 
  //НАСТРОЙКИ - начало
  //здесь шаблоны, которые используются при работе скрипта
  //используйте макрос %N для указания номера примечания
  var strConst1="c_%N"; //шаблон ID разделов примечаний
  var strConst2="%N";//шаблон заголовка примечания
  var strConst3="";//шаблон содержания вставленного примечания
  var strConst4="<SUP>{%N}</SUP>"; //шаблон текста ссылки
  var strConst5="Комментарии"; //шаблон заголовка боди нотесов
  var strConst6="comments"; //имя раздела примечаний
  var strConst7="Comment adding";
  //функция, которая определяет, является ли элемент el, который
  //заведомо является ссылкой, ссылкой на тот тип примечаний,
  //который обрабатывается данным скриптом
  var isItNote=function (el) {return getLocalHref(el.href).toString().search(commentRegExp)>=0 ? true : false};
  var makeNoteFromHref=function (el) {};
  // выводить ли окно, извещающее о конце работы скрипта?
  // true - выводить. false - не выводить
  var EndWindow=true;
  //добавлять ли новую сноску или только провести работы по упорядочению существующих
  //true - добавлять. false - не добавлять
  var addSnoska=false;
  //показывать ли форму для ввода текста примечания
  //true - показывать. false - не показывать
  var InputSnoskaText=false;
  //перемещать ли фокус видимости на раздел свежесозданного примечания
  var MoveFocusToNote=false;
  //true, если это скрипт добавления последней сноски
  var lastSnoskaMode=false;
  //режим ускоренной работы
  var forsazh=false;
  //НАСТРОЙКИ - конец
  
  // функция находит номер комментария, соответствующего определенному имени раздела
  // в исходном документе. В name передаем имя раздела, перед ним символ #, если это
  // локальная ссылка. В SectID передаем массив имен разделов.
  function findNum(name) {
    var i=1;
    var name1=name;
    var thg2=new RegExp("#");
    if (name1.search(thg2)==-1) {return(-1)}
    var thg=new RegExp("main\.html\#","i");
    srch10=name1.search(thg);
    if (srch10==-1) name1 = name1.substring(1);
    else name1 = name1.substring(srch10+10);
    while (i<=sectNum && sectIds[i]!=name1) i++;
    if (i>sectNum) {return(-1)}
    return(i);
  }
  
  function PoShablonu(s,n) {
    var ttt3 = new RegExp("\%N");
    return(s.replace(ttt3,n));
  }
  
  function getLocalHref(name) {
    var i=1;
    var name1=name;
    var thg2=new RegExp("#");
    if (name1.search(thg2)==-1) {return(-1)} //ссылка не может начинаться с 1
    var thg=new RegExp("main\.html\#","i");
    srch10=name1.search(thg);
    if (srch10==-1) {
     name1 = name1.substring(1,name1.length);
    } else {
     name1 = name1.substring(srch10+10,name1.length);
    }
    return(name1);
  } 
  
 function makeGoodSnoska (snoskaTextSrc) {
     snoskaText="<P>"+snoskaTextSrc+"</P>";
     var ffg1=new RegExp("<b>","gi");
     snoskaText=snoskaText.replace(ffg1,"<STRONG>");
     ffg1=new RegExp("</b>","gi");
     snoskaText=snoskaText.replace(ffg1,"</STRONG>");
     ffg1=new RegExp("<i>","gi");
     snoskaText=snoskaText.replace(ffg1,"<EM>");
     ffg1=new RegExp("</i>","gi");
     snoskaText=snoskaText.replace(ffg1,"</EM>");
     ffg1=new RegExp("<emphasis>","gi");
     snoskaText=snoskaText.replace(ffg1,"<EM>");
     ffg1=new RegExp("</emphasis>","gi");
     snoskaText=snoskaText.replace(ffg1,"</EM>");
     ffg1=new RegExp("<strong>","gi");
     snoskaText=snoskaText.replace(ffg1,"<STRONG>");
     ffg1=new RegExp("</strong>","gi");
     snoskaText=snoskaText.replace(ffg1,"</STRONG>");
     ffg1=new RegExp("<sup>","gi");
     snoskaText=snoskaText.replace(ffg1,"<SUP>");
     ffg1=new RegExp("</sup>","gi");
     snoskaText=snoskaText.replace(ffg1,"</SUP>");
     ffg1=new RegExp("<sub>","gi");
     snoskaText=snoskaText.replace(ffg1,"<SUB>");
     ffg1=new RegExp("</sub>","gi");
     snoskaText=snoskaText.replace(ffg1,"</SUB>");
     ffg1=new RegExp("<br>","gi");
     snoskaText=snoskaText.replace(ffg1,"</P>\n<P>");
     return snoskaText;
  }
  
  function getRandomNum(n) {
   var s="";
   for (var i=1;i<=n;i++) {
     s=s+Math.floor(Math.random()*10);
   }
   return s;
  } 
  
  var body=document.getElementById("fbw_body");
  var whileFlag,hhh,nashliBodyNotes,bodyNotes,el,insertN,uic,i3,newSnoskaNum;
  if (!body) {MsgBox("ошибка. body не найден!"); return;}
  var insertCnt=1;
 //следующие строки нужно раскомментировать, чтобы восстановить
 //запрос параметров для вставки сноски
 //ОТСЮДА
 /*
  strConst1=prompt("Шаблон ID раздела примечания. Используйте макрос %N"+
                   " для указания номера раздела.",strConst1);
  strConst4=prompt("Шаблон текста ссылки. Используйте макрос %N"+
                   " для указания номера раздела.",strConst4);
  strConst2=prompt("Шаблон заголовка примечания. Используйте макрос %N"+
                   " для указания номера раздела.",strConst2);
  strConst3=prompt("Шаблон содержания новых разделов примечаний. Используйте макрос %N"+
                   " для указания номера раздела.",strConst3);
 */
 //ДОСЮДА
  el=body.firstChild;
  nashliBodyNotes=false;
  whileFlag=true;
  while (el)
   if (el.className=="body" && el.getAttribute("fbname")==strConst6) {
    nashliBodyNotes=true;    
    bodyNotes=el;    
    break;
   } else el=el.nextSibling;
  //вставляем ссылку на наше примечание
  if (addSnoska) document.selection.createRange().pasteHTML('<A href="A">Sclex_Note</A>');
 //если нет боди нотесов, создадим его
  if (!nashliBodyNotes) {
   el=document.createElement("DIV");
   el.className="body";
   el.setAttribute("xlmns:l","http://www.w3.org/1999/xlink");
   el.setAttribute("xlmns:f","http://www.gribuser.ru/xml/fictionbook/2.0");
   el.setAttribute("fbname",strConst6);
   el.innerHTML="<DIV class=title><P>"+strConst5+"</P></DIV>";
   bodyNotes=body.appendChild(el);
  } 
 //создадим заголовок боди нотесов, если нет его
  if (!forsazh) {
   var bbb=bodyNotes.firstChild;
   var flag4=true;
   while (flag4 && !(bbb.nodeName=="DIV" && (bbb.className=="section" || bbb.className=="epigraph" || bbb.className=="title")))
    if (bbb.nextSibling) bbb=bbb.nextSibling;
    else flag4=false;
   if (flag4) { 
    if (bbb.className!="title") {
     el=document.createElement("DIV");
     el.className="title";
     el.innerHTML="<P>"+strConst5+"</P>";
     bbb.parentNode.insertBefore(el,bbb);
    }
   } else {
    if (bbb.className!="title") {
     el=document.createElement("DIV");
     el.className="title";
     el.innerHTML="<P>"+strConst5+"</P>";   
     bodyNotes.appendChild(el);
    }
   }
   bbb=undefined;
  }
 //прочитаем в массив SectID ID-ы разделов примечаний
  var sectsColl=new Object();
  var sectIds=new Object();
  var sectNumById=new Object();
  var sectNum=0;
  if (!forsazh) {
   var ccc=bodyNotes.firstChild;
   while (ccc!=null) {
    if (ccc.nodeName=="DIV" && ccc.className=="section") {
     sectNum++;
     sectsColl[sectNum]=ccc;  
     sectIds[sectNum]=ccc.id;
     sectNumById[ccc.id]=sectNum;
    }
    ccc=ccc.nextSibling;
   }
  } 
  //определяем номер нашей сноски
  if (addSnoska) {
   j5=0;   while (true)
    if (j5<document.links.length)
     if (document.links[j5].innerHTML!="Sclex_Note") j5++;
     else break;
    else break; 
   if (j5==document.links.length) {
    MsgBox("Ошибка. Вставленная временная ссылка сноски не найдена.");
    return;
   }
   newSnoskaNum=j5;
   if (lastSnoskaMode) {
    var it7=newSnoskaNum+1;
    while (it7<document.links.length)
     if (isItNote(document.links[it7])==false) it7++;
     else break;
    if (it7<document.links.length) {
     document.links[newSnoskaNum].removeNode(true);
     MsgBox("Ошибка. Это получается не последняя сноска в документе!");
     return;
    }
   }
   var j6=newSnoskaNum-1;
   while (j6>=0 && isItNote(document.links[j6])==false) j6--;
   if (!forsazh && j6>=0) {
    var abc=getLocalHref(document.links[j6].href);
    if (abc!=-1) insertN=sectNumById[abc];
    if (abc==-1 || insertN==undefined) {
     document.links[newSnoskaNum].removeNode(true);
     MsgBox("Не удается по ссылке перед вставляемой определить номер вставляемого примечания.");
     return;                                          1
    }
    insertN++;
   } else insertN=1;
   if (insertN==0) {insertN=1}
   makeNoteFromHref(document.links[newSnoskaNum]);
   if (!forsazh) {
    document.links[newSnoskaNum].innerHTML=PoShablonu(strConst4,insertN)
    document.links[newSnoskaNum].href="#"+PoShablonu(strConst1,insertN);
   } else {
    insertN=""; 
    newSnoskaId=getRandomNum(32);  
    document.links[newSnoskaNum].innerHTML=PoShablonu(strConst4,"*");
    document.links[newSnoskaNum].href="#"+PoShablonu(strConst1,newSnoskaId);
   }
  } else {insertN=1000000; insertCnt=0}
 //проверим, нет ли в боди нотесов разделов второго уровня вложения
  if (!forsazh) {
   var ptr1=bodyNotes.firstChild
   var ptr2;
   while (ptr1) {
    if (ptr1.nodeName=="DIV" && ptr1.className=="section") {
      ptr2=ptr1.firstChild;
      while (ptr2) {
       if (ptr2.nodeName=="DIV") {
         if (ptr2.className=="section") {
          MsgBox("В body примечаний есть разделы второго уровня вложения. Такие файлы не обрабатываются данным скриптом. Работа скрипта завершена.");
          document.links[newSnoskaNum].removeNode(true);
          return;
         }
       }
       ptr2 = ptr2.nextSibling;
      }
    }
    ptr1 = ptr1.nextSibling;
   }
  }
  //поменяем ID у разделов примечаний
  if (nashliBodyNotes && !lastSnoskaMode) {
   //for (var j1=1; j1<=sectNum; j1++)
   // sectsColl[j1].id=undefined; 
   for (var j1=1; j1<=sectNum; j1++) {
    tmpVar=PoShablonu(strConst1,j1>=insertN ? j1+insertCnt : j1);
    if (sectsColl[j1].id!=tmpVar) sectsColl[j1].id=tmpVar;
   }
  }  
  //анализируем все ссылки документа
  if (!lastSnoskaMode) {
   for (j2=0; j2<document.links.length; j2++) {
   //if (document.links[j2].className=="note") {
     //MsgBox("Свойство href: "+document.links[j2].href+"\n"+
     //"findNum: "+findNum(document.links[j2].href));
    if (addSnoska && j2==newSnoskaNum) {uic=insertN}
    else uic=sectNumById[getLocalHref(document.links[j2].href)];
    if (uic!=undefined && j2!=newSnoskaNum) {
      //меняем адрес ссылки
      if (uic>=insertN) uic++;
      tmpVar="#"+PoShablonu(strConst1,uic);
      if (document.links[j2].href!=tmpVar && document.links[j2].href!=window.location.href+tmpVar)
       document.links[j2].href=tmpVar;
      //меняем текст ссылки
      tmpVar=PoShablonu(strConst4,uic);
      if (document.links[j2].innerHTML!=tmpVar)
       document.links[j2].innerHTML=tmpVar;
    }
   }
  }
  // поменяем заголовки разделов примечаний
  if (nashliBodyNotes && !lastSnoskaMode) 
   for (i2=1;i2<=sectNum;i2++) {
    if (sectsColl[i2].firstChild!=null) 
     if (sectsColl[i2].firstChild.nodeName=="DIV" && sectsColl[i2].firstChild.className=="title") {
      var tmpVar="<P>"+PoShablonu(strConst2,i2>=insertN ? i2+insertCnt : i2)+"</P>";
      if (sectsColl[i2].firstChild.innerHTML!=tmpVar) sectsColl[i2].firstChild.innerHTML=tmpVar;
     }
     else {
      el=document.createElement("DIV");
      el.className="title";
      el.innerHTML="<P>"+PoShablonu(strConst2,i2>=insertN ? i2+insertCnt : i2)+"</P>";
      sectsColl[i2].insertBefore(el,sectsColl[i2].firstChild);
     } 
    else {
     el=document.createElement("DIV");
     el.className="title";
     el.innerHTML="<P>"+PoShablonu(strConst2,i2>=insertN ? i2+insertCnt : i2)+"</P>";   
     sectsColl[i2].appendChild(el);
    } 
   }
  if (!forsazh) {
   var MyTitle=PoShablonu(strConst2,insertN);
   var MyId1=PoShablonu(strConst1,insertN);
  } else {
   var MyTitle="&nbsp;";
   var MyId1=PoShablonu(strConst1,newSnoskaId);
  };
  //вставим новый раздел примечания
  el=document.createElement("DIV");
  el.id=MyId1;
  el.className="section";
  if (InputSnoskaText) el.innerHTML="<DIV class=title><P>"+MyTitle+"</P></DIV>"+snoskaText;
  else el.innerHTML="<DIV class=title><P>"+MyTitle+"</P></DIV><P>"+PoShablonu(strConst3,insertN)+"</P>";
  if (addSnoska) 
   if (!lastSnoskaMode)
    if (sectNum>0) 
     if (insertN>1) el=bodyNotes.insertBefore(el,sectsColl[insertN-1].nextSibling);
     else el=bodyNotes.insertBefore(el,sectsColl[1]);
    else el=bodyNotes.appendChild(el); 
   else el=bodyNotes.appendChild(el);
  if (strConst3=="") window.external.inflateBlock(el.lastChild)=true;     
  if (MoveFocusToNote) {
   var NewSectCnt=0;
   var j7=0;
   el2=el.firstChild;
   whileFlag=true;
   while (whileFlag)
    if (el2) 
     if (el2.nodeName=="P") { 
      GoTo(el2);
      whileFlag=false;
     } else el2=el2.nextSibling;    else whileFlag=false;
   if (el2=null && el.firstChild!=null) GoTo(el.firstChild);
  }
  if (bodyNotes.firstChild && bodyNotes.firstChild.nodeName=="DIV" &&
      bodyNotes.firstChild.className=="title" && !bodyNotes.firstChild.nextSibling)
   bodyNotes.removeNode(true);
 }

 function collectNoteText() {
  //alert("collectNoteText\nelem:\n"+elem.outerHTML);
  myHtmlStr="";
  var myEl=elem.firstChild;
  firstP=true;
  while (myEl!=null && myEl!=elem) {
   //if (myEl.nodeType==3) alert("nodeValue:\n"+myEl.nodeValue);
   //if (myEl.nodeType==1) alert("outerHTML:\n"+myEl.outerHTML);
   if (myEl.nodeName=="P") {
    if (firstP) {
     firstP=false;
    } else {
     myHtmlStr+=" // ";
    }
   }
   //переход на следующий узел дерева
   if (myEl.nodeType==3)
    myHtmlStr+=myEl.nodeValue.replace(ltRegExp,ltRegExp_).replace(gtRegExp,gtRegExp_).replace(ampRegExp,ampRegExp_);
   if (myEl.firstChild && !(myEl.parentNode==elem && myEl.className=="title")) {
    myHtmlStr+=getOpeningTag(myEl);
    myEl=myEl.firstChild;
   }
   else {
    while (myEl.nextSibling==null && myEl!=elem) {
     if (myEl.nodeType==1) myHtmlStr+=getClosingTag(myEl);
     myEl=myEl.parentNode;
    }
    if (myEl!=elem) {
     if (myEl.nodeType==1) myHtmlStr+=getClosingTag(myEl);
     myEl=myEl.nextSibling;
    }
   }
  }
  return myHtmlStr;
 }

 function moveNoteToRefPlace(a) {
  myId=getLocalHref(a.href);
  if (!myId) return;
  elem=document.getElementById(myId);
  if (!elem) return;

  //проверим, что ссылка указывает на id внутри тега section
  while (elem.className!="section" && elem.nodeName!="BODY")
   elem=elem.parentNode;
  if (elem.nodeName=="BODY") return;
  //проверим, что ссылка указывает на id в body name="notes" или "comments"
  elem5=elem;
  while (elem5.className!="body" && elem5.nodeName!="BODY")
   elem5=elem5.parentNode;
  if (elem5.nodeName=="BODY") return;
  bodyName=elem5.getAttribute("fbname");
  if (bodyName!="notes" && bodyName!="comments") return;

  //соберем теги, которые нужно закрыть перед примечанием и закрыть после него
  htmlStr1="";
  htmlStr2="";
  elem2=a.parentNode;
  //alert("elem2.outerHTML:"+elem2.outerHTML);
  while (elem2.nodeName!="P" && elem2.nodeName!="BODY") {
   htmlStr1="</"+elem2.nodeName+">"+htmlStr1;
   htmlStr2=htmlStr2+"<"+elem2.nodeName+">";
   elem2=elem2.parentNode;
  }
  if (elem2.nodeName=="BODY") return;
  //alert("htmlStr1:\n"+htmlStr1+"\nhtmlStr2:\n"+htmlStr2);
  //выясним, в каком теге находится ссылка сноски
  blockTag=a;
  insideWhatTag="";
  while (blockTag.nodeName!="DIV" && blockTag.nodeName!="BODY")
   blockTag=blockTag.parentNode;
  pTag=a;
  while (pTag.nodeName!="P" && pTag.nodeName!="BODY")
   pTag=pTag.parentNode;
  if (blockTag.nodeName=="DIV" && blockTag.className=="poem") insideWhatTag="poem";
  else if (blockTag.nodeName=="DIV" && blockTag.className=="cite") insideWhatTag="cite";
  else if (blockTag.nodeName=="DIV" && blockTag.className=="epigraph") insideWhatTag="epigraph";
  else if (pTag.className=="text-author") insideWhatTag="text-author";
  else if (pTag.className=="subtitle") insideWhatTag="subtitle";
  else insideWhatTag="p";

  collectedText=collectNoteText();
  aInnerText=a.innerText;
  //alert("range.htmlText:\n"+range.htmlText);
  bTag1=document.createElement("B");
  bTag1.id="sclexOneNoteIntoBrackets1";
  bTag2=document.createElement("B");
  bTag2.id="sclexOneNoteIntoBrackets2";
  a.parentNode.insertBefore(bTag1,a);
  a.parentNode.insertBefore(bTag2,a.nextSibling);
  //alert("fbw_body.innerHTML:\n\n"+fbw_body.innerHTML);
  pTag.outerHTML=pTag.outerHTML.replace(re0,"<B id=sclexOneNoteIntoBrackets3></B>" + 
   htmlStr1 + (addSpaceBeforeNoteInBrackets?" ":"") + (elem5.getAttribute("fbname")=="notes"?"[":"{") + collectedText.replace(re1,re1_) +
   (elem5.getAttribute("fbname")=="notes"?"]":"}")+htmlStr2);
  savePrevious=document.getElementById("sclexOneNoteIntoBrackets3");
  movedNotesCnt++;
 }

 var i,j,el,el2,wasReplace;
 wasReplace=false;
 var fbw_body=document.getElementById("fbw_body");
 window.external.BeginUndoUnit(document,"one note into brackets");
 var body=fbw_body.lastChild;
 if (document.selection.type!="Text" && document.selection.type!="None") return;
 var tr=document.selection.createRange();
 tr.collapse(true);
 tr.pasteHTML("<B id=sclexOneNoteIntoBrackets4></B>");
 el=document.getElementById("sclexOneNoteIntoBrackets4");
 if (!el) return;
 el2=el;
 while (el2 && el2.nodeName!="BODY" && !(el2.nodeName=="DIV" && el2.className=="body" && (el2.getAttribute("fbname")=="notes" || el2.getAttribute("fbname")=="comments")))
  el2=el2.parentNode;
 if (el2 && el2.nodeName!="BODY") {
  el2=el;
  while (el2 && el2.nodeName!="BODY" && !(el2.nodeName=="DIV" && el2.className=="section"))
   el2=el2.parentNode;
   if (el2 && el2.nodeName!="BODY" && el2.id && el2.id!="") {
    var myId=el2.id;
    for (i=document.links.length-1;i>=0;i--) {
     if (getLocalHref(document.links[i].href)==myId) {
       wasReplace=true;
       moveNoteToRefPlace(document.links[i]);
      }
     }
   }
 }

 /*var pp=el;
 while (pp.nodeName!="BODY" && pp.nodeName!="DIV" && pp.nodeName!="A") pp=pp.parentNode;
 if (!pp) {
  var tmpNote=el;  
  var savePrevious=tmpNote.previousSibling;
  var saveNext=tmpNote.nextSibling;
  var saveParent=tmpNote.parentNode;
  tmpNote.removeNode();
  //вначале идет код, проверяющий, есть ли ссылка ЗА позицией курсора
  if (saveNext==null) {
   pp=saveParent;
   while (pp.nextSibling==null && pp.nodeName!="DIV" && pp.nodeName!="P" && pp.nodeName!="BODY") pp=pp.parentNode;
   if (pp.nodeName!="DIV" && pp.nodeName!="P" && pp.nodeName!="BODY") pp=pp.nextSibling;
  } 
  else pp=saveNext;
  if (pp.nodeName!="DIV" && pp.nodeName!="P" && pp.nodeName!="BODY") {
   while (pp.nodeName!="A" && pp.nodeName!="#text" && pp.nodeName!="DIV" && pp.nodeName!="P" && pp.nodeName!="BODY")
    if (pp.firstChild) pp=pp.firstChild;
    else { 
     while (pp.nextSibling==null && pp.nodeName!="DIV" && pp.nodeName!="P" && pp.nodeName!="BODY") pp=pp.parentNode;
     if (pp.nodeName!="DIV" && pp.nodeName!="P" && pp.nodeName!="BODY") pp=pp.nextSibling;
    } 
   if (pp.nodeName=="#text") pp=null;
  } else pp=null;
  //тут идет код, проверяющий, есть ли ссылка ПЕРЕД позицией курсора
  if (pp==null) {
   if (savePrevious==null) {
    pp=saveParent;
    while (pp.previousSibling==null && pp.nodeName!="DIV" && pp.nodeName!="P" && pp.nodeName!="BODY") pp=pp.parentNode;
    if (pp.nodeName!="DIV" && pp.nodeName!="P" && pp.nodeName!="BODY") pp=pp.previousSibling;
   } 
   else pp=savePrevious;
   if (pp.nodeName!="DIV" && pp.nodeName!="P" && pp.nodeName!="BODY") {
    while (pp.nodeName!="A" && pp.nodeName!="#text" && pp.nodeName!="DIV" && pp.nodeName!="P" && pp.nodeName!="BODY")
     if (pp.lastChild) pp=pp.lastChild;
     else { 
      while (pp.previousSibling==null && pp.nodeName!="DIV" && pp.nodeName!="P" && pp.nodeName!="BODY") pp=pp.parentNode;
      if (pp.nodeName!="DIV" && pp.nodeName!="P" && pp.nodeName!="BODY") pp=pp.previousSibling;
     } 
    if (pp.nodeName=="#text") pp=null;
   } 
  }
 } 
 
 if (pp) {
  var href=getLocalHref(pp.href);
  for (i=document.links.length-1;i>=0;i--) {
  if (getLocalHref(document.links[i].href)==href) {
    wasReplace=true;
    moveNoteToRefPlace(document.links[i]);
   }
  }
 }*/
 
 if (el) el.removeNode(true);
 if (wasReplace) {
  el2.removeNode(true);
  unifyNotes();
  unifyComments();
 }
 window.external.EndUndoUnit(document);
}