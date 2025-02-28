import { ref } from 'vue'

interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

interface ApiError {
  message: string
  code?: string
  status?: number
}

export function useApi() {
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  async function request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw {
          message: data.message || '請求失敗',
          status: response.status,
          code: data.code,
        }
      }

      return data
    } catch (err) {
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : '請求失敗',
      }
      if (typeof err === 'object' && err !== null) {
        apiError.code = (err as any).code
        apiError.status = (err as any).status
      }
      error.value = apiError
      throw apiError
    } finally {
      loading.value = false
    }
  }

  async function get<T>(url: string, options: RequestInit = {}) {
    return request<T>(url, { ...options, method: 'GET' })
  }

  async function post<T>(url: string, data?: any, options: RequestInit = {}) {
    return request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async function put<T>(url: string, data?: any, options: RequestInit = {}) {
    return request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async function patch<T>(url: string, data?: any, options: RequestInit = {}) {
    return request<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async function del<T>(url: string, options: RequestInit = {}) {
    return request<T>(url, { ...options, method: 'DELETE' })
  }

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    patch,
    delete: del,
  }
} 