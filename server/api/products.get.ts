import { Product } from '../models/Product';
import { defineEventHandler, createError, getQuery } from 'h3';

interface Comment {
    _id: string;
    content: string;
    rating: number;
    date: Date;
    user: {
        _id: string;
        name: string;
        avatar?: string;
    };
}

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);
        const { status } = query;

        // 構建查詢條件
        const filter: any = {};
        if (status) {
            filter.status = status;
        }

        const products = await Product.find(filter)
            .populate('user')
            .populate('comments.user');

        return {
            success: true,
            data: products.map(product => ({
                id: product._id.toString(),
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image,
                category: product.category,
                user: {
                    id: product.user._id.toString(),
                    name: product.user.name,
                    avatar: product.user.avatar
                },
                comments: product.comments.map((comment: any) => ({
                    _id: comment._id.toString(),
                    content: comment.content,
                    rating: comment.rating,
                    date: comment.date,
                    user: {
                        _id: comment.user._id.toString(),
                        name: comment.user.name,
                        avatar: comment.user.avatar
                    }
                })),
                createdAt: product.createdAt,
                dimensions: product.dimensions,
                travelDistance: product.travelDistance,
                images: product.images,
                additionalImages: product.additionalImages,
                status: product.status,
                views: product.views,
                likes: product.likes,
                fundraisingGoal: product.fundraisingGoal,
                currentFunding: product.currentFunding
            }))
        };
    } catch (error) {
        console.error('獲取產品列表錯誤:', error);
        return createError({
            statusCode: 500,
            message: '獲取產品列表失敗',
            cause: error
        });
    }
}); 