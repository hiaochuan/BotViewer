import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    Plus,
    Play,
    Square,
    Trash2,
    Edit,
    RefreshCw,
    Activity,
    Upload,
    X,
} from 'lucide-react'
import api from '../services/api'
import type { User, UserFormData } from '../types'

function UserManagement() {
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const queryClient = useQueryClient()

    const { data: users = [], isLoading, refetch } = useQuery({
        queryKey: ['users'],
        queryFn: () => api.getUsers(),
        refetchInterval: 5000,
    })

    const addUserMutation = useMutation({
        mutationFn: (data: UserFormData) => api.addUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            setShowAddModal(false)
        },
    })

    const removeUserMutation = useMutation({
        mutationFn: (username: string) => api.removeUser(username),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    const runUserMutation = useMutation({
        mutationFn: (username: string) => api.runUser(username),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    const stopUserMutation = useMutation({
        mutationFn: (username: string) => api.stopUser(username),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    const runMonitorMutation = useMutation({
        mutationFn: (username: string) => api.runMonitor(username),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    const stopMonitorMutation = useMutation({
        mutationFn: (username: string) => api.stopMonitor(username),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    const closeAllMutation = useMutation({
        mutationFn: (username: string) => api.closeAllPositions(username),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    const handleDeleteUser = (username: string) => {
        if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
            removeUserMutation.mutate(username)
        }
    }

    const handleCloseAll = (username: string) => {
        if (window.confirm(`Are you sure you want to close all positions for "${username}"?`)) {
            closeAllMutation.mutate(username)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-100">User Management</h1>
                    <p className="text-gray-400 mt-2">Manage trading bot users</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => refetch()} className="btn-secondary">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                    <button onClick={() => setShowAddModal(true)} className="btn-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="card p-8 text-center text-gray-400">Loading users...</div>
            ) : users.length === 0 ? (
                <div className="card p-8 text-center text-gray-400">
                    No users found. Add your first user to get started.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {users.map((user) => (
                        <div key={user.username} className="card p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-xl font-semibold text-gray-100">
                                            {user.username}
                                        </h3>
                                        <span
                                            className={
                                                user.status === 'running'
                                                    ? 'badge-success'
                                                    : 'badge-danger'
                                            }
                                        >
                                            {user.status || 'stopped'}
                                        </span>
                                        <span
                                            className={
                                                user.trade_mode === 'REAL'
                                                    ? 'badge-warning'
                                                    : 'badge-info'
                                            }
                                        >
                                            {user.trade_mode}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400">API Key:</span>
                                            <span className="text-gray-200 ml-2">
                                                {user.gate_api_key.substring(0, 10)}...
                                            </span>
                                        </div>
                                        {user.init_balance && (
                                            <div>
                                                <span className="text-gray-400">Init Balance:</span>
                                                <span className="text-gray-200 ml-2">
                                                    ${user.init_balance}
                                                </span>
                                            </div>
                                        )}
                                        {user.balance_rate && (
                                            <div>
                                                <span className="text-gray-400">Balance Rate:</span>
                                                <span className="text-gray-200 ml-2">
                                                    {user.balance_rate}%
                                                </span>
                                            </div>
                                        )}
                                        {user.min_balance && (
                                            <div>
                                                <span className="text-gray-400">Min Balance:</span>
                                                <span className="text-gray-200 ml-2">
                                                    ${user.min_balance}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 ml-4">
                                    {user.status === 'running' ? (
                                        <button
                                            onClick={() => stopUserMutation.mutate(user.username)}
                                            className="btn-danger flex items-center text-sm"
                                            disabled={stopUserMutation.isPending}
                                        >
                                            <Square className="w-3 h-3 mr-1" />
                                            Stop
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => runUserMutation.mutate(user.username)}
                                            className="btn-success flex items-center text-sm"
                                            disabled={runUserMutation.isPending}
                                        >
                                            <Play className="w-3 h-3 mr-1" />
                                            Run
                                        </button>
                                    )}

                                    {user.enable_balance_monitor && (
                                        <>
                                            {user.monitor_status === 'running' ? (
                                                <button
                                                    onClick={() => stopMonitorMutation.mutate(user.username)}
                                                    className="btn-secondary flex items-center text-sm"
                                                    disabled={stopMonitorMutation.isPending}
                                                >
                                                    <Activity className="w-3 h-3 mr-1" />
                                                    Stop Monitor
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => runMonitorMutation.mutate(user.username)}
                                                    className="btn-secondary flex items-center text-sm"
                                                    disabled={runMonitorMutation.isPending}
                                                >
                                                    <Activity className="w-3 h-3 mr-1" />
                                                    Run Monitor
                                                </button>
                                            )}
                                        </>
                                    )}

                                    <button
                                        onClick={() => handleCloseAll(user.username)}
                                        className="btn-secondary flex items-center text-sm"
                                        disabled={closeAllMutation.isPending}
                                    >
                                        <X className="w-3 h-3 mr-1" />
                                        Close All
                                    </button>

                                    <button
                                        onClick={() => handleDeleteUser(user.username)}
                                        className="btn-danger flex items-center text-sm"
                                        disabled={removeUserMutation.isPending}
                                    >
                                        <Trash2 className="w-3 h-3 mr-1" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && (
                <AddUserModal
                    onClose={() => setShowAddModal(false)}
                    onSubmit={(data) => addUserMutation.mutate(data)}
                    isLoading={addUserMutation.isPending}
                />
            )}
        </div>
    )
}

interface AddUserModalProps {
    onClose: () => void
    onSubmit: (data: UserFormData) => void
    isLoading: boolean
}

function AddUserModal({ onClose, onSubmit, isLoading }: AddUserModalProps) {
    const [formData, setFormData] = useState<UserFormData>({
        username: '',
        gate_api_key: '',
        gate_secret_key: '',
        trade_mode: 'REAL',
        enable_balance_monitor: true,
        init_balance: undefined,
        balance_rate: 50,
        min_balance: undefined,
        exporter_name: '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-100">Add New User</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Username *
                        </label>
                        <input
                            type="text"
                            className="input"
                            value={formData.username}
                            onChange={(e) =>
                                setFormData({ ...formData, username: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Gate API Key *
                        </label>
                        <input
                            type="text"
                            className="input"
                            value={formData.gate_api_key}
                            onChange={(e) =>
                                setFormData({ ...formData, gate_api_key: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Gate Secret Key *
                        </label>
                        <input
                            type="password"
                            className="input"
                            value={formData.gate_secret_key}
                            onChange={(e) =>
                                setFormData({ ...formData, gate_secret_key: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Trade Mode
                        </label>
                        <select
                            className="input"
                            value={formData.trade_mode}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    trade_mode: e.target.value as 'REAL' | 'SIMULATED',
                                })
                            }
                        >
                            <option value="REAL">REAL</option>
                            <option value="SIMULATED">SIMULATED</option>
                        </select>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enable_monitor"
                            checked={formData.enable_balance_monitor}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    enable_balance_monitor: e.target.checked,
                                })
                            }
                            className="mr-2"
                        />
                        <label htmlFor="enable_monitor" className="text-sm text-gray-300">
                            Enable Balance Monitor
                        </label>
                    </div>

                    {formData.enable_balance_monitor && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Initial Balance
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="input"
                                    value={formData.init_balance || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            init_balance: e.target.value
                                                ? parseFloat(e.target.value)
                                                : undefined,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Balance Rate (%)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="input"
                                    value={formData.balance_rate || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            balance_rate: e.target.value
                                                ? parseFloat(e.target.value)
                                                : undefined,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Min Balance
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="input"
                                    value={formData.min_balance || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            min_balance: e.target.value
                                                ? parseFloat(e.target.value)
                                                : undefined,
                                        })
                                    }
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Exporter Name
                        </label>
                        <input
                            type="text"
                            className="input"
                            value={formData.exporter_name}
                            onChange={(e) =>
                                setFormData({ ...formData, exporter_name: e.target.value })
                            }
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary flex-1"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary flex-1"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Adding...' : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserManagement
