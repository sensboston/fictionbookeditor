//======================================
// Displays HTML code for the current
// section (only for script debugging)
//======================================

function Run()
{
 var rng=document.selection.createRange(); if(!rng) return false;

 var pe=rng.parentElement();

 while(pe && pe.tagName!="DIV" && pe.className!="section") pe=pe.parentElement;

 if(pe) MsgBox(pe.outerHTML);
}
