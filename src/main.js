// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.

// Use new ES6 modules syntax for everything.
import os from 'os'; // native node.js module
import { remote, ipcRenderer } from 'electron'; // native electron module
import jetpack from 'fs-jetpack'; // module loaded from npm
import { CloneAndAddToXcode }  from './ios_process/ios_process';
import { CloneAndAddToAndroid } from './android_process/android_process';
import { ShowErrorDialog, IsValidProjectDirectory, IsExtesnionAlreadyExists,
         ShowLoading, IsValidGithubUrl, GetCompleteGitUrl } from './utils/utils';
import env from './env';

import { readSettings }  from './userData/userData';

var gitUrl = "";
var extesnionType = "";

document.addEventListener('DOMContentLoaded', function () {

document.querySelector('body').addEventListener('click', function (event) {

  if(event.target.id == 'btnInstall'){
     gitUrl = event.target.getAttribute('url');
     extesnionType = event.target.getAttribute('platform');
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
})


});
