import mongoose from 'mongoose';

const creatorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    description: { type: String },
    skills: [String],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    rating: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export const Creator = mongoose.model('Creator', creatorSchema); 