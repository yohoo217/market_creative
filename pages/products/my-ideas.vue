<template>
  <div class="min-h-screen bg-gray-50 py-8 pb-16">
    <div class="container mx-auto px-4">
      <!-- 頂部導航和狀態卡片 -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">我的創意</h1>
            <p class="text-gray-600 mt-2">管理您發布的所有創意及其狀態</p>
          </div>
          <Button 
            @click="router.push('/products/create')"
            class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-all duration-300 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-1"
            icon="pi pi-plus"
            label="建立新創意"
          />
        </div>
        
        <!-- 狀態卡片 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-gray-500 text-sm">創意階段</p>
                <p class="text-2xl font-bold mt-1">{{ getStatusCount('idea') }}</p>
              </div>
              <div class="bg-blue-100 p-2 rounded-lg">
                <i class="pi pi-lightbulb text-blue-500 text-xl"></i>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-3">等待工程師提案</p>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-gray-500 text-sm">製作中</p>
                <p class="text-2xl font-bold mt-1">{{ getStatusCount('in_progress') }}</p>
              </div>
              <div class="bg-yellow-100 p-2 rounded-lg">
                <i class="pi pi-cog text-yellow-500 text-xl"></i>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-3">工程師正在開發</p>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-gray-500 text-sm">募資中</p>
                <p class="text-2xl font-bold mt-1">{{ getStatusCount('fundraising') }}</p>
              </div>
              <div class="bg-green-100 p-2 rounded-lg">
                <i class="pi pi-money-bill text-green-500 text-xl"></i>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-3">正在進行群眾募資</p>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-gray-500 text-sm">已完成</p>
                <p class="text-2xl font-bold mt-1">{{ getStatusCount('completed') }}</p>
              </div>
              <div class="bg-purple-100 p-2 rounded-lg">
                <i class="pi pi-check-circle text-purple-500 text-xl"></i>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-3">完成並上市銷售</p>
          </div>
        </div>
      </div>
      
      <!-- 篩選工具欄 -->
      <div class="bg-white rounded-lg shadow-md p-4 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex flex-wrap gap-2">
            <Button 
              :class="[filterStatus === 'all' ? 'p-button-primary' : 'p-button-outlined']" 
              label="全部" 
              @click="filterStatus = 'all'"
            />
            <Button 
              :class="[filterStatus === 'idea' ? 'p-button-primary' : 'p-button-outlined']" 
              label="創意階段" 
              @click="filterStatus = 'idea'"
            />
            <Button 
              :class="[filterStatus === 'in_progress' ? 'p-button-primary' : 'p-button-outlined']" 
              label="製作中" 
              @click="filterStatus = 'in_progress'"
            />
            <Button 
              :class="[filterStatus === 'fundraising' ? 'p-button-primary' : 'p-button-outlined']" 
              label="募資中" 
              @click="filterStatus = 'fundraising'"
            />
            <Button 
              :class="[filterStatus === 'completed' ? 'p-button-primary' : 'p-button-outlined']" 
              label="已完成" 
              @click="filterStatus = 'completed'"
            />
          </div>
          
          <div class="flex gap-2">
            <span class="p-input-icon-left w-full md:w-auto">
              <i class="pi pi-search" />
              <InputText 
                v-model="searchQuery" 
                placeholder="搜尋創意..." 
                class="w-full"
              />
            </span>
            
            <Dropdown
              v-model="sortBy"
              :options="sortOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="排序方式"
              class="w-full md:w-48"
            />
          </div>
        </div>
      </div>

      <!-- 加載中 -->
      <div v-if="loading" class="py-16 text-center">
        <ProgressSpinner style="width:50px;height:50px" strokeWidth="4" animationDuration=".5s" />
        <p class="text-gray-500 mt-4">正在加載您的創意列表...</p>
      </div>

      <!-- 錯誤提示 -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-md p-8 text-center my-8">
        <i class="pi pi-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <div class="text-red-500 text-lg font-medium mb-4">{{ error }}</div>
        <p class="text-gray-600 mb-6">無法加載您的創意列表，請稍後再試</p>
        <Button label="重新加載" icon="pi pi-refresh" @click="fetchMyIdeas" />
      </div>

      <!-- 沒有創意時顯示 -->
      <div v-else-if="filteredIdeas.length === 0 && myIdeas.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center my-8">
        <img src="/empty-box.svg" alt="沒有創意" class="w-48 h-48 mx-auto mb-6 opacity-60">
        <h3 class="text-2xl font-semibold mb-3">您還沒有發布任何創意</h3>
        <p class="text-gray-600 mb-6 max-w-lg mx-auto">開始創建您的第一個創意，讓工程師幫您實現它！您的想法可能就是下一個改變世界的產品。</p>
        <Button label="創建新創意" icon="pi pi-plus" size="large" @click="router.push('/products/create')" />
      </div>
      
      <!-- 篩選後沒有結果 -->
      <div v-else-if="filteredIdeas.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center my-8">
        <img src="/empty-proposals.svg" alt="沒有符合條件的結果" class="w-40 h-40 mx-auto mb-4 opacity-60">
        <h3 class="text-xl font-semibold mb-2">沒有符合條件的創意</h3>
        <p class="text-gray-600 mb-6">嘗試調整您的篩選條件或搜尋關鍵詞</p>
        <Button label="清除篩選" icon="pi pi-filter-slash" @click="clearFilters" />
      </div>

      <!-- 創意列表 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="idea in filteredIdeas" 
          :key="idea._id" 
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <div class="relative">
            <img 
              :src="idea.image || '/default-product-image.png'" 
              :alt="idea.name" 
              class="w-full h-48 object-cover"
            >
            <div class="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full shadow-sm">
              <span class="text-sm font-medium" :class="getStatusClass(idea.status)">
                {{ statusLabels[idea.status] }}
              </span>
            </div>
            
            <div v-if="idea.proposalCount > 0" class="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-full shadow-sm">
              <span class="text-sm font-medium">{{ idea.proposalCount }} 個提案</span>
            </div>
          </div>
          
          <div class="p-5">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold line-clamp-1 flex-1">{{ idea.name }}</h3>
              <Badge 
                v-if="getNewestProposal(idea)" 
                value="新" 
                severity="info" 
                class="animate-pulse"
              />
            </div>
            
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ idea.description }}</p>
            
            <div class="grid grid-cols-2 gap-2 mb-4">
              <div class="bg-gray-50 rounded p-2">
                <div class="text-xs text-gray-500">瀏覽次數</div>
                <div class="font-medium">{{ idea.views || 0 }}</div>
              </div>
              <div class="bg-gray-50 rounded p-2">
                <div class="text-xs text-gray-500">發布時間</div>
                <div class="font-medium">{{ formatDate(idea.createdAt) }}</div>
              </div>
            </div>

            <div class="flex justify-between items-center">
              <Button 
                label="查看詳情" 
                icon="pi pi-eye" 
                class="p-button-outlined" 
                @click="router.push(`/products/${idea._id}`)" 
              />
              
              <Menu ref="menu" :model="getMenuItems(idea)" :popup="true" />
              <Button 
                icon="pi pi-ellipsis-v" 
                rounded 
                text 
                @click="(event) => menu[idea._id]?.toggle(event)" 
                aria-haspopup="true" 
                aria-controls="overlay_menu" 
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- 確認刪除對話框 -->
      <Dialog 
        v-model:visible="deleteDialogVisible" 
        modal 
        header="確認刪除" 
        :style="{ width: '450px' }"
        :closable="!deleteLoading"
      >
        <div class="p-4">
          <i class="pi pi-exclamation-triangle text-yellow-500 text-3xl mb-4 block text-center"></i>
          <p class="mb-4">確定要刪除創意 <span class="font-bold">{{ ideaToDelete?.name }}</span> 嗎？</p>
          <p class="text-red-500 text-sm">此操作無法撤銷，刪除後所有相關數據將永久丟失。</p>
        </div>
        <template #footer>
          <Button 
            label="取消" 
            icon="pi pi-times" 
            text 
            @click="deleteDialogVisible = false" 
            :disabled="deleteLoading" 
          />
          <Button 
            label="確認刪除" 
            icon="pi pi-trash" 
            severity="danger" 
            @click="confirmDelete" 
            :loading="deleteLoading" 
          />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores/user'
