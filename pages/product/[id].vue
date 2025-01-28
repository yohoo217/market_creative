<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '~/stores/product'
import type { Product } from '~/types/product'

const route = useRoute()
const productStore = useProductStore()
const products = computed(() => productStore.products)
const loading = computed(() => productStore.loading)
const error = computed(() => productStore.error)
const getAverageRating = computed(() => 4.5) // TODO: 實現實際的評分計算

// 定義評論型別
interface Comment {
  _id: string;
  content: string;
  rating: number;
  date: string;
}

// 定義產品型別
interface ProductDetail {
  name: string;
  code: string;
  price: number;
  priceNote: string;
  rating: number;
  description: string;
  dimensions: string;
  travelDistance: string;
  images: string[];
  additionalImages: string[];
  comments: Comment[];
}

// 使用 computed 來獲取產品數據
const product = computed<ProductDetail | null>(() => {
  const currentProduct = products.value.find((p: Product) => p.id === route.params.id)
  if (!currentProduct) return null

  return {
    name: currentProduct.name,
    code: currentProduct.id,
    price: currentProduct.price,
    priceNote: '建議售價(未稅)',
    rating: getAverageRating.value,
    description: currentProduct.description,
    dimensions: currentProduct.dimensions,
    travelDistance: currentProduct.travelDistance,
    images: currentProduct.images,
    additionalImages: currentProduct.additionalImages,
    comments: currentProduct.comments
  }
})

// 在組件掛載時獲取產品數據
onMounted(async () => {
  if (route.params.id) {
    await productStore.fetchProductById(route.params.id as string)
  }
})
</script>

<template>
  <div v-if="loading" class="loading">
    載入中...
  </div>
  <div v-else-if="error" class="error">
    {{ error }}
  </div>
  <div v-else-if="product" class="product-detail">
    <h1>{{ product.name }}</h1>
    <div class="product-info">
      <p>商品編號：{{ product.code }}</p>
      <p>價格：NT$ {{ product.price }} ({{ product.priceNote }})</p>
      <p>評分：{{ product.rating }}</p>
      <p>描述：{{ product.description }}</p>
      <p>尺寸規格：{{ product.dimensions }}</p>
      <p>功能規格：{{ product.travelDistance }}</p>
    </div>
    
    <div class="product-images">
      <h2>產品圖片</h2>
      <div class="main-images">
        <img v-for="(image, index) in product.images" 
             :key="index" 
             :src="image" 
             :alt="`${product.name} - 圖片 ${index + 1}`" />
      </div>
      
      <h2>其他圖片</h2>
      <div class="additional-images">
        <img v-for="(image, index) in product.additionalImages" 
             :key="index" 
             :src="image" 
             :alt="`${product.name} - 附加圖片 ${index + 1}`" />
      </div>
    </div>
    
    <div class="product-comments">
      <h2>商品評論</h2>
      <div v-for="comment in product.comments" :key="comment._id" class="comment">
        <p>{{ comment.content }}</p>
        <p>評分：{{ comment.rating }}</p>
        <p>時間：{{ new Date(comment.date).toLocaleDateString() }}</p>
      </div>
    </div>
  </div>
  <div v-else class="not-found">
    找不到該產品
  </div>
</template>

<style scoped>
.loading, .error {
  text-align: center;
  padding: 50px;
  font-size: 1.2em;
  color: #666;
}

.error {
  color: #ff4444;
}

.product-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.product-info {
  margin: 20px 0;
}

.product-images {
  margin: 20px 0;
}

.main-images, .additional-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 10px 0;
}

.main-images img, .additional-images img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
}

.product-comments {
  margin: 20px 0;
}

.comment {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin: 10px 0;
}

.not-found {
  text-align: center;
  padding: 50px;
  font-size: 1.2em;
  color: #666;
}
</style> 