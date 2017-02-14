(function () {'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var os = require('os');
var electron = require('electron');
var jetpack = _interopDefault(require('fs-jetpack'));

var ShowErrorDialog = function(title, message){
  electron.remote.dialog.showErrorBox(title, message);
};

    var IsValidProjectDirectory = function(path, projectType){
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
};

// Simple wrapper exposing environment variables to rest of the code.

// The variables have been written to `env.json` by the build process.
var env = jetpack.cwd(__dirname).read('env.json', 'json');

var nconf = require('nconf').file({file: getUserHome() + '/sound-machine-config.json'});

var saveSettings = function(settingKey, settingValue) {
    nconf.set(settingKey, settingValue);
    nconf.save();
};

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
document.addEventListener('DOMContentLoaded', function () {

  const selectDirBtn = document.getElementById('btnOpen');
  selectDirBtn.addEventListener('click', function (event) {

    const txtGitUrl = document.getElementById('repo').value;
    electron.ipcRenderer.send('open-file-dialog');

  });

electron.ipcRenderer.on('selected-directory', function (event, path) {

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
    electron.ipcRenderer.send('open-Jr-Client');
  }

});

});

}());
//# sourceMappingURL=settings.js.map