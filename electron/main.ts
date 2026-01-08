import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import axios from 'axios'

const isDev = process.env.NODE_ENV === 'development'

let apiBaseURL = 'http://127.0.0.1:8888'

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        titleBarStyle: 'hiddenInset',
        backgroundColor: '#0f172a',
        show: false,
    })

    // Show window when ready to avoid visual flash
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173')
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
    }
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
// Handle API proxy requests from renderer
ipcMain.handle('api-request', async (event, { method, url, data, params }) => {
  try {
    const response = await axios({
      method,
      url: `${apiBaseURL}${url}`,
      data,
      params,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })
    return { success: true, data: response.data }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
    }
  }
})

// Handle API base URL updates
ipcMain.handle('set-api-url', async (event, url: string) => {
  apiBaseURL = url
  return { success: true }
})

ipcMain.handle('get-api-url', async () => {
  return apiBaseURL
})