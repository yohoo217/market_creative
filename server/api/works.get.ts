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
    user?: {
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
        // 檢查是否登入，如果登入則返回完整數據，否則僅返回基本數據
        const user = event.context.user;

        // 獲取所有產品並填充用戶信息
        const products = await Product.find()
            .populate('user')
            .populate('comments.user')
            .exec() as unknown as ProductWithUser[];

        console.log(`獲取到 ${products.length} 個產品記錄`);

        // 將產品數據轉換為作品格式
        const worksWithNull = products.map(product => {
            try {
                // 檢查產品數據的完整性
                if (!product) {
                    console.warn('發現無效產品數據');
                    return null;
                }

                // 計算平均評分
                const comments = product.comments || [];
                const avgRating = comments.reduce((acc, comment) => acc + (comment.rating || 0), 0);
                const rating = comments.length ? avgRating / comments.length : 0;

                return {
                    _id: product._id?.toString() || '',
                    title: product.name || '',
                    description: product.description || '',
                    image: product.image || '',
                    category: product.category || '',
                    price: product.price || 0,
                    rating,
                    likes: product.likes || 0,
                    views: product.views || 0,
                    createdAt: product.createdAt?.toISOString() || new Date().toISOString(),
                    comments: comments.map(comment => {
                        try {
                            return {
                                _id: comment._id?.toString() || '',
                                user: comment.user?.toString() || '',
                                content: comment.content || '',
                                rating: comment.rating || 0,
                                date: comment.date || new Date(),
                                likes: comment.likes || 0
                            };
                        } catch (commentError) {
                            console.error('處理評論時出錯:', commentError);
                            return null;
                        }
                    }).filter(Boolean) as WorkComment[],
                    user: product.user ? {
                        _id: product.user._id?.toString() || '',
                        name: product.user.name || '',
                        roles: Array.isArray(product.user.roles) ? product.user.roles : [],
                        activeRole: product.user.activeRole || UserRole.VISITOR
                    } : undefined
                } as Work;
            } catch (productError) {
                console.error('處理產品數據時出錯:', productError, '產品ID:', product?._id?.toString());
                return null;
            }
        });

        // 過濾掉null值並轉換為Work[]類型
        const works: Work[] = worksWithNull.filter(Boolean) as Work[];

        console.log(`成功轉換 ${works.length} 個作品記錄`);

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