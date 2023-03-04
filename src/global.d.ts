import type { ipcRenderer } from 'electron'

interface Window {
  __ipc__: ipcRenderer
}