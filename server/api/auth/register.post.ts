import { User, UserRole, IUser } from '../../models/User';
import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { email, password, name, role } = body;

        // 驗證必要欄位
        if (!email || !password || !name) {
            return createError({
                statusCode: 400,
                message: '請填寫所有必要欄位'
            });
        }

        // 檢查郵箱是否已存在
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return createError({
                statusCode: 400,
                message: '此郵箱已被註冊'
            });
        }

        // 密碼加密
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 創建用戶
        const user = new User({
            email,
            password: hashedPassword,
            name,
            roles: [{
                type: role || UserRole.VISITOR,
                isActive: true
            }],
            activeRole: role || UserRole.VISITOR
        });

        await user.save();

        // 返回用戶資料（不包含密碼）
        const userData: Partial<IUser> = user.toObject();
        userData.password = undefined;

        return {
            success: true,
            data: userData
        };
    } catch (error) {
        console.error('註冊錯誤:', error);
        return createError({
            statusCode: 500,
            message: '註冊失敗'
        });
    }
}); 