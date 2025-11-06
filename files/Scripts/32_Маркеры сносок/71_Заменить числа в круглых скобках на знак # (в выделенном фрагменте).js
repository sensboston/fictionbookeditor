// Скрипт для замены целых чисел в круглых скобках на знак решетки (#) в выделенном фрагменте для редактора FBE 
// Идея - TaKir
// Реализация - DeepSeek, TaKir
// version 2.0, 04.11.2025
//  Скрипт применяется для расстановки возможных маркеров сносок, выполненных цифрами в круглых скобках


function Run() {
    try {
        var undoMsg = "Замена чисел в круглых скобках на # в выделении";
        var statusBarMsg = "Заменяем числа в круглых скобках на # в выделении…";
        var replaceCount = 0;

        var errMsg = "Нет выделения.\n\nПеред запуском скрипта нужно выделить текст, который будет обработан.";
        var tr = document.selection.createRange();
        
        if (!tr || tr.compareEndPoints("StartToEnd", tr) == 0) {
            MsgBox(errMsg, "FBE скрипт");
            return;
        }
        
        if (tr.parentElement().nodeName == "TEXTAREA" || tr.parentElement().nodeName == "INPUT") {
            MsgBox("Ошибка. Должно быть выделение в тексте книги, а не в поле ввода.", "FBE скрипт");
            return;
        }
        
        window.external.BeginUndoUnit(document, undoMsg);
        try { window.external.SetStatusBarText(statusBarMsg); }
        catch(e) {}
        
        var fbwBody = document.getElementById("fbw_body");

        // Получаем начальный и конечный элементы выделения
        var tr3 = document.selection.createRange();
        tr3.collapse(true);
        var blockStartEl = tr3.parentElement();
        tr3 = document.selection.createRange();
        tr3.collapse(false);
        var blockEndEl = tr3.parentElement();
        
        // Собираем все элементы в выделении
        var elements = [];
        var ptr = blockStartEl;
        while (ptr && fbwBody.contains(ptr)) {
            elements.push(ptr);
            if (ptr === blockEndEl) break;
            ptr = getNextP(ptr);
        }
        
        // Обрабатываем только целевые теги в выделении
        var targetTags = ['p', 'v', 'subtitle', 'text-author'];
        
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            var tagName = element.nodeName.toLowerCase();
            var isTargetTag = false;
            
            // Проверяем, является ли тег целевым (без indexOf)
            for (var t = 0; t < targetTags.length; t++) {
                if (targetTags[t] === tagName) {
                    isTargetTag = true;
                    break;
                }
            }
            
            if (isTargetTag) {
                processElement(element);
            }
        }
        
        // Функция обработки элемента
        function processElement(element) {
            for (var j = 0; j < element.childNodes.length; j++) {
                var childNode = element.childNodes[j];
                
                if (childNode.nodeType === 3) { // TEXT_NODE
                    var text = childNode.nodeValue;
                    var newText = text.replace(/\((\d+)\)/g, function(match) {
                        replaceCount++;
                        return '#';
                    });
                    
                    if (newText !== text) {
                        childNode.nodeValue = newText;
                    }
                } else if (childNode.nodeType === 1) { // ELEMENT_NODE
                    processElement(childNode);
                }
            }
        }
        
        // Функция для перехода к следующему элементу P (из вашего скрипта)
        function getNextNode(el) {
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

        // Показываем результат
        var message = "Скрипт «Замена чисел в круглых скобках на # (выделение)»\n";
        message += "version 2.0\n\n";
        message += "Произведено " + replaceCount + " замен в выделенном фрагменте.";
        message += "\n\nОбработаны только теги: <p>, <v>, <subtitle>, <text-author>";
        message += "\nЗаменяются только целые числа в круглых скобках.";
        
        if (replaceCount % 2 !== 0) {
            message += "\n\nВНИМАНИЕ! Кол-во замен нечетное, внимательно проверьте все маркеры сносок.";
        }
        
        try { window.external.SetStatusBarText("Заменено чисел круглых в скобках: " + replaceCount + "."); }
        catch(e) {} 
        
        window.external.EndUndoUnit(document);
        MsgBox(message, "FBE скрипт");
        
    } catch (e) {
        try { window.external.EndUndoUnit(document); } catch(e2) {}
        MsgBox('Ошибка: ' + e.message, "FBE скрипт");
    }
}