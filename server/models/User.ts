import mongoose from 'mongoose';

// 定義角色類型
export enum UserRole {
    IDEATOR = 'ideator',      // 發想創意的人
    ENGINEER = 'engineer',    // 工程師
    VISITOR = 'visitor',      // 訪客
    ADMIN = 'admin',         // 管理員
    VENDOR = 'vendor'        // 廠商
}

// 定義用戶數據接口
export interface IUser {
    email: string;
    password?: string;  // 使密碼欄位可選
    name: string;
    avatar: string;
    description: string;
    roles: Array<{
        type: UserRole;
        isActive: boolean;
        subscription?: {
            plan: string;
            expiredAt?: Date;
        };
        skills?: string[];
        products?: mongoose.Types.ObjectId[];
        ideas?: mongoose.Types.ObjectId[];
        rating?: number;
        createdAt: Date;
    }>;
    activeRole: UserRole;
    isVerified: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// 定義角色資料結構
const roleSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: Object.values(UserRole),
        required: true 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    subscription: {
        plan: { type: String, default: 'free' },
        expiredAt: { type: Date }
    },
    // 角色特定資料
    skills: [String],                 // 工程師技能
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],  // 工程師/廠商作品
    ideas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }],        // 發想者想法
    rating: { type: Number, default: 0 },  // 工程師/廠商評分
    createdAt: { type: Date, default: Date.now }
});

// 使用者模型
const userSchema = new mongoose.Schema<IUser>({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    avatar: { 
        type: String,
        default: '/user/default-avatar.jpg'
    },
    description: { 
        type: String,
        default: '' 
    },
    roles: [roleSchema],  // 使用者可以有多個角色
    activeRole: {         // 當前啟用的角色
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.VISITOR
    },
    isVerified: {        // 郵箱驗證狀態
        type: Boolean,
        default: false
    },
    lastLoginAt: Date,
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// 更新時間中間件
userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// 檢查模型是否已經存在
let User: mongoose.Model<IUser>;

try {
    User = mongoose.model<IUser>('User');
} catch {
    User = mongoose.model<IUser>('User', userSchema);
}

export { User }; 