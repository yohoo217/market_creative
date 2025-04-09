<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        忘記密碼
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        請輸入您的電子郵件地址，我們將發送重置密碼的連結給您
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              電子郵件地址
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {{ loading ? '處理中...' : '發送重置連結' }}
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                或者
              </span>
            </div>
          </div>

          <div class="mt-6">
            <div class="text-center">
              <NuxtLink
                to="/login"
                class="font-medium text-indigo-600 hover:text-indigo-500"
              >
                返回登入
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const loading = ref(false)
const { $toast } = useNuxtApp()

async function handleSubmit() {
  try {
    loading.value = true
    const response = await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value }
    })
    
    $toast.success('重置密碼郵件已發送，請檢查您的收件匣')
    email.value = ''
  } catch (error: any) {
    $toast.error(error.message || '發送重置郵件時發生錯誤')
  } finally {
    loading.value = false
  }
}
</script> 