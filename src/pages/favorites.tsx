import { ProductCard } from '@/components/ProductCard'
import Spinner from '@/components/spinner'
import { api } from '@/config/axios'
import { useToast } from '@/hooks/use-toast'
import type { Favorite } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import styles from './favorites.module.scss'

export const Route = createFileRoute('/favorites')({
  component: FavoritesPage,
})

function FavoritesPage() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: favoritesData, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const response = await api.get('/favorites')
      return response.data
    },
  })

  const removeFavoriteMutation = useMutation({
    mutationFn: async (productId: string) => {
      await api.delete(`/favorites/${productId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      toast('Removed from favorites', undefined, 'success')
    },
    onError: () => {
      toast('Failed to remove from favorites', undefined, 'error')
    },
  })

  const favorites: Favorite[] = favoritesData?.favorites || []

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={styles.title}>Your Favorites</h1>
        <p className={styles.subtitle}>
          {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
        </p>
      </motion.div>

      {isLoading ? (
        <div className={styles.loading}>
          <Spinner />
          <p>Loading favorites...</p>
        </div>
      ) : favorites.length > 0 ? (
        <div className={styles.grid}>
          {favorites.map((favorite, index) =>
            favorite.products ? (
              <motion.div
                key={favorite.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProductCard
                  product={{ ...favorite.products, is_favorite: true }}
                  onFavorite={productId => removeFavoriteMutation.mutate(productId)}
                />
              </motion.div>
            ) : null
          )}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>You haven't saved any favorites yet.</p>
          <p>Start exploring and save items you love!</p>
        </div>
      )}
    </div>
  )
}
