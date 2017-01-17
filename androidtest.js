
var files = ['/Volumes/Work/Projects/Android/JASONETTE-Android/app/Extensions/JasonConsoleAction/Main.java',
             '/Volumes/Work/Projects/Android/JASONETTE-Android/app/Extensions/JasonConsoleAction/jr.json'];

var path = '/Volumes/Work/Projects/Android/JASONETTE-Android/app';

var extName = '$console';

var actionPath = '/src/main/java/com/jasonette/seed/Action';
var assetPath = '/src/main/assets/jr'
var gradle = '/build.gradle';

var fs = require('fs');
dir = path + assetPath;
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

for(var i = 0 ; i < files.length; i++){
  var pieces = files[i].split('/');
  var fileName = pieces[pieces.length-1];
  var filePieces = fileName.split('.');
  var fileExtension = filePieces[filePieces.length-1];
  if(fileExtension == 'java'){
     fs.createReadStream(files[i]).pipe(fs.createWriteStream(path + actionPath + '/' + fileName));
  }
  else if (fileExtension == 'json') {

    fs.createReadStream(files[i]).pipe(fs.createWriteStream(path + assetPath + '/' + extName + ".json"));
  }
}
/*var content = fs.readFileSync( path + gradle, 'utf8');
console.log(GeneratePodFileContent(content,"\n    compile 'commons-lang:commons-lang:2.8888'"));

function GeneratePodFileContent(content,injection)
{
var string = content;
var preString = "compile ";
var searchString = "\n";
var preIndex = string.lastIndexOf(preString);
var searchIndex = preIndex + string.substring(preIndex).indexOf(searchString);
var pre = string.substr(0, searchIndex);
var post = string.substring(searchIndex)
return pre + injection + post;

}*/
