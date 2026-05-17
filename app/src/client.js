import { createClient } from '@supabase/supabase-js'

const URL = import.meta.env.VITE_SUPABASE_URL
const API_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

const supabase = createClient(URL, API_KEY)

export const supabase = createClient(URL, API_KEY)
