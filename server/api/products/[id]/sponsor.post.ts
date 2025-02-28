import { Product } from '~/server/models/Product'
import { User, UserRole } from '~/server/models/User'
import { Sponsorship } from '~/server/models/Sponsorship'

interface SponsorPayload {
  amount: number
  message?: string
  paymentMethod: string
}

export default defineEventHandler(async (event) => {
  try {
    // 獲取用戶信息
    const user = event.context.user
    if (!user) {
      return createError({
        statusCode: 401,
        message: '請先登入才能贊助創意'
      })
    }

    // 獲取請求參數
    const { id } = event.context.params || {}
    const body = await readBody<SponsorPayload>(event)
    
    // 參數驗證
    if (!id) {
      return createError({
        statusCode: 400,
        message: '請提供有效的創意ID'
      })
    }

    if (!body || !body.amount || body.amount < 50) {
      return createError({
        statusCode: 400,
        message: '請提供有效的贊助金額（至少NT$50）'
      })
    }
    
    if (!body.paymentMethod) {
      return createError({
        statusCode: 400,
        message: '請選擇付款方式'
      })
    }

    // 查找要贊助的創意
    const product = await Product.findById(id)
    if (!product) {
      return createError({
        statusCode: 404,
        message: '找不到該創意'
      })
    }

    // 創建贊助記錄
    const sponsorship = new Sponsorship({
      user: user._id,
      product: product._id,
      amount: body.amount,
      message: body.message || '',
      paymentMethod: body.paymentMethod,
      paymentStatus: 'completed', // 在實際應用中，這裡應該是 'pending'，然後通過支付回調更新
      transactionId: `TXID-${Date.now()}-${Math.floor(Math.random() * 1000)}` // 模擬交易 ID
    })

    await sponsorship.save()

    // 更新產品的當前募資金額（如果是募資階段）
    if (product.status === 'fundraising') {
      product.currentFunding = (product.currentFunding || 0) + body.amount
      await product.save()
    }

    return {
      success: true,
      message: '贊助成功',
      data: {
        transactionId: sponsorship.transactionId,
        amount: sponsorship.amount,
        date: sponsorship.createdAt
      }
    }
  } catch (error: any) {
    console.error('贊助創意失敗:', error)
    return createError({
      statusCode: 500,
      message: error.message || '贊助處理過程中發生錯誤'
    })
  }
}) 