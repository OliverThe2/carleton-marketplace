'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Listing = {
  id: string
  title: string
  slug: string
  price: string
  condition: string
  seller_name: string
  email: string
  phone: string
  instagram: string
  description: string
  faculty: string
  meeting_location: string
  category: string
  created_at: string
  approved: boolean
  sold: boolean
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

export default function ListingPage() {
  const params = useParams()
  const slug = params.slug as string
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    fetch(`/api/listings/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.listing) setListing(data.listing)
        else setNotFound(true)
        setLoading(false)
      })
      .catch(() => {
        setNotFound(true)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading listing...</p>
      </main>
    )
  }

  if (notFound || !listing) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-gray-500 text-sm mb-4">Listing not found or has been removed.</p>
          <a href="/listings" className="bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-red-700">Back to listings</a>
        </div>
      </main>
    )
  }

  const imageUrls = Array.isArray(listing.image_urls) ? listing.image_urls : []
  const hasImages = imageUrls.length > 0

  return (
    <main className="min-h-screen bg-gray-50">

      {/* NAV */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Carleton Marketplace" width={44} height={44} className="rounded-lg" />
          <span className="font-black text-gray-900 text-lg hidden sm:block">Carleton <span className="text-red-600">Marketplace</span></span>
        </a>
        <div className="flex gap-2 items-center">
          <a href="/listings" className="text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100">← Back</a>
          <a href="/sell" className="bg-red-600 text-white text-sm px-4 py-2 rounded-xl font-semibold hover:bg-red-700 transition">+ Sell Item</a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div>
            {hasImages ? (
              <div className="space-y-3">
                <img
                  src={imageUrls[activeImage]}
                  alt={listing.title}
                  className="w-full aspect-square object-cover rounded-2xl border border-gray-200"
                />
                {imageUrls.length > 1 && (
                  <div className="flex gap-2">
                    {imageUrls.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={listing.title}
                        onClick={() => setActiveImage(i)}
                        className={`w-16 h-16 object-cover rounded-lg border-2 cursor-pointer transition ${activeImage === i ? 'border-red-500' : 'border-gray-200'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl aspect-square flex items-center justify-center text-8xl">
                🏷️
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">{listing.category}</span>
              <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">{listing.condition}</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">{listing.title}</h1>
            <p className="text-3xl font-black text-red-600 mb-4">${listing.price}</p>
            <p className="text-xs text-gray-400 mb-6">Listed {timeAgo(listing.created_at)}</p>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{listing.description}</p>
            </div>

            {listing.faculty && (
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Course</p>
                <p className="text-sm text-gray-700">{listing.faculty}</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Meeting location</p>
              <p className="text-sm text-gray-700">📍 {listing.meeting_location}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Seller</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-black text-sm">
                  {listing.seller_name.charAt(0).toUpperCase()}
                </div>
                <p className="font-semibold text-gray-900">{listing.seller_name}</p>
              </div>
              <div className="space-y-2">
                {listing.email && (
                  <a href={`mailto:${listing.email}`} className="flex items-center gap-2 w-full bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition">
                    ✉️ Email seller
                  </a>
                )}
                {listing.phone && (
                  <a href={`sms:${listing.phone}`} className="flex items-center gap-2 w-full bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">
                    💬 Text seller
                  </a>
                )}
                {listing.instagram && (
                  <a href={`https://instagram.com/${listing.instagram.replace('@', '')}`} target="_blank" className="flex items-center gap-2 w-full bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">
                    📸 Instagram: {listing.instagram}
                  </a>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-400 text-center">Always meet in a public place on campus. Never send payment before seeing the item.</p>
          </div>

        </div>
      </div>
    </main>
  )
}