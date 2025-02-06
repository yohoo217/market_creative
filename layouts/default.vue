<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white shadow-sm">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <NuxtLink to="/" class="text-2xl font-bold text-primary-600">創意市集</NuxtLink>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/products" class="text-gray-600 hover:text-primary-600">商品</NuxtLink>
            <NuxtLink to="/crowdfunding" class="text-gray-600 hover:text-primary-600">募資</NuxtLink>
            <Button v-if="!isLoggedIn" 
                    label="登入/註冊" 
                    class="p-button-outlined" 
                    @click="openLoginDialog" />
            <div v-else class="flex items-center space-x-2">
              <Avatar :image="currentUser?.avatar || '/default-avatar.png'"
                      :label="currentUser?.name?.charAt(0)"
                      shape="circle"
                      size="normal" />
              <span class="text-gray-600">{{ currentUser?.name }}</span>
              <Button label="登出" 
                      class="p-button-outlined p-button-danger" 
                      @click="handleLogout" />
            </div>
          </div>
        </div>
      </nav>
    </header>

    <main class="flex-grow">
      <slot />
    </main>

    <footer class="bg-gray-100">
      <div class="container mx-auto px-4 py-8">
        <div class="text-center text-gray-600">
          <p>&copy; 2024 創意市集. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <!-- 登入/註冊對話框 -->
    <Dialog v-model:visible="showLoginDialog" 
            modal 
            :header="isLoginMode ? '登入' : '註冊'" 
            :style="{ width: '450px' }"
            :closable="true"
            class="auth-dialog"
            @show="handleDialogShow"
            :closeOnEscape="true">
      <div class="flex flex-col space-y-6">
        <!-- 錯誤信息顯示區域 -->
        <div v-if="formError" 
             class="bg-red-100 border-l-4 border-red-500 p-4 rounded-md animate-fade-in">
          <div class="flex items-center">
            <i class="pi pi-exclamation-circle text-red-500 mr-2"></i>
            <div class="flex flex-col">
              <div class="font-medium text-red-700">{{ isLoginMode ? '登入失敗' : '註冊失敗' }}</div>
              <div class="text-red-600 text-sm mt-1">{{ formError }}</div>
            </div>
          </div>
        </div>

        <!-- 切換按鈕 -->
        <div class="flex rounded-lg bg-gray-100 p-1">
          <button 
            class="flex-1 py-2 text-sm font-medium rounded-md transition-all"
            :class="isLoginMode ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'"
            @click="switchMode(true)"
            type="button"
          >
            登入
          </button>
          <button 
            class="flex-1 py-2 text-sm font-medium rounded-md transition-all"
            :class="!isLoginMode ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'"
            @click="switchMode(false)"
            type="button"
          >
            註冊
          </button>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit" @keydown="handleKeydown">
          <!-- 註冊時的名稱欄位 -->
          <div v-if="!isLoginMode" class="flex flex-col">
            <label for="name" class="mb-1 text-gray-700 text-sm font-medium">
              用戶名
              <span class="text-gray-400 text-xs ml-1">(2-20個字符，可包含中文、英文、數字和底線)</span>
            </label>
            <InputText id="name" 
                      v-model="form.name" 
                      type="text"
                      class="w-full"
                      :class="{ 'p-invalid': formError && !isLoginMode && !form.name }"
                      @focus="clearError"
                      maxlength="20" />
          </div>

          <!-- 電子郵件 -->
          <div class="flex flex-col">
            <label for="email" class="mb-1 text-gray-700 text-sm font-medium">電子郵件</label>
            <InputText id="email" 
                      v-model="form.email" 
                      type="email"
                      class="w-full"
                      :class="{ 'p-invalid': formError && !form.email }"
                      @focus="clearError" />
          </div>

          <!-- 密碼 -->
          <div class="flex flex-col">
            <div class="flex justify-between items-center mb-1">
              <label for="password" class="text-gray-700 text-sm font-medium">密碼</label>
              <button type="button" 
                      class="text-gray-500 hover:text-gray-700 text-sm flex items-center"
                      @click="form.showPassword = !form.showPassword">
                <i :class="[form.showPassword ? 'pi pi-eye-slash' : 'pi pi-eye']" class="text-sm"></i>
                <span class="ml-1">{{ form.showPassword ? '隱藏' : '顯示' }}</span>
              </button>
            </div>
            <div class="flex gap-4 items-start">
              <div class="flex-1 relative">
                <InputText id="password" 
                           v-model="form.password" 
                           :type="form.showPassword ? 'text' : 'password'"
                           class="w-full" 
                           :class="{ 'p-invalid': formError && !form.password }"
                           @focus="clearError" />
              </div>
              
              <!-- 密碼強度指示器 -->
              <div v-if="!isLoginMode && form.password" class="w-32 flex-shrink-0">
                <div class="text-xs text-gray-500 mb-1">密碼強度</div>
                <div class="h-1 rounded-full bg-gray-200 overflow-hidden">
                  <div class="h-full transition-all duration-300 rounded-full"
                       :class="{
                         'bg-red-500': passwordStrength === 'weak',
                         'bg-yellow-500': passwordStrength === 'medium',
                         'bg-green-500': passwordStrength === 'strong'
                       }"
                       :style="{ width: passwordStrengthPercent + '%' }">
                  </div>
                </div>
                <div class="text-xs mt-1" 
                     :class="{
                       'text-red-500': passwordStrength === 'weak',
                       'text-yellow-500': passwordStrength === 'medium',
                       'text-green-500': passwordStrength === 'strong'
                     }">
                  {{ passwordStrengthText }}
                </div>
              </div>
            </div>
            
            <!-- 密碼規則提示 -->
            <div v-if="!isLoginMode" class="mt-2 space-y-1">
              <div class="text-sm text-gray-600">密碼必須符合以下規則：</div>
              <div class="grid grid-cols-2 gap-2">
                <div v-for="(rule, key) in passwordRules" :key="key"
                     class="flex items-center text-sm"
                     :class="rule.valid ? 'text-green-600' : 'text-gray-500'">
                  <i class="pi" :class="rule.valid ? 'pi-check-circle text-green-500' : 'pi-circle-fill text-gray-300'"></i>
                  <span class="ml-2">{{ rule.message }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 確認密碼 -->
          <div v-if="!isLoginMode" class="flex flex-col">
            <div class="flex justify-between items-center mb-1">
              <label for="confirmPassword" class="text-gray-700 text-sm font-medium">確認密碼</label>
              <button type="button" 
                      class="text-gray-500 hover:text-gray-700 text-sm flex items-center"
                      @click="form.showConfirmPassword = !form.showConfirmPassword">
                <i :class="[form.showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye']" class="text-sm"></i>
                <span class="ml-1">{{ form.showConfirmPassword ? '隱藏' : '顯示' }}</span>
              </button>
            </div>
            <InputText id="confirmPassword" 
                       v-model="form.confirmPassword" 
                       :type="form.showConfirmPassword ? 'text' : 'password'"
                       class="w-full" 
                       :class="{ 'p-invalid': formError && !form.confirmPassword }"
                       @focus="clearError" />
          </div>
        </form>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button label="取消" 
                  class="p-button-text" 
                  @click="closeDialog"
                  :disabled="isLoading" />
          <Button :label="isLoginMode ? '登入' : '註冊'" 
                  @click="handleSubmit"
                  :loading="isLoading"
                  :disabled="!isFormValid || isLoading" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick, onUnmounted } from 'vue'
