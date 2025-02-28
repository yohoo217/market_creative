import type { UserRole } from '~/server/models/User';
import type { UserResponse } from '~/types/api';

interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload extends LoginPayload {
    name: string;
    role?: UserRole;
}

interface RoleUpdatePayload {
    userId: string;
    role: UserRole;
    action: 'add' | 'update' | 'remove';
}

interface RoleSwitchPayload {
    userId: string;
    role: UserRole;
}

export const useAuth = () => {
    const config = useRuntimeConfig();

    /**
     * 用戶登入
     * @param payload 登入資料
     */
    const login = async (payload: LoginPayload): Promise<UserResponse> => {
        try {
            const { data, error } = await useFetch<UserResponse>('/api/auth/login', {
                method: 'POST',
                body: payload
            });

            if (error.value) {
                // 從錯誤響應中提取具體的錯誤信息
                let errorMessage;
                if (error.value.data && typeof error.value.data === 'object') {
                    errorMessage = (error.value.data as any).statusMessage || 
                                 (error.value.data as any).message;
                }
                errorMessage = errorMessage || error.value.statusMessage || '登入失敗';
                throw new Error(errorMessage);
            }

            if (!data.value) {
                throw new Error('登入失敗');
            }

            return data.value;
        } catch (error) {
            console.error('登入失敗:', error);
            throw error;
        }
    };

    /**
     * 用戶註冊
     * @param formData 包含註冊資料和頭像的 FormData
     */
    const register = async (formData: FormData): Promise<UserResponse> => {
        try {
            const { data, error } = await useFetch<UserResponse>('/api/auth/register', {
                method: 'POST',
                body: formData
            });

            if (error.value) {
                // 從錯誤響應中提取具體的錯誤信息
                let errorMessage;
                if (error.value.data && typeof error.value.data === 'object') {
                    errorMessage = (error.value.data as any).statusMessage || 
                                 (error.value.data as any).message;
                }
                errorMessage = errorMessage || error.value.statusMessage || '註冊失敗';
                console.error('註冊錯誤:', errorMessage);
                throw new Error(errorMessage);
            }

            if (!data.value) {
                throw new Error('註冊失敗');
            }

            return data.value;
        } catch (error) {
            console.error('註冊失敗:', error);
            throw error;
        }
    };

    /**
     * 更新用戶角色
     * @param payload 角色更新資料
     */
    const updateRole = async (payload: RoleUpdatePayload): Promise<UserResponse> => {
        try {
            const { data, error } = await useFetch<UserResponse>('/api/users/roles', {
                method: 'POST',
                body: payload
            });

            if (error.value) {
                let errorMessage;
                if (error.value.data && typeof error.value.data === 'object') {
                    errorMessage = (error.value.data as any).statusMessage || 
                                 (error.value.data as any).message;
                }
                errorMessage = errorMessage || error.value.statusMessage || '更新角色失敗';
                throw new Error(errorMessage);
            }

            return data.value as UserResponse;
        } catch (error) {
            console.error('更新角色失敗:', error);
            throw error;
        }
    };

    /**
     * 切換當前角色
     * @param payload 角色切換資料
     */
    const switchRole = async (payload: RoleSwitchPayload): Promise<UserResponse> => {
        try {
            const { data, error } = await useFetch<UserResponse>('/api/users/switch-role', {
                method: 'POST',
                body: payload
            });

            if (error.value) {
                let errorMessage;
                if (error.value.data && typeof error.value.data === 'object') {
                    errorMessage = (error.value.data as any).statusMessage || 
                                 (error.value.data as any).message;
                }
                errorMessage = errorMessage || error.value.statusMessage || '切換角色失敗';
                throw new Error(errorMessage);
            }

            return data.value as UserResponse;
        } catch (error) {
            console.error('切換角色失敗:', error);
            throw error;
        }
    };

    /**
     * 用戶登出
     */
    const logout = async (): Promise<{ success: boolean; message: string }> => {
        try {
            const { data, error } = await useFetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (error.value) {
                console.error('登出API錯誤:', error.value);
                let errorMessage = '登出失敗';
                if (error.value.data && typeof error.value.data === 'object') {
                    errorMessage = (error.value.data as any).message || errorMessage;
                }
                throw new Error(errorMessage);
            }

            // 使用userStore清除本地狀態
            const userStore = useUserStore();
            userStore.currentUser = null;
            userStore.error = null;

            console.log('登出成功，本地狀態已清除');
            return { success: true, message: '登出成功' };
        } catch (error) {
            console.error('登出操作失敗:', error);
            throw error;
        }
    };

    return {
        login,
        register,
        updateRole,
        switchRole,
        logout
    };
}; 