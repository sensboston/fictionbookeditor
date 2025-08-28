// Скрипт "Помочь заменить таблицы на их изображения" v1.11
// Автор stokber (август 2025).
// В скрипте использованы фрагменты кода из скриптов за авторством Sclex-а.

function Run() {
    var name = "Помочь заменить таблицы на их изображения";
    var version = "1.11";
    var count_01; // счётчик удалённых меток таблиц.

    // функция удаления меток таблиц:
    function delNum() {
        // флаг - обрабатывать ли history
        var processHistory = false;
        // флаг - обрабатывать ли annotation
        var processAnnotation = false;

        try {
            var nbspChar = window.external.GetNBSP();
            var nbspEntity;
            if (nbspChar.charCodeAt(0) == 160) nbspEntity = "&nbsp;";
            else nbspEntity = nbspChar;
        } catch (e) {
            var nbspChar = String.fromCharCode(160);
            var nbspEntity = "&nbsp;";
        }

        var re0 = new RegExp("^zzz_табл \\\d+ из \\\d+_zzz$", "");
        /*  var re0=new RegExp("^( | |&nbsp;|"+nbspChar+")*?$",""); */
        var re2 = new RegExp("<(?!img)[^>]*?>", "gi");
        var re1 = new RegExp("^(title|section|poem|text-author|cite|epigraph|stanza|body)$", "");

        var id, nodeToRemove;
        var saveNode = null;
        var s = "";
        count_01 = 0;
        var fbw_body = document.getElementById("fbw_body");
        var ptr = fbw_body;
        var endProcessing = false;
        var saveNext;

        while (!endProcessing && ptr) {
            saveNext = ptr;
            if (saveNext.firstChild && saveNext.nodeName != "P" &&
                !(saveNext.nodeName == "DIV" &&
                    (
                        (saveNext.className == "history" && !processHistory) ||
                        (saveNext.className == "annotation" && !processAnnotation) ||
                        (saveNext.className == "body" &&
                            (
                                saveNext.getAttribute("fbname") == "notes" ||
                                saveNext.getAttribute("fbname") == "comments"
                            )
                        ) ||
                        saveNext.className == "table"
                    )
                )
            ) {
                saveNext = saveNext.firstChild;
                saveNode = null;
            }
            // либо углубляемся...
            else {
                saveNode = saveNext.parentNode;
                while (!saveNext.nextSibling) {
                    saveNext = saveNext.parentNode;
                    // ...либо поднимаемся (если уже сходили вглубь)
                    if (saveNext == fbw_body) endProcessing = true;
                }
                saveNext = saveNext.nextSibling; // и переходим на соседний элемент
            }
            if (ptr.nodeName == "P") {
                if (re0.test(ptr.innerHTML.replace(re2, ""))) {
                    ptr.removeNode(true);
                    count_01++;
                }
            }


            while (saveNode && saveNode.nodeName == "DIV" && re1.test(saveNode.className) && !saveNode.firstChild) {
                nodeToRemove = saveNode;
                saveNode = saveNode.parentNode;
                nodeToRemove.removeNode(true);
            }
            ptr = saveNext;
        }

    }
    // ======================================

	var vopros1 = "Чтобы расставить метки и пустые изображения над таблицами, нажмите 'OK'.\n\nЧтобы удалить метки и таблицы, нажмите 'Отмена'.\n\nP.S. В следующем окне можно отказаться от обеих вариантов и прочесть «справку».";

    var result = confirm(vopros1);
    var vubor;
    if (result == true) {
        vubor = "вставку пустых изображений и соответствующих им меток."
    }
    if (result == false) {
        vubor = "удаление ВСЕХ-ВСЕХ таблиц и соответствующих им меток."
    }

    var vopros2 = "Вы выбрали " + vubor + " \nЕсли хотите продолжить, нажмите 'OK'.\n\nЕсли хотите завершить работу и прочесть «справку», нажмите 'Отмена'.";
    var help = "Cправка\n\nСкрипт призван помочь массово заменить таблицы на их изображения. \nНа первом этапе скрипт поможет расставить пустые изображения и соответствующие им номерные метки вида 'zzz_табл 1 из 10_zzz' НАД таблицами. Затем, после самостоятельной расстановки изображений таблиц (эта процедура, как и изготовление самих изображений, не входит в функционал сценария) скрипт поможет избавиться от ВСЕХ-ВСЕХ таблиц и соответствующих им меток, если таковые (метки) имеются. Следует иметь ввиду, что хотя метки и сформатированы в документе зачёркнутым текстом (сделано это для большего различения с оригинальным текстом документа fb2), удаляться метки вида 'zzz_табл 1 из 10_zzz' будут независимо от их внешнего или внутреннего форматирования, будь то зачеркнутый, курсивный, полужирный, надстрочный или подстрочный текст.";

    var result2 = confirm(vopros2);
    if (result2 == false) {
        MsgBox(help);
        return;
    }

    // строка для меню замены:
    var cancel;
    if (result == true) {
        cancel = "вставку пустых изображений";
    }
    if (result == false) {
        cancel = "удаление всех таблиц";
    }

    // ====================================

    var fbwBody, allDivs, i, removedTablesCnt, itsFirstRemoving;
    fbwBody = document.getElementById("fbw_body");
    if (!fbwBody) return;

    // ----------------------------------------------- 
    // подсчёт всех таблиц:
    var fromHTML = fbwBody.innerHTML; // код документа
    var countTable = (fromHTML.match(/<DIV class=table>/g) || []).length;
    // =============================

    removedTablesCnt = 0;
    allDivs = fbwBody.getElementsByTagName("DIV");

    itsFirstRemoving = true;

    // ---------------------------------------------------------------------

    for (i = allDivs.length - 1; i >= 0; i--) {
        if (allDivs[i].className == "table") {
            if (itsFirstRemoving) {
                window.external.BeginUndoUnit(document, cancel);
                itsFirstRemoving = false;
            }
            //alert(removedTablesCnt);
            if (result == true) {
                var j = removedTablesCnt - countTable; // чтобы счет был не с конца.
                j = Math.abs(j);
                allDivs[i].insertAdjacentHTML("beforebegin", "<DIV onresizestart='return false' class=image contentEditable=false href='#undefined'><IMG src='fbw-internal:#undefined'></DIV><P><STRIKE>zzz_табл " + j + " из " + countTable + "_zzz</STRIKE></P>");
            }

            if (result == false) {
                allDivs[i].removeNode(true); // удаление таблиц.
            }
            removedTablesCnt++;
        }
    }
    if (result == false) {
        delNum();
    } // удаление меток таблиц.
    // ================================

    if (removedTablesCnt == 0) {
        MsgBox("Таблиц в документе не нашлось.\n\nСкрипт '" + name + "' v." + version + ".");
        return;
    }
    if (result == true) {
        try {
            window.external.SetStatusBarText("Вставлено пустых изображений с метками таблиц: " + removedTablesCnt + ".");
        } catch (e) {}
    }
    if (result == false) {
        try {
            window.external.SetStatusBarText("Удалено таблиц с их содержимым: " + removedTablesCnt + ", меток таблиц: " + count_01 + ".");
        } catch (e) {}
    }
    window.external.EndUndoUnit(document);
}