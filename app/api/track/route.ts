import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://alfheiknayazaferxpjl.supabase.co',
  'sb_publishable_QvAkXBNM5ZNZy862HyTIBA_608YXLkI'
)

export async function POST(request: Request) {
  try {
    const { slug, stat } = await request.json()
    if (!slug || (stat !== 'view' && stat !== 'contact')) {
      return Response.json({ success: false }, { status: 400 })
    }
    await supabase.rpc('bump_listing_stat', { listing_slug: slug, stat })
    return Response.json({ success: true })
  } catch {
    return Response.json({ success: false }, { status: 500 })
  }
}