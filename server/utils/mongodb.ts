import mongoose from 'mongoose';

let isConnected = false;

export async function connectToMongoDB() {
    try {
        if (isConnected) {
            console.log('已經連接到 MongoDB');
            return;
        }

        // 這裡需要替換成你的 MongoDB Atlas 連接字串
        const MONGODB_URI = process.env.MONGODB_URI || '';
        
        if (!MONGODB_URI) {
            throw new Error('請設定 MONGODB_URI 環境變數');
        }

        const options = {
            serverSelectionTimeoutMS: 15000, // 超时时间增加到 15 秒
            socketTimeoutMS: 45000,          // Socket 超时设置为 45 秒
            maxPoolSize: 50,                 // 连接池大小
            retryWrites: true,               // 启用重试写入
            retryReads: true,                // 启用重试读取
        };

        await mongoose.connect(MONGODB_URI, options);
        
        isConnected = true;
        console.log('成功連接到 MongoDB Atlas');

    } catch (error) {
        isConnected = false;
        console.error('MongoDB 連接錯誤:', error);
        // 不要在这里退出进程，而是抛出错误
        throw error;
    }
}

// 添加断开连接时的处理
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB 連接斷開');
    isConnected = false;
});

// 添加错误处理
mongoose.connection.on('error', (err) => {
    console.error('MongoDB 連接錯誤:', err);
    isConnected = false;
}); 