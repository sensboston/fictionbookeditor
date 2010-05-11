var IDOK     = 1;
var IDCANCEL = 2;
var IDABORT  = 3;
var IDRETRY  = 4;
var IDIGNORE = 5;
var IDYES    = 6;
var IDNO     = 7;

window.onerror = errorHandler; // document.lvl=0;
var ImagesInfo = new Array();

//======================================
// Public API
//======================================

//--------------------------------------
// Gets a binary object for the memory protocol to display book images in the browser

function FillCoverList()
{
	return FillLists();
}

function apiGetBinary(id)
{
 var bin_objects=document.all.binobj.getElementsByTagName("DIV");

 for(var i=0; i<bin_objects.length; i++)
 {
  if(bin_objects[i].all.id.value==id) return bin_objects[i].base64data;
 }
}

function OnBinaryIdChange() {
 FillLists();
}

//--------------------------------------
// Adds a binary object.
// Don't forget to call FillCoverList() when you have finished adding objects!

function apiAddBinary(fullpath, id, type, data)
{
	// check if this id already exists
	var idx = 0;
	var curid = id;
	var bo = document.all.binobj.getElementsByTagName("DIV");

	for(;;)
	{
		var found = false;
		for(var i = 0; i < bo.length; i++)
			if(bo[i].all.id.value == curid)
			{
				found = true;
				break;
			}

		if(!found) break;

		curid = id + "_" + idx;
		idx++;
	}

	var div = document.createElement("DIV");

	div.innerHTML = '<button id="del" ' +
					'onmouseover="HighlightBorder(this.parentNode, true, \'solid\', \'2px\', \'#FF0000\');" ' +
					'onmouseout="HighlightBorder(this.parentNode, false);" ' +
					'onclick="Remove(this.parentNode);" unselectable="on">&#x72;</button>';
	if(type.search("image") != -1)
	{
		imghref = "fbw-internal:#" + curid;
		div.innerHTML += '<button id="show"' +
		'onmouseover="ShowPrevImage(\'' + imghref + '\');"' +
		'onmouseout="HidePrevImage();"' +
		'onclick="ShowFullImage(\'' + imghref + '\');"' +
		'unselectable="on">&#x4e;</button>';
		div.innerHTML += '<button id="save"' +
		'onclick="SaveImage(\'' + imghref + '\');"' +
		'unselectable="on">&#xcd;</button>';
	}

	div.innerHTML += '<label unselectable="on">ID:</label><input type="text" maxlength="256" id="id" style="width:20em;"><label unselectable="on">Type:</label><input type="text" style="width:8em;" maxlength="256" id="type" value="">';
	div.innerHTML += '<label unselectable="on">Size:</label><input type="text" disabled id="size" style="width:5em;" value="' + window.external.GetBinarySize(data) + '">';

	if(type.search("image") != -1)
	{
		var Dims;

		if(fullpath != "")
			Dims = window.external.GetImageDimsByPath(fullpath);
		else
			Dims = window.external.GetImageDimsByData(data);

		if(Dims != "")
			{
				var imgWidth = Dims.substring(0, Dims.search("x"));
				var imgHeight = Dims.substring(Dims.search("x") + 1, Dims.length);
				div.innerHTML += '<label unselectable="on">w*h:</label><input type="text" disabled id="dims" style="width:6em;" value="' + imgWidth +'x' + imgHeight + '">';

				var ImageInfo = new Object();
				ImageInfo.src = imghref;
				ImageInfo.id = curid;
				ImageInfo.width = imgWidth;
				ImageInfo.height = imgHeight;

				ImagesInfo.push(ImageInfo);
			}
	}

	div.all.id.value = curid;
	div.all.type.value = type;
	div.base64data = data;
	div.all.id.setAttribute("oldId",curid);
	div.all.id.onchange=OnBinaryIdChange;

	document.all.binobj.appendChild(div);
	// PutSpacers(document.all.binobj);

	return curid;
}

function GetImageData(id)
{
	var bo = document.all.binobj.getElementsByTagName("DIV");
	for(var i = 0; i < bo.length; i++)
	{
		if(bo[i].all.id.value == id)
			return bo[i].base64data;
	}

	return;
}

function HighlightBorder(element, override, style, width, color)
{
	if(!element ||!element.style)
		return;

	if(override)
	{
		element.style.border = style + " " + width + " " + color;
	}
	else
		element.style.border = "";
}

function ShowPrevImage(source)
{
	var prevImgPanel = document.getElementById("prevImgPanel");
	var prevImg = document.getElementById("prevImg");

	if(!prevImgPanel || !prevImg) return;

	// Shouldn't be shown in Fast mode.
	/*if(window.external.IsFastMode())
		return;
	}*/

	var idx = -1;
	for(i = 0; i < ImagesInfo.length; ++i)
	{
		if(ImagesInfo[i].src == source)
		{
			idx = i;
			break;
		}
	}

	if(idx == -1)
		return;

	var imgWidth = ImagesInfo[idx].width;
	var imgHeight = ImagesInfo[idx].height;

	var btnHeight = event.srcElement.offsetHeight;

	coordX = event.clientX;
	coordY = event.clientY;

	var scrollX = 0;
	var scrollY = 0;
	if(document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft))
	{
		scrollX += document.documentElement.scrollLeft;
		scrollY += document.documentElement.scrollTop;
	}

	var winWidth = 0;;
	var winHeight = 0;
	if (document.documentElement && document.documentElement.clientWidth && document.documentElement.clientHeight)
	{
		winWidth = document.documentElement.clientWidth;
		winHeight = document.documentElement.clientHeight;
	}

	var place = "top";
	var baseWidth = coordX;
	if(baseWidth > (winWidth - coordX))
		baseWidth = winWidth - coordX;

	baseWidth = baseWidth*2;

	var baseHeight = coordY;
	if(baseHeight < (winHeight - coordY))
	{
		baseHeight =  winHeight - coordY;
		place = "bottom";
	}

	baseHeight -= btnHeight;

  var ratio;
  if (baseWidth < 200)
  {
    ratio = 200/baseWidth;
    baseWidth = 200;
    baseHeight *= ratio;
  }

  var scaleTo = "width";
  ratio = baseWidth/imgWidth;
  if(imgWidth < imgHeight)
  {
     scaleTo = "height";
     ratio = baseHeight/imgHeight;
  }

  if(imgWidth > baseWidth || imgHeight > baseHeight)
  {
    switch (scaleTo)
    {
      case "width":
        imgWidth = baseWidth;
        imgHeight = ratio * imgHeight;
        if(imgHeight > baseHeight)
        {
          ratio = baseHeight/imgHeight;
          imgHeight = baseHeight;
          imgWidth = ratio * imgWidth;
        }
      break;
      case "height":
        imgHeight = baseHeight;
        imgWidth = ratio * imgWidth;
        if(imgWidth > baseWidth)
        {
          ratio = baseWidth/imgWidth;
          imgWidth = baseWidth;
          imgHeight = ratio * imgHeight;
        }
      break;
    }
  }

	prevImg.src = source;
	prevImg.width = imgWidth ;
	prevImg.height = imgHeight;
	prevImg.style.cursor = "default";

	prevImgPanel.style.left = (coordX + scrollX - Math.round(imgWidth/2)) + "px";
	switch(place)
	{
	case "top":
		prevImgPanel.style.top = (coordY + scrollY - Math.round(imgHeight) - btnHeight) + "px";
		break;
	case "bottom":
		prevImgPanel.style.top = (coordY + scrollY + btnHeight) + "px";
		break;
	}

	setTimeout('prevImgPanel.style.visibility = "visible"', 500);
}

function HidePrevImage()
{
	var prevImgPanel = document.getElementById("prevImgPanel");
	var prevImg = document.getElementById("prevImg");

	if(!prevImgPanel || !prevImg) return;

	prevImg.src = "";
	prevImg.width = 0;
	prevImg.height = 0;
	prevImgPanel.style.visibility = "hidden";
}

