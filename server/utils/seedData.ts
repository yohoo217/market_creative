import mongoose from 'mongoose';
import { User, UserRole } from '../models/User';
import { Product } from '../models/Product';
import { connectToMongoDB } from './mongodb';

const mockUsers = [
    {
        name: '創意王',
        email: 'creative@example.com',
        password: 'password123',
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
        name: '工程師小明',
        email: 'engineer1@example.com',
        password: 'password123',
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
        name: '廠商大華',
        email: 'vendor1@example.com',
        password: 'password123',
        avatar: '/user/default-avatar.jpg',
        description: '專業製造商',
        roles: [{
            type: UserRole.VENDOR,
            isActive: true,
            subscription: {
                plan: 'enterprise',
                expiredAt: new Date('2025-12-31')
            },
            rating: 4.7
        }],
        activeRole: UserRole.VENDOR,
        isVerified: true
    },
    {
        name: '系統管理員',
        email: 'admin@example.com',
        password: 'admin123',
        avatar: '/user/default-avatar.jpg',
        description: '系統管理員',
        roles: [{
            type: UserRole.ADMIN,
            isActive: true,
            subscription: {
                plan: 'enterprise',
                expiredAt: new Date('2025-12-31')
            }
        }],
        activeRole: UserRole.ADMIN,
        isVerified: true
    },
    {
        name: '設計師小美',
        email: 'designer@example.com',
        password: 'password123',
        avatar: '/user/default-avatar.jpg',
        description: '產品設計專家',
        roles: [{
            type: UserRole.IDEATOR,
            isActive: true,
            subscription: {
                plan: 'basic',
                expiredAt: new Date('2025-12-31')
            },
            rating: 4.5
        }],
        activeRole: UserRole.IDEATOR,
        isVerified: true
    },
    {
        name: '工程師阿強',
        email: 'engineer2@example.com',
        password: 'password123',
        avatar: '/user/default-avatar.jpg',
        description: '電子工程專家',
        roles: [{
            type: UserRole.ENGINEER,
            isActive: true,
            subscription: {
                plan: 'pro',
                expiredAt: new Date('2025-12-31')
            },
            skills: ['電路設計', 'IoT開發', '嵌入式系統'],
            rating: 4.6
        }],
        activeRole: UserRole.ENGINEER,
        isVerified: true
    },
    {
        name: '創新者小陳',
        email: 'innovator@example.com',
        password: 'password123',
        avatar: '/user/default-avatar.jpg',
        description: '創新科技愛好者',
        roles: [{
            type: UserRole.IDEATOR,
            isActive: true,
            subscription: {
                plan: 'basic',
                expiredAt: new Date('2025-12-31')
            },
            rating: 4.3
        }],
        activeRole: UserRole.IDEATOR,
        isVerified: true
    },
    {
        name: '機械工程師大衛',
        email: 'engineer3@example.com',
        password: 'password123',
        avatar: '/user/default-avatar.jpg',
        description: '機械自動化專家',
        roles: [{
            type: UserRole.ENGINEER,
            isActive: true,
            subscription: {
                plan: 'pro',
                expiredAt: new Date('2025-12-31')
            },
            skills: ['機械自動化', '工業4.0', 'PLC控制'],
            rating: 4.8
        }],
        activeRole: UserRole.ENGINEER,
        isVerified: true
    },
    {
        name: '製造商阿信',
        email: 'vendor2@example.com',
        password: 'password123',
        avatar: '/user/default-avatar.jpg',
        description: '精密製造專家',
        roles: [{
            type: UserRole.VENDOR,
            isActive: true,
            subscription: {
                plan: 'pro',
                expiredAt: new Date('2025-12-31')
            },
            rating: 4.6
        }],
        activeRole: UserRole.VENDOR,
        isVerified: true
    },
    {
        name: '創客小林',
        email: 'maker@example.com',
        password: 'password123',
        avatar: '/user/default-avatar.jpg',
        description: 'Maker空間創辦人',
        roles: [{
            type: UserRole.IDEATOR,
            isActive: true,
            subscription: {
                plan: 'pro',
                expiredAt: new Date('2025-12-31')
            },
            rating: 4.7
        }, {
            type: UserRole.ENGINEER,
            isActive: false,
            subscription: {
                plan: 'basic',
                expiredAt: new Date('2025-12-31')
            },
            skills: ['3D建模', '快速原型', '電子製作'],
            rating: 4.5
        }],
        activeRole: UserRole.IDEATOR,
        isVerified: true
    },
    {
        name: '智能製造專家',
        email: 'vendor3@example.com',
        password: 'password123',
        avatar: '/user/default-avatar.jpg',
        description: '智能製造解決方案提供商',
        roles: [{
            type: UserRole.VENDOR,
            isActive: true,
            subscription: {
                plan: 'enterprise',
                expiredAt: new Date('2025-12-31')
            },
            rating: 4.9
        }],
        activeRole: UserRole.VENDOR,
        isVerified: true
    },
    {
        name: '產品經理小周',
        email: 'product_manager@example.com',
        password: 'password123',
        avatar: '/user/default-avatar.jpg',
        description: '資深產品經理',
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
        name: '訪客測試者',
        email: 'visitor@example.com',
        password: 'password123',
        avatar: '/user/default-avatar.jpg',
        description: '產品體驗測試員',
        roles: [{
            type: UserRole.VISITOR,
            isActive: true,
            subscription: {
                plan: 'free',
                expiredAt: new Date('2025-12-31')
            }
        }],
        activeRole: UserRole.VISITOR,
        isVerified: true
    },
    {
        name: '多重角色用戶',
        email: 'multi_role@example.com',
        password: 'password123',
        avatar: '/user/default-avatar.jpg',
        description: '具有多重角色的用戶',
        roles: [{
            type: UserRole.IDEATOR,
            isActive: true,
            subscription: {
                plan: 'pro',
                expiredAt: new Date('2025-12-31')
            },
            rating: 4.6
        }, {
            type: UserRole.ENGINEER,
            isActive: true,
            subscription: {
                plan: 'pro',
                expiredAt: new Date('2025-12-31')
            },
            skills: ['產品設計', '機械工程', '電子工程'],
            rating: 4.7
        }, {
            type: UserRole.VENDOR,
            isActive: false,
            subscription: {
                plan: 'basic',
                expiredAt: new Date('2025-12-31')
            },
            rating: 4.5
        }],
        activeRole: UserRole.ENGINEER,
        isVerified: true
    }
];

