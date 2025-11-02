import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';

export const getFavorites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('*, products(*, users(username, avatar_url))')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ favorites: data || [] });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { product_id } = req.body;

    if (!product_id) {
      res.status(400).json({ error: 'Product ID is required' });
      return;
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('product_id', product_id)
      .single();

    if (existing) {
      res.status(400).json({ error: 'Product already favorited' });
      return;
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: req.user.id,
        product_id,
      })
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(201).json({ favorite: data });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const removeFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { productId } = req.params;

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', req.user.id)
      .eq('product_id', productId);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const checkFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { productId } = req.params;

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('product_id', productId)
      .single();

    if (error && error.code !== 'PGRST116') {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ isFavorited: !!data });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
