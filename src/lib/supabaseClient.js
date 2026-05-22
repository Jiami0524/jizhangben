import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rusjyvcrwmgipkebqbzx.supabase.co'
const supabaseAnonKey = 'sb_publishable_fwSr_SqiAypJXVB-3mzbww_dAT9BXZP'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