function ShowFullImage(source)
{
	HidePrevImage();

	var fullImgPanel = document.getElementById("fullImgPanel");
	var fullImg = document.getElementById("fullImg");

	if(!fullImgPanel || !fullImg) return;

	var idx = -1;
	for(i = 0; i < ImagesInfo.length; ++i)
	{
		if(ImagesInfo[i].src == source)
		{
			idx = i;
			break;
		}
	}

	if(idx == -1)
		return;

	var imgWidth = ImagesInfo[idx].width;
	var imgHeight = ImagesInfo[idx].height;

	var scrollX = 0;
	var scrollY = 0;
	if(document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft))
	{
		scrollX += document.documentElement.scrollLeft;
		scrollY += document.documentElement.scrollTop;
	}

	var winWidth = 0;;
	var winHeight = 0;
	if (document.documentElement && document.documentElement.clientWidth && document.documentElement.clientHeight)
	{
		winWidth = document.documentElement.clientWidth;
		winHeight = document.documentElement.clientHeight;
	}

	fullImg.src = source;
	fullImg.width = imgWidth;
	fullImg.height = imgHeight;
	if (imgHeight < winHeight ) fullImg.style.top = ((winHeight-imgHeight) / 2)+"px";
	else fullImg.style.top = "0px";
	fullImg.style.cursor = "default";

	fullImgPanel.style.left = "0px";
	fullImgPanel.style.width = (winWidth) + "px";

	fullImgPanel.style.top = (scrollY) + "px";
	if (winHeight < imgHeight) winHeight = imgHeight;
	fullImgPanel.style.height = (winHeight) + "px";

	fullImgPanel.style.visibility = "visible";
}

function HideFullImage()
{
	var fullImgPanel = document.getElementById("fullImgPanel");
	var fullImg = document.getElementById("fullImg");

	if(!fullImgPanel || !fullImg) return;

	fullImg.src = "";
	fullImg.width = 0;
	fullImg.height = 0;
	fullImgPanel.style.visibility = "hidden";
}


function SaveImage(source)
{
  var bin_objects=document.all.binobj.getElementsByTagName("DIV");
  for(var i=0, cnt=0; i<bin_objects.length; i++)
  {

     if ("fbw-internal:#"+bin_objects[i].all.id.value == source)
     {
       window.external.SaveBinary(bin_objects[i].all.id.value, bin_objects[i].base64data, 1);
       break;
     }
  }
}

function LoadXSL(path, lang)
{
	var xslt = new ActiveXObject("Msxml2.XSLTemplate.4.0");
	var xsl = new ActiveXObject("Msxml2.FreeThreadedDOMDocument.4.0");
	xsl.async = false;
	var proc;

	xsl.load(path);
	var doc = xsl.documentElement;
	var imp = doc.firstChild;

	var ats = imp.attributes;
	var href = ats.getNamedItem("href");
	if(lang == "russian")
		href.nodeValue = "rus.xsl";
	if(lang == "english")
	    href.nodeValue = "eng.xsl";
	if (lang == "ukrainian")
	    href.nodeValue = "ukr.xsl";


	if(xsl.parseError.errorCode)
	{
		errCantLoad(xsl, path);
		return false;
	}

	xslt.stylesheet = xsl;
	return xslt;
}

function ClickOnDesc()
{
  var srcName = event.srcElement.nodeName;
  if (srcName=="FIELDSET" || srcName=="LABEL" || srcName=="DIV" ||srcName=="LEGEND") {
    document.body.focus();
  }
}

function ShowCoverImage(prntEl,fullImg)
{
 if (!prntEl) return;
 var list=prntEl.getElementsByTagName("SELECT");
 if (list[0] && list[0].value) 
  if (fullImg)
   ShowFullImage("fbw-internal:"+list[0].value);
   ShowPrevImage("fbw-internal:"+list[0].value);
}

function TransformXML(xslt, dom)
{
	var body = document.getElementById("fbw_body");
	if(!body)
	{
		return false;
	}

	var desc = document.getElementById("fbw_desc");
	if(!desc)
	{
		return false;
	}

	proc=xslt.createProcessor();
	proc.input=dom;
	proc.setStartMode("description");
	proc.transform();
	desc.innerHTML=proc.output;
	PutBinaries(dom);
	SetupDescription(desc);
	desc.onclick=ClickOnDesc;
	proc.setStartMode("body");
	proc.transform();
	body.innerHTML=proc.output;
	window.external.InflateParagraphs(body);
	document.fbwFilename=name;
	document.urlprefix="fbw-internal:";
	return true;
}

function ShowDescElements()
{
  var desc = document.getElementById("fbw_desc");
  var spans = desc.getElementsByTagName("SPAN");
  for(var i=0; i < spans.length; i++)
  {
    var elem_id = spans[i].getAttribute("id");
    if(elem_id)
      ShowElement(elem_id, window.external.GetExtendedStyle(elem_id));
  }
}

function LoadFromDOM(dom, lang)
{
	dom.setProperty("SelectionNamespaces", "xmlns:fb='"+fbNS+"' xmlns:xlink='"+xlNS+"'");
	var xpath=window.external.GetStylePath()+"\\fb2.xsl";

	var ret = TransformXML(LoadXSL(xpath, lang), dom);

	ShowDescElements();

	// transform to html
    return ret;
}

function XmlFromText(text)
{
	var xml = new ActiveXObject("Msxml2.DOMDocument.4.0");
	xml.async=false;
	xml.preserveWhiteSpace = true;
	xml.loadXML(text);
	if(xml.parseError.errorCode)
	{
		//errCantLoad(xml, path);
		return xml.parseError;
	}
	return xml;
}

function recursiveChangeNbsp(elem, repChar) {
 var el=elem;
 while (el) {
  if (el.nodeType==3) el.nodeValue=el.nodeValue.replace(/\u00A0/g, repChar);
  if (el.nodeType==1 && el.firstChild) recursiveChangeNbsp(el.firstChild, repChar);
  el=el.nextSibling;
 }
}

function apiLoadFB2(path, lang)
{
	var css=document.getElementById("css");
	var css_filename = css.href;
	css.href="";
	var xml = new ActiveXObject("Msxml2.DOMDocument.4.0");
	xml.async=false;
	xml.preserveWhiteSpace = true;

	xml.load(path);
	if(xml.parseError.errorCode)
	{
		errCantLoad(xml, path);
		return false;
	}

	pi = xml.firstChild;
	var encoding;
	if (pi)
	{
		attr = pi.attributes;
		if (attr)
		{
			enc = attr.getNamedItem("encoding");
			if(enc)
			{
				encoding = enc.text;
				//alert(encoding);
			}
		}
	}

        if (window.external.GetNBSP())
        {
    	    var nbspChar=window.external.GetNBSP();

    	    if (nbspChar != "\u00A0")
    	    {
                var el=xml.firstChild;

                while (el && el.nodeName!="FictionBook") el=el.nextSibling;

                if (el && el.firstChild)
                {
                    el=el.firstChild;
                    while (el)
                    {
                        if (el.nodeName=="body") recursiveChangeNbsp(el, nbspChar);
                        el=el.nextSibling;
                    }
                }
            }
        }

	if (!LoadFromDOM(xml, lang))
	{
		return false;
	}

	document.selection.empty();

	var desc = document.getElementById("fbw_desc");
	var id=desc.all.diID;
	if(id)
	if(path.indexOf("blank.fb2") != -1)
	{
		id.value=window.external.GetUUID();
	}
	else
	{
		id.value=id.value; // ???????? ????????? ????????. ??? ???? ??????? ??? ?????? ??? ???????? ?????????? ????? ?????? ????, ??? ???????? ? ????? ?????????.
	}


	apiShowDesc(false);
	css.href = css_filename;

	return encoding;
}

function apiShowDesc(state)
{
	var body=document.getElementById("fbw_body");
	if(!body)
		return;

	var desc=document.getElementById("fbw_desc");
	if(!desc)
		return;

	if(state)
	{
		document.ScrollSave=document.body.scrollTop;
		desc.style.display="block";
		document.body.scrollTop=0;
		body.style.display="none";
	}
	else
	{
		desc.style.display="none";
		body.style.display="block";
		document.body.scrollTop=document.ScrollSave;
	}
}

function apiRunCmd(path)
{
	var script=document.getElementById("userCmd");
	if(!script)
		return;
	script.src="file:///"+path;
	Run();
}

function apiGetClassName(path)
{
	var script=document.getElementById("userCmd");
	if(!script)
		return;
	script.src="file:///"+path;
	return GetClassName();
}

