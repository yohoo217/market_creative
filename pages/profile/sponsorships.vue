<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold mb-6">我的贊助記錄</h1>

      <!-- 載入中 -->
      <div v-if="loading" class="bg-white shadow-md rounded-lg p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">載入贊助記錄中...</p>
      </div>

      <!-- 無贊助記錄 -->
      <div v-else-if="!sponsorships.length" class="bg-white shadow-md rounded-lg p-8 text-center">
        <div class="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
          <i class="pi pi-heart-fill text-gray-300 text-3xl"></i>
        </div>
        <h2 class="text-xl font-bold mt-4 mb-2">您還沒有贊助記錄</h2>
        <p class="text-gray-600 mb-6">通過贊助創意，您將幫助更多有創意的想法成為現實</p>
        <NuxtLink 
          to="/products" 
          class="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
        >
          瀏覽創意
        </NuxtLink>
      </div>

      <!-- 贊助記錄列表 -->
      <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="py-6 px-6 border-b border-gray-200">
          <h2 class="text-lg font-bold">贊助記錄</h2>
        </div>
        
        <!-- 記錄列表 -->
        <div class="divide-y divide-gray-200">
          <div 
            v-for="sponsorship in sponsorships" 
            :key="sponsorship._id"
            class="p-6 hover:bg-gray-50 transition-colors duration-300"
          >
            <div class="flex flex-col md:flex-row gap-6">
              <!-- 產品圖片 -->
              <div class="flex-shrink-0 w-full md:w-32 h-32">
                <img 
                  :src="sponsorship.product?.image || '/default-product.png'" 
                  :alt="sponsorship.product?.name || '創意項目'"
                  class="w-full h-full object-cover rounded-lg"
                >
              </div>
              
              <!-- 贊助詳情 -->
              <div class="flex-grow">
                <div class="flex flex-col md:flex-row md:justify-between mb-4">
                  <div>
                    <h3 class="text-lg font-bold mb-1">
                      <NuxtLink 
                        :to="`/products/${sponsorship.product?._id}`"
                        class="hover:text-primary-500 transition-colors duration-300"
                      >
                        {{ sponsorship.product?.name || '未知創意' }}
                      </NuxtLink>
                    </h3>
                    <p class="text-sm text-gray-500">
                      交易編號: {{ sponsorship.transactionId }}
                    </p>
                  </div>
                  <div class="mt-2 md:mt-0">
                    <p class="text-lg font-bold">NT$ {{ sponsorship.amount.toLocaleString() }}</p>
                    <p class="text-sm text-gray-500 text-right">
                      {{ formatDate(sponsorship.createdAt) }}
                    </p>
                  </div>
                </div>
                
                <!-- 狀態標籤 -->
                <div class="flex items-center justify-between">
                  <span 
                    class="inline-block px-3 py-1 text-xs rounded-full"
                    :class="getStatusClass(sponsorship.paymentStatus)"
                  >
                    {{ getStatusLabel(sponsorship.paymentStatus) }}
                  </span>
                  <span 
                    class="inline-block px-3 py-1 text-xs rounded-full"
                    :class="getProductStatusClass(sponsorship.product?.status)"
                  >
                    {{ getProductStatusLabel(sponsorship.product?.status) }}
                  </span>
                </div>
                
                <!-- 贊助留言 -->
                <div v-if="sponsorship.message" class="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                  {{ sponsorship.message }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PaymentStatus } from '~/server/models/Sponsorship'

const loading = ref(true)
const sponsorships = ref<any[]>([])
const error = ref(null)

// 格式化日期
const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-TW')
}

// 狀態樣式
const getStatusClass = (status?: string) => {
  switch (status) {
    case PaymentStatus.COMPLETED:
      return 'bg-green-100 text-green-700'
    case PaymentStatus.PENDING:
      return 'bg-yellow-100 text-yellow-700'
    case PaymentStatus.FAILED:
      return 'bg-red-100 text-red-700'
    case PaymentStatus.REFUNDED:
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

// 狀態文字
const getStatusLabel = (status?: string) => {
  switch (status) {
    case PaymentStatus.COMPLETED:
      return '已完成'
    case PaymentStatus.PENDING:
      return '處理中'
    case PaymentStatus.FAILED:
      return '失敗'
    case PaymentStatus.REFUNDED:
      return '已退款'
    default:
      return '未知狀態'
  }
}

// 產品狀態樣式
const getProductStatusClass = (status?: string) => {
  switch (status) {
    case 'idea':
      return 'bg-blue-100 text-blue-700'
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-700'
    case 'fundraising':
      return 'bg-green-100 text-green-700'
    case 'completed':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

// 產品狀態文字
const getProductStatusLabel = (status?: string) => {
  switch (status) {
    case 'idea':
      return '創意階段'
    case 'in_progress':
      return '製作中'
    case 'fundraising':
      return '募資中'
    case 'completed':
      return '已完成'
    default:
      return '未知狀態'
  }
}

// 獲取贊助記錄
onMounted(async () => {
  try {
    loading.value = true
    const { data: response } = await useFetch('/api/users/me/sponsorships', {
      credentials: 'include'
    })
    
    if (response.value && response.value.success) {
      sponsorships.value = response.value.data
    } else {
      error.value = response.value?.message || '獲取贊助記錄失敗'
    }
  } catch (err: any) {
    console.error('獲取贊助記錄錯誤:', err)
    error.value = err.message || '獲取贊助記錄時發生錯誤'
  } finally {
    loading.value = false
  }
})
</script> 