//======================================
//             «Пустые строки рядом с иллюстрациями»
//~~~~~~~~~~~~~~~~~~
// v.1.0 — Создание скрипта — Александр Ка (17.05.2024)
//~~~~~~~~~~~~~~~~~~
// v.1.1 — Исправлена ошибка с добавлением пустых строк — Александр Ка (10.06.2024)
//~~~~~~~~~~~~~~~~~~


var NumerusVersion="1.0";

  var Ts1=new Date().getTime();


function Run() {

//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------

                 /// ОБЩИЕ ПЕРЕМЕННЫЕ


//   Неразрывные пробелы  ;  ("+nbspEntity+") - для поиска  ;  ("+nbspChar+") - для замены  ;
 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

//  Внутренние теги  ;  ("+Teg+")  ;
var Teg = "</{0,1}STRONG>|</{0,1}EM>|</{0,1}SUP>|</{0,1}SUB>|</{0,1}STRIKE>";

//  Счетчики цикла
var i = 0;
var j = 0;

//  Структура текста (аннотация + история + все <body>, иначе говоря, всё это видно в режиме "B"-дизайн)
 var fbwBody=document.getElementById("fbw_body");

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОБРАБОТКА ТЕКСТА _1_  :  Параграфы <P>  :  операции  № 1хх
                 //      (регулярные выражения)


       //  Автоисправление вложений в параграф (перезапись внутреннего содержимого)
 var count_101 = 0;

       //  Удаление внутренних тегов вне параграфа
 var re102 = new RegExp("STRONG|EM|SUP|SUB|STRIKE|SPAN","g");
 var count_102 = 0;

         // Чистка пустых строк от пробелов и внутренних тегов
 var re111 = new RegExp("^(\\\s|"+nbspEntity+"|&nbsp;|<[^>]{1,}>){1,}$","g");
 var re111ex = new RegExp("<SPAN class=image","g");
 var re111_ = "";
 var count_111 = 0;

         //  Внутренняя чистка графики в пустом параграфе  (от пробелов и внутренних тегов)
 var re112s = new RegExp("<SPAN class=image","g");
 var re112 = new RegExp("^(&nbsp;|\\\s|"+nbspEntity+"|<[^>]{1,}>){0,}(<SPAN class=image[^>]{1,}>)(<[^>]{1,}>){0,}(<IMG [^>]{1,}>)(&nbsp;|\\\s|"+nbspEntity+"|<[^>]{1,}>){0,}$","g");
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


 var empty_line = document.createElement("P");   //  создание новой оболочки параграфа (позже, для создания путой строки, туда добавится пустота: "")

 var s="";  // Внутреннее содержание оригинального абзаца (<P>содержание</P>)
 var s_="";  // Внутреннее содержание оригинального абзаца (<P>содержание</P>)
 var mImgP=[];  //  массив с графикой в пустом параграфе
 var count_ImgP=0;  //  счетчик для массива

 function HandleP(ptr) {

    s=ptr.innerHTML;

         // Чистка пустых строк от пробелов и внутренних тегов
   if (s.search(re111)!=-1  &&  s.search(re111ex)==-1)  { s=s.replace(re111, re111_); count_111++ }

         //  Внутренняя чистка графики в пустом параграфе  (от пробелов и внутренних тегов)
   if (s.search(re112s)!=-1  &&  s.match(re112s).length==1  &&  s.search(re112)!=-1) {
           s_=s.replace(re112, re112_);
           mImgP[count_ImgP]=ptr;
           count_ImgP++;
           q_112 = true;
           if (s!=s_) { s=s_; count_112++ }
         // Снятие форматирования "подзаголовок"
         if (ptr.className=="subtitle")
                 { ptr.removeAttribute("className"); count_113++ }
           }
               else  q_112 = false;


   //  сохранение абзаца в оригинале только в том случае, если он действительно изменен
   if (ptr.innerHTML != s)   ptr.innerHTML=s;
         //  * Далее преобразования выполняются без участия "s"


         // Снятие внешнего форматирования с графики в пустом параграфе
   if (q_112) {
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
// ----------------------------------------------
// -----------------------------



                 /// ОБРАБОТКА ТЕКСТА _1_  :  Параграфы <P>  :  операции  № 1хх
                 //      (применение функции "HandleP")


    window.external.BeginUndoUnit(document,"«Пустые строки рядом с иллюстрациями» v."+NumerusVersion);                               // ОТКАТ (UNDO) начало



 var ptr=fbwBody;                                                           //  Начальное значение переменной "ptr"
 var SaveNext=ptr;                                           //  Элемент, который будет следующим после "ptr"
 var nextPtr = false;                              //  Флаг перехода на соседний элемент
 var ProcessingEnding=false;                              //  Флаг завершения обработки

 while (!ProcessingEnding) {                       //  Если конца текста не видно — продолжаем путешествие.
         if (SaveNext.firstChild!=null  &&  SaveNext.nodeName!="P")    //  Если есть куда углубляться, и это всё ещё не параграф...
                 { SaveNext=SaveNext.firstChild }                                                       //  ...тогда спускаемся на один уровень.
             else {                                                                                                //  Если углубляться нельзя...
                     nextPtr = false;
                     while (!nextPtr) {
                             while (SaveNext.nextSibling==null)  {                              //  ...и если нет прохода на соседний элемент...
                                     SaveNext=SaveNext.parentNode;                                           //  ...тогда поднимаемся, пока не появится этот проход.
                                     if (SaveNext.nodeName =="P")  { SaveNext.innerHTML=SaveNext.innerHTML; count_101++ }
                                     if (SaveNext==fbwBody) {ProcessingEnding=true }           // А если поднявшись, оказываемся в "fbw_body" — объявляем о завершении обработки текста.
                                     }
                             while (SaveNext.nextSibling !=null  &&  SaveNext.nextSibling.nodeName.search(re102)!=-1)  { SaveNext.nextSibling.removeNode(false); count_102++ }
                             if (SaveNext.nextSibling !=null)  { SaveNext=SaveNext.nextSibling; nextPtr = true }                     //  Затем переходим на соседний элемент.
                             }
                     }
         if (ptr.nodeName=="P")                 //  Если встретился параграф...
                 HandleP(ptr);                                   //  ...обрабатываем его функцией "HandleP".
         ptr=SaveNext;                                   //  Меняем отработанный элемент на следующий найденный элемент
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОБРАБОТКА ТЕКСТА _2_  :  Разделы "image"  :  операции № 2хх  и  вопросы № 0хх


  var count_001 = 0;  var count_002 = 0;  var count_003 = 0;  var count_004 = 0;  var count_005 = 0;  var count_006 = 0;
  var count_011 = 0;  var count_012 = 0;  var count_013 = 0;  var count_014 = 0;  var count_015 = 0;  var count_016 = 0;
  var count_021 = 0;  var count_022 = 0;  var count_023 = 0;  var count_024 = 0;  var count_025 = 0;  var count_026 = 0;
  var count_031 = 0;  var count_032 = 0;  var count_033 = 0;  var count_034 = 0;  var count_035 = 0;  var count_036 = 0;

  var m_001 = [];  var m_002 = [];  var m_003 = [];  var m_004 = [];  var m_005 = [];  var m_006 = [];
  var m_011 = [];  var m_012 = [];  var m_013 = [];  var m_014 = [];  var m_015 = [];  var m_016 = [];
  var m_021 = [];  var m_022 = [];  var m_023 = [];  var m_024 = [];  var m_025 = [];  var m_026 = [];
  var m_031 = [];  var m_032 = [];  var m_033 = [];  var m_034 = [];  var m_035 = [];  var m_036 = [];

  var mI_001 = [];  var mI_002 = [];  var mI_003 = [];  var mI_004 = [];  var mI_005 = [];  var mI_006 = [];
  var mI_011 = [];  var mI_012 = [];  var mI_013 = [];  var mI_014 = [];  var mI_015 = [];  var mI_016 = [];
  var mI_021 = [];  var mI_022 = [];  var mI_023 = [];  var mI_024 = [];  var mI_025 = [];  var mI_026 = [];
  var mI_031 = [];  var mI_032 = [];  var mI_033 = [];  var mI_034 = [];  var mI_035 = [];  var mI_036 = [];


//  выявление курсивной строки
 var reEm = new RegExp("^(\\\s|"+nbspEntity+"|[…\\\.\\\(\\\[«„“»”\\\"—–\\\-]|<[^>]{1,}>){0,}<EM>.{1,}</EM>(\\\s|"+nbspEntity+"|[…\\\.,:;\\\?!\\\)\\\]«„“»”\\\"—–\\\-]|<[^>]{1,}>){0,}$","g");

//  выявление полужирной строки
 var reSt = new RegExp("^(\\\s|"+nbspEntity+"|[…\\\.\\\(\\\[«„“»”\\\"—–\\\-]|<[^>]{1,}>){0,}<STRONG>.{1,}</STRONG>(\\\s|"+nbspEntity+"|[…\\\.,:;\\\?!\\\)\\\]«„“»”\\\"—–\\\-]|<[^>]{1,}>){0,}$","g");

 var mDiv=fbwBody.getElementsByTagName("DIV");  //  массив с узлами "DIV"
 var mImg=[];  //  массив с узлами "image"
 var count_Img = 0;  //  счетчик узлов "image"
 var img;                //  одна из картинок


 for (j=0; j<mDiv.length; j++) {
         if (mDiv[j].className =="image") {

                 // Создание массива с узлами "image"   ("DIV")
                 mImg[count_Img] = mDiv[j];
                 count_Img++;
                 }
         }

 var count_201 = 0;
 var count_211 = 0;   var count_212 = 0;
 var count_221 = 0;   var count_222 = 0;
 var re221ex = new RegExp("^(cite|subtitle||normal)$","g");  //  класс тегов -- исключения для автоматической редакции


         //  Цикл для независимых иллюстраций

 for (j=0; j<mImg.length; j++) {
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
                           img.insertAdjacentElement("afterEnd",empty_line.cloneNode(true));
                           window.external.inflateBlock(img.nextSibling)=true;
                           count_211++ }

                   //  Удаление пустой строки между картинкой и границей секции (если перед картинкой что-то есть)   :::   ........[картинка]</section>
                   if (img.previousSibling !=null  &&  img.nextSibling !=null  &&  img.nextSibling.nextSibling ==null  &&  img.nextSibling.innerHTML=="")
                           { img.nextSibling.removeNode(true); count_212++ }


                   //  Фильтр для картинок, которые не в "кармане"
                   if (img.nextSibling ==null  ||  img.nextSibling !=null  &&  img.nextSibling.className !="section"  &&  img.nextSibling.className !="annotation")  {
        
                           //  Вставка пустой строки перед картинкой (внутри секции)
                           if (img.previousSibling !=null  &&  img.previousSibling.innerHTML !=""  &&  img.previousSibling.className.search(re221ex)==-1){ 
                                       img.insertAdjacentElement("beforeBegin",empty_line.cloneNode(true));
                                       window.external.inflateBlock(img.previousSibling)=true;
                                       count_221++ }
        
                           //  Вставка пустой строки после картинки (внутри секции)
                           if (img.nextSibling !=null  &&  img.nextSibling.innerHTML !=""  &&  img.nextSibling.className.search(re221ex)==-1) {
                                       img.insertAdjacentElement("afterEnd",empty_line.cloneNode(true));
                                       window.external.inflateBlock(img.nextSibling)=true;
                                       count_222++ }
                           }

                   }


         //  Поиск и сохранение сочетаний    "Иллюстрация + Текст"

         if (img.parentNode.className =="section"  &&  img.nextSibling !=null  &&  img.nextSibling.innerHTML !="") {

                 //  Иллюстрация + Цитата
                 if (img.nextSibling.className =="cite") {
                         mI_001[count_001]=img;
                         m_001[count_001]=img.nextSibling;
                         while (m_001[count_001].firstChild !=null  &&  m_001[count_001].nodeName !="P")  m_001[count_001] = m_001[count_001].firstChild;
                         count_001++ }

                 //  Иллюстрация + Подзаголовок
                 if (img.nextSibling.className =="subtitle") {
                         mI_002[count_002]=img;
                         m_002[count_002]=img.nextSibling;
                         count_002++ }

                 //  Иллюстрация + Обычный текст
                 if (img.nextSibling.className ==""  ||  img.nextSibling.className =="normal") {
                         if (img.nextSibling.innerHTML.search(reEm) !=-1) {
                                 mI_003[count_003]=img;
                                 m_003[count_003]=img.nextSibling;
                                 count_003++ }  //  курсив, или полужирный курсив
                             else {
                                     if (img.nextSibling.innerHTML.search(reSt) !=-1) {
                                             mI_004[count_004]=img;
                                             m_004[count_004]=img.nextSibling;
                                             count_004++ }  //  полужирный шрифт
                                         else {
                                                 mI_005[count_005]=img;
                                                 m_005[count_005]=img.nextSibling;
                                                 count_005++ }   //   без курсива и полужирного шрифта
                                     }
                         }

                 }


         //  Поиск и сохранение сочетаний    "Иллюстрация + Пустая_строка + Текст"

         if (img.parentNode.className =="section"  &&  img.nextSibling !=null  &&  img.nextSibling.innerHTML ==""  &&  img.nextSibling.nextSibling !=null) {

                 //  Иллюстрация + Пустая_строка + Цитата
                 if (img.nextSibling.nextSibling.className =="cite") {
                         mI_011[count_011]=img;
                         m_011[count_011]=img.nextSibling.nextSibling;
                         while (m_011[count_011].firstChild !=null  &&  m_011[count_011].nodeName !="P")  m_011[count_011] = m_011[count_011].firstChild;
                         count_011++ }

                 //  Иллюстрация + Пустая_строка + Подзаголовок
                 if (img.nextSibling.nextSibling.className =="subtitle") {
                         mI_012[count_012]=img;
                         m_012[count_012]=img.nextSibling.nextSibling;
                         count_012++ }

                 //  Иллюстрация + Пустая_строка + Обычный текст
                 if (img.nextSibling.nextSibling.className ==""  ||  img.nextSibling.nextSibling.className =="normal") {
                         if (img.nextSibling.nextSibling.innerHTML.search(reEm) !=-1) {
                                 mI_013[count_013]=img;
                                 m_013[count_013]=img.nextSibling.nextSibling;
                                 count_013++ }  //  курсив, или полужирный курсив
                             else {
                                     if (img.nextSibling.nextSibling.innerHTML.search(reSt) !=-1) {
                                             mI_014[count_014]=img;
                                             m_014[count_014]=img.nextSibling.nextSibling;
                                             count_014++ }  //  полужирный шрифт
                                         else {
                                                 mI_015[count_015]=img;
                                                 m_015[count_015]=img.nextSibling.nextSibling;
                                                 count_015++ }   //   без курсива и полужирного шрифта
                                     }
                         }

                 }


         //  Поиск и сохранение сочетаний    "Текст + Иллюстрация"

         if (img.parentNode.className =="section"  &&  img.previousSibling !=null  &&  img.previousSibling.innerHTML !="") {

                 //  Цитата + Иллюстрация
                 if (img.previousSibling.className =="cite") {
                         mI_021[count_021]=img;
                         m_021[count_021]=img.previousSibling;
                         while (m_021[count_021].lastChild !=null  &&  m_021[count_021].nodeName !="P")  m_021[count_021]=m_021[count_021].lastChild;
                         count_021++ }

                 //  Иллюстрация + Подзаголовок
                 if (img.previousSibling.className =="subtitle") {
                         mI_022[count_022]=img;
                         m_022[count_022]=img.previousSibling;
                         count_022++ }

                 //  Иллюстрация + Обычный текст
                 if (img.previousSibling.className ==""  ||  img.previousSibling.className =="normal") {
                         if (img.previousSibling.innerHTML.search(reEm) !=-1) {
                                 mI_023[count_023]=img;
                                 m_023[count_023]=img.previousSibling;
                                 count_023++ }  //  курсив, или полужирный курсив
                             else {
                                     if (img.previousSibling.innerHTML.search(reSt) !=-1) {
                                             mI_024[count_024]=img;
                                             m_024[count_024]=img.previousSibling;
                                             count_024++ }  //  полужирный шрифт
                                         else {
                                                 mI_025[count_025]=img;
                                                 m_025[count_025]=img.previousSibling;
                                                 count_025++ }   //   без курсива и полужирного шрифта
                                     }
                         }

                 }


         //  Поиск и сохранение сочетаний    "Текст + Пустая_строка + Иллюстрация"

         if (img.parentNode.className =="section"  &&  img.previousSibling !=null  &&  img.previousSibling.innerHTML ==""  &&  img.previousSibling.previousSibling !=null) {

                 //  Иллюстрация + Пустая_строка + Цитата
                 if (img.previousSibling.previousSibling.className =="cite") {
                         mI_031[count_031]=img;
                         m_031[count_031]=img.previousSibling.previousSibling;
                         while (m_031[count_031].lastChild !=null  &&  m_031[count_031].nodeName !="P")  m_031[count_031] = m_031[count_031].lastChild;
                         count_031++ }

                 //  Иллюстрация + Пустая_строка + Подзаголовок
                 if (img.previousSibling.previousSibling.className =="subtitle") {
                         mI_032[count_032]=img;
                         m_032[count_032]=img.previousSibling.previousSibling;
                         count_032++ }

                 //  Иллюстрация + Пустая_строка + Обычный текст
                 if (img.previousSibling.previousSibling.className ==""  ||  img.previousSibling.previousSibling.className =="normal") {
                         if (img.previousSibling.previousSibling.innerHTML.search(reEm) !=-1) {
                                 mI_033[count_033]=img;
                                 m_033[count_033]=img.previousSibling.previousSibling;
                                 count_033++ }  //  курсив, или полужирный курсив
                             else {
                                     if (img.previousSibling.previousSibling.innerHTML.search(reSt) !=-1) {
                                             mI_034[count_034]=img;
                                             m_034[count_034]=img.previousSibling.previousSibling;
                                             count_034++ }  //  полужирный шрифт
                                         else {
                                                 mI_035[count_035]=img;
                                                 m_035[count_035]=img.previousSibling.previousSibling;
                                                 count_035++ }   //   без курсива и полужирного шрифта
                                     }
                         }

                 }


         }           //    Конец для     "Цикл для независимых иллюстраций"


         //  Цикл для графики внутри строки

 for (j=0; j<mImgP.length; j++) {
         img=mImgP[j];

         //  Поиск и сохранение сочетаний    "<P>Иллюстрация</P> + Обычный текст"
         if ((img.className ==""  ||  img.className =="normal")  &&  img.nextSibling !=null  &&  img.nextSibling.innerHTML !=""  &&  (img.nextSibling.className ==""  ||  img.nextSibling.className =="normal")) {

                 //  В секциях
                 if (img.parentNode.className =="section") {
                         if (img.nextSibling.innerHTML.search(reEm) !=-1) {
                                 mI_003[count_003]=img;
                                 m_003[count_003]=img.nextSibling;
                                 count_003++ }  //  курсив, или полужирный курсив
                             else {
                                     if (img.nextSibling.innerHTML.search(reSt) !=-1) {
                                             mI_004[count_004]=img;
                                             m_004[count_004]=img.nextSibling;
                                             count_004++ }  //  полужирный шрифт
                                         else {
                                                 mI_005[count_005]=img;
                                                 m_005[count_005]=img.nextSibling;
                                                 count_005++ }   //   без курсива и полужирного шрифта
                                     }
                         }

                 //  В других разделах
                 if (img.parentNode.className !="section") {
                         mI_006[count_006]=img;
                         m_006[count_006]=img.nextSibling;
                         count_006++ }

                 }


         //  Поиск и сохранение сочетаний    "<P>Иллюстрация</P> + Пустая_строка + Обычный текст"
         if ((img.className ==""  ||  img.className =="normal")  &&  img.nextSibling !=null  &&  img.nextSibling.innerHTML ==""  &&  img.nextSibling.nextSibling !=null  &&  (img.nextSibling.nextSibling.className ==""  ||  img.nextSibling.nextSibling.className =="normal")) {

                 //  В секциях
                 if (img.parentNode.className =="section") {
                         if (img.nextSibling.nextSibling.innerHTML.search(reEm) !=-1) {
                                 mI_013[count_013]=img;
                                 m_013[count_013]=img.nextSibling.nextSibling;
                                 count_013++ }  //  курсив, или полужирный курсив
                             else {
                                     if (img.nextSibling.nextSibling.innerHTML.search(reSt) !=-1) {
                                             mI_014[count_014]=img;
                                             m_014[count_014]=img.nextSibling.nextSibling;
                                             count_014++ }  //  полужирный шрифт
                                         else {
                                                 mI_015[count_015]=img;
                                                 m_015[count_015]=img.nextSibling.nextSibling;
                                                 count_015++ }   //   без курсива и полужирного шрифта
                                     }
                         }

                 //  В других разделах
                 if (img.parentNode.className !="section") {
                         mI_016[count_016]=img;
                         m_016[count_016]=img.nextSibling.nextSibling;
                         count_016++ }

                 }


         //  Поиск и сохранение сочетаний    "Обычный текст + <P>Иллюстрация</P>"
         if ((img.className ==""  ||  img.className =="normal")  &&  img.previousSibling !=null  &&  img.previousSibling.innerHTML !=""  &&  (img.previousSibling.className ==""  ||  img.previousSibling.className =="normal")) {

                 //  В секциях
                 if (img.parentNode.className =="section") {
                         if (img.previousSibling.innerHTML.search(reEm) !=-1) {
                                 mI_023[count_023]=img;
                                 m_023[count_023]=img.previousSibling;
                                 count_023++ }  //  курсив, или полужирный курсив
                             else {
                                     if (img.previousSibling.innerHTML.search(reSt) !=-1) {
                                             mI_024[count_024]=img;
                                             m_024[count_024]=img.previousSibling;
                                             count_024++ }  //  полужирный шрифт
                                         else {
                                                 mI_025[count_025]=img;
                                                 m_025[count_025]=img.previousSibling;
                                                 count_025++ }   //   без курсива и полужирного шрифта
                                     }
                         }

                 //  В других разделах
                 if (img.parentNode.className !="section") {
                         mI_026[count_026]=img;
                         m_026[count_026]=img.previousSibling;
                         count_026++ }

                 }


         //  Поиск и сохранение сочетаний    "<P>Иллюстрация</P> + Пустая_строка + Обычный текст"
         if ((img.className ==""  ||  img.className =="normal")  &&  img.previousSibling !=null  &&  img.previousSibling.innerHTML ==""  &&  img.previousSibling.previousSibling !=null  &&  (img.previousSibling.previousSibling.className ==""  ||  img.previousSibling.previousSibling.className =="normal")) {

                 //  В секциях
                 if (img.parentNode.className =="section") {
                         if (img.previousSibling.previousSibling.innerHTML.search(reEm) !=-1) {
                                 mI_033[count_033]=img;
                                 m_033[count_033]=img.previousSibling.previousSibling;
                                 count_033++ }  //  курсив, или полужирный курсив
                             else {
                                     if (img.previousSibling.previousSibling.innerHTML.search(reSt) !=-1) {
                                             mI_034[count_034]=img;
                                             m_034[count_034]=img.previousSibling.previousSibling;
                                             count_034++ }  //  полужирный шрифт
                                         else {
                                                 mI_035[count_035]=img;
                                                 m_035[count_035]=img.previousSibling.previousSibling;
                                                 count_035++ }   //   без курсива и полужирного шрифта
                                     }
                         }

                 //  В других разделах
                 if (img.parentNode.className !="section") {
                         mI_036[count_036]=img;
                         m_036[count_036]=img.previousSibling.previousSibling;
                         count_036++ }

                 }

         }         //  Конец для     "Цикл для графики внутри строки"


 var r=Object();
 var otvet2=0;
 var msg1="";
 var msg2="";
 var mass=[];
 var massImg=[];
 var count;
 var reSocr = new RegExp("^(.{65}).{3,}","g");       //  Сокращение строки
 var reSocr_ = "$1...";

         //  Функция перехода на начало элемента (хотя она, в конечном итоге, ничего не изменяет, но FBE будет считать эту операцию изменением документа)
 function GoToBegin(Elem) {
 Elem5=document.createElement("ELEM");
 Elem.insertAdjacentElement("beforeBegin", Elem5);
 GoTo(Elem5);
 Elem5.removeNode(true);
 }

         //  Функция просмотра и добавления пустых строк после иллюстрации
 function spectoAddNext(msg1, massImg, mass, count) {
 n=0;
 msg1 += "\n                                           добавить пустую строку?";    //  Вторая строка заголовка в окне
 while (n < count) {                                                                            //  Окно ввода будет запускаться, пока не будут просмотрены все элементы массива
         GoToBegin(mass[n]);                                                              //  Переход на один из параграфов, сохраненных в массиве
         msg2=(" • "+(n+1)+" из "+count+" •  "+mass[n].innerHTML).replace(reSocr, reSocr_)+" ";      //   Формирование строки: " • [номер эл-та] из [общее число эл-ов] •  [внутреннее содержание эл-та]"
         otvet2 = InputBox(msg1, msg2, r);                                    //  Открытие окна ввода, и сохранение кода нажатой кнопки
         if (otvet2 ==2) return;                                                             //   Если нажата кнопка "Отмена": выход из "функции просмотра и добавления пустых строк"
         if (otvet2 ==6) {                                                                            //   Если нажата кнопка "Да"
                 massImg[n].insertAdjacentElement("afterEnd",empty_line.cloneNode(true));
                 window.external.inflateBlock(massImg[n].nextSibling)=true;       //   то, производим добавление пустой строки
                 count_231++; }
         n++;                                                                                                 //   Увеличение номера элемента в массиве
         }
 }

         //  Функция просмотра и удаления пустых строк после иллюстрации
 function spectoDelNext(msg1, massImg, mass, count) {
 n=0;
 msg1 += "\n                                            удалить пустую строку?";    //  Вторая строка заголовка в окне
 while (n < count) {                                                                            //  Окно ввода будет запускаться, пока не будут просмотрены все элементы массива
         GoToBegin(mass[n]);                                                              //  Переход на один из параграфов, сохраненных в массиве
         msg2=(" • "+(n+1)+" из "+count+" •  "+mass[n].innerHTML).replace(reSocr, reSocr_)+" ";      //   Формирование строки: " • [номер эл-та] из [общее число эл-ов] •  [внутреннее содержание эл-та]"
         otvet2 = InputBox(msg1, msg2, r);                                    //  Открытие окна ввода, и сохранение кода нажатой кнопки
         if (otvet2 ==2) return;                                                             //   Если нажата кнопка "Отмена": выход из "функции просмотра и удаления пустых строк"
         if (otvet2 ==6) {                                                                            //   Если нажата кнопка "Да"
                 massImg[n].nextSibling.removeNode(true);  //   то, производим удаление пустой строки
                 count_232++; }
         n++;                                                                                                 //   Увеличение номера элемента в массиве
         }
 }

         //  Функция перехода на конец элемента
 function GoToEnd(Elem) {
 Elem5=document.createElement("ELEM");
 Elem.insertAdjacentElement("beforeEnd", Elem5);
 GoTo(Elem5);
 Elem5.removeNode(true);
 }

         //  Функция просмотра и добавления пустых строк перед иллюстрацией
 function spectoAddPrev(msg1, massImg, mass, count) {
 n=0;
 msg1 += "\n                                           добавить пустую строку?";    //  Вторая строка заголовка в окне
 while (n < count) {                                                                            //  Окно ввода будет запускаться, пока не будут просмотрены все элементы массива
         GoToEnd(mass[n]);                                                              //  Переход на один из параграфов, сохраненных в массиве
         msg2=(" • "+(n+1)+" из "+count+" •  "+mass[n].innerHTML).replace(reSocr, reSocr_)+" ";      //   Формирование строки: " • [номер эл-та] из [общее число эл-ов] •  [внутреннее содержание эл-та]"
         otvet2 = InputBox(msg1, msg2, r);                                    //  Открытие окна ввода, и сохранение кода нажатой кнопки
         if (otvet2 ==2) return;                                                             //   Если нажата кнопка "Отмена": выход из "функции просмотра и добавления пустых строк"
         if (otvet2 ==6) {                                                                            //   Если нажата кнопка "Да"
                 massImg[n].insertAdjacentElement("beforeBegin",empty_line.cloneNode(true));
                 window.external.inflateBlock(massImg[n].previousSibling)=true;   //   то, производим добавление пустой строки
                 count_241++; }
         n++;                                                                                                 //   Увеличение номера элемента в массиве
         }
 }

         //  Функция просмотра и удаления пустых строк перед иллюстрацией
 function spectoDelPrev(msg1, massImg, mass, count) {
 n=0;
 msg1 += "\n                                            удалить пустую строку?";    //  Вторая строка заголовка в окне
 while (n < count) {                                                                            //  Окно ввода будет запускаться, пока не будут просмотрены все элементы массива
         GoToEnd(mass[n]);                                                              //  Переход на один из параграфов, сохраненных в массиве
         msg2=(" • "+(n+1)+" из "+count+" •  "+mass[n].innerHTML).replace(reSocr, reSocr_)+" ";      //   Формирование строки: " • [номер эл-та] из [общее число эл-ов] •  [внутреннее содержание эл-та]"
         otvet2 = InputBox(msg1, msg2, r);                                    //  Открытие окна ввода, и сохранение кода нажатой кнопки
         if (otvet2 ==2) return;                                                             //   Если нажата кнопка "Отмена": выход из "функции просмотра и удаления пустых строк"
         if (otvet2 ==6) {                                                                            //   Если нажата кнопка "Да"
                 massImg[n].previousSibling.removeNode(true);  //   то, производим удаление пустой строки
                 count_242++; }
         n++;                                                                                                 //   Увеличение номера элемента в массиве
         }
 }


         //   Вопросы к пользователю

 var count_231 = 0;  var count_232 = 0;
 var count_241 = 0;  var count_242 = 0;

         //  Снятие показания времени перед открытием окон вопросов
  var Tf1=new Date().getTime();

 if ((count_001!=0  ||  count_002!=0  ||  count_003!=0  ||  count_004!=0  ||  count_005!=0  ||  count_006!=0)
    &&  AskYesNo("            ◊  ДОБАВЛЕНИЕ ПУСТЫХ СТРОК  ◊                              \n"+
                                  "    между иллюстрациями и текстом под ними\n\n"+
                                  "                         < Иллюстрация >\n"+
                                  "                                < Текст >\n\n"+
                                  "    // Кнопка «Отмена» в будущем диалоге\n"+
                                  "    // не отменяет произведенные изменения,\n"+
                                  "    // но позволяет пропустить блок сочетаний,\n"+
                                  "    // например, «Цитата под иллюстрацией».\n\n"+
                                  "                             Продолжить?")) {
         if (count_001!=0)
                 spectoAddNext("                                       ◊  ИЛЛЮСТРАЦИЯ + цитата  ◊", mI_001, m_001, count_001);
         if (count_002!=0)
                 spectoAddNext("                                  ◊  ИЛЛЮСТРАЦИЯ + подзаголовок  ◊", mI_002, m_002, count_002);
         if (count_003!=0)
                 spectoAddNext("                                ◊  ИЛЛЮСТРАЦИЯ + курсивный текст  ◊", mI_003, m_003, count_003);
         if (count_004!=0)
                 spectoAddNext("                              ◊  ИЛЛЮСТРАЦИЯ + полужирный текст  ◊", mI_004, m_004, count_004);
         if (count_005!=0)
                 spectoAddNext("                                 ◊  ИЛЛЮСТРАЦИЯ + обычный текст  ◊", mI_005, m_005, count_005);
         if (count_006!=0)
                 spectoAddNext("                                        ◊  ИЛЛЮСТРАЦИЯ + текст  ◊", mI_006, m_006, count_006);
       }

 if ((count_011!=0  ||  count_012!=0  ||  count_013!=0  ||  count_014!=0  ||  count_015!=0  ||  count_016!=0)
    &&  AskYesNo("             ◊  УДАЛЕНИЕ ПУСТЫХ СТРОК  ◊                               \n"+
                                  "    между иллюстрациями и текстом под ними\n\n"+
                                  "                         < Иллюстрация >\n"+
                                  "                        < Пустая  строка >\n"+
                                  "                                < Текст >\n\n"+
                                  "    // Кнопка «Отмена» в будущем диалоге\n"+
                                  "    // не отменяет произведенные изменения,\n"+
                                  "    // но позволяет пропустить блок сочетаний,\n"+
                                  "    // например, «Цитата под иллюстрацией».\n\n"+
                                  "                             Продолжить?")) {
         if (count_011!=0)
                 spectoDelNext("                                       ◊  ИЛЛЮСТРАЦИЯ + цитата  ◊", mI_011, m_011, count_011);
         if (count_012!=0)
                 spectoDelNext("                                  ◊  ИЛЛЮСТРАЦИЯ + подзаголовок  ◊", mI_012, m_012, count_012);
         if (count_013!=0)
                 spectoDelNext("                                ◊  ИЛЛЮСТРАЦИЯ + курсивный текст  ◊", mI_013, m_013, count_013);
         if (count_014!=0)
                 spectoDelNext("                              ◊  ИЛЛЮСТРАЦИЯ + полужирный текст  ◊", mI_014, m_014, count_014);
         if (count_015!=0)
                 spectoDelNext("                                 ◊  ИЛЛЮСТРАЦИЯ + обычный текст  ◊", mI_015, m_015, count_015);
         if (count_016!=0)
                 spectoDelNext("                                        ◊  ИЛЛЮСТРАЦИЯ + текст  ◊", mI_016, m_016, count_016);
       }

 if ((count_021!=0  ||  count_022!=0  ||  count_023!=0  ||  count_024!=0  ||  count_025!=0  ||  count_026!=0)
    &&  AskYesNo("            ◊  ДОБАВЛЕНИЕ ПУСТЫХ СТРОК  ◊                              \n"+
                                  "   между иллюстрациями и текстом над ними\n\n"+
                                  "                                < Текст >\n"+
                                  "                         < Иллюстрация >\n\n"+
                                  "    // Кнопка «Отмена» в будущем диалоге\n"+
                                  "    // не отменяет произведенные изменения,\n"+
                                  "    // но позволяет пропустить блок сочетаний,\n"+
                                  "    // например, «Цитата перед иллюстрацией».\n\n"+
                                  "                             Продолжить?")) {
         if (count_021!=0)
                 spectoAddPrev("                                       ◊  цитата + ИЛЛЮСТРАЦИЯ  ◊", mI_021, m_021, count_021);
         if (count_022!=0)
                 spectoAddPrev("                                  ◊  подзаголовок + ИЛЛЮСТРАЦИЯ  ◊", mI_022, m_022, count_022);
         if (count_023!=0)
                 spectoAddPrev("                                ◊  курсивный текст + ИЛЛЮСТРАЦИЯ  ◊", mI_023, m_023, count_023);
         if (count_024!=0)
                 spectoAddPrev("                              ◊  полужирный текст + ИЛЛЮСТРАЦИЯ  ◊", mI_024, m_024, count_024);
         if (count_025!=0)
                 spectoAddPrev("                                 ◊  обычный текст + ИЛЛЮСТРАЦИЯ  ◊", mI_025, m_025, count_025);
         if (count_026!=0)
                 spectoAddPrev("                                        ◊  текст + ИЛЛЮСТРАЦИЯ  ◊", mI_026, m_026, count_026);
       }

 if ((count_031!=0  ||  count_032!=0  ||  count_033!=0  ||  count_034!=0  ||  count_035!=0  ||  count_036!=0)
    &&  AskYesNo("             ◊  УДАЛЕНИЕ ПУСТЫХ СТРОК  ◊                               \n"+
                                  "    между иллюстрациями и текстом над ними\n\n"+
                                  "                                < Текст >\n"+
                                  "                        < Пустая  строка >\n"+
                                  "                         < Иллюстрация >\n\n"+
                                  "    // Кнопка «Отмена» в будущем диалоге\n"+
                                  "    // не отменяет произведенные изменения,\n"+
                                  "    // но позволяет пропустить блок сочетаний,\n"+
                                  "    // например, «Цитата перед иллюстрацией».\n\n"+
                                  "                             Продолжить?")) {
         if (count_031!=0)
                 spectoDelPrev("                                       ◊  цитата + ИЛЛЮСТРАЦИЯ  ◊", mI_031, m_031, count_031);
         if (count_032!=0)
                 spectoDelPrev("                                  ◊  подзаголовок + ИЛЛЮСТРАЦИЯ  ◊", mI_032, m_032, count_032);
         if (count_033!=0)
                 spectoDelPrev("                                ◊  курсивный текст + ИЛЛЮСТРАЦИЯ  ◊", mI_033, m_033, count_033);
         if (count_034!=0)
                 spectoDelPrev("                              ◊  полужирный текст + ИЛЛЮСТРАЦИЯ  ◊", mI_034, m_034, count_034);
         if (count_035!=0)
                 spectoDelPrev("                                 ◊  обычный текст + ИЛЛЮСТРАЦИЯ  ◊", mI_035, m_035, count_035);
         if (count_036!=0)
                 spectoDelPrev("                                        ◊  текст + ИЛЛЮСТРАЦИЯ  ◊", mI_036, m_036, count_036);
       }

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
 var zitata_N = Math.floor(("000000"+Math.tan(Ts1)).replace(/[\.\-]/g, "").replace(/.+(\d{6})\d$/g, "$1")/1000000*271)+1;
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


         //  Функция конвертации времени  (мс  => мин., с)
 function tempusK(T) {
         Tmin  = Math.floor(T/60000);
         TsecD = (T%60000)/1000;
         Tsec = Math.floor(TsecD);
        
         if (Tmin ==0)
                 T2 = (TsecD+"").replace(/(.{1,5}).*/g, "$1").replace(".", ",")+" сек";
             else {
                     T2 = Tmin+" мин";
                     if (Tsec !=0)
                             T2 += " " + Tsec+ " с" }
         return T2;
         }

 var Tf2=new Date().getTime();
 var tempus1=tempusK(Tf1-Ts1);
 var tempus2=tempusK(Tf2-Ts1);

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 // Подсчет общего количества исправлений
 var itogi = count_101 + count_102 + count_111 + count_112 + count_113 + count_114 + count_121 + count_122 + count_123 + count_124 + count_201 + count_211 + count_212 + count_231 + count_232 + count_241 + count_242;



                 /// ДОПОЛНЕНИЕ _2_  :  Демонстрационный режим "Показать все строки"


 var dem=false;
 var Exemplar="н/д";
// dem=true;   // !!!!!  активатор
 if (dem) {
          count_101=Exemplar;  count_102=Exemplar;  count_111=Exemplar;  count_112=Exemplar;  count_113=Exemplar;  count_114=Exemplar;  count_121=Exemplar;  count_122=Exemplar;  count_123=Exemplar;  count_124=Exemplar;
          count_201=Exemplar;  count_211=Exemplar;  count_212=Exemplar;  count_221=Exemplar;  count_222=Exemplar;  count_231=Exemplar;  count_232=Exemplar;  count_241=Exemplar;  count_242=Exemplar;
          itogi=Exemplar;
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Сборка массива с результатами обработки


 var mSt=[];
 var ind=1;

                                                             mSt[ind]='• СТАТИСТИКА:';  ind++;
                                                             mSt[ind]='• Время, затраченное на вычисления  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+tempus1;  ind++;
                                                             mSt[ind]='• Общее время выполнения .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+tempus2;  ind++;
                                                             mSt[ind]='• Всего исправлений   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+itogi;  ind++;

 var cTaT1=ind-1;  //  число строк в первом разделе

                                                             mSt[ind]='';  ind++;
                                                             mSt[ind]='• ИСПРАВЛЕНИЯ СТРУКТУРЫ:';  ind++;

         if (count_101!=0)             { mSt[ind]='101. Перезапись параграфов .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_101;  ind++ }
         if (count_102!=0)             { mSt[ind]='102. Удаление внутренних тегов вне параграфа   .  .  .  .  .  .  .  .  .  .  .	'+count_102;  ind++ }
         if (count_112!=0)             { mSt[ind]='112. Внутренняя чистка строк с графикой .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_112;  ind++ }
         if (count_113!=0)             { mSt[ind]='113. Снятие форматирования "подзаголовок" в строке с графикой   .  .	'+count_113;  ind++ }
         if (count_114!=0)             { mSt[ind]='114. Снятие внешнего форматирования со строк с графикой   .  .  .  .  .	'+count_114;  ind++ }

 if (cTaT1==ind-3) ind=ind-2;  //  Удаление двух последних строк, если нет пунктов в этом разделе
 var cTaT2=ind-1;  //  число строк в двух разделах

                                                             mSt[ind]='';  ind++;
                                                             mSt[ind]='• ОПЕРАЦИИ С ПУСТЫМИ СТРОКАМИ:';  ind++;
         if (count_111!=0)             { mSt[ind]='111. Чистка... внутри строки   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_111;  ind++ }
         if (count_121!=0)             { mSt[ind]='121. Удаление второй пустой строки подряд   .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_121;  ind++ }
         if (count_122!=0)             { mSt[ind]='122. Снятие внешнего форматирования  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_122;  ind++ }
         if (count_123!=0)             { mSt[ind]='123. Удаление... на окраине разделов .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_123;  ind++ }
         if (count_124!=0)             { mSt[ind]='124. Удаление... за краем разделов и подзаголовков  .  .  .  .  .  .  .  .  .	'+count_124;  ind++ }
         if (count_201!=0)             { mSt[ind]='201. Удаление... рядом с картинкой в "кармане" секций .  .  .  .  .  .  .  .	'+count_201;  ind++ }
         if (count_211!=0)             { mSt[ind]='211. Вставка... между картинкой и границей секции .  .  .  .  .  .  .  .  .  .	'+count_211;  ind++ }
         if (count_212!=0)             { mSt[ind]='212. Удаление... между картинкой и границей секции .  .  .  .  .  .  .  .  .	'+count_212;  ind++ }
         if (count_221!=0)             { mSt[ind]='221. Добавление... между картинкой и текстом (автозамена) .  .  .  .  .	'+count_221;  ind++ }
         if (count_222!=0)             { mSt[ind]='222. Добавление... между текстом и картинкой (автозамена) .  .  .  .  .	'+count_222;  ind++ }
         if (count_231!=0)             { mSt[ind]='231. Добавление... между картинкой и текстом .  .  .  .  .  .  .  .  .  .  .  .	'+count_231;  ind++ }
         if (count_232!=0)             { mSt[ind]='232. Удаление... между картинкой и текстом  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_232;  ind++ }
         if (count_241!=0)             { mSt[ind]='241. Добавление... между текстом и картинкой .  .  .  .  .  .  .  .  .  .  .  .	'+count_241;  ind++ }
         if (count_242!=0)             { mSt[ind]='242. Удаление... между текстом и картинкой  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_242;  ind++ }

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
 MsgBox ('                      .·.·.·.                               –= ◊ =–                               .·.·.·.\n'+
                   '                   ·.̉·.̉·.̉  «Пустые строки рядом с иллюстрациями» v.'+NumerusVersion+'  .̉·.̉·.̉·                                    \n'+
                   '                       ̉   ̉   ̉                                                                                  ̉   ̉   ̉ '+st2);

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



}







