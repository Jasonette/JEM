import os from 'os' // native node.js module
import { remote, ipcRenderer } from 'electron' // native electron module
import jetpack from 'fs-jetpack' // module loaded from npm
import { ShowErrorDialog, IsValidProjectDirectory } from './utils/utils'
import env from './env'

import { saveSettings, readSettings }  from './userData/userData'

document.addEventListener('DOMContentLoaded', function () {
  ipcRenderer.on('selected-directory', function (event, path) {
    console.log("PATH = ", path)
    saveSettings('project-path', path)
    console.log(readSettings('project-path'))
    ipcRenderer.send('open-Jr-Client')
  })
})
