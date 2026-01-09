import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    Plus,
    Play,
    Square,
    Trash2,
    RefreshCw,
    Activity,
    X,
    ChevronDown,
    ChevronUp,
    TrendingUp,
    RotateCcw,
} from 'lucide-react'
import api from '../services/api'
import type { UserFormData, TrackConfigFormData, KOL } from '../types'

function UserManagement() {
    const [showAddModal, setShowAddModal] = useState(false)
    const [showAddTrackModal, setShowAddTrackModal] = useState(false)
    const [selectedUsername, setSelectedUsername] = useState<string | null>(null)
    const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set())
    const queryClient = useQueryClient()

    const { data: users = [], isLoading, refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            try {
                const result = await api.getUsers()
                return result?.users || []
            } catch (error) {
                console.error('Failed to fetch users:', error)
                return []
            }
        },
        refetchInterval: 5000,
    })

    const { data: kols = [] } = useQuery({
        queryKey: ['kols'],
        queryFn: async () => {
            const result = await api.getKOLs()
            return result?.kols || []
        },
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

    const addTrackMutation = useMutation({
        mutationFn: (data: TrackConfigFormData) => api.addTrackConfig(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            setShowAddTrackModal(false)
            setSelectedUsername(null)
        },
    })

    const removeTrackMutation = useMutation({
        mutationFn: ({ username, kolName }: { username: string; kolName: string }) =>
            api.removeTrackConfig(username, kolName),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    const startTrackMutation = useMutation({
        mutationFn: ({ username, kolName }: { username: string; kolName: string }) =>
            api.startTrack(username, kolName),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    const stopTrackMutation = useMutation({
        mutationFn: ({ username, kolName }: { username: string; kolName: string }) =>
            api.stopTrack(username, kolName),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    const restartTrackMutation = useMutation({
        mutationFn: ({ username, kolName }: { username: string; kolName: string }) =>
            api.restartTrack(username, kolName),
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

    const toggleUserExpanded = (username: string) => {
        const newExpanded = new Set(expandedUsers)
        if (newExpanded.has(username)) {
            newExpanded.delete(username)
        } else {
            newExpanded.add(username)
        }
        setExpandedUsers(newExpanded)
    }

    const handleAddTrack = (username: string) => {
        setSelectedUsername(username)
        setShowAddTrackModal(true)
    }

    const handleDeleteTrack = (username: string, kolName: string) => {
        if (
            window.confirm(
                `Are you sure you want to delete track config for "${kolName}"?`
            )
        ) {
            removeTrackMutation.mutate({ username, kolName })
        }
    }

    const handleRestartTrack = (username: string, kolName: string) => {
        if (
            window.confirm(
                `Are you sure you want to restart track (this will clear positions) for "${kolName}"?`
            )
        ) {
            restartTrackMutation.mutate({ username, kolName })
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
                    {users.map((user) => {
                        const isExpanded = expandedUsers.has(user.username)
                        return (
                            <div key={user.username} className="card p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <button
                                                onClick={() => toggleUserExpanded(user.username)}
                                                className="p-1 hover:bg-dark-600 rounded transition-colors"
                                            >
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                )}
                                            </button>
                                            <h3 className="text-xl font-semibold text-gray-100">
                                                {user.username}
                                            </h3>
                                            <span
                                                className={
                                                    user.is_running
                                                        ? 'badge-success'
                                                        : 'badge-danger'
                                                }
                                            >
                                                {user.is_running ? 'running' : 'stopped'}
                                            </span>
                                            {user.is_monitoring && (
                                                <span className="badge-info">monitoring</span>
                                            )}
                                            {user.followed_kols.length > 0 && (
                                                <span className="badge-warning">
                                                    {user.followed_kols.length} Tracks
                                                </span>
                                            )}
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

                                    <div className="flex flex-wrap gap-2 ml-4">
                                        {user.is_running ? (
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

                                        {user.is_running && (
                                            <>
                                                {user.is_monitoring ? (
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
                                                        Start Monitor
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

                                {/* Expanded Track Configs Section */}
                                {isExpanded && (
                                    <div className="mt-6 pt-6 border-t border-dark-600">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                                                <TrendingUp className="w-5 h-5 text-purple-400" />
                                                KOL Track Configurations
                                            </h4>
                                            <button
                                                onClick={() => handleAddTrack(user.username)}
                                                className="btn-primary text-sm"
                                            >
                                                <Plus className="w-3 h-3 mr-1" />
                                                Add Track
                                            </button>
                                        </div>

                                        {user.followed_kols.length === 0 ? (
                                            <div className="text-center py-8 text-gray-400">
                                                No track configurations yet. Click "Add Track" to start.
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {user.followed_kols.map((track) => (
                                                    <div
                                                        key={track.name}
                                                        className="bg-dark-700 rounded-lg p-4"
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <h5 className="font-semibold text-gray-100">
                                                                        {track.name}
                                                                    </h5>
                                                                    <span
                                                                        className={
                                                                            track.is_active
                                                                                ? 'badge-success text-xs'
                                                                                : 'badge-danger text-xs'
                                                                        }
                                                                    >
                                                                        {track.is_active ? 'active' : 'stopped'}
                                                                    </span>
                                                                    {track.is_reverse && (
                                                                        <span className="badge-warning text-xs">
                                                                            REVERSE
                                                                        </span>
                                                                    )}
                                                                    <span className="badge-info text-xs">
                                                                        {track.amount_mode}
                                                                    </span>
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                                    {track.futures && track.futures.length > 0 && (
                                                                        <div className="col-span-2">
                                                                            <span className="text-gray-400">
                                                                                Futures:
                                                                            </span>
                                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                                {track.futures.map((future) => (
                                                                                    <span
                                                                                        key={future}
                                                                                        className="badge-info text-xs"
                                                                                    >
                                                                                        {future}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {track.amount_mode === 'FIXED' &&
                                                                        track.fixed_amounts &&
                                                                        Object.keys(track.fixed_amounts).length >
                                                                        0 && (
                                                                            <div className="col-span-2">
                                                                                <span className="text-gray-400">
                                                                                    Fixed Amounts:
                                                                                </span>
                                                                                <div className="mt-1 space-y-1">
                                                                                    {Object.entries(
                                                                                        track.fixed_amounts
                                                                                    ).map(([symbol, amount]) => (
                                                                                        <div
                                                                                            key={symbol}
                                                                                            className="text-gray-200"
                                                                                        >
                                                                                            {symbol}: ${amount}
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                    {track.amount_mode === 'PERCENTAGE' &&
                                                                        track.percentages &&
                                                                        Object.keys(track.percentages).length >
                                                                        0 && (
                                                                            <div className="col-span-2">
                                                                                <span className="text-gray-400">
                                                                                    Percentages:
                                                                                </span>
                                                                                <div className="mt-1 space-y-1">
                                                                                    {Object.entries(
                                                                                        track.percentages
                                                                                    ).map(([symbol, percent]) => (
                                                                                        <div
                                                                                            key={symbol}
                                                                                            className="text-gray-200"
                                                                                        >
                                                                                            {symbol}: {percent}%
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                    {track.amount_mode === 'LOSS_FIXED' &&
                                                                        track.max_loss && (
                                                                            <div>
                                                                                <span className="text-gray-400">
                                                                                    Max Loss:
                                                                                </span>
                                                                                <span className="text-gray-200 ml-2">
                                                                                    ${track.max_loss}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col gap-1 ml-4">
                                                                {track.is_active ? (
                                                                    <button
                                                                        onClick={() =>
                                                                            stopTrackMutation.mutate({
                                                                                username: user.username,
                                                                                kolName: track.name,
                                                                            })
                                                                        }
                                                                        className="btn-danger flex items-center text-xs px-2 py-1"
                                                                        disabled={stopTrackMutation.isPending}
                                                                    >
                                                                        <Square className="w-3 h-3 mr-1" />
                                                                        Stop
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() =>
                                                                            startTrackMutation.mutate({
                                                                                username: user.username,
                                                                                kolName: track.name,
                                                                            })
                                                                        }
                                                                        className="btn-success flex items-center text-xs px-2 py-1"
                                                                        disabled={startTrackMutation.isPending}
                                                                    >
                                                                        <Play className="w-3 h-3 mr-1" />
                                                                        Start
                                                                    </button>
                                                                )}

                                                                <button
                                                                    onClick={() =>
                                                                        handleRestartTrack(
                                                                            user.username,
                                                                            track.name
                                                                        )
                                                                    }
                                                                    className="btn-secondary flex items-center text-xs px-2 py-1"
                                                                    disabled={restartTrackMutation.isPending}
                                                                >
                                                                    <RotateCcw className="w-3 h-3 mr-1" />
                                                                    Restart
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        handleDeleteTrack(
                                                                            user.username,
                                                                            track.name
                                                                        )
                                                                    }
                                                                    className="btn-danger flex items-center text-xs px-2 py-1"
                                                                    disabled={removeTrackMutation.isPending}
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
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            {showAddModal && (
                <AddUserModal
                    onClose={() => setShowAddModal(false)}
                    onSubmit={(data) => addUserMutation.mutate(data)}
                    isLoading={addUserMutation.isPending}
                />
            )}

            {showAddTrackModal && selectedUsername && (
                <AddTrackModal
                    onClose={() => {
                        setShowAddTrackModal(false)
                        setSelectedUsername(null)
                    }}
                    onSubmit={(data) => addTrackMutation.mutate(data)}
                    isLoading={addTrackMutation.isPending}
                    username={selectedUsername}
                    kols={kols}
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

interface AddTrackModalProps {
    onClose: () => void
    onSubmit: (data: TrackConfigFormData) => void
    isLoading: boolean
    username: string
    kols: KOL[]
}

function AddTrackModal({
    onClose,
    onSubmit,
    isLoading,
    username,
    kols,
}: AddTrackModalProps) {
    const [formData, setFormData] = useState<TrackConfigFormData>({
        username: username,
        kol_name: '',
        is_reverse: false,
        futures: [],
        amount_mode: 'LOSS_FIXED',
        max_loss: 10,
    })
    const [futureInput, setFutureInput] = useState('')
    const [fixedAmountSymbol, setFixedAmountSymbol] = useState('')
    const [fixedAmountValue, setFixedAmountValue] = useState('')
    const [percentageSymbol, setPercentageSymbol] = useState('')
    const [percentageValue, setPercentageValue] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const handleAddFuture = () => {
        const future = futureInput.trim().toUpperCase()
        if (future && !formData.futures.includes(future)) {
            setFormData({ ...formData, futures: [...formData.futures, future] })
            setFutureInput('')
        }
    }

    const handleRemoveFuture = (future: string) => {
        setFormData({
            ...formData,
            futures: formData.futures.filter((f) => f !== future),
        })
    }

    const handleAddFixedAmount = () => {
        const symbol = fixedAmountSymbol.trim().toUpperCase()
        const amount = parseFloat(fixedAmountValue)
        if (symbol && !isNaN(amount) && fixedAmountValue.trim() !== '') {
            setFormData({
                ...formData,
                fixed_amounts: {
                    ...formData.fixed_amounts,
                    [symbol]: amount,
                },
            })
            setFixedAmountSymbol('')
            setFixedAmountValue('')
        }
    }

    const handleRemoveFixedAmount = (symbol: string) => {
        const { [symbol]: _, ...rest } = formData.fixed_amounts || {}
        setFormData({ ...formData, fixed_amounts: rest })
    }

    const handleAddPercentage = () => {
        const symbol = percentageSymbol.trim().toUpperCase()
        const percent = parseFloat(percentageValue)
        if (symbol && !isNaN(percent) && percentageValue.trim() !== '') {
            setFormData({
                ...formData,
                percentages: {
                    ...formData.percentages,
                    [symbol]: percent,
                },
            })
            setPercentageSymbol('')
            setPercentageValue('')
        }
    }

    const handleRemovePercentage = (symbol: string) => {
        const { [symbol]: _, ...rest } = formData.percentages || {}
        setFormData({ ...formData, percentages: rest })
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
            <div className="card p-6 w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-100">
                    Add Track Configuration for {username}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            KOL *
                        </label>
                        <select
                            className="input"
                            value={formData.kol_name}
                            onChange={(e) =>
                                setFormData({ ...formData, kol_name: e.target.value })
                            }
                            required
                        >
                            <option value="">Select a KOL</option>
                            {kols.map((kol) => (
                                <option key={kol.name} value={kol.name}>
                                    {kol.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_reverse"
                            checked={formData.is_reverse}
                            onChange={(e) =>
                                setFormData({ ...formData, is_reverse: e.target.checked })
                            }
                            className="mr-2"
                        />
                        <label htmlFor="is_reverse" className="text-sm text-gray-300">
                            Reverse Trading
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Futures (optional)
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                className="input flex-1"
                                value={futureInput}
                                onChange={(e) => setFutureInput(e.target.value)}
                                placeholder="e.g., BTC, ETH"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        handleAddFuture()
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleAddFuture}
                                className="btn-secondary"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        {formData.futures.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.futures.map((future) => (
                                    <span
                                        key={future}
                                        className="badge-info flex items-center gap-1 cursor-pointer"
                                        onClick={() => handleRemoveFuture(future)}
                                    >
                                        {future}
                                        <span className="text-xs">×</span>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Amount Mode *
                        </label>
                        <select
                            className="input"
                            value={formData.amount_mode}
                            onChange={(e) => {
                                const mode = e.target.value as TrackConfigFormData['amount_mode']
                                const updates: Partial<TrackConfigFormData> = {
                                    amount_mode: mode,
                                }
                                // Only initialize if switching to a new mode and field doesn't exist
                                if (mode === 'FIXED' && !formData.fixed_amounts) {
                                    updates.fixed_amounts = {}
                                }
                                if (mode === 'PERCENTAGE' && !formData.percentages) {
                                    updates.percentages = {}
                                }
                                if (mode === 'LOSS_FIXED' && formData.max_loss === undefined) {
                                    updates.max_loss = 10
                                }
                                setFormData({
                                    ...formData,
                                    ...updates,
                                })
                            }}
                        >
                            <option value="LOSS_FIXED">Loss Fixed</option>
                            <option value="FIXED">Fixed</option>
                            <option value="PERCENTAGE">Percentage</option>
                        </select>
                    </div>

                    {formData.amount_mode === 'FIXED' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Fixed Amounts
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    className="input flex-1"
                                    value={fixedAmountSymbol}
                                    onChange={(e) => setFixedAmountSymbol(e.target.value)}
                                    placeholder="Symbol (e.g., BTC or DEFAULT)"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleAddFixedAmount()
                                        }
                                    }}
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    className="input flex-1"
                                    value={fixedAmountValue}
                                    onChange={(e) => setFixedAmountValue(e.target.value)}
                                    placeholder="Amount"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleAddFixedAmount()
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddFixedAmount}
                                    className="btn-secondary"
                                    title="Add fixed amount"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">Press Enter or click + to add</p>
                            {formData.fixed_amounts &&
                                Object.keys(formData.fixed_amounts).length > 0 && (
                                    <div className="space-y-1">
                                        {Object.entries(formData.fixed_amounts).map(
                                            ([symbol, amount]) => (
                                                <div
                                                    key={symbol}
                                                    className="flex justify-between items-center bg-dark-700 p-2 rounded"
                                                >
                                                    <span className="text-gray-200">
                                                        {symbol}: ${amount}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFixedAmount(symbol)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                        </div>
                    )}

                    {formData.amount_mode === 'PERCENTAGE' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Percentages
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    className="input flex-1"
                                    value={percentageSymbol}
                                    onChange={(e) => setPercentageSymbol(e.target.value)}
                                    placeholder="Symbol (e.g., BTC or DEFAULT)"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleAddPercentage()
                                        }
                                    }}
                                />
                                <input
                                    type="number"
                                    step="0.1"
                                    className="input flex-1"
                                    value={percentageValue}
                                    onChange={(e) => setPercentageValue(e.target.value)}
                                    placeholder="Percentage"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleAddPercentage()
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddPercentage}
                                    title="Add percentage"
                                    className="btn-secondary"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">Press Enter or click + to add</p>
                            {formData.percentages &&
                                Object.keys(formData.percentages).length > 0 && (
                                    <div className="space-y-1">
                                        {Object.entries(formData.percentages).map(
                                            ([symbol, percent]) => (
                                                <div
                                                    key={symbol}
                                                    className="flex justify-between items-center bg-dark-700 p-2 rounded"
                                                >
                                                    <span className="text-gray-200">
                                                        {symbol}: {percent}%
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemovePercentage(symbol)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                        </div>
                    )}

                    {formData.amount_mode === 'LOSS_FIXED' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Max Loss (USD)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                className="input"
                                value={formData.max_loss || ''}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        max_loss: e.target.value
                                            ? parseFloat(e.target.value)
                                            : undefined,
                                    })
                                }
                            />
                        </div>
                    )}

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
                            {isLoading ? 'Adding...' : 'Add Track Config'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserManagement
