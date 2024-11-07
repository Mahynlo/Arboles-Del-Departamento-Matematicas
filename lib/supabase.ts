import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://epwgsdpodmlcjqnjbtja.supabase.co';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;
console.log(`proof that this loads ${supabaseKey}`);


export const supabase = createClient(supabaseUrl, supabaseKey)