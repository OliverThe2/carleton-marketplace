import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://alfheiknayazaferxpjl.supabase.co',
  'sb_publishable_QvAkXBNM5ZNZy862HyTIBA_608YXLkI'
)

const BASE_URL = 'https://carletonmarketplace.online'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/listings`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/sell`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Dynamic listing pages
  let listingPages: MetadataRoute.Sitemap = []
  try {
    const { data } = await supabase
      .from('listings')
      .select('slug, created_at')
      .eq('approved', true)
      .eq('sold', false)

    if (data) {
      listingPages = data.map((listing) => ({
        url: `${BASE_URL}/listing/${listing.slug}`,
        lastModified: new Date(listing.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    }
  } catch (err) {
    // If the fetch fails, still return static pages
  }

  return [...staticPages, ...listingPages]
}