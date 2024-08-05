//======================================
//             «Чистка структуры»
//~~~~~~~~~~~~~~~~~~
// v.1.0 — Создание скрипта — Александр Ка (27.03.2024)
// v.1.1 — Исправлена ошибка с добавлением пустых строк — Александр Ка (10.06.2024)
// v.1.2 — Коррекция метода удаления пустого заголовка — Александр Ка (13.07.2024)
//~~~~~~~~~~~~~~~~~~


var NumerusVersion="1.2";

  var Ts=new Date().getTime();


function Run() {

//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------

                 ///  НАСТРОЙКИ

//--------------------------------------------------------------------

//     Переоформление картинок (Выведение картинки из пустого параграфа)
//     * Обрабатываются картинка выделенная курсивом, жирностью, зачеркиванием, верхним/нижним индексом. Кроме того, рядом с картинкой могут быть пробелы.
//     ** Все остальные случаи не обрабатываются. Например, когда в строке есть вторая картинка, текст, или если картинка служит сноской или ссылкой.
//     *** Кроме того, не обрабатывается параграф в заголовке, аннотации, истории, эпиграфе, в стихах, в цитате -- там возможна графика только внутри текста

var Obrabotka_Img_v_Texte_on_off = 2;      // 0 ; 1 ; 2 //      ("0" — никогда не переоформлять, "1" — всегда переоформлять, "2" — всегда спрашивать)

//--------------------------------------------------------------------

//     Перемещать картинки из "кармана" в отдельную секцию
//     <section> ... [иллюстрация] [внутренние секции] </section>   ›››   <section> ... [иллюстрация в отдельной секции] [внутренние секции] </section>
//     *  Под многоточием (...) может скрываться заголовок и/или эпиграфы
//     **  После перемещения, рядом с иллюстрацией создается ещё и новая пустая строка

var Obrabotka_karm_Img = 2;      // 0 ; 1 ; 2 //      ("0" — никогда не перемещать, "1" — всегда перемещать, "2" — всегда спрашивать)

//--------------------------------------------------------------------

//     Удалять пустую строку посреди текста заголовка

var Obrabotka_Entity_ttl = 2;      // 0 ; 1 ; 2 //      ("0" — никогда не удалять, "1" — всегда удалять, "2" — всегда спрашивать)

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОБЩИЕ ПЕРЕМЕННЫЕ


//   Неразрывные пробелы  ;  ("+nbspEntity+") - для поиска  ;  ("+nbspChar+") - для замены  ;
 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

//  Счетчики цикла
var j = 0;
var n = 0;

//  Структура текста (аннотация + история + все <body>, иначе говоря, всё что видно в режиме "B"-дизайн)
 var fbwBody=document.getElementById("fbw_body");

//  Подсчет времени, затраченного на паузы при открытии окон
 var T_pause=0;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОБРАБОТКА ТЕКСТА _1_  :  Параграфы <P>  :  операции  № 101-103
                 //      (регулярные выражения)


       //  Удаление тегов вложенного параграфа в параграф
 var re101 = new RegExp("<P>(.{0,}?)</P>","g");
 var re101_ = " $1 ";
 var count_101 = 0;

       //  Автоисправление вложений в параграф (перезапись внутреннего содержимого)
 var count_102 = 0;

       //  Удаление внутренних тегов вне параграфа
 var re103 = new RegExp("STRONG|EM|SUP|SUB|STRIKE|SPAN","g");
 var count_103 = 0;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОБРАБОТКА ТЕКСТА _1_  :  Параграфы <P>  :  операции  № 101-103
                 //      (сборка функции "AntiGluc(ptr)")


 var s="";  // Внутреннее содержание оригинального абзаца (<P>содержание</P>)

 function AntiGluc(ptr) {

    s=ptr.innerHTML;
   if (s.search(re101)!=-1)  { count_101+=s.match(re101).length;  s=s.replace(re101, re101_);  ptr.innerHTML=s }

    }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОБРАБОТКА ТЕКСТА _1_  :  Параграфы <P>  :  операции  № 101-103
                 //      (применение функции "AntiGluc(ptr)")


    window.external.BeginUndoUnit(document,"«Чистка структуры» v."+NumerusVersion+":   Операции №101-103");                               // ОТКАТ (UNDO) начало
            //  Эти три операции достаточно маловероятны, поэтому эта запись в систему откатов будет достаточно редкой


 var ptr=fbwBody;                                                           //  Начальное значение переменной "ptr"
 var ProcessingEnding=false;                              //  Флаг завершения обработки
 var nextPtr = false;                              //  Флаг перехода на соседний элемент

 while (!ProcessingEnding)  {             //  Если конца текста не видно — продолжаем путешествие.
         if (ptr.nodeName=="P")                  //  Если встретился параграф...
                 AntiGluc(ptr);                                                                        //  ...обрабатываем его функцией "AntiGluc".
         if (ptr.firstChild!=null  &&  ptr.nodeName!="P")                //  Если есть куда углубляться, и это всё ещё не параграф...
                 { ptr=ptr.firstChild }                                                       //  ...тогда спускаемся на один уровень.
             else {                                                                                                //  Если углубляться нельзя...
                     nextPtr = false;
                     while (!nextPtr) {
                             while (ptr.nextSibling==null)  {                              //  ...и если нет прохода на соседний элемент...
                                     ptr=ptr.parentNode;                                           //  ...тогда поднимаемся, пока не появится этот проход.
                                     if (ptr.nodeName =="P")  { ptr.innerHTML=ptr.innerHTML; count_102++ }
                                     if (ptr==fbwBody) {ProcessingEnding=true }           // А если поднявшись, оказываемся в "fbw_body" — объявляем о завершении обработки текста.
                                     }
                             while (ptr.nextSibling !=null  &&  ptr.nextSibling.nodeName.search(re103)!=-1)  { ptr.nextSibling.removeNode(false); count_103++ }
                             if (ptr.nextSibling !=null)  { ptr=ptr.nextSibling; nextPtr = true }                     //  Затем переходим на соседний элемент.
                             }
                     }
         }


    window.external.EndUndoUnit(document);                                             // undo конец (запись в систему для отката)

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОБРАБОТКА ТЕКСТА _2_  :  Параграфы <P>  :  операции  № 2хх
                 //      (регулярные выражения)


       //  Большое удаление дублей тегов внутри параграфа
 var count_201 = 0;


          // Замена кода н/р пробела на принятое обозначение в FBE
          // Устраняет небольшой глюк, который получается после вставки в FBE нескольких строк, или после некоторых скриптов
 var re211 = new RegExp("&nbsp;","g");
 var re211_ = nbspChar;
 var count_211 = 0;

         // Чистка пустых строк от пробелов и внутренних тегов
 var re212 = new RegExp("^(\\\s|"+nbspEntity+"|<[^>]{1,}>){1,}$","g");
 var re212ex = new RegExp("<SPAN class=image","g");
 var re212_ = "";
 var count_212 = 0;

         // Снятие форматирования "подзаголовок" с пустой строки
 var count_213 = 0;

         // Снятие форматирования "автор текста" с пустой строки
 var count_214 = 0;


         // Добавление формата "подзаголовок" для строк из символов

//  Разделы, где могут быть подзаголовки
 var re221 = new RegExp("^(annotation|poem|cite|history|section)$","g");

//  Для удаления пяти внутренних тегов
 var re222 = new RegExp("</{0,1}STRONG>|</{0,1}EM>|</{0,1}SUP>|</{0,1}SUB>|</{0,1}STRIKE>","g");

//  Для преобразования строк в подзаголовок, состоящих из символа ⁂ (три звездочки), или из 1-9 одинаковых символов ( • | * | + ), или из 3-9 одинаковых символов ( х | - | – | — | ~)  (дефисы/тире здесь считаются одинаковыми символами)
 var re223 = new RegExp("^(\\\s|"+nbspEntity+"|<[^>]{1,}>){0,}((\\\s|"+nbspEntity+"){0,}⁂|((\\\s|"+nbspEntity+"){0,}•){1,9}|((\\\s|"+nbspEntity+"){0,}\\\*){1,9}|((\\\s|"+nbspEntity+"){0,}\\\+){1,9}|((\\\s|"+nbspEntity+"){0,}[-–—]){3,9}|((\\\s|"+nbspEntity+"){0,}~){3,9}|((\\\s|"+nbspEntity+"){0,}[хx]){3,9})(\\\s|"+nbspEntity+"|<[^>]{1,}>){0,}$","g");

//  Для удаления внутренних тегов жирности и курсива
 var re224 = new RegExp("</{0,1}STRONG>|</{0,1}EM>","g");

// Замена символа ⁂ (три звездочки) на строку из трех звездочек   (символ ⁂ не видит большинство шрифтов)
 var re225 = new RegExp("^(\\\s|"+nbspEntity+"|<[^>]{1,}>){0,}⁂(\\\s|"+nbspEntity+"|<[^>]{1,}>){0,}$","g");
 var re225_ = "<SUB>*</SUB><SUP>*</SUP><SUB>*</SUB>";

//  Добавление пробелов между символами  | • | * | + |  для строк, состоящих из 2-5 таких одинаковых символов
 var re226s = new RegExp("^(<[^>]{1,}>){0,}(((\\\s|"+nbspEntity+"){0,}•){2,5}|((\\\s|"+nbspEntity+"){0,}\\\*){2,5}|((\\\s|"+nbspEntity+"){0,}\\\+){2,5})(\\\s|"+nbspEntity+"|<[^>]{1,}>){0,}$","g");
 var re226 = new RegExp("([•\\\*\\\+])(\\\s|"+nbspEntity+"){0,}(?=[•\\\*\\\+])","g");
 var re226_ = "$1 ";

 var count_227 = 0;  //  Счетчик изменений внутри строки
 var count_228 = 0;  //  Счетчик добавлений формата "подзаголовок"


         //  Внутренняя чистка графики в пустом параграфе  (от пробелов и внутренних тегов)
 var re231s = new RegExp("<SPAN class=image","g");
 var re231 = new RegExp("^(&nbsp;|\\\s|"+nbspEntity+"|<[^>]{1,}>){0,}(<SPAN class=image[^>]{1,}>)(<[^>]{1,}>){0,}(<IMG [^>]{1,}>)(&nbsp;|\\\s|"+nbspEntity+"|<[^>]{1,}>){0,}$","g");
 var re231_ = "$2$4</SPAN>";
 var count_231 = 0;
 var q_231 = false;

         // Снятие внешнего форматирования с графики в пустом параграфе
 var count_232 = 0;


         //  Блоки, после которых добавляется пустая строка, если они стоят в конце секции
 var re241 = new RegExp("^(title|epigraph|annotation)$","g");
 var count_241 = 0;


         //  Счетчик удаления дублей пустых строк
 var count_251 = 0;

         // Снятие внешнего форматирования с пустой строки
 var re252 = new RegExp("^(title|epigraph|stanza|poem|cite)$","g");  //  класс форматов, разрешенных к очистке
 var count_252 = 0;

         //  Удаление пустых строк в "body" и "fbw_body" (вне секции)
 var count_253=0;


         //  Удаление пустых "body"
 var count_262 = 0;

         //  Удаление пустых секций
 var count_263 = 0;


         //  Удаление пустых строк на окраине всех разделов, кроме таблиц
 var re271 = new RegExp("^(title|epigraph|image|annotation)$","g"); //  класс блоков:   между ними и концом секции сохраняется пустая строка
 var count_271 = 0;

         //  Удаление пустых строк за окраиной блоков
 var re272 = new RegExp("^(title|annotation|stanza|poem|epigraph|cite|subtitle)$","g");  //  класс блоков
 var count_272 = 0;


         //  Замена пустых строк на разрыв строф  (в стихах)
 var count_281 = 0;


       //  Поиск графики в тексте
 var re001 = new RegExp("^<SPAN class=image[^>]{1,}><IMG [^>]{1,}></SPAN>$","g");
 var m_001 = [];
 var count_001 = 0;

       //  Поиск пустых строк между строк заголовка
 var m_002 = [];
 var count_002 = 0;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОБРАБОТКА ТЕКСТА _2_  :  Параграфы <P>  :  операции  № 2хх
                 //      (сборка функции "HandleP(ptr)")


 var subPtr;  // Внутренние элементы параграфа
 var mmm1 = [];  //  Массив с внешними тегами : nodeName
 var mmm2 = [];  //  Массив с внешними тегами : className (для SPAN)
 var nextSubPtr;  //  Индикатор перехода на соседний полноценный элемент

 var sct="";  // Копия абзаца без некоторых тегов
 var sosedi;  //  Соседние узлы
 var stanza_2;  //  Копия строфы
 var ptrUp;  //  Узлы, которые выше параграфа
 var empty_line = document.createElement("P");   //  создание новой оболочки параграфа (позже, для создания пустой строки, туда добавится пустота: "")


 function HandleP(ptr) {

         //  Большое удаление дублей тегов внутри параграфа
 if (ptr.children.length !=0) {               //  Если в параграфе есть вложения...
         subPtr=ptr;                                           //  начальное значение переменной "subPtr"
         mmm1 = [];                                          //  массивы с данными об элементах
         mmm2 = [];
aaa:
         while (true)  {             //  Путешествие по структуре, пока не будет специального объявления о завершении цикла
                 if (subPtr.firstChild!=null  &&  subPtr.children.length !=0)  {                //  Если есть куда углубляться...
                         mmm1.push(subPtr.nodeName);                                      //  Записываем данные элемента в два массива
                         mmm2.push(subPtr.className);
                         subPtr=subPtr.firstChild;                                                             //  ...спускаемся на один уровень.
                         if (subPtr.nodeType ==1)                                                   //   Проверяем, является ли элемент   обычным элементом  (не текст, и не специфические элементы)
                                 for  (j=0; j<mmm1.length; j++)
                                         if (mmm1[j] == subPtr.nodeName  &&  mmm2[j] == subPtr.className) {     //   Сравниваем нижний элемент со списками в массивах
                                                 subPtr=subPtr.parentNode;                         //  Если есть совпадение --  возвращаемся
                                                 subPtr.firstChild.removeNode(false);          //   удаляем нижний тег
                                                             count_201++;                                             //   отмечаем это событие в счетчике
                                                 mmm1.pop();                                                         //   удаляем последние записи
                                                 mmm2.pop();
                                                 break  }                                                                         //   и выходим из цикла проверки.
                          }
                     else {                                                                                   //  Если углубляться нельзя...
                             nextSubPtr = false;                                                            //   Объявляем, что переход на полноценный соседний элемент ещё не состоялся
                             while (!nextSubPtr)  {                                                      //    И пока не осуществлен переход на полноценный соседний элемент...
                                     while (subPtr.nextSibling==null)  {                              //  В частности, если нет даже прохода на соседний элемент...
                                             subPtr=subPtr.parentNode;                                           //  ...тогда постепенно поднимаемся, пока не появится этот проход.
                                             mmm1.pop();                                                                       //   в процессе подъема удаляем последние записи
                                             mmm2.pop();
                                             if (subPtr==ptr) break aaa;             // А если поднявшись, вдруг оказываемся в "ptr" — объявляем о полном завершении обработки текста.
                                             }
                                     subPtr=subPtr.nextSibling;                      //  Затем переходим на соседний элемент.
                                     if (subPtr.nodeType ==1) {                              //   Проверяем, является ли элемент   обычным элементом  (не текст, и не специфические элементы)
                                             nextSubPtr = true;                                                   //   и если это так, то объявляем об успешном переходе на полноценный соседний элемент
                                             for  (j=0; j<mmm1.length; j++)               //  Потом проверяем этого соседа на повторение
                                                     if (mmm1[j] == subPtr.nodeName  &&  mmm2[j] == subPtr.className) {     //   Сравниваем соседний элемент со списками в массивах
                                                             subPtr=subPtr.previousSibling;               //  Если есть совпадение --  возвращаемся
                                                             subPtr.nextSibling.removeNode(false);     //   удаляем этот соседний тег
                                                             count_201++;                                                  //   отмечаем это событие в счетчике
                                                             nextSubPtr = false;                                    //   объявляем, что переход на полноценный соседний элемент был неудачным
                                                             break    }    }    }                                        //   и выходим из цикла проверки, чтобы сразу приступить к поиску нового соседа
                             }
                 }
         }                       //  Конец для    "Большое удаление дублей..."


    s=ptr.innerHTML;

         // Коррекция неразрывных пробелов
   if (nbspEntity!="&nbsp;"  &&  s.search(re211)!=-1)  { count_211+=s.match(re211).length; s=s.replace(re211, re211_) }

         // Чистка пустых строк от пробелов и внутренних тегов
   if (s.search(re212)!=-1  &&  s.search(re212ex)==-1)  { s=s.replace(re212, re212_); count_212++ }

         // Снятие форматирования "подзаголовок" с пустой строки
   if (s==""  &&  ptr.className=="subtitle")
           { ptr.removeAttribute("className"); count_213++ }

         // Снятие форматирования "автор текста" с пустой строки (если предыдущая строка без этого формата)
   if (s==""  &&  ptr.className=="text-author"  &&  (ptr.previousSibling==null  ||  (ptr.previousSibling!=null  &&  ptr.previousSibling.className!="text-author")))
           { ptr.removeAttribute("className"); count_214++ }


         // Добавление формата "подзаголовок" для строк из символов
   if (ptr.parentNode.className.search(re221)!=-1)  {                     //  Если строка в разделе, где может быть подзаголовок, то
           if (s.search(re222)!=-1)  { sct=s.replace(re222, "") }  else sct=s;                     //  сохраняем копию этой строки, но без пяти внутренних форматов
           if (sct.search(re223)!=-1)  {                     //  Если копия строки соответствует требованиям для подзаголовка, то
                   sct=s;                                              //  сохраняем уже полноценную копию строки, в которой
                   if (sct.search(re224)!=-1)  { sct=sct.replace(re224, "") }                     //  если возможно, удаляем жирность и курсив
                   if (sct.search(re225)!=-1)  { sct=sct.replace(re225, re225_) }                     //  и, если возможно, заменяем символ из трех звездочек на корректную строку
                   if (sct.search(re226s)!=-1)  { sct=sct.replace(re226, re226_) }                     //  и, если возможно, добавляем необходимые пробелы
                   if (sct.search("х")!=-1)  { sct=sct.replace(/х/g, "x") }                     //  и, если возможно, заменяем русские "х" на латинские
                   if (ptr.className !="subtitle")  {                     //  А если строка не имела формат подзаголовка, то
                           ptr.className="subtitle";                     //  добавляем его
                           count_227++;                     //  и отмечаем это действие в соответствующем счетчике
                           if (ptr.previousSibling !=null  &&  ptr.previousSibling.innerHTML =="")                     //  при этом, если перед новым подзаголовком есть пустая строк, то
                                   { ptr.previousSibling.removeNode(true); count_272++ }                     //  удаляем ее, и отмечаем это действие в соответствующем счетчике
                           }
                   if (s !=sct)  { s=sct; count_228++ }                     //  Если копия изменялась, то сохраняем эти изменения в "s", и отмечаем это в соответствующем счетчике
                   }
           }

         //  Внутренняя чистка графики в пустом параграфе  (от пробелов и внутренних тегов)
   if (s.search(re231s)!=-1  &&  s.match(re231s).length==1  &&  s.search(re231)!=-1) {
           s_=s.replace(re231, re231_);
           q_231 = true;
           if (s!=s_)
                   { s=s_; count_231++ }    }
       else  q_231 = false;


   //  сохранение абзаца в оригинале только в том случае, если он действительно изменен
   if (ptr.innerHTML != s)   ptr.innerHTML=s;
         //  * Далее преобразования выполняются без участия "s"


         // Снятие внешнего форматирования с графики в пустом параграфе
   if (q_231) {
           while (ptr.parentNode !=null  &&  ptr.parentNode.children.length==1
               &&  (ptr.parentNode.className=="cite"  ||  ptr.parentNode.className=="poem"
                   ||  ptr.parentNode.className=="stanza"  &&  ptr.parentNode.parentNode !=null  &&  ptr.parentNode.parentNode.children.length==1  &&  ptr.parentNode.parentNode.className=="poem"))
                               { ptr.parentNode.removeNode(false); count_232++ }
         }

        // Добавление пустой строки между "карманным" блоком  [заголовок или эпиграф или аннотация]    и    концом секции
   if (ptr.innerHTML !="")  {
           ptrUp = ptr;
           while (ptrUp.nextSibling ==null  &&  ptrUp.parentNode !=null  &&  ptrUp.parentNode.className !="section")
                   { ptrUp=ptrUp.parentNode }
           if (ptrUp.nextSibling ==null  &&  ptrUp.parentNode !=null  &&  ptrUp.parentNode.className =="section")
                   if (ptrUp.className.search(re241) !=-1) {
                           ptrUp.insertAdjacentElement("afterEnd",empty_line.cloneNode(true));
                           window.external.inflateBlock(ptrUp.nextSibling)=true;
                           count_241++ }
           }


         //  ОПЕРАЦИИ с очищенными пустыми строками

         // начало фильтра пустых строк
   if (ptr.innerHTML ==""  &&  ptr.className !="th"  &&  ptr.className !="td")  //  Пустая строка, которая расположена где угодно, но только не в таблице
           {

                 // Удаление первой пустой строки в ряде из двух пустых строк (одного уровня, и под одним общим форматом)
           if (ptr.previousSibling !=null  &&  ptr.previousSibling.innerHTML =="")
                   { ptr.previousSibling.removeNode(true); count_251++ }

                 // Удаление внешних тегов для единственной пустой строки
           while (ptr.parentNode !=null                // Пока у пустой строки есть родительский элемент...
               &&  ptr.parentNode.children.length==1                //  ...причем, пустая строка должна быть единственной в этом разделе...
               &&  (ptr.parentNode.className.search(re252)!=-1                //  ...и это может быть эпиграф, стихи, цитата...
                   ||  ptr.parentNode.className =="annotation"   &&  ptr.parentNode.parentNode !=null   &&  ptr.parentNode.parentNode.getAttribute("id") !="fbw_body"))     //  ...или аннотация, которая не в "fbw_body".
                           { ptr.parentNode.removeNode(false); count_252++ }                //  ...всегда удаляем внешнее форматирование

           //  Удаление ошибочных пустых строк в "body" и "fbw_body" (вне секции)
           if (ptr.parentNode!=null  &&  (ptr.parentNode.className=="body"  ||  ptr.parentNode.getAttribute("id")=="fbw_body"))
                   { ptr.removeNode(true); count_253++;  return }


           if (ptr.parentNode !=null  &&  ptr.parentNode.children.length ==1) {   //  Если пустая строка - единственный элемент раздела

                   //  Удаление пустых "body"
                   ptrUp=ptr;
                   while (ptrUp.parentNode !=null  &&  ptrUp.parentNode.children.length ==1  &&  ptrUp.className !="body")
                           { ptrUp=ptrUp.parentNode }
                   if (ptrUp.className =="body"
                       &&  (ptrUp.previousSibling !=null  &&  ptrUp.previousSibling.className =="body"
                       ||  ptrUp.nextSibling !=null  &&  ptrUp.nextSibling.className =="body"))
                               { ptrUp.removeNode(true); count_262++; return }

                   //  Удаление пустых секций
                   ptrUp=ptr;
                   while (ptrUp.parentNode !=null  &&  ptrUp.parentNode.children.length ==1  &&  ptrUp.parentNode.className =="section")
                           { ptrUp=ptrUp.parentNode }       //   Пока сверху есть секция, обрамляющая единственный раздел, поднимаемся на один уровень вверх.
                   if (ptrUp.className =="section"    //   Если верхний узел - секция,
                       &&  (ptrUp.previousSibling !=null  &&  ptrUp.previousSibling.className =="section"    //  и при этом, либо позади неё есть еще одна секция,
                           ||  ptrUp.nextSibling !=null  &&  ptrUp.nextSibling.className =="section"  &&  ptrUp.previousSibling ==null   //  либо впереди есть еще одна секция, а позади ничего нет,
                           ||  ptrUp.parentNode !=null  &&  ptrUp.parentNode.getAttribute("id")=="fbw_body"))   //  либо она, вообще, оказалась в запретном месте для секций,
                                   { ptrUp.removeNode(true); count_263++; return }   //  тогда удаляем всю секцию со всем ее содержимым

                   }

           //  Удаление пустых строк на окраине разделов
           //  Исключение:  пустая строка после картинки, заголовка, эпиграфа или аннотации
           if (ptr.previousSibling ==null  &&  ptr.nextSibling !=null
               ||  ptr.nextSibling ==null  &&  ptr.previousSibling !=null  &&  ptr.previousSibling.className.search(re271) ==-1)
                       { ptr.removeNode(true); count_271++; return }

           //  Удаление пустых строк рядом с разделами и подзаголовками
           //  Исключение:  пустая строка рядом с картинкой
           if (ptr.previousSibling !=null  &&  ptr.nextSibling !=null  &&  ptr.parentNode !=null
               &&  (ptr.previousSibling.className.search(re272) !=-1  &&  ptr.nextSibling.className !="image"
                   ||  ptr.nextSibling.className.search(re272) !=-1  &&  ptr.previousSibling.className !="image"))
                           { ptr.removeNode(true); count_272++; return }

           //  Замена пустых строк в стихах на разрыв строф
           if (ptr.parentNode!=null  &&  ptr.parentNode.className =="stanza"    //  Если есть родительский узел над пустой строкой, и этот узел - строфа...
               &&  ptr.previousSibling !=null  &&  ptr.previousSibling.nodeName =="P"    //  ...и предыдущая строка - параграф...
               &&  ptr.nextSibling !=null  &&  ptr.nextSibling.nodeName =="P")    //  ...и следующая строка - параграф.
                   {
                   stanza_2=ptr.parentNode.cloneNode(false);    //  Тогда, копируем оболочку строфы...
                   ptr.parentNode.insertAdjacentElement("beforeBegin",stanza_2);    //  ...и вставляем её перед оригинальной строфой.
                   ptr.parentNode.removeAttribute("id");    //  В оригинальной строфе удаляем "id", чтобы не получилось два одинаковых индекса в тексте.
                   sosedi=ptr.parentNode.firstChild;    //  Находим там первую строку...
                   while (sosedi.innerHTML !="") {    //  Затем, пока не встретим пустую строку...
                           sosedi=sosedi.nextSibling;    //  ...перебираем все строки начиная с первой...
                           stanza_2.insertAdjacentElement("beforeEnd",sosedi.previousSibling)    }    //  ...и последовательно переносим их в новую оболочку строфы.
                   sosedi.removeNode(true);    //  В конце удаляем пустую строку.
                   count_281++; return;    //  Увеличиваем счетчик изменений на единицу, и выходим из функции "HandleP(ptr)"
                   }

           }         // конец фильтра пустых строк


       //  Поиск графики в тексте
   if (Obrabotka_Img_v_Texte_on_off  !=0  &&  s.search(re001)!=-1  &&  ptr.parentNode.className =="section")
           { m_001[count_001]=ptr;  count_001++ }

       //  Поиск пустых строк между строк заголовка + сохранение следующей строки в массиве
   if (Obrabotka_Entity_ttl !=0  &&  ptr.parentNode.className =="title"&&  ptr.previousSibling !=null  &&  ptr.previousSibling.innerHTML =="")
           { m_002[count_002]=ptr;  count_002++ }


  }   //  конец создания функции "HandleP(ptr)"

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОБРАБОТКА ТЕКСТА _2_  :  Параграфы <P>  :  операции  № 2хх
                 //      (применение функции "HandleP")


    window.external.BeginUndoUnit(document,"«Чистка структуры» v."+NumerusVersion);                               // ОТКАТ (UNDO) начало


 ptr=fbwBody;                                                           //  Начальное значение переменной "ptr"
 var SaveNext=ptr;                                           //  Элемент, который будет следующим после "ptr"
 ProcessingEnding=false;                              //  Флаг завершения обработки

 while (!ProcessingEnding) {                       //  Если конца текста не видно — продолжаем путешествие.
         if (SaveNext.firstChild!=null  &&  SaveNext.nodeName!="P")    //  Если есть куда углубляться, и это всё ещё не параграф...
                 { SaveNext=SaveNext.firstChild }                                                       //  ...тогда спускаемся на один уровень.
             else {                                                                                                             //  Если углубляться нельзя...
                     while (SaveNext.nextSibling==null)  {                                          //  ...и если нет прохода на соседний элемент...
                             SaveNext=SaveNext.parentNode;                                          //  ...тогда поднимаемся, пока не появится этот проход.
                             if (SaveNext==fbwBody) {ProcessingEnding=true }       // А если поднявшись, оказываемся в "fbw_body" — объявляем о завершении обработки текста.
                             }
                 SaveNext=SaveNext.nextSibling;                      //  Затем переходим на соседний элемент.
                 }
         if (ptr.nodeName=="P")                 //  Если встретился параграф...
                 HandleP(ptr);                                   //  ...обрабатываем его функцией "HandleP".
         ptr=SaveNext;                                   //  Меняем отработанный элемент на следующий найденный элемент
         }

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
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОБРАБОТКА ТЕКСТА _3_  :  Сохраненные разделы "P"  :  операции  № 3хх  ;  вопросы  № 001, 002


         // Выведение картинки из текста

 var izobrazhenij_kotorye = [ " изображение, которое", " изображения, которые", " изображений, которые" ];
 var kartinok = [ "картинки", "картинок", "картинок" ];

 var otvet_001 = false;


 if (count_001!=0)  {
         pad(count_001);
         T_pause-=new Date().getTime();
         otvet_001=AskYesNo("                                         ◊  КАРТИНКИ в ТЕКСТЕ  ◊\n\n"+
                                             "  Найдено "+count_001+izobrazhenij_kotorye[ok]+" можно вывести из пустого параграфа\n\n"+
                                             "                             ПРЕОБРАЗОВАТЬ оформление "+kartinok[ok]+"?			");
         T_pause+=new Date().getTime();
         }


 var re301 = new RegExp("<P( [^>]{1,}){0,1}><SPAN( class=image[^>]{1,}><IMG [^>]{1,}>)</SPAN></P>","g");
 var re301_ = "<DIV$2</DIV>";
 var count_301 = 0;

 if (otvet_001  ||  Obrabotka_Img_v_Texte_on_off ==1)
         for (n=0; n<count_001; n++)
                 { m_001[n].outerHTML=m_001[n].outerHTML.replace(re301, re301_);  count_301++ }


         //  Удаление пустой строки посреди заголовка

 var r=Object();
 var otvet2=0;
 var msg1="";
 var msg2="";

 var count_311 = 0;

         //   Контролируемое удаление пустых строк посреди заголовка
 if (Obrabotka_Entity_ttl ==2) {
         for (n=0; n<count_002; n++) {
                 msg1 = "                             УДАЛИТЬ пустую строку посреди заголовка?";
                 GoTo(m_002[n].previousSibling);
                 msg2=" • "+(n+1)+" из "+count_002+" • ";
                 T_pause-=new Date().getTime();
                 otvet2 = InputBox(msg1, msg2, r);
                 T_pause+=new Date().getTime();
                 if (otvet2 ==6) {
                         m_002[n].previousSibling.removeNode(true);
                         count_311++ }
                 if (otvet2 ==2) break }
         }

         //   Удаление всех пустых строк посреди заголовка
 if (Obrabotka_Entity_ttl ==1) {
         for (n=0; n<count_002; n++) {
                 m_002[n].previousSibling.removeNode(true);
                 count_311++ }
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОБРАБОТКА ТЕКСТА _4_  :  Разделы "DIV"  :  операции  № 4хх  ;  Создание массивов с разделами "image", "section" и "body"


 var mDiv=fbwBody.getElementsByTagName("DIV");  //  массив с узлами "DIV"
 var div;                //  один из узлов "DIV"

 var count_401 = 0;
 var count_402 = 0;

 var mImg=[];  //  массив с узлами "image"
 var count_Img = 0;

 var mSection=[];  //  массив с узлами "section"
 var count_Section = 0;

 var mBody=[];  //  массив с узлами "body"
 var count_Body = 0;


 for (j=mDiv.length-1; j>=0; j--) {

         div = mDiv[j];

         // Удаление пустых узлов "DIV"
         if (div.innerHTML =="") {
                 div.removeNode(true);
                 count_401++; continue }

         // Чистка двойных разделов "DIV"
         //  * Например, эпиграф в эпиграфе, или секция в секции (<section><section>.........</section></section>)
         if (div.children.length ==1  &&  div.className ==div.firstChild.className) {
                 div.removeNode(false);
                 count_402++; continue }


         // Создание массива с узлами "image"
         if (div.className =="image")
                 { mImg[count_Img] = div;  count_Img++ }

         // Создание массива с узлами "section"
         if (div.className =="section")
                 { mSection[count_Section] = div;  count_Section++ }

         // Создание массива с узлами "body"  (без "body" примечаний, и комментариев)
         if (div.className =="body"  &&  div.getAttribute("fbname") !="notes"  &&  div.getAttribute("fbname") !="comments"  &&  div.parentNode ==fbwBody)
                 { mBody[count_Body] = div;  count_Body++ }

         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ВОПРОС  :  Разделы "body"  :  вопрос  № 011


 var otvet_011 = false;
  var razdel = [ " раздел", " раздела", " разделов" ];


 if (count_Body >1)  {
         pad(count_Body);
         T_pause-=new Date().getTime();
         otvet_011=AskYesNo('                                     ◊  СЛИШКОМ МНОГО "body"  ◊\n\n'+
                                                      '                                         Найдены '+count_Body+razdel[ok]+' "body"\n\n'+
                                                      "                                      ОБЪЕДИНИТЬ в один раздел?				");
         T_pause+=new Date().getTime();
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОБРАБОТКА ТЕКСТА _5_  :  Разделы "body", "section"   :  операции  № 5хх


 var Body;                  //  Один из узлов "body"
 var Section;                  //  Один из узлов "section"
 var div2;                  //  Дополнительный узел
 var classStroka="";

 var count_501 = 0;
 var count_502 = 0;
 var count_503 = 0;
 var count_511 = 0;
 var count_512 = 0;
 var count_521 = 0;


         //  Объединение  "body"

 var q_503 = false;
 var newSection;
 var newTitle;

 if (otvet_011) {

         //  Копирование оболочки первого "body" и его вставка перед оригиналом
         var newBody = mBody[0].cloneNode(false);
         newBody.removeAttribute("fbname");
         mBody[0].insertAdjacentElement("beforeBegin",newBody);


         for (j=mBody.length-1; j>=0; j--) {
                 Body=mBody[j];

                 // Вставка новой секции в конце нового "body"
                 newSection = document.createElement("DIV");
                 newSection.className = "section";
                 newBody.insertAdjacentElement("beforeEnd",newSection);

                 // Удаление лишнего обрамления секцией
                 if (Body.children.length ==1  &&  Body.firstChild.className =="section")
                         { Body.firstChild.removeNode(false) }

                 // Перестановка заглавной картинки "body". ("body" скоро станет секцией, а в секциях другой порядок)
                 //    Картинка + Заголовок + Эпиграф   ›››   Заголовок + Эпиграф + Картинка
                 div2=Body.firstChild;
                 if (div2 !=null  &&  div2.className =="image") {
                         while(div2.nextSibling !=null)
                                 if (div2.nextSibling.className =="title"  ||  div2.nextSibling.className =="epigraph")
                                         div2=div2.nextSibling;
                                     else break;
                         if (div2.className !="image") {
                                 div2.insertAdjacentElement("afterEnd",Body.firstChild);
                                 count_502++ }
                         }

                 // Создание заголовка из имени "body" (если возможно)
                 if (Body.getAttribute("fbname") !=null  &&  Body.getAttribute("fbname") !=""  &&  Body.firstChild !=null  &&  Body.firstChild.className !="title") {
                         newTitle = document.createElement("DIV");
                         newTitle.className = "title";
                         newTitle.insertAdjacentElement("afterBegin",empty_line.cloneNode(true));
                         newTitle.firstChild.innerHTML = Body.getAttribute("fbname");
                         Body.insertAdjacentElement("afterBegin",newTitle);
                         count_503++;
                         q_503=true;
                         }
                     else q_503=false;

                 // Перемещение "body" в новую секцию и удаление оболочки этого "body"
                 newSection.insertAdjacentElement("beforeEnd",Body);
                 Body.removeNode(false);
                 count_501++;

                 // Проверка для нового заголовка
                 if (q_503) {
                         msg1 = "                   СОХРАНИТЬ ЗАГОЛОВОК, полученный из имени <body>?\n"+
                                         "                    (возможно сохранение отредактированного заголовка)";
                         GoTo(newTitle);
                         msg2=newTitle.firstChild.innerHTML;
                         T_pause-=new Date().getTime();
                         otvet2 = InputBox(msg1, msg2, r);
                         T_pause+=new Date().getTime();
                         if (otvet2 ==7) {
                                 newTitle.removeNode(true);
                                 count_503-- }
                         if (otvet2 ==6  &&  r.$!="") newTitle.firstChild.innerHTML=r.$;
                         }

                 }
         }

 for (j=count_Section-1; j>=0; j--) {
         Section=mSection[j];

         //  Чистка секций в <body>:
         //  <body>[заголовок]<section>[эпиграф][ряд секций]</section></body>   и т.п.     ›››     <body>[заголовок][эпиграф][ряд секций]</body>
bbb: {
         if (Section.parentNode !=null  &&  Section.parentNode.className =="body") {
                 classStroka="";
                 div2=Section.parentNode.firstChild;
                 while (div2 !=null) {
                         if (div2.nodeName !="DIV")  break bbb;
                             else if (div2.className =="image")  classStroka+="i";
                                 else if (div2.className =="title")  classStroka+="t";
                                     else if (div2.className =="epigraph")  classStroka+="e";
                                         else if (div2.className =="section")  { if (classStroka.search("s") !=-1)  break bbb;  classStroka+="s" }
                                             else  break bbb;
                         div2=div2.nextSibling;
                         }
                 div2=Section.firstChild;
                 while (div2 !=null) {
                         if (div2.nodeName !="DIV")  break bbb;
                             if (div2.className =="title")  classStroka+="t";
                                 else if (div2.className =="epigraph")  classStroka+="e";
                                     else if (div2.className !="section")  break bbb;
                                         else  break;
                         div2=div2.nextSibling;
                         }
                 if (classStroka.search(/t.*t|e.*t/) !=-1)  break bbb; // проверка валидности при гипотетическом удалении тегов секции
                 Section.removeNode(false);
                 mSection.splice(j, 1);
                 count_511++; continue;
                 }
         }

         //  Чистка внутренних секций
         //  (<section>[заголовок]<section>[эпиграф][строки или ряд секций]</section></section>   и т.п.     ›››     <section>[заголовок][эпиграф][строки или ряд секций]</section>)
ccc: {
         if (Section.parentNode !=null  &&  Section.parentNode.className =="section") {
                 classStroka="";
                 div2=Section.parentNode.firstChild;
                 while (div2 !=null) {
                         if (div2.nodeName !="DIV")  break ccc;
                             else if (div2.className =="title")  classStroka+="t";
                                 else if (div2.className =="epigraph")  classStroka+="e";
                                     else if (div2.className =="image")  classStroka+="i";
                                         else if (div2.className =="annotation")  classStroka+="a";
                                             else if (div2.className =="section")  { if (classStroka.search("s") !=-1)  break ccc;  classStroka+="s" }
                                                 else  break ccc;
                         div2=div2.nextSibling;
                         }
                 div2=Section.firstChild;
                 while (div2 !=null  &&  div2.nodeName =="DIV") {
                         if (div2.className =="title")  break ccc;
                             else if (div2.className =="epigraph")  classStroka+="e";
                                 else if (div2.className =="image")  classStroka+="i";
                                     else if (div2.className =="annotation")  classStroka+="a";
                                         else if (div2.className =="section")  { if (classStroka.search(/s$/g) !=-1)  break;  classStroka+="s" }
                                             else  break;
                         div2=div2.nextSibling;
                         }
                 if (classStroka.search(/.t|i.*e|i.*i.*[as]|a.*e/) !=-1)  break ccc;   // проверка валидности при гипотетическом удалении тегов секции
                 Section.removeNode(false);
                 mSection.splice(j, 1);
                 count_512++; continue;
                 }
         }
 }    //  конец цикла для секций


 for (j=mSection.length-1; j>=0; j--) {
         Section=mSection[j];

         // Перемещение заголовка основной секции   в   <body>
         //  <body>[картинка]<section>[заголовок][ряд строк]</section></body>   и т.п.     ›››     <body>[картинка][заголовок]<section>[ряд строк]</section></body>
ddd: {
         if (Section.parentNode !=null  &&  Section.parentNode.className =="body") {
                 classStroka="";
                 div2=Section.parentNode.firstChild;
                 while (div2 !=null) {
                         if (div2.nodeName !="DIV")  break ddd;
                             else if (div2.className =="image")  classStroka+="i";
                                 else if (div2.className =="section")  { if (classStroka.search("s") !=-1)  break ddd;  classStroka+="s" }
                                     else  break ddd;
                         div2=div2.nextSibling;
                         }
                 div2=Section.firstChild;
                 while (div2 !=null) {
                         if (div2.className =="title")  classStroka+="t";
                             else if (div2.className =="section")  break ddd;
                                 else if (div2.nodeName =="P")  break;
                         div2=div2.nextSibling;
                         }
                 if (classStroka.search(/^[^t]+$|[^s]t/) !=-1)  break ddd;
                 Section.insertAdjacentElement("beforeBegin",Section.firstChild);
                 count_521++;
                 }
         }
 }    //  конец цикла для секций

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ВОПРОС  :  Разделы "image"  :  вопрос  021

 var count_021 = 0;
 var otvet_021 = false;
 var img;                //  одна из картинок ("DIV")

 for (j=count_Img-1; j>=0; j--) {
         img=mImg[j];

                 //  Подсчет сочетаний:   Иллюстрация + Пустая_строка + Секция   или   Иллюстрация + Секция
         if (img.parentNode.className =="section") {
                 if (img.nextSibling !=null  &&  img.nextSibling.innerHTML ==""  &&  img.nextSibling.nextSibling !=null  &&  img.nextSibling.nextSibling.className =="section"
                     ||  img.nextSibling !=null  &&  img.nextSibling.className =="section")
                            { count_021++ }
                 }

         }


         //   Вопросы к пользователю

 var Najden = [ "Найдена ", "Найдены ", "Найдены " ];
 var ill_v_karm = [ " иллюстрация в кармане", " иллюстрации в карманах", " иллюстраций в карманах" ];
 var ill_nov_razd = [ "иллюстрацию новой внутренней секцией", "иллюстрации новыми внутренними секциями", "иллюстрации новыми внутренними секциями" ];


 if (count_021!=0  &&  Obrabotka_karm_Img ==2)  {
         pad(count_021);
         T_pause-=new Date().getTime();
         otvet_021=AskYesNo("                                   ◊  ИЛЛЮСТРАЦИЯ В КАРМАНЕ  ◊\n\n"+
                                                      "                          "+Najden[ok]+count_021+ill_v_karm[ok]+" секций:\n\n"+
                                                      "                                       < Начало внешней секции >\n"+
                                                      "                                                      < . . . . . >\n"+
                                                      "                                                < Иллюстрация >\n"+
                                                      "                                           < Внутренние секции >\n"+
                                                      "                                        < Конец внешней секции >\n\n"+
                                                      "                     ОБРАМИТЬ "+ill_nov_razd[ok]+"?		");
         T_pause+=new Date().getTime();
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОБРАБОТКА ТЕКСТА _6_  :  Разделы "image"  :  операции  № 6хх


 var imgUp;          //  узлы рядом с картинкой
 var count_601 = 0;   var count_611 = 0;   var count_621 = 0;   var count_622 = 0;   var count_631 = 0;   //  Счетчики
 var re611ex = new RegExp("^(cite|subtitle||normal)$","g");  //  класс тегов -- исключения для автоматической редакции


 for (j=0; j<count_Img; j++) {
         img=mImg[j];
         if (img.parentNode.className =="section") {


                   //  Удаление пустых строк рядом с картинкой в "кармане" секций: <section>[заголовок]+[эпиграфы]+[картинка]+[аннотация]<section>.....</section></section>
                   //  * По правилам FBE, в "кармане" может быть только указанный порядок тегов (если они есть). И между ними не может быть ничего другого, в т.ч. и пустых строк
                   if (img.nextSibling !=null  &&  img.nextSibling.innerHTML ==""
                       &&  img.nextSibling.nextSibling !=null  &&  (img.nextSibling.nextSibling.className =="section"  ||  img.nextSibling.nextSibling.className =="annotation"))
                               { img.nextSibling.removeNode(true); count_601++ }   //  удаление пустой строки после картинки
                   if (img.previousSibling !=null  &&  img.previousSibling.innerHTML ==""
                       &&  img.nextSibling !=null  &&  (img.nextSibling.className =="section"  ||  img.nextSibling.className =="annotation"))
                               { img.previousSibling.removeNode(true); count_601++ }   //  удаление пустой строки перед картинкой


                   if (img.nextSibling ==null  ||  img.nextSibling !=null  &&  img.nextSibling.className !="section"  &&  img.nextSibling.className !="annotation")
                           {                    //  ----------------   начало отбора картинок, которые не в "кармане"

                           //  Вставка пустой строки перед картинкой (внутри секции)
                           if (img.previousSibling !=null  &&  img.previousSibling.innerHTML !=""  &&  img.previousSibling.className.search(re611ex)==-1) {
                                   img.insertAdjacentElement("beforeBegin",empty_line.cloneNode(true));
                                   window.external.inflateBlock(img.previousSibling)=true;
                                   count_611++ }

                           //  Вставка пустой строки после картинки (внутри секции)
                           if (img.nextSibling !=null  &&  img.nextSibling.innerHTML !=""  &&  img.nextSibling.className.search(re611ex)==-1) {
                                   img.insertAdjacentElement("afterEnd",empty_line.cloneNode(true));
                                   window.external.inflateBlock(img.nextSibling)=true;
                                   count_611++ }

                           //  Удаление пустой строки между границей секции и картинкой
                           if (img.previousSibling !=null  &&  img.previousSibling.previousSibling ==null  &&  img.previousSibling.innerHTML =="")
                                   { img.previousSibling.removeNode(true); count_622++ }

                           //  Вставка пустой строки между картинкой и границей секции (если кроме картинки, в секции больше ничего нет)
                           if (img.previousSibling ==null  &&  img.nextSibling ==null) {
                                   img.insertAdjacentElement("afterEnd",empty_line.cloneNode(true));
                                   window.external.inflateBlock(img.nextSibling)=true;
                                   count_621++ }

                           //  Удаление пустой строки между картинкой и границей секции (если перед картинкой что-то есть)
                           if (img.previousSibling !=null  &&  img.nextSibling !=null  &&  img.nextSibling.nextSibling ==null  &&  img.nextSibling.innerHTML=="")
                                   { img.nextSibling.removeNode(true); count_622++ }

                           }                    //  ----------------   конец отбора картинок, которые не в "кармане"


                   //  Перемещение картинки из "кармана" в отдельную секцию
                   if ((Obrabotka_karm_Img ==1  ||  otvet_021)  &&  img.nextSibling !=null  &&  img.nextSibling.className =="section")  {
                           newSection = document.createElement("DIV");   newSection.className ="section";      //  создание новой секции
                           img.insertAdjacentElement("afterEnd",newSection);     //  Вставка новой секции после картинки
                           newSection.insertAdjacentElement("afterBegin",empty_line.cloneNode(true));     //  Вставка оболочки будущей пустой строки в новую секцию
                           window.external.inflateBlock(newSection.firstChild)=true;     //  Вставка содержимого пустой строки
                           newSection.insertAdjacentElement("afterBegin",img);     //  Перемещение картинки в новую секцию (в начало секции)
                           count_631++;
                           //  Далее проверка наличия пустой секции, стоящей после новой секции, и её удаление
                           if (newSection.nextSibling !=null) {
                                   imgUp = newSection.nextSibling;
                                   if (imgUp.className =="section"  &&  imgUp.children.length ==1  &&  imgUp.firstChild.nodeName =="P"  &&  imgUp.firstChild.innerHTML =="")
                                           { imgUp.removeNode(true); count_263++ }
                                   }
                           //  Далее повторная проверка на наличие лишнего обрамления секцией, и её удаление
                          eee: {
                                   if (newSection.parentNode.className =="section"  &&  newSection.parentNode.parentNode !=null  &&  newSection.parentNode.parentNode.className =="body") {
                                           classStroka="";
                                           div2=newSection.parentNode.parentNode.firstChild;
                                           while (div2 !=null) {
                                                   if (div2.nodeName !="DIV")  break eee;
                                                       else if (div2.className =="image")  classStroka+="i";
                                                           else if (div2.className =="title")  classStroka+="t";
                                                               else if (div2.className =="epigraph")  classStroka+="e";
                                                                   else if (div2.className =="section")  { if (classStroka.search("s") !=-1)  break eee;  classStroka+="s" }
                                                                       else  break eee;
                                                   div2=div2.nextSibling;
                                                   }
                                           div2=newSection.parentNode.firstChild;
                                           while (div2 !=null) {
                                                   if (div2.nodeName !="DIV")  break eee;
                                                       if (div2.className =="title")  classStroka+="t";
                                                           else if (div2.className =="epigraph")  classStroka+="e";
                                                               else if (div2.className !="section")  break eee;
                                                                   else  break;
                                                   div2=div2.nextSibling;
                                                   }
                                           if (classStroka.search(/t.*t|e.*t/) !=-1)  break eee; // проверка валидности при гипотетическом удалении тегов секции
                                           newSection.parentNode.removeNode(false);
                                           count_511++;
                                           }
                                   }
                           }                    //  ----------------   конец для    "Перемещение картинки из кармана в отдельную секцию"

                   }                    //  ----------------   конец отбора картинок в секции
           }                    //  ----------------   конец цикла перебора всех картинок


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



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Создание списка цитат


 var Kn=[];
 var zitata_N = Math.floor(("000000"+Math.tan(Ts)).replace(/[\.\-]/g, "").replace(/.+(\d{6})\d$/g, "$1")/1000000*271)+1;
     //  * Случайный номер от 1 до 271

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


  var tempus;

 var Tf=new Date().getTime();

 var T2=Tf-Ts-T_pause;
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



                 // Подсчет общего количества исправлений
 var itogi = count_101 + count_102 + count_103 + count_201 + count_211 + count_212 + count_213 + count_214 + count_231 + count_232 + count_227 + count_228 + count_241 + count_251 + count_252 + count_253 + count_262 + count_263 + count_271 + count_272 + count_281 + count_301 + count_311 + count_401 + count_402 + count_501 + count_502 + count_503 + count_511 + count_512 + count_521 + count_601 + count_611 + count_621 + count_622 + count_631;



                 /// ДОПОЛНЕНИЕ _2_  :  Демонстрационный режим "Показать все строки"


 var dem=false;
 var Q="н/д";
// dem=true;   // !!!!!  активатор
 if (dem) {
         count_101=Q;  count_102=Q;  count_103=Q;  count_201=Q;  count_211=Q;  count_212=Q;  count_213=Q;  count_214=Q;  count_227=Q;  count_228=Q;  count_231=Q;  count_232=Q;  count_241=Q;  count_251=Q;  count_252=Q;  count_253=Q;  count_262=Q;  count_263=Q;  count_271=Q;  count_272=Q;  count_281=Q;  count_301=Q;  count_311=Q;  count_401=Q;  count_402=Q;  count_501=Q;  count_502=Q;  count_503=Q;  count_511=Q;  count_512=Q;  count_521=Q;  count_601=Q;  count_611=Q;  count_621=Q;  count_622=Q;  count_631=Q;  itogi=Q;
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Сборка массива с результатами обработки


 var mSt=[];
 var ind=1;

                                                             mSt[ind]='• СТАТИСТИКА:';  ind++;
                                                             mSt[ind]='• Время выполнения   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+tempus;  ind++;
                                                             mSt[ind]='• Всего исправлений   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+itogi;  ind++;

 var cTaT1=ind-1;  //  число строк в первом разделе

                                                             mSt[ind]='';  ind++;
                                                             mSt[ind]='• РАЗНЫЕ ИСПРАВЛЕНИЯ:';  ind++;

         if (count_101!=0)             { mSt[ind]='101. Удаление тегов вложеного параграфа в параграф  .  .  .  .  .  .  .  .	'+count_101;  ind++ }
         if (count_102!=0)             { mSt[ind]='102. Перезапись параграфов .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_102;  ind++ }
         if (count_103!=0)             { mSt[ind]='103. Удаление внутренних тегов вне параграфа   .  .  .  .  .  .  .  .  .  .  .	'+count_103;  ind++ }
         if (count_201!=0)             { mSt[ind]='201. Удаление повторных внутренних тегов в параграфе .  .  .  .  .  .  .	'+count_201;  ind++ }
         if (count_211!=0)             { mSt[ind]='211. Замена "&nbsp;" на неразрывный пробел   .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_211;  ind++ }
         if (count_227!=0)             { mSt[ind]='227. Добавление формата "подзаголовок" для строк из символов  .  .  .	'+count_227;  ind++ }
         if (count_228!=0)             { mSt[ind]='228. Коррекция подзаголовков из символов  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_228;  ind++ }
         if (count_231!=0)             { mSt[ind]='231. Внутренняя чистка строк с графикой .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_231;  ind++ }
         if (count_232!=0)             { mSt[ind]='232. Снятие внешнего форматирования со строк с графикой   .  .  .  .  .	'+count_232;  ind++ }
         if (count_301!=0)             { mSt[ind]='301. Переоформление графики .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_301;  ind++ }
         if (count_402!=0)             { mSt[ind]='402. Чистка двойных разделов   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_402;  ind++ }
         if (count_501!=0)             { mSt[ind]='501. Преобразование раздела "body" в секцию   .  .  .  .  .  .  .  .  .  .  .  .	'+count_501;  ind++ }
         if (count_502!=0)             { mSt[ind]='502. Перестановка заглавной картинки  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_502;  ind++ }
         if (count_503!=0)             { mSt[ind]='503. Преобразование имени "body" в заголовок   .  .  .  .  .  .  .  .  .  .  .  .	'+count_503;  ind++ }
         if (count_511!=0)             { mSt[ind]='511. Чистка секций в "body"  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_511;  ind++ }
         if (count_512!=0)             { mSt[ind]='512. Чистка внутренних секций  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_512;  ind++ }
         if (count_521!=0)             { mSt[ind]='521. Перемещение заголовка из основной секции в "body" .  .  .  .  .  .  .	'+count_521;  ind++ }
         if (count_631!=0)             { mSt[ind]='631. Перемещение картинки из "кармана" в отдельную секцию  .  .  .  .	'+count_631;  ind++ }

 if (cTaT1==ind-3) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в этом разделе
 var cTaT2=ind-1;  //  число строк в двух разделах

                                                             mSt[ind]='';  ind++;
                                                             mSt[ind]='• ОПЕРАЦИИ С ПУСТЫМИ СТРОКАМИ:';  ind++;
         if (count_212!=0)             { mSt[ind]='212. Чистка... внутри строки   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_212;  ind++ }
         if (count_213!=0)             { mSt[ind]='213. Снятие формата "подзаголовок"   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_213;  ind++ }
         if (count_214!=0)             { mSt[ind]='214. Снятие формата "автор текста" .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_214;  ind++ }
         if (count_241!=0)             { mSt[ind]='241. Добавление... между "карманным" блоком и концом секции .  .  .  .	'+count_241;  ind++ }
         if (count_251!=0)             { mSt[ind]='251. Удаление второй пустой строки подряд   .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_251;  ind++ }
         if (count_252!=0)             { mSt[ind]='252. Снятие внешнего форматирования  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_252;  ind++ }
         if (count_253!=0)             { mSt[ind]='253. Удаление... в "body" и "fbw_body"   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_253;  ind++ }
         if (count_262!=0)             { mSt[ind]='262. Удаление пустых "body"   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_262;  ind++ }
         if (count_263!=0)             { mSt[ind]='263. Удаление пустых секций  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_263;  ind++ }
         if (count_271!=0)             { mSt[ind]='271. Удаление... на окраине разделов .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_271;  ind++ }
         if (count_272!=0)             { mSt[ind]='272. Удаление... за краем разделов и подзаголовков  .  .  .  .  .  .  .  .  .	'+count_272;  ind++ }
         if (count_281!=0)             { mSt[ind]='281. Замена пустых строк в стихах на разрыв строф   .  .  .  .  .  .  .  .  .	'+count_281;  ind++ }
         if (count_311!=0)             { mSt[ind]='311. Удаление...  посреди заголовка   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_311;  ind++ }
         if (count_401!=0)             { mSt[ind]='401. Удаление абсолютно пустых разделов  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_401;  ind++ }
         if (count_601!=0)             { mSt[ind]='601. Удаление... рядом с картинкой в "кармане" секций .  .  .  .  .  .  .  .	'+count_601;  ind++ }
         if (count_611!=0)             { mSt[ind]='611. Вставка... рядом с картинкой посреди секции   .  .  .  .  .  .  .  .  .  .	'+count_611;  ind++ }
         if (count_621!=0)             { mSt[ind]='621. Вставка... между картинкой и границей секции .  .  .  .  .  .  .  .  .  .	'+count_621;  ind++ }
         if (count_622!=0)             { mSt[ind]='622. Удаление... между картинкой и границей секции .  .  .  .  .  .  .  .  .	'+count_622;  ind++ }

 if (cTaT2==ind-3) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в этом разделе


//  Сборка строк цитаты
                                                             mSt[ind]='';  ind++;
                                                             mSt[ind]='• ПОСЛОВИЦА:';  ind++;

 var reS92 = new RegExp("(\\\s|"+nbspEntity+")","g");   // удвоение пробелов для лучшей картинки
 var reS92_ = "  ";
 var reZit = new RegExp("^(.{0,75})(\\\s\\\s|$)(.{0,})$","g");   // разделение на строки
 var reZit_1 = "$1";
 var reZit_2 = "$3";
 var fragment = "";
 var otstup = "         ";

 fragment=("00"+zitata_N).replace(/.*(...)$/g, "$1")+".  "+Kn[zitata_N].replace(reS92, reS92_);
 while (fragment != otstup) {
         mSt[ind]=fragment.replace(reZit, reZit_1);
         fragment=otstup+fragment.replace(reZit, reZit_2);
         ind++ }


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
 MsgBox ('                                       .·.·.·.             –= ◊ =–             .·.·.·.\n'+
                   '                                    ·.̉·.̉·.̉  «Чистка структуры» v.'+NumerusVersion+'  .̉·.̉·.̉·                                                      \n'+
                   '                                        ̉   ̉   ̉                                              ̉   ̉   ̉ '+st2);

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



}







