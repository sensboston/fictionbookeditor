// Скрипт «Статистика нецензурных слов» для редактора Fiction Book Editor (FBE).
// Версия 1.4
// автор — stokber (октябрь 2024).
// В скрипте использован регексп-антимат за авторством imDaniX (https://gist.github.com/imDaniX/8449f40655fcc1b92ae8d756cbca1264#file-swears-javascript-regex) дополненный рядом изменений-добавок.

function Run() {

    var version = "1.4";
    var engFoul = "(?:beaver|bellend|clunge|cock|cunt|dick|fuck|gash|knob|minge|motherfuck|prick|punani|pussy|snatch|twat|twunt)";
    var meta = "Meta|Мета";
    var faceInst = "instagram|inst|инстаграм(?:[аеу]|ом)?|инст[аеоуы]|facebook|faceb|ф[-]бу|ф[еэ]йсбук|фейсб(?:[аеу]|ом)?";
    var ast = "(?:\\*\\*\\*|\\*|#)";

    //                                             СЛОВА-МАТЫ.
    // Если скрипт не считает какое-слово матом, хотя на самом деле оно им является, добавьте его в переменную "mat":
    var mat = "(?:прошмандово?к)(?:а|ами?|ах|е|и|ой|у)?" +
        "|(?:залуп)(?:(?:а|ами?|ах|е|ы|ой|у)?|о(?:подобн|образн|глаз)[а-я]+)" +
        "|под(?:залупн)[а-я]+" +

        "|[её]пт" +
        "|ети(?:ть)?" +
        "|замудохать?ся" +
        "|замудохал(?:[аи]сь|ся)" +
        "|мандей" +
        "|мля(?:ть)?" +
        // "|муд[еия]" +
        "|(?:не)?вротебуч[аеи][яийх]" +
        "|(?:ни)?и[бп]ацц?[ао]" +
        "|(на|по)?[хx]ер" +
        "|ниип[её]т" +
        "|хул[еи]" +

        // звездатый мат:
        "|[а-яё]*(?:х" + ast + "[еёийлюя]|п" + ast + "зд|" + ast + "у[еёийлюя]|б" + ast + "я|" + ast + "б|бл" + ast + "|[её]" + ast + ")[а-яё]+" +
        
         "|[а-яё]+(?:х" + ast + "[еёийлюя]|п" + ast + "зд|" + ast + "у[еёийлюя]|б" + ast + "я|" + ast + "б|бл" + ast + "|[её]" + ast + ")[а-яё]*" +

        // и ещё звездатого:
        "|(?:х" + ast + "й|бл" + ast + "|б" + ast + "я|п" + ast + "зд|(?:на|по)?х" + ast + "р)" +
         "|(?:" + ast + "у[ийюя]|" + ast + "ля|" + ast + "б|"+ ast + "[еёи]зд)[а-яё]*" +

        // английские маты сами по себе и внутри других слов:
        "|[a-z]*(?:beaver|bellend|clunge|cock|cunt|dick|fuck|gash|knob|minge|motherfuck|prick|punani|pussy|snatch|twat|twunt)[a-z]*" +

        // мат с вкраплениями латиницей или цифрами:
        "|[а-яё]*(6ля|e6|[eё]6|мyд|п(?:иеeё)[3z]д|хy(?:eеийлюя)|xу(?:eеийлюя)|xy(?:eеийлюя)|мудa[kк]|[её]б[ay]|хуe)[а-яё]*" +

        // —————————————————————————
        // ниже (между двумя горизонтальными линиями) можно добавлять свои слова- и регекспы-маты:
        // "|слово-или-регексп"+
        // "|слово-или-регексп"+
        // "|слово-или-регексп"+
        // ————————————————————————
        "|[а-яё]*(?:гандо[нш])[а-яё]*"
    // Эту последнюю строку лучше не трогать! Она должна остаться последней.

    //                                    СЛОВА-ИСКЛЮЧЕНИЯ.
    // Если скрипт считает какое-слово матом, хотя на самом деле оно им не является, добавьте его в переменную "neMat":
    var neMat = "(абляци[а-я]+" +
        "|(?:вы|до|за|от|про|со)?скоблятся" +
        "|скипидар|" + "(?:[зн]а)?скипидар[а-я]+" +
        "|(?:по)?лапидаре?н[а-я]*" +
        "|мандал[аеуы]" +
        "|педик(?:улез|юр)[а-яё]*" +
        "|сваебо[еиюя](?:в|ми?|х|ц)?" +
        "|своебытн[а-я]+" +
        "|сплоху(?:й(?:те)?|ем|ете?|ешь)" +
        "|мудир[а-я]*" +
        "|мудехар[а-я]*" +
        "|Педр[оу]+" +
        "|Педерсен[а-я]*" +
        "|Мандел(?:а|е|ой|у|ы)" +
        "|Мандулис[аеу]" +
        "|ипатьевск[а-я]+" +
        "|педикулофоби[а-я]" +
        "|цитопедикул[а-я]*" +
        "|Мударр[а-я]+" +
		"|Лееб[а-я]+" +

        //——————————————————————————————————
        // ниже (между двумя горизонтальными линиями) можно добавлять свои слова- и регекспы-исключения:
        // "|слово-или-регексп"+
        // "|слово-или-регексп"+
        // "|слово-или-регексп"+
        //——————————————————————————————————
        "|[а-яё]*эпидерм[а-я]+)"; 
        // "|(?:внутри|интра|муко|радио|суб)?эпидерм[а-я]+)"; // Эту последнюю строку лучше не трогать! Она должна остаться последней.

    var sel = document.getElementById("fbw_body");
    var str = sel.innerText; // текст документа
    str = str.replace(new RegExp("[□▫◦]", "g"), " ");
    
    str = str.replace(new RegExp("Дранг нах Остен", "g"), "Дранг наЪ Остен");
    str = str.replace(new RegExp("([^а-яё])р[-]нах(?![а-яё])", "gi"), "$1Ъ");
    
    str = str.replace(new RegExp("([a-zа-яё36])[-](?=[a-zа-яё36])", "ig"), "$1 ");

    // основной регексп поиска:
    var regexp = new RegExp("([^а-яёa-z36*#])(?:" +
        // "(?:(?:у|[нз]а|(?:хитро|не)?вз?[ыьъ]|с[ьъ]|(?:и|ра)[зс]ъ?|(?:о[тб]|п[оа]д)[ьъ]?|(?:\\S(?=[а-яё]))+?[оаеи-])-?)?(?:"+

        "(?:(?:([a-zа-яё]*[оаеиуыюяьъ-]))?-?)?(?:" +

        "[её](?:[б6](?!о[рй]|рач)|п[уа](?:ц|тс))|" + //
        "и[пб][ае][тцд][ьъ])" +
        ".*?|" +

        // "(?:(?:н[иеа]|(?:ра|и)[зс]|[зд]?[ао](?:т|дн[оа])?|с(?:м[еи])?|а[пб]ч|в[ъы]?|пр[еи])-?)?ху(?:[яйиеёю]|л+и(?!ган)).*?|"+
        // "(?:(?:н[иеа]|(?:ра|и)[зс]|[зд]?[ао](?:т|дн[оа])?|с(?:м[еи])?|а[пб]ч|в[ъы]?|пр[еи])-?)?х[уy](?:[яйиеёю].*?)|" + //
		"(?:(?:н[иеа]|(?:ра|и)[зс]|[зд]?[ао](?:т|дн[оа])?|с(?:м[еи])?|а[пб]ч|в[ъы]?|пр[еи])-?)?х[уy](?:[яйиеёю][а-яё]*)|" +

        "бл(?:[эя]|еа?)(?:[дт][ьъ]?)?|" +

        // "\\S*?(?:" +
		"[а-яё]*?(?:" +
        "п(?:" +
        "[иеё][з3z]д|" + //
        "ид[аое]?р|" + "ед(?:р(?!о)|[аое]р|ик)|" +
        "охую" +
        ")|" +
        "бля(?:[дбц]|тс)|" +
        "[ое]ху[яйиеё]|" +
        "хуйн" +
        ").*?|" +

        "(?:о[тб]?|про|на|вы)?м(?:" +
        // "анд(?:[ауеыи](?:л(?:и[сзщ])?[ауеиы])?|ой|[ао]в.*?|юк(?:ов|[ауи])?|е[нт]ь|ища)|" +
        "анд(?:[ауеыи](?:л(?:и[сзщ])?[ауеиы])?|ой|[ао]в[а-яё]*|юк(?:ов|[ауи])?|е[нт]ь|ища)|" +
        // "уд(?:[яаиое].+?|е?н(?:[ьюия]|ей))|" +
        "уд(?:[яаиое][а-яё]*|е?н(?:[ьюия]|ей))|" +
        "[ао]л[ао]ф[ьъ](?:[яиюе]|[еёо]й)" +
        ")|" +

        "елд[ауые].*?|" +
        "ля[тд]ь|" +
        "(?:[нз]а|по)х|" +

        mat + "|" +
        meta + "|" + faceInst +

        ")(?![а-яёa-z36*#])", "ig"); // 

    var matches = str.match(regexp); // Получаем массив совпадений.

    if (!matches) {
        alert("В документе не найдено нецензурных слов.\n\n«Статистика нецензурных слов» v."+version);
        return true;
    }
    matches.sort();

    var str2 = matches.join(""); // массив в список.

    str2 = str2.replace(new RegExp("[^а-яёa-z36*#\\n]+", "img"), "\n");
    
    // str2 = str2.replace(new RegExp("[-]", "img"),"\n-");
    str2 = str2 + "\n";

 str2 = str2.replace(new RegExp("^" + neMat + "\\n", "img"), ""); // убрать исключения.

    str2 = str2.replace(new RegExp("\\n\\n+", "igm"), "\n"); //

    str2 = str2.replace(new RegExp(meta + "|" + faceInst, "igm"), "♣$&"); //

    // ещё раз сортируем:
    var arr = str2.split('\n');
    arr.sort();
    // alert( arr );
    str2 = arr.join('\n'); //
    str2 = str2 + "\n";

    str2 = str2.replace(new RegExp("♣", "igm"), ""); //

    if (!str2) {
        alert("В документе не найдено нецензурных слов.\n\n«Статистика нецензурных слов» v."+version);
        return true;
    } else {
        var countMat = (str2.match(/\n/igm) || []).length;
        countMat--
        countMat-- //???????

        var rX = new RegExp(faceInst, "gi"); // 
        var countFaceInst = (str2.match(rX) || []).length; // 
        var rX = new RegExp(meta, "gi"); // 
        var countMeta = (str2.match(rX) || []).length; // 
        var countMetaFaceInst = countMeta + countFaceInst;
        countMat = countMat - countMetaFaceInst;

        if (!countMat && !countMetaFaceInst) {
        alert("В документе не найдено нецензурных слов.\n\n«Статистика нецензурных слов» v."+version);
        return true;
        } else alert("Найдено нецензурных слов:\t\t" + countMat + "\n\nУпоминаний запрещённых \nна территории РФ сетей и организаций:\t" + countMetaFaceInst + "\n\n«Статистика нецензурных слов» v."+version);
    }

    // указываем количество каждого из совпадений:
    for (var i = 100; i >= 0; i--) {
        var dubl = i + 1;
        str2 = str2.replace(new RegExp("^([a-zа-яё36*#-]+)\\n(\\1\\n){" + i + "}", "img"), "$1\t" + dubl + "\n");
    }

    // готовим html-таблицу:
    var str3 = str2.replace(new RegExp("^([a-zа-яё36*#-]+)\\t(\\d+)$", "img"), "<tr><td>$1</td><td>    </td><td>$2</td></tr>");
    str3 = "<table>" + str3 + "</table>"; // список в html.

    str3 = str3.replace(new RegExp(engFoul, "img"), "<font color='red'>$&</font>");
    str3 = str3.replace(new RegExp(meta + "|" + faceInst, "ig"), "<font color='green'>$&</font>");
    str3 = str3.replace(new RegExp("([а-яё])([a-z36]+)", "ig"), "$1<font color='red'>$2</font>");
    str3 = str3.replace(new RegExp("([a-z36]+)([а-яё])", "ig"), "<font color='red'>$1</font>$2");

    str3 = str3.replace(new RegExp("[*#]+", "img"), "<font color='red'>$&</font>");

    MyMsgWindow(str3);

    window.external.BeginUndoUnit(document, "добавление записи в аннотацию");

   if (countMat > 0) {
        result = confirm("Оставить запись о наличии неценцурной лексики в аннотации?")
        if (result == true) {
            var msg_1 = "<EM>Содержит нецензурную лексику.</EM>";
            addToAnno();
        }
    }

   if (countFaceInst > 0) {
        result = confirm("Оставить в аннотации запись о наличии упоминаний социальных сетей и экстремитских организаций запрещённых на территории РФ (Meta, Facebook и/или Instagram)?")
        if (result == true) {
           var msg_1 = "<EM>* В тексте упоминаются социальные сети Facebook и/или Instagram (организации, запрещённые на территории РФ).</EM>";
            addToAnno();
            var msg_1 = "<EM>** Meta Platforms Inc. признана экстремистской организацией на территории РФ.</EM>";
            addToAnno();
        }
    }

    if (countMeta > 0 && countFaceInst == 0) {
        result = confirm("Оставить в аннотации запись о наличии упоминаний Meta Platforms Inc. (признана экстремистской организацией на территории РФ).?")
        if (result == true) {
            var msg_1 = "<EM>** Meta Platforms Inc. признана экстремистской организацией на территории РФ.</EM>";
            addToAnno();
        }
        // alert("«Статистика нецензурных слов» v."+version)
    }   else return true;

    window.external.EndUndoUnit(document);

    function MyMsgWindow(str3) {
        var MsgWindow = window.open("HTML/Статистика нецензурных слов.html", null, "status=no,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes, width=50"); // ??????????????????????????

        MsgWindow.document.body.innerHTML = str3;
        // MsgWindow.moveTo(0, 0);
    }

    // добавление в аннотацию:
    // (подсмотрено у Александра Ка)
    function addToAnno() {
        var fbwBody = document.getElementById("fbw_body");
        //   Неразрывные пробелы  ;  ("+nbspEntity+") - для поиска  ;  ("+nbspChar+") - для замены  ;
        try {
            var nbspChar = window.external.GetNBSP();
            var nbspEntity;
            if (nbspChar.charCodeAt(0) == 160) nbspEntity = "&nbsp;";
            else nbspEntity = nbspChar
        } catch (e) {
            var nbspChar = String.fromCharCode(160);
            var nbspEntity = "&nbsp;"
        }

        var SearchAnno = fbwBody.firstChild;
        while (SearchAnno != null && SearchAnno.className != "annotation") SearchAnno = SearchAnno.nextSibling; //  Поиск аннотации к книге

        if (SearchAnno == null) {
            alert("Аннотации не найдено!");
            return true;
        } //   Если нет аннотации...
        // else {alert("Аннотация найдена!");}
        // SearchAnno = document.createElement("DIV");     //   Создание нового раздела

        //   Дополнение аннотации новой записью
        var reH01 = new RegExp("^(</?[^>]+>){0,}(&nbsp;|\\\s|" + nbspEntity + "){0,}(</?[^>]+>){0,}$", "g");
        // window.external.BeginUndoUnit(document,"добавление записи в аннотацию");  

        while (SearchAnno.lastChild && SearchAnno.lastChild.innerHTML.search(reH01) != -1) SearchAnno.lastChild.removeNode(true); //  Удаление последних пустых строк
        if (SearchAnno != null) {

            SearchAnno.insertAdjacentElement("beforeEnd", document.createElement("P"));
            SearchAnno.lastChild.innerHTML = "&nbsp;"
            SearchAnno.insertAdjacentElement("beforeEnd", document.createElement("P"));
            SearchAnno.lastChild.innerHTML = msg_1;
        }

        while (SearchAnno.firstChild && SearchAnno.firstChild.innerHTML.search(reH01) != -1) SearchAnno.firstChild.removeNode(true); //  Удаление начальных пустых строк
        // window.external.EndUndoUnit(document); 
    }

}