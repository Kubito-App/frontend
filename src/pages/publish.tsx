import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Textarea } from '@/components/Textarea'
import { ImageInput } from '@/components/image-input'
import { api } from '@/config/axios'
import { WithAuthentication } from '@/hocs/with-authentication'
import { useToast } from '@/hooks/use-toast'
import type { ProductPayload } from '@/types/product.types'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useState, type KeyboardEvent } from 'react'
import styles from './publish.module.scss'

export const Route = createFileRoute('/publish')({
  component: PublishPage,
})

function PublishPage() {
  return (
    <WithAuthentication>
      <Component />
    </WithAuthentication>
  )
}

function Component() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [formData, setFormData] = useState<ProductPayload>({
    title: '',
    description: '',
    image_url: '',
    category: '',
    tags: [],
    store_url: '',
    price: undefined,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? (value ? parseFloat(value) : undefined) : value,
    }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }))
      setTagInput('')
    }
  }

  const handleTagInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!imageFile) {
      toast('Image required', 'Please select an image for your product', 'error')
      return
    }

    setIsLoading(true)

    try {
      const payload = new FormData()
      payload.append('title', formData.title)
      payload.append('image', imageFile)

      if (formData.description) payload.append('description', formData.description)
      if (formData.category) payload.append('category', formData.category)
      if (formData.tags && formData.tags.length > 0) {
        formData.tags.forEach(tag => payload.append('tags[]', tag))
      }
      if (formData.store_url) payload.append('store_url', formData.store_url)
      if (formData.price !== undefined && formData.price > 0) {
        payload.append('price', formData.price.toString())
      }

      const { data } = await api.post('/products', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (data.error) throw Error('Error creating product')

      toast('Product published!', 'Your product has been published successfully', 'success')
      navigate({ to: '/' })
    } catch (error) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { error?: string } } }).response?.data?.error
          : undefined
      toast('Failed to publish product', errorMessage || 'Please try again', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className={styles.title}>Publish a Product</h1>
        <p className={styles.subtitle}>Share your discovery with the community</p>

        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <Input
            type='text'
            name='title'
            label='Product Title'
            placeholder='Amazing Product Name'
            value={formData.title}
            onChange={handleInputChange}
            required
            fullWidth
          />

          <Textarea
            name='description'
            label='Description (optional)'
            placeholder='Tell us about this product...'
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            rows={4}
          />

          <ImageInput
            label='Product Image'
            value={imageFile}
            onChange={setImageFile}
            fullWidth
          />

          <div className={styles.row}>
            <Input
              type='text'
              name='category'
              label='Category (optional)'
              placeholder='e.g., Electronics, Fashion'
              value={formData.category}
              onChange={handleInputChange}
              fullWidth
            />

            <Input
              type='number'
              name='price'
              label='Price (optional)'
              placeholder='0.00'
              value={formData.price || ''}
              onChange={handleInputChange}
              min='0'
              step='0.01'
              fullWidth
            />
          </div>

          <div className={styles.tagsContainer}>
            <label className={styles.tagsLabel}>Tags (optional)</label>
            <div className={styles.tagsInput}>
              {formData.tags?.map(tag => (
                <span
                  key={tag}
                  className={styles.tag}
                >
                  {tag}
                  <button
                    type='button'
                    className={styles.removeTag}
                    onClick={() => handleRemoveTag(tag)}
                    aria-label={`Remove ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type='text'
                className={styles.tagInputField}
                placeholder='Add a tag and press Enter'
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                onBlur={handleAddTag}
              />
            </div>
            <p className={styles.tagsHelper}>Press Enter to add tags</p>
          </div>

          <Input
            type='url'
            name='store_url'
            label='Store URL (optional)'
            placeholder='https://store.com/product'
            value={formData.store_url}
            onChange={handleInputChange}
            fullWidth
          />

          <Button
            type='submit'
            loading={isLoading}
            size='lg'
            className={styles.submitButton}
          >
            Publish Product
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
