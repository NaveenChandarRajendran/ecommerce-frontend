import api from './api'
import type { Cart, CartItemRequest } from '@/types'

const cartService = {
  getCart: () =>
    api.get<Cart>('/cart').then((r) => r.data),

  addItem: (data: CartItemRequest) =>
    api.post<Cart>('/cart/items', data).then((r) => r.data),

  updateItem: (cartItemId: number, quantity: number) =>
    api.put<Cart>(`/cart/items/${cartItemId}`, null, { params: { quantity } }).then((r) => r.data),

  removeItem: (cartItemId: number) =>
    api.delete<Cart>(`/cart/items/${cartItemId}`).then((r) => r.data),

  clearCart: () =>
    api.delete('/cart'),
}

export default cartService
