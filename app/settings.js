(function () {'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var os = require('os');
var electron = require('electron');
var jetpack = _interopDefault(require('fs-jetpack'));

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

document.addEventListener('DOMContentLoaded', function () {
  electron.ipcRenderer.on('selected-directory', function (event, path) {
    console.log("PATH = ", path);
    saveSettings('project-path', path);
    console.log(readSettings('project-path'));
    electron.ipcRenderer.send('open-Jr-Client');
  });
});

}());
//# sourceMappingURL=settings.js.map