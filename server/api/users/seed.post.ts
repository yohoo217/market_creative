import { User, UserRole } from '../../models/User';
import { defineEventHandler, createError } from 'h3';
import bcrypt from 'bcryptjs';

const initialUsers = [
    {
        name: '系統管理員',
        email: 'admin@example.com',
        password: 'Admin123!',
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
        password: 'Engineer123!',
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
        password: 'Engineer456!',
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
        password: 'Ideator123!',
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
    },
    {
        name: '科技製造廠商',
        email: 'vendor@example.com',
        password: 'Vendor123!',
        roles: [{
            type: UserRole.VENDOR,
            isActive: true,
            subscription: {
                plan: 'business',
                expiredAt: new Date('2024-12-31')
            },
            rating: 4.7
        }],
        activeRole: UserRole.VENDOR,
        avatar: '/avatars/vendor.jpg',
        description: '專業科技製造商，提供高品質的產品生產服務',
        isVerified: true
    },
    {
        name: '多角色用戶',
        email: 'multi@example.com',
        password: 'Multi123!',
        roles: [
            {
                type: UserRole.IDEATOR,
                isActive: true,
                subscription: {
                    plan: 'basic',
                    expiredAt: new Date('2024-12-31')
                }
            },
            {
                type: UserRole.VISITOR,
                isActive: true
            }
        ],
        activeRole: UserRole.IDEATOR,
        avatar: '/avatars/multi.jpg',
        description: '既是創意發想者，也是普通訪客',
        isVerified: true
    }
];

export default defineEventHandler(async (event) => {
    try {
        // 清空現有用戶
        await User.deleteMany({});
        console.log('已刪除所有現有用戶');

        // 使用固定的鹽值確保密碼一致性
        const salt = await bcrypt.genSalt(10);
        
        // 創建新用戶
        const createdUsers = await Promise.all(
            initialUsers.map(async (userData) => {
                // 直接使用bcrypt.hash而不是使用模型的pre-save中間件
                const hashedPassword = await bcrypt.hash(userData.password, salt);
                console.log(`用戶 ${userData.email} 密碼: ${userData.password} -> 哈希: ${hashedPassword}`);
                
                // 創建一個普通對象，而不是通過模式
                const userObject = {
                    ...userData,
                    password: hashedPassword
                };
                
                // 創建用戶
                return User.create(userObject);
            })
        );

        console.log(`成功創建 ${createdUsers.length} 個用戶`);

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