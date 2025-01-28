import { Product } from '../../models/Product';
import { User, UserRole } from '../../models/User';
import { defineEventHandler, createError } from 'h3';

const getRandomDimensions = (name: string) => {
    switch (name) {
        case 'JA024014-001 顯示器支架':
            return '基座直徑 20 cm，支臂長度 50 cm，高度範圍 35-50 cm';
        case '智能水瓶':
            return '容量 500ml，高度 25cm，直徑 7cm';
        case '智能背包':
            return '容量 30L，高度 45cm，寬度 30cm，深度 20cm';
        case '智能口罩':
            return '尺寸 14.5x9.5cm，重量 50g';
        default:
            return '尺寸待定';
    }
};

const getRandomTravelDistance = (name: string) => {
    switch (name) {
        case 'JA024014-001 顯示器支架':
            return '垂直 35 cm，水平 60 cm，傾斜 +85°~-15°，旋轉 360°';
        case '智能水瓶':
            return '溫度範圍 0-100°C，保溫時間 12 小時';
        case '智能背包':
            return 'USB充電距離 1m，防盜警報範圍 5m';
        case '智能口罩':
            return '過濾效率 99%，續航時間 8小時';
        default:
            return '規格待定';
    }
};

const getProductImages = (name: string) => {
    const baseUrl = `/products/${name.toLowerCase().replace(/\s+/g, '-')}`;
    return {
        images: [
            `${baseUrl}/main.jpg`,
            `${baseUrl}/angle1.jpg`,
            `${baseUrl}/angle2.jpg`,
            `${baseUrl}/detail1.jpg`,
            `${baseUrl}/detail2.jpg`,
            `${baseUrl}/detail3.jpg`
        ],
        additionalImages: [
            `${baseUrl}/usage1.jpg`,
            `${baseUrl}/usage2.jpg`,
            `${baseUrl}/package.jpg`
        ]
    };
};

// 創建測試用戶數據
const users = [
    {
        email: 'ideator1@example.com',
        password: 'password123',
        name: '創意王',
        avatar: '/user/default-avatar.jpg',
        description: '專業創意設計師',
        roles: [{
            type: UserRole.IDEATOR,
            isActive: true,
            subscription: {
                plan: 'pro',
                expiredAt: new Date('2025-12-31')
            },
            rating: 4.8
        }],
        activeRole: UserRole.IDEATOR,
        isVerified: true
    },
    {
        email: 'ideator2@example.com',
        password: 'password123',
        name: '設計大師',
        avatar: '/user/default-avatar.jpg',
        description: '產品設計專家',
        roles: [{
            type: UserRole.IDEATOR,
            isActive: true,
            subscription: {
                plan: 'pro',
                expiredAt: new Date('2025-12-31')
            },
            rating: 4.9
        }],
        activeRole: UserRole.IDEATOR,
        isVerified: true
    },
    {
        email: 'ideator3@example.com',
        password: 'password123',
        name: '創新者',
        avatar: '/user/default-avatar.jpg',
        description: '創新科技愛好者',
        roles: [{
            type: UserRole.IDEATOR,
            isActive: true,
            subscription: {
                plan: 'basic',
                expiredAt: new Date('2025-12-31')
            },
            rating: 4.7
        }],
        activeRole: UserRole.IDEATOR,
        isVerified: true
    },
    {
        email: 'engineer1@example.com',
        password: 'password123',
        name: '工程師小明',
        avatar: '/user/default-avatar.jpg',
        description: '資深工程師',
        roles: [{
            type: UserRole.ENGINEER,
            isActive: true,
            subscription: {
                plan: 'pro',
                expiredAt: new Date('2025-12-31')
            },
            skills: ['3D列印', '機械設計', 'CAD/CAM'],
            rating: 4.9
        }],
        activeRole: UserRole.ENGINEER,
        isVerified: true
    },
    {
        email: 'engineer2@example.com',
        password: 'password123',
        name: '工程達人',
        avatar: '/user/default-avatar.jpg',
        description: '機械工程專家',
        roles: [{
            type: UserRole.ENGINEER,
            isActive: true,
            subscription: {
                plan: 'pro',
                expiredAt: new Date('2025-12-31')
            },
            skills: ['機械加工', '工業設計', '自動化'],
            rating: 4.8
        }],
        activeRole: UserRole.ENGINEER,
        isVerified: true
    },
    {
        email: 'engineer3@example.com',
        password: 'password123',
        name: '科技創客',
        avatar: '/user/default-avatar.jpg',
        description: '電子工程專家',
        roles: [{
            type: UserRole.ENGINEER,
            isActive: true,
            subscription: {
                plan: 'basic',
                expiredAt: new Date('2025-12-31')
            },
            skills: ['電路設計', 'IoT開發', '嵌入式系統'],
            rating: 4.7
        }],
        activeRole: UserRole.ENGINEER,
        isVerified: true
    }
];

