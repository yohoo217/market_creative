import { Creator } from '../models/Creator';
import { Product } from '../models/Product';
import { Idea } from '../models/Idea';
import { connectToMongoDB } from './mongodb';

const mockCreators = [
    {
        name: '王小明',
        avatar: '/user/download.jpg',
        description: '專業產品設計師，專注於智能家居產品開發',
        skills: ['產品設計', '3D建模', '原型製作'],
        rating: 4.8
    },
    {
        name: '李小華',
        avatar: '/user/download.jpg',
        description: '資深工業設計師，擅長電子產品設計',
        skills: ['工業設計', 'UI設計', '使用者研究'],
        rating: 4.9
    }
];

const mockProducts = [
    {
        name: 'JA024014-001 顯示器支架',
        description: '高品質鋁合金材質，可調節高度和角度的顯示器支架',
        price: 2499,
        image: 'picture/1E668206-82A3-4E55-8523-3D93D3FE014A.png',
        category: '辦公設備',
        comments: [
            {
                user: '張三',
                content: '支架非常穩固，安裝簡單！',
                rating: 5,
                date: new Date()
            }
        ],
        dimensions: '基座 15 cm，支臂長度 45 cm，高度範圍 40 cm',
        travelDistance: '垂直 20 cm，水平 60 cm，傾斜 +85°~-15°，旋轉 360°',
        images: [
            'picture/1E668206-82A3-4E55-8523-3D93D3FE014A.png',
            'picture/5CE25C84-4EE7-4275-ABB9-03137C1C312D.png',
            'picture/5F82A9AA-E874-4293-8AF7-F5B59896A39B.png',
            'picture/6B687B74-1CCA-422F-B589-7A19D72A50EE.png',
            'picture/1E668206-82A3-4E55-8523-3D93D3FE014A.png',
            'picture/944D99A0-CE05-4B61-92B1-3460C0860AAD.png'
        ],
        additionalImages: [
            'picture/123.png',
            'picture/456.png',
            'picture/1415.png'
        ]
    },
    {
        name: '智能水瓶',
        description: '具有溫度監測和水量追蹤功能的智能水瓶',
        price: 1299,
        image: '/more_product/smart_bottle.png',
        category: '生活用品',
        comments: [
            {
                user: '張三',
                content: '非常實用的產品！',
                rating: 5,
                date: new Date()
            }
        ],
        dimensions: '容量 500ml，高度 25cm，直徑 7cm',
        travelDistance: '溫度範圍 0-100°C',
        images: [
            '/more_product/smart_bottle.png',
            '/more_product/smart_bottle_2.png',
            '/more_product/smart_bottle_3.png'
        ],
        additionalImages: [
            '/picture/123.png',
            '/picture/456.png',
            '/picture/789.png'
        ]
    },
    {
        name: '智能背包',
        description: '內建USB充電和防盜功能的智能背包',
        price: 2499,
        image: '/more_product/smart_backpack.png',
        category: '配件',
        comments: [
            {
                user: '李四',
                content: '設計非常時尚！',
                rating: 4,
                date: new Date()
            }
        ],
        dimensions: '容量 30L，高度 45cm，寬度 30cm，深度 20cm',
        travelDistance: 'USB充電距離 1m',
        images: [
            '/more_product/smart_backpack.png',
            '/more_product/smart_backpack_2.png',
            '/more_product/smart_backpack_3.png'
        ],
        additionalImages: [
            '/picture/123.png',
            '/picture/456.png',
            '/picture/789.png'
        ]
    },
    {
        name: '智能口罩',
        description: '具有空氣質量檢測和過濾功能的智能口罩',
        price: 899,
        image: '/more_product/smart_mask.png',
        category: '健康科技',
        comments: [
            {
                user: '王五',
                content: '呼吸更輕鬆了！',
                rating: 5,
                date: new Date()
            }
        ],
        dimensions: '尺寸 14.5x9.5cm，重量 50g',
        travelDistance: '過濾效率 99%，續航時間 8小時',
        images: [
            '/more_product/smart_mask.png',
            '/more_product/smart_mask_2.png',
            '/more_product/smart_mask_3.png'
        ],
        additionalImages: [
            '/picture/123.png',
            '/picture/456.png',
            '/picture/789.png'
        ]
    }
];

const mockIdeas = [
    {
        title: '太陽能充電背包',
        description: '結合太陽能板的環保背包設計',
        image: '/picture/789.png',
        category: '環保科技',
        likes: 156,
        tags: ['環保', '創新', '太陽能']
    },
    {
        title: '智能寵物餵食器',
        description: '可遠程控制的自動寵物餵食系統',
        image: '/picture/789.png',
        category: '寵物用品',
        likes: 89,
        tags: ['寵物', 'IoT', '智能家居']
    }
];

export async function seedDatabase() {
    try {
        await connectToMongoDB();
        
        // 清空現有數據
        await Promise.all([
            Creator.deleteMany({}),
            Product.deleteMany({}),
            Idea.deleteMany({})
        ]);

        // 插入創作者數據
        const creators = await Creator.insertMany(mockCreators);

        // 為產品添加創作者引用
        const productsWithCreators = mockProducts.map((product, index) => ({
            ...product,
            creator: creators[index % creators.length]._id
        }));

        // 插入產品數據
        const products = await Product.insertMany(productsWithCreators);

        // 更新創作者的產品列表
        await Promise.all(
            creators.map((creator, index) => 
                Creator.findByIdAndUpdate(
                    creator._id,
                    { $push: { products: products[index % products.length]._id } }
                )
            )
        );

        // 為想法添加創作者引用
        const ideasWithCreators = mockIdeas.map((idea, index) => ({
            ...idea,
            creator: creators[index % creators.length]._id
        }));

        // 插入想法數據
        await Idea.insertMany(ideasWithCreators);

        console.log('數據填充完成！');
        
    } catch (error) {
        console.error('數據填充錯誤:', error);
    }
} 