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



---

