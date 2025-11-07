// Скрипт «Вставить пустые ссылки на картинки в началах и концах секций»
// Версия 3.7 
// Идея - TaKir
// Реализация - DeepSeek, TaKir, 06.11.2025
//  Скрипт применяется для массовой расстановки иллюстраций в началах и концах секций.

//  В отдельных случаях из-за структурных особенностей конкретного fb2 документа
//  может быть не проставлена пустая картинка или проставлена лишняя.
//  Поэтому иногда требуется проверка и небольшая доработка руками в вашем файле.

//  Перед запуском данного скрипта НАСТОЯТЕЛЬНО РЕКОМЕНДУЕТСЯ
//  обработать ваш  документ скриптом "13_Почистить структуру.js" из папки 08_Структура разделов.

//  Если где-то в началах и концах секций уже есть расставленные пустые картинки,
//  скрипт не будет повторно расставлять пустые картинки в эти же места.

//  Пустые картинки, уже вставленные между обычных абзацев,
//  не помешают расстановке в началах и концах секций.

//  Обычные картинки, уже вставленные в началах или концах секций,
//  также не помешают расстановке пустых картинок в началах и концах секций.


function Run() {
    var dialogWidth = "720px";
    var dialogHeight = "600px";
    
    var settings = window.showModalDialog(
        "HTML/Вставить пустые ссылки на картинки - параметры.htm", 
        window,
        "dialogHeight: " + dialogHeight + "; dialogWidth: " + dialogWidth + "; " +
        "center: Yes; help: No; resizable: Yes; status: No;"
    );
    
    if (!settings) return;

    var insertEnd = settings.insertEnd;
    var insertStart = settings.insertStart;
    
    if (!insertEnd && !insertStart) {
        window.external.MsgBox("Не выбрано ни одной опции для вставки!");
        return;
    }

    var stats = {
        totalInserted: 0,
        startInserted: 0, 
        endInserted: 0,
        emptyLinesAdded: 0,
        skippedNotes: 0,
        skippedParentSections: 0,
        skippedNamelessSections: 0,
        insertStart: insertStart,
        insertEnd: insertEnd
    };
    
    window.external.BeginUndoUnit(document, "вставка пустых ссылок на картинки");
    
    try { 
        window.external.SetStatusBarText("Вставляем пустые ссылки на картинки…"); 
    } catch(e) {}
    
    // Ищем section как DIV с классом section
    var sections = [];
    var allDivs = document.getElementsByTagName('div');
    
    for (var i = 0; i < allDivs.length; i++) {
        if (allDivs[i].className && allDivs[i].className.indexOf('section') !== -1) {
            sections.push(allDivs[i]);
        }
    }
    
    // Обрабатываем секции
    for (var j = 0; j < sections.length; j++) {
        var section = sections[j];
        
        // Пропускаем section в разделе сносок (body с fbname="notes")
        if (isInNotesBody(section)) {
            stats.skippedNotes++;
            continue;
        }
        
        // Проверяем, является ли секция родительской (содержит вложенные секции)
        var isParentSection = hasDirectNestedSections(section);
        var hasTitle = findFirstTitleInSection(section) !== null;
        
        // Вставка в начало (ТОЛЬКО для секций с заголовком)
        if (insertStart) {
            if (hasTitle) {
                // Только для секций с заголовком
                if (!hasEmptyImageAtStart(section)) {
                    stats.startInserted += insertFBEImageAtStart(section);
                }
            } else {
                // Пропускаем безымянные секции
                stats.skippedNamelessSections++;
            }
        }
        
        // Вставка в конец (только для листовых секций без вложенных)
        if (insertEnd && !isParentSection) {
            // Для обычных секций (с заголовком) - всегда вставляем в конец
            // Для безымянных секций - вставляем только если нет подзаголовка в конце
            if (hasTitle || canInsertImageInNamelessSection(section)) {
                if (!hasEmptyImageAtEnd(section)) {
                    var imageDiv = createFBEImage();
                    section.appendChild(imageDiv);
                    stats.endInserted += 1;
                }
            }
        } else if (insertEnd && isParentSection) {
            stats.skippedParentSections++;
        }
        
        // Проверяем пустые секции
        checkAndAddEmptyLineFBE(section, stats);
    }
    
    window.external.EndUndoUnit(document);
    
    showStatistics(stats);
}

// Проверяет, можно ли вставлять картинку в конец безымянной секции
function canInsertImageInNamelessSection(section) {
    // Если последний элемент - подзаголовок, не вставляем после него
    var lastElement = getLastNonEmptyElement(section);
    if (lastElement && lastElement.className && lastElement.className.indexOf('subtitle') !== -1) {
        return false;
    }
    
    return true;
}

// Получает последний непустой элемент в секции
function getLastNonEmptyElement(section) {
    var lastChild = section.lastChild;
    while (lastChild) {
        if (lastChild.nodeType == 1) {
            return lastChild;
        } else if (lastChild.nodeType == 3) {
            if (lastChild.textContent && lastChild.textContent.replace(/^\s+|\s+$/g, '') !== '') {
                return lastChild;
            }
        }
        lastChild = lastChild.previousSibling;
    }
    return null;
}

function isInNotesBody(section) {
    var bodyParent = findNotesBodyParent(section);
    return bodyParent !== null;
}

