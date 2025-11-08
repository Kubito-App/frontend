import type { ProductList } from '@/types/product.types'
import { atom } from 'jotai'

export const productsAtom = atom<ProductList>([])

export let filters = {
  search: '',
  category: 'All',
}

export function updateFilters(value = {}) {
  filters = { ...filters, ...value }
}
