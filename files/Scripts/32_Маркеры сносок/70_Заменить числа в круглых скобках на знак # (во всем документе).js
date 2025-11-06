// Скрипт для замены целых чисел в круглых скобках на знак решетки (#) во всем документе для редактора FBE 
// Идея - TaKir
// Реализация - DeepSeek, TaKir
// version 2.0, 04.11.2025
//  Скрипт применяется для расстановки возможных маркеров сносок, выполненных цифрами в круглых скобках

function Run() {
    try {
        var undoMsg = "Замена чисел в круглых скобках на # во всем документе";
        var statusBarMsg = "Заменяем числа в круглых скобках на # во всем документе…";
        var replaceCount = 0;
        
        window.external.BeginUndoUnit(document, undoMsg);
        try { window.external.SetStatusBarText(statusBarMsg); }
        catch(e) {}
        
        // Теги, в которых производим замену
        var targetTags = ['p', 'v', 'subtitle', 'text-author'];
        
        // Обрабатываем каждый целевой тег
        for (var t = 0; t < targetTags.length; t++) {
            var tagName = targetTags[t];
            var elements = document.getElementsByTagName(tagName);
            
            // Обрабатываем каждый элемент этого тега
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                
                // Рекурсивно обрабатываем все текстовые узлы внутри элемента
                processTextNodes(element);
            }
        }
        
        // Функция обработки текстовых узлов
        function processTextNodes(element) {
            for (var j = 0; j < element.childNodes.length; j++) {
                var childNode = element.childNodes[j];
                
                if (childNode.nodeType === 3) { // TEXT_NODE
                    var text = childNode.nodeValue;
                    // Регулярное выражение для целых чисел: только цифры внутри круглых скобок
                    var newText = text.replace(/\((\d+)\)/g, function(match) {
                        replaceCount++;
                        return '#';
                    });
                    
                    if (newText !== text) {
                        childNode.nodeValue = newText;
                    }
                } else if (childNode.nodeType === 1) { // ELEMENT_NODE
                    // Рекурсивно обрабатываем вложенные элементы
                    processTextNodes(childNode);
                }
            }
        }
        
        // Формируем сообщение со статистикой
        var message = "Скрипт «Замена чисел в круглых скобках на знак решетки (#)»\n";
        message += "version 2.0\n\n";
        message += "Произведено " + replaceCount + " замен.";
        message += "\n\nОбработаны только теги: <p>, <v>, <subtitle>, <text-author>";
        message += "\nЗаменяются только целые числа в круглых скобках.";
        
        // Проверяем на нечетность
        if (replaceCount % 2 !== 0) {
            message += "\n\nВНИМАНИЕ! Кол-во замен нечетное, внимательно проверьте все маркеры сносок.";
        }
        
        try { window.external.SetStatusBarText("Заменено чисел в круглых скобках: " + replaceCount + "."); }
        catch(e) {} 
        
        window.external.EndUndoUnit(document);
        
        // Используем MsgBox с заголовком "FBE скрипт"
        MsgBox(message, "FBE скрипт");
        
    } catch (e) {
        try { window.external.EndUndoUnit(document); } catch(e2) {}
        MsgBox('Ошибка: ' + e.message, "FBE скрипт");
    }
}