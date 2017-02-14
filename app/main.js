(function () {'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var os = require('os');
var electron = require('electron');
var jetpack = _interopDefault(require('fs-jetpack'));

var ShowErrorDialog = function(title, message){
  electron.remote.dialog.showErrorBox(title, message);
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
    document.getElementsByClassName('spinner')[0].style.display = "inline-block";
    document.getElementsByClassName('message')[0].style.display = "inline-block";
    document.getElementsByClassName('message')[0].innerHTML = message;
  }
  else {

    setTimeout(function(){
      document.getElementsByClassName('message')[0].innerHTML = message;
    }, 2000);

    setTimeout(function(){
      document.getElementById('btnInstall').disabled = false;
      document.getElementsByClassName('spinner')[0].style.display = "None";
      document.getElementsByClassName('message')[0].style.display = "None";
    }, 5000);

  }

};
var IsValidGithubUrl = function(url){
  var isGithubUrl = require('is-github-url');
  if (url.indexOf("http://github.com/") !=-1){
      return isGithubUrl(url, { strict: false });
  }
  else {
      return isGithubUrl("http://github.com/" + url, { strict: false });
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
var GetActionName = function(gitFiles)
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
};
var GetSpecificFilesFromPath = function(path, allowedFiles)
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

var GetDependencies = function(gitFiles, extName){
  for(var i in gitFiles){
    if(gitFiles[i].endsWith(extName + ".json")){
      var fs = require('fs');
      var jsonObj = JSON.parse(fs.readFileSync(gitFiles[i], 'utf8'));
      if(jsonObj.hasOwnProperty('dependencies'))
         return jsonObj.dependencies;
    }
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
    shell.exec('/usr/local/bin/pod install', function(code, stdout,stderr){
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

var CloneAndAddToXcode = function (path, gitUrl){
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
            var validFiles = ["h","m","json","plist"];
            var AllFiles = GetSpecificFilesFromPath(fullPath, validFiles);
            var extName = GetActionName(AllFiles);
            AllFiles = renameJrJsonFile(AllFiles, extName);
            AddFilesInXcode(AllFiles,path,extName);
            var dep = GetDependencies(AllFiles,extName);
            if(dep != null && dep.length > 0){
              InjectCocoapodsDependencies(path, dep);
          }else {
            ShowLoading('Completed...', true);
          }
    });
};

function renameJrJsonFile(AllFiles, extName)
{
  var updatedFiles = [];
  var renameFilePath = "";
  for(var i = 0; i < AllFiles.length; i++)
  {
    if(AllFiles[i].indexOf('jr.json') != -1)
    {
        var fs = require('fs');
        renameFilePath = AllFiles[i].replace("jr.json", extName + ".json");
        fs.renameSync(AllFiles[i], renameFilePath);
    }
    else {
      renameFilePath = AllFiles[i];
    }
    updatedFiles.push(renameFilePath);
  }
  return updatedFiles;
}

function AddFilesInXcode(AllFiles,path,extName)
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

var fs$1 = require('fs');

var InjectGradleDependencies = function(path, dependencies){
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
};

var GetDependencies$1 = function(gitFiles){
  for(var i in gitFiles){
    if(gitFiles[i].endsWith("jr.json")){
      var fs = require('fs');
      var jsonObj = JSON.parse(fs.readFileSync(gitFiles[i], 'utf8'));
      if(jsonObj.hasOwnProperty('dependencies'))
         return jsonObj.dependencies;
    }
  }
};

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
var post = string.substring(searchIndex);
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
  fs$1.truncate(filePath, 0, function() {
      fs$1.writeFile(filePath, content, function (err) {
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

var CloneAndAddToAndroid = function (path, gitUrl){
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
          var validFiles = ["java","json"];
          var allFiles = GetSpecificFilesFromPath(fullPath, validFiles);
          var extName = GetActionName(allFiles);
          AddFilesInAndroidStudio(allFiles,fullPath,extName,path);
          var dep = GetDependencies$1(allFiles);
          if(dep != null && dep.length > 0){
            InjectGradleDependencies(path, dep);
          }else {
            ShowLoading('Completed...', true);
          }
        });
};

function AddFilesInAndroidStudio(AllFiles,extesnionPath,extName,path)
{
    ShowLoading('Installing extesnion...');

    var actionPath = path + '/src/main/java/com/jasonette/seed/Action';
    var assetPath = path + '/src/main/assets/file';
    var gradle = path + '/build.gradle';

    var fs = require('fs');
    if (!fs.existsSync(assetPath)){
        fs.mkdirSync(assetPath);
    }

    for(var i = 0 ; i < AllFiles.length; i++){
      var pieces = AllFiles[i].split('/');
      var fileFullName = pieces[pieces.length-1];
      var filePieces = fileFullName.split('.');
      var fileExtension = filePieces[filePieces.length-1];
      var fileName = filePieces[0];
      if(fileExtension == 'java'){
         fs.createReadStream(AllFiles[i]).pipe(fs.createWriteStream(actionPath + '/' + fileFullName));
      }
      else if (fileName == "jr" && fileExtension == 'json') {
        fs.createReadStream(AllFiles[i]).pipe(fs.createWriteStream(assetPath + '/' + extName + ".json"));
      }
      else if (fileExtension == 'json') {
        fs.createReadStream(AllFiles[i]).pipe(fs.createWriteStream(assetPath + '/' + fileFullName));
      }
    }
}

// Simple wrapper exposing environment variables to rest of the code.

// The variables have been written to `env.json` by the build process.
var env = jetpack.cwd(__dirname).read('env.json', 'json');

var nconf = require('nconf').file({file: getUserHome() + '/sound-machine-config.json'});



var readSettings = function(settingKey) {
    nconf.load();
    return nconf.get(settingKey);
};

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.

// Use new ES6 modules syntax for everything.
var gitUrl = "";
var extesnionType = "";



document.addEventListener('DOMContentLoaded', function () {

document.querySelector('body').addEventListener('click', function (event) {

  extesnionType = event.target.getAttribute('platform');

  if(event.target.id == 'btnInstall'){
    if(extesnionType != readSettings('project-type')){
      ShowErrorDialog("Information", "You can't install " + extesnionType + " extesnion on " + readSettings('project-type') + " project.");

    }
    else {
      gitUrl = event.target.getAttribute('url');

    if(!IsValidGithubUrl(gitUrl)){
      ShowErrorDialog("Information", "Incorrect extesnion url.");
    }
    else{
        gitUrl = GetCompleteGitUrl(gitUrl);
        var path =  readSettings('project-path');
        console.log("Selected Path : " + path);
        if(IsExtesnionAlreadyExists(gitUrl, path)) {
          ShowErrorDialog("Information", "You have already installed this extesnion.");
        }
        else {
          ShowLoading("Downloading Extension...");
          if(extesnionType == "ios"){
             CloneAndAddToXcode(path,gitUrl);
          }else{
            CloneAndAddToAndroid(path,gitUrl);
          }
        }
    }
  }
}
});


});

}());
//# sourceMappingURL=main.js.map