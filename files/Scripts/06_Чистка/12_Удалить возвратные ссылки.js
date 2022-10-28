//скрипт "Удаление возвратных ссылок"
//удаляем ссылки в боди нотесов, которые подходят под регэкспы
//удаляем id абзацев, которые подходят под регэкспы

var VersionNumber="1.3";

//если true - преобразовывать возвратную ссылку в простой текст
//false - удалять возвратные ссылки
var HrefToText=false;
var CheckSimpleLinks=true;
//сюда можно дописать еще регэкспы для возвратных ссылок
var BackhrefRegexp=new Array(
 new RegExp("^_ftnref","i"),
 new RegExp("^_ednref","i"));

function Run() {

 var Ts=new Date().getTime();

 var body=document.getElementById("fbw_body");
 if (!body) return;
 var el=body.firstChild;
 var BodyCnt=0;
 var BodyNotes=null;
 while (el!=null) {
  if (el.nodeName.toUpperCase()=="DIV" && el.className.toLowerCase()=="body") {
   if (el.getAttribute("fbname")!="notes") {BodyCnt++}
   else {BodyNotes=el}
  }
  el=el.nextSibling;
 }
 if (BodyNotes==null) {
   MsgBox("Отсутствует body примечаний!");
   return;
 }
 if (BodyCnt==0) {
   MsgBox("Нет ни одного body, кроме body примечаний.");
   return;
 }
 AllBodysP = new Array(BodyCnt);
 if (CheckSimpleLinks) {
  NotNotesA = new Array(BodyCnt);
 }
 var el=body.firstChild;
 var BodyCnt2=0;
 while (el!=null) {
  if (el.nodeName.toUpperCase()=="DIV" && el.className.toLowerCase()=="body") {
   if (el.getAttribute("fbname")!="notes") {
     BodyCnt2++;
//Коллекцию элементов P очередного body сохраним в элемент массива AllBodysP
     AllBodysP[BodyCnt2-1]=el.getElementsByTagName("P");
     if (CheckSimpleLinks) {
//Коллекцию элементов A очередного body сохраним в элемент массива NotNotesA
       NotNotesA[BodyCnt2-1] = el.getElementsByTagName("A");
     }
   }
  }
  el=el.nextSibling;
 }
 var NotNotesAColl = new Object();
 var i8=0;
 while (i8<BodyCnt) {
  var i9=0;
  while (i9<NotNotesA[i8].length) {
   var href2 = GetLocalHref(NotNotesA[i8][i9].getAttribute("href"));
   if (href2!=-1) { NotNotesAColl[href2]= NotNotesA[i8][i9] }
   i9++;
  }
  i8++;
 }
 //здесь начинается новый код
 var el=BodyNotes.firstChild;
 var NotesStr="";
 var SectCnt=0;
 while (el!=null) {
  if (el.nodeName=="DIV" && el.className=="section") {
   SectCnt++;
   ATags = el.getElementsByTagName("A");
   var ACnt=0;
   for (i11=0;i11<ATags.length;i11++) {
    var href=GetLocalHref(ATags[i11].getAttribute("href"));
    var FlagY=false;
    for (i12=0;i12<BackhrefRegexp.length;i12++) {
     if (href.search(BackhrefRegexp[i12])!=-1) {FlagY=true;}
    }
    if (FlagY) {ACnt++}
   }
   if (ACnt>1 || ACnt==0) {
   if (NotesStr=="") { NotesStr=SectCnt+":"+ACnt; }
   else { NotesStr=NotesStr+", "+SectCnt+":"+ACnt; }
   }
  }
  el=el.nextSibling;
 }
 if (NotesStr!=""){
  if (!AskYesNo('В самом правильном случае в каждом разделе body примечаний есть одна возвратная ссылка.\nНо в данном случае это не так.\nНиже перечислены пары "номер раздела:количество возвратных ссылок" для тех разделов,\nв которых количество обнаруженных возвратных ссылок отличается от единицы.\nПроконтролировать их размещение не представляется возможным.\n\n'+NotesStr+'\n\nВы все еще хотите произвести удаление возвратных ссылок и id абзацев?')) {
   return
  }
 }
 var el=BodyNotes.firstChild;
 var DeletedACnt=0;
 while (el!=null) {
  if (el.nodeName=="DIV" && el.className=="section") {
   SectCnt++;
   ATags = el.getElementsByTagName("A");
   var ACnt=0;
   var i11=0;
   var DelIdCnt=0;
   var DelIdColl=new Object();
   while (i11<ATags.length) {
    var href=GetLocalHref(ATags[i11].getAttribute("href"));
    for (i12=0;i12<BackhrefRegexp.length;i12++) {
     if (href.search(BackhrefRegexp[i12])!=-1) {ACnt++;};
    }
    if (ACnt!=0) {
     if (HrefToText) { ATags[i11].outerHTML=ATags[i11].innerHTML; }
     else { ATags[i11].outerHTML=""; }
     DeletedACnt++;
     i11--;
     if (!CheckSimpleLinks || (CheckSimpleLinks && NotNotesAColl[href]==null)) {
      DelIdColl[DelIdCnt]=href;
      DelIdCnt++;
     }
    }
    i11++;
   }
  }
  el=el.nextSibling;
 }
 var i6=0;
 var DeletedIdCnt=0;
 while (i6<BodyCnt) {
  var i7=0;
  while (i7<AllBodysP[i6].length) {
   var id2 = AllBodysP[i6][i7].getAttribute("id");
   if (id2!="") {
    var ACnt=0;
    for (i14=0;i14<BackhrefRegexp.length;i14++) {
     if (id2.search(BackhrefRegexp[i14])!=-1) {ACnt++;}
    }
    if (ACnt!=0 && NotNotesAColl[id2]==null) {
     AllBodysP[i6][i7].removeAttribute("id");
     DeletedIdCnt++;
    }
   }
   i7++;
  }
  i6++;
 }

 var Tf=new Date().getTime();
 var Tmin = Math.floor((Tf-Ts)/60000);
 var Tsec = Math.ceil((Tf-Ts)/1000-Tmin*60);
 var Tsek = Math.ceil(10*((Tf-Ts)/1000-Tmin*60))/10;
 var Tssek = Math.ceil(100*((Tf-Ts)/1000-Tmin*60))/100;
 var Tsssek = Math.ceil(1000*((Tf-Ts)/1000-Tmin*60))/1000;
 if (Tssek<1 && Tmin<1)  var TimeStr=Tsssek+ " сек"
 else { if (Tsek<10 && Tmin<1)  var TimeStr=Tssek+ " сек"
 else { if (Tmin<1) var TimeStr=Tsek+ " сек"
 else if (Tmin>=1) var TimeStr=Tmin+ " мин " +Tsec+ " с" }}

 MsgBox('           –= Sclex Script =– \n'+
    ' "Удаление возвратных ссылок"\n'+
    '                      v'+VersionNumber+'\n\n'+

    ' "Удалено \n\n'+
    '         Возвратных ссылок: '+DeletedACnt+'\n'+
    '                     ID абзацев: '+DeletedIdCnt+'\n\n'+

    'Время выполнения: '+TimeStr+'.'+TimeStr);
}

function GetLocalHref(name) {
  var i=1;
  var name1=name;
  var thg2=new RegExp("#");
  if (name1.search(thg2)==-1) {return("1")} //ссылка не может начинаться с 1
  var thg=new RegExp("main\.html\#","i");
  srch10=name1.search(thg);
  if (srch10==-1) {
   name1 = name1.substring(1,name1.length);
  } else {
   name1 = name1.substring(srch10+10,name1.length);
  }
  return(name1);
}