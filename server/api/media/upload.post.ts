import { readMultipartFormData } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // 1. 驗證用戶是否登入
    const user = event.context.user
    if (!user) {
      throw createError({
        statusCode: 401,
        message: '請先登入'
      })
    }

    // 2. 獲取上傳的檔案
    const formData = await readMultipartFormData(event)
    if (!formData || !formData.length) {
      throw createError({
        statusCode: 400,
        message: '請提供要上傳的檔案'
      })
    }

    const file = formData[0]
    if (!file.type?.startsWith('image/')) {
      throw createError({
        statusCode: 400,
        message: '只支援上傳圖片檔案'
      })
    }

    // 3. 上傳到公司媒體庫
    // TODO: 替換為實際的媒體庫 API 端點和認證資訊
    const mediaLibraryApiUrl = process.env.MEDIA_LIBRARY_API_URL
    const mediaLibraryApiKey = process.env.MEDIA_LIBRARY_API_KEY

    const formDataToSend = new FormData()
    formDataToSend.append('file', new Blob([file.data]), file.filename)
    formDataToSend.append('userId', user._id.toString())

    const response = await fetch(`${mediaLibraryApiUrl}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mediaLibraryApiKey}`
      },
      body: formDataToSend
    })

    if (!response.ok) {
      throw new Error('上傳到媒體庫失敗')
    }

    const result = await response.json()

    return {
      success: true,
      data: {
        url: result.url // 媒體庫返回的檔案 URL
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '上傳檔案時發生錯誤'
    })
  }
}) 