import { toastsAtom } from '@/store/atoms'
import { cn } from '@/utils/cn'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { useAtom } from 'jotai'
import styles from './Toast.module.scss'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useAtom(toastsAtom)

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <ToastPrimitive.Provider swipeDirection='right'>
      {children}
      {toasts.map(toast => (
        <ToastPrimitive.Root
          key={toast.id}
          className={cn(styles.toast, styles[toast.type])}
          onOpenChange={open => {
            if (!open) removeToast(toast.id)
          }}
          duration={5000}
        >
          <ToastPrimitive.Title className={styles.title}>{toast.title}</ToastPrimitive.Title>
          {toast.description && (
            <ToastPrimitive.Description className={styles.description}>
              {toast.description}
            </ToastPrimitive.Description>
          )}
          <ToastPrimitive.Close className={styles.close}>×</ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className={styles.viewport} />
    </ToastPrimitive.Provider>
  )
}