import { useToast } from 'primevue/usetoast'
import { MenuItem } from 'primevue/menuitem'

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()
const menu = reactive({})

const loading = ref(false)
const error = ref('')
const myIdeas = ref([])

// 篩選和排序
const filterStatus = ref('all')
const searchQuery = ref('')
const sortBy = ref('newest')
const sortOptions = [
  { label: '最新發布', value: 'newest' },
  { label: '最舊發布', value: 'oldest' },
  { label: '提案數量 (多到少)', value: 'proposals-desc' },
  { label: '提案數量 (少到多)', value: 'proposals-asc' },
  { label: '瀏覽次數 (多到少)', value: 'views-desc' },
  { label: '瀏覽次數 (少到多)', value: 'views-asc' }
]

// 過濾後的創意列表
const filteredIdeas = computed(() => {
  let result = [...myIdeas.value]
  
  // 按狀態過濾
  if (filterStatus.value !== 'all') {
    result = result.filter(idea => idea.status === filterStatus.value)
  }
  
  // 按搜索關鍵詞過濾
  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase()
    result = result.filter(idea => 
      idea.name.toLowerCase().includes(keyword) || 
      idea.description.toLowerCase().includes(keyword)
    )
  }
  
  // 排序
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'proposals-desc':
        return (b.proposalCount || 0) - (a.proposalCount || 0)
      case 'proposals-asc':
        return (a.proposalCount || 0) - (b.proposalCount || 0)
      case 'views-desc':
        return (b.views || 0) - (a.views || 0)
      case 'views-asc':
        return (a.views || 0) - (b.views || 0)
      default:
        return 0
    }
  })
  
  return result
})

