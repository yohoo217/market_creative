<template>
  <div class="product-layout">
    <!-- 如果是產品詳情頁面 -->
    <template v-if="route.params.id">
      <!-- 商品標題和評分 -->
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
            <span v-for="i in 5" :key="i" 
                  class="text-2xl"
                  :class="i <= (product?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'">
              ★
            </span>
          </div>
          <span class="ml-2 text-sm text-gray-600">({{ product?.comments?.length || 0 }} 評論)</span>
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
          :to="`/crowdfunding/${product.code}`"
          class="inline-block bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          贊助專案
        </NuxtLink>
      </div>

      <!-- 斜线分隔的图片展示 -->
      <div class="relative w-full h-[300px] mb-8 overflow-hidden">
        <div class="flex h-full">
          <div class="relative w-full h-full">
            <div v-for="(image, index) in product.additionalImages?.slice(0, 3)" 
                 :key="index"
                 :class="`absolute inset-0 clip-path-${index + 1}`">
              <div class="relative w-full h-full">
                <img :src="image" :alt="`圖片${index + 1}`" class="w-full h-full object-cover">
                <div class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 评论区域 -->
      <ProductComments 
        v-if="product.code" 
        :comments="product.comments || []"
        @add-comment="addComment"
      />
    </template>

    <!-- 如果是首頁熱門作品展示 -->
    <template v-else>
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- 產品標題和評分 -->
        <div class="p-6 border-b">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-2xl font-bold text-gray-900">{{ product.name }}</h3>
              <p class="text-lg font-medium text-primary-600 mt-2">
                $ {{ product.price }} NTD/ PCS
                <span class="text-sm text-gray-500 ml-2">{{ product.priceNote }}</span>
              </p>
            </div>
            <div class="flex items-center">
              <div class="flex gap-1">
                <span v-for="i in 5" :key="i" 
                      class="text-2xl"
                      :class="i <= (product?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'">
                  ★
                </span>
              </div>
              <span class="ml-2 text-sm text-gray-600">({{ product?.comments?.length || 0 }} 評論)</span>
            </div>
          </div>
        </div>

        <!-- 產品圖片展示 -->
        <div class="relative aspect-video">
          <div class="grid grid-cols-3 h-full">
            <div v-for="(image, index) in product.images?.slice(0, 3)" 
                 :key="index"
                 class="relative h-full">
              <img :src="image" 
                   :alt="`${product.name} - 圖片 ${index + 1}`"
                   class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity"></div>
            </div>
          </div>
        </div>

        <!-- 產品詳細信息 -->
        <div class="p-6 space-y-4">
          <div>
            <h4 class="text-lg font-semibold mb-2">產品描述</h4>
            <p class="text-gray-700">{{ product.description }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-semibold mb-1">尺寸規格</h4>
              <p class="text-gray-700">{{ product.dimensions }}</p>
              <p class="text-gray-700">{{ product.travelDistance }}</p>
            </div>
          </div>
        </div>

        <!-- 最新評論 -->
        <div class="p-6 bg-gray-50">
          <h4 class="text-lg font-semibold mb-4">最新評論</h4>
          <div class="space-y-4">
            <div v-for="(comment, index) in product.comments" :key="index"
                 class="bg-white p-4 rounded-lg shadow-sm">
              <div class="flex items-start space-x-4">
                <!-- 用戶頭貼 -->
                <div class="flex-shrink-0">
                  <img :src="comment.userAvatar || '/user/default-avatar.png'"
                       :alt="comment.user"
                       class="w-12 h-12 rounded-full object-cover border-2 border-gray-200">
                </div>
                <!-- 評論內容 -->
                <div class="flex-grow">
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <span class="font-medium text-gray-900">{{ comment.user }}</span>
                      <p class="text-sm text-gray-500">
                        {{ new Date(comment.date).toLocaleDateString() }}
                      </p>
                    </div>
                    <div class="flex flex-col items-center">
                      <button 
                        class="text-2xl transition-transform hover:scale-110 focus:outline-none"
                        :class="comment.likes ? 'text-red-500' : 'text-gray-400'"
                        @click="likeComment(index)"
                      >
                        ♥
                      </button>
                      <span class="text-sm text-gray-600 mt-1">{{ comment.likes || 0 }}</span>
                    </div>
                  </div>
                  <p class="text-gray-700">{{ comment.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 查看詳情按鈕 -->
        <div class="p-6 border-t text-center">
          <NuxtLink 
            :to="`/product/${product.code}`"
            class="inline-block bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            查看完整資訊
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ProductComments from './ProductComments.vue'
import { useRouter, useRoute } from 'vue-router'
import { useProductStore } from '~/stores/products'
import { storeToRefs } from 'pinia'

interface Comment {
  user: string
  userAvatar?: string
  content: string
  rating: number
  likes?: number  // 添加愛心數計數
  date: Date
}

interface Product {
  id: string
  name: string
  description: string
  image: string
  price: number
  rating?: number
  dimensions?: string
  travelDistance?: string
  images?: string[]
  additionalImages?: string[]
  comments?: Comment[]
}

// 獲取路由實例
const router = useRouter()
const route = useRoute()
const productStore = useProductStore()

// 使用 storeToRefs 來保持響應性
const { products, loading, error } = storeToRefs(productStore)
const { fetchProduct } = productStore

// 在組件掛載時獲取產品數據
onMounted(async () => {
  await productStore.fetchProducts()
})

// 計算平均評分
const getAverageRating = computed((): number => {
  const currentProduct = products.value.find(p => p.id === route.params.id)
  const comments = currentProduct?.comments || []
  if (comments.length === 0) return 0
  const sum = comments.reduce((acc: number, curr: Comment) => acc + curr.rating, 0)
  return Math.round(sum / comments.length)
})

// 添加評論
const addComment = async (commentData: { content: string; rating: number }) => {
  if (!route.params.id) return
  
  try {
    const newComment: Comment = {
      user: 'Anonymous',
      userAvatar: '/user/default-avatar.png',
      content: commentData.content,
      rating: commentData.rating,
      date: new Date()
    }
    
    await productStore.addProductComment(route.params.id.toString(), newComment)
    
    // 重新獲取產品數據以更新評論
    await fetchProduct(route.params.id.toString())
  } catch (error) {
    console.error('添加評論失敗:', error)
  }
}

// 獲取評分最高的產品
const topRatedProduct = computed(() => {
  if (!products.value.length) return null;
  
  return products.value.reduce((highest, current) => {
    const currentComments = current?.comments || [];
    const highestComments = highest?.comments || [];
    
    const currentRating = currentComments.length 
      ? currentComments.reduce((sum, comment) => sum + (comment?.rating || 0), 0) / currentComments.length 
      : 0;
      
    const highestRating = highestComments.length 
      ? highestComments.reduce((sum, comment) => sum + (comment?.rating || 0), 0) / highestComments.length 
      : 0;
    
    return currentRating > highestRating ? current : highest;
  }, products.value[0]);
});

// 獲取最新的評論（顯示最新的3則）
const latestComments = computed(() => {
  const comments = topRatedProduct.value?.comments || [];
  return [...comments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
});

// 使用 computed 來獲取產品數據
const product = computed((): {
  name: string
  code: string
  price: number
  priceNote: string
  rating: number
  description: string
  dimensions: string
  travelDistance: string
  images: string[]
  additionalImages: string[]
  comments: Comment[]
} => {
  // 如果是在產品詳情頁面
  if (route.params.id) {
    const currentProduct = products.value.find(p => p.id === route.params.id)
    return {
      name: currentProduct?.name || '',
      code: currentProduct?.id || '',
      price: currentProduct?.price || 0,
      priceNote: '建議售價(未稅)',
      rating: getAverageRating.value,
      description: currentProduct?.description || '',
      dimensions: currentProduct?.dimensions || '暫無資料',
      travelDistance: currentProduct?.travelDistance || '暫無資料',
      images: currentProduct?.images || [],
      additionalImages: currentProduct?.additionalImages || [],
      comments: currentProduct?.comments || []
    }
  }
  
  // 如果是在首頁顯示熱門作品，使用評分最高的產品
  const top = topRatedProduct.value;
  const topComments = top?.comments || [];
  return {
    name: top?.name || '暫無資料',
    code: top?.id || '',
    price: top?.price || 0,
    priceNote: '建議售價(未稅)',
    rating: topComments.length 
      ? topComments.reduce((sum, comment) => sum + (comment?.rating || 0), 0) / topComments.length 
      : 0,
    description: top?.description || '暫無資料',
    dimensions: top?.dimensions || '暫無資料',
    travelDistance: top?.travelDistance || '暫無資料',
    images: top?.images || [],
    additionalImages: top?.additionalImages || [],
    comments: latestComments.value
  }
})

// 獲取所有產品列表用於首頁展示
const allProducts = computed(() => products.value)

// 添加點讚功能
const likeComment = async (commentIndex: number) => {
  if (!product.value.comments?.[commentIndex]) return;
  
  try {
    const comment = product.value.comments[commentIndex];
    comment.likes = (comment.likes || 0) + 1;
    
    // 如果需要將點讚狀態保存到後端，可以在這裡添加 API 調用
    // await productStore.updateCommentLikes(product.value.code, commentIndex, comment.likes);
    
  } catch (error) {
    console.error('點讚失敗:', error);
  }
}
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