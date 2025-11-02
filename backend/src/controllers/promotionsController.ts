import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';

export const getPromotions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { data, error } = await supabase
      .from('promotions')
      .select('*, products(*)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ promotions: data || [] });
  } catch (error) {
    console.error('Get promotions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPromotionById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const { data, error } = await supabase
      .from('promotions')
      .select('*, products(*)')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      res.status(404).json({ error: 'Promotion not found' });
      return;
    }

    res.status(200).json({ promotion: data });
  } catch (error) {
    console.error('Get promotion by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createPromotion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { product_id, title, description, budget, start_date, end_date } = req.body;

    if (!product_id || !title || !budget || !start_date || !end_date) {
      res.status(400).json({
        error: 'Product ID, title, budget, start date, and end date are required'
      });
      return;
    }

    const { data, error } = await supabase
      .from('promotions')
      .insert({
        user_id: req.user.id,
        product_id,
        title,
        description,
        budget,
        start_date,
        end_date,
        status: 'active',
        clicks: 0,
        impressions: 0,
      })
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(201).json({ promotion: data });
  } catch (error) {
    console.error('Create promotion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePromotion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { title, description, budget, start_date, end_date, status } = req.body;

    const { data, error } = await supabase
      .from('promotions')
      .update({
        title,
        description,
        budget,
        start_date,
        end_date,
        status,
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

    res.status(200).json({ promotion: data });
  } catch (error) {
    console.error('Update promotion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePromotion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    console.error('Delete promotion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const trackImpression = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase.rpc('increment_impressions', {
      promotion_id: id,
    });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ message: 'Impression tracked' });
  } catch (error) {
    console.error('Track impression error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const trackClick = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase.rpc('increment_clicks', {
      promotion_id: id,
    });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ message: 'Click tracked' });
  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
