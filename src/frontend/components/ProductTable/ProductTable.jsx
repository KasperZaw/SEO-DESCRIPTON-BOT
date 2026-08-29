const filters = [
  { id: 'all', label: 'Wszystkie' },
  { id: 'queued', label: 'Oczekujące' },
  { id: 'generated', label: 'Wygenerowane' },
]

function ProductTable({ products, activeFilter, selectedId, onFilterChange, onSelect }) {
  return (
    <section className="panel product-list-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Katalog</p>
          <h2>Produkty</h2>
        </div>
        <span className="result-count">{products.length}</span>
      </div>

      <div className="filter-tabs" aria-label="Filtry produktów">
        {filters.map((filter) => (
          <button
            className={activeFilter === filter.id ? 'filter-tab is-active' : 'filter-tab'}
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            type="button"
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="product-list">
        {products.map((product) => (
          <button
            className={selectedId === product.id ? 'product-row is-selected' : 'product-row'}
            key={product.id}
            onClick={() => onSelect(product.id)}
            type="button"
          >
            <span className="product-main">
              <strong>{product.name}</strong>
              <small>WooCommerce ID: {product.wpProductId}</small>
            </span>
            <span className={`status-pill status-pill--${product.aiStatus}`}>
              {product.aiStatus === 'generated' ? 'Gotowy' : 'Oczekuje'}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default ProductTable
