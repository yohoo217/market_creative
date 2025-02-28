<template>
  <div class="container mx-auto px-4 py-10 flex justify-center">
    <div class="w-full max-w-md">
      <h1 class="text-2xl font-semibold text-center mb-6">{{ isLoginMode ? '登入' : '註冊' }}</h1>
      
      <!-- 錯誤信息顯示區域 -->
      <div v-if="formError" 
           class="bg-red-100 border-l-4 border-red-500 p-4 rounded-md mb-6 animate-fade-in">
        <div class="flex items-center">
          <i class="pi pi-exclamation-circle text-red-500 mr-2"></i>
          <div class="flex flex-col">
            <div class="font-medium text-red-700">{{ isLoginMode ? '登入失敗' : '註冊失敗' }}</div>
            <div class="text-red-600 text-sm mt-1">{{ formError }}</div>
          </div>
        </div>
      </div>

      <!-- 切換按鈕 -->
      <div class="flex rounded-lg bg-gray-100 p-1 mb-6">
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

      <!-- 登入表單 -->
      <form v-if="isLoginMode" @submit.prevent="handleSubmit" class="space-y-4">
        <div class="form-group">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">郵箱</label>
          <InputText 
            id="email" 
            v-model="form.email" 
            type="email" 
            class="w-full p-input-filled" 
            placeholder="請輸入您的郵箱"
            :class="{'p-invalid': emailError}"
            aria-required="true"
            @keydown="handleKeydown"
            @input="clearError"
          />
          <small v-if="emailError" class="p-error">{{ emailError }}</small>
        </div>
        
        <div class="form-group">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">密碼</label>
          <Password
            id="password"
            v-model="form.password"
            :feedback="false"
            toggleMask
            class="w-full"
            :class="{'p-invalid': passwordError}"
            :placeholder="isLoginMode ? '請輸入密碼' : '至少8位，包含大小寫字母和數字'"
            aria-required="true"
            @keydown="handleKeydown"
            @input="clearError"
          />
          <small v-if="passwordError" class="p-error">{{ passwordError }}</small>
        </div>
        
        <div class="mt-6">
          <Button 
            type="submit" 
            label="登入" 
            class="w-full" 
            :loading="isLoading"
            :disabled="isLoading"
          />
        </div>
      </form>

      <!-- 註冊表單 -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-4">
        <div class="form-group">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">用戶名</label>
          <InputText 
            id="name" 
            v-model="form.name" 
            class="w-full p-input-filled" 
            placeholder="請設定您的用戶名"
            :class="{'p-invalid': nameError}"
            aria-required="true"
            @keydown="handleKeydown"
            @input="clearError"
          />
          <small v-if="nameError" class="p-error">{{ nameError }}</small>
        </div>
        
        <div class="form-group">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">郵箱</label>
          <InputText 
            id="email" 
            v-model="form.email" 
            type="email" 
            class="w-full p-input-filled" 
            placeholder="請輸入您的郵箱"
            :class="{'p-invalid': emailError}"
            aria-required="true"
            @keydown="handleKeydown"
            @input="clearError"
          />
          <small v-if="emailError" class="p-error">{{ emailError }}</small>
        </div>
        
        <div class="form-group">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">密碼</label>
          <Password
            id="password"
            v-model="form.password"
            :feedback="true"
            toggleMask
            class="w-full"
            :class="{'p-invalid': passwordError}"
            placeholder="至少8位，包含大小寫字母和數字"
            aria-required="true"
            @keydown="handleKeydown"
            @input="clearError"
            :promptLabel="'請輸入密碼'"
            :weakLabel="'弱'"
            :mediumLabel="'中'"
            :strongLabel="'強'"
          />
          <small v-if="passwordError" class="p-error">{{ passwordError }}</small>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">確認密碼</label>
          <Password
            id="confirmPassword"
            v-model="form.confirmPassword"
            :feedback="false"
            toggleMask
            class="w-full"
            :class="{'p-invalid': confirmPasswordError}"
            placeholder="請再次輸入密碼"
            aria-required="true"
            @keydown="handleKeydown"
            @input="clearError"
          />
          <small v-if="confirmPasswordError" class="p-error">{{ confirmPasswordError }}</small>
        </div>
        
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">頭像（選填）</label>
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
              <div class="w-20 h-20 border rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                <img v-if="form.avatarPreview" :src="form.avatarPreview" class="w-full h-full object-cover" alt="頭像預覽" />
                <span v-else class="text-3xl text-gray-400">
                  <i class="pi pi-user"></i>
                </span>
              </div>
            </div>
            <div class="flex-grow">
              <FileUpload 
                mode="basic" 
                accept="image/*" 
                :maxFileSize="1000000"
                chooseLabel="選擇圖片"
                class="p-button-outlined"
                @select="onFileSelect" 
                @error="onFileError"
                :auto="true"
                customUpload
                @uploader="onFileUpload"
              />
              <div class="text-xs text-gray-500 mt-1">
                支持 JPG、PNG 格式，最大 1MB
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-6">
          <Button 
            type="submit" 
            label="註冊" 
            class="w-full" 
            :loading="isLoading"
            :disabled="isLoading"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { useUserStore } from '~/stores/user';

