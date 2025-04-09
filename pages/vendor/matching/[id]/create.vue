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
            <i class="fas fa-arrow-left mr-2"></i> 返回專案詳情
          </button>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 class="text-2xl font-bold mb-2">創建媒合提案</h1>
          <p class="text-gray-600 mb-6">
            為專案 <span class="font-medium text-gray-900">{{ project?.name }}</span> 創建廠商媒合提案
          </p>

          <form @submit.prevent="submitProposal" class="space-y-6">
            <!-- 基本資訊 -->
            <div class="space-y-4">
              <h2 class="text-lg font-semibold flex items-center">
                <span class="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">1</span>
                基本資訊
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 font-medium mb-2">提案標題 <span class="text-red-500">*</span></label>
                  <input v-model="form.title" type="text" required
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                </div>
                <div>
                  <label class="block text-gray-700 font-medium mb-2">預估完成時間 (週) <span class="text-red-500">*</span></label>
                  <input v-model.number="form.estimatedWeeks" type="number" min="1" required
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                </div>
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">提案概述 <span class="text-red-500">*</span></label>
                <textarea v-model="form.summary" rows="3" required
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"></textarea>
              </div>
            </div>

            <!-- 市場評估 -->
            <div class="space-y-4">
              <h2 class="text-lg font-semibold flex items-center">
                <span class="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">2</span>
                市場評估
              </h2>

              <div>
                <label class="block text-gray-700 font-medium mb-2">目標市場 <span class="text-red-500">*</span></label>
                <textarea v-model="form.targetMarket" rows="2" required
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="描述產品的目標客戶群體和市場定位"></textarea>
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">市場規模 <span class="text-red-500">*</span></label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm text-gray-600 mb-1">保守估計 (單位:萬)</label>
                    <input v-model.number="form.marketSizeConservative" type="number" min="0" required
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  </div>
                  <div>
                    <label class="block text-sm text-gray-600 mb-1">中等估計 (單位:萬)</label>
                    <input v-model.number="form.marketSizeModerate" type="number" min="0" required
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  </div>
                  <div>
                    <label class="block text-sm text-gray-600 mb-1">樂觀估計 (單位:萬)</label>
                    <input v-model.number="form.marketSizeOptimistic" type="number" min="0" required
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">競爭分析</label>
                <textarea v-model="form.competitionAnalysis" rows="3"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="分析市場上類似產品的優缺點，以及您的產品如何脫穎而出"></textarea>
              </div>
            </div>

            <!-- 財務計畫 -->
            <div class="space-y-4">
              <h2 class="text-lg font-semibold flex items-center">
                <span class="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">3</span>
                財務計畫
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 font-medium mb-2">製造成本 (單位) <span class="text-red-500">*</span></label>
                  <input v-model.number="form.unitCost" type="number" min="0" required
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                </div>
                <div>
                  <label class="block text-gray-700 font-medium mb-2">建議零售價 <span class="text-red-500">*</span></label>
                  <input v-model.number="form.suggestedRetailPrice" type="number" min="0" required
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 font-medium mb-2">預計毛利率 (%)</label>
                  <input type="number" min="0" max="100" 
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                         :value="calculateGrossMargin" disabled>
                </div>
                <div>
                  <label class="block text-gray-700 font-medium mb-2">初始生產數量 <span class="text-red-500">*</span></label>
                  <input v-model.number="form.initialProductionQuantity" type="number" min="1" required
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                </div>
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">募資目標 <span class="text-red-500">*</span></label>
                <input v-model.number="form.fundraisingGoal" type="number" min="0" required
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <p class="text-sm text-gray-500 mt-1">建議募資目標: ${{ calculateRecommendedFundraisingGoal }}</p>
              </div>
            </div>

            <!-- 生產與配送計畫 -->
            <div class="space-y-4">
              <h2 class="text-lg font-semibold flex items-center">
                <span class="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">4</span>
                生產與配送計畫
              </h2>

              <div>
                <label class="block text-gray-700 font-medium mb-2">生產計畫</label>
                <textarea v-model="form.productionPlan" rows="3"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="描述生產流程、供應鏈管理和質量控制措施"></textarea>
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">配送策略</label>
                <textarea v-model="form.distributionStrategy" rows="3"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="說明產品將如何配送給客戶，包括倉儲、物流和交付時間估計"></textarea>
              </div>
            </div>

            <!-- 募資回饋方案 -->
            <div class="space-y-4">
              <h2 class="text-lg font-semibold flex items-center">
                <span class="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">5</span>
                募資回饋方案
              </h2>
              
              <div class="space-y-4">
                <div v-for="(tier, index) in form.rewardTiers" :key="index" class="border border-gray-200 rounded-lg p-4">
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
                      <input v-model.number="tier.price" type="number" min="0" required
                             class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    </div>
                  </div>
                  
                  <div class="mb-3">
                    <label class="block text-gray-700 text-sm font-medium mb-1">描述 <span class="text-red-500">*</span></label>
                    <textarea v-model="tier.description" rows="2" required
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"></textarea>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-medium mb-1">數量限制</label>
                    <input v-model.number="tier.limit" type="number" min="0"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                           placeholder="0表示無限制">
                  </div>
                </div>
                
                <button @click="addRewardTier" type="button" 
                        class="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg flex items-center justify-center w-full">
                  <i class="fas fa-plus mr-2"></i> 新增回饋方案
                </button>
              </div>
            </div>

            <!-- 提交按鈕 -->
            <div class="pt-4 border-t border-gray-200">
              <div class="flex justify-end gap-4">
                <button type="button" @click="router.back()" 
                        class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  取消
                </button>
                <button type="submit" 
                        class="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg">
                  提交媒合提案
                </button>
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

