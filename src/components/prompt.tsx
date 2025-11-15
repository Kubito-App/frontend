import { Button } from '@/components/Button'
import styles from './prompt.module.scss'

interface Props {
  title: string
  description?: string
  onClick: () => void
  onCancel: () => void
  loading?: boolean
  confirmText?: string
  cancelText?: string
}

export const Prompt = ({
  title,
  description,
  onClick,
  onCancel,
  loading = false,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </div>

      {description && (
        <div className={styles.body}>
          <p className={styles.description}>{description}</p>
        </div>
      )}

      <div className={styles.actions}>
        <Button
          variant='outline'
          onClick={onCancel}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          variant='danger'
          onClick={onClick}
          loading={loading}
          disabled={loading}
        >
          {confirmText}
        </Button>
      </div>
    </div>
  )
}
