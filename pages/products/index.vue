<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold mb-8">所有作品</h1>

      <div class="mb-8 flex flex-wrap gap-4">
        <button 
          v-for="status in statuses" 
          :key="status"
          @click="() => handleStatusChange(status)"
          class="px-4 py-2 rounded-lg"
          :class="currentStatus === status ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'"
        >
          {{ statusLabels[status] }}
        </button>
      </div>

      <div v-if="pending" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
      </div>

      <div v-else-if="error" class="text-center py-8 text-red-500">
        載入資料時發生錯誤
      </div>

      <template v-else>
        <div v-if="products?.length > 0" class="space-y-6">
          <div v-for="product in products" :key="product._id" class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex">
            <div class="relative w-72">
              <img :src="product?.image || ''" :alt="product?.name || ''" class="w-full h-48 object-cover rounded-l-lg">
              <div class="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full flex items-center">
                <span class="text-yellow-500 mr-1">★</span>
                <span class="text-sm font-medium">{{ formatRating(product.averageRating) }}</span>
              </div>
            </div>
            <div class="flex-1 p-6">
              <h3 class="font-semibold text-xl mb-3">{{ product?.name || '' }}</h3>
              <p class="text-gray-600 mb-4">{{ product?.description || '' }}</p>
              <div class="flex justify-between items-center mt-auto">
                <div class="text-primary-600 font-medium text-lg">{{ displayPrice(product) }}</div>
                <div class="text-gray-500">{{ formatNumber(product?.views) }} 次瀏覽</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          目前沒有相關作品
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

interface Comment {
  _id: string;
  content: string;
  rating: number;
  date: string;
  likes: number;
  user: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  comments: Comment[];
  views: number;
  status: string;
  averageRating?: number;
}

interface ApiResponse {
  success: boolean;
  data: Product[];
}

type ProductStatus = 'all' | 'idea' | 'in_progress' | 'fundraising' | 'completed'

const currentStatus = ref<ProductStatus>('all')

// 從路由參數獲取初始狀態
const route = useRoute()
const initialStatus = computed(() => {
  const statusParam = route.query.status as ProductStatus
  return statuses.includes(statusParam) ? statusParam : 'all'
})

// 監聽狀態變化並更新路由
const router = useRouter()
watch(currentStatus, (newStatus) => {
  if (newStatus === 'all') {
    router.replace({ query: {} })
  } else {
    router.replace({ query: { status: newStatus } })
  }
})

// 初始化狀態
onMounted(() => {
  currentStatus.value = initialStatus.value
})

const statusLabels: Record<ProductStatus, string> = {
  all: '全部',
  idea: '創意階段',
  in_progress: '製作中',
  fundraising: '募資中',
  completed: '已完成'
}

const statuses: ProductStatus[] = ['all', 'idea', 'in_progress', 'fundraising', 'completed']

const handleStatusChange = (status: ProductStatus) => {
  currentStatus.value = status
}

const { data: apiResponse, pending, error } = await useFetch<ApiResponse>('/api/products', {
  query: computed(() => ({
    status: currentStatus.value === 'all' ? undefined : currentStatus.value,
    sort: '-createdAt'
  }))
})

const products = computed(() => {
  try {
    return apiResponse.value?.data?.filter(p => 
      p && 
      typeof p === 'object' && 
      Array.isArray(p.comments)
    ).map(p => ({
      ...p,
      averageRating: calculateAverageRating(p.comments)
    })) || []
  } catch {
    return []
  }
})

const calculateAverageRating = (comments: Comment[]) => {
  if (!comments || comments.length === 0) return 0
  const sum = comments.reduce((acc, comment) => acc + (comment.rating || 0), 0)
  return sum / comments.length
}

const formatRating = (rating: number | null | undefined) => {
  try {
    if (rating === null || rating === undefined) return '0.0'
    const value = parseFloat(String(rating))
    if (isNaN(value)) return '0.0'
    return value.toFixed(1)
  } catch {
    return '0.0'
  }
}

const formatNumber = (num: number | null | undefined) => {
  try {
    if (num === null || num === undefined) return '0'
    const value = parseFloat(String(num))
    if (isNaN(value)) return '0'
    return value.toLocaleString()
  } catch {
    return '0'
  }
}

// 修改價格顯示邏輯
const displayPrice = (product: Product) => {
  if (product.status === 'idea' || product.status === 'in_progress') {
    return '尚未定價'
  }
  return `$${formatNumber(product.price)}`
}
</script> 