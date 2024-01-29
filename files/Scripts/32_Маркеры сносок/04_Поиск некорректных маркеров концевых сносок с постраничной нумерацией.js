// Поиск некорректных маркеров постраничных сносок (тексты сносок в конце книги) v.1.0
// Находит ошибки нумерации:
// постраничных сносок с постраничной нумерацией (тексты сносок в конце книги);
// поглавных сносок с постраничной нумерацией(тексты сносок в конце книги);
// Автор stokber

function Run() {

// Вывод кода или текста документа.
var sel=document.getElementById("fbw_body");
var fromHTML = sel.innerHTML;  // код документа
var fromText = sel.innerText; // текст документа
var report = fromHTML;
var count;
var marker;
var re;
var res;
var dlina;
var page;
var result;
var otkrSk;
var zakrSk;
var reportOdnoiStrokoi;
var vsegoNote;
var pageZ;
var pageT;

// окно выбора вида маркеров сносок:
 var dialogWidth="320px";
 var dialogHeight;
  // проверка версии IE: 
var isIE6 = false;
if (navigator.appName === 'Microsoft Internet Explorer') {
  var userAgent = navigator.userAgent;
  if (userAgent.indexOf('MSIE 6.0') !== -1) {
    isIE6 = true;
  }
}
if (isIE6) {
  // alert('Используется Internet Explorer 6');
  dialogHeight="250px";
} else {
  // alert('Используется другая версия Internet Explorer или другой браузер');
  dialogHeight="215px";
}

 var fbwBody=document.getElementById("fbw_body");
 var coll=new Object();
 coll["fbwBody"]=fbwBody;
 coll["mainDocument"]=document;
 coll["window"]=window;
 // coll["versionNum"]=listMarker_versionNum;
 var markSign=window.showModalDialog("HTML/Поиск некорректных маркеров сносок - выбор из вариантов.htm",coll,
     "dialogHeight: "+dialogHeight+"; dialogWidth: "+dialogWidth+"; "+
     "center: Yes; help: No; resizable: Yes; status: No;");
if (!markSign) return;

 report = report.replace(/[☺☻]/g, "?"); // заменяем не знамо откуда вдруг могущие появиться символы ☺ и ☻, которые мы планируем использовать в дальнейшем в качестве временных меток.

/*  // Проверяем случайное наличие в документе символов ☺ и ☻, которые 
// будут использоваться скриптом как временные метки маркеров сносок 
// в  переменной report: 
var Metk = (report.match(/☺|☻/g) || []).length;
if (Metk > 0) {
window.clipboardData.setData("text","[☻☺]+");
alert("В вашем документе имеются символ(ы) ☺ и(ли) ☻, которые используются скриптом как временные метки. Для корректной работы рекомендуем на время работы скрипта заменить их на другие символы.\nНайти в документе их можно перейдя в режим Кода и вставив регулярное выражение из буфера обмена в строку поиска окна Найти (Ctrl+F)")
return true;
} */

// выполнение скрипта в зависимости от выбранных маркеров:
if (markSign == "надстрочным текстом") {
FMarkSup() ; // приводим маркеры к общему типу.
Report() ; // составляем постраничный список маркеров и преобразуем текст документа.
RegExPostrPostr() ; // ищем ошибки.
if (re == undefined) {return true} // если ошибок нет — выходим, или
else //
PosAndLengthMarkSup() ; // вычисляем позицию и длину совпадения.
PerehodFinal() ; // переходим и выделяем.
}

else if (markSign == "вида *") {
FMarkAsteriks() ;
Report() ;
RegExPostrPostr() ;
if (re == undefined) {return true}
else
PosAndLengthMarkAsteriks() ;
PerehodFinal() ;
}

else if (markSign == "вида [1]") {
FMarkKvSk() ;
Report() ;
RegExPostrPostr() ;
if (re == undefined) {return true}
else
PosAndLengthMarkKvSk() ;
PerehodFinal() ;
}

else if (markSign == "вида {1}") {
FMarkFigSk() ;
Report() ;
RegExPostrPostr() ;
if (re == undefined) {return true}
else
PosAndLengthMarkFigSk() ;
PerehodFinal() ;
}

else if (markSign == "вида [~1~]") {
FMarkKvSkTilde() ;
Report() ;
RegExPostrPostr() ;
if (re == undefined) {return true}
else
PosAndLengthMarkKvSkTilde() ;
PerehodFinal() ;
}

if (markSign == "вида {~1~}") {
FMarkFigSkTilde() ;
Report() ;
RegExPostrPostr() ;
if (re == undefined) {return true}
else
PosAndLengthMarkFigSkTilde() ;
PerehodFinal() ;
}

// преобразуем текст документа  в зависимости от выбранных меток:
function FMarkSup() {
marker = "ЧИСЛАМИ НАДСТРОЧНЫМ ТЕКСТОМ" // фрагмент текста для сообщения о результатах поиска.
   // report = fromHTML;
   report = report.replace(/<SUP>/ig, "☺"); //подменяем теги SUP на метки
report = report.replace(/<\/SUP>/ig, "☻"); 

   report = report.replace(/[¹²³⁴⁵⁶⁷⁸⁹⁰]+/g, "☺$&☻"); //подменяем символы цифр надстрочным  текстом на цифры.
   report = report.replace(/¹/g, "1"); //
   report = report.replace(/²/g, "2"); //
   report = report.replace(/³/g, "3"); //
   report = report.replace(/⁴/g, "4"); //
   report = report.replace(/⁵/g, "5"); //
   report = report.replace(/⁶/g, "6"); //
   report = report.replace(/⁷/g, "7"); //
   report = report.replace(/⁸/g, "8"); //
   report = report.replace(/⁹/g, "9"); //
   report = report.replace(/⁰/g, "0"); //
}

function FMarkAsteriks() {
// (звездочек — не более двенадцати в одном маркере)
   marker = "ЗВЁЗДОЧКАМИ";
   // report = fromHTML;
   report = report.replace(/<\/?(STRONG|EM|SUP|STRIKE|CODE)>/ig, ""); 
   report = report.replace(/<SPAN class=code>(.+?)<\/SPAN>/ig, "$1"); // 
   report = report.replace(/&nbsp;(&nbsp;| |\*)/g, " $1"); // 
   report = report.replace(/(&nbsp;| |\*)&nbsp;/g, "$1 "); // 
   report = report.replace(/[ □▫◦]/g, " "); // 
      for (; countAst != 0;) { // заменяем звездочки в пустых строках другими символами (@).
         var ast = new RegExp("^((?:<\\/?[^>]+>)*)([ @]*)([*])([ *]*)((?:<\\/?[^>]+>)*)$","gm");
         var ast_ = "$1$2@$4$5";
         var countAst = 0;
             if (report.search(ast)!=-1)         { report=report.replace(ast, ast_); countAst++}
}

   report = report.replace(/\*+/g, "☺$&☻"); //обрамляем звёздочки метками.
   report = report.replace(/☺[*]{12}☻/g, "☺12☻..........");
   report = report.replace(/☺[*]{11}☻/g, "☺11☻.........");
   report = report.replace(/☺[*]{10}☻/g, "☺10☻........");
   report = report.replace(/☺[*]{9}☻/g, "☺9☻........");
   report = report.replace(/☺[*]{8}☻/g, "☺8☻.......");
   report = report.replace(/☺[*]{7}☻/g, "☺7☻......");
   report = report.replace(/☺[*]{6}☻/g, "☺6☻....."); 
   report = report.replace(/☺[*]{5}☻/g, "☺5☻....");
   report = report.replace(/☺[*]{4}☻/g, "☺4☻...");
   report = report.replace(/☺[*]{3}☻/g, "☺3☻..");
   report = report.replace(/☺[*]{2}☻/g, "☺2☻.");
   report = report.replace(/☺[*]{1}☻/g, "☺1☻");
}

function FMarkKvSk() {
   marker = "В ВИДЕ СКОБОК [1]";
   report = report.replace(/<\/?(STRONG|EM|SUP|SUB|STRIKE)>/ig, ""); 
   report = report.replace(/<SPAN class=code>(.+?)<\/SPAN>/ig, "$1"); // !!!
   report = report.replace(/(<A class=note [^<]+?>)\[(\d+)\](<\/A>)/ig, "$1($2)$3"); //  !!!
   report = report.replace(/\[/g, "☺");
   report = report.replace(/\]/g, "☻");
   report = report.replace(/(<A class=note [^<]+?>)\((\d+)\)(<\/A>)/ig, "$1[$2]$3"); //  !!!
}

 function FMarkFigSk() {
   marker = "В ВИДЕ СКОБОК {1}";
   report = report.replace(/<\/?(STRONG|EM|SUP|SUB|STRIKE)>/ig, ""); 
   report = report.replace(/<SPAN class=code>(.+?)<\/SPAN>/ig, "$1"); //  !!!
   report = report.replace(/(<A href=[^<]+?>)\{(\d+)\}(<\/A>)/ig, "$1($2)$3"); //  !!!
   report = report.replace(/\{/g, "☺");
   report = report.replace(/\}/g, "☻");
   report = report.replace(/(<A href=[^<]+?>)\((\d+)\)(<\/A>)/ig, "$1{$2}$3"); //  !!!
   report = report.replace( /☻☺/mg, "☻ ☺") ; // чтобы были видны два маркера знака сносок подряд без пробелов между. 17.09.2022. !?!?!?!?
}

function FMarkKvSkTilde() {
   marker = "В ВИДЕ СКОБОК [~1~]";
   report = report.replace(/\[~/g, "☺");
   report = report.replace(/\~]/g, "☻");
}

 function FMarkFigSkTilde() {
   marker = "В ВИДЕ СКОБОК {~1~}";
   report = report.replace(/\{~/g, "☺");
   report = report.replace(/\~}/g, "☻");
}

function Report() {
   txt = report;
   // преобразуем "txt" для более точного позиционирования при наличии в документе 
   // изображений, таблиц и проблемных символов:
   txt = txt.replace(/(<P class=t[dh]>)&nbsp;(<\/P>)/ig, "$1☻☺$2"); // 
   txt = txt.replace(/<P>&nbsp;<\/P>/ig, "<P>☻☺</P>"); // 

   txt = txt.replace(/<\/?(STRONG|EM|SUP|SUB|STRIKETHROUGH|CODE)>/ig, ""); // 
   txt = txt.replace(/<SPAN class=code>(.+?)<\/SPAN>/ig, "$1"); 
   //  нормализуем двойные метки:
   txt = txt.replace(/☻☻/ig, "☻"); // 
   txt = txt.replace(/☺☺/ig, "☺"); // 

txt = txt.replace(/<P class=td><SPAN(( [^>]+)? class=image( [^>]+)?)>(<IMG( [^>]*)?>)<\/SPAN><\/P>/ig, "IM"); // 
txt = txt.replace(/<P class=td><SPAN(( [^>]+)? class=image( [^>]+)?)>(<IMG( [^>]*)?>)<\/SPAN>/ig, "IMG"); // 
txt = txt.replace(/<DIV(( [^>]+)? class=image( [^>]+)?)>(<IMG( [^>]*)?>)<\/DIV>/ig, "IMG"); // 
txt = txt.replace(/<SPAN(( [^>]+)? class=image( [^>]+)?)>(<IMG( [^>]*)?>)<\/SPAN><\/P>/ig, "IM"); // 
txt = txt.replace(/<SPAN(( [^>]+)? class=image( [^>]+)?)>(<IMG( [^>]*)?>)<\/SPAN>/ig, "IMG"); // 
txt = txt.replace(/^((?:IMG)+)\r\n(?=IMG)/igm, "$1"); //
txt = txt.replace(/<\/?[^<>]+>/g, ""); // удаляем все теги
txt = txt.replace(/\r\n(\r\n)+/gm, "\r\n"); //
txt = txt.replace(/☻☺/g, ""); //

txt = txt.replace(/[ □▫◦]/g, " "); // 
txt = txt.replace(/&lt;/g, "<"); // 
txt = txt.replace(/&gt;/g, ">"); // 
txt = txt.replace(/&amp;/g, "&"); // 
txt = txt.replace(/&nbsp;/g, " "); // 
txt = txt.replace(/\r\n/g, "\n");  // 

// alert(txt);

// txt = txt.replace(/(☺)[ztZ](☻)/g, "$1Ъ$2"); //

// alert(txt);

// создаём постраничный список маркеров сносок:


report = report.replace(/&nbsp;/g, " "); // заменяем неразрывные пробелы на обычные.

report = report.replace(/☻([ ]*)☺/g, "$1"); // // два маркера подряд или только с пробелами между считать за один ошибочный.13.09.2023  !?!?!?!?

report = report.replace(/<\/?[^<>]+>/g, ""); // удаляем все теги
report = report.replace(/(\r\n)(\r\n)+/g, "$1"); // удалить пустые строки.


// заменяем все символы "z" и "t", если такие вдруг оказались между метками сносок.
var colZT = 1
for (var i = 0; colZT > 0; i++) { 
var colZT= (report.match(/(☺.+?)[ztZT](.*?☻)/g) || []).length; // 
report = report.replace(/(☺.+?)[ztZT](.*?☻)/g, "$1?$2"); //
}




/* report = report.replace(/(☺.+?)[ztZ](.*?☻)/g, "$1?$2"); //
report = report.replace(/(☺.+?)[ztZ](.*?☻)/g, "$1?$2"); //
report = report.replace(/(☺.+?)[ztZ](.*?☻)/g, "$1?$2"); // */


report = report.replace(/^☺(.+?)☻/mg, "☺t$1☻"); // пометить меткой "t" маркеры текстов сносок.
report = report.replace(/([^\n])☺(.+?)☻/gm, "$1☺z$2☻"); // пометить меткой "z" маркеры знаков сносок.
report = report.replace(/^[^☺☻]+$/gm, ""); // удалить строки без меток.

report = report.replace(/^(☺t\d+☻[^\r\n☺☻]+?☺)z(\d+☻)/gm, "$1Z$2"); // пометить меткой "Z" маркер знака сноски в тексте сноски.
report = report.replace(/^(☺t\d+☻[^☺☻]+?☺)z(\d+☻)/gm, "$1T$2"); // пометить меткой "T" маркер знака сноски в абзацах после текстов сносок.
// убрал \r\n, чтобы были видны МЗС после МТС не только в одном абзаце.
     report = report.replace(/(☺z\d+☻[ ]*☺)z(\d+☻)/gm, "$1Z$2"); // пометить меткой "Z" два знака сноски подряд или через пробел(ы). ?????? 16.09.2023.
      // report = report.replace(/(☺z\d+☻[ ]*☺)z(\d+☻)/gm, "$1T$2"); // пометить меткой "Z" два знака сноски подряд или через пробел(ы). ?????? 16.09.2023

// alert(report);
   report = report.replace(/^[^☺☻]+$/gm, ""); // удалить строки без меток.
   
report = report.replace(/^([ ]+)(☺.+?)☻/gm, "$2$1☻"); // начальные пробелы перед маркерами текстов сносок
// переместить в границы маркеров для лучшей локализации.
report = report.replace(/^(☺.+?)☻[ ]*$/gm, "$1 ☻"); // маркер сноски в пустой строке сделать видимым.
report = report.replace(/(^|☻)[^☺☻]+?(☺|$)/g, "$1$2"); // удалить всё кроме меток и их номеров.
report = report.replace(/[☻☺]/g, ""); // удалить метки тегов бывшего верхнего индекса.
reportOdnoiStrokoi = report;

// alert(reportOdnoiStrokoi);

// report = report.replace(/(t.+?)(z.+?)/gm, "$1\r\n$2"); // делим на строки-"страницы".

report = report.replace(/(t.+?)([z].+?)/gm, "$1\r\n$2"); // делим на строки-"страницы".
report = report.replace(/([z].+?)(t.+?)/gm, "$1\r\n$2"); // делим на строки-"страницы".
report = report.replace(/([zt]1)(?!\d)/gm, "\r\n$1"); // делим на строки-"страницы" для поиска "страниц" с разным количеством маркеров знаков и текстов сносок.

report = report.replace(/^\r\n/m, ""); // удалить верхнюю пустую строку

// alert(report);
// window.clipboardData.setData("text",report);

// подбиваем итоги по списку маркеров:
var z = (report.match(/z/g) || []).length; // маркеров знаков сносок всего.
var t = (report.match(/t/g) || []).length; // маркеров текстов сносок всего.
vsegoNote = (z + t);
// alert(vsegoNote);
page = (report.match(/^.+$/gm) || []).length; // условных "страниц" всего.

pageZ = (report.match(/^[^t\r\n]+$/gm) || []).length; // "страниц" с маркерами знаков сносок.
pageT = (report.match(/^[^z\r\n]+$/gm) || []).length; // "страниц" с маркерами текстов сносок.

// alert("страниц с маркерами знаков сносок: "+pageZ+"\nСтраниц с маркерами текстов сносок: "+pageT);

// MsgBox("Найдено:\nмаркеров знаков сносок: "+z+" \nтекстов сносок : "+t+" \nусловных страниц: "+page+" ");
if (z == 0 && t ==0) {
MsgBox("В этом документе не найдено маркеров сносок "+marker+".");
return;
}
}

// ищем ошибки нумерации маркеров сносок:
function RegExPostrPostr() {

// 1. Более 12-ти звёздочек.
if (markSign == "вида *") {
   var RX = new RegExp("[zZTt][*]{12,}","g");
   result = RX.exec(report);
   if (result !== null) {
      var textMsg = "Курсор (без выделения) остановился на маркере из более чем двенадцати звездочек. Скрипт не работает с маркерами с таким количеством звездочек. Извините." // #1";
// alert("Найдено: \nПозиция: "+result.index+"\nСовпадение: "+result[0]+"\nДлина: "+result.length);
// результат вывести в статусбар:
      window.external.SetStatusBarText(textMsg); 
      result.index += result.length;
      Perehod();
     }
}

// 2. Поиск знака сноски в тексте сноски: // !!!!! 2023.08.20  // перенёс в первую очередь 30.08.2023.
if (result == null) {
   var RX = new RegExp("Z\\d+","");
   // var RX = new RegExp("t\\dZ+",""); // ?????? 24/10/2023
   result = RX.exec(report);
   if (result !== null) {
      var textMsg = "Маркер знака сноски в тексте сноски. Возможно склеенные абзацы или тексты сносок в подбор." // #2";
      window.external.SetStatusBarText(textMsg); 
      result.index += result.length;
      Perehod();
      }
}

 // 2. Поиск знака сноски после маркеров текстов сносок: // только для концевых сносок
if (result == null) {
   var RX = new RegExp("T\\d+","gm");
   // var RX = new RegExp("t\\dZ+","");
   // RX.lastIndex = 1; // ищем с 1-й позиции
   result = RX.exec(report);
   if (result !== null) {
      var textMsg = "Маркер знака сноски после текстов сносок, что не характерно для концевых сносок с постраничной нумерацией." // #3";
      window.external.SetStatusBarText(textMsg); 
      result.index += result.length;
      Perehod();
      }
}

 // 0. Пробел перед маркером текста сноски:
if (result == null) {
var RX = new RegExp("^z\\d+[ ]+","m");
result = RX.exec(report);
if (result !== null) {
var textMsg = "Кажется, в границы маркера попал пробел. Или начальный пробел перед маркером текста сноски. Или два маркера подряд с пробелом/пробелами между ними." // #4";;
// alert("Найдено: \nПозиция: "+result.index+"\nСовпадение: "+result[0]+"\nДлина: "+result.length);
// результат вывести в статусбар:
		window.external.SetStatusBarText(textMsg); 
result.index += result.length;
Perehod();
}
}


 // 1. Поиск знака сноски-не числа:
  if (result == null) {
var RX = new RegExp("z[zt]|z\\d*[^\\dzt\\n\\r]+|z0","m");
result = RX.exec(report);
if (result !== null) {
var textMsg = "Маркер знака сноски — не число. Возможно, в маркер попал пробел. Если выделен маркер текста сноски — возможно (невыделенный скриптом) пробел между началом строки и маркером." // #5";
// alert(Найдено: \nПозиция: "+result.index+"\nСовпадение: "+result[0]+"\nДлина: "+result.length);
// результат вывести в статусбар:
		window.external.SetStatusBarText(textMsg); 
result.index += result.length;
// :
Perehod();
}
}

 // 2. Поиск текста сноски-не числа:
if (result == null) {
var RX = new RegExp("t[zt]|t\\d*[^\\dzt\\r\\n]+|t0","m");
result = RX.exec(report);
if (result !== null) {
var textMsg = "Маркер текста сноски — не число. Возможно, в маркер попал пробел. Как вариант — маркер в пустой строке." // #6";
		window.external.SetStatusBarText(textMsg); 
result.index += result.length;
Perehod();
}
}

 // 3. Пробел перед маркером текста сноски:
if (result == null) {
   var RX = new RegExp("z\\d+[ ]+","m");
   result = RX.exec(report);
   if (result !== null) {
      var textMsg = "Кажется, в границы маркера попал пробел. Или начальный пробел перед маркером текста сноски. Или два маркера подряд с пробелом/пробелами между ними."// #7";
      window.external.SetStatusBarText(textMsg); 
      result.index += result.length;
      Perehod();
      }
}

// 3. Проверка отсутствия самого первого в документе маркера знака сноски:
if (result == null) {
var RX = new RegExp("^z([^1]|1\\d)","");
result = RX.exec(reportOdnoiStrokoi);
if (result !== null) {
var textMsg = "Отсутствует самый первый в документе маркер знака сноски 1. Ищите выше выделенного места." // #8";
		window.external.SetStatusBarText(textMsg); 
result.index += result.length;
Perehod();
// PerehodNaSlSup();
}
}

// 4. Проверка отсутствия самого последнего в документе маркера текста сноски:
if (result == null) {
var RX = new RegExp("(z\\d+)$","m");
result = RX.exec(reportOdnoiStrokoi);
if (result !== null) {
var textMsg = "Самый последний в документе маркер должен быть маркером текста сноски." // #9";
		window.external.SetStatusBarText(textMsg); 
result.index += result.length;
count = vsegoNote;
PerehodNaSlSup();
}
}

// 5. Маркер знака сноски в одном абзаце с маркером текста сноски:
if (result == null) {
var RX = new RegExp("(t\\d+(\\r\\n)*z\\d+)","m");
result = RX.exec(report);
if (result !== null) {
var textMsg = "Маркер текста сноски между маркерами знаков сносок." // #10";
		window.external.SetStatusBarText(textMsg); 
result.index += result.length;
// count = vsegoNote;
Perehod();
}
}

 // 6. Проверка маркера текста сноски 1:
if (result == null) {
// var RX = new RegExp("^(z1)(z\\d+)*t([^1]|1\\d)","m");
var RX = new RegExp("^t([^1]|1\\d)","m");
result = RX.exec(report);
if (result !== null) {
var textMsg = "Маркер знака сноски 1 без соответствующего ему маркера текста сноски 1." // #11";
		window.external.SetStatusBarText(textMsg); 
result.index += result.length;
// PerehodNoteTxt1() 
Perehod() 
}
}

// 7. Поиск нарушений порядка номеров маркеров знаков сносок:
if (result == null) {
/*for (var kZ = 1; kZ<1000; kZ++) {
var kZsl = (kZ + 1);
var RX = new RegExp("z("+kZ+")z(?!"+kZsl+"\\D)","g");
// alert(RX);
result = RX.exec(report);

if (result !== null)
{
var textMsg = "После выделенного маркера знака сноски "+kZ+" должен идти маркер номер "+kZsl+", но это не так. Возможно пропущены или неверно пронумерованы маркеры ниже/выше выделенного места." // #12";
// alert(textMsg+"\n Найдено: \nПозиция: "+result.index+"\nСовпадение: "+result[0]+"\nДлина: "+result.length);
// результат вывести в статусбар:
		window.external.SetStatusBarText(textMsg); 
result.index += result.length;
Perehod();
break;
} */

var RX = new RegExp("z(\\d+)(?=z(\\d+))","g");
while ((result = RX.exec(report)) != null) {
var razniza = (result[2] - result[1]);
if (razniza != 1) {
var textMsg = "После маркера знака сноски "+result[1]+" идёт маркера знака сноски "+result[2]+", что не корректно." // #13";
// alert("Найдено: \nПозиция: "+result.index+"\nСовпадение: "+result[0]+"\nДлина: "+result.length);
		window.external.SetStatusBarText(textMsg); 
result.index += result.length - 1;
Perehod();
break
}






}
}

// 8. Поиск нарушений порядка номеров маркеров текстов сносок:
if (result == null) {
/* for (var kT = 1; kT<1000; kT++) {
var kTsl = (kT + 1);
var RX = new RegExp("t("+kT+")t(?!"+kTsl+"(?=t|$))","m");
result = RX.exec(report);

if (result !== null)
{
var textMsg = "После выделенного маркера текста сноски "+kT+" должен идти маркер номер "+kTsl+", но это не так. Ищите пропущенные или неверно пронумерованные маркеры ниже/выше выделенного места." // #14";
		window.external.SetStatusBarText(textMsg); 
result.index += result.length;
Perehod();
break;
} */


var RX = new RegExp("t(\\d+)(?=t(\\d+))","g");
while ((result = RX.exec(report)) != null) {
var razniza = (result[2] - result[1]);
if (razniza != 1) {
var textMsg = "После маркера текста сноски "+result[1]+" идёт маркер текста сноски "+result[2]+", что не корректно." // #15";
// alert("Найдено: \nПозиция: "+result.index+"\nСовпадение: "+result[0]+"\nДлина: "+result.length);
		window.external.SetStatusBarText(textMsg); 
result.index += result.length - 1;
Perehod();
break
}



}
}





// 9. Поиск разного количества знаков и текстов сносок на одной странице:

if (result == null)  {
report = report.split(/\r\n\r\n/mg) ; 
var reportZ = report[0];
var reportT= report[1];
// alert(reportZ);
// alert(reportT);
report = "";

for (i = 0; i <page; i++) {
var sZ = reportZ.split("\r\n") ;
var sT = reportT.split("\r\n") ;
report += (sZ[i] +  sT[i] + "\r\n");
// alert(report);
}

// Разобьём список на два — список маркеров знаков и список маркеров текстов сносок:
var countSupDo = countSupDoZ= countSupDoT = 0;
for (var i = 0; i < page; i++) {
var str = report.split(/\r\n/mg) ; 
// alert(str[i]);

var z = (report.match(/[zZT]/g) || []).length; // маркеров знаков сносок всего.?????????????????

var zNaStr = (str[i].match(/[z]/g) || []).length; // маркеров знаков сносок на "странице".
var tNaStr = (str[i].match(/t/g) || []).length; // маркеров текстов сносок всего на "странице".
var mNaStr = (str[i].match(/[zt]/g) || []).length; // маркеров сносок всего на "странице".
// alert("На странице "+zNaStr+" знаков и "+tNaStr+" текстов сносок.\nВсего "+mNaStr+".");

countSupDo = (countSupDo + mNaStr); // количество маркеров до следующей "страницы".
countSupDoZ = (countSupDoZ + zNaStr); // количество маркеров знаков до следующей "страницы".
countSupDoT = (countSupDoT + tNaStr); // количество маркеров знаков до следующей "страницы".




/* if (zNaStr == 0 && tNaStr !== 0) {
alert("А знаков нетути!\n«Страниц» с маркерами знаков сносок: "+pageZ+"\n«Страниц» с маркерами текстов сносок: "+pageT+"\nБудет выделен первый маркер знака сноски в документе.");
count = 1;
PerehodDliaRaznColMark();
var textMsgZ = "Вы перешли на первый маркер знака сноски. " // #16";
window.external.SetStatusBarText(textMsgZ); 
return;
}
if (tNaStr == 0 && zNaStr !== 0) {
alert("А текстов нетути!\n«Страниц» с маркерами текстов сносок: "+pageT+"\n«Страниц» с маркерами знаков сносок: "+pageZ+"\nБудет выделен первый маркер текста сноски в документе.");
count = z +1;
PerehodDliaRaznColMark();
var textMsgT = "Вы перешли на первый маркер текста сноски." // #17";
window.external.SetStatusBarText(textMsgT); 
return;
} */          //закоментил 30.11.2023




// если номеров и текстов не поровну, то:
if (zNaStr != tNaStr) 
{
// var mZ = countSupDoZ - zNaStr +1; // или - 1??????????????????????????????????
var mZ = countSupDoZ ; // вычисляем количество верхних индексов до последнего корректного маркера знака сноски.
var mT = countSupDoT + z; // вычисляем количество верхних индексов до последнего корректного маркера текста сноски.

if (zNaStr < tNaStr) {
var countS = confirm("Количество  маркеров знаков и текстов сносок на странице* не совпадают ("+zNaStr+" и "+tNaStr+" соответственно).\n.Предлагаем перейти на: \n\n• Последний корректный МАРКЕР ЗНАКА сноски.\n(Нажмите кнопку OK).\n\n• Последний корректный МАРКЕР ТЕКСТА сноски.\n(Нажмите кнопку Отмена).\n\nВ большинстве случаев рекомендуется выбирать первый вариант (OK). Если вам не повезет, запустИте скрипт ещё раз и выберите второй вариант (Отмена). В случае постраничных сносок можно поискать некорректный маркер рядом с выделенным местом.\n\n* Под «страницей» скрипт подразумевает: при проверке постраничных сносок — страницу; поглавных — главу; концевых — всю книгу.");
if (countS == true) {
count = mZ;
markSnoski = "знака";
};
if (countS == false) {
count = mT;
markSnoski = "текста";
};
}

if (zNaStr > tNaStr) {
var countS = confirm("Количество маркеров знаков и текстов сносок на странице* не совпадают ("+zNaStr+" и "+tNaStr+" соответственно).\n. Предлагаем перейти на: \n\n• Последний корректный МАРКЕР ТЕКСТА сноски.\n(Нажмите кнопку OK).\n\n• Последний корректный МАРКЕР ЗНАКА сноски.\n(Нажмите кнопку Отмена).\n\nВ большинстве случаев рекомендуется выбирать первый вариант (OK). Если вам не повезет, запустИте скрипт ещё раз и выберите второй вариант (Отмена). В случае постраничных сносок можно поискать некорректный маркер рядом с выделенным местом.\n\n* Под «страницей» скрипт подразумевает: при проверке постраничных сносок — страницу; поглавных — главу; концевых — всю книгу.");
if (countS == true) {
count = mT;
markSnoski = "текста";
};
if (countS == false) {
count = mZ;
markSnoski = "знака";
};
}
var textMsg = "Если причина некорректности в разном количестве МЗС и МТС на странице, то ищите пропущенное  ниже выделенного маркера " +markSnoski+ " сноски. Если причина в в пропущенных «страницах» с маркерами, то скорее всего пропущенная страница находится выше выделенного места на одну-две «страницы». Но это не точно.";
window.external.SetStatusBarText(textMsg); 

PerehodDliaRaznColMark();
break;
}
}
}

if (pageZ !== pageT) {
alert('В документе оказалось разное количество страниц с маркерами знаков и маркерами текстов сносок. Это усложняет поиск некорректных маркеров. В таких случаях дальнейшие формулировки в строке состояния могут быть не совсем точны и довольно условны.\n\nСтраниц с маркерами знаков сносок: '+pageZ+'\nСтраниц с маркерами текстов сносок: '+pageT+'.\n\nСкрипт плохо справляется с такой ситуацией, а иногда и совсем не справляется, так как не может определить какая из страниц с маркерами знаков сносок должна соотноситься с очередной страницей с маркерами текстов сносок.\nСовет: \nПосле пары неудачных попыток будет результативнее искать такие пропущенные «страницы» при помощи скрипта "Создать таблицу соответствия будущих сносок".');
}

if (zNaStr == tNaStr && result == null) {
alert("Ошибок нумерации маркеров сносок не найдено.");
// alert("Ну не шмогла я…");
// return ;
}
}

// функция вычисления кол. маркеров до совпадений, найденных по первым восьми регекспам:
function Perehod() {
// отсекаем все маркеры после совпадения и находим количество маркеров до совпадения:
var re03 = new RegExp("^((.|\\r|\\n){"+result.index+"})(.|\\r|\\n)+$", "m" );
var re03_ = "$1";
if (report.search(re03)!=-1)         { report=report.replace(re03, re03_); }
count = (report.match(/z|Z|t|T/mg)).length; // маркеров;
// alert("Маркеров до совпадения: " +count);

PerehodNaSlSup();
 }
 
 function PerehodNoteTxt1() {
// отсекаем все маркеры после совпадения и находим количество маркеров до совпадения:
var re03 = new RegExp("^((.|\\r|\\n){"+result.index+"})(.|\\r|\\n)+$", "m" );
var re03_ = "$1";
if (report.search(re03)!=-1)         { report=report.replace(re03, re03_); }
count = (report.match(/z|Z|t|T/mg)).length; // маркеров;\\ Добавить Z?
count--;
// alert("Маркеров до совпадения: " +count);

PerehodNaSlSup();
 }

// функция для определения координат и длины совпадения:
function PerehodNaSlSup() {
re = /☺(.+?)☻/gm;
for (i = 0; i < count; i++) {  
((res = re.exec(txt)) != null)
}
  // alert("Найдено: " + res[0] + "\nДлина: "+res.length+"\nПозиция: "+res.index+"\nСледующий поиск c позиции: "+re.lastIndex);
} 

// поправляем координаты и длину совпадения для выбранного вида маркеров сносок:
function PosAndLengthMarkSup() {
dlina = re.lastIndex - res.index - 2; // позиция.
res.index--
res.index = res.index - 2 * (count -1); // длина
}

function PosAndLengthMarkAsteriks() {
dlina = res[0].replace(/[☻☺]/g, ""); // длина.
res.index--
res.index = res.index - 2 * (count -1); // позиция 
}

function PosAndLengthMarkKvSk()  {
dlina = re.lastIndex - res.index - 2; // длина.
}

function PosAndLengthMarkFigSk()  {
dlina = re.lastIndex - res.index - 2; // длина.
}

function PosAndLengthMarkKvSkTilde()  {
dlina = re.lastIndex - res.index - 2; // длина.
res.index = res.index +2 * (count -1) +1; // позиция.
}

function PosAndLengthMarkFigSkTilde()  {
dlina = re.lastIndex - res.index - 2; // длина.
res.index = res.index +2 * (count -1) +1; // позиция.
}

// функция для перехода к маркерам найденным по последнему девятому регекспу,
// ищущему страницы с разным количеством маркеров знаков и текстов сносок:
function PerehodDliaRaznColMark() {
// сбрасываем курсор в начало документа:
 var fbwBody=document.getElementById("fbw_body")
 var tr=document.body.createTextRange();
 tr.moveToElementText(fbwBody);
 tr.collapse(true);
 tr.select();
 window.scrollTo(0,0);
 // window.scrollTo(0,document.body.scrollHeight); // вниз?
 
for (i = 0; i < count; i++) {  
 PerehodNaSlSup();
 }
 }

// функция для выделения найденного:
function PerehodFinal() {
// сбрасываем курсор в начало документа:
var fbwBody=document.getElementById("fbw_body")
 var tr=document.body.createTextRange();
tr.moveToElementText(fbwBody);
tr.collapse(true);
tr.select();
window.scrollTo(0,0);

 // переходим и выделяем найденное совпадение.
var myRange = document.selection.createRange ()
var fromText = myRange.text;

myRange.moveStart ("character", res.index); // переместить курсор правее.
myRange.moveEnd ("character", dlina); // выделить символы правее курсора.
myRange.select ();
}
}
