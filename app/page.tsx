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
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Carleton Marketplace" width={44} height={44} className="rounded-lg" />
          <span className="font-black text-gray-900 text-lg hidden sm:block">Carleton <span className="text-red-600">Marketplace</span></span>
        </a>
        <div className="flex gap-2 items-center">
          <a href="/listings" className="text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100">Browse</a>
          <a href="/housing" className="text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100">Housing</a>
          <a href="/sell" className="bg-red-600 text-white text-sm px-4 py-2 rounded-xl font-semibold hover:bg-red-700 transition">+ Sell Item</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-red-600 px-4 py-20 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <div className="inline-block bg-red-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              🎓 For Carleton University Students
            </div>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
              Buy. Sell. Sublet.<br />
              <span className="opacity-90">All in One Place.</span>
            </h1>
            <p className="text-lg opacity-80 mb-8 max-w-md leading-relaxed">
              Your student marketplace for textbooks, merch, housing, and more. 100% Carleton.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href="/listings" className="bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition">
                Browse Listings
              </a>
              <a href="/sell" className="border-2 border-white text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition">
                Sell an Item
              </a>
              <a href="/housing" className="border-2 border-white text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition">
                Browse Housing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto">
          {['All','Textbooks','Clothing','Electronics','Furniture','School Supplies','Housing','Miscellaneous'].map(cat => (
            <a key={cat} href={`/listings?category=${cat}`}
              className="whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition">
              {cat}
            </a>
          ))}
        </div>
      </section>

      {/* LISTINGS */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Recent Listings</h2>
          <a href="/listings" className="text-sm text-red-600 font-semibold hover:underline">See all →</a>
        </div>
        {listings.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <p className="text-4xl mb-3">🏷️</p>
            <p className="text-gray-500 text-sm mb-4">No listings yet — be the first to post!</p>
            <a href="/sell" className="inline-block bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700">Sell an Item</a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.map(listing => {
              const imageUrls = Array.isArray(listing.image_urls) ? listing.image_urls : []
              return (
                <a key={listing.id} href={`/listing/${listing.slug}`}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition cursor-pointer block">
                  {imageUrls.length > 0 ? (
                    <img src={imageUrls[0]} alt={listing.title} className="w-full aspect-square object-cover" />
                  ) : (
                    <div className="aspect-square bg-gray-50 flex items-center justify-center text-5xl">🏷️</div>
                  )}
                  <div className="p-3">
                    <p className="font-black text-gray-900 text-base">${listing.price}</p>
                    <p className="text-sm text-gray-500 truncate mt-0.5">{listing.title}</p>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full mt-2 inline-block">{listing.condition}</span>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </section>

      {/* HOW SELLING WORKS */}
      <section className="bg-white border-t border-gray-100 px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center justify-center">
              <img src="/logo.png" alt="Carleton Marketplace" className="w-80 h-80 object-contain" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-8">How Selling on Carleton Marketplace Works</h2>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-3xl mb-3">🛒</div>
                  <h3 className="font-black text-gray-900 mb-1">1. Post Your Item</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Fill out the form with details like the item name, price, your contact info, and a meeting spot on campus.</p>
                </div>
                <div>
                  <div className="text-3xl mb-3">🛍️</div>
                  <h3 className="font-black text-gray-900 mb-1">2. Browse Listings</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Check the marketplace to see what other students are selling. Use filters to sort by price, category, or location.</p>
                </div>
                <div>
                  <div className="text-3xl mb-3">🏫</div>
                  <h3 className="font-black text-gray-900 mb-1">3. Connect With Buyers on Campus</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Interested students will reach out using the contact info you provided to set up a meeting on campus.</p>
                </div>
                <div>
                  <div className="text-3xl mb-3">✅</div>
                  <h3 className="font-black text-gray-900 mb-1">4. Mark It Sold</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Once your item is sold, update your listing so it disappears from the marketplace.</p>
                </div>
              </div>
              <a href="/sell" className="inline-block mt-8 text-red-600 font-bold text-lg hover:underline">Sell Now →</a>
            </div>
          </div>
        </div>
      </section>

      {/* HOUSING CTA */}
      <section className="bg-red-600 px-4 py-16 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-black mb-3">Looking for housing?</h2>
          <p className="opacity-80 mb-6">Browse sublets and roommate listings near Carleton campus.</p>
          <a href="/housing" className="bg-white text-red-600 font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition inline-block">
            Browse Housing →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 px-4 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Carleton Marketplace" width={32} height={32} className="rounded-lg" />
            <span className="font-black text-gray-900 text-sm">Carleton <span className="text-red-600">Marketplace</span></span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600">About</a>
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600">How it Works</a>
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600">Disclaimer</a>
          </div>
          <span className="text-xs text-gray-400">© 2025 · For Carleton students</span>
        </div>
      </footer>

    </main>
  )
}