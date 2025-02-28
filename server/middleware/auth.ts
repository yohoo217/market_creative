import { User } from '../models/User'
import { getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // 从 cookie 中获取用户 ID
    const userId = getCookie(event, 'userId')
    if (!userId) {
      console.log('認證中間件: 無用戶ID cookie')
      return
    }

    console.log(`認證中間件: 嘗試查找用戶 ID ${userId}`)
    
    // 查找用户
    const user = await User.findById(userId)
    if (!user) {
      console.log(`認證中間件: 找不到用戶 ID ${userId}`)
      return
    }

    // 確保用戶數據完整
    if (!user.name || !user.email) {
      console.warn(`認證中間件: 用戶數據不完整 ID ${userId}`)
    } else {
      console.log(`認證中間件: 成功獲取用戶 ${user.name}`)
    }

    // 将用户信息添加到请求上下文中
    event.context.user = user
  } catch (error) {
    console.error('认证中间件错误:', error)
  }
}) 