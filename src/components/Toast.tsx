import * as ToastPrimitive from '@radix-ui/react-toast';
import { useAtom } from 'jotai';
import { toastsAtom } from '@/store/atoms';
import { cn } from '@/utils/cn';
import styles from './Toast.module.scss';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useAtom(toastsAtom);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {children}
      {toasts.map((toast) => (
        <ToastPrimitive.Root
          key={toast.id}
          className={cn(styles.toast, styles[toast.type])}
          onOpenChange={(open) => {
            if (!open) removeToast(toast.id);
          }}
          duration={5000}
        >
          <ToastPrimitive.Title className={styles.title}>
            {toast.title}
          </ToastPrimitive.Title>
          {toast.description && (
            <ToastPrimitive.Description className={styles.description}>
              {toast.description}
            </ToastPrimitive.Description>
          )}
          <ToastPrimitive.Close className={styles.close}>
            ×
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className={styles.viewport} />
    </ToastPrimitive.Provider>
  );
}

export function useToast() {
  const [, setToasts] = useAtom(toastsAtom);

  const toast = (
    title: string,
    description?: string,
    type: 'success' | 'error' | 'info' = 'info'
  ) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, title, description, type }]);
  };

  return { toast };
}
