function StatusOverview({ products }) {
  const generated = products.filter((product) => product.aiStatus === 'generated').length
  const queued = products.filter((product) => product.aiStatus === 'queued').length
  const published = products.filter((product) => product.publishStatus === 'published').length

  const cards = [
    { label: 'Wszystkie produkty', value: products.length, tone: 'blue' },
    { label: 'Czekają na AI', value: queued, tone: 'amber' },
    { label: 'Wygenerowane', value: generated, tone: 'violet' },
    { label: 'Opublikowane', value: published, tone: 'mint' },
  ]

  return (
    <section className="status-grid" aria-label="Podsumowanie statusów">
      {cards.map((card) => (
        <article className={`status-card status-card--${card.tone}`} key={card.label}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
        </article>
      ))}
    </section>
  )
}

export default StatusOverview
