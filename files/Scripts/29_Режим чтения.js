//скрипт «Режим чтения», автор Sclex
//версия 1.1

var readMode_history=[];

function readMode_onClick(e) {
 var fbw_body=document.getElementById("fbw_body");
 if (!fbw_body) return;
 var el=event.srcElement;
 var el2=el;
 while (el2 && el2.nodeName!="BODY" && el2.nodeName!="A")
  el2=el2.parentNode; if (el2.nodeName=="A") {
  var href=el2.href;
  if (href) {
   href=href.replace(/^.*?index.html#/i,"#");
   if (href.charAt(0)=="#") {
    var el2=document.getElementById(href.substr(1));
    if (el2) {
     var r=el2.getBoundingClientRect();
     window.scrollBy(-5000,r.top);
     readMode_history.push(el);
     return;
    }
   }
  }
 }
 myX=event.clientX;
 myY=event.clientY;
 var tr=document.body.createTextRange();
 tr.moveToPoint(myX,myY);
 fbw_body.setAttribute("contentEditable","true");
 tr.select();
 fbw_body.onclick=null;
 fbw_body.onkeydown=null;
 fbw_body.onmousewheel=null;
}

function scrollOneLineDown() {
 var fbw_body=document.getElementById("fbw_body");
 var r,tmpEl,el,n,lft,rgt,rects,firstTime;
 r=fbw_body.getBoundingClientRect();
 if (r==null || r.bottom<0) return;
 var el=fbw_body;
 while (el.nodeName!="P" && el.nodeName!="IMG") {
  lft=0;
  rgt=el.children.length-1;
  firstTime=true;
  r=el.getBoundingClientRect();
  n=0;
  while (lft<rgt) {
   n=Math.floor((lft+rgt-1)/2);
   tmpEl=el.children[n];
   r=tmpEl.getBoundingClientRect();
   if (!r) {
    alert("r==null N1");
    return false;
   }
   //alert("lft:"+lft+"\n"+
         //"rgt:"+rgt+"\n"+
         //"n:"+n+"\n"+
         //"r.top:"+r.top+"\n"+
         //"r.bottom:"+r.bottom+"\n"+
         //"tmpEl: "+tmpEl.outerHTML+"\n");
   if (r.top<0 && r.bottom<=0) lft=n+1;
   else if (r.top>0 && r.bottom>0) rgt=n;
   else if (r.top==0 || (r.top<0 && r.bottom>0)) {lft=n; rgt=n;}
   firstTime=false;
  }
  el=el.children[lft];
 }
 //alert("el.outerHTML final: "+el.outerHTML+"\n"+
       //"r.top:"+r.top+"\n"+
       //"r.bottom:"+r.bottom);
 if (el.nodeName=="P") {
  rects=el.getClientRects();
  lft=0;
  rgt=rects.length-1;
  while (lft<rgt || firstTime) {
   n=Math.round((lft+rgt-1)/2);
   r=rects[n];
   if (!r) {
    alert("r==null N2");
    return false;
   }
   //alert("tmpEl: "+tmpEl.outerHTML+"\n"+
         //"lft:"+lft+"\n"+
         //"rgt:"+rgt+"\n"+
         //"n:"+n+"\n"+
         //"r.top:"+r.top+"\n"+
         //"r.bottom:"+r.bottom);
   if (r.top<0 && r.bottom<0) lft=n+1;
   else if (r.top>0 && r.bottom>0) rgt=n;
   else if (r.top==0 || (r.top<0 && r.bottom>=0)) {lft=n; rgt=n;}
   firstTime=false;
  }
  if (lft+1<rects.length) {
   //alert("lft+1<rects.length");
   //alert("rects[lft+1].top: "+rects[lft+1].top);
   lft++;
   while (lft<rects.length && rects[lft].top==0) lft++;
   if (lft<rects.length) {window.scrollBy(0,rects[lft].top); return;}
  }
 }
 //alert("ujg\n"+
       //"el: "+el.outerHTML);
 while (el!=fbw_body && el.nextSibling==null) el=el.parentNode;
 if (el!=fbw_body) el=el.nextSibling;
 while (!(el.nodeName=="P" || el==fbw_body || el.nodeName=="IMG")) {
  if (!(el.nodeName=="P" || el.firstChild==null)) {
   el=el.firstChild;
  } else {
   while (el!=fbw_body && el.nextSibling==null) el=el.parentNode;
   if (el!=fbw_body) el=el.nextSibling;
  }
 }
 //alert("ujg2\n"+
       //"el: "+el.outerHTML);
 rects=el.getClientRects();
 r=rects[0];
 window.scrollBy(0,r.top);
 return;
}

function scrollOneLineUp() {
 var fbw_body=document.getElementById("fbw_body");
 var r,tmpEl,el,n,lft,rgt,rects,firstTime;
 r=fbw_body.getBoundingClientRect();
 if (r==null || r.bottom<0) return false;
 var el=fbw_body;
 while (el.nodeName!="P" && el.nodeName!="IMG") {
  lft=0;
  rgt=el.children.length-1;
  firstTime=true;
  r=el.getBoundingClientRect();
  n=0;
  while (lft<rgt) {
   n=Math.round((lft+rgt-1)/2);
   tmpEl=el.children[n];
   r=tmpEl.getBoundingClientRect();
   if (!r) {
    alert("r==null N3");
    return false;
   }
   //alert("lft:"+lft+"\n"+
         //"rgt:"+rgt+"\n"+
         //"n:"+n+"\n"+
         //"r.top:"+r.top+"\n"+
         //"r.bottom:"+r.bottom+"\n"+
         //"tmpEl: "+tmpEl.outerHTML+"\n");
   if (r.top<0 && r.bottom<0) lft=n+1;
   else if (r.top>0 && r.bottom>0) rgt=n;
   else if (r.top==0 || (r.top<0 && r.bottom>=0)) {lft=n; rgt=n;}
   firstTime=false;
  }
  el=el.children[lft];
 }
 //alert("el.outerHTML final: "+el.outerHTML+"\n"+
       //"r.top:"+r.top+"\n"+
       //"r.bottom:"+r.bottom);
 //alert("el.outerHTML:\n"+el.outerHTML);
 if (el.nodeName=="P") {
  rects=el.getClientRects();
  lft=0;
  rgt=rects.length-1;
  while (lft<rgt || firstTime) {
   n=Math.round((lft+rgt-1)/2);
   r=rects[n];
   if (!r) {
    alert("r==null N4");
    return false;
   }
   //alert("tmpEl: "+tmpEl.outerHTML+"\n"+
         //"lft:"+lft+"\n"+
         //"rgt:"+rgt+"\n"+
         //"n:"+n+"\n"+
         //"r.top:"+r.top+"\n"+
         //"r.bottom:"+r.bottom);
   if (r.top<0 && r.bottom<0) lft=n+1;
   else if (r.top>0 && r.bottom>0) rgt=n;
   else if (r.top==0 || (r.top<0 && r.bottom>=0)) {lft=n; rgt=n;};
   firstTime=false;
  }
  if (rects[lft].top<-1) {window.scrollBy(0,rects[lft].top+1); return;};
  if (lft-1>=0) {
   //alert("rects[lft+1].top: "+rects[lft+1].top);
   lft--;
   while (lft>=0 && rects[lft].top==0) lft--;
   if (lft>=0) {window.scrollBy(0,rects[lft].top+1); return;}
  }
 }
 while (el!=fbw_body && el.previousSibling==null) el=el.parentNode;
 if (el!=fbw_body) el=el.previousSibling;
 while (!(el.nodeName=="P" || el==fbw_body)) {
  if (!(el.nodeName=="P" || el.lastChild==null))
   el=el.lastChild;
  else {
   while (el!=fbw_body && el.previousSibling==null) el=el.parentNode;
   if (el!=fbw_body) el=el.previousSibling;
  }
 }
 rects=el.getClientRects();
 r=rects[rects.length-1];
 window.scrollBy(0,r.top);
 return;
}

function readMode_onKeyDown() {
 var c=event.keyCode;
 var fbw_body=document.getElementById("fbw_body");
 //40 = ArrowDown
 if (c==40) {
  scrollOneLineDown();
  event.cancelBubble=true;
  return false;
 }
 //39 = ArrowRight
 if (c==39) {
  scrollOneLineDown();
  scrollOneLineDown();
  scrollOneLineDown();
  event.cancelBubble=true;
  return false;
 }
 //38 = ArrowUp
 if (c==38) {
  scrollOneLineUp();
  event.cancelBubble=true;
  return false;
 }
 //37 = ArrowLeft
 if (c==37) {
  scrollOneLineUp();
  scrollOneLineUp();
  scrollOneLineUp();
  event.cancelBubble=true;
  return false;
 }
 if (c==8) {
  if (readMode_history.length>0)
   window.scrollBy(-5000,readMode_history.pop().getBoundingClientRect().top);
  event.cancelBubble=true;
  return false;
 }
}

function readMode_onMouseWheel() {
 var k=Math.floor(event.wheelDelta/120);
 if (k>0)
  for (var i=0; i<k; i++)
   scrollOneLineUp();
 else  
  for (var i=0; i>k; i--)
   scrollOneLineDown();
 event.cancelBubble=true;
 return false;  
}

function Run() {
 var fbw_body=document.getElementById("fbw_body");
 fbw_body.setAttribute("contentEditable","false");
 fbw_body.onclick=readMode_onClick;
 fbw_body.onkeydown=readMode_onKeyDown;
 fbw_body.onmousewheel=readMode_onMouseWheel;
}