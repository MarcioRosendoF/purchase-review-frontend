interface PaginationProps {
  page: number
  first: boolean
  last: boolean
  disabled?: boolean
  onChange: (page: number) => void
}

function Pagination({ page, first, last, disabled = false, onChange }: PaginationProps) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={first || disabled}
        className="rounded border border-gray-300 px-3 py-1 text-sm font-medium hover:bg-gray-100 disabled:opacity-50 focus:ring-2 focus:ring-blue-600 focus:outline-none"
      >
        Previous
      </button>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={last || disabled}
        className="rounded border border-gray-300 px-3 py-1 text-sm font-medium hover:bg-gray-100 disabled:opacity-50 focus:ring-2 focus:ring-blue-600 focus:outline-none"
      >
        Next
      </button>
    </div>
  )
}

export default Pagination
