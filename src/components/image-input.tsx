import ImageIcon from '@/assets/icons/image.svg?react'
import TrashIcon from '@/assets/icons/trash.svg?react'
import { cn } from '@/utils/cn'
import type { InputHTMLAttributes } from 'react'
import { forwardRef, useRef, useState } from 'react'
import { Button } from './Button'
import styles from './image-input.module.scss'

export interface ImageInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value'> {
  label?: string
  error?: string
  fullWidth?: boolean
  onChange?: (file: File | null) => void
  value?: File | null
}

export const ImageInput = forwardRef<HTMLInputElement, ImageInputProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, label, error, fullWidth, onChange, value, ...props }, ref) => {
    const [isDragging, setIsDragging] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFile = (file: File | null) => {
      if (file && file.type.startsWith('image/')) {
        onChange?.(file)

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else if (file) {
        // Invalid file type
        onChange?.(null)
        setPreview(null)
      } else {
        // File cleared
        onChange?.(null)
        setPreview(null)
      }
    }

    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFile(files[0])
      }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        handleFile(files[0])
      }
    }

    const handleContainerClick = () => {
      if (!preview) {
        fileInputRef.current?.click()
      }
    }

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation()
      handleFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }

    return (
      <div
        className={cn(styles.wrapper, fullWidth && styles.fullWidth)}
        ref={ref}
      >
        {label && <label className={styles.label}>{label}</label>}

        <div
          className={cn(
            styles.dropzone,
            isDragging && styles.dragging,
            error && styles.error,
            preview && styles.hasPreview,
            className
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleContainerClick}
        >
          {preview ? (
            <div className={styles.previewContainer}>
              <img
                src={preview}
                alt='Preview'
                className={styles.preview}
              />
              <div className={styles.previewOverlay}>
                <Button
                  type='button'
                  onClick={handleRemove}
                  variant='secondary'
                  size='sm'
                >
                  <TrashIcon />
                  Remove Image
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles.content}>
              <ImageIcon className={styles.icon} />
              <p className={styles.text}>
                <span className={styles.highlight}>Drop an image here</span> or click to browse
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            className={styles.fileInput}
            onChange={handleInputChange}
            {...props}
          />
        </div>

        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    )
  }
)

ImageInput.displayName = 'ImageInput'
