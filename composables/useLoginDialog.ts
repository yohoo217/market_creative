import { ref } from 'vue';

export function useLoginDialog() {
  // 狀態
  const showLoginDialog = ref(false);
  const isLoginMode = ref(true);

  // 打開登入對話框
  function openLoginDialog() {
    isLoginMode.value = true;
    showLoginDialog.value = true;
  }

  // 打開註冊對話框
  function openRegisterDialog() {
    isLoginMode.value = false;
    showLoginDialog.value = true;
  }

  // 關閉對話框
  function closeDialog() {
    showLoginDialog.value = false;
  }

  return {
    showLoginDialog,
    isLoginMode,
    openLoginDialog,
    openRegisterDialog,
    closeDialog
  };
} 