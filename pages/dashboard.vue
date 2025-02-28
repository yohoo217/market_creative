<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- 頁面標題 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">歡迎回來，{{ userStore.user?.name || '創意者' }}</h1>
        <p class="text-gray-600 mt-2">這裡是您的創意管理中心</p>
      </div>

      <!-- 數據概覽卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- 總創意數 -->
        <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary-500">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">總創意數</p>
              <p class="text-2xl font-bold mt-1">{{ dashboardData.totalIdeas }}</p>
            </div>
            <div class="bg-primary-100 p-2 rounded-lg">
              <i class="pi pi-lightbulb text-primary-500 text-xl"></i>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-3">
            較上月 
            <span :class="dashboardData.ideaGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ dashboardData.ideaGrowth >= 0 ? '+' : '' }}{{ dashboardData.ideaGrowth }}%
            </span>
          </p>
        </div>

        <!-- 待處理提案 -->
        <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">待處理提案</p>
              <p class="text-2xl font-bold mt-1">{{ dashboardData.pendingProposals }}</p>
            </div>
            <div class="bg-yellow-100 p-2 rounded-lg">
              <i class="pi pi-clock text-yellow-500 text-xl"></i>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-3">需要您的審核</p>
        </div>

        <!-- 進行中項目 -->
        <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">進行中項目</p>
              <p class="text-2xl font-bold mt-1">{{ dashboardData.activeProjects }}</p>
            </div>
            <div class="bg-green-100 p-2 rounded-lg">
              <i class="pi pi-cog text-green-500 text-xl animate-spin"></i>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-3">正在開發中</p>
        </div>

        <!-- 總收入 -->
        <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm">本月收入</p>
              <p class="text-2xl font-bold mt-1">NT$ {{ formatNumber(dashboardData.monthlyIncome) }}</p>
            </div>
            <div class="bg-purple-100 p-2 rounded-lg">
              <i class="pi pi-dollar text-purple-500 text-xl"></i>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-3">
            較上月 
            <span :class="dashboardData.incomeGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ dashboardData.incomeGrowth >= 0 ? '+' : '' }}{{ dashboardData.incomeGrowth }}%
            </span>
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 最新動態 -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-4 flex items-center">
              <i class="pi pi-bell mr-2 text-primary-500"></i>
              最新動態
            </h2>
            <Timeline :value="dashboardData.recentActivities" class="customized-timeline">
              <template #content="slotProps">
                <div class="flex items-center mb-4">
                  <div :class="getActivityIconClass(slotProps.item.type)" class="mr-3 p-2 rounded-full">
                    <i :class="getActivityIcon(slotProps.item.type)" class="text-lg"></i>
                  </div>
                  <div class="flex-1">
                    <p class="font-medium">{{ slotProps.item.title }}</p>
                    <p class="text-sm text-gray-600">{{ slotProps.item.description }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ formatDate(slotProps.item.time) }}</p>
                  </div>
                  <Button 
                    v-if="slotProps.item.action"
                    :label="slotProps.item.action.label"
                    :icon="slotProps.item.action.icon"
                    link
                    @click="handleActivityAction(slotProps.item)"
                  />
                </div>
              </template>
            </Timeline>
          </div>
        </div>

        <!-- 待辦事項 -->
        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-4 flex items-center">
              <i class="pi pi-check-square mr-2 text-primary-500"></i>
              待辦事項
            </h2>
            <div class="space-y-4">
              <div 
                v-for="todo in dashboardData.todos" 
                :key="todo.id"
                class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Checkbox 
                  v-model="todo.completed" 
                  :binary="true"
                  @change="handleTodoChange(todo)"
                />
                <div class="ml-3 flex-1">
                  <p :class="{'line-through text-gray-400': todo.completed}">
                    {{ todo.title }}
                  </p>
                  <p class="text-xs text-gray-500">{{ todo.dueDate ? formatDate(todo.dueDate) : '無截止日期' }}</p>
                </div>
                <Button 
                  icon="pi pi-ellipsis-v" 
                  text 
                  rounded 
                  aria-label="更多操作"
                  @click="showTodoMenu($event, todo)"
                />
              </div>
            </div>
            <Button 
              label="添加待辦" 
              icon="pi pi-plus"
              text
              class="w-full mt-4"
              @click="showAddTodoDialog = true"
            />
          </div>

          <!-- 快捷操作 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-4 flex items-center">
              <i class="pi pi-bolt mr-2 text-primary-500"></i>
              快捷操作
            </h2>
            <div class="grid grid-cols-2 gap-4">
              <Button 
                label="發布創意" 
                icon="pi pi-plus"
                class="p-button-outlined"
                @click="router.push('/products/create')"
              />
              <Button 
                label="查看提案" 
                icon="pi pi-inbox"
                class="p-button-outlined"
                @click="router.push('/products/my-ideas')"
              />
              <Button 
                label="收益報表" 
                icon="pi pi-chart-line"
                class="p-button-outlined"
                @click="router.push('/earnings')"
              />
              <Button 
                label="消息中心" 
                icon="pi pi-envelope"
                class="p-button-outlined"
                @click="router.push('/messages')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加待辦對話框 -->
    <Dialog 
      v-model:visible="showAddTodoDialog" 
      modal 
      header="添加待辦事項" 
      :style="{ width: '450px' }"
    >
      <div class="p-fluid">
        <div class="field mb-4">
          <label for="todoTitle" class="font-medium mb-2 block">標題</label>
          <InputText 
            id="todoTitle" 
            v-model="newTodo.title" 
            placeholder="輸入待辦事項標題"
          />
        </div>
        <div class="field">
          <label for="todoDueDate" class="font-medium mb-2 block">截止日期（可選）</label>
          <Calendar 
            id="todoDueDate" 
            v-model="newTodo.dueDate" 
            :showTime="true"
            placeholder="選擇截止日期和時間"
          />
        </div>
      </div>
      <template #footer>
        <Button 
          label="取消" 
          icon="pi pi-times" 
          text 
          @click="showAddTodoDialog = false"
        />
        <Button 
          label="添加" 
          icon="pi pi-check" 
          @click="addTodo"
          :loading="addingTodo"
        />
      </template>
    </Dialog>

    <!-- 待辦操作菜單 -->
    <Menu ref="todoMenu" :model="todoMenuItems" :popup="true" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores/user'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()
