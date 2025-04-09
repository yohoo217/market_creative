<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
      </div>

      <div v-else-if="error" class="text-center py-8 text-red-500">
        {{ error }}
      </div>

      <template v-else>
        <!-- 返回按鈕 -->
        <div class="mb-6">
          <button @click="router.back()" class="text-gray-600 hover:text-gray-900 flex items-center">
            <i class="fas fa-arrow-left mr-2"></i> 返回
          </button>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 class="text-2xl font-bold mb-2">創建募資活動</h1>
          <p class="text-gray-600 mb-6">
            為專案 <span class="font-medium text-gray-900">{{ project?.name }}</span> 創建募資活動
          </p>

          <form @submit.prevent="submitFundraising" class="space-y-6">
            <!-- 募資基本信息 -->
            <div class="space-y-4">
              <h2 class="text-lg font-semibold flex items-center">
                <span class="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">1</span>
                基本資訊
              </h2>

              <div>
                <label class="block text-gray-700 font-medium mb-2">募資活動標題 <span class="text-red-500">*</span></label>
                <input v-model="form.title" type="text" required
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">簡短描述 <span class="text-red-500">*</span></label>
                <textarea v-model="form.shortDescription" rows="2" required maxlength="140"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"></textarea>
                <div class="text-right text-xs text-gray-500 mt-1">
                  {{ form.shortDescription.length }}/140
                </div>
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">詳細描述 <span class="text-red-500">*</span></label>
                <textarea v-model="form.fullDescription" rows="4" required
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"></textarea>
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">宣傳影片網址</label>
                <input v-model="form.videoUrl" type="url"
                       placeholder="YouTube 或 Vimeo 網址"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">募資主圖 <span class="text-red-500">*</span></label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                     @click="openImageSelector">
                  <div v-if="form.image" class="relative">
                    <img :src="form.image" alt="募資主圖" class="max-h-48 mx-auto">
                    <button @click.stop="clearImage" type="button" class="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  <div v-else class="py-8">
                    <i class="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-2"></i>
                    <p class="text-gray-500">點擊上傳圖片</p>
                    <p class="text-xs text-gray-400 mt-1">建議尺寸: 1200 x 675 像素 (16:9)</p>
                  </div>
                </div>
                <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="onImageSelected">
              </div>
            </div>

            <!-- 募資目標與時間 -->
            <div class="space-y-4">
              <h2 class="text-lg font-semibold flex items-center">
                <span class="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">2</span>
                募資目標與時間
              </h2>

              <div>
                <label class="block text-gray-700 font-medium mb-2">募資目標金額 <span class="text-red-500">*</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500">$</span>
                  </div>
                  <input v-model.number="form.goalAmount" type="number" min="1" required
                         class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                </div>
                <p class="text-sm text-gray-500 mt-1">建議金額：${{ formatNumber(recommendedGoal) }}</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 font-medium mb-2">開始日期 <span class="text-red-500">*</span></label>
                  <input v-model="form.startDate" type="date" required
                         :min="todayFormatted"
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                </div>
                <div>
                  <label class="block text-gray-700 font-medium mb-2">結束日期 <span class="text-red-500">*</span></label>
                  <input v-model="form.endDate" type="date" required
                         :min="form.startDate || todayFormatted"
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                </div>
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">目標達成條件</label>
                <div class="flex items-center space-x-4">
                  <label class="inline-flex items-center">
                    <input v-model="form.fundingType" type="radio" value="fixed" 
                           class="form-radio h-4 w-4 text-primary-500 focus:ring-primary-500">
                    <span class="ml-2">全有或全無（未達目標不收款）</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input v-model="form.fundingType" type="radio" value="flexible" 
                           class="form-radio h-4 w-4 text-primary-500 focus:ring-primary-500">
                    <span class="ml-2">彈性目標（無論金額都收款）</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- 回饋方案編輯 -->
            <div class="space-y-4">
              <h2 class="text-lg font-semibold flex items-center">
                <span class="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">3</span>
                回饋方案
              </h2>
              
              <div class="space-y-4">
                <div v-for="(tier, index) in form.rewardTiers" :key="index" 
                     class="border border-gray-200 rounded-lg p-4">
                  <div class="flex justify-between items-center mb-3">
                    <h3 class="font-medium">方案 {{ index + 1 }}</h3>
                    <button v-if="index > 0" @click="removeRewardTier(index)" type="button" 
                            class="text-red-500 hover:text-red-700">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label class="block text-gray-700 text-sm font-medium mb-1">方案名稱 <span class="text-red-500">*</span></label>
                      <input v-model="tier.name" type="text" required
                             class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    </div>
                    <div>
                      <label class="block text-gray-700 text-sm font-medium mb-1">價格 <span class="text-red-500">*</span></label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="text-gray-500">$</span>
                        </div>
                        <input v-model.number="tier.price" type="number" min="0" required
                               class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      </div>
                    </div>
                  </div>
                  
                  <div class="mb-3">
                    <label class="block text-gray-700 text-sm font-medium mb-1">描述 <span class="text-red-500">*</span></label>
                    <textarea v-model="tier.description" rows="2" required
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"></textarea>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-gray-700 text-sm font-medium mb-1">數量限制</label>
                      <input v-model.number="tier.limit" type="number" min="0"
                             class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                             placeholder="0表示無限制">
                    </div>
                    <div>
                      <label class="block text-gray-700 text-sm font-medium mb-1">預計配送時間</label>
                      <input v-model="tier.estimatedDelivery" type="month"
                             class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    </div>
                  </div>
                </div>
                
                <button @click="addRewardTier" type="button" 
                        class="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg flex items-center justify-center w-full">
                  <i class="fas fa-plus mr-2"></i> 新增回饋方案
                </button>
              </div>
            </div>

            <!-- 募資故事 -->
            <div class="space-y-4">
              <h2 class="text-lg font-semibold flex items-center">
                <span class="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">4</span>
                募資故事
              </h2>

              <div>
                <label class="block text-gray-700 font-medium mb-2">產品特色</label>
                <textarea v-model="form.productFeatures" rows="3"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="描述產品的獨特賣點和主要特色"></textarea>
              </div>
              
              <div>
                <label class="block text-gray-700 font-medium mb-2">產品起源故事</label>
                <textarea v-model="form.storyBehind" rows="3"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="分享產品的起源和團隊的故事"></textarea>
              </div>
            </div>

            <!-- 團隊介紹 -->
            <div class="space-y-4">
              <h2 class="text-lg font-semibold flex items-center">
                <span class="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">5</span>
                團隊介紹
              </h2>

              <div>
                <label class="block text-gray-700 font-medium mb-2">團隊名稱 <span class="text-red-500">*</span></label>
                <input v-model="form.teamName" type="text" required
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">團隊介紹</label>
                <textarea v-model="form.teamIntroduction" rows="3"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="介紹您的團隊成員和專業背景"></textarea>
              </div>
            </div>

            <!-- 風險和挑戰 -->
            <div class="space-y-4">
              <h2 class="text-lg font-semibold flex items-center">
                <span class="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">6</span>
                風險與挑戰
              </h2>

              <div>
                <label class="block text-gray-700 font-medium mb-2">可能的風險與挑戰 <span class="text-red-500">*</span></label>
                <textarea v-model="form.risksAndChallenges" rows="3" required
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="描述可能遇到的風險和挑戰，以及如何應對"></textarea>
              </div>
            </div>

            <!-- 提交按鈕 -->
            <div class="pt-4 border-t border-gray-200">
              <div class="flex flex-col md:flex-row justify-between gap-4">
                <div class="flex items-center">
                  <input v-model="form.saveAsDraft" type="checkbox" id="save-as-draft" 
                         class="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded">
                  <label for="save-as-draft" class="ml-2 text-gray-700">保存為草稿</label>
                </div>

                <div class="flex gap-3">
                  <button type="button" @click="router.back()" 
                          class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    取消
                  </button>
                  <button type="submit" 
                          class="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg">
                    {{ form.saveAsDraft ? '保存草稿' : '發起募資' }}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { UserRole } from '~/server/models/User'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 檢查用戶是否為廠商
