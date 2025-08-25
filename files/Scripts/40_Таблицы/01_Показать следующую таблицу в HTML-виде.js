// Скрипт "Показать следующую таблицу в HTML-виде"
// В скрипте использован код из скрипта 
// "Перейти на следующую таблицу" (автор Sclex, сборка TaKir).
// Доработка до заявленного функционала — stokber.
// Версия 1.2 (август, 2025).

function Run() {
var name = "Показать следующую таблицу в HTML-виде";
var ver = "1.2";
    newTable();
    tableHtml();
    // ---------------------------------------------
    function newTable() {
        var blockElementClass = "table"; // класс блочного элемента, который (элемент) нужно искать
        var undoMsg = "переход на следующую таблицу";
        var statusBarMsg = "Переходим на следующую таблицу…";
        var notFoundMsg = "До конца документа не нашлось ни одной таблицы!\n\nСкрипт '"+name+"' "+ver+".";


        try {
            var nbspChar = window.external.GetNBSP();
            var nbspEntity;
            if (nbspChar.charCodeAt(0) == 160) nbspEntity = "&nbsp;";
            else nbspEntity = nbspChar;
        } catch (e) {
            var nbspChar = String.fromCharCode(160);
            var nbspEntity = "&nbsp;";
        };
        var re2 = new RegExp(" |&nbsp;|" + nbspChar, "g");

        function checkP(elem1) {
            //if (elem1.className=="text-author") return true;
            if (hasAmongParents(elem1, "table")) return true;
            return false;
        }

        function hasAmongParents(elem2, nameOfClass) {
            while (elem2 && elem2.nodeName != "BODY") {
                if (elem2.nodeName == "DIV" && elem2.className == nameOfClass) return true;
                elem2 = elem2.parentNode;
            }
            return false;
        }

        function getParentWithClass(elem3, nameOfClass) {
            while (elem3 && elem3.nodeName != "BODY") {
                if (elem3.nodeName == "DIV" && elem3.className == nameOfClass) return elem3;
                elem3 = elem3.parentNode;
            }
            return null;
        }

        var emptyLineRegExp = new RegExp("^( | |&nbsp;|" + nbspChar + ")*?$", "i");

        function isLineEmpty(ptr) {
            return emptyLineRegExp.test(ptr.innerHTML.replace(/<[^>]*?>/gi, ""));
        }

        function getNextNode(el) {
            //alert("Вошли в getNextNode.");
            if (el.firstChild && el.nodeName != "P")
                el = el.firstChild;
            else {
                while (el && !el.nextSibling)
                    el = el.parentNode;
                if (el && el.nextSibling) el = el.nextSibling;
            }
            return el;
        }

        function getNextP(el) {
            var savedEl = el;
            while (el && (el.nodeName != "P" || el == savedEl))
                el = getNextNode(el);
            return el;
        }

        function scrollIfItNeeds() {
            var selection = document.selection;
            if (selection) {
                var range = selection.createRange();
                var count = (range.text.match(/\n/gm) || []).length;
                // var rect = range.getBoundingClientRect();
                // var correction = (rect.bottom - document.documentElement.clientHeight/2); // центр
                // var correction = (rect.bottom - document.documentElement.clientHeight/2); // верх
                // var popravka = (rect.bottom - document.documentElement.clientHeight/8* 6); // низ
                // если таблица занимает более 20 строк сдвигаем её чуть ниже:
                if (count > 20) {window.scrollBy(0, -100);} else {
                window.scrollBy(0, 100);} 
            }
        }

        var s;
        var tr, el, prv, pm, saveNext, saveFirstEmpty, nextPtr;
        var errMsg = "Нет выделения.\n\nПеред запуском скрипта нужно выделить абзацы, которые будут обработаны.";
        tr = document.selection.createRange();

        if (tr.parentElement().nodeName == "TEXTAREA" || tr.parentElement().nodeName == "INPUT") {
            MsgBox("Ошибка. Должно быть выделение в тексте книги, а не в поле ввода.");
            return;
        }
        window.external.BeginUndoUnit(document, undoMsg);
        try {
            window.external.SetStatusBarText(statusBarMsg);
        } catch (e) {}
        var fbwBody = document.getElementById("fbw_body");

        var tr3 = document.selection.createRange();
        tr3.collapse(false);
        var ptr = tr3.parentElement();
        var blockElementAtStart = getParentWithClass(ptr, blockElementClass);
        //alert("blockEndNode: "+ptr.outerHTML);
        ptr = getNextP(ptr);

        while (ptr && fbwBody.contains(ptr)) {
            if (checkP(ptr) && getParentWithClass(ptr, blockElementClass) != blockElementAtStart) break;
            ptr = getNextP(ptr);
        }

        if (ptr && fbwBody.contains(ptr)) {
            var tr1 = document.body.createTextRange();
            var parentElem = getParentWithClass(ptr, blockElementClass);
            if (parentElem) {
                tr1.moveToElementText(parentElem);
                if (tr1.moveStart("character", 1) == 1)
                    tr1.moveStart("character", -1);
                // tr1.moveEnd("character",-1);
                tr1.select();
                scrollIfItNeeds();
                var scriptResult = "Found";
            }
        } else {
            var scriptResult = "NotFound";
            MsgBox(notFoundMsg);
    // -------------------------------------------------
            tr.collapse(false); // Перемещаем курсор в конец выделения.
            tr.select();
            return;
    // ==========================
        }

        try {
            window.external.SetStatusBarText("ОК");
        } catch (e) {}
        window.external.EndUndoUnit(document);
        return scriptResult;
    }

    function tableHtml() {
        var rng = document.selection.createRange();

        if (rng.compareEndPoints("StartToEnd", rng) == 0) {
            // MsgBox("Выделите текст! ");
            return false;
        }

        var pe = rng.htmlText; 

        // pe = pe.replace(/([^>])\r\n(?=[^<])/gmi, "$1");
        // pe = pe.replace(/(<(?:P|DIV) id=)([\w]+)/gi, "$1\"$2\"");
        // удаляем все бесполезные для нашей задачи,
        // но глючащие id-ы и fbstyle
        pe = pe.replace(/(<(?:P|DIV)) id=["]?[\w]+["]?( class)/gi, "$1$2");
        pe = pe.replace(/(<[^>]+?) fbstyle=[\"]?\w+[\"]?([^>]*?>)/gi, "$1$2");

        /* MsgBox(pe);
        window.clipboardData.setData("text",pe); */

        pe = pe.replace(/&nbsp;|[□▫◦]/g, " "); // опрощаем н.пр.
        // убираем префикс fb из атрибутов (только в тегах):
        pe = pe.replace(/fb((?:valign|align|colspan|rowspan)=)(?=[^>]*?>)/ig, "$1"); // !!!
        // Преобразуем:
       // ячейки:
        pe = pe.replace(/<P class=(td[^>]*?)>([\s\S]+?)<\/P>/ig, "<$1>$2</td>");
        // ячейки-заголовки: 
        pe = pe.replace(/<P class=(th[^>]*?)>([\s\S]+?)<\/P>/ig, "<$1>$2</th>");
        // строки:
        pe = pe.replace(/<DIV class=(tr[^>]*)>([\s\S]+?)<\/DIV>/img, "<$1>$2</tr>");
       // таблицы: 
        pe = pe.replace(/<DIV class=(table[^>]*)>([\s\S]+)<\/DIV>/im, "<$1>$2</table>");

        //поправка для недовыделенной таблицы состоящей из одной ячейки:
        if (/^<table[^>]*( [^>]*)?>/m.test(pe) == false && /^<tr( [^>]*)?>/m.test(pe) == false)
        {
        pe = pe.replace(/^<td ?([^>]*)?>[^<>]+<\/td>$/im, "<table><tr>$&</tr></table>");
        }
        //поправка для недовыделенной таблицы состоящей из одной строки:
        if (/^<table( [^>]*)?>/m.test(pe) == false && /^<tr( [^>]*)?>/m.test(pe) == true)
        {
         pe = pe.replace(/^[\s\S]+$/im, "<table>$&</table>");
        }
		
		// MsgBox(pe);
        // window.clipboardData.setData("text",pe);

        MyMsgWindow(pe);

        function MyMsgWindow(pe) {
            var MsgWindow = window.open("HTML/Показать таблицы в HTML-виде.html", null, "status=no,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes");
            MsgWindow.document.body.innerHTML = pe;
        }
    }
}