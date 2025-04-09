import { H3Event } from 'h3'
import { randomBytes } from 'crypto'
import { PrismaClient } from '@prisma/client'
import { sendEmail } from '~/server/utils/email'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { email } = await readBody(event)

    if (!email) {
      throw createError({
        statusCode: 400,
        message: '請提供電子郵件地址'
      })
    }

    // 檢查用戶是否存在
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        message: '找不到該電子郵件對應的用戶'
      })
    }

    // 生成重置令牌
    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24小時後過期

    // 儲存重置令牌
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // 發送重置郵件
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`
    await sendEmail({
      to: email,
      subject: '密碼重置請求',
      html: `
        <h1>密碼重置請求</h1>
        <p>您好，我們收到了您的密碼重置請求。</p>
        <p>請點擊下方連結重置您的密碼：</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>此連結將在24小時後失效。</p>
        <p>如果您沒有請求重置密碼，請忽略此郵件。</p>
      `
    })

    return {
      success: true,
      message: '密碼重置郵件已發送，請檢查您的收件匣'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '發送重置郵件時發生錯誤'
    })
  }
}) 