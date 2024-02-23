//======================================
//     Интерактивный поиск знаков препинания и т. д. и т. п.
//                                                 8 мая 2008 г.
//     Автор скрипта - jurgennt
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
// v.2.7 — прерывание процесса 
//======================================
// v.2.8 — проверка от курсора — sclex, май 2010
//======================================
// v.2.9 — доработка движка под прерывание и выход — sclex, май 2010
//======================================
// v.2.92 — доработка подсветки для найденных рез-тов поиска — Alex2L, май, июнь 2012
//======================================

var VersionNumber="3.2";

//обрабатывать ли history
var ObrabotkaHistory=true;
//обрабатывать ли annotation
var ObrabotkaAnnotation=true;
// обрабатывать ли апостроф
 var Apostrophe=false;
  var PromptApostrophe=true;
// обрабатывать ли слэш
 var Slash=false;
  var PromptSlash=true;

var sIB="<EM>|<STRONG>|<EM><STRONG>|<STRONG><EM>";
var fIB="</EM>|</STRONG>|</EM></STRONG>|</STRONG></EM>";
var aIB="<EM>|<STRONG>|<EM><STRONG>|<STRONG><EM>|</EM>|</STRONG>|</EM></STRONG>|</STRONG></EM>";

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
          sobCol = new Object();                     // коллекция «отменённых», чтобы по десять раз их не проверять
          Coldef = new Object();                     // коллекция ДО дефиса

          xCol = new Object();                       // коллекции оригинальных словосочетаний

Coldef["радио"] = true;
Coldef["теле"] = true;
Coldef["лево"] = true;
Coldef["право"] = true;

                                                    // Знаки препи.нания между буквами (кириллица) и прочее непотребство
 var re10 = new RegExp("^(.*?){0,1}([А-яЁё]+)("+fIB+"){0,1}([\\\.,…\\\"„“”!\\\?\\\|:;\\\*%\\\^\\\dA-z\\\(\\\)]+)("+sIB+"){0,1}([А-яЁё]+)(.*?){0,1}$","gi");
 var re11 = "$2$3$4$5$6";                    // отображение в запросе
 var re12 = "$1";                           // с начала абзаца до искомого места
 var re13 = "$7";                           // до конца параграфа

 var re14 = "$2 $5";
                                                    // исключая ";" — чтобы не спотыкаться на неразрывных пробелах
 var re20 = new RegExp("^(.*?){0,1}([А-яЁё]+)("+aIB+"){0,1}([\\\.,\\\"„“”!\\\?\\\|:\\\*%\\\^\\\d])("+aIB+"){0,1}([А-яЁё]+)(.*?){0,1}$","gi");
 var re21 = "$2$3$4$5$6";
 var re22 = "$1"; 
 var re23 = "$7";

                                                   // Прописная сразуПосле строчной — возможно пропущен пробел
 var re30 = new RegExp("^(.*?[^«„А-яЁё]){0,1}([А-яЁё]{0,1}[а-яё]+)("+fIB+"){0,1}("+sIB+"){0,1}([А-ЯЁ№§])([а-яё]*?)([^»“А-яЁё].*?){0,1}$","g");
 var re31 = "$2$3$4$5$6";
 var re32 = "$1"; 
 var re33 = "$7";
 var re34 = "$2$3 $4$5$6";

                                                      // Несколько ПРОписных сразу перед строчными — хотя может так и надо
 var re40 = new RegExp("^(.*?){0,1}([А-ЯЁ]{2,})("+fIB+"){0,1}("+sIB+"){0,1}([а-яё]+)(.*?){0,1}$","g");
 var re41 = "$2$3$4$5";
 var re42 = "$1"; 
 var re43 = "$6";

                                                      // Прилипший курсив
 var re50 = new RegExp("^(.*?){0,1}([А-яЁё]{2,})("+aIB+")([а-яё]+)(.+){0,1}$","g");
 var re51 = "$2$3$4";
 var re52 = "$1"; 
 var re53 = "$5";

                                                      // строчная. после точки и т. п.
 var re60 = new RegExp("^(.*?){0,1}([^"+nbspChar+"\\\(\\\)][А-яЁё]+)("+fIB+"){0,1}([\\\.!\\\?\\\|\\\^\\\(]+)(["+nbspEntity+"|\\\s]*)("+sIB+"){0,1}([а-яё]+)(.*?){0,1}$","g");
 var re61 = "$2$3$4$5$6$7";
 var re62 = "$1";
 var re63 = "$8";

                                                      // Цифры после строчных
