import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppSettings } from '../types'

interface SettingsState {
    settings: AppSettings
    updateSettings: (settings: Partial<AppSettings>) => void
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            settings: {
                apiBaseUrl: 'http://127.0.0.1:8888',
                refreshInterval: 5000,
                theme: 'dark',
            },
            updateSettings: (newSettings) =>
                set((state) => ({
                    settings: { ...state.settings, ...newSettings },
                })),
        }),
        {
            name: 'fusion-alpha-settings',
        }
    )
)
