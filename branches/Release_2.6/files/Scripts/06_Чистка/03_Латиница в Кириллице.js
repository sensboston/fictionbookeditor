//======================================
// Замена латинских букв в русских словах на кириллицу
// Корректировка римских дат
//                                                          Engine by ©Sclex
//                                                                    08.02.2008
// 20.03.2010 — скорректировал скрипт для работы с польз. символом nbsp — Sclex 
//======================================
var VersionNumber="1.2";

//обрабатывать ли history
var ObrabotkaHistory=true;
//обрабатывать ли annotation
var ObrabotkaAnnotation=true;


function Run() {

 try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
 catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}


 var re1a = new RegExp("(A)([А-яЁё]{2,})","g");             //   A -> А, a -> а
 var re1a_ = "А$2";
 var re2a = new RegExp("([А-яЁё]+)(A)([А-яЁё]+)","g");
 var re2a_ = "$1А$3";
 var re3a = new RegExp("([А-яЁё]{2,})(A)","g");
 var re3a_ = "$1А";
 var re4a = new RegExp("(a)([А-яЁё]{2,})","g");
 var re4a_ = "а$2";
 var re5a = new RegExp("([А-яЁё]+)(a)([А-яЁё]+)","g");
 var re5a_ = "$1а$3";
 var re6a = new RegExp("([А-яЁё]{2,})(a)","g");
 var re6a_ = "$1а";

 var re1b = new RegExp("(B)([А-яЁё]{2,})","g");             //   B -> В
 var re1b_ = "В$2";
 var re2b = new RegExp("([А-яЁё]+)(B)([А-яЁё]+)","g");
 var re2b_ = "$1В$3";
 var re3b = new RegExp("([А-яЁё]{2,})(B)","g");
 var re3b_ = "$1В";

 var re1c = new RegExp("(C)([А-яЁё]{2,})","g");             //   C -> С, c -> с
 var re1c_ = "С$2";
 var re2c = new RegExp("([А-яЁё]+)(C)([А-яЁё]+)","g");
 var re2c_ = "$1С$3";
 var re3c = new RegExp("([А-яЁё]{2,})(C)","g");
 var re3c_ = "$1С";
 var re4c = new RegExp("(c)([А-яЁё]{2,})","g");
 var re4c_ = "с$2";
 var re5c = new RegExp("([А-яЁё]+)(c)([А-яЁё]+)","g");
 var re5c_ = "$1с$3";
 var re6c = new RegExp("([А-яЁё]{2,})(c)","g");
 var re6c_ = "$1с";

 var re1e = new RegExp("(E)([А-яЁё]{2,})","g");             //   E -> Е, e -> е
 var re1e_ = "Е$2";
 var re2e = new RegExp("([А-яЁё]+)(E)([А-яЁё]+)","g");
 var re2e_ = "$1Е$3";
 var re3e = new RegExp("([А-яЁё]{2,})(E)","g");
 var re3e_ = "$1Е";
 var re4e = new RegExp("(e)([А-яЁё]{2,})","g");
 var re4e_ = "е$2";
 var re5e = new RegExp("([А-яЁё]+)(e)([А-яЁё]+)","g");
 var re5e_ = "$1е$3";
 var re6e = new RegExp("([А-яЁё]{2,})(e)","g");
 var re6e_ = "$1е";

 var re1g = new RegExp("(g)([А-яЁё]{2,})","g");             //   g -> д
 var re1g_ = "д$2";
 var re2g = new RegExp("([А-яЁё]+)(g)([А-яЁё]+)","g");
 var re2g_ = "$1д$3";
 var re3g = new RegExp("([А-яЁё]{2,})(g)","g");
 var re3g_ = "$1д";

 var re1h = new RegExp("(H)([А-яЁё]{2,})","g");             //   H -> Н
 var re1h_ = "Н$2";
 var re2h = new RegExp("([А-яЁё]+)(H)([А-яЁё]+)","g");
 var re2h_ = "$1Н$3";
 var re3h = new RegExp("([А-яЁё]{2,})(H)","g");
 var re3h_ = "$1Н";

 var re1k = new RegExp("(K)([А-яЁё]{2,})","g");             //   K -> К
 var re1k_ = "К$2";
 var re2k = new RegExp("([А-яЁё]+)(K)([А-яЁё]+)","g");
 var re2k_ = "$1К$3";
 var re3k = new RegExp("([А-яЁё]{2,})(K)","g");
 var re3k_ = "$1К";

 var re1m = new RegExp("(M)([А-яЁё]{2,})","g");             //   M -> М, m -> т
 var re1m_ = "М$2";
 var re2m = new RegExp("([А-яЁё]+)(M)([А-яЁё]+)","g");
 var re2m_ = "$1М$3";
 var re3m = new RegExp("([А-яЁё]{2,})(M)","g");
 var re3m_ = "$1М";
 var re4m = new RegExp("(m)([А-яЁё]{2,})","g");
 var re4m_ = "т$2";
 var re5m = new RegExp("([А-яЁё]+)(m)([А-яЁё]+)","g");
 var re5m_ = "$1т$3";
 var re6m = new RegExp("([А-яЁё]{2,})(m)","g");
 var re6m_ = "$1т";

 var re1n = new RegExp("(n)([А-яЁё]{2,})","g");             //   n -> п
 var re1n_ = "п$2";
 var re2n = new RegExp("([А-яЁё]+)(n)([А-яЁё]+)","g");
 var re2n_ = "$1п$3";
 var re3n = new RegExp("([А-яЁё]{2,})(n)","g");
 var re3n_ = "$1п";

 var re1o = new RegExp("(O)([А-яЁё]{2,})","g");             //   O -> О, o -> о
 var re1o_ = "О$2";
 var re2o = new RegExp("([А-яЁё]+)(O)([А-яЁё]+)","g");
 var re2o_ = "$1О$3";
 var re3o = new RegExp("([А-яЁё]{2,})(O)","g");
 var re3o_ = "$1О";
 var re4o = new RegExp("(o)([А-яЁё]{2,})","g");
 var re4o_ = "о$2";
 var re5o = new RegExp("([А-яЁё]+)(o)([А-яЁё]+)","g");
 var re5o_ = "$1о$3";
 var re6o = new RegExp("([А-яЁё]{2,})(o)","g");
 var re6o_ = "$1о";

 var re1p = new RegExp("(P)([А-яЁё]{2,})","g");             //   P -> Р, p -> р
 var re1p_ = "Р$2";
 var re2p = new RegExp("([А-яЁё]+)(P)([А-яЁё]+)","g");
 var re2p_ = "$1Р$3";
 var re3p = new RegExp("([А-яЁё]{2,})(P)","g");
 var re3p_ = "$1Р";
 var re4p = new RegExp("(p)([А-яЁё]{2,})","g");
 var re4p_ = "р$2";
 var re5p = new RegExp("([А-яЁё]+)(p)([А-яЁё]+)","g");
 var re5p_ = "$1р$3";
 var re6p = new RegExp("([А-яЁё]{2,})(p)","g");
 var re6p_ = "$1р";

 var re1r = new RegExp("(r)([А-яЁё]{2,})","g");             //   r -> г
 var re1r_ = "г$2";
 var re2r = new RegExp("([А-яЁё]+)(r)([А-яЁё]+)","g");
 var re2r_ = "$1г$3";
 var re3r = new RegExp("([А-яЁё]{2,})(r)","g");
 var re3r_ = "$1г";

 var re1t = new RegExp("(T)([А-яЁё]{2,})","g");             //   T -> Т
 var re1t_ = "Т$2";
 var re2t = new RegExp("([А-яЁё]+)(T)([А-яЁё]+)","g");
 var re2t_ = "$1Т$3";
 var re3t = new RegExp("([А-яЁё]{2,})(T)","g");
 var re3t_ = "$1Т";

 var re1x = new RegExp("(X)([А-яЁё]{2,})","g");             //   X -> Х, x -> х
 var re1x_ = "Х$2";
 var re2x = new RegExp("([А-яЁё]+)(X)([А-яЁё]+)","g");
 var re2x_ = "$1Х$3";
 var re3x = new RegExp("([А-яЁё]{2,})(X)","g");
 var re3x_ = "$1Х";
 var re4x = new RegExp("(x)([А-яЁё]{2,})","g");
 var re4x_ = "х$2";
 var re5x = new RegExp("([А-яЁё]+)(x)([А-яЁё]+)","g");
 var re5x_ = "$1х$3";
 var re6x = new RegExp("([А-яЁё]{2,})(x)","g");
 var re6x_ = "$1х";

