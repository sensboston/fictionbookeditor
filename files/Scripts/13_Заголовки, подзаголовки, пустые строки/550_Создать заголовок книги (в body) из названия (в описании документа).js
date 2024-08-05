//======================================
//             «Создать заголовок книги из названия»
//      Добавление заголовка в основное <body> с использованием данных из <title-info>
//~~~~~~~~~~~~~~~~~~
// v.1.0 — Создание скрипта — Александр Ка (14.06.2024)
//~~~~~~~~~~~~~~~~~~
// v.1.1 — Александр Ка (19.06.2024)
// + Возможность добавлять новые строки в уже существующий заголовок
// + Возможность добавлять имена авторов при превышении максимума
// + Мелочи
//~~~~~~~~~~~~~~~~~~


var NumerusVersion="1.1";


function Run() {

// ---------------------------------------------------------------
// ---------------------------------------------------------------
// ---------------------------------------------------------------

                 ///  НАСТРОЙКИ

// ---------------------------------------------------------------

//     Добавлять новые строки в начало уже существующего заголовка

var TitlePlusTitle = 0;      // 0 ; 1 //      ("0" — НЕ добавлять, "1" — добавлять)

// ---------------------------------------------------------------

//     Максимальное число авторов книги, имена которых можно вписать в заголовок

var MaxAuthor = 5;      // 1 ; 2 ; 3 ; и т.д.

//     Если число окажется больше максимума ...

var AuthorPlus = 0;      // 0 ; 1 //      ("0" — ничего не вписывать, "1" — вписывать максимум)

// ---------------------------------------------------------------

//     Добавлять курсив к именам авторов

var Emphasis = 0;      // 0 ; 1 //      ("0" — НЕ добавлять, "1" — добавлять)

// ---------------------------------------------------------------

//     Добавлять КАПС к названию книги

var UpperCase = 0;      // 0 ; 1 //      ("0" — НЕ добавлять, "1" — добавлять)

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОБЩИЕ ПЕРЕМЕННЫЕ


//   Неразрывные пробелы  ;  ("+nbspEntity+") - для поиска  ;  ("+nbspChar+") - для замены  ;
 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar }
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;" }

//  Счетчики цикла
var j = 0;
var n = 0;

