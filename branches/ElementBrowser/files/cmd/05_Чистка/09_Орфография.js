// Проверка орфографии через Ms Word
// Автор Sclex, но некоторые фрагменты кода подсмотрены у Алекса Савельева
// Word.Application: {000209FF-0000-0000-C000-000000000046}

if (oMsWord==undefined) {var oMsWord;}
if (oMsWordDoc==undefined) {var oMsWordDoc;}

function Run()
{
  var Ts=new Date().getTime();
  var versionStr="1.2";
  var re0=new RegExp("[а-яёa-z0-9-]","i");
  var re1=new RegExp("[а-яёa-z]","i");
  var fromNextWord=true;

  function initMsWord() {
    if (oMsWord==undefined || oMsWord==null) {oMsWord=new ActiveXObject("Word.Application");}
    if (oMsWord==null) {
     MsgBox("Не удается запустить Ms Word.");
     return;
    }
    oMsWord.Visible=true;
    if (oMsWordDoc==undefined || oMsWordDoc==null) {oMsWordDoc = oMsWord.Documents.Add();}
  }

  function spellcheck(wordToCheck) {
    //alert("Слово:\n"+word);
    if (!oMsWordDoc) {
      alert("Ошибка: oMsWordDoc=null в функции spellcheck.");
      return;
    }
    oMsWord.Options.IgnoreUppercase=true;
    oMsWord.Options.CheckGrammarWithSpelling=true;
    oMsWord.Options.SuggestSpellingCorrections=true;
    //alert("Слово: "+wordToCheck+"\nРезультат: "+oMsWord.CheckSpelling(wordToCheck));
    return oMsWord.CheckSpelling(wordToCheck);
  }

  var fbw_body, range1, range2, range3, myStr, finished, myRange, ptr, while_flag, myWord;
  var myChar,len,firstIteration,saveParent;
  var beginOffset=0;
  var endOffset=0;

  initMsWord();
  fbw_body = document.getElementById("fbw_body");
  range1=document.selection.createRange();
  saveParent=range1.parentElement();
  ptr=saveParent;
  while_flag=true;
  if (!fbw_body.contains(saveParent)) {
    MsgBox("Курсор за пределами тела документа.");
    return;
  }
  while (while_flag) {
    if (ptr) {
      if (ptr.nodeName!="P" && ptr.nodeName!="DIV") ptr=ptr.parentElement;
      else while_flag=false;
    } else while_flag=false;
  }
  if (ptr.nodeName=="P") {
    range1.expand("word");
    if (fromNextWord==true) {
      range1.move("word",1);
      saveParent=range1.parentElement();
    }
    myRange=range1.duplicate();
    myRange.collapse();
    beginOffset=-1;
    while (myRange.parentElement()==saveParent) {
      myRange.move("character", -1);
      beginOffset++;
    }
  } else {
    while (ptr!=fbw_body && ptr.nodeName!="P") {
      if (ptr.hasChildNodes() && ptr.nodeName!="P") {
        ptr=ptr.firstChild;
      } else {
        while (ptr!=fbw_body && !ptr.nextSibling) ptr=ptr.parentNode;
        if (ptr!=fbw_body) ptr=ptr.nextSibling;
      }
    }
    beginOffset=0;
  }
  firstIteration=true;
  while (ptr!=fbw_body) {
    myStr=ptr.innerText;
    len=myStr.length;
    finished=false;
    if (!firstIteration) {
     beginOffset=0;
    } else firstIteration=false;
    endOffset=beginOffset;
    while (endOffset<len) {
      while (beginOffset<len &&
             myStr.substring(beginOffset,beginOffset+1).search(re0)<0) {
        beginOffset++;
      }
      myWord="";
      endOffset=beginOffset;
      myChar=myStr.substring(endOffset,endOffset+1);
      while (endOffset<len && myChar.search(re0)>=0) {
        myWord+=myChar;
        endOffset++;
        myChar=myStr.substring(endOffset,endOffset+1);
      }
      if (myWord.search(re1)>=0) {
        if (spellcheck(myWord)!=true) {
          range2 = range1.duplicate();
          range2.moveToElementText(ptr);
          range2.collapse();
          var range3 = range2.duplicate();
          range2.move("character",beginOffset);
          range3.move("character",endOffset);
          range2.setEndPoint("StartToEnd", range3);
          range2.select();
          return;
        }
      }
      beginOffset=endOffset+1;
    }
    if (ptr.hasChildNodes() && ptr.nodeName!="P") {
      ptr=ptr.firstChild;
    } else {
      while (ptr!=fbw_body && !ptr.nextSibling) ptr=ptr.parentNode;
      if (ptr!=fbw_body) ptr=ptr.nextSibling;
    }
    while (ptr!=fbw_body && ptr.nodeName!="P") {
      if (ptr.hasChildNodes() && ptr.nodeName!="P") {
        ptr=ptr.firstChild;
      } else {
        while (ptr!=fbw_body && !ptr.nextSibling) ptr=ptr.parentNode;
        if (ptr!=fbw_body) ptr=ptr.nextSibling;
      }
    }
  }
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
  MsgBox("             --== Sclex script ==--\n"+
         "Проверка орфографии через Word.\n"+
         "                  Версия "+versionStr+".\n\n"+
         "  Проверка орфографии завершена.\n"+
         "   Затрачено времени: "+TimeStr);
}