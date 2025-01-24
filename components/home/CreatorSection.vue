<template>
  <div class="creator-section">
    <!-- 載入狀態 -->
    <div v-if="creatorStore.loading || workStore.loading" 
         class="flex justify-center items-center py-8">
      <i class="pi pi-spinner animate-spin text-4xl text-primary-500"></i>
    </div>

    <!-- 錯誤提示 -->
    <div v-else-if="creatorStore.error || workStore.error" 
         class="text-center py-8 text-red-500">
      {{ creatorStore.error || workStore.error }}
    </div>

    <template v-else>
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
                  class="absolute inset-0 w-full h-full object-contain hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 class="text-lg font-semibold mb-2">{{ creator.name }}</h3>
              <p class="text-sm text-gray-600 mb-2">{{ Array.isArray(creator.skills) ? creator.skills.join(', ') : '暫無技能' }}</p>
              <div class="flex items-center mb-3">
                <i class="pi pi-star-fill text-yellow-400 mr-1"></i>
                <span class="text-sm">{{ creator.rating }}</span>
                <span class="text-sm text-gray-500 ml-2">({{ creator.completedProjects }} 個專案)</span>
              </div>
              <div class="flex gap-2">
                <Button
                  label="查看作品"
                  class="p-button-outlined p-button-sm"
                  @click="viewCreator(creator.id)"
                />
                <Button
                  :icon="creator.isFollowed ? 'pi pi-heart-fill' : 'pi pi-heart'"
                  :class="[
                    'p-button-rounded p-button-sm',
                    creator.isFollowed ? 'p-button-primary' : 'p-button-text'
                  ]"
                  :data-creator-id="creator.id"
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
            class="w-full object-contain"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h4 class="text-lg font-semibold mb-1">{{ work.title }}</h4>
              <p class="text-sm opacity-90">{{ work.creatorName }}</p>
              <div class="flex items-center mt-2">
                <span class="flex items-center mr-4">
                  <i class="pi pi-eye mr-1"></i>
                  {{ work.views }}
                </span>
                <span class="flex items-center">
                  <i class="pi pi-heart-fill mr-1"></i>
                  {{ work.likes }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useCreatorStore } from '~/stores/creator'
import { useWorkStore } from '~/stores/works'
import { useRouter } from 'vue-router'

const router = useRouter()
const creatorStore = useCreatorStore()
const workStore = useWorkStore()

onMounted(async () => {
  await Promise.all([
    creatorStore.fetchCreators(),
    workStore.fetchWorks()
  ])
})

// 使用 store 中的創作者數據
const creators = computed(() => creatorStore.getCreators)
const topCreators = computed(() => creatorStore.getTopCreators)

// 使用 store 中的作品數據
const popularWorks = computed(() => workStore.getPopularWorks)

// 查看創作者詳情
const viewCreator = (creatorId: string) => {
  router.push(`/creators/${creatorId}`)
}

// 關注/取消關注創作者
const toggleFollow = async (creatorId: string) => {
  const creator = creatorStore.getCreatorById(creatorId)
  if (creator) {
    try {
      await creatorStore.updateCreator({
        ...creator,
        id: creatorId,
        isFollowed: !creator.isFollowed // 切換關注狀態
      })
      // 更新按鈕樣式
      const button = document.querySelector(`[data-creator-id="${creatorId}"]`)
      if (button) {
        button.classList.toggle('p-button-filled')
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error)
    }
  }
}

// 查看作品詳情
const viewWork = (workId: string) => {
  router.push(`/works/${workId}`)
}
</script>

