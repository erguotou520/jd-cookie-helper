import { ipcRenderer, shell } from 'electron'

window.__ipc__ = ipcRenderer
window.openGithubPage = () => shell.openExternal('https://github.com/erguotou520/jd-cookie-helper')