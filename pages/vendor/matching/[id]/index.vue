<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-5xl">
      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
      </div>

      <div v-else-if="error" class="text-center py-8 text-red-500">
        {{ error }}
      </div>

      <template v-else-if="project">
        <!-- 返回按鈕 -->
        <div class="mb-6">
          <button @click="router.back()" class="text-gray-600 hover:text-gray-900 flex items-center">
            <i class="fas fa-arrow-left mr-2"></i> 返回列表
          </button>
        </div>

        <!-- 專案基本信息 -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div class="flex flex-col md:flex-row">
            <div class="md:w-1/2 h-64 md:h-auto">
              <img :src="project.image || '/images/placeholder.png'" :alt="project.name" class="w-full h-full object-cover">
            </div>
            <div class="md:w-1/2 p-6">
              <div class="flex justify-between items-start">
                <div>
                  <h1 class="text-2xl font-bold">{{ project.name }}</h1>
                  <div class="mt-2 flex items-center">
                    <span class="bg-primary-500 text-white px-2 py-1 rounded-full text-xs">
                      {{ project.category }}
                    </span>
                    <span class="ml-3 text-gray-500 text-sm">
                      提出於 {{ formatDate(project.createdAt) }}
                    </span>
                  </div>
                </div>
                <span :class="getStatusClass(project.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                  {{ getStatusText(project.status) }}
                </span>
              </div>

              <p class="mt-4 text-gray-600">{{ project.description }}</p>

              <div class="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <div class="text-gray-500 text-sm">預估成本</div>
                  <div class="font-semibold">${{ formatNumber(project.estimatedCost) }}</div>
                </div>
                <div>
                  <div class="text-gray-500 text-sm">預估時間</div>
                  <div class="font-semibold">{{ project.estimatedTime }} 週</div>
                </div>
                <div>
                  <div class="text-gray-500 text-sm">創意者</div>
                  <div class="font-semibold">{{ project.creator.name }}</div>
                </div>
                <div>
                  <div class="text-gray-500 text-sm">工程師</div>
                  <div class="font-semibold">{{ project.engineer.name }}</div>
                </div>
              </div>

              <div class="mt-6">
                <button @click="initiateMatching" 
                        class="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg transition-colors">
                  開始媒合流程
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 專案詳細信息 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <!-- 創意詳情 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-bold mb-4 flex items-center">
              <i class="fas fa-lightbulb text-yellow-500 mr-2"></i> 創意詳情
            </h2>
            <div class="space-y-4">
              <p>{{ project.ideaDetails || '暫無詳細描述' }}</p>
              <div v-if="project.features && project.features.length">
                <div class="text-gray-600 font-medium mb-2">核心功能</div>
                <ul class="list-disc list-inside space-y-1">
                  <li v-for="(feature, index) in project.features" :key="index" class="text-gray-600">
                    {{ feature }}
                  </li>
                </ul>
              </div>
              <div v-if="project.targetUsers">
                <div class="text-gray-600 font-medium mb-2">目標用戶</div>
                <p class="text-gray-600">{{ project.targetUsers }}</p>
              </div>
            </div>
          </div>

          <!-- 工程師詳情 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-bold mb-4 flex items-center">
              <i class="fas fa-cogs text-blue-500 mr-2"></i> 工程師詳情
            </h2>
            <div class="flex items-center mb-4">
              <img :src="project.engineer.avatar || '/images/default-avatar.png'" alt="工程師頭像" 
                   class="w-12 h-12 rounded-full mr-3">
              <div>
                <div class="font-medium">{{ project.engineer.name }}</div>
                <div class="text-sm text-gray-500">{{ formatExperience(project.engineer.experience) }}</div>
              </div>
            </div>
            <div class="space-y-4">
              <div v-if="project.engineer.skills && project.engineer.skills.length">
                <div class="text-gray-600 font-medium mb-2">技術技能</div>
                <div class="flex flex-wrap gap-2">
                  <span v-for="(skill, index) in project.engineer.skills" :key="index"
                        class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {{ skill }}
                  </span>
                </div>
              </div>
              <div v-if="project.engineer.rating">
                <div class="text-gray-600 font-medium mb-2">評價</div>
                <div class="flex items-center">
                  <div class="flex">
                    <i v-for="n in 5" :key="n" 
                       :class="[
                         'fas fa-star mr-1', 
                         n <= Math.round(project.engineer.rating) ? 'text-yellow-400' : 'text-gray-300'
                       ]"></i>
                  </div>
                  <span class="ml-2 text-gray-600">{{ project.engineer.rating.toFixed(1) }}/5</span>
                </div>
              </div>
              <div v-if="project.implementationPlan">
                <div class="text-gray-600 font-medium mb-2">實現方案</div>
                <p class="text-gray-600">{{ project.implementationPlan }}</p>
              </div>
            </div>
          </div>

          <!-- 專案時間線 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-bold mb-4 flex items-center">
              <i class="fas fa-calendar-alt text-green-500 mr-2"></i> 專案時間線
            </h2>
            <div class="space-y-4">
              <div class="relative pl-6 pb-4 border-l-2 border-gray-200">
                <div class="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
                <div class="font-medium">創意提出</div>
                <div class="text-sm text-gray-500">{{ formatDate(project.createdAt) }}</div>
              </div>
              <div class="relative pl-6 pb-4 border-l-2 border-gray-200">
                <div class="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
                <div class="font-medium">工程師配對</div>
                <div class="text-sm text-gray-500">{{ formatDate(project.engineerAssignedAt) }}</div>
              </div>
              <div class="relative pl-6 pb-4 border-l-2 border-gray-200">
                <div class="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-gray-300"></div>
                <div class="font-medium">廠商媒合</div>
                <div class="text-sm text-gray-500">尚未媒合</div>
              </div>
              <div class="relative pl-6">
                <div class="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-gray-300"></div>
                <div class="font-medium">開始募資</div>
                <div class="text-sm text-gray-500">尚未開始</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 相關文件和下一步 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <!-- 相關檔案 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-bold mb-4">相關檔案</h2>
            <div v-if="project.attachments && project.attachments.length">
              <div v-for="(file, index) in project.attachments" :key="index" 
                   class="flex items-center justify-between p-3 border-b last:border-0">
                <div class="flex items-center">
                  <i class="fas fa-file-alt text-gray-400 mr-3"></i>
                  <div>
                    <div class="font-medium">{{ file.name }}</div>
                    <div class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</div>
                  </div>
                </div>
                <button class="text-primary-500 hover:text-primary-700">
                  <i class="fas fa-download"></i>
                </button>
              </div>
            </div>
            <div v-else class="text-gray-500 text-center py-4">
              暫無相關檔案
            </div>
          </div>

          <!-- 下一步行動 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-bold mb-4">下一步行動</h2>
            <div class="space-y-4">
              <p class="text-gray-600">
                作為廠商，您可以為此創意專案提供媒合提案，幫助創意實現並從中獲利。
              </p>
              <ul class="space-y-2">
                <li class="flex items-start">
                  <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                  <span>制定募資計劃和預算</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                  <span>確認產品市場和目標用戶</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                  <span>建立生產和分銷計劃</span>
                </li>
              </ul>
              <button @click="initiateMatching" 
                      class="w-full mt-4 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg transition-colors">
                開始媒合流程
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { UserRole } from '~/server/models/User'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 檢查用戶是否為廠商
if (!userStore.isLoggedIn || !userStore.hasRole(UserRole.VENDOR)) {
  router.push('/login?redirect=' + route.fullPath)
}

