//------------------------------------------------------------------------------------------
//             «Изменить дескрипшен»
//  Скрипт предназначен для пользовательской замены данных в разделе <description>
//  * Скрипт тестировался в FBE v.2.7.8 (win XP, IE8 и win 7, IE11)
//  * История изменений в конце скрипта
//------------------------------------------------------------------------------------------

function Run() {

 var ScriptName="«Изменить дескрипшен»";
 var NumerusVersion="1.4";
 var titleInfoGenre=[], titleInfoAuthorFirstName=[], titleInfoAuthorMiddleName=[], titleInfoAuthorLastName=[], titleInfoAuthorNickname=[], titleInfoAuthorEmail=[], titleInfoAuthorHomePage=[], titleInfoAuthorID=[], titleInfoTranslatorFirstName=[], titleInfoTranslatorMiddleName=[], titleInfoTranslatorLastName=[], titleInfoTranslatorNickname=[], titleInfoTranslatorEmail=[], titleInfoTranslatorHomePage=[], titleInfoAnnotation=[], srcTitleInfoGenre=[], srcTitleInfoAuthorFirstName=[], srcTitleInfoAuthorMiddleName=[], srcTitleInfoAuthorLastName=[], srcTitleInfoAuthorNickname=[], srcTitleInfoAuthorEmail=[], srcTitleInfoAuthorHomePage=[], srcTitleInfoAuthorID=[], srcTitleInfoTranslatorFirstName=[], srcTitleInfoTranslatorMiddleName=[], srcTitleInfoTranslatorLastName=[], srcTitleInfoTranslatorNickname=[], srcTitleInfoTranslatorEmail=[], srcTitleInfoTranslatorHomePage=[], documentInfoAuthorFirstName=[], documentInfoAuthorMiddleName=[], documentInfoAuthorLastName=[], documentInfoAuthorNickname=[], documentInfoAuthorEmail=[], documentInfoAuthorHomePage=[], customInfoType=[], customInfo=[];
 var titleInfoBookTitle, titleInfoKeywords, titleInfoDate, titleInfoDateValue, titleInfoLang, titleInfoSrcLang, titleInfoSequenceName, titleInfoSequenceNumber, srcTitleInfoBookTitle, srcTitleInfoKeywords, srcTitleInfoDate, srcTitleInfoDateValue, srcTitleInfoLang, srcTitleInfoSrcLang, srcTitleInfoSequenceName, srcTitleInfoSequenceNumber, documentInfoVersion, documentInfoProgramUsed, documentInfoDate, documentInfoDateValue, documentInfoSrcOcr, documentInfoSrcUrl, documentInfoHistory, publishInfoBookName, publishInfoPublisher, publishInfoCity, publishInfoYear, publishInfoISBN, publishInfoSequenceName, publishInfoSequenceNumber;
 var k=0;

// ---------------------------------------------------------------
                 ///  НАСТРОЙКИ
// ---------------------------------------------------------------

 //   Показывать напоминание об опасном расположении курсора
 var Napominanie = 1;      // 0 ; 1 //      ("0" — Отключить, "1" — Показывать)

// ---------------------------------------------------------------

 //   Название шаблона
 var ShablonName="«Без изменений»";      // текст //


         //  Добавление данных

 //   Сохранение авторов fb2-файла
 var ChangeAuthor = 1;      // 0 ; 1 //      ("0" — разрешить замену авторов, "1" — добавлять новые имена авторов к уже существующим)

 //   Сохранение  ID  fb2-файла
 var ChangeID = 1;      // 0 ; 1 //      ("0" — заменить на новый ID,  "1" — сохранить оригинальный ID)

//    Сохранение истории изменений файла
 var ClearHistory = 1;      // 0 ; 1 //      ("0" — удалить, "1" — сохранить историю)

//    Сохранение аннотации
 var ClearAnnotation = 1;      // 0 ; 1 //      ("0" — удалить, "1" — сохранить аннотацию)


         //  Автоматическое повышение версии файла и запись в историю изменений

 var Version_on_off = 0;      // 0 ; 1 //      ("0" — отключить, "1" — включить)     //  включение этой функции не отменяет обычное "добавление данных"

//   Основной текст, добавляемый в строку истории
 var TextHistory = "Общая правка";      // текст //

//   Имя используемое в добавленной записи
 var youName = "Зорро";      // текст //

// ---------------------------------------------------------------
                 ///  ДОБАВЛЯЕМЫЕ ДАННЫЕ
// ---------------------------------------------------------------

//  Здесь можно указать какие данные в разделе <description> следует изменить.
//  Все заполненные значения добавляемых данных полностью заменяют исходные данные в fb2-файле.
//  * Исключаются только поля с авторами файла, строки аннотации и истории изменений файла. Но и это исключение можно отменить, изменив "настройки".
//  Вносить изменения в скрипт лучше при включенной программе FBE (чтобы не было проблем в случае ошибочного заполнения).

//  Пустые кавычки означают, что данные останутся не измененными.
//  Если кавычки не пустые, то текст из этих кавычек будет отправлен в соответствующий раздел <description>.
//  Если внутрь кавычек необходимо вписать другую кавычку, то её следует экранировать обратным слэшем: «\"».
//  Сам обратный слэш, экранируется точно так же: «\\».
//  Разрыв строки, который может быть в <custom-info> записывается символами «\n».
//  Чтобы не мешались, можно свободно удалять любые незаполненные разделы, и строки комментариев (они начинаются символами «//»).
//  Строку "k++;" можно удалять только вместе с разделом, к которому она приставлена.


         ///   Книга  ::  <title-info>

 //  Жанры  ::  для добавления нескольких жанров, эту строку можно размножить
 titleInfoGenre[k++] =  "";

 //  Авторы  ::  для добавления нескольких авторов, этот блок строк можно размножить
 titleInfoAuthorFirstName[k] =  "";
 titleInfoAuthorMiddleName[k] =  "";
 titleInfoAuthorLastName[k] =  "";
 titleInfoAuthorNickname[k] =  "";
 titleInfoAuthorEmail[k] =  "";
 titleInfoAuthorHomePage[k] =  "";
 titleInfoAuthorID[k] =  "";
 k++;

 //  Название
 titleInfoBookTitle =  "";

 //  Ключевые слова
 titleInfoKeywords =  "";

 //  Дата текстом ; Значение даты
 titleInfoDate =  "";
 titleInfoDateValue =  "";

 //  Язык ; Язык оригинала
 titleInfoLang =  "";
 titleInfoSrcLang =  "";

 //  Переводчики  ::  для добавления нескольких переводчиков, этот блок строк можно размножить
 titleInfoTranslatorFirstName[k] =  "";
 titleInfoTranslatorMiddleName[k] =  "";
 titleInfoTranslatorLastName[k] =  "";
 titleInfoTranslatorNickname[k] =  "";
 titleInfoTranslatorEmail[k] =  "";
 titleInfoTranslatorHomePage[k] =  "";
 k++;

 //  Серия
 titleInfoSequenceName =  "";
 titleInfoSequenceNumber =  "";

 //  Аннотация  ::  для добавления нескольких строк, строку ниже можно размножить  ::  допускается использование тегов  "<strong>", "<emphasis>", "<sup>", "<sub>"
 titleInfoAnnotation[k++] =  "";



         ///   Информация об оригинале книги  ::  <src-title-info>

 //  Жанры  ::  эту строку можно размножить
 srcTitleInfoGenre[k++] =  "";

 //  Авторы  ::  для добавления нескольких авторов, этот блок строк можно размножить
 srcTitleInfoAuthorFirstName[k] =  "";
 srcTitleInfoAuthorMiddleName[k] =  "";
 srcTitleInfoAuthorLastName[k] =  "";
 srcTitleInfoAuthorNickname[k] =  "";
 srcTitleInfoAuthorEmail[k] =  "";
 srcTitleInfoAuthorHomePage[k] =  "";
 srcTitleInfoAuthorID[k] =  "";
 k++;

 //  Название
 srcTitleInfoBookTitle =  "";

 //  Ключевые слова
 srcTitleInfoKeywords =  "";

 //  Дата текстом ; Значение даты
 srcTitleInfoDate =  "";
 srcTitleInfoDateValue =  "";

 //  Язык ; Язык оригинала
 srcTitleInfoLang =  "";
 srcTitleInfoSrcLang =  "";

 //  Переводчики  ::  для добавления нескольких переводчиков, этот блок строк можно размножить
 srcTitleInfoTranslatorFirstName[k] =  "";
 srcTitleInfoTranslatorMiddleName[k] =  "";
 srcTitleInfoTranslatorLastName[k] =  "";
 srcTitleInfoTranslatorNickname[k] =  "";
 srcTitleInfoTranslatorEmail[k] =  "";
 srcTitleInfoTranslatorHomePage[k] =  "";
 k++;

 //  Серия
 srcTitleInfoSequenceName =  "";
 srcTitleInfoSequenceNumber =  "";



         ///   FB2 документ  ::  <document-info>

 //  Версия  ::  Добавление текста отключает "Автоматическое повышение версии файла"
 documentInfoVersion =  "";

 //  Авторы  ::  для добавления нескольких авторов, этот блок строк можно размножить  ::  в настройках можно выбрать режим "добавления" или "замены"
 documentInfoAuthorFirstName[k] =  "";
 documentInfoAuthorMiddleName[k] =  "";
 documentInfoAuthorLastName[k] =  "";
 documentInfoAuthorNickname[k] =  "";
 documentInfoAuthorEmail[k] =  "";
 documentInfoAuthorHomePage[k] =  "";
 k++;

 //  Использованы программы
 documentInfoProgramUsed =  "";

 //  Дата текстом ; Значение даты  ::  Если дата равна "сегодня", то скрипт впишет сегодняшнее число
 documentInfoDate =  "";
 documentInfoDateValue =  "";

 //  Source OCR
 documentInfoSrcOcr =  "";

 //  Source URLs
 documentInfoSrcUrl =  "";

 //  История изменений файла  ::  Добавление текста отключает функцию "Автоматическое повышение версии файла и запись в историю изменений"
 documentInfoHistory =  "";



         ///   Бумажная книга  ::  <publish-info>

 //  Заголовок книги
 publishInfoBookName =  "";

 //  Издатель
 publishInfoPublisher =  "";

 //  Город
 publishInfoCity =  "";

 //  Год
 publishInfoYear =  "";

 //  ISBN
 publishInfoISBN =  "";

 //  Серия
 publishInfoSequenceName =  "";
 publishInfoSequenceNumber =  "";



         ///   Дополнительная информация  ::  <custom-info>

 //  Тип / Значение  ::  для добавления нескольких текстов, этот блок строк можно размножить; а количество строк в "customInfo" - увеличить или уменьшить
 customInfoType[k] =  "";
 customInfo[k]  =
         "" + "\n"+
         "" + "\n"+
         "" + "\n"+
         "";
 k++;

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

 var fbwBody=document.getElementById("fbw_body");         //  Структура текста
 var fbwDesc=document.getElementById("fbw_desc");         //  Структура <description>.
 var mDesc=fbwDesc.all;         //  Все разделы <description>.

 var mDiv=[];     //  Массив узлов "DIV"
 var div;                //  один из узлов "DIV"
 var Length;         //  длина массива

 var reELine = new RegExp("^(\\\s|"+nbspEntity+"|<[^>]{1,}>){0,}$","");   //  Признак пустой строки.
 var reELine_ex = new RegExp("<SPAN [^>]{0,}?class=image","g");

 var ex;   //  Экс-значение данных в дескрипшен.
 var change = false;   //  Индикатор изменения;

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
         "    Жанры \n"+
         "    Авторы \n"+
         "    Переводчики \n"+
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

 if (Napominanie !=0  &&  fbwBody.style.display == "block")    //  Если скрипт работает без паузы, и включено напоминание, и действует режим "Дизайн"...
         if (! AskYesNo (napominanieText))     //  Создаем окно вопроса и если выбран отказ от продолжения...
                 return;      //  то выходим из скрипта.

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// Текущее дата

 var currentFullDate = new Date();     //  Получение структуры полной даты.

 var currentDay = currentFullDate.getDate();
 var currentMonth = ("0"+(1+currentFullDate.getMonth())).replace(/.?(..)$/g, "$1");
 var currentYear = currentFullDate.getFullYear();

 var Segodnja = currentYear + "-" + currentMonth + "-" + ("0"+currentDay).replace(/.?(..)$/g, "$1");

 switch (+currentMonth) {
         case 1:  currentMonth = "января";  break;
         case 2:  currentMonth = "февраля";  break;
         case 3:  currentMonth = "марта";  break;
         case 4:  currentMonth = "апреля";  break;
         case 5:  currentMonth = "мая";  break;
         case 6:  currentMonth = "июня";  break;
         case 7:  currentMonth = "июля";  break;
         case 8:  currentMonth = "августа";  break;
         case 9:  currentMonth = "сентября";  break;
         case 10:  currentMonth = "октября";  break;
         case 11:  currentMonth = "ноября";  break;
         case 12:  currentMonth = "декабря";  break;
         }

 var SegodnjaText = currentDay + " " + currentMonth + " " + currentYear;

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

 function HistoryChange(youName) {

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

 TextHistory = inCode(TextHistory);    //  Обработка добавляемого текста.

 var reHist00s = new RegExp("[^А-яЁёA-Za-z0-9]"+TextHistory+"[^А-яЁёA-Za-z0-9]","");   //  Стартовая.
 //  Добавление текста перед словом "Скрипт"
 var reHist01 = new RegExp("(\\\s|"+nbspEntity+")([Сс]крипт)","");
 var reHist01_ = " "+TextHistory+". $2";
 //  Добавление точки
 var reHist02 = new RegExp("(.[^…\\\?!\\\.,;:—])(\\\s|"+nbspEntity+")(— "+textYouName+mDate[k]+")","");
 var reHist02_ = "$1. $3";
 //  Добавление текста перед именем и датой
 var reHist03 = new RegExp("(.)(\\\s|"+nbspEntity+")(— "+textYouName+mDate[k]+")","");
 var reHist03_ = "$1 "+TextHistory+" $3";

 if (povtorD) {                                         //  Если найдена запись с недавней датой...
         if (s.search(reHist03) !=-1) {    //  и если в строке имя пользователя и дата записаны по форме: "— (Имя, Дата)"...
                 if (s.search(reHist00s) ==-1) {    //  то проверяем строку на наличие записи добавляемого текста, и если его нет...
                         if (s.search(reHist01) !=-1)  s = s.replace(reHist01, reHist01_);                   //  пытаемся добавить новый текст перед словом "Скрипт"
                             else {                                                                                              //  и если не получается это сделать...
                                     if (s.search(reHist02) !=-1)  s = s.replace(reHist02, reHist02_);        //  добавляем при необходимости точку
                                     if (s.search(reHist03) !=-1)  s = s.replace(reHist03, reHist03_);        //  и текст, следом за ней.
                                     }
                         }
                 if (k != 0)                                                    //  Затем проверяем дату, и если она не сегодняшняя...
                         s = s.replace(mDate[k], mDate[0]);   //  то заменяем на сегодняшнюю.
                 if (mP[j].innerHTML != s) {                //  Затем проверяем изменилась ли строка истории, и если она изменилась...
                         mP[j].innerHTML = s;          //  то сохраняем её в тексте
                         change_D09=true;              //  и отмечаем, что данные изменились.
                         }
                 }
             else                                  // Если же есть недавняя дата, но запись сделана не по форме...
                 povtorD = false;   //  Объявляем, что недавняя дата - посторонняя, и надо повышать версию и добавлять новую строку в историю.
         }

 if (povtorD)  return;   //  Если производилась обработка записи в истории - выход из функции.


         //  Повышение версии

 var versionFile=document.getElementById("diVersion").value;  //  Извлечение значения версии файла.
 var newVersion = versionFile;                                                          //  Начальное значение новой версии.
 var versionText = "";           //  Текст с версией в истории изменений.

 if (documentInfoVersion) {           //  Если версия уже изменена...
         versionText="v."+versionFile+" — ";    //  создаем текст для истории.
         }

 //  Проверка на валидность версии файла
 var ValidationVersion=(versionFile.length <=10  &&  versionFile.search(/^\d{0,10}(\.\d{1,8})?$/g) !=-1);    //  сравнение с шаблоном:  "цифры + (точка + цифры)"

 //   Изменение версии файла
 if (ValidationVersion  &&  !documentInfoVersion) {
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
                 versionText="v."+newVersion+" — ";    //  и создаем текст для истории.
                 change_D01=true;              //  и отмечаем, что данные изменились.
         }

         //   Добавление строк в историю изменений

 var reHist11 = new RegExp("^(\\\s|"+nbspEntity+"){0,}$","");   //  Признак пустой строки.
 var reHist12 = new RegExp("(^|\\n)[^0-9]{0,12}"+versionFile.replace(/\./, "\\.")+"([^0-9]|$)","");   //  Поиск старой версии.

 //   Добавление строки с информацией о старой версии
 if (ValidationVersion  &&  History.innerText.search(reHist12)==-1  &&  !documentInfoVersion) {       //  Если в истории нет записи о старой версии...
         if (History.lastChild.innerHTML.search(reHist11)==-1)                                               //  то проверяем наличие пустой строки в конце истории
                 History.insertAdjacentElement("beforeEnd",document.createElement("P"));       //  и если ее нет - добавляем новую.
         History.lastChild.innerHTML = "v."+versionFile+" — ?";  //  Затем добавляем в строку информацию о старой версии
         change_D09=true;              //  и отмечаем, что данные изменились.
         }

 //   Добавление строки с информацией о новой версии
 if (History.lastChild.innerHTML.search(reHist11)==-1)                                   //  Если в конце истории нет готовой пустой строки...
         History.insertAdjacentElement("beforeEnd",document.createElement("P"));   //  то добавляем новую строку.
 History.lastChild.innerHTML = versionText+" "+TextHistory+" — "+textYouName+mDate[0];  //  Добавляем в строку информацию о новой версии.
 change_D09=true;              //  и отмечаем, что данные изменились.

 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// Функция добавления жанров

 function AddGenre (mGenre, elem) {

 change = false;              //  Отмечаем, что изменений пока нет.
 ex = elem.innerHTML;    //  Сохраняем исходный текст структуры.

 Length = mGenre.length;          //  Определяем длину массива с новыми данными.

 div = elem.firstChild;         //  Находим первый элемент в разделе жанров.
 while (div.nextSibling.nodeName != "DIV")    //  Находим раздел перед первым "DIV".
         div = div.nextSibling;

 for (k=0; k<Length; k++)                  //  Перебираем все элементы с новыми данными.
         if (mGenre[k]) {               //  Если есть заполненные данные...
                 if (!div.nextSibling)               //  проверяем наличие отсутствия следующего раздела, и если нет его...
                         div.insertAdjacentElement("afterEnd", div.cloneNode(true));   //  то добавляем копию раздела "DIV".
                 div = div.nextSibling;               //  Затем переходим на следующий узел "DIV".
                 div.all.genre.value = mGenre[k];   //  Заменяем жанр в этом узле.
                 if (div.all.match)                           //  Если там есть данные "соответствия жанру"...
                         div.all.match.value = "";    //  то удаляем их.
                 change=true;              //  Отмечаем, что данные изменились.
                 }

 if (change) {         //  Если данные изменились...
         while (div.nextSibling  &&  div.nextSibling.nodeName == "DIV")   //  то удаляем все неиспользованные разделы "DIV"
                 div.nextSibling.removeNode(true);
         PutSpacers(elem);                   //  и правильно оформляем список.
         }

 return (ex != elem.innerHTML);   //  Возвращаем индикацию изменения дескрипшена.

 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// Функция добавления авторов и переводчиков

 function AddAuthor (mFirstName, mMiddleName, mLastName, mNickname, mEmail, mHomePage, mID, elem, ID) {

 change = false;              //  Отмечаем, что изменений пока нет.
 ex = elem.innerHTML;    //  Сохраняем исходный текст структуры.

 Length = mFirstName.length;          //  Определяем максимальную длину массива с новыми данными.
 if (mMiddleName.length > Length)
         Length = mMiddleName.length;
 if (mLastName.length > Length)
         Length = mLastName.length;
 if (mNickname.length > Length)
         Length = mNickname.length;

 div = elem.firstChild;         //  Находим первый элемент в разделе авторов.
 while (div.nextSibling.nodeName != "DIV")    //  Находим раздел перед первым "DIV".
         div = div.nextSibling;

 for ( ; k<Length; k++)                  //  Перебираем все элементы с новыми данными.
         if (mFirstName[k]  ||  mMiddleName[k]  ||  mLastName[k]  ||  mNickname[k]) {   //  Если есть заполненные данные...
                 if (!div.nextSibling)                                //  проверяем наличие отсутствия следующего раздела, и если нет его...
                         div.insertAdjacentElement("afterEnd", div.cloneNode(true));   //  и добавляем копию раздела "DIV".
                 div = div.nextSibling;                                                //  Затем переходим на следующий узел "DIV".
                 if (mFirstName[k])                                  //  Если есть новое имя автора...
                         div.all.first.value = mFirstName[k];   //  то заменяем старое,
                     else  div.all.first.value = "";                         //  а если нет - то удаляем старое имя.
                 if (mMiddleName[k])                               //  Если есть новое отчество автора...
                         div.all.middle.value = mMiddleName[k];   //  то заменяем старое,
                     else  div.all.middle.value = "";                            //  а если нет - то удаляем старое отчество.
                 if (mLastName[k])                                       //  и т.д.
                         div.all.last.value = mLastName[k];
                     else  div.all.last.value = "";
                 if (mNickname[k])
                         div.all.nick.value = mNickname[k];
                     else  div.all.nick.value = "";
                 if (mEmail[k])
                         div.all.email.value = mEmail[k];
                     else  div.all.email.value = "";
                 if (mHomePage[k])
                         div.all.home.value = mHomePage[k];
                     else  div.all.home.value = "";
                 if (ID  &&  mID[k]  &&  div.all.id.value != mID[k])
                         div.all.id.value = mID[k];
                 change=true;              //  Отмечаем, что данные изменились.
                 }

 if (change) {         //  Если данные изменились...
         while (div.nextSibling  &&  div.nextSibling.nodeName == "DIV")   //  то удаляем все неиспользованные разделы "DIV"
                 div.nextSibling.removeNode(true);
         PutSpacers(elem);                   //  и правильно оформляем список.
         }

 return (ex != elem.innerHTML);   //  Возвращаем индикацию изменения дескрипшена.

 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// Функция добавления серии

 function AddSequence (sequenceName, sequenceNumber, elem) {

 ex = elem.innerHTML;    //  Сохраняем исходный текст структуры.

 if (sequenceName) {                    //  Если есть новое название серии...
         mDiv = elem.getElementsByTagName("DIV");   //  Находим все разделы "DIV".
         for (j=mDiv.length-1; j>0; j--)                        //  И удаляем их все, кроме самого первого раздела.
                 mDiv[j].removeNode(true);
         div = mDiv[0];                 //  Выбираем оставшийся раздел.
         div.all.del.disabled = true;   //  Гасим там кнопку удаления.
         div.all.name.value = sequenceName;    //  Заменяем название.
         if (sequenceNumber)                        //  Если есть новый номер...
                 div.all.number.value = sequenceNumber;    //  то добавляем и его,
             else  div.all.number.value = "";    //  а если нет - то удаляем старый номер.
         }

 return (ex != elem.innerHTML);   //  Возвращаем индикацию изменения дескрипшена.

 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------

// ---------------------------------------------------------------
 window.external.BeginUndoUnit(document, ScriptName + " v."+NumerusVersion + " :: " + ShablonName);    // Начало записи в систему отмен.
// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///   TITLE-INFO

 var change_T01=false;
 var change_T02=false;
 var change_T03=false;
 var change_T04=false;
 var change_T05=false;
 var change_T06=false;
 var change_T07=false;
 var change_T08=false;
 var change_T09=false;
 var change_T10=false;
 var change_T11=false;


                 /// <title-info>  ::  Жанры

 //  Запускаем функцию добавления жанров и сохраняем результат в индикаторе изменений.
 change_T01 = AddGenre (titleInfoGenre, mDesc.tiGenre);


                 /// <title-info>  ::  Авторы

 //  Запускаем функцию добавления авторов и переводчиков, и сохраняем результат в индикаторе изменений.
 change_T02 = AddAuthor (titleInfoAuthorFirstName, titleInfoAuthorMiddleName, titleInfoAuthorLastName, titleInfoAuthorNickname, titleInfoAuthorEmail, titleInfoAuthorHomePage, titleInfoAuthorID, mDesc.tiAuthor, true);


                 /// <title-info>  ::  Название


 if (titleInfoBookTitle  &&  mDesc.tiTitle.value != titleInfoBookTitle) {        //  Если есть новое название книги...
         mDesc.tiTitle.value = titleInfoBookTitle;   //  то отправляем его в дескрипшен
         change_T03=true;              //  Отмечаем, что данные изменились.
         }


                 /// <title-info>  ::  Ключевые слова

 if (titleInfoKeywords  &&  mDesc.tiKwd.value != titleInfoKeywords) {         //  Если есть новые ключевые слова...
         mDesc.tiKwd.value = titleInfoKeywords;   //  то отправляем их в дескрипшен
         change_T04=true;              //  Отмечаем, что данные изменились.
         }


                 /// <title-info>  ::  Дата текстом

 if (titleInfoDate  &&  mDesc.tiDate.value != titleInfoDate) {        //  Если есть новая дата...
         mDesc.tiDate.value = titleInfoDate;   //  то отправляем её в дескрипшен
         change_T05=true;              //  Отмечаем, что данные изменились.
         }


                 /// <title-info>  ::  Значение даты

 if (titleInfoDateValue  &&  mDesc.tiDateVal.value != titleInfoDateValue) {         //  Если есть новое значение даты...
         mDesc.tiDateVal.value = titleInfoDateValue;   //  то отправляем его в дескрипшен
         change_T06=true;              //  Отмечаем, что данные изменились.
         }


                 /// <title-info>  ::  Язык

 if (titleInfoLang  &&  mDesc.tiLang.value != titleInfoLang) {         //  Если есть новые данные по языку книги...
         ex = mDesc.tiLang.innerHTML;                 //  то сохраняем исходный текст структуры в дескрипшен,
         mDesc.tiLang.value = titleInfoLang;                     //  заменяем старые данные
         if (ex != mDesc.tiLang.innerHTML)  change_T07=true;   //  и если дескрипшен изменился - то отмечаем это.
         }


                 /// <title-info>  ::  Язык оригинала

 if (titleInfoSrcLang  &&  mDesc.tiSrcLang.value != titleInfoSrcLang) {        //  Если есть новые данные по языку оригинальной книги...
         ex = mDesc.tiSrcLang.innerHTML;                 //  то сохраняем исходный текст структуры в дескрипшен,
         mDesc.tiSrcLang.value = titleInfoSrcLang;                     //  заменяем старые данные
         if (ex != mDesc.tiSrcLang.innerHTML)  change_T08=true;   //  и если дескрипшен изменился - то отмечаем это.
         }


                 /// <title-info>  ::  Переводчики

 //  Запускаем функцию добавления авторов и переводчиков, и сохраняем результат в индикаторе изменений.
 change_T09 = AddAuthor (titleInfoTranslatorFirstName, titleInfoTranslatorMiddleName, titleInfoTranslatorLastName, titleInfoTranslatorNickname, titleInfoTranslatorEmail, titleInfoTranslatorHomePage, 0, mDesc.tiTrans, false);


                 /// <title-info>  ::  Серия

 //  Запускаем функцию добавления серии о сохраняем результат в индикаторе изменений.
 change_T10 = AddSequence (titleInfoSequenceName, titleInfoSequenceNumber, mDesc.tiSeq);


                 /// <title-info>  ::  Аннотация

 var Annotation=fbwBody.firstChild;   //  Предполагаемый раздел аннотации.

 if (Annotation.className == "annotation") {   //  Если "Annotation" - это действительно аннотация...

 ex = Annotation.innerHTML;    //  Сохраняем исходный текст.

         //  Очистка раздела аннотации
 if (ClearAnnotation == 0) {                //   Если выбрано удаление всех строк аннотации...
         Annotation.innerHTML = "";                  //  то удаляем всё из раздела аннотации,
         Annotation.insertAdjacentElement("beforeEnd", document.createElement("P"));   //  добавляем пустую строку
         window.external.inflateBlock(Annotation.lastChild)=true;
         }

         //  Добавление новых данных

 var reAnn01 = new RegExp("&lt;(/{0,1})strong&gt;","g");   //  Преобразование обычных тегов, в теги применяемые внутри FBE.
 var reAnn01_ = "<$1STRONG>";
 var reAnn02 = new RegExp("&lt;(/{0,1})emphasis&gt;","g");
 var reAnn02_ = "<$1EM>";
 var reAnn03 = new RegExp("&lt;(/{0,1})sup&gt;","g");
 var reAnn03_ = "<$1SUP>";
 var reAnn04 = new RegExp("&lt;(/{0,1})sub&gt;","g");
 var reAnn04_ = "<$1SUB>";

 var newSection = document.createElement("DIV");

 Length = titleInfoAnnotation.length;          //  Определяем длину массива с новыми данными.

 for ( ; k<Length; k++) {                 //  Перебираем все элементы с новыми данными.
         if (titleInfoAnnotation[k]) {              //  Если есть заполненные данные...
                 titleInfoAnnotation[k] = inCode(titleInfoAnnotation[k]);      //  то преобразуем текст в код, а обычные теги в рабочие.
                 titleInfoAnnotation[k] = titleInfoAnnotation[k].replace(reAnn01, reAnn01_).replace(reAnn02, reAnn02_).replace(reAnn03, reAnn03_).replace(reAnn04, reAnn04_);
                 }
         newSection.insertAdjacentElement("beforeEnd", document.createElement("P"));   //  Создаем новую строку в секции.
         newSection.lastChild.innerHTML = titleInfoAnnotation[k];     //  Затем добавляем в строку новые данные.
         window.external.inflateBlock(newSection.lastChild)=true;    //  На случай добавления пустой строки, нормализуем добавленную строку (строке с текстом это не повредит).
         }

 //  Удаляем первые пустые строки.
 while (newSection.firstChild  &&  newSection.firstChild.innerHTML.search(reELine) !=-1  &&  newSection.firstChild.innerHTML.search(reELine_ex) ==-1)
         newSection.firstChild.removeNode(true);

 //  Удаляем последние пустые строки.
 while (newSection.lastChild  &&  newSection.lastChild.innerHTML.search(reELine) !=-1  &&  newSection.lastChild.innerHTML.search(reELine_ex) ==-1)
         newSection.lastChild.removeNode(true);

 if (newSection.innerText !=""  &&  Annotation.innerHTML.search(newSection.innerHTML) ==-1) {   //  Если есть новые данные, и их нет в аннотации...
         //  то проверяем наличие пустой строки в конце аннотации
         if (Annotation.lastChild.innerHTML.search(reELine)==-1  ||  Annotation.lastChild.innerHTML.search(reELine_ex)!=-1) {
                 Annotation.insertAdjacentElement("beforeEnd", document.createElement("P"));   //  и если ее нет - добавляем новую.
                 window.external.inflateBlock(Annotation.lastChild)=true;
                 }
         if (Annotation.children.length ==1)   //  Если в аннотации нет текста...
                 Annotation.innerHTML = "";        //  то полностью очищаем её.
         while (newSection.firstChild)             //  Переносим все строки новых данных в аннотацию.
                 Annotation.insertAdjacentElement("beforeEnd", newSection.firstChild);
         }

 if (ex != Annotation.innerHTML)  change_T11=true;   //  Если дескрипшен изменился - то отмечаем это.

 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///   SRC-TITLE-INFO

 var change_S01=false;
 var change_S02=false;
 var change_S03=false;
 var change_S04=false;
 var change_S05=false;
 var change_S06=false;
 var change_S07=false;
 var change_S08=false;
 var change_S09=false;
 var change_S10=false;


                 /// <src-title-info>  ::  Жанры

 //  Запускаем функцию добавления жанров и сохраняем результат в индикаторе изменений.
 change_S01 = AddGenre (srcTitleInfoGenre, mDesc.stiGenre);


                 /// <src-title-info>  ::  Авторы

 //  Запускаем функцию добавления авторов и переводчиков, и сохраняем результат в индикаторе изменений.
 change_S02 = AddAuthor (srcTitleInfoAuthorFirstName, srcTitleInfoAuthorMiddleName, srcTitleInfoAuthorLastName, srcTitleInfoAuthorNickname, srcTitleInfoAuthorEmail, srcTitleInfoAuthorHomePage, srcTitleInfoAuthorID, mDesc.stiAuthor, true);


                 /// <src-title-info>  ::  Название

 if (srcTitleInfoBookTitle  &&  mDesc.stiTitle.value != srcTitleInfoBookTitle) {        //  Если есть новое название книги...
         mDesc.stiTitle.value = srcTitleInfoBookTitle;   //  то отправляем его в дескрипшен
         change_S03=true;              //  и отмечаем, что данные изменились.
         }


                 /// <src-title-info>  ::  Ключевые слова

 if (srcTitleInfoKeywords  &&  mDesc.stiKwd.value != srcTitleInfoKeywords) {        //  Если есть новые ключевые слова...
         mDesc.stiKwd.value = srcTitleInfoKeywords;   //  то отправляем их в дескрипшен
         change_S04=true;              //  и отмечаем, что данные изменились.
         }


                 /// <src-title-info>  ::  Дата текстом

 if (srcTitleInfoDate  &&  mDesc.stiDate.value != srcTitleInfoDate) {        //  Если есть новая дата...
         mDesc.stiDate.value = srcTitleInfoDate;   //  то отправляем её в дескрипшен
         change_S05=true;              //  и отмечаем, что данные изменились.
         }


                 /// <src-title-info>  ::  Значение даты

 if (srcTitleInfoDateValue  &&  mDesc.stiDateVal.value != srcTitleInfoDateValue) {        //  Если есть новое значение даты...
         mDesc.stiDateVal.value = srcTitleInfoDateValue;   //  то отправляем его в дескрипшен
         change_S06=true;              //  и отмечаем, что данные изменились.
         }


                 /// <src-title-info>  ::  Язык

 if (srcTitleInfoLang  &&  mDesc.stiLang.value != srcTitleInfoLang) {        //  Если есть новые данные по языку книги...
         ex = mDesc.stiLang.innerHTML;                 //  то сохраняем исходный текст структуры в дескрипшен,
         mDesc.stiLang.value = srcTitleInfoLang;                     //  заменяем старые данные
         if (ex != mDesc.stiLang.innerHTML)  change_S07=true;   //  и если дескрипшен изменился - то отмечаем это.
         }


                 /// <src-title-info>  ::  Язык оригинала

 if (srcTitleInfoSrcLang  &&  mDesc.stiSrcLang.value != srcTitleInfoSrcLang) {        //  Если есть новые данные по языку оригинальной книги...
         ex = mDesc.stiSrcLang.innerHTML;                 //  то сохраняем исходный текст структуры в дескрипшен,
         mDesc.stiSrcLang.value = srcTitleInfoSrcLang;                     //  заменяем старые данные
         if (ex != mDesc.stiSrcLang.innerHTML)  change_S08=true;   //  и если дескрипшен изменился - то отмечаем это.
         }


                 /// <src-title-info>  ::  Переводчики

 //  Запускаем функцию добавления авторов и переводчиков, и сохраняем результат в индикаторе изменений.
 change_S09 = AddAuthor (srcTitleInfoTranslatorFirstName, srcTitleInfoTranslatorMiddleName, srcTitleInfoTranslatorLastName, srcTitleInfoTranslatorNickname, srcTitleInfoTranslatorEmail, srcTitleInfoTranslatorHomePage, 0, mDesc.stiTrans, false);


                 /// <src-title-info>  ::  Серия

 //  Запускаем функцию добавления серии и сохраняем результат в индикаторе изменений.
 change_S10 = AddSequence (srcTitleInfoSequenceName, srcTitleInfoSequenceNumber, mDesc.stiSeq);


// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///   DOCUMENT-INFO

 var change_D01=false;
 var change_D02=false;
 var change_D03=false;
 var change_D04=false;
 var change_D05=false;
 var change_D06=false;
 var change_D07=false;
 var change_D08=false;
 var change_D09=false;


                 /// <document-info>  ::  Версия

 if (documentInfoVersion  &&  mDesc.diVersion.value != documentInfoVersion) {        //  Если есть новая версия...
         mDesc.diVersion.value = documentInfoVersion;   //  отправляем значение новой версии в дескрипшен
         change_D01=true;              //  и отмечаем, что данные изменились.
         }


                 /// <document-info>  ::  ID

 if (ChangeID == 0) {            //  Если выбрано изменение оригинального ID файла...
         mDesc.diID.value=window.external.GetUUID();    //  то изменяем его
         change_D02=true;              //  и отмечаем, что данные изменились.
         }


                 /// <document-info>  ::  Авторы

 change = false;              //  Отмечаем, что изменений пока нет.
 ex = mDesc.diAuthor.innerHTML;    //  Сохраняем исходный текст структуры.

 Length = documentInfoAuthorFirstName.length;          //  Определяем максимальную длину массива с новыми данными.
 if (documentInfoAuthorMiddleName.length > Length)
         Length = documentInfoAuthorMiddleName.length;
 if (documentInfoAuthorLastName.length > Length)
         Length = documentInfoAuthorLastName.length;
 if (documentInfoAuthorNickname.length > Length)
         Length = documentInfoAuthorNickname.length;

 div = mDesc.diAuthor.firstChild;         //  Находим первый элемент в разделе авторов.
 while (div.nextSibling.nodeName != "DIV")    //  Находим раздел перед первым "DIV".
         div = div.nextSibling;

 if (ChangeAuthor != 0) {                 //  Если выбрано добавление, а не замена...
         while (div.nextSibling  &&  div.nextSibling.nodeName == "DIV")    //  Находим последний раздел "DIV".
                 div = div.nextSibling;
         if (!div.all.first.value  &&  !div.all.middle.value  &&  !div.all.last.value  &&  !div.all.nick.value  &&  !div.all.email.value  &&  !div.all.home.value)  //  Если div - пустой...
                 div = div.previousSibling;      //  то новые данные сначала будут заноситься в этот раздел.
         }

Label_1:

 for ( ; k<Length; k++)                  //  Перебираем все элементы с новыми данными.
         if (documentInfoAuthorFirstName[k]  ||  documentInfoAuthorMiddleName[k]  ||  documentInfoAuthorLastName[k]  ||  documentInfoAuthorNickname[k]) {   //  Если есть заполненные данные...

                 if (ChangeAuthor != 0) {                //  Если выбрано добавление, а не замена...
                         mDiv = mDesc.diAuthor.getElementsByTagName("DIV");   //  Находим все разделы "DIV".
                         for (j=mDiv.length-1; j>=0; j--)         //  Если новые данные уже есть в дескрипшене...
                                 if (  (documentInfoAuthorFirstName[k] == mDiv[j].all.first.value  ||  !documentInfoAuthorFirstName[k]  &&  !mDiv[j].all.first.value)  &&
                                     (documentInfoAuthorMiddleName[k] == mDiv[j].all.middle.value  ||  !documentInfoAuthorMiddleName[k]  &&  !mDiv[j].all.middle.value)  &&
                                     (documentInfoAuthorLastName[k] == mDiv[j].all.last.value  ||  !documentInfoAuthorLastName[k]  &&  !mDiv[j].all.last.value)  &&
                                     (documentInfoAuthorNickname[k] == mDiv[j].all.nick.value  ||  !documentInfoAuthorNickname[k]  &&  !mDiv[j].all.nick.value)  )
                                             continue Label_1;        //  то пропускаем этого автора.
                         }
                 if (!div.nextSibling)               //  проверяем наличие отсутствия следующего раздела, и если нет его...
                         div.insertAdjacentElement("afterEnd", div.cloneNode(true));   //  и добавляем копию раздела "DIV".
                 div = div.nextSibling;               //  Затем переходим на следующий узел "DIV".
                 if (documentInfoAuthorFirstName[k])            //  Если есть новое имя автора...
                         div.all.first.value = documentInfoAuthorFirstName[k];   //  то заменяем старое,
                     else  div.all.first.value = "";                //  а если нет - то удаляем старое имя.
                 if (documentInfoAuthorMiddleName[k])            //  Если есть новое отчество автора...
                         div.all.middle.value = documentInfoAuthorMiddleName[k];   //  то заменяем старое,
                     else  div.all.middle.value = "";                //  а если нет - то удаляем старое отчество.
                 if (documentInfoAuthorLastName[k])                //  и т.д.
                         div.all.last.value = documentInfoAuthorLastName[k];
                     else  div.all.last.value = "";
                 if (documentInfoAuthorNickname[k])
                         div.all.nick.value = documentInfoAuthorNickname[k];
                     else  div.all.nick.value = "";
                 if (documentInfoAuthorEmail[k])
                         div.all.email.value = documentInfoAuthorEmail[k];
                     else  div.all.email.value = "";
                 if (documentInfoAuthorHomePage[k])
                         div.all.home.value = documentInfoAuthorHomePage[k];
                     else  div.all.home.value = "";
                 change=true;              //  Отмечаем, что данные изменились.
                 }

 if (change) {         //  Если данные изменились...
         while (div.nextSibling  &&  div.nextSibling.nodeName == "DIV")   //  то удаляем все неиспользованные разделы "DIV"
                 div.nextSibling.removeNode(true);
         PutSpacers(mDesc.diAuthor);                   //  и правильно оформляем список.
         }

 if (ex != mDesc.diAuthor.innerHTML)  change_D03=true;   //  Если дескрипшен изменился - то отмечаем это.


                 /// <document-info>  ::  Использованы программы

 if (documentInfoProgramUsed  &&  mDesc.diProgs.value != documentInfoProgramUsed) {        //  Если есть новые данные...
         mDesc.diProgs.value = documentInfoProgramUsed;   //  то отправляем их в дескрипшен
         change_D04=true;              //  и отмечаем, что данные изменились.
         }


                 /// <document-info>  ::  Дата текстом

 if (documentInfoDate == "сегодня")
         documentInfoDate = SegodnjaText;
 if (documentInfoDate  &&  mDesc.diDate.value != documentInfoDate) {        //  Если есть новые данные...
         mDesc.diDate.value = documentInfoDate;   //  то отправляем их в дескрипшен
         change_D05=true;              //  и отмечаем, что данные изменились.
         }


                 /// <document-info>  ::  Значение даты

 if (documentInfoDateValue == "сегодня")
         documentInfoDateValue = Segodnja;
 if (documentInfoDateValue  &&  mDesc.diDateVal.value != documentInfoDateValue) {        //  Если есть новые данные...
         mDesc.diDateVal.value = documentInfoDateValue;   //  то отправляем их в дескрипшен
         change_D06=true;              //  и отмечаем, что данные изменились.
         }


                 /// <document-info>  ::  Source OCR

 if (documentInfoSrcOcr  &&  mDesc.diOCR.value != documentInfoSrcOcr) {        //  Если есть новые данные...
         mDesc.diOCR.value = documentInfoSrcOcr;   //  то отправляем их в дескрипшен
         change_D07=true;              //  и отмечаем, что данные изменились.
         }


                 /// <document-info>  ::  Source URLs

 if (documentInfoSrcUrl) {                                 //  Если есть новые данные...
         ex = mDesc.diURL.innerHTML;    //  Сохраняем исходный текст структуры.
         mDiv = mDesc.diURL.getElementsByTagName("DIV");   //  Находим все разделы "DIV".
         for (j=mDiv.length-1; j>0; j--)                        //  И удаляем их все, кроме самого первого раздела.
                 mDiv[j].removeNode(true);
         div = mDiv[0];                 //  Выбираем оставшийся раздел.
         div.all.del.disabled = true;   //  Гасим там кнопку удаления.
         div.lastChild.value = documentInfoSrcUrl;    //  Заменяем старые данные.
         if (ex != mDesc.diURL.innerHTML)  change_D08=true;   //  Если дескрипшен изменился - то отмечаем это.
         }


                 /// <document-info>  ::  История изменений файла

         //  Поиск раздела "историй"
 var History=fbwBody.firstChild;   //  Предполагаемый раздел истории.
 while (History != null  &&  History.className != "history")    //  Пока не найдем настоящий раздел истории, или окажется, что истории нет в тексте...
         History = History.nextSibling;         //  переходим на следующий раздел.

         //  Добавление раздела истории
 if (History==null) {                 //   Если нет истории...
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
         change_D09=true;              //  и отмечаем, что данные изменились.
         }

         //  Очистка раздела истории
 if (ClearHistory == 0  &&  (History.children.length !=1  ||  History.children.length ==1  &&  History.lastChild.innerHTML !="")) {    //   Если выбрано удаление всех строк истории...
         History.innerHTML = "";                  //  то удаляем всё из раздела истории,
         History.insertAdjacentElement("beforeEnd",document.createElement("P"));   //  добавляем пустую строку
         window.external.inflateBlock(History.lastChild)=true;
         change_D09=true;              //  и отмечаем, что данные изменились.
         }

         //  Добавление новых данных
 if (documentInfoHistory) {        //  Если есть новые данные...
         documentInfoHistory = inCode(documentInfoHistory);
         var reHist10 = new RegExp("<P>"+documentInfoHistory+"</P>","");   //  Поиск строки с новыми данными.
         }
 if (documentInfoHistory  &&  History.innerHTML.search(reHist10) ==-1) {        //  Если есть новые данные, и их ещё нет в истории...
         if (History.lastChild.innerHTML.search(reELine)==-1  ||  History.lastChild.innerHTML.search(reELine_ex)!=-1)   //  то проверяем наличие пустой строки в конце истории
                 History.insertAdjacentElement("beforeEnd",document.createElement("P"));   //  и если ее нет - добавляем новую.
         History.lastChild.innerHTML = documentInfoHistory;     //  Затем добавляем в строку новые данные
         change_D09=true;              //  и отмечаем, что данные изменились.
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///   PUBLISH-INFO

 var change_P01=false;
 var change_P02=false;
 var change_P03=false;
 var change_P04=false;
 var change_P05=false;
 var change_P06=false;


                 /// <publish-info>  ::  Заголовок книги

 if (publishInfoBookName  &&  mDesc.piName.value != publishInfoBookName) {        //  Если есть новые данные...
         mDesc.piName.value = publishInfoBookName;   //  то отправляем их в дескрипшен
         change_P01=true;              //  и отмечаем, что данные изменились.
         }


                 /// <publish-info>  ::  Издатель

 if (publishInfoPublisher  &&  mDesc.piPub.value != publishInfoPublisher) {        //  Если есть новые данные...
         mDesc.piPub.value = publishInfoPublisher;   //  то отправляем их в дескрипшен
         change_P02=true;              //  и отмечаем, что данные изменились.
         }


                 /// <publish-info>  ::  Город

 if (publishInfoCity  &&  mDesc.piCity.value != publishInfoCity) {        //  Если есть новые данные...
         mDesc.piCity.value = publishInfoCity;   //  то отправляем их в дескрипшен
         change_P03=true;              //  и отмечаем, что данные изменились.
         }


                 /// <publish-info>  ::  Год

 if (publishInfoYear  &&  mDesc.piYear.value != publishInfoYear) {        //  Если есть новые данные...
         mDesc.piYear.value = publishInfoYear;   //  то отправляем их в дескрипшен
         change_P04=true;              //  и отмечаем, что данные изменились.
         }


                 /// <publish-info>  ::  ISBN

 if (publishInfoISBN  &&  mDesc.piISBN.value != publishInfoISBN) {        //  Если есть новые данные...
         mDesc.piISBN.value = publishInfoISBN;   //  то отправляем их в дескрипшен
         change_P05=true;              //  и отмечаем, что данные изменились.
         }


                 /// <publish-info>  ::  Серия

 //  Запускаем функцию добавления серии и сохраняем результат в индикаторе изменений.
 change_P06 = AddSequence (publishInfoSequenceName, publishInfoSequenceNumber, mDesc.piSeq);

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///   CUSTOM-INFO

 var change_C01=false;


                 /// <custom-info>  ::  Тип / Значение

 change = false;              //  Отмечаем, что изменений пока нет.
 ex = mDesc.ci.innerHTML;    //  Сохраняем исходный текст структуры.

 Length = customInfo.length;          //  Определяем длину массива с новыми данными.

 div = mDesc.ci.firstChild;         //  Находим первый элемент в разделе дополнительной информации.
 while (div.nextSibling.nodeName != "DIV")    //  Находим раздел перед первым "DIV".
         div = div.nextSibling;

 for ( ; k<Length; k++) {                 //  Перебираем все элементы с новыми данными.
         customInfo[k] = customInfo[k].replace(/^\n+|\n+$/g, "");   //  Удаляем все первые и последние разрывы строк.
         if (customInfo[k]) {               //  Если есть заполненные данные...
                 if (!div.nextSibling)               //  проверяем наличие отсутствия следующего раздела, и если нет его...
                         div.insertAdjacentElement("afterEnd", div.cloneNode(true));   //  и добавляем копию раздела "DIV".
                 div = div.nextSibling;               //  Затем переходим на следующий узел "DIV".
                 div.all.val.innerText = customInfo[k];   //  Заменяем дополнительные данные в этом узле.
                 if (customInfoType[k])                           //  Если указан тип данных...
                         div.all.type.value = customInfoType[k];    //  то добавляем и его,
                     else  div.all.type.value = "";    //  а если нет - то удаляем старое значение типа.
                 change=true;              //  и отмечаем, что данные изменились.
                 }
         }

 if (change) {         //  Если данные изменились...
         while (div.nextSibling  &&  div.nextSibling.nodeName == "DIV")   //  то удаляем все неиспользованные разделы "DIV".
                 div.nextSibling.removeNode(true);
         PutSpacers(mDesc.ci);                   //  и правильно оформляем список.
         }

 if (ex != mDesc.ci.innerHTML)  change_C01=true;   //  Если дескрипшен изменился - то отмечаем это.

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///  ПОВЫШЕНИЕ ВЕРСИИ ФАЙЛА И ЗАПИСЬ В ИСТОРИЮ ИЗМЕНЕНИЙ
                 //  (применение функции "HistoryChange")

//  Если включена автоматическая функция, и отсутствует ручное добавление строки в историю...
 if (Version_on_off == 1  &&  !documentInfoHistory)
         HistoryChange(youName);   //  запускаем функцию для изменения данных истории.

 if (change_D09  ||  change_T11)  window.focus();  // Удаление курсора из текста, при изменении "истории" или "аннотации".

// ---------------------------------------------------------------
 window.external.EndUndoUnit(document);    // Конец записи в систему отмен.
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

                 mSt[ind]=" "+ScriptName+" v."+NumerusVersion;  ind++;
                 mSt[ind]="-----------------------------------------------------";  ind++;
                 mSt[ind]=" "+ShablonName;  ind++;
                 mSt[ind]="-----------------------------------------------------";  ind++;
 if (d)   { mSt[ind]=" Демонстрационный режим";  ind++ }

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
 if (change_T11 || d)  { mSt[ind]="   Аннотация";  ind++ }

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
 if (change_D09 || d)  { mSt[ind]="   История изменений";  ind++ }

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
 if (change_C01 || d)  { mSt[ind]="   Весь раздел";  ind++ }

 if (cTaT==ind-2)  ind=ind-2;   //  Если нет пунктов с изменениями - удаление двух последних строк.

 if (cTaT0==ind || d) {
         mSt[ind]="";  ind++;
         mSt[ind]="   >> Исправлений нет";  ind++;
         if (ShablonName == "«Без изменений»") {
                 mSt[ind]="";  ind++;
                 mSt[ind]="Сейчас скрипт не производит никаких ";  ind++;
                 mSt[ind]="изменений в разделе <description>. ";  ind++;
                 mSt[ind]="Для того, чтобы он что-то сделал, ";  ind++;
                 mSt[ind]="необходимо указать, что именно от него ";  ind++;
                 mSt[ind]="требуется, в коде самого скрипта. ";  ind++;
                 mSt[ind]="А точнее в разделах: «Настройки» и ";  ind++;
                 mSt[ind]="«Добавляемые данные». ";  ind++;
                 mSt[ind]="Оба этих раздела расположены в самом ";  ind++;
                 mSt[ind]="начале скрипта. ";  ind++;
                 }
         }

 //  Сборка строк текущей даты и времени
 mSt[ind]="					";  ind++;
 mSt[ind]="-----------------------------------------------------";  ind++;
 mSt[ind]= "• "+currentDate+" • "+currentTime+" •";  ind++;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Вывод окна результатов на экран

 var st2="";  //  текст результатов

 for  ( k=0; k!=ind; k++ )     //  Последовательный перебор всех элементов массива строк с результатами обработки.
        st2+=mSt[k]+"\n";      //  Добавление элемента из массива.

         //  Вывод окна результатов
 MsgBox(st2);

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------

 }




                 ///  ИСТОРИЯ ИЗМЕНЕНИЙ

// v.1.0 — Создание скрипта — Александр Ка (17.05.2025)
// v.1.1 — Добавление обработки аннотации  — Александр Ка (20.05.2025)
// v.1.2 — Исправлены две мелкие ошибки  — Александр Ка (21.05.2025)
// v.1.3 — Александр Ка (09.06.2025)
//   возможность записи в историю изменений и аннотацию символов:   "<", ">", "&"
//   сокращение кода скрипта
//   более точная статистика
//   правильное оформление списков при добавлении авторов, жанров и т.д.
//   напоминание
// v.1.4 — Исправлены две ошибки  — Александр Ка (13.06.2025)



