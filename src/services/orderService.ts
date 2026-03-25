import api from './api'
import type { Order, OrderRequest, PageResponse } from '@/types'

const orderService = {
  createOrder: (data: OrderRequest) =>
    api.post<Order>('/orders', data).then((r) => r.data),

  getMyOrders: (page = 0, size = 10) =>
    api.get<PageResponse<Order>>('/orders', { params: { page, size } }).then((r) => r.data),

  getOrderById: (id: number) =>
    api.get<Order>(`/orders/${id}`).then((r) => r.data),

  cancelOrder: (id: number) =>
    api.post(`/orders/${id}/cancel`),

  // Admin
  getAllOrders: (page = 0, size = 20) =>
    api.get<PageResponse<Order>>('/orders/admin/all', { params: { page, size } }).then((r) => r.data),

  updateStatus: (id: number, status: string) =>
    api.patch<Order>(`/orders/admin/${id}/status`, null, { params: { status } }).then((r) => r.data),
}

export default orderService
