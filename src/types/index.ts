// User Types
export interface KOLTrackItem {
    name: string
    is_reverse: boolean
    is_active: boolean
    futures: string[]
    amount_mode: string
    fixed_amounts: Record<string, number>
    percentages: Record<string, number>
    max_loss: number | null
}

export interface User {
    id: number
    username: string
    activate: boolean
    gate_api_key: string
    enable_balance_monitor: boolean
    enable_exporter: boolean
    is_running: boolean
    is_monitoring: boolean
    balance_rate: number | null
    min_balance: number | null
    init_balance: number | null
    followed_kols: KOLTrackItem[]
}

export interface UserFormData {
    username: string
    gate_api_key: string
    gate_secret_key: string
    trade_mode: 'REAL' | 'SIMULATED'
    enable_balance_monitor: boolean
    init_balance?: number
    balance_rate?: number
    min_balance?: number
    exporter_name?: string
}

// KOL Types
export interface KOL {
    id: number
    name: string
    source_type: string
    kol_type: 'NORMAL' | 'WWG'
    dc_channel_id: string
    dc_author_ids: string[]
    followed_by: string[]
}

export interface KOLFormData {
    name: string
    kol_type: 'NORMAL' | 'WWG'
    dc_channel_id: string
    dc_author_ids: string[]
}

// Track Config Types
export type AmountMode = 'FIXED' | 'PERCENTAGE' | 'LOSS_FIXED'

export interface TrackConfig {
    username: string
    kol_name: string
    is_reverse: boolean
    futures: string[]
    amount_mode: AmountMode
    fixed_amounts?: Record<string, number>
    percentages?: Record<string, number>
    max_loss?: number
    status?: 'running' | 'stopped'
}

export interface TrackConfigFormData {
    username: string
    kol_name: string
    is_reverse: boolean
    futures: string[]
    amount_mode: AmountMode
    fixed_amounts?: Record<string, number>
    percentages?: Record<string, number>
    max_loss?: number
}

// API Response Types
export interface ApiResponse<T = any> {
    status: string
    message?: string
    data?: T
}

// Settings Types
export interface AppSettings {
    apiBaseUrl: string
    refreshInterval: number
    theme: 'dark' | 'light'
}
