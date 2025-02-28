<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- 頂部導航和返回按鈕 -->
      <div class="mb-8">
        <div class="flex items-center mb-2">
          <Button 
            icon="pi pi-arrow-left" 
            text 
            class="p-button-rounded p-button-text mr-2" 
            @click="router.go(-1)" 
          />
          <h1 class="text-3xl font-bold text-gray-800">編輯創意</h1>
        </div>
        <Breadcrumb :model="breadcrumbItems" class="border-none p-0 mb-4" />
      </div>

      <!-- 加載中 -->
      <div v-if="loading" class="py-16 text-center">
        <ProgressSpinner style="width:50px;height:50px" strokeWidth="4" animationDuration=".5s" />
        <p class="text-gray-500 mt-4">正在加載創意詳情...</p>
      </div>
      
      <!-- 錯誤提示 -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-md p-8 text-center my-8">
        <i class="pi pi-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <div class="text-red-500 text-lg font-medium mb-4">{{ error }}</div>
        <p class="text-gray-600 mb-6">無法加載創意詳情，請稍後再試</p>
        <Button label="重新加載" icon="pi pi-refresh" @click="fetchProductDetails" />
      </div>
      
      <!-- 編輯表單 -->
      <div v-else-if="product" class="bg-white rounded-lg shadow-md overflow-hidden">
        <form @submit.prevent="saveProduct" class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- 左側：基本信息 -->
            <div class="lg:col-span-2 space-y-6">
              <div>
                <h2 class="text-xl font-semibold mb-4 flex items-center">
                  <i class="pi pi-info-circle mr-2 text-primary-500"></i>
                  基本信息
                </h2>
                
                <div class="mb-4">
                  <label for="name" class="block text-gray-700 font-medium mb-2">創意名稱 <span class="text-red-500">*</span></label>
                  <InputText 
                    id="name" 
                    v-model="productForm.name" 
                    class="w-full" 
                    :class="{'p-invalid': v$.name.$invalid && v$.name.$dirty}"
                    aria-describedby="name-error"
                  />
                  <small 
                    id="name-error" 
                    class="p-error block mt-1" 
                    v-if="v$.name.$invalid && v$.name.$dirty"
                  >
                    {{ v$.name.$errors[0].$message }}
                  </small>
                </div>
                
                <div class="mb-4">
                  <label for="shortDescription" class="block text-gray-700 font-medium mb-2">簡短描述 <span class="text-red-500">*</span></label>
                  <InputText 
                    id="shortDescription" 
                    v-model="productForm.shortDescription" 
                    class="w-full" 
                    :class="{'p-invalid': v$.shortDescription.$invalid && v$.shortDescription.$dirty}"
                    aria-describedby="short-desc-error"
                  />
                  <small 
                    id="short-desc-error" 
                    class="p-error block mt-1" 
                    v-if="v$.shortDescription.$invalid && v$.shortDescription.$dirty"
                  >
                    {{ v$.shortDescription.$errors[0].$message }}
                  </small>
                  <small class="text-gray-500 block mt-1">簡短概括您的創意（50-100字）</small>
                </div>
                
                <div class="mb-4">
                  <label for="description" class="block text-gray-700 font-medium mb-2">詳細描述 <span class="text-red-500">*</span></label>
                  <Editor 
                    v-model="productForm.description" 
                    editorStyle="height: 250px" 
                    :class="{'p-invalid': v$.description.$invalid && v$.description.$dirty}"
                    aria-describedby="desc-error"
                  />
                  <small 
                    id="desc-error" 
                    class="p-error block mt-1" 
                    v-if="v$.description.$invalid && v$.description.$dirty"
                  >
                    {{ v$.description.$errors[0].$message }}
                  </small>
                  <small class="text-gray-500 block mt-1">詳細說明您的創意，包括功能、目標用戶和解決的問題</small>
                </div>
              </div>
              
              <div>
                <h2 class="text-xl font-semibold mb-4 flex items-center">
                  <i class="pi pi-tags mr-2 text-primary-500"></i>
                  分類與標籤
                </h2>
                
                <div class="mb-4">
                  <label for="category" class="block text-gray-700 font-medium mb-2">創意類別 <span class="text-red-500">*</span></label>
                  <Dropdown 
                    id="category" 
                    v-model="productForm.category" 
                    :options="categoryOptions" 
                    optionLabel="name" 
                    optionValue="id"
                    placeholder="選擇類別" 
                    class="w-full" 
                    :class="{'p-invalid': v$.category.$invalid && v$.category.$dirty}"
                    aria-describedby="category-error"
                  />
                  <small 
                    id="category-error" 
                    class="p-error block mt-1" 
                    v-if="v$.category.$invalid && v$.category.$dirty"
                  >
                    {{ v$.category.$errors[0].$message }}
                  </small>
                </div>
                
                <div class="mb-4">
                  <label for="tags" class="block text-gray-700 font-medium mb-2">標籤</label>
                  <Chips 
                    id="tags" 
                    v-model="productForm.tags" 
                    placeholder="輸入標籤並按Enter添加" 
                    class="w-full"
                    separator=","
                  />
                  <small class="text-gray-500 block mt-1">添加相關標籤，幫助工程師更容易找到您的創意</small>
                </div>
              </div>
              
              <div>
                <h2 class="text-xl font-semibold mb-4 flex items-center">
                  <i class="pi pi-dollar mr-2 text-primary-500"></i>
                  預算與時間
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label for="budget" class="block text-gray-700 font-medium mb-2">預算範圍 (NT$)</label>
                    <div class="p-inputgroup">
                      <span class="p-inputgroup-addon">NT$</span>
                      <InputNumber 
                        id="budget" 
                        v-model="productForm.budget" 
                        placeholder="預估預算" 
                        :min="0" 
                        mode="currency" 
                        currency="TWD" 
                        locale="zh-TW"
                        :minFractionDigits="0" 
                        :maxFractionDigits="0"
                      />
                    </div>
                    <small class="text-gray-500 block mt-1">設置一個合理的預算範圍</small>
                  </div>
                  
                  <div>
                    <label for="timeline" class="block text-gray-700 font-medium mb-2">期望完成時間</label>
                    <Dropdown 
                      id="timeline" 
                      v-model="productForm.timeline" 
                      :options="timelineOptions" 
                      optionLabel="name" 
                      optionValue="value"
                      placeholder="選擇時間範圍" 
                      class="w-full" 
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h2 class="text-xl font-semibold mb-4 flex items-center">
                  <i class="pi pi-list mr-2 text-primary-500"></i>
                  需求與規格
                </h2>
                
                <div class="mb-4">
                  <label for="requirements" class="block text-gray-700 font-medium mb-2">功能需求</label>
                  <Editor 
                    v-model="productForm.requirements" 
                    editorStyle="height: 200px"
                  />
                  <small class="text-gray-500 block mt-1">列出您期望的功能和技術需求</small>
                </div>
                
                <div class="mb-4">
                  <label for="targetAudience" class="block text-gray-700 font-medium mb-2">目標用戶</label>
                  <Textarea 
                    id="targetAudience" 
                    v-model="productForm.targetAudience" 
                    rows="3" 
                    class="w-full" 
                  />
                  <small class="text-gray-500 block mt-1">描述您的目標用戶群體</small>
                </div>
              </div>
            </div>
            
            <!-- 右側：圖片上傳和其他設置 -->
            <div class="space-y-6">
              <div class="bg-gray-50 rounded-lg p-4">
                <h2 class="text-xl font-semibold mb-4 flex items-center">
                  <i class="pi pi-image mr-2 text-primary-500"></i>
                  創意圖片
                </h2>
                
                <div class="mb-4 text-center">
                  <div 
                    class="border-2 border-dashed border-gray-300 rounded-lg p-4 transition-all duration-300 hover:border-primary-500 cursor-pointer mb-2"
                    @click="openFileUpload"
                    @dragover.prevent="onDragOver"
                    @dragleave.prevent="onDragLeave"
                    @drop.prevent="onDrop"
                    :class="{'border-primary-500 bg-primary-50': isDragging}"
                  >
                    <div v-if="imagePreview" class="relative">
                      <img :src="imagePreview" class="max-h-48 mx-auto rounded" alt="Preview" />
                      <Button 
                        icon="pi pi-times" 
                        class="p-button-rounded p-button-danger absolute top-2 right-2" 
                        @click.stop="removeImage" 
                      />
                    </div>
                    <div v-else class="py-8">
                      <i class="pi pi-cloud-upload text-4xl text-gray-400 mb-2"></i>
                      <p class="text-gray-600">點擊或拖放圖片至此處</p>
                      <p class="text-gray-500 text-sm mt-1">支持 JPG, PNG 格式</p>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref="fileInput" 
                    style="display: none" 
                    accept="image/*" 
                    @change="onFileSelected" 
                  />
                  <small 
                    class="p-error block"
                    v-if="v$.image.$invalid && v$.image.$dirty" 
                  >
                    {{ v$.image.$errors[0].$message }}
                  </small>
                  <small class="text-gray-500 block mt-1">上傳一張能代表您創意的圖片</small>
                </div>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <h2 class="text-xl font-semibold mb-4 flex items-center">
                  <i class="pi pi-cog mr-2 text-primary-500"></i>
                  發布設置
                </h2>
                
                <div class="mb-4">
                  <label for="visibility" class="block text-gray-700 font-medium mb-2">可見性</label>
                  <div class="flex flex-col gap-2">
                    <div class="p-field-radiobutton">
                      <RadioButton 
                        id="visibility-public" 
                        name="visibility" 
                        value="public" 
                        v-model="productForm.visibility" 
                      />
                      <label for="visibility-public" class="ml-2">公開</label>
                    </div>
                    <div class="p-field-radiobutton">
                      <RadioButton 
                        id="visibility-private" 
                        name="visibility" 
                        value="private" 
                        v-model="productForm.visibility" 
                      />
                      <label for="visibility-private" class="ml-2">私密</label>
                    </div>
                  </div>
                  <small class="text-gray-500 block mt-1">私密創意只有受邀請的工程師可見</small>
                </div>
                
                <div class="mb-4">
                  <label for="comments" class="block text-gray-700 font-medium mb-2">評論設置</label>
                  <div class="flex items-center">
                    <Checkbox 
                      id="comments" 
                      v-model="productForm.allowComments" 
                      :binary="true" 
                    />
                    <label for="comments" class="ml-2">允許評論</label>
                  </div>
                </div>
              </div>
              
              <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h2 class="font-semibold text-blue-800 mb-2 flex items-center">
                  <i class="pi pi-info-circle mr-2"></i>
                  發布提示
                </h2>
                <ul class="text-sm text-blue-700 space-y-1">
                  <li>• 詳細清晰的描述會吸引更多合適的工程師</li>
                  <li>• 設置合理的預算和時間範圍</li>
                  <li>• 上傳高質量的圖片可以提高吸引力</li>
                  <li>• 定期查看並回覆工程師的問題</li>
                </ul>
              </div>
              
              <!-- 最後編輯時間 -->
              <div v-if="product.updatedAt" class="text-sm text-gray-500 mt-4 text-right">
                最後編輯於: {{ formatDate(product.updatedAt) }}
              </div>
            </div>
          </div>
          
          <!-- 底部操作按鈕 -->
          <div class="mt-8 flex justify-end gap-3">
            <Button 
              type="button" 
              label="取消" 
              icon="pi pi-times" 
              outlined 
              @click="router.go(-1)" 
              :disabled="saving" 
            />
            <Button 
              type="submit" 
              label="保存更改" 
              icon="pi pi-check" 
              :loading="saving" 
            />
          </div>
        </form>
      </div>
      
      <!-- 未找到創意 -->
      <div v-else class="bg-white rounded-lg shadow-md p-8 text-center my-8">
        <i class="pi pi-exclamation-circle text-yellow-500 text-4xl mb-4"></i>
        <h3 class="text-xl font-semibold mb-2">未找到創意</h3>
        <p class="text-gray-600 mb-6">無法找到指定的創意信息，可能已被刪除或您沒有編輯權限。</p>
        <Button label="返回創意列表" icon="pi pi-arrow-left" @click="router.push('/products/my-ideas')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useVuelidate } from '@vuelidate/core'
