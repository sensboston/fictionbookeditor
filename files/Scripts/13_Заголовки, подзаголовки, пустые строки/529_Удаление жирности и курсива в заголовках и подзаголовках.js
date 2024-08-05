//======================================
//             «Удаление жирности/курсива в заголовках и подзаголовках»
//~~~~~~~~~~~~~~~~~~
// v.1.0 — Создание скрипта — Александр Ка (21.03.2024)
//~~~~~~~~~~~~~~~~~~


var NumerusVersion="1.0";

  var Ts1=new Date().getTime();
  var tempus=0;


function Run() {

 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar }
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;" }

 var n=0;

//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------

                 ///  НАСТРОЙКИ

//--------------------------------------------------------------------

//     Удаление жирности во всех обычных заголовках

var Obrabotka_Title_St = 2;      // 0 ; 1 ; 2 //      ("0" — никогда не удалять, "1" — всегда удалять, "2" — всегда спрашивать и показывать)

//--------------------------------------------------------------------

//     Удаление курсива во всех обычных заголовках

var Obrabotka_Title_Em = 2;      // 0 ; 1 ; 2 //      ("0" — никогда не удалять, "1" — всегда удалять, "2" — всегда спрашивать и показывать)

//--------------------------------------------------------------------

//     Удаление жирности во всех подзаголовках

var Obrabotka_Subtitle_St = 2;      // 0 ; 1 ; 2 //      ("0" — никогда не удалять, "1" — всегда удалять, "2" — всегда спрашивать и показывать)

//--------------------------------------------------------------------

//     Удаление курсива во всех подзаголовках

