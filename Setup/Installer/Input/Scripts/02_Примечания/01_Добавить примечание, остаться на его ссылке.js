// добавление сноски между уже имеющимися
// написал Sclex
// версия 2.8

function Run () {
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
 var strConst6="notes"; //значение атрибута name у body примечаний
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
 var addSnoska=true;
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
 
 function miniValidate(s) {
 //возвращаемые значения:
 //1 - недопустимый символ в имени тэга
 //2 - неразрешенное имя тэга
 //3 - закрывающий тэг не соответствует открывающему
 //4 - незакрытый тэг (нет правой угловой скобки)
 //5 - для открытого тэга нет соответствующего закрывающего
  var i=0;
  var InsideTag=false;
  var TagStek="";
  while (i<s.length) {
   var ch=s.substring(i,i+1);
   if (InsideTag) {
     var ffg=new RegExp("[/a-z]","gi");
     if (ch=="<") {return 4}
     if (ch.search(ffg)!=-1) {
       TagName=TagName+ch;
     } else if (ch==">") {
       InsideTag=false;
       if (TagName!="STRONG" && TagName!="EM" && TagName!="P" && TagName!="/P" &&
           TagName!="/STRONG" && TagName!="/EM" && TagName!="SUP" && TagName!="SUB"
           && TagName!="/SUP" && TagName!="/SUB") {return 2}
       if (TagName=="STRONG") {TagStek=TagStek+"1"}
       if (TagName=="EM") {TagStek=TagStek+"2"}
       if (TagName=="SUP") {TagStek=TagStek+"3"}
       if (TagName=="SUB") {TagStek=TagStek+"4"}
       if (TagName.substr(0,1)=="/") {
         var TagCodeFromStek=TagStek.substr(TagStek.length-1,1);
 //        MsgBox("TagCodeFromStek:"+TagCodeFromStek+"\nTagName:"+TagName);
         if (TagName=="/STRONG" && TagCodeFromStek!="1") {return 3}
         if (TagName=="/EM" && TagCodeFromStek!="2") {return 3}
         if (TagName=="/SUP" && TagCodeFromStek!="3") {return 3}
         if (TagName=="/SUB" && TagCodeFromStek!="4") {return 3}
         if (TagName=="/STRONG" || TagName=="/EM" || TagName=="/SUP" || TagName=="/SUB") {
          TagStek=TagStek.substr(0,TagStek.length-1);
         }
       }
     } else {return 1}
   }
   if (!InsideTag && ch=="<") {
    InsideTag = true;
    var TagName="";
   }
   i++;
  }
  if (InsideTag) {return 4}
  if (TagStek!="") {return 5}
  return 0;
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
 
 window.external.BeginUndoUnit(document,strConst7);
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
  j5=0;
  while (true)
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
    MsgBox("Не удалось создать примечание.\n\n"+
           "Чтобы определить, с каким разделом в body примечаний "+
           "связать сноску, которую пользователь хочет вставить, "+
           "скрипт смотрит, с каким разделом в body примечаний "+
           "связана определенная ранее созданная сноска. А именно – "+
           "скрипт смотрит на ближайшую сноску вверх по документу "+
           "от той сноски, которую пытается создать и вставить. "+
           "Но в этот раз оказалось, что эта ближайшая сверху "+
           "сноска не связана корректным образом с разделом в body "+
           "примечаний. Поэтому, чтобы вставить новую сноску, "+
           "исправьте, пожалуйста, сноску, которая идет перед ней.");
    return;
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
//проверим, нет ли в боди нотесов разделов второго уровня вложенности
 if (!forsazh) {
  var ptr1=bodyNotes.firstChild
  var ptr2;
  while (ptr1) {
   if (ptr1.nodeName=="DIV" && ptr1.className=="section") {
     ptr2=ptr1.firstChild;
     while (ptr2) {
      if (ptr2.nodeName=="DIV") {
        if (ptr2.className=="section") {
         MsgBox("В body примечаний есть разделы второго уровня вложенности. Такие документы не обрабатываются данным скриптом. Работа скрипта завершена.");
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
 //введем, если надо, текст примечания
 if (InputSnoskaText) {
  var promptText="Текст примечания. Используйте <b>...</b> <i>...</i> <br> <strong>...</strong> <emphasis>...</emphasis> <em>...</em>";
  var snoskaTextSrc=prompt(promptText,"&nbsp;");
  if (snoskaTextSrc==null) {return;}
  snoskaText=makeGoodSnoska(snoskaTextSrc);
  var code=miniValidate(snoskaText);
  while (code!=0) {
   if (code==1) {
     MsgBox("Ошибка. Недопустимый символ в имени тэга.");
   }
   if (code==2) {
     MsgBox("Ошибка. Неразрешенное имя тэга.");
   }
   if (code==3) {
    MsgBox("Ошибка. Имя закрывающего тэга не соответствует имени открывающего.");
   }
   if (code==4) {
     MsgBox("Ошибка. Не закрыт тэг правой угловой скобкой, как уже начинается новый, либо не закрыт последний тэг в строке.");
   }
   if (code==5) {
     MsgBox("Ошибка. Для открытого тэга нет соответствующего закрывающего.");
   }
   var snoskaTextSrc=prompt(promptText,snoskaTextSrc);
   if (snoskaTextSrc==null) {return;}
   snoskaText=makeGoodSnoska(snoskaTextSrc);
   var code=miniValidate(snoskaText);
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
    } else el2=el2.nextSibling;
   else whileFlag=false;
  if (el2=null && el.firstChild!=null) GoTo(el.firstChild);
 }
 var Tf=new Date().getTime();
 var Tmin = Math.floor((Tf-Ts)/60000);
 var Tsek = Math.ceil(10*((Tf-Ts)/1000-Tmin*60))/10;
 if (Tmin>0) {var TimeStr=Tmin+" мин. "+Tsek+" с"}
 else {var TimeStr=Tsek+" с"}
 try {
  if (addSnoska)
   window.external.SetStatusBarText("Добавлена сноска № " +insertN+ ". Время работы скрипта: "+TimeStr);
  else
    window.external.SetStatusBarText("Перенумерация сносок успешно завершена. Время работы скрипта: "+TimeStr);
 }
 catch (e)
 {}
 window.external.EndUndoUnit(document);  
}
