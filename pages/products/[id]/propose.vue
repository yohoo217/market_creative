<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-3xl">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h1 class="text-3xl font-bold mb-8">提交工程提案</h1>

        <!-- 權限檢查 -->
        <div v-if="!userStore.isLoggedIn || !userStore.hasRole(UserRole.ENGINEER)" class="text-center py-8">
          <div class="text-red-500 mb-4">
            <i class="pi pi-exclamation-circle text-4xl"></i>
          </div>
          <h2 class="text-xl font-semibold mb-2">權限不足</h2>
          <p class="text-gray-600 mb-4">只有工程師才能提交提案</p>
          <button 
            @click="router.back()"
            class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            返回上一頁
          </button>
        </div>

        <!-- 創意資訊 -->
        <div v-else-if="product" class="mb-8">
          <div class="border-b pb-4 mb-6">
            <h2 class="text-xl font-semibold mb-2">{{ product.name }}</h2>
            <p class="text-gray-600">{{ product.description }}</p>
          </div>

          <!-- 提案表單 -->
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="space-y-2">
              <label for="content" class="block font-medium text-gray-700">提案內容</label>
              <textarea
                id="content"
                v-model="form.content"
                required
                rows="6"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="請詳細描述您的實現方案、使用技術、製作流程等..."
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label for="estimatedTime" class="block font-medium text-gray-700">預估時間</label>
                <input
                  id="estimatedTime"
                  v-model="form.estimatedTime"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="例如：2 週"
                />
              </div>

              <div class="space-y-2">
                <label for="estimatedCost" class="block font-medium text-gray-700">預估費用</label>
                <div class="relative">
                  <span class="absolute left-4 top-2 text-gray-500">$</span>
                  <input
                    id="estimatedCost"
                    v-model="form.estimatedCost"
                    type="number"
                    min="0"
                    required
                    class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="輸入金額"
                  />
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                @click="router.back()"
                class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
              >
                取消
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center"
              >
                <i v-if="loading" class="pi pi-spinner animate-spin mr-2"></i>
                <span>{{ loading ? '提交中...' : '提交提案' }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- 載入中 -->
        <div v-else-if="pending" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
        </div>

        <!-- 錯誤提示 -->
        <div v-else-if="error" class="text-center py-8 text-red-500">
          載入創意資料時發生錯誤
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '~/stores/user'
import { UserRole } from '~/server/models/User'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const toast = useToast()

const form = ref({
  content: '',
  estimatedTime: '',
  estimatedCost: 0
})

const loading = ref(false)

// 獲取創意詳情
interface ProductResponse {
  success: boolean;
  data: {
    _id: string;
    name: string;
    description: string;
    status: string;
    // ... 其他必要欄位
  };
}

const { data: productResponse, pending, error } = await useFetch<ProductResponse>(`/api/products/${route.params.id}`, {
  credentials: 'include'
})

const product = computed(() => productResponse.value?.data)

// 提交提案
const handleSubmit = async () => {
  try {
    loading.value = true

    const { data, error } = await useFetch(`/api/products/${route.params.id}/proposals`, {
      method: 'post',
      body: form.value,
      credentials: 'include'
    })

    if (error.value) {
      throw new Error(error.value.message || '提交提案失敗')
    }

    toast.add({
      severity: 'success',
      summary: '提交成功',
      detail: '您的提案已成功提交',
      life: 3000
    })

    // 返回創意詳情頁
    router.push(`/products/${route.params.id}`)
  } catch (error: any) {
    console.error('提交提案失敗:', error)
    toast.add({
      severity: 'error',
      summary: '提交失敗',
      detail: error.message || '提交提案時發生錯誤',
      life: 5000
    })
  } finally {
    loading.value = false
  }
}
</script> 