import { useUserStore } from '~/stores/user'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { isLoggedIn, currentUser } = storeToRefs(userStore)
const showLoginDialog = ref(false)
const isLoading = ref(false)
const isLoginMode = ref(true)
const formError = ref('')
const toast = useToast()

const form = reactive<any>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  showPassword: false,
  showConfirmPassword: false
})

// 密碼規則檢查
const passwordRules = computed(() => ({
  length: {
    valid: form.password.length >= 8,
    message: '至少8個字符'
  },
  uppercase: {
    valid: /[A-Z]/.test(form.password),
    message: '包含大寫字母'
  },
  lowercase: {
    valid: /[a-z]/.test(form.password),
    message: '包含小寫字母'
  },
  number: {
    valid: /[0-9]/.test(form.password),
    message: '包含數字'
  }
}))

// 密碼強度計算
const passwordStrength = computed(() => {
  const rules = Object.values(passwordRules.value)
  const validCount = rules.filter(rule => rule.valid).length
  
  if (validCount === 0) return 'weak'
  if (validCount <= 2) return 'weak'
  if (validCount === 3) return 'medium'
  return 'strong'
})

const passwordStrengthText = computed(() => {
  switch (passwordStrength.value) {
    case 'weak':
      return '弱'
    case 'medium':
      return '中'
    case 'strong':
      return '強'
    default:
      return ''
  }
})

