import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { ApiRequestError, createOrder, createReview, getProduct, listReviews } from '../api'
import RatingInput from '../components/RatingInput'
import ReviewList from '../components/ReviewList'
import type { Product, Review } from '../types'

const priceFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function ProductDetail({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [buying, setBuying] = useState(false)
  const [orderMessage, setOrderMessage] = useState('')
  const [orderError, setOrderError] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewMessage, setReviewMessage] = useState('')
  const [reviewError, setReviewError] = useState('')

  useEffect(() => {
    async function load() {
      setError('')

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
  }, [productId, reloadKey])

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

  async function handleReviewSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!product) {
      return
    }

    if (rating < 1 || rating > 5) {
      setReviewError('Select a rating from 1 to 5.')
      return
    }

    setSubmittingReview(true)
    setReviewError('')
    setReviewMessage('')

    try {
      await createReview(product.id, rating, comment.trim())
      setRating(0)
      setComment('')
      setReviewMessage('Review submitted.')
      setReloadKey((current) => current + 1)
    } catch (err) {
      setReviewError(err instanceof ApiRequestError ? err.message : 'Could not reach the API')
    } finally {
      setSubmittingReview(false)
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

          <h2 className="mt-8 font-semibold text-gray-900">Write a review</h2>

          <form onSubmit={handleReviewSubmit} className="mt-3 flex flex-col gap-3">
            <div className="flex flex-col gap-1 text-sm font-medium">
              Rating
              <RatingInput value={rating} onChange={setRating} />
            </div>

            <label className="flex flex-col gap-1 text-sm font-medium">
              Comment (optional)
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={3}
                className="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </label>

            {reviewError && <p className="text-sm text-red-600">{reviewError}</p>}

            {reviewMessage && <p className="text-sm text-blue-600">{reviewMessage}</p>}

            <button
              type="submit"
              disabled={submittingReview}
              className="self-start rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submittingReview ? 'Submitting...' : 'Submit review'}
            </button>
          </form>
        </>
      )}
    </main>
  )
}

function ProductDetailRoute() {
  const { id } = useParams()

  if (!id) {
    return null
  }

  return <ProductDetail key={id} productId={id} />
}

export default ProductDetailRoute
