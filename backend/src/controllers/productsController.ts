import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';

export const getProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, category, limit = 20, offset = 0 } = req.query;

    let query = supabase
      .from('products')
      .select('*, users(username, avatar_url)')
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ products: data || [] });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('products')
      .select('*, users(username, avatar_url)')
      .eq('id', id)
      .single();

    if (error) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.status(200).json({ product: data });
  } catch (error) {
    console.error('Get product by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { title, description, image_url, category, tags, store_url, price } = req.body;

    if (!title || !image_url) {
      res.status(400).json({ error: 'Title and image URL are required' });
      return;
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        user_id: req.user.id,
        title,
        description,
        image_url,
        category,
        tags,
        store_url,
        price,
      })
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(201).json({ product: data });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { title, description, image_url, category, tags, store_url, price } = req.body;

    const { data, error } = await supabase
      .from('products')
      .update({
        title,
        description,
        image_url,
        category,
        tags,
        store_url,
        price,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ product: data });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ products: data || [] });
  } catch (error) {
    console.error('Get user products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
