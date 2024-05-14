//======================================
//            Скрипт «Проставить ударения над буквами, выделенными жирностью, курсивом либо регистром» v.1.07 (04.12.2024)
//            Создан на базе скрипта «Генеральная уборка» (автор скрипта - jurgennt)
//                                             Engine by ©Sclex
//                                                    01.05.2007 – 07.05.2008
//                                             (доработка до заявленного функционала - stokber, апрель 2024)

// Скрипт ищет одиночные гласные буквы размеченные курсивом или жирным шрифтом и заменяет их на у́да́рны́е́ гла́сны́е́. Во втором режиме ищет ПРОПИСНЫЕ гласные в середине слова и тоже меняет на у́да́рны́е́ гла́сны́е́.
//~~~~~~~~~~~~~~~~~~

var VersionNumber="1.07";

//обрабатывать ли history
var ObrabotkaHistory=true;
//обрабатывать ли annotation
var ObrabotkaAnnotation=true;
// обрабатывать ли сноски                       // отключаю касательство к сноскам
// var Snoska=false;
//  var PromptSnoska=true;

var sIB="<EM>|<STRONG>|<EM><STRONG>|<STRONG><EM>";
var fIB="</EM>|</STRONG>|</EM></STRONG>|</STRONG></EM>";
var aIB="<EM>|<STRONG>|<EM><STRONG>|<STRONG><EM>|</EM>|</STRONG>|</EM></STRONG>|</STRONG></EM>";

function Run() {

 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}
 
  var Ts=new Date().getTime();
  var TimeStr=0;

var letters = {
  а: "а́",  е: "е́",
  ё: "ё́",  и: "и́",
  о: "о́",  у: "у́",
  ы: "ы́",  э: "э́",
  ю: "ю́",  я: "я́",
  А: "А́",  Е: "Е́",
  Ё: "Ё́",  И: "И́",
  О: "О́",  У: "У́",
  Ы: "Ы́",  Э: "Э́",
  Ю: "Ю́",  Я: "Я́"
};

var lettersUp = {
  "([а-яё])А": "$1а́",
  "([а-яё])Е": "$1е́",
  "([а-яё])Ё": "$1ё́",
  "([а-яё])И": "$1и́",
  "([а-яё])О": "$1о́",
  "([а-яё])У": "$1у́",
  "([а-яё])Ы": "$1ы́",
  "([а-яё])Э": "$1э́",
  "([а-яё])Ю": "$1ю́",
  "([а-яё])Я": "$1я́"
};

function tagCase() {
 for (var key in letters) {
 var accent = letters[key] 
 var re101 = new RegExp("<EM><STRONG>"+key+"</STRONG></EM>","g");
 var re101_ = accent;

 var re102 = new RegExp("<STRONG><EM>"+key+"</EM></STRONG>","g");
 var re102_ = accent;

 var re103 = new RegExp("<(STRONG|EM)>(\\\s|"+nbspEntity+")?"+key+"(\\\s|"+nbspEntity+")?</\\1>","g");
 var re103_ = "$2"+accent+"$3";
 
 var re104 = new RegExp("("+sIB+")"+key+"(\\\s|"+nbspEntity+")("+fIB+")","g");
 var re104_ = accent+"$2$1$3"; 
 
 var re105 = new RegExp("("+sIB+")(\\\s|"+nbspEntity+")"+key+"("+fIB+")","g");
 var re105_ = "$1$2"+accent; 
 
 // var count_101 = 0;
 
   if (s.search(re101)!=-1)         { s=s.replace(re101, re101_);}
   if (s.search(re102)!=-1)         { s=s.replace(re102, re102_);}
   if (s.search(re103)!=-1)         { s=s.replace(re103, re103_);}
   if (s.search(re104)!=-1)         { s=s.replace(re104, re104_);}
   if (s.search(re105)!=-1)         { s=s.replace(re105, re105_);}
 }
}

function upCase() {

 var re110 = new RegExp("([а-яё])А","g");
 var re110_ = "$1а́";
 
 var re111 = new RegExp("([а-яё])Е","g");
 var re111_ = "$1е́";
 
 var re112 = new RegExp("([а-яё])Ё","g");
 var re112_ = "$1ё́";

 var re113 = new RegExp("([а-яё])И","g");
 var re113_ = "$1и́";

 var re114 = new RegExp("([а-яё])О","g");
 var re114_ = "$1о́";

 var re115 = new RegExp("([а-яё])У","g");
 var re115_ = "$1у́";

 var re116 = new RegExp("([а-яё])Ы","g");
 var re116_ = "$1ы́";

 var re117 = new RegExp("([а-яё])Э","g");
 var re117_ = "$1э́";

 var re118 = new RegExp("([а-яё])Ю","g");
 var re118_ = "$1ю́";

 var re119 = new RegExp("([а-яё])Я","g");
 var re119_ = "$1я́";

 if (s.search(re110)!=-1)         { s=s.replace(re110, re110_);}
 if (s.search(re111)!=-1)         { s=s.replace(re111, re111_);}
 if (s.search(re112)!=-1)         { s=s.replace(re112, re112_);}
 if (s.search(re113)!=-1)         { s=s.replace(re113, re113_);}
 if (s.search(re114)!=-1)         { s=s.replace(re114, re114_);}
 if (s.search(re115)!=-1)         { s=s.replace(re115, re115_);}
 if (s.search(re116)!=-1)         { s=s.replace(re116, re116_);}
 if (s.search(re117)!=-1)         { s=s.replace(re117, re117_);}
 if (s.search(re118)!=-1)         { s=s.replace(re118, re118_);}
 if (s.search(re119)!=-1)         { s=s.replace(re119, re119_);}
}