// Русская «Х» в римских датах, типа XIX

 var re7x = new RegExp("Х([IVХXLC])","g");
 var re7x_ = "X$1";
 var re8x = new RegExp("([IVХXLC])Х","g");
 var re8x_ = "$1X";


 var re1y = new RegExp("(y)([А-яЁё]{2,})","g");             //   y -> у
 var re1y_ = "у$2";
 var re2y = new RegExp("([А-яЁё]+)(y)([А-яЁё]+)","g");
 var re2y_ = "$1у$3";
 var re3y = new RegExp("([А-яЁё]{2,})(y)","g");
 var re3y_ = "$1у";


 var re1z = new RegExp("(3)([а-яё]{2,})","g");             //   3 (цифра "три") -> З (буква "Зэ")
 var re1z_ = "З$2";

 var re1s = new RegExp("([^\d])(6)([а-яё]{2,})","g");             //   6 (цифра "шесть") -> б (буква "Бэ")
 var re1s_ = "$1б$3";
 var re2s = new RegExp("([А-яЁё]+)(6)([а-яё]+)","g");
 var re2s_ = "$1б$3";
 var re3s = new RegExp("([А-яЁё]{2,})(6)","g");
 var re3s_ = "$1б";

// Попытка поймать однобуквенные предлоги, но только строчные — прописные могут быть и обозначениями переменных, хотя и со строчными всяко может быть…

 var re7a = new RegExp("([А-яЁё]{2,})([»\\\"“]{0,1})(\\\s|"+nbspEntity+")(a)(\\\s|"+nbspEntity+")([«\\\"„]{0,1})([А-яЁё]{2,})","g");             //   a -> а
 var re7a_ = "$1$2 а $6$7";

 var re7c = new RegExp("([А-яЁё]{2,})([»\\\"“]{0,1})(\\\s|"+nbspEntity+")(c)(\\\s|"+nbspEntity+")([«\\\"„]{0,1})([А-яЁё]{2,})","g");             //   c -> с
 var re7c_ = "$1$2 с $6$7";

 var re7o = new RegExp("([А-яЁё]{2,})([»\\\"“]{0,1})(\\\s|"+nbspEntity+")(o)(\\\s|"+nbspEntity+")([«\\\"„]{0,1})([А-яЁё]{2,})","g");             //   o -> о
 var re7o_ = "$1$2 о $6$7";

 var re7y = new RegExp("([А-яЁё]{2,})([»\\\"“]{0,1})(\\\s|"+nbspEntity+")(y)(\\\s|"+nbspEntity+")([«\\\"„]{0,1})([А-яЁё]{2,})","g");             //   y -> у
 var re7y_ = "$1$2 у $6$7";






  var Ts=new Date().getTime();
  var TimeStr=0;
  var s="";
  var count=0;

 // функция, обрабатывающая абзац P
 function HandleP(ptr) {
  s=ptr.innerHTML;

//                    A
       if (s.search(re1a)>=0)       { count += s.match(re1a).length;    s=s.replace(re1a, re1a_);  }
       if (s.search(re2a)>=0)       { count += s.match(re2a).length;    s=s.replace(re2a, re2a_);  }
       if (s.search(re3a)>=0)       { count += s.match(re3a).length;    s=s.replace(re3a, re3a_);  }
       if (s.search(re4a)>=0)       { count += s.match(re4a).length;    s=s.replace(re4a, re4a_);  }
       if (s.search(re5a)>=0)       { count += s.match(re5a).length;    s=s.replace(re5a, re5a_);  }
       if (s.search(re6a)>=0)       { count += s.match(re6a).length;    s=s.replace(re6a, re6a_);  }

//                    B
       if (s.search(re1b)>=0)       { count += s.match(re1b).length;    s=s.replace(re1b, re1b_);  }
       if (s.search(re2b)>=0)       { count += s.match(re2b).length;    s=s.replace(re2b, re2b_);  }
       if (s.search(re3b)>=0)       { count += s.match(re3b).length;    s=s.replace(re3b, re3b_);  }

//                    C
       if (s.search(re1c)>=0)       { count += s.match(re1c).length;    s=s.replace(re1c, re1c_);  }
       if (s.search(re2c)>=0)       { count += s.match(re2c).length;    s=s.replace(re2c, re2c_);  }
       if (s.search(re3c)>=0)       { count += s.match(re3c).length;    s=s.replace(re3c, re3c_);  }
       if (s.search(re4c)>=0)       { count += s.match(re4c).length;    s=s.replace(re4c, re4c_);  }
       if (s.search(re5c)>=0)       { count += s.match(re5c).length;    s=s.replace(re5c, re5c_);  }
       if (s.search(re6c)>=0)       { count += s.match(re6c).length;    s=s.replace(re6c, re6c_);  }

//                    E
       if (s.search(re1e)>=0)       { count += s.match(re1e).length;    s=s.replace(re1e, re1e_);  }
       if (s.search(re2e)>=0)       { count += s.match(re2e).length;    s=s.replace(re2e, re2e_);  }
       if (s.search(re3e)>=0)       { count += s.match(re3e).length;    s=s.replace(re3e, re3e_);  }
       if (s.search(re4e)>=0)       { count += s.match(re4e).length;    s=s.replace(re4e, re4e_);  }
       if (s.search(re5e)>=0)       { count += s.match(re5e).length;    s=s.replace(re5e, re5e_);  }
       if (s.search(re6e)>=0)       { count += s.match(re6e).length;    s=s.replace(re6e, re6e_);  }

//                    G
       if (s.search(re1g)>=0)       { count += s.match(re1g).length;    s=s.replace(re1g, re1g_);  }
       if (s.search(re2g)>=0)       { count += s.match(re2g).length;    s=s.replace(re2g, re2g_);  }
       if (s.search(re3g)>=0)       { count += s.match(re3g).length;    s=s.replace(re3g, re3g_);  }

//                    H
       if (s.search(re1h)>=0)       { count += s.match(re1h).length;    s=s.replace(re1h, re1h_);  }
       if (s.search(re2h)>=0)       { count += s.match(re2h).length;    s=s.replace(re2h, re2h_);  }
       if (s.search(re3h)>=0)       { count += s.match(re3h).length;    s=s.replace(re3h, re3h_);  }

//                    K
       if (s.search(re1k)>=0)       { count += s.match(re1k).length;    s=s.replace(re1k, re1k_);  }
       if (s.search(re2k)>=0)       { count += s.match(re2k).length;    s=s.replace(re2k, re2k_);  }
       if (s.search(re3k)>=0)       { count += s.match(re3k).length;    s=s.replace(re3k, re3k_);  }

//                    M
       if (s.search(re1m)>=0)       { count += s.match(re1m).length;    s=s.replace(re1m, re1m_);  }
       if (s.search(re2m)>=0)       { count += s.match(re2m).length;    s=s.replace(re2m, re2m_);  }
       if (s.search(re3m)>=0)       { count += s.match(re3m).length;    s=s.replace(re3m, re3m_);  }
       if (s.search(re4m)>=0)       { count += s.match(re4m).length;    s=s.replace(re4m, re4m_);  }
       if (s.search(re5m)>=0)       { count += s.match(re5m).length;    s=s.replace(re5m, re5m_);  }
       if (s.search(re6m)>=0)       { count += s.match(re6m).length;    s=s.replace(re6m, re6m_);  }

//                    N
       if (s.search(re1n)>=0)       { count += s.match(re1n).length;    s=s.replace(re1n, re1n_);  }
       if (s.search(re2n)>=0)       { count += s.match(re2n).length;    s=s.replace(re2n, re2n_);  }
       if (s.search(re3n)>=0)       { count += s.match(re3n).length;    s=s.replace(re3n, re3n_);  }

//                    O
       if (s.search(re1o)>=0)       { count += s.match(re1o).length;    s=s.replace(re1o, re1o_);  }
       if (s.search(re2o)>=0)       { count += s.match(re2o).length;    s=s.replace(re2o, re2o_);  }
       if (s.search(re3o)>=0)       { count += s.match(re3o).length;    s=s.replace(re3o, re3o_);  }
       if (s.search(re4o)>=0)       { count += s.match(re4o).length;    s=s.replace(re4o, re4o_);  }
       if (s.search(re5o)>=0)       { count += s.match(re5o).length;    s=s.replace(re5o, re5o_);  }
       if (s.search(re6o)>=0)       { count += s.match(re6o).length;    s=s.replace(re6o, re6o_);  }

//                    P
       if (s.search(re1p)>=0)       { count += s.match(re1p).length;    s=s.replace(re1p, re1p_);  }
       if (s.search(re2p)>=0)       { count += s.match(re2p).length;    s=s.replace(re2p, re2p_);  }
       if (s.search(re3p)>=0)       { count += s.match(re3p).length;    s=s.replace(re3p, re3p_);  }
       if (s.search(re4p)>=0)       { count += s.match(re4p).length;    s=s.replace(re4p, re4p_);  }
       if (s.search(re5p)>=0)       { count += s.match(re5p).length;    s=s.replace(re5p, re5p_);  }
       if (s.search(re6p)>=0)       { count += s.match(re6p).length;    s=s.replace(re6p, re6p_);  }

//                    R
       if (s.search(re1r)>=0)       { count += s.match(re1r).length;    s=s.replace(re1r, re1r_);  }
       if (s.search(re2r)>=0)       { count += s.match(re2r).length;    s=s.replace(re2r, re2r_);  }
       if (s.search(re3r)>=0)       { count += s.match(re3r).length;    s=s.replace(re3r, re3r_);  }

//                    T
       if (s.search(re1t)>=0)       { count += s.match(re1t).length;    s=s.replace(re1t, re1t_);  }
       if (s.search(re2t)>=0)       { count += s.match(re2t).length;    s=s.replace(re2t, re2t_);  }
       if (s.search(re3t)>=0)       { count += s.match(re3t).length;    s=s.replace(re3t, re3t_);  }

//                    X
       if (s.search(re1x)>=0)       { count += s.match(re1x).length;    s=s.replace(re1x, re1x_);  }
       if (s.search(re2x)>=0)       { count += s.match(re2x).length;    s=s.replace(re2x, re2x_);  }
       if (s.search(re3x)>=0)       { count += s.match(re3x).length;    s=s.replace(re3x, re3x_);  }
       if (s.search(re4x)>=0)       { count += s.match(re4x).length;    s=s.replace(re4x, re4x_);  }
       if (s.search(re5x)>=0)       { count += s.match(re5x).length;    s=s.replace(re5x, re5x_);  }
       if (s.search(re6x)>=0)       { count += s.match(re6x).length;    s=s.replace(re6x, re6x_);  }
       if (s.search(re7x)>=0)       { count += s.match(re7x).length;    s=s.replace(re7x, re7x_);  }
       if (s.search(re8x)>=0)       { count += s.match(re8x).length;    s=s.replace(re8x, re8x_);  }


//                    Y
       if (s.search(re1y)>=0)       { count += s.match(re1y).length;    s=s.replace(re1y, re1y_);  }
       if (s.search(re2y)>=0)       { count += s.match(re2y).length;    s=s.replace(re2y, re2y_);  }
       if (s.search(re3y)>=0)       { count += s.match(re3y).length;    s=s.replace(re3y, re3y_);  }

//    Цифры
//                    Z
       if (s.search(re1z)>=0)       { count += s.match(re1z).length;    s=s.replace(re1z, re1z_);  }

//                    S
       if (s.search(re1s)>=0)       { count += s.match(re1s).length;    s=s.replace(re1s, re1s_);  }
       if (s.search(re2s)>=0)       { count += s.match(re2s).length;    s=s.replace(re2s, re2s_);  }
       if (s.search(re3s)>=0)       { count += s.match(re3s).length;    s=s.replace(re3s, re3s_);  }

//    Предлоги
//                    a
       if (s.search(re7a)>=0)       { count += s.match(re7a).length;    s=s.replace(re7a, re7a_);  }
//                    c
       if (s.search(re7c)>=0)       { count += s.match(re7c).length;    s=s.replace(re7c, re7c_);  }
//                    o
       if (s.search(re7o)>=0)       { count += s.match(re7o).length;    s=s.replace(re7o, re7o_);  }
//                    y
       if (s.search(re7y)>=0)       { count += s.match(re7y).length;    s=s.replace(re7y, re7y_);  }

//                         window.external.BeginUndoUnit(document,«кириллизация…»);
   ptr.innerHTML=s;      
//                         window.external.EndUndoUnit(document);
  } 

 var body=document.getElementById("fbw_body");
 var ptr=body;
 var ProcessingEnding=false;
 while (!ProcessingEnding && ptr) {
  SaveNext=ptr;
  if (SaveNext.firstChild!=null && SaveNext.nodeName!="P" && 
      !(SaveNext.nodeName=="DIV" && 
        ((SaveNext.className=="history" && !ObrabotkaHistory) || 
         (SaveNext.className=="annotation" && !ObrabotkaAnnotation))))
  {    SaveNext=SaveNext.firstChild;  }                                                         // либо углубляемся...

  else {
    while (SaveNext.nextSibling==null)  {
     SaveNext=SaveNext.parentNode;                                                           // ...либо поднимаемся (если уже сходили вглубь)
                                                                                                                // поднявшись до элемента P, не забудем поменять флаг
     if (SaveNext==body) {ProcessingEnding=true;}
                                                         }
   SaveNext=SaveNext.nextSibling; //и переходим на соседний элемент
         }
  if (ptr.nodeName=="P") HandleP(ptr);
  ptr=SaveNext;
 }


