import AlertBanner from "@/components/AlertBanner";
import { supabaseAdmin } from "@/lib/supabaseAdminClient";

export default async function HomeAlertBanner() {
  const { data, error } = await supabaseAdmin
    .from("advisories")
    .select("id, title, severity, valid_from, valid_until")
    .eq("is_active", true)
    .gt("valid_until", new Date().toISOString())
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch homepage advisories:", error);
    return <AlertBanner />;
  }

  return <AlertBanner initialAlerts={data || []} />;
}
