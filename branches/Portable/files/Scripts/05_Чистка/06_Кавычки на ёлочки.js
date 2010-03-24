//========================================
// Скрипт замены кавычек на елочки и лапки
//========================================
var VersionNumber="1.2+";

//здесь можно настроить вид кавычек первого и второго уровня вложения
//(т.е. как они будут выглядеть после замены скриптом)
var left_quote_1="«";
var right_quote_1="»";
var left_quote_2="„"; 
var right_quote_2="“"; 
//если true - делаем кавычки третьего и более уровней, как кавычки второго уровня
//если false - выдаем сообщение об ошибке
var IgnoreThirdLevelQuotes=false;
//если true - делаем кавычки нулевого уровня, как кавычки первого уровня
//если false - выдаем сообщение об ошибке
var IgnoreZeroLevelQuotes=false;

function Run()
{
 var Ts=new Date().getTime();
//счетчик замен на левые лапки
 var lcount = 0;
//счетчик замен на правые лапки
 var rcount = 0;
//счетчик уровня кавычности, т.е. уровня вложенности кавычек
var kavychnost=0;
var left_quote_1_cnt=0;
var right_quote_1_cnt=0;
var left_quote_2_cnt=0;
var right_quote_2_cnt=0;
var all_quotes_cnt=0;

 var body=document.getElementById("fbw_body");
 if(!body) return;
 var divs=body.getElementsByTagName("DIV");
 if(!divs || divs.length==0){ MsgBox("\nDocument has no sections. \n\n"); return; }
 var s=body.innerHTML;
 var re0  = new RegExp("[„“”«»]","gi");
 var re0_ = '"'; 
 var m0 = s.search(re0);
 if (m0!=-1) { s=s.replace(re0,re0_);}
 body.innerHTML=s;
 for(var i=0; i<divs.length; i++)
 {
  if(divs[i].className=="section"||divs[i].className=="annotation"||divs[i].className=="history")
  {
   var ps=divs[i].getElementsByTagName("P");
   if(!ps || ps.length==0) continue;
   for(var j=0; j<ps.length; j++)
   {
    var PoraNaVyhod = false;
    var s=ps[j].innerHTML;

//в s2 будем посимвольно накапливать вид абзаца после замены кавычек
var s2="";
//intag - флаг, находимся ли мы внутри тэга
var intag=false;
var intag1=false;
var intag2=false;
var founded_ch2_not_in_tag=false;
// в ch будем хранить текущий (анализируемый) символ абзаца, который в s
// инициализируем пробелом, чтобы он на первой итерации попал в ch1
var ch=" ";
// в slen храним длину абзаца
var slen=s.length;
// если абзац не пустой, инициализируем ch2 первым его символом, чтобы
// на первой итерации он попал в ch
var ch2="";
if (slen>0) {var ch2=s.substring(0,1)}
var ch2_=ch2;
if (ch2_=="<") {intag2=true}
var ch1_="";
//делаем цикл - по итерации для каждого символа абзаца
//в iii - номер текущего cимвола
for (var iii=0; iii<slen; iii++) {
  //получаем ch1 из ch предыдущей итерации
  //на первой итерации ch1 для простоты будет равно пробелу
  ch1_=ch;
  if (ch1_=="<") {intag1=true}  
  if (!intag1) {ch1 = ch1_}
  if (ch1_==">") {intag1=false}  
  //текущий ch - это ch2 прошлой итерации. т.е. символ, который на прошлой итерации
  //был "следующим за текущим", теперь становится текущим. (экономим вызов substring)
  ch = ch2_;
  // если встретили кавычку и не находимся внутри тэга, то...
  //ch2 - это символ после ch
  //если ch последний символ абзаца, присвоим для простоты ch2 значение пробел
  var ch2_=" ";
  if (iii<s.length-1) {ch2_=s.substring(iii+1,iii+2)}  
  if (!intag2) {
   ch2 = ch2_;
  }
  if (ch2_=="<") {intag2=true}
  if (ch2_==">") {
   intag2=false;
   founded_ch2_not_in_tag=false;
  }
  if (!intag2) {ch2pos=iii+1}
  if (intag2&&!founded_ch2_not_in_tag) {
   var ggg=iii+1;
   var intag_tmp=true;
   while (ggg<s.length && (intag_tmp || s.substr(ggg,1)=="<")) {
    if (s.substr(ggg,1)=="<") {intag_tmp=true;}
    if (s.substr(ggg,1)==">") {intag_tmp=false;}    
    ggg++;
   }
   ch2=s.substr(ggg,1);
//   MsgBox("InsideIf\ns до ch2: '"+s.substring(0,ggg)+"'\nch2: '"+ch2+"'");
//   ch2pos=ggg;
   if (ggg<=s.length-6 && s.substr(ggg,6)=="&nbsp;") {ch2=" ";}   
   founded_ch2_not_in_tag=true;
  }
  if (!intag2) {
   if (ch2=="&") {
     if (ch2pos<=s.length-6 && s.substr(ch2pos,6)=="&nbsp;") {ch2=" ";}
   }    
  }
//  if (!AskYesNo("iii: '"+iii+"'\nch1+ch+ch2: '"+ch1+ch+ch2+"'\nch1_+ch+ch2_: '"+ch1_+ch+ch2_+"'"+"'\nintag1: "+intag1+"\nintag2: "+intag2)) {return};
  // надо еще учесть возможный &nbsp;
  if (ch1==";") {
    if (iii>5 && s.substr(iii-6,6)=="&nbsp;") {ch1=" ";}
  }
  // если текущий символ знак меньше, значит попали внутрь тэга - меняем флаг
  if (ch=="<" ) {intag=true}
  // встретив знак больше, понимаем, что тэг закончился
  if (ch==">") {intag=false}  
  if ((ch=='"'||ch=="«"||ch=="„"||ch=="»"||ch=="“"||ch=="”")&&(!intag)) {
   all_quotes_cnt++;
   var  transform_into_left=false;
   var  transform_into_right=false;    
   if (ch1==" " ||
       ch1=="(" ||
       ch2=="(" ||
       (ch2>="а" && ch2<="я") ||
       (ch2>="А" && ch2<="Я") ||
       (ch2>="0" && ch2<="9") ||
       ch2=="Ё"||
       ch2=="ё")
   {transform_into_left=true}

   if (ch2==" " ||
       ch2==")" ||
       ch2=="," ||
       ch1==")" ||
       ch2=="!" ||
       ch1=="." ||
       ch2=="." ||
       ch1=="!" ||
       ch1=="?" ||
       ch2==";" ||
       ch2=="?" ||
       (ch1>="а" && ch1<="я") ||
       (ch1>="А" && ch1<="Я") ||
       (ch1>="A" && ch1<="Z") ||
       (ch1>="0" && ch1<="9") ||
       ch1=="Ё" ||
       ch1=="ё" || 
       ch1=="°" ||
       ch1=='…' ||
       (ch1=="…" && ch2=='"') ||
       (ch1=="…" && ch2=='[') ||
       (ch1>="a" && ch1<="z" && ch2=='…') ||
       (ch1>="a" && ch1<="z" && ch2=='[') ||
       ((ch1=="ї" || ch1=="ï") && ch2=='…'))
    {transform_into_right=true}
  
   //данным условием проверяем, следует ли заменять встреченную кавычку на левые лапки
   if (transform_into_left&&!transform_into_right) {
     kavychnost++;
     if (kavychnost==1) {ch=left_quote_1; lcount++; left_quote_1_cnt++;}
     if (kavychnost==2 || (kavychnost>=3 && IgnoreThirdLevelQuotes)) {
       ch=left_quote_2; lcount++; left_quote_2_cnt++;
     }
     if (kavychnost>=3 && !IgnoreThirdLevelQuotes) {
       GoTo(ps[j]);
       if (!AskYesNo("                        –= Sclex Script =– \n\nВстретились кавычки третьего уровня вложенности.\n\nПродолжить обработку?")) {
        PoraNaVyhod=true;
       } else {
        ch=left_quote_2; lcount++; left_quote_2_cnt++; 
       }
     }
     //т.к. сделали замену, изменяем счетчик замен
   }
   //теперь проверяем, следует ли заменять кавычку на правые лапки
   else if (!transform_into_left&&transform_into_right) {
     if (kavychnost<=0 && IgnoreZeroLevelQuotes) { kavychnost=1; }
     if (kavychnost==0 && !IgnoreZeroLevelQuotes) {
      GoTo(ps[j]);
      if (!AskYesNo("              –= Sclex Script =– \n\nВстретилась закрывающая кавычка\nбез соответствующей открывающей.\n\n               Продолжить обработку?")) {
       PoraNaVyhod=true;
      } else {
       kavychnost=1;
      }
     }     
     if (kavychnost==1) {ch=right_quote_1; rcount++; right_quote_1_cnt++;}
     if (kavychnost>=2) {ch=right_quote_2; rcount++; right_quote_2_cnt++;}
     kavychnost--;
   }
// обработаем случай, когда кавычка не подпадает под правила для замены на левую и правую    
   else {
    GoTo(ps[j]);
    if (!AskYesNo("                 –= Sclex Script =– \n\nНепонятно, во что преобразовать кавычки!\n\nСимвол до кавычки: "+ch1+"\nСимвол после кавычки: "+ch2+"\n\nПродолжить обработку?")) {
     PoraNaVyhod=true;
    }       
   }    
  }
  s2=s2+ch;
  //ch1 присвоим текущему символу, чтобы не вызывать лишний раз функцию подстроки
  //(мот так быстрее?)
//  ch1 = ch;
}
ps[j].innerHTML=s2;
if (PoraNaVyhod) {return}

   }
  }
 }
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

// вывод предупреждения
 var st2="";
 var l1=left_quote_1_cnt;
 var r1=right_quote_1_cnt;
 var l2=left_quote_2_cnt;
 var r2=right_quote_2_cnt;
 var sm1=left_quote_1_cnt+right_quote_1_cnt;
 var sm2=left_quote_2_cnt+right_quote_2_cnt;
 var drb=sm1/sm2;

 if (l1!=r1)   {st2+='\n• Несоответствие «ёлочек»!!!\n'}
 if (l2!=r2)   {st2+='\n• Несоответствие „лапок“!!!\n'}
 if (sm1>100 && sm2>2 && drb<5)   {st2+='\n• Многовато „лапок“?!!\n'}

//MsgBox("\nl1 = " +l1+ "\n r1 = " +r1+ "\n l2 = " +l2+ "\n r2 = " +r2+ "\n sm1 = " +sm1+ "\n sm2 = " +sm2+ "\n drb = " +drb);

 MsgBox('            –= Sclex Script =– \n'+
             '      "Кавычки" на «ёлочки» v.'+VersionNumber+'\n\n'+

             ' Заменено л-кавычек уровня 1:	'+left_quote_1_cnt+'	\n'+
             ' Заменено п-кавычек уровня 1:	'+right_quote_1_cnt+'\n'+
             ' Заменено л-кавычек уровня 2:	'+left_quote_2_cnt+'\n'+
             ' Заменено п-кавычек уровня 2:	'+right_quote_2_cnt+'\n'+
             '    ————————————————————    \n'+
             ' Всего замен Л-кавычек:  		'+lcount+'\n'+
             ' Всего замен П-кавычек:  		'+rcount+'\n\n'+

             ' Суммарное количество:		'+all_quotes_cnt+'\n'+
             ' Из них заменено:    		'+(lcount+rcount)+'\n'+

             ' '+st2+' '+

             '\n Время: '+TimeStr+'.');
}

