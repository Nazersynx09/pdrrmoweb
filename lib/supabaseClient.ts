import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://khqcunmiuyrkflwjklwl.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_I2b24fHhJ367gkk3dUC0IQ_PoOU_hid";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);