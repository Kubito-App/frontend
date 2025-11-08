import AddIcon from '@/assets/icons/plus.svg?react'
import { Button } from '@/components/Button'
import Spinner from '@/components/spinner'
import { api } from '@/config/axios'
import type { Promotion } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { motion } from 'motion/react'
import styles from './promotions.module.scss'

export const Route = createFileRoute('/promotions/')({
  component: PromotionsIndexPage,
})

function PromotionsIndexPage() {
  const { data: promotionsData, isLoading } = useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      const response = await api.get('/promotions')
      return response.data
    },
  })

  const promotions: Promotion[] = promotionsData?.promotions || []

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className={styles.title}>Promotions</h1>
          <p className={styles.subtitle}>Manage your product promotions</p>
        </div>
        <Link to='/promotions/new'>
          <Button size='lg'>
            <AddIcon />
            Create Promotion
          </Button>
        </Link>
      </motion.div>

      {isLoading ? (
        <div className={styles.loading}>
          <Spinner />
        </div>
      ) : promotions.length > 0 ? (
        <div className={styles.grid}>
          {promotions.map((promotion, index) => (
            <motion.div
              key={promotion.id}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{promotion.title}</h3>
                <span className={`${styles.status} ${styles[promotion.status]}`}>
                  {promotion.status}
                </span>
              </div>

              {promotion.description && (
                <p className={styles.description}>{promotion.description}</p>
              )}

              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Impressions</span>
                  <span className={styles.statValue}>{promotion.impressions}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Clicks</span>
                  <span className={styles.statValue}>{promotion.clicks}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Budget</span>
                  <span className={styles.statValue}>${promotion.budget}</span>
                </div>
              </div>

              <div className={styles.dates}>
                <span>{dayjs(promotion.start_date).format('MMM D')}</span>
                <span>→</span>
                <span>{dayjs(promotion.end_date).format('MMM D, YYYY')}</span>
              </div>

              {/* <div className={styles.actions}>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div> */}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>No promotions yet</p>
          <Link to='/promotions/new'>
            <Button>Create Your First Promotion</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
