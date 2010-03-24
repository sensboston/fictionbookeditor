// Интерактивная ликвидация разрывов абзацев
// Автор скрипта: Sclex

var versionStr="2.4";
var CutLength=100;

function Run() {

 var Ts=new Date().getTime();
 var dialogWidth="640px"; 
 var dialogHeight="480px";

 var re0=new RegExp("[а-яёa-z]","");
 var re1=new RegExp("[  \"—–«»„”“()]","");
 var re2=new RegExp("[  ]","");
 var re3=new RegExp("[;:]","");
 var re4=new RegExp("[«(\\\[\\\"\\\=–—]","");
 var re5=new RegExp("[!…?.*]","");
 var re6=new RegExp("[А-ЯA-ZЁ]","");
 var re7=new RegExp("[!?….]");
 var re8=new RegExp("[-«–—]","");
 var re9=new RegExp("[-–—]","");
 var kavychkiRegExp=new RegExp('["»”“]',"");

 var coll=new Object();
 var collCnt=0;
 var wasReplace, handHandle=false;

 function JustAddP(prevP,ptr) {
  TrimRight(prevP);
  TrimLeft(ptr);
  var spaceNode=document.createTextNode(" ");
  prevP.appendChild(spaceNode);
  MoveTree(prevP,ptr);
  var i;
  for (i=1;i<=DelCollCnt;i++) {
   var ptr2=DelColl[i];
   ptr2.parentNode.removeChild(ptr2);
  }
  ptr.parentNode.removeChild(ptr);
 }

 function AddPKillingHyphen(prevP,ptr) {
  TrimRight(prevP);
  TrimLeft(ptr);
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
 var ijy0=new RegExp("[  )]","");
 
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
 var modes=window.showModalDialog("cmd/интеракт. удаление разрывов - выбор режимов.htm",coll,
     "dialogHeight: "+dialogHeight+"; dialogWidth: "+dialogWidth+"; "+
     "center: Yes; help: No; resizable: Yes; status: No; scroll: No;");
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
   wasReplace=false;
   var SavePrevP=null;
   if (prevP!=null && !IsLineEmpty(ptr)) {
    if (!(prevP.parentNode.className=="epigraph" || ptr.parentNode.className=="epigraph" ||
        (prevP.parentNode.className=="cite" && ptr.parentNode.className!="cite") ||
        (ptr.parentNode.className=="cite" && prevP.parentNode.className!="cite") )
        && prevP.className!="text-author" && ptr.className!="text-author"
        && prevP.className!="subtitle" && ptr.className!="subtitle") {
     //MsgBox("ptr:"+ptr.outerHTML+"\nIsFirstLetterSmall(ptr):"+IsFirstLetterSmall(ptr));
     getLastNotSpaceSymbol(prevP);
     //если первый значимый символ второго абзаца в нижнем регистре...
     getFirstAndSecondLetterOfPtr(ptr);
     if (firstSymbol.search(re0)>=0) {
      //alert("ptr:"+ptr.innerHTML+"\nsecondSymbol:"+secondSymbol);
      //if (lastSymbolOfPrevP=="-") {
      // последний символ первого абзаца - дефис
      // if (!isSpaceBeforeLastSymbol) {
      // AddPKillingHyphen(prevP,ptr);
      //  ptr=prevP;
      //  CntZamen++;
      //  wasReplace=true;
      // } 
      //}
      //else 
      {
       if (firstSymbol.search(re0)>=0 && lastSymbolOfPrevP.search(re0)>=0) {
        wasReplace=true;
        if (modes[1]=='auto') {
         JustAddP(prevP,ptr);
         ptr=prevP;
         CntZamen++;
        } else if (modes[1]=='hands') {
         collCnt++;
         coll[collCnt+"_1"]="1";
         coll[collCnt+"_2"]=prevP;
         coll[collCnt+"_3"]=ptr;            
         if (DelCollCnt!=0) coll[collCnt+"_4"]=DelColl[1];       
         handHandle=true;              
        } 
       } else if (lastSymbolOfPrevP=="–" || lastSymbolOfPrevP=="—") {
       //последний символ первого абзаца - тире
        if (isSpaceBeforeLastSymbol) {
         JustAddP(prevP,ptr);
         ptr=prevP;
         CntZamen++;
         wasReplace=true;
        } 
       }      
      }
     } 
     //alert(lastSymbolOfPrevP+firstSymbol+secondSymbol);
     if (!wasReplace && lastSymbolOfPrevP.search(re5)<0) {
      if (lastSymbolOfPrevP=="-" && isSpaceBeforeLastSymbol) {
       //когда первый абзац кончается на дефис, а перед ним пробел
       collCnt++;
       coll[collCnt+"_1"]="4";
       coll[collCnt+"_2"]=prevP;
       coll[collCnt+"_3"]=ptr;            
       if (DelCollCnt!=0) coll[collCnt+"_4"]=DelColl[1];       
       handHandle=true;            
      } else if (lastSymbolOfPrevP.search(re9)>=0 && !isSpaceBeforeLastSymbol) {
        collCnt++;
        coll[collCnt+"_1"]="5";
        coll[collCnt+"_2"]=prevP;
        coll[collCnt+"_3"]=ptr;      
        if (DelCollCnt!=0) coll[collCnt+"_4"]=DelColl[1];
        handHandle=true;       
      } else if ((lastSymbolOfPrevP!="," && (lastSymbolOfPrevP.search(kavychkiRegExp)<0 || (lastSymbolOfPrevP.search(kavychkiRegExp)>=0 && preLastSymbolOfPrevP.search(re7)<0)))
          && ((firstSymbol.search(re4)>=0 && secondSymbol.search(re0)>=0) || firstSymbol.search(re0)>=0)
          && !((lastSymbolOfPrevP==":" || lastSymbolOfPrevP==";")&& firstSymbol.search(re8)>=0)) {
       //случай, когда первый-второй символ второго абзаца - маленькая буква   
       collCnt++;
       coll[collCnt+"_1"]="1";
       coll[collCnt+"_2"]=prevP;
       coll[collCnt+"_3"]=ptr;      
       if (DelCollCnt!=0) coll[collCnt+"_4"]=DelColl[1];
       handHandle=true;
      } else if (lastSymbolOfPrevP!="," && lastSymbolOfPrevP.search(kavychkiRegExp)<0 &&
                 ((firstSymbol.search(re4)>=0  && secondSymbol.search(re6)>=0) || firstSymbol.search(re6)>=0)
                 && !((lastSymbolOfPrevP==":" || lastSymbolOfPrevP==";")&& firstSymbol.search(re8)>=0)) {
       //это обработка случая, когда второй абзац начинается с большой буквы,
       //а первый не кончается на символ (символы), который характерен для конца строки
       collCnt++;
       coll[collCnt+"_1"]="2";
       coll[collCnt+"_2"]=prevP;
       coll[collCnt+"_3"]=ptr;            
       if (DelCollCnt!=0) coll[collCnt+"_4"]=DelColl[1];       
       handHandle=true;
      } else if (lastSymbolOfPrevP==",") {
      //случай, когда первый абзац кончается запятой
       collCnt++;
       coll[collCnt+"_1"]="3";
       coll[collCnt+"_2"]=prevP;
       coll[collCnt+"_3"]=ptr;            
       if (DelCollCnt!=0) coll[collCnt+"_4"]=DelColl[1];       
       handHandle=true;      
      } 
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
  var rslt=window.showModalDialog("cmd/интеракт. удаление разрывов - спорные места.htm",coll,
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

function IsLineEmpty(ptr) {
 var txt=ptr.innerText;
 var i=0;
 while (i<txt.length && (txt.substr(i,1)==" " || txt.substr(i,1)==" ")) {i++}
 if (i==txt.length) {return true;}
 else {return false;}
}

function MoveTree(a1,a2) {
 while (a2.childNodes[0]!=null) {
  var tmp_node=a2.childNodes[0].cloneNode(true);
  a1.appendChild(tmp_node);
  a2.removeChild(a2.childNodes[0]);
 }
}

function TrimRight(ptr) {
 var SavePtr=ptr;
 ptr=ptr;
 while (true) {
  if (ptr.nodeType==3) {
   var s=ptr.nodeValue;
   var i2=s.length-1;
   while (i2>=0 && (s.substr(i2,1)==" " || s.substr(i2,1)==" ")) i2--;
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

function TrimLeft(ptr) {
 var SavePtr=ptr;
 ptr=ptr;
 while (true) {
  if (ptr.nodeType==3) {
   var s=ptr.nodeValue;
   var i1=0;
   while (i1<s.length && (s.substr(i1,1)==" " || s.substr(i1,1)==" ")) i1++;
   if (i1<s.length) ptr.nodeValue=s.substring(i1,s.length)
   else ptr.nodeValue="";
   if (i1<s.length) return;
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