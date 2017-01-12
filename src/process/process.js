import { ShowLoading, ShowErrorDialog } from '../utils/utils';
import { InjectCocoapodsDependencies } from '../ios_dependencies/ios_dependencies'

export var CloneAndAddToIDE = function (path, gitUrl){
    var pieces = gitUrl.replace(".git","").split("/");
    var extensionName = pieces[pieces.length-1];
    var fullPath = path + "/Extensions/" + extensionName;
    console.log("Git Url : " + gitUrl);
    console.log("Full path : " + fullPath);
    require('simple-git')()
        .clone(gitUrl, fullPath, function(err){
          if(err){
            ShowLoading("Extesnion doesn't exists.", true);
            ShowErrorDialog("Error", "Repository doesn't exists");
          }
        })
        .then(function() {
            ShowLoading('Verifying extension...');
            var AllFiles = GetAllFilesFromPath(fullPath);
            var extName = GetActionName(AllFiles);
            AddFileInXcode(AllFiles,path,extName);
            var dep = GetDependencies(AllFiles);
            if(dep != null && dep.length > 0){
              InjectCocoapodsDependencies(path, dep);
          }else {
            ShowLoading('Completed...', true);
          }
    });
}
function GetAllFilesFromPath(path)
{
    var ValidFiles = [];
    const folderPath = `${path}`;
    console.log(folderPath);
    const fs = require('fs');
    var files = fs.readdirSync(folderPath);
    for (var i in files) {
      if (files[i].indexOf(".") !=-1) {
        var arr = files[i].split('.');
        if(arr.length > 0){
          var filetype = arr[1];
          var fileName = arr[0];
          if(filetype == 'h' || filetype == "m" || (fileName == "jr" && filetype == "json")){
              ValidFiles.push(`${path}/` + files[i]);
          }
        }

      }
    }
return ValidFiles;
}

function GetActionName(gitFiles)
{
    for(var i in gitFiles){
      if(gitFiles[i].endsWith("jr.json")){
        var fs = require('fs');
        var jsonObj = JSON.parse(fs.readFileSync(gitFiles[i], 'utf8'));
        if(jsonObj.hasOwnProperty('name'))
           return "$" + jsonObj.name;
      }
    }
    return "$" + Math.random().toString(36).substring(7);
}

function GetDependencies(gitFiles){
  for(var i in gitFiles){
    if(gitFiles[i].endsWith("jr.json")){
      var fs = require('fs');
      var jsonObj = JSON.parse(fs.readFileSync(gitFiles[i], 'utf8'));
      if(jsonObj.hasOwnProperty('dependencies'))
         return jsonObj.dependencies;
    }
  }
}

function AddFileInXcode(AllFiles,path,extName)
{
    ShowLoading('Installing extesnion...');
    var xcode = require('node-xcode-opifex'),
    fs = require('fs'),
    projectSource = path + '/Jasonette.xcodeproj/project.pbxproj',
    projectPath = projectSource,
    myProj = xcode.project(projectSource);
    myProj.parse(function (err) {

    var testKey = myProj.pbxCreateGroup(extName, extName);
    var classesKey = myProj.findPBXGroupKey({name: 'Action'});
    myProj.addToPbxGroup(testKey, classesKey);

    for(var i= 0; i< AllFiles.length; i++){
        myProj.addSourceFileToGroup(AllFiles[i], extName);
    }
    fs.writeFileSync(projectPath, myProj.writeSync());
    });
}
