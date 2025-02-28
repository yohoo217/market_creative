<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- 頁面標題 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">消息中心</h1>
        <p class="text-gray-600 mt-2">管理您的所有通知和消息</p>
      </div>

      <!-- 篩選工具欄 -->
      <div class="bg-white rounded-lg shadow-md p-4 mb-6">
        <div class="flex flex-wrap gap-4 items-center">
          <!-- 消息類型篩選 -->
          <div class="flex-1 min-w-[200px]">
            <Dropdown
              v-model="filters.type"
              :options="messageTypes"
              optionLabel="label"
              optionValue="value"
              placeholder="選擇消息類型"
              class="w-full"
            />
          </div>

          <!-- 日期範圍選擇 -->
          <div class="flex-1 min-w-[300px]">
            <Calendar
              v-model="filters.dateRange"
              selectionMode="range"
              :showIcon="true"
              placeholder="選擇日期範圍"
              class="w-full"
            />
          </div>

          <!-- 讀取狀態篩選 -->
          <div class="flex-1 min-w-[200px]">
            <Dropdown
              v-model="filters.readStatus"
              :options="readStatusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="讀取狀態"
              class="w-full"
            />
          </div>

          <!-- 搜索框 -->
          <div class="flex-1 min-w-[200px]">
            <span class="p-input-icon-left w-full">
              <i class="pi pi-search" />
              <InputText
                v-model="filters.search"
                placeholder="搜索消息..."
                class="w-full"
              />
            </span>
          </div>

          <!-- 清除篩選按鈕 -->
          <Button
            icon="pi pi-filter-slash"
            label="清除篩選"
            text
            @click="clearFilters"
          />
        </div>
      </div>

      <!-- 消息列表 -->
      <div class="space-y-4">
        <!-- 加載中狀態 -->
        <div v-if="loading" class="bg-white rounded-lg shadow-md p-8 text-center">
          <ProgressSpinner style="width:50px;height:50px" />
          <p class="text-gray-600 mt-4">正在加載消息...</p>
        </div>

        <!-- 錯誤狀態 -->
        <div v-else-if="error" class="bg-white rounded-lg shadow-md p-8 text-center">
          <i class="pi pi-exclamation-circle text-red-500 text-4xl"></i>
          <p class="text-gray-800 text-lg mt-4">載入消息時發生錯誤</p>
          <p class="text-gray-600 mt-2">{{ error }}</p>
          <Button label="重試" icon="pi pi-refresh" class="mt-4" @click="fetchMessages" />
        </div>

        <!-- 無消息狀態 -->
        <div v-else-if="filteredMessages.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center">
          <i class="pi pi-inbox text-gray-400 text-4xl"></i>
          <p class="text-gray-800 text-lg mt-4">{{ messages.length === 0 ? '暫無消息' : '沒有符合條件的消息' }}</p>
          <p class="text-gray-600 mt-2">
            {{ messages.length === 0 ? '當有新的提案、評論或系統通知時，會在這裡顯示' : '嘗試調整篩選條件' }}
          </p>
        </div>

        <!-- 消息列表 -->
        <template v-else>
          <div
            v-for="message in filteredMessages"
            :key="message.id"
            class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div 
              class="p-4 cursor-pointer"
              :class="{'bg-primary-50': !message.read}"
              @click="openMessage(message)"
            >
              <div class="flex items-start gap-4">
                <!-- 消息圖標 -->
                <div :class="getMessageIconClass(message.type)" class="p-3 rounded-full shrink-0">
                  <i :class="getMessageIcon(message.type)" class="text-xl"></i>
                </div>

                <!-- 消息內容 -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-4 mb-1">
                    <h3 
                      class="text-lg font-medium text-gray-900 truncate"
                      :class="{'font-semibold': !message.read}"
                    >
                      {{ message.title }}
                    </h3>
                    <span class="text-sm text-gray-500 whitespace-nowrap">
                      {{ formatDate(message.createdAt) }}
                    </span>
                  </div>
                  <p class="text-gray-600 line-clamp-2">{{ message.content }}</p>
                  
                  <!-- 相關項目信息 -->
                  <div v-if="message.relatedItem" class="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <i class="pi pi-link"></i>
                    <span>{{ message.relatedItem.type }}: {{ message.relatedItem.name }}</span>
                  </div>
                </div>

                <!-- 操作按鈕 -->
                <div class="shrink-0 flex items-center gap-2">
                  <Button
                    v-if="message.action"
                    :icon="message.action.icon"
                    :label="message.action.label"
                    link
                    @click.stop="handleMessageAction(message)"
                  />
                  <Button
                    v-if="!message.read"
                    icon="pi pi-check"
                    text
                    rounded
                    aria-label="標記為已讀"
                    @click.stop="markAsRead(message)"
                  />
                  <Button
                    icon="pi pi-ellipsis-v"
                    text
                    rounded
                    aria-label="更多操作"
                    @click.stop="showMessageMenu($event, message)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 加載更多按鈕 -->
          <div v-if="hasMoreMessages" class="text-center mt-6">
            <Button
              label="加載更多"
              icon="pi pi-spinner"
              :loading="loadingMore"
              @click="loadMoreMessages"
            />
          </div>
        </template>
      </div>
    </div>

    <!-- 消息操作菜單 -->
    <Menu ref="messageMenu" :model="messageMenuItems" :popup="true" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const toast = useToast()
