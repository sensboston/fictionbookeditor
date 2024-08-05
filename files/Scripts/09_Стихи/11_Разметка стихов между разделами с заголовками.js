// Скрипт «Разметка стихов между разделами с заголовками» для редактора Fiction Book Editor (FBE).
// // Версия 1.19.
// Автор stokber.
//
function Run() {
	var version = 1.19;
	
	var fbwBody = document.getElementById("fbw_body");
	var body = fbwBody.firstChild;
	while(body && body.className != "body") body = body.nextSibling;
	
	// проверка наналичие тегов с "id" и "style":
	var countId = (body.innerHTML.match(/<(P|DIV) id=[^>]+?>/g) || []).length;
		if(countId != 0) {
			alert("В документе найдено "+countId+" тегов с атрибутом 'id'. Скрипт не работает с такими тегами. Стихи, окружённые ими размечены не будут.");
			// return true;
	}
	var countStyle = (body.innerHTML.match(/<(P|DIV) [^>]*style=[^>]+>/g) || []).length;
		if(countStyle != 0) {
			alert("В документе найдено "+countStyle+" тегов с атрибутом 'style'. Скрипт не работает с такими тегами. Стихи, окружённые ими размечены не будут.");
			// return true;
	}
	
	var question1 = "Размечать ли стихами фрагменты текста примыкающие к картинкам?";
	var questImages = confirm(question1);
	var question2 = "Удалять ли курсив (жирность) из СТРОК С ДАТИРОВКОЙ СТИХОВ, если вся строка изначально ими сделана?";
	var questFont = confirm(question2);
	var question3 = "Расформатировать ли внутрисекционные подзаголовки-звёздочки, кроме находящихся:\n в начале раздела;\nсразу за заголовком раздела;\nсразу за датами стихотворений?";
	var questAst = confirm(question3);
	var colStr = prompt("Введите минимальное количество строк, которое скрипт будет считать стихом.", 3);
	if(colStr == null) {alert("Вы отменили запуск скрипта\n«Разметка стихов между разделами с заголовками» v."+version+".\n\nСтихи размечены не будут."); return true}
	
	var Ts=new Date().getTime();
	var TimeStr=0; // засечем время начала выполнения
	
	try {
		var nbspChar = window.external.GetNBSP();
		var nbspEntity;
		if(nbspChar.charCodeAt(0) == 160) nbspEntity = "&nbsp;";
		else nbspEntity = nbspChar;
	} catch(e) {
		var nbspChar = String.fromCharCode(160);
		var nbspEntity = "&nbsp;";
	}

	var poemCountStart;
	var stanzaCountStart;
	var authorCountStart;
	var colSymbStrMin = 1; // мин. кол. символов в строке HTML (включая теги, кроме начальных и конечных strong\em).
	var colSymbStrMaxHtml = 400; // макс. кол. символов в строке HTML (включая теги, кроме начальных и конечных strong\em и &nbps; посимвольно.
	var colSymbStrMaxText = 80; // макс. кол. символов в строке (без тегов).
	// метка конца документа:
	var labelEnd = "<D>%ьЪЬъЬ%ъьЪЬ%</D>";
	// var ast = "[*] [*] [*]"; // строка из звёздочек с пробелами.
	// var ast = "(?:<(?:EM|STRONG)>)*(?:[ ]*[*][ ]*)+(?:</(?:EM|STRONG)>)*"; // 
	var ast = "(?:<(?:EM|STRONG)>)*(?:(?:\\s|"+nbspEntity+")*[*](?:\\s|"+nbspEntity+")*)+(?:</(?:EM|STRONG)>)*"; // 
	var empty_Line = "(?:<P>&nbsp;</P>\\r\\n)*";
	
	// ======================================================
	
	if(questImages == true) {
		// два регекспа без оформления с картинками и два ниже без картинок:
		var beforePoem = "<DIV class=title>(?:\\r\\n<P>.+</P>){1,5}</DIV>|<P class=subtitle>.+?</P>|<DIV class=section>|<DIV class=epigraph>(?:\\r\\n<P>.+?</P>)+(?:\\r\\n<P class=text-author>.+?</P>)*</DIV>|<DIV onresiz.+?</DIV>";
		var afterPoem = "\\r\\n((?:<P>[^\\r\\n©@]{" + colSymbStrMin + "," + colSymbStrMaxHtml + "}?\\r\\n){" + colStr + ",})(?!<DIV onrezistart|<DIV class=(title|poem|stanza|cite|epigraph)>)(?=<DIV class=section>|<DIV class=title>|<DIV class=body|<P class=subtitle>|<DIV id=fbw_updater style|<DIV onresiz.+?</DIV>|$)";
		} else {
		var beforePoem = "<DIV class=title>(?:\\r\\n<P>.+</P>){1,5}</DIV>|<P class=subtitle>.+?</P>|<DIV class=section>|<DIV class=epigraph>(?:\\r\\n<P>.+?</P>)+(?:\\r\\n<P class=text-author>.+?</P>)*</DIV>|<DIV class=onresiz.+?</DIV>";
		var afterPoem = "\\r\\n((?:<P>[^\\r\\n©@]{" + colSymbStrMin + "," + colSymbStrMaxHtml + "}?\\r\\n){" + colStr + ",})(?!<DIV onrezistart|<DIV class=(title|poem|stanza|cite|epigraph)>)(?=<DIV class=section>|<DIV class=title>|<DIV class=body|<P class=subtitle>|<DIV id=fbw_updater style)";
	}
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	
	var beforeEpigraph = "<DIV class=epigraph>(?:\\r\\n<P>.+?</P>)+(?:\\r\\n<P class=text-author>.+?</P>)*</DIV>";
	var data = "(?:<(?:EM|STRONG)>)*(?:.*\\D)?(?:1[789][0-9][0-9]|20[0-2][0-9])(?!(?:[0-9]| год[а-я]|[-](?:й|е|х|м|го)))(?:.*[^.])?(?:</(?:EM|STRONG)>)*" //
	
	function counterBefore() {
		var sel = document.getElementById("fbw_body");
		var fromHTML = sel.innerHTML; // код документа.
		// alert(fromHTML);
		poemCountStart = (fromHTML.match(/<DIV class=poem>/g) || []).length;
		stanzaCountStart = (fromHTML.match(/<DIV class=stanza>/g) || []).length;
		authorCountStart = (fromHTML.match(/<P class=text-author>/g) || []).length;
	}
	
	// миллисекунды в секунды:
	function secToMsec() {
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
 else { if (Thour>=1)                    TimeStr=Thour+ " ч " +Tmin+ " мин " +Tsec+ " с" }}}}}
	}
	
	function counterAfter() {
		var sel = document.getElementById("fbw_body");
		var fromHTML = sel.innerHTML; // код документа
		var poemCountEnd = (fromHTML.match(/<DIV class=poem>/g) || []).length;
		var stanzaCountEnd = (fromHTML.match(/<DIV class=stanza>/g) || []).length;
		var authorCountEnd = (fromHTML.match(/<P class=text-author>/g) || []).length;
		var poemCount = poemCountEnd - poemCountStart;
		var stanzaCount = stanzaCountEnd - stanzaCountStart;
		var authorCount = authorCountEnd - authorCountStart;
		secToMsec();
		alert("Размечено:\nСтихов: " + poemCount + "\nСтроф: " + stanzaCount + "\nДат: " + authorCount + "\n\nВремя выполнения скрипта: "+TimeStr+"\n\n«Разметка стихов между разделами с заголовками» v." + version);
	}
	
	// функция определения количества символов самой длинной строки (Text) в фрагменте:
	function findLongestStringLength(txt) {
		txt = txt.replace(/<[^>]*>/g, ""); // Удаление HTML-тегов
		txt = txt.replace(/^&nbsp;$/g, ""); // 
		txt = txt.replace(/&nbsp;/g, " "); // 
		var txtSplit = txt.split("\r\n");
		var longestLength = 0;
		for(var i = 0; i < txtSplit.length; i++) {
			if(txtSplit[i].length > longestLength) {
				longestLength = txtSplit[i].length
			}
		}
		return longestLength;
	}

	function zamena() {
		// проставить метку конца документа:
		body.innerHTML = body.innerHTML.replace(new RegExp("(.|[\\r\\n])+", "i"), "$&<P class=subtitle>" + labelEnd + "</P>");

		if(questAst == true) {
		//разбираемся с подзаголовками-звёздочками:
		//вплотную к дате:
		body.innerHTML = body.innerHTML.replace(new RegExp("(<P>"+data+"</P>)\\r\\n"+empty_Line+"(<P class=subtitle>)("+ast+")</P>", "mgi"), "$1$2%$3%</P>");
		//вплотную к разделу:
		body.innerHTML = body.innerHTML.replace(new RegExp("(<DIV class=section>)\\r\\n"+empty_Line+"(<P class=subtitle>)("+ast+")</P>", "mgi"), "$1$2%$3%</P>");
		//вплотную к заголовку:
		body.innerHTML = body.innerHTML.replace(new RegExp("(<DIV class=title>(?:\\r\\n<P>.+</P>){1,5}</DIV>)\\r\\n"+empty_Line+"(<P class=subtitle>)("+ast+")</P>", "mgi"), "$1$2%$3%</P>");
		body.innerHTML = body.innerHTML.replace(new RegExp("(<P class=subtitle>)("+ast+")</P>", "gi"), "<P>=$2=</P>");
		}
		
		// проставить теги poem: 
		body.innerHTML = body.innerHTML.replace(new RegExp("(" + beforePoem + ")(" + afterPoem + ")", "igm"), function(match, p1, p2) {
			var txt = p2;
			// alert(txt);
			findLongestStringLength(txt);
			// alert(txt);
			// ++++++++++++++++++++++++++++++++++++++++++++++++++++
			// убираем пустые строки из подсчета минимального кол. строк  предполагаемого стиха:
			var colLine = txt.split("\r\n").length - 2;
			// alert(colLine);
			var colEmptyLine = (txt.match(/<P>&nbsp;<\/P>/g) || []).length;
			// alert(colEmptyLine);
			if(colLine < colStr + 2 && colLine - colEmptyLine < colStr) {
			return match.replace(new RegExp(".", "i"), "$&"); 
			}
			// --------------------------------------------------------------------------------------------
			
			if(findLongestStringLength(txt) < colSymbStrMaxText) {
				return match.replace(new RegExp("(.|[\\r\\n])+", "igm"), p1 + "<DIV class=poem><DIV class=stanza>" + p2 + "</DIV></DIV>"); //
			} else return match.replace(new RegExp(".", "i"), "$&"); //
		});
		
		//=======================================================
		
		if(questAst = true) {
		// поправить звездочки внутри стихов:
		body.innerHTML = body.innerHTML.replace(new RegExp("<DIV class=poem>(.|[\\r\\n])+?</DIV>", "igm"), function(match) {
			return match.replace(new RegExp("<P>=("+ast+")=</P>", "ig"), "<P>$1</P>"); //
		});
		body.innerHTML = body.innerHTML.replace(new RegExp("<P>=("+ast+")=</P>", "gi"), "<P class=subtitle>$1</P>");
		body.innerHTML = body.innerHTML.replace(new RegExp("<P class=subtitle>%("+ast+")%</P>", "gi"), "<P class=subtitle>$1</P>");
		
				// обрамить пустыми строками обычные строки-звёздочки::
		body.innerHTML = body.innerHTML.replace(new RegExp("<DIV class=poem>(.|[\\r\\n])+?</DIV>", "igm"), function(match) {
			return match.replace(new RegExp("\\r\\n(?!<P>&nbsp;</P>)(<P>"+ast+"</P>)\\r\\n(?!<P>&nbsp;</P>)", "igm"), "<P>&nbsp;</P>$1<P>&nbsp;</P>"); //
		});
		}
		
		// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		
		// удалить начальные и конечные пустые строки:
		body.innerHTML = body.innerHTML.replace(new RegExp("<DIV class=poem>(.|[\\r\\n])+?</DIV>", "igm"), function(match) {
			return match.replace(new RegExp("<DIV class=stanza>\\r\\n<P>&nbsp;</P>", "igm"), "<DIV class=stanza>"); //
		});
		body.innerHTML = body.innerHTML.replace(new RegExp("<DIV class=poem>(.|[\\r\\n])+?</DIV>", "igm"), function(match) {
			return match.replace(new RegExp("\\r\\n<P>&nbsp;</P></DIV>", "igm"), "</DIV>"); //
		});
		// вставка пустой строки над датой:
		body.innerHTML = body.innerHTML.replace(new RegExp("<DIV class=poem>(.|[\\r\\n])+?</DIV>", "igm"), function(match) {
			return match.replace(new RegExp("(?:<P>&nbsp;</P>\\r\\n)?(<P>" + data + "</P>)", "igm"), "<P>&nbsp;</P>$1"); //
		});
		// новые строфы вместо пустых строк:
		body.innerHTML = body.innerHTML.replace(new RegExp("<DIV class=poem>(.|[\\r\\n])+?</DIV>", "igm"), function(match) {
			return match.replace(new RegExp("<P>&nbsp;</P>", "igm"), "</DIV><DIV class=stanza>"); //
		});
		// разметить даты и возможные строки ниже тегами "text-author":
		body.innerHTML = body.innerHTML.replace(new RegExp("(<DIV class=stanza>\\r\\n<P>" + data + ")</P>\\r\\n<P>(.+?</P>)</DIV>", "igm"), "$1</P></DIV><P class=text-author>$2");
		body.innerHTML = body.innerHTML.replace(new RegExp("<DIV class=stanza>\\r\\n<P>(" + data + ")</P></DIV>", "igm"), "<P class=text-author>$1</P>");
		// удалить метку конца body:
		body.innerHTML = body.innerHTML.replace(new RegExp("<P class=subtitle>" + labelEnd + "</P>", "i"), "");
		
		// ==============================================================
		
		if(questFont == true) {
			// удалить внешние EM/STRONG с дат стихотворений:
			body.innerHTML = body.innerHTML.replace(new RegExp("<DIV class=stanza>(.|[\\r\\n])+?</DIV></DIV>", "igm"), function(match) {
				return match.replace(new RegExp("<P class=text-author>(?:(?:<(?:EM|STRONG)>){1,2})([^<]+)((</(EM|STRONG)>){1,2})</P>", "img"), "<P class=text-author>$1</P>"); //
			});
		}
	}

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// =================================================================
	
	function correction() {
		// (подсмотрел у Александра Ка)
		// Замена кода н/р пробела на принятое обозначение в FBE
		// Устраняет небольшой глюк, который получается после вставки в FBE нескольких строк, или после некоторых скриптов
		var re211 = new RegExp("&nbsp;", "g");
		var re211_ = nbspChar;
		var count_211 = 0;
		// Чистка пустых строк от пробелов и внутренних тегов
		var re212 = new RegExp("^(\\\s|" + nbspEntity + "|<[^>]{1,}>){1,}$", "g");
		var re212ex = new RegExp("<SPAN class=image", "g");
		var re212_ = "";
		var count_212 = 0;

		function HandleP(ptr) {
			s = ptr.innerHTML;
			// Коррекция неразрывных пробелов
			if(nbspEntity != "&nbsp;" && s.search(re211) != -1) {
				count_211 += s.match(re211).length;
				s = s.replace(re211, re211_)
			}
			// Чистка пустых строк от пробелов и внутренних тегов
			if(s.search(re212) != -1 && s.search(re212ex) == -1) {
				s = s.replace(re212, re212_);
				count_212++
			}
			ptr.innerHTML = s;
		}
		var ptr = body;
		var ProcessingEnding = false;
		while(!ProcessingEnding && ptr) {
			SaveNext = ptr;
			if(SaveNext.firstChild != null && SaveNext.nodeName != "P" && !(SaveNext.nodeName == "DIV" && ((SaveNext.className == "history" && !ObrabotkaHistory) || (SaveNext.className == "annotation" && !ObrabotkaAnnotation)))) {
				SaveNext = SaveNext.firstChild;
			} // либо углубляемся...
			else {
				while(SaveNext.nextSibling == null) {
					SaveNext = SaveNext.parentNode; // ...либо поднимаемся (если уже сходили вглубь)
					// поднявшись до элемента P, не забудем поменять флаг
					if(SaveNext == body) {
						ProcessingEnding = true;
					}
				}
				SaveNext = SaveNext.nextSibling; //и переходим на соседний элемент
			}
			if(ptr.nodeName == "P") HandleP(ptr);
			ptr = SaveNext;
		}
	}
	
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	
	counterBefore();
	window.external.BeginUndoUnit(document, "Разметка стихов между разделами с заголовками");
	zamena();
	correction();
	window.external.EndUndoUnit(document);
	counterAfter();
}