// 狀態和數據
const projectId = computed(() => route.params.id as string)
const loading = ref(true)
const error = ref<string | null>(null)
const project = ref<any>(null)
const submitting = ref(false)

// 表單數據
const form = ref({
  title: '',
  summary: '',
  estimatedWeeks: 12,
  
  // 市場評估
  targetMarket: '',
  marketSizeConservative: 500,  // 單位：萬
  marketSizeModerate: 1000,     // 單位：萬 
  marketSizeOptimistic: 2000,   // 單位：萬
  competitionAnalysis: '',
  
  // 財務計畫
  unitCost: 0,                  // 製造單位成本
  suggestedRetailPrice: 0,      // 建議零售價
  grossMargin: 0,               // 毛利率 (%)
  initialProductionQuantity: 1000, // 初始生產數量
  fundraisingGoal: 0,          // 募資目標
  
  // 生產與配送
  productionPlan: '',
  distributionStrategy: '',
  
  // 募資回饋方案
  rewardTiers: [
    {
      name: '早鳥優惠',
      price: 0,
      description: '以優惠價格獲得產品，限量供應',
      limit: 100
    }
  ]
})

// 計算毛利率
const calculateGrossMargin = computed(() => {
  if (!form.value.suggestedRetailPrice || !form.value.unitCost) return 0
  
  const grossMargin = ((form.value.suggestedRetailPrice - form.value.unitCost) / form.value.suggestedRetailPrice) * 100
  return Math.round(grossMargin)
})

// 計算建議募資目標
const calculateRecommendedFundraisingGoal = computed(() => {
  const productionCost = form.value.unitCost * form.value.initialProductionQuantity
  const marketingCost = productionCost * 0.2 // 假設市場推廣成本是生產成本的20%
  const logisticsCost = productionCost * 0.1 // 假設物流成本是生產成本的10%
  
  const total = productionCost + marketingCost + logisticsCost
  return new Intl.NumberFormat().format(Math.round(total))
})

// 添加回饋方案
const addRewardTier = () => {
  form.value.rewardTiers.push({
    name: '',
    price: 0,
    description: '',
    limit: 0
  })
}

// 移除回饋方案
const removeRewardTier = (index: number) => {
  form.value.rewardTiers.splice(index, 1)
}

// 獲取專案資訊
const fetchProjectInfo = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch(`/api/vendor/matching-projects/${projectId.value}`)
    const data = await response.json()
    
    if (data.success) {
      project.value = data.data
      
      // 預填表單數據
      form.value.title = `${project.value.name} - 生產與籌資計劃`
      form.value.unitCost = Math.round(project.value.estimatedCost * 0.7 / 1000) // 假設成本是估算成本的70%
      form.value.suggestedRetailPrice = Math.round(form.value.unitCost * 1.5) // 假設售價是成本的1.5倍
      form.value.fundraisingGoal = project.value.estimatedCost
    } else {
      error.value = data.message || '無法獲取專案信息'
    }
  } catch (err: any) {
    error.value = err.message || '獲取專案信息時發生錯誤'
    // 使用模擬數據
    useSimulatedData()
  } finally {
    loading.value = false
  }
}

// 模擬數據（實際API完成前使用）
const useSimulatedData = () => {
  project.value = {
    _id: projectId.value,
    name: '智能可摺疊電動自行車',
    estimatedCost: 120000
  }
  
  // 預填表單數據
  form.value.title = `${project.value.name} - 生產與籌資計劃`
  form.value.unitCost = Math.round(project.value.estimatedCost * 0.7 / 1000) // 單位成本
  form.value.suggestedRetailPrice = Math.round(form.value.unitCost * 1.5) // 建議零售價
  form.value.fundraisingGoal = project.value.estimatedCost
}

// 提交媒合提案
const submitProposal = async () => {
  if (submitting.value) return
  
  submitting.value = true
  error.value = null
  
  try {
    // 計算毛利率
    form.value.grossMargin = calculateGrossMargin.value
    
    const response = await fetch(`/api/vendor/matching-projects/${projectId.value}/propose`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    })
    
    const data = await response.json()
    
    if (data.success) {
      // 跳轉到募資頁面創建
      router.push(`/vendor/fundraising/create?projectId=${projectId.value}&proposalId=${data.data._id}`)
    } else {
      error.value = data.message || '提交媒合提案失敗'
    }
  } catch (err: any) {
    error.value = err.message || '提交提案時發生錯誤'
    
    // 模擬成功（API完成前使用）
    setTimeout(() => {
      router.push(`/vendor/fundraising/create?projectId=${projectId.value}&proposalId=sim_${Date.now()}`)
    }, 1000)
  } finally {
    submitting.value = false
  }
}

// 頁面加載時獲取專案信息
onMounted(async () => {
  await fetchProjectInfo()
})
</script>

<style scoped>
/* 頁面樣式 */
</style> 