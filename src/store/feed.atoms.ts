import type { Product } from '@/types/product.types'
import { atom } from 'jotai'

export const productsAtom = atom<Array<Product>>([])

export let filters = {
  search: '',
  category: 'All',
}

export function updateFilters(value = {}) {
  filters = { ...filters, ...value }
}
