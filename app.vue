<template>
  <div>
    <Toast position="bottom-center" group="auth" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onErrorCaptured } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductStore } from '~/stores/products'
import { useUserStore } from '~/stores/user'

// 初始化 store
const productStore = useProductStore()
const userStore = useUserStore() 
const { error } = storeToRefs(productStore)

onMounted(async () => {
  console.log('App mounted, Pinia store initialized')
  
  // 獲取當前用戶信息
  try {
    console.log('正在嘗試獲取當前用戶信息...')
    await userStore.fetchCurrentUser()
    console.log('User state initialized, 當前用戶狀態:', userStore.currentUser)
    if (userStore.currentUser) {
      console.log('用戶已登入，名稱:', userStore.currentUser.name)
      console.log('用戶角色:', userStore.currentUser.activeRole)
    } else {
      console.log('無登入用戶')
    }
  } catch (error) {
    console.error('Failed to initialize user state:', error)
  }
})

onErrorCaptured((err, instance, info) => {
  console.error('Captured error:', err)
  console.log('Error instance:', instance)
  console.log('Error info:', info)
  // 返回 false 以防止錯誤繼續傳播
  return false
})
</script>

<style>
.p-toast {
  @apply max-w-md mx-auto;
}

.p-toast .p-toast-message {
  @apply rounded-lg shadow-lg border-0;
}

.p-toast .p-toast-message-error {
  @apply bg-red-50 border-l-4 border-red-500;
}

.p-toast .p-toast-message-error .p-toast-message-content {
  @apply text-red-700;
}

.p-toast .p-toast-message-success {
  @apply bg-green-50 border-l-4 border-green-500;
}

.p-toast .p-toast-message-success .p-toast-message-content {
  @apply text-green-700;
}
</style>
