<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-2xl font-bold mb-6">管理員控制台</h1>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- 統計卡片 -->
      <div class="bg-white rounded-lg shadow p-6 flex items-center">
        <div class="rounded-full bg-blue-100 p-3 mr-4">
          <div class="text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <div>
          <div class="text-sm text-gray-500">用戶總數</div>
          <div class="text-xl font-bold">{{ stats.userCount || 0 }}</div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6 flex items-center">
        <div class="rounded-full bg-green-100 p-3 mr-4">
          <div class="text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
        <div>
          <div class="text-sm text-gray-500">商品總數</div>
          <div class="text-xl font-bold">{{ stats.productCount || 0 }}</div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6 flex items-center">
        <div class="rounded-full bg-purple-100 p-3 mr-4">
          <div class="text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        <div>
          <div class="text-sm text-gray-500">提案總數</div>
          <div class="text-xl font-bold">{{ stats.proposalCount || 0 }}</div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6 flex items-center">
        <div class="rounded-full bg-yellow-100 p-3 mr-4">
          <div class="text-yellow-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
        </div>
        <div>
          <div class="text-sm text-gray-500">今日訪問量</div>
          <div class="text-xl font-bold">{{ stats.visitCount || 0 }}</div>
        </div>
      </div>
    </div>
    
    <!-- 功能入口 -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink to="/admin/users" class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center mb-4">
          <div class="rounded-full bg-blue-100 p-3 mr-4">
            <div class="text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <h2 class="text-lg font-semibold">用戶管理</h2>
        </div>
        <p class="text-gray-600">管理用戶帳號、角色權限和資料</p>
      </NuxtLink>
      
      <NuxtLink to="/admin/products" class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center mb-4">
          <div class="rounded-full bg-green-100 p-3 mr-4">
            <div class="text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <h2 class="text-lg font-semibold">商品管理</h2>
        </div>
        <p class="text-gray-600">管理商品、類別、價格和庫存</p>
      </NuxtLink>
      
      <NuxtLink to="/admin/proposals" class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center mb-4">
          <div class="rounded-full bg-purple-100 p-3 mr-4">
            <div class="text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <h2 class="text-lg font-semibold">提案管理</h2>
        </div>
        <p class="text-gray-600">審核和管理創意提案</p>
      </NuxtLink>
      
      <NuxtLink to="/admin/analytics" class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center mb-4">
          <div class="rounded-full bg-yellow-100 p-3 mr-4">
            <div class="text-yellow-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
          </div>
          <h2 class="text-lg font-semibold">數據分析</h2>
        </div>
        <p class="text-gray-600">查看平台使用數據和業務報表</p>
      </NuxtLink>
      
      <NuxtLink to="/admin/settings" class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center mb-4">
          <div class="rounded-full bg-red-100 p-3 mr-4">
            <div class="text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <h2 class="text-lg font-semibold">系統設置</h2>
        </div>
        <p class="text-gray-600">平台基本設置和參數配置</p>
      </NuxtLink>
      
      <NuxtLink to="/admin/seed" class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center mb-4">
          <div class="rounded-full bg-indigo-100 p-3 mr-4">
            <div class="text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
          </div>
          <h2 class="text-lg font-semibold">數據初始化</h2>
        </div>
        <p class="text-gray-600">初始化或重置系統數據</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 儀表板統計數據
const stats = ref({
  userCount: 0,
  productCount: 0,
  proposalCount: 0,
  visitCount: 0
})

// 獲取統計數據
async function fetchStats() {
  try {
    const response = await fetch('/api/admin/stats')
    const data = await response.json()
    
    if (data.success) {
      stats.value = data.data
    }
  } catch (error) {
    console.error('獲取統計數據失敗:', error)
  }
}

onMounted(() => {
  fetchStats()
})
</script> 