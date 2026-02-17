import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://asuriunizqkctjrmwusy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzdXJpdW5penFrY3Rqcm13dXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NDY1NTQsImV4cCI6MjA4NjUyMjU1NH0.6Tr-KHcLz6E23ttdoIo_ahLW1eP0XtSwopCCtdVTwzI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});
