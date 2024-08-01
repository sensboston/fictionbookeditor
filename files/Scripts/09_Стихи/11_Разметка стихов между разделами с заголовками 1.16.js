// Скрипт «Разметка стихов между разделами с заголовками» для редактора Fiction Book Editor (FBE).
// // Версия 1.16.
// Автор stokber.
//
function Run() {
	var question1 = "Размечать ли стихами фрагменты текста разделённые картинками?";
	var questImages = confirm(question1);
	var question2 = "Удалять ли курсив (жирность) из АБЗАЦЕВ С ДАТИРОВКОЙ СТИХОВ, если весь абзац изначально ими сделан?";
	var questFont = confirm(question2);
	var colStr = prompt("Введите минимальное количество строк, которое скрипт будет считать стихом.", 4);
	try {
		var nbspChar = window.external.GetNBSP();
		var nbspEntity;
		if(nbspChar.charCodeAt(0) == 160) nbspEntity = "&nbsp;";
		else nbspEntity = nbspChar;
	} catch(e) {
		var nbspChar = String.fromCharCode(160);
		var nbspEntity = "&nbsp;";
	}
	var version = 1.16;
	var poemCountStart;
	var stanzaCountStart;
	var authorCountStart;
	var colSymbStrMin = 1; // мин. кол. символов в строке HTML (включая теги, кроме начальных и конечных strong\em).
	var colSymbStrMaxHtml = 400; // макс. кол. символов в строке HTML (включая теги, кроме начальных и конечных strong\em и &nbps; посимвольно.
	var colSymbStrMaxText = 80; // макс. кол. символов в строке (без тегов).
	// мин. кол. строк. Если предвидятся верхняя и нижняя пустые установить на две больше:
	// var colStr = 2; // 
	// var colStr = 4; // учитывать верхнюю и нижнюю пустые.
	// метка конца документа:
	var labelEnd = "<D>%ьЪЬъЬ%ъьЪЬ%</D>";
	// ======================================================
	if(questImages == false) {
		// два регекспа без оформления без картинок и два ниже с картинками. Ненужное закомментировать.
		var beforePoem = "<DIV class=title>(?:\\r\\n<P>.+</P>){1,5}</DIV>|<P class=subtitle>.+?</P>|<DIV class=section>|<DIV class=epigraph>(?:\\r\\n<P>.+?</P>)+(?:\\r\\n<P class=text-author>.+?</P>)*</DIV>|<DIV class=onresiz.+?</DIV>";
		var afterPoem = "\\r\\n((?:<P>(?:<(?:EM|STRONG)>)*[^\\r\\n©@]{" + colSymbStrMin + "," + colSymbStrMaxHtml + "}?(?:</(?:EM|STRONG)>)*\\r\\n){" + colStr + ",})(?!<DIV onrezistart|<DIV class=(title|poem|stanza|cite|epigraph)>)(?=<DIV class=section>\\r\\n<DIV class=title>|<DIV class=body|<P class=subtitle>|<DIV id=fbw_updater style)";
	} else {
		var beforePoem = "<DIV class=title>(?:\\r\\n<P>.+</P>){1,5}</DIV>|<P class=subtitle>.+?</P>|<DIV class=section>|<DIV class=epigraph>(?:\\r\\n<P>.+?</P>)+(?:\\r\\n<P class=text-author>.+?</P>)*</DIV>|<DIV onresiz.+?</DIV>";
		var afterPoem = "\\r\\n((?:<P>(?:<(?:EM|STRONG)>)*[^\\r\\n©@]{" + colSymbStrMin + "," + colSymbStrMaxHtml + "}?(?:</(?:EM|STRONG)>)*\\r\\n){" + colStr + ",})(?!<DIV onrezistart|<DIV class=(title|poem|stanza|cite|epigraph)>)(?=<DIV class=section>\\r\\n<DIV class=title>|<DIV class=body|<P class=subtitle>|<DIV id=fbw_updater style|<DIV onresiz.+?</DIV>|$)";
	}
	// =========================================================
	var beforeEpigraph = "<DIV class=epigraph>(?:\\r\\n<P>.+?</P>)+(?:\\r\\n<P class=text-author>.+?</P>)*</DIV>";
	var data = "(?:<(?:EM|STRONG)>)*(?:.*\\D)?(?:1[789][0-9][0-9]|20[0-2][0-9])(?!(?:[0-9]| год[а-я]|[-](?:й|е|х|м|го)))(?:.*[^.])?(?:</(?:EM|STRONG)>)*" //
	function counterAfter() {
		var sel = document.getElementById("fbw_body");
		var fromHTML = sel.innerHTML; // код документа
		var poemCountEnd = (fromHTML.match(/<DIV class=poem>/g) || []).length;
		var stanzaCountEnd = (fromHTML.match(/<DIV class=stanza>/g) || []).length;
		var authorCountEnd = (fromHTML.match(/<P class=text-author>/g) || []).length;
		var poemCount = poemCountEnd - poemCountStart;
		var stanzaCount = stanzaCountEnd - stanzaCountStart;
		var authorCount = authorCountEnd - authorCountStart;
		alert("Размечено:\nСтихов: " + poemCount + "\nСтроф: " + stanzaCount + "\nДат: " + authorCount + "\n\n«Разметка стихов между разделами с заголовками» v." + version);
	}

	function counterBefore() {
		var sel = document.getElementById("fbw_body");
		var fromHTML = sel.innerHTML; // код документа.
		// alert(fromHTML);
		poemCountStart = (fromHTML.match(/<DIV class=poem>/g) || []).length;
		stanzaCountStart = (fromHTML.match(/<DIV class=stanza>/g) || []).length;
		authorCountStart = (fromHTML.match(/<P class=text-author>/g) || []).length;
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
		// проставить теги poem: ??????????????????????????????????????
		body.innerHTML = body.innerHTML.replace(new RegExp("(" + beforePoem + ")(?:\\r\\n<P>&nbsp;</P>)?(" + afterPoem + ")", "igm"), function(match, p1, p2) {
			var txt = p2;
			findLongestStringLength(txt);
			if(findLongestStringLength(txt) < colSymbStrMaxText) {
				return match.replace(new RegExp("(.|[\\r\\n])+", "igm"), p1 + "<DIV class=poem><DIV class=stanza>" + p2 + "</DIV></DIV>"); //
			} else return match.replace(new RegExp(".", "i"), "$&"); //
		});
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
		if(questFont == true) {
			// удалить внешние EM/STRONG с дат стихотворений:
			body.innerHTML = body.innerHTML.replace(new RegExp("<DIV class=stanza>(.|[\\r\\n])+?</DIV></DIV>", "igm"), function(match) {
				return match.replace(new RegExp("<P class=text-author>(?:(?:<(?:EM|STRONG)>){1,2})([^<]+)((</(EM|STRONG)>){1,2})</P>", "img"), "<P class=text-author>$1</P>"); //
			});
		}
	}

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
	// ======================================================
	var fbwBody = document.getElementById("fbw_body");
	var body = fbwBody.firstChild;
	while(body && body.className != "body") body = body.nextSibling;
	counterBefore();
	window.external.BeginUndoUnit(document, "Разметка стихов между разделами с заголовками");
	zamena();
	correction();
	window.external.EndUndoUnit(document);
	counterAfter();
}