if (!userStore.isLoggedIn || !userStore.hasRole(UserRole.VENDOR)) {
  router.push('/login?redirect=' + route.fullPath)
}

// 狀態變量
const loading = ref(true)
const error = ref<string | null>(null)
const project = ref<any>(null)
const imageInput = ref<HTMLInputElement | null>(null)
const submitting = ref(false)

// 獲取URL參數
const projectId = computed(() => route.query.projectId as string || '')
const proposalId = computed(() => route.query.proposalId as string || '')

// 當前日期格式化為YYYY-MM-DD
const todayFormatted = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// 建議募資目標
const recommendedGoal = computed(() => {
  return project.value?.estimatedCost || 0
})

// 表單數據
const form = ref({
  title: '',
  shortDescription: '',
  fullDescription: '',
  videoUrl: '',
  image: '',
  
  goalAmount: 0,
  startDate: '',
  endDate: '',
  fundingType: 'fixed', // 'fixed' 或 'flexible'
  
  productFeatures: '',
  storyBehind: '',
  
  teamName: '',
  teamIntroduction: '',
  
  risksAndChallenges: '',
  
  saveAsDraft: false,
  
  rewardTiers: [
    {
      name: '早鳥優惠',
      price: 0,
      description: '以優惠價格獲得產品，限量供應',
      limit: 100,
      estimatedDelivery: ''
    }
  ]
})

// 添加回饋方案
const addRewardTier = () => {
  form.value.rewardTiers.push({
    name: '',
    price: 0,
    description: '',
    limit: 0,
    estimatedDelivery: ''
  })
}

// 移除回饋方案
const removeRewardTier = (index: number) => {
  form.value.rewardTiers.splice(index, 1)
}

// 格式化數字
const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}

// 打開圖片選擇器
const openImageSelector = () => {
  imageInput.value?.click()
}

