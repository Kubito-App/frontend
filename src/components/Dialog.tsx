import { cn } from '@/utils/cn'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import styles from './Dialog.module.scss'

interface Props {
  open: boolean
  children: ReactNode
  onClose?: () => void
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export const Dialog = ({
  open,
  children,
  onClose,
  closeOnClickOutside = true,
  closeOnEscape = true,
  maxWidth = 'md',
}: Props) => {
  useEffect(() => {
    // Prevent scrolling when dialog is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  useEffect(() => {
    if (!closeOnEscape || !onClose) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [closeOnEscape, onClose])

  const handleOverlayClick = () => {
    if (closeOnClickOutside && onClose) {
      onClose()
    }
  }

  if (!open) return null

  return (
    <motion.div
      className={styles.overlay}
      onClick={handleOverlayClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className={cn(styles.dialog, styles[maxWidth])}
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