function apiGetTitle(path)
{
	var script=document.getElementById("userCmd");
	if(!script)
		return;
	script.src="file:///"+path;
	return GetTitle();
}

function apiProcessCmd(path)
{
	var script=document.getElementById("userCmd");
	if(!script)
		return;
	script.src="file:///"+path;
	ProcessCmd();
}

function SetInFrame(range, tagName, className)
{
	range.pasteHTML("<" + tagName + " classname=\"" + className + "\">" + range.htmlText + "</" + tagName + ">");
}

function RemoveOuterTags(node)
{
	node.removeNode(false);
}

function apiCleanUp(className)
{
	var divs = document.all.tags("DIV");
	for(var i=0; i < divs.length; i++)
	{
		if (divs[i].className == className)
			RemoveOuterTags(divs[i]);
	}
}

function apiCheckRunnableScript()
{
  try
  {
    if(Run)
    {
      return true;
    }
  }
  catch(e)
  {
    return false;
  }
}

function apiSetFastMode(fast)
{
  var css=document.getElementById("css");
  if(!css)
    return;

  if(fast)
    css.href="main_fast.css";
  else
    css.href="main.css";
}

//======================================
// Internal private functions
//======================================

function MsgBox(str)
{
	window.external.MsgBox(str);
}
function AskYesNo(str)
{
	return window.external.AskYesNo(str);
}
function InputBox(msg, value, result)
{
	return window.external.InputBox(msg, "FBE script message", value, result);
}
//--------------------------------------
// Our own, less scary error handler

function errorHandler(msg,url,lno)
{
	MsgBox("Error at line "+lno+":\n"+msg+" ");
	return true;
}

function errCantLoad(xd,file)
{
	MsgBox("\""+file+"\" loading error:\n\n"+xd.parseError.reason+"  \nLine: "+xd.parseError.line+", char: "+xd.parseError.linepos+"\n");
}

function FillImageList(list, bin_objects)
{
	if(list.id=='href')
	{
		var cover=list.value;

		list.innerHTML='';

		var newopt=document.createElement('option');
		newopt.value='';
		newopt.innerHTML='';
		list.appendChild(newopt);

		for(var j=0; j<bin_objects.length; j++)
		{
			var pic_id=bin_objects[j].all.id.value;

			if(pic_id.toLowerCase().indexOf(".jpg")==-1 && pic_id.toLowerCase().indexOf(".png")==-1  && pic_id.toLowerCase().indexOf(".jpeg")==-1)
			{
				continue;
			}

			var newopt=document.createElement('option');
			newopt.value='#'+pic_id;
			newopt.innerHTML=pic_id;

			if(newopt.value==cover)
			{
				newopt.selected=true;
			}

			list.appendChild(newopt);
		}
	}
}

function FillLists()
{
	var bin_objects = document.all.binobj.getElementsByTagName("DIV");

	var lists=document.all.tiCover.getElementsByTagName("select"); // drop-down lists
	for(var i=0; i<lists.length; i++)
	{
		FillImageList(lists[i], bin_objects);
	}

	var stilists=document.all.stiCover.getElementsByTagName("select"); // drop-down lists
	for(var i=0; i<stilists.length; i++)
	{
		FillImageList(stilists[i], bin_objects);
	}
}

function SelectLanguages()
{

	var list=document.getElementById("tiLang");
	var sel=list.value;

	var opts=list.getElementsByTagName("option");

	for(var i=0; i<opts.length; i++)
	{
		if(opts[i].innerHTML=="-org-")
			opts[i].removeNode(true);
		else if(opts[i].value==sel)
			opts[i].selected=true;
	}


	var list=document.getElementById("tiSrcLang");
	var sel=list.value;

	var opts=list.getElementsByTagName("option");

	for(var i=0; i<opts.length; i++)
	{
		if(opts[i].innerHTML=="-org-")
			opts[i].removeNode(true);
		else if(opts[i].value==sel)
			opts[i].selected=true;
	}

	var list=document.getElementById("stiLang");
	var sel=list.value;

	var opts=list.getElementsByTagName("option");

	for(var i=0; i<opts.length; i++)
	{
		if(opts[i].innerHTML=="-org-")
			opts[i].removeNode(true);
		else if(opts[i].value==sel)
			opts[i].selected=true;
	}


	var list=document.getElementById("stiSrcLang");
	var sel=list.value;

	var opts=list.getElementsByTagName("option");

	for(var i=0; i<opts.length; i++)
	{
		if(opts[i].innerHTML=="-org-")
			opts[i].removeNode(true);
		else if(opts[i].value==sel)
			opts[i].selected=true;
	}
}
//-----------------------------------------------
// Generates new ID and puts it into the field

function NewDocumentID()
{
	var desc=document.getElementById("fbw_desc");
	if(!desc)
		return;

	if(AskYesNo("\nAre you sure you want to generate a new ID? \n\nThis will affect library submission.\nPrevious value will be lost!\n\n"))
	{
		desc.all.diID.value=window.external.GetUUID();
	}
}
//-----------------------------------------------
// Puts lines to space cloned elements in description
// Also prevents deletion of last element

function PutSpacers(obj)
{
 if(obj.id=="binobj") return;

 var divs=obj.getElementsByTagName("DIV"); if(divs.length==0) return;

 var s=0;

 if(obj.nodeName!="DIV")
 {
  divs[0].style.marginTop="0";
  divs[0].style.paddingTop="0";
  divs[0].style.borderTop="none";
  divs[0].all.del.disabled=(divs.length<=1);
  s=1;
 }

 for(var i=s; i<divs.length; i++)
 {
  divs[i].all.del.disabled=false;
  divs[i].style.marginTop="0.2em";
  divs[i].style.paddingTop="0.2em";
  divs[i].style.borderTop="solid #D0D0BF 1px";
 }
}
//-----------------------------------------------
// Puts spacers between all clones in description

function InitFieldsets()
{
 var fss=document.body.getElementsByTagName("fieldset");
 for(var i=0; i<fss.length; i++) PutSpacers(fss[i]);
}
//-----------------------------------------------
// Initializes default fields if needed.
// Initializes fieldsets.

function SetDocumentVersion(desc)
{
	var version=desc.all.diVersion;
	if(version && version.value=="")
		version.value="1.0";
}

function SetProgramUsed(desc)
{
  var prgs = desc.all.diProgs;
  var ver;

  if(prgs)
  {
    ver = window.external.GetProgramVersion();

    if(prgs.value == "")
      prgs.value = ver;
    else
    {
      if(prgs.value.search("FictionBook Editor") == -1)
      {
        prgs.value += ", "+ver;
      }
    }
  }
}

function SetCurrentDate(desc)
{
	var date=new Date();
	var ms=Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

	var year=date.getFullYear();
	var day=date.getDate();
	if(day<10)
		day="0"+day;

	var  mon=date.getMonth() + 1;

	if(mon<10)
		mon="0"+mon;

	var dt=desc.all.diDate;
	if(dt && dt.value.length==0)
		dt.value = day+" "+ms[mon - 1]+" "+year;

	var dv=desc.all.diDateVal;
	if(dv && dv.value.length==0)
		dv.value = year +"-"+mon  +"-"+day;
}



function SetupDescription(desc)
{
	SetDocumentVersion(desc);
	SetProgramUsed(desc);
	SetCurrentDate(desc)

	var DocumentID=desc.all.diID;
	if(DocumentID && DocumentID.value=="")
		DocumentID.value=window.external.GetUUID();

	InitFieldsets();

	SelectLanguages();
}
//-----------------------------------------------

//function InflateParagraphs(e)
//{
// var ps = e.getElementsByTagName("P");
// for(var i=0; i<ps.length; i++) window.external.inflateBlock(ps[i])=true;

// for(var i=0; i<ps.length; i++)
//  if(ps[i].innerHTML=="") ps[i].innerHTML="&nbsp;";
//}
//-----------------------------------------------

function InflateIt(elem) // Seems the same as above...
{
 if(!elem || elem.nodeType!=1) return;

 if(elem.tagName=="P"){  window.external.inflateBlock(elem)=true; return; }

 elem=elem.firstChild;

 while(elem){ InflateIt(elem); elem=elem.nextSibling; }
}
//--------------------------------------
// Shows Genres menu and gets the genre

