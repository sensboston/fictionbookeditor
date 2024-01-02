// Создать таблицу соответствия маркеров будущих сносок. v. 1.1.
// Автор: stokber

function Run() {
var sel=document.getElementById("fbw_body");
var str = sel.innerHTML;
var s1 = "☺"; //метка начала маркера сноски.
var s2 = "☻"; //метка конца маркера сноски.
var nZ;
var nT;
var report = "";
var colour0a = "DarkKhaki";// цвет фона Заголовков таблицы.;
var colour0d = "#c0c0c0"; // цвет пустых ячеек.
var colour0e = "DarkKhaki"; // цвет среднего столбца с номерами будущих сносок..
var colour1 = "Khaki"; // цвет первой полосы «зебры».
var colour2 = "orange"; // цвет второй полосы «зебры».

var lenZ = 120; // кол. символов для отображения в ячейке для маркера знака сноски.
var lenT = 120; // кол. символов для отображения в ячейке для маркера текста сноски.

// окно выбора вида маркеров сносок:
 var dialogWidth="300px";
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
  dialogHeight="280px";
} else {
  // alert('Используется другая версия Internet Explorer или другой браузер');
  dialogHeight="250px";
}

 var fbwBody=document.getElementById("fbw_body");
 var coll=new Object();
 coll["fbwBody"]=fbwBody;
 coll["mainDocument"]=document;
 coll["window"]=window;
 // coll["versionNum"]=listMarker_versionNum;
  var markSign=window.showModalDialog("HTML/Создать таблицу маркеров-сносок.htm",coll,
     "dialogHeight: "+dialogHeight+"; dialogWidth: "+dialogWidth+"; "+
     "center: Yes; help: No; resizable: Yes; status: No;");
  if (!markSign) return ;
  
   // Проверяем случайное наличие в документе символов ☺ и ☻, которые 
   // будут использоваться скриптом как временные метки s1 и  s2 маркеров сносок 
   // в  переменной str: 
   var regexp = new RegExp("("+s1+"|"+s2+")+", "g")
/*    var metk = (str.match(regexp) || []).length;
  // var Metk = (str.match(/☺|☻/g) || []).length;
if (metk > 0) { */
if (regexp.test(str)) {
   window.clipboardData.setData("text","("+s1+"|"+s2+")+");
   alert("В вашем документе имеются символ(ы) " +s1+ " и(ли) " +s2+ ", которые используются скриптом как временные метки. Для корректной работы рекомендуем на время работы скрипта заменить их на другие символы.\nНайти в документе их можно перейдя в режим Кода и вставив регулярное выражение из буфера обмена в строку поиска окна Поиск (Ctrl+F)")
   return;
}

if (markSign == "надстрочным текстом") {
   str = str.replace(/<\/?(STRONG|EM|SUB|STRIKE)>/ig, ""); 
   str = str.replace(/<SPAN class=code>(.+?)<\/SPAN>/ig, "$1"); // 
   str = str.replace(/<A class=note [^<]+?><SUP>(\d+)<\/SUP><\/A>/ig, "$1"); // убить FineReader-ские сноски.
   // str = str.replace(/(<A href=[^>]+>)<SUP>(\{\d+\})<\/SUP>(<\/A>)/ig, "$1$2$3"); 
   
   str = str.replace(/&nbsp;/g, " "); // 
   str = str.replace(/[ □▫◦]/g, " "); // 
   str = str.replace(/<SUP>\s*(\d+)(\s*)<\/SUP>/ig, s1+"$1"+s2+"$2"); //подменяем теги SUP на метки.
   str = str.replace(/<\/?[^<>]+>/g, ""); // удаляем все теги.
   str = str.replace(/[¹²³⁴⁵⁶⁷⁸⁹⁰]+/g, s1+"$&"+s2); // учитываем надстрочные символы цифр.
}

else if (markSign == "вида *") {
   str = str.replace(/<\/?(STRONG|EM|SUP|SUB|STRIKE)>/ig, ""); 
   str = str.replace(/<SPAN class=code>(.+?)<\/SPAN>/ig, "$1"); // 
   str = str.replace(/&nbsp;(&nbsp;| |\*)/g, " $1"); // 
   str = str.replace(/(&nbsp;| |\*)&nbsp;/g, "$1 "); // 
   str = str.replace(/[ □▫◦]/g, " "); // 
for (; countAst != 0;) { // заменяем звездочки в пустых строках другими символами (@).
   var ast = new RegExp("^((?:<\\/?[^>]+>)*)([ @]*)([*])([ *]*)((?:<\\/?[^>]+>)*)$","gm");
   var ast_ = "$1$2@$4$5";
   var countAst = 0;
   if (str.search(ast)!=-1)         { str=str.replace(ast, ast_); countAst++}
}
   str = str.replace(/[*]+/ig, s1+"$&"+s2); 
}

