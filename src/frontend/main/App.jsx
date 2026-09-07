import { useEffect, useMemo, useState } from 'react'
import AppHeader from '../components/AppHeader/AppHeader.jsx'
import ProductDetails from '../components/ProductDetails/ProductDetails.jsx'
import ProductTable from '../components/ProductTable/ProductTable.jsx'
import StatusOverview from '../components/StatusOverview/StatusOverview.jsx'
import '../styles/app.css'

const fetchProducts = async () => {
  const response = await fetch('/api/products')
  if (!response.ok) throw new Error(`API HTTP ${response.status}`)

  const data = await response.json()
  return data.map((product) => ({
    id: product.id,
    wpProductId: product.wp_product_id,
    name: product.name,
    description: product.description ?? '',
    shortDescription: product.short_description ?? '',
    generatedDescription: product.generated_description ?? '',
    generatedShortDescription: product.generated_short_description ?? '',
    aiStatus: product.ai_status,
    publishStatus: product.publish_status,
  }))
}

function App() {
  const [filter, setFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const [products, setProducts] = useState([])
  const [activeAction, setActiveAction] = useState(null)

  const filteredProducts = useMemo(() => {
    if (filter === 'all') return products
    return products.filter((product) => product.aiStatus === filter)
  }, [filter, products])

  const selectedProduct = products.find((product) => product.id === selectedId)

  useEffect(() => {
    const loadProducts = async () => {
      const formattedProducts = await fetchProducts()
      setProducts(formattedProducts)
      setSelectedId((currentId) => currentId ?? formattedProducts[0]?.id ?? null)
    }

    loadProducts().catch(console.error)
  }, [])

  const runAction = async (action, endpoint) => {
    setActiveAction(action)
    try {
      const response = await fetch(endpoint, { method: 'POST' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || `API HTTP ${response.status}`)

      const refreshedProducts = await fetchProducts()
      setProducts(refreshedProducts)
      console.log(result)
    } catch (error) {
      console.error(error)
      window.alert(error instanceof Error ? error.message : 'Wystąpił błąd')
    } finally {
      setActiveAction(null)
    }
  }

  return (
    <div className="app-shell">
      <AppHeader
        shopName="test.sklep-swiateczny.pl"
        onRefresh={() => runAction('refresh', '/api/refresh')}
        onGenerateAll={() => runAction('generate', '/api/descriptions/generate-all')}
        onPublishAll={() => runAction('publish', '/api/descriptions/publish-all')}
        activeAction={activeAction}
      />
      <main className="main-content">
        <StatusOverview products={products} />
        <section className="workspace" aria-label="Produkty i podgląd opisu">
          <ProductTable
            products={filteredProducts}
            activeFilter={filter}
            selectedId={selectedId}
            onFilterChange={setFilter}
            onSelect={setSelectedId}
          />
          <ProductDetails product={selectedProduct} />
        </section>
      </main>
    </div>
  )
}

export default App
