<script setup lang="ts">
import { ref, watchEffect, onMounted } from 'vue'
import type { IUser } from '~/server/models/User'
import { UserRole } from '~/server/models/User'
import type { UsersResponse, UserWithId } from '~/types/api'

const users = ref<UserWithId[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const roleFilter = ref<UserRole | ''>('')

const columns = [
  { key: 'name', label: '姓名' },
  { key: 'email', label: '郵箱' },
  { key: 'roles', label: '角色' },
  { key: 'activeRole', label: '當前角色' },
  { key: 'createdAt', label: '註冊時間' },
  { key: 'lastLoginAt', label: '最後登入' },
  { key: 'actions', label: '操作' }
]

// 獲取用戶列表
const fetchUsers = async () => {
  loading.value = true
  error.value = null
  try {
    const queryParams = new URLSearchParams()
    if (searchQuery.value) queryParams.append('search', searchQuery.value)
    if (roleFilter.value) queryParams.append('role', roleFilter.value)

    const response = await $fetch<UsersResponse>(`/api/users?${queryParams.toString()}`)
    
    if (response.success && response.data) {
      users.value = response.data
    } else {
      throw new Error(response.message || '獲取用戶列表失敗')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '獲取用戶列表失敗'
  } finally {
    loading.value = false
  }
}

// 格式化角色顯示
const formatRoles = (roles: UserWithId['roles']) => {
  if (!roles?.length) return '-'
  return roles.map(role => role.type).join(', ')
}

// 格式化時間顯示
const formatDate = (date: string | Date | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleString()
}

// 監聽搜索和篩選變化
let timer: ReturnType<typeof setTimeout>
watchEffect(() => {
  const search = searchQuery.value
  const role = roleFilter.value

  // 清除之前的計時器
  if (timer) clearTimeout(timer)

  // 設置新的計時器
  timer = setTimeout(() => {
    fetchUsers()
  }, 300)
})

// 初始加載
onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold mb-4">用戶管理</h1>
      
      <!-- 搜索和篩選 -->
      <div class="flex gap-4 mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索用戶..."
          class="px-4 py-2 border rounded-lg"
        />
        <select
          v-model="roleFilter"
          class="px-4 py-2 border rounded-lg"
        >
          <option value="">所有角色</option>
          <option
            v-for="role in Object.values(UserRole)"
            :key="role"
            :value="role"
          >
            {{ role }}
          </option>
        </select>
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

      <!-- 用戶列表 -->
      <div
        v-else
        class="bg-white rounded-lg shadow overflow-hidden"
      >
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                v-for="col in columns"
                :key="col.key"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {{ col.label }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="user in users"
              :key="user._id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img
                    :src="user.avatar"
                    class="h-10 w-10 rounded-full"
                    alt=""
                  />
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.name }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ formatRoles(user.roles) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {{ user.activeRole }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.lastLoginAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <NuxtLink
                  :to="`/admin/users/${user._id}`"
                  class="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  詳情
                </NuxtLink>
                <button
                  class="text-red-600 hover:text-red-900"
                  @click="() => {}"
                >
                  停用
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 無數據提示 -->
        <div
          v-if="users.length === 0"
          class="text-center py-8 text-gray-500"
        >
          暫無用戶數據
        </div>
      </div>
    </div>
  </div>
</template> 