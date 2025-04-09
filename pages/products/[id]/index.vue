<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- 載入中 -->
      <div v-if="pending" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
      </div>

      <!-- 錯誤提示 -->
      <div v-else-if="error" class="text-center py-8 text-red-500">
        載入創意資料時發生錯誤
      </div>

      <!-- 創意詳情 -->
      <template v-else-if="product">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- 左側：創意資訊 -->
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <div class="relative">
                <img :src="product.image" :alt="product.name" class="w-full h-64 object-cover">
                <div class="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full">
                  <span class="text-sm font-medium" :class="statusClass">{{ statusLabels[product.status as keyof typeof statusLabels] }}</span>
                </div>
              </div>
              
              <div class="p-6">
                <h1 class="text-2xl font-bold mb-4">{{ product.name }}</h1>
                <p class="text-gray-600 mb-6">{{ product.description }}</p>
                
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-500">分類：</span>
                    <span class="font-medium">{{ categoryLabels[product.category as keyof typeof categoryLabels] }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">預計尺寸：</span>
                    <span class="font-medium">{{ product.dimensions }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">預計規格：</span>
                    <span class="font-medium">{{ product.travelDistance }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">瀏覽次數：</span>
                    <span class="font-medium">{{ product.views }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 創意圖片集 -->
            <div v-if="product.images?.length > 0" class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-lg font-semibold mb-4">創意圖片</h2>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div 
                  v-for="(image, index) in product.images" 
                  :key="index"
                  class="relative aspect-square"
                >
                  <img 
                    :src="image" 
                    :alt="`${product.name} 圖片 ${index + 1}`"
                    class="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    @click="openImageViewer(index)"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- 右側：提案相關 -->
          <div class="space-y-6">
            <!-- 創建者資訊 -->
            <div v-if="product.user" class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-lg font-semibold mb-4">創意提出者</h2>
              <div class="flex items-center">
                <img :src="product.user.avatar" :alt="product.user.name" class="w-12 h-12 rounded-full mr-4">
                <div>
                  <h3 class="font-medium">{{ product.user.name }}</h3>
                  <p class="text-sm text-gray-500">創意者</p>
                </div>
              </div>
            </div>
            <div v-else class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-lg font-semibold mb-4">創意提出者</h2>
              <p class="text-gray-500">暫無資料</p>
            </div>

            <!-- 贊助按鈕 (所有用戶都可以看到) -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-lg font-semibold mb-4">支持這個創意</h2>
              
              <!-- 募資進度 (募資階段顯示) -->
              <div v-if="product.status === 'fundraising' && product.targetFunding" class="mb-4">
                <div class="flex justify-between text-sm mb-1">
                  <span>已籌集</span>
                  <span class="font-medium">NT$ {{ formatNumber(product.currentFunding || 0) }}</span>
                </div>
                <div class="flex justify-between text-sm mb-2">
                  <span>目標金額</span>
                  <span class="font-medium">NT$ {{ formatNumber(product.targetFunding) }}</span>
                </div>
                <div class="w-full h-3 bg-gray-200 rounded-full">
                  <div 
                    class="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full" 
                    :style="`width: ${Math.min(((product.currentFunding || 0) / product.targetFunding) * 100, 100)}%`"
                  ></div>
                </div>
                <div class="mt-2 text-xs text-gray-500 text-right">
                  已達成 {{ Math.floor(((product.currentFunding || 0) / product.targetFunding) * 100) }}%
                </div>
              </div>
              
              <p class="text-sm text-gray-600 mb-4">您的贊助將幫助這個創意成為現實！</p>
              <button 
                @click="openSponsorDialog"
                class="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg transition-colors duration-300 font-medium"
              >
                <i class="pi pi-heart-fill mr-2"></i>
                贊助這個創意
              </button>
            </div>

            <!-- 工程師操作區 -->
            <div v-if="userStore.hasRole(UserRole.ENGINEER) && !isAssignedEngineer" class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-lg font-semibold mb-4">工程師專區</h2>
              <div v-if="product.status === 'idea' && !hasProposed && !product.engineer" class="text-center">
                <p class="text-gray-600 mb-4">對這個創意有興趣嗎？提交您的實現方案！</p>
                <button
                  @click="router.push(`/products/${product._id}/propose`)"
                  class="w-full bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
                >
                  提交提案
                </button>
              </div>
              <div v-else-if="hasProposed" class="text-center">
                <p class="text-gray-600">您已提交提案，請等待創意者審核</p>
              </div>
              <div v-else class="text-center">
                <p class="text-gray-600">此創意目前無法提案</p>
              </div>
            </div>

            <!-- 被選中的工程師確認區 -->
            <div v-if="isAssignedEngineer && !product.engineerConfirmed" class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-lg font-semibold mb-4">確認接案</h2>
              <p class="text-gray-600 mb-4">創意者已選擇您的提案！請確認是否接受此案件。</p>
              <button
                @click="handleEngineerConfirm"
                :disabled="confirmLoading"
                class="w-full bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
              >
                <i v-if="confirmLoading" class="pi pi-spinner animate-spin mr-2"></i>
                <span>{{ confirmLoading ? '確認中...' : '確認接案' }}</span>
              </button>
            </div>

            <!-- 提案列表 -->
            <div v-if="canViewProposals" class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-lg font-semibold mb-4">工程提案</h2>
              
              <!-- 提案卡片 -->
              <div v-if="product.proposals?.length > 0" class="space-y-4">
                <div 
                  v-for="proposal in product.proposals" 
                  :key="proposal._id"
                  class="border rounded-lg p-4"
                  :class="{
                    'border-primary-500 bg-primary-50': proposal.status === 'accepted',
                    'border-gray-200': proposal.status === 'pending',
                    'border-gray-200 opacity-50': proposal.status === 'rejected'
                  }"
                >
                  <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center">
                      <img 
                        :src="proposal.engineer.avatar" 
                        :alt="proposal.engineer.name"
                        class="w-8 h-8 rounded-full mr-3"
                      >
                      <div>
                        <div class="font-medium">{{ proposal.engineer.name }}</div>
                        <div class="text-sm text-gray-500">
                          {{ new Date(proposal.createdAt).toLocaleDateString() }}
                        </div>
                      </div>
                    </div>
                    <div>
                      <span 
                        class="text-sm px-2 py-1 rounded-full"
                        :class="{
                          'bg-primary-100 text-primary-700': proposal.status === 'accepted',
                          'bg-gray-100 text-gray-700': proposal.status === 'pending',
                          'bg-gray-100 text-gray-500': proposal.status === 'rejected'
                        }"
                      >
                        {{ proposalStatusLabels[proposal.status] }}
                      </span>
                    </div>
                  </div>

                  <div class="text-gray-600 mb-3">{{ proposal.content }}</div>

                  <div class="flex justify-between text-sm">
                    <div>
                      <span class="text-gray-500">預估時間：</span>
                      <span class="font-medium">{{ proposal.estimatedTime }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">預估費用：</span>
                      <span class="font-medium">${{ proposal.estimatedCost.toLocaleString() }}</span>
                    </div>
                  </div>

                  <!-- 創意者的操作按鈕 -->
                  <div 
                    v-if="isIdeator && product.status === 'idea' && proposal.status === 'pending'"
                    class="mt-4 flex justify-end"
                  >
                    <button
                      @click="handleAcceptProposal(proposal._id)"
                      :disabled="acceptLoading"
                      class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                    >
                      <i v-if="acceptLoading" class="pi pi-spinner animate-spin mr-2"></i>
                      <span>{{ acceptLoading ? '處理中...' : '選擇此提案' }}</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- 無提案提示 -->
              <div v-else class="text-center py-4 text-gray-500">
                目前還沒有工程師提案
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 圖片查看器 -->
    <Dialog
      v-model:visible="imageViewerVisible"
      :modal="true"
      :dismissableMask="true"
      :closable="true"
      class="image-viewer"
    >
      <template #container="{ closeCallback }">
        <div class="relative">
          <img 
            :src="currentImage" 
            :alt="product?.name"
            class="max-w-full max-h-[80vh] object-contain"
          >
          <button
            @click="closeCallback"
            class="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>
      </template>
    </Dialog>
    
    <!-- 贊助對話框 -->
    <Dialog 
      v-model:visible="sponsorDialogVisible" 
      modal 
      header="贊助此創意" 
      :style="{ width: '90%', maxWidth: '500px' }"
      :closable="!processingPayment"
    >
      <div class="p-4">
        <h3 class="text-xl font-bold mb-4">{{ product?.name }}</h3>
        
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">選擇贊助金額</label>
          <div class="grid grid-cols-3 gap-3 mb-4">
            <button 
              v-for="amount in [100, 500, 1000]" 
              :key="amount"
              @click="sponsorAmount = amount"
              class="py-2 px-4 rounded-lg border-2 transition-colors"
              :class="sponsorAmount === amount 
                ? 'border-primary-500 bg-primary-50 text-primary-700' 
                : 'border-gray-300 hover:border-gray-400'"
            >
              NT$ {{ amount }}
            </button>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">自訂金額</label>
            <InputNumber 
              v-model="sponsorAmount" 
              inputId="currency-taiwan" 
              mode="currency" 
              currency="TWD" 
              locale="zh-TW"
              :min="50"
              class="w-full"
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">留言 (選填)</label>
            <Textarea 
              v-model="sponsorMessage" 
              rows="3" 
              class="w-full"
              placeholder="給創意者的鼓勵..."
            />
          </div>

          <!-- 支付方式選擇 -->
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">選擇支付方式</label>
            <div class="grid grid-cols-2 gap-3">
              <div 
                v-for="method in paymentMethods" 
                :key="method.value"
                @click="selectedPaymentMethod = method.value"
                class="border-2 rounded-lg p-3 cursor-pointer transition-colors flex items-center"
                :class="selectedPaymentMethod === method.value 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-300 hover:border-gray-400'"
              >
                <div class="flex-shrink-0 mr-3">
                  <img :src="method.icon" :alt="method.label" class="w-8 h-8 object-contain">
                </div>
                <div>
                  <p class="font-medium">{{ method.label }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 贊助摘要 -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 class="font-bold mb-2">贊助摘要</h4>
          <div class="flex justify-between text-sm mb-2">
            <span>贊助金額</span>
            <span>NT$ {{ sponsorAmount }}</span>
          </div>
          <div class="flex justify-between text-sm mb-2">
            <span>手續費</span>
            <span>NT$ 0</span>
          </div>
          <div class="border-t border-gray-300 my-2"></div>
          <div class="flex justify-between font-bold">
            <span>總計</span>
            <span>NT$ {{ sponsorAmount }}</span>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <Button 
            @click="sponsorDialogVisible = false" 
            text 
            label="取消" 
            :disabled="processingPayment"
          />
          <Button 
            @click="processSponsor" 
            label="確認贊助" 
            :loading="processingPayment"
            severity="success"
            :disabled="!selectedPaymentMethod || sponsorAmount < 50"
          />
        </div>
      </div>
    </Dialog>

    <!-- 贊助成功對話框 -->
    <Dialog
      v-model:visible="sponsorSuccessDialogVisible"
      modal
      header="贊助成功"
      :style="{ width: '90%', maxWidth: '500px' }"
    >
      <div class="p-4 text-center">
        <div class="mb-6">
          <div class="flex justify-center mb-4">
            <i class="pi pi-check-circle text-green-500 text-5xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-2">感謝您的贊助！</h3>
          <p class="text-gray-600 mb-4">您的支持將幫助這個創意成為現實</p>
          <div class="bg-gray-50 p-4 rounded-lg mb-4 text-left">
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">交易編號：</span>
              <span class="font-medium">{{ lastTransaction?.transactionId }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">贊助金額：</span>
              <span class="font-medium">NT$ {{ lastTransaction?.amount }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">交易日期：</span>
              <span class="font-medium">{{ formatDate(lastTransaction?.date) }}</span>
            </div>
          </div>
        </div>
        <div class="flex justify-center">
          <Button 
            @click="sponsorSuccessDialogVisible = false" 
            label="關閉" 
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '~/stores/user'
import { UserRole } from '~/server/models/User'
import { useToast } from 'primevue/usetoast'
import { useNuxtApp } from '#app'
import type { AuthDialog } from '~/plugins/auth-dialog'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const toast = useToast()
const nuxtApp = useNuxtApp()

// 狀態標籤
const statusLabels = {
  idea: '創意階段',
  in_progress: '製作中',
  fundraising: '募資中',
  completed: '已完成'
}

// 狀態樣式
const statusClass = computed(() => {
  switch (product.value?.status) {
    case 'idea': return 'text-blue-600'
    case 'in_progress': return 'text-yellow-600'
    case 'fundraising': return 'text-green-600'
    case 'completed': return 'text-gray-600'
    default: return ''
  }
})

// 分類標籤
const categoryLabels = {
  '3c': '3C科技',
  home: '居家生活',
  travel: '旅遊戶外',
  health: '健康美容',
  food: '美食',
  education: '教育學習',
  entertainment: '娛樂休閒',
  other: '其他'
}

// 提案狀態標籤
const proposalStatusLabels = {
  pending: '待審核',
  accepted: '已接受',
  rejected: '已婉拒'
}

// 載入狀態
const loading = ref(false)
const confirmLoading = ref(false)
const acceptLoading = ref(false)

// 圖片查看器
const imageViewerVisible = ref(false)
const currentImageIndex = ref(0)
const currentImage = computed(() => product.value?.images[currentImageIndex.value])

const openImageViewer = (index: number) => {
  currentImageIndex.value = index
  imageViewerVisible.value = true
}

// 獲取創意詳情
interface ProductResponse {
  success: boolean;
  data: {
    _id: string;
    name: string;
    description: string;
    status: string;
    category: string;
    dimensions: string;
    travelDistance: string;
    image: string;
    images: string[];
    views: number;
    user: {
      _id: string;
      name: string;
      avatar: string;
    };
    engineer: {
      _id: string;
      name: string;
      avatar: string;
    } | null;
    proposals: Array<{
      _id: string;
      engineer: {
        _id: string;
        name: string;
        avatar: string;
      };
      content: string;
      estimatedTime: string;
      estimatedCost: number;
      status: 'pending' | 'accepted' | 'rejected';
      createdAt: string;
    }>;
    engineerConfirmed: boolean;
    ideatorConfirmed: boolean;
    currentFunding?: number;
    targetFunding?: number;
  };
}

const { data: productResponse, pending, error } = await useFetch<ProductResponse>(`/api/products/${route.params.id}`, {
  credentials: 'include'
})

const product = computed(() => productResponse.value?.data)

// 權限檢查
const isIdeator = computed(() => 
  userStore.isLoggedIn && 
  product.value?.user?._id === userStore.currentUser?._id
)

const isAssignedEngineer = computed(() =>
  userStore.isLoggedIn &&
  product.value?.engineer?._id === userStore.currentUser?._id
)

const hasProposed = computed(() =>
  userStore.isLoggedIn &&
  product.value?.proposals?.some(p => p.engineer._id === userStore.currentUser?._id)
)

const canViewProposals = computed(() =>
  isIdeator.value || // 創意者可以看
  isAssignedEngineer.value || // 被選中的工程師可以看
  (product.value?.status === 'idea' && !product.value?.engineer) // 創意階段且未有工程師時，所有人都可以看
)

// 工程師確認接案
const handleEngineerConfirm = async () => {
  try {
    confirmLoading.value = true
    const { error } = await useFetch(`/api/products/${route.params.id}/engineer-confirm`, {
      method: 'post',
      credentials: 'include'
    })

    if (error.value) {
      throw new Error(error.value.message || '確認失敗')
    }

    toast.add({
      severity: 'success',
      summary: '確認成功',
      detail: '您已確認接受此案件',
      life: 3000
    })

    // 重新載入頁面
    await refreshNuxtData()
  } catch (error: any) {
    console.error('確認失敗:', error)
    toast.add({
      severity: 'error',
      summary: '確認失敗',
      detail: error.message || '確認時發生錯誤',
      life: 5000
    })
  } finally {
    confirmLoading.value = false
  }
}

// 創意者接受提案
const handleAcceptProposal = async (proposalId: string) => {
  try {
    acceptLoading.value = true
    const { error } = await useFetch(`/api/products/${route.params.id}/proposals/${proposalId}/accept`, {
      method: 'post',
      credentials: 'include'
    })

    if (error.value) {
      throw new Error(error.value.message || '接受提案失敗')
    }

    toast.add({
      severity: 'success',
      summary: '接受成功',
      detail: '您已接受此工程師的提案',
      life: 3000
    })

    // 重新載入頁面
    await refreshNuxtData()
  } catch (error: any) {
    console.error('接受提案失敗:', error)
    toast.add({
      severity: 'error',
      summary: '接受失敗',
      detail: error.message || '接受提案時發生錯誤',
      life: 5000
    })
  } finally {
    acceptLoading.value = false
  }
}

// 支付方式選項
const paymentMethods = [
  { 
    label: '信用卡', 
    value: 'credit_card',
    icon: '/icons/credit-card.svg' 
  },
  { 
    label: 'LINE Pay', 
    value: 'line_pay',
    icon: '/icons/line-pay.svg' 
  },
  { 
    label: 'Apple Pay', 
    value: 'apple_pay',
    icon: '/icons/apple-pay.svg' 
  },
  { 
    label: 'Google Pay', 
    value: 'google_pay',
    icon: '/icons/google-pay.svg' 
  }
]

// 贊助相關狀態
const sponsorDialogVisible = ref(false)
const sponsorSuccessDialogVisible = ref(false)
const sponsorAmount = ref(100)
const sponsorMessage = ref('')
const selectedPaymentMethod = ref('')
const processingPayment = ref(false)
const lastTransaction = ref<{ transactionId: string; amount: number; date: string } | null>(null)

// 格式化日期
const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-TW')
}

// 用於格式化數字
const formatNumber = (num: number | null | undefined) => {
  try {
    if (num === null || num === undefined) return '0'
    const value = parseFloat(String(num))
    if (isNaN(value)) return '0'
    return value.toLocaleString()
  } catch {
    return '0'
  }
}

// 開啟贊助對話框
const openSponsorDialog = () => {
  if (!userStore.isLoggedIn) {
    // 提示用戶需要登入
    toast.add({ severity: 'info', summary: '請先登入', detail: '您需要登入才能贊助創意', life: 3000 });
    
    // 直接重定向到登入頁面
    console.log('重定向到登入頁面');
    router.push('/login?redirect=' + encodeURIComponent(route.fullPath));
    return;
  }
  
  console.log('用戶已登入，打開贊助對話框');
  sponsorDialogVisible.value = true;
}

// 處理贊助流程
const processSponsor = async () => {
  try {
    // 參數驗證
    if (sponsorAmount.value < 50) {
      toast.add({ 
        severity: 'warn', 
        summary: '金額過低', 
        detail: '最低贊助金額為 NT$ 50', 
        life: 3000 
      })
      return
    }

    if (!selectedPaymentMethod.value) {
      toast.add({ 
        severity: 'warn', 
        summary: '請選擇支付方式', 
        detail: '請選擇一種支付方式進行贊助', 
        life: 3000 
      })
      return
    }

    processingPayment.value = true
    
    // 呼叫贊助 API
    interface SponsorResponse {
      success: boolean;
      message: string;
      data: {
        transactionId: string;
        amount: number;
        date: string;
      };
    }

    const { data } = await useFetch<SponsorResponse>(`/api/products/${route.params.id}/sponsor`, {
      method: 'POST',
      body: {
        amount: sponsorAmount.value,
        message: sponsorMessage.value,
        paymentMethod: selectedPaymentMethod.value
      },
      credentials: 'include'
    })

    const response = data.value as SponsorResponse | null;
    
    if (response && response.success) {
      lastTransaction.value = response.data;
      sponsorDialogVisible.value = false;
      // 顯示成功對話框
      setTimeout(() => {
        sponsorSuccessDialogVisible.value = true
      }, 500)
      
      // 重置表單
      sponsorAmount.value = 100
      sponsorMessage.value = ''
      selectedPaymentMethod.value = ''
      
      // 如果是募資階段，則刷新頁面以更新募資金額
      if (product.value?.status === 'fundraising') {
        await refreshNuxtData()
      }
    } else {
      throw new Error(response?.message || '贊助處理失敗')
    }
  } catch (error: any) {
    console.error('贊助失敗:', error)
    toast.add({ 
      severity: 'error', 
      summary: '贊助失敗', 
      detail: error.message || '處理您的贊助時發生錯誤，請稍後再試', 
      life: 3000 
    })
  } finally {
    processingPayment.value = false
  }
}
</script>

<style scoped>
.image-viewer :deep(.p-dialog-content) {
  @apply p-0 bg-black/90;
}
</style> 