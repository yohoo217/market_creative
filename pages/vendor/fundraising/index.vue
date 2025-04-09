<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold mb-6">募資管理</h1>
      
      <div class="flex flex-col md:flex-row gap-6 mb-8">
        <!-- 募資統計卡片 -->
        <div class="bg-white rounded-lg shadow-sm p-6 md:w-1/3">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">募資總覽</h2>
            <span class="text-primary-500">
              <i class="fas fa-donate"></i>
            </span>
          </div>
          
          <div class="space-y-4">
            <div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">總募資項目</span>
                <span class="font-bold text-lg">{{ campaignStats.total }}</span>
              </div>
              <div class="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-primary-500" style="width: 100%"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">進行中</span>
                <span class="font-bold text-lg">{{ campaignStats.active }}</span>
              </div>
              <div class="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-green-500" :style="`width: ${(campaignStats.active / Math.max(campaignStats.total, 1)) * 100}%`"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">已完成</span>
                <span class="font-bold text-lg">{{ campaignStats.completed }}</span>
              </div>
              <div class="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-blue-500" :style="`width: ${(campaignStats.completed / Math.max(campaignStats.total, 1)) * 100}%`"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">未達標</span>
                <span class="font-bold text-lg">{{ campaignStats.failed }}</span>
              </div>
              <div class="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-red-500" :style="`width: ${(campaignStats.failed / Math.max(campaignStats.total, 1)) * 100}%`"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 募資金額統計 -->
        <div class="bg-white rounded-lg shadow-sm p-6 md:w-1/3">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">資金概覽</h2>
            <span class="text-green-500">
              <i class="fas fa-chart-line"></i>
            </span>
          </div>
          
          <div class="space-y-4">
            <div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">總目標金額</span>
                <span class="font-bold text-lg">${{ formatNumber(fundingStats.totalGoal) }}</span>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">已籌集金額</span>
                <span class="font-bold text-lg">${{ formatNumber(fundingStats.totalRaised) }}</span>
              </div>
              <div class="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-primary-500" :style="`width: ${(fundingStats.totalRaised / Math.max(fundingStats.totalGoal, 1)) * 100}%`"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">平均達成率</span>
                <span class="font-bold text-lg">{{ Math.round((fundingStats.totalRaised / Math.max(fundingStats.totalGoal, 1)) * 100) }}%</span>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">贊助人數</span>
                <span class="font-bold text-lg">{{ fundingStats.totalBackers }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 快速操作 -->
        <div class="bg-white rounded-lg shadow-sm p-6 md:w-1/3">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">快速操作</h2>
            <span class="text-blue-500">
              <i class="fas fa-bolt"></i>
            </span>
          </div>
          
          <div class="space-y-3">
            <NuxtLink to="/vendor/matching" class="block bg-gray-100 hover:bg-gray-200 rounded-lg p-4 transition-colors">
              <div class="flex items-center">
                <i class="fas fa-search text-primary-500 mr-3"></i>
                <span>瀏覽可媒合專案</span>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/vendor/fundraising/create" class="block bg-gray-100 hover:bg-gray-200 rounded-lg p-4 transition-colors">
              <div class="flex items-center">
                <i class="fas fa-plus-circle text-green-500 mr-3"></i>
                <span>創建新募資活動</span>
              </div>
            </NuxtLink>
            
            <div class="block bg-gray-100 hover:bg-gray-200 rounded-lg p-4 cursor-pointer transition-colors" @click="refreshData">
              <div class="flex items-center">
                <i class="fas fa-sync-alt text-blue-500 mr-3"></i>
                <span>刷新數據</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 募資項目列表 -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">我的募資項目</h2>
          
          <div class="flex gap-2">
            <select v-model="statusFilter" class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option value="">全部狀態</option>
              <option value="active">進行中</option>
              <option value="completed">已完成</option>
              <option value="failed">未達標</option>
              <option value="draft">草稿</option>
            </select>
            
            <select v-model="sortOption" class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option value="newest">最新建立</option>
              <option value="oldest">最早建立</option>
              <option value="most-funded">募資最多</option>
              <option value="ending-soon">即將結束</option>
            </select>
          </div>
        </div>
        
        <div v-if="loading" class="py-8 text-center">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p class="text-gray-500 mt-3">載入資料中...</p>
        </div>
        
        <div v-else-if="error" class="py-8 text-center text-red-500">
          {{ error }}
        </div>
        
        <div v-else-if="filteredCampaigns.length === 0" class="text-center py-16">
          <i class="fas fa-exclamation-circle text-gray-400 text-5xl mb-4"></i>
          <p class="text-gray-500">沒有找到符合條件的募資項目</p>
          <NuxtLink to="/vendor/matching" class="mt-4 inline-block bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors">
            開始媒合專案
          </NuxtLink>
        </div>
        
        <div v-else class="space-y-6">
          <div v-for="campaign in filteredCampaigns" :key="campaign._id" 
               class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex flex-col md:flex-row">
              <div class="md:w-1/4 mb-4 md:mb-0 md:mr-4">
                <img :src="campaign.image || '/images/placeholder.png'" :alt="campaign.title" 
                     class="w-full h-32 object-cover rounded-lg">
              </div>
              
              <div class="md:w-3/4">
                <div class="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h3 class="text-lg font-semibold">{{ campaign.title }}</h3>
                    <div class="flex items-center mt-1">
                      <span :class="getStatusClass(campaign.status)" class="text-xs px-2 py-0.5 rounded-full">
                        {{ getStatusText(campaign.status) }}
                      </span>
                      <span class="text-gray-500 text-sm ml-2">建立於 {{ formatDate(campaign.createdAt) }}</span>
                    </div>
                  </div>
                  
                  <div class="mt-2 md:mt-0 flex">
                    <NuxtLink :to="`/vendor/fundraising/${campaign._id}`" 
                              class="text-primary-500 hover:text-primary-700 p-1">
                      <i class="fas fa-eye"></i>
                    </NuxtLink>
                    <NuxtLink :to="`/vendor/fundraising/${campaign._id}/edit`" 
                              class="text-blue-500 hover:text-blue-700 p-1 ml-2">
                      <i class="fas fa-edit"></i>
                    </NuxtLink>
                    <button class="text-red-500 hover:text-red-700 p-1 ml-2" 
                            @click="confirmDelete(campaign._id)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                
                <p class="text-gray-600 text-sm mt-2 line-clamp-2">{{ campaign.description }}</p>
                
                <div class="mt-4">
                  <div class="flex justify-between text-sm mb-1">
                    <span>募資進度</span>
                    <span>{{ Math.round((campaign.currentAmount / campaign.goalAmount) * 100) }}% (${{ formatNumber(campaign.currentAmount) }} / ${{ formatNumber(campaign.goalAmount) }})</span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-primary-500" :style="`width: ${Math.min(100, (campaign.currentAmount / campaign.goalAmount) * 100)}%`"></div>
                  </div>
                </div>
                
                <div class="mt-4 flex flex-wrap gap-4 text-sm">
                  <div>
                    <span class="text-gray-500">贊助人數</span>
                    <div class="font-medium">{{ campaign.backersCount }}</div>
                  </div>
                  <div>
                    <span class="text-gray-500">結束日期</span>
                    <div class="font-medium">{{ formatDate(campaign.endDate) }}</div>
                  </div>
                  <div>
                    <span class="text-gray-500">剩餘天數</span>
                    <div class="font-medium">{{ getRemainingDays(campaign.endDate) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { UserRole } from '~/server/models/User'

interface Campaign {
  _id: string
  title: string
  description: string
  image?: string
  status: 'draft' | 'active' | 'completed' | 'failed'
  createdAt: string
  startDate: string
  endDate: string
  goalAmount: number
  currentAmount: number
  backersCount: number
}

interface CampaignStats {
  total: number
  active: number
  completed: number
  failed: number
  draft: number
}

interface FundingStats {
  totalGoal: number
  totalRaised: number
  totalBackers: number
}

const userStore = useUserStore()
const router = useRouter()

// 檢查用戶是否為廠商
if (!userStore.isLoggedIn || !userStore.hasRole(UserRole.VENDOR)) {
  router.push('/login?redirect=/vendor/fundraising')
}

// 狀態變量
const loading = ref(true)
const error = ref<string | null>(null)
const campaigns = ref<Campaign[]>([])
const statusFilter = ref('')
const sortOption = ref('newest')

// 統計信息
const campaignStats = ref<CampaignStats>({
  total: 0,
  active: 0,
  completed: 0,
  failed: 0,
  draft: 0
})

const fundingStats = ref<FundingStats>({
  totalGoal: 0,
  totalRaised: 0,
  totalBackers: 0
})

// 過濾和排序
const filteredCampaigns = computed(() => {
  let result = [...campaigns.value]
  
  // 狀態過濾
  if (statusFilter.value) {
    result = result.filter(campaign => campaign.status === statusFilter.value)
  }
  
  // 排序
  switch (sortOption.value) {
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'oldest':
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      break
    case 'most-funded':
      result.sort((a, b) => b.currentAmount - a.currentAmount)
      break
    case 'ending-soon':
      result.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
      break
  }
  
  return result
})

// 格式化數字
const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '未知'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// 計算剩餘天數
const getRemainingDays = (endDateString: string) => {
  if (!endDateString) return '未知'
  
  const endDate = new Date(endDateString)
  const now = new Date()
  
  if (endDate <= now) return '已結束'
  
  const diffTime = endDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return `${diffDays} 天`
}

// 獲取狀態顯示類
const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    'draft': 'bg-gray-100 text-gray-800',
    'active': 'bg-green-100 text-green-800',
    'completed': 'bg-blue-100 text-blue-800',
    'failed': 'bg-red-100 text-red-800'
  }
  
  return statusMap[status] || 'bg-gray-100 text-gray-800'
}

// 獲取狀態文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'draft': '草稿',
    'active': '進行中',
    'completed': '已完成',
    'failed': '未達標'
  }
  
  return statusMap[status] || status
}

