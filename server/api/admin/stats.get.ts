import { User } from '~/server/models/User';
import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
  try {
    // 檢查是否為管理員 (本課程示範未實現完整的身份驗證)
    // const session = await getUserSession(event);
    // if (!session?.user?.role === 'admin') {
    //   return createError({
    //     statusCode: 403,
    //     message: '無權限訪問'
    //   });
    // }

    // 獲取用戶總數
    const userCount = await User.countDocuments();
    
    // 獲取產品總數
    let productCount = 0;
    try {
      // 檢查是否有 Product 模型
      if (mongoose.models.Product) {
        productCount = await mongoose.models.Product.countDocuments();
      }
    } catch (error) {
      console.log('產品計數錯誤，可能是模型不存在');
    }
    
    // 獲取提案總數
    let proposalCount = 0;
    try {
      // 檢查是否有 Proposal 模型
      if (mongoose.models.Proposal) {
        proposalCount = await mongoose.models.Proposal.countDocuments();
      }
    } catch (error) {
      console.log('提案計數錯誤，可能是模型不存在');
    }
    
    // 這裡可以引入訪問量統計，現在先使用隨機數做示範
    const visitCount = Math.floor(Math.random() * 100) + 50;
    
    return {
      success: true,
      data: {
        userCount,
        productCount,
        proposalCount,
        visitCount
      }
    };
  } catch (error) {
    console.error('獲取管理員統計數據失敗:', error);
    return createError({
      statusCode: 500,
      message: '獲取統計數據失敗'
    });
  }
}); 