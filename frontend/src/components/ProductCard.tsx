import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import type { Product } from '@/types';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: Product;
  onFavorite?: (productId: string) => void;
  isFavorited?: boolean;
}

export function ProductCard({ product, onFavorite, isFavorited }: ProductCardProps) {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link to="/products/$productId" params={{ productId: product.id }}>
        <div className={styles.imageContainer}>
          <img
            src={product.image_url}
            alt={product.title}
            className={styles.image}
            loading="lazy"
          />
        </div>
      </Link>

      {onFavorite && (
        <button
          className={styles.favoriteButton}
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(product.id);
          }}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isFavorited ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      )}

      <div className={styles.content}>
        <Link to="/products/$productId" params={{ productId: product.id }}>
          <h3 className={styles.title}>{product.title}</h3>
        </Link>
        {product.users && (
          <Link
            to="/profile/$userId"
            params={{ userId: product.user_id }}
            className={styles.author}
          >
            {product.users.avatar_url && (
              <img
                src={product.users.avatar_url}
                alt={product.users.username || 'User'}
                className={styles.avatar}
              />
            )}
            <span>{product.users.username || 'Anonymous'}</span>
          </Link>
        )}
        {product.price && (
          <span className={styles.price}>${product.price.toFixed(2)}</span>
        )}
      </div>
    </motion.div>
  );
}
