import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    category: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator' },
    likes: { type: Number, default: 0 },
    tags: [String],
    createdAt: { type: Date, default: Date.now }
});

export const Idea = mongoose.model('Idea', ideaSchema); 