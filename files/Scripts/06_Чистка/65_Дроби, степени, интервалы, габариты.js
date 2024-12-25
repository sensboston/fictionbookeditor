//=========================================
//     «Дроби, степени, интервалы, габариты» v.2.2 (декабрь 2024)
//     Единицы площади и объема, габариты, дроби в виде чисел через слэш.
//     За основу взят скрипт «10.000.000.000.js»
//     Автор скрипта - jurgennt.
//                                                           Engine by ©Sclex
//                                                                           02.05.2008
//~~~~~~~~~~~~~~~~~~~
// v.1.1 — исправлена ошибка при наличии более десятка исправлений в одном параграфе
//~~~~~~~~~~~~~~~~~~~
// v.1.2 — удаление пробела в четырёхзначных числах
//~~~~~~~~~~~~~~~~~~~
// v.1.3 — только точки и пробелы, но не запятые
//~~~~~~~~~~~~~~~~~~~
// v.1.4 — дефис между цифрами
//~~~~~~~~~~~~~~~~~~~
// v.1.5 — уточнена обработка дефисных номеров: 123-234-345
//~~~~~~~~~~~~~~~~~~~
// v.1.6 — тире, пробел между цифрами
//~~~~~~~~~~~~~~~~~~~
// v.1.7 — переход на следующий абзац — "ready for FBE"
//~~~~~~~~~~~~~~~~~~~
// v.1.8 — кастомизированные неразрывные пробелы — Sclex (20.03.2010)
//=========================================
// v.1.9 — прерывание процесса 
//======================================
// v.2.0 — проверка от курсора — sclex, май 2010
//======================================
// v.2.1 — доработка движка под прерывание и выход — sclex, май 2010
//======================================
// v.2.12 — доработка подсветки для найденных рез-тов поиска — Alex2L, июнь 2012
//======================================

//------------------------------------------------------------------------------------
//     Часть регекспов - stokber.
//     Идеи регекспов - TaKir.
//     Советы по улучшению и исправлению функционала регекспов - Sclex
//------------------------------------------------------------------------------------------------------

var VersionNumber="2.2";

//обрабатывать ли history
var ObrabotkaHistory=false;
//обрабатывать ли annotation
var ObrabotkaAnnotation=true;

