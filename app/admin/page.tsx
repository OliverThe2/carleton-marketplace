'use client'

import { useEffect, useState, useCallback } from 'react'

type Listing = {
  id: string
  title: string
  slug: string
  price: string
  category: string
  condition: string
  seller_name: string
  email: string
  phone: string
  created_at: string
  approved: boolean
  sold: boolean
  views: number
  contacts: number
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [error, setError] = useState('')
  const [listings, setListings] = useState<Listing[]>([])
  const [busy, setBusy] = useState(false)
  const [tab, setTab] = useState<'pending' | 'live' | 'sold'>('pending')

  const load = useCallback(async (pw: string) => {
    const res = await fetch('/api/admin', {
      method: 'POST',
      body: JSON.stringify({ password: pw, action: 'stats' }),
    })
    if (res.status === 401) {
      setError('Wrong password.')
      setAuthed(false)
      sessionStorage.removeItem('cm_admin')
      return
    }
    const data = await res.json()
    if (data.success) {
      setListings(data.listings)
      setAuthed(true)
      setError('')
      sessionStorage.setItem('cm_admin', pw)
    }
  }, [])

  useEffect(() => {
    const saved = sessionStorage.getItem('cm_admin')
    if (saved) {
      setPassword(saved)
      load(saved)
    }
  }, [load])

  useEffect(() => {
    if (!authed) return
    const id = setInterval(() => load(password), 15000)
    return () => clearInterval(id)
  }, [authed, password, load])

  const act = async (listingId: string, action: string) => {
    setBusy(true)
    await fetch('/api/admin', {
      method: 'POST',
      body: JSON.stringify({ password, action, id: listingId }),
    })
    await load(password)
    setBusy(false)
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-sm w-full">
          <h1 className="text-xl font-extrabold text-gray-900 mb-1 tracking-tight">Admin</h1>
          <p className="text-sm text-gray-500 mb-5">Enter the admin password.</p>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') load(password) }} placeholder="Password" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 mb-3" />
          {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
          <button onClick={() => load(password)} className="w-full bg-red-600 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-red-700 transition">Sign in</button>
        </div>
      </main>
    )
  }

  const pending = listings.filter(l => !l.approved && !l.sold)
  const live = listings.filter(l => l.approved && !l.sold)
  const sold = listings.filter(l => l.sold)

  const totalViews = listings.reduce((s, l) => s + (l.views || 0), 0)
  const totalContacts = listings.reduce((s, l) => s + (l.contacts || 0), 0)

  const shown = tab === 'pending' ? pending : tab === 'live' ? live : sold
  const ordered = tab === 'live'
    ? [...shown].sort((a, b) => (b.contacts || 0) - (a.contacts || 0) || (b.views || 0) - (a.views || 0))
    : shown

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <span className="font-extrabold text-gray-900 tracking-tight">Carleton <span className="text-red-600">Marketplace</span> · Admin</span>
        <div className="flex gap-3 items-center">
          <span className="text-xs text-gray-400">Auto-refreshes every 15s</span>
          <a href="/" className="text-sm text-gray-600 hover:text-gray-900">View site</a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Live</p>
            <p className="text-2xl font-extrabold text-gray-900">{live.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Pending</p>
            <p className="text-2xl font-extrabold text-red-600">{pending.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Sold</p>
            <p className="text-2xl font-extrabold text-gray-900">{sold.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Views</p>
            <p className="text-2xl font-extrabold text-gray-900">{totalViews}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Contacts</p>
            <p className="text-2xl font-extrabold text-gray-900">{totalContacts}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab('pending')} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === 'pending' ? 'bg-red-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>Pending ({pending.length})</button>
          <button onClick={() => setTab('live')} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === 'live' ? 'bg-red-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>Live ({live.length})</button>
          <button onClick={() => setTab('sold')} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === 'sold' ? 'bg-red-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>Sold ({sold.length})</button>
        </div>

        {ordered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-sm text-gray-500">Nothing here.</div>
        ) : (
          <div className="space-y-2">
            {ordered.map(l => (
              <div key={l.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 truncate">{l.title}</p>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{l.category}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">${l.price} · {l.seller_name} · {l.email}{l.phone ? ` · ${l.phone}` : ''}</p>
                </div>

                <div className="flex gap-5 text-center">
                  <div>
                    <p className="text-lg font-extrabold text-gray-900">{l.views || 0}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Views</p>
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-red-600">{l.contacts || 0}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Contacts</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a href={`/listing/${l.slug}`} target="_blank" className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50">View</a>
                  {!l.approved && <button disabled={busy} onClick={() => act(l.id, 'approve')} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-50">Approve</button>}
                  {l.approved && !l.sold && <button disabled={busy} onClick={() => act(l.id, 'unapprove')} className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-50">Unapprove</button>}
                  {!l.sold && <button disabled={busy} onClick={() => act(l.id, 'sold')} className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 disabled:opacity-50">Mark sold</button>}
                  {l.sold && <button disabled={busy} onClick={() => act(l.id, 'unsold')} className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-50">Relist</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}