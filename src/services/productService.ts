import api from './api'
import type { Product, ProductRequest, PageResponse } from '@/types'

export interface ProductQueryParams {
  page?: number
  size?: number
  sortBy?: string
  direction?: 'asc' | 'desc'
}

const productService = {
  getAll: (params: ProductQueryParams = {}) =>
    api.get<PageResponse<Product>>('/products', { params }).then((r) => r.data),

  getById: (id: number) =>
    api.get<Product>(`/products/${id}`).then((r) => r.data),

  getLatest: () =>
    api.get<Product[]>('/products/latest').then((r) => r.data),

  search: (keyword: string, page = 0, size = 12) =>
    api.get<PageResponse<Product>>('/products/search', { params: { keyword, page, size } }).then((r) => r.data),

  getByCategory: (categoryId: number, page = 0, size = 12) =>
    api.get<PageResponse<Product>>(`/products/category/${categoryId}`, { params: { page, size } }).then((r) => r.data),

  getByPriceRange: (min: number, max: number, page = 0, size = 12) =>
    api.get<PageResponse<Product>>('/products/price-range', { params: { min, max, page, size } }).then((r) => r.data),

  create: (data: ProductRequest) =>
    api.post<Product>('/products', data).then((r) => r.data),

  update: (id: number, data: ProductRequest) =>
    api.put<Product>(`/products/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/products/${id}`),
}

export default productService
