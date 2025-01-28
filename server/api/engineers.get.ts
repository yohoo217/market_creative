import { User, UserRole } from '../models/User';
import { defineEventHandler, createError } from 'h3';
import { Document, Types } from 'mongoose';

interface IEngineerRole {
    type: UserRole;
    skills: string[];
    rating: number;
    products: string[];
    subscription: {
        plan: string;
        expiredAt?: Date;
    };
    isActive: boolean;
}

export default defineEventHandler(async (event) => {
    try {
        const engineers = await User.find({
            activeRole: UserRole.ENGINEER,
            'roles.type': UserRole.ENGINEER,
            'roles.isActive': true
        });

        return engineers.map((engineer) => {
            const engineerRole = engineer.roles.find(role => role.type === UserRole.ENGINEER);
            return {
                id: engineer._id.toString(),
                name: engineer.name,
                avatar: engineer.avatar || '/user/default-avatar.png',
                specialties: engineerRole?.skills || [],
                description: engineer.description || '',
                rating: engineerRole?.rating || 1,
                isVerified: engineer.isVerified,
                completedProjects: engineerRole?.products?.length || 0,
                subscription: engineerRole?.subscription || { plan: 'free' }
            };
        });
    } catch (error) {
        console.error('獲取工程師列表錯誤:', error);
        return createError({
            statusCode: 500,
            message: '獲取工程師列表失敗'
        });
    }
}); 