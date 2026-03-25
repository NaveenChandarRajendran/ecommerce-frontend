import api from './api'
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types'

const authService = {
  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  refresh: (refreshToken: string) =>
    api.post<AuthResponse>('/auth/refresh', null, { params: { refreshToken } }).then((r) => r.data),
}

export default authService