function GetGenre(d)
{
 var v=window.external.GenrePopup(d, window.event.screenX, window.event.screenY);
 if(v.length>0){ d.parentNode.all.genre.value=v; }
}
//--------------------------------------

function dClone(obj)
{
 var qn=obj.cloneNode(true); var cn=qn.firstChild;

 while(cn)
 {
  var nn=cn.nextSibling; if(cn.nodeName=="DIV") cn.removeNode(true);

  cn=nn;
 }
 return qn;
}
//-------------------

function Remove(obj)
{
	var pic_id = "";

	if(obj.base64data != null) // this is a binary object
	{
		if(obj.all.type.value.search("image") != -1)
		{
			var idx = -1;
			for(i = 0; i < ImagesInfo.length; ++i)
			{
				if(ImagesInfo[i].id == obj.all.id.value)
				{
					idx = i;
					break;
				}
			}

			if(idx != -1)
				ImagesInfo.splice(idx, 1);
		}

		var inpts = obj.getElementsByTagName("input");

		if(inpts[0].id=="id") pic_id = inpts[0].value; else
		if(inpts[1].id=="id") pic_id = inpts[1].value;
	}

 // delete

 var pn=obj.parentNode; obj.removeNode(true); PutSpacers(pn);

 // update images

 if(pic_id!="")
 {
  pic_id="fbw-internal:#"+pic_id;

  var imgs=document.getElementsByTagName("IMG");

  for(var i=0; i<imgs.length; i++)
   if(imgs[i].src==pic_id)
   {
    imgs[i].src=""; imgs[i].src=pic_id; break; // force image update
   }

  // update Cover lists

  FillLists();
 }
}
//-------------------

function Clone(obj)
{
 obj.insertAdjacentElement("afterEnd",dClone(obj)); PutSpacers(obj.parentNode);

 if(obj.id=='href') FillLists(); // this is the Cover field
}
//-------------------

function ChildClone(obj)
{
 obj.appendChild(dClone(obj)); PutSpacers(obj);
}
//--------------------------------------

//// == DESC == ///////////////////////////////////////////////////////////////////


var fbNS="http://www.gribuser.ru/xml/fictionbook/2.0";
var xlNS="http://www.w3.org/1999/xlink";

function Indent(node,len)
{
 var s="\r\n"; while (len--) s=s+" ";

 node.appendChild(node.ownerDocument.createTextNode(s));
}

function SetAttr(node,name,val)
{
 var an=node.ownerDocument.createNode(2,name,fbNS);
 an.appendChild(node.ownerDocument.createTextNode(val));
 node.setAttributeNode(an);
}

function MakeText(node,name,val,force,indent)
{
 var ret=true;
 if(val.length==0)
 {
  if(!force) return false;
  ret=false;
 }
 var tn=node.ownerDocument.createNode(1,name,fbNS);
 tn.appendChild(node.ownerDocument.createTextNode(val));
 Indent(node,indent);
 node.appendChild(tn);
 return ret;
}

function MakeAuthor(node,name,dv,force,indent)
{
 var au=node.ownerDocument.createNode(1,name,fbNS);
 var added=false;
 if(dv.all.first.value.length>0 || dv.all.middle.value.length>0 ||
      dv.all.last.value.length>0 || dv.all.nick.value.length==0)
 {
  added=MakeText(au,"first-name",dv.all.first.value,true,indent+1) || added;
  added=MakeText(au,"middle-name",dv.all.middle.value,false,indent+1) || added;
  added=MakeText(au,"last-name",dv.all.last.value,true,indent+1) || added;
  if(dv.all.id)
	added=MakeText(au,"id",dv.all.id.value,false,indent+1) || added;
 }
 added=MakeText(au,"nickname",dv.all.nick.value,false,indent+1) || added;
 added=MakeText(au,"home-page",dv.all.home.value,false,indent+1) || added;
 added=MakeText(au,"email",dv.all.email.value,false,indent+1) || added;

 if(added || force)
 {
  Indent(node,indent); node.appendChild(au); Indent(au,indent);
 }

 return added;
}

function MakeDate(node,d,v,indent)
{
 var dt=node.ownerDocument.createNode(1,"date",fbNS);
 var added=false;
 if(v.length>0){ added=true; SetAttr(dt,"value",v); }
 if(d.length>0) added=true;

 dt.appendChild(node.ownerDocument.createTextNode(d));
 Indent(node,indent);
 node.appendChild(dt);
 return added;
}

function MakeSeq2(xn,hn,indent)
{
 var added=false;
 var newxn=xn.ownerDocument.createNode(1,"sequence",fbNS);
 var name=hn.all("name",0).value;
 var num=hn.all("number",0).value;
 SetAttr(newxn,"name",name);
 if(num.length > 0) SetAttr(newxn,"number",num);

 for(var cn=hn.firstChild;cn;cn=cn.nextSibling)
   if(cn.nodeName=="DIV")  added=MakeSeq2(newxn,cn,indent+1) || added;

 if(added || name.length>0 || num.length>0)
 {
   Indent(xn,indent);
   xn.appendChild(newxn);
   if(newxn.hasChildNodes()) Indent(newxn,indent);
   added=true;
 }
 return added;
}

function MakeSeq(xn,hn,indent)
{
  var added=false;
  for(var cn=hn.firstChild;cn;cn=cn.nextSibling)
    if(cn.nodeName=="DIV") added=MakeSeq2(xn,cn,indent) || added;

  return added;
}

function IsEmpty(ii)
{
  if(!ii || !ii.hasChildNodes()) return true;

  for(var v=ii.firstChild;v;v=v.nextSibling)
    if(v.nodeType==1 && v.baseName!="empty-line") return false;

  return true;
}

function MakeTitleInfo(doc,desc,ann,indent)
{
 var ti=doc.createNode(1,"title-info",fbNS);
 Indent(desc,indent);
 desc.appendChild(ti);

 // genres
 var list=document.all.tiGenre.getElementsByTagName("DIV");
 for(var i=0; i<list.length; i++)
 {
  var ge=doc.createNode(1,"genre",fbNS);
  if (list.item(i).all.match)
  {
    var match=list.item(i).all.match.value;
    if(match.length>0 && match!="100") SetAttr(ge,"match",match);
  }

  ge.appendChild(doc.createTextNode(list.item(i).all.genre.value));
  Indent(ti,indent+1);
  ti.appendChild(ge);
 }

 // authors
 var added=false;
 list=document.all.tiAuthor.getElementsByTagName("DIV");
 for(var i=0; i<list.length; i++) added=MakeAuthor(ti,"author",list.item(i),false,indent+1) || added;

 if(!added && list.length>0) MakeAuthor(ti,"author",list.item(0),true,indent+1);

 MakeText(ti,"book-title",document.all.tiTitle.value,true,indent+1);

 // annotation, will be filled by body.xsl
 if(!IsEmpty(ann)){ Indent(ti,indent+1); ti.appendChild(ann); }

 MakeText(ti,"keywords",document.all.tiKwd.value,false,indent+1);
 MakeDate(ti,document.all.tiDate.value,document.all.tiDateVal.value,indent+1);

 // coverpage images
 list=document.all.tiCover.getElementsByTagName("DIV");
 var cp=doc.createNode(1,"coverpage",fbNS);
 for(var i=0; i<list.length; i++)
   if(list.item(i).all.href.value.length>0)
   {
     var xn=doc.createNode(1,"image",fbNS);
     var an=doc.createNode(2,"l:href",xlNS);
     an.appendChild(doc.createTextNode(list.item(i).all.href.value));
     xn.setAttributeNode(an);
     Indent(cp,indent+2);
     cp.appendChild(xn);
   }
 if(cp.hasChildNodes)
 {
   Indent(ti,indent+1); ti.appendChild(cp);
 }

 MakeText(ti,"lang",document.all.tiLang.value,false,indent+1);
 MakeText(ti,"src-lang",document.all.tiSrcLang.value,false,indent+1);

 // translator
 list=document.all.tiTrans.getElementsByTagName("DIV");

 for(var i=0; i<list.length; i++) MakeAuthor(ti,"translator",list.item(i),false,indent+1);

 // sequence
 MakeSeq(ti,document.all.tiSeq,indent+1);
 Indent(ti,indent);
}

