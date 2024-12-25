// Скрипт «Поиск неразмеченных стихов» для редактора Fiction Book Editor (FBE).
// Версия 1.1
// Надстройка к скрипту Sclex-а «Поиск по регекспам…»
// stokber, 2024, июнь.
function Run() {
	var nonStop;

	function selPoem() {
		var MyTagName = "B";
		var metka = "<" + MyTagName + " id=CursorPosition></" + MyTagName + ">";
		var body = document.getElementById("fbw_body");
		var coll = body.document.selection.createRange()
		var ttr1 = body.document.selection.createRange();
		var tr = ttr1.duplicate();
		tr.collapse();
		tr.pasteHTML(metka); // проставляем метку начала фрагмента.
		var pe = tr.parentElement();
		while(pe && pe.tagName != "DIV" && pe.className != "section") pe = pe.parentElement;
		var txt = pe.outerHTML;
		var txt = txt.replace(new RegExp("(<P>.*)" + metka, "m"), metka + "$1");
		var txt = txt.replace(new RegExp("((.+\\r?\\n?)+?).*?" + metka, "m"), ""); // отрезаем верх.
		CursorPosition.parentNode.removeChild(CursorPosition); // убираем метку.
		var txtBezTags = txt.replace(/<[^>]*>/g, ""); // создаём переменную со строками без тегов, 
		// чтобы сразу отсечь длинные строки.
		// alert("до\n"+txtBezTags);
		txtBezTags = txtBezTags.replace(/&lt;/g, "<"); // 
		txtBezTags = txtBezTags.replace(/&gt;/g, ">"); //  
		txtBezTags = txtBezTags.replace(/&shy;/g, String.fromCharCode(173)); //  
		txtBezTags = txtBezTags.replace(/&amp;/g, "&"); // 
		txtBezTags = txtBezTags.replace(/&nbsp;/g, " "); // 
		var lines = txtBezTags.split("\n"); // вычисляем кол. таких строк.
		for(var i = 0; i < lines.length; i++) {
			if(lines[i].length <= 67) { // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				lines[i] + "\n";
			} else {
				break;
			}
		}
		txt = txt.replace(new RegExp("<(P|DIV) (class=|onresiz).+?>\\r\\n((.+\\r?\\n?)*)", "mi"), "");
		// обрезаем по DIV-ы
		// alert("1\n"+txt);
		txt = txt.replace(new RegExp("(([^\\r\\n]+\\r\\n){" + i + "})((.+\\r?\\n?)*)", "mi"), "$1"); // 
		// обрезаем по слишком длинную строку
		// alert("2\n"+txt);
		// заменяем числа в маркерах сносок:
		txt = txt.replace(/<SUP>[^>]*<\/SUP>|\[\d+\]|\{\d+\}/gi, function(match) {
			return match.replace(/\d/g, "*");
		});
		// удаляем все теги, кроме: 
		txt = txt.replace(/<(?!\/?(STRONG|EM)(?=>|\s.*>))\/?.*?>/gi, ""); // 
		// alert("1\n"+txt);
		// ищем места смены начертания строк:
		txt = txt.replace(/<EM><STRONG>|<STRONG><EM>/g, "<ES>"); //  создаём новый смешанный стиль шрифта.
		txt = txt.replace(/<\/EM><\/STRONG>|<\/STRONG><\/EM>/g, "</ES>"); // 
		txt = txt.replace(/<\/EM><EM>/gi, ""); // 
		txt = txt.replace(/<(EM)><\/EM>/gi, ""); // 
		txt = txt.replace(/<\/STRONG><STRONG>/gi, ""); // 
		txt = txt.replace(/<STRONG><\/STRONG>/gi, ""); // 
		txt = txt.replace(/<\/ES><ES>/gi, ""); // 
		txt = txt.replace(/<ES><\/ES>/gi, ""); // 
		// поправляем пустые строки:
		txt = txt.replace(/(<\/(EM|ES|STRONG)>\r\n)&nbsp;$/gmi, "$1<$2>&nbsp;</$2>"); // 
		txt = txt.replace(/(<\/(EM|ES|STRONG)>\r\n)(?!<\2>)/mi, "$1<stuk/>"); // 
		// alert("4\n"+txt); 
		txt = txt.replace(/([^>]+?\r\n)(?=<(STRONG|EM|ES)>)/mi, "$1<stuk/>"); // 
		txt = txt.replace(/<\/?[^>\/]+>/gi, ""); // удаляем все оставшиеся строчные теги
		txt = txt.replace(new RegExp("(<stuk/>.+?)\\r\\n((.+\\r?\\n?)*)", "mi"), "$1"); // обрезаем часть фрагмента с другим стилем шрифта.
		
		// здесь можно править диапазон датировки написания стихотворения:
		var data = "(.* )?(1[789][0-9][0-9]|20[0-2][0-9])(?!([0-9]| год[а-я]|[-](й|е|х|м|го)))(.*[^.])?" // nev

		txt = txt.replace(new RegExp("^(?:<stuk/>)?(" + data + ")$", "gmi"), "$1"); // new
		// alert(txt);
		
		txt = txt.replace(/☺/g, "☻"); // меняем невесть как попавшие символы будущих меток цифр даты на другие символы // (24.06.2024)

		// в этой строке тоже нужно по надобноти править диапазон даты написания стиха:
		txt = txt.replace(/^(.* )?(1[789][0-9][0-9]|20[0-2][0-9])(?!([0-9]| год[а-я]|[-](й|е|х|м|го)))(.*[^.])?$/mg, function (match) {
		return match.replace(/[0-9]/g, "☺"); // (24.06.2024)
		}); // заменяем метками цифры в строках с датами.
		// alert("А это точно дата?\n\n"+txt);
		txt = txt.replace(new RegExp("<stuk/>.+?$", "mi"), ""); // 
		txt = txt.replace(/<\/?[^>\/]+>/gi, ""); // ??????????? удаляем последний тег-метку смены стиля начертания.
		
		//  поправляем спецсимволы и переводы строк:
		txt = txt.replace(/<\/?[^>]+>/g, "");
		txt = txt.replace(/&lt;/g, "<"); // 
		txt = txt.replace(/&gt;/g, ">"); //  
		txt = txt.replace(/&shy;/g, String.fromCharCode(173)); //  
		txt = txt.replace(/&amp;/g, "&"); // 
		txt = txt.replace(/\r\n/gm, "\n"); // 
		txt = txt.replace(/^&nbsp;\n/gm, "\n"); // 
		txt = txt.replace(/&nbsp;/g, " "); // 
		// txt = txt.replace(new RegExp("^(.{67,}\\r?\\n?)((.*\\r?\\n?)*)", "m"), "");
		// обрезаем другие непоэтические строки:
		txt = txt.replace(new RegExp("^([*♠♣♦♥•■▶~©+].*\\r?\\n?)((.*\\r?\\n?)*)", "m"), "");
		
		txt = txt.replace(new RegExp("^(.*☺.*\\n)((.*\\n?)*)", "m"), "$1"); //дата // (24.06.2024)
		
		// txt = txt.replace(new RegExp("^([0-9].*\\n)((.*\\n?)*)", "m"), "$1"); //дата 
		txt = txt.replace(new RegExp("^([a-zа-яё]\\)[.]?[\\x20\\xA0].*\\r?\\n?)((.*\\r?\\n?)*)", "m"), ""); // перечисление.
		// txt = txt.replace(new RegExp("^(.*[A-ZА-ЯЁ][.].*\\r?\\n?)((.*\\r?\\n?)*)", "m"), ""); // инициалы
		txt = txt.replace(new RegExp("^((Рис|Табл)[.]?[\\x20\\xA0]\\d+.*\\r?\\n?)((.*\\r?\\n?)*)", "m"), ""); // подпись рисунка или таблицы.
		
		// txt = txt.replace(new RegExp("^([*\\x20\\xA0]\\n)((.*\\n?)*)", "m"), ""); //строки состоящие из звёздочек и пробелов
		
		txt = txt.replace(new RegExp("^(.*(@|https?|ftp|www\\.).*\\n)((.*\\n?)*)", "m"), ""); //строки содержащие URL-ы и E-MAIL-ы 
		txt = txt.replace(new RegExp("^(.*[а-яё][.] ?[а-яё].*\\n)((.*\\n?)*)", "m"), ""); //строки содержащие сокращения
		txt = txt.replace(new RegExp("^([^a-zа-яё☺]*[A-ZА-ЯЁ]+[^a-zа-яё☺]*\\n)((.*\\n?)*)", "m"), ""); //строки без маленьких букв
		
		// txt = txt.replace(new RegExp("^(.+,[ ]?[-—–][ ]?[а-яё]+,[ ]?[-—–][ ]?[а-яё]+.+\\n)((.*\\n?)*)", "mi"), ""); // прямая речь
		
		txt = txt.replace(new RegExp("^\\n\\n+((.*\\n?)*)", "m"), ""); // две пустых строки
		
		// Если в фрагменте больше, чем 10 переводов строк, то пропускать строки содержащие цифры и с тире-дефисами вначале:
		var lines = txt.split("\n").length; // абзацев
		// alert(lines);
		if(lines <= 10) {
			txt = txt.replace(new RegExp("^([-—–].*\\r?\\n?)((.*\\r?\\n?)*)", "m"), ""); // строки-реплики диалога
			txt = txt.replace(new RegExp("^(.*[0-9].*\\n)((.*\\n?)*)", "m"), ""); //строки с числами 
		}
		
		txt = txt.replace(new RegExp("^\\n*$", "m"), ""); // конечная пустая строка? // (24.06.2024)
		
		//  вычисляем длину оставшегося фрагмента:
		var characterCount = txt.length;
		characterCount-- // // (24.06.2024)
		
		ttr1.moveEnd("character", characterCount);
		ttr1.select();
		
		//  Переменные для фрагментов нетипичных для стихотворных строк:
				var from = ttr1.htmlText; //new String
		// alert("from:\n"+from);
		// alert("txt:\n"+txt);
		var result = from.match(/<P>/mg) || []; //абзацев
		var emptyLinesS = txt.match(/\n\s*\n(?!$)/mg) || []; // пустых посредине
		// var dotEnd = txt.match(/[.]\n/mg) || []; // с точкой в конце
		var dotEnd = txt.match(/^«?[А-ЯЁ].+[.]$/gm) || []; // с точкой в конце
		var dot2End = txt.match(/:\n/m) || []; // с двоеточием в конце
		
		if(characterCount <= 0) {
			ttr1.moveEnd("character", 2);
			ttr1.select();
			nonStop = 0;
		}
		else
		{
	// 0 — пропускать совпадение, 1 — остановиться:
		if(result.length <= 1) {
			nonStop = 0;
		} else { // пропускать одну строку.
			// if((result.length == 2) && (dotEnd.length == 2)) {
			if((result.length >= 2) && (dotEnd.length >= 2) && (result.length == dotEnd.length)) {
				nonStop = 0;
				// alert("?"); // закомментить после тестирования.
			} else { // две строки с точками в конце.
				if((result.length == 2) && (dot2End.length >= 1)) {
					nonStop = 0;
					// alert("?");  // закомментить после тестирования.
				} else { // две строки с двоеточием в конце.
					if((emptyLinesS.length == 1) && (result.length == 3)) {
						nonStop = 0;
					} else { // три строки с пустой посредине.
						{
							nonStop = 1;
						}
					}
				}
			}
		}
	}
}

	function Run1() {
		function init() {
			addRegExp("^[a-zа-яё]\\)[.]?[\\x20\\xA0]", "i", "Пропустить:  перечисление.", "-title -subtitle -cite -poem -stanza -text-author -epigraph -annotation");
			// addRegExp("^[0-9]{1,3}\\)[.]?[\\x20\\xA0]","","Пропустить:  перечисление.","-title -subtitle -cite -poem -stanza -text-author -epigraph -annotation");!!!
			// добавить маркированные списки и аннотации
			// tagRegExp("^<любые-теги><code><любые-теги>.+","","Пропустить:  помеченный Кодом текст.","-title -subtitle -cite -poem -stanza -text-author -epigraph -annotation");!!!
			addRegExp("^\\+\\+","","Пропустить:  добавочный абзац текста сноски.","-title -subtitle -cite -poem -stanza -text-author -epigraph -annotation");!!!
			// tagRegExp("^<любые-теги><sup><любые-теги>[0-9]+<любые-теги></sup><любые-теги>.{1,}$","","Пропустить:  текст сноски.","-title -subtitle -cite -poem -stanza -text-author -epigraph -annotation");!!!
			addRegExp("^.*[A-ZА-ЯЁ][.].*$", "", "Пропустить:  Инициалы.", "-title -subtitle -cite -poem -stanza -text-author -epigraph -annotation");
			
			addRegExp("^.*(@|https?|ftp|www\\.).*$", "", "Пропустить: URL-ы и E-MAIL-ы.", "-title -subtitle -cite -poem -stanza -text-author -epigraph -annotation");
			
			addRegExp("^[^a-zа-яё]*[A-ZА-ЯЁ]+[^a-zа-яё]*$", "", "Пропустить: строки без маленьких букв.", "-title -subtitle -cite -poem -stanza -text-author -epigraph -annotation");
			
			// tagRegExp("^.+,[\\x20\\xA0]?[-—–][\\x20\\xA0]?[а-яё]+,[\\x20\\xA0]?[-—–][\\x20\\xA0]?[а-яё]+.+$", "i", "Пропустить: прямая речь.", "-title -subtitle -cite -poem -stanza -text-author -epigraph -annotation");
			
			addRegExp("^.*[а-яё][.] ?[а-яё].*$", "", "Пропустить: строка с сокращением.", "-title -subtitle -cite -poem -stanza -text-author -epigraph -annotation");
			
			addRegExp("^(УДК|ББК|ISBN)", "", "Пропустить:  издательские  данные.", "-title -subtitle -cite -poem -stanza -text-author -epigraph -annotation");
			addRegExp("^(Рис|Табл)[.]?[\\x20\\xA0]\\d", "", "Пропустить: подпись рисунка или таблицы.", "-title -subtitle -cite -poem -stanza -text-author -epigraph -annotation");
			addRegExp("^(?=[^-–—*♠♣♦♥•■∙▶~©0-9].{2,69}$)", "", "Найдено: неразмеченные стихи?", "-title -subtitle -cite -poem -stanza -text-author -epigraph -annotation");
		}

		function scrollIfItNeeds() {
			var selection = document.selection;
			if(selection) {
				var range = selection.createRange();
				var rect = range.getBoundingClientRect();
				// var correction = (rect.bottom - document.documentElement.clientHeight/2); // центр
				var correction = (rect.bottom - document.documentElement.clientHeight / 6); // верх
				// var popravka = (rect.bottom - document.documentElement.clientHeight/8* 6); // низ
				window.scrollBy(0, correction);
			}
		}
		try {
			var nbspChar = window.external.GetNBSP();
			var nbspEntity;
			if(nbspChar.charCodeAt(0) == 160) nbspEntity = "&nbsp;";
			else nbspEntity = nbspChar;
		} catch(e) {
			var nbspChar = String.fromCharCode(160);
			var nbspEntity = "&nbsp;";
		}
		var sel = document.selection;
		if(sel.type != "None" && sel.type != "Text") {
			MsgBox("Не обрабатываемый тип выделения: sel.type");
			return;
		}
		try {
			var nbspChar = window.external.GetNBSP();
			var nbspEntity;
			if(nbspChar.charCodeAt(0) == 160) nbspEntity = "&nbsp;";
			else nbspEntity = nbspChar;
		} catch(e) {
			var nbspChar = String.fromCharCode(160);
			var nbspEntity = "&nbsp;";
		}
		var sel = document.selection;
		if(sel.type != "None" && sel.type != "Text") {
			MsgBox("Не обрабатываемый тип выделения: sel.type");
			return;
		}
		var regExps = [];
		var itsTagRegExp = [];
		var lookBehinds = [];
		var descs = [];
		var positive = [];
		var tagCond = [];
		var macroses = {};
		var lookBehLimit = [];
		var regExpCnt = 0;
		var re, inTags, ss, tagFlag, s_len, rslt, ff, offset;
		var level, ch, begin, lookBeh, lookBehCnt, ii, limit, rslt_;
		var errorList = "";
		var checkTagStrRE = new RegExp("^(([-+](section|body|epigraph|cite|poem|stanza|title|subtitle|text-author|annotation))([ \t]+?[-+](section|body|epigraph|cite|poem|stanza|title|subtitle|text-author|annotation))*?|^$)$", "i");
		var findTagRE = new RegExp("(^| )([-+])(section|body|epigraph|cite|poem|stanza|title|subtitle|text-author|annotation)(?= |$)", "ig");
		var find_xA0 = new RegExp("((\\\\)+?)xA0", "ig");

		function replaceMacroses(full_match, brackets1, offset_of_match, string_we_search_in) {
			if(macroses[full_match.toLowerCase()]) return macroses[full_match.toLowerCase()];
			else return full_match;
		}

		function replaceA0(full_match, brackets1, offset_of_match, string_we_search_in) {
			if(brackets1.length % 2 == 1) return nbspChar;
			else return full_match;
		}

		function addRegExp(re_, keys, desc, inWhatTags, beforeLimit) {
			try {
				ii = 0;
				lookBeh = [];
				lookBehCnt = 0;
				posit = [];
				while(re_.substr(ii, 4) == "(?<=" || re_.substr(ii, 4) == "(?<!") {
					level = 1;
					begin = ii;
					ii += 4;
					while(ii < re_.length && level != 0) {
						ch = re_.charAt(ii);
						if(ch == "(") level++;
						if(ch == ")") level--;
						if(ch == "\\") ii += 2;
						else ii++;
					}
					lookBeh[lookBehCnt] = new RegExp(re_.substring(begin + 4, ii - 1).replace(/ /g, nbspChar).replace(find_xA0, replaceA0), "g" + (keys ? keys : ""));
					posit[lookBehCnt] = re_.substr(begin, 4) == "(?<=";
					lookBehCnt++;
				}
				re = new RegExp(re_.substr(ii).replace(/ /g, nbspChar).replace(find_xA0, replaceA0), "g" + (keys ? keys : ""));
				if(inWhatTags && inWhatTags.search(checkTagStrRE) < 0) throw(true);
			} catch(e) {
				errorList += (errorList == "" ? "" : "\n") + "  addRegExp(\"" + re_ + "\",\"" + keys + "\",\"" + desc + "\",\"" + inWhatTags + "\"";
				return;
			}
			regExpCnt++;
			regExps[regExpCnt] = re;
			itsTagRegExp[regExpCnt] = false;
			if(desc != undefined && desc != "") descs[regExpCnt] = desc;
			if(lookBehCnt != 0) {
				lookBehinds[regExpCnt] = lookBeh;
				positive[regExpCnt] = posit;
			} else lookBehinds[regExpCnt] = null;
			if(inWhatTags) tagCond[regExpCnt] = inWhatTags;
			if(beforeLimit && typeof(beforeLimit) == "number" && beforeLimit != 0) lookBehLimit[regExpCnt] = beforeLimit;
		}

		function tagRegExp(re_, keys, desc, inWhatTags, beforeLimit) {
			try {
				var ii = 0;
				lookBeh = [];
				lookBehCnt = 0;
				posit = [];
				while(re_.substr(ii, 4) == "(?<=" || re_.substr(ii, 4) == "(?<!") {
					level = 1;
					begin = ii;
					ii += 4;
					while(ii < re_.length && level != 0) {
						ch = re_.charAt(ii);
						if(ch == "(") level++;
						if(ch == ")") level--;
						if(ch == "\\") ii += 2;
						else ii++;
					}
					lookBeh[lookBehCnt] = new RegExp(re_.substring(begin + 4, ii - 1).replace(/ /g, nbspChar).replace(find_xA0, replaceA0).replace(macrosNameRE_2, replaceMacroses), "g" + (keys ? keys : ""));
					posit[lookBehCnt] = re_.substr(begin, 4) == "(?<=";
					lookBehCnt++;
				}
				re = new RegExp(re_.substr(ii).replace(/ /g, nbspChar).replace(find_xA0, replaceA0).replace(macrosNameRE_2, replaceMacroses), "g" + (keys ? keys : ""));
				if(inWhatTags && inWhatTags.search(checkTagStrRE) < 0) throw(true);
			} catch(e) {
				errorList += (errorList == "" ? "" : "\n") + "  tagRegExp(\"" + re_ + "\",\"" + keys + "\",\"" + desc + "\",\"" + inWhatTags + "\"";
				return;
			}
			regExpCnt++;
			regExps[regExpCnt] = re;
			itsTagRegExp[regExpCnt] = true;
			if(desc != undefined && desc != "") descs[regExpCnt] = desc;
			if(lookBehCnt != 0) {
				lookBehinds[regExpCnt] = lookBeh;
				positive[regExpCnt] = posit;
			} else lookBehinds[regExpCnt] = null;
			if(inWhatTags) tagCond[regExpCnt] = inWhatTags;
			if(beforeLimit && typeof(beforeLimit) == "number") lookBehLimit[regExpCnt] = beforeLimit;
		}

		function cmpFounds(a, b) {
			return a["pos"] - b["pos"];
		}

		function getTags(el) {
			inTags = {};
			inTags["section"] = false;
			inTags["body"] = false;
			inTags["epigraph"] = false;
			inTags["cite"] = false;
			inTags["poem"] = false;
			inTags["stanza"] = false;
			inTags["title"] = false;
			inTags["annotation"] = false;
			if(el.className == "subtitle") inTags["subtitle"] = true;
			else inTags["subtitle"] = false;
			if(el.className == "text-author") inTags["text-author"] = true;
			else inTags["text-author"] = false;
			el3 = el;
			while(el3 && el3.nodeName != "BODY") {
				if(el3.nodeName == "DIV") switch(el3.className) {
					case "section":
						{
							inTags["section"] = true;
							break;
						}
					case "body":
						{
							inTags["body"] = true;
							break;
						}
					case "epigraph":
						{
							inTags["epigraph"] = true;
							break;
						}
					case "cite":
						{
							inTags["cite"] = true;
							break;
						}
					case "poem":
						{
							inTags["poem"] = true;
							break;
						}
					case "stanza":
						{
							inTags["stanza"] = true;
							break;
						}
					case "title":
						{
							inTags["title"] = true;
							break;
						}
					case "annotation":
						{
							inTags["annotation"] = true;
							break;
						}
				}
				el3 = el3.parentNode;
			}
		}

		function checkOneTag(full_match, brackets1, brackets2, brackets3, offset_of_match, string_we_search_in) {
			if(inTags[brackets3] != (brackets2 == "+")) tagFlag = false;
			return full_match;
		}

		function checkAreWeInRightTags(reNum) {
			tagFlag = true;
			ss = tagCond[reNum];
			if(ss) ss.replace(findTagRE, checkOneTag);
			return tagFlag;
		}

		function checkLookBehs(reNum, s, pos) {
			if(!lookBehinds[reNum]) return true;
			limit = lookBehLimit[reNum];
			if(!limit) {
				s = s.substr(0, pos);
			} else {
				offset = pos - limit;
				s = s.substring(offset >= 0 ? offset : 0, pos);
			}
			s_len = s.length;
			for(ff = 0; ff < lookBehinds[reNum].length; ff++) {
				lookBehinds[reNum][ff].lastIndex = 0;
				rslt_ = lookBehinds[reNum][ff].exec(s);
				while(rslt_ && rslt_.index + rslt_[0].length != s_len) {
					rslt_ = lookBehinds[reNum][ff].exec(s);
				}
				if(positive[reNum][ff]) {
					if(!rslt_ || rslt_.index + rslt_[0].length != s_len) return false;
				} else {
					if(rslt_ && rslt_.index + rslt_[0].length == s_len) return false;
				}
			}
			return true;
		}

		function addMacros(macrosName, macrosRE) {
			if(macrosName.search(macrosNameRE) < 0) errorList += (errorList == "" ? "" : "\n") + "addMacros(\"" + macrosName + "\",\"" + macrosRE + "\"); //неверное имя макроса"
			macrosRE_ = macrosRE.replace(macrosNameRE_2, replaceMacroses);
			try {
				re = new RegExp("(" + macrosRE_.replace(/ /g, nbspChar).replace(find_xA0, replaceA0) + ")", "g");
			} catch(e) {
				errorList += (errorList == "" ? "" : "\n") + "addMacros(\"" + macrosName + "\",\"" + macrosRE + "\"); // ошибка при компиляции регэкспа";
				return;
			}
			macroses[macrosName.toLowerCase()] = "(" + macrosRE_.replace(/ /g, nbspChar).replace(find_xA0, replaceA0) + ")";
		}
		for(i in macroses) delete macroses[i];
		var macrosNameRE = /^<[-а-яёa-z_?\/]+>$/i;
		var macrosNameRE_2 = /<[-а-яёa-z_?\/]+>/ig;
		addMacros("<emphasis>", "<[Ee][Mm]>");
		addMacros("<strong>", "<([Ss][Tt][Rr][Oo][Nn][Gg]|[Bb])(?![a-z])[^>]*?>");
		addMacros("<sup>", "<[Ss][Uu][Pp](?![a-z])[^>]*?>");
		addMacros("<sub>", "<[Ss][Uu][Bb](?![a-z])[^>]*?>");
		addMacros("<strikethrough>", "<[Ss][Tt][Rr][Ii][Kk][Ee](?![a-z])[^>]*?>");
		addMacros("<code>", "<[Ss][Pp][Aa][Nn](?![a-z])[^>]*?\\b[Cc][Ll][Aa][Ss][Ss]=[\"']?[Cc][Oo][Dd][Ee](?![a-z])[\"']?[^>]*?>");
		addMacros("</emphasis>", "</([Ee][Mm]|[Ii])>");
		addMacros("</strong>", "</([Ss][Tt][Rr][Oo][Nn][Gg]|[Bb])>");
		addMacros("</sup>", "</[Ss][Uu][Pp]>");
		addMacros("</sub>", "</[Ss][Uu][Bb]>");
		addMacros("</strikethrough>", "</[Ss][Tt][Rr][Ii][Kk][Ee]>");
		addMacros("</code>", "</[Ss][Pp][Aa][Nn]>");
		addMacros("<любые-теги>", "(</?[^>]*?>)*?");
		init();
		if(errorList != "") {
			alert("Ошибки при компиляции регэкспов, заданных в таких строках:\n\n" + errorList + "\n\nПожалуйста, поправьте ошибки, прежде чем использовать скрипт.");
			return;
		}
		var fbwBody, tmpNode, s1WithTagsRemoved, s2WithTagsRemoved, minPos, minHtmlPos, currPos, i, rslt, foundLen;
		var tr, tr2, el, el2, el3, myIndex, s, s_html, s1_len, ignoreNullPosition, desc, rslt, newPos, re, macrosRE;
		var k, flag1, rslt_replaced, founds, foundsCnt;
		var removeTagsRE = new RegExp("<(?!IMG\\b).*?(>|$)", "ig");
		var removeTagsRE_ = "";
		var imgTagRE = new RegExp("<IMG\\b.*?>", "ig");
		var imgTagRE_ = "ǾǾǾ";
		var ampRE = new RegExp("&amp;", "g");
		var ampRE_ = "&";
		var ltRE = new RegExp("&lt;", "g");
		var ltRE_ = "<";
		var gtRE = new RegExp("&gt;", "g");
		var gtRE_ = ">";
		var shyRE = new RegExp("&shy;", "g");
		var shyRE_ = String.fromCharCode(173);
		var nbspRE = new RegExp("&nbsp;", "g");
		var nbspRE_ = " ";
		var pNode, foundPos, foundLen;
		var s_len;
		var foundMatch = false;
		//var log="";
		//var iterations2=0;
		/*var arr=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		         0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];*/
		function searchNext() {
			var savedIndex;
			ignoreNullPosition = false; //tr.compareEndPoints("StartToEnd",tr)==0;
			el = ptr;
			s = el.innerHTML.replace(removeTagsRE, removeTagsRE_).replace(imgTagRE, imgTagRE_).replace(shyRE,shyRE_).replace(ltRE, ltRE_).replace(gtRE, gtRE_).replace(ampRE, ampRE_).replace(nbspRE, nbspRE_);
			s_len = s.length;
			//log+="Входим в searchNext.  s1_len: "+s1_len+"  s_len: "+s_len+"\n\n";
			tr.moveToElementText(el);
			tr.move("character", s1_len);
			//tr.select();
			//alert("s1_len: "+s1_len);
			tr2 = tr.duplicate();
			tr2.moveToElementText(el);
			tr2.setEndPoint("EndToEnd", tr);
			//tr2.select();
			//alert("После команды tr2.select();");
			s1_len = tr2.htmlText.replace(/\s{2,}/g, " ").replace(removeTagsRE, removeTagsRE_).replace(imgTagRE, imgTagRE_).replace(shyRE,shyRE_).replace(ltRE, ltRE_).replace(gtRE, gtRE_).replace(ampRE, ampRE_).replace(nbspRE, nbspRE_).length;
			var s1 = tr2.htmlText.replace(/\s{2,}/g, " ");
			var s1_len2 = s1.length;
			var s2 = el.innerHTML;
			var k1 = s1.search(/(<\/[^<>]+>)+$/);
			if(k1 == -1) s1_html_len = s1_len2;
			else {
				while(k1 < s1_len2 && s1.charAt(k1) == s2.charAt(k1)) k1++;
				s1_html_len = k1;
			}
			s_html = ptr.innerHTML;
			while(el && el != fbwBody) {
				if(el.nodeName == "P" && (s1_len < s_len || s_len == 0)) {
					founds = [];
					foundsCnt = 0;
					minPos = -1;
					for(i = 1; i <= regExpCnt; i++) {
						getTags(el);
						if(checkAreWeInRightTags(i)) {
							if(itsTagRegExp[i] == false) {
								//rslt=regExps[i].exec(s);
								regExps[i].lastIndex = s1_len + (ignoreNullPosition ? 1 : 0);
								savedIndex = s1_len + (ignoreNullPosition ? 1 : 0);
								//alert("s1_len+(ignoreNullPosition?1:0): "+(s1_len+(ignoreNullPosition?1:0)));
								rslt = regExps[i].exec(s);
								while(rslt && !checkLookBehs(i, s, rslt.index, false)) {
									savedIndex++;
									if(rslt.index > savedIndex) savedIndex = rslt.index;
									regExps[i].lastIndex = savedIndex;
									rslt = regExps[i].exec(s);
								}
								if(rslt) {
									//alert("rslt.index: "+rslt.index);
									founds[foundsCnt] = {
										"pos": rslt.index,
										"len": rslt[0].length,
										"re": i
									};
									foundsCnt++;
									//if (ignoreNullPosition ? minPos==s1_len+1 : minPos==s1_len) break;
								}
							} else { //its tagRegExp[i]==true, т.е. в этой ветке ищем по теговым регэкспам
								flag1 = true;
								regExps[i].lastIndex = s1_html_len;
								rslt = regExps[i].exec(s_html);
								savedIndex = s1_html_len + (ignoreNullPosition ? 1 : 0);
								while(rslt && flag1) {
									if(rslt.index > savedIndex) savedIndex = rslt.index;
									regExps[i].lastIndex = savedIndex;
									savedIndex++;
									rslt = regExps[i].exec(s_html);
									flag1 = false;
									if(rslt) {
										newPos = s_html.substr(0, rslt.index).replace(removeTagsRE, removeTagsRE_).replace(imgTagRE, imgTagRE_).replace(shyRE,shyRE_).replace(ltRE, ltRE_).replace(gtRE, gtRE_).replace(ampRE, ampRE_).replace(nbspRE, nbspRE_).length;
										rslt_replaced = rslt[0].replace(removeTagsRE, removeTagsRE_).replace(imgTagRE, imgTagRE_).replace(shyRE,shyRE_).replace(ltRE, ltRE_).replace(gtRE, gtRE_).replace(ampRE, ampRE_).replace(nbspRE, nbspRE_);
										if(ignoreNullPosition ? minPos == s1_html_len + 1 : minPos == s1_html_len) break;
										if(rslt_replaced.length == 0 || (rslt_replaced.length != 0 && rslt_replaced[0] != "<")) {
											k = regExps[i].lastIndex;
											while(k < s_html.length && s_html.charAt(k) != ">" && s_html.charAt(k) != "<") k++;
											//alert("k после цикла: "+k+"\n\ns_html[k]: "+s_html.charAt(k));
											if(k < s_html.length && s_html.charAt(k) == ">") {
												regExps[i].lastIndex = k + 1;
												//alert("regExps[i].lastIndex: "+regExps[i].lastIndex);
												flag1 = true;
											}
										}
										if(!flag1) {
											if(!checkLookBehs(i, s_html, rslt.index, true)) flag1 = true;
											else /*if (newPos>s1_len)*/ {
												founds[foundsCnt] = {
													"pos": newPos,
													"len": rslt_replaced.length,
													"re": i
												};
												foundsCnt++;
											}
										}
									} // if
								} // while (flag1)
							} // else
						} //if (checkAreWeInRightTags)
					} // for (i=1;i<=regExpCnt;i++)
					//if (founds.length>0) log+="founds: "+founds+"\n"+founds[0].pos+" "+founds[0].len+" "+founds[0].re+"\n\n";
					founds.sort(cmpFounds);
					//if (founds.length>0) log+="founds после сортировки: "+founds+"\n"+founds[0].pos+" "+founds[0].len+" "+founds[0].re+"\n\n";
					var currFound = 0;
					while(currFound < foundsCnt) {
						i = founds[currFound]["re"];
						//if (currFound==0) log+="founds[currFound].pos: "+founds[currFound].pos+"  founds[currFound]['len']:"+founds[currFound]["len"]+"  s1_len: "+s1_len+"\n\n";
						if(!(ignoreNullPosition && founds[currFound].pos == s1_len)) {
							//log+="Вошли в проверку.\n\n";
							var desc = descs[i];
							if(desc != undefined && desc != "") try {
								window.external.SetStatusBarText(desc);
							}
							catch(e) {}
							ptr = el;
							foundPos = founds[currFound]["pos"];
							foundLen = founds[currFound]["len"];
							s1_len = founds[currFound]["pos"] + founds[currFound]["len"];
							//log+="s1_len - новое значение: "+s1_len+"\n\n";
							//log+="Перед проверкой desc. "+desc+" "+desc.indexOf("Пропустить")+"\n\n"; 
						
							// пропускаем исключения...
							if(desc.indexOf("Пропустить") == 0) return true; // (stokber)
							foundMatch = true;
							return false;
							//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
						}
						currFound++;
					}
					ignoreNullPosition = false;
				}
				if(el && el.firstChild && el.nodeName != "P") el = el.firstChild;
				else {
					while(el && el.nextSibling == null) el = el.parentNode;
					if(el) el = el.nextSibling;
				}
				while(el && el != fbwBody && el.nodeName != "P")
					if(el && el.firstChild && el.nodeName != "P") el = el.firstChild;
					else {
						while(el && el != fbwBody && el.nextSibling == null) el = el.parentNode;
						if(el && el != fbwBody) el = el.nextSibling;
					}
				if(el && el.nodeName == "P") {
					s = el.innerHTML.replace(removeTagsRE, removeTagsRE_).replace(imgTagRE, imgTagRE_).replace(shyRE,shyRE_).replace(ltRE, ltRE_).replace(gtRE, gtRE_).replace(ampRE, ampRE_).replace(nbspRE, nbspRE_);
					s1_len = 0;
					s_html = el.innerHTML;
					s1_html_len = 0;
				}
			}
			// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
			window.external.SetStatusBarText("Поиск завершен!"); // (stokber)
			tr.collapse(false);
			tr.select();
			MsgBox("От позиции курсора до конца документа ничего не найдено.");
			nonStop = 1;
			// ===========================================================
		}
		fbwBody = document.getElementById("fbw_body");
		tr = sel.createRange();
		tr.collapse(false);
		el = tr.parentElement();
		el2 = el;
		while(el2 && el2.nodeName != "BODY" && el2.nodeName != "P") el2 = el2.parentNode;
		ptr = el2;
		if(el2.nodeName == "P") {
			tr2 = document.body.createTextRange();
			tr2.moveToElementText(el2);
			tr2.setEndPoint("EndToEnd", tr);
			s1_len = tr2.htmlText.replace(/\s{2,}/g, " ").replace(removeTagsRE, removeTagsRE_).replace(imgTagRE, imgTagRE_).replace(shyRE,shyRE_).replace(ltRE, ltRE_).replace(gtRE, gtRE_).replace(ampRE, ampRE_).replace(nbspRE, nbspRE_).length;
		}
		while(searchNext());
		if(foundMatch) {
			tr = document.body.createTextRange();
			tr.moveToElementText(ptr);
			tr.move("character", foundPos);
			tr2 = tr.duplicate();
			tr2.move("character", foundLen);
			tr.setEndPoint("EndToStart", tr2);
			if(foundLen == 0 && tr.move("character", 1) == 1) tr.move("character", -1);
			tr.select();
			scrollIfItNeeds();
			selPoem();
		}
	}
	do {
		Run1();
		// selPoem();
	} while (nonStop == 0);
}