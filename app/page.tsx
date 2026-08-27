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

const INK = '#16100F'
const RED = '#C1121F'
const RULE = '#E7DCDD'
const BLUSH = '#FBEEEF'
const MUTED = '#8A8482'

function Ziggurat({ color = RED, className = '' }: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 160 24" width="160" height="24" className={className} aria-hidden="true">
      <g fill={color}>
        <rect x="76" y="0" width="8" height="24" />
        <rect x="64" y="6" width="8" height="18" />
        <rect x="88" y="6" width="8" height="18" />
        <rect x="52" y="12" width="8" height="12" />
        <rect x="100" y="12" width="8" height="12" />
        <rect x="40" y="18" width="8" height="6" />
        <rect x="112" y="18" width="8" height="6" />
      </g>
    </svg>
  )
}

function DoubleRule({ color = RULE }: { color?: string }) {
  return (
    <div aria-hidden="true">
      <div style={{ borderTop: `2px solid ${color}` }} />
      <div className="mt-[3px]" style={{ borderTop: `1px solid ${color}` }} />
    </div>
  )
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
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur" style={{ borderBottom: `1px solid ${RULE}` }}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="" width={34} height={34} />
            <span style={DISPLAY} className="text-xl tracking-tight">
              Carleton <span className="italic" style={{ color: RED }}>Marketplace</span>
            </span>
          </a>
          <div className="flex items-center gap-6">
            
              href="/listings"
              className="hidden sm:block text-[11px] uppercase tracking-[0.22em] hover:opacity-60 transition-opacity"
            >
              Browse
            </a>
            
              href="/sell"
              className="text-[11px] uppercase tracking-[0.22em] text-white px-5 py-2.5 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: RED }}
            >
              Sell an item
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-5 pt-16 pb-14 sm:pt-24 sm:pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.32em]" style={{ color: MUTED }}>
            Carleton University · Ottawa
          </p>

          <div className="flex justify-center mt-7 mb-7">
            <Ziggurat />
          </div>

          <h1 style={DISPLAY} className="text-5xl sm:text-7xl leading-[0.95] tracking-tight">
            Buy. Sell.
            <br />
            <span className="italic" style={{ color: RED }}>Trade.</span>
          </h1>

          <p className="mt-7 text-base sm:text-lg font-light max-w-md mx-auto" style={{ color: '#4A4442' }}>
            Textbooks, Ravens merch, and everything else — traded student to
            student, handed over on campus.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            
              href="/listings"
              className="text-[11px] uppercase tracking-[0.22em] text-white px-8 py-4 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: RED }}
            >
              Browse listings
            </a>
            
              href="/sell"
              className="text-[11px] uppercase tracking-[0.22em] px-8 py-4 hover:text-white transition-colors"
              style={{ border: `1px solid ${INK}` }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = INK }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              Post an item
            </a>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-5">
        <div className="max-w-6xl mx-auto">
          <DoubleRule />
          <div className="flex flex-wrap justify-center gap-x-7 gap-y-3 py-5">
            {['All', 'Textbooks', 'Clothing', 'Electronics', 'Furniture', 'School Supplies', 'Miscellaneous'].map(cat => (
              
                key={cat}
                href={`/listings?category=${cat}`}
                className="text-[10px] uppercase tracking-[0.2em] hover:opacity-100 transition-opacity"
                style={{ color: MUTED }}
                onMouseEnter={e => { e.currentTarget.style.color = RED }}
                onMouseLeave={e => { e.currentTarget.style.color = MUTED }}
              >
                {cat}
              </a>
            ))}
          </div>
          <DoubleRule />
        </div>
      </section>

      {/* LISTINGS */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: MUTED }}>
              On the floor
            </p>
            <h2 style={DISPLAY} className="text-3xl sm:text-4xl mt-2">Recent listings</h2>
          </div>
          
            href="/listings"
            className="text-[10px] uppercase tracking-[0.22em] pb-1"
            style={{ color: RED, borderBottom: `1px solid ${RED}` }}
          >
            See all
          </a>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-20" style={{ border: `1px solid ${RULE}` }}>
            <div className="flex justify-center mb-5">
              <Ziggurat color={RULE} />
            </div>
            <p style={DISPLAY} className="text-2xl">Nothing listed yet</p>
            <p className="mt-2 text-sm font-light" style={{ color: MUTED }}>
              Be the first to put something up.
            </p>
            
              href="/sell"
              className="inline-block mt-7 text-[11px] uppercase tracking-[0.22em] text-white px-7 py-3.5"
              style={{ backgroundColor: RED }}
            >
              Post an item
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
            {listings.map(listing => {
              const imageUrls = Array.isArray(listing.image_urls) ? listing.image_urls : []
              return (
                
                  key={listing.id}
                  href={`/listing/${listing.slug}`}
                  className="group block"
                >
                  <div className="aspect-[4/3] overflow-hidden" style={{ backgroundColor: BLUSH }}>
                    {imageUrls.length > 0 ? (
                      <img
                        src={imageUrls[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Ziggurat color="#E4C9CC" />
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    <p className="text-[9px] uppercase tracking-[0.24em]" style={{ color: MUTED }}>
                      {listing.category}
                    </p>
                    <h3 style={DISPLAY} className="mt-1.5 text-base sm:text-lg leading-snug line-clamp-2">
                      {listing.title}
                    </h3>
                    <div
                      className="mt-3 pt-3 flex items-baseline justify-between"
                      style={{ borderTop: `1px solid ${RULE}` }}
                    >
                      <span style={{ ...DISPLAY, color: RED }} className="text-2xl">
                        ${listing.price}
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
                        {listing.condition}
                      </span>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </section>

      {/* HOW IT WORKS — red band */}
      <section className="px-5 py-20" style={{ backgroundColor: RED }}>
        <div className="max-w-5xl mx-auto text-white">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] opacity-70">Four steps</p>
            <h2 style={DISPLAY} className="text-3xl sm:text-4xl mt-2">How selling works</h2>
            <div className="flex justify-center mt-6">
              <Ziggurat color="#FFFFFF" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-14">
            {[
              ['I', 'Post your item', 'Add the details, a price, your contact info, and where you want to meet on campus.'],
              ['II', 'Get found', 'Your listing goes live after a quick review and shows up in browse and search.'],
              ['III', 'Meet on campus', 'Buyers reach out directly. Pick somewhere public — the library, the UC, Azrieli.'],
              ['IV', 'Mark it sold', 'Update the listing once it’s gone so the board stays current.'],
            ].map(([num, title, copy]) => (
              <div key={num} style={{ borderTop: '1px solid rgba(255,255,255,0.35)' }} className="pt-5">
                <span style={DISPLAY} className="text-3xl italic opacity-60">{num}</span>
                <h3 style={DISPLAY} className="text-xl mt-3">{title}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed opacity-80">{copy}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            
              href="/sell"
              className="inline-block text-[11px] uppercase tracking-[0.22em] px-9 py-4 bg-white"
              style={{ color: RED }}
            >
              Post an item
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="px-5 py-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: MUTED }}>
            About us
          </p>
          <h2 style={DISPLAY} className="text-3xl sm:text-4xl mt-2">
            Built by a student, for students
          </h2>

          <p className="mt-6 font-light leading-relaxed" style={{ color: '#4A4442' }}>
            Carleton Marketplace is a student-built platform created to help Carleton
            University students in Ottawa buy and sell textbooks, find housing, and
            connect with other students. Our goal is to simplify student transactions by
            providing a free, centralized marketplace tailored to the Carleton community.
          </p>

          <div className="mt-8 px-6 py-5" style={{ border: `1px solid ${RED}`, backgroundColor: BLUSH }}>
            <p className="text-[11px] uppercase tracking-[0.18em] leading-relaxed" style={{ color: RED }}>
              We are not associated in any way, shape, or form with Carleton University.
            </p>
          </div>

          <h3 style={DISPLAY} className="text-2xl mt-14">
            Marketplace for Carleton students in Ottawa
          </h3>
          <p className="mt-4 font-light leading-relaxed" style={{ color: '#4A4442' }}>
            This platform is designed for students at Carleton University looking to buy
            textbooks, sell used items, or find housing and sublets in Ottawa. By focusing
            on the Carleton community, listings remain relevant and easy to browse.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-5 pb-12">
        <div className="max-w-6xl mx-auto">
          <DoubleRule />
          <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-5">
            <a href="/" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="" width={26} height={26} />
              <span style={DISPLAY} className="text-sm">
                Carleton <span className="italic" style={{ color: RED }}>Marketplace</span>
              </span>
            </a>
            <div className="flex gap-7">
              <a href="/listings" className="text-[10px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>Browse</a>
              <a href="/sell" className="text-[10px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>Sell</a>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>
              © 2026 · Ottawa
            </span>
          </div>
        </div>
      </footer>

    </main>
  )
}