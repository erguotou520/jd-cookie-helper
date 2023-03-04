// The built directory structure
//
// ├─┬ dist
// │ ├─┬ electron
// │ │ ├── main.js
// │ │ └── preload.js
// │ ├── index.html
// │ ├── ...other-static-files-from-public
// │
process.env.DIST = join(__dirname, '..')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST, '../public')

import { join } from 'path'
import { app, BrowserWindow, BrowserWindowConstructorOptions, screen, clipboard, session, ipcMain } from 'electron'
import { readAccounts, saveAccounts } from './storage'
import { Account } from './types'

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const url = process.env['VITE_DEV_SERVER_URL']

const jsScriptTpl = `var evt1 = new Event('input', {
  bubbles: true,
  cancelable: true
})
var ie=document.querySelector('.acc-input.mobile')
ie.value = '$$1'
ie.dispatchEvent(evt1)

var evt2 = new Event('change', {
  bubbles: false,
  cancelable: true
})
var ce = document.querySelector('.policy_tip-checkbox')
ce.checked = true
ce.dispatchEvent(evt2)

setTimeout(function() {{
  document.querySelector('.getMsg-btn').click()
}}, 1000)`

const resultScriptTpl = `window.confirm('点击确定复制cookie并关闭窗口，取消仅复制')`

function createWindow(key?: string, position?: [number, number]): BrowserWindow {
  const winOpt: BrowserWindowConstructorOptions = {
    icon: join(process.env.PUBLIC, 'logo.svg'),
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: false,
      preload: join(__dirname, 'preload.js')
    },
    title: 'jd-cookie-helper',
    width: 375,
    height: 667
  }
  if (key) {
    winOpt.webPreferences.session = session.fromPartition(`persist:${key}`)
  }
  if (position) {
    winOpt.x = Math.round(position[0])
    winOpt.y = Math.round(position[1])
  }
  win = new BrowserWindow(winOpt)
  win.webContents.setUserAgent('Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko; googleweblight) Chrome/38.0.1025.166 Mobile Safari/535.19')

  win.webContents.on('did-finish-load', () => {
    win.webContents.enableDeviceEmulation({
      screenPosition: 'mobile',
      scale: 1,
      deviceScaleFactor: 0,
      screenSize: { width: 375, height: 667 },
      viewPosition: { x: 0, y: 0 },
      viewSize: { width: 375, height: 667 }
    })
  })
  return win
}

function openJDWindow(account: Account, x: number, y: number) {
  const win = createWindow(account.phone, [x, y])
  win.loadURL('https://plogin.m.jd.com/login/login')
  win.setTitle(account.remark || account.phone)
  const cts = win.webContents
  cts.on('did-finish-load', () => {
    setTimeout(() => {
      cts.executeJavaScript(jsScriptTpl.replace('$$1', account.phone))
      cts.on('will-navigate', (e, url) => {
        if (!url.startsWith('https://plogin.m.jd.com')) {
          e.preventDefault()
          const result = []
          cts.session.cookies.get({}).then(cookies => {
            for (const cookie of cookies) {
              if (cookie.name == 'pt_key') {
                result.push(`pt_key=${cookie.value}`)
              } else if (cookie.name == 'pt_pin') {
                result.push(`pt_pin=${cookie.value}`)
              }
              if (result.length === 2) {
                break
              }
            }
            if (result.length === 2) {
              const resultText = result.join(';') + ';'
              console.log(result, resultText)
              cts.executeJavaScript(resultScriptTpl).then(ret => {
                clipboard.writeText(resultText)
                if (ret) {
                  win.close()
                }
              })
            } else {
              win.reload()
            }
          })
        }
      })
    }, 1500)
  })
}

async function setupApp() {
  ipcMain.handle('getAccounts', () => readAccounts())
  ipcMain.handle('saveAccounts', (e, { accounts }: { accounts: Account[] }) => saveAccounts(accounts))
  ipcMain.handle('openJD', (e, { accounts }: { accounts: Account[] }) => {
    if (accounts.length) {
      const { width, height } = screen.getPrimaryDisplay().workAreaSize
      for (const [index, account] of accounts.entries()) {
        openJDWindow(account, (index + 1) * width / (1 + accounts.length) - 375 / 2, (height - 375) / 2)
      }
    }
  })
  // main window
  const win = createWindow()
  if (app.isPackaged) {
    win.loadFile(join(process.env.DIST, 'index.html'))
  } else {
    win.loadURL(url)
    win.webContents.openDevTools({ mode: 'detach' })
  }
}

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(setupApp)
