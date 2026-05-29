import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://alfheiknayazaferxpjl.supabase.co',
  'sb_publishable_QvAkXBNM5ZNZy862HyTIBA_608YXLkI'
)

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
      image_urls: typeof listing.image_urls === 'string'
        ? JSON.parse(listing.image_urls)
        : listing.image_urls || []
    }
  })
}