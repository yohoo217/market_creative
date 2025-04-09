<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold mb-6">可媒合的創意專案</h1>
      <p class="text-gray-600 mb-8">
        作為廠商，您可以在此瀏覽所有已經配對好創意者和工程師的專案，進行媒合並啟動募資活動。
      </p>

      <div class="mb-6 flex flex-wrap gap-4">
        <div class="relative">
          <input v-model="searchQuery" type="text" placeholder="搜尋專案" 
                 class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
          <span class="absolute left-3 top-2.5 text-gray-400">
            <i class="fas fa-search"></i>
          </span>
        </div>
        <select v-model="categoryFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
          <option value="">全部類別</option>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
        <select v-model="statusFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
          <option value="">全部狀態</option>
          <option value="ready">準備媒合</option>
          <option value="matching">媒合中</option>
        </select>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
      </div>

      <div v-else-if="error" class="text-center py-8 text-red-500">
        {{ error }}
      </div>

      <div v-else-if="filteredProjects.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm">
        <div class="text-gray-500">沒有找到匹配的專案</div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="project in filteredProjects" :key="project._id" 
             class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div class="relative h-48">
            <img :src="project.image || '/images/placeholder.png'" :alt="project.name" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div class="p-4 text-white">
                <h3 class="text-xl font-semibold">{{ project.name }}</h3>
                <div class="flex items-center mt-1 text-sm">
                  <span class="bg-primary-500 text-white px-2 py-0.5 rounded-full text-xs">{{ project.category }}</span>
                  <span class="ml-2 flex items-center">
                    <i class="fas fa-user-cog mr-1"></i> {{ project.engineer.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-4">
            <p class="text-gray-600 text-sm line-clamp-2 mb-4">{{ project.description }}</p>
            
            <div class="flex justify-between items-center mb-4">
              <div>
                <div class="text-gray-500 text-sm">預估成本</div>
                <div class="font-semibold">${{ formatNumber(project.estimatedCost) }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-sm">預估時間</div>
                <div class="font-semibold">{{ project.estimatedTime }} 週</div>
              </div>
            </div>
            
            <div class="flex gap-2">
              <button @click="viewDetails(project._id)" 
                      class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg transition-colors">
                查看詳情
              </button>
              <button @click="initiateMatching(project._id)" 
                      class="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg transition-colors">
                開始媒合
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { UserRole } from '~/server/models/User'

const userStore = useUserStore()
const router = useRouter()

// 檢查用戶是否為廠商
if (!userStore.isLoggedIn || !userStore.hasRole(UserRole.VENDOR)) {
  router.push('/login?redirect=/vendor/matching')
}

// 狀態和數據
const loading = ref(true)
const error = ref<string | null>(null)
const projects = ref<any[]>([])
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')

// 固定的類別列表
const categories = [
  '智能家居', '健康科技', '穿戴設備', '辦公工具', '娛樂裝置', '廚房用品', '戶外裝備', '其他'
]

// 獲取可媒合的創意+工程師配對
const fetchMatchingProjects = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('/api/vendor/matching-projects')
    const data = await response.json()
    
    if (data.success) {
      projects.value = data.data
    } else {
      error.value = data.message || '無法獲取媒合專案列表'
    }
  } catch (err: any) {
    error.value = err.message || '獲取專案列表時發生錯誤'
  } finally {
    loading.value = false
  }
}

// 過濾專案
const filteredProjects = computed(() => {
  return projects.value.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.value.toLowerCase())
                       
    const matchesCategory = !categoryFilter.value || project.category === categoryFilter.value
    const matchesStatus = !statusFilter.value || project.matchingStatus === statusFilter.value
    
    return matchesSearch && matchesCategory && matchesStatus
  })
})

// 格式化數字
const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}

// 查看詳情
const viewDetails = (projectId: string) => {
  router.push(`/vendor/matching/${projectId}`)
}

// 開始媒合
const initiateMatching = (projectId: string) => {
  router.push(`/vendor/matching/${projectId}/create`)
}

// 頁面加載時獲取數據
onMounted(async () => {
  await fetchMatchingProjects()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  -webkit-box-orient: vertical;
}
</style> 