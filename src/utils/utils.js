import { remote } from 'electron';

export var ShowErrorDialog = function(title, message){
  remote.dialog.showErrorBox(title, message);
}

    export var IsValidProjectDirectory = function(path, projectType){
    const fs = require('fs');
    const folderPath = `${path}`;
    var projectFile = 'Jasonette.xcodeproj';
    if(projectType == 'android'){ projectFile = 'build.gradle'; }
    var files = fs.readdirSync(folderPath);
    for(var i in files){
      if(files[i] == projectFile)
        return true;
    }
    return false;
}

export var IsExtesnionAlreadyExists = function(gitUrl, path){
  var pieces = gitUrl.replace(".git","").split("/");
  var extensionName = pieces[pieces.length-1];
  const folderPath = `${path}`;
  var fullPath = folderPath + "/Extensions/" + extensionName;
  return IsDirectoryExists(fullPath, true, true);
}
export var ShowLoading = function(message, hide = false){
  if(!hide){
    document.getElementById('btnInstall').disabled = true;
    document.getElementsByClassName('spinner')[0].style.display = "inline-block";
    document.getElementsByClassName('text-capitalize')[0].innerHTML = message;
  }
  else {

    setTimeout(function(){
      document.getElementsByClassName('text-capitalize')[0].innerHTML = message;
    }, 2000);

    setTimeout(function(){
      document.getElementById('btnInstall').disabled = false;
      document.getElementsByClassName('spinner')[0].style.display = "None";
    }, 5000);

  }

}
export var IsValidGithubUrl = function(url){
  var isGithubUrl = require('is-github-url');
  if (url.indexOf("http://github.com/") !=-1){
      return isGithubUrl(url, { strict: false });
  }
  else {
      return isGithubUrl("http://github.com/" + url, { strict: false });
  }
}
export var GetCompleteGitUrl = function(url){
  if (url.indexOf("http://github.com/") !=-1){
      return url;
  }
  else if (url.indexOf("https://github.com/") !=-1){
      return url;
  }
  else {
      return "http://github.com/" + url;
  }
}
export var GetActionName = function(gitFiles)
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
export var GetSpecificFilesFromPath = function(path, allowedFiles)
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
          if(allowedFiles.indexOf(filetype) > -1)
             ValidFiles.push(`${path}/` + files[i]);
           }
         }
    }
return ValidFiles;
}
function IsDirectoryExists (path, isFile, isDirectory) {
   try {
     const fs = require('fs');
      var matches = false;
      const folderPath = `${path}`;
      var stat = fs.statSync(folderPath);

      matches = matches || isFile && stat.isFile();
      matches = matches || isDirectory && stat.isDirectory();

      return matches;
   }
   catch (e) {
      if (e.code === 'ENOENT') {
         return false;
      }

      throw e;
   }
}