import { required, maxLength, minLength, helpers } from '@vuelidate/validators'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const fileInput = ref(null)

const productId = computed(() => route.params.id as string)
const product = ref(null)
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const isDragging = ref(false)
const imagePreview = ref('')

// 產品表單數據
const productForm = reactive({
  name: '',
  shortDescription: '',
  description: '',
  category: null,
  tags: [],
  budget: null,
  timeline: null,
  requirements: '',
  targetAudience: '',
  image: null,
  visibility: 'public',
  allowComments: true
})

// 驗證規則
const rules = computed(() => {
  return {
    name: { 
      required: helpers.withMessage('請輸入創意名稱', required),
      minLength: helpers.withMessage('創意名稱至少需要3個字符', minLength(3)),
      maxLength: helpers.withMessage('創意名稱不能超過100個字符', maxLength(100))
    },
    shortDescription: { 
      required: helpers.withMessage('請輸入簡短描述', required),
      minLength: helpers.withMessage('簡短描述至少需要10個字符', minLength(10)),
      maxLength: helpers.withMessage('簡短描述不能超過200個字符', maxLength(200))
    },
    description: { 
      required: helpers.withMessage('請輸入詳細描述', required),
      minLength: helpers.withMessage('詳細描述至少需要50個字符', minLength(50))
    },
    category: { 
      required: helpers.withMessage('請選擇創意類別', required)
    },
    image: {}
  }
})

