import { useEffect, useMemo, useState } from 'react'
import AppHeader from '../components/AppHeader/AppHeader.jsx'
import ProductDetails from '../components/ProductDetails/ProductDetails.jsx'
import ProductTable from '../components/ProductTable/ProductTable.jsx'
import StatusOverview from '../components/StatusOverview/StatusOverview.jsx'
import '../styles/app.css'

function App() {
  const [filter, setFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const [products, setProducts] = useState([])

  const filteredProducts = useMemo(() => {
    if (filter === 'all') return products
    return products.filter((product) => product.aiStatus === filter)
  }, [filter, products])

  const selectedProduct = products.find((product) => product.id === selectedId)

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/products')
      const data = await response.json()

      const formattedProducts = data.map((product) => ({
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

      setProducts(formattedProducts)
      setSelectedId((currentId) => currentId ?? formattedProducts[0]?.id ?? null)
    }

    fetchProducts()
  }, [])

  return (
    <div className="app-shell">
      <AppHeader shopName="test.sklep-swiateczny.pl" />
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
