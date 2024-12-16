<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">募資專案</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- 暫時使用靜態數據 -->
      <Card v-for="project in projects" :key="project.id" class="h-full">
        <template #header>
          <img :src="project.image" :alt="project.name" class="w-full h-48 object-cover" />
        </template>
        <template #title>
          {{ project.name }}
        </template>
        <template #content>
          <p class="text-gray-600 mb-4">{{ project.description }}</p>
          <div class="space-y-4">
            <div class="flex justify-between">
              <span>募資目標</span>
              <span class="font-bold">NT$ {{ project.goal }}</span>
            </div>
            <div class="flex justify-between">
              <span>已募金額</span>
              <span class="font-bold text-primary-600">NT$ {{ project.current }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-primary-600 h-2.5 rounded-full" 
                   :style="{ width: (project.current / project.goal * 100) + '%' }">
              </div>
            </div>
            <div class="flex justify-between text-sm text-gray-500">
              <span>{{ Math.round(project.current / project.goal * 100) }}% 達成</span>
              <span>剩餘 {{ project.daysLeft }} 天</span>
            </div>
          </div>
        </template>
        <template #footer>
          <Button label="支持專案" class="w-full" />
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
const projects = [
  {
    id: 1,
    name: '創新設計電動自行車',
    description: '結合環保概念的新型電動自行車，採用可回收材料製作。',
    goal: 500000,
    current: 320000,
    daysLeft: 15,
    image: 'https://picsum.photos/seed/bike/400/300'
  },
  {
    id: 2,
    name: '智能居家監控系統',
    description: '整合 AI 技術的智能家居系統，讓生活更安全便利。',
    goal: 300000,
    current: 150000,
    daysLeft: 20,
    image: 'https://picsum.photos/seed/smart/400/300'
  },
  {
    id: 3,
    name: '環保餐具組合',
    description: '使用天然材料製作的環保餐具，減少塑料使用。',
    goal: 100000,
    current: 80000,
    daysLeft: 10,
    image: 'https://picsum.photos/seed/eco/400/300'
  }
]
</script>