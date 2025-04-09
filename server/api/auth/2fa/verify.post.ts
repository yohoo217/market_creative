import { H3Event } from 'h3'
import { PrismaClient } from '@prisma/client'
import speakeasy from 'speakeasy'
import crypto from 'crypto'

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

    // 獲取用戶的 2FA 密鑰
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user?.twoFactorSecret) {
      throw createError({
        statusCode: 400,
        message: '尚未設置二階段驗證'
      })
    }

    // 驗證 token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token
    })

    if (!verified) {
      throw createError({
        statusCode: 400,
        message: '驗證碼無效'
      })
    }

    // 生成備用恢復碼
    const backupCodes = Array.from({ length: 8 }, () => 
      crypto.randomBytes(4).toString('hex')
    )

    // 啟用 2FA 並保存備用碼
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        backupCodes
      }
    })

    return {
      success: true,
      backupCodes
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '驗證二階段驗證時發生錯誤'
    })
  }
}) 