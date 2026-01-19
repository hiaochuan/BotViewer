import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import axios from 'axios'
import JSONbig from 'json-bigint'

// Configure json-bigint to convert big integers to strings
const JSONbigString = JSONbig({ storeAsString: true })

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

  // Helpful diagnostics in production
  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDesc, validatedURL) => {
    console.error('[did-fail-load]', { errorCode, errorDesc, validatedURL })
  })
  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    console.error('[render-process-gone]', details)
  })
  mainWindow.on('unresponsive', () => {
    console.error('[window] unresponsive')
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    // In production, main.js is in dist/, renderer is in dist/renderer/
    mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'))
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
      // Keep response as raw string to manually parse with json-bigint
      transformResponse: [(data) => data]
    })

    // Parse with json-bigint to preserve large integers as strings
    const parsed = JSONbigString.parse(response.data)
    return { success: true, data: parsed }
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