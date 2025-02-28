<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- 頂部導航和返回按鈕 -->
      <div class="mb-8">
        <div class="flex items-center mb-2">
          <Button 
            icon="pi pi-arrow-left" 
            text 
            class="p-button-rounded p-button-text mr-2" 
            @click="router.go(-1)" 
          />
          <h1 class="text-3xl font-bold text-gray-800">提案評估</h1>
        </div>
        <Breadcrumb :model="breadcrumbItems" class="border-none p-0 mb-4" />
        
        <!-- 產品信息卡片 -->
        <div v-if="product" class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div class="grid grid-cols-1 md:grid-cols-4">
            <div class="md:col-span-1">
              <img 
                :src="product.image || '/images/default-idea.jpg'" 
                :alt="product.name" 
                class="w-full h-full object-cover md:h-48 lg:h-full"
              >
            </div>
            <div class="p-5 md:col-span-3">
              <div class="flex justify-between items-start">
                <div>
                  <h2 class="text-xl font-bold mb-2">{{ product.name }}</h2>
                  <Tag 
                    :value="statusLabels[product.status]" 
                    :severity="getStatusSeverity(product.status)" 
                    class="mb-3" 
                  />
                </div>
                <Button 
                  icon="pi pi-external-link" 
                  text 
                  @click="router.push(`/products/${productId}`)" 
                  tooltip="查看完整創意" 
                  tooltipOptions="top"
                />
              </div>
              <p class="text-gray-600 mb-4">{{ product.description }}</p>
              <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                <div>
                  <i class="pi pi-comments mr-1"></i> {{ proposals.length }} 個提案
                </div>
                <div>
                  <i class="pi pi-eye mr-1"></i> {{ product.views || 0 }} 次瀏覽
                </div>
                <div>
                  <i class="pi pi-calendar mr-1"></i> 發布於 {{ formatDate(product.createdAt) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 加載中 -->
      <div v-if="loading" class="py-16 text-center">
        <ProgressSpinner style="width:50px;height:50px" strokeWidth="4" animationDuration=".5s" />
        <p class="text-gray-500 mt-4">正在加載提案列表...</p>
      </div>
      
      <!-- 錯誤提示 -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-md p-8 text-center my-8">
        <i class="pi pi-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <div class="text-red-500 text-lg font-medium mb-4">{{ error }}</div>
        <p class="text-gray-600 mb-6">無法加載提案列表，請稍後再試</p>
        <Button label="重新加載" icon="pi pi-refresh" @click="fetchData" />
      </div>
      
      <!-- 沒有提案時顯示 -->
      <div v-else-if="proposals.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center my-8">
        <img src="/images/empty-proposals.svg" alt="暫無提案" class="w-48 h-48 mx-auto mb-4 opacity-60">
        <h3 class="text-xl font-semibold mb-2">暫無工程師提案</h3>
        <p class="text-gray-600 mb-6 max-w-lg mx-auto">
          還沒有工程師對此創意提交提案。請耐心等待，工程師們可能正在評估您的創意並準備精彩的提案。
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <Button label="刷新頁面" icon="pi pi-refresh" outlined @click="fetchData" />
          <Button label="回到我的創意" icon="pi pi-arrow-left" @click="router.push('/products/my-ideas')" />
        </div>
      </div>
      
      <!-- 提案列表 -->
      <div v-else>
        <!-- 排序和篩選 -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">全部提案 ({{ proposals.length }})</h2>
          <div class="flex gap-2">
            <Dropdown
              v-model="sortBy"
              :options="sortOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="排序方式"
              class="w-48"
            />
          </div>
        </div>
        
        <!-- 提案卡片 -->
        <div class="space-y-6">
          <div 
            v-for="proposal in sortedProposals" 
            :key="proposal._id" 
            class="bg-white rounded-lg shadow-md overflow-hidden border-l-4"
            :class="getBorderColor(proposal.status)"
          >
            <div class="p-5">
              <div class="flex flex-col md:flex-row justify-between gap-4">
                <!-- 工程師信息 -->
                <div class="flex gap-4 items-start">
                  <Avatar 
                    :image="proposal.engineer.avatar" 
                    :label="proposal.engineer.username?.charAt(0)" 
                    size="large"
                    shape="circle" 
                    class="bg-primary-100 text-primary-700"
                  />
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-semibold">{{ proposal.engineer.username }}</span>
                      <Tag v-if="proposal.engineer.verified" value="已認證" severity="success" />
                    </div>
                    <div class="text-sm text-gray-500 mb-1">經驗: {{ proposal.engineer.experience || '暫無資料' }}</div>
                    <Rating v-model="proposal.engineer.rating" readonly :cancel="false" class="mb-2" />
                    <div class="text-xs text-gray-500">提交於 {{ formatDate(proposal.createdAt) }}</div>
                  </div>
                </div>
                
                <!-- 狀態標籤和金額 -->
                <div class="text-right">
                  <Badge 
                    :value="getProposalStatusLabel(proposal.status)" 
                    :severity="getProposalStatusSeverity(proposal.status)" 
                    class="mb-2"
                  />
                  <div class="text-2xl font-bold text-primary-700 mb-1">
                    NT$ {{ formatPrice(proposal.price) }}
                  </div>
                  <div class="text-sm text-gray-500">估計完成時間: {{ proposal.estimatedTime || '未提供' }}</div>
                </div>
              </div>
              
              <!-- 提案內容 -->
              <div class="mt-4 pt-4 border-t border-gray-100">
                <h3 class="font-semibold text-gray-800 mb-2">提案說明</h3>
                <p class="text-gray-600 mb-4 whitespace-pre-line">{{ proposal.description }}</p>
                
                <div v-if="proposal.attachments && proposal.attachments.length > 0" class="mb-4">
                  <h3 class="font-semibold text-gray-800 mb-2">附件</h3>
                  <div class="flex flex-wrap gap-2">
                    <div 
                      v-for="(attachment, index) in proposal.attachments" 
                      :key="index"
                      class="border border-gray-200 rounded p-2 flex items-center gap-2"
                    >
                      <i class="pi pi-file text-primary-500"></i>
                      <a :href="attachment.url" target="_blank" class="text-primary-600 hover:underline">
                        {{ attachment.name }}
                      </a>
                    </div>
                  </div>
                </div>
                
                <!-- 技術方案 -->
                <div v-if="proposal.technicalSolution" class="mb-4">
                  <h3 class="font-semibold text-gray-800 mb-2">技術方案</h3>
                  <div 
                    class="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    v-html="proposal.technicalSolution"
                  ></div>
                </div>
                
                <!-- 里程碑 -->
                <div v-if="proposal.milestones && proposal.milestones.length > 0" class="mb-4">
                  <h3 class="font-semibold text-gray-800 mb-2">提案里程碑</h3>
                  <Timeline :value="proposal.milestones" class="mb-2">
                    <template #content="slotProps">
                      <div class="text-sm">
                        <h4 class="font-medium mb-1">{{ slotProps.item.name }}</h4>
                        <p class="text-gray-600">{{ slotProps.item.description }}</p>
                        <div class="text-xs text-gray-500 mt-1">預計時間: {{ slotProps.item.duration }}</div>
                      </div>
                    </template>
                  </Timeline>
                </div>
                
                <!-- 操作按鈕 -->
                <div class="mt-4 flex flex-col sm:flex-row gap-3">
                  <Button 
                    v-if="proposal.status === 'pending'"
                    label="接受提案" 
                    icon="pi pi-check" 
                    severity="success" 
                    @click="showAcceptDialog(proposal)"
                    class="flex-1"
                  />
                  <Button 
                    v-if="proposal.status === 'pending'"
                    label="婉拒提案" 
                    icon="pi pi-times" 
                    severity="danger" 
                    outlined
                    @click="showRejectDialog(proposal)"
                    class="flex-1"
                  />
                  <Button 
                    label="聯繫工程師" 
                    icon="pi pi-comments" 
                    outlined 
                    @click="contactEngineer(proposal)"
                    class="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 接受提案確認對話框 -->
      <Dialog 
        v-model:visible="acceptDialogVisible" 
        modal 
        header="確認接受提案" 
        :style="{ width: '450px' }"
        :closable="!acceptLoading"
      >
        <div class="p-4">
          <i class="pi pi-check-circle text-green-500 text-3xl mb-4 block text-center"></i>
          <p class="mb-4">您即將接受來自 <span class="font-bold">{{ selectedProposal?.engineer?.username }}</span> 的提案，並開始合作。</p>
          <p class="text-sm text-gray-600 mb-2">接受提案後會發生：</p>
          <ul class="list-disc list-inside text-sm text-gray-600 mb-4">
            <li>您的創意狀態將更改為「製作中」</li>
            <li>其他提案將自動被拒絕</li>
            <li>系統將通知工程師您已接受提案</li>
            <li>您可以開始與工程師溝通詳細需求</li>
          </ul>
          <div class="bg-blue-50 p-3 rounded-lg text-blue-700 text-sm">
            <i class="pi pi-info-circle mr-2"></i>
            提示：接受提案前，建議先與工程師溝通確認細節，以確保雙方對專案範圍和期望有共識。
          </div>
        </div>
        <template #footer>
          <Button 
            label="取消" 
            icon="pi pi-times" 
            text 
            @click="acceptDialogVisible = false" 
            :disabled="acceptLoading" 
          />
          <Button 
            label="確認接受" 
            icon="pi pi-check" 
            severity="success" 
            @click="confirmAcceptProposal" 
            :loading="acceptLoading" 
          />
        </template>
      </Dialog>
      
      <!-- 拒絕提案確認對話框 -->
      <Dialog 
        v-model:visible="rejectDialogVisible" 
        modal 
        header="婉拒提案" 
        :style="{ width: '500px' }"
        :closable="!rejectLoading"
      >
        <div class="p-4">
          <p class="mb-4">您即將婉拒來自 <span class="font-bold">{{ selectedProposal?.engineer?.username }}</span> 的提案。</p>
          <div class="mb-4">
            <label for="rejectReason" class="block text-gray-700 font-medium mb-2">拒絕原因（可選）</label>
            <Textarea 
              id="rejectReason" 
              v-model="rejectReason" 
              rows="4" 
              placeholder="請提供拒絕理由，這將幫助工程師理解並提高未來提案質量..." 
              class="w-full"
            />
          </div>
          <div class="bg-yellow-50 p-3 rounded-lg text-yellow-700 text-sm">
            <i class="pi pi-exclamation-triangle mr-2"></i>
            提示：即使拒絕此提案，工程師仍然可以查看您的創意並提交新的提案。
          </div>
        </div>
        <template #footer>
          <Button 
            label="取消" 
            icon="pi pi-times" 
            text 
            @click="rejectDialogVisible = false" 
            :disabled="rejectLoading" 
          />
          <Button 
            label="確認拒絕" 
            icon="pi pi-times" 
            severity="danger" 
            @click="confirmRejectProposal" 
            :loading="rejectLoading" 
          />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const productId = computed(() => route.params.id as string)
const product = ref(null)
const proposals = ref([])
const loading = ref(true)
const error = ref('')

// 面包屑
const breadcrumbItems = computed(() => [
  { label: '首頁', to: '/' },
  { label: '我的創意', to: '/products/my-ideas' },
  { label: '創意詳情', to: `/products/${productId.value}` },
  { label: '提案評估' }
])

// 排序選項
const sortBy = ref('newest')
const sortOptions = [
  { label: '最新提交', value: 'newest' },
  { label: '最舊提交', value: 'oldest' },
  { label: '金額 (低到高)', value: 'price-asc' },
  { label: '金額 (高到低)', value: 'price-desc' },
  { label: '工程師評分 (高到低)', value: 'rating-desc' },
]

// 狀態標籤
const statusLabels = {
  idea: '創意階段',
  in_progress: '製作中',
  fundraising: '募資中',
  completed: '已完成'
}

// 提案狀態
const proposalStatusLabels = {
  pending: '待處理',
  accepted: '已接受',
  rejected: '已拒絕',
  completed: '已完成',
  cancelled: '已取消'
}

// 提案相關狀態
const selectedProposal = ref(null)
const acceptDialogVisible = ref(false)
const acceptLoading = ref(false)
const rejectDialogVisible = ref(false)
const rejectLoading = ref(false)
const rejectReason = ref('')

// 排序後的提案列表
const sortedProposals = computed(() => {
  const result = [...proposals.value]
  switch (sortBy.value) {
    case 'newest':
      return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'oldest':
      return result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    case 'price-asc':
      return result.sort((a, b) => (a.price || 0) - (b.price || 0))
    case 'price-desc':
      return result.sort((a, b) => (b.price || 0) - (a.price || 0))
    case 'rating-desc':
      return result.sort((a, b) => (b.engineer?.rating || 0) - (a.engineer?.rating || 0))
    default:
      return result
  }
})

// 獲取提案狀態標籤
const getProposalStatusLabel = (status) => {
  return proposalStatusLabels[status] || status
}

// 獲取提案狀態嚴重性
const getProposalStatusSeverity = (status) => {
  switch (status) {
    case 'pending': return 'info'
    case 'accepted': return 'success'
    case 'rejected': return 'danger'
    case 'completed': return 'success'
    case 'cancelled': return 'warning'
    default: return 'info'
  }
}

// 獲取產品狀態嚴重性
const getStatusSeverity = (status) => {
  switch (status) {
    case 'idea': return 'info'
    case 'in_progress': return 'warning'
    case 'fundraising': return 'success'
    case 'completed': return 'success'
    default: return 'info'
  }
}

// 獲取提案邊框顏色
const getBorderColor = (status) => {
  switch (status) {
    case 'pending': return 'border-blue-500'
    case 'accepted': return 'border-green-500'
    case 'rejected': return 'border-red-500'
    case 'completed': return 'border-purple-500'
    case 'cancelled': return 'border-orange-500'
    default: return 'border-gray-300'
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知日期'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'short', day: 'numeric' })
}

// 格式化價格
const formatPrice = (price) => {
  if (!price) return '0'
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 獲取數據
const fetchData = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // 獲取產品詳情
    await fetchProductDetails()
    // 獲取提案列表
    await fetchProposals()
  } catch (err) {
    console.error('獲取數據失敗:', err)
    error.value = err.message || '獲取數據失敗'
  } finally {
    loading.value = false
  }
}

// 獲取產品詳情
const fetchProductDetails = async () => {
  try {
    // 模擬 API 調用 - 實際開發中應使用真實 API
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 示例數據
    product.value = {
      _id: productId.value,
      name: '智能水杯提醒系統',
      description: '一款能夠提醒用戶按時喝水的智能水杯，通過LED指示燈和手機App通知用戶，並記錄每日飲水量。該產品針對經常忘記喝水的辦公室工作者和健身愛好者，幫助他們養成良好的飲水習慣。',
      image: '/images/product-sample-1.jpg',
      status: 'idea',
      views: 120,
      createdAt: '2023-10-15T08:30:00.000Z'
    }
  } catch (err) {
    console.error('獲取產品詳情失敗:', err)
    throw new Error('獲取產品詳情失敗')
  }
}

// 獲取提案列表
const fetchProposals = async () => {
  try {
    // 模擬 API 調用 - 實際開發中應使用真實 API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 示例數據
    proposals.value = [
      {
        _id: '1',
        engineer: {
          _id: 'e1',
          username: '李工程師',
          avatar: '/images/engineer-avatar-1.jpg',
          verified: true,
          rating: 4.5,
          experience: '5年硬件開發經驗'
        },
        price: 35000,
        estimatedTime: '約 2 個月',
        description: '我擁有豐富的智能硬件開發經驗，尤其專注於IoT設備和移動應用集成。您的智能水杯概念非常有市場前景，我可以幫助您從概念到成品的全過程開發。\n\n我計劃使用低功耗藍牙技術實現與手機的連接，並設計一套簡單直觀的用戶界面。水杯本身將使用環保材料，內置LED提示燈和長效電池。',
        technicalSolution: '<p>硬件規格：</p><ul><li>主控芯片：ESP32 低功耗藍牙模塊</li><li>電池：200mAh 可充電鋰電池</li><li>顯示：RGB LED環形指示燈</li><li>傳感器：液位傳感器，溫度傳感器</li><li>外殼材質：食品級不銹鋼內膽 + 環保塑料外殼</li></ul><p>軟件規格：</p><ul><li>移動應用：iOS/Android 原生應用</li><li>功能：飲水提醒，飲水記錄，習慣追蹤，溫度顯示</li><li>數據同步：藍牙即時同步 + 雲端備份</li></ul>',
        milestones: [
          { name: '需求確認和原型設計', description: '確認詳細需求，完成工業設計和電路設計原型', duration: '2週' },
          { name: '硬件開發', description: '開發電路板，集成傳感器和藍牙模塊，完成初步硬件測試', duration: '3週' },
          { name: '軟件開發', description: '開發移動應用和嵌入式固件，實現基本功能', duration: '4週' },
          { name: '集成測試和優化', description: '系統集成測試，解決問題並優化性能和電池壽命', duration: '2週' },
          { name: '最終產品和文檔', description: '完成最終產品和技術文檔，準備小批量生產', duration: '1週' }
        ],
        status: 'pending',
        createdAt: '2023-10-20T14:25:00.000Z'
      },
      {
        _id: '2',
        engineer: {
          _id: 'e2',
          username: '張工程師',
          avatar: '/images/engineer-avatar-2.jpg',
          verified: true,
          rating: 5,
          experience: '3年物聯網開發經驗'
        },
        price: 30000,
        estimatedTime: '約 10 週',
        description: '看到您的創意後很感興趣，我有多個智能家居產品的開發經驗，包括帶有傳感器的智能設備。\n\n我的方案將專注於用戶體驗和長效電池壽命，讓用戶輕鬆養成飲水習慣而無需頻繁充電。移動應用將提供健康建議和數據分析功能。',
        attachments: [
          { name: '概念設計圖.pdf', url: '#' },
          { name: '技術方案.docx', url: '#' }
        ],
        status: 'pending',
        createdAt: '2023-10-22T09:15:00.000Z'
      },
      {
        _id: '3',
        engineer: {
          _id: 'e3',
          username: '王工程師',
          avatar: null,
          verified: false,
          rating: 3.5,
          experience: '2年嵌入式系統開發'
        },
        price: 25000,
        estimatedTime: '約 3 個月',
        description: '我可以幫助實現這款智能水杯，並會專注於成本控制和實用性，適合市場推廣。我的設計將簡單易用，確保大眾用戶能輕鬆上手。',
        status: 'pending',
        createdAt: '2023-10-25T16:40:00.000Z'
      }
    ]
  } catch (err) {
    console.error('獲取提案列表失敗:', err)
    throw new Error('獲取提案列表失敗')
  }
}

// 顯示接受提案對話框
const showAcceptDialog = (proposal) => {
  selectedProposal.value = proposal
  acceptDialogVisible.value = true
}

// 確認接受提案
const confirmAcceptProposal = async () => {
  if (!selectedProposal.value?._id) return
  
  acceptLoading.value = true
  try {
    // 模擬 API 調用 - 實際開發中應使用真實 API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 更新提案狀態
    proposals.value.forEach(proposal => {
      if (proposal._id === selectedProposal.value._id) {
        proposal.status = 'accepted'
      } else if (proposal.status === 'pending') {
        proposal.status = 'rejected'
      }
    })
    
    // 更新產品狀態
    product.value.status = 'in_progress'
    
    toast.add({
      severity: 'success',
      summary: '提案已接受',
      detail: `您已成功接受 ${selectedProposal.value.engineer.username} 的提案，項目狀態已更新為"製作中"`,
      life: 5000
    })
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: err.message || '接受提案時發生錯誤',
      life: 3000
    })
  } finally {
    acceptLoading.value = false
    acceptDialogVisible.value = false
  }
}

