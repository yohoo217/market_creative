import { H3Event } from 'h3'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { token, newPassword } = await readBody(event)

    if (!token || !newPassword) {
      throw createError({
        statusCode: 400,
        message: '缺少必要參數'
      })
    }

    // 驗證密碼強度
    if (newPassword.length < 8) {
      throw createError({
        statusCode: 400,
        message: '密碼長度必須至少為8個字符'
      })
    }

    // 查找具有有效重置令牌的用戶
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      throw createError({
        statusCode: 400,
        message: '重置令牌無效或已過期'
      })
    }

    // 雜湊新密碼
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // 更新用戶密碼並清除重置令牌
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    return {
      success: true,
      message: '密碼已成功重置'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '重置密碼時發生錯誤'
    })
  }
}) 