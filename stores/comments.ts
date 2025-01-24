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
      this.loading = true
      try {
        const response = await fetch(`/api/products/${productId}/comments`)
        const data = await response.json()
        this.comments = data
      } catch (error) {
        this.error = error instanceof Error ? error.message : '獲取評論失敗'
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
        const data = await response.json()
        this.comments.push(data)
      } catch (error) {
        this.error = error instanceof Error ? error.message : '新增評論失敗'
      }
    },

    async deleteComment(commentId: string) {
      try {
        await fetch(`/api/comments/${commentId}`, {
          method: 'DELETE',
        })
        this.comments = this.comments.filter(c => c.id !== commentId)
      } catch (error) {
        this.error = error instanceof Error ? error.message : '刪除評論失敗'
      }
    }
  }
}) 