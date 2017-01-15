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



document.addEventListener('DOMContentLoaded', function () {

const selectDirBtn = document.getElementById('btnInstall')
selectDirBtn.addEventListener('click', function (event) {

  const txtGitUrl = document.getElementById('repo').value;
  if(!IsValidGithubUrl(txtGitUrl)){
    ShowErrorDialog("Information", "Please enter valid github repositoru url.");
  }
  else{
    ipcRenderer.send('open-file-dialog');
  }
})
ipcRenderer.on('selected-directory', function (event, path) {
  var txtGitUrl = document.getElementById('repo').value;
  txtGitUrl = GetCompleteGitUrl(txtGitUrl);
  var projectType = document.querySelector('input[name="projectType-radio"]:checked').id;
  if(!IsValidProjectDirectory(path, projectType)){
     ShowErrorDialog("Information", "You need to select app folder");
  }
  else if(IsExtesnionAlreadyExists(txtGitUrl, path)) {
    ShowErrorDialog("Information", "You have already installed this extesnion.");
  }
  else{
    ShowLoading("Downloading Extension...");
    //CloneAndAddToXcode(path,txtGitUrl);
    CloneAndAddToAndroid(path,txtGitUrl);
  }
})

});
