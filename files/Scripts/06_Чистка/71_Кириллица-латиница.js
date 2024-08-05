//======================================
//             «Кириллица-латиница»
// v.1.0 — Создание скрипта — Александр Ка (01.06.2024)
// * В программе частично использовались некоторые алгоритмы из скрипта "03_Латиница в Кириллице.js", v.1.2
//======================================
// Замена латинских букв (A, a, B, C, c, E, e, H, K, M, O, o, P, p, T, X, x, y) в русских словах на кириллицу (А, а, В, С, с, Е, е, Н, К, М, О, о, Р, р, Т, Х, х, у)
// Замена цифр (3, 6) в русских словах на кириллицу (З, б)
// Замена русских букв (А, а, В, С, с, Е, е, Н, К, М, О, о, Р, р, Т, Х, х, у) в латиноязычных словах на латиницу (A, a, B, C, c, E, e, H, K, M, O, o, P, p, T, X, x, y)
// Замена русских букв (Х, С, М) в римских числах на латиницу (X, C, M)
//======================================
// v.1.1 — Александр Ка (10.07.2024)
// Понижение значения букв "I", "i" в латинском алфавите.
// Добавка букв "Ѣ", "ѣ", "Ѳ", "ѳ" в русский алфавит (это не оказывает никакого влияния на работу с современным русским текстом, но позволяет лучше обрабатывать вставки в старом стиле).
//======================================

var NumerusVersion="1.1";

