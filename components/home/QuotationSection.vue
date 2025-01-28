<template>
  <div class="flex justify-center items-center py-12 bg-gray-50">
    <div class="max-w-4xl w-full px-4">
      <!-- 報價說明 -->
      <div class="text-center space-y-6">
        <h3 class="text-2xl font-bold text-gray-800">專人協助</h3>
        <p class="text-gray-600 max-w-2xl mx-auto">
          提供專業的服務，幫助您評估專案成本，讓創意實現更有保障。
        </p>
        <div class="flex flex-col md:flex-row justify-center gap-6 mt-8">
          <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex-1 max-w-xs mx-auto">
            <h4 class="font-bold text-primary-700 text-lg mb-3">快速評估</h4>
            <p class="text-gray-600">24小時內回覆初步評估</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex-1 max-w-xs mx-auto">
            <h4 class="font-bold text-primary-700 text-lg mb-3">專業建議</h4>
            <p class="text-gray-600">提供最適合的製作方案</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.text-primary-600 {
  color: #2563eb;
}

.text-primary-700 {
  color: #1d4ed8;
}

.bg-primary-50 {
  background-color: #eff6ff;
}
</style>