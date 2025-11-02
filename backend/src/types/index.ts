export interface User {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  subscription_plan?: 'free' | 'premium' | 'business';
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  image_url: string;
  category?: string;
  tags?: string[];
  store_url?: string;
  price?: number;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface Promotion {
  id: string;
  user_id: string;
  product_id: string;
  title: string;
  description?: string;
  budget: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'paused' | 'completed';
  clicks: number;
  impressions: number;
  created_at: string;
  updated_at: string;
}

export interface AuthRequest {
  email: string;
  password: string;
  username?: string;
}
