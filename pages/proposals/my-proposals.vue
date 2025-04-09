<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold">我的提案</h1>
          <p class="text-gray-600 mt-2">管理您對創意提交的所有工程提案</p>
        </div>
        <button 
          @click="router.push('/products')"
          class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center"
        >
          <i class="pi pi-search mr-2"></i>
          瀏覽更多創意
        </button>
      </div>

      <!-- 標籤切換 -->
      <div class="bg-white rounded-lg p-2 shadow-sm mb-8 flex">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          @click="currentTab = tab.value"
          class="px-4 py-2 rounded-md text-sm font-medium flex-1 transition-colors"
          :class="currentTab === tab.value 
            ? 'bg-primary-50 text-primary-700' 
            : 'text-gray-600 hover:bg-gray-100'"
        >
          {{ tab.label }}
          <span class="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
            {{ getProposalsByStatus(tab.value).length }}
          </span>
        </button>
      </div>

      <!-- 加載中 -->
      <div v-if="loading" class="py-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
      </div>

      <!-- 錯誤提示 -->
      <div v-else-if="error" class="py-8 text-center">
        <div class="text-red-500 mb-2">{{ error }}</div>
        <Button label="重新加載" icon="pi pi-refresh" @click="fetchMyProposals" />
      </div>

      <!-- 沒有提案時顯示 -->
      <div v-else-if="myProposals.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
        <img src="/images/empty-proposals.svg" alt="沒有提案" class="w-32 h-32 mx-auto mb-4 opacity-50">
        <h3 class="text-xl font-semibold mb-2">您還沒有提交任何提案</h3>
        <p class="text-gray-600 mb-6">瀏覽創意庫並找到您感興趣的項目!</p>
        <Button label="瀏覽創意" icon="pi pi-search" @click="router.push('/products')" />
      </div>

      <!-- 當前選擇標籤下沒有提案 -->
      <div v-else-if="getProposalsByStatus(currentTab).length === 0" class="bg-white rounded-lg shadow p-6 text-center">
        <h3 class="font-semibold mb-2">
          目前沒有{{ tabs.find(t => t.value === currentTab)?.label }}的提案
        </h3>
        <p class="text-gray-600 text-sm">
          {{ getEmptyTabMessage(currentTab) }}
        </p>
      </div>

      <!-- 提案列表 -->
      <div v-else class="space-y-6">
        <div 
          v-for="proposal in getProposalsByStatus(currentTab)" 
          :key="proposal._id" 
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-start">
                <img :src="proposal.product.image" :alt="proposal.product.name" class="w-16 h-16 object-cover rounded-lg mr-4">
                <div>
                  <h3 class="text-lg font-semibold">{{ proposal.product.name }}</h3>
                  <p class="text-sm text-gray-500">
                    創意作者: {{ proposal.product.user.name }} | 
                    提交於: {{ formatDate(proposal.createdAt) }}
                  </p>
                </div>
              </div>
              <div>
                <span 
                  class="px-3 py-1 rounded-full text-sm font-medium"
                  :class="getStatusClass(proposal.status)"
                >
                  {{ statusLabels[proposal.status] }}
                </span>
              </div>
            </div>
            
            <div class="border-t border-b border-gray-100 py-4 mb-4">
              <div class="text-sm">
                <div class="mb-2">
                  <span class="font-medium">提案內容:</span>
                  <p class="mt-1 text-gray-600">{{ proposal.content }}</p>
                </div>
                <div class="grid grid-cols-2 gap-2 mt-3">
                  <div>
                    <span class="font-medium">預計完成時間:</span>
                    <p class="text-gray-600">{{ proposal.estimatedTime }}</p>
                  </div>
                  <div>
                    <span class="font-medium">估算成本:</span>
                    <p class="text-gray-600">NT$ {{ formatCurrency(proposal.estimatedCost) }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex justify-between items-center">
              <Button 
                label="查看創意詳情" 
                icon="pi pi-external-link" 
                text 
                @click="router.push(`/products/${proposal.product._id}`)" 
              />
              
              <div class="flex gap-2">
                <Button 
                  v-if="proposal.status === 'pending'" 
                  label="編輯提案" 
                  icon="pi pi-pencil" 
                  outlined
                  @click="router.push(`/products/${proposal.product._id}/propose?edit=${proposal._id}`)" 
                />
                <Button 
                  v-if="proposal.status === 'accepted'" 
                  severity="success"
                  label="開始工作" 
                  icon="pi pi-check" 
                  outlined
                  @click="startWork(proposal)" 
                />
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
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores/user'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

const loading = ref(false)
const error = ref('')
const myProposals = ref([])
const currentTab = ref('all')

// 標籤定義
const tabs = [
  { label: '全部提案', value: 'all' },
  { label: '待審核', value: 'pending' },
  { label: '已接受', value: 'accepted' },
  { label: '已拒絕', value: 'rejected' }
]

// 狀態標籤
const statusLabels = {
  pending: '審核中',
  accepted: '已接受',
  rejected: '已拒絕'
}

// 獲取狀態樣式
const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'accepted': return 'bg-green-100 text-green-800'
    case 'rejected': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// 獲取空標籤訊息
const getEmptyTabMessage = (tab) => {
  switch (tab) {
    case 'pending': return '您沒有正在等待審核的提案'
    case 'accepted': return '您的提案尚未被任何創意接受'
    case 'rejected': return '您沒有被拒絕的提案'
    default: return '您還沒有提交過任何提案'
  }
}

// 根據狀態篩選提案
const getProposalsByStatus = (status) => {
  if (status === 'all') {
    return myProposals.value
  }
  return myProposals.value.filter(proposal => proposal.status === status)
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'short', day: 'numeric' })
}

// 格式化貨幣
const formatCurrency = (value) => {
  return new Intl.NumberFormat('zh-TW').format(value)
}

// 開始工作
const startWork = async (proposal) => {
  toast.add({ 
    severity: 'info', 
    summary: '功能開發中', 
    detail: '開始工作流程正在開發中', 
    life: 3000 
  })
  
  // TODO: 實現開始工作的流程
}

// 獲取我的提案列表
const fetchMyProposals = async () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetch('/api/proposals/my-proposals', {
      credentials: 'include'
    })
    
    const result = await response.json()
    
    if (result.success && Array.isArray(result.data)) {
      myProposals.value = result.data
    } else {
      throw new Error(result.message || '獲取提案列表失敗')
    }
  } catch (err) {
    error.value = err.message || '加載提案時發生錯誤'
  } finally {
    loading.value = false
  }
}

// 頁面加載時獲取提案列表
onMounted(() => {
  fetchMyProposals()
})
</script> 