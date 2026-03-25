import { create } from 'zustand'
import type { Cart } from '@/types'

interface CartState {
  cart: Cart | null
  isOpen: boolean
  setCart: (cart: Cart) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isOpen: false,

  setCart: (cart) => set({ cart }),
  clearCart: () => set({ cart: null }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}))
