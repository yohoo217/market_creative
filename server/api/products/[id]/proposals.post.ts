import { Product } from '~/server/models/Product'
import { UserRole, IUserRole } from '~/server/models/User'
import mongoose from 'mongoose'

interface Proposal {
  engineer: mongoose.Types.ObjectId;
  content: string;
  estimatedTime: string;
  estimatedCost: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export default defineEventHandler(async (event) => {
  try {
    // 1. 驗證用戶是否登入
    const user = event.context.user
    if (!user) {
      throw createError({
        statusCode: 401,
        message: '請先登入'
      })
    }

    // 2. 驗證用戶是否為工程師
    const isEngineer = user.roles.some((role: IUserRole) => role.type === UserRole.ENGINEER && role.isActive)
    if (!isEngineer) {
      throw createError({
        statusCode: 403,
        message: '只有工程師才能提交提案'
      })
    }

    // 3. 獲取創意 ID
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        message: '無效的創意 ID'
      })
    }

    // 4. 查找創意
    const product = await Product.findById(id)
    if (!product) {
      throw createError({
        statusCode: 404,
        message: '找不到該創意'
      })
    }

    // 5. 檢查創意狀態
    if (product.status !== 'idea') {
      throw createError({
        statusCode: 400,
        message: '該創意已不在創意階段'
      })
    }

    if (product.engineer) {
      throw createError({
        statusCode: 400,
        message: '該創意已有工程師接案'
      })
    }

    // 6. 獲取提案內容
    const body = await readBody(event)
    const { content, estimatedTime, estimatedCost } = body

    if (!content || !estimatedTime || !estimatedCost) {
      throw createError({
        statusCode: 400,
        message: '請提供完整的提案內容'
      })
    }

    // 7. 檢查是否已經提案過
    const existingProposal = product.proposals.find((p: Proposal) => p.engineer.toString() === user._id.toString())
    if (existingProposal) {
      throw createError({
        statusCode: 400,
        message: '您已經提交過提案'
      })
    }

    // 8. 添加提案
    product.proposals.push({
      engineer: user._id,
      content,
      estimatedTime,
      estimatedCost,
      status: 'pending',
      createdAt: new Date()
    })

    await product.save()

    return {
      success: true,
      message: '提案提交成功',
      data: product
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '提交提案時發生錯誤'
    })
  }
}) 