// var re70 = new RegExp("^(.*?){0,1}([^;][а-яё]+\\\){0,1})(([:,])|( {0,1}[–—\\\-])|([–—\\\-] {0,1})){0,1}(\\\d+)(.*?){0,1}$","g"); // и почему это я был против неразрывного пробела перед буквой - не помню. ((
 var re70 = new RegExp("^(.*?){0,1}([А-ЯЁ]{0,1}[а-яё]+\\\){0,1}»{0,1})(([:,])|( [–—\\\-])|([–—\\\-] )){0,1}("+aIB+"){0,1}(\\\d+)(.*?){0,1}$","g");
 var re71 = "$2$3$7$8";
 var re72 = "$1";
 var re73 = "$9";

                                                       // Цифры перед строчными
 var re_70 = new RegExp("^(.*?){0,1}(\\\d+)("+aIB+"){0,1}([а-яё]+)(.*?){0,1}$","g");
 var re_71 = "$2$3$4";
 var re_72 = "$1";
 var re_73 = "$5";
 var re_74 = "$2$3 $4";

                                                      // "Русские" кавычки
 var re80 = new RegExp("^(.*?){0,1}([а-я\\\-]+[\\\.,])(»)(.*?){0,1}$","g");
 var re81 = "$2$3";
 var re82 = "$1";
 var re83 = "$4";

                                                       // Буква после дефиса и точки и т. п.
 var re90 = new RegExp("^(.*?){0,1}([а-яёa-z\\\"“»%]+)("+fIB+"){0,1}([\\\.,])((\\\s)|("+nbspEntity+")){0,1}([\\\-–])(\\\s|"+nbspEntity+")("+sIB+"){0,1}([а-яё]+)(.+){0,1}$","gi");
 var re91 = "$2$3$4$5$8$9$10$11";
 var re92 = "$1";
 var re93 = "$12";

                                                       // Dефис+пробел.
 var re100 = new RegExp("^(.*?){0,1}([а-яё]+)(['\\\-——] )([\\\"«]{0,1}[а-яё]+)(.*?){0,1}$","gi");
 var re101 = "$2$3$4";
 var re102 = "$1";
 var re103 = "$5";
 var re104 = "$2 $3$4";
 var re10d = "$2"

                                                       // Dефис+пробел.
 var re110 = new RegExp("^(.*?){0,1}([а-яё]+)( [\\\-'])([\.,:;]{0,1}[а-яё]+)(.*?){0,1}$","gi");
 var re111 = "$2$3$4";
 var re112 = "$1";
 var re113 = "$5";

                                                       // Ненужный апостроф по'среди строчных.
 var re120 = new RegExp("^(.*?){0,1}([а-яё]+)([‘'`])([а-яё]+)(.*?){0,1}$","g");
 var re121 = "$2$3$4";
 var re122 = "$1";
 var re123 = "$5";
 var re124 = "$2$4";

                                                       // Ненужный слэш посре/ди строчных.
 var re120a = new RegExp("^(.*?){0,1}([а-яё]+)(/)([а-яё]+)(.*?){0,1}$","g");
 var re121a = "$2$3$4";
 var re122a = "$1";
 var re123a = "$5";
 var re124a = "$2$4";

                                                       // Ненужный апостроф 'перед строчными.
 var re120b = new RegExp("^(.*?){0,1}([‘'`])([а-яё]+)(.*?){0,1}$","g");
 var re121b = "$2$3";
 var re122b = "$1";
 var re123b = "$4";
 var re124b = "$3";

                                                       // Разнообразный мусор.
 var re130 = new RegExp("^(.*?){0,1}([а-яё\\\.;:,!\\\?—]+)((\\\s)|("+nbspEntity+")){0,1}([_\\\<\\\>•■~])((\\\s)|("+nbspEntity+")){0,1}([а-яё—–«»„“]+)(.*?){0,1}$","gi");
 var re131 = "$2$3$6$7$10";
 var re132 = "$1";
 var re133 = "$11";
 var re134 = "$2$3$10";

                                                   // После строчной( открывающаяся круглая скобка — возможно пропущен пробел
 var re140 = new RegExp("^(.*?[^«„А-яЁё]){0,1}([А-яЁё]{0,1}[а-яё]+»{0,1})("+fIB+"){0,1}("+sIB+"){0,1}([А-ЯЁ\\\(])([А-яё]+)([^»“А-яЁё].*?){0,1}$","g");
 var re141 = "$2$3$4$5$6";
 var re142 = "$1"; 
 var re143 = "$7";
 var re144 = "$2$3 $4$5$6";

                                                   // Невозможные союзы
 var re150 = new RegExp("^(.*?)([а-яё]+ )("+aIB+"){0,1}(е|з|н|п|ш|ъ|ь|ы|й|ц|ч|ф)( [а-яё]+)(.*?)$","g");
 var re151 = "$2$3$4$5";
 var re152 = "$1"; 
 var re153 = "$6";

                                                   // Пробелы около тире рядом с цифрами
 var re160 = new RegExp("^(.*?)(\\\d+)( {0,1})("+fIB+"){0,1}( {0,1})—("+sIB+"){0,1}([А-яЁё]+)(.*?)$","g");
 var re161 = "$2$3$4$5—$6$7";
 var re162 = "$1"; 
 var re163 = "$8";
 var re164 = "$2$4 — $7";

                                                   // Пробелы около тире рядом с цифрами
 var re170 = new RegExp("^(.*?)(\\\d+)("+fIB+"){0,1}—( {0,1})("+sIB+"){0,1}( {0,1})([А-яЁё]+)(.*?)$","g");
 var re171 = "$2$3—$4$5$6$7";
 var re172 = "$1"; 
 var re173 = "$8";
 var re174 = "$2$3 — $5$7";

                                                       // Разнообразный мусор (продолжение).
 var re180 = new RegExp("^(.*?){0,1}([А-ЯЁ]*[а-яё]+)(\\\-\\\. {0,1})([а-я]+)(.*?){0,1}$","g");
 var re181 = "$2$3$4";
 var re182 = "$1";
 var re183 = "$5";
 var re184 = "$2$4";

                                                       // Обычный текст в курсивном абзаце.
 var re190 = new RegExp("^(("+sIB+").+?)("+fIB+")([A-zА-яЁё\\\d, –—\\\-\\"+nbspEntity+"]{1,11})("+sIB+")(.+?("+fIB+"))$","gi");
 var re191 = "$3$4$5";
 var re192 = "$1";
 var re193 = "$6";
 var re194 = "$4";

                                                     // шаблоны для финального восстановления временных замен «col1_†» – до десяти, свыше – «col2_†»
  var re_fin1 = new RegExp("col1_\\\d†","g");
  var re_fin2 = new RegExp("col2_\\\d{2}†","g");

 var s="";

 var re1cl = new RegExp("<[^<>]+>","g");
 var re11cl = "";

 var re3cl = new RegExp("&#\\\d+;","g");
 var re31cl = "q";

