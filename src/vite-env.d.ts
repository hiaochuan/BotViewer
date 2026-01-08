/// <reference types="vite/client" />

interface Window {
    electronAPI: {
        platform: string
        version: string
    }
}
