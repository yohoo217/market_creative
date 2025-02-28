<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- 返回按鈕 -->
      <Button
        icon="pi pi-arrow-left"
        label="返回消息列表"
        text
        class="mb-6"
        @click="router.back()"
      />

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
        <Button label="重試" icon="pi pi-refresh" class="mt-4" @click="fetchMessage" />
      </div>

      <!-- 消息內容 -->
      <template v-else-if="message">
        <div class="bg-white rounded-lg shadow-md">
          <!-- 消息頭部 -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-4">
                <!-- 消息圖標 -->
                <div :class="getMessageIconClass(message.type)" class="p-3 rounded-full">
                  <i :class="getMessageIcon(message.type)" class="text-xl"></i>
                </div>

                <div>
                  <h1 class="text-2xl font-bold text-gray-900">{{ message.title }}</h1>
                  <p class="text-sm text-gray-500 mt-1">{{ formatDate(message.createdAt) }}</p>
                </div>
              </div>

              <!-- 操作按鈕 -->
              <div class="flex items-center gap-2">
                <Button
                  v-if="message.action"
                  :icon="message.action.icon"
                  :label="message.action.label"
                  @click="handleMessageAction(message)"
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  @click="confirmDelete"
                />
              </div>
            </div>

            <!-- 相關項目信息 -->
            <div v-if="message.relatedItem" class="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <i class="pi pi-link"></i>
              <span>{{ message.relatedItem.type }}: {{ message.relatedItem.name }}</span>
              <Button
                icon="pi pi-external-link"
                link
                class="p-0 ml-2"
                @click="navigateToRelatedItem"
              />
            </div>
          </div>

          <!-- 消息內容 -->
          <div class="p-6">
            <!-- 主要內容 -->
            <div class="prose max-w-none">
              <p class="text-gray-600 whitespace-pre-line">{{ message.content }}</p>
            </div>

            <!-- 附件（如果有） -->
            <div v-if="message.attachments?.length" class="mt-6">
              <h3 class="text-lg font-semibold mb-3">附件</h3>
              <div class="space-y-2">
                <div
                  v-for="attachment in message.attachments"
                  :key="attachment.id"
                  class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <i :class="getFileIcon(attachment.type)" class="text-gray-500"></i>
                  <span class="flex-1 text-sm text-gray-700">{{ attachment.name }}</span>
                  <Button
                    icon="pi pi-download"
                    text
                    rounded
                    @click="downloadAttachment(attachment)"
                  />
                </div>
              </div>
            </div>

            <!-- 評論區 -->
            <div class="mt-8">
              <h3 class="text-lg font-semibold mb-4">評論</h3>
              
              <!-- 評論列表 -->
              <div class="space-y-4 mb-6">
                <div
                  v-for="comment in message.comments"
                  :key="comment.id"
                  class="flex gap-4"
                >
                  <!-- 用戶頭像 -->
                  <img
                    :src="comment.user.avatar || '/default-avatar.png'"
                    :alt="comment.user.name"
                    class="w-10 h-10 rounded-full"
                  />

                  <!-- 評論內容 -->
                  <div class="flex-1">
                    <div class="bg-gray-50 rounded-lg p-4">
                      <div class="flex items-center justify-between mb-2">
                        <span class="font-medium text-gray-900">{{ comment.user.name }}</span>
                        <span class="text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</span>
                      </div>
                      <p class="text-gray-600">{{ comment.content }}</p>
                    </div>

                    <!-- 回覆按鈕 -->
                    <Button
                      label="回覆"
                      icon="pi pi-reply"
                      text
                      size="small"
                      class="mt-2"
                      @click="replyToComment(comment)"
                    />
                  </div>
                </div>
              </div>

              <!-- 添加評論 -->
              <div class="flex gap-4">
                <img
                  :src="userStore.user?.avatar || '/default-avatar.png'"
                  :alt="userStore.user?.name"
                  class="w-10 h-10 rounded-full"
                />
                <div class="flex-1">
                  <Textarea
                    v-model="newComment"
                    :autoResize="true"
                    rows="3"
                    placeholder="添加評論..."
                    class="w-full"
                  />
                  <div class="flex justify-end mt-3">
                    <Button
                      label="發送"
                      icon="pi pi-send"
                      :loading="sendingComment"
                      :disabled="!newComment.trim()"
                      @click="addComment"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 刪除確認對話框 -->
    <Dialog
      v-model:visible="showDeleteDialog"
      modal
      header="確認刪除"
      :style="{ width: '450px' }"
    >
      <div class="p-4">
        <p>確定要刪除這條消息嗎？此操作無法撤銷。</p>
      </div>
      <template #footer>
        <Button
          label="取消"
          icon="pi pi-times"
          text
          @click="showDeleteDialog = false"
        />
        <Button
          label="刪除"
          icon="pi pi-trash"
          severity="danger"
          :loading="deleting"
          @click="deleteMessage"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '~/stores/user'
import { useToast } from 'primevue/usetoast'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

const loading = ref(false)
const error = ref(null)
const message = ref(null)
const newComment = ref('')
const sendingComment = ref(false)
const showDeleteDialog = ref(false)
const deleting = ref(false)

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

