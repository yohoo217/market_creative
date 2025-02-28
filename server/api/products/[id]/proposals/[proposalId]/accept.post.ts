import { Product } from '~/server/models/Product'
import { UserRole, IUserRole } from '~/server/models/User'
import mongoose from 'mongoose'

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

    // 2. 獲取創意和提案 ID
    const productId = getRouterParam(event, 'id')
    const proposalId = getRouterParam(event, 'proposalId')
    if (!productId || !proposalId) {
      throw createError({
        statusCode: 400,
        message: '無效的請求參數'
      })
    }

    // 3. 查找創意
    const product = await Product.findById(productId)
    if (!product) {
      throw createError({
        statusCode: 404,
        message: '找不到該創意'
      })
    }

    // 4. 驗證用戶是否為創意擁有者
    if (product.user.toString() !== user._id.toString()) {
      throw createError({
        statusCode: 403,
        message: '只有創意擁有者才能接受提案'
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

    // 6. 查找並更新提案
    const proposal = product.proposals.id(proposalId)
    if (!proposal) {
      throw createError({
        statusCode: 404,
        message: '找不到該提案'
      })
    }

    if (proposal.status !== 'pending') {
      throw createError({
        statusCode: 400,
        message: '該提案已被處理'
      })
    }

    // 7. 更新提案狀態和創意狀態
    proposal.status = 'accepted'
    product.engineer = proposal.engineer
    product.ideatorConfirmed = true // 創意者確認

    // 8. 拒絕其他提案
    product.proposals.forEach(p => {
      if (p._id.toString() !== proposalId) {
        p.status = 'rejected'
      }
    })

    await product.save()

    return {
      success: true,
      message: '提案已接受',
      data: product
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '接受提案時發生錯誤'
    })
  }
}) 