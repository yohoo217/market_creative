import { ref, computed } from 'vue'
import type { Ref, UnwrapRef } from 'vue'
import type { ApiResponse } from '~/types/api'

export interface ApiOptions {
  immediate?: boolean
  transform?: (data: any) => any
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

export type ApiState<T> = {
  data: Ref<UnwrapRef<T | null>>
  loading: Ref<boolean>
  error: Ref<Error | null>
  execute: () => Promise<T | null>
  reset: () => void
}

/**
 * 通用 API 請求 Composable
 * @param url API 端點
 * @param options 選項
 * @returns API 狀態
 */
export function useApi<T = any>(
  url: string | Ref<string>, 
  options: ApiOptions = {}
): ApiState<T> {
  const loading = ref(false)
  const data = ref<T | null>(null) as Ref<UnwrapRef<T | null>>
  const error = ref<Error | null>(null)
  
  // 預設選項
  const defaultOptions: ApiOptions = {
    immediate: true,
    transform: (data) => data,
    onSuccess: () => {},
    onError: () => {}
  }
  
  // 合併選項
  const finalOptions = { ...defaultOptions, ...options }
  
  // 執行 API 請求
  const execute = async (): Promise<T | null> => {
    loading.value = true
    error.value = null
    
    try {
      const resolvedUrl = typeof url === 'string' ? url : url.value
      const response = await $fetch<ApiResponse<T>>(resolvedUrl)
      
      if (!response.success) {
        throw new Error(response.message || '請求失敗')
      }
      
      if (response.data !== undefined) {
        const transformedData = finalOptions.transform 
          ? finalOptions.transform(response.data) 
          : response.data
          
        data.value = transformedData as UnwrapRef<T>
        finalOptions.onSuccess?.(transformedData)
        return transformedData
      }
      
      return null
    } catch (err: any) {
      const errorObj = err instanceof Error 
        ? err 
        : new Error(err?.message || '發生未知錯誤')
        
      error.value = errorObj
      finalOptions.onError?.(errorObj)
      return null
    } finally {
      loading.value = false
    }
  }
  
  // 重置狀態
  const reset = () => {
    data.value = null as UnwrapRef<T | null>
    loading.value = false
    error.value = null
  }
  
  // 如果設置為立即執行，則立即發送請求
  if (finalOptions.immediate) {
    execute()
  }
  
  return { data, loading, error, execute, reset }
}

/**
 * 用於 POST 請求的 API Composable
 * @param url API 端點
 * @param initialPayload 初始 payload
 * @param options 選項
 * @returns API 狀態和 submit 方法
 */
export function useApiPost<T = any, P extends Record<string, any> = Record<string, any>>(
  url: string | Ref<string>, 
  initialPayload?: P,
  options: ApiOptions = {}
) {
  const payload = ref(initialPayload) as Ref<UnwrapRef<P | undefined>>
  const loading = ref(false)
  const data = ref<T | null>(null) as Ref<UnwrapRef<T | null>>
  const error = ref<Error | null>(null)
  
  // 執行 POST 請求
  const submit = async (submitPayload?: P): Promise<T | null> => {
    loading.value = true
    error.value = null
    
    try {
      const resolvedUrl = typeof url === 'string' ? url : url.value
      const finalPayload = submitPayload || payload.value
      
      const response = await $fetch<ApiResponse<T>>(resolvedUrl, {
        method: 'POST',
        body: finalPayload as Record<string, any>
      })
      
      if (!response.success) {
        throw new Error(response.message || '請求失敗')
      }
      
      if (response.data !== undefined) {
        const transformedData = options.transform 
          ? options.transform(response.data) 
          : response.data
          
        data.value = transformedData as UnwrapRef<T>
        options.onSuccess?.(transformedData)
        return transformedData
      }
      
      return null
    } catch (err: any) {
      const errorObj = err instanceof Error 
        ? err 
        : new Error(err?.message || '發生未知錯誤')
        
      error.value = errorObj
      options.onError?.(errorObj)
      return null
    } finally {
      loading.value = false
    }
  }
  
  // 設置 payload
  const setPayload = (newPayload: P) => {
    payload.value = newPayload as UnwrapRef<P>
  }
  
  // 重置狀態
  const reset = () => {
    data.value = null as UnwrapRef<T | null>
    loading.value = false
    error.value = null
  }
  
  return { 
    data, 
    loading, 
    error, 
    payload, 
    submit, 
    setPayload, 
    reset 
  }
}

/**
 * 用於 CRUD 操作的 API Composable
 * @param baseUrl API 基礎端點
 * @param options 選項
 */
export function useApiCrud<T = any, P extends Record<string, any> = Record<string, any>>(
  baseUrl: string | Ref<string>,
  options: ApiOptions = {}
) {
  const resolvedBaseUrl = computed(() => {
    return typeof baseUrl === 'string' ? baseUrl : baseUrl.value
  })
  
  // 獲取所有項目
  const list = useApi<T[]>(resolvedBaseUrl, {
    immediate: false,
    ...options
  })
  
  // 獲取單個項目
  const get = (id: string | number) => {
    const itemUrl = computed(() => `${resolvedBaseUrl.value}/${id}`)
    return useApi<T>(itemUrl, {
      immediate: true,
      ...options
    })
  }
  
  // 創建項目
  const create = useApiPost<T, P>(resolvedBaseUrl, undefined, options)
  
  // 更新項目
  const update = (id: string | number, payload: P) => {
    const updateUrl = computed(() => `${resolvedBaseUrl.value}/${id}`)
    return useApiPost<T, P>(updateUrl, payload, {
      ...options,
      immediate: false
    })
  }
  
  // 刪除項目
  const remove = async (id: string | number): Promise<boolean> => {
    try {
      const response = await $fetch<ApiResponse>(`${resolvedBaseUrl.value}/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.success) {
        throw new Error(response.message || '刪除失敗')
      }
      
      options.onSuccess?.(true)
      return true
    } catch (err: any) {
      const errorObj = err instanceof Error 
        ? err 
        : new Error(err?.message || '刪除過程中發生未知錯誤')
        
      options.onError?.(errorObj)
      return false
    }
  }
  
  // 刷新列表
  const refresh = () => {
    list.execute()
  }
  
  return {
    list,
    get,
    create,
    update,
    remove,
    refresh
  }
}

export default useApi 