// 狀態和數據
const projectId = computed(() => route.params.id as string)
const loading = ref(true)
const error = ref<string | null>(null)
const project = ref<any>(null)

// 獲取專案詳情
const fetchProjectDetails = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch(`/api/vendor/matching-projects/${projectId.value}`)
    const data = await response.json()
    
    if (data.success) {
      project.value = data.data
    } else {
      error.value = data.message || '無法獲取專案詳情'
    }
  } catch (err: any) {
    error.value = err.message || '獲取專案詳情時發生錯誤'
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '未知'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 格式化數字
const formatNumber = (num: number) => {
  if (!num && num !== 0) return '0'
  return new Intl.NumberFormat().format(num)
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (!bytes) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

// 格式化工程師經驗
const formatExperience = (years: number) => {
  if (!years) return '新手工程師'
  if (years === 1) return '1 年經驗'
  return `${years} 年經驗`
}

// 獲取狀態類
const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    'idea': 'bg-blue-100 text-blue-800',
    'development': 'bg-yellow-100 text-yellow-800',
    'matching': 'bg-purple-100 text-purple-800',
    'fundraising': 'bg-green-100 text-green-800',
    'completed': 'bg-gray-100 text-gray-800'
  }
  
  return statusMap[status] || 'bg-gray-100 text-gray-800'
}

