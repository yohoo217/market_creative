import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product, ProductStatus } from '~/types/product'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string>('')

  async function fetchProducts() {
    loading.value = true
    error.value = ''
    
    try {
      // 在實際應用中，這裡應該是一個API請求
      // const response = await fetch('/api/products')
      // const data = await response.json()
      // products.value = data
      
      // 暫時使用模擬數據
      await new Promise(resolve => setTimeout(resolve, 1000))
      products.value = [
        {
          id: '1',
          name: '產品1',
          description: '這是產品1的描述',
          price: 1000,
          image: '/picture/product1.jpg',
          category: '3c',
          status: 'idea' as ProductStatus,
          dimensions: '10x20x30 cm',
          travelDistance: '100 km',
          images: ['/picture/product1.jpg'],
          additionalImages: [],
          comments: [],
          views: 0,
          likes: 0,
          averageRating: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: '產品2',
          description: '這是產品2的描述',
          price: 2000,
          image: '/picture/product2.jpg',
          category: 'home',
          status: 'idea' as ProductStatus,
          dimensions: '20x30x40 cm',
          travelDistance: '200 km',
          images: ['/picture/product2.jpg'],
          additionalImages: [],
          comments: [],
          views: 0,
          likes: 0,
          averageRating: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    } catch (e) {
      error.value = '獲取產品列表失敗'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  async function fetchProductById(id: string) {
    loading.value = true
    error.value = ''
    
    try {
      // 在實際應用中，這裡應該是一個API請求
      // const response = await fetch(`/api/products/${id}`)
      // const data = await response.json()
      // 更新products中對應的產品，或者添加一個新的產品
      
      // 暫時使用模擬數據
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockProduct: Product = {
        id,
        name: `產品${id}`,
        description: `這是產品${id}的詳細描述`,
        price: parseInt(id) * 1000,
        image: `/picture/product${id}.jpg`,
        category: parseInt(id) % 2 === 0 ? 'home' : '3c',
        status: 'idea' as ProductStatus,
        dimensions: `${parseInt(id) * 10}x${parseInt(id) * 20}x${parseInt(id) * 30} cm`,
        travelDistance: `${parseInt(id) * 100} km`,
        images: [`/picture/product${id}.jpg`],
        additionalImages: [],
        comments: [],
        views: 0,
        likes: 0,
        averageRating: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // 更新products列表，如果產品已存在則更新，否則添加
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = mockProduct
      } else {
        products.value.push(mockProduct)
      }
    } catch (e) {
      error.value = '獲取產品詳情失敗'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProductById
  }
}) 