// 顯示拒絕提案對話框
const showRejectDialog = (proposal) => {
  selectedProposal.value = proposal
  rejectReason.value = ''
  rejectDialogVisible.value = true
}

// 確認拒絕提案
const confirmRejectProposal = async () => {
  if (!selectedProposal.value?._id) return
  
  rejectLoading.value = true
  try {
    // 模擬 API 調用 - 實際開發中應使用真實 API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 更新提案狀態
    proposals.value.forEach(proposal => {
      if (proposal._id === selectedProposal.value._id) {
        proposal.status = 'rejected'
      }
    })
    
    toast.add({
      severity: 'info',
      summary: '提案已拒絕',
      detail: `您已拒絕 ${selectedProposal.value.engineer.username} 的提案`,
      life: 3000
    })
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: err.message || '拒絕提案時發生錯誤',
      life: 3000
    })
  } finally {
    rejectLoading.value = false
    rejectDialogVisible.value = false
  }
}

// 聯繫工程師
const contactEngineer = (proposal) => {
  // 實際開發中應實現聊天功能或郵件發送
  toast.add({
    severity: 'info',
    summary: '功能開發中',
    detail: `聊天功能正在開發中，暫時無法與 ${proposal.engineer.username} 聯繫`,
    life: 3000
  })
}

// 頁面載入時獲取數據
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* 卡片懸停效果 */
.bg-white.rounded-lg {
  transition: all 0.3s ease;
}
.bg-white.rounded-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* 按鈕動畫 */
.p-button {
  transition: all 0.3s ease;
}
.p-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style> 