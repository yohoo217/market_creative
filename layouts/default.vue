<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white shadow-sm">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <NuxtLink to="/" class="text-2xl font-bold text-primary-600">創意市集</NuxtLink>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/products" class="text-gray-600 hover:text-primary-600">創意庫</NuxtLink>
            <NuxtLink to="/crowdfunding" class="text-gray-600 hover:text-primary-600">募資專案</NuxtLink>
            
            <!-- 登入前顯示登入按鈕 -->
            <Button v-if="!isLoggedIn" 
                    label="登入/註冊" 
                    class="p-button-outlined" 
                    @click="openLoginDialog" />
            
            <!-- 登入後顯示用戶選項 -->
            <div v-else class="flex items-center space-x-2">
              <!-- 角色特定選單 -->
              <div class="flex space-x-4 pr-4 border-r border-gray-200">
                <!-- 消息中心入口 -->
                <NuxtLink 
                  to="/messages" 
                  class="text-gray-600 hover:text-primary-600 flex items-center"
                >
                  <i class="pi pi-envelope mr-1"></i>
                  消息中心
                </NuxtLink>
                
                <!-- 創意者選單 -->
                <NuxtLink 
                  v-if="hasRole(UserRole.IDEATOR)" 
                  to="/products/my-ideas" 
                  class="text-green-600 hover:text-green-800"
                >
                  我的創意
                </NuxtLink>
                
                <!-- 工程師選單 -->
                <NuxtLink 
                  v-if="hasRole(UserRole.ENGINEER)" 
                  to="/proposals/my-proposals" 
                  class="text-blue-600 hover:text-blue-800"
                >
                  我的提案
                </NuxtLink>
                
                <!-- 廠商選單 -->
                <NuxtLink 
                  v-if="hasRole(UserRole.VENDOR)" 
                  to="/matchmaking" 
                  class="text-purple-600 hover:text-purple-800"
                >
                  媒合中心
                </NuxtLink>
              </div>
              
              <!-- 用戶資訊與選單 -->
              <Dropdown v-model="selectedRole" 
                        :options="availableRoles" 
                        optionLabel="label" 
                        optionValue="value"
                        placeholder="切換角色"
                        class="w-32"
                        @change="handleRoleChange" />
              
              <div class="relative user-menu-container flex items-center">
                <div class="flex items-center cursor-pointer" @click="toggleUserMenu">
                  <Avatar :image="currentUser?.avatar || '/images/default-avatar.png'"
                          :label="currentUser?.name || '創'"
                          class="cursor-pointer"
                          shape="circle"
                          size="normal" />
                  
                  <!-- 用戶姓名顯示 -->
                  <span class="ml-2 hidden md:inline-block text-gray-700">
                    {{ currentUser?.name || '創意用戶' }}
                  </span>
                  
                  <!-- 下拉箭頭 -->
                  <i class="pi pi-chevron-down ml-1 text-gray-500 text-xs"></i>
                </div>
                        
                <!-- 用戶下拉選單 -->
                <div v-if="showUserMenu" 
                     class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                     style="top: 100%;">
                  <div class="px-4 py-2 border-b border-gray-100">
                    <div class="font-medium text-ellipsis overflow-hidden">{{ currentUser?.name || '創意用戶' }}</div>
                    <div class="text-sm text-gray-500">
                      當前角色: {{ roleLabels[currentUser?.activeRole || 'visitor'] }}
                    </div>
                  </div>
                  <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    個人資料
                  </NuxtLink>
                  <button @click="handleLogout" 
                          class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    登出
                  </button>
                </div>
              </div>
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
          <div v-if="!isLoginMode" class="flex flex-col space-y-4">
            <!-- 頭像上傳 -->
            <div class="flex flex-col">
              <label class="mb-1 text-gray-700 text-sm font-medium">頭像</label>
              <div class="flex items-center space-x-4">
                <div class="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                  <img v-if="form.avatarPreview" 
                       :src="form.avatarPreview" 
                       class="w-full h-full object-cover" 
                       alt="頭像預覽" />
                  <div v-else 
                       class="w-full h-full flex items-center justify-center text-gray-400">
                    <i class="pi pi-user text-3xl"></i>
                  </div>
                </div>
                <div class="flex-1">
                  <FileUpload mode="basic" 
                              :auto="true"
                              accept="image/*"
                              :maxFileSize="5000000"
                              @select="onAvatarSelect"
                              @error="onAvatarError"
                              chooseLabel="選擇圖片"
                              class="avatar-upload" />
                  <p class="text-xs text-gray-500 mt-1">支持 jpg、png 格式，檔案大小不超過 5MB</p>
                </div>
              </div>
            </div>

            <div class="flex flex-col">
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
            <label for="password" class="mb-1 text-gray-700 text-sm font-medium">密碼</label>
            <InputText id="password" 
                     v-model="form.password" 
                     type="password"
                     class="w-full" 
                     :class="{ 'p-invalid': formError && !form.password }"
                     @focus="clearError" />
            <div class="flex justify-between items-center mt-1">
              <small v-if="formError && !form.password" class="text-red-500">{{ formError }}</small>
              <NuxtLink 
                v-if="isLoginMode"
                to="/forgot-password" 
                class="text-sm text-primary-600 hover:text-primary-700"
                @click="closeDialog"
              >
                忘記密碼？
              </NuxtLink>
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

          <!-- 確認密碼 -->
          <div v-if="!isLoginMode" class="flex flex-col">
            <label for="confirmPassword" class="mb-1 text-gray-700 text-sm font-medium">確認密碼</label>
            <InputText id="confirmPassword" 
                     v-model="form.confirmPassword" 
                     type="password"
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
import { ref, reactive, computed, watch, nextTick, onUnmounted, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'
import { UserRole } from '~/server/models/User'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const { isLoggedIn, currentUser } = storeToRefs(userStore)
const showLoginDialog = ref(false)
const isLoading = ref(false)
const isLoginMode = ref(true)
const formError = ref('')
const toast = useToast()
const config = useRuntimeConfig()
const router = useRouter()

const form = reactive<any>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  showPassword: false,
  showConfirmPassword: false,
  avatar: null as File | null,
  avatarPreview: ''
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

interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    twoFactorEnabled: boolean;
  };
  message?: string;
  requireTwoFactor?: boolean;
}

