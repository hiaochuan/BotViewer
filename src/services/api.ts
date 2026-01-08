import axios, { AxiosInstance } from 'axios'
import type {
    User,
    UserFormData,
    KOL,
    KOLFormData,
    TrackConfig,
    TrackConfigFormData,
    ApiResponse,
} from '../types'

class FusionAPI {
    private client: AxiosInstance

    constructor(baseURL: string = '/api') {
        this.client = axios.create({
            baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }

    setBaseURL(url: string) {
        this.client.defaults.baseURL = url
    }

    // ===== User Management =====
    async getUsers(username?: string): Promise<User[]> {
        const params = username ? { username } : {}
        const response = await this.client.get<User[]>('/user/get', { params })
        return response.data
    }

    async addUser(data: UserFormData): Promise<ApiResponse> {
        const response = await this.client.post<ApiResponse>('/user/add', data)
        return response.data
    }

    async updateUser(username: string, data: Partial<UserFormData>): Promise<ApiResponse> {
        const response = await this.client.post<ApiResponse>(
            '/user/update',
            data,
            { params: { username } }
        )
        return response.data
    }

    async removeUser(username: string): Promise<ApiResponse> {
        const response = await this.client.delete<ApiResponse>('/user/remove', {
            params: { username },
        })
        return response.data
    }

    async runUser(username: string): Promise<ApiResponse> {
        const response = await this.client.post<ApiResponse>('/user/run', null, {
            params: { username },
        })
        return response.data
    }

    async stopUser(username: string): Promise<ApiResponse> {
        const response = await this.client.post<ApiResponse>('/user/stop', null, {
            params: { username },
        })
        return response.data
    }

    async runMonitor(username: string): Promise<ApiResponse> {
        const response = await this.client.post<ApiResponse>('/user/monitor/run', null, {
            params: { username },
        })
        return response.data
    }

    async stopMonitor(username: string): Promise<ApiResponse> {
        const response = await this.client.post<ApiResponse>('/user/monitor/stop', null, {
            params: { username },
        })
        return response.data
    }

    async closeAllPositions(username: string): Promise<ApiResponse> {
        const response = await this.client.post<ApiResponse>('/user/close_all', null, {
            params: { username },
        })
        return response.data
    }

    async startExporter(username: string, exporterName: string): Promise<ApiResponse> {
        const response = await this.client.post<ApiResponse>(
            '/user/exporter/start',
            null,
            { params: { username, exporter_name: exporterName } }
        )
        return response.data
    }

    async stopExporter(username: string): Promise<ApiResponse> {
        const response = await this.client.post<ApiResponse>(
            '/user/exporter/stop',
            null,
            { params: { username } }
        )
        return response.data
    }

    // ===== KOL Management =====
    async getKOLs(name?: string): Promise<KOL[]> {
        const params = name ? { name } : {}
        const response = await this.client.get<KOL[]>('/kol/get', { params })
        return response.data
    }

    async addKOL(data: KOLFormData): Promise<ApiResponse> {
        const response = await this.client.post<ApiResponse>('/kol/add', data)
        return response.data
    }

    async removeKOL(name: string): Promise<ApiResponse> {
        const response = await this.client.delete<ApiResponse>('/kol/remove', {
            params: { name },
        })
        return response.data
    }

    // ===== Track Config Management =====
    async getTrackConfigs(): Promise<TrackConfig[]> {
        // Note: This endpoint might not exist in the original API
        // You may need to implement it on the backend
        const response = await this.client.get<TrackConfig[]>('/kol/track/get')
        return response.data
    }

    async addTrackConfig(data: TrackConfigFormData): Promise<ApiResponse> {
        const response = await this.client.post<ApiResponse>('/kol/track/add', data)
        return response.data
    }

    async removeTrackConfig(username: string, kolName: string): Promise<ApiResponse> {
        const response = await this.client.delete<ApiResponse>('/kol/track/remove', {
            params: { username, kol_name: kolName },
        })
        return response.data
    }

    async startTrack(username: string, kolName: string): Promise<ApiResponse> {
        const response = await this.client.post<ApiResponse>(
            '/kol/track/start',
            null,
            { params: { username, kol_name: kolName } }
        )
        return response.data
    }

    async stopTrack(username: string, kolName: string): Promise<ApiResponse> {
        const response = await this.client.post<ApiResponse>(
            '/kol/track/stop',
            null,
            { params: { username, kol_name: kolName } }
        )
        return response.data
    }

    async restartTrack(username: string, kolName: string): Promise<ApiResponse> {
        const response = await this.client.post<ApiResponse>(
            '/kol/track/restart',
            null,
            { params: { username, kol_name: kolName } }
        )
        return response.data
    }
}

// Create singleton instance
const api = new FusionAPI()

export default api