//~~~~~~~~~~~~~~~~~~~~~~

 var fontTag = confirm("Вы хотите заменить отдельные гласные курсивные или жирные буквы на буквы с ударением?\nЕсли требуется  заменить ПРОПИСНЫЕ гласные буквы среди строчных на буквы с ударением, то нажмите Отмена.");
 if(fontTag == true) {
}
else
{
var fontUp = confirm("Вы хотите заменить ПРОПИСНЫЕ гласные буквы среди строчных на буквы с ударением?");
 if(fontUp == true) {
 }
else {
 alert("Вы ничего не выбрали!");
 return;
 }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 var id;
 var s="";
 
var key1 = "[аеёиоуыэюяАЕЁИОУЫЭЮЯ]";

 // двойное форматирование вокруг конструкций типа "слов<EM>о о</EM>лово":
 var re1 = new RegExp("(<EM><STRONG>)(.+?)(\\\s|"+nbspEntity+")("+key1+")(</STRONG></EM>)","g");
 var re1_ = "$1$2$5$3$1$4$5";
 
 var re2 = new RegExp("(<STRONG><EM>)(.+?)(\\\s|"+nbspEntity+")("+key1+")(</EM></STRONG>)","g");
 var re2_ = "$1$2$5$3$1$4$5";

 var re3 = new RegExp("(<EM><STRONG>)("+key1+")(\\\s|"+nbspEntity+")(.+?)(</STRONG></EM>)","g");
 var re3_ = "$1$2$5$3$1$4$5";
 
 var re4 = new RegExp("(<STRONG><EM>)("+key1+")(\\\s|"+nbspEntity+")(.+?)(</EM></STRONG>)","g");
 var re4_ = "$1$2$5$3$1$4$5";

 var re5 = new RegExp("(<EM>)("+key1+")(\\\s|"+nbspEntity+")(.+?)(</EM>)","g");
 var re5_ = "$1$2$5$3$1$4$5";
 
 var re6 = new RegExp("(<STRONG>)("+key1+")(\\\s|"+nbspEntity+")(.+?)(</STRONG>)","g");
 var re6_ = "$1$2$5$3$1$4$5";
 
  var re7 = new RegExp("(<EM>)(.+?)(\\\s|"+nbspEntity+")("+key1+")(</EM>)","g");
 var re7_ = "$1$2$5$3$1$4$5";
 
 var re8 = new RegExp("(<STRONG>)(.+?)(\\\s|"+nbspEntity+")("+key1+")(</STRONG>)","g");
 var re8_ = "$1$2$5$3$1$4$5";
 
// убираем форматирование пробелов вокруг одиночной буквы:
var re9 = new RegExp("("+sIB+")(\\\s|"+nbspEntity+")?("+key1+")(\\\s|"+nbspEntity+")("+aIB+")","g");
var re9_ = "$2$1$3$5$4";
// ???????????:
var re10 = new RegExp("("+aIB+")("+key1+")?(\\\s|"+nbspEntity+")("+key1+")("+aIB+")","g");
var re10_ = "$1$2$5$3$1$4$5";

// помечаем отдельно стоящие курсивно-жирные гласные буквы:
var re100s = new RegExp("(^|[^а-яА-ЯёЁ>])("+sIB+")(\\\s|"+nbspEntity+")?("+key1+")(\\\s|"+nbspEntity+")?("+fIB+")(?![<а-яА-ЯёЁ])","g");
var re100s_ = "$1$2$3<b>$4</b>$5$6";
// удаляем метки:
var re100e = new RegExp("</?b>","g");
var re100e_ = "";
 
 // функция, обрабатывающая абзац P
  function HandleP(ptr) {
  s=ptr.innerHTML;

   if(fontTag == true) {
   if (s.search(re1)!=-1)         { s=s.replace(re1, re1_);} // 
   if (s.search(re2)!=-1)         { s=s.replace(re2, re2_);} // 
   if (s.search(re3)!=-1)         { s=s.replace(re3, re3_);} // 
   if (s.search(re4)!=-1)         { s=s.replace(re4, re4_);} // 
   if (s.search(re5)!=-1)         { s=s.replace(re5, re5_);} // 
   if (s.search(re6)!=-1)         { s=s.replace(re6, re6_);} // 
   if (s.search(re7)!=-1)         { s=s.replace(re7, re7_);} // 
   if (s.search(re8)!=-1)         { s=s.replace(re8, re8_);} // 
   if (s.search(re9)!=-1)         { s=s.replace(re9, re9_);} // 
   if (s.search(re10)!=-1)         { s=s.replace(re10, re10_);} // 
   if (s.search(re100s)!=-1)         { s=s.replace(re100s, re100s_);} // помечаем.

  tagCase();
   if (s.search(re100e)!=-1)         { s=s.replace(re100e, re100e_);} // удаляем метки.
  }  // курсив-жирный.
  
  if(fontUp == true) {upCase();}  // ПРОПИСНЫЕ.

  ptr.innerHTML=s;      
  } 

    window.external.BeginUndoUnit(document,"«Расстановка частичных ударений»");                               // ОТКАТ (UNDO) начало

 var body=document.getElementById("fbw_body");
 
 var str = body.innerText; // текст документа.
 var regex = /(а́|е́|ё́|и́|о́|у́|ы́|э́|ю́|я́|А́|Е́|И́|О́|У́|Ы́|Э́|Ю́|Я́|ё́|Ё́)/g ;
 var countStart = (str.match(regex) || []).length; // было букв с ударением.
 
 var ptr=body;
 var ProcessingEnding=false;
 while (!ProcessingEnding && ptr) {
  SaveNext=ptr;
  if (SaveNext.firstChild!=null && SaveNext.nodeName!="P" && 
      !(SaveNext.nodeName=="DIV" && 
        ((SaveNext.className=="history" && !ObrabotkaHistory) || 
         (SaveNext.className=="annotation" && !ObrabotkaAnnotation))))
  {    SaveNext=SaveNext.firstChild; }                                                         // либо углубляемся...

  else {
    while (SaveNext.nextSibling==null)  {
     SaveNext=SaveNext.parentNode;                                                           // ...либо поднимаемся (если уже сходили вглубь)
                                                                                                                // поднявшись до элемента P, не забудем поменять флаг
     if (SaveNext==body) {ProcessingEnding=true;}
                                                         }
   SaveNext=SaveNext.nextSibling; //и переходим на соседний элемент
         }
  if (ptr.nodeName=="P") HandleP(ptr);
  ptr=SaveNext;
 }

    window.external.EndUndoUnit(document);                                             // undo конец

 var str = body.innerText; // текст документа.
 var countEnd = (str.match(regex) || []).length;
 var countReplace = countEnd - countStart; // заменено букв.

var Tf=new Date().getTime();
var Thour = Math.floor((Tf-Ts)/3600000);
var Tmin  = Math.floor((Tf-Ts)/60000-Thour*60);
var Tsec = Math.ceil((Tf-Ts)/1000-Tmin*60-Thour*3600);
var Tsec1 = Math.ceil(10*((Tf-Ts)/1000-Tmin*60))/10;
var Tsec2 = Math.ceil(100*((Tf-Ts)/1000-Tmin*60))/100;
var Tsec3 = Math.ceil(1000*((Tf-Ts)/1000-Tmin*60))/1000;

           if (Tsec3<1 && Tmin<1)    TimeStr=Tsec3+ " сек"
 else { if (Tsec2<10 && Tmin<1)   TimeStr=Tsec2+ " сек"
 else { if (Tsec1<30 && Tmin<1)   TimeStr=Tsec1+ " сек"
 else { if (Tmin<1)                       TimeStr=Tsec+ " сек" 
 else { if (Tmin>=1 && Thour<1)   TimeStr=Tmin+ " мин " +Tsec+ " с"
 else { if (Thour>=1)                    TimeStr=Thour+ " ч " +Tmin+ " мин " +Tsec+ " с" }}}}}

// вывод статистики, если она, конечно, есть
 var st2="";
 if (st2!="") st2="\n"+st2;

 MsgBox ('                  –= Jurgen Script =– \n'+
        ' «Расстановка частичных ударений» v.'+VersionNumber+' stokber Edition       \n\n'+
        'Заменено букв: '+countReplace+'.\n\n'+
        ' Время: ' +TimeStr+'.'+st2); 

// var rX = "(а́|е́|ё́|и́|о́|у́|ы́|э́|ю́|я́|А́|Е́|И́|О́|У́|Ы́|Э́|Ю́|Я́|ё́|Ё́)";
// clipboardData.setData("Text",rX); // поместить данные в буфер обмена для возможной последующей в строку "Что искать" окна "Поиск" для проверки.
} 
