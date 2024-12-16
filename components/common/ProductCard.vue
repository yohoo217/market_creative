<template>
  <Card class="product-card">
    <template #header>
      <div class="relative overflow-hidden">
        <ImageGallery :images="productImages" />
      </div>
    </template>
    <template #title>
      {{ product.name }}
    </template>
    <template #content>
      <p class="text-gray-600 mb-4">{{ product.description }}</p>
      <div class="flex justify-between items-center">
        <span class="text-xl font-bold text-primary-600">NT$ {{ product.price }}</span>
        <span class="text-sm text-gray-500">{{ product.category }}</span>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between items-center">
        <Button label="查看詳情" class="p-button-outlined" />
        <Button icon="pi pi-heart" class="p-button-rounded p-button-text" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import ImageGallery from './ImageGallery.vue'
import { computed } from 'vue'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  images?: string[]
}

const props = defineProps<{
  product: Product
}>()

// 如果產品沒有圖片，使用預設圖片
const productImages = computed(() => {
  if (props.product.images && props.product.images.length > 0) {
    return props.product.images
  }
  // 返回預設圖片數組
  return [
    'https://picsum.photos/seed/1/400/300',
    'https://picsum.photos/seed/2/400/300',
    'https://picsum.photos/seed/3/400/300'
  ]
})
</script>

<style scoped>
.product-card {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  @apply transition-all duration-300 hover:shadow-xl;
}

.product-card :deep(.p-card-header) {
  padding: 0;
  margin: 0;
  overflow: hidden;
}
</style>