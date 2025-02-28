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

    // 2. 驗證用戶是否為工程師
    const isEngineer = user.roles.some((role: IUserRole) => role.type === UserRole.ENGINEER && role.isActive)
    if (!isEngineer) {
      throw createError({
        statusCode: 403,
        message: '只有工程師才能確認接案'
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

    // 6. 驗證是否為被選中的工程師
    if (!product.engineer || product.engineer.toString() !== user._id.toString()) {
      throw createError({
        statusCode: 403,
        message: '您不是該創意的指定工程師'
      })
    }

    // 7. 檢查是否已經確認過
    if (product.engineerConfirmed) {
      throw createError({
        statusCode: 400,
        message: '您已經確認過了'
      })
    }

    // 8. 更新確認狀態
    product.engineerConfirmed = true

    // 如果創意者也已確認，狀態會自動更新為 in_progress（通過 Product model 的中間件）
    await product.save()

    return {
      success: true,
      message: '已確認接案',
      data: product
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '確認接案時發生錯誤'
    })
  }
}) 