const messageMenu = ref()
const loading = ref(false)
const loadingMore = ref(false)
const error = ref(null)
const selectedMessage = ref(null)

// 消息類型選項
const messageTypes = [
  { label: '全部消息', value: 'all' },
  { label: '提案相關', value: 'proposal' },
  { label: '項目進度', value: 'project' },
  { label: '系統通知', value: 'system' },
  { label: '評論回覆', value: 'comment' },
  { label: '付款通知', value: 'payment' }
]

// 讀取狀態選項
const readStatusOptions = [
  { label: '全部', value: 'all' },
  { label: '未讀', value: 'unread' },
  { label: '已讀', value: 'read' }
]

// 篩選條件
const filters = ref({
  type: 'all',
  dateRange: null,
  readStatus: 'all',
  search: ''
})

// 消息列表
const messages = ref([
  {
    id: 1,
    type: 'proposal',
    title: '新的提案回覆',
    content: '工程師小明對您的創意「智能家居控制系統」提交了新的提案，請查看並評估。',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30分鐘前
    read: false,
    sender: {
      name: '工程師小明',
      avatar: '/avatars/ideator.jpg'
    },
    relatedItem: {
      type: '創意',
      name: '智能家居控制系統'
    },
    action: {
      label: '查看提案',
      icon: 'pi pi-external-link',
      url: '/products/1/proposals'
    }
  },
  {
    id: 2,
    type: 'system',
    title: '系統維護通知',
    content: '系統將於本週日凌晨2點進行例行維護，預計持續2小時。',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小時前
    read: true,
    sender: {
      name: '系統管理員',
      avatar: '/avatars/ideator.jpg'
    }
  }
])
const hasMoreMessages = ref(true)
const currentPage = ref(1)
const pageSize = 20

// 消息操作菜單項
const messageMenuItems = [
  {
    label: '標記為已讀',
    icon: 'pi pi-check',
    command: () => markAsRead(selectedMessage.value)
  },
  {
    label: '刪除',
    icon: 'pi pi-trash',
    class: 'text-red-500',
    command: () => deleteMessage(selectedMessage.value)
  }
]

// 格式化日期
const formatDate = (date) => {
  const d = new Date(date)
  const now = new Date()
  const diff = now - d
  
  // 如果是今天的消息，顯示具體時間
  if (diff < 24 * 60 * 60 * 1000) {
    return d.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // 如果是最近7天的消息，顯示星期幾
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return d.toLocaleDateString('zh-TW', {
      weekday: 'long'
    })
  }
  
  // 其他情況顯示完整日期
  return d.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// 獲取消息圖標樣式
const getMessageIconClass = (type) => {
  const classes = {
    proposal: 'bg-blue-100 text-blue-500',
    project: 'bg-green-100 text-green-500',
    system: 'bg-gray-100 text-gray-500',
    comment: 'bg-yellow-100 text-yellow-500',
    payment: 'bg-purple-100 text-purple-500'
  }
  return classes[type] || classes.system
}

// 獲取消息圖標
const getMessageIcon = (type) => {
  const icons = {
    proposal: 'pi pi-file',
    project: 'pi pi-cog',
    system: 'pi pi-info-circle',
    comment: 'pi pi-comments',
    payment: 'pi pi-dollar'
  }
  return icons[type] || icons.system
}

// 篩選消息
const filteredMessages = computed(() => {
  return messages.value.filter(message => {
    // 類型篩選
    if (filters.value.type !== 'all' && message.type !== filters.value.type) {
      return false
    }
    
    // 讀取狀態篩選
    if (filters.value.readStatus === 'unread' && message.read) {
      return false
    }
    if (filters.value.readStatus === 'read' && !message.read) {
      return false
    }
    
    // 日期範圍篩選
    if (filters.value.dateRange?.[0] && filters.value.dateRange?.[1]) {
      const messageDate = new Date(message.createdAt)
      const startDate = new Date(filters.value.dateRange[0])
      const endDate = new Date(filters.value.dateRange[1])
      if (messageDate < startDate || messageDate > endDate) {
        return false
      }
    }
    
    // 關鍵詞搜索
    if (filters.value.search) {
      const searchText = filters.value.search.toLowerCase()
      return (
        message.title.toLowerCase().includes(searchText) ||
        message.content.toLowerCase().includes(searchText) ||
        message.relatedItem?.name.toLowerCase().includes(searchText)
      )
    }
    
    return true
  })
})

// 清除篩選條件
const clearFilters = () => {
  filters.value = {
    type: 'all',
    dateRange: null,
    readStatus: 'all',
    search: ''
  }
}

// 顯示消息操作菜單
const showMessageMenu = (event, message) => {
  selectedMessage.value = message
  messageMenu.value.show(event)
}

// 打開消息詳情
const openMessage = (message) => {
  if (!message.read) {
    markAsRead(message)
  }
  router.push(`/messages/${message.id}`)
}

// 處理消息操作
const handleMessageAction = (message) => {
  if (message.action?.url) {
    router.push(message.action.url)
  }
}

// 標記消息為已讀
const markAsRead = async (message) => {
  if (message.read) return
  
  try {
    // 這裡應該調用API更新消息狀態
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.read = true
    
    toast.add({
      severity: 'success',
      summary: '已標記為已讀',
      life: 3000
    })
  } catch (err) {
    console.error('標記消息已讀失敗:', err)
    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: '無法標記消息為已讀',
      life: 3000
    })
  }
}

