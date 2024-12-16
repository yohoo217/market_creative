<template>
  <div class="image-gallery-container relative w-full h-[300px] mb-4">
    <div class="image-gallery flex items-center justify-center gap-2 h-full">
      <div
        v-for="(image, index) in displayImages"
        :key="index"
        class="gallery-item absolute transition-all duration-300 ease-in-out cursor-pointer"
        :class="[
          `gallery-position-${index}`,
          { 'z-50': hoveredIndex === index }
        ]"
        @mouseenter="handleHover(index)"
        @mouseleave="handleLeave"
      >
        <img
          :src="image"
          :alt="'Product image ' + (index + 1)"
          class="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300"
          :class="{ 'scale-110': hoveredIndex === index }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  images: string[]
}>()

const hoveredIndex = ref<number | null>(null)

// 只顯示最多5張圖片
const displayImages = computed(() => {
  return props.images.slice(0, 5)
})

const handleHover = (index: number) => {
  hoveredIndex.value = index
}

const handleLeave = () => {
  hoveredIndex.value = null
}
</script>

<style scoped>
.image-gallery-container {
  perspective: 1000px;
}

.gallery-item {
  width: 240px;
  height: 180px;
  transform-origin: center;
  backface-visibility: hidden;
  top: 50%;
  left: 50%;
  margin-top: -90px; /* 高度的一半 */
  margin-left: -120px; /* 寬度的一半 */
}

.gallery-position-0 {
  transform: translate(-240px, 0) scale(0.8);
  z-index: 1;
}

.gallery-position-1 {
  transform: translate(-120px, 0) scale(0.9);
  z-index: 2;
}

.gallery-position-2 {
  transform: translate(0, 0) scale(1);
  z-index: 3;
}

.gallery-position-3 {
  transform: translate(120px, 0) scale(0.9);
  z-index: 2;
}

.gallery-position-4 {
  transform: translate(240px, 0) scale(0.8);
  z-index: 1;
}

.gallery-item:hover {
  transform: scale(1.1) translateZ(20px);
}

/* 確保懸停時圖片在最上層 */
.gallery-item.z-50 {
  z-index: 50;
}
</style>