<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">數據分析</h1>
    
    <!-- 日期範圍選擇 -->
    <div class="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap items-center gap-4">
      <div class="flex items-center">
        <span class="mr-2 text-gray-700">時間範圍:</span>
        <select 
          v-model="dateRange" 
          class="border rounded px-3 py-1"
          @change="fetchData"
        >
          <option value="7d">過去7天</option>
          <option value="30d">過去30天</option>
          <option value="90d">過去90天</option>
          <option value="year">過去一年</option>
          <option value="custom">自定義</option>
        </select>
      </div>
      
      <div v-if="dateRange === 'custom'" class="flex items-center flex-wrap gap-2">
        <div>
          <span class="mr-2 text-gray-700">從:</span>
          <input 
            type="date" 
            v-model="startDate" 
            class="border rounded px-2 py-1"
          />
        </div>
        <div>
          <span class="mr-2 text-gray-700">至:</span>
          <input 
            type="date" 
            v-model="endDate" 
            class="border rounded px-2 py-1"
          />
        </div>
        <button 
          @click="fetchData" 
          class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          應用
        </button>
      </div>
      
      <div class="ml-auto">
        <button 
          @click="exportData" 
          class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          導出數據
        </button>
      </div>
    </div>
    
    <!-- 儀表板統計卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium mb-1">總訪問量</h3>
        <div class="flex items-end">
          <p class="text-2xl font-bold text-gray-900">{{ formatNumber(stats.visits) }}</p>
          <span 
            :class="[
              'ml-2 text-sm',
              stats.visitsGrowth > 0 ? 'text-green-600' : 'text-red-600'
            ]"
          >
            {{ stats.visitsGrowth > 0 ? '+' : '' }}{{ stats.visitsGrowth }}%
          </span>
        </div>
        <p class="text-xs text-gray-500 mt-1">與上一時期相比</p>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium mb-1">新註冊用戶</h3>
        <div class="flex items-end">
          <p class="text-2xl font-bold text-gray-900">{{ formatNumber(stats.newUsers) }}</p>
          <span 
            :class="[
              'ml-2 text-sm',
              stats.newUsersGrowth > 0 ? 'text-green-600' : 'text-red-600'
            ]"
          >
            {{ stats.newUsersGrowth > 0 ? '+' : '' }}{{ stats.newUsersGrowth }}%
          </span>
        </div>
        <p class="text-xs text-gray-500 mt-1">與上一時期相比</p>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium mb-1">活躍用戶</h3>
        <div class="flex items-end">
          <p class="text-2xl font-bold text-gray-900">{{ formatNumber(stats.activeUsers) }}</p>
          <span 
            :class="[
              'ml-2 text-sm',
              stats.activeUsersGrowth > 0 ? 'text-green-600' : 'text-red-600'
            ]"
          >
            {{ stats.activeUsersGrowth > 0 ? '+' : '' }}{{ stats.activeUsersGrowth }}%
          </span>
        </div>
        <p class="text-xs text-gray-500 mt-1">與上一時期相比</p>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium mb-1">總收入</h3>
        <div class="flex items-end">
          <p class="text-2xl font-bold text-gray-900">NT$ {{ formatNumber(stats.revenue) }}</p>
          <span 
            :class="[
              'ml-2 text-sm',
              stats.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'
            ]"
          >
            {{ stats.revenueGrowth > 0 ? '+' : '' }}{{ stats.revenueGrowth }}%
          </span>
        </div>
        <p class="text-xs text-gray-500 mt-1">與上一時期相比</p>
      </div>
    </div>
    
    <!-- 圖表區域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 訪問量趨勢圖 -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium mb-4">訪問量趨勢</h3>
        <div class="h-64 flex items-center justify-center">
          <!-- 這裡實際會使用圖表組件，如 Chart.js、ECharts 等 -->
          <p class="text-gray-500">此處需要集成圖表庫<br/>模擬圖表顯示區域</p>
        </div>
      </div>
      
      <!-- 用戶活躍度 -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium mb-4">用戶活躍度</h3>
        <div class="h-64 flex items-center justify-center">
          <p class="text-gray-500">此處需要集成圖表庫<br/>模擬圖表顯示區域</p>
        </div>
      </div>
      
      <!-- 收入分析 -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium mb-4">收入分析</h3>
        <div class="h-64 flex items-center justify-center">
          <p class="text-gray-500">此處需要集成圖表庫<br/>模擬圖表顯示區域</p>
        </div>
      </div>
      
      <!-- 用戶分佈 -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium mb-4">用戶角色分佈</h3>
        <div class="h-64 flex items-center justify-center">
          <p class="text-gray-500">此處需要集成圖表庫<br/>模擬圖表顯示區域</p>
        </div>
      </div>
    </div>
    
    <!-- 熱門內容分析 -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-medium mb-4">熱門內容</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                內容名稱
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                類型
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                瀏覽次數
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                點讚數
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                評論數
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in popularContent" :key="index" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ item.title }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  item.type === 'product' ? 'bg-green-100 text-green-800' : 
                  (item.type === 'proposal' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800')
                ]">
                  {{ 
                    item.type === 'product' ? '商品' : 
                    (item.type === 'proposal' ? '提案' : '創意')
                  }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatNumber(item.views) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatNumber(item.likes) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatNumber(item.comments) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 最近活動 -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-medium mb-4">最近活動</h3>
      <div class="flow-root">
        <ul class="-mb-8">
          <li v-for="(activity, index) in recentActivities" :key="index">
            <div class="relative pb-8">
              <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" v-if="index !== recentActivities.length - 1"></span>
              <div class="relative flex space-x-3">
                <div>
                  <span :class="[
                    'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white',
                    activity.type === 'user' ? 'bg-blue-500' : 
                    (activity.type === 'product' ? 'bg-green-500' : 
                    (activity.type === 'proposal' ? 'bg-purple-500' : 'bg-gray-500'))
                  ]">
                    <svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" v-if="activity.type === 'product'" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" v-if="activity.type === 'user'" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" v-if="activity.type === 'proposal'" />
                    </svg>
                  </span>
                </div>
                <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p class="text-sm text-gray-500">
                      {{ activity.description }}
                      <a :href="activity.url" class="font-medium text-gray-900">{{ activity.target }}</a>
                    </p>
                  </div>
                  <div class="text-right text-sm whitespace-nowrap text-gray-500">
                    {{ activity.time }}
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 日期範圍
const dateRange = ref('7d');
const startDate = ref('');
const endDate = ref('');

