import { Avatar } from '@/components/avatar'
import { Button } from '@/components/Button'
import { ProductCard } from '@/components/ProductCard'
import { api } from '@/config/axios'
import { myProductsAtom, userAtom } from '@/store/atoms'
import type { Product } from '@/types/product.types'
import { isValidArray } from '@/utils/validations'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useAtom, useAtomValue } from 'jotai'
import { motion } from 'motion/react'
import styles from './profile.module.scss'

export const Route = createFileRoute('/profile/$userId')({
  component: ProfilePage,
})

function ProfilePage() {
  const { userId } = Route.useParams()

  const _user = useAtomValue(userAtom)
  const [myProducts, setMyProducts] = useAtom(myProductsAtom)

  const isOwnProfile = userId === _user?.id

  const { data: userInfo } = useQuery({
    queryKey: ['userInfo', userId],
    queryFn: async () => {
      const { data } = await api.get(`/users/${userId}`)
      return data.user
    },
    enabled: !isOwnProfile,
  })
  const { data: userProducts } = useQuery({
    queryKey: ['userProducts', userId],
    queryFn: async () => {
      const { data } = await api.get(`/products/user/${userId}`)
      if (isOwnProfile) setMyProducts(data.products)
      return data.products
    },
    enabled: (isOwnProfile && !isValidArray(myProducts)) || (!isOwnProfile && !!userInfo),
  })

  const user = isOwnProfile ? _user : userInfo || {}
  const products = isOwnProfile ? myProducts : userProducts || []

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Avatar
          user={user}
          className={styles.avatar}
        />

        <div className={styles.info}>
          <h1 className={styles.username}>{user?.username || 'User'}</h1>
          {user?.bio && <p className={styles.bio}>{user.bio}</p>}
          <div className={styles.stats}>
            <span>{products.length} products</span>
            {isOwnProfile && user?.subscription_plan && (
              <span className={styles.badge}>{user.subscription_plan}</span>
            )}
          </div>
        </div>

        {isOwnProfile && (
          <Link to='/settings'>
            <Button variant='outline'>Edit Profile</Button>
          </Link>
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
