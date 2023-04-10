// Унификация вложений и картинок
// автор Sclex

function Run() {
 var Ts=new Date().getTime();
 
 var versionNumber="1.5";

 // шаблон id картинок и вложений
 // вместо %N будет подставлен номер картинки
 var strconst1 = "i_%N";
 // как обозвать вложение-обложку
 var strconst2 = "cover";
 // как обозвать вложение-обложку оригинального издания
 var strconst3 = "cover_src";
 // префикс (то, что будет дописано в начале) к id вложений, на которые нет ссылки
 var strconst4 = "unused_";
 // префикс к ссылкам картинок, для которых нет вложений
 var strconst5 = "nobin_";
 // количество цифр, до которого будет дополняться номер картинки
 var strconst6 = "nonjpegpng_";
 // количество цифр, до которого будет дополняться номер картинки
 var SymbolsNum = 3;
 // количество цифр во временном имени бинарника, которое создается в процессе работы
 var DigitsInTempName = 10;
 //если true, выводить списки в столбик
 var ColumnView=true;

 /**
  * Возвращает единицу измерения с правильным окончанием
  * 
  * @param {Number} num      Число
  * @param {Object} cases    Варианты слова {nom: 'час', gen: 'часа', plu: 'часов'}
  * @return {String}            
  */
 function units(num, cases) {
     num = Math.abs(num);
     
     var word = '';
     
     if (num.toString().indexOf('.') > -1) {
         word = cases.gen;
     } else { 
         word = (
             num % 10 == 1 && num % 100 != 11 
                 ? cases.nom
                 : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) 
                     ? cases.gen
                     : cases.plu
         );
     }
     
     return word;
 }


 function PoShablonu(s,n) {
  var ttt3 = new RegExp("\%N");
  var n1=n.toString();
  while (n1.length<SymbolsNum) n1="0"+n1;
  return(s.replace(ttt3,n1));
 }

 function GetLocalHref(name) {
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

 function GetRandomNum(n) {
  var s="";
  for (var i=1;i<=n;i++) {
    s+=Math.floor(Math.random()*10);
  }
  return s;
 }

 function ChangeSrcInImageInfo(id,newId) {
  if (ImgInfoNumById[id]==null) return;
  ImagesInfo[ImgInfoNumById[id]].src="fbw-internal:#"+newId;
  ImgInfoNumById[NewId]=ImgInfoNumById[id];
  ImgInfoNumById[id]=null;
 }

 window.external.BeginUndoUnit(document,"binaries and images unification");
 var body=document.getElementById("fbw_body");
 if (!body) return;
 var imgs=body.getElementsByTagName("IMG");
 var bins=document.all.binobj.getElementsByTagName("DIV");
 var i,id,type;
 var ImgsById={};
 var NewBinobj=document.all.binobj.cloneNode(false);
 //количество картинок с определенным id
 var ImgCntById={};
 var BinById={};
 var ImgByNum={};
 var BinIdByNum={};
 var NonJpegPngImgs={};
 NonJpegPngImgs["0"]=0;
 var ImgInfoNumById={};
 var BinCnt=0;
 var CoversCnt=0;
 var ImgsWithoutBin_list="";
 var BinsWithoutImg_list="";
 var NonLocalImgs_list="";
 var NonJpegPngImgs_list="";
 var SavedUnusedCover=null;
 var SavedUnusedSrcCover=null;
 //проход по ImagesInfo
 for (i=0;i<ImagesInfo.length;i++) {
  ImgInfoNumById[ImagesInfo[i].src.replace(/^fbw-internal:#/i,"")]=i;
 } 
 //проход по вложениям
 for (i=0;i<bins.length;i++) {
  id=bins[i].all.id.value;
  if (BinById[id]==null || BinById[id]=="undefined") {
   type=bins[i].all.type.value;
   BinCnt++;
   BinIdByNum[BinCnt]=id;
   BinById[id]=bins[i];
   if (type!="image/png" && type!="image/jpeg") {
    NonJpegPngImgs["0"]++;
    NonJpegPngImgs[NonJpegPngImgs["0"]]=bins[i];
   }
  }
  else { MsgBox("Ошибка. Два вложения имеют одинаковый id: "+id); return; }
 }
 var href;
 var BinaryNotPresent=0;
 var NonLocalAddress=0;
 var imgDiv;
 var ImgCnt=0;
 //проход по картинкам
 for (i=0;i<imgs.length;i++) {
  imgDiv=imgs[i].parentNode;
  if ((imgDiv.nodeName=="DIV" || imgDiv.nodeName=="SPAN") && imgDiv.className=="image") {
   href=GetLocalHref(imgDiv.getAttribute("href"));
   if (href!='"') {
    if (BinById[href]!=null) {
     ImgCnt++;
     ImgByNum[ImgCnt]=imgs[i];
     if (ImgCntById[href]==null || ImgCntById[href]=="undefined") {ImgCntById[href]=1}
     else {ImgCntById[href]++;}
     ImgsById[href+'"'+ImgCntById[href]]=imgDiv;
    }
    else {
     var NewId;
     if (href.indexOf(strconst5)==0) NewId=href
     else NewId=strconst5+href;
     imgDiv.setAttribute("href","#"+NewId);
     imgDiv.firstChild.setAttribute("src","fbw-internal:#"+NewId);
     BinaryNotPresent++;
     if (!ColumnView) ImgsWithoutBin_list+=' "'+NewId+'"'
     else ImgsWithoutBin_list+='\n   "'+NewId+'"';
    }
   }
   // нелокальная ссылка
   else {
    if (!ColumnView) NonLocalImgs_list+=' "'+imgDiv.getAttribute("href")+'"'
    else NonLocalImgs_list+='\n   "'+imgDiv.getAttribute("href")+'"';
    NonLocalAddress++;
   }
  }
 }
 // выдерем из раздела бинарников html-код до первого DIV-а
 var ptr=document.all.binobj.firstChild;
 var GoMore=true;
 var tmp_node;
 while (GoMore) {
  if (ptr) {
   if (ptr.nodeName!="DIV") {
    tmp_node=ptr.cloneNode(true);
    NewBinobj.appendChild(tmp_node);
    ptr=ptr.nextSibling;
   }
   else GoMore=false;
  } else GoMore=false;
 }
 // сгенерим длинное случайное число для временных id
 var RandomNum=GetRandomNum(DigitsInTempName);
 var NewId,BinNum,j;
 var IdUsed={};
 var NewTiCover="";
 var NewStiCover="";
 // разберемся с обложкой
 var lists1=document.all.tiCover.getElementsByTagName("select");
 id="";
 for (xyz1=0; xyz1<lists1.length; xyz1++)
  if (lists1[xyz1].id=='href') {
   id=lists1[xyz1].value;
   if (id!="") id=GetLocalHref(id);
   break;
  }
 if (id=="")
  if (BinById[strconst2+".png"]) { id=strconst2+".png"; NewTiCover=id; }
  else if (BinById[strconst2+".jpg"]) { id=strconst2+".jpg"; NewTiCover=id;}
   else if (BinById[strconst2+".jpeg"]) { id=strconst2+".jpeg"; NewTiCover=id;}
 var id_="";
 if (document.all.stiCover!=null) {
  var lists2=document.all.stiCover.getElementsByTagName("select");
  for (xyz2=0; xyz2<lists2.length; xyz2++)
   if (lists2[xyz2].id=='href') {
    id_=lists2[xyz2].value;
    if (id_!="") id_=GetLocalHref(id_);
    break;
   }
 }
 if (id_=="")
  if (BinById[strconst3+".png"]) { id_=strconst3+".png"; NewStiCover=id;}
  else if (BinById[strconst3+".jpg"]) { id_=strconst3+".jpg"; NewStiCover=id;}
   else if (BinById[strconst3+".jpeg"]) { id_=strconst3+".jpeg"; NewStiCover=id;}
 if (id!='' && id==id_) {
  MsgBox("Ошибка.\n"+
         "Обложка книги и обложка оригинального издания ссылаются на одно вложение.\n"+
         "Такая ситуация не обрабатывается данным скриптом.");
  return;
 }
 if (id!="" && BinById[id]!=null) {
  NewId=strconst2;
  type=BinById[id].all.type.value;
  if (type=="image/png") {NewId+=".png";}
  else if (type=="image/jpeg") {NewId+=".jpg";}
   else {
    NewId=id;
    if (!ColumnView) NonJpegPngImgs_list+=' "'+NewId+'" (обложка)'
    else NonJpegPngImgs_list+='\n   "'+NewId+'" (обложка)';
   }
  if (id!=NewId) {
   if (BinById[NewId]) {
    for (j=1;j<=ImgCntById[NewId];j++) {
     ImgsById[strconst4+NewId+'"'+j]=ImgsById[NewId+'"'+j];
     ImgsById[NewId+'"'+j]=null;
     ImgsById[strconst4+NewId+'"'+j].setAttribute("href","#"+strconst4+NewId);
     ImgsById[strconst4+NewId+'"'+j].firstChild.setAttribute("src","fbw-internal:#"+strconst4+NewId);
    }
    ChangeSrcInImageInfo(NewId,strconst4+NewId);
    BinById[strconst4+NewId]=BinById[NewId];
    BinById[NewId]=null;
    BinById[strconst4+NewId].all.id.value=strconst4+NewId;
    BinIdByNum[BinNum]=strconst4+NewId;
    ImgCntById[strconst4+NewId]=ImgCntById[NewId];
    ImgCntById[NewId]=null;    
    IdUsed[strconst4+NewId]=1;
    SavedUnusedCover=BinById[strconst4+NewId].cloneNode(true);
   }
   for (j=1;j<=ImgCntById[id];j++) {
    ImgsById[NewId+'"'+j]=ImgsById[id+'"'+j];
    ImgsById[id+'"'+j]=null;
    ImgsById[NewId+'"'+j].setAttribute("href","#"+NewId);
    ImgsById[NewId+'"'+j].firstChild.setAttribute("src","fbw-internal:#"+NewId);
   }
   ChangeSrcInImageInfo(id,NewId);
   BinById[NewId]=BinById[id];
   BinById[id]=null;
   BinById[NewId].all.id.value=NewId;
   BinIdByNum[BinNum]=NewId;
   IdUsed[NewId]=1;
   tmp_node=BinById[NewId].cloneNode(true);
   NewBinobj.appendChild(tmp_node);
   NewTiCover=NewId;
   CoversCnt++;
  } else {
   tmp_node=BinById[id].cloneNode(true);
   NewBinobj.appendChild(tmp_node);
   NewTiCover=id;
   IdUsed[id]=1;
  }
 }
 // разберемся с обложкой оригинального издания
 id=id_;
 if (id!="" && BinById[id]!=null) {
  NewId=strconst3;
  type=BinById[id].all.type.value;
  if (type=="image/png") {NewId+=".png";}
  else if (type=="image/jpeg") {NewId+=".jpg";}
   else {
    NewId=id;
    if (!ColumnView) NonJpegPngImgs_list+=' "'+NewId+'" (обложка ориг. изд.)'
    else NonJpegPngImgs_list+='\n   "'+NewId+'" (обложка ориг. изд.)';
   }
  if (id!=NewId) {
   if (BinById[NewId]) {
    for (j=1;j<=ImgCntById[NewId];j++) {
     ImgsById[strconst4+NewId+'"'+j]=ImgsById[NewId+'"'+j];
     ImgsById[NewId+'"'+j]=null;
     ImgsById[strconst4+NewId+'"'+j].setAttribute("href","#"+strconst4+NewId);
     ImgsById[strconst4+NewId+'"'+j].firstChild.setAttribute("src","fbw-internal:#"+strconst4+NewId);
    }
    ChangeSrcInImageInfo(NewId,strconst4+NewId);
    BinById[strconst4+NewId]=BinById[NewId];
    BinById[NewId]=null;
    BinById[strconst4+NewId].all.id.value=strconst4+NewId;
    BinIdByNum[BinNum]=strconst4+NewId;
    ImgCntById[strconst4+NewId]=ImgCntById[NewId];
    ImgCntById[NewId]=null;    
    IdUsed[strconst4+NewId]=1;
    var SavedUnusedSrcCover=BinById[strconst4+NewId].cloneNode(true);
   }
   for (j=1;j<=ImgCntById[id];j++) {
    ImgsById[NewId+'"'+j]=ImgsById[id+'"'+j];
    ImgsById[id+'"'+j]=null;
    ImgsById[NewId+'"'+j].setAttribute("href","#"+NewId);
    ImgsById[NewId+'"'+j].firstChild.setAttribute("src","fbw-internal:#"+NewId);
   }
   ChangeSrcInImageInfo(id,NewId);
   var Bin=BinById[id];
   BinById[NewId]=Bin;
   BinById[id]=null;
   Bin.all.id.value=NewId;
   BinIdByNum[BinNum]=NewId;
   IdUsed[NewId]=1;
   tmp_node=BinById[NewId].cloneNode(true);
   NewBinobj.appendChild(tmp_node);
   NewStiCover=NewId;
   CoversCnt++;
  } else {
   tmp_node=BinById[id].cloneNode(true);
   NewBinobj.appendChild(tmp_node);
   NewStiCover=id;
   IdUsed[id]=1;
  }
 }
 // предварительное переименование всего, что нужно
 var ImgCnt2;
 var Bin;
 for (i=0;i<bins.length;i++) {
  id=bins[i].all.id.value;
  NewId="img_"+RandomNum+"_"+id;
  if (IdUsed[id]==null || IdUsed[id]==undefined) {
   ImgCnt2=ImgCntById[id];
   if (ImgCnt2!=null && ImgCnt2!="undefined")
    for (j=1;j<=ImgCnt2;j++) {
     ImgsById[NewId+'"'+j]=ImgsById[id+'"'+j];
     ImgsById[id+'"'+j]=null;
     ImgsById[NewId+'"'+j].setAttribute("href","#"+NewId);
     ImgsById[NewId+'"'+j].firstChild.setAttribute("src","fbw-internal:#"+NewId);
    }
   else { IdUsed[id]++; }
   ChangeSrcInImageInfo(id,NewId);
   Bin=BinById[id];
   BinById[NewId]=Bin;
   BinById[id]=null;
   Bin.all.id.value=NewId;
   BinIdByNum[BinNum]=NewId;
   ImgCntById[NewId]=ImgCntById[id];
   ImgCntById[id]=null;
  }
 }
 // окончательно переименовываем все, что нужно
 var cnt=0;
 for (i=1;i<=ImgCnt;i++) {
  imgDiv=ImgByNum[i].parentNode;
  if ((imgDiv.nodeName=="DIV" || imgDiv.nodeName=="SPAN") && imgDiv.className=="image") {
   id=GetLocalHref(imgDiv.getAttribute("href"));
   if (id!='"' &&
       (BinById[id].all.type.value=="image/png" ||
        BinById[id].all.type.value=="image/jpeg")) {
    if (ImgCntById[id]!=null) {
     if (IdUsed[id]==null || IdUsed[id]=="undefined") {
      cnt++;
      type=BinById[id].all.type.value;
      NewId=PoShablonu(strconst1,cnt);
      if (type=="image/png") NewId+=".png"
      else if (type=="image/jpeg") NewId+=".jpg";
      ChangeSrcInImageInfo(id,NewId);
      var Bin=BinById[id];
      BinById[NewId]=Bin;
      BinById[id]=null;
      Bin.all.id.value=NewId;
      BinIdByNum[BinNum]=NewId;
      for (j=1;j<=ImgCntById[id];j++) {
       ImgsById[NewId+'"'+j]=ImgsById[id+'"'+j];
       ImgsById[id+'"'+j]=null;
       ImgsById[NewId+'"'+j].firstChild.src="";
       ImgsById[NewId+'"'+j].setAttribute("href","#"+NewId);
       ImgsById[NewId+'"'+j].firstChild.src="fbw-internal:#"+NewId;
      }
      ImgCntById[NewId]=ImgCntById[id];
      ImgCntById[id]=null;
      tmp_node=BinById[NewId].cloneNode(true);
      NewBinobj.appendChild(tmp_node);
      IdUsed[NewId]=1;
     }
     else { IdUsed[id]++; }
    }
   }
  }
 }
 if (SavedUnusedCover) NewBinobj.appendChild(SavedUnusedCover);
 if (SavedUnusedSrcCover) NewBinobj.appendChild(SavedUnusedSrcCover);
 // перенесем вложения, на которые не ссылаются картинки
 var NonUsedBinary=0;
 var n;
 for (i=0;i<bins.length;i++) {
  id=bins[i].all.id.value;
  if (IdUsed[id]==null || IdUsed[id]=="undefined") {
   if (bins[i].all.type.value=="image/png" || bins[i].all.type.value=="image/jpeg") {
    if (id.substr(5+DigitsInTempName,strconst4.length)==strconst4) NewId=id.substr(5+DigitsInTempName)
    else {
     NewId=strconst4+id.substr(5+DigitsInTempName);
     NewId_=NewId;
     n=0;
     while (BinById[NewId] || BinById["img_"+RandomNum+"_"+NewId]) {
      NewId=NewId_+"_"+n;
      n++;
     }
    }
    ChangeSrcInImageInfo(id,NewId);
    BinById[NewId]=bins[i];
    bins[i].all.id.value=NewId;
    tmp_node=bins[i].cloneNode(true);
    NewBinobj.appendChild(tmp_node);
    NonUsedBinary++;
    IdUsed[NewId]=1;
    if (!ColumnView) BinsWithoutImg_list+=' "'+NewId+'"'
    else BinsWithoutImg_list+='\n   "'+NewId+'"';
   }
  }
 }
 // перенесем вложения, content-type которых не image/jpeg и не image/png
 for (i=1;i<=NonJpegPngImgs["0"];i++) {
  id=NonJpegPngImgs[i].all.id.value;
  if (IdUsed[id]==null || IdUsed[id]=="undefined") {
   if (id.substr(5+DigitsInTempName,strconst6.length)==strconst6) {
    NewId=id.substr(5+DigitsInTempName);
   }
   else {
    NewId_=strconst6+id.substr(5+DigitsInTempName);
    NewId=NewId_;
    n=0;
    while (BinById[NewId] || BinById["img_"+RandomNum+"_"+NewId]) {
     NewId=NewId_+"_"+n;
     n++;
    }
   }
   for (j=1;j<=ImgCntById[id];j++) {
    ImgsById[NewId+'"'+j]=ImgsById[id+'"'+j];
    ImgsById[id+'"'+j]=null;
    ImgsById[NewId+'"'+j].setAttribute("href","#"+NewId);
    ImgsById[NewId+'"'+j].firstChild.setAttribute("src","fbw-internal:#"+NewId);
   }
   NonJpegPngImgs[i].all.id.value=NewId;
   tmp_node=NonJpegPngImgs[i].cloneNode(true);
   NewBinobj.appendChild(tmp_node);
   if (!ColumnView) NonJpegPngImgs_list+=' "'+NewId+'"'
   else NonJpegPngImgs_list+='\n   "'+NewId+'"';
  }
 }
 document.all.binobj.replaceNode(NewBinobj);
 PutSpacers(document.all.binobj);
 FillCoverList();
 if (NewTiCover!="") lists1[xyz1].value="#"+NewTiCover;
 if (NewStiCover!="") lists2[xyz2].value="#"+NewStiCover;
 window.external.EndUndoUnit(document);

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

 var st2="";
 if (BinsWithoutImg_list!="") {st2+='\nНеиспользуемые бинарные объекты:'+BinsWithoutImg_list;}
 if (ImgsWithoutBin_list!="") {st2+='\nБезбинарные иллюстрации:'+ImgsWithoutBin_list;}
 if (NonLocalImgs_list!="") {st2+='\nИзображения с нелокальными адресами:'+NonLocalImgs_list;}
 if (NonJpegPngImgs_list!="") {st2+='\nВложения не image/jpg, не image/png:'+NonJpegPngImgs_list;}
 if (st2!="") st2="\n"+st2;
 MsgBox('            –= Sclex Script =– \n'+
    ' "Унификация вложений и картинок"\n'+
    '                          v'+versionNumber+'\n\n'+

        units(ImgCnt,{nom: 'Переименована', gen: 'Переименованы', plu: 'Переименовано'})+' '+ImgCnt+' '+units(ImgCnt,{nom: 'иллюстрация', gen: 'иллюстрации', plu: 'иллюстраций'})+'.\n'+
        units(CoversCnt,{nom: 'Переименована', gen: 'Переименованы', plu: 'Переименовано'})+' '+CoversCnt+' '+units(CoversCnt,{nom: 'обложка', gen: 'обложки', plu: 'обложек'})+'.\n'+
        units(NonLocalAddress,{nom: 'Обнаружено', gen: 'Обнаружены', plu: 'Обнаружено'})+' '+NonLocalAddress+' '+units(NonLocalAddress,{nom: 'изображение', gen: 'изображения', plu: 'изображений'})+' с нелокальным адресом.\n'+
        units(NonUsedBinary,{nom: 'Обнаружен', gen: 'Обнаружены', plu: 'Обнаружено'})+' '+NonUsedBinary+' '+units(NonUsedBinary,{nom: 'неиспользуемый бинарный объект', gen: 'неиспользуемых бинарных объекта', plu: 'неиспользуемых бинарных объектов'})+'.\n'+
        units(BinaryNotPresent,{nom: 'Обнаружена', gen: 'Обнаружены', plu: 'Обнаружено'})+' '+BinaryNotPresent+' '+units(BinaryNotPresent,{nom: 'безбинарная иллюстрация', gen: 'безбинарные иллюстрации', plu: 'безбинарных иллюстраций'})+'.\n'+
        units(NonJpegPngImgs["0"],{nom: 'Обнаружена', gen: 'Обнаружены', plu: 'Обнаружено'})+' '+NonJpegPngImgs["0"]+' '+units(NonJpegPngImgs["0"],{nom: 'иллюстрация', gen: 'иллюстрации', plu: 'иллюстраций'})+' с типом не image/jpeg, не image/png.\n\n'+
        'Время выполнения: '+TimeStr+'.'+st2);
}