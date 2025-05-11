//======================================
//             «Коррекция jpg/png»
// Скрипт тестировался в FBE v.2.7.7 (win XP, IE8 и win 7, IE11)

// Скрипт предназначен для коррекции имен иллюстраций путем изменения расширения файла.
// Такая операция необходима после переформатирования вложенных файлов в "jpg/png".

// v.1.0 — Создание скрипта — Александр Ка (20.09.2024)
// v.1.1 — Исправлены все ошибки в окнах для win7 — Александр Ка (27.01.2025)
// v.1.2 — Мелкие правки — Александр Ка (01.05.2025)
//======================================

function Run() {

 var ScriptName="«Коррекция jpg/png»";
 var NumerusVersion="1.2";
 var Ts=new Date().getTime();

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОБЩИЕ ПЕРЕМЕННЫЕ

 var fbwBody=document.getElementById("fbw_body");   //  Структура текста (аннотация + история + все <body>, иначе говоря, всё это видно в режиме "B"-дизайн)

 var n=0;
 var k=0;
 var j=0;
 var h=0;  //   Локальные переменные для небольших областей

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ПОИСК  :  Разделы "IMG"

 var mImg=fbwBody.getElementsByTagName("IMG");  //  Массив с узлами "IMG"
 var mImgL=mImg.length;         //  Длина этого массива
 var mImgDS=[];  //  Массив с узлами класса "IMG" (внешний раздел)
 var Img;                   //  Одна из картинок (внешний раздел)
 var mImgHref=[];             //  Массив с именами картинок
 var imgName;                      //  Одно из имен

 for (n=0;  n<mImgL;  n++) {              //  Цикл для всех иллюстраций
         Img=mImg[n].parentNode;                       //  Будет читаться только внешний раздел картинок
         while (Img != fbwBody  &&  Img.className != "image") Img=Img.parentNode;   //  * иногда между внешним и внутренним разделом встречаются посторонние разделы
         mImgDS[n]=Img;                                     // добавление внешнего раздела в массив
         imgName=Img.getAttribute("href").replace(/^#/, "");        //  Получение имени картинки
         mImgHref.push(imgName);           //  Добавление имени иллюстрации в соответствующий список
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ПОИСК  :  Обложки

 var mCovValue=[];  //  Массив с именами всех обложек (и обычных, и на языке оригинала)
 var mCovValueL=0;  //  длина этого массива

 var tiCover=document.getElementById("tiCover");      //  Раздел с обычными обложками
 var mTiCov=tiCover.getElementsByTagName("SELECT");  //  Массив с раздельными блоками для обычных обложек

 for (n=0;  n<mTiCov.length;  n++) {              //  Цикл для всех обычных обложек
         imgName=mTiCov[n].value.replace(/^#/, "");   //  Получение имени без префикса "#"
         if (imgName != "")  mCovValue.push(imgName);          //  Добавление имени в список имен обложек
         }

 var stiCover=document.getElementById("stiCover");      //  Раздел с обложками на языке оригинала
 var mStiCov=stiCover.getElementsByTagName("SELECT");  //  Массив с раздельными блоками для обложек на языке оригинала

 for (n=0;  n<mStiCov.length;  n++) {
         imgName=mStiCov[n].value.replace(/^#/, "");
         if (imgName != "")  mCovValue.push(imgName);
         }

 mCovValueL=mCovValue.length;

 var mCovImgValue=mImgHref.concat(mCovValue);  //  Массив с именами всех обложек и иллюстраций
 var mCovImgValueL=mCovImgValue.length;  //  длина этого массива

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ПОИСК  :  Вложенные файлы (бинарные объекты)

 var binobj=document.getElementById("binobj");      //  Раздел с информацией о вложенных файлах
 var mBin=binobj.getElementsByTagName("DIV");  //  Массив с отдельными блоками для файлов
 var mBinL=mBin.length;         //  Длина этого массива

 var mBinName=[];  //  Массив с именами файлов

         //  Получение записей о бинарных файлах:  Имя
 for (n=0;  n<mBinL;  n++) {
         mBinName[n]=mBin[n].all.id.value;
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ПОИСК  :  Поиск неиспользованных вложений

 var mBinName2=[];   // массив с именами неиспользованных вложений
 var mBinN2L;         //  Длина этого массива

aaa:
 for (n=0;  n<mBinL;  n++) {
         for (k=0;  k<mCovImgValueL;  k++)  {
                 if (mBinName[n]==mCovImgValue[k])        // при нахождении использованного вложения...
                         continue aaa;                                         // проверка следующего имени файла
                 }
         mBinName2.push(mBinName[n]);     // пополнение массива с именами НЕиспользованных вложений
         }

 mBinN2L=mBinName2.length;

 var mBinName2_=[];   // массив с метками неиспользованных вложений

 for (n=0;  n<mBinN2L;  n++)
         mBinName2_[n]=1;              // заполнение массива метками


// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОБРАБОТКА  :  Поиск безбинарных иллюстраций и их переименование

         // функция переименования иллюстраций
 function reName(n, newName) {
         mImgDS[n].setAttribute("href","#"+newName);           //  изменение имени во внешнем разделе
         mImg[n].src="fbw-internal:#"+newName;                        //  изменение имени во внутреннем разделе
         mImg[n].outerHTML=mImg[n].outerHTML;         //  для обновления имени в дереве структуры FBE
         }

 var reХХХ= new RegExp("^(.+?)(\\\.(JPG|JPEG|PNG|TIF|GIF|BMP)(_\\\d{1,}){0,1}){0,1}$","gi");
 var reХХХ_1= "$1";
 var reХХХ_2= "$3";
 var reYYY= new RegExp("^(.+)\\\.(JPG|JPEG|PNG)$","gi");
 var reYYY_1= "$1";
 var reYYY_2= "$2";
 var num;
 var count=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];  // массив со счетчиками изменений имен иллюстраций с разделением по типу изменений (15 типов)
 var newName;       // новое имя для иллюстрации
 var count_Img_noBin=0;  //  Счетчик безбинарных иллюстраций

 window.external.BeginUndoUnit(document, ScriptName+" v."+NumerusVersion);    // Начало записи в систему отмен.

bbb:
 for (n=0;  n<mImgL;  n++) {            //  проверяем этим циклом все иллюстрации по очереди
         for (k=0;  k<mBinL;  k++)
                 if (mImgHref[n]==mBinName[k])        // если имя иллюстрации есть среди имен файлов...
                         continue bbb;                                         // проверка следующего имени иллюстрации
         count_Img_noBin++;
         newName = mImgHref[n].replace(reХХХ, reХХХ_1);      // если же иллюстрация безбинарная, убираем у неё расширение
         for (j=0;  j<mBinN2L;  j++)          // и ищем это имя среди неиспользованных вложений
                 if (mBinName2[j].search(reYYY) != -1  &&  newName == mBinName2[j].replace(reYYY, reYYY_1)) {   // и если находим...
                         newName = mBinName2[j];    // определяемся с новым именем для иллюстрации
                         //  и смотрим, какую же пару мы нашли:
                         switch (mImgHref[n].replace(reХХХ, reХХХ_2).toLowerCase()) {
                                 case "jpg":  num = 0;  break;
                                 case "jpeg":  num = 3;  break;
                                 case "png":  num = 6;  break;
                                 case "tif":  num = 9;  break;
                                 case "gif":  num = 12;  break;
                                 case "bmp":  num = 15;  break;
                                 case "":  num = 18;  break;    }
                         switch (mBinName2[j].replace(reYYY, reYYY_2).toLowerCase()) {
                                 case "jpg":  break;
                                 case "jpeg":  num += 1;  break;
                                 case "png":  num += 2;  break;    }
                         reName(n, newName);     // изменяем имя иллюстрации с помощью заготовленной функции
                         count[num]++;                // повышаем счетчик нужного типа
                         mBinName2_[j]=0;        // снимаем метку "неиспользованное вложение" с файла
                         continue bbb; }                       // и проверяем следующую иллюстрацию
         continue bbb;                       // если не получилось изменить имя безбинарной иллюстрации - проверяем следующую
         }

 window.external.EndUndoUnit(document);    // Конец записи в систему отмен.

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ДОПОЛНИТЕЛЬНЫЕ ВЫЧИСЛЕНИЯ

 var count_Bin2 = 0;    // счетчик неиспользованных вложений : стало

         // подсчет меток
 for (n=0;  n<mBinN2L;  n++)
         count_Bin2 += mBinName2_[n];              // подсчет меток неиспользованных вложений

 var count_Img_noBin2 = count_Img_noBin;    // счетчик безбинарных иллюстраций : стало

 for (n=0;  n<count.length;  n++)
         count_Img_noBin2 -= count[n];

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Подсчет чистого компьютерного времени, потраченного на обработку текста

 var Tf=new Date().getTime();    //  фиксация времени окончания работы скрипта
 var tempus=0;

 var T2=Tf-Ts;                //  время работы скрипта  (в миллисекундах)
 var Tmin  = Math.floor((T2)/60000);
 var TsecD = ((T2)%60000)/1000;
 var Tsec = Math.floor(TsecD);

 if (Tmin ==0)
         tempus = (+(TsecD+"").replace(/(.{1,5}).*/g, "$1")+"").replace(".", ",")+" сек";
     else {
             tempus = Tmin+" мин";
             if (Tsec !=0)
                     tempus += " " + Tsec+ " с" }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Текущее время и дата

 var currentFullDate = new Date();

 var currentHours = currentFullDate.getHours();
 var currentMinutes = currentFullDate.getMinutes();
 var currentSeconds = currentFullDate.getSeconds();

 if (currentMinutes<10) currentMinutes = "0" + currentMinutes;
 if (currentSeconds<10) currentSeconds = "0" + currentSeconds;

 var currentDay = currentFullDate.getDate();
 var currentMonth = 1+currentFullDate.getMonth();
 var currentYear = currentFullDate.getFullYear();

 if (currentMonth<10) currentMonth = "0" + currentMonth;
currentYear = (currentYear+"").replace(/^.*?(\d{1,2})$/g, "$1");

 var currentTime = currentHours + ":" + currentMinutes + ":" + currentSeconds;
 var currentDate = currentDay + "." + currentMonth + "." + currentYear;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// Демонстрационный режим "Показать все строки"

var VseStroki_on_off = 0;      // 0 ; 1 //      ("0" — отключить, "1" — включить)

 var d=0;
 if (VseStroki_on_off == 1)  d="показать нули";

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Сборка массива с результатами обработки

 var mSt=[];       //  Массив со всеми строками статистики
 var ind=0;        //  Номер строки


                 mSt[ind]=" "+ScriptName+" v."+NumerusVersion;  ind++;
                 mSt[ind]="--------------------------------------------------------------";  ind++;
 if (d)   { mSt[ind]=" Демонстрационный режим";  ind++ }
                 mSt[ind]="						";  ind++;
                 mSt[ind]="• Время выполнения  .  .  .  .  .  .  .  .	"+tempus;  ind++;

 var cTaT=ind;

                                 mSt[ind]="";  ind++;
 if (mBinL!=d)  { mSt[ind]="Вложенных файлов  .  .  .  .  .  .  .  .  .  .  .  .  .	"+mBinL;  ind++; }
 if (mBinN2L!=d) {
         if (mBinN2L == count_Bin2  ||  d) {
                                 mSt[ind]="        Неиспользованных вложений   .  .  .  .  .	"+mBinN2L;  ind++; }
         if (mBinN2L != count_Bin2  ||  d) {
                                 mSt[ind]="        Неиспользованных вложений, было .  .	"+mBinN2L;  ind++;
                                 mSt[ind]="                стало .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_Bin2;  ind++; }    }

 if (cTaT==ind-1)  ind=ind-1;  //  Удаление последней строки, если нет пунктов со статистикой
 cTaT=ind;

                                             mSt[ind]="";  ind++;
 if (mCovValueL!=d)  { mSt[ind]="Обложек   .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+mCovValueL;  ind++; }
 if (mImgL!=d)             { mSt[ind]="Иллюстраций  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+mImgL;  ind++; }
 if (count_Img_noBin!=d) {
         if (count_Img_noBin == count_Img_noBin2  ||  d) {
                                             mSt[ind]="        Безбинарных иллюстраций  .  .  .  .  .  .  .	"+count_Img_noBin;  ind++; }
         if (count_Img_noBin != count_Img_noBin2  ||  d) {
                                             mSt[ind]="        Безбинарных иллюстраций, было   .  .  .	"+count_Img_noBin;  ind++;
                                             mSt[ind]="                стало .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .	"+count_Img_noBin2;  ind++; }    }

 if (cTaT==ind-1)  ind=ind-1;  //  Удаление последней строки, если нет пунктов со статистикой
 cTaT=ind;

                                         mSt[ind]="";  ind++;
                                         mSt[ind]="Изменения  в  именах  иллюстраций :";  ind++;
 if (count[0]!=d)     { mSt[ind]="      • jpg-формат  ›››  jpg   .  .  .  .  .  .	"+count[0];  ind++; }
 if (count[1]!=d)     { mSt[ind]="      • jpg-формат  ›››  jpeg .  .  .  .  .  .	"+count[1];  ind++; }
 if (count[2]!=d)     { mSt[ind]="      • jpg-формат  ›››  png  .  .  .  .  .  .	"+count[2];  ind++; }
 if (count[3]!=d)     { mSt[ind]="      • jpeg-формат  ›››  jpg .  .  .  .  .  .	"+count[3];  ind++; }
 if (count[4]!=d)     { mSt[ind]="      • jpeg-формат  ›››  jpeg  .  .  .  .  .	"+count[4];  ind++; }
 if (count[5]!=d)     { mSt[ind]="      • jpeg-формат  ›››  png   .  .  .  .  .	"+count[5];  ind++; }
 if (count[6]!=d)     { mSt[ind]="      • png-формат  ›››  jpg  .  .  .  .  .  .	"+count[6];  ind++; }
 if (count[7]!=d)     { mSt[ind]="      • png-формат  ›››  jpeg   .  .  .  .  .	"+count[7];  ind++; }
 if (count[8]!=d)     { mSt[ind]="      • png-формат  ›››  png .  .  .  .  .  .	"+count[8];  ind++; }
 if (count[9]!=d)     { mSt[ind]="      • tif-формат  ›››  jpg .  .  .  .  .  .  .	"+count[9];  ind++; }
 if (count[10]!=d)  { mSt[ind]="      • tif-формат  ›››  jpeg  .  .  .  .  .  .	"+count[10];  ind++; }
 if (count[11]!=d)  { mSt[ind]="      • tif-формат  ›››  png   .  .  .  .  .  .	"+count[11];  ind++; }
 if (count[12]!=d)  { mSt[ind]="      • gif-формат  ›››  jpg .  .  .  .  .  .  .	"+count[12];  ind++; }
 if (count[13]!=d)  { mSt[ind]="      • gif-формат  ›››  jpeg  .  .  .  .  .  .	"+count[13];  ind++; }
 if (count[14]!=d)  { mSt[ind]="      • gif-формат  ›››  png   .  .  .  .  .  .	"+count[14];  ind++; }
 if (count[15]!=d)  { mSt[ind]="      • bmp-формат  ›››  jpg .  .  .  .  .  .	"+count[15];  ind++; }
 if (count[16]!=d)  { mSt[ind]="      • bmp-формат  ›››  jpeg  .  .  .  .  .	"+count[16];  ind++; }
 if (count[17]!=d)  { mSt[ind]="      • bmp-формат  ›››  png   .  .  .  .  .	"+count[17];  ind++; }
 if (count[18]!=d)  { mSt[ind]="      • без формата  ›››  jpg .  .  .  .  .  .	"+count[18];  ind++; }
 if (count[19]!=d)  { mSt[ind]="      • без формата  ›››  jpeg  .  .  .  .  .	"+count[19];  ind++; }
 if (count[20]!=d)  { mSt[ind]="      • без формата  ›››  png   .  .  .  .  .	"+count[20];  ind++; }

 if (cTaT==ind-2)            //  Если нет строк с исправлениями...
         ind=ind-2;                   //  то удаляем две последние строки
 if (cTaT==ind  ||  d) {
         mSt[ind]="";  ind++;
         mSt[ind]="   >> Исправлений нет";  ind++;   //  и добавляем две дополнительные строки.
         }

//  Сборка строк текущей даты и времени
 mSt[ind]="";  ind++;
 mSt[ind]="--------------------------------------------------------------";  ind++;
 mSt[ind]= "• "+currentDate+" • "+currentTime+" •";  ind++;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Вывод окна результатов на экран

         //  Сборка таблицы результатов

 var stT=mSt[0];  //  Вывод результатов

 for (n=1; n<ind; n++)
         stT += "\n"+mSt[n];


        //  Вывод окна результатов
 MsgBox (stT+"\n");

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------

}







