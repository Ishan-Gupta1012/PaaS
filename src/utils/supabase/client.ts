import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseEnv } from '@/utils/supabase/env'

export function createClient() {
  const env = getSupabaseEnv()

  if (!env) {
    throw new Error(
      'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local'
    )
  }

  return createBrowserClient(env.url, env.anonKey)
}
