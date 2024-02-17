//======================================
//             Поиск разорванных предложений
//             Автор скрипта - jurgennt
//                                                Engine like AlxS™
//                                                                     17.11.2007…14.04.2008
//~~~~~~~~~~~~
// v.1.1 — второй параграф (z) просчитывается до последнего (z<ps.length)
//~~~~~~~~~~~~
// v.1.2 — предлагается поставить точку после вложенных кавычек-лапок var re4 (29.02.2008)
//~~~~~~~~~~~~
// v.1.3 — предлагается объединение после запятой (добавил левые кавычки после тире в диалогах) var re3 (04.03.2008)
//~~~~~~~~~~~~
// v.1.5 — баловство со статистикой (14.04.2008)
//~~~~~~~~~~~~
// v.1.6 — баловство со статистикой (16.12.2008)
//======================================
var VersionNumber="1.7";

function Run()
{
 var Ts=new Date().getTime();
 var Perenos=true;
 var PromptPerenos=true;       //выдавать запрос, считать ли все дефисы в конце строки – переносами
 
 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

 if (PromptPerenos) {
  Perenos=AskYesNo("               –= Jürgen Script =– \n\n   Будем считать дефисы в конце строк  \n                   ПЕРЕНОСАМИ?\n\n     Если «Да»,\nто скрипт прогонит все переносы автоматом,\nно потом нужно будет пройтись и в ручном\nрежиме, чтобы подобрать другие разрывы.");
 }

 var re0 = new RegExp("([^!…\\\?_][a-z0-9а-яё](</EM>|</STRONG>|</EM></STRONG>|</STRONG></EM>){0,1})(\\\s|"+nbspChar+"){0,}</P>\\\r\\\n<P>(\\\s|"+nbspChar+"){0,}((<EM>|<STRONG>|<EM><STRONG>|<STRONG><EM>){0,1}[«\\\"\\\-]{0,1}(\\\s|"+nbspChar+"){0,}[a-zа-яё]{1,}[^\\\)])","gm");
 var re0_ = "$1 $5";                         // ориентация на отсутствие препинаний в конце первого параграфа и на строчные в начале второго п.,
                                                      // где перед буквами могут находиться кавычки: «" и дефис
                                                      // предполагается автоматическое объединение

 var re00a = new RegExp("([а-я])-</P>\\\r\\\n<P>(\\\s|"+nbspChar+"){0,}([а-я])","gm");
 var re00a_ = "$1$3";                         // автоматический перенос DOS

 var re00 = new RegExp("([а-я])-</P>\\\r\\\n<P>(\\\s|"+nbspChar+"){0,}([а-я])","gm");
 var re00_ = "$1$3";                         // перенос DOS-текст – ориентация на дефис после строчной в конце первого параграфа и на строчные в начале второго п.,


 var re1 = new RegExp("([^!…\\\?_][a-z0-9А-яё,;—–\\\-\\\»\\\)IVX](</EM>|</STRONG>|</EM></STRONG>|</STRONG></EM>){0,1})(\\\s|"+nbspChar+"){0,}</P>\\\r\\\n<P>(\\\s|"+nbspChar+"){0,}((<EM>|<STRONG>|<EM><STRONG>|<STRONG><EM>){0,1}[«\\\(\\\[\\\"\\\-–—=]{0,1}(\\\s|"+nbspChar+"){0,}[a-z0-9а-яё\\\?\\\!…\\\"]+[^\\\)])","gm");
 var re1_ = "$1 $5";                         // ориентация на отсутствие точки в конце первого параграфа и на строчные в начале второго п.,
                                                      // где перед буквами и цифрами могут находиться кавычки: «", дефис и скобки: ([
                                                      // отключены скобки после первого символа второго п. дабы не цеплять пронумерованные списки

 var re2 = new RegExp("([a-zа-яё\\\d\\\w][\\\?!…»\\\"“](</EM>|</STRONG>|</EM></STRONG>|</STRONG></EM>){0,1})(\\\s|"+nbspChar+"){0,}</P>\\\r\\\n<P>(\\\s|"+nbspChar+"){0,}((<EM>|<STRONG>|<EM><STRONG>|<STRONG><EM>){0,1}[«\\\"\\\(\\\[\\\-–—\\\.,<]{0,1}(\\\s|"+nbspChar+"){0,}(\\\s|"+nbspChar+"){0,1}[a-zа-яё…\\\"«][a-zа-яё\\\d])","gm");
 var re2_ = "$1 $5";                         // здесь в конце строки может быть всё что угодно (например, прямая речь, потом тире и описание того, кто говорит),
                                                      // но опять же только не точка
                                                      // второй параграф может начинаться только с маленькой буквы, т.е. предполагается слияние

 var re3 = new RegExp("([^!\\\.\\\?…][\\\wа-яё»\\\-],{0,1}(</EM>|</STRONG>|</EM></STRONG>|</STRONG></EM>){0,1})</P>\\\r\\\n<P>((<EM>|<STRONG>|<EM><STRONG>|<STRONG><EM>){0,1}[«\\\"„\\\(…\\\[\\\-–—\\\.,]{0,1}(\\\s|"+nbspChar+"){0,1}«{0,1}[A-ZА-ЯЁ\\\d])","gm");
 var re3_ = "$1 $3";                         // ориентация на отсутствие точки в конце одного п. и на Прописные в начале второго —
                                                      // предполагается объединение параграфов

 var re4 = new RegExp("([\\\wа-яё]“{0,1}»{0,1}(</EM>|</STRONG>|</EM></STRONG>|</STRONG></EM>){0,1}),{0,1}$","gm");
 var re4_ = "$1.";                            // ориентация только на отсутствие точки в конце одной строки,
                                                      // которую и предполагается поставить, а может заменить на неё запятую

 // визуализация части строки
 var re5 = new RegExp("(.*?)(.{1,50})$","gi");
 var re5_ = "… $2";                          // последние 50 знаков абзаца
 var re6 = new RegExp("^(.{1,50})(.+)","gi");
 var re6_ = "$1 …";                          // начальные 50 знаков абзаца

 var count=0;                                                     // всего замен
  var counta=0;                                                  // автомат
   var countr=0;                                                 // вручную
    var countt=0;                                                // замена точек


 var body=document.getElementById("fbw_body");
 if(!body) return;
 var divs=body.getElementsByTagName("DIV");
 if(!divs || divs.length==0){ MsgBox("\n В документе отсутствуют секции. \n\n"); return; }
 for(var i=0; i<divs.length; i++)
	{
if (divs[i].className=="section" && divs[i].parentNode.nodeName=="DIV" && divs[i].parentNode.className=="body")

		{
   var ps=divs[i].getElementsByTagName("P");
   if(!ps || ps.length==0) continue;


   for(var j=0; j<ps.length; j++)
			{
   var z=j+1;
         if( z<ps.length)
				{

  if (ps[j].parentNode.className!="title" && ps[z].parentNode.className!="title" && ps[j].parentNode.className!="epigraph" && ps[z].parentNode.className!="epigraph" && ps[j].parentNode.className!="annotation" && ps[z].parentNode.className!="annotation" && ps[j].className!="text-author" && ps[z].className!="text-author" && ps[j].parentNode.className!="stanza" && ps[j].className!="subtitle" && ps[j].parentNode.className!="cite")
                                 // Игнорирование заголовков, эпиграфов, аннотаций, автора (оба параграфа), подзаголовков и стихов (только первый)
	{
         var s1=ps[j].outerHTML;
         var s2=ps[z].outerHTML;
         var ss=s1+s2;
         var v1=ps[j].innerHTML;
         var v2=ps[z].innerHTML;
                   var vis1 = v1.replace(re5, re5_);
                   var vis2 = v2.replace(re6, re6_);
                               var propusk="";               // вместо второго параграфа, уже объединенного с первым, хочу записать пустое место

//         var vvv=ps[j].outerHTML;  MsgBox ("i:" +i+ "  j: " +j+"  z: " +z+ "\n\n" +vvv+ "")

// variant N°0                                         // автомат — бесспорные замены
 var m0 = ss.search(re0);                       // search - позиция совпадения от начала строки, нет совпадения: search=-1
                      if(m0!=-1)
                                                             //  ниже я предполагаю, что при нахождении совпадения произойдёт замена двух параграфов на один
					{ //GoTo(ps[j]);                    // смещение фокуса на искомый параграф (Отключено!)
                     ss=ss.replace(re0, re0_);                      // конец замены 2 в 1 
     ps[j].outerHTML=ss; ps[z].outerHTML=propusk;       // записал вместо двух строк одну (вторая — пустая)
                                   counta=counta+1;                   // заменил — счётчик накрутил
                                                     j--;                       //  и уменьшил номер строки
					}

	else {
   if (Perenos) {
// variant N°00a                                  // автомат — слияние двух строк с удалением дефиса после строчной в конце строки и перед в начале
 var m00a = ss.search(re00a);
                      if(m00a!=-1)
					{ //GoTo(ps[j]);                    // смещение фокуса на искомый параграф (Отключено!)
                     ss=ss.replace(re00a, re00a_);
     ps[j].outerHTML=ss; ps[z].outerHTML=propusk;
                                   counta=counta+1;
                                                     j--;
					}
				}

	else {                                                // если не сработал нулевой вариант, то запускается еще один нулевой вариант, но уже интерактивный
// variant N°00
 var m00 = ss.search(re00);
                      if(m00!=-1)
					{ GoTo(ps[z]);
  if(AskYesNo(" 1. Объединить параграфы, перенос?                                      р:" +countr+ " а:" +counta+ " т:" +countt+ " \n\n" +vis1+ "\n                                       >>>     <<< \n     " +vis2+ "\n")==true)
						{
                     ss=ss.replace(re00, re00_);
     ps[j].outerHTML=ss; ps[z].outerHTML=propusk;  countr=countr+1;   j--;
						}
					}


	else {                                                // если не сработал нулевой вариант, то запускается первый вариант, уже интерактивный
// variant N°1
 var m1 = ss.search(re1);
                      if(m1!=-1)
					{ GoTo(ps[z]);
  if(AskYesNo(" 1. Объединить параграфы?                                      р:" +countr+ " а:" +counta+ " т:" +countt+ " \n\n" +vis1+ "\n                                       >>>     <<< \n     " +vis2+ "\n")==true)
						{
                     ss=ss.replace(re1, re1_);
     ps[j].outerHTML=ss; ps[z].outerHTML=propusk;  countr=countr+1;   j--;
						}
					}

	else {                                               // если не сработал вариант №1, то запускается второй вариант
//  variant N°2
 var m2 = ss.search(re2);
                      if(m2!=-1)
					{   GoTo(ps[z]);
  if(AskYesNo(" 2. Объединить параграфы?                                      р:" +countr+ " а:" +counta+ " т:" +countt+ " \n\n" +vis1+ "\n                                       >>>     <<< \n     " +vis2+ "\n")==true)
						{
                     ss=ss.replace(re2, re2_);
     ps[j].outerHTML=ss; ps[z].outerHTML=propusk;  countr=countr+1;  j--;
						}
					}


		else {                                           // если не сработал вариант №2, то запускается третий — хитрый:
                                                           // он сначала предложит поставить точку, а потом — слить параграфы
//  variant N°3
 var m3 = ss.search(re3);
 var m4 = v1.search(re4);
                      if(m3!=-1 || m4!=-1)       // двойной фильтр: 3-й или 4-й
								{  GoTo(ps[z]);
                         if(m4!=-1)                   // фильтрация — только по четвёртому регэкспу
									{
  if(AskYesNo(" Поставить в конце первого параграфа точку?                   р:" +countr+ " а:" +counta+ " т:" +countt+ " \n\n" +vis1+ "\n                                               • • • \n     " +vis2+ "\n")==true)
										{
                     v1=v1.replace(re4, re4_);
     ps[j].innerHTML=v1;  countt=countt+1; continue;
										}
									}
  if ( ps[z].parentNode.className=="cite" || ps[z].parentNode.className=="stanza" || ps[z].className=="subtitle" || m3==-1 ) { continue; }
                                                            // фильтрация — только по третьему регэкспу, а также
                                                            // в случае попадания второго абзаца в стихи, цитату или в подзаголовок, предлагать слияние с ними не надо
				else {
  if(AskYesNo(" 3. Объединить параграфы?                                      р:" +countr+ " а:" +counta+ " т:" +countt+ " \n\n" +vis1+ "\n                                       >>>     <<< \n     " +vis2+ "\n")==true)
												{
                     ss=ss.replace(re3, re3_);
     ps[j].outerHTML=ss; ps[z].outerHTML=propusk;   countr=countr+1;  j--;
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
}
 count=counta+countr+countt;                      // итого

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

// вывод статистики, если она, конечно, есть
 var st2="";

 if (counta!=0 || countr!=0 || countt!=0 )   {st2+='     Статистика'}


 if (counta!=0)   {st2+='\n• автослияние разрывов: ……… '+counta;}
 if (countr!=0)   {st2+='\n• ручная коррекция: ………………… '+countr;}
 if (countt!=0)   {st2+='\n• конечные точки абзаца: ……… '+countt;}


 MsgBox ('           –= Jürgen Script =– \n'+
        '«Поиск разорванных предложений»   \n'+
        '                      v.'+VersionNumber+'     \n\n'+
        '    '+st2+'\n'+
        '       Произведено замен: ………… ' +count+'\n\n'+

        '   Время исполнения: ' +TimeStr+ '.\n' ); 

//  GoTo(divs[0]); 
}