// 獲取狀態文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'idea': '創意階段',
    'development': '開發階段',
    'matching': '媒合階段',
    'fundraising': '募資階段',
    'completed': '已完成'
  }
  
  return statusMap[status] || status
}

// 開始媒合
const initiateMatching = () => {
  router.push(`/vendor/matching/${projectId.value}/create`)
}

// 模擬數據（在實際API完成前使用）
const useSimulatedData = async () => {
  // 如果沒有真實的API，使用模擬數據
  project.value = {
    _id: projectId.value,
    name: '智能可摺疊電動自行車',
    description: '一款輕便的可折疊電動自行車，具有智能導航功能和長效電池，適合城市通勤和短途旅行。',
    category: '交通工具',
    status: 'development',
    image: 'https://source.unsplash.com/random/800x600/?electric-bike',
    estimatedCost: 120000,
    estimatedTime: 12,
    createdAt: '2023-11-15T08:00:00Z',
    engineerAssignedAt: '2023-12-10T10:30:00Z',
    features: [
      '輕量化鋁合金車架，可在10秒內完成折疊',
      '內置GPS導航和智能手機連接',
      '最高時速25公里，單次充電續航50公里',
      '智能防盜系統和遠程鎖定功能'
    ],
    targetUsers: '城市通勤者、短途旅行者、自行車愛好者',
    ideaDetails: '這款自行車旨在解決城市通勤的「最後一公里」問題，結合公共交通與私人出行的優勢。輕便的折疊設計使其可以輕鬆攜帶上公共交通工具，智能連接功能則提供了導航和數據追踪能力。',
    implementationPlan: '我計劃使用輕量化材料設計車架，集成智能控制系統，並開發配套的手機應用程序，實現自行車與用戶手機的無縫連接。電池系統將採用最新的高能鋰電池技術，確保長續航和快速充電。',
    attachments: [
      { name: '產品設計草圖.pdf', size: 2500000 },
      { name: '技術規格說明.docx', size: 1200000 },
      { name: '市場調研報告.xlsx', size: 800000 }
    ],
    creator: {
      _id: 'creator123',
      name: '林創意',
      avatar: 'https://source.unsplash.com/random/100x100/?portrait'
    },
    engineer: {
      _id: 'engineer456',
      name: '王工程',
      avatar: 'https://source.unsplash.com/random/100x100/?engineer',
      experience: 5,
      skills: ['機械設計', '電子工程', '嵌入式系統', '移動應用開發'],
      rating: 4.8
    }
  }
  
  loading.value = false
}

// 頁面加載時獲取數據
onMounted(async () => {
  try {
    await fetchProjectDetails()
  } catch (err) {
    // 如果API調用失敗，使用模擬數據
    console.error('使用模擬數據:', err)
    await useSimulatedData()
  }
})
</script>

<style scoped>
/* 頁面樣式 */
</style> 