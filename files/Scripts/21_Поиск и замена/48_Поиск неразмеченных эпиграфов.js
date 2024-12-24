// Скрипт «Поиск неразмеченных эпиграфов»
// Версия 1.2. Декабрь, 2024
// Автор — stokber.
// За основу кода взят скрипт «Перейти на предыдущий заголовок стиха» ув. Sclex-а. 
// Добавлена функция выделения строк будущих эпиграфов и зацикливания их поиска.

function Run() {
var nonStop;
// nonStop = 0 — пропускать, 1 — остановиться:

function Run1() {
	var blockElementClass = "title"; // класс блочного элемента, который (элемент) нужно искать
	var undoMsg = "переход на следующий неразмеченный эпиграф";
	var statusBarMsg = "Переходим на следующий неразмеченный эпиграф…";
	var notFoundMsg = "До конца документа скрипт не видит неразмеченных эпиграфов.";
	try {
		var nbspChar = window.external.GetNBSP();
		var nbspEntity;
		if(nbspChar.charCodeAt(0) == 160) nbspEntity = "&nbsp;";
		else nbspEntity = nbspChar;
	} catch(e) {
		var nbspChar = String.fromCharCode(160);
		var nbspEntity = "&nbsp;";
	};
	var re2 = new RegExp(" |&nbsp;|" + nbspChar, "g");

	function checkP(elem1) {
		if(hasAmongParents(elem1, "title")) return true;
		return false;
	}

	function hasAmongParents(elem2, nameOfClass) {
		while(elem2 && elem2.nodeName != "BODY") {
			if(elem2.nodeName == "DIV" && elem2.className == nameOfClass) return true;
			elem2 = elem2.parentNode;
		}
		return false;
	}

	function getParentWithClass(elem3, nameOfClass) {
		while(elem3 && elem3.nodeName != "BODY") {
			if(elem3.nodeName == "DIV" && elem3.className == nameOfClass) return elem3;
			elem3 = elem3.parentNode;
		}
		return null;
	}
	var emptyLineRegExp = new RegExp("^( | |&nbsp;|" + nbspChar + ")*?$", "i");

	function isLineEmpty(ptr) {
		return emptyLineRegExp.test(ptr.innerHTML.replace(/<[^>]*?>/gi, ""));
	}

	function getNextNode(el) {
		//alert("Вошли в getNextNode.");
		if(el.firstChild && el.nodeName != "P") el = el.firstChild;
		else {
			while(el && !el.nextSibling) el = el.parentNode;
			if(el && el.nextSibling) el = el.nextSibling;
		}
		return el;
	}

	function getNextP(el) {
		var savedEl = el;
		while(el && (el.nodeName != "P" || el == savedEl)) el = getNextNode(el);
		return el;
	}

	function scrollIfItNeeds() {
		var selection = document.selection;
		if(selection) {
			var range = selection.createRange();
			var rect = range.getBoundingClientRect();
			// var correction = (rect.bottom - document.documentElement.clientHeight/2); // центр
			var correction = (rect.bottom - document.documentElement.clientHeight / 2); // верх
			// var popravka = (rect.bottom - document.documentElement.clientHeight/8* 6); // низ
			window.scrollBy(0, correction);
		}
	}

	// ---------------------------------------------------------------------------------------------------------
	
	function selEpi() {
		if(!tr1) {
			alert("Поиск завершён!");
			return true;
		}
		// var colStr = 6; // макс. кол. строк эпиграфа
		var colStr = 12; //
		var rxTitle = new RegExp("^(<DIV class=stanza>)?<DIV class=title>", "im");
		var rxDiv = new RegExp("^<DIV class=(epigraph|annotation|cite|poem)>", "im");
		var rxP = new RegExp("^<DIV class=section>", "im");
		tr1.moveEnd("character", 2);
		tr1.moveEnd("character", -1);
		tr1.collapse(false);
		tr1.select();
		var rng = document.selection.createRange();
		if(!rng) return false;
		var pe = rng.parentElement();
		var p = "";
		while(pe.parentElement && pe.tagName != "DIV" && pe.className != "section") pe = pe.parentElement;
		
		p = pe.outerHTML;
		
		// если добрались до разделов с примечаниями или комментариями — завершаем работу:
		var rxNote = new RegExp("<DIV id=([nc]|comment|FbAutId|bookmark)_?\\d+ class=section><DIV class=title>", "im");
	if((rxNote.test(p)) == true) {
		window.external.SetStatusBarText("Поиск завершён! Скрипт не ищет эпиграфы после разделов со сносками.");
			alert("Поиск завершён!");
			nonStop = 1;
			return true;
		}
		
		// начать поиск с 0-й позиции:
		rxDiv.lastIndex = 0;
		rxTitle.lastIndex = 0;
		rxP.lastIndex = 0;
		if((rxTitle.test(p)) == true && (rxP.test(p)) == false) {
			// alert("Это просто заголовок!");
			tr1.moveEnd("character", -1);
			tr1.collapse;
			tr1.select();
			nonStop = 0;
		} 
		
		else if((rxDiv.test(p)) == true && (rxP.test(p)) == false) {
			// alert("Это просто DIV!");
			nonStop = 0;
		} 
		else {
			// alert("А это возможно и эпиграф!");
			p = p.replace(new RegExp("^<DIV class=section>(?!<DIV class=title>)", "im"), "$&</DIV>\r\n");
			p = p.replace(new RegExp("^(.|[\\r\\n])+?<\/DIV>", "im"), ""); // срезаем заголовок.
			p = p.replace(new RegExp("^<DIV onresizestart=(.|[\\r\\n])+", "im"), ""); // срезаем картинку и ниже.
			p = p.replace(new RegExp("^<DIV class=(.|[\\r\\n])+", "im"), ""); // срезаем блочное и ниже.
			p = p.replace(new RegExp("^<P class=subtitle>(.|[\\r\\n])+", "im"), ""); // срезаем подзаголовок и ниже.
			
			p = p.replace(new RegExp("^((?:.*\\r\\n){"+colStr+"})(?:(?:.|[\\r\\n])+)", "gm"), "$1");  // минус явно лишние строки.
			
			p = p.replace(new RegExp("</DIV>", "g"), ""); //
			// проставляем вр. метки sup:
			p = p.replace(new RegExp("<sup>", "g"), "☺"); //
			p = p.replace(new RegExp("</sup>", "g"), "☻"); //
			p = p.replace(new RegExp("<P>&nbsp;</P>", "mgi"), "<P>∇∇∇.</P>"); //
			p = p.replace(new RegExp("&nbsp;", "g"), " "); //
			p = p.replace(new RegExp("<[^>]+>", "g"), ""); // минус теги.
			p = p.replace(new RegExp("&lt;", "g"), "<"); //
			p = p.replace(new RegExp("&gt;", "g"), ">"); //
			p = p.replace(new RegExp("&shy;", "g"), String.fromCharCode(173)); //
			p = p.replace(new RegExp("&amp;", "g"), "&"); //
			// перемещаем могущие мешать маркеры сносок из концов строк:
			p = p.replace(new RegExp("([.?…!])([ ]?(\\*+|\\[\\d+\\]|\\{\\d+\\}|☺\\d+☻)[ ]?)$", "gm"), "$2$1"); 
			p = p.replace(new RegExp("[☺☻]", "g"), ""); // удаляем вр. метки sup.
			
			// var endStr ="[\\da-zа-яё]([!?]?[\\)\\}\\]»”“*])?";
			// var initialsEnd = "[a-zа-яё]?[ ][A-ZА-ЯЁ][.]([ ]?[A-ZА-ЯЁ][.])?";
			
			// задаём регексп последней строки эпиграфа:
			// var rxEndStr = new RegExp("^.{1,80}("+endStr+"|"+initialsEnd+")$", "im"); //
			var rxEndStr = new RegExp("^.{1,80}[\\da-zа-яё]([!?]?[\\)\\}\\]»”“*])?$", "im"); //
			
			 p = p.replace(new RegExp("^(.{1,80}\\r\\n).{81,}\\r\\n[\\s\\S]*", "im"), "$1");
			
			 // p = p.replace(new RegExp("^((.+\\r\\n)+.{1,80}("+endStr+"|"+initialsEnd+")\\r\\n)[\\s\\S]*", "im"), "$1");
			 p = p.replace(new RegExp("^((.+\\r\\n)+.{1,80}[\\da-zа-яё]([!?]?[\\\\}\\]»”“*])?\\r\\n)[\\s\\S]*", "im"), "$1");
			
			if((rxEndStr.test(p)) == true) {
				
				p = p.replace(new RegExp("^∇∇∇\\.$", "mgi"), ""); //
				
				// Здесь нужно определить количество выбранных строк N. Если их больше, допустим, чем три, то фрагмент считаем эпиграфом стихами, и сумма количества символов выделенного фрагмента не должна будет превышать, например, N умн. на 80. Иначе - игнорируем. Пустые строки не считаем. 
				
				var n = (p.match(/\r\n\r?\n?/g) || []).length; // всего целых строк.
				// alert(n);
				
				p = p.replace(new RegExp("\\r\\n", "mgi"), " "); //
				// alert("Всего: "+p.length+" символов");
				var colSumb = p.length - 1;
				if(n > 3 && colSumb > n * 80) {nonStop = 0;}
				
				else {
				// выделяем:
				tr1.moveEnd("character", colSumb); //
				tr1.select();
				nonStop = 1;
				}
			} 
				else nonStop = 0;
		}
	}
	
	// ==========================================================
	
	var s;
	var tr, el, prv, pm, saveNext, saveFirstEmpty, nextPtr;
	var errMsg = "Нет выделения.\n\nПеред запуском скрипта нужно выделить абзацы, которые будут обработаны.";
	tr = document.selection.createRange();
	if(tr.parentElement().nodeName == "TEXTAREA" || tr.parentElement().nodeName == "INPUT") {
		MsgBox("Ошибка. Должно быть выделение в тексте книги, а не в поле ввода.");
		return;
	}
	// window.external.BeginUndoUnit(document, undoMsg);
	try {
		window.external.SetStatusBarText(statusBarMsg);
	} catch(e) {}
	var fbwBody = document.getElementById("fbw_body");
	// ------------------------------------------------------------------------------------------------------
	// // только первое body:
	// fbwBody = fbwBody.firstChild;
	// while(fbwBody && fbwBody.className != "body") fbwBody = fbwBody.nextSibling;
	// ============================================================
	var tr3 = document.selection.createRange();
	tr3.collapse(false);
	var ptr = tr3.parentElement();
	var blockElementAtStart = getParentWithClass(ptr, blockElementClass);
	//alert("blockEndNode: "+ptr.outerHTML);
	ptr = getNextP(ptr);
	while(ptr && fbwBody.contains(ptr)) {
		if(checkP(ptr) && getParentWithClass(ptr, blockElementClass) != blockElementAtStart) break;
		ptr = getNextP(ptr);
	}
	if(ptr && fbwBody.contains(ptr)) {
		var tr1 = document.body.createTextRange();
		var parentElem = getParentWithClass(ptr, blockElementClass);
		if(parentElem) {
			tr1.moveToElementText(parentElem);
			if(tr1.moveStart("character", 1) == 1) tr1.moveStart("character", -1);
			tr1.moveEnd("character", -1);
			// tr1.select();
			// tr1.moveEnd("character",2);
			// tr1.moveEnd("character",-1)
			// tr1.collapse(false);
			tr1.select()
			scrollIfItNeeds();
			// var scriptResult = "Found";
		}
	} else {
		// var scriptResult = "NotFound";
		MsgBox(notFoundMsg);
		nonStop = 1;
	}
	
	try {
		// window.external.SetStatusBarText("ОК");
		window.external.SetStatusBarText("Эпиграф?");
	} catch(e) {}
	
// ------------------------------------------------------------------------
	selEpi();
	// window.external.SetStatusBarText("OK!");
	// window.external.EndUndoUnit(document);	
	// return scriptResult;
}

do {
		Run1();
	} while (nonStop == 0);
	// ================================================
	
}