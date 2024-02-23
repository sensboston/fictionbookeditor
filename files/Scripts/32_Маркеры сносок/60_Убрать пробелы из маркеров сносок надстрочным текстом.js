//======================================
//            «Нормализовать пробелы маркеров сносок»
//                                             Engine by ©Sclex
//                                                    01.05.2007 – 07.05.2008
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

var supOtkr="(?:"+aIB+")*<SUP>(?:"+sIB+")*";
var supZakr="(?:"+fIB+")*</SUP>(?:"+aIB+")*";


function Run() {

 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}
 
 var probelu="(?:(?:(?:"+aIB+")*)(?:(?:(?:\\\s|"+nbspEntity+")+(?:"+aIB+")*)+))";

// if (PromptSnoska) {                                                                     // отключаю касательство к сноскам
//  Snoska=AskYesNo("    	      –=Jürgen Script=–\n\n	Обращать внимание [на] сноски?  		   \n");
// }

  var Ts=new Date().getTime();
  var TimeStr=0;

//~~~~~~~~~~ Регулярные выражения ~~~~~~~~~~~~

/*  // удаление невесть откуда взявшегося двойного верхнего индекса 
 var re100 = new RegExp("<sup>((?:.*?<sup>.*?</sup>.*?)+)</sup>","gi");
 var re100_ = "$1";
 var count_100 = 0; */

 // удаление верхнего индекса из пробелов до маркеров сносок
 var re101 = new RegExp("(\\\s|"+nbspEntity+")+(("+fIB+"){0,1}</sup>("+fIB+"){0,1})","gi");
 var re101_ = "$2$1";
  // var re101_ = "$2";
 var count_101 = 0;

 // удаление верхнего индекса из пробелов после маркеров сносок
 var re102 = new RegExp("((?:"+sIB+"){0,1}<sup>(?:"+sIB+"){0,1})(\\\s|"+nbspEntity+")+","gi");
 var re102_ = "$2$1";
 var count_102 = 0;
 
 // удаление начальных пробелов строки перед верхним индексом
 // var re101 = new RegExp("^(("+sIB+"){0,1}(<sup>)?("+sIB+"){0,1}(<sup>)?)(\\\s|"+nbspEntity+")+","gi");
 // var re101_ = "$1";
 // var count_101 = 0;
 
 var re103 = new RegExp("^("+sIB+"){0,1}(\\\s|"+nbspEntity+")+("+aIB+"){0,1}(<sup>)","gi");
 var re103_ = "$1$3$4";
 var count_103 = 0;
 
/*  
 // регекспы ниже надо бы убрать, а пробела перед знаками сносок удалять после создания сносок.

 // удаление двойного верхнего индекса
 var re104 = new RegExp("<sup>(("+sIB+"){0,1}<sup>("+sIB+"){0,1}.+?("+fIB+"){0,1}</sup>("+fIB+"){0,1})</sup>","gi");
 var re104_ = "$1";
 var count_104 = 0;
 
 // пометить два маркера подряд через пробелы
 var re105 = new RegExp("("+supZakr+")("+probelu+")("+supOtkr+")","gi");
 // var re105 = new RegExp("("+supZakr+")((?:\\\s|"+nbspEntity+")+)("+supOtkr+")","gi");
 var re105_ = "$1$2#@%$3";
 var count_105 = 0;
 
 // удаление обычных пробелов перед маркерами знаков сносок. ?????? (закомментить!!!!!???)
 var re106 = new RegExp("(\\\s|"+nbspEntity+")+(("+aIB+"){0,1}<sup>\\d+</sup>)","gi");
 var re106_ = "$2";
 var count_106 = 0;
 
// удаление метки
 var re107 = new RegExp("#@%","g");
 var re107_ = "";
 var count_107 = 0;
 */
//~~~~~~~~~~~~~~ Конец шаблонов ~~~~~~~~~~~~~~~~~~


 var id;
 var s="";

 // функция, обрабатывающая абзац P
 function HandleP(ptr) {


  s=ptr.innerHTML;

       // if (s.search(re100)!=-1)         { s=s.replace(re100, re100_);}
       if (s.search(re101)!=-1)         { s=s.replace(re101, re101_); count_101++}
       if (s.search(re102)!=-1)         { s=s.replace(re102, re102_); count_102++}
       if (s.search(re103)!=-1)         { s=s.replace(re103, re103_); count_103++}
 /*       if (s.search(re104)!=-1)         { s=s.replace(re104, re104_); count_104++}
       if (s.search(re105)!=-1)         { s=s.replace(re105, re105_); count_105++}
       if (s.search(re106)!=-1)         { s=s.replace(re106, re106_); count_106++}
       if (s.search(re107)!=-1)         { s=s.replace(re107, re107_); count_107++}
 */

   ptr.innerHTML=s;      
  } 

    window.external.BeginUndoUnit(document,"«Нормализовать пробелы маркеров сносок»");                               // ОТКАТ (UNDO) начало

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

// без тире в диалогах 08 и дублей пробелов 80
 if (count_101!=0 || count_102!=0 || count_103!=0 )   {st2+='\n Статистика'}

 if (count_101!=0)   {st2+='\n• пробел до маркера знака сноски:                             	'+count_101;}
 if (count_102!=0)   {st2+='\n• пробел после маркера знака сноски:                       	'+count_102;}
 if (count_103!=0)   {st2+='\n• начальный пробел перед маркером текста сноски:	'+count_103;}
/*  if (count_104!=0)   {st2+='\n• двойной верхний индекс:                                             	'+count_104;}
 if (count_105!=0)   {st2+='\n• временные метки:                                                        	'+count_105;}
 if (count_106!=0)   {st2+='\n• обычный пробел перед маркером знака сноски:     	'+count_106;}
 if (count_107!=0)   {st2+='\n• удаление временной метки:                                          	'+count_107;} */

 if (st2!="") st2="\n"+st2;

 MsgBox ('                  –= Jurgen Script =– \n'+
        ' «Нормализовать пробелы маркеров сносок» v.'+VersionNumber+' stokber Edition       \n\n'+

        ' Время: ' +TimeStr+'.'+st2); 


} 