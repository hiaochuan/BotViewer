import { useState } from 'react'
import { Save, Server } from 'lucide-react'
import { useSettingsStore } from '../store/settings'
import api from '../services/api'

function SettingsPanel() {
    const { settings, updateSettings } = useSettingsStore()
    const [apiBaseUrl, setApiBaseUrl] = useState(settings.apiBaseUrl)
    const [refreshInterval, setRefreshInterval] = useState(settings.refreshInterval)
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        updateSettings({
            apiBaseUrl,
            refreshInterval,
        })
        api.setBaseURL(apiBaseUrl)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-100">Settings</h1>
                <p className="text-gray-400 mt-2">Configure application settings</p>
            </div>

            <div className="card p-6 max-w-2xl">
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Server className="w-5 h-5 text-primary-400" />
                            <h2 className="text-xl font-semibold text-gray-100">
                                API Configuration
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    API Base URL
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    value={apiBaseUrl}
                                    onChange={(e) => setApiBaseUrl(e.target.value)}
                                    placeholder="http://127.0.0.1:8888"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Enter your Fusion Alpha API server address (e.g., http://your-server-ip:8888)
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Refresh Interval (ms)
                                </label>
                                <input
                                    type="number"
                                    className="input"
                                    value={refreshInterval}
                                    onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                                    min="1000"
                                    step="1000"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    How often to refresh data from the server (minimum 1000ms)
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-dark-700">
                        <button
                            onClick={handleSave}
                            className={`btn-primary flex items-center ${saved ? 'bg-green-600 hover:bg-green-700' : ''
                                }`}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {saved ? 'Saved!' : 'Save Settings'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="card p-6 max-w-2xl">
                <h2 className="text-xl font-semibold text-gray-100 mb-4">
                    Application Info
                </h2>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Version:</span>
                        <span className="text-gray-200">1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Build:</span>
                        <span className="text-gray-200">Electron + React</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Current API URL:</span>
                        <span className="text-gray-200">{settings.apiBaseUrl}</span>
                    </div>
                </div>
            </div>

            <div className="card p-6 max-w-2xl bg-blue-900/10 border-blue-800">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">
                    💡 Getting Started
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Make sure your Fusion Alpha API server is running</li>
                    <li>• Configure the API Base URL above to match your server</li>
                    <li>• Add users with their Gate.io API credentials</li>
                    <li>• Create KOLs to track from Discord channels</li>
                    <li>• Set up track configurations to link users with KOLs</li>
                    <li>• Monitor everything from the Dashboard</li>
                </ul>
            </div>
        </div>
    )
}

export default SettingsPanel
