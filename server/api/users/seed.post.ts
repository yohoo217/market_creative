import { User, UserRole } from '../../models/User';
import { defineEventHandler, createError } from 'h3';
import bcrypt from 'bcryptjs';

const initialUsers = [
    {
        name: '系統管理員',
        email: 'admin@example.com',
        password: 'admin123',
        roles: [{
            type: UserRole.ADMIN,
            isActive: true,
            subscription: {
                plan: 'enterprise',
                expiredAt: new Date('2025-12-31')
            }
        }],
        activeRole: UserRole.ADMIN,
        avatar: '/avatars/admin.jpg',
        description: '系統管理員',
        isVerified: true
    },
    {
        name: '工程師小明',
        email: 'engineer1@example.com',
        password: 'engineer123',
        roles: [{
            type: UserRole.ENGINEER,
            isActive: true,
            subscription: {
                plan: 'pro',
                expiredAt: new Date('2024-12-31')
            },
            skills: ['3D列印', '機械設計', 'CAD/CAM'],
            rating: 4.5
        }],
        activeRole: UserRole.ENGINEER,
        avatar: '/avatars/engineer1.jpg',
        description: '專業機械工程師，專注於3D列印和機械設計',
        isVerified: true
    },
    {
        name: '工程師大華',
        email: 'engineer2@example.com',
        password: 'engineer123',
        roles: [{
            type: UserRole.ENGINEER,
            isActive: true,
            subscription: {
                plan: 'pro',
                expiredAt: new Date('2024-12-31')
            },
            skills: ['電子設計', 'PCB設計', '嵌入式系統'],
            rating: 4.8
        }],
        activeRole: UserRole.ENGINEER,
        avatar: '/avatars/engineer2.jpg',
        description: '資深電子工程師，專精於PCB設計和嵌入式系統開發',
        isVerified: true
    },
    {
        name: '創意發想者',
        email: 'ideator@example.com',
        password: 'ideator123',
        roles: [{
            type: UserRole.IDEATOR,
            isActive: true,
            subscription: {
                plan: 'basic',
                expiredAt: new Date('2024-12-31')
            }
        }],
        activeRole: UserRole.IDEATOR,
        avatar: '/avatars/ideator.jpg',
        description: '創意工作者，喜歡發想新點子',
        isVerified: true
    }
];

export default defineEventHandler(async (event) => {
    try {
        // 清空現有用戶
        await User.deleteMany({});

        // 創建新用戶
        const createdUsers = await Promise.all(
            initialUsers.map(async (userData) => {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                return User.create({
                    ...userData,
                    password: hashedPassword
                });
            })
        );

        return {
            success: true,
            message: '用戶數據導入成功',
            data: createdUsers.map(user => ({
                id: user._id,
                name: user.name,
                email: user.email,
                roles: user.roles,
                activeRole: user.activeRole,
                avatar: user.avatar,
                description: user.description,
                isVerified: user.isVerified
            }))
        };
    } catch (error) {
        console.error('導入用戶數據錯誤:', error);
        return createError({
            statusCode: 500,
            message: '導入用戶數據失敗'
        });
    }
}); 