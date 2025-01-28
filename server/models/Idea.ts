import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    category: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tags: [{ type: String }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
        required: true
    },
    views: { type: Number, default: 0, required: true },
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        date: { type: Date, default: Date.now }
    }],
    attachments: [{
        name: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, required: true }
    }]
}, {
    timestamps: true // 自動添加和更新 createdAt 和 updatedAt
});

// 添加索引以提高查詢效率
ideaSchema.index({ title: 1 });
ideaSchema.index({ category: 1 });
ideaSchema.index({ status: 1 });
ideaSchema.index({ user: 1 });
ideaSchema.index({ tags: 1 });

// 檢查模型是否已經存在
export const Idea = mongoose.models.Idea || mongoose.model('Idea', ideaSchema); 