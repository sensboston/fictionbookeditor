// Управляемое исправление разрывов абзацев
// Автор скрипта: Sclex
// Сайт скриптов FBE Sclex’а: http://scripts.fictionbook.org

var versionStr="3.9";
var CutLength=100;

function Run() {

 var Ts=new Date().getTime();
 var dialogWidth="900px";
 var dialogHeight="600px";

 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

 var smallLettersStr="а-яёa-zіїєґ";
 var bigLettersStr="А-ЯЁA-ZІЇЄҐ";
 var re0=new RegExp("["+smallLettersStr+"]","");
 var re1=new RegExp("[ "+nbspChar+"\"—–«»„”“()]","");
 var re2=new RegExp("[ "+nbspChar+"]","");
 var re3=new RegExp("[;:]","");
 var re4=new RegExp("[«(\\\[\\\"\\\=–—]","");
 var re5=new RegExp("[!…?.*]","");
 var bigLetterRegExp=new RegExp("["+bigLettersStr+"]","");
 var bigLetterOrDigitRegExp=new RegExp("["+bigLettersStr+"\\d]","");
 var re7=new RegExp("[!?….]");
 var re8=new RegExp("[-«–—]","");
 var re9=new RegExp("[-–—]","");
 var kavychkiRegExp=new RegExp('["»”“]',"");
 var nonEndingCharRegExp=new RegExp("[^.,?!…]");

 var coll=new Object();
 var collCnt=0;
 var wasReplace, handHandle=false;

 function JustAddP(prevP,ptr,dummy1,addSpace) {
  trimRight(prevP);
  trimLeft(ptr);
  if (addSpace!=false) {
   var spaceNode=document.createTextNode(" ");
   prevP.appendChild(spaceNode);
  }
  MoveTree(prevP,ptr);
  var i;
  for (i=1;i<=DelCollCnt;i++) {
   var ptr2=DelColl[i];
   ptr2.parentNode.removeChild(ptr2);
  }
  ptr.parentNode.removeChild(ptr);
 }

 function addPointToP(ptr) {
  var myPtr=ptr.lastChild;
  while (myPtr!=ptr) {
   if (myPtr.nodeType==3) break;
   if (myPtr.lastChild!=null) {
    myPtr=myPtr.lastChild;
   } else {
    while (myPtr.previousSibling==null) {
     myPtr=myPtr.parentNode;
     if (myPtr==ptr) break;
    }
    myPtr=myPtr.previousSibling;
   }
  }
  myPtr.nodeValue+="."
 }

 function IsLineEmpty(ptr) {
  var txt=ptr.innerText;
  var i=0;
  while (i<txt.length && (txt.substr(i,1)==" " || txt.substr(i,1)==nbspChar)) {i++}
  if (i==txt.length) {return true;}
  else {return false;}
 }

 var hyphenOntoShortDashRegExp=new RegExp("-$","");
 var hyphenOntoShortDashRegExp_="–";

 function changeHyphenOntoShortDash(ptr) {
  var myPtr=ptr.lastChild;
  while (myPtr!=ptr) {
   if (myPtr.nodeType==3) {
    if (myPtr.nodeValue.length!=0) {
     myPtr.nodeValue=myPtr.nodeValue.replace(hyphenOntoShortDashRegExp,hyphenOntoShortDashRegExp_);
     break;
    }
   }
   if (myPtr.lastChild!=null) {
    myPtr=myPtr.lastChild;
   } else {
    while (myPtr.previousSibling==null) {
     myPtr=myPtr.parentNode;
     if (myPtr==ptr) break;
    }
    myPtr=myPtr.previousSibling;
   }
  }
 }

 var hyphenOntoLongDashRegExp=new RegExp("-$","");
 var hyphenOntoLongDashRegExp_="—";

 function changeHyphenOntoLongDash(ptr) {
  var myPtr=ptr.lastChild;
  while (myPtr!=ptr) {
   if (myPtr.nodeType==3) {
    if (myPtr.nodeValue.length!=0) {
     myPtr.nodeValue=myPtr.nodeValue.replace(hyphenOntoLongDashRegExp,hyphenOntoLongDashRegExp_);
     break;
    }
   }
   if (myPtr.lastChild!=null) {
    myPtr=myPtr.lastChild;
   } else {
    while (myPtr.previousSibling==null) {
     myPtr=myPtr.parentNode;
     if (myPtr==ptr) break;
    }
    myPtr=myPtr.previousSibling;
   }
  }
 }

 function MoveTree(a1,a2) {
  while (a2.childNodes[0]!=null) {
   var tmp_node=a2.childNodes[0].cloneNode(true);
   a1.appendChild(tmp_node);
   a2.removeChild(a2.childNodes[0]);
  }
 }

 function trimRight(ptr) {
  var SavePtr=ptr;
  ptr=ptr;
  while (true) {
   if (ptr.nodeType==3) {
    var s=ptr.nodeValue;
    var i2=s.length-1;
    while (i2>=0 && (s.substr(i2,1)==" " || s.substr(i2,1)==nbspChar)) i2--;
    if (i2>=0) ptr.nodeValue=s.substr(0,i2+1)
    else ptr.nodeValue="";
    if (i2>0) return;
   }
   if (ptr.lastChild!=null) {
    ptr=ptr.lastChild;
   } else {
    while (ptr.previousSibling==null) {
     ptr=ptr.parentNode;
     if (ptr==SavePtr) return false;
    }
    if (ptr) {ptr=ptr.previousSibling}
   }
  }
 }

 var dashOntoHyphenRegExp=new RegExp("(–|—|-)$","");
 var dashOntoHyphenRegExp_="-";

 function changeDashOntoHyphenLongDash(ptr) {
  var myPtr=ptr.lastChild;
  while (myPtr!=ptr) {
   if (myPtr.nodeType==3) {
    if (myPtr.nodeValue.length!=0) {
     myPtr.nodeValue=myPtr.nodeValue.replace(dashOntoHyphenRegExp,dashOntoHyphenRegExp_);
     break;
    }
   }
   if (myPtr.lastChild!=null) {
    myPtr=myPtr.lastChild;
   } else {
    while (myPtr.previousSibling==null) {
     myPtr=myPtr.parentNode;
     if (myPtr==ptr) break;
    }
    myPtr=myPtr.previousSibling;
   }
  }
 }

 var commaOntoPointRegExp=new RegExp(",?$","");
 var commaOntoPointRegExp_=".";

 function changeCommaOntoPoint(ptr) {
  var myPtr=ptr.lastChild;
  while (myPtr!=ptr) {
   if (myPtr.nodeType==3) {
    myPtr.nodeValue=myPtr.nodeValue.replace(commaOntoPointRegExp,commaOntoPointRegExp_);
    break;
   }
   if (myPtr.lastChild!=null) {
    myPtr=myPtr.lastChild;
   } else {
    while (myPtr.previousSibling==null) {
     myPtr=myPtr.parentNode;
     if (myPtr==ptr) break;
    }
    myPtr=myPtr.previousSibling;
   }
  }
 }

 function doAction(code) {
  switch(code) {
   case 1: {
    //соединить через пробел
    JustAddP(prevP,ptr);
    ptr=prevP;
    CntZamen++;
    break;
   }
   case 2: {
   //добавить точку
    trimRight(prevP);
    addPointToP(prevP);
    CntZamen++;
    break;
   }
   case 3: {
    //точка вместо запятой
    trimRight(prevP);
    changeCommaOntoPoint(prevP);
    CntZamen++;
    break;
   }
   case 4: {
    //короткое тире вместо дефиса и соединить
    trimRight(prevP);
    changeHyphenOntoShortDash(prevP);
    JustAddP(prevP,ptr);
    ptr=prevP;
    CntZamen++;
    break;
   }
   case 5: {
    //длинное тире вместо дефиса и соединить
    trimRight(prevP);
    changeHyphenOntoLongDash(prevP);
    JustAddP(prevP,ptr);
    ptr=prevP;
    CntZamen++;
    break;
   }
   case 6: {
    //соединить, удалив тире или дефис
    AddPKillingHyphen(prevP,ptr);
    ptr=prevP;
    CntZamen++;
    break;
   }
   case 7: {
    //соединить через дефис, или заменив тире на дефис
    trimRight(prevP);
    changeDashOntoHyphenLongDash(prevP);
    JustAddP(prevP,ptr,undefined,false);
    ptr=prevP;
    CntZamen++;
    break;
   }
   case 8: {
    trimRight(prevP);
    killHyphen(prevP);
    trimLeft(ptr);
    JustAddP(prevP,ptr,undefined,false);
    ptr=prevP;
    CntZamen++;
    break;
   }
  }
  wasReplace=true;
 }

 function KillEndHyphenOrDash(ptr) {
  var SavePtr=ptr;
  var ptr=ptr;
  while (true) {
   if (ptr.nodeType==3) {
    var s=ptr.nodeValue;
    var i2=s.length-1;
    if (s.substr(i2,1)=="-" || s.substr(i2,1)=="–" || s.substr(i2,1)=="—") {
     ptr.nodeValue=s.substr(0,s.length-1);
     return;
    }
   }
   if (ptr.lastChild!=null) {
    ptr=ptr.lastChild;
   } else {
    while (ptr.previousSibling==null) {
     ptr=ptr.parentNode;
     if (ptr==SavePtr) return false;
    }
    if (ptr) {ptr=ptr.previousSibling}
   }
  }
 }

 function trimLeft(ptr2) {
  var s,i1,len;
  var ptr=ptr2;
  while (true) {
   if (ptr.nodeType==3) {
    s=ptr.nodeValue;
    i1=0;
    len=s.length;
    while (i1<len && (s.charAt(i1)==" " || s.charAt(i1)==nbspChar)) i1++;
    if (i1<len) {ptr.nodeValue=s.substr(i1); return}
    else ptr.nodeValue="";
   }
   if (ptr.firstChild!=null) {
    ptr=ptr.firstChild;
   } else {
    while (ptr.nextSibling==null) {
     ptr=ptr.parentNode;
     }
    if (ptr) {ptr=ptr.nextSibling}
   }
  }
 }

 var killHyphenRegExp=new RegExp("(-|–|—)$","");
 var killHyphenRegExp_="";

 function killHyphen(ptr) {
  var myPtr=ptr.lastChild;
  while (myPtr!=ptr) {
   if (myPtr.nodeType==3) {
    if (myPtr.nodeValue.length!=0) {
     myPtr.nodeValue=myPtr.nodeValue.replace(killHyphenRegExp,killHyphenRegExp_);
     return;
    }
   }
   if (myPtr.lastChild!=null) {
    myPtr=myPtr.lastChild;
   } else {
    while (myPtr.previousSibling==null) {
     myPtr=myPtr.parentNode;
     if (myPtr==ptr) return;
    }
    myPtr=myPtr.previousSibling;
   }
  }
 }

 function AddPKillingHyphen(prevP,ptr) {
  trimRight(prevP);
  trimLeft(ptr);
  KillEndHyphenOrDash(prevP);
  MoveTree(prevP,ptr);
  var i;
  for (i=1;i<=DelCollCnt;i++) {
   var ptr2=DelColl[i];
   ptr2.parentNode.removeChild(ptr2);
  }
  ptr.parentNode.removeChild(ptr);
 }

 var firstSymbol="";
 var secondSymbol="";
 var isSpaceBeforeLastSymbol;
 var ptrHtml;

 var letterCnt;
 var nptr,g,myStr,whileFlag;
 var ijy0=new RegExp("[ "+nbspChar+")]","");

 function getFirstAndSecondLetterOfPtr(ptr) {
  nptr=ptr.firstChild;
  letterCnt=0;
  firstSymbol="";
  secondSymbol="";
  while (nptr!=ptr) {
   if (nptr.nodeType==3) {
    g=0;
    myStr=nptr.nodeValue;
    while (g<myStr.length) {
     //пропускаем пробелы, обычные и неразрывные
     whileFlag=true;
     while (whileFlag)
      if (g<myStr.length)
       if (myStr.charAt(g).search(ijy0)>=0) g++
       else whileFlag=false;
      else whileFlag=false;
     whileFlag=true;
     while (whileFlag)
      if (g<myStr.length)
       if (myStr.charAt(g).search(ijy0)<0) {
        letterCnt++;
        if (letterCnt==1) firstSymbol=myStr.charAt(g);
        if (letterCnt==2) {secondSymbol=myStr.charAt(g); return;}
        g++;
       }
       else whileFlag=false;
      else whileFlag=false;
    }
   }
   if (nptr.firstChild) {
    if (!(nptr.nodeName=="A" && nptr.className=="note")) nptr=nptr.firstChild;
    else {
     while (nptr.nextSibling==null && nptr!=ptr) nptr=nptr.parentNode;
     if (nptr!=ptr) nptr=nptr.nextSibling;
    }
   } else {
    while (nptr.nextSibling==null && nptr!=ptr) nptr=nptr.parentNode;
    if (nptr!=ptr) nptr=nptr.nextSibling;
   }
  }
 }

 function getLastNotSpaceSymbol(ptr) {
  nptr=ptr.lastChild;
  letterCnt=0;
  lastSymbolOfPrevP="";
  preLastSymbolOfPrevP="";
  isSpaceBeforeLastSymbol=false;
  while (nptr!=ptr) {
   if (nptr.nodeType==3) {
    myStr=nptr.nodeValue;
    g=myStr.length-1;
    while (g>=0) {
     //пропускаем пробелы, обычные и неразрывные
     whileFlag=true;
     while (whileFlag)
      if (g>=0)
       if (myStr.charAt(g).search(ijy0)>=0) {
        g--;
        if (letterCnt==1) isSpaceBeforeLastSymbol=true;
       }
       else whileFlag=false;
      else whileFlag=false;
     whileFlag=true;
     while (whileFlag)
      if (g>=0)
       if (myStr.charAt(g).search(ijy0)<0) {
        letterCnt++;
        if (letterCnt==1) lastSymbolOfPrevP=myStr.charAt(g);
        if (letterCnt==2) {preLastSymbolOfPrevP=myStr.charAt(g); return;}
        g--;
       }
       else whileFlag=false;
      else whileFlag=false;
    }
   }
   if (nptr.lastChild) {
    if (!(nptr.nodeName=="A" && nptr.className=="note")) nptr=nptr.lastChild;
    else {
     while (nptr.previousSibling==null && nptr!=ptr) nptr=nptr.parentNode;
     if (nptr!=ptr) nptr=nptr.previousSibling;
    }
   } else {
    while (nptr.previousSibling==null && nptr!=ptr) nptr=nptr.parentNode;
    if (nptr!=ptr) nptr=nptr.previousSibling;
   }
  }
 }

 window.external.BeginUndoUnit(document,"abruption killing");
 var coll=new Object();
 var modes=window.showModalDialog("HTML/Управляемое исправление разрывов абзацев - выбор режимов.html",coll,
     "dialogHeight: "+dialogHeight+"; dialogWidth: "+dialogWidth+"; "+
     "center: Yes; help: No; resizable: Yes; status: No;");
 if (modes==undefined) return;
 var body=document.getElementById("fbw_body");
 var ptr=body;
 var ProcessingEnding=false;
 var prevP=null;
 var CntZamen=0;
 var DelCollCnt=0;
 var DelColl=new Object();
 while (!ProcessingEnding && ptr) {
  SaveNext=ptr;
  if (SaveNext.firstChild!=null && SaveNext.nodeName!="P" &&
      !(SaveNext.nodeName=="DIV" &&
        (SaveNext.className=="title" || SaveNext.className=="table" ||
        SaveNext.className=="history" || SaveNext.className=="annotation" ||
        SaveNext.className=="poem"))) {
    SaveNext=SaveNext.firstChild; // либо углубляемся...
  } else {
    while (SaveNext.nextSibling==null) {
     SaveNext=SaveNext.parentNode; // ...либо поднимаемся (если уже сходили вглубь)
     // поднявшись до элемента P, не забудем поменять флаг
     if (SaveNext==body) {ProcessingEnding=true;}
    }
   SaveNext=SaveNext.nextSibling; //и переходим на соседний элемент
  }
  if (ptr.nodeName=="DIV" && (ptr.className=="section" || ptr.className=="annotation" ||
                              ptr.className=="history" || ptr.className=="poem")) {
   prevP=null;
  }
  if (ptr.nodeName=="P") {
   var SavePrevP=null;
   if (prevP!=null && !IsLineEmpty(ptr)) {
    if (!(prevP.parentNode.className=="epigraph" || ptr.parentNode.className=="epigraph"
          || prevP.className=="text-author" || ptr.className=="text-author"
          || (modes["handle1Cite"]==false && prevP.parentNode.className=="cite")
          || (modes["handle2Cite"]==false && ptr.parentNode.className=="cite")
          || (modes["handle1Subtitle"]==false && prevP.className=="subtitle")
          || (modes["handle2Subtitle"]==false && ptr.className=="subtitle")
         )
       ) {
     wasReplace=false;
     //MsgBox("ptr:"+ptr.outerHTML+"\nIsFirstLetterSmall(ptr):"+IsFirstLetterSmall(ptr));
     getLastNotSpaceSymbol(prevP);
     //если первый значимый символ второго абзаца в нижнем регистре...
     getFirstAndSecondLetterOfPtr(ptr);
     if (lastSymbolOfPrevP=="-" && isSpaceBeforeLastSymbol) {
      //когда первый абзац кончается на дефис, а перед ним пробел
      if (modes[4]==true) {
       collCnt++;
       coll[collCnt+"_1"]="4";
       coll[collCnt+"_2"]=prevP;
       coll[collCnt+"_3"]=ptr;
       if (DelCollCnt!=0) coll[collCnt+"_4"]=DelColl[1];
       handHandle=true;
       wasReplace=true
      } else doAction(modes["4_"]);
     } else if (lastSymbolOfPrevP.search(re9)>=0 && !isSpaceBeforeLastSymbol) {
        //последний символ первого абзаца тире, и перед ним нет пробела
        if (modes[5]==false) doAction(modes["5_"]);
        else {
         collCnt++;
         coll[collCnt+"_1"]="5";
         coll[collCnt+"_2"]=prevP;
         coll[collCnt+"_3"]=ptr;
         if (DelCollCnt!=0) coll[collCnt+"_4"]=DelColl[1];
         handHandle=true;
         wasReplace=true;
       }
     }
     if (!wasReplace && lastSymbolOfPrevP==",") {
      if (modes[3]==true) {
       //случай, когда первый абзац кончается запятой
       collCnt++;
       coll[collCnt+"_1"]="3";
       coll[collCnt+"_2"]=prevP;
       coll[collCnt+"_3"]=ptr;
       if (DelCollCnt!=0) coll[collCnt+"_4"]=DelColl[1];
       handHandle=true;
      } else doAction(modes["3_"]);
     } 
     if (firstSymbol.search(re0)>=0) {
      {
       if (!wasReplace && firstSymbol.search(re0)>=0 && lastSymbolOfPrevP.search(re0)>=0) {
        //последняя буква первого и первая буква второго абзаца - маленькие
        wasReplace=true;
        if (modes[1]==false) doAction(modes["1_"]);
        else {
         collCnt++;
         coll[collCnt+"_1"]="1";
         coll[collCnt+"_2"]=prevP;
         coll[collCnt+"_3"]=ptr;
         if (DelCollCnt!=0) coll[collCnt+"_4"]=DelColl[1];
         handHandle=true;
        }
       } else if (!wasReplace && (lastSymbolOfPrevP=="–" || lastSymbolOfPrevP=="—")) {
        if (isSpaceBeforeLastSymbol) {
         //последний символ первого абзаца - тире, перед ним пробел
         wasReplace=true;
         if (modes[6]==false) doAction(modes["6_"]);
         else {
          collCnt++;
          coll[collCnt+"_1"]="6";
          coll[collCnt+"_2"]=prevP;
          coll[collCnt+"_3"]=ptr;
          if (DelCollCnt!=0) coll[collCnt+"_4"]=DelColl[1];
          handHandle=true;
         }
        }
       }
      }
     } else if (!wasReplace && lastSymbolOfPrevP.search(nonEndingCharRegExp)>=0 &&
                 (lastSymbolOfPrevP.search(kavychkiRegExp)<0 ||
                  (lastSymbolOfPrevP.search(kavychkiRegExp)>=0 && preLastSymbolOfPrevP.search(re7)<0)
                 ) &&
                 ((firstSymbol.search(re4)>=0  && secondSymbol.search(bigLetterOrDigitRegExp)>=0) || firstSymbol.search(bigLetterOrDigitRegExp)>=0) &&
                 !(lastSymbolOfPrevP==":" || lastSymbolOfPrevP==";")
                ) {
       //это обработка случая, когда второй абзац начинается с большой буквы,
       //а первый не кончается на символ (символы), который характерен для конца строки
       if (modes[2]==true) {
        collCnt++;
        coll[collCnt+"_1"]="2";
        coll[collCnt+"_2"]=prevP;
        coll[collCnt+"_3"]=ptr;
        if (DelCollCnt!=0) coll[collCnt+"_4"]=DelColl[1];
        handHandle=true;
       } else doAction(modes["2_"]);
      }
     if (!wasReplace && (lastSymbolOfPrevP!="," &&
                 (lastSymbolOfPrevP.search(kavychkiRegExp)<0 ||
                  (lastSymbolOfPrevP.search(kavychkiRegExp)>=0 && preLastSymbolOfPrevP.search(re7)<0)
                 )
                ) &&
                ((firstSymbol.search(re4)>=0 && secondSymbol.search(re0)>=0) || firstSymbol.search(re0)>=0) &&
                !((lastSymbolOfPrevP==":" || lastSymbolOfPrevP==";")&& firstSymbol.search(re8)>=0)
               ) {
      //случай, когда первый-второй символ второго абзаца - маленькая буква
      if (modes[7]) {
       collCnt++;
       coll[collCnt+"_1"]="1";
       coll[collCnt+"_2"]=prevP;
       coll[collCnt+"_3"]=ptr;
       if (DelCollCnt!=0) coll[collCnt+"_4"]=DelColl[1];
       handHandle=true;
      } else doAction(modes["7_"]);
     }
    }
   }
   if (!IsLineEmpty(ptr)) {
    DelCollCnt=0;
    prevP=ptr;
   }
   else {
    DelCollCnt++;
    DelColl[DelCollCnt]=ptr;
   }
  }
  ptr=SaveNext;
 }
 var Tf=new Date().getTime();
 var Tmin = Math.floor((Tf-Ts)/60000);
 var Tsek = Math.ceil(10*((Tf-Ts)/1000-Tmin*60))/10;
 if (Tmin>0) {var TimeStr=Tmin+" мин. "+Tsek+" с"}
 else {var TimeStr=Tsek+" с"}
 var Ts=new Date().getTime();
 var msgStr="Версия "+versionStr+".\n"+
            "Ликвидация разрывов абзацев завершена.\n"+
            "Автоматических слияний абзацев: "+CntZamen+".\n";
 if (handHandle) {
  coll["collCnt"]=collCnt;
  coll["document"]=document;
  coll["versionStr"]=versionStr;
  coll["window"]=window;
  coll["modes"]=modes;
  coll["nbspChar"]=nbspChar;
  coll["nbspEntity"]=nbspEntity;
  var rslt=window.showModalDialog("HTML/Управляемое исправление разрывов абзацев - спорные места.html",coll,
       "dialogHeight: "+dialogHeight+"; dialogWidth: "+dialogWidth+"; "+
       "center: Yes; help: No; resizable: Yes; status: No;");
  msgStr+="Подтвержденных вручную коррекций: "+rslt+".\n";
 }
 window.external.EndUndoUnit(document);
 var Tf=new Date().getTime();
 var Tmin = Math.floor((Tf-Ts)/60000);
 var Tsek = Math.ceil(10*((Tf-Ts)/1000-Tmin*60))/10;
 if (Tmin>0) {var TimeStr2=Tmin+" мин. "+Tsek+" с"}
 else {var TimeStr2=Tsek+" с"}
 msgStr+="Время автоматической обработки: "+TimeStr+".\n";
 if (handHandle) msgStr+="Время ручной обработки: "+TimeStr2+".";
 MsgBox(msgStr);
}