const v$ = useVuelidate(rules, productForm)

// 面包屑
const breadcrumbItems = computed(() => [
  { label: '首頁', to: '/' },
  { label: '我的創意', to: '/products/my-ideas' },
  { label: product.value?.name || '創意詳情', to: `/products/${productId.value}` },
  { label: '編輯創意' }
])

// 類別選項
const categoryOptions = [
  { id: 'electronics', name: '電子設備' },
  { id: 'smart_home', name: '智能家居' },
  { id: 'health', name: '健康與健身' },
  { id: 'education', name: '教育科技' },
  { id: 'entertainment', name: '娛樂產品' },
  { id: 'sustainability', name: '可持續發展' },
  { id: 'wearables', name: '可穿戴設備' },
  { id: 'mobile_app', name: '移動應用' },
  { id: 'web_app', name: 'Web應用' },
  { id: 'other', name: '其他' }
]

// 時間選項
const timelineOptions = [
  { name: '1-3個月', value: 'short' },
  { name: '3-6個月', value: 'medium' },
  { name: '6-12個月', value: 'long' },
  { name: '1年以上', value: 'very_long' },
  { name: '彈性時間', value: 'flexible' }
]

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知日期'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 獲取產品詳情
const fetchProductDetails = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // 模擬 API 調用 - 實際開發中應使用真實 API
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 示例數據
    product.value = {
      _id: productId.value,
      name: '智能水杯提醒系統',
      shortDescription: '一款能夠提醒用戶按時喝水的智能水杯，通過LED指示燈和手機App通知提醒。',
      description: `<p>這是一款專為忙碌的辦公室工作者和健身愛好者設計的智能水杯，旨在幫助用戶養成良好的飲水習慣。</p>
      <p>主要功能包括：</p>
      <ul>
        <li>通過水杯上的LED燈提醒用戶飲水</li>
        <li>手機App連接，發送飲水提醒通知</li>
        <li>記錄每日飲水量和習慣</li>
        <li>可自定義提醒時間和間隔</li>
        <li>溫度感應，顯示水溫</li>
      </ul>
      <p>市場需求分析：許多辦公室工作者和學生由於工作或學習投入，往往忘記補充水分，長期下來可能導致各種健康問題。這款產品旨在解決這一問題，幫助用戶養成良好的飲水習慣。</p>`,
      category: 'smart_home',
      tags: ['智能家居', '健康', '飲水提醒', '物聯網'],
      budget: 50000,
      timeline: 'medium',
      requirements: `<p>硬件需求：</p>
      <ul>
        <li>環保材質，食品級安全</li>
        <li>內置LED燈提醒系統</li>
        <li>低功耗藍牙連接</li>
        <li>溫度感應功能</li>
        <li>長效電池，至少持續一周</li>
      </ul>
      <p>軟件需求：</p>
      <ul>
        <li>iOS和Android應用程序</li>
        <li>用戶友好的界面設計</li>
        <li>飲水記錄和數據分析</li>
        <li>自定義提醒設置</li>
        <li>可能的社交分享功能</li>
      </ul>`,
      targetAudience: '主要針對辦公室工作者、學生、健身愛好者和需要規律飲水的人群。年齡段主要為18-45歲，有健康意識，願意採用科技產品改善生活習慣的用戶。',
      image: '/default-product-image.png',
      visibility: 'public',
      allowComments: true,
      status: 'idea',
      createdAt: '2023-10-15T08:30:00.000Z',
      updatedAt: '2023-10-18T14:20:00.000Z'
    }
    
    // 填充表單數據
    Object.keys(productForm).forEach(key => {
      if (product.value[key] !== undefined) {
        productForm[key] = product.value[key]
      }
    })
    
    // 設置圖片預覽
    if (product.value.image) {
      imagePreview.value = product.value.image
    }
    
  } catch (err) {
    console.error('獲取產品詳情失敗:', err)
    error.value = '獲取產品詳情失敗'
  } finally {
    loading.value = false
  }
}

