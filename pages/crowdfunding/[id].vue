<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 项目基本信息 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-4">{{ project.name }}</h1>
      <p class="text-gray-600 mb-4">專案代碼：{{ id }}</p>
      <div class="relative w-full h-4 bg-gray-200 rounded-full mb-4">
        <div class="absolute h-full bg-primary-500 rounded-full" 
             :style="{ width: `${project.progress}%` }"></div>
      </div>
      <div class="flex justify-between text-sm mb-8">
        <div>
          <p class="text-2xl font-bold">NT$ {{ project.currentAmount }}</p>
          <p class="text-gray-600">目標 NT$ {{ project.targetAmount }}</p>
        </div>
        <div>
          <p class="text-2xl font-bold">{{ project.progress }}%</p>
          <p class="text-gray-600">達成率</p>
        </div>
        <div>
          <p class="text-2xl font-bold">{{ project.daysLeft }}</p>
          <p class="text-gray-600">剩餘天數</p>
        </div>
      </div>
    </div>

    <!-- 方案选择区域 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="plan in plans" :key="plan.id" 
           class="relative group perspective">
        <div class="relative w-full h-[400px] transition-transform duration-500 transform-style-preserve-3d group-hover:rotate-y-180">
          <!-- 卡片正面 -->
          <div class="absolute w-full h-full bg-red-100 rounded-lg p-6 backface-hidden">
            <img :src="plan.frontImage" alt="方案封面" class="w-full h-64 object-cover rounded-lg mb-4">
            <h3 class="text-xl font-bold mb-2">{{ plan.name }}</h3>
            <p class="text-gray-600">NT$ {{ plan.price }}</p>
          </div>
          
          <!-- 卡片背面 -->
          <div class="absolute w-full h-full bg-white rounded-lg p-6 backface-hidden rotate-y-180">
            <h3 class="text-xl font-bold mb-4">{{ plan.name }}</h3>
            <div class="text-gray-600">
              <p class="mb-4">{{ plan.description }}</p>
              <ul class="list-disc list-inside mb-4">
                <li v-for="(benefit, index) in plan.benefits" 
                    :key="index">{{ benefit }}</li>
              </ul>
              <p class="font-bold">NT$ {{ plan.price }}</p>
            </div>
            <button class="absolute bottom-6 left-6 right-6 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors">
              選擇方案
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const id = route.params.id;

// 这里可以根据 id 从 API 获取项目数据
const project = ref({
  name: 'Front Wheel A2',
  code: 'JA024014-001',
  currentAmount: 34020,
  targetAmount: 100000,
  progress: 73,
  daysLeft: 30
})

const plans = ref([
  {
    id: 'A',
    name: '方案A (Ana Teresa)',
    price: 760,
    frontImage: 'https://placehold.co/400x300',
    description: '基礎支持方案',
    benefits: ['Front Wheel A2 黑色款 x 1']
  },
  {
    id: 'B',
    name: '方案B (Isabella)',
    price: 850,
    frontImage: 'https://placehold.co/400x300',
    description: '進階支持方案',
    benefits: ['Front Wheel A2 灰色款 x 1', '限定貼紙組']
  },
  {
    id: 'C',
    name: '方案C (Rodriga)',
    price: 950,
    frontImage: 'https://placehold.co/400x300',
    description: '豪華支持方案',
    benefits: ['Front Wheel A2 黑色&灰色 x 2', '10點的color點數']
  }
])
</script>

<style scoped>
.perspective {
  perspective: 1000px;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.transform-style-preserve-3d {
  transform-style: preserve-3d;
}
</style> 