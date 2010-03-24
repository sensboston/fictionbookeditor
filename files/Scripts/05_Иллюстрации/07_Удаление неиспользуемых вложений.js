//Скрипт «Удаление неиспользуемых картинок»
//Автор Sclex
//http://www.fictionbook.org/forum/viewtopic.php?t=4412

function Run() {

 var versionNum="1.0";

 function getLocalHref(name) {
   var i=1;
   var name1=name;
   if (name.indexOf("#")!=0) {return('"')}
   var thg=new RegExp("main\.html\#","i");
   srch10=name1.search(thg);
   if (srch10==-1) {
    name1 = name1.substring(1,name1.length);
   } else {
    name1 = name1.substring(srch10+10,name1.length);
   }
   return(name1);
 }

 var Ts=new Date().getTime();
 var imgs,fbw_body,i,coll,imgSrc,continueWithNonlocalImages,bins,id,binsRemovedCnt,imgDiv,
     lists1,lists2,coverHref,srcCoverHref;
 window.external.BeginUndoUnit(document,"removing unused pictures");
 fbw_body=document.getElementById("fbw_body");
 if (!fbw_body) return;
 imgs=fbw_body.getElementsByTagName("IMG");
 coll=new Object();
 continueWithNonlocalImages=false;
 for (i=0;i<imgs.length;i++) {
  imgDiv=imgs[i].parentNode;
  if (imgDiv.nodeName=="DIV" && imgDiv.className=="image") {
   imgSrc=getLocalHref(imgDiv.getAttribute("href"));
   if (continueWithNonlocalImages==false && imgSrc=='"') {
    if (confirm("В книге есть по меньшей мере одна картинка, которая имеет адрес без решетки, т.е. указывает на картинку вне документа. Хотите ли вы продолжить удаление неиспользуемых картинок?")) 
     continueWithNonlocalImages=true;
     else return;
   } else coll[imgSrc.toLowerCase()]=true;
  }
 }
 lists1=document.all.tiCover.getElementsByTagName("select");
 coverHref="";
 for (i=0;i<lists1.length;i++) 
  if (lists1[i].id=="href") {
   coverHref=lists1[i].value;
   if (coverHref!="") coverHref=getLocalHref(coverHref);
   break;
  }
 srcCoverHref="";
 lists2=document.all.stiCover.getElementsByTagName("select");
 for (i=0;i<lists2.length;i++) 
  if (lists2[i].id=="href") {
   srcCoverHref=lists2[i].value;
   if (srcCoverHref!="") srcCoverHref=getLocalHref(srcCoverHref);
   break;
  }
 if (coverHref=='"' || srcCoverHref=='"') 
  if (false==confirm("В книге есть по меньшей мере одна картинка, которая имеет адрес без решетки, т.е. указывает на картинку вне документа. Хотите ли вы продолжить удаление неиспользуемых картинок?"))
   return;
 coll[coverHref.toLowerCase()]=true;
 coll[srcCoverHref.toLowerCase()]=true;
 bins=document.all.binobj.getElementsByTagName("DIV");
 binsRemovedCnt=0;
 for (i=bins.length-1;i>=0;i--) {
  id=bins[i].all.id.value;
  if (coll[id.toLowerCase()]==undefined) {
   bins[i].removeNode(true);
   binsRemovedCnt++;
  } 
 }
 window.external.EndUndoUnit(document);
 var Tf=new Date().getTime();
 var Tmin = Math.floor((Tf-Ts)/60000);
 var Tsec = Math.ceil((Tf-Ts)/1000-Tmin*60);
 var Tsek = Math.ceil(10*((Tf-Ts)/1000-Tmin*60))/10;
 var Tssek = Math.ceil(100*((Tf-Ts)/1000-Tmin*60))/100;
 var Tsssek = Math.ceil(1000*((Tf-Ts)/1000-Tmin*60))/1000;
 if (Tssek<1 && Tmin<1)  var TimeStr=Tsssek+ " сек"
 else { if (Tsek<10 && Tmin<1)  var TimeStr=Tssek+ " сек"
 else { if (Tmin<1) var TimeStr=Tsek+ " сек"
 else if (Tmin>=1) var TimeStr=Tmin+ " мин " +Tsec+ " с" }}
 MsgBox("Удаление неиспользуемых картинок v"+versionNum+"\n"+
        "Автор Sclex.\n"+
        "\n"+
        "Затраченное время: "+TimeStr+".\n"+
        "Удалено вложений: "+binsRemovedCnt+".");
}