// 獲取文件圖標
const getFileIcon = (type) => {
  const icons = {
    pdf: 'pi pi-file-pdf',
    image: 'pi pi-image',
    doc: 'pi pi-file-word',
    excel: 'pi pi-file-excel',
    zip: 'pi pi-file-export',
    default: 'pi pi-file'
  }
  return icons[type] || icons.default
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 處理消息操作
const handleMessageAction = (message) => {
  if (message.action?.route) {
    router.push(message.action.route)
  }
}

// 導航到相關項目
const navigateToRelatedItem = () => {
  if (!message.value?.relatedItem) return
  
  const routes = {
    '創意': '/products/',
    '項目': '/projects/'
  }
  
  const baseRoute = routes[message.value.relatedItem.type]
  if (baseRoute) {
    router.push(baseRoute + message.value.relatedItem.id)
  }
}

// 下載附件
const downloadAttachment = (attachment) => {
  // TODO: 實現附件下載功能
  console.log('下載附件:', attachment)
  toast.add({
    severity: 'info',
    summary: '功能開發中',
    detail: '附件下載功能即將上線',
    life: 3000
  })
}

// 回覆評論
const replyToComment = (comment) => {
  newComment.value = `@${comment.user.name} `
}

// 添加評論
const addComment = async () => {
  if (!newComment.value.trim()) return
  
  sendingComment.value = true
  try {
    // 這裡應該調用API添加評論
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const comment = {
      id: Date.now(),
      content: newComment.value,
      createdAt: new Date(),
      user: {
        id: userStore.user.id,
        name: userStore.user.name,
        avatar: userStore.user.avatar
      }
    }
    
    message.value.comments.push(comment)
    newComment.value = ''
    
    toast.add({
      severity: 'success',
      summary: '評論成功',
      life: 3000
    })
  } catch (err) {
    console.error('添加評論失敗:', err)
    toast.add({
      severity: 'error',
      summary: '評論失敗',
      detail: '無法添加評論',
      life: 3000
    })
  } finally {
    sendingComment.value = false
  }
}

// 確認刪除
const confirmDelete = () => {
  showDeleteDialog.value = true
}

// 刪除消息
const deleteMessage = async () => {
  deleting.value = true
  try {
    // 這裡應該調用API刪除消息
    await new Promise(resolve => setTimeout(resolve, 800))
    
    showDeleteDialog.value = false
    toast.add({
      severity: 'success',
      summary: '刪除成功',
      detail: '消息已刪除',
      life: 3000
    })
    
    router.replace('/messages')
  } catch (err) {
    console.error('刪除消息失敗:', err)
    toast.add({
      severity: 'error',
      summary: '刪除失敗',
      detail: '無法刪除消息',
      life: 3000
    })
  } finally {
    deleting.value = false
  }
}

// 獲取消息詳情
const fetchMessage = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 這裡應該調用API獲取消息詳情
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 示例數據
    message.value = {
      id: route.params.id,
      type: 'proposal',
      title: '收到新的工程師提案',
      content: `工程師對您的創意「智能水杯提醒系統」提交了新的提案。

提案要點：
1. 使用低功耗藍牙技術實現手機連接
2. 採用可更換的CR2032紐扣電池，續航時間可達6個月
3. 防水等級達到IPX7，支持完全浸沒
4. 預計開發周期為3個月
5. 估算成本在預算範圍內

建議您及時查看完整提案內容並進行評估。如有任何問題，可以通過評論區與工程師進行溝通。`,
      createdAt: new Date(Date.now() - 3600000),
      read: true,
      action: {
        label: '查看提案',
        icon: 'pi pi-eye',
        route: '/products/1/proposals'
      },
      relatedItem: {
        id: '1',
        type: '創意',
        name: '智能水杯提醒系統'
      },
      attachments: [
        {
          id: '1',
          name: '技術方案.pdf',
          type: 'pdf',
          size: 2048576
        },
        {
          id: '2',
          name: '成本預算.xlsx',
          type: 'excel',
          size: 1048576
        },
        {
          id: '3',
          name: '產品效果圖.jpg',
          type: 'image',
          size: 3145728
        }
      ],
      comments: [
        {
          id: '1',
          content: '這個提案看起來很專業，我特別認同使用低功耗藍牙的選擇。',
          createdAt: new Date(Date.now() - 7200000),
          user: {
            id: '1',
            name: '張小明',
            avatar: '/avatars/user1.jpg'
          }
        },
        {
          id: '2',
          content: '謝謝您的評價！關於電池續航的問題，我們還可以通過優化喚醒間隔來進一步延長。',
          createdAt: new Date(Date.now() - 3600000),
          user: {
            id: '2',
            name: '李工程師',
            avatar: '/avatars/user2.jpg'
          }
        }
      ]
    }
  } catch (err) {
    console.error('獲取消息詳情失敗:', err)
    error.value = '無法載入消息，請稍後重試'
  } finally {
    loading.value = false
  }
}

// 頁面載入時獲取消息詳情
onMounted(() => {
  fetchMessage()
})
</script>

<style scoped>
.prose {
  max-width: none;
}

.prose p {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}

.prose p:first-child {
  margin-top: 0;
}

.prose p:last-child {
  margin-bottom: 0;
}
</style> 