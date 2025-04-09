import { H3Event } from 'h3'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { setUserSession } from '~/server/utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { email, password } = await readBody(event)
    console.log('登入嘗試:', { email }) // 不要記錄密碼

    // 驗證必要欄位
    if (!email || !password) {
      console.log('缺少必要欄位')
      throw createError({
        statusCode: 400,
        message: '請填寫所有必要欄位'
      })
    }

    // 查找用戶
    const user = await prisma.user.findUnique({
      where: { email }
    })

    console.log('查找用戶結果:', user ? '找到用戶' : '未找到用戶')

    if (!user) {
      throw createError({
        statusCode: 401,
        message: '郵箱或密碼錯誤'
      })
    }

    // 驗證密碼
    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log('密碼驗證結果:', isPasswordValid ? '密碼正確' : '密碼錯誤')

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        message: '郵箱或密碼錯誤'
      })
    }

    // 如果用戶啟用了2FA，返回特殊響應
    if (user.twoFactorEnabled) {
      console.log('用戶啟用了2FA')
      return {
        success: true,
        requireTwoFactor: true,
        email: user.email
      }
    }

    // 設置用戶 session
    const config = useRuntimeConfig()
    console.log('Session 密鑰長度:', config.sessionSecret?.length || 0)

    const session = await useSession(event, {
      password: config.sessionSecret
    })

    await session.update({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    console.log('Session 設置成功')

    // 返回用戶信息（不包含密碼）
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled
      }
    }
  } catch (error: any) {
    console.error('登入錯誤:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '登入失敗'
    })
  }
}) 