function IsAuthorExist(node,name,dv) {
  var au=node.ownerDocument.createNode(1,name,fbNS);
  var exist=false;
  if (dv.all.first.value.length>0 || dv.all.middle.value.length>0 ||
      dv.all.last.value.length>0 || dv.all.nick.value.length==0) {
    exist=IsTextExist(dv.all.first.value) || exist;
    exist=IsTextExist(dv.all.middle.value) || exist;
    exist=IsTextExist(dv.all.last.value) || exist;
  }
  exist=IsTextExist(dv.all.nick.value) || exist;
  exist=IsTextExist(dv.all.home.value) || exist;
  exist=IsTextExist(dv.all.email.value) || exist;

  return exist;
}

function IsTextExist(val) {
  if (val.length==0)
      return false;
  return true;
}

function IsSeqExist2(xn,hn) {
  var exist=false;
  var newxn=xn.ownerDocument.createNode(1,"sequence",fbNS);
  var name=hn.all("name",0).value;
  var num=hn.all("number",0).value;
  SetAttr(newxn,"name",name);
  if (num.length > 0)
    SetAttr(newxn,"number",num);
  for (var cn=hn.firstChild;cn;cn=cn.nextSibling) {
    if (cn.nodeName=="DIV")
      exist=IsSeqExist2(newxn,cn) || exist;
  }
  if (exist || name.length>0 || num.length>0)
    exist=true;

  return exist;
}

function IsSeqExist(xn,hn) {
  var exist=false;
  for (var cn=hn.firstChild;cn;cn=cn.nextSibling)
    if (cn.nodeName=="DIV")
      exist=IsSeqExist2(xn,cn) || exist;
  return exist;
}

function IsSTBFieldTextExist(sti,desc,doc) {
  var exist=false;

  // authors
  var list=document.all.stiAuthor.getElementsByTagName("DIV");
  for (var i=0;i<list.length;++i)
  {
    exist=IsAuthorExist(sti,"author",list.item(i)) || exist;
	}
  //if (!exist && list.length>0)
    //exist=false;

  // book title
  exist=IsTextExist(document.all.stiTitle.value) || exist;

  // genres
  list=document.all.stiGenre.getElementsByTagName("DIV");
  for (var i=0;i<list.length;++i) {
    var ge=doc.createNode(1,"genre",fbNS);
    var match=list.item(i).all.match.value;
    var g=list.item(i).all.genre.value;
    if (g.length>0)
      exist=true || exist;
    if (match.length>0 && match!="100"){
      exist=true || exist;
    }
  }

  // annotation, will be filled by body.xsl
  /*if (!IsEmpty(ann)) {
    exist=true;
  }*/

  // keywords
  exist=IsTextExist(document.all.stiKwd.value) || exist;

  // date
  var dt=sti.ownerDocument.createNode(1,"date",fbNS);
  if (document.all.stiDateVal.value.length>0)
    exist=true;
  if (document.all.stiDate.value.length>0)
    exist=true;

  // coverpage images
  list=document.all.stiCover.getElementsByTagName("DIV");
  var cp=doc.createNode(1,"coverpage",fbNS);
  for (var i=0;i<list.length;++i) {
    if (list.item(i).all.href.value.length>0)
      exist=true;
  }
  if (cp.hasChildNodes)
    exist=true;

  // lang
  exist=IsTextExist(document.all.stiLang.value) || exist;
  exist=IsTextExist(document.all.stiSrcLang.value) || exist;

  // translator
  list=document.all.stiTrans.getElementsByTagName("DIV");
  for (var i=0;i<list.length;++i)
    exist=IsAuthorExist(sti,"translator",list.item(i)) || exist;

  // sequence
  exist=IsSeqExist(sti,document.all.stiSeq) || exist;

  return exist;
}

function MakeSourceTitleInfo(doc,desc,ann,indent)
{
	var sti=doc.createNode(1,"src-title-info",fbNS);
	if(IsSTBFieldTextExist(sti,desc,doc))
	{
		Indent(desc,indent);
		desc.appendChild(sti);

		// genres
		var list=document.all.stiGenre.getElementsByTagName("DIV");
		for (var i=0;i<list.length;++i)
		{
			var ge=doc.createNode(1,"genre",fbNS);
			var match=list.item(i).all.match.value;
			if (match.length>0 && match!="100")
				SetAttr(ge,"match",match);
			ge.appendChild(doc.createTextNode(list.item(i).all.genre.value));
			Indent(sti,indent+1);
			sti.appendChild(ge);
		}

		// authors
		var added=false;
		list=document.all.stiAuthor.getElementsByTagName("DIV");
		for (var i=0;i<list.length;++i)
			added=MakeAuthor(sti,"author",list.item(i),false,indent+1) || added;
		if (!added && list.length>0)
			MakeAuthor(sti,"author",list.item(0),true,indent+1);

		MakeText(sti,"book-title",document.all.stiTitle.value,true,indent+1);
		MakeText(sti,"keywords",document.all.stiKwd.value,false,indent+1);
		MakeDate(sti,document.all.stiDate.value,document.all.stiDateVal.value,indent+1);

		// coverpage images
		list=document.all.stiCover.getElementsByTagName("DIV");
		var cp=doc.createNode(1,"coverpage",fbNS);
		for (var i=0;i<list.length;++i)
			if (list.item(i).all.href.value.length>0)
			{
				var xn=doc.createNode(1,"image",fbNS);
				var an=doc.createNode(2,"l:href",xlNS);
				an.appendChild(doc.createTextNode(list.item(i).all.href.value));
				xn.setAttributeNode(an);
				Indent(cp,indent+2);
				cp.appendChild(xn);
			}
		if (cp.hasChildNodes)
		{
			Indent(sti,indent+1);
			sti.appendChild(cp);
		}

		MakeText(sti,"lang",document.all.stiLang.value,false,indent+1);
		MakeText(sti,"src-lang",document.all.stiSrcLang.value,false,indent+1);

		// translator
		list=document.all.stiTrans.getElementsByTagName("DIV");
		for (var i=0;i<list.length;++i)
		  MakeAuthor(sti,"translator",list.item(i),false,indent+1);

		// sequence
		MakeSeq(sti,document.all.stiSeq,indent+1);
		Indent(sti,indent);
	}
}

function MakeDocInfo(doc,desc,hist,indent)
{
 var added=false; var di=doc.createNode(1,"document-info",fbNS);

 // authors
 var i; var list=document.all.diAuthor.getElementsByTagName("DIV");

 for(i=0; i<list.length; i++) added=MakeAuthor(di,"author",list.item(i),false,indent+1) || added;

 if(!added && list.length>0) MakeAuthor(di,"author",list.item(0),true,indent+1);

 added=MakeText(di,"program-used",document.all.diProgs.value,false,indent+1) || added;
 added=MakeDate(di,document.all.diDate.value,document.all.diDateVal.value,indent+1) || added;

 // src-url
 list=document.all.diURL.getElementsByTagName("INPUT");
 for(i=0; i<list.length; i++) added=MakeText(di,"src-url",list.item(i).value,false,indent+1) || added;

 added=MakeText(di,"src-ocr",document.all.diOCR.value,false,indent+1) || added;
 added=MakeText(di,"id",document.all.diID.value,true,indent+1) || added;
 added=MakeText(di,"version",document.all.diVersion.value,true,indent+1) || added;

 // history
 if(!IsEmpty(hist))
 {
  Indent(di,indent+1); di.appendChild(hist); added=true;
 }

  // only append document info it is non-empty
 if(added)
 {
  Indent(desc,indent); desc.appendChild(di); Indent(di,indent);
 }
}

function MakePubInfo(doc,desc,indent)
{
 var added=false; var pi=doc.createNode(1,"publish-info",fbNS);

 added=MakeText(pi,"book-name",document.all.piName.value,false,indent+1) || added;
 added=MakeText(pi,"publisher",document.all.piPub.value,false,indent+1) || added;
 added=MakeText(pi,"city",document.all.piCity.value,false,indent+1) || added;
 added=MakeText(pi,"year",document.all.piYear.value,false,indent+1) || added;
 added=MakeText(pi,"isbn",document.all.piISBN.value,false,indent+1) || added;

 // sequence
 added=MakeSeq(pi,document.all.piSeq,indent+1) || added;

 // only append publisher info it is non-empty
 if(added)
 {
  Indent(desc,indent);
  desc.appendChild(pi);
  Indent(pi,indent);
 }
}

