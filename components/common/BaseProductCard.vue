<template>
  <BaseCard 
    class="base-product-card" 
    :elevation="elevation" 
    :hover-effect="hoverEffect"
  >
    <template #header>
      <div class="product-image-container">
        <slot name="image">
          <img 
            :src="defaultImage || 'https://picsum.photos/seed/1/400/300'" 
            :alt="product.name" 
            class="product-image" 
          />
        </slot>
      </div>
    </template>
    
    <template #title>
      <slot name="title">
        <h3 class="product-title">{{ product.name }}</h3>
      </slot>
    </template>
    
    <slot>
      <p v-if="product.description" class="product-description">
        {{ product.description }}
      </p>
      
      <div class="product-details">
        <slot name="details">
          <div class="flex justify-between items-center">
            <span class="product-price">NT$ {{ formatNumber(product.price) }}</span>
            <span class="product-category">{{ product.category }}</span>
          </div>
        </slot>
      </div>
    </slot>
    
    <template #footer>
      <slot name="footer">
        <div class="product-actions">
          <Button 
            :label="viewLabel" 
            class="p-button-outlined" 
            @click="handleViewClick"
          />
          <Button 
            v-if="showLikeButton"
            icon="pi pi-heart" 
            class="p-button-rounded p-button-text" 
            @click="handleLikeClick"
          />
        </div>
      </slot>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import BaseCard from '~/components/base/BaseCard.vue';

interface ProductBase {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image?: string;
  [key: string]: any;
}

const props = defineProps<{
  product: ProductBase;
  defaultImage?: string;
  elevation?: number;
  hoverEffect?: boolean;
  viewLabel?: string;
  showLikeButton?: boolean;
}>();

const emit = defineEmits<{
  (e: 'view', product: ProductBase): void;
  (e: 'like', product: ProductBase): void;
}>();

const handleViewClick = () => {
  emit('view', props.product);
};

const handleLikeClick = () => {
  emit('like', props.product);
};

// 提供格式化數字的功能
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('zh-TW').format(num);
};

// 設置預設值
const defaultProps = {
  elevation: 2,
  hoverEffect: true,
  viewLabel: '查看詳情',
  showLikeButton: true
};

// 合併預設值
const finalProps = { ...defaultProps, ...props };
</script>

<style scoped>
.base-product-card {
  width: 100%;
  height: 100%;
}

.product-image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.base-product-card:hover .product-image {
  transform: scale(1.05);
}

.product-title {
  @apply text-lg font-bold text-gray-800;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-description {
  @apply text-sm text-gray-600 my-2;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.product-details {
  @apply mt-4;
}

.product-price {
  @apply text-lg font-bold text-primary-600;
}

.product-category {
  @apply text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full;
}

.product-actions {
  @apply flex justify-between items-center;
}
</style> 