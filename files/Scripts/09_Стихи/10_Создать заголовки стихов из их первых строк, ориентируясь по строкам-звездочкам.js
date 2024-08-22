// «Создать заголовки стихов из их первых строк, ориентируясь по
//строкам-звездочкам v.1.0» для редактора Fiction Book Editor (FBE).
// Версия 1.0.
// Автор stokber.
//
function Run() {
	var name = "Создать заголовки стихов из их первых строк, ориентируясь по строкам-звездочкам";
	var version = "1.0";
	var help = "Справка\n\nСкрипт предназначен для создания заголовков стихотворений, в которых эту роль выполняют строки состоящие обычно из звёздочек. Сценарий находит первую строку стихотворения и создаёт из неё заголовок. В книгах часто такие строки-звездочки используются не только как разделители отдельных стихов друг от друга. Часто ими могут отделяться и разделы не только стихов. Как правило, в сборниках стихов такое случается редко. Скрипт постарается из таких групп звёздочек не создавать заголовки. Определяет это он по длине строк — они не должны быть слишком длинными. Если в вашем документе после строки со звёздочками находятся короткие прозаические строки, то чтобы скрипт из них не создавал заголовки, можно увеличить количество строк, которые скрипт будет считать стихом. В самом крайнем случае придётся такие строки-звездочки оградить от действия скрипта, добавив в них любой символ отличный от звёздочки и пробела. Например:\n***#.\nИногда после строки со звёздочками идут не сразу стихи, а эпиграф к ним. В таком случае, перед тем как запустить этот скрипт, такие стихи, а вернее заголовки к ним придётся разметить вручную, иначе в заголовках окажется содержание первой строки эпиграфа. Есть также вариант пометить специальной меткой конец эпиграфа. По умолчанию это знак процента '%', проставленный в конце эпиграфа, в последней его строке. Также можно проставить и специальный знак автора эпиграфа в виде символа '@' в начале строк с именами авторов. В таком случае скрипт сам разметит эпиграфы их авторов.\nНо делать это  (расставлять такие метки) нужно очень аккуратно, чтобы не нарушить валидность документа. Помните, что эпиграф следует сразу за заголовком раздела, а имена авторов должны быть строго в последних строках эпиграфа. Например:\n\n***\nТоску и грусть, страданья, самый ад,\nВсё в красоту она преобразила.\n@Гамлет%\n\nЯ шел во тьме к заботам и веселью,\nВверху сверкал незримый мир духов.\nЗа думой вслед лилися трель за трелью\nНапевы звонкие пернатых соловьев…\n\n- - - - -\n\nЕсли вы выбрали форматирование Подзаголовками, то эпиграфы размечаться не будут.\n\n=============================\n\n«"+name+"» v."+version+".";
	
	var fbwBody = document.getElementById("fbw_body");
	var body = fbwBody.firstChild;
	while(body && body.className != "body") body = body.nextSibling;
	if(body == null) {
		alert("В документе не найдено ни одного раздела body. Скрипт завершает свою работу.");
		return true
	}
	MsgBox(help);
	
	var sIB = "<EM>|<STRONG>|<EM><STRONG>|<STRONG><EM>";
	var fIB = "</EM>|</STRONG>|</EM></STRONG>|</STRONG></EM>";
	var aIB = "<EM>|<STRONG>|<EM><STRONG>|<STRONG><EM>|</EM>|</STRONG>|</EM></STRONG>|</STRONG></EM>";
	
	var astNormCountStart; // кол.строк-звёздочек обычных до.
	var astSubTitleCountStart; // кол.строк-звёздочек подзаголовков до.
	var astCountStart; // кол.строк-звёздочек всего до.
	var epigCountStart; //  
	var authorCountStart; // 
	
	// проверка на наличие тегов с "id" и "style":
	var countId = (body.innerHTML.match(/<(P|DIV) id=[^>]+?>/g) || []).length;
	if(countId != 0) {
		alert("В документе найдено " + countId + " тегов с атрибутом 'id'. Скрипт не работает с такими тегами. Стихи, окружённые ими размечены не будут.");
		// return true;
	}
	var countStyle = (body.innerHTML.match(/<(P|DIV) [^>]*style=[^>]+>/g) || []).length;
	if(countStyle != 0) {
		alert("В документе найдено " + countStyle + " тегов с атрибутом 'style'. Скрипт не работает с такими тегами. Стихи, окружённые ими размечены не будут.");
		// return true;
	}
	
	var ast = "(?:(?:\\s|" + nbspEntity + "|" + aIB + ")*?[*](?:\\s|" + nbspEntity + "|" + aIB + ")*?)+"; // 
	var astNewRegexp = new RegExp("<P( class=subtitle)?>"+ast+"</P>", "g"); 
	astCountStart = (body.innerHTML.match(astNewRegexp) || []).length;		
	astNormCountStart = new RegExp("<P>"+ast+"</P>", "g"); // кол.строк-звёздочек обычных до.
	astSubTitleCountStart = new RegExp("<P class=subtitle>"+ast+"</P>", "g"); // кол.строк-звёздочек подзаголовков до.
	
	if(astCountStart == 0) {alert("В документе не найдено подходящих строк-звёздочек для создания заголовков стихов. Скрипт завершает свою работу."); return true;}
	
	// выбор 
	var question1 = "Создавать ли заголовки из обычных строк-звёздочек?";
	var questNormal = confirm(question1);
	var question2 = "Создавать ли заголовки из подзаголовков-звёздочек?";
	var questSubtitle = confirm(question2);
	
	if(questNormal == false && questSubtitle == false) {
			alert("Вы не выбрали источник заголовков.\nСкрипт завершает свою работу.\n\n«" + name + "» v." + version + ".");
			return true
	}
	if(questNormal == true && questSubtitle == false) {
		if(astNormCountStart.test(body.innerHTML) == false) {alert("В документе не найдено подходящих строк-звёздочек обычным текстом для создания заголовков стихов. Скрипт завершает свою работу.\n\n«" + name + "» v." + version + ".");
		return true
		}
	}
	if(questNormal == false && questSubtitle == true) {
	 if(astSubTitleCountStart.test(body.innerHTML) == false) {alert("В документе не найдено подходящих подзаголовков-звёздочек обычным текстом для создания заголовков стихов. Скрипт завершает свою работу.\n\n«" + name + "» v." + version + ".");
		return true
	 }
	}
	
	var question0 = "Выберите тип оформления: Заголовки или Подзаголовки. Кликните «Да», чтобы названия стихов по первой строке размечались как Заголовки разделов, или «Отмена», чтобы размечались как Подзаголовки.";
	
	var questTag = confirm(question0);
	
	while(colStr < 1 || /\D/.test(colStr) == true) {
		var colStr = prompt("Введите минимальное количество строк (целое число от 1 и больше, без пробелов по краям), которое скрипт будет считать стихом.", 4);
		// colStr = colStr.replace(/^\s+|\s+$/g, ""); // 
		if(colStr == null) {return true;}
	}	
	colStr--;	
		
	var str; // строка заголовка до.
	var str2; // строка заголовка после.
	var txt; // фрагмент начала текста стиха (несколько строк).
	var colSymbStrMin = 1; // мин. кол. символов в строке HTML (включая теги).
	var colSymbStrMaxHtml = 400; // макс. кол. символов в строке HTML (включая теги).
	var colSymbStrMaxText = 80; // макс. кол. символов в строке стиха (без тегов).
	var labelEpi = "%"; // метка конца эпиграфа.
	var labelAuthor = "@"; // метка начала строки Автор.
	try {
		var nbspChar = window.external.GetNBSP();
		var nbspEntity;
		if(nbspChar.charCodeAt(0) == 160) nbspEntity = "&nbsp;";
		else nbspEntity = nbspChar;
	} catch(e) {
		var nbspChar = String.fromCharCode(160);
		var nbspEntity = "&nbsp;";
	}
	
	var Ts = new Date().getTime();
	var TimeStr = 0; // засечем время начала выполнения.
	
	function counterBefore() {
		var sel = document.getElementById("fbw_body");
		var fromHTML = sel.innerHTML; // код документа.     
		astCountStart = (fromHTML.match(astNewRegexp) || []).length;		   
		epigCountStart = (fromHTML.match(/<DIV class=epigraph>/g) || []).length;
		authorCountStart = (fromHTML.match(/<P class=text-author>/g) || []).length;	
	}
	// миллисекунды в секунды:
	function secToMsec() {
		var Tf = new Date().getTime();
		var Thour = Math.floor((Tf - Ts) / 3600000);
		var Tmin = Math.floor((Tf - Ts) / 60000 - Thour * 60);
		var Tsec = Math.ceil((Tf - Ts) / 1000 - Tmin * 60 - Thour * 3600);
		var Tsec1 = Math.ceil(10 * ((Tf - Ts) / 1000 - Tmin * 60)) / 10;
		var Tsec2 = Math.ceil(100 * ((Tf - Ts) / 1000 - Tmin * 60)) / 100;
		var Tsec3 = Math.ceil(1000 * ((Tf - Ts) / 1000 - Tmin * 60)) / 1000;
		if(Tsec3 < 1 && Tmin < 1) TimeStr = Tsec3 + " сек"
		else {
			if(Tsec2 < 10 && Tmin < 1) TimeStr = Tsec2 + " сек"
			else {
				if(Tsec1 < 30 && Tmin < 1) TimeStr = Tsec1 + " сек"
				else {
					if(Tmin < 1) TimeStr = Tsec + " сек"
					else {
						if(Tmin >= 1 && Thour < 1) TimeStr = Tmin + " мин " + Tsec + " с"
						else {
							if(Thour >= 1) TimeStr = Thour + " ч " + Tmin + " мин " + Tsec + " с"
						}
					}
				}
			}
		}
	}

	function counterAfter() {
		var sel = document.getElementById("fbw_body");
		var fromHTML = sel.innerHTML; // код документа
		astCountEnd = (fromHTML.match(astNewRegexp) || []).length;	
		var epigCountEnd = (fromHTML.match(/<DIV class=epigraph>/g) || []).length;
		var authorCountEnd = (fromHTML.match(/<P class=text-author>/g) || []).length;
		
		var astCount = astCountStart - astCountEnd;
		var epigCount = epigCountEnd - epigCountStart;
		var authorCount = authorCountEnd - authorCountStart;
		+
		secToMsec();
		alert("Размечено:\nЗаголовков/подзаголовков: " + astCount + "\nЭпиграфов: " + epigCount + "\nАвторов эпиграфов: " + authorCount + "\n\nВремя выполнения скрипта: " + TimeStr + "\n\n«" + name + "» v." + version);
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
	// создание содержания заголовка:
	function titlAst(str) {
		str = str.replace(new RegExp("<sup>.+?</sup>|\\[\\d+\\]|\\{\\d+\\}|\\*", "igm"), ""); // удалить все возможные маркеры сносок.
		str = str.replace(new RegExp("\\r\\n", "igm"), " "); // убрать перевод строки.
		str = str.replace(new RegExp("</?[^>]+>", "igm"), ""); // удалить все теги.
		str = str.replace(/&nbsp;/g, " "); // неразрывные в обычные.
		str = str.replace(/^[\s □▫◦]+|[\s □▫◦]+$/gm, ""); // убрать начальные и концевые.
		str = str.replace(new RegExp("\\r\\n", "igm"), " "); // убрать перевод строки
		str = str.replace("^(.|[\\r\\n])+?" + labelEpi, "img", ""); // убрать Эпиграф.
		str = str.replace(new RegExp("^«([^«»]+)»[.,;:…\s □▫◦«;—–-]*$", "igm"), "$1"); // убрать кавычки с зацитаченой полностью строки.
		str = str.replace(new RegExp("^„([^„“]+)“[.,;:…\s □▫◦«;—–-]*$", "igm"), "$1"); // убрать кавычки с зацитаченой полностью строки.
		str = str.replace(/[.,;:…\s □▫◦«;—–-]+$/g, ""); // удалить лишние знаки препинания в конце строки.
		str = str.replace(/^[\s □▫◦—–-]+/g, ""); // удалить лишние знаки препинания в начале строки.
		str = str.replace(/([*\wа-яё“»)])$/gi, "$1…»"); //  проставить в конце многоточие и закрывающую кавычку.
		str = str.replace(/([!?])$/gi, "$1..»"); // завершение для восклицательного или вопросительного знаков в конце.
		str = str.replace(/(\?!|!\?)\.\.»$/gi, "$1.»"); // завершение для восклицательного + вопросительного знаков в конце.
		str = str.replace(/!!!\.\.»$/gi, "!!!»"); // поправить тройные восклицательные знаки.
		str = str.replace(/\?\?\?\.\.»$/gi, "???»"); // поправить тройные вопросительные знаки.
		str = str.replace(/^/gi, "«"); // проставить кавычку в начале.
		str = str.replace(/^««/gi, "«„"); // 
		str = str.replace(/»»/gi, "»“"); // 
		str = str.replace(/^«.+»$/g, function (match) {
			return match.replace(/(.)«/g, "$1„");
		});
		str = str.replace(/^«.+»$/g, function (match) {
			return match.replace(/»(.)/g, "“$1");
		});
		str = str.replace(/\.\.\./gi, "…"); // 
		str2 = str;	
		return str2;
	}
		
		if(questNormal == true && questSubtitle == false) {
			var astS = "<P>" + ast + "</P>\\r\\n"; // звёздочки только обычным текстом.
			}
		if(questNormal == false && questSubtitle == true) {
			var astS = "<P(?: class=subtitle)>" + ast + "</P>\\r\\n"; // звёздочки только в подзаголовках.
			}
		if(questNormal == true && questSubtitle == true) {
			var astS = "<P(?: class=subtitle)?>" + ast + "</P>\\r\\n"; // звёздочки обычными и в подзаголовках.
			}
	
	function zamena() {
		// простановка меток звёздочек в DIV-ах:
		body.innerHTML = body.innerHTML.replace(new RegExp("<DIV class=(cite|poem|stanza|epigraph|annotation|text-author)>(.|[\\r\\n])+?</DIV>\\r\\n", "igm"), function(match) {
			return match.replace(new RegExp("<P>(" + ast + ")</P>", "igm"), "<P>☺$1☻</P>"); //
		});
		
		// удалить пустые строки примыкающие к строкам-звёздочкам:
		body.innerHTML = body.innerHTML.replace(new RegExp("((?:<P>(?:\\s|&nbsp;|□|" + aIB +")+</P>\\r\\n)+)(<P(?: class=subtitle)?>(" + ast + ")</P>\\r\\n)", "igm"), "$2");
		body.innerHTML = body.innerHTML.replace(new RegExp("(<P(?: class=subtitle)?>(" + ast + ")</P>\\r\\n)((?:<P>(?:\\s|&nbsp;|□|" + aIB +")+</P>\\r\\n)+)", "igm"), "$1");
		
		var epi = "(?:(?:<P>.{1,"+colSymbStrMaxHtml+"}</P>\\r\\n){0,3}(?:<P>.{1,"+colSymbStrMaxHtml+"}" + labelEpi + "(?:" + fIB + ")?</P>\\r\\n))?";
		var epiReal = "(?:(?:<P>.{1,"+colSymbStrMaxHtml+"}</P>\\r\\n){0,3}(?:<P>.{1,"+colSymbStrMaxHtml+"}" + labelEpi + "(?:" + fIB + ")?</P>\\r\\n))";
		var empty_Line = "(?:<P>(?:\\s|&nbsp;|□|" + aIB + ")*</P>\\r\\n)?";
		// добавление пустой строки между заголовком и строкой со звёздочками для будущей валидности:
		body.innerHTML = body.innerHTML.replace(new RegExp("(<DIV class=title>(?:\\r\\n<P>.+</P>){1,5}</DIV>\\r\\n)(<P>" + ast + "</P>\\r\\n(?:<P>(?:" + empty_Line + ")</P>\\r\\n){0,1}(" + epi + empty_Line + ")((<P>(.{" + colSymbStrMin + "," + colSymbStrMaxHtml + "})</P>\\r\\n)(?:(?:<P>.{" + colSymbStrMin + "," + colSymbStrMaxHtml + "}</P>\\r\\n" + empty_Line + "){" + colStr + "})))", "mgi"), function(match, p1, p2, p3) {
			// alert("Всё:\n"+match+"\np1:\n"+p1+"\np2:\n"+p2+"\np3:\n"+p3);
			txt = match;
			
			findLongestStringLength(txt);
			
			if(findLongestStringLength(txt) < colSymbStrMaxText) {
				return match.replace(new RegExp("(<DIV class=title>(?:\\r\\n<P>.+</P>){1,5}</DIV>\\r\\n)", "igm"), "$1<P>" + nbspChar + "</P>"); //
			} else return match; //
		});
		
		// создание заголовка:
       body.innerHTML = body.innerHTML.replace(new RegExp(astS + "(?:<P>(?:" + empty_Line + ")</P>\\r\\n){0,1}(" + epi + empty_Line + ")((<P>(?!" + ast + ")(.{" + colSymbStrMin + "," + colSymbStrMaxHtml + "})</P>\\r\\n)(?:(?:<P>(?!" + ast + ").{" + colSymbStrMin + "," + colSymbStrMaxHtml + "}</P>\\r\\n" + empty_Line + "){" + colStr + "}))", "mgi"), function(match, p1, p2, p3) {	
			// alert("Всё:\n"+match+"\np1:\n"+p1+"\np2:\n"+p2+"\np3:\n"+p3);
			
			str = p3; // строка заголовка.
			txt = p2;
			// alert("txt:\n"+txt);
			findLongestStringLength(txt);
			// alert(findLongestStringLength(txt));
			if(findLongestStringLength(txt) < colSymbStrMaxText) {
				titlAst(str);
			
				// для заголовка:
				if(questTag == true) {
				return match.replace(new RegExp("(.|[\\r\\n])+", "mgi"), "</DIV><DIV class=section><DIV class=title><P>" + str2 + "</P></DIV>" + p1 + p2);
				}
				cT = body.innerHTML.lenght;
				
				// для подзаголовка:
				if(questTag == false) {
				return match.replace(new RegExp("(.|[\\r\\n])+", "mgi"), "<P class=subtitle>" + str2 + "</P>" + p1 + p2);
				}
				cS = body.innerHTML.lenght;
			} else return match;
		});
		
		// удаление пустых строк в эпиграфе и после:
		body.innerHTML = body.innerHTML.replace(new RegExp("<DIV class=title>\\r\\n<P>.+</P></DIV>\\r\\n" + epiReal + "(<P>&nbsp;</P>\\r\\n){0,1}.", "igm"), function(match) {
			return match.replace(new RegExp("<P>&nbsp;</P>\\r\\n", "igm"), ""); //
		});
		// создание эпиграфов при наличии меток:
		body.innerHTML = body.innerHTML.replace(new RegExp("<DIV class=title>\\r\\n<P>.+</P></DIV>\\r\\n" + epiReal, "igm"), function(match) {
			return match.replace(new RegExp(epiReal, "igm"), "<DIV class=epigraph>$&</DIV>"); //
		});
		// создание автора эпиграфов при наличии меток:
		body.innerHTML = body.innerHTML.replace(new RegExp("<DIV class=epigraph>(.|[\\r\\n])+?</DIV>\\r\\n", "igm"), function(match) {
			return match.replace(new RegExp("<P>((?:" + sIB + ")?" + labelAuthor + ".+?)</P>", "igm"), "<P class=text-author>$1</P>"); //
		});
		// удаление меток:
		body.innerHTML = body.innerHTML.replace(new RegExp("<DIV class=epigraph>(.|[\\r\\n])+?</DIV>\\r\\n", "igm"), function(match) {
			return match.replace(new RegExp(labelEpi + "|" + labelAuthor, "igm"), ""); //
		});
		// удаление меток звёздочек в DIV-ах:
		body.innerHTML = body.innerHTML.replace(new RegExp("<DIV class=(cite|poem|stanza|epigraph)>(.|[\\r\\n])+?</DIV>\\r\\n", "igm"), function(match) {
			return match.replace(new RegExp("<P>☺(" + ast + ")☻</P>", "igm"), "<P>$1</P>"); //
		});
	}
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// =========================================================
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
	window.external.BeginUndoUnit(document, "создание заголовков стихов из их первых строк");
	zamena();
	correction();
	window.external.EndUndoUnit(document);
	counterAfter();
}