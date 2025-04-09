<template>
  <div class="api-data-table">
    <div v-if="loading" class="loading-container">
      <slot name="loading">
        <div class="loading-spinner"></div>
        <p>正在載入資料...</p>
      </slot>
    </div>
    
    <div v-else-if="error" class="error-container">
      <slot name="error" :error="error">
        <div class="error-message">
          <i class="pi pi-exclamation-triangle"></i>
          <p>{{ error.message || '無法載入資料，請稍後再試' }}</p>
        </div>
        <Button label="重試" @click="handleRetry" />
      </slot>
    </div>
    
    <div v-else-if="!data || data.length === 0" class="empty-container">
      <slot name="empty">
        <div class="empty-message">
          <i class="pi pi-inbox"></i>
          <p>沒有可顯示的資料</p>
        </div>
      </slot>
    </div>
    
    <div v-else class="table-wrapper">
      <slot 
        :data="data" 
        :columns="columns" 
        :page="currentPage" 
        :total-pages="totalPages"
        :total-items="totalItems"
        :sort="sortState"
        :handleSort="handleSortChange"
      >
        <div v-if="hasHeader" class="table-header">
          <slot name="header"></slot>
        </div>
        
        <table class="data-table">
          <thead>
            <tr>
              <th 
                v-for="column in columns" 
                :key="column.field"
                :class="{ 
                  'sortable': column.sortable,
                  'sorted': sortState.field === column.field
                }"
                @click="column.sortable ? handleSortChange(column.field) : null"
              >
                {{ column.header }}
                <i 
                  v-if="column.sortable" 
                  :class="[
                    'sort-icon',
                    sortState.field === column.field ? (
                      sortState.order === 'asc' ? 'pi pi-sort-up' : 'pi pi-sort-down'
                    ) : 'pi pi-sort'
                  ]"
                ></i>
              </th>
              <th v-if="hasActions" class="actions-column">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(item, index) in paginatedData" 
              :key="getItemKey(item, index)"
              @click="handleRowClick(item)"
              :class="{ 'clickable': Boolean(rowClickable) }"
            >
              <td v-for="column in columns" :key="column.field">
                <slot 
                  :name="`cell:${column.field}`" 
                  :value="getItemValue(item, column.field)" 
                  :item="item" 
                  :column="column"
                >
                  {{ formatValue(getItemValue(item, column.field), column.format) }}
                </slot>
              </td>
              <td v-if="hasActions" class="actions-cell">
                <slot name="actions" :item="item" :index="index"></slot>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="pagination && totalPages > 1" class="table-pagination">
          <slot 
            name="pagination"
            :currentPage="currentPage"
            :totalPages="totalPages"
            :handlePageChange="handlePageChange"
          >
            <div class="pagination-controls">
              <Button 
                icon="pi pi-chevron-left" 
                class="p-button-text"
                :disabled="currentPage === 1"
                @click="handlePageChange(currentPage - 1)" 
              />
              
              <span class="pagination-info">
                {{ currentPage }} / {{ totalPages }}
              </span>
              
              <Button 
                icon="pi pi-chevron-right" 
                class="p-button-text"
                :disabled="currentPage === totalPages"
                @click="handlePageChange(currentPage + 1)" 
              />
            </div>
          </slot>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

interface Column<T = any> {
  field: string;
  header: string;
  sortable?: boolean;
  format?: (value: any, item: T) => string;
  width?: string;
}

type SortOrder = 'asc' | 'desc';

interface SortState {
  field: string;
  order: SortOrder;
}

interface Props<T = any> {
  data?: T[];
  loading?: boolean;
  error?: Error | null;
  columns: Column<T>[];
  rowKey?: string | ((item: T) => string);
  pagination?: boolean;
  pageSize?: number;
  totalItems?: number;
  initialPage?: number;
  initialSort?: SortState;
  rowClickable?: boolean;
  hasHeader?: boolean;
  hasActions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  loading: false,
  error: null,
  pagination: true,
  pageSize: 10,
  initialPage: 1,
  initialSort: () => ({ field: '', order: 'asc' }),
  rowClickable: false,
  hasHeader: false,
  hasActions: false
});

const emit = defineEmits<{
  (e: 'retry'): void;
  (e: 'page-change', page: number): void;
  (e: 'sort-change', sort: SortState): void;
  (e: 'row-click', item: any): void;
}>();

// 分頁狀態
const currentPage = ref(props.initialPage);

// 排序狀態
const sortState = ref<SortState>(props.initialSort);

