// v.1.0  — ?
// v.1.1  — Александр Ка (15.09.2024)
// + Запись в систему отмен
// + Перезапись и обновление кнопок сохранения вложенных файлов
// + Перезапись "ImagesInfo" (для правильных размеров изображения при просмотре в режиме "D")

function Run() {

 var NumerusVersion = "1.1";
 var Ts=new Date().getTime();

window.external.BeginUndoUnit(document,"«Обновление иллюстраций» v."+NumerusVersion);           // начало записи в систему отмен

 var imgs=fbw_body.getElementsByTagName("IMG");
 for (var i=imgs.length-1; i>=0; i--) {
          var MyImg=imgs[i];
          var pic_id=MyImg.src;
          MyImg.src="";
          MyImg.src=pic_id;
         }

// FillCoverList();     // выбор файла cover. в качестве обложки -- (функция из "main.js") -- не работает

         // перезапись кнопок сохранения (режим "D" (Описание документа), раздел "Бинарные файлы")
 var mBin=binobj.getElementsByTagName("DIV");
 for (var i=mBin.length-1; i>=0; i--) {
         mBin[i].all.save.setAttribute("onclick","SaveImage(\'fbw-internal:#"+mBin[i].all.id.value+"\');");  // перезапись кнопок сохранения
         mBin[i].all.save.outerHTML=mBin[i].all.save.outerHTML;            //  обновление кнопок сохранения
         }

         // Перезапись "ImagesInfo"
 ImagesInfo=[];
 for (var i=mBin.length-1; i>=0; i--)
         if (mBin[i].all.dims) {
                 var ImageInfo = new Object();
                 ImageInfo.src = "fbw-internal:#" + mBin[i].all.id.value;
                 ImageInfo.id = mBin[i].all.id.value;
                 var Dims = window.external.GetImageDimsByData(mBin[i].base64data);
                 ImageInfo.width = Dims.replace(/x\d+/, "");
                 ImageInfo.height = Dims.replace(/\d+x/, "");
                 ImagesInfo.push(ImageInfo);
                 }


window.external.EndUndoUnit(document);    // конец записи в систему отмен

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Подсчет чистого компьютерного времени, потраченного на обработку


 var Tf=new Date().getTime();    //  фиксация времени окончания работы скрипта
  var tempus=0;

 var T2=Tf-Ts;                //  время работы скрипта  (в миллисекундах)
 var Tmin  = Math.floor((T2)/60000);
 var TsecD = ((T2)%60000)/1000;
 var Tsec = Math.floor(TsecD);

 if (Tmin ==0)
         tempus = (TsecD+"").replace(/(.{1,5}).*/g, "$1").replace(".", ",")+" сек";
     else {
             tempus = Tmin+" мин";
             if (Tsec !=0)
                     tempus += " " + Tsec+ " с" }

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



                 /// ОКНО РЕЗУЛЬТАТОВ  :  Вывод окна результатов на экран


        //  Вывод окна результатов
 MsgBox ("                                  –= ◊ =–\n"+
                   "    .:::: «Обновление иллюстраций» v."+NumerusVersion+" ::::.                      \n"+
                   "̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍ ̍"+"\n"+
                   "       • Время выполнения .  .  .  .  .  .	"+tempus);

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------

}











