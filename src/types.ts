export interface AuthResponse {
  token: string
  type: 'Bearer'
  userId: string
  email: string
  role: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  averageRating: number
  reviewCount: number
  createdAt: string
}

export interface Review {
  id: string
  authorName: string
  rating: number
  comment: string
  createdAt: string
}

export interface Order {
  id: string
  productId: string
  productName: string
  quantity: number
  createdAt: string
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface ApiError {
  status: number
  error: string
  message: string
  timestamp: string
}
