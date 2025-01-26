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

        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 15000, // 超时时间增加到 15 秒
            socketTimeoutMS: 45000,          // Socket 超时设置为 45 秒
            maxPoolSize: 50,                 // 连接池大小
            retryWrites: true,               // 启用重试写入
            retryReads: true,                // 启用重试读取
        });
        console.log('成功連接到 MongoDB Atlas');
        
        return mongoose.connection;
    } catch (error) {
        console.error('MongoDB 連接錯誤:', error);
        process.exit(1);
    }
} 