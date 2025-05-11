//======================================
//             «Создать заголовок книги»
//  Добавление заголовка в основное <body> с использованием данных из <title-info>
//  Скрипт тестировался в FBE v.2.7.7 (win XP, IE8 и win 7, IE11)
//  * История изменений в конце скрипта
//======================================

function Run() {
 var ScriptName="«Создать заголовок книги»";
var NumerusVersion="1.3";

// ---------------------------------------------------------------
                 ///  НАСТРОЙКИ
// ---------------------------------------------------------------

//     Добавлять новые строки в начало уже существующего заголовка

 var TitlePlusTitle = 1;      // 0 ; 1 //      ("0" — НЕ добавлять, "1" — добавлять)

// ---------------------------------------------------------------

//     Максимальное число авторов книги, имена которых можно вписать в заголовок

 var MaxAuthor = 5;      // 1 ; 2 ; 3 ; и т.д.

//     Если число окажется больше максимума ...

 var AuthorPlus = 1;      // 0 ; 1 //      ("0" — ничего не вписывать, "1" — вписывать максимум)

// ---------------------------------------------------------------

//     Добавлять курсив к именам авторов

 var Emphasis = 0;      // 0 ; 1 //      ("0" — НЕ добавлять, "1" — добавлять)

// ---------------------------------------------------------------

//     Добавлять КАПС к названию книги

 var UpperCase = 0;      // 0 ; 1 //      ("0" — НЕ добавлять, "1" — добавлять)

// ---------------------------------------------------------------

//     Порядок строк в заголовке

 var Porjadok_strok = 0;      // 0 ; 1 //

 //  "0" — сначала   Автор книги,   потом   Название
 //  "1" — сначала   Название,   потом   Автор книги

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОБЩИЕ ПЕРЕМЕННЫЕ

//   Неразрывные пробелы
 var nbspEntity="&nbsp;";
 try { var nbspChar=window.external.GetNBSP();  if (nbspChar.charCodeAt(0)!=160)  nbspEntity=nbspChar }
 catch(e) { var nbspChar=String.fromCharCode(160) }

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


                 /// ФУНКЦИЯ ПЕРЕХОДА

// * В отличии от встроенной функции "GoTo", здесь есть прокрутка влево.

 function GoTo_0(elem) {
         var b=elem.getBoundingClientRect();                  //  Получение координат элемента.
         var c=fbwBody.parentNode.getBoundingClientRect();        //  Получение координат раздела <BODY>.
         if (b.bottom-b.top <= window.external.getViewHeight())                                                  //  Если высота элемента меньше высоты окна...
                 window.scrollBy(c.left, (b.top+b.bottom-window.external.getViewHeight())/2);   //  то переставляем середину элемента на середину окна.
             else  window.scrollBy(c.left, b.top);                                //  А если нет - то переставляем начало элемента в начало окна.

         var r=document.selection.createRange();
         if (!r || !("compareEndPoints" in r)) return;
         r.moveToElementText(elem);
         r.collapse(true);
         if(r.parentElement!==elem && r.move("character",1)==1) r.move("character",-1);
         r.select();
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
         MsgBox ("\n"+" В книге "+count_Body+razdelov[pad(count_Body)]+" <body>       \n\n"+
                 " Скрипт не понимает       \n в какой из них добавлять заголовок.       \n");
         return;
         }


         //  Если один раздел <body>  :::  норма
 if (count_Body==1) Body = mBody[0];


 window.external.BeginUndoUnit(document, ScriptName+" v."+NumerusVersion);    // Начало записи в систему отмен.


         //  Если нет разделов <body>  :::  создание нового раздела <body> с пустой секцией
 var newTitle;
 if (count_Body==0) {
         Body = document.createElement("DIV");
         Body.className = "body";
         Body.setAttribute("xmlns:l", xlNS);    //  "xlNS" и "fbNS" - переменные из "main.js"
         Body.setAttribute("xmlns:f", fbNS);
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


         //  Проверка на существование заголовка книги

 var mP = Title.children;  //  массив с дочерними элементами <title>
 var ptr;
 var re212 = new RegExp("^(\\\s|"+nbspEntity+"|&nbsp;|<[^>]{1,}>){0,}$","");
 var re212ex = new RegExp("<SPAN [^>]{0,}?class=image","");

 if (TitlePlusTitle != 1) {
         for (j=0; j<mP.length; j++) {
                 ptr = mP[j];
                 if (ptr.nodeName != "P"  ||  ptr.innerHTML.search(re212) == -1  ||  ptr.innerHTML.search(re212ex) != -1) {
                         MsgBox ("\n" + " В разделе <body> уже есть заголовок       \n\n"+
                                 " * В «Настройках» скрипта можно изменить       \n    способ добавления заголовка.       ");
                         window.external.EndUndoUnit(document);
                         return;
                         }
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
 var najdeny = [ " найден", " найдены", " найдены" ];
 var avtorov_knigi = [ " автор книги", " автора книги", " авторов книги" ];

 var tiAuthor=document.getElementById("tiAuthor");  //  раздел с авторами книги

 mDiv = tiAuthor.getElementsByTagName("DIV");  //  массив с узлами "DIV" (каждый узел посвящен отдельному автору)

 if (mDiv.length <= MaxAuthor)  maximum = mDiv.length;
     else { if (AuthorPlus ==1)  maximum = MaxAuthor;
         else {
                 MsgBox ("\n" + " В разделе <title-info> "+najdeny[pad(mDiv.length)]+" "+mDiv.length+avtorov_knigi[pad(mDiv.length)]+"       \n\n"+
                         " Это превышает максимальное число авторов,       \n"+
                         " имена которых можно вписать в заголовок.       \n\n"+
                         " * В «Настройках» скрипта можно изменить       \n"+
                         "    способ записи и максимальное число.       ");
                 maximum = 0;    }
         }


         //  Рег. выражения для функции "HandleValue"

         // Удаление начальных и конечных пробелов строки
 var re121 = new RegExp("^(\\\s|"+nbspChar+"|&nbsp;|[            ​  ⁠　]{1,})|(\\\s|"+nbspChar+"|&nbsp;|[            ​  ⁠　]){1,}$","g");
 var re121_ = "";

         // Коррекция спец. символов
 var re122 = new RegExp("&","g");
 var re122_ = "&amp;";

 var re123 = new RegExp("<","g");
 var re123_ = "&lt;";

 var re124 = new RegExp(">","g");
 var re124_ = "&gt;";

 var re125 = new RegExp(" ","g");
 var re125_ = nbspChar;


         //  Функция обработки значений "value" из <title-info>

 var vl="";

 function HandleValue(vl) {
         vl = vl.replace(re121, re121_);
         vl = vl.replace(re122, re122_);
         vl = vl.replace(re123, re123_);
         vl = vl.replace(re124, re124_);
         vl = vl.replace(re125, re125_);
         return vl;
         }


 for (j=0; j<maximum; j++) {
         mInput = mDiv[j].getElementsByTagName("INPUT");
         for (n=0; n<mInput.length; n++) {
                 inp = mInput[n];
                 if (inp.getAttribute("id") == "first")   firstName=HandleValue(inp.value);               //  Получение имени
                 if (inp.getAttribute("id") == "middle")   middleName=HandleValue(inp.value);   //  Получение отчества
                 if (inp.getAttribute("id") == "last")   lastName=HandleValue(inp.value);    }            //  Получение фамилии
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
 var bookTitle= HandleValue(tiTitle.value);             //  Получение названия книги


 if (authorNameS == ""  &&  maximum != 0) {
         MsgBox ("\n"+
                 " В разделе <title-info> отсутствуют имена авторов \n");
         }

 if (bookTitle == "") {
         MsgBox ("\n"+
                 " В разделе <title-info> отсутствует название книги       \n");
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
        Otvet=AskYesNo(" ◊  Добавлять  отчество?       \n" +
                 "-------------------------------------------------------       \n" +
                 "• Да:	" +
                 authorNameS + "       \n\n" +
                 "• Нет:	" +
                 authorNameS_2 + "       ");
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
                                     MsgBox ("\n"+
                                         " В заголовке уже есть строка       \n"+
                                         " с "+imenami_avtorov[pad(maximum)]+" из <title-info>       \n");
                                     authorNameS = "";    }
                             if (ptr.nodeName == "P"  &&  bookTitle != ""  &&  bookTitle == ptr.innerHTML) {
                                     MsgBox ("\n"+
                                         " В заголовке уже есть строка       \n"+
                                         " с названием книги из <title-info>       ");
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

 if (Porjadok_strok == 0)
         if (bookTitle != "") {
                 Title.insertAdjacentElement("afterBegin", document.createElement("P"));
                 Title.firstChild.innerHTML = bookTitle;    }

 if (authorNameS != "") {
         Title.insertAdjacentElement("afterBegin", document.createElement("P"));
         Title.firstChild.innerHTML = authorNameS;    }

 if (Porjadok_strok != 0)
         if (bookTitle != "") {
                 Title.insertAdjacentElement("afterBegin", document.createElement("P"));
                 Title.firstChild.innerHTML = bookTitle;    }

 GoTo_0(Title);

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


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Сборка массива с результатами обработки

 var mSt=[];
 var ind=0;

                 mSt[ind]=" "+ScriptName+" v."+NumerusVersion;  ind++;
                 mSt[ind]="-------------------------------------------------------";  ind++;
                 mSt[ind]="";  ind++;

                             mSt[ind]="• Заголовок, созданный из данных <title-info>";  ind++;
 if (nachalo)  { mSt[ind]="   успешно добавлен в текст книги";  ind++;    }
 if (!nachalo) { mSt[ind]="   успешно добавлен в существующий заголовок";  ind++;    }

//  Сборка строк текущей даты и времени
                             mSt[ind]="";  ind++;
                             mSt[ind]= "• "+currentDate+" • "+currentTime+" •";  ind++;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Вывод окна результатов на экран

 var st2="";  //  текст результатов

 for  ( j=0; j!=ind; j++ )
        st2+=mSt[j]+"       \n";  //  добавление элемента из массива


//  Вывод окна результатов
 MsgBox (st2);

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------

}



                 ///  ИСТОРИЯ

//~~~~~~~~~~~~~~~~~~
// v.1.0 — Создание скрипта — Александр Ка (14.06.2024)
//~~~~~~~~~~~~~~~~~~
// v.1.1 — Александр Ка (19.06.2024)
// Возможность добавлять новые строки в уже существующий заголовок
// Возможность добавлять имена авторов при превышении максимума
//~~~~~~~~~~~~~~~~~~
// v.1.2 — Александр Ка (16.01.2025)
// Изменено имя скрипта (было «Создать заголовок книги из названия»)
// Исправлены все ошибки в окнах для win7
// Исправлена ошибка с возможным удалением иллюстрации в заголовке (в IE11)
// Добавлена обработка спец. символов: «&», «<», «>» и н/р пробела
// Возможность изменить порядок строк
//~~~~~~~~~~~~~~~~~~
// v.1.3 — Мелочи — Александр Ка (28.04.2025)
//~~~~~~~~~~~~~~~~~~