// 確認刪除
const confirmDelete = (campaignId: string) => {
  if (confirm('確定要刪除這個募資項目嗎？此操作無法恢復。')) {
    deleteCampaign(campaignId)
  }
}

// 刪除募資項目
const deleteCampaign = async (campaignId: string) => {
  try {
    const response = await fetch(`/api/vendor/fundraising/${campaignId}`, {
      method: 'DELETE'
    })
    
    const data = await response.json()
    
    if (data.success) {
      // 從列表中移除
      campaigns.value = campaigns.value.filter(c => c._id !== campaignId)
      
      // 更新統計數據
      updateStats()
    } else {
      error.value = data.message || '刪除失敗'
    }
  } catch (err: any) {
    error.value = err.message || '刪除過程中發生錯誤'
  }
}

// 獲取募資項目列表
const fetchCampaigns = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('/api/vendor/fundraising')
    const data = await response.json()
    
    if (data.success) {
      campaigns.value = data.data
      updateStats()
    } else {
      error.value = data.message || '無法獲取募資項目'
      // 使用模擬數據
      useSimulatedData()
    }
  } catch (err: any) {
    error.value = err.message || '獲取募資項目時發生錯誤'
    // 使用模擬數據
    useSimulatedData()
  } finally {
    loading.value = false
  }
}