// 清除所有篩選條件
const clearFilters = () => {
  filterStatus.value = 'all'
  searchQuery.value = ''
  sortBy.value = 'newest'
}

// 獲取特定狀態的創意數量
const getStatusCount = (status) => {
  return myIdeas.value.filter(idea => idea.status === status).length
}

// 檢查是否有新提案
const getNewestProposal = (idea) => {
  // 示例判斷邏輯，可根據實際數據結構調整
  return idea.hasNewProposals || idea.unreadProposals > 0
}

// 刪除相關狀態
const deleteDialogVisible = ref(false)
const deleteLoading = ref(false)
const ideaToDelete = ref(null)

// 狀態標籤
const statusLabels = {
  idea: '創意階段',
  in_progress: '製作中',
  fundraising: '募資中',
  completed: '已完成'
}

// 獲取狀態樣式
const getStatusClass = (status) => {
  switch (status) {
    case 'idea': return 'text-blue-600'
    case 'in_progress': return 'text-yellow-600'
    case 'fundraising': return 'text-green-600'
    case 'completed': return 'text-purple-600'
    default: return ''
  }
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'short', day: 'numeric' })
}

// 獲取下拉菜單項目
const getMenuItems = (idea) => {
  const items = [
    {
      label: '編輯創意',
      icon: 'pi pi-pencil',
      command: () => router.push(`/products/${idea._id}/edit`)
    },
    {
      label: '查看提案',
      icon: 'pi pi-comments',
      command: () => router.push(`/products/${idea._id}/proposals`)
    }
  ]

  // 如果創意還在初始階段，允許刪除
  if (idea.status === 'idea') {
    items.push({
      label: '刪除創意',
      icon: 'pi pi-trash',
      class: 'text-red-500',
      command: () => showDeleteDialog(idea)
    })
  }

  return items
}

