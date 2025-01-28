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
            const { data } = await useFetch<UserResponse>('/api/auth/login', {
                method: 'POST',
                body: payload
            });
            return data.value as UserResponse;
        } catch (error) {
            console.error('登入失敗:', error);
            throw error;
        }
    };

    /**
     * 用戶註冊
     * @param payload 註冊資料
     */
    const register = async (payload: RegisterPayload): Promise<UserResponse> => {
        try {
            const { data } = await useFetch<UserResponse>('/api/auth/register', {
                method: 'POST',
                body: payload
            });
            return data.value as UserResponse;
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
            const { data } = await useFetch<UserResponse>('/api/users/roles', {
                method: 'POST',
                body: payload
            });
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
            const { data } = await useFetch<UserResponse>('/api/users/switch-role', {
                method: 'POST',
                body: payload
            });
            return data.value as UserResponse;
        } catch (error) {
            console.error('切換角色失敗:', error);
            throw error;
        }
    };

    return {
        login,
        register,
        updateRole,
        switchRole
    };
}; 