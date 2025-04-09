import { H3Event } from 'h3'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { email, password, name } = await readBody(event)

    // 驗證必要欄位
    if (!email || !password || !name) {
      throw createError({
        statusCode: 400,
        message: '請填寫所有必要欄位'
      })
    }

    // 檢查郵箱是否已被使用
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    })

    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: '此郵箱已被註冊'
      })
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10)

    // 創建新用戶
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'user'
      }
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }
  } catch (error: any) {
    console.error('註冊錯誤:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '註冊失敗'
    })
  }
}) 