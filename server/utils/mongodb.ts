import mongoose from 'mongoose';

export async function connectToMongoDB() {
    try {
        // 這裡需要替換成你的 MongoDB Atlas 連接字串
        const MONGODB_URI = process.env.MONGODB_URI || '';
        
        if (!MONGODB_URI) {
            throw new Error('請設定 MONGODB_URI 環境變數');
        }

        if (mongoose.connection.readyState === 1) {
            return mongoose.connection;
        }

        await mongoose.connect(MONGODB_URI);
        console.log('成功連接到 MongoDB Atlas');
        
        return mongoose.connection;
    } catch (error) {
        console.error('MongoDB 連接錯誤:', error);
        process.exit(1);
    }
} 