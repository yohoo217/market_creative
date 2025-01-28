import { defineStore } from 'pinia'
import type { Product, ProductResponse } from '~/types/product'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchProducts() {
      this.loading = true
      try {
        const { data } = await useFetch<ProductResponse>('/api/products')
        const response = data.value
        if (response && response.success) {
          this.products = response.data
        } else {
          throw new Error(response?.message || '獲取產品列表失敗')
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : '獲取產品列表失敗'
        console.error('Error fetching products:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchProductById(id: string) {
      this.loading = true
      try {
        const { data } = await useFetch<ProductResponse>(`/api/products/${id}`)
        const response = data.value
        if (response && response.success) {
          const product = response.data[0] // 假設返回的是單個產品的數組
          const existingIndex = this.products.findIndex(p => p.id === id)
          if (existingIndex > -1) {
            this.products[existingIndex] = product
          } else {
            this.products.push(product)
          }
        } else {
          throw new Error(response?.message || '獲取產品詳情失敗')
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : '獲取產品詳情失敗'
        console.error('Error fetching product:', err)
      } finally {
        this.loading = false
      }
    }
  }
}) 