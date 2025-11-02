-- Kubito Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'premium', 'business')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  tags TEXT[],
  store_url TEXT,
  price DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  budget DECIMAL(10, 2) NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_promotions_user_id ON promotions(user_id);
CREATE INDEX IF NOT EXISTS idx_promotions_status ON promotions(status);

-- Functions for tracking promotions
CREATE OR REPLACE FUNCTION increment_impressions(promotion_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE promotions
  SET impressions = impressions + 1
  WHERE id = promotion_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_clicks(promotion_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE promotions
  SET clicks = clicks + 1
  WHERE id = promotion_id;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies

-- Users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Users can create products" ON products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products" ON products
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own products" ON products
  FOR DELETE USING (auth.uid() = user_id);

-- Favorites table
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Promotions table
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own promotions" ON promotions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create promotions" ON promotions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own promotions" ON promotions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own promotions" ON promotions
  FOR DELETE USING (auth.uid() = user_id);
