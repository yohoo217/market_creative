import { seedDatabase } from '../utils/seedData';

export default defineEventHandler(async (event) => {
    try {
        // 檢查環境，只允許在開發環境中執行
        if (process.env.NODE_ENV === 'production') {
            return {
                success: false,
                message: '該操作在生產環境中被禁用'
            };
        }

        // 執行數據填充
        await seedDatabase();

        return {
            success: true,
            message: '數據填充成功'
        };
    } catch (error) {
        console.error('數據填充失敗:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : '數據填充失敗'
        };
    }
}); 