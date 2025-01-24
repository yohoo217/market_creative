<template>
  <div>
    <!-- 標題和按鈕區域 -->
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold">最新創意</h2>
      <NuxtLink to="/ideas" class="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
        進入討論區
      </NuxtLink>
    </div>

    <div class="relative">
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
              <template v-for="card in group" :key="card.id">
                <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div class="mb-4 h-48 rounded-lg overflow-hidden">
                    <img :src="card.image" 
                         :alt="card.title" 
                         class="w-full h-full object-contain hover:scale-105 transition-transform duration-300">
                  </div>
                  <h3 class="text-xl font-semibold mb-2">{{ card.title }}</h3>
                  <p class="text-gray-600">{{ card.category }}</p>
                  <p class="text-gray-600">專案代碼：{{ card.code }}</p>
                </div>
              </template>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 卡片數據
const cards = [
  {
    id: 1,
    image: '/picture/6684785f-2725-473e-aa36-9c228422a287.webp',
    title: '機器螢幕支架',
    category: 'Front Wheel',
    code: 'A0001'
  },
  {
    id: 2,
    image: '/picture/a9f661e6-bf8b-4cb2-a6cf-9d993cb02285.webp',
    title: '智慧眼鏡',
    category: 'Smart Vision',
    code: 'A0002'
  },
  {
    id: 3,
    image: '/picture/d3592be7-4e2b-45f2-b8af-03c23525a92e.webp',
    title: '企鵝開瓶器',
    category: 'Creative Tools',
    code: 'A0003'
  },
  {
    id: 4,
    image: '/more_product/smart_bottle.png',
    title: '智慧水瓶',
    category: 'Smart Living',
    code: 'A0004'
  },
  {
    id: 5,
    image: '/more_product/smart_mask.png',
    title: '智慧口罩',
    category: 'Health Tech',
    code: 'A0005'
  },
  {
    id: 6,
    image: '/more_product/smart_shoes.png',
    title: '智慧鞋墊',
    category: 'Wearable Tech',
    code: 'A0006'
  },
  {
    id: 7,
    image: '/more_product/smart_backpack.png',
    title: '智慧背包',
    category: 'Travel Tech',
    code: 'A0007'
  },
  {
    id: 8,
    image: '/more_product/smart_cup.png',
    title: '智慧保溫杯',
    category: 'Daily Tech',
    code: 'A0008'
  }
]

// 每組顯示的卡片數量
const cardsPerGroup = 4

// 將卡片分組
const cardGroups = computed(() => {
  const groups = []
  for (let i = 0; i < cards.length; i += cardsPerGroup) {
    groups.push(cards.slice(i, i + cardsPerGroup))
  }
  return groups
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