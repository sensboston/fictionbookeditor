// пример скрипта, размечающего документ
// данный скрипт находит в документе параграфы, не заканчивающиеся точкой и помечает их. 

// общий принцип работы пометки документа:
// Для того чтобы пометить части текста в HTML нужно эти части обрамить тегами(например DIV или SPAN) с аттрибутом class, уникальным для каждого скрипта. 
// Пометка документа происходит в функции ProcessCmd()
// Также скрипт должен содержать функцию GetClassName()


function ProcessCmd() 
{
	var divs = document.all.tags("P");
	var chet = true;
	for(var i=0; i < divs.length; i++)
	{
		if (divs[i].innerText.indexOf(".") == -1)
		{
			var range = document.body.createTextRange();
			divs[i].outerHTML = "<DIV class=\"abc\">" + divs[i].outerHTML + "</DIV>" ; 
		}	
		chet = !chet;
	}
}

function GetClassName()
{
	return "abc";
}

function GetTitle()
{
	return "Пример 1";
}