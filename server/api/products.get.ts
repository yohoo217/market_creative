import { Product } from '../models/Product';

export default defineEventHandler(async (event) => {
    try {
        const products = await Product.find().populate('creator');
        return {
            success: true,
            data: products
        };
    } catch (error) {
        console.error('獲取產品列表錯誤:', error);
        return {
            success: false,
            message: '獲取產品列表失敗'
        };
    }
}); 