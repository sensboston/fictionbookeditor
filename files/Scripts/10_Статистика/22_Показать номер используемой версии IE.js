function Run() {

    function getIEVersion() {
        var ua = window.navigator.userAgent;
        
        // Проверяем наличие MSIE или Trident
        var msie = ua.indexOf('MSIE ');
        var trident = ua.indexOf('Trident/');
        
        if (msie > 0) {
            // IE 10 или старше (возвращает номер версии)
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }
        
        if (trident > 0) {
            // IE 11 (определяем по rv:)
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }
        
        // Проверка для Edge (не IE)
        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            return 'Edge';
        }
        
        return false; // Не IE
    }
    
    // Использование:
    var ieVersion = getIEVersion();
    if (ieVersion) {
        MsgBox('Используется Internet Explorer версии ' + ieVersion);
    } else {
        MsgBox('Это не Internet Explorer');
    }
}