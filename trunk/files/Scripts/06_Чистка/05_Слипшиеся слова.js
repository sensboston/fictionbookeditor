//======================================
//     Интерактивный поиск знаков препинания и т. д. и т. п.
//                                                 8 мая 2008 г.
//                                                         Engine by ©Sclex
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.1.1 – Цифры после строчных                         2007.09.16
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.1.2 – "Русские" кавычки                                2007.09.22
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.1.3 – Дефис после точки                               2007.10.14
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.1.4 – Пробел до и после Дефиса                    2007.11.22
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.1.5 – Апостроф сре'ди строчных                     2007.11.29
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.1.6 – Скобка после строчных                         2008.01.30
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.1.7 – предлагается пробел перед Прописной   2008.02.13
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.1.8 – запрос на апострофы                            2008.02.29
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.1.9 – запрос на слэши                                  2008.04.05
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.2.0 – «ready» for FBE                                    2008.04.05
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.2.1 – «вкрапления» обычного в курсиве          2008.05.07
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.2.2 – «косметика» — курсивы убрал в var       2008.05.08
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.2.3 – подсветка                                           2008.05.16
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.2.4 – ошибка в союзах 150                            2008.12.16
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.2.5 – игнор «теле-», «радио-» 100                  2009.01.07
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.2.6 – кастомизированные неразрывные пробелы          2010.03.20
//======================================
var VersionNumber="2.7";

//обрабатывать ли history
var ObrabotkaHistory=true;
//обрабатывать ли annotation
var ObrabotkaAnnotation=true;
// обрабатывать ли апостроф
 var Apostrophe=false;
  var PromptApostrophe=true;
// обрабатывать ли апостроф
 var Slash=false;
  var PromptSlash=true;

var sIB="<EM>|<STRONG>|<EM><STRONG>|<STRONG><EM>";
var fIB="</EM>|</STRONG>|</EM></STRONG>|</STRONG></EM>";
var aIB="<EM>|<STRONG>|<EM><STRONG>|<STRONG><EM>|</EM>|</STRONG>|</EM></STRONG>|</STRONG></EM>";
     var nak = 0;                   // накат - коррекция сдвига подсветки после вставки временых замен и курсива.

