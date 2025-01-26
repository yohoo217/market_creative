import { defineStore } from 'pinia'

interface Comment {
  user: string
  content: string
  rating: number
  date: Date
}

interface Product {
  id: string
  name: string
  description: string
  image: string
  price: number
  rating?: number
  dimensions?: string
  travelDistance?: string
  images?: string[]
  additionalImages?: string[]
  comments?: Comment[]
}

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [] as Product[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    getProducts: (state) => state.products,
    getProductById: (state) => (id: string) => {
      return state.products.find(product => product.id === id)
    }
  },

  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch('/api/products')
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || '獲取產品列表失敗')
        }

        if (result.success && Array.isArray(result.data)) {
          this.products = result.data
        } else {
          throw new Error('無效的產品數據格式')
        }
      } catch (error) {
        console.error('獲取產品列表錯誤:', error)
        this.error = error instanceof Error ? error.message : '獲取產品列表失敗'
        this.products = []
      } finally {
        this.loading = false
      }
    },

    async fetchProduct(id: string) {
      if (!id) return

      this.loading = true
      this.error = null

      try {
        const response = await fetch(`/api/products/${id}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || '獲取產品失敗')
        }

        if (result.success) {
          const index = this.products.findIndex(p => p.id === id)
          if (index !== -1) {
            this.products[index] = result.data
          } else {
            this.products.push(result.data)
          }
        } else {
          throw new Error('無效的產品數據格式')
        }
      } catch (error) {
        console.error('獲取產品錯誤:', error)
        this.error = error instanceof Error ? error.message : '獲取產品失敗'
      } finally {
        this.loading = false
      }
    },

    addProduct(product: Product) {
      const index = this.products.findIndex(p => p.id === product.id)
      if (index !== -1) {
        this.products[index] = product
      } else {
        this.products.push(product)
      }
    },

    updateProduct(updatedProduct: Product) {
      const index = this.products.findIndex(p => p.id === updatedProduct.id)
      if (index !== -1) {
        this.products[index] = updatedProduct
      }
    },

    deleteProduct(id: string) {
      this.products = this.products.filter(p => p.id !== id)
    },

    async addProductComment(productId: string, comment: Comment) {
      try {
        const response = await fetch(`/api/products/${productId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(comment),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || '添加評論失敗')
        }

        if (result.success) {
          const product = this.products.find(p => p.id === productId)
          if (product) {
            product.comments = product.comments || []
            product.comments.push(comment)
          }
        } else {
          throw new Error('無效的評論數據格式')
        }
      } catch (error) {
        console.error('添加評論錯誤:', error)
        this.error = error instanceof Error ? error.message : '添加評論失敗'
        throw error
      }
    }
  }
}) 