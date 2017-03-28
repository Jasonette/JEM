'use strict';

var nconf = require('nconf').file({file: getUserHome() + '/sound-machine-config.json'});

export var saveSettings = function(settingKey, settingValue) {
    nconf.set(settingKey, settingValue);
    nconf.save();
}

export var readSettings = function(settingKey) {
    nconf.load();
    return nconf.get(settingKey);
}

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}
