<template>
  <div 
    class="base-card" 
    :class="[
      elevationClass, 
      {'hover-effect': hoverEffect}
    ]"
  >
    <div v-if="$slots.header" class="base-card-header">
      <slot name="header"></slot>
    </div>
    
    <div class="base-card-body">
      <div v-if="$slots.title" class="base-card-title">
        <slot name="title"></slot>
      </div>
      
      <div class="base-card-content">
        <slot></slot>
      </div>
    </div>
    
    <div v-if="$slots.footer" class="base-card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  /**
   * 陰影效果級別 (0-5)
   */
  elevation: {
    type: Number,
    default: 1,
    validator: (value: number) => value >= 0 && value <= 5
  },
  /**
   * 是否啟用懸停效果
   */
  hoverEffect: {
    type: Boolean,
    default: true
  }
});

const elevationClass = computed(() => `elevation-${props.elevation}`);
</script>

<style>
.base-card {
  @apply bg-white rounded-lg overflow-hidden border border-gray-200;
  transition: all 0.3s ease;
}

.base-card.hover-effect:hover {
  @apply shadow-lg transform -translate-y-1;
}

.base-card-header {
  @apply w-full overflow-hidden;
}

.base-card-body {
  @apply p-4;
}

.base-card-title {
  @apply text-xl font-bold mb-2;
}

.base-card-content {
  @apply text-gray-700;
}

.base-card-footer {
  @apply p-4 border-t border-gray-200;
}

/* 陰影級別 */
.elevation-0 { @apply shadow-none; }
.elevation-1 { @apply shadow-sm; }
.elevation-2 { @apply shadow; }
.elevation-3 { @apply shadow-md; }
.elevation-4 { @apply shadow-lg; }
.elevation-5 { @apply shadow-xl; }
</style> 