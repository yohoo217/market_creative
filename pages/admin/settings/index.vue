<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">系統設置</h1>
    
    <div class="bg-white rounded-lg shadow overflow-hidden mb-6">
      <!-- 基本設置 -->
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold mb-4">基本設置</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">系統名稱</label>
            <input 
              v-model="settings.siteName" 
              type="text" 
              class="w-full p-2 border rounded"
              placeholder="設置系統名稱"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">網站描述</label>
            <input 
              v-model="settings.siteDescription" 
              type="text" 
              class="w-full p-2 border rounded"
              placeholder="設置網站描述"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">聯絡郵箱</label>
            <input 
              v-model="settings.contactEmail" 
              type="email" 
              class="w-full p-2 border rounded"
              placeholder="設置聯絡郵箱"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">客服電話</label>
            <input 
              v-model="settings.supportPhone" 
              type="text" 
              class="w-full p-2 border rounded"
              placeholder="設置客服電話"
            />
          </div>
        </div>
      </div>
      
      <!-- 使用者設置 -->
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold mb-4">使用者設置</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">允許新使用者註冊</label>
            <div class="flex items-center mt-2">
              <label class="inline-flex items-center mr-4">
                <input
                  type="radio"
                  v-model="settings.allowRegistration"
                  :value="true"
                  class="form-radio h-4 w-4 text-blue-600"
                />
                <span class="ml-2">允許</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="settings.allowRegistration"
                  :value="false"
                  class="form-radio h-4 w-4 text-blue-600"
                />
                <span class="ml-2">不允許</span>
              </label>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">默認用戶角色</label>
            <select 
              v-model="settings.defaultUserRole" 
              class="w-full p-2 border rounded"
            >
              <option value="visitor">訪客</option>
              <option value="ideator">創意人</option>
              <option value="engineer">工程師</option>
              <option value="vendor">廠商</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">需要郵箱驗證</label>
            <div class="flex items-center mt-2">
              <label class="inline-flex items-center mr-4">
                <input
                  type="radio"
                  v-model="settings.requireEmailVerification"
                  :value="true"
                  class="form-radio h-4 w-4 text-blue-600"
                />
                <span class="ml-2">是</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="settings.requireEmailVerification"
                  :value="false"
                  class="form-radio h-4 w-4 text-blue-600"
                />
                <span class="ml-2">否</span>
              </label>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">密碼最小長度</label>
            <input 
              v-model="settings.minPasswordLength" 
              type="number" 
              class="w-full p-2 border rounded"
              min="4"
              max="20"
              placeholder="設置密碼最小長度"
            />
          </div>
        </div>
      </div>
      
      <!-- 金流設置 -->
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold mb-4">金流設置</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">啟用金流功能</label>
            <div class="flex items-center mt-2">
              <label class="inline-flex items-center mr-4">
                <input
                  type="radio"
                  v-model="settings.enablePayment"
                  :value="true"
                  class="form-radio h-4 w-4 text-blue-600"
                />
                <span class="ml-2">啟用</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="settings.enablePayment"
                  :value="false"
                  class="form-radio h-4 w-4 text-blue-600"
                />
                <span class="ml-2">停用</span>
              </label>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">支付方式</label>
            <div class="mt-2 space-y-2">
              <label class="inline-flex items-center">
                <input
                  type="checkbox"
                  v-model="settings.paymentMethods.creditCard"
                  class="form-checkbox h-4 w-4 text-blue-600"
                />
                <span class="ml-2">信用卡</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="checkbox"
                  v-model="settings.paymentMethods.paypal"
                  class="form-checkbox h-4 w-4 text-blue-600"
                />
                <span class="ml-2">PayPal</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="checkbox"
                  v-model="settings.paymentMethods.linePay"
                  class="form-checkbox h-4 w-4 text-blue-600"
                />
                <span class="ml-2">Line Pay</span>
              </label>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">系統抽成比例 (%)</label>
            <input 
              v-model="settings.platformFeePercentage" 
              type="number" 
              class="w-full p-2 border rounded"
              min="0"
              max="100"
              placeholder="設置系統抽成比例"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">幣值</label>
            <select 
              v-model="settings.currency" 
              class="w-full p-2 border rounded"
            >
              <option value="TWD">新台幣 (TWD)</option>
              <option value="USD">美元 (USD)</option>
              <option value="JPY">日圓 (JPY)</option>
              <option value="CNY">人民幣 (CNY)</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- 系統維護 -->
      <div class="p-6">
        <h2 class="text-lg font-semibold mb-4">系統維護</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">維護模式</label>
            <div class="flex items-center mt-2">
              <label class="inline-flex items-center mr-4">
                <input
                  type="radio"
                  v-model="settings.maintenanceMode"
                  :value="true"
                  class="form-radio h-4 w-4 text-blue-600"
                />
                <span class="ml-2">啟用</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="settings.maintenanceMode"
                  :value="false"
                  class="form-radio h-4 w-4 text-blue-600"
                />
                <span class="ml-2">停用</span>
              </label>
            </div>
          </div>
          
          <div v-if="settings.maintenanceMode">
            <label class="block text-sm font-medium text-gray-700 mb-1">維護說明</label>
            <textarea 
              v-model="settings.maintenanceMessage" 
              class="w-full p-2 border rounded"
              rows="3" 
              placeholder="設置維護說明訊息"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">系統日誌級別</label>
            <select 
              v-model="settings.logLevel" 
              class="w-full p-2 border rounded"
            >
              <option value="error">僅錯誤</option>
              <option value="warn">警告</option>
              <option value="info">信息</option>
              <option value="debug">調試</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">清理系統緩存</label>
            <button 
              @click="clearCache" 
              class="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              :disabled="clearingCache"
            >
              {{ clearingCache ? '清理中...' : '清理緩存' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 保存按鈕 -->
    <div class="flex justify-end mt-6">
      <button 
        @click="resetSettings" 
        class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 mr-2"
      >
        重置
      </button>
      <button 
        @click="saveSettings" 
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        :disabled="saving"
      >
        {{ saving ? '儲存中...' : '儲存設置' }}
      </button>
    </div>
    
    <!-- 提示訊息 -->
    <div v-if="message" class="mt-4 p-4 rounded" :class="messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 設置數據
const defaultSettings = {
  siteName: '創意市集平台',
  siteDescription: '連接創意與技術的橋樑',
  contactEmail: 'contact@example.com',
  supportPhone: '02-1234-5678',
  allowRegistration: true,
  defaultUserRole: 'visitor',
  requireEmailVerification: true,
  minPasswordLength: 8,
  enablePayment: true,
  paymentMethods: {
    creditCard: true,
    paypal: true,
    linePay: false
  },
  platformFeePercentage: 5,
  currency: 'TWD',
  maintenanceMode: false,
  maintenanceMessage: '系統正在維護中，預計 2 小時後恢復正常。',
  logLevel: 'info'
}

const settings = ref({ ...defaultSettings })
const originalSettings = ref({ ...defaultSettings })
const saving = ref(false)
const clearingCache = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 獲取系統設置
const fetchSettings = async () => {
  try {
    // 實際應該調用 API 獲取設置
    // const response = await fetch('/api/admin/settings')
    // const data = await response.json()
    
    // 如果 API 返回成功，更新設置
    // if (data.success) {
    //   settings.value = data.data
    //   originalSettings.value = JSON.parse(JSON.stringify(data.data))
    // }
    
    // 這裡使用模擬數據
    const mockSettings = { ...defaultSettings }
    settings.value = mockSettings
    originalSettings.value = JSON.parse(JSON.stringify(mockSettings))
    
  } catch (error) {
    console.error('獲取系統設置失敗:', error)
    showMessage('獲取系統設置失敗', 'error')
  }
}

// 保存系統設置
const saveSettings = async () => {
  saving.value = true
  message.value = ''
  
  try {
    // 實際應該調用 API 保存設置
    // const response = await fetch('/api/admin/settings', {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(settings.value)
    // })
    // const data = await response.json()
    
    // 模擬 API 調用延遲
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新原始設置，用於重置
    originalSettings.value = JSON.parse(JSON.stringify(settings.value))
    
    showMessage('系統設置已成功保存', 'success')
  } catch (error) {
    console.error('保存系統設置失敗:', error)
    showMessage('保存系統設置失敗', 'error')
  } finally {
    saving.value = false
  }
}

// 重置設置為上次保存的值
const resetSettings = () => {
  settings.value = JSON.parse(JSON.stringify(originalSettings.value))
  showMessage('設置已重置為上次保存的值', 'success')
}

// 清理系統緩存
const clearCache = async () => {
  clearingCache.value = true
  message.value = ''
  
  try {
    // 實際應該調用 API 清理緩存
    // const response = await fetch('/api/admin/cache/clear', {
    //   method: 'POST'
    // })
    // const data = await response.json()
    
    // 模擬 API 調用延遲
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    showMessage('系統緩存已成功清理', 'success')
  } catch (error) {
    console.error('清理系統緩存失敗:', error)
    showMessage('清理系統緩存失敗', 'error')
  } finally {
    clearingCache.value = false
  }
}

// 顯示訊息
const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
  message.value = text
  messageType.value = type
  
  // 5秒後自動清除訊息
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

// 初始加載設置
onMounted(() => {
  fetchSettings()
})
</script> 