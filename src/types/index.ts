// User Types
export interface User {
    username: string
    gate_api_key: string
    gate_secret_key: string
    trade_mode: 'REAL' | 'SIMULATED'
    enable_balance_monitor: boolean
    init_balance?: number
    balance_rate?: number
    min_balance?: number
    exporter_name?: string
    status?: 'running' | 'stopped'
    monitor_status?: 'running' | 'stopped'
    exporter_status?: 'running' | 'stopped'
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
    name: string
    kol_type: 'NORMAL' | 'WWG'
    dc_channel_id: number
    dc_author_ids: number[]
    status?: 'active' | 'inactive'
}

export interface KOLFormData {
    name: string
    kol_type: 'NORMAL' | 'WWG'
    dc_channel_id: number
    dc_author_ids: number[]
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
