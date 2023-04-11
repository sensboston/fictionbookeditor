// извлечение сносок из разных скобок
// написал Sclex

function Run() {

var versionNumber="2.2";
// выводить ли окно, извещающее о конце работы скрипта?
// true - выводить. false - не выводить
var EndWindow=true;
//добавлять ли новую сноску или только провести работы по упорядочению существующих
//true - добавлять. false - не добавлять
var AddSnoska=true;
//показывать ли форму для ввода текста примечания
//true - показывать. false - не показывать
var inputSnoskaText=false;
//перемещать ли фокус видимости на раздел свежесозданного примечания
var moveFocusToNote=false;
var strconst1="n_%N"; //название раздела примечания
var strconst2="<P>%N</P>"; // заголовок раздела примечания
var strconst3="&nbsp;"; //содержание раздела примечания
var strconst4="[%N]"; //текст ссылки сноски
var strconst5="Примечания"; //заголовок боди нотесов
var strconst6=String.fromCharCode(1); //временная метка в тексте
//на сколько вверх подвинуть поле видимости после позиционирования на место ошибки
var otstupSverhu=40;
//задает name того боди, которое скрипт будет считать за боди примечаний
var bodyNotesName="notes";
//если makePrompt=true, скрипт будет выводить окошко для ввода регэкспов скобок
//в противном случае false
var makePrompt=false;
//если promptAsText=true, то введенное в окошке трактовать как пару скобок, заданных
//простым текстом, разделенную пробелом или пробелами
//в противном случае false
var promptAsText=false;
var Masks=new Object();
var Len=new Object();
//количество задаваемых пар скобок
var MasksN=1;
//регулярное выражения для поиска открывающей скобки
Masks["0_1"]=new RegExp("\\[~",""); //открывающая скобка
//регулярное выражения для поиска закрывающей скобки
Masks["0_2"]=new RegExp("~\\]",""); //закрывающая скобка
var randomId=getRandomNum(5);
var addedSnoskaCnt=0;
var typeOfAddedSnoska=0;
var errorStatus=0;
var sects,SectNum,SectID,j1,j5,j6,while_flag,utb,InsertN,newEl,node3,nodeT;

function getVersionStr() {
 return("Примечания из скобок v"+versionNumber+" by Sclex.\n\n");
}

function setCursorIntoTextNode(noteNode,offset) {
 if (offset!=0) {
  var s1=noteNode.nodeValue;
  var s2=s1.substr(offset);
  var s1=s1.substr(0,offset);
  var node2=document.createTextNode(s2);
  node2=noteNode.parentNode.insertBefore(node2,noteNode.nextSibling);
  noteNode.nodeValue=s1;
  noteNode=node2;
 }
 var tmpLabelNode=noteNode.parentNode.insertBefore(document.createElement("B"),noteNode);
 tmpLabelNode.scrollIntoView(true);
 window.scrollBy(0,-otstupSverhu);
 var range=document.body.createTextRange();
 range.moveToElementText(tmpLabelNode);
 range.select();
 tmpLabelNode.removeNode();
}

function cutOffSnoskaText() {
 if (typeOfAddedSnoska==1) {
  node3.removeNode();
 }
 if (typeOfAddedSnoska==2) {
  var iii11;
  for (iii11=ElemsToDeleteCnt-1;iii11>=0;iii11--)
   ElemsToDeleteColl[iii11].removeNode(true);
  if (ClosedBracketP) {
   MoveNodeContent(ClosedBracketP,OpenedBracketP);
   ptr=OpenedBracketP;
  }
 }
}

function getExitStr(withoutMinusOne) {
 var Tf=new Date().getTime();
 var Tmin = Math.floor((Tf-Ts)/60000);
 var Tsec = Math.ceil((Tf-Ts)/1000-Tmin*60);
 var Tsek = Math.ceil(10*((Tf-Ts)/1000-Tmin*60))/10;
 var Tssek = Math.ceil(100*((Tf-Ts)/1000-Tmin*60))/100;
 var Tsssek = Math.ceil(1000*((Tf-Ts)/1000-Tmin*60))/1000;
 if (Tssek<1 && Tmin<1)  var TimeStr=Tsssek+ " с"
 else { if (Tsek<10 && Tmin<1)  var TimeStr=Tssek+ " с"
 else { if (Tmin<1) var TimeStr=Tsek+ " с"
 else if (Tmin>=1) var TimeStr=Tmin+ " мин " +Tsec+ " с" }}
 if (withoutMinusOne!=undefined)
  return "Добавлено примечаний: "+NewNotesCnt+".\nЗатрачено времени: "+TimeStr;
 else
  return "Добавлено примечаний: "+(NewNotesCnt-1)+".\nЗатрачено времени: "+TimeStr;
}

function init_dobavlenie_snoski() {
 NashliBodyNotes = false;
// в цикле переберем все DIV-ы и найдем body notes
 var tmpNode=body.firstChild;
 while (tmpNode) {
  if (tmpNode.className=="body" && tmpNode.getAttribute("fbname")==bodyNotesName) {
   NashliBodyNotes = true;
   BodyNotes=tmpNode;
   break;
  }
  tmpNode=tmpNode.nextSibling;
 }
 //проверим, нет ли в боди нотесов разделов второго уровня вложения
 if (NashliBodyNotes) {
   var ptr1 = BodyNotes.firstChild;
   var SecondLevelSection = false;
   while ((ptr1)&&(!SecondLevelSection)) {
     if ((ptr1.tagName=="DIV")&&(ptr1.className=="section")) {
       var ptr2 = ptr1.firstChild;
       while ((!SecondLevelSection)&&(ptr2)) {
         if (ptr2.tagName=="DIV") {
           if (ptr2.className=="section") { SecondLevelSection=true; }
         }
         ptr2 = ptr2.nextSibling;
       }
     }
     ptr1 = ptr1.nextSibling;
   }
   if (SecondLevelSection) {
     MsgBox("В body примечаний есть разделы второго уровня вложения. Такие файлы не обрабатываются данным скриптом. Работа скрипта завершена.");
     return;
   }
//создадим заголовок боди нотесов, если нет его
   var bbb=BodyNotes.firstChild;
   var flag4 = true;
   while ((flag4)&&( (bbb.tagName!="DIV")||((bbb.className!="section")&&(bbb.className!="epigraph")&&(bbb.className!="title")))) {
     if (!bbb.nextSibling) {
      flag4 = false;
     } else {
      bbb=bbb.nextSibling;
     }
   }
  if ((flag4)&&(bbb.className!="title")) {
    var s5=bbb.outerHTML;
    s5="<DIV class=title><P>"+strconst5+"</P></DIV>"+s5;
    bbb.outerHTML=s5;
  }
  if ((!flag4)&&(bbb.className!="title")) {
    var s5=BodyNotes.innerHTML;
    s5=s5+"<DIV class=title><P>"+strconst5+"</P></DIV>";
    BodyNotes.innerHTML=s5;
  }
 }
//если нет боди нотесов, создадим его
 if (!NashliBodyNotes) {
  nodeT=document.createElement("DIV");
  nodeT.className="body";
  nodeT.setAttribute("xlmns:l","http://www.w3.org/1999/xlink");
  nodeT.setAttribute("xlmns:f","http://www.gribuser.ru/xml/fictionbook/2.0");
  nodeT.setAttribute("fbname",bodyNotesName);
  nodeT.innerHTML="<DIV class=title><P>"+strconst5+"</P></DIV>";
  //divs[i4].outerHTML=divs[i4].outerHTML+'<DIV class=body '+
  //          'xlmns:l="http://www.w3.org/1999/xlink" '+
  //          'xlmns:f="http://www.gribuser.ru/xml/fictionbook/2.0" '+
  //         'fbname="'+bodyNotesName+'"><DIV class=title><P>'+strconst5+'</P></DIV>'+
  //        '</DIV>';
  BodyNotes=body.insertBefore(nodeT,null);
 }
}

function dobavlenie_snoski(NoteNum) {
  if (initWasCalled==false) {
   init_dobavlenie_snoski();
   initWasCalled=true;
  }
  //прочитаем в массив SectID ID-ы разделов примечаний
  //for (j1=0; j1<sects.length; j1++) {
  // if (sects[j1].className=="section") {
  //  SectNum++;
  //  SectID[SectNum]=sects[j1].getAttribute("id");
  // }
  //}
// определяем номер нашей сноски
  j5=0;
//   MsgBox("document.links.length:"+document.links.length);
  //в j5 получим индекс свежевставленной ссылки
  while (j5<document.links.length && document.links[j5].innerHTML!="Sclex_NotesFromBrackets_"+NoteNum)
   j5++;
  if (j5<document.links.length) {
   j6=j5+1;
   while_flag=true;
   while (while_flag) {
    if (j6<document.links.length)
     if (document.links[j6].className!="note") { j6++; }
     else {while_flag=false;}
    else {while_flag=false;}
   }
   if (j6<document.links.length) {
    utb=document.getElementById(getLocalHref(document.links[j6].getAttribute("href")));
    if (utb==null) {
     document.links[j5].removeNode(true);
     document.links[j5].scrollIntoView(true);
     finalization();
     MsgBox(getVersionStr()+"Ссылка сноски ссылается на несуществующий раздел.\nПозиция обзора установлена на неисправную ссылку."+"\n\n"+getExitStr());
     errorStatus=1;
     window.external.EndUndoUnit(document);
     return;
    }
    if (!BodyNotes.contains(utb) || utb.className!="section") {
     document.links[j5].removeNode(true);
     document.links[j5].scrollIntoView(true);
     finalization();
     MsgBox(getVersionStr()+"Ссылка сноски ссылается не внутрь раздела в теле примечаний.\nПозиция обзора установлена на неисправную ссылку."+"\n\n"+getExitStr());
     errorStatus=1;
     window.external.EndUndoUnit(document);
     return;
    }
   } else utb=null;
   cutOffSnoskaText();
   j5-=refsForCorrection;
   //if (j6<document.links.length) {
   // InsertN=FindNum(document.links[j6].getAttribute("href"),SectID,SectNum)+1;
   //} else {InsertN=1;}
   //if (InsertN==0) {InsertN=1}
   document.links[j5].className="note";
   document.links[j5].innerHTML=poShablonu(strconst4,InsertN);
   addedSnoskaCnt++;
   document.links[j5].setAttribute("href","#"+randomId+"___"+addedSnoskaCnt);
  }
 //} else {InsertN=1000000; InsertCnt=0}
 newEl=document.createElement("DIV");
 newEl.className="section";
 newEl.setAttribute("id",randomId+"___"+addedSnoskaCnt);
 newEl.innerHTML="<DIV class=title><P>***</P></DIV>"+
 NewNotesColl[NoteNum];
 BodyNotes.insertBefore(newEl,utb);
 ptr=document.links[j5];
 InsideP=true;
}

var j2;

function finalization() {
 if (initWasCalled==false) return;
 // поменяем заголовки разделов примечаний
 var sectCnt=0;
 var kdi,while_flag,el,id;
 var sectNumById=new Object();
 var sect=BodyNotes.firstChild;
 while (sect!=null) {
  if (sect.className=="section") {
   sectCnt++;
   id=sect.getAttribute("id");
   if (id!="" && id!=null) {
     sectNumById[id]=sectCnt;
     sect.setAttribute("id","");
   }
   kdi=sect.firstChild;
   var isThereTitle=false;
   if (kdi)
    if (kdi.nodeName=="DIV" && kdi.className=="title") isThereTitle=true;
   if (isThereTitle) {
    kdi.innerHTML=poShablonu(strconst2,sectCnt);
   } else {
    el=document.createElement("DIV");
    el.className="title";
    el.innerHTML=poShablonu(strconst2,sectCnt);
    sect.insertBefore(el,kdi);
   }
  }
  sect=sect.nextSibling;
 }
 var href;
 for (j2=0; j2<document.links.length; j2++) {
 //    if (document.links[j2].className=="note") {
  //     MsgBox("Свойство href: "+document.links[j2].getAttribute("href")+"\n"+
  //            "FindNum: "+FindNum(document.links[j2].getAttribute("href"),SectID,SectNum));
  // меняем адрес ссылки
  href=getLocalHref(document.links[j2].getAttribute("href"));
  if (href!=null) {
   if (sectNumById[href]) {
    document.links[j2].setAttribute("href","#"+poShablonu(strconst1,sectNumById[href]));
    // меняем текст ссылки
    if (document.links[j2].className=="note")
     document.links[j2].innerHTML = poShablonu(strconst4,sectNumById[href]);
   }
  }
 }
 var sect=BodyNotes.firstChild;
 sectCnt=0;
 while (sect!=null) {
  if (sect.className=="section") {
   sectCnt++;
   sect.setAttribute("id",poShablonu(strconst1,sectCnt));
  }
  sect=sect.nextSibling;
 }
}

 //начало Run()
 var Ts=new Date().getTime();
 var body=document.getElementById("fbw_body");
 if (!body) {MsgBox("ошибка. body не найден!"); return;}
 window.external.BeginUndoUnit(document,"remarks from brackets");
 if (makePrompt) {
  if (!promptAsText) {
   var s1,s2;
   MasksN=1;
   s1=prompt('Шаг 1 из 2. Введите регэксп "открывающей скобки":',"\\\[");
   if (!s1) return;
   try {
    Masks["0_1"]=new RegExp(s1,"i");
   }
   catch(e) {
    if (e instanceof RegExpError) {
     MsgBox(getVersionStr()+"Вы ввели некорректный регэксп.");
     return;
    }
   }
   s2=prompt('Шаг 2 из 2. Введите регэксп "закрывающей скобки":',"\\\]");
   if (!s2) return;
   try {
    Masks["0_2"]=new RegExp(s2,"i");
   }
   catch(e) {
    if (e instanceof RegExpError) {
     MsgBox(getVersionStr()+"Вы ввели некорректный регэксп.");
     return;
    }
   }
  } else {
   var s1;
   MasksN=1;
   s1=prompt('Введите строку, содержащую скобки простым текстом, разделенные пробелом',"[ ]");
   if (!s1) return;
   var ttt1=new RegExp(" +","gi");
   var ttt2=s1.match(ttt1);
   var ttt3=s1.search(ttt1);
   if (ttt3==-1) {
    MsgBox(getVersionStr()+"Ошибка. Во введенной вами строке отсутствует пробел.");
    return;
   }
   if (ttt2.length>1) {
    MsgBox(getVersionStr()+"Ошибка. Во введенной вами строке более чем одна группа пробелов.");
    return;
   }
   var re0=new RegExp("([^0-9a-z])","gi");
   var re0_="\\$1";
   //MsgBox(s1.substr(0,ttt3).replace(re0,re0_));
   Masks["0_1"]=new RegExp(s1.substr(0,ttt3).replace(re0,re0_),"");
   //MsgBox(s1.substr(ttt3+ttt2[0].length).replace(re0,re0_));
   Masks["0_2"]=new RegExp(s1.substr(ttt3+ttt2[0].length).replace(re0,re0_),"");
  }
 }
 var InsertCnt=1;
 var initWasCalled=false;
 var divs,NashliBodyNotes,BodyNotes,node2,node5,node6,srch5,s;
//следующие строки нужно раскомментировать, чтобы восстановить
//запрос параметров для вставки сноски
 var ptr=body.firstChild;
 var NewNotesCnt=0;
 var NewNotesColl = new Object();
 var ObrabotkaFinished = false;
 var InsideA=false;
 var CurrentP=null;
 var OpenedBracketP, ClosedBracketP, while_flag, len1, len2, match_arr, s2, srch3;
 var srch5_, beginNode;
 while (ptr!=null && ObrabotkaFinished==false) {

  if (ptr.nodeType==1 && ptr.nodeName=="P") {InsideP=true; CurrentP=ptr;};
  if (ptr.nodeType==1 && ptr.nodeName=="A") {InsideA=true};
  var FoundNote=false;
  myLoop1:
  if (ptr.nodeType==3 && InsideP && !InsideA) {
   var iii1=0;
   OpenedBracketP=null;
   while_flag=true;
   while (while_flag) {
    if (ptr.nextSibling!=null) {
     if (ptr.nextSibling.nodeType==3) {
      ptr.nodeValue+=ptr.nextSibling.nodeValue;
      ptr.nextSibling.parentNode.removeChild(ptr.nextSibling);
     }
     else while_flag=false;
    }
    else while_flag=false;
   }
   s=ptr.nodeValue;
   while (iii1<MasksN) {
    var srch1=s.search(Masks[iii1+"_1"]);
    if (srch1!=-1) {
    //сюда попадаем, если нашли открывающую скобку
      NewNotesCnt++;
      match_arr=s.match(Masks[iii1+"_1"]);
      len1=match_arr[0].length;
      ClosedBracketP=null;
      FoundNote=true;
      var NewNote="<P>";
      while_flag=true;
      while (while_flag) {
       if (ptr.nextSibling!=null) {
        if (ptr.nextSibling.nodeType==3) {
         ptr.nodeValue+=ptr.nextSibling.nodeValue;
         ptr.nextSibling.removeNode();
        }
        else while_flag=false;
       }
       else while_flag=false;
      }
      s=s.substring(0,srch1)+strconst6+s.substring(srch1+len1);
      srch3=s.search(Masks[iii1+"_2"]);
      srch5=-1;
      for (vby=0;vby<MasksN;vby++) {
       srch5_=s.search(Masks[vby+"_1"]);
       if (srch5_!=-1) srch5=srch5_-strconst6.length+len1;
      }
      if ((srch3==-1 && srch5!=-1)||(srch1!=-1 && srch5!=-1 && srch5<srch3)) {
       finalization();
       setCursorIntoTextNode(ptr,srch1);
       MsgBox(getVersionStr()+"После открывающей скобки встречена другая открывающая, видимо пропущена закрывающая. Курсор установлен перед примечанием с ошибкой."+"\n\n"+getExitStr());
       window.external.EndUndoUnit(document);
       return;
      }
      if (srch3!=-1) {
       typeOfAddedSnoska=1;
       //сюда попадаем, если есть закрывающая скобка в том же узле, где и открывающая
       srch3+=-strconst6.length+len1;
       match_arr=s.match(Masks[iii1+"_2"]);
       len2=match_arr[0].length;
       s=ptr.nodeValue;
       NewNote+=s.substring(srch1+len1,srch3); //между двумя скобками
       //часть узла после закрывающей скобки
       if (srch3+len2<s.length) {
        //вставим часть узла после закрывающей скобки как самостоятельный узел
        node2=document.createTextNode(s.substring(srch3+len2));
        ptr.parentNode.insertBefore(node2,ptr.nextSibling);
       }
       //вставим заготовку ссылки
       node5=document.createElement("A"); //элемент ссылки
       node5.innerHTML="Sclex_NotesFromBrackets_"+(NewNotesCnt-1); //текст ссылки
       node5.setAttribute("href","#sclex"); //атрибут адреса ссылки
       ptr.parentNode.insertBefore(node5,ptr.nextSibling);
       //вставим часть узла от скобки до скобки как самостоятельный узел
       node3=document.createTextNode(s.substring(srch1,srch3+len2));
       node3=ptr.parentNode.insertBefore(node3,ptr.nextSibling);
       //node3.removeNode();
       //вставим часть узла до открывающей скобки как самостоятельный узел
       if (srch1!=0) {
        var s1=s.substring(0,srch1); //часть узла до открывающей скобки
        ptr.nodeValue=s1;
       } else ptr.removeNode();
      } else {
       var NewNote=NewNote+s.substring(srch1+strconst6.length);
      }
      var FoundClosingBracket=false;
      //здесь надо усовершенствовать условие
      if (srch3==-1) beginNode=ptr;
      var ElemsToDeleteCnt=0;
      var ElemsToDeleteColl=new Object();
      var level=0;
      var refsForCorrection=0;
      while (FoundClosingBracket==false && srch3==-1) {
      //сюда попадаем, если нет закрывающей скобки в том же узле, где открывающая
      //т.е. это внутренний цикл прохода по дереву
       if (ptr && ptr.firstChild!=null) {
        ptr=ptr.firstChild; // либо углубляемся…
        level++;
       } else {
        while (ptr && ptr.nextSibling==null) {
         ptr=ptr.parentNode; // …либо поднимаемся (если уже сходили вглубь)
         // поднявшись до элемента P, не забудем поменять флаг
         level--;
         if (ptr && ptr.nodeType==1 && ptr.nodeName=="P") {
          InsideP=false;
          if (OpenedBracketP==null) {OpenedBracketP=ptr;}
          if (ptr!=OpenedBracketP) {
           ElemsToDeleteColl[ElemsToDeleteCnt]=ptr;
           ElemsToDeleteCnt++;
          }
         }
         if (level==-2 || (level==-1 && ptr.nodeName!="P" && ptr.nodeName!="DIV")) {
          finalization();
          setCursorIntoTextNode(beginNode,srch1);
          MsgBox(getVersionStr()+"Примечание кончается не внутри того тэга, в котором начинается. Курсор установлен перед примечанием с ошибкой.\n\n"+getExitStr());
          window.external.EndUndoUnit(document);
          return;
         }
         if (ptr && ptr.nodeType==1 && ptr.nodeName=="A") {InsideA=false}
         if (ptr && ptr.nodeType==1) {
          NewNote=NewNote+"</"+ptr.nodeName+">";
         }
        }
        if (ptr) ptr=ptr.nextSibling; //и переходим на соседний элемент
       }
       if (ptr && ptr.nodeName!="P") {
        ElemsToDeleteColl[ElemsToDeleteCnt]=ptr;
        ElemsToDeleteCnt++;
       }
       if (ptr && ptr.nodeName=="P") {
        ClosedBracketP=ptr;
       }
       //if (ptr && ptr.nodeName=="DIV") {
       // GoTo(CurrentP);
       // MsgBox(getVersionStr()+"Ошибка. Недопустимое форматирование внутри скобок примечания. Курсор установлен на абзац, где начинается примечание с ошибкой.\n\n"+getExitStr());
       // window.external.EndUndoUnit(document);
       // return;
       //}
      //ELEMENT_NODE
       if (ptr.nodeType==1) {
        attrs=ptr.attributes;
        NewNote=NewNote+"<"+ptr.nodeName;
        if (ptr.nodeName=="A") {
         NewNote=NewNote+' href="'+ptr.getAttribute("href")+'"';
         var sdd1=ptr.getAttribute("type");
         if (sdd1!="") {NewNote=NewNote+" type="+sdd1;}
         refsForCorrection++;
        }
        if (ptr.nodeName=="DIV") {
         NewNote=NewNote+' class="'+ptr.className+'"';
        }
        NewNote=NewNote+">";
       }
      //TEXT_NODE
       if (ptr.nodeType==3) {
        var s=ptr.nodeValue;
        var srch2=s.search(Masks[iii1+"_2"]);
        var srch5=-1;
        for (vby=0;vby<MasksN;vby++) {
         var srch5_ =s.search(Masks[vby+"_1"]);
         if (srch5_!=-1) srch5=srch5_;
        }
        if ((srch2==-1 && srch5!=-1)||(srch2!=-1 && srch5!=-1 && srch5<srch2)) {
         finalization();
         setCursorIntoTextNode(beginNode,srch1);
         MsgBox(getVersionStr()+"После открывающей скобки встречена другая открывающая, видимо пропущена закрывающая. Курсор установлен перед примечанием с ошибкой.\n\n"+getExitStr());
         window.external.EndUndoUnit(document);
         return;
        }
        if (srch2!=-1) {
         if (level>0) {
          finalization();
          setCursorIntoTextNode(beginNode,srch1);
          MsgBox(getVersionStr()+"Ошибка. Не все тэги, открытые внутри скобок, в них закрываются. Курсор установлен перед примечанием с ошибкой.\n\n"+getExitStr());
          window.external.EndUndoUnit(document);
          return;
         }
         FoundClosingBracket=true;
         NewNote=NewNote+s.substring(0,srch2);
        } else {
         NewNote=NewNote+s;
        }
       }
      }
      if (srch3==-1) {
       typeOfAddedSnoska=2;
       match_arr=s.match(Masks[iii1+"_2"]);
       len2=match_arr[0].length;
       //сюда попадаем, если нашли закрывающую скобку (не в том же узле, где открывающая)
       s2=ptr.nodeValue.substring(srch2+len2);
       if (s2!="") {
        //вставим то, что после закрывающей скобки, отдельным узлом
        node2=document.createTextNode(s2);
        ptr.parentNode.insertBefore(node2,ptr.nextSibling);
       }
       //вставим ссылку
       node5=document.createElement("A"); //элемент ссылки
       node5.innerHTML="Sclex_NotesFromBrackets_"+(NewNotesCnt-1); //текст ссылки
       node5.setAttribute("href","#temporary_value");
       ptr.parentNode.insertBefore(node5,ptr.nextSibling);
       //оформим то, что до закрывающей скобки
       ptr.nodeValue=ptr.nodeValue.substring(0,srch2+len2);
       ElemsToDeleteColl[ElemsToDeleteCnt]=ptr;
       ElemsToDeleteCnt++;
       //то, что после открывающей скобки, делаем самостоятельным узлом
       node3=document.createTextNode(beginNode.nodeValue.substring(srch1));
       beginNode.parentNode.insertBefore(node3,beginNode.nextSibling);
       ElemsToDeleteColl[ElemsToDeleteCnt]=beginNode.nextSibling;
       ElemsToDeleteCnt++;
       //оформим то, что до открывающей скобки
       if (srch1!=0) beginNode.nodeValue=beginNode.nodeValue.substring(0,srch1)
       else beginNode.removeNode();
       s2="";
      }
     NewNote=NewNote+"</P>";
     NewNotesColl[NewNotesCnt-1]=NewNote;
     dobavlenie_snoski(NewNotesCnt-1);
     if (errorStatus!=0) return;
     break myLoop1;
    }
    iii1++;
   }
  }
  if (FoundNote==false) {
   if (ptr && ptr.firstChild!=null) {
     ptr=ptr.firstChild; // либо углубляемся…
   } else {
     while (ptr && ptr.nextSibling==null && ObrabotkaFinished==false) {
      ptr=ptr.parentNode; // …либо поднимаемся (если уже сходили вглубь)
 // поднявшись до элемента P, не забудем поменять флаг
      if (ptr && ptr.nodeType==1 && ptr.nodeName=="P") {InsideP=false; CurrentP=false;}
      if (ptr && ptr.nodeType==1 && ptr.nodeName=="A") InsideA=false;
      if (ptr && ptr.nodeType==1 && ptr.nodeName=="DIV" &&
          ptr.getAttribute("id")=="fbw_body") ObrabotkaFinished=true;
     }
    if (ptr) ptr=ptr.nextSibling; //и переходим на соседний элемент
   }
  }
 }
 finalization();
 window.external.EndUndoUnit(document);
 MsgBox(getVersionStr()+getExitStr(true));
}
// функция находит номер комментария, соответствующего определенному имени раздела
// в исходном документе. В name передаем имя раздела, перед ним символ #, если это
// локальная ссылка. В SectID передаем массив имен разделов.
function FindNum(name,SectID,SectNum) {
  var i=1;
  var name1=name;
  var thg2=new RegExp("#");
  if (name1.search(thg2)==-1) {return(-1)}
  var thg=new RegExp("main\.html\#","i");
  srch10=name1.search(thg);
  if (srch10==-1) {
   name1 = name1.substring(1,name1.length);
  } else {
   name1 = name1.substring(srch10+10,name1.length);
  }
  while ((i<=SectNum)&&(SectID[i]!=name1)) {
   i++;
  }
  if (i>SectNum) {return(-1)}
  return(i);
}

function poShablonu(s,n) {
  var ttt3 = new RegExp("\%N");
  return(s.replace(ttt3,n));
}

function MoveNodeContent(node_from,node_to) {
 var p=node_from.firstChild;
 var tmp_node;
 var SaveNextP;
 while (p) {
  SaveNextP=p.nextSibling;
  tmp_node=p.cloneNode(true);
  node_to.appendChild(tmp_node);
  p=SaveNextP;
 }
 node_from.parentNode.removeChild(node_from);
}

function getLocalHref(name) {
  var i=1;
  var name1=name;
  var thg2=new RegExp("#");
  if (name1.search(thg2)==-1) {return(null)} //ссылка не может начинаться с 1
  var thg=new RegExp("main\.html\#","i");
  srch10=name1.search(thg);
  if (srch10==-1) {
   name1 = name1.substring(1,name1.length);
  } else {
   name1 = name1.substring(srch10+10,name1.length);
  }
  return(name1);
}

function getRandomNum(n) {
 var s="";
 for (var i=1;i<=n;i++) {
   s=s+Math.floor(Math.random()*10);
 }
 return s;
}
