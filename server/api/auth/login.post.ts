import { User, IUser } from '../../models/User';
import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { email, password } = body;

        // 驗證必要欄位
        if (!email || !password) {
            return createError({
                statusCode: 400,
                message: '請填寫所有必要欄位'
            });
        }

        // 查找用戶
        const user = await User.findOne({ email });
        if (!user || !user.password) {  // 確保用戶存在且有密碼
            return createError({
                statusCode: 401,
                message: '郵箱或密碼錯誤'
            });
        }

        // 驗證密碼
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return createError({
                statusCode: 401,
                message: '郵箱或密碼錯誤'
            });
        }

        // 更新最後登入時間
        user.lastLoginAt = new Date();
        await user.save();

        // 返回用戶資料（不包含密碼）
        const userData: Partial<IUser> = user.toObject();
        userData.password = undefined;

        return {
            success: true,
            data: userData
        };
    } catch (error) {
        console.error('登入錯誤:', error);
        return createError({
            statusCode: 500,
            message: '登入失敗'
        });
    }
}); 