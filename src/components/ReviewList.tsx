import type { Review } from '../types'

function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="mt-3 text-sm text-gray-600">No reviews yet.</p>
  }

  return (
    <ul className="mt-3 flex flex-col gap-3">
      {reviews.map((review) => (
        <li key={review.id} className="rounded border border-gray-300 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-900">{review.authorName}</span>
            <span className="text-gray-600">{review.rating}/5</span>
          </div>

          {review.comment && <p className="mt-1 text-sm text-gray-600">{review.comment}</p>}

          <p className="mt-1 text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString('pt-BR')}</p>
        </li>
      ))}
    </ul>
  )
}

export default ReviewList
