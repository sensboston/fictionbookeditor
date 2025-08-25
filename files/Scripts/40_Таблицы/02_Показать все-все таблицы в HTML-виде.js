// Скрипт "Показать все-все таблицы в HTML-виде v.1.2"
// автор - stokber, (август 2025).

function Run() {
    var name = "Показать все-все таблицы в HTML-виде";
    var ver = "1.2";
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
        str = str.replace(new RegExp("<P>Табл.</P>", ""), "<P>Табл. " + i + " из " + countTable + "↓</P>");
    }
    // интервал между таблицами:
    str = str.replace(/<\/table>/ig, "$&<BR><BR><BR>");

    if (!str) {
        alert("В документе таблиц не найдено!\n\nСкрипт '" + name + "' v." + ver + ".");
        return;
    }

    MyMsgWindow(str);

    function MyMsgWindow(str) {
        var MsgWindow = window.open("HTML/Показать таблицы в HTML-виде.html", null, "status=no,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes");
        MsgWindow.document.body.innerHTML = str;
    }
}