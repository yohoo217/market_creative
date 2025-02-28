import { User } from '~/server/models/User';
import { H3Error } from 'h3';
import { setCookie } from 'h3';

export default defineEventHandler(async (event) => {
    try {
        const formData = await readMultipartFormData(event);
        if (!formData) {
            throw createError({
                statusCode: 400,
                statusMessage: '無效的請求數據'
            });
        }

        // 解析表單數據
        const userData: Record<string, any> = {};
        let avatar: Buffer | null = null;
        let avatarType = '';

        formData.forEach(field => {
            if (field.name === 'avatar' && field.type && field.data) {
                avatar = field.data;
                avatarType = field.type;
            } else if (field.name && field.data) {
                userData[field.name] = field.data.toString();
            }
        });

        const { email, password, name } = userData;

        // 驗證必要欄位
        if (!email || !password || !name) {
            throw createError({
                statusCode: 400,
                statusMessage: '請填寫所有必要欄位'
            });
        }

        // 驗證電子郵件格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw createError({
                statusCode: 400,
                statusMessage: '無效的電子郵件格式'
            });
        }

        // 驗證密碼強度
        if (password.length < 8) {
            throw createError({
                statusCode: 400,
                statusMessage: '密碼長度至少需要8個字符'
            });
        }

        // 驗證用戶名長度
        if (name.length < 2 || name.length > 20) {
            throw createError({
                statusCode: 400,
                statusMessage: '用戶名長度必須在2-20個字符之間'
            });
        }

        // 驗證用戶名格式（只允許中文、英文、數字和底線）
        if (!/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(name)) {
            throw createError({
                statusCode: 400,
                statusMessage: '用戶名只能包含中文、英文、數字和底線'
            });
        }

        // 檢查郵箱是否已被註冊
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            throw createError({
                statusCode: 400,
                statusMessage: '此郵箱已被註冊'
            });
        }

        // 檢查用戶名是否已被使用
        const existingUserByName = await User.findOne({ name });
        if (existingUserByName) {
            throw createError({
                statusCode: 400,
                statusMessage: '此用戶名已被使用'
            });
        }

        // 處理頭像上傳
        let avatarPath = null;
        if (avatar && avatarType) {
            const fileExtension = avatarType.split('/')[1];
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
            const filePath = `public/uploads/avatars/${fileName}`;
            
            // 確保目錄存在
            await useStorage().setItem(filePath, avatar);
            avatarPath = `/uploads/avatars/${fileName}`;
        }

        // 創建新用戶
        const newUser = new User({
            email,
            name,
            password, // 密碼會在 model 中自動加密
            avatar: avatarPath,
            roles: [{ type: 'visitor', isActive: true }],
            activeRole: 'visitor',
            createdAt: new Date(),
            lastLoginAt: new Date()
        });

        await newUser.save();

        // 設置 cookie
        setCookie(event, 'userId', newUser._id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 天
        });

        // 返回用戶資料（不包含密碼）
        return {
            success: true,
            message: '註冊成功',
            data: newUser.toJSON()
        };
    } catch (error) {
        console.error('註冊錯誤:', error);
        
        if (error instanceof H3Error) {
            throw createError({
                statusCode: error.statusCode,
                statusMessage: error.statusMessage
            });
        }
        
        throw createError({
            statusCode: 500,
            statusMessage: '註冊失敗'
        });
    }
}); 