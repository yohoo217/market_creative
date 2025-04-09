import { defineStore } from 'pinia'
import { UserRole } from '~/server/models/User'
import type { IUser } from '~/server/models/User'
import type { UserResponse } from '~/types/api'

interface UserState {
  currentUser: Partial<IUser & { _id: string }> | null
  loading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    currentUser: null,
    loading: false,
    error: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.currentUser,
    currentRole: (state) => state.currentUser?.activeRole || UserRole.VISITOR,
    hasRole: (state) => (role: UserRole) => {
      const hasActiveRole = state.currentUser?.roles?.some(r => r.type === role && r.isActive) || false
      if (role === UserRole.VISITOR) {
        return hasActiveRole
      }
      return hasActiveRole && state.currentUser?.activeRole === role
    }
  },

  actions: {
    /**
     * 獲取當前登錄用戶信息
     */
    async fetchCurrentUser() {
      this.loading = true
      this.error = null

      try {
        console.log('開始從API獲取當前用戶信息')
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })
        
        const data = await response.json()
        console.log('獲取用戶信息響應:', data)
        
        if (data.success && data.data) {
          // 確保獲取到的用戶數據完整，包含必要字段
          if (data.data && (!data.data.name || !data.data.activeRole)) {
            console.warn('用戶數據不完整，需重新獲取完整信息', data.data)
            
            // 如果數據不完整，但有用戶ID，可以嘗試重新獲取
            if (data.data._id) {
              this.currentUser = data.data
            } else {
              this.currentUser = null
              console.error('用戶數據缺失ID字段，無法進行恢復')
            }
          } else {
            this.currentUser = data.data
            console.log('成功獲取完整用戶信息:', data.data)
          }
        } else {
          console.log('沒有登錄用戶:', data.message)
          this.currentUser = null
        }
      } catch (error) {
        console.error('獲取當前用戶失敗:', error)
        this.error = error instanceof Error ? error.message : '獲取用戶信息失敗'
        this.currentUser = null
      } finally {
        this.loading = false
      }
    },

    /**
     * 用戶登入
     */
    async login(email: string, password: string) {
      const auth = useAuth()
      this.loading = true
      this.error = null

      try {
        const response = await auth.login({ email, password })
        if (response.success && response.data) {
          this.currentUser = response.data
        } else {
          throw new Error(response.message || '登入失敗')
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '登入失敗'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * 用戶註冊
     */
    async register(formData: FormData) {
      this.loading = true;
      this.error = null;
      
      try {
        const { register } = useAuth();
        const response = await register(formData);
        
        if (response.success && response.data) {
          this.currentUser = response.data;
          return response.data;
        } else {
          throw new Error(response.message || '註冊失敗');
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '註冊失敗';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 更新用戶角色
     */
    async updateRole(role: UserRole, action: 'add' | 'update' | 'remove') {
      if (!this.currentUser?._id) return

      const auth = useAuth()
      this.loading = true
      this.error = null

      try {
        const response = await auth.updateRole({
          userId: this.currentUser._id,
          role,
          action
        })
        if (response.success && response.data) {
          this.currentUser = response.data
        } else {
          throw new Error(response.message || '更新角色失敗')
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '更新角色失敗'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * 切換當前角色
     */
    async switchRole(role: UserRole) {
      if (!this.currentUser?._id) return

      const auth = useAuth()
      this.loading = true
      this.error = null

      try {
        const response = await auth.switchRole({
          userId: this.currentUser._id,
          role
        })
        if (response.success && response.data) {
          this.currentUser = response.data
        } else {
          throw new Error(response.message || '切換角色失敗')
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '切換角色失敗'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * 設置當前用戶
     */
    setUser(user: any) {
      this.currentUser = user;
    },

    /**
     * 登出用戶
     */
    logout: async function() {
      try {
        console.log('正在嘗試登出用戶...');
        
        // 調用登出API端點
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include', // 確保發送cookies
        });
        
        const result = await response.json();
        console.log('登出API響應:', result);
        
        // 無論API調用是否成功，都清除本地狀態
        this.currentUser = null;
        this.error = null;
        
        console.log('用戶已登出，本地狀態已清除');
        
        if (!response.ok) {
          throw new Error(result.message || '登出失敗');
        }
        
        return result;
      } catch (error) {
        console.error('登出過程中出錯:', error);
        
        // 即使API調用失敗，也清除本地狀態
        this.currentUser = null;
        this.error = null;
        
        throw error;
      }
    }
  }
}) 