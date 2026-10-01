import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ApiRequestError, createOrder, getProduct, listReviews } from '../api'
import ReviewList from '../components/ReviewList'
import type { Product, Review } from '../types'

const priceFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [buying, setBuying] = useState(false)
  const [orderMessage, setOrderMessage] = useState('')
  const [orderError, setOrderError] = useState('')

  useEffect(() => {
    if (!id) {
      return
    }

    const productId = id

    async function load() {
      setLoading(true)
      setError('')
      setOrderMessage('')
      setOrderError('')

      try {
        const [productResponse, reviewsResponse] = await Promise.all([
          getProduct(productId),
          listReviews(productId, 0),
        ])
        setProduct(productResponse)
        setReviews(reviewsResponse.content)
      } catch (err) {
        setError(err instanceof ApiRequestError ? err.message : 'Could not reach the API')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  async function handleBuy() {
    if (!product) {
      return
    }

    setBuying(true)
    setOrderMessage('')
    setOrderError('')

    try {
      await createOrder(product.id)
      setOrderMessage('Order placed — you can review it now.')
    } catch (err) {
      setOrderError(err instanceof ApiRequestError ? err.message : 'Could not reach the API')
    } finally {
      setBuying(false)
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      {loading && <p className="text-sm text-gray-600">Loading product...</p>}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && product && (
        <>
          <h1 className="text-2xl font-semibold text-blue-600">{product.name}</h1>

          {product.description && <p className="mt-2 text-sm text-gray-600">{product.description}</p>}

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-lg font-medium text-gray-900">{priceFormatter.format(product.price)}</span>
            <span className="text-gray-600">
              {product.reviewCount === 0
                ? 'No reviews yet'
                : `${product.averageRating.toFixed(1)} (${product.reviewCount} ${product.reviewCount === 1 ? 'review' : 'reviews'})`}
            </span>
          </div>

          <button
            type="button"
            onClick={handleBuy}
            disabled={buying}
            className="mt-4 rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {buying ? 'Placing order...' : 'Buy'}
          </button>

          {orderMessage && <p className="mt-2 text-sm text-blue-600">{orderMessage}</p>}

          {orderError && <p className="mt-2 text-sm text-red-600">{orderError}</p>}

          <h2 className="mt-8 font-semibold text-gray-900">Reviews</h2>
          <ReviewList reviews={reviews} />
        </>
      )}
    </main>
  )
}

export default ProductDetail
