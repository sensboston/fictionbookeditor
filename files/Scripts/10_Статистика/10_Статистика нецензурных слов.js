// Скрипт «Статистика нецензурных слов» для редактора Fiction Book Editor (FBE).
// Версия 1.8
// автор — stokber (февраль 2025).
// В скрипте использован регексп-антимат за авторством imDaniX (https://gist.github.com/imDaniX/8449f40655fcc1b92ae8d756cbca1264#file-swears-javascript-regex) дополненный рядом изменений-добавок.

function Run() {
    
    var name = "«Статистика нецензурных слов»";
    var version = "1.8";
    // --------------------------------------------------------------------------------------------
    /// НАСТРОЙКИ
    
  /// Здесь, с помощью переменной "okno" можно настроить в каком окне показывать результаты статистики: обычном или ModelessDialog. Имеются сообщения, что обычное html-окно может долго открываться. Из плюсов обычного окна — возможность тут же выделить и скопировать нужные вам строки. Окно ModelessDialog не позволяет выделить и скопировать из него, но зато открывается как правило быстро. В случае выбора окна ModelessDialog, есть возможность помещения всего содержимого таблицы статистики в буфер обмена. Это можно сделать настроив параметры переменной "tablCopu". 

    var okno = 0; // 0 — обычное html-окно; 1 — Modelles-окно.
	
    var tablCopu = 1; //0 — пропустить копирование таблицы; 1 — копировать в буфер (работает только с окном ModellesDialog, в обычном html-окне игнорируется).
    
    // Считать ли все слова со звёздочками вконце (возможно это просто маркеры сносок) подозрительными? Выберите да или нет:
    var astEnd = false; // нет
    // var astEnd = true; // да
    
    // ===================================================
    
    var question;
          // if(astEnd == true) { question = "";}
     if(astEnd == false) { question = "бля";}
     if(astEnd == true) { question = "[а-яё]+[*]+";}

    
    var engFoul = "(?:beaver|bellend|clunge|cock|cunt|dick|fuck|gash|knob|minge|motherfuck|prick|punani|pussy|snatch|twat|twunt)";
    var meta = "Meta|Мета";
    var faceInst = "instagram|inst|инстаграм(?:[аеу]|ом)?|инст[аеоуы]|facebook|faceb|ф[-]бу|ф[еэ]йсбук(?:[аеу]|ом)?";
    // var ast = "(?:\\*\\*\\*|\\*|#)";
     var ast = "(?:[*]|#)+";

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
        "|(на|по)?[хx][еe][рp]" +
        "|ниип[её]т" +
        "|[хx][уy]л[eеи]" +

        // звездатый мат:
     /*    "|[а-яё]*(?:х" + ast + "[еёийлюя]|п" + ast + "зд|" + ast + "у[еёийлюя]|б" + ast + "я|" + ast + "б|бл" + ast + "|[её]" + ast + ")[а-яё]+" +
        
         "|[а-яё]+(?:х" + ast + "[еёийлюя]|п" + ast + "зд|" + ast + "у[еёийлюя]|б" + ast + "я|" + ast + "б|бл" + ast + "|[аеиоуъ][её]" + ast + ")[а-яё]*" +

        // и ещё звездатого:
        "|(?:х" + ast + "й|бл" + ast + "|б" + ast + "я|п" + ast + "зд|(?:на|по)?х" + ast + "р)" +
         "|(?:" + ast + "у[ийюя]|" + ast + "ля|" + ast + "б|"+ ast + "[еёи]зд)[а-яё]*" + */
         
         // все-все слова со звёздочками вначале или середине:
         // "|[а-яё]*(?:"+ ast + "[а-яё]+)+[*#]*" +
         "|[а-яё]*(?:"+ ast + "[а-яё]+)+("+ ast + ")?" +
         
         // некоторые слова со звездочками в конце:
          "|(?:возъ|въ|взъ|вы|до|за|изъ|на|недо|объ|отъ|по|подъ|пере|при|про|разъ|съ)?[еёe]"+ ast +
          "|(?:воло|долбо|дуро|зло|земле|куро|мозго|мудо|овце|сестро|трах[ао])?[еёe]"+ ast +
          "|(?:по|на)?[хx][уy]"+ ast +
          "|[б6]л"+ ast +
         
         
          // "|[а-яё]+[*]+" +
           // "|бля" +
           // все-все слова со звездочками в конце по выбору при настройке astEnd в начале скрипта (строки 12-13):
            "|"+question +

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
         // Эту последнюю строку лучше не трогать! Она должна остаться последней.

    var sel = document.getElementById("fbw_body");
    var str = sel.innerText; // текст документа
    str = str.replace(new RegExp("[□▫◦]", "g"), " ");
    
    // ----------------------------------------------------------------------------------------------------------------
    
    // ниже подменяем критические буквы для исключения некоторых особенных буквосочетаний:
    str = str.replace(new RegExp("Дранг нах Остен", "g"), "Дранг наЪ Остен");
    str = str.replace(new RegExp("([^а-яё])р[-]нах(?![а-яё])", "gi"), "$1Ъ");
    
    // ==============================================================
    
    str = str.replace(new RegExp("([a-zа-яё36])[-](?=[a-zа-яё36])", "ig"), "$1 ");

    // основной регексп поиска:
    var regexp = new RegExp("([^а-яёa-z36*#])(?:" +
        // "(?:(?:у|[нз]а|(?:хитро|не)?вз?[ыьъ]|с[ьъ]|(?:и|ра)[зс]ъ?|(?:о[тб]|п[оа]д)[ьъ]?|(?:\\S(?=[а-яё]))+?[оаеи-])-?)?(?:"+

        "(?:(?:([a-zа-яё]*[оаеиуыюяьъ-]))?-?)?(?:" +

        "[еёe](?:[б6](?!о[рй]|рач)|п[уа](?:ц|тс))|" + //
        "и[пб][ае][тцд][ьъ])" +
        ".*?|" +

        // "(?:(?:н[иеа]|(?:ра|и)[зс]|[зд]?[ао](?:т|дн[оа])?|с(?:м[еи])?|а[пб]ч|в[ъы]?|пр[еи])-?)?ху(?:[яйиеёю]|л+и(?!ган)).*?|"+
        // "(?:(?:н[иеа]|(?:ра|и)[зс]|[зд]?[ао](?:т|дн[оа])?|с(?:м[еи])?|а[пб]ч|в[ъы]?|пр[еи])-?)?х[уy](?:[яйиеёю].*?)|" + //
        "(?:(?:н[иеа]|(?:ра|и)[зс]|[зд]?[ао](?:т|дн[оа])?|с(?:м[еи])?|а[пб]ч|в[ъы]?|пр[еи])-?)?[хx][уy](?:[яйиеёю][а-яё]*)|" +

        "[б6]л(?:[эя]|еа?)(?:[дт][ьъ]?)?|" +

        // "\\S*?(?:" +
        "[а-яё]*?(?:" +
        "п(?:" +
        "[иеёe][з3z]д|" + //
        "ид[аое]?р|" + "ед(?:р(?!о)|[аое]р|ик)|" +
        "о[хx][уy]ю" +
        ")|" +
        "[б6]ля(?:[дбц]|тс)|" +
        "[ое][хx][уy][яйиеё]|" +
        "[хx][уy]йн" +
        // ").*?|" + // ?????????????????
        ")[а-яё]*|" +
        

        "(?:о[тб]?|про|на|вы)?м(?:" +
        // "анд(?:[ауеыи](?:л(?:и[сзщ])?[ауеиы])?|ой|[ао]в.*?|юк(?:ов|[ауи])?|е[нт]ь|ища)|" +
        "анд(?:[ауеыи](?:л(?:и[сзщ])?[ауеиы])?|ой|[ао]в[а-яё]*|юк(?:ов|[ауи])?|е[нт]ь|ища)|" +
        // "уд(?:[яаиое].+?|е?н(?:[ьюия]|ей))|" +
        "уд(?:[яаиое][а-яё]*|е?н(?:[ьюия]|ей))|" +
        "[ао]л[ао]ф[ьъ](?:[яиюе]|[еёо]й)" +
        ")|" + 

        "елд[ауые].*?|" +
        "ля[тд]ь|" +
        "(?:[нз]а|по)[хx]|" +

        mat + "|" +
        meta + "|" + faceInst +

        ")(?![а-яёa-z36*#])", "ig"); // 

    var matches = str.match(regexp); // Получаем массив совпадений.

    if (!matches) {
        alert("В документе не найдено нецензурных слов.\n\n"+name+" v."+version);
        return true;
    }
    // -------------------------------------------------------------------------------------------------------
    
    var posl = matches;
    posl = matches.join(""); // массив в последовательный список.
    // alert(posl);
    posl = posl.replace(new RegExp("[^а-яёa-z36*#\\n]+", "img"), "\n");
    
    posl = posl.replace(new RegExp("^" + neMat + "\\n", "img"), ""); // убрать исключения.
    posl = posl.replace(new RegExp("\\n\\n+", "igm"), "\n"); 
     // готовим html-таблицу последовательную::
    posl = posl.replace(new RegExp("^([a-zа-яё36*#-]+)$", "img"), "<tr><td>$1</td></tr>");
    // posl = "<table border=1>" + posl + "</table>"; // список в html.
    posl = "<table align=left border=1><th>Последовательно</th>" + posl + "</table>"; // список в html.
    // alert(posl);
    
    // ======================================================
    
    matches.sort();

    var alf = matches.join(""); // массив в список по алфавиту.
    
    

    alf = alf.replace(new RegExp("[^а-яёa-z36*#\\n]+", "img"), "\n");
    
     // alf = alf.replace(new RegExp("^\\n+", "im"), "");
    
    // alf = alf.replace(new RegExp("[-]", "img"),"\n-");
    alf = alf + "\n";

 alf = alf.replace(new RegExp("^" + neMat + "\\n", "img"), ""); // убрать исключения.

    alf = alf.replace(new RegExp("\\n\\n+", "igm"), "\n"); //

    alf = alf.replace(new RegExp(meta + "|" + faceInst, "igm"), "♣$&"); //

    // ещё раз сортируем:
    var arr = alf.split('\n');
    arr.sort();
    // alert( arr );
    alf = arr.join('\n'); //
    alf = alf + "\n";

    alf = alf.replace(new RegExp("♣", "igm"), ""); //

    if (!alf) {
        alert("В документе не найдено нецензурных слов.\n\n"+name+" v."+version);
        return true;
    } else {
        var countMat = (alf.match(/\n/igm) || []).length;
        countMat--
        countMat-- //???????

        var rX = new RegExp(faceInst, "gi"); // 
        var countFaceInst = (alf.match(rX) || []).length; // 
        var rX = new RegExp(meta, "gi"); // 
        var countMeta = (alf.match(rX) || []).length; // 
        var countMetaFaceInst = countMeta + countFaceInst;
        countMat = countMat - countMetaFaceInst;

        if (!countMat && !countMetaFaceInst) {
        alert("В документе не найдено нецензурных слов.\n\n"+name+" v."+version);
        return true;
        } else alert("Найдено нецензурных слов:\t\t" + countMat + "\n\nУпоминаний запрещённых \nна территории РФ сетей и организаций:\t" + countMetaFaceInst + "\n\n"+name+" v."+version);
    }

    // указываем количество каждого из совпадений:
    for (var i = 100; i >= 0; i--) {
        var dubl = i + 1;
        alf = alf.replace(new RegExp("^([a-zа-яё36*#-]+)\\n(\\1\\n){" + i + "}", "img"), "$1\t" + dubl + "\n");
    }

    // готовим html-таблицу по алфавиту:
    var alf = alf.replace(new RegExp("^([a-zа-яё36*#-]+)\\t(\\d+)$", "img"), "<tr><td>$1</td><td>$2</td></tr>");

    alf = "<table align=left border=1><th>По алфавиту</th>" + alf + "</table>"; // список в html.
    tabl = posl+"<table align=left border=0><tr><td></td></tr></table>"+alf;
    tabl = tabl.replace(new RegExp(engFoul, "img"), "<font color='red'>$&</font>");
    tabl = tabl.replace(new RegExp(meta + "|" + faceInst, "ig"), "<font color='green'>$&</font>");
    tabl = tabl.replace(new RegExp("([а-яё])([a-z36]+)", "ig"), "$1<font color='red'>$2</font>");
    tabl = tabl.replace(new RegExp("([a-z36]+)([а-яё])", "ig"), "<font color='red'>$1</font>$2");
    tabl = tabl.replace(new RegExp("[*#]+", "img"), "<font color='red'>$&</font>");

    MyMsgWindow(tabl);
    // ---------------------------------------------------------------
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
    }   else return true;

    window.external.EndUndoUnit(document);

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
    
    // ================================================

    function MyMsgWindow(tabl) {
    if (okno == 0) {
         var MsgWindow = window.open("HTML/Статистика нецензурных слов.html", null, "height=680,width=400,status=no,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes"); 
         }
    if (okno == 1) {
         var MsgWindow = window.showModelessDialog("HTML/Статистика нецензурных слов.html", null, "height=720,width=400,status=no,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes"); 
         
         // текст для буфера обмена:
         var board = tabl;
         board = board.replace(new RegExp("</td><td>", "ig"), "\t");
         board = board.replace(new RegExp("<th>(Последовательно)</th>", "igm"), "  $1\n");
          board = board.replace(new RegExp("<th>(По алфавиту)</th>", "igm"), "\n\n===================\n\n  $1");
         board = board.replace(new RegExp("</?[^>]+?>", "ig"), "");
         
         if (tablCopu ==1) {
         clipboardData.setData("Text",board); // поместить данные в буфер обмена.
         }
         }

        MsgWindow.document.body.innerHTML = tabl;
    }
}