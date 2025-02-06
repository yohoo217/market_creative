import mongoose from 'mongoose';
import { UserRole } from './User';

interface Comment {
    user: mongoose.Types.ObjectId;
    content: string;
    rating: number;
    date: Date;
    likes?: number;
}

const commentSchema = new mongoose.Schema<Comment>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    date: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 }
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
        ref: 'User' 
    },
    vendor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
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
    timestamps: true // 自動添加和更新 createdAt 和 updatedAt
});

// 添加索引以提高查詢效率
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ user: 1 });

// 檢查模型是否已經存在
export const Product = mongoose.models.Product || mongoose.model('Product', productSchema); 