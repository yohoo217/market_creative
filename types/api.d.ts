import type { IUser } from '~/server/models/User';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
}

export interface UserWithId extends Partial<IUser> {
    _id: string;
}

export interface UserResponse extends ApiResponse<UserWithId> {
    data: UserWithId;
}

export interface UsersResponse extends ApiResponse<UserWithId[]> {
    data: UserWithId[];
}

export interface ErrorResponse {
    statusCode: number;
    statusMessage?: string;
    message: string;
} 