const mockProducts = [
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
        status: 'fundraising',
        views: 1250,
        likes: 328,
        fundraisingGoal: 500000,
        currentFunding: 320000,
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
        status: 'fundraising',
        views: 980,
        likes: 245,
        fundraisingGoal: 800000,
        currentFunding: 450000,
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
        status: 'completed',
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
        status: 'fundraising',
        views: 2100,
        likes: 567,
        fundraisingGoal: 1000000,
        currentFunding: 780000,
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
        status: 'completed',
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
        status: 'completed',
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
        status: 'completed',
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
        status: 'completed',
        views: 890,
        likes: 234,
        userEmail: 'engineer3@example.com'
    },
    {
        name: '智能手環概念',
        description: '下一代智能手環概念設計，整合健康監測、運動追蹤和智能助理功能。',
        image: '/more_product/smart_band.png',
        category: '穿戴設備',
        dimensions: '預計尺寸 20x1.5cm',
        travelDistance: '預計續航時間 7天',
        images: [
            '/more_product/smart_band.png',
            '/picture/band1.png'
        ],
        additionalImages: [
            '/picture/band3.png'
        ],
        status: 'idea',
        views: 890,
        likes: 156
    },
    {
        name: '智能窗簾概念',
        description: '自動化智能窗簾設計概念，可根據日照、溫度自動調節，支援手機遠程控制。',
        image: '/more_product/smart_curtain.png',
        category: '智能家居',
        dimensions: '適用窗戶寬度 1-3m',
        travelDistance: '預計馬達壽命 5年',
        images: [
            '/more_product/smart_curtain.png',
            '/picture/curtain1.png'
        ],
        additionalImages: [
            '/picture/curtain2.png'
        ],
        status: 'idea',
        views: 760,
        likes: 234
    },
    {
        name: '智能寵物餵食器',
        description: '自動化寵物餵食器，支援定時投食、遠程控制、食量監測等功能。',
        price: 2999,
        image: '/more_product/smart_feeder.png',
        category: '寵物用品',
        dimensions: '容量 2L，尺寸 30x20x40cm',
        travelDistance: 'WiFi覆蓋範圍',
        images: [
            '/more_product/smart_feeder.png',
            '/picture/feeder1.png'
        ],
        additionalImages: [
            '/picture/feeder2.png'
        ],
        status: 'fundraising',
        views: 1200,
        likes: 345,
        fundraisingGoal: 300000,
        currentFunding: 180000
    },
    {
        name: '智能垃圾桶',
        description: '自動感應開蓋、壓縮垃圾、異味監測的智能垃圾桶，已完成開發。',
        price: 1999,
        image: '/more_product/smart_bin.png',
        category: '生活用品',
        dimensions: '容量 50L，高度 60cm',
        travelDistance: '感應距離 30cm',
        images: [
            '/more_product/smart_bin.png',
            '/picture/bin1.png'
        ],
        additionalImages: [
            '/picture/bin2.png'
        ],
        status: 'completed',
        views: 950,
        likes: 278,
        averageRating: 4.6
    },
    {
        name: '智能瑜伽墊概念',
        description: '內建壓力感測器的智能瑜伽墊概念，可分析使用者姿勢並提供即時回饋。',
        image: '/more_product/smart_yoga.png',
        category: '運動健身',
        dimensions: '尺寸 180x60cm，厚度 5mm',
        travelDistance: '預計電池續航 30天',
        images: [
            '/more_product/smart_yoga.png',
            '/picture/yoga1.png'
        ],
        additionalImages: [
            '/picture/yoga2.png'
        ],
        status: 'idea',
        views: 680,
        likes: 189
    }
];

export async function seedDatabase() {
    try {
        await connectToMongoDB();
        
        // 清空現有數據
        await Promise.all([
            User.deleteMany({}),
            Product.deleteMany({})
        ]);

        // 創建用戶
        const users = await User.insertMany(mockUsers);

        // 為產品添加用戶引用和評論
        const productsWithUsers = mockProducts.map((product, index) => ({
            ...product,
            user: users[index % users.length]._id,
            comments: [
                {
                    user: users[0]._id,
                    content: '非常實用的產品！設計精美，功能齊全，使用體驗很好。',
                    rating: 5,
                    date: new Date(),
                    likes: Math.floor(Math.random() * 50)
                },
                {
                    user: users[1]._id,
                    content: '整體來說不錯，但還有一些小細節可以改進。',
                    rating: 4,
                    date: new Date(Date.now() - 86400000), // 1天前
                    likes: Math.floor(Math.random() * 30)
                }
            ]
        }));

        // 插入產品數據
        await Product.insertMany(productsWithUsers);

        return {
            success: true,
            message: '數據填充成功'
        };
        
    } catch (error) {
        console.error('數據填充錯誤:', error);
        throw error;
    }
} 