/**
 * 路由設置 Composable
 * 提供可重用的路由相關功能
 */

import { computed, ref } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';

// 模擬 useAuth composable
interface User {
  roles: Array<{
    type: string;
    isActive: boolean;
  }>;
}

// 當實際實現 useAuth 時可以移除這個模擬功能
const useAuth = () => {
  const currentUser = ref<User | null>(null);
  
  return {
    currentUser
  };
};

export interface Route {
  name: string;
  path: string;
  title: string;
  icon?: string;
  children?: Route[];
  permissions?: string[];
  meta?: Record<string, any>;
}

type RouteFactory = (params?: Record<string, string | number>) => string;

/**
 * 創建產品路由工廠
 */
export const productRoutes = {
  list: () => '/products',
  detail: (params: { id: string | number }) => `/products/${params.id}`,
  create: () => '/products/create',
  edit: (params: { id: string | number }) => `/products/${params.id}/edit`,
  
  // 特定類型的產品路由
  ideas: () => '/ideas',
  fundraising: () => '/fundraising',
  completed: () => '/products/completed',
  
  // 產品操作路由
  comment: (params: { id: string | number }) => `/products/${params.id}/comments`,
  share: (params: { id: string | number }) => `/products/${params.id}/share`,
};

/**
 * 創建用戶路由工廠
 */
export const userRoutes = {
  profile: (params?: { id?: string | number }) => 
    params?.id ? `/profile/${params.id}` : '/profile',
  settings: () => '/profile/settings',
  changePassword: () => '/profile/change-password',
  orders: () => '/profile/orders',
  favorites: () => '/profile/favorites',
  messages: () => '/messages',
};

/**
 * 創建管理員路由工廠
 */
export const adminRoutes = {
  dashboard: () => '/admin/dashboard',
  users: () => '/admin/users',
  products: () => '/admin/products',
  orders: () => '/admin/orders',
  settings: () => '/admin/settings',
};

/**
 * 創建供應商路由工廠
 */
export const vendorRoutes = {
  dashboard: () => '/vendor/dashboard',
  products: () => '/vendor/products',
  orders: () => '/vendor/orders',
  profile: () => '/vendor/profile',
};

/**
 * 主要路由配置
 */
export const mainRoutes: Route[] = [
  {
    name: 'home',
    path: '/',
    title: '首頁',
    icon: 'pi pi-home'
  },
  {
    name: 'products',
    path: '/products',
    title: '所有產品',
    icon: 'pi pi-shopping-bag',
    children: [
      {
        name: 'ideas',
        path: '/ideas',
        title: '創意集',
        icon: 'pi pi-lightbulb'
      },
      {
        name: 'fundraising',
        path: '/fundraising',
        title: '募資項目',
        icon: 'pi pi-wallet'
      },
      {
        name: 'completed',
        path: '/products/completed',
        title: '已完成項目',
        icon: 'pi pi-check-circle'
      }
    ]
  },
  {
    name: 'profile',
    path: '/profile',
    title: '個人檔案',
    icon: 'pi pi-user'
  },
  {
    name: 'messages',
    path: '/messages',
    title: '訊息中心',
    icon: 'pi pi-envelope'
  },
  {
    name: 'about',
    path: '/about',
    title: '關於我們',
    icon: 'pi pi-info-circle'
  }
];

/**
 * 管理員路由配置
 */
export const adminRoutesConfig: Route[] = [
  {
    name: 'admin-dashboard',
    path: '/admin/dashboard',
    title: '管理儀表板',
    icon: 'pi pi-chart-bar',
    permissions: ['admin']
  },
  {
    name: 'admin-users',
    path: '/admin/users',
    title: '用戶管理',
    icon: 'pi pi-users',
    permissions: ['admin']
  },
  {
    name: 'admin-products',
    path: '/admin/products',
    title: '產品管理',
    icon: 'pi pi-shopping-cart',
    permissions: ['admin']
  },
  {
    name: 'admin-orders',
    path: '/admin/orders',
    title: '訂單管理',
    icon: 'pi pi-list',
    permissions: ['admin']
  },
  {
    name: 'admin-settings',
    path: '/admin/settings',
    title: '系統設置',
    icon: 'pi pi-cog',
    permissions: ['admin']
  }
];

/**
 * 供應商路由配置
 */
