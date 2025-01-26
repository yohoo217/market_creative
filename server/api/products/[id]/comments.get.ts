import { Product } from '../../../models/Product';

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        
        // 檢查 id 是否為有效值
        if (!id || id === 'undefined') {
            return createError({
                statusCode: 400,
                message: '無效的產品 ID'
            });
        }

        // 檢查 id 是否為有效的 MongoDB ObjectId
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return createError({
                statusCode: 400,
                message: '無效的產品 ID 格式'
            });
        }

        const product = await Product.findById(id);
        
        if (!product) {
            return createError({
                statusCode: 404,
                message: '找不到該產品'
            });
        }

        return {
            success: true,
            data: product.comments || []
        };
    } catch (error) {
        console.error('獲取評論錯誤:', error);
        return createError({
            statusCode: 500,
            message: '獲取評論失敗',
            cause: error
        });
    }
}); 