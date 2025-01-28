import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import dotenv from 'dotenv';

// 載入環境變數
dotenv.config();

// 連接到 MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/creative-marketplace';

async function updateProducts() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find();
        
        for (const product of products) {
            // 更新產品數據
            const updatedProduct = {
                dimensions: '基座 15 cm，支臂長度 45 cm，高度範圍 40 cm',
                travelDistance: '垂直 20 cm，水平 60 cm，傾斜 +85°~-15°，旋轉 360°',
                images: [
                    'picture/1E668206-82A3-4E55-8523-3D93D3FE014A.png',
                    'picture/5CE25C84-4EE7-4275-ABB9-03137C1C312D.png',
                    'picture/5F82A9AA-E874-4293-8AF7-F5B59896A39B.png',
                    'picture/6B687B74-1CCA-422F-B589-7A19D72A50EE.png',
                    'picture/1E668206-82A3-4E55-8523-3D93D3FE014A.png',
                    'picture/944D99A0-CE05-4B61-92B1-3460C0860AAD.png',
                ],
                additionalImages: [
                    'picture/123.png',
                    'picture/456.png',
                    'picture/1415.png'
                ],
                status: 'published',
                views: Math.floor(Math.random() * 1000),
                likes: Math.floor(Math.random() * 100)
            };

            await Product.findByIdAndUpdate(product._id, updatedProduct, { new: true });
            console.log(`Updated product: ${product.name}`);
        }

        console.log('All products updated successfully');
    } catch (error) {
        console.error('Error updating products:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

updateProducts(); 