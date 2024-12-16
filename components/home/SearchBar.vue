<template>
  <div class="w-full max-w-3xl mx-auto">
    <div class="bg-white rounded-lg shadow-lg p-2 flex items-center">
      <span class="p-input-icon-left flex-grow">
        <i class="pi pi-search" />
        <InputText
          v-model="searchQuery"
          placeholder="關鍵字搜尋專案或案例"
          class="w-full border-none"
        />
      </span>
      <Button
        icon="pi pi-search"
        class="ml-2"
        @click="handleSearch"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')

const handleSearch = () => {
  // TODO: Implement search functionality
  console.log('Searching for:', searchQuery.value)
}
</script>