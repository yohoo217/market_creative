<template>
  <div class="engineer-section">
    <!-- 技能分類標籤 -->
    <div class="skill-tags flex flex-wrap gap-2 mb-8">
      <Button
        v-for="skill in skills"
        :key="skill.id"
        :label="skill.name"
        :class="['p-button-sm', selectedSkill === skill.id ? 'p-button-primary' : 'p-button-outlined']"
        @click="filterBySkill(skill.id)"
      />
    </div>

    <!-- 專案列表 -->
    <div class="projects grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="project-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
      >
        <div class="p-4">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-semibold">{{ project.title }}</h3>
            <Tag :value="project.status" :severity="getStatusSeverity(project.status)" />
          </div>
          <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ project.description }}</p>
          <div class="flex flex-wrap gap-2 mb-4">
            <Chip
              v-for="tag in project.tags"
              :key="tag"
              :label="tag"
              class="text-xs"
            />
          </div>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <i class="pi pi-clock mr-2 text-gray-500"></i>
              <span class="text-sm text-gray-500">{{ project.deadline }}</span>
            </div>
            <div class="text-primary-600 font-semibold">
              NT$ {{ project.budget.toLocaleString() }}
            </div>
          </div>
          <div class="flex gap-2">
            <Button
              label="查看詳情"
              class="p-button-outlined p-button-sm flex-1"
              @click="viewProject(project.id)"
            />
            <Button
              label="投遞報價"
              class="p-button-sm flex-1"
              @click="submitQuote(project.id)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 分頁控制 -->
    <div class="flex justify-center mt-8">
      <Paginator
        v-model:first="first"
        :rows="9"
        :totalRecords="totalProjects"
        @page="onPageChange($event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 技能分類
const skills = ref([
  { id: 1, name: '塑膠射出' },
  { id: 2, name: '金屬車銷' },
  { id: 3, name: '橡膠熱壓' },
  { id: 4, name: '鋁擠型' }
])

const selectedSkill = ref<number | null>(null)
const first = ref(0)
const totalProjects = ref(45) // 總專案數

// 模擬專案數據
const projects = ref([
{
    id: 1,
    title: '塑膠射出',
    description: '將塑膠粒子加熱熔融後射入模具，冷卻成型，適合大量製造塑膠產品。',
    status: '招募中',
    tags: ['大批量生產', '工業製程', '塑膠產品'],
    deadline: '30 天',
    budget: 150000
},
{
    id: 2,
    title: '金屬車銷',
    description: '使用車床加工金屬材料，製作高精度零件，常用於機械和汽車工業。',
    status: '招募中',
    tags: ['精密加工', '機械零件', '金屬製程'],
    deadline: '20 天',
    budget: 200000
},
{
    id: 3,
    title: '橡膠熱壓',
    description: '加熱橡膠材料並施壓於模具中成型，用於製作耐磨、防水的橡膠製品。',
    status: '進行中',
    tags: ['橡膠製品', '模具壓製', '耐磨材料'],
    deadline: '40 天',
    budget: 120000
}
])

// 根據選擇的技能過濾專案
const filteredProjects = computed(() => {
  if (!selectedSkill.value) return projects.value
  // TODO: 實現根據技能過濾的邏輯
  return projects.value
})

// 獲取狀態對應的樣式
const getStatusSeverity = (status: string) => {
  switch (status) {
    case '急件':
      return 'danger'
    case '招募中':
      return 'success'
    case '進行中':
      return 'info'
    default:
      return 'warning'
  }
}

// 過濾專案
const filterBySkill = (skillId: number) => {
  selectedSkill.value = selectedSkill.value === skillId ? null : skillId
}

// 查看專案詳情
const viewProject = (projectId: number) => {
  // TODO: 導航到專案詳情頁面
  console.log('View project:', projectId)
}

// 提交報價
const submitQuote = (projectId: number) => {
  // TODO: 打開報價對話框
  console.log('Submit quote for project:', projectId)
}

// 處理分頁變化
const onPageChange = (event: any) => {
  first.value = event.first
  // TODO: 加載對應頁碼的數據
}
</script>

<style scoped>
.engineer-section {
  @apply space-y-8;
}

.project-card {
  @apply border border-gray-200;
}

:deep(.p-chip) {
  @apply bg-gray-100 text-gray-700;
}
</style>