(function () {'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var os = require('os');
var electron = require('electron');
var jetpack = _interopDefault(require('fs-jetpack'));

var ShowErrorDialog = function(title, message){
  electron.remote.dialog.showErrorBox(title, message);
};

var IsValidProjectDirectory = function(path){
    const fs = require('fs');
    const folderPath = `${path}`;
    var files = fs.readdirSync(folderPath);
    for(var i in files){
      if(files[i] == 'Jasonette.xcodeproj')
        return true;
    }
    return false;
};

var IsExtesnionAlreadyExists = function(gitUrl, path){
  var pieces = gitUrl.replace(".git","").split("/");
  var extensionName = pieces[pieces.length-1];
  const folderPath = `${path}`;
  var fullPath = folderPath + "/Extensions/" + extensionName;
  return IsDirectoryExists(fullPath, true, true);
};
var ShowLoading = function(message, hide = false){
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

};
var IsValidGithubUrl = function(url){
  var isGithubUrl = require('is-github-url');
  if (url.indexOf("http://github.com/") !=-1){
      return isGithubUrl(url, { strict: true });
  }
  else {
      return isGithubUrl("http://github.com/" + url, { strict: true });
  }
};
var GetCompleteGitUrl = function(url){
  if (url.indexOf("http://github.com/") !=-1){
      return url;
  }
  else if (url.indexOf("https://github.com/") !=-1){
      return url;
  }
  else {
      return "http://github.com/" + url;
  }
};

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

var fs = require('fs');

var InjectCocoapodsDependencies = function(path, dependencies){
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
};

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
var post = string.substring(searchIndex);
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
  var alteredPath = path.substring(0, preIndex);
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

var CloneAndAddToIDE = function (path, gitUrl){
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
};
function GetAllFilesFromPath(path)
{
    var ValidFiles = [];
    var AllowedFiles = ["h","m","json","plist"];
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
          if(AllowedFiles.indexOf(filetype) > -1)
             ValidFiles.push(`${path}/` + files[i]);
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

// Simple wrapper exposing environment variables to rest of the code.

// The variables have been written to `env.json` by the build process.
var env = jetpack.cwd(__dirname).read('env.json', 'json');

// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.

// Use new ES6 modules syntax for everything.
document.addEventListener('DOMContentLoaded', function () {

const selectDirBtn = document.getElementById('btnInstall');
selectDirBtn.addEventListener('click', function (event) {

  const txtGitUrl = document.getElementById('repo').value;
  if(!IsValidGithubUrl(txtGitUrl)){
    ShowErrorDialog("Information", "Please enter valid github repositoru url.");
  }
  else{
    electron.ipcRenderer.send('open-file-dialog');
  }
});
electron.ipcRenderer.on('selected-directory', function (event, path) {
  var txtGitUrl = document.getElementById('repo').value;
  txtGitUrl = GetCompleteGitUrl(txtGitUrl);
  if(!IsValidProjectDirectory(path)){
     ShowErrorDialog("Information", "You need to select folder which have Jasonette.xcodeproj file.");
  }
  else if(IsExtesnionAlreadyExists(txtGitUrl, path)) {
    ShowErrorDialog("Information", "You have already installed this extesnion.");
  }
  else{
    ShowLoading("Downloading Extension...");
    CloneAndAddToIDE(path,txtGitUrl);
  }
});




});

}());
//# sourceMappingURL=main.js.map