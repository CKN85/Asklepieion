// Your Supabase project's public credentials.
//
// Both of these are MEANT to be public — they ship inside every website built
// on Supabase, and are visible to anyone who views your page source. They grant
// nothing on their own: what a visitor can actually read or write is decided
// server-side by the Row Level Security policies in supabase/schema.sql.
//
// The key you must NEVER put here (or anywhere in this repo) is the
// "service_role" key from the same settings page. That one bypasses every
// policy. Keep it out of the project entirely.
//
// Find these under: Supabase dashboard → Project Settings → API

export const SUPABASE_URL = "https://YOUR-PROJECT-ID.supabase.co";
export const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";
