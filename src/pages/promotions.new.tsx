import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { api } from '@/config/axios'
import { WithAuthentication } from '@/hocs/with-authentication'
import { useToast } from '@/hooks/use-toast'
import type { ProductList } from '@/types/product.types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { motion } from 'motion/react'
import { useState } from 'react'
import styles from './promotionsForm.module.scss'

export const Route = createFileRoute('/promotions/new')({
  component: NewPromotionPage,
})

function NewPromotionPage() {
  return (
    <WithAuthentication>
      <Component />
    </WithAuthentication>
  )
}

function Component() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const userId = JSON.parse(localStorage.getItem('user') || '{}')?.id

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [productId, setProductId] = useState('')
  const [budget, setBudget] = useState('')
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().add(7, 'days').format('YYYY-MM-DD'))

  const { data: productsData } = useQuery({
    queryKey: ['userProducts', userId],
    queryFn: async (): Promise<ProductList> => {
      const { data } = await api.get(`/products/user/${userId}`)
      return data.products
    },
  })

  console.log('products', productsData)

  type PromotionInput = {
    title: string
    description: string
    product_id: string
    budget: number
    start_date: string
    end_date: string
  }

  const createMutation = useMutation({
    mutationFn: async (data: PromotionInput) => {
      await api.post('/promotions', data)
    },
    onSuccess: () => {
      toast('Promotion created successfully', undefined, 'success')
      navigate({ to: '/promotions' })
    },
    onError: () => {
      toast('Failed to create promotion', undefined, 'error')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({
      title,
      description,
      product_id: productId,
      budget: parseFloat(budget),
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
    })
  }

  const products = productsData || []

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={styles.title}>Create Promotion</h1>
        <p className={styles.subtitle}>Promote your product to reach more customers</p>

        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <Input
            label='Title'
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            fullWidth
          />

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Product *</label>
            <select
              className={styles.select}
              value={productId}
              onChange={e => setProductId(e.target.value)}
              required
            >
              <option value=''>Select a product</option>
              {products.map(product => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.title}
                </option>
              ))}
            </select>
          </div>

          <Input
            type='number'
            label='Budget ($)'
            value={budget}
            onChange={e => setBudget(e.target.value)}
            required
            min='1'
            step='0.01'
            fullWidth
          />

          <div className={styles.dateRow}>
            <Input
              type='date'
              label='Start Date'
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
              fullWidth
            />
            <Input
              type='date'
              label='End Date'
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              required
              fullWidth
            />
          </div>

          <div className={styles.actions}>
            <Button
              type='button'
              variant='outline'
              onClick={() => navigate({ to: '/promotions' })}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              loading={createMutation.isPending}
            >
              Create Promotion
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
