// ----------------------------------------------------------------
// "Расставить иллюстрации по заданным местам" 
// для редактора Fiction Book Editor (FBE).
// Использованы фрагменты кода из скриптов AlexS и Александра Ка.
// Версия 1.3 (август 2025), автор: stokber
// 
//======================================

function Run() {

    var name = "'Расставить иллюстрации по заданным местам'";
    var version = "1.3";

    //обрабатывать ли history
    var ObrabotkaHistory = true;
    //обрабатывать ли annotation
    var ObrabotkaAnnotation = true;

    var tempus; // время выполнения скрипта

    var fbwBody = document.getElementById("fbw_body");
    var body = fbwBody.firstChild;
    while (body && body.className != "body") body = body.nextSibling; // только первое body

    if (body == null) {
        alert("В документе не найдено ни одного раздела body. Скрипт завершает свою работу.");
        return true
    }

    var result0 = confirm("Прикрепите ваши иллюстрации к документу с расставленными заранее пустыми изображениями. Количество этих иллюстраций должно быть равно количеству пустых изображений. Расставляться в документе они будут согласно алфавитному порядку их имён.\n\nОК — Продолжить; Отмена — Выйти.")
    if (result0 == false) {
        return false
    }

    try {
        var nbspChar = window.external.GetNBSP();
        var nbspEntity;
        if (nbspChar.charCodeAt(0) == 160) nbspEntity = "&nbsp;";
        else nbspEntity = nbspChar;
    } catch (e) {
        var nbspChar = String.fromCharCode(160);
        var nbspEntity = "&nbsp;";
    }

    var Ts = new Date().getTime(); // время начала работы скрипта.
    // ----------------------------------------------------------------------------------------------------

    // Проверка наличия и количества изображений.
    // В этой части использован код взятый из скрипта "Проверить иллюстрации" 
    // за авторством Alex Saveliev.

    var lists = document.all.tiCover.getElementsByTagName("select");

    var covers = "";
    for (var i = 0; i < lists.length; i++)
        if (lists[i].id == 'href') covers += lists[i].value + '|';

    // Find unused images

    var imgs = fbw_body.getElementsByTagName("IMG"),
        imgs_len = imgs.length;

    var bins = document.all.binobj.getElementsByTagName("DIV"),
        bins_len = bins.length;

    var unused = "";

    for (var i = 0; i < bins_len; i++) {
        var found = false;
        var bin = "fbw-internal:#" + bins[i].all.id.value;

        for (var j = 0; j < imgs_len; j++)
            if (imgs[j].src == bin) {
                found = true;
                break;
            }

        if (!found && covers.indexOf(bins[i].all.id.value) == -1) unused += bins[i].all.id.value + "\n";
    }

    var unusedList = unused; // список прикреплённых.

    if (unused == '') {
        if (bins && bins.length > 0) unused = ' • все используются\n';
        else unused = ' • нет бинарных объектов\n';
    }


    // unused="\nНеиспользуемые бинарные объекты: \n"+unused;

    // Find broken images (no binary)

    /*  if (!imgs || imgs.length == 0, !bins || bins.length == 0) {
         MsgBox("\nВ этой книге нет ни обложки, ни иллюстраций. \n\n");
         // return;
     } */

    var broken = "";

    for (var i = 0; i < imgs_len; i++) {
        var found = false;
        var img = imgs[i].src.substr(14);

        for (var j = 0; j < bins_len; j++)
            if (bins[j].all.id.value == img) {
                found = true;
                break;
            }

        if (!found) broken += img + "\n";
    }

    var brokenList = broken // список пустых.
    if (broken == '') broken = " • не найдено\n";

    // MsgBox("           —= AlexS Script=— \n   «Проверка иллюстраций» v.1.1\n\nНеиспользуемые бинарные объекты: \n" +unused+"\nОтсутствующие иллюстрации: \n"+broken);

    // ================================================
    // ---------------------------------------------------------------------------------

    var prolog; // текст для первой строки финального сообщения.

    if (!unusedList && !brokenList) {
        prolog = "Пустые и прикреплённые неиспользуемые изображения отсутствуют.\n\n";
    } else if (!unusedList) {
        prolog = "Прикреплённые неиспользуемые изображения отсутствуют.\n\n";
    } else if (!brokenList) {
        prolog = "Пустые изображения отсутствуют.\n\n";
    } else prolog = "";

    // var rxCover = "cover(_crs)?\.(jpg|png)(_\d+)?";
    // var rxUnused = ".+?[.](jpg|png)_\d+";

    var coverPlusCopies = unusedList.match(/cover(_crs)?\.(jpg|png)(_\d+)?|.+?[.](jpg|png)_\d+/g) || []; // Находим все совпадения
    var colCoverPlusCopies = coverPlusCopies.length;
    coverPlusCopies = coverPlusCopies.join('\n'); //

    unusedList = unusedList.replace(/^cover(_crs)?[.](jpg|png)(_\d+)?\n/igm, ""); // исключаем вероятные обложки.
    unusedList = unusedList.replace(/^.+?[.](jpg|png)_\d+\n/igm, ""); // исключаем вероятные копии.

    var arrUnused = unusedList.split('\n'); // массив неиспользованных изображений.
    var arrBroken = brokenList.split('\n'); // массив пустых изображений.
    var min = Math.min(arrUnused.length - 1, arrBroken.length - 1);
    var colUnused = arrUnused.length - 1; // всего неиспользованных.
    var colBroken = arrBroken.length - 1; // всего пустых
    var colUndefined = (broken.match(/^undefined$/gm) || []).length; // всего пустых с именем "undefined".
    var colNobinUndefined = (broken.match(/nobin_undefined/g) || []).length; // всего пустых с именем "nobin_undefined".

    if (colUndefined == 0) {
        broken = "nobin_undefined (" + colNobinUndefined + " шт.)"
    } else if (colNobinUndefined == 0) {
        broken = "undefined (" + colUndefined + " шт.)"
    } else broken = "undefined (" + colUndefined + " шт.)\nnobin_undefined (" + colNobinUndefined + " шт.)"

    var propusk = "\nПропущенные скриптом, как вероятные обложки и(или) копии изображений (всего " + colCoverPlusCopies + " шт.):\n" + coverPlusCopies + "\n\n--------------------\n";
    var pustue = "\nПустые изображения (всего " + colBroken + " шт.)\nВ том числе:\n" + broken + "\n\n--------------------\n";
    
    // если прикреплённых неиспользуемых изображений более 30,
    // то выводить их список одной строкой через запятую:
    if(colUnused>30){
        unusedList = unusedList.replace(/\n/mg,",\t");
    }
    var prikrep = "\nПрикрепленные неиспользуемые изображения (всего " + colUnused + " шт.): \n" + unusedList + "\n";

    // не показывать соответствующие строки при отсутствии вложений этого типа:
    if (coverPlusCopies == 0) {
        propusk = "";
    }
    if (colBroken == 0) {
        pustue = "";
    }
    if (colUnused == 0) {
        prikrep = "";
    }

    time();

    var msg1 = prolog + "Увы, у вас разное кол-во заданных мест (или пустых изображений) и прикрепленных неиспользуемых иллюстраций!\n\n- заданных мест (undefined) - " + colBroken + ".\n- прикрепленных неиспользуемых иллюстраций  - " + colUnused + ".\n\nРасстановка не будет произведена.\nСкрипт завершает свою работу.\nВремя: " + tempus + ".\nСкрипт " + name + " v." + version + "\n\nПоказать дополнительные сведения о неиспользованных изображениях?\nОК — Да; Отмена — Нет. Выйти."

    var msg2 = propusk + pustue + prikrep;

    if ((arrUnused.length - 1) != (arrBroken.length - 1)) {
        // если количества пустых и прикрепленных неиспользованных не совпадает:
        result1 = confirm(msg1);
        if (result1 == false) return;
        if (result1 == true) {
            // вывести подробную инфу:
            // MyMsgWindow(msg2);
			MsgBox(msg2)
            return;
        }
    }

    // =======================================================
    // ----------------------------------------------------------------------------------------------

    function zamena() {

        var b = body.innerHTML;

        for (var i = 0; i < arrUnused.length - 1; i++) {

            /* var s = "(<(?:DIV|SPAN) onresizestart=\\\"return false\\\" class=image contentEditable=false href=\\\"#)" + arrBroken[i] + "(\\\"><IMG src=\\\"fbw-internal:#)" + arrBroken[i] + "(\\\"><\/(?:DIV|SPAN)>)"; */
			
			
			
			
			
			
			
			// var s = "(<(?:DIV|SPAN) (?:class=image )?onresizestart=\\\"return false\\\" (?:class=image )?contentEditable=false href=\\\"#)" + arrBroken[i] + "(\\\"><IMG src=\\\"fbw-internal:#)" + arrBroken[i] + "(\\\"></(DIV|SPAN)>)"
			
			var s = "(<(?:DIV|SPAN) (?:class=image onresizestart=\\\"return false\\\"|onresizestart=\\\"return false\\\" class=image) contentEditable=false href=\\\"#)" + arrBroken[i] + "(\\\"><IMG src=\\\"fbw-internal:#)" + arrBroken[i] + "(\\\"></(DIV|SPAN)>)"
			
			
			
			
			
			
			
			
			 /* var s = "(<DIV class=image onresizestart=\\\"return false\\\" contentEditable=false href=\\\"#)undefined(\\\"><IMG src=\\\"fbw-internal:#)undefined(\\\"></DIV>)" */
			

            b = b.replace(new RegExp(s, "i"), "$1" + arrUnused[i] + "$2" + arrUnused[i] + "$3");
        }
        body.innerHTML = b;
    }

    // обновление изображений:
    function update() {
        var imgs = document.getElementsByTagName("IMG");
        for (var i = imgs.length - 1; i >= 0; i--) {
            var MyImg = imgs[i];
            var pic_id = MyImg.src;
            MyImg.src = "";
            MyImg.src = pic_id;
        }
        FillCoverList();
    }
    // ========================================================
    // -----------------------------------------------------------------------------------------------------

    function correction() {
        // (подсмотрел у Александра Ка)
        // Замена кода н/р пробела на принятое обозначение в FBE
        // Устраняет небольшой глюк, который получается после вставки в FBE нескольких строк, или после некоторых скриптов
        var re211 = new RegExp("&nbsp;", "g");
        var re211_ = nbspChar;
        var count_211 = 0;
        // Чистка пустых строк от пробелов и внутренних тегов
        var re212 = new RegExp("^(\\\s|" + nbspEntity + "|<[^>]{1,}>){1,}$", "g");
        var re212ex = new RegExp("<SPAN class=image", "g");
        var re212_ = "";
        var count_212 = 0;

        function HandleP(ptr) {
            s = ptr.innerHTML;
            // Коррекция неразрывных пробелов
            if (nbspEntity != "&nbsp;" && s.search(re211) != -1) {
                count_211 += s.match(re211).length;
                s = s.replace(re211, re211_)
            }
            // Чистка пустых строк от пробелов и внутренних тегов
            if (s.search(re212) != -1 && s.search(re212ex) == -1) {
                s = s.replace(re212, re212_);
                count_212++
            }
            ptr.innerHTML = s;
        }
        var ptr = body;
        var ProcessingEnding = false;
        while (!ProcessingEnding && ptr) {
            SaveNext = ptr;
            if (SaveNext.firstChild != null && SaveNext.nodeName != "P" && !(SaveNext.nodeName == "DIV" && ((SaveNext.className == "history" && !ObrabotkaHistory) || (SaveNext.className == "annotation" && !ObrabotkaAnnotation)))) {
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
    }

    function time() {
        var Tf = new Date().getTime(); // Время окончания работы скрипта
        var T2 = Tf - Ts;
        var TsecD = (T2) / 1000;
        var Tsec = Math.floor(TsecD);
        tempus = (TsecD + "").replace(/(.{1,5}).*/g, "$1").replace(/\.$/g, "").replace(".", ",") + " с";
    }

    function MyMsgWindow(msg) {
        var MsgWindow = window.open("HTML/Расставить иллюстрации по заданным местам.html", null, "height=700,width=300,status=no,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes");
        MsgWindow.document.body.innerText = msg;
    }

    // ================================================
    // ----------------------------------------------------------------------------------

    window.external.BeginUndoUnit(document, "расстановку иллюстраций");
    zamena();
    update();
    correction();
    window.external.EndUndoUnit(document);
    time();
    var msg3 = prolog + "Расставлено изображений: \t" + min + "\nВремя: " + tempus + "\nСкрипт " + name + " v." + version + "."
    // вывести в случае удачной расстановки:
    if (propusk == "") {
        // alert(msg3);
        MsgBox(msg3);
    }
    // если остались обложки и(или) копии:
    else {
        result2 = confirm(msg3 + "\n\nПоказать сведения о проигнорированных скриптом изображениях?\nОК — Да; Отмена — Нет. Выйти.");
        if (result2 == false) return;
        if (result2 == true) {
            // вывести подробную инфу:
             MsgBox(propusk);
            // MyMsgWindow(propusk);
            return;
        }
    }
}