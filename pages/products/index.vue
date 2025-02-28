<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold">所有作品</h1>
          <div v-if="userStore.isLoggedIn" class="mt-2 text-sm text-gray-600">
            當前身份：
            <span v-if="userStore.hasRole(UserRole.ENGINEER)" class="text-blue-600 font-medium">工程師</span>
            <span v-if="userStore.hasRole(UserRole.IDEATOR)" class="text-green-600 font-medium">創意者</span>
            <span v-if="userStore.hasRole(UserRole.VENDOR)" class="text-purple-600 font-medium">廠商</span>
            <span v-if="userStore.hasRole(UserRole.VISITOR)" class="text-gray-600 font-medium">訪客</span>
            <div class="mt-1 text-xs text-gray-500">
              <div>用戶ID: {{ userStore.currentUser?._id }}</div>
              <div>角色列表: {{ userStore.currentUser?.roles?.map(r => `${r.type}(${r.isActive ? '啟用' : '停用'})`) }}</div>
              <div class="flex items-center gap-2">
                <span>當前角色:</span>
                <Dropdown
                  v-model="selectedRole"
                  :options="availableRoles"
                  optionLabel="label"
                  optionValue="value"
                  class="w-32"
                  :loading="switchingRole"
                  :disabled="switchingRole"
                  @update:modelValue="handleRoleChange"
                />
              </div>
            </div>
          </div>
        </div>
        <button 
          v-if="userStore.isLoggedIn && userStore.hasRole(UserRole.IDEATOR)"
          @click="router.push('/products/create')"
          class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center"
        >
          <i class="pi pi-plus mr-2"></i>
          建立新創意
        </button>
      </div>

      <div class="mb-8 flex flex-wrap gap-4">
        <button 
          v-for="status in statuses" 
          :key="status"
          @click="() => handleStatusChange(status)"
          class="px-4 py-2 rounded-lg"
          :class="currentStatus === status ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'"
        >
          {{ statusLabels[status] }}
        </button>
      </div>

      <div v-if="pending" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
      </div>

      <div v-else-if="error" class="text-center py-8 text-red-500">
        載入資料時發生錯誤
      </div>

      <template v-else>
        <div v-if="products?.length > 0" class="space-y-6">
          <NuxtLink 
            v-for="product in products" 
            :key="product._id" 
            :to="`/products/${product._id}`" 
            class="block"
          >
            <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex">
              <div class="relative w-72">
                <img :src="product?.image || ''" :alt="product?.name || ''" class="w-full h-48 object-cover rounded-l-lg">
                <div class="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full flex items-center">
                  <span class="text-yellow-500 mr-1">★</span>
                  <span class="text-sm font-medium">{{ formatRating(product.averageRating) }}</span>
                </div>
                <div class="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded-full">
                  <span class="text-sm font-medium" :class="{
                    'text-blue-600': product.status === 'idea',
                    'text-yellow-600': product.status === 'in_progress',
                    'text-green-600': product.status === 'fundraising',
                    'text-gray-600': product.status === 'completed'
                  }">{{ statusLabels[product.status as keyof typeof statusLabels] }}</span>
                </div>
              </div>
              <div class="flex-1 p-6">
                <div class="flex justify-between items-start mb-3">
                  <h3 class="font-semibold text-xl">{{ product?.name || '' }}</h3>
                  <button
                    v-if="userStore.hasRole(UserRole.ENGINEER) && product.status === 'idea' && !product.engineer"
                    @click.stop="router.push(`/products/${product._id}/propose`)"
                    class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm"
                  >
                    提交提案
                  </button>
                </div>
                <p class="text-gray-600 mb-4">{{ product?.description || '' }}</p>
                <div class="flex justify-between items-center mt-auto">
                  <div class="text-primary-600 font-medium text-lg">{{ displayPrice(product) }}</div>
                  <div class="text-gray-500">{{ formatNumber(product?.views) }} 次瀏覽</div>
                </div>
                
                <!-- 募資中狀態顯示贊助按鈕和進度 -->
                <div v-if="product.status === 'fundraising'" class="mt-4">
                  <!-- 募資進度 -->
                  <div v-if="product.targetFunding" class="mb-3">
                    <div class="flex justify-between text-sm mb-1">
                      <span>募資進度</span>
                      <span>{{ formatNumber(product.currentFunding || 0) }} / {{ formatNumber(product.targetFunding) }} NT$</span>
                    </div>
                    <div class="w-full h-3 bg-gray-200 rounded-full">
                      <div 
                        class="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full" 
                        :style="`width: ${Math.min(((product.currentFunding || 0) / product.targetFunding) * 100, 100)}%`"
                      ></div>
                    </div>
                  </div>

                  <button 
                    @click.stop="router.push(`/products/${product._id}`)"
                    class="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                  >
                    <i class="pi pi-heart-fill mr-2"></i>
                    查看詳情並贊助
                  </button>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          目前沒有相關作品
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '~/stores/user'
import { UserRole } from '~/server/models/User'
import { useToast } from 'primevue/usetoast'

