//======================================
//  «Удалить форматирование в заголовках и подзаголовках»
//  Скрипт тестировался в FBE v.2.7.8 (win XP, IE8 и win 7, IE11)
//======================================
//   Скрипт предназначен для удаления нежелательного форматирования внутри заголовков и подзаголовков
//======================================
//  * История изменений в конце скрипта
//======================================

function Run() {

 var ScriptName="«Удаление форматирования в заголовках и подзаголовках»";
 var NumerusVersion="2.4";
 var Ts=new Date().getTime();

//--------------------------------------------------------------------
                 ///  НАСТРОЙКИ
//--------------------------------------------------------------------

         //  Удаление форматирования

//     Удаление жирности во всех обычных заголовках
var Obrabotka_Title_St = 1;      // 0 ; 1 ; 2 //

//     Удаление курсива во всех обычных заголовках
var Obrabotka_Title_Em = 1;      // 0 ; 1 ; 2 //

//     Удаление нижнего индекса во всех обычных заголовках
var Obrabotka_Title_Sub = 1;      // 0 ; 1 ; 2 //

//     Удаление верхнего индекса во всех обычных заголовках
var Obrabotka_Title_Sup = 1;      // 0 ; 1 ; 2 //

//     Удаление зачеркивания во всех обычных заголовках
var Obrabotka_Title_Strike = 1;      // 0 ; 1 ; 2 //

//     Удаление кода во всех обычных заголовках
var Obrabotka_Title_Code = 1;      // 0 ; 1 ; 2 //

//     Удаление формата стиль во всех обычных заголовках
var Obrabotka_Title_Style = 1;      // 0 ; 1 ; 2 //


//     Удаление жирности во всех подзаголовках
var Obrabotka_Subtitle_St = 1;      // 0 ; 1 ; 2 //

//     Удаление курсива во всех подзаголовках
var Obrabotka_Subtitle_Em = 1;      // 0 ; 1 ; 2 //

//     Удаление нижнего индекса во всех подзаголовках
var Obrabotka_Subtitle_Sub = 1;      // 0 ; 1 ; 2 //

//     Удаление верхнего индекса во всех подзаголовках
var Obrabotka_Subtitle_Sup = 1;      // 0 ; 1 ; 2 //

//     Удаление зачеркивания во всех подзаголовках
var Obrabotka_Subtitle_Strike = 1;      // 0 ; 1 ; 2 //

//     Удаление кода во всех подзаголовках
var Obrabotka_Subtitle_Code = 1;      // 0 ; 1 ; 2 //

//     Удаление формата стиль во всех подзаголовках
var Obrabotka_Subtitle_Style = 1;      // 0 ; 1 ; 2 //

 // "0" — никогда не удалять
 // "1" — всегда удалять
 // "2" — всегда спрашивать и показывать

// ---------------------------------------------------------------

         //   •  Расположение найденной строки
 var Raspolozhenie = 82;      // проценты //       50% — середина окна с текстом книги;  больше/меньше 50% — выше/ниже середины.

// ---------------------------------------------------------------

         //  Автоматическое повышение версии файла и запись в историю изменений

 var Version_on_off = 0;      // 0 ; 1 //      ("0" — отключить, "1" — включить)

//  Добавлять, если не сделано ни одного исправления
 var Vsegda_on_off = 0;      // 0 ; 1 //      ("0" — отключить, "1" — включить)

//   Имя используемое в добавленной записи:
 var youName = "Зорро";

//  * Для записи имени можно использовать почти любые символы.
//     Исключения:   «"»  и  «\ »    Но и любой из этих знаков можно добавить, если поставить перед ним наклонную черту ("\"), например: "\\" = "\"
//     Или можно оставить кавычки пустыми (""), тогда строка в истории будет без имени.

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОБЩИЕ ПЕРЕМЕННЫЕ

//   Неразрывный пробел из настроек FBE
 try  {
         var nbspEntity=window.external.GetNBSP();   //  Получаем выбранный символ неразрывного пробела.
         if (nbspEntity.charCodeAt(0) == 160)   //  Если используется стандартный символ...
                 nbspEntity = "&nbsp;";   //  то заменяем его на стандартный код.
         }
 catch(e) {            //  Если команда для получения символа н/р пробела вызывает ошибку...
         var nbspEntity="&nbsp;";   //  то используем стандартный код н/р пробела.
         }

 var fbwBody=document.getElementById("fbw_body");   //  Структура текста в режиме "B"-дизайн.

 var T_pause=0;  //  Продолжительность диалоговых пауз.

 var k=0;
 var otvet=0;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///   Функция преобразования в код

 function inCode(text) {      //  Преобразование обычного текста в код.
         return  text.replace(/&/g, "&amp;").replace(/ /g, nbspEntity).replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/­/g, "&shy;");
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///  ФУНКЦИЯ ПОВЫШЕНИЯ ВЕРСИИ ФАЙЛА И ЗАПИСЬ В ИСТОРИЮ ИЗМЕНЕНИЙ

 function HistoryChange(Script_Name, youName) {


         // Получение раздела истории

// var fbwBody=document.getElementById("fbw_body");   //  **  эта строка уже есть в скрипте  **
 var History=fbwBody.firstChild;   //  Предполагаемый раздел истории.

 //  Поиск раздела "историй"
 while (History != null  &&  History.className != "history")    //  Пока не найдем настоящий раздел истории, или окажется, что истории нет в тексте...
         History = History.nextSibling;         //  переходим на следующий раздел.

//  Добавление раздела истории
 if (History==null)  {                 //   Если нет истории...
         History = document.createElement("DIV");     //   Создание нового раздела
         var Annotation=fbwBody.firstChild;
         while (Annotation!=null  &&  Annotation.className!="annotation") Annotation=Annotation.nextSibling;   //  Поиск аннотации к книге
         if (Annotation!=null)  Annotation.insertAdjacentElement("afterEnd",History);      //  Размещаем новый раздел    или после аннотации (если она есть)...
                 else  fbwBody.insertAdjacentElement("afterBegin",History);                //  ...или в начале "fbwBody"
         History.className = "history";      //  Присваиваем новому разделу    класс "история" и необходимые атрибуты
         History.setAttribute("xmlns:l", xlNS);    //  "xlNS" и "fbNS" - переменные из "main.js"
         History.setAttribute("xmlns:f", fbNS);
         History.insertAdjacentElement("beforeEnd",document.createElement("P"));     //  Добавляем пустую строку
         window.external.inflateBlock(History.lastChild)=true;
         }


         //  Создание массива с прошедшими датами

 var mDate=[];         //  Массив с прошедшими датами.
 var D = new Date().getTime();   //  Начальное значение даты.
 var fullDate;
 var Day;
 var Month;
 var Year;

 for (var j=0; j<10; j++) {              //  Запускаем цикл для получения недавних дат, в котором...
         fullDate = new Date(D);                         //  получаем полную дату,
         Day = fullDate.getDate();                            //  день месяца,
         Month = ("0" + (1+fullDate.getMonth())).replace(/^.*?(\d\d)$/g, "$1");   //  месяц,
         Year = fullDate.getFullYear();       //  год,
         mDate[j] = Day + "." + Month + "." + Year;             //  и заполняем массив текстом очередной даты (Д.ММ.ГГ).
         D -= 86400000;                       //  При этом каждый раз уменьшаем проверяемую дату на один день.
         }


         //  Поиск недавней записи в "истории"

 var povtorD = false;   //  Индикатор повторной обработки в последние 10 дней.
 var mP = History.getElementsByTagName("P");   //  Получение всех строк в "Истории".
 var s="";               //  Содержимое строки.
 var k=0;               //  Счетчик цикла.

fff:
 for (j=mP.length-1;  j>=0;  j--) {    //  Последовательный просмотр строк истории.
         s = mP[j].innerHTML;                //  Содержимое строки.
         for (k=0; k<10; k++) {                //  и запускаем цикл для проверки даты.
                 if (s.search(mDate[k]) !=-1) {   //  Если проверяемая дата есть в строке истории...
                         povtorD = true;                    //  то отмечаем это,
                         break fff;                            //  и прерываем оба цикла проверки.
                         }
                 }
         }


         //  Обновление записи в истории изменений

 try  { youName = fbeUserName }   //  Если есть строка:   var fbeUserName = "Имя";   в файле "main.js"  --  Изменение имени в соответствии с глобальной переменной.
 catch(e)  {}                                            //  Если глобальная переменная отсутствует - пропуск операции по изменению имени.

 var textYouName = inCode(youName+"");    //  Имя в тексте.
 if (youName!="")                           //  Если есть заполненное имя...
         textYouName += ", ";   //  то добавляем к текстовой записи запятую.

 Script_Name = inCode(Script_Name);    //  Имя скрипта текстом.

 var reHist00s = new RegExp("[^А-яЁёA-Za-z0-9]"+Script_Name+"[^А-яЁёA-Za-z0-9]","");   //  Стартовая.
 //  Добавление точки с запятой
 var reHist01 = new RegExp("(.[^…\\\?!\\\.,;:—])(\\\s|"+nbspEntity+")(— "+textYouName+mDate[k]+")","");
 var reHist01_ = "$1; $3";
 //  Добавление точки
 var reHist02 = new RegExp("(.[^…\\\?!\\\.,;:—])[,;:]{0,1}(\\\s|"+nbspEntity+")(— "+textYouName+mDate[k]+")","");
 var reHist02_ = "$1. $3";
 //  Добавление слова "Скрипт"
 var reHist03 = new RegExp("(.)(\\\s|"+nbspEntity+")(— "+textYouName+mDate[k]+")","");
 var reHist03_ = "$1 Скрипт: $3";
 //  Добавление имени скрипта
 var reHist04 = new RegExp("(.)(\\\s|"+nbspEntity+")(— "+textYouName+mDate[k]+")","");
 var reHist04_ = "$1 "+Script_Name+" $3";

 if (povtorD) {                                         //  Если найдена запись с недавней датой...
         if (s.search(reHist04) !=-1) {    //  и если в строке имя пользователя и дата записаны по форме: "— (Имя, Дата)"...
                 if (s.search(reHist00s) ==-1) {    //  то проверяем строку на наличие записи имени скрипта, и если этой записи нет...
                         if (s.search(/([Сс]крипт):/) !=-1)  s = s.replace(/([Сс]крипт):/g, "$1ы:");   //  то заменяем при необходимости слово "Скрипт" на "Скрипты",
                         if (s.search(reHist01) !=-1)  s = s.replace(reHist01, reHist01_);                   //  добавляем при необходимости точку с запятой,
                         if (s.search(/[Сс]крипты?:/) ==-1)  s = s.replace(reHist02, reHist02_).replace(reHist03, reHist03_);   //  добавляем при необходимости слово "Скрипт"
                         s = s.replace(reHist04, reHist04_);      //  и добавляем имя скрипта.
                         }
                 if (k != 0)                                                    //  Затем проверяем дату, и если она не сегодняшняя...
                         s = s.replace(mDate[k], mDate[0]);   //  то заменяем на сегодняшнюю.
                 if (mP[j].innerHTML != s) {                //  Затем проверяем изменилась ли строка истории, и если она изменилась...
                         mP[j].innerHTML = s;          //  то сохраняем её в тексте
                         HiCh=3;   //  и отмечаем это на индикаторе.
                         }
                 }
             else                                  // Если же есть недавняя дата, но запись сделана не по форме...
                 povtorD = false;   //  Объявляем, что недавняя дата - посторонняя, и надо повышать версию и добавлять новую строку в историю.
         }

 if (povtorD)  return;   //  Если производилась обработка записи в истории - выход из функции.


         //  Повышение версии

 var versionText = "";           //  Текст с версией в истории изменений.

 //  Проверка на валидность версии файла
 var ValidationVersion=(versionFile.length <=10  &&  versionFile.search(/^\d{0,10}(\.\d{1,8})?$/g) !=-1);    //  сравнение с шаблоном:  "цифры + (точка + цифры)"

 //   Изменение версии файла
 if (ValidationVersion) {
         if (versionFile =="")          //  Если версия не заполнена...
                 versionFile = "1.0";    //  то изменяем начальную версию на "1.0".
         if (versionFile.search(/^\d+$/g) !=-1)   //  Если версия без точки...
                 newVersion = versionFile + ".1";     //  то для новой версии добавляем ".1".
             else {                                                                                         //  Если в версии есть точка...
                     newVersion = +versionFile.replace(/^\d+\./g, "");  //  извлекаем цифры после точки,
                     newVersion++;                                                                                           //  увеличиваем полученное число на единицу
                     newVersion = versionFile.replace(/\.\d+$/g, "")+"."+newVersion;   //   и добавляем к нему первую группу цифр.
                     }
         if (newVersion.length <=10)                                        //  Если новая версия валидна...
                 document.getElementById("diVersion").value=newVersion;   //  то изменяем версию в файле,
                 VersionUp=true;                                                          //  отмечаем это на индикаторе
                 var versionText="v."+newVersion+" — ";    //  и создаем текст для истории.
         }


         //   Добавление строк в историю изменений

 var reHist11 = new RegExp("^(\\\s|"+nbspEntity+"){0,}$","");   //  Признак пустой строки.
 var reHist12 = new RegExp("(^|\\n)[^0-9]{0,12}"+versionFile.replace(/\./, "\\.")+"([^0-9]|$)","");   //  Поиск старой версии.

 //   Добавление строки с информацией о старой версии
 if (ValidationVersion  &&  History.innerText.search(reHist12)==-1) {       //  Если в истории нет записи о старой версии...
         if (History.lastChild.innerHTML.search(reHist11)==-1)                                               //  то проверяем наличие пустой строки в конце истории
                 History.insertAdjacentElement("beforeEnd",document.createElement("P"));       //  и если ее нет - добавляем новую.
         History.lastChild.innerHTML = "v."+versionFile+" — ?";  //  Затем добавляем в строку информацию о старой версии
         HiCh++;                                        //  и изменяем индикатор истории.
         }

 //   Добавление строки с информацией о новой версии
 if (History.lastChild.innerHTML.search(reHist11)==-1)                                   //  Если в конце истории нет готовой пустой строки...
         History.insertAdjacentElement("beforeEnd",document.createElement("P"));   //  то добавляем новую строку.
 History.lastChild.innerHTML = versionText+" Скрипт: "+Script_Name+" — "+textYouName+mDate[0];  //  Добавляем в строку информацию о новой версии.
 HiCh++;                       //  Изменяем индикатор истории.

 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ФУНКЦИЯ ПЕРЕХОДА (расширенная версия, но без перемещения курсора)

 function GoTo_0(elem) {
         var b=elem.getBoundingClientRect();                     //  Получение координат элемента.
         var c=fbwBody.parentNode.getBoundingClientRect();    //  Получение координат раздела <BODY>.
         var wH=wHeight - 6;         //  Высота окна с текстом книги (с запасом по 3 пикселя по краям).
         var wW=wWidth;         //  Ширина окна с текстом книги.
         var h=b.bottom-b.top;                  //  Высота элемента (в пикселях).
         var Width=c.left;         //  Сдвиг вбок.

         if (b.right-c.left > wW) {      //  Если правый край элемента может выйти за границу окна...
                 if (b.right-b.left < wW)     //  то проверяем длину элемента, и если она меньше длины окна,
                         Width = b.right-wW;   //  то выставляем элемент впритык к правому краю окна,
                     else  Width = b.left;      //  а если больше - то выставляем элемент впритык к левому краю.
                 }

         if (h <= wH)          //  Если высота элемента меньше высоты окна...
                 window.scrollBy(Width, b.top - 3 - (wH-h)*(1-Raspolozhenie*0.01))   //  то выставляем элемент согласно указанному расположению,
             else  window.scrollBy(Width, b.top - 3);       //  а если нет - то выставляем элемент почти впритык к верхнему краю.
         }

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


                 /// ФУНКЦИЯ КОНВЕРТАЦИИ ВРЕМЕНИ  (мс  => мин., с)

 var tempus=0;
 var T;

 function time(T) {

         var Tmin  = Math.floor(T/60000);
         var TsecD = (T%60000)/1000;
         var Tsec = Math.floor(TsecD);

         if (Tmin ==0)
                 tempus = (+(TsecD+"").replace(/(.{1,5}).*/g, "$1")+"").replace(".", ",")+" сек";
             else {
                     tempus = Tmin+" мин";
                     if (Tsec !=0)
                             tempus += " " + Tsec+ " с" }

         return tempus;

         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ПРОВЕРКА РЕЖИМА

 if (fbwBody.style.display == "none") {
         window.external.SetStatusBarText("  •  Скрипт "+ScriptName+" v." + NumerusVersion + " можно запустить только в режиме «B» (Дизайн)");
         return;
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ПОДСЧЕТ И СОХРАНЕНИЕ ПАРАГРАФОВ
                 //      (регулярные выражения)

       //  Счетчики строк заголовков и подзаголовков

 var count_Ttl_1 = 0;   //  Обычные заголовки
 var count_Ttl_2 = 0;   //  Заголовки комментариев и примечаний
 var count_sTtl  = 0;   //  Подзаголовки


       //  Рег. выражения для поиска жирности, курсива, нижнего и верхнего индекса, зачеркивания

 var reSt = new RegExp("^(.*)<STRONG>.*?</STRONG>","g");
 var reSt_ = "$1";

 var reEm = new RegExp("^(.*)<EM>.*?</EM>","g");
 var reEm_ = "$1";

 var reSub = new RegExp("^(.*)<SUB>.*?</SUB>","g");
 var reSub_ = "$1";

 var reSup = new RegExp("^(.*)<SUP>.*?</SUP>","g");
 var reSup_ = "$1";

 var reStrike = new RegExp("^(.*)<STRIKE>.*?</STRIKE>","g");
 var reStrike_ = "$1";

 var reEntity = new RegExp("^([^А-яA-Za-zЁёΑ-ω]|<[^>]+>)*$","g");       //  Допустимый текст, который может быть без выделения


       //  Подсчет и сохранение выделенных строк в заголовках

  //  С жирностью
 var m_01  = [];
 var count_001  = 0;

  //  С курсивом
 var m_02  = [];
 var count_002  = 0;

  //  С нижним индексом
 var m_03  = [];
 var count_003  = 0;

  //  С верхним индексом
 var m_04  = [];
 var count_004  = 0;

  //  С зачеркиванием
 var m_05  = [];
 var count_005  = 0;

  //  С кодом
 var m_06  = [];
 var count_006  = 0;

  //  Со стилем
 var m_07  = [];
 var count_007  = 0;


       //  Подсчет выделенных строк в подзаголовках

  //  С жирностью
 var m_11  = [];
 var count_011  = 0;

  //  С курсивом
 var m_12  = [];
 var count_012  = 0;

  //  С нижним индексом
 var m_13  = [];
 var count_013  = 0;

  //  С верхним индексом
 var m_14  = [];
 var count_014  = 0;

  //  С зачеркиванием
 var m_15  = [];
 var count_015  = 0;

  //  С кодом
 var m_16  = [];
 var count_016  = 0;

  //  Со стилем
 var m_17  = [];
 var count_017  = 0;


       //  Подсчет выделенных строк в заголовках комментариев и примечаний

 var m_21  = [];
 var count_021  = 0;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ПОДСЧЕТ И СОХРАНЕНИЕ ПАРАГРАФОВ

 var s="";    //  Содержание строки
 var s_="";   //  Дополнительная переменная
 var ptr_;   //  Копия параграфа
 var mSPAN;   //  Массив с тегами SPAN


         //  Функция "Vopros_1"  (обычные заголовки)

 function Vopros_1 (ptr)  {

         s=ptr.innerHTML;    //  Содержание строки

         count_Ttl_1++;       //  Подсчет всех строк в обычных заголовках

               //  Подсчет и сохранение строк с полужирным шрифтом
         if (Obrabotka_Title_St !=0  &&  s.search("<STRONG>") !=-1) {   //  Если разрешено удаление жирности, и в строке есть тег жирности...
                 s_=s;                                           //  то сохраняем содержание строки,
                 while (s_.search(reSt) !=-1)     //  удаляем там все фрагменты выделенные жирностью
                         s_= s_.replace(reSt, reSt_);
                 if (s_.search(reEntity) !=-1) {    //  и проверяем что осталось - если остаток не содержит букв...
                         m_01[count_001]  = ptr;   //  то сохраняем параграф в массиве
                         count_001++;                //  и увеличиваем счетчик.
                         }
                 }

               //  Подсчет и сохранение строк с курсивом
         if (Obrabotka_Title_Em !=0  &&  s.search("<EM>") !=-1) {
                 s_=s;
                 while (s_.search(reEm) !=-1)
                         s_= s_.replace(reEm, reEm_);
                 if (s_.search(reEntity) !=-1) {
                         m_02[count_002]  = ptr;
                         count_002++;
                         }
                 }

               //  Подсчет и сохранение строк с нижним индексом
         if (Obrabotka_Title_Sub !=0  &&  s.search("<SUB>") !=-1) {
                 s_=s;
                 while (s_.search(reSub) !=-1)
                         s_= s_.replace(reSub, reSub_);
                 if (s_.search(reEntity) !=-1) {
                         m_03[count_003]  = ptr;
                         count_003++;
                         }
                 }

               //  Подсчет и сохранение строк с верхним индексом
         if (Obrabotka_Title_Sup !=0  &&  s.search("<SUP>") !=-1) {
                 s_=s;
                 while (s_.search(reSup) !=-1)
                         s_= s_.replace(reSup, reSup_);
                 if (s_.search(reEntity) !=-1) {
                         m_04[count_004]  = ptr;
                         count_004++;
                         }
                 }

               //  Подсчет и сохранение строк с зачеркиванием
         if (Obrabotka_Title_Strike !=0  &&  s.search("<STRIKE>") !=-1) {
                 s_=s;
                 while (s_.search(reStrike) !=-1)
                         s_= s_.replace(reStrike, reStrike_);
                 if (s_.search(reEntity) !=-1) {
                         m_05[count_005]  = ptr;
                         count_005++;
                         }
                 }

               //  Подсчет и сохранение строк с кодом
         if (Obrabotka_Title_Code !=0  &&  s.search("<SPAN class=code>") !=-1) {   //  Если разрешено удаление кода, и в строке есть тег кода...
                 ptr_=ptr.cloneNode(true);                                           //  то сохраняем элемент параграфа,
                 mSPAN = ptr_.getElementsByTagName("SPAN");    //  находим внутри копии все элементы SPAN,
                 for ( k=mSPAN.length-1; k>=0; k--)            //  запускаем цикл для этих элементов,
                         if (mSPAN[k].className == "code")   //  в котором, если элемент оказывается кодом,
                                 mSPAN[k].removeNode(true);       //  то удаляем весь элемент.
                 if (ptr_.innerText.search(reEntity) !=-1) {    //  Проверяем что осталось - если остаток не содержит букв...
                         m_06[count_006]  = ptr;   //  то сохраняем параграф в массиве
                         count_006++;                //  и увеличиваем счетчик.
                         }
                 }

               //  Подсчет и сохранение строк со стилем
         if (Obrabotka_Title_Style !=0  &&  s.search(/<SPAN [^>]*class=(?!code>|image )/) !=-1) {
                 ptr_=ptr.cloneNode(true);
                 mSPAN = ptr_.getElementsByTagName("SPAN");
                 for ( k=mSPAN.length-1; k>=0; k--)
                         if (mSPAN[k].className != "code"  &&  mSPAN[k].className != "image")
                                 mSPAN[k].removeNode(true);
                 if (ptr_.innerText.search(reEntity) !=-1) {
                         m_07[count_007]  = ptr;
                         count_007++;
                         }
                 }
         }


         //  Функция "Vopros_2"  (подзаголовки)

 function Vopros_2 (ptr)  {

         s=ptr.innerHTML;

         count_sTtl++;       //  Подсчет всех строк подзаголовков

               //  Подсчет и сохранение строк с полужирным шрифтом
         if (Obrabotka_Subtitle_St !=0  &&  s.search("<STRONG>") !=-1) {
                 s_=s;
                 while (s_.search(reSt) !=-1)
                         s_= s_.replace(reSt, reSt_);
                 if (s_.search(reEntity) !=-1) {
                         m_11[count_011]  = ptr;
                         count_011++
                         }
                 }

               //  Подсчет и сохранение строк с курсивом
         if (Obrabotka_Subtitle_Em !=0  &&  s.search("<EM>") !=-1) {
                 s_=s;
                 while (s_.search(reEm) !=-1)
                         s_= s_.replace(reEm, reEm_);
                 if (s_.search(reEntity) !=-1) {
                         m_12[count_012]  = ptr;
                         count_012++;
                         }
                 }

               //  Подсчет и сохранение строк с нижним индексом
         if (Obrabotka_Subtitle_Sub !=0  &&  s.search("<SUB>") !=-1) {
                 s_=s;
                 while (s_.search(reSub) !=-1)
                         s_= s_.replace(reSub, reSub_);
                 if (s_.search(reEntity) !=-1) {
                         m_13[count_013]  = ptr;
                         count_013++;
                         }
                 }

               //  Подсчет и сохранение строк с верхним индексом
         if (Obrabotka_Subtitle_Sup !=0  &&  s.search("<SUP>") !=-1) {
                 s_=s;
                 while (s_.search(reSup) !=-1)
                         s_= s_.replace(reSup, reSup_);
                 if (s_.search(reEntity) !=-1) {
                         m_14[count_014]  = ptr;
                         count_014++;
                         }
                 }

               //  Подсчет и сохранение строк с зачеркиванием
         if (Obrabotka_Subtitle_Strike !=0  &&  s.search("<STRIKE>") !=-1) {
                 s_=s;
                 while (s_.search(reStrike) !=-1)
                         s_= s_.replace(reStrike, reStrike_);
                 if (s_.search(reEntity) !=-1) {
                         m_15[count_015]  = ptr;
                         count_015++;
                         }
                 }

               //  Подсчет и сохранение строк с кодом
         if (Obrabotka_Subtitle_Code !=0  &&  s.search("<SPAN class=code>") !=-1) {
                 ptr_=ptr.cloneNode(true);
                 mSPAN = ptr_.getElementsByTagName("SPAN");
                 for ( k=mSPAN.length-1; k>=0; k--)
                         if (mSPAN[k].className == "code")
                                 mSPAN[k].removeNode(true);
                 if (ptr_.innerText.search(reEntity) !=-1) {
                         m_16[count_016]  = ptr;
                         count_016++;
                         }
                 }

               //  Подсчет и сохранение строк со стилем
         if (Obrabotka_Subtitle_Style !=0  &&  s.search(/<SPAN [^>]*class=(?!code>|image )/) !=-1) {
                 ptr_=ptr.cloneNode(true);
                 mSPAN = ptr_.getElementsByTagName("SPAN");
                 for ( k=mSPAN.length-1; k>=0; k--)
                         if (mSPAN[k].className != "code"  &&  mSPAN[k].className != "image")
                                 mSPAN[k].removeNode(true);
                 if (ptr_.innerText.search(reEntity) !=-1) {
                         m_17[count_017]  = ptr;
                         count_017++;
                         }
                 }
         }


         //  Функция "Vopros_3"  (заголовки в комментариях и примечаниях)

 function Vopros_3 (ptr)  {

         s=ptr.innerHTML;

         count_Ttl_2++;       //  Подсчет строк заголовков в комментариях и примечаниях

               //  Подсчет и сохранение строк заголовков с тегами
         if (s.search(/<(STRONG|EM|SUB|SUP|STRIKE|SPAN class=code)>/) !=-1  ||  s.search(/<SPAN [^>]*class=(?!code>|image )/) !=-1) {   //  Если в строке есть теги...
                 m_21[count_021]  = ptr;   //  то сохраняем параграф в массиве
                 count_021++;                //  и увеличиваем счетчик.
                 }
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ПОДСЧЕТ И СОХРАНЕНИЕ ПАРАГРАФОВ
                 //      (применение функций "Vopros_X")

 var div;    //  Раздел DIV
 var mP;   //  Массив с параграфами
 var mPL;   //  Длина этого массива
 var j;      //  Счетчики циклов
 var jj;
 var ptr;   //  Один из параграфов

 var mChild = fbwBody.children;     //  Получение всех первых разделов "fbw_body"

 for (j=0;  j<mChild.length;  j++) {            //  Последовательный просмотр всех первых разделов "fbw_body"
         div = mChild[j];
         if (div.className =="body"  &&  div.getAttribute("fbname")  &&  (div.getAttribute("fbname") =="notes"  ||  div.getAttribute("fbname") =="comments"))  {
                 //  Если встретилось "body" примечаний или комментариев...
                 mP = div.getElementsByTagName("P");          //  Получение всех строк в найденном разделе
                 mPL = mP.length;                                       //  Получение количества строк
                 for (jj=0;  jj<mPL;  jj++) {                      //  Последовательный просмотр строк
                         ptr=mP[jj];
                         if (ptr.parentNode.className=="title")  Vopros_3 (ptr);     //  Для строки в заголовке применяется функция "Vopros_3"
                             else  if (ptr.className=="subtitle")  Vopros_2 (ptr);     //  Для строки в подзаголовке применяется функция "Vopros_2"
                         }
                 }
             else  {       //  Если это не "body" примечаний или комментариев...
                     mP = div.getElementsByTagName("P");          //  Получение всех строк в найденном разделе
                     mPL = mP.length;                                       //  Получение количества строк
                     for (jj=0;  jj<mPL;  jj++) {                      //  Последовательный просмотр строк
                             ptr=mP[jj];
                             if (ptr.parentNode.className=="title")  Vopros_1 (ptr);     //  Для строки в заголовке применяется функция "Vopros_1"
                                 else  if (ptr.className=="subtitle")  Vopros_2 (ptr);     //  Для строки в подзаголовке применяется функция "Vopros_2"
                             }
                     }
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// Функция просмотра найденных строк

 function specto(msgTtl, mP, count) {     //  (заголовок окна, массив с параграфами, длина этого массива)

 var msgWnd="";   //  Строки в окне
 var StyleEl;        //  Раздел стилей
 k=0;                //  Счетчик цикла
 otvet=0;      //  Значение кнопки ответа

 while ("зацикливание") {                     //  Окно ввода будет запускаться, пока не будет нажата кнопка "Отмена"

         switch (count) {    //  В зависимости от значения длины массива с параграфами, выбираем...
                 case 1:
                         msgWnd= " • Отмена —  	Выход из режима просмотра";
                         break;
                 case 2:
                         if (k == 0)  msgWnd= " • Да/Нет —	Последняя строка\n • Отмена —	Выход из режима просмотра";
                         if (k == 1)  msgWnd= " • Да/Нет —	Первая строка\n • Отмена —	Выход из режима просмотра";
                         break;
                 default:
                         switch (k) {
                                 case 0:  msgWnd= " • Да —	Следующая строка\n • Нет —	Перейти на последнюю строку";  break;
                                 case count-1:  msgWnd= " • Да —	Вернуться к первой строке\n • Нет —	Предыдущая строка";  break;
                                 default:  msgWnd= " • Да —	Следующая строка\n • Нет —	Предыдущая строка";
                                 }
                 }

         mP[k].innerHTML  = '<SPAN style="border-bottom: 2px solid #A00000; padding: 0 0.2em 1px 0.2em;">'+mP[k].innerHTML+'</SPAN>';    //   Добавляем раздел стилей в текст.
         StyleEl = mP[k].firstChild;            //  Сохраняем раздел стилей.

         GoTo_0(mP[k]);              //  Переход на элемент с выбранным номером

         T_pause -= new Date().getTime();
         window.external.InputBox(msgWnd, "• " + (k+1) + " / " + count + " " + msgTtl, "");        // Спрашиваем
         T_pause += new Date().getTime();    //  и отмечаем время, в течении которого отображалось окно.

         StyleEl.removeNode(false);                            //  Удаляем раздел стилей.

         otvet = window.external.GetModalResult();            //   Получение кнопки ответа
         if (otvet ==6)                        //   Если нажата кнопка "Да"...
                 if (k<count-1) k++;        //   то увеличиваем номер элемента в массиве,
                     else k=0;                        //   а если нельзя увеличить, то выбираем самый первый номер.
         if (otvet ==7)                      //   Если нажата кнопка "Нет"...
                 if (k>0) k--;                       //   то уменьшаем номер элемента в массиве,
                     else k=count-1;           //   а если нельзя уменьшить, то выбираем самый последний номер.
         if (otvet ==2)  break;       //   Если нажата кнопка "Отмена" -- выход из цикла.
         }
 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///  Демонстрационный режим "Показать все строки"

 var VseStroki_on_off = 0;      // 0 ; 1 //      ("0" — отключить, "1" — включить)
 var d=0;
 if (VseStroki_on_off == 1)  d="показать нули";

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///  Начальная статистика

 var fbwBodyMargin=false;   //  Индикатор добавления полей
 var wHeight = 1080;     //  Высота окна FBE с текстом книги (пробное значение)
 var wWidth = 1920;     //  Ширина окна FBE с текстом книги (пробное значение)

 if (Obrabotka_Title_St ==2  &&  count_001 !=0
 ||  Obrabotka_Title_Em ==2  &&  count_002 !=0
 ||  Obrabotka_Title_Sub ==2  &&  count_003 !=0
 ||  Obrabotka_Title_Sup ==2  &&  count_004 !=0
 ||  Obrabotka_Title_Strike ==2  &&  count_005 !=0
 ||  Obrabotka_Title_Code ==2  &&  count_006 !=0
 ||  Obrabotka_Title_Style ==2  &&  count_007 !=0
 ||  Obrabotka_Subtitle_St ==2  &&  count_011 !=0
 ||  Obrabotka_Subtitle_Em ==2  &&  count_012 !=0
 ||  Obrabotka_Subtitle_Sub ==2  &&  count_013 !=0
 ||  Obrabotka_Subtitle_Sup ==2  &&  count_014 !=0
 ||  Obrabotka_Subtitle_Strike ==2  &&  count_015 !=0
 ||  Obrabotka_Subtitle_Code ==2  &&  count_016 !=0
 ||  Obrabotka_Subtitle_Style ==2  &&  count_017 !=0) {   //  Если будет просмотр строк...

         var mSt=[];
         var ind=0;
         var firstStat = "";

         mSt[ind++]="  Статистика выделенных строк";
         mSt[ind++]="------------------------------------------------------";

         var cTaT=ind;  //  Текущее число строк

         mSt[ind++]="";
         mSt[ind++]="• В заголовках";
         if (count_001!=d) {
                 mSt[ind++]="      Жирность   .  .  .  .  .  .	"+count_001;
                 if (Obrabotka_Title_St ==2)
                         mSt[ind-1]+= "*";
                 }
         if (count_002!=d) {
                 mSt[ind++]="      Курсив  .  .  .  .  .  .  .  .	"+count_002;
                 if (Obrabotka_Title_Em ==2)
                         mSt[ind-1]+= "*";
                 }
         if (count_003!=d) {
                 mSt[ind++]="      Нижний индекс .  .  .  .	"+count_003;
                 if (Obrabotka_Title_Sub ==2)
                         mSt[ind-1]+= "*";
                 }
         if (count_004!=d) {
                 mSt[ind++]="      Верхний индекс   .  .  .	"+count_004;
                 if (Obrabotka_Title_Sup ==2)
                         mSt[ind-1]+= "*";
                 }
         if (count_005!=d) {
                 mSt[ind++]="      Зачеркивание   .  .  .  .	"+count_005;
                 if (Obrabotka_Title_Strike ==2)
                         mSt[ind-1]+= "*";
                 }
         if (count_006!=d) {
                 mSt[ind++]="      Код   .  .  .  .  .  .  .  .  .	"+count_006;
                 if (Obrabotka_Title_Code ==2)
                         mSt[ind-1]+= "*";
                 }
         if (count_007!=d) {
                 mSt[ind++]="      Стиль   .  .  .  .  .  .  .  .	"+count_007;
                 if (Obrabotka_Title_Style ==2)
                         mSt[ind-1]+= "*";
                 }

         if (cTaT==ind-2)  ind=ind-2;   //  Если нет пунктов с исправлениями - удаление двух последних строк.
         cTaT=ind;  //  Текущее число строк

         mSt[ind++]="";
         mSt[ind++]="• В подзаголовках";
         if (count_011!=d) {
                 mSt[ind++]="      Жирность   .  .  .  .  .  .	"+count_011;
                 if (Obrabotka_Subtitle_St ==2)
                         mSt[ind-1]+= "*";
                 }
         if (count_012!=d) {
                 mSt[ind++]="      Курсив  .  .  .  .  .  .  .  .	"+count_012;
                 if (Obrabotka_Subtitle_Em ==2)
                         mSt[ind-1]+= "*";
                 }
         if (count_013!=d) {
                 mSt[ind++]="      Нижний индекс .  .  .  .	"+count_013;
                 if (Obrabotka_Subtitle_Sub ==2)
                         mSt[ind-1]+= "*";
                 }
         if (count_014!=d) {
                 mSt[ind++]="      Верхний индекс   .  .  .	"+count_014;
                 if (Obrabotka_Subtitle_Sup ==2)
                         mSt[ind-1]+= "*";
                 }
         if (count_015!=d) {
                 mSt[ind++]="      Зачеркивание   .  .  .  .	"+count_015;
                 if (Obrabotka_Subtitle_Strike ==2)
                         mSt[ind-1]+= "*";
                 }
         if (count_016!=d) {
                 mSt[ind++]="      Код   .  .  .  .  .  .  .  .  .	"+count_016;
                 if (Obrabotka_Subtitle_Code ==2)
                         mSt[ind-1]+= "*";
                 }
         if (count_017!=d) {
                 mSt[ind++]="      Стиль   .  .  .  .  .  .  .  .	"+count_017;
                 if (Obrabotka_Subtitle_Style ==2)
                         mSt[ind-1]+= "*";
                 }

         if (cTaT==ind-2)  ind=ind-2;   //  Если нет пунктов с исправлениями - удаление двух последних строк.
         cTaT=ind;  //  Текущее число строк

         mSt[ind++]="";
         mSt[ind++]="• В заголовках  примечаний";
         if (count_021!=d)
                 mSt[ind++]="      Внутренние теги .  .  .	"+count_021;

         if (cTaT==ind-2)  ind=ind-2;   //  Если нет пунктов с исправлениями - удаление двух последних строк.

         mSt[ind++]="";
         mSt[ind++]="* контролируемая обработка";

         mSt[ind++]="					";
         mSt[ind++]="";
         mSt[ind++]="	◊  Продолжить? ";

         for  ( k=0; k!=ind; k++ )
                firstStat+=mSt[k]+"\n";   //  Добавление элемента из массива.

         T_pause -= new Date().getTime();
         otvet = AskYesNo(firstStat);                //  Задаем вопрос о продолжении работы скрипта
         T_pause += new Date().getTime();    //  и отмечаем время, в течении которого отображалось окно.

         if (!otvet)  return;    //  Если получен отказ - то выходим из скрипта.

         window.external.BeginUndoUnit(document, ScriptName + " v."+NumerusVersion);    // Начало записи в систему отмен.

         wHeight = window.external.GetViewHeight();     //  Получаем реальные значения высоты и ширины окна FBE с текстом книги.
         wWidth = window.external.GetViewWidth();
         fbwBody.style.paddingTop = wHeight + "px";           //  Добавляем внутренние поля для раздела с текстом книги
         fbwBody.style.paddingBottom = wHeight + "px";
         fbwBodyMargin=true;                        //  Включаем индикатор добавления полей.
         }

     else
         window.external.BeginUndoUnit(document, ScriptName + " v."+NumerusVersion);    // Начало записи в систему отмен.

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ПРОСМОТР И ИЗМЕНЕНИЕ ПАРАГРАФОВ

 var reSt_Del = new RegExp("</{0,1}STRONG>","g");       //  Удаление жирности
 var reEm_Del = new RegExp("</{0,1}EM>","g");       //  Удаление курсива
 var reSub_Del = new RegExp("</{0,1}SUB>","g");       //  Удаление нижнего индекса
 var reSup_Del = new RegExp("</{0,1}SUP>","g");       //  Удаление верхнего индекса
 var reStrike_Del = new RegExp("</{0,1}STRIKE>","g");       //  Удаление зачеркивания

 //  Счетчики замен
 var count_101 = 0;  var count_102 = 0;  var count_103 = 0;  var count_104 = 0;  var count_105 = 0;  var count_106 = 0;  var count_107 = 0;
 var count_111 = 0;  var count_112 = 0;  var count_113 = 0;  var count_114 = 0;  var count_115 = 0;  var count_116 = 0;  var count_117 = 0;
 var count_121 = 0;


         //  Заголовки

 if (count_001 !=0)  {      //  Если найдены жирные заголовки...
         otvet=false;              //  Предполагаем, что удалять формат не нужно.
         if (Obrabotka_Title_St ==2) {                               //  Если в настройках выбран просмотр найденных строк...
                 specto("• Жирность в заголовках • Просмотр •", m_01, count_001);    //  то запускаем функцию просмотра,
                 T_pause -= new Date().getTime();
                 otvet = AskYesNo ("◊  Удалить жирность во всех заголовках?                   ");         //  спрашиваем окончательное решение
                 T_pause += new Date().getTime();                                       //  и отмечаем время, в течении которого отображалось окно.
                 }
         if (otvet  ||  Obrabotka_Title_St ==1) {         //  Если выбрано удаление форматирования...
                 for ( k=0; k<count_001; k++)                       //  то запускаем цикл
                         m_01[k].innerHTML=m_01[k].innerHTML.replace(reSt_Del, "");    //  в котором удаляем во всех найденных строках, все теги жирности.
                 count_101 = count_001;                           //  Отмечаем количество измененных строк.
                 }
         }

 if (count_002 !=0)  {
         otvet=false;
         if (Obrabotka_Title_Em ==2) {
                 specto("• Курсив в заголовках • Просмотр •", m_02, count_002);
                 T_pause -= new Date().getTime();
                 otvet = AskYesNo ("◊  Удалить курсив во всех заголовках?                   ");
                 T_pause += new Date().getTime();
                 }
         if (otvet  ||  Obrabotka_Title_Em ==1) {
                 for ( k=0; k<count_002; k++)
                         m_02[k].innerHTML=m_02[k].innerHTML.replace(reEm_Del, "");
                 count_102 = count_002;
                 }
         }

 if (count_003 !=0)  {
         otvet=false;
         if (Obrabotka_Title_Sub ==2) {
                 specto("• Нижний индекс в заголовках • Просмотр •", m_03, count_003);
                 T_pause -= new Date().getTime();
                 otvet = AskYesNo ("◊  Удалить нижний индекс во всех заголовках?                   ");
                 T_pause += new Date().getTime();
                 }
         if (otvet  ||  Obrabotka_Title_Sub ==1) {
                 for ( k=0; k<count_003; k++)
                         m_03[k].innerHTML=m_03[k].innerHTML.replace(reSub_Del, "");
                 count_103 = count_003;
                 }
         }

 if (count_004 !=0)  {
         otvet=false;
         if (Obrabotka_Title_Sup ==2) {
                 specto("• Верхний индекс в заголовках • Просмотр •", m_04, count_004);
                 T_pause -= new Date().getTime();
                 otvet = AskYesNo ("◊  Удалить верхний индекс во всех заголовках?                   ");
                 T_pause += new Date().getTime();
                 }
         if (otvet  ||  Obrabotka_Title_Sup ==1) {
                 for ( k=0; k<count_004; k++)
                         m_04[k].innerHTML=m_04[k].innerHTML.replace(reSup_Del, "");
                 count_104 = count_004;
                 }
         }

 if (count_005 !=0)  {
         otvet=false;
         if (Obrabotka_Title_Strike ==2) {
                 specto("• Зачеркивание в заголовках • Просмотр •", m_05, count_005);
                 T_pause -= new Date().getTime();
                 otvet = AskYesNo ("◊  Удалить зачеркивание во всех заголовках?                   ");
                 T_pause += new Date().getTime();
                 }
         if (otvet  ||  Obrabotka_Title_Strike ==1) {
                 for ( k=0; k<count_005; k++)
                         m_05[k].innerHTML=m_05[k].innerHTML.replace(reStrike_Del, "");
                 count_105 = count_005;
                 }
         }

 if (count_006 !=0)  {      //  Если найдены заголовки с кодом...
         otvet=false;              //  Предполагаем, что удалять формат не нужно.
         if (Obrabotka_Title_Code ==2) {                               //  Если в настройках выбран просмотр найденных строк...
                 specto("• Код в заголовках • Просмотр •", m_06, count_006);    //  то запускаем функцию просмотра,
                 T_pause -= new Date().getTime();
                 otvet = AskYesNo ("◊  Удалить код во всех заголовках?                   ");         //  спрашиваем окончательное решение
                 T_pause += new Date().getTime();                                       //  и отмечаем время, в течении которого отображалось окно.
                 }
         if (otvet  ||  Obrabotka_Title_Code ==1) {         //  Если выбрано удаление форматирования...
                 for ( k=0; k<count_006; k++) {                       //  то запускаем цикл
                         mSPAN = m_06[k].getElementsByTagName("SPAN");    //  в котором находим все элементы SPAN,
                         for ( j=mSPAN.length-1; j>=0; j--)            //  запускаем цикл для этих элементов,
                                 if (mSPAN[j].className == "code")   //  в котором, если элемент оказывается кодом,
                                         mSPAN[j].removeNode(false);       //  то удаляем форматирование "код".
                         }
                 count_106 = count_006;                           //  Отмечаем количество измененных строк.
                 }
         }

 if (count_007 !=0)  {
         otvet=false;
         if (Obrabotka_Title_Style ==2) {
                 specto("• Стиль в заголовках • Просмотр •", m_07, count_007);
                 T_pause -= new Date().getTime();
                 otvet = AskYesNo ("◊  Удалить стиль во всех заголовках?                   ");
                 T_pause += new Date().getTime();
                 }
         if (otvet  ||  Obrabotka_Title_Style ==1) {
                 for ( k=0; k<count_007; k++) {
                         mSPAN = m_07[k].getElementsByTagName("SPAN");
                         for ( j=mSPAN.length-1; j>=0; j--)
                                 if (mSPAN[j].className != "code"  &&  mSPAN[j].className != "image")
                                         mSPAN[j].removeNode(false);
                         }
                 count_107 = count_007;
                 }
         }


         //  Подзаголовки

 if (count_011 !=0)  {
         otvet=false;
         if (Obrabotka_Subtitle_St ==2) {
                 specto("• Жирность в подзаголовках • Просмотр •", m_11, count_011);
                 T_pause -= new Date().getTime();
                 otvet = AskYesNo ("◊  Удалить жирность во всех подзаголовках?                   ");
                 T_pause += new Date().getTime();
                 }
         if (otvet  ||  Obrabotka_Subtitle_St ==1) {
                 for ( k=0; k<count_011; k++)
                         m_11[k].innerHTML=m_11[k].innerHTML.replace(reSt_Del, "");
                 count_111 = count_011;
                 }
         }

 if (count_012 !=0)  {
         otvet=false;
         if (Obrabotka_Subtitle_Em ==2) {
                 specto("• Курсив в подзаголовках • Просмотр •", m_12, count_012);
                 T_pause -= new Date().getTime();
                 otvet = AskYesNo ("◊  Удалить курсив во всех подзаголовках?                   ");
                 T_pause += new Date().getTime();
                 }
         if (otvet  ||  Obrabotka_Subtitle_Em ==1) {
                 for ( k=0; k<count_012; k++)
                         m_12[k].innerHTML=m_12[k].innerHTML.replace(reEm_Del, "");
                 count_112 = count_012;
                 }
         }

 if (count_013 !=0)  {
         otvet=false;
         if (Obrabotka_Subtitle_Sub ==2) {
                 specto("• Нижний индекс в подзаголовках • Просмотр •", m_13, count_013);
                 T_pause -= new Date().getTime();
                 otvet = AskYesNo ("◊  Удалить нижний индекс во всех подзаголовках?                   ");
                 T_pause += new Date().getTime();
                 }
         if (otvet  ||  Obrabotka_Subtitle_Sub ==1) {
                 for ( k=0; k<count_013; k++)
                         m_13[k].innerHTML=m_13[k].innerHTML.replace(reSub_Del, "");
                 count_113 = count_013;
                 }
         }

 if (count_014 !=0)  {
         otvet=false;
         if (Obrabotka_Subtitle_Sup ==2) {
                 specto("• Верхний индекс в подзаголовках • Просмотр •", m_14, count_014);
                 T_pause -= new Date().getTime();
                 otvet = AskYesNo ("◊  Удалить верхний индекс во всех подзаголовках?                   ");
                 T_pause += new Date().getTime();
                 }
         if (otvet  ||  Obrabotka_Subtitle_Sup ==1) {
                 for ( k=0; k<count_014; k++)
                         m_14[k].innerHTML=m_14[k].innerHTML.replace(reSup_Del, "");
                 count_114 = count_014;
                 }
         }

 if (count_015 !=0)  {
         otvet=false;
         if (Obrabotka_Subtitle_Strike ==2) {
                 specto("• Зачеркивание в подзаголовках • Просмотр •", m_15, count_015);
                 T_pause -= new Date().getTime();
                 otvet = AskYesNo ("◊  Удалить зачеркивание во всех подзаголовках?                   ");
                 T_pause += new Date().getTime();
                 }
         if (otvet  ||  Obrabotka_Subtitle_Strike ==1) {
                 for ( k=0; k<count_015; k++)
                         m_15[k].innerHTML=m_15[k].innerHTML.replace(reStrike_Del, "");
                 count_115 = count_015;
                 }
         }

 if (count_016 !=0)  {
         otvet=false;
         if (Obrabotka_Subtitle_Code ==2) {
                 specto("• Код в подзаголовках • Просмотр •", m_16, count_016);
                 T_pause -= new Date().getTime();
                 otvet = AskYesNo ("◊  Удалить код во всех подзаголовках?                   ");
                 T_pause += new Date().getTime();
                 }
         if (otvet  ||  Obrabotka_Subtitle_Code ==1) {
                 for ( k=0; k<count_016; k++) {
                         mSPAN = m_16[k].getElementsByTagName("SPAN");
                         for ( j=mSPAN.length-1; j>=0; j--)
                                 if (mSPAN[j].className == "code")
                                         mSPAN[j].removeNode(false);
                         }
                 count_116 = count_016;
                 }
         }

 if (count_017 !=0)  {
         otvet=false;
         if (Obrabotka_Subtitle_Style ==2) {
                 specto("• Стиль в подзаголовках • Просмотр •", m_17, count_017);
                 T_pause -= new Date().getTime();
                 otvet = AskYesNo ("◊  Удалить стиль во всех подзаголовках?                   ");
                 T_pause += new Date().getTime();
                 }
         if (otvet  ||  Obrabotka_Subtitle_Style ==1) {
                 for ( k=0; k<count_017; k++) {
                         mSPAN = m_17[k].getElementsByTagName("SPAN");
                         for ( j=mSPAN.length-1; j>=0; j--)
                                 if (mSPAN[j].className != "code"  &&  mSPAN[j].className != "image")
                                         mSPAN[j].removeNode(false);
                         }
                 count_117 = count_017;
                 }
         }


         //  Заголовки примечаний и комментариев

 var s__;      //  Вводим переменную для сохранения первоначального текста строки.

 for ( k=0; k<count_021; k++) {       //  Запускаем цикл для всех найденных строк с заголовков с форматированием.
         s__=m_21[k].innerHTML;    //  Сохраняем текст строки

         if (s.search("<SPAN class=code>") !=-1) {      //  Если в строке есть тег кода...
                 ptr_=m_21[k].cloneNode(true);                                      //  то сохраняем элемент параграфа,
                 mSPAN = ptr_.getElementsByTagName("SPAN");    //  находим внутри копии все элементы SPAN,
                 for ( j=mSPAN.length-1; j>=0; j--)            //  запускаем цикл для этих элементов,
                         if (mSPAN[j].className == "code")   //  в котором, если элемент оказывается кодом,
                                 mSPAN[j].removeNode(true);       //  то удаляем весь элемент.
                 if (ptr_.innerText.search(reEntity) !=-1) {    //  Проверяем что осталось - если остаток не содержит букв...
                         mSPAN = m_21[k].getElementsByTagName("SPAN");   //  находим внутри оригинального параграфа все элементы SPAN,
                         for ( j=mSPAN.length-1; j>=0; j--)                 //  запускаем цикл для этих элементов,
                                 if (mSPAN[j].className == "code")   //  в котором, если элемент оказывается кодом,
                                         mSPAN[j].removeNode(false);       //  то удаляем форматирование "код".
                         }
                 }
         if (s.search(/<SPAN [^>]*class=(?!code>|image )/) !=-1) {
                 ptr_=m_21[k].cloneNode(true);
                 mSPAN = ptr_.getElementsByTagName("SPAN");
                 for ( j=mSPAN.length-1; j>=0; j--)
                         if (mSPAN[j].className != "code"  &&  mSPAN[j].className != "image")
                                 mSPAN[j].removeNode(true);
                 if (ptr_.innerText.search(reEntity) !=-1) {
                         mSPAN = m_21[k].getElementsByTagName("SPAN");
                         for ( j=mSPAN.length-1; j>=0; j--)
                                 if (mSPAN[j].className != "code"  &&  mSPAN[j].className != "image")
                                         mSPAN[j].removeNode(false);
                         }
                 }

         s=m_21[k].innerHTML;    //  Сохраняем текст строки.
         s_=s;
         if (s_.search("<STRONG>") !=-1) {      //  Если в строке есть тег жирности...
                 while (s_.search(reSt) !=-1)
                         s_= s_.replace(reSt, reSt_);    //  то удаляем из копии строки все выделения жирностью
                 if (s_.search(reEntity) !=-1)        //  и проверяем что осталось - если в остатке нет букв...
                         s=s.replace(reSt_Del, "");      //  то удаляем из оригинальной строки теги жирности.
                 }
         s_=s;
         if (s_.search("<EM>") !=-1) {
                 while (s_.search(reEm) !=-1)
                         s_= s_.replace(reEm, reEm_);
                 if (s_.search(reEntity) !=-1)
                         s=s.replace(reEm_Del, "");
                 }
         s_=s;
         if (s_.search("<SUB>") !=-1) {
                 while (s_.search(reSub) !=-1)
                         s_= s_.replace(reSub, reSub_);
                 if (s_.search(reEntity) !=-1)
                         s=s.replace(reSub_Del, "");
                 }
         s_=s;
         if (s_.search("<SUP>") !=-1) {
                 while (s_.search(reSup) !=-1)
                         s_= s_.replace(reSup, reSup_);
                 if (s_.search(reEntity) !=-1)
                         s=s.replace(reSup_Del, "");
                 }
         s_=s;
         if (s_.search("<STRIKE>") !=-1) {
                 while (s_.search(reStrike) !=-1)
                         s_= s_.replace(reStrike, reStrike_);
                 if (s_.search(reEntity) !=-1)
                         s=s.replace(reStrike_Del, "");
                 }

         if (s__ != s)  {             //  Если после всех операций текст строки изменился...
                 m_21[k].innerHTML=s;    // то сохраняем строку в тексте книги
                 count_121 ++;               //  и увеличиваем счетчик изменений.
                 }
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///  Очистка полей в "fbw_body"

 if (fbwBodyMargin) {   //  Если поля в "fbw_body" добавлялись...
         var H_first_Elem = fbwBody.firstChild.getBoundingClientRect().top;   //  то определяем высоту первого элемента книги,
         fbwBody.style.removeAttribute("paddingTop");        //  удаляем поля
         fbwBody.style.removeAttribute("paddingBottom");
         window.scrollBy(0, fbwBody.firstChild.getBoundingClientRect().top - H_first_Elem);   //  и сдвигаем текст в исходное положение.
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 // Подсчет общего количества исправлений
 var count_all = count_101 + count_102 + count_103 + count_104 + count_105 + count_106 + count_107 + count_111 + count_112 + count_113 + count_114 + count_115 + count_116 + count_117 + count_121;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///  ПОВЫШЕНИЕ ВЕРСИИ ФАЙЛА И ЗАПИСЬ В ИСТОРИЮ ИЗМЕНЕНИЙ
                 //  (применение функции "HistoryChange")

 var versionFile=document.getElementById("diVersion").value; //  Извлечение значения версии файла.
 var newVersion = versionFile;                                                          //  Значение новой версии.

 var HiCh=0;                     //  Код изменения истории.
 var VersionUp=false;   //  Индикатор повышения версии.

//  Если включено автоматическое повышение версии, а также если есть измененные строки или разрешено повышение версии когда нет изменений...
 if (Version_on_off == 1  &&  (count_all  ||  Vsegda_on_off == 1))
         HistoryChange(ScriptName + " " + NumerusVersion, youName);   //  запускаем функцию для изменения данных истории.

// ---------------------------------------------------------------

 window.external.EndUndoUnit(document);    // Конец записи в систему отмен.

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


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Сборка массива с результатами обработки

 var Tf=new Date().getTime();
 var mSt=[];
 var ind=0;

                 mSt[ind++]=" «Удалить форматирование";
                 mSt[ind++]="           в заголовках и подзаголовках» v."+NumerusVersion;
                 mSt[ind++]="---------------------------------------------------------";
 if (d)      mSt[ind++]=" Демонстрационный режим";
                 mSt[ind++]="					     ";

                                         mSt[ind++]="Вычисления  .  .  .  .  .  .  .  .  .  .  .  .	"+time(Tf - Ts - T_pause);
 if (T_pause!=d)         mSt[ind++]="Диалоговые паузы .  .  .  .  .  .  .  .  .	"+time(T_pause);
 if (count_Ttl_1!=d) {
         if (count_Ttl_2==0 || d)  mSt[ind++]="Строк заголовков  .  .  .  .  .  .  .  .  .	"+count_Ttl_1;
         if (count_Ttl_2!=d)           mSt[ind++]="Строк обычных заголовков  .  .  .  .	"+count_Ttl_1;
         }
 if (count_Ttl_2!=d)                   mSt[ind++]="Строк заголовков примечаний	"+count_Ttl_2;
 if (count_sTtl!=d)                     mSt[ind++]="Строк подзаголовков  .  .  .  .  .  .  .	"+count_sTtl;

 if (count_all==0  ||  d) {
         mSt[ind++]="";
         mSt[ind++]=">> Исправлений нет";
         }

 var cTaT=ind;  //  Текущее число строк

                                         mSt[ind++]="";
                                         mSt[ind++]="• Удаления в заголовках";
 if (count_101!=d)    mSt[ind++]="      Жирность   .  .  .  .  .  .	"+count_101;
 if (count_102!=d)    mSt[ind++]="      Курсив  .  .  .  .  .  .  .  .	"+count_102;
 if (count_103!=d)    mSt[ind++]="      Нижний индекс .  .  .  .	"+count_103;
 if (count_104!=d)    mSt[ind++]="      Верхний индекс   .  .  .	"+count_104;
 if (count_105!=d)    mSt[ind++]="      Зачеркивание   .  .  .  .	"+count_105;
 if (count_106!=d)    mSt[ind++]="      Код   .  .  .  .  .  .  .  .  .	"+count_106;
 if (count_107!=d)    mSt[ind++]="      Стиль   .  .  .  .  .  .  .  .	"+count_107;

 if (cTaT==ind-2)  ind=ind-2;   //  Если нет пунктов с исправлениями - удаление двух последних строк.
 cTaT=ind;  //  Текущее число строк

                                         mSt[ind++]="";
                                         mSt[ind++]="• Удаления в подзаголовках";
 if (count_111!=d)    mSt[ind++]="      Жирность   .  .  .  .  .  .	"+count_111;
 if (count_112!=d)    mSt[ind++]="      Курсив  .  .  .  .  .  .  .  .	"+count_112;
 if (count_113!=d)    mSt[ind++]="      Нижний индекс .  .  .  .	"+count_113;
 if (count_114!=d)    mSt[ind++]="      Верхний индекс   .  .  .	"+count_114;
 if (count_115!=d)    mSt[ind++]="      Зачеркивание   .  .  .  .	"+count_115;
 if (count_116!=d)    mSt[ind++]="      Код   .  .  .  .  .  .  .  .  .	"+count_116;
 if (count_117!=d)    mSt[ind++]="      Стиль   .  .  .  .  .  .  .  .	"+count_117;

 if (cTaT==ind-2)  ind=ind-2;   //  Если нет пунктов с исправлениями - удаление двух последних строк.
 cTaT=ind;  //  Текущее число строк

                                         mSt[ind++]="";
                                         mSt[ind++]="• Удаления в заголовках примечаний";
 if (count_121!=d)    mSt[ind++]="      Внутренние теги .  .  .	"+count_121;

 if (cTaT==ind-2)  ind=ind-2;   //  Если нет пунктов с исправлениями - удаление двух последних строк.

//  История
 if (VersionUp ||  HiCh  ||  d)    mSt[ind++]="";
 if (VersionUp  ||  d)                    mSt[ind++]="• Версия файла:  "+versionFile+"  ›››  "+newVersion;
 if (HiCh==1  ||  d)                       mSt[ind++]="• Добавлена новая строка в историю";
 if (HiCh==2  ||  d)                       mSt[ind++]="• Добавлены две строки в историю";
 if (HiCh==3  ||  d)                       mSt[ind++]="• Изменены данные в строке истории";

 mSt[ind++]="";

//  Сборка строк текущей даты и времени
 mSt[ind++]= "• "+currentDate+" • "+currentTime+" •";

//  Сборка строк пословицы
 mSt[ind++]="";
 mSt[ind++]="---------------------------------------------------------";
 var reZit = new RegExp("([^ ].{0,43})(?=\\\s\\\s.{0,}|$)","g");   // Рег. выражение для разделения цитаты на строки.
 mSt=mSt.concat(Kn[Rn_(Kn.length)].replace(/ /g, "  ").match(reZit));   //  Добавление массива строк цитаты в основной массив.
 for (j=mSt.length-1; j>=ind; j--)  mSt[j]=" "+mSt[j];   //  Добавление отступа.
// for (j=mSt.length-1; j>=ind; j--)  { mSt.splice(j+1, 0, ""+mSt[j].length) }   //  Добавление длины строк цитаты (отключено).
 ind = mSt.length;    //  Определение индекса.

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Вывод окна результатов на экран

 var stText="";   //  Текст результатов.

 for  ( k=0; k!=ind; k++ )
        stText+=mSt[k]+"\n";   //  Добавление элемента из массива.

 MsgBox (stText);   //  Вывод окна результатов.

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------

}



                 ///  ИСТОРИЯ ИЗМЕНЕНИЙ

// v.1.0 — Создание скрипта — Александр Ка (21.03.2024)

// v.2.0 — Глобальная редакция — Александр Ка (30.01.2025)
// Изменено имя скрипта (было «Удаление жирности/курсива в заголовках и подзаголовках»)
// Добавлено удаление формата верхнего и нижнего индекса
// Исправлены все ошибки связанные с неправильным отображением текста в окнах для win7
// И т.д., и т.п.

// v.2.1 — Добавлена функция повышения версии файла и запись в историю изменений — Александр Ка (25.04.2025)

// v.2.2 — Изменение функции "повышения версии файла и запись в историю изменений" — Александр Ка (19.05.2025)

// v.2.3 — Александр Ка (19.07.2025)
// Добавлена начальная статистика
// Изменен способ поиска строк с выделением (теперь скрипт обрабатывает только строки, в которых выделены все буквы)
// Улучшена функция перехода к найденной строке
// Изменено выделение найденной строки

// v.2.4 — Александр Ка (22.07.2025)
// Добавлено удаление форматов зачеркивания, кода, стиля
// Изменено оформление окон статистики
// Добавлены пословицы



