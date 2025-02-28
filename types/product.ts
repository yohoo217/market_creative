export interface Comment {
  id: string;
  content: string;
  rating: number;
  date: Date;
  likes?: number;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
}

export type ProductStatus = 'idea' | 'in_progress' | 'fundraising' | 'completed';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  status: ProductStatus;
  dimensions: string;
  travelDistance: string;
  images: string[];
  additionalImages?: string[];
  comments: Comment[];
  views: number;
  likes: number;
  averageRating: number;
  fundraisingGoal?: number;
  currentFunding?: number;
  fundingProgress?: number;
  engineer?: {
    id: string;
    name: string;
    avatar: string;
  };
  vendor?: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductResponse {
  success: boolean;
  data: Product | Product[];
  message?: string;
} 