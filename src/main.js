import os from 'os' // native node.js module
import { remote, ipcRenderer } from 'electron' // native electron module
import jetpack from 'fs-jetpack' // module loaded from npm
import { CloneAndAddToXcode }  from './ios_process/ios_process'
import { CloneAndAddToAndroid } from './android_process/android_process'
import { ShowErrorDialog, IsValidProjectDirectory, IsExtesnionAlreadyExists,
         ShowLoading, IsValidGithubUrl, GetCompleteGitUrl } from './utils/utils'
import env from './env'

import { saveSettings, readSettings }  from './userData/userData'

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('body').addEventListener('click', function (event) {
    if(event.target.id == 'btnInstall'){
      ipcRenderer.send('open-file-dialog')
    }
  })
  ipcRenderer.on('selected-directory', function (event, path) {
    saveSettings('project-path', path)
    const btnInstall = document.getElementById('btnInstall')
    var gitUrl = btnInstall.getAttribute('url')
    const platform = btnInstall.getAttribute('platform')

    if(!IsValidGithubUrl(gitUrl)){
      ShowErrorDialog("Information", "Incorrect extension url.")
    } else {
      gitUrl = GetCompleteGitUrl(gitUrl)
      var path =  readSettings('project-path')
      if(IsExtesnionAlreadyExists(gitUrl, path)) {
        ShowErrorDialog("Information", "You have already installed this extension.")
      } else {
        ShowLoading("Downloading Extension...")
        if(platform == "ios"){
          CloneAndAddToXcode(path,gitUrl)
        } else {
          CloneAndAddToAndroid(path,gitUrl)
        }
      }
    }
  })
})
