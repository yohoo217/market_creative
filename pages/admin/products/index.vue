<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold mb-4">產品管理</h1>
      
      <!-- 搜索和篩選 -->
      <div class="flex flex-wrap gap-4 mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索產品..."
          class="px-4 py-2 border rounded-lg"
        />
        <select
          v-model="categoryFilter"
          class="px-4 py-2 border rounded-lg"
        >
          <option value="">所有類別</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        <select
          v-model="statusFilter"
          class="px-4 py-2 border rounded-lg"
        >
          <option value="">所有狀態</option>
          <option value="active">上架中</option>
          <option value="draft">草稿</option>
          <option value="archived">已下架</option>
        </select>
        <button 
          @click="fetchProducts" 
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          搜索
        </button>
        <button 
          @click="openNewProductModal" 
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 ml-auto"
        >
          新增產品
        </button>
      </div>

      <!-- 錯誤提示 -->
      <div
        v-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
      >
        {{ error }}
      </div>

      <!-- 加載中 -->
      <div
        v-if="loading"
        class="flex justify-center items-center py-8"
      >
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>

      <!-- 產品列表 -->
      <div
        v-else
        class="bg-white rounded-lg shadow overflow-hidden"
      >
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                產品
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                類別
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                價格
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                庫存
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                狀態
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                創建時間
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="product in products"
              :key="product._id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img
                    :src="product.images && product.images.length > 0 ? product.images[0] : '/placeholder.png'"
                    class="h-10 w-10 rounded-md object-cover"
                    alt=""
                  />
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ product.name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ product.sku }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ product.category }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatPrice(product.price) }}</div>
                <div v-if="product.originalPrice > product.price" class="text-xs text-gray-500 line-through">
                  {{ formatPrice(product.originalPrice) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div :class="[
                  'text-sm',
                  product.stock > 10 ? 'text-green-600' : (product.stock > 0 ? 'text-yellow-600' : 'text-red-600')
                ]">
                  {{ product.stock }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  product.status === 'active' ? 'bg-green-100 text-green-800' : 
                  (product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800')
                ]">
                  {{ product.status === 'active' ? '上架中' : (product.status === 'draft' ? '草稿' : '已下架') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(product.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editProduct(product)"
                  class="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  編輯
                </button>
                <button
                  @click="toggleProductStatus(product)"
                  :class="product.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                >
                  {{ product.status === 'active' ? '下架' : '上架' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 無數據提示 -->
        <div
          v-if="products.length === 0"
          class="text-center py-8 text-gray-500"
        >
          暫無產品數據
        </div>
      </div>

      <!-- 分頁 -->
      <div class="mt-4 flex justify-between items-center">
        <div class="text-sm text-gray-500">
          共 {{ totalProducts }} 個產品
        </div>
        <div class="flex space-x-2">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            :class="[
              'px-3 py-1 rounded border',
              currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            上一頁
          </button>
          <button 
            @click="nextPage" 
            :disabled="currentPage * pageSize >= totalProducts"
            :class="[
              'px-3 py-1 rounded border',
              currentPage * pageSize >= totalProducts ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            下一頁
          </button>
        </div>
      </div>
    </div>

    <!-- 產品編輯模態框 (實際實現時應該抽離成組件) -->
    <div v-if="showProductModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-3xl p-6">
        <h2 class="text-xl font-bold mb-4">{{ editingProduct._id ? '編輯產品' : '新增產品' }}</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">產品名稱</label>
            <input 
              v-model="editingProduct.name" 
              type="text" 
              class="w-full p-2 border rounded"
              placeholder="輸入產品名稱"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">產品類別</label>
            <select 
              v-model="editingProduct.category" 
              class="w-full p-2 border rounded"
            >
              <option value="">選擇類別</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">價格</label>
            <input 
              v-model="editingProduct.price" 
              type="number" 
              class="w-full p-2 border rounded"
              placeholder="輸入價格"
              min="0"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">原價</label>
            <input 
              v-model="editingProduct.originalPrice" 
              type="number" 
              class="w-full p-2 border rounded"
              placeholder="輸入原價"
              min="0"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">庫存</label>
            <input 
              v-model="editingProduct.stock" 
              type="number" 
              class="w-full p-2 border rounded"
              placeholder="輸入庫存"
              min="0"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">狀態</label>
            <select 
              v-model="editingProduct.status" 
              class="w-full p-2 border rounded"
            >
              <option value="active">上架中</option>
              <option value="draft">草稿</option>
              <option value="archived">已下架</option>
            </select>
          </div>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">產品描述</label>
          <textarea 
            v-model="editingProduct.description" 
            class="w-full p-2 border rounded"
            rows="4" 
            placeholder="輸入產品描述"
          ></textarea>
        </div>
        
        <div class="flex justify-end space-x-2">
          <button 
            @click="closeProductModal" 
            class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
          >
            取消
          </button>
          <button 
            @click="saveProduct" 
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 產品列表數據
const products = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalProducts = ref(0)

// 編輯相關
const showProductModal = ref(false)
const editingProduct = ref<any>({
  name: '',
  category: '',
  description: '',
  price: 0,
  originalPrice: 0,
  stock: 0,
  status: 'draft',
  images: []
})

// 模擬類別列表
const categories = ref([
  '數位產品',
  '設計資源',
  '軟體工具',
  '線上課程',
  '創意素材'
])

// 格式化時間
const formatDate = (date: string | Date | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleString()
}

// 格式化價格
const formatPrice = (price: number) => {
  return `NT$ ${price.toLocaleString()}`
}

// 分頁控制
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchProducts()
  }
}

const nextPage = () => {
  if (currentPage.value * pageSize.value < totalProducts.value) {
    currentPage.value++
    fetchProducts()
  }
}

// 獲取產品列表
const fetchProducts = async () => {
  loading.value = true
  error.value = null
  try {
    const queryParams = new URLSearchParams()
    if (searchQuery.value) queryParams.append('search', searchQuery.value)
    if (categoryFilter.value) queryParams.append('category', categoryFilter.value)
    if (statusFilter.value) queryParams.append('status', statusFilter.value)
    queryParams.append('page', currentPage.value.toString())
    queryParams.append('limit', pageSize.value.toString())

    // 這裡假設有對應的 API，如果沒有實際 API，可以使用模擬數據
    const response = await fetch(`/api/admin/products?${queryParams.toString()}`)
    const data = await response.json()
    
    if (data.success && data.data) {
      products.value = data.data.products
      totalProducts.value = data.data.total
    } else {
      throw new Error(data.message || '獲取產品列表失敗')
    }
  } catch (err) {
    console.error('獲取產品列表失敗:', err)
    // 由於可能沒有實際 API，這裡使用模擬數據
    simulateProductData()
    error.value = '使用模擬數據 (API 可能未實現)'
  } finally {
    loading.value = false
  }
}

// 模擬產品數據
const simulateProductData = () => {
  const mockProducts = []
  for (let i = 1; i <= 15; i++) {
    const categoryIndex = i % categories.value.length
    const status = i % 3 === 0 ? 'archived' : (i % 2 === 0 ? 'draft' : 'active')
    const price = Math.floor(Math.random() * 1000) + 100
    
    mockProducts.push({
      _id: `prod_${i}`,
      name: `測試產品 ${i}`,
      sku: `SKU-${10000 + i}`,
      category: categories.value[categoryIndex],
      price: price,
      originalPrice: i % 2 === 0 ? price + 200 : price,
      stock: Math.floor(Math.random() * 30),
      status: status,
      description: `這是測試產品的描述內容，可以包含產品的特點和使用方法等信息。`,
      images: [`/placeholder-${(i % 5) + 1}.jpg`],
      createdAt: new Date(Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000))
    })
  }
  
  products.value = mockProducts
  totalProducts.value = 50 // 模擬總數
}

// 打開新增產品模態框
const openNewProductModal = () => {
  editingProduct.value = {
    name: '',
    category: '',
    description: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    status: 'draft',
    images: []
  }
  showProductModal.value = true
}

// 編輯產品
const editProduct = (product: any) => {
  editingProduct.value = { ...product }
  showProductModal.value = true
}

// 關閉產品模態框
const closeProductModal = () => {
  showProductModal.value = false
}

// 保存產品
const saveProduct = async () => {
  try {
    loading.value = true
    // 這裡應該調用實際的 API 保存產品
    // const response = await fetch(`/api/admin/products${editingProduct.value._id ? `/${editingProduct.value._id}` : ''}`, {
    //   method: editingProduct.value._id ? 'PUT' : 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(editingProduct.value)
    // })
    // const data = await response.json()
    
    // 模擬保存成功
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 重新獲取產品列表
    await fetchProducts()
    
    // 關閉模態框
    closeProductModal()
    
  } catch (err) {
    console.error('保存產品失敗:', err)
    error.value = '保存產品失敗'
  } finally {
    loading.value = false
  }
}

// 切換產品狀態
const toggleProductStatus = async (product: any) => {
  try {
    loading.value = true
    const newStatus = product.status === 'active' ? 'archived' : 'active'
    
    // 這裡應該調用實際的 API 更新產品狀態
    // const response = await fetch(`/api/admin/products/${product._id}/status`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ status: newStatus })
    // })
    // const data = await response.json()
    
    // 模擬更新成功
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 直接更新本地數據
    const index = products.value.findIndex(p => p._id === product._id)
    if (index !== -1) {
      products.value[index].status = newStatus
    }
    
  } catch (err) {
    console.error('更新產品狀態失敗:', err)
    error.value = '更新產品狀態失敗'
  } finally {
    loading.value = false
  }
}

// 初始加載
onMounted(() => {
  fetchProducts()
})
</script> 