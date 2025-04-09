import { defineNuxtPlugin } from '#app'
import { ref } from 'vue'

// 定義 AuthDialog 類型，以便在組件中使用
export interface AuthDialog {
  showLoginDialog: boolean;
  isLoginMode: boolean;
  openLoginDialog: () => void;
  openRegisterDialog: () => void;
  closeDialog: () => void;
}

export default defineNuxtPlugin((nuxtApp) => {
  console.log('Auth dialog plugin initialized');
  
  // 創建響應式狀態
  const showLoginDialog = ref(false);
  const isLoginMode = ref(true);
  
  // 創建一個共享的狀態來控制登入對話框
  const authDialogState = {
    // 響應式屬性
    get showLoginDialog() { return showLoginDialog.value },
    set showLoginDialog(value: boolean) { showLoginDialog.value = value },
    
    get isLoginMode() { return isLoginMode.value },
    set isLoginMode(value: boolean) { isLoginMode.value = value },
    
    // 方法
    openLoginDialog() {
      showLoginDialog.value = true;
      isLoginMode.value = true;
      console.log('Opening login dialog from auth-dialog plugin');
    },
    
    openRegisterDialog() {
      showLoginDialog.value = true;
      isLoginMode.value = false;
    },
    
    closeDialog() {
      showLoginDialog.value = false;
    }
  };
  
  return {
    provide: {
      authDialog: authDialogState
    }
  }
}) 