function Run() {

          Col = new Object();                        // коллекции проверенных словосочетаний
           var k = 0;

         xCol = new Object();                        // коллекции оригинальных словосочетаний

  var count=0;
  var Ts=new Date().getTime();
  var TimeStr=0;

try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

 // меры площади и объёма:
 var re50 = new RegExp("^(.*?(?:"+nbspEntity+"| ))??([ксм]?м)([23])(.*?){0,1}$","gi");
 var re51 = "$2$3";                              // прежний вариант
 var re52 = "$1";                                                                      // с начала абзаца до искомого места
 var re53 = "$4";                                                                    // до конца параграфа
 var re54 = "$2<sup>$3</sup>";                                            // предлагаемый вариант в запросе

  // габариты-объём:
 var re40a = new RegExp("^(.*?)??(\\\d+)((?:"+nbspEntity+"| ){0,1}[xх](?:"+nbspEntity+"| ){0,1})(\\\d+)((?:"+nbspEntity+"| ){0,1}[xх](?:"+nbspEntity+"| ){0,1})(\\\d+)(?![^<>]*>)([^\\\d].*?){0,1}$","gi");
 var re41a = "$2$3$4$5$6";
 var re42a = "$1";
 var re43a = "$7";
 var re44a = "$2×$4×$6";
 
 // габариты-площадь:
 var re40 = new RegExp("^(.*?[^\\\d])??(\\\d+)((?:"+nbspEntity+"| ){0,1}[xх](?:"+nbspEntity+"| ){0,1})(\\\d+)(?![^<>]*>)([^\\\d].*?){0,1}$","gi");
 var re41 = "$2$3$4";
 var re42 = "$1";
 var re43 = "$5";
 var re44 = "$2×$4";

 // дроби на символы дробей:
 var re30 = new RegExp("^(.*?[^\\\d])??(1/4)(?![^<>]*>)([^\\\d].*?){0,1}$","gi");
 var re31 = "$2";
 var re32 = "$1";
 var re33 = "$3";
 var re34 = "¼";

 var re30a = new RegExp("^(.*?[^\\\d])??(1/2)(?![^<>]*>)([^\\\d].*?){0,1}$","gi");
 var re31a = "$2";
 var re32a = "$1";
 var re33a = "$3";
 var re34a = "½";

 var re30b = new RegExp("^(.*?[^\\\d])??(3/4)(?![^<>]*>)([^\\\d].*?){0,1}$","gi");
 var re31b = "$2";
 var re32b = "$1";
 var re33b = "$3";
 var re34b = "¾";

 var re30c = new RegExp("^(.*?[^\\\d])??(1/3)(?![^<>]*>)([^\\\d].*?){0,1}$","gi");
 var re31c = "$2";
 var re32c = "$1";
 var re33c = "$3";
 var re34c = "⅓";
 
 var re30d = new RegExp("^(.*?[^\\\d])??(2/3)(?![^<>]*>)([^\\\d].*?){0,1}$","gi");
 var re31d = "$2";
 var re32d = "$1";
 var re33d = "$3";
 var re34d = "⅔";

 var re30e = new RegExp("^(.*?[^\\\d])??(1/5)(?![^<>]*>)([^\\\d].*?){0,1}$","gi");
 var re31e = "$2";
 var re32e = "$1";
 var re33e = "$3";
 var re34e = "⅕";

 var re30f = new RegExp("^(.*?[^\\\d])??(2/5)(?![^<>]*>)([^\\\d].*?){0,1}$","gi");
 var re31f = "$2";
 var re32f = "$1";
 var re33f = "$3";
 var re34f = "⅖";

 var re30g = new RegExp("^(.*?[^\\\d])??(3/5)(?![^<>]*>)([^\\\d].*?){0,1}$","gi");
 var re31g = "$2";
 var re32g = "$1";
 var re33g = "$3";
 var re34g = "⅗";

 var re30h = new RegExp("^(.*?[^\\\d])??(4/5)(?![^<>]*>)([^\\\d].*?){0,1}$","gi");
 var re31h = "$2";
 var re32h = "$1";
 var re33h = "$3";
 var re34h = "⅘";
 
  var re30i = new RegExp("^(.*?[^\\\d])??(1/6)(?![^<>]*>)([^\\\d].*?){0,1}$","gi");
 var re31i = "$2";
 var re32i = "$1";
 var re33i = "$3";
 var re34i = "⅙";

 var re30j = new RegExp("^(.*?[^\\\d])??(5/6)(?![^<>]*>)([^\\\d].*?){0,1}$","gi");
 var re31j = "$2";
 var re32j = "$1";
 var re33j = "$3";
 var re34j = "⅚";

 var re30k = new RegExp("^(.*?[^\\\d])??(1/8)(?![^<>]*>)([^\\\d].*?){0,1}$","gi");
 var re31k = "$2";
 var re32k = "$1";
 var re33k = "$3";
 var re34k = "⅛";

  var re30l = new RegExp("^(.*?[^\\\d])??(3/8)(?![^<>]*>)([^\\\d].*?){0,1}$","gi");
 var re31l = "$2";
 var re32l = "$1";
 var re33l = "$3";
 var re34l = "⅜";

 var re30m = new RegExp("^(.*?[^\\\d])??(5/8)(?![^<>]*>)([^\\\d].*?){0,1}$","gi");
 var re31m = "$2";
 var re32m = "$1";
 var re33m = "$3";
 var re34m = "⅝";
 
 var re30n = new RegExp("^(.*?[^\\\d])??(7/8)(?![^<>]*>)([^\\\d].*?){0,1}$","gi");
 var re31n = "$2";
 var re32n = "$1";
 var re33n = "$3";
 var re34n = "⅞";
 
 // поправил, так как не учитывались пробелы окружающие дефис:
 var re70 = new RegExp("^(.*?)??(\\\d+)((?:"+nbspEntity+"| )?-(?:"+nbspEntity+"| )?)(\\\d+)(?![^<>]*>)(.*?){0,1}$","gi");
 var re71 = "$2$3$4";
 var re72 = "$1";
 var re73 = "$5";
 var re74 = "$2–$4";

 var re80 = new RegExp("^(.*?)??(\\\d+)((?:"+nbspEntity+"| )?—(?:"+nbspEntity+"| )?)(\\\d+)(?![^<>]*>)(.*?){0,1}$","gi");
 var re81 = "$2$3$4";
 var re82 = "$1";
 var re83 = "$5";
 var re84 = "$2–$4";

 var re90 = new RegExp("^(.*?)??(\\\d+)((?:"+nbspEntity+"| )–|–(?:"+nbspEntity+"| )|(?:"+nbspEntity+"| )–(?:"+nbspEntity+"| ))(\\\d+)(?![^<>]*>)(.*?){0,1}$","gi");
 var re91 = "$2$3$4";
 var re92 = "$1";
 var re93 = "$5";
 var re94 = "$2–$4";
 
 var stepen = "<sup>\\\-?\\\d+</sup>";

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------
 // вариант с выделением в подсветке всех\й строк\и(?) в интервалах чисел со степенями, если в строке их несколько:
 
/*  var re70s = new RegExp("^(.*?[^\\\d]){0,1}(\\\d+)("+stepen+")((?:"+nbspEntity+"| )?-(?:"+nbspEntity+"| )?)(\\\d+)([^\\\d].*?){0,1}$","gi");
 var re71s = "$3$4$5";
 var re72s = "$1$2";
 var re73s = "$6";
 var re74s = "$3–$5"; 
 
 var re80s = new RegExp("^(.*?[^\\\d]){0,1}(\\\d+"+stepen+")((?:"+nbspEntity+"| )?—(?:"+nbspEntity+"| )?)(\\\d+)([^\\\d].*?){0,1}$","gi");
 var re81s = "$2$3$4";
 var re82s = "$1";
 var re83s = "$5";
 var re84s = "$2–$4";
 
 var re90s = new RegExp("^(.*?[^\\\d]){0,1}(\\\d+" +stepen+ ")((?:"+nbspEntity+"| )–|–(?:"+nbspEntity+"| )|(?:"+nbspEntity+"| )–(?:"+nbspEntity+"| ))(\\\d+)([^\\\d].*?){0,1}$","gi");
 var re91s = "$2$3$4";
 var re92s = "$1";
 var re93s = "$5";
 var re94s = "$2–$4"; */
 // ================================================================================
 //-----------------------------------------------------------------------------------------------------------------------------------------------------------------
 // вариант выделения в подсветке только одного тире-дефиса вместе с пробелами в интервалах чисел со степенями:
 
 var re70s = new RegExp("^(.*?[^\\\d])??(\\\d+)("+stepen+")((?:"+nbspEntity+"| )?-(?:"+nbspEntity+"| )?)(\\\d+)([^\\\d].*?){0,1}$","gi");
 var re71s = "$4";
 var re72s = "$1$2$3";
 var re73s = "$5$6";
 var re74s = "–";

 var re80s = new RegExp("^(.*?[^\\\d])??(\\\d+)("+stepen+")((?:"+nbspEntity+"| )?—(?:"+nbspEntity+"| )?)(\\\d+)([^\\\d].*?){0,1}$","gi");
 var re81s = "$4";
 var re82s = "$1$2$3";
 var re83s = "$5$6";
 var re84s = "–";

    var re90s = new RegExp("^(.*?[^\\\d])??(\\\d+)(" +stepen+ ")((?:"+nbspEntity+"| )–|–(?:"+nbspEntity+"| )|(?:"+nbspEntity+"| )–(?:"+nbspEntity+"| ))(\\\d+)([^\\\d].*?){0,1}$","gi");
 var re91s = "$4";
 var re92s = "$1$2$3";
 var re93s = "$5$6";
 var re94s = "–";
 // ==============================================================================================
 
 
 
 
 

                                                     // шаблоны для финального восстановления временных замен «col1_» – до десяти, свыше – «col2_»
  var re_fin1 = new RegExp("col1¦\\\d¦","g");
  var re_fin2 = new RegExp("col2¦\\\d{2}¦","g");

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
     if (z < 10)  { var re100x = new RegExp("col1¦("+z+")¦","g");
                    var re101x = xCol[z];
                    ss = ss.replace(re100x,re101x); }
     if (z >= 10) { var re200x = new RegExp("col2¦("+z+")¦","g");
                    var re201x = xCol[z];
                    ss = ss.replace(re200x,re201x); }            
   }
  } 

 var a1 = 0;

 if (CodeMode) {
   ss=ptr.innerHTML;
   if (ss.search(re1cl)!=-1) {ss = ss.replace(re1cl, re11cl);}
   if (ss.search(re3cl)!=-1) {ss = ss.replace(re3cl, re31cl);}

   b0 = ss.length;
  }
 else { a1 = ss.replace(/&(lt|gt|amp|nbsp|shy);/gi,"&").length; }

 var range1=document.body.createTextRange();
 range1.moveToElementText(ptr);
 range1.collapse();
 range1.move("character",a1);
 range1.moveEnd("character",b0);
 range1.select();
 }
