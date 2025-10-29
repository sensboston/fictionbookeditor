//------------------------------------------------------------------------------------------
//             «Редакция описания документа»
//  Скрипт предназначен для открытия широкого доступа к текстовым данным дескрипшена + автоматическая обработка.
//  * Скрипт тестировался в FBE v.2.7.8 (win XP, IE8 и win 7, IE11)
// v.1.0 — Создание скрипта — Александр Ка (6.06.2025)
// v.1.1 — Расширение настроек, исправление ошибок — Александр Ка (17.06.2025)
//------------------------------------------------------------------------------------------

function Run() {

 var ScriptName="«Редакция описания документа»";
 var NumerusVersion="1.1";
 var Ts=new Date().getTime();

// ---------------------------------------------------------------
                 ///  НАСТРОЙКИ
// ---------------------------------------------------------------

 //   Сохранить паузу между двумя этапами для дополнительной обработки. При отключении будут производится только автоматические операции, только этого скрипта.
 var Pause = 1;      // 0 ; 1 //      ("0" — Отключить паузу, "1" — Сохранить основной режим)

 //   Показывать пустые данные. При включении можно вручную заполнять пустые значения
 var ShowEmpty = 1;      // 0 ; 1 //      ("0" — Скрыть, "1" — Показывать всё, что можно)

 //   Порядок в именах авторов
 var FIO = 1;      // 0 ; 1 //      ("0" — Имя Отчество Фамилия, "1" — Фамилия Имя Отчество)

 //   При импорте в <body>, сохранять исходное деление на "Фамилия Имя Отчество"
 var Delenie = 1;      // 0 ; 1 //      ("0" — Не сохранять, при возвращении в <description> имена будет заново разделены скриптом, "1" — Сохранять)
 //   * Алгоритм деления текста на "Фамилия Имя Отчество" у скрипта не идеальный.

 //   Сортировать имена авторов и переводчиков по алфавиту
 var Sortirovka = 0;      // 0 ; 1 //      ("0" — Сохранить исходный порядок, "1" — Сортировать)

 //  Сохранение повторного значения языка в поле "Язык оригинала"
 var DelLang = 1;      // 0 ; 1 //      ("0" — Удалить повторное значение, "1" — Сохранить)

// ---------------------------------------------------------------

         //  Отображение в <body> (отключение обезопасит данные от случайного изменения другими скриптами)

 var ShowAuthorTI = 1;      // 0 ; 1 //      ("0" — Скрыть авторов <title-info>, "1" — Показывать)
 var ShowTranslatorTI = 1;      // 0 ; 1 //      ("0" — Скрыть переводчиков <title-info>, "1" — Показывать)
 var ShowSequenceTI = 1;      // 0 ; 1 //      ("0" — Скрыть серии <title-info>, "1" — Показывать)

 var ShowAuthorSTI = 1;      // 0 ; 1 //      ("0" — Скрыть авторов <src-title-info>, "1" — Показывать)
 var ShowTranslatorSTI = 1;      // 0 ; 1 //      ("0" — Скрыть переводчиков <src-title-info>, "1" — Показывать)
 var ShowSequenceSTI = 1;      // 0 ; 1 //      ("0" — Скрыть серии <src-title-info>, "1" — Показывать)

 var ShowAuthorDI = 1;      // 0 ; 1 //      ("0" — Скрыть авторов <document-info>, "1" — Показывать)

 var ShowSequencePI = 1;      // 0 ; 1 //      ("0" — Скрыть серии <publish-info>, "1" — Показывать)

// ---------------------------------------------------------------

 //   Показывать напоминание об опасном расположении курсора
 var Napominanie = 1;      // 0 ; 1 //      ("0" — Отключить, "1" — Показывать)

 //  Отображение пояснения к скрипту
 var Pojasnenie = 1;      // 0 ; 1 //      ("0" — Отключить, "1" — Показывать)

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

 //   Максимум строк в окне результатов. Для монитора 1024х768 максимальная высота окна равна 52 строкам (в win XP) и 50 строк (в win 7)
 var Vysota_teksta = 50;      // примерно 30-52 //      Ориентировочный максимум строк в окне результатов

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

         //  Счетчики цикла
var j = 0;
var n = 0;
var k = 0;

 var fbwBody=document.getElementById("fbw_body");         //  Структура текста
 var fbwDesc=document.getElementById("fbw_desc");         //  Структура <description>.
 var mDesc=fbwDesc.all;         //  Все разделы <description>.
 var T_pause = 0;  //  Продолжительность диалоговых пауз.

 var mDiv=[];     //  Массив узлов "DIV"
 var div;                //  один из узлов "DIV"
 var Length;         //  длина массива
 var s;      //  Текст в параграфе (или разделе).
 var s2;   //  Часть текста.

         //  Новые элементы
 var Elem1;
 var Elem2;
 var Elem3;

 var mainElem;   //  Основной рабочий элемент.

 var otvet;   //  Значение ответа пользователя на вопрос в окне скрипта.

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///   Дополнительная обработка настроек

 if (Pause==0) {
         ShowEmpty = 0;
         ShowAuthorTI = 0;
         ShowTranslatorTI = 0;
         ShowSequenceTI = 0;
         ShowAuthorSTI = 0;
         ShowTranslatorSTI = 0;
         ShowSequenceSTI = 0;
         ShowAuthorDI = 0;
         ShowSequencePI = 0;
         FIO = 0;
         }

 var ShowAuthor = 0;

 if (ShowAuthorTI == 1  ||  ShowTranslatorTI == 1  ||  ShowAuthorSTI == 1  ||  ShowTranslatorSTI == 1  ||  ShowAuthorDI == 1)
         ShowAuthor = 1;

 if (ShowAuthorTI == 1  &&  ShowTranslatorTI == 1  &&  ShowAuthorSTI == 1  &&  ShowTranslatorSTI == 1  &&  ShowAuthorDI == 1)
         ShowAuthor = 2;

 if (ShowAuthor == 0)
         Delenie = 1;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///   Функция создания кода

 function createCode() {
         var code = 0;
         if(ShowEmpty == 1) code+=1;
         if(FIO != 0) code+=2;
         if(Delenie != 0) code+=4;
         if(Sortirovka != 0) code+=8;
         if(ShowAuthorTI == 1) code+=16;
         if(ShowTranslatorTI == 1) code+=32;
         if(ShowSequenceTI == 1) code+=64;
         if(ShowAuthorSTI == 1) code+=128;
         if(ShowTranslatorSTI == 1) code+=256;
         if(ShowSequenceSTI == 1) code+=512;
         if(ShowAuthorDI == 1) code+=1024;
         if(ShowSequencePI == 1) code+=2048;
         return "Раздел «description-" + NumerusVersion.replace(/\.\d+$/g, ".z") + "." + code + "»";
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///   Функции преобразования кода

 function inCode(text) {      //  Преобразование обычного текста в код.
         return  text.replace(/&/g, "&amp;").replace(/ /g, nbspEntity).replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/­/g, "&shy;");
         }

 function inText(text) {      //  Преобразование кода в обычный текст.
         return  text.replace(new RegExp(nbspEntity,"g"), " ").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&shy;/g, "­").replace(/&amp;/g, "&");
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


                 /// ФУНКЦИЯ ПЕРЕХОДА

// Прокрутка до выбранного элемента: верх окна = начало элемента.

 function GoTo_0(elem) {
         var b=elem.getBoundingClientRect();                  //  Получение координат элемента.
         var c=fbwBody.parentNode.getBoundingClientRect();        //  Получение координат раздела <BODY>.
         window.scrollBy(c.left, b.top - 3);                                //  Переставляем начало элемента в начало окна.
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


                 /// Функция создания секции в <body>

 function AddSection (text) {

 mainElem = document.createElement("DIV");   //  Создаём новый элемент "DIV",
 mainElem.className = "section";                                     //  присваиваем mainElem класс "section"
 bodyD.insertAdjacentElement("beforeEnd", mainElem);   //  и вставляем его в bodyD.

 Elem1 = document.createElement("DIV");   //  Создаём новый элемент "DIV",
 Elem1.className = "title";                                             //  присваиваем ему класс "title"
 mainElem.insertAdjacentElement("beforeEnd", Elem1);   //  и вставляем в mainElem.
 mainElem = Elem1;                                                                            //  и переименовываем в mainElem.

 Elem1 = document.createElement("P");                   //  Создаём новый элемент "P",
 Elem1.innerHTML = "===" + inCode(text) + "===";       //  заполняем его
 mainElem.insertAdjacentElement("beforeEnd", Elem1);   //  и вставляем в заголовок.
 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// Функция создания строки данных заголовка

 function AddTitle (data) {

 if (ShowEmpty == 1  ||  data)  {

         Elem1 = document.createElement("DIV");   //  Создаём новый элемент "DIV",
         Elem1.className = "section";       //  Присваиваем ему класс "section",
         mainElem.insertAdjacentElement("afterEnd", Elem1);   //  вставляем его после mainElem.
         mainElem = Elem1;                //  и переименовываем его в mainElem.

         Elem1 = document.createElement("DIV");   //  Создаём новый элемент "DIV",
         Elem1.className = "title";       //  присваиваем ему класс "title"
         mainElem.insertAdjacentElement("beforeEnd", Elem1);   //  и вставляем его в mainElem.

         Elem2 = document.createElement("P");   //  Создаём второй новый элемент - "P",
         Elem2.innerHTML = ("•" + nbspEntity + "Название: " + inCode(data)).replace(/ $/, "");   //  заполняем его
         Elem1.insertAdjacentElement("beforeEnd", Elem2);   //  и вставляем его в заголовок.
         }

 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// Функция создания одной строки данных

 function AddStroka (data, text) {

 if (ShowEmpty == 1  ||  data)  {              //  Если включено отображение пустых полей, или в книге есть данные...

         Elem1 = document.createElement("DIV");   //  Создаём новый элемент "DIV",
         Elem1.className = "section";       //  Присваиваем ему класс "section",
         mainElem.insertAdjacentElement("afterEnd", Elem1);   //  вставляем его после mainElem.
         mainElem = Elem1;                //  и переименовываем его в mainElem.

         Elem1 = document.createElement("P");              //  Создаём новый элемент "P",
         Elem1.innerHTML = "<STRONG>•" + nbspEntity + text + ":</STRONG>";   //  заполняем его
         mainElem.insertAdjacentElement("beforeEnd", Elem1);   //  и вставляем его в mainElem.

         Elem1 = document.createElement("P");          //  Создаём новый элемент "P",
         Elem1.innerHTML = inCode(data);   //  заполняем его
         mainElem.insertAdjacentElement("beforeEnd", Elem1);   //  вставляем его в mainElem,
         window.external.inflateBlock(Elem1)=true;                      //  и нормализуем.
         }
 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// Функция создания блока данных (авторы, переводчики)

 if (Delenie != 0)               //  Если выбрано сохранение разделения имен на ФИО...
         var razdelitel = "| ";     //  то разделитель будет отображаться,
     else  var razdelitel = "";    //  а если нет, то разделителей не будет.


 function AddBlock (elem, text, ID) {

 var M=[];   //  Исходный массив.
 var MM=[];   //  Отсортированный массив.

 mDiv = elem.getElementsByTagName("DIV");    //  Массив с элементами "DIV", каждый раздел содержит данные одного имени.
 Length = mDiv.length;      //  Длина массива.

 for (k=0 ; k<Length; k++) {     //  Перебираем все элементы "DIV".
         div = mDiv[k];        //  Текущий элемент.
         M[k] = [];     //  Добавляем второе измерение для массива.
         M[k][0] = div.all.first.value;    //  Заполняем массив данными очередного имени.
         M[k][1] = div.all.middle.value;
         M[k][2] = div.all.last.value;
         M[k][3] = div.all.nick.value;
         M[k][4] = div.all.email.value;
         M[k][5] = div.all.home.value;
         if (ID)  M[k][6] = div.all.id.value;
         if (! M[k][0]  &&  ! M[k][1]  &&  ! M[k][2]  &&  ! M[k][3]) {    //  Если нет ни одного заполненного поля в ФИО+ник...
                 M.pop();      //  то удаляем все данные этого имени из массива.
                 }
         }

 Length = M.length;   //  Длина массива с именами.

 var mFION = [" ", "№"];   //  Вспомогательный массив (для сортировки).
 var fion = "";             //  Сборный текст, необходимый для правильной сортировки.
 var k1=0;                  //  Индекс первого элемента в фрагменте массива.
 var k2=0;                  //  Индекс последнего элемента в фрагменте массива.
 var k_Midi=0;         //  Индекс для среднего элемента в фрагменте массива.

 aaa:     // метка
 for (n=0 ; n<Length; n++) {                 //   Цикл для всех имен.
         fion = ("Ф " + M[n][2] + " " + M[n][0] +  " " + M[n][1] +  " " + M[n][3]).toUpperCase().replace(/Ё/g, "Е№").replace(/[′`´ʼ΄‘’]/g, "'");   //  Сборка ориентировочного текста.
         if (ID)  fion += " " + M[n][6];
         k1=0;                                      //  Исходное значение  для начала фрагмента.
         k2=mFION.length-1;        //  Исходное значение  для конца фрагмента.
         while (k2-k1 != 1) {                                        //  Цикл, который будет выполняться, пока фрагмент массива не будет состоять из двух элементов.
                 k_Midi = Math.floor((k2+k1)/2);          //  Получение индекса среднего элемента  внутри фрагмента.
                 if (fion == mFION[k_Midi]) {     //  Если проверяемый текст уже есть в сортированном массиве...
                         M.splice(n, 1);         //   то удаляем дубль имени из исходного массива,
                         n--;                      //  корректируем индекс элемента,
                         Length--;            //  а так же длину исходного массива
                         continue aaa;       //  и переходим к следующему слову.
                         }
                 if (fion > mFION[k_Midi])    //  Если слово больше среднего элемента...
                         k1=k_Midi;                                //   сдвигаем начало фрагмента на место среднего элемента,
                     else  k2=k_Midi;                          //  а если нет - сдвигаем конец фрагмента.
                 }                                                     //  После того, как фрагмент уменьшился до двух элементов...
         mFION.splice(k2, 0, fion);                            //  добавляем между этими элементами проверяемый текст
         MM.splice(k2-1, 0, M[n]);   //  и синхронно добавляем данные имени в сортированный массив с именами.
         }


 if(Sortirovka != 0)                 //  Если разрешена сортировка имен...
         M = MM;   //  то заменяем исходный список авторов на отсортированный.

 var lastName = "";   //  Вспомогательная переменная.

 if(FIO != 0)    //  Если выбран порядок, когда сначала идет фамилия, а затем имя и отчество...
         for (n=0 ; n<Length; n++) {          //  Перебираем весь список авторов...
                 lastName = M[n][2];           //  в котором сначала сохраняем фамилию,
                 M[n][2] = M[n][1];   //  затем сдвигаем имя и отчество
                 M[n][1] = M[n][0];
                 M[n][0] = lastName;   //  и делаем фамилию первым элементом массива.
                 }

 if(ShowEmpty == 1  ||  Length != 0) {        //  Если выбран показ пустых полей или есть хотя бы один автор...

         Elem1 = document.createElement("DIV");   //  Создаём новый элемент "DIV",
         Elem1.className = "section";       //  Присваиваем ему класс "section",
         mainElem.insertAdjacentElement("afterEnd", Elem1);   //  вставляем его после mainElem.
         mainElem = Elem1;                //  и переименовываем его в mainElem.

         Elem1 = document.createElement("P");          //  Создаём новый элемент "P",
         Elem1.innerHTML = "<STRONG>•" + nbspEntity + text + ":</STRONG>";         //  заполняем его
         mainElem.insertAdjacentElement("beforeEnd", Elem1);   //  и вставляем его в mainElem.
         }

 for (n=0 ; n<Length; n++) {      //  Запускаем цикл для перебора всех имен.
         Elem1 = document.createElement("P");   //  Создаём новый элемент "P".
         Elem1.innerHTML = inCode(M[n][0] + " " + razdelitel + M[n][1] + " " + razdelitel + M[n][2] + " | ");   //  добавляем в него ФИО,
         if(ShowEmpty == 1  ||  M[n][3])
                 Elem1.innerHTML += "Ник: " + inCode(M[n][3]) + " | ";   //  ник,
         if(ShowEmpty == 1  ||  M[n][4])
                 Elem1.innerHTML += "Почта: " + inCode(M[n][4]) + " | ";   //  мыло,
         if(ShowEmpty == 1  ||  M[n][5])
                 Elem1.innerHTML += "Сайт: " + inCode(M[n][5]) + " | ";   //  вебсайт
         if(ID  &&  (ShowEmpty == 1  ||  M[n][6]))
                 Elem1.innerHTML += "<SPAN class=code>ID: " + inCode(M[n][6]) + "</SPAN>";    //  и идентификационный код.
         Elem1.innerHTML = Elem1.innerHTML.replace(/  +/g, " ").replace(/ (?=<\/SPAN>)/, "").replace(/ \| $/, "");    //  Удаляем конечные пробелы, разделители и сокращаем спаренные пробелы до одного.

         mainElem.insertAdjacentElement("beforeEnd", Elem1);   //  Вставляем полученный параграф в mainElem.
         }

 if(ShowEmpty == 1  &&  Length == 0) {        //  Если выбран показ пустых полей и нет ни одного имени...
         Elem1 = document.createElement("P");          //  Создаём новый элемент "P",
         mainElem.insertAdjacentElement("beforeEnd", Elem1);   //  вставляем его в mainElem
         window.external.inflateBlock(Elem1)=true;         //  и нормализуем пустую строку.
         }

 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// Функция создания структуры серий

 function AddSequence (elem) {

         //   Создание строк для  <sequence>

 div=elem.firstChild;   //  Первый дочерний элемент в разделе с сериями.
 Elem1 = mainElem;    //  Начальное значение для Elem1.

aaa:   //  Метка.
 while (true) {       //  Запускаем бесконечный цикл, который может прерваться только внутренней командой.
         if (div.nodeName =="DIV") {    //  Если текущей элемент в структуре дескрипшена - "DIV"...
                 div=div.firstChild;                      //  то переходим на первый дочерний элемент этого раздела
                 Elem1 = Elem1.lastChild;   //  и, для синхронизации, переходим на последний дочерний элемент в "Elem1".
                 }
             else {      //  Если же спуститься нельзя...
                     while (div.nextSibling==null)  {    //  то пока не откроется проход на соседний элемент
                             div=div.parentNode;                     //  поднимаемся в структуре дескрипшена
                             Elem1 = Elem1.parentNode;   //  и одновременно в структуре искусственного <body>.
                             if (div == elem) break aaa;    //  А если оказываемся в корневом разделе для серий, то выходим из основного цикла.
                             }
                     div=div.nextSibling;
                     }

         if (div.nodeName=="DIV") {    //  Если в структуре дескрипшена встретился раздел "DIV"...

                 Elem2 = document.createElement("DIV");   //  Создаём новый элемент "DIV".
                 Elem2.className = "section";       //  Присваиваем ему класс "section"
                 Elem1.insertAdjacentElement("afterEnd", Elem2);   //  и вставляем его после Elem1.
                 Elem1 = Elem2;       //  и переименовываем его в Elem1.

                 Elem2 = document.createElement("DIV");   //  Создаём новый элемент "DIV".
                 Elem2.className = "title";       //  Присваиваем ему класс "title"
                 Elem1.insertAdjacentElement("beforeEnd", Elem2);   //  и вставляем внутрь новой секции.

                 if(ShowEmpty == 1  ||  div.children.name.value) {     //  Если выбрано отображение пустых полей, или есть название серии...
                         Elem3 = document.createElement("P");   //  Создаём новый элемент "P",
                         Elem3.innerHTML = ("•" + nbspEntity + "Серия: " + inCode(div.children.name.value)).replace(/ $/, "");   //  Заполняем его текстом
                         Elem2.insertAdjacentElement("beforeEnd", Elem3);   //  и вставляем внутрь нового заголовка.
                         }

                 if(ShowEmpty == 1  ||  div.children.number.value) {     //  Если выбрано отображение пустых полей, или есть номер серии...
                         Elem3 = document.createElement("P");   //  Создаём новый элемент "P",
                         Elem3.innerHTML = ("<SUP>•" + nbspEntity + "Номер: " + inCode(div.children.number.value) + "</SUP>").replace(/ (?=<\/SUP>)/, "");   //  Заполняем его текстом
                         Elem2.insertAdjacentElement("beforeEnd", Elem3);   //  и вставляем внутрь нового заголовка.
                         }
                 }
         }

 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///   Поиск <body> с дескрипшеном

 var bodyD;
 var mChild = fbwBody.children;     //  Массив дочерних разделов "fbw_body".

 for (j=0;  j<mChild.length;  j++) {     //  Запускаем цикл для дочерних разделов "fbw_body".
         div = mChild[j];
         if (div.className =="body"  &&  div.getAttribute("fbname") !=null  &&  div.getAttribute("fbname") == createCode()) {   //  Если найден раздел <body> с дескрипшеном...
                 bodyD = div;      //  то сохраняем его
                 break;                   //  и выходим из цикла.
                 }
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///   Напоминание

 var napominanieText =
         " • НАПОМИНАНИЕ \n\n"+
         " Перед запуском скрипта не забудьте убедиться, \n"+
         " что в «Описании документа» не установлен курсор \n"+
         " в текстовом поле, которое может быть \n"+
         " удалено скриптом. \n\n"+
         " Такие поля располагаются в разделах: \n"+
         "    Авторы \n"+
         "    Переводчики \n"+
         "    Серии \n"+
         "    Дополнительная информация \n\n"+
         " Исключаются только первые строки данных. \n"+
         " Если же курсор оказывается \n"+
         " в любой строке, следующей за первой, \n"+
         " то существует очень большая вероятность \n"+
         " вылета программы «FictionBook Editor» из-за того, \n"+
         " что при переходе в раздел «Описание документа», \n"+
         " программа не сможет вернуть курсор \n"+
         " на прежнее место. \n\n"+
         " ◊ Продолжить выполнение скрипта?"

 if (Pause ==0  &&  Napominanie !=0  &&  fbwBody.style.display == "block") {    //  Если скрипт работает без паузы, и включено напоминание, и действует режим "Дизайн"...
         T_pause -= new Date().getTime();
         otvet = AskYesNo (napominanieText);              //  Создаем окно вопроса и сохраняем ответ.
         T_pause += new Date().getTime();
         if (!otvet)     //  Если выбран отказ от продолжения...
                 return;      //  выходим из скрипта.
         }

// ---------------------------------------------------------------
 if (Pause == 0)       //  Если скрипт работает без паузы...
         window.external.BeginUndoUnit(document, ScriptName + ": Мини-обработка");    // Начало записи в систему отмен.
// ---------------------------------------------------------------
 if (!bodyD) {    ///  Если <body> с дескрипшеном нет в разделе "Дизайн"...
// ---------------------------------------------------------------
 if (Pause != 0)       //  Если скрипт работает с паузой...
         window.external.BeginUndoUnit(document, ScriptName + ": Создание <body>");    // Начало записи в систему отмен.
// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///   Поиск и удаление <body> с неточным дескрипшеном

 for (j=0;  j<mChild.length;  j++) {     //  Запускаем цикл для дочерних разделов "fbw_body".
         div = mChild[j];
         if (div.className =="body"  &&  div.getAttribute("fbname") !=null  &&  div.getAttribute("fbname").search(/^Раздел «description\-\d\.[a-z]\.\d+»$/) != -1)
                 //  Если найден любой другой раздел <body> с дескрипшеном (не соответствующий версии и настройкам скрипта)...
                 div.removeNode(true);   //  то удаляем его.
         }


                 ///   Создание <body>


 for (j=0;  j<mChild.length;  j++) {   //  Запускаем цикл для дочерних разделов "fbw_body".
         div = mChild[j];
         if (div.className =="body")    //  Если встретился любой раздел <body>...
                 break;            //  то прерываем цикл.
         }

 bodyD = document.createElement("DIV");   //  Создаём <body> с дескрипшеном, пока состоящим из нового элемента "DIV".
 bodyD.className = "body";       //  Присваиваем bodyD класс "body"
 bodyD.setAttribute("fbname", createCode());   //  и имя.

 if (div.className =="body")   //  Если <body> действительно найден...
         div.insertAdjacentElement("beforeBegin", bodyD)    //  то вставляем bodyD перед найденным разделом.
     else  fbwBody.insertAdjacentElement("beforeEnd", bodyD)    //  если нет - вставляем bodyD в конец раздела "дизайна".

 Elem1 = document.createElement("DIV");   //  Создаём новый элемент "DIV",
 Elem1.className = "title";       //  присваиваем ему класс "title"
 bodyD.insertAdjacentElement("beforeEnd", Elem1);   //  и вставляем его в bodyD.

 Elem2 = document.createElement("P");      //  Создаём новый элемент "P",
 Elem2.innerHTML = inCode("<DESCRIPTION>");       //  заполняем его
 Elem1.insertAdjacentElement("beforeEnd", Elem2);   //  и вставляем его в "title".


         //   Создание раздела для отображения режимов

 Elem1 = document.createElement("DIV");   //  Создаём новый элемент "DIV",
 Elem1.className = "section";       //  присваиваем ему класс "section"
 bodyD.insertAdjacentElement("beforeEnd", Elem1);   //  и вставляем его в bodyD.

 Elem2 = document.createElement("DIV");   //  Создаём новый элемент "DIV",
 Elem2.className = "cite";       //  присваиваем ему класс "цитата"
 Elem1.insertAdjacentElement("beforeEnd", Elem2);   //  и вставляем его в секцию.
 Elem1 = Elem2;   //  Изменяем имя раздела цитаты.

 Elem2 = document.createElement("P");   //  Создаём элемент "P", заполняем его
 if (ShowEmpty == 1)
         Elem2.innerHTML = "Разрешено отображение пустых данных.";
     else  Elem2.innerHTML = "Пустые данные скрыты.";
 Elem1.insertAdjacentElement("beforeEnd", Elem2);   //  и вставляем в цитату.

 if (ShowAuthor !=0) {
         Elem2 = document.createElement("P");   //  Создаём элемент "P", заполняем его
         if (FIO != 0)
                 Elem2.innerHTML = "Имена авторов и переводчиков записываются по форме: Фамилия Имя Отчество.";
             else  Elem2.innerHTML = "Имена авторов и переводчиков записываются по форме: Имя Отчество Фамилия.";
         Elem1.insertAdjacentElement("beforeEnd", Elem2);   //  и вставляем в цитату.
         }

 Elem2 = document.createElement("P");   //  Создаём элемент "P", заполняем его
 if (Sortirovka != 0)
         Elem2.innerHTML = "Списки имён авторов и переводчиков сортируются в алфавитном порядке.";
     else  Elem2.innerHTML = "Сохраняется исходный порядок в списках имён авторов и переводчиков.";
 Elem1.insertAdjacentElement("beforeEnd", Elem2);   //  и вставляем в цитату.

 Elem2 = document.createElement("P");   //  Создаём элемент "P", заполняем его
 if (Delenie != 0)  Elem2.innerHTML = inCode("При импорте в <body>, деление на «Фамилия Имя Отчество» сохраняется.");
     else  Elem2.innerHTML = inCode("При импорте в <body>, деление на «Фамилия Имя Отчество» скрипт будет производить заново.");
 Elem1.insertAdjacentElement("beforeEnd", Elem2);   //  и вставляем в цитату.

 if (ShowAuthorTI != 1  ||  ShowTranslatorTI != 1  ||  ShowSequenceTI != 1  ||  ShowAuthorSTI != 1  ||  ShowTranslatorSTI != 1  ||  ShowSequenceSTI != 1  ||  ShowAuthorDI != 1  ||  ShowSequencePI != 1) {
         Elem2 = document.createElement("P");   //  Создаём элемент "P",
         s = "Скрыты списки:";                    //  создаем текст,
         s2 = "";
         if (ShowAuthorTI != 1)  s2 += " авторы,";
         if (ShowTranslatorTI != 1)  s2 += " переводчики,";
         if (ShowSequenceTI != 1)  s2 += " серии,";
         if (s2 != "")
                 s2 = s2.replace(/,$/, " <title-info>;").replace(/,([^,]+)$/, " и$1");
         s += s2;
         s2 = "";
         if (ShowAuthorSTI != 1)  s2 += " авторы,";
         if (ShowTranslatorSTI != 1)  s2 += " переводчики,";
         if (ShowSequenceSTI != 1)  s2 += " серии,";
         if (s2 != "")
                 s2 = s2.replace(/,$/, " <src-title-info>;").replace(/,([^,]+)$/, " и$1");
         s += s2;
         if (ShowAuthorDI != 1)  s += " авторы <document-info>;";
         if (ShowSequencePI != 1)  s += " серии <publish-info>;";
         s = s.replace(/;$/, ".");
         Elem2.innerHTML = inCode(s);     //  заполняем его
         Elem1.insertAdjacentElement("beforeEnd", Elem2);   //  и вставляем в цитату.
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------

                 ///   ЗАПОЛНЕНИЕ ДАННЫМИ

         //   Создание раздела <title-info>
 AddSection ("<title-info>");   //  Основная секция.
 AddTitle (mDesc.tiTitle.value)   //   Создание строки для  <book-title>.
 if (ShowAuthorTI ==1)
         AddBlock (mDesc.tiAuthor, "Авторы", true);   //   Создание строк для  <author>.
 AddStroka (mDesc.tiKwd.value, "Ключевые слова");   //   Создание строки для  <keywords>.
 if (ShowTranslatorTI ==1)
         AddBlock (mDesc.tiTrans, "Переводчики", false);   //   Создание строк для  <translator>.
 if (ShowSequenceTI ==1)
         AddSequence (mDesc.tiSeq);   //   Создание строк для  <sequence>.
         //   Создание раздела <src-title-info>
 AddSection ("<src-title-info>");   //  Основная секция.
 AddTitle (mDesc.stiTitle.value)   //   Создание строки для  <book-title>.
 if (ShowAuthorSTI ==1)
         AddBlock (mDesc.stiAuthor, "Авторы", true);   //   Создание строк для  <author>.
 AddStroka (mDesc.stiKwd.value, "Ключевые слова");   //   Создание строки для  <keywords>.
 if (ShowTranslatorSTI ==1)
         AddBlock (mDesc.stiTrans, "Переводчики", false);   //   Создание строк для  <translator>.
 if (ShowSequenceSTI ==1)
         AddSequence (mDesc.stiSeq);   //   Создание строк для  <sequence>.

         //   Создание раздела <document-info>
 AddSection ("<document-info>");   //  Основная секция.
  if (ShowAuthorDI ==1)
         AddBlock (mDesc.diAuthor, "Авторы", false);   //   Создание строк для  <author>.
 AddStroka (mDesc.diProgs.value, "Использованы программы");   //   Создание строки для  <program-used>.
 AddStroka (mDesc.diOCR.value, "Source OCR");   //   Создание строки для  <src-ocr>.

         //   Создание раздела <publish-info>
 AddSection ("<publish-info>");   //  Основная секция.
 AddStroka (mDesc.piName.value, "Заголовок книги");   //   Создание строки для  <book-name>.
 AddStroka (mDesc.piPub.value, "Издатель");   //   Создание строки для  <publisher>.
 AddStroka (mDesc.piCity.value, "Город");   //   Создание строки для  <city>.
 AddStroka (mDesc.piYear.value, "Год");   //   Создание строки для  <year>.
 if (ShowSequencePI ==1)
         AddSequence (mDesc.piSeq);   //   Создание строк для  <sequence>.

         //   Создание раздела <custom-info>
 AddSection ("<custom-info>");   //  Основная секция.


         //   Создание строк для <custom-info>

 var customInfoType;
 var customInfo;
 var mCustomInfo=[];

 mDiv = mDesc.ci.getElementsByTagName("DIV");    //  Массив с элементами "DIV", каждый раздел содержит данные одного раздела <custom-info>.
 Length = mDiv.length;      //  Длина массива.

 for (k=0 ; k<Length; k++) {     //  Перебираем все элементы "DIV".

         div = mDiv[k];        //  Текущий элемент.
         customInfoType = div.all.type.value;    //  Получаем тип <custom-info>
         customInfo = div.all.val.innerText;        //  и значение.
         if (ShowEmpty == 1  ||  customInfoType  ||  customInfo)  {   //  Если включено отображение пустых полей, или в "DIV" есть заполненные элементы...
                 Elem1 = document.createElement("DIV");             //  Создаём новый элемент "DIV",
                 Elem1.className = "section";                       //  Присваиваем ему класс "section",
                 mainElem.insertAdjacentElement("afterEnd", Elem1);   //  вставляем его после mainElem.
                 mainElem = Elem1;                //  и переименовываем в mainElem.
                 }
         if (ShowEmpty == 1  ||  customInfoType)  {   //  Если включено отображение пустых полей, или в "DIV" есть заполненный элемент...
                 Elem1 = document.createElement("P");          //  Создаём новый элемент "P",
                 Elem1.innerHTML = "<STRONG>•" + nbspEntity + "Тип:</STRONG>";   //  заполняем его
                 mainElem.insertAdjacentElement("beforeEnd", Elem1);   //  и вставляем в mainElem.
                 Elem1 = document.createElement("P");          //  Создаём новый элемент "P",
                 Elem1.innerHTML = inCode(customInfoType);         //  заполняем его
                 mainElem.insertAdjacentElement("beforeEnd", Elem1);   //  вставляем в mainElem,
                 window.external.inflateBlock(Elem1)=true;                          //  и нормализуем.
                 }
         if (ShowEmpty == 1  ||  customInfo.replace(/^\s+$/, ""))  {   //  Если включено отображение пустых полей, или в "DIV" есть заполненный элемент...
                 Elem1 = document.createElement("P");                                  //  Создаём новый элемент "P",
                 Elem1.innerHTML = "<STRONG>•" + nbspEntity + "Значение:</STRONG>";        //  заполняем его
                 mainElem.insertAdjacentElement("beforeEnd", Elem1);   //  и вставляем в mainElem.

                 customInfo = customInfo.replace(/^\s+|\s+$/g, "");                       //  Удаляем в custom-info начальные и конечные пробельные символы.
                 customInfo = customInfo.replace(/\r\n\s*\r\n/g, "\r\n\r\n");   //  Заменяем ряд пустых строк на одну.
                 customInfo = customInfo + "\r\n";                                                 //  Добавляем конечный разрыв строки (для удобного деления строк).
                 mCustomInfo = customInfo.match(/.*?\r\n/g);           //  Создаем массив из строк custom-info.

                 for (n=0; n<mCustomInfo.length; n++) {       //  Запускаем цикл, в котором перебираем все строки по очереди.
                         Elem1 = document.createElement("P");              //  Для каждой строки создаём новый элемент "P",
                         Elem1.innerHTML = inCode(mCustomInfo[n].replace(/^\s+|\s+$/g, ""));   //  заполняем его,
                         mainElem.insertAdjacentElement("beforeEnd", Elem1);   //  вставляем его в mainElem,
                         window.external.inflateBlock(Elem1)=true;                          //  и нормализуем.
                         }
                 }
         }


// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///   Чистка пустых разделов

 mDiv = bodyD.getElementsByTagName("DIV");

 for (n=mDiv.length-1; n>=0; n--)
         if (mDiv[n].innerText == "")
                 mDiv[n].removeNode(true);

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///   Создание раздела "Пояснение"

 if (Pojasnenie != 0) {

 Elem1 = document.createElement("DIV");   //  Создаём для раздела bodyD новый элемент "DIV",
 Elem1.className = "section";       //  Присваиваем Elem1 класс "section".
 bodyD.insertAdjacentElement("beforeEnd", Elem1);   //  и вставляем его в bodyD.

 Elem2 = document.createElement("DIV");   //  Создаём новый элемент "DIV",
 Elem2.className = "title";       //  присваиваем ему класс "title"
 Elem1.insertAdjacentElement("beforeEnd", Elem2);   //  и вставляем его в Elem1.
 Elem1 = Elem2;   //  Изменяем имя раздела заголовка.

 Elem2 = document.createElement("P");   //  Создаём новый элемент "P",
 Elem2.innerHTML = "= = = = = = = = = = = = = =";   //  заполняем его
 Elem1.insertAdjacentElement("beforeEnd", Elem2);   //  и вставляем его в первый элемент.

 Elem2 = document.createElement("DIV");   //  Создаём новый элемент "DIV",
 Elem2.className = "annotation";       //  присваиваем ему класс "annotation"
 Elem1.insertAdjacentElement("afterEnd", Elem2);   //  и вставляем после Elem1.
 Elem1 = Elem2;   //  Изменяем имя раздела аннотации.

 Elem2 = document.createElement("P");   //  Создаём новый элемент "P",
 Elem2.innerHTML = "Пояснение к скрипту " + ScriptName;   //  заполняем его
 Elem2.className = "subtitle";       //  присваиваем ему класс "subtitle"
 Elem1.insertAdjacentElement("beforeEnd", Elem2);   //  и вставляем его в первый элемент.


 var text=[];   //  Массив для строк "пояснения"
 n=0;

 text[n++]= "Работает скрипт в два этапа. На первом этапе, скрипт импортирует текстовые данные <description> в специальный раздел <body>. Затем скрипт отключается.";
 text[n++]= "Полученный раздел можно редактировать текстовыми скриптами, проверить грамматику, произвести ручную правку, добавить или удалить данные.";
 text[n++]= "При повторном запуске этого скрипта, включается второй этап, во время которого скрипт возвращает измененные данные обратно в <description>.";
 text[n++]= " ";
 text[n++]= "Скрипт никогда не импортирует следующие разделы: «Жанр», «Дата текстом», «Значение даты», «Язык», «Язык оригинала», «Source URLs», «ISBN», «Обложка», «Стили», «Бинарные файлы», «Аннотация», «История».";
 text[n++]= " ";
 text[n++]= "Для расширения функциональности, скрипт имеет несколько режимов работы. Изменить их можно в разделе «Настройки», которой расположен в начале самого скрипта.";
 text[n++]= "Например, чтобы добавить заготовленный список авторов в пустой файл, необходимо включить отображение пустых данных, включить отображение нужного раздела с авторами, и выбрать порядок в имени (ФИО или ИОФ), который подходит для заготовленного списка. Затем после импорта <description>, добавить заготовленный список имён в подходящий раздел и вернуть <description> на место.";
 text[n++]= "При разделении текста имени, скрипт сначала находит фамилию, в которую должно входить одно слово, которое начинается с заглавной буквы, плюс все слова строчными буквами перед ним, затем по тем же принципам находит имя, а весь оставшийся текст скрипт отправляет в отчество. В сложном тексте можно самостоятельно поставить разделители в нужных местах. Для деления на Имя-Фамилия достаточно одного разделителя, во всех остальных случаях — потребуются два.";
 text[n++]= " ";
 text[n++]= "Если настройки, которые влияют на <body>, изменялись во время паузы между этапами, то скрипт сначала заменит недавно созданное <body> на новое.";
 text[n++]= " ";
 text[n++]= "Возможные ошибки:";
 text[n++]= "Для возвращения <description>, скрипт должен найти раздел, который он создавал на первом этапе, и правильно определить разделы.";
 text[n++]= "Основными ориентирами для скрипта служит имя (name) <body> и названия разделов (<title-info>, Серия, Заголовок и т. д.)";
 text[n++]= "Изменение имени <body> может привести к созданию ещё одного <body>.";
 text[n++]= "Изменение названий разделов, приведет к удалению всех данных соответствующего раздела в <description>.";
 text[n++]= " ";
 text[n++]= "Автоматическая обработка:";
 text[n++]= "Автоматическая обработка охватывает более широкий спектр <description>.";
 text[n++]= "В сферу этой обработки включено всё кроме разделов «Обложка», «Стили», «Бинарные файлы», «Аннотация», «История».";
 text[n++]= "В автоматические операции входит замена всех неразрывных пробелов на обычные, замена ряда из нескольких пробелов на один, удаление начальных и конечных пробелов или пробельных символов, замена ряда пустых строк на одну.";
 text[n++]= "Для списков имён авторов и переводчиков удаляются полные дубли имен, а так же можно включить сортировку. Кроме того, имена, которые не разделены на Имя-Отчество-Фамилия, скрипт разделит самостоятельно.";
 text[n++]= "Скрипт может самостоятельно заполнять пустые поля «Дата текстом» и «Значение даты». Но только в том случае, когда есть одно уже заполненное поле, опираясь на которое, скрипт и будет заполнять второе поле. Кроме того, скрипт заменяет шаблонную дату в формате ГГГГ-ММ-ДД в поле «Дата текстом» на более удобную для восприятия.";
 text[n++]= "Если в разделе <title-info> отсутствует «Язык оригинала», скрипт может скопировать недостающее значение из поля «Язык», раздела <src-title-info>. Если же в одном и том же разделе «Язык оригинала» повторяет значение «Язык», то скрипт может удалить это значение (зависит от настроек скрипта).";
 text[n++]= "В случае, когда раздел <src-title-info> заполнен только частично, скрипт может скопировать недостающие значения жанра и языка из раздела <title-info>";
 text[n++]= " ";
 text[n++]= "Скрипт не отображает в статистике, какие именно операции производились, но какие именно значения <description> были изменены, определяет точно.";
 text[n++]= " ";
 text[n++]= "(Отображение этого пояснения можно отключить в разделе настроек)";

 for (n=0; n<text.length; n++) {
         Elem2 = document.createElement("P");   //  Создаём новый элемент "P",
         Elem2.innerHTML = inCode(text[n]);            //  заполняем его,
         window.external.inflateBlock(Elem2)=true;   //  нормализуем
         Elem1.insertAdjacentElement("beforeEnd", Elem2);   //  и вставляем его в первый элемент.
         }

 }

// ---------------------------------------------------------------
 if (Pause != 0) {       //  Если скрипт работает с паузой...
         window.external.EndUndoUnit(document);    // Конец записи в систему отмен.
         GoTo_0(bodyD);    //  Показываем искусственное <body>
         return;          //  и выходим из скрипта.
         }
// ---------------------------------------------------------------

 }                   //  Конец блока для случая, когда <body> с дескрипшеном нет в разделе "Дизайн"...

// ---------------------------------------------------------------
 if (bodyD) {    ///  Если <body> с дескрипшеном присутствует в разделе "Дизайн"...
// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// Функция мини-обработки значений данных

 function Mini(elem) {
         s = elem.value;               //  Получаем значение элемента,
         s = s.replace(/[\s\xA0]+/g, " ");          //  и заменяем любой ряд любых пробельных символов на обычный пробел.
         s = s.replace(/^ +| +$/g, "");   //  удаляем все начальные/конечные пробельные символы
         if (s != elem.value) {      //  Если значение от этого действия изменилось,
                 elem.value = s;    //  то сохраняем новое значение
                 return  true;     //  и сообщаем об этом в результате.
                 }
             else  return  false;   //  Если значение не изменилось - тоже сообщаем.
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// Функция добавления авторов или переводчиков в дескрипшен.

 function AddAuthor (elem, ID) {

 var M=[];   //  Исходный массив.
 var MM=[];   //  Отсортированный массив.
 var R;      //  Количество разделителей.

 var reFIO = new RegExp("^(.*?[А-ЯЁA-Z].*?) (.*?[А-ЯЁA-Z].*?) (.*?[А-ЯЁA-Z].*?)$","g");   //  Разделение на Фамилия-Имя-Отчество.
 var reIOF = new RegExp("^(.*?[А-ЯЁA-Z].*?) (.*?[А-ЯЁA-Z].*) (.*?[А-ЯЁA-Z].*?)$","g");   //  Разделение на Имя-Отчество-Фамилия.
 var reFI = new RegExp("^(.*?[А-ЯЁA-Z].*?) (.*?[А-ЯЁA-Z].*?)$","g");   //  Разделение на Фамилия-Имя.
 var reIF = new RegExp("^(.*?[А-ЯЁA-Z].*) (.*?[А-ЯЁA-Z].*?)$","g");   //  Разделение на Имя-Фамилия.
 //  * В имя и фамилию отправляется минимум текста, в отчество - весь оставшийся текст.

 j = 0;   //  Индекс элемента массива.

 while (ptr.nextSibling) {      //  Перебираем все строки с именами по очереди.
         ptr = ptr.nextSibling;    //  Текущая строка с именем.
         s = ptr.innerText;                   //  Выбираем текст этой строки.
         s = s.replace(new RegExp(nbspEntity,"g"), " ");      //  Заменяем все неразрывные пробелы на обычные,
         s = s.replace(/^\s+|\s+$/g, "");                     //  удаляем все начальные/конечные пробельные символы и
         s = s.replace(/\s+/g, " ");                //  заменяем любой ряд любых пробельных символов на обычный пробел.
         if (s == "")  continue;             //  Если строка оказалась пустой - переходим к следующей строке.
         s2 = s.replace(/(^| ?\| ?)(Ник|Почта|Сайт|ID):.*/g, "");         //  Удаляем первое встреченное ключевое слово, и весь последующий текст.
         R = ("|"+s2).match(/\|/g).length - 1;          //  Считаем разделители.
         if (R > 2) {          //  Если их оказалось больше, чем надо...
                 ptr.innerHTML =  "<FONT style='color: #EEF47C; background-color: #821A1A; font-size: 115%; padding: 0.1em'>"+ptr.innerHTML+"</FONT>";   //  то выделяем строку,
                 GoTo_0(ptr);                  //  и переносим строку под козырёк окна.
                 T_pause -= new Date().getTime();
                 otvet = AskYesNo (" • ОШИБКА \n\n"+
                         " Это имя не будет отправлено в <description> \n"+
                         "         из-за ошибки в записи имени. \n\n"+
                         " (вероятно поставлен лишний разделитель) \n\n"+
                         " ◊ Прервать выполнение скрипта?");              //  Создаем окно вопроса и сохраняем ответ.
                 T_pause += new Date().getTime();
                 ptr.innerHTML =  ptr.innerHTML.replace(/<\/?FONT.*?>/g, "");   //  Снимаем выделение строки.
                 if (otvet == 1)        //  Если выбрано прерывание скрипта...
                         return true;    //  то прерываем функцию "Добавление..." с результатом "истина".
                 continue;          //  Если разрешено продолжение, то переходим к следующей строке.
                 }

         M[j] = [];   //  Добавляем элементу массива второе измерение.

         switch (R) {
             case 0:            //  Случай, когда в имени нет разделителей
                 if (FIO != 0) {            //  Если порядок в имени - Фамилия-Имя-Отчество...
                         if (s2.search(reFIO) != -1) {         //  Пробуем разделить текст на три части, и если это получается...
                                 M[j][0] = s2.replace(reFIO, "$1");   //  делим
                                 M[j][1] = s2.replace(reFIO, "$2");
                                 M[j][2] = s2.replace(reFIO, "$3");
                                 break;        //  и выходим из операции выбора.
                                 }
                         if (s2.search(reFI) != -1) {         //  Пробуем разделить текст на две части, и если это получается...
                                 M[j][0] = s2.replace(reFI, "$1");   //  то заполняем имя и фамилию.
                                 M[j][1] = s2.replace(reFI, "$2");
                                 M[j][2] = "";
                                 break;        //  и выходим из операции выбора.
                                 }
                         M[j][0] = s2;    //  Если имя не делится на две-три части - отправляем весь текст в фамилию.
                         M[j][1] = "";
                         M[j][2] = "";
                         break;        //  и выходим из операции выбора.
                         }
                 if (FIO == 0) {            //  Если порядок в имени - Имя-Отчество-Фамилия...
                         if (s2.search(reIOF) != -1) {         //  Пробуем разделить текст на три части, и если это получается...
                                 M[j][0] = s2.replace(reIOF, "$1");   //  делим
                                 M[j][1] = s2.replace(reIOF, "$2");
                                 M[j][2] = s2.replace(reIOF, "$3");
                                 break;        //  и выходим из операции выбора.
                                 }
                         if (s2.search(reIF) != -1) {         //  Пробуем разделить текст на две части, и если это получается...
                                 M[j][0] = s2.replace(reIF, "$1");   //  то заполняем имя и фамилию.
                                 M[j][1] = "";
                                 M[j][2] = s2.replace(reIF, "$2");
                                 break;        //  и выходим из операции выбора.
                                 }
                         M[j][0] = "";
                         M[j][1] = "";
                         M[j][2] = s2;    //  Если имя не делится на две-три части - отправляем весь текст в фамилию.
                         break;        //  и выходим из операции выбора.
                         }
             case 1:            //  Случай, когда в имени один разделитель
                 if (FIO == 0) {            //  Если порядок в имени - Фамилия-Имя-Отчество...
                         M[j] = ("|"+s2).match(/\|[^\|]*/g);        //  то делим текст по разделителям,
                         M[j][0] = M[j][0].replace(/\| ?| $/g, "");   //  удаляем лишние символы
                         M[j][2] = M[j][1].replace(/\| ?| $/g, "");
                         M[j][1] = "";
                         break;        //  и выходим из операции выбора.
                         }
                 if (FIO != 0) {            //  Если порядок в имени - Имя-Отчество-Фамилия...
                         M[j] = ("|"+s2).match(/\|[^\|]*/g);        //  то делим текст по разделителям,
                         M[j][0] = M[j][0].replace(/\| ?| $/g, "");   //  удаляем лишние символы
                         M[j][1] = M[j][1].replace(/\| ?| $/g, "");
                         M[j][2] = "";
                         break;        //  и выходим из операции выбора.
                         }
             case 2:            //  Случай, когда в имени один разделитель
                 M[j] = ("|"+s2).match(/\|[^\|]*/g);        //  Делим текст по разделителям,
                 M[j][0] = M[j][0].replace(/\| ?| $/g, "");   //  удаляем лишние символы
                 M[j][1] = M[j][1].replace(/\| ?| $/g, "");
                 M[j][2] = M[j][2].replace(/\| ?| $/g, "");
                 break;        //  и выходим из операции выбора.
             }

         if(FIO != 0) {   //  Если выбран порядок, когда сначала идет фамилия, а затем имя и отчество...
                 lastName = M[j][0];   //  то сначала сохраняем фамилию,
                 M[j][0] = M[j][1];   //  затем сдвигаем имя и отчество
                 M[j][1] = M[j][2];
                 M[j][2] = lastName;   //  и делаем фамилию элементом "2" в массиве.
                 }

         M[j][3] = s.replace(/^(.*(^|\| ?)Ник: ?(.*?)( \||\||$).*|.*)$/g, "$3");     //  Извлекаем из текста Ник,
         M[j][4] = s.replace(/^(.*(^|\| ?)Почта: ?(.*?)( \||\||$).*|.*)$/g, "$3");    //  Почту,
         M[j][5] = s.replace(/^(.*(^|\| ?)Сайт: ?(.*?)( \||\||$).*|.*)$/g, "$3");    //  Сайт
         if (ID)  M[j][6] = s.replace(/^(.*(^|\| ?)ID: ?(.*?)( \||\||$).*|.*)$/g, "$3");    //  и если имя может содержать ID, то и его тоже.

         if (! M[j][0]  &&  ! M[j][1]  &&  ! M[j][2]  &&  ! M[j][3]) {    //  Если нет ни одного заполненного поля в ФИО+ник...
                 M.pop();      //  то удаляем все данные этого имени из массива.
                 }
             else  j++;   //  Если же всё нормально - увеличиваем индекс элемента массива.
         }


 var Length2 = M.length;   //  Длина массива с именами.

 var mFION = [" ", "№"];   //  Вспомогательный массив (для сортировки).
 var fion = "";             //  Специальный текст, необходимый для правильной сортировки.
 var k1=0;                  //  Индекс первого элемента в фрагменте массива.
 var k2=0;                  //  Индекс последнего элемента в фрагменте массива.
 var k_Midi=0;         //  Индекс для среднего элемента в фрагменте массива.

 aaa:     // метка
 for (j=0 ; j<Length2; j++) {                 //   Цикл для всех имен.
         fion = ("Ф " + M[j][2] + " " + M[j][0] +  " " + M[j][1] +  " " + M[j][3]).toUpperCase().replace(/Ё/g, "Е№").replace(/[′`´ʼ΄‘’]/g, "'");   //  Сборка специального текста.
         if (ID)  fion += " " + M[j][6];    //  Если в строке с именем может быть идентификационный номер - добавляем в специальный текст и его.
         k1=0;                                      //  Исходное значение  для начала фрагмента.
         k2=mFION.length-1;        //  Исходное значение  для конца фрагмента.
         while (k2-k1 != 1) {                                        //  Цикл, который будет выполняться, пока фрагмент массива не будет состоять из двух элементов.
                 k_Midi = Math.floor((k2+k1)/2);          //  Получение индекса среднего элемента  внутри фрагмента.
                 if (fion == mFION[k_Midi]) {     //  Если проверяемый текст уже есть в сортированном массиве...
                         M.splice(j, 1);         //   то удаляем дубль имени из исходного массива,
                         j--;                      //  корректируем индекс элемента,
                         Length2--;            //  а так же длину исходного массива,
                         continue aaa;       //  и переходим к следующему слову.
                         }
                 if (fion > mFION[k_Midi])    //  Если слово больше среднего элемента...
                         k1=k_Midi;                                //   сдвигаем начало фрагмента на место среднего элемента,
                     else  k2=k_Midi;                          //  а если нет - сдвигаем конец фрагмента.
                 }                                                     //  После того, как фрагмент уменьшился до двух элементов...
         mFION.splice(k2, 0, fion);                            //  добавляем между этими элементами проверяемый текст
         MM.splice(k2-1, 0, M[j]);   //  и синхронно добавляем данные имени в сорированный массив с именами.
         }

 if(Sortirovka != 0)       //  Если разрешена сортировка имен...
         M = MM;   //  то заменяем исходный список авторов на отсортированный.

 if (Length2 == 0) {    //  Если массив с именами пустой...
         M[0] = [];           //  то добавляем второе измерение для первого элемента массива,
         M[0][0] = "";     //  заполняем его пустыми значениями
         M[0][1] = "";
         M[0][2] = "";
         M[0][3] = "";
         M[0][4] = "";
         M[0][5] = "";
         if (ID)  M[0][6] = "";
         Length2 = 1;     //  и записываем полученную длину массива.
         }

 ex = elem.innerHTML;    //  сохраняем исходный текст структуры в дескрипшен,

 div = elem.firstChild;         //  Находим первый элемент в разделе авторов.
 while (div.nextSibling.nodeName != "DIV")    //  Находим раздел перед первым "DIV".
         div = div.nextSibling;

 for (j=0 ; j<Length2; j++) {     //  Перебираем все элементы массива.
         if (!div.nextSibling)                     //  Проверяем наличие отсутствия следующего раздела, и если нет его...
                 div.insertAdjacentElement("afterEnd", div.cloneNode(true));   //  и добавляем копию раздела "DIV".

         div = div.nextSibling;        //  Текущий элемент "DIV".
         div.all.first.value = M[j][0];      //  Заполняем этот элемент новыми данными
         div.all.middle.value = M[j][1];
         div.all.last.value = M[j][2];
         div.all.nick.value = M[j][3];
         div.all.email.value = M[j][4];
         div.all.home.value = M[j][5];
         if (ID  &&  div.all.id.value != M[j][6])  div.all.id.value = M[j][6];   // если ID может быть в строке, и исходное значение отличается от нового - то заполняется и ID.
         }    //  * делается это из-за того, что в ID замена "пусто" на "пусто" изменяет форму записи в "DIV", а этого не должно быть.

 while (div.nextSibling  &&  div.nextSibling.nodeName == "DIV")   //  Удаляем все неиспользованные разделы "DIV".
         div.nextSibling.removeNode(true);

 PutSpacers(elem);    //  Делаем правильное оформление разделов в дескрипшен.

 return false;    //  Возвращаем результат "Ложь" (т.е. работа скрипта не была прервана пользователем).
 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// Функция независимой обработки авторов или переводчиков в дескрипшене.

 function HandelAuthor (elem, ID) {


 var M=[];   //  Исходный массив.
 var MM=[];   //  Отсортированный массив.

 var mDiv = elem.getElementsByTagName("DIV");    //  Массив с элементами "DIV", каждый раздел содержит данные одного имени.
 var Length = mDiv.length;      //  Длина массива.

 for (k=0 ; k<Length; k++) {     //  Перебираем все элементы "DIV".
         div = mDiv[k];        //  Текущий элемент.
         M[k] = [];     //  Добавляем второе измерение для массива.
         M[k][0] = div.all.first.value.replace(/[\s\xA0]+/g, " ").replace(/^ +| +$/g, "");    //  Заполняем массив данными очередного имени.
         M[k][1] = div.all.middle.value.replace(/[\s\xA0]+/g, " ").replace(/^ +| +$/g, "");
         M[k][2] = div.all.last.value.replace(/[\s\xA0]+/g, " ").replace(/^ +| +$/g, "");
         M[k][3] = div.all.nick.value.replace(/[\s\xA0]+/g, " ").replace(/^ +| +$/g, "");
         M[k][4] = div.all.email.value.replace(/[\s\xA0]+/g, " ").replace(/^ +| +$/g, "");
         M[k][5] = div.all.home.value.replace(/[\s\xA0]+/g, " ").replace(/^ +| +$/g, "");
         if (ID)  M[k][6] = div.all.id.value.replace(/[\s\xA0]+/g, " ").replace(/^ +| +$/g, "");
         if (! M[k][0]  &&  ! M[k][1]  &&  ! M[k][2]  &&  ! M[k][3]) {    //  Если нет ни одного заполненного поля в ФИО+ник...
                 M.pop();      //  то удаляем все данные этого имени из массива.
                 }
         }

 Length = M.length;   //  Длина массива с именами.

 var mFION = [" ", "№"];   //  Вспомогательный массив (для сортировки).
 var fion = "";             //  Специальный текст, необходимый для правильной сортировки.
 var k1=0;                  //  Индекс первого элемента в фрагменте массива.
 var k2=0;                  //  Индекс последнего элемента в фрагменте массива.
 var k_Midi=0;         //  Индекс для среднего элемента в фрагменте массива.

 aaa:     // метка
 for (j=0 ; j<Length; j++) {                 //   Цикл для всех имен.
         fion = ("Ф " + M[j][2] + " " + M[j][0] +  " " + M[j][1] +  " " + M[j][3]).toUpperCase().replace(/Ё/g, "Е№").replace(/[′`´ʼ΄‘’]/g, "'");   //  Сборка специального текста.
         if (ID)  fion += " " + M[j][6];    //  Если в строке с именем может быть идентификационный номер - добавляем в специальный текст и его.
         k1=0;                                      //  Исходное значение  для начала фрагмента.
         k2=mFION.length-1;        //  Исходное значение  для конца фрагмента.
         while (k2-k1 != 1) {                                        //  Цикл, который будет выполняться, пока фрагмент массива не будет состоять из двух элементов.
                 k_Midi = Math.floor((k2+k1)/2);          //  Получение индекса среднего элемента  внутри фрагмента.
                 if (fion == mFION[k_Midi]) {     //  Если проверяемый текст уже есть в сортированном массиве...
                         M.splice(j, 1);         //   то удаляем дубль имени из исходного массива,
                         j--;                      //  корректируем индекс элемента,
                         Length--;            //  а так же длину исходного массива,
                         continue aaa;       //  и переходим к следующему слову.
                         }
                 if (fion > mFION[k_Midi])    //  Если слово больше среднего элемента...
                         k1=k_Midi;                                //   сдвигаем начало фрагмента на место среднего элемента,
                     else  k2=k_Midi;                          //  а если нет - сдвигаем конец фрагмента.
                 }                                                     //  После того, как фрагмент уменьшился до двух элементов...
         mFION.splice(k2, 0, fion);                            //  добавляем между этими элементами проверяемый текст
         MM.splice(k2-1, 0, M[j]);   //  и синхронно добавляем данные имени в сортированный массив с именами.
         }

 if(Sortirovka != 0)       //  Если разрешена сортировка имен...
         M = MM;   //  то заменяем исходный список авторов на отсортированный.

 if (Length == 0) {    //  Если массив с именами пустой...
         M[0] = [];           //  то добавляем второе измерение для первого элемента массива,
         M[0][0] = "";     //  заполняем его пустыми значениями
         M[0][1] = "";
         M[0][2] = "";
         M[0][3] = "";
         M[0][4] = "";
         M[0][5] = "";
         if (ID)  M[0][6] = "";
         Length = 1;     //  и записываем полученную длину массива.
         }

 ex = elem.innerHTML;    //  Сохраняем исходный текст структуры в дескрипшен.

 div = elem.firstChild;         //  Находим первый элемент в разделе авторов.
 while (div.nextSibling.nodeName != "DIV")    //  Находим раздел перед первым "DIV".
         div = div.nextSibling;

 for (j=0 ; j<Length; j++) {     //  Перебираем все элементы массива.
         if (!div.nextSibling)                     //  Проверяем наличие отсутствия следующего раздела, и если нет его...
                 div.insertAdjacentElement("afterEnd", div.cloneNode(true));   //  и добавляем копию раздела "DIV".

         div = div.nextSibling;        //  Текущий элемент "DIV".
         div.all.first.value = M[j][0];      //  Заполняем этот элемент новыми данными
         div.all.middle.value = M[j][1];
         div.all.last.value = M[j][2];
         div.all.nick.value = M[j][3];
         div.all.email.value = M[j][4];
         div.all.home.value = M[j][5];
         if (ID  &&  div.all.id.value != M[j][6])  div.all.id.value = M[j][6];   // если ID может быть в строке, и исходное значение отличается от нового - то заполняется и ID.
         }    //  * делается это из-за того, что в ID замена "пусто" на "пусто" изменяет форму записи в "DIV", а этого не должно быть.

 while (div.nextSibling  &&  div.nextSibling.nodeName == "DIV")   //  Удаляем все неиспользованные разделы "DIV".
         div.nextSibling.removeNode(true);

 PutSpacers(elem);    //  Делаем правильное оформление разделов в дескрипшен.

 return (ex != elem.innerHTML);   //  Возвращаем индикацию изменения дескрипшена.
 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// Функция очистки имен авторов или переводчиков в дескрипшен.

 function DelAuthor (elem, ID) {

         ex = elem.innerHTML;    //  Сохраняем исходный текст структуры в дескрипшен.

         div = elem.firstChild;         //  Находим первый элемент в разделе.
         while (div.nodeName != "DIV")    //  Находим первый раздел "DIV".
                 div = div.nextSibling;

         div.all.first.value = "";           //  и очищаем все значения.
         div.all.middle.value = "";
         div.all.last.value = "";
         div.all.nick.value = "";
         div.all.email.value = "";
         div.all.home.value = "";
         if (ID  &&  div.all.id.value != "")  div.all.id.value = "";

         while (div.nextSibling  &&  div.nextSibling.nodeName == "DIV")   //  Удаляем все остальные разделы "DIV".
                 div.nextSibling.removeNode(true);

         PutSpacers(elem);    //  Делаем правильное оформление разделов в дескрипшен.

         return  (ex != elem.innerHTML);   //  Возвращаем индикацию изменения дескрипшена.

         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// Функция добавления структуры серий в дескрипшен.

function AddSeq(elem, b) {

 ex = elem.innerHTML;    //  Сохраняем исходное значение данных в дескрипшен.
 mDiv = elem.getElementsByTagName("DIV");   //  Находим все разделы "DIV".
 for (j=mDiv.length-1; j>0; j--)                        //  И удаляем их все, кроме самого первого раздела.
         mDiv[j].removeNode(true);
 var divSeq = mDiv[0];                 //  Выбираем оставшийся раздел.
 divSeq.all.name.value = "";    //  Удаляем название
 divSeq.all.number.value = "";    //  и номер.
 divSeq.all.del.disabled = true;   //  Гасим кнопку удаления.


 if (b) {

         var newDivSeq = divSeq.cloneNode(true);   //  Сохраняем клон "DIV".
         var First = true;                    //  Отмечаем, что первый раздел "DIV" ещё не пройден.

         while (seq.parentNode != mainElem)   //  Поднимаемся до первой секции серий (в боди).
                 seq = seq.parentNode;

         divSeq = elem;   //  Переходим на корневой раздел секций (в дескрипшене).

        aaa:   //  Метка.
         while (true) {       //  Запускаем бесконечный цикл, который может прерваться только внутренней командой.
                 if (seq.nodeName =="DIV"  &&  seq.className == "section") {    //  Если текущей элемент в структуре боди - секция...
                         seq=seq.firstChild;                                           //  то переходим на первый дочерний элемент этого раздела  (в боди)
                         if (seq.nodeName =="DIV"  &&  seq.className == "section") {    //  и если это тоже секция...
                                 if (!First) {     //  проверяем, пройден ли первый раздел "DIV" (в дескрипшен), и если он пройден...
                                         divSeq.insertAdjacentElement("beforeEnd", newDivSeq.cloneNode(true));   //  добавляем внутрь текущего раздела, клон "DIV"
                                         PutSpacers(divSeq);                                 //  и корректируем оформление.
                                         }
                                 First = false;    //  отмечаем, что первый раздел "DIV" пройден.
                                 }
                         divSeq = divSeq.lastChild;   // Переходим на последний дочерний элемент (в дескрипшен).
                         }
                     else {      //  Если текущий элемент в боди - это не секция...
                             while (seq.nextSibling==null)  {    //  то пока не откроется проход на соседний элемент
                                     seq=seq.parentNode;                  //  поднимаемся в структуре искусственного <body>
                                     divSeq = divSeq.parentNode;     //  и одновременно по структуре дескрипшена.
                                     if (seq == mainElem) break aaa;   //  А если оказываемся в корневом разделе для серий, то выходим из основного цикла.
                                     }
                             seq=seq.nextSibling;   //  Затем переходим на следующий соседний элемент боди.
                             }

                 if (seq.nodeName=="DIV"  &&  seq.className == "title") {    //  Если в структуре искусственного <body> встретился заголовок...
                         if (!First) {     //  проверяем, пройден ли первый раздел "DIV" (в дескрипшен), и если он пройден...
                                 divSeq.insertAdjacentElement("afterEnd", newDivSeq.cloneNode(true));   //  то вставляем после текущего раздела, клон "DIV"
                                 divSeq = divSeq.nextSibling;                   //  переименовываем его в divSeq
                                 PutSpacers(divSeq.parentNode);     //  и корректируем оформление.
                                 }
                         First = false;    //  отмечаем, что первый раздел "DIV" пройден.

                         s = seq.innerText;    //  Выбираем весь текст заголовка,
                         s = s.replace(new RegExp(nbspEntity,"g"), " ");   //  заменяем все неразрывные пробелы на обычные.
                         if (s.search(/• Серия:/)!=-1)  {    //  Если в тексте есть ключевое слово "Серия"...
                                 s2=s.replace(/^(.|\s)*?• Серия:/, "");                //  удаляем всё до ключевого слова,
                                 s2 = s2.replace(/• Номер:(.|\s)*/, "");    //  удаляем номер и всё что после него,
                                 s2 = s2.replace(/^\s+|\s+$/g, "");   //  удаляем все начальные/конечные пробельные символы,
                                 s2 = s2.replace(/\s+/g, " ");               //  заменяем любой ряд любых пробельных символов на обычный пробел,
                                 divSeq.children.name.value = s2;   //  вставляем новые данные в раздел "DIV" дескрипшена.
                                 }
                         if (s.search(/• Номер:/)!=-1)  {    //  Если в тексте есть ключевое слово "Номер"...
                                 s2=s.replace(/^(.|\s)*?• Номер:/, "");                //  удаляем всё до ключевого слова,
                                 s2 = s2.replace(/• Серия:(.|\s)*/, "");    //  удаляем серию и всё что после неё,
                                 s2 = s2.replace(/^\s+|\s+$/g, "");      //  удаляем все начальные/конечные пробельные символы,
                                 s2 = s2.replace(/\s+/g, " ");                    //  заменяем любой ряд любых пробельных символов на обычный пробел,
                                 divSeq.children.number.value = s2;     //  вставляем новые данные в раздел "DIV" дескрипшена.
                                 }
                         }
                 }
         }

 return (ex != elem.innerHTML);   //  Возвращаем индикацию изменения дескрипшена.

 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// Функция независимой обработки серий

function HadelSeq(elem) {

 ex = elem.innerHTML;    //  Сохраняем исходное значение данных в дескрипшен.

 mDiv = elem.getElementsByTagName("DIV");    //  Массив с элементами "DIV", каждый раздел содержит данные одного имени.
 Length = mDiv.length;      //  Длина массива.

 for (k=0 ; k<Length; k++) {     //  Перебираем все элементы "DIV".
         div = mDiv[k];        //  Текущий элемент.
         div.children.name.value = div.children.name.value.replace(/[\s\xA0]+/g, " ").replace(/^ +| +$/g, "");
         div.children.number.value = div.children.number.value.replace(/[\s\xA0]+/g, " ").replace(/^ +| +$/g, "");
         }

 return (ex != elem.innerHTML);   //  Возвращаем индикацию изменения дескрипшена.
 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// Функция добавления "значения даты" из "даты"

function AddDateVal(elem1, elem2) {

 var d1 = elem1.value;   //  Сохраняем значение поля "Дата".
 var d2 = elem2.value;   //  Сохраняем значение поля "Значение даты".
 var Month;                   //  Месяц.
 var reDate01 = new RegExp("^([0-9]{1,2})([\\\-\\\./])([0-9]{2})(\\2)([0-9]{4})$","");   //  Формат "Д/ММ/ГГГГ" и похожие.
 var reDate02 = new RegExp("^([0-9]{4}) ?(г\\\.?|года?)?$","");                                                    //  Формат "ГГГГ" и похожие.
 var reDate03 = new RegExp("^([0-9]{4})([\\\-\\\./])([0-9]{2})(\\2)([0-9]{2})$","");      //  Формат "ГГГГ/ММ/ДД" и похожие.
 var reDate04 = new RegExp("^([0-9]{1,2}) (янв|фев|мар|апр|ма[йя]|июн|июл|авг|сен|окт|ноя|дек)[а-я]*\\\.? ([0-9]{4}) ?(г\\\.?|года?)?$","");   //  Формат "Д/МММ/ГГГГ" и похожие.

 if (d1 !=""  &&  d2 =="") {       //  Если значение "Дата" заполнено, а значение "Значение даты" пусто...
         if (d1.search(reDate01) != -1  &&  +d1.replace(reDate01, "$1") <= 31  &&  +d1.replace(reDate01, "$3") <= 12  &&  +d1.replace(reDate01, "$5") <= 2100) {
                         //  Если дата записана в формате "Д/ММ/ГГГГ"...
                 elem2.value = d1.replace(reDate01, "$5") + "-" + d1.replace(reDate01, "$3") + "-" + ("0"+d1.replace(reDate01, "$1")).replace(/.(..$)/, "$1");
                         //  то преобразуем дату, отправляем её в поле "Значение даты"
                 return true;          //  и выходим из функции с отметкой об изменении.
                 }
         if (d1.search(reDate02) != -1  &&  +d1.replace(reDate02, "$1") <= 2100) {    //  Если дата записана в формате "ГГГГ"...
                 elem2.value = d1.replace(reDate02, "$1") + "-01-01";       //  то преобразуем дату, отправляем её в поле "Значение даты"
                 return true;            //  и выходим из функции с отметкой об изменении.
                 }
         if (d1.search(reDate03) != -1  &&  +d1.replace(reDate03, "$1") <= 2100  &&  +d1.replace(reDate03, "$3") <= 12  &&  +d1.replace(reDate03, "$5") <= 31) {
                         //  Если дата записана в формате "ГГГГ/ММ/ДД"...
                 elem2.value = d1.replace(reDate03, "$1") + "-" + d1.replace(reDate03, "$3") + "-" + d1.replace(reDate03, "$5");
                         //  то преобразуем дату, отправляем её в поле "Значение даты"
                 return true;            //  и выходим из функции с отметкой об изменении.
                 }
         if (d1.search(reDate04) != -1  &&  +d1.replace(reDate04, "$1") <= 31  &&  +d1.replace(reDate04, "$3") <= 2100) {//  Если дата записана в формате "Д/МММ/ГГГГ"...
                 switch (d1.replace(reDate04, "$2")) {      //  то определяем номер месяца,
                         case "янв":  Month = "01";  break;
                         case "фев":  Month = "02";  break;
                         case "мар":  Month = "03";  break;
                         case "апр":  Month = "04";  break;
                         case "май":
                         case "мая":  Month = "05";  break;
                         case "июн":  Month = "06";  break;
                         case "июл":  Month = "07";  break;
                         case "авг":  Month = "08";  break;
                         case "сен":  Month = "09";  break;
                         case "окт":  Month = "10";  break;
                         case "ноя":  Month = "11";  break;
                         case "дек":  Month = "12";  break;
                         }
                 elem2.value = d1.replace(reDate04, "$3") + "-" + Month + "-" + ("0"+d1.replace(reDate04, "$1")).replace(/.(..$)/, "$1");
                         //  преобразуем дату, отправляем её в поле "Значение даты"
                 return true;            //  и выходим из функции с отметкой об изменении.
                 }
         }
 return false;   //  Если не получилось изменить "Значение даты", то выходим из цикла с соответствующей отметкой.
 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// Функция добавления "даты" из "значения даты"

function AddDate(elem1, elem2) {

 var d1 = elem1.value;   //  Сохраняем значение поля "Значение даты".
 var d2 = elem2.value;   //  Сохраняем значение поля "Дата".
 var Month;                   //  Месяц.
 var reDate03 = new RegExp("^([0-9]{4})\\\-([0-9]{2})\\\-([0-9]{2})$","");      //  Формат "ГГГГ-ММ-ДД"

 if (d1 !=""  &&  d2 ==""  &&  d1.search(reDate03) != -1  &&  +d1.replace(reDate03, "$1") <= 2100  &&  +d1.replace(reDate03, "$2") <= 12  &&  +d1.replace(reDate03, "$3") <= 31) {
         //   Если значение "Дата" пусто, а значение "Значение даты" заполнено форматом "ГГГГ-ММ-ДД"...
         switch (+d1.replace(reDate03, "$2")) {      //  то определяем название месяца,
                 case 1:  Month = "января";  break;
                 case 2:  Month = "февраля";  break;
                 case 3:  Month = "марта";  break;
                 case 4:  Month = "апреля";  break;
                 case 5:  Month = "мая";  break;
                 case 6:  Month = "июня";  break;
                 case 7:  Month = "июля";  break;
                 case 8:  Month = "августа";  break;
                 case 9:  Month = "сентября";  break;
                 case 10:  Month = "октября";  break;
                 case 11:  Month = "ноября";  break;
                 case 12:  Month = "декабря";  break;
                 }
         elem2.value = d1.replace(reDate03, "$3").replace(/^0/, "") + " " + Month + " " + d1.replace(reDate03, "$1");   //  преобразуем дату, отправляем её в поле "Дата"
         return true;            //  и выходим из функции с отметкой об изменении.
         }
 return false;   //  Если не получилось изменить поле "Дата", то выходим из цикла с соответствующей отметкой.
 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// Функция изменения шаблонной "даты" на текстовую

function ChangeDate(elem) {

 var d1 = elem.value;   //  Сохраняем значение поля "Дата".
 var Month;                   //  Месяц.
 var reDate03 = new RegExp("^([0-9]{4})\\\-([0-9]{2})\\\-([0-9]{2})$","");      //  Формат "ГГГГ-ММ-ДД"

 if (d1 !=""  &&  d1.search(reDate03) != -1  &&  +d1.replace(reDate03, "$1") <= 2100  &&  +d1.replace(reDate03, "$2") <= 12  &&  +d1.replace(reDate03, "$3") <= 31) {
         //   Если значение "Дата" заполнено форматом "ГГГГ-ММ-ДД"...
         switch (+d1.replace(reDate03, "$2")) {      //  то определяем название месяца,
                 case 1:  Month = "января";  break;
                 case 2:  Month = "февраля";  break;
                 case 3:  Month = "марта";  break;
                 case 4:  Month = "апреля";  break;
                 case 5:  Month = "мая";  break;
                 case 6:  Month = "июня";  break;
                 case 7:  Month = "июля";  break;
                 case 8:  Month = "августа";  break;
                 case 9:  Month = "сентября";  break;
                 case 10:  Month = "октября";  break;
                 case 11:  Month = "ноября";  break;
                 case 12:  Month = "декабря";  break;
                 }
         elem.value = d1.replace(reDate03, "$3").replace(/^0/, "") + " " + Month + " " + d1.replace(reDate03, "$1");   //  преобразуем дату, возвращаем её в поле "Дата"
         return true;            //  и выходим из функции с отметкой об изменении.
         }
 return false;   //  Если не получилось изменить поле "Дата", то выходим из цикла с соответствующей отметкой.
 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///   Напоминание

 if (Pause !=0  &&  Napominanie !=0  &&  fbwBody.style.display == "block") {    //  Если скрипт работает с паузой, и включено напоминание, и действует режим "Дизайн"...
         T_pause -= new Date().getTime();
         otvet = AskYesNo (napominanieText);              //  Создаем окно вопроса и сохраняем ответ.
         T_pause += new Date().getTime();
         if (!otvet)     //  Если выбран отказ от продолжения...
                 return;      //  выходим из скрипта.
         }

// ---------------------------------------------------------------
 if (Pause != 0)       //  Если скрипт работает с паузой...
         window.external.BeginUndoUnit(document, ScriptName + ": Перезапись");    // Начало записи в систему отмен.
// ---------------------------------------------------------------
 Block1: for (var B1=true; B1; B1=false) {    //  Начало блока "Block1" записи в дескрипшен.
// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


 var mP=[];   //  Массив для параграфов.
 var ptr;  //  Параграф.
 var ex;   //  Экс-значение данных в дескрипшен.


                 ///   Запись данных в <title-info>

 mDiv = bodyD.getElementsByTagName("DIV");    //  Массив с элементами "DIV".
 Length = mDiv.length;      //  Длина массива.

 for (k=0 ; k<Length; k++) {     //  Перебираем все элементы "DIV" в bodyD.
         div = mDiv[k];        //  Текущий элемент.
         if (div.className == "title"  &&  div.children.length == 1  &&  div.firstChild.innerText == "===<title-info>===") {   //  Если найден заголовок раздела...
                 mainElem = div.parentNode;     //  то сохраняем раздел
                 break;      //  и прерываем цикл.
                 }
         }

         //  Индикаторы изменений
 var change_T01=false;   //  Жанры
 var change_T02=false;   //  Авторы
 var change_T03=false;   //  Название
 var change_T04=false;   //  Ключевые слова
 var change_T05=false;   //  Дата
 var change_T06=false;   //  Значение даты
 var change_T07=false;   //  Язык
 var change_T08=false;   //  Язык оригинала
 var change_T09=false;   //  Переводчики
 var change_T10=false;   //  Серия

         //  Индикаторы обнаружения
 var search_T02=false;
 var search_T03=false;
 var search_T04=false;
 var search_T09=false;
 var search_T10=false;

 if (k != Length) {          //  Если в тексте обнаружен раздел <title-info>...

         mP = div.parentNode.getElementsByTagName("P");   //  Создаем массив из строк этого раздела.

         for (n=0; n<mP.length; n++) {     //  Цикл для перебора всех строк.
                 ptr = mP[n];       //  Текущая строка.
                 s = ptr.innerText;   //  Текст в строке.
                 s = s.replace(new RegExp(nbspEntity,"g"), " ");      //  заменяем все неразрывные пробелы на обычные.


                 //  Название

                 if (!search_T03  &&  s.search(/^\s*?• Название:/) != -1  &&  ptr.parentNode.className == "title") {
                 //  Если ещё не найден раздел с названием, и текущая строка в искомом разделе...
                         search_T03=true;                                        //  то отмечаем это,
                         s = ptr.parentNode.innerText;    //  выбираем весь текст раздела,
                         s = s.replace(new RegExp(nbspEntity,"g"), " ");      //  заменяем все неразрывные пробелы на обычные,
                         s = s.replace(/^(.|\s)*?• Название:/, "");    //  удаляем всё до ключевого слова,
                         s = s.replace(/^\s+|\s+$/g, "");      //  удаляем все начальные/конечные пробельные символы,
                         s = s.replace(/\s+/g, " ");    //  заменяем любой ряд любых пробельных символов на обычный пробел,
                         ex = mDesc.tiTitle.value;    //  сохраняем исходное значение данных в дескрипшен,
                         mDesc.tiTitle.value = s;     //  вставляем новые данные,
                         if (ex != mDesc.tiTitle.value)   //  и если данные от этого действия изменились,
                                 change_T03=true;     //  то отмечаем это.
                         continue;    //  Затем переходим к следующей строке.
                         }


                 //  Авторы

                 if (!search_T02  &&  s.search(/^\s*?• Авторы:/) != -1  &&  ptr.parentNode.className == "section") {
                 //  Если ещё не найден раздел с авторами, и текущая строка в искомом разделе...
                         search_T02=true;    //  то отмечаем это,
                         if (AddAuthor (mDesc.tiAuthor, true))   //  запускаем функцию добавления имен, и если в функции было выбрано прерывание скрипта...
                                 break Block1;                                           //  то останавливаем работу скрипта.
                         if (ex != mDesc.tiAuthor.innerHTML)    //  Если данные от этого действия изменились,
                                 change_T02=true;     //  то отмечаем это.
                         continue;               //  Затем переходим к следующей строке.
                         }


                 //  Ключевые слова

                 if (!search_T04  &&  s.search(/^\s*?• Ключевые слова:/) != -1  &&  ptr.parentNode.className == "section") {
                 //  Если ещё не найден раздел с ключевыми словами, и текущая строка в искомом разделе...
                         search_T04=true;                                        //  то отмечаем это,
                         s = ptr.parentNode.innerText;    //  выбираем весь текст раздела,
                         s = s.replace(new RegExp(nbspEntity,"g"), " ");      //  заменяем все неразрывные пробелы на обычные,
                         s = s.replace(/^(.|\s)*?• Ключевые слова:/, "");    //  удаляем всё до ключевого слова,
                         s = s.replace(/^\s+|\s+$/g, "");      //  удаляем все начальные/конечные пробельные символы,
                         s = s.replace(/\s+/g, " ");    //  заменяем любой ряд любых пробельных символов на обычный пробел,
                         ex = mDesc.tiKwd.value;    //  сохраняем исходное значение данных в дескрипшен,
                         mDesc.tiKwd.value = s;     //  вставляем новые данные,
                         if (ex != mDesc.tiKwd.value)   //  и если данные от этого действия изменились,
                                 change_T04=true;     //  то отмечаем это.
                         continue;    //  Затем переходим к следующей строке.
                         }


                 //  Переводчики

                 if (!search_T09  &&  s.search(/^\s*?• Переводчики:/) != -1  &&  ptr.parentNode.className == "section") {
                 //  Если ещё не найден раздел с переводчиками, и текущая строка в искомом разделе...
                         search_T09=true;    //  то отмечаем это,
                         if (AddAuthor (mDesc.tiTrans, false))   //  запускаем функцию добавления имен, и если в функции было выбрано прерывание скрипта...
                                 break Block1;                                           //  то останавливаем работу скрипта.
                         if (ex != mDesc.tiTrans.innerHTML)    //  Если данные от этого действия изменились,
                                 change_T09=true;     //  то отмечаем это.
                         continue;               //  Затем переходим к следующей строке.
                         }


                 //  Серии (поиск)

                 if (!search_T10  &&  s.search(/^\s*?• (Серия|Номер):/) != -1  &&  ptr.parentNode.className == "title") {
                 //  Если ещё не найден раздел с переводчиками, и текущая строка в искомом разделе...
                         search_T10=true;    //  то отмечаем это
                         var seq=ptr;        //  и сохраняем найденный параграф.
                         }

                 }

         }


 //  Очистка названия
 if (!search_T03  &&  mDesc.tiTitle.value != "") {    //  Если раздел с названием не был найден в <title-info>, но заполненное значение есть в дескрипшене...
         mDesc.tiTitle.value = "";      //  то удаляем это название
         change_T03=true;         //  и отмечаем это.
         }

 //  Очистка имен авторов
 if (ShowAuthorTI ==1  &&  !search_T02) {    //  Если раздел с авторами разрешен для показа, но не был найден в <title-info>...
         if (DelAuthor (mDesc.tiAuthor, true))   //  то запускаем функцию удаления имен авторов, и если дескрипшен изменился...
                 change_T02=true;     //  то отмечаем это.
         }

 //  Очистка ключевых слов
 if (!search_T04  &&  mDesc.tiKwd.value != "") {    //  Если раздел с ключевыми словами не был найден в <title-info>, но заполненное значение есть в дескрипшене...
         mDesc.tiKwd.value = "";      //  то удаляем это значение
         change_T04=true;         //  и отмечаем это.
         }

 //  Очистка имен переводчиков
 if (ShowTranslatorTI ==1  &&  !search_T09) {    //  Если раздел с авторами разрешен для показа, но не был найден в <title-info>...
         if (DelAuthor (mDesc.tiTrans, false))   //  то запускаем функцию удаления имен авторов, и если дескрипшен изменился...
                 change_T09=true;     //  то отмечаем это.
         }

 //  Серии (обработка)
 if (ShowSequenceTI ==1)   //  Если разрешен показ серий...
         if (AddSeq(mDesc.tiSeq, search_T10))   //  Запускаем функцию для обработки серий, и если дескрипшен изменился...
                 change_T10=true;     //  то отмечаем это.



                 //  Мини-обработка оставшихся полей <title-info>

         // Авторы (независимая обработка)
 if (ShowAuthorTI !=1) {    //  Если раздел с авторами не разрешен для показа...
         if (HandelAuthor(mDesc.tiAuthor, true))   //  то запускаем функцию независимой обработки авторов или переводчиков, и если дескрипшен изменился...
                 change_T02=true;     //  то отмечаем это.
                 }

         // Переводчики (независимая обработка)
 if (ShowTranslatorTI !=1) {    //  Если раздел с переводчиками не разрешен для показа...
         if (HandelAuthor(mDesc.tiTrans, false))   //  то запускаем функцию независимой обработки авторов или переводчиков, и если дескрипшен изменился...
                 change_T09=true;     //  то отмечаем это.
                 }

         // Серии (независимая обработка)
 if (ShowSequenceTI !=1) {    //  Если раздел с переводчиками не разрешен для показа...
         if (HadelSeq(mDesc.tiSeq))   //  то запускаем функцию независимой обработки серий, и если дескрипшен изменился...
                 change_T10=true;     //  то отмечаем это.
                 }

         // Жанры
 mDiv = mDesc.tiGenre.getElementsByTagName("DIV");    //  Массив с элементами "DIV", каждый раздел содержит данные одного имени.
 Length = mDiv.length;      //  Длина массива.

 for (k=0 ; k<Length; k++) {     //  Перебираем все элементы "DIV".
         div = mDiv[k];        //  Текущий элемент.
         s = div.all.genre.value;
         if (s.search(/^\s+|\s+$/) != -1) {       //  Если есть начальные/конечные пробельные символы...
                 s = s.replace(/^\s+|\s+$/g, "");   //  то удаляем их,
                 div.all.genre.value = s;          //  сохраняем новое значение
                 change_T01=true;        //  и отмечаем изменение.
                 }
         }


         // Дата
 change_T05 = Mini(mDesc.tiDate);   //  Запуск функции мини-обработки и перезапись индикатора изменения данных.

         // Значение даты
 change_T06 = Mini(mDesc.tiDateVal);   //  Запуск функции мини-обработки и перезапись индикатора изменения данных.

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///   Запись данных в <src-title-info>

 mDiv = bodyD.getElementsByTagName("DIV");    //  Массив с элементами "DIV".
 Length = mDiv.length;      //  Длина массива.

 for (k=0 ; k<Length; k++) {     //  Перебираем все элементы "DIV" в bodyD.
         div = mDiv[k];        //  Текущий элемент.
         if (div.className == "title"  &&  div.children.length == 1  &&  div.firstChild.innerText == "===<src-title-info>===") {   //  Если найден заголовок раздела...
                 mainElem = div.parentNode;     //  то сохраняем раздел
                 break;      //  и прерываем цикл.
                 }
         }

         //  Индикаторы изменений
 var change_S01=false;   //  Жанры
 var change_S02=false;   //  Авторы
 var change_S03=false;   //  Название
 var change_S04=false;   //  Ключевые слова
 var change_S05=false;   //  Дата
 var change_S06=false;   //  Значение даты
 var change_S07=false;   //  Язык
 var change_S08=false;   //  Язык оригинала
 var change_S09=false;   //  Переводчики
 var change_S10=false;   //  Серия

         //  Индикаторы обнаружения
 var search_S02=false;
 var search_S03=false;
 var search_S04=false;
 var search_S09=false;
 var search_S10=false;

 if (k != Length) {          //  Если в тексте обнаружен раздел <src-title-info>...

         mP = div.parentNode.getElementsByTagName("P");   //  Создаем массив из строк этого раздела.

         for (n=0; n<mP.length; n++) {     //  Цикл для перебора всех строк.
                 ptr = mP[n];       //  Текущая строка.
                 s = ptr.innerText;   //  Текст в строке.
                 s = s.replace(new RegExp(nbspEntity,"g"), " ");      //  заменяем все неразрывные пробелы на обычные.


                 //  Название

                 if (!search_S03  &&  s.search(/^\s*?• Название:/) != -1  &&  ptr.parentNode.className == "title") {
                 //  Если ещё не найден раздел с названием, и текущая строка в искомом разделе...
                         search_S03=true;                                        //  то отмечаем это,
                         s = ptr.parentNode.innerText;    //  выбираем весь текст раздела,
                         s = s.replace(new RegExp(nbspEntity,"g"), " ");      //  заменяем все неразрывные пробелы на обычные,
                         s = s.replace(/^(.|\s)*?• Название:/, "");    //  удаляем всё до ключевого слова,
                         s = s.replace(/^\s+|\s+$/g, "");      //  удаляем все начальные/конечные пробельные символы,
                         s = s.replace(/\s+/g, " ");    //  заменяем любой ряд любых пробельных символов на обычный пробел,
                         ex = mDesc.stiTitle.value;    //  сохраняем исходное значение данных в дескрипшен,
                         mDesc.stiTitle.value = s;     //  вставляем новые данные,
                         if (ex != mDesc.stiTitle.value)   //  и если данные от этого действия изменились,
                                 change_S03=true;     //  то отмечаем это.
                         continue;    //  Затем переходим к следующей строке.
                         }


                 //  Авторы

                 if (!search_S02  &&  s.search(/^\s*?• Авторы:/) != -1  &&  ptr.parentNode.className == "section") {
                 //  Если ещё не найден раздел с авторами, и текущая строка в искомом разделе...
                         search_S02=true;    //  то отмечаем это,
                         if (AddAuthor (mDesc.stiAuthor, true))   //  запускаем функцию добавления имен, и если в функции было выбрано прерывание скрипта...
                                 break Block1;                                           //  то останавливаем работу скрипта.
                         if (ex != mDesc.stiAuthor.innerHTML)    //  Если данные от этого действия изменились,
                                 change_S02=true;     //  то отмечаем это.
                         continue;               //  Затем переходим к следующей строке.
                         }


                 //  Ключевые слова

                 if (!search_S04  &&  s.search(/^\s*?• Ключевые слова:/) != -1  &&  ptr.parentNode.className == "section") {
                 //  Если ещё не найден раздел с ключевыми словами, и текущая строка в искомом разделе...
                         search_S04=true;                                        //  то отмечаем это,
                         s = ptr.parentNode.innerText;    //  выбираем весь текст раздела,
                         s = s.replace(new RegExp(nbspEntity,"g"), " ");      //  заменяем все неразрывные пробелы на обычные,
                         s = s.replace(/^(.|\s)*?• Ключевые слова:/, "");    //  удаляем всё до ключевого слова,
                         s = s.replace(/^\s+|\s+$/g, "");      //  удаляем все начальные/конечные пробельные символы,
                         s = s.replace(/\s+/g, " ");    //  заменяем любой ряд любых пробельных символов на обычный пробел,
                         ex = mDesc.stiKwd.value;    //  сохраняем исходное значение данных в дескрипшен,
                         mDesc.stiKwd.value = s;     //  вставляем новые данные,
                         if (ex != mDesc.stiKwd.value)   //  и если данные от этого действия изменились,
                                 change_S04=true;     //  то отмечаем это.
                         continue;    //  Затем переходим к следующей строке.
                         }


                 //  Переводчики

                 if (!search_S09  &&  s.search(/^\s*?• Переводчики:/) != -1  &&  ptr.parentNode.className == "section") {
                 //  Если ещё не найден раздел с переводчиками, и текущая строка в искомом разделе...
                         search_S09=true;    //  то отмечаем это,
                         if (AddAuthor (mDesc.stiTrans, false))   //  запускаем функцию добавления имен, и если в функции было выбрано прерывание скрипта...
                                 break Block1;                                           //  то останавливаем работу скрипта.
                         if (ex != mDesc.stiTrans.innerHTML)    //  Если данные от этого действия изменились,
                                 change_S09=true;     //  то отмечаем это.
                         continue;               //  Затем переходим к следующей строке.
                         }


                 //  Серии (поиск)

                 if (!search_S10  &&  s.search(/^\s*?• (Серия|Номер):/) != -1  &&  ptr.parentNode.className == "title") {
                 //  Если ещё не найден раздел с переводчиками, и текущая строка в искомом разделе...
                         search_S10=true;    //  то отмечаем это
                         var seq=ptr;        //  и сохраняем найденный параграф.
                         }

                 }

         }

 //  Очистка названия
 if (!search_S03  &&  mDesc.stiTitle.value != "") {    //  Если раздел с названием не был найден в <src-title-info>, но заполненное значение есть в дескрипшене...
         mDesc.stiTitle.value = "";      //  то удаляем это название
         change_S03=true;         //  и отмечаем это.
         }

 //  Очистка имен авторов
 if (ShowAuthorSTI ==1  &&  !search_S02) {    //  Если раздел с авторами разрешен для показа, но не был найден в <src-title-info>...
         if (DelAuthor (mDesc.stiAuthor, true))   //  то запускаем функцию удаления имен авторов, и если дескрипшен изменился...
                 change_S02=true;     //  то отмечаем это.
         }

 //  Очистка ключевых слов
 if (!search_S04  &&  mDesc.stiKwd.value != "") {    //  Если раздел с ключевыми словами не был найден в <src-title-info>, но заполненное значение есть в дескрипшене...
         mDesc.stiKwd.value = "";      //  то удаляем это значение
         change_S04=true;         //  и отмечаем это.
         }

 //  Очистка имен переводчиков
 if (ShowTranslatorSTI ==1  &&  !search_S09) {    //  Если раздел с авторами разрешен для показа, но не был найден в <src-title-info>...
         if (DelAuthor (mDesc.stiTrans, false))   //  то запускаем функцию удаления имен авторов, и если дескрипшен изменился...
                 change_S09=true;     //  то отмечаем это.
         }

 //  Серии (обработка)
 if (ShowSequenceSTI ==1)   //  Если разрешен показ серий...
         if (AddSeq(mDesc.stiSeq, search_S10))   //  Запускаем функцию для обработки серий, и если дескрипшен изменился...
                 change_S10=true;     //  то отмечаем это.



                 //  Мини-обработка оставшихся полей <src-title-info>

         // Авторы (независимая обработка)
 if (ShowAuthorSTI !=1) {    //  Если раздел с авторами не разрешен для показа...
         if (HandelAuthor(mDesc.stiAuthor, true))   //  то запускаем функцию независимой обработки авторов или переводчиков, и если дескрипшен изменился...
                 change_S02=true;     //  то отмечаем это.
                 }

         // Переводчики (независимая обработка)
 if (ShowTranslatorSTI !=1) {    //  Если раздел с переводчиками не разрешен для показа...
         if (HandelAuthor(mDesc.stiTrans, false))   //  то запускаем функцию независимой обработки авторов или переводчиков, и если дескрипшен изменился...
                 change_S09=true;     //  то отмечаем это.
                 }

         // Серии (независимая обработка)
 if (ShowSequenceSTI !=1) {    //  Если раздел с переводчиками не разрешен для показа...
         if (HadelSeq(mDesc.stiSeq))   //  то запускаем функцию независимой обработки серий, и если дескрипшен изменился...
                 change_S10=true;     //  то отмечаем это.
                 }

         // Жанры
 mDiv = mDesc.stiGenre.getElementsByTagName("DIV");    //  Массив с элементами "DIV", каждый раздел содержит данные одного имени.
 Length = mDiv.length;      //  Длина массива.

 for (k=0 ; k<Length; k++) {     //  Перебираем все элементы "DIV".
         div = mDiv[k];        //  Текущий элемент.
         s = div.all.genre.value;           //  Получаем очередное значение.
         if (s.search(/^\s+|\s+$/) != -1) {       //  Если есть начальные/конечные пробельные символы...
                 s = s.replace(/^\s+|\s+$/g, "");   //  то удаляем их,
                 div.all.genre.value = s;          //  сохраняем новое значение
                 change_S01=true;        //  и отмечаем изменение.
                 }
         }

         // Дата
 change_S05 = Mini(mDesc.stiDate);   //  Запуск функции мини-обработки и перезапись индикатора изменения данных.

         // Значение даты
 change_S06 = Mini(mDesc.stiDateVal);   //  Запуск функции мини-обработки и перезапись индикатора изменения данных.

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///   Запись данных в <document-info>

 mDiv = bodyD.getElementsByTagName("DIV");    //  Массив с элементами "DIV".
 Length = mDiv.length;      //  Длина массива.

 for (k=0 ; k<Length; k++) {     //  Перебираем все элементы "DIV" в bodyD.
         div = mDiv[k];        //  Текущий элемент.
         if (div.className == "title"  &&  div.children.length == 1  &&  div.firstChild.innerText == "===<document-info>===")   //  Если найден заголовок раздела...
                 break;      //  то прерываем цикл.
         }

         //  Индикаторы изменений
 var change_D01=false;   //  Версия
 var change_D02=false;   //  ID файла
 var change_D03=false;   //  Авторы
 var change_D04=false;   //  Программы
 var change_D05=false;   //  Дата
 var change_D06=false;   //  Значение даты
 var change_D07=false;   //  Source OCR
 var change_D08=false;   //  Source URLs

         //  Индикаторы обнаружения
 var search_D03=false;
 var search_D04=false;
 var search_D07=false;

 if (k != Length) {          //  Если в тексте обнаружен раздел <document-info>...

         mP = div.parentNode.getElementsByTagName("P");   //  Создаем массив из строк этого раздела.

         for (n=0; n<mP.length; n++) {     //  Цикл для перебора всех строк.
                 ptr = mP[n];       //  Текущая строка.
                 s = ptr.innerText;   //  Текст в строке.
                 s = s.replace(new RegExp(nbspEntity,"g"), " ");      //  заменяем все неразрывные пробелы на обычные.


                 //  Авторы

                 if (!search_D03  &&  s.search(/^\s*?• Авторы:/) != -1  &&  ptr.parentNode.className == "section") {
                 //  Если ещё не найден раздел с авторами, и текущая строка в искомом разделе...
                         search_D03=true;    //  то отмечаем это,
                         if (AddAuthor (mDesc.diAuthor, false))   //  запускаем функцию добавления имен, и если в функции было выбрано прерывание скрипта...
                                 break Block1;                                           //  то останавливаем работу скрипта.
                         if (ex != mDesc.diAuthor.innerHTML)    //  Если данные от этого действия изменились,
                                 change_D03=true;     //  то отмечаем это.
                         continue;               //  Затем переходим к следующей строке.
                         }


                 //  Использованы программы

                 if (!search_D04  &&  s.search(/^\s*?• Использованы программы:/) != -1  &&  ptr.parentNode.className == "section") {
                 //  Если ещё не найден раздел с использованными программами, и текущая строка в искомом разделе...
                         search_D04=true;                                        //  то отмечаем это,
                         s = ptr.parentNode.innerText;    //  выбираем весь текст раздела,
                         s = s.replace(new RegExp(nbspEntity,"g"), " ");      //  заменяем все неразрывные пробелы на обычные,
                         s = s.replace(/^(.|\s)*?• Использованы программы:/, "");    //  удаляем всё до ключевого слова,
                         s = s.replace(/^\s+|\s+$/g, "");      //  удаляем все начальные/конечные пробельные символы,
                         s = s.replace(/\s+/g, " ");    //  заменяем любой ряд любых пробельных символов на обычный пробел,
                         ex = mDesc.diProgs.value;    //  сохраняем исходное значение данных в дескрипшен,
                         mDesc.diProgs.value = s;     //  вставляем новые данные,
                         if (ex != mDesc.diProgs.value)   //  и если данные от этого действия изменились,
                                 change_D04=true;     //  то отмечаем это.
                         continue;    //  Затем переходим к следующей строке.
                         }


                 //  Source OCR

                 if (!search_D07  &&  s.search(/^\s*?• Source OCR:/) != -1  &&  ptr.parentNode.className == "section") {
                 //  Если ещё не найден раздел "Source OCR", и текущая строка в искомом разделе...
                         search_D07=true;                                        //  то отмечаем это,
                         s = ptr.parentNode.innerText;    //  выбираем весь текст раздела,
                         s = s.replace(new RegExp(nbspEntity,"g"), " ");      //  заменяем все неразрывные пробелы на обычные,
                         s = s.replace(/^(.|\s)*?• Source OCR:/, "");    //  удаляем всё до ключевого слова,
                         s = s.replace(/^\s+|\s+$/g, "");      //  удаляем все начальные/конечные пробельные символы,
                         s = s.replace(/\s+/g, " ");    //  заменяем любой ряд любых пробельных символов на обычный пробел,
                         ex = mDesc.diOCR.value;    //  сохраняем исходное значение данных в дескрипшен,
                         mDesc.diOCR.value = s;     //  вставляем новые данные,
                         if (ex != mDesc.diOCR.value)   //  и если данные от этого действия изменились,
                                 change_D07=true;     //  то отмечаем это.
                         continue;    //  Затем переходим к следующей строке.
                         }

                 }

         }

 //  Очистка имен авторов
 if (ShowAuthorDI ==1  &&  !search_D03) {    //  Если раздел с авторами разрешен для показа, но не был найден в <document-info>...
         if (DelAuthor (mDesc.diAuthor, false))   //  то запускаем функцию удаления имен авторов, и если дескрипшен изменился...
                 change_D03=true;     //  то отмечаем это.
         }

 //  Очистка "Использованных программ"
 if (!search_D04  &&  mDesc.diProgs.value != "") {    //  Если раздел с "программами" не был найден в <document-info>, но заполненное значение есть в дескрипшене...
         mDesc.diProgs.value = "";      //  то удаляем это значение
         change_D04=true;         //  и отмечаем это.
         }

 //  Очистка Source OCR
 if (!search_D07  &&  mDesc.diOCR.value != "") {    //  Если раздел с "Source OCR" не был найден в <document-info>, но заполненное значение есть в дескрипшене...
         mDesc.diOCR.value = "";      //  то удаляем это значение
         change_D07=true;         //  и отмечаем это.
         }



                 //  Мини-обработка оставшихся полей <document-info>

         // Авторы (независимая обработка)
 if (ShowAuthorDI !=1) {    //  Если раздел с авторами не разрешен для показа...
         if (HandelAuthor(mDesc.diAuthor, false))   //  то запускаем функцию независимой обработки авторов или переводчиков, и если дескрипшен изменился...
                 change_D03=true;     //  то отмечаем это.
                 }

         // Версия
 change_D01 = Mini(mDesc.diVersion);   //  Запуск функции мини-обработки и перезапись индикатора изменения данных.

         // ID файла
 change_D02 = Mini(mDesc.diID);   //  Запуск функции мини-обработки и перезапись индикатора изменения данных.

         // Дата
 change_D05 = Mini(mDesc.diDate);   //  Запуск функции мини-обработки и перезапись индикатора изменения данных.

         // Значение даты
 change_D06 = Mini(mDesc.diDateVal);   //  Запуск функции мини-обработки и перезапись индикатора изменения данных.


         // Source URLs
 mDiv = mDesc.diURL.getElementsByTagName("DIV");    //  Массив с элементами "DIV", каждый раздел содержит данные одного имени.
 Length = mDiv.length;      //  Длина массива.
 for (k=0 ; k<Length; k++)     //  Перебираем все элементы "DIV".
         if (Mini(mDiv[k].lastChild))   //  Запуск функции мини-обработки
                 change_D08 = true;    //  и если операция результативна, то отмечаем это.

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///   Запись данных в <publish-info>

 mDiv = bodyD.getElementsByTagName("DIV");    //  Массив с элементами "DIV".
 Length = mDiv.length;      //  Длина массива.

 for (k=0 ; k<Length; k++) {     //  Перебираем все элементы "DIV" в bodyD.
         div = mDiv[k];        //  Текущий элемент.
         if (div.className == "title"  &&  div.children.length == 1  &&  div.firstChild.innerText == "===<publish-info>===") {   //  Если найден заголовок раздела...
                 mainElem = div.parentNode;     //  то сохраняем раздел
                 break;      //  и прерываем цикл.
                 }
         }

         //  Индикаторы изменений
 var change_P01=false;
 var change_P02=false;
 var change_P03=false;
 var change_P04=false;
 var change_P05=false;
 var change_P06=false;

         //  Индикаторы обнаружения
 var search_P01=false;
 var search_P02=false;
 var search_P03=false;
 var search_P04=false;
 var search_P06=false;

 if (k != Length) {          //  Если в тексте обнаружен раздел <publish-info>...

         mP = div.parentNode.getElementsByTagName("P");   //  Создаем массив из строк этого раздела.

         for (n=0; n<mP.length; n++) {     //  Цикл для перебора всех строк.
                 ptr = mP[n];       //  Текущая строка.
                 s = ptr.innerText;   //  Текст в строке.
                 s = s.replace(new RegExp(nbspEntity,"g"), " ");      //  заменяем все неразрывные пробелы на обычные.


                 //  Заголовок книги

                 if (!search_P01  &&  s.search(/^\s*?• Заголовок книги:/) != -1  &&  ptr.parentNode.className == "section") {
                 //  Если ещё не найден раздел с заголовком, и текущая строка в искомом разделе...
                         search_P01=true;                                        //  то отмечаем это,
                         s = ptr.parentNode.innerText;    //  выбираем весь текст раздела,
                         s = s.replace(new RegExp(nbspEntity,"g"), " ");      //  заменяем все неразрывные пробелы на обычные,
                         s = s.replace(/^(.|\s)*?• Заголовок книги:/, "");    //  удаляем всё до ключевого слова,
                         s = s.replace(/^\s+|\s+$/g, "");      //  удаляем все начальные/конечные пробельные символы,
                         s = s.replace(/\s+/g, " ");    //  заменяем любой ряд любых пробельных символов на обычный пробел,
                         ex = mDesc.piName.value;    //  сохраняем исходное значение данных в дескрипшен,
                         mDesc.piName.value = s;     //  вставляем новые данные,
                         if (ex != mDesc.piName.value)   //  и если данные от этого действия изменились,
                                 change_P01=true;     //  то отмечаем это.
                         continue;    //  Затем переходим к следующей строке.
                         }


                 //  Издатель

                 if (!search_P02  &&  s.search(/^\s*?• Издатель:/) != -1  &&  ptr.parentNode.className == "section") {
                 //  Если ещё не найден раздел с издателем, и текущая строка в искомом разделе...
                         search_P02=true;                                        //  то отмечаем это,
                         s = ptr.parentNode.innerText;    //  выбираем весь текст раздела,
                         s = s.replace(new RegExp(nbspEntity,"g"), " ");      //  заменяем все неразрывные пробелы на обычные,
                         s = s.replace(/^(.|\s)*?• Издатель:/, "");    //  удаляем всё до ключевого слова,
                         s = s.replace(/^\s+|\s+$/g, "");      //  удаляем все начальные/конечные пробельные символы,
                         s = s.replace(/\s+/g, " ");    //  заменяем любой ряд любых пробельных символов на обычный пробел,
                         ex = mDesc.piPub.value;    //  сохраняем исходное значение данных в дескрипшен,
                         mDesc.piPub.value = s;     //  вставляем новые данные,
                         if (ex != mDesc.piPub.value)   //  и если данные от этого действия изменились,
                                 change_P02=true;     //  то отмечаем это.
                         continue;    //  Затем переходим к следующей строке.
                         }


                 //  Город

                 if (!search_P03  &&  s.search(/^\s*?• Город:/) != -1  &&  ptr.parentNode.className == "section") {
                 //  Если ещё не найден раздел с городом, и текущая строка в искомом разделе...
                         search_P03=true;                                        //  то отмечаем это,
                         s = ptr.parentNode.innerText;    //  выбираем весь текст раздела,
                         s = s.replace(new RegExp(nbspEntity,"g"), " ");      //  заменяем все неразрывные пробелы на обычные,
                         s = s.replace(/^(.|\s)*?• Город:/, "");    //  удаляем всё до ключевого слова,
                         s = s.replace(/^\s+|\s+$/g, "");      //  удаляем все начальные/конечные пробельные символы,
                         s = s.replace(/\s+/g, " ");    //  заменяем любой ряд любых пробельных символов на обычный пробел,
                         ex = mDesc.piCity.value;    //  сохраняем исходное значение данных в дескрипшен,
                         mDesc.piCity.value = s;     //  вставляем новые данные,
                         if (ex != mDesc.piCity.value)   //  и если данные от этого действия изменились,
                                 change_P03=true;     //  то отмечаем это.
                         continue;    //  Затем переходим к следующей строке.
                         }


                 //  Год

                 if (!search_P04  &&  s.search(/^\s*?• Год:/) != -1  &&  ptr.parentNode.className == "section") {
                 //  Если ещё не найден раздел с годом, и текущая строка в искомом разделе...
                         search_P04=true;                                        //  то отмечаем это,
                         s = ptr.parentNode.innerText;    //  выбираем весь текст раздела,
                         s = s.replace(new RegExp(nbspEntity,"g"), " ");      //  заменяем все неразрывные пробелы на обычные,
                         s = s.replace(/^(.|\s)*?• Год:/, "");    //  удаляем всё до ключевого слова,
                         s = s.replace(/^\s+|\s+$/g, "");      //  удаляем все начальные/конечные пробельные символы,
                         s = s.replace(/\s+/g, " ");    //  заменяем любой ряд любых пробельных символов на обычный пробел,
                         ex = mDesc.piYear.value;    //  сохраняем исходное значение данных в дескрипшен,
                         mDesc.piYear.value = s;     //  вставляем новые данные,
                         if (ex != mDesc.piYear.value)   //  и если данные от этого действия изменились,
                                 change_P04=true;     //  то отмечаем это.
                         continue;    //  Затем переходим к следующей строке.
                         }


                 //  Серии (поиск)

                 if (!search_P06  &&  s.search(/^\s*?• (Серия|Номер):/) != -1  &&  ptr.parentNode.className == "title") {
                 //  Если ещё не найден раздел с переводчиками, и текущая строка в искомом разделе...
                         search_P06=true;    //  то отмечаем это
                         var seq=ptr;        //  и сохраняем найденный параграф.
                         }

                 }

         }

 //  Очистка заголовка книги
 if (!search_P01  &&  mDesc.piName.value != "") {    //  Если раздел с заголовком не был найден в <publish-info>, но заполненное значение есть в дескрипшене...
         mDesc.piName.value = "";      //  то удаляем это значение
         change_P01=true;         //  и отмечаем это.
         }

 //  Очистка поля "Издатель"
 if (!search_P02  &&  mDesc.piPub.value != "") {    //  Если раздел с издателем не был найден в <publish-info>, но заполненное значение есть в дескрипшене...
         mDesc.piPub.value = "";      //  то удаляем это значение
         change_P02=true;         //  и отмечаем это.
         }

 //  Очистка поля "Город"
 if (!search_P03  &&  mDesc.piCity.value != "") {    //  Если раздел с городом не был найден в <publish-info>, но заполненное значение есть в дескрипшене...
         mDesc.piCity.value = "";      //  то удаляем это значение
         change_P03=true;         //  и отмечаем это.
         }

 //  Очистка поля "Год"
 if (!search_P04  &&  mDesc.piYear.value != "") {    //  Если раздел с годом не был найден в <publish-info>, но заполненное значение есть в дескрипшене...
         mDesc.piYear.value = "";      //  то удаляем это значение
         change_P04=true;         //  и отмечаем это.
         }

 //  Серии (обработка)
 if (ShowSequencePI ==1)   //  Если разрешен показ серий...
         if (AddSeq(mDesc.piSeq, search_P06))   //  Запускаем функцию для обработки серий, и если дескрипшен изменился...
                 change_P06=true;     //  то отмечаем это.



                 //  Мини-обработка оставшихся полей <publish-info>

         // Серии (независимая обработка)
 if (ShowSequencePI !=1) {    //  Если раздел с переводчиками не разрешен для показа...
         if (HadelSeq(mDesc.piSeq))   //  то запускаем функцию независимой обработки серий, и если дескрипшен изменился...
                 change_P06=true;     //  то отмечаем это.
                 }

         // ISBN
 change_P05 = Mini(mDesc.piISBN);   //  Запуск функции мини-обработки и перезапись индикатора изменения данных.

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///   Запись данных в <custom-info>

 mDiv = bodyD.getElementsByTagName("DIV");    //  Массив с элементами "DIV".
 Length = mDiv.length;      //  Длина массива.

 for (k=0 ; k<Length; k++) {     //  Перебираем все элементы "DIV" в bodyD.
         div = mDiv[k];        //  Текущий элемент.
         if (div.className == "title"  &&  div.children.length == 1  &&  div.firstChild.innerText == "===<custom-info>===")   //  Если найден заголовок раздела...
                 break;      //  то прерываем цикл.
         }

         //  Индикатор изменений
 var change_C01=false;

         //  Индикатор обнаружения
 var search_C01=false;

 ex = mDesc.ci.innerHTML;    //  сохраняем исходный текст структуры в дескрипшен,

 divCust = mDesc.ci.firstChild;         //  Находим первый элемент в разделе <custom-info>.
 while (divCust.nextSibling.nodeName != "DIV")    //  Находим раздел перед первым "DIV".
         divCust = divCust.nextSibling;

 if (k != Length) {          //  Если в тексте обнаружен раздел <custom-info>...

         mP = div.parentNode.getElementsByTagName("P");   //  Создаем массив из строк этого раздела.

         for (n=0; n<mP.length; n++) {     //  Цикл для перебора всех строк.
                 ptr = mP[n];       //  Текущая строка.
                 s = ptr.innerText;   //  Текст в строке.
                 s = s.replace(new RegExp(nbspEntity,"g"), " ");      //  заменяем все неразрывные пробелы на обычные.


                 //  Тип и Значение

                 if (s.search(/^\s*?• (Тип|Значение):/) != -1  &&  ptr.parentNode.className == "section") {
                 //  Если найдена секция со строками "Тип" или "Значение"...
                         search_C01=true;                                        //  то отмечаем это,

                         if (!divCust.nextSibling)               //  Проверяем наличие отсутствия следующего раздела, и если нет его...
                                 divCust.insertAdjacentElement("afterEnd", divCust.cloneNode(true));   //  и добавляем копию раздела "DIV".
                         divCust = divCust.nextSibling;     //  Переходим на следующий раздел "DIV" дескрипшена.

                         s = ptr.parentNode.innerText;    //  Выбираем весь текст секции с найденной строкой
                         s = s.replace(new RegExp(nbspEntity,"g"), " ");      //  и заменяем все неразрывные пробелы на обычные.

                         if (s.search(/• Тип:/)!=-1)  {      //  Если в тексте есть ключевое слово "Тип"...
                                 s2=s.replace(/^(.|\s)*?• Тип:/, "");                //  удаляем всё до ключевого слова,
                                 s2 = s2.replace(/• Значение:(.|\s)*/, "");    //  удаляем "Значение" и всё что после него,
                                 s2 = s2.replace(/^\s+|\s+$/g, "");      //  удаляем все начальные/конечные пробельные символы,
                                 s2 = s2.replace(/\s+/g, " ");    //  заменяем любой ряд любых пробельных символов на обычный пробел
                                 divCust.all.type.value = s2;     //  и вставляем полученный текст в дескрипшен.
                                 }
                             else  divCust.all.type.value = "";    //  Если нет ключевого слова - то удаляем старое значение для "Тип".

                         if (s.search(/• Значение:/)!=-1)  {      //  Если в тексте есть ключевое слово "Значение"...
                                 s2=s.replace(/^(.|\s)*?• Значение:/, "");                //  удаляем всё до ключевого слова,
                                 s2 = s2.replace(/^\s+|\s+$/g, "");      //  удаляем все начальные/конечные пробельные символы,
                                 s2 = s2.replace(/\r\n\s*\r\n/g, "\r\n\r\n");   //  заменяем ряд пустых строк на одну,
                                 s2 = s2.replace(/\r\n +| +\r\n/g, "\r\n");   //  удаляем все начальные/конечные пробелы
                                 divCust.all.val.innerText = s2;     //  и вставляем полученный текст в дескрипшен.
                                 }
                             else  divCust.all.val.innerText = "";    //  Если нет ключевого слова - то удаляем старое значение.

                         while (ptr.nextSibling) {   //  Перебираем строки от первой найденной строки до конца секции
                                 ptr = ptr.nextSibling;
                                 n++;                 //  и пропускаем их в цикле для строк.
                                 }

                         }

                 }

         }

 //  Очистка полей "Тип" и "Значение"
 if (!search_C01) {    //  Если раздел с заголовком не был найден в <custom-info>, но заполненное значение есть в дескрипшене...
         divCust = divCust.nextSibling;   //  то заходим в первый раздел "DIV",
         divCust.all.type.value = "";      //  удаляем значение "Тип"
         divCust.all.val.innerText = "";      //  и удаляем значение "Значение".
         }

 while (divCust.nextSibling  &&  divCust.nextSibling.nodeName == "DIV")   //  Удаляем все неиспользованные разделы "DIV".
         divCust.nextSibling.removeNode(true);

 PutSpacers(divCust.parentNode);     //  Правильно оформляем список.

 if (ex != mDesc.ci.innerHTML)   //  и если данные от этих действий изменились,
         change_C01=true;     //  то отмечаем это.

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///  ПОСТОБРАБОТКА


         //  Удаление повторного значения языка

 if (DelLang == 0) {               //  Если разрешено удаление повторного значения языка...
         if (mDesc.tiLang.value !=""  &&  mDesc.tiLang.value == mDesc.tiSrcLang.value) {               //  проверяем на повторение раздел "Книга"
                 mDesc.tiSrcLang.value ="";                    //  и при обнаружении повтора, удаляем значение "Язык оригинала"
                 change_T08 = true;      //  и отмечаем это событие.
                 }
         if (mDesc.stiLang.value !=""  &&  mDesc.stiLang.value == mDesc.stiSrcLang.value) {         //  проверяем на повторение раздел "Оригинал книги"
                 mDesc.stiSrcLang.value ="";                    //  и при обнаружении повтора, удаляем значение "Язык оригинала"
                 change_S08 = true;      //  и отмечаем это событие.
                 }
         }


         //  Общий язык оригинала

 if (mDesc.stiLang.value !=""  &&  mDesc.tiSrcLang.value =="") {   //  Если есть значение "язык" оригинала книги, и нет значения "Язык оригинала" для книги...
         mDesc.tiSrcLang.value = mDesc.stiLang.value;   //  то копируем это значение
         change_T08 = true;      //  и отмечаем это событие.
         }


         //  Добавление "значения даты" из "даты"

 if (AddDateVal(mDesc.tiDate, mDesc.tiDateVal))    //  Запуск соответствующей функции для <title-info>
         change_T06 = true;                 //  и если операция результативна, то отмечаем это.
 if (AddDateVal(mDesc.stiDate, mDesc.stiDateVal))    //  Запуск соответствующей функции для <src-title-info>
         change_S06 = true;                 //  и если операция результативна, то отмечаем это.
 if (AddDateVal(mDesc.diDate, mDesc.diDateVal))    //  Запуск соответствующей функции для <document-info>
         change_D06 = true;                 //  и если операция результативна, то отмечаем это.


         //  Добавление "даты" из "значения даты"

 if (AddDate(mDesc.tiDateVal, mDesc.tiDate))    //  Запуск соответствующей функции для <title-info>
         change_T05 = true;                 //  и если операция результативна, то отмечаем это.
 if (AddDate(mDesc.stiDateVal, mDesc.stiDate))    //  Запуск соответствующей функции для <src-title-info>
         change_S05 = true;                 //  и если операция результативна, то отмечаем это.
 if (AddDate(mDesc.diDateVal, mDesc.diDate))    //  Запуск соответствующей функции для <document-info>
         change_D05 = true;                 //  и если операция результативна, то отмечаем это.


         //  Изменение шаблонной "даты" на текстовую

 if (ChangeDate(mDesc.tiDate))    //  Запуск соответствующей функции для <title-info>
         change_T05 = true;                 //  и если операция результативна, то отмечаем это.
 if (ChangeDate(mDesc.stiDate))    //  Запуск соответствующей функции для <src-title-info>
         change_S05 = true;                 //  и если операция результативна, то отмечаем это.
 if (ChangeDate(mDesc.diDate))    //  Запуск соответствующей функции для <document-info>
         change_D05 = true;                 //  и если операция результативна, то отмечаем это.


         //  Добавление недостающих данных в <src-title-info>

Block2:  for (var B2=true; B2; B2=false) {    //  Начало одношагового цикла для проверки раздела <src-title-info> на пустоту.

         var EntitySrcTitleInfo = false;    //  Предполагаем, что в разделе <src-title-info> есть какие-то данные.

         mDiv = mDesc.stiGenre.getElementsByTagName("DIV");    //  Массив с элементами "DIV".
         for (k=0 ; k<mDiv.length; k++) {     //  Перебираем все элементы "DIV" в разделе жанров.
                 div = mDiv[k];        //  Текущий элемент.
                 if (div.all.genre.value)  break Block2;    //  Если значение жанра не пусто - выходим из цикла.
                 }

         mDiv = mDesc.stiAuthor.getElementsByTagName("DIV");    //  Массив с элементами "DIV".
         for (k=0 ; k<mDiv.length; k++) {     //  Перебираем все элементы "DIV" в разделе авторов.
                 div = mDiv[k];        //  Текущий элемент.
                 if (div.all.first.value)  break Block2;    //  Если значение имени не пусто - выходим из цикла.
                 if (div.all.middle.value)  break Block2;    //  Если значение отчества не пусто - выходим из цикла.
                 if (div.all.last.value)  break Block2;    //  Если значение фамилии не пусто - выходим из цикла.
                 if (div.all.nick.value)  break Block2;    //  Если значение ника не пусто - выходим из цикла.
                 if (div.all.email.value)  break Block2;    //  Если значение Email не пусто - выходим из цикла.
                 if (div.all.home.value)  break Block2;    //  Если значение Website не пусто - выходим из цикла.
                 if (div.all.id.value)  break Block2;    //  Если значение ID не пусто - выходим из цикла.
                 }

         if (mDesc.stiTitle.value)  break;    //  Если значение "Название" не пусто - выходим из цикла.
         if (mDesc.stiKwd.value)  break;    //  Если значение "Ключевые слова" не пусто - выходим из цикла.
         if (mDesc.stiDate.value)  break;    //  Если значение "Дата" не пусто - выходим из цикла.
         if (mDesc.stiDateVal.value)  break;    //  Если значение "Значение даты" не пусто - выходим из цикла.
         if (mDesc.stiLang.value)  break;    //  Если значение "Язык" не пусто - выходим из цикла.
         if (mDesc.stiSrcLang.value)  break;    //  Если значение "Язык оригинала" не пусто - выходим из цикла.

         mDiv = mDesc.stiTrans.getElementsByTagName("DIV");    //  Массив с элементами "DIV".
         for (k=0 ; k<mDiv.length; k++) {     //  Перебираем все элементы "DIV" в разделе переводчиков.
                 div = mDiv[k];        //  Текущий элемент.
                 if (div.all.first.value)  break Block2;    //  Если значение имени не пусто - выходим из цикла.
                 if (div.all.middle.value)  break Block2;    //  Если значение отчества не пусто - выходим из цикла.
                 if (div.all.last.value)  break Block2;    //  Если значение фамилии не пусто - выходим из цикла.
                 if (div.all.nick.value)  break Block2;    //  Если значение ника не пусто - выходим из цикла.
                 if (div.all.email.value)  break Block2;    //  Если значение Email не пусто - выходим из цикла.
                 if (div.all.home.value)  break Block2;    //  Если значение Website не пусто - выходим из цикла.
                 }

         mDiv = mDesc.stiSeq.getElementsByTagName("DIV");    //  Массив с элементами "DIV".
         for (k=0 ; k<mDiv.length; k++) {     //  Перебираем все элементы "DIV" в разделе серий.
                 div = mDiv[k];        //  Текущий элемент.
                 if (div.all.name.value)  break Block2;    //  Если значение названия не пусто - выходим из цикла.
                 if (div.all.number.value)  break Block2;    //  Если значение номера не пусто - выходим из цикла.
                 }

         EntitySrcTitleInfo = true;   //  Если получилось дойти до этого места, то раздел <src-title-info> полностью пуст.
 }

 if (! EntitySrcTitleInfo) {           //  Если <src-title-info> заполнен...
         var divSti = mDesc.stiGenre.firstChild;         //  Находим первый элемент в разделе жанров <src-title-info>.
         while (divSti.nextSibling.nodeName != "DIV")    //  Находим раздел перед первым "DIV".
                 divSti = divSti.nextSibling;
         if (!divSti.nextSibling.nextSibling  &&  !divSti.nextSibling.all.genre.value) {    //  Если это единственный раздел, и значение жанра пусто...
                 ex = mDesc.stiGenre.innerHTML;            //  Сохраняем текущее состояние раздела жанров в <src-title-info>.
                 var divTi = mDesc.tiGenre.firstChild;         //  Находим первый элемент в разделе жанров <title-info>.
                 while (divTi.nextSibling.nodeName != "DIV")    //  Находим раздел перед первым "DIV".
                         divTi = divTi.nextSibling;
                 while (divTi.nextSibling) {     //  Пока существует следующий раздел...
                         divTi = divTi.nextSibling;     //  Переходим на следующий раздел жанра в <title-info>.
                         if (!divSti.nextSibling)           //  Если в <src-title-info> нет следующего раздела жанра...
                                 divSti.insertAdjacentElement("afterEnd", divSti.cloneNode(true));   //  то добавляем копию раздела "DIV".
                         divSti = divSti.nextSibling;             //  Переходим на следующий раздел жанра в <src-title-info>.
                         divSti.all.genre.value = divTi.all.genre.value;         //  Копируем значение жанра из <title-info> в <src-title-info>.
                         }
                 PutSpacers(mDesc.stiGenre);     //  Правильно оформляем список.
                 if (ex != mDesc.stiGenre.innerHTML)       //  Если после всех манипуляций раздел жанров в <src-title-info> изменился...
                         change_S01 = true;          //  то отмечаем это событие.
                 }

         if (mDesc.stiLang.value == ""  &&  mDesc.tiSrcLang.value != "") {      //  Если нет значения "язык" оригинала книги, но есть значения "Язык оригинала" для книги...
                 mDesc.stiLang.value = mDesc.tiSrcLang.value;            //  то копируем это значение
                 change_S08 = true;                                             //  и отмечаем, что данные изменились.
                 }
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------

 bodyD.removeNode(true);   //  Удаление искусственного <body>

 }    //  Конец блока "Block1" записи в дескрипшен.

 window.focus();   //   Удаляем курсор.

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///  ПОВЫШЕНИЕ ВЕРСИИ ФАЙЛА И ЗАПИСЬ В ИСТОРИЮ ИЗМЕНЕНИЙ
                 //  (применение функции "HistoryChange")

 var versionFile=document.getElementById("diVersion").value; //  Извлечение значения версии файла.
 var newVersion = versionFile;                                                          //  Значение новой версии.

 var HiCh=0;                     //  Код изменения истории.
 var VersionUp=false;   //  Индикатор повышения версии.

 var change_all  =  change_T01 || change_T02 || change_T03 || change_T04 || change_T05 || change_T06 || change_T07 || change_T08 || change_T09 || change_T10 || change_S01 || change_S02 || change_S03 || change_S04 || change_S05 || change_S06 || change_S07 || change_S08 || change_S09 || change_S10 || change_D01 || change_D02 || change_D03 || change_D04 || change_D05 || change_D06 || change_D07 || change_D08 || change_P01 || change_P02 || change_P03 || change_P04 || change_P05 || change_P06 || change_C01;

//  Если включено автоматическое повышение версии, а также если есть измененные строки или разрешено повышение версии когда нет изменений...
 if (Version_on_off == 1  &&  (change_all  ||  Vsegda_on_off == 1))
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

 var currentFullDate = new Date();     //  Получение структуры полной даты.

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


                 // Демонстрационный режим "Показать все строки"

 var VseStroki_on_off = 0;      // 0 ; 1 //      ("0" — отключить, "1" — включить)

 var d=0;
 if (VseStroki_on_off ==1)  d="показать всё";

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Сборка массива с результатами обработки

 var mSt=[];   //  Массив строк с результатами обработки.
 var ind=0;    //  Индекс элемента массива.
 var Tf=new Date().getTime();

                 mSt[ind]=" "+ScriptName+" v."+NumerusVersion;  ind++;
                 mSt[ind]="---------------------------------------------------------";  ind++;
 if (d)   { mSt[ind]=" Демонстрационный режим";  ind++; }

                                         mSt[ind]="					    ";  ind++;
                                         mSt[ind]="Вычисления  .  .  .  .  .  .  .	"+time(Tf - Ts - T_pause);  ind++;
 if (T_pause!=d)       { mSt[ind]="Диалоговые паузы .  .  .  .	"+time(T_pause);  ind++; }

var cTaT0=ind;  //  Число начальных строк.
var cTaT=ind;  //  Текущее число заполненных строк.

                                             mSt[ind]="";  ind++;
                                             mSt[ind]="• ИЗМЕНЕНИЯ в <title-info>:";  ind++;
 if (change_T01 || d)  { mSt[ind]="   Жанры";  ind++ }
 if (change_T02 || d)  { mSt[ind]="   Авторы";  ind++ }
 if (change_T03 || d)  { mSt[ind]="   Название";  ind++ }
 if (change_T04 || d)  { mSt[ind]="   Ключевые слова";  ind++ }
 if (change_T05 || d)  { mSt[ind]="   Дата";  ind++ }
 if (change_T06 || d)  { mSt[ind]="   Значение даты";  ind++ }
 if (change_T07 || d)  { mSt[ind]="   Язык";  ind++ }
 if (change_T08 || d)  { mSt[ind]="   Язык оригинала";  ind++ }
 if (change_T09 || d)  { mSt[ind]="   Переводчики";  ind++ }
 if (change_T10 || d)  { mSt[ind]="   Серия";  ind++ }

 if (cTaT==ind-2)  ind=ind-2;   //  Если нет пунктов с изменениями - удаление двух последних строк.
cTaT=ind;  //  Текущее число заполненных строк.

                                             mSt[ind]="";  ind++;
                                             mSt[ind]="• ИЗМЕНЕНИЯ в <src-title-info>:";  ind++;
 if (change_S01 || d)  { mSt[ind]="   Жанры";  ind++ }
 if (change_S02 || d)  { mSt[ind]="   Авторы";  ind++ }
 if (change_S03 || d)  { mSt[ind]="   Название";  ind++ }
 if (change_S04 || d)  { mSt[ind]="   Ключевые слова";  ind++ }
 if (change_S05 || d)  { mSt[ind]="   Дата";  ind++ }
 if (change_S06 || d)  { mSt[ind]="   Значение даты";  ind++ }
 if (change_S07 || d)  { mSt[ind]="   Язык";  ind++ }
 if (change_S08 || d)  { mSt[ind]="   Язык оригинала";  ind++ }
 if (change_S09 || d)  { mSt[ind]="   Переводчики";  ind++ }
 if (change_S10 || d)  { mSt[ind]="   Серия";  ind++ }

 if (cTaT==ind-2)  ind=ind-2;   //  Если нет пунктов с изменениями - удаление двух последних строк.
cTaT=ind;  //  Текущее число заполненных строк.

                                             mSt[ind]="";  ind++;
                                             mSt[ind]="• ИЗМЕНЕНИЯ в <document-info>:";  ind++;
 if (change_D01 || d)  { mSt[ind]="   Версия";  ind++ }
 if (change_D02 || d)  { mSt[ind]="   ID файла";  ind++ }
 if (change_D03 || d)  { mSt[ind]="   Авторы";  ind++ }
 if (change_D04 || d)  { mSt[ind]="   Программы";  ind++ }
 if (change_D05 || d)  { mSt[ind]="   Дата";  ind++ }
 if (change_D06 || d)  { mSt[ind]="   Значение даты";  ind++ }
 if (change_D07 || d)  { mSt[ind]="   Source OCR";  ind++ }
 if (change_D08 || d)  { mSt[ind]="   Source URLs";  ind++ }

 if (cTaT==ind-2)  ind=ind-2;   //  Если нет пунктов с изменениями - удаление двух последних строк.
cTaT=ind;  //  Текущее число заполненных строк.

                                             mSt[ind]="";  ind++;
                                             mSt[ind]="• ИЗМЕНЕНИЯ в <publish-info>:";  ind++;
 if (change_P01 || d)  { mSt[ind]="   Заголовок книги";  ind++ }
 if (change_P02 || d)  { mSt[ind]="   Издатель";  ind++ }
 if (change_P03 || d)  { mSt[ind]="   Город";  ind++ }
 if (change_P04 || d)  { mSt[ind]="   Год издания";  ind++ }
 if (change_P05 || d)  { mSt[ind]="   ISBN";  ind++ }
 if (change_P06 || d)  { mSt[ind]="   Серия";  ind++ }

 if (cTaT==ind-2)  ind=ind-2;   //  Если нет пунктов с изменениями - удаление двух последних строк.
cTaT=ind;  //  Текущее число заполненных строк.

                                             mSt[ind]="";  ind++;
                                             mSt[ind]="• ИЗМЕНЕНИЯ в <custom-info>:";  ind++;
 if (change_C01 || d)  { mSt[ind]="   есть изменения";  ind++ }

 if (cTaT==ind-2)  ind=ind-2;   //  Если нет пунктов с изменениями - удаление двух последних строк.

 if (cTaT0==ind || d) {
         mSt[ind]="";  ind++;
         mSt[ind]="   >> Исправлений нет";  ind++;
         }

//  История
 if (VersionUp ||  HiCh  ||  d)  { mSt[ind]="";  ind++ }
 if (VersionUp  ||  d)                 { mSt[ind]="• Версия файла:  "+versionFile+"  ›››  "+newVersion;  ind++ }
 if (HiCh==1  ||  d)                    { mSt[ind]="• Добавлена новая строка в историю";  ind++ }
 if (HiCh==2  ||  d)                    { mSt[ind]="• Добавлены две строки в историю";  ind++ }
 if (HiCh==3  ||  d)                    { mSt[ind]="• Изменены данные в строке истории";  ind++ }

 //  Сборка строк текущей даты и времени
 mSt[ind]="";  ind++;
 mSt[ind]= "• "+currentDate+" • "+currentTime+" •";  ind++;

//  Сборка строк пословицы
 mSt[ind]="";  ind++;
 mSt[ind]="---------------------------------------------------------";  ind++;
 var reZit = new RegExp("([^ ].{0,45})(?=\\\s\\\s.{0,}|$)","g");   // Рег. выражение для разделения цитаты на строки.
 mSt=mSt.concat(Kn[Rn_(Kn.length)].replace(/ /g, "  ").match(reZit));   //  Добавление массива строк цитаты в основной массив.
 for (j=mSt.length-1; j>=ind; j--)  mSt[j]=" "+mSt[j];   //  Добавление отступа.
// for (j=mSt.length-1; j>=ind; j--)  { mSt.splice(j+1, 0, ""+mSt[j].length) }   //  Добавление длины строк цитаты (отключено).
 ind = mSt.length;    //  Определение индекса.

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Подсчет количества и высоты колонок в таблице с результатами обработки

 if (Vysota_teksta<30)  Vysota_teksta=30;  // установка минимальной высоты
 var Kolo=Vysota_teksta-3;   //  высота колонки (в конце сборки страниц могут добавиться 3 строки)
 var page;   // страницы
 var firstPage = 0;   //  Учет возможного добавления пустой строки в конце первой страницы


 if (Vysota_teksta >= ind) {   // Если все строки могут поместиться на одной странице
         page=1;
         Kolo=ind;
         }
     else {         // иначе...
         page=Math.ceil(ind/Kolo);  //  подсчет количества страниц
         Kolo=Math.ceil(ind/page);  //  подсчет высоты колонки при равномерном распределении строк по страницам
         if  (Kolo<=cTaT0-1) {      //  если высота колонки оказалась меньше высоты статистики...
                 Kolo=cTaT0-1;  //  увеличение высоты колонки до высоты "статистики" (с учетом возможного добавления одной строки)
                 page=Math.ceil(ind/Kolo);  //  пересчет количества страниц
                 }
             else  if  (Kolo<cTaT0+6) {                  //  если высота колонки оказалась немного выше "статистики"
                     Kolo=Math.ceil((ind-cTaT0)/(page-1));   //  пересчет высоты колонки с учетом будущего добавления пустых строк после статистики
                     for (n=0; n<Kolo-cTaT0; n++) {
                             mSt.splice(cTaT0, 0, "");   // добавление пустых строк в массив результатов (после статистики)
                             ind++;
                             }
                     }
                 else  firstPage = 1;  //  в остальных случаях колонка и страницы не меняются, но есть вероятность добавления пустой строки в конце первой страницы

         Kolo=Math.ceil((ind-2+firstPage)/page+1);  //  пересчет высоты колонки с учетом возможного добавления пустых строк в конце страниц (не считая первую и последнюю [page-2]) + вероятность добавления пустой строки в конце первой страницы (firstPage)
// * Поскольку предыдущая операция может и не добавить строку в колонку, необходимо сделать контрольный пересчет:
         if  (Kolo<=cTaT0) {     //  если высота колонки оказалась меньше высоты статистики...
                 Kolo=cTaT0;  //  увеличение высоты колонки до высоты "статистики"
                 }
         }

 while  ( ind <= Kolo*page+5)  { mSt[ind]="";  ind++ }  //  Добавление пустых строк до полного заполнения ими общей высоты во всех страницах
//  * +5 строк - на всякий случай (лишний запас не помешает)

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Распределение строк по страницам

 var mPage=[];   // массив страниц
 var _k=0;  // смещение строк

 for (n=0; n < page; n++) {
         mPage[n]="";
         if (mSt[n*Kolo+_k] == "")  _k++;  //  пропуск пустой строки в начале страницы
         for (k=0 ;  k<Kolo;  k++) {
                 if (k==Kolo-1  &&        //  если "последняя" строка на странице...
                     (mSt[k+n*Kolo+_k].search(/^• [А-ЯЁ][А-ЯЁ]/) != -1  ||           //  это заголовок
                     mSt[k+n*Kolo+_k+2] == ""  &&      //  или это 2-я строка перед пустой строкой,
                         mSt[k+n*Kolo+_k+1] != ""  &&      //  при условии, что следующая строка не пустая...
                         mSt[k+n*Kolo+_k-2] != ""))                //  и что вторая строка выше не пустая...
                             { mPage[n]+="\n";  _k--;   break }      //  то в конце страницы добавляется пустая строка, а "последняя" строка переносятся на следующую страницу.
                 mPage[n]+=mSt[k+n*Kolo+_k]+"\n";        // Стандартное заполнение страницы
                 }
         if (page!=1) {
                 mPage[n]+="					    \n";
                 if (n!=page-1)  mPage[n]+="◊  Стр. "+(n+1)+"  ◊  Показать следующую страницу?";
                         else  mPage[n]+="◊  Стр. "+(n+1)+" (последняя)  ◊  Закрыть окно?";
                 }
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Вывод страниц с результатами на экран

 otvet = true;
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

 }                   //  Конец блока для случая, когда <body> с дескрипшеном присутствует в разделе "Дизайн"...


 }






