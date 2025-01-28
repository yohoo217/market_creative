import { User, UserRole, IUser } from '../../models/User';

interface IUserRole {
    type: UserRole;
    isActive: boolean;
    createdAt: Date;
}

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { userId, role } = body;

        // 驗證必要欄位
        if (!userId || !role) {
            return createError({
                statusCode: 400,
                message: '請填寫所有必要欄位'
            });
        }

        // 檢查角色是否有效
        if (!Object.values(UserRole).includes(role)) {
            return createError({
                statusCode: 400,
                message: '無效的角色類型'
            });
        }

        // 查找用戶
        const user = await User.findById(userId);
        if (!user) {
            return createError({
                statusCode: 404,
                message: '找不到該用戶'
            });
        }

        // 檢查用戶是否擁有該角色且該角色處於啟用狀態
        const userRole = user.roles.find((r: IUserRole) => r.type === role);
        if (!userRole || !userRole.isActive) {
            return createError({
                statusCode: 400,
                message: '無法切換到該角色'
            });
        }

        // 更新當前角色
        user.activeRole = role;
        await user.save();

        // 返回更新後的用戶資料（不包含密碼）
        const userData: Partial<IUser> = user.toObject();
        userData.password = undefined;

        return {
            success: true,
            data: userData
        };
    } catch (error) {
        console.error('切換角色錯誤:', error);
        return createError({
            statusCode: 500,
            message: '切換角色失敗'
        });
    }
}); 