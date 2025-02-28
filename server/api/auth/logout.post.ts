import { deleteCookie } from 'h3'

export default defineEventHandler(async (event) => {
    try {
        // 清除 cookie
        deleteCookie(event, 'userId')

        return {
            success: true,
            message: '登出成功'
        }
    } catch (error) {
        console.error('登出錯誤:', error)
        throw createError({
            statusCode: 500,
            message: '登出失敗'
        })
    }
}) 