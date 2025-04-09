<!-- 2FA 設置頁面 -->
<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">二階段驗證設置</h1>

    <!-- 未啟用 2FA 時的設置介面 -->
    <div v-if="!user?.twoFactorEnabled" class="space-y-6">
      <div v-if="!setupMode" class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">增強您的帳戶安全性</h2>
        <p class="mb-4">啟用二階段驗證後，每次登入時都需要輸入驗證碼，為您的帳戶提供額外的安全保護。</p>
        <button @click="startSetup" class="btn-primary">
          設置二階段驗證
        </button>
      </div>

      <div v-else class="bg-white p-6 rounded-lg shadow space-y-6">
        <h2 class="text-xl font-semibold">設置二階段驗證</h2>
        
        <div v-if="qrCode" class="space-y-4">
          <p class="mb-2">1. 使用 Google Authenticator 或其他驗證器應用程式掃描以下 QR 碼：</p>
          <img :src="qrCode" alt="QR Code" class="mx-auto" />
          
          <div class="mt-4">
            <p class="mb-2">2. 輸入驗證器應用程式顯示的 6 位數驗證碼：</p>
            <div class="flex space-x-4">
              <input
                v-model="verificationCode"
                type="text"
                class="form-input"
                placeholder="輸入驗證碼"
                maxlength="6"
              />
              <button @click="verifyAndEnable" class="btn-primary" :disabled="!verificationCode">
                驗證並啟用
              </button>
            </div>
          </div>
        </div>

        <div v-if="backupCodes.length" class="space-y-4">
          <h3 class="font-semibold">備用恢復碼</h3>
          <p class="text-sm text-gray-600">
            請將這些恢復碼保存在安全的地方。如果您無法使用驗證器應用程式，可以使用這些代碼登入。
            每個代碼只能使用一次。
          </p>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="code in backupCodes"
              :key="code"
              class="p-2 bg-gray-100 rounded text-mono"
            >
              {{ code }}
            </div>
          </div>
          <button @click="downloadBackupCodes" class="btn-secondary">
            下載恢復碼
          </button>
        </div>
      </div>
    </div>

    <!-- 已啟用 2FA 時的管理介面 -->
    <div v-else class="bg-white p-6 rounded-lg shadow space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold">二階段驗證已啟用</h2>
          <p class="text-sm text-gray-600">您的帳戶目前受到二階段驗證的保護。</p>
        </div>
        <button @click="showDisableConfirm = true" class="btn-danger">
          禁用二階段驗證
        </button>
      </div>
    </div>

    <!-- 禁用 2FA 的確認對話框 -->
    <div v-if="showDisableConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4">禁用二階段驗證</h3>
        <p class="mb-4">請輸入驗證器應用程式顯示的驗證碼以確認禁用二階段驗證：</p>
        <input
          v-model="disableCode"
          type="text"
          class="form-input mb-4 w-full"
          placeholder="輸入驗證碼"
          maxlength="6"
        />
        <div class="flex justify-end space-x-4">
          <button @click="showDisableConfirm = false" class="btn-secondary">
            取消
          </button>
          <button @click="disable2FA" class="btn-danger" :disabled="!disableCode">
            確認禁用
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const user = useUser()
const { $toast } = useNuxtApp()

const setupMode = ref(false)
const qrCode = ref('')
const verificationCode = ref('')
const backupCodes = ref<string[]>([])
const showDisableConfirm = ref(false)
const disableCode = ref('')

// 開始設置 2FA
async function startSetup() {
  try {
    const response = await $fetch<{ success: boolean; qrCode: string }>('/api/auth/2fa/setup', {
      method: 'POST'
    })
    qrCode.value = response.qrCode
    setupMode.value = true
  } catch (error: any) {
    $toast.error(error.message || '設置失敗')
  }
}

// 驗證並啟用 2FA
async function verifyAndEnable() {
  try {
    const response = await $fetch<{ success: boolean; backupCodes: string[] }>('/api/auth/2fa/verify', {
      method: 'POST',
      body: {
        token: verificationCode.value
      }
    })
    backupCodes.value = response.backupCodes
    if (user.value) {
      user.value.twoFactorEnabled = true
    }
    $toast.success('二階段驗證已成功啟用')
  } catch (error: any) {
    $toast.error(error.message || '驗證失敗')
  }
}

// 下載備用恢復碼
function downloadBackupCodes() {
  const content = `創意市集 - 二階段驗證備用恢復碼\n\n${backupCodes.value.join('\n')}`
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '創意市集-2FA-備用恢復碼.txt'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 禁用 2FA
async function disable2FA() {
  try {
    await $fetch<{ success: boolean; message: string }>('/api/auth/2fa/disable', {
      method: 'POST',
      body: {
        token: disableCode.value
      }
    })
    if (user.value) {
      user.value.twoFactorEnabled = false
    }
    showDisableConfirm.value = false
    setupMode.value = false
    $toast.success('二階段驗證已成功禁用')
  } catch (error: any) {
    $toast.error(error.message || '禁用失敗')
  }
}
</script>

<style scoped>
.btn-primary {
  @apply bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 disabled:opacity-50;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50;
}

.btn-danger {
  @apply bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50;
}

.form-input {
  @apply border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500;
}
</style> 