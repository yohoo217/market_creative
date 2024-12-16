<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
      class="h-full"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProductCard from '~/components/common/ProductCard.vue'

// Mock data - 之後會從 API 獲取
const products = ref([
  {
    id: '1',
    name: '客製化前輪',
    description: '專業代工製作，品質保證',
    price: 3000,
    category: '客製化零件',
    images: [
      'https://picsum.photos/seed/wheel1/400/300',
      'https://picsum.photos/seed/wheel2/400/300',
      'https://picsum.photos/seed/wheel3/400/300',
      'https://picsum.photos/seed/wheel4/400/300',
      'https://picsum.photos/seed/wheel5/400/300'
    ]
  },
  {
    id: '2',
    name: '客製化車架',
    description: '輕量化設計，堅固耐用',
    price: 8000,
    category: '車架',
    images: [
      'https://picsum.photos/seed/frame1/400/300',
      'https://picsum.photos/seed/frame2/400/300',
      'https://picsum.photos/seed/frame3/400/300',
      'https://picsum.photos/seed/frame4/400/300',
      'https://picsum.photos/seed/frame5/400/300'
    ]
  }
])
</script>