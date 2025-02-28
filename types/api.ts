import type { IUser } from '~/server/models/User'
import { UserRole } from '~/server/models/User'

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
}

export interface UserResponse {
    success: boolean;
    message: string;
    data: {
        _id: string;
        name: string;
        email: string;
        avatar: string;
        roles: Array<{
            type: UserRole;
            isActive: boolean;
            subscription?: {
                plan: string;
                expiredAt: Date;
            };
            rating?: number;
            skills?: string[];
        }>;
        activeRole: UserRole;
        description?: string;
    };
}

export interface ImageUploadResponse {
    success: boolean;
    message: string;
    data: {
        url: string;
    };
} 