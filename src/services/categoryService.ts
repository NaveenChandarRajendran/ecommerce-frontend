import api from './api'
import type { Category, CategoryRequest } from '@/types'

const categoryService = {
  getAll: () =>
    api.get<Category[]>('/categories').then((r) => r.data),

  getById: (id: number) =>
    api.get<Category>(`/categories/${id}`).then((r) => r.data),

  create: (data: CategoryRequest) =>
    api.post<Category>('/categories', data).then((r) => r.data),

  update: (id: number, data: CategoryRequest) =>
    api.put<Category>(`/categories/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/categories/${id}`),
}

export default categoryService
