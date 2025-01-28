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
    hasRole: (state) => (role: UserRole) => 
      state.currentUser?.roles?.some(r => r.type === role && r.isActive) || false
  },

  actions: {
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
    async register(email: string, password: string, name: string, role?: UserRole) {
      const auth = useAuth()
      this.loading = true
      this.error = null

      try {
        const response = await auth.register({ email, password, name, role })
        if (response.success && response.data) {
          this.currentUser = response.data
        } else {
          throw new Error(response.message || '註冊失敗')
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '註冊失敗'
        throw error
      } finally {
        this.loading = false
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
     * 登出
     */
    logout() {
      this.currentUser = null
      this.error = null
      // 可以在這裡添加清除 token 等邏輯
    }
  }
}) 