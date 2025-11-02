import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/config/axios';
import { Button } from '@/components/Button';
import dayjs from 'dayjs';
import styles from './productDetail.module.scss';

export const Route = createFileRoute('/products/$productId')({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const navigate = useNavigate();

  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    },
  });

  const product = productData?.product;

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h1>Product not found</h1>
        <Button onClick={() => navigate({ to: '/' })}>Go Home</Button>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={styles.grid}>
        <div className={styles.imageSection}>
          <img src={product.image_url} alt={product.title} className={styles.image} />
        </div>

        <div className={styles.detailsSection}>
          <h1 className={styles.title}>{product.title}</h1>

          {product.price && (
            <p className={styles.price}>${product.price.toFixed(2)}</p>
          )}

          {product.description && (
            <p className={styles.description}>{product.description}</p>
          )}

          {product.category && (
            <div className={styles.category}>
              <span className={styles.label}>Category:</span>
              <span className={styles.value}>{product.category}</span>
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className={styles.tags}>
              {product.tags.map((tag: string) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {product.store_url && (
            <Button
              size="lg"
              onClick={() => window.open(product.store_url, '_blank')}
              className={styles.storeButton}
            >
              Visit Store
            </Button>
          )}

          <div className={styles.meta}>
            <span>Added {dayjs(product.created_at).format('MMM D, YYYY')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
