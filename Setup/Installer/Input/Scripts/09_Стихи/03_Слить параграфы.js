//======================================
// Useful for merging lines each of
// which is a paragraph.
//======================================

function Run()
{
 var rng=document.selection.createRange();
 
 if(rng.compareEndPoints("StartToEnd", rng)!=0)
 {
  var str=rng.htmlText.replace(/([\-]\<\/P\>)\s*(\<P(\s+align=\"?\w*\"?)?\>)/gim, "-");

  str=str.replace(/(\<\/P\>)\s*(\<P(\s+align=\"?\w*\"?)?\>)/gim, " ");

  if(str!=rng.htmlText) // something has been replaced
  {
   window.external.BeginUndoUnit(document,"Слить параграфы");
   rng.pasteHTML(str); // replace selection in the document
    window.external.EndUndoUnit(document);
  }
 }
}
