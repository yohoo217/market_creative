export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  dimensions: string;
  travelDistance: string;
  images: string[];
  additionalImages: string[];
  comments: {
    _id: string;
    content: string;
    rating: number;
    date: string;
  }[];
}

export interface ProductResponse {
  success: boolean;
  data: Product[];
  message?: string;
} 