function findNotesBodyParent(element) {
    var current = element;
    while (current && current.nodeType == 1) {
        if (current.nodeName.toLowerCase() === 'body' && current.getAttribute('fbname') === 'notes') {
            return current;
        }
        if (current.className && current.className.indexOf('body') !== -1) {
            if (current.getAttribute('fbname') === 'notes' || current.getAttribute('name') === 'notes') {
                return current;
            }
        }
        current = current.parentNode;
    }
    return null;
}

function insertFBEImageAtStart(section) {
    var inserted = 0;
    
    try {
        var imageDiv = createFBEImage();
        var firstTitle = findFirstTitleInSection(section);
        
        if (firstTitle) {
            // Вставляем ПОСЛЕ заголовка
            if (firstTitle.nextSibling) {
                section.insertBefore(imageDiv, firstTitle.nextSibling);
            } else {
                section.appendChild(imageDiv);
            }
            inserted = 1;
        }
    } catch(e) {}
    
    return inserted;
}

// Проверяет, есть ли уже картинка в начале секции
function hasEmptyImageAtStart(section) {
    var firstTitle = findFirstTitleInSection(section);
    if (!firstTitle) return false;
    
    // Проверяем элемент сразу после заголовка
    var nextSibling = firstTitle.nextSibling;
    while (nextSibling && nextSibling.nodeType == 3 && 
           (!nextSibling.textContent || nextSibling.textContent.replace(/^\s+|\s+$/g, '') === '')) {
        nextSibling = nextSibling.nextSibling;
    }
    return nextSibling && isEmptyImageElement(nextSibling);
}

// Проверяет, есть ли уже картинка в конце секции  
function hasEmptyImageAtEnd(section) {
    var lastChild = section.lastChild;
    while (lastChild && lastChild.nodeType == 3 && 
           (!lastChild.textContent || lastChild.textContent.replace(/^\s+|\s+$/g, '') === '')) {
        lastChild = lastChild.previousSibling;
    }
    return lastChild && isEmptyImageElement(lastChild);
}

// Ищет ПЕРВЫЙ заголовок (title) в секции
function findFirstTitleInSection(section) {
    var children = section.childNodes;
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.nodeType == 1 && child.className && child.className.indexOf('title') !== -1) {
            return child;
        }
    }
    return null;
}

// Проверяет, является ли элемент пустой картинкой
function isEmptyImageElement(element) {
    if (element.nodeType != 1) return false;
    if (!element.className || element.className.indexOf('image') === -1) return false;
    if (element.getAttribute('href') !== '#undefined') return false;
    
    var imgs = element.getElementsByTagName('img');
    return imgs.length > 0 && imgs[0].src.indexOf('#undefined') !== -1;
}

function hasDirectNestedSections(section) {
    var children = section.childNodes;
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.nodeType == 1 && child.className && child.className.indexOf('section') !== -1) {
            return true;
        }
    }
    return false;
}

function createFBEImage() {
    var imageDiv = document.createElement('div');
    imageDiv.className = 'image';
    imageDiv.setAttribute('onresizestart', 'return false');
    imageDiv.setAttribute('contenteditable', 'false');
    imageDiv.setAttribute('href', '#undefined');
    
    var img = document.createElement('img');
    img.src = 'fbw-internal:#undefined';
    imageDiv.appendChild(img);
    
    return imageDiv;
}

function checkAndAddEmptyLineFBE(section, stats) {
    var children = section.childNodes;
    var hasContent = false;
    var imageCount = 0;
    
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.nodeType == 1) {
            var className = child.className || '';
            if (!(className.indexOf('image') !== -1 && child.getAttribute('href') === '#undefined') &&
                className.indexOf('title') === -1) {
                hasContent = true;
            } else if (className.indexOf('image') !== -1 && child.getAttribute('href') === '#undefined') {
                imageCount++;
            }
        } else if (child.nodeType == 3) {
            var text = child.textContent || '';
            if (text && text.replace(/^\s+|\s+$/g, '') !== '') {
                hasContent = true;
            }
        }
    }
    
    if (!hasContent && imageCount > 0) {
        var emptyLine = document.createElement('p');
        emptyLine.innerHTML = '&nbsp;';
        section.appendChild(emptyLine);
        stats.emptyLinesAdded++;
    }
}

function showStatistics(stats) {
    stats.totalInserted = stats.startInserted + stats.endInserted;
    
    var message = "Скрипт «Вставить пустые ссылки на картинки в началах и концах секций» v3.7\n\n";
    message += "Результаты выполнения:\n";
    message += "Всего расставлено пустых картинок: " + stats.totalInserted + "\n";
    
    if (stats.insertStart) {
        message += "• В начале секций: " + stats.startInserted + "\n";
        message += "• Пропущено безымянных секций: " + stats.skippedNamelessSections + "\n";
    } else {
        message += "• В начале секций: " + stats.startInserted + " (не расставлялись)\n";
    }
    
    if (stats.insertEnd) {
        message += "• В конце секций: " + stats.endInserted + "\n";
    } else {
        message += "• В конце секций: " + stats.endInserted + " (не расставлялись)\n";
    }
    
    message += "• Добавлено пустых строк: " + stats.emptyLinesAdded + "\n";
    message += "• Пропущено секций в сносках: " + stats.skippedNotes + "\n";
    
    if (stats.insertEnd) {
        message += "• Пропущено родительских секций: " + stats.skippedParentSections;
    } else {
        message += "• Пропущено родительских секций: " + stats.skippedParentSections + " (не применялось)";
    }
    
    window.external.MsgBox(message);
}