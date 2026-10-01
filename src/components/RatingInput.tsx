const RATINGS = [1, 2, 3, 4, 5]

function RatingInput({ value, onChange }: { value: number; onChange: (rating: number) => void }) {
  return (
    <div className="flex gap-1">
      {RATINGS.map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => onChange(rating)}
          aria-pressed={value === rating}
          aria-label={`Rate ${rating} of 5`}
          className={
            value === rating
              ? 'h-9 w-9 rounded bg-blue-600 text-sm font-medium text-white focus:ring-2 focus:ring-blue-600 focus:outline-none'
              : 'h-9 w-9 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-blue-600 focus:outline-none'
          }
        >
          {rating}
        </button>
      ))}
    </div>
  )
}

export default RatingInput
