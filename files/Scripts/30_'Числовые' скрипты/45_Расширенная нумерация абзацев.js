// Скрипт расширенной нумерации абзацев для редактора FBE
// Автор идеи - Haliz
// Реализация - DeepSeek, 04.11.2025

function Run() {
    var dialogWidth = "760px";
    var dialogHeight = "825px";
    
    // Показываем диалог настроек
    var settings = window.showModalDialog(
        "HTML/Расширенная нумерация абзацев - параметры.htm", 
        window,
        "dialogHeight: " + dialogHeight + "; dialogWidth: " + dialogWidth + "; " +
        "center: Yes; help: No; resizable: Yes; status: No;"
    );
    
    // Если пользователь нажал Отмена
    if (!settings) {
        return;
    }

    // Основной код нумерации
    var prefix = settings.prefix || "";
    var useNumbering = settings.useNumbering !== false;
    var startNumber = parseInt(settings.startNumber) || 1;
    var increment = parseInt(settings.increment) || 1;
    var suffix = settings.suffix || "";
    var onlySelected = settings.onlySelected !== false;
    var skipEmpty = settings.skipEmpty !== false;
    
    var cnt = startNumber;
    var nbspChar = String.fromCharCode(160);
    
    function isLineEmpty(ptr) {
        var emptyLineRegExp = new RegExp("^( | |&nbsp;|"+nbspChar+")*?$","i");
        return emptyLineRegExp.test(ptr.innerHTML.replace(/<(?!img)[^>]*?>/gi,""));
    }
    
    function processP(p) {
        if (skipEmpty && isLineEmpty(p)) {
            return false;
        }
        
        // Формируем текст для вставки
        var textToInsert = "";
        
        // Добавляем префикс, если он указан
        if (prefix) {
            textToInsert += prefix;
        }
        
        // Добавляем номер, если нумерация включена
        if (useNumbering) {
            textToInsert += cnt;
        }
        
        // Добавляем суффикс, если он указан
        if (suffix) {
            textToInsert += suffix;
        }
        
        // Вставляем только если есть что вставлять
        if (textToInsert) {
            p.insertAdjacentHTML("afterbegin", textToInsert);
        }
        
        if (useNumbering) {
            cnt += increment;
        }
        return true;
    }
    
    // Проверяем выделение
    var tr = document.selection.createRange();
    if (onlySelected && (!tr || tr.compareEndPoints("StartToEnd", tr) == 0)) {
        alert("Нет выделения. Будут обработаны все абзацы в документе.");
        onlySelected = false;
    }
    
    window.external.BeginUndoUnit(document, "добавление нумерации абзацев");
    
    try { 
        window.external.SetStatusBarText("Добавляем нумерацию в абзацы…"); 
    } catch(e) {}
    
    var body = document.getElementById("fbw_body");
    var processedCount = 0;
    
    if (onlySelected) {
        // Используем подход из рабочего скрипта с маркерами
        var MyTagName = "B";
        var coll = tr.getClientRects();
        var ttr1 = document.selection.createRange();
        var el = document.elementFromPoint(coll[0].left, coll[0].top);
        var cursorPos = null;
        
        if (tr.compareEndPoints("StartToEnd", tr) == 0) {
            var el2 = document.getElementById("CursorPosition");
            if (el2) el2.removeAttribute("id");
            ttr1.pasteHTML("<" + MyTagName + " id=CursorPosition></" + MyTagName + ">");
            cursorPos = document.getElementById("CursorPosition");
            ttr1.expand("word");
        }
        
        var rndm = Math.round(Math.random() * 100000).toString();
        var startId = "BlockStart" + rndm;
        var endId = "BlockEnd" + rndm;
        
        tr = ttr1.duplicate();
        tr.collapse();
        tr.pasteHTML("<" + MyTagName + " id=" + startId + "></" + MyTagName + ">");
        tr = ttr1.duplicate();
        tr.collapse(false);
        tr.pasteHTML("<" + MyTagName + " id=" + endId + "></" + MyTagName + ">");
        
        while (el && el.nodeName != "DIV" && el.nodeName != "P") { 
            el = el.parentNode; 
        }
        
        var insideSelection = false;
        var processingEnded = false;
        var ptr = el;
        
        while (!processingEnded) {
            if (ptr.nodeType == 1 && ptr.nodeName == MyTagName && ptr.getAttribute("id") == startId) {
                insideSelection = true;
                var BlockStartNode = ptr;
                var pp = ptr;
                while (pp && pp.nodeName.toUpperCase() != "BODY" && pp.nodeName.toUpperCase() != "P") pp = pp.parentNode;
                if (pp.nodeName.toUpperCase() == "P") {
                    if (processP(pp)) {
                        processedCount++;
                    }
                }
            }
            
            if (ptr.nodeType == 1 && ptr.nodeName == MyTagName && ptr.getAttribute("id") == endId) {
                insideSelection = false;
                processingEnded = true;
                var BlockEndNode = ptr;
            }
            
            if (insideSelection && ptr.nodeName == "P") {
                if (processP(ptr)) {
                    processedCount++;
                }
            }
            
            var nextPtr;
            if (ptr.firstChild != null) {
                nextPtr = ptr.firstChild;
            } else {
                nextPtr = ptr;
                while (nextPtr && nextPtr != body && !nextPtr.nextSibling) {
                    nextPtr = nextPtr.parentNode;
                }
                if (nextPtr && nextPtr != body) nextPtr = nextPtr.nextSibling;
                else nextPtr = null;
            }
            if (!nextPtr) break;
            ptr = nextPtr;
        }
        
        var tr1 = document.body.createTextRange();
        if (!cursorPos) {
            tr1.moveToElementText(BlockStartNode);
            var tr2 = document.body.createTextRange();
            tr2.moveToElementText(BlockEndNode);
            tr1.setEndPoint("StartToStart", tr2);
            tr1.select();
        } else {
            tr1.moveToElementText(cursorPos);
            tr1.select();
        }
        BlockStartNode.parentNode.removeChild(BlockStartNode);
        BlockEndNode.parentNode.removeChild(BlockEndNode);
    } else {
        // Обработка всех абзацев
        var paragraphs = body.getElementsByTagName("P");
        for (var i = 0; i < paragraphs.length; i++) {
            if (processP(paragraphs[i])) {
                processedCount++;
            }
        }
    }
    
    window.external.EndUndoUnit(document);
    
    if (processedCount > 0) {
        alert("Обработано абзацев: " + processedCount);
    } else {
        alert("Не найдено абзацев для обработки.");
    }
}