import { H3Event } from 'h3'
import { PrismaClient } from '@prisma/client'
import speakeasy from 'speakeasy'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event)
    const { token, email, recoveryCode } = body

    // 查找用戶
    const user = await prisma.user.findUnique({
      where: { email }
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
        message: '此帳戶未啟用二階段驗證'
      })
    }

    let isValid = false

    // 檢查是否使用恢復碼
    if (recoveryCode) {
      const recoveryCodeIndex = user.backupCodes.indexOf(recoveryCode)
      if (recoveryCodeIndex !== -1) {
        // 移除已使用的恢復碼
        const updatedBackupCodes = [...user.backupCodes]
        updatedBackupCodes.splice(recoveryCodeIndex, 1)
        
        await prisma.user.update({
          where: { id: user.id },
          data: { backupCodes: updatedBackupCodes }
        })
        
        isValid = true
      }
    } else if (token) {
      // 驗證 TOTP token
      isValid = speakeasy.totp.verify({
        secret: user.twoFactorSecret!,
        encoding: 'base32',
        token: token
      })
    }

    if (!isValid) {
      throw createError({
        statusCode: 401,
        message: '驗證碼或恢復碼無效'
      })
    }

    // 在此處生成新的 session token 或設置相關的登入狀態
    // ...

    return {
      success: true,
      userId: user.id
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '驗證失敗'
    })
  }
}) 