interface RegisterResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
  message?: string;
}

const handleSubmit = async () => {
  if (isLoading.value) return;  // 防止重複提交
  if (!validateForm()) return;

  try {
    isLoading.value = true;
    formError.value = '';
    console.log('開始登入/註冊流程:', { 
      mode: isLoginMode.value ? '登入' : '註冊',
      email: form.email 
    });

    if (isLoginMode.value) {
      console.log('嘗試登入...');
      const response = await $fetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: {
          email: form.email,
          password: form.password
        }
      });

      console.log('登入響應:', response);

      if (response.success) {
        if (response.requireTwoFactor) {
          console.log('需要 2FA 驗證');
          showLoginDialog.value = false;
          router.push({
            path: '/2fa',
            query: { email: form.email }
          });
        } else if (response.user) {
          console.log('登入成功，用戶信息:', response.user);
          await userStore.setUser(response.user);
          showLoginDialog.value = false;
          toast.add({ 
            severity: 'success', 
            summary: '登入成功', 
            detail: '歡迎回來！', 
            life: 3000,
            group: 'auth'
          });
        }
      } else {
        throw new Error(response.message || '登入失敗');
      }
    } else {
      // 創建 FormData 對象來處理文件上傳
      const formData = new FormData();
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('name', form.name);
      if (form.avatar) {
        formData.append('avatar', form.avatar);
      }
      
      await userStore.register(formData);
      showLoginDialog.value = false;
      toast.add({ 
        severity: 'success', 
        summary: '註冊成功', 
        detail: '歡迎加入創意市集！', 
        life: 3000,
        group: 'auth'
      });
    }
  } catch (error: unknown) {
    console.error('操作失敗:', error);
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
    showConfirmPassword: false,
    avatar: null,
    avatarPreview: ''
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
    // 使用useAuth composable進行登出
    const auth = useAuth();
    await auth.logout();
    
    toast.add({ 
      severity: 'success', 
      summary: '登出成功', 
      detail: '期待您的再次光臨！', 
      life: 3000,
      group: 'auth'
    });
    
    // 移除跳轉到登入頁面的行為，保持在當前頁面
    showUserMenu.value = false;
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

// 用戶選單狀態
const showUserMenu = ref(false)
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// 點擊其他地方關閉用戶選單
const handleOutsideClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (showUserMenu.value && !target.closest('.user-menu-container')) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

// 組件卸載時清理
onUnmounted(() => {
  resetForm();
  document.removeEventListener('click', handleOutsideClick);
});

// 監聽模式變化
watch(isLoginMode, () => {
  resetForm();
  focusFirstInput();
});

// 角色標籤
const roleLabels = {
  visitor: '訪客',
  ideator: '創意者',
  engineer: '工程師',
  vendor: '廠商',
  admin: '管理員'
}

// 可用角色下拉選單
const availableRoles = computed(() => {
  if (!currentUser.value?.roles) return []
  
  return currentUser.value.roles
    .filter(role => role.isActive)
    .map(role => ({
      label: roleLabels[role.type],
      value: role.type
    }))
})

// 當前選擇的角色
const selectedRole = computed({
  get: () => currentUser.value?.activeRole,
  set: (value) => {} // 實際變更由 handleRoleChange 處理
})

// 處理角色變更
const handleRoleChange = async (event: { value: keyof typeof roleLabels }) => {
  try {
    const newRole = event.value as UserRole;
    await userStore.switchRole(newRole);
    toast.add({
      severity: 'success',
      summary: '角色已切換',
      detail: `您已切換為${roleLabels[newRole]}`,
      life: 3000
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '無法切換角色';
    toast.add({
      severity: 'error',
      summary: '角色切換失敗',
      detail: errorMessage,
      life: 3000
    });
  }
};

// 角色檢查函數
const hasRole = (role: UserRole) => {
  return userStore.hasRole(role);
};

// 處理頭像選擇
const onAvatarSelect = (event: any) => {
  const file = event.files[0];
  if (file) {
    // 檢查文件類型
    if (!file.type.startsWith('image/')) {
      toast.add({
        severity: 'error',
        summary: '上傳失敗',
        detail: '請選擇圖片文件',
        life: 3000,
        group: 'auth'
      });
      return;
    }
    
    // 檢查文件大小（5MB）
    if (file.size > 5000000) {
      toast.add({
        severity: 'error',
        summary: '上傳失敗',
        detail: '圖片大小不能超過 5MB',
        life: 3000,
        group: 'auth'
      });
      return;
    }

    // 創建預覽
    const reader = new FileReader();
    reader.onload = (e) => {
      form.avatarPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    form.avatar = file;
  }
}

// 處理頭像上傳錯誤
const onAvatarError = (error: any) => {
  let errorMessage = '上傳失敗';
  if (error.type === 'max-file-size') {
    errorMessage = '圖片大小不能超過 5MB';
  }
  toast.add({
    severity: 'error',
    summary: '上傳失敗',
    detail: errorMessage,
    life: 3000,
    group: 'auth'
  });
}
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

/* 頭像上傳樣式 */
.avatar-upload :deep(.p-fileupload-choose) {
  @apply bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors;
  @apply px-4 py-2 rounded-md text-sm font-medium;
  @apply flex items-center justify-center;
}

.avatar-upload :deep(.p-fileupload-choose:not(.p-disabled):hover) {
  @apply bg-gray-50 border-gray-400;
}

.avatar-upload :deep(.p-fileupload-choose .p-button-icon) {
  @apply mr-2 text-gray-500;
}

.avatar-upload :deep(.p-fileupload-choose .p-button-label) {
  @apply font-medium;
}

.avatar-upload :deep(.p-fileupload-choose:focus) {
  @apply ring-2 ring-primary-200 border-primary-500;
}

.user-menu-container {
  position: relative;
  display: inline-block;
}

.user-menu-container .p-avatar {
  transition: transform 0.2s;
}

.user-menu-container .flex:hover .p-avatar {
  transform: scale(1.05);
}

.user-menu-container .absolute {
  animation: fadeIn 0.2s ease-out;
}

.user-menu-container .flex {
  transition: all 0.2s;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}

.user-menu-container .flex:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>