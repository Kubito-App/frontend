import { Button } from '@/components/Button'
import { ProductCard } from '@/components/ProductCard'
import { api } from '@/config/axios'
import { userAtom } from '@/store/atoms'
import type { Product } from '@/types/product.types'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { motion } from 'motion/react'
import styles from './profile.module.scss'

export const Route = createFileRoute('/profile/$userId')({
  component: ProfilePage,
})

function ProfilePage() {
  const { userId } = Route.useParams()

  const user = useAtomValue(userAtom)
  const isOwnProfile = userId === user?.id

  const { data: userProducts } = useQuery({
    queryKey: ['userProducts', userId],
    queryFn: async () => {
      const { data } = await api.get(`/products/user/${userId}`)
      return data.products
    },
  })

  const products = userProducts || []

  console.log('products: ', products)

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.avatarSection}>
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.username}
              className={styles.avatar}
            />
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
          <Button
            variant='outline'
            onClick={() => (window.location.href = '/settings')}
          >
            Edit Profile
          </Button>
        )}
      </motion.div>

      <div className={styles.products}>
        <h2 className={styles.sectionTitle}>Products</h2>
        {products.length > 0 ? (
          <div className={styles.grid}>
            {products.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No products yet</p>
        )}
      </div>
    </div>
  )
}
