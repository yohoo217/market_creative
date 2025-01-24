<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 頁面標題和發布按鈕 -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold">創意討論區</h1>
      <Button label="發布創意" icon="pi pi-plus" @click="showNewIdeaDialog = true" />
    </div>

    <!-- 創意列表 -->
    <div class="space-y-6">
      <div v-for="idea in ideas" :key="idea.id" class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <div class="flex flex-col md:flex-row">
          <!-- 左側圖片區域 -->
          <div class="md:w-1/3 p-4">
            <div class="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
              <img v-if="idea.images.length" 
                   :src="idea.images[0]" 
                   :alt="idea.title"
                   class="w-full h-full object-cover">
              <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                <i class="pi pi-image text-4xl text-gray-400"></i>
              </div>
            </div>
            <div v-if="idea.images.length > 1" class="grid grid-cols-3 gap-2 mt-2">
              <div v-for="(image, index) in idea.images.slice(1, 4)" 
                   :key="index" 
                   class="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
                <img :src="image" 
                     :alt="'Design ' + (index + 2)"
                     class="w-full h-full object-cover">
              </div>
            </div>
          </div>

          <!-- 右側文字內容區域 -->
          <div class="md:w-2/3 p-6 flex flex-col">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <img :src="idea.userAvatar" alt="User Avatar" class="w-10 h-10 rounded-full">
                <div class="ml-3">
                  <h3 class="font-bold">{{ idea.userName }}</h3>
                  <p class="text-sm text-gray-500">{{ idea.createdAt }}</p>
                </div>
              </div>
            </div>
            <h2 class="text-xl font-bold mb-3">{{ idea.title }}</h2>
            <p class="text-gray-600 mb-4 flex-grow">{{ idea.description }}</p>
            <div class="flex items-center justify-between text-gray-500 mt-4">
              <button class="flex items-center gap-2 hover:text-primary-500 transition-colors">
                <i class="pi pi-heart"></i>
                <span>{{ idea.likes }}</span>
              </button>
              <button class="flex items-center gap-2 hover:text-primary-500 transition-colors">
                <i class="pi pi-comments"></i>
                <span>{{ idea.comments }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 發布創意對話框 -->
    <Dialog v-model:visible="showNewIdeaDialog" header="發布新創意" :modal="true" class="w-full md:w-2/3 lg:w-1/2">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">標題</label>
          <InputText v-model="newIdea.title" class="w-full" placeholder="為您的創意取個標題" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
          <Textarea v-model="newIdea.description" class="w-full" rows="4" placeholder="詳細描述您的創意..." />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">上傳設計圖或草圖</label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div class="text-center">
              <i class="pi pi-image text-3xl text-gray-400 mb-2"></i>
              <p class="text-gray-600">點擊或拖曳檔案至此處</p>
              <Button label="選擇檔案" class="mt-4" />
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" @click="showNewIdeaDialog = false" class="p-button-text" />
          <Button label="發布" @click="publishIdea" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const showNewIdeaDialog = ref(false)
const newIdea = reactive({
  title: '',
  description: '',
  images: [] as string[]
})

// 模擬數據
const ideas = ref([
  {
    id: 1,
    userName: '創意設計師',
    userAvatar: '/user/download.jpg',
    title: '智能水壺創新設計',
    description: '這是一個結合 AI 的智能水壺設計，可以監測使用者的飲水習慣...',
    images: ['/more_product/smart_bottle.png'],
    likes: 24,
    comments: 12,
    createdAt: '2024-03-15'
  },
  // 可以添加更多測試數據
])

const publishIdea = () => {
  // 實現發布邏輯
  showNewIdeaDialog.value = false
}
</script>

<style>
.aspect-w-4 {
  position: relative;
  padding-bottom: 75%; /* 4:3 aspect ratio */
}

.aspect-w-1 {
  position: relative;
  padding-bottom: 100%; /* 1:1 aspect ratio */
}

.aspect-w-4 > *, .aspect-w-1 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style> 