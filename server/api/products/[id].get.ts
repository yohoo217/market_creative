import { Product } from '../../models/Product';
import { defineEventHandler, createError } from 'h3';

interface Comment {
    user: string;
    content: string;
    rating: number;
    date: Date;
}

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        if (!id) {
            return createError({
                statusCode: 400,
                message: '產品 ID 不能為空'
            });
        }

        const product = await Product.findById(id).populate('user');
        
        if (!product) {
            return createError({
                statusCode: 404,
                message: '找不到該產品'
            });
        }

        // 計算平均評分
        const averageRating = product.comments.length > 0
            ? product.comments.reduce((acc: number, comment: Comment) => acc + comment.rating, 0) / product.comments.length
            : 0;

        // 從數據庫獲取的產品數據
        const productData = {
            _id: product._id.toString(),
            name: product.name,
            description: product.description,
            image: product.image,
            price: product.price,
            category: product.category,
            user: product.user,
            rating: averageRating,
            comments: product.comments,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            dimensions: product.dimensions,
            travelDistance: product.travelDistance,
            images: product.images,
            additionalImages: product.additionalImages,
            status: product.status,
            views: product.views,
            likes: product.likes,
            currentFunding: product.currentFunding || 0,
            targetFunding: product.fundraisingGoal || 0
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