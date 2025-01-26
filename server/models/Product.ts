import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator' },
    comments: [{
        user: String,
        content: String,
        rating: Number,
        date: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
    dimensions: { type: String, default: '基座 15 cm，支臂長度 45 cm，高度範圍 40 cm' },
    travelDistance: { type: String, default: '垂直 20 cm，水平 60 cm，傾斜 +85°~-15°，旋轉 360°' },
    images: [{ type: String }],
    additionalImages: [{ type: String }]
});

export const Product = mongoose.model('Product', productSchema); 