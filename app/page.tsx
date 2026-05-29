'use client'

import { useEffect, useState } from 'react'

type Listing = {
  id: string
  title: string
  slug: string
  price: string
  condition: string
  category: string
  created_at: string
  image_urls: string[]
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([])

  useEffect(() => {
    fetch('/api/listings')
      .then(r => r.json())
      .then(data => {
        if (data.success) setListings(data.listings.slice(0, 4))
      })
  }, [])

  return (
    <main className="min-h-screen bg-white">

      {/* NAV */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-black text-red-600">Carleton<span className="text-gray-900">Marketplace</span></span>
        <div className="flex gap-6 items-center">
          <a href="/listings" className="text-sm text-gray-600 hover:text-gray-900">Browse</a>
          <a href="/housing" className="text-sm text-gray-600 hover:text-gray-900">Housing</a>
          <a href="/sell" className="bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700">Sell Item</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-red-600 px-8 py-20 text-white">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4 opacity-80">Carleton University Students</p>
          <h1 className="text-5xl font-black leading-tight mb-6">Buy. Sell. Sublet.<br />All in One Place.</h1>
          <p className="text-lg opacity-80 mb-8 max-w-md">Your student marketplace for textbooks, merch, housing, and more. 100% Carleton.</p>
          <div className="flex gap-4 flex-wrap">
            <a href="/listings" className="bg-white text-red-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100">Browse Listings</a>
            <a href="/sell" className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700">Sell an Item</a>
            <a href="/housing" className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700">Browse & Post Housing</a>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-white border-b border-gray-200 px-6 py-4 flex gap-2 overflow-x-auto">
        {['All','Textbooks','Clothing','Electronics','Furniture','School Supplies','Housing','Miscellaneous'].map(cat => (
          <a key={cat} href={`/listings?category=${cat}`} className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border border-gray-200 text-gray-600 hover:border-red-600 hover:text-red-600">{cat}</a>
        ))}
      </section>

      {/* REAL LISTINGS */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-gray-900">Recent Listings</h2>
          <a href="/listings" className="text-sm text-red-600 font-medium hover:underline">See all →</a>
        </div>
        {listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No listings yet — be the first to post!</p>
            <a href="/sell" className="inline-block mt-4 bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700">Sell an Item</a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.map(listing => {
              const imageUrls = Array.isArray(listing.image_urls) ? listing.image_urls : []
              return (
                <a key={listing.id} href={`/listing/${listing.slug}`} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer block">
                  {imageUrls.length > 0 ? (
                    <img src={imageUrls[0]} alt={listing.title} className="w-full aspect-square object-cover" />
                  ) : (
                    <div className="aspect-square bg-gray-100 flex items-center justify-center text-4xl">🏷️</div>
                  )}
                  <div className="p-3">
                    <p className="font-black text-gray-900 text-base">${listing.price}</p>
                    <p className="text-sm text-gray-500 truncate mt-0.5">{listing.title}</p>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full mt-1 inline-block">{listing.condition}</span>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </section>

      {/* HOUSING CTA */}
      <section className="bg-gray-50 border-t border-gray-200 px-6 py-12">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Looking for housing or a roommate?</h2>
            <p className="text-gray-500 text-sm">Browse sublets and roommate listings near Carleton.</p>
          </div>
          <a href="/housing" className="bg-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700">Browse Housing →</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 px-6 py-6 flex items-center justify-between flex-wrap gap-4">
        <span className="font-black text-red-600 text-sm">CarletonMarketplace</span>
        <div className="flex gap-4">
          <a href="#" className="text-xs text-gray-400 hover:text-gray-600">About</a>
          <a href="#" className="text-xs text-gray-400 hover:text-gray-600">How it Works</a>
          <a href="#" className="text-xs text-gray-400 hover:text-gray-600">Disclaimer</a>
        </div>
        <span className="text-xs text-gray-400">© 2025 · For Carleton students</span>
      </footer>

    </main>
  )
}