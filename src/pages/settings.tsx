import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/config/axios';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useToast } from '@/components/Toast';
import styles from './settings.module.scss';

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;

  const { data: userData } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    },
  });

  const user = userData?.user;

  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put('/users/profile', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast('Profile updated successfully', undefined, 'success');
    },
    onError: () => {
      toast('Failed to update profile', undefined, 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ username, bio, avatar_url: avatarUrl });
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your account settings</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />

          <div className={styles.field}>
            <label className={styles.label}>Bio</label>
            <textarea
              className={styles.textarea}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </div>

          <Input
            label="Avatar URL"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            fullWidth
          />

          <Button
            type="submit"
            size="lg"
            isLoading={updateMutation.isPending}
            className={styles.saveButton}
          >
            Save Changes
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
