//======================================
//             «Общая статистика»
// v.1.0 — Создание скрипта «Статистика строк» — Александр Ка (11.02.2024)
// * Раздел <history> не учитывается при подсчете предполагаемых ошибок и внутренних тегов
//======================================
// v.1.1  — Александр Ка (08.06.2024)
// + Поиск и подсчет форматирования: автор текста, стиль
// + Поиск и подсчет внутренних заголовков в картинках
// + Поиск и подсчет р а з р я д к и
// + Увеличение ширины окна результатов
//======================================
// v.1.2  — Александр Ка (31.07.2024)
// + Разделение на два скрипта:  «Общая статистика» и «Цитатный фразатрон».
// + Раздельный подсчет в структуре текста (в зависимости от корневого раздела, и уровня вложений секции)
// + Подробный подсчет для    иллюстраций, обложек, бинарных объектов.
// + Третья колонка в окне результатов
// + Пословицы
// + Мелочи
//======================================
var NumerusVersion="1.2";

  var Ts=new Date().getTime();
  var tempus=0;

function Run() {

// ---------------------------------------------------------------
// ---------------------------------------------------------------
// ---------------------------------------------------------------

                 ///  НАСТРОЙКИ

// ---------------------------------------------------------------

         //     Ориентировочное количество строк колонки в окне результатов.
//  От этого значения зависит число колонок, на которые будет разбита статистика.
//  Чем меньше высота, тем большее число колонок может понадобиться для вывода результатов.
//  Максимальное число колонок — 3.

var Vysota_kolonki = 40;      // 0-47 (примерно)  //      Число строк в одной колонке.

// * Для «0» скрипт будет стараться всегда создавать окно результатов в три колонки
// * Для «47» окно не будет превышать высоту монитора 1024х768

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОБЩИЕ ПЕРЕМЕННЫЕ


 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar }
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;" }

 var fbwBody=document.getElementById("fbw_body");   //  Структура текста (аннотация + история + все <body>, иначе говоря, всё это видно в режиме "B"-дизайн)

 var n=0;  //   Локальная переменная для небольших областей
 var k=0;  //   Локальная переменная для небольших областей
 var j=0;  //   Локальная переменная для небольших областей

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
 var reA80 = new RegExp("(\\\s|"+nbspEntity+")([А-яA-Za-zЁё0-9](\\\s|"+nbspEntity+")){4,}","g"); //  4 раздельные буквы
 var count_A80 = 0;

// Латиница в кириллице
 var reA81 = new RegExp("([a-z][а-яё]|[а-яё][a-z])","gi");
 var count_A81 = 0;

// Звездочка в начале строки
 var reA83 = new RegExp("^(\\\s|"+nbspEntity+"){0,}\\\*.{0,10}[А-яA-Za-zЁё]","g");
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
 var reA96 = new RegExp("[а-яa-zё]{3,}[…\\\.,:;\\\?!»“”\\\"]{0,4}\\\d{1,4}([…\\\.,:;\\\?!\\\)\\\]»“”\\\"'—–\\\-]|\\\s|"+nbspEntity+"|$)","g");
 var count_A96 = 0;