// 顯示刪除確認對話框
const showDeleteDialog = (idea) => {
  ideaToDelete.value = idea
  deleteDialogVisible.value = true
}

// 確認刪除創意
const confirmDelete = async () => {
  if (!ideaToDelete.value?._id) return
  
  deleteLoading.value = true
  try {
    const response = await fetch(`/api/products/${ideaToDelete.value._id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    
    const result = await response.json()
    
    if (result.success) {
      toast.add({ 
        severity: 'success', 
        summary: '刪除成功', 
        detail: '創意已成功刪除', 
        life: 3000 
      })
      
      // 從列表中移除已刪除的創意
      myIdeas.value = myIdeas.value.filter(idea => idea._id !== ideaToDelete.value._id)
    } else {
      throw new Error(result.message || '刪除失敗')
    }
  } catch (err) {
    toast.add({ 
      severity: 'error', 
      summary: '刪除失敗', 
      detail: err.message || '刪除創意時發生錯誤', 
      life: 3000 
    })
  } finally {
    deleteLoading.value = false
    deleteDialogVisible.value = false
  }
}

// 獲取自己的創意列表
const fetchMyIdeas = async () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // 模擬API調用 - 實際開發中應使用真實API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 示例數據
    myIdeas.value = [
      {
        _id: '1',
        name: '智能水杯提醒系統',
        description: '一款能夠提醒用戶按時喝水的智能水杯，通過LED指示燈和手機App通知用戶，並記錄每日飲水量。',
        image: '/default-product-image.png',
        status: 'idea',
        views: 120,
        proposalCount: 3,
        hasNewProposals: true,
        createdAt: '2023-10-15T08:30:00.000Z'
      },
      {
        _id: '2',
        name: '可折疊式太陽能充電板',
        description: '一款便攜、高效的可折疊太陽能充電板，適合戶外活動和應急使用，可為手機、平板等設備充電。',
        image: '/default-product-image.png',
        status: 'in_progress',
        views: 85,
        proposalCount: 2,
        hasNewProposals: false,
        createdAt: '2023-11-20T10:15:00.000Z'
      },
      {
        _id: '3',
        name: '智能家居控制中心',
        description: '一款集成各品牌智能家電控制的中央系統，支持語音控制、定時任務和場景模式，提升家居智能化體驗。',
        image: '/default-product-image.png',
        status: 'fundraising',
        views: 210,
        proposalCount: 5,
        hasNewProposals: false,
        createdAt: '2023-09-05T14:45:00.000Z'
      },
      {
        _id: '4',
        name: '便攜式空氣質量檢測儀',
        description: '一款小巧的空氣質量檢測儀器，可檢測PM2.5、甲醛、TVOC等有害物質，並通過App顯示數據和提供改善建議。',
        image: '/default-product-image.png',
        status: 'completed',
        views: 150,
        proposalCount: 1,
        hasNewProposals: false,
        createdAt: '2023-08-18T09:20:00.000Z'
      }
    ]
    
    // 初始化菜單引用
    myIdeas.value.forEach(idea => {
      menu[idea._id] = ref(null)
    })
    
  } catch (err) {
    console.error('獲取創意列表失敗:', err)
    error.value = '獲取創意列表失敗'
  } finally {
    loading.value = false
  }
}

// 頁面載入時獲取數據
onMounted(() => {
  fetchMyIdeas()
})
</script>

<style scoped>
/* 狀態卡片懸停效果 */
.bg-white.border-l-4 {
  transition: all 0.3s ease;
}
.bg-white.border-l-4:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* 創意卡片圖片效果 */
.bg-white.rounded-lg img {
  transition: all 0.5s ease;
}
.bg-white.rounded-lg:hover img {
  transform: scale(1.05);
}

/* 按鈕效果 */
.p-button {
  transition: all 0.3s ease;
}
.p-button:not(:disabled):hover {
  transform: translateY(-2px);
}
</style> 