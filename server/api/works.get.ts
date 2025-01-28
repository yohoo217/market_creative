import { Product } from '../models/Product';
import { defineEventHandler, createError } from 'h3';
import { UserRole } from '../models/User';
import type { Types } from 'mongoose';

interface BaseComment {
    _id: string;
    content: string;
    rating: number;
    date: Date;
    likes?: number;
}

interface ProductComment extends BaseComment {
    user: Types.ObjectId;
}

interface WorkComment extends BaseComment {
    user: string;
}

interface ProductWithUser {
    _id: Types.ObjectId;
    name: string;
    description: string;
    image: string;
    category: string;
    price: number;
    user: {
        _id: Types.ObjectId;
        name: string;
        roles: Array<{
            type: UserRole;
            isActive: boolean;
            rating?: number;
        }>;
        activeRole: UserRole;
    };
    comments?: ProductComment[];
    createdAt: Date;
    likes?: number;
    views?: number;
}

interface Work {
    _id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number;
    rating: number;
    likes: number;
    views: number;
    createdAt: string;
    comments?: WorkComment[];
    user?: {
        _id: string;
        name: string;
        roles: Array<{
            type: UserRole;
            isActive: boolean;
            rating?: number;
        }>;
        activeRole: UserRole;
    };
}

export default defineEventHandler(async (event) => {
    try {
        // 獲取所有產品並填充用戶信息
        const products = await Product.find()
            .populate('user')
            .populate('comments.user')
            .exec() as unknown as ProductWithUser[];

        // 將產品數據轉換為作品格式
        const works: Work[] = products.map(product => {
            // 計算平均評分
            const avgRating = product.comments?.reduce((acc, comment) => acc + comment.rating, 0) ?? 0;
            const rating = product.comments?.length ? avgRating / product.comments.length : 0;

            return {
                _id: product._id.toString(),
                title: product.name,
                description: product.description,
                image: product.image,
                category: product.category,
                price: product.price,
                rating,
                likes: product.likes ?? 0,
                views: product.views ?? 0,
                createdAt: product.createdAt.toISOString(),
                comments: product.comments?.map(comment => ({
                    _id: comment._id.toString(),
                    user: comment.user.toString(),
                    content: comment.content,
                    rating: comment.rating,
                    date: comment.date,
                    likes: comment.likes
                })),
                user: product.user ? {
                    _id: product.user._id.toString(),
                    name: product.user.name,
                    roles: product.user.roles,
                    activeRole: product.user.activeRole
                } : undefined
            };
        });

        return {
            success: true,
            data: works
        };
    } catch (error) {
        console.error('獲取作品列表錯誤:', error);
        throw createError({
            statusCode: 500,
            message: '獲取作品列表失敗'
        });
    }
}); 