<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold">熱門作品</h2>
      <NuxtLink 
        to="/products" 
        @click="() => navigateToProducts('completed')"
        class="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
      >
        查看全部
      </NuxtLink>
    </div>

    <div v-if="pending" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
    </div>

    <div v-else-if="error" class="text-center py-8 text-red-500">
      載入資料時發生錯誤
    </div>

    <template v-else>
      <div v-if="topProduct" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- 產品圖片輪播 -->
        <div class="relative h-96">
          <img :src="topProduct.image" :alt="topProduct.name" class="w-full h-full object-cover">
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <h3 class="text-white text-2xl font-bold">{{ topProduct.name }}</h3>
            <div class="flex items-center mt-2">
              <div class="flex items-center bg-yellow-400 rounded-full px-3 py-1">
                <span class="text-white font-bold mr-1">★</span>
                <span class="text-white font-bold">{{ formatRating(averageRating) }}</span>
              </div>
              <span class="text-white ml-3">{{ topProduct.views }} 次瀏覽</span>
            </div>
          </div>
        </div>

        <!-- 產品詳情 -->
        <div class="p-6">
          <div class="flex justify-between items-start mb-6">
            <div>
              <p class="text-gray-600 mb-4">{{ topProduct.description }}</p>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-500">尺寸規格：</span>
                  <span class="text-gray-700">{{ topProduct.dimensions }}</span>
                </div>
                <div>
                  <span class="text-gray-500">技術規格：</span>
                  <span class="text-gray-700">{{ topProduct.travelDistance }}</span>
                </div>
              </div>
            </div>
            <div class="text-2xl font-bold text-primary-600">
              ${{ formatNumber(topProduct.price) }}
            </div>
          </div>

          <!-- 評論區塊 -->
          <div class="mt-8">
            <h4 class="text-lg font-semibold mb-4">用戶評價</h4>
            <div class="space-y-4">
              <div v-for="comment in topProduct.comments" :key="comment._id" class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center">
                    <img :src="comment.user?.avatar || '/user/default-avatar.jpg'" 
                         :alt="comment.user?.name" 
                         class="w-8 h-8 rounded-full object-cover">
                    <span class="ml-2 font-medium">{{ comment.user?.name }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-yellow-400 mr-1">★</span>
                    <span>{{ comment.rating }}</span>
                  </div>
                </div>
                <p class="text-gray-600">{{ comment.content }}</p>
                <div class="text-sm text-gray-400 mt-2">
                  {{ formatDate(comment.date) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        目前沒有熱門作品
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToProducts = (status: string) => {
  router.push({ path: '/products', query: { status } })
}

interface User {
  _id: string;
  name: string;
  avatar?: string;
}

interface Comment {
  _id: string;
  user: User;
  content: string;
  rating: number;
  date: Date;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  dimensions: string;
  travelDistance: string;
  views: number;
  comments: Comment[];
}

interface ApiResponse {
  success: boolean;
  data: Product[];
}

const { data: apiResponse, pending, error } = await useFetch<ApiResponse>('/api/products', {
  query: {
    status: 'completed'
  }
})

const topProduct = computed(() => {
  if (!apiResponse.value?.success) return null
  const products = apiResponse.value.data || []
  return products.sort((a, b) => {
    const aRating = calculateAverageRating(a.comments)
    const bRating = calculateAverageRating(b.comments)
    return bRating - aRating
  })[0] || null
})

const averageRating = computed(() => {
  if (!topProduct.value?.comments) return 0
  return calculateAverageRating(topProduct.value.comments)
})

const calculateAverageRating = (comments: Comment[]) => {
  if (!comments || comments.length === 0) return 0
  const sum = comments.reduce((acc, comment) => acc + comment.rating, 0)
  return sum / comments.length
}

const formatRating = (rating: number) => {
  return rating.toFixed(1)
}

const formatNumber = (num: number) => {
  return num.toLocaleString()
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script> 