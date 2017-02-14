// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.

// Use new ES6 modules syntax for everything.
import os from 'os'; // native node.js module
import { remote, ipcRenderer } from 'electron'; // native electron module
import jetpack from 'fs-jetpack'; // module loaded from npm
import { ShowErrorDialog, IsValidProjectDirectory } from './utils/utils';
import env from './env';

import { saveSettings, readSettings }  from './userData/userData';

var gitUrl = "";
var extesnionType = "";

document.addEventListener('DOMContentLoaded', function () {

  const selectDirBtn = document.getElementById('btnOpen')
  selectDirBtn.addEventListener('click', function (event) {

    const txtGitUrl = document.getElementById('repo').value;
    ipcRenderer.send('open-file-dialog');

  })

ipcRenderer.on('selected-directory', function (event, path) {

  document.getElementById('repo').value = path;
  var projectType = document.querySelector('input[name="projectType-radio"]:checked').id;
  if(!IsValidProjectDirectory(path, projectType)){
     ShowErrorDialog("Information", "You need to select app folder");
  }
  else {
    saveSettings('project-path', path);
    saveSettings('project-type', projectType);

    console.log(readSettings('project-path'));
    console.log(readSettings('project-type'));
    ipcRenderer.send('open-Jr-Client');
  }

})

});
