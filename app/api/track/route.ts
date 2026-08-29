import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://alfheiknayazaferxpjl.supabase.co',
  'sb_publishable_QvAkXBNM5ZNZy862HyTIBA_608YXLkI'
)

export async function POST(request: Request) {
  try {
    const { slug, stat, referrer } = await request.json()
    if (!slug || (stat !== 'view' && stat !== 'contact')) {
      return Response.json({ success: false }, { status: 400 })
    }
    await supabase.rpc('bump_listing_stat', {
      listing_slug: slug,
      stat,
      ref: typeof referrer === 'string' ? referrer.slice(0, 300) : null,
    })
    return Response.json({ success: true })
  } catch {
    return Response.json({ success: false }, { status: 500 })
  }
}