else if (markSign == "вида [1]") {
   str = str.replace(/<\/?(STRONG|EM|SUP|SUB|STRIKE)>/ig, ""); 
   str = str.replace(/<SPAN class=code>(.+?)<\/SPAN>/ig, "$1"); // 
   str = str.replace(/(<A class=note [^<]+?>)\[(\d+)\](<\/A>)/ig, "$1($2)$3"); // 
   str = str.replace(/\[\d+\]/ig, s1+"$&"+s2); 
   str = str.replace(/(<A class=note [^<]+?>)\((\d+)\)(<\/A>)/ig, "$1[$2]$3"); // 
}

else if (markSign == "вида {1}") {
   str = str.replace(/<\/?(STRONG|EM|SUP|SUB|STRIKE)>/ig, ""); 
   str = str.replace(/<SPAN class=code>(.+?)<\/SPAN>/ig, "$1"); // 
   str = str.replace(/(<A href=[^<]+?>)\{(\d+)\}(<\/A>)/ig, "$1($2)$3"); // 
   str = str.replace(/\{\d+\}/ig, s1+"$&"+s2); 
   str = str.replace(/(<A href=[^<]+?>)\((\d+)\)(<\/A>)/ig, "$1{$2}$3"); // 
}

else if (markSign == "вида [~1~]") {
   str = str.replace(/\[~\d+~\]/ig, s1+"$&"+s2); 
}

if (markSign == "вида {~1~}") {
   str = str.replace(/\{~\d+~\}/ig, s1+"$&"+s2); 
}

