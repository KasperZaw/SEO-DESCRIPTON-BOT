function AppHeader({ shopName }) {
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
      <button className="secondary-button" type="button">
        Odśwież produkty
      </button>
    </header>
  )
}

export default AppHeader
