import { H3Event } from 'h3'
import { PrismaClient } from '@prisma/client'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  try {
    // 獲取當前用戶ID（假設已經通過中間件設置）
    const userId = event.context.auth?.userId
    if (!userId) {
      throw createError({
        statusCode: 401,
        message: '請先登入'
      })
    }

    // 生成新的 TOTP 密鑰
    const secret = speakeasy.generateSecret({
      name: `創意市集 (${event.context.auth.email})`
    })

    // 生成 QR 碼
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!)

    // 暫時保存密鑰（等待驗證後再永久保存）
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret.base32,
        twoFactorEnabled: false
      }
    })

    return {
      success: true,
      secret: secret.base32,
      qrCode: qrCodeUrl
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '設置二階段驗證時發生錯誤'
    })
  }
}) 