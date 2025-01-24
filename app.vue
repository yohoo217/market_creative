<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onErrorCaptured } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductStore } from '~/stores/products'

// 初始化 store
const productStore = useProductStore()
const { error } = storeToRefs(productStore)

onMounted(() => {
  console.log('App mounted, Pinia store initialized')
})

onErrorCaptured((err, instance, info) => {
  console.error('Captured error:', err)
  console.log('Error instance:', instance)
  console.log('Error info:', info)
  // 返回 false 以防止錯誤繼續傳播
  return false
})
</script>
