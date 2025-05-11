//======================================
//             «Пустые строки рядом с иллюстрациями»
//  Скрипт тестировался в FBE v.2.7.7 (win XP, IE8 и win 7, IE11)
//======================================
//  Скрипт предназначен для полуавтоматического удаления/добавления пустой строки между иллюстрациями и вероятными подписями к ним.
//  * История изменений в конце скрипта
//======================================

function Run() {
 var ScriptName="«Пустые строки рядом с иллюстрациями»";
var NumerusVersion="2.1";
var Ts=new Date().getTime();

// ---------------------------------------------------------------
                 ///  НАСТРОЙКИ
// ---------------------------------------------------------------

         //  • Пустые строки

//     Пустая строка   между   иллюстрацией   и   возможной подписью к ней
var Posle_illjustratsii = 2;      // 0 ; 1 ; 2 ; 3 //      ("0" — всегда удалять, "1" — всегда добавлять, "2" — всегда спрашивать, "3" — ничего не трогать)

//     Пустая строка   между   возможной надписью   и   иллюстрацией
var Pered_illjustratsiej = 2;      // 0 ; 1 ; 2 ; 3 //      ("0" — всегда удалять, "1" — всегда добавлять, "2" — всегда спрашивать, "3" — ничего не трогать)

//     Пустая строка   между   иллюстрациями
var Mezhdu_illjustratsijami = 2;      // 0 ; 1 ; 2 ; 3 //      ("0" — всегда удалять, "1" — всегда добавлять, "2" — всегда спрашивать, "3" — ничего не трогать)

// ---------------------------------------------------------------

       //   •  Удаление внешнего форматирования для строки с графикой (операции 113, 114)
//  Это может быть формат подзаголовка, цитаты или стихов для этой строки
//  Такие операции приводит к удалению отступов рядом с разделом, а значит и рядом с иллюстрацией,
//        а это в свою очередь значит, что после таких операций возможно понадобятся новые пустые строки рядом с картинкой.

 var Vneshnij_format = 1;      // 0 ; 1 //      ("0" — ничего не трогать, "1" — всегда удалять)

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

//   Неразрывный пробел:  "nbspEntity" - для обычного использования; "nbspChar" - используется при временной замене кода "&nbsp;" на прозрачный н/р пробел
 var nbspEntity="&nbsp;";          //  использование кода для н/р пробела
 try {                           // для FBE в котором есть настройки выбора символа для н/р пробела:
         var nbspChar=window.external.GetNBSP();              //  выбранный символ для н/р пробела в FBE
         if (nbspChar.charCodeAt(0)!=160)  nbspEntity=nbspChar;    }        //  для непрозрачных символов, код "&nbsp;" при записи н/р пробела не используется
 catch(e) {                 // для FBE в котором отсутствуют эти настройки, и в котором команда "window.external.GetNBSP()" вызывает ошибку:
         var nbspChar=String.fromCharCode(160);    }       //  символ прозрачного н/р пробела

 //  Внутренние теги  ;  ("+Teg+")  ;
 var Teg = "</{0,1}STRONG>|</{0,1}EM>|</{0,1}SUP>|</{0,1}SUB>|</{0,1}STRIKE>";

 //  Счетчики цикла
 var i = 0;
 var ii = 0;
 var j = 0;
 var n = 0;

 //  Структура текста (аннотация + история + все <body>, иначе говоря, всё это видно в режиме "B"-дизайн)
  var fbwBody=document.getElementById("fbw_body");

  var T_pause=0;  //  продолжительность диалоговых пауз

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


                 /// ОБРАБОТКА ТЕКСТА _1_  :  Параграфы <P>  :  операции  № 1хх
                 //      (регулярные выражения)

         // Чистка пустых строк от пробелов и внутренних тегов
 var re111 = new RegExp("^(\\\s|"+nbspEntity+"|&nbsp;|<[^>]{1,}>){1,}$","g");
 var re111ex = new RegExp("<SPAN [^>]{0,}?class=image","g");
 var re111_ = "";
 var count_111 = 0;

         //  Внутренняя чистка графики в пустом параграфе  (от пробелов и внутренних тегов)
 var re112s = new RegExp("<SPAN [^>]{0,}?class=image","g");
 var re112 = new RegExp("^(&nbsp;|\\\s|"+nbspEntity+"|<[^>]{1,}>){0,}(<SPAN [^>]{0,}?class=image[^>]{1,}>)(<[^>]{1,}>){0,}(<IMG [^>]{1,}>)(&nbsp;|\\\s|"+nbspEntity+"|<[^>]{1,}>){0,}$","g");
 var re112_ = "$2$4</SPAN>";
 var count_112 = 0;
 var q_112 = false;

         // Снятие форматирования "подзаголовок" с графики в пустом параграфе
 var count_113 = 0;

         // Снятие внешнего форматирования с графики в пустом параграфе
 var count_114 = 0;

         //  Счетчик удаления дублей пустых строк
 var count_121 = 0;

         // Снятие внешнего форматирования с пустой строки
 var re122 = new RegExp("^(epigraph|stanza|poem|cite)$","g");  //  класс форматов, разрешенных к очистке
 var count_122 = 0;

         //  Удаление пустых строк на окраине всех разделов, кроме таблиц
 var re123 = new RegExp("^(title|epigraph|image|annotation)$","g"); //  класс блоков:   между ними и концом секции сохраняется пустая строка
 var count_123 = 0;

         //  Удаление пустых строк за окраиной блоков
 var re124 = new RegExp("^(title|annotation|stanza|poem|epigraph|cite|subtitle)$","g");  //  класс блоков
 var count_124 = 0;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОБРАБОТКА ТЕКСТА _1_  :  Параграфы <P>  :  операции  № 1хх
                 //      (сборка функции "HandleP(ptr)")

 var s="";  // Внутреннее содержание оригинального абзаца (<P>содержание</P>)
 var s_="";  // Внутреннее содержание оригинального абзаца (<P>содержание</P>)
 var mImgP=[];  //  массив строк с графикой

 function HandleP(ptr) {

    s=ptr.innerHTML;

         // Чистка пустых строк от пробелов и внутренних тегов
   if (s.search(re111)!=-1  &&  s.search(re111ex)==-1)  { s=s.replace(re111, re111_); count_111++ }

         //  Внутренняя чистка графики в пустом параграфе  (от пробелов и внутренних тегов)
   if (s.search(re112s)!=-1  &&  s.match(re112s).length==1  &&  s.search(re112)!=-1) {
           s_=s.replace(re112, re112_);
           mImgP.push(ptr);
           q_112 = true;
           if (s!=s_) { s=s_; count_112++ }
         // Снятие форматирования "подзаголовок"
         if (ptr.className=="subtitle"  &&  Vneshnij_format == 1)
                 { ptr.removeAttribute("className"); count_113++ }
           }
               else  q_112 = false;


   //  сохранение абзаца в оригинале только в том случае, если он действительно изменен
   if (ptr.innerHTML != s)   ptr.innerHTML=s;

         //  * Далее преобразования выполняются без участия "s"


         // Снятие внешнего форматирования с графики в пустом параграфе
   if (q_112  &&  Vneshnij_format == 1) {
           while (ptr.parentNode !=null  &&  ptr.parentNode.children.length==1
               &&  (ptr.parentNode.className=="cite"  ||  ptr.parentNode.className=="poem"
                   ||  ptr.parentNode.className=="stanza"
                       &&  ptr.parentNode.parentNode !=null  &&  ptr.parentNode.parentNode.children.length==1  &&  ptr.parentNode.parentNode.className=="poem"))
                               { ptr.parentNode.removeNode(false); count_114++ }
         }


         //  ОПЕРАЦИИ с очищенными пустыми строками

          // Начало фильтра пустых строк
   if (ptr.innerHTML ==""  &&  ptr.className !="th"  &&  ptr.className !="td")  //  Пустая строка, которая расположена где угодно, но только не в таблице
           {

         // Удаление первой пустой строки в ряде из двух пустых строк (одного уровня, и под одним общим форматом)
           if (ptr.previousSibling !=null  &&  ptr.previousSibling.innerHTML =="")
                   { ptr.previousSibling.removeNode(true); count_121++ }

           // Удаление внешних тегов для единственной пустой строки
           while (ptr.parentNode !=null                // Пока у пустой строки есть родительский элемент...
               &&  ptr.parentNode.children.length==1                //  ...причем, пустая строка должна быть единственной в этом разделе...
               &&  (ptr.parentNode.className.search(re122)!=-1                //  ...и это может быть эпиграф, стихи, цитата...
                   ||  ptr.parentNode.className =="annotation"   &&  ptr.parentNode.parentNode !=null   &&  ptr.parentNode.parentNode.getAttribute("id") !="fbw_body"))     //  ...или аннотация, которая не в "fbw_body".
                           { ptr.parentNode.removeNode(false); count_122++ }                //  ...всегда удаляем внешнее форматирование

           //  Удаление пустых строк на окраине разделов
           //  Исключение:  пустая строка после картинки, заголовка, эпиграфа или аннотации
           if (ptr.previousSibling ==null  &&  ptr.nextSibling !=null
               ||  ptr.nextSibling ==null  &&  ptr.previousSibling !=null  &&  ptr.previousSibling.className.search(re123) ==-1)
                       { ptr.removeNode(true); count_123++; return }

           //  Удаление пустых строк рядом с разделами и подзаголовками
           //  Исключение:  пустая строка рядом с картинкой
           if (ptr.previousSibling !=null  &&  ptr.nextSibling !=null  &&  ptr.parentNode !=null
               &&  (ptr.previousSibling.className.search(re124) !=-1  &&  ptr.nextSibling.className !="image"
                   ||  ptr.nextSibling.className.search(re124) !=-1  &&  ptr.previousSibling.className !="image"))
                           { ptr.removeNode(true); count_124++; return }

           }         // конец фильтра пустых строк


  }   //  конец создания функции "HandleP(ptr)"

// ---------------------------------------------------------------

 window.external.BeginUndoUnit(document, ScriptName + " v."+NumerusVersion);    // Начало записи в систему отмен.

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОБРАБОТКА ТЕКСТА _1_  :  Параграфы <P>  :  операции  № 1хх
                 //      (применение функции "HandleP")

 var ptr=fbwBody;                  //  Начальное значение переменной "ptr"
 var newPtr = ptr;       //  Элемент, который будет следующим после "ptr"
 var ptrLvl=[];                  //  Все родительские элементы "newPtr"
 var ProcessingEnding=false;  //  Флаг завершения обработки
 j=0;

 while (!ProcessingEnding) {                       //  Если конца текста не видно — ищем новый элемент.
         if (newPtr.nodeName!="P"  &&  newPtr.firstChild!=null) {    //  Если есть куда углубляться, и это всё ещё не параграф...
                 ptrLvl[j]=newPtr;                                              //  сохраняем раздел в массиве родительских элементов
                 j++;
                 newPtr=newPtr.firstChild;                            //  и заходим в этот раздел.
                 }
             else {                                                       //  В противном случае ищем следующий элемент:
                     while (newPtr.nextSibling==null)  {   //  Если нет следующего элемента, то выполняется вложенный цикл, пока он не появится:
                             j--;
                             if (ptrLvl[j])  newPtr=ptrLvl[j];           //  выход из раздела (в т.ч. и из несуществующего)
                             if (j==0)  ProcessingEnding=true;     //  если этот раздел корневой ("fbwBody") - завершение основного цикла.
                             }
                     newPtr=newPtr.nextSibling;              //  Переход на следующий элемент.
                     }
         if (ptr.nodeName=="P") //  Если старый элемент - это параграф...
                 HandleP(ptr);                //  то обрабатываем его функцией "HandleP".
         ptr=newPtr;                      //   Затем меняем старый элемент на новый.
         }

//  * Цикл предусматривает:
// аномалии структуры;
// удаление (функцией "HandleP") параграфа "ptr";
// удаление (функцией "HandleP") любых элементов до "ptr";
// удаление (функцией "HandleP") внешнего форматирования для "ptr".

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОБРАБОТКА ТЕКСТА _2_  :  Разделы "image"  :  операции № 2хх  и  вопросы № 0хх

  var count_001 = 0;  var count_002 = 0;  var count_003 = 0;  var count_004 = 0;  var count_005 = 0;  var count_006 = 0;  var count_007 = 0;
  var count_011 = 0;  var count_012 = 0;  var count_013 = 0;  var count_014 = 0;  var count_015 = 0;  var count_016 = 0;  var count_017 = 0;
  var count_021 = 0;  var count_022 = 0;  var count_023 = 0;  var count_024 = 0;  var count_025 = 0;  var count_026 = 0;
  var count_031 = 0;  var count_032 = 0;  var count_033 = 0;  var count_034 = 0;  var count_035 = 0;  var count_036 = 0;

  var m_001 = [];  var m_002 = [];  var m_003 = [];  var m_004 = [];  var m_005 = [];  var m_006 = [];  var m_007 = [];
  var m_011 = [];  var m_012 = [];  var m_013 = [];  var m_014 = [];  var m_015 = [];  var m_016 = [];  var m_017 = [];
  var m_021 = [];  var m_022 = [];  var m_023 = [];  var m_024 = [];  var m_025 = [];  var m_026 = [];
  var m_031 = [];  var m_032 = [];  var m_033 = [];  var m_034 = [];  var m_035 = [];  var m_036 = [];


//  выявление курсивной строки
 var reEm = new RegExp("^(\\\s|"+nbspEntity+"|[…\\\.\\\(\\\[«„“»”\\\"—–\\\-]|<[^>]{1,}>){0,}<EM>.{1,}</EM>(\\\s|"+nbspEntity+"|[…\\\.,:;\\\?!\\\)\\\]«„“»”\\\"—–\\\-]|<[^>]{1,}>){0,}$","g");

//  выявление полужирной строки
 var reSt = new RegExp("^(\\\s|"+nbspEntity+"|[…\\\.\\\(\\\[«„“»”\\\"—–\\\-]|<[^>]{1,}>){0,}<STRONG>.{1,}</STRONG>(\\\s|"+nbspEntity+"|[…\\\.,:;\\\?!\\\)\\\]«„“»”\\\"—–\\\-]|<[^>]{1,}>){0,}$","g");

 //  выявление графики в параграфе
 var reImgInLine = new RegExp("^<SPAN [^>]{0,}?class=image[^>]{1,}><IMG [^>]{1,}></SPAN>$","g");

 var mDiv=fbwBody.getElementsByTagName("DIV");  //  массив с узлами "DIV"
 var mImg=[];  //  массив с узлами "image"
 var img;                //  одна из картинок


 for (j=0; j<mDiv.length; j++)
         if (mDiv[j].className =="image")
                 mImg.push(mDiv[j]);    // Создание массива с узлами "image"   ("DIV")

 var count_Img=mImg.length;  //  Счетчик иллюстраций (DIV)


 var mSpan=fbwBody.getElementsByTagName("SPAN");  //  массив с узлами "SPAN"
 var _img_P=false;  //  индикатор наличия в книге    графики в строке

 for (j=0; j<mSpan.length; j++)
         if (mSpan[j].className =="image") {
                 _img_P=true;
                 break;
                 }

 var mImgAll=[];  //  массив всей графики
 var pic_id;      //  имя картинки
 var MyImg;   //  текущая иллюстрация

 mImgAll=fbw_body.getElementsByTagName("IMG");

 var count_ImgAll=mImgAll.length-1;  //  Счетчик иллюстраций (всех)

 for (i=count_ImgAll; i>=0; i--) {     //  обновление всех иллюстраций
         MyImg=mImgAll[i];
         pic_id=MyImg.src;
         MyImg.src="";
         MyImg.src=pic_id;
         MyImg.outerHTML=MyImg.outerHTML;   //  достаточно одной перезаписи (в других циклах этой строки нет)
         }

 var count_201 = 0;
 var count_211 = 0;   var count_212 = 0;
 var count_221 = 0;

 var re221ex = new RegExp("^(cite|subtitle||normal|image|title)$","g");  //  класс тегов -- исключения для автоматической редакции

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ЦИКЛ для обычной графики

 for (j=0; j<count_Img; j++) {
         img=mImg[j];

         if (img.parentNode.className =="section") {

                   //  Удаление пустых строк рядом с картинкой в "кармане" секций: <section>[заголовок]+[эпиграфы]+[картинка]+[аннотация]<section>.....</section></section>
                   //  * По правилам FBE, в "кармане" может быть только указанный порядок тегов (если они есть). И между ними не может быть ничего другого, в т.ч. и пустых строк
                   if (img.nextSibling !=null  &&  img.nextSibling.innerHTML ==""
                       &&  img.nextSibling.nextSibling !=null  &&  (img.nextSibling.nextSibling.className =="section"  ||  img.nextSibling.nextSibling.className =="annotation"))
                               { img.nextSibling.removeNode(true); count_201++ }   //  удаление пустой строки после картинки
                   if (img.previousSibling !=null  &&  img.previousSibling.innerHTML ==""
                       &&  img.nextSibling !=null  &&  (img.nextSibling.className =="section"  ||  img.nextSibling.className =="annotation"))
                               { img.previousSibling.removeNode(true); count_201++ }   //  удаление пустой строки перед картинкой

                   //  Удаление пустой строки между границей секции и картинкой   :::   <section>[картинка]........
                   if (img.previousSibling !=null  &&  img.previousSibling.previousSibling ==null  &&  img.previousSibling.innerHTML =="")
                           { img.previousSibling.removeNode(true); count_212++ }

                   //  Вставка пустой строки между картинкой и границей секции (если кроме картинки, в секции больше ничего нет)   :::   ........[картинка]</section>
                   if (img.previousSibling ==null  &&  img.nextSibling ==null) {
                           img.insertAdjacentElement("afterEnd",document.createElement("P"));
                           window.external.inflateBlock(img.nextSibling)=true;
                           count_211++ }

                   //  Удаление пустой строки между картинкой и границей секции (если перед картинкой что-то есть)   :::   ........[картинка]</section>
                   if (img.previousSibling !=null  &&  img.nextSibling !=null  &&  img.nextSibling.nextSibling ==null  &&  img.nextSibling.innerHTML=="")
                           { img.nextSibling.removeNode(true); count_212++ }


                   //  Фильтр для картинок, которые не в "кармане"
                   if (img.nextSibling ==null  ||  img.nextSibling !=null  &&  img.nextSibling.className !="section"  &&  img.nextSibling.className !="annotation")  {

                           //  Вставка пустой строки перед картинкой (внутри секции)
                           if (img.previousSibling !=null  &&  img.previousSibling.innerHTML !=""  &&  img.previousSibling.className.search(re221ex)==-1){
                                       img.insertAdjacentElement("beforeBegin",document.createElement("P"));
                                       window.external.inflateBlock(img.previousSibling)=true;
                                       count_221++ }

                           //  Вставка пустой строки после картинки (внутри секции)
                           if (img.nextSibling !=null  &&  img.nextSibling.innerHTML !=""  &&  img.nextSibling.className.search(re221ex)==-1) {
                                       img.insertAdjacentElement("afterEnd",document.createElement("P"));
                                       window.external.inflateBlock(img.nextSibling)=true;
                                       count_221++ }
                           }

                   }


         //  Поиск и сохранение сочетаний    "Иллюстрация + Текст"

         if (img.parentNode.className =="section"  &&  img.nextSibling !=null  &&  img.nextSibling.innerHTML !="") {

                 //  Иллюстрация + Цитата
                 if (img.nextSibling.className =="cite") {
                         m_001[count_001]=img;
                         count_001++;
                         }

                 //  Иллюстрация + Подзаголовок
                 if (img.nextSibling.className =="subtitle") {
                         m_002[count_002]=img;
                         count_002++;
                         }

                 //  Иллюстрация + Иллюстрация
                 if (img.nextSibling.className =="image") {
                         m_007[count_007]=img;
                         count_007++;
                         }

                 //  Иллюстрация + Обычный текст
                 if (img.nextSibling.className.search(/^(normal|)$/) !=-1) {
                         if (img.nextSibling.innerHTML.search(reEm) !=-1) {
                                 m_003[count_003]=img;
                                 count_003++;             //  курсив, или полужирный курсив
                                 }
                             else  if (img.nextSibling.innerHTML.search(reSt) !=-1) {
                                     m_004[count_004]=img;
                                     count_004++;             //  полужирный шрифт
                                     }
                                 else  if (img.nextSibling.innerHTML.search(reImgInLine) !=-1) {
                                         m_007[count_007]=img;
                                         count_007++;             //  иллюстрация
                                         }
                                     else {
                                             m_005[count_005]=img;
                                             count_005++;             //   без курсива и полужирного шрифта
                                             }
                         }

                 }


         //  Поиск и сохранение сочетаний    "Иллюстрация + Пустая_строка + Текст"

         if (img.parentNode.className =="section"  &&  img.nextSibling !=null  &&  img.nextSibling.innerHTML ==""  &&  img.nextSibling.nextSibling !=null) {

                 //  Иллюстрация + Пустая_строка + Цитата
                 if (img.nextSibling.nextSibling.className =="cite") {
                         m_011[count_011]=img;
                         count_011++;
                         }

                 //  Иллюстрация + Пустая_строка + Подзаголовок
                 if (img.nextSibling.nextSibling.className =="subtitle") {
                         m_012[count_012]=img;
                         count_012++;
                         }

                 //  Иллюстрация + Пустая_строка + Иллюстрация
                 if (img.nextSibling.nextSibling.className =="image") {
                         m_017[count_017]=img;
                         count_017++;
                         }

                 //  Иллюстрация + Пустая_строка + Обычный текст
                 if (img.nextSibling.nextSibling.className.search(/^(normal|)$/) !=-1) {
                         if (img.nextSibling.nextSibling.innerHTML.search(reEm) !=-1) {
                                 m_013[count_013]=img;
                                 count_013++;             //  курсив, или полужирный курсив
                                 }
                             else  if (img.nextSibling.nextSibling.innerHTML.search(reSt) !=-1) {
                                     m_014[count_014]=img;
                                     count_014++;             //  полужирный шрифт
                                     }
                                 else  if (img.nextSibling.nextSibling.innerHTML.search(reImgInLine) !=-1) {
                                         m_017[count_017]=img;
                                         count_017++;             //  иллюстрация
                                         }
                                     else {
                                             m_015[count_015]=img;
                                             count_015++;             //   без курсива и полужирного шрифта
                                             }
                         }

                 }


         //  Поиск и сохранение сочетаний    "Текст + Иллюстрация"

         if (img.parentNode.className =="section"  &&  img.previousSibling !=null  &&  img.previousSibling.innerHTML !="") {

                 //  Цитата + Иллюстрация
                 if (img.previousSibling.className =="cite") {
                         m_021[count_021]=img;
                         count_021++;
                         }

                 //  Подзаголовок + Иллюстрация
                 if (img.previousSibling.className =="subtitle") {
                         m_022[count_022]=img;
                         count_022++;
                         }

                 //  Обычный текст + Иллюстрация
                 if (img.previousSibling.className.search(/^(normal|)$/) !=-1  &&  img.previousSibling.innerHTML.search(reImgInLine) ==-1) {
                         if (img.previousSibling.innerHTML.search(reEm) !=-1) {
                                 m_023[count_023]=img;
                                 count_023++;             //  курсив, или полужирный курсив
                                 }
                             else  if (img.previousSibling.innerHTML.search(reSt) !=-1) {
                                             m_024[count_024]=img;
                                             count_024++;             //  полужирный шрифт
                                             }
                                         else  {
                                                 m_025[count_025]=img;
                                                 count_025++;             //   без курсива и полужирного шрифта
                                                 }
                         }

                 }


         //  Поиск и сохранение сочетаний    "Текст + Пустая_строка + Иллюстрация"

         if (img.parentNode.className =="section"  &&  img.previousSibling !=null  &&  img.previousSibling.innerHTML ==""  &&  img.previousSibling.previousSibling !=null) {

                 //  Цитата + Пустая_строка + Иллюстрация
                 if (img.previousSibling.previousSibling.className =="cite") {
                         m_031[count_031]=img;
                         count_031++;
                         }

                 //  Подзаголовок + Пустая_строка + Иллюстрация
                 if (img.previousSibling.previousSibling.className =="subtitle") {
                         m_032[count_032]=img;
                         count_032++;
                         }

                 //  Обычный текст + Пустая_строка + Иллюстрация
                 if (img.previousSibling.previousSibling.className.search(/^(normal|)$/) !=-1  &&  img.previousSibling.previousSibling.innerHTML.search(reImgInLine) ==-1) {
                         if (img.previousSibling.previousSibling.innerHTML.search(reEm) !=-1) {
                                 m_033[count_033]=img;
                                 count_033++;             //  курсив, или полужирный курсив
                                 }
                             else  if (img.previousSibling.previousSibling.innerHTML.search(reSt) !=-1) {
                                             m_034[count_034]=img;
                                             count_034++;             //  полужирный шрифт
                                             }
                                         else  {
                                                 m_035[count_035]=img;
                                                 count_035++;             //   без курсива и полужирного шрифта
                                                 }
                         }

                 }


         }           //    Конец для     "Цикл для независимых иллюстраций"

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ЦИКЛ строк с графикой

 var count_ImgP=mImgP.length;

 for (j=0; j<count_ImgP; j++) {
         img=mImgP[j];

         //  Поиск и сохранение сочетаний    "<P>Иллюстрация</P> + Обычный текст"
         if (img.nextSibling !=null  &&  img.nextSibling.innerHTML !="") {

                 //  В секциях
                 if (img.parentNode.className =="section"  &&  img.nextSibling.className.search(/^(normal|)$/) !=-1) {
                         if (img.nextSibling.innerHTML.search(reEm) !=-1) {
                                 m_003[count_003]=img;
                                 count_003++;             //  курсив, или полужирный курсив
                                 }
                             else  if (img.nextSibling.innerHTML.search(reSt) !=-1) {
                                     m_004[count_004]=img;
                                     count_004++;             //  полужирный шрифт
                                     }
                                 else  if (img.nextSibling.innerHTML.search(reImgInLine) !=-1) {
                                         m_007[count_007]=img;
                                         count_007++;             //  иллюстрация
                                         }
                                     else {
                                             m_005[count_005]=img;
                                             count_005++;             //   без курсива и полужирного шрифта
                                             }
                         }

                 //  В других разделах
                 if (img.parentNode.className !="section"  &&  img.nextSibling.className.search(/^(normal|)$/) !=-1) {
                         if (img.nextSibling.innerHTML.search(reImgInLine) ==-1) {
                                 m_006[count_006]=img;
                                 count_006++;             //  обычный текст
                                 }
                             else {
                                     m_007[count_007]=img;
                                     count_007++;             //  иллюстрация
                                     }
                         }

                 //  "<P>Иллюстрация</P> + Иллюстрация"
                 if (img.parentNode.className =="section"  &&  img.nextSibling.className =="image") {
                         m_007[count_007]=img;
                         count_007++;
                         }

                 }


         //  Поиск и сохранение сочетаний    "<P>Иллюстрация</P> + Пустая_строка + Обычный текст"
         if (img.nextSibling !=null  &&  img.nextSibling.innerHTML ==""  &&  img.nextSibling.nextSibling !=null) {

                 //  В секциях
                 if (img.parentNode.className =="section"  &&  img.nextSibling.nextSibling.className.search(/^(normal|)$/) !=-1) {
                         if (img.nextSibling.nextSibling.innerHTML.search(reEm) !=-1) {
                                 m_013[count_013]=img;
                                 count_013++;             //  курсив, или полужирный курсив
                                 }
                             else  if (img.nextSibling.nextSibling.innerHTML.search(reSt) !=-1) {
                                     m_014[count_014]=img;
                                     count_014++;             //  полужирный шрифт
                                     }
                                 else  if (img.nextSibling.nextSibling.innerHTML.search(reImgInLine) !=-1) {
                                         m_017[count_017]=img;
                                         count_017++;             //  иллюстрация
                                         }
                                 else {
                                         m_015[count_015]=img;
                                         count_015++;             //   без курсива и полужирного шрифта
                                         }
                         }

                 //  В других разделах
                 if (img.parentNode.className !="section"  &&  img.nextSibling.nextSibling.className.search(/^(normal|)$/) !=-1) {
                         if (img.nextSibling.nextSibling.innerHTML.search(reImgInLine) ==-1) {
                                 m_016[count_016]=img;
                                 count_016++;             //  обычный текст
                                 }
                             else {
                                     m_017[count_017]=img;
                                     count_017++;             //  иллюстрация
                                     }
                         }

                 //  "<P>Иллюстрация</P> + Пустая_строка + Иллюстрация"
                 if (img.parentNode.className =="section"  &&  img.nextSibling.nextSibling.className =="image") {
                         m_017[count_017]=img;
                         count_017++;
                         }

                 }


         //  Поиск и сохранение сочетаний    "Обычный текст + <P>Иллюстрация</P>"
         if (img.previousSibling !=null  &&  img.previousSibling.innerHTML !=""  &&  img.previousSibling.className.search(/^(normal|)$/) !=-1  &&  img.previousSibling.innerHTML.search(reImgInLine) ==-1) {

                 //  В секциях
                 if (img.parentNode.className =="section") {
                         if (img.previousSibling.innerHTML.search(reEm) !=-1) {
                                 m_023[count_023]=img;
                                 count_023++;             //  курсив, или полужирный курсив
                                 }
                             else  if (img.previousSibling.innerHTML.search(reSt) !=-1) {
                                     m_024[count_024]=img;
                                     count_024++;             //  полужирный шрифт
                                     }
                                 else  {
                                         m_025[count_025]=img;
                                         count_025++;             //   без курсива и полужирного шрифта
                                         }
                         }
                     //  В других разделах
                     else {
                             m_026[count_026]=img;
                             count_026++;             //  обычный текст
                             }

                 }


         //  Поиск и сохранение сочетаний    "Обычный текст + Пустая_строка + <P>Иллюстрация</P>"
         if (img.previousSibling !=null  &&  img.previousSibling.innerHTML ==""  &&  img.previousSibling.previousSibling !=null  &&  img.previousSibling.previousSibling.className.search(/^(normal|)$/) !=-1  &&  img.previousSibling.previousSibling.innerHTML.search(reImgInLine) ==-1) {

                 //  В секциях
                 if (img.parentNode.className =="section") {
                         if (img.previousSibling.previousSibling.innerHTML.search(reEm) !=-1) {
                                 m_033[count_033]=img;
                                 count_033++;             //  курсив, или полужирный курсив
                                 }
                             else  if (img.previousSibling.previousSibling.innerHTML.search(reSt) !=-1) {
                                     m_034[count_034]=img;
                                     count_034++;             //  полужирный шрифт
                                     }
                                 else  {
                                         m_035[count_035]=img;
                                         count_035++;             //   без курсива и полужирного шрифта
                                         }
                         }
                     //  В других разделах
                     else {
                             m_036[count_036]=img;
                             count_036++;             //  обычный текст
                             }

                 }

         }         //  Конец для     "Цикл для графики внутри строки"

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///  АВТОМАТИКА

 var count_231 = 0;  var count_232 = 0;
 var count_241 = 0;  var count_242 = 0;
 var count_251 = 0;  var count_252 = 0;

//  Добавление пустых строк между иллюстрацией и возможной   подписью   под ней
 if (Posle_illjustratsii == 1) {
         for (j=0; j<count_001; j++) {
                 m_001[j].insertAdjacentElement("afterEnd",document.createElement("P"));
                 window.external.inflateBlock(m_001[j].nextSibling)=true; }
         for (j=0; j<count_002; j++) {
                 m_002[j].insertAdjacentElement("afterEnd",document.createElement("P"));
                 window.external.inflateBlock(m_002[j].nextSibling)=true; }
         for (j=0; j<count_003; j++) {
                 m_003[j].insertAdjacentElement("afterEnd",document.createElement("P"));
                 window.external.inflateBlock(m_003[j].nextSibling)=true; }
         for (j=0; j<count_004; j++) {
                 m_004[j].insertAdjacentElement("afterEnd",document.createElement("P"));
                 window.external.inflateBlock(m_004[j].nextSibling)=true; }
         for (j=0; j<count_005; j++) {
                 m_005[j].insertAdjacentElement("afterEnd",document.createElement("P"));
                 window.external.inflateBlock(m_005[j].nextSibling)=true; }
         for (j=0; j<count_006; j++) {
                 m_006[j].insertAdjacentElement("afterEnd",document.createElement("P"));
                 window.external.inflateBlock(m_006[j].nextSibling)=true; }
         count_231 = count_001+count_002+count_003+count_004+count_005+count_006;
         }

//  Удаление пустых строк между иллюстрацией и возможной   подписью   под ней
 if (Posle_illjustratsii == 0) {
         for (j=0; j<count_011; j++)
                 m_011[j].nextSibling.removeNode(true);
         for (j=0; j<count_012; j++)
                 m_012[j].nextSibling.removeNode(true);
         for (j=0; j<count_013; j++)
                 m_013[j].nextSibling.removeNode(true);
         for (j=0; j<count_014; j++)
                 m_014[j].nextSibling.removeNode(true);
         for (j=0; j<count_015; j++)
                 m_015[j].nextSibling.removeNode(true);
         for (j=0; j<count_016; j++)
                 m_016[j].nextSibling.removeNode(true);
         count_232 = count_011+count_012+count_013+count_014+count_015+count_016;
         }

//  Добавление пустых строк между иллюстрацией и возможной   надписью   над ней
 if (Pered_illjustratsiej == 1) {
         for (j=0; j<count_021; j++) {
                 m_021[j].insertAdjacentElement("beforeBegin",document.createElement("P"));
                 window.external.inflateBlock(m_021[j].previousSibling)=true; }
         for (j=0; j<count_022; j++) {
                 m_022[j].insertAdjacentElement("beforeBegin",document.createElement("P"));
                 window.external.inflateBlock(m_022[j].previousSibling)=true; }
         for (j=0; j<count_023; j++) {
                 m_023[j].insertAdjacentElement("beforeBegin",document.createElement("P"));
                 window.external.inflateBlock(m_023[j].previousSibling)=true; }
         for (j=0; j<count_024; j++) {
                 m_024[j].insertAdjacentElement("beforeBegin",document.createElement("P"));
                 window.external.inflateBlock(m_024[j].previousSibling)=true; }
         for (j=0; j<count_025; j++) {
                 m_025[j].insertAdjacentElement("beforeBegin",document.createElement("P"));
                 window.external.inflateBlock(m_025[j].previousSibling)=true; }
         for (j=0; j<count_026; j++) {
                 m_026[j].insertAdjacentElement("beforeBegin",document.createElement("P"));
                 window.external.inflateBlock(m_026[j].previousSibling)=true; }
         count_241 = count_021+count_022+count_023+count_024+count_025+count_026;
         }

//  Удаление пустых строк между иллюстрацией и возможной   надписью   над ней
 if (Pered_illjustratsiej == 0) {
         for (j=0; j<count_031; j++)
                 m_031[j].previousSibling.removeNode(true);
         for (j=0; j<count_032; j++)
                 m_032[j].previousSibling.removeNode(true);
         for (j=0; j<count_033; j++)
                 m_033[j].previousSibling.removeNode(true);
         for (j=0; j<count_034; j++)
                 m_034[j].previousSibling.removeNode(true);
         for (j=0; j<count_035; j++)
                 m_035[j].previousSibling.removeNode(true);
         for (j=0; j<count_036; j++)
                 m_036[j].previousSibling.removeNode(true);
         count_242 = count_031+count_032+count_033+count_034+count_035+count_036;
         }

//  Добавление пустых строк между иллюстрациями
 if (Mezhdu_illjustratsijami == 1) {
         for (j=0; j<count_007; j++) {
                 m_007[j].insertAdjacentElement("afterEnd",document.createElement("P"));
                 window.external.inflateBlock(m_007[j].nextSibling)=true; }
         count_251 += count_007;
         }

//  Удаление пустых строк между иллюстрациями
 if (Mezhdu_illjustratsijami == 0) {
         for (j=0; j<count_017; j++)
                 m_017[j].nextSibling.removeNode(true);
         count_252 += count_017;
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ФУНКЦИЯ ПЕРЕХОДА

//  Пространство текстового окна, свободное от пустой строки (elem), делится оной по высоте на две части, в пропорции в соответствии с коэффициентом (k).
//  для k=0.75  -  75% : 25%
//  для k=0.25  -  25% : 75%
//  для k=0.5  -  50% : 50%
// * В отличии от встроенной функции "GoTo", проверки на излишнюю высоту раздела (elem) здесь нет. И положение курсора тоже не меняется.

 function GoTo_2(elem, k) {
         var b=elem.getBoundingClientRect();                  //  Получение координат элемента.
         var c=fbwBody.parentNode.getBoundingClientRect();        //  Получение координат раздела <BODY>.
         window.scrollBy(c.left, b.top+(b.bottom-b.top-window.external.getViewHeight())*k);
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ нескольких ИЛЛЮСТРАЦИЙ после указанного элемента (включая и его)
                 // * обновление вернет на место "сдвинутые" иллюстрации

 var nextP;              //  Раздел
 var mImgR=[];    //  Массив для иллюстраций из одной строки

 function updateImg (nextP) {
         if (! _img_P) return;        //  Если в тексте нет иллюстраций в строке - выход из этой функции.
         for (ii=0; ii<10; ii++) {        //  Проверяется 10 разделов.
                 if (nextP.nodeName =="P"  &&  nextP.innerHTML.search("<IMG ") != -1) {       //  Если найденный раздел - параграф, в котором есть тег <IMG>...
                         mImgR = nextP.getElementsByTagName("IMG");            //  Получаем массив с разделами <IMG>
                         for (i=mImgR.length-1; i>=0; i--) {                                         //  и перезаписываем имена иллюстраций.
                                 MyImg=mImgR[i];
                                 pic_id=MyImg.src;
                                 MyImg.src="";
                                 MyImg.src=pic_id;
                                 }
                         }
                 if (nextP.nodeName != "P"  &&  nextP.firstChild)  //  Если найденный раздел - не параграф, и в нем есть другие элементы...
                         nextP=nextP.firstChild;                                            //  переходим на самый первый элемент этого раздела.
                     else {                                                                     //  Иначе...
                             while (! nextP.nextSibling)  {                    //  пока не появится у нашего элемента сосед справа...
                                     nextP=nextP.parentNode;                 //   выходим из разделов.
                                     if (nextP == fbwBody) return;    //  А если при этом процессе оказываемся в корневом разделе, то выходим из этой функции.
                                     }
                             nextP=nextP.nextSibling;              //  Сосед справа есть - Переходим на следующий элемент.
                             }
                 }
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ФУНКЦИИ ПРОСМОТРА, УДАЛЕНИЯ И ДОБАВЛЕНИЯ ПУСТЫХ СТРОК

 var reSrc = new RegExp("^(.{0,}?<IMG[^>]{1,}?src=\\\"fbw-internal:#)([^\\\">]{1,})(\\\">.{0,})$","g");
 var reSrc_ = " \"$2\"";
 var msgSrc1="";
 var msgSrc2="";

 var otvet_1=0;
 var mass=[];
 var count;
 var msgTitle="";

 var ELine;           // пустая строка
 var E_line_div;   //  родительский раздел со стилем для пустой строки

 var f_run=false;    //  Индикатор запуска функций просмотра/изменения
 var Centrum=false;    //  Положение пустой строки (центр экрана) для сочетания "Иллюстрация+Иллюстрация"

         //  Функция просмотра и добавления пустой строки после иллюстрации
 function addNext(msgTitle, mass, count, Centrum) {
 f_run=true;
 n=0;
 while (n < count) {                                                                            //  Окно ввода будет запускаться, пока не будут просмотрены все элементы массива
         msgSrc1=mass[n].innerHTML.replace(reSrc, reSrc_);   //  Имя иллюстрации
         ELine=document.createElement("P");                   //  Создаем и обозначаем пустую строку.
         window.external.inflateBlock(ELine)=true;     //  "легализуем".
         E_line_div = document.createElement("DIV");   //  Создаем раздел стилей для пустой строки.
         E_line_div.insertAdjacentElement("afterBegin", ELine);       //   Производим вставку пустой строки в этот раздел.
         mass[n].insertAdjacentElement("afterEnd", E_line_div);       //   Производим добавление в текст - раздела с пустой строкой
         E_line_div.style.backgroundColor="#B08CD1";        //  Выделяем фон (сиреневый)
         E_line_div.style.border="none";                                      //  и убираем рамку.
         updateImg (mass[n]);                                                 //  Обновляем соседние иллюстрации.
         if (Centrum) {
                 GoTo_2(ELine, 0.5);                                       //  Переход на пустую строку.
                 msgSrc2=mass[n].nextSibling.nextSibling.innerHTML.replace(reSrc, reSrc_);   //  Имя 2-й иллюстрации.
                 }
             else {
                     GoTo_2(ELine, 0.75);                                       //  Переход на пустую строку.
                     msgSrc2="";                                                        //  Имя 2-й иллюстрации.
                     }
         T_pause -= new Date().getTime();                                   // определение продолжительности паузы в вычислениях
         window.external.InputBox(" • "+(n+1)+" из "+count+" •  \n"+"                        ◊  Сохранить добавленную пустую строку?", msgTitle.replace("ция", "ция"+msgSrc1)+msgSrc2, "");
         T_pause += new Date().getTime();                                 // определение продолжительности паузы в вычислениях
         E_line_div.removeNode(false);         //  Удаляем раздел со стилем.
         otvet_1 = window.external.GetModalResult();                                //  Сохранение кода нажатой кнопки.
         if (otvet_1 ==6)                   //   Если нажата кнопка "Да":
                 count_231++;             //   фиксируем добавление пустой строки.
             else                                                      //  В любом другом случае  ("Нет" или "Отмена")
                     ELine.removeNode(true);    //   удаляем добавленную строку.
         if (otvet_1 ==2)                 //   Если нажата кнопка "Отмена":
                 return;                        //   выход из "функции просмотра и добавления пустых строк".
         n++;                      //   Увеличение номера элемента в массиве
         }
 }

         //  Функция просмотра и удаления пустой строки после иллюстрации
 function delNext(msgTitle, mass, count, Centrum) {
 f_run=true;
 n=0;
 while (n < count) {                                                                            //  Окно ввода будет запускаться, пока не будут просмотрены все элементы массива
         msgSrc1=mass[n].innerHTML.replace(reSrc, reSrc_);   //  Имя иллюстрации
         ELine=mass[n].nextSibling;                           //  Обозначаем пустую строку.
         E_line_div = document.createElement("DIV");   //  Создаем раздел стилей для пустой строки.
         E_line_div.insertAdjacentElement("afterBegin", ELine);       //   Производим вставку пустой строки в этот раздел.
         mass[n].insertAdjacentElement("afterEnd", E_line_div);       //   Производим добавление в текст раздела с пустой строкой
         E_line_div.style.backgroundColor="#E0837F";        //  Выделяем фон (красный)
         E_line_div.style.border="none";                                      //  и убираем рамку.
         updateImg (mass[n]);                                                 //  Обновляем соседние иллюстрации.
         if (Centrum) {
                 GoTo_2(ELine, 0.5);                                       //  Переход на пустую строку.
                 msgSrc2=mass[n].nextSibling.nextSibling.innerHTML.replace(reSrc, reSrc_);   //  Имя 2-й иллюстрации.
                 }
             else {
                     GoTo_2(ELine, 0.75);                                       //  Переход на пустую строку.
                     msgSrc2="";                                                        //  Имя 2-й иллюстрации.
                     }
         T_pause -= new Date().getTime();                                   // определение продолжительности паузы в вычислениях
         window.external.InputBox(" • "+(n+1)+" из "+count+" •  \n"+"                        ◊  Удалить пустую строку?", msgTitle.replace("ция", "ция"+msgSrc1)+msgSrc2, "");
         T_pause += new Date().getTime();                                 // определение продолжительности паузы в вычислениях
         E_line_div.removeNode(false);         //  Удаляем раздел со стилем.
         otvet_1 = window.external.GetModalResult();                     //  Сохранение кода нажатой кнопки.
         if (otvet_1 ==6) {                                 //   Если нажата кнопка "Да":
                 ELine.removeNode(true);      //   производим удаление пустой строки
                 count_232++;                              //   и фиксируем это удаление.
                 }
         if (otvet_1 ==2)                 //   Если нажата кнопка "Отмена":
                 return;                        //   выход из "функции просмотра и добавления пустых строк".
         n++;                      //   Увеличение номера элемента в массиве
         }
 }

         //  Функция просмотра и добавления пустой строки перед иллюстрацией
 function addPrev(msgTitle, mass, count) {
 f_run=true;
 n=0;
 while (n < count) {                                                                            //  Окно ввода будет запускаться, пока не будут просмотрены все элементы массива
         msgSrc1=mass[n].innerHTML.replace(reSrc, reSrc_);   //  Имя иллюстрации
         ELine=document.createElement("P");                   //  Создаем и обозначаем пустую строку.
         window.external.inflateBlock(ELine)=true;     //  "легализуем".
         E_line_div = document.createElement("DIV");   //  Создаем раздел стилей для пустой строки.
         E_line_div.insertAdjacentElement("afterBegin", ELine);       //   Производим вставку пустой строки в этот раздел.
         mass[n].insertAdjacentElement("beforeBegin", E_line_div);       //   Производим добавление в текст раздела с пустой строкой
         E_line_div.style.backgroundColor="#B08CD1";        //  Выделяем фон (сиреневый)
         E_line_div.style.border="none";                                      //  и убираем рамку.
         updateImg (mass[n]);                                                 //  Обновляем соседние иллюстрации.
         GoTo_2(ELine, 0.25);                                                          //  Переход на пустую строку.
         T_pause -= new Date().getTime();                                   // определение продолжительности паузы в вычислениях
         window.external.InputBox(" • "+(n+1)+" из "+count+" •  \n"+"                        ◊  Сохранить добавленную пустую строку?", msgTitle.replace("ция", "ция"+msgSrc1), "");
         T_pause += new Date().getTime();                                 // определение продолжительности паузы в вычислениях
         E_line_div.removeNode(false);         //  Удаляем раздел со стилем.
         otvet_1 = window.external.GetModalResult();                                //  Сохранение кода нажатой кнопки.
         if (otvet_1 ==6)                   //   Если нажата кнопка "Да":
                 count_241++;             //   фиксируем добавление пустой строки.
             else                                                      //  В любом другом случае  ("Нет" или "Отмена")
                     ELine.removeNode(true);    //   удаляем добавленную строку.
         if (otvet_1 ==2)                 //   Если нажата кнопка "Отмена":
                 return;                        //   выход из "функции просмотра и добавления пустых строк".
         n++;                      //   Увеличение номера элемента в массиве
         }
 }

         //  Функция просмотра и удаления пустой строки перед иллюстрацией
 function delPrev(msgTitle, mass, count) {
 f_run=true;
 n=0;
 while (n < count) {                                                                            //  Окно ввода будет запускаться, пока не будут просмотрены все элементы массива
         msgSrc1=mass[n].innerHTML.replace(reSrc, reSrc_);   //  Имя иллюстрации
         ELine=mass[n].previousSibling;                           //  Обозначаем пустую строку.
         E_line_div = document.createElement("DIV");   //  Создаем раздел стилей для пустой строки.
         E_line_div.insertAdjacentElement("afterBegin", ELine);       //   Производим вставку пустой строки в этот раздел.
         mass[n].insertAdjacentElement("beforeBegin", E_line_div);       //   Производим добавление в текст раздела с пустой строкой
         E_line_div.style.backgroundColor="#E0837F";        //  Выделяем фон (красный)
         E_line_div.style.border="none";                                      //  и убираем рамку.
         updateImg (mass[n]);                                                 //  Обновляем соседние иллюстрации.
         GoTo_2(ELine, 0.25);                                                          //  Переход на пустую строку.
         T_pause -= new Date().getTime();                                   // определение продолжительности паузы в вычислениях
         window.external.InputBox(" • "+(n+1)+" из "+count+" •  \n"+"                        ◊  Удалить пустую строку?", msgTitle.replace("ция", "ция"+msgSrc1), "");
         T_pause += new Date().getTime();                                 // определение продолжительности паузы в вычислениях
         E_line_div.removeNode(false);         //  Удаляем раздел со стилем.
         otvet_1 = window.external.GetModalResult();                     //  Сохранение кода нажатой кнопки.
         if (otvet_1 ==6) {                                 //   Если нажата кнопка "Да":
                 ELine.removeNode(true);      //   производим удаление пустой строки
                 count_242++;                              //   и фиксируем это удаление.
                 }
         if (otvet_1 ==2)                 //   Если нажата кнопка "Отмена":
                 return;                        //   выход из "функции просмотра и добавления пустых строк".
         n++;                      //   Увеличение номера элемента в массиве
         }
 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ДЕМОНСТРАЦИОННЫЙ РЕЖИМ "Показать все строки"

 var VseStroki_on_off = 0;      // 0 ; 1 //      ("0" — отключить, "1" — включить)

 var d=0;
 if (VseStroki_on_off == 1)
         d="показать нули";

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ВОПРОСЫ

 var st1="";
 var m1=[];
 var ind=0;
 var cTaT0=0;

 if (Posle_illjustratsii == 2) {
         if (count_001!=d)  { m1[ind] = "Иллюстрация + Цитата  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_001;  ind++ }
         if (count_002!=d)  { m1[ind] = "Иллюстрация + Подзаголовок .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_002;  ind++ }
         if (count_003!=d)  { m1[ind] = "Иллюстрация + Курсив   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_003;  ind++ }
         if (count_004!=d)  { m1[ind] = "Иллюстрация + Полужирный текст  .  .  .  .  .  .  .  .  .  .	"+count_004;  ind++ }
         if (count_005!=d)  { m1[ind] = "Иллюстрация + Обычный текст .  .  .  .  .  .  .  .  .  .  .  .	"+count_005;  ind++ }
         if (count_006!=d)  { m1[ind] = "Иллюстрация + Текст /в блоке/ .  .  .  .  .  .  .  .  .  .  .  .	"+count_006;  ind++ }
         if (cTaT0!=ind)  { m1[ind] = "";  ind++;  cTaT0=ind }   //  Добавление пустой строки, если есть пункты в разделе
         if (count_011!=d)  { m1[ind] = "Иллюстрация + Пустая  строка + Цитата  .  .  .  .  .  .  .	"+count_011;  ind++ }
         if (count_012!=d)  { m1[ind] = "Иллюстрация + Пустая  строка + Подзаголовок  .  .  .	"+count_012;  ind++ }
         if (count_013!=d)  { m1[ind] = "Иллюстрация + Пустая  строка + Курсив  .  .  .  .  .  .  .	"+count_013;  ind++ }
         if (count_014!=d)  { m1[ind] = "Иллюстрация + Пустая  строка + Полужирный текст 	"+count_014;  ind++ }
         if (count_015!=d)  { m1[ind] = "Иллюстрация + Пустая  строка + Обычный текст   .  .	"+count_015;  ind++ }
         if (count_016!=d)  { m1[ind] = "Иллюстрация + Пустая  строка + Текст /в блоке/ .  .  .	"+count_016;  ind++ }
         if (cTaT0!=ind)  { m1[ind] = "";  ind++;  cTaT0=ind }   //  Добавление пустой строки, если есть пункты в разделе
         }
 if (Pered_illjustratsiej == 2) {
         if (count_021!=d)  { m1[ind] = "Цитата + Иллюстрация  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_021;  ind++ }
         if (count_022!=d)  { m1[ind] = "Подзаголовок + Иллюстрация .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_022;  ind++ }
         if (count_023!=d)  { m1[ind] = "Курсив + Иллюстрация   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_023;  ind++ }
         if (count_024!=d)  { m1[ind] = "Полужирный текст + Иллюстрация  .  .  .  .  .  .  .  .  .  .	"+count_024;  ind++ }
         if (count_025!=d)  { m1[ind] = "Обычный текст + Иллюстрация .  .  .  .  .  .  .  .  .  .  .  .	"+count_025;  ind++ }
         if (count_026!=d)  { m1[ind] = "Текст + Иллюстрация /в блоке/  .  .  .  .  .  .  .  .  .  .  .  .	"+count_026;  ind++ }
         if (cTaT0!=ind)  { m1[ind] = "";  ind++;  cTaT0=ind }   //  Добавление пустой строки, если есть пункты в разделе
         if (count_031!=d)  { m1[ind] = "Цитата + Пустая  строка + Иллюстрация  .  .  .  .  .  .  .	"+count_031;  ind++ }
         if (count_032!=d)  { m1[ind] = "Подзаголовок + Пустая  строка + Иллюстрация  .  .  .	"+count_032;  ind++ }
         if (count_033!=d)  { m1[ind] = "Курсив + Пустая  строка + Иллюстрация  .  .  .  .  .  .  .	"+count_033;  ind++ }
         if (count_034!=d)  { m1[ind] = "Полужирный текст + Пустая  строка + Иллюстрация 	"+count_034;  ind++ }
         if (count_035!=d)  { m1[ind] = "Обычный текст + Пустая  строка + Иллюстрация   .  .	"+count_035;  ind++ }
         if (count_036!=d)  { m1[ind] = "Текст + Пустая  строка + Иллюстрация /в блоке/ .  .  .	"+count_036;  ind++ }
         if (cTaT0!=ind)  { m1[ind] = "";  ind++ }   //  Добавление пустой строки, если есть пункты в разделе
         }
 if (Mezhdu_illjustratsijami == 2  ||  d) {
         if (count_007!=d)  { m1[ind] = "Иллюстрация + Иллюстрация  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_007;  ind++ }
         if (count_017!=d)  { m1[ind] = "Иллюстрация + Пустая  строка + Иллюстрация .  .  .  .	"+count_017;  ind++ }
         if (cTaT0!=ind)  { m1[ind] = "";  ind++ }   //  Добавление пустой строки, если есть пункты в разделе
         }


 var otvet_2;

 for (j=0; j<ind; j++)
         st1 += m1[j] + "\n";
 if (ind != 0) {
         T_pause -= new Date().getTime();                                   // определение продолжительности паузы в вычислениях
         otvet_2 = AskYesNo("  • НАЙДЕНО\n"+
                                             "· · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·                              \n"+
                                             "						       \n"+
                                             st1+
                                             "\n                                   Продолжить?");
         T_pause += new Date().getTime();                                   // определение продолжительности паузы в вычислениях

         if (otvet_2  &&  Posle_illjustratsii == 2) {
                 if (count_001!=0)  addNext(" •  Иллюстрация  +  Цитата", m_001, count_001, false);
                 if (count_002!=0)  addNext(" •  Иллюстрация  +  Подзаголовок", m_002, count_002, false);
                 if (count_003!=0)  addNext(" •  Иллюстрация  +  Курсивный текст", m_003, count_003, false);
                 if (count_004!=0)  addNext(" •  Иллюстрация  +  Полужирный текст", m_004, count_004, false);
                 if (count_005!=0)  addNext(" •  Иллюстрация  +  Обычный текст", m_005, count_005, false);
                 if (count_006!=0)  addNext(" •  Иллюстрация  +  Текст  /в блоке/", m_006, count_006, false);
                 if (count_011!=0)  delNext(" •  Иллюстрация  +  Пустая  строка  +  Цитата", m_011, count_011, false);
                 if (count_012!=0)  delNext(" •  Иллюстрация  +  Пустая  строка  +  Подзаголовок", m_012, count_012, false);
                 if (count_013!=0)  delNext(" •  Иллюстрация  +  Пустая  строка  +  Курсивный текст", m_013, count_013, false);
                 if (count_014!=0)  delNext(" •  Иллюстрация  +  Пустая  строка  +  Полужирный текст", m_014, count_014, false);
                 if (count_015!=0)  delNext(" •  Иллюстрация  +  Пустая  строка  +  Обычный текст", m_015, count_015, false);
                 if (count_016!=0)  delNext(" •  Иллюстрация  +  Пустая  строка  +  Текст  /в блоке/", m_016, count_016, false);
                 }

         if (otvet_2  &&  Pered_illjustratsiej == 2) {
                 if (count_021!=0)  addPrev(" •  Цитата + Иллюстрация", m_021, count_021);
                 if (count_022!=0)  addPrev(" •  Подзаголовок + Иллюстрация", m_022, count_022);
                 if (count_023!=0)  addPrev(" •  Курсивный текст + Иллюстрация", m_023, count_023);
                 if (count_024!=0)  addPrev(" •  Полужирный текст + Иллюстрация", m_024, count_024);
                 if (count_025!=0)  addPrev(" •  Обычный текст + Иллюстрация", m_025, count_025);
                 if (count_026!=0)  addPrev(" •  Текст + Иллюстрация  /в блоке/", m_026, count_026);
                 if (count_031!=0)  delPrev(" •  Цитата + Пустая  строка + Иллюстрация", m_031, count_031);
                 if (count_032!=0)  delPrev(" •  Подзаголовок + Пустая  строка + Иллюстрация", m_032, count_032);
                 if (count_033!=0)  delPrev(" •  Курсивный текст + Пустая  строка + Иллюстрация", m_033, count_033);
                 if (count_034!=0)  delPrev(" •  Полужирный текст + Пустая  строка + Иллюстрация", m_034, count_034);
                 if (count_035!=0)  delPrev(" •  Обычный текст + Пустая  строка + Иллюстрация", m_035, count_035);
                 if (count_036!=0)  delPrev(" •  Текст + Пустая  строка + Иллюстрация  /в блоке/", m_036, count_036);
                 }

         if (otvet_2  &&  Mezhdu_illjustratsijami == 2) {
                 if (count_007!=0) {
                         var count_231_0 = count_231;
                         addNext(" •  Иллюстрация  +  Иллюстрация", m_007, count_007, true);
                         count_251 = count_231-count_231_0;    //  переброска добавленного - из счетчика №231 в №251
                         count_231 = count_231_0;
                         }
                 if (count_017!=0) {
                         var count_232_0 = count_232;
                         delNext(" •  Иллюстрация  +  Пустая  строка  +  Иллюстрация", m_017, count_017, true);
                         count_252 = count_232-count_232_0;    //  переброска добавленного - из счетчика №232 в №252
                         count_232 = count_232_0;
                         }
                 }
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 // Подсчет общего количества исправлений
 var itogi = count_111 + count_112 + count_113 + count_114 + count_121 + count_122 + count_123 + count_124 + count_201 + count_211 + count_212 + count_221 + count_231 + count_232 + count_241 + count_242 + count_251 + count_252;

 if (itogi != 0)  window.focus();  // Удаление курсора из текста, при результативной обработке


 if (_img_P  &&  (f_run  ||  itogi))       //  если в тексте есть графика в тексте и что-то поменялось ...
         for (i=count_ImgAll; i>=0; i--) {     //  обновление всех иллюстраций (обновление вернет на место "сдвинутые" иллюстрации)
                 MyImg=mImgAll[i];
                 pic_id=MyImg.src;
                 MyImg.src="";
                 MyImg.src=pic_id;
                 }

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


                 /// СОЗДАНИЕ СПИСКА ЦИТАТ

//  Из книги "Пословицы и поговорки Великой Отечественной войны"
//  (составитель Павел Федорович Лебедев)

 var Kn=[ "Одна у человека мать, одна у него и Родина.",   "Родина любимая – мать родимая.",   "Родина – мать, умей за нее постоять.",   "Где ни жить – Родине служить.",   "С Родиной разлука – одна мука.",   "Всякому мила своя сторона.",   "Своя земля и в горсти мила.",   "На чужой стороне и весна не красна.",   "Где кто родится, там и пригодится.",   "На чужбине родная землица во сне снится.",   "На своей стороне мило, на чужой – постыло.",   "На чужой стороне и сокола зовут вороною.",   "Всякая сосна своему лесу весть подает.",   "Родная страна – колыбель, чужая – дырявое корыто.",   "На солнце тепло, на родине добро.",   "Человек без Родины что соловей без песни.",   "Глупа та птица, которой свое гнездо не мило.",   "Кукушка кукует – по бездомью горюет.",   "Расставшийся с другом плачет семь лет, расставшийся с Родиной – всю жизнь.",   "Нет ничего на свете краше, чем Родина наша.",   "Нашей страны шире не найти в мире.",   "Русское раздолье – человеку приволье.",   "Богата русская земля – говорится не зря.",   "Я тобой горжусь, милая Русь.",   "Человек без Родины что солдат без оружия.",   "Счастье Родины дороже жизни.",   "Береги страну как зеницу ока.",   "Может, и голову сложу, а Родине послужу.",   "Нам Отчизна дорога, охраняем родные берега.",   "Пусть знает ворог: нам край свой дорог.",   "Кто любовь к Отчизне имеет, тот врага одолеет.",   "Мы бережем свою Родину-мать, за нее мы готовы жизнь отдать.",   "С нами родная земля, нам светят звезды Кремля.",   "Великие победы нас ждут впереди под лучами красной звезды.",   "Красная звезда светит всегда.",   "Теперь все дороги ведут в Москву.",   "Москва от глаз далека, да сердцу близка.",   "Москва – наша столица, Москвой народ гордится.",   "Москва – всем столицам голова.",   "Москва – столица, любо подивиться.",   "У русской столицы не видать границы.",   "По Москве ходить – глаз с нее не сводить.",   "Москва – Родины украшенье, врагам устрашение.",   "Кремль тем и красен, что с народом согласен.",   "Наша страна дружбой сильна.",   "У нас все народы живут в ладу – врагам на беду.",   "Солнце не померкнет над нами, братство – наша сила и знамя.",   "Народное братство дороже всякого богатства.",   "Если дружба велика, будет Родина крепка.",   "Дружбу нашу не разделят просторы, моря и горы.",   "Страна растет – врагов метет.",   "Не тот человек, кто для себя живет, а тот человек, кто народу силы отдает.",   "За Родину и народ иду вперед.",   "Человек без народа что дерево без плода.",   "Чтобы с врагами биться, надо всем сплотиться.",   "Не трудно врагов победить, если всем заодно быть.",   "Наш народ сплочен и един, он непобедим.",   "Кто на нас нападает, тот в могилу попадает.",   "Россия с давних пор давала врагу отпор.",   "Никогда Россия ярма не носила.",   "За наше Отечество все человечество.",   "Не летать фашистским стаям над нашим краем.",   "Мы не боимся свинцовой тучи: наши полки могучи.",   "Кто на Советский Союз покушается, тот после раскается.",   "Бей фашистов не в бровь, а в глаз – таков народа наказ.",   "Любовь к народу, ненависть к врагу – душа победы.",   "От Родины награда – сердцу отрада.",   "Отчизна родная – для нас святая.",   "Знает свет: тверже русских нет.",   "Наш народ – герой, ходит на врага стеной.",   "Сыновья русских матерей славятся удалью богатырей.",   "Наша страна героями славится.",   "Кто за Родину горой – тот истинный герой.",   "Без патриотизма не разбить фашизма.",   "Защищай Советскую державу, бей фашистскую ораву.",   "Фашистам смерть неси – не опозорь Руси.",   "Даю Родине слово: мстить фашистам сурово.",   "Во имя Отчизны своей где фашиста увидел – бей.",   "За народное дело бейся смело.",   "Для Родины своей ни сил, ни жизни не жалей.",   "Жизнь отдам, а Родину не продам.",   "С родной земли – умри не сходи.",   "За Родину-мать не страшно умирать.",   "За Родину жизни не пощадим, но врагу ничего не отдадим.",   "Кому нашей земли захочется, тот под ней скорчится.",   "Родину любить – фашистов бить.",   "Бей фашистский сброд – за Родину, за народ.",   "Родину любить – верно Родине служить.",   "Родину беречь – врагов сечь.",   "Для нас война не страх – развеем врага в прах.",   "Гитлер пришел к нам незваным, а уйдет от нас драным.",   "Не придется Гитлеру из Ленинграда сделать море, а из Москвы – поле.",   "Думал Гитлер нашими землями управлять, а придется ему подыхать.",   "Штык советский молодец – скоро Гитлеру конец.",   "У Гитлера не столько расчетов, сколько просчетов.",   "Гитлер предполагает, а Красная Армия располагает.",   "Посмотрим, как Гитлер завоет, когда наши огонь по Берлину откроют.",   "Раздавим Гитлера в блин, как придем в Берлин.",   "Гитлеру-палачу местью отплачу.",   "Пора с Гитлером кончать – хватит ему рычать.",   "Гитлер и его правительство ответят за грабительство.",   "Гитлер кричит, мы весь свет разрушим, а мы Гитлера наперед задушим.",   "Сколько Гитлер ни крути, а от петли не уйти.",   "Гитлер победами хвалится, да в могилу свалится.",   "Хотел Гитлер Россию съесть, да пришлось в лужу сесть.",   "Не довелось свинье на небо дивиться, а Гитлеру в нашем огороде рыться.",   "Медведя знают по когтям, а Геббельса по лживым речам.",   "Фашистские собаки сочиняют враки.",   "Фашист брехней живет.",   "Солдаты у Гитлера вшивы, сводки у Геббельса лживы.",   "От осины не жди ягоды, от фашиста – правды.",   "Геббельс вертит языком без меры, да нет ему веры.",   "Геббельс мелет, да никто ему не верит.",   "Германия вот-вот развалится, а Геббельс все хвалится.",   "Германия пылает, а Геббельс все лает.",   "Врет, как фашистский бюллетень.",   "Как Геббельс ни врет, а наша берет.",   "Против фашистской лжи ухо востро держи.",   "Фашистские оковы всей Европе знакомы.",   "Лучше волку в зубы, чем фашистам в руки.",   "Фашист гладок, да вид его гадок.",   "Фашист от когтей до носа похож на барбоса.",   "Фашист и сатана – сущность одна.",   "Не ищи в фашисте человека – не найдешь.",   "Легче шакала превратить в голубя, чем фашиста в человека.",   "Фашистов легче убить, чем вразумить.",   "Фашистская власть – грабить и красть.",   "У фашистов особый спорт: кто больше добра сопрет.",   "Видно птицу по полету, а фашиста – по грабежам.",   "Сколько фашисту ни воровать, а виселицы не миновать.",   "Для предателя сгори хоть целый свет, лишь бы он был согрет.",   "Змея один раз в год меняет кожу, а предатель – каждый день.",   "Предатель фашисту пятки лизал, а фашист и спасибо не сказал.",   "У предателя ни Родины, ни друзей.",   "Лучше глаза лишиться, чем доброго имени.",   "Героям – слава, предателям – смерть.",   "Слава греет, позор жжет.",   "Бесчестье хуже смерти.",   "Кто с врагами пьет и гуляет, того и земля не принимает.",   "Думал фриц нашим богатством нажиться, да пришлось в могилу ложиться.",   "Не видать свинье неба, а фашистам нашего хлеба.",   "Кого к столу приглашают, а в фашиста пулю сажают.",   "Кому чарка, кому две, а фашисту – камнем по голове.",   "Угостили фашистов не водкой, а прямой наводкой.",   "Врага не уговаривай: с ним штыком разговаривай.",   "Убил фашистского гада – душа рада.",   "Съели бы фашисты русского мужика, да кишка тонка.",   "Одного фашиста убить – сто детей спасти.",   "Фашиста убить что змею: сто грехов простится.",   "Лучше смерть на поле, чем позор в неволе.",   "Чем позор и неволю терпеть, лучше в бою умереть.",   "Лучше биться орлом, чем жить зайцем.",   "Никогда фашистам не властвовать над нами, никогда не будем рабами.",   "Лучше злая пуля, чем клеймо раба.",   "Славная смерть лучше постыдной жизни.",   "Воевать – не галушки жевать.",   "Не воевать – победы не видать.",   "Слабого огонь войны испепеляет, а сильного как сталь закаляет.",   "Кто за правое дело дерется, у того двойная сила берется.",   "Наше дело правое – бей врага браво.",   "Бей фашистских властей всех мастей.",   "С какой злостью превеликой мы расправимся с фашистской кликой.",   "С врагами биться – на пули не скупиться.",   "Винтовка хлоп – и фашист в гроб.",   "Пришел фашист из Берлина – получил земли три аршина.",   "Не важно, чем бил, – важно, что фашиста убил.",   "Каждой фашистской гадине висеть на перекладине.",   "Всякому свой путь: журавлю – в небо, волку – в лес, а фашисту – в могилу.",   "Упрямого выправит дубина, а фашиста – могила.",   "Какую яму фашист копал – в такую и попал.",   "Фашисты научились воровать, а мы научились фашистов убивать.",   "Наш порог не для фашистских сапог.",   "Фашиста согнем в бараний рог, чтоб не переступал наш порог.",   "Лося бьют в осень, а фашиста всегда.",   "Наше дело святое и правое, мы расправимся с фашистскою оравою.",   "С фашистом разговор короткий: круши его прямой наводкой.",   "Кричал фашист «гоп», да получил пулю в лоб.",   "Фашиста умертвить – доброе дело сотворить.",   "На фронте воевать – славу добывать.",   "Фронт гремит – у врага земля горит.",   "Гремят вспышки на горизонте: то бьют фашистов на фронте.",   "Фашистов разгромили – и в селе порядок водворили.",   "Фашист замахнулся, да промахнулся.",   "Дрался фашист пылко, да остался без затылка.",   "Фашисты козыряли, да головы потеряли.",   "Фашисты пять раз на дню попадают в западню.",   "У фашистов брожение: попали в окружение.",   "Фашистам не все напирать – пришлось и умирать.",   "Трави фашистскую силу – огнем и штыком загоняй в могилу.",   "Чокнемся, фашист, я парень не гордый: я – прикладом, а ты – мордой.",   "На то у винтовок и ложи, чтобы бить фашиста по роже.",   "Слава русского штыка не померкнет века.",   "Штык остёр загнал фрицев в «котел».",   "Наши штыки разгромят фашистские полки.",   "Фашисты войну начали, а мы кончим.",   "Славу свою добывай в бою.",   "Почет и славу собирают по капле.",   "Народ того уважает, кто фашистов уничтожает.",   "На то мы и внуки Суворова, чтобы сражаться здорово.",   "Как учил Александр Суворов – будь к врагу суровым.",   "На краю света фашистов найдем и на суд приведем.",   "Зря фашист блиндажи строит: все равно снаряд накроет.",   "Смерть фашистской своре – на берегу и в море!",   "Солдата мать родит, отец растит, а бой учит.",   "Дерево в огне сгорает, а солдат от огня крепче бывает.",   "Кто первый бой начинает, тот скорее побеждает.",   "Пришла пора гнать фашистов со двора.",   "Фашист наступает – кричит «гут», а отступает – «Гитлер капут».",   "Красна девушка косами, солдат – орденами.",   "Ученый водит, а неуч сзади ходит.",   "Птицу обманывают кормом, а человека – словом.",   "Слово, сказанное без соображения, подобно выстрелу без прицела.",   "Говорить впустую что стрелять вхолостую.",   "У осла длинные уши, а у болтуна длинный язык.",   "У короткого ума длинный язык.",   "Слово не воробей: выпустишь – не поймаешь.",   "Скажешь – не воротишь, напишешь – не сотрешь, отрубишь – не приставишь.",   "Лучше один раз увидеть, чем сто раз услышать.",   "Острый язык – дарование, длинный язык – наказание.",   "Не всегда говори то, что знаешь, но всегда знай, что говоришь.",   "Кто много болтает, тот врагу помогает.",   "Кто зевает – победителем не бывает.",   "Храбрость города берет, а бдительность их бережет.",   "Зря не болтай у телефона: болтун – находка для шпиона.",   "Нет друга – так ищи, а найдешь – береги.",   "Ищи себе друзей таких, чтобы не было стыда от них.",   "Не ходи, дружок, в неизвестный кружок: к таким людям зайдешь, что навек пропадешь.",   "Плохой друг подобен тени: только в светлые дни его и видишь.",   "Не та дружба сильна, что в словах заключена, а та, что в бою скреплена.",   "Для друзей – пироги, для врагов – кулаки.",   "В недруге пуля что во пне, а в друге что во мне.",   "Все за одного, один за всех – вот и обеспечен в бою успех.",   "Не имей сто рублей, а имей сто друзей.",   "В дружбе – правда.",   "Кто нашел друга – нашел сокровище.",   "Сам пропадай, а товарища выручай.",   "Один в поле не воин, а вдвоем с товарищем – взвод.",   "Где дружба и лад – там и клад.",   "Где дружба и совет – там и свет.",   "Трусливый друг опаснее врага, ибо врага опасаешься, а на друга опираешься.",   "Не тот друг, кто медом мажет, а тот, кто правду скажет.",   "Недруг поддакивает, а друг спорит.",   "Дружба крепка не лестью, а правдой и честью.",   "Новых друзей наживай, а старых не забывай.",   "Прямо страху в глаза смотри – и страх смигнет.",   "Волков бояться – в лес не ходить.",   "Трус умирает тысячу раз, а смелый всего один раз.",   "Советские воины из металла скроены.",   "Чем больше героев, тем скорее фашистов зароем.",   "Храбрость – сестра победы.",   "На смелого собака лает, а трусливого – рвет.",   "Не числом, а храбростью побеждают.",   "Лучше быть мертвым героем, чем живым трусом.",   "Смелого и пуля облетит, смелый и мину перехитрит.",   "Если не будешь овцой, то волк не съест.",   "Косил Гитлер глаз на Донбасс, а Донбасс опять у нас.",   "И про солдатскую честь пословица есть.",   "Потому и смешно, что фашистам горе пришло.",   "Гитлеровским сателлитам быть разбитым.",   "Знаем, за что бьем, потому и с победой придем.",   "Кто за правое дело стоит, тот всегда победит.",   "У правого сила удвоится, говорит пословица.",   "Будет праздник и на улице нашей, всякого праздника краше.",   "Войну закончим – и мир упрочим.",   "Как фашисты нам ни грозили, а мы их сразили.",   "Фашистов разгромили – добро сотворили.",   "Хотел Гитлер покорить весь мир, да лопнул как мыльный пузырь.",   "Задохнулась фашистская стая девятого мая.",   "Разбили фашистскую орду в сорок пятом году.",   "Прогнали фрицев – можно веселиться.",   "Советская Армия врага разгромила, она стоит на страже мира.",   "Курские леса и дубравы полны легендарной славы.",   "Виден в курских лесах боевой размах.",   "Защитим курские дубравы от фашистской оравы!",   "В курских городах разбили фашистов в прах.",   "Как фашисты ни рвались к Курску – не дали им спуску.",   "Бей врага, Суджа, зарывай глубже." ];

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Сборка массива с результатами обработки

 var Tf=new Date().getTime();

 count_ImgAll++;
 var count_ImgEts=count_ImgAll-count_Img-count_ImgP;

 var mSt=[];
 ind=0;

                                      mSt[ind]=" "+ScriptName+" v." + NumerusVersion;  ind++;
                                      mSt[ind]="-----------------------------------------------------------------------";  ind++;
 if (d)                        { mSt[ind]=" Демонстрационный режим";  ind++ }
                                      mSt[ind]="						          ";  ind++;

                                            mSt[ind]="• СТАТИСТИКА:";  ind++;
                                            mSt[ind]=" · Вычисления  .  .  .  .  .  .  .  .  .  .  .	"+time(Tf - Ts - T_pause);  ind++;
 if (T_pause!=d)          { mSt[ind]=" · Диалоговые паузы .  .  .  .  .  .  .  .	"+time(T_pause);  ind++; }
                               //       mSt[ind]="";  ind++;
 if (count_Img!=d) {
         if (count_ImgP == 0  &&  count_ImgEts == 0  ||  d)
                                          { mSt[ind]="   Иллюстраций .  .  .  .  .  .  .  .  .  .  .	"+(count_ImgAll);  ind++ }
         if (count_ImgP != 0  ||  count_ImgEts != 0  ||  d)
                                          { mSt[ind]="   Обычных иллюстраций .  .  .  .  .  .	"+(count_Img);  ind++ }    }
 if (count_ImgP!=d )    { mSt[ind]="   Строк с одной иллюстрацией  .  .	"+(count_ImgP);  ind++ }
 if (count_ImgEts!=d) { mSt[ind]="   Иллюстраций в тексте строки  .  .	"+(count_ImgEts);  ind++ }

 cTaT=ind;  //  число строк в первом разделе

                                      mSt[ind]="";  ind++;
                                      mSt[ind]="• ОПЕРАЦИИ С ГРАФИКОЙ В СТРОКЕ:";  ind++;

 if (count_112!=d) { mSt[ind]="112. Внутренняя чистка строк   .  .  .  .  .  .  .  .  .  .  .  .	"+count_112;  ind++ }
 if (count_113!=d) { mSt[ind]="113. Снятие форматирования \"подзаголовок\"  .  .  .  .	"+count_113;  ind++ }
 if (count_114!=d) { mSt[ind]="114. Снятие внешнего форматирования   .  .  .  .  .  .  .	"+count_114;  ind++ }

 if (cTaT==ind-2) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в этом разделе
 cTaT=ind;  //  число строк в двух разделах

                                      mSt[ind]="";  ind++;
                                      mSt[ind]="• ОПЕРАЦИИ С ПУСТЫМИ СТРОКАМИ:";  ind++;
 if (count_111!=d) { mSt[ind]="111. Чистка внутри строки  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_111;  ind++ }
 if (count_121!=d) { mSt[ind]="121. Удаление повторной пустой строки   .  .  .  .  .  .  .	"+count_121;  ind++ }
 if (count_122!=d) { mSt[ind]="122. Снятие внешнего форматирования   .  .  .  .  .  .  .	"+count_122;  ind++ }
 if (count_123!=d) { mSt[ind]="123. Удаление на окраине разделов  .  .  .  .  .  .  .  .  .	"+count_123;  ind++ }
 if (count_124!=d) { mSt[ind]="124. Удаление за краем разделов  .  .  .  .  .  .  .  .  .  . 	"+count_124;  ind++ }
 if (count_201!=d) { mSt[ind]="201. Удаление рядом с картинкой в кармане секций	"+count_201;  ind++ }
 if (count_211!=d) { mSt[ind]="211. Вставка между картинкой и границей секции  	"+count_211;  ind++ }
 if (count_212!=d) { mSt[ind]="212. Удаление между картинкой и границей секции	"+count_212;  ind++ }
 if (count_221!=d) { mSt[ind]="221. Вставка рядом с картинкой посреди секции .  .	"+count_221;  ind++ }
 if (cTaT!=ind-2)    { mSt[ind] = "";  ind++ }   //  Добавление пустой строки, если есть автоматические операции

 if (count_231!=d) { mSt[ind]="231. Добавление между картинкой и текстом   .  .  .  .	"+count_231;  if (Posle_illjustratsii == 2)  mSt[ind]+="*";  ind++ }
 if (count_232!=d) { mSt[ind]="232. Удаление между картинкой и текстом .  .  .  .  .  .	"+count_232;  if (Posle_illjustratsii == 2)  mSt[ind]+="*";  ind++ }
 if (count_241!=d) { mSt[ind]="241. Добавление между текстом и картинкой   .  .  .  .	"+count_241;  if (Pered_illjustratsiej == 2)  mSt[ind]+="*";  ind++ }
 if (count_242!=d) { mSt[ind]="242. Удаление между текстом и картинкой .  .  .  .  .  .	"+count_242;  if (Pered_illjustratsiej == 2)  mSt[ind]+="*";  ind++ }
 if (count_251!=d) { mSt[ind]="251. Добавление между иллюстрациями   .  .  .  .  .  .  .	"+count_251;  if (Mezhdu_illjustratsijami == 2)  mSt[ind]+="*";  ind++ }
 if (count_252!=d) { mSt[ind]="252. Удаление между иллюстрациями .  .  .  .  .  .  .  .  .	"+count_252;  if (Mezhdu_illjustratsijami == 2)  mSt[ind]+="*";  ind++ }

 if (cTaT==ind-2) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в этом разделе

 if (mSt[ind-1]=="")   ind--;   //  Удаление последней пустой строки, если она есть

                                      mSt[ind]="";  ind++;
 if (itogi!=d)            { mSt[ind]=" · Всего исправлений  .  .  .  .  .  .  .  .	"+itogi;  ind++ }
 if (itogi==0 || d)   { mSt[ind]="   >> Исправлений нет";  ind++; }


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
 mSt[ind]="-----------------------------------------------------------------------";  ind++;
 var reZit = new RegExp("([^ ].{0,50})(?=\\\s\\\s.{0,}|$)","g");   // Рег. выражение для разделения цитаты на строки.
 mSt=mSt.concat(Kn[Rn_(Kn.length)].replace(/ /g, "  ").match(reZit));   //  Добавление массива строк цитаты в основной массив.
 for (j=mSt.length-1; j>=ind; j--)  mSt[j]=" "+mSt[j];   //  Добавление отступа.
// for (j=mSt.length-1; j>=ind; j--)  { mSt.splice(j+1, 0, ""+mSt[j].length) }   //  Добавление длины строк цитаты (отключено).
 ind = mSt.length;    //  Определение индекса.

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Вывод окна результатов на экран

 var st2="";  //  текст результатов

 for  ( j=0; j!=ind; j++ )
        st2+=mSt[j]+"\n";  //  добавление элемента из массива


//  Вывод окна результатов
 MsgBox (st2);

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------

}




                 ///  ИСТОРИЯ ИЗМЕНЕНИЙ

// v.1.0 — Создание скрипта — Александр Ка (17.05.2024)
// v.1.1 — Исправлена ошибка с добавлением пустых строк — Александр Ка (10.06.2024)
// v.1.2 — Добавлены настройки; улучшен интерфейс — Александр Ка (07.08.2024)
// v.2.0 — Александр Ка (15.02.2025)
//    Добавлены сочетания: "иллюстрация + иллюстрация" и "иллюстрация + пустая строка + иллюстрация"
//    Улучшен интерфейс, повышена стабильность работы, исправлены ошибки, увеличены возможности настроек
// v.2.1 — Добавлена функция повышения версии файла и запись в историю изменений — Александр Ка (25.04.2025)




