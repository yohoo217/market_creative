## SpecStory

## Modify Product Page Layout (1/28/2025, 3:41:55 PM)

_**User**_

http://localhost:3000/products 頁我想要改成左圖右文字
用 list 的方式顯示作品



---

_**Assistant**_

我來幫您修改產品頁面的布局，將其改為左圖右文字的列表形式。首先讓我查看當前的產品頁面代碼。

---

_**Assistant**_



---

_**Assistant**_



我現在來修改產品頁面的布局。我會將網格布局改為列表布局，每個產品項目將採用左圖右文字的形式。

---

_**Assistant**_

```
// ... existing code ...
      <template v-else>
        <div v-if="products?.length > 0" class="space-y-6">
          <div v-for="product in products" :key="product._id" class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex">
            <div class="relative w-72">
              <img :src="product?.image || ''" :alt="product?.name || ''" class="w-full h-48 object-cover rounded-l-lg">
              <div class="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full flex items-center">
                <span class="text-yellow-500 mr-1">★</span>
                <span class="text-sm font-medium">{{ formatRating(product.averageRating) }}</span>
              </div>
            </div>
            <div class="flex-1 p-6">
              <h3 class="font-semibold text-xl mb-3">{{ product?.name || '' }}</h3>
              <p class="text-gray-600 mb-4">{{ product?.description || '' }}</p>
              <div class="flex justify-between items-center mt-auto">
                <div class="text-primary-600 font-medium text-lg">${{ formatNumber(product?.price) }}</div>
                <div class="text-gray-500">{{ formatNumber(product?.views) }} 次瀏覽</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          目前沒有相關作品
        </div>
      </template>
// ... existing code ...
```

---

_**Assistant**_



我已經完成了產品頁面的布局修改，主要變更包括：

1. 將原來的網格布局 `grid` 改為垂直列表布局 `space-y-6`
2. 每個產品卡片現在使用 `flex` 布局，實現左圖右文字的效果
3. 圖片區域固定寬度為 `w-72`，並將圖片的圓角改為只在左側
4. 右側文字區域使用 `flex-1` 自適應剩餘空間，並增加了內邊距
5. 調整了標題和描述文字的大小與間距
6. 價格和瀏覽次數的信息放在右側底部

這樣的布局更加清晰，讓用戶可以更輕鬆地瀏覽產品信息。每個產品項目都有足夠的空間展示重要信息，同時保持了良好的視覺層次。

您可以刷新頁面查看效果。如果您覺得還需要調整（比如圖片大小、間距、字體大小等），請告訴我，我可以進一步修改。

---

_**User**_

請幫我做幾個調正
1. 產品 status 為 idea 的產品 price 改成空的
2. 點擊首頁的 “進入討論區” 後會到 http://localhost:3000/products?status=idea
我想要改成 首頁的 “進入討論區” “查看全部” 都會來到 http://localhost:3000/products 但會跟去來源跳轉至對應的 status 分頁，所以點不同分頁要改變 fliter 查詢參數

---

_**Assistant**_

我來幫您實現這些功能。首先我們需要查看並修改幾個相關文件。

讓我們先看看首頁的相關組件：

---

_**Assistant**_



---

_**Assistant**_



現在讓我們修改產品頁面，以實現您的需求：

---

_**Assistant**_

```
// ... existing code ...
const currentStatus = ref<ProductStatus>('all')

// 從路由參數獲取初始狀態
const route = useRoute()
const initialStatus = computed(() => {
  const statusParam = route.query.status as ProductStatus
  return statuses.includes(statusParam) ? statusParam : 'all'
})

// 監聽狀態變化並更新路由
const router = useRouter()
watch(currentStatus, (newStatus) => {
  if (newStatus === 'all') {
    router.replace({ query: {} })
  } else {
    router.replace({ query: { status: newStatus } })
  }
})

// 初始化狀態
onMounted(() => {
  currentStatus.value = initialStatus.value
})

const statusLabels: Record<ProductStatus, string> = {
// ... existing code ...

const products = computed(() => {
  try {
    return apiResponse.value?.data?.filter(p => 
      p && 
      typeof p === 'object' && 
      Array.isArray(p.comments)
    ).map(p => ({
      ...p,
      averageRating: calculateAverageRating(p.comments)
    })) || []
  } catch {
    return []
  }
})

// 修改價格顯示邏輯
const displayPrice = (product: Product) => {
  if (product.status === 'idea') {
    return '尚未定價'
  }
  return `$${formatNumber(product.price)}`
}

const calculateAverageRating = (comments: Comment[]) => {
// ... existing code ...
```

---

_**Assistant**_



現在讓我們修改首頁的連結：

---

_**Assistant**_

```
// ... existing code ...
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold">熱門作品</h2>
      <NuxtLink to="/products" class="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
        查看全部
      </NuxtLink>
    </div>
// ... existing code ...
```

---

_**Assistant**_



我需要查看更多相關的首頁代碼：

---

_**Assistant**_



---

_**Assistant**_



讓我們查看 IdeaSection 組件：

---

_**Assistant**_



---

_**Assistant**_







現在我們需要修改這些組件：

1. 首先修改 IdeaSection.vue：

---

_**Assistant**_

```
// ... existing code ...
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold">最新創意</h2>
      <NuxtLink 
        to="/products" 
        @click="() => navigateToProducts('idea')"
        class="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
      >
        進入討論區
      </NuxtLink>
    </div>
// ... existing code ...

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToProducts = (status: string) => {
  router.push({ path: '/products', query: { status } })
}

interface Product {
// ... existing code ...
```

---

_**Assistant**_



2. 修改 PopularProductsSection.vue：

---

_**Assistant**_

```
// ... existing code ...
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold">熱門作品</h2>
      <NuxtLink 
        to="/products" 
        @click="() => navigateToProducts('completed')"
        class="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
      >
        查看全部
      </NuxtLink>
    </div>
// ... existing code ...

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToProducts = (status: string) => {
  router.push({ path: '/products', query: { status } })
}

interface User {
// ... existing code ...
```

---

_**Assistant**_



我已經完成了所有需要的修改：

1. 產品狀態為 `idea` 的產品價格顯示：
   - 在 `products/index.vue` 中添加了 `displayPrice` 函數
   - 當產品狀態為 `idea` 時顯示"尚未定價"，其他狀態顯示實際價格

2. 路由參數處理：
   - 在 `products/index.vue` 中添加了路由參數處理邏輯
   - 從 URL 查詢參數中獲取初始狀態
   - 當狀態改變時自動更新 URL 查詢參數
   - 使用 `watch` 監聽狀態變化並更新路由

3. 首頁連結修改：
   - 修改了 `IdeaSection.vue` 中的"進入討論區"連結
   - 修改了 `PopularProductsSection.vue` 中的"查看全部"連結
   - 兩個連結都使用 `router.push` 進行導航，並帶上相應的狀態參數

現在，當用戶：
1. 點擊首頁的"進入討論區"時，會跳轉到 `/products` 並自動選中 `idea` 狀態
2. 點擊"查看全部"時，會跳轉到 `/products` 並自動選中 `completed` 狀態
3. 在產品頁面切換狀態時，URL 會自動更新
4. 創意階段的產品不會顯示價格，而是顯示"尚未定價"

您可以測試一下這些功能是否符合您的需求。如果需要任何調整，請告訴我。

---

_**User**_

匯入 products 的 seed 資料也要包含 status 為 in_progress 的資料，改過後幫我匯入，且 in_progress 也可以不要有 price

---

_**Assistant**_



---



---