// 處理資料排序
const sortedData = computed(() => {
  if (!sortState.value.field) {
    return props.data;
  }
  
  return [...props.data].sort((a, b) => {
    const aValue = getItemValue(a, sortState.value.field);
    const bValue = getItemValue(b, sortState.value.field);
    
    if (aValue === bValue) return 0;
    
    const compareResult = aValue > bValue ? 1 : -1;
    return sortState.value.order === 'asc' ? compareResult : -compareResult;
  });
});

// 計算分頁後的資料
const paginatedData = computed(() => {
  if (!props.pagination) {
    return sortedData.value;
  }
  
  const startIndex = (currentPage.value - 1) * props.pageSize;
  return sortedData.value.slice(startIndex, startIndex + props.pageSize);
});

// 計算總頁數
const totalPages = computed(() => {
  if (props.totalItems !== undefined) {
    return Math.ceil(props.totalItems / props.pageSize);
  }
  return Math.ceil(props.data.length / props.pageSize);
});

// 獲取總項目數
const totalItems = computed(() => {
  return props.totalItems !== undefined ? props.totalItems : props.data.length;
});

// 處理頁面變更
const handlePageChange = (page: number) => {
  if (page < 1 || page > totalPages.value) {
    return;
  }
  
  currentPage.value = page;
  emit('page-change', page);
};

// 處理排序變更
const handleSortChange = (field: string) => {
  if (sortState.value.field === field) {
    // 切換排序方向
    sortState.value.order = sortState.value.order === 'asc' ? 'desc' : 'asc';
  } else {
    // 設置新排序字段
    sortState.value = { field, order: 'asc' };
  }
  
  emit('sort-change', sortState.value);
};

// 處理重試
const handleRetry = () => {
  emit('retry');
};

// 處理行點擊
const handleRowClick = (item: any) => {
  if (props.rowClickable) {
    emit('row-click', item);
  }
};

// 根據字段獲取項目值 (支持嵌套路徑，如 "user.name")
const getItemValue = (item: any, field: string): any => {
  return field.split('.').reduce((obj, key) => {
    return obj && obj[key] !== undefined ? obj[key] : undefined;
  }, item);
};

// 獲取項目的唯一鍵
const getItemKey = (item: any, index: number): string => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(item);
  }
  
  if (props.rowKey && item[props.rowKey] !== undefined) {
    return String(item[props.rowKey]);
  }
  
  // 嘗試使用常見的鍵
  if (item.id !== undefined) return String(item.id);
  if (item._id !== undefined) return String(item._id);
  
  // 最後使用索引
  return String(index);
};

// 格式化值
const formatValue = (value: any, formatter?: (value: any, item: any) => string): string => {
  if (value === undefined || value === null) {
    return '';
  }
  
  if (formatter) {
    return formatter(value, value);
  }
  
  if (value instanceof Date) {
    return value.toLocaleDateString('zh-TW');
  }
  
  return String(value);
};

// 監視數據變化，重置為第一頁
watch(() => props.data, () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1;
  }
}, { deep: true });
</script>

<style scoped>
.api-data-table {
  @apply w-full;
}

.loading-container,
.error-container,
.empty-container {
  @apply flex flex-col items-center justify-center py-12 text-gray-500;
}

.loading-spinner {
  @apply w-12 h-12 border-4 border-gray-300 border-t-primary-500 rounded-full mb-4;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message,
.empty-message {
  @apply flex flex-col items-center mb-4;
}

.error-message i,
.empty-message i {
  @apply text-4xl mb-2;
}

.table-wrapper {
  @apply w-full overflow-x-auto;
}

.table-header {
  @apply mb-4;
}

.data-table {
  @apply w-full border-collapse;
}

.data-table th {
  @apply bg-gray-100 text-left py-3 px-4 font-medium text-gray-700;
}

.data-table th.sortable {
  @apply cursor-pointer select-none;
}

.data-table th.sorted {
  @apply bg-primary-50 text-primary-700;
}

.sort-icon {
  @apply ml-1 text-sm;
}

.data-table td {
  @apply py-3 px-4 border-b border-gray-200;
}

.data-table tr.clickable {
  @apply cursor-pointer hover:bg-gray-50;
}

.actions-column {
  @apply w-24 text-center;
}

.actions-cell {
  @apply text-center;
}

.table-pagination {
  @apply mt-4 flex justify-center;
}

.pagination-controls {
  @apply flex items-center;
}

.pagination-info {
  @apply mx-4 text-gray-700;
}
</style> 