import type { User } from '@/types'
import type { ProductList } from '@/types/product.types'
import { atom } from 'jotai'

const token = localStorage.getItem('auth_token')

// Auth state
export const userAtom = atom<User | null>(null)
export const isAuthenticatedAtom = atom<boolean>(false)
export const sessionLoadingAtom = atom<boolean>(!!token)

// User Products
export const myProductsAtom = atom<ProductList>([])

// Toast state
export interface Toast {
  id: string
  title: string
  description?: string
  type: 'success' | 'error' | 'info'
}

export const toastsAtom = atom<Toast[]>([])
