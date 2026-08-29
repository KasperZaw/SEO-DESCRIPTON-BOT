import { useMemo, useState } from 'react'
import AppHeader from '../components/AppHeader/AppHeader.jsx'
import ProductDetails from '../components/ProductDetails/ProductDetails.jsx'
import ProductTable from '../components/ProductTable/ProductTable.jsx'
import StatusOverview from '../components/StatusOverview/StatusOverview.jsx'
import '../styles/app.css'

const mockProducts = [
  {
    id: 1,
    wpProductId: 97,
    name: 'Zestaw do pakowania prezentów 30 el.',
    aiStatus: 'generated',
    publishStatus: 'draft',
    description: '<p>Zestaw zawiera podstawowe akcesoria potrzebne do zapakowania kilku prezentów w spójnym stylu.</p>',
    generatedDescription: '<h2>Zestaw do pakowania prezentów 30 elementów</h2><p>Wszystko, czego potrzebujesz do estetycznego przygotowania kilku upominków, znajduje się w jednym zestawie.</p>',
    shortDescription: 'Podstawowy zestaw akcesoriów do pakowania prezentów.',
    generatedShortDescription: 'Zestaw do pakowania prezentów zawiera 30 dopasowanych elementów.',
  },
  {
    id: 2,
    wpProductId: 96,
    name: 'Pudełko prezentowe Czerwone M',
    aiStatus: 'generated',
    publishStatus: 'draft',
    description: '<p>Sztywna konstrukcja chroni zawartość i nie wymaga dodatkowego papieru.</p>',
    generatedDescription: '<h2>Czerwone pudełko prezentowe M</h2><p>Sztywne pudełko pozwala zapakować upominek bez używania dodatkowego papieru.</p>',
    shortDescription: 'Czerwone pudełko prezentowe w rozmiarze M.',
    generatedShortDescription: 'Czerwone pudełko prezentowe M ze sztywną konstrukcją chroni zawartość.',
  },
  {
    id: 3,
    wpProductId: 93,
    name: 'Sznurek jutowy z gwiazdkami 10 m',
    aiStatus: 'queued',
    publishStatus: 'draft',
    description: '<p>Dekoracyjny sznurek pasuje do papieru kraftowego.</p>',
    generatedDescription: '',
    shortDescription: 'Jutowy sznurek dekoracyjny.',
    generatedShortDescription: '',
  },
]

function App() {
  const [filter, setFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(mockProducts[0].id)

  const filteredProducts = useMemo(() => {
    if (filter === 'all') return mockProducts
    return mockProducts.filter((product) => product.aiStatus === filter)
  }, [filter])

  const selectedProduct = mockProducts.find((product) => product.id === selectedId)

  return (
    <div className="app-shell">
      <AppHeader shopName="test.sklep-swiateczny.pl" />
      <main className="main-content">
        <StatusOverview products={mockProducts} />
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