var Obrabotka_Subtitle_Em = 2;      // 0 ; 1 ; 2 //      ("0" — никогда не удалять, "1" — всегда удалять, "2" — всегда спрашивать и показывать)

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ПОДСЧЕТ И СОХРАНЕНИЕ ПАРАГРАФОВ
                 //      (регулярные выражения)


       //  Подсчет заголовков и подзаголовков

 var count_Ttl_1 = 0;
 var count_Ttl_2 = 0;   //  в комментариях и примечаниях
 var count_sTtl  = 0;


       //  Поиск жирности/курсива

 var reSt = new RegExp("<STRONG>","g");
 var reEm = new RegExp("<EM>","g");
 var reEmSt = new RegExp("<EM>|<STRONG>","g");


       //  Подсчет выделеных строк в заголовках

  //  С жирностью
 var m_01  = [];
 var count_001  = 0;

  //  С курсивом
 var m_02  = [];
 var count_002  = 0;


       //  Подсчет выделенных строк в подзаголовках

  //  С жирностью
 var m_03  = [];
 var count_003  = 0;

  //  С курсивом
 var m_04  = [];
 var count_004  = 0;


       //  Подсчет выделенных строк в заголовках в комментариях и примечаниях
 var m_05  = [];
 var count_005  = 0;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ПОДСЧЕТ И СОХРАНЕНИЕ ПАРАГРАФОВ
                 //      (сборка функции "Vopros")


 var s="";

 function Vopros(ptr, bodyNC) {

 s=ptr.innerHTML;  // оригинальный абзац
 // В оригинальном абзаце ничего не изменяется


   if (!bodyNC  &&  ptr.parentNode.className=="title") {

           count_Ttl_1++;       //  Подсчет строк обычных заголовков

                 //  Подсчет и сохранение строк обычных заголовков с полужирным шрифтом
           if (Obrabotka_Title_St !=0  &&  s.search(reSt) !=-1) {
                   m_01[count_001]  = ptr;
                   count_001++ }

                 //  Подсчет и сохранение строк обычных заголовков с курсивом
           if (Obrabotka_Title_Em !=0  &&  s.search(reEm) !=-1) {
                   m_02[count_002]  = ptr;
                   count_002++; }
           }

   if (ptr.className=="subtitle") {

           count_sTtl++;       //  Подсчет строк подзаголовков

                 //  Подсчет и сохранение строк подзаголовков с полужирным шрифтом
           if (Obrabotka_Subtitle_St !=0  &&  s.search(reSt) !=-1) {
                   m_03[count_003]  = ptr;
                   count_003++; }

                 //  Подсчет и сохранение строк подзаголовков с курсивом
           if (Obrabotka_Subtitle_Em !=0  &&  s.search(reEm) !=-1) {
                   m_04[count_004]  = ptr;
                   count_004++ }
           }


   if (bodyNC  &&  ptr.parentNode.className=="title") {

           count_Ttl_2++;       //  Подсчет строк заголовков в комментариях и примечаниях

                 //  Подсчет и сохранение строк заголовков с жирностью или курсивом
           if (s.search(reEmSt) !=-1) {
                   m_05[count_005]  = ptr;
                   count_005++ }
           }

    }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ПОДСЧЕТ И СОХРАНЕНИЕ ПАРАГРАФОВ
                 //      (применение функции "Vopros")


                                                                           // ОТКАТ (UNDO) начало    --  1-я часть записи
    window.external.BeginUndoUnit(document,"«Удаление жирности/курсива в заголовках и подзаголовках» v."+NumerusVersion+":   Операции №091-092");


 var count_091 = 0;       //  Автоисправление вложений в параграфе (перезапись внутреннего содержимого)
 var re092 = new RegExp("STRONG|EM|SUP|SUB|STRIKE|SPAN","g");       //  Удаление внутренних тегов вне параграфа
 var count_092 = 0;


 var fbwBody=document.getElementById("fbw_body");   //  Структура текста (аннотация + история + все <body>, иначе говоря, всё это видно в режиме "B"-дизайн)
 var ptr=fbwBody;                                                           //  Начальное значение переменной "ptr"
 var bodyNC= false;                                  //  Индикатор:    параграф в "body" примечаний или комментариев
 var ProcessingEnding=false;                              //  Флаг завершения обработки

 while (!ProcessingEnding) {               //  Если конца текста не видно — продолжаем путешествие.
         if (ptr.className =="body")           //  Если встретилось "body" примечаний или комментариев...
                 if (ptr.getAttribute("fbname") !=null  &&  (ptr.getAttribute("fbname") =="notes"  ||  ptr.getAttribute("fbname") =="comments"))
                         bodyNC = true;  else bodyNC = false;   //  ...то отмечаем это.
         if (ptr.nodeName=="P"  &&  (ptr.parentNode.className=="title"  ||  ptr.className=="subtitle"))                  //  Если встретился параграф в заголовке или в подзаголовке...
                 Vopros(ptr, bodyNC);                                                                        //  ...обрабатываем его функцией "Vopros".
         if (ptr.firstChild!=null  &&  ptr.nodeName!="P")                //  Если есть куда углубляться, и это всё ещё не параграф...
                 { ptr=ptr.firstChild }                                                       //  ...тогда спускаемся на один уровень.
             else {                                                                                  //  Если углубляться нельзя...
                     nextPtr = false;
                     while (!nextPtr) {                                             //   Пока не осуществлен переход на соседний элемент...
                             while (ptr.nextSibling==null)  {                              //  ...и если нет прохода на соседний элемент...
                                     ptr=ptr.parentNode;                                           //  ...тогда поднимаемся, пока не появится этот проход.
                                     if (ptr.nodeName =="P")                                                     //   Если при подъеме оказываемся в аномальном параграфе...
                                             { ptr.innerHTML=ptr.innerHTML; count_091++ }           //   ...перезаписываем его.
                                     if (ptr==fbwBody) {ProcessingEnding=true }                 // А если поднявшись, оказываемся в "fbw_body" — объявляем о завершении обработки текста.
                                     }
                             while (ptr.nextSibling !=null  &&  ptr.nextSibling.nodeName.search(re092)!=-1)    //   Если впереди странные теги курсива и т.п...
                                     { ptr.nextSibling.removeNode(false); count_092++ }                                                             //   удаляем их все.
                             if (ptr.nextSibling !=null)  { ptr=ptr.nextSibling; nextPtr = true }            //   И если возможно, то переходим на следующий элемент
                             }
                     }
         }


    window.external.EndUndoUnit(document);                                             // undo конец (запись в систему для отката)

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ПРОСМОТР И ИЗМЕНЕНИЕ ПАРАГРАФОВ


 var r=Object();
 var otvet2=0;
 var msg1="";
 var msg2="";
 var mP=[];
 var count;
 var reSocr = new RegExp("^(.{55}).{3,}","g");       //  Сокращение строки
 var reSocr_ = "$1...";

         //  Функция перехода на начало элемента (FBE будет считать эту операцию изменением документа)
 function GoToBegin(Elem) {
 Elem5=document.createElement("ELEM");
 Elem.insertAdjacentElement("beforeBegin", Elem5);
 GoTo(Elem5);
 Elem5.removeNode(true);
 }

         //  Функция просмотра найденных строк
 function specto(msg1, mP, count) {
 n=0;
 GoToBegin(mP[n]);                                //  переход на первый элемент, сохраненный в массиве
 msg1 += "\n                  ПОКАЗАТЬ следующую строку, ан нет — так предыдущую?";    //  Вторая строка заголовка в окне
 otvet2=0;
 while (otvet2 !=2) {                     //  Окно ввода будет запускаться, пока не будет нажата кнопка "Отмена"
         msg2=" • "+(n+1)+" из "+count+" •  "+mP[n].innerHTML.replace(reSocr, reSocr_)+" ";      //   Формирование строки: " • [номер эл-та] из [общее число эл-ов] •  [внутреннее содержание эл-та]"
         otvet2 = InputBox(msg1, msg2, r);           //  Открытие окна ввода, и сохранение кода нажатой кнопки
         if (otvet2 ==6)                          //   Если нажата кнопка "Да"
                 if (n<count-1) n++;        //   увеличивается номер элемента в массиве
                     else n=0;                        //   если нельзя увеличить, то выбирается самый первый номер
         if (otvet2 ==7)                          //   Если нажата кнопка "Нет"
                 if (n>0) n--;                        //   уменьшается номер элемента в массиве
                     else n=count-1;             //   если нельзя уменьшить, то выбирается самый последний номер
         if (otvet2 !=2) GoToBegin(mP[n]) }                //   Если не нажата кнопка "Отмена", осуществляется переход на элемент с выбранным номером
 }

 var ok="";
 var m1;
 var m2;
 var Numer;

         //  Функция склонения по падежам в зависимости от числа
 function pad(Numer) {
 ok=2;
 m1=Numer % 10;
 m2=Numer % 100;
 if (m2<11 || m2>19) {
         if (m1==1) ok=0;
         else  if (m1==2 || m1==3 || m1==4) ok=1;    }
 }


         //   Вопросы к пользователю

 var Budut_ochishheny = [ "Будет очищена ", "Будут очищены ", "Будут очищены " ];
 var strok = [ " строка", " строки", " строк" ];
 var zagolovkov = [ " заголовка", " заголовков", " заголовков" ];
 var podzagolovkov = [ " подзаголовка", " подзаголовков", " подзаголовков" ];

 var otvet;

 var re101 = new RegExp("</{0,1}STRONG>","g");       //  Удаление жирности
 var re102 = new RegExp("</{0,1}EM>","g");       //  Удаление курсива
 var re103 = new RegExp("</{0,1}STRONG>","g");       //  Удаление жирности
 var re104 = new RegExp("</{0,1}EM>","g");       //  Удаление курсива
 var re105 = new RegExp("</{0,1}EM>|</{0,1}STRONG>","g");       //  Удаление курсива и жирности

 var count_101 = 0;  var count_102 = 0;  var count_103 = 0;  var count_104 = 0;  var count_105 = 0;


         //  Снятие показания времени перед открытием окон
  var Tf1=new Date().getTime();
  var Ts2=0;  var Tf2=0;  var Ts3=0;  var Tf3=0;  var Ts4=0;  var Tf4=0;  var Ts5=0;  var Tf5=0;


    window.external.BeginUndoUnit(document,"«Удаление жирности/курсива в заголовках и подзаголовках» v."+NumerusVersion);                               // ОТКАТ (UNDO) начало


 if (count_001 !=0)  {
         otvet =2;
         while (otvet ==2  &&  Obrabotka_Title_St ==2) {
                 specto("                                     ◊  ЖИРНОСТЬ в ЗАГОЛОВКАХ  ◊", m_01, count_001);
                 msg1="                                     ◊  ЖИРНОСТЬ в ЗАГОЛОВКАХ  ◊"+
                              "\n                                                    ОЧИСТИТЬ?";
                 pad(count_001);
                 msg2=" • "+Budut_ochishheny[ok]+count_001+strok[ok]+zagolovkov[ok]+" • ";
                 otvet = InputBox(msg1, msg2, r); }
         if (otvet ==6  ||  Obrabotka_Title_St ==1) {
                 Ts2=new Date().getTime();
                 for ( n=0; n<count_001; n++) {
                         m_01[n].innerHTML=m_01[n].innerHTML.replace(re101, "");
                         count_101++ }
                 Tf2=new Date().getTime() }
         }

 if (count_002 !=0)  {
         otvet =2;
         pad(count_002);
         while (otvet ==2  &&  Obrabotka_Title_Em ==2) {
                 specto("                                         ◊  КУРСИВ в ЗАГОЛОВКАХ  ◊", m_02, count_002);
                 msg1="                                         ◊  КУРСИВ в ЗАГОЛОВКАХ  ◊"+
                              "\n                                                    ОЧИСТИТЬ?";
                 msg2=" • "+Budut_ochishheny[ok]+count_002+strok[ok]+zagolovkov[ok]+" • ";
                 otvet = InputBox(msg1, msg2, r); }
         if (otvet ==6  ||  Obrabotka_Title_Em ==1) {
                 Ts3=new Date().getTime();
                 for ( n=0; n<count_002; n++) {
                         m_02[n].innerHTML=m_02[n].innerHTML.replace(re102, "");
                         count_102++ }
                 Tf3=new Date().getTime() }
         }

 if (count_003 !=0)  {
         otvet =2;
         pad(count_003);
         while (otvet ==2  &&  Obrabotka_Subtitle_St ==2) {
                 specto("                                  ◊  ЖИРНОСТЬ в ПОДЗАГОЛОВКАХ  ◊", m_03, count_003);
                 msg1="                                  ◊  ЖИРНОСТЬ в ПОДЗАГОЛОВКАХ  ◊"+
                              "\n                                                    ОЧИСТИТЬ?";
                 msg2=" • "+Budut_ochishheny[ok]+count_003+strok[ok]+podzagolovkov[ok]+" • ";
                 otvet = InputBox(msg1, msg2, r); }
         if (otvet ==6  ||  Obrabotka_Subtitle_St ==1) {
                 Ts4=new Date().getTime();
                 for ( n=0; n<count_003; n++) {
                         m_03[n].innerHTML=m_03[n].innerHTML.replace(re103, "");
                         count_103++ }
                 Tf4=new Date().getTime() }
         }

 if (count_004 !=0)  {
         otvet =2;
         pad(count_004);
         while (otvet ==2  &&  Obrabotka_Subtitle_Em ==2) {
                 specto("                                    ◊  КУРСИВ в ПОДЗАГОЛОВКАХ  ◊", m_04, count_004);
                 msg1="                                    ◊  КУРСИВ в ПОДЗАГОЛОВКАХ  ◊"+
                              "\n                                                    ОЧИСТИТЬ?";
                 msg2=" • "+Budut_ochishheny[ok]+count_004+strok[ok]+podzagolovkov[ok]+" • ";
                 otvet = InputBox(msg1, msg2, r); }
         if (otvet ==6  ||  Obrabotka_Subtitle_Em ==1) {
                 Ts5=new Date().getTime();
                 for ( n=0; n<count_004; n++) {
                         m_04[n].innerHTML=m_04[n].innerHTML.replace(re104, "");
                         count_104++ }
                 Tf5=new Date().getTime() }
         }


         //  Снятие показания времени после закрытия окон