function MakeCustInfo(doc,desc,indent)
{
 var list=document.all.ci.getElementsByTagName("DIV");

 for(var i=0; i<list.length; i++)
 {
  var t=list.item(i).all.type.value;
  var v=list.item(i).all.val.value;
  if(t.length>0 || v.length>0)
  {
   var ci=doc.createNode(1,"custom-info",fbNS);
   SetAttr(ci,"info-type",t);
   ci.appendChild(doc.createTextNode(v));
   Indent(desc,indent);
   desc.appendChild(ci);
  }
 }
}

function MakeStylesheets(doc,indent)
{
 if (!document.getElementById("stylesheetId")) return;
 var s=document.getElementById("stylesheetId").value;
 if (s=="") return;
 var styles=doc.createNode(1,"stylesheet",fbNS);
 SetAttr(styles, "type", "text/css");
 Indent(doc.documentElement,1);
 doc.documentElement.appendChild(styles);
 Indent(styles,1);
 styles.appendChild(doc.createTextNode(s));
}

function GetDesc(doc,ann,hist)
{
 MakeStylesheets(doc,1);
 var desc=doc.createNode(1,"description",fbNS);
 Indent(doc.documentElement,1);
 doc.documentElement.appendChild(desc);
 MakeTitleInfo(doc,desc,ann,2);
 MakeSourceTitleInfo(doc,desc,ann,2);
 MakeDocInfo(doc,desc,hist,2);
 MakePubInfo(doc,desc,2);
 MakeCustInfo(doc,desc,2);
 Indent(desc,1);
}

function GetBinaries(doc)
{
 var bo=document.all.binobj.getElementsByTagName("DIV");
 for(var i=0; i<bo.length; i++)
 {
  var newb=doc.createNode(1,"binary",fbNS);
  newb.dataType="bin.base64";
  newb.nodeTypedValue=bo[i].base64data;

  SetAttr(newb,"id",bo[i].all.id.value);
  SetAttr(newb,"content-type",bo[i].all.type.value);

  newb.dataType=undefined;
  Indent(doc.documentElement,1);
  doc.documentElement.appendChild(newb);
 }
}

// load a list of binary objects from document
function PutBinaries(doc)
{
 var nerr=0; var bl=doc.selectNodes("/fb:FictionBook/fb:binary");

 for(var i=0; i<bl.length; i++)
 {
  if(bl[i].tagName!="binary") continue;

  bl[i].dataType="bin.base64";
  var id=bl[i].getAttribute("id"); var dt;

  try
  {
   dt=bl[i].nodeTypedValue;
  }
  catch(e)
  {
   if(nerr++<3) MsgBox("Invalid base64 data for "+id);  continue;
  }

  apiAddBinary("", id, bl[i].getAttribute("content-type"),dt);
 }

 if(nerr>3){ nerr-=3; MsgBox(nerr+" more invalid images ignored"); }

 // update Cover lists

 FillLists();
}

//// == BODY == ///////////////////////////////////////////////////////////////////

function KillDivs(e)
{
 var divs = e.getElementsByTagName("DIV");

 while(divs.length > 0) divs[0].removeNode(false);
}
//-----------------------------------------------

function GoTo(elem)
{
 if(!elem) return;
 var b=elem.getBoundingClientRect();
 if (b.bottom-b.top<=window.external.getViewHeight())
  window.scrollBy(0,(b.top+b.bottom-window.external.getViewHeight())/2);
 else
  window.scrollBy(0,b.top);
 var r=document.selection.createRange();
 if (!r || !("compareEndPoints" in r)) return;
 r.moveToElementText(elem);
 r.collapse(true);
 if(r.parentElement!==elem && r.move("character",1)==1) r.move("character",-1);
 r.select();
}
//-----------------------------------------------

function SkipOver(np,n1,n2,n3)
{
 while (np)
 {
  if(!(np.tagName=="P" && !np.firstChild && !window.external.inflateBlock(np)) &&  // not an empty P
	(!n1 || (np.tagName!=n1 && np.className!=n1)) && // and not n1
	(!n2 || (np.tagName!=n2 && np.className!=n2)) && // and not n2
	(!n3 || (np.tagName!=n3 && np.className!=n3)))   // and not n3
      break;
   np=np.nextSibling;
 }
 return np;
}
//-----------------------------------------------

function StyleCheck(cp,st)
{
 if(!cp || cp.tagName != "P") return false;

 var pp=cp.parentElement;
 if(!pp || pp.tagName != "DIV") return false;

 switch (st)
 {
  case "":
      if(pp.className!="section" && pp.className!="title" && pp.className!="epigraph" &&
	  pp.className!="stanza" && pp.className!="cite" && pp.className!="annotation" &&
	  pp.className!="history")
	return false;
  break;

  case "subtitle":
    if(pp.className!="section" && pp.className!="stanza" && pp.className!="cite" && pp.className != "annotation")
      return false;
  break;

  case "text-author":
    if(pp.className!="cite" && pp.className!="epigraph" && pp.className!="poem") return false;
    if((cp.nextSibling && cp.nextSibling.className!="text-author")) return false;
  break;

  case "code":
    if((cp.className == "text-author" || cp.className == "subtitle" && pp.className == "section") ||
         (pp.className == "stanza" && cp.tagName == "P") ||
         (cp.className == "" && pp.className == "section" && cp.tagName == "P") ||
         ((cp.className == "td" || cp.className == "th") && pp.className == "tr"))
      return true;
    else
      return false;

  break;
 }

 return true;
}
//-----------------------------------------------

function SetStyle(cp,check,name)
{
 if(!StyleCheck(cp,name)) return;

 if(check) return true;

 if(name.length==0) name="normal";

 window.external.BeginUndoUnit(document,name+" style");
 window.external.SetStyleEx(document, cp, name);
 //cp.className=name;
 window.external.EndUndoUnit(document);
}
//-----------------------------------------------

function StyleNormal(cp,check)
{
  return SetStyle(cp,check,"");
}
//-----------------------------------------------

function StyleTextAuthor(cp,check)
{
  return SetStyle(cp,check,"text-author");
}
//-----------------------------------------------

function StyleSubtitle(cp,check)
{
  return SetStyle(cp,check,"subtitle");
}
//-----------------------------------------------

function StyleCode(check, cp, range)
{
  if(check && cp && range)
  {
    // That is due to MSHTML bug
    if(cp.tagName == "P")
    {
      html = new String(range.htmlText);
      if(html.indexOf("<DIV") != -1)
      {
        return false;
      }
    }

    if(cp.tagName == "DIV" && cp.className == "section")
    {
      var end = range.duplicate();
      range.collapse(true);
      end.collapse(false);

      per = range.parentElement();
      ped = end.parentElement();

      while(per && per.tagName != "P")
        per = per.parentElement;
      while(ped && ped.tagName != "P")
        ped = ped.parentElement;

      if(per && ped && per.parentElement == ped.parentElement)
      {
        return true;
      }
    }
  }


  return SetStyle(cp, check, "code");
}

function IsCode(cp)
{
  while(cp && cp.tagName != "DIV")
  {
    if(cp.tagName == "SPAN" && cp.className == "code")
      return true;
    cp = cp.parentElement;
  }
  return false;
}

function TextIntoHTML(s) {
 if (!s) return "";
 var re0=new RegExp("&");
 var re0_="&amp;";
 var re1=new RegExp("<","g");
 var re1_="&lt;";
 var re2=new RegExp(">","g");
 var re2_="&gt;";
 return s.replace(re0,re0_).replace(re1,re1_).replace(re2,re2_);
}

