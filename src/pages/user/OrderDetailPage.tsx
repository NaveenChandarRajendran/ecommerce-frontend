import { useParams, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useOrder, useCancelOrder } from '@/hooks/useOrders'
import { LoadingScreen } from '@/components/common'
import { formatCurrency, formatDateTime, getOrderStatusBadgeClass } from '@/utils'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading } = useOrder(Number(id))
  const cancelOrder = useCancelOrder()

  if (isLoading) return <LoadingScreen />
  if (!order) return <div className="page-container py-20 text-center text-gray-500">Order not found.</div>

  const canCancel = !['SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'].includes(order.status)

  return (
    <div className="page-container max-w-3xl">
      <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to orders
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order {order.orderNumber}</h1>
          <p className="text-sm text-gray-500 mt-1">Placed on {formatDateTime(order.createdAt)}</p>
        </div>
        <span className={getOrderStatusBadgeClass(order.status)}>{order.status}</span>
      </div>

      {/* Items */}
      <div className="card p-5 mb-4">
        <h2 className="font-semibold text-gray-800 mb-4">Items</h2>
        <div className="space-y-3">
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                {item.productImage
                  ? <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{item.productName}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</p>
              </div>
              <span className="font-semibold text-sm">{formatCurrency(item.totalPrice)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary + Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="card p-5">
          <h2 className="font-semibold text-gray-800 mb-3">Order Summary</h2>
          <div className="space-y-2 text-sm">
            {[
              ['Subtotal', formatCurrency(order.totalAmount - order.shippingAmount + order.discountAmount)],
              ['Shipping', formatCurrency(order.shippingAmount)],
              ['Discount', `-${formatCurrency(order.discountAmount)}`],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between text-gray-600">
                <span>{label}</span><span>{val}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2">
              <span>Total</span><span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-gray-800 mb-3">Shipping Address</h2>
          <address className="text-sm text-gray-600 not-italic leading-relaxed">
            <p className="font-medium text-gray-800">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p>{order.shippingAddress.country}</p>
          </address>
        </div>
      </div>

      {canCancel && (
        <button
          onClick={() => cancelOrder.mutate(order.id)}
          disabled={cancelOrder.isPending}
          className="btn-danger"
        >
          {cancelOrder.isPending ? 'Cancelling…' : 'Cancel Order'}
        </button>
      )}
    </div>
  )
}
