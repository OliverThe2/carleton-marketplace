'use client'

import { useEffect, useState } from 'react'

const CATEGORIES = ['All', 'Textbooks', 'Clothing', 'Electronics', 'Furniture', 'School Supplies', 'Miscellaneous']

const CONDITIONS: Record<string, string> = {
  'New': 'bg-green-100 text-green-800',
  'Like new': 'bg-blue-100 text-blue-800',
  'Good': 'bg-blue-100 text-blue-800',
  'Fair': 'bg-yellow-100 text-yellow-800',
  'For parts': 'bg-gray-100 text-gray-600',
}

type Listing = {
  id: string
  title: string
  slug: string
  price: string
  condition: string
  seller_name: string
  category: string
  created_at: string
  image_urls: string[]
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    fetch('/api/listings')
      .then(r => r.json())
      .then(data => {
        if (data.success) setListings(data.listings)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = listings
    .filter(l => category === 'All' || l.category === category)
    .filter(l => l.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sort === 'price-low') return parseFloat(a.price) - parseFloat(b.price)
      if (sort === 'price-high') return parseFloat(b.price) - parseFloat(a.price)
      return 0
    })

  return (
    <main className="min-h-screen bg-gray-50">

      {/* NAV */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Carleton Marketplace" width={44} height={44} className="rounded-lg" />
          <span className="font-black text-gray-900 text-lg hidden sm:block">Carleton <span className="text-red-600">Marketplace</span></span>
        </a>
        <a href="/sell" className="bg-red-600 text-white text-sm px-4 py-2 rounded-xl font-semibold hover:bg-red-700 transition">+ Sell Item</a>
      </nav>

      {/* SEARCH BAR */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-6xl mx-auto flex gap-3 items-center">
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500"
          />
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-500 bg-white"
          >
            <option value="newest">Newest first</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="bg-white border-b border-gray-100 px-4 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex gap-2 w-full">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition ${category === cat ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* LISTINGS GRID */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading && (
          <div className="text-center py-20 text-gray-400 text-sm">Loading listings...</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-gray-500 text-sm">No listings found. Try a different search or category.</p>
            <a href="/sell" className="inline-block mt-4 bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-red-700">Be the first to post</a>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <p className="text-xs text-gray-400 mb-4">{filtered.length} listing{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(listing => {
                const imageUrls = Array.isArray(listing.image_urls) ? listing.image_urls : []
                return (
                  <a key={listing.id} href={`/listing/${listing.slug}`} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition cursor-pointer block">
                    {imageUrls.length > 0 ? (
                      <img src={imageUrls[0]} alt={listing.title} className="w-full aspect-square object-cover" />
                    ) : (
                      <div className="aspect-square bg-gray-50 flex items-center justify-center text-4xl">🏷️</div>
                    )}
                    <div className="p-3">
                      <p className="font-black text-gray-900 text-base">${listing.price}</p>
                      <p className="text-sm font-semibold text-gray-900 truncate mt-0.5">{listing.title}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CONDITIONS[listing.condition] || 'bg-gray-100 text-gray-600'}`}>
                          {listing.condition}
                        </span>
                        <span className="text-xs text-gray-400">{timeAgo(listing.created_at)}</span>
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
          </>
        )}
      </div>

    </main>
  )
}