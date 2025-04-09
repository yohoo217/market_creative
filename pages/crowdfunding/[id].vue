<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 加載中 -->
    <div v-if="pending" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
    </div>

    <!-- 錯誤提示 -->
    <div v-else-if="error" class="text-center py-8 text-red-500">
      載入資料時發生錯誤
    </div>

    <template v-else-if="project">
      <!-- 项目基本信息 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-4">{{ project.name }}</h1>
        <p class="text-gray-600 mb-4">專案代碼：{{ id }}</p>
        <div class="relative w-full h-4 bg-gray-200 rounded-full mb-4">
          <div class="absolute h-full bg-primary-500 rounded-full" 
               :style="{ width: `${getProgressPercentage(project)}%` }"></div>
        </div>
        <div class="flex justify-between text-sm mb-8">
          <div>
            <p class="text-2xl font-bold">NT$ {{ formatNumber(project.currentFunding) }}</p>
            <p class="text-gray-600">目標 NT$ {{ formatNumber(project.targetFunding) }}</p>
          </div>
          <div>
            <p class="text-2xl font-bold">{{ getProgressPercentage(project) }}%</p>
            <p class="text-gray-600">達成率</p>
          </div>
          <div>
            <p class="text-2xl font-bold">30</p>
            <p class="text-gray-600">剩餘天數</p>
          </div>
        </div>
      </div>

      <!-- 项目圖片展示 -->
      <div class="mb-8">
        <img :src="project.image" alt="項目封面" class="w-full h-64 object-cover rounded-lg">
      </div>

      <!-- 項目詳情 -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">項目詳情</h2>
        <p class="text-gray-600">{{ project.description }}</p>
      </div>

      <!-- 方案选择区域 -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">支持方案</h2>
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
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const id = route.params.id;

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  currentFunding: number;
  targetFunding: number;
  status: string;
}

interface ApiResponse {
  success: boolean;
  data: Product;
}

// 從API獲取產品詳情
const { data: apiResponse, pending, error } = await useFetch<ApiResponse>(`/api/products/${id}`);

// 產品資料
const project = computed(() => {
  if (!apiResponse.value?.success) return null;
  return apiResponse.value.data;
});

// 計算進度百分比
const getProgressPercentage = (product: Product) => {
  try {
    if (!product) return 0;
    const current = parseFloat(String(product.currentFunding)) || 0;
    const target = parseFloat(String(product.targetFunding)) || 1;
    if (isNaN(current) || isNaN(target) || target <= 0) return 0;
    const percentage = (current / target) * 100;
    return Math.min(100, Math.max(0, percentage)).toFixed(1);
  } catch {
    return 0;
  }
};

// 格式化數字
const formatNumber = (num: number | null | undefined) => {
  try {
    if (num === null || num === undefined) return '0';
    const value = parseFloat(String(num));
    if (isNaN(value)) return '0';
    return value.toLocaleString();
  } catch {
    return '0';
  }
};

// 示例支持方案數據 (這部分可以根據需要從API獲取)
const plans = ref([
  {
    id: 'A',
    name: '方案A (基礎支持)',
    price: 760,
    frontImage: 'https://placehold.co/400x300',
    description: '基礎支持方案',
    benefits: ['商品標準款 x 1']
  },
  {
    id: 'B',
    name: '方案B (進階支持)',
    price: 850,
    frontImage: 'https://placehold.co/400x300',
    description: '進階支持方案',
    benefits: ['商品進階款 x 1', '限定貼紙組']
  },
  {
    id: 'C',
    name: '方案C (豪華支持)',
    price: 950,
    frontImage: 'https://placehold.co/400x300',
    description: '豪華支持方案',
    benefits: ['商品標準款&進階款 x 2', '限定周邊商品']
  }
]);
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