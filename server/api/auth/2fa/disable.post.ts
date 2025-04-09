import { H3Event } from 'h3'
import { PrismaClient } from '@prisma/client'
import speakeasy from 'speakeasy'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event)
    const { token } = body

    const userId = event.context.auth?.userId
    if (!userId) {
      throw createError({
        statusCode: 401,
        message: '請先登入'
      })
    }

    // 獲取用戶資料
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        message: '用戶不存在'
      })
    }

    if (!user.twoFactorEnabled) {
      throw createError({
        statusCode: 400,
        message: '二階段驗證尚未啟用'
      })
    }

    // 驗證 token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret!,
      encoding: 'base32',
      token: token
    })

    if (!verified) {
      throw createError({
        statusCode: 401,
        message: '驗證碼無效'
      })
    }

    // 禁用 2FA
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: null,
        twoFactorEnabled: false,
        backupCodes: []
      }
    })

    return {
      success: true,
      message: '已成功禁用二階段驗證'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '禁用二階段驗證時發生錯誤'
    })
  }
}) 