//  Структура текста (аннотация + история + все <body>, иначе говоря, всё что видно в режиме "B"-дизайн)
 var fbwBody = document.getElementById("fbw_body");

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// Функция склонения по падежам в зависимости от числа


 var ok=0;
 var m1;
 var m2;
 var Numer;

 function pad(Numer) {
         ok=2;
         m1=Numer % 10;
         m2=Numer % 100;
         if (m2<11 || m2>19) {
                 if (m1==1) ok=0;
                 else  if (m1==2 || m1==3 || m1==4) ok=1;    }
         return ok;
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ПОДГОТОВКА ЗАГОЛОВКА


 var mDiv=[];      //  массив с узлами "DIV" (рабочий массив)
 var div;                //  один из узлов "DIV"

 var mBody=[];  //  массив с узлами "body"
 var count_Body = 0;

 var History;
 var Annotation;

mDiv=fbwBody.children;  //  массив с дочерними узлами "fbwBody"


 for (j=0; j<mDiv.length; j++) {
         div = mDiv[j];

         // Создание массива с узлами "body"  (без "body" примечаний, и комментариев)
         if (div.className =="body"  &&  div.getAttribute("fbname") !="notes"  &&  div.getAttribute("fbname") !="comments")
                 { mBody[count_Body] = div;  count_Body++ }

         // Раздел <history>
         if (div.className =="history")
                 History = div;

         // Раздел <annotation>
         if (div.className =="annotation")
                 Annotation = div;
         }


 var Body;

         //  Если несколько разделов <body>  :::  ошибка
 if (count_Body>1) {
         var razdelov = [ " раздел", " раздела", " разделов" ];
         MsgBox ("                                                               –= ◊ =–                                                                                \n\n"+
                            "       В книге "+count_Body+razdelov[pad(count_Body)]+" <body>.\n"+
                            "       Скрипт не понимает, в какой из них добавлять заголовок.");
         return;
         }


         //  Если один раздел <body>  :::  норма
 if (count_Body==1) Body = mBody[0];


    window.external.BeginUndoUnit(document,"«Создать заголовок книги из названия» v."+NumerusVersion);                               // ОТКАТ (undo) начало


         //  Если нет разделов <body>  :::  создание нового раздела <body>
 var newTitle;
 if (count_Body==0) {
         Body = document.createElement("DIV");
         Body.className = "body";
         Body.setAttribute("xmlns:l","http://www.w3.org/1999/xlink");
         Body.setAttribute("xmlns:f","http://www.gribuser.ru/xml/fictionbook/2.0");
         if (History) History.insertAdjacentElement("afterEnd", Body);
             else if (Annotation) Annotation.insertAdjacentElement("afterEnd", Body);
                 else fbwBody.insertAdjacentElement("afterBegin", Body);
         var newSection = document.createElement("DIV");
         newSection.className = "section";
         Body.insertAdjacentElement("afterBegin", newSection);
         newSection.insertAdjacentElement("afterBegin", document.createElement("P"));
         window.external.inflateBlock(newSection.firstChild)=true;
         }


 mDiv = Body.children;  //  массив с дочерними узлами <body>
 var Title;

 for (j=0; j<mDiv.length; j++) {
         div = mDiv[j];

         // Раздел <title>
         if (div.className == "title") {
                 Title = div;
                 break;    }
         }


         //  Если нет раздела <title>  :::  создание нового раздела <title>
 if (!Title) {
         Title = document.createElement("DIV");
         Title.className = "title";
         if (Body.firstChild  &&  Body.firstChild.nodeName == "DIV"  &&  Body.firstChild.className == "image")
                 Body.firstChild.insertAdjacentElement("afterEnd", Title);
             else Body.insertAdjacentElement("afterBegin", Title);
         Title.insertAdjacentElement("afterBegin", document.createElement("P"));
         window.external.inflateBlock(Title.firstChild)=true;
         }

 var mP = Title.children;  //  массив с дочерними элементами <title>

 var ptr;
 var re212 = new RegExp("^(\\\s|"+nbspEntity+"|&nbsp;|<[^>]{1,}>){0,}$","");
 var re212ex = new RegExp("<SPAN class=image","");

 if (TitlePlusTitle != 1) {
         for (j=0; j<mP.length; j++) {
                 ptr = mP[j];
                 if (ptr.nodeName != "P"  ||  ptr.innerHTML.search(re212) == -1  ||  ptr.innerHTML.search(re212ex) != -1) {
                 MsgBox ("                                                               –= ◊ =–                                                                                \n\n"+
                                    "       В разделе <body> уже есть заполненный заголовок.\n\n"+
                                    "       * В «Настройках» скрипта можно изменить способ добавления заголовка.");
                         window.external.EndUndoUnit(document);
                         return;    }
                 }
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ПОЛУЧЕНИЕ ДАННЫХ


 var maximum;
 var firstName;
 var middleName;
 var lastName;
 var mInput=[];
 var inp;
 var authorName;
 var authorNameS="";
 var authorName_2;
 var authorNameS_2="";
 var imen_avtorov = [ " имя автора", " имени авторов", " имен авторов" ];

 var tiAuthor=document.getElementById("tiAuthor");  //  раздел с авторами книги

 mDiv = tiAuthor.getElementsByTagName("DIV");  //  массив с узлами "DIV" (каждый узел посвещен отдельному автору)

 if (mDiv.length <= MaxAuthor)  maximum = mDiv.length;
     else { if (AuthorPlus ==1)  maximum = MaxAuthor;
         else {
                 MsgBox ("                                                               –= ◊ =–                                                                                \n\n"+
                                    "       В разделе <title-info> записано "+mDiv.length+imen_avtorov[pad(mDiv.length)]+".\n"+
                                    "       Это превышает максимальное число авторов книги,\n"+
                                    "       имена которых можно вписать в заголовок.\n\n"+
                                    "       * В «Настройках» скрипта можно изменить это число и способ записи.");
                 maximum = 0;    }
         }

// удаление начальных и конечных пробелов строки
 var re121 = new RegExp("^(\\\s|"+nbspEntity+"|[           ​  ⁠　]{1,})|(\\\s|"+nbspEntity+"|[           ​  ⁠　]){1,}$","g");

 for (j=0; j<maximum; j++) {
         mInput = mDiv[j].getElementsByTagName("INPUT");
         for (n=0; n<mInput.length; n++) {
                 inp = mInput[n];
                 if (inp.getAttribute("id") == "first")   firstName=inp.value.replace(re121, "");               //  Получение имени
                 if (inp.getAttribute("id") == "middle")   middleName=inp.value.replace(re121, "");   //  Получение отчества
                 if (inp.getAttribute("id") == "last")   lastName=inp.value.replace(re121, "");    }            //  Получение фамилии
         authorName="";
         authorName_2="";
         if (firstName != "")  authorName += " " + firstName;               //  Имя
         if (middleName != "")  authorName += " " + middleName;   //  Имя + Отчество
         if (lastName != "")  authorName += " " + lastName;                  //  Имя + Отчество + Фамилия
         if (authorName != "")  authorNameS += "," + authorName;   //  добавление этого ФИО в строку авторов
         if (firstName != "")  authorName_2 += " " + firstName;                                //  Имя
         if (lastName != "")  authorName_2 = authorName_2 + " " + lastName;   //  Имя + Фамилия
         if (authorName_2 == "")  authorName_2 = authorName;                           //  на случай, если имя автора состоит только из отчества
         if (authorName_2 != "")  authorNameS_2 += "," + authorName_2;         //  добавление этого ФИО в строку авторов  //  без отчества
         }

 authorNameS = authorNameS.replace(/^, /, "");
 authorNameS_2 = authorNameS_2.replace(/^, /, "");

 if (AuthorPlus ==1  &&  authorNameS !=""  &&  mDiv.length > MaxAuthor) {
         authorNameS += " и др.";
         authorNameS_2 += " и др.";    }

 var tiTitle=document.getElementById("tiTitle");  //  раздел с названием книги
 var bookTitle=tiTitle.value.replace(re121, "");             //  Получение названия книги


 if (authorNameS == ""  &&  maximum != 0) {
         MsgBox ("                                                               –= ◊ =–                                                                                \n\n"+
                            "       В разделе <title-info> отсутствуют имена авторов.\n");
         }

 if (authorNameS == ""  &&  maximum != 0) {
         MsgBox ("                                                               –= ◊ =–                                                                                \n\n"+
                            "       В разделе <title-info> отсутствует название книги.\n");
         }

 if (authorNameS == ""  &&  bookTitle == "") {
         window.external.EndUndoUnit(document);
         return;
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ДОБАВЛЕНИЕ СТРОК ЗАГОЛОВКА

 var Otvet = true;
 if (authorNameS != authorNameS_2) {
        Otvet=AskYesNo("                                                  <?>     ДОБАВЛЯТЬ  ОТЧЕСТВО     <?>                                                                   \n" +
                                           "                                     ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ \n\n" +
                                           "‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ 	•  ДА:\n" +
                                           "̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍\n" +
                                           "◊     " + authorNameS + "\n\n" +
                                           "‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ 	•  НЕТ:\n" +
                                           "̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍\n" +
                                           "◊     " + authorNameS_2);
        vop="" }

 if (!Otvet) authorNameS = authorNameS_2;


 if (TitlePlusTitle != 1)  Title.innerHTML = "";

 if (bookTitle != ""  &&  UpperCase == 1)  bookTitle = bookTitle.toUpperCase();
 if (authorNameS != ""  &&  Emphasis == 1)  authorNameS = "<EM>" + authorNameS + "</EM>";

 var nachalo =true;
 if (TitlePlusTitle == 1) {
         var imenami_avtorov = [ "именем автора", "именами авторов", "именами авторов" ];
         for (j=0; j<mP.length; j++) {
                 ptr = mP[j];
                 if (ptr.nodeName == "P"  &&  ptr.innerHTML.search(re212) != -1  &&  ptr.innerHTML.search(re212ex) == -1)
                         { if (nachalo)  { ptr.removeNode(true); j-- }    }
                     else {
                             nachalo =false;
                             if (ptr.nodeName == "P"  &&  authorNameS != ""  &&  authorNameS == ptr.innerHTML) {
                                     MsgBox ("                                                               –= ◊ =–                                                                                \n\n"+
                                                        "       В существующем заголовке уже есть строка с   "+imenami_avtorov[pad(maximum)]+",                      \n"+
                                                        "       которую можно было бы добавить из раздела <title-info>.");
                                     authorNameS = "";    }
                             if (ptr.nodeName == "P"  &&  bookTitle != ""  &&  bookTitle == ptr.innerHTML) {
                                     MsgBox ("                                                               –= ◊ =–                                                                                \n\n"+
                                                        "       В существующем заголовке уже есть строка с   названием книги,\n"+
                                                        "       которую можно было бы добавить из раздела <title-info>.");
                                     bookTitle = "";    }
                             }
                 }
         if (authorNameS == ""  &&  bookTitle == "") {
                 window.external.EndUndoUnit(document);
                 return;    }
         if (Title.innerHTML != "") {
                 Title.insertAdjacentElement("afterBegin", document.createElement("P"));
                 window.external.inflateBlock(Title.firstChild)=true;    }
         }

 if (bookTitle != "") {
         Title.insertAdjacentElement("afterBegin", document.createElement("P"));
         Title.firstChild.innerHTML = bookTitle;    }
 if (authorNameS != "") {
         Title.insertAdjacentElement("afterBegin", document.createElement("P"));
         Title.firstChild.innerHTML = authorNameS;    }


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



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Сборка массива с результатами обработки


 var mSt=[];
 var ind=1;

                                                             mSt[ind]='• Заголовок, созданный из данных <title-info>';  ind++;
 if (nachalo) {                                  mSt[ind]='                                          успешно добавлен в текст';  ind++;    }
 if (!nachalo) {                                 mSt[ind]='                        успешно добавлен в существующий заголовок';  ind++;    }

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
 MsgBox ('                       .·.·.·.                              –= ◊ =–                              .·.·.·.\n'+
                   '                    ·.̉·.̉·.̉  «Создать заголовок книги из названия» v.'+NumerusVersion+'  .̉·.̉·.̉·                                      \n'+
                   '                        ̉   ̉   ̉                                                                                ̉   ̉   ̉ '+st2);

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



}