// 統計數據
const stats = ref({
  visits: 12458,
  visitsGrowth: 5.2,
  newUsers: 358,
  newUsersGrowth: 12.8,
  activeUsers: 2147,
  activeUsersGrowth: -2.4,
  revenue: 154320,
  revenueGrowth: 8.7
});

// 熱門內容
const popularContent = ref([
  { title: '專業網頁設計服務', type: 'product', views: 2456, likes: 132, comments: 45 },
  { title: '行動應用程式開發', type: 'product', views: 1890, likes: 98, comments: 32 },
  { title: '智能家居控制系統', type: 'proposal', views: 1654, likes: 87, comments: 28 },
  { title: '電子商務解決方案', type: 'product', views: 1432, likes: 76, comments: 19 },
  { title: '區塊鏈應用市場', type: 'idea', views: 1254, likes: 67, comments: 21 }
]);

// 最近活動
const recentActivities = ref([
  { type: 'user', description: '新用戶註冊：', target: '張小明', time: '剛剛', url: '#' },
  { type: 'product', description: '新商品上架：', target: 'AI 圖像生成服務', time: '15 分鐘前', url: '#' },
  { type: 'proposal', description: '新提案發布：', target: '智能家居控制系統', time: '2 小時前', url: '#' },
  { type: 'user', description: '用戶升級為工程師：', target: '王大同', time: '3 小時前', url: '#' },
  { type: 'product', description: '商品更新：', target: '網站設計套件', time: '昨天', url: '#' }
]);

// 獲取數據
const fetchData = async () => {
  // 實際應該調用 API 獲取數據
  // 根據選擇的時間範圍設置開始和結束日期
  if (dateRange.value !== 'custom') {
    const endDate = new Date();
    let startDate = new Date();
    
    if (dateRange.value === '7d') {
      startDate.setDate(endDate.getDate() - 7);
    } else if (dateRange.value === '30d') {
      startDate.setDate(endDate.getDate() - 30);
    } else if (dateRange.value === '90d') {
      startDate.setDate(endDate.getDate() - 90);
    } else if (dateRange.value === 'year') {
      startDate.setFullYear(endDate.getFullYear() - 1);
    }
    
    console.log('獲取數據：', startDate.toISOString().split('T')[0], '至', endDate.toISOString().split('T')[0]);
  } else {
    console.log('獲取數據：', startDate.value, '至', endDate.value);
  }
  
  // 模擬數據獲取延遲
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 模擬新數據
  stats.value = {
    visits: Math.floor(Math.random() * 20000) + 10000,
    visitsGrowth: parseFloat((Math.random() * 20 - 5).toFixed(1)),
    newUsers: Math.floor(Math.random() * 500) + 300,
    newUsersGrowth: parseFloat((Math.random() * 20 - 5).toFixed(1)),
    activeUsers: Math.floor(Math.random() * 3000) + 1500,
    activeUsersGrowth: parseFloat((Math.random() * 20 - 5).toFixed(1)),
    revenue: Math.floor(Math.random() * 200000) + 100000,
    revenueGrowth: parseFloat((Math.random() * 20 - 5).toFixed(1))
  };
};

// 導出數據
const exportData = () => {
  // 實際應該實現數據導出功能
  alert('數據導出功能將生成 CSV 或 Excel 文件');
};

// 格式化數字
const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num);
};

// 初始化
onMounted(() => {
  // 設置初始日期範圍
  const today = new Date();
  endDate.value = today.toISOString().split('T')[0];
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  startDate.value = sevenDaysAgo.toISOString().split('T')[0];
  
  // 獲取數據
  fetchData();
});
</script> 