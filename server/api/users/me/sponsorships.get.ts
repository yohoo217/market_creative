import { Sponsorship } from '~/server/models/Sponsorship'

export default defineEventHandler(async (event) => {
  try {
    // 获取当前登录用户
    const user = event.context.user
    if (!user) {
      return createError({
        statusCode: 401,
        message: '請先登入'
      })
    }

    // 查询用户的赞助记录
    const sponsorships = await Sponsorship.find({ user: user._id })
      .populate({
        path: 'product',
        select: 'name image status'
      })
      .sort({ createdAt: -1 }) // 按创建时间倒序排列

    return {
      success: true,
      data: sponsorships
    }
  } catch (error: any) {
    console.error('獲取贊助記錄失敗:', error)
    return createError({
      statusCode: 500,
      message: error.message || '獲取贊助記錄時發生錯誤'
    })
  }
}) 