import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://apnjsbqyiwlmymncgxeq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwbmpzYnF5aXdsbXltbmNneGVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM5MDQ3MDUsImV4cCI6MjAzOTQ4MDcwNX0.aduJXqU1p6vinlDR_SqbNTwCaJ6E95T5VtK9Ukkxro8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)