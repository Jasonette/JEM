import { ShowLoading, ShowErrorDialog, GetActionName, GetSpecificFilesFromPath } from '../utils/utils';
import { GetDependencies, InjectCocoapodsDependencies } from '../ios_dependencies/ios_dependencies'

export var CloneAndAddToXcode = function (path, gitUrl){
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
            AddFilesInXcode(AllFiles,path,extName);
            var dep = GetDependencies(AllFiles);
            if(dep != null && dep.length > 0){
              InjectCocoapodsDependencies(path, dep);
          }else {
            ShowLoading('Completed...', true);
          }
    });
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