const passwordStrengthPercent = computed(() => {
  switch (passwordStrength.value) {
    case 'weak':
      return 33
    case 'medium':
      return 66
    case 'strong':
      return 100
    default:
      return 0
  }
})

// 表單驗證
const validateForm = () => {
  formError.value = '';

  // 名稱長度限制
  if (!isLoginMode.value && form.name) {
    if (form.name.length < 2) {
      formError.value = '用戶名至少需要2個字符';
      return false;
    }
    if (form.name.length > 20) {
      formError.value = '用戶名不能超過20個字符';
      return false;
    }
    // 檢查用戶名是否包含特殊字符
    if (!/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(form.name)) {
      formError.value = '用戶名只能包含中文、英文、數字和底線';
      return false;
    }
  }

  // 郵箱格式驗證
  if (form.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      formError.value = '請輸入有效的電子郵件地址';
      return false;
    }
  } else {
    formError.value = '請輸入電子郵件';
    return false;
  }

  // 密碼驗證
  if (!form.password) {
    formError.value = '請輸入密碼';
    return false;
  }

  // 註冊時的額外驗證
  if (!isLoginMode.value) {
    if (!form.name) {
      formError.value = '請輸入用戶名';
      return false;
    }
    if (!Object.values(passwordRules.value).every(rule => rule.valid)) {
      formError.value = '密碼不符合要求';
      return false;
    }
    if (form.password !== form.confirmPassword) {
      formError.value = '兩次輸入的密碼不一致';
      return false;
    }
  }

  return true;
}

const isFormValid = computed(() => {
  if (isLoginMode.value) {
    return form.email && form.password;
  }
  return form.name && form.email && form.password && 
         form.confirmPassword && Object.values(passwordRules.value).every(rule => rule.valid) &&
         form.password === form.confirmPassword;
})

// 錯誤處理
const handleError = (error: unknown) => {
  console.error(isLoginMode.value ? '登入錯誤:' : '註冊錯誤:', error);
  
  let errorMessage = '';
  if (error instanceof Error) {
    const errorMsg = error.message.toLowerCase();
    
    const errorMap = {
      '郵箱已被註冊': '此郵箱已被註冊，請直接登入或使用其他郵箱',
      '用戶名已被使用': '此用戶名已被使用，請使用其他名稱',
      '郵箱或密碼錯誤': '郵箱或密碼錯誤，請重新輸入',
      '必要欄位': '請填寫所有必要欄位',
      '網絡錯誤': '網絡連接失敗，請檢查網絡後重試',
      '伺服器錯誤': '系統繁忙，請稍後再試'
    };

    // 尋找匹配的錯誤信息
    const matchedError = Object.entries(errorMap).find(([key]) => 
      errorMsg.includes(key.toLowerCase())
    );

    errorMessage = matchedError ? matchedError[1] : error.message;
  } else {
    errorMessage = '操作失敗，請稍後再試';
  }

  formError.value = errorMessage;
}

