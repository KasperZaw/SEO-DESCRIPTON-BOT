function ProductDetails({ product }) {
  if (!product) {
    return (
      <section className="panel empty-state">
        <p>Wybierz produkt, aby zobaczyć jego opis.</p>
      </section>
    )
  }

  const hasGeneratedDescription = Boolean(product.generatedDescription)

  return (
    <section className="panel details-panel">
      <div className="details-header">
        <div>
          <p className="eyebrow">Podgląd produktu</p>
          <h2>{product.name}</h2>
          <p className="product-meta">WooCommerce ID: {product.wpProductId}</p>
        </div>
        <button className="primary-button" disabled={!hasGeneratedDescription} type="button">
          Opublikuj opis
        </button>
      </div>

      <div className="comparison-grid">
        <article className="description-card">
          <div className="description-label">
            <span>Obecny opis</span>
            <span className="soft-badge">Sklep</span>
          </div>
          <div className="description-content" dangerouslySetInnerHTML={{ __html: product.description }} />
        </article>

        <article className="description-card description-card--generated">
          <div className="description-label">
            <span>Nowy opis</span>
            <span className="soft-badge soft-badge--violet">AI draft</span>
          </div>
          {hasGeneratedDescription ? (
            <div
              className="description-content"
              dangerouslySetInnerHTML={{ __html: product.generatedDescription }}
            />
          ) : (
            <div className="generation-placeholder">
              <span className="placeholder-icon">✦</span>
              <strong>Opis nie został jeszcze wygenerowany</strong>
              <p>Uruchom generowanie, aby utworzyć wersję roboczą.</p>
              <button className="secondary-button" type="button">Generuj opis</button>
            </div>
          )}
        </article>
      </div>

      <div className="short-description-block">
        <div className="description-label">
          <span>Krótki opis AI</span>
        </div>
        <p>{product.generatedShortDescription || 'Brak wygenerowanego krótkiego opisu.'}</p>
      </div>
    </section>
  )
}

export default ProductDetails
