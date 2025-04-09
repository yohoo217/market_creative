# 重構指南

本文件總結了對專案進行的重構和優化，包括抽象化、API 處理、CSS 函數化和路由優化等方面。

## 1. 抽象化類和組件

### 基礎組件

我們創建了以下基礎組件：

- `BaseCard.vue` - 通用卡片元件，提供一致的外觀和行為
- `BaseProductCard.vue` - 產品卡片的抽象化，基於 BaseCard 構建
- `BaseInput.vue` - 使用 Vue 3 的 defineModel 特性創建的表單輸入元件

這些基礎組件可以被擴展和調整，以適應不同的使用場景，同時保持一致的外觀和使用方式。

### 組件抽象化優勢

1. **一致性**：確保整個應用程序中的 UI 元素保持一致的外觀和行為
2. **可維護性**：集中管理 UI 元素，便於修改和維護
3. **可重用性**：減少重複代碼，提高開發效率
4. **可擴展性**：基礎組件可以被輕鬆擴展以滿足特定需求

## 2. API 處理

### API 組件和 Composables

我們添加了以下 API 相關功能：

- `ApiDataTable.vue` - 通用數據表組件，用於顯示 API 數據並支持泛型
- `useApi.ts` - 通用 API 處理 Composable，包含：
  - `useApi<T>` - 基礎 API 請求 composable
  - `useApiPost<T, P>` - 處理 POST 請求的 composable
  - `useApiCrud<T, P>` - 處理 CRUD 操作的 composable

### API 抽象化優勢

1. **類型安全**：使用 TypeScript 泛型提供完整的類型檢查和代碼提示
2. **統一處理**：統一處理 API 請求、加載狀態和錯誤處理
3. **代碼減少**：減少重複的 API 處理代碼
4. **可測試性**：API 邏輯集中在一處，便於測試

## 3. CSS 函數化

我們創建了 `assets/css/functions.css` 文件，實現了以下功能：

- CSS 變量體系，包括顏色、間距、陰影等
- 通用 CSS 工具類
- 響應式佈局工具
- 組件樣式工具

### CSS 函數化優勢

1. **一致性**：確保整個應用程序的視覺一致性
2. **可維護性**：集中管理樣式，便於修改和維護
3. **可重用性**：減少重複的 CSS 代碼
4. **效率**：透過預定義的 CSS 類和變量，加速開發過程

## 4. defineModel 實現

我們在 `BaseInput.vue` 組件中實現了 Vue 3 的 `defineModel` 特性，用於替代傳統的 props/emit 模式：

```javascript
// 使用 defineModel 代替 v-model 的 props/emit 組合
const modelValue = defineModel<string | number>('modelValue');

// 更新值時直接賦值而非觸發事件
const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  modelValue.value = props.type === 'number' 
    ? parseFloat(target.value) 
    : target.value;
};
```

### defineModel 優勢

1. **簡化代碼**：減少 props/emit 的樣板代碼
2. **直觀**：使得雙向綁定的實現更加直觀
3. **類型安全**：支持泛型，提供完整的類型檢查

## 5. 路由重用

我們創建了 `useRoutes.ts` composable，實現了以下功能：

- 路由工廠函數，用於生成一致的路由路徑
- 依據用戶角色的路由過濾
- 路由匹配檢查
- 麵包屑導航生成

### 路由重用優勢

1. **一致性**：確保整個應用程序中的路由結構一致
2. **可維護性**：集中管理路由，便於修改和維護
3. **類型安全**：提供完整的類型檢查和代碼提示
4. **靈活性**：可以根據用戶角色動態生成路由

## 使用指南

### 基礎組件使用

```vue
<!-- 使用基礎卡片 -->
<BaseCard elevation="2" hover-effect>
  <template #header>卡片標題</template>
  <div>卡片內容</div>
  <template #footer>卡片頁腳</template>
</BaseCard>

<!-- 使用產品卡片 -->
<BaseProductCard 
  :product="product" 
  @view="handleView" 
  @like="handleLike"
/>

<!-- 使用基礎輸入框 -->
<BaseInput 
  v-model="username" 
  label="用戶名" 
  required 
  :error-message="errors.username"
/>
```

### API 組件使用

```vue
<template>
  <ApiDataTable
    :data="products.data"
    :columns="columns"
    :loading="products.loading"
    :error="products.error"
    @retry="products.execute"
    @row-click="handleProductClick"
    has-actions
  >
    <template #actions="{ item }">
      <Button icon="pi pi-pencil" @click="editProduct(item)" />
      <Button icon="pi pi-trash" @click="deleteProduct(item)" />
    </template>
  </ApiDataTable>
</template>

<script setup>
import { useApi } from '~/composables/useApi';
import type { Product } from '~/types/product';

// 定義表格列
const columns = [
  { field: 'name', header: '產品名稱', sortable: true },
  { field: 'price', header: '價格', sortable: true },
  { field: 'category', header: '分類' },
  { field: 'status', header: '狀態' }
];

// 獲取產品數據
const products = useApi<Product[]>('/api/products');

// 處理行點擊
const handleProductClick = (product: Product) => {
  navigateTo(`/products/${product.id}`);
};
</script>
```

### 路由使用

```typescript
import { useRoutes } from '~/composables/useRoutes';

// 在組件內部使用
const { routes, isActiveRoute, getBreadcrumbs } = useRoutes();

// 導航到產品詳情頁
const navigateToProduct = (productId: string) => {
  navigateTo(routes.product.detail({ id: productId }));
};

// 檢查當前路由是否匹配
const isProductsActive = computed(() => {
  return isActiveRoute(routes.main.find(r => r.path === '/products'), route);
});

// 獲取麵包屑
const breadcrumbs = computed(() => {
  return getBreadcrumbs(route);
});
```

## 注意事項與最佳實踐

1. **組件命名**：使用有意義的名稱，基礎組件以 "Base" 開頭
2. **類型定義**：盡可能提供完整的類型定義，善用泛型
3. **CSS 類名**：使用一致的命名規範，例如 BEM 命名法
4. **路徑引用**：優先使用 "~/" 引用路徑，確保路徑一致性
5. **組件文檔**：為組件添加適當的註釋和文檔，說明參數和用法

通過以上重構，我們改進了代碼的可維護性、可擴展性和可重用性，同時保持了良好的開發體驗和類型安全。 