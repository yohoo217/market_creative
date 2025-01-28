import { User, UserRole, IUser } from '../../models/User';
import type { Types } from 'mongoose';

interface IUserRole {
    type: UserRole;
    isActive: boolean;
    createdAt: Date;
}

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { userId, role, action } = body;  // action: 'add' | 'update' | 'remove'

        // 驗證必要欄位
        if (!userId || !role || !action) {
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

        switch (action) {
            case 'add':
                // 檢查角色是否已存在
                if (user.roles.some((r: IUserRole) => r.type === role)) {
                    return createError({
                        statusCode: 400,
                        message: '該角色已存在'
                    });
                }
                // 新增角色
                user.roles.push({
                    type: role,
                    isActive: true,
                    createdAt: new Date()
                });
                break;

            case 'update':
                // 更新角色狀態
                const roleIndex = user.roles.findIndex((r: IUserRole) => r.type === role);
                if (roleIndex === -1) {
                    return createError({
                        statusCode: 404,
                        message: '找不到該角色'
                    });
                }
                user.roles[roleIndex].isActive = !user.roles[roleIndex].isActive;
                break;

            case 'remove':
                // 移除角色
                const updatedRoles = user.roles.filter((r: IUserRole) => r.type !== role);
                user.roles = updatedRoles as Types.DocumentArray<any>;
                // 如果移除的是當前啟用的角色，則切換到訪客角色
                if (user.activeRole === role) {
                    user.activeRole = UserRole.VISITOR;
                }
                break;

            default:
                return createError({
                    statusCode: 400,
                    message: '無效的操作類型'
                });
        }

        await user.save();

        // 返回更新後的用戶資料（不包含密碼）
        const userData: Partial<IUser> = user.toObject();
        userData.password = undefined;

        return {
            success: true,
            data: userData
        };
    } catch (error) {
        console.error('更新角色錯誤:', error);
        return createError({
            statusCode: 500,
            message: '更新角色失敗'
        });
    }
}); 