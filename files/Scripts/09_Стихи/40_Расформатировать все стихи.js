//======================================
//             «Расформатирование всех стихов»
//  Скрипт предназначен для полного расформатирования всех стихов.
//
//  Скрипт тестировался в FBE v.2.7.7 (win XP, IE8 и win 7, IE11)
//  * История изменений в конце скрипта
//======================================

function Run() {
 var ScriptName="«Расформатирование всех стихов»";
 var NumerusVersion="1.5";

//--------------------------------------------------------------------
                 ///  НАСТРОЙКИ
//--------------------------------------------------------------------

//     Добавление пустых строк между расформатированными стихами (<poem>) и текстом книги

var Add_emptyLine_on_off = 1;      // 0 ; 1 //      ("0" — никогда не добавлять, "1" — всегда добавлять)

// ---------------------------------------------------------------

         //  Автоматическое повышение версии файла и запись в историю изменений

 var Version_on_off = 1;      // 0 ; 1 //      ("0" — отключить, "1" — включить)

//  Добавлять, если не сделано ни одного исправления
 var Vsegda_on_off = 0;      // 0 ; 1 //      ("0" — отключить, "1" — включить)

//   Имя используемое в добавленной записи:
 var youName = "Зорро";

//  * Можно использовать почти любые символы. Исключения:   |  "  |  \  |    Но и любой из этих знаков можно добавить, если поставить перед ним наклонную черту ("\"), например: "\\" = "\"
//  ** Или можно оставить эти кавычки пустыми (""), тогда строка в истории будет без имени.

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОБЩИЕ ПЕРЕМЕННЫЕ

//   Неразрывные пробелы
 try  { var nbspEntity=window.external.GetNBSP();  if (nbspEntity.charCodeAt(0) == 160)  nbspEntity = "&nbsp;" }
 catch(e) { var nbspEntity="&nbsp;" }

//  Счетчики цикла
var j = 0;
var n = 0;

//  Структура текста (аннотация + история + все <body>, иначе говоря, всё что видно в режиме "B"-дизайн)
 var fbwBody=document.getElementById("fbw_body");

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///  ФУНКЦИЯ ПОВЫШЕНИЯ ВЕРСИИ ФАЙЛА И ЗАПИСЬ В ИСТОРИЮ ИЗМЕНЕНИЙ

 function HistoryChange(Script_Name, youName) {


         // Получение раздела истории

// var fbwBody=document.getElementById("fbw_body");     //  **  эта строка уже есть в скрипте  **
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
                     newVersion++;                                                                                           //  увеличиваем полученое число на единицу
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


                 /// ПРОВЕРКА РЕЖИМА

 if (fbwBody.style.display == "none") {
         window.external.SetStatusBarText("  •  Скрипт "+ScriptName+" v." + NumerusVersion + " можно запустить только в режиме «B» (Дизайн)");
         return;
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ПРЕДУПРЕЖДЕНИЕ

 if (!AskYesNo("						          \n"+
                              "     Скрипт предназначен для полного удаления\n"+
                              "форматирования «стих».\n\n"+
                              "     Для этого скрипт...\n"+
                              "1. удаляет форматирование внутри стихов:\n"+
                              "          «строфа» (<stanza>)\n"+
                              "          «заголовок» (<title>)\n"+
                              "          «эпиграф» (<epigraph>)\n"+
                              "          «автор текста» (<text-author>);\n"+
                              "2. удаляет всё форматирование «стих» (<poem>);\n"+
                              "3. изменяет все теги <v> на <p>;\n"+
                              "4. при этом скрипт может добавлять или удалять\n"+
                              "     пустые строки внутри расформатированных\n"+
                              "     разделов, или рядом с ними.\n\n"+
                              "                          ПРОДОЛЖИТЬ ?"))
         return;

  var Ts1=new Date().getTime();

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


                 /// ОБРАБОТКА ТЕКСТА  :  Разделы "poem"  :  операции № 1хх

 window.external.BeginUndoUnit(document, ScriptName+" v."+NumerusVersion);    // Начало записи в систему отмен.

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
                 if (pm.nextSibling  &&  pm.nextSibling.innerHTML.search(reSpase) == -1) {
                         pm.insertAdjacentElement("afterEnd",document.createElement("P"));
                         window.external.inflateBlock(pm.nextSibling)=true;
                         count_102++ }
                 }

         //  Удаление первых пустых строк "poem"
         while (pm.firstChild  &&  pm.firstChild.innerHTML.search(reSpase) != -1
             &&  ( pm.previousSibling  &&  (pm.previousSibling.className == "subtitle"  ||  pm.previousSibling.className == "title")
                 ||  pm.firstChild.nextSibling  &&  pm.firstChild.nextSibling.innerHTML.search(reSpase) != -1 ) )
                         { pm.firstChild.removeNode(true);  count_103++ }

         //  Удаление последних пустых строк "poem"
         while (pm.lastChild  &&  pm.lastChild.innerHTML.search(reSpase) != -1
             &&  (pm.lastChild.previousSibling  &&  pm.lastChild.previousSibling.innerHTML.search(reSpase) != -1 ) )
                         { pm.lastChild.removeNode(true);  count_103++ }

         //  Удаление форматирования стихами ("poem")
         pm.removeNode(false);
         count_115++;

         }

  if (count_103 != 0)  window.focus();  // Удаление курсора из текста, при операции удаления параграфа

 var itogi = count_101+count_102+count_103+count_111+count_112+count_113+count_114+count_115;

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
 if (Version_on_off == 1  &&  (itogi  ||  Vsegda_on_off == 1))
         HistoryChange(ScriptName + " " + NumerusVersion, youName);   //  запускаем функцию для изменения данных истории

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


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Подсчет чистого компьютерного времени, потраченного на обработку текста

 var Tf1=new Date().getTime();
 var tempus=0;

 var T2=(Tf1-Ts1);
 var Tmin  = Math.floor((T2)/60000);
 var TsecD = ((T2)%60000)/1000;
 var Tsec = Math.floor(TsecD);

 if (Tmin ==0)
         tempus = (+(TsecD+"").replace(/(.{1,5}).*/g, "$1")+"").replace(".", ",")+" сек";
     else {
             tempus = Tmin+" мин";
             if (Tsec !=0)
                     tempus += " " + Tsec+ " с" }

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

 var mSt=[];
 var ind=0;

                 mSt[ind]=" "+ScriptName+" v."+NumerusVersion;  ind++;
                 mSt[ind]="--------------------------------------------------------------";  ind++;
 if (d)   { mSt[ind]=" Демонстрационный режим";  ind++ }
                 mSt[ind]="						";  ind++;

                                     mSt[ind]="• СТАТИСТИКА:";  ind++;
                                     mSt[ind]="Время выполнения .  .  .  .  .  .  .  .  .	"+tempus;  ind++;
 if (itogi!=d)          { mSt[ind]="Всего исправлений .  .  .  .  .  .  .  .  .	"+itogi;  ind++ }
 if (itogi==0 || d) { mSt[ind]="";  ind++;
                                     mSt[ind]="   >> Исправлений нет";  ind++; }

 var cTaT=ind;  //  число строк в первом разделе

                                        mSt[ind]="";  ind++;
                                        mSt[ind]="• ИСПРАВЛЕНИЯ:";  ind++;

 if (count_101!=d)  { mSt[ind]="Вставка пустых строк внутри стихов   .  .  .  .	"+count_101;  ind++ }
 if (count_102!=d)  { mSt[ind]="Вставка пустых строк рядом со стихами .  .  .	"+count_102;  ind++ }
 if (count_103!=d)  { mSt[ind]="Удаление пустых строк внутри стихов .  .  .  .	"+count_103;  ind++ }
 if (count_111!=d)  { mSt[ind]="Удаление формата строф   .  .  .  .  .  .  .  .  .  .	"+count_111;  ind++ }
 if (count_112!=d)  { mSt[ind]="Удаление формата заголовков .  .  .  .  .  .  .  .	"+count_112;  ind++ }
 if (count_113!=d)  { mSt[ind]="Удаление формата эпиграфов  .  .  .  .  .  .  .  .	"+count_113;  ind++ }
 if (count_114!=d)  { mSt[ind]="Удаление формата \"автор текста\" .  .  .  .  .  .	"+count_114;  ind++ }
 if (count_115!=d)  { mSt[ind]="Удаление формата стихов (\"poem\")   .  .  .  .  .	"+count_115;  ind++ }

 if (cTaT==ind-2) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в этом разделе

//  История
 if (VersionUp ||  HiCh  ||  d)  { mSt[ind]="";  ind++ }
 if (VersionUp  ||  d)                 { mSt[ind]="• Версия файла:  "+versionFile+"  ›››  "+newVersion;  ind++ }
 if (HiCh==1  ||  d)                    { mSt[ind]="• Добавлена новая строка в историю";  ind++ }
 if (HiCh==2  ||  d)                    { mSt[ind]="• Добавлены две строки в историю";  ind++ }
 if (HiCh==3  ||  d)                    { mSt[ind]="• Изменены данные в строке истории";  ind++ }

//  Сборка строк текущей даты и времени
 mSt[ind]="";  ind++;
 mSt[ind]="--------------------------------------------------------------";  ind++;
 mSt[ind]= "• "+currentDate+" • "+currentTime+" •";  ind++;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Вывод окна результатов на экран

 var st2="";  //  текст результатов

 for  ( j=0; j!=ind; j++ )
        st2 += mSt[j] + "\n";  //  добавление элемента из массива


//  Вывод окна результатов
 MsgBox (st2);

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------

}




                 ///  ИСТОРИЯ ИЗМЕНЕНИЙ

//~~~~~~~~~~~~~~~~~~
// v.1.0 — Создание скрипта — Александр Ка (10.05.2024)
// v.1.1 — Исправлена ошибка с добавлением пустых строк — Александр Ка (10.06.2024)
// v.1.2 —  Александр Ка (17.06.2024)
// + Добавление расформатирования внутри стиха:  заголовков, "автор текста", эпиграфов
// + Добавление пустых строк рядом с расформатированными разделами
// v.1.3 — Удаление лишних пустых строк внутри стиха  —  Александр Ка (21.06.2024)
// v.1.4 — Исправлены все ошибки в окнах для win7  —  Александр Ка (19.01.2025)
// v.1.5 — Добавление функции повышения версии файла и запись в историю изменений — Александр Ка (29.04.2025)
//~~~~~~~~~~~~~~~~~~


