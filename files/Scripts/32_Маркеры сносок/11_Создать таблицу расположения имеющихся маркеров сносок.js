// Создать таблицу расположения имеющихся маркеров сносок. v. 1.4.
// Автор: stokber

function Run() {

                            /// НАСТРОЙКИ
    var display = 1; // 0 - показывать в IE, 1 - в браузере по умолчанию.
 
    // путь для показа в браузере по умолчанию:
    if (display == 1) {
       // путь для временного html-файла создаваемого для вашего браузера по умолчанию (HTML/temp.html):
       var filePatch = document.location.href.replace("file:///", "").replace(/%20/g," ").replace(/main\.html/, "HTML/temp.html");
       // или указать любой другой путь, например:
       // var filePatch = "C:\\temp.html"; // Следует иметь ввиду, что скрипт не создаёт новых директорий. Все папки, как и диски указанные в этой переменной, должны реально существовать.
   }

    var name = "Создать таблицу расположения имеющихся маркеров сносок";
    var version = "1.4";
    var avtor = "stokber";
    var sel = document.getElementById("fbw_body");
    var str = sel.innerHTML;
    var s1 = "☺"; //символ начала маркера сноски.
    var s2 = "☻"; //символ конца маркера сноски.
    var nZ;
    var nT;
    var report = "";
    var colour;
	

	var colour0a = "#bdb76b"; // цвет фона Заголовков таблицы.
    // var colour0a = "DarkKhaki"; // цвет фона Заголовков таблицы.
	// var colour0d = "silver"; // цвет пустых ячеек.
    var colour0d = "#c0c0c0"; // цвет пустых ячеек.
    // var colour1 = "Khaki"; // цвет первой полосы «зебры».
	var colour1 = "#f1e7a2"; // цвет первой полосы «зебры».
    // var colour2 = "LightCyan"; // цвет второй полосы «зебры».
    // var colour5 = "#ffa500"; // цвет строки маркера знака сноски №1.
	var colour5 = "orange"; // цвет строки маркера знака сноски №1.
    // var colour6 = "#ffffff"; // цвет новой страницы #FFFFFF
	var colour6 = "white"; // цвет новой страницы
    var lenZ = 120; // кол. символов для отображения в ячейке для маркера знака сноски.
    var lenT = 120; // кол. символов для отображения в ячейке для маркера текста сноски.

    // окно выбора вида маркеров сносок:
    var dialogWidth = "330px";
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
        dialogHeight = "310px";
    } else {
        // alert('Используется другая версия Internet Explorer или другой браузер');
        dialogHeight = "280px";
    }

    var fbwBody = document.getElementById("fbw_body");
    var coll = new Object();
    coll["fbwBody"] = fbwBody;
    coll["mainDocument"] = document;
    coll["window"] = window;
    // coll["versionNum"]=listMarker_versionNum;
    var markSign = window.showModalDialog("HTML/Создать таблицу маркеров-сносок.htm", coll,
        "dialogHeight: " + dialogHeight + "; dialogWidth: " + dialogWidth + "; " +
        "center: Yes; help: No; resizable: Yes; status: No;");
    if (!markSign) return;

    // Проверяем случайное наличие в документе символов ☺ и ☻, которые 
    // будут использоваться скриптом как временные метки s1 и  s2 маркеров сносок 
    // в  переменной str: 
    var regexp = new RegExp("(" + s1 + "|" + s2 + ")+", "g")
    /*    var metk = (str.match(regexp) || []).length;
      // var Metk = (str.match(/☺|☻/g) || []).length;
    if (metk > 0) { */
    if (regexp.test(str)) {
        window.clipboardData.setData("text", "(" + s1 + "|" + s2 + ")+");
        alert("В вашем документе имеются символ(ы) " + s1 + " и(ли) " + s2 + ", которые используются скриптом как временные метки. Для корректной работы рекомендуем на время работы скрипта заменить их на другие символы.\nНайти в документе их можно перейдя в режим Кода и вставив регулярное выражение из буфера обмена в строку поиска окна Поиск (Ctrl+F)\n\"" + name + "\" v." + version);
        return;
    }

    if (markSign == "надстрочным текстом") {
        str = str.replace(/<\/?(STRONG|EM|SUB|STRIKE)>/ig, "");
        str = str.replace(/<SPAN class=code>(.+?)<\/SPAN>/ig, "$1"); // 

        str = str.replace(/<A class=note [^<]+?><SUP>(\d+)<\/SUP><\/A>/ig, "$1"); // убить FineReader-ские сноски. !!!!! 
        // str = str.replace(/(<A href=[^>]+>)<SUP>(\{\d+\})<\/SUP>(<\/A>)/ig, "$1$2$3"); 

        str = str.replace(/&nbsp;/g, " "); // 
        str = str.replace(/[ □▫◦]/g, " "); // 
        str = str.replace(/<SUP>\s*(\d+)(\s*)<\/SUP>/ig, s1 + "$1" + s2 + "$2"); //подменяем теги SUP на метки.
        str = str.replace(/<\/?[^<>]+>/g, ""); // удаляем все теги.
        str = str.replace(/[¹²³⁴⁵⁶⁷⁸⁹⁰]+/g, s1 + "$&" + s2); // учитываем надстрочные символы цифр.
    } else if (markSign == "вида *") {
        str = str.replace(/<\/?(STRONG|EM|SUP|SUB|STRIKE)>/ig, "");
        str = str.replace(/<SPAN class=code>(.+?)<\/SPAN>/ig, "$1"); // 
        str = str.replace(/&nbsp;(&nbsp;| |\*)/g, " $1"); // 
        str = str.replace(/(&nbsp;| |\*)&nbsp;/g, "$1 "); // 
        str = str.replace(/[ □▫◦]/g, " "); // 
        for (; countAst != 0;) { // заменяем звездочки в пустых строках другими символами (@).
            var ast = new RegExp("^((?:<\\/?[^>]+>)*)([ @]*)([*])([ *]*)((?:<\\/?[^>]+>)*)$", "gm");
            var ast_ = "$1$2@$4$5";
            var countAst = 0;
            if (str.search(ast) != -1) {
                str = str.replace(ast, ast_);
                countAst++
            }
        }
        str = str.replace(/[*]+/ig, s1 + "$&" + s2);

    } else if (markSign == "вида #") {
        str = str.replace(/<\/?(STRONG|EM|SUP|SUB|STRIKE)>/ig, "");
        str = str.replace(/<SPAN class=code>(.+?)<\/SPAN>/ig, "$1"); // 
        str = str.replace(/&nbsp;(&nbsp;| |#)/g, " $1"); // 
        str = str.replace(/(&nbsp;| |#)&nbsp;/g, "$1 "); // 
        str = str.replace(/[ □▫◦]/g, " "); // 
        for (; countGrid != 0;) { // заменяем решётки в пустых строках другими символами (@).
            var grid = new RegExp("^((?:<\\/?[^>]+>)*)([ @]*)([#])([ #]*)((?:<\\/?[^>]+>)*)$", "gm");
            var grid_ = "$1$2@$4$5";
            var countGrid = 0;
            if (str.search(grid) != -1) {
                str = str.replace(grid, grid_);
                countGrid++
            }
        }
        str = str.replace(/[#]+/ig, s1 + "$&" + s2);

    } else if (markSign == "вида [1]") {
        str = str.replace(/<\/?(STRONG|EM|SUP|SUB|STRIKE)>/ig, "");
        str = str.replace(/<SPAN class=code>(.+?)<\/SPAN>/ig, "$1"); // 
        str = str.replace(/(<A class=note [^<]+?>)\[(\d+)\](<\/A>)/ig, "$1($2)$3"); // 
        str = str.replace(/\[\d+\]/ig, s1 + "$&" + s2);
        str = str.replace(/(<A class=note [^<]+?>)\((\d+)\)(<\/A>)/ig, "$1[$2]$3"); // 
        str = str.replace(/☻☺/mg, "☻]☺"); // чтобы были видны два маркера знака сносок подряд без пробелов между. 
        // alert(str);
    } else if (markSign == "вида {1}") {
        str = str.replace(/<\/?(STRONG|EM|SUP|SUB|STRIKE)>/ig, "");
        str = str.replace(/<SPAN class=code>(.+?)<\/SPAN>/ig, "$1"); // 
        str = str.replace(/(<A href=[^<]+?>)\{(\d+)\}(<\/A>)/ig, "$1($2)$3"); // 
        str = str.replace(/\{\d+\}/ig, s1 + "$&" + s2);
        str = str.replace(/(<A href=[^<]+?>)\((\d+)\)(<\/A>)/ig, "$1{$2}$3"); // 
        str = str.replace(/☻☺/mg, "☻}☺"); // чтобы были видны два маркера знака сносок подряд без пробелов между. 
    } else if (markSign == "вида [~1~]") {
        str = str.replace(/\[~\d+~\]/ig, s1 + "$&" + s2);
    }

    if (markSign == "вида {~1~}") {
        str = str.replace(/\{~\d+~\}/ig, s1 + "$&" + s2);
    }

    Report();

    function Report() {
        str = str.replace(/<\/?[^<>]+>/g, ""); // удаляем все теги
        str = str.replace(/&lt;/g, "<"); // 
        str = str.replace(/&gt;/g, ">"); // 
        str = str.replace(/&amp;/g, "&"); // 
        // str = str.replace(/&nbsp;/g, " "); // 
        str = str.replace(/[ □▫◦]/g, " ");
        str = str.replace(/^\s+/gm, ""); // удаляем начальные пробелы

        var regexp = new RegExp(s1, "g")
        var colMarker = (str.match(regexp) || []).length;
        if (colMarker == 0) {
            MsgBox("Не найдено ни одного маркера сносок " + markSign + ".\nТаблица создана не будет.\n\n=================\n\nСкрипт '" + name + "' v." + version);
            return;
        }
        var regexp = new RegExp("^" + s1, "gm")
        // var t = (str.match(/^☺/gm) || []).length;
        var t = (str.match(regexp) || []).length;
        var z = (colMarker - t);
        // if (t == 0 || z ==0) {
        if (t == 0 && z == 0) {
            MsgBox("Вы выбрали маркеры " + markSign + ".\n\nНайдено:\nмаркеров знаков сносок: " + z + " \nмаркеров текстов сносок : " + t + "\nТаблица создана не будет.\n\n=================\n\nСкрипт '" + name + "' v." + version);
            return;
        }

        if (z == 0) {
            MsgBox("Вы выбрали маркеры " + markSign + ".\n\nВ документе не оказалось маркеров знаков сносок такого вида.\nБудет создана таблица только маркеров текстов сносок.");
        }
        if (t == 0) {
            MsgBox("Вы выбрали маркеры " + markSign + ".\n\nВ документе не оказалось маркеров текстов сносок такого вида.\nБудет создана таблица только маркеров знаков сносок.");
        }

        var regexp = new RegExp("([^" + s2 + "\\n\\r]{1," + lenZ + "})(" + s1 + ".+?" + s2 + ")|^(" + s1 + ".+?" + s2 + ")([^" + s1 + "\\n\\r]{1," + lenT + "})", "gm"); // регулярное выражение для маркера сноски.

        var result;
        // var report = ""; // список маркеров  сносок.

        while (result = regexp.exec(str)) {
            report += (result[0]) + "\r\n"; // для маркера сноски.
        }

        report = report.replace(/^☺.+?$/mg, "<tr><td></td><td>$&</td></tr>");
        report = report.replace(/.+?☻$/mg, "<tr><td align=\"right\">$&</td><td></td></tr>");

        if (markSign == "надстрочным текстом") {
            report = report.replace(/☺/mg, "<sup>");
            report = report.replace(/☻/mg, "</sup>");
        }

        report = report.replace(/[☺☻]/mg, "");

        report = report.replace(/(<tr>.+?\n)<tr>/gm, "$1<tr BGCOLOR=\"" + colour1 + "\">");
        report = report.replace(/<tr>/gm, "<tr BGCOLOR=\"" + colour1 + "\">");

        /*     window.clipboardData.setData("text",report); // данные в буфер обмена для Excel и т. п. программ.
           alert(report); */

        // ------------------------------------------------------------------
        // задаём фон для фрагментов с маркерами №1:
        if (markSign == "надстрочным текстом") {
            report = report.replace(/^<tr[^>]*?>(<td[^>]*?>.+?<sup>1<\/sup><\/td><td><\/td><\/tr>)$/gm, "<tr BGCOLOR=\"" + colour5 + "\">$1");
            report = report.replace(/^<tr[^>]*?>(<td><\/td><td><sup>1<\/sup>.+?<\/td><\/tr>)$/gm, "<tr BGCOLOR=\"" + colour5 + "\">$1");
        }
        if (markSign == "вида *") {
            report = report.replace(/^<tr[^>]*?>(<td[^>]*?>.+?[^*]\*<\/td><td><\/td><\/tr>)$/gm, "<tr BGCOLOR=\"" + colour5 + "\">$1");
            report = report.replace(/^<tr[^>]*?>(<td><\/td><td>\*[^*].+?<\/td><\/tr>)$/gm, "<tr BGCOLOR=\"" + colour5 + "\">$1");
        }
		if (markSign == "вида #") {
            report = report.replace(/(<td align=\"right\")>(.*?[^#]#<\/td>)/gm, "$1 BGCOLOR=\"" + colour5 + "\">$2");
            report = report.replace(/(<td)>(#[^#].+?<\/td><\/tr>)/gm, "$1 BGCOLOR=\"" + colour5 + "\">$2");
        }
        if (markSign == "вида [1]") {
            report = report.replace(/^<tr[^>]*?>(<td[^>]*?>.+?\[1\]<\/td><td><\/td><\/tr>)$/gm, "<tr BGCOLOR=\"" + colour5 + "\">$1");
            report = report.replace(/^<tr[^>]*?>(<td><\/td><td>\[1\].+?<\/td><\/tr>)$/gm, "<tr BGCOLOR=\"" + colour5 + "\">$1");
        }
        if (markSign == "вида {1}") {

            report = report.replace(/^<tr[^>]*?>(<td><\/td><td>\{1\}.+?<\/td><\/tr>)$/gm, "<tr BGCOLOR=\"" + colour5 + "\">$1");
            report = report.replace(/^<tr[^>]*?>(<td[^>]*?>.+?\{1\}<\/td><td><\/td><\/tr>)$/gm, "<tr BGCOLOR=\"" + colour5 + "\">$1");
        }
        if (markSign == "вида [~1~]") {
            report = report.replace(/^<tr[^>]*?>(<td[^>]*?>.+?\[~1~\]<\/td><td><\/td><\/tr>)$/gm, "<tr BGCOLOR=\"" + colour5 + "\">$1");
            report = report.replace(/^<tr[^>]*?>(<td><\/td><td>\[~1~\].+?<\/td><\/tr>)$/gm, "<tr BGCOLOR=\"" + colour5 + "\">$1");
        }
        if (markSign == "вида {~1~}") {
            report = report.replace(/^<tr[^>]*?>(<td[^>]*?>.+?\{~1~\}<\/td><td><\/td><\/tr>)$/gm, "<tr BGCOLOR=\"" + colour5 + "\">$1");
            report = report.replace(/^<tr[^>]*?>(<td><\/td><td>\{~1~\}.+?<\/td><\/tr>)$/gm, "<tr BGCOLOR=\"" + colour5 + "\">$1");
        }

        // закрасить пустые ячейки:
        report = report.replace(/<td><\/td>/mg, "<td BGCOLOR=\"" + colour0d + "\"><\/td>");

        // делим книгу на страницы:
        report = report.replace(new RegExp("([^>]</td></tr>\\r\\n)(<tr BGCOLOR=\"" + colour5 + "\"><td align=\"right\">)", "gm"), "$1<tr BGCOLOR=\"" + colour6 + "\"><td><sub>Новая страница с маркерами сносок:</sub></td><td></td></tr>\r\n$2");
        report = report.replace(new RegExp("([^>]</td></tr>\\r\\n)(<tr BGCOLOR=\"" + colour1 + "\"><td align=\"right\">)", "gm"), "$1<tr BGCOLOR=\"" + colour6 + "\"><td>Новая страница с маркерами сносок:</td><td></td></tr>\r\n$2");

        var reportDo = "<h2 align=\"center\">Таблица расположения имеющихся маркеров сносок</h2><table width=\"100%\" border=\"1\" cellpadding=\"5\" cellspacing=\"5\"><tr BGCOLOR=\"" + colour0a + "\"><th height=\"40\">Сноска (" + z + ")</th><th>Текст сноски (" + t + ")</th></tr><tr><td><sub>Первая страница с маркерами сносок:</sub></td><td></td></tr>\r\n";
        var reportPosle = "</table><p align=\"center\">Скрипт \"" + name + "\" v." + version + " (" + avtor + ")</p>";
        report = reportDo + "" + report + "" + reportPosle;
       
	   /* MsgBox(report);
        window.clipboardData.setData("text",report); // данные в буфер обмена для Excel и т. п. программ. */
	   

		
   // для показа в IE:
    if (display == 0) {
        MyMsgWindow(report);
    }
    // для показа в браузере по умолчанию:
    if (display == 1) {
        WriteFile();
    }
    }

    function MyMsgWindow(report) {
        var MsgWindow = window.open("HTML/Создать таблицу маркеров-сносок.htm", null, "status=no,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes");
        MsgWindow.document.body.innerHTML = report;
      }

        function WriteFile() {
        var shell = new ActiveXObject("WScript.Shell");
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        var fh = fso.CreateTextFile(filePatch, true);
        fh.WriteLine(report);
        fh.Close();
        shell.Run("\""+filePatch+"\"");
    }
        // ========================================

}