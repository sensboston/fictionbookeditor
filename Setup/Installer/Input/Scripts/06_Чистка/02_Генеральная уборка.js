//======================================
//             «Генеральная уборка»
//                                             Engine by ©Sclex
//                                                    01.05.2007 – 07.05.2008
//~~~~~~~~~~~~~~~~~~
// v.1.01 — курсивное лидирующее тире в диалогах №08 — Faiber
//~~~~~~~~~~~~~~~~~~
// v.1.02 — курсив в списках №50
//~~~~~~~~~~~~~~~~~~
// v.1.03 — тире за препинаниями после скобки №13
//~~~~~~~~~~~~~~~~~~
// v.1.04 — открывающие кавычки перед лидирующим тире в диалогах №08
//              запрещение вставки пробела после точки, если после следующей буквы стоит точка №31
//              пробел перед % после цифр №53
//              неразрывный после № и § перед цифрами №54
//              оставил в покое многоточие №05
//              лидирующая тильда ушла в №08
//              тире после запятой, перед которой точка №13
//              начальные и конечные пробелы абзаца в курсиве №81, 82
//~~~~~~~~~~~~~~~~~~
// v.1.05 — тотальная замена коротких тире на длинные №07 — Faiber
//              две точки после слова в одноточие №38
//              в сносках не только цифры в квадратных скобках, а ваще всё что угодно
//~~~~~~~~~~~~~~~~~~
// v.1.06 — замена конечных дефисов на тире производится только в стихах №19 — Faiber
//              удаление лишних точек в заголовках №84
//              счётчики статистики
//              примитивная унификация сносок №40 — Faiber
//              дефис после точки не меняется на тире №13
//~~~~~~~~~~~~~~~~~~
// v.1.07 — вынос сноски за многоточие в конце строки №46
//~~~~~~~~~~~~~~~~~~
// v.1.08 — тире вместо дефиса после точки перед Прописной №29 — Faiber
//               препинания после сноски — везде № 46
//~~~~~~~~~~~~~~~~~~
// v.1.09 — удаление лишних ID №90
//~~~~~~~~~~~~~~~~~~
// v.1.10 — отдельный шаблон для тире после препинаний №55
//~~~~~~~~~~~~~~~~~~
// v.1.11 — немного дополнительной статистики
//               укороченное тире в интервалах дат №52, 60–63, 67
//~~~~~~~~~~~~~~~~~~
// v.1.12 — пропущенные пробелы после препинаний №85
//~~~~~~~~~~~~~~~~~~
// v.1.13 — дефис на тире ещё и в курсиве №29
//~~~~~~~~~~~~~~~~~~
// v.1.14 — стык эмфазиса через тире и пр. №56
//~~~~~~~~~~~~~~~~~~
// v.1.16 — тире вместо дефиса после точки перед открывающимися угловыми кавычками №57
//               пробел после букв-пробел-тире  №58
//~~~~~~~~~~~~~~~~~~
// v.1.17 — неверный знак препинания !… -> !.. №86
//               тире после «!..»  №14а — Faiber
//~~~~~~~~~~~~~~~~~~
// v.1.18 — пробел после тире №55a — Faiber
//~~~~~~~~~~~~~~~~~~
// v.1.19 — более жёстко заданы номера сносок без < и > №41…49
//               сноска зашагивает за многоточие только в конце абзаца — №46a
//~~~~~~~~~~~~~~~~~~
// v.1.20 — пробел перед тире после двоеточия и закр. кавычек №26
//~~~~~~~~~~~~~~~~~~
// v.1.21 — пробел перед тире после вопроса\восклицания и двоеточия №13а
//~~~~~~~~~~~~~~~~~~
// v.1.27 — пробел после букв+двоеточия перед кавычками ["] №27
//               пробел после точки перед откр. кавычками [«] №34
//~~~~~~~~~~~~~~~~~~
// v.1.28 — пронумерованный список: статьи Ст. 1… №50a
//~~~~~~~~~~~~~~~~~~
// v.1.29 — удаление неразрывного пробела после тире №01
//~~~~~~~~~~~~~~~~~~
// v.1.30 — мультипрепинания за сноской №46
//~~~~~~~~~~~~~~~~~~
// v.1.31 — уточнил градусы Цельсия №67
//
// вопрос по обычным двойным кавычкам в №№27, 32
//~~~~~~~~~~~~~~~~~~
// v.1.33 — опять. - дефис после препинаний №29, 31
//~~~~~~~~~~~~~~~~~~
// v.1.34 — emphasis'ы со strong'ами загнал в переменные
//~~~~~~~~~~~~~~~~~~
// v.1.35 — #84 попыткаоставить наместе точки в заголовках, типа 1980 г.; XXI в.; Буш-мл. и т.п.
//~~~~~~~~~~~~~~~~~~
// v.1.36 — ##40,46,46a + PromtSnoska – возможность отключениия простановки квадратных скобок вокруг сноски
//~~~~~~~~~~~~~~~~~~
//v.2.0 — изменения для правильной работы с учетом возможности выбора вида неразрывного пробела в FBE
//======================================
//v.2.1 — отключил «окавычивание» №15,17, 18, 37, 38 — для этого есть скрипты по кавычкам; перестал обращать внимание на сноски 40, 41, 43, 47 — есть скрипты о сноскам
//======================================
//v.2.2 — убрал Ко
//======================================
var VersionNumber="2.2";

//обрабатывать ли history
var ObrabotkaHistory=true;
//обрабатывать ли annotation
var ObrabotkaAnnotation=true;
// обрабатывать ли сноски                       // отключаю касательство к сноскам
// var Snoska=false;
//  var PromptSnoska=true;

var sIB="<EM>|<STRONG>|<EM><STRONG>|<STRONG><EM>";
var fIB="</EM>|</STRONG>|</EM></STRONG>|</STRONG></EM>";
var aIB="<EM>|<STRONG>|<EM><STRONG>|<STRONG><EM>|</EM>|</STRONG>|</EM></STRONG>|</STRONG></EM>";

