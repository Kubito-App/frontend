import { toastsAtom } from '@/store/atoms'
import { useSetAtom } from 'jotai'

export function useToast() {
  const setToasts = useSetAtom(toastsAtom)

  const toast = (
    title: string,
    description?: string,
    type: 'success' | 'error' | 'info' = 'info'
  ) => {
    const id = Math.random().toString(36).substring(7)
    setToasts(prev => [...prev, { id, title, description, type }])
  }

  return { toast }
}
