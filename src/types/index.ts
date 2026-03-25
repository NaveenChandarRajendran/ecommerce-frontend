// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  user: User
}

// ─── User ──────────────────────────────────────────────────────────────────────
export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: 'CUSTOMER' | 'ADMIN'
  enabled: boolean
  createdAt: string
}

// ─── Category ─────────────────────────────────────────────────────────────────
export interface Category {
  id: number
  name: string
  description?: string
  imageUrl?: string
}

export interface CategoryRequest {
  name: string
  description?: string
  imageUrl?: string
}

// ─── Product ──────────────────────────────────────────────────────────────────
export interface ProductImage {
  id: number
  imageUrl: string
  altText?: string
  sortOrder: number
}

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  salePrice?: number
  stock: number
  imageUrl?: string
  sku?: string
  active: boolean
  category: Category
  averageRating: number
  reviewCount: number
  images: ProductImage[]
  createdAt: string
  updatedAt: string
}

export interface ProductRequest {
  name: string
  description?: string
  price: number
  salePrice?: number
  stock: number
  imageUrl?: string
  sku?: string
  active: boolean
  categoryId: number
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: number
  productId: number
  productName: string
  productImage?: string
  productPrice: number
  productSalePrice?: number
  quantity: number
  subtotal: number
}

export interface Cart {
  id: number
  cartItems: CartItem[]
  totalAmount: number
  itemCount: number
}

export interface CartItemRequest {
  productId: number
  quantity: number
}

// ─── Address ──────────────────────────────────────────────────────────────────
export interface Address {
  id: number
  fullName: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
  isDefault: boolean
}

export interface AddressRequest {
  fullName: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
  isDefault?: boolean
}

// ─── Order ────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | 'PENDING' | 'CONFIRMED' | 'PROCESSING'
  | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

export interface OrderItem {
  id: number
  productId: number
  productName: string
  productImage?: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Order {
  id: number
  orderNumber: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  totalAmount: number
  shippingAmount: number
  discountAmount: number
  paymentMethod: string
  notes?: string
  shippingAddress: Address
  orderItems: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface OrderRequest {
  shippingAddressId: number
  paymentMethod: string
  notes?: string
}

// ─── Review ───────────────────────────────────────────────────────────────────
export interface Review {
  id: number
  productId: number
  userId: number
  userFullName: string
  rating: number
  title?: string
  comment?: string
  createdAt: string
}

export interface ReviewRequest {
  rating: number
  title?: string
  comment?: string
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PageResponse<T> {
  content: T[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
}

// ─── API Error ────────────────────────────────────────────────────────────────
export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  fieldErrors?: Record<string, string>
}