// 更新統計數據
const updateStats = () => {
  // 計算數量統計
  campaignStats.value = {
    total: campaigns.value.length,
    active: campaigns.value.filter(c => c.status === 'active').length,
    completed: campaigns.value.filter(c => c.status === 'completed').length,
    failed: campaigns.value.filter(c => c.status === 'failed').length,
    draft: campaigns.value.filter(c => c.status === 'draft').length
  }
  
  // 計算資金統計
  fundingStats.value = {
    totalGoal: campaigns.value.reduce((sum, campaign) => sum + campaign.goalAmount, 0),
    totalRaised: campaigns.value.reduce((sum, campaign) => sum + campaign.currentAmount, 0),
    totalBackers: campaigns.value.reduce((sum, campaign) => sum + campaign.backersCount, 0)
  }
}

// 刷新數據
const refreshData = () => {
  fetchCampaigns()
}

// 使用模擬數據（API完成前）
const useSimulatedData = () => {
  const now = new Date()
  const oneMonthLater = new Date(now)
  oneMonthLater.setMonth(now.getMonth() + 1)
  
  const twoWeeksLater = new Date(now)
  twoWeeksLater.setDate(now.getDate() + 14)
  
  const oneWeekAgo = new Date(now)
  oneWeekAgo.setDate(now.getDate() - 7)
  
  const twoWeeksAgo = new Date(now)
  twoWeeksAgo.setDate(now.getDate() - 14)
  
  campaigns.value = [
    {
      _id: 'campaign1',
      title: '智能可摺疊電動自行車',
      description: '輕便的可折疊電動自行車，具有智能導航功能和長效電池，適合城市通勤和短途旅行。',
      image: 'https://source.unsplash.com/random/800x600/?electric-bike',
      status: 'active',
      createdAt: twoWeeksAgo.toISOString(),
      startDate: oneWeekAgo.toISOString(),
      endDate: oneMonthLater.toISOString(),
      goalAmount: 120000,
      currentAmount: 68000,
      backersCount: 142
    },
    {
      _id: 'campaign2',
      title: '多功能智能廚房助手',
      description: '自動化烹飪助手，具有語音控制和多種烹飪模式，讓烹飪變得更加簡單和有趣。',
      image: 'https://source.unsplash.com/random/800x600/?kitchen-gadget',
      status: 'active',
      createdAt: twoWeeksAgo.toISOString(),
      startDate: oneWeekAgo.toISOString(),
      endDate: twoWeeksLater.toISOString(),
      goalAmount: 80000,
      currentAmount: 76000,
      backersCount: 203
    },
    {
      _id: 'campaign3',
      title: '環保智能水瓶',
      description: '會提醒你喝水的智能水瓶，可追蹤水分攝取量，並具有自潔功能。',
      image: 'https://source.unsplash.com/random/800x600/?water-bottle',
      status: 'completed',
      createdAt: '2023-08-15T00:00:00Z',
      startDate: '2023-08-20T00:00:00Z',
      endDate: '2023-09-20T00:00:00Z',
      goalAmount: 50000,
      currentAmount: 87500,
      backersCount: 430
    },
    {
      _id: 'campaign4',
      title: '便攜式太陽能充電器',
      description: '高效率太陽能充電板，可折疊便攜，適合戶外活動和緊急情況使用。',
      image: 'https://source.unsplash.com/random/800x600/?solar-charger',
      status: 'failed',
      createdAt: '2023-07-01T00:00:00Z',
      startDate: '2023-07-10T00:00:00Z',
      endDate: '2023-08-10T00:00:00Z',
      goalAmount: 75000,
      currentAmount: 32000,
      backersCount: 87
    },
    {
      _id: 'campaign5',
      title: '智能健康監測手環',
      description: '全天候健康監測手環，具有心率、血壓、血氧和睡眠質量追蹤功能。',
      image: 'https://source.unsplash.com/random/800x600/?fitness-tracker',
      status: 'draft',
      createdAt: now.toISOString(),
      startDate: '',
      endDate: '',
      goalAmount: 60000,
      currentAmount: 0,
      backersCount: 0
    }
  ]
  
  updateStats()
}

// 頁面加載時獲取數據
onMounted(() => {
  fetchCampaigns()
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