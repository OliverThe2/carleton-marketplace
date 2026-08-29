import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://alfheiknayazaferxpjl.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || ''
)

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const expected = process.env.ADMIN_PASSWORD
    if (!expected || body.password !== expected) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (body.action === 'stats') {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

      const [listingsRes, eventsRes] = await Promise.all([
        supabase.from('listings').select('*').order('created_at', { ascending: false }),
        supabase.from('listing_events').select('created_at, slug, kind, referrer').gte('created_at', since).order('created_at', { ascending: false }).limit(5000),
      ])

      if (listingsRes.error) {
        return Response.json({ success: false, error: listingsRes.error.message }, { status: 500 })
      }

      return Response.json({
        success: true,
        listings: listingsRes.data || [],
        events: eventsRes.data || [],
      })
    }

    if (body.action === 'approve' || body.action === 'unapprove') {
      await supabase.from('listings').update({ approved: body.action === 'approve' }).eq('id', body.id)
      return Response.json({ success: true })
    }

    if (body.action === 'sold' || body.action === 'unsold') {
      await supabase.from('listings').update({ sold: body.action === 'sold' }).eq('id', body.id)
      return Response.json({ success: true })
    }

    if (body.action === 'delete') {
      await supabase.from('listings').delete().eq('id', body.id)
      return Response.json({ success: true })
    }

    return Response.json({ success: false, error: 'Unknown action' }, { status: 400 })
  } catch {
    return Response.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}