<template>
  <div>
    <!-- 標題和按鈕區域 -->
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold">最新創意</h2>
      <NuxtLink to="/products?status=idea" class="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
        進入討論區
      </NuxtLink>
    </div>

    <div v-if="pending" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
    </div>

    <div v-else-if="error" class="text-center py-8 text-red-500">
      載入資料時發生錯誤
    </div>

    <template v-else>
      <div class="relative" v-if="cardGroups.length > 0">
        <!-- 左箭頭 -->
        <button @click="prevSlide" class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-r-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- 右箭頭 -->
        <button @click="nextSlide" class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-l-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- 卡片容器 -->
        <div class="overflow-hidden" ref="container" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
          <div class="flex transition-transform duration-300 ease-in-out" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
            <div v-for="(group, groupIndex) in cardGroups" :key="groupIndex" class="w-full flex-shrink-0">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                <div v-for="product in group" :key="product._id" class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div class="mb-4 h-48 rounded-lg overflow-hidden">
                    <img :src="product.image" 
                         :alt="product.name" 
                         class="w-full h-full object-contain hover:scale-105 transition-transform duration-300">
                  </div>
                  <h3 class="text-xl font-semibold mb-2">{{ product.name }}</h3>
                  <p class="text-gray-600">{{ product.category }}</p>
                  <p class="text-gray-600">專案代碼：{{ product.code }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 導航點 -->
        <div class="flex justify-center mt-4 gap-2">
          <button v-for="(_, index) in cardGroups" 
                  :key="index"
                  @click="currentIndex = index"
                  class="w-2 h-2 rounded-full transition-all duration-300"
                  :class="currentIndex === index ? 'bg-blue-500 w-4' : 'bg-gray-300'">
          </button>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        目前沒有創意階段的產品
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  code: string;
  status: string;
}

interface ApiResponse {
  success: boolean;
  data: Product[];
}

// 卡片數據
const { data: apiResponse, pending, error } = await useFetch<ApiResponse>('/api/products', {
  query: {
    status: 'idea',
    sort: '-createdAt'
  }
})

// 每組顯示的卡片數量
const cardsPerGroup = 4

// 將卡片分組
const cardGroups = computed(() => {
  try {
    const products = apiResponse.value?.data || []
    const groups: Product[][] = []
    for (let i = 0; i < products.length; i += cardsPerGroup) {
      groups.push(products.slice(i, i + cardsPerGroup))
    }
    return groups
  } catch {
    return []
  }
})

const currentIndex = ref(0)
const touchStartX = ref(0)
const container = ref(null)

// 切換到上一組
const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

// 切換到下一組
const nextSlide = () => {
  if (currentIndex.value < cardGroups.value.length - 1) {
    currentIndex.value++
  }
}

// 觸摸事件處理
const touchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
}

const touchMove = (e: TouchEvent) => {
  e.preventDefault()
}

const touchEnd = (e: TouchEvent) => {
  const touchEndX = e.changedTouches[0].clientX
  const diff = touchStartX.value - touchEndX

  // 判斷滑動方向和距離
  if (Math.abs(diff) > 50) { // 滑動距離超過 50px 才觸發
    if (diff > 0) {
      nextSlide()
    } else {
      prevSlide()
    }
  }
}
</script>

<style scoped>
.overflow-hidden {
  -webkit-overflow-scrolling: touch;
}
</style> 