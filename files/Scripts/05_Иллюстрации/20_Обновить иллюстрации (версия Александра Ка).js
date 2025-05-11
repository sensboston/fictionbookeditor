//======================================
//   Скрипт «Обновление графики» v.1.3
//   За основу взят скрипт "Обновить иллюстрации" (v.1.0)

// v.1.1 — Обновление кнопок сохранения файлов и кнопок просмотра изображений — Александр Ка (15.09.2024)
// v.1.2 — Установка обложек. Статистика. Изменено имя скрипта — Александр Ка (14.03.2025)
// v.1.3 — Мелкие правки — Александр Ка (02.05.2025)
//======================================

function Run() {

 var ScriptName="«Обновление графики»";
 var NumerusVersion = "1.3";
 var Ts=new Date().getTime();

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///  Общие переменные

 var fbwBody = document.getElementById("fbw_body");         //  Раздел текста книги.
 var mImg = fbwBody.getElementsByTagName("IMG");              //  Все разделы "IMG".

 var fbwDesc = document.getElementById("fbw_desc");         //  Раздел дискрипшена.
 var mDesc = fbwDesc.all;                                                                     //  Все разделы в дискрипшене.

 var Binobj = mDesc.binobj;                                                   //  Раздел со всеми вложенными файлами.
 var mBin = Binobj.getElementsByTagName("DIV");  //  массив с узлами "DIV" (каждый узел посвящен одному файлу).
 var lengthBin = mBin.length;       //  Длина этого массива.

 var i;
 var k;

 //  Счетчики.
 var count_Cover = 0;
 var count_Img = mImg.length;
 var count_Bin = 0;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///  ОБНОВЛЕНИЕ :  иллюстрации в тексте и дереве структуры

 window.external.BeginUndoUnit(document, ScriptName+" v."+NumerusVersion);    // Начало записи в систему отмен.

 var img;          //  Один из разделов "IMG".
 var imgUp;          //  Первый раздел "DIV", расположенный выше "IMG".
 var pic_id = "";

 for (i=0; i<count_Img; i++) {                //  Просмотр всех разделов с иллюстрациями по очереди.
          //  Обновление иллюстраций в тексте
          img = mImg[i];       //  Один из разделов.
          pic_id = img.src;    //  Сохранение имени иллюстрации в переменной.
          img.src = "";            //  Удаление имени.
          img.src = pic_id;   //  Восстановление имени.
          //  Обновление имени иллюстрации в "дереве структуры", и коррекция высоты всего текста
          img.outerHTML = img.outerHTML;   //  Перезапись раздела "IMG".
         }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///  УСТАНОВКА ОБЛОЖЕК со стандартными именами (cover.jpg ;  cover.png ;  cover_src.jpg ;  cover_src.png)

 var coverName = "";   //  Искомое имя обложки без расширения.
 var CoverElem;     //  Раздел обложки.
 var CoverSelect;   //  Раздел "SELECT".
 var mCover = [];   //  Все разделы "OPTION" в разделе раскрывающегося списка обложки.
 var lengthCover = 0;       //  Длина массива.
 var mutatio = false;   //  Индикатор изменения порядка в группе разделов с файлами.

 //  Функция для установки обложек
function CoverAdd(CoverElem, coverName) {
     if (CoverElem.getElementsByTagName("DIV").length == 1) {                //  Если есть место только для одной обложки...
             CoverSelect = CoverElem.all.href;                                                             //  Получаем внутри него раздел "SELECT" с именем "href".
             if (CoverSelect.value == "") {                                                                       //  Если обложка не установлена...
                     var reCover = new RegExp("^#"+coverName+"\\\.(jpg|png)$","");  //  создаем рег. выражение для поиска имени обложки в раскрывающемся списке и
                     mCover = CoverSelect.getElementsByTagName("OPTION");                //  получаем все разделы с элементами списка.
                     lengthCover = mCover.length;
                     for (k=0; k<lengthCover; k++)                                                  //  Просмотр всех этих разделов по очереди.
                             if (mCover[k].value.search(reCover) != -1) {   //  Если находим подходящее название файла...
                                     mCover[0].selected = false;                            //  удаляем выбор "пусто",
                                     mCover[k].selected = true;                            //  устанавливаем этот файл как обложку.
                                     var reFile = new RegExp("^"+coverName+"\\\.(jpg|png)$","");      //  Создаем рег. выражение для поиска имени обложки в разделах с файлами.
                                     if (mBin[0].all.id.value.search(reFile) == -1)                                                 //  Если файл обложки не первый в группе...
                                             for (i=1; i<lengthBin; i++)                                                                              //  то в массиве с вложенными файлами
                                                     if (mBin[i].all.id.value.search(reFile) != -1) {                                     //  находим имя обложки,
                                                             mBin[0].insertAdjacentElement("beforeBegin", mBin[i]);   //  переставляем раздел найденного файла в начало группы,
                                                             mutatio = true;                                                                                        //  отмечаем это
                                                             break;                                                                                                         //  и выходим из цикла для массива с вложенными файлами.
                                                             }
                                     if (k != 1)  mCover[0].insertAdjacentElement("afterEnd", mCover[k]);   //  Затем, если обложка не стоит в начале списка... переставляем её.
                                     count_Cover++;                                                //  Увеличиваем счетчик
                                     break;                                                                  //  и выходим из цикла.
                                     }
                     }
             }
     }

 CoverAdd(mDesc.tiCover, "cover");             //  Установка обложки в разделе "tiCover" (основная обложка)
 CoverAdd(mDesc.stiCover, "cover_src");   //  Установка обложки в разделе "stiCover" (обложка оригинала)

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 ///  ОБНОВЛЕНИЕ :  кнопки сохранения файлов и кнопки просмотра изображений

 var binAll;                                        //  Все разделы внутри одного из разделов "DIV".
 var saveButton;                            //  Один из узлов с кнопкой сохранения.
 var Dims;

 ImagesInfo=[];                       //  Очистка действующего массива "ImagesInfo".

 if (mutatio)  mBin = Binobj.getElementsByTagName("DIV");  //  Если порядок разделов в "Binobj" был изменен, пересоздаем массив с узлами "DIV".

 for (k=0; k<lengthBin; k++) {                //  Просмотр всех разделов с файлами по очереди.
         binAll = mBin[k].all;
         fileName = binAll.id.value;                           //  Получение имени файла.
         // Перезапись кнопок сохранения
         saveButton = binAll.save;                             //  Получение раздела "BUTTON" с кнопкой сохранения файла.
         if (saveButton) {                                                                                                                 //  Если такой раздел есть...
                 saveButton.onclick = "SaveImage(\'fbw-internal:#"+fileName+"\');";  // перезаписываем обращение к функции сохранения "SaveImage",
                 saveButton.outerHTML = saveButton.outerHTML;                            //  перезаписываем весь раздел
                 count_Bin++;                                                                                          //  и увеличиваем счетчик.
                 }
         // Перезапись "ImagesInfo" (для кнопок просмотра)
         if (binAll.dims) {                                                               //  Если для файла указаны габариты изображения...
                 var ImageInfo = {};                                                        //  создаем новый объект,
                 ImageInfo.src = "fbw-internal:#" + fileName;   //  добавляем в него атрибут "src" (имя иллюстрации),
                 ImageInfo.id = fileName;                                          //  аттрибут "id" (имя файла),
                 Dims = window.external.GetImageDimsByData(mBin[k].base64data);   //  получаем габариты изображения "[ширина]x[высота]",
                 ImageInfo.width = Dims.replace(/x\d+/, "");    //  добавляем в объект атрибут "width" (ширина изображения),
                 ImageInfo.height = Dims.replace(/\d+x/, "");   //  добавляем в объект атрибут "height" (высота изображения)
                 ImagesInfo.push(ImageInfo);                                 //  и добавляем собранный объект в массив "ImagesInfo".
                 }
         }

 window.external.EndUndoUnit(document);    // Конец записи в систему отмен.

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


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Подсчет чистого компьютерного времени, потраченного на обработку

 var Tf=new Date().getTime();    //  фиксация времени окончания работы скрипта
  var tempus=0;

 var T2=Tf-Ts;                //  время работы скрипта  (в миллисекундах)
 var Tmin  = Math.floor((T2)/60000);   //  Целое число минут.
 var TsecD = ((T2)%60000)/1000;       //  Число секунд с дробной частью.
 var Tsec = Math.floor(TsecD);                //  Целое число секунд.

 if (Tmin == 0)   //  Если действие скрипта продолжалось меньше минуты...
         tempus = (+(TsecD+"").replace(/(.{1,5}).*/g, "$1")+"").replace(".", ",")+" сек";   //  выбираем не больше пяти первых символов в счетчике секунд.
     else {                                                        //  А если минуту или больше...
             tempus = Tmin+" мин";               //  записываем минуты,
             if (Tsec !=0)                                        //  и если есть целое значение секунд,
                     tempus += " " + Tsec+ " с" }   //  то добавляем секунды.

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// Демонстрационный режим "Показать все строки"

var VseStroki_on_off = 0;      // 0 ; 1 //      ("0" — отключить, "1" — включить)

 var d=0;
 if (VseStroki_on_off ==1)  d="показать всё";

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Сборка массива с результатами обработки

 var mSt=[];   //  Массив строк с результатами обработки.
 var ind=0;    //  Индекс элемента массива.

                 mSt[ind]=" "+ScriptName+" v."+NumerusVersion;  ind++;
                 mSt[ind]="------------------------------------------------------";  ind++;
 if (d)   { mSt[ind]=" Демонстрационный режим";  ind++ }
                 mSt[ind]="					   ";  ind++;
                 mSt[ind]="• Время выполнения  .  .  .  .  .  .  .  .	" + tempus;  ind++;
                 mSt[ind]="";  ind++;

 var cTaT=ind;

 if (count_Img != d)     { mSt[ind]="• Обновлено иллюстраций .  .  .  .  .	" + count_Img;  ind++ }
 if (count_Bin != d)      { mSt[ind]="• Обновлено вложений   .  .  .  .  .  .	" + count_Bin;  ind++ }
 if (count_Cover != d) { mSt[ind]="• Установлено обложек   .  .  .  .  .  .	" + count_Cover;  ind++ }

 if (cTaT==ind  ||  d)  { mSt[ind]="   >> Исправлений нет";  ind++; }

//  Сборка строк текущей даты и времени
 mSt[ind]="";  ind++;
 mSt[ind]="------------------------------------------------------";  ind++;
 mSt[ind]= "• "+currentDate+" • "+currentTime+" •";  ind++;

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------


                 /// ОКНО РЕЗУЛЬТАТОВ  :  Вывод окна результатов на экран

 var st2="";  //  текст результатов

 for  ( k=0; k!=ind; k++ )     //  Последовательный просмотр всех элементов массива строк с результатами обработки.
        st2+=mSt[k]+"\n";      //  Добавление элемента из массива.

  MsgBox (st2);   //  Вывод окна результатов на экран.

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------

}







