//======================================
//             «Добавить секцию в начало книги»
//~~~~~~~~~~~~~~~~~~
// v.1.0 — Создание скрипта — Александр Ка (21.09.2024)
//~~~~~~~~~~~~~~~~~~

function Run() {

//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------


                 /// ОБРАБОТКА ТЕКСТА

 var fbwBody=document.getElementById("fbw_body");
 var Child_F = fbwBody.firstChild;
 var Annotation;
 var History;
 var Body;

 //   Поиск аннотации, истории и первого body
 while (Child_F) {
         if (Child_F.nodeName == "DIV")  {
                 if (Child_F.className == "annotation")  Annotation = Child_F;
                 if (Child_F.className == "history")  History = Child_F;
                 if (Child_F.className == "body")  { Body = Child_F;  break; }    }
         Child_F = Child_F.nextSibling;
         }

window.external.BeginUndoUnit(document,"«Добавление секции в начало книги»");           // начало записи в систему отмен

 //   При отсутствии body - создание нового body, и вставка его в правильное место (после аннотации и истории, если они есть)
 if (!Body) {
         Body = document.createElement("DIV");
         Body.className = "body";
         if (History)  History.insertAdjacentElement("afterEnd", Body);
             else if (Annotation)  Annotation.insertAdjacentElement("afterEnd", Body);
                 else  fbwBody.insertAdjacentElement("afterBegin", Body);
         }

 var Child_B = Body.firstChild;
 var Image;
 var Title;
 var Epigraph;

 //   Поиск иллюстрации, заголовка, эпиграфов в первом body
 while (Child_B) {
         if (Child_B.nodeName != "DIV")  break;
         if (Child_B.className == "image")  Image = Child_B;
             else if (Child_B.className == "title")  Title = Child_B;
                 else if (Child_B.className == "epigraph")  Epigraph = Child_B;
                     else break;
         Child_B = Child_B.nextSibling;
         }

 //   Создание новой секции с пустой строкой
 var newSection = document.createElement("DIV");
 newSection.className = "section";
 newSection.insertAdjacentElement("afterBegin", document.createElement("P"));
 window.external.inflateBlock(newSection.firstChild)=true;

 //   Вставка новой секции в правильное место (после эпиграфов, заголовка и иллюстрации, если они есть)
 if (Epigraph)  Epigraph.insertAdjacentElement("afterEnd", newSection);
     else if (Title)  Title.insertAdjacentElement("afterEnd", newSection);
         else if (Image)  Image.insertAdjacentElement("afterEnd", newSection);
             else  Body.insertAdjacentElement("afterBegin", newSection);

window.external.EndUndoUnit(document);    // конец записи в систему отмен

// ---------------------------------------------------------------
// ----------------------------------------------
// -----------------------------



}







