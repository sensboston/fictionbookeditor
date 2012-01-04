function Run() {
 var imgs=document.getElementsByTagName("IMG");
 for (var i=imgs.length-1; i>=0; i--) {
  var MyImg=imgs[i];
  var pic_id=MyImg.src;
  MyImg.src="";
  MyImg.src=pic_id;
 }
 FillCoverList();
}