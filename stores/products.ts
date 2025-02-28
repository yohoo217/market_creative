import { defineStore } from 'pinia'
import type { Product } from '~/types/product'

interface Comment {
  user: string
  content: string
  rating: number
  date: Date
}

interface ProductState {
  products: Product[]
  loading: boolean
  error: string | null
}

export const useProductStore = defineStore('products', {
  state: (): ProductState => ({
    products: [],
    loading: false,
    error: null
  }),

  getters: {
    getProducts: (state) => state.products,
    getProductById: (state) => (id: string) => {
      return state.products.find(product => product.id === id)
    },
    getProductsByCategory: (state) => (category: string) => {
      return state.products.filter(product => product.category === category)
    },
    getProductsByStatus: (state) => (status: string) => {
      return state.products.filter(product => product.status === status)
    },
    getFeaturedProducts: (state) => {
      return state.products
        .filter(product => product.status === 'completed')
        .sort((a, b) => b.views - a.views)
        .slice(0, 6)
    },
    getPopularProducts: (state) => {
      return state.products
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 6)
    }
  },

  actions: {
    async fetchProducts() {
      const api = useApi()
      this.loading = true
      this.error = null
      
      try {
        const response = await api.get<Product[]>('/api/products')
        if (response.success) {
          this.products = response.data
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '獲取產品列表失敗'
        this.products = []
      } finally {
        this.loading = false
      }
    },

    async fetchProduct(id: string) {
      if (!id) return

      const api = useApi()
      this.loading = true
      this.error = null

      try {
        const response = await api.get<Product>(`/api/products/${id}`)
        if (response.success) {
          const index = this.products.findIndex(p => p.id === id)
          if (index !== -1) {
            this.products[index] = response.data
          } else {
            this.products.push(response.data)
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '獲取產品失敗'
      } finally {
        this.loading = false
      }
    },

    async createProduct(product: Omit<Product, 'id'>) {
      const api = useApi()
      this.loading = true
      this.error = null

      try {
        const response = await api.post<Product>('/api/products', product)
        if (response.success) {
          this.products.push(response.data)
        }
        return response.data
      } catch (error) {
        this.error = error instanceof Error ? error.message : '創建產品失敗'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProduct(id: string, updates: Partial<Product>) {
      const api = useApi()
      this.loading = true
      this.error = null

      try {
        const response = await api.patch<Product>(`/api/products/${id}`, updates)
        if (response.success) {
          const index = this.products.findIndex(p => p.id === id)
          if (index !== -1) {
            this.products[index] = { ...this.products[index], ...response.data }
          }
        }
        return response.data
      } catch (error) {
        this.error = error instanceof Error ? error.message : '更新產品失敗'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteProduct(id: string) {
      const api = useApi()
      this.loading = true
      this.error = null

      try {
        await api.delete(`/api/products/${id}`)
        this.products = this.products.filter(p => p.id !== id)
      } catch (error) {
        this.error = error instanceof Error ? error.message : '刪除產品失敗'
        throw error
      } finally {
        this.loading = false
      }
    },

    async addComment(productId: string, comment: Omit<Comment, 'id' | 'date'>) {
      const api = useApi()
      this.loading = true
      this.error = null

      try {
        const response = await api.post<Product>(
          `/api/products/${productId}/comments`,
          comment
        )
        if (response.success) {
          const index = this.products.findIndex(p => p.id === productId)
          if (index !== -1) {
            this.products[index] = response.data
          }
        }
        return response.data
      } catch (error) {
        this.error = error instanceof Error ? error.message : '添加評論失敗'
        throw error
      } finally {
        this.loading = false
      }
    },

    async likeProduct(productId: string) {
      const api = useApi()
      this.error = null

      try {
        const response = await api.post<Product>(`/api/products/${productId}/like`)
        if (response.success) {
          const index = this.products.findIndex(p => p.id === productId)
          if (index !== -1) {
            this.products[index] = response.data
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '點讚失敗'
        throw error
      }
    },

    async viewProduct(productId: string) {
      const api = useApi()
      this.error = null

      try {
        const response = await api.post<Product>(`/api/products/${productId}/view`)
        if (response.success) {
          const index = this.products.findIndex(p => p.id === productId)
          if (index !== -1) {
            this.products[index] = response.data
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '記錄瀏覽失敗'
      }
    }
  }
}) 