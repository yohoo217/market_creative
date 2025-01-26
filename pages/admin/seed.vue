<template>
  <div class="max-w-4xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">數據管理</h1>
    
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">初始化數據</h2>
      <p class="text-gray-600 mb-4">
        警告：此操作將清空並重置所有數據。請謹慎使用！
      </p>
      
      <div v-if="message" :class="[
        'p-4 mb-4 rounded-lg',
        success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      ]">
        {{ message }}
      </div>

      <button
        @click="runSeed"
        :disabled="loading"
        class="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading">執行中...</span>
        <span v-else>執行數據填充</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const loading = ref(false)
const message = ref('')
const success = ref(false)

async function runSeed() {
  loading.value = true
  message.value = ''
  success.value = false

  try {
    const response = await fetch('/api/seed', {
      method: 'POST'
    })
    const result = await response.json()
    
    success.value = result.success
    message.value = result.message
  } catch (error) {
    success.value = false
    message.value = '執行失敗：' + (error instanceof Error ? error.message : '未知錯誤')
  } finally {
    loading.value = false
  }
}
</script> 