// Скрипт "Показать все-все таблицы в HTML-виде v.1.3"
// автор - stokber, (сентябрь, 2025).

function Run() {

                    ///НАСТРОЙКИ
    var display = 0; // 0 - показывать в IE, 1 - в браузере по умолчанию.
 
    // путь для показа в браузере по умолчанию:
    if (display == 1) {
       // путь для временного html-файла создаваемого для вашего браузера по умолчанию (HTML/temp.html):
       var filePatch = document.location.href.replace("file:///", "").replace(/%20/g," ").replace(/main\.html/, "HTML/temp.html");
       // или указать любой другой путь, например:
       // var filePatch = "C:\\temp.html"; // Следует иметь ввиду, что скрипт не создаёт новых директорий. Все папки, как и диски указанные в этой переменной, должны реально существовать.
	}
    // ================================

    var name = "Показать все-все таблицы в HTML-виде";
    var ver = "1.3";
    var fbwBody = document.getElementById("fbw_body");
    var str = fbwBody.innerHTML;

    // удаляем все бесполезные для нашей задачи,
    // но глючащие id-ы и fbstyle:
    str = str.replace(/(<(?:P|DIV)) id=["]?[\w]+["]?( class)/gi, "$1$2");
    str = str.replace(/(<[^>]+?) fbstyle=[\"]?\w+[\"]?([^>]*?>)/gi, "$1$2");
    // оставляем только таблицы:
    var str = str.replace(new RegExp("^(?!<(DIV class=(table|tr)|P class=t[hd])[^>]*>).*?(\\\r\\\n|$)", "gm"), "");
    // определяем количество таблиц для инфостроки:
    var countTable = (str.match(/<DIV class=table>/g) || []).length;
    // добавляем строки Табл.:
    var str = str.replace(new RegExp("<DIV class=table[^>]*>", "g"), "<P>Табл.</P>\r\n$&");
    // неразр. пр.:
    str = str.replace(/&nbsp;|[□▫◦]/g, " ");
    //убираем префиксы fb:
    str = str.replace(/fb((?:valign|align|colspan|rowspan)=)(?=[^>]*?>)/ig, "$1"); // !!!
    // Преобразуем:
    //ячейки:
    str = str.replace(/<P class=(td[^>]*?)>([\s\S]*?)<\/P>/ig, "<$1>$2</td>");
    // ячейки-заголовоки:
    str = str.replace(/<P class=(th[^>]*?)>(.*?)<\/P>/ig, "<$1>$2</th>");
    // строки:
    str = str.replace(/<DIV class=(tr[^>]*)>([\s\S]+?)<\/DIV>/igm, "<$1>$2</tr>");
    //таблицу:
    str = str.replace(/<DIV class=table>([\s\S]+?)<\/DIV>/igm, "<table>$1</table>");
    // инфострока Табл.:
    for (var i = 1; i <= countTable; i++) {
        str = str.replace(new RegExp("<P>Табл.</P>", ""), "<P>Табл. " + i + " из " + countTable + "</P>");
    }
    // интервал между таблицами:
    str = str.replace(/<\/table>/ig, "$&<BR><BR><BR><BR>");

    if (!str) {
        alert("В документе таблиц не найдено!\n\nСкрипт '" + name + "' v." + ver + ".");
        return;
    }

    function MyMsgWindow(str) {
        var MsgWindow = window.open("HTML/Показать таблицы в HTML-виде.html", null, "status=no,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes");
        MsgWindow.document.body.innerHTML = str;
    }

    // --------------------------------------------------------
    function WriteFile() {

        var shell = new ActiveXObject("WScript.Shell");
        var pref = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=windows-1251"><meta http-equiv="MSThemeCompatible" content="yes"><title> :: Таблицы в виде HTML :: </title><style type="text/css">body{ color: #000000; font-family: Arial Unicode MS, Candara, Verdana, Arial, Tahoma, Arial, sans-serif; font-size: 10px; text-align:justify;background-color:#FFFFFF; }table {margin-left: 25px;margin-right: auto;margin-top: 25px;margin-bottom: auto;}table, th, td, tr {border: 1px solid black;border-collapse: collapse;padding-left: 15px;padding-right: 15px;padding-bottom: 5px;padding-top: 5px;}</style></head><body>'
        var suf = "</body></html>";
        str = pref + str + suf;
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        var fh = fso.CreateTextFile(filePatch, true);
        fh.WriteLine(str);
        fh.Close();
        shell.Run("\""+filePatch+"\"");
        // ========================================
    }
    // для показа в IE:
    if (display == 0) {
        MyMsgWindow(str);
    }
    // для показа в браузере по умолчанию:
    if (display == 1) {
        WriteFile();
    }

}