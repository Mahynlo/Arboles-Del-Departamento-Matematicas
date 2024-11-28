import 'react-native-url-polyfill'
import { createClient } from '@supabase/supabase-js';
const config = {
    MAPBOX_ACCESS_TOKEN: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN
    SUPABASE_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  };
export default config;