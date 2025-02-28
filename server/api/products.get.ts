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
            data: products.filter(product => product !== null).map(product => {
                // 確保product對象存在
                if (!product) return null;
                
                return {
                    _id: product._id?.toString() || '',
                    name: product.name || '',
                    description: product.description || '',
                    price: product.price || 0,
                    image: product.image || '',
                    category: product.category || '',
                    user: product.user ? {
                        _id: product.user._id?.toString() || '',
                        name: product.user.name || '',
                        avatar: product.user.avatar || ''
                    } : null,
                    comments: Array.isArray(product.comments) ? product.comments
                        .filter((comment: any) => comment !== null)
                        .map((comment: any) => {
                            if (!comment) return null;
                            return {
                                _id: comment._id?.toString() || '',
                                content: comment.content || '',
                                rating: comment.rating || 0,
                                date: comment.date || new Date(),
                                user: comment.user ? {
                                    _id: comment.user._id?.toString() || '',
                                    name: comment.user.name || '',
                                    avatar: comment.user.avatar || ''
                                } : null
                            };
                        }).filter(Boolean) : [],
                    createdAt: product.createdAt || new Date(),
                    dimensions: product.dimensions || '',
                    travelDistance: product.travelDistance || '',
                    images: product.images || [],
                    additionalImages: product.additionalImages || [],
                    status: product.status || '',
                    views: product.views || 0,
                    likes: product.likes || 0,
                    targetFunding: product.fundraisingGoal || 0,
                    currentFunding: product.currentFunding || 0
                };
            }).filter(Boolean)
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