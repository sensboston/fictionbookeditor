// Скрипт «Удалить подзаголовки из звездочек рядом с заголовками»
// Version: 3.1
// Идея - TaKir
// Реализация - DeepSeek, TaKir


function Run() {
    try {
        var scriptName = "Скрипт «Удалить подзаголовки из звездочек рядом с заголовками»";
        var scriptVersion = "3.1";
        var undoMsg = "удаление подзаголовков-звездочек";
        var statusBarMsg = "Удаляем подзаголовки-звездочки…";
        
        window.external.BeginUndoUnit(document, undoMsg);
        try { window.external.SetStatusBarText(statusBarMsg); }
        catch(e) {}
        
        var deletedTotal = 0;
        var deletedAbove = 0;
        var deletedBelow = 0;
        
        // Получаем корневой элемент
        var fbwBody = document.getElementById("fbw_body");
        if (!fbwBody) {
            MsgBox("Не найден элемент fbw_body", scriptName + " - Ошибка");
            return;
        }
        
        // Ищем все подзаголовки (элементы P с классом subtitle)
        var allElements = fbwBody.getElementsByTagName("P");
        var subtitlesToRemove = [];
        
        for (var i = 0; i < allElements.length; i++) {
            var element = allElements[i];
            
            if (element.className == "subtitle") {
                var text = element.innerText || element.textContent || "";
                text = text.replace(/^\s+|\s+$/g, "");
                
                if (text === "* * *") {
                    // Проверяем, находится ли подзаголовок рядом с заголовком
                    var position = checkSubtitlePosition(element);
                    if (position !== 'none') {
                        subtitlesToRemove.push({
                            element: element,
                            position: position
                        });
                    }
                }
            }
        }
        
        MsgBox("Найдено подзаголовков-звездочек рядом с заголовками: " + subtitlesToRemove.length, scriptName);
        
        // Удаляем в обратном порядке
        for (var i = subtitlesToRemove.length - 1; i >= 0; i--) {
            var item = subtitlesToRemove[i];
            item.element.parentNode.removeChild(item.element);
            deletedTotal++;
            
            if (item.position === 'above') deletedAbove++;
            if (item.position === 'below') deletedBelow++;
        }
        
        // Финальная статистика с названием и версией
        var finalMessage = scriptName + "\n" +
                          "Version: " + scriptVersion + "\n\n" +
                          "Удалено подзаголовков-звездочек - " + deletedTotal + "\n" +
                          "Выше заголовков - " + deletedAbove + "\n" +
                          "Ниже заголовков - " + deletedBelow;
        
        MsgBox(finalMessage, "FBE скрипт - Результат");
        
        try { window.external.SetStatusBarText("ОК"); }
        catch(e) {} 
        window.external.EndUndoUnit(document);
        
    } catch (error) {
        MsgBox("Ошибка: " + error.message, "FBE скрипт - Ошибка");
    }
}

function checkSubtitlePosition(subtitle) {
    var parentSection = getParentSection(subtitle);
    if (!parentSection) return 'none';
    
    // Случай 1: Подзаголовок ВЫШЕ заголовка
    // Подзаголовок находится в конце предыдущей секции, а текущая секция начинается с заголовка
    if (isLastElementInSection(subtitle, parentSection)) {
        var nextSection = getNextSection(parentSection);
        if (nextSection && hasTitleAtStart(nextSection)) {
            return 'above';
        }
    }
    
    // Случай 2: Подзаголовок НИЖЕ заголовка
    // Подзаголовок находится в той же секции сразу после заголовка
    if (isFirstElementAfterTitle(subtitle, parentSection)) {
        return 'below';
    }
    
    return 'none';
}

// Вспомогательные функции
function getParentSection(element) {
    var parent = element.parentNode;
    while (parent && parent.nodeName !== "DIV") {
        parent = parent.parentNode;
    }
    return parent;
}

function isLastElementInSection(element, section) {
    var children = section.childNodes;
    var lastElement = null;
    
    // Находим последний элемент в секции
    for (var i = children.length - 1; i >= 0; i--) {
        if (children[i].nodeType === 1) {
            lastElement = children[i];
            break;
        }
    }
    
    return lastElement === element;
}

function isFirstElementAfterTitle(subtitle, section) {
    var children = section.childNodes;
    var foundTitle = false;
    
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        
        if (child.nodeType === 1) {
            if (child.nodeName === "DIV" && child.className === "title") {
                foundTitle = true;
                continue;
            }
            
            if (foundTitle) {
                // Первый элемент после заголовка - наш подзаголовок
                if (child === subtitle) {
                    return true;
                }
                // Если нашли другой элемент до подзаголовка - значит не непосредственно после заголовка
                return false;
            }
        }
    }
    
    return false;
}

function getNextSection(section) {
    var next = section.nextSibling;
    while (next && (next.nodeType !== 1 || next.nodeName !== "DIV")) {
        next = next.nextSibling;
    }
    return next;
}

function hasTitleAtStart(section) {
    var children = section.childNodes;
    
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        
        if (child.nodeType === 1) {
            // Если первый элемент - заголовок
            if (child.nodeName === "DIV" && child.className === "title") {
                return true;
            }
            // Если первый элемент НЕ заголовок - значит секция не начинается с заголовка
            return false;
        }
    }
    
    return false;
}