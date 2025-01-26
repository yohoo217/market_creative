import { defineStore } from 'pinia'

export interface Comment {
  id: string
  productId: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  rating: number
  createdAt: string
}

export const useCommentStore = defineStore('comments', {
  state: () => ({
    comments: [] as Comment[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getComments: (state) => state.comments,
    getCommentsByProductId: (state) => (productId: string) => {
      return state.comments.filter(comment => comment.productId === productId)
    },
    getAverageRating: (state) => (productId: string) => {
      const productComments = state.comments.filter(comment => comment.productId === productId)
      if (productComments.length === 0) return 0
      const sum = productComments.reduce((acc, comment) => acc + comment.rating, 0)
      return sum / productComments.length
    }
  },

  actions: {
    async fetchComments(productId: string) {
      if (!productId) {
        this.error = '無效的產品 ID'
        return
      }

      this.loading = true
      this.error = null

      try {
        const response = await fetch(`/api/products/${productId}/comments`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || '獲取評論失敗')
        }

        if (result.success && Array.isArray(result.data)) {
          this.comments = result.data
        } else {
          throw new Error('無效的評論數據格式')
        }
      } catch (error) {
        console.error('獲取評論錯誤:', error)
        this.error = error instanceof Error ? error.message : '獲取評論失敗'
        this.comments = []
      } finally {
        this.loading = false
      }
    },

    async addComment(comment: Omit<Comment, 'id' | 'createdAt'>) {
      try {
        const response = await fetch(`/api/products/${comment.productId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(comment),
        })
        
        const result = await response.json()
        
        if (!response.ok) {
          throw new Error(result.message || '新增評論失敗')
        }

        if (result.success && result.data) {
          this.comments.push(result.data)
        } else {
          throw new Error('無效的回應數據格式')
        }
      } catch (error) {
        console.error('新增評論錯誤:', error)
        this.error = error instanceof Error ? error.message : '新增評論失敗'
        throw error
      }
    },

    async deleteComment(commentId: string) {
      try {
        const response = await fetch(`/api/comments/${commentId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          const result = await response.json()
          throw new Error(result.message || '刪除評論失敗')
        }

        this.comments = this.comments.filter(c => c.id !== commentId)
      } catch (error) {
        console.error('刪除評論錯誤:', error)
        this.error = error instanceof Error ? error.message : '刪除評論失敗'
        throw error
      }
    }
  }
}) 