//                  Подсветка                                  //
 function JustBacklighting(s1, sl1) {

 var b0 = s1.length;
 var CodeMode = false;

 var ss = sl1;                      // очистка части абзаца от тегов, умляутов
 if (sl1.search(re1cl)!=-1) {ss = ss.replace(re1cl, re11cl);}
 if (sl1.search(re3cl)!=-1) {ss = ss.replace(re3cl, re31cl);}

 if (s1.search(re1cl)!=-1) { CodeMode = true;}
 if (s1.search(re3cl)!=-1) { CodeMode = true;}

 if ( ss.search(re_fin1)!=-1 || ss.search(re_fin2)!=-1) {                                                 // Восстановление временных замен
   for (z=0;z<k;z++) {
     if (z < 10)  { var re200x = new RegExp("col1_("+z+")†","g");
                    var re201x = xCol[z];
                    ss = ss.replace(re200x,re201x); }
     if (z >= 10) { var re210x = new RegExp("col2_("+z+")†","g");
                    var re211x = xCol[z];
                    ss=ss.replace(re210x,re211x); }
   }
  } 

 var a1 = 0;

 if (CodeMode) {
   //ss=ptr.innerHTML;
   //alert("ss: "+ss);
   if (ss.search(re1cl)!=-1) {ss = ss.replace(re1cl, re11cl);}
   if (ss.search(re3cl)!=-1) {ss = ss.replace(re3cl, re31cl);}

   a1 = ss.replace(/<[^>]+>/g,"").replace(/&(lt|gt|amp|nbsp);/gi,"&").length;
   b0 = s1.replace(/<[^>]+>/g,"").replace(/&(lt|gt|amp|nbsp);/gi,"&").length;
  }
 else { a1 = ss.replace(/&(lt|gt|amp|nbsp);/gi,"&").length; }

 var range1=document.body.createTextRange();
 range1.moveToElementText(ptr);
 range1.collapse();
 range1.move("character",a1);
 range1.moveEnd("character",b0);
 //alert("a1: "+a1+"\n\nb0: "+b0+"\n\nptr.innerHTML: "+ptr.innerHTML);
 range1.select();
 }
