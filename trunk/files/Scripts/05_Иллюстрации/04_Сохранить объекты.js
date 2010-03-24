//======================================
// Save all binaries
//======================================

function Run()
{
 var Ts=new Date().getTime();
 var bin_objects=document.all.binobj.getElementsByTagName("DIV");

 if(bin_objects.length==0){
MsgBox('	–= Alex Saveliev Script =– \n\n'+
         'В этом документе нет бинарных объектов. \n\n'); return; }

 if(!AskYesNo('	–= Sclex Script =– \n\n'+
            'Подтвердите ваше желание извлечь все бинарные объекты \n'+
            'из этого документа и сохранить их рядом с книгой,\n'+
            'в тот же самом каталоге. \n\n')) return false;

 for(var i=0, cnt=0; i<bin_objects.length; i++)
 {
  var ret=window.external.SaveBinary(bin_objects[i].all.id.value, bin_objects[i].base64data);
  if(ret) cnt++;
 }


 var Tf=new Date().getTime();
 var Tmin = Math.floor((Tf-Ts)/60000);
 var Tsec = Math.ceil((Tf-Ts)/1000-Tmin*60);
 var Tsek = Math.ceil(10*((Tf-Ts)/1000-Tmin*60))/10;
 var Tssek = Math.ceil(100*((Tf-Ts)/1000-Tmin*60))/100;
 var Tsssek = Math.ceil(1000*((Tf-Ts)/1000-Tmin*60))/1000;
 if (Tssek<1 && Tmin<1)  var TimeStr=Tsssek+ " сек"
 else { if (Tsek<10 && Tmin<1)  var TimeStr=Tssek+ " сек"
 else { if (Tmin<1) var TimeStr=Tsek+ " сек"
 else if (Tmin>=1) var TimeStr=Tmin+ " мин " +Tsec+ " с" }}

 if(cnt==0)
  MsgBox('	–= Sclex Script =– \n\n'+
              ' Ни один бинарник не сохранён!\n\n'+
              'Возможно файлы уже существуют?   \n');
 else
  MsgBox('	–= Sclex Script =– \n\n'+
              'Было сохранено ' +cnt+ ' из ' +i+ ' бинарных объектов. \n\n'+
              'Время выполнения: '+TimeStr );
}

