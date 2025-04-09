<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold">火熱募資中產品</h2>
      <NuxtLink to="/crowdfunding" class="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
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
      <div v-if="products?.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div v-for="product in products" :key="product.id || product._id" class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div class="relative">
            <img :src="product?.image || ''" :alt="product?.name || ''" class="w-full h-48 object-cover rounded-t-lg">
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <div class="text-white font-semibold">{{ product?.name || '' }}</div>
            </div>
          </div>
          <div class="p-4">
            <div class="mb-4">
              <div class="text-gray-600 mb-2">募資進度</div>
              <div class="relative h-2 bg-gray-200 rounded-full">
                <div class="absolute left-0 top-0 h-full bg-primary-500 rounded-full" 
                     :style="{ width: getProgressWidth(product) }">
                </div>
              </div>
              <div class="flex justify-between text-sm mt-1">
                <span class="text-primary-600">${{ formatNumber(product?.currentFunding) }}</span>
                <span class="text-gray-500">${{ formatNumber(product?.fundraisingGoal) }}</span>
              </div>
            </div>
            <NuxtLink :to="`/crowdfunding/${product._id || product.id}`" class="block">
              <button class="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors">
                支持專案
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        目前沒有募資中的產品
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores/user'

const router = useRouter()
const userStore = useUserStore()

interface Product {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  currentFunding: number;
  fundraisingGoal: number;
  targetFunding?: number;
}

interface ApiResponse {
  success: boolean;
  data: Product[];
}

const { data: apiResponse, pending, error } = await useFetch<ApiResponse>('/api/products', {
  query: {
    status: 'fundraising',
    sort: '-currentFunding'
  }
})

const products = computed(() => {
  try {
    if (!apiResponse.value?.success) return []
    return apiResponse.value.data?.filter(p => 
      p && 
      typeof p === 'object' && 
      typeof p.currentFunding === 'number' && 
      (typeof p.fundraisingGoal === 'number' || typeof p.targetFunding === 'number')
    ).map(p => ({
      ...p,
      fundraisingGoal: p.fundraisingGoal || p.targetFunding || 0
    })) || []
  } catch {
    return []
  }
})

const getProgressWidth = (product: Product | null | undefined) => {
  try {
    if (!product) return '0%'
    const current = parseFloat(String(product.currentFunding)) || 0
    const goal = parseFloat(String(product.fundraisingGoal)) || 1
    if (isNaN(current) || isNaN(goal) || goal <= 0) return '0%'
    const percentage = (current / goal) * 100
    const safePercentage = Math.min(100, Math.max(0, percentage))
    return safePercentage.toFixed(1) + '%'
  } catch {
    return '0%'
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
</script> 