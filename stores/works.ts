import { defineStore } from 'pinia'
import { UserRole } from '~/server/models/User'

interface Comment {
  id: string
  content: string
  rating: number
  date: Date
  likes?: number
}

interface UserRoleInfo {
  type: UserRole
  isActive: boolean
  rating?: number
}

interface User {
  _id: string
  name: string
  roles: UserRoleInfo[]
  activeRole: UserRole
}

export interface Work {
  _id: string
  title: string
  description: string
  image: string
  category: string
  price: number
  rating: number
  likes: number
  views: number
  createdAt: string
  comments?: Comment[]
  user?: User
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
      return state.works.find(work => work._id === id)
    },
    getWorksByUser: (state) => (userId: string) => {
      return state.works.filter(work => work.user?._id === userId)
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
      this.error = null
      
      try {
        const response = await fetch('/api/works')
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || '獲取作品失敗')
        }

        if (result.success && Array.isArray(result.data)) {
          this.works = result.data
        } else {
          throw new Error('無效的作品數據格式')
        }
      } catch (error) {
        console.error('獲取作品錯誤:', error)
        this.error = error instanceof Error ? error.message : '獲取作品失敗'
        this.works = []
      } finally {
        this.loading = false
      }
    },

    async fetchWorksByCreator(userId: string) {
      if (!userId) return

      this.loading = true
      this.error = null

      try {
        const response = await fetch(`/api/users/${userId}/works`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || '獲取創作者作品失敗')
        }

        if (result.success && Array.isArray(result.data)) {
          // 更新現有作品列表，保留其他創作者的作品
          const otherWorks = this.works.filter(w => w.user?._id !== userId)
          this.works = [...otherWorks, ...result.data]
        } else {
          throw new Error('無效的作品數據格式')
        }
      } catch (error) {
        console.error('獲取創作者作品錯誤:', error)
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
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || '操作失敗')
        }

        if (result.success) {
          const index = this.works.findIndex(w => w._id === workId)
          if (index !== -1) {
            this.works[index] = { ...this.works[index], likes: result.data.likes }
          }
        }
      } catch (error) {
        console.error('點讚錯誤:', error)
        this.error = error instanceof Error ? error.message : '操作失敗'
      }
    },

    async viewWork(workId: string) {
      try {
        const response = await fetch(`/api/works/${workId}/view`, {
          method: 'POST',
        })
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || '操作失敗')
        }

        if (result.success) {
          const index = this.works.findIndex(w => w._id === workId)
          if (index !== -1) {
            this.works[index] = { ...this.works[index], views: result.data.views }
          }
        }
      } catch (error) {
        console.error('瀏覽錯誤:', error)
        this.error = error instanceof Error ? error.message : '操作失敗'
      }
    }
  }
}) 