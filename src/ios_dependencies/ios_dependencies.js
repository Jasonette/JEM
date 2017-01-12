import { ShowLoading, ShowErrorDialog } from '../utils/utils';
var fs = require('fs');

export var InjectCocoapodsDependencies = function(path, dependencies){
  var podPath = `${path}` + "/Podfile";
  console.log(podPath);
  ShowLoading('Syncying PodFile...');
  var content = GetPodFileContent(podPath);
  var injectableDependencies = GetInjectablePods(content, dependencies);
  if(injectableDependencies.length > 0){
      var generatedPod = GeneratePodFileContent(content, injectableDependencies);
      UpdatePodFile(generatedPod, podPath);
  }
  else{
    console.log("i don't have any dependencies");
    ShowLoading('Completed...', true);
  }
}

function GetPodFileContent(filePath)
{
  var fs = require('fs');
  var content = fs.readFileSync(filePath, 'utf8');
  return content;
}
function GeneratePodFileContent(content,injection)
{
var string = content;
var preString = "pod ";
var searchString = "\n";
var preIndex = string.lastIndexOf(preString);
var searchIndex = preIndex + string.substring(preIndex).indexOf(searchString);
var pre = string.substr(0, searchIndex);
var post = string.substring(searchIndex)
return pre + injection + post;

}

function GetInjectablePods(content, dependencies)
{
  var validDependencies = [];
  for(var i=0; i < dependencies.length; i++){
    if(content.indexOf(dependencies[i]) == -1){
        validDependencies.push("\n  " + dependencies[i]);
    }
  }
  return validDependencies;
}

function UpdatePodFile(content,filePath)
{
  fs.truncate(filePath, 0, function() {
      fs.writeFile(filePath, content, function (err) {
          if (err) {
              ShowLoading('Error while writing Podfile...', true);
              return console.log("Error writing file: " + err);
          }
          else {
            console.log("I am success");
            ExecutePodInstall(filePath);

          }
      });
  });
}
function ExecutePodInstall(path){
  ShowLoading('Installing dependencies...');
  var shell = require('shelljs');
  var preIndex = path.lastIndexOf('/Podfile');
  var alteredPath = path.substring(0, preIndex)
  console.log(alteredPath);


  try{
    shell.cd(alteredPath);
    shell.exec('pod install', function(code, stdout,stderr){
    console.log('Exit code : ', code);
    console.log('Program output : ', stdout);
    console.log('Program stederr : ', stderr);
    ShowLoading('Completed...', true);
  });
  }
  catch(e){
    ShowLoading('Error while Installing dependencies...');
  }

}
