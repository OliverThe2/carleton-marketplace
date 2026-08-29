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

const DISPLAY = { fontFamily: 'var(--font-display)' }

const STEPS = [
  {
    n: '01',
    title: 'Post Your Item',
    body: 'Fill out the form with details like the item name, price, your contact info, and a meeting spot on campus.',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7h9M4 12h6" />
        <path d="M17 9v6M14 12h6" />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Browse Listings',
    body: 'Check the marketplace to see what other students are selling. Use filters to sort by price, category, or location.',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="6" />
        <path d="M20 20l-4.2-4.2" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Connect With Buyers on Campus',
    body: 'Interested students will reach out using the contact info you provided to set up a meeting on campus.',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12a7 7 0 0 1-7 7H8l-4 3v-4.5A7 7 0 0 1 8 5h5a7 7 0 0 1 7 7Z" />
      </svg>
    ),
  },
  {
    n: '04',
    title: 'Mark It Sold',
    body: 'Once your item is sold, update your listing so it disappears from the marketplace.',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    ),
  },
]

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
          <span className="font-extrabold text-gray-900 text-lg hidden sm:block tracking-tight">Carleton <span className="text-red-600">Marketplace</span></span>
        </a>
        <div className="flex gap-2 items-center">
          <a href="/listings" className="text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100">Browse</a>
          <a href="/sell" className="bg-red-600 text-white text-sm px-4 py-2 rounded-xl font-semibold hover:bg-red-700 transition">+ Sell Item</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-red-600 px-4 py-24 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-center">
          <div>
            <div className="inline-block bg-red-700 rounded-full px-4 py-1.5 text-sm font-medium mb-7">
              🎓 For Carleton University Students
            </div>
            <h1 style={DISPLAY} className="text-6xl md:text-7xl font-black leading-[1.0] mb-7 tracking-tight">
              Buy. Sell. <span className="italic">Trade.</span><br />
              <span className="opacity-90">All in One Place.</span>
            </h1>
            <p className="text-lg opacity-80 mb-8 max-w-md leading-relaxed">
              Your student marketplace for textbooks, merch, and more. 100% Carleton.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href="/listings" className="bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition">Browse Listings</a>
              <a href="/sell" className="border-2 border-white text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition">Sell an Item</a>
            </div>
          </div>

          <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-xl">
            <span className="inline-block bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-4">Starting this fall</span>
            <h2 style={DISPLAY} className="text-2xl font-black leading-tight mb-3 tracking-tight">New to Carleton?</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-5">
              Buy your first-year textbooks from students who just finished the course — for a fraction of bookstore prices.
            </p>
            <a href="/listings?category=Textbooks" className="block text-center bg-red-600 text-white font-bold text-sm px-5 py-3 rounded-xl hover:bg-red-700 transition">Browse textbooks →</a>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto">
          {['All','Textbooks','Clothing','Electronics','Furniture','School Supplies','Miscellaneous'].map(cat => (
            <a key={cat} href={`/listings?category=${cat}`} className="whitespace-nowrap px-3 py-1.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition">
              {cat}
            </a>
          ))}
        </div>
      </section>

      {/* LISTINGS */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Recent Listings</h2>
          <a href="/listings" className="text-sm text-red-600 font-semibold hover:underline">See all →</a>
        </div>
        {listings.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl">
            <p className="text-4xl mb-3">🏷️</p>
            <p className="text-gray-500 text-sm mb-4">No listings yet — be the first to post!</p>
            <a href="/sell" className="inline-block bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700">Sell an Item</a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {listings.map(listing => {
              const imageUrls = Array.isArray(listing.image_urls) ? listing.image_urls : []
              return (
                <a key={listing.id} href={`/listing/${listing.slug}`} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition cursor-pointer block">
                  {imageUrls.length > 0 ? (
                    <img src={imageUrls[0]} alt={listing.title} className="w-full aspect-[4/3] object-cover" />
                  ) : (
                    <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center text-4xl">🏷️</div>
                  )}
                  <div className="p-3">
                    <p className="font-extrabold text-gray-900 text-lg tracking-tight">${listing.price}</p>
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
      <section className="bg-white px-4 py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* LEFT */}
          <div>
            <div className="bg-red-600 rounded-3xl overflow-hidden aspect-square">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                <circle cx="310" cy="120" r="135" fill="#fff" opacity="0.09" />
                <circle cx="95" cy="300" r="105" fill="#fff" opacity="0.09" />
                <circle cx="62" cy="128" r="11" fill="#fff" opacity="0.5" />
                <circle cx="330" cy="315" r="15" fill="#fff" opacity="0.35" />
                <g opacity="0.16" transform="rotate(-24 108 62)">
                  <path d="M56 62 C56 34 84 20 112 20 C112 48 92 62 56 62 Z" fill="#fff" />
                </g>

                <g transform="rotate(-7 200 200)">
                  <rect x="58" y="112" width="286" height="176" rx="22" fill="#fff" />
                  <rect x="84" y="138" width="92" height="92" rx="16" fill="#FBE3E5" />
                  <rect x="104" y="158" width="22" height="52" rx="5" fill="#fff" />
                  <rect x="134" y="158" width="22" height="52" rx="5" fill="#fff" />
                  <rect x="196" y="146" width="122" height="15" rx="7.5" fill="#16161E" />
                  <rect x="196" y="176" width="94" height="11" rx="5.5" fill="#E6E4EA" />
                  <rect x="196" y="202" width="72" height="24" rx="12" fill="#DC2626" />
                  <rect x="212" y="211" width="40" height="6" rx="3" fill="#fff" />
                  <rect x="196" y="242" width="110" height="11" rx="5.5" fill="#E6E4EA" />
                </g>

                <g transform="rotate(5 200 200)">
                  <rect x="86" y="272" width="232" height="74" rx="26" fill="#fff" />
                  <circle cx="124" cy="309" r="23" fill="#FBE3E5" />
                  <path d="M114 309 l7 7 l14 -15" fill="none" stroke="#DC2626" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="160" y="294" width="112" height="13" rx="6.5" fill="#16161E" />
                  <rect x="160" y="318" width="70" height="10" rx="5" fill="#E6E4EA" />
                  <circle cx="294" cy="309" r="15" fill="#16161E" />
                </g>
              </svg>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <img src="/logo.png" alt="" className="w-12 h-12" />
              <span style={DISPLAY} className="text-2xl font-black tracking-tight text-gray-900">Carleton <span className="text-red-600">Marketplace</span></span>
            </div>

            <div className="bg-[#FAF6F5] rounded-2xl p-6 mt-6">
              <div className="flex items-baseline gap-3">
                <span style={DISPLAY} className="text-5xl font-black text-red-600 tracking-tight">$0</span>
                <span className="text-sm text-gray-500 font-medium">to list, to sell, to use</span>
              </div>
              <div className="border-t border-gray-200 my-5" />
              <ul className="space-y-3">
                {['Carleton students only', 'Meet on campus, no shipping', 'Textbooks, merch, furniture and more'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-md bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <span className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-xs font-bold px-4 py-2 rounded-full mb-6">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" /></svg>
              Free to list · Free to sell
            </span>

            <h2 style={DISPLAY} className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.05] mb-5">
              How Selling on Carleton Marketplace Works
            </h2>

            <p className="text-gray-500 leading-relaxed mb-10 max-w-md">
              Four steps, start to finish. No fees, no shipping, no strangers — just students meeting on campus.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STEPS.map((s, i) => {
                const dark = i === 3
                return (
                  <div key={s.n} className={`relative rounded-2xl p-6 ${dark ? 'bg-[#1A1A22]' : 'bg-[#FAF6F5]'}`}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${dark ? 'bg-red-600 text-white' : 'bg-white text-red-600'}`}>
                      {s.icon}
                    </div>
                    <span style={DISPLAY} className={`absolute top-5 right-6 text-2xl font-black ${dark ? 'text-white/25' : 'text-gray-300'}`}>{s.n}</span>
                    <h3 className={`font-bold mb-2 leading-snug ${dark ? 'text-white' : 'text-gray-900'}`}>{s.title}</h3>
                    <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{s.body}</p>
                  </div>
                )
              })}
            </div>

            <a href="/sell" className="inline-block mt-8 bg-red-600 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-red-700 transition">
              Sell an Item →
            </a>
          </div>

        </div>
      </section>

      {/* ABOUT US */}
      <section className="bg-gray-50 border-t border-gray-100 px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">About Us</h2>
          <p className="text-gray-600 leading-relaxed mb-4 max-w-4xl">
            Carleton Marketplace is a student-built platform created to help Carleton University students in Ottawa buy and sell textbooks, find housing, and connect with other students. Our goal is to simplify student transactions by providing a free, centralized marketplace tailored to the Carleton community.
          </p>
          <p className="text-sm font-bold text-gray-900 bg-gray-100 rounded-xl p-4 border border-gray-200">
            We are not associated in any way, shape, or form with Carleton University.
          </p>

          <h3 className="text-xl font-extrabold text-gray-900 mt-10 mb-3 tracking-tight">Marketplace for Carleton Students in Ottawa</h3>
          <p className="text-gray-600 leading-relaxed max-w-4xl">
            This platform is designed for students at Carleton University looking to buy textbooks, sell used items, or find housing and sublets in Ottawa. By focusing on the Carleton community, listings remain relevant and easy to browse.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 px-4 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Carleton Marketplace" width={32} height={32} className="rounded-lg" />
            <span className="font-extrabold text-gray-900 text-sm">Carleton <span className="text-red-600">Marketplace</span></span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600">About</a>
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600">How it Works</a>
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600">Disclaimer</a>
          </div>
          <span className="text-xs text-gray-400">© 2026 · For Carleton students</span>
        </div>
      </footer>

    </main>
  )
}