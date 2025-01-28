import { defineStore } from 'pinia'
import { UserRole } from '~/server/models/User'

export interface Engineer {
  id: string
  name: string
  avatar: string
  specialties: string[]
  description: string
  rating: number
  isVerified: boolean
  completedProjects: number
  subscription: {
    plan: string
    expiredAt?: Date
  }
}

export const useEngineerStore = defineStore('engineer', {
  state: () => ({
    engineers: [] as Engineer[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getEngineers: (state) => state.engineers,
    getEngineerById: (state) => (id: string) => {
      return state.engineers.find(engineer => engineer.id === id)
    },
    getTopEngineers: (state) => {
      return state.engineers
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5)
    }
  },

  actions: {
    async fetchEngineers() {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch('/api/engineers')
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || '獲取工程師列表失敗')
        }

        if (Array.isArray(result)) {
          this.engineers = result
        } else {
          throw new Error('無效的工程師數據格式')
        }
      } catch (error) {
        console.error('獲取工程師列表錯誤:', error)
        this.error = error instanceof Error ? error.message : '獲取工程師列表失敗'
        this.engineers = []
      } finally {
        this.loading = false
      }
    },

    async updateEngineer(engineerData: Partial<Engineer> & { id: string }) {
      try {
        const response = await fetch(`/api/engineers/${engineerData.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(engineerData),
        })
        const data = await response.json()
        const index = this.engineers.findIndex(e => e.id === engineerData.id)
        if (index !== -1) {
          this.engineers[index] = { ...this.engineers[index], ...data }
        }
      } catch (error) {
        console.error('更新工程師資料錯誤:', error)
        throw error
      }
    }
  }
}) 