import { remote } from 'electron';

export var ShowErrorDialog = function(title, message){
  remote.dialog.showErrorBox(title, message);
}

export var IsValidProjectDirectory = function(path){
    const fs = require('fs');
    const folderPath = `${path}`;
    var files = fs.readdirSync(folderPath);
    for(var i in files){
      if(files[i] == 'Jasonette.xcodeproj')
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
    document.getElementById('loader').style.display = "inline-block";
    document.getElementById('loadingText').innerHTML = message;
  }
  else {

    setTimeout(function(){
      document.getElementById('loadingText').innerHTML = message;
    }, 2000);

    setTimeout(function(){
      document.getElementById('btnInstall').disabled = false;
      document.getElementById('loader').style.display = "None";
    }, 5000);

  }

}
export var IsValidGithubUrl = function(url){
  var isGithubUrl = require('is-github-url');
  if (url.indexOf("http://github.com/") !=-1){
      return isGithubUrl(url, { strict: true });
  }
  else {
      return isGithubUrl("http://github.com/" + url, { strict: true });
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
