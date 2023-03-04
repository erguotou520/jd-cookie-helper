import type { ipcRenderer } from 'electron'

declare global {
  interface Window {
    __ipc__: ipcRenderer
    openGithubPage: () => void
  }
}