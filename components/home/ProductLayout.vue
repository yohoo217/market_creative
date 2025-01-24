<template>
  <div class="product-layout">
    <!-- 商品标题和评分 -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-xl font-semibold">{{ product.name }}</h3>
        <p class="text-gray-600">{{ product.code }}</p>
        <p class="text-lg font-medium text-primary-600 mt-1">
          $ {{ product.price }} NTD/ PCS
          <span class="text-sm text-gray-500 ml-2">{{ product.priceNote }}</span>
        </p>
      </div>
      <div class="flex items-center">
        <div class="flex gap-1">
          <span v-for="i in 3" :key="i" 
                class="text-2xl"
                :class="i <= product.rating ? 'text-yellow-400' : 'text-gray-300'">
            ★
          </span>
        </div>
      </div>
    </div>

    <!-- 商品描述 -->
    <div class="mb-6">
      <p class="text-sm text-gray-700 mb-2">Description: {{ product.description }}</p>
      <p class="text-sm text-gray-700">Dimensions: {{ product.dimensions }}</p>
      <p class="text-sm text-gray-700">Travel distance: {{ product.travelDistance }}</p>
    </div>

    <!-- 图片网格 -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div v-for="(image, index) in product.images" :key="index" 
           class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img :src="image" :alt="'Product image ' + (index + 1)" 
             class="w-full h-full object-cover">
      </div>
    </div>

    <!-- 购买按钮 -->
    <div class="text-right mb-8">
      <NuxtLink 
        :to="`/crowdfunding/JA024014-001`"
        class="inline-block bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
      >
        贊助專案
      </NuxtLink>
    </div>

    <!-- 斜线分隔的图片展示 -->
    <div class="relative w-full h-[300px] mb-8 overflow-hidden">
      <div class="flex h-full">
        <!-- 图片容器 -->
        <div class="relative w-full h-full">
          <!-- 图片1 -->
          <div class="absolute inset-0 clip-path-1">
            <div class="relative w-full h-full">
              <img :src="product.additionalImages[0]" alt="图片一" class="w-full h-full object-cover">
              <div class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
              </div>
            </div>
          </div>
          
          <!-- 图片2 -->
          <div class="absolute inset-0 clip-path-2">
            <div class="relative w-full h-full">
              <img :src="product.additionalImages[1]" alt="图片二" class="w-full h-full object-cover">
              <div class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
              </div>
            </div>
          </div>
          
          <!-- 图片3 -->
          <div class="absolute inset-0 clip-path-3">
            <div class="relative w-full h-full">
              <img :src="product.additionalImages[2]" alt="图片三" class="w-full h-full object-cover">
              <div class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 评论区域 -->
    <ProductComments />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ProductComments from './ProductComments.vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '~/stores/products'
import { storeToRefs } from 'pinia'

// 獲取路由實例
const router = useRouter()
const productStore = useProductStore()

// 使用 storeToRefs 來保持響應性
const { products, loading, error } = storeToRefs(productStore)
const { addProduct } = productStore

// 在組件掛載時獲取產品數據
onMounted(async () => {
  // 暫時使用本地數據模擬
  addProduct({
    id: 'A0001',
    name: '機械螢幕支架',
    description: '這款機械螢幕支架採用高強度鋁合金材質，提供穩固的支撐與靈活的調節功能，適用於多種尺寸的顯示器。它支援360度旋轉、上下升降與傾斜角度調整，幫助您輕鬆打造符合人體工學的工作空間，提升效率與舒適度',
    image: 'picture/1E668206-82A3-4E55-8523-3D93D3FE014A.png',
    price: 760
  })
})

// 導航函數
const navigateToFunding = () => {
  const productId = 'A0001'
  router.push(`/crowdfunding/${productId}`)
}

// 使用 computed 來獲取產品數據
const product = computed(() => {
  const currentProduct = products.value[0]
  return {
    name: currentProduct?.name || '',
    code: 'A0001',
    price: currentProduct?.price || 0,
    priceNote: '建議售價(未稅)',
    rating: 2,
    description: currentProduct?.description || '',
    dimensions: ' 基座 15 cm，支臂長度 45 cm，高度範圍 40 cm',
    travelDistance: '垂直 20 cm，水平 60 cm，傾斜 +85°~-15°，旋轉 360°',
    images: [
      'picture/1E668206-82A3-4E55-8523-3D93D3FE014A.png',
      'picture/5CE25C84-4EE7-4275-ABB9-03137C1C312D.png',
      'picture/5F82A9AA-E874-4293-8AF7-F5B59896A39B.png',
      'picture/6B687B74-1CCA-422F-B589-7A19D72A50EE.png',
      'picture/1E668206-82A3-4E55-8523-3D93D3FE014A.png',
      'picture/944D99A0-CE05-4B61-92B1-3460C0860AAD.png',
    ],
    additionalImages: [
      'picture/123.png',
      'picture/456.png',
      'picture/1415.png'
    ]
  }
})
</script>

<style scoped>
.product-layout {
  max-width: 800px;
  margin: 0 auto;
}

/* 使用clip-path创建斜线分隔效果 */
.clip-path-1 {
  clip-path: polygon(0 0, 32% 0, 35% 100%, 0 100%);
}

.clip-path-2 {
  clip-path: polygon(32% 0, 65% 0, 68% 100%, 35% 100%);
}

.clip-path-3 {
  clip-path: polygon(65% 0, 100% 0, 100% 100%, 68% 100%);
}
</style>