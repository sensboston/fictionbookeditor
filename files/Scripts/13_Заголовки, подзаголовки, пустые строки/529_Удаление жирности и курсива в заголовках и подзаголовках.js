//======================================
//             «Удаление форматирования в заголовках и подзаголовках»
//  Скрипт тестировался в FBE v.2.7.7 (win XP, IE8 и win 7, IE11)
//======================================
//   Скрипт предназначен для удаления нежелательного форматирования внутри заголовков и подзаголовков
//======================================
//  * История изменений в конце скрипта
//======================================

function Run() {

 var ScriptName="«Удаление форматирования в заголовках и подзаголовках»";
 var NumerusVersion="2.1";
 var Ts=new Date().getTime();

//--------------------------------------------------------------------
                 ///  НАСТРОЙКИ
//--------------------------------------------------------------------

         //  Удаление форматирования

//     Удаление жирности во всех обычных заголовках
var Obrabotka_Title_St = 2;      // 0 ; 1 ; 2 //

//     Удаление курсива во всех обычных заголовках
var Obrabotka_Title_Em = 2;      // 0 ; 1 ; 2 //

//     Удаление нижнего индекса во всех обычных заголовках
var Obrabotka_Title_Sub = 2;      // 0 ; 1 ; 2 //

//     Удаление верхнего индекса во всех обычных заголовках
var Obrabotka_Title_Sup = 2;      // 0 ; 1 ; 2 //


//     Удаление жирности во всех подзаголовках
var Obrabotka_Subtitle_St = 2;      // 0 ; 1 ; 2 //

//     Удаление курсива во всех подзаголовках
var Obrabotka_Subtitle_Em = 2;      // 0 ; 1 ; 2 //

//     Удаление нижнего индекса во всех подзаголовках
var Obrabotka_Subtitle_Sub = 2;      // 0 ; 1 ; 2 //

//     Удаление верхнего индекса во всех подзаголовках
var Obrabotka_Subtitle_Sup = 2;      // 0 ; 1 ; 2 //

 // "0" — никогда не удалять
 // "1" — всегда удалять
 // "2" — всегда спрашивать и показывать

// ---------------------------------------------------------------

         //  Автоматическое повышение версии файла и запись в историю изменений

 var Version_on_off = 1;      // 0 ; 1 //      ("0" — отключить, "1" — включить)

//  Добавлять, если не сделано ни одного исправления
 var Vsegda_on_off = 0;      // 0 ; 1 //      ("0" — отключить, "1" — включить)

//   Имя используемое в добавленной записи:
 var youName = "Зорро";

//  * Для записи имени можно использовать почти любые символы.
//     Исключения:   |  "  |  \  |    Но и любой из этих знаков можно добавить, если поставить перед ним наклонную черту ("\"), например: "\\" = "\"
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

 var n=0;

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
         Year = ("0" + fullDate.getFullYear()).replace(/^.*?(\d\d)$/g, "$1");       //  год,
         mDate[j] = Day + "." + Month + "." + Year;             //  и заполняем массив текстом очередной даты (Д.ММ.ГГ).
         D -= 86400000;                       //  При этом каждый раз уменьшаем проверяемую дату на один день.
         }


         //  Поиск недавней записи в "истории"

 var povtorD = false;   //  Индикатор повторной обработки в последние 10 дней.
 var mP = History.getElementsByTagName("P");   //  Получение всех строк в "Истории".
 var s="";               //  Содержимое строки.
 var k=0;               //  Счетчик цикла.