const todoMenu = ref()
const showAddTodoDialog = ref(false)
const addingTodo = ref(false)
const selectedTodo = ref(null)

// 新待辦事項表單
const newTodo = ref({
  title: '',
  dueDate: null
})

// 儀表板數據
const dashboardData = ref({
  totalIdeas: 0,
  ideaGrowth: 0,
  pendingProposals: 0,
  activeProjects: 0,
  monthlyIncome: 0,
  incomeGrowth: 0,
  recentActivities: [],
  todos: []
})

// 待辦菜單項
const todoMenuItems = [
  {
    label: '編輯',
    icon: 'pi pi-pencil',
    command: () => editTodo(selectedTodo.value)
  },
  {
    label: '刪除',
    icon: 'pi pi-trash',
    class: 'text-red-500',
    command: () => deleteTodo(selectedTodo.value)
  }
]

// 格式化數字
const formatNumber = (num) => {
  return new Intl.NumberFormat('zh-TW').format(num)
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

// 獲取活動圖標樣式
const getActivityIconClass = (type) => {
  const classes = {
    proposal: 'bg-blue-100 text-blue-500',
    project: 'bg-green-100 text-green-500',
    payment: 'bg-purple-100 text-purple-500',
    system: 'bg-gray-100 text-gray-500'
  }
  return classes[type] || classes.system
}

// 獲取活動圖標
const getActivityIcon = (type) => {
  const icons = {
    proposal: 'pi pi-file',
    project: 'pi pi-cog',
    payment: 'pi pi-dollar',
    system: 'pi pi-info-circle'
  }
  return icons[type] || icons.system
}

// 處理活動操作
const handleActivityAction = (activity) => {
  if (activity.action?.route) {
    router.push(activity.action.route)
  }
}

// 顯示待辦菜單
const showTodoMenu = (event, todo) => {
  selectedTodo.value = todo
  todoMenu.value.show(event)
}

// 處理待辦狀態變更
const handleTodoChange = async (todo) => {
  try {
    // 這裡應該調用API更新待辦狀態
    await new Promise(resolve => setTimeout(resolve, 500))
    
    toast.add({
      severity: todo.completed ? 'success' : 'info',
      summary: todo.completed ? '已完成' : '已取消完成',
      detail: todo.title,
      life: 3000
    })
  } catch (err) {
    console.error('更新待辦狀態失敗:', err)
    todo.completed = !todo.completed // 恢復狀態
    
    toast.add({
      severity: 'error',
      summary: '更新失敗',
      detail: '無法更新待辦事項狀態',
      life: 3000
    })
  }
}

// 添加待辦事項
const addTodo = async () => {
  if (!newTodo.value.title.trim()) {
    toast.add({
      severity: 'warn',
      summary: '請輸入標題',
      detail: '待辦事項標題不能為空',
      life: 3000
    })
    return
  }

  addingTodo.value = true
  try {
    // 這裡應該調用API添加待辦事項
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const todo = {
      id: Date.now(),
      title: newTodo.value.title,
      dueDate: newTodo.value.dueDate,
      completed: false
    }
    
    dashboardData.value.todos.unshift(todo)
    
    showAddTodoDialog.value = false
    newTodo.value = { title: '', dueDate: null }
    
    toast.add({
      severity: 'success',
      summary: '添加成功',
      detail: '待辦事項已添加',
      life: 3000
    })
  } catch (err) {
    console.error('添加待辦事項失敗:', err)
    toast.add({
      severity: 'error',
      summary: '添加失敗',
      detail: '無法添加待辦事項',
      life: 3000
    })
  } finally {
    addingTodo.value = false
  }
}

// 編輯待辦事項
const editTodo = (todo) => {
  // TODO: 實現編輯功能
  console.log('編輯待辦:', todo)
}

// 刪除待辦事項
const deleteTodo = async (todo) => {
  try {
    // 這裡應該調用API刪除待辦事項
    await new Promise(resolve => setTimeout(resolve, 500))
    
    dashboardData.value.todos = dashboardData.value.todos.filter(t => t.id !== todo.id)
    
    toast.add({
      severity: 'success',
      summary: '刪除成功',
      detail: '待辦事項已刪除',
      life: 3000
    })
  } catch (err) {
    console.error('刪除待辦事項失敗:', err)
    toast.add({
      severity: 'error',
      summary: '刪除失敗',
      detail: '無法刪除待辦事項',
      life: 3000
    })
  }
}

// 獲取儀表板數據
const fetchDashboardData = async () => {
  try {
    // 這裡應該調用API獲取數據
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 示例數據
    dashboardData.value = {
      totalIdeas: 12,
      ideaGrowth: 25,
      pendingProposals: 5,
      activeProjects: 3,
      monthlyIncome: 158000,
      incomeGrowth: 12,
      recentActivities: [
        {
          id: 1,
          type: 'proposal',
          title: '收到新提案',
          description: '您的創意「智能水杯提醒系統」收到了一個新的工程師提案',
          time: new Date(),
          action: {
            label: '查看',
            icon: 'pi pi-eye',
            route: '/products/1/proposals'
          }
        },
        {
          id: 2,
          type: 'project',
          title: '項目里程碑完成',
          description: '「可折疊式太陽能充電板」項目完成了第一階段開發',
          time: new Date(Date.now() - 3600000),
          action: {
            label: '詳情',
            icon: 'pi pi-eye',
            route: '/projects/2'
          }
        },
        {
          id: 3,
          type: 'payment',
          title: '收到付款',
          description: '「智能家居控制中心」項目收到了第二期付款 NT$ 50,000',
          time: new Date(Date.now() - 7200000)
        }
      ],
      todos: [
        {
          id: 1,
          title: '審核智能水杯提醒系統的新提案',
          dueDate: new Date(Date.now() + 86400000),
          completed: false
        },
        {
          id: 2,
          title: '更新可折疊式太陽能充電板的項目文檔',
          dueDate: new Date(Date.now() + 172800000),
          completed: false
        },
        {
          id: 3,
          title: '回覆工程師的技術問題',
          dueDate: null,
          completed: true
        }
      ]
    }
  } catch (err) {
    console.error('獲取儀表板數據失敗:', err)
    toast.add({
      severity: 'error',
      summary: '載入失敗',
      detail: '無法獲取儀表板數據',
      life: 3000
    })
  }
}

// 頁面載入時獲取數據
onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.customized-timeline :deep(.p-timeline-event-content) {
  @apply bg-white rounded-lg shadow-sm p-4;
}

.customized-timeline :deep(.p-timeline-event-separator) {
  @apply hidden;
}

/* 卡片懸停效果 */
.border-l-4 {
  transition: all 0.3s ease;
}
.border-l-4:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* 按鈕效果 */
.p-button {
  transition: all 0.3s ease;
}
.p-button:not(:disabled):hover {
  transform: translateY(-2px);
}
</style> 