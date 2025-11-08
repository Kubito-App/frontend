import type { User } from '@/types'
import { atom } from 'jotai'

const token = localStorage.getItem('auth_token')

// Auth state
export const userAtom = atom<User | null>(null)
export const isAuthenticatedAtom = atom<boolean>(false)
export const sessionLoadingAtom = atom<boolean>(!!token)

// UI state
export const isSidebarOpenAtom = atom<boolean>(false)
export const searchQueryAtom = atom<string>('')
export const selectedCategoryAtom = atom<string | null>(null)

// Toast state
export interface Toast {
  id: string
  title: string
  description?: string
  type: 'success' | 'error' | 'info'
}

export const toastsAtom = atom<Toast[]>([])
