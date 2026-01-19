import axios, { AxiosInstance } from 'axios'
import JSONbig from 'json-bigint'
import type {
  User,
  UserFormData,
  KOL,
  KOLFormData,
  TrackConfigFormData,
  ApiResponse,
} from '../types'

// Configure json-bigint to convert big integers to strings
const JSONbigString = JSONbig({ storeAsString: true })

class FusionAPI {
  private client: AxiosInstance
  private useElectronAPI: boolean

  constructor(baseURL: string = 'http://127.0.0.1:8888') {
    this.useElectronAPI = typeof window !== 'undefined' && 'electronAPI' in window
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      // Use json-bigint to parse responses and preserve large integers as strings
      transformResponse: [function (data) {
        if (typeof data === 'string') {
          try {
            return JSONbigString.parse(data)
          } catch (e) {
            return data
          }
        }
        return data
      }]
    })
  }

  private async request<T>(config: {
    method: 'get' | 'post' | 'delete'
    url: string
    data?: any
    params?: any
  }): Promise<T> {
    console.log('[API Request]', config.method.toUpperCase(), config.url, {
      data: config.data,
      params: config.params,
    })

    if (this.useElectronAPI) {
      const result = await window.electronAPI.apiRequest(config)
      console.log('[API Response]', config.url, result)
      if (!result.success) {
        throw new Error(result.error || 'API request failed')
      }
      return result.data
    } else {
      const response = await this.client.request<T>(config)
      console.log('[API Response]', config.url, response.data)
      return response.data
    }
  }

  async setBaseURL(url: string) {
    if (this.useElectronAPI) {
      await window.electronAPI.setApiUrl(url)
    } else {
      this.client.defaults.baseURL = url
    }
  }

  // ===== User Management =====
  async getUsers(username?: string): Promise<{ users: User[]; total: number }> {
    const params = username ? { username } : {}
    return this.request<{ users: User[]; total: number }>({
      method: 'get',
      url: '/user/get',
      params,
    })
  }

  async addUser(data: UserFormData): Promise<ApiResponse> {
    return this.request<ApiResponse>({
      method: 'post',
      url: '/user/add',
      data,
    })
  }

  async updateUser(username: string, data: Partial<UserFormData>): Promise<ApiResponse> {
    return this.request<ApiResponse>({
      method: 'post',
      url: '/user/update',
      data,
      params: { username },
    })
  }

  async removeUser(username: string): Promise<ApiResponse> {
    return this.request<ApiResponse>({
      method: 'delete',
      url: '/user/remove',
      params: { username },
    })
  }

  async runUser(username: string): Promise<ApiResponse> {
    return this.request<ApiResponse>({
      method: 'post',
      url: '/user/run',
      params: { username },
    })
  }

  async stopUser(username: string): Promise<ApiResponse> {
    return this.request<ApiResponse>({
      method: 'post',
      url: '/user/stop',
      params: { username },
    })
  }

  async runMonitor(username: string): Promise<ApiResponse> {
    return this.request<ApiResponse>({
      method: 'post',
      url: '/user/monitor/run',
      params: { username },
    })
  }

  async stopMonitor(username: string): Promise<ApiResponse> {
    return this.request<ApiResponse>({
      method: 'post',
      url: '/user/monitor/stop',
      params: { username },
    })
  }

  async closeAllPositions(username: string): Promise<ApiResponse> {
    return this.request<ApiResponse>({
      method: 'post',
      url: '/user/close_all',
      params: { username },
    })
  }

  async startExporter(username: string, exporterName: string): Promise<ApiResponse> {
    return this.request<ApiResponse>({
      method: 'post',
      url: '/user/exporter/start',
      params: { username, exporter_name: exporterName },
    })
  }

  async stopExporter(username: string): Promise<ApiResponse> {
    return this.request<ApiResponse>({
      method: 'post',
      url: '/user/exporter/stop',
      params: { username },
    })
  }

  // ===== KOL Management =====
  async getKOLs(name?: string): Promise<{ kols: KOL[] }> {
    const params = name ? { name } : {}
    const result = await this.request<KOL[]>({
      method: 'get',
      url: '/kol/get',
      params,
    })
    // Backend returns array directly, wrap it for consistency
    return { kols: result }
  }

  async addKOL(data: KOLFormData): Promise<ApiResponse> {
    return this.request<ApiResponse>({
      method: 'post',
      url: '/kol/add',
      data,
    })
  }

  async removeKOL(name: string): Promise<ApiResponse> {
    return this.request<ApiResponse>({
      method: 'delete',
      url: '/kol/remove',
      params: { name },
    })
  }

  // ===== Track Config Management =====
  // Note: Track configs are embedded in user data (followed_kols field)
  // No separate getTrackConfigs endpoint needed

  async addTrackConfig(data: TrackConfigFormData): Promise<ApiResponse> {
    return this.request<ApiResponse>({
      method: 'post',
      url: '/kol/track/add',
      data,
    })
  }

  async removeTrackConfig(username: string, kolName: string): Promise<ApiResponse> {
    return this.request<ApiResponse>({
      method: 'delete',
      url: '/kol/track/remove',
      params: { username, kol_name: kolName },
    })
  }

  async startTrack(username: string, kolName: string): Promise<ApiResponse> {
    return this.request<ApiResponse>({
      method: 'post',
      url: '/kol/track/start',
      params: { username, kol_name: kolName },
    })
  }

  async stopTrack(username: string, kolName: string): Promise<ApiResponse> {
    return this.request<ApiResponse>({
      method: 'post',
      url: '/kol/track/stop',
      params: { username, kol_name: kolName },
    })
  }

  async restartTrack(username: string, kolName: string): Promise<ApiResponse> {
    return this.request<ApiResponse>({
      method: 'post',
      url: '/kol/track/restart',
      params: { username, kol_name: kolName },
    })
  }
}

// Create singleton instance
const api = new FusionAPI()

export default api