fff:
 for (j=mP.length-1;  j>0;  j--) {    //  Последовательный просмотр строк истории.
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

 var textYouName = youName+"";    //  Имя в тексте.
 if (youName!="")                           //  Если есть заполненное имя...
         textYouName += ", ";   //  то добавляем к текстовой записи запятую.

 var reHist00s = new RegExp("[^А-яЁёA-Za-z0-9]"+Script_Name+"[^А-яЁёA-Za-z0-9]","g");   //  Стартовая.
 //  Добавление точки с запятой
 var reHist01 = new RegExp("(.[^…\\\?!\\\.,;:—])(\\\s|"+nbspEntity+")(— \\\("+textYouName+mDate[k]+"\\\))","g");
 var reHist01_ = "$1; $3";
 //  Добавление слова "Скрипт"
 var reHist02 = new RegExp("(.)(\\\s|"+nbspEntity+")(— \\\("+textYouName+mDate[k]+"\\\))","g");
 var reHist02_ = "$1 Скрипт: $3";
 //  Добавление имени скрипта
 var reHist03 = new RegExp("(.)(\\\s|"+nbspEntity+")(— \\\("+textYouName+mDate[k]+"\\\))","g");
 var reHist03_ = "$1 "+Script_Name+" $3";

 if (povtorD) {                                         //  Если найдена запись с недавней датой...
         if (s.search(reHist03) !=-1) {    //  и если в строке имя пользователя и дата записаны по форме: "— (Имя, Дата)"...
                 if (s.search(reHist00s) ==-1) {    //  то проверяем строку на наличие записи имени скрипта, и если этой записи нет...
                         if (s.search(/([Сс]крипт):/) !=-1)  s = s.replace(/([Сс]крипт):/g, "$1ы:");   //  то заменяем при необходимости слово "Скрипт" на "Скрипты",
                         if (s.search(reHist01) !=-1)  s = s.replace(reHist01, reHist01_);                   //  добавляем при необходимости точку с запятой,
                         if (s.search(/[Сс]крипты?:/) ==-1)  s = s.replace(reHist02, reHist02_);   //  добавляем при необходимости слово "Скрипт"
                         s = s.replace(reHist03, reHist03_);      //  и добавляем имя скрипта.
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

 var reHist11 = new RegExp("^(\\\s|"+nbspEntity+"){0,}$","g");   //  Признак пустой строки.
 var reHist12 = new RegExp("(^|\\n)[^0-9]{0,10}"+versionFile+"([^0-9]|$)","g");   //  Поиск старой версии.

 //   Добавление строки с информацией о старой версии
 if (ValidationVersion  &&  History.innerHTML.search(reHist12)==-1) {       //  Если в истории нет записи о старой версии...
         if (History.lastChild.innerHTML.search(reHist11)==-1)                                               //  то проверяем наличие пустой строки в конце истории
                 History.insertAdjacentElement("beforeEnd",document.createElement("P"));       //  и если ее нет - добавляем новую.
         History.lastChild.innerHTML = "v."+versionFile+" — ?";  //  Затем добавляем в строку информацию о старой версии
         HiCh++;                                        //  и изменяем индикатор истории.
         }

 //   Добавление строки с информацией о новой версии
 if (History.lastChild.innerHTML.search(reHist11)==-1)                                   //  Если в конце истории нет готовой пустой строки...
         History.insertAdjacentElement("beforeEnd",document.createElement("P"));   //  то добавляем новую строку.
 History.lastChild.innerHTML = versionText+" Скрипт: "+Script_Name+" — ("+textYouName+mDate[0]+")";  //  Добавляем в строку информацию о новой версии.
 HiCh++;                       //  Изменяем индикатор истории.

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

       //  Подсчет заголовков и подзаголовков

 var count_Ttl_1 = 0;
 var count_Ttl_2 = 0;   //  в комментариях и примечаниях
 var count_sTtl  = 0;


       //  Поиск жирности, курсива, нижнего и верхнего индекса

 var reSt = new RegExp("<STRONG>.{1,}?</STRONG>","g");

 var reEm = new RegExp("<EM>.{1,}?</EM>","g");

 var reSub = new RegExp("<SUB>.{1,}?</SUB>","g");

 var reSup = new RegExp("<SUP>.{1,}?</SUP>","g");
 var reSupEx = new RegExp("<SUP>(<[^>]{1,}>|\\\s|"+nbspEntity+"){0,}(\\\d{1,}?|\\\[\\\d{1,}?\\\]|\\\{\\\d{1,}?\\\})(<[^>]{1,}>|\\\s|"+nbspEntity+"){0,}</SUP>","g");  // исключаются примечания
 var SupTtlComm = false;
 var SupSttlComm = false;

 var reTag = new RegExp("<STRONG>.{1,}?</STRONG>|<EM>.{1,}?</EM>|<SUB>.{1,}?</SUB>|<SUP>.{1,}?</SUP>","g");


       //  Подсчет выделенных строк в заголовках

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


       //  Подсчет выделенных строк в заголовках комментариев и примечаний
 var m_21  = [];
 var count_021  = 0;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ПОДСЧЕТ И СОХРАНЕНИЕ ПАРАГРАФОВ

 var s="";
 var s_="";


         //  Функция "Vopros_1"  (обычные заголовки)

 function Vopros_1 (ptr)  {

         s=ptr.innerHTML;

         count_Ttl_1++;       //  Подсчет всех строк в обычных заголовках

               //  Подсчет и сохранение строк с полужирным шрифтом
         if (Obrabotka_Title_St !=0  &&  s.search(reSt) !=-1) {
                 m_01[count_001]  = ptr;
                 count_001++
                 }

               //  Подсчет и сохранение строк с курсивом
         if (Obrabotka_Title_Em !=0  &&  s.search(reEm) !=-1) {
                 m_02[count_002]  = ptr;
                 count_002++;
                 }

               //  Подсчет и сохранение строк с нижним индексом
         if (Obrabotka_Title_Sub !=0  &&  s.search(reSub) !=-1) {
                 m_03[count_003]  = ptr;
                 count_003++;
                 }

               //  Подсчет и сохранение строк с верхним индексом
         if (Obrabotka_Title_Sup !=0  &&  s.search(reSup) !=-1) {
                 if (s.search(reSupEx) !=-1)  { s=s.replace(reSupEx, "");  SupTtlComm = true }     //  * исключается текст похожий на примечание
                 if (s.search(reSup) !=-1) {
                         m_04[count_004]  = ptr;
                         count_004++;
                         }
                 }
         }


         //  Функция "Vopros_2"  (подзаголовки)

 function Vopros_2 (ptr)  {

         s=ptr.innerHTML;

         count_sTtl++;       //  Подсчет всех строк подзаголовков

               //  Подсчет и сохранение строк с полужирным шрифтом
         if (Obrabotka_Subtitle_St !=0  &&  s.search(reSt) !=-1) {
                 m_11[count_011]  = ptr;
                 count_011++;
                 }

               //  Подсчет и сохранение строк с курсивом
         if (Obrabotka_Subtitle_Em !=0  &&  s.search(reEm) !=-1) {
                 m_12[count_012]  = ptr;
                 count_012++
                 }

               //  Подсчет и сохранение строк с нижним индексом
         if (Obrabotka_Subtitle_Sub !=0  &&  s.search(reSub) !=-1) {
                 m_13[count_013]  = ptr;
                 count_013++;
                 }

               //  Подсчет и сохранение строк с верхним индексом
         if (Obrabotka_Subtitle_Sup !=0  &&  s.search(reSup) !=-1) {
                 if (s.search(reSupEx) !=-1)  { s=s.replace(reSupEx, "");  SupSttlComm = true }     //  * исключается текст похожий на примечание
                 if (s.search(reSup) !=-1) {
                         m_14[count_014]  = ptr;
                         count_014++;
                         }
                 }
         }


         //  Функция "Vopros_3"  (заголовки в комментариях и примечаниях)

 function Vopros_3 (ptr)  {

         s=ptr.innerHTML;

         count_Ttl_2++;       //  Подсчет строк заголовков в комментариях и примечаниях

               //  Подсчет и сохранение строк заголовков с тегами
         if (s.search(reTag) !=-1) {
                 if (s.search(reSupEx) !=-1)  SupTtlComm = true;
                 m_21[count_021]  = ptr;
                 count_021++ }
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ПОДСЧЕТ И СОХРАНЕНИЕ ПАРАГРАФОВ
                 //      (применение функций "Vopros_X")

 var div;
 var mP;
 var mPL;
 var j;
 var jj;
 var ptr;

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


                 /// ПРОСМОТР И ИЗМЕНЕНИЕ ПАРАГРАФОВ

 var otvet=0;
 var msg1="";
 var msg2="";
 var mP=[];
 var count;

         //  Функция просмотра найденных строк
 function specto(msg1, mP, count) {
 n=0;
 otvet=0;
 while ("зацикливание") {                     //  Окно ввода будет запускаться, пока не будет нажата кнопка "Отмена"
         if (n+1 != count)    msg2= "Строка "+(n+1)+" из "+count+"\n"+"                        ◊  Показать следующую строку?";
         if (n+1 == count)  msg2= "Строка "+(n+1)+" из "+count+"\n"+"                        ◊  Вернуться к первой строке?";
         if (count == 1)       msg2= "Строка "+(n+1)+" из "+count+"\n"+"                        ◊  Для выхода из режима просмотра нажмите \"Отмена\"";

         StyleDiv = document.createElement("DIV");            //  Создаем раздел стилей.
         mP[n].insertAdjacentElement("beforeBegin", StyleDiv);    //   Добавляем раздел стилей в текст.
         StyleDiv.insertAdjacentElement("afterBegin", mP[n]);   //   Вставляем строки параграфа в этот раздел.
         if (msg1.search("подзаг")!=-1)
                 StyleDiv.style.backgroundColor="#B08CD1";         //  Выделяем раздел с подзаголовком одним цветом,
             else  StyleDiv.style.backgroundColor="#C9B766";         //  а раздел со строкой заголовка - другим.
         StyleDiv.style.color="black";                             //  Выбираем цвет шрифта
         StyleDiv.style.border="none";                        //  и убираем рамку.

         GoTo(mP[n]);              //  Переход на элемент с выбранным номером

         T_pause -= new Date().getTime();
         window.external.InputBox(msg2, msg1, "");        // спрашиваем
         T_pause += new Date().getTime();

         StyleDiv.removeNode(false);                            //  Удаляем раздел стилей.

         otvet = window.external.GetModalResult();            //   получение кнопки ответа
         if (otvet ==6)                          //   Если нажата кнопка "Да"
                 if (n<count-1) n++;        //   увеличивается номер элемента в массиве
                     else n=0;                        //   если нельзя увеличить, то выбирается самый первый номер
         if (otvet ==7)                         //   Если нажата кнопка "Нет"
                 if (n>0) n--;                       //   уменьшается номер элемента в массиве
                     else n=count-1;           //   если нельзя уменьшить, то выбирается самый последний номер
         if (otvet ==2)  break;         //   Если нажата кнопка "Отмена" -- выход из цикла
         }
 }


         //   Вопросы к пользователю

 var reSt_Del = new RegExp("</{0,1}STRONG>","g");       //  Удаление жирности
 var reEm_Del = new RegExp("</{0,1}EM>","g");       //  Удаление курсива
 var reSub_Del = new RegExp("</{0,1}SUB>","g");       //  Удаление нижнего индекса

 var reSup_Del = new RegExp("</{0,1}SUP>","g");       //  Удаление верхнего индекса
 var reSup_Off = new RegExp("<(SUP>(<[^>]{1,}>|\\\s|"+nbspEntity+"){0,}(\\\d{1,}?|\\\[\\\d{1,}?\\\]|\\\{\\\d{1,}?\\\})(<[^>]{1,}>|\\\s|"+nbspEntity+"){0,}</SUP)>","g");       //  Скрытие исключения для верхнего индекса
 var reSup_Off_ = "< $1 >";
 var reSup_On = new RegExp("< (SUP>(<[^>]{1,}>|\\\s|"+nbspEntity+"){0,}(\\\d{1,}?|\\\[\\\d{1,}?\\\]|\\\{\\\d{1,}?\\\})(<[^>]{1,}>|\\\s|"+nbspEntity+"){0,}</SUP) >","g");       //  Возвращение исключения для верхнего индекса
 var reSup_On_ = "<$1>";

 var reTag_Del = new RegExp("</{0,1}EM>|</{0,1}STRONG>|</{0,1}SUB>","g");       //  Удаление курсива, жирности и нижнего индекса

 var count_101 = 0;  var count_102 = 0;  var count_103 = 0;  var count_104 = 0;
 var count_111 = 0;  var count_112 = 0;  var count_113 = 0;  var count_114 = 0;
 var count_121 = 0;


 window.external.BeginUndoUnit(document, ScriptName + " v."+NumerusVersion);    // Начало записи в систему отмен.


         //  Заголовки

 if (count_001 !=0)  {
         otvet=false;
         if (Obrabotka_Title_St ==2) {
                 specto("• Жирность в заголовках • Просмотр •", m_01, count_001);
                 T_pause -= new Date().getTime();
                 otvet = AskYesNo ("◊  Удалить жирность во всех заголовках?                   ");
                 T_pause += new Date().getTime();
                 }
         if (otvet  ||  Obrabotka_Title_St ==1)
                 for ( n=0; n<count_001; n++) {
                         s=m_01[n].innerHTML;
                         count_101 += s.match(reSt_Del).length /2;
                         m_01[n].innerHTML=s.replace(reSt_Del, "");
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
         if (otvet  ||  Obrabotka_Title_Em ==1)
                 for ( n=0; n<count_002; n++) {
                         s=m_02[n].innerHTML;
                         count_102 += s.match(reEm_Del).length /2;
                         m_02[n].innerHTML=s.replace(reEm_Del, "");
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
         if (otvet  ||  Obrabotka_Title_Sub ==1)
                 for ( n=0; n<count_003; n++) {
                         s=m_03[n].innerHTML;
                         count_103 += s.match(reSub_Del).length /2;
                         m_03[n].innerHTML=s.replace(reSub_Del, "");
                         }
         }

 if (count_004 !=0)  {
         otvet=false;
         if (Obrabotka_Title_Sup ==2) {
                 specto("• Верхний индекс в заголовках • Просмотр •", m_04, count_004);
                 T_pause -= new Date().getTime();
                 if (SupTtlComm)
                         otvet = AskYesNo ("◊  Удалить верхний индекс во всех заголовках?                   \n\n"+
                                                               "_ _ _ _ _ _ _\n"+
                                                               "* форматирование чисел сохраняется");
                     else  otvet = AskYesNo ("◊  Удалить верхний индекс во всех заголовках?                   ");
                 T_pause += new Date().getTime();
                 }
         if (otvet  ||  Obrabotka_Title_Sup ==1)
                 for ( n=0; n<count_004; n++) {
                         s=m_04[n].innerHTML;
                         s=s.replace(reSup_Off, reSup_Off_);  //  скрытие исключения
                         count_104 += s.match(reSup_Del).length /2;
                         s=s.replace(reSup_Del, "");                   //  удаление формата
                         s=s.replace(reSup_On, reSup_On_);  //  возвращение исключения
                         m_04[n].innerHTML=s;
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
         if (otvet  ||  Obrabotka_Subtitle_St ==1)
                 for ( n=0; n<count_011; n++) {
                         s=m_11[n].innerHTML;
                         count_111 += s.match(reSt_Del).length /2;
                         m_11[n].innerHTML=s.replace(reSt_Del, "");
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
         if (otvet  ||  Obrabotka_Subtitle_Em ==1)
                 for ( n=0; n<count_012; n++) {
                         s=m_12[n].innerHTML;
                         count_112 += s.match(reEm_Del).length /2;
                         m_12[n].innerHTML=s.replace(reEm_Del, "");
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
         if (otvet  ||  Obrabotka_Subtitle_Sub ==1)
                 for ( n=0; n<count_013; n++) {
                         s=m_13[n].innerHTML;
                         count_113 += s.match(reSub_Del).length /2;
                         m_13[n].innerHTML=s.replace(reSub_Del, "");
                         }
         }

 if (count_014 !=0)  {
         otvet=false;
         if (Obrabotka_Subtitle_Sup ==2) {
                 specto("• Верхний индекс в подзаголовках • Просмотр •", m_14, count_014);
                 T_pause -= new Date().getTime();
                 if (SupSttlComm)
                         otvet = AskYesNo ("◊  Удалить верхний индекс во всех* подзаголовках?                   \n\n"+
                                                               "_________\n"+
                                                               "* форматирование чисел сохраняется");
                     else  otvet = AskYesNo ("◊  Удалить верхний индекс во всех подзаголовках?                   ");
                 T_pause += new Date().getTime();
                 }
         if (otvet  ||  Obrabotka_Subtitle_Sup ==1)
                 for ( n=0; n<count_014; n++) {
                         s=m_14[n].innerHTML;
                         s=s.replace(reSup_Off, reSup_Off_);  //  скрытие исключения
                         count_114 += s.match(reSup_Del).length /2;
                         s=s.replace(reSup_Del, "");                   //  удаление формата
                         s=s.replace(reSup_On, reSup_On_);  //  возвращение исключения
                         m_14[n].innerHTML=s;
                         }
         }


         //  Заголовки примечаний и коментариев

 for ( n=0; n<count_021; n++) {
         s=m_21[n].innerHTML;
         s_=s;
         if (s.search(reTag_Del)>=0)  { count_121 += s.match(reTag_Del).length /2;    s=s.replace(reTag_Del, "");  }     //  удаление трех тегов
         s=s.replace(reSup_Off, reSup_Off_);       //  скрытие исключения
         if (s.search(reSup_Del)>=0)  { count_121 += s.match(reSup_Del).length /2;    s=s.replace(reSup_Del, "");  }    //  удаление формата верхнего индекса
         s=s.replace(reSup_On, reSup_On_);        //  возвращение исключения
         if (s_!=s)  m_21[n].innerHTML=s;        //  сохранение строки при ее изменении
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 // Подсчет общего количества исправлений
 var count_all = count_101 + count_102 + count_103 + count_104 + count_111 + count_112 + count_113 + count_114 + count_121;

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


                 /// Демонстрационный режим "Показать все строки"

var VseStroki_on_off = 0;      // 0 ; 1 //      ("0" — отключить, "1" — включить)

 var d=0;
 if (VseStroki_on_off == 1)  d="показать нули";

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Сборка массива с результатами обработки

 var Tf=new Date().getTime();
 var mSt=[];
 var ind=0;

                 mSt[ind]=" «Удаление форматирования";  ind++;
                 mSt[ind]="           в заголовках и подзаголовках» v."+NumerusVersion;  ind++;
                 mSt[ind]="---------------------------------------------------------";  ind++;
 if (d)   { mSt[ind]=" Демонстрационный режим";  ind++ }
                 mSt[ind]="					     ";  ind++;

                                         mSt[ind]="Вычисления  .  .  .  .  .  .  .  .  .  .  .  .	"+time(Tf - Ts - T_pause);  ind++;
 if (T_pause!=d)       { mSt[ind]="Диалоговые паузы .  .  .  .  .  .  .  .  .	"+time(T_pause);  ind++; }
 if (count_Ttl_1!=d) {
      if (count_Ttl_2==0 || d) { mSt[ind]="Строк заголовков  .  .  .  .  .  .  .  .  .	"+count_Ttl_1;  ind++ }
      if (count_Ttl_2!=d)          { mSt[ind]="Строк обычных заголовков  .  .  .  .	"+count_Ttl_1;  ind++ }    }
 if (count_Ttl_2!=d)               { mSt[ind]="Строк заголовков примечаний	"+count_Ttl_2;  ind++ }
 if (count_sTtl!=d)                 { mSt[ind]="Строк подзаголовков  .  .  .  .  .  .  .	"+count_sTtl;  ind++ }

 var cTaT=ind;  //  число строк в 1-м разделе

                                         mSt[ind]="";  ind++;
                                         mSt[ind]="• УДАЛЕНИЕ ФОРМАТОВ:";  ind++;
 if (count_101!=d)  { mSt[ind]="Жирность в  заголовках .  .  .  .  .  .	"+count_101;  ind++ }
 if (count_102!=d)  { mSt[ind]="Курсив в  заголовках   .  .  .  .  .  .  .	"+count_102;  ind++ }
 if (count_103!=d)  { mSt[ind]="Нижний индекс в  заголовках  .  .  .	"+count_103;  ind++ }
 if (count_104!=d)  { mSt[ind]="Верхний индекс в  заголовках .  .  .	"+count_104;  ind++ }
 if (count_111!=d)  { mSt[ind]="Жирность в  подзаголовках .  .  .  .	"+count_111;  ind++ }
 if (count_112!=d)  { mSt[ind]="Курсив в  подзаголовках   .  .  .  .  .	"+count_112;  ind++ }
 if (count_113!=d)  { mSt[ind]="Нижний индекс в  подзаголовках	"+count_113;  ind++ }
 if (count_114!=d)  { mSt[ind]="Верхний индекс в  подзаголовках	"+count_114;  ind++ }
 if (count_121!=d)  { mSt[ind]="Теги в  заголовках  примечаний	"+count_121;  ind++ }

 if (cTaT==ind-2)  mSt[ind-1]=">> Исправлений нет";   //  Если нет пунктов с исправлениями  -  замена последней строки.

//  История
 if (VersionUp ||  HiCh  ||  d)  { mSt[ind]="";  ind++ }
 if (VersionUp  ||  d)                 { mSt[ind]="• Версия файла:  "+versionFile+"  ›››  "+newVersion;  ind++ }
 if (HiCh==1  ||  d)                    { mSt[ind]="• Добавлена новая строка в историю";  ind++ }
 if (HiCh==2  ||  d)                    { mSt[ind]="• Добавлены две строки в историю";  ind++ }
 if (HiCh==3  ||  d)                    { mSt[ind]="• Изменены данные в строке истории";  ind++ }

 mSt[ind]="";  ind++;
 mSt[ind]="---------------------------------------------------------";  ind++;

//  Сборка строк текущей даты и времени
 mSt[ind]= "• "+currentDate+" • "+currentTime+" •";  ind++;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Вывод окна результатов на экран

 var stText="";   //  Текст результатов.

 for  ( n=0; n!=ind; n++ )
        stText+=mSt[n]+"\n";   //  Добавление элемента из массива.

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





