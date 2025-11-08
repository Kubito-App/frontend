import { Input } from '@/components/Input'
import { ProductCard } from '@/components/ProductCard'
import Spinner from '@/components/spinner'
import { api } from '@/config/axios'
import { useToast } from '@/hooks/use-toast'
import type { Product } from '@/types/product.types'
import { isValidArray } from '@/utils/validations'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useState } from 'react'
import styles from './index.module.scss'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', searchQuery, selectedCategory],
    queryFn: async (): Promise<Array<Product>> => {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (selectedCategory) params.append('category', selectedCategory)
      const { data } = await api.get(`/products?${params.toString()}`)
      return data.products
    },
  })

  const hasProducts = isValidArray(products)

  const favoriteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await api.post('/favorites', { product_id: productId })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      toast('Added to favorites', undefined, 'success')
    },
    onError: () => {
      toast('Failed to add to favorites', undefined, 'error')
    },
  })

  const categories = ['All', 'Fashion', 'Home', 'Electronics', 'Art', 'Beauty']

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className={styles.title}>Discover Amazing Products</h1>
        <p className={styles.subtitle}>Find unique items from stores you love</p>

        <div className={styles.searchBar}>
          <Input
            type='search'
            placeholder='Search for products...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            fullWidth
          />
        </div>

        <div className={styles.categories}>
          {categories.map(category => (
            <button
              key={category}
              className={`${styles.categoryButton} ${
                (category === 'All' && !selectedCategory) || selectedCategory === category
                  ? styles.active
                  : ''
              }`}
              onClick={() => setSelectedCategory(category === 'All' ? null : category)}
            >
              {category}
            </button>
          ))}
        </div>
      </motion.div>

      {isLoading ? (
        <div className={styles.loading}>
          <Spinner />
          <p>Loading products...</p>
        </div>
      ) : (
        <div className={styles.productsGrid}>
          {products?.map((product, index: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ProductCard
                product={product}
                onFavorite={productId => favoriteMutation.mutate(productId)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && !hasProducts && (
        <div className={styles.empty}>
          <p>No products found. Try adjusting your search.</p>
        </div>
      )}
    </div>
  )
}
