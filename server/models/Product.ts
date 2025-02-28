import mongoose from 'mongoose';
import { UserRole } from './User';

interface Comment {
    user: mongoose.Types.ObjectId;
    content: string;
    rating: number;
    date: Date;
    likes?: number;
}

interface Proposal {
    engineer: mongoose.Types.ObjectId;
    content: string;
    estimatedTime: string;
    estimatedCost: number;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
}

const commentSchema = new mongoose.Schema<Comment>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    date: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 }
});

const proposalSchema = new mongoose.Schema<Proposal>({
    engineer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    estimatedTime: { type: String, required: true },
    estimatedCost: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { 
        type: Number, 
        required: function(this: any) {
            return !['idea', 'in_progress'].includes(this.status);
        }
    },
    image: { type: String, required: true },
    category: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [commentSchema],
    createdAt: { type: Date, default: Date.now },
    dimensions: { type: String, required: true },
    travelDistance: { type: String, required: true },
    images: [{ type: String, required: true }],
    additionalImages: [{ type: String }],
    status: {
        type: String,
        enum: ['idea', 'in_progress', 'fundraising', 'completed'],
        default: 'idea',
        required: true
    },
    engineer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        default: null
    },
    proposals: [proposalSchema],
    engineerConfirmed: {
        type: Boolean,
        default: false
    },
    ideatorConfirmed: {
        type: Boolean,
        default: false
    },
    vendor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        default: null
    },
    fundraisingGoal: { 
        type: Number,
        required: function(this: any) {
            return this.status === 'fundraising';
        }
    },
    currentFunding: { 
        type: Number,
        default: 0,
        required: function(this: any) {
            return this.status === 'fundraising';
        }
    },
    averageRating: {
        type: Number,
        default: 0
    },
    views: { type: Number, default: 0, required: true },
    likes: { type: Number, default: 0, required: true }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// 虛擬屬性：計算平均評分
productSchema.virtual('calculatedAverageRating').get(function() {
    if (!this.comments || this.comments.length === 0) return 0;
    const sum = this.comments.reduce((acc, comment) => acc + comment.rating, 0);
    return (sum / this.comments.length).toFixed(1);
});

// 虛擬屬性：募資進度百分比
productSchema.virtual('fundingProgress').get(function() {
    if (!this.fundraisingGoal || this.fundraisingGoal === 0) return 0;
    return ((this.currentFunding / this.fundraisingGoal) * 100).toFixed(1);
});

// 虛擬屬性：是否可以提案
productSchema.virtual('canPropose').get(function() {
    return this.status === 'idea' && !this.engineer;
});

// 虛擬屬性：是否可以進入製作階段
productSchema.virtual('canStartProgress').get(function() {
    return this.status === 'idea' && 
           this.engineer && 
           this.engineerConfirmed && 
           this.ideatorConfirmed;
});

// 中間件：更新平均評分
productSchema.pre('save', async function(next) {
    if (this.isModified('comments')) {
        this.averageRating = parseFloat(this.get('calculatedAverageRating'));
    }

    // 當創意者和工程師都確認後，自動更新狀態為製作中
    if (this.isModified('engineerConfirmed') || this.isModified('ideatorConfirmed')) {
        if (this.engineerConfirmed && this.ideatorConfirmed) {
            this.status = 'in_progress';
        }
    }

    next();
});

// 錯誤處理中間件
productSchema.post('save', function(error: any, doc: any, next: any) {
    if (error.name === 'ValidationError') {
        next(new Error('產品資料驗證失敗：' + error.message));
    } else if (error.code === 11000) {
        next(new Error('產品資料重複'));
    } else {
        next(error);
    }
});

// 添加索引以提高查詢效率
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ user: 1 });
productSchema.index({ engineer: 1 });
productSchema.index({ 'comments.rating': 1 });
productSchema.index({ views: -1 });
productSchema.index({ likes: -1 });

// 檢查模型是否已經存在
export const Product = mongoose.models.Product || mongoose.model('Product', productSchema); 