const router = useRouter();
const toast = useToast();
const userStore = useUserStore();

// 表單數據
const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  avatar: null as File | null,
  avatarPreview: ''
});

// 表單狀態
const isLoginMode = ref(true);
const isLoading = ref(false);
const formError = ref('');

// 表單驗證錯誤
const nameError = ref('');
const emailError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');

// 驗證表單
const validateForm = () => {
  let isValid = true;
  nameError.value = '';
  emailError.value = '';
  passwordError.value = '';
  confirmPasswordError.value = '';

  // 郵箱驗證
  if (!form.value.email.trim()) {
    emailError.value = '請輸入郵箱';
    isValid = false;
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.value.email)) {
    emailError.value = '請輸入有效的郵箱地址';
    isValid = false;
  }

  // 密碼驗證
  if (!form.value.password.trim()) {
    passwordError.value = '請輸入密碼';
    isValid = false;
  } else if (!isLoginMode.value && form.value.password.length < 8) {
    passwordError.value = '密碼長度至少為8位';
    isValid = false;
  }

  // 註冊模式下的額外驗證
  if (!isLoginMode.value) {
    // 用戶名驗證
    if (!form.value.name.trim()) {
      nameError.value = '請輸入用戶名';
      isValid = false;
    } else if (form.value.name.length < 2 || form.value.name.length > 20) {
      nameError.value = '用戶名長度應為2-20個字符';
      isValid = false;
    }

    // 確認密碼驗證
    if (!form.value.confirmPassword.trim()) {
      confirmPasswordError.value = '請確認密碼';
      isValid = false;
    } else if (form.value.password !== form.value.confirmPassword) {
      confirmPasswordError.value = '兩次輸入的密碼不一致';
      isValid = false;
    }
  }

  return isValid;
};

// 處理錯誤
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
};

// 提交表單
const handleSubmit = async () => {
  if (isLoading.value) return;  // 防止重複提交
  if (!validateForm()) return;

  try {
    isLoading.value = true;
    formError.value = '';

    if (isLoginMode.value) {
      await userStore.login(form.value.email, form.value.password);
      toast.add({ 
        severity: 'success', 
        summary: '登入成功', 
        detail: '歡迎回來！', 
        life: 3000,
        group: 'auth'
      });
      router.push('/');
    } else {
      // 創建 FormData 對象來處理文件上傳
      const formData = new FormData();
      formData.append('email', form.value.email);
      formData.append('password', form.value.password);
      formData.append('name', form.value.name);
      if (form.value.avatar) {
        formData.append('avatar', form.value.avatar);
      }
      
      await userStore.register(formData);
      toast.add({ 
        severity: 'success', 
        summary: '註冊成功', 
        detail: '歡迎加入創意市集！', 
        life: 3000,
        group: 'auth'
      });
      router.push('/');
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
  nameError.value = '';
  emailError.value = '';
  passwordError.value = '';
  confirmPasswordError.value = '';
};

// 重置表單
const resetForm = () => {
  Object.assign(form.value, {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: null,
    avatarPreview: ''
  });
  clearError();
  isLoading.value = false;
};

// 切換模式
const switchMode = (mode: boolean) => {
  isLoginMode.value = mode;
  resetForm();
  focusFirstInput();
};

// 自動聚焦
const focusFirstInput = () => {
  nextTick(() => {
    const firstField = isLoginMode.value ? 'email' : 'name';
    document.getElementById(firstField)?.focus();
  });
};

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
};

// 處理文件選擇
const onFileSelect = (event) => {
  const file = event.files[0];
  if (file) {
    form.value.avatar = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.avatarPreview = e.target.result as string;
    };
    reader.readAsDataURL(file);
  }
};

// 處理文件上傳錯誤
const onFileError = (event) => {
  if (event.type === 'max-file-size') {
    toast.add({
      severity: 'error',
      summary: '文件過大',
      detail: '頭像圖片大小不能超過1MB',
      life: 3000,
      group: 'auth'
    });
  }
};

// 自定義上傳處理
const onFileUpload = (event) => {
  // 這裡我們只處理文件選擇，不進行實際上傳
  // 文件將在表單提交時一起上傳
  // 什麼也不做
};

// 檢查是否已登入，如果已登入重定向到首頁
onMounted(async () => {
  if (userStore.currentUser) {
    console.log('用戶已登入，重定向到首頁');
    router.push('/');
  } else {
    // 嘗試加載當前用戶，如果已登入則重定向
    try {
      await userStore.fetchCurrentUser();
      if (userStore.currentUser) {
        console.log('檢測到已登入用戶，重定向到首頁');
        router.push('/');
      }
    } catch (error) {
      console.log('未檢測到登入用戶，顯示登入頁面');
    }
  }
  
  // 設置第一個輸入框焦點
  focusFirstInput();
});

// 監聽模式變化
watch(isLoginMode, () => {
  resetForm();
  focusFirstInput();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
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

:deep(.p-password-input) {
  width: 100%;
}

:deep(.p-fileupload-buttonbar) {
  padding: 0;
}
</style> 