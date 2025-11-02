import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSetAtom } from 'jotai';
import { api } from '@/config/axios';
import { userAtom, isAuthenticatedAtom } from '@/store/atoms';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useToast } from '@/components/Toast';
import styles from './login.module.scss';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useSetAtom(userAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { session, user } = response.data;

      if (session?.access_token) {
        localStorage.setItem('auth_token', session.access_token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
        toast('Login successful!', undefined, 'success');
        navigate({ to: '/' });
      }
    } catch (error: any) {
      toast(
        'Login failed',
        error.response?.data?.error || 'Invalid credentials',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to your Kubito account</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />

          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />

          <Button type="submit" isLoading={isLoading} size="lg" className={styles.submitButton}>
            Sign In
          </Button>
        </form>

        <p className={styles.footer}>
          Don't have an account?{' '}
          <button
            type="button"
            className={styles.link}
            onClick={() => navigate({ to: '/register' })}
          >
            Sign up
          </button>
        </p>
      </motion.div>
    </div>
  );
}
