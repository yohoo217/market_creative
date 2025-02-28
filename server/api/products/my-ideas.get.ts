import { Product } from '../../models/Product'
import { UserRole } from '../../models/User'

export default defineEventHandler(async (event) => {
  try {
    // 获取当前登录用户
    const user = event.context.user
    
    // 检查用户是否已登录
    if (!user) {
      return createError({
        statusCode: 401,
        message: '請先登入'
      })
    }
    
    // 检查用户是否有创意者角色
    const hasIdeatorRole = user.roles.some((role: any) => 
      role.type === UserRole.IDEATOR && role.isActive
    )
    
    if (!hasIdeatorRole) {
      return createError({
        statusCode: 403,
        message: '您需要創意者角色才能查看自己的創意'
      })
    }

    // 查询用户创建的所有创意
    const ideas = await Product.find({ 'user._id': user._id })
      .sort({ createdAt: -1 }) // 按创建时间降序排列
      .lean() // 获取纯 JavaScript 对象
    
    // 添加提案计数字段
    const ideasWithProposalCount = ideas.map(idea => ({
      ...idea,
      proposalCount: idea.proposals?.length || 0
    }))

    return {
      success: true,
      data: ideasWithProposalCount
    }
  } catch (error) {
    console.error('获取我的创意列表错误:', error)
    return createError({
      statusCode: 500,
      message: '獲取創意列表失敗'
    })
  }
}) 