//                   Конец подсветки                           //


 // функция, обрабатывающая абзац P
 function HandleP(ptr) {
  s=ptr.innerHTML;


       if (s.search(re10)!=-1 || s.search(re20)!=-1 || s.search(re30)!=-1 || s.search(re40)!=-1 || s.search(re50)!=-1 || s.search(re60)!=-1 || s.search(re70)!=-1 || s.search(re_70)!=-1 || s.search(re80)!=-1 || s.search(re90)!=-1 || s.search(re100)!=-1 || s.search(re110)!=-1 || s.search(re120)!=-1  || s.search(re120a)!=-1 || s.search(re120b)!=-1 || s.search(re130)!=-1 || s.search(re140)!=-1 || s.search(re150)!=-1 || s.search(re160)!=-1 || s.search(re170)!=-1 || s.search(re180)!=-1 || s.search(re190)!=-1)
         { GoTo(ptr);


       while (s.search(re10)!=-1) {
    var v1  = s.replace(re10, re11);
    var sl1   = s.replace(re10, re12);
    var sp1   = s.replace(re10, re13);

  if (sobCol[v1]==true)  {
        if (k<10)   { Col[k] = v1;    s=sl1+("col1_" +k+ "†")+sp1; } 
        if (k>10)   { Col[k] = v1;    s=sl1+("col2_" +k+ "†")+sp1; }
	xCol[k] = v1; k++; }
  else { JustBacklighting(v1, sl1); }

 var r=Object();                                                 
 if (k<10 && sobCol[v1]==null) {
 if (InputBox(" :: Подозрительные символы ::\nВведите свой вариант:        " +v1,v1, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1_" +k+ "†")+sp1;  count++; }
 else                       { Col[k] = v1; sobCol[v1]=true;  s=sl1+("col1_" +k+ "†")+sp1}  }
 if (k>=10 && sobCol[v1]==null) {
 if (InputBox(" :: Подозрительные символы ::\nВведите свой вариант:        " +v1,v1, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2_" +k+ "†")+sp1;  count++; }
 else                       { Col[k] = v1; sobCol[v1]=true;  s=sl1+("col2_" +k+ "†")+sp1} }
xCol[k] = v1; k++; }

       while (s.search(re60)!=-1) {
    var v6  = s.replace(re60, re61);
    var sl6   = s.replace(re60, re62);
    var sp6   = s.replace(re60, re63);

  if (sobCol[v6]==true)  {
        if (k<10)   { Col[k] = v6;    s=sl6+("col1_" +k+ "†")+sp6; } 
        if (k>10)   { Col[k] = v6;    s=sl6+("col2_" +k+ "†")+sp6; }
	xCol[k] = v6; k++; }
  else { JustBacklighting(v6, sl6); }

 var r=Object();                                                 
 if (k<10 && sobCol[v6]==null) {
 if (InputBox(" :: Подозрительная пунктуация ::\nВведите свой вариант:        " +v6,v6, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl6+("col1_" +k+ "†")+sp6;  count++; }
 else                       { Col[k] = v6; sobCol[v6]=true;  s=sl6+("col1_" +k+ "†")+sp6} }
 if (k>=10 && sobCol[v6]==null) {
 if (InputBox(" :: Подозрительная пунктуация ::\nВведите свой вариант:        " +v6,v6, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl6+("col2_" +k+ "†")+sp6;  count++; }
 else                       { Col[k] = v6; sobCol[v6]=true;  s=sl6+("col2_" +k+ "†")+sp6} }
xCol[k] = v6; k++; }

       while (s.search(re20)!=-1) {
    var v2  = s.replace(re20, re21);
    var sl2   = s.replace(re20, re22);
    var sp2   = s.replace(re20, re23);

  if (sobCol[v2]==true)  {
        if (k<10)   { Col[k] = v2;    s=sl1+("col1_" +k+ "†")+sp2; } 
        if (k>10)   { Col[k] = v2;    s=sl1+("col2_" +k+ "†")+sp2; }
	xCol[k] = v2; k++; }
  else { JustBacklighting(v2, sl2); }

 var r=Object();                                                 
 if (k<10 && sobCol[v2]==null) {
 if (InputBox(" :: Подозрительные символы ::\nВведите свой вариант:        " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl2+("col1_" +k+ "†")+sp2; count++; }
 else                       { Col[k] = v2; sobCol[v2]=true;  s=sl2+("col1_" +k+ "†")+sp2; } }
 if (k>=10 && sobCol[v2]==null) {
 if (InputBox(" :: Подозрительные символы ::\nВведите свой вариант:        " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl2+("col2_" +k+ "†")+sp2; count++; }
 else                       { Col[k] = v2; sobCol[v2]=true;  s=sl2+("col2_" +k+ "†")+sp2; } }
xCol[k] = v2; k++; }

       while (s.search(re30)!=-1) {
    var v3  = s.replace(re30, re31);
    var sl3   = s.replace(re30, re32);
    var sp3   = s.replace(re30, re33);
    var vv3  = s.replace(re30, re34);

  if (sobCol[v3]==true)  {
        if (k<10)   { Col[k] = v3;    s=sl3+("col1_" +k+ "†")+sp3; } 
        if (k>10)   { Col[k] = v3;    s=sl3+("col2_" +k+ "†")+sp3; }
	xCol[k] = v3; k++; }
  else { JustBacklighting(v3, sl3); }

 var r=Object();                                                 
 if (k<10 && sobCol[v3]==null) {
 if (InputBox(" :: Подозрительные символы ::\nВведите свой вариант:        " +v3,vv3, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl3+("col1_" +k+ "†")+sp3; count++; }
 else                       { Col[k] = v3; sobCol[v3]=true;  s=sl3+("col1_" +k+ "†")+sp3; } }
 if (k>=10 && sobCol[v3]==null) {
 if (InputBox(" :: Подозрительные символы ::\nВведите свой вариант:        " +v3,vv3, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl3+("col2_" +k+ "†")+sp3; count++; }
 else                       { Col[k] = v3; sobCol[v3]=true;  s=sl3+("col2_" +k+ "†")+sp3; } }
xCol[k] = v3; k++; }

       while (s.search(re40)!=-1) {
    var v4  = s.replace(re40, re41);
    var sl4   = s.replace(re40, re42);
    var sp4   = s.replace(re40, re43);

  if (sobCol[v4]==true)  {
        if (k<10)   { Col[k] = v4;    s=sl4+("col1_" +k+ "†")+sp4; } 
        if (k>10)   { Col[k] = v4;    s=sl4+("col2_" +k+ "†")+sp4; }
	xCol[k] = v4; k++; }
  else { JustBacklighting(v4, sl4); }

 var r=Object();                                                 
 if (k<10 && sobCol[v4]==null) {
 if (InputBox(" :: Подозрительные символы ::\nВведите свой вариант:        " +v4,v4, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl4+("col1_" +k+ "†")+sp4; count++; }
 else                       { Col[k] = v4; sobCol[v4]=true;  s=sl4+("col1_" +k+ "†")+sp4; } }
 if (k>=10 && sobCol[v4]==null) {
 if (InputBox(" :: Подозрительные символы ::\nВведите свой вариант:        " +v4,v4, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl4+("col2_" +k+ "†")+sp4; count++; }
 else                       { Col[k] = v4; sobCol[v4]=true;  s=sl4+("col2_" +k+ "†")+sp4; } }
xCol[k] = v4; k++; }

       while (s.search(re50)!=-1) {
    var v5  = s.replace(re50, re51);
    var sl5   = s.replace(re50, re52);
    var sp5   = s.replace(re50, re53);

  if (sobCol[v5]==true)  {
        if (k<10)   { Col[k] = v5;    s=sl5+("col1_" +k+ "†")+sp5; } 
        if (k>10)   { Col[k] = v5;    s=sl5+("col2_" +k+ "†")+sp5; }
	xCol[k] = v5; k++; }
  else { JustBacklighting(v5, sl5); }

 var r=Object();                                                 
 if (k<10 && sobCol[v5]==null) {
 if (InputBox(" :: Подозрительные символы ::\nВведите свой вариант:        " +v5,v5, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl5+("col1_" +k+ "†")+sp5; count++; }
 else                       { Col[k] = v5; sobCol[v5]=true;  s=sl5+("col1_" +k+ "†")+sp5; } }
 if (k>=10 && sobCol[v5]==null) {
 if (InputBox(" :: Подозрительные символы ::\nВведите свой вариант:        " +v5,v5, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl5+("col2_" +k+ "†")+sp5; count++; }
 else                       { Col[k] = v5; sobCol[v5]=true;  s=sl5+("col2_" +k+ "†")+sp5; } }
xCol[k] = v5; k++; }

       while (s.search(re70)!=-1) {
    var v7  = s.replace(re70, re71);
    var sl7   = s.replace(re70, re72);
    var sp7   = s.replace(re70, re73);

  if (sobCol[v7]==true)  {
        if (k<10)   { Col[k] = v7;    s=sl7+("col1_" +k+ "†")+sp7; } 
        if (k>10)   { Col[k] = v7;    s=sl7+("col2_" +k+ "†")+sp7; }
	xCol[k] = v7; k++; }
  else { JustBacklighting(v7, sl7); }

 var r=Object();                                                 
 if (k<10 && sobCol[v7]==null) {
 if (InputBox(" :: Цифры 1 ::\nВведите свой вариант:        " +v7,v7, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl7+("col1_" +k+ "†")+sp7;  count++; }
 else                       { Col[k] = v7; sobCol[v7]=true;  s=sl7+("col1_" +k+ "†")+sp7} }
 if (k>=10 && sobCol[v7]==null) {
 if (InputBox(" :: Цифры 1 ::\nВведите свой вариант:        " +v7,v7, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl7+("col2_" +k+ "†")+sp7;  count++; }
 else                       { Col[k] = v7; sobCol[v7]=true;  s=sl7+("col2_" +k+ "†")+sp7} }
xCol[k] = v7; k++; }

       while (s.search(re_70)!=-1) {
    var v_7  = s.replace(re_70, re_71);
    var sl_7   = s.replace(re_70, re_72);
    var sp_7   = s.replace(re_70, re_73);
    var vv_7  = s.replace(re_70, re_74);

  if (sobCol[v_7]==true)  {
        if (k<10)   { Col[k] = v_7;    s=sl_7+("col1_" +k+ "†")+sp_7; } 
        if (k>10)   { Col[k] = v_7;    s=sl_7+("col2_" +k+ "†")+sp_7; }
	xCol[k] = v_7; k++; }
 else { JustBacklighting(v_7, sl_7); }

 var r=Object();                                                 
 if (k<10 && sobCol[v_7]==null) {
 if (InputBox(" :: Цифры 2 ::\nВведите свой вариант:        " +v_7,vv_7, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl_7+("col1_" +k+ "†")+sp_7;  count++; }
 else                       { Col[k] = v_7; sobCol[v_7]=true;  s=sl_7+("col1_" +k+ "†")+sp_7} }
 if (k>=10 && sobCol[v_7]==null) {
 if (InputBox(" :: Цифры 2 ::\nВведите свой вариант:        " +v_7,vv_7, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl_7+("col2_" +k+ "†")+sp_7;  count++; }
 else                       { Col[k] = v_7; sobCol[v_7]=true;  s=sl_7+("col2_" +k+ "†")+sp_7} }
xCol[k] = v_7; k++; }

       while (s.search(re80)!=-1) {
    var v8  = s.replace(re80, re81);
    var sl8   = s.replace(re80, re82);
    var sp8   = s.replace(re80, re83);

  if (sobCol[v8]==true)  {
        if (k<10)   { Col[k] = v8;    s=sl8+("col1_" +k+ "†")+sp8; } 
        if (k>10)   { Col[k] = v8;    s=sl8+("col2_" +k+ "†")+sp8; }
	xCol[k] = v8; k++; }
  else { JustBacklighting(v8, sl8); }

 var r=Object();                                                 
 if (k<10 && sobCol[v8]==null) {
 if (InputBox(" :: Кавычки ::\nВведите свой вариант:        " +v8,v8, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl8+("col1_" +k+ "†")+sp8;  count++; }
 else                       { Col[k] = v8; sobCol[v8]=true;  s=sl8+("col1_" +k+ "†")+sp8} }
 if (k>=10 && sobCol[v8]==null) {
 if (InputBox(" :: Кавычки ::\nВведите свой вариант:        " +v8,v8, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl8+("col2_" +k+ "†")+sp8;  count++; }
 else                       { Col[k] = v8; sobCol[v8]=true;  s=sl8+("col2_" +k+ "†")+sp8} }
xCol[k] = v8; k++; }

       while (s.search(re90)!=-1) {
    var v9  = s.replace(re90, re91);
    var sl9   = s.replace(re90, re92);
    var sp9   = s.replace(re90, re93);

  if (sobCol[v9]==true)  {
        if (k<10)   { Col[k] = v9;    s=sl9+("col1_" +k+ "†")+sp9; } 
        if (k>10)   { Col[k] = v9;    s=sl9+("col2_" +k+ "†")+sp9; }
	xCol[k] = v9; k++; }
  else { JustBacklighting(v9, sl9); }

 var r=Object();                                                 
 if (k<10 && sobCol[v9]==null) {
 if (InputBox(" :: Дефис ::\nВведите свой вариант:        " +v9,v9, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl9+("col1_" +k+ "†")+sp9;  count++; }
 else                       { Col[k] = v9; sobCol[v9]=true;  s=sl9+("col1_" +k+ "†")+sp9} }
 if (k>=10 && sobCol[v9]==null) {
 if (InputBox(" :: Дефис ::\nВведите свой вариант:        " +v9,v9, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl9+("col2_" +k+ "†")+sp9;  count++; }
 else                       { Col[k] = v9; sobCol[v9]=true;  s=sl9+("col2_" +k+ "†")+sp9} }
xCol[k] = v9; k++; }

       while (s.search(re100)!=-1) {
    var v10  = s.replace(re100, re101);
    var sl10   = s.replace(re100, re102);
    var sp10   = s.replace(re100, re103);
    var vv10  = s.replace(re100, re104)
    var def  = s.replace(re100, re10d);

  if (sobCol[v10]==true || Coldef[def]==true)  {
        if (k<10)   { Col[k] = v10;    s=sl10+("col1_" +k+ "†")+sp10; } 
        if (k>10)   { Col[k] = v10;    s=sl10+("col2_" +k+ "†")+sp10; }
	xCol[k] = v10; k++; }
  else { JustBacklighting(v10, sl10); }

 var r=Object();                                                 
 if (k<10 && sobCol[v10]==null && Coldef[def]==null) {
 if (InputBox(" :: Дефис до пробела ::\nВведите свой вариант:        " +v10,vv10, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl10+("col1_" +k+ "†")+sp10;  count++; }
 else                       { Col[k] = v10; sobCol[v10]=true;  s=sl10+("col1_" +k+ "†")+sp10} }
 if (k>=10 && sobCol[v10]==null && Coldef[def]==null) {
 if (InputBox(" :: Дефис до пробела ::\nВведите свой вариант:        " +v10,vv10, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl10+("col2_" +k+ "†")+sp10;  count++; }
 else                       { Col[k] = v10; sobCol[v10]=true;  s=sl10+("col2_" +k+ "†")+sp10} }
xCol[k] = v10; k++; }

       while (s.search(re110)!=-1) {
    var v11  = s.replace(re110, re111);
    var sl11   = s.replace(re110, re112);
    var sp11   = s.replace(re110, re113);

  if (sobCol[v11]==true)  {
        if (k<10)   { Col[k] = v11;    s=sl11+("col1_" +k+ "†")+sp11; } 
        if (k>10)   { Col[k] = v11;    s=sl11+("col2_" +k+ "†")+sp11; }
	xCol[k] = v11; k++; }
  else { JustBacklighting(v11, sl11); }

 var r=Object();                                                 
 if (k<10 && sobCol[v11]==null) {
 if (InputBox(" :: Дефис после пробела ::\nВведите свой вариант:        " +v11,v11, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl11+("col1_" +k+ "†")+sp11;  count++; }
 else                       { Col[k] = v11; sobCol[v11]=true;  s=sl11+("col1_" +k+ "†")+sp11} }
 if (k>=10 && sobCol[v11]==null) {
 if (InputBox(" :: Дефис после пробела ::\nВведите свой вариант:        " +v11,v11, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl11+("col2_" +k+ "†")+sp11;  count++; }
 else                       { Col[k] = v11; sobCol[v11]=true;  s=sl11+("col2_" +k+ "†")+sp11} }
xCol[k] = v11; k++; }

if (Apostrophe)
              { 
       while (s.search(re120)!=-1) {
    var v12  = s.replace(re120, re121);
    var sl12   = s.replace(re120, re122);
    var sp12   = s.replace(re120, re123);
    var vv12  = s.replace(re120, re124);

  if (sobCol[v12]==true)  {
        if (k<10)   { Col[k] = v12;    s=sl12+("col1_" +k+ "†")+sp12; } 
        if (k>10)   { Col[k] = v12;    s=sl12+("col2_" +k+ "†")+sp12; }
	xCol[k] = v12; k++; }
  else { JustBacklighting(v12, sl12); }

 var r=Object();                                                 
 if (k<10 && sobCol[v12]==null) {
 if (InputBox(" :: Апостроф' ::\nВведите свой вариант:        " +v12,vv12, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl12+("col1_" +k+ "†")+sp12;  count++; }
 else                       { Col[k] = v12; sobCol[v12]=true;  s=sl12+("col1_" +k+ "†")+sp12} }
 if (k>=10 && sobCol[v12]==null) {
 if (InputBox(" :: Апостроф' ::\nВведите свой вариант:        " +v12,vv12, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl12+("col2_" +k+ "†")+sp12;  count++; }
 else                       { Col[k] = v12; sobCol[v12]=true;  s=sl12+("col2_" +k+ "†")+sp12} }
xCol[k] = v12; k++; }
              }

if (Slash)
         { 
       while (s.search(re120a)!=-1) {
    var v12a  = s.replace(re120a, re121a);
    var sl12a   = s.replace(re120a, re122a);
    var sp12a   = s.replace(re120a, re123a);
    var vv12a  = s.replace(re120a, re124a);

  if (sobCol[v12a]==true)  {
        if (k<10)   { Col[k] = v12a;    s=sl12a+("col1_" +k+ "†")+sp12a;  } 
        if (k>10)   { Col[k] = v12a;    s=sl12a+("col2_" +k+ "†")+sp12a;  }
	xCol[k] = v12a; k++; }
  else { JustBacklighting(v12a, sl12a); }

 var r=Object();                                                 
 if (k<10 && sobCol[v12a]==null) {
 if (InputBox(" :: Сл/эш ::\nВведите свой вариант:        " +v12a,vv12a, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl12a+("col1_" +k+ "†")+sp12a;  count++; }
 else                       { Col[k] = v12a; sobCol[v12a]=true;  s=sl12a+("col1_" +k+ "†")+sp12a}  }
 if (k>=10 && sobCol[v12a]==null) {
 if (InputBox(" :: Сл/эш ::\nВведите свой вариант:        " +v12a,vv12a, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl12a+("col2_" +k+ "†")+sp12a;  count++; }
 else                       { Col[k] = v12a; sobCol[v12a]=true;  s=sl12a+("col2_" +k+ "†")+sp12a}  }
xCol[k] = v12a; k++; }
         }

if (Apostrophe)
              { 
       while (s.search(re120b)!=-1) {
    var v12b   = s.replace(re120b, re121b);
    var sl12b  = s.replace(re120b, re122b);
    var sp12b  = s.replace(re120b, re123b);
    var vv12b  = s.replace(re120b, re124b);

  if (sobCol[v12b]==true)  {
        if (k<10)   { Col[k] = v12b;    s=sl12b+("col1_" +k+ "†")+sp12b; } 
        if (k>10)   { Col[k] = v12b;    s=sl12b+("col2_" +k+ "†")+sp12b; }
	xCol[k] = v12b; k++; }
  else { JustBacklighting(v12b, sl12b); }

 var r=Object();                                                 
 if (k<10 && sobCol[v12b]==null) {
 if (InputBox(" :: Апостроф 'вначале строчных ::\nВведите свой вариант:        " +v12b,vv12b, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl12b+("col1_" +k+ "†")+sp12b;  count++; }
 else                       { Col[k] = v12b; sobCol[v12b]=true;  s=sl12b+("col1_" +k+ "†")+sp12b} }
 if (k>=10 && sobCol[v12b]==null) {
 if (InputBox(" :: Апостроф 'вначале строчных ::\nВведите свой вариант:        " +v12b,vv12b, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl12b+("col2_" +k+ "†")+sp12b;  count++; }
 else                       { Col[k] = v12b; sobCol[v12b]=true;  s=sl12b+("col2_" +k+ "†")+sp12b} }
xCol[k] = v12b; k++; }
              }

       while (s.search(re130)!=-1) {
    var v13  = s.replace(re130, re131);
    var sl13   = s.replace(re130, re132);
    var sp13   = s.replace(re130, re133);
    var vv13  = s.replace(re130, re134);

  if (sobCol[v13]==true)  {
        if (k<10)   { Col[k] = v13;    s=sl13+("col1_" +k+ "†")+sp13;  } 
        if (k>10)   { Col[k] = v13;    s=sl13+("col2_" +k+ "†")+sp13;  }
	xCol[k] = v13; k++; }
  else { JustBacklighting(v13, sl13); }

 var r=Object();                                                 
 if (k<10 && sobCol[v13]==null) {
 if (InputBox(" :: Мусор ::\nВведите свой вариант:        " +v13,vv13, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl13+("col1_" +k+ "†")+sp13;  count++; }
 else                       { Col[k] = v13; sobCol[v13]=true;  s=sl13+("col1_" +k+ "†")+sp13}  }
 if (k>=10 && sobCol[v13]==null) {
 if (InputBox(" :: Мусор ::\nВведите свой вариант:        " +v13,vv13, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl13+("col2_" +k+ "†")+sp13;  count++; }
 else                       { Col[k] = v13; sobCol[v13]=true;  s=sl13+("col2_" +k+ "†")+sp13}  }
xCol[k] = v13; k++; }

       while (s.search(re140)!=-1) {
    var v14  = s.replace(re140, re141);
    var sl14   = s.replace(re140, re142);
    var sp14   = s.replace(re140, re143);
    var vv14  = s.replace(re140, re144);

  if (sobCol[v14]==true)  {
        if (k<10)   { Col[k] = v14;    s=sl14+("col1_" +k+ "†")+sp14;  } 
        if (k>10)   { Col[k] = v14;    s=sl14+("col2_" +k+ "†")+sp14;  }
	xCol[k] = v14; k++; }
  else { JustBacklighting(v14, sl14); }

 var r=Object();                                                 
 if (k<10 && sobCol[v14]==null) {
 if (InputBox(" :: Скобка ::\nВведите свой вариант:        " +v14,vv14, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl14+("col1_" +k+ "†")+sp14;  count++; }
 else                       { Col[k] = v14; sobCol[v14]=true;  s=sl14+("col1_" +k+ "†")+sp14}  }
 if (k>=10 && sobCol[v14]==null) {
 if (InputBox(" :: Скобка ::\nВведите свой вариант:        " +v14,vv14, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl14+("col2_" +k+ "†")+sp14;  count++; }
 else                       { Col[k] = v14; sobCol[v14]=true;  s=sl14+("col2_" +k+ "†")+sp14}  }
xCol[k] = v14; k++; }

       while (s.search(re150)!=-1) {
    var v15  = s.replace(re150, re151);
    var sl15   = s.replace(re150, re152);
    var sp15   = s.replace(re150, re153);

  if (sobCol[v15]==true)  {
        if (k<10)   { Col[k] = v15;    s=sl15+("col1_" +k+ "†")+sp15;  } 
        if (k>10)   { Col[k] = v15;    s=sl15+("col2_" +k+ "†")+sp15;  }
	xCol[k] = v15; k++; }
  else { JustBacklighting(v15, sl15); }

 var r=Object();                                                 
 if (k<10 && sobCol[v15]==null) {
 if (InputBox(" :: Союз ::\nВведите свой вариант:        " +v15,v15, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl15+("col1_" +k+ "†")+sp15;  count++; }
 else                       { Col[k] = v15; sobCol[v15]=true;  s=sl15+("col1_" +k+ "†")+sp15}  }
 if (k>=10 && sobCol[v15]==null) {
 if (InputBox(" :: Союз ::\nВведите свой вариант:        " +v15,v15, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl15+("col2_" +k+ "†")+sp15;  count++; }
 else                       { Col[k] = v15; sobCol[v15]=true;  s=sl15+("col2_" +k+ "†")+sp15}  }
xCol[k] = v15; k++; }

       while (s.search(re160)!=-1) {
    var v16  = s.replace(re160, re161);
    var sl16   = s.replace(re160, re162);
    var sp16   = s.replace(re160, re163);
    var vv16  = s.replace(re160, re164);

  if (sobCol[v16]==true)  {
        if (k<10)   { Col[k] = v16;    s=sl16+("col1_" +k+ "†")+sp16;  } 
        if (k>10)   { Col[k] = v16;    s=sl16+("col2_" +k+ "†")+sp16;  }
	xCol[k] = v16; k++; }
  else { JustBacklighting(v16, sl16); }

 var r=Object();                                                 
 if (k<10 && sobCol[v16]==null) {
 if (InputBox(" :: Тире – 1 ::\nВведите свой вариант:        " +v16,vv16, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl16+("col1_" +k+ "†")+sp16;  count++; }
 else                       { Col[k] = v16; sobCol[v16]=true;  s=sl16+("col1_" +k+ "†")+sp16}  }
 if (k>=10 && sobCol[v16]==null) {
 if (InputBox(" :: Тире – 1 ::\nВведите свой вариант:        " +v16,vv16, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl16+("col2_" +k+ "†")+sp16;  count++; }
 else                       { Col[k] = v16; sobCol[v16]=true;  s=sl16+("col2_" +k+ "†")+sp16}  }
xCol[k] = v16; k++; }

       while (s.search(re170)!=-1) {
    var v17  = s.replace(re170, re171);
    var sl17   = s.replace(re170, re172);
    var sp17   = s.replace(re170, re173);
    var vv17  = s.replace(re170, re174);

  if (sobCol[v17]==true)  {
        if (k<10)   { Col[k] = v17;    s=sl17+("col1_" +k+ "†")+sp17;  } 
        if (k>10)   { Col[k] = v17;    s=sl17+("col2_" +k+ "†")+sp17;  }
	xCol[k] = v17; k++; }
  else { JustBacklighting(v17, sl17); }

 var r=Object();                                                 
 if (k<10 && sobCol[v17]==null) {
 if (InputBox(" :: Тире – 1 ::\nВведите свой вариант:        " +v17,vv17, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl17+("col1_" +k+ "†")+sp17;  count++; }
 else                       { Col[k] = v17; sobCol[v17]=true;  s=sl17+("col1_" +k+ "†")+sp17}  }
 if (k>=10 && sobCol[v17]==null) {
 if (InputBox(" :: Тире – 1 ::\nВведите свой вариант:        " +v17,vv17, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl17+("col2_" +k+ "†")+sp17;  count++; }
 else                       { Col[k] = v17; sobCol[v17]=true;  s=sl17+("col2_" +k+ "†")+sp17}  }
xCol[k] = v17; k++; }

       while (s.search(re180)!=-1) {
    var v18  = s.replace(re180, re181);
    var sl18   = s.replace(re180, re182);
    var sp18   = s.replace(re180, re183);
    var vv18  = s.replace(re180, re184);

  if (sobCol[v18]==true)  {
        if (k<10)   { Col[k] = v18;    s=sl18+("col1_" +k+ "†")+sp18;  } 
        if (k>10)   { Col[k] = v18;    s=sl18+("col2_" +k+ "†")+sp18;  }
	xCol[k] = v18; k++; }
  else { JustBacklighting(v18, sl18); }

 var r=Object();                                                 
 if (k<10 && sobCol[v18]==null) {
 if (InputBox(" :: Мусор-2 ::\nВведите свой вариант:        " +v18,vv18, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl18+("col1_" +k+ "†")+sp18;  count++; }
 else                       { Col[k] = v18; sobCol[v18]=true;  s=sl18+("col1_" +k+ "†")+sp18}  }
 if (k>=10 && sobCol[v18]==null) {
 if (InputBox(" :: Мусор-2 ::\nВведите свой вариант:        " +v18,vv18, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl18+("col2_" +k+ "†")+sp18;  count++; }
 else                       { Col[k] = v18; sobCol[v18]=true;  s=sl18+("col2_" +k+ "†")+sp18}  }
xCol[k] = v18; k++; }

       while (s.search(re190)!=-1) {
    var v19  = s.replace(re190, re191);
    var sl19 = s.replace(re190, re192);
    var sp19 = s.replace(re190, re193);
    var vv19 = s.replace(re190, re194);

 JustBacklighting(v19, sl19);

	 var r=Object();                                                 
 if (k<10) {
 if (InputBox(" :: Вкрапления ::\nВведите свой вариант:        " +v19,vv19, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl19+("col1_" +k+ "†")+sp19;  count++; }
 else                       { Col[k] = v19;  s=sl19+("col1_" +k+ "†")+sp19} }
 if (k>=10) {
 if (InputBox(" :: Вкрапления ::\nВведите свой вариант:        " +v19,vv19, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl19+("col2_" +k+ "†")+sp19;  count++; }
 else                       { Col[k] = v19;  s=sl19+("col2_" +k+ "†")+sp19} }
xCol[k] = v19; k++; }
				}


if ( s.search(re_fin1)!=-1 || s.search(re_fin2)!=-1) {                                                 // Восстановление временных замен
for (z=0;z<k;z++)  {
                     if (z<10)     { var re200 = new RegExp("col1_("+z+")†","g");
                                        var re201 = Col[z];
                                           s=s.replace(re200,re201); }
                  if (z>=10)      {var re210 = new RegExp("col2_("+z+")†","g");
                                        var re211 = Col[z];
                                           s=s.replace(re210,re211); }            } k=0; }

   ptr.innerHTML=s;
   return true;                   
  } 

    window.external.BeginUndoUnit(document,"«Слипшиеся слова»");                               // ОТКАТ (UNDO) начало

 var body=document.getElementById("fbw_body");
 var ptr=body;
 var ProcessingEnding=false;

// сканирование начинается с "курсорного" абзаца
 var tr=document.selection.createRange();
 if (!tr) { alert("Отсутствие присутствия текста для проверки!"); return;}
 tr.collapse();
 var ptr=tr.parentElement();
 if (!body.contains(ptr)) { alert("Спозиционируйте курсор что ли!"); return;}
 var ptr2=ptr;
 while (ptr2 && ptr2.nodeName!="BODY" && ptr2.nodeName!="P")
  ptr2=ptr2.parentNode;
 if (ptr2 && ptr2.nodeName=="P") ptr=ptr2;

 while (!ProcessingEnding && ptr) {
  SaveNext=ptr;
  if (SaveNext.firstChild!=null && SaveNext.nodeName!="P" && 
      !(SaveNext.nodeName=="DIV" && 
        ((SaveNext.className=="history" && !ObrabotkaHistory) || 
         (SaveNext.className=="annotation" && !ObrabotkaAnnotation))))
  {    SaveNext=SaveNext.firstChild; }                                                         // либо углубляемся...

  else {
    while (SaveNext && SaveNext!=body && SaveNext.nextSibling==null)  {
     SaveNext=SaveNext.parentNode;                                                           // ...либо поднимаемся (если уже сходили вглубь)
                                                                                                                // поднявшись до элемента P, не забудем поменять флаг
     if (SaveNext==body) {ProcessingEnding=true;}
                                                         }
   if (SaveNext && SaveNext!=body) SaveNext=SaveNext.nextSibling; //и переходим на соседний элемент
         }
  if (ptr.nodeName=="P") 
   if (HandleP(ptr)=="exit") break;
  ptr=SaveNext;
 }

    window.external.EndUndoUnit(document);                               // Undo конец

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