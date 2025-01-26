import { Product } from '../models/Product';

export default defineEventHandler(async (event) => {
    try {
        // 獲取所有產品
        const products = await Product.find()
            .populate('creator')
            .exec();
        
        // 計算平均評分並排序
        const sortedProducts = products
            .map(product => {
                const avgRating = product.comments?.reduce((acc, comment) => acc + (comment.rating || 0), 0) / (product.comments?.length || 1);
                return { product, avgRating };
            })
            .sort((a, b) => b.avgRating - a.avgRating)
            .slice(0, 6)  // 只取前6個熱門作品
            .map(({ product }) => product);

        // 將產品數據轉換為作品格式
        const works = sortedProducts.map(product => {
            const creator = product.creator as any; // 臨時解決類型問題
            return {
                id: product._id.toString(),
                title: product.name,
                description: product.description,
                image: product.image,
                creatorId: creator?._id?.toString(),
                creatorName: creator?.name || '未知創作者',
                category: product.category,
                price: product.price,
                rating: product.comments?.reduce((acc, comment) => acc + (comment.rating || 0), 0) / (product.comments?.length || 1),
                likes: 0,  // 暫時設為0，後續可以添加點讚功能
                views: 0,  // 暫時設為0，後續可以添加瀏覽統計
                createdAt: product.createdAt
            };
        });

        return {
            success: true,
            data: works
        };
    } catch (error) {
        console.error('獲取作品列表錯誤:', error);
        return createError({
            statusCode: 500,
            message: '獲取作品列表失敗'
        });
    }
}); 