<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        重置密碼
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        請輸入您的新密碼
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              新密碼
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                required
                minlength="8"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              確認密碼
            </label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minlength="8"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading || !isValid"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {{ loading ? '處理中...' : '重置密碼' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { $toast } = useNuxtApp()

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const token = computed(() => route.query.token as string)

const isValid = computed(() => {
  return password.value.length >= 8 && 
         password.value === confirmPassword.value &&
         !!token.value
})

async function handleSubmit() {
  if (!isValid.value) {
    $toast.error('請確認密碼輸入正確且兩次輸入相同')
    return
  }

  try {
    loading.value = true
    const response = await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: {
        token: token.value,
        newPassword: password.value
      }
    })
    
    $toast.success('密碼重置成功')
    await router.push('/login')
  } catch (error: any) {
    $toast.error(error.message || '重置密碼時發生錯誤')
  } finally {
    loading.value = false
  }
}

// 如果沒有 token，重定向到忘記密碼頁面
onMounted(() => {
  if (!token.value) {
    router.push('/forgot-password')
  }
})
</script> 