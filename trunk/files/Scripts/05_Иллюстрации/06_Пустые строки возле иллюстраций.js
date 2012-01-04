//Скрипт "Пустые строки вокруг картинок"
//Автор Sclex
//http://www.fictionbook.org/forum/viewtopic.php?t=4412

function Run() {
 var versionStr="1.5";
 try { var nbspChar=window.external.GetNBSP(); }
 catch(e) { var nbspChar=String.fromCharCode(160); }
 var mode,fbw_body,ptr,ptrInBody,emptyLinePtr,emptyLinePtr2,nextEmptyLine,newEmptyLine,elementClass,el;
 var emptyLineRegExp=new RegExp("^[ "+nbspChar+"]*?$");
 var removedLinesCnt=0;
 var addedLinesCnt=0;

 //возвращает true, если абзац ptr - пустая строка, и false в противном случае
 function isLineEmpty(ptr) {
  return (ptr.innerText.search(emptyLineRegExp)>=0);
 }   

 //возвращает предыдущий элемент относительно ptr
 function getPreviousSibling(ptr) {
  return ptr.previousSibling;
 }
 
 //возвращает следующий элемент относительно ptr
 function getNextSibling(ptr) {
  return ptr.nextSibling;
 }

 //возвращает элемент ptr :-) ну так оно надо
 function getTheSameElement(ptr) {
  return ptr;
 }
  
 //удаляет пустые строки в направлении, заданном функцией directionFn, от ptr не включительно
 function removeEmptyLines(ptr,directionFn) {
  emptyLinePtr2=directionFn(ptr);
  while (emptyLinePtr2!=null && emptyLinePtr2.nodeName=="P" && isLineEmpty(emptyLinePtr2)) {
   nextEmptyLine=directionFn(emptyLinePtr2);
   emptyLinePtr2.removeNode(true);
   removedLinesCnt++;
   emptyLinePtr2=nextEmptyLine;
  }
 }

 //добавляет пустую строку в направлении, заданном функцией directionFn, от элемента ptr
 function addEmptyLine(ptr,directionFn) {
  newEmptyLine=document.createElement("P");
  newEmptyLine=ptr.parentNode.insertBefore(newEmptyLine,directionFn(ptr));
  window.external.inflateBlock(newEmptyLine)=true;
  addedLinesCnt++;
 }

 //делает так, что в направлении, заданном функцией directionFn, от ptr оказывается
 //одна ровно одна пустая строка, если только это не начало или конец содержимого секции
 //(но если leaveEmptyLineByAllMeans==true, то пустая строка остается даже в этом случае)
 function makeOneEmptyLine(ptr,directionFn,additionalDirectionFn,leaveEmptyLineAnyway) {
  emptyLinePtr=directionFn(ptr);
  if (emptyLinePtr!=null && emptyLinePtr.nodeName=="P" && isLineEmpty(emptyLinePtr)) {
   removeEmptyLines(emptyLinePtr,directionFn);
   el=directionFn(emptyLinePtr);
   if (el==null || el.className=="title" || el.className=="epigraph" || el.className=="annotation" || el.className=="section" || el.className=="cite")
    if (leaveEmptyLineAnyway!=true) removeEmptyLines(ptr,directionFn);
  }
  else if ((emptyLinePtr!=null && emptyLinePtr.className!="title" && 
            emptyLinePtr.className!="epigraph" && emptyLinePtr.className!="annotation" && 
            emptyLinePtr.className!="section" && emptyLinePtr.className!="cite"
           ) ||
          leaveEmptyLineAnyway==true) addEmptyLine(ptr,additionalDirectionFn);
 }
 
 function makeNoMoreThanOneEmptyLine(ptr,directionFn,additionalDirectionFn,leaveEmptyLineAnyway) {
  emptyLinePtr=directionFn(ptr);
  if (emptyLinePtr!=null && emptyLinePtr.nodeName=="P" && isLineEmpty(emptyLinePtr)) {
   removeEmptyLines(emptyLinePtr,directionFn);
   el=directionFn(emptyLinePtr);
   if (el==null || el.className=="title" || el.className=="epigraph" || el.className=="annotation" || el.className=="section" || el.className=="cite")
    if (leaveEmptyLineAnyway!=true) removeEmptyLines(ptr,directionFn);
  }
 }

 //обработка содержимого секции sectionPtr
 function processSection(sectionPtr) {
  var ptrInSection=sectionPtr.firstChild;
  var imageCnt, theOnlyImage, border, wasSectionImage, imageInSection, imageAfterBorder,
      preBorderElement, annotation, wasAnnotation, emptyBorderNow, afterBorder, wasSectionInside;
  ptrInSection=sectionPtr.firstChild;        
  if (mode==false) {
   while (ptrInSection) {
    if (ptrInSection.className=="image") {
     makeNoMoreThanOneEmptyLine(ptrInSection,getPreviousSibling,getTheSameElement,true);
     makeNoMoreThanOneEmptyLine(ptrInSection,getNextSibling,getNextSibling,true);
    }  
    ptrInSection=ptrInSection.nextSibling;
   }      
  }
  imageCnt=0;
  preBorderElement=null;
  wasSectionImage=false;
  border=null;
  ptrInSection=sectionPtr.firstChild;  
  imageInSection==null;
  emptyBorderNow=true;
  wasSectionInside=false;
  while (ptrInSection) {
   elementClass=ptrInSection.className.toLowerCase();  
   if (elementClass=="section") {
    processSection(ptrInSection);
    wasSectionInside=true;
   } 
   if (elementClass=="annotation") wasAnnotation=true;
   if (elementClass=="image") {
    imageCnt++;
    if (wasAnnotation && border==null) border=ptrInSection;
   } 
   if (border!=null && imageAfterBorder==undefined) imageAfterBorder=elementClass=="image" ? ptrInSection : false;
   /*if (emptyBorderNow &&
       ( 
        (ptrInSection.nodeName=="P" && !isLineEmpty(ptrInSection)) || 
        elementClass=="poem" || elementClass=="cite" ||
        elementClass=="table" || ptrInSection.nodeName=="image"
       ) {
    emptyBorderNow=false;
    afterBorder=
   }*/
   if (ptrInSection.nodeName=="P" || elementClass=="poem" || elementClass=="cite" ||
        elementClass=="table") {
    if (border==null) {
     border=ptrInSection;
     //if (ptrInSection.nodeName=="P" && isLineEmpty(ptrInSection)==true) 
     // emptyBorderNow=true;
    } 
   } else if (elementClass=="image" && imageCnt==2) {
    if (border==null) border=ptrInSection;
    if (imageInSection==null) imageInSection=ptrInSection;
   } else if (border==null) preBorderElement=ptrInSection;
   if (border==null && wasSectionImage==false && elementClass=="image") {
    wasSectionImage=true;
   }
   ptrInSection=ptrInSection.nextSibling;
  }
  ptrInSection=sectionPtr.firstChild;
  //в секции ничего нет, кроме картинки секции
  if (!wasSectionInside && wasSectionImage && border==null) {
   makeOneEmptyLine(preBorderElement,getNextSibling,getNextSibling,true);
   return;
  } else
  //секция содержит только картинку секции и пустые строки
  if (!wasSectionInside && wasSectionImage && border!=null && isLineEmpty(border) && imageAfterBorder==undefined) {
   makeOneEmptyLine(preBorderElement,getNextSibling,getNextSibling,true);
   return;
  } else
  //текстово-графическое содержимое секции начинается с картинки
  if (!wasSectionInside && border!=null && border.className=="image") {
   makeOneEmptyLine(border,getPreviousSibling,getTheSameElement,true);      
   ptrInSection=border.nextSibling;
  } else
  //текстово-графическое содержимое секции начинается с "пустая строка (строки) + картинка"
  if (!wasSectionInside && border!=null && border.nodeName=="P" && isLineEmpty(border) && 
      imageAfterBorder!=undefined && imageAfterBorder!=false) {
   if (mode==false) removeEmptyLines(imageAfterBorder,getNextSibling);
   ptrInSection=imageAfterBorder.nextSibling;
  } 
  //обход секции с добавлением/удалением пустых строк 
  while (ptrInSection) {
   if (ptrInSection.className=="image") {
    if (mode) {
     makeOneEmptyLine(ptrInSection,getPreviousSibling,getTheSameElement);
     makeOneEmptyLine(ptrInSection,getNextSibling,getNextSibling);
    } else {
     removeEmptyLines(ptrInSection,getPreviousSibling);
     removeEmptyLines(ptrInSection,getNextSibling);
    }
   }
   ptrInSection=ptrInSection.nextSibling;
  }
 }
 
 //обработка содержимого бади sectionPtr
 function processBody(bodyPtr) {
  ptrInBody=bodyPtr.firstChild;
  while (ptrInBody) {
   if (ptrInBody.className=="section") processSection(ptrInBody);
   ptrInBody=ptrInBody.nextSibling;
  }
 }
 
 window.external.BeginUndoUnit(document,"empty lines near images");
 mode=confirm("Выберите режим обработки:\n"+
                  "ОК – добавить пустые строки до и после картинок.\n"+
                  "Отмена – удалить пустые строки до и после картинок.\n");
 fbw_body=document.getElementById("fbw_body");
 if (!fbw_body) {
  MsgBox("Ошибка: fbw_body не найдено."); 
  return;
 }
 ptr=fbw_body.firstChild;
 while (ptr) {
  if (ptr.className=="body") processBody(ptr);
  ptr=ptr.nextSibling;
 }
 window.external.EndUndoUnit(document);
 alert("Скрипт «Пустые строки вокруг картинок»\n"+ 
       "(Версия "+versionStr+". Автор Sclex)\n"+
       "\n"+
       "Обработка успешно завершена.\n"+
       "\n"+
       "Статистика пустых строк:\n"+
       "Удалено: "+removedLinesCnt+"\n"+
       "Добавлено: "+addedLinesCnt);
}