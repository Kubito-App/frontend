export interface Product {
  id: string
  user_id: string
  title: string
  description?: string
  image_url: string
  category?: string
  tags?: string[]
  store_url?: string
  price?: number
  created_at: string
  updated_at: string
  is_favorite: boolean
  users?: {
    username?: string
    avatar_url?: string
  }
}

export interface ProductPayload {
  title: string
  description?: string
  image_url: string
  category?: string
  tags?: string[]
  store_url?: string
  price?: number
}
