import { defineStore } from 'pinia'

export interface Work {
  id: string
  title: string
  description: string
  image: string
  creatorId: string
  creatorName: string
  category: string
  price: number
  rating: number
  likes: number
  views: number
  createdAt: string
}

export const useWorkStore = defineStore('works', {
  state: () => ({
    works: [] as Work[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getWorks: (state) => state.works,
    getWorkById: (state) => (id: string) => {
      return state.works.find(work => work.id === id)
    },
    getWorksByCreator: (state) => (creatorId: string) => {
      return state.works.filter(work => work.creatorId === creatorId)
    },
    getPopularWorks: (state) => {
      return state.works
        .sort((a, b) => b.views - a.views)
        .slice(0, 6)
    },
    getMostLikedWorks: (state) => {
      return state.works
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 6)
    }
  },

  actions: {
    async fetchWorks() {
      this.loading = true
      try {
        const response = await fetch('/api/works')
        const data = await response.json()
        this.works = data
      } catch (error) {
        this.error = error instanceof Error ? error.message : '獲取作品失敗'
      } finally {
        this.loading = false
      }
    },

    async fetchWorksByCreator(creatorId: string) {
      this.loading = true
      try {
        const response = await fetch(`/api/creators/${creatorId}/works`)
        const data = await response.json()
        // 更新現有作品列表，保留其他創作者的作品
        const otherWorks = this.works.filter(w => w.creatorId !== creatorId)
        this.works = [...otherWorks, ...data]
      } catch (error) {
        this.error = error instanceof Error ? error.message : '獲取創作者作品失敗'
      } finally {
        this.loading = false
      }
    },

    async likeWork(workId: string) {
      try {
        const response = await fetch(`/api/works/${workId}/like`, {
          method: 'POST',
        })
        const data = await response.json()
        const index = this.works.findIndex(w => w.id === workId)
        if (index !== -1) {
          this.works[index] = { ...this.works[index], likes: data.likes }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '操作失敗'
      }
    },

    async viewWork(workId: string) {
      try {
        const response = await fetch(`/api/works/${workId}/view`, {
          method: 'POST',
        })
        const data = await response.json()
        const index = this.works.findIndex(w => w.id === workId)
        if (index !== -1) {
          this.works[index] = { ...this.works[index], views: data.views }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '操作失敗'
      }
    }
  }
}) 