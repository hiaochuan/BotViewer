import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    Plus,
    Play,
    Square,
    Trash2,
    RefreshCw,
    TrendingUp,
    RotateCcw,
} from 'lucide-react'
import api from '../services/api'
import type { TrackConfigFormData, User, KOL } from '../types'

function TrackManagement() {
    const [showAddModal, setShowAddModal] = useState(false)
    const queryClient = useQueryClient()

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const result = await api.getUsers()
            return result?.users || []
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

    // Extract all track configs from users
    const tracks = users.flatMap(user =>
        user.followed_kols.map(track => ({
            username: user.username,
            kol_name: track.name,
            is_reverse: track.is_reverse,
            is_active: track.is_active,
            futures: track.futures,
            amount_mode: track.amount_mode,
            fixed_amounts: track.fixed_amounts,
            percentages: track.percentages,
            max_loss: track.max_loss,
        }))
    )

    const refetch = () => {
        queryClient.invalidateQueries({ queryKey: ['users'] })
    }

    const addTrackMutation = useMutation({
        mutationFn: (data: TrackConfigFormData) => api.addTrackConfig(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            setShowAddModal(false)
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

    const handleDeleteTrack = (username: string, kolName: string) => {
        if (
            window.confirm(
                `Are you sure you want to delete track config for "${username}" - "${kolName}"?`
            )
        ) {
            removeTrackMutation.mutate({ username, kolName })
        }
    }

    const handleRestartTrack = (username: string, kolName: string) => {
        if (
            window.confirm(
                `Are you sure you want to restart track (this will clear positions) for "${username}" - "${kolName}"?`
            )
        ) {
            restartTrackMutation.mutate({ username, kolName })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-100">Track Management</h1>
                    <p className="text-gray-400 mt-2">Manage KOL tracking configurations</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => refetch()} className="btn-secondary">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                    <button onClick={() => setShowAddModal(true)} className="btn-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Track Config
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="card p-8 text-center text-gray-400">
                    Loading track configs...
                </div>
            ) : tracks.length === 0 ? (
                <div className="card p-8 text-center text-gray-400">
                    No track configs found. Add your first track configuration to get started.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {tracks.map((track) => (
                        <div
                            key={`${track.username}-${track.kol_name}`}
                            className="card p-6"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-purple-900/20 rounded-lg">
                                            <TrendingUp className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-100">
                                                {track.username} → {track.kol_name}
                                            </h3>
                                            <div className="flex gap-2 mt-1">
                                                <span
                                                    className={
                                                        track.is_active
                                                            ? 'badge-success'
                                                            : 'badge-danger'
                                                    }
                                                >
                                                    {track.is_active ? 'active' : 'stopped'}
                                                </span>
                                                {track.is_reverse && (
                                                    <span className="badge-warning">REVERSE</span>
                                                )}
                                                <span className="badge-info">{track.amount_mode}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        {track.futures && track.futures.length > 0 && (
                                            <div className="col-span-2">
                                                <span className="text-gray-400">Futures:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {track.futures.map((future) => (
                                                        <span key={future} className="badge-info text-xs">
                                                            {future}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {track.amount_mode === 'FIXED' &&
                                            track.fixed_amounts &&
                                            Object.keys(track.fixed_amounts).length > 0 && (
                                                <div className="col-span-2">
                                                    <span className="text-gray-400">Fixed Amounts:</span>
                                                    <div className="mt-1 space-y-1">
                                                        {Object.entries(track.fixed_amounts).map(
                                                            ([symbol, amount]) => (
                                                                <div key={symbol} className="text-gray-200">
                                                                    {symbol}: ${amount}
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        {track.amount_mode === 'PERCENTAGE' &&
                                            track.percentages &&
                                            Object.keys(track.percentages).length > 0 && (
                                                <div className="col-span-2">
                                                    <span className="text-gray-400">Percentages:</span>
                                                    <div className="mt-1 space-y-1">
                                                        {Object.entries(track.percentages).map(
                                                            ([symbol, percent]) => (
                                                                <div key={symbol} className="text-gray-200">
                                                                    {symbol}: {percent}%
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        {track.amount_mode === 'LOSS_FIXED' && track.max_loss && (
                                            <div>
                                                <span className="text-gray-400">Max Loss:</span>
                                                <span className="text-gray-200 ml-2">
                                                    ${track.max_loss}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 ml-4">
                                    {track.is_active ? (
                                        <button
                                            onClick={() =>
                                                stopTrackMutation.mutate({
                                                    username: track.username,
                                                    kolName: track.kol_name,
                                                })
                                            }
                                            className="btn-danger flex items-center text-sm"
                                            disabled={stopTrackMutation.isPending}
                                        >
                                            <Square className="w-3 h-3 mr-1" />
                                            Stop
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                startTrackMutation.mutate({
                                                    username: track.username,
                                                    kolName: track.kol_name,
                                                })
                                            }
                                            className="btn-success flex items-center text-sm"
                                            disabled={startTrackMutation.isPending}
                                        >
                                            <Play className="w-3 h-3 mr-1" />
                                            Start
                                        </button>
                                    )}

                                    <button
                                        onClick={() =>
                                            handleRestartTrack(track.username, track.kol_name)
                                        }
                                        className="btn-secondary flex items-center text-sm"
                                        disabled={restartTrackMutation.isPending}
                                    >
                                        <RotateCcw className="w-3 h-3 mr-1" />
                                        Restart
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDeleteTrack(track.username, track.kol_name)
                                        }
                                        className="btn-danger flex items-center text-sm"
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

            {showAddModal && (
                <AddTrackModal
                    onClose={() => setShowAddModal(false)}
                    onSubmit={(data) => addTrackMutation.mutate(data)}
                    isLoading={addTrackMutation.isPending}
                    users={users}
                    kols={kols}
                />
            )}
        </div>
    )
}

interface AddTrackModalProps {
    onClose: () => void
    onSubmit: (data: TrackConfigFormData) => void
    isLoading: boolean
    users: User[]
    kols: KOL[]
}

function AddTrackModal({
    onClose,
    onSubmit,
    isLoading,
    users,
    kols,
}: AddTrackModalProps) {
    const [formData, setFormData] = useState<TrackConfigFormData>({
        username: '',
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
        if (symbol && amount) {
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
        if (symbol && percent) {
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
                    Add Track Configuration
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            User *
                        </label>
                        <select
                            className="input"
                            value={formData.username}
                            onChange={(e) =>
                                setFormData({ ...formData, username: e.target.value })
                            }
                            required
                        >
                            <option value="">Select a user</option>
                            {users.map((user) => (
                                <option key={user.username} value={user.username}>
                                    {user.username}
                                </option>
                            ))}
                        </select>
                    </div>

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
                                onKeyPress={(e) => {
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
                                setFormData({
                                    ...formData,
                                    amount_mode: mode,
                                    fixed_amounts: mode === 'FIXED' ? {} : undefined,
                                    percentages: mode === 'PERCENTAGE' ? {} : undefined,
                                    max_loss: mode === 'LOSS_FIXED' ? 10 : undefined,
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
                                    placeholder="Symbol (e.g., BTC)"
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    className="input flex-1"
                                    value={fixedAmountValue}
                                    onChange={(e) => setFixedAmountValue(e.target.value)}
                                    placeholder="Amount"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddFixedAmount}
                                    className="btn-secondary"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
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
                                    placeholder="Symbol (e.g., BTC)"
                                />
                                <input
                                    type="number"
                                    step="0.1"
                                    className="input flex-1"
                                    value={percentageValue}
                                    onChange={(e) => setPercentageValue(e.target.value)}
                                    placeholder="Percentage"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddPercentage}
                                    className="btn-secondary"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
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

export default TrackManagement