var Ts6=new Date().getTime();


         for ( n=0; n<count_005; n++) {
                 m_05[n].innerHTML=m_05[n].innerHTML.replace(re105, "");
                 count_105++ }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


    window.external.EndUndoUnit(document);                                             // undo конец (запись в систему для отката)


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


 var Tf6=new Date().getTime();

 var T2=(Tf1-Ts1)+(Tf2-Ts2)+(Tf3-Ts3)+(Tf4-Ts4)+(Tf5-Ts5)+(Tf6-Ts6);
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



                 /// ДОПОЛНЕНИЕ _2_  :  Демонстрационный режим "Показать все строки"


 var dem=false;
 var Exemplar="н/д";
// dem=true;   // !!!!!  активатор
 if (dem) {
          count_Ttl_1=Exemplar;  count_Ttl_2=Exemplar;  count_sTtl=Exemplar;
          count_101=Exemplar;  count_102=Exemplar;  count_103=Exemplar;  count_104=Exemplar;  count_105=Exemplar;
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Сборка массива с результатами обработки


 var mSt=[];
 var ind=1;

                                                             mSt[ind]='• СТАТИСТИКА:';  ind++;
                                                             mSt[ind]='• Время выполнения  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+tempus;  ind++;
 if (count_Ttl_1!=0) {
      if (count_Ttl_2==0 || dem){ mSt[ind]='• Строк заголовков  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_Ttl_1;  ind++ }
      if (count_Ttl_2!=0)               { mSt[ind]='• Строк обычных заголовков  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_Ttl_1;  ind++ }    }
 if (count_Ttl_2!=0)                    { mSt[ind]='• Строк заголовков примечаний/комментариев  .  .  .  .  .  .  .  .	'+count_Ttl_2;  ind++ }
 if (count_sTtl!=0)                       { mSt[ind]='• Строк подзаголовков  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_sTtl;  ind++ }

 var cTaT1=ind-1;  //  число строк в первом разделе

                                                             mSt[ind]='';  ind++;
                                                             mSt[ind]='• ЧИСТКА СТРУКТУРЫ:';  ind++;
         if (count_091!=0)             { mSt[ind]='091. Перезапись параграфов .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_091;  ind++ }
         if (count_092!=0)             { mSt[ind]='092. Удаление внутренних тегов вне параграфа   .  .  .  .  .  .  .  .  .  .  .	'+count_092;  ind++ }

 if (cTaT1==ind-3) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов "ЧИСТКА СТРУКТУРЫ"
 var cTaT2=ind-1;  //  число строк в 2-х разделах

                                                             mSt[ind]='';  ind++;
                                                             mSt[ind]='• УДАЛЕННОЕ ФОРМАТИРОВАНИЕ:';  ind++;
 if (count_101!=0)                      { mSt[ind]='101. Жирность в заголовках  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_101;  ind++ }
 if (count_102!=0)                      { mSt[ind]='102. Курсив в заголовках .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_102;  ind++ }
 if (count_103!=0)                      { mSt[ind]='103. Жирность в подзаголовках   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_103;  ind++ }
 if (count_104!=0)                      { mSt[ind]='104. Курсив в подзаголовках  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_104;  ind++ }
 if (count_105!=0)                      { mSt[ind]='105. Формат в заголовках примечаний/комментариев .  .  .  .  .	'+count_105;  ind++ }

 if (cTaT2==ind-3) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов "УДАЛЕННОЕ ФОРМАТИРОВАНИЕ"

 if (cTaT1==ind-1) {                      //   Добавление двух текстовых строк, если кроме "статистики" ничего нет
                                                             mSt[ind]='';  ind++;
                                                             mSt[ind]="                        ошибки в оформлении не обнаружены";  ind++ }

                                                             mSt[ind]='';  ind++;
                                                             mSt[ind]=" ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ "+currentDate+" ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ "+currentTime+" ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ";  ind++;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Вывод окна результатов на экран


 var st2="";  //  текст результатов

 for  ( n=1; n!=ind; n++ )
        st2=st2+'\n    '+mSt[n];  //  добавление элемента из массива


//  Вывод окна результатов
 MsgBox ('     .·.·.·.                                       –= ◊ =–                                       .·.·.·.\n'+
                    '  ·.̉·.̉·.̉  «Жирность/курсив в заголовках и подзаголовках» v.'+NumerusVersion+'  .̉·.̉·.̉·                   \n'+
                   '      ̉   ̉   ̉                                                                                                  ̉   ̉   ̉ '+st2);

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



}







