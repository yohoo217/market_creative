import { defineStore } from 'pinia'

export interface Engineer {
  id: string
  name: string
  avatar: string
  specialties: string[]
  experience: number
  rating: number
  hourlyRate: number
  completedProjects: number
  availability: boolean
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
    getAvailableEngineers: (state) => {
      return state.engineers.filter(engineer => engineer.availability)
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
          throw new Error(result.message || '獲取工程師資料失敗')
        }

        if (result.success && Array.isArray(result.data)) {
          this.engineers = result.data
        } else {
          throw new Error('無效的工程師資料格式')
        }
      } catch (error) {
        console.error('獲取工程師資料錯誤:', error)
        this.error = error instanceof Error ? error.message : '獲取工程師資料失敗'
        this.engineers = []
      } finally {
        this.loading = false
      }
    },

    async updateEngineer(engineerData: Partial<Engineer> & { id: string }) {
      try {
        const response = await fetch(`/api/engineers/${engineerData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(engineerData),
        })
        
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || '更新工程師資料失敗')
        }

        if (result.success) {
          const index = this.engineers.findIndex(e => e.id === engineerData.id)
          if (index !== -1) {
            this.engineers[index] = { ...this.engineers[index], ...result.data }
          }
        } else {
          throw new Error('無效的工程師資料格式')
        }
      } catch (error) {
        console.error('更新工程師資料錯誤:', error)
        this.error = error instanceof Error ? error.message : '更新工程師資料失敗'
        throw error
      }
    }
  }
}) 