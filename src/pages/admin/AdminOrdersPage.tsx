import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import orderService from '@/services/orderService'
import type { OrderStatus } from '@/types'
import { formatCurrency, formatDate, getOrderStatusBadgeClass } from '@/utils'
import { Spinner, Pagination } from '@/components/common'

const ORDER_STATUSES: OrderStatus[] = [
  'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED',
]

export default function AdminOrdersPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders-page', page],
    queryFn: () => orderService.getAllOrders(page, 15),
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => orderService.updateStatus(id, status),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-orders-page'] }); toast.success('Status updated') },
    onError: () => toast.error('Failed to update status'),
  })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                  {['Order #', 'Date', 'Items', 'Total', 'Payment', 'Status', 'Update Status'].map(h => (
                    <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(data?.content ?? []).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-gray-700">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3 text-gray-600">{order.orderItems.length}</td>
                    <td className="px-4 py-3 font-semibold">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${
                        order.paymentStatus === 'PAID'   ? 'badge-green' :
                        order.paymentStatus === 'FAILED' ? 'badge-red'   : 'badge-yellow'
                      }`}>{order.paymentStatus}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${getOrderStatusBadgeClass(order.status)}`}>{order.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={e => updateStatus.mutate({ id: order.id, status: e.target.value })}
                        className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
                      >
                        {ORDER_STATUSES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {data && <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />}
    </div>
  )
}
