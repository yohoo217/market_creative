import { Creator } from '../models/Creator';

export default defineEventHandler(async (event) => {
    try {
        const creators = await Creator.find().populate('products');
        return creators;
    } catch (error) {
        console.error('獲取創作者列表錯誤:', error);
        return { error: '獲取創作者列表失敗' };
    }
}); 