<template>
  <div class="relative w-full h-[500px] overflow-hidden">
    <!-- 背景圖片 -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style="background-image: url('/images/banner001.jpg')"
    >
      <!-- 漸層遮罩 -->
      <div class="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-800/80"></div>
    </div>

    <!-- 內容 -->
    <div class="relative container mx-auto h-full flex items-center justify-center px-4">
      <div class="text-center text-white">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">創意設計交易平台</h1>
        <p class="text-xl md:text-2xl mb-8">連結創作者與消費者的橋樑</p>
        <div class="flex justify-center gap-4">
          <Button label="開始創作" class="p-button-lg" />
          <Button label="探索作品" class="p-button-outlined p-button-lg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.p-button-lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}
</style>