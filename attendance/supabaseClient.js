import {createClient} from '@supabase/supabase-js'

const supabaseUrl = 'https://ubtgylbwwffsjxlnmxdu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVidGd5bGJ3d2Zmc2p4bG5teGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MDQ0NTAsImV4cCI6MjA3MjM4MDQ1MH0.C6JRD6KnNI9W8g1tTVMgrrjm_Es074YKlcvxP808kYM'
export const supabase = createClient(supabaseUrl, supabaseKey)