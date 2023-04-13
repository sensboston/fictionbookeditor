var xmlDoc=new ActiveXObject("Msxml2.DOMDocument.4.0");

function processFile(myPath) {
  xmlDoc.preserveWhiteSpace = true;
  xmlDoc.load(myPath);
  if (xmlDoc.parseError.errorCode) return;
  var pi = xmlDoc.firstChild;
  var encoding;
  if (pi)
  {
   attr = pi.attributes;
   if (attr) {
    enc = attr.getNamedItem("encoding");
    if (enc) {
     if (enc.value==desired_encoding) return;
     enc.value=desired_encoding;
    }
   }
  }
  xmlDoc.save(myPath);
  if (xmlDoc.parseError.errorCode) return;
  convertedCnt++;
  WScript.Echo("File "+myPath+" is converted.");
}

var fso=new ActiveXObject("Scripting.FileSystemObject");
convertedCnt=0;
desired_encoding="windows-1251";
if (WScript.Arguments.Count()==0) {
 WScript.Echo("Wrong parameters!\n\n"+
              "Use such format:\n\n"+
              "cscript fb2recodeToWindows-1251.js c:\\file.fb2\n\n"+
              "or:\n\n"+
              "cscript fb2recodeToWindows-1251 /dir C:\\books");
}
else {
 if (WScript.Arguments.Item(0)=="/dir") {
  var files=new Enumerator(fso.GetFolder(WScript.Arguments.Item(1)).files);
  for (var i=0,file=""; !files.atEnd(); files.moveNext()) {
   file = files.item() + "";
   if (fso.GetExtensionName(file).toLowerCase() == "fb2") {
    processFile(files.item().Path);
   }
  }
 } else {
  processFile(WScript.Arguments.Item(0));
 }
 WScript.Echo("======================================\n"+
              "How many files are converted: "+convertedCnt+".");
}