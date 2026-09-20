import type { Product } from '../types'

const priceFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded border border-gray-300 p-4">
      <h2 className="font-semibold text-gray-900">{product.name}</h2>
      {product.description && <p className="mt-1 text-sm text-gray-600">{product.description}</p>}
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="font-medium text-gray-900">{priceFormatter.format(product.price)}</span>
        <span className="text-gray-600">
          {product.reviewCount === 0
            ? 'No reviews yet'
            : `${product.averageRating.toFixed(1)} (${product.reviewCount} ${product.reviewCount === 1 ? 'review' : 'reviews'})`}
        </span>
      </div>
    </article>
  )
}

export default ProductCard
