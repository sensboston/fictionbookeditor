// Тест сносок
// Версия: 1.3

function Run() {
 var Ts=new Date().getTime();
 var fbw_body=document.getElementById("fbw_body");
 if (fbw_body==null) {MsgBox("Ошибка. Не найдено fbw_body!"); return;}
 var ptr=fbw_body.firstChild;
 while (ptr) { if (ptr.getAttribute("fbname")=="notes") break; else ptr=ptr.nextSibling; }
 if (ptr==null) {MsgBox("Отсутствует body примечаний."); return;}
 MyLinks=fbw_body.getElementsByTagName("A");
 var BodyNotes=ptr;
 var ptr=BodyNotes.firstChild;
 var NoteIdByNum = new Object();
 var NoteCntById = new Object();
 var NotePtrById = new Object();
 var NoteNumById = new Object();
 var SectCnt=0;
 var ErrTxt="";
 while (ptr) {
  if (ptr.nodeName=="DIV" && ptr.className=="section") {
   SectCnt++;
   var id=ptr.getAttribute("id");
   if (id!="") {
    NoteIdByNum[SectCnt]=id;
    NoteCntById[id]=0;
    NotePtrById[SectCnt]=ptr;
    NoteNumById[id]=SectCnt;
   }
   else {
    MsgBox("Раздел номер "+SectCnt+" в body примечаний не имеет id.\n"+
           "Перемещаемся на нее...");
    GoTo(ptr);
    return;
   }
  }
  ptr=ptr.nextSibling;
 }
 var i;
 var PrevNum=0;
 for (i=0;i<MyLinks.length;i++) {
  var type=MyLinks[i].className;
  if (type!="note") continue;
  var href=MyLinks[i].getAttribute("href");
  if (href.indexOf("http://")!=-1 || href.indexOf("https://")!=-1 ||
      href.indexOf("ftp://")!=-1) continue;
  if (MyLinks[i].innerHTML=="") {ErrTxt="Текст ссылки равен пустой строке."; break;}
  if (href.length==0) {ErrTxt="Пустой адрес ссылки."; break;}
  href=GetLocalHref(href);
  if (href=="1") {ErrTxt="Отсутствует # в адресе ссылки."; break;}
  if (NoteCntById[href]==null) {
   ErrTxt="В body примечаний нет раздела примечания с id, указанным в ссылке.";
   break;
  }
  if (NoteCntById[href]!=0) {
   ErrTxt="Вторая сноска, которая ссылается на тот же раздел.";
   break;
  }
  NoteCntById[href]++;
  var Num=NoteNumById[href];
  if (Num!=PrevNum+1) {
   if (i!=0) {
    ErrTxt="Ссылки идут не по порядку.\n\n"+
           "Вот куда ссылается предыдущая:\n"+
           "Номер: "+PrevNum+"        id: "+NoteIdByNum[PrevNum]+"\n"+
           "Текст ссылки: "+MyLinks[i-1].innerHTML+"\n\n"+
           "А вот куда текущая:\n"+
           "Номер: "+Num+"        id: "+NoteIdByNum[Num]+"\n"+
           "Текст ссылки: "+MyLinks[i].innerHTML+"\n";
    }
    else {
    ErrTxt="Первая ссылка ссылается не на первый раздел.\n\n"+
           "А вот сюда:\n"+
           "Номер: "+Num+"        id: "+NoteIdByNum[Num]+"\n";
           "Текст ссылки: "+MyLinks[i].innerHTML+"\n";
    }
   break;
  }
  PrevNum=Num;
 }
 if (ErrTxt!="") {
  MsgBox("Ошибка в сноске "+MyLinks[i].innerHTML+"\n"+ErrTxt+"\n"+
         "Перемещаемся на ошибочную сноску...");
  GoTo(MyLinks[i]);
  return;
 }
 var FirstErrSect=null;
 for (i=1;i<=SectCnt;i++) {
  var id=NoteIdByNum[i];
  if (NoteCntById[id]!=1) {
   ErrTxt=ErrTxt+"Номер: "+i+"         id: "+id+"\n";
   if (FirstErrSect==null) FirstErrSect=NotePtrById[i];
  }
 }
 if (ErrTxt!="") {
  MsgBox("Отсутствуют ссылки на некоторые разделы примечаний.\n"+
         "Ниже можете увидеть их перечисление.\n\n"+ErrTxt+"\n"+
         "Переходим на первый из таких разделов...");
  GoTo(FirstErrSect);
  return;
 }
 var Tf=new Date().getTime();
 var Tmin = Math.floor((Tf-Ts)/60000);
 var Tsek = Math.ceil(10*((Tf-Ts)/1000-Tmin*60))/10;
 if (Tmin>0) {var TimeStr=Tmin+" мин. "+Tsek+" с"}
 else {var TimeStr=Tsek+" с"}
 MsgBox("Проверка корректности оформления примечаний завершена. Ошибок не обнаружено.\n"+
        "Затраченное время: "+TimeStr);
}

function GetLocalHref(name) {
  var i=1;
  var name1=name;
  if (name.indexOf("#")<0) {return("1")}
  var thg=new RegExp("main\.html\#","i");
  srch10=name1.search(thg);
  if (srch10==-1) {
   name1 = name1.substring(1,name1.length);
  } else {
   name1 = name1.substring(srch10+10,name1.length);
  }
  return(name1);
}
