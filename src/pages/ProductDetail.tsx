import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { ApiRequestError, createOrder, createReview, getProduct, listReviews } from '../api'
import Pagination from '../components/Pagination'
import RatingInput from '../components/RatingInput'
import ReviewList from '../components/ReviewList'
import type { Page, Product, Review } from '../types'

const priceFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function ProductDetail({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Page<Review> | null>(null)
  const [reviewsPage, setReviewsPage] = useState(0)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [productError, setProductError] = useState('')
  const [reviewsError, setReviewsError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [buying, setBuying] = useState(false)
  const [orderMessage, setOrderMessage] = useState('')
  const [orderError, setOrderError] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [reviewError, setReviewError] = useState('')

  useEffect(() => {
    let ignore = false

    async function load() {
      setProductError('')

      try {
        const productResponse = await getProduct(productId)
        if (ignore) return
        setProduct(productResponse)
        document.title = `${productResponse.name} — Purchase Review`
      } catch (err) {
        if (ignore) return
        setProductError(err instanceof ApiRequestError ? err.message : 'Could not reach the API')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [productId, reloadKey])

  useEffect(() => {
    let ignore = false

    async function load() {
      setReviewsError('')
      setReviewsLoading(true)

      try {
        const reviewsResponse = await listReviews(productId, reviewsPage)
        if (ignore) return
        setReviews(reviewsResponse)
      } catch (err) {
        if (ignore) return
        setReviewsError(err instanceof ApiRequestError ? err.message : 'Could not reach the API')
      } finally {
        if (!ignore) setReviewsLoading(false)
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [productId, reviewsPage, reloadKey])

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

    try {
      await createReview(product.id, rating, comment.trim())
      setReviewSubmitted(true)
      setReviewsPage(0)
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

      {productError && (
        <p role="alert" className="text-sm text-red-600">
          {productError}
        </p>
      )}

      {!loading && !productError && product && (
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

          {orderError && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {orderError}
            </p>
          )}

          <h2 className="mt-8 font-semibold text-gray-900">Reviews</h2>

          {reviewsError && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {reviewsError}
            </p>
          )}

          {!reviewsError && reviews && (
            <>
              <ReviewList reviews={reviews.content} />

              {reviews.content.length > 0 && (
                <Pagination
                  page={reviewsPage}
                  first={reviews.first}
                  last={reviews.last}
                  disabled={reviewsLoading}
                  onChange={setReviewsPage}
                />
              )}
            </>
          )}

          <h2 className="mt-8 font-semibold text-gray-900">Write a review</h2>

          {reviewSubmitted ? (
            <p className="mt-3 text-sm text-gray-600">Thanks — your review is listed above.</p>
          ) : (
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

              {reviewError && (
                <p role="alert" className="text-sm text-red-600">
                  {reviewError}
                </p>
              )}

              <button
                type="submit"
                disabled={submittingReview}
                className="self-start rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit review'}
              </button>
            </form>
          )}
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
