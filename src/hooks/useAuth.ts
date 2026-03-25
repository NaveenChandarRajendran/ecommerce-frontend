import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import authService from '@/services/authService'
import type { LoginRequest, RegisterRequest } from '@/types'

export function useAuth() {
  const { user, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken)
      toast.success(`Welcome back, ${data.user.firstName}!`)
      navigate(data.user.role === 'ADMIN' ? '/admin' : '/')
    },
    onError: () => {
      toast.error('Invalid email or password')
    },
  })

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken)
      toast.success('Account created successfully!')
      navigate('/')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? 'Registration failed'
      toast.error(message)
    },
  })

  const logout = () => {
    storeLogout()
    queryClient.clear()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  return {
    user,
    isAuthenticated,
    isAdmin: user?.role === 'ADMIN',
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  }
}
