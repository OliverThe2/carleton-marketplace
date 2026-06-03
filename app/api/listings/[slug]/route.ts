import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://alfheiknayazaferxpjl.supabase.co',
  'sb_publishable_QvAkXBNM5ZNZy862HyTIBA_608YXLkI'
)

function parseImages(value: any): string[] {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    // Try JSON first
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed
    } catch {
      // Postgres array format: {"url1","url2"}
      return value
        .replace(/^{|}$/g, '')
        .split(',')
        .map(s => s.replace(/^"|"$/g, '').trim())
        .filter(Boolean)
    }
  }
  return []
}

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params

  const { data } = await supabase.from('listings').select('*')

  const listing = (data || []).find((l: any) => l.slug === slug)

  if (!listing) return Response.json({ success: false, listing: null })

  return Response.json({
    success: true,
    listing: {
      ...listing,
      image_urls: parseImages(listing.image_urls)
    }
  })
}