import { useState } from 'react'
import { LayoutDashboard, Users, UserCircle, Settings } from 'lucide-react'
import Dashboard from './components/Dashboard'
import UserManagement from './components/UserManagement'
import KOLManagement from './components/KOLManagement'
import SettingsPanel from './components/SettingsPanel'

type TabType = 'dashboard' | 'users' | 'kols' | 'settings'

function App() {
    const [activeTab, setActiveTab] = useState<TabType>('dashboard')

    const tabs = [
        { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users' as TabType, label: 'Users', icon: Users },
        { id: 'kols' as TabType, label: 'KOLs', icon: UserCircle },
        { id: 'settings' as TabType, label: 'Settings', icon: Settings },
    ]

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />
            case 'users':
                return <UserManagement />
            case 'kols':
                return <KOLManagement />
            case 'settings':
                return <SettingsPanel />
            default:
                return <Dashboard />
        }
    }

    return (
        <div className="flex h-screen bg-dark-950 text-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-dark-900 border-r border-dark-800 flex flex-col">
                <div className="p-6 border-b border-dark-800">
                    <h1 className="text-2xl font-bold text-primary-400">Fusion Alpha</h1>
                    <p className="text-sm text-gray-500 mt-1">Trading Bot Manager</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'text-gray-400 hover:bg-dark-800 hover:text-gray-200'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-dark-800">
                    <div className="text-xs text-gray-500">
                        <div className="mb-1">Version 1.0.0</div>
                        <div className="text-gray-600">© 2026 Fusion Alpha</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}

export default App
