import { defineStore } from 'pinia'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'user' | 'creator' | 'engineer' | 'admin'
}

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null as User | null,
    isAuthenticated: false,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    user: (state) => state.currentUser,
    isLoggedIn: (state) => state.isAuthenticated,
    isCreator: (state) => state.currentUser?.role === 'creator',
    isEngineer: (state) => state.currentUser?.role === 'engineer',
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      try {
        // 這裡之後替換成實際的 API 調用
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })
        const data = await response.json()
        this.currentUser = data.user
        this.isAuthenticated = true
      } catch (error) {
        this.error = error instanceof Error ? error.message : '登入失敗'
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.currentUser = null
      this.isAuthenticated = false
    },

    async updateProfile(userData: Partial<User>) {
      try {
        // 這裡之後替換成實際的 API 調用
        const response = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
        const data = await response.json()
        this.currentUser = { ...this.currentUser, ...data.user } as User
      } catch (error) {
        this.error = error instanceof Error ? error.message : '更新個人資料失敗'
        throw error
      }
    }
  }
}) 