import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import orderService from '@/services/orderService'
import type { OrderRequest } from '@/types'

export function useOrders(page = 0) {
  return useQuery({
    queryKey: ['orders', page],
    queryFn: () => orderService.getMyOrders(page),
  })
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
  })
}

export function usePlaceOrder() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: OrderRequest) => orderService.createOrder(data),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Order placed successfully!')
      navigate(`/orders/${order.id}`)
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message ?? 'Failed to place order')
    },
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => orderService.cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Order cancelled')
    },
    onError: () => toast.error('Could not cancel order'),
  })
}
