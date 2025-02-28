import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 定義角色類型
export enum UserRole {
    IDEATOR = 'ideator',      // 發想創意的人
    ENGINEER = 'engineer',    // 工程師
    VISITOR = 'visitor',      // 訪客
    ADMIN = 'admin',         // 管理員
    VENDOR = 'vendor'        // 廠商
}

// 定義用戶數據接口
export interface IUserRole {
    type: UserRole;
    isActive: boolean;
    subscription?: {
        plan: string;
        expiredAt: Date;
    };
    rating?: number;
    skills?: string[];
}

export interface IUser {
    name: string;
    email: string;
    password?: string;  // 使密碼欄位可選
    avatar?: string;
    description?: string;
    roles: IUserRole[];
    activeRole: UserRole;
    isVerified: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
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
    rating: { type: Number, default: 0 },  // 工程師/廠商評分
    createdAt: { type: Date, default: Date.now }
});

// 使用者模型
const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false // 默認不返回密碼
    },
    avatar: {
        type: String,
        default: '/default-avatar.png'
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
}, {
    timestamps: true
});

// 密碼加密中間件
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password!, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// 驗證密碼方法
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    try {
        if (!this.password) {
            console.log('密碼字段為空');
            return false;
        }
        
        // 直接比較密碼，不再重新查詢數據庫
        const match = await bcrypt.compare(candidatePassword, this.password);
        console.log(`密碼比較結果: ${match}, 輸入密碼: ${candidatePassword}, 存儲密碼哈希: ${this.password.substring(0, 10)}...`);
        return match;
    } catch (error) {
        console.error('comparePassword錯誤:', error);
        return false;
    }
};

// 移除密碼的 toJSON 方法
userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

// 檢查模型是否已經存在
let User: mongoose.Model<IUser>;

try {
    User = mongoose.model<IUser>('User');
} catch {
    User = mongoose.model<IUser>('User', userSchema);
}

export { User }; 