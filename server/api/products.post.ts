import { Product } from '../models/Product'
import { UserRole, IUserRole } from '../models/User'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

// 開發環境的圖片存儲
const saveImageLocally = async (file: any) => {
  const fileExt = file.filename?.split('.').pop() || 'png'
  const fileName = `${randomUUID()}.${fileExt}`
  const publicPath = 'uploads/products'
  const uploadDir = join(process.cwd(), 'public', publicPath)
  
  await mkdir(uploadDir, { recursive: true })
  await writeFile(join(uploadDir, fileName), file.data)
  
  return `/${publicPath}/${fileName}`
}

// TODO: 生產環境的圖片存儲
const saveImageToCloud = async (file: any) => {
  // 這裡將來實現雲存儲邏輯
  // 例如上傳到 AWS S3 或其他雲存儲服務
  return await saveImageLocally(file)
}

export default defineEventHandler(async (event) => {
  try {
    // 1. 验证用户是否登录
    const user = event.context.user
    if (!user) {
      throw createError({
        statusCode: 401,
        message: '請先登入'
      })
    }

    // 2. 验证用户是否为创意者
    const isIdeator = user.roles.some((role: IUserRole) => role.type === UserRole.IDEATOR && role.isActive)
    if (!isIdeator) {
      throw createError({
        statusCode: 403,
        message: '只有創意者才能建立新的創意'
      })
    }

    // 3. 获取并验证表单数据
    const formData = await readMultipartFormData(event)
    if (!formData) {
      throw createError({
        statusCode: 400,
        message: '請提供創意資料'
      })
    }

    const name = formData.find(item => item.name === 'name')?.data.toString()
    const description = formData.find(item => item.name === 'description')?.data.toString()
    const category = formData.find(item => item.name === 'category')?.data.toString()
    const dimensions = formData.find(item => item.name === 'dimensions')?.data.toString()
    const travelDistance = formData.find(item => item.name === 'travelDistance')?.data.toString()
    const coverImage = formData.find(item => item.name === 'coverImage')
    const detailImages = formData.filter(item => item.name === 'detailImages')

    if (!name || !description || !category || !dimensions || !travelDistance) {
      throw createError({
        statusCode: 400,
        message: '請提供完整的創意資料'
      })
    }

    // 4. 处理图片上传
    let coverImageUrl = '/default-product-image.png'
    if (coverImage) {
      coverImageUrl = process.env.NODE_ENV === 'production'
        ? await saveImageToCloud(coverImage)
        : await saveImageLocally(coverImage)
    }

    // 处理细节图片
    const imageUrls = []
    for (const image of detailImages) {
      const imageUrl = process.env.NODE_ENV === 'production'
        ? await saveImageToCloud(image)
        : await saveImageLocally(image)
      imageUrls.push(imageUrl)
    }

    // 5. 创建新的创意
    const product = await Product.create({
      name,
      description,
      image: coverImageUrl,
      user: user._id,
      category,
      dimensions,
      travelDistance,
      images: [coverImageUrl, ...imageUrls], // 合并封面图和细节图
      status: 'idea', // 初始状态为创意阶段
      views: 0,
      likes: 0,
      comments: [],
      averageRating: 0,
      engineer: null, // 初始没有工程师
      proposals: [], // 工程师的提案列表
      engineerConfirmed: false, // 工程师是否确认
      ideatorConfirmed: false, // 创意者是否确认
      vendor: null,
      fundraisingGoal: null,
      currentFunding: 0
    })

    return {
      success: true,
      data: product
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '建立創意時發生錯誤'
    })
  }
}) 