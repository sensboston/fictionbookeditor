//======================================
//            «Сноски из Word и др. в маркеры»
//                                             Engine by ©Sclex
//                                                    01.05.2007 – 07.05.2008
//                                             Регекспы: stokber, декабрь 2024
//~~~~~~~~~~~~~~~~~~

var VersionNumber="1.0";

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

var notTags = "((?:^|\>)[^\<]*)";

function Run() {

 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

// if (PromptSnoska) {                                                                     // отключаю касательство к сноскам
//  Snoska=AskYesNo("    	      –=Jürgen Script=–\n\n	Обращать внимание [на] сноски?  		   \n");
// }

var fnWord = confirm("Преобразовывать ли нерабочие сноски из Word и др. в маркеры вида '{~1~}'?");

var prilip = confirm("Преобразовывать ли обычные числа прилипшие к концам слов в маркеры вида '[~1~]'?");

if (fnWord == false && prilip == false) {
alert("Вы ничего не выбрали."); 
return
}

  var Ts=new Date().getTime();
  var TimeStr=0;

//~~~~~~~~~~ Регулярные выражения ~~~~~~~~~~~~

 // сноски-числа в квадратных кавычках из ворда и без:
 // все-все-все:
  // var re100 = new RegExp("(?:<SUP>)?(<A (?:class=note )?href=\\\"[^>]*?\\\">)(?:<(?:SUP|EM|STRONG)>)*(?:\\\[?(\\\d{1,4})\\\]?)(?:</(?:SUP|EM|STRONG)>)*(</A>)(?:</SUP>)?","gi");
 //  кроме уже унифицированных скриптом "Перенумеровать примечания" и похожих на них:
   var re100 = new RegExp("(?:<SUP>)?(<A href=\\\"[^>]*?\\\">)(?:<(?:SUP|EM|STRONG)>)*(?:\\\[?(\\\d{1,4})\\\]?)(?:</(?:SUP|EM|STRONG)>)*(</A>)(?:</SUP>)?","gi");
    var re100_ = "{~$2~}";
    var count_100 = 0;
 
 // сноски-числа из ворда:
    // var re100a = new RegExp("(<A href=\\\"[^>]+?\\\">)(?:<(?:SUP|EM|STRONG)>)*(\\\d{1,4})(?:</(?:SUP|EM|STRONG)>)*(</A>)","gi");
    // var re100a_ = "$2";
	// var count_100a = 0;

	// маркеры-звёздочки
     // var re100b = new RegExp("(?:<SUP>)?(<A href=\\\"[^>]*?\\\">)(?:<(?:SUP|EM|STRONG)>)*(\\\*{1,12})(?:</(?:SUP|EM|STRONG)>)*(</A>)(?:</SUP>)?","gi");
    // var re100b_ = "$2";
    // var count_100b = 0;

 // прилипшие цифры:
  var re101 = new RegExp(notTags+"([a-zа-яё][\\\.\\\?!…;:,]?[\\\)»\\\"”“]?)((?:</?(?:SUP|EM|STRONG)>)*)([1-9](\\\d{0,3})?)(?![0-9a-zа-яё])","gi");
 var re101_ = "$1$2$3[~$4~]";
 var count_101 = 0; 

  var re101a = new RegExp(notTags+"([%™©])((?:</?(?:SUP|EM|STRONG)>)*)?([1-9](\\\d{0,3})?)(?![0-9a-zа-яё])","gi");
 var re101a_ = "$1$2[~$4~]";
 var count_101a = 0; 
//~~~~~~~~~~~~~~ Конец шаблонов ~~~~~~~~~~~~~~~~~~

 var id;
 var s="";

 // функция, обрабатывающая абзац P
 function HandleP(ptr) {

  s=ptr.innerHTML;

     if (fnWord == true) {
       if (s.search(re100)!=-1)         { s=s.replace(re100, re100_); count_100++}
	   // if (s.search(re100a)!=-1)         { s=s.replace(re100a, re100a_); } //count_100a++}
	 // if (s.search(re100b)!=-1)         { s=s.replace(re100b, re100b_); } //count_100b++}
}
   if (prilip == true) {
       if (s.search(re101)!=-1)         { s=s.replace(re101, re101_); count_101++}
	   if (s.search(re101a)!=-1)         { s=s.replace(re101a, re101a_); count_101a++}
	   }

   ptr.innerHTML=s;      
  } 

    window.external.BeginUndoUnit(document,"преобразование в маркеры сносок");                               // ОТКАТ (UNDO) начало

 var body=document.getElementById("fbw_body");
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
 
 count_101 = count_101 + count_101a;

 if (count_100!=0 || count_101!=0)   {st2+='\n Статистика'}

 if (count_100!=0)   {st2+='\n• сноска из Word и т. п. в маркер:\t                       	'+count_100;}
  if (count_101!=0)   {st2+='\n• прилипшее число в маркер:\t                             	'+count_101;}
  // if (count_101a!=0)   {st2+='\n• еще прилипшее число в маркер:\t                             	'+count_101a;}

 if (st2!="") st2="\n"+st2;

 MsgBox ('                  –= Jurgen Script =– \n'+
        ' «Сноски из Word и др. в маркеры» v.'+VersionNumber+' stokber Edition       \n\n'+

        ' Время: ' +TimeStr+'.'+st2); 


} 