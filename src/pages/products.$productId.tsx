import { Button } from '@/components/Button'
import { Dialog } from '@/components/Dialog'
import { Prompt } from '@/components/prompt'
import Spinner from '@/components/spinner'
import { api } from '@/config/axios'
import { useDialog } from '@/hooks/use-dialog'
import { useToast } from '@/hooks/use-toast'
import { userAtom } from '@/store/atoms'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useAtomValue } from 'jotai'
import { motion } from 'motion/react'
import styles from './productDetail.module.scss'

export const Route = createFileRoute('/products/$productId')({
  component: ProductDetailPage,
})

function ProductDetailPage() {
  const { productId } = Route.useParams()
  const navigate = useNavigate()
  const user = useAtomValue(userAtom)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { showDialog, toggleDialog } = useDialog()

  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await api.get(`/products/${productId}`)
      return response.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/products/${productId}`)
    },
    onSuccess: () => {
      toast('Product deleted successfully', undefined, 'success')
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['myProducts'] })
      navigate({ to: '/' })
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'An error occurred'
      toast('Failed to delete product', errorMessage, 'error')
    },
  })

  const product = productData?.product
  const isOwner = user?.id === product?.user_id

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spinner />
      </div>
    )
  }

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h1>Product not found</h1>
        <Button onClick={() => navigate({ to: '/' })}>Go Home</Button>
      </div>
    )
  }

  return (
    <>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className={styles.grid}>
          <div className={styles.imageSection}>
            <img
              src={product.image_url}
              alt={product.title}
              className={styles.image}
            />
          </div>

          <div className={styles.detailsSection}>
            <h1 className={styles.title}>{product.title}</h1>

            {product.price && <p className={styles.price}>${product.price.toFixed(2)}</p>}

            {product.description && <p className={styles.description}>{product.description}</p>}

            {product.category && (
              <div className={styles.category}>
                <span className={styles.label}>Category:</span>
                <span className={styles.value}>{product.category}</span>
              </div>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className={styles.tags}>
                {product.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className={styles.tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className={styles.actions}>
              {product.store_url && (
                <Button
                  size='lg'
                  onClick={() => window.open(product.store_url, '_blank')}
                  className={styles.storeButton}
                >
                  Visit Store
                </Button>
              )}

              {isOwner && (
                <Button
                  size='lg'
                  variant='danger'
                  onClick={() => toggleDialog()}
                  disabled={deleteMutation.isPending}
                >
                  Delete Product
                </Button>
              )}
            </div>

            <div className={styles.meta}>
              <span>Added {dayjs(product.created_at).format('MMM D, YYYY')}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <Dialog
        open={showDialog}
        onClose={deleteMutation.isPending ? undefined : toggleDialog}
      >
        <Prompt
          title='Are you sure to delete this product?'
          description={`This action can't be undone.`}
          onClick={deleteMutation.mutate}
          onCancel={toggleDialog}
          loading={deleteMutation.isPending}
        />
      </Dialog>
    </>
  )
}
