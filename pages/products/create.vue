<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-3xl">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h1 class="text-3xl font-bold mb-8">建立新創意</h1>

        <div v-if="!userStore.isLoggedIn || !userStore.hasRole(UserRole.IDEATOR)" class="text-center py-8">
          <div class="text-red-500 mb-4">
            <i class="pi pi-exclamation-circle text-4xl"></i>
          </div>
          <h2 class="text-xl font-semibold mb-2">權限不足</h2>
          <p class="text-gray-600 mb-4">只有創意者才能建立新的創意</p>
          <button 
            @click="router.push('/products')"
            class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            返回作品列表
          </button>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-2">
            <label for="name" class="block font-medium text-gray-700">創意名稱</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="請輸入創意名稱"
            />
          </div>

          <div class="space-y-2">
            <label for="description" class="block font-medium text-gray-700">創意描述</label>
            <textarea
              id="description"
              v-model="form.description"
              required
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="請詳細描述您的創意..."
            ></textarea>
          </div>

          <div class="space-y-2">
            <label for="category" class="block font-medium text-gray-700">分類</label>
            <select
              id="category"
              v-model="form.category"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">請選擇分類</option>
              <option v-for="category in categories" :key="category.value" :value="category.value">
                {{ category.label }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label for="dimensions" class="block font-medium text-gray-700">預計尺寸</label>
            <input
              id="dimensions"
              v-model="form.dimensions"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="例如：長 30cm x 寬 20cm x 高 10cm"
            />
          </div>

          <div class="space-y-2">
            <label for="travelDistance" class="block font-medium text-gray-700">預計規格</label>
            <input
              id="travelDistance"
              v-model="form.travelDistance"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="例如：10cm"
            />
          </div>

          <div class="space-y-2">
            <label class="block font-medium text-gray-700">封面圖片</label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div class="space-y-1 text-center">
                <div v-if="coverImagePreview" class="mb-4">
                  <img :src="coverImagePreview" alt="封面預覽" class="mx-auto h-32 w-auto">
                  <button 
                    type="button" 
                    @click="removeCoverImage"
                    class="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    移除圖片
                  </button>
                </div>
                <div v-else class="flex text-sm text-gray-600">
                  <label
                    for="cover-image"
                    class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                  >
                    <span>上傳圖片</span>
                    <input
                      id="cover-image"
                      type="file"
                      accept="image/*"
                      class="sr-only"
                      @change="handleCoverImageChange"
                    />
                  </label>
                  <p class="pl-1">或拖放圖片至此</p>
                </div>
                <p class="text-xs text-gray-500">
                  支援 PNG, JPG, GIF，建議尺寸 1200x800 像素
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block font-medium text-gray-700">創意細節圖片</label>
            <div class="mt-1 grid grid-cols-2 gap-4">
              <div
                v-for="(preview, index) in detailImagePreviews"
                :key="index"
                class="relative"
              >
                <img :src="preview" alt="細節圖預覽" class="h-32 w-full object-cover rounded-lg">
                <button 
                  type="button"
                  @click="removeDetailImage(index)"
                  class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <i class="pi pi-times"></i>
                </button>
              </div>
              <div
                v-if="detailImagePreviews.length < 5"
                class="border-2 border-gray-300 border-dashed rounded-lg p-4 flex items-center justify-center"
              >
                <label class="cursor-pointer text-center">
                  <div class="text-primary-600">
                    <i class="pi pi-plus text-2xl"></i>
                  </div>
                  <span class="mt-2 block text-sm text-gray-600">添加圖片</span>
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleDetailImagesChange"
                  />
                </label>
              </div>
            </div>
            <p class="text-xs text-gray-500">最多可上傳 5 張細節圖片</p>
          </div>

          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="router.push('/products')"
              class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center"
            >
              <i v-if="loading" class="pi pi-spinner animate-spin mr-2"></i>
              <span>{{ loading ? '建立中...' : '建立創意' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores/user'
import { UserRole } from '~/server/models/User'

const router = useRouter()
const userStore = useUserStore()

const categories = [
  { value: '3c', label: '3C科技' },
  { value: 'home', label: '居家生活' },
  { value: 'travel', label: '旅遊戶外' },
  { value: 'health', label: '健康美容' },
  { value: 'food', label: '美食' },
  { value: 'education', label: '教育學習' },
  { value: 'entertainment', label: '娛樂休閒' },
  { value: 'other', label: '其他' }
]

const form = ref({
  name: '',
  description: '',
  category: '',
  dimensions: '',
  travelDistance: '',
  coverImage: null as File | null,
  detailImages: [] as File[]
})

const loading = ref(false)
const coverImagePreview = ref('')
const detailImagePreviews = ref<string[]>([])

const handleCoverImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    form.value.coverImage = file
    coverImagePreview.value = URL.createObjectURL(file)
  }
}

const removeCoverImage = () => {
  form.value.coverImage = null
  coverImagePreview.value = ''
}

const handleDetailImagesChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    if (form.value.detailImages.length < 5) {
      form.value.detailImages.push(file)
      detailImagePreviews.value.push(URL.createObjectURL(file))
    }
  }
}

const removeDetailImage = (index: number) => {
  form.value.detailImages.splice(index, 1)
  detailImagePreviews.value.splice(index, 1)
}

const handleSubmit = async () => {
  try {
    loading.value = true

    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('description', form.value.description)
    formData.append('category', form.value.category)
    formData.append('dimensions', form.value.dimensions)
    formData.append('travelDistance', form.value.travelDistance)
    
    if (form.value.coverImage) {
      formData.append('coverImage', form.value.coverImage)
    }

    // 添加细节图片
    form.value.detailImages.forEach((image, index) => {
      formData.append(`detailImages`, image)
    })

    // 调用创建创意的 API
    const { data, error } = await useFetch('/api/products', {
      method: 'post',
      body: formData,
      credentials: 'include',
      headers: {
        accept: 'application/json'
      }
    })

    if (error.value) {
      throw new Error(error.value.message || '建立創意失敗')
    }

    // 创建成功后跳转到创意详情页
    router.push('/products')
  } catch (error: any) {
    console.error('创建创意失败:', error)
    // 显示错误提示
    const message = error.message || '建立創意時發生錯誤'
    alert(message) // 临时使用 alert，之后可以改用更友好的提示方式
  } finally {
    loading.value = false
  }
}
</script> 