// 創建測試產品數據
const products = [
    {
        name: '智能水瓶',
        description: '具有溫度監測和水量追蹤功能的智能水瓶，採用高品質不鏽鋼材質，配備LED觸控螢幕，可即時顯示水溫與飲水量，透過藍牙連接手機APP，記錄每日飲水數據。',
        price: 1299,
        image: '/more_product/smart_bottle.png',
        category: '生活用品',
        dimensions: '容量 500ml，高度 25cm，直徑 7cm',
        travelDistance: '溫度範圍 0-100°C，保溫時間 12 小時',
        images: ['/more_product/smart_bottle.png', '/picture/1213.png', '/picture/1415.png'],
        additionalImages: ['/picture/1011.png', '/picture/1213.png'],
        status: 'published',
        views: 1250,
        likes: 328,
        userEmail: 'ideator1@example.com'
    },
    {
        name: '智能背包',
        description: '內建USB充電和防盜功能的智能背包，採用防水材質，具備指紋解鎖、GPS定位追蹤、筆記型電腦專屬減震倉等功能，適合商務人士和學生使用。',
        price: 2499,
        image: '/more_product/smart_backpack.png',
        category: '配件',
        dimensions: '容量 30L，高度 45cm，寬度 30cm，深度 20cm',
        travelDistance: 'USB充電距離 1m',
        images: ['/more_product/smart_backpack.png', '/picture/1213.png', '/picture/1415.png'],
        additionalImages: ['/picture/1011.png', '/picture/1213.png'],
        status: 'published',
        views: 980,
        likes: 245,
        userEmail: 'engineer1@example.com'
    },
    {
        name: '智能口罩',
        description: '多功能智能口罩，具有空氣質量檢測和過濾功能，支援呼吸監測，防護等級 N95，可通過 APP 查看即時數據。',
        price: 1599,
        image: '/more_product/smart_mask.png',
        category: '健康科技',
        dimensions: '尺寸 14.5x9.5cm，重量 50g',
        travelDistance: '過濾效率 99%，續航時間 8小時',
        images: ['/more_product/smart_mask.png', '/picture/1213.png', '/picture/1415.png'],
        additionalImages: ['/picture/1011.png', '/picture/1213.png'],
        status: 'published',
        views: 1580,
        likes: 463,
        userEmail: 'ideator1@example.com'
    },
    {
        name: '智能手錶',
        description: '多功能智能手錶，支援心率監測、運動追蹤、睡眠分析等功能，防水等級 IP68，電池續航時間長達 7 天。',
        price: 3999,
        image: '/more_product/smart_watch.png',
        category: '穿戴裝置',
        dimensions: '錶徑 44mm，厚度 10.7mm',
        travelDistance: '防水深度 50m',
        images: ['/more_product/smart_watch.png', '/picture/1213.png', '/picture/1415.png'],
        additionalImages: ['/picture/1011.png', '/picture/1213.png'],
        status: 'published',
        views: 2100,
        likes: 567,
        userEmail: 'ideator2@example.com'
    },
    {
        name: '智能音箱',
        description: '高品質智能音箱，支援語音控制、多房間音樂同步播放，內建智能助理，可控制智能家居設備。',
        price: 4999,
        image: '/more_product/smart_speaker.png',
        category: '音響設備',
        dimensions: '高度 20cm，直徑 15cm',
        travelDistance: '藍牙範圍 10m',
        images: ['/more_product/smart_speaker.png', '/picture/1213.png', '/picture/1415.png'],
        additionalImages: ['/picture/1011.png', '/picture/1213.png'],
        status: 'published',
        views: 1800,
        likes: 423,
        userEmail: 'engineer2@example.com'
    },
    {
        name: '智能門鎖',
        description: '高安全性智能門鎖，支援指紋解鎖、密碼解鎖、NFC卡片解鎖和手機藍牙解鎖，內建防盜警報系統。',
        price: 5999,
        image: '/more_product/smart_lock.png',
        category: '安全設備',
        dimensions: '面板尺寸 15x7cm',
        travelDistance: '電池續航 12 個月',
        images: ['/more_product/smart_lock.png', '/picture/1213.png', '/picture/1415.png'],
        additionalImages: ['/picture/1011.png', '/picture/1213.png'],
        status: 'published',
        views: 1650,
        likes: 389,
        userEmail: 'engineer2@example.com'
    },
    {
        name: '智能檯燈',
        description: '護眼智能檯燈，自動調節亮度和色溫，支援手機APP控制，內建定時功能和多種情境模式。',
        price: 1999,
        image: '/more_product/smart_lamp.png',
        category: '照明設備',
        dimensions: '高度 40cm，底座直徑 15cm',
        travelDistance: '照明範圍 1.2m',
        images: ['/more_product/smart_lamp.png', '/picture/1213.png', '/picture/1415.png'],
        additionalImages: ['/picture/1011.png', '/picture/1213.png'],
        status: 'published',
        views: 1420,
        likes: 356,
        userEmail: 'ideator3@example.com'
    },
    {
        name: '智能插座',
        description: '遠端控制智能插座，支援電量監測、定時開關、過載保護，可通過手機APP遠程控制家電設備。',
        price: 799,
        image: '/more_product/smart_plug.png',
        category: '智能家居',
        dimensions: '8.5x8.5x4.5cm',
        travelDistance: 'WiFi覆蓋範圍',
        images: ['/more_product/smart_plug.png', '/picture/1213.png', '/picture/1415.png'],
        additionalImages: ['/picture/1011.png', '/picture/1213.png'],
        status: 'published',
        views: 890,
        likes: 234,
        userEmail: 'engineer3@example.com'
    }
];

