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

type Event = {
  created_at: string
  slug: string
  kind: string
  referrer: string | null
}

function sourceName(ref: string | null) {
  if (!ref) return 'Direct / unknown'
  try {
    const host = new URL(ref).hostname.replace(/^www\./, '')
    if (host.includes('carletonmarketplace')) return 'Within your site'
    if (host.includes('google')) return 'Google search'
    if (host.includes('instagram')) return 'Instagram'
    if (host.includes('reddit')) return 'Reddit'
    if (host.includes('facebook') || host.includes('fb.')) return 'Facebook'
    if (host.includes('snapchat')) return 'Snapchat'
    if (host.includes('t.co') || host.includes('twitter') || host.includes('x.com')) return 'X / Twitter'
    return host
  } catch {
    return 'Direct / unknown'
  }
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [error, setError] = useState('')
  const [listings, setListings] = useState<Listing[]>([])
  const [events, setEvents] = useState<Event[]>([])
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
      setEvents(data.events || [])
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
  const convRate = totalViews > 0 ? Math.round((totalContacts / totalViews) * 100) : 0

  // Last 14 days
  const days: { label: string; views: number; contacts: number }[] = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - i)
    const next = new Date(d)
    next.setDate(next.getDate() + 1)
    const inDay = events.filter(e => {
      const t = new Date(e.created_at)
      return t >= d && t < next
    })
    days.push({
      label: d.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }),
      views: inDay.filter(e => e.kind === 'view').length,
      contacts: inDay.filter(e => e.kind === 'contact').length,
    })
  }
  const maxDay = Math.max(1, ...days.map(d => d.views))

  // Traffic sources
  const sourceCounts: Record<string, number> = {}
  events.filter(e => e.kind === 'view').forEach(e => {
    const name = sourceName(e.referrer)
    sourceCounts[name] = (sourceCounts[name] || 0) + 1
  })
  const sources = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])
  const maxSource = Math.max(1, ...sources.map(s => s[1]))

  // Category performance
  const catCounts: Record<string, { listings: number; views: number; contacts: number }> = {}
  listings.forEach(l => {
    const c = l.category || 'Uncategorized'
    if (!catCounts[c]) catCounts[c] = { listings: 0, views: 0, contacts: 0 }
    catCounts[c].listings++
    catCounts[c].views += l.views || 0
    catCounts[c].contacts += l.contacts || 0
  })
  const categories = Object.entries(catCounts).sort((a, b) => b[1].views - a[1].views)

  const shown = tab === 'pending' ? pending : tab === 'live' ? live : sold
  const ordered = tab === 'live'
    ? [...shown].sort((a, b) => (b.contacts || 0) - (a.contacts || 0) || (b.views || 0) - (a.views || 0))
    : shown

  const Stat = ({ label, value, help, accent }: { label: string; value: string | number; help: string; accent?: boolean }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-extrabold ${accent ? 'text-red-600' : 'text-gray-900'}`}>{value}</p>
      <p className="text-[11px] text-gray-400 leading-snug mt-1">{help}</p>
    </div>
  )

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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <Stat label="Live" value={live.length} help="Listings students can see right now." />
          <Stat label="Pending" value={pending.length} help="Waiting for you to approve. Nobody can see these yet." accent />
          <Stat label="Sold" value={sold.length} help="Marked sold and hidden from the site." />
          <Stat label="Views" value={totalViews} help="Times a listing page has been opened, all time." />
          <Stat label="Contacts" value={totalContacts} help="Times someone clicked email, text or Instagram on a listing." />
          <Stat label="Interest rate" value={`${convRate}%`} help="Share of views that turned into a contact click. Higher is better." />
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
          <h2 className="font-bold text-gray-900">Activity — last 14 days</h2>
          <p className="text-xs text-gray-500 mb-5">Each bar is one day. Tall bars mean people were browsing listings that day. The red number underneath is how many of those turned into a contact click.</p>
          <div className="flex items-end gap-1 h-32">
            {days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-[10px] text-gray-400 mb-1">{d.views || ''}</span>
                <div className="w-full bg-gray-900 rounded-t" style={{ height: `${(d.views / maxDay) * 100}%`, minHeight: d.views > 0 ? '3px' : '0' }} />
              </div>
            ))}
          </div>
          <div className="flex gap-1 mt-2">
            {days.map((d, i) => (
              <div key={i} className="flex-1 text-center">
                <p className="text-[10px] text-red-600 font-semibold">{d.contacts || ''}</p>
                <p className="text-[9px] text-gray-400">{d.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="font-bold text-gray-900">Where visitors came from</h2>
            <p className="text-xs text-gray-500 mb-4">The page someone was on right before they landed on a listing. &ldquo;Direct&rdquo; means they typed the address, used a bookmark, or came from an app that hides this.</p>
            {sources.length === 0 ? (
              <p className="text-sm text-gray-400">No data yet.</p>
            ) : (
              <div className="space-y-2">
                {sources.map(([name, count]) => (
                  <div key={name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700">{name}</span>
                      <span className="text-gray-400">{count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 rounded-full" style={{ width: `${(count / maxSource) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="font-bold text-gray-900">Categories</h2>
            <p className="text-xs text-gray-500 mb-4">Which kinds of items get looked at. If a category has lots of listings but few views, students aren&rsquo;t looking for it.</p>
            {categories.length === 0 ? (
              <p className="text-sm text-gray-400">No data yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wide text-gray-400 text-left">
                    <th className="pb-2 font-medium">Category</th>
                    <th className="pb-2 font-medium text-right">Items</th>
                    <th className="pb-2 font-medium text-right">Views</th>
                    <th className="pb-2 font-medium text-right">Contacts</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(([name, c]) => (
                    <tr key={name} className="border-t border-gray-100">
                      <td className="py-2 text-gray-700">{name}</td>
                      <td className="py-2 text-right text-gray-500">{c.listings}</td>
                      <td className="py-2 text-right text-gray-900 font-semibold">{c.views}</td>
                      <td className="py-2 text-right text-red-600 font-semibold">{c.contacts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8">
          <h2 className="font-bold text-gray-900">Whole-site traffic</h2>
          <p className="text-xs text-gray-500 mb-3">The numbers above only count listing pages. For homepage visits, browse-page traffic, devices and countries, use Vercel Analytics — it tracks every page.</p>
          <a href="https://vercel.com/dashboard" target="_blank" className="text-sm text-red-600 font-semibold hover:underline">Open Vercel Analytics →</a>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab('pending')} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === 'pending' ? 'bg-red-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>Pending ({pending.length})</button>
          <button onClick={() => setTab('live')} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === 'live' ? 'bg-red-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>Live ({live.length})</button>
          <button onClick={() => setTab('sold')} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === 'sold' ? 'bg-red-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>Sold ({sold.length})</button>
        </div>

        {tab === 'live' && <p className="text-xs text-gray-500 mb-3">Sorted by contact clicks — the listings students actually want are at the top.</p>}

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