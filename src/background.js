// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from 'path';
import url from 'url';
import { app, Menu, ipcMain, dialog } from 'electron';
import { devMenuTemplate } from './menu/dev_menu_template';
import { editMenuTemplate } from './menu/edit_menu_template';
import createWindow from './helpers/window';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

var mainWindow;
var jrClientWindow = null;

var setApplicationMenu = function () {
    var menus = [editMenuTemplate];
    if (env.name !== 'production') {
        menus.push(devMenuTemplate);
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== 'production') {
    var userDataPath = app.getPath('userData');
    app.setPath('userData', userDataPath + ' (' + env.name + ')');
}

app.on('ready', function () {
    setApplicationMenu();

     mainWindow = createWindow('main', {
        width: 800,
        height: 800,
        resizable: true
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

  //  if (env.name === 'development') {
        mainWindow.openDevTools();
  //  }
});



ipcMain.on('open-Jr-Client', function(event) {

  mainWindow.hide();

  if(jrClientWindow){
     return;
   }

   var jrClientWindow = createWindow('jrClientWindow', {
       width: 800,
       height: 800,
       resizable: true
   });

   jrClientWindow.loadURL(url.format({
       pathname: path.join(__dirname, 'jrClient/docs/index.html'),
       protocol: 'file:',
       slashes: true
   }));

   jrClientWindow.openDevTools();

   jrClientWindow.on('closed', function() {
     jrClientWindow = null;
   });
});

app.on('window-all-closed', function () {
    app.quit();
});

ipcMain.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory']
  }, function (files) {
    if (files) event.sender.send('selected-directory', files)
  })
})