// 打開文件選擇器
const openFileUpload = () => {
  fileInput.value.click()
}

// 文件選擇處理
const onFileSelected = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFile(file)
  }
}

// 拖放相關處理
const onDragOver = () => {
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (event) => {
  isDragging.value = false
  if (event.dataTransfer.files.length) {
    handleFile(event.dataTransfer.files[0])
  }
}

// 處理上傳的文件
const handleFile = (file) => {
  if (!file.type.match('image.*')) {
    toast.add({
      severity: 'error',
      summary: '文件類型錯誤',
      detail: '請上傳圖片文件 (JPG, PNG)',
      life: 3000
    })
    return
  }
  
  if (file.size > 5 * 1024 * 1024) {
    toast.add({
      severity: 'error',
      summary: '文件過大',
      detail: '圖片大小不能超過 5MB',
      life: 3000
    })
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
    productForm.image = file
  }
  reader.readAsDataURL(file)
}

// 移除圖片
const removeImage = () => {
  imagePreview.value = ''
  productForm.image = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 保存產品
const saveProduct = async () => {
  const isValid = await v$.value.$validate()
  
  if (!isValid) {
    toast.add({
      severity: 'error',
      summary: '表單驗證失敗',
      detail: '請檢查並修正表單中的錯誤',
      life: 3000
    })
    return
  }
  
  saving.value = true
  
  try {
    // 模擬 API 調用 - 實際開發中應使用真實 API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.add({
      severity: 'success',
      summary: '更新成功',
      detail: '創意信息已成功更新',
      life: 3000
    })
    
    // 導航回產品詳情頁
    router.push(`/products/${productId.value}`)
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: '保存失敗',
      detail: err.message || '更新創意時發生錯誤',
      life: 5000
    })
  } finally {
    saving.value = false
  }
}

// 頁面載入時獲取數據
onMounted(() => {
  fetchProductDetails()
})
</script>

<style scoped>
/* 拖放區域效果 */
.border-dashed {
  transition: all 0.3s ease;
}
.border-dashed:hover {
  border-color: var(--primary-color);
  background-color: var(--primary-50);
}

/* 按鈕效果 */
.p-button {
  transition: all 0.3s ease;
}
.p-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style> 