const handleSubmit = async () => {
  if (isLoading.value) return;  // 防止重複提交
  if (!validateForm()) return;

  try {
    isLoading.value = true;
    formError.value = '';

    if (isLoginMode.value) {
      await userStore.login(form.email, form.password);
      showLoginDialog.value = false;
      toast.add({ 
        severity: 'success', 
        summary: '登入成功', 
        detail: '歡迎回來！', 
        life: 3000,
        group: 'auth'
      });
    } else {
      await userStore.register(form.email, form.password, form.name);
      showLoginDialog.value = false;
      toast.add({ 
        severity: 'success', 
        summary: '註冊成功', 
        detail: '歡迎加入創意市集！', 
        life: 3000,
        group: 'auth'
      });
    }
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
};

// 清除錯誤
const clearError = () => {
  formError.value = '';
}

// 重置表單
const resetForm = () => {
  Object.assign(form, {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false
  });
  formError.value = '';
  isLoading.value = false;
}

// 關閉對話框
const closeDialog = () => {
  if (isLoading.value) return;
  showLoginDialog.value = false;
  resetForm();
  isLoginMode.value = true;
};

// 切換模式
const switchMode = (mode: boolean) => {
  isLoginMode.value = mode;
  resetForm();
  focusFirstInput();
}

// 自動聚焦
const focusFirstInput = () => {
  nextTick(() => {
    if (isLoginMode.value) {
      document.getElementById('email')?.focus();
    } else {
      document.getElementById('name')?.focus();
    }
  });
}

// 處理對話框顯示
const handleDialogShow = () => {
  resetForm();
  focusFirstInput();
}

// 處理鍵盤事件
const handleKeydown = (e: KeyboardEvent) => {
  // 如果按下 Enter 且不是在多行文本框中
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    // 如果當前元素是密碼輸入框，且在註冊模式下，跳轉到確認密碼框
    if (e.target instanceof HTMLInputElement && 
        e.target.id === 'password' && 
        !isLoginMode.value) {
      document.getElementById('confirmPassword')?.focus();
    } else {
      // 否則提交表單
      handleSubmit();
    }
  }
  // 如果按下 Escape，關閉對話框
  else if (e.key === 'Escape') {
    closeDialog();
  }
}

// 打開登入對話框
const openLoginDialog = () => {
  showLoginDialog.value = true;
  isLoginMode.value = true;
  nextTick(() => {
    focusFirstInput();
  });
}

// 登出
const handleLogout = async () => {
  try {
    await userStore.logout();
    toast.add({ 
      severity: 'success', 
      summary: '登出成功', 
      detail: '期待您的再次光臨！', 
      life: 3000,
      group: 'auth'
    });
  } catch (error) {
    console.error('登出失敗:', error);
    toast.add({ 
      severity: 'error', 
      summary: '登出失敗', 
      detail: '請稍後再試', 
      life: 3000,
      group: 'auth'
    });
  }
}

// 組件卸載時清理
onUnmounted(() => {
  resetForm();
});

// 監聽模式變化
watch(isLoginMode, () => {
  resetForm();
  focusFirstInput();
});
</script>

<style scoped>
.auth-dialog :deep(.p-dialog-header) {
  @apply px-6 py-5 border-b border-gray-200;
}

.auth-dialog :deep(.p-dialog-content) {
  @apply p-6;
}

.auth-dialog :deep(.p-dialog-footer) {
  @apply px-6 py-4 border-t border-gray-200;
}

.auth-dialog :deep(.p-password-input) {
  @apply w-full;
}

.auth-dialog :deep(.p-password) {
  @apply w-full;
}

.auth-dialog :deep(.pi) {
  @apply text-sm;
}

/* 密碼強度指示器樣式 */
.auth-dialog :deep(.p-password-meter) {
  display: none;
}

.auth-dialog :deep(.p-password-meter .p-password-strength) {
  display: none;
}

.auth-dialog {
  max-width: 90vw;
}

/* 錯誤提示動畫 */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* 更新錯誤提示樣式 */
.auth-dialog :deep(.p-password-input.p-invalid),
.auth-dialog :deep(.p-inputtext.p-invalid) {
  @apply border-red-500 bg-red-50;
}

.auth-dialog :deep(.p-password-input:focus.p-invalid),
.auth-dialog :deep(.p-inputtext:focus.p-invalid) {
  @apply ring-red-200;
}

/* 輸入框聚焦效果 */
.auth-dialog :deep(.p-inputtext:focus) {
  @apply ring-2 ring-primary-200 border-primary-500;
}

/* 按鈕懸停效果 */
.auth-dialog :deep(.p-button:not(:disabled):hover) {
  @apply opacity-90;
}
</style>