//Скрипт "Замена слов по списку из буфера обмена" v.1.2;
//автор — stokber (2025, сентябрь)

var name = "Замена слов по списку из буфера обмена";
var vers = "1.2";

//обрабатывать ли history
var ObrabotkaHistory = true;
//обрабатывать ли annotation
var ObrabotkaAnnotation = true;

function Run() {

    // try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
    // catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

    var check = "Проверьте свой список. Возможно, вы забыли поместить его в буфер обмена.";
    var help = "\n\nСправка\n\nСкрипт производит замену английских и русских слов. Перед запуском скопируйте в буфер обмена список замен. Список представляет собой любое количество строк с парой разделённых пробелом слов — то, которое меняем и то, на которое меняем. Перед, после и между ними (словами) может находиться любое количество пробелов. Пустые строки между таких строк замен игнорируются. В списке не должно быть никаких других символов, кроме пробелов и букв русского и английского алфавитов. В качестве списка замен может выступать любой скопированный текст из любой программы, включая FBE.\n\nПример строки замен:\n\nашипка ошибка\nапичатка опечатка\nмалако молоко\n";

    var str = window.clipboardData.getData('Text');
    if (str == null) {
        MsgBox("Буфер обмена пуст или в нем нет текстовых данных!" + help);
        return;
    };
    else {

        str = str.replace(/&nbsp;/g, " "); // норм. пробелы.
        str = str.replace(/( |□|▫|◦)+/g, " "); // норм. пробелы.

        str = str.replace(/^ +| +$/gm, ""); // уд. нач. и кон. пробелы.
        str = str.replace(/\r\n(\r\n)+/gm, "\r\n"); // уд. пустые стр.
        str = str.replace(/^\r\n|\r\n$/gm, ""); // нач. и кон. недопереводы строки.
        // alert("после удаления пробелов:\n\n"+str);
        if (str == false) {
            MsgBox("Буфер обмена пуст или в нем нет текстовых данных!" + help);
            return;
        };

        var regexp = new RegExp("[^a-zа-яё\\s]", "i");
        if (regexp.test(str)) {
            MsgBox("По меньшей мере один символ в вашем списке из буфера обмена не является буквой. Проверьте свой список замен." + help);
            return;
        }

        // здесь добавить проверку правильного кол. (2) слов в одной строке.
        var regexp = new RegExp("[a-zа-яё]+ [a-zа-яё]+ [a-zа-яё]+", "i");
        if (regexp.test(str)) {
            MsgBox("По меньшей мере одна строка в вашем списке из буфера обмена состоит из более чем двух слов. Проверьте свой список." + help);
            return;
        }
        var regexp = new RegExp("^[a-zа-яё]+$", "im");
        if (regexp.test(str)) {
            MsgBox("По меньшей мере одна строка в вашем списке из буфера обмена состоит из только одного слова. Проверьте свой список замен." + help);
            return;
        }

        var result = confirm("В буфере обмена обнаружен следующий список замен:\n\n" + str + "\n\nПродолжить выполнение скрипта?");
        if(result == false) return;

        var Ts = new Date().getTime();
        var TimeStr = 0;

        // Подсчёт кол. совпадений:
        var body = document.getElementById("fbw_body");
        var txt = body.innerText;
        str2 = str.replace(/^([a-zа-яё]+) ([a-zа-яё]+)$/igm, "$1"); // 
        str2 = str2.replace(/\r\n/igm, "|");
        // alert(str2);
        var rx1 = new RegExp("(^|[^a-zа-яё])(" + str2 + ")(?=[^a-zа-яё]|$)", "g"); // 

        // формируем строки замен:
        str = str.replace(/^([a-zа-яё]+) ([a-zа-яё]+)$/igm, "\"$1\": \"$2\","); // формируем строки замен.

        // str = str.replace(/(\")(\.|\?|\-|\+|\*|\\|\/|\(|\)|\[|\]|\^|\$|\|)(\":)/gm, "$1\\\\$2$3"); //
        str = str.replace(/\r\n/gm, ""); // уд. все переводы строк.
        str = str.replace(/,$/g, ""); // уд. последнюю зап.
        str = str.replace(/^.+$/gm, "var words = {$&};"); // формируем строку переменной. 
        // str = str.replace(/"\"(?=\")"/g, "\"\\\"\""); // поправка для дв. комп. кавычек.
        // str = str.replace(/\"\\\\\\": /g, "\"\\\\\\\\\": "); //поправка для слэшей до.
        // str = str.replace(/: \"\\\"/g, ": \"\\\\\""); //поправка для слэшей после.
    }

    eval(str);

    //~~~~~~~~~~ Регулярные выражения ~~~~~~~~~~~~

    // регекспы для простановки меток:
    var metkaStart = "ЪЪ☺ЪЪ";
    var metkaEnd = "ЪЪ☻ЪЪ";
    var re1 = new RegExp("([a-zA-Zа-яёА-ЯЁ](?:</?[^>]+>)+)(" + str2 + ")", "ig");
    var re1_ = "$1" + metkaStart + "$2" + metkaEnd;

    var re2 = new RegExp("([^a-zA-Zа-яёА-ЯЁ])(" + str2 + ")((?:</?[^>]+>)+)(?=[a-zA-Zа-яёА-ЯЁ])", "g");
    var re2_ = "$1" + metkaStart + "$2" + metkaEnd + "$3";

    var re3 = new RegExp("^(" + str2 + ")((?:</?[^>]+>)+)(?=[a-zA-Zа-яёА-ЯЁ])", "g");
    var re3_ = metkaStart + "$1" + metkaEnd + "$2";

    // для удаления меток:
    var re5 = new RegExp(metkaStart + "|" + metkaEnd, "g");
    var re5_ = "";

    //~~~~~~~~~~~~~~ Конец шаблонов ~~~~~~~~~~~~~~~~~~

    var count1 = 0;
    var s = "";
    // функция, обрабатывающая абзац P
    function HandleP(ptr) {

        s = ptr.innerHTML;

        while (s.search(re1) != -1) {
            s = s.replace(re1, re1_);
        }
        while (s.search(re2) != -1) {
            s = s.replace(re2, re2_);
        }
        if (s.search(re3) != -1) {
            s = s.replace(re3, re3_);
        }

        count1 = (txt.match(rx1) || []).length; // подсчёт совпадений.

        for (var key in words) {
            if (words.hasOwnProperty(key)) {
                var correct = words[key];

                s = s.replace(new RegExp("(^|>)[^<>]+(<|$)", "g"), function(match) {
                    var rx = new RegExp("(^|[^&a-zA-Z0-9а-яёА-ЯЁ])" + key + "(?=[^a-zA-Z0-9а-яёА-ЯЁ]|$)", "g"); // 
                    var rx_ = "$1" + correct;
                    return match.replace(new RegExp(rx), rx_); //
                });
            }
        }

        if (s.search(re5) != -1) {
            s = s.replace(re5, re5_);
        }

        ptr.innerHTML = s;
    }

    window.external.BeginUndoUnit(document, "замену слов"); // ОТКАТ (UNDO) начало

    var body = document.getElementById("fbw_body");
    var ptr = body;
    var ProcessingEnding = false;
    while (!ProcessingEnding && ptr) {
        SaveNext = ptr;
        if (SaveNext.firstChild != null && SaveNext.nodeName != "P" &&
            !(SaveNext.nodeName == "DIV" &&
                ((SaveNext.className == "history" && !ObrabotkaHistory) ||
                    (SaveNext.className == "annotation" && !ObrabotkaAnnotation)))) {
            SaveNext = SaveNext.firstChild;
        } // либо углубляемся...
        else {
            while (SaveNext.nextSibling == null) {
                SaveNext = SaveNext.parentNode; // ...либо поднимаемся (если уже сходили вглубь)
                // поднявшись до элемента P, не забудем поменять флаг
                if (SaveNext == body) {
                    ProcessingEnding = true;
                }
            }
            SaveNext = SaveNext.nextSibling; //и переходим на соседний элемент
        }
        if (ptr.nodeName == "P") HandleP(ptr);
        ptr = SaveNext;
    }

    window.external.EndUndoUnit(document); // undo конец.

    var body = document.getElementById("fbw_body");
    var txt = body.innerText;
    var count2 = (txt.match(rx1) || []).length; //
    var count = count1 - count2;
    var matches = txt.match(rx1);

    if (!matches) {
        MsgBox("Заменено слов: " + count + "\n\nСкрипт '" + name + "' v." + vers);
        return;
    } else {

    var result2 = confirm("Заменено слов:           	" + count + "\nНе исправлено слов: 	" + count2 + "\n\nСценарий игнорирует слова с неполным или различным начертанием (напр. смесью курсива, полужирного и(ли) обычного), т. к. не уверен в  их верном распознавании. Чтобы найти такие слова и заменить самостоятельно, вставьте в окно 'Поиск' регулярное выражение из буфера обмена. Отметьте галочками пункты 'Учитывать регистр' и 'Регулярные выражения'.\n\nПОМЕСТИТЬ В БУФЕР ОБМЕНА РЕГУЛЯРНОЕ ВЫРАЖЕНИЕ ДЛЯ ПОИСКА? \n\nСкрипт '" + name + "' v." + vers);}
        if(result2 == false) return;
        else {

        matches = matches.join('\n'); // объединить массив в строку.
        matches = matches.replace(/^[^a-zа-яё]/gmi, ""); // 
        var arr = matches.split('\n');
        arr.sort();
        matches = arr.join('\n');
        matches = matches.replace(/^([a-zа-яё]+\n)\1+/gmi, "$1");
        matches = matches.replace(/^([a-zа-яё]+)\n\1$/gmi, "$1");
        matches = matches.replace(/\n/gm, "|");
        matches = matches.replace(/.+/, "(?<![a-zA-Zа-яёА-ЯЁ])(" + matches + ")(?![a-zA-Zа-яёА-ЯЁ])");

        clipboardData.setData("Text", matches); // поместить данные в буфер обмена.

    }
}