export default defineEventHandler(async (event) => {
    try {
        // 清空現有數據
        await Product.deleteMany({});
        await User.deleteMany({});

        // 創建用戶
        const createdUsers = await Promise.all(
            users.map(userData => {
                const user = new User(userData);
                return user.save();
            })
        );

        // 創建產品並關聯到用戶
        const createdProducts = await Promise.all(
            products.map(async productData => {
                const user = await User.findOne({ email: productData.userEmail });
                if (!user) {
                    throw new Error(`找不到用戶: ${productData.userEmail}`);
                }

                const { userEmail, ...productInfo } = productData;
                const product = new Product({
                    ...productInfo,
                    user: user._id,
                    comments: [
                        {
                            user: user._id,
                            content: '非常實用的產品！設計精美，功能齊全，使用體驗很好。',
                            rating: 5,
                            date: new Date(),
                        },
                        {
                            user: user._id,
                            content: '整體來說不錯，但還有一些小細節可以改進。',
                            rating: 4,
                            date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1天前
                        }
                    ]
                });
                return product.save();
            })
        );

        return {
            success: true,
            message: '數據填充成功',
            data: {
                users: createdUsers,
                products: createdProducts
            }
        };
    } catch (error) {
        console.error('填充數據錯誤:', error);
        throw createError({
            statusCode: 500,
            message: '填充數據失敗'
        });
    }
}); 