var Tf=new Date().getTime();
var Thour = Math.floor((Tf-Ts)/3600000);
var Tmin  = Math.floor((Tf-Ts)/60000-Thour*60);
var Tsec = Math.ceil((Tf-Ts)/1000-Tmin*60-Thour*3600);
var Tsec1 = Math.ceil(10*((Tf-Ts)/1000-Tmin*60))/10;
var Tsec2 = Math.ceil(100*((Tf-Ts)/1000-Tmin*60))/100;
var Tsec3 = Math.ceil(1000*((Tf-Ts)/1000-Tmin*60))/1000;

           if (Tsec3<1 && Tmin<1)    TimeStr=Tsec3+ " сек"
 else { if (Tsec2<10 && Tmin<1)   TimeStr=Tsec2+ " сек"
 else { if (Tsec1<30 && Tmin<1)   TimeStr=Tsec1+ " сек"
 else { if (Tmin<1)                       TimeStr=Tsec+ " сек" 
 else { if (Tmin>=1 && Thour<1)   TimeStr=Tmin+ " мин " +Tsec+ " с"
 else { if (Thour>=1)                    TimeStr=Thour+ " ч " +Tmin+ " мин " +Tsec+ " с"  }}}}}

 MsgBox ('          –= Jurgen Script =– \n'+
        '  «Кириллизация латиницы» v'+VersionNumber+'     \n\n'+

        '      Произведено замен: ' +count+'\n\n'+

        '   Время исполнения: ' +TimeStr+ '.\n' ); 

} 