function AddTitle(cp, check)
{
  if(!cp)
    return;

  if(cp.tagName == "P")
    cp = cp.parentElement;

  if(cp.tagName != "DIV")
    return;

  if(cp.className != "body" && cp.className != "section" && cp.className != "stanza" && cp.className != "poem")
    return;

  var np = cp.firstChild;
  if(np)
  {
    if(cp.className == "body" && np.tagName == "DIV" && np.className == "image")
      np = np.nextSibling;
    if(np.tagName == "DIV" && np.className == "title")
      return;
  }

  var sel = document.selection.createRange();
  if (sel)
    if (sel.text)
      if(cp.innerText.length < sel.text.length)
        return;

  if(check)
    return true;

  window.external.BeginUndoUnit(document, "add title");

  var div = document.createElement("DIV");
  div.className = "title";

  targ = np.tagName;
  //full = (sel.text == cp.innerText);

  var del = false;

  if(sel.text == "" || cp.className=="body")
  {
    var pp = document.createElement("P");
    pp.innerText="";
    window.external.inflateBlock(pp) = true;
    div.appendChild(pp);
  } else {
    if(sel.htmlText.indexOf("<DIV") == -1)
    {
      div.innerHTML = "<P>"+TextIntoHTML(sel.text).replace(/\r+\n/gi,"</P><P>")+"</P>";
      del = true;
    }
  }

//  if(full)
//  {
//    var nps = np.nextSibling;
//    while(nps)
//    {
//      nps.removeNode(true);
//      nps = np.nextSibling;
//    }

//    switch(targ)
//    {
//      case "P":
//        np.innerText = "";
//        break;
//      case "DIV":
//        while(np)
//        {
//          var nps = np.nextSibling;
//          while(nps)
//          {
//            nps.removeNode(true);
//            nps = np.nextSibling;
//          }

//          if(np.tagName == "P")
//          {
//            var nps = np.nextSibling;
//            while(nps)
//            {
//              nps.removeNode(true);
//              nps = np.nextSibling;
//            }
//            np.innerText = "";
//            window.external.inflateBlock(np) = true;
//            break;
//          }
//          else
//            np = np.firstChild;
//        }

//        if(cp.className == "body")
//        {
//          cp = cp.firstChild.nextSibling;
//          while(np.parentElement && np.parentElement != cp)
//          {
//            np.parentElement.removeNode(false);
//          }
//        }
//        else if(cp.className == "section")
//        {
//          while(np.parentElement && np.parentElement != cp)
//          {
//            np.parentElement.removeNode(false);
//          }
//        }
//        break;
//    }
//  }
  if(del)
  {
    sel.text = "";
  }

  InsBefore(cp, np, div);

  GoTo(div);

  window.external.EndUndoUnit(document);
}

//-----------------------------------------------

function AddBody(check)
{
 if(check) return true;

 window.external.BeginUndoUnit(document,"add body");
 var newbody=document.createElement("DIV");
 newbody.className="body";
 newbody.innerHTML='<DIV class="title"><P></P></DIV><DIV class="section"><P></P></DIV>';

 var body = document.getElementById("fbw_body"); if(!body) return false;

 body.appendChild(newbody);
 InflateIt(newbody);
 window.external.EndUndoUnit(document);
 GoTo(newbody);
}
//-----------------------------------------------

function GetCP(cp)
{
 if(!cp) return;

 if(cp.tagName=="P") cp=cp.parentElement;

 if(cp.tagName=="DIV" && cp.className=="title") cp=cp.parentElement;

 if(cp.tagName!="DIV") return;

 return cp;
}
//-----------------------------------------------

function InsBefore(parent,ref,item)
{
 if(ref)  ref.insertAdjacentElement("beforeBegin",item);
 else  parent.insertAdjacentElement("beforeEnd",item);
}
//-----------------------------------------------

function InsBeforeHTML(parent,ref,ht)
{
 if(ref)  ref.insertAdjacentHTML("beforeBegin",ht);
 else  parent.insertAdjacentHTML("beforeEnd", ht);
}
//-----------------------------------------------

function CloneContainer(cp,check)
{
 cp=GetCP(cp); if(!cp) return;

 switch(cp.className)
 {
  case "section": case "poem": case "stanza": case "cite": case "epigraph": break;
  default: return;
 }

 if(check) return true;

 window.external.BeginUndoUnit(document,"clone "+cp.className);
 var ncp=cp.cloneNode(false);

 switch (cp.className)
 {
  case "section": ncp.innerHTML='<DIV class="title"><P></P></DIV><P></P>'; break;
  case "poem":    ncp.innerHTML='<DIV class="title"><P></P></DIV><DIV class="stanza"><P></P></DIV>'; break;

  case "stanza": case "cite": case "epigraph": ncp.innerHTML='<P></P>'; break;
 }
 InflateIt(ncp);
 cp.insertAdjacentElement("afterEnd",ncp);
 window.external.EndUndoUnit(document);
 GoTo(ncp);
}
//-----------------------------------------------

var imgcode="<DIV onresizestart='return false' contentEditable='false' class='image' href='#undefined'><IMG src='fbw-internal:#undefined'></DIV>";

function InsImage(check, id)
{
 var rng=document.selection.createRange();

 if(!rng || !("compareEndPoints" in rng)) return;

 if(rng.compareEndPoints("StartToEnd",rng)!=0)
 {
  rng.collapse(true); if(rng.move("character",1)==1) rng.move("character",-1);
 }

 var pe=rng.parentElement(); while(pe && pe.tagName!="DIV") pe=pe.parentElement;

 if(!pe || pe.className!="section") return;

 if(check) return true;

 window.external.BeginUndoUnit(document,"insert image");
 if(id=="")
  rng.pasteHTML(imgcode);
 else
  rng.pasteHTML("<DIV onresizestart='return false' contentEditable='false' class='image' href='#"+id+"'><IMG src='fbw-internal:#"+id+"'></DIV>");
 window.external.EndUndoUnit(document);

 return rng.parentElement;
}
//-----------------------------------------------

var inlineimgcode="<SPAN onresizestart='return false' contentEditable='false' class='image' href='#undefined'><IMG src='fbw-internal:#undefined'></SPAN>";

function InsInlineImage(check, id)
{
 var rng=document.selection.createRange();

 if(!rng || !("compareEndPoints" in rng)) return;

 if(rng.compareEndPoints("StartToEnd",rng)!=0)
 {
  rng.collapse(true); if(rng.move("character",1)==1) rng.move("character",-1);
 }

 var pe=rng.parentElement(); while(pe && pe.tagName!="DIV") pe=pe.parentElement;

 if(!pe || (pe.className!="section" && pe.className!="annotation" && pe.className!="history"
    && pe.className!="title" && pe.className!="epigraph")) return;

 if(check) return true;

 window.external.BeginUndoUnit(document,"insert inline image");
 if(id=="")
  rng.pasteHTML(inlineimgcode);
 else
     rng.pasteHTML("<SPAN onresizestart='return false' contentEditable='false' class='image' href='#" + id + "'><IMG src='fbw-internal:#" + id + "'></SPAN>");

 window.external.EndUndoUnit(document);

 return rng.parentElement;
}
//-----------------------------------------------

function AddImage(cp, check)
{
 cp=GetCP(cp); if(!cp) return;

 if(cp.className!="body" && cp.className!="section") return;

 var np=cp.firstChild;
 if (cp.className=="body") np=SkipOver(np,null,null,null);
 else                      np=SkipOver(np,"title","epigraph",null);

 if(np && np.tagName=="DIV" && np.className=="image") return;

 if(check) return true;

 window.external.BeginUndoUnit(document,"add image");
 InsBeforeHTML(cp, np, imgcode);
 window.external.EndUndoUnit(document);
}
//-----------------------------------------------

function AddEpigraph(cp,check)
{
  cp = GetCP(cp);
  if(!cp) return;

  if(cp.className != "body" && cp.className != "section" && cp.className != "poem") return;

  var pp=cp.firstChild;
  if(cp.className == "body") // different order
    pp = SkipOver(pp, "title", "image", "epigraph");
  else
    pp = SkipOver(pp, "title", "epigraph", null);

  if(check) return true;

  var rng = document.selection.createRange();
  var txt = "";
  var pps;

  if(rng && rng.text != "")
  {
    var dpps = document.createElement("DIV");
    dpps.innerHTML = rng.htmlText;
    pps = dpps.getElementsByTagName("P");
    if(pps.length == 0)
      txt = rng.text;
  }

  window.external.BeginUndoUnit(document,"add epigraph");
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

        for(pptag in pptags)
        {
          if(pptag != upTag)
          {
            pwt.className = "text-author";
            break;
          }
        }
      }
      pwt.innerHTML = pps[i].innerText;
      ep.appendChild(pwt);
    }
  }
  else
    ep.appendChild(document.createElement("P"));

  InsBefore(cp, pp, ep);
  InflateIt(ep);
  rng.pasteHTML("");
  if(pp && (!pp.innerText || pp.innerText == "" || pp.innerText == " "))
    pp.removeNode(true);
  window.external.EndUndoUnit(document);
  GoTo(ep);
}
//-----------------------------------------------

