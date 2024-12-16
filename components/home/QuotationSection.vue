<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <!-- 左側：報價說明 -->
    <div class="space-y-6">
      <h3 class="text-xl font-bold">報價諮詢</h3>
      <p class="text-gray-600">
        提供專業的報價服務，幫助您評估專案成本，讓創意實現更有保障。
      </p>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-primary-50 p-4 rounded-lg">
          <h4 class="font-bold text-primary-700 mb-2">快速評估</h4>
          <p class="text-sm text-gray-600">24小時內回覆初步評估</p>
        </div>
        <div class="bg-primary-50 p-4 rounded-lg">
          <h4 class="font-bold text-primary-700 mb-2">專業建議</h4>
          <p class="text-sm text-gray-600">提供最適合的製作方案</p>
        </div>
      </div>
    </div>

    <!-- 右側：上傳區域 -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h4 class="font-bold mb-4">上傳設計圖</h4>
      <div class="upload-area border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
        <div class="text-center">
          <i class="pi pi-image text-3xl text-gray-400 mb-2"></i>
          <p class="text-gray-600">上傳您的設計圖或草圖</p>
          <Button label="選擇檔案" class="mt-4" />
        </div>
      </div>
      <div class="space-y-4">
        <InputText placeholder="專案名稱" class="w-full" />
        <InputText placeholder="聯絡方式" class="w-full" />
        <Button label="送出報價需求" class="w-full" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>