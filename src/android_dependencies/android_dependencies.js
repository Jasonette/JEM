import { ShowLoading, ShowErrorDialog } from '../utils/utils';
var fs = require('fs');

export var InjectGradleDependencies = function(path, dependencies){
  var podPath = `${path}` + "/build.gradle";
  console.log(podPath);
  ShowLoading('Syncying Gradle ...');
  var content = GetGradleFileContent(podPath);
  var injectableDependencies = GetInjectableGradle(content, dependencies);
  if(injectableDependencies.length > 0){
      var generatedPod = GenerateGradleFileContent(content, injectableDependencies);
      UpdateGradleFile(generatedPod, podPath);
  }
  else{
    console.log("i don't have any dependencies");
    ShowLoading('Completed...', true);
  }
}

export var GetDependencies = function(gitFiles){
  for(var i in gitFiles){
    if(gitFiles[i].endsWith("jr.json")){
      var fs = require('fs');
      var jsonObj = JSON.parse(fs.readFileSync(gitFiles[i], 'utf8'));
      if(jsonObj.hasOwnProperty('dependencies'))
         return jsonObj.dependencies;
    }
  }
}

function GetGradleFileContent(filePath)
{
  var fs = require('fs');
  var content = fs.readFileSync(filePath, 'utf8');
  return content;
}
function GenerateGradleFileContent(content,injection)
{
var string = content;
var preString = "compile ";
var searchString = "\n";
var preIndex = string.lastIndexOf(preString);
var searchIndex = preIndex + string.substring(preIndex).indexOf(searchString);
var pre = string.substr(0, searchIndex);
var post = string.substring(searchIndex)
return pre + injection + post;

}

function GetInjectableGradle(content, dependencies)
{
  var validDependencies = [];
  for(var i=0; i < dependencies.length; i++){
    if(content.indexOf(dependencies[i]) == -1){
        validDependencies.push("\n    " + dependencies[i]);
    }
  }
  return validDependencies;
}

function UpdateGradleFile(content,filePath)
{
  fs.truncate(filePath, 0, function() {
      fs.writeFile(filePath, content, function (err) {
          if (err) {
              ShowLoading('Error while writing Podfile...', true);
              return console.log("Error writing file: " + err);
          }
          else {
            console.log("I am success");
            ShowLoading('Completed...', true);


          }
      });
  });
}
