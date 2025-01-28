<template>
  <div class="engineer-section">
    <!-- 載入狀態 -->
    <div v-if="engineerStore.loading" 
         class="flex justify-center items-center py-8">
      <i class="pi pi-spinner animate-spin text-4xl text-primary-500"></i>
    </div>

    <!-- 錯誤提示 -->
    <div v-else-if="engineerStore.error" 
         class="text-center py-8 text-red-500">
      {{ engineerStore.error }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="engineer in engineers" 
           :key="engineer.id" 
           class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center space-x-4">
          <img :src="engineer.avatar" 
               :alt="engineer.name" 
               class="w-16 h-16 rounded-full object-cover">
          <div>
            <h3 class="text-lg font-semibold">{{ engineer.name }}</h3>
            <div class="flex items-center mt-1">
              <Rating :modelValue="engineer.rating" readonly :cancel="false" />
              <span class="text-gray-600 ml-2">{{ engineer.rating }}</span>
            </div>
          </div>
        </div>
        
        <div class="mt-4">
          <div class="flex flex-wrap gap-2">
            <span v-for="specialty in engineer.specialties" 
                  :key="specialty"
                  class="px-3 py-1 bg-gray-100 rounded-full text-sm">
              {{ specialty }}
            </span>
          </div>
        </div>

        <div class="mt-4 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">完成專案</span>
            <span class="font-medium">{{ engineer.completedProjects }} 個</span>
          </div>
        </div>

        <div class="mt-6 flex justify-between items-center">
          <span class="text-sm px-3 py-1 rounded-full" 
                :class="engineer.isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
            {{ engineer.isVerified ? '已認證' : '未認證' }}
          </span>
          <button class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  @click="contactEngineer(engineer.id)">
            聯絡工程師
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useEngineerStore } from '~/stores/engineer'
import { useRouter } from 'vue-router'

const router = useRouter()
const engineerStore = useEngineerStore()

onMounted(async () => {
  await engineerStore.fetchEngineers()
})

// 使用 getter 獲取所有工程師
const engineers = computed(() => engineerStore.getEngineers)

// 聯絡工程師
const contactEngineer = (engineerId: string) => {
  router.push(`/engineers/${engineerId}/contact`)
}
</script>

