import { User, UserRole } from '~/server/models/User';

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);
        const { search, role } = query;

        // 構建查詢條件
        const filter: any = {};
        
        // 搜索條件
        if (search) {
            filter.$or = [
                { name: new RegExp(String(search), 'i') },
                { email: new RegExp(String(search), 'i') }
            ];
        }

        // 角色過濾
        if (role) {
            filter['roles.type'] = role;
        }

        // 獲取用戶列表
        const users = await User.find(filter)
            .select('-password')  // 排除密碼字段
            .sort({ createdAt: -1 });  // 按創建時間降序

        return {
            success: true,
            data: users
        };
    } catch (error) {
        console.error('獲取用戶列表錯誤:', error);
        return createError({
            statusCode: 500,
            message: '獲取用戶列表失敗'
        });
    }
}); 