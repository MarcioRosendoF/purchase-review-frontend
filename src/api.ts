import {
  type ApiError,
  type AuthResponse,
  type Order,
  type Page,
  type Product,
  type Review,
} from './types'

export const AUTH_STORAGE_KEY = 'auth'

export class ApiRequestError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function getToken(): string | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null
  try {
    return (JSON.parse(raw) as AuthResponse).token
  } catch {
    return null
  }
}

function fallbackMessage(status: number): string {
  if (status === 401) return 'Session expired'
  if (status === 403) return 'Access denied'
  if (status === 404) return 'Resource not found'
  if (status >= 500) return 'Internal server error'
  return 'Could not reach the API'
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(path, { ...options, headers })
  } catch {
    throw new ApiRequestError(0, 'Could not reach the API')
  }

  if (!response.ok) {
    let body: ApiError | null = null
    try {
      body = (await response.json()) as ApiError
    } catch {
      body = null
    }
    throw new ApiRequestError(response.status, body?.message ?? fallbackMessage(response.status))
  }

  return (await response.json()) as T
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function register(name: string, email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

export function listProducts(page: number): Promise<Page<Product>> {
  return request<Page<Product>>(`/products?page=${page}`)
}

export function getProduct(id: string): Promise<Product> {
  return request<Product>(`/products/${id}`)
}

export function createOrder(productId: string): Promise<Order> {
  return request<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  })
}

export function createReview(productId: string, rating: number, comment: string): Promise<Review> {
  return request<Review>('/reviews', {
    method: 'POST',
    body: JSON.stringify({ productId, rating, comment }),
  })
}

export function listMyOrders(page: number): Promise<Page<Order>> {
  return request<Page<Order>>(`/orders/my?page=${page}`)
}
