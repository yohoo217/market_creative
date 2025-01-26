import { Product } from '../../models/Product';

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        if (!id) {
            return createError({
                statusCode: 400,
                message: '產品 ID 不能為空'
            });
        }

        const product = await Product.findById(id).populate('creator');
        
        if (!product) {
            return createError({
                statusCode: 404,
                message: '找不到該產品'
            });
        }

        // 從數據庫獲取的產品數據
        const productData = {
            id: product._id.toString(),
            name: product.name,
            description: product.description,
            image: product.image,
            price: product.price,
            category: product.category,
            rating: product.comments?.reduce((acc, comment) => acc + (comment.rating || 0), 0) / (product.comments?.length || 1),
            comments: product.comments || [],
            createdAt: product.createdAt,
            creator: product.creator,
            dimensions: product.dimensions,
            travelDistance: product.travelDistance,
            images: product.images,
            additionalImages: product.additionalImages
        };

        return {
            success: true,
            data: productData
        };
    } catch (error) {
        console.error('獲取產品錯誤:', error);
        return createError({
            statusCode: 500,
            message: '獲取產品失敗'
        });
    }
}); 