interface Comment {
  _id: string;
  content: string;
  rating: number;
  date: string;
  likes: number;
  user: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  comments: Comment[];
  views: number;
  status: string;
  averageRating?: number;
  engineer: {
    _id: string;
    name: string;
    avatar: string;
  } | null;
  currentFunding?: number;
  targetFunding?: number;
}

interface ApiResponse {
  success: boolean;
  data: Product[];
}

type ProductStatus = 'all' | 'idea' | 'in_progress' | 'fundraising' | 'completed'

const currentStatus = ref<ProductStatus>('all')

// 從路由參數獲取初始狀態
const route = useRoute()
const initialStatus = computed(() => {
  const statusParam = route.query.status as ProductStatus
  return statuses.includes(statusParam) ? statusParam : 'all'
})

// 監聽狀態變化並更新路由
const router = useRouter()
watch(currentStatus, (newStatus) => {
  if (newStatus === 'all') {
    router.replace({ query: {} })
  } else {
    router.replace({ query: { status: newStatus } })
  }
})

// 初始化狀態
onMounted(() => {
  currentStatus.value = initialStatus.value
})

const statusLabels: Record<ProductStatus, string> = {
  all: '全部',
  idea: '創意階段',
  in_progress: '製作中',
  fundraising: '募資中',
  completed: '已完成'
}

const statuses: ProductStatus[] = ['all', 'idea', 'in_progress', 'fundraising', 'completed']

const handleStatusChange = (status: ProductStatus) => {
  currentStatus.value = status
}

const userStore = useUserStore()
const toast = useToast()

const { data: apiResponse, pending, error } = await useFetch<ApiResponse>('/api/products', {
  query: computed(() => ({
    status: currentStatus.value === 'all' ? undefined : currentStatus.value,
    sort: '-createdAt'
  }))
})

const products = computed(() => {
  try {
    return apiResponse.value?.data?.filter(p => 
      p && 
      typeof p === 'object' && 
      Array.isArray(p.comments)
    ).map(p => ({
      ...p,
      averageRating: calculateAverageRating(p.comments)
    })) || []
  } catch {
    return []
  }
})

const calculateAverageRating = (comments: Comment[]) => {
  if (!comments || comments.length === 0) return 0
  const sum = comments.reduce((acc, comment) => acc + (comment.rating || 0), 0)
  return sum / comments.length
}

const formatRating = (rating: number | null | undefined) => {
  try {
    if (rating === null || rating === undefined) return '0.0'
    const value = parseFloat(String(rating))
    if (isNaN(value)) return '0.0'
    return value.toFixed(1)
  } catch {
    return '0.0'
  }
}

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

// 修改價格顯示邏輯
const displayPrice = (product: Product) => {
  if (product.status === 'idea' || product.status === 'in_progress') {
    return '尚未定價'
  }
  return `$${formatNumber(product.price)}`
}

const selectedRole = ref(userStore.currentRole)
const switchingRole = ref(false)

// 獲取可用角色列表
const availableRoles = computed(() => {
  const roles = userStore.currentUser?.roles || []
  return roles
    .filter(r => r.isActive)
    .map(r => ({
      label: {
        [UserRole.ENGINEER]: '工程師',
        [UserRole.IDEATOR]: '創意者',
        [UserRole.VENDOR]: '廠商',
        [UserRole.VISITOR]: '訪客',
        [UserRole.ADMIN]: '管理員'
      }[r.type],
      value: r.type
    }))
})

// 處理角色切換
const handleRoleChange = async (value: UserRole) => {
  if (value === userStore.currentRole) return

  try {
    switchingRole.value = true
    await userStore.switchRole(value)
    // 重新載入頁面數據
    await refreshNuxtData()
  } catch (error: any) {
    // 如果切換失敗，恢復為原來的角色
    selectedRole.value = userStore.currentRole
    // 顯示錯誤提示
    toast.add({
      severity: 'error',
      summary: '切換失敗',
      detail: error.message || '角色切換失敗',
      life: 3000
    })
  } finally {
    switchingRole.value = false
  }
}
</script> 