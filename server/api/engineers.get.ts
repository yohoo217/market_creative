import { Creator } from '../models/Creator';

export default defineEventHandler(async (event) => {
    try {
        // 獲取具有特定技能的創作者
        const creators = await Creator.find({
            skills: { 
                $in: ['產品設計', '工業設計', '3D建模', '原型製作', 'UI設計'] 
            }
        }).populate('products');
        
        // 將創作者數據轉換為工程師格式
        const engineers = creators.map(creator => ({
            id: creator._id.toString(),
            name: creator.name,
            avatar: creator.avatar || '/user/default-avatar.png',
            specialties: creator.skills || [],
            experience: Math.floor(Math.random() * 10) + 1, // 模擬 1-10 年經驗
            rating: creator.rating || 4.5,
            hourlyRate: Math.floor(Math.random() * 1000) + 500, // 模擬 500-1500 時薪
            completedProjects: creator.products?.length || 0,
            availability: Math.random() > 0.5 // 隨機設置可用性
        }));

        return {
            success: true,
            data: engineers
        };
    } catch (error) {
        console.error('獲取工程師列表錯誤:', error);
        return {
            success: false,
            message: '獲取工程師列表失敗'
        };
    }
}); 