function Run() {

//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------

                 ///  НАСТРОЙКИ

//--------------------------------------------------------------------

// Обрабатывать текст внутри "history" (история изменений файла)

var Obrabotka_History=1;      // 0 ; 1 //      ("0" — отключить, "1" — включить)

// ---------------------------------------------------------------

// Преобразовывать отдельностоящие латинские буквы (A, B, C, K, O, a, c, o, y) в русские
// * Это могут быть как предлоги, так и переменные или какие-то обозначения
// ** Если текст книги никак не соприкасается с математикой, то ошибки обработки крайне маловероятны

var Obrabotka_Predlogov=2;      // 0 ; 1 //      ("0" — Нет,   "1" — Да,   "2" — всегда спрашивать)

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОБЩИЕ ПЕРЕМЕННЫЕ


 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

 var fbwBody=document.getElementById("fbw_body");

var ObrabotkaHistory = (Obrabotka_History ==1);

 var n;
 var k;
 var FalseSim="&0&"; // Неповторимый набор символов для нескольких небольших эпизодов

  var Ts=new Date().getTime();
  var tempus=0;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ФОРМИРОВАНИЕ ВОПРОСА по предлогам
                 //      (регулярные выражения)


// Удаление тегов
 var reCT = new RegExp("(<.+?>)","g");
 var reCT_ = "";

// Счетчик строк
 var count_P= 0;


 var mV05=[];  //   Сохраненные фрагменты
 var mV06=[];  //   Сохраненные номера строк
 var count_V07=0;  //   Счетчик номеров для фрагмента


       //  Создание фрагментов для предлогов  :::  a, c, o, y

//  стартовая формула
 var reV01s = new RegExp("[А-яЁёѢѣѲѳ][,»\\\"“]{0,1}((\\\s|"+nbspEntity+")[—–\\\-]){0,1}(\\\s|"+nbspEntity+")[acoy](\\\s|"+nbspEntity+")[«\\\"„]{0,1}[А-яЁёѢѣѲѳ]","g");
//  формула извлечения текста для добавления в массив
 var reV02 = new RegExp("(^|[^А-яA-Za-zЁёѢѣѲѳ\\\-])[А-яA-Za-zЁёѢѣѲѳ\\\-]{0,17}.{0,32}?[А-яЁёѢѣѲѳ][,»\\\"“]{0,1}((\\\s|"+nbspEntity+")[—–\\\-]){0,1}(\\\s|"+nbspEntity+")[acoy](\\\s|"+nbspEntity+")[«\\\"„]{0,1}[А-яЁёѢѣѲѳ].{0,37}[А-яA-Za-zЁёѢѣѲѳ\\\-]{0,17}(?=[^А-яA-Za-zЁёѢѣѲѳ\\\-]|$)","g");
//  для вставки подстрочных знаков подчеркивания
var reV03 = new RegExp("([А-яЁёѢѣѲѳ][,»\\\"“]{0,1})((\\\s|"+nbspEntity+")[—–\\\-]){0,1}(\\\s|"+nbspEntity+")([acoy])(\\\s|"+nbspEntity+")(?=[«\\\"„]{0,1}[А-яЁёѢѣѲѳ])","g");
 var reV03_ = "$1$2 ̲$5̲ ";


       //  Создание фрагментов для предлогов  :::  A, B, C, K, O

//  стартовая формула
 var reV11s = new RegExp("(^|[…\\\.\\\?!](\\\s|"+nbspEntity+"))([—–\\\-](\\\s|"+nbspEntity+")){0,1}[ABCKO](\\\s|"+nbspEntity+")[«\\\"„]{0,1}[А-яЁёѢѣѲѳ]","g");
//  формула извлечения текста для добавления в массив
 var reV12 = new RegExp("(^|[^А-яA-Za-zЁёѢѣѲѳ\\\-])[А-яA-Za-zЁёѢѣѲѳ\\\-]{0,17}.{0,32}?(^|[…\\\.\\\?!](\\\s|"+nbspEntity+"))([—–\\\-](\\\s|"+nbspEntity+")){0,1}[ABCKO](\\\s|"+nbspEntity+")[«\\\"„]{0,1}[А-яЁёѢѣѲѳ].{0,37}[А-яA-Za-zЁёѢѣѲѳ\\\-]{0,17}(?=[^А-яA-Za-zЁёѢѣѲѳ\\\-]|$)","g");
//  для вставки подстрочных знаков подчеркивания
var reV13 = new RegExp("(^|[…\\\.\\\?!](\\\s|"+nbspEntity+"))([—–\\\-](\\\s|"+nbspEntity+")){0,1}([ABCKO])(\\\s|"+nbspEntity+")(?=[«\\\"„]{0,1}[А-яЁёѢѣѲѳ])","g");
 var reV13_ = "$1$3̲$5̲ ";

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ФОРМИРОВАНИЕ ВОПРОСА по предлогам
                 //      (сборка функции "Vopros")


 var max0=24;  //   Максимальное количество найденных строк в окне вопроса
 var massif=[];  //   Сохраненные фрагменты из одной строки


 function Vopros(ptr) {

   if (Obrabotka_Predlogov==2)  {

           s=ptr.innerHTML;  // оригинальный абзац        
           count_P++;         //   строки  
      
           if (s.search(reV01s) != -1  &&  count_V07<max0)  {
                   if (s.search(/</g)!=-1)  s=s.replace(reCT, reCT_);   //  Удаление всех внутренних тегов
                   massif=s.match(reV02);  //  Сохранение фрагментов текста одного абзаца
                   for (n=0;  (n < massif.length  &&  count_V07< max0);  n++) {  //  перебор всех фрагментов (обычно там только один фрагмент)
                           mV05[count_V07]=massif[n].replace(reV03, reV03_);  //  Сохранение фрагмента текста в основном массиве
                           mV06[count_V07]=count_P;  //  Сохранение номера строки
                           count_V07++;    }    }

           if (s.search(reV11s) != -1  &&  count_V07<max0)  {
                   if (s.search(/</g)!=-1)  s=s.replace(reCT, reCT_);   //  Удаление всех внутренних тегов
                   massif=s.match(reV12);  //  Сохранение фрагментов текста одного абзаца
                   for (n=0;  (n < massif.length  &&  count_V07< max0);  n++) {  //  перебор всех фрагментов (обычно там только один фрагмент)
                           mV05[count_V07]=massif[n].replace(reV13, reV13_);  //  Сохранение фрагмента текста в основном массиве
                           mV06[count_V07]=count_P;  //  Сохранение номера строки
                           count_V07++;    }    }
           }

   }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ФОРМИРОВАНИЕ ВОПРОСА по предлогам
                 //      (применение функции "Vopros")


    window.external.BeginUndoUnit(document,"«Кириллица-латиница» v."+NumerusVersion+":   Исправление структуры");

 var count_001 = 0;       //  Автоисправление вложений в параграф (перезапись внутреннего содержимого)
 var re002 = new RegExp("STRONG|EM|SUP|SUB|STRIKE|SPAN","g");       //  Удаление внутренних тегов вне параграфа
 var count_002 = 0;

 var ptr=fbwBody;
 var ProcessingEnding=false;
 var nextPtr = false;                              //  Флаг перехода на соседний элемент

 while (!ProcessingEnding  &&  ptr) {
         if (ptr.nodeName=="P") Vopros(ptr);
         if (ptr.firstChild!=null  &&  ptr.nodeName!="P"  &&  (ptr.className!="history" || ObrabotkaHistory))
                 { ptr=ptr.firstChild }
             else {
                     nextPtr = false;
                     while (!nextPtr) {
                             while (ptr.nextSibling==null)  {
                                     ptr=ptr.parentNode;
                                     if (ptr.nodeName =="P")  { ptr.innerHTML=ptr.innerHTML; count_001++ }
                                     if (ptr==fbwBody) {ProcessingEnding=true }
                                     }
                             while (ptr.nextSibling !=null  &&  ptr.nextSibling.nodeName.search(re002)!=-1)  { ptr.nextSibling.removeNode(false); count_002++ }
                             if (ptr.nextSibling !=null)  { ptr=ptr.nextSibling; nextPtr = true }
                             }
                     }
         }

    window.external.EndUndoUnit(document);                                             // undo конец (запись в систему для отката)

 var count_struct=count_001+count_002;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ФОРМИРОВАНИЕ ВОПРОСА по предлогам
                 //      (обработка и применение полученных данных)


 var pause = 0;   //  Продолжительность паузы в расчетах при открытии окна вопроса
 var otvet = false;

 if (Obrabotka_Predlogov==2)  {

         pause = new Date().getTime();

         var vop = "";

           // Добавление многоточий
         var reF01 = new RegExp("^[^А-яA-Za-zЁёѢѣѲѳ0-9«„“»”\\\"̲]{0,5}|(.)[^А-яA-Za-zЁёѢѣѲѳ0-9«„“»”\\\"̲]{0,5}$","g");
         var reF01_ = "$1...";

           // удвоение пробелов для лучшей картинки
         var reF02 = new RegExp("(\\\s|"+nbspEntity+")","g");
         var reF02_ = "  ";

           // создание текста и окна вопроса
         if (count_V07!=0) {
                 for (n=0; n<count_V07; n++) {
                        vop += "\n\n◊ "+mV06[n]+"	"+mV05[n].replace(reF01, reF01_).replace(reF02, reF02_)+"   " }
                 otvet=AskYesNo("                                         ◊  СДЕЛАТЬ подчеркнутые латинские буквы РУССКИМИ?  ◊                                                           "+vop);
                 }

         pause = new Date().getTime() - pause;
         }

   // окончательный ответ
 otvet = (Obrabotka_Predlogov==1  ||  otvet);

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОБРАБОТКА ТЕКСТА
                 //      (регулярные выражения)


         //   Русские «Х, С, М» в римских числах, типа MCMLXXXIV   :::   В числах

 var reXX01s = new RegExp("[ХСМIVXLCDM]{2}","");
 var reXX01 = new RegExp("(^|[^А-яA-Za-zЁёѢѣѲѳ])([Х]{2,}|[ХСМIVXLCDM]{0,}([IVXLCDM][ХСМ]|[ХСМ][IVXLCDM])[ХСМIVXLCDM]{0,})(?=[^А-яA-Za-zЁёѢѣѲѳ]|$)","g");
 var reXX01_ = "$1"+FalseSim+"$2";    //  пометка римских чисел
 var reXX02 = new RegExp(FalseSim+"[ХСМIVXLCDM]{1,}","g");    //  Для извлечение римских чисел в массив
 var reXX03 = new RegExp(FalseSim+"[ХСМIVXLCDM]{1,}","");     //  Для возвращения обработанных римских чисел (модификатора "g" здесь нет, поэтому возвращение будет происходить по одному числу)
 var mXX = [];
 var count_XX=0;


         //   Замена латиницы на нормальные буквы   :::   В словах

 var mLat  = ["A", "a", "B", "C", "c", "E", "e", "H", "K", "M", "O", "o", "P", "p", "T", "X", "x", "y"];
 var mRus = ["А", "а", "В", "С", "с", "Е", "е", "Н", "К", "М", "О", "о", "Р", "р", "Т", "Х", "х", "у"];
 var RuMix = "А-яЁёѢѣѲѳAaBCcEeHKMOoPpTXxy";   //  мягкая смесь латиницы и кириллицы.    Запись: ["+RuMix+"]

 var reWR01s = new RegExp("[А-яЁёѢѣѲѳ][AaBCcEeHKMOoPpTXxy]|[AaBCcEeHKMOoPpTXxy][А-яЁёѢѣѲѳ]","g");
 var reWR01 = new RegExp("(^|[^А-яA-Za-zЁёѢѣѲѳ])(["+RuMix+"]{0,}([А-яЁёѢѣѲѳ][AaBCcEeHKMOoPpTXxy]|[AaBCcEeHKMOoPpTXxy][А-яЁёѢѣѲѳ])["+RuMix+"]{0,})(?=[^А-яA-Za-zЁёѢѣѲѳ]|$)","g");
 var reWR01_ = "$1"+FalseSim+"$2";   //  пометка найденых сочетаний
 var reWR02 = new RegExp(FalseSim+"[А-яA-Za-zЁёѢѣѲѳ]{2,}","g");    //  Для извлечение слов  в массив

 var reWR03 = new RegExp("[БГДЁЖЗИЙЛПУФЦЧШЩЪЫЬЭЮЯѢѲбвёжзийклмнфцчшщъыьэюяѣѳ]","");    //  однозначно русские буквы (достаточно 1 шт.)
 var reWR04 = new RegExp("[А-яЁёѢѣѲѳ]","g");    //  русские буквы (достаточно 2 шт.)
 var reWR05 = new RegExp("^(ад|ан|АО|ар|ас|ат|ау|ах|во|Вт|га|гм|го|гр|гс|да|де|дм|дн|до|др|ед|ее|ем|ер|ка|кВ|кв|кг|км|кн|ко|кр|ку|мА|мВ|мг|ме|мм|мн|мс|му|на|не|нм|но|нс|ну|ом|он|оп|ор|от|ох|па|пе|по|пр|пс|ре|ро|рт|св|се|см|со|ср|ст|су|та|ТВ|те|то|ту|уд|ук|ум|ус|ух|ха|хе|хм|хо)$","i");    //  Словарик для проверки слов из 2-х букв ("i" - регистронезависимый режим)
 var reWR06 = new RegExp("^(авт|ага|агу|ада|аде|аду|акр|акт|Ане|ант|АОН|арт|арх|аса|асе|асс|асу|атм|АТС|ату|аут|ВАК|вам|ван|вар|вас|ВВС|век|вес|вне|вод|вое|вон|вор|вот|все|гав|гад|гак|гам|где|гем|ген|гер|год|гон|гоп|гос|гот|гуд|дао|дар|два|две|дед|дек|деп|дер|дна|дне|дно|дну|дог|док|дом|дон|доп|дот|дух|Ева|Еве|евр|Еву|его|еда|еде|еду|ему|ера|как|кап|кат|ква|КВН|кво|кВт|кед|КНР|код|кое|кок|ком|кон|коп|кот|Кох|кпд|кто|кум|кун|кур|кус|кут|кхе|маг|мае|мак|мат|мах|МВт|мга|мед|мес|мех|мкА|мкВ|мкг|мкм|мкс|мне|моа|мОм|мор|мот|мох|над|нам|нар|нас|нед|нее|нем|нет|нок|ном|нос|ноу|НТВ|НТО|НТР|нут|ОАО|ого|ода|оде|одр|оду|Ока|Оке|око|окр|Оку|ООН|ООО|опа|опт|орг|орт|оса|осе|осн|ост|осу|отв|отд|ОТК|ото|пае|пак|пан|пар|пас|пат|пах|пед|пек|пес|под|пом|поп|пор|пос|пот|про|пру|пуд|пук|пуп|пух|рад|рае|рак|РАО|рев|ред|рее|РНК|ров|рог|род|рое|рок|ром|рот|рук|Рур|рус|сад|сак|сам|сан|сап|СВО|сев|сет|сое|сок|сом|сон|сор|спр|ста|сто|стр|суд|сук|суп|сут|так|там|тат|тау|тег|тем|тес|тет|тех|тов|ток|том|тон|топ|тор|тот|тсс|тук|тун|тур|тут|угу|уда|укр|ума|уме|уму|унт|упр|ура|уха|ухе|ухо|уху|хам|хан|хау|хек|хна|ход|хон|хоп|хор|хук)$","i");    //  Словарик для проверки слов из 3-х букв ("i" - регистронезависимый режим)

 var reWR07 = new RegExp(FalseSim+"[А-яA-Za-zЁёѢѣѲѳ]{2,}","");     //  Для возвращения обработанных слов (модификатора "g" здесь нет, поэтому замена будет происходить по одному слову)
 var mWR = [];
 var wrd;   //  слово
 var count_WR=0;


         //   Замена цифр на нормальные буквы   :::   В строке

 var re101 = new RegExp("(^|[^А-яA-Za-zЁёѢѣѲѳ0-9])(3)(?=[а-яё]{3})","g");             //   3 (цифра "три") -> З (буква "Зэ")
 var re101_ = "$1"+"З";

 var re111s = new RegExp("(6)(?=[а-яёѣѳ])","g");                                                   //   6 (цифра "шесть") -> б (буква "Бэ")
 var re111 = new RegExp("([^A-Za-z0-9])(6)(?=[а-яёѣѳ]{3}|ы[^мех]|ез)","g");  //  к "б###" добавлены часто используемые: "бы", "был", "без" и некоторые другие
 var re111_ = "$1"+"б";
 var re112 = new RegExp("([А-яЁёѢѣѲѳ]{2})(6)(?=[а-яёѣѳ])","g");
 var re112_ = "$1"+"б";

 var count_101=0;


         //   Замена кириллицы на латиницу   :::   В словах
 var LaMix = "A-Za-zАаВСсЕеНКМОоРрТХху";   //  мягкая смесь латиницы и кириллицы.    Запись: ["+LaMix+"]
 var reWL01s = new RegExp("[A-Za-z][АаВСсЕеНКМОоРрТХху]|[АаВСсЕеНКМОоРрТХху][A-Za-z]","g");
 var reWL01 = new RegExp("(^|[^А-яA-Za-zЁёѢѣѲѳ])(["+LaMix+"]{0,}([A-Za-z][АаВСсЕеНКМОоРрТХху]|[АаВСсЕеНКМОоРрТХху][A-Za-z])["+LaMix+"]{0,})(?=[^А-яA-Za-zЁёѢѣѲѳ]|$)","g");
 var reWL01_ = "$1"+FalseSim+"$2";   //  пометка найденных сочетаний
 var reWL02 = new RegExp(FalseSim+"[А-яA-Za-zЁёѢѣѲѳ]{2,}","g");    //  Для извлечение слов  в массив
 var reWL03 = new RegExp("[DFGJLNQRSUVWYZbdfhjklqstuvwz]","");    //  однозначно латинские буквы (достаточно 1 шт.)
 var reWL04 = new RegExp("[A-Za-z]","g");    //  латинские буквы (достаточно 2 шт.)
 var reWL07 = new RegExp(FalseSim+"[А-яA-Za-zЁёѢѣѲѳ]{2,}","");     //  Для возвращения обработанных слов (модификатора "g" здесь нет, поэтому замена будет происходить по одному слову)
 var mWL = [];
 var count_WL=0;


         //   Замена латиницы в предлогах на нормальные буквы   :::   В строке

 var re201 = new RegExp("([А-яЁёѢѣѲѳ][,»\\\"“]{0,1})((\\\s|"+nbspEntity+")[—–\\\-]){0,1}(\\\s|"+nbspEntity+")(a)(\\\s|"+nbspEntity+")(?=[«\\\"„]{0,1}[А-яЁёѢѣѲѳ])","g");
 var re201_ = "$1$2 а ";

 var re202 = new RegExp("([А-яЁёѢѣѲѳ][,»\\\"“]{0,1})((\\\s|"+nbspEntity+")[—–\\\-]){0,1}(\\\s|"+nbspEntity+")(c)(\\\s|"+nbspEntity+")(?=[«\\\"„]{0,1}[А-яЁёѢѣѲѳ])","g");
 var re202_ = "$1$2 с ";

 var re203 = new RegExp("([А-яЁёѢѣѲѳ][,»\\\"“]{0,1})((\\\s|"+nbspEntity+")[—–\\\-]){0,1}(\\\s|"+nbspEntity+")(o)(\\\s|"+nbspEntity+")(?=[«\\\"„]{0,1}[А-яЁёѢѣѲѳ])","g");
 var re203_ = "$1$2 о ";

 var re204 = new RegExp("([А-яЁёѢѣѲѳ][,»\\\"“]{0,1})((\\\s|"+nbspEntity+")[—–\\\-]){0,1}(\\\s|"+nbspEntity+")(y)(\\\s|"+nbspEntity+")(?=[«\\\"„]{0,1}[А-яЁёѢѣѲѳ])","g");
 var re204_ = "$1$2 у ";

 var re211 = new RegExp("(^|[…\\\.\\\?!](\\\s|"+nbspEntity+"))([—–\\\-](\\\s|"+nbspEntity+")){0,1}[A](\\\s|"+nbspEntity+")(?=[«\\\"„]{0,1}[А-яЁёѢѣѲѳ])","g");
 var re211_ = "$1$3А ";

 var re212 = new RegExp("(^|[…\\\.\\\?!](\\\s|"+nbspEntity+"))([—–\\\-](\\\s|"+nbspEntity+")){0,1}[B](\\\s|"+nbspEntity+")(?=[«\\\"„]{0,1}[А-яЁёѢѣѲѳ])","g");
 var re212_ = "$1$3В ";

 var re213 = new RegExp("(^|[…\\\.\\\?!](\\\s|"+nbspEntity+"))([—–\\\-](\\\s|"+nbspEntity+")){0,1}[C](\\\s|"+nbspEntity+")(?=[«\\\"„]{0,1}[А-яЁёѢѣѲѳ])","g");
 var re213_ = "$1$3С ";

 var re214 = new RegExp("(^|[…\\\.\\\?!](\\\s|"+nbspEntity+"))([—–\\\-](\\\s|"+nbspEntity+")){0,1}[K](\\\s|"+nbspEntity+")(?=[«\\\"„]{0,1}[А-яЁёѢѣѲѳ])","g");
 var re214_ = "$1$3К ";

 var re215 = new RegExp("(^|[…\\\.\\\?!](\\\s|"+nbspEntity+"))([—–\\\-](\\\s|"+nbspEntity+")){0,1}[O](\\\s|"+nbspEntity+")(?=[«\\\"„]{0,1}[А-яЁёѢѣѲѳ])","g");
 var re215_ = "$1$3О ";

 var count_201=0;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОБРАБОТКА ТЕКСТА
                 //      (сборка функции "HandleP")


  var s="";
  var s_="";
  var count_P=0;
  var count_HP=0;


 // функция, обрабатывающая абзац P
 function HandleP(ptr) {

  s=ptr.innerHTML;
 count_P++;

//                    MCMLXXXIV  :::  В числах
   if (s.search(reXX01s)>=0  &&  s.search(reXX01)>=0)  {
           s=s.replace(reXX01, reXX01_);
           mXX = s.match(reXX02);
           for (n=0; n<mXX.length; n++)  {
                   if (mXX[n].search(FalseSim)>=0)  mXX[n]=mXX[n].replace(FalseSim, "");
                   if (mXX[n].search(/Х/)>=0)  mXX[n]=mXX[n].replace(/Х/g, "X");
                   if (mXX[n].search(/С/)>=0)  mXX[n]=mXX[n].replace(/С/g, "C");
                   if (mXX[n].search(/М/)>=0)  mXX[n]=mXX[n].replace(/М/g, "M");
                   s=s.replace(reXX03, mXX[n]);
                   count_XX++;    }    }

         //   Замена латиницы на нормальные буквы   :::   В словах
   if (s.search(reWR01s)>=0  &&  s.search(reWR01)>=0)  {
           s=s.replace(reWR01, reWR01_);
           mWR = s.match(reWR02);
           for (n=0; n<mWR.length; n++)  {
                   if (mWR[n].search(FalseSim)>=0)    { mWR[n]=mWR[n].replace(FalseSim, "") }
                   wrd=mWR[n];
                   for (k=0; k<mLat.length; k++)
                           if (wrd.search(mLat[k])>=0) {
                                   reWR10 = new RegExp(mLat[k],"g");
                                   wrd=wrd.replace(reWR10, mRus[k]);    }
                   if (mWR[n].search(reWR03)>=0  ||  mWR[n].match(reWR04).length>=2  ||  wrd.search(reWR05)>=0  ||  wrd.search(reWR06)>=0)
                           { count_WR++;   mWR[n]=wrd }
                   s=s.replace(reWR07, mWR[n]);
                   }
           }

         //   Замена цифр на нормальные буквы   :::   В строке
   if (s.search(re101)>=0)       { count_101 += s.match(re101).length;    s=s.replace(re101, re101_);  }

   if (s.search(re111s)>=0)  {
           if (s.search(re111)>=0)       { count_101 += s.match(re111).length;    s=s.replace(re111, re111_);  }
           if (s.search(re112)>=0)       { count_101 += s.match(re112).length;    s=s.replace(re112, re112_);  }   }


         //   Замена кириллицы на латиницу   :::   В словах
   if (s.search(reWL01s)>=0  &&  s.search(reWL01)>=0)  {
           s=s.replace(reWL01, reWL01_);
           mWL = s.match(reWL02);
           for (n=0; n<mWL.length; n++)  {
                   if (mWL[n].search(FalseSim)>=0)    { mWL[n]=mWL[n].replace(FalseSim, "") }
                   wrd=mWL[n];
                   for (k=0; k<mRus.length; k++)
                           if (wrd.search(mRus[k])>=0) {
                                   reWL10 = new RegExp(mRus[k],"g");
                                   wrd=wrd.replace(reWL10, mLat[k]);    }
                   if (mWL[n].search(reWL03)>=0  ||  mWL[n].match(reWL04).length>=2)
                           { count_WL++;   mWL[n]=wrd }
                   s=s.replace(reWL07, mWL[n]);
                   }
           }

         //   Замена латиницы в предлогах на нормальные буквы   :::   В строке
   if(otvet) {
           if (s.search(/[acoy]/)>=0  &&  s.search(/[А-яЁёѢѣѲѳ]/)>=0)  {
                   if (s.search(re201)>=0)       { count_201 += s.match(re201).length;    s=s.replace(re201, re201_);  }
                   if (s.search(re202)>=0)       { count_201 += s.match(re202).length;    s=s.replace(re202, re202_);  }
                   if (s.search(re203)>=0)       { count_201 += s.match(re203).length;    s=s.replace(re203, re203_);  }
                   if (s.search(re204)>=0)       { count_201 += s.match(re204).length;    s=s.replace(re204, re204_);  }    }
           if (s.search(/[ABCKO]/)>=0  &&  s.search(/[А-яЁёѢѣѲѳ]/)>=0)  {
                   if (s.search(re211)>=0)       { count_201 += s.match(re211).length;    s=s.replace(re211, re211_);  }
                   if (s.search(re212)>=0)       { count_201 += s.match(re212).length;    s=s.replace(re212, re212_);  }
                   if (s.search(re213)>=0)       { count_201 += s.match(re213).length;    s=s.replace(re213, re213_);  }
                   if (s.search(re214)>=0)       { count_201 += s.match(re214).length;    s=s.replace(re214, re214_);  }
                   if (s.search(re215)>=0)       { count_201 += s.match(re215).length;    s=s.replace(re215, re215_);  }    }
            }

//  сохранение абзаца в оригинале только в том случае, если он действительно изменен
   if (ptr.innerHTML != s)  {
           ptr.innerHTML=s;
           count_HP++ }


   }   //  конец создания функции "HandleP(ptr)"

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОБРАБОТКА ТЕКСТА
                 //      (применение функции "HandleP")


                         window.external.BeginUndoUnit(document,"«Кириллица-латиница» v."+NumerusVersion);


 ptr=fbwBody;
 ProcessingEnding=false;

 ptr=fbwBody;
 ProcessingEnding=false;
 while (!ProcessingEnding  &&  ptr) {
         if (ptr.nodeName=="P")
                 HandleP(ptr);
         if (ptr.firstChild!=null  &&  ptr.nodeName!="P"  &&  (ptr.className!="history" || ObrabotkaHistory))
                 { ptr=ptr.firstChild }
             else {
                     while (ptr.nextSibling==null)  {
                             ptr=ptr.parentNode;
                             if (ptr==fbwBody) { ProcessingEnding=true }
                             }
                     ptr=ptr.nextSibling;
                     }
         }

                         window.external.EndUndoUnit(document);

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



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Подсчет чистого компьютерного времени, потраченного на обработку текста


 var Tf=new Date().getTime();

 var T=(Tf-Ts-pause);
 var Tmin  = Math.floor(T/60000);
 var TsecD = (T%60000)/1000;
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



                 /// ДОПОЛНЕНИЕ _1_  :  Демонстрационный режим "Показать все строки"


 var dem=false;
// dem=true;   // !!!!!  активатор
 if (dem) {
          var Exemplar="н/д";
          count_HP=Exemplar;  count_struct=Exemplar;
          count_001=Exemplar;  count_002=Exemplar;
          count_WR=Exemplar;  count_101=Exemplar;  count_201=Exemplar;  count_WL=Exemplar;  count_XX=Exemplar;
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Сборка массива с результатами обработки


 var mSt=[];
 var ind=1;
 var cTaT=0;

                                                             mSt[ind]='• СТАТИСТИКА:';  ind++;
                                                             mSt[ind]='Время выполнения  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+tempus;  ind++;
                                                             mSt[ind]='Всего строк .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_P;  ind++;
                                                             mSt[ind]='Исправлено строк   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_HP;  ind++;
 if (count_struct!=0)                  { mSt[ind]='Исправлений структуры   .  .  .  .  .  .  .  .  .  .  .  .	'+count_struct;  ind++ }

cTaT=ind-1;

                                                             mSt[ind]='';  ind++;
                                                             mSt[ind]='• ИСПРАВЛЕНИЯ:';  ind++;
 if (count_001!=0)                      { mSt[ind]='Перезапись параграфов   .  .  .  .  .  .  .  .  .  .  .  .	'+count_001;  ind++ }
 if (count_002!=0)                      { mSt[ind]='Удаление внутренних тегов вне строк .  .  .  .  .	'+count_002;  ind++ }
 if (count_WR!=0)                       { mSt[ind]='Кириллизация слов .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_WR;  ind++ }
 if (count_201!=0)                      { mSt[ind]='Кириллизация предлогов .  .  .  .  .  .  .  .  .  .  .  .	'+count_201;  ind++ }
 if (count_101!=0)                      { mSt[ind]='Кириллизация цифр   .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_101;  ind++ }
 if (count_WL!=0)                       { mSt[ind]='Латинизация слов   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	'+count_WL;  ind++ }
 if (count_XX!=0)                         { mSt[ind]='Латинизация римских чисел   .  .  .  .  .  .  .  .  .  .	'+count_XX;  ind++ }

 if (cTaT==ind-3)  ind=ind-2;                                                                       //  Удаление последних двух строк, если нет пунктов с исправлениями

                                                             mSt[ind]='';  ind++;
                                                             mSt[ind]=" ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ "+currentDate+" ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ "+currentTime+" ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ";  ind++;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Вывод окна результатов на экран


 var st2="";  //  текст результатов

 for  ( n=1; n!=ind; n++ )
        st2=st2+'\n            '+mSt[n];  //  добавление элемента из массива


//  Вывод окна результатов
 MsgBox ('                        .·.·.·.                 –= ◊ =–                 .·.·.·.\n'+
                    '                     ·.̉·.̉·.̉  «Кириллица и латиница» v.'+NumerusVersion+'  .̉·.̉·.̉·                                       \n'+
                   '                         ̉   ̉   ̉                                                      ̉   ̉   ̉ '+st2);

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



}






