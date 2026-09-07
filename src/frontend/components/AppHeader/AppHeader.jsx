function AppHeader({ shopName, onRefresh, onGenerateAll, onPublishAll, activeAction }) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Workspace</p>
        <h1>AI Description Bot</h1>
        <p className="shop-name">
          <span className="shop-indicator" aria-hidden="true" />
          Aktualny sklep: <strong>{shopName}</strong>
        </p>
      </div>
      <div className="header-actions">
        <button className="secondary-button" disabled={Boolean(activeAction)} type="button" onClick={onRefresh}>
          {activeAction === 'refresh' ? 'Odświeżanie…' : 'Odśwież produkty'}
        </button>
        <button className="secondary-button" disabled={Boolean(activeAction)} type="button" onClick={onGenerateAll}>
          {activeAction === 'generate' ? 'Generowanie…' : 'Generuj wszystkie opisy'}
        </button>
        <button className="primary-button" disabled={Boolean(activeAction)} type="button" onClick={onPublishAll}>
          {activeAction === 'publish' ? 'Publikowanie…' : 'Opublikuj wszystkie opisy'}
        </button>
      </div>
    </header>
  )
}

export default AppHeader
