import { User } from '../../models/User';

export default defineEventHandler(async (event) => {
  try {
    // 從請求上下文中獲取用戶信息
    const user = event.context.user;
    
    // 如果沒有用戶信息，返回未認證錯誤
    if (!user) {
      return {
        success: false,
        message: '用戶未登入'
      };
    }
    
    // 返回用戶信息
    return {
      success: true,
      data: user.toJSON()
    };
  } catch (error) {
    console.error('獲取當前用戶信息錯誤:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '獲取用戶信息失敗'
    };
  }
}); 