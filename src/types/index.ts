import type { Product } from './product.types'

export interface User {
  id: string
  email: string
  username?: string
  avatar_url?: string
  bio?: string
  subscription_plan?: 'free' | 'premium' | 'business'
  created_at: string
  updated_at: string
}

export type EditUserPayload = Partial<
  Omit<User, 'id' | 'updated_at' | 'created_at' | 'subscription_plan'>
>

export interface Favorite {
  id: string
  user_id: string
  product_id: string
  created_at: string
  products?: Product
}

export interface Promotion {
  id: string
  user_id: string
  product_id: string
  title: string
  description?: string
  budget: number
  start_date: string
  end_date: string
  status: 'active' | 'paused' | 'completed'
  clicks: number
  impressions: number
  created_at: string
  updated_at: string
  products?: Product
}

interface Session {
  auth_token: string
}

export interface AuthResponse {
  user: User
  session: Session
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  username?: string
}
