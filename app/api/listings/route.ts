import { supabase } from '../../../lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('approved', true)
      .eq('sold', false)
      .order('created_at', { ascending: false })

    if (error) throw error

    const listings = (data || []).map((listing: any) => ({
      ...listing,
      image_urls: Array.isArray(listing.image_urls)
        ? listing.image_urls
        : typeof listing.image_urls === 'string'
        ? JSON.parse(listing.image_urls.replace(/{/g, '[').replace(/}/g, ']'))
        : [],
    }))

    return Response.json({ success: true, listings })
  } catch (err) {
    return Response.json({ success: false, listings: [] })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const { error } = await supabase
      .from('listings')
      .insert([{
        title: body.title,
        slug,
        price: body.price,
        condition: body.condition,
        seller_name: body.sellerName,
        email: body.email,
        phone: body.phone || '',
        instagram: body.instagram || '',
        description: body.description,
        faculty: body.faculty || '',
        meeting_location: body.meetingLocation,
        category: body.category,
        approved: false,
        sold: false,
        image_urls: body.imageUrls || [],
      }])

    if (error) throw error

    return Response.json({ success: true, slug })
  } catch (err) {
    return Response.json({ success: false })
  }
}