// 刪除消息
const deleteMessage = async (message) => {
  try {
    // 這裡應該調用API刪除消息
    await new Promise(resolve => setTimeout(resolve, 500))
    
    messages.value = messages.value.filter(m => m.id !== message.id)
    
    toast.add({
      severity: 'success',
      summary: '刪除成功',
      detail: '消息已刪除',
      life: 3000
    })
  } catch (err) {
    console.error('刪除消息失敗:', err)
    toast.add({
      severity: 'error',
      summary: '刪除失敗',
      detail: '無法刪除消息',
      life: 3000
    })
  }
}

// 加載更多消息
const loadMoreMessages = async () => {
  if (loadingMore.value) return
  
  loadingMore.value = true
  try {
    // 這裡應該調用API獲取更多消息
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newMessages = generateMockMessages(pageSize)
    messages.value.push(...newMessages)
    
    currentPage.value++
    hasMoreMessages.value = currentPage.value < 5 // 示例：最多5頁
  } catch (err) {
    console.error('加載更多消息失敗:', err)
    toast.add({
      severity: 'error',
      summary: '載入失敗',
      detail: '無法加載更多消息',
      life: 3000
    })
  } finally {
    loadingMore.value = false
  }
}

// 獲取消息列表
const fetchMessages = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 這裡應該調用API獲取消息列表
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    messages.value = generateMockMessages(pageSize)
    currentPage.value = 1
    hasMoreMessages.value = true
  } catch (err) {
    console.error('獲取消息列表失敗:', err)
    error.value = '無法載入消息，請稍後重試'
  } finally {
    loading.value = false
  }
}

// 生成示例消息數據
const generateMockMessages = (count) => {
  const types = ['proposal', 'project', 'system', 'comment', 'payment']
  const messages = []
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const read = Math.random() > 0.3
    
    let title, content, action, relatedItem
    
    switch (type) {
      case 'proposal':
        title = '收到新的工程師提案'
        content = '工程師對您的創意「智能水杯提醒系統」提交了新的提案，建議您及時查看和評估。'
        action = {
          label: '查看提案',
          icon: 'pi pi-eye',
          route: '/products/1/proposals'
        }
        relatedItem = {
          type: '創意',
          name: '智能水杯提醒系統'
        }
        break
      case 'project':
        title = '項目進度更新'
        content = '「可折疊式太陽能充電板」項目完成了第一階段的開發工作，請查看詳細進度報告。'
        action = {
          label: '查看進度',
          icon: 'pi pi-chart-line',
          route: '/projects/2'
        }
        relatedItem = {
          type: '項目',
          name: '可折疊式太陽能充電板'
        }
        break
      case 'comment':
        title = '收到新的評論回覆'
        content = '工程師在「智能家居控制中心」的討論中回覆了您的評論。'
        action = {
          label: '查看回覆',
          icon: 'pi pi-comments',
          route: '/products/3/comments'
        }
        relatedItem = {
          type: '創意',
          name: '智能家居控制中心'
        }
        break
      case 'payment':
        title = '收到項目付款'
        content = '「智能家居控制中心」項目的第二期付款 NT$ 50,000 已到賬。'
        relatedItem = {
          type: '項目',
          name: '智能家居控制中心'
        }
        break
      default:
        title = '系統通知'
        content = '您的帳戶信息已更新成功。'
        break
    }
    
    messages.push({
      id: Date.now() + i,
      type,
      title,
      content,
      read,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      action,
      relatedItem
    })
  }
  
  return messages.sort((a, b) => b.createdAt - a.createdAt)
}

// 頁面載入時獲取消息列表
onMounted(() => {
  fetchMessages()
})
</script>

<style scoped>
/* 消息卡片懸停效果 */
.bg-white {
  transition: all 0.2s ease;
}

/* 未讀消息標記 */
.bg-primary-50 {
  position: relative;
}
.bg-primary-50::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: var(--primary-color);
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}
</style> 