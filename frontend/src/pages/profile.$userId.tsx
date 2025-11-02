import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/config/axios';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/Button';
import styles from './profile.module.scss';

export const Route = createFileRoute('/profile/$userId')({
  component: ProfilePage,
});

function ProfilePage() {
  const { userId } = Route.useParams();
  const currentUserId = JSON.parse(localStorage.getItem('user') || '{}')?.id;
  const isOwnProfile = userId === currentUserId;

  const { data: userData } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    },
  });

  const { data: productsData } = useQuery({
    queryKey: ['userProducts', userId],
    queryFn: async () => {
      const response = await api.get(`/products/user/${userId}`);
      return response.data;
    },
  });

  const user = userData?.user;
  const products = productsData?.products || [];

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.avatarSection}>
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={user.username} className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
        </div>

        <div className={styles.info}>
          <h1 className={styles.username}>{user?.username || 'User'}</h1>
          {user?.bio && <p className={styles.bio}>{user.bio}</p>}
          <div className={styles.stats}>
            <span>{products.length} products</span>
            {user?.subscription_plan && (
              <span className={styles.badge}>{user.subscription_plan}</span>
            )}
          </div>
        </div>

        {isOwnProfile && (
          <Button variant="outline" onClick={() => window.location.href = '/settings'}>
            Edit Profile
          </Button>
        )}
      </motion.div>

      <div className={styles.products}>
        <h2 className={styles.sectionTitle}>Products</h2>
        {products.length > 0 ? (
          <div className={styles.grid}>
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No products yet</p>
        )}
      </div>
    </div>
  );
}