export const vendorRoutesConfig: Route[] = [
  {
    name: 'vendor-dashboard',
    path: '/vendor/dashboard',
    title: '供應商儀表板',
    icon: 'pi pi-chart-bar',
    permissions: ['vendor']
  },
  {
    name: 'vendor-products',
    path: '/vendor/products',
    title: '我的產品',
    icon: 'pi pi-shopping-bag',
    permissions: ['vendor']
  },
  {
    name: 'vendor-orders',
    path: '/vendor/orders',
    title: '訂單管理',
    icon: 'pi pi-list',
    permissions: ['vendor']
  },
  {
    name: 'vendor-profile',
    path: '/vendor/profile',
    title: '商店資料',
    icon: 'pi pi-user',
    permissions: ['vendor']
  }
];

/**
 * 使用路由功能的 composable
 */
export function useRoutes() {
  // 獲取當前用戶
  const { currentUser } = useAuth();
  
  // 基於用戶角色過濾的路由
  const filteredRoutes = computed(() => {
    // 如果沒有登錄，只返回主要路由
    if (!currentUser.value) {
      return mainRoutes;
    }
    
    // 取得用戶角色
    const roles = currentUser.value.roles.map((r: { type: string }) => r.type);
    
    let routes = [...mainRoutes]; 
    
    // 如果是管理員，添加管理員路由
    if (roles.includes('admin')) {
      routes = [...routes, ...adminRoutesConfig];
    }
    
    // 如果是供應商，添加供應商路由
    if (roles.includes('vendor')) {
      routes = [...routes, ...vendorRoutesConfig];
    }
    
    return routes;
  });
  
  // 檢查路由是否匹配當前路徑
  const isActiveRoute = (route: Route, currentRoute: RouteLocationNormalized): boolean => {
    // 精確匹配
    if (route.path === currentRoute.path) {
      return true;
    }
    
    // 子路由匹配
    if (route.children && route.children.some(child => isActiveRoute(child, currentRoute))) {
      return true;
    }
    
    // 前綴匹配 (例如 /products 與 /products/123 匹配)
    if (route.path !== '/' && currentRoute.path.startsWith(route.path)) {
      // 確保是路徑分隔符或結束
      const nextChar = currentRoute.path.charAt(route.path.length);
      if (nextChar === '/' || nextChar === '') {
        return true;
      }
    }
    
    return false;
  };
  
  // 獲取麵包屑導航
  const getBreadcrumbs = (currentRoute: RouteLocationNormalized): Route[] => {
    const breadcrumbs: Route[] = [];
    
    // 總是添加首頁
    const home = mainRoutes.find(r => r.path === '/');
    if (home) {
      breadcrumbs.push(home);
    }
    
    // 如果當前就是首頁，直接返回
    if (currentRoute.path === '/') {
      return breadcrumbs;
    }
    
    // 查找所有路由
    const allRoutes = [...mainRoutes, ...adminRoutesConfig, ...vendorRoutesConfig];
    
    // 拆分當前路徑
    const pathSegments = currentRoute.path.split('/').filter(Boolean);
    let currentPath = '';
    
    // 遍歷路徑段，構建麵包屑
    for (let i = 0; i < pathSegments.length; i++) {
      currentPath += '/' + pathSegments[i];
      
      // 查找匹配的路由
      const matchedRoute = allRoutes.find(r => r.path === currentPath);
      if (matchedRoute) {
        breadcrumbs.push(matchedRoute);
      } else if (i === pathSegments.length - 1) {
        // 對於最後一級，檢查是否是詳情頁、編輯頁等
        const parentPath = pathSegments.slice(0, pathSegments.length - 1).join('/');
        const parentRoute = allRoutes.find(r => r.path === `/${parentPath}`);
        
        if (parentRoute) {
          // 根據當前路由的 meta 或名稱創建一個臨時路由對象
          const current = {
            name: currentRoute.name as string,
            path: currentRoute.path,
            title: currentRoute.meta.title as string || '詳情',
            icon: parentRoute.icon
          };
          
          breadcrumbs.push(current);
        }
      }
    }
    
    return breadcrumbs;
  };
  
  return {
    // 路由定義
    routes: {
      main: mainRoutes,
      adminConfig: adminRoutesConfig,
      vendorConfig: vendorRoutesConfig,
      product: productRoutes,
      user: userRoutes,
      adminFactory: adminRoutes,
      vendorFactory: vendorRoutes
    },
    
    // 計算和輔助方法
    filteredRoutes,
    isActiveRoute,
    getBreadcrumbs
  };
}

export default useRoutes; 