<template>
  <div class="creator-section">
    <!-- 創作者輪播展示 -->
    <div class="featured-creators mb-8">
      <Carousel
        :value="creators"
        :numVisible="4"
        :numScroll="1"
        :circular="true"
        :autoplayInterval="5000"
      >
        <template #item="{ data: creator }">
          <div class="creator-card p-4">
            <div class="relative w-full pb-[100%] mb-4 overflow-hidden rounded-lg">
              <img
                :src="creator.avatar"
                :alt="creator.name"
                class="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 class="text-lg font-semibold mb-2">{{ creator.name }}</h3>
            <p class="text-sm text-gray-600 mb-2">{{ creator.specialty }}</p>
            <div class="flex items-center mb-3">
              <i class="pi pi-star-fill text-yellow-400 mr-1"></i>
              <span class="text-sm">{{ creator.rating }}</span>
              <span class="text-sm text-gray-500 ml-2">({{ creator.reviewCount }} 評價)</span>
            </div>
            <div class="flex gap-2">
              <Button
                label="查看作品"
                class="p-button-outlined p-button-sm"
                @click="viewCreator(creator.id)"
              />
              <Button
                icon="pi pi-heart"
                class="p-button-rounded p-button-text p-button-sm"
                @click="toggleFollow(creator.id)"
              />
            </div>
          </div>
        </template>
      </Carousel>
    </div>

    <!-- 熱門作品展示 -->
    <div class="popular-works grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="work in popularWorks"
        :key="work.id"
        class="work-card group relative overflow-hidden rounded-lg cursor-pointer"
        @click="viewWork(work.id)"
      >
        <img
          :src="work.image"
          :alt="work.title"
          class="w-full aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h4 class="text-lg font-semibold mb-1">{{ work.title }}</h4>
            <p class="text-sm opacity-90">{{ work.creator }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 模擬創作者數據
const creators = ref([
  {
    id: 1,
    name: '王小明',
    specialty: 'UI/UX 設計師',
    avatar: 'https://picsum.photos/seed/creator1/300/300',
    rating: 4.8,
    reviewCount: 124
  },
  {
    id: 2,
    name: '李小華',
    specialty: '插畫家',
    avatar: 'https://picsum.photos/seed/creator2/300/300',
    rating: 4.9,
    reviewCount: 89
  },
  {
    id: 3,
    name: '張小美',
    specialty: '平面設計師',
    avatar: 'https://picsum.photos/seed/creator3/300/300',
    rating: 4.7,
    reviewCount: 156
  },
  {
    id: 4,
    name: '陳小強',
    specialty: '3D 建模師',
    avatar: 'https://picsum.photos/seed/creator4/300/300',
    rating: 4.6,
    reviewCount: 92
  },
  {
    id: 5,
    name: '林小芳',
    specialty: '動畫設計師',
    avatar: 'https://picsum.photos/seed/creator5/300/300',
    rating: 4.9,
    reviewCount: 178
  }
])

// 模擬熱門作品數據
const popularWorks = ref([
  {
    id: 1,
    title: '木料專家',
    creator: '王小明',
    image: 'https://picsum.photos/seed/work1/800/600'
  },
  {
    id: 2,
    title: '軟材質/塑膠射出專家',
    creator: '李小華',
    image: 'https://picsum.photos/seed/work2/800/600'
  },
  {
    id: 3,
    title: '石材車銷專家',
    creator: '張小美',
    image: 'https://picsum.photos/seed/work3/800/600'
  },
  {
    id: 4,
    title: '橡膠熱壓專家',
    creator: '陳小強',
    image: 'https://picsum.photos/seed/work4/800/600'
  },
  {
    id: 5,
    title: '公仔角色設計',
    creator: '林小芳',
    image: 'https://picsum.photos/seed/work5/800/600'
  },
  {
    id: 6,
    title: '鋁擠型專家',
    creator: '王小明',
    image: 'https://picsum.photos/seed/work6/800/600'
  }
])

// 查看創作者詳情
const viewCreator = (creatorId: number) => {
  // TODO: 導航到創作者詳情頁面
  console.log('View creator:', creatorId)
}

// 關注/取消關注創作者
const toggleFollow = (creatorId: number) => {
  // TODO: 實現關注功能
  console.log('Toggle follow:', creatorId)
}

// 查看作品詳情
const viewWork = (workId: number) => {
  // TODO: 導航到作品詳情頁面
  console.log('View work:', workId)
}
</script>

<style scoped>
.creator-section {
  @apply space-y-12;
}

.creator-card {
  @apply bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300;
}

.work-card {
  @apply bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300;
}
</style>