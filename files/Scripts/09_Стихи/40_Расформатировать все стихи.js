//======================================
//             «Расформатирование всех стихов»
//      Скрипт предназначен для полного расформатирования всех стихов.
//~~~~~~~~~~~~~~~~~~
// v.1.0 — Создание скрипта — Александр Ка (10.05.2024)
// v.1.1 — Исправлена ошибка с добавлением пустых строк — Александр Ка (10.06.2024)
// v.1.2 —  Александр Ка (17.06.2024)
// + Добавление расформатирования внутри стиха:  заголовков, "автор текста", эпиграфов
// + Добавление пустых строк рядом с расформатированными разделами
// v.1.3 — Удаление лишних пустых строк внутри стиха  —  Александр Ка (21.06.2024)
//~~~~~~~~~~~~~~~~~~


var NumerusVersion="1.3";


function Run() {

//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------

                 ///  НАСТРОЙКИ

//--------------------------------------------------------------------

//     Добавление пустых строк между расформатированными стихами (<poem>) и текстом книги

var Add_emptyLine_on_off = 1;      // 0 ; 1 //      ("0" — никогда не добавлять, "1" — всегда добавлять)

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОБЩИЕ ПЕРЕМЕННЫЕ


//   Неразрывные пробелы  ;  ("+nbspEntity+") - для поиска  ;  ("+nbspChar+") - для замены  ;
 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

//  Счетчики цикла
var j = 0;
var n = 0;

//  Структура текста (аннотация + история + все <body>, иначе говоря, всё что видно в режиме "B"-дизайн)
 var fbwBody=document.getElementById("fbw_body");

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ПРЕДУПРЕЖДЕНИЕ


 var otvet = false;

 otvet=AskYesNo("                                       <!>  ПРЕДУПРЕЖДЕНИЕ  <!>\n\n"+
                                   "     Скрипт предназначен для полного удаления форматирования «стих»                     \n\n"+
                                   "•    Для этого скрипт...\n"+
                                   "1.  добавляет пустые строки рядом с расформатированными разделами\n"+
                                   "2.  удаляет всё форматирование «стих» (<poem>)\n"+
                                   "3.  удаляет форматирование внутри стихов:\n"+
                                   "        «строфа» (<stanza>)\n"+
                                   "        «заголовок» (<title>)\n"+
                                   "        «эпиграф» (<epigraph>)\n"+
                                   "        «автор текста» (<text-author>)\n"+
                                   "4.  изменяет все теги <v> на <p>\n\n"+
                                   "                                                   ПРОДОЛЖИТЬ ?");

 if (!otvet) return;

  var Ts1=new Date().getTime();
  var tempus=0;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// СОЗДАНИЕ МАССИВА с разделами "poem"


 var mDiv=fbwBody.getElementsByTagName("DIV");  //  массив с узлами "DIV"
 var div;                //  один из узлов "DIV"

 var mPm=[];                 //  массив с узлами "poem"
 var count_Pm = 0;


 for (j=mDiv.length-1; j>=0; j--) {

         div = mDiv[j];

         // Создание массива с узлами "poem"
         if (div.className =="poem")
                 { mPm[count_Pm] = div;  count_Pm++ }

         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



    window.external.BeginUndoUnit(document,"«Расформатирование всех стихов» v."+NumerusVersion);                               // ОТКАТ (UNDO) начало

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОБРАБОТКА ТЕКСТА  :  Разделы "poem"  :  операции № 1хх

 var pm;
 var mStnz=[];  //  массив с узлами "stanza"
 var stnz;
 var mPtr=[];  //  массив с узлами "P"
 var ptr;

 var count_101=0;  var count_102=0;  var count_103=0;
 var count_111=0;  var count_112=0;  var count_113=0;  var count_114=0;  var count_115=0;

 var reFormat = new RegExp("^(stanza|title|epigraph)$","g");  //  допустимые разделы для расформатирования
 var reSpase = new RegExp("^(\\\s|"+nbspEntity+"|&nbsp;|</{0,1}EM>|</{0,1}STRONG>){0,}$","g");  //  признак пустой строки


 for (j=count_Pm-1; j>=0; j--) {
         pm=mPm[j];

         //  Разделы внутри "poem"
         mStnz=pm.getElementsByTagName("DIV");
         for (n=mStnz.length-1; n>=0; n--) {
                 stnz=mStnz[n];
                 if (stnz.className.search(reFormat) != -1) {  //  выбор разделов:  <stanza>, <title>, <epigraph>
                         //  Добавление пустой строки перед разделом
                         if (stnz.previousSibling  &&  stnz.previousSibling.innerHTML.search(reSpase) == -1  &&  stnz.previousSibling.className != "subtitle") {
                                 stnz.insertAdjacentElement("beforeBegin",document.createElement("P"));
                                 window.external.inflateBlock(stnz.previousSibling)=true;
                                 count_101++ }
                         //  Добавление пустой строки после раздела
                         if (stnz.nextSibling  &&  stnz.nextSibling.innerHTML.search(reSpase) == -1  &&  stnz.nextSibling.className != "subtitle") {
                                 stnz.insertAdjacentElement("afterEnd",document.createElement("P"));
                                 window.external.inflateBlock(stnz.nextSibling)=true;
                                 count_101++ }
                         //  Учёт и Удаление оболочки раздела
                         if (stnz.className == "stanza")  count_111++;
                         if (stnz.className == "title")  count_112++;
                         if (stnz.className == "epigraph")  count_113++;
                         stnz.removeNode(false);
                         }
                 }

         mPtr=pm.getElementsByTagName("P");
         for (n=mPtr.length-1; n>=0; n--) {
                 ptr=mPtr[n];
                 //  Учёт и Удаление тега "text-author"
                 if (ptr.className =="text-author") {
                         ptr.removeAttribute("className");
                         count_114++;    }

                 if (ptr.innerHTML.search(reSpase) != -1) {
                         //  Удаление третьей пустой строки подряд
                         if (ptr.previousSibling  &&  ptr.previousSibling.innerHTML.search(reSpase) != -1
                             &&  ptr.previousSibling.previousSibling  &&  ptr.previousSibling.previousSibling.innerHTML.search(reSpase) != -1)
                                     { ptr.removeNode(true);  count_103++;  continue }
                         //  Удаление пустой строки перед подзаголовком
                         if (ptr.nextSibling  &&  ptr.nextSibling.className == "subtitle" )
                                 { ptr.removeNode(true);  count_103++;  continue }
                         //  Удаление одной-двух пустых строк после подзаголовка
                         if (ptr.previousSibling  &&  ptr.previousSibling.className == "subtitle")  {
                                     if (ptr.nextSibling  &&  ptr.nextSibling.innerHTML.search(reSpase) != -1)
                                             { ptr.nextSibling.removeNode(true);  count_103++ }
                                     ptr.removeNode(true);  count_103++ }
                         }
                 }

         //  Добавление пустой строки между стихами и текстом
         if (Add_emptyLine_on_off ==1) {
                 //  Добавление пустой строки перед разделом "poem"
                 if (pm.previousSibling  &&  pm.previousSibling.innerHTML.search(reSpase) == -1  &&  pm.previousSibling.className != "subtitle"  &&  pm.previousSibling.className != "title") {
                         pm.insertAdjacentElement("beforeBegin",document.createElement("P"));
                         window.external.inflateBlock(pm.previousSibling)=true;
                         count_102++ }
                 //  Добавление пустой строки после раздела "poem"
                 if (pm.nextSibling  &&  pm.nextSibling.innerHTML.search(reSpase) == -1  &&  pm.nextSibling.className != "subtitle") {
                         pm.insertAdjacentElement("afterEnd",document.createElement("P"));
                         window.external.inflateBlock(pm.nextSibling)=true;
                         count_102++ }
                 }

         //  Удаление первых пустых строк "poem"
         while (pm.firstChild  &&  pm.firstChild.innerHTML.search(reSpase) != -1
             &&  ( pm.previousSibling  &&  pm.previousSibling.className == "subtitle"  ||  pm.previousSibling.className == "title"
                 ||  pm.firstChild.nextSibling  &&  pm.firstChild.nextSibling.innerHTML.search(reSpase) != -1 ) )
                         { pm.firstChild.removeNode(true);  count_103++ }

         //  Удаление последних пустых строк "poem"
         while (pm.lastChild  &&  pm.lastChild.innerHTML.search(reSpase) != -1
             &&  ( pm.nextSibling  &&  pm.nextSibling.className == "subtitle"
                 ||  pm.lastChild.previousSibling  &&  pm.lastChild.previousSibling.innerHTML.search(reSpase) != -1 ) )
                         { pm.lastChild.removeNode(true);  count_103++ }

         //  Удаление форматирования стихами ("poem")
         pm.removeNode(false);
         count_115++;

         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


    window.external.EndUndoUnit(document);                                             // undo конец (запись в систему для отката)

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Текущее время и дата


 var currentFullDate = new Date();

 var currentHours = currentFullDate.getHours();
 var currentMinutes = currentFullDate.getMinutes();
 var currentSeconds = currentFullDate.getSeconds();

 if (currentMinutes<10) currentMinutes = "0" + currentMinutes;
 if (currentSeconds<10) currentSeconds = "0" + currentSeconds;

 var currentDay = currentFullDate.getDate();
 var currentMonth = 1+currentFullDate.getMonth();
 var currentYear = currentFullDate.getFullYear();

 if (currentDay<10) currentDay = "‌ ‌ " + currentDay;
 if (currentMonth<10) currentMonth = "0" + currentMonth;
 currentYear = (currentYear+"").replace(/^.*?(\d{1,2})$/g, "$1");

 var currentTime = currentHours + ":" + currentMinutes + ":" + currentSeconds;
 var currentDate = currentDay + "." + currentMonth + "." + currentYear;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Подсчет чистого компьютерного времени, потраченного на обработку текста


 var Tf1=new Date().getTime();

 var T2=(Tf1-Ts1);
 var Tmin  = Math.floor((T2)/60000);
 var TsecD = ((T2)%60000)/1000;
 var Tsec = Math.floor(TsecD);

 if (Tmin ==0)
         tempus = (TsecD+"").replace(/(.{1,5}).*/g, "$1").replace(".", ",")+" сек";
     else {
             tempus = Tmin+" мин";
             if (Tsec !=0)
                     tempus += " " + Tsec+ " с" }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 // Подсчет общего количества исправлений
 var itogi = count_101+count_102+count_111+count_112+count_113+count_114+count_115;



                 /// ДОПОЛНЕНИЕ  :  Демонстрационный режим "Показать все строки"


 var dem=false;
// dem=true;   // !!!!!  активатор
 if (dem) {
         var Z="н/д";
         itogi=Z;  count_101=Z;  count_102=Z;  count_103=Z;
         count_111=Z;  count_112=Z;  count_113=Z;  count_114=Z;  count_115=Z;
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Сборка массива с результатами обработки


 var mSt=[];
 var ind=1;

                                                             mSt[ind]='• СТАТИСТИКА:';  ind++;
                                                             mSt[ind]='• Время выполнения   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+tempus;  ind++;
                                                             mSt[ind]='• Всего исправлений   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+itogi;  ind++;

 var cTaT1=ind-1;  //  число строк в первом разделе

                                                             mSt[ind]='';  ind++;
                                                             mSt[ind]='• ИСПРАВЛЕНИЯ:';  ind++;

         if (count_101!=0)             { mSt[ind]='101. Добавление пустых строк внутри стихов .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_101;  ind++ }
         if (count_102!=0)             { mSt[ind]='102. Добавление пустых строк рядом со стихами   .  .  .  .  .  .  .  .  .  .  .	'+count_102;  ind++ }
         if (count_103!=0)             { mSt[ind]='103. Удаление лишних пустых строк внутри стихов  .  .  .  .  .  .  .  .  .  .	'+count_103;  ind++ }
         if (count_111!=0)             { mSt[ind]='111. Удаление форматирования строф ("stanza")   .  .  .  .  .  .  .  .  .  .  .	'+count_111;  ind++ }
         if (count_112!=0)             { mSt[ind]='112. Удаление форматирования заголовков ("title")   .  .  .  .  .  .  .  .  .  .	'+count_112;  ind++ }
         if (count_113!=0)             { mSt[ind]='113. Удаление форматирования эпиграфов ("epigraph")   .  .  .  .  .  .  .  .	'+count_113;  ind++ }
         if (count_114!=0)             { mSt[ind]='114. Удаление форматирования "автор текста" ("text-author") .  .  .  .  .	'+count_114;  ind++ }
         if (count_115!=0)             { mSt[ind]='115. Удаление форматирования стихами ("poem")  .  .  .  .  .  .  .  .  .  .  .	'+count_115;  ind++ }

 if (cTaT1==ind-3) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в этом разделе


//  Сборка строк текущей даты и времени
                                                             mSt[ind]='				';  ind++;
                                                             mSt[ind]="  ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ "+currentDate+" ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ "+currentTime+" ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ";  ind++;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Вывод окна результатов на экран


 var st2="";  //  текст результатов

 for  ( j=1; j!=ind; j++ )
        st2=st2+'\n     '+mSt[j];  //  добавление элемента из массива


//  Вывод окна результатов
 MsgBox ('                          .·.·.·.                          –= ◊ =–                         .·.·.·.\n'+
                   '                       ·.̉·.̉·.̉  «Расформатирование всех стихов» v.'+NumerusVersion+'  .̉·.̉·.̉·                                         \n'+
                   '                           ̉   ̉   ̉                                                                       ̉   ̉   ̉ '+st2);

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



}







