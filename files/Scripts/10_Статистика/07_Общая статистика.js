//======================================
//             «Общая статистика»
// Скрипт тестировался в FBE v.2.7.7 (win XP, IE8 и win 7, IE11)
//======================================
// Скрипт предназначен для наиболее полного отображения статистических данных о файле FB2
// * История изменений в конце скрипта
//======================================

function Run() {

 var ScriptName="«Общая статистика»";
 var NumerusVersion="1.4";
 var Ts=new Date().getTime();

// ---------------------------------------------------------------
                 ///  НАСТРОЙКИ
// ---------------------------------------------------------------

         //   •  Максимум строк в окне результатов
//  * Скрипт постарается не превышать это значение.

 var Vysota_teksta = 50;      // 0-50 (примерно)  //      Число строк в окне результатов.

// * Для монитора 1024х768 максимальная высота окна равна 52 строкам (в win XP) и 50 строк (в win 7).
// ** Высота одной строки равна 13 пикселям, плюс рамка 87 пикселей (в win XP) или 116 пикселей (в win 7).

// ---------------------------------------------------------------

       //   •  Сохранение текста статистики

 var SaveStat = 0;      // 0 ; 1 ; 2 //
//  "0" — отключить
//  "1" — сохранить в буфер обмена
//  "2" — сохранить в TXT-файл (кодировка "UTF-16 LE")

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОБЩИЕ ПЕРЕМЕННЫЕ

 var nbspEntity="&nbsp;";
 try { var nbspChar=window.external.GetNBSP();  if (nbspChar.charCodeAt(0)!=160)  nbspEntity=nbspChar }
 catch(e) { var nbspChar=String.fromCharCode(160) }

 var fbwBody=document.getElementById("fbw_body");   //  Структура текста (аннотация + история + все <body>, иначе говоря, всё это видно в режиме "B"-дизайн)

 var n=0;  //   Локальная переменная для небольших областей
 var k=0;  //   Локальная переменная для небольших областей
 var j=0;  //   Локальная переменная для небольших областей

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ФУНКЦИЯ "Генератор случайных чисел, с округлением"

 function Rn_(rndN) {
         return Math.floor(("0000000"+Math.tan(Ts+Math.random()*2000)).replace(/[\.\-]/g, "").replace(/.+(\d\d\d\d\d\d)\d$/g, "0.$1")*rndN);  //  Генерация случайных чисел от 0 до "rndN".
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ПОИСК И ПОДСЧЕТ
                 //      (регулярные выражения)

          // Разделы

// Подзаголовки
 var count_subt = [0,0,0,0];    //  Количество групп подзаголовков
 var count_subt_p = [0,0,0,0];    //  Количество строк
 var count_subtSp = [0,0,0,0];    //  Подзаголовков с пустыми строками
 var subt_  = false;                          //  Признак подзаголовка для строки

// Автор текста
 var count_tAut = [0,0,0,0];    //  Невалидное форматирование "автор текста" (групп)
 var count_tAut_p = [0,0,0,0];    //  Невалидное форматирование "автор текста" (строк)
 var count_tAutPoem = [0,0,0,0];    //   "автор текста" в стихах (групп)
 var count_tAutPoem_p = [0,0,0,0];    //   "автор текста" в стихах (строк)
 var count_tAutCite = [0,0,0,0];    //   "автор текста" в цитатах (групп)
 var count_tAutCite_p = [0,0,0,0];    //   "автор текста" в цитатах (строк)
 var count_tAutEpig = [0,0,0,0];    //   "автор текста" в эпиграфах (групп)
 var count_tAutEpig_p = [0,0,0,0];    //   "автор текста" в эпиграфах (строк)
 var textAuthor_ = false;    //  Признак формата "автор текста"

// Заголовки
 var count_titleSp = [0,0,0,0];     //  Счетчик пустых строк в заголовках
 var Ttl_ = false;                    //  Признак строки в заголовках

// Эпиграфы
 var count_epigSp = [0,0,0,0];
 var epig_ = false;

// Стихи
 var count_poemSp = [0,0,0,0];
 var poem_ = false;

// Обычный текст
 var count_txt = [0,0,0,0];

// Пустые строки
 var reSp = new RegExp("^(\\\s|"+nbspEntity+"|&nbsp;){0,}$","g");
 var count_Sp = [0,0,0,0];


          // Внутренние теги

// Курсив;  Жирность;  Жирный курсив
 var reEm = new RegExp("<EM>","g");
 var reSt = new RegExp("<STRONG>","g");
 var mEm = [];
 var mStr = [];    //  Два массива, необходимые для определения жирного курсива
 var count_Em = 0;
 var count_St = 0;
 var count_EmSt = 0;

// Верхний индекс
 var reA10 = new RegExp("<SUP>","g");
 var count_A10 = 0;

// Нижний индекс
 var reA11 = new RegExp("<SUB>","g");
 var count_A11 = 0;

// Зачеркивание
 var reA12 = new RegExp("<STRIKE>","g");
 var count_A12 = 0;

//  Код
 var reA13 = new RegExp("<SPAN class=code>","g");
 var count_A13 = 0;

//  Стиль
 var reA14 = new RegExp("<SPAN class=(?!code>|image )","g");
 var count_A14 = 0;

// Сноски на примечания
 var reNot = new RegExp("<A class=note","g");
 var count_Not = 0;

// Сноски на комментарии
 var reCom = new RegExp("#c_\\\d{1,3}\\\">[^A]{1,}?</A>","g");
 var count_Com = 0;

//  Ссылка
 var reA15 = new RegExp("</A>","g");  //  * потом из общего количества вычитаются сноски
 var count_A15 = 0;


          // Символы

// Квадратные скобки
 var reA30 = new RegExp("[\\\[]","g");
 var A30_  = false;

// Фигурные скобки
 var reA32 = new RegExp("[\\\{]","g");
 var A32_  = false;


//   Угловая кавычка (левая)
 var reA41 = new RegExp("(«)","g");
 var count_A41 = 0;

//   Угловая кавычка (правая)
 var reA42 = new RegExp("(»)","g");
 var count_A42 = 0;

// Внутренняя кавычка (левая)
 var reA43 = new RegExp("„","g");
 var count_A43 = 0;

// Внутренняя кавычка (правая)
 var reA44 = new RegExp("“","g");
 var count_A44 = 0;

// Простые кавычки
 var reA45 = new RegExp("(\\\")","g");
 var count_A45 = 0;


          // Разное

// Выделение разрядкой
 var reA80 = new RegExp("(\\\s|"+nbspChar+")([А-яA-Za-zЁё0-9](\\\s|"+nbspChar+")){4,}","g"); //  4 раздельные буквы
 var count_A80 = 0;

// Латиница в кириллице
 var reA81 = new RegExp("([a-z][а-яё]|[а-яё][a-z])","gi");
 var count_A81 = 0;

// Звездочка в начале строки
 var reA83 = new RegExp("^(\\\s|"+nbspChar+"){0,}\\\*.{0,10}[А-яA-Za-zЁё]","g");
 var count_A83 = 0;


// [ + буква
 var reA91 = new RegExp("\\\[[^\\\]]{0,10}[А-яA-Za-zЁё]","g");
 var count_A91 = 0;

// Фигурная скобка + буква
 var reA92 = new RegExp("\\\{[^\\\}]{0,10}[А-яA-Za-zЁё]","g");
 var count_A92 = 0;

// [число]
 var reA93 = new RegExp("\\\[[0-9]{1,4}\\\]","g");
 var count_A93 = 0;
	// [число]  в сноске
	 var reA93a = new RegExp("\\\[[0-9]{1,4}\\\]</A>","g");
	 var count_A93a = 0;

// {число}
 var reA94 = new RegExp("\\\{[0-9]{1,4}\\\}","g");
 var count_A94 = 0;
	// {число}  в сноске
	 var reA94a = new RegExp("\\\{[0-9]{1,4}\\\}</SUP></A>","g");
	 var count_A94a = 0;

// Большие числа
// * Почти точная формула из соответствующего скрипта
 var reA95 = new RegExp("(^|[^\\\d\\\-N№/])(\\\d{2,3}(\\\s|\\\.){0,2}\\\d{3}|\\\d{1,3}((\\\s|\\\.){0,2}\\\d{3}){2,5})([^0-9/]|$)","g");
 var count_A95 = 0;

// Слово + число  (с учетом пунктуации)
 var reA96 = new RegExp("[а-яa-zё]{3,}[…\\\.,:;\\\?!»“”\\\"]{0,4}\\\d{1,4}([…\\\.,:;\\\?!\\\)\\\]»“”\\\"'—–\\\-]|\\\s|"+nbspChar+"|$)","g");
 var count_A96 = 0;

// Строчные буквы в начале строки
 var reA97 = new RegExp("^[а-яa-zё]{2}","g");
 var count_A97 = 0;


          // Для подсчета всех символов
 var count_littera = 0;

          // Для подсчета всех слов
 var reWord = new RegExp("(^|\\\s|"+nbspChar+").{0,}?[А-яA-Za-zЁё].{0,}?(?=\\\s|"+nbspChar+"|$)","g");
 var count_Word = 0;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ПОИСК И ПОДСЧЕТ  :  Параграфы <P>
                 //      (сборка функции "HandleP")

 var s="";
 var sct="";  // Копия абзаца без тегов и кодовых записей символов (типа "&nbsp;")
 var tip;   // Тип корневого раздела
 var ptr;  // Элемент: <p>


 function HandleP(ptr, tip) {

   s=ptr.innerHTML;
   sct=ptr.innerText;


// Поиск и подсчет внешнего форматирования

   Ttl_=(ptr.parentNode.className=="title");         //   Заголовки
   subt_ = (ptr.className=="subtitle");         //   Подзаголовки
   poem_=(ptr.parentNode.className=="stanza")         //   Стихи
   epig_=(ptr.parentNode.className=="epigraph")         //   Эпиграф
   textAuthor_ = (ptr.className=="text-author");         //   Автор текста

   if (subt_) {
           count_subt_p[tip]++;
           if (ptr.nextSibling == null  ||  ptr.nextSibling != null  &&  ptr.nextSibling.className != "subtitle")  count_subt[tip]++ }

   if (textAuthor_) {
           switch (ptr.parentNode.className) {
                   case "poem":  {
                           count_tAutPoem_p[tip]++;
                           if (ptr.nextSibling == null  ||  ptr.nextSibling != null  &&  ptr.nextSibling.className != "text-author")  count_tAutPoem[tip]++;
                           break }
                   case "cite":  {
                           count_tAutCite_p[tip]++;
                           if (ptr.nextSibling == null  ||  ptr.nextSibling != null  &&  ptr.nextSibling.className != "text-author")  count_tAutCite[tip]++;
                           break }
                   case "epigraph":  {
                           count_tAutEpig_p[tip]++;
                           if (ptr.nextSibling == null  ||  ptr.nextSibling != null  &&  ptr.nextSibling.className != "text-author")  count_tAutEpig[tip]++;
                           break }
                   default:  {
                           count_tAut_p[tip]++;
                           if (ptr.nextSibling == null  ||  ptr.nextSibling != null  &&  ptr.nextSibling.className != "text-author")  count_tAut[tip]++;
                           break }
                   }    }

   if (!subt_  &&  !textAuthor_  &&  ptr.parentNode.className=="section")    count_txt[tip]++;         //   Обычный текст


// Поиск и подсчет пустых строк

   if (s.search(reSp)!=-1) {
           count_Sp[tip]++;   //   Пустые строки, всего
           if (Ttl_)    count_titleSp[tip]++;         //   Пустые строки в заголовках
           if (subt_)    count_subtSp[tip]++;         //   Пустые строки в подзаголовках
           if (poem_)    count_poemSp[tip]++;         //   Пустые строки в стихах
           if (epig_)    count_epigSp[tip]++;         //   Пустые строки в эпиграфе
           }

   count_littera+=sct.length;         //   Все символы
   if (sct.search(reWord)!=-1)    count_Word+=sct.match(reWord).length;        //   Все слова


   if (divUp.search(/h/)!=-1)  return;   //  Выход из функции если это раздел истории


          // Внутренние теги

   if (s.search("<")!=-1)  {

           mEm = ptr.getElementsByTagName("EM");
           count_Em += mEm.length;                                                     // Курсив
           for  (j=0; j<mEm.length; j++)
                   if (mEm[j].innerHTML.search(reSt)!=-1)
                           count_EmSt += mEm[j].innerHTML.match(reSt).length;      // Жирный курсив

           mStr = ptr.getElementsByTagName("STRONG");
           count_St += mStr.length;                                                           // Жирность
           for  (j=0; j<mStr.length; j++)
                   if (mStr[j].innerHTML.search(reEm)!=-1)
                           count_EmSt += mStr[j].innerHTML.match(reEm).length;      // Жирный курсив

           if (s.search(reA10)!=-1)    count_A10+=s.match(reA10).length;      // Верхний индекс
           if (s.search(reA11)!=-1)    count_A11+=s.match(reA11).length;      // Нижний индекс
           if (s.search(reA12)!=-1)    count_A12+=s.match(reA12).length;      // Зачеркивание
           if (s.search(reA13)!=-1)    count_A13+=s.match(reA13).length;      // Код
           if (s.search(reA14)!=-1)    count_A14+=s.match(reA14).length;      // Стиль
           if (s.search(reNot)!=-1)    count_Not+=s.match(reNot).length;      // Сноски на примечания
           if (s.search(reCom)!=-1)    count_Com+=s.match(reCom).length;      // Сноски на комментарии
           if (s.search(reA15)!=-1)    count_A15+=s.match(reA15).length;      // Ссылка
           }

   if (sct.search(reA41)!=-1)    count_A41+=sct.match(reA41).length;        //   «
   if (sct.search(reA42)!=-1)    count_A42+=sct.match(reA42).length;        //   »
   if (sct.search(reA43)!=-1)    count_A43+=sct.match(reA43).length;        //   „  (левая)
   if (sct.search(reA44)!=-1)    count_A44+=sct.match(reA44).length;         //  “  (правая)
   if (sct.search(reA45)!=-1)    count_A45+=sct.match(reA45).length;         //  "


   if (sct.search(reA80)!=-1)    count_A80+=sct.match(reA80).length;        // Выделение разрядкой
   if (sct.search(reA81)!=-1)    count_A81+=sct.match(reA81).length;        // Латиница в кириллице
   if (!subt_ && !Ttl_) if (sct.search(reA83)!=-1)    count_A83++;         // *  в начале строки

   A30_= (sct.search(reA30)!=-1);         //   [
   A32_= (sct.search(reA32)!=-1);         //   Фигурная скобка

   if (A30_)  if (sct.search(reA91)!=-1)    count_A91+=sct.match(reA91).length         // [ + буква
   if (A32_)  if (sct.search(reA92)!=-1)    count_A92+=sct.match(reA92).length;         // Фигурная скобка + буква

   if (A30_) if (sct.search(reA93)!=-1)  {
           count_A93+=sct.match(reA93).length;         // [число]
           if (s.search(reA93a)!=-1)    count_A93a+=s.match(reA93a).length;    }         // [число]  в теге сноски
   if (A32_) if (sct.search(reA94)!=-1)  {
           count_A94+=sct.match(reA94).length;         // {число}
           if (s.search(reA94a)!=-1)    count_A94a+=s.match(reA94a).length;    }         // {число}  в теге сноски

   if (s.search(reA95)!=-1)    count_A95+=s.match(reA95).length;         // Большие числа
   if (sct.search(reA96)!=-1)    count_A96+=sct.match(reA96).length;         // Строчная бука + число
   if (!poem_  &&  sct.search(reA97)!=-1)    count_A97+=sct.match(reA97).length;         // Строчная буква в начале строки

   }   //  Конец создания функции "HandleP(ptr)"

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ПОИСК И ПОДСЧЕТ  :  Разделы "DIV"

 var mDiv=fbwBody.getElementsByTagName("DIV");  //  Массив с узлами "DIV"
 var div;           //  Один из разделов
 var mDivUp=[];        //  Массив с корнями узлов "DIV"
 var divUp="";        //  Корни одного из элементов "DIV"
 var mP;        //  Массив с параграфами корневого узла

 var VersionFile=document.getElementById("diVersion").value;  // Версия файла
 var VersionH=false;  // Присутствие в истории номера версии файла

 var count_body=0;  //  Счетчик обычных <body>
 var count_body_p=0;  //  Счетчик строк в обычных <body>
 var count_boNC=0;  //  Счетчик <body> примечаний и комментариев
 var count_boNC_p=0;  //  Счетчик строк в <body> примечаний и комментариев
 var count_hist=0;  //  Счетчик разделов <history>
 var count_hist_p=0;  //  Счетчик строк в разделах <history>
 var count_anotFB=0;  //  Счетчик аннотаций к книге
 var count_anotFB_p=0;  //  Счетчик строк аннотации к книге
 var count_X=0;  //  Счетчик непонятных корневых разделов
 var count_X_p=0;  //  Счетчик строк в непонятных корневых разделов
 var count_sect = [ [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0] ];  //  Счетчик разделов <section> по уровням
 var count_titl = [ [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0] ];  //  Счетчик заголовков по уровням
 var count_titl_p = [ [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0] ];  //  Счетчик строк в заголовках по уровням
 var count_titlPoem = [0,0,0,0];  //  Счетчик заголовков для стихов
 var count_titlPoem_p = [0,0,0,0];  //  Счетчик строк в заголовках для стихов
 var count_epig = [ [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0] ];  //  Счетчик эпиграфов по уровням
 var count_epig_p = [ [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0] ];  //  Счетчик строк в эпиграфах по уровням
 var count_epigPoem = [0,0,0,0];  //  Счетчик эпиграфов для стихов
 var count_epigPoem_p = [0,0,0,0];  //  Счетчик строк в эпиграфах для стихов
 var count_anot = [ [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0] ];  //  Счетчик аннотаций по уровням
 var count_anot_p = [ [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0] ];  //  Счетчик строк в аннотациях по уровням
 var count_xxx = [0,0,0,0];  //  Счетчик непонятных внутренних разделов
 var count_xxx_p = [0,0,0,0];  //  Счетчик строк в непонятных внутренних разделов
 var count_poem = [0,0,0,0];  //  Счетчик стихов
 var count_poem_p = [0,0,0,0];  //  Счетчик строк в стихах
 var count_stan = [0,0,0,0];  //  Счетчик строф
 var count_stan_p = [0,0,0,0];  //  Счетчик строк в строфах
 var count_cite = [0,0,0,0];  //  Счетчик цитат
 var count_cite_p = [0,0,0,0];  //  Счетчик строк в цитатах
 var count_tabl = [0,0,0,0];  //  Счетчик таблиц
 var count_tr = [0,0,0,0];  //  Счетчик строк в таблицах
 var count_tabl_p = [0,0,0,0];  //  Счетчик ячеек в таблицах


         //  Создание краткой записи дерева разделов над любым узлом DIV

 for (n=0; n<mDiv.length; n++) {   //  Цикл просматривающий все разделы  DIV
         div = mDiv[n];
         divUp="";

         while(div != fbwBody) {     //  Цикл, просматривающий все разделы до самого верха
                 switch (div.className) {
                         case "stanza":  { divUp+="s";   break }
                         case "poem":  { divUp+="p";   break }
                         case "cite":  { divUp+="c";   break }
                         case "section":  { divUp+="S";   break }
                         case "title":  { divUp+="T";   break }
                         case "epigraph":  { divUp+="e";   break }
                         case "image":  { divUp+="i";   break }
                         case "table":  { divUp+="t";   break }
                         case "tr":  { divUp+="r";   break }
                         case "annotation":  {
                                 if (div.parentNode != fbwBody)  divUp+="a";   //  Аннотация для секции
                                     else  divUp+="A";                                //  Аннотация для всей книги
                                 break }
                         case "body":  {
                                 if (div.parentNode != fbwBody)  { divUp+="x";  break }        //  x  — непонятный раздел
                                 switch(div.getAttribute("fbname")) {
                                         case "notes":
                                         case "comments":  { divUp+="b";  break }    //  Боди примечаний или комментариев
                                         default:  { divUp+="B";  break }    }                    //  Общее боди
                                 break }
                         case "history":  {
                                 if (div.parentNode != fbwBody)  divUp+="x";    //  <history> в неположенном месте -- непонятный раздел "x"
                                     else  divUp+="h";
                                 break }
                         default:  divUp+="x";      //   Всё, что не учтено -- на всё ставится метка непонятного раздела
                         }
                 div = div.parentNode;
                 }

         div = mDiv[n];

         //  Определение типа раздела DIV по принадлежности к корневому разделу
         if (divUp.search(/[Ah]/)!=-1)  tip=0;     //  Аннотация к книге или история
             else if (divUp.search(/B/)!=-1)  tip=1;     //  Основное боди
                 else if (divUp.search(/b/)!=-1)  tip=2;     //  Боди примечаний или комментариев
                     else tip=3;                                                       //  Непонятный корневой раздел

         //  Обзор корневых разделов
         if (divUp.length == 1) {
                 mP = div.getElementsByTagName("P");   //  Получение всех параграфов корневого раздела
                 for ( k=0; k<mP.length; k++)
                         HandleP(mP[k], tip);                 //  Применение к каждому параграфу функции "HandleP"
                 switch (divUp) {                           //  Определение и подсчет корневых разделов
                         case "A": { count_anotFB++;  count_anotFB_p += mP.length;  break }
                         case "h": { count_hist++;  count_hist_p += mP.length;
                               VersionH = div.innerText.search(VersionFile)!=-1;
                               break }
                         case "B": { count_body++;  count_body_p += mP.length;  break }
                         case "b": { count_boNC++;  count_boNC_p += mP.length;  break }
                         default: { count_X++;  count_X_p += mP.length;  break }
                         }
                 }

         //  Подсчет остальных разделов, с учетом уровня вложения
         if (divUp.length > 1) {
                 if (divUp.search(/S./g) == -1) k=0;
                     else { k=divUp.match(/S(?=.)/g).length;  if (k>5) k=5 }
                 switch (divUp.replace(/(^.).+$/g, "$1")) {
                         case "S": { count_sect[tip][k]++;  break }
                         case "T": {                  //  Раздельный подсчет заголовков секций и заголовков в стихах
                                 if (divUp.search(/p/g)!=-1)  { count_titlPoem[tip]++;  count_titlPoem_p[tip]+=div.getElementsByTagName("P").length }
                                     else { count_titl[tip][k]++;  count_titl_p[tip][k]+=div.getElementsByTagName("P").length }
                                 break }
                         case "e": {                  //  Раздельный подсчет обычных эпиграфов и эпиграфов в стихах
                                 if (divUp.search(/p/g)!=-1)  { count_epigPoem[tip]++;  count_epigPoem_p[tip]+=div.getElementsByTagName("P").length }
                                     else { count_epig[tip][k]++;  count_epig_p[tip][k]+=div.getElementsByTagName("P").length }
                                 break }
                         case "a": { count_anot[tip][k]++;  count_anot_p[tip][k]+=div.getElementsByTagName("P").length;  break }
                         case "x": { count_xxx[tip]++;  count_xxx_p[tip]+=div.getElementsByTagName("P").length;  break }
                         case "p": { count_poem[tip]++;  count_poem_p[tip]+=div.getElementsByTagName("P").length;  break }
                         case "s": { count_stan[tip]++;  count_stan_p[tip]+=div.getElementsByTagName("P").length;  break }
                         case "c": { count_cite[tip]++;  count_cite_p[tip]+=div.getElementsByTagName("P").length;  break }
                         case "i": { break }                  //  Подсчет иллюстраций производится в другом месте
                         case "t": { count_tabl[tip]++;  count_tabl_p[tip]+=div.getElementsByTagName("P").length;  break }
                         case "r": { count_tr[tip]++;  break }
                         }
                 }
         }      //   Конец для   "цикл просматривающий все разделы  DIV"


         //  Поиск параграфов "P" без корневого раздела
 var count_no_p=0;
 mP=fbwBody.children;
         for ( k=0; k<mP.length; k++)
                 if (mP[k].nodeName =="P") {
                         count_no_p++;
                         HandleP(mP[k], 3) }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ПОИСК И ПОДСЧЕТ  :  Вложенные файлы (бинарные объекты)

 var binobj=document.getElementById("binobj");      //  Раздел с информацией о вложенных файлах
 var mBin=binobj.getElementsByTagName("DIV");  //  Массив с отдельными блоками для файлов
 var count_Bin=mBin.length;  //  Счетчик для всех вложенных файлов

 var mBinName=[];  //  Массив с именами файлов
 var mBinType=[];  //  Массив с описанием файлов
 var mBinSize=[];  //  Массив с размерами всех файлов
 var mBinDims=[];  //  Массив с габаритами всех изображений

         //  Получение записей о бинарных файлах:  Имя;  Тип;  Размер (в байтах);  Размер  (габариты изображения)
 for (n=0;  n<count_Bin;  n++) {
         mBinName[n]=mBin[n].all.id.value;
         mBinType[n]=mBin[n].all.type.value;
         mBinSize[n]=mBin[n].all.size.value;
         if (mBin[n].all.dims)  mBinDims[n]=mBin[n].all.dims.value;
             else  mBinDims[n]="х";          //  Для невалидных файлов нет записей о размере изображения
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ПОИСК И ПОДСЧЕТ  :  Совпадения в файлах

 var count_BinRepit=0;  //  Счетчик повторного вложения одного и того же файла

 //  Сравнивание размеров:  в байтах, и в пикселях (габариты)
 for (n=0;  n<count_Bin;  n++)
         for (k=n+1;  k<count_Bin;  k++)         //  Вложенный цикл уменьшен, чтобы файл не сравнивался с самим собой
                 if (mBinDims[n] != "х"  &&  mBinDims[n] == mBinDims[k]  &&  mBinSize[n] == mBinSize[k]) {
                         count_BinRepit++;
                         break }                   //  Один файл может быть идентифицирован как "копия" только один раз

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// Функция подсчета изображений по расширению (jpg, png, невалидный формат)

 function Raspredelenie (massiv, tipF) {                    // Распределение (массив, описание файла)
     massiv[0]++;                                                                             // Всего
     switch (tipF) {
             case "image/jpeg":  { massiv[1]++;   break }                   // jpg
             case "image/png":  { massiv[2]++;   break }                   // png
             default:            { massiv[3]++;   break }    }                        // Другие форматы
     }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ПОИСК И ПОДСЧЕТ  :  Разделы "IMG"

 var mImg=fbwBody.getElementsByTagName("IMG");  //  Массив с узлами "IMG"
 var Img;                   //  Одна из картинок (внешний раздел)
 var mImgHref=[];             //  Массив с именами картинок
 var imgName;                      //  Одно из имен
 var count_divImg=[0, 0, 0, 0];  //  Счетчики для отдельных картинок [всего, jpg, png, другие форматы]
 var count_spanImg=[0, 0, 0, 0];  //  Счетчики для картинок в строке [всего, jpg, png, другие форматы]
 var count_zeroImg=0;  //  Счетчик пустых картинок
 var count_titleImg=0;  //  Счетчик внутренних заголовков картинок

 var count_BinImg=0;  //  Счетчик файлов иллюстраций
 var count_BinCov=0;  //  Счетчик файлов обложек
 var mBinLabel=[];  //  Массив с отметками об использовании файлов
 for (k=0;  k<count_Bin;  k++) mBinLabel[k]="не исп";  //  Заполнение этого массива

aaa:
 for (n=0;  n<mImg.length;  n++) {              //  Цикл для всех иллюстраций
         Img=mImg[n].parentNode;                       //  Будет читаться только внешний раздел картинок
         while (Img != fbwBody  &&  Img.className != "image") Img=Img.parentNode;   //  * иногда между внешним и внутренним разделом встречаются посторонние разделы
         imgName=Img.getAttribute("href").replace(/^#/, "");        //  Получение имени картинки
         for (k=0;  k<count_Bin;  k++)                        //  Сверка имен картинок  с  именами бинариков
                 if (imgName == mBinName[k]) {  // При совпадении имен:
                         mBinLabel[k]="илл";                    //  Пометка бинарного объекта "использован для иллюстрации"
                         count_BinImg++;                           //  Увеличение счетчика таких пометок
                         mImgHref.push(imgName);           //  Добавление имени иллюстрации в соответствующий список
                         if (Img.nodeName == "DIV")             //  Увеличение счетчика в зависимости от типа иллюстрации:   меж строк или внутри строк;  jpg, png или невалид
                                 Raspredelenie (count_divImg, mBinType[k]);
                         if (Img.nodeName == "SPAN")
                                 Raspredelenie (count_spanImg, mBinType[k]);
                         if (Img.getAttribute("title") != "")  count_titleImg++;    //  Обнаружение внутреннего заголовка
                         continue  aaa }
         count_zeroImg++;   //  Если имени картинки нет в именах файлов, -- то она отмечается как "пустая"
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ПОИСК И ПОДСЧЕТ  :  Обложки

 var mCovValue=[];  //  Массив с именами всех обложек

 var tiCover=document.getElementById("tiCover");      //  Раздел с обычными обложками
 var mTiCov=tiCover.getElementsByTagName("SELECT");  //  Массив с раздельными блоками для обычных обложек
 var count_tiCover=[0, 0, 0, 0];  //  Счетчики для обычных обложек [всего, jpg, png, другие форматы]

bbb:
 for (n=0;  n<mTiCov.length;  n++) {              //  Цикл для всех обычных обложек
         imgName=mTiCov[n].value.replace(/^#/, "");   //  Получение имени без префикса "#"
         if (imgName != "")  {
                 for (k=0;  k<count_Bin;  k++)                  //  Сравнение полученного имени со списком имен файлов
                         if (imgName == mBinName[k]) {       //  При совпадении...
                                 mBinLabel[k]="обл";                  //  Пометка бинарика
                                 count_BinCov++;                          //  Добавление в счетчик пометок
                                 mCovValue.push(imgName);          //  Добавление имени в список имен обложек (всех: и обычных и на языке оригинала)
                                 Raspredelenie (count_tiCover, mBinType[k]);    //  Увеличение счетчика в зависимости от типа обложки:   jpg, png или невалид
                                 continue  bbb }                        //  Переход к следующему имени обложки
                 count_zeroImg++;             //  Если имени обложки нет в именах файлов, -- то она отмечается как "пустая"
                 }
         }

 var stiCover=document.getElementById("stiCover");      //  Раздел с обложками на языке оригинала
 var mStiCov=stiCover.getElementsByTagName("SELECT");  //  Массив с раздельными блоками для обложек на языке оригинала
 var count_stiCover=[0, 0, 0, 0];  //  Счетчики для обложек на языке оригинала [всего, jpg, png, другие форматы]

ccc:
 for (n=0;  n<mStiCov.length;  n++) {
         imgName=mStiCov[n].value.replace(/^#/, "");
         if (imgName != "")  {
                 for (k=0;  k<count_Bin;  k++)
                         if (imgName == mBinName[k]) {
                                 mBinLabel[k]="обл";
                                 count_BinCov++;
                                 mCovValue.push(imgName);
                                 Raspredelenie (count_stiCover, mBinType[k]);
                                 continue  ccc }
                 count_zeroImg++;
                 }
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ПОИСК И ПОДСЧЕТ  :  совпадения в иллюстрациях и обложках

 var mImgAll=[];  //  Массив со всеми изображениями (обложки и иллюстрации)
 var count_CovRepit=0;  //  Счетчик повторного использования обложек
 var count_ImgRepit=0;  //  Счетчики повторного использования иллюстраций

 mImgAll = mCovValue.concat(mImgHref);      //  Создание общего списка имен обложек и иллюстраций

         //  Сравнение имени обложки с именами любых изображений
 for (n=0;  n<mCovValue.length;  n++)         //  Цикл для обложек
         for (k=n+1;  k<mImgAll.length;  k++)         //  Вложенный цикл слегка уменьшен, чтобы обложка не сравнивалась сама с собой
                 if (mCovValue[n] == mImgAll[k]) {      //  Если совпадает...
                         count_CovRepit++;                               //  Увеличение счетчика
                         if (k < mCovValue.length)  break }    //  Если совпадение не вышло из области обложек -- переключение на поиск совпадений для другой обложки
// * В этом цикле фиксируются два вида совпадений:
// 1. использование обложки для другой обложки -- для такой обложки может быть только одно использование
// 2. использование обложки как иллюстрации -- может быть несколько использований, но только для уникальной обложки

         //  Сравнение имен иллюстраций
 for (n=0;  n<mImgHref.length;  n++)
         for (k=n+1;  k<mImgHref.length;  k++)
                 if (mImgHref[n] == mImgHref[k]) {
                         count_ImgRepit++;
                         break }
//  * Этим циклом не ищутся совпадения с обложками (они уже посчитаны предыдущим циклом)
//  * Однако обложки, которые использовались как иллюстрации -- воспринимаются этим циклом как иллюстрации, и могут быть тоже подсчитаны как повторные
//  * Например, если 1 обложка использовалась 5 раз как иллюстрация, то получаются как бы 5 одинаковых иллюстраций, или 4 повтора (использования) иллюстрации

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ПОДСЧЕТ  :  Вложенные файлы.  Часть 2

 var count_BinSizeAll=0;  //  Размер всех файлов
 var count_BinUnused=0;  //  Счетчик для неиспользуемых файлов
 var count_BinSizeCovMax=0;  //  Максимальный размер обложки
 var count_BinSizeImgMax=0;  //  Максимальный размер иллюстрации
 var count_BinSizeMedi=0;  //  Средний размер файлов

 //  Разделение файлов на:   обложки;  иллюстрации;  не использованные. Плюс подсчет размеров для этих групп
 for (k=0;  k<count_Bin;  k++) {                  //  цикл для всех бинариков
         mBinSize[k] = +mBinSize[k]                  //  преобразование текста в число (в FBE размер в байтах записывается как текст)
         count_BinSizeAll = count_BinSizeAll + mBinSize[k];    //  подсчет размера всех файлов
         switch (mBinLabel[k]) {
                 case "обл":
                         if (count_BinSizeCovMax < mBinSize[k])    //  определение максимального размера обложки
                                 count_BinSizeCovMax=mBinSize[k];
                         break;
                 case "илл":
                         if (count_BinSizeImgMax < mBinSize[k])    //  определение максимального размера иллюстрации
                                 count_BinSizeImgMax=mBinSize[k];
                         break;
                 case "не исп":
                         count_BinUnused++;            //  подсчет неиспользуемых файлов
                         break;
                 }
         }

           // Функция округления до четырех знаков (включая точку)
 function okruglenie (num) {
     a = (""+num).replace(/^(.{1,4}).*/g, "$1").replace(/\.$/g, "");  //  Получение первых 4-х символов и удаление точки в конце строки
     b = +("1" + a.replace(/\d/g, "0").replace(/^0+?(\.|$)/g, ""));  //  Сборка единицы с нолями, где число нолей равно числу цифр в дробной части "а"
     d = Math.round(num*b)/b;
     return  (d+"").replace(/\./g, ",");          //  обычное округление и замена точки на привычную запятую
     }

           // Функция подсчета   байт, килобайт, мегабайт
 function kilobytes (num) {
     if (num == 0)  return  0;
     if (num < 1024)  return  num+" Б";
     num /= 1024;
     if (num < 1024)  return  okruglenie(num)+" кБ";
     num /= 1024;
     return  okruglenie(num)+" МБ";
     }

 if (count_Bin!=0)
         count_BinSizeMedi = count_BinSizeAll / count_Bin;
                                             // средний размер файла

         //  преобразование:    размер в байтах   ›››   подходящий размер в байтах, килобайтах или мегабайтах
 count_BinSizeAll=kilobytes(count_BinSizeAll);
 count_BinSizeCovMax=kilobytes(count_BinSizeCovMax);
 count_BinSizeImgMax=kilobytes(count_BinSizeImgMax);
 count_BinSizeMedi=kilobytes(count_BinSizeMedi);

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// СОЗДАНИЕ СПИСКА ЦИТАТ

//  Из книги "Пословицы и поговорки Великой Отечественной войны"
//  (составитель Павел Федорович Лебедев)

 var Kn=[ "Одна у человека мать, одна у него и Родина.",   "Родина любимая – мать родимая.",   "Родина – мать, умей за нее постоять.",   "Где ни жить – Родине служить.",   "С Родиной разлука – одна мука.",   "Всякому мила своя сторона.",   "Своя земля и в горсти мила.",   "На чужой стороне и весна не красна.",   "Где кто родится, там и пригодится.",   "На чужбине родная землица во сне снится.",   "На своей стороне мило, на чужой – постыло.",   "На чужой стороне и сокола зовут вороною.",   "Всякая сосна своему лесу весть подает.",   "Родная страна – колыбель, чужая – дырявое корыто.",   "На солнце тепло, на родине добро.",   "Человек без Родины что соловей без песни.",   "Глупа та птица, которой свое гнездо не мило.",   "Кукушка кукует – по бездомью горюет.",   "Расставшийся с другом плачет семь лет, расставшийся с Родиной – всю жизнь.",   "Нет ничего на свете краше, чем Родина наша.",   "Нашей страны шире не найти в мире.",   "Русское раздолье – человеку приволье.",   "Богата русская земля – говорится не зря.",   "Я тобой горжусь, милая Русь.",   "Человек без Родины что солдат без оружия.",   "Счастье Родины дороже жизни.",   "Береги страну как зеницу ока.",   "Может, и голову сложу, а Родине послужу.",   "Нам Отчизна дорога, охраняем родные берега.",   "Пусть знает ворог: нам край свой дорог.",   "Кто любовь к Отчизне имеет, тот врага одолеет.",   "Мы бережем свою Родину-мать, за нее мы готовы жизнь отдать.",   "С нами родная земля, нам светят звезды Кремля.",   "Великие победы нас ждут впереди под лучами красной звезды.",   "Красная звезда светит всегда.",   "Теперь все дороги ведут в Москву.",   "Москва от глаз далека, да сердцу близка.",   "Москва – наша столица, Москвой народ гордится.",   "Москва – всем столицам голова.",   "Москва – столица, любо подивиться.",   "У русской столицы не видать границы.",   "По Москве ходить – глаз с нее не сводить.",   "Москва – Родины украшенье, врагам устрашение.",   "Кремль тем и красен, что с народом согласен.",   "Наша страна дружбой сильна.",   "У нас все народы живут в ладу – врагам на беду.",   "Солнце не померкнет над нами, братство – наша сила и знамя.",   "Народное братство дороже всякого богатства.",   "Если дружба велика, будет Родина крепка.",   "Дружбу нашу не разделят просторы, моря и горы.",   "Страна растет – врагов метет.",   "Не тот человек, кто для себя живет, а тот человек, кто народу силы отдает.",   "За Родину и народ иду вперед.",   "Человек без народа что дерево без плода.",   "Чтобы с врагами биться, надо всем сплотиться.",   "Не трудно врагов победить, если всем заодно быть.",   "Наш народ сплочен и един, он непобедим.",   "Кто на нас нападает, тот в могилу попадает.",   "Россия с давних пор давала врагу отпор.",   "Никогда Россия ярма не носила.",   "За наше Отечество все человечество.",   "Не летать фашистским стаям над нашим краем.",   "Мы не боимся свинцовой тучи: наши полки могучи.",   "Кто на Советский Союз покушается, тот после раскается.",   "Бей фашистов не в бровь, а в глаз – таков народа наказ.",   "Любовь к народу, ненависть к врагу – душа победы.",   "От Родины награда – сердцу отрада.",   "Отчизна родная – для нас святая.",   "Знает свет: тверже русских нет.",   "Наш народ – герой, ходит на врага стеной.",   "Сыновья русских матерей славятся удалью богатырей.",   "Наша страна героями славится.",   "Кто за Родину горой – тот истинный герой.",   "Без патриотизма не разбить фашизма.",   "Защищай Советскую державу, бей фашистскую ораву.",   "Фашистам смерть неси – не опозорь Руси.",   "Даю Родине слово: мстить фашистам сурово.",   "Во имя Отчизны своей где фашиста увидел – бей.",   "За народное дело бейся смело.",   "Для Родины своей ни сил, ни жизни не жалей.",   "Жизнь отдам, а Родину не продам.",   "С родной земли – умри не сходи.",   "За Родину-мать не страшно умирать.",   "За Родину жизни не пощадим, но врагу ничего не отдадим.",   "Кому нашей земли захочется, тот под ней скорчится.",   "Родину любить – фашистов бить.",   "Бей фашистский сброд – за Родину, за народ.",   "Родину любить – верно Родине служить.",   "Родину беречь – врагов сечь.",   "Для нас война не страх – развеем врага в прах.",   "Гитлер пришел к нам незваным, а уйдет от нас драным.",   "Не придется Гитлеру из Ленинграда сделать море, а из Москвы – поле.",   "Думал Гитлер нашими землями управлять, а придется ему подыхать.",   "Штык советский молодец – скоро Гитлеру конец.",   "У Гитлера не столько расчетов, сколько просчетов.",   "Гитлер предполагает, а Красная Армия располагает.",   "Посмотрим, как Гитлер завоет, когда наши огонь по Берлину откроют.",   "Раздавим Гитлера в блин, как придем в Берлин.",   "Гитлеру-палачу местью отплачу.",   "Пора с Гитлером кончать – хватит ему рычать.",   "Гитлер и его правительство ответят за грабительство.",   "Гитлер кричит, мы весь свет разрушим, а мы Гитлера наперед задушим.",   "Сколько Гитлер ни крути, а от петли не уйти.",   "Гитлер победами хвалится, да в могилу свалится.",   "Хотел Гитлер Россию съесть, да пришлось в лужу сесть.",   "Не довелось свинье на небо дивиться, а Гитлеру в нашем огороде рыться.",   "Медведя знают по когтям, а Геббельса по лживым речам.",   "Фашистские собаки сочиняют враки.",   "Фашист брехней живет.",   "Солдаты у Гитлера вшивы, сводки у Геббельса лживы.",   "От осины не жди ягоды, от фашиста – правды.",   "Геббельс вертит языком без меры, да нет ему веры.",   "Геббельс мелет, да никто ему не верит.",   "Германия вот-вот развалится, а Геббельс все хвалится.",   "Германия пылает, а Геббельс все лает.",   "Врет, как фашистский бюллетень.",   "Как Геббельс ни врет, а наша берет.",   "Против фашистской лжи ухо востро держи.",   "Фашистские оковы всей Европе знакомы.",   "Лучше волку в зубы, чем фашистам в руки.",   "Фашист гладок, да вид его гадок.",   "Фашист от когтей до носа похож на барбоса.",   "Фашист и сатана – сущность одна.",   "Не ищи в фашисте человека – не найдешь.",   "Легче шакала превратить в голубя, чем фашиста в человека.",   "Фашистов легче убить, чем вразумить.",   "Фашистская власть – грабить и красть.",   "У фашистов особый спорт: кто больше добра сопрет.",   "Видно птицу по полету, а фашиста – по грабежам.",   "Сколько фашисту ни воровать, а виселицы не миновать.",   "Для предателя сгори хоть целый свет, лишь бы он был согрет.",   "Змея один раз в год меняет кожу, а предатель – каждый день.",   "Предатель фашисту пятки лизал, а фашист и спасибо не сказал.",   "У предателя ни Родины, ни друзей.",   "Лучше глаза лишиться, чем доброго имени.",   "Героям – слава, предателям – смерть.",   "Слава греет, позор жжет.",   "Бесчестье хуже смерти.",   "Кто с врагами пьет и гуляет, того и земля не принимает.",   "Думал фриц нашим богатством нажиться, да пришлось в могилу ложиться.",   "Не видать свинье неба, а фашистам нашего хлеба.",   "Кого к столу приглашают, а в фашиста пулю сажают.",   "Кому чарка, кому две, а фашисту – камнем по голове.",   "Угостили фашистов не водкой, а прямой наводкой.",   "Врага не уговаривай: с ним штыком разговаривай.",   "Убил фашистского гада – душа рада.",   "Съели бы фашисты русского мужика, да кишка тонка.",   "Одного фашиста убить – сто детей спасти.",   "Фашиста убить что змею: сто грехов простится.",   "Лучше смерть на поле, чем позор в неволе.",   "Чем позор и неволю терпеть, лучше в бою умереть.",   "Лучше биться орлом, чем жить зайцем.",   "Никогда фашистам не властвовать над нами, никогда не будем рабами.",   "Лучше злая пуля, чем клеймо раба.",   "Славная смерть лучше постыдной жизни.",   "Воевать – не галушки жевать.",   "Не воевать – победы не видать.",   "Слабого огонь войны испепеляет, а сильного как сталь закаляет.",   "Кто за правое дело дерется, у того двойная сила берется.",   "Наше дело правое – бей врага браво.",   "Бей фашистских властей всех мастей.",   "С какой злостью превеликой мы расправимся с фашистской кликой.",   "С врагами биться – на пули не скупиться.",   "Винтовка хлоп – и фашист в гроб.",   "Пришел фашист из Берлина – получил земли три аршина.",   "Не важно, чем бил, – важно, что фашиста убил.",   "Каждой фашистской гадине висеть на перекладине.",   "Всякому свой путь: журавлю – в небо, волку – в лес, а фашисту – в могилу.",   "Упрямого выправит дубина, а фашиста – могила.",   "Какую яму фашист копал – в такую и попал.",   "Фашисты научились воровать, а мы научились фашистов убивать.",   "Наш порог не для фашистских сапог.",   "Фашиста согнем в бараний рог, чтоб не переступал наш порог.",   "Лося бьют в осень, а фашиста всегда.",   "Наше дело святое и правое, мы расправимся с фашистскою оравою.",   "С фашистом разговор короткий: круши его прямой наводкой.",   "Кричал фашист «гоп», да получил пулю в лоб.",   "Фашиста умертвить – доброе дело сотворить.",   "На фронте воевать – славу добывать.",   "Фронт гремит – у врага земля горит.",   "Гремят вспышки на горизонте: то бьют фашистов на фронте.",   "Фашистов разгромили – и в селе порядок водворили.",   "Фашист замахнулся, да промахнулся.",   "Дрался фашист пылко, да остался без затылка.",   "Фашисты козыряли, да головы потеряли.",   "Фашисты пять раз на дню попадают в западню.",   "У фашистов брожение: попали в окружение.",   "Фашистам не все напирать – пришлось и умирать.",   "Трави фашистскую силу – огнем и штыком загоняй в могилу.",   "Чокнемся, фашист, я парень не гордый: я – прикладом, а ты – мордой.",   "На то у винтовок и ложи, чтобы бить фашиста по роже.",   "Слава русского штыка не померкнет века.",   "Штык остёр загнал фрицев в «котел».",   "Наши штыки разгромят фашистские полки.",   "Фашисты войну начали, а мы кончим.",   "Славу свою добывай в бою.",   "Почет и славу собирают по капле.",   "Народ того уважает, кто фашистов уничтожает.",   "На то мы и внуки Суворова, чтобы сражаться здорово.",   "Как учил Александр Суворов – будь к врагу суровым.",   "На краю света фашистов найдем и на суд приведем.",   "Зря фашист блиндажи строит: все равно снаряд накроет.",   "Смерть фашистской своре – на берегу и в море!",   "Солдата мать родит, отец растит, а бой учит.",   "Дерево в огне сгорает, а солдат от огня крепче бывает.",   "Кто первый бой начинает, тот скорее побеждает.",   "Пришла пора гнать фашистов со двора.",   "Фашист наступает – кричит «гут», а отступает – «Гитлер капут».",   "Красна девушка косами, солдат – орденами.",   "Ученый водит, а неуч сзади ходит.",   "Птицу обманывают кормом, а человека – словом.",   "Слово, сказанное без соображения, подобно выстрелу без прицела.",   "Говорить впустую что стрелять вхолостую.",   "У осла длинные уши, а у болтуна длинный язык.",   "У короткого ума длинный язык.",   "Слово не воробей: выпустишь – не поймаешь.",   "Скажешь – не воротишь, напишешь – не сотрешь, отрубишь – не приставишь.",   "Лучше один раз увидеть, чем сто раз услышать.",   "Острый язык – дарование, длинный язык – наказание.",   "Не всегда говори то, что знаешь, но всегда знай, что говоришь.",   "Кто много болтает, тот врагу помогает.",   "Кто зевает – победителем не бывает.",   "Храбрость города берет, а бдительность их бережет.",   "Зря не болтай у телефона: болтун – находка для шпиона.",   "Нет друга – так ищи, а найдешь – береги.",   "Ищи себе друзей таких, чтобы не было стыда от них.",   "Не ходи, дружок, в неизвестный кружок: к таким людям зайдешь, что навек пропадешь.",   "Плохой друг подобен тени: только в светлые дни его и видишь.",   "Не та дружба сильна, что в словах заключена, а та, что в бою скреплена.",   "Для друзей – пироги, для врагов – кулаки.",   "В недруге пуля что во пне, а в друге что во мне.",   "Все за одного, один за всех – вот и обеспечен в бою успех.",   "Не имей сто рублей, а имей сто друзей.",   "В дружбе – правда.",   "Кто нашел друга – нашел сокровище.",   "Сам пропадай, а товарища выручай.",   "Один в поле не воин, а вдвоем с товарищем – взвод.",   "Где дружба и лад – там и клад.",   "Где дружба и совет – там и свет.",   "Трусливый друг опаснее врага, ибо врага опасаешься, а на друга опираешься.",   "Не тот друг, кто медом мажет, а тот, кто правду скажет.",   "Недруг поддакивает, а друг спорит.",   "Дружба крепка не лестью, а правдой и честью.",   "Новых друзей наживай, а старых не забывай.",   "Прямо страху в глаза смотри – и страх смигнет.",   "Волков бояться – в лес не ходить.",   "Трус умирает тысячу раз, а смелый всего один раз.",   "Советские воины из металла скроены.",   "Чем больше героев, тем скорее фашистов зароем.",   "Храбрость – сестра победы.",   "На смелого собака лает, а трусливого – рвет.",   "Не числом, а храбростью побеждают.",   "Лучше быть мертвым героем, чем живым трусом.",   "Смелого и пуля облетит, смелый и мину перехитрит.",   "Если не будешь овцой, то волк не съест.",   "Косил Гитлер глаз на Донбасс, а Донбасс опять у нас.",   "И про солдатскую честь пословица есть.",   "Потому и смешно, что фашистам горе пришло.",   "Гитлеровским сателлитам быть разбитым.",   "Знаем, за что бьем, потому и с победой придем.",   "Кто за правое дело стоит, тот всегда победит.",   "У правого сила удвоится, говорит пословица.",   "Будет праздник и на улице нашей, всякого праздника краше.",   "Войну закончим – и мир упрочим.",   "Как фашисты нам ни грозили, а мы их сразили.",   "Фашистов разгромили – добро сотворили.",   "Хотел Гитлер покорить весь мир, да лопнул как мыльный пузырь.",   "Задохнулась фашистская стая девятого мая.",   "Разбили фашистскую орду в сорок пятом году.",   "Прогнали фрицев – можно веселиться.",   "Советская Армия врага разгромила, она стоит на страже мира.",   "Курские леса и дубравы полны легендарной славы.",   "Виден в курских лесах боевой размах.",   "Защитим курские дубравы от фашистской оравы!",   "В курских городах разбили фашистов в прах.",   "Как фашисты ни рвались к Курску – не дали им спуску.",   "Бей врага, Суджа, зарывай глубже." ];

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

 if (currentMonth<10) currentMonth = "0" + currentMonth;
currentYear = (currentYear+"").replace(/^.*?(\d{1,2})$/g, "$1");

 var currentTime = currentHours + ":" + currentMinutes + ":" + currentSeconds;
 var currentDate = currentDay + "." + currentMonth + "." + currentYear;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Предварительная подготовка данных для вывода результатов

  //  Общее число строк
  var count_P = count_body_p+count_boNC_p+count_hist_p+count_anotFB_p+count_X_p+count_no_p;

//  Различия в количестве кавычек
  var count_A41_42 = count_A41-count_A42;
  var count_A43_44 = count_A43-count_A44;

//  Добавление разрядности в количество слов и символов
 count_Word=count_Word+"";
 if (count_Word.length > 4)  count_Word=count_Word.replace(/(\d)(?=(\d{3})+$)/g, "$1 ");

 count_littera=count_littera+"";
 if (count_littera.length > 4)  count_littera=count_littera.replace(/(\d)(?=(\d{3})+$)/g, "$1 ");

//  Количество  записей вида  [число]  и  {число}  вне сноски ("общее количество" минус "те, что в сноске")
 count_A93 = count_A93 - count_A93a;
 count_A94 = count_A94 - count_A94a;

//  Гиперссылка = Общее число ссылок – ссылки на комментарии и примечания
count_A15 = count_A15-count_Not-count_Com

//  Верхний регистр уменьшается на количество сносок на комментарии
count_A10=count_A10-count_Com;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// Демонстрационный режим "Показать все строки"

 var VseStroki_on_off = 0;      // 0 ; 1 //      ("0" — отключить, "1" — включить)

 var d=0;
 if (VseStroki_on_off == 1)
         d="показать нули";

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Подсчет чистого компьютерного времени, потраченного на обработку текста

 var Tf=new Date().getTime();    //  Фиксация времени окончания работы скрипта.

 var T2=Tf-Ts;                //  Время работы скрипта  (в миллисекундах).
 var Tmin  = Math.floor((T2)/60000);
 var TsecD = ((T2)%60000)/1000;
 var Tsec = Math.floor(TsecD);
 var tempus=0;

 if (Tmin ==0)
         tempus = (+(TsecD+"").replace(/(.{1,5}).*/g, "$1")+"").replace(".", ",")+" сек";
     else {
             tempus = Tmin+" мин";
             if (Tsec !=0)
                     tempus += " " + Tsec+ " с" }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Сборка массива с результатами обработки

 var mSt=[];       //  Массив со всеми строками статистики
 var ind=0;        //  Номер строки
 var mRzd=[];  //  Массив с числом строк во всех разделах
 var rz=0;          //  Номер раздела


                 mSt[ind]="";  ind++;
                 mSt[ind]=" "+ScriptName+" v."+NumerusVersion;  ind++;
                 mSt[ind]="-------------------------------------------------------";  ind++;
 if (d)  { mSt[ind]=" Демонстрационный режим";  ind++ }
                 mSt[ind]="					   ";  ind++;

 mSt[ind]="• Время выполнения  .  .  .  .  .  .  .  .	"+tempus;  ind++;
 mSt[ind]="";  ind++;

 mSt[ind]="Строк   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_P;  ind++;
 mSt[ind]="Слов .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_Word;  ind++;
 mSt[ind]="Символов   .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_littera;  ind++;

 mRzd[rz]=ind;  //  Число строк в первом разделе

                                                             mSt[ind]="";  ind++;
                                                             mSt[ind]="• РАЗДЕЛ аннотации к книге и история:";  ind++;
                                                             mSt[ind]="Аннотация,     шт. /строк/  .  .  .  .  .	"+count_anotFB+"  /"+count_anotFB_p+"/";  ind++;
                                                             mSt[ind]="Раздел <history>   .  .  .  .  .  .  .  .  .	"+count_hist+"  /"+count_hist_p+"/";  ind++;
  for (k=0; k<=5; k++) {
          if (count_sect[0][k]!=d)
                  if (k < 5)                       { mSt[ind]="Секций "+k+"-го уровня   .  .  .  .  .  .  .  .	"+count_sect[0][k];  ind++ }
                      else                             { mSt[ind]="Секций "+5+"-го уровня и выше   .  .  .  .	"+count_sect[0][k];  ind++ }
          if (count_sect[0][k]!=d)  { mSt[ind]="      заголовков	"+count_titl[0][k]+"  /"+ count_titl_p[0][k]+"/";  ind++ }
          if (count_epig[0][k]!=d) { mSt[ind]="      эпиграфов	"+count_epig[0][k]+"  /"+ count_epig_p[0][k]+"/";  ind++ }
          if (count_anot[0][k]!=d) { mSt[ind]="      аннотаций	"+count_anot[0][k]+"  /"+ count_anot_p[0][k]+"/";  ind++ }    }
  if (count_poem[0]!=d)            { mSt[ind]="Стихов .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_poem[0]+"  /"+ count_poem_p[0]+"/";  ind++ }
  if (count_titlPoem[0]!=d)      { mSt[ind]="      заголовков	"+count_titlPoem[0]+"  /"+ count_titlPoem_p[0]+"/";  ind++ }
  if (count_epigPoem[0]!=d)   { mSt[ind]="      эпиграфов	"+count_epigPoem[0]+"  /"+ count_epigPoem_p[0]+"/";  ind++ }
  if (count_stan[0]!=d)               { mSt[ind]="      строф       	"+count_stan[0]+"  /"+ count_stan_p[0]+"/";  ind++ }
  if (count_tAutPoem[0]!=d)   { mSt[ind]="      text-author	"+count_tAutPoem[0]+"  /"+ count_tAutPoem_p[0]+"/";  ind++ }
  if (count_cite[0]!=d)                { mSt[ind]="Цитат  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_cite[0]+"  /"+ count_cite_p[0]+"/";  ind++ }
  if (count_subt[0]!=d)              { mSt[ind]="Подзаголовков   .  .  .  .  .  .  .  .  .  .	"+count_subt[0]+"  /"+ count_subt_p[0]+"/";  ind++ }
  if (count_tAutCite[0]!=d)      { mSt[ind]="text-author в цитатах  .  .  .  .  .  .  .	"+count_tAutCite[0]+"  /"+ count_tAutCite_p[0]+"/";  ind++ }
  if (count_tAutEpig[0]!=d)     { mSt[ind]="text-author в эпиграфах  .  .  .  .  .  .	"+count_tAutEpig[0]+"  /"+ count_tAutEpig_p[0]+"/";  ind++ }
  if (count_tAut[0]!=d)              { mSt[ind]="Невалидный text-author  .  .  .  .  .  .	"+count_tAut[0]+"  /"+ count_tAut_p[0]+"/";  ind++ }
  if (count_tabl[0]!=d)               { mSt[ind]="Таблиц .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_tabl[0]+"  /"+ count_tr[0]+"/";  ind++ }
  if (count_tabl_p[0]!=d)           { mSt[ind]="      ячеек        	"+count_tabl_p[0];  ind++ }
  if (count_xxx[0]!=d)                { mSt[ind]="Непонятных разделов .  .  .  .  .  .  .	"+count_xxx[0]+"  /"+ count_xxx_p[0]+"/";  ind++ }
  if (count_txt[0]!=d)                 { mSt[ind]="Строк обычного текста  .  .  .  .  .  .	"+count_txt[0];  ind++ }
  if (count_Sp[0]!=d)                  { mSt[ind]="Пустые строки .  .  .  .  .  .  .  .  .  .  .	"+count_Sp[0];  ind++ }
  if (count_titleSp[0]!=d)          { mSt[ind]="      в заголовках	"+count_titleSp[0];  ind++ }
  if (count_subtSp[0]!=d)         { mSt[ind]="      в п/заголовках "+count_subtSp[0];  ind++ }
  if (count_epigSp[0]!=d)         { mSt[ind]="      в эпиграфах	"+count_epigSp[0];  ind++ }
  if (count_poemSp[0]!=d)      { mSt[ind]="      в стихах      	"+count_poemSp[0];  ind++ }

 if (mRzd[rz]==ind-2) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в последнем разделе
 rz++;  mRzd[rz]=ind;  //  Число строк в описанных разделах

                                                             mSt[ind]="";  ind++;
                                                             mSt[ind]="• РАЗДЕЛЫ основных <body>:";  ind++;
                                                             mSt[ind]="Разделов <body>   .  .  .  .  .  .  .  .  .	"+count_body+"  /"+ count_body_p+"/";  ind++;
  for (k=0; k<=5; k++) {
          if (count_sect[1][k]!=d)
                  if (k < 5)                       { mSt[ind]="Секций "+k+"-го уровня   .  .  .  .  .  .  .  .	"+count_sect[1][k];  ind++ }
                      else                            { mSt[ind]="Секций "+5+"-го уровня и выше   .  .  .  .	"+count_sect[1][k];  ind++ }
          if ((k == 0 && count_body != 0) || count_sect[1][k]!=d) {
                                                             mSt[ind]="      заголовков	"+count_titl[1][k]+"  /"+ count_titl_p[1][k]+"/";  ind++ }
          if (count_epig[1][k]!=d) { mSt[ind]="      эпиграфов	"+count_epig[1][k]+"  /"+ count_epig_p[1][k]+"/";  ind++ }
          if (count_anot[1][k]!=d) { mSt[ind]="      аннотаций	"+count_anot[1][k]+"  /"+ count_anot_p[1][k]+"/";  ind++ }    }
  if (count_poem[1]!=d)            { mSt[ind]="Стихов .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_poem[1]+"  /"+ count_poem_p[1]+"/";  ind++ }
  if (count_titlPoem[1]!=d)      { mSt[ind]="      заголовков	"+count_titlPoem[1]+"  /"+ count_titlPoem_p[1]+"/";  ind++ }
  if (count_epigPoem[1]!=d)   { mSt[ind]="      эпиграфов	"+count_epigPoem[1]+"  /"+ count_epigPoem_p[1]+"/";  ind++ }
  if (count_stan[1]!=d)              { mSt[ind]="      строф       	"+count_stan[1]+"  /"+ count_stan_p[1]+"/";  ind++ }
  if (count_tAutPoem[1]!=d)  { mSt[ind]="      text-author	"+count_tAutPoem[1]+"  /"+ count_tAutPoem_p[1]+"/";  ind++ }
  if (count_cite[1]!=d)               { mSt[ind]="Цитат  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_cite[1]+"  /"+ count_cite_p[1]+"/";  ind++ }
  if (count_subt[1]!=d)             { mSt[ind]="Подзаголовков   .  .  .  .  .  .  .  .  .  .	"+count_subt[1]+"  /"+ count_subt_p[1]+"/";  ind++ }
  if (count_tAutCite[1]!=d)      { mSt[ind]="text-author в цитатах  .  .  .  .  .  .  .	"+count_tAutCite[1]+"  /"+ count_tAutCite_p[1]+"/";  ind++ }
  if (count_tAutEpig[1]!=d)     { mSt[ind]="text-author в эпиграфах  .  .  .  .  .  .	"+count_tAutEpig[1]+"  /"+ count_tAutEpig_p[1]+"/";  ind++ }
  if (count_tAut[1]!=d)              { mSt[ind]="Невалидный text-author  .  .  .  .  .  .	"+count_tAut[1]+"  /"+ count_tAut_p[1]+"/";  ind++ }
  if (count_tabl[1]!=d)               { mSt[ind]="Таблиц .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_tabl[1]+"  /"+ count_tr[1]+"/";  ind++ }
  if (count_tabl_p[1]!=d)           { mSt[ind]="      ячеек        	"+count_tabl_p[1];  ind++ }
  if (count_xxx[1]!=d)                { mSt[ind]="Непонятных разделов .  .  .  .  .  .  .	"+count_xxx[1]+"  /"+ count_xxx_p[1]+"/";  ind++ }
  if (count_txt[1]!=d)                 { mSt[ind]="Строк обычного текста  .  .  .  .  .  .	"+count_txt[1];  ind++ }
  if (count_Sp[1]!=d)                  { mSt[ind]="Пустые строки .  .  .  .  .  .  .  .  .  .  .	"+count_Sp[1];  ind++ }
  if (count_titleSp[1]!=d)          { mSt[ind]="      в заголовках	"+count_titleSp[1];  ind++ }
  if (count_subtSp[1]!=d)         { mSt[ind]="      в п/заголовках "+count_subtSp[1];  ind++ }
  if (count_epigSp[1]!=d)         { mSt[ind]="      в эпиграфах	"+count_epigSp[1];  ind++ }
  if (count_poemSp[1]!=d)      { mSt[ind]="      в стихах      	"+count_poemSp[1];  ind++ }

 if (mRzd[rz]==ind-2) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в последнем разделе
 rz++;  mRzd[rz]=ind;  //  Число строк в описанных разделах

                                                             mSt[ind]="";  ind++;
                                                             mSt[ind]="• РАЗДЕЛЫ примечаний и комментариев:";  ind++;
  if (count_boNC!=d)                          { mSt[ind]="Разделов <body>  .  .  .  .  .  .  .  .  .	"+count_boNC+"  /"+ count_boNC_p+"/";  ind++ }
  for (k=0; k<=5; k++) {
          if (count_sect[2][k]!=d)
                  if (k < 5)                       { mSt[ind]="Секций "+k+"-го уровня   .  .  .  .  .  .  .  .	"+count_sect[2][k];  ind++ }
                      else                            { mSt[ind]="Секций "+5+"-го уровня и выше   .  .  .  .	"+count_sect[2][k];  ind++ }
          if ((k == 0 && count_boNC != 0) || count_sect[2][k]!=d) {
                                                             mSt[ind]="      заголовков	"+count_titl[2][k]+"  /"+ count_titl_p[2][k]+"/";  ind++ }
          if (count_epig[2][k]!=d) { mSt[ind]="      эпиграфов	"+count_epig[2][k]+"  /"+ count_epig_p[2][k]+"/";  ind++ }
          if (count_anot[2][k]!=d) { mSt[ind]="      аннотаций	"+count_anot[2][k]+"  /"+ count_anot_p[2][k]+"/";  ind++ }    }
  if (count_poem[2]!=d)            { mSt[ind]="Стихов .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_poem[2]+"  /"+ count_poem_p[2]+"/";  ind++ }
  if (count_titlPoem[2]!=d)      { mSt[ind]="      заголовков	"+count_titlPoem[2]+"  /"+ count_titlPoem_p[2]+"/";  ind++ }
  if (count_epigPoem[2]!=d)   { mSt[ind]="      эпиграфов	"+count_epigPoem[2]+"  /"+ count_epigPoem_p[2]+"/";  ind++ }
  if (count_stan[2]!=d)              { mSt[ind]="      строф       	"+count_stan[2]+"  /"+ count_stan_p[2]+"/";  ind++ }
  if (count_tAutPoem[2]!=d)  { mSt[ind]="      text-author	"+count_tAutPoem[2]+"  /"+ count_tAutPoem_p[2]+"/";  ind++ }
  if (count_cite[2]!=d)                { mSt[ind]="Цитат  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_cite[2]+"  /"+ count_cite_p[2]+"/";  ind++ }
  if (count_subt[2]!=d)              { mSt[ind]="Подзаголовков   .  .  .  .  .  .  .  .  .  .	"+count_subt[2]+"  /"+ count_subt_p[2]+"/";  ind++ }
  if (count_tAutCite[2]!=d)      { mSt[ind]="text-author в цитатах  .  .  .  .  .  .  .	"+count_tAutCite[2]+"  /"+ count_tAutCite_p[2]+"/";  ind++ }
  if (count_tAutEpig[2]!=d)     { mSt[ind]="text-author в эпиграфах  .  .  .  .  .  .	"+count_tAutEpig[2]+"  /"+ count_tAutEpig_p[2]+"/";  ind++ }
  if (count_tAut[2]!=d)              { mSt[ind]="Невалидный text-author  .  .  .  .  .  .	"+count_tAut[2]+"  /"+ count_tAut_p[2]+"/";  ind++ }
  if (count_tabl[2]!=d)               { mSt[ind]="Таблиц .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_tabl[2]+"  /"+ count_tr[2]+"/";  ind++ }
  if (count_tabl_p[2]!=d)           { mSt[ind]="      ячеек        	"+count_tabl_p[2];  ind++ }
  if (count_xxx[2]!=d)                { mSt[ind]="Непонятных разделов .  .  .  .  .  .  .	"+count_xxx[2]+"  /"+ count_xxx_p[2]+"/";  ind++ }
  if (count_txt[2]!=d)                  { mSt[ind]="Строк обычного текста  .  .  .  .  .  .	"+count_txt[2];  ind++ }
  if (count_Sp[2]!=d)                  { mSt[ind]="Пустые строки .  .  .  .  .  .  .  .  .  .  .	"+count_Sp[2];  ind++ }
  if (count_titleSp[2]!=d)          { mSt[ind]="      в заголовках	"+count_titleSp[2];  ind++ }
  if (count_subtSp[2]!=d)         { mSt[ind]="      в п/заголовках "+count_subtSp[2];  ind++ }
  if (count_epigSp[2]!=d)         { mSt[ind]="      в эпиграфах	"+count_epigSp[2];  ind++ }
  if (count_poemSp[2]!=d)      { mSt[ind]="      в стихах      	"+count_poemSp[2];  ind++ }

 if (mRzd[rz]==ind-2) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в последнем разделе
 rz++;  mRzd[rz]=ind;  //  Число строк в описанных разделах

                                                             mSt[ind]="";  ind++;
                                                             mSt[ind]="• НЕПОНЯТНЫЕ КОРНЕВЫЕ РАЗДЕЛЫ:";  ind++;
  if (count_X!=d)                          { mSt[ind]="Количество этих разделов .  .  .  .  .	"+count_X+"  /"+ count_X_p+"/";  ind++ }
  for (k=0; k<=5; k++) {
          if (count_sect[3][k]!=d)
                  if (k < 5)                       { mSt[ind]="Секций "+k+"-го уровня   .  .  .  .  .  .  .  .	"+count_sect[3][k];  ind++ }
                      else                            { mSt[ind]="Секций "+5+"-го уровня и выше   .  .  .  .	"+count_sect[3][k];  ind++ }
          if (count_sect[3][k]!=d) { mSt[ind]="      заголовков	"+count_titl[3][k]+"  /"+ count_titl_p[3][k]+"/";  ind++ }
          if (count_epig[3][k]!=d) { mSt[ind]="      эпиграфов	"+count_epig[3][k]+"  /"+ count_epig_p[3][k]+"/";  ind++ }
          if (count_anot[3][k]!=d) { mSt[ind]="      аннотаций	"+count_anot[3][k]+"  /"+ count_anot_p[3][k]+"/";  ind++ }    }
  if (count_poem[3]!=d)            { mSt[ind]="Стихов .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_poem[3]+"  /"+ count_poem_p[3]+"/";  ind++ }
  if (count_titlPoem[3]!=d)      { mSt[ind]="      заголовков	"+count_titlPoem[3]+"  /"+ count_titlPoem_p[3]+"/";  ind++ }
  if (count_epigPoem[3]!=d)   { mSt[ind]="      эпиграфов	"+count_epigPoem[3]+"  /"+ count_epigPoem_p[3]+"/";  ind++ }
  if (count_stan[3]!=d)              { mSt[ind]="      строф       	"+count_stan[3]+"  /"+ count_stan_p[3]+"/";  ind++ }
  if (count_tAutPoem[3]!=d)  { mSt[ind]="      text-author	"+count_tAutPoem[3]+"  /"+ count_tAutPoem_p[3]+"/";  ind++ }
  if (count_cite[3]!=d)                { mSt[ind]="Цитат  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_cite[3]+"  /"+ count_cite_p[3]+"/";  ind++ }
  if (count_subt[3]!=d)              { mSt[ind]="Подзаголовков   .  .  .  .  .  .  .  .  .  .	"+count_subt[3]+"  /"+ count_subt_p[3]+"/";  ind++ }
  if (count_tAutCite[3]!=d)      { mSt[ind]="text-author в цитатах  .  .  .  .  .  .  .	"+count_tAutCite[3]+"  /"+ count_tAutCite_p[3]+"/";  ind++ }
  if (count_tAutEpig[3]!=d)     { mSt[ind]="text-author в эпиграфах  .  .  .  .  .  .	"+count_tAutEpig[3]+"  /"+ count_tAutEpig_p[3]+"/";  ind++ }
  if (count_tAut[3]!=d)              { mSt[ind]="Невалидный text-author  .  .  .  .  .  .	"+count_tAut[3]+"  /"+ count_tAut_p[3]+"/";  ind++ }
  if (count_tabl[3]!=d)               { mSt[ind]="Таблиц .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_tabl[3]+"  /"+ count_tr[3]+"/";  ind++ }
  if (count_tabl_p[3]!=d)           { mSt[ind]="      ячеек        	"+count_tabl_p[3];  ind++ }
  if (count_xxx[3]!=d)                { mSt[ind]="Непонятных разделов .  .  .  .  .  .  .	"+count_xxx[3]+"  /"+ count_xxx_p[3]+"/";  ind++ }
  if (count_txt[3]!=d)                  { mSt[ind]="Строк обычного текста  .  .  .  .  .  .	"+count_txt[3];  ind++ }
  if (count_no_p!=d)                   { mSt[ind]="Строк без корневого раздела  .  .  .	"+count_no_p;  ind++ }
  if (count_Sp[3]!=d)                  { mSt[ind]="Пустые строки .  .  .  .  .  .  .  .  .  .  .	"+count_Sp[3];  ind++ }
  if (count_titleSp[3]!=d)          { mSt[ind]="      в заголовках	"+count_titleSp[3];  ind++ }
  if (count_subtSp[3]!=d)         { mSt[ind]="      в п/заголовках "+count_subtSp[3];  ind++ }
  if (count_epigSp[3]!=d)         { mSt[ind]="      в эпиграфах	"+count_epigSp[3];  ind++ }
  if (count_poemSp[3]!=d)      { mSt[ind]="      в стихах      	"+count_poemSp[3];  ind++ }

 if (mRzd[rz]==ind-2) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в последнем разделе
 rz++;  mRzd[rz]=ind;  //  Число строк в описанных разделах

                                                             mSt[ind]="";  ind++;
                                                             mSt[ind]="• ВЛОЖЕННЫЕ ФАЙЛЫ:";  ind++;
  if (count_Bin!=d)                      { mSt[ind]="Всего файлов   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_Bin;  ind++ }
  if (count_BinUnused!=d)      { mSt[ind]="Неиспользуемые файлы  .  .  .  .  .  .  .  .  .  .  .	"+count_BinUnused;  ind++ }
  if (count_BinRepit!=d)           { mSt[ind]="Копии файлов  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_BinRepit;  ind++ }
  if (count_BinSizeAll!=d) {
          if (count_Bin>1  ||  d)    { mSt[ind]="Размер всех файлов  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_BinSizeAll;  ind++ }
          if (count_Bin==1  &&  count_BinUnused!=d  ||  d)
                                                          { mSt[ind]="Размер файла  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_BinSizeAll;  ind++ }     }
  if (count_BinSizeMedi!=d  &&  count_Bin>1  ||  d)
                                                          { mSt[ind]="Средний размер файла   .  .  .  .  .  .  .  .  .  .  .	"+count_BinSizeMedi;  ind++ }
  if (count_BinSizeCovMax!=d) {
          if (count_BinCov>1  ||  d)    { mSt[ind]="Максимальный размер обложки .  .  .  .  .  .  .	"+count_BinSizeCovMax;  ind++ }
          if (count_BinCov==1  ||  d) { mSt[ind]="Размер обложки  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_BinSizeCovMax;  ind++ }     }
  if (count_BinSizeImgMax!=d) {
          if (count_BinImg>1  ||  d)    { mSt[ind]="Максимальный размер иллюстрации  .  .  .  .	"+count_BinSizeImgMax;  ind++ }
          if (count_BinImg==1  ||  d) { mSt[ind]="Размер иллюстрации    .  .  .  .  .  .  .  .  .  .  .  .	"+count_BinSizeImgMax;  ind++ }     }

 if (mRzd[rz]==ind-2) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в последнем разделе
 rz++;  mRzd[rz]=ind;  //  Число строк в описанных разделах

                                                             mSt[ind]="";  ind++;
                                                             mSt[ind]="• ИЛЛЮСТРАЦИИ:";  ind++;
  if (count_tiCover[0]!=d)        { mSt[ind]="Обложек   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_tiCover[0];  ind++ }
  if (count_tiCover[1]!=d) {
          if (count_tiCover[1] == count_tiCover[0]  ||  d)  { if (!d) ind--;  mSt[ind]="Обложек (jpg)  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_tiCover[1];  ind++ }
          if (count_tiCover[1] != count_tiCover[0]  ||  d)   { mSt[ind]="      jpg-формат   .  .  .  .  .  .	"+count_tiCover[1];  ind++ }     }
  if (count_tiCover[2]!=d) {
          if (count_tiCover[2] == count_tiCover[0]  ||  d)  { if (!d) ind--;  mSt[ind]="Обложек (png) .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_tiCover[2];  ind++ }
          if (count_tiCover[2] != count_tiCover[0]  ||  d)   { mSt[ind]="      png-формат  .  .  .  .  .  .	"+count_tiCover[2];  ind++ }    }
  if (count_tiCover[3]!=d) {
          if (count_tiCover[3] == count_tiCover[0]  ||  d)  { if (!d) ind--;  mSt[ind]="Обложек (невалидный формат)  .  .  .  .  .  .	"+count_tiCover[3];  ind++ }
          if (count_tiCover[3] != count_tiCover[0]  ||  d)   { mSt[ind]="      невалидный формат   	"+count_tiCover[3];  ind++ }    }

  if (count_stiCover[0]!=d)     { mSt[ind]="Обложек на языке оригинала  .  .  .  .  .  .  .  .	"+count_stiCover[0];  ind++ }
  if (count_stiCover[1]!=d) {
          if (count_stiCover[1] == count_stiCover[0]  ||  d)  { if (!d) ind--;  mSt[ind]="Обложек на языке оригинала (jpg)   .  .  .  .  .	"+count_stiCover[1];  ind++ }
          if (count_stiCover[1] != count_stiCover[0]  ||  d)   { mSt[ind]="      jpg-формат   .  .  .  .  .  .	"+count_stiCover[1];  ind++ }    }
  if (count_stiCover[2]!=d) {
          if (count_stiCover[2] == count_stiCover[0]  ||  d)  { if (!d) ind--;  mSt[ind]="Обложек на языке оригинала (png)  .  .  .  .  .	"+count_stiCover[2];  ind++ }
          if (count_stiCover[2] != count_stiCover[0]  ||  d)   { mSt[ind]="      png-формат  .  .  .  .  .  .	"+count_stiCover[2];  ind++ }    }
  if (count_stiCover[3]!=d) {
          if (count_stiCover[3] == count_stiCover[0]  ||  d)  { if (!d) ind--;  mSt[ind]="Обложек на языке ориг. (невалид. формат)	"+count_stiCover[3];  ind++ }
          if (count_stiCover[3] != count_stiCover[0]  ||  d)   { mSt[ind]="      невалидный формат   	"+count_stiCover[3];  ind++ }    }

  if (count_divImg[0]!=d)        { mSt[ind]="Обычная графика  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_divImg[0];  ind++ }
  if (count_divImg[1]!=d) {
          if (count_divImg[1] == count_divImg[0]  ||  d)  { if (!d) ind--;  mSt[ind]="Обычная графика (jpg)   .  .  .  .  .  .  .  .  .  .  .	"+count_divImg[1];  ind++ }
          if (count_divImg[1] != count_divImg[0]  ||  d)   { mSt[ind]="      jpg-формат   .  .  .  .  .  .	"+count_divImg[1];  ind++ }    }
  if (count_divImg[2]!=d) {
          if (count_divImg[2] == count_divImg[0]  ||  d)  { if (!d) ind--;  mSt[ind]="Обычная графика (png)  .  .  .  .  .  .  .  .  .  .  .	"+count_divImg[2];  ind++ }
          if (count_divImg[2] != count_divImg[0]  ||  d)   { mSt[ind]="      png-формат  .  .  .  .  .  .	"+count_divImg[2];  ind++ }    }
  if (count_divImg[3]!=d) {
          if (count_divImg[3] == count_divImg[0]  ||  d)  { if (!d) ind--;  mSt[ind]="Обычная графика (невалидный формат) .  .	"+count_divImg[3];  ind++ }
          if (count_divImg[3] != count_divImg[0]  ||  d)   { mSt[ind]="      невалидный формат   	"+count_divImg[3];  ind++ }    }

  if (count_spanImg[0]!=d)     { mSt[ind]="Графика в строке  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_spanImg[0];  ind++ }
  if (count_spanImg[1]!=d) {
          if (count_spanImg[1] == count_spanImg[0]  ||  d)  { if (!d) ind--;  mSt[ind]="Графика в строке (jpg)   .  .  .  .  .  .  .  .  .  .  .	"+count_spanImg[1];  ind++ }
          if (count_spanImg[1] != count_spanImg[0]  ||  d)   { mSt[ind]="      jpg-формат   .  .  .  .  .  .	"+count_spanImg[1];  ind++ }    }
  if (count_spanImg[2]!=d) {
          if (count_spanImg[2] == count_spanImg[0]  ||  d)  { if (!d) ind--;  mSt[ind]="Графика в строке (png)  .  .  .  .  .  .  .  .  .  .  .	"+count_spanImg[2];  ind++ }
          if (count_spanImg[2] != count_spanImg[0]  ||  d)   { mSt[ind]="      png-формат  .  .  .  .  .  .	"+count_spanImg[2];  ind++ }    }
  if (count_spanImg[3]!=d) {
          if (count_spanImg[3] == count_spanImg[0]  ||  d)  { if (!d) ind--;  mSt[ind]="Графика в строке (невалидный формат)   .  .	"+count_spanImg[3];  ind++ }
          if (count_spanImg[3] != count_spanImg[0]  ||  d)   { mSt[ind]="      невалидный формат   	"+count_spanImg[3];  ind++ }    }

  if (count_CovRepit!=d)          { mSt[ind]="Повторное использование обложки   .  .  .  .	"+count_CovRepit;  ind++ }
  if (count_ImgRepit!=d)          { mSt[ind]="Повторные иллюстрации   .  .  .  .  .  .  .  .  .  .	"+count_ImgRepit;  ind++ }
  if (count_zeroImg!=d)            { mSt[ind]="Пустые иллюстрации   .  .  .  .  .  .  .  .  .  .  .  .	"+count_zeroImg;  ind++ }
  if (count_titleImg!=d)             { mSt[ind]="Заголовки внутри иллюстраций .  .  .  .  .  .  .	"+count_titleImg;  ind++ }

 if (mRzd[rz]==ind-2) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в последнем разделе
 rz++;  mRzd[rz]=ind;  //  Число строк в описанных разделах

                                                            mSt[ind]="";  ind++;
                                                            mSt[ind]="• ВНУТРЕННИЕ ТЕГИ:";  ind++;
  if (count_Em!=d)                     { mSt[ind]="Курсив   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_Em;  ind++ }
  if (count_St!=d)                         { mSt[ind]="Жирность  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_St;  ind++ }
  if (count_EmSt!=d)                  { mSt[ind]="Жирный курсив  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_EmSt;  ind++ }
  if (count_A10!=d)                    { mSt[ind]="Верхний индекс  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_A10;  ind++ }
  if (count_A11!=d)                   { mSt[ind]="Нижний индекс   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_A11;  ind++ }
  if (count_A12!=d)                   { mSt[ind]="Зачеркивание  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_A12;  ind++ }
  if (count_A13!=d)                   { mSt[ind]="Код  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_A13;  ind++ }
  if (count_A14!=d)                   { mSt[ind]="Стиль  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_A14;  ind++ }
  if (count_Not!=d)                     { mSt[ind]="Сноски на примечания .  .  .  .  .  .  .  .  .  .  .  .	"+count_Not;  ind++ }
  if (count_Com!=d)                   { mSt[ind]="Сноски на комментарии  .  .  .  .  .  .  .  .  .  .  .	"+count_Com;  ind++ }
  if (count_A15!=d)                   { mSt[ind]="Гиперссылки    .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_A15;  ind++ }

 if (mRzd[rz]==ind-2) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в последнем разделе
 rz++;  mRzd[rz]=ind;  //  Число строк в описанных разделах

                                                           mSt[ind]="";  ind++;
                                                           mSt[ind]="• ПРЕДПОЛАГАЕМЫЕ ОШИБКИ:";  ind++;
  if (!VersionH  ||  d)                  { mSt[ind]="• В истории не найдена версия файла .  .  .  .	v."+VersionFile;  ind++ }
  if (count_A41_42 > 0  ||  d)  { mSt[ind]="• «Левых «угловых «кавычек «больше   .  .  .	+"+count_A41_42;  ind++ }
  if (count_A41_42 < 0  ||  d)  { mSt[ind]="• Правых» угловых» кавычек» больше» .  .  .	+"+(-count_A41_42);  ind++ }
  if (count_A43_44 > 0  ||  d)  { mSt[ind]="• „Левых „внутренних „кавычек „больше   .  .	+"+count_A43_44;  ind++ }
  if (count_A43_44 < 0  ||  d)  { mSt[ind]="• Правых“ внутренних“ кавычек“ больше“ .  .	+"+(-count_A43_44);  ind++ }
  if (count_A45!=d)                    { mSt[ind]="• Простые кавычки  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_A45;  ind++ }
  if (count_A80!=d)                    { mSt[ind]="• Р а з р я д к а   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_A80;  ind++ }
  if (count_A81!=d)                    { mSt[ind]="• Латиница в кириллице .  .  .  .  .  .  .  .  .  .  .	"+count_A81;  ind++ }
  if (count_A97!=d)                    { mSt[ind]="• строчная буква в начале строки .  .  .  .  .  .	"+count_A97;  ind++ }
  if (count_A95!=d)                    { mSt[ind]="• Большие числа без разрядов .  .  .  .  .  .  .  .	"+count_A95;  ind++ }
  if (count_A83!=d)                    { mSt[ind]="• * Звездочка в начале строки   .  .  .  .  .  .  .	"+count_A83;  ind++ }
  if (count_A91!=d)                    { mSt[ind]="• [Текст в квадратных скобках] .  .  .  .  .  .  .	"+count_A91;  ind++ }
  if (count_A92!=d)                    { mSt[ind]="• {Текст в фигурных скобках} .  .  .  .  .  .  .  .	"+count_A92;  ind++ }
  if (count_A93!=d)                    { mSt[ind]="• [Число в квадратных скобках] .  .  .  .  .  .  .	"+count_A93;  ind++ }
  if (count_A94!=d)                    { mSt[ind]="• {Число в фигурных скобках} .  .  .  .  .  .  .  .	"+count_A94;  ind++ }
  if (count_A96!=d)                    { mSt[ind]="• Текст+число без пробела между ними .  .  .	"+count_A96;  ind++ }

 if (mRzd[rz]==ind-2) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в последнем разделе
 rz++;  mRzd[rz]=ind;  //  Число строк в описанных разделах


//  Сборка строк текущей даты и времени
 mSt[ind]="";  ind++;
 mSt[ind]= "• "+currentDate+" • "+currentTime+" •";  ind++;

//  Сборка строк пословицы
 mSt[ind]="";  ind++;
 mSt[ind]="-------------------------------------------------------";  ind++;
 var reZit = new RegExp("([^ ].{0,43})(?=\\\s\\\s.{0,}|$)","g");   // Рег. выражение для разделения цитаты на строки.
 mSt=mSt.concat(Kn[Rn_(Kn.length)].replace(/ /g, "  ").match(reZit));   //  Добавление массива строк цитаты в основной массив.
 for (j=mSt.length-1; j>=ind; j--)  mSt[j]=" "+mSt[j];   //  Добавление отступа.
// for (j=mSt.length-1; j>=ind; j--)  { mSt.splice(j+1, 0, ""+mSt[j].length) }   //  Добавление длины строк цитаты (отключено).
 ind = mSt.length;    //  Определение индекса.

 rz++;  mRzd[rz]=ind;  //  Число строк в описанных разделах

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// СОХРАНЕНИЕ  :  Сборка текста статистики

 var textStat="";
 if (SaveStat)
         for (n=0; n<ind; n++)
                 textStat += mSt[n]+"\n";  //  добавление строки статистики

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Определение высоты колонки в таблице с результатами обработки

 var page;   // Число страниц
 var Kolo;   //  Высота колонки
 var Kolo_R;   //  Пробная высота колонки
//  Кроме того,  "ind" - теперь общее число строк статистики
//                               "rz" - номер последнего раздела статистики

//  Замена общего числа строк предыдущих разделов  на  число строк отдельных разделов
//  Т.е. в каждой ячейке массива будет размер соответствующего раздела (в строках)
 for (n=rz; n>0; n--)
         mRzd[n] -= mRzd[n-1];

//MsgBox (mRzd);  // высота разделов с учетом первой пустой строки


               //  Определение высоты колонки


 var page;   //  Число страниц

 if (Vysota_teksta >= ind) {   // Если все строки могут поместиться на одной странице
         page=1;
         Kolo=ind;
         }
     else
 {         // иначе...

 Vysota_teksta -= 2;   //  высота колонки (в конце сборки страниц добавятся 2 строки)
 for (n=5; ; n++) {     //  Постепенное увеличение высоты страницы (начиная с высоты первого раздела)
         j=0;
         for (k=1; k<=15; k++) {           //  Пробное заполнение страниц (до 15 шт., т.е. теоретически может быть и по одному разделу на страницу)
                 Kolo_R = -1;                        //  В начале страницы не учитывается первая (пустая) строка
                 for (; j<=rz; j++)           //  Пробное заполнение k-й страницы
                         if (Kolo_R+mRzd[j] <= n)  Kolo_R += mRzd[j];    //  Добавление раздела в страницу (если возможно)
                             else  break;                              //  Если больше не влазит выходим из цикла одной страницы
                 if (j>rz)  break;          //  Если вошли все разделы - выходим из цикла всех страниц
                 }
         if (j>rz)          //  Если вошли все разделы:
                 if (!Kolo) {         //  Если это первое удачное заполнение
                         Kolo=n;                                     //  отмечаем высоту страницы первого удачного заполнения
                         page=k;                                     //  и количество страниц
//MsgBox (page+"\n"+Kolo);
                         if (Kolo > Vysota_teksta)  break;   //  если полученная высота строки превысила максимум - завершаем определение высоты страницы.
                         }
                     else {                //  Если не первое:
                             if (n > Vysota_teksta)  break;   //  если полученная высота строки превысила максимум - завершаем определение высоты страницы.
                                 else                //  иначе:
                                     if (page!=k) {                //  если количество страниц изменилось (оно может только уменьшиться)
                                             Kolo=n;                //  отмечаем высоту страницы очередного удачного заполнения
                                             page=k;                //  и количество страниц
//MsgBox (page+"\n"+Kolo);
                                             }
                             }
         }

 }


 var mPage=[];       // массив страниц
 ind=0;                       //  текущий номер строки в статистике
 var indFinita=0;     //  последний номер строки в статистике (для отдельной страницы)
 j=0;                               //  текущий номер раздела

 for (k=0; k < page; k++) {
         mPage[k] = "";
         Kolo_R = -1;                        //  В начале страницы не учитывается первая (пустая) строка
         for ( ; j<=rz; j++)           //  Пробное заполнение k-й страницы
                 if (Kolo_R+mRzd[j] <= Kolo)  Kolo_R += mRzd[j];    //  Добавление раздела в страницу (если возможно)
                     else  break;                              //  Если больше не влазит выходим из цикла пробного заполнения страницы
         n=0;                                            //  текущий номер строки в отдельной странице
         ind++;                                      //  пропуск начальной пустой строки
         indFinita += 1+Kolo_R;         //  к предыдущему значению "indFinita" добавляется одна (пустая) строка и высота разделов
         for (; ind<indFinita; ind++) {            //  Заполнение k-й страницы разделами
                 mPage[k] += mSt[ind]+"\n";  //  добавление строки статистики
                 n++;                                                //  учет номера строк на странице
                 }
         for (; n<Kolo; n++)            //  Заполнение оставшейся части k-й страницы пустыми строками
                 mPage[k] += "\n";
         if (page!=1) {                       //  Завершение страницы
                 mPage[k]+="						\n";
                 if (k!=page-1)  mPage[k]+="◊  Стр. "+(k+1)+"  ◊  Показать  следующую  страницу?";
                         else  mPage[k]+="◊  Стр. "+(k+1)+" (последняя)  ◊  Закрыть окно?";
                 }
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Вывод страниц с результатами на экран

 var otvet = true;
 n=0;

 while (otvet) {        // Цикл для страниц
         if (page == 1) {
                 MsgBox (mPage[0]);
                 break;
                 }
         otvet = AskYesNo (mPage[n]);
         n++;
         if (n == page)  {
                 n=0;
                 otvet = !otvet;
                 }
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// СОХРАНЕНИЕ

         //  сохранение в буфер обмена
 if (SaveStat == 1  &&  AskYesNo ("◊  Сохранить текст общей статистики       \n               в буфер обмена?"))
         window.clipboardData.setData("text",textStat);

         //  сохранение в файл
 var name="Общая статистика ("+currentDate+" "+currentHours+"-"+currentMinutes+"-"+currentSeconds+").txt";
 if (SaveStat == 2  &&  AskYesNo ("◊  Сохранить текст общей статистики       \n    в TXT-файл, в кодировке \"UTF-16 LE\"?       "))
         window.external.SaveBinary(name, textStat, true);

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------

}





                 ///  ИСТОРИЯ ИЗМЕНЕНИЙ


// v.1.0 — Создание скрипта «Статистика строк» — Александр Ка (11.02.2024)

// v.1.1  — Александр Ка (08.06.2024)
// + Поиск и подсчет форматирования: автор текста, стиль
// + Поиск и подсчет внутренних заголовков в картинках
// + Поиск и подсчет р а з р я д к и
// + Увеличение ширины окна результатов

// v.1.2  — Александр Ка (31.07.2024)
// + Разделение на два скрипта:  «Общая статистика» и «Цитатный фразатрон».
// + Раздельный подсчет в структуре текста (в зависимости от корневого раздела, и уровня вложений секции)
// + Подробный подсчет для    иллюстраций, обложек, бинарных объектов.
// + Третья колонка в окне результатов
// + Пословицы

// v.1.3  — Александр Ка (08.01.2025)
// Страничный вид окна результатов
// Исправлены все ошибки в окнах для win7
// Добавлена возможность сохранения результатов (в настройках)
// Добавлен демонстрационный режим (в настройках)

// v.1.3  — Мелочи — Александр Ка (28.04.2025)