function AddAnnotation(cp, check)
{
 cp=GetCP(cp); if(!cp) return;

 if(cp.className!="section") return;

 var pp=SkipOver(cp.firstChild,"title","epigraph","image");

 if(pp && pp.tagName=="DIV" && pp.className=="annotation") return;

 if(check) return true;

 window.external.BeginUndoUnit(document,"add annotation");

 var ep=document.createElement("DIV");
 ep.className="annotation";
 ep.appendChild(document.createElement("P"));
 InsBefore(cp,pp,ep);
 InflateIt(ep);

 window.external.EndUndoUnit(document);

 GoTo(ep);
}
//-----------------------------------------------

function AddTA(cp,check)
{
 cp=GetCP(cp);

 while(cp)
 {
  if(cp.tagName=="DIV" && (cp.className=="poem" || cp.className=="epigraph" || cp.className=="cite")) break;

  cp=cp.parentElement;
 }

 if(!cp) return;

 var lc=cp.lastChild; if(lc && lc.tagName=="P" && lc.className=="text-author") return;

 if(check) return true;

 window.external.BeginUndoUnit(document,"add text author");

 var np=document.createElement("P");
 np.className="text-author";
 window.external.inflateBlock(np)=true;
 cp.appendChild(np);
 window.external.EndUndoUnit(document);
 GoTo(np);
}
//-----------------------------------------------

function IsCtSection(s)
{
 for(s=s.firstChild; s; s=s.nextSibling)
   if(s.nodeName=="P") return false;

 return true;
}
//-----------------------------------------------

function FindSE(cp,name)
{
 for(cp=cp.firstChild;cp;cp=cp.nextSibling)
 {
  if(cp.nodeName !="DIV") return;
  if(cp.className==name) return cp;
  if(cp.className=="section") return;
 }
}
//-----------------------------------------------

function MergeContainers(cp,check)
{
 cp=GetCP(cp); if(!cp) return;

 if(cp.className!="section" && cp.className!="stanza") return;

 var nx=cp.nextSibling;

 if(!nx || nx.tagName!="DIV" || nx.className!=cp.className) return;

 if(check) return true;

 window.external.BeginUndoUnit(document,"merge "+cp.className+"s");

 if(!IsCtSection(cp))
 {
  // delete all nested sections
  var pi, ii=nx.firstChild;

  while(ii)
  {
   if(ii.tagName=="DIV")
   {
	if(ii.className=="title")
	{
	  var pp=ii.getElementsByTagName("P");
	  for(var l=0; l<pp.length; l++) pp.item(l).className="subtitle";
	}
	if(ii.className=="title" || ii.className=="epigraph" || ii.className=="section" || ii.className=="annotation")
	{
	  ii.removeNode(false);
	  ii=pi ? pi.nextSibling : nx.firstChild;
	  continue;
	}
   }
   pi=ii; ii=ii.nextSibling;
  }
 }
 else if(!IsCtSection(nx))
 {
    // simply move nx under cp
    cp.appendChild(nx);
 }
 else
 {
    // move nx's content under cp

    // check if there are any header items to save
    var needSave;
    for(var ii=nx.firstChild;ii;ii=ii.nextSibling)
      if(ii.nodeName=="DIV" && (ii.className=="image" || ii.className=="epigraph" ||
				 ii.className=="annotation" || ii.className=="title"))
      {
	needSave=true; break;
      }

    if(needSave)
    {
      // find a destination section for section header items
      var dst=nx.firstChild;
      while (dst)
      {
	if(dst.nodeName=="DIV" && dst.className=="section") break;
	dst=dst.nextSibling;
      }

      // create one
      if(!dst)
      {
	dst=document.createElement("DIV");
	dst.className="section";
	var pp=document.createElement("P");
	window.external.inflateBlock(pp)=true;
	dst.appendChild(pp);
	cp.appendChild(dst);
      }

      // move items
      var jj=dst.firstChild;
      for (;;)
      {
	var ii=nx.firstChild;
	if (!ii)
	  break;
	if (ii.nodeName!="DIV")
	  break;
	var stop;
	switch (ii.className) {
	  case "title":
	    if (jj && jj.nodeName=="DIV" && jj.className=="title") {
	      jj.insertAdjacentElement("afterBegin",ii);
	      ii.removeNode(false);
	    } else
	      InsBefore(dst,jj,ii);
	    break;
	  case "epigraph":
	    while (jj && jj.nodeName=="DIV" && (jj.className=="title" || jj.className=="epigraph"))
	      jj=jj.nextSibling;
	    InsBefore(dst,jj,ii);
	    break;
	  case "image":
	    while (jj && jj.nodeName=="DIV" && (jj.className=="title" || jj.className=="epigraph"))
	      jj=jj.nextSibling;
	    InsBefore(dst,jj,ii);
	    break;
	  case "annotation":
	    while (jj && jj.nodeName=="DIV" && (jj.className=="title" || jj.className=="epigraph" || jj.className=="image"))
	      jj=jj.nextSibling;
	    if (jj && jj.nodeName=="DIV" && jj.className=="annotation")
	    {
	      jj.insertAdjacentElement("afterBegin",ii);
	      ii.removeNode(false);
	    } else
	      InsBefore(dst,jj,ii);
	    break;
	  default:
	    stop=true;
	    break;
	}
	if (stop)
	  break;
      }
    }

    // finally merge
    cp.appendChild(nx);
    nx.removeNode(false);
  }

  cp.insertAdjacentElement("beforeEnd",nx);
  nx.removeNode(false);

  window.external.EndUndoUnit(document);
}
//-----------------------------------------------

function RemoveOuterContainer(cp,check)
{
 cp=GetCP(cp); if(!cp) return;

 if((cp.className!="section" && cp.className!="body") || !IsCtSection(cp)) return;

 if(check) return true;

 window.external.BeginUndoUnit(document,"Remove Outer Section");

 // ok, move all child sections to upper level
 while(cp.firstChild)
 {
  var cc=cp.firstChild;
  cc.removeNode(true);
  if(cc.nodeName=="DIV" && cc.className=="section") cp.insertAdjacentElement("beforeBegin",cc);
 }

 cp.removeNode(true); // delete the section itself

 window.external.EndUndoUnit(document);
}
//-----------------------------------------------

function ImgSetURL(image,url)
{
	image.style.width=null;
	image.src=document.urlprefix+url;
}

function SaveBodyScroll()
{
	document.ScrollSave=document.body.scrollTop;
}

function SetExtendedStyle(elem, button_id, change)
{
	/*var desc = document.getElementById("fbw_desc");
	var button = document.getElementById(button_id);

	var ext = window.external.GetExtendedStyle(elem);
	if(change)
		ext= !ext;

	if(!desc)
		return false;

	var all=desc.all;
	for(var i=0; i<all.length; i++)
	{
		if(null != all[i].getAttribute(elem))
			if(ext)
				all[i].style.display="inline-block";
			else
				all[i].style.display="none";
	}

	//button.setAttribute("onclick", "SetExtendedStyle(" + !ext + ",'" + elem + "','" + button_id + "')");
	if(ext)
		button.value = "<<<<";
	else
		button.value = ">>>";

	window.external.SetExtendedStyle(elem, ext);*/
}

function ShowElement(id, show)
{
	if(!id)
		return;
	var desc = document.getElementById("fbw_desc");
	var spans = desc.getElementsByTagName("SPAN");
	for(var i=0; i<spans.length; i++)
	{
		if(spans[i].getAttribute("id") == id)
		{
			if(show)
				spans[i].style.display = "block";
			else
				spans[i].style.display = "none";
			window.external.DescShowElement(id, show);
		}
	}
}

function ShowElementsMenu(button)
{
	var elem_id = window.external.DescShowMenu(button, window.event.screenX, window.event.screenY);
	if(elem_id)
		ShowElement(elem_id, !window.external.GetExtendedStyle(elem_id));
}
