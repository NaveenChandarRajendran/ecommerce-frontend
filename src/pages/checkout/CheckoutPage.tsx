import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, MapPin, CreditCard } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { usePlaceOrder } from '@/hooks/useOrders'
import { useQuery } from '@tanstack/react-query'
import addressService from '@/services/addressService'
import { formatCurrency } from '@/utils'
import { LoadingScreen } from '@/components/common'

const paymentMethods = ['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'BANK_TRANSFER']

export default function CheckoutPage() {
  const { cart } = useCart()
  const placeOrder = usePlaceOrder()
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD')
  const [notes, setNotes] = useState('')

  const { data: addresses, isLoading: addrLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => addressService.getAll(),
  })

  if (addrLoading) return <LoadingScreen />

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAddress) return
    placeOrder.mutate({ shippingAddressId: selectedAddress, paymentMethod, notes })
  }

  return (
    <div className="page-container max-w-4xl">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ChevronLeft className="w-4 h-4" /> Continue Shopping
      </Link>
      <h1 className="section-title">Checkout</h1>

      {!cart || cart.cartItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Shipping + Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address */}
            <div className="card p-6">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-primary-500" /> Shipping Address
              </h2>
              {addresses && addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label key={addr.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${selectedAddress === addr.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <input type="radio" name="address" value={addr.id}
                        checked={selectedAddress === addr.id}
                        onChange={() => setSelectedAddress(addr.id)}
                        className="mt-1"
                      />
                      <div className="text-sm">
                        <p className="font-medium text-gray-800">{addr.fullName}</p>
                        <p className="text-gray-500">{addr.street}, {addr.city}, {addr.state} {addr.zipCode}</p>
                        <p className="text-gray-500">{addr.country}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No saved addresses. <Link to="/profile" className="text-primary-600 hover:underline">Add one in your profile.</Link></p>
              )}
            </div>

            {/* Payment */}
            <div className="card p-6">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-primary-500" /> Payment Method
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <label key={method}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-colors text-sm ${paymentMethod === method ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <input type="radio" name="payment" value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                    />
                    {method.replace('_', ' ')}
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="card p-6">
              <h2 className="font-semibold text-gray-800 mb-3">Order Notes (optional)</h2>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                className="input resize-none"
                placeholder="Special instructions for your order…"
              />
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h2 className="font-semibold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cart.cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate mr-2">{item.productName} ×{item.quantity}</span>
                    <span className="font-medium flex-shrink-0">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(cart.totalAmount)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{formatCurrency(5.99)}</span></div>
                <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2">
                  <span>Total</span><span>{formatCurrency(cart.totalAmount + 5.99)}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={!selectedAddress || placeOrder.isPending}
                className="btn-primary w-full justify-center py-3 mt-4 text-base"
              >
                {placeOrder.isPending ? 'Placing order…' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