// Строчные буквы в начале строки
 var reA97 = new RegExp("^[а-яa-zё]{2}","g");
 var count_A97 = 0;


          // Для подсчета всех символов
 var count_littera = 0;

          // Для подсчета всех слов
 var reWord = new RegExp("(^|\\\s|"+nbspEntity+").{0,}?[А-яA-Za-zЁё].{0,}?(?=\\\s|"+nbspEntity+"|$)","g");
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

   if (sct.search(reA95)!=-1)    count_A95+=sct.match(reA95).length;         // Большие числа
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
 var VersionH=VersionFile+"H";  // Версия файла, отмеченная в последних строках истории

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
                               for ( k=mP.length-1; k>=0; k--)                     //  Поиск в "истории" и получение номера последней версии файла
                                       if (mP[k].innerText.search(/^.{0,15}?\d{1,8}(\.\d{1,8}){0,1}([^0-9]|$)/g)!=-1)
                                               { VersionH = mP[k].innerText.replace(/^.{0,15}?(\d{1,8}(\.\d{1,8}){0,1}).*/g, "$1");  break }
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

 var mBinName=[];  //  Массив с описанием файлов
 var binName;      //  Описание одного из файлов

 var mBinType=[];  //  Массив с именами файлов
 var binType;      //  Имя одного из файлов

 var mBinDims=[];  //  Массив с габаритами всех изображений
 var binDims;       //  Габариты одного из изображений

 var mBinSize=[];  //  Массив с размерами всех файлов
 var binSize;       //  Размер одного из файлов

         //  Получение записей о бинарных файлах:  Имя;  Тип;  Размер (в байтах);  Размер  (габариты изображения)
 for (n=0;  n<count_Bin;  n++) {
         binName=mBin[n].all.id.value;
         binType=mBin[n].all.type.value;
         binSize=mBin[n].all.size.value;
         if (mBin[n].all.dims)  binDims=mBin[n].all.dims.value;
             else  binDims="х";          //  Для невалидных файлов нет записей о размере изображения
         mBinName[n]=binName;
         mBinType[n]=binType;
         mBinSize[n]=binSize;
         mBinDims[n]=binDims;
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

           // Функция посчета   байт, килобайт, мегабайт
 function kilobytes (num) {
     if (num == 0)  return  0;
     if (num < 1024)  return  num+" Б";
     num /= 1024;
     if (num < 1024)  return  okruglenie(num)+" кБ";
     num /= 1024;
     return  okruglenie(num)+" МБ";
     }

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



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Создание списка цитат


 var Kn=[];
 var zitata_N = Math.floor(("000000"+Math.tan(Ts)).replace(/[\.\-]/g, "").replace(/.+(\d{6})\d$/g, "$1")/1000000*271)+1;
  //  * самодельный ГСЧ

//  Из книги "Пословицы и поговорки Великой Отечественной войны"
//                         (составитель Лебедев Павел Федорович)

Kn[1]="Одна у человека мать, одна у него и Родина.";
Kn[2]="Родина любимая — мать родимая.";
Kn[3]="Родина — мать, умей за нее постоять.";
Kn[4]="Где ни жить — Родине служить.";
Kn[5]="С Родиной разлука — одна мука.";
Kn[6]="Всякому мила своя сторона.";
Kn[7]="Своя земля и в горсти мила.";
Kn[8]="На чужой стороне и весна не красна.";
Kn[9]="Где кто родится, там и пригодится.";
Kn[10]="На чужбине родная землица во сне снится.";
Kn[11]="На своей стороне мило, на чужой — постыло.";
Kn[12]="На чужой стороне и сокола зовут вороною.";
Kn[13]="Всякая сосна своему лесу весть подает.";
Kn[14]="Родная страна — колыбель, чужая — дырявое корыто.";
Kn[15]="На солнце тепло, на родине добро.";
Kn[16]="Человек без Родины что соловей без песни.";
Kn[17]="Глупа та птица, которой свое гнездо не мило.";
Kn[18]="Кукушка кукует — по бездомью горюет.";
Kn[19]="Расставшийся с другом плачет семь лет, расставшийся с Родиной — всю жизнь.";
Kn[20]="Нет ничего на свете краше, чем Родина наша.";
Kn[21]="Нашей страны шире не найти в мире.";
Kn[22]="Русское раздолье — человеку приволье.";
Kn[23]="Богата русская земля — говорится не зря.";
Kn[24]="Я тобой горжусь, милая Русь.";
Kn[25]="Человек без Родины что солдат без оружия.";
Kn[26]="Счастье Родины дороже жизни.";
Kn[27]="Береги страну как зеницу ока.";
Kn[28]="Может, и голову сложу, а Родине послужу.";
Kn[29]="Нам Отчизна дорога, охраняем родные берега.";
Kn[30]="Пусть знает ворог: нам край свой дорог.";
Kn[31]="Кто любовь к Отчизне имеет, тот врага одолеет.";
Kn[32]="Мы бережем свою Родину-мать, за нее мы готовы жизнь отдать.";
Kn[33]="С нами родная земля, нам светят звезды Кремля.";
Kn[34]="Великие победы нас ждут впереди под лучами красной звезды.";
Kn[35]="Красная звезда светит всегда.";
Kn[36]="Теперь все дороги ведут в Москву.";
Kn[37]="Москва от глаз далека, да сердцу близка.";
Kn[38]="Москва — наша столица, Москвой народ гордится.";
Kn[39]="Москва — всем столицам голова.";
Kn[40]="Москва — столица, любо подивиться.";
Kn[41]="У русской столицы не видать границы.";
Kn[42]="По Москве ходить — глаз с нее не сводить.";
Kn[43]="Москва — Родины украшенье, врагам устрашение.";
Kn[44]="Кремль тем и красен, что с народом согласен.";
Kn[45]="Наша страна дружбой сильна.";
Kn[46]="У нас все народы живут в ладу — врагам на беду.";
Kn[47]="Солнце не померкнет над нами, братство — наша сила и знамя.";
Kn[48]="Народное братство дороже всякого богатства.";
Kn[49]="Если дружба велика, будет Родина крепка.";
Kn[50]="Дружбу нашу не разделят просторы, моря и горы.";
Kn[51]="Страна растет — врагов метет.";
Kn[52]="Не тот человек, кто для себя живет, а тот человек, кто народу силы отдает.";
Kn[53]="За Родину и народ иду вперед.";
Kn[54]="Человек без народа что дерево без плода.";
Kn[55]="Чтобы с врагами биться, надо всем сплотиться.";
Kn[56]="Не трудно врагов победить, если всем заодно быть.";
Kn[57]="Наш народ сплочен и един, он непобедим.";
Kn[58]="Кто на нас нападает, тот в могилу попадает.";
Kn[59]="Россия с давних пор давала врагу отпор.";
Kn[60]="Никогда Россия ярма не носила.";
Kn[61]="За наше Отечество все человечество.";
Kn[62]="Не летать фашистским стаям над нашим краем.";
Kn[63]="Мы не боимся свинцовой тучи: наши полки могучи.";
Kn[64]="Кто на Советский Союз покушается, тот после раскается.";
Kn[65]="Бей фашистов не в бровь, а в глаз — таков народа наказ.";
Kn[66]="Любовь к народу, ненависть к врагу — душа победы.";
Kn[67]="От Родины награда — сердцу отрада.";
Kn[68]="Отчизна родная — для нас святая.";
Kn[69]="Знает свет: тверже русских нет.";
Kn[70]="Наш народ — герой, ходит на врага стеной.";
Kn[71]="Сыновья русских матерей славятся удалью богатырей.";
Kn[72]="Наша страна героями славится.";
Kn[73]="Кто за Родину горой — тот истинный герой.";
Kn[74]="Без патриотизма не разбить фашизма.";
Kn[75]="Защищай Советскую державу, бей фашистскую ораву.";
Kn[76]="Фашистам смерть неси — не опозорь Руси.";
Kn[77]="Даю Родине слово: мстить фашистам сурово.";
Kn[78]="Во имя Отчизны своей где фашиста увидел — бей.";
Kn[79]="За народное дело бейся смело.";
Kn[80]="Для Родины своей ни сил, ни жизни не жалей.";
Kn[81]="Жизнь отдам, а Родину не продам.";
Kn[82]="С родной земли — умри не сходи.";
Kn[83]="За Родину-мать не страшно умирать.";
Kn[84]="За Родину жизни не пощадим, но врагу ничего не отдадим.";
Kn[85]="Кому нашей земли захочется, тот под ней скорчится.";
Kn[86]="Родину любить — фашистов бить.";
Kn[87]="Бей фашистский сброд — за Родину, за народ.";
Kn[88]="Родину любить — верно Родине служить.";
Kn[89]="Родину беречь — врагов сечь.";
Kn[90]="Для нас война не страх — развеем врага в прах.";
Kn[91]="Гитлер пришел к нам незваным, а уйдет от нас драным.";
Kn[92]="Не придется Гитлеру из Ленинграда сделать море, а из Москвы — поле.";
Kn[93]="Думал Гитлер нашими землями управлять, а придется ему подыхать.";
Kn[94]="Штык советский молодец — скоро Гитлеру конец.";
Kn[95]="У Гитлера не столько расчетов, сколько просчетов.";
Kn[96]="Гитлер предполагает, а Красная Армия располагает.";
Kn[97]="Посмотрим, как Гитлер завоет, когда наши огонь по Берлину откроют.";
Kn[98]="Раздавим Гитлера в блин, как придем в Берлин.";
Kn[99]="Гитлеру-палачу местью отплачу.";
Kn[100]="Пора с Гитлером кончать — хватит ему рычать.";
Kn[101]="Гитлер и его правительство ответят за грабительство.";
Kn[102]="Гитлер кричит, мы весь свет разрушим, а мы Гитлера наперед задушим.";
Kn[103]="Сколько Гитлер ни крути, а от петли не уйти.";
Kn[104]="Гитлер победами хвалится, да в могилу свалится.";
Kn[105]="Хотел Гитлер Россию съесть, да пришлось в лужу сесть.";
Kn[106]="Не довелось свинье на небо дивиться, а Гитлеру в нашем огороде рыться.";
Kn[107]="Медведя знают по когтям, а Геббельса по лживым речам.";
Kn[108]="Фашистские собаки сочиняют враки.";
Kn[109]="Фашист брехней живет.";
Kn[110]="Солдаты у Гитлера вшивы, сводки у Геббельса лживы.";
Kn[111]="От осины не жди ягоды, от фашиста — правды.";
Kn[112]="Геббельс вертит языком без меры, да нет ему веры.";
Kn[113]="Геббельс мелет, да никто ему не верит.";
Kn[114]="Германия вот-вот развалится, а Геббельс все хвалится.";
Kn[115]="Германия пылает, а Геббельс все лает.";
Kn[116]="Врет, как фашистский бюллетень.";
Kn[117]="Как Геббельс ни врет, а наша берет.";
Kn[118]="Против фашистской лжи ухо востро держи.";
Kn[119]="Фашистские оковы всей Европе знакомы.";
Kn[120]="Лучше волку в зубы, чем фашистам в руки.";
Kn[121]="Фашист гладок, да вид его гадок.";
Kn[122]="Фашист от когтей до носа похож на барбоса.";
Kn[123]="Фашист и сатана — сущность одна.";
Kn[124]="Не ищи в фашисте человека — не найдешь.";
Kn[125]="Легче шакала превратить в голубя, чем фашиста в человека.";
Kn[126]="Фашистов легче убить, чем вразумить.";
Kn[127]="Фашистская власть — грабить и красть.";
Kn[128]="У фашистов особый спорт: кто больше добра сопрет.";
Kn[129]="Видно птицу по полету, а фашиста — по грабежам.";
Kn[130]="Сколько фашисту ни воровать, а виселицы не миновать.";
Kn[131]="Для предателя сгори хоть целый свет, лишь бы он был согрет.";
Kn[132]="Змея один раз в год меняет кожу, а предатель — каждый день.";
Kn[133]="Предатель фашисту пятки лизал, а фашист и спасибо не сказал.";
Kn[134]="У предателя ни Родины, ни друзей.";
Kn[135]="Лучше глаза лишиться, чем доброго имени.";
Kn[136]="Героям — слава, предателям — смерть.";
Kn[137]="Слава греет, позор жжет.";
Kn[138]="Бесчестье хуже смерти.";
Kn[139]="Кто с врагами пьет и гуляет, того и земля не принимает.";
Kn[140]="Думал фриц нашим богатством нажиться, да пришлось в могилу ложиться.";
Kn[141]="Не видать свинье неба, а фашистам нашего хлеба.";
Kn[142]="Кого к столу приглашают, а в фашиста пулю сажают.";
Kn[143]="Кому чарка, кому две, а фашисту — камнем по голове.";
Kn[144]="Угостили фашистов не водкой, а прямой наводкой.";
Kn[145]="Врага не уговаривай: с ним штыком разговаривай.";
Kn[146]="Убил фашистского гада — душа рада.";
Kn[147]="Съели бы фашисты русского мужика, да кишка тонка.";
Kn[148]="Одного фашиста убить — сто детей спасти.";
Kn[149]="Фашиста убить что змею: сто грехов простится.";
Kn[150]="Лучше смерть на поле, чем позор в неволе.";
Kn[151]="Чем позор и неволю терпеть, лучше в бою умереть.";
Kn[152]="Лучше биться орлом, чем жить зайцем.";
Kn[153]="Никогда фашистам не властвовать над нами, никогда не будем рабами.";
Kn[154]="Лучше злая пуля, чем клеймо раба.";
Kn[155]="Славная смерть лучше постыдной жизни.";
Kn[156]="Воевать — не галушки жевать.";
Kn[157]="Не воевать — победы не видать.";
Kn[158]="Слабого огонь войны испепеляет, а сильного как сталь закаляет.";
Kn[159]="Кто за правое дело дерется, у того двойная сила берется.";
Kn[160]="Наше дело правое — бей врага браво.";
Kn[161]="Бей фашистских властей всех мастей.";
Kn[162]="С какой злостью превеликой мы расправимся с фашистской кликой.";
Kn[163]="С врагами биться — на пули не скупиться.";
Kn[164]="Винтовка хлоп — и фашист в гроб.";
Kn[165]="Пришел фашист из Берлина — получил земли три аршина.";
Kn[166]="Не важно, чем бил, — важно, что фашиста убил.";
Kn[167]="Каждой фашистской гадине висеть на перекладине.";
Kn[168]="Всякому свой путь: журавлю — в небо, волку — в лес, а фашисту — в могилу.";
Kn[169]="Упрямого выправит дубина, а фашиста — могила.";
Kn[170]="Какую яму фашист копал — в такую и попал.";
Kn[171]="Фашисты научились воровать, а мы научились фашистов убивать.";
Kn[172]="Наш порог не для фашистских сапог.";
Kn[173]="Фашиста согнем в бараний рог, чтоб не переступал наш порог.";
Kn[174]="Лося бьют в осень, а фашиста всегда.";
Kn[175]="Наше дело святое и правое, мы расправимся с фашистскою оравою.";
Kn[176]="С фашистом разговор короткий: круши его прямой наводкой.";
Kn[177]="Кричал фашист «гоп», да получил пулю в лоб.";
Kn[178]="Фашиста умертвить — доброе дело сотворить.";
Kn[179]="На фронте воевать — славу добывать.";
Kn[180]="Фронт гремит — у врага земля горит.";
Kn[181]="Гремят вспышки на горизонте: то бьют фашистов на фронте.";
Kn[182]="Фашистов разгромили — и в селе порядок водворили.";
Kn[183]="Фашист замахнулся, да промахнулся.";
Kn[184]="Дрался фашист пылко, да остался без затылка.";
Kn[185]="Фашисты козыряли, да головы потеряли.";
Kn[186]="Фашисты пять раз на дню попадают в западню.";
Kn[187]="У фашистов брожение: попали в окружение.";
Kn[188]="Фашистам не все напирать — пришлось и умирать.";
Kn[189]="Трави фашистскую силу — огнем и штыком загоняй в могилу.";
Kn[190]="Чокнемся, фашист, я парень не гордый: я — прикладом, а ты — мордой.";
Kn[191]="На то у винтовок и ложи, чтобы бить фашиста по роже.";
Kn[192]="Слава русского штыка не померкнет века.";
Kn[193]="Штык остёр загнал фрицев в «котел».";
Kn[194]="Наши штыки разгромят фашистские полки.";
Kn[195]="Фашисты войну начали, а мы кончим.";
Kn[196]="Славу свою добывай в бою.";
Kn[197]="Почет и славу собирают по капле.";
Kn[198]="Народ того уважает, кто фашистов уничтожает.";
Kn[199]="На то мы и внуки Суворова, чтобы сражаться здорово.";
Kn[200]="Как учил Александр Суворов — будь к врагу суровым.";
Kn[201]="На краю света фашистов найдем и на суд приведем.";
Kn[202]="Зря фашист блиндажи строит: все равно снаряд накроет.";
Kn[203]="Смерть фашистской своре — на берегу и в море!";
Kn[204]="Солдата мать родит, отец растит, а бой учит.";
Kn[205]="Дерево в огне сгорает, а солдат от огня крепче бывает.";
Kn[206]="Кто первый бой начинает, тот скорее побеждает.";
Kn[207]="Пришла пора гнать фашистов со двора.";
Kn[208]="Фашист наступает — кричит «гут», а отступает — «Гитлер капут».";
Kn[209]="Красна девушка косами, солдат — орденами.";
Kn[210]="Ученый водит, а неуч сзади ходит.";
Kn[211]="Птицу обманывают кормом, а человека — словом.";
Kn[212]="Слово, сказанное без соображения, подобно выстрелу без прицела.";
Kn[213]="Говорить впустую что стрелять вхолостую.";
Kn[214]="У осла длинные уши, а у болтуна длинный язык.";
Kn[215]="У короткого ума длинный язык.";
Kn[216]="Слово не воробей: выпустишь — не поймаешь.";
Kn[217]="Скажешь — не воротишь, напишешь — не сотрешь, отрубишь — не приставишь.";
Kn[218]="Лучше один раз увидеть, чем сто раз услышать.";
Kn[219]="Острый язык — дарование, длинный язык — наказание.";
Kn[220]="Не всегда говори то, что знаешь, но всегда знай, что говоришь.";
Kn[221]="Кто много болтает, тот врагу помогает.";
Kn[222]="Кто зевает — победителем не бывает.";
Kn[223]="Храбрость города берет, а бдительность их бережет.";
Kn[224]="Зря не болтай у телефона: болтун — находка для шпиона.";
Kn[225]="Нет друга — так ищи, а найдешь — береги.";
Kn[226]="Ищи себе друзей таких, чтобы не было стыда от них.";
Kn[227]="Не ходи, дружок, в неизвестный кружок: к таким людям зайдешь, что навек пропадешь.";
Kn[228]="Плохой друг подобен тени: только в светлые дни его и видишь.";
Kn[229]="Не та дружба сильна, что в словах заключена, а та, что в бою скреплена.";
Kn[230]="Для друзей — пироги, для врагов — кулаки.";
Kn[231]="В недруге пуля что во пне, а в друге что во мне.";
Kn[232]="Все за одного, один за всех — вот и обеспечен в бою успех.";
Kn[233]="Не имей сто рублей, а имей сто друзей.";
Kn[234]="В дружбе — правда.";
Kn[235]="Кто нашел друга — нашел сокровище.";
Kn[236]="Сам пропадай, а товарища выручай.";
Kn[237]="Один в поле не воин, а вдвоем с товарищем — взвод.";
Kn[238]="Где дружба и лад — там и клад.";
Kn[239]="Где дружба и совет — там и свет.";
Kn[240]="Трусливый друг опаснее врага, ибо врага опасаешься, а на друга опираешься.";
Kn[241]="Не тот друг, кто медом мажет, а тот, кто правду скажет.";
Kn[242]="Недруг поддакивает, а друг спорит.";
Kn[243]="Дружба крепка не лестью, а правдой и честью.";
Kn[244]="Новых друзей наживай, а старых не забывай.";
Kn[245]="Прямо страху в глаза смотри — и страх смигнет.";
Kn[246]="Волков бояться — в лес не ходить.";
Kn[247]="Трус умирает тысячу раз, а смелый всего один раз.";
Kn[248]="Советские воины из металла скроены.";
Kn[249]="Чем больше героев, тем скорее фашистов зароем.";
Kn[250]="Храбрость — сестра победы.";
Kn[251]="На смелого собака лает, а трусливого — рвет.";
Kn[252]="Не числом, а храбростью побеждают.";
Kn[253]="Лучше быть мертвым героем, чем живым трусом.";
Kn[254]="Смелого и пуля облетит, смелый и мину перехитрит.";
Kn[255]="Если не будешь овцой, то волк не съест.";
Kn[256]="Косил Гитлер глаз на Донбасс, а Донбасс опять у нас.";
Kn[257]="И про солдатскую честь пословица есть.";
Kn[258]="Потому и смешно, что фашистам горе пришло.";
Kn[259]="Гитлеровским сателлитам быть разбитым.";
Kn[260]="Знаем, за что бьем, потому и с победой придем.";
Kn[261]="Кто за правое дело стоит, тот всегда победит.";
Kn[262]="У правого сила удвоится, говорит пословица.";
Kn[263]="Будет праздник и на улице нашей, всякого праздника краше.";
Kn[264]="Войну закончим — и мир упрочим.";
Kn[265]="Как фашисты нам ни грозили, а мы их сразили.";
Kn[266]="Фашистов разгромили — добро сотворили.";
Kn[267]="Хотел Гитлер покорить весь мир, да лопнул как мыльный пузырь.";
Kn[268]="Задохнулась фашистская стая девятого мая.";
Kn[269]="Разбили фашистскую орду в сорок пятом году.";
Kn[270]="Прогнали фрицев — можно веселиться.";
Kn[271]="Советская Армия врага разгромила, она стоит на страже мира.";

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Подсчет чистого компьютерного времени, потраченного на обработку текста


 var Tf=new Date().getTime();    //  фиксация времени окончания работы скрипта

 var T2=Tf-Ts;                //  время работы скрипта  (в миллисекундах)
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



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Предварительная подготовка данных для вывода результатов


  //  Время обработки
if (tempus.length < 8)  tempus = tempus+"	";  else  tempus = tempus+"    ";

  //  Общее число строк
  var count_P = count_body_p+count_boNC_p+count_hist_p+count_anotFB_p+count_X_p+count_no_p;

//  Различия в количестве кавычек
  var count_A41_42 = count_A41-count_A42;
  var count_A43_44 = count_A43-count_A44;

//  Добавление разрядности в количество слов и символов
 count_Word=count_Word+"";
 if (count_Word.length > 4)  count_Word=count_Word.replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
 if (count_Word.length < 8)  count_Word += "	";  else  count_Word += "    ";

 count_littera=count_littera+"";
 if (count_littera.length > 4)  count_littera=count_littera.replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
 if (count_littera.length < 8)  count_littera += "	";  else  count_littera += "    ";

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



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Сборка массива с результатами обработки

 //  Функция добавления дополнительной табуляции
 function tab(sht, strok) {
         if (strok == 0)  return (""+sht+"	");
         if ((""+sht+strok).length < 6)  return (""+sht+"  /"+strok+"/	");
             else  return (""+sht+"  /"+strok+"/");
         }

 var mSt=[];       //  Массив со всеми строками статистики
 var ind=0;        //  Номер строки
 var mRzd=[];  //  Массив с числом строк во всех разделах
 var rz=0;          //  Номер раздела


                                                             mSt[ind]="• Время выполнения  .  .  .  .  .  .  .  .	"+tempus;  ind++;
                                                             mSt[ind]="					";  ind++;
                                                             mSt[ind]="Строк   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_P+"	";  ind++;
                                                             mSt[ind]="Слов .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_Word;  ind++;
                                                             mSt[ind]="Символов   .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_littera;  ind++;

 mRzd[rz]=ind;  //  Число строк в первом разделе

                                                             mSt[ind]="					";  ind++;
                                                             mSt[ind]="• РАЗДЕЛ аннотации к книге и история:	";  ind++;
                                                             mSt[ind]="Аннотация,     шт. /строк/  .  .  .  .  .	"+tab(count_anotFB,count_anotFB_p);  ind++;
                                                             mSt[ind]="Раздел <history>   .  .  .  .  .  .  .  .  .	"+tab(count_hist,count_hist_p);  ind++;
  for (k=0; k<=5; k++) {
          if (count_sect[0][k]!=0)
                  if (k < 5)                       { mSt[ind]="Секций "+k+"-го уровня   .  .  .  .  .  .  .  .	"+count_sect[0][k]+"	";  ind++ }
                      else                             { mSt[ind]="Секций "+5+"-го уровня и выше   .  .  .  .	"+count_sect[0][k]+"	";  ind++ }
          if (count_sect[0][k]!=0)  { mSt[ind]="      заголовков .  .	"+tab(count_titl[0][k], count_titl_p[0][k])+"		";  ind++ }
          if (count_epig[0][k]!=0) { mSt[ind]="      эпиграфов  .  .	"+tab(count_epig[0][k], count_epig_p[0][k])+"		";  ind++ }
          if (count_anot[0][k]!=0) { mSt[ind]="      аннотаций  .  .	"+tab(count_anot[0][k], count_anot_p[0][k])+"		";  ind++ }    }
  if (count_poem[0]!=0)            { mSt[ind]="Стихов .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+tab(count_poem[0], count_poem_p[0]);  ind++ }
  if (count_titlPoem[0]!=0)      { mSt[ind]="      заголовков .  .	"+tab(count_titlPoem[0], count_titlPoem_p[0])+"		";  ind++ }
  if (count_epigPoem[0]!=0)   { mSt[ind]="      эпиграфов  .  .	"+tab(count_epigPoem[0], count_epigPoem_p[0])+"		";  ind++ }
  if (count_stan[0]!=0)               { mSt[ind]="      строф   .  .  .  .	"+tab(count_stan[0], count_stan_p[0])+"		";  ind++ }
  if (count_tAutPoem[0]!=0)   { mSt[ind]="      text-author .  .	"+tab(count_tAutPoem[0], count_tAutPoem_p[0])+"		";  ind++ }
  if (count_cite[0]!=0)                { mSt[ind]="Цитат  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+tab(count_cite[0], count_cite_p[0]);  ind++ }
  if (count_subt[0]!=0)              { mSt[ind]="Подзаголовков   .  .  .  .  .  .  .  .  .  .	"+tab(count_subt[0], count_subt_p[0]);  ind++ }
  if (count_tAutCite[0]!=0)      { mSt[ind]="text-author в цитатах  .  .  .  .  .  .  .	"+tab(count_tAutCite[0], count_tAutCite_p[0]);  ind++ }
  if (count_tAutEpig[0]!=0)     { mSt[ind]="text-author в эпиграфах  .  .  .  .  .  .	"+tab(count_tAutEpig[0], count_tAutEpig_p[0]);  ind++ }
  if (count_tAut[0]!=0)              { mSt[ind]="Невалидный text-author  .  .  .  .  .  .	"+tab(count_tAut[0], count_tAut_p[0]);  ind++ }
  if (count_tabl[0]!=0)               { mSt[ind]="Таблиц .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+tab(count_tabl[0], count_tr[0]);  ind++ }
  if (count_tabl_p[0]!=0)           { mSt[ind]="      ячеек  .  .  .  .	"+count_tabl_p[0]+"			";  ind++ }
  if (count_xxx[0]!=0)                { mSt[ind]="Непонятных разделов .  .  .  .  .  .  .	"+tab(count_xxx[0], count_xxx_p[0]);  ind++ }
  if (count_txt[0]!=0)                 { mSt[ind]="Строк обычного теста .  .  .  .  .  .  .	"+count_txt[0]+"	";  ind++ }
  if (count_Sp[0]!=0)                  { mSt[ind]="Пустые строки .  .  .  .  .  .  .  .  .  .  .	"+count_Sp[0]+"	";  ind++ }
  if (count_titleSp[0]!=0)          { mSt[ind]="      в заголовках	"+count_titleSp[0]+"			";  ind++ }
  if (count_subtSp[0]!=0)         { mSt[ind]="      в п/заголовках "+count_subtSp[0]+"			";  ind++ }
  if (count_epigSp[0]!=0)         { mSt[ind]="      в эпиграфах	"+count_epigSp[0]+"			";  ind++ }
  if (count_poemSp[0]!=0)      { mSt[ind]="      в стихах  .  .  .	"+count_poemSp[0]+"			";  ind++ }

 if (mRzd[rz]==ind-2) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в последнем разделе
 rz++;  mRzd[rz]=ind;  //  Число строк в описанных разделах

                                                             mSt[ind]="					";  ind++;
                                                             mSt[ind]="• РАЗДЕЛЫ основных <body>:		";  ind++;
                                                             mSt[ind]="Разделов <body>   .  .  .  .  .  .  .  .  .	"+tab(count_body, count_body_p);  ind++;
  for (k=0; k<=5; k++) {
          if (count_sect[1][k]!=0)
                  if (k < 5)                       { mSt[ind]="Секций "+k+"-го уровня   .  .  .  .  .  .  .  .	"+count_sect[1][k]+"	";  ind++ }
                      else                            { mSt[ind]="Секций "+5+"-го уровня и выше   .  .  .  .	"+count_sect[1][k]+"	";  ind++ }
          if ((k == 0 && count_body != 0) || count_sect[1][k]!=0) {
                                                             mSt[ind]="      заголовков .  .	"+tab(count_titl[1][k], count_titl_p[1][k])+"		";  ind++ }
          if (count_epig[1][k]!=0) { mSt[ind]="      эпиграфов  .  .	"+tab(count_epig[1][k], count_epig_p[1][k])+"		";  ind++ }
          if (count_anot[1][k]!=0) { mSt[ind]="      аннотаций  .  .	"+tab(count_anot[1][k], count_anot_p[1][k])+"		";  ind++ }    }
  if (count_poem[1]!=0)            { mSt[ind]="Стихов .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+tab(count_poem[1], count_poem_p[1]);  ind++ }
  if (count_titlPoem[1]!=0)      { mSt[ind]="      заголовков .  .	"+tab(count_titlPoem[1], count_titlPoem_p[1])+"		";  ind++ }
  if (count_epigPoem[1]!=0)   { mSt[ind]="      эпиграфов  .  .	"+tab(count_epigPoem[1], count_epigPoem_p[1])+"		";  ind++ }
  if (count_stan[1]!=0)              { mSt[ind]="      строф   .  .  .  .	"+tab(count_stan[1], count_stan_p[1])+"		";  ind++ }
  if (count_tAutPoem[1]!=0)  { mSt[ind]="      text-author .  .	"+tab(count_tAutPoem[1], count_tAutPoem_p[1])+"		";  ind++ }
  if (count_cite[1]!=0)               { mSt[ind]="Цитат  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+tab(count_cite[1], count_cite_p[1]);  ind++ }
  if (count_subt[1]!=0)             { mSt[ind]="Подзаголовков   .  .  .  .  .  .  .  .  .  .	"+tab(count_subt[1], count_subt_p[1]);  ind++ }
  if (count_tAutCite[1]!=0)      { mSt[ind]="text-author в цитатах  .  .  .  .  .  .  .	"+tab(count_tAutCite[1], count_tAutCite_p[1]);  ind++ }
  if (count_tAutEpig[1]!=0)     { mSt[ind]="text-author в эпиграфах  .  .  .  .  .  .	"+tab(count_tAutEpig[1], count_tAutEpig_p[1]);  ind++ }
  if (count_tAut[1]!=0)              { mSt[ind]="Невалидный text-author  .  .  .  .  .  .	"+tab(count_tAut[1], count_tAut_p[1]);  ind++ }
  if (count_tabl[1]!=0)               { mSt[ind]="Таблиц .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+tab(count_tabl[1], count_tr[1]);  ind++ }
  if (count_tabl_p[1]!=0)           { mSt[ind]="      ячеек  .  .  .  .	"+count_tabl_p[1]+"			";  ind++ }
  if (count_xxx[1]!=0)                { mSt[ind]="Непонятных разделов .  .  .  .  .  .  .	"+tab(count_xxx[1], count_xxx_p[1]);  ind++ }
  if (count_txt[1]!=0)                 { mSt[ind]="Строк обычного теста .  .  .  .  .  .  .	"+count_txt[1]+"	";  ind++ }
  if (count_Sp[1]!=0)                  { mSt[ind]="Пустые строки .  .  .  .  .  .  .  .  .  .  .	"+count_Sp[1]+"	";  ind++ }
  if (count_titleSp[1]!=0)          { mSt[ind]="      в заголовках	"+count_titleSp[1]+"			";  ind++ }
  if (count_subtSp[1]!=0)         { mSt[ind]="      в п/заголовках "+count_subtSp[1]+"			";  ind++ }
  if (count_epigSp[1]!=0)         { mSt[ind]="      в эпиграфах	"+count_epigSp[1]+"			";  ind++ }
  if (count_poemSp[1]!=0)      { mSt[ind]="      в стихах  .  .  .	"+count_poemSp[1]+"			";  ind++ }

 if (mRzd[rz]==ind-2) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в последнем разделе
 rz++;  mRzd[rz]=ind;  //  Число строк в описанных разделах

                                                             mSt[ind]="					";  ind++;
                                                             mSt[ind]="• РАЗДЕЛЫ приммечаний и комментариев:	";  ind++;
  if (count_boNC!=0)                          { mSt[ind]="Разделов <body>  .  .  .  .  .  .  .  .  .	"+tab(count_boNC, count_boNC_p);  ind++ }
  for (k=0; k<=5; k++) {
          if (count_sect[2][k]!=0)
                  if (k < 5)                       { mSt[ind]="Секций "+k+"-го уровня   .  .  .  .  .  .  .  .	"+count_sect[2][k]+"	";  ind++ }
                      else                            { mSt[ind]="Секций "+5+"-го уровня и выше   .  .  .  .	"+count_sect[2][k]+"	";  ind++ }
          if ((k == 0 && count_boNC != 0) || count_sect[2][k]!=0) {
                                                             mSt[ind]="      заголовков .  .	"+tab(count_titl[2][k], count_titl_p[2][k])+"		";  ind++ }
          if (count_epig[2][k]!=0) { mSt[ind]="      эпиграфов  .  .	"+tab(count_epig[2][k], count_epig_p[2][k])+"		";  ind++ }
          if (count_anot[2][k]!=0) { mSt[ind]="      аннотаций  .  .	"+tab(count_anot[2][k], count_anot_p[2][k])+"		";  ind++ }    }
  if (count_poem[2]!=0)            { mSt[ind]="Стихов .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+tab(count_poem[2], count_poem_p[2]);  ind++ }
  if (count_titlPoem[2]!=0)      { mSt[ind]="      заголовков .  .	"+tab(count_titlPoem[2], count_titlPoem_p[2])+"		";  ind++ }
  if (count_epigPoem[2]!=0)   { mSt[ind]="      эпиграфов  .  .	"+tab(count_epigPoem[2], count_epigPoem_p[2])+"		";  ind++ }
  if (count_stan[2]!=0)              { mSt[ind]="      строф   .  .  .  .	"+tab(count_stan[2], count_stan_p[2])+"		";  ind++ }
  if (count_tAutPoem[2]!=0)  { mSt[ind]="      text-author .  .	"+tab(count_tAutPoem[2], count_tAutPoem_p[2])+"		";  ind++ }
  if (count_cite[2]!=0)                { mSt[ind]="Цитат  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+tab(count_cite[2], count_cite_p[2]);  ind++ }
  if (count_subt[2]!=0)              { mSt[ind]="Подзаголовков   .  .  .  .  .  .  .  .  .  .	"+tab(count_subt[2], count_subt_p[2]);  ind++ }
  if (count_tAutCite[2]!=0)      { mSt[ind]="text-author в цитатах  .  .  .  .  .  .  .	"+tab(count_tAutCite[2], count_tAutCite_p[2]);  ind++ }
  if (count_tAutEpig[2]!=0)     { mSt[ind]="text-author в эпиграфах  .  .  .  .  .  .	"+tab(count_tAutEpig[2], count_tAutEpig_p[2]);  ind++ }
  if (count_tAut[2]!=0)              { mSt[ind]="Невалидный text-author  .  .  .  .  .  .	"+tab(count_tAut[2], count_tAut_p[2]);  ind++ }
  if (count_tabl[2]!=0)               { mSt[ind]="Таблиц .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+tab(count_tabl[2], count_tr[2]);  ind++ }
  if (count_tabl_p[2]!=0)           { mSt[ind]="      ячеек  .  .  .  .	"+count_tabl_p[2]+"			";  ind++ }
  if (count_xxx[2]!=0)                { mSt[ind]="Непонятных разделов .  .  .  .  .  .  .	"+tab(count_xxx[2], count_xxx_p[2]);  ind++ }
  if (count_txt[2]!=0)                  { mSt[ind]="Строк обычного теста .  .  .  .  .  .  .	"+count_txt[2]+"	";  ind++ }
  if (count_Sp[2]!=0)                  { mSt[ind]="Пустые строки .  .  .  .  .  .  .  .  .  .  .	"+count_Sp[2]+"	";  ind++ }
  if (count_titleSp[2]!=0)          { mSt[ind]="      в заголовках	"+count_titleSp[2]+"			";  ind++ }
  if (count_subtSp[2]!=0)         { mSt[ind]="      в п/заголовках "+count_subtSp[2]+"			";  ind++ }
  if (count_epigSp[2]!=0)         { mSt[ind]="      в эпиграфах	"+count_epigSp[2]+"			";  ind++ }
  if (count_poemSp[2]!=0)      { mSt[ind]="      в стихах  .  .  .	"+count_poemSp[2]+"			";  ind++ }

 if (mRzd[rz]==ind-2) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в последнем разделе
 rz++;  mRzd[rz]=ind;  //  Число строк в описанных разделах

                                                             mSt[ind]="					";  ind++;
                                                             mSt[ind]="• НЕПОНЯТНЫЕ КОРНЕВЫЕ РАЗДЕЛЫ:		";  ind++;
  if (count_X!=0)                          { mSt[ind]="Количество этих разделов .  .  .  .  .	"+tab(count_X, count_X_p);  ind++ }
  for (k=0; k<=5; k++) {
          if (count_sect[3][k]!=0)
                  if (k < 5)                       { mSt[ind]="Секций "+k+"-го уровня   .  .  .  .  .  .  .  .	"+count_sect[3][k]+"	";  ind++ }
                      else                            { mSt[ind]="Секций "+5+"-го уровня и выше   .  .  .  .	"+count_sect[3][k]+"	";  ind++ }
          if (count_sect[3][k]!=0) { mSt[ind]="      заголовков .  .	"+tab(count_titl[3][k], count_titl_p[3][k])+"		";  ind++ }
          if (count_epig[3][k]!=0) { mSt[ind]="      эпиграфов  .  .	"+tab(count_epig[3][k], count_epig_p[3][k])+"		";  ind++ }
          if (count_anot[3][k]!=0) { mSt[ind]="      аннотаций  .  .	"+tab(count_anot[3][k], count_anot_p[3][k])+"		";  ind++ }    }
  if (count_poem[3]!=0)            { mSt[ind]="Стихов .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+tab(count_poem[3], count_poem_p[3]);  ind++ }
  if (count_titlPoem[3]!=0)      { mSt[ind]="      заголовков .  .	"+tab(count_titlPoem[3], count_titlPoem_p[3])+"		";  ind++ }
  if (count_epigPoem[3]!=0)   { mSt[ind]="      эпиграфов  .  .	"+tab(count_epigPoem[3], count_epigPoem_p[3])+"		";  ind++ }
  if (count_stan[3]!=0)              { mSt[ind]="      строф   .  .  .  .	"+tab(count_stan[3], count_stan_p[3])+"		";  ind++ }
  if (count_tAutPoem[3]!=0)  { mSt[ind]="      text-author .  .	"+tab(count_tAutPoem[3], count_tAutPoem_p[3])+"		";  ind++ }
  if (count_cite[3]!=0)                { mSt[ind]="Цитат  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+tab(count_cite[3], count_cite_p[3]);  ind++ }
  if (count_subt[3]!=0)              { mSt[ind]="Подзаголовков   .  .  .  .  .  .  .  .  .  .	"+tab(count_subt[3], count_subt_p[3]);  ind++ }
  if (count_tAutCite[3]!=0)      { mSt[ind]="text-author в цитатах  .  .  .  .  .  .  .	"+tab(count_tAutCite[3], count_tAutCite_p[3]);  ind++ }
  if (count_tAutEpig[3]!=0)     { mSt[ind]="text-author в эпиграфах  .  .  .  .  .  .	"+tab(count_tAutEpig[3], count_tAutEpig_p[3]);  ind++ }
  if (count_tAut[3]!=0)              { mSt[ind]="Невалидный text-author  .  .  .  .  .  .	"+tab(count_tAut[3], count_tAut_p[3]);  ind++ }
  if (count_tabl[3]!=0)               { mSt[ind]="Таблиц .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+tab(count_tabl[3], count_tr[3]);  ind++ }
  if (count_tabl_p[3]!=0)           { mSt[ind]="      ячеек  .  .  .  .	"+count_tabl_p[3]+"			";  ind++ }
  if (count_xxx[3]!=0)                { mSt[ind]="Непонятных разделов .  .  .  .  .  .  .	"+tab(count_xxx[3], count_xxx_p[3]);  ind++ }
  if (count_txt[3]!=0)                  { mSt[ind]="Строк обычного теста .  .  .  .  .  .  .	"+count_txt[3]+"	";  ind++ }
  if (count_no_p!=0)                   { mSt[ind]="Строк без корневого раздела  .  .  .	"+count_no_p+"	";  ind++ }
  if (count_Sp[3]!=0)                  { mSt[ind]="Пустые строки .  .  .  .  .  .  .  .  .  .  .	"+count_Sp[3]+"	";  ind++ }
  if (count_titleSp[3]!=0)          { mSt[ind]="      в заголовках	"+count_titleSp[3]+"			";  ind++ }
  if (count_subtSp[3]!=0)         { mSt[ind]="      в п/заголовках "+count_subtSp[3]+"			";  ind++ }
  if (count_epigSp[3]!=0)         { mSt[ind]="      в эпиграфах	"+count_epigSp[3]+"			";  ind++ }
  if (count_poemSp[3]!=0)      { mSt[ind]="      в стихах  .  .  .	"+count_poemSp[3]+"			";  ind++ }

 if (mRzd[rz]==ind-2) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в последнем разделе
 rz++;  mRzd[rz]=ind;  //  Число строк в описанных разделах

                                                             mSt[ind]="					";  ind++;
                                                             mSt[ind]="• ВЛОЖЕННЫЕ ФАЙЛЫ:			";  ind++;
  if (count_Bin!=0)                      { mSt[ind]="Всего файлов   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_Bin;  ind++ }
  if (count_BinUnused!=0)      { mSt[ind]="Неиспользуемые файлы  .  .  .  .  .  .  .  .  .  .  .	"+count_BinUnused;  ind++ }
  if (count_BinRepit!=0)           { mSt[ind]="Копии файлов  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_BinRepit;  ind++ }
  if (count_BinSizeAll!=0)
          if (count_Bin>1)               { mSt[ind]="Размер всех файлов  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_BinSizeAll;  ind++ }
              else  if (count_BinUnused!=0)
                                                          { mSt[ind]="Размер файла  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_BinSizeAll;  ind++ }
  if (count_BinSizeMedi!=0  &&  count_Bin>1)
                                                          { mSt[ind]="Средний размер файла   .  .  .  .  .  .  .  .  .  .  .	"+count_BinSizeMedi;  ind++ }
  if (count_BinSizeCovMax!=0)
          if (count_BinCov>1)       { mSt[ind]="Максимальный размер обложки  .  .  .  .  .  .  .	"+count_BinSizeCovMax;  ind++ }
              else                                    { mSt[ind]="Размер обложки  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_BinSizeCovMax;  ind++ }
  if (count_BinSizeImgMax!=0)
          if (count_BinImg>1)       { mSt[ind]="Максимальный размер иллюстрации .  .  .  .  .	"+count_BinSizeImgMax;  ind++ }
              else                                    { mSt[ind]="Размер иллюстрации    .  .  .  .  .  .  .  .  .  .  .  .	"+count_BinSizeImgMax;  ind++ }

 if (mRzd[rz]==ind-2) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в последнем разделе
 rz++;  mRzd[rz]=ind;  //  Число строк в описанных разделах

                                                             mSt[ind]="					";  ind++;
                                                             mSt[ind]="• ИЛЛЮСТРАЦИИ:				";  ind++;
  if (count_tiCover[0]!=0)        { mSt[ind]="Обложек   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_tiCover[0];  ind++ }
  if (count_tiCover[1]!=0)
          if (count_tiCover[1] == count_tiCover[0])  { ind--;  mSt[ind]="Обложек (jpg)  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_tiCover[1];  ind++ }
              else                                    { mSt[ind]="      jpg-формат   .  .  .  .  .  .	"+count_tiCover[1]+"		";  ind++ }
  if (count_tiCover[2]!=0)
          if (count_tiCover[2] == count_tiCover[0])  { ind--;  mSt[ind]="Обложек (png) .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_tiCover[2];  ind++ }
              else                                    { mSt[ind]="      png-формат  .  .  .  .  .  .	"+count_tiCover[2]+"		";  ind++ }
  if (count_tiCover[3]!=0)
          if (count_tiCover[3] == count_tiCover[0])  { ind--;  mSt[ind]="Обложек (невалидный формат)  .  .  .  .  .  .	"+count_tiCover[3];  ind++ }
              else                                    { mSt[ind]="      невалидный формат .  .	"+count_tiCover[3]+"		";  ind++ }

  if (count_stiCover[0]!=0)     { mSt[ind]="Обложек на языке оригинала  .  .  .  .  .  .  .  .	"+count_stiCover[0];  ind++ }
  if (count_stiCover[1]!=0)
          if (count_stiCover[1] == count_stiCover[0])  { ind--;  mSt[ind]="Обложек на языке оригинала (jpg)   .  .  .  .  .	"+count_stiCover[1];  ind++ }
              else                                    { mSt[ind]="      jpg-формат   .  .  .  .  .  .	"+count_stiCover[1]+"		";  ind++ }
  if (count_stiCover[2]!=0)
          if (count_stiCover[2] == count_stiCover[0])  { ind--;  mSt[ind]="Обложек на языке оригинала (png)  .  .  .  .  .	"+count_stiCover[2];  ind++ }
              else                                    { mSt[ind]="      png-формат  .  .  .  .  .  .	"+count_stiCover[2]+"		";  ind++ }
  if (count_stiCover[3]!=0)
          if (count_stiCover[3] == count_stiCover[0])  { ind--;  mSt[ind]="Обложек на языке ориг. (невалид. формат)	"+count_stiCover[3];  ind++ }
              else                                    { mSt[ind]="      невалидный формат .  .	"+count_stiCover[3]+"		";  ind++ }

  if (count_divImg[0]!=0)        { mSt[ind]="Обычная графика  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_divImg[0];  ind++ }
  if (count_divImg[1]!=0)
          if (count_divImg[1] == count_divImg[0])  { ind--;  mSt[ind]="Обычная графика (jpg)   .  .  .  .  .  .  .  .  .  .  .	"+count_divImg[1];  ind++ }
              else                                    { mSt[ind]="      jpg-формат   .  .  .  .  .  .	"+count_divImg[1]+"		";  ind++ }
  if (count_divImg[2]!=0)
          if (count_divImg[2] == count_divImg[0])  { ind--;  mSt[ind]="Обычная графика (png)  .  .  .  .  .  .  .  .  .  .  .	"+count_divImg[2];  ind++ }
              else                                    { mSt[ind]="      png-формат  .  .  .  .  .  .	"+count_divImg[2]+"		";  ind++ }
  if (count_divImg[3]!=0)
          if (count_divImg[3] == count_divImg[0])  { ind--;  mSt[ind]="Обычная графика (невалидный формат)   .  .	"+count_divImg[3];  ind++ }
              else                                    { mSt[ind]="      невалидный формат .  .	"+count_divImg[3]+"		";  ind++ }

  if (count_spanImg[0]!=0)     { mSt[ind]="Графика в строке  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_spanImg[0];  ind++ }
  if (count_spanImg[1]!=0)
          if (count_spanImg[1] == count_spanImg[0])  { ind--;  mSt[ind]="Графика в строке (jpg)   .  .  .  .  .  .  .  .  .  .  .	"+count_spanImg[1];  ind++ }
              else                                    { mSt[ind]="      jpg-формат   .  .  .  .  .  .	"+count_spanImg[1]+"		";  ind++ }
  if (count_spanImg[2]!=0)
          if (count_spanImg[2] == count_spanImg[0])  { ind--;  mSt[ind]="Графика в строке (png)  .  .  .  .  .  .  .  .  .  .  .	"+count_spanImg[2];  ind++ }
              else                                    { mSt[ind]="      png-формат  .  .  .  .  .  .	"+count_spanImg[2]+"		";  ind++ }
  if (count_spanImg[3]!=0)
          if (count_spanImg[3] == count_spanImg[0])  { ind--;  mSt[ind]="Графика в строке (невалидный формат) .  .  .	"+count_spanImg[3];  ind++ }
              else                                    { mSt[ind]="      невалидный формат .  .	"+count_spanImg[3]+"		";  ind++ }

  if (count_CovRepit!=0)          { mSt[ind]="Повторное использование обложки  .  .  .  .  .	"+count_CovRepit;  ind++ }
  if (count_ImgRepit!=0)          { mSt[ind]="Повторные иллюстрации   .  .  .  .  .  .  .  .  .  .	"+count_ImgRepit;  ind++ }
  if (count_zeroImg!=0)            { mSt[ind]="Пустые иллюстрации   .  .  .  .  .  .  .  .  .  .  .  .	"+count_zeroImg;  ind++ }
  if (count_titleImg!=0)             { mSt[ind]="Заголовки внутри иллюстраций .  .  .  .  .  .  .	"+count_titleImg;  ind++ }

 if (mRzd[rz]==ind-2) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в последнем разделе
 rz++;  mRzd[rz]=ind;  //  Число строк в описанных разделах

                                                             mSt[ind]="					";  ind++;
                                                             mSt[ind]="• ВНУТРЕННИЕ ТЕГИ:			";  ind++;
  if (count_Em!=0)                      { mSt[ind]="Курсив   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_Em;  ind++ }
  if (count_St!=0)                         { mSt[ind]="Жирность  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_St;  ind++ }
  if (count_EmSt!=0)                  { mSt[ind]="Жирный курсив  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_EmSt;  ind++ }
  if (count_A10!=0)                    { mSt[ind]="Верхний индекс  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_A10;  ind++ }
  if (count_A11!=0)                   { mSt[ind]="Нижний индекс   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_A11;  ind++ }
  if (count_A12!=0)                   { mSt[ind]="Зачеркивание  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_A12;  ind++ }
  if (count_A13!=0)                   { mSt[ind]="Код  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_A13;  ind++ }
  if (count_A14!=0)                   { mSt[ind]="Стиль  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_A14;  ind++ }
  if (count_Not!=0)                     { mSt[ind]="Сноски на примечания .  .  .  .  .  .  .  .  .  .  .  .	"+count_Not;  ind++ }
  if (count_Com!=0)                   { mSt[ind]="Сноски на комментарии  .  .  .  .  .  .  .  .  .  .  .	"+count_Com;  ind++ }
  if (count_A15!=0)                   { mSt[ind]="Гиперссылки    .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_A15;  ind++ }

 if (mRzd[rz]==ind-2) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в последнем разделе
 rz++;  mRzd[rz]=ind;  //  Число строк в описанных разделах

                                                             mSt[ind]="					";  ind++;
                                                             mSt[ind]="• ПРЕДПОЛАГАЕМЫЕ ОШИБКИ:		";  ind++;
  if (VersionH != VersionFile)  { mSt[ind]="• В конце истории не найдена версия файла	"+VersionFile;  ind++ }
  if (count_A41_42 > 0)             { mSt[ind]="• «Левых «угловых «кавычек «больше   .  .  .	+"+count_A41_42;  ind++ }
  if (count_A41_42 < 0)             { mSt[ind]="• Правых» угловых» кавычек» больше» .  .  .	+"+(-count_A41_42);  ind++ }
  if (count_A43_44 > 0)             { mSt[ind]="• „Левых „внутренних „кавычек „больше   .  .	+"+count_A43_44;  ind++ }
  if (count_A43_44 < 0)             { mSt[ind]="• Правых“ внутренних“ кавычек“ больше“ .  .	+"+(-count_A43_44);  ind++ }
  if (count_A45!=0)                     { mSt[ind]="• Простые кавычки  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_A45;  ind++ }
  if (count_A80!=0)                     { mSt[ind]="• Р а з р я д к а   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_A80;  ind++ }
  if (count_A81!=0)                     { mSt[ind]="• Латиница в кириллице .  .  .  .  .  .  .  .  .  .  .	"+count_A81;  ind++ }
  if (count_A97!=0)                     { mSt[ind]="• строчная буква в начале строки .  .  .  .  .  .	"+count_A97;  ind++ }
  if (count_A95!=0)                     { mSt[ind]="• Большие числа без разрядов .  .  .  .  .  .  .  .	"+count_A95;  ind++ }
  if (count_A83!=0)                     { mSt[ind]="• * Звездочка в начале строки   .  .  .  .  .  .  .	"+count_A83;  ind++ }
  if (count_A91!=0)                     { mSt[ind]="• [Текст в квадратных скобках] .  .  .  .  .  .  .	"+count_A91;  ind++ }
  if (count_A92!=0)                     { mSt[ind]="• {Текст в фигурных скобках} .  .  .  .  .  .  .  .	"+count_A92;  ind++ }
  if (count_A93!=0)                     { mSt[ind]="• [Число в квадратных скобках] .  .  .  .  .  .  .	"+count_A93;  ind++ }
  if (count_A94!=0)                     { mSt[ind]="• {Число в фигурных скобках} .  .  .  .  .  .  .  .	"+count_A94;  ind++ }
  if (count_A96!=0)                     { mSt[ind]="• Текст+число без пробела между ними  .  .  .	"+count_A96;  ind++ }

 if (mRzd[rz]==ind-2) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в последнем разделе
 rz++;  mRzd[rz]=ind;  //  Число строк в описанных разделах

         //  Сборка строк пословицы
                                                             mSt[ind]='					';  ind++;
                                                             mSt[ind]='                                   ◊  ◊  ◊';  ind++;
 var reF03 = new RegExp("(\\\s|"+nbspEntity+")","g");   // Удвоение пробелов для лучшей картинки
 var reF03_ = "  ";
 var reZit = new RegExp("^((  (?!—)|.){0,45})(\\\s\\\s|$)(.{0,})$","g");   // Разделение на строки. (Два пробела принимаются за один символ, исключение: "  —")
 var reZit_1 = "$1";
 var reZit_2 = "$4";
 var fragment = "";
 fragment="      "+Kn[zitata_N].replace(reF03, reF03_);  //  Добавление отступа, и удвоение пробелов в цитате
 while (fragment != "") {
         mSt[ind]=fragment.replace(reZit, reZit_1);      //  Разбивка пословицы на строки  (извлечение одной строки)
//         ind++; mSt[ind]=mSt[ind-1].match(/(  (?!—)|.)/g).length; // длина строки
         fragment=fragment.replace(reZit, reZit_2);  //   (сохранение остатка пословицы)
         ind++ }

 rz++;  mRzd[rz]=ind;  //  Число строк во всех разделах

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Определение высоты колонки в таблице с результатами обработки

 var max0=Vysota_kolonki;   //  Желаемая высота колонки
 var Kolo;   //  Высота колонки
 var Kolo_R;   //  Пробная высота колонки
//  Кроме того,  "ind" - теперь общее число строк статистики
//                               "rz" - номер последнего раздела статистики

//  Замена общего числа строк предыдущих разделов  на  число строк отдельных разделов
//  Т.е. в каждой ячейке массива будет размер соответствующего раздела (в строках)
 for (n=rz; n>0; n--)
         mRzd[n] -= mRzd[n-1];


               //  Определение высоты колонки

 //  •  Проверка допустимости применения одной колонки
 if (max0>=ind)  Kolo=ind;          //  Если вошли все строки - определяем высоту таблицы
     else {
             //  •  Проверка допустимости применения двух колонок
             Kolo=Math.floor(ind/2);
             k=-1;
             for (n=Kolo; n<=max0; n++) {     //  Постепенное увеличение высоты колонки
                     Kolo_R = 0;
                     for (k=0; k<=rz; k++)            //  Пробное заполнение 1-й колонки
                             if (Kolo_R+mRzd[k] <= n)  Kolo_R += mRzd[k];
                                 else break;
                     Kolo_R = -1;
                     for ( ; k<=rz; k++)            //  Пробное заполнение 2-й колонки
                             if (Kolo_R+mRzd[k] <= n)  Kolo_R += mRzd[k];
                                 else break;
                     if (k>rz)  break;          //  Если вошли все разделы - выходим из цикла
                     }
             if (k>rz)  Kolo = n;          //  Если вошли все разделы - определяем высоту таблицы
                 else {
                         //  •  Распределение разделов на три колонки
                         Kolo=Math.floor(ind/3);
                         for (n=Kolo; ; n++) {     //  Постепенное увеличение высоты колонки без ограничений
                                 Kolo_R = 0;
                                 for (k=0; k<=rz; k++)            //  Пробное заполнение 1-й колонки
                                         if (Kolo_R+mRzd[k] <= n)  Kolo_R += mRzd[k];
                                             else break;
                                 Kolo_R = -1;
                                 for ( ; k<=rz; k++)            //  Пробное заполнение 2-й колонки
                                         if (Kolo_R+mRzd[k] <= n)  Kolo_R += mRzd[k];
                                             else break;
                                 Kolo_R = -1;
                                 for ( ; k<=rz; k++)            //  Пробное заполнение 3-й колонки
                                         if (Kolo_R+mRzd[k] <= n)  Kolo_R += mRzd[k];
                                             else break;
                                 if (k>rz)  break;          //  Если вошли все разделы - выходим из цикла
                                 }
                         Kolo = n;          //  Определяем высоту таблицы
                         }
             }
// MsgBox (Kolo);

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Распределение строк статистики на 1-3 колонки


 var mSt1 = [];  //  1-я колонка таблицы
 var mSt2 = [];  //  2-я колонка таблицы
 var mSt3 = [];  //  3-я колонка таблицы
 var sto;   // Столбцы, количество

 //  Заполнение 2-й и 3-й колонки пустыми строками
 for (n=0; n<=Kolo; n++) {
         mSt2[n] = "";
         mSt3[n] = "";
         }

 //  Заполнение 1-й колонки
 var Kolo_1 = 0;
 for (n=0; n<=rz; n++)            //  Определение полезной высоты 1-й колонки
         if (Kolo_1+mRzd[n] <= Kolo)  Kolo_1 += mRzd[n];
             else break;
 for (k=0; k<Kolo; k++)            //  Заполнение 1-й колонки
         if (k<Kolo_1)  mSt1[k] = mSt[k]+"	";
             else  mSt1[k] = "						";
 sto=1;

 //  Заполнение 2-й колонки
 if (n<=rz) {
         var Kolo_2 = -1;
         for ( ; n<=rz; n++)            //  Определение полезной высоты 2-й колонки
                 if (Kolo_2+mRzd[n] <= Kolo)  Kolo_2 += mRzd[n];
                     else break;
         for (k=0; k<Kolo; k++)            //  Заполнение 2-й колонки
                 if (k<Kolo_2)  mSt2[k] = mSt[k+1+Kolo_1]+"	";
                     else  mSt2[k] = "						";
         sto=2;
         }

 //  Заполнение 3-й колонки
 if (n<=rz) {
         var Kolo_3 = -1;
         for ( ; n<=rz; n++)            //  Определение полезной высоты 3-й колонки
                 if (Kolo_3+mRzd[n] <= Kolo)  Kolo_3 += mRzd[n];
                     else break;
         for (k=0; k<Kolo; k++)            //  Заполнение 3-й колонки
                 if (k<Kolo_3)  mSt3[k] = mSt[k+2+Kolo_1+Kolo_2]+"	";
                     else  mSt3[k] = "						";
         sto=3;
         }

 //  Небольшие поправки в 1-2 строки - для удаления пустых строк в начале 2-3 колонок

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Сборка таблицы результатов


 var stT="";  //  Вывод результатов

 for (n=0; n<Kolo; n++)
         stT=stT+"\n"+mSt1[n]+mSt2[n]+mSt3[n];

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Вывод окна результатов на экран


 var otst;   // Отступ для центровки строк заголовка
 var otst2;   // Отступ для центровки строки даты/времени
 var otst3;   // Отступ для увеличения длины строки даты/времени
 if  (sto==1) { otst=""; otst2=""; otst3="" }
 if  (sto==2) { otst="                                                 "; otst2="                               "; otst3="‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ " }
 if  (sto==3)  { otst='                                                                                               ';  otst2='                                                                 '; otst3='‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ '; }

        //  Вывод окна результатов
 MsgBox (otst+"           .·.·.·.               –= ◊ =–              .·.·.·.\n"+
                       otst+"        ·.̉·.̉·.̉   «Общая статистика» v."+NumerusVersion+"   .̉·.̉·.̉·                         "+otst+"\n"+
                       otst+"            ̉   ̉   ̉                                                 ̉   ̉   ̉ "+stT+"\n\n"+
                    otst2+"‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ "+otst3+currentDate+" ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ "+otst3+currentTime+" ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ "+otst3);

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



}







