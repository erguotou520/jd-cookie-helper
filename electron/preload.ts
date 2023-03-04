import { ipcRenderer, shell } from 'electron'

(window as any).__ipc__ = ipcRenderer;
(window as any).openGithubPage = () => shell.openExternal('https://github.com/erguotou520/jd-cookie-helper')