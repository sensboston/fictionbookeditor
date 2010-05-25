// добавление сноски между уже имеющимися
// написал Sclex
// версия 2.5
// Sclex, помни: данный скрипт имеет собственный код, не такой,
//   как остальные скрипты в этом наборе

function Run () {
 if (!confirm("Вы запустили скрипт «Унификация сносок (с удалением неиспользуемых секций примечаний)».\nВы действительно хотите, чтобы неиспользуемые секции примечаний были удалены?")) return;
 var Ts=new Date().getTime();
 var commentRegExp=new RegExp("^c_",""); 
 //НАСТРОЙКИ - начало
 //здесь шаблоны, которые используются при работе скрипта
 //используйте макрос %N для указания номера примечания
 var strConst1="c_%N"; //шаблон ID секций примечаний
 var strConst2="%N";//шаблон заголовка примечания
 var strConst3="";//шаблон содержания вставленного примечания
 var strConst4="<SUP>{%N}</SUP>"; //шаблон текста ссылки
 var strConst5="Комментарии"; //шаблон заголовка боди нотесов
 var strConst6="comments"; //имя секции примечаний
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
 //перемещать ли фокус видимости на секцию свежесозданного примечания
 var MoveFocusToNote=false;
 //true, если это скрипт добавления последней сноски
 var lastSnoskaMode=false;
 //режим ускоренной работы
 var forsazh=false;
 //НАСТРОЙКИ - конец
 
 // функция находит номер комментария, соответствующего определенному имени секции
 // в исходном документе. В name передаем имя секции, перед ним символ #, если это
 // локальная ссылка. В SectID передаем массив имен секций.
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
 var whileFlag,hhh,nashliBodyNotes,bodyNotes,el,insertN,uic,i3,newSnoskaNum;
 if (!body) {MsgBox("ошибка. body не найден!"); return;}
 var insertCnt=1;
//следующие строки нужно раскомментировать, чтобы восстановить
//запрос параметров для вставки сноски
//ОТСЮДА
/*
 strConst1=prompt("Шаблон ID секции примечания. Используйте макрос %N"+
                  " для указания номера секции.",strConst1);
 strConst4=prompt("Шаблон текста ссылки. Используйте макрос %N"+
                  " для указания номера секции.",strConst4);
 strConst2=prompt("Шаблон заголовка примечания. Используйте макрос %N"+
                  " для указания номера секции.",strConst2);
 strConst3=prompt("Шаблон содержания новых секций примечаний. Используйте макрос %N"+
                  " для указания номера секции.",strConst3);
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
//прочитаем в массив SectID ID-ы секций примечаний
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
  j5=0;  while (true)
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
 //проверим, нет ли в боди нотесов секций второго уровня вложения
 var sectNumById_=new Object();
 var mySectCnt=0;
 if (!forsazh) {
  var ptr1=bodyNotes.firstChild
  var ptr2;
  while (ptr1) {
   if (ptr1.nodeName=="DIV" && ptr1.className=="section") {
     mySectCnt++;
     if (ptr1.id && ptr1.id!="")
      sectNumById_[ptr1.id]="1";
     ptr2=ptr1.firstChild;
     while (ptr2) {
      if (ptr2.nodeName=="DIV") {
        if (ptr2.className=="section") {
         MsgBox("В body примечаний есть секции второго уровня вложения. Такие файлы не обрабатываются данным скриптом. Работа скрипта завершена.");
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
 var myId;
 for (var i=0;i<document.links.length;i++) {
  if (document.links[i].href && document.links[i].href!="") {
   myId=getLocalHref(document.links[i].href);
   if (myId) delete sectNumById_[myId];
  } 
 }
 for (i in sectNumById_)
   if (sectNumById_[i]=="1") document.getElementById(i).removeNode(true);
 sectNumById_=undefined; 
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
 
 //поменяем ID у секций примечаний
 if (nashliBodyNotes && !lastSnoskaMode) {
  //for (var j1=1; j1<=sectNum; j1++)
  // sectsColl[j1].id=undefined; 
  for (var j1=1; j1<=sectNum; j1++)
   sectsColl[j1].id=PoShablonu(strConst1,j1>=insertN ? j1+insertCnt : j1);
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
     document.links[j2].href="#"+PoShablonu(strConst1,uic);
     //меняем текст ссылки
     document.links[j2].innerHTML = PoShablonu(strConst4,uic);
   }
  }
 }
 // поменяем заголовки секций примечаний
 if (nashliBodyNotes && !lastSnoskaMode) 
  for (i2=1;i2<=sectNum;i2++) {
   if (sectsColl[i2].firstChild!=null) 
    if (sectsColl[i2].firstChild.nodeName=="DIV" && sectsColl[i2].firstChild.className=="title") 
     sectsColl[i2].firstChild.innerHTML="<P>"+PoShablonu(strConst2,i2>=insertN ? i2+insertCnt : i2)+"</P>";
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
 //вставим новую секцию примечания
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
    } else el2=el2.nextSibling;   else whileFlag=false;
  if (el2=null && el.firstChild!=null) GoTo(el.firstChild);
 }
 var Tf=new Date().getTime();
 var Tmin = Math.floor((Tf-Ts)/60000);
 var Tsek = Math.ceil(10*((Tf-Ts)/1000-Tmin*60))/10;
 if (Tmin>0) {var TimeStr=Tmin+" мин. "+Tsek+" с"}
 else {var TimeStr=Tsek+" с"}
  if ((EndWindow)&&(addSnoska)) { MsgBox("\n\nДобавлена сноска   \n\n         № " +insertN+ "   \n\nВремя работы скрипта: "+TimeStr); }
  if ((EndWindow)&&(!addSnoska)) { MsgBox("Обработка сносок закончена.\nДобавления новой сноски не было, так как это отключено в настройках скрипта.\nВремя работы скрипта: "+TimeStr); }
 window.external.EndUndoUnit(document);  
}