Report();
function Report() {
   str = str.replace(/<\/?[^<>]+>/g, ""); // удаляем все теги
   str = str.replace(/&lt;/g, "<"); // 
   str = str.replace(/&gt;/g, ">"); // 
   str = str.replace(/&amp;/g, "&"); // 
   str = str.replace(/&nbsp;/g, " "); // 
   str = str.replace(/[ □▫◦]/g, " "); 
   str = str.replace(/^\s+/gm, ""); // удаляем начальные пробелы

   var regexp = new RegExp(s1, "g");
   var colMarker = (str.match(regexp) || []).length;
if (colMarker == 0) {
   MsgBox("Не найдено ни одного маркера сносок "+markSign+".\nТаблица создана не будет.");
   return;
}
   var regexp = new RegExp("^"+s1, "gm")
   // var t = (str.match(/^☺/gm) || []).length;
   var t = (str.match(regexp) || []).length;
   var z = (colMarker - t);
   if (t == 0 || z ==0) {
   MsgBox("Вы выбрали маркеры "+markSign+".\n\nНайдено:\nмаркеров знаков сносок: "+z+" \nмаркеров текстов сносок : "+t+"\nТаблица создана не будет. ");
   return;
}

   var regexpZ = new RegExp("([^"+s2+"\\n\\r]{1,"+lenZ+"})("+s1+".+?"+s2+")","gm"); // регулярное выражение для маркера номера сноски.
   var regexpT = new RegExp("^("+s1+".+?"+s2+")([^"+s1+"\\n\\r]{1,"+lenT+"})","gm"); // регулярное выражение для маркера текста сноски.

   var resultZ;
   var reportZ = ""; // список маркеров знаков сносок.
   var resultT;
   var reportT = ""; // список маркеров текстов сносок.
   
while (resultZ = regexpZ.exec(str)) {
reportZ += (resultZ[0]) + "\r\n"; // для маркера номера сноски.
}

while (resultT = regexpT.exec(str)) {
reportT +=  (resultT[0]) + "\r\n"; // для маркера номера текста сноски.
}

   var j;
   nZ = str.match(regexpZ).length; // список маркеров знаков сносок.
   nT = str.match(regexpT).length; // список маркеров текстов сносок.
if (nZ >= nT) j=nZ;
else
   j=nT;

   var start;
   var fin;
   var razn;
   
for (i = 0; i < j; i++) {
   var sZ = reportZ.split("\r\n") ;
   var sT = reportT.split("\r\n") ;
   var num = ([i]);
   num++
   report += (sZ[i] + "\t"+num+"\t" + sT[i]) + "\r\n";
}

   report = report.replace( /^(undefined)?\t/mg, "\t") ;
   report = report.replace( /\t(undefined)?$/mg, "\t") ;

if (markSign == "надстрочным текстом") {
   report = report.replace( /☺/mg, "<sup>") ;
   report = report.replace( /☻/mg, "</sup>") ;
}

   report = report.replace( /[☺☻]/mg, "") ;
   report = report.replace( /^([^\t\r\n]*)\t(\d+)\t([^\t\r\n]*)$/gm, "<tr><td align=\"right\">$1</td><td align=\"center\">$2</td><td>$3</td></tr>") ;
   
   report = report.replace( /(<tr>.+?\n)<tr>/gm, "$1<tr BGCOLOR=\""+colour1+"\">") ;
   report = report.replace( /<tr>/gm, "<tr BGCOLOR=\""+colour1+"\">") ;
   
  // задаём фон для фрагментов с маркерами №1:
  if (markSign == "надстрочным текстом") {
   report = report.replace( /(<td align=\"right\")>(.*?<sup>1<\/sup><\/td>)/gm, "$1 BGCOLOR=\""+colour2+"\">$2") ;
   report = report.replace( /(<td)>(<sup>1<\/sup>.+?<\/td><\/tr>)/gm, "$1 BGCOLOR=\""+colour2+"\">$2") ;
   }
  if (markSign == "вида *") {
    report = report.replace( /(<td align=\"right\")>(.*?[^*]\*<\/td>)/gm, "$1 BGCOLOR=\""+colour2+"\">$2") ;
   report = report.replace( /(<td)>(\*[^*].+?<\/td><\/tr>)/gm, "$1 BGCOLOR=\""+colour2+"\">$2") ;
   }
  if (markSign == "вида [1]") {
  report = report.replace( /(<td align=\"right\")>(.*?\[1\]<\/td>)/gm, "$1 BGCOLOR=\""+colour2+"\">$2") ;
   report = report.replace( /(<td)>(\[1\].+?<\/td><\/tr>)/gm, "$1 BGCOLOR=\""+colour2+"\">$2") ;
  }
    if (markSign == "вида {1}") {
  report = report.replace( /(<td align=\"right\")>(.*?\{1\}<\/td>)/gm, "$1 BGCOLOR=\""+colour2+"\">$2") ;
   report = report.replace( /(<td)>(\{1\}.+?<\/td><\/tr>)/gm, "$1 BGCOLOR=\""+colour2+"\">$2") ;
  }
    if (markSign == "вида [~1~]") {
   report = report.replace( /(<td align=\"right\")>(.*?\[~1~\]<\/td>)/gm, "$1 BGCOLOR=\""+colour2+"\">$2") ;
   report = report.replace( /(<td)>(\[~1~\].+?<\/td><\/tr>)/gm, "$1 BGCOLOR=\""+colour2+"\">$2") ;
  }
    if (markSign == "вида {~1~}") {
	report = report.replace( /(<td align=\"right\")>(.*?\{~1~\}<\/td>)/gm, "$1 BGCOLOR=\""+colour2+"\">$2") ;
   report = report.replace( /(<td)>(\{~1~\}.+?<\/td><\/tr>)/gm, "$1 BGCOLOR=\""+colour2+"\">$2") ;
  }
   
/*       window.clipboardData.setData("text",report); //
   alert(report);  */
 
    // закрасить пустые ячейки:
   report = report.replace( /<td><\/td>/mg, "<td BGCOLOR=\""+colour0d+"\"><\/td>") ;
   report = report.replace( /<td align="right"><\/td>/mg, "<td BGCOLOR=\""+colour0d+"\"><\/td>") ;
   
      // закрасить средний столбец с номерами будущих сносок:
	 report = report.replace( /(<\/td><td align="center")(>\d+<\/td>)/g, "$1 BGCOLOR=\""+colour0e+"\"$2") ; 
 
/*  // Попытка обозначить красным шрифтом несовпадающие номера маркеров:
	 report = report.replace( /(<sup>3<\/sup><\/td><td align="center">)(\d)(<\/td><td><sup>4<\/sup>)/g, "$1<FONT color=\"#a52a2a\">$2</FONT>$3") ; */
   
   var reportDo = "<h2 align=\"center\">Таблица соответствия маркеров будущих сносок</h2><table  width=\"100%\" border=\"1\" cellpadding=\"5\" cellspacing=\"5\"><tr BGCOLOR=\""+colour0a+"\"><th height=\"40\">Сноска</th><th>№</th><th>Текст сноски</th></tr>";

   var reportPosle = "</table>";
   report = reportDo+""+report+""+reportPosle;
   // window.clipboardData.setData("text",report); // данные в буфер обмена для Excel и т. п. программ.
   
   MyMsgWindow(report);
}

function MyMsgWindow(report) {
   var MsgWindow = window.open("HTML/Создать таблицу маркеров-сносок.htm",null, "status=no,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes");
   MsgWindow.document.body.innerHTML = report;
}
}