// 清除已選圖片
const clearImage = () => {
  form.value.image = ''
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

// 圖片選擇處理
const onImageSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()
    
    reader.onload = (e) => {
      if (e.target?.result) {
        form.value.image = e.target.result as string
      }
    }
    
    reader.readAsDataURL(file)
  }
}

// 獲取專案和提案資訊
const fetchProjectInfo = async () => {
  loading.value = true
  error.value = null
  
  try {
    if (!projectId.value || !proposalId.value) {
      error.value = '缺少專案或提案ID'
      return
    }
    
    const response = await fetch(`/api/vendor/matching-projects/${projectId.value}?proposalId=${proposalId.value}`)
    const data = await response.json()
    
    if (data.success) {
      project.value = data.data.project
      const proposal = data.data.proposal
      
      // 預填表單
      form.value.title = project.value.name
      form.value.shortDescription = `立即支持創新產品「${project.value.name}」，搶先體驗未來科技！`
      form.value.fullDescription = proposal.summary || project.value.description
      form.value.goalAmount = proposal.fundraisingGoal
      
      // 預填回饋方案
      if (proposal.rewardTiers && proposal.rewardTiers.length > 0) {
        form.value.rewardTiers = proposal.rewardTiers.map((tier: any) => ({
          ...tier,
          estimatedDelivery: ''
        }))
      }
      
      // 設置開始和結束日期
      const today = new Date()
      const startDate = new Date(today)
      startDate.setDate(today.getDate() + 3) // 默認3天後開始
      
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 30) // 默認30天募資期
      
      form.value.startDate = startDate.toISOString().split('T')[0]
      form.value.endDate = endDate.toISOString().split('T')[0]
      
      // 團隊名稱
      form.value.teamName = userStore.currentUser?.name || '創新科技團隊'
    } else {
      error.value = data.message || '無法獲取專案和提案信息'
      // 使用模擬數據
      useSimulatedData()
    }
  } catch (err: any) {
    error.value = err.message || '獲取專案和提案信息時發生錯誤'
    // 使用模擬數據
    useSimulatedData()
  } finally {
    loading.value = false
  }
}

// 使用模擬數據（API完成前）
const useSimulatedData = () => {
  project.value = {
    _id: projectId.value || 'sim_project',
    name: '智能可摺疊電動自行車',
    description: '一款輕便的可折疊電動自行車，具有智能導航功能和長效電池，適合城市通勤和短途旅行。',
    estimatedCost: 120000
  }
  
  // 預填表單
  form.value.title = project.value.name
  form.value.shortDescription = `立即支持創新產品「${project.value.name}」，搶先體驗未來科技！`
  form.value.fullDescription = project.value.description
  form.value.goalAmount = project.value.estimatedCost
  
  // 設置開始和結束日期
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(today.getDate() + 3) // 默認3天後開始
  
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 30) // 默認30天募資期
  
  form.value.startDate = startDate.toISOString().split('T')[0]
  form.value.endDate = endDate.toISOString().split('T')[0]
  
  // 團隊名稱
  form.value.teamName = userStore.currentUser?.name || '創新科技團隊'
  
  // 預設回饋方案
  form.value.rewardTiers = [
    {
      name: '超級早鳥優惠',
      price: 1800,
      description: '以極優惠價格獲得智能自行車一台，比市場價格低30%',
      limit: 50,
      estimatedDelivery: '2023-12'
    },
    {
      name: '早鳥優惠',
      price: 2200,
      description: '以優惠價格獲得智能自行車一台，比市場價格低20%',
      limit: 100,
      estimatedDelivery: '2023-12'
    },
    {
      name: '標準套裝',
      price: 2800,
      description: '獲得智能自行車一台，附帶專屬水壺和騎行手套',
      limit: 0,
      estimatedDelivery: '2024-01'
    }
  ]
}

// 提交募資表單
const submitFundraising = async () => {
  if (submitting.value) return
  
  submitting.value = true
  error.value = null
  
  try {
    const payload = {
      ...form.value,
      projectId: projectId.value,
      proposalId: proposalId.value,
      status: form.value.saveAsDraft ? 'draft' : 'active'
    }
    
    const response = await fetch('/api/vendor/fundraising', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    
    const data = await response.json()
    
    if (data.success) {
      // 跳轉到募資項目頁面
      router.push(`/vendor/fundraising/${data.data._id}`)
    } else {
      error.value = data.message || '創建募資活動失敗'
    }
  } catch (err: any) {
    error.value = err.message || '提交募資活動時發生錯誤'
    
    // 模擬成功（API完成前使用）
    setTimeout(() => {
      router.push('/vendor/fundraising')
    }, 1000)
  } finally {
    submitting.value = false
  }
}

// 頁面加載時獲取專案信息
onMounted(async () => {
  if (projectId.value && proposalId.value) {
    await fetchProjectInfo()
  } else {
    error.value = '缺少必要參數'
    loading.value = false
  }
})
</script>

<style scoped>
/* 頁面樣式 */
</style> 