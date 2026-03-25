import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import cartService from '@/services/cartService'
import type { CartItemRequest } from '@/types'

export function useCart() {
  const queryClient = useQueryClient()
  const { setCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const data = await cartService.getCart()
      setCart(data)
      return data
    },
    enabled: isAuthenticated,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['cart'] })

  const addItemMutation = useMutation({
    mutationFn: (data: CartItemRequest) => cartService.addItem(data),
    onSuccess: (data) => { setCart(data); invalidate(); toast.success('Added to cart!') },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Failed to add item'),
  })

  const updateItemMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) =>
      cartService.updateItem(cartItemId, quantity),
    onSuccess: (data) => { setCart(data); invalidate() },
    onError: () => toast.error('Failed to update cart'),
  })

  const removeItemMutation = useMutation({
    mutationFn: (cartItemId: number) => cartService.removeItem(cartItemId),
    onSuccess: (data) => { setCart(data); invalidate(); toast.success('Item removed') },
    onError: () => toast.error('Failed to remove item'),
  })

  const clearMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => { invalidate() },
  })

  return {
    cart,
    isLoading,
    addItem: (data: CartItemRequest) => addItemMutation.mutate(data),
    updateItem: (cartItemId: number, quantity: number) =>
      updateItemMutation.mutate({ cartItemId, quantity }),
    removeItem: (cartItemId: number) => removeItemMutation.mutate(cartItemId),
    clearCart: () => clearMutation.mutate(),
    isAddingItem: addItemMutation.isPending,
  }
}
