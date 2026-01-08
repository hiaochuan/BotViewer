/// <reference types="vite/client" />

interface Window {
    electronAPI: {
        platform: string
        version: string
        apiRequest: (options: {
            method: string
            url: string
            data?: any
            params?: any
        }) => Promise<{ success: boolean; data?: any; error?: string }>
        setApiUrl: (url: string) => Promise<{ success: boolean }>
        getApiUrl: () => Promise<string>
    }
}
