import { ShowLoading, ShowErrorDialog, GetSpecificFilesFromPath, GetActionName } from '../utils/utils';
import { InjectGradleDependencies, GetDependencies } from '../android_dependencies/android_dependencies'

export var CloneAndAddToAndroid = function (path, gitUrl){
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
          var dep = GetDependencies(allFiles);
          if(dep != null && dep.length > 0){
            InjectGradleDependencies(path, dep);
          }else {
            ShowLoading('Completed...', true);
          }
        });
}

function AddFilesInAndroidStudio(AllFiles,extesnionPath,extName,path)
{
    ShowLoading('Installing extesnion...');

    var actionPath = path + '/src/main/java/com/jasonette/seed/Action';
    var assetPath = path + '/src/main/assets/file'
    var gradle = path + '/build.gradle';

    var fs = require('fs');
    if (!fs.existsSync(assetPath)){
        fs.mkdirSync(assetPath);
    }

    for(var i = 0 ; i < AllFiles.length; i++){
      var pieces = AllFiles[i].split('/');
      var fileName = pieces[pieces.length-1];
      var filePieces = fileName.split('.');
      var fileExtension = filePieces[filePieces.length-1];
      if(fileExtension == 'java'){
         fs.createReadStream(AllFiles[i]).pipe(fs.createWriteStream(actionPath + '/' + fileName));
      }
      else if (fileExtension == 'json') {

        fs.createReadStream(AllFiles[i]).pipe(fs.createWriteStream(assetPath + '/' + extName + ".json"));
      }
    }
}