function Run() {

 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

// if (PromptSnoska) {                                                                     // отключаю касательство к сноскам
//  Snoska=AskYesNo("    	      –=Jürgen Script=–\n\n	Обращать внимание [на] сноски?  		   \n");
// }

  var Ts=new Date().getTime();
  var TimeStr=0;

//~~~~~~~~~~ Регулярные выражения ~~~~~~~~~~~~

// замена неразрывных пробелов на обычные
 var re01 = new RegExp("([А-Яа-яa-zё—]("+aIB+"){0,1}[\\\?!\\\.,:]{0,1})"+nbspEntity+"(("+sIB+"){0,1}[а-яa-zё])([^\\\.])","g");
 var re01_ = "$1 $3$5";
 var count_01 = 0;

// удаление точки между строчными после пробела, чтобы не цеплялись url'ы — латиница только до
 var re30 = new RegExp("([а-яё])\\\s\\\.([а-яё])","g");
 var re30_ = "$1 $2";
 var count_30 = 0;

// удаление непонятной оторванной точки
 var re02 = new RegExp("(\\\.|,) (\\\.)","gi");
 var re02_ = "$1 ";

// удаление лишнего пробела перед закрывающими кавычками, скобками и знаками препинания
 var re03 = new RegExp("(\\\s|"+nbspEntity+")([\\\.,\\\;\\\:!\\\?\\\)\\\]»])","g");
 var re03_ = "$2";
 var count_03 = 0;

// удаление лишнего пробела после открывающих кавычек и скобок
 var re04 = new RegExp("([«\\\(\\\[„])(\\\s|"+nbspEntity+")","gi");
 var re04_ = "$1";
 var count_04 = 0;

//  удаление пробела перед кавычкой после которой стоит знак препинания
 var re05 = new RegExp("([\\\w0-9А-яЁё!\\\?\\\+\\\.”])(\\\s|"+nbspEntity+")(\\\")([:;,\\\.\\\?!])","gi");
 var re05_ = "$1$3$4";

// замена троеточия и его производных (или знака, например, точка-точка-запятая, которого в русском языке не существует) на многоточие
 var re06 = new RegExp("(\\\.\\\.\\\.|,\\\.\\\.|\\\.,\\\.|\\\.\\\.,)","gi");
 var re06_ = "…";
 var count_06 = 0;

// короткие тире на длинные
 var re07 = new RegExp("([^0123456789])–([^0123456789])","gi");
 var re07_ = "$1—$2";

// лидирующее тире с неразрывным пробелом в диалогах; удаление случайного мусора после скана: точка в начале диалога
 var re08 = new RegExp("^("+sIB+"){0,1}([«\\\"]){0,1}[-–—~]{1,2}("+sIB+"){0,1}(\\\s|"+nbspEntity+"){0,1}\\\.{0,1}("+sIB+"){0,1}([\\\wА-яЁё«\\\"„\\\(\\\?!…])","gi");
 var re08_ = "$1$2—"+nbspChar+"$3$5$6";
 var count_08 = 0;

// нормализация одиночных курсивных знаков препинания
 var re09 = new RegExp("("+sIB+")([\\\s,\\\.\\\-–—;!\\\?:/~])(\\\s|"+nbspEntity+"){0,1}("+fIB+")","gi");
 var re09_ = "$2$3";
 var count_09 = 0;

// денормализация одиночных знаков препинания
 var re09a = new RegExp("("+sIB+")((\\\s|"+nbspEntity+"){0,1}[\\\s\\\-–—](\\\s|"+nbspEntity+"){0,1})("+fIB+")","gi");
 var re09a_ = "$2";
 var count_09 = 0;

// удаление стыков эмфазиса и стронга
 var re10 = new RegExp("</EM>(\\\s|"+nbspEntity+"){0,1}<EM>|</STRONG>(\\\s|"+nbspEntity+"){0,1}<STRONG>","gi");
 var re10_ = "$1";
 var count_10 = 0;

// правильнописание сокращений типа "так далее" — т. д.
 var re11 = new RegExp("([^\\\.а-яё])([Тт])\\\.\\\s{0,1}([д|п|е|к|о|н|ч])\\\.","g");
 var re11_ = "$1$2."+nbspChar+"$3.";
 var count_11 = 0;

// правильнописание сокращений "новой эры" — н. э.
 var re12 = new RegExp("(н)\\\.\\\s{0,1}(э)\\\.","g");
 var re12_ = "$1."+nbspChar+"$2.";

// тире после препинаний
 var re13 = new RegExp("([a-zа-яё\\\"“»\\\)\\\? ])(\\\s|"+nbspEntity+"){0,1}("+aIB+"){0,1}([,!\\\?…])(\\\s|"+nbspEntity+"){0,1}("+aIB+"){0,1}-{1,2}("+aIB+"){0,1}(\\\s|"+nbspEntity+"){0,1}("+sIB+"){0,1}(.[^.])","gi");
 var re13_ = "$1$4$3$6"+nbspChar+"— $7$9$10";
 var count_13 = 0;

// тире после препинаний — (!..) и (?..)
 var re13a = new RegExp("([!\\\?]\\\.\\\.)("+aIB+"){0,1}(\\\s|"+nbspEntity+"){0,1}([\\\-–—]){1,2}("+aIB+"){0,1}(\\\s|"+nbspEntity+"){0,1}("+aIB+"){0,1}(.[^.])","gi");
 var re13a_ = "$1$2$5"+nbspChar+"— $7$8";

// тире после препинаний /!).-/
 var re13b = new RegExp("([!\\\?]\\\")("+aIB+"){0,1}(\\\s|"+nbspEntity+"){0,1}([\\\-–—]){1,2}("+aIB+"){0,1}(\\\s|"+nbspEntity+"){0,1}("+aIB+"){0,1}(.[^.])","gi");
 var re13b_ = "$1$2$5"+nbspChar+"— $7$8";


// тире после препинаний
 var re13c = new RegExp("([!\\\?\\\)])("+aIB+"){0,1}(\\\s|"+nbspEntity+"){0,1}([\\\-–—]){1,2}("+aIB+"){0,1}(\\\s|"+nbspEntity+"){0,1}("+aIB+"){0,1}([А-яё])","gi");
 var re13c_ = "$1$2$5"+nbspChar+"— $7$8";

// замена дефисов на тире не после препинаний
 var re14 = new RegExp("([^\\\.,!\\\?…])(\\\s|"+nbspEntity+")("+aIB+"){0,1}[-–]{1,2}(\\\s|"+nbspEntity+"){0,1}("+aIB+"){0,1}(\\\s|"+nbspEntity+"){0,1}([^\\\d<])","gi");
 var re14_ = "$1$3 — $5$7";
 var count_14 = 0;

// замена дефисов на тире "A": после !..-, с пробелом или без
 var re14a = new RegExp("(!\\\.\\\.)("+aIB+"){0,1}(\\\s|"+nbspEntity+"){0,1}[-–]{1,2}("+aIB+"){0,1}("+sIB+"){0,1}(\\\s|"+nbspEntity+"){0,1}("+sIB+"){0,1}([^\\\d<])","gi");
 var re14a_ = "$1$2$4 — $5$7$8";

// замена дефисов на тире "Б": после букв и точки, с пробелом
 var re14b = new RegExp("([а-яё])(\\\.)("+aIB+"){0,1}(\\\s|"+nbspEntity+")[-–]{1,2}("+aIB+"){0,1}("+sIB+"){0,1}(\\\s|"+nbspEntity+"){0,1}("+sIB+"){0,1}([^\\\d<])","g");
 var re14b_ = "$1$2$3"+nbspChar+"— $5$6$8$9";


// замена дефисов на тире "В": после букв и точки перед буквой без точки
 var re14c = new RegExp("([а-яё])(\\\.)("+aIB+"){0,1}[-–]{1,2}("+aIB+"){0,1}("+sIB+"){0,1}(\\\s|"+nbspEntity+"){0,1}("+sIB+"){0,1}([А-яЁё][^\\\.])","g");
 var re14c_ = "$1$2$3"+nbspChar+"— $4$5$7$8";

// кавычки одиночного символа или небольшого слова
// var re15 = new RegExp("(\\\s|"+nbspEntity+")\\\"(\\\s|"+nbspEntity+"){0,1}([\\\w0-9А-яЁё\\\-]{1,20})(\\\s|"+nbspEntity+"){0,1}\\\"([\\\.,:;\\\?!…]){0,1}(\\\s|"+nbspEntity+")","gi");
// var re15_ = "$1«$3»$5$6";

// дубли препинаний
 var re16 = new RegExp(",[\\\.,:;]","gi");
 var re16_ = ",";

// попытка вернуть кавычки на место, после пробела
// var re17 = new RegExp("\\\"([\\\w0-9А-яЁё\\\-]{1,20})([^:])(\\\s|"+nbspEntity+")\\\"(\\\s|"+nbspEntity+")","gi");
// var re17_ = "«$1$2»$4";

// замыкающие кавычки в конце строки после пробела
// var re18 = new RegExp("(\\\s|"+nbspEntity+")\\\"$","gi");
// var re18_ = "»";

// замена конечных дефисов на тире !!!Только в стихах!!!
 var re19 = new RegExp("(\\\s|"+nbspEntity+"){0,1}([\\\-–]){1,2}(\\\s|"+nbspEntity+"){0,1}(</((EM)|(STRONG))>){0,1}$","gi");
 var re19_ = nbspChar+"—$4";


// удаление сдвоенных тире
 var re20 = new RegExp("([\\\-–—])(\\\s|"+nbspEntity+"){0,1}([\\\-–—])","gi");
 var re20_ = "$1";

// удаление непонятной запятой после восклицания и вопроса
 var re21 = new RegExp("([!\\\?]),","gi");
 var re21_ = "$1";

// градусы с секундами и минутами  23°8'48"
 var re22 = new RegExp("([0-9]{1,2})°\\\s{0,1}([0-9]{1,2})'\\\s{0,1}([0-9]{1,2})\\\"","gi");
 var re22_ = "$1°$2′$3″";

// градусы с секундами  23°8'
 var re23 = new RegExp("([0-9]{1,2})°\\\s{0,1}([0-9]{1,2})'","gi");
 var re23_ = "$1°$2′";

// удаление сдвоенных открывающих эмфазисов
 var re24 = new RegExp("<EM><EM>","gi");
 var re24_ = "<EM>"

// удаление сдвоенных закрывающих эмфазисов
 var re25 = new RegExp("</EM></EM>","gi");
 var re25_ = "</EM>"

// пропущенный пробел перед тире после букв
 var re26 = new RegExp("([A-zА-яЁё\\\)»:])("+fIB+"){0,1}:("+aIB+"){0,1}—(\\\s|"+nbspEntity+"){0,1}","gi");
 var re26_ = "$1$2 — ";
 var count_26 = 0;

// пропущенный пробел после двоеточия вслед за буквами (почему-то не реагирует на обычные двойные кавычки (\\\")?)
 var re27 = new RegExp("([A-zА-яЁё»])("+aIB+"){0,1}:("+aIB+"){0,1}([A-zА-яЁё„\\\"][^_\\\d])","gi");
 var re27_ = "$1$2: $3$4";

// точка в начале строки
 var re28 = new RegExp("^\\\.(\\\s|"+nbspEntity+"){0,1}([\\\wА-яЁё«\\\"„\\\(\\\?!…])","gi");
 var re28_ = "$2";

// тире вместо дефиса после точки перед Прописной
 var re29 = new RegExp("(\\\.)("+aIB+"){0,1}(\\\s|"+nbspEntity+"){0,1}("+aIB+"){0,1}\\\-("+aIB+"){0,1}(\\\s|"+nbspEntity+")("+sIB+"){0,1}([«„\\\"“]{0,1}[А-ЯЁ])","g");
 var re29_ = "$1$2$4"+nbspChar+"— $5$7$8";
 var count_29 = 0;


// удаление точки/запятой после запятой/точки между строчными
 var re31= new RegExp("([^\\\.][^"+nbspChar+"][А-яЁё»\\\)])("+aIB+"){0,1}([,\\\.])("+aIB+"){0,1}([\\\.,]){0,1}([a-zа-яё][^\\\.])","g");
 var re31_ = "$1$2$4$3 $6";

// удаление точки/запятой после запятой/точки между строчными
// var re31a= new RegExp("([^\\\.][^"+nbspChar+"][а-яё»\\\)])("+aIB+"){0,1}([,\\\.])("+aIB+"){0,1}([\\\.,]){0,1}([A-zА-яЁё][^\\\.])","g");
  var re31a= new RegExp("([^\\\.][^"+nbspChar+"][а-яё»\\\)])("+aIB+"){0,1}([,\\\.])("+aIB+"){0,1}([\\\.,]){0,1}([А-яЁё][^\\\.])","g");  // Отключил A-z, потому что ловится квадратная скобка "]"! Отмена неразрывного пробела не срабатывает.
 var re31a_ = "$1$2$4$3 $6";

// пробел после закрывающих кавычек перед буквами (почему-то не реагирует на обычные двойные кавычки (")?)
 var re32= new RegExp('([a-zа-яё])([\\\?!]){0,1}('+fIB+'){0,1}(»|“|\\\")('+aIB+'){0,1}([a-zа-яё])','gi');
 var re32_ = "$1$2$3$4 $5$6";

// странные закрывающие кавычки
 var re33= new RegExp("``","g");
 var re33_ = "»";

// пробел перед открывающимися кавычками
 var re34= new RegExp("([А-яЁёA-z:,\\\.])«([А-яЁёA-z])","g");
 var re34_ = "$1 «$2";

// пробел перед Прописной после строчной с точкой!?
 var re35= new RegExp("([а-яё])([\\\.\\\?!])("+aIB+"){0,1}([А-ЯЁA-Z])","g");
 var re35_ = "$1$2$3 $4";

// кавычки в начале строки
 var re36= new RegExp("^("+sIB+"){0,1}(.){0,1}»","g");
 var re36_ = "$1«";

// кавычки в конце строки
// var re37= new RegExp("«(.){0,1}("+aIB+"){0,1}$","g");
// var re37_ = "»$1";

// открывающие кавычки после двоеточия
// var re38= new RegExp(": ("+sIB+"){0,1}»","g");
// var re38_ = ": $1«";

// две точки после слова — в многоточие
 var re39= new RegExp("([а-яё])\\\.\\\. ","gi");
 var re39_ = "$1… ";


// квадратное окавычивание порядкового номера в ссылке сноски                       // отключаю касательство к сноскам
// var re40 = new RegExp("(<A class=note href=\\\"[^>]+\\\d{1,4}\\\">)[\\\[{]{0,1}[a-zа-я_\\\-]{0,10}(\\\s|"+nbspEntity+"){0,1}(\\\d{1,4})[\\\]}]{0,1}(</A>)","gi");
// var re40_ = "$1[$3]$4";

// снятие курсива со сноски                       // отключаю касательство к сноскам
// var re41 = new RegExp("(<A class=note href=\\\"[^>]+\\\d{1,4}\\\">[^><]+?</A>)("+fIB+")","gi");
// var re41_ = "$2$1";

// снятие курсива со сноски
// var re42 = new RegExp("("+sIB+")([\\\.\\\s]{0,2}<A class=note [^<]+?</A>)","gi");
// var re42_ = "$2$1";

// удаление пробела после [сноски] , если за пробелом следует препинание                       // отключаю касательство к сноскам
// var re43 = new RegExp("(\\\s|"+nbspEntity+"){0,1}(<A class=note [^<]+?</A>)(\\\s|"+nbspEntity+"){0,1}(([\\\.,;])|([!\\\?:…])){0,1}(\\\s|"+nbspEntity+"){0,1}("+fIB+"){0,1}","gi");
// var re43_ = "$8$4$2$7";
// var re43a_ = "$8 $6$2$5$7";

// удаление пробела перед [сноской]
// var re44 = new RegExp("(\\\s|"+nbspEntity+"){0,1}("+aIB+"){0,1}(\\\s|"+nbspEntity+"){0,1}(<A class=note [^<]+?</A>)","gi");
// var re44_ = "$2$4";

// удаление одного пробела вокруг </emphasis'а>
 var re45 = new RegExp("(\\\s|"+nbspEntity+")("+aIB+")(\\\s|"+nbspEntity+")","gi");
 var re45_ = "$1$2";

// препинания после [сноски] {в конце строки} везде
// var re46 = new RegExp("(<A class=note [^<]+?</A>)([\\\.!\\\?,:;]+("+fIB+"){0,1})","gi");
// var re46_ = "$2$1";

 // препинания после [сноски] в конце строки
// var re46a = new RegExp("(<A class=note href=\\\"[^>]+\\\d{1,4}\\\">[^><]+?</A>)([…]("+fIB+"){0,1})$","gi");
// var re46a_ = "$2$1";

// вставка пробела после [сноски] —                        // отключаю касательство к сноскам
// var re47 = new RegExp("(<A class=note [^<]+?</A>)("+sIB+"){0,1}([А-яЁёA-z\\\-–—\\\(\\\[])","gi");
// var re47_ = "$1 $2$3";
// var count_47 = 0;

 // удаление одного пробела вокруг <emphasis'а>
 var re48 = new RegExp("(\\\s|"+nbspEntity+")("+sIB+")(\\\s|"+nbspEntity+")","gi");
 var re48_ = "$2$3";

// снятие курсива со сноски
// var re49 = new RegExp("(<A class=note href=\\\"[^>]+\\\d{1,4}\\\">)("+sIB+")([^><]+?)("+fIB+")(</A>)","gi");
// var re49_ = "$1$3$5";



// пронумерованный/литерный список
 var re50 = new RegExp("^(("+sIB+"){0,1}[«\\\"]{0,1}(\\\d{1,3}|[a-zа-я])[\\\.\\\)]("+aIB+"){0,1})[\\\s| ]{0,1}(("+sIB+"){0,1}[А-яA-z—…\\\"«])","g");
 var re50_ = "$1"+nbspChar+"$5";
 var count_50 = 0;

// пронумерованный список: Ст. 15
 var re50a = new RegExp("^(("+sIB+"){0,1}([«\\\"]){0,1}(Ст)\\\.)(\\\s|"+nbspEntity+"){0,1}(\\\d{1,4})\\\.\\\s","g");
 var re50a_ = "$1"+nbspChar+"$6."+nbspChar;

// пронумерованный список: •
 var re50b = new RegExp("^("+sIB+"){0,1}(•)\\\s","g");
 var re50b_ = "$1$2"+nbspChar;

// перечень страниц и т.п. через запятую
 var re51 = new RegExp("(с|р|т|v|p)\\\.(\\\s|"+nbspEntity+"){0,1}(\\\d{1,4}),(\\\d{1,4})","gi");
 var re51_ = "$1."+nbspChar+"$3, $4";
 var count_51 = 0;

// перечень страниц и т.п. с интевалом
 var re52 = new RegExp(" (с|р|т|v|p)\\\.(\\\s|"+nbspEntity+"){0,1}(\\\d{1,4})-(\\\d{1,4})","gi");
 var re52_ = " $1."+nbspChar+"$3–$4";

// размерности
 var re53 = new RegExp("([^\\\-][IVX\\\d])(\\\s{0,1})("+sIB+"){0,1}(([ч|м|г|т|%])|(кг|см|км|гг|вв|в\\\.|мг|мл|вт|га)|(тыс|млн|час|мин|сек|чел|мкг|квт|руб|коп|экз)|(ккал|град|млрд))(\\\.{0,1})([^а-я\\\w])","g");
 var re53_ = "$1"+nbspChar+"$3$4$9$10";
 var count_53 = 0;

 // отбивка на полугегельную от цифр (неразрывный пробел) знаков параграфа, номера
 var re54 = new RegExp("([№§]) {0,1}(\\\d)","gi");
// var re54_ = "$1 $2";                                                 // "правильный" узкий пробел, отображется малым кол-вом шрифтов
 var re54_ = "$1"+nbspChar+"$2";                                                     // неразрывный пробел

// длинное тире после препинаний
 var re55 = new RegExp("([a-zа-яё\\\"“»\\\)\\\? ])("+aIB+"){0,1}([,!\\\?…\\\.\\\"]+)("+aIB+"){0,1}\\\s{0,1}—{1,2}(\\\s|"+nbspEntity+"){0,1}(.[^.])","gi");
 var re55_ = "$1$2$3$4"+nbspChar+"— $6";
 var count_55 = 0;

// длинное тире после препинаний и неразрывного пробела
 var re55a = new RegExp("([a-zа-яё\\\"“»\\\)\\\? ])("+aIB+"){0,1}([,!\\\?…\\\.]+)("+aIB+"){0,1}("+nbspEntity+")—{1,2}(.[^.])","gi");
 var re55a_ = "$1$2$3$4"+nbspChar+"— $6";

// длинное тире после букв и неразрывного пробела
 var re55b = new RegExp("([a-zа-яё\\\"“»])("+aIB+"){0,1}("+nbspEntity+")—{1,2}(.[^.])","gi");
 var re55b_ = "$1$2 — $4";

// удаление стыков эмфазиса
 var re56 = new RegExp("</EM>((\\\s|"+nbspEntity+"){0,1}[–—\\\.,;:!\\\?]{0,1}(\\\s|"+nbspEntity+"){0,1})<EM>","gi");
 var re56_ = "$1";

// тире вместо дефиса после точки перед открывающимися угловыми кавычками
 var re57 = new RegExp("(\\\.)(\\\s|"+nbspEntity+"){0,1}\\\-("+aIB+"){0,1}(\\\s|"+nbspEntity+"){0,1}("+sIB+"){0,1}([«„\\\"])","g");
 var re57_ = "$1$3"+nbspChar+"— $5$6";

// пропущенный пробел после тире после букв и перед буквами
 var re58 = new RegExp("([A-zА-яЁё\\\)\\\"»])("+fIB+"){0,1}(\\\s|"+nbspEntity+")("+fIB+"){0,1}—("+fIB+"){0,1}("+sIB+"){0,1}([A-zА-яЁё\\\(«])","gi");
 var re58_ = "$1$2$4 — $5$6$7";

// пропущенные пробелы вокруг тире между буквами                                              NEW
 var re59 = new RegExp("([A-zА-яЁё\\\)\\\"»])—([A-zА-яЁё\\\(«])","gi");
 var re59_ = "$1 — $2";

//  последовательность чисел
// var re59 = new RegExp("([123]{0,1}[3-8][257]\\\]{0,1}</a>)(\\\.|,|;) ","gi");
// var re59_ = '$1<a href="http://reeed.ru/">$2</a> ';

// интервал дат !!! Остались стрёмные моменты с длинным набором чисел, вроде почтового индекса или серийного номера
 var re60 = new RegExp("([^\\\-0-9№N\\\wА-я\\\)\\\/])(\\\d{4})(\\\s|"+nbspEntity+"){0,1}[-–—]{1,2}(\\\s|"+nbspEntity+"){0,1}(\\\d{4})([^a-zа-я0-9\\\-])","gi");
 var re60_ = "$1$2–$5$6";
// var count_60 = 0;

// интервал дат в отдельной строке
 var re60a = new RegExp("^(\\\d{4})(\\\s|"+nbspEntity+"){0,1}[-–—]{1,2}(\\\s|"+nbspEntity+"){0,1}(\\\d{4})","gi");
 var re60a_ = "$1–$4";

// интервал дат в начале абзаца
 var re61 = new RegExp("^(\\\d{4})(\\\s|"+nbspEntity+"){0,1}[-–—]{1,2}(\\\s|"+nbspEntity+"){0,1}(\\\d{4})([^a-zа-я0-9\\\-])","gi");
 var re61_ = "$1–$4$5";

// интервал дат
 var re62 = new RegExp("([^\\\-0-9№N\\\wА-я\\\)\\\/])(\\\d{3})(\\\s|"+nbspEntity+"){0,1}[-–—]{1,2}(\\\s|"+nbspEntity+"){0,1}(\\\d{3})([^a-zа-я0-9\\\-])","gi");
 var re62_ = "$1$2–$5$6"; 

// интервал дат
 var re63 = new RegExp("([^\\\-0-9№N\\\wА-я\\\)\\\/])(\\\d{2})(\\\s|"+nbspEntity+"){0,1}[-–—]{1,2}(\\\s|"+nbspEntity+"){0,1}(\\\d{2})([^a-zа-я0-9\\\-])","gi");
 var re63_ = "$1$2–$5$6"; 

// интервал дат
 var re64 = new RegExp("([^\\\-0-9№N\\\wА-я\\\)\\\/])(\\\d)(\\\s|"+nbspEntity+"){0,1}[-–—]{1,2}(\\\s|"+nbspEntity+"){0,1}(\\\d)([^a-zа-я0-9\\\-])","gi");
 var re64_ = "$1$2–$5$6"; 

//  знак градуса
 var re65 = new RegExp("(\\\d{1,2})([oо])(\\\d{1,2})","g");
 var re65_ = "$1°$3";

//  знак K°
// var re66 = new RegExp("([и&])(\\\s|"+nbspEntity+"){0,1}([KК])([oо°])([^A-zА-яЁё])","g");
// var re66_ = "$1 K°$5";

//  градус Цельсия
 var re67 = new RegExp("(\\\d)(\\\s|"+nbspEntity+"){0,1}[oо0°](\\\s){0,1}[CС]([^A-zА-яЁё]){0,1}","g");
 var re67_ = "$1"+nbspChar+"°C$4";

//  даты по-римски
 var re68 = new RegExp("([IVXLC])(\\\s|"+nbspEntity+"){0,1}[\\\-–—](\\\s|"+nbspEntity+"){0,1}([IVXLC])","g");
 var re68_ = "$1–$4";

//  знак №
 var re69 = new RegExp("N[oо°](\\\s|"+nbspEntity+"){0,1}(\\\d+)","g");
 var re69_ = "№"+nbspChar+"$2";

//  Рисунок №1
 var re70 = new RegExp("(рис)\\\.\\\s{0,1}(\\\d+)","gi");
 var re70_ = "$1."+nbspChar+"$2";

//  десятичные дроби
// var re71 = new RegExp("(,|;)(<A class=note href=\\\"[^>]+\\\d{1,4}\\\">\\\[{0,1}[3579][48]\\\]{0,1}</A> )","gi");
// var re71_ = '<a href="http://reeed.ru/">$1</a>$2';

// лишние пробелы (везде, кроме стихов и кода)
 var re80 = new RegExp("(\\\s|"+nbspEntity+"){2,}","g");
 var re80_ = "$1";
// var count_80 = 0;

// удаление конечных пробелов строки
 var re81 = new RegExp("(\\\s|"+nbspEntity+")+("+aIB+"){0,1}$","gi");
 var re81_ = "";
 var count_81 = 0;

// удаление начальных пробелов строки, кроме стихов
 var re82 = new RegExp("^("+sIB+"){0,1}(\\\s|"+nbspEntity+")+","gi");
 var re82_ = "$1";
 var count_82 = 0;

// удаление мягкого переноса
 var re83 = new RegExp("(­|&shy;)","gi");
 var re83_ = "";
 var count_83 = 0;

// удаление лишних конечных точек в заголовках
 var re84 = new RegExp("\\\.("+fIB+"){0,1}$","g");
 var re84ex = new RegExp("(([0-9](\\\s|"+nbspEntity+")г{1,2})|([IVX](\\\s|"+nbspEntity+")в{1,2})|(\\\-мл))\\\.("+fIB+"){0,1}$","g");
 var re84_ = "";
 var count_84 = 0;

 // пропущенный пробел перед строчной после строчной и запятой, точки с запятой
 var re85= new RegExp("([а-яё0-9])([,;])([а-яё]{3,})","g");
 var re85_ = "$1$2 $3";

 // неверный знак препинания
 var re86= new RegExp("!…","g");
 var re86_ = "!..";

 // неверный знак препинания
// var re87= new RegExp("…[\\\.,]([^\\\.,])","g");
// var re87_ = "…$1";

// удаление ненужных идентификаторов после конвертации: AutBody_0DocRoot, …fb1, …ole_link2, …toc3, …0prim, …Q__4_Q и т.п.
 var re90 = new RegExp("AutBody_.+?","g");
 var count_90 = 0;

// удаление мусора.
 var re91= new RegExp("■","g");
 var re91_ = "";

 var re91a= new RegExp("\\\.;\\\.$","g");
 var re91a_ = ".";

 var re91b= new RegExp("^([^•]+)•","g");
 var re91b_ = "$1";

 var re91c= new RegExp("■","g");
 var re91c_ = "";

//~~~~~~~~~~~~~~ Конец шаблонов ~~~~~~~~~~~~~~~~~~


 var id;
 var s="";

 // функция, обрабатывающая абзац P
 function HandleP(ptr) {

       if (ptr.getAttribute("id").search(re90)>=0) { ptr.removeAttribute("id"); count_90++; } 


  s=ptr.innerHTML;

       if (s.search(re01)!=-1)         { s=s.replace(re01, re01_); count_01++}
       if (s.search(re30)!=-1)         { s=s.replace(re30, re30_); count_30++}
       if (s.search(re86)!=-1)         { s=s.replace(re86, re86_); }
  //   if (s.search(re87)!=-1)         { s=s.replace(re87, re87_); }

       if (s.search(re02)!=-1)         { s=s.replace(re02, re02_); }
       if (s.search(re03)!=-1)         { s=s.replace(re03, re03_); count_03++}
       if (s.search(re04)!=-1)         { s=s.replace(re04, re04_); count_04++}
       if (s.search(re05)!=-1)         { s=s.replace(re05, re05_); }
       if (s.search(re06)!=-1)         { s=s.replace(re06, re06_); count_06++}
       if (s.search(re07)!=-1)         { s=s.replace(re07, re07_); }
       if (s.search(re08)!=-1)         { s=s.replace(re08, re08_); count_08++}
       if (s.search(re09)!=-1)         { s=s.replace(re09, re09_); count_09++}
       if (s.search(re09a)!=-1)         { s=s.replace(re09a, re09a_); count_09++}

       if (s.search(re10)!=-1)         { s=s.replace(re10, re10_); count_10++}
       if (s.search(re11)!=-1)         { s=s.replace(re11, re11_); count_11++}
       if (s.search(re12)!=-1)         { s=s.replace(re12, re12_); }
       if (s.search(re13)!=-1)         { s=s.replace(re13, re13_); count_13++}
       if (s.search(re13a)!=-1)       { s=s.replace(re13a, re13a_); }
       if (s.search(re13b)!=-1)       { s=s.replace(re13b, re13b_); }
       if (s.search(re13c)!=-1)       { s=s.replace(re13c, re13c_); }
	   if (s.search(re14)!=-1)         { s=s.replace(re14, re14_); count_14++}
       if (s.search(re14a)!=-1)       { s=s.replace(re14a, re14a_); count_14++}
       if (s.search(re14b)!=-1)       { s=s.replace(re14b, re14b_); count_14++}
       if (s.search(re14c)!=-1)       { s=s.replace(re14c, re14c_); }
//       if (s.search(re15)!=-1)         { s=s.replace(re15, re15_); }
       if (s.search(re16)!=-1)         { s=s.replace(re16, re16_); }
//       if (s.search(re17)!=-1)         { s=s.replace(re17, re17_); }
//       if (s.search(re18)!=-1)         { s=s.replace(re18, re18_); }
       if (s.search(re19)!=-1 && ptr.parentNode.className=="stanza")         { s=s.replace(re19, re19_); }

       if (s.search(re20)!=-1)         { s=s.replace(re20, re20_); }
       if (s.search(re21)!=-1)         { s=s.replace(re21, re21_); }
       if (s.search(re22)!=-1)         { s=s.replace(re22, re22_); }
       if (s.search(re23)!=-1)         { s=s.replace(re23, re23_); }
       if (s.search(re24)!=-1)         { s=s.replace(re24, re24_); }
       if (s.search(re25)!=-1)         { s=s.replace(re25, re25_); }
       if (s.search(re26)!=-1)         { s=s.replace(re26, re26_); count_26++}
       if (s.search(re27)!=-1)         { s=s.replace(re27, re27_); count_26++}
       if (s.search(re28)!=-1)         { s=s.replace(re28, re28_); }
       if (s.search(re29)!=-1)         { s=s.replace(re29, re29_); count_29++}

       if (s.search(re31)!=-1)         { s=s.replace(re31, re31_); }
       if (s.search(re31a)!=-1)         { s=s.replace(re31a, re31a_); }
       if (s.search(re32)!=-1)         { s=s.replace(re32, re32_); count_26++}
       if (s.search(re33)!=-1)         { s=s.replace(re33, re33_); }
       if (s.search(re34)!=-1)         { s=s.replace(re34, re34_); }
       if (s.search(re35)!=-1)         { s=s.replace(re35, re35_); }
       if (s.search(re36)!=-1)         { s=s.replace(re36, re36_); }
//       if (s.search(re37)!=-1)         { s=s.replace(re37, re37_); }
//       if (s.search(re38)!=-1)         { s=s.replace(re38, re38_); }
       if (s.search(re39)!=-1)         { s=s.replace(re39, re39_); }

//       if (s.search(re40)!=-1 && Snoska)         { s=s.replace(re40, re40_); }                       // отключаю касательство к сноскам
//       if (s.search(re41)!=-1)         { s=s.replace(re41, re41_); }                                        // отключаю касательство к сноскам
//       if (s.search(re42)!=-1)         { s=s.replace(re42, re42_); }
//       if (s.search(re43)!=-1 && Snoska)         { s=s.replace(re43, re43_); }                       // отключаю касательство к сноскам
//       if (s.search(re43)!=-1 && !Snoska)         { s=s.replace(re43, re43a_); }                    // отключаю касательство к сноскам
//       if (s.search(re44)!=-1)         { s=s.replace(re44, re44_); }
       if (s.search(re45)!=-1)         { s=s.replace(re45, re45_); }
//       if (s.search(re46)!=-1 && Snoska)         { s=s.replace(re46, re46_); }
//       if (s.search(re46a)!=-1 && Snoska)       { s=s.replace(re46a, re46a_); }
//       if (s.search(re47)!=-1)         { s=s.replace(re47, re47_); count_47++}                       // отключаю касательство к сноскам
       if (s.search(re48)!=-1)         { s=s.replace(re48, re48_); }
//       if (s.search(re49)!=-1)         { s=s.replace(re49, re49_); }

       if (s.search(re50)!=-1)         { s=s.replace(re50, re50_); count_50++}
       if (s.search(re50a)!=-1)       { s=s.replace(re50a, re50a_); count_50++}
       if (s.search(re50b)!=-1)       { s=s.replace(re50b, re50b_); count_50++}
       if (s.search(re51)!=-1)         { s=s.replace(re51, re51_); count_51++}
       if (s.search(re52)!=-1)         { s=s.replace(re52, re52_); count_51++}
       if (s.search(re53)!=-1)         { s=s.replace(re53, re53_); count_53++}
       if (s.search(re54)!=-1)         { s=s.replace(re54, re54_); }
       if (s.search(re55)!=-1)         { s=s.replace(re55, re55_); count_55++}
       if (s.search(re55a)!=-1)       { s=s.replace(re55a, re55a_); }
       if (s.search(re55b)!=-1)       { s=s.replace(re55b, re55b_); }
       if (s.search(re56)!=-1)         { s=s.replace(re56, re56_); count_10++}
       if (s.search(re57)!=-1)         { s=s.replace(re57, re57_); count_55++}
       if (s.search(re58)!=-1)         { s=s.replace(re58, re58_); count_26++}
       if (s.search(re59)!=-1)         { s=s.replace(re59, re59_); }
       if (s.search(re60)!=-1)         { s=s.replace(re60, re60_); }
       if (s.search(re60a)!=-1)       { s=s.replace(re60a, re60a_); }
       if (s.search(re61)!=-1)         { s=s.replace(re61, re61_); }
       if (s.search(re62)!=-1)         { s=s.replace(re62, re62_); }
       if (s.search(re63)!=-1)         { s=s.replace(re63, re63_); }
       if (s.search(re64)!=-1)         { s=s.replace(re64, re64_); }
       if (s.search(re65)!=-1)         { s=s.replace(re65, re65_); }
//       if (s.search(re66)!=-1)         { s=s.replace(re66, re66_); }                        // и компания Ко
       if (s.search(re67)!=-1)         { s=s.replace(re67, re67_); }
       if (s.search(re68)!=-1)         { s=s.replace(re68, re68_); }
       if (s.search(re69)!=-1)         { s=s.replace(re69, re69_); }
       if (s.search(re70)!=-1)         { s=s.replace(re70, re70_); }
//       if (s.search(re71)!=-1 && Snoska)         { s=s.replace(re71, re71_); }
       if (s.search(re80)!=-1 && ptr.parentNode.className!="code" && ptr.parentNode.className!="stanza")         { s=s.replace(re80, re80_);}
       if (s.search(re81)!=-1)         { s=s.replace(re81, re81_); count_81++}
       if (s.search(re82)!=-1 && ptr.parentNode.className!="stanza")         { s=s.replace(re82, re82_); count_82++}
       if (s.search(re83)!=-1)         { s=s.replace(re83, re83_); count_83++}
       if (s.search(re84)!=-1 && s.search(re84ex)==-1 && ptr.parentNode.className=="title")         { s=s.replace(re84, re84_); count_84++}
       if (s.search(re85)!=-1)         { s=s.replace(re85, re85_); count_26++}

       if (s.search(re91)!=-1)         { s=s.replace(re91, re91_); }
       if (s.search(re91a)!=-1)       { s=s.replace(re91a, re91a_); }
       if (s.search(re91b)!=-1)       { s=s.replace(re91b, re91b_); }
       if (s.search(re91c)!=-1)       { s=s.replace(re91c, re91c_); }

   ptr.innerHTML=s;      
  } 

    window.external.BeginUndoUnit(document,"«Генеральная уборка»");                               // ОТКАТ (UNDO) начало

 var body=document.getElementById("fbw_body");
 var ptr=body;
 var ProcessingEnding=false;
 while (!ProcessingEnding && ptr) {
  SaveNext=ptr;
  if (SaveNext.firstChild!=null && SaveNext.nodeName!="P" && 
      !(SaveNext.nodeName=="DIV" && 
        ((SaveNext.className=="history" && !ObrabotkaHistory) || 
         (SaveNext.className=="annotation" && !ObrabotkaAnnotation))))
  {    SaveNext=SaveNext.firstChild; }                                                         // либо углубляемся...

  else {
    while (SaveNext.nextSibling==null)  {
     SaveNext=SaveNext.parentNode;                                                           // ...либо поднимаемся (если уже сходили вглубь)
                                                                                                                // поднявшись до элемента P, не забудем поменять флаг
     if (SaveNext==body) {ProcessingEnding=true;}
                                                         }
   SaveNext=SaveNext.nextSibling; //и переходим на соседний элемент
         }
  if (ptr.nodeName=="P") HandleP(ptr);
  ptr=SaveNext;
 }

    window.external.EndUndoUnit(document);                                             // undo конец

var Tf=new Date().getTime();
var Thour = Math.floor((Tf-Ts)/3600000);
var Tmin  = Math.floor((Tf-Ts)/60000-Thour*60);
var Tsec = Math.ceil((Tf-Ts)/1000-Tmin*60-Thour*3600);
var Tsec1 = Math.ceil(10*((Tf-Ts)/1000-Tmin*60))/10;
var Tsec2 = Math.ceil(100*((Tf-Ts)/1000-Tmin*60))/100;
var Tsec3 = Math.ceil(1000*((Tf-Ts)/1000-Tmin*60))/1000;

           if (Tsec3<1 && Tmin<1)    TimeStr=Tsec3+ " сек"
 else { if (Tsec2<10 && Tmin<1)   TimeStr=Tsec2+ " сек"
 else { if (Tsec1<30 && Tmin<1)   TimeStr=Tsec1+ " сек"
 else { if (Tmin<1)                       TimeStr=Tsec+ " сек" 
 else { if (Tmin>=1 && Thour<1)   TimeStr=Tmin+ " мин " +Tsec+ " с"
 else { if (Thour>=1)                    TimeStr=Thour+ " ч " +Tmin+ " мин " +Tsec+ " с" }}}}}

// вывод статистики, если она, конечно, есть
 var st2="";

// без тире в диалогах 08 и дублей пробелов 80
 if (count_01!=0 || count_03!=0 || count_04!=0 || count_06!=0 || count_09!=0  || count_10!=0 || count_11!=0 || count_13!=0 || count_14!=0 || count_26!=0 || count_29!=0 || count_30!=0 || count_50!=0 || count_51!=0 || count_53!=0 || count_55!=0 || count_81!=0 || count_82!=0 || count_83!=0 || count_84!=0 || count_90!=0)   {st2+='\n Статистика'}


 if (count_01!=0)   {st2+='\n• неразрывный пробел на обычный:	'+count_01;}

 if (count_03!=0)   {st2+='\n• пробел перед закрывающими:	'+count_03;}
 if (count_04!=0)   {st2+='\n• пробел после открывающих:	'+count_04;}
 if (count_06!=0)   {st2+='\n• троеточие на многоточие:		'+count_06;}
// if (count_08!=0)   {st2+='\n• лидирующее тире в диалогах:	'+count_08;}
 if (count_09!=0)   {st2+='\n• курсивные знаки препинания:	'+count_09;}

 if (count_10!=0)   {st2+='\n• стык эмфазисов:            	 	'+count_10;}
 if (count_11!=0)   {st2+='\n• так далее и т.п.:             		'+count_11;}
 if (count_13!=0)   {st2+='\n• дефис после знаков препинания:	'+count_13;}
 if (count_14!=0)   {st2+='\n• замена дефисов на тире:   	'+count_14;}

 if (count_26!=0)   {st2+='\n• пропущенный пробел :  		'+count_26;}
 if (count_29!=0)   {st2+='\n• тире вместо дефиса после точки: 	'+count_29;}
 if (count_30!=0)   {st2+='\n• точки в строчных после пробела:	'+count_30;}

// if (count_47!=0)   {st2+='\n• пробел после сноски:  		'+count_47;}                       // отключаю касательство к сноскам

 if (count_50!=0)   {st2+='\n• пронумерованный список:  	'+count_50;}
 if (count_51!=0)   {st2+='\n• номера страниц:    		'+count_51;}

 if (count_53!=0)   {st2+='\n• размерности:     			'+count_53;}
 if (count_55!=0)   {st2+='\n• тире после препинаний:  		'+count_55;}

// if (count_60!=0)   {st2+='\n• интервал дат:  			'+count_60;}

// if (count_80!=0)   {st2+='\n• дублированные пробелы:   	'+count_80;}
 if (count_81!=0)   {st2+='\n• конечный пробел параграфа: 	'+count_81;}
 if (count_82!=0)   {st2+='\n• начальный пробел абзаца:   	'+count_82;}
 if (count_83!=0)   {st2+='\n• мягкие переносы:      		'+count_83;}
 if (count_84!=0)   {st2+='\n• конечные точки в заголовках: 	'+count_84;}

 if (count_90!=0)   {st2+='\n• лишние идентификаторы:  	'+count_90;}

 if (st2!="") st2="\n"+st2;

 MsgBox ('                  –= Jurgen Script =– \n'+
        ' «Генеральная уборка» v.'+VersionNumber+' Golma Edition       \n\n'+

        ' Время: ' +TimeStr+'.'+st2); 


} 