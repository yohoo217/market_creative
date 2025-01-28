import mongoose from 'mongoose';
import { Product } from '../models/Product';
import dotenv from 'dotenv';
import { defineEventHandler, createError } from 'h3';

// 載入環境變數
dotenv.config();

// 連接到 MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/creative-marketplace';

export default defineEventHandler(async (event) => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find();
        
        for (const product of products) {
            // 更新產品數據，每個產品使用不同的值
            const updatedProduct = {
                dimensions: `${product.name} 的尺寸規格：長度 ${Math.floor(Math.random() * 30) + 10}cm，寬度 ${Math.floor(Math.random() * 20) + 10}cm，高度 ${Math.floor(Math.random() * 15) + 5}cm`,
                travelDistance: `${product.name} 的運動範圍：垂直 ${Math.floor(Math.random() * 30) + 10}cm，水平 ${Math.floor(Math.random() * 50) + 20}cm`,
                images: [
                    `/products/${product._id}/main.png`,
                    `/products/${product._id}/angle1.png`,
                    `/products/${product._id}/angle2.png`,
                    `/products/${product._id}/angle3.png`,
                    `/products/${product._id}/detail1.png`,
                    `/products/${product._id}/detail2.png`,
                ],
                additionalImages: [
                    `/products/${product._id}/additional1.png`,
                    `/products/${product._id}/additional2.png`,
                    `/products/${product._id}/additional3.png`
                ],
                status: 'published',
                views: Math.floor(Math.random() * 1000),
                likes: Math.floor(Math.random() * 100)
            };

            await Product.findByIdAndUpdate(product._id, updatedProduct, { new: true });
            console.log(`Updated product: ${product.name}`);
        }

        console.log('All products updated successfully');
        return {
            success: true,
            message: 'All products updated successfully'
        };
    } catch (error) {
        console.error('Error updating products:', error);
        return createError({
            statusCode: 500,
            message: 'Failed to update products'
        });
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}); 