function Run() {
 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

 if (PromptApostrophe) {
  Apostrophe=AskYesNo("             –=Jürgen Script=–\n                      1–2\n\nОбращать внимание на а'построфы?          \n");
 }

 if (PromptSlash) {
  Slash=AskYesNo("             –=Jürgen Script=–\n                      2–2\n\n    Обращать внимание на /слэши/?            \n");
 }

  var Ts=new Date().getTime();
  var TimeStr=0;
  var count=0;                           //  счётчик

          Col = new Object();                        // коллекции проверенных словосочетаний
           var k = 0;
          sobCol = new Object();                   // коллекция «отменённых», чтобы по десять раз их не проверять

          Coldef = new Object();                        // коллекция ДО дефиса

Coldef["радио"] = true;
Coldef["теле"] = true;
Coldef["лево"] = true;
Coldef["право"] = true;

                                                    // Знаки препи.нания между буквами (кириллица) и прочее непотребство
 var re10 = new RegExp("^(.*?){0,1}([А-яЁё]+)("+fIB+"){0,1}([\\\.,…\\\"„“”!\\\?\\\|:;\\\*%\\\^\\\dA-z\\\(\\\)]+)("+sIB+"){0,1}([А-яЁё]+)(.*?){0,1}$","gi");
 var re11 = "$2$3$4$5$6";                    // отображение в запросе
 var re12 = "$1";                           // с начала абзаца до искомого места
 var re13 = "$7";                           // до конца параграфа
 var re1s = "$2\\\$4$6";                    // чистый текст - без тегов

                                                    // исключая ";" — чтобы не спотыкаться на неразрывных пробелах
 var re20 = new RegExp("^(.*?){0,1}([А-яЁё]+)("+aIB+"){0,1}([\\\.,\\\"„“”!\\\?\\\|:\\\*%\\\^\\\d])("+aIB+"){0,1}([А-яЁё]+)(.*?){0,1}$","gi");
 var re21 = "$2$3$4$5$6";
 var re22 = "$1"; 
 var re23 = "$7";
 var re2s = "$2\\\$4$6";

                                                   // Прописная сразуПосле строчной — возможно пропущен пробел
 var re30 = new RegExp("^(.*?[^«„А-яЁё]){0,1}([А-яЁё]{0,1}[а-яё]+)("+fIB+"){0,1}("+sIB+"){0,1}([А-ЯЁ№§])([а-яё]*?)([^»“А-яЁё].*?){0,1}$","g");
 var re31 = "$2$3$4$5$6";
 var re32 = "$1"; 
 var re33 = "$7";
 var re34 = "$2$3 $4$5$6";
 var re3s = "$2 $5$6";

                                                      // Несколько ПРОписных сразу перед строчными — хотя может так и надо
 var re40 = new RegExp("^(.*?){0,1}([А-ЯЁ]{2,})("+fIB+"){0,1}("+sIB+"){0,1}([а-яё]+)(.*?){0,1}$","g");
 var re41 = "$2$3$4$5";
 var re42 = "$1"; 
 var re43 = "$6";
 var re4s = "$2$5";

                                                      // Прилипший курсив
 var re50 = new RegExp("^(.*?){0,1}([А-яЁё]{2,})("+aIB+")([а-яё]+)(.+){0,1}$","g");
 var re51 = "$2$3$4";
 var re52 = "$1"; 
 var re53 = "$5";
 var re5s = "$2$4";

                                                      // строчная. после точки и т. п.
 var re60 = new RegExp("^(.*?){0,1}([^;\\\(\\\)][А-яЁё]+)("+fIB+"){0,1}([\\\.!\\\?\\\|\\\^\\\(]+)(\\\s*)("+sIB+"){0,1}([а-яё]+)(.*?){0,1}$","g");
 var re61 = "$2$3$4$5$6$7";
 var re62 = "$1";
 var re63 = "$8";
 var re6s = "$2\\\$4$5$7";

                                                      // Цифры после строчных
// var re70 = new RegExp("^(.*?){0,1}([^;][а-яё]+\\\){0,1})(([:,])|( {0,1}[–—\\\-])|([–—\\\-] {0,1})){0,1}(\\\d+)(.*?){0,1}$","g"); // и почему это я был против неразрывного пробела перед буквой - не помню. ((
 var re70 = new RegExp("^(.*?){0,1}([А-ЯЁ]{0,1}[а-яё]+\\\){0,1}»{0,1})(([:,])|( [–—\\\-])|([–—\\\-] )){0,1}("+aIB+"){0,1}(\\\d+)(.*?){0,1}$","g");
 var re71 = "$2$3$7$8";
 var re72 = "$1";
 var re73 = "$9";
 var re7s = "$2$3$8";

                                                       // Цифры перед строчными
 var re_70 = new RegExp("^(.*?){0,1}(\\\d+)("+aIB+"){0,1}([а-яё]+)(.*?){0,1}$","g");
 var re_71 = "$2$3$4";
 var re_72 = "$1";
 var re_73 = "$5";
 var re_74 = "$2$3 $4";
 var re_7s = "$2$4";

                                                      // "Русские" кавычки
 var re80 = new RegExp("^(.*?){0,1}([а-я\\\-]+[\\\.,])(»)(.*?){0,1}$","g");
 var re81 = "$2$3";
 var re82 = "$1";
 var re83 = "$4";
 var re8s = "$2$3";

                                                       // Буква после дефиса и точки и т. п.
 var re90 = new RegExp("^(.*?){0,1}([а-яёa-z\\\"“»%]+)("+fIB+"){0,1}([\\\.,])((\\\s)|("+nbspEntity+")){0,1}([\\\-–])(\\\s|"+nbspEntity+")("+sIB+"){0,1}([а-яё]+)(.+){0,1}$","gi");
 var re91 = "$2$3$4$5$8$9$10$11";
 var re92 = "$1";
 var re93 = "$12";
 var re9s = "$2$4$6$8 $11";

                                                       // Dефис+пробел.
 var re100 = new RegExp("^(.*?){0,1}([а-яё]+)(['\\\-——] )([\\\"«]{0,1}[а-яё]+)(.*?){0,1}$","gi");
 var re101 = "$2$3$4";
 var re102 = "$1";
 var re103 = "$5";
 var re104 = "$2 $3$4";
 var re10s = "$2$3$4";
 var re10d = "$2"

                                                       // Dефис+пробел.
 var re110 = new RegExp("^(.*?){0,1}([а-яё]+)( [\\\-'])([\.,:;]{0,1}[а-яё]+)(.*?){0,1}$","gi");
 var re111 = "$2$3$4";
 var re112 = "$1";
 var re113 = "$5";
 var re11s = "$2$3$4";

                                                       // Ненужный апостроф по'среди строчных.
 var re120 = new RegExp("^(.*?){0,1}([а-яё]+)(['`])([а-яё]+)(.*?){0,1}$","g");
 var re121 = "$2$3$4";
 var re122 = "$1";
 var re123 = "$5";
 var re124 = "$2$4";
 var re12s = "$2$3$4";

                                                       // Ненужный слэш посре/ди строчных.
 var re120a = new RegExp("^(.*?){0,1}([а-яё]+)(/)([а-яё]+)(.*?){0,1}$","g");
 var re121a = "$2$3$4";
 var re122a = "$1";
 var re123a = "$5";
 var re124a = "$2$4";
 var re12as = "$2$3$4";

                                                       // Разнообразный мусор.
 var re130 = new RegExp("^(.*?){0,1}([а-яё\\\.;:,!\\\?—]+)((\\\s)|("+nbspEntity+")){0,1}([_\\\<\\\>•■~])((\\\s)|("+nbspEntity+")){0,1}([а-яё—–«»„“]+)(.*?){0,1}$","gi");
 var re131 = "$2$3$6$7$10";
 var re132 = "$1";
 var re133 = "$11";
 var re134 = "$2$3$10";
 var re13s = "$2$4$6$8$10";

                                                   // После строчной( открывающаяся круглая скобка — возможно пропущен пробел
 var re140 = new RegExp("^(.*?[^«„А-яЁё]){0,1}([А-яЁё]{0,1}[а-яё]+»{0,1})("+fIB+"){0,1}("+sIB+"){0,1}([А-ЯЁ\\\(])([А-яё]+)([^»“А-яЁё].*?){0,1}$","g");
 var re141 = "$2$3$4$5$6";
 var re142 = "$1"; 
 var re143 = "$7";
 var re144 = "$2$3 $4$5$6";
 var re14s = "$2$5$6";

                                                   // Невозможные союзы
 var re150 = new RegExp("^(.*?)([а-яё]+ )("+aIB+"){0,1}(е|з|н|п|ш|ъ|ь|ы|й|ц|ч|ф)( [а-яё]+)(.*?)$","g");
 var re151 = "$2$3$4$5";
 var re152 = "$1"; 
 var re153 = "$6";
 var re15s = "$2$4$5";

                                                   // Пробелы около тире рядом с цифрами
 var re160 = new RegExp("^(.*?)(\\\d+)( {0,1})("+fIB+"){0,1}( {0,1})—("+sIB+"){0,1}([А-яЁё]+)(.*?)$","g");
 var re161 = "$2$3$4$5—$6$7";
 var re162 = "$1"; 
 var re163 = "$8";
 var re164 = "$2$4 — $7";
 var re16s = "$2$3$5—$7";

                                                   // Пробелы около тире рядом с цифрами
 var re170 = new RegExp("^(.*?)(\\\d+)("+fIB+"){0,1}—( {0,1})("+sIB+"){0,1}( {0,1})([А-яЁё]+)(.*?)$","g");
 var re171 = "$2$3—$4$5$6$7";
 var re172 = "$1"; 
 var re173 = "$8";
 var re174 = "$2$3 — $5$7";
 var re17s = "$2—$4$6$7";

                                                       // Разнообразный мусор (продолжение).
 var re180 = new RegExp("^(.*?){0,1}([А-ЯЁ]*[а-яё]+)(\\\-\\\. {0,1})([а-я]+)(.*?){0,1}$","g");
 var re181 = "$2$3$4";
 var re182 = "$1";
 var re183 = "$5";
 var re184 = "$2$4";
 var re18s = "$2$3$4";

                                                       // Обычный текст в курсивном абзаце.
 var re190 = new RegExp("^(("+sIB+").+?)("+fIB+")([A-zА-яЁё\\\d, –—\\\-\\"+nbspEntity+"]{1,11})("+sIB+")(.+?("+fIB+"))$","gi");
 var re191 = "$3$4$5";
 var re192 = "$1";
 var re193 = "$6";
 var re194 = "$4";
 var re19s = "$4";

                                                     // шаблоны для финального восстановления временных замен «col1_†» – до десяти, свыше – «col2_†»
  var re_fin1 = new RegExp("col1_\\\d†","g");
  var re_fin2 = new RegExp("col2_\\\d{2}†","g");


//                   очистка кода от тегов            //
 var re1cl = new RegExp("<[^<>]+>","g");
 var re11cl = "";

 var re2cl = new RegExp(""+nbspEntity,"g");
 var re21cl = " ";

 var re3cl = new RegExp("&#\\\d+;","g");
 var re31cl = "q";

 var s="";


 // функция, обрабатывающая абзац P
 function HandleP(ptr) {
  s=ptr.innerHTML;

ptr2=ptr;                                      // следующий абзац за совпадением — переход на него, чтобы в FBE было видно  проблемное место
if (ptr2.hasChildNodes()) {
   ptr2=ptr2.firstChild;
} else {
   while (ptr2!=fbw_body && !ptr2.nextSibling) ptr2=ptr2.parentNode;
   if (ptr2!=fbw_body) ptr2=ptr2.nextSibling;
}
while (ptr2!=fbw_body && ptr2.nodeName!="P") {
   if (ptr2.hasChildNodes() && ptr2.nodeName!="P") {
     ptr2=ptr2.firstChild;
   } else {
     while (ptr2!=fbw_body && !ptr2.nextSibling) ptr2=ptr2.parentNode;
     if (ptr2!=fbw_body) ptr2=ptr2.nextSibling;
   }
}


       if (s.search(re10)!=-1 || s.search(re20)!=-1 || s.search(re30)!=-1 || s.search(re40)!=-1 || s.search(re50)!=-1 || s.search(re60)!=-1 || s.search(re70)!=-1 || s.search(re_70)!=-1 || s.search(re80)!=-1 || s.search(re90)!=-1 || s.search(re100)!=-1 || s.search(re110)!=-1 || s.search(re120)!=-1  || s.search(re120a)!=-1 || s.search(re130)!=-1 || s.search(re140)!=-1 || s.search(re150)!=-1 || s.search(re160)!=-1 || s.search(re170)!=-1 || s.search(re180)!=-1 || s.search(re190)!=-1)
         {
           if (ptr2==fbw_body) GoTo(ptr); else GoTo(ptr2);

 var ss = s;                                                                          // очистка абзаца от тегов, неразрывных пробелов и прочих сущностей
 if (s.search(re1cl)!=-1) {ss = ss.replace(re1cl, re11cl);}
 if (s.search(re2cl)!=-1) {ss = ss.replace(re2cl, re21cl);}
 if (s.search(re3cl)!=-1) {ss = ss.replace(re3cl, re31cl);}

       while (s.search(re10)!=-1) {
    var v1  = s.replace(re10, re11);
    var sl1   = s.replace(re10, re12);
    var sp1   = s.replace(re10, re13);

 var s1  = s.replace(re10, re1s);
 var a1=ss.search(s1)+nak;
 var b1=s1.length;
   var range1=document.body.createTextRange();
   range1.moveToElementText(ptr);
   range1.collapse();
   range1.move("character",a1);
   range1.moveEnd("character",b1);
   range1.select(); 

  if (sobCol[v1]==true)  {
        if (k<10)   { Col[k] = v1;    s=sl1+("col1_" +k+ "†")+sp1; nak=nak+b1-7; } 
        if (k>10)   { Col[k] = v1;    s=sl1+("col2_" +k+ "†")+sp1; nak=nak+b1-8; }
		 k++;} 

// MsgBox("a1: "+a1+"\nsearch: "+ss.search(s1)+"\nnakat: "+nak+"\ns1: "+s1+"\nb1: "+b1+"\n\ns: \n"+s+"\nss: \n"+ss);

 if (k<10 && sobCol[v1]==null) {
 var r=prompt("01 :: Подозрительные символы ::\nВведите свой вариант:        " +v1,v1)
 if(r!=null && r!="")  { Col[k] = r;    s=sl1+("col1_" +k+ "†")+sp1;  count++; }
 else                       { Col[k] = v1; sobCol[v1]=true;  s=sl1+("col1_" +k+ "†")+sp1} nak=nak+b1-7; }
 if (k>=10 && sobCol[v1]==null) {
 var r=prompt(" :: Подозрительные символы :::\nВведите свой вариант:        " +v1,v1)
 if(r!=null && r!="")  { Col[k] = r;    s=sl1+("col2_" +k+ "†")+sp1;  count++; }
 else                       { Col[k] = v1; sobCol[v1]=true;  s=sl1+("col2_" +k+ "†")+sp1} nak=nak+b1-8; }
k++; }


       while (s.search(re60)!=-1) {
    var v6  = s.replace(re60, re61);
    var sl6   = s.replace(re60, re62);
    var sp6   = s.replace(re60, re63);

 var s6  = s.replace(re60, re6s);
 var a6=ss.search(s6)+nak;
 var b6=s6.length;
   var range6=document.body.createTextRange();
   range6.moveToElementText(ptr);
   range6.collapse();
   range6.move("character",a6);
   range6.moveEnd("character",b6);
   range6.select(); 

// MsgBox("\nsearch: "+ss.search(s6)+"\nnakat: "+nak+"\na6: "+a6+"\ns6: "+s6+"\nb6: "+b6+"\n\ns: \n"+s+"\nss: \n"+ss);

  if (sobCol[v6]==true)  {
        if (k<10)   { Col[k] = v6;    s=sl6+("col1_" +k+ "†")+sp6; nak=nak+b6-7; } 
        if (k>10)   { Col[k] = v6;    s=sl6+("col2_" +k+ "†")+sp6; nak=nak+b6-8; }
		 k++;}

 if (k<10 && sobCol[v6]==null) {
 var r=prompt("06 :: Подозрительная пунктуация ::\nВведите свой вариант:        " +v6,v6)
 if(r!=null && r!="")  { Col[k] = r;    s=sl6+("col1_" +k+ "†")+sp6;  count++; }
 else                       { Col[k] = v6; sobCol[v6]=true;  s=sl6+("col1_" +k+ "†")+sp6} nak=nak+b6-7; }
 if (k>=10 && sobCol[v6]==null) {
 var r=prompt(" :: Подозрительная пунктуация :::\nВведите свой вариант:        " +v6,v6)
 if(r!=null && r!="")  { Col[k] = r;    s=sl6+("col2_" +k+ "†")+sp6;  count++; }
 else                       { Col[k] = v6; sobCol[v6]=true;  s=sl6+("col2_" +k+ "†")+sp6} nak=nak+b6-8; }
k++; }


       while (s.search(re20)!=-1) {
    var v2  = s.replace(re20, re21);
    var sl2   = s.replace(re20, re22);
    var sp2   = s.replace(re20, re23);

 var s2  = s.replace(re20, re2s);
 var a2=ss.search(s2)+nak;
 var b2=s2.length;
 var range2=document.body.createTextRange();
 range2.moveToElementText(ptr);
 range2.collapse();
 range2.move("character",a2);
 range2.moveEnd("character",b2);
 range2.select(); 

  if (sobCol[v2]==true)  {
        if (k<10)   { Col[k] = v2;    s=sl1+("col1_" +k+ "†")+sp2; nak=nak+b2-7; } 
        if (k>10)   { Col[k] = v2;    s=sl1+("col2_" +k+ "†")+sp2; nak=nak+b2-8; }
		 k++;} 

 if (k<10 && sobCol[v2]==null) {
 var r=prompt(" :: Подозрительные символы ::\nВведите свой вариант:        " +v2,v2)
 if(r!=null && r!="")  { Col[k] = r;    s=sl2+("col1_" +k+ "†")+sp2; count++; }
 else                       { Col[k] = v2; sobCol[v2]=true;  s=sl2+("col1_" +k+ "†")+sp2; } nak=nak+b2-7; }
 if (k>=10 && sobCol[v2]==null) {
 var r=prompt(" :: Подозрительные символы :::\nВведите свой вариант:        " +v2,v2)
 if(r!=null && r!="")  { Col[k] = r;    s=sl2+("col2_" +k+ "†")+sp2; count++; }
 else                       { Col[k] = v2; sobCol[v2]=true;  s=sl2+("col2_" +k+ "†")+sp2; } nak=nak+b2-8; }
k++; }

       while (s.search(re30)!=-1) {
    var v3  = s.replace(re30, re31);
    var sl3   = s.replace(re30, re32);
    var sp3   = s.replace(re30, re33);
    var vv3  = s.replace(re30, re34);

 var s3  = s.replace(re30, re3s);
 var a3=ss.search(s3)+nak;
 var b3=s3.length;
 var range3=document.body.createTextRange();
 range3.moveToElementText(ptr);
 range3.collapse();
 range3.move("character",a3);
 range3.moveEnd("character",b3);
 range3.select();

  if (sobCol[v3]==true)  {
        if (k<10)   { Col[k] = v3;    s=sl3+("col1_" +k+ "†")+sp3; nak=nak+b3-7; } 
        if (k>10)   { Col[k] = v3;    s=sl3+("col2_" +k+ "†")+sp3; nak=nak+b3-8; }
		 k++;} 

 if (k<10 && sobCol[v3]==null) {
 var r=prompt(" :: Подозрительные символы ::\nВведите свой вариант:        " +v3,vv3)
 if(r!=null && r!="")  { Col[k] = r;    s=sl3+("col1_" +k+ "†")+sp3; count++; }
 else                       { Col[k] = v3; sobCol[v3]=true;  s=sl3+("col1_" +k+ "†")+sp3; } nak=nak+b3-7; }
 if (k>=10 && sobCol[v3]==null) {
 var r=prompt(" :: Подозрительные символы :::\nВведите свой вариант:        " +v3,vv3)
 if(r!=null && r!="")  { Col[k] = r;    s=sl3+("col2_" +k+ "†")+sp3; count++; }
 else                       { Col[k] = v3; sobCol[v3]=true;  s=sl3+("col2_" +k+ "†")+sp3; } nak=nak+b3-8; }
k++; }

       while (s.search(re40)!=-1) {
    var v4  = s.replace(re40, re41);
    var sl4   = s.replace(re40, re42);
    var sp4   = s.replace(re40, re43);

 var s4  = s.replace(re40, re4s);
 var a4=ss.search(s4)+nak;
 var b4=s4.length;
 var range4=document.body.createTextRange();
 range4.moveToElementText(ptr);
 range4.collapse();
 range4.move("character",a4);
 range4.moveEnd("character",b4);
 range4.select(); 

  if (sobCol[v4]==true)  {
        if (k<10)   { Col[k] = v4;    s=sl4+("col1_" +k+ "†")+sp4; nak=nak+b4-7; } 
        if (k>10)   { Col[k] = v4;    s=sl4+("col2_" +k+ "†")+sp4; nak=nak+b4-8; }
		 k++;} 

 if (k<10 && sobCol[v4]==null) {
 var r=prompt(" :: Подозрительные символы ::\nВведите свой вариант:        " +v4,v4)
 if(r!=null && r!="")  { Col[k] = r;    s=sl4+("col1_" +k+ "†")+sp4; count++; }
 else                       { Col[k] = v4; sobCol[v4]=true;  s=sl4+("col1_" +k+ "†")+sp4; } nak=nak+b4-7; }
 if (k>=10 && sobCol[sv4]==null) {
 var r=prompt(" :: Подозрительные символы :::\nВведите свой вариант:        " +v4,v4)
 if(r!=null && r!="")  { Col[k] = r;    s=sl4+("col2_" +k+ "†")+sp4; count++; }
 else                       { Col[k] = v4; sobCol[v4]=true;  s=sl4+("col2_" +k+ "†")+sp4; } nak=nak+b4-8; }
k++; }

       while (s.search(re50)!=-1) {
    var v5  = s.replace(re50, re51);
    var sl5   = s.replace(re50, re52);
    var sp5   = s.replace(re50, re53);

 var s5  = s.replace(re50, re5s);
 var a5=ss.search(s5)+nak;
 var b5=s5.length;
 var range5=document.body.createTextRange();
 range5.moveToElementText(ptr);
 range5.collapse();
 range5.move("character",a5);
 range5.moveEnd("character",b5);
 range5.select(); 

  if (sobCol[v5]==true)  {
        if (k<10)   { Col[k] = v5;    s=sl5+("col1_" +k+ "†")+sp5; nak=nak+b5-7; } 
        if (k>10)   { Col[k] = v5;    s=sl5+("col2_" +k+ "†")+sp5; nak=nak+b5-8; }
		 k++;} 

 if (k<10 && sobCol[v5]==null) {
 var r=prompt(" :: Подозрительные символы ::\nВведите свой вариант:        " +v5,v5)
 if(r!=null && r!="")  { Col[k] = r;    s=sl5+("col1_" +k+ "†")+sp5; count++; }
 else                       { Col[k] = v5; sobCol[v5]=true;  s=sl5+("col1_" +k+ "†")+sp5; } nak=nak+b5-7; }
 if (k && sobCol[v5]==null>=10) {
 var r=prompt(" :: Подозрительные символы :::\nВведите свой вариант:        " +v5,v5)
 if(r!=null && r!="")  { Col[k] = r;    s=sl5+("col2_" +k+ "†")+sp5; count++; }
 else                       { Col[k] = v5; sobCol[v5]=true;  s=sl5+("col2_" +k+ "†")+sp5; } nak=nak+b5-8; }
k++; }

       while (s.search(re70)!=-1) {
    var v7  = s.replace(re70, re71);
    var sl7   = s.replace(re70, re72);
    var sp7   = s.replace(re70, re73);

 var s7  = s.replace(re70, re7s);
 var a7=ss.search(s7)+nak;
 var b7=s7.length;
 var range7=document.body.createTextRange();
 range7.moveToElementText(ptr);
 range7.collapse();
 range7.move("character",a7);
 range7.moveEnd("character",b7);
 range7.select(); 

  if (sobCol[v7]==true)  {
        if (k<10)   { Col[k] = v7;    s=sl7+("col1_" +k+ "†")+sp7; nak=nak+b7-7; } 
        if (k>10)   { Col[k] = v7;    s=sl7+("col2_" +k+ "†")+sp7; nak=nak+b7-8; }
		 k++;} 

 if (k<10 && sobCol[v7]==null) {
 var r=prompt(" :: Цифры 1 ::\nВведите свой вариант:        " +v7,v7)
 if(r!=null && r!="")  { Col[k] = r;    s=sl7+("col1_" +k+ "†")+sp7;  count++; }
 else                       { Col[k] = v7; sobCol[v7]=true;  s=sl7+("col1_" +k+ "†")+sp7} nak=nak+b7-7; }
 if (k>=10 && sobCol[v7]==null) {
 var r=prompt(" :: Цифры 1 :::\nВведите свой вариант:        " +v7,v7)
 if(r!=null && r!="")  { Col[k] = r;    s=sl7+("col2_" +k+ "†")+sp7;  count++; }
 else                       { Col[k] = v7; sobCol[v7]=true;  s=sl7+("col2_" +k+ "†")+sp7} nak=nak+b7-8; }
k++; }

       while (s.search(re_70)!=-1) {
    var v_7  = s.replace(re_70, re_71);
    var sl_7   = s.replace(re_70, re_72);
    var sp_7   = s.replace(re_70, re_73);
    var vv_7  = s.replace(re_70, re_74);

 var s_7  = s.replace(re_70, re_7s);
 var a_7=ss.search(s_7)+nak;
 var b_7=s_7.length;
 var range_7=document.body.createTextRange();
 range_7.moveToElementText(ptr);
 range_7.collapse();
 range_7.move("character",a_7);
 range_7.moveEnd("character",b_7);
 range_7.select(); 

  if (sobCol[v_7]==true)  {
        if (k<10)   { Col[k] = v_7;    s=sl_7+("col1_" +k+ "†")+sp_7; nak=nak+b_7-7; } 
        if (k>10)   { Col[k] = v_7;    s=sl_7+("col2_" +k+ "†")+sp_7; nak=nak+b_7-8; }
		 k++;} 

 if (k<10 && sobCol[v_7]==null) {
 var r=prompt(" :: Цифры 2 ::\nВведите свой вариант:        " +v_7,vv_7)
 if(r!=null && r!="")  { Col[k] = r;    s=sl_7+("col1_" +k+ "†")+sp_7;  count++; }
 else                       { Col[k] = v_7; sobCol[v_7]=true;  s=sl_7+("col1_" +k+ "†")+sp_7} nak=nak+b_7-7; }
 if (k>=10 && sobCol[v_7]==null) {
 var r=prompt(" :: Цифры 2 :::\nВведите свой вариант:        " +v_7,vv_7)
 if(r!=null && r!="")  { Col[k] = r;    s=sl_7+("col2_" +k+ "†")+sp_7;  count++; }
 else                       { Col[k] = v_7; sobCol[v_7]=true;  s=sl_7+("col2_" +k+ "†")+sp_7} nak=nak+b_7-8; }
k++; }


       while (s.search(re80)!=-1) {
    var v8  = s.replace(re80, re81);
    var sl8   = s.replace(re80, re82);
    var sp8   = s.replace(re80, re83);

 var s8  = s.replace(re80, re8s);
 var a8=ss.search(s8)+nak;
 var b8=s8.length;
 var range8=document.body.createTextRange();
 range8.moveToElementText(ptr);
 range8.collapse();
 range8.move("character",a8);
 range8.moveEnd("character",b8);
 range8.select(); 

  if (sobCol[v8]==true)  {
        if (k<10)   { Col[k] = v8;    s=sl8+("col1_" +k+ "†")+sp8; nak=nak+b8-7; } 
        if (k>10)   { Col[k] = v8;    s=sl8+("col2_" +k+ "†")+sp8; nak=nak+b8-8; }
		 k++;} 

 if (k<10 && sobCol[v8]==null) {
 var r=prompt(" :: Кавычки ::\nВведите свой вариант:        " +v8,v8)
 if(r!=null && r!="")  { Col[k] = r;    s=sl8+("col1_" +k+ "†")+sp8;  count++; }
 else                       { Col[k] = v8; sobCol[v8]=true;  s=sl8+("col1_" +k+ "†")+sp8} nak=nak+b8-7;}
 if (k>=10 && sobCol[v8]==null) {
 var r=prompt(" :: Кавычки :::\nВведите свой вариант:        " +v8,v8)
 if(r!=null && r!="")  { Col[k] = r;    s=sl8+("col2_" +k+ "†")+sp8;  count++; }
 else                       { Col[k] = v8; sobCol[v8]=true;  s=sl8+("col2_" +k+ "†")+sp8} nak=nak+b8-8;}
k++; }

       while (s.search(re90)!=-1) {
    var v9  = s.replace(re90, re91);
    var sl9   = s.replace(re90, re92);
    var sp9   = s.replace(re90, re93);

 var s9  = s.replace(re90, re9s);
 var a9=ss.search(s9)+nak;
 var b9=s9.length;
 var range9=document.body.createTextRange();
 range9.moveToElementText(ptr);
 range9.collapse();
 range9.move("character",a9);
 range9.moveEnd("character",b9);
 range9.select(); 

  if (sobCol[v9]==true)  {
        if (k<10)   { Col[k] = v9;    s=sl9+("col1_" +k+ "†")+sp9; nak=nak+b9-7;} 
        if (k>10)   { Col[k] = v9;    s=sl9+("col2_" +k+ "†")+sp9; nak=nak+b9-8;}
		 k++;} 

 if (k<10 && sobCol[v9]==null) {
 var r=prompt(" :: Дефис ::\nВведите свой вариант:        " +v9,v9)
 if(r!=null && r!="")  { Col[k] = r;    s=sl9+("col1_" +k+ "†")+sp9;  count++; }
 else                       { Col[k] = v9; sobCol[v9]=true;  s=sl9+("col1_" +k+ "†")+sp9} nak=nak+b9-7;}
 if (k>=10 && sobCol[v9]==null) {
 var r=prompt(" :: Дефис :::\nВведите свой вариант:        " +v9,v9)
 if(r!=null && r!="")  { Col[k] = r;    s=sl9+("col2_" +k+ "†")+sp9;  count++; }
 else                       { Col[k] = v9; sobCol[v9]=true;  s=sl9+("col2_" +k+ "†")+sp9} nak=nak+b9-8;}
k++; }




       while (s.search(re100)!=-1) {
    var v10  = s.replace(re100, re101);
    var sl10   = s.replace(re100, re102);
    var sp10   = s.replace(re100, re103);
    var vv10  = s.replace(re100, re104)
    var def  = s.replace(re100, re10d);

 var s10  = s.replace(re100, re10s);
 var a10=ss.search(s10)+nak;
 var b10=s10.length;
 var range10=document.body.createTextRange();
 range10.moveToElementText(ptr);
 range10.collapse();
 range10.move("character",a10);
 range10.moveEnd("character",b10);
 range10.select(); 

  if (sobCol[v10]==true || Coldef[def]==true)  {
        if (k<10)   { Col[k] = v10;    s=sl10+("col1_" +k+ "†")+sp10; nak=nak+b10-7;} 
        if (k>10)   { Col[k] = v10;    s=sl10+("col2_" +k+ "†")+sp10; nak=nak+b10-8;}
		 k++;} 

 if (k<10 && sobCol[v10]==null && Coldef[def]==null) {
 var r=prompt(" :: Дефис до пробела ::\nВведите свой вариант:        " +v10,vv10)
 if(r!=null && r!="")  { Col[k] = r;    s=sl10+("col1_" +k+ "†")+sp10;  count++; }
 else                       { Col[k] = v10; sobCol[v10]=true;  s=sl10+("col1_" +k+ "†")+sp10} nak=nak+b10-7;}
 if (k>=10 && sobCol[v10]==null && Coldef[def]==null) {
 var r=prompt(" :: Дефис до пробела :::\nВведите свой вариант:        " +v10,vv10)
 if(r!=null && r!="")  { Col[k] = r;    s=sl10+("col2_" +k+ "†")+sp10;  count++; }
 else                       { Col[k] = v10; sobCol[v10]=true;  s=sl10+("col2_" +k+ "†")+sp10} nak=nak+b10-8;}
k++; }

       while (s.search(re110)!=-1) {
    var v11  = s.replace(re110, re111);
    var sl11   = s.replace(re110, re112);
    var sp11   = s.replace(re110, re113);

 var s11  = s.replace(re110, re11s);
 var a11=ss.search(s11)+nak;
 var b11=s11.length;
 var range11=document.body.createTextRange();
 range11.moveToElementText(ptr);
 range11.collapse();
 range11.move("character",a11);
 range11.moveEnd("character",b11);
 range11.select(); 

  if (sobCol[v11]==true)  {
        if (k<10)   { Col[k] = v11;    s=sl11+("col1_" +k+ "†")+sp11; nak=nak+b11-7;} 
        if (k>10)   { Col[k] = v11;    s=sl11+("col2_" +k+ "†")+sp11; nak=nak+b11-8;}
		 k++;} 

 if (k<10 && sobCol[v11]==null) {
 var r=prompt(" :: Дефис после пробела ::\nВведите свой вариант:        " +v11,v11)
 if(r!=null && r!="")  { Col[k] = r;    s=sl11+("col1_" +k+ "†")+sp11;  count++; }
 else                       { Col[k] = v11; sobCol[v11]=true;  s=sl11+("col1_" +k+ "†")+sp11} nak=nak+b11-7;}
 if (k>=10 && sobCol[v11]==null) {
 var r=prompt(" :: Дефис после пробела :::\nВведите свой вариант:        " +v11,v11)
 if(r!=null && r!="")  { Col[k] = r;    s=sl11+("col2_" +k+ "†")+sp11;  count++; }
 else                       { Col[k] = v11; sobCol[v11]=true;  s=sl11+("col2_" +k+ "†")+sp11} nak=nak+b11-8;}
k++; }

if (Apostrophe)
                      { 
       while (s.search(re120)!=-1) {
    var v12  = s.replace(re120, re121);
    var sl12   = s.replace(re120, re122);
    var sp12   = s.replace(re120, re123);
    var vv12  = s.replace(re120, re124);

 var s12  = s.replace(re120, re12s);
 var a12=ss.search(s12)+nak;
 var b12=s12.length;
 var range12=document.body.createTextRange();
 range12.moveToElementText(ptr);
 range12.collapse();
 range12.move("character",a12);
 range12.moveEnd("character",b12);
 range12.select(); 

  if (sobCol[v12]==true)  {
        if (k<10)   { Col[k] = v12;    s=sl12+("col1_" +k+ "†")+sp12; nak=nak+b12-7;} 
        if (k>10)   { Col[k] = v12;    s=sl12+("col2_" +k+ "†")+sp12; nak=nak+b12-8;}
		 k++;} 

 if (k<10 && sobCol[v12]==null) {
 var r=prompt(" :: Апостроф' ::\nВведите свой вариант:        " +v12,vv12)
 if(r!=null && r!="")  { Col[k] = r;    s=sl12+("col1_" +k+ "†")+sp12;  count++; }
 else                       { Col[k] = v12; sobCol[v12]=true;  s=sl12+("col1_" +k+ "†")+sp12} nak=nak+b12-7;}
 if (k>=10 && sobCol[v12]==null) {
 var r=prompt(" :: Апостроф' :::\nВведите свой вариант:        " +v12,vv12)
 if(r!=null && r!="")  { Col[k] = r;    s=sl12+("col2_" +k+ "†")+sp12;  count++; }
 else                       { Col[k] = v12; sobCol[v12]=true;  s=sl12+("col2_" +k+ "†")+sp12} nak=nak+b12-8;}
k++; }
                     }


if (Slash)
                      { 
       while (s.search(re120a)!=-1) {
    var v12a  = s.replace(re120a, re121a);
    var sl12a   = s.replace(re120a, re122a);
    var sp12a   = s.replace(re120a, re123a);
    var vv12a  = s.replace(re120a, re124a);

 var s12a  = s.replace(re120a, re12as);
 var a12a=ss.search(s12a)+nak;
 var b12a=s12a.length;
 var range12a=document.body.createTextRange();
 range12a.moveToElementText(ptr);
 range12a.collapse();
 range12a.move("character",a12a);
 range12a.moveEnd("character",b12a);
 range12a.select(); 

  if (sobCol[v12a]==true)  {
        if (k<10)   { Col[k] = v12a;    s=sl12a+("col1_" +k+ "†")+sp12a;  nak=nak+b12a-7;} 
        if (k>10)   { Col[k] = v12a;    s=sl12a+("col2_" +k+ "†")+sp12a;  nak=nak+b12a-8;}
		 k++;} 

 if (k<10 && sobCol[v12a]==null) {
 var r=prompt(" :: Сл/эш ::\nВведите свой вариант:        " +v12a,vv12a)
 if(r!=null && r!="")  { Col[k] = r;    s=sl12a+("col1_" +k+ "†")+sp12a;  count++; }
 else                       { Col[k] = v12a; sobCol[v12a]=true;  s=sl12a+("col1_" +k+ "†")+sp12a}  nak=nak+b12a-7;}
 if (k>=10 && sobCol[v12a]==null) {
 var r=prompt(" :: Сл/эш :::\nВведите свой вариант:        " +v12a,vv12a)
 if(r!=null && r!="")  { Col[k] = r;    s=sl12a+("col2_" +k+ "†")+sp12a;  count++; }
 else                       { Col[k] = v12a; sobCol[v12a]=true;  s=sl12a+("col2_" +k+ "†")+sp12a}  nak=nak+b12a-8;}
k++; }
                     }

       while (s.search(re130)!=-1) {
    var v13  = s.replace(re130, re131);
    var sl13   = s.replace(re130, re132);
    var sp13   = s.replace(re130, re133);
    var vv13  = s.replace(re130, re134);

 var s13  = s.replace(re130, re13s);
 var a13=ss.search(s13)+nak;
 var b13=s13.length;
 var range13=document.body.createTextRange();
 range13.moveToElementText(ptr);
 range13.collapse();
 range13.move("character",a13);
 range13.moveEnd("character",b13);
 range13.select(); 

  if (sobCol[v13]==true)  {
        if (k<10)   { Col[k] = v13;    s=sl13+("col1_" +k+ "†")+sp13;  nak=nak+b13-7;} 
        if (k>10)   { Col[k] = v13;    s=sl13+("col2_" +k+ "†")+sp13;  nak=nak+b13-8;}
		 k++;} 

 if (k<10 && sobCol[v13]==null) {
 var r=prompt(" :: Мусор ::\nВведите свой вариант:        " +v13,vv13)
 if(r!=null && r!="")  { Col[k] = r;    s=sl13+("col1_" +k+ "†")+sp13;  count++; }
 else                       { Col[k] = v13; sobCol[v13]=true;  s=sl13+("col1_" +k+ "†")+sp13}  nak=nak+b13-7;}
 if (k>=10 && sobCol[v13]==null) {
 var r=prompt(" :: Мусор :::\nВведите свой вариант:        " +v13,vv13)
 if(r!=null && r!="")  { Col[k] = r;    s=sl13+("col2_" +k+ "†")+sp13;  count++; }
 else                       { Col[k] = v13; sobCol[v13]=true;  s=sl13+("col2_" +k+ "†")+sp13}  nak=nak+b13-5;}
k++; }

       while (s.search(re140)!=-1) {
    var v14  = s.replace(re140, re141);
    var sl14   = s.replace(re140, re142);
    var sp14   = s.replace(re140, re143);
    var vv14  = s.replace(re140, re144);

 var s14  = s.replace(re140, re14s);
 var a14=ss.search(s14)+nak;
 var b14=s14.length;
 var range14=document.body.createTextRange();
 range14.moveToElementText(ptr);
 range14.collapse();
 range14.move("character",a14);
 range14.moveEnd("character",b14);
 range14.select(); 

  if (sobCol[v14]==true)  {
        if (k<10)   { Col[k] = v14;    s=sl14+("col1_" +k+ "†")+sp14;  nak=nak+b14-7;} 
        if (k>10)   { Col[k] = v14;    s=sl14+("col2_" +k+ "†")+sp14;  nak=nak+b14-6;}
		 k++;} 

 if (k<10 && sobCol[v14]==null) {
 var r=prompt(" :: Скобка ::\nВведите свой вариант:        " +v14,vv14)
 if(r!=null && r!="")  { Col[k] = r;    s=sl14+("col1_" +k+ "†")+sp14;  count++; }
 else                       { Col[k] = v14; sobCol[v14]=true;  s=sl14+("col1_" +k+ "†")+sp14}  nak=nak+b14-7;}
 if (k>=10 && sobCol[v14]==null) {
 var r=prompt(" :: Скобка :::\nВведите свой вариант:        " +v14,vv14)
 if(r!=null && r!="")  { Col[k] = r;    s=sl14+("col2_" +k+ "†")+sp14;  count++; }
 else                       { Col[k] = v14; sobCol[v14]=true;  s=sl14+("col2_" +k+ "†")+sp14}  nak=nak+b14-8;}
k++; }


       while (s.search(re150)!=-1) {
    var v15  = s.replace(re150, re151);
    var sl15   = s.replace(re150, re152);
    var sp15   = s.replace(re150, re153);

 var s15  = s.replace(re150, re15s);
 var a15=ss.search(s15)+nak;
 var b15=s15.length;
 var range15=document.body.createTextRange();
 range15.moveToElementText(ptr);
 range15.collapse();
 range15.move("character",a15);
 range15.moveEnd("character",b15);
 range15.select(); 

  if (sobCol[v15]==true)  {
        if (k<10)   { Col[k] = v15;    s=sl15+("col1_" +k+ "†")+sp15;  nak=nak+b15-7;} 
        if (k>10)   { Col[k] = v15;    s=sl15+("col2_" +k+ "†")+sp15;  nak=nak+b15-6;}
		 k++;} 

 if (k<10 && sobCol[v15]==null) {
 var r=prompt(" :: Союз ::\nВведите свой вариант:        " +v15,v15)
 if(r!=null && r!="")  { Col[k] = r;    s=sl15+("col1_" +k+ "†")+sp15;  count++; }
 else                       { Col[k] = v15; sobCol[v15]=true;  s=sl15+("col1_" +k+ "†")+sp15}  nak=nak+b15-7;}
 if (k>=10 && sobCol[v15]==null) {
 var r=prompt(" :: Союз :::\nВведите свой вариант:        " +v15,v15)
 if(r!=null && r!="")  { Col[k] = r;    s=sl15+("col2_" +k+ "†")+sp15;  count++; }
 else                       { Col[k] = v15; sobCol[v15]=true;  s=sl15+("col2_" +k+ "†")+sp15}  nak=nak+b15-8;}
k++; }


       while (s.search(re160)!=-1) {
    var v16  = s.replace(re160, re161);
    var sl16   = s.replace(re160, re162);
    var sp16   = s.replace(re160, re163);
    var vv16  = s.replace(re160, re164);

 var s16  = s.replace(re160, re16s);
 var a16=ss.search(s16)+nak;
 var b16=s16.length;
 var range16=document.body.createTextRange();
 range16.moveToElementText(ptr);
 range16.collapse();
 range16.move("character",a16);
 range16.moveEnd("character",b16);
 range16.select(); 

  if (sobCol[v16]==true)  {
        if (k<10)   { Col[k] = v16;    s=sl16+("col1_" +k+ "†")+sp16;  nak=nak+b16-7;} 
        if (k>10)   { Col[k] = v16;    s=sl16+("col2_" +k+ "†")+sp16;  nak=nak+b16-6;}
		 k++;} 

 if (k<10 && sobCol[v16]==null) {
 var r=prompt(" :: Тире – 1 ::\nВведите свой вариант:        " +v16,vv16)
 if(r!=null && r!="")  { Col[k] = r;    s=sl16+("col1_" +k+ "†")+sp16;  count++; }
 else                       { Col[k] = v16; sobCol[v16]=true;  s=sl16+("col1_" +k+ "†")+sp16}  nak=nak+b16-7;}
 if (k>=10 && sobCol[v16]==null) {
 var r=prompt(" :: Тире – 2 :::\nВведите свой вариант:        " +v16,vv16)
 if(r!=null && r!="")  { Col[k] = r;    s=sl16+("col2_" +k+ "†")+sp16;  count++; }
 else                       { Col[k] = v16; sobCol[v16]=true;  s=sl16+("col2_" +k+ "†")+sp16}  nak=nak+b16-8;}
k++; }

       while (s.search(re170)!=-1) {
    var v17  = s.replace(re170, re171);
    var sl17   = s.replace(re170, re172);
    var sp17   = s.replace(re170, re173);
    var vv17  = s.replace(re170, re174);

 var s17  = s.replace(re170, re17s);
 var a17=ss.search(s17)+nak;
 var b17=s17.length;
 var range17=document.body.createTextRange();
 range17.moveToElementText(ptr);
 range17.collapse();
 range17.move("character",a17);
 range17.moveEnd("character",b17);
 range17.select(); 

  if (sobCol[v17]==true)  {
        if (k<10)   { Col[k] = v17;    s=sl17+("col1_" +k+ "†")+sp17;  nak=nak+b17-7;} 
        if (k>10)   { Col[k] = v17;    s=sl17+("col2_" +k+ "†")+sp17;  nak=nak+b17-8;}
		 k++;} 

 if (k<10 && sobCol[v17]==null) {
 var r=prompt(" :: Тире – 1 ::\nВведите свой вариант:        " +v17,vv17)
 if(r!=null && r!="")  { Col[k] = r;    s=sl17+("col1_" +k+ "†")+sp17;  count++; }
 else                       { Col[k] = v17; sobCol[v17]=true;  s=sl17+("col1_" +k+ "†")+sp17}  nak=nak+b17-7;}
 if (k>=10 && sobCol[v17]==null) {
 var r=prompt(" :: Тире – 2 :::\nВведите свой вариант:        " +v17,vv17)
 if(r!=null && r!="")  { Col[k] = r;    s=sl17+("col2_" +k+ "†")+sp17;  count++; }
 else                       { Col[k] = v17; sobCol[v17]=true;  s=sl17+("col2_" +k+ "†")+sp17}  nak=nak+b17-8;}
k++; }


       while (s.search(re180)!=-1) {
    var v18  = s.replace(re180, re181);
    var sl18   = s.replace(re180, re182);
    var sp18   = s.replace(re180, re183);
    var vv18  = s.replace(re180, re184);

 var s18  = s.replace(re180, re18s);
 var a18=ss.search(s18)+nak;
 var b18=s18.length;
 var range18=document.body.createTextRange();
 range18.moveToElementText(ptr);
 range18.collapse();
 range18.move("character",a18);
 range18.moveEnd("character",b18);
 range18.select(); 

  if (sobCol[v18]==true)  {
        if (k<10)   { Col[k] = v18;    s=sl18+("col1_" +k+ "†")+sp18;  nak=nak+b18-7;} 
        if (k>10)   { Col[k] = v18;    s=sl18+("col2_" +k+ "†")+sp18;  nak=nak+b18-8;}
		 k++;} 

 if (k<10 && sobCol[v18]==null) {
 var r=prompt(" :: Мусор-2 ::\nВведите свой вариант:        " +v18,vv18)
 if(r!=null && r!="")  { Col[k] = r;    s=sl18+("col1_" +k+ "†")+sp18;  count++; }
 else                       { Col[k] = v18; sobCol[v18]=true;  s=sl18+("col1_" +k+ "†")+sp18}  nak=nak+b18-7;}
 if (k>=10 && sobCol[v18]==null) {
 var r=prompt(" :: Мусор-2 :::\nВведите свой вариант:        " +v18,vv18)
 if(r!=null && r!="")  { Col[k] = r;    s=sl18+("col2_" +k+ "†")+sp18;  count++; }
 else                       { Col[k] = v18; sobCol[v18]=true;  s=sl18+("col2_" +k+ "†")+sp18}  nak=nak+b18-8;}
k++; }


       while (s.search(re190)!=-1) {
    var v19  = s.replace(re190, re191);
    var sl19   = s.replace(re190, re192);
    var sp19   = s.replace(re190, re193);
    var vv19  = s.replace(re190, re194);
 if (k<10) {
 var r=prompt(" :: Вкрапления ::\nВведите свой вариант:        " +v19,vv19)
 if(r!=null && r!="")  { Col[k] = r;    s=sl19+("col1_" +k+ "†")+sp19;  count++; }
 else                       { Col[k] = v19;  s=sl19+("col1_" +k+ "†")+sp19} }
 if (k>=10) {
 var r=prompt(" :: Вкрапления :::\nВведите свой вариант:        " +v19,vv19)
 if(r!=null && r!="")  { Col[k] = r;    s=sl19+("col2_" +k+ "†")+sp19;  count++; }
 else                       { Col[k] = v19;  s=sl19+("col2_" +k+ "†")+sp19} }
k++; }


				}








if ( s.search(re_fin1)!=-1 || s.search(re_fin2)!=-1) {                                                 // Восстановление временных замен
for (z=0;z<k;z++)  {
                     if (z<10)     { var re200 = new RegExp("col1_("+z+")†","g");
                                        var re201 = Col[z];
                                           s=s.replace(re200,re201); }
                  if (z>=10)      {var re210 = new RegExp("col2_("+z+")†","g");
                                        var re211 = Col[z];
                                           s=s.replace(re210,re211); }            } k=0;  nak = 0; }

   ptr.innerHTML=s;      
  } 

//    window.external.BeginUndoUnit(document,"«cлипшиеся» слова");                               // отключил откат — жрёт оперативку

 var body=document.getElementById("fbw_body");
 var ptr=body;
 var ProcessingEnding=false;
 while (!ProcessingEnding && ptr) {
  SaveNext=ptr;
  if (SaveNext.firstChild!=null && SaveNext.nodeName!="P" && 
      !(SaveNext.nodeName=="DIV" && 
        ((SaveNext.className=="history" && !ObrabotkaHistory) || 
         (SaveNext.className=="annotation" && !ObrabotkaAnnotation))))
  {    SaveNext=SaveNext.firstChild;  }                                                         // либо углубляемся...

  else {
    while (SaveNext.nextSibling==null)  {
     SaveNext=SaveNext.parentNode;                                                           // ...либо поднимаемся (если уже сходили вглубь)
                                                                                                                // поднявшись до элемента P, не забудем поменять флаг
     if (SaveNext==body) {ProcessingEnding=true;}
                                                         }
   SaveNext=SaveNext.nextSibling; //и переходим на соседний элемент
         }
  if (ptr.nodeName=="P") HandleP(ptr);
  ptr=SaveNext;
 }


//    window.external.EndUndoUnit(document);

var Tf=new Date().getTime();
var Thour = Math.floor((Tf-Ts)/3600000);
var Tmin  = Math.floor((Tf-Ts)/60000-Thour*60);
var Tsec = Math.ceil((Tf-Ts)/1000-Tmin*60-Thour*3600);
var Tsec1 = Math.ceil(10*((Tf-Ts)/1000-Tmin*60))/10;
var Tsec2 = Math.ceil(100*((Tf-Ts)/1000-Tmin*60))/100;
var Tsec3 = Math.ceil(1000*((Tf-Ts)/1000-Tmin*60))/1000;

           if (Tsec3<1 && Tmin<1)    TimeStr=Tsec3+ " сек"
 else { if (Tsec2<10 && Tmin<1)   TimeStr=Tsec2+ " сек"
 else { if (Tsec1<30 && Tmin<1)   TimeStr=Tsec1+ " сек"
 else { if (Tmin<1)                       TimeStr=Tsec+ " сек" 
 else { if (Tmin>=1 && Thour<1)   TimeStr=Tmin+ " мин " +Tsec+ " с"
 else { if (Thour>=1)                    TimeStr=Thour+ " ч " +Tmin+ " мин " +Tsec+ " с"  }}}}}

 MsgBox ('    –= Jürgen Script =– \n'+
        '«Слипшиеся слова» v.'+VersionNumber+'	\n\n'+
        'Произведено замен:   ' +count+'\n\n'+
        'Время: ' +TimeStr+ '\n' );

} 