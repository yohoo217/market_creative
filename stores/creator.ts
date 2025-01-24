import { defineStore } from 'pinia'

export interface Creator {
  id: string
  name: string
  avatar: string
  description: string
  skills: string[]
  rating: number
  completedProjects: number
  isFollowed: boolean
}

export const useCreatorStore = defineStore('creator', {
  state: () => ({
    creators: [] as Creator[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getCreators: (state) => state.creators,
    getCreatorById: (state) => (id: string) => {
      return state.creators.find(creator => creator.id === id)
    },
    getTopCreators: (state) => {
      return state.creators.sort((a, b) => b.rating - a.rating).slice(0, 5)
    }
  },

  actions: {
    async fetchCreators() {
      this.loading = true
      try {
        const response = await fetch('/api/creators')
        const data = await response.json()
        this.creators = data
      } catch (error) {
        this.error = error instanceof Error ? error.message : '獲取創作者資料失敗'
      } finally {
        this.loading = false
      }
    },

    async updateCreator(creatorData: Partial<Creator> & { id: string }) {
      try {
        const response = await fetch(`/api/creators/${creatorData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(creatorData),
        })
        const data = await response.json()
        const index = this.creators.findIndex(c => c.id === creatorData.id)
        if (index !== -1) {
          this.creators[index] = { ...this.creators[index], ...data }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '更新創作者資料失敗'
      }
    }
  }
}) 