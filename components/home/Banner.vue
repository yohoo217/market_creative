<template>
  <div class="relative w-full h-[500px] overflow-hidden">
    <!-- 背景圖片 -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style="background-image: url('https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070')"
    >
      <!-- 漸層遮罩 -->
      <div class="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-800/80"></div>
    </div>

    <!-- 內容 -->
    <div class="relative container mx-auto h-full flex items-center justify-center px-4">
      <div class="text-center text-white">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">創意設計交易平台</h1>
        <p class="text-xl md:text-2xl mb-8">連結創作者與消費者的橋樑</p>
        <div class="flex justify-center gap-4 mb-8">
          <Button label="開始創作" class="p-button-lg" />
          <Button label="探索作品" class="p-button-outlined p-button-lg" />
        </div>
        <!-- 搜索欄 -->
        <div class="max-w-2xl mx-auto">
          <div class="relative">
            <input 
              type="text" 
              placeholder="搜尋創意作品..."
              class="w-full px-6 py-4 rounded-full bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-lg"
            >
            <button 
              class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-500 text-white p-3 rounded-full hover:bg-primary-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')
</script>

<style scoped>
.p-button-lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}
</style>