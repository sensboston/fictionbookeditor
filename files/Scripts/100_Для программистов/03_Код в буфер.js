function Run()
{
 var body=document.documentElement; //getElementById("fbw_body");
// var body=document.all.binobj;
 if(!body) return;
 var s1 = body.outerHTML;
 window.clipboardData.setData("text",s1);
}