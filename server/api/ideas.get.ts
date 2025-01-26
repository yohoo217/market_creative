import { Idea } from '../models/Idea';

export default defineEventHandler(async (event) => {
    try {
        const ideas = await Idea.find().populate('creator');
        return ideas;
    } catch (error) {
        console.error('獲取想法列表錯誤:', error);
        return { error: '獲取想法列表失敗' };
    }
}); 