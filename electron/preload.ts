import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  version: process.version,
  apiRequest: (options: any) => ipcRenderer.invoke('api-request', options),
  setApiUrl: (url: string) => ipcRenderer.invoke('set-api-url', url),
  getApiUrl: () => ipcRenderer.invoke('get-api-url'),
})
