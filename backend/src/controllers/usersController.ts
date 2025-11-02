import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user: data });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { username, bio, avatar_url } = req.body;

    const { data, error } = await supabase
      .from('users')
      .update({
        username,
        bio,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ user: data });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { subscription_plan } = req.body;

    if (!['free', 'premium', 'business'].includes(subscription_plan)) {
      res.status(400).json({ error: 'Invalid subscription plan' });
      return;
    }

    const { data, error } = await supabase
      .from('users')
      .update({
        subscription_plan,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ user: data });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
