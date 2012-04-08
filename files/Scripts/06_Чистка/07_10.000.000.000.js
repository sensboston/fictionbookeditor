//=========================================
//     Большие числа, записанные в иностранной манере и пр.
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
// v.2.1 — доработка движкапод прерывание и выход — sclex, май 2010
//======================================
var VersionNumber="2.1";

//обрабатывать ли history
var ObrabotkaHistory=false;
//обрабатывать ли annotation
var ObrabotkaAnnotation=true;


function Run() {

          Col = new Object();                        // коллекции проверенных словосочетаний
           var k = 0;

  var count=0;
  var Ts=new Date().getTime();
  var TimeStr=0;

try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

var re50 = new RegExp("^(.*?[^\\\d\\\-N№/]){0,1}(\\\d{1,3})([\\\s\\\.]{0,2})(\\\d{3})([\\\s\\\.]{0,2})(\\\d{3})([\\\s\\\.]{0,2})(\\\d{3})([\\\s\\\.]{0,2})(\\\d{3})([\\\s\\\.]{0,2})(\\\d{3})([^\\\d/].*?){0,1}$","gi");
 var re51 = "$2$3$4$5$6$7$8$9$10$11$12";                              // прежний вариант
 var re52 = "$1";                                                                      // с начала абзаца до искомого места
 var re53 = "$13";                                                                    // до конца параграфа
 var re54 = "$2"+nbspChar+"$4"+nbspChar+"$6"+nbspChar+"$8"+nbspChar+"$10"+nbspChar+"$12";                                            // предлагаемый вариант в запросе

var re40 = new RegExp("^(.*?[^\\\d\\\-N№/]){0,1}(\\\d{1,3})([\\\s\\\.]{0,2})(\\\d{3})([\\\s\\\.]{0,2})(\\\d{3})([\\\s\\\.]{0,2})(\\\d{3})([\\\s\\\.]{0,2})(\\\d{3})([^\\\d/].*?){0,1}$","gi");
 var re41 = "$2$3$4$5$6$7$8$9$10";
 var re42 = "$1";
 var re43 = "$11";
 var re44 = "$2"+nbspChar+"$4"+nbspChar+"$6"+nbspChar+"$8"+nbspChar+"$10";

 var re30 = new RegExp("^(.*?[^\\\d\\\-N№/]){0,1}(\\\d{1,3})([\\\s\\\.]{0,2})(\\\d{3})([\\\s\\\.]{0,2})(\\\d{3})([\\\s\\\.]{0,2})(\\\d{3})([^\\\d/].*?){0,1}$","gi");
 var re31 = "$2$3$4$5$6$7$8";
 var re32 = "$1";
 var re33 = "$9";
 var re34 = "$2"+nbspChar+"$4"+nbspChar+"$6"+nbspChar+"$8";

 var re20 = new RegExp("^(.*?[^\\\d\\\-N№/]){0,1}(\\\d{1,3})([\\\s\\\.]{0,2})(\\\d{3})([\\\s\\\.]{0,2})(\\\d{3})([^\\\d/].*?){0,1}$","gi");
 var re21 = "$2$3$4$5$6";
 var re22 = "$1";
 var re23 = "$7";
 var re24 = "$2"+nbspChar+"$4"+nbspChar+"$6";

 var re10 = new RegExp("^(.*?[^\\\d\\\-N№/]){0,1}(\\\d{2,3})([\\\s\\\.]{0,2})(\\\d{3})([^\\\d/].*?){0,1}$","gi");
 var re11 = "$2$3$4";
 var re12 = "$1";
 var re13 = "$5";
 var re14 = "$2"+nbspChar+"$4";

 var re00 = new RegExp("^(.*?[^\\\d\\\-N№/]){0,1}([1-9])([\\\s\\\.]{1,2})(\\\d{3})([^\\\d/].*?){0,1}$","gi");
 var re01 = "$2$3$4";
 var re02 = "$1";
 var re03 = "$5";
 var re04 = "$2$4";

 var re60 = new RegExp("^(.*?[^\\\d\\\-N№/]){0,1}([1-9])("+nbspEntity+")(\\\d{3})([^\\\d("+nbspEntity+")].*?){0,1}$","gi");
 var re61 = "$2 $4";
 var re62 = "$1";
 var re63 = "$5";
 var re64 = "$2$4";

 var re70 = new RegExp("^(.*?){0,1}(\\\d+)-(\\\d+)(.*?){0,1}$","gi");
 var re71 = "$2-$3";
 var re72 = "$1";
 var re73 = "$4";
 var re74 = "$2–$3";

 var re80 = new RegExp("^(.*?){0,1}(\\\d+) {0,1}— {0,1}(\\\d+)(.*?){0,1}$","gi");
 var re81 = "$2 — $3";
 var re82 = "$1";
 var re83 = "$4";
 var re84 = "$2–$3";

 var re90 = new RegExp("^(.*?){0,1}(\\\d+)( –|– )(\\\d+)(.*?){0,1}$","gi");
 var re91 = "$2$3$4";
 var re92 = "$1";
 var re93 = "$5";
 var re94 = "$2–$4";


                                                     // шаблоны для финального восстановления временных замен «col1_» – до десяти, свыше – «col2_»
  var re_fin1 = new RegExp("col1¦\\\d¦","g");
  var re_fin2 = new RegExp("col2¦\\\d{2}¦","g");


 var s="";

 // функция, обрабатывающая абзац P
 function HandleP(ptr) {
  s=ptr.innerHTML;

       if (s.search(re50)!=-1 || s.search(re40)!=-1 || s.search(re30)!=-1 || s.search(re20)!=-1 || s.search(re10)!=-1 || s.search(re00)!=-1 || s.search(re60)!=-1 || s.search(re70)!=-1 || s.search(re80)!=-1 || s.search(re90)!=-1  )
         {      GoTo(ptr);

//              50 000 000 000 000 000
       while (s.search(re50)!=-1) {
    var v1  = s.replace(re50, re51);
    var v2  = s.replace(re50, re54);
    var sl1   = s.replace(re50, re52);
    var sp1   = s.replace(re50, re53);
 var r=Object();
 if (k<10) {
 if (InputBox(" :: Большие числа ::\n > Замена:   " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Большие числа ::\n > Замена:   " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
k++; }

//              40 000 000 000 000
       while (s.search(re40)!=-1) {
    var v1  = s.replace(re40, re41);
    var v2  = s.replace(re40, re44);
    var sl1   = s.replace(re40, re42);
    var sp1   = s.replace(re40, re43);
	 var r=Object();
 if (k<10) {
 if (InputBox(" :: Большие числа ::\n > Предлагается:        " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 var r=prompt(" :: Большие числа ::\n > Предлагается:        " +v1+ " —> " +v2,v2)
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Большие числа ::\n > Предлагается:        " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
k++; }

//              30 000 000 000
       while (s.search(re30)!=-1) {
    var v1  = s.replace(re30, re31);
    var v2  = s.replace(re30, re34);
    var sl1   = s.replace(re30, re32);
    var sp1   = s.replace(re30, re33);
	 var r=Object();
 if (k<10) {
 if (InputBox(" :: Большие числа ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Большие числа ::\n > Предлагается замена:      " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
k++; }

//              20 000 000
       while (s.search(re20)!=-1) {
    var v1  = s.replace(re20, re21);
    var v2  = s.replace(re20, re24);
    var sl1   = s.replace(re20, re22);
    var sp1   = s.replace(re20, re23);
		 var r=Object();
 if (k<10) {
 if (InputBox(" :: Большие числа ::\n > Предлагается замена:           " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Большие числа ::\n > Предлагается замена:           " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
k++; }

//              10 000
       while (s.search(re10)!=-1) {
    var v1  = s.replace(re10, re11);
    var v2  = s.replace(re10, re14);
    var sl1   = s.replace(re10, re12);
    var sp1   = s.replace(re10, re13);
	var r=Object();
 if (k<10) {
 if (InputBox(" :: Большие числа ::\n > Предлагается замена:                " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Большие числа ::\n > Предлагается замена:                " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
k++; }

//              1 000
       while (s.search(re00)!=-1) {
    var v1  = s.replace(re00, re01);
    var v2  = s.replace(re00, re04);
    var sl1   = s.replace(re00, re02);
    var sp1   = s.replace(re00, re03);
	var r=Object();
 if (k<10) {
 if (InputBox(" :: Большие числа ::\n > Предлагается замена:                     " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Большие числа ::\n > Предлагается замена:                     " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
k++; }

//              1000
       while (s.search(re60)!=-1) {
    var v1  = s.replace(re60, re61);
    var v2  = s.replace(re60, re64);
    var sl1   = s.replace(re60, re62);
    var sp1   = s.replace(re60, re63);
	var r=Object();
 if (k<10) {
 if (InputBox(" :: Большие числа ::\n > Предлагается замена:                     " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Большие числа ::\n > Предлагается замена:                     " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
k++; }

//              Дефис между цифрами
       while (s.search(re70)!=-1) {
    var v1  = s.replace(re70, re71);
    var v2  = s.replace(re70, re74);
    var sl1   = s.replace(re70, re72);
    var sp1   = s.replace(re70, re73);
	var r=Object();
 if (k<10) {
 if (InputBox(" :: Дефис ::\n > Предлагается замена:                     " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Дефис ::\n > Предлагается замена:                     " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
k++; }

//              Тире между цифрами
       while (s.search(re80)!=-1) {
    var v1  = s.replace(re80, re81);
    var v2  = s.replace(re80, re84);
    var sl1   = s.replace(re80, re82);
    var sp1   = s.replace(re80, re83);
	var r=Object();
 if (k<10) {
 if (InputBox(" :: Тире ::\n > Предлагается замена:                     " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Тире ::\n > Предлагается замена:                     " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
k++; }

//              Лишний пробел между цифрами
       while (s.search(re90)!=-1) {
    var v1  = s.replace(re90, re91);
    var v2  = s.replace(re90, re94);
    var sl1   = s.replace(re90, re92);
    var sp1   = s.replace(re90, re93);
	var r=Object();
 if (k<10) {
 if (InputBox(" :: Пробел ::\n > Предлагается замена:                     " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col1¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col1¦" +k+ "¦")+sp1} }
 if (k>=10) {
 if (InputBox(" :: Пробел ::\n > Предлагается замена:                     " +v1+ " —> " +v2,v2, r) == IDCANCEL) return "exit";
 if(r!=null && r.$!="")  { Col[k] = r.$;    s=sl1+("col2¦" +k+ "¦")+sp1;  count++; }
 else                       { Col[k] = v1;  s=sl1+("col2¦" +k+ "¦")+sp1} }
k++; }

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

 var tr=document.selection.createRange();
 if (!tr) return;
 tr.collapse();
 var ptr=tr.parentElement();
 if (!body.contains(ptr)) return;
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
        '  «Большие числа» v.'+VersionNumber+'	\n\n'+

        'Произведено замен: ' +count+'\n\n'+

        'Время: ' +TimeStr+ '.\n' ); 

} 