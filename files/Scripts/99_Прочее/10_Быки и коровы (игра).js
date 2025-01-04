//======================================
//             Игра «Быки и коровы»
//~~~~~~~~~~~~~~~~~~
// v.1.0 — Создание скрипта — Александр Ка (08.06.2024)
//~~~~~~~~~~~~~~~~~~


var NumerusVersion="1.1";


function Run() {

//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------

                 ///  НАСТРОЙКИ

//--------------------------------------------------------------------

//     Длина числа (по умолчанию)

var Razrjadov = 4;      // 2 ; 3 ; 4 ; 5 ; 6 ; 7 ; 8 ; 9 //      (В классической игре число должно быть четырехзначным)

// ---------------------------------------------------------------

//     Предлагать выбрать длину числа в начале каждого матча

var Dilectus = 1;      // 0 ; 1 //      ("0" — никогда не предлагать, "1" — всегда предлагать)

// ---------------------------------------------------------------

//     Показывать правила игры

var Lex = 1;      // 0 ; 1 //      ("0" — никогда не показывать, "1" — всегда показывать)

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


 var n;
 var m;
 var k=4;
 var Ts=new Date().getTime();
 var Tr;
 var fN=[];
 var fN4;
 var fN4_;
 var otvet_0="";

 for (n=2; n<10; n++)
         { if (Razrjadov==n) k=n }



                 /// ВЫБОР ДЛИНЫ ЧИСЛА
                 //      (функция "dialogus_1")


 function dialogus_1(msg) {
 valid=false;
 while (!valid) {
         if (InputBox(msg, k, r) == 2)  { return }
         otvet_0 = r.$;
         if (otvet_0 =="") { return }
         if (otvet_0.search(/^[2-9]$/g) !=-1) {
                 valid=true;
                 k=otvet_0;    }
         }
 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// СОЗДАНИЕ ЧИСЛА
                 //      (функция "Numerus")


 function Numerus() {
 Tr=new Date().getTime();
 m=0;
 for  (n=10-k; n<10; n++) {
         fN[m] = Math.floor(("000000"+Math.tan(Tr+m*1000)).replace(/[\.\-]/g, "").replace(/.+(\d{6})\d$/g, "$1")/1000000*n)+1;
         m++ }

 for  (n=1; n<k; n++) {
         for  (m=0; m<n; m++) {
                 if (fN[m] >= fN[n]) fN[m]++ }    }

 fN4="";
 for  (n=0; n<k; n++) { fN4 += fN[n] }
 return fN4;
 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


 var otvet="";
 var N=[];
 var valid=false;
 var exit=false;
 var msg="";
 var r=Object();
 var chetyreh=[ "", "", "двух", "трёх", "четырех", "пяти", "шести", "семи", "восьми", "девяти"];



                 /// ВВОД ЧИСЕЛ
                 //      (функция "dialogus_2")


 function dialogus_2(msg) {
 valid=false;
 while (!valid) {
         if (InputBox(msg, otvet, r) == 2)
                 { if (AskYesNo("◊  Вы уверены, что хотите выйти из игры?  ◊		")) { exit=true; return } }
             else valid=true;
         otvet = r.$+"";
         if (valid) {
                 if (otvet.search(/^ы$/i) !=-1) { valid=false; msg="Компьютер загадал число "+fN4_+"."; otvet = fN4_; }   }
         if (valid) {
                 if (otvet.search(/[^0-9]/) !=-1) { valid=false; msg="Число должно состоять только из цифр.\nНапример: "+Numerus()+"."; }   }
         if (valid) {
                 if (otvet.search(re001) ==-1) { valid=false; msg="Число должно состоять ровно из "+chetyreh[k]+" цифр.\nНапример: "+Numerus()+"." }   }
         if (valid) {
                 N=otvet.match(/./g);
                 for  (n=0; n<k; n++) {
                         if (N[n] == 0) { valid=false; msg="Число не должно содержать цифру ноль.\nОно может состоять только из цифр 1-9. Например: "+Numerus()+"." }    }    }
         if (valid) {
                 for  (n=1; n<k; n++) {
                         for  (m=0; m<n; m++) {
                                 if (N[m] == N[n]) { valid=false; msg="В числе не должна повторяться ни цифра "+N[m]+", ни какая-либо другая цифра.\nЧисло может состоять только из разных цифр. Например: "+Numerus()+"." }    }    }    }
         }
 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// СКЛОНЕНИЕ ПО ПАДЕЖАМ
                 //      (функция "pad")


 var ok=0;
 var m1;
 var m2;
 var Numer;

 function pad(Numer) {
 ok=2;
 m1=Numer % 10;
 m2=Numer % 100;
 if (m2<11 || m2>19) {
         if (m1==1) ok=0;
         else  if (m1==2 || m1==3 || m1==4) ok=1;    }
 return ok;
 }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


    window.external.BeginUndoUnit(document,"Запись хода игры «Быки и Коровы»"+NumerusVersion);                               // ОТКАТ (UNDO) начало



                 /// СОЗДАНИЕ СТРУКТУРЫ ИГРЫ


 var fbwBody=document.getElementById("fbw_body");
 var fbwBody_=fbwBody.cloneNode(false);            //  создание копии пустой оболочки "fbw_body"
 fbwBody.insertAdjacentElement("afterEnd", fbwBody_);  //  вставка этой копии после оригинала
 var Elem5=document.createElement("DIV");              //  создание произвольной пустой оболочки
 Elem5.insertAdjacentElement("beforeEnd", fbwBody);  //  перемещение "fbw_body" внутрь этой оболочки (временно)
 
 var newElement = document.createElement("DIV");
 fbwBody_.insertAdjacentElement("beforeEnd",newElement);
 newElement.className = "body";
 newElement.insertAdjacentElement("beforeEnd",document.createElement("DIV"));
 newElement = newElement.firstChild;
 newElement.className = "title";
 newElement.insertAdjacentElement("beforeEnd",document.createElement("P"));
 newElement.firstChild.innerHTML = "Игра «Быки и Коровы»";

 if (Lex != 0) {
         newElement.insertAdjacentElement("afterEnd",document.createElement("DIV"));
         newElement = newElement.nextSibling;
         newElement.className = "section";
         newElement.insertAdjacentElement("beforeEnd",document.createElement("DIV"));
         newElement = newElement.lastChild;
         newElement.className = "annotation";
         newElement.insertAdjacentElement("beforeEnd",document.createElement("P"));
         newElement.lastChild.innerHTML = "Правила игры";
         newElement.lastChild.className = "subtitle";
         newElement.insertAdjacentElement("beforeEnd",document.createElement("P"));
         newElement.lastChild.innerHTML = "Игра простая: компьютер загадывает число, а вы пытаетесь его угадать.";
         newElement.insertAdjacentElement("beforeEnd",document.createElement("P"));
         newElement.lastChild.innerHTML = "Известно, что в этом числе нет цифры ноль. Кроме того, ни одна цифра в этом числе не повторяется.";
         newElement.insertAdjacentElement("beforeEnd",document.createElement("P"));
         newElement.lastChild.innerHTML = "В вашем распоряжении неограниченное число попыток, в которых вы можете предлагать числа, составленные по тем же правилам. То есть, можно использовать все цифры от 1 до 9, причём эти цифры не должны повторяться.";
         newElement.insertAdjacentElement("beforeEnd",document.createElement("P"));
         newElement.lastChild.innerHTML = "На каждую вашу попытку, компьютер отвечает подсказкой, в которой он указывает, сколько цифр в вашем числе стоят на нужных местах (быки), и сколько цифр из вашего числа есть в загаданном числе, но стоят они не совсем в нужном месте (коровы).";
         newElement.insertAdjacentElement("beforeEnd",document.createElement("P"));
         newElement.lastChild.innerHTML = "«Быки» отмечаются маркером «•», «коровы» — знаком вопроса «?», а всё, что мимо — знаком подчёркивания «_».";
         newElement.insertAdjacentElement("beforeEnd",document.createElement("P"));
         newElement.lastChild.innerHTML = "Например запись «1234     • _ _ _» означает, что угадана только одна цифра, место этой цифры выбрано правильно, и эта цифра «1», «2», «3» или «4».";
         newElement.insertAdjacentElement("beforeEnd",document.createElement("P"));
         newElement.lastChild.innerHTML = "В классической игре используются четырёхзначные числа. Здесь же рамки немного расширены, и можно разгадывать числа, длиной от 2 до 9 цифр.";
         newElement.insertAdjacentElement("afterEnd",document.createElement("P"));
         newElement = newElement.parentNode;
         newElement.lastChild.innerHTML = "<SUB>*</SUB><SUP> * </SUP><SUB>*</SUB>";
         newElement.lastChild.className = "subtitle";
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


 var NNNN=[];
 var count_Partia=0;
 var count_Hod=0;
 var count_Hod2=0;
 var count_Byk=0;
 var count_Kor=0;
 var count_Non=0;
 var msg2="";
 var theEnd=false;



                 /// ЦИКЛ ДЛЯ СЕРИИ МАТЧЕЙ (начало)


while (!theEnd) {

 if (Dilectus ==1) dialogus_1("Выберите длину числа.\nВ этой игре число может иметь от 2 до 9 знаков.");
 var re001 = new RegExp("^\\\d{"+k+"}$","g");

 count_Partia++;

 newElement.insertAdjacentElement("afterEnd",document.createElement("DIV"));
 newElement = newElement.nextSibling;
 newElement.className = "section";
 newElement.insertAdjacentElement("beforeEnd",document.createElement("DIV"));
 newElement = newElement.lastChild;
 newElement.className = "title";
 newElement.insertAdjacentElement("beforeEnd",document.createElement("P"));
 newElement.firstChild.innerHTML = "Матч "+count_Partia;
 newElement = newElement.parentNode;
 newElement.insertAdjacentElement("beforeEnd",document.createElement("P"));
 window.external.inflateBlock(newElement.lastChild)=true;
 GoTo(newElement.lastChild);


 Numerus();
 NNNN=(fN4+"").match(/./g);
 fN4_=fN4;

 count_Byk=0;
 count_Hod=0;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ЦИКЛ ДЛЯ ОДНОГО МАТЧА


 while (count_Byk !=k) {

         count_Kor=0; count_Byk=0;
         count_Hod++;

         msg="Ход "+count_Hod+".  Введите число, состоящее из "+k+"-х разных цифр.\n           Для этого можно использовать только девять цифр от 1 до 9";

         dialogus_2(msg);
         if (exit)  break;

         for  (n=0; n<k; n++) {
                 if (N[n] == NNNN[n]) count_Byk++ }

         for  (n=0; n<k; n++) {
                 for  (m=0; m<k; m++) {
                         if (N[m] == NNNN[n]) count_Kor++ }    }

         count_Kor -= count_Byk;
         count_Non = k - count_Byk - count_Kor;

         msg2 =otvet+"     ";

         for  (n=0; n<count_Byk; n++) { msg2 +=" •" }
         for  (n=0; n<count_Kor; n++) { msg2 +=" ?" }
         for  (n=0; n<count_Non; n++) { msg2 +=" _" }

 newElement.lastChild.innerHTML = msg2;
 newElement.insertAdjacentElement("beforeEnd",document.createElement("P"));
 window.external.inflateBlock(newElement.lastChild)=true;
 GoTo(newElement.lastChild);

         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


 if (exit)  break;



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Подсчет времени, потраченного на игру


 var Tf=new Date().getTime();

 var T2=Tf-Ts;
 var tempus = "";
 var Thour  = Math.floor((T2)/3600000);
 var Tmin  = Math.floor((T2)/60000)%60;
 var TsecD = ((T2)%60000)/1000;
 var Tsec = Math.floor(TsecD);

 var chasov = [ " час ", " часа ", " часов " ];
 var minut = [ " минута ", " минуты ", " минут " ];
 var sekund = [ " секунда ", " секунды ", " секунд " ];

 if (Tmin ==0  &&  Thour ==0) {
         TsecD = (TsecD+"").replace(/(.{1,5}).*/g, "$1").replace(".", ",");
         tempus = TsecD + " секунды ";    }
     else {
             if (Thour !=0) tempus += Thour + chasov[pad(Thour)];
             if (Tmin !=0) tempus += Tmin + minut[pad(Tmin)];
             if (Tsec !=0) tempus +=  Tsec + sekund[pad(Tsec)];
             tempus.replace(/ $/g, "");    }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ФИНАЛ МАТЧА


 count_Hod2 +=count_Hod;
 MsgBox("                    ◊  ВЫ ПОБЕДИЛИ !!!  ◊			\n\n"+
                  "•  Сделано ходов в последнем матче   .  .  .  .	"+count_Hod+"\n"+
                  "•  Всего ходов  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_Hod2+"\n"+
                  "•  Всего игр   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_Partia+"\n\n"+
                  "•  Убито времени:	  "+tempus);


 newElement.lastChild.innerHTML = "<STRONG>-–= Победа =–-</STRONG>";
 GoTo(newElement.lastChild);

theEnd=!AskYesNo("                     ◊  Еще один матч?  ◊			");

}

// --------------   Конец цикла для серии матчей   -----------------
// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// УДАЛЕНИЕ ВСЕХ ЗАПИСЕЙ, которые сделал этот скрипт, и восстановление исходного текста


 fbwBody_.insertAdjacentElement("beforeBegin",  fbwBody);
 fbwBody_.removeNode(true);
 Elem5.removeNode(true);


    window.external.EndUndoUnit(document);                                             // undo конец (запись в систему для отката)

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



}








