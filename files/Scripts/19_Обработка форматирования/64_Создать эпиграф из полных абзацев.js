// Скрипт "Создать эпиграф из полных абзацев"
// Версия 1.1
// Автор Sclex

function Run(cp,check) {

  function GoToEndOfElement(elem) {
   if(!elem) return;
   var b=elem.getBoundingClientRect();
   if (b.bottom-b.top<=window.external.getViewHeight())
    window.scrollBy(0,(b.top+b.bottom-window.external.getViewHeight())/2);
   else
    window.scrollBy(0,b.top);
   var r=document.selection.createRange();
   if (!r || !("compareEndPoints" in r)) return;
   r.moveToElementText(elem);
   r.collapse(false);
   r.select();
  }

  var check=false;
  var tr=document.selection.createRange();
  var rngStart=tr.duplicate();
  rngStart.collapse(true);
  var startEl=rngStart.parentElement();
  var rngEnd=tr.duplicate();
  rngEnd.collapse(false);
  var endEl=rngEnd.parentElement();
  //alert("endEl: "+endEl.outerHTML);
  var rng2=document.body.createTextRange();
  rng2.moveToElementText(startEl);
  tr.setEndPoint("StartToStart",rng2);
  rng2=document.body.createTextRange();
  rng2.moveToElementText(endEl);
  tr.setEndPoint("EndToEnd",rng2);
  //tr.select();
  //return;
  
  var cp=tr.parentElement();
  
  cp = GetCP(cp);
  if(!cp) return;
  //if (!check) alert("cp: "+cp.outerHTML);

  if(cp.className != "body" && cp.className != "section" && cp.className != "poem") return;

  var pp=cp.firstChild;
  if(cp.className == "body") // different order
    pp = SkipOver(pp, "title", "image", "epigraph");
  else
    pp = SkipOver(pp, "title", "epigraph", null);

  if(check) return true;

  if (document.selection.type && document.selection.type=="Control") {
   MsgBox("Вы используете не тот тип выделения, с которым работает вставка эпиграфа. Выделяйте текст для будущего эпиграфа не кликом по картинке, а движением мыши слева направо или справа налево. Либо задайте выделение, используя клавиатуру.");
   return;
  }

  var rng = tr.duplicate();
  
  var txt = "";
  var pps;

  if(rng && rng.text != "")
  {
    var dpps = document.createElement("DIV");
    dpps.innerHTML = rng.htmlText;
    pps = dpps.getElementsByTagName("P");
    if(pps.length == 0) {
     dpps.innerHTML = "<P>"+rng.htmlText+"</P>";
     pps = dpps.getElementsByTagName("P");
     if(pps.length == 0) {
      txt = rng.text;
     }
    }
  }

  window.external.BeginUndoUnit(document,"создание эпиграфа из полных абзацев");
  var ep=document.createElement("DIV");
  ep.className="epigraph";
  if(txt != "")
  {
    var pwt = document.createElement("P");
    pwt.innerHTML = txt;
    ep.appendChild(pwt);
  }
  else if(pps && pps.length > 0)
  {
    var upTag = "";
    for(i = 0; i < pps.length; ++i)
    {
      var pwt = document.createElement("P");
      if(i == pps.length - 2
         && pps[i].children
         && pps[i].children.length
         && pps[i].children.length == 1)
      {
        upTag = pps[i].children[0].tagName;
      }
      if(i == pps.length - 1)
      {
        var pptext = pps[i].innerText;
        var pptags = new Array();
        var ppall = pps[i].all;
        var j = 0;

        for(k = 0; k < ppall.length; ++k)
        {
          if(ppall[k].innerText && ppall[k].innerText == pptext)
            pptags[j++] = ppall[k].tagName;
        }

	if (pptags.length > 0 && pps.length > 1)
	{
          for(pptag in pptags)
          {
            if(pptag != upTag)
            {
              pwt.className = "text-author";
              break;
            }
          }
	}
      }
      pwt.innerHTML = pps[i].innerHTML;
      ep.appendChild(pwt);
    }
  }
  else
    ep.appendChild(document.createElement("P"));

  InsBefore(cp, pp, ep);
  InflateIt(ep);
  var rng2=document.body.createTextRange();
  rng2.moveToElementText(startEl);
  tr.setEndPoint("StartToStart",rng2);
  rng2=document.body.createTextRange();
  rng2.moveToElementText(endEl);
  tr.setEndPoint("EndToEnd",rng2);
  tr.pasteHTML("");
  if(pp && (!pp.innerText || pp.innerText == "" || pp.innerText == " ") && pp.className!="image")
    pp.removeNode(true);
  window.external.EndUndoUnit(document);

  GoToEndOfElement(ep);
}
