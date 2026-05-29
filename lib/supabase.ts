import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://alfheiknayazaferxpjl.supabase.co'
const supabaseKey = 'sb_publishable_QvAkXBNM5ZNZy862HyTIBA_608YXLkI'

export const supabase = createClient(supabaseUrl, supabaseKey)
