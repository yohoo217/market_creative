import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Product {
  id: string
  name: string
  description: string
  image: string
  price: number
}

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const getProducts = computed(() => products.value)
  const getProductById = computed(() => {
    return (id: string) => products.value.find(product => product.id === id)
  })

  // Actions
  async function fetchProducts() {
    loading.value = true
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      products.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : '獲取產品失敗'
    } finally {
      loading.value = false
    }
  }

  function addProduct(product: Product) {
    products.value.push(product)
  }

  function updateProduct(updatedProduct: Product) {
    const index = products.value.findIndex(p => p.id === updatedProduct.id)
    if (index !== -1) {
      products.value[index] = updatedProduct
    }
  }

  function deleteProduct(id: string) {
    products.value = products.value.filter(p => p.id !== id)
  }

  return {
    // State
    products,
    loading,
    error,
    // Getters
    getProducts,
    getProductById,
    // Actions
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  }
}) 