import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, RefreshCw, UserCircle } from 'lucide-react'
import api from '../services/api'
import type { KOL, KOLFormData } from '../types'

function KOLManagement() {
    const [showAddModal, setShowAddModal] = useState(false)
    const queryClient = useQueryClient()

    const { data: kols = [], isLoading, refetch } = useQuery({
        queryKey: ['kols'],
        queryFn: () => api.getKOLs(),
        refetchInterval: 5000,
    })

    const addKOLMutation = useMutation({
        mutationFn: (data: KOLFormData) => api.addKOL(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kols'] })
            setShowAddModal(false)
        },
    })

    const removeKOLMutation = useMutation({
        mutationFn: (name: string) => api.removeKOL(name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kols'] })
        },
    })

    const handleDeleteKOL = (name: string) => {
        if (window.confirm(`Are you sure you want to delete KOL "${name}"?`)) {
            removeKOLMutation.mutate(name)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-100">KOL Management</h1>
                    <p className="text-gray-400 mt-2">Manage Key Opinion Leaders</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => refetch()} className="btn-secondary">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                    <button onClick={() => setShowAddModal(true)} className="btn-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Add KOL
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="card p-8 text-center text-gray-400">Loading KOLs...</div>
            ) : kols.length === 0 ? (
                <div className="card p-8 text-center text-gray-400">
                    No KOLs found. Add your first KOL to get started.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {kols.map((kol) => (
                        <div key={kol.name} className="card p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-primary-900/20 rounded-lg">
                                        <UserCircle className="w-6 h-6 text-primary-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-100">
                                            {kol.name}
                                        </h3>
                                        <span
                                            className={
                                                kol.kol_type === 'NORMAL' ? 'badge-info' : 'badge-warning'
                                            }
                                        >
                                            {kol.kol_type}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteKOL(kol.name)}
                                    className="text-red-400 hover:text-red-300 p-2"
                                    disabled={removeKOLMutation.isPending}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-gray-400">Channel ID:</span>
                                    <span className="text-gray-200 ml-2">{kol.dc_channel_id}</span>
                                </div>
                                {kol.dc_author_ids && kol.dc_author_ids.length > 0 && (
                                    <div>
                                        <span className="text-gray-400">Author IDs:</span>
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {kol.dc_author_ids.map((id) => (
                                                <span key={id} className="badge-info text-xs">
                                                    {id}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && (
                <AddKOLModal
                    onClose={() => setShowAddModal(false)}
                    onSubmit={(data) => addKOLMutation.mutate(data)}
                    isLoading={addKOLMutation.isPending}
                />
            )}
        </div>
    )
}

interface AddKOLModalProps {
    onClose: () => void
    onSubmit: (data: KOLFormData) => void
    isLoading: boolean
}

function AddKOLModal({ onClose, onSubmit, isLoading }: AddKOLModalProps) {
    const [formData, setFormData] = useState<KOLFormData>({
        name: '',
        kol_type: 'NORMAL',
        dc_channel_id: 0,
        dc_author_ids: [],
    })
    const [authorIdInput, setAuthorIdInput] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const handleAddAuthorId = () => {
        const id = parseInt(authorIdInput.trim())
        if (id && !formData.dc_author_ids.includes(id)) {
            setFormData({
                ...formData,
                dc_author_ids: [...formData.dc_author_ids, id],
            })
            setAuthorIdInput('')
        }
    }

    const handleRemoveAuthorId = (id: number) => {
        setFormData({
            ...formData,
            dc_author_ids: formData.dc_author_ids.filter((aid) => aid !== id),
        })
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="card p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-100">Add New KOL</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Name *
                        </label>
                        <input
                            type="text"
                            className="input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            KOL Type
                        </label>
                        <select
                            className="input"
                            value={formData.kol_type}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    kol_type: e.target.value as 'NORMAL' | 'WWG',
                                })
                            }
                        >
                            <option value="NORMAL">NORMAL</option>
                            <option value="WWG">WWG</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Discord Channel ID *
                        </label>
                        <input
                            type="number"
                            className="input"
                            value={formData.dc_channel_id || ''}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    dc_channel_id: parseInt(e.target.value) || 0,
                                })
                            }
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Discord Author IDs (optional)
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="number"
                                className="input flex-1"
                                value={authorIdInput}
                                onChange={(e) => setAuthorIdInput(e.target.value)}
                                placeholder="Enter author ID"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        handleAddAuthorId()
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleAddAuthorId}
                                className="btn-secondary"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        {formData.dc_author_ids.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.dc_author_ids.map((id) => (
                                    <span
                                        key={id}
                                        className="badge-info flex items-center gap-1 cursor-pointer"
                                        onClick={() => handleRemoveAuthorId(id)}
                                    >
                                        {id}
                                        <span className="text-xs">×</span>
                                    </span>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Leave empty to listen to all users in the channel
                        </p>
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
                            {isLoading ? 'Adding...' : 'Add KOL'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default KOLManagement