//                   Конец подсветки                           //


 // функция, обрабатывающая абзац P
 function HandleP(ptr) {
  s=ptr.innerHTML;

       if (s.search(re50)!=-1 || s.search(re40)!=-1 || s.search(re40a)!=-1 || s.search(re30)!=-1 || s.search(re30a)!=-1 || s.search(re30b)!=-1 || s.search(re30c)!=-1 || s.search(re30d)!=-1 || s.search(re30e)!=-1 || s.search(re30f)!=-1 || s.search(re30g)!=-1 || s.search(re30h)!=-1 || s.search(re30i)!=-1 || s.search(re30j)!=-1 || s.search(re30k)!=-1 || s.search(re30l)!=-1 || s.search(re30m)!=-1 || s.search(re30n)!=-1 || s.search(re70)!=-1 || s.search(re80)!=-1 || s.search(re90)!=-1 || s.search(re70s)!=-1 || s.search(re80s)!=-1 || s.search(re90s)!=-1)
         {      GoTo(ptr);

//              Единицы площади и объёма:
       while (s.search(re50)!=-1) {
    var v1  = s.replace(re50, re51);
    var v2  = s.replace(re50, re54);
    var sl1   = s.replace(re50, re52);
    var sp1   = s.replace(re50, re53);

    JustBacklighting(v1, sl1);

 var r=Object();
 if (k<10) {
 if (InputBox(" :: Единицы площади и объёма ::\n > Замена:   " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Единицы площади и объёма ::\n > Замена:   " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }

//              Габариты-объём:
       while (s.search(re40a)!=-1) {
    var v1  = s.replace(re40a, re41a);
    var v2  = s.replace(re40a, re44a);
    var sl1   = s.replace(re40a, re42a);
    var sp1   = s.replace(re40a, re43a);

    JustBacklighting(v1, sl1);

 var r=Object();
 if (k<10) {
 if (InputBox(" :: Габариты ::\n > Замена:   " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Габариты ::\n > Замена:   " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }


//              Габариты-площадь:
       while (s.search(re40)!=-1) {
    var v1  = s.replace(re40, re41);
    var v2  = s.replace(re40, re44);
    var sl1   = s.replace(re40, re42);
    var sp1   = s.replace(re40, re43);

    JustBacklighting(v1, sl1);

 var r=Object();
 if (k<10) {
 if (InputBox(" :: Габариты ::\n > Замена:   " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Габариты ::\n > Замена:   " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }

//              1/4
       while (s.search(re30)!=-1) {
    var v1  = s.replace(re30, re31);
    var v2  = s.replace(re30, re34);
    var sl1   = s.replace(re30, re32);
    var sp1   = s.replace(re30, re33);

    JustBacklighting(v1, sl1);

	 var r=Object();
 if (k<10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }

//              1/2
       while (s.search(re30a)!=-1) {
    var v1  = s.replace(re30a, re31a);
    var v2  = s.replace(re30a, re34a);
    var sl1   = s.replace(re30a, re32a);
    var sp1   = s.replace(re30a, re33a);

    JustBacklighting(v1, sl1);

	 var r=Object();
 if (k<10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }

//              3/4
       while (s.search(re30b)!=-1) {
    var v1  = s.replace(re30b, re31b);
    var v2  = s.replace(re30b, re34b);
    var sl1   = s.replace(re30b, re32b);
    var sp1   = s.replace(re30b, re33b);

    JustBacklighting(v1, sl1);

	 var r=Object();
 if (k<10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }

//              1/3
       while (s.search(re30c)!=-1) {
    var v1  = s.replace(re30c, re31c);
    var v2  = s.replace(re30c, re34c);
    var sl1   = s.replace(re30c, re32c);
    var sp1   = s.replace(re30c, re33c);

    JustBacklighting(v1, sl1);

	 var r=Object();
 if (k<10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }

//             2/3
       while (s.search(re30d)!=-1) {
    var v1  = s.replace(re30d, re31d);
    var v2  = s.replace(re30d, re34d);
    var sl1   = s.replace(re30d, re32d);
    var sp1   = s.replace(re30d, re33d);

    JustBacklighting(v1, sl1);

	 var r=Object();
 if (k<10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }

//              1/5
       while (s.search(re30e)!=-1) {
    var v1  = s.replace(re30e, re31e);
    var v2  = s.replace(re30e, re34e);
    var sl1   = s.replace(re30e, re32e);
    var sp1   = s.replace(re30e, re33e);

    JustBacklighting(v1, sl1);

	 var r=Object();
 if (k<10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }

//              2/5
       while (s.search(re30f)!=-1) {
    var v1  = s.replace(re30f, re31f);
    var v2  = s.replace(re30f, re34f);
    var sl1   = s.replace(re30f, re32f);
    var sp1   = s.replace(re30f, re33f);

    JustBacklighting(v1, sl1);

	 var r=Object();
 if (k<10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }

//              3/5
       while (s.search(re30g)!=-1) {
    var v1  = s.replace(re30g, re31g);
    var v2  = s.replace(re30g, re34g);
    var sl1   = s.replace(re30g, re32g);
    var sp1   = s.replace(re30g, re33g);

    JustBacklighting(v1, sl1);

	 var r=Object();
 if (k<10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }

//              4/5
       while (s.search(re30h)!=-1) {
    var v1  = s.replace(re30h, re31h);
    var v2  = s.replace(re30h, re34h);
    var sl1   = s.replace(re30h, re32h);
    var sp1   = s.replace(re30h, re33h);

    JustBacklighting(v1, sl1);

	 var r=Object();
 if (k<10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }

//             1/6
       while (s.search(re30i)!=-1) {
    var v1  = s.replace(re30i, re31i);
    var v2  = s.replace(re30i, re34i);
    var sl1   = s.replace(re30i, re32i);
    var sp1   = s.replace(re30i, re33i);

    JustBacklighting(v1, sl1);

	 var r=Object();
 if (k<10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }

//              5/6
       while (s.search(re30j)!=-1) {
    var v1  = s.replace(re30j, re31j);
    var v2  = s.replace(re30j, re34j);
    var sl1   = s.replace(re30j, re32j);
    var sp1   = s.replace(re30j, re33j);

    JustBacklighting(v1, sl1);

	 var r=Object();
 if (k<10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }

//              1/8
       while (s.search(re30k)!=-1) {
    var v1  = s.replace(re30k, re31k);
    var v2  = s.replace(re30k, re34k);
    var sl1   = s.replace(re30k, re32k);
    var sp1   = s.replace(re30k, re33k);

    JustBacklighting(v1, sl1);

	 var r=Object();
 if (k<10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }

//              3/8
       while (s.search(re30l)!=-1) {
    var v1  = s.replace(re30l, re31l);
    var v2  = s.replace(re30l, re34l);
    var sl1   = s.replace(re30l, re32l);
    var sp1   = s.replace(re30l, re33l);

    JustBacklighting(v1, sl1);

	 var r=Object();
 if (k<10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }

//              5/8
       while (s.search(re30m)!=-1) {
    var v1  = s.replace(re30m, re31m);
    var v2  = s.replace(re30m, re34m);
    var sl1   = s.replace(re30m, re32m);
    var sp1   = s.replace(re30m, re33m);

    JustBacklighting(v1, sl1);

	 var r=Object();
 if (k<10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }

//             7/8
       while (s.search(re30n)!=-1) {
    var v1  = s.replace(re30n, re31n);
    var v2  = s.replace(re30n, re34n);
    var sl1   = s.replace(re30n, re32n);
    var sp1   = s.replace(re30n, re33n);

    JustBacklighting(v1, sl1);

	 var r=Object();
 if (k<10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Числа через слэш ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }

//              Дефис между цифрами:
       while (s.search(re70)!=-1) {
    var v1  = s.replace(re70, re71);
    var v2  = s.replace(re70, re74);
    var sl1   = s.replace(re70, re72);
    var sp1   = s.replace(re70, re73);

    JustBacklighting(v1, sl1);

	var r=Object();
 if (k<10) {
 if (InputBox(" :: Дефис ::\n > Предлагается замена:                     " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Дефис ::\n > Предлагается замена:                     " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }

//              Тире между цифрами
       while (s.search(re80)!=-1) {
    var v1  = s.replace(re80, re81);
    var v2  = s.replace(re80, re84);
    var sl1   = s.replace(re80, re82);
    var sp1   = s.replace(re80, re83);

    JustBacklighting(v1, sl1);

	var r=Object();
 if (k<10) {
 if (InputBox(" :: Тире ::\n > Предлагается замена:                     " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Тире ::\n > Предлагается замена:                     " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }

//              Лишний пробел между цифрами
       while (s.search(re90)!=-1) {
    var v1  = s.replace(re90, re91);
    var v2  = s.replace(re90, re94);
    var sl1   = s.replace(re90, re92);
    var sp1   = s.replace(re90, re93);

    JustBacklighting(v1, sl1);

	var r=Object();
 if (k<10) {
 if (InputBox(" :: Пробел ::\n > Предлагается замена:                     " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Пробел ::\n > Предлагается замена:                     " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }


//              Дефис между цифрами со степенями:
       while (s.search(re70s)!=-1) {
    var v1  = s.replace(re70s, re71s);
    var v2  = s.replace(re70s, re74s);
    var sl1   = s.replace(re70s, re72s);
    var sp1   = s.replace(re70s, re73s);

    JustBacklighting(v1, sl1);

	var r=Object();
 if (k<10) {
 if (InputBox(" :: Дефис между числами ::\n > Предлагается замена:                     " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Дефис между числами ::\n > Предлагается замена:                     " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }

//              Тире между цифрами со степенью
       while (s.search(re80s)!=-1) {
    var v1  = s.replace(re80s, re81s);
    var v2  = s.replace(re80s, re84s);
    var sl1   = s.replace(re80s, re82s);
    var sp1   = s.replace(re80s, re83s);

    JustBacklighting(v1, sl1);

	var r=Object();
 if (k<10) {
 if (InputBox(" :: Тире между числами ::\n > Предлагается замена:                     " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Тире между числами ::\n > Предлагается замена:                     " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }

//              Лишний пробел между цифрами со степенью
       while (s.search(re90s)!=-1) {
    var v1  = s.replace(re90s, re91s);
    var v2  = s.replace(re90s, re94s);
    var sl1   = s.replace(re90s, re92s);
    var sp1   = s.replace(re90s, re93s);

    JustBacklighting(v1, sl1);

	var r=Object();
 if (k<10) {
 if (InputBox(" :: Короткое тире с пробелами между чисел ::\n > Предлагается замена:                     " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Короткое тире с пробелами между чисел ::\n > Предлагается замена:                     " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
xCol[k] = v1; k++; }


				}

if ( s.search(re_fin1)!=-1 || s.search(re_fin2)!=-1) {                                                 // Восстановление временных замен
for (z=0;z<k;z++)  {
                     if (z<10)     { var re100 = new RegExp("col1¦("+z+")¦","g");
                                        var re101 = Col[z];
                                           s=s.replace(re100,re101); }
                  if (z>=10)      {var re200 = new RegExp("col2¦("+z+")¦","g");
                                        var re201 = Col[z];
                                           s=s.replace(re200,re201); }            } k=0; }

   ptr.innerHTML=s;
   return true;
  } 

    window.external.BeginUndoUnit(document,"«Большие числа»");                               // ОТКАТ (UNDO) начало

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

    window.external.EndUndoUnit(document);                               // undo конец;

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
        '  «Дроби, степени, интервалы, габариты» v.'+VersionNumber+'	\n\n'+

        'Произведено замен: ' +count+'\n\n'+

        'Время: ' +TimeStr+ '.\n' ); 

} 