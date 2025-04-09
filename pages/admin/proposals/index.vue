<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">提案管理</h1>
    
    <!-- 搜索和篩選 -->
    <div class="flex flex-wrap gap-4 mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索提案..."
        class="px-4 py-2 border rounded-lg"
      />
      <select
        v-model="statusFilter"
        class="px-4 py-2 border rounded-lg"
      >
        <option value="">所有狀態</option>
        <option value="pending">待審核</option>
        <option value="approved">已批准</option>
        <option value="rejected">已拒絕</option>
      </select>
      <button 
        @click="fetchProposals" 
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        搜索
      </button>
    </div>
    
    <!-- 加載中 -->
    <div
      v-if="loading"
      class="flex justify-center items-center py-8"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
    
    <!-- 提案列表 -->
    <div v-else class="space-y-6">
      <div 
        v-for="proposal in proposals" 
        :key="proposal._id"
        class="bg-white rounded-lg shadow p-6"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h2 class="text-xl font-semibold">{{ proposal.title }}</h2>
            <p class="text-gray-600 mt-1">由 {{ proposal.creator.name }} 於 {{ formatDate(proposal.createdAt) }} 提交</p>
          </div>
          <span :class="{
            'px-3 py-1 rounded-full text-sm font-medium': true,
            'bg-yellow-100 text-yellow-800': proposal.status === 'pending',
            'bg-green-100 text-green-800': proposal.status === 'approved',
            'bg-red-100 text-red-800': proposal.status === 'rejected'
          }">
            {{ 
              proposal.status === 'pending' ? '待審核' : 
              (proposal.status === 'approved' ? '已批准' : '已拒絕') 
            }}
          </span>
        </div>
        
        <div class="mb-4">
          <p class="text-gray-800">{{ proposal.summary }}</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <span class="text-gray-500 text-sm">類別:</span>
            <p>{{ proposal.category }}</p>
          </div>
          <div>
            <span class="text-gray-500 text-sm">預算範圍:</span>
            <p>NT$ {{ formatNumber(proposal.budget.min) }} - {{ formatNumber(proposal.budget.max) }}</p>
          </div>
          <div>
            <span class="text-gray-500 text-sm">時程:</span>
            <p>{{ proposal.timeframe }} 天</p>
          </div>
        </div>
        
        <div class="border-t border-gray-200 pt-4">
          <div class="flex justify-end space-x-2">
            <button 
              @click="viewProposalDetails(proposal._id)"
              class="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
            >
              查看詳情
            </button>
            
            <template v-if="proposal.status === 'pending'">
              <button 
                @click="approveProposal(proposal._id)"
                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                批准
              </button>
              <button 
                @click="rejectProposal(proposal._id)"
                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                拒絕
              </button>
            </template>
            
            <button 
              v-else-if="proposal.status === 'approved'"
              @click="featureProposal(proposal._id)"
              :class="{
                'px-4 py-2 rounded': true,
                'bg-purple-500 text-white hover:bg-purple-600': !proposal.featured,
                'bg-gray-300 text-gray-700': proposal.featured
              }"
            >
              {{ proposal.featured ? '取消推薦' : '推薦' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- 無數據提示 -->
      <div
        v-if="proposals.length === 0"
        class="text-center py-8 text-gray-500 bg-white rounded-lg shadow"
      >
        暫無提案數據
      </div>
    </div>
    
    <!-- 分頁 -->
    <div class="mt-6 flex justify-between items-center">
      <div class="text-sm text-gray-500">
        共 {{ totalProposals }} 個提案
      </div>
      <div class="flex space-x-2">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          :class="[
            'px-3 py-1 rounded border',
            currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
          ]"
        >
          上一頁
        </button>
        <button 
          @click="nextPage" 
          :disabled="currentPage * pageSize >= totalProposals"
          :class="[
            'px-3 py-1 rounded border',
            currentPage * pageSize >= totalProposals ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
          ]"
        >
          下一頁
        </button>
      </div>
    </div>
    
    <!-- 拒絕提案模態框 -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-lg p-6">
        <h2 class="text-xl font-bold mb-4">拒絕提案</h2>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">拒絕原因</label>
          <textarea 
            v-model="rejectReason" 
            class="w-full p-2 border rounded"
            rows="4" 
            placeholder="請輸入拒絕原因..."
          ></textarea>
        </div>
        
        <div class="flex justify-end space-x-2">
          <button 
            @click="closeRejectModal" 
            class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
          >
            取消
          </button>
          <button 
            @click="confirmReject" 
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            確認拒絕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 提案列表數據
const proposals = ref<any[]>([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(5)
const totalProposals = ref(0)

// 拒絕提案相關
const showRejectModal = ref(false)
const rejectReason = ref('')
const rejectingProposalId = ref<string | null>(null)

// 格式化時間
const formatDate = (date: string | Date | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleString()
}

// 格式化數字
const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}

// 分頁控制
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchProposals()
  }
}

const nextPage = () => {
  if (currentPage.value * pageSize.value < totalProposals.value) {
    currentPage.value++
    fetchProposals()
  }
}

// 獲取提案列表
const fetchProposals = async () => {
  loading.value = true
  try {
    const queryParams = new URLSearchParams()
    if (searchQuery.value) queryParams.append('search', searchQuery.value)
    if (statusFilter.value) queryParams.append('status', statusFilter.value)
    queryParams.append('page', currentPage.value.toString())
    queryParams.append('limit', pageSize.value.toString())

    // 這裡假設有對應的 API，如果沒有實際 API，可以使用模擬數據
    // const response = await fetch(`/api/admin/proposals?${queryParams.toString()}`)
    // const data = await response.json()
    
    // if (data.success && data.data) {
    //   proposals.value = data.data.proposals
    //   totalProposals.value = data.data.total
    // } else {
    //   throw new Error(data.message || '獲取提案列表失敗')
    // }
    
    // 模擬延遲
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 使用模擬數據
    simulateProposalData()
  } catch (err) {
    console.error('獲取提案列表失敗:', err)
  } finally {
    loading.value = false
  }
}

// 模擬提案數據
const simulateProposalData = () => {
  const mockProposals = []
  const categories = ['Web開發', '移動應用', '數據分析', 'AI項目', '區塊鏈', 'UI/UX設計']
  const statuses = ['pending', 'approved', 'rejected']
  
  for (let i = 1; i <= 15; i++) {
    const status = statusFilter.value || statuses[i % 3]
    if (statusFilter.value && status !== statusFilter.value) continue
    
    mockProposals.push({
      _id: `prop_${i}`,
      title: `提案 ${i}: ${categories[i % categories.length]}專案`,
      summary: `這是一個關於${categories[i % categories.length]}的項目提案，希望能夠得到平台的支持和認可。`,
      category: categories[i % categories.length],
      budget: {
        min: 50000 + (i * 10000),
        max: 100000 + (i * 15000)
      },
      timeframe: 30 + (i % 60),
      status: status,
      featured: i % 5 === 0,
      creator: {
        _id: `user_${i}`,
        name: `提案者 ${i}`,
        email: `proposer${i}@example.com`
      },
      createdAt: new Date(Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000))
    })
  }
  
  proposals.value = mockProposals.slice(0, pageSize.value)
  totalProposals.value = 28
}

// 查看提案詳情
const viewProposalDetails = (id: string) => {
  // 實際應該跳轉到提案詳情頁面
  router.push(`/admin/proposals/${id}`)
}

// 批准提案
const approveProposal = async (id: string) => {
  try {
    loading.value = true
    
    // 實際應該調用 API 批准提案
    // const response = await fetch(`/api/admin/proposals/${id}/approve`, {
    //   method: 'PATCH'
    // })
    // const data = await response.json()
    
    // 模擬延遲
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 更新本地狀態
    const index = proposals.value.findIndex(p => p._id === id)
    if (index !== -1) {
      proposals.value[index].status = 'approved'
    }
    
  } catch (err) {
    console.error('批准提案失敗:', err)
  } finally {
    loading.value = false
  }
}

// 打開拒絕提案模態框
const rejectProposal = (id: string) => {
  rejectingProposalId.value = id
  rejectReason.value = ''
  showRejectModal.value = true
}

// 關閉拒絕提案模態框
const closeRejectModal = () => {
  showRejectModal.value = false
  rejectingProposalId.value = null
}

// 確認拒絕提案
const confirmReject = async () => {
  if (!rejectingProposalId.value) return
  
  try {
    loading.value = true
    
    // 實際應該調用 API 拒絕提案
    // const response = await fetch(`/api/admin/proposals/${rejectingProposalId.value}/reject`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ reason: rejectReason.value })
    // })
    // const data = await response.json()
    
    // 模擬延遲
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 更新本地狀態
    const index = proposals.value.findIndex(p => p._id === rejectingProposalId.value)
    if (index !== -1) {
      proposals.value[index].status = 'rejected'
    }
    
    // 關閉模態框
    closeRejectModal()
    
  } catch (err) {
    console.error('拒絕提案失敗:', err)
  } finally {
    loading.value = false
  }
}

// 設置提案為推薦
const featureProposal = async (id: string) => {
  try {
    loading.value = true
    
    // 獲取提案是否已推薦
    const proposal = proposals.value.find(p => p._id === id)
    const featured = proposal?.featured
    
    // 實際應該調用 API 設置推薦狀態
    // const response = await fetch(`/api/admin/proposals/${id}/feature`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ featured: !featured })
    // })
    // const data = await response.json()
    
    // 模擬延遲
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 更新本地狀態
    const index = proposals.value.findIndex(p => p._id === id)
    if (index !== -1) {
      proposals.value[index].featured = !featured
    }
    
  } catch (err) {
    console.error('設置提案推薦狀態失敗:', err)
  } finally {
    loading.value = false
  }
}

// 